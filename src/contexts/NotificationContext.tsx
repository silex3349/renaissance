
import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`renaissance_notifications_${user.id}`);
      if (storedNotifications) {
        try {
          // Parse and ensure timestamps are Date objects
          const parsedNotifications = JSON.parse(storedNotifications)
            .map((notification: any) => ({
              ...notification,
              timestamp: new Date(notification.timestamp)
            }));
          setNotifications(parsedNotifications);
        } catch (error) {
          console.error("Failed to parse notifications:", error);
          localStorage.removeItem(`renaissance_notifications_${user.id}`);
        }
      } else {
        // Add some mock notifications for demo purposes
        const mockNotifications: Notification[] = [
          {
            id: "notif_1",
            type: "groupInvite",
            message: "Alex invited you to join the Photography Enthusiasts group",
            actionUrl: "/groups/group_1",
            timestamp: new Date(Date.now() - 3600000 * 2),
            read: false,
          },
          {
            id: "notif_2",
            type: "eventReminder",
            message: "Reminder: Photography Workshop starts in 2 hours",
            actionUrl: "/events/event_1",
            timestamp: new Date(Date.now() - 3600000),
            read: false,
          },
          {
            id: "notif_3",
            type: "newMessage",
            message: "Sarah sent you a message",
            actionUrl: "/messages/msg_1",
            timestamp: new Date(Date.now() - 1800000),
            read: false,
          },
        ];
        setNotifications(mockNotifications);
        localStorage.setItem(`renaissance_notifications_${user.id}`, JSON.stringify(mockNotifications));
      }
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`renaissance_notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    
    // Show toast for new notification
    toast(notification.message, {
      action: {
        label: "View",
        onClick: () => {
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          }
          markAsRead(newNotification.id);
        },
      },
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
