import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/services/apiUsers";
import { useAuth } from "@/contexts/AuthContext";
import SwipeUserCard from "@/components/matching/SwipeUserCard";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const Discover = () => {
  const { user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
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

  const handleSwipe = (userId: string, direction: "left" | "right") => {
    setDisplayedUserIds((prev) => [...prev, userId]);
    setFilteredUsers((prev) => prev.filter((u) => u.id !== userId));

    // Log the swipe (for demo purposes)
    console.log(`Swiped ${direction} on user ${userId}`);
  };

  const handleReload = () => {
    setDisplayedUserIds([]);
  };

  const renderUserCards = () => {
    return filteredUsers.map((user) => {
      // Extract display name from email if name is not available
      const displayName = user.name || user.email.split('@')[0];
      
      // Use avatar if available, otherwise generate one
      const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`;
      
      // Use bio if available, otherwise use a placeholder
      const userBio = user.bio || "No bio available";
      
      return (
        <SwipeUserCard
          key={user.id}
          userId={user.id}
          name={displayName}
          avatar={avatarUrl}
          bio={userBio}
          location={user.location?.city || "Unknown location"}
          interests={user.interests || []}
          onSwipe={handleSwipe}
        />
      );
    });
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
          <div className="flex flex-col items-center">{renderUserCards()}</div>
        ) : (
          <div className="text-center text-white">
            <p>No more profiles to display.</p>
            <Button onClick={handleReload}>
              <ReloadIcon className="mr-2 h-4 w-4" />
              Reload Profiles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
