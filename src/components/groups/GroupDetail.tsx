
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Group, Event } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_EVENTS } from "@/services/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import EventList from "@/components/events/EventList";
import GroupChat from "@/components/chat/GroupChat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Calendar,
  MessageSquare,
  Settings,
  UserPlus,
  LogOut,
  ChevronLeft,
  MoreVertical,
} from "lucide-react";

interface GroupDetailProps {
  group: Group;
  members: User[];
}

const GroupDetail = ({ group, members }: GroupDetailProps) => {
  const { user, joinGroup, leaveGroup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const isAdmin = user?.id === group.creator;
  const isMember = user?.id && group.members.includes(user.id);
  
  // Get group events
  const groupEvents = MOCK_EVENTS.filter((event) => 
    group.events.includes(event.id)
  );

  const handleJoinGroup = () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (!isMember) {
      joinGroup(group.id);
      toast({
        title: "Request sent",
        description: group.isPrivate 
          ? "Your request to join this group has been sent to the admin." 
          : "You have successfully joined this group.",
      });
    }
  };

  const handleLeaveGroup = () => {
    if (isMember) {
      leaveGroup(group.id);
      toast({
        title: "Left group",
        description: "You have left this group successfully.",
      });
    }
  };

  const handleInviteSend = () => {
    setShowInviteDialog(false);
    toast({
      title: "Invitations sent",
      description: "Your invitations have been sent successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate("/groups")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold flex-1">{group.name}</h1>
        
        {isMember && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAdmin && (
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Group Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLeaveGroup}>
                <LogOut className="h-4 w-4 mr-2" />
                Leave Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {!isMember && (
          <Button onClick={handleJoinGroup}>
            {group.isPrivate ? "Request to Join" : "Join Group"}
          </Button>
        )}
        
        {isMember && (
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button className="ml-2" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Friends to Join</DialogTitle>
                <DialogDescription>
                  Invite your friends to join this group.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Share this link with your friends:
                </p>
                <div className="flex">
                  <Input
                    value={`${window.location.origin}/groups/${group.id}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/groups/${group.id}`);
                      toast({
                        title: "Link copied",
                        description: "Group invitation link copied to clipboard",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInviteSend}>Send Invitations</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <p className="mb-4">{group.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {group.interests.map((interest) => (
            <Badge key={interest.id} variant="secondary">
              {interest.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>{group.members.length} members</span>
        </div>
      </div>

      {isMember ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-4 border rounded-lg"
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${member.id}`} />
                    <AvatarFallback>
                      {member.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.id === group.creator ? "Admin" : "Member"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Group Events</h2>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
            <EventList events={groupEvents} title="" />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <GroupChat groupId={group.id} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-muted p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">Private Group</h3>
          <p className="text-muted-foreground mb-4">
            Join this group to view members, events, and participate in discussions.
          </p>
          <Button onClick={handleJoinGroup}>
            {group.isPrivate ? "Request to Join" : "Join Group"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
