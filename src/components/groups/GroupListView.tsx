
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Group } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter } from "lucide-react";
import GroupList from "@/components/groups/GroupList";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";

interface GroupListViewProps {
  groups: Group[];
}

const GroupListView = ({ groups }: GroupListViewProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filter groups based on search term and active tab
  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" &&
        user?.id && 
        group.members.includes(user.id)) ||
      (activeTab === "created" &&
        user?.id && 
        group.creator === user.id);
    
    return matchesSearch && (matchesTab || (!group.isPrivate && activeTab === "all"));
  });

  return (
    <div className="pt-4 px-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-10 pr-12 py-6 rounded-xl bg-gray-50 border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 text-gray-500"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <div className="bg-gray-100 rounded-full mb-4 p-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full bg-transparent">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All</TabsTrigger>
            <TabsTrigger value="joined" className="rounded-full data-[state=active]:bg-white">Joined</TabsTrigger>
            <TabsTrigger value="created" className="rounded-full data-[state=active]:bg-white">Created</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <GroupList 
              groups={filteredGroups} 
              title={
                activeTab === "all" ? "All Groups" :
                activeTab === "joined" ? "Joined Groups" :
                "Groups Created By Me"
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      
      <Button 
        className="fixed right-4 bottom-20 rounded-full shadow-lg z-20 flex items-center gap-2"
        onClick={() => setShowCreateDialog(true)}
      >
        <Plus className="h-5 w-5" />
        Create Group
      </Button>
    </div>
  );
};

export default GroupListView;
