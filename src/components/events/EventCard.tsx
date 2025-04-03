
import { Event } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string) => void;
}

const EventCard = ({ event, onJoin }: EventCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };
  
  const timeUntil = formatDistanceToNow(new Date(event.dateTime), {
    addSuffix: true,
  });

  const isFullyBooked = event.maxAttendees 
    ? event.attendees.length >= event.maxAttendees 
    : false;

  return (
    <Card className="event-card h-full flex flex-col">
      <div 
        className="h-40 w-full bg-cover bg-center relative"
        style={{ 
          backgroundImage: event.imageUrl 
            ? `url(${event.imageUrl})` 
            : 'url(https://images.unsplash.com/photo-1528605248644-14dd04022da1)' 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex gap-2 text-white text-sm">
            {event.interests.slice(0, 2).map(interest => (
              <span key={interest.id} className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                {interest.name}
              </span>
            ))}
            {event.interests.length > 2 && (
              <span className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                +{event.interests.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <div>{formatDate(new Date(event.dateTime))}</div>
              <div className="text-muted-foreground text-xs">{timeUntil}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>{event.address}</div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Users className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              {event.attendees.length} attendees
              {event.maxAttendees && ` / ${event.maxAttendees} spots`}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={() => onJoin && onJoin(event.id)}
          className="w-full"
          disabled={isFullyBooked}
        >
          {isFullyBooked ? "Fully Booked" : "Join Event"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
