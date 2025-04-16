
import { useState, useRef } from "react";
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  
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
  
  if (locationPromptVisible) {
    return (
      <div className="max-w-lg mx-auto">
        <LocationDetection onComplete={handleLocationDetected} />
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-4 mt-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search events..."
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
          onClick={onShowFilterSheet}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 p-1 rounded-full">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All</TabsTrigger>
          <TabsTrigger value="joined" className="rounded-full data-[state=active]:bg-white">Joined</TabsTrigger>
          <TabsTrigger value="created" className="rounded-full data-[state=active]:bg-white">Created</TabsTrigger>
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
                activeTab === "created" ? "Your Created Events" :
                "Events Near You"
              }
              showMap={showMapView}
              onToggleMap={activeTab === "nearby" ? toggleMapView : undefined}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EventTabView;
