import { Event } from "@/types";
import EventCard from "./EventCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EventListProps {
  events: Event[];
  title?: string;
  compact?: boolean;
  showMap?: boolean;
  onShowFilterSheet?: () => void;
  onToggleMap?: () => void;
  onJoinEvent?: (eventId: string) => void;
}

const EventList = ({ 
  events,
  title,
  compact,
  showMap,
  onShowFilterSheet,
  onToggleMap,
  onJoinEvent,
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
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          {onToggleMap && (
            <button 
              onClick={onToggleMap}
              className="text-sm text-primary"
            >
              {showMap ? "Show List" : "Show Map"}
            </button>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            compact={compact}
            onJoin={handleJoinEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;
