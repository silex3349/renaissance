
import { useState, useEffect } from "react";
import { MOCK_EVENTS } from "@/services/mockData";
import { Event } from "@/types";
import SwipeCard from "@/components/matching/SwipeCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Matching = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Filter events based on user interests if available
    if (user?.interests && user.interests.length > 0) {
      const filteredEvents = MOCK_EVENTS.filter(event => 
        event.interests.some(interest => 
          user.interests.some(userInterest => 
            userInterest.id === interest.id
          )
        )
      );
      
      // Add some random events if we don't have enough filtered events
      if (filteredEvents.length < 5) {
        const randomEvents = MOCK_EVENTS
          .filter(event => !filteredEvents.includes(event))
          .sort(() => 0.5 - Math.random())
          .slice(0, 5 - filteredEvents.length);
          
        setEvents([...filteredEvents, ...randomEvents]);
      } else {
        setEvents(filteredEvents);
      }
    } else {
      // No user interests, show random events
      setEvents([...MOCK_EVENTS].sort(() => 0.5 - Math.random()));
    }
    
    setIsLoading(false);
  }, [user]);

  const handleSwipe = (direction: "left" | "right", event: Event) => {
    // Move to the next card
    setCurrentIndex(prevIndex => prevIndex + 1);
    
    // If swiped right (liked), add to liked events
    if (direction === "right") {
      setLikedEvents(prev => [...prev, event.id]);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    // Shuffle the events for a new matching session
    setEvents([...events].sort(() => 0.5 - Math.random()));
    toast({
      title: "Events refreshed",
      description: "We've found some new events for you to explore",
    });
  };

  // Determine if we have cards to show
  const hasCards = currentIndex < events.length;

  return (
    <div className="renaissance-container py-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
          <p className="text-muted-foreground">
            Swipe right on events you're interested in, left to pass
          </p>
        </div>
        
        <div className="relative h-[600px] w-full max-w-lg mx-auto">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card rounded-xl">
              <div className="text-center">
                <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Finding events for you...</p>
              </div>
            </div>
          ) : hasCards ? (
            <AnimatePresence>
              {events.slice(currentIndex, currentIndex + 3).map((event, index) => (
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
              
              <Button onClick={resetCards}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Find More Events
              </Button>
            </motion.div>
          )}
        </div>
        
        {hasCards && !isLoading && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {events.length - currentIndex} more events to discover
            </p>
            <Button variant="outline" size="sm" onClick={resetCards}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matching;
