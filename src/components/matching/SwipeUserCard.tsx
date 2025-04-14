
import React from "react";
import { User } from "@/types";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Heart, MapPin } from "lucide-react";

interface SwipeUserCardProps {
  user: User;
  onSwipe: (direction: "left" | "right", user: User) => void;
  isActive: boolean;
}

const SwipeUserCard: React.FC<SwipeUserCardProps> = ({
  user,
  onSwipe,
  isActive,
}) => {
  // Detect swipe gesture
  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    if (!isActive) return;

    const threshold = 100; // px to consider a swipe

    if (info.offset.x > threshold) {
      onSwipe("right", user);
    } else if (info.offset.x < -threshold) {
      onSwipe("left", user);
    }
  };

  return (
    <motion.div
      className={`absolute top-0 left-0 w-full h-full cursor-pointer ${
        isActive ? "z-10" : "z-0"
      }`}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1 : 0.92, 
        opacity: isActive ? 1 : 0.6,
        rotateZ: isActive ? 0 : -2
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="w-full h-full overflow-hidden rounded-2xl border-0 shadow-xl">
        <div 
          className="w-full h-full bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${user.profileImageUrl})`,
            backgroundSize: 'cover'
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Content */}
          <CardContent className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="mb-3">
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold">{user.name.split(' ')[0]}</h2>
                {user.location && (
                  <div className="flex items-center gap-1 text-sm text-white/80">
                    <MapPin size={14} />
                    {user.location.city}
                  </div>
                )}
              </div>
              <p className="text-white/80 line-clamp-2 mt-1">{user.bio}</p>
            </div>
            
            {user.interests && user.interests.length > 0 && (
              <div className="mt-4">
                <p className="text-sm mb-2 text-white/70">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge key={interest.id} variant="secondary" className="bg-white/20 text-white border-0">
                      {interest.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {isActive && (
              <div className="flex justify-between mt-6">
                <button 
                  className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwipe("left", user);
                  }}
                >
                  <X size={24} className="text-white" />
                </button>
                
                <button 
                  className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwipe("right", user);
                  }}
                >
                  <Heart size={24} className="text-white" />
                </button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default SwipeUserCard;
