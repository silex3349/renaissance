
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Event } from "@/types";
import EventCard from "@/components/events/EventCard";

interface EventsTabProps {
  events: Event[];
  isUserMember: boolean;
}

const EventsTab = ({ events, isUserMember }: EventsTabProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Upcoming Events</h3>
      </div>
      
      {events.length > 0 ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No events yet</h3>
          <p className="text-muted-foreground">
            This group doesn't have any scheduled events.
          </p>
          {isUserMember && (
            <Button className="mt-4">Create Event</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsTab;
