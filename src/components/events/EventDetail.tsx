
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event, User as UserType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CalendarDays,
  BookmarkPlus,
  Share2,
  Bell,
  BellOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SwipeUserCard from "@/components/matching/SwipeUserCard";

interface EventDetailProps {
  event: Event;
  attendees: UserType[];
}

const EventDetail = ({ event, attendees }: EventDetailProps) => {
  const navigate = useNavigate();
  const { user, joinEvent, leaveEvent } = useAuth();
  const { toast } = useToast();
  const [attendeesVisible, setAttendeesVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReminded, setIsReminded] = useState(false);

  // Check if the current user is attending this event
  const isAttending = event ? user?.joinedEvents.includes(event.id) : false;

  // Handle joining or leaving an event
  const toggleAttendance = () => {
    if (!event || !user) return;

    if (isAttending) {
      leaveEvent(event.id);
      toast({
        title: "Left event",
        description: "You are no longer attending this event.",
      });
    } else {
      joinEvent(event.id);
      toast({
        title: "Joined event",
        description: "You are now attending this event!",
      });
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Event removed from bookmarks" : "Event bookmarked",
      description: isBookmarked 
        ? "This event has been removed from your saved events." 
        : "This event has been added to your saved events.",
    });
  };

  const toggleReminder = () => {
    setIsReminded(!isReminded);
    toast({
      title: isReminded ? "Reminder cancelled" : "Reminder set",
      description: isReminded 
        ? "You will no longer receive reminders about this event." 
        : "You will receive a reminder before this event.",
    });
  };

  // Handle sharing the event
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Event link copied to clipboard!",
      });
    }
  };

  // Fix back button to always go to events page
  const handleBackClick = () => {
    navigate("/events");
  };

  // Reset attendees visibility when changing events
  useEffect(() => {
    setAttendeesVisible(false);
    // Reset bookmarked and reminded states when event changes
    setIsBookmarked(false);
    setIsReminded(false);
  }, [event.id]);

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

  // Fix for getUserInitials: safely handle undefined name
  const getUserInitials = (user: UserType) => {
    if (!user || !user.name) return "?";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold line-clamp-1">{event.title}</h1>
        </div>
      </div>

      <Card className="overflow-hidden border rounded-xl">
        <div className="w-full aspect-video relative">
          <img
            src={getBackgroundImage()}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="p-4 space-y-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span>
                {format(new Date(event.dateTime), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span>
                {format(new Date(event.dateTime), "h:mm a")} to{" "}
                {format(
                  new Date(
                    new Date(event.dateTime).getTime() + 2 * 60 * 60 * 1000
                  ),
                  "h:mm a"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span>
                {event.address || (event.location.city ? event.location.city : "Unknown location")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span>
                {event.attendees.length} people attending
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {event.interests.map((interest) => (
              <Badge key={interest.id} variant="secondary" className="rounded-full">
                {interest.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              className="flex-1"
              variant={isAttending ? "destructive" : "default"}
              onClick={toggleAttendance}
            >
              {isAttending ? "Leave Event" : "Join Event"}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleBookmark}
              className={isBookmarked ? "text-primary" : ""}
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleReminder}
              className={isReminded ? "text-primary" : ""}
            >
              {isReminded ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={shareEvent}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">About this event</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {event.description}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Attendees
          </CardTitle>
          <CardDescription>
            {event.attendees.length} people going to this event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendeesVisible ? (
              attendees.length > 0 ? (
                attendees.map((attendee: UserType) => (
                  <div
                    key={attendee.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {attendee.email && attendee.email[0] ? attendee.email[0].toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Anonymous User</p>
                      <p className="text-xs text-muted-foreground">
                        {attendee.interests ? attendee.interests.length : 0} shared interests
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No one has joined this event yet. Be the first!
                </p>
              )
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setAttendeesVisible(true)}
              >
                View Attendees
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetail;
