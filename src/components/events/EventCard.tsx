
import { Event } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, BookmarkPlus } from "lucide-react";
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

  // Determine card color based on event type or id (for demonstration)
  const getCardColor = () => {
    const colorIndex = parseInt(event.id.replace(/\D/g, ''), 10) % 5; // Extract numbers from id and mod 5
    const colors = ["card-salmon", "card-peach", "card-mint", "card-teal", "card-navy"];
    return colors[colorIndex];
  };

  return (
    <div 
      className="profile-card-stack cursor-pointer rounded-lg overflow-hidden shadow-sm"
      onClick={goToEventDetails}
    >
      <Card 
        className={`profile-card ${getCardColor()} flex flex-col transition-all duration-200 hover:shadow-lg h-full border-0`}
      >
        <div 
          className="h-48 w-full bg-cover bg-center relative"
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
              className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 hover:text-white rounded-full"
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
        
        <CardContent className="flex-grow space-y-3 py-0">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <div>{formatDate(new Date(event.dateTime))}</div>
              <div className="text-muted-foreground text-xs">{timeUntil}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>{event.address || (event.location.city ? event.location.city : "Unknown location")}</div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              {event.attendees.length} attendees
              {event.maxAttendees && ` / ${event.maxAttendees} spots`}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleJoin();
            }}
            className="w-full rounded-full"
            disabled={isFullyBooked || isJoining}
          >
            {isJoining ? "Joining..." : isFullyBooked ? "Fully Booked" : "Join Event"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventCard;
