
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NotificationItem from "./NotificationItem";
import { useNotifications } from "@/contexts/NotificationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationCenter = () => {
  const { user } = useAuth();
  const { notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter notifications by type
  const allNotifications = notifications;
  const eventNotifications = notifications.filter(
    (notification) => ["groupInvite", "eventReminder", "joinRequest", "joinRequestApproved", "joinRequestRejected", "joinedGroup"].includes(notification.type)
  );
  const messageNotifications = notifications.filter(
    (notification) => notification.type === "newMessage"
  );
  const paymentNotifications = notifications.filter(
    (notification) => notification.type === "paymentCompleted" || notification.type === "paymentFailed" || notification.type === "walletUpdated"
  );

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Mark all as read when popover is opened
  useEffect(() => {
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  }, [open, unreadCount, markAllAsRead]);

  // Get the notifications for the current tab
  const getNotificationsForTab = () => {
    switch (activeTab) {
      case "events":
        return eventNotifications;
      case "messages":
        return messageNotifications;
      case "payments":
        return paymentNotifications;
      default:
        return allNotifications;
    }
  };

  const currentTabNotifications = getNotificationsForTab();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 mr-2">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
              <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            <div className="max-h-[400px] overflow-y-auto">
              {currentTabNotifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div>
                  {currentTabNotifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              See all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
