
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from "@/components/ui/sheet";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationDetection from "@/components/location/LocationDetection";
import { Check, Filter, MapPin, Star, Calendar, Users, Cpu } from "lucide-react";

interface FilterOptions {
  onlyNearby: boolean;
  maxDistance: number;
  minRating: number;
  dateRange: string;
  capacity: [number, number];
  categories: string[];
  badges: string[];
  sortBy: string;
}

interface EventsFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: FilterOptions;
  onApplyFilters: (options: FilterOptions) => void;
  onLocationDetected: () => void;
}

const EventsFilter = ({
  open,
  onOpenChange,
  options,
  onApplyFilters,
  onLocationDetected
}: EventsFilterProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(options);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(options.categories || []);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(options.badges || []);

  const categories = [
    "Arts & Culture", "Technology", "Health & Wellness", "Sports",
    "Food & Drink", "Music", "Education", "Business", "Outdoors"
  ];

  const badges = [
    "Trending", "Top Rated", "New", "Popular", "Family Friendly", 
    "Free", "Premium", "Verified", "Featured"
  ];

  const handleReset = () => {
    setFilterOptions({
      onlyNearby: false,
      maxDistance: 50,
      minRating: 0,
      dateRange: "all",
      capacity: [0, 500],
      categories: [],
      badges: [],
      sortBy: "relevance"
    });
    setSelectedCategories([]);
    setSelectedBadges([]);
  };

  const handleApply = () => {
    const updatedOptions = {
      ...filterOptions,
      categories: selectedCategories,
      badges: selectedBadges
    };
    onApplyFilters(updatedOptions);
    onOpenChange(false);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter Options
          </SheetTitle>
          <SheetDescription>
            Customize your discovery experience
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="location">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>Location</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="nearby-filter">Show only nearby</Label>
                    <Switch 
                      id="nearby-filter" 
                      checked={filterOptions.onlyNearby} 
                      onCheckedChange={(checked) => {
                        setFilterOptions(prev => ({...prev, onlyNearby: checked}));
                      }} 
                    />
                  </div>
                  
                  {filterOptions.onlyNearby && (
                    <div className="space-y-2">
                      <Label>Maximum distance: {filterOptions.maxDistance} km</Label>
                      <Slider 
                        value={[filterOptions.maxDistance]} 
                        min={1} 
                        max={100} 
                        step={1}
                        onValueChange={(val) => setFilterOptions(prev => ({...prev, maxDistance: val[0]}))}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Update Your Location</Label>
                    <LocationDetection onComplete={onLocationDetected} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="ratings">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  <span>Ratings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Label>Minimum rating: {filterOptions.minRating} stars</Label>
                <Slider 
                  value={[filterOptions.minRating]} 
                  min={0} 
                  max={5} 
                  step={0.5}
                  onValueChange={(val) => setFilterOptions(prev => ({...prev, minRating: val[0]}))}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="date">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Date Range</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Select 
                  value={filterOptions.dateRange}
                  onValueChange={(value) => setFilterOptions(prev => ({...prev, dateRange: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="thisWeek">This week</SelectItem>
                      <SelectItem value="thisWeekend">This weekend</SelectItem>
                      <SelectItem value="nextWeek">Next week</SelectItem>
                      <SelectItem value="nextMonth">Next month</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="capacity">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>Capacity</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Label>
                    Event size: {filterOptions.capacity[0]} - {filterOptions.capacity[1] === 500 ? '500+' : filterOptions.capacity[1]} people
                  </Label>
                  <Slider 
                    value={filterOptions.capacity} 
                    min={0} 
                    max={500} 
                    step={10}
                    onValueChange={(val) => setFilterOptions(prev => ({...prev, capacity: [val[0], val[1]]}))}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="categories">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center">
                  <Cpu className="mr-2 h-5 w-5" />
                  <span>Categories</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {selectedCategories.includes(category) && <Check className="mr-1 h-3 w-3" />}
                      {category}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="badges">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  <span>Badges</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  {badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant={selectedBadges.includes(badge) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleBadge(badge)}
                    >
                      {selectedBadges.includes(badge) && <Check className="mr-1 h-3 w-3" />}
                      {badge}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="sort">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center">
                  <span>Sort By</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Select 
                  value={filterOptions.sortBy}
                  onValueChange={(value) => setFilterOptions(prev => ({...prev, sortBy: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sorting method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date-asc">Date (earliest first)</SelectItem>
                      <SelectItem value="date-desc">Date (latest first)</SelectItem>
                      <SelectItem value="distance">Distance (closest first)</SelectItem>
                      <SelectItem value="rating">Rating (highest first)</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <SheetFooter className="flex justify-between sm:justify-between mt-6">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EventsFilter;
