
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, User, Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";  // Add this import
import { Lock, Users, BookmarkPlus, ArrowLeft, Share2 } from "lucide-react";
import { MOCK_EVENTS } from "@/services/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";
import AboutTab from "./tabs/AboutTab";
import MembersTab from "./tabs/MembersTab";
import EventsTab from "./tabs/EventsTab";
import ChatTab from "./tabs/ChatTab";

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

  const groupEvents = MOCK_EVENTS.filter(
    (event) => event.groupId === group.id
  ) as Event[];

  const isUserMember = user ? group.members.includes(user.id) : false;

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
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4 pt-4">
          <AboutTab description={group.description} />
        </TabsContent>

        <TabsContent value="members" className="space-y-4 pt-4">
          <MembersTab 
            members={members}
            isUserMember={isUserMember}
            onInviteMember={handleInviteMember}
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-4 pt-4">
          <EventsTab 
            events={groupEvents}
            isUserMember={isUserMember}
          />
        </TabsContent>

        <TabsContent value="chat" className="pt-4">
          <ChatTab 
            groupId={group.id}
            isUserMember={isUserMember}
            onJoinGroup={handleJoinGroup}
            isPrivate={group.isPrivate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetail;
