
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { GoogleAuthProviderWrapper } from "@/providers/GoogleAuthProvider";
import Layout from "@/components/layout/Layout";
import Events from "@/pages/Events";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import Chats from "@/pages/Chats";
import Groups from "@/pages/Groups";
import NotFound from "@/pages/NotFound";
import Discover from "@/pages/Discover";
import Wallet from "@/pages/Wallet";
import LocationDetection from "@/components/location/LocationDetection";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <GoogleAuthProviderWrapper>
          <AuthProvider>
            <WalletProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Events />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="location" element={<LocationDetection />} />
                  <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                  <Route path="profile/:id" element={<Profile />} />
                  <Route path="events/:id" element={<Events />} />
                  <Route path="events/create" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                  <Route path="discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
                  <Route path="chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                  <Route path="wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                  <Route path="groups" element={<Groups />} />
                  <Route path="groups/:id" element={<Groups />} />
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
