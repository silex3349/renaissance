
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
      (activeTab === "my-groups" &&
        user?.id && 
        group.members.includes(user.id)) ||
      (activeTab === "created" &&
        user?.id && 
        group.creator === user.id);
    
    // Also include public groups in "all" tab
    return matchesSearch && (matchesTab || (!group.isPrivate && activeTab === "all"));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="created">Created By Me</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <GroupList 
            groups={filteredGroups} 
            title={
              activeTab === "all" ? "All Groups" :
              activeTab === "my-groups" ? "My Groups" :
              "Groups Created By Me"
            }
          />
        </TabsContent>
      </Tabs>

      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default GroupListView;
