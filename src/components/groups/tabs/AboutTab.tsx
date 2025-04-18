
import React from 'react';

interface AboutTabProps {
  description: string;
}

const AboutTab = ({ description }: AboutTabProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">About this group</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default AboutTab;
