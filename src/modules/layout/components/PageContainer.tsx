'use client';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return (
    <div className={`max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};
