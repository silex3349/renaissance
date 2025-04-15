
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";

const LocationDetection = ({ onComplete, autoDetect = false }: { onComplete?: () => void, autoDetect?: boolean }) => {
  const { updateUserLocation, user } = useAuth();
  const { toast } = useToast();
  const [isDetecting, setIsDetecting] = useState(false);

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
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl overflow-hidden bg-gray-100 shadow-sm">
        {/* Header with App Icon */}
        <div className="flex justify-center py-4 bg-gray-200 relative">
          <MapPin className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-medium text-center mt-4 px-6">
            Allow My App to access this device's precise location?
          </h3>
        </div>
        
        {/* Location Options */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {/* Precise Location Option */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-2 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-grid-pattern"></div>
              </div>
              <MapPin className="w-10 h-10 text-blue-500" />
            </div>
            <span className="text-sm font-medium">Precise</span>
          </div>
          
          {/* Approximate Location Option */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="h-full w-full map-pattern">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30,20 L50,10 L70,20 L70,80 L50,90 L30,80 Z" fill="none" stroke="#FFD700" strokeWidth="1" />
                    <path d="M50,10 L50,90" fill="none" stroke="#FFD700" strokeWidth="1" />
                    <circle cx="50" cy="40" r="3" fill="#3B82F6" />
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-sm font-medium">Approximate</span>
          </div>
        </div>
        
        {/* Permission Options */}
        <div className="flex flex-col space-y-2 p-4">
          <Button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            variant="ghost"
          >
            {isDetecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Detecting Location...
              </>
            ) : (
              "While using the app"
            )}
          </Button>
          
          <Button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full text-blue-500"
            variant="ghost"
          >
            Only this time
          </Button>
          
          <Button
            onClick={onComplete}
            className="w-full text-blue-500"
            variant="ghost"
          >
            Deny
          </Button>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(200, 220, 240, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200, 220, 240, 0.3) 1px, transparent 1px);
          background-size: 8px 8px;
        }
        
        .map-pattern {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default LocationDetection;
