import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, User, Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Lock, MessageSquare, Users, Bookmark, BookmarkPlus, ArrowLeft } from "lucide-react";
import { MOCK_EVENTS } from "@/services/mockData";
import GroupChat from "@/components/chat/GroupChat";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

interface GroupDetailProps {
  group: Group;
  members: User[];
  onAddToWatchlist?: (groupId: string) => void;
}

const GroupDetail = ({ group, members, onAddToWatchlist }: GroupDetailProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("about");
  const [message, setMessage] = useState("");

  const groupEvents = MOCK_EVENTS.filter(
    (event) => event.groupId === group.id
  ) as Event[];

  const isUserMember = user ? group.members.includes(user.id) : false;
  const isCreator = user ? group.creator === user.id : false;

  const handleJoinGroup = () => {
    if (!user) return;

    if (group.isPrivate) {
      addNotification({
        type: "joinRequest",
        message: `You requested to join ${group.name}. Waiting for approval.`,
        actionUrl: `/groups/${group.id}`,
      });

      addNotification({
        type: "joinRequest",
        message: `${user.email} requested to join your group ${group.name}`,
        actionUrl: `/groups/${group.id}`,
      });
    } else {
      addNotification({
        type: "joinedGroup",
        message: `You have joined ${group.name}`,
        actionUrl: `/groups/${group.id}`,
      });
    }
  };

  const handleInviteMember = () => {
    if (!user) return;

    addNotification({
      type: "groupInvite",
      message: `You invited a friend to join ${group.name}`,
      actionUrl: `/groups/${group.id}`,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleToggleWatchlist = () => {
    if (onAddToWatchlist) {
      onAddToWatchlist(group.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{group.name}</h1>
            {group.isPrivate && (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground">
            Created {formatDate(group.createdAt)}
          </p>
        </div>

        <div className="flex gap-2">
          {!isUserMember && (
            <Button onClick={handleJoinGroup}>
              {group.isPrivate ? "Request to Join" : "Join Group"}
            </Button>
          )}
          {isUserMember && !isCreator && (
            <Button variant="outline" onClick={() => {}}>
              Leave Group
            </Button>
          )}
          {isUserMember && (
            <Button variant="outline" onClick={handleInviteMember}>
              Invite Member
            </Button>
          )}
          {user && (
            <Button variant="outline" onClick={handleToggleWatchlist}>
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Watchlist
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/groups")}
          >
            Back to Groups
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="members">
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="events">
            Events ({groupEvents.length})
          </TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4 p-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p>{group.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {group.interests.map((interest) => (
                <span
                  key={interest.id}
                  className="px-3 py-1 bg-muted rounded-full text-sm"
                >
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {member.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.location?.city || "No location set"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4 p-4">
          {groupEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {groupEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No events yet</h3>
              <p className="text-muted-foreground">
                This group doesn't have any scheduled events.
              </p>
              {isUserMember && (
                <Button className="mt-4">Create Event</Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat" className="p-4">
          {isUserMember ? (
            <GroupChat groupId={group.id} />
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">
                Join to access chat
              </h3>
              <p className="text-muted-foreground">
                You need to be a member to participate in group chats.
              </p>
              <Button className="mt-4" onClick={handleJoinGroup}>
                {group.isPrivate ? "Request to Join" : "Join Group"}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetail;
