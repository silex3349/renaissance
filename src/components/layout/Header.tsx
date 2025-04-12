
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  HeartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === "/";
  const isCustomStyledPage = location.pathname === "/discover" || location.pathname.includes("/matching");

  const navigationItems = [
    { name: "Home", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
    {
      name: "Discover",
      path: "/discover",
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      name: "Events",
      path: "/events",
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      name: "Groups",
      path: "/groups",
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      name: "Matching",
      path: "/matching",
      icon: <HeartIcon className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserIcon className="h-5 w-5" />,
    },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 
      ${isHomePage && !user ? 'bg-transparent border-transparent' : isCustomStyledPage ? 'bg-transparent border-b border-white/10' : 'border-b bg-background/95'}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center text-xl font-bold tracking-tighter ${isHomePage && !user || isCustomStyledPage ? 'text-white' : ''}`}
          >
            <motion.span 
              className={isHomePage && !user || isCustomStyledPage ? 'text-white' : 'gradient-text'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Renaissance
            </motion.span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center text-sm gap-1 transition-colors ${
                isHomePage && !user || isCustomStyledPage
                  ? 'text-white/80 hover:text-white'
                  : isActive(item.path)
                  ? "text-foreground font-medium"
                  : "text-foreground/60 hover:text-foreground/80"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XIcon className={`h-6 w-6 ${isHomePage && !user || isCustomStyledPage ? 'text-white' : ''}`} />
          ) : (
            <MenuIcon className={`h-6 w-6 ${isHomePage && !user || isCustomStyledPage ? 'text-white' : ''}`} />
          )}
        </button>

        {/* Right-aligned section with notification and user menu */}
        <div className="flex items-center gap-4">
          {user && <NotificationCenter />}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin">
              <Button 
                variant={isHomePage || isCustomStyledPage ? "outline" : "default"} 
                size="sm"
                className={isHomePage || isCustomStyledPage ? "border-white text-white hover:bg-white hover:text-purple-900" : ""}
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 top-16 z-50 md:hidden ${isCustomStyledPage ? 'bg-purple-900/95' : 'bg-background'}`}>
          <nav className="container py-6 flex flex-col gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center text-base gap-2 p-2 ${
                  isActive(item.path)
                    ? isCustomStyledPage 
                      ? "bg-white/10 rounded-md text-white font-medium"
                      : "bg-accent rounded-md text-foreground font-medium"
                    : isCustomStyledPage
                      ? "text-white/60"
                      : "text-foreground/60"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
