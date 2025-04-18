import { Event } from "@/types";
import EventCard from "./EventCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EventListProps {
  events: Event[];
  title?: string;
  description?: string;
  showMap?: boolean;
  onToggleMap?: () => void;
  compact?: boolean;
  onJoinEvent?: (eventId: string) => void;
}

const EventList = ({ 
  events, 
  title = "All Events", 
  description,
  showMap,
  onToggleMap,
  compact = false,
  onJoinEvent
}: EventListProps) => {
  const { user } = useAuth();
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
    
    if (onJoinEvent) {
      onJoinEvent(eventId);
    } else {
      toast({
        title: "Event joined!",
        description: "You have successfully joined this event.",
      });
    }
    
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
      <div className="space-y-4">
        <h3 className="text-xl font-medium">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className={`grid grid-cols-1 gap-6 ${compact ? 'max-h-[calc(100vh-250px)] overflow-auto pb-4' : ''}`}>
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
