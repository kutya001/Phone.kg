import React from 'react';
import { cn } from '@/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'new' | 'hit' | 'verified' | 'used' | 'excellent' | 'good' | 'fair' | 'default';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      new: 'bg-blue-100 text-blue-800',
      hit: 'bg-orange-100 text-orange-800',
      verified: 'bg-green-100 text-green-800',
      used: 'bg-yellow-100 text-yellow-800',
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-yellow-100 text-yellow-800',
      fair: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = 'Badge';
