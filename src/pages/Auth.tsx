
import { AuthForms } from "@/components/auth/AuthForms";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { user } = useAuth();

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Renaissance</h1>
          <p className="text-muted-foreground mt-2">
            Connect with others through shared interests and activities
          </p>
        </div>
        
        <AuthForms />
      </div>
    </div>
  );
};

export default Auth;
