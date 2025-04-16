
import { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface LocationBadgeProps {
  user: User | null;
}

const LocationBadge = ({ user }: LocationBadgeProps) => {
  if (!user?.location) return null;
  
  return (
    <div className="flex justify-center mb-4">
      <Badge variant="outline" className="flex items-center gap-1 px-4 py-2 rounded-full border-gray-300">
        <MapPin className="h-4 w-4" />
        {user.location.city || "Current location"}
      </Badge>
    </div>
  );
};

export default LocationBadge;
