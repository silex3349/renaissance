
import { Event } from "@/types";
import EventCard from "./EventCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EventListProps {
  events: Event[];
  title?: string;
  description?: string;
}

const EventList = ({ events, title = "Upcoming Events", description }: EventListProps) => {
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
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Event joined!",
        description: "You have successfully joined this event.",
      });
      setJoiningEvent(null);
    }, 1000);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-medium">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
