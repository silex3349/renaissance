
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Menu, MapPin } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();

  const handleLogout = async () => {
    logout();
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="renaissance-container py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Events</h1>
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
            {/* Show notification center if user is logged in */}
            {user && <NotificationCenter />}
            
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="py-4">
                    <ul className="space-y-2">
                      <li>
                        <Link to="/" className="block p-2 hover:bg-accent rounded-md">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link to="/discover" className="block p-2 hover:bg-accent rounded-md">
                          Discover
                        </Link>
                      </li>
                      <li>
                        <Link to="/groups" className="block p-2 hover:bg-accent rounded-md">
                          Groups
                        </Link>
                      </li>
                      <li>
                        <Link to="/chats" className="block p-2 hover:bg-accent rounded-md">
                          Chats
                        </Link>
                      </li>
                      <li>
                        <Link to="/wallet" className="block p-2 hover:bg-accent rounded-md">
                          Wallet - ₹{balance.toFixed(2)}
                        </Link>
                      </li>
                      <li>
                        <Link to="/profile" className="block p-2 hover:bg-accent rounded-md">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="block w-full text-left p-2 hover:bg-accent rounded-md"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth">Sign In</Link>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
