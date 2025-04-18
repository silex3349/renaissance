
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_EVENTS, MOCK_GROUPS, MOCK_USERS } from "@/services/mockData";
import EventDetail from "@/components/events/EventDetail";
import GroupDetail from "@/components/groups/GroupDetail";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import { Event, Group, User } from "@/types";
import CreateEventForm from "@/components/events/CreateEventForm";
import LocationDetection from "@/components/location/LocationDetection";
import { MapPin, Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventList from "@/components/events/EventList";
import MapView from "@/components/events/MapView";
import FilterSheet from "@/components/events/FilterSheet";

const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateEventSheet, setShowCreateEventSheet] = useState(false);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [filterOnlyNearby, setFilterOnlyNearby] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  
  // Detail view state
  const isDetailView = !!id;
  const [detailType, setDetailType] = useState<"event" | "group">("event");
  
  // Mock data
  const typedMockEvents = MOCK_EVENTS as Event[];
  const typedMockGroups = MOCK_GROUPS as Group[];
  
  // Filter categories
  const filterCategories = [
    { id: "all", name: "All" },
    { id: "joined", name: "Joined" },
    { id: "created", name: "Created" },
    { id: "nearby", name: "Nearby" },
    { id: "upcoming", name: "Upcoming" },
    { id: "photography", name: "Photography" },
    { id: "music", name: "Music" },
    { id: "food", name: "Food" },
    { id: "outdoor", name: "Outdoor" },
  ];
  
  // Current detail
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
  
  // Filter events based on category and search term
  const filteredEvents = typedMockEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      filterCategory === "all" ||
      (filterCategory === "joined" && user?.joinedEvents?.includes(event.id)) ||
      (filterCategory === "created" && user?.id === event.creator) ||
      (filterCategory === "nearby" && user?.location && event.location.city === user.location.city) ||
      (filterCategory === "upcoming" && new Date(event.dateTime) > new Date()) ||
      // Filter by event interests matching category name
      event.interests.some(interest => interest.name.toLowerCase() === filterCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });
  
  useEffect(() => {
    if (id) {
      const isEvent = typedMockEvents.some(event => event.id === id);
      setDetailType(isEvent ? "event" : "group");
    }
  }, [id]);
  
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
    setLocationPromptVisible(false);
    setShowFilterSheet(false);
  };
  
  const handleCreateButtonClick = () => {
    setShowCreateEventSheet(true);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleMapView = () => {
    setShowMapView(!showMapView);
  };
  
  if (locationPromptVisible) {
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
      <div className="renaissance-container">
        {detailType === "event" && currentEvent ? (
          <EventDetail event={currentEvent} attendees={attendees} />
        ) : currentGroup ? (
          <GroupDetail group={currentGroup} members={members} />
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Not Found</h1>
            <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")}>Back to Events</Button>
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
        {/* Header section with location and search */}
        <div className="space-y-4 mb-6">
          {/* Location Bar */}
          <div 
            className="flex items-center justify-between"
            onClick={() => setLocationPromptVisible(true)}
          >
            <div className="flex items-center gap-2 text-lg font-medium">
              <h1 className="text-2xl font-bold">Events</h1>
              {user?.location && (
                <div className="inline-flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  <MapPin className="h-3 w-3" />
                  {user.location.city || "Current location"}
                </div>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search events..."
              className="pl-10 pr-12 py-6 rounded-xl bg-gray-50 border-gray-200"
              value={searchTerm}
              onChange={handleSearchChange}
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
          
          {/* Category Pills - Horizontally scrollable */}
          <div className="flex overflow-x-auto pb-2 no-scrollbar">
            <div className="flex space-x-2">
              {filterCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={filterCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-full whitespace-nowrap"
                  onClick={() => setFilterCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Event List or Map View */}
        <div className="mt-4">
          {showMapView ? (
            <MapView events={filteredEvents} />
          ) : (
            <EventList 
              events={filteredEvents} 
              title={
                filterCategory === "all" ? "All Events" :
                filterCategory === "joined" ? "Your Events" :
                filterCategory === "created" ? "Your Created Events" :
                filterCategory === "nearby" ? "Events Near You" :
                filterCategory === "upcoming" ? "Upcoming Events" :
                `${filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)} Events`
              }
              showMap={false}
              onToggleMap={toggleMapView}
            />
          )}
        </div>
        
        {/* Create Event Floating Action Button */}
        <Button 
          className="fixed right-4 bottom-20 rounded-full shadow-lg z-20 flex items-center gap-2"
          onClick={handleCreateButtonClick}
        >
          <Plus className="h-5 w-5" />
          Create Event
        </Button>
        
        {/* Filter Sheet */}
        <FilterSheet 
          open={showFilterSheet} 
          onOpenChange={setShowFilterSheet}
          filterOnlyNearby={filterOnlyNearby}
          onFilterChange={(checked) => {
            setFilterOnlyNearby(checked);
          }}
          onLocationDetected={handleLocationDetected}
        />
        
        {/* Create Group Dialog */}
        <CreateGroupDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </div>
  );
};

export default Events;
