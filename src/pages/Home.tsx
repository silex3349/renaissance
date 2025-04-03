
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import EventList from "@/components/events/EventList";
import { MOCK_EVENTS } from "@/services/mockData";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {!user ? (
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="renaissance-container pt-16 md:pt-24 pb-16 text-center md:text-left flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-renaissance-950">
                Connect Through Shared Experiences
              </h1>
              <p className="text-xl text-warmgray-700 max-w-md mx-auto md:mx-0">
                Renaissance helps you find meaningful connections based on common interests and local activities, not profiles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/discover">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Events
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative h-80 w-80 md:h-96 md:w-96 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-renaissance-100 to-renaissance-50 rounded-full animate-pulse-soft"></div>
                <img 
                  src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=800" 
                  alt="People connecting" 
                  className="absolute inset-4 object-cover rounded-full shadow-xl"
                />
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="bg-warmgray-50 py-16">
            <div className="renaissance-container">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How Renaissance Works</h2>
                <p className="text-warmgray-700 max-w-2xl mx-auto">
                  Discover new connections based on shared interests and activities, not endless scrolling through profiles.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-renaissance-100 text-renaissance-600 flex items-center justify-center rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Choose Your Interests</h3>
                  <p className="text-warmgray-700">
                    Select activities and topics you're passionate about to find events that match your interests.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-renaissance-100 text-renaissance-600 flex items-center justify-center rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Discover Local Events</h3>
                  <p className="text-warmgray-700">
                    Find activities happening near you, from book clubs to hiking groups to cooking classes.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-renaissance-100 text-renaissance-600 flex items-center justify-center rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect Naturally</h3>
                  <p className="text-warmgray-700">
                    Meet people through shared experiences, creating authentic connections beyond profiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Events */}
          <div className="py-16 renaissance-container">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Happening Soon</h2>
              <p className="text-warmgray-700 max-w-2xl mx-auto">
                Explore upcoming events and activities from the Renaissance community.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {MOCK_EVENTS.slice(0, 3).map((event) => (
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
              events={MOCK_EVENTS.slice(0, 3)} 
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
