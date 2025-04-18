
import React, { useState } from "react";
import { Group, User, Event } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_EVENTS } from "@/services/mockData";
import { useAuth } from "@/contexts/AuthContext";
import GroupHeader from "./GroupHeader";
import GroupActions from "./GroupActions";
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("about");

  const groupEvents = MOCK_EVENTS.filter(
    (event) => event.groupId === group.id
  ) as Event[];

  const isUserMember = user ? group.members.includes(user.id) : false;

  return (
    <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
      <GroupHeader group={group} />
      
      <GroupActions 
        group={group}
        isUserMember={isUserMember}
        onAddToWatchlist={onAddToWatchlist}
      />
      
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
            onInviteMember={() => {}}
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
            onJoinGroup={() => {}}
            isPrivate={group.isPrivate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetail;
