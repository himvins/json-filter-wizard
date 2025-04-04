
import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "blue" | "green" | "red";
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  className, 
  size = "md",
  color = "blue",
  ...props 
}) => {
  // Size mapping
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  // Color mapping
  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary", 
    accent: "border-accent",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent", 
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
