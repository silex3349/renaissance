
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateButtonProps {
  viewMode: "list" | "discover" | "groups";
  onClick: () => void;
}

const CreateButton = ({ viewMode, onClick }: CreateButtonProps) => {
  if (viewMode === "discover") return null;
  
  return (
    <Button 
      className="fixed right-4 bottom-20 rounded-full shadow-lg z-20 flex items-center gap-2"
      onClick={onClick}
    >
      <Plus className="h-5 w-5" />
      {viewMode === "groups" ? "Create Group" : "Create Event"}
    </Button>
  );
};

export default CreateButton;
