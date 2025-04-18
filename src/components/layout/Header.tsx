
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { MapPin, Wallet } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const { balance } = useWallet();

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
            <Link to="/wallet" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Wallet className="h-5 w-5" />
              <span>₹{balance.toFixed(2)}</span>
            </Link>
            {user && <NotificationCenter />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
