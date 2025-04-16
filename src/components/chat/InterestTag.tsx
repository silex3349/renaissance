
import React from "react";
import { Interest } from "@/types";

interface InterestTagProps {
  interest: Interest;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  minimal?: boolean;
  pill?: boolean;
}

export const InterestTag: React.FC<InterestTagProps> = ({
  interest,
  isSelected = false,
  onClick,
  className = "",
  minimal = false,
  pill = false
}) => {
  if (minimal) {
    return (
      <span 
        className={`text-xs text-primary/80 mr-2 ${className}`}
        onClick={onClick}
      >
        #{interest.name}
      </span>
    );
  }
  
  if (pill) {
    return (
      <span
        className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary mr-1.5 ${className}`}
      >
        {interest.name}
      </span>
    );
  }
  
  const baseClasses = "interest-tag";
  const selectedClasses = isSelected ? "interest-tag-selected" : "interest-tag-unselected";
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${selectedClasses} ${className}`}
      onClick={onClick}
    >
      {interest.name}
    </button>
  );
};
