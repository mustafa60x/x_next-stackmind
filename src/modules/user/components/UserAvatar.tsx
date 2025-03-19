'use client';

interface UserAvatarProps {
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base'
};

export const UserAvatar = ({ username, size = 'md', className = '' }: UserAvatarProps) => {
  return (
    <div 
      className={`
        rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {username?.[0]?.toUpperCase()}
    </div>
  );
};
