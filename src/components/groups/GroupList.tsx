
import React from "react";
import { Link } from "react-router-dom";
import { Group } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface GroupListProps {
  groups: Group[];
  title?: string;
}

const GroupList = ({ groups, title }: GroupListProps) => {
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

  // Card color variations
  const getCardColor = (index: number) => {
    const colors = ["card-salmon", "card-peach", "card-mint", "card-teal", "card-navy"];
    return colors[index % colors.length];
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title || "Groups"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group, index) => (
          <Link key={group.id} to={`/groups/${group.id}`} className="profile-card-stack">
            <motion.div
              className={`profile-card ${getCardColor(index)} h-full hover:shadow-lg`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <CardContent className="p-6">
                <div className="profile-card-header mb-3">
                  <h3 className="profile-card-name">{group.name}</h3>
                  <div className="profile-card-badge badge-check">
                    {group.isPrivate ? <Lock size={14} /> : <Users size={14} />}
                  </div>
                </div>
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{group.members.length} members</span>
                  </div>
                  {group.location && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{group.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </motion.div>
            
            {/* Stack effect */}
            <div className={`profile-card profile-card-stacked ${getCardColor(index)} opacity-70 absolute top-0 left-0 w-full h-full -z-10`} />
            <div className={`profile-card profile-card-stacked ${getCardColor(index)} opacity-40 absolute top-0 left-0 w-full h-full -z-20`} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
