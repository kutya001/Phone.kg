import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  reviewCount?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'sm',
  className,
  showText = false,
  reviewCount
}) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconSize = sizes[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex text-yellow-400">
        {[...Array(maxRating)].map((_, i) => {
          const value = i + 1;
          if (rating >= value) {
            return <Star key={i} className={cn(iconSize, 'fill-current')} />;
          } else if (rating >= value - 0.5) {
            return (
              <div key={i} className="relative">
                <Star className={cn(iconSize, 'text-gray-300')} />
                <StarHalf className={cn(iconSize, 'fill-current absolute top-0 left-0')} />
              </div>
            );
          } else {
            return <Star key={i} className={cn(iconSize, 'text-gray-300')} />;
          }
        })}
      </div>
      {showText && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)} {reviewCount !== undefined && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
};
