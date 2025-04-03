import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GroupListView from "@/components/groups/GroupListView";
import GroupDetail from "@/components/groups/GroupDetail";
import { MOCK_GROUPS, MOCK_USERS } from "@/services/mockData";

const Groups = () => {
  const { id } = useParams();

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

  return (
    <div className="renaissance-container py-8">
      {isDetailView && currentGroup ? (
        <GroupDetail group={currentGroup} members={members} />
      ) : (
        <GroupListView groups={MOCK_GROUPS} />
      )}
    </div>
  );
};

export default Groups;
