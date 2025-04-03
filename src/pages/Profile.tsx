
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InterestSelector from "@/components/profile/InterestSelector";
import LocationDetection from "@/components/location/LocationDetection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="renaissance-container py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Profile Not Available</h1>
        <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
        <Button asChild>
          <a href="/signin">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="renaissance-container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your interests and preferences
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                {user.ageRange && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age Range</p>
                    <p>{user.ageRange}</p>
                  </div>
                )}
                {user.location && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p>{user.location.city || "Location set"}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="interests">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="interests">Interests</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="interests" className="pt-4">
                <InterestSelector />
              </TabsContent>
              
              <TabsContent value="location" className="pt-4">
                <LocationDetection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
