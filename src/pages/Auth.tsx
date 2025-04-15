
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/auth/AuthForms";
import OnboardingScreen from "@/components/auth/OnboardingScreen";

const Auth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // If user is already logged in and has completed onboarding
    if (user && !isLoading && user.interests && user.interests.length > 0) {
      navigate("/");
    }
    // If user is logged in but hasn't completed onboarding
    else if (user && !isLoading && (!user.interests || user.interests.length === 0)) {
      setShowOnboarding(true);
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        {showOnboarding ? (
          <OnboardingScreen />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Join Renaissance</h1>
              <p className="text-muted-foreground mt-2">
                Connect with people through shared interests and local activities
              </p>
            </div>
            <AuthForms />
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
