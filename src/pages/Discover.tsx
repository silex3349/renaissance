
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import EventList from "@/components/events/EventList";
import { INTERESTS, MOCK_EVENTS } from "@/services/mockData";

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(INTERESTS.map(interest => interest.category)));

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      event.interests.some(interest => interest.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="renaissance-container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discover</h1>
          <p className="text-muted-foreground">
            Find events and activities based on your interests
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, activities..."
            className="pl-10 py-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-6 pt-4">
            <EventList 
              events={filteredEvents} 
              title={searchTerm || selectedCategory ? "Search Results" : "Upcoming Events"}
              description={
                filteredEvents.length === 0
                  ? "No events found matching your criteria"
                  : `Found ${filteredEvents.length} events${selectedCategory ? ` in ${selectedCategory}` : ""}`
              }
            />
          </TabsContent>
          
          <TabsContent value="people" className="pt-4">
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                The people discovery feature is under development.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Discover;
