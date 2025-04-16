
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileEditHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center pt-6 px-4 mb-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-2" 
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">Profile Settings</h1>
    </div>
  );
};

export default ProfileEditHeader;
