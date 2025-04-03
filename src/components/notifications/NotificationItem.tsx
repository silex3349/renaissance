
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/contexts/NotificationContext";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();
  
  const handleClick = () => {
    markAsRead(notification.id);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  
  const getActionButtons = () => {
    switch (notification.type) {
      case "groupInvite":
        return (
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="w-full" onClick={handleClick}>
              Accept
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              Decline
            </Button>
          </div>
        );
      case "joinRequest":
        return (
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="w-full" onClick={handleClick}>
              Approve
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              Reject
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
        !notification.read ? "bg-muted/30" : ""
      }`}
      onClick={notification.actionUrl ? handleClick : undefined}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${notification.id}`} />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </p>
          {getActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
