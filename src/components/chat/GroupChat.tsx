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
  Info,
  Forward,
  Copy,
  MoreHorizontal,
  MapPin,
  Bookmark
} from "lucide-react";
import { MOCK_USERS } from "@/services/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { getAvatarColor, formatMessageTime } from "@/utils/chatUtils";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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

  // Check if user has scrolled up to show the scroll-to-bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      
      setShowScrollToBottom(isScrolledUp);
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleSwipeToReply = (message: ChatMessage) => {
    setReplyingTo({
      id: message.id,
      text: message.text,
      userId: message.userId
    });
    
    document.getElementById("message-input")?.focus();
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

  const handleForwardMessage = (message: ChatMessage) => {
    toast({
      title: "Forward Message",
      description: "Select a contact to forward this message"
    });
  };

  const handleCopyMessage = (message: ChatMessage) => {
    navigator.clipboard.writeText(message.text);
    
    toast({
      title: "Copied to Clipboard",
      description: "Message text copied to clipboard"
    });
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
        return <div className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>;
      case 'away':
        return <div className="h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-white"></div>;
      case 'offline':
        return <div className="h-3 w-3 rounded-full bg-gray-400 ring-2 ring-white"></div>;
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
    { id: "1", name: "Photography", category: "Arts" },
    { id: "2", name: "Travel", category: "Adventure" },
    { id: "3", name: "Tech", category: "Professional" }
  ];

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Chat Header - Enhanced */}
      <div className="p-3 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="md:hidden mr-1 h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${groupId}`} />
              <AvatarFallback style={{ backgroundColor: getAvatarColor(chatName) }}>
                {chatName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
              {getStatusIndicator()}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-base">{chatName}</h3>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span className="text-sm">{getLastSeenText()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 hover:bg-primary/10"
            onClick={handleAudioCall}
          >
            <Phone className="h-5 w-5 text-primary" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 hover:bg-primary/10"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5 text-primary" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 hover:bg-primary/10"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleToggleInfo}>
                <Info className="mr-2 h-4 w-4" />
                <span>View info</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>View profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Search in conversation</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MapPin className="mr-2 h-4 w-4" />
                <span>Share location</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear conversation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Main Chat Area - Enhanced */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages List */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fc]"
        >
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
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} group`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedMessage(message);
                  }}
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
                    
                    <div className="max-w-full">
                      {!isCurrentUser && (
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          {sender.email}
                        </p>
                      )}
                      
                      {message.replyTo && (
                        <div className={`mb-1 p-2 rounded-md text-xs ${
                          isCurrentUser ? "bg-primary/5 border-l-2 border-primary/30" : "bg-gray-100 border-l-2 border-gray-300"
                        }`}>
                          <p className="font-medium text-muted-foreground">
                            Reply to {getUserById(message.replyTo.userId).email}
                          </p>
                          <p className="truncate">{message.replyTo.text}</p>
                        </div>
                      )}
                      
                      <div 
                        className={`relative message-container group ${isCurrentUser ? "message-right" : "message-left"}`}
                        onClick={() => {
                          if (window.innerWidth <= 768) {
                            setSelectedMessage(message);
                          }
                        }}
                      >
                        <div className={`message-bubble ${
                          isCurrentUser ? "bg-primary/90 text-white" : "bg-white border border-gray-200"
                        } rounded-2xl px-4 py-2 shadow-sm`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          
                          {message.attachmentType === "image" && message.attachmentUrl && (
                            <div className="message-media mt-2 rounded-lg overflow-hidden">
                              <img 
                                src={message.attachmentUrl} 
                                alt="Attached image" 
                                className="w-full rounded-md hover:opacity-95 transition-opacity cursor-pointer"
                              />
                            </div>
                          )}
                          
                          <AnimatePresence>
                            {selectedMessage?.id === message.id && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="message-actions absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border flex items-center z-10"
                              >
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReplyToMessage(message);
                                    setSelectedMessage(null);
                                  }}
                                >
                                  <Reply className="h-4 w-4" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleForwardMessage(message);
                                    setSelectedMessage(null);
                                  }}
                                >
                                  <Forward className="h-4 w-4" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyMessage(message);
                                    setSelectedMessage(null);
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddReaction(message.id, "like");
                                    setSelectedMessage(null);
                                  }}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                
                                {isCurrentUser && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMessage(message.id);
                                      setSelectedMessage(null);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                          isCurrentUser ? "justify-end" : ""
                        }`}>
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {isCurrentUser && getStatusIcon(message.status)}
                        </div>
                        
                        {message.reactions && message.reactions.length > 0 && (
                          <div className={`flex mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                            <div className="flex -space-x-1 bg-white rounded-full px-2 py-0.5 shadow-sm border">
                              {[...new Set(message.reactions.map(r => r.type))].map(type => {
                                const count = message.reactions?.filter(r => r.type === type).length || 0;
                                return (
                                  <div key={type} className="flex items-center">
                                    {type === 'like' ? 
                                      <div className="bg-blue-100 rounded-full p-0.5">
                                        <ThumbsUp className="h-3 w-3 text-blue-500" />
                                      </div> : 
                                      <div className="bg-red-100 rounded-full p-0.5">
                                        <Heart className="h-3 w-3 text-red-500" />
                                      </div>
                                    }
                                    <span className="text-xs ml-1">{count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
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
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    {isTyping.name}
                  </p>
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="typing-dot animate-pulse bg-gray-500 rounded-full h-2 w-2"></div>
                      <div className="typing-dot animate-pulse bg-gray-500 rounded-full h-2 w-2" style={{ animationDelay: "0.2s" }}></div>
                      <div className="typing-dot animate-pulse bg-gray-500 rounded-full h-2 w-2" style={{ animationDelay: "0.4s" }}></div>
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
              <Avatar className="h-20 w-20 mb-3 border-2 border-primary/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${groupId}`} />
                <AvatarFallback style={{ backgroundColor: getAvatarColor(chatName) }}>
                  {chatName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-bold">{chatName}</h2>
              <div className="flex items-center space-x-1 mt-1">
                {getStatusIndicator()}
                <span className="text-sm text-muted-foreground">{getLastSeenText()}</span>
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
                  <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                    <img 
                      src={`https://picsum.photos/seed/${i+groupId}/100`} 
                      alt="Shared media" 
                      className="w-full h-full object-cover"
