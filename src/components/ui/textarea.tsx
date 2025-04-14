
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    // Auto-resize the textarea as content grows
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    const handleTextareaResize = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        // Set the height to match the content (with a max height)
        const newHeight = Math.min(textarea.scrollHeight, 150);
        textarea.style.height = `${newHeight}px`;
      }
    }, []);
    
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        // Set initial height
        handleTextareaResize();
        // Add event listeners
        textarea.addEventListener('input', handleTextareaResize);
      }
      
      return () => {
        if (textarea) {
          textarea.removeEventListener('input', handleTextareaResize);
        }
      };
    }, [handleTextareaResize]);
    
    // Combine refs
    const combinedRef = (node: HTMLTextAreaElement) => {
      textareaRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={combinedRef}
        rows={1}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
