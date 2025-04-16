
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Users, 
  Search, 
  Plus, 
  ChevronLeft, 
  Filter, 
  Bell,
  Archive,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  Video,
  MoreHorizontal,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { InterestTag } from "@/components/chat/InterestTag";
import { formatMessageTime, getInitials, getAvatarColor } from "@/utils/chatUtils";
import ChatList from "@/components/chat/ChatList";
import GroupChat from "@/components/chat/GroupChat";

const Chats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatView, setChatView] = useState<"desktop" | "mobile-list" | "mobile-chat">("desktop");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  // For mobile view, we'll toggle between list and chat
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChatView(selectedChatId ? "mobile-chat" : "mobile-list");
      } else {
        setChatView("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedChatId]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    if (window.innerWidth < 768) {
      setChatView("mobile-chat");
    }
  };

  const handleBackToList = () => {
    setChatView("mobile-list");
    setSelectedChatId(null);
  };

  const handleStartNewChat = () => {
    toast({
      title: "New conversation",
      description: "Starting a new conversation..."
    });
    setShowNewChatDialog(false);
  };

  const handleCreateNewGroup = () => {
    toast({
      title: "New group",
      description: "Creating a new group..."
    });
    setShowNewGroupDialog(false);
  };

  if (!user) {
    return (
      <div className="renaissance-container py-12">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
          <div className="rounded-full bg-primary/10 p-6 mb-6">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Join the conversation</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to connect with others and participate in group chats
          </p>
          <Button size="lg" asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="renaissance-container py-6">
      <Card className="border shadow-sm overflow-hidden max-w-6xl mx-auto h-[700px]">
        <div className="flex h-full">
          {/* Chat List Panel */}
          <div className={`w-full md:w-1/3 border-r flex flex-col h-full ${chatView === "mobile-chat" ? "hidden md:flex" : ""}`}>
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messages
              </h2>
              <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-9 w-9 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Tabs defaultValue="direct">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="direct">Direct Message</TabsTrigger>
                        <TabsTrigger value="group">Group Chat</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="direct" className="space-y-4">
                        <Input
                          placeholder="Search users..."
                          className="mb-4"
                        />
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {/* User list would be populated here */}
                          <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer">
                            <Avatar className="h-10 w-10 mr-3 relative">
                              <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=user_1" />
                              <AvatarFallback>SJ</AvatarFallback>
                              <div className="chat-avatar-indicator online-indicator"></div>
                            </Avatar>
                            <div>
                              <p className="font-medium">Sarah Johnson</p>
                              <p className="text-sm text-muted-foreground">Online</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer">
                            <Avatar className="h-10 w-10 mr-3 relative">
                              <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=user_2" />
                              <AvatarFallback>JW</AvatarFallback>
                              <div className="chat-avatar-indicator offline-indicator"></div>
                            </Avatar>
                            <div>
                              <p className="font-medium">James Wilson</p>
                              <p className="text-sm text-muted-foreground">Last seen 2 hours ago</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full" onClick={handleStartNewChat}>
                          Start Conversation
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="group" className="space-y-4">
                        <Input
                          placeholder="Group name"
                          className="mb-4"
                        />
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Add members</label>
                          <Input
                            placeholder="Search users..."
                            className="mb-2"
                          />
                        </div>
                        
                        <div className="border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Selected members will appear here
                          </p>
                        </div>
                        
                        <Button className="w-full" onClick={handleCreateNewGroup}>
                          Create Group
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="p-3 border-b">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-9 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <div className="px-1 pt-1">
                <TabsList className="w-full grid grid-cols-3 h-10">
                  <TabsTrigger value="all" onClick={() => setActiveTab("all")}>All</TabsTrigger>
                  <TabsTrigger value="direct" onClick={() => setActiveTab("direct")}>Direct</TabsTrigger>
                  <TabsTrigger value="groups" onClick={() => setActiveTab("groups")}>Groups</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <ChatList 
                  onSelectChat={handleSelectChat} 
                  selectedChatId={selectedChatId}
                  filterType={activeTab}
                  searchTerm={searchTerm}
                />
              </div>
            </Tabs>
          </div>
          
          {/* Chat View Panel */}
          <div className={`w-full md:w-2/3 flex flex-col h-full ${chatView === "mobile-list" ? "hidden md:flex" : ""}`}>
            {/* Mobile back button */}
            {chatView === "mobile-chat" && (
              <div className="p-3 border-b flex items-center md:hidden">
                <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium">Back to Chats</span>
              </div>
            )}
            
            {selectedChatId ? (
              <GroupChat groupId={selectedChatId} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted/10 p-6">
                <div className="text-center max-w-xs">
                  <div className="empty-chat-illustration flex justify-center mb-6">
                    <MessageSquare className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your messages</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a conversation from the list or start a new one to begin messaging.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewChatDialog(true)}
                    className="mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chats;
