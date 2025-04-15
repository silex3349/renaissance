
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GoogleLogin } from "@react-oauth/google";
import { Apple } from "lucide-react";
import { createUserFromGoogle, createUserFromApple } from "@/utils/authUtils";

export const SocialSignIn = () => {
  const { signUpWithSocial } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async (response: any) => {
    try {
      const userData = createUserFromGoogle(response);
      await signUpWithSocial(userData);
      toast({
        title: "Google sign-in successful",
        description: "Welcome to Renaissance!",
      });
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // In a real implementation, this would use the Sign in with Apple JS SDK
      // For this demo, we'll simulate the sign-in process
      const mockResponse = { user: "apple_user" };
      const userData = createUserFromApple(mockResponse);
      await signUpWithSocial(userData);
      toast({
        title: "Apple sign-in successful",
        description: "Welcome to Renaissance!",
      });
    } catch (error) {
      toast({
        title: "Apple sign-in failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4 mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => {
              toast({
                title: "Google sign-in failed",
                description: "An error occurred during sign in",
                variant: "destructive",
              });
            }}
            useOneTap
          />
        </div>
        
        <Button
          variant="outline"
          type="button"
          onClick={handleAppleSignIn}
          className="flex items-center justify-center gap-2"
        >
          <Apple className="h-5 w-5" />
          <span>Apple</span>
        </Button>
      </div>
    </div>
  );
};
