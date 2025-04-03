import React from "react";
import { useParams } from "react-router-dom";
import { MOCK_EVENTS, MOCK_USERS } from "@/services/mockData";
import EventDetail from "@/components/events/EventDetail";
import EventListView from "@/components/events/EventListView";

const Events = () => {
  const { id } = useParams();

  // If we have an ID parameter, we're on the event detail page
  // Otherwise, we show the event list
  const isDetailView = !!id;

  // Find the current event if we're on the detail page
  const currentEvent = isDetailView
    ? MOCK_EVENTS.find((event) => event.id === id)
    : null;

  // Get attendees for the current event
  const attendees = currentEvent
    ? MOCK_USERS.filter((user) => currentEvent.attendees.includes(user.id))
    : [];

  return (
    <div className="renaissance-container py-8">
      {isDetailView && currentEvent ? (
        <EventDetail event={currentEvent} attendees={attendees} />
      ) : (
        <EventListView events={MOCK_EVENTS} />
      )}
    </div>
  );
};

export default Events;
