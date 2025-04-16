
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Users } from "lucide-react";

interface ViewModeTabsProps {
  viewMode: "list" | "discover" | "groups";
  onChange: (value: "list" | "discover" | "groups") => void;
}

const ViewModeTabs = ({ viewMode, onChange }: ViewModeTabsProps) => {
  return (
    <div className="bg-gray-100 rounded-full mb-4 p-1">
      <Tabs value={viewMode} onValueChange={(value) => onChange(value as any)} className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-transparent">
          <TabsTrigger value="list" className="rounded-full data-[state=active]:bg-white">
            <Calendar className="h-5 w-5 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="discover" className="rounded-full data-[state=active]:bg-white">
            <Search className="h-5 w-5 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="groups" className="rounded-full data-[state=active]:bg-white">
            <Users className="h-5 w-5 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ViewModeTabs;
