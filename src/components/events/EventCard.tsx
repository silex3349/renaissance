
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Bookmark, BookmarkPlus, ExternalLink, Coins } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string) => void;
  compact?: boolean;
}

const EventCard = ({ event, onJoin, compact }: EventCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balance } = useWallet();
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
  
  // Mock event join cost - in a real app this would come from the backend
  const joinCost = event.inGroup ? 10 : 25;
  const canAffordJoin = balance >= joinCost;
    
  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!canAffordJoin) {
      toast({
        title: "Insufficient coins",
        description: `You need ${joinCost} coins to join this event. Current balance: ${balance} coins.`,
        variant: "destructive"
      });
      return;
    }
    
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

  const defaultImages = [
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  ];
  
  const getBackgroundImage = () => {
    if (event.imageUrl) return event.imageUrl;
    const index = parseInt(event.id.replace(/\D/g, '')) % defaultImages.length;
    return defaultImages[index];
  };

  return (
    <div 
      className={`event-card rounded-lg overflow-hidden shadow-sm cursor-pointer ${compact ? 'mb-2' : 'mb-4'}`}
      onClick={goToEventDetails}
    >
      {compact ? (
        <div className="flex items-center space-x-4 p-3 bg-orange-100">
          <div className="flex-1">
            <h3 className="text-md font-semibold">{event.title}</h3>
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(new Date(event.dateTime))}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Coins className="h-3 w-3" />
              {joinCost}
            </Badge>
            <Button
              onClick={handleJoin}
              className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full ${!canAffordJoin ? 'opacity-70' : ''}`}
              disabled={isFullyBooked || isJoining || !canAffordJoin}
            >
              {isJoining ? "Joining..." : isFullyBooked ? "Fully Booked" : "Join"}
            </Button>
          </div>
        </div>
      ) : (
        <Card className="border-0">
          <div 
            className="h-48 w-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${getBackgroundImage()})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
            
            <div className="absolute top-4 left-4">
              <span className="bg-black/50 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
                {event.interests[0]?.name || "Event"}
              </span>
            </div>
            
            <button 
              className="absolute top-4 right-4 bg-gray-200/80 rounded-full p-2"
              onClick={toggleBookmark}
              aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            >
              {isBookmarked ? 
                <Bookmark className="h-5 w-5 text-gray-700" /> : 
                <BookmarkPlus className="h-5 w-5 text-gray-700" />
              }
            </button>
          </div>
          
          <CardContent className="p-4 bg-orange-100">
            <h3 className="text-xl font-bold mb-3">{event.title}</h3>
            
            <div className="space-y-2 mb-4">
              <button 
                className="flex items-center gap-2 w-full text-left hover:bg-orange-200/50 p-1 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Could open a calendar view or filter by this date
                  toast({
                    title: "Date selected",
                    description: `You selected ${formatDate(new Date(event.dateTime))}`
                  });
                }}
              >
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-gray-800">{formatDate(new Date(event.dateTime))}</div>
                  <div className="text-gray-500 text-sm">{timeUntil}</div>
                </div>
              </button>
              
              <button 
                className="flex items-center gap-2 w-full text-left hover:bg-orange-200/50 p-1 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Could open a map view or filter by this location
                  toast({
                    title: "Location selected",
                    description: `You selected ${event.location.city}`
                  });
                }}
              >
                <MapPin className="h-5 w-5 text-gray-600" />
                <div className="text-gray-800">{event.address || (event.location.city ? event.location.city : "Unknown location")}</div>
              </button>
              
              <button 
                className="flex items-center gap-2 w-full text-left hover:bg-orange-200/50 p-1 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Could open attendee list
                  navigate(`/events/${event.id}#attendees`);
                }}
              >
                <Users className="h-5 w-5 text-gray-600" />
                <div className="text-gray-800">
                  {event.attendees.length} attendees
                  {event.maxAttendees && ` / ${event.maxAttendees} spots`}
                </div>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                {joinCost} coins
              </Badge>
              
              <Button
                onClick={handleJoin}
                className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full ${!canAffordJoin ? 'opacity-70' : ''}`}
                disabled={isFullyBooked || isJoining || !canAffordJoin}
              >
                {isJoining ? "Joining..." : isFullyBooked ? "Fully Booked" : "Join Event"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventCard;
