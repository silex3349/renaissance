
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, X } from "lucide-react";
import EventBasicInfo from "./form/EventBasicInfo";
import EventDateTime from "./form/EventDateTime";
import EventLocation from "./form/EventLocation";
import EventSettings from "./form/EventSettings";

const CreateEventForm = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [isExclusive, setIsExclusive] = useState(false);
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
        isExclusive: isExclusive,
        pendingRequests: [],
      };
      
      console.log("Creating new event:", newEvent);
      
      toast({
        title: "Event created!",
        description: "Your event has been successfully created.",
      });
      
      setIsSubmitting(false);
      onClose();
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
        <EventBasicInfo
          title={title}
          description={description}
          onTitleChange={(e) => setTitle(e.target.value)}
          onDescriptionChange={(e) => setDescription(e.target.value)}
        />
        
        <EventDateTime
          date={date}
          time={time}
          onDateChange={(e) => setDate(e.target.value)}
          onTimeChange={(e) => setTime(e.target.value)}
        />
        
        <EventLocation
          address={address}
          onAddressChange={(e) => setAddress(e.target.value)}
        />
        
        <EventSettings
          maxAttendees={maxAttendees}
          isExclusive={isExclusive}
          onMaxAttendeesChange={(e) => setMaxAttendees(e.target.value)}
          onExclusiveChange={setIsExclusive}
        />
        
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
