
import { useState } from "react";
import { Heart, X, Info } from "lucide-react";
import { Event } from "@/types";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SwipeCardProps {
  event: Event;
  onSwipe: (direction: "left" | "right", event: Event) => void;
  isActive: boolean;
}

const SwipeCard = ({ event, onSwipe, isActive }: SwipeCardProps) => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exitX, setExitX] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right - like
      setExitX(window.innerWidth);
      setDirection("right");
      controls.start({ x: window.innerWidth, opacity: 0 });
      onSwipe("right", event);
    } else if (info.offset.x < -threshold) {
      // Swiped left - pass
      setExitX(-window.innerWidth);
      setDirection("left");
      controls.start({ x: -window.innerWidth, opacity: 0 });
      onSwipe("left", event);
    } else {
      // Not enough swipe distance, return to center
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleDrag = (_: any, info: PanInfo) => {
    // Calculate rotation based on drag distance
    const rotate = info.offset.x * 0.05;
    controls.start({ 
      x: info.offset.x, 
      rotate: rotate, 
      opacity: 1 - (Math.abs(info.offset.x) / (window.innerWidth / 2))
    });
  };

  const renderEventDate = () => {
    const date = new Date(event.dateTime);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/events/${event.id}`);
  };

  // Styles and animations for the swipe action buttons
  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    hover: { scale: 1, opacity: 1 }
  };

  return (
    <motion.div
      className={cn(
        "absolute top-0 left-0 right-0 h-full w-full cursor-grab active:cursor-grabbing",
        !isActive && "pointer-events-none"
      )}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      animate={controls}
      initial={{ x: 0, opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9, rotate: 0 }}
      exit={{ 
        x: exitX, 
        opacity: 0,
        transition: { duration: 0.2 }
      }}
      transition={{ type: "spring", damping: 50, stiffness: 500 }}
      style={{ zIndex: isActive ? 10 : 0 }}
    >
      <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-lg flex flex-col">
        {/* Event image */}
        <div className="relative h-3/5 bg-muted overflow-hidden">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/10">
              <span className="text-primary text-6xl opacity-40">⚡</span>
            </div>
          )}
          
          {/* Overlays for swipe directions */}
          <motion.div 
            className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: direction === "right" ? 0.7 : 0 }}
          >
            <Heart className="w-24 h-24 text-white" />
          </motion.div>
          
          <motion.div 
            className="absolute inset-0 bg-red-500/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: direction === "left" ? 0.7 : 0 }}
          >
            <X className="w-24 h-24 text-white" />
          </motion.div>
          
          {/* Floating event date */}
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="font-medium">{renderEventDate()}</span>
          </div>
        </div>
        
        {/* Event details */}
        <div className="p-5 flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-1 line-clamp-1">{event.title}</h2>
          
          <div className="text-sm text-muted-foreground mb-3 flex items-center">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {event.location.city || "Nearby"}
            </span>
            <span className="mx-2">•</span>
            <span>{event.attendees.length} attending</span>
          </div>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
          
          {/* Interest tags */}
          <div className="flex flex-wrap gap-1 mt-auto mb-4">
            {event.interests.slice(0, 3).map(interest => (
              <span 
                key={interest.id}
                className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
              >
                {interest.name}
              </span>
            ))}
            {event.interests.length > 3 && (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                +{event.interests.length - 3} more
              </span>
            )}
          </div>
          
          {/* Action button */}
          <button
            onClick={handleViewDetails}
            className="flex items-center justify-center gap-1 text-sm text-primary font-medium"
          >
            <Info className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
      
      {/* Swipe action buttons */}
      {isActive && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-10 pointer-events-none">
          <motion.button
            className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center pointer-events-auto"
            onClick={() => {
              controls.start({ 
                x: -window.innerWidth, 
                opacity: 0,
                transition: { duration: 0.3 }
              });
              setDirection("left");
              onSwipe("left", event);
            }}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 500 }}
          >
            <X className="w-8 h-8 text-red-500" />
          </motion.button>
          
          <motion.button
            className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center pointer-events-auto"
            onClick={() => {
              controls.start({ 
                x: window.innerWidth, 
                opacity: 0,
                transition: { duration: 0.3 }
              });
              setDirection("right");
              onSwipe("right", event);
              toast({
                title: "Event liked!",
                description: "This event has been added to your interests",
              });
            }}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 500 }}
          >
            <Heart className="w-8 h-8 text-green-500" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default SwipeCard;
