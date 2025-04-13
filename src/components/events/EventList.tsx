
import { Event } from "@/types";
import EventCard from "./EventCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventListProps {
  events: Event[];
  title?: string;
  description?: string;
  showMap?: boolean;
  onToggleMap?: () => void;
}

const EventList = ({ 
  events, 
  title = "Events", 
  description,
  showMap,
  onToggleMap 
}: EventListProps) => {
  const navigate = useNavigate();
  const { user, joinEvent } = useAuth();
  const { toast } = useToast();
  const [joiningEvent, setJoiningEvent] = useState<string | null>(null);

  const handleJoinEvent = (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join events.",
        variant: "destructive",
      });
      return;
    }

    setJoiningEvent(eventId);
    
    // Join the event
    joinEvent(eventId);
    
    // Show success toast
    toast({
      title: "Event joined!",
      description: "You have successfully joined this event.",
    });
    
    setJoiningEvent(null);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-6">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-medium">{title}</h3>
            
            {user?.location && title === "Events Near You" && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {user.location.city || "Current location"}
              </Badge>
            )}
          </div>
          
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        {/* Add Map toggle button for Nearby Events */}
        {title === "Events Near You" && onToggleMap && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={onToggleMap}
          >
            <MapPin className="h-4 w-4" />
            {showMap ? "List View" : "Map View"}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onJoin={handleJoinEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;
