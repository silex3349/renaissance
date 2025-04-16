
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCheck,
  Video,
  Mic,
  Image as ImageIcon,
  MessageSquare,
  UserPlus,
  Pin,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { InterestTag } from "./InterestTag";
import { Interest } from "@/types";
import { getAvatarColor } from "@/utils/chatUtils";

interface ChatInfo {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  interests?: Interest[];
  sharedInterests?: Interest[];
  isOnline?: boolean;
  lastActive?: Date;
  isPinned?: boolean;
  lastMessage: {
    text: string;
    time: Date;
    senderId: string;
    status?: "sent" | "delivered" | "read";
    type?: "text" | "image" | "voice" | "video";
    isUnread?: boolean;
  };
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
  filterType?: string;
  searchTerm?: string;
}

const ChatList = ({ onSelectChat, selectedChatId, filterType = "all", searchTerm = "" }: ChatListProps) => {
  // Mock chat data
  const mockChats: ChatInfo[] = [
    {
      id: "chat1",
      type: "direct",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user_1",
      sharedInterests: [{ id: "int1", name: "Reading", category: "Hobbies" }],
      isOnline: true,
      isPinned: true,
      lastMessage: {
        text: "Hey! Are you coming to the book club event tomorrow?",
        time: new Date(Date.now() - 1000 * 60 * 5),
        senderId: "user_1",
        status: "read",
        isUnread: true,
      }
    },
    {
      id: "chat2",
      type: "group",
      name: "Photography Club",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group_1",
      interests: [{ id: "int1", name: "Photography", category: "Arts" }],
      lastMessage: {
        text: "Check out this awesome photo I took!",
        time: new Date(Date.now() - 1000 * 60 * 30),
        senderId: "user_2",
        type: "image",
        status: "delivered",
      }
    },
    {
      id: "chat3",
      type: "direct",
      name: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user_3",
      isOnline: false,
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3),
      lastMessage: {
        text: "Voice message (0:42)",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2),
        senderId: "user_3",
        type: "voice",
        status: "delivered",
      }
    },
    {
      id: "chat4",
      type: "group",
      name: "Weekend Hiking",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group_2",
      interests: [{ id: "int2", name: "Hiking", category: "Outdoors" }],
      lastMessage: {
        text: "Let's meet at the trailhead at 9am",
        time: new Date(Date.now() - 1000 * 60 * 60 * 5),
        senderId: "user_4",
        status: "read",
      }
    },
    {
      id: "chat5",
      type: "direct",
      name: "Emma Thompson",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user_5",
      isOnline: false,
      lastMessage: {
        text: "Missed video call",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24),
        senderId: "user_5",
        type: "video",
        status: "read",
      }
    },
  ];

  // Filter chats based on type and search term
  const filteredChats = mockChats
    .filter(chat => {
      if (filterType === "all") return true;
      if (filterType === "direct") return chat.type === "direct";
      if (filterType === "groups") return chat.type === "group";
      return true;
    })
    .filter(chat => {
      if (!searchTerm) return true;
      return (
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    // Sort pinned chats to the top
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageIcon = (type?: string) => {
    if (!type || type === 'text') return null;
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4 text-muted-foreground mr-1" />;
      case 'voice':
        return <Mic className="h-4 w-4 text-muted-foreground mr-1" />;
      case 'video':
        return <Video className="h-4 w-4 text-muted-foreground mr-1" />;
      default:
        return null;
    }
  };

  if (filteredChats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <p className="text-muted-foreground">No conversations found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? "Try a different search term" : "Start a new conversation"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-muted/50">
      {filteredChats.map((chat) => (
        <motion.div
          key={chat.id}
          className={`chat-card p-3 cursor-pointer ${
            selectedChatId === chat.id ? "chat-card-active" : ""
          } ${chat.isPinned ? "bg-muted/20" : ""}`}
          onClick={() => onSelectChat(chat.id)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-start gap-3">
            {/* Avatar with online indicator */}
            <div className="relative">
              <Avatar className="h-12 w-12 ring-1 ring-muted/30">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback 
                  style={{ backgroundColor: getAvatarColor(chat.id) }}
                  className="text-white"
                >
                  {chat.type === "group" 
                    ? <Users className="h-5 w-5" /> 
                    : chat.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              {chat.type === "direct" && (
                <div className={`chat-avatar-indicator ${chat.isOnline ? "online-indicator" : "offline-indicator"}`}></div>
              )}
              
              {chat.isPinned && (
                <div className="absolute -top-1 -right-1 bg-primary/10 rounded-full p-0.5">
                  <Pin className="h-3 w-3 text-primary" />
                </div>
              )}
            </div>
            
            {/* Chat content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-medium text-foreground">{chat.name}</h3>
                  
                  {chat.type === "group" && (
                    <Badge variant="outline" className="h-5 text-xs font-normal text-muted-foreground border-muted/30">
                      <Users className="h-3 w-3 mr-1" />
                      Group
                    </Badge>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(chat.lastMessage.time)}
                </span>
              </div>
              
              {/* Interest tags for group chats */}
              {chat.type === "group" && chat.interests && (
                <div className="flex mt-0.5 mb-1">
                  {chat.interests.map(interest => (
                    <InterestTag
                      key={interest.id}
                      interest={interest}
                      isSelected={true}
                      minimal={true}
                    />
                  ))}
                </div>
              )}
              
              {/* Shared interests for direct chats */}
              {chat.type === "direct" && chat.sharedInterests && chat.sharedInterests.length > 0 && (
                <div className="flex mt-0.5 mb-1">
                  <div className="chat-pill bg-primary/10 text-xs text-primary">
                    <span>Common interest: {chat.sharedInterests[0].name}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center max-w-[85%]">
                  {getMessageIcon(chat.lastMessage.type)}
                  <span className="text-sm text-muted-foreground message-preview">
                    {chat.lastMessage.text}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  {chat.lastMessage.senderId === "me" && (
                    <CheckCheck className={`h-4 w-4 ${
                      chat.lastMessage.status === "read" ? "text-primary" : "text-muted-foreground"
                    }`} />
                  )}
                  
                  {chat.lastMessage.isUnread && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">1</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatList;
