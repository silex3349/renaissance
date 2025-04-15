
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Layout from "@/components/layout/Layout";
import Events from "@/pages/Events";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import Chats from "@/pages/Chats";
import Groups from "@/pages/Groups";
import NotFound from "@/pages/NotFound";
import Discover from "@/pages/Discover";
import "./App.css";

// Create a react-query client
const queryClient = new QueryClient();

// Route guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Merged Home and Events into a single route */}
                <Route index element={<Events />} />
                <Route path="auth" element={<Auth />} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                <Route path="profile/:id" element={<Profile />} />
                <Route path="events/:id" element={<Events />} />
                <Route path="events/create" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                <Route path="discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
                <Route path="chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                <Route path="groups" element={<Groups />} />
                <Route path="groups/:id" element={<Groups />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
