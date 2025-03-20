"use client";

import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingOverlayProps {
  size?: "sm" | "md" | "lg";
}

export const LoadingOverlay = ({ size = "md" }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10 backdrop-blur-sm">
      <LoadingSpinner size={size} />
    </div>
  );
};
