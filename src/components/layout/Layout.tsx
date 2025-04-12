
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Onboarding from "../onboarding/Onboarding";
import { motion } from "framer-motion";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDiscoverPage = location.pathname === "/discover";
  
  // Check if user exists and has completed the necessary onboarding steps
  const shouldShowOnboarding = user && (
    !user.interests || 
    user.interests.length === 0 || 
    !user.ageRange || 
    !user.location
  );

  // Special styling for discover page
  const isCustomStyledPage = isDiscoverPage || location.pathname.includes("/matching");

  return (
    <div className={`min-h-screen flex flex-col ${isCustomStyledPage ? 'page-background-purple' : ''}`}>
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {shouldShowOnboarding ? <Onboarding /> : <Outlet />}
      </motion.main>
      
      {/* Removing footer for cleaner mobile appearance */}
    </div>
  );
};

export default Layout;
