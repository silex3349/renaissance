
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Bookmark, BookmarkPlus } from "lucide-react";
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
    <div 
      className="event-card rounded-lg overflow-hidden shadow-sm cursor-pointer"
      onClick={goToEventDetails}
    >
      <Card className="border-0">
        {/* Event Image with Category Label and Bookmark Button */}
        <div 
          className="h-48 w-full bg-cover bg-center relative"
          style={{ 
            backgroundImage: event.imageUrl 
              ? `url(${event.imageUrl})` 
              : 'url(https://images.unsplash.com/photo-1528605248644-14dd04022da1)' 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
          
          {/* Category Label */}
          <div className="absolute top-4 left-4">
            <span className="bg-black/50 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
              {event.interests[0]?.name || "Event"}
            </span>
          </div>
          
          {/* Bookmark Button */}
          <button 
            className="absolute top-4 right-4 bg-gray-200/80 rounded-full p-2"
            onClick={toggleBookmark}
          >
            {isBookmarked ? 
              <Bookmark className="h-5 w-5 text-gray-700" /> : 
              <BookmarkPlus className="h-5 w-5 text-gray-700" />
            }
          </button>
        </div>
        
        {/* Event Info */}
        <CardContent className="p-4 bg-orange-100">
          <h3 className="text-xl font-bold mb-3">{event.title}</h3>
          
          <div className="space-y-2 mb-4">
            {/* Date and Time */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-gray-800">{formatDate(new Date(event.dateTime))}</div>
                <div className="text-gray-500 text-sm">{timeUntil}</div>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div className="text-gray-800">{event.address || (event.location.city ? event.location.city : "Unknown location")}</div>
            </div>
            
            {/* Attendees */}
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <div className="text-gray-800">
                {event.attendees.length} attendees
                {event.maxAttendees && ` / ${event.maxAttendees} spots`}
              </div>
            </div>
          </div>
          
          {/* Join Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleJoin();
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            disabled={isFullyBooked || isJoining}
          >
            {isJoining ? "Joining..." : isFullyBooked ? "Fully Booked" : "Join Event"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCard;
