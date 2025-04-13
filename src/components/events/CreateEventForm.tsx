
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users, ArrowLeft, X } from "lucide-react";
import InterestSelector from "@/components/profile/InterestSelector";
import LocationDetection from "@/components/location/LocationDetection";
import { MOCK_EVENTS } from "@/services/mockData";
import { Card, CardContent } from "@/components/ui/card";

const CreateEventForm = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create event object
      const newEvent = {
        id: `event-${Date.now()}`,
        title,
        name: title,
        description,
        location: user?.location || { city: "Unknown", country: "Unknown" },
        address: address || undefined,
        dateTime: new Date(`${date}T${time}`),
        startTime: new Date(`${date}T${time}`),
        endTime: new Date(`${date}T${time}`),
        creator: user?.id || "unknown",
        attendees: [user?.id || "unknown"],
        interests: user?.interests || [],
        createdAt: new Date(),
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      };
      
      // In a real app, you would call an API to create the event
      console.log("Creating new event:", newEvent);
      
      // Show success message
      toast({
        title: "Event created!",
        description: "Your event has been successfully created.",
      });
      
      setIsSubmitting(false);
      onClose();
      
      // Navigate to the events page
      navigate("/");
    }, 1000);
  };
  
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Create Event</h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Event Title</label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe your event"
                  rows={4}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </label>
                <Input 
                  id="time" 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <LocationDetection />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <Input 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Enter specific address"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Interests</label>
                <InterestSelector />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Maximum Attendees
                </label>
                <Input 
                  id="maxAttendees" 
                  type="number" 
                  min="1"
                  value={maxAttendees} 
                  onChange={(e) => setMaxAttendees(e.target.value)} 
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
};

export default CreateEventForm;
