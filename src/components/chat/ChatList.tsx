
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MoreVertical, CheckCheck, Video, Mic, Image } from "lucide-react";
import { MOCK_USERS } from "@/services/mockData";
import { motion } from "framer-motion";

interface ChatInfo {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
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
}

const ChatList = ({ onSelectChat, selectedChatId }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const mockChats: ChatInfo[] = [
    {
      id: "chat1",
      type: "direct",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user_1",
      lastMessage: {
        text: "Hey! Are you coming to the event tomorrow?",
        time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
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
      lastMessage: {
        text: "Check out this awesome photo I took!",
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
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
      lastMessage: {
        text: "Voice message (0:42)",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
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
      lastMessage: {
        text: "Let's meet at the trailhead at 9am",
        time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        senderId: "user_4",
        status: "read",
      }
    },
    {
      id: "chat5",
      type: "direct",
      name: "Emma Thompson",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user_5",
      lastMessage: {
        text: "Missed video call",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        senderId: "user_5",
        type: "video",
        status: "read",
      }
    },
  ];

  const filteredChats = mockChats.filter(chat => {
    if (!searchQuery) return true;
    return chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           chat.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
  }).filter(chat => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return chat.lastMessage.isUnread;
    if (activeTab === "groups") return chat.type === "group";
    return true;
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
        return <Image className="h-4 w-4 text-muted-foreground mr-1" />;
      case 'voice':
        return <Mic className="h-4 w-4 text-muted-foreground mr-1" />;
      case 'video':
        return <Video className="h-4 w-4 text-muted-foreground mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold">Chats</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <MoreVertical className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-primary/10 text-primary">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="grid grid-cols-4 bg-transparent p-0 h-10">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="groups" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 overflow-y-auto m-0 p-0">
          {filteredChats.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            <ul className="divide-y">
              {filteredChats.map((chat) => (
                <motion.li 
                  key={chat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`hover:bg-muted/30 cursor-pointer ${selectedChatId === chat.id ? 'bg-muted/50' : ''}`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-start p-3 gap-3">
                    <Avatar className="h-12 w-12 rounded-full border">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(chat.lastMessage.time)}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        {getMessageIcon(chat.lastMessage.type)}
                        <span className="truncate">{chat.lastMessage.text}</span>
                      </div>
                    </div>
                    {chat.lastMessage.isUnread && (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0"></div>
                    )}
                    {chat.lastMessage.senderId === "me" && (
                      <CheckCheck className={`h-4 w-4 flex-shrink-0 ${
                        chat.lastMessage.status === "read" ? "text-blue-500" : "text-muted-foreground"
                      }`} />
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="unread" className="flex-1 overflow-y-auto m-0 p-0">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No unread messages</p>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="flex-1 overflow-y-auto m-0 p-0">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No group chats</p>
          </div>
        </TabsContent>

        <TabsContent value="archived" className="flex-1 overflow-y-auto m-0 p-0">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No archived chats</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatList;
