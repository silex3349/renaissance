
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { User } from "@/types";

interface MembersTabProps {
  members: User[];
  isUserMember: boolean;
  onInviteMember: () => void;
}

const MembersTab = ({ members, isUserMember, onInviteMember }: MembersTabProps) => {
  const [membersVisible, setMembersVisible] = useState(false);

  return (
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
          onClick={onInviteMember}
          className="w-full mt-4"
        >
          Invite Member
        </Button>
      )}
    </div>
  );
};

export default MembersTab;
