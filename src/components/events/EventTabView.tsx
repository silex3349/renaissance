
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Event } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import EventList from "@/components/events/EventList";
import MapView from "@/components/events/MapView";
import LocationDetection from "@/components/location/LocationDetection";

interface EventTabViewProps {
  events: Event[];
  onShowFilterSheet: () => void;
}

const EventTabView = ({ events, onShowFilterSheet }: EventTabViewProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  
  // Parse the filter from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get('filter');
    if (filter && ['all', 'joined', 'created'].includes(filter)) {
      setActiveTab(filter);
    }
  }, [location.search]);
  
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" &&
        user?.joinedEvents?.includes(event.id)) ||
      (activeTab === "created" &&
        user?.id === event.creator);
    return matchesSearch && matchesTab;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleMapView = () => {
    setShowMapView(!showMapView);
  };
  
  const handleLocationDetected = () => {
    setLocationPromptVisible(false);
  };
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/events?filter=${value}`, { replace: true });
  };
  
  if (locationPromptVisible) {
    return (
      <div className="max-w-lg mx-auto">
        <LocationDetection onComplete={handleLocationDetected} />
      </div>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 p-1 rounded-full">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All</TabsTrigger>
          <TabsTrigger value="joined" className="rounded-full data-[state=active]:bg-white">Joined</TabsTrigger>
          <TabsTrigger value="created" className="rounded-full data-[state=active]:bg-white">Created</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {showMapView ? (
            <MapView events={filteredEvents} />
          ) : (
            <EventList 
              events={filteredEvents} 
              title={
                activeTab === "all" ? "All Events" :
                activeTab === "joined" ? "Your Events" :
                activeTab === "created" ? "Your Created Events" :
                "Events Near You"
              }
              showMap={showMapView}
              onToggleMap={toggleMapView}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EventTabView;
