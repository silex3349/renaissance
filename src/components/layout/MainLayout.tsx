
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar, Users, MessageSquare, UserCircle2, Search, Filter, Wallet, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import CreateButton from "@/components/events/CreateButton";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import WalletBalance from "@/components/wallet/WalletBalance";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user } = useAuth();
  const { balance } = useWallet();
  
  // Helper to get the current section name
  const getSectionName = () => {
    const path = pathname.split("/")[1];
    switch (path) {
      case "events":
      case "": // Root path shows events
        return "All Events";
      case "groups":
        return "Groups";
      case "messages":
        return "Messages";
      case "profile":
        return "Profile";
      case "wallet":
        return "Wallet";
      case "discover":
        return "Discover";
      default:
        return "Events";
    }
  };

  // Filter options that appear as pills
  const filterOptions = [
    { label: "Discover", path: "/discover" },
    { label: "All", path: "/events?filter=all" },
    { label: "Joined", path: "/events?filter=joined" },
    { label: "Created", path: "/events?filter=created" },
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/events" && pathname === "/") return true;
    return pathname.startsWith(path);
  };

  // Bottom navigation items
  const navItems = [
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Groups", path: "/groups", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Profile", path: "/profile", icon: UserCircle2 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with Title and Icons */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-semibold">{getSectionName()}</h1>
          <div className="flex items-center gap-3">
            <WalletBalance balance={balance} />
            <NotificationCenter />
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="container flex items-center gap-2 py-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-8"
            onFocus={() => navigate('/discover')}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/events?showFilter=true')}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Pills Navigation */}
      <div className="border-b">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="container flex-1 space-x-2 py-2">
            {filterOptions.map((option) => (
              <Button
                key={option.label}
                variant="ghost"
                className={cn(
                  "rounded-full",
                  isCurrentPath(option.path) && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => navigate(option.path)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container py-4">
        <Outlet />
      </main>

      {/* Create Button */}
      <CreateButton 
        viewMode={pathname.includes("groups") ? "groups" : "list"} 
        onClick={() => {}} 
      />

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container flex justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2",
                isCurrentPath(item.path) && "text-primary"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;
