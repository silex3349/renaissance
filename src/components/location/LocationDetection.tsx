
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MapPin } from "lucide-react";

const LocationDetection = ({ onComplete }: { onComplete?: () => void }) => {
  const { updateUserLocation } = useAuth();
  const { toast } = useToast();
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      });
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateUserLocation(latitude, longitude);
        toast({
          title: "Location detected",
          description: "We'll use this to find events near you.",
        });
        setIsDetecting(false);
        if (onComplete) onComplete();
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Unable to detect your location.";
        
        if (error.code === 1) {
          errorMessage = "Location access denied. Please enable location permissions.";
        }
        
        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsDetecting(false);
      }
    );
  };

  return (
    <div className="space-y-6 p-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium">Discover Events Near You</h3>
        <p className="text-muted-foreground">
          Enable location access to find local events and connect with people in your area.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">
            Your location is only used to show nearby events and will not be shared with other users.
          </p>
        </div>
        
        <Button
          onClick={detectLocation}
          disabled={isDetecting}
          className="w-full"
        >
          {isDetecting ? "Detecting Location..." : "Detect My Location"}
        </Button>
        
        {onComplete && (
          <Button
            variant="outline"
            onClick={onComplete}
            className="w-full"
          >
            Skip For Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationDetection;
