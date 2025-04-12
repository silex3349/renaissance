
import React, { useState } from "react";
import ChatList from "@/components/chat/ChatList";
import GroupChat from "@/components/chat/GroupChat";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

const Chats = () => {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatView, setChatView] = useState<"desktop" | "mobile-list" | "mobile-chat">("desktop");

  // For mobile view, we'll toggle between list and chat
  React.useEffect(() => {
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
    if (window.innerWidth < 768) {
      setChatView("mobile-list");
    }
  };

  if (!user) {
    return (
      <div className="renaissance-container py-12">
        <div className="text-center max-w-md mx-auto">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Join the conversation</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to connect with others and participate in group chats
          </p>
          <Button asChild className="mx-auto">
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="renaissance-container py-8">
      <div className="flex flex-col md:flex-row gap-6 h-[700px]">
        {/* Mobile Header Bar - only shown in mobile chat view */}
        {chatView === "mobile-chat" && (
          <div className="flex items-center md:hidden mb-2">
            <Button variant="ghost" onClick={handleBackToList} className="mr-2">
              <Users className="h-5 w-5 mr-2" />
              Back to Chats
            </Button>
          </div>
        )}

        {/* Chat List - hidden in mobile when viewing a chat */}
        <div className={`w-full md:w-1/3 ${chatView === "mobile-chat" ? "hidden md:block" : ""}`}>
          <ChatList 
            onSelectChat={handleSelectChat} 
            selectedChatId={selectedChatId || undefined}
          />
        </div>
        
        {/* Chat View - hidden in mobile when viewing the list */}
        <div className={`w-full md:w-2/3 ${chatView === "mobile-list" ? "hidden md:block" : ""}`}>
          {selectedChatId ? (
            <GroupChat groupId={selectedChatId} />
          ) : (
            <div className="border rounded-lg h-full flex items-center justify-center bg-muted/30">
              <div className="text-center max-w-md p-6">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
