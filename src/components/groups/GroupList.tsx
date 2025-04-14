
import React from "react";
import { Link } from "react-router-dom";
import { Group } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, MapPin, CalendarDays, BookmarkPlus, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface GroupListProps {
  groups: Group[];
  title?: string;
}

const GroupList = ({ groups, title }: GroupListProps) => {
  const { user, updateUserWatchlist } = useAuth();
  const { toast } = useToast();
  
  const watchlist = user ? JSON.parse(localStorage.getItem("userWatchlist") || "{}") : {};
  const watchlistedGroups = watchlist.groups || [];

  const handleToggleWatchlist = (e: React.MouseEvent, groupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    const currentWatchlist = JSON.parse(localStorage.getItem("userWatchlist") || "{}");
    
    if (!currentWatchlist.groups) {
      currentWatchlist.groups = [];
    }
    
    // Add group to watchlist if not already in it
    if (!currentWatchlist.groups.includes(groupId)) {
      currentWatchlist.groups.push(groupId);
      localStorage.setItem("userWatchlist", JSON.stringify(currentWatchlist));
      
      updateUserWatchlist(currentWatchlist);
      
      toast({
        title: "Added to watchlist",
        description: "Group has been added to your watchlist"
      });
    } else {
      // Remove from watchlist
      currentWatchlist.groups = currentWatchlist.groups.filter((id: string) => id !== groupId);
      localStorage.setItem("userWatchlist", JSON.stringify(currentWatchlist));
      
      updateUserWatchlist(currentWatchlist);
      
      toast({
        title: "Removed from watchlist",
        description: "Group has been removed from your watchlist"
      });
    }
  };
  
  if (groups.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">{title || "Groups"}</h2>
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No groups found</p>
        </div>
      </div>
    );
  }

  // Default background images for groups
  const defaultGroupImages = [
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18"
  ];

  // Use the group ID to consistently select an image from the array
  const getBackgroundImage = (groupId: string) => {
    const index = parseInt(groupId.replace(/\D/g, '')) % defaultGroupImages.length;
    return defaultGroupImages[index];
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title || "Groups"}</h2>
      <div className="grid grid-cols-1 gap-6">
        {groups.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`} className="block">
            <motion.div
              className="event-card rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-0">
                {/* Group Image with Category Label */}
                <div 
                  className="h-48 w-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${getBackgroundImage(group.id)})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                  
                  {/* Group type badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-1">
                      {group.isPrivate ? (
                        <>
                          <Lock size={14} />
                          Exclusive Group
                        </>
                      ) : (
                        <>
                          <Users size={14} />
                          Open Group
                        </>
                      )}
                    </span>
                  </div>
                  
                  {/* Watchlist button */}
                  <button 
                    className="absolute top-4 right-4 bg-gray-200/80 rounded-full p-2"
                    onClick={(e) => handleToggleWatchlist(e, group.id)}
                    title={watchlistedGroups.includes(group.id) ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    {watchlistedGroups.includes(group.id) ? 
                      <Bookmark className="h-5 w-5 text-gray-700" /> : 
                      <BookmarkPlus className="h-5 w-5 text-gray-700" />
                    }
                  </button>
                </div>
                
                {/* Group Info */}
                <CardContent className="p-4 bg-orange-100">
                  <h3 className="text-xl font-bold mb-3">{group.name}</h3>
                  
                  <p className="text-sm line-clamp-2 mb-3">{group.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {group.interests.slice(0, 3).map((interest) => (
                      <Badge
                        key={interest.id}
                        variant="secondary"
                        className="bg-black/10 hover:bg-black/20 text-xs"
                      >
                        {interest.name}
                      </Badge>
                    ))}
                    {group.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.interests.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span>{group.members.length} members</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-gray-600" />
                      <span>{group.events.length} events</span>
                    </div>
                    
                    {group.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span>{group.location.city}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
