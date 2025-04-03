
import { useState } from "react";
import { Heart, X } from "lucide-react";
import { User } from "@/types";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SwipeUserCardProps {
  user: User;
  onSwipe: (direction: "left" | "right", user: User) => void;
  isActive: boolean;
}

// Helper function to find common interests between two users
const findCommonInterests = (user1: User, user2: User) => {
  if (!user1.interests || !user2.interests) return [];
  
  return user1.interests.filter(interest1 => 
    user2.interests.some(interest2 => interest1.id === interest2.id)
  );
};

const SwipeUserCard = ({ user, onSwipe, isActive }: SwipeUserCardProps) => {
  const controls = useAnimation();
  const { toast } = useToast();
  const [exitX, setExitX] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right - like
      setExitX(window.innerWidth);
      setDirection("right");
      controls.start({ x: window.innerWidth, opacity: 0 });
      onSwipe("right", user);
    } else if (info.offset.x < -threshold) {
      // Swiped left - pass
      setExitX(-window.innerWidth);
      setDirection("left");
      controls.start({ x: -window.innerWidth, opacity: 0 });
      onSwipe("left", user);
    } else {
      // Not enough swipe distance, return to center
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleDrag = (_: any, info: PanInfo) => {
    // Calculate rotation based on drag distance
    const rotate = info.offset.x * 0.05;
    controls.start({ 
      x: info.offset.x, 
      rotate: rotate, 
      opacity: 1 - (Math.abs(info.offset.x) / (window.innerWidth / 2))
    });
  };

  // Styles and animations for the swipe action buttons
  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    hover: { scale: 1, opacity: 1 }
  };

  return (
    <motion.div
      className={`absolute top-0 left-0 right-0 h-full w-full cursor-grab active:cursor-grabbing ${!isActive && "pointer-events-none"}`}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      animate={controls}
      initial={{ x: 0, opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9, rotate: 0 }}
      exit={{ 
        x: exitX, 
        opacity: 0,
        transition: { duration: 0.2 }
      }}
      transition={{ type: "spring", damping: 50, stiffness: 500 }}
      style={{ zIndex: isActive ? 10 : 0 }}
    >
      <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-lg flex flex-col">
        {/* User profile section - minimal, no photos */}
        <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 h-2/5">
          <div className="h-24 w-24 bg-primary/30 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl text-primary">
              {user.email[0].toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* User interests */}
        <div className="p-5 flex-grow flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">Common Interests</h2>
          
          {/* Interest tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {user.interests.map(interest => (
              <span 
                key={interest.id}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {interest.name}
              </span>
            ))}
          </div>
          
          {user.ageRange && (
            <div className="text-center text-muted-foreground mb-2">
              Age range: {user.ageRange}
            </div>
          )}
          
          {user.location && user.location.city && (
            <div className="text-center text-muted-foreground mb-4">
              Location: {user.location.city}
            </div>
          )}
          
          <div className="mt-auto text-center text-muted-foreground">
            <p>Swipe right to connect, left to pass</p>
          </div>
        </div>
      </div>
      
      {/* Overlays for swipe directions */}
      <motion.div 
        className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: direction === "right" ? 0.7 : 0 }}
      >
        <Heart className="w-24 h-24 text-white" />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 bg-red-500/30 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: direction === "left" ? 0.7 : 0 }}
      >
        <X className="w-24 h-24 text-white" />
      </motion.div>
      
      {/* Swipe action buttons */}
      {isActive && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-10 pointer-events-none">
          <motion.button
            className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center pointer-events-auto"
            onClick={() => {
              controls.start({ 
                x: -window.innerWidth, 
                opacity: 0,
                transition: { duration: 0.3 }
              });
              setDirection("left");
              onSwipe("left", user);
            }}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 500 }}
          >
            <X className="w-8 h-8 text-red-500" />
          </motion.button>
          
          <motion.button
            className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center pointer-events-auto"
            onClick={() => {
              controls.start({ 
                x: window.innerWidth, 
                opacity: 0,
                transition: { duration: 0.3 }
              });
              setDirection("right");
              onSwipe("right", user);
              toast({
                title: "Match request sent!",
                description: "You'll be notified if they match with you too",
              });
            }}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 500 }}
          >
            <Heart className="w-8 h-8 text-green-500" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default SwipeUserCard;
