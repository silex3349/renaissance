
import React from "react";
import { motion } from "framer-motion";
import { Event } from "@/types";
import { Calendar, MapPin, Users, BookmarkPlus, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface SwipeCardProps {
  event: Event;
  isActive?: boolean;
  onSwipe: (direction: "left" | "right", event: Event) => void;
}

const SwipeCard = ({ event, isActive = false, onSwipe }: SwipeCardProps) => {
  const navigate = useNavigate();
  
  // Format date for display
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
  
  // Default background images if none provided
  const defaultImages = [
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  ];
  
  // Use the event ID to consistently select an image from the array
  const getBackgroundImage = () => {
    if (event.imageUrl) return event.imageUrl;
    const index = parseInt(event.id.replace(/\D/g, '')) % defaultImages.length;
    return defaultImages[index];
  };

  // Navigate to event detail on click
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/events/${event.id}`);
  };

  return (
    <motion.div
      className={`absolute inset-0 bg-white rounded-xl overflow-hidden shadow-lg ${
        isActive ? "z-10" : "z-0 pointer-events-none"
      }`}
      initial={isActive ? { scale: 0.95, opacity: 0 } : { scale: 0.9, opacity: 0 }}
      animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
      exit={{ x: -300, opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = offset.x;
        if (Math.abs(swipe) > 100) {
          const direction = swipe > 0 ? "right" : "left";
          onSwipe(direction, event);
        }
      }}
    >
      <div className="flex flex-col h-full">
        {/* Event Image */}
        <div 
          className="relative h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImage()})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
          
          {/* Category Label */}
          <div className="absolute top-4 left-4">
            <span className="bg-black/50 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
              {event.interests[0]?.name || "Event"}
            </span>
          </div>
        </div>
        
        {/* Event Info */}
        <div className="flex-1 p-5 bg-orange-100">
          <h3 className="text-xl font-bold mb-3">{event.title}</h3>
          
          <div className="space-y-3 mb-4">
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
        </div>
        
        {/* Action Buttons */}
        <div className="bg-orange-100 p-4 border-t border-orange-200">
          <Button 
            onClick={handleViewDetails}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          >
            View Details
          </Button>
          <div className="mt-3 text-center text-xs text-gray-500">
            Swipe right to like, left to skip
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
