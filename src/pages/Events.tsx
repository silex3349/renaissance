import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_EVENTS, MOCK_USERS } from "@/services/mockData";
import { EventCard } from "@/components/events/EventCard";
import { EventList } from "@/components/events/EventList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Search,
  CalendarDays,
  Filter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SwipeUserCard } from "@/components/matching/SwipeUserCard";
import { useAuth } from "@/contexts/AuthContext";
import { Event, User as UserType } from "@/types";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, joinEvent, leaveEvent } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [attendeesVisible, setAttendeesVisible] = useState(false);

  // If we have an ID parameter, we're on the event detail page
  // Otherwise, we show the event list
  const isDetailView = !!id;

  // Find the current event if we're on the detail page
  const currentEvent = isDetailView
    ? MOCK_EVENTS.find((event) => event.id === id)
    : null;

  // Filter events based on search term and active tab
  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" &&
        user?.joinedEvents.includes(event.id)) ||
      (activeTab === "upcoming" &&
        new Date(event.date) > new Date());
    return matchesSearch && matchesTab;
  });

  // Get attendees for the current event
  const attendees = currentEvent
    ? MOCK_USERS.filter((user) => currentEvent.attendees.includes(user.id))
    : [];

  // Check if the current user is attending this event
  const isAttending = currentEvent
    ? user?.joinedEvents.includes(currentEvent.id)
    : false;

  // Handle joining or leaving an event
  const toggleAttendance = () => {
    if (!currentEvent || !user) return;

    if (isAttending) {
      leaveEvent(currentEvent.id);
    } else {
      joinEvent(currentEvent.id);
    }
  };

  // Reset attendees visibility when changing events
  useEffect(() => {
    setAttendeesVisible(false);
  }, [id]);

  return (
    <div className="renaissance-container py-8">
      {isDetailView && currentEvent ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/events")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{currentEvent.title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  {currentEvent.imageUrl ? (
                    <img
                      src={currentEvent.imageUrl}
                      alt={currentEvent.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <Calendar className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(currentEvent.date), "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(currentEvent.date), "h:mm a")} to{" "}
                      {format(
                        new Date(
                          new Date(currentEvent.date).getTime() + 2 * 60 * 60 * 1000
                        ),
                        "h:mm a"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{currentEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {currentEvent.attendees.length} people attending
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">About this event</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {currentEvent.description}
                  </p>
                </div>

                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentEvent.interests.map((interest) => (
                      <Badge key={interest.id} variant="secondary">
                        {interest.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isAttending ? "destructive" : "default"}
                  onClick={toggleAttendance}
                >
                  {isAttending ? "Leave Event" : "Join Event"}
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Attendees
                  </CardTitle>
                  <CardDescription>
                    {currentEvent.attendees.length} people going to this event
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
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Anonymous User</p>
                              <p className="text-xs text-muted-foreground">
                                {attendee.interests.length} shared interests
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Similar People
                  </CardTitle>
                  <CardDescription>
                    People with similar interests attending this event
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-[300px] w-full">
                    {MOCK_USERS.filter(
                      (u) =>
                        u.id !== user?.id &&
                        currentEvent.attendees.includes(u.id)
                    )
                      .slice(0, 3)
                      .map((matchUser, index) => (
                        <SwipeUserCard
                          key={matchUser.id}
                          user={matchUser}
                          isActive={index === 0}
                          onSwipe={() => {}}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Discover Events</h1>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="joined">Joined</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <EventList events={filteredEvents} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Events;
