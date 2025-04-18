
import React, { useState } from "react";
import { BookmarkPlus, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Group, Interest } from "@/types";

interface GroupActionsProps {
  group: Group;
  isUserMember: boolean;
  onAddToWatchlist?: (groupId: string) => void;
}

const GroupActions = ({ group, isUserMember, onAddToWatchlist }: GroupActionsProps) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  return (
    <Card className="overflow-hidden border rounded-xl">
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-32 flex items-center justify-center">
        <Users className="h-16 w-16 text-primary/40" />
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {group.interests.map((interest: Interest) => (
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
  );
};

export default GroupActions;
