
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Groups from "./pages/Groups";
import Matching from "./pages/Matching";

// Create a client for React Query
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="discover" element={<Discover />} />
                    <Route path="events" element={<Events />} />
                    <Route path="events/:id" element={<Events />} />
                    <Route path="groups" element={<Groups />} />
                    <Route path="groups/:id" element={<Groups />} />
                    <Route path="matching" element={<Matching />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  <Route path="/signin" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />
                </Routes>
              </TooltipProvider>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
