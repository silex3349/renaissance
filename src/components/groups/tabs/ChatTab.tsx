
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import GroupChat from "@/components/chat/GroupChat";

interface ChatTabProps {
  groupId: string;
  isUserMember: boolean;
  onJoinGroup: () => void;
  isPrivate: boolean;
}

const ChatTab = ({ groupId, isUserMember, onJoinGroup, isPrivate }: ChatTabProps) => {
  return (
    <div>
      {isUserMember ? (
        <GroupChat groupId={groupId} />
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            Join to access chat
          </h3>
          <p className="text-muted-foreground">
            You need to be a member to participate in group chats.
          </p>
          <Button className="mt-4" onClick={onJoinGroup}>
            {isPrivate ? "Request to Join" : "Join Group"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatTab;
