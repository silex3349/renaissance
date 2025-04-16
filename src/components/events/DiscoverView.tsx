
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin } from "lucide-react";
import SwipeCard from "@/components/matching/SwipeCard";
import { AnimatePresence, motion } from "framer-motion";

interface DiscoverViewProps {
  events: Event[];
}

const DiscoverView = ({ events: initialEvents }: DiscoverViewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [swipeEvents, setSwipeEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [filterOnlyNearby, setFilterOnlyNearby] = useState(false);
  
  useEffect(() => {
    loadEvents();
  }, [user, filterOnlyNearby]);
  
  const loadEvents = () => {
    setIsLoading(true);
    setTimeout(() => {
      let filteredEvents = [...initialEvents];
      
      if (user?.interests && user.interests.length > 0) {
        const interestFiltered = filteredEvents.filter(event => 
          event.interests.some(interest => 
            user.interests.some(userInterest => 
              userInterest.id === interest.id
            )
          )
        );
        
        if (interestFiltered.length >= 5) {
          filteredEvents = interestFiltered;
        }
      }
      
      if (user?.location && filterOnlyNearby) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.city === user.location.city
        );
      }
      
      filteredEvents = [...filteredEvents].sort(() => 0.5 - Math.random());
      
      setSwipeEvents(filteredEvents);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 800);
  };
  
  const handleSwipe = (direction: "left" | "right", event: Event) => {
    setCurrentIndex(prevIndex => prevIndex + 1);
    
    if (direction === "right") {
      setLikedEvents(prev => [...prev, event.id]);
      toast({
        title: "Event liked!",
        description: `You liked "${event.title}"`,
      });
    }
  };
  
  const resetCards = () => {
    setCurrentIndex(0);
    loadEvents();
    toast({
      title: "Events refreshed",
      description: "We've found some new events for you to explore",
    });
  };
  
  const hasCards = currentIndex < swipeEvents.length;
  
  if (showLocationPrompt) {
    return (
      <div className="renaissance-container py-8">
        <div className="max-w-lg mx-auto">
          <LocationDetection onComplete={() => {
            setShowLocationPrompt(false);
            loadEvents();
          }} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-[450px] max-h-[65vh] w-full max-w-lg mx-auto">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-card rounded-xl">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Finding events for you...</p>
          </div>
        </div>
      ) : hasCards ? (
        <AnimatePresence>
          {swipeEvents.slice(currentIndex, currentIndex + 3).map((event, index) => (
            <SwipeCard
              key={event.id}
              event={event}
              onSwipe={handleSwipe}
              isActive={index === 0}
            />
          ))}
        </AnimatePresence>
      ) : (
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-xl p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold mb-2">No more events to show</h3>
          <p className="text-muted-foreground mb-6">
            You've seen all the events matching your interests.
            {likedEvents.length > 0 && ` You liked ${likedEvents.length} events.`}
          </p>
          
          <Button onClick={resetCards} className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Find More Events
          </Button>
        </motion.div>
      )}
      
      {hasCards && !isLoading && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {swipeEvents.length - currentIndex} more events to discover
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm" onClick={resetCards} className="rounded-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            {!user?.location && (
              <Button size="sm" onClick={() => setShowLocationPrompt(true)} className="rounded-full">
                <MapPin className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverView;
