import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MOCK_EVENTS, MOCK_GROUPS, MOCK_USERS } from "@/services/mockData";
import EventDetail from "@/components/events/EventDetail";
import EventList from "@/components/events/EventList";
import GroupList from "@/components/groups/GroupList";
import GroupDetail from "@/components/groups/GroupDetail";
import SwipeCard from "@/components/matching/SwipeCard";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import LocationDetection from "@/components/location/LocationDetection";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Filter, Search, Plus, MapPin, Calendar, Users } from "lucide-react";
import { Event, Group, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/events/MapView";
import CreateEventForm from "@/components/events/CreateEventForm";

const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [viewMode, setViewMode] = useState<"list" | "discover" | "groups">("list");
  
  const isDetailView = !!id;
  const [detailType, setDetailType] = useState<"event" | "group">("event");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateEventSheet, setShowCreateEventSheet] = useState(false);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [filterOnlyNearby, setFilterOnlyNearby] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  
  const [showMapView, setShowMapView] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [swipeEvents, setSwipeEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationDetected, setLocationDetected] = useState(!!user?.location);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  
  const typedMockEvents = MOCK_EVENTS as Event[];
  const typedMockGroups = MOCK_GROUPS as Group[];
  
  const currentEvent = isDetailView && detailType === "event"
    ? typedMockEvents.find((event) => event.id === id) as Event || null
    : null;
    
  const currentGroup = isDetailView && detailType === "group"
    ? typedMockGroups.find((group) => group.id === id) as Group || null
    : null;
  
  const attendees = currentEvent
    ? MOCK_USERS.filter((user) => currentEvent.attendees.includes(user.id)) as User[]
    : [];
    
  const members = currentGroup
    ? MOCK_USERS.filter((user) => currentGroup.members.includes(user.id)) as User[]
    : [];
  
  const filteredEvents = typedMockEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" &&
        user?.joinedEvents?.includes(event.id)) ||
      (activeTab === "upcoming" &&
        new Date(event.dateTime) > new Date()) ||
      (activeTab === "nearby" && 
        user?.location && event.location.city === user?.location.city);
    return matchesSearch && matchesTab;
  });
  
  const filteredGroups = typedMockGroups.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "my-groups" &&
        user?.id && 
        group.members.includes(user.id)) ||
      (activeTab === "created" &&
        user?.id && 
        group.creator === user.id);
    
    return matchesSearch && (matchesTab || (!group.isPrivate && activeTab === "all"));
  });
  
  useEffect(() => {
    if (id) {
      const isEvent = typedMockEvents.some(event => event.id === id);
      setDetailType(isEvent ? "event" : "group");
    }
  }, [id]);
  
  useEffect(() => {
    if (viewMode === "discover") {
      loadEvents();
    }
  }, [viewMode, user, locationDetected, filterOnlyNearby]);
  
  const loadEvents = () => {
    setIsLoading(true);
    setTimeout(() => {
      let filteredEvents = [...typedMockEvents];
      
      if (user?.interests && user.interests.length > 0) {
        const interestFiltered = filteredEvents.filter(event => 
          event.interests.some(interest => 
            user.interests.some(userInterest => 
              userInterest.id === interest.id
            )
          )
        );
        
        if (interestFiltered.length >= 5) {
          filteredEvents = interestFiltered;
        }
      }
      
      if (user?.location && filterOnlyNearby) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.city === user.location.city
        );
      }
      
      filteredEvents = [...filteredEvents].sort(() => 0.5 - Math.random());
      
      setSwipeEvents(filteredEvents);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 800);
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleLocationDetected = () => {
    setLocationDetected(true);
    setLocationPromptVisible(false);
    setShowLocationPrompt(false);
    loadEvents();
  };
  
  const handleSwipe = (direction: "left" | "right", event: Event) => {
    setCurrentIndex(prevIndex => prevIndex + 1);
    
    if (direction === "right") {
      setLikedEvents(prev => [...prev, event.id]);
      toast({
        title: "Event liked!",
        description: `You liked "${event.title}"`,
      });
    }
  };
  
  const resetCards = () => {
    setCurrentIndex(0);
    loadEvents();
    toast({
      title: "Events refreshed",
      description: "We've found some new events for you to explore",
    });
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleMapView = () => {
    setShowMapView(!showMapView);
  };
  
  useEffect(() => {
    if (activeTab === "nearby" && !user?.location && viewMode === "list") {
      setLocationPromptVisible(true);
    } else {
      setLocationPromptVisible(false);
    }
  }, [activeTab, user?.location, viewMode]);
  
  const hasCards = currentIndex < swipeEvents.length;
  
  if ((locationPromptVisible && viewMode === "list") || (showLocationPrompt && viewMode === "discover")) {
    return (
      <div className="renaissance-container py-8">
        <div className="max-w-lg mx-auto">
          <LocationDetection onComplete={handleLocationDetected} />
        </div>
      </div>
    );
  }
  
  if (isDetailView) {
    return (
      <div className="renaissance-container py-8">
        {detailType === "event" && currentEvent ? (
          <EventDetail event={currentEvent} attendees={attendees} />
        ) : currentGroup ? (
          <GroupDetail group={currentGroup} members={members} />
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Not Found</h1>
            <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/events")}>Back to Events</Button>
          </div>
        )}
      </div>
    );
  }
  
  if (showCreateEventSheet) {
    return <CreateEventForm onClose={() => setShowCreateEventSheet(false)} />;
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="pt-4 px-4">
        <div className="bg-gray-100 rounded-full mb-4 p-1">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-transparent">
              <TabsTrigger value="list" className="rounded-full data-[state=active]:bg-white">
                <Calendar className="h-5 w-5 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="discover" className="rounded-full data-[state=active]:bg-white">
                <Search className="h-5 w-5 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="groups" className="rounded-full data-[state=active]:bg-white">
                <Users className="h-5 w-5 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {user?.location && (
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="flex items-center gap-1 px-4 py-2 rounded-full border-gray-300">
              <MapPin className="h-4 w-4" />
              {user.location.city || "Current location"}
            </Badge>
          </div>
        )}
        
        <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
              <SheetDescription>
                Customize your discovery experience
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="nearby-filter">Show only nearby</Label>
                  <p className="text-sm text-muted-foreground">
                    Filter items near your current location
                  </p>
                </div>
                <Switch 
                  id="nearby-filter" 
                  checked={filterOnlyNearby} 
                  onCheckedChange={(checked) => {
                    setFilterOnlyNearby(checked);
                    if (viewMode === "discover") loadEvents();
                  }} 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Update Your Location</Label>
                <LocationDetection onComplete={handleLocationDetected} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {viewMode !== "discover" && (
          <div className="relative mb-4 mt-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder={`Search ${viewMode === "groups" ? "groups" : "events"}...`}
              className="pl-10 pr-12 py-6 rounded-xl bg-gray-50 border-gray-200"
              value={searchTerm}
              onChange={handleSearch}
            />
            {!searchTerm && (
              <kbd className="absolute right-12 top-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                /
              </kbd>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 text-gray-500" 
              onClick={() => setShowFilterSheet(true)}
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {viewMode === "list" && (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4 mb-4 bg-gray-100 p-1 rounded-full">
                <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All</TabsTrigger>
                <TabsTrigger value="joined" className="rounded-full data-[state=active]:bg-white">Joined</TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-full data-[state=active]:bg-white">Upcoming</TabsTrigger>
                <TabsTrigger value="nearby" className="rounded-full data-[state=active]:bg-white">Nearby</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {activeTab === "nearby" && showMapView ? (
                  <MapView events={filteredEvents} />
                ) : (
                  <EventList 
                    events={filteredEvents} 
                    title={
                      activeTab === "all" ? "All Events" :
                      activeTab === "joined" ? "Your Events" :
                      activeTab === "upcoming" ? "Upcoming Events" :
                      "Events Near You"
                    }
                    showMap={showMapView}
                    onToggleMap={activeTab === "nearby" ? toggleMapView : undefined}
                  />
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {viewMode === "groups" && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 p-1 rounded-full">
              <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All Groups</TabsTrigger>
              <TabsTrigger value="my-groups" className="rounded-full data-[state=active]:bg-white">My Groups</TabsTrigger>
              <TabsTrigger value="created" className="rounded-full data-[state=active]:bg-white">Created</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <GroupList 
                groups={filteredGroups} 
                title={
                  activeTab === "all" ? "All Groups" :
                  activeTab === "my-groups" ? "My Groups" :
                  "Groups Created By Me"
                }
              />
            </TabsContent>
          </Tabs>
        )}
        
        {viewMode === "discover" && (
          <div className="relative h-[600px] w-full max-w-lg mx-auto">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-card rounded-xl">
                <div className="text-center">
                  <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Finding events for you...</p>
                </div>
              </div>
            ) : hasCards ? (
              <AnimatePresence>
                {swipeEvents.slice(currentIndex, currentIndex + 3).map((event, index) => (
                  <SwipeCard
                    key={event.id}
                    event={event}
                    onSwipe={handleSwipe}
                    isActive={index === 0}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-xl p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-semibold mb-2">No more events to show</h3>
                <p className="text-muted-foreground mb-6">
                  You've seen all the events matching your interests.
                  {likedEvents.length > 0 && ` You liked ${likedEvents.length} events.`}
                </p>
                
                <Button onClick={resetCards} className="rounded-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Find More Events
                </Button>
              </motion.div>
            )}
            
            {hasCards && !isLoading && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {swipeEvents.length - currentIndex} more events to discover
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm" onClick={resetCards} className="rounded-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  
                  {!user?.location && (
                    <Button size="sm" onClick={() => setShowLocationPrompt(true)} className="rounded-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      Add Location
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        <CreateGroupDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
        
        <Button 
          className="fixed right-4 bottom-20 rounded-full shadow-lg z-20 flex items-center gap-2"
          onClick={() => viewMode === "groups" ? setShowCreateDialog(true) : setShowCreateEventSheet(true)}
        >
          <Plus className="h-5 w-5" />
          {viewMode === "groups" ? "Create Group" : "Create Event"}
        </Button>
      </div>
    </div>
  );
};

export default Events;
