
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { MapPin, Wallet, Star } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const { balance } = useWallet();

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
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="renaissance-container py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Groups</h1>
            {user?.location && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-sm"
              >
                <MapPin className="h-4 w-4" />
                {user.location.city || "Current location"}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {user?.user_category && (
              <Badge 
                variant="secondary"
                className={`flex items-center gap-1 ${getCategoryColor(user.user_category)}`}
              >
                <Star className="h-3 w-3" />
                {user.user_category.charAt(0).toUpperCase() + user.user_category.slice(1)}
              </Badge>
            )}
            <Link to="/wallet" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Wallet className="h-5 w-5" />
              <span>🪙{balance.toFixed(2)}</span>
            </Link>
            {user && <NotificationCenter />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
