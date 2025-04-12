
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
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
      <Header />
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {shouldShowOnboarding ? <Onboarding /> : <Outlet />}
      </motion.main>
      {!(isHomePage && !user) && !isCustomStyledPage && (
        <footer className="border-t py-6 bg-card/50">
          <div className="renaissance-container text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Renaissance. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
