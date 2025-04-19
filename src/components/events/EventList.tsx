
import { Event } from "@/types";
import EventCard from "./EventCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EventListProps {
  events: Event[];
  onShowFilterSheet?: () => void;
}

const EventList = ({ 
  events,
  onShowFilterSheet,
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
    toast({
      title: "Event joined!",
      description: "You have successfully joined this event.",
    });
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
    <div className="grid grid-cols-1 gap-4">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onJoin={handleJoinEvent}
        />
      ))}
    </div>
  );
};

export default EventList;
