
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupListView from "@/components/groups/GroupListView";
import GroupDetail from "@/components/groups/GroupDetail";
import { MOCK_GROUPS, MOCK_USERS } from "@/services/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Groups = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserWatchlist } = useAuth();
  const { toast } = useToast();

  // If we have an ID parameter, we're on the group detail page
  // Otherwise, we show the group list
  const isDetailView = !!id;

  // Find the current group if we're on the detail page
  const currentGroup = isDetailView
    ? MOCK_GROUPS.find((group) => group.id === id)
    : null;

  // Get members for the current group
  const members = currentGroup
    ? MOCK_USERS.filter((user) => currentGroup.members.includes(user.id))
    : [];

  // Handle case when group is not found
  useEffect(() => {
    if (isDetailView && !currentGroup) {
      navigate("/groups");
      toast({
        title: "Group not found",
        description: "The group you're looking for doesn't exist.",
        variant: "destructive"
      });
    }
  }, [isDetailView, currentGroup, navigate, toast]);

  const handleAddToWatchlist = (groupId: string) => {
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

  return (
    <div className="min-h-screen pb-20">
      {isDetailView && currentGroup ? (
        <GroupDetail 
          group={currentGroup} 
          members={members} 
          onAddToWatchlist={handleAddToWatchlist}
        />
      ) : (
        <GroupListView groups={MOCK_GROUPS} />
      )}
    </div>
  );
};

export default Groups;
