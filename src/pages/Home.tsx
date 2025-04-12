import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import EventList from "@/components/events/EventList";
import { MOCK_EVENTS } from "@/services/mockData";
import { UserCheck, MessageCircle, Calendar } from "lucide-react";
import { Event } from "@/types";

const Home = () => {
  const { user } = useAuth();

  // Type assertion to ensure mock data matches the Event type
  const typedEvents = MOCK_EVENTS as Event[];

  return (
    <div className="min-h-screen">
      {!user ? (
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="flex flex-col min-h-[calc(100vh-5rem)]">
            {/* City Background Image */}
            <div className="flex-1 bg-gradient-to-b from-renaissance-300 to-renaissance-500 flex flex-col md:flex-row items-center relative overflow-hidden">
              {/* City Background Image */}
              <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
                <img 
                  src="/lovable-uploads/8a6794ee-5d2c-4b63-aead-f0f02b6a9ef5.png" 
                  alt="City skyline with people connecting" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="renaissance-container py-12 md:py-16 flex flex-col items-center text-center md:text-left z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-4xl mx-auto"
                >
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Connect Through Shared Experiences
                  </h1>
                  
                  <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Renaissance helps you find meaningful connections based on common interests and local activities.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
                        <UserCheck className="h-6 w-6 text-renaissance-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Find Your People</h3>
                      <p className="text-white/80">
                        Connect with others who share your interests and passions
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Calendar className="h-6 w-6 text-renaissance-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Join Events</h3>
                      <p className="text-white/80">
                        Discover and participate in local activities and meetups
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
                        <MessageCircle className="h-6 w-6 text-renaissance-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Stay Connected</h3>
                      <p className="text-white/80">
                        Chat and plan activities with your new connections
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Link to="/signup" className="w-full">
                      <Button size="lg" className="w-full bg-white text-renaissance-600 hover:bg-white/90 rounded-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Pagination dots */}
                  <div className="flex justify-center mt-8 gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Featured Events Section */}
          <div className="py-16 renaissance-container">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Happening Soon</h2>
              <p className="text-warmgray-700 max-w-2xl mx-auto">
                Explore upcoming events and activities from the Renaissance community.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {typedEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="event-card">
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ 
                      backgroundImage: event.imageUrl 
                        ? `url(${event.imageUrl})` 
                        : 'url(https://images.unsplash.com/photo-1528605248644-14dd04022da1)' 
                    }}
                  ></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="text-sm text-warmgray-700 mb-4">
                      {new Date(event.dateTime).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <Link to="/signup">
                      <Button size="sm" variant="outline" className="w-full">View Event</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/signup">
                <Button variant="outline">View All Events</Button>
              </Link>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-renaissance-50 py-16">
            <div className="renaissance-container text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Join the Renaissance?</h2>
              <p className="text-warmgray-700 max-w-2xl mx-auto mb-8">
                Create your account today and start discovering events and connections that matter to you.
              </p>
              <Link to="/signup">
                <Button size="lg">Get Started Now</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="renaissance-container py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.email.split('@')[0]}</h1>
              <p className="text-muted-foreground">
                Discover events and connect with people who share your interests.
              </p>
            </div>
            
            <EventList 
              events={typedEvents.slice(0, 3)} 
              title="Recommended for You" 
              description="Based on your interests and location"
            />
            
            <div className="text-center">
              <Link to="/discover">
                <Button variant="outline">Discover More Events</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
