
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, MapPin } from "lucide-react";
import EventList from "@/components/events/EventList";
import LocationDetection from "@/components/location/LocationDetection";

interface EventListViewProps {
  events: Event[];
}

const EventListView = ({ events }: EventListViewProps) => {
  const { user, joinEvent } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);

  // Filter events based on search term and active tab
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" &&
        user?.joinedEvents.includes(event.id)) ||
      (activeTab === "upcoming" &&
        new Date(event.dateTime) > new Date()) ||
      (activeTab === "nearby" && 
        user?.location && event.location.city === user?.location.city);
    return matchesSearch && matchesTab;
  });

  // Check if we need to prompt for location
  React.useEffect(() => {
    if (activeTab === "nearby" && !user?.location) {
      setLocationPromptVisible(true);
    } else {
      setLocationPromptVisible(false);
    }
  }, [activeTab, user?.location]);

  const handleLocationDetected = () => {
    setLocationPromptVisible(false);
  };

  const handleJoinEvent = (eventId: string) => {
    if (joinEvent) {
      joinEvent(eventId);
      // Navigate to event detail page
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <div className="space-y-6">
      {locationPromptVisible ? (
        <div className="max-w-lg mx-auto">
          <LocationDetection onComplete={handleLocationDetected} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Discover Events</h1>
              {user?.location && (
                <div className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  <MapPin className="h-3 w-3" />
                  {user.location.city}
                </div>
              )}
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="joined">Joined</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 no-scrollbar">
              <EventList 
                events={filteredEvents} 
                title={
                  activeTab === "all" ? "All Events" :
                  activeTab === "joined" ? "Your Events" :
                  activeTab === "upcoming" ? "Upcoming Events" :
                  "Events Near You"
                }
                compact={true}
                onJoinEvent={handleJoinEvent}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default EventListView;
