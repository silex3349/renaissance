import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  MoreVertical,
  CheckCheck,
  Video,
  Mic,
  Image as ImageIcon,
  UserPlus,
  Users,
  MessageSquare,
  Filter,
  BookOpen,
  Palette,
  Camera
} from "lucide-react";
import { MOCK_USERS } from "@/services/mockData";
import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { InterestTag } from "./InterestTag";
import { Interest } from "@/types";

interface ChatInfo {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  interests?: Interest[];
  sharedInterests?: Interest[];
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

const getInterestIcon = (interestName: string) => {
  const iconMap: Record<string, React.ComponentType> = {
    "Reading": BookOpen,
    "Art": Palette,
    "Photography": Camera,
  };
  return iconMap[interestName] || MessageSquare;
};

const ChatList = ({ onSelectChat, selectedChatId }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const { toast } = useToast();

  const mockChats: ChatInfo[] = [
    {
      id: "chat1",
      type: "direct",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user_1",
      sharedInterests: [{ id: "int1", name: "Reading", category: "Hobbies" }],
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
      lastMessage: {
        text: "Missed video call",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24),
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
        return <ImageIcon className="h-4 w-4 text-muted-foreground mr-1" />;
      case 'voice':
        return <Mic className="h-4 w-4 text-muted-foreground mr-1" />;
      case 'video':
        return <Video className="h-4 w-4 text-muted-foreground mr-1" />;
      default:
        return null;
    }
  };

  const handleStartChat = (userId: string) => {
    toast({
      title: "Chat started",
      description: "New conversation has been created"
    });
    setNewChatOpen(false);
    
    if (mockChats.length > 0) {
      onSelectChat(mockChats[0].id);
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      toast({
        title: "Cannot create group",
        description: "Please provide a group name and select at least one member",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Group created",
      description: `${groupName} has been created with ${selectedUsers.length} members`
    });
    setNewGroupOpen(false);
    setGroupName("");
    setSelectedUsers([]);
    
    const groupChat = mockChats.find(chat => chat.type === "group");
    if (groupChat) {
      onSelectChat(groupChat.id);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-white shadow-md">
      <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Chats
        </h2>
        <div className="flex items-center gap-2">
          <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
            <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-9 w-9 bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={() => setNewChatOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>New Chat</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem onSelect={() => setNewGroupOpen(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    <span>New Group</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="mb-4">
                    <Input
                      placeholder="Search contacts..."
                      className="mb-4"
                    />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {MOCK_USERS.map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleStartChat(user.id)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`} />
                          <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Group Chat</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Group Name</label>
                    <Input
                      placeholder="Enter group name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </div>
                  
                  <label className="block text-sm font-medium mb-1">Add Members</label>
                  <Input
                    placeholder="Search contacts..."
                    className="mb-4"
                  />
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {MOCK_USERS.map(user => (
                      <div 
                        key={user.id}
                        className={`flex items-center p-2 hover:bg-muted rounded-md cursor-pointer ${
                          selectedUsers.includes(user.id) ? 'bg-muted' : ''
                        }`}
                        onClick={() => toggleUserSelection(user.id)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`} />
                          <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.email}</p>
                        </div>
                        {selectedUsers.includes(user.id) && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">
                            <CheckCheck className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateGroup}>Create Group</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Dialog>
        </div>
      </div>

      <div className="p-3 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full h-11 bg-transparent p-0">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="groups" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Groups
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
              {filteredChats.map((chat) => {
                const InterestIcon = chat.interests?.[0] 
                  ? getInterestIcon(chat.interests[0].name) 
                  : MessageSquare;
                
                return (
                  <motion.li 
                    key={chat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`group hover:bg-muted/30 cursor-pointer transition-colors ${
                      selectedChatId === chat.id ? "bg-muted/50" : ""
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-start p-3 gap-3">
                      <Avatar className="h-12 w-12 rounded-full border shrink-0 relative">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>
                          {chat.type === "group" ? (
                            <Users className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            chat.name.substring(0, 2).toUpperCase()
                          )}
                        </AvatarFallback>
                        {chat.sharedInterests?.[0] && (
                          <div 
                            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
                            style={{ backgroundColor: '#9b87f5' }}
                            title={`Shared Interest: ${chat.sharedInterests[0].name}`}
                          />
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{chat.name}</h3>
                            {chat.type === "group" && chat.interests && chat.interests[0] && (
                              <div className="flex items-center gap-1">
                                <InterestIcon className="h-4 w-4 text-muted-foreground" />
                                <InterestTag interest={chat.interests[0]} />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(chat.lastMessage.time)}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          {getMessageIcon(chat.lastMessage.type)}
                          <span className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage.text}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {chat.lastMessage.isUnread && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                        )}
                        {chat.lastMessage.senderId === "me" && (
                          <CheckCheck className={`h-4 w-4 ${
                            chat.lastMessage.status === "read" ? "text-primary" : "text-muted-foreground"
                          }`} />
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
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
      </Tabs>
    </div>
  );
};

export default ChatList;
