import { Interest } from "@/types";
import { useState, useEffect } from "react";
import { INTERESTS, INTEREST_CATEGORIES } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
  onComplete?: () => void;
  selectedInterests?: string[];
  onInterestsChange?: (interests: string[]) => void;
  availableInterests?: Interest[];
  className?: string;
}

const InterestSelector = ({ 
  onComplete,
  selectedInterests: externalSelectedInterests,
  onInterestsChange,
  availableInterests = INTERESTS,
  className
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

  const handleSave = () => {
    if (onInterestsChange) {
      onInterestsChange(selectedInterests);
    } else {
      updateUserInterests(selectedInterests);
    }
    
    if (onComplete) onComplete();
  };

  return (
    <div className={cn("space-y-6 py-4 animate-fade-in", className)}>
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Select Your Interests</h3>
        <p className="text-muted-foreground">
          Choose interests that resonate with you. We'll use these to suggest events and connect you with like-minded people.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search interests..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
          className="rounded-full"
        >
          All
        </Button>
        {INTEREST_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredInterests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => handleInterestToggle(interest.id)}
              className={cn(
                "interest-tag",
                selectedInterests.includes(interest.id)
                  ? "interest-tag-selected"
                  : "interest-tag-unselected"
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
      </div>

      <div className="text-sm text-muted-foreground">
        Selected {selectedInterests.length} of {availableInterests.length} interests
      </div>

      <Button 
        className="w-full" 
        onClick={handleSave}
        disabled={selectedInterests.length === 0}
      >
        Save Interests
      </Button>
    </div>
  );
};

export default InterestSelector;
