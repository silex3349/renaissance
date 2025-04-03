
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Calendar, Search, Settings, User } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="renaissance-container flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="font-semibold text-xl text-renaissance-700">
            Renaissance
          </Link>
        </div>
        
        {user ? (
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/discover">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Search className="h-4 w-4 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </nav>
            
            <div className="flex items-center gap-1">
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
