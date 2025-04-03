
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import Onboarding from "../onboarding/Onboarding";

const Layout = () => {
  const { user } = useAuth();
  
  // Check if user exists and has completed the necessary onboarding steps
  const shouldShowOnboarding = user && (
    !user.interests || 
    user.interests.length === 0 || 
    !user.ageRange || 
    !user.location
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {shouldShowOnboarding ? <Onboarding /> : <Outlet />}
      </main>
      <footer className="border-t py-6 bg-card/50">
        <div className="renaissance-container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Renaissance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
