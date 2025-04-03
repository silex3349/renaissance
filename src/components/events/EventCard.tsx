
import { Event } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, BookmarkPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string) => void;
}

const EventCard = ({ event, onJoin }: EventCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  
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
    
  const handleJoin = () => {
    if (onJoin) {
      setIsJoining(true);
      // Simulate API delay
      setTimeout(() => {
        onJoin(event.id);
        setIsJoining(false);
      }, 500);
    }
  };
  
  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Event removed" : "Event bookmarked",
      description: isBookmarked 
        ? "Event removed from your bookmarks" 
        : "Event added to your bookmarks",
    });
  };
  
  const goToEventDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card 
      className="event-card h-full flex flex-col transition-all duration-200 hover:shadow-md cursor-pointer"
      onClick={goToEventDetails}
    >
      <div 
        className="h-40 w-full bg-cover bg-center relative"
        style={{ 
          backgroundImage: event.imageUrl 
            ? `url(${event.imageUrl})` 
            : 'url(https://images.unsplash.com/photo-1528605248644-14dd04022da1)' 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 hover:text-white"
            onClick={toggleBookmark}
          >
            <BookmarkPlus className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
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
            <div>{event.address || (event.location.city ? event.location.city : "Unknown location")}</div>
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
          onClick={(e) => {
            e.stopPropagation();
            handleJoin();
          }}
          className="w-full"
          disabled={isFullyBooked || isJoining}
        >
          {isJoining ? "Joining..." : isFullyBooked ? "Fully Booked" : "Join Event"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
