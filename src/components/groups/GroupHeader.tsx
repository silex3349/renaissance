
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Group } from "@/types";

interface GroupHeaderProps {
  group: Group;
}

const GroupHeader = ({ group }: GroupHeaderProps) => {
  const navigate = useNavigate();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const handleBack = () => {
    navigate("/groups");
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="flex-shrink-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold line-clamp-1">{group.name}</h1>
          {group.isPrivate && (
            <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Created {formatDate(group.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default GroupHeader;
