
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_EVENTS, MOCK_GROUPS, MOCK_USERS } from "@/services/mockData";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import { Event, Group } from "@/types";
import CreateEventForm from "@/components/events/CreateEventForm";
import LocationDetection from "@/components/location/LocationDetection";
import FilterSheet from "@/components/events/FilterSheet";
import EventTabView from "@/components/events/EventTabView";
import ViewModeTabs from "@/components/events/ViewModeTabs";
import DiscoverView from "@/components/events/DiscoverView";
import EventDetailView from "@/components/events/EventDetailView";
import CreateButton from "@/components/events/CreateButton";

const Events = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  // State management
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateEventSheet, setShowCreateEventSheet] = useState(false);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "discover" | "groups">("list");
  
  // Mock data
  const typedMockEvents = MOCK_EVENTS as Event[];
  const typedMockGroups = MOCK_GROUPS as Group[];
  
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
  
  if (id) {
    return (
      <EventDetailView 
        id={id}
        events={typedMockEvents}
        groups={typedMockGroups}
        users={MOCK_USERS}
      />
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
        
        <CreateButton 
          viewMode={viewMode}
          onClick={handleCreateButtonClick}
        />
        
        <FilterSheet 
          open={showFilterSheet} 
          onOpenChange={setShowFilterSheet}
          filterOnlyNearby={false}
          onFilterChange={() => {}}
          onLocationDetected={handleLocationDetected}
        />
        
        <CreateGroupDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </div>
  );
};

export default Events;
