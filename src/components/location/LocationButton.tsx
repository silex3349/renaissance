
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationButtonProps {
  city: string;
}

const LocationButton = ({ city }: LocationButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="flex items-center gap-1 text-sm"
    >
      <MapPin className="h-4 w-4" />
      {city || "Current location"}
    </Button>
  );
};

export default LocationButton;
