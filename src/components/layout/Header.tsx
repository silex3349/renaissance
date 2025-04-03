
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
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link to="/events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
            </nav>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
