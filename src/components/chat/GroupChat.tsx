
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  SendHorizontal, 
  Image as ImageIcon, 
  Paperclip, 
  Mic, 
  Phone, 
  Video,
  SmilePlus,
  Search,
  MoreVertical,
  ArrowLeft,
  Clock,
  Check,
  CheckCheck,
  Reply,
  Trash2,
  Heart,
  ThumbsUp,
  X,
  ChevronLeft,
  UserCircle,
  Info
} from "lucide-react";
import { MOCK_USERS } from "@/services/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { getAvatarColor, formatMessageTime } from "@/utils/chatUtils";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InterestTag } from "@/components/chat/InterestTag";

interface MessageReaction {
  userId: string;
  type: 'like' | 'heart' | 'laugh' | 'sad' | 'angry' | 'wow';
}

interface ReplyToMessage {
  id: string;
  text: string;
  userId: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
  attachmentType?: "image" | "file" | "audio";
  attachmentUrl?: string;
  reactions?: MessageReaction[];
  replyTo?: ReplyToMessage;
}

interface GroupChatProps {
  groupId: string;
}

const GroupChat = ({ groupId }: GroupChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatName, setChatName] = useState("Group Chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState<{userId: string, name: string} | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ReplyToMessage | null>(null);
  const [userStatus, setUserStatus] = useState<"online" | "offline" | "away">("online");
  const [lastSeen, setLastSeen] = useState<Date | null>(new Date(Date.now() - 60000));
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const randomTyping = () => {
      const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      if (randomUser.id !== user?.id) {
        setIsTyping({userId: randomUser.id, name: randomUser.email.split('@')[0]});
        
        setTimeout(() => {
          setIsTyping(null);
          
          if (Math.random() > 0.5) {
            const randomMessages = [
              "Hi there! How's everyone doing?",
              "When is our next meetup?",
              "I have some ideas to share with the group.",
              "Has anyone seen the latest updates?",
              "Looking forward to connecting with you all!"
            ];
            
            const newMessage: ChatMessage = {
              id: `msg_${Date.now()}`,
              userId: randomUser.id,
              text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
              timestamp: new Date(),
              status: "delivered"
            };
            
            setMessages(prevMessages => [...prevMessages, newMessage]);
          }
        }, 2000 + Math.random() * 3000);
      }
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        randomTyping();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const chatNames = {
      "chat1": "Sarah Johnson",
      "chat2": "Photography Club",
      "chat3": "James Wilson",
      "chat4": "Weekend Hiking",
      "chat5": "Emma Thompson"
    };
    
    if (groupId in chatNames) {
      setChatName(chatNames[groupId as keyof typeof chatNames]);
    } else {
      setChatName("Group Chat");
    }
    
    const statuses = ["online", "offline", "away"];
    setUserStatus(statuses[Math.floor(Math.random() * statuses.length)] as "online" | "offline" | "away");
    
    const mockMessages: ChatMessage[] = [
      {
        id: "msg1",
        userId: "user_1",
        text: "Hello everyone! Welcome to the group.",
        timestamp: new Date(Date.now() - 3600000 * 24),
        status: "read",
        reactions: [
          { userId: "user_2", type: "like" },
          { userId: "user_3", type: "heart" }
        ]
      },
      {
        id: "msg2",
        userId: "user_2",
        text: "Thanks for creating this group! Looking forward to meeting everyone.",
        timestamp: new Date(Date.now() - 3600000 * 12),
        status: "read",
        reactions: [
          { userId: "user_1", type: "like" }
        ]
      },
      {
        id: "msg3",
        userId: "user_1",
        text: "Let's plan our first meetup soon!",
        timestamp: new Date(Date.now() - 3600000 * 6),
        status: "delivered",
        attachmentType: "image",
        attachmentUrl: "https://picsum.photos/seed/meet/400/300"
      },
      {
        id: "msg4",
        userId: "user_3",
        text: "Great idea! I'm available this weekend.",
        timestamp: new Date(Date.now() - 3600000 * 3),
        status: "delivered",
        replyTo: {
          id: "msg3",
          text: "Let's plan our first meetup soon!",
          userId: "user_1"
        }
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() && !uploading && !replyingTo) return;
    if (!user) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      text: inputValue.trim(),
      timestamp: new Date(),
      status: "sent"
    };

    if (replyingTo) {
      newMessage.replyTo = replyingTo;
      setReplyingTo(null);
    }

    if (uploading) {
      newMessage.attachmentType = "image";
      newMessage.attachmentUrl = `https://picsum.photos/seed/${Date.now()}/400/300`;
      setUploading(false);
    }

    setMessages([...messages, newMessage]);
    setInputValue("");
    
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessage.id ? {...msg, status: "delivered"} : msg
        )
      );
      
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === newMessage.id ? {...msg, status: "read"} : msg
          )
        );
      }, 2000);
    }, 1000);
  };

  const handleAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = () => {
    setUploading(true);
    toast({
      title: "Uploading",
      description: "Your file is being uploaded..."
    });

    setTimeout(() => {
      toast({
        title: "Upload Complete",
        description: "Your file is ready to send"
      });
    }, 1500);
  };

  const handleEmoji = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      toast({
        title: "Voice Message Recorded",
        description: `Voice message (${recordingTime}s) ready to send`
      });
      
      setRecordingTime(0);
    } else {
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Tap the microphone icon again to stop recording"
      });
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const handleVideoCall = () => {
    toast({
      title: "Video Call",
      description: "Starting video call with " + chatName
    });
  };

  const handleAudioCall = () => {
    toast({
      title: "Audio Call",
      description: "Starting audio call with " + chatName
    });
  };

  const handleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery("");
    }
  };

  const handleReplyToMessage = (message: ChatMessage) => {
    setReplyingTo({
      id: message.id,
      text: message.text,
      userId: message.userId
    });
    
    document.getElementById("message-input")?.focus();
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    
    toast({
      title: "Message Deleted",
      description: "Your message has been removed"
    });
  };

  const handleAddReaction = (messageId: string, reactionType: 'like' | 'heart') => {
    if (!user) return;
    
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          
          const existingReactionIndex = reactions.findIndex(
            r => r.userId === user.id && r.type === reactionType
          );
          
          if (existingReactionIndex >= 0) {
            const newReactions = [...reactions];
            newReactions.splice(existingReactionIndex, 1);
            return {...msg, reactions: newReactions};
          }
          
          return {
            ...msg, 
            reactions: [
              ...reactions, 
              { userId: user.id, type: reactionType }
            ]
          };
        }
        return msg;
      })
    );
  };

  const handleToggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
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
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusIndicator = () => {
    switch (userStatus) {
      case 'online':
        return <div className="h-3 w-3 rounded-full bg-green-500"></div>;
      case 'away':
        return <div className="h-3 w-3 rounded-full bg-yellow-500"></div>;
      case 'offline':
        return <div className="h-3 w-3 rounded-full bg-gray-400"></div>;
      default:
        return null;
    }
  };

  const getLastSeenText = () => {
    if (userStatus === 'online') return 'Online';
    if (!lastSeen) return 'Offline';
    return `Last seen ${formatMessageTime(lastSeen)}`;
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayedMessages = searchQuery 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getUserById(msg.userId).email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const mockEmojis = ["😊", "👍", "❤️", "😂", "👋", "🎉", "🔥", "👏", "💯", "🙏"];
  
  // Mock interest data for demonstration
  const sharedInterests = [
    { id: "1", name: "Photography" },
    { id: "2", name: "Travel" },
    { id: "3", name: "Tech" }
  ];

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Chat Header */}
      <div className="p-3 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="header-user-info">
          <Button variant="ghost" size="icon" className="md:hidden mr-1 h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${groupId}`} />
            <AvatarFallback style={{ backgroundColor: getAvatarColor(chatName) }}>
              {chatName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-semibold text-base">{chatName}</h3>
            <div className="user-status">
              {getStatusIndicator()}
              <span>{getLastSeenText()}</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={handleAudioCall}
          >
            <Phone className="h-5 w-5 text-primary" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5 text-primary" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full h-9 w-9 ${isInfoOpen ? 'bg-primary/10 text-primary' : ''}`}
            onClick={handleToggleInfo}
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearching && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in conversation..."
              className="pl-9 pr-4 py-2"
            />
          </div>
          {searchQuery && <div className="text-xs text-muted-foreground mt-1 px-2">
            Found {displayedMessages.length} matching messages
          </div>}
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f5f7fb]">
          {displayedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            displayedMessages.map((message) => {
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
                  <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""} group`}>
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
                      
                      {message.replyTo && (
                        <div className={`mb-1 p-2 border-l-2 rounded-sm text-xs ${
                          isCurrentUser ? "border-primary/50 bg-primary/5" : "border-gray-300 bg-gray-100"
                        }`}>
                          <p className="font-medium text-muted-foreground">
                            Reply to {getUserById(message.replyTo.userId).email}
                          </p>
                          <p className="truncate">{message.replyTo.text}</p>
                        </div>
                      )}
                      
                      <div className={`message-bubble ${
                        isCurrentUser ? "message-bubble-sent" : "message-bubble-received"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        
                        {message.attachmentType === "image" && message.attachmentUrl && (
                          <div className="message-media">
                            <img 
                              src={message.attachmentUrl} 
                              alt="Attached image" 
                              className="rounded-md"
                            />
                          </div>
                        )}
                        
                        <div className="message-actions">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full bg-white shadow-sm"
                            onClick={() => handleReplyToMessage(message)}
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full bg-white shadow-sm"
                            onClick={() => handleAddReaction(message.id, "like")}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full bg-white shadow-sm"
                            onClick={() => handleAddReaction(message.id, "heart")}
                          >
                            <Heart className="h-3 w-3" />
                          </Button>
                          
                          {isCurrentUser && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full bg-white shadow-sm"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                        isCurrentUser ? "justify-end" : ""
                      }`}>
                        <span>{formatMessageTime(message.timestamp)}</span>
                        {isCurrentUser && getStatusIcon(message.status)}
                      </div>
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                          <div className="flex gap-1">
                            {[...new Set(message.reactions.map(r => r.type))].map(type => {
                              const count = message.reactions?.filter(r => r.type === type).length || 0;
                              return (
                                <div key={type} className="reaction-bubble">
                                  {type === 'like' ? <ThumbsUp className="h-3 w-3 mr-1" /> : <Heart className="h-3 w-3 mr-1" />}
                                  <span>{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%]">
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarFallback>
                    {isTyping.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">
                    {isTyping.name}
                  </p>
                  <div className="message-bubble message-bubble-received p-2">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* User/Group Info Sidebar */}
        {isInfoOpen && (
          <div className="w-72 border-l overflow-y-auto bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Chat Info</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleInfo}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${groupId}`} />
                <AvatarFallback style={{ backgroundColor: getAvatarColor(chatName) }}>
                  {chatName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-bold">{chatName}</h2>
              <div className="user-status">
                {getStatusIndicator()}
                <span>{getLastSeenText()}</span>
              </div>
            </div>
            
            <div className="border-t border-b py-4 mb-4">
              <h4 className="font-medium mb-2 text-sm">Shared Interests</h4>
              <div className="flex flex-wrap gap-1">
                {sharedInterests.map(interest => (
                  <InterestTag 
                    key={interest.id} 
                    interest={interest} 
                    pill={true} 
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-sm">Media</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${i+groupId}/100`} 
                      alt="Shared media" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-2 text-xs">
                View All Media
              </Button>
            </div>
            
            <div className="mt-auto border-t pt-4">
              <Button variant="outline" className="w-full mb-2">
                <UserCircle className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button variant="outline" className="w-full text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Reply To Message */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 py-2 border-t bg-muted/20"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-2">
                <Reply className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="text-sm">
                  <p className="font-medium text-xs">
                    Replying to {getUserById(replyingTo.userId).email}
                  </p>
                  <p className="text-muted-foreground text-xs truncate max-w-xs">
                    {replyingTo.text}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5" 
                onClick={() => setReplyingTo(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Voice Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-3 py-2 border-t"
          >
            <div className="voice-record-indicator">
              <Mic className="h-4 w-4 text-destructive" />
              <span>Recording {formatRecordingTime(recordingTime)}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-auto" 
                onClick={handleVoiceMessage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Message Input */}
      <div className="chat-input-container">
        <div className="flex-none flex gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 flex-shrink-0"
            onClick={handleEmoji}
          >
            <SmilePlus className="h-5 w-5" />
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 flex-shrink-0"
            onClick={handleAttachment}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        
        <Textarea
          id="message-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="resize-none min-h-[44px] max-h-[120px] py-2 rounded-2xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          disabled={!user || isRecording}
        />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelected} 
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
        
        <div className="flex-none">
          {inputValue.trim() || uploading ? (
            <Button 
              type="button" 
              size="icon"
              className="rounded-full h-9 w-9 flex-shrink-0 bg-primary"
              onClick={handleSendMessage}
              disabled={!user}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              type="button" 
              variant={isRecording ? "destructive" : "ghost"} 
              size="icon" 
              className="rounded-full h-9 w-9 flex-shrink-0"
              onClick={handleVoiceMessage}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-2 border-t bg-white shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Emoji</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setShowEmojiPicker(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="emoji-grid">
              {mockEmojis.concat(["🤔", "😁", "🥰", "😇", "😎", "🤩", "😴", "😍"]).map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="emoji-item"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupChat;
