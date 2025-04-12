
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SendHorizontal, 
  Image, 
  Paperclip, 
  Mic, 
  Phone, 
  Video,
  SmilePlus,
  Search,
  MoreVertical
} from "lucide-react";
import { MOCK_USERS } from "@/services/mockData";
import { motion } from "framer-motion";

// Mock chat data structure
interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
  attachmentType?: "image" | "file" | "audio";
  attachmentUrl?: string;
}

interface GroupChatProps {
  groupId: string;
}

const GroupChat = ({ groupId }: GroupChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate loading existing messages for this group
  useEffect(() => {
    // In a real app, we would fetch messages from the backend
    const mockMessages: ChatMessage[] = [
      {
        id: "msg1",
        userId: "user_1",
        text: "Hello everyone! Welcome to the group.",
        timestamp: new Date(Date.now() - 3600000 * 24),
        status: "read"
      },
      {
        id: "msg2",
        userId: "user_2",
        text: "Thanks for creating this group! Looking forward to meeting everyone.",
        timestamp: new Date(Date.now() - 3600000 * 12),
        status: "read"
      },
      {
        id: "msg3",
        userId: "user_1",
        text: "Let's plan our first meetup soon!",
        timestamp: new Date(Date.now() - 3600000 * 6),
        status: "delivered"
      },
      {
        id: "msg4",
        userId: "user_3",
        text: "Great idea! I'm available this weekend.",
        timestamp: new Date(Date.now() - 3600000 * 3),
        status: "delivered"
      },
      {
        id: "msg5",
        userId: "user_2",
        text: "Saturday works for me!",
        timestamp: new Date(Date.now() - 3600000),
        status: "sent"
      },
    ];
    
    setMessages(mockMessages);
  }, [groupId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      text: inputValue.trim(),
      timestamp: new Date(),
      status: "sent"
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const formatMessageTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getUserById = (userId: string) => {
    return MOCK_USERS.find(u => u.id === userId) || {
      id: userId,
      email: "Unknown User",
    };
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'sent':
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
      case 'delivered':
        return <div className="w-3 h-3 rounded-full bg-blue-400"></div>;
      case 'read':
        return <div className="w-3 h-3 rounded-full bg-green-400"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Chat Header */}
      <div className="p-3 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${groupId}`} />
            <AvatarFallback>GP</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Group Chat</h3>
            <p className="text-xs text-muted-foreground">
              {messages.length > 0 ? `${messages.length} messages` : "No messages yet"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Phone className="h-5 w-5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Video className="h-5 w-5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Tabs */}
      <div className="border-b bg-muted/30">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-10">
            <TabsTrigger 
              value="chats" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Chats
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Media
            </TabsTrigger>
            <TabsTrigger 
              value="links" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Links
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Chat Messages */}
      <TabsContent value="chats" className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f5f7fb]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = user?.id === message.userId;
            const sender = getUserById(message.userId);
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${sender.id}`} />
                      <AvatarFallback>
                        {sender.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    {!isCurrentUser && (
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        {sender.email}
                      </p>
                    )}
                    <div className={`p-3 rounded-2xl ${
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-white border rounded-tl-none shadow-sm"
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                      isCurrentUser ? "justify-end" : ""
                    }`}>
                      <span>{formatMessageTime(message.timestamp)}</span>
                      {isCurrentUser && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </TabsContent>

      <TabsContent value="media" className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${i+groupId}/200`} 
                alt="Shared media" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="links" className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 border rounded-lg bg-white">
              <div className="text-primary font-medium text-sm">https://example.com/shared-link-{i}</div>
              <div className="text-xs text-muted-foreground mt-1">Shared by User {i} on {new Date().toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      {/* Input Area */}
      <div className="p-3 border-t bg-white">
        <form 
          className="flex gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 flex-shrink-0"
          >
            <SmilePlus className="h-5 w-5" />
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            disabled={!user}
          />
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 flex-shrink-0"
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button 
            type="submit" 
            size="icon"
            className="rounded-full h-9 w-9 flex-shrink-0 bg-primary"
            disabled={!inputValue.trim() || !user}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
