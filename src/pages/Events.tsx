
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { RefreshCw, Filter, Search, Plus, MapPin, Calendar, Users, Home, MessageSquare } from "lucide-react";
import { Event, Group, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for the main view mode
  const [viewMode, setViewMode] = useState<"list" | "discover" | "groups">("list");
  
  // Detail view states
  const isDetailView = !!id;
  const [detailType, setDetailType] = useState<"event" | "group">("event");
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [filterOnlyNearby, setFilterOnlyNearby] = useState(false);
  
  // State for discover/swipe mode
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [swipeEvents, setSwipeEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationDetected, setLocationDetected] = useState(!!user?.location);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  
  // Type assertions for mock data
  const typedMockEvents = MOCK_EVENTS as Event[];
  const typedMockGroups = MOCK_GROUPS as Group[];
  
  // Find the current event or group if we're on the detail page
  const currentEvent = isDetailView && detailType === "event"
    ? typedMockEvents.find((event) => event.id === id) as Event || null
    : null;
    
  const currentGroup = isDetailView && detailType === "group"
    ? typedMockGroups.find((group) => group.id === id) as Group || null
    : null;
  
  // Get attendees or members for the current event or group
  const attendees = currentEvent
    ? MOCK_USERS.filter((user) => currentEvent.attendees.includes(user.id)) as User[]
    : [];
    
  const members = currentGroup
    ? MOCK_USERS.filter((user) => currentGroup.members.includes(user.id)) as User[]
    : [];
  
  // Filter events based on search term and active tab
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
  
  // Filter groups based on search term and active tab
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
    
    // Also include public groups in "all" tab
    return matchesSearch && (matchesTab || (!group.isPrivate && activeTab === "all"));
  });
  
  // Determine if looking at event or group when on detail page
  useEffect(() => {
    if (id) {
      const isEvent = typedMockEvents.some(event => event.id === id);
      setDetailType(isEvent ? "event" : "group");
    }
  }, [id]);
  
  // Load events for discover/swipe mode
  useEffect(() => {
    if (viewMode === "discover") {
      loadEvents();
    }
  }, [viewMode, user, locationDetected, filterOnlyNearby]);
  
  // Load events for discover/swipe mode
  const loadEvents = () => {
    setIsLoading(true);
    // Simulate API delay for filtering events
    setTimeout(() => {
      let filteredEvents = [...typedMockEvents];
      
      // Filter by user interests if available
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
      
      // Further filter by location if user has location and filter is enabled
      if (user?.location && filterOnlyNearby) {
        // For demo purposes, just match city names
        filteredEvents = filteredEvents.filter(event => 
          event.location.city === user.location.city
        );
      }
      
      // Randomize the order slightly to add variety
      filteredEvents = [...filteredEvents].sort(() => 0.5 - Math.random());
      
      setSwipeEvents(filteredEvents);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 800);
  };
  
  // Handle location detection
  const handleLocationDetected = () => {
    setLocationDetected(true);
    setLocationPromptVisible(false);
    setShowLocationPrompt(false);
    loadEvents();
  };
  
  // Handle swipe in discover mode
  const handleSwipe = (direction: "left" | "right", event: Event) => {
    // Move to the next card
    setCurrentIndex(prevIndex => prevIndex + 1);
    
    // If swiped right (liked), add to liked events
    if (direction === "right") {
      setLikedEvents(prev => [...prev, event.id]);
      toast({
        title: "Event liked!",
        description: `You liked "${event.title}"`,
      });
    }
  };
  
  // Reset cards in discover mode
  const resetCards = () => {
    setCurrentIndex(0);
    // Refresh events list
    loadEvents();
    toast({
      title: "Events refreshed",
      description: "We've found some new events for you to explore",
    });
  };
  
  // Check if location prompt should be shown for nearby events
  useEffect(() => {
    if (activeTab === "nearby" && !user?.location && viewMode === "list") {
      setLocationPromptVisible(true);
    } else {
      setLocationPromptVisible(false);
    }
  }, [activeTab, user?.location, viewMode]);
  
  // Determine if we have cards to show in discover mode
  const hasCards = currentIndex < swipeEvents.length;
  
  // Render location detection prompt
  if ((locationPromptVisible && viewMode === "list") || (showLocationPrompt && viewMode === "discover")) {
    return (
      <div className="renaissance-container py-8">
        <div className="max-w-lg mx-auto">
          <LocationDetection onComplete={handleLocationDetected} />
        </div>
      </div>
    );
  }
  
  // Render detail view
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
  
  return (
    <div className="min-h-screen pb-20">
      <div className="pt-4 px-4">
        {/* Top Tab Navigation */}
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
        
        {/* Location Badge */}
        {user?.location && (
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="flex items-center gap-1 px-4 py-2 rounded-full border-gray-300">
              <MapPin className="h-4 w-4" />
              {user.location.city || "Current location"}
            </Badge>
          </div>
        )}
        
        {/* Filter Button - Top right */}
        <div className="absolute top-4 right-4">
          <Sheet>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter</SheetTitle>
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
            </Button>
          </Sheet>
          
          {/* Create Button */}
          <Button className="ml-2 rounded-full" onClick={() => viewMode === "groups" ? setShowCreateDialog(true) : navigate("/events/create")}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search Bar */}
        {viewMode !== "discover" && (
          <div className="relative mb-4 mt-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={`Search ${viewMode === "groups" ? "groups" : "events"}...`}
              className="pl-10 py-6 rounded-xl bg-gray-50 border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        
        {/* Content based on view mode */}
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
                <EventList 
                  events={filteredEvents} 
                  title={
                    activeTab === "all" ? "All Events" :
                    activeTab === "joined" ? "Your Events" :
                    activeTab === "upcoming" ? "Upcoming Events" :
                    "Events Near You"
                  }
                />
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
      </div>
      
      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around items-center">
          <a href="/" className="flex flex-col items-center p-2 text-gray-500 hover:text-black">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="/events" className="flex flex-col items-center p-2 text-black">
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Events</span>
          </a>
          <a href="/chats" className="flex flex-col items-center p-2 text-gray-500 hover:text-black">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </a>
          <a href="/profile" className="flex flex-col items-center p-2 text-gray-500 hover:text-black">
            {user ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.name || "User"} />
                <AvatarFallback className="text-xs">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            )}
            <span className="text-xs mt-1">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Events;
