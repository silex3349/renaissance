
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, User, Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Lock, 
  MessageSquare, 
  Users, 
  Bookmark, 
  BookmarkPlus, 
  ArrowLeft,
  Share2
} from "lucide-react";
import { MOCK_EVENTS } from "@/services/mockData";
import GroupChat from "@/components/chat/GroupChat";
import EventCard from "@/components/events/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";

interface GroupDetailProps {
  group: Group;
  members: User[];
  onAddToWatchlist?: (groupId: string) => void;
}

const GroupDetail = ({ group, members, onAddToWatchlist }: GroupDetailProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("about");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [membersVisible, setMembersVisible] = useState(false);

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
      
      toast({
        title: "Request sent",
        description: `You've requested to join ${group.name}`,
      });
    } else {
      addNotification({
        type: "joinedGroup",
        message: `You have joined ${group.name}`,
        actionUrl: `/groups/${group.id}`,
      });
      
      toast({
        title: "Group joined!",
        description: `You've successfully joined ${group.name}`,
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
    
    toast({
      title: "Invitation sent",
      description: "Your invitation has been sent",
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
    setIsBookmarked(!isBookmarked);
    
    if (onAddToWatchlist) {
      onAddToWatchlist(group.id);
    }
  };
  
  const shareGroup = () => {
    if (navigator.share) {
      navigator.share({
        title: group.name,
        text: `Check out this group: ${group.name}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Group link copied to clipboard!",
      });
    }
  };
  
  const handleBack = () => {
    navigate("/groups");
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold line-clamp-1">{group.name}</h1>
            {group.isPrivate && (
              <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(group.createdAt)}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border rounded-xl">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-32 flex items-center justify-center">
          <Users className="h-16 w-16 text-primary/40" />
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {group.interests.map((interest) => (
              <Badge
                key={interest.id}
                variant="secondary"
                className="rounded-full"
              >
                {interest.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              className="flex-1"
              variant={isUserMember ? "destructive" : "default"}
              onClick={isUserMember ? () => {} : handleJoinGroup}
            >
              {isUserMember ? "Leave Group" : group.isPrivate ? "Request to Join" : "Join Group"}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWatchlist}
              className={isBookmarked ? "text-primary" : ""}
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={shareGroup}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="members">
            Members
          </TabsTrigger>
          <TabsTrigger value="events">
            Events
          </TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4 pt-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">About this group</h3>
            <p className="text-muted-foreground">{group.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Members</h3>
              <span className="text-muted-foreground">({members.length})</span>
            </div>
            
            {!membersVisible ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMembersVisible(true)}
              >
                View Members
              </Button>
            ) : (
              <div className="grid gap-3">
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.email && member.email.charAt(0) ? member.email.charAt(0).toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name || "Anonymous User"}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.location?.city || "No location set"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {isUserMember && (
              <Button 
                variant="outline" 
                onClick={handleInviteMember}
                className="w-full mt-4"
              >
                Invite Member
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
          </div>
          
          {groupEvents.length > 0 ? (
            <div className="grid gap-4">
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

        <TabsContent value="chat" className="pt-4">
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
