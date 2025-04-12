
import React, { useState } from "react";
import { Plus, Target, Check, Search, MapPin, HeadphonesIcon, Music, Coffee, Book, Users, Camera, PenTool, Code, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_USERS } from "@/services/mockData";

// A simplified version of the User type for the Discover page
type DiscoverUser = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  interests: string[];
  location: string;
  badge: "plus" | "target" | "check";
};

// Convert MOCK_USERS to the format we need, with added badge types
const discoverUsers: DiscoverUser[] = MOCK_USERS.map((user, index) => ({
  id: user.id,
  name: user.name || user.email.split('@')[0],
  avatar: user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
  bio: user.bio || "Renaissance community member",
  interests: user.interests?.map(i => i.name) || ["Community", "Connection"],
  location: user.location?.city || "Nearby",
  // Distribute badge types evenly
  badge: index % 3 === 0 ? "plus" : index % 3 === 1 ? "target" : "check"
}));

// Define card colors
const cardColors = ["card-salmon", "card-peach", "card-mint", "card-teal", "card-navy"];

const Discover = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInterest, setFilterInterest] = useState<string | null>(null);
  
  const filteredUsers = discoverUsers.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          person.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInterest = !filterInterest || person.interests.includes(filterInterest);
    return matchesSearch && matchesInterest;
  });
  
  // Common interests that can be filtered
  const interestFilters = [
    { name: "Music", icon: <Music size={16} /> },
    { name: "Coffee", icon: <Coffee size={16} /> },
    { name: "Reading", icon: <Book size={16} /> },
    { name: "Community", icon: <Users size={16} /> },
    { name: "Photography", icon: <Camera size={16} /> },
    { name: "Art", icon: <PenTool size={16} /> },
    { name: "Coding", icon: <Code size={16} /> },
    { name: "Cycling", icon: <Bike size={16} /> },
  ];
  
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "plus": return <Plus size={14} />;
      case "target": return <Target size={14} />;
      case "check": return <Check size={14} />;
      default: return null;
    }
  };
  
  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case "plus": return "badge-plus";
      case "target": return "badge-target";
      case "check": return "badge-check";
      default: return "";
    }
  };

  return (
    <div className="page-background-purple min-h-screen pb-20">
      <div className="renaissance-container pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="discover-heading">Community Discover Page</h1>
          <p className="discover-subheading">Find connections that matter to you</p>
          
          {/* Search and Filter */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white" />
              <Input
                placeholder="Search community members..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {interestFilters.map((interest) => (
                <Button
                  key={interest.name}
                  size="sm"
                  variant={filterInterest === interest.name ? "default" : "outline"}
                  className={`rounded-full ${
                    filterInterest === interest.name
                      ? "bg-white text-purple-900"
                      : "bg-transparent border-white/20 text-white hover:bg-white/10"
                  }`}
                  onClick={() => setFilterInterest(filterInterest === interest.name ? null : interest.name)}
                >
                  <span className="mr-1">{interest.icon}</span>
                  {interest.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredUsers.map((person, index) => (
              <div key={person.id} className="profile-card-stack">
                <motion.div
                  className={`profile-card ${cardColors[index % cardColors.length]}`}
                  whileHover={{ y: -8, rotate: -1, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="h-32 bg-gradient-to-b from-black/20 to-transparent overflow-hidden">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="profile-card-content">
                    <div className="profile-card-header">
                      <h3 className="profile-card-name">{person.name}</h3>
                      <div className={`profile-card-badge ${getBadgeClass(person.badge)}`}>
                        {getBadgeIcon(person.badge)}
                      </div>
                    </div>
                    
                    <p className="text-sm line-clamp-2 mb-3 flex-grow">
                      {person.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {person.interests.slice(0, 2).map((interest) => (
                        <span
                          key={interest}
                          className="inline-block bg-black/10 px-2 py-1 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {person.interests.length > 2 && (
                        <span className="inline-block bg-black/10 px-2 py-1 rounded-full text-xs">
                          +{person.interests.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="profile-card-details flex items-center text-xs">
                      <MapPin size={12} className="mr-1" />
                      {person.location}
                    </div>
                  </div>
                </motion.div>
                
                {/* Stack effect shadow cards */}
                <div className={`profile-card profile-card-stacked ${cardColors[index % cardColors.length]} opacity-70 absolute top-0 left-0 w-full h-full -z-10`} />
                <div className={`profile-card profile-card-stacked ${cardColors[index % cardColors.length]} opacity-40 absolute top-0 left-0 w-full h-full -z-20`} />
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Bottom Action Buttons */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8">
          <button className="action-button">
            <HeadphonesIcon size={24} />
          </button>
          <button className="action-button">
            <Users size={24} />
          </button>
          <button className="action-button">
            <MapPin size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discover;
