
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SwipeUserCard from "@/components/matching/SwipeUserCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    
    if (direction === "right") {
      // Navigate to user profile on right swipe (like)
      navigate(`/profile/${swipedUser.id}`);
    }
  };

  const handleReload = () => {
    setDisplayedUserIds([]);
  };

  const handleUserCardClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="bg-gradient-to-b from-purple-900 to-purple-800 min-h-screen flex flex-col">
      <div className="max-w-md mx-auto w-full py-6 px-4 flex flex-1 flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Discover</h1>
          <p className="text-purple-200">
            Find people with similar interests
          </p>
        </div>

        {isLoadingUsers ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white">
              <RefreshCw className="animate-spin h-10 w-10 mx-auto mb-4" />
              <p>Finding people for you...</p>
            </div>
          </div>
        ) : errorUsers ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-red-300 bg-red-900/30 p-4 rounded-lg">
              <p>Error: {errorUsers.message}</p>
              <Button onClick={handleReload} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full h-[500px] max-h-[70vh]">
              {filteredUsers.slice(0, 3).map((user, index) => (
                <div 
                  key={user.id} 
                  className="absolute top-0 left-0 w-full h-full"
                  onClick={() => handleUserCardClick(user.id)}
                >
                  <SwipeUserCard
                    user={user}
                    onSwipe={handleSwipe}
                    isActive={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="mb-4">No more profiles to display.</p>
              <Button onClick={handleReload} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Profiles
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
