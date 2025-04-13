
import React, { useEffect, useRef, useState } from "react";
import { Event } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface MapViewProps {
  events: Event[];
}

const MapView = ({ events }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };
  
  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real app, you would use a library like Mapbox or Google Maps
    
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Apply styling to make it look like a map
      mapRef.current.innerHTML = "";
      const mapContainer = document.createElement("div");
      mapContainer.className = "w-full h-full bg-blue-50 rounded-lg relative";
      
      // Add a simple grid to simulate a map
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const grid = document.createElement("div");
          grid.className = "absolute border border-blue-100";
          grid.style.top = `${i * 10}%`;
          grid.style.left = `${j * 10}%`;
          grid.style.width = "10%";
          grid.style.height = "10%";
          mapContainer.appendChild(grid);
        }
      }
      
      // Add event markers to the map
      events.forEach((event, index) => {
        const marker = document.createElement("div");
        marker.className = "absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform";
        
        // Random position for demo purposes
        // In a real app, you would use actual coordinates
        const left = 10 + Math.random() * 80;
        const top = 10 + Math.random() * 80;
        
        marker.style.left = `${left}%`;
        marker.style.top = `${top}%`;
        marker.textContent = `${index + 1}`;
        
        marker.addEventListener("click", () => {
          setActiveEvent(event);
        });
        
        mapContainer.appendChild(marker);
      });
      
      // Add current location marker if available
      if (user?.location) {
        const userMarker = document.createElement("div");
        userMarker.className = "absolute w-6 h-6 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 z-10";
        userMarker.style.left = "50%";
        userMarker.style.top = "50%";
        userMarker.innerHTML = "●";
        
        const pulse = document.createElement("div");
        pulse.className = "absolute w-12 h-12 bg-blue-500 rounded-full opacity-30 animate-ping";
        pulse.style.left = "50%";
        pulse.style.top = "50%";
        pulse.style.transform = "translate(-50%, -50%)";
        
        mapContainer.appendChild(pulse);
        mapContainer.appendChild(userMarker);
      }
      
      mapRef.current.appendChild(mapContainer);
    };
    
    initMap();
  }, [events, user]);
  
  const goToEventDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-sm">
        <div ref={mapRef} className="w-full h-full"></div>
        
        {/* Location label */}
        {user?.location && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-white text-black px-4 py-2 rounded-full shadow-md flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              {user.location.city || "Current location"}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Selected event card */}
      {activeEvent && (
        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-3">{activeEvent.title}</h3>
          
          <div className="space-y-2 mb-4">
            {/* Date and Time */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-gray-800">{formatDate(new Date(activeEvent.dateTime))}</div>
                <div className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(activeEvent.dateTime), { addSuffix: true })}
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div className="text-gray-800">
                {activeEvent.address || (activeEvent.location.city ? activeEvent.location.city : "Unknown location")}
              </div>
            </div>
            
            {/* Attendees */}
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <div className="text-gray-800">
                {activeEvent.attendees.length} attendees
                {activeEvent.maxAttendees && ` / ${activeEvent.maxAttendees} spots`}
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => goToEventDetails(activeEvent.id)}
          >
            View Event
          </Button>
        </Card>
      )}
    </div>
  );
};

// Badge component for the location label
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {children}
    </div>
  );
};

export default MapView;
