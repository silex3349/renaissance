
import React from "react";
import { Link } from "react-router-dom";
import { Group } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users } from "lucide-react";

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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title || "Groups"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  {group.isPrivate && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-4">
                  {group.interests.slice(0, 3).map((interest) => (
                    <Badge
                      key={interest.id}
                      variant="secondary"
                      className="text-xs"
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
              </CardContent>
              <CardFooter className="p-6 pt-0 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{group.members.length} members</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
