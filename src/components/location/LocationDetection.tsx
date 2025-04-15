
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LocationDetection = ({ onComplete, autoDetect = false }: { onComplete?: () => void, autoDetect?: boolean }) => {
  const { updateUserLocation, user } = useAuth();
  const { toast } = useToast();
  const [isDetecting, setIsDetecting] = useState(false);
  const navigate = useNavigate();

  // Auto-detect location when component mounts if autoDetect is true
  useEffect(() => {
    if (autoDetect && !user?.location) {
      detectLocation();
    }
  }, [autoDetect, user]);

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
        
        // Force navigation to events page - explicitly navigate to root/events
        if (onComplete) {
          onComplete();
        } else {
          navigate("/");
        }
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
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm p-6 flex flex-col items-center">
        {/* New Location Icon with Image */}
        <div className="mb-4 w-32 h-32">
          <img 
            src="/lovable-uploads/cee9da71-8977-4ae0-907b-f2ac7b2c5b1b.png" 
            alt="Location Icon" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Header Text */}
        <h3 className="text-xl font-semibold text-center mb-2">
          Activate Location
        </h3>
        
        <p className="text-center text-gray-500 mb-6 max-w-xs">
          To proceed with the registration, enable location access in your phone settings.
        </p>
        
        {/* Allow Access Button */}
        <Button
          onClick={detectLocation}
          disabled={isDetecting}
          className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-6"
          variant="default"
        >
          {isDetecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Detecting Location...
            </>
          ) : (
            "Allow Access"
          )}
        </Button>
        
        {/* Skip Link */}
        {onComplete && (
          <button
            onClick={onComplete}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationDetection;
