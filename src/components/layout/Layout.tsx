
import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDiscoverPage = location.pathname === "/discover";
  
  // Special styling for discover page
  const isCustomStyledPage = isDiscoverPage || location.pathname.includes("/matching");

  // Determine active tab for bottom navigation
  const isEventsActive = location.pathname === "/" || location.pathname.includes("/events");
  const isChatsActive = location.pathname.includes("/chats");
  const isProfileActive = location.pathname.includes("/profile");

  return (
    <div className={`min-h-screen flex flex-col ${isCustomStyledPage ? 'page-background-purple' : ''}`}>
      <motion.main 
        className="flex-1 pb-16" // Added padding to bottom to accommodate navigation bar
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
        <div className="flex justify-around items-center">
          <Link to="/" className={`flex flex-col items-center p-2 ${isEventsActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Events</span>
          </Link>
          <Link to="/chats" className={`flex flex-col items-center p-2 ${isChatsActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center p-2 ${isProfileActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
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
      </div>
    </div>
  );
};

export default Layout;
