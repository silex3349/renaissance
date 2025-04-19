
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import InterestSelector from "@/components/profile/InterestSelector";

const EventInterests = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div>
          <label className="block text-sm font-medium mb-1">Interests</label>
          <InterestSelector />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventInterests;
