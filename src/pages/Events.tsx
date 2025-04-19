
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_EVENTS, MOCK_GROUPS, MOCK_USERS } from "@/services/mockData";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import { Event, Group } from "@/types";
import CreateEventForm from "@/components/events/CreateEventForm";
import LocationDetection from "@/components/location/LocationDetection";
import FilterSheet from "@/components/events/FilterSheet";
import EventList from "@/components/events/EventList";
import EventDetailView from "@/components/events/EventDetailView";
import EventTabView from "@/components/events/EventTabView";

const Events = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  
  // State management
  const [showCreateEventSheet, setShowCreateEventSheet] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  
  // Get query parameters
  const searchParams = new URLSearchParams(location.search);
  const showFilter = searchParams.get('showFilter') === 'true';
  
  // Show filter sheet when showFilter is true in URL
  useEffect(() => {
    if (showFilter) {
      setShowFilterSheet(true);
    }
  }, [showFilter]);
  
  // Mock data
  const typedMockEvents = MOCK_EVENTS as Event[];
  const typedMockGroups = MOCK_GROUPS as Group[];
  
  const handleLocationDetected = () => {
    setLocationPromptVisible(false);
    setShowFilterSheet(false);
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
      <EventTabView
        events={typedMockEvents}
        onShowFilterSheet={() => setShowFilterSheet(true)}
      />
      
      <FilterSheet 
        open={showFilterSheet} 
        onOpenChange={setShowFilterSheet}
        filterOnlyNearby={false}
        onFilterChange={() => {}}
        onLocationDetected={handleLocationDetected}
      />
      
      <CreateGroupDialog
        open={false}
        onOpenChange={() => {}}
      />
    </div>
  );
};

export default Events;
