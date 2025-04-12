
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Events from "@/pages/Events";
import Groups from "@/pages/Groups";
import Discover from "@/pages/Discover";
import Matching from "@/pages/Matching";
import Chats from "@/pages/Chats";
import NotFound from "@/pages/NotFound";
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
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="auth" element={<Auth />} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
                <Route path="matching" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
                <Route path="matching/:id" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
                <Route path="events" element={<Events />} />
                <Route path="events/:id" element={<Events />} />
                <Route path="groups" element={<Groups />} />
                <Route path="groups/:id" element={<Groups />} />
                <Route path="chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
