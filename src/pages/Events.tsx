
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
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventList from "@/components/events/EventList";
import MapView from "@/components/events/MapView";
import FilterSheet from "@/components/events/FilterSheet";
import EventTabView from "@/components/events/EventTabView";
import ViewModeTabs from "@/components/events/ViewModeTabs";
import DiscoverView from "@/components/events/DiscoverView";

const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateEventSheet, setShowCreateEventSheet] = useState(false);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [filterOnlyNearby, setFilterOnlyNearby] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "discover" | "groups">("list");
  
  // Detail view state
  const isDetailView = !!id;
  const [detailType, setDetailType] = useState<"event" | "group">("event");
  
  // Mock data
  const typedMockEvents = MOCK_EVENTS as Event[];
  const typedMockGroups = MOCK_GROUPS as Group[];
  
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
  
  useEffect(() => {
    if (id) {
      const isEvent = typedMockEvents.some(event => event.id === id);
      setDetailType(isEvent ? "event" : "group");
    }
  }, [id]);
  
  const handleLocationDetected = () => {
    setLocationPromptVisible(false);
    setShowFilterSheet(false);
  };
  
  const handleCreateButtonClick = () => {
    setShowCreateEventSheet(true);
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
        <ViewModeTabs viewMode={viewMode} onChange={setViewMode} />
        
        {viewMode === "list" && (
          <EventTabView 
            events={typedMockEvents}
            onShowFilterSheet={() => setShowFilterSheet(true)}
          />
        )}
        
        {viewMode === "discover" && (
          <DiscoverView events={typedMockEvents} />
        )}
        
        {viewMode === "groups" && (
          <div>Group view content</div>
        )}
        
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
