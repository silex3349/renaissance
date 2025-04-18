
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserCategoryBadgeProps {
  category: string;
}

const UserCategoryBadge = ({ category }: UserCategoryBadgeProps) => {
  // Function to get badge color based on user category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'active':
        return 'bg-green-500';
      case 'hibernating':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'new':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge 
      variant="secondary"
      className={`flex items-center gap-1 ${getCategoryColor(category)}`}
    >
      <Star className="h-3 w-3" />
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
};

export default UserCategoryBadge;
