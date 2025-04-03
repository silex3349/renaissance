
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { MOCK_USERS } from "@/services/mockData";

// Mock chat data structure
interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

interface GroupChatProps {
  groupId: string;
}

const GroupChat = ({ groupId }: GroupChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
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
      },
      {
        id: "msg2",
        userId: "user_2",
        text: "Thanks for creating this group! Looking forward to meeting everyone.",
        timestamp: new Date(Date.now() - 3600000 * 12),
      },
      {
        id: "msg3",
        userId: "user_1",
        text: "Let's plan our first meetup soon!",
        timestamp: new Date(Date.now() - 3600000 * 6),
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

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-medium">Group Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = user?.id === message.userId;
            const sender = getUserById(message.userId);
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${sender.id}`} />
                      <AvatarFallback>
                        {sender.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    {!isCurrentUser && (
                      <p className="text-xs text-muted-foreground mb-1">{sender.email}</p>
                    )}
                    <div className={`p-3 rounded-lg ${
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}>
                      <p>{message.text}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${
                      isCurrentUser ? "text-right" : ""
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form 
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!user}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputValue.trim() || !user}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
