
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Users, Compass, MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <div className="container px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Welcome to Renaissance</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with people through shared interests and local activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                Events
              </CardTitle>
              <CardDescription>Discover and join local events based on your interests</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Browse through a variety of events happening in your area, from casual meetups to structured activities.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="default" className="w-full">
                <Link to="/events">Explore Events</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                Groups
              </CardTitle>
              <CardDescription>Join communities of people with similar interests</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Connect with like-minded individuals in groups focused on specific interests, hobbies, or activities.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="default" className="w-full">
                <Link to="/groups">Find Groups</Link>
              </Button>
            </CardFooter>
          </Card>

          {user && (
            <>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Compass className="mr-2 h-5 w-5 text-purple-500" />
                    Discover
                  </CardTitle>
                  <CardDescription>Find new connections based on your preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Discover people who share your interests and connect with potential friends in your area.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="default" className="w-full">
                    <Link to="/discover">Start Discovering</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
                    Messages
                  </CardTitle>
                  <CardDescription>Chat with your connections and groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Keep in touch with your new connections through direct messages and group chats.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="default" className="w-full">
                    <Link to="/chats">Go to Messages</Link>
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>

        {!user && (
          <div className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">Create an account to unlock all features</p>
            <Button asChild size="lg" className="mr-4">
              <Link to="/auth">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
