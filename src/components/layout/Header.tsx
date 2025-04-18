
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Wallet } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useWallet } from "@/contexts/WalletContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="renaissance-container py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Renaissance
        </Link>
        
        <div className="flex items-center space-x-3">
          {/* Show wallet button if user is logged in */}
          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => navigate("/wallet")}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">₹{balance.toFixed(2)}</span>
            </Button>
          )}
          
          {/* Always show the notification center if user is logged in */}
          {user && <NotificationCenter />}
          
          {user ? (
            <Sheet>
              <div className="flex items-center">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>
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
    </header>
  );
};

export default Header;
