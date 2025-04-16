
import { Badge } from "@/components/ui/badge";
import { Interest } from "@/types";

interface InterestTagProps {
  interest: Interest;
}

export const InterestTag = ({ interest }: InterestTagProps) => {
  return (
    <Badge 
      variant="secondary" 
      className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground hover:bg-muted/80 transition-colors"
    >
      {interest.name}
    </Badge>
  );
};
