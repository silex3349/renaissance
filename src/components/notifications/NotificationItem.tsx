
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/contexts/NotificationContext";
import { CreditCard, AlertCircle, Check, Wallet } from "lucide-react";

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

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "paymentCompleted":
        return (
          <Avatar className="h-10 w-10 bg-green-100">
            <Check className="h-5 w-5 text-green-600" />
            <AvatarFallback className="bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </AvatarFallback>
          </Avatar>
        );
      case "paymentFailed":
        return (
          <Avatar className="h-10 w-10 bg-red-100">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AvatarFallback className="bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </AvatarFallback>
          </Avatar>
        );
      case "walletUpdated":
        return (
          <Avatar className="h-10 w-10 bg-blue-100">
            <Wallet className="h-5 w-5 text-blue-600" />
            <AvatarFallback className="bg-blue-100">
              <Wallet className="h-5 w-5 text-blue-600" />
            </AvatarFallback>
          </Avatar>
        );
      default:
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${notification.id}`} />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
        );
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
        {getNotificationIcon()}
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
