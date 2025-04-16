
import { Interest } from "@/types";
import { useState, useEffect } from "react";
import { INTERESTS, INTEREST_CATEGORIES } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface InterestSelectorProps {
  onComplete?: () => void;
  selectedInterests?: string[];
  onInterestsChange?: (interests: string[]) => void;
  availableInterests?: Interest[];
  className?: string;
  showContinueOnly?: boolean;
}

const InterestSelector = ({ 
  onComplete,
  selectedInterests: externalSelectedInterests,
  onInterestsChange,
  availableInterests = INTERESTS,
  className,
  showContinueOnly = false
}: InterestSelectorProps) => {
  const { user, updateUserInterests } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(externalSelectedInterests || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  useEffect(() => {
    if (!externalSelectedInterests && user?.interests && user.interests.length > 0) {
      setSelectedInterests(user.interests.map(interest => interest.id));
    }
  }, [user, externalSelectedInterests]);

  useEffect(() => {
    if (externalSelectedInterests) {
      setSelectedInterests(externalSelectedInterests);
    }
  }, [externalSelectedInterests]);

  const handleInterestToggle = (interestId: string) => {
    const newSelectedInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    
    setSelectedInterests(newSelectedInterests);
    
    if (onInterestsChange) {
      onInterestsChange(newSelectedInterests);
    }
  };

  const filteredInterests = availableInterests.filter(interest => {
    const matchesSearch = interest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || interest.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get selected interests objects for display
  const selectedInterestObjects = availableInterests.filter(interest => 
    selectedInterests.includes(interest.id)
  );

  const handleSave = () => {
    // Save selected interests to user profile
    updateUserInterests(selectedInterests);
    
    if (onComplete) onComplete();
  };

  return (
    <div className={cn("space-y-5 py-2 animate-fade-in", className)}>
      <div className="space-y-1.5">
        <h3 className="text-xl font-medium">Select Your Interests</h3>
        <p className="text-sm text-muted-foreground">
          Choose interests that resonate with you. We'll use these to suggest events and connect you with like-minded people.
        </p>
      </div>

      {/* Selected interests row at the top */}
      {selectedInterests.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-muted-foreground">Selected Interests</h4>
          <ScrollArea className="max-h-24">
            <div className="flex flex-wrap gap-1.5 pb-1">
              {selectedInterestObjects.map(interest => (
                <Badge 
                  key={interest.id} 
                  variant="outline" 
                  className="px-2.5 py-1 rounded-full flex items-center gap-1 border-primary/20 text-primary hover:bg-transparent hover:border-primary"
                >
                  {interest.name}
                  <button 
                    onClick={() => handleInterestToggle(interest.id)}
                    className="ml-1 text-primary/70 hover:text-primary"
                    aria-label={`Remove ${interest.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search interests..."
          className="pl-10 border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="max-h-12">
        <div className="flex flex-nowrap gap-1.5 pb-1">
          <Button
            variant={activeCategory === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className="rounded-full whitespace-nowrap text-xs px-3 py-1 h-auto"
          >
            All
          </Button>
          {INTEREST_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-full whitespace-nowrap text-xs px-3 py-1 h-auto"
            >
              {category}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="border-0 rounded-lg p-2 bg-transparent">
        <ScrollArea className="h-[280px] pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {filteredInterests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                className={cn(
                  "transition-all py-2 px-3 rounded-md text-left text-sm",
                  selectedInterests.includes(interest.id)
                    ? "text-primary hover:bg-primary/5"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {interest.name}
              </button>
            ))}
          </div>
          
          {filteredInterests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No interests found matching your search.
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="text-xs text-muted-foreground">
        Selected {selectedInterests.length} of {availableInterests.length} interests
      </div>

      <Button 
        className="w-full bg-purple-600 hover:bg-purple-700 shadow-none" 
        onClick={handleSave}
        disabled={selectedInterests.length === 0}
      >
        {showContinueOnly ? (
          <>Continue <ChevronRight className="ml-1 h-4 w-4" /></>
        ) : (
          "Save Interests"
        )}
      </Button>
    </div>
  );
};

export default InterestSelector;
