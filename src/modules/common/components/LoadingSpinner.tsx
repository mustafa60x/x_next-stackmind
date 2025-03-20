"use client";

import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
};
