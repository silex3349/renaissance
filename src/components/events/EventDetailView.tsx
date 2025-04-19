
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event, Group, User } from "@/types";
import { Button } from "@/components/ui/button";
import EventDetail from "@/components/events/EventDetail";
import GroupDetail from "@/components/groups/GroupDetail";

interface EventDetailViewProps {
  id: string;
  events: Event[];
  groups: Group[];
  users: User[];
}

const EventDetailView = ({ id, events, groups, users }: EventDetailViewProps) => {
  const navigate = useNavigate();
  const [detailType, setDetailType] = useState<"event" | "group">("event");
  
  const currentEvent = detailType === "event"
    ? events.find((event) => event.id === id) as Event || null
    : null;
    
  const currentGroup = detailType === "group"
    ? groups.find((group) => group.id === id) as Group || null
    : null;
  
  const attendees = currentEvent
    ? users.filter((user) => currentEvent.attendees.includes(user.id)) as User[]
    : [];
    
  const members = currentGroup
    ? users.filter((user) => currentGroup.members.includes(user.id)) as User[]
    : [];

  useEffect(() => {
    if (id) {
      const isEvent = events.some(event => event.id === id);
      setDetailType(isEvent ? "event" : "group");
    }
  }, [id, events]);

  if (!currentEvent && !currentGroup) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Not Found</h1>
        <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="renaissance-container">
      {detailType === "event" && currentEvent ? (
        <EventDetail event={currentEvent} attendees={attendees} />
      ) : currentGroup ? (
        <GroupDetail group={currentGroup} members={members} />
      ) : null}
    </div>
  );
};

export default EventDetailView;
