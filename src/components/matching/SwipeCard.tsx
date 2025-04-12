
import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Calendar, MapPin, Users, Clock, Heart } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Swipe threshold - if surpassed, it's considered a full swipe
const SWIPE_THRESHOLD = 100;

interface SwipeCardProps {
  event: Event;
  onSwipe: (direction: "left" | "right", event: Event) => void;
  isActive: boolean;
}

const SwipeCard = ({ event, onSwipe, isActive }: SwipeCardProps) => {
  const [swipedDirection, setSwipedDirection] = useState<"left" | "right" | null>(null);
  const x = useMotionValue(0);
  const { toast } = useToast();

  // Determine background color based on swipe direction
  const background = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    ["#FFDCDC", "#FFFFFF", "#D4FFD4"]
  );

  // Determine opacity of like/dislike icons based on swipe
  const opacity = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    [1, 0, 1]
  );

  // Determine rotation based on swipe distance
  const rotate = useTransform(
    x,
    [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
    [-15, 0, 15]
  );

  const handleSwipe = (direction: "left" | "right") => {
    setSwipedDirection(direction);
    onSwipe(direction, event);
    
    if (direction === "right") {
      toast({
        title: "Event bookmarked!",
        description: "You can view this event in your saved events.",
      });
    }
  };

  const dragConstraints = { left: -200, right: 200 };

  const handleDrag = (event: any, info: any) => {
    x.set(info.point.x);
  };

  const handleDragEnd = () => {
    if (x.get() < -SWIPE_THRESHOLD) {
      handleSwipe("left");
    } else if (x.get() > SWIPE_THRESHOLD) {
      handleSwipe("right");
    } else {
      x.set(0); // Reset position if swipe is not past threshold
    }
  };

  // Use the appropriate date field (dateTime or startTime)
  const eventDate = event.dateTime || event.startTime;
  const eventTitle = event.title || event.name;
  
  // Get location display
  const getLocationDisplay = () => {
    if (event.address) return event.address;
    if (event.location?.city) return event.location.city;
    return "Unknown location";
  };

  return (
    <motion.div
      className={cn(
        "absolute top-0 left-0 w-full h-full",
        isActive ? "block" : "hidden"
      )}
      style={{
        zIndex: isActive ? 1 : 0,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ background, rotate }}
        drag="x"
        dragConstraints={dragConstraints}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="absolute left-4 top-4 z-10 rounded-full bg-red-500 p-2 text-white shadow-lg"
          style={{ opacity }}
        >
          <X className="h-6 w-6" />
        </motion.div>
        <motion.div
          className="absolute right-4 top-4 z-10 rounded-full bg-green-500 p-2 text-white shadow-lg"
          style={{ opacity }}
        >
          <Check className="h-6 w-6" />
        </motion.div>

        <Card className="h-full w-full overflow-hidden">
          <CardContent className="aspect-video relative rounded-md overflow-hidden bg-muted p-0">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={eventTitle}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Calendar className="h-12 w-12 opacity-20" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {event.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest.id} variant="outline" className="bg-black/30 text-white border-none">
                    {interest.name}
                  </Badge>
                ))}
                {event.interests.length > 3 && (
                  <Badge variant="outline" className="bg-black/30 text-white border-none">
                    +{event.interests.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold">{eventTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {getLocationDisplay()}
            </p>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {eventDate ? format(new Date(eventDate), "MMM d, yyyy") : "Date TBD"}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {eventDate ? format(new Date(eventDate), "h:mm a") : "Time TBD"}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {event.attendees.length} attending
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => handleSwipe("left")}
            >
              <X className="h-5 w-5 text-red-500" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(`/events/${event.id}`, "_blank");
              }}
            >
              View Details
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => handleSwipe("right")}
            >
              <Heart className="h-5 w-5 text-green-500" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SwipeCard;
