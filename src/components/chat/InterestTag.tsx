
import React from "react";
import { Interest } from "@/types";

interface InterestTagProps {
  interest: Interest;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  minimal?: boolean;
}

export const InterestTag: React.FC<InterestTagProps> = ({
  interest,
  isSelected = false,
  onClick,
  className = "",
  minimal = false
}) => {
  const baseClasses = "interest-tag";
  const selectedClasses = isSelected ? "interest-tag-selected" : "interest-tag-unselected";
  
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
