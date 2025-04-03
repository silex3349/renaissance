
import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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

  const { user } = useAuth();

  const handleSwipe = (direction: "left" | "right") => {
    setSwipedDirection(direction);
    onSwipe(direction, event);
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
        style={{ background }}
        drag="x"
        dragConstraints={dragConstraints}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="absolute left-4 top-4 z-10 rounded-full bg-red-500 p-2 text-white"
          style={{ opacity }}
        >
          <X className="h-6 w-6" />
        </motion.div>
        <motion.div
          className="absolute right-4 top-4 z-10 rounded-full bg-green-500 p-2 text-white"
          style={{ opacity }}
        >
          <Check className="h-6 w-6" />
        </motion.div>

        <Card className="h-full w-full">
          <CardContent className="aspect-video relative rounded-md overflow-hidden bg-muted">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Calendar className="h-12 w-12 opacity-20" />
              </div>
            )}
          </CardContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-muted-foreground">{event.location}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {event.interests.map((interest) => (
                <Badge key={interest.id} variant="secondary">
                  {interest.name}
                </Badge>
              ))}
            </div>
          </div>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(event.dateTime), "MMM d, yyyy")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (swipedDirection === "right") {
                  // User swiped right, navigate to event details
                  window.open(`/events/${event.id}`, "_blank");
                } else {
                  // User swiped left, show a message or do nothing
                  console.log("Swiped left, no action taken");
                }
              }}
              disabled={swipedDirection !== "right"}
            >
              {swipedDirection === "right" ? "View Event" : "Pass"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SwipeCard;
