'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]'
};

export const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
  return (
    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`} />
  );
};
