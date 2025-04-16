
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import Discover from "@/pages/Discover";
import Events from "@/pages/Events";
import Groups from "@/pages/Groups";
import Matching from "@/pages/Matching";
import Chats from "@/pages/Chats";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/layout/Layout";
import "@/App.css";
import "@/styles/interest-tags.css";
import "@/styles/chat.css"; // Import chat styles

const queryClient = new QueryClient();

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="renaissance-container py-12">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-profile" element={<ProfileEdit />} />
            <Route path="discover" element={<Discover />} />
            <Route path="events/:id?" element={<Events />} />
            <Route path="groups/:id?" element={<Groups />} />
            <Route path="matching" element={<Matching />} />
            <Route path="chats" element={<Chats />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
