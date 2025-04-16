
import { useState, useRef } from "react";
import { Group } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import GroupList from "@/components/groups/GroupList";

interface GroupTabViewProps {
  groups: Group[];
  onShowFilterSheet: () => void;
}

const GroupTabView = ({ groups, onShowFilterSheet }: GroupTabViewProps) => {
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="relative mb-4 mt-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search groups..."
          className="pl-10 pr-12 py-6 rounded-xl bg-gray-50 border-gray-200"
          value={searchTerm}
          onChange={handleSearch}
        />
        {!searchTerm && (
          <kbd className="absolute right-12 top-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
            /
          </kbd>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 text-gray-500" 
          onClick={onShowFilterSheet}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 p-1 rounded-full">
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
              "Created Groups"
            }
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default GroupTabView;
