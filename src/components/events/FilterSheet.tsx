
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import LocationDetection from "@/components/location/LocationDetection";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterOnlyNearby: boolean;
  onFilterChange: (checked: boolean) => void;
  onLocationDetected: () => void;
}

const FilterSheet = ({ 
  open, 
  onOpenChange, 
  filterOnlyNearby, 
  onFilterChange,
  onLocationDetected
}: FilterSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Options</SheetTitle>
          <SheetDescription>
            Customize your discovery experience
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="nearby-filter">Show only nearby</Label>
              <p className="text-sm text-muted-foreground">
                Filter items near your current location
              </p>
            </div>
            <Switch 
              id="nearby-filter" 
              checked={filterOnlyNearby} 
              onCheckedChange={onFilterChange} 
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Update Your Location</Label>
            <LocationDetection onComplete={onLocationDetected} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
