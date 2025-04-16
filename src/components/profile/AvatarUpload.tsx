
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  initialAvatar: string;
  onAvatarChange: (avatarUrl: string) => void;
  userInitials: string;
}

const AvatarUpload = ({ initialAvatar, onAvatarChange, userInitials }: AvatarUploadProps) => {
  const [avatar, setAvatar] = useState(initialAvatar || "");
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server/storage
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      onAvatarChange(imageUrl);
      
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
      
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated."
      });
    }
  };

  const removeAvatar = () => {
    setAvatar("");
    onAvatarChange("");
    toast({
      title: "Photo removed",
      description: "Your profile photo has been removed."
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div 
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHoveringAvatar(true)}
          onMouseLeave={() => setIsHoveringAvatar(false)}
          onClick={handleAvatarClick}
        >
          <Avatar className="h-28 w-28 mb-2 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
            {avatar ? (
              <AvatarImage 
                src={avatar} 
                alt="Profile Photo" 
              />
            ) : (
              <AvatarFallback className="bg-muted flex items-center justify-center">
                {!avatar && <Camera className="h-10 w-10 text-muted-foreground opacity-50" />}
                {!avatar && <AvatarFallback>{userInitials}</AvatarFallback>}
              </AvatarFallback>
            )}
          </Avatar>
          
          {isHoveringAvatar && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <Camera className="h-10 w-10 text-white" />
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      
      <div className="flex gap-2 mt-2">
        <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
          <Camera className="h-4 w-4 mr-2" />
          {avatar ? "Change Photo" : "Upload Photo"}
        </Button>
        
        {avatar && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={removeAvatar} 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
