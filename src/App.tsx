
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { GoogleAuthProviderWrapper } from "@/providers/GoogleAuthProvider";
import MainLayout from "@/components/layout/MainLayout";
import Events from "@/pages/Events";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import Chats from "@/pages/Chats";
import Groups from "@/pages/Groups";
import NotFound from "@/pages/NotFound";
import Discover from "@/pages/Discover";
import Wallet from "@/pages/Wallet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <GoogleAuthProviderWrapper>
          <AuthProvider>
            <WalletProvider>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Events />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/:id" element={<Events />} />
                  <Route path="discover" element={<Discover />} />
                  <Route path="groups" element={<Groups />} />
                  <Route path="groups/:id" element={<Groups />} />
                  <Route path="messages" element={<Chats />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="profile/edit" element={<ProfileEdit />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
            </WalletProvider>
          </AuthProvider>
        </GoogleAuthProviderWrapper>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
