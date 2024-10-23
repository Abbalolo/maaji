import * as React from "react";
import { cn } from "@/lib/utils"; // Ensure that the path and function are correct

// InputProps extends React.InputHTMLAttributes but doesn't add anything yet
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  customProp?: string; // Example of a custom property
}

// Input component using forwardRef to pass down refs
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className // Merge additional classes from props
        )}
        ref={ref} // Pass the ref down
        {...props} // Spread the remaining props
      />
    );
  }
);

Input.displayName = "Input";

export { Input };