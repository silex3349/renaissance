
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Header = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    signOut();
  };

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="renaissance-container py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Renaissance
        </Link>
        
        <nav className="hidden sm:flex items-center space-x-6">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/events" className="nav-link">
            Events
          </NavLink>
          <NavLink to="/groups" className="nav-link">
            Groups
          </NavLink>
          {user && (
            <>
              <NavLink to="/discover" className="nav-link">
                Discover
              </NavLink>
              <NavLink to="/chats" className="nav-link">
                Chats
              </NavLink>
            </>
          )}
        </nav>
        
        {user ? (
          <div className="hidden sm:flex items-center space-x-4">
            <NotificationCenter />
            <Link to="/profile">Profile</Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/auth">Sign In</Link>
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Sign Up</Link>
            </Button>
          </div>
        )}
        
        {user && (
          <Sheet>
            <div className="flex items-center sm:hidden">
              <NotificationCenter />
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
                    <Link to="/events" className="block p-2 hover:bg-accent rounded-md">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link to="/groups" className="block p-2 hover:bg-accent rounded-md">
                      Groups
                    </Link>
                  </li>
                  <li>
                    <Link to="/discover" className="block p-2 hover:bg-accent rounded-md">
                      Discover
                    </Link>
                  </li>
                  <li>
                    <Link to="/chats" className="block p-2 hover:bg-accent rounded-md">
                      Chats
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
        )}
      </div>
    </header>
  );
};

export default Header;
