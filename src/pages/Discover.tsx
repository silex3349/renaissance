
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SwipeUserCard from "@/components/matching/SwipeUserCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { User } from "@/types";

// Temporary mock implementation of getAllUsers until the real API is available
const getAllUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a list of mock users
  return [
    {
      id: "user1",
      email: "user1@example.com",
      name: "Alex Johnson",
      profileImageUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=user1",
      bio: "Love hiking and photography",
      location: { city: "San Francisco", country: "USA" },
      interests: [
        { id: "hiking", name: "Hiking", category: "Outdoors" },
        { id: "photography", name: "Photography", category: "Arts" }
      ],
      joinedEvents: [],
      matchedUsers: [],
      joinedGroups: [],
      createdAt: new Date()
    },
    {
      id: "user2",
      email: "user2@example.com",
      name: "Sam Taylor",
      profileImageUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=user2",
      bio: "Tech enthusiast and coffee lover",
      location: { city: "Austin", country: "USA" },
      interests: [
        { id: "technology", name: "Technology", category: "Professional" },
        { id: "coffee", name: "Coffee", category: "Food" }
      ],
      joinedEvents: [],
      matchedUsers: [],
      joinedGroups: [],
      createdAt: new Date()
    },
    {
      id: "user3",
      email: "user3@example.com",
      name: "Jordan Lee",
      profileImageUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=user3",
      bio: "Traveling and trying new foods",
      location: { city: "Chicago", country: "USA" },
      interests: [
        { id: "travel", name: "Travel", category: "Adventure" },
        { id: "food", name: "Dining Out", category: "Food" }
      ],
      joinedEvents: [],
      matchedUsers: [],
      joinedGroups: [],
      createdAt: new Date()
    }
  ];
};

const Discover = () => {
  const { user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<Error | null>(null);
  const [displayedUserIds, setDisplayedUserIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setErrorUsers(null);

      try {
        const allUsers = await getAllUsers();
        // Filter out the current user and already displayed users
        const newUsers = allUsers.filter(
          (u) => u.id !== user?.id && !displayedUserIds.includes(u.id)
        );
        setFilteredUsers(newUsers);
      } catch (error: any) {
        setErrorUsers(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user, displayedUserIds]);

  const handleSwipe = (direction: "left" | "right", swipedUser: User) => {
    setDisplayedUserIds((prev) => [...prev, swipedUser.id]);
    setFilteredUsers((prev) => prev.filter((u) => u.id !== swipedUser.id));

    // Log the swipe (for demo purposes)
    console.log(`Swiped ${direction} on user ${swipedUser.id}`);
  };

  const handleReload = () => {
    setDisplayedUserIds([]);
  };

  return (
    <div className="bg-purple-900 min-h-screen">
      <div className="renaissance-container py-12">
        <h1 className="discover-heading">Discover New Connections</h1>
        <p className="discover-subheading">
          Explore profiles and find people who share your interests.
        </p>

        {isLoadingUsers ? (
          <div className="text-center text-white">Loading profiles...</div>
        ) : errorUsers ? (
          <div className="text-center text-red-500">
            Error: {errorUsers.message}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="flex flex-col items-center">
            {filteredUsers.map((user, index) => (
              <SwipeUserCard
                key={user.id}
                user={user}
                onSwipe={handleSwipe}
                isActive={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white">
            <p>No more profiles to display.</p>
            <Button onClick={handleReload}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Profiles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
