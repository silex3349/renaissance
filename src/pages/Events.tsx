
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Heart, BookmarkPlus, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_EVENTS } from "@/services/mockData";
import { Event } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If there's no ID, show all events (list view)
    if (!id) {
      setIsLoading(false);
      return;
    }

    // Find the specific event
    const foundEvent = MOCK_EVENTS.find(e => e.id === id);
    
    if (foundEvent) {
      setEvent(foundEvent);
      // Check if user has joined this event
      setIsJoined(user?.joinedEvents?.includes(foundEvent.id) || false);
    }
    
    setIsLoading(false);
  }, [id, user]);

  const handleJoinEvent = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join events",
        variant: "destructive",
      });
      return;
    }

    setIsJoined(!isJoined);
    toast({
      title: isJoined ? "Left event" : "Joined event",
      description: isJoined 
        ? "You've been removed from the attendee list" 
        : "You've been added to the attendee list",
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Event bookmarked",
      description: "This event has been saved to your bookmarks",
    });
  };

  // If no ID is provided, show a list of upcoming events
  if (!id) {
    return (
      <div className="renaissance-container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-muted-foreground">
              Discover upcoming events and activities near you
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_EVENTS.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="cursor-pointer bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {event.imageUrl && (
                    <div className="relative h-48 w-full bg-muted">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-xl line-clamp-1">{event.title}</h3>
                    
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.dateTime).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location.city || "Nearby"}
                    </div>
                    
                    <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center text-sm pt-2">
                      <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{event.attendees.length} attending</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="renaissance-container py-8 text-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="renaissance-container py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/events')}>View All Events</Button>
      </div>
    );
  }

  return (
    <div className="renaissance-container py-8">
      <div className="space-y-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/events')}
          className="mb-4"
        >
          ← Back to Events
        </Button>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {event.imageUrl && (
              <div className="rounded-lg overflow-hidden bg-muted h-64 md:h-80">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.dateTime).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.address}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">About this event</h2>
              <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
            </div>
            
            {event.interests.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {event.interests.map(interest => (
                    <span 
                      key={interest.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Join This Event</h2>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{event.attendees.length} people attending</span>
              </div>
              
              {event.maxAttendees && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{event.maxAttendees - event.attendees.length}</span> spots left
                </div>
              )}
              
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  onClick={handleJoinEvent}
                  variant={isJoined ? "outline" : "default"}
                >
                  {isJoined ? (
                    <>Leave Event</>
                  ) : (
                    <>Join Event</>
                  )}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleBookmark}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Organizer</h2>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Event Host</div>
                  <div className="text-sm text-muted-foreground">Joined April 2023</div>
                </div>
              </div>
            </div>
            
            {event.location && (
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="bg-muted rounded-lg h-40 flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground">
                  {event.address}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
