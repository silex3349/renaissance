
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Users, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/layout/Header";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDiscoverPage = location.pathname === "/discover";
  
  const isCustomStyledPage = isDiscoverPage || location.pathname.includes("/matching");

  const isEventsActive = location.pathname === "/" || location.pathname.includes("/events");
  const isChatsActive = location.pathname.includes("/chats");
  const isGroupsActive = location.pathname.includes("/groups");
  const isProfileActive = location.pathname.includes("/profile");

  return (
    <div className={`min-h-screen flex flex-col ${isCustomStyledPage ? 'page-background-purple' : ''}`}>
      <Header />
      
      <motion.main 
        className="flex-1 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10 shadow-md">
        <div className="flex justify-around items-center">
          <Link to="/" className={`flex flex-col items-center p-2 ${isEventsActive ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'}`}>
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Events</span>
          </Link>
          <Link to="/chats" className={`flex flex-col items-center p-2 ${isChatsActive ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'}`}>
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          <Link to="/groups" className={`flex flex-col items-center p-2 ${isGroupsActive ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'}`}>
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Groups</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center p-2 ${isProfileActive ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'}`}>
            {user ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar || user.profileImageUrl} alt={user.name || "User"} />
                <AvatarFallback className="text-xs">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-6 w-6" />
            )}
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
