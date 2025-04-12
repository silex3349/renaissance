import { useState, useEffect } from "react";
import { MOCK_EVENTS } from "@/services/mockData";
import { Event } from "@/types";
import SwipeCard from "@/components/matching/SwipeCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import LocationDetection from "@/components/location/LocationDetection";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Matching = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationDetected, setLocationDetected] = useState(!!user?.location);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [filterOnlyNearby, setFilterOnlyNearby] = useState(false);

  // Type assertion for mock events
  const typedMockEvents = MOCK_EVENTS as Event[];

  useEffect(() => {
    // If user has location, use it for filtering events
    if (user?.location && locationDetected) {
      loadEvents();
    } else if (!locationDetected && !showLocationPrompt) {
      // Prompt for location if not already detected
      setShowLocationPrompt(true);
    } else if (!locationDetected) {
      // Still load some events even without location
      loadEvents();
    }
  }, [user, locationDetected]);

  const loadEvents = () => {
    setIsLoading(true);
    // Simulate API delay for filtering events
    setTimeout(() => {
      let filteredEvents = [...typedMockEvents];
      
      // Filter by user interests if available
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
      
      // Further filter by location if user has location and filter is enabled
      if (user?.location && filterOnlyNearby) {
        // Simple distance calculation for demo purposes
        // In a real app, use proper geospatial calculations
        filteredEvents = filteredEvents.filter(event => {
          if (!event.location.latitude || !event.location.longitude) return false;
          
          const distance = calculateDistance(
            user.location.latitude, 
            user.location.longitude,
            event.location.latitude,
            event.location.longitude
          );
          
          return distance < 50; // Events within 50km
        });
      }
      
      // Sort events - nearby events first if location is available
      if (user?.location) {
        filteredEvents.sort((a, b) => {
          if (!a.location.latitude || !b.location.latitude) return 0;
          
          const distanceA = calculateDistance(
            user.location.latitude,
            user.location.longitude,
            a.location.latitude,
            a.location.longitude
          );
          
          const distanceB = calculateDistance(
            user.location.latitude,
            user.location.longitude,
            b.location.latitude,
            b.location.longitude
          );
          
          return distanceA - distanceB;
        });
      }
      
      // Randomize the order slightly to add variety
      filteredEvents = [...filteredEvents].sort(() => 0.5 - Math.random());
      
      setEvents(filteredEvents);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 1000);
  };

  // Simple distance calculation using Haversine formula (km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

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
    // Refresh events list
    loadEvents();
    toast({
      title: "Events refreshed",
      description: "We've found some new events for you to explore",
    });
  };

  const handleLocationDetected = () => {
    setLocationDetected(true);
    setShowLocationPrompt(false);
    loadEvents();
  };

  // Determine if we have cards to show
  const hasCards = currentIndex < events.length;

  if (showLocationPrompt) {
    return (
      <div className="renaissance-container py-8">
        <div className="max-w-lg mx-auto">
          <LocationDetection onComplete={handleLocationDetected} />
        </div>
      </div>
    );
  }

  return (
    <div className="renaissance-container py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Discover Events</h1>
          
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Events</SheetTitle>
                  <SheetDescription>
                    Customize your event discovery experience
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="nearby-filter">Show only nearby events</Label>
                      <p className="text-sm text-muted-foreground">
                        Filter events happening near your current location
                      </p>
                    </div>
                    <Switch 
                      id="nearby-filter" 
                      checked={filterOnlyNearby} 
                      onCheckedChange={(checked) => {
                        setFilterOnlyNearby(checked);
                        loadEvents();
                      }} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Update Your Location</Label>
                    <LocationDetection onComplete={handleLocationDetected} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button variant="outline" size="icon" onClick={resetCards}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {user?.location && (
          <div className="mb-6 flex items-center justify-center">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <MapPin className="h-3 w-3" />
              {user.location.city || "Current location"}
            </Badge>
          </div>
        )}
        
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
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm" onClick={resetCards}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Events
              </Button>
              
              {!user?.location && (
                <Button size="sm" onClick={() => setShowLocationPrompt(true)}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matching;
