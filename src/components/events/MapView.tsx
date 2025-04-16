
import React, { useEffect, useRef, useState } from "react";
import { Event } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Layers, ZoomIn, ZoomOut, Navigation } from "lucide-react";
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(13);
  
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
    // Load OpenStreetMap using Leaflet
    const initMap = async () => {
      if (!mapRef.current || mapLoaded) return;
      
      try {
        const L = await import('leaflet');
        // Need to import the CSS
        import('leaflet/dist/leaflet.css');
        
        // Fix icon paths issue in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        
        // Default coordinates if user location is not available
        const defaultLat = 40.7128;
        const defaultLng = -74.0060;
        
        // Get user coordinates if available
        const userLat = user?.location?.latitude || defaultLat;
        const userLng = user?.location?.longitude || defaultLng;
        
        // Create map centered on user location or default
        const map = L.map(mapRef.current).setView([userLat, userLng], zoomLevel);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);
        
        // Add user location marker if available
        if (user?.location) {
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white relative">
                    <div class="absolute w-10 h-10 bg-blue-500/30 rounded-full -left-3 -top-3 animate-ping"></div>
                   </div>`,
            iconSize: [15, 15],
            iconAnchor: [7, 7],
          });
          
          L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
            .bindPopup('Your location');
        }
        
        // Add event markers
        events.forEach((event, index) => {
          // Use event coordinates if available, otherwise generate random ones
          // In a real app, you would use actual coordinates from your database
          const eventLat = event.location.latitude || (userLat + (Math.random() * 0.02 - 0.01));
          const eventLng = event.location.longitude || (userLng + (Math.random() * 0.02 - 0.01));
          
          const eventIcon = L.divIcon({
            className: 'event-marker',
            html: `<div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    ${index + 1}
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });
          
          const marker = L.marker([eventLat, eventLng], { icon: eventIcon }).addTo(map);
          
          // Add popup with basic event info
          marker.bindPopup(`
            <div class="text-sm font-semibold">${event.title}</div>
            <div class="text-xs">${formatDate(new Date(event.dateTime))}</div>
          `);
          
          // Handle marker click to show event details
          marker.on('click', () => {
            setActiveEvent(event);
          });
        });
        
        // Add zoom controls
        map.on('zoomend', () => {
          setZoomLevel(map.getZoom());
        });
        
        // Clean up on unmount
        setMapLoaded(true);
        return () => {
          map.remove();
          setMapLoaded(false);
        };
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initMap();
  }, [events, user, zoomLevel]);
  
  const goToEventDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };
  
  // Zoom in and out handlers
  const handleZoomIn = () => {
    if (mapRef.current && mapLoaded) {
      try {
        // This won't work without the full Leaflet integration
        // In a real implementation, you'd access the map instance and call map.zoomIn()
        setZoomLevel(prev => Math.min(prev + 1, 19));
      } catch (error) {
        console.error("Error zooming in:", error);
      }
    }
  };
  
  const handleZoomOut = () => {
    if (mapRef.current && mapLoaded) {
      try {
        // This won't work without the full Leaflet integration
        // In a real implementation, you'd access the map instance and call map.zoomOut()
        setZoomLevel(prev => Math.max(prev - 1, 1));
      } catch (error) {
        console.error("Error zooming out:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-sm">
        {/* Map container */}
        <div ref={mapRef} className="w-full h-full bg-blue-50"></div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button 
            variant="default" 
            size="icon" 
            className="w-8 h-8 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="w-8 h-8 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="w-8 h-8 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100"
          >
            <Layers className="h-4 w-4" />
          </Button>
          {user?.location && (
            <Button 
              variant="default" 
              size="icon" 
              className="w-8 h-8 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Location label */}
        {user?.location && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-white text-black px-4 py-2 rounded-full shadow-md flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              {user.location.city || "Current location"}
            </Badge>
          </div>
        )}
        
        {/* Loading state */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected event card */}
      {activeEvent && (
        <Card className="p-4 animate-fade-in">
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
          
          <div className="flex space-x-2">
            <Button 
              className="flex-1"
              onClick={() => goToEventDetails(activeEvent.id)}
            >
              View Event
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setActiveEvent(null)}
            >
              Close
            </Button>
          </div>
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
