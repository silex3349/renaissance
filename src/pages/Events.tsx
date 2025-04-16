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
import ViewModeTabs from "@/components/events/ViewModeTabs";
import LocationBadge from "@/components/events/LocationBadge";
import FilterSheet from "@/components/events/FilterSheet";
import EventTabView from "@/components/events/EventTabView";
import GroupTabView from "@/components/events/GroupTabView";
import DiscoverView from "@/components/events/DiscoverView";
import CreateButton from "@/components/events/CreateButton";

const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [viewMode, setViewMode] = useState<"list" | "discover" | "groups">("list");
  
  const isDetailView = !!id;
  const [detailType, setDetailType] = useState<"event" | "group">("event");
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateEventSheet, setShowCreateEventSheet] = useState(false);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [filterOnlyNearby, setFilterOnlyNearby] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  
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
    loadEvents();
  };
  
  const loadEvents = () => {
    // This function is now a placeholder since the actual loading 
    // is handled in the DiscoverView component
  };
  
  const handleCreateButtonClick = () => {
    if (viewMode === "groups") {
      setShowCreateDialog(true);
    } else {
      setShowCreateEventSheet(true);
    }
  };
  
  const handleViewModeChange = (newMode: "list" | "discover" | "groups") => {
    setViewMode(newMode);
  };
  
  if ((locationPromptVisible && viewMode === "list")) {
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
        <ViewModeTabs viewMode={viewMode} onChange={handleViewModeChange} />
        
        <LocationBadge user={user} />
        
        <FilterSheet 
          open={showFilterSheet} 
          onOpenChange={setShowFilterSheet}
          filterOnlyNearby={filterOnlyNearby}
          onFilterChange={(checked) => {
            setFilterOnlyNearby(checked);
          }}
          onLocationDetected={handleLocationDetected}
        />
        
        {viewMode === "list" && (
          <EventTabView 
            events={typedMockEvents} 
            onShowFilterSheet={() => setShowFilterSheet(true)} 
          />
        )}
        
        {viewMode === "groups" && (
          <GroupTabView 
            groups={typedMockGroups} 
            onShowFilterSheet={() => setShowFilterSheet(true)} 
          />
        )}
        
        {viewMode === "discover" && (
          <DiscoverView events={typedMockEvents} />
        )}
        
        <CreateGroupDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
        
        <CreateButton 
          viewMode={viewMode} 
          onClick={handleCreateButtonClick} 
        />
      </div>
    </div>
  );
};

export default Events;
