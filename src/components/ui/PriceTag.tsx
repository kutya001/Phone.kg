import React from 'react';
import { cn, formatPrice } from '@/utils';

interface PriceTagProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number;
  oldPrice?: number;
  currency?: string;
  isBestPrice?: boolean;
}

export const PriceTag = React.forwardRef<HTMLDivElement, PriceTagProps>(
  ({ className, price, oldPrice, currency = 'сом', isBestPrice, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col', className)} {...props}>
        {oldPrice && (
          <span className="text-sm text-gray-400 line-through font-mono">
            {formatPrice(oldPrice, currency)}
          </span>
        )}
        <span className={cn('font-mono font-bold', isBestPrice ? 'text-success text-xl' : 'text-gray-900 text-lg')}>
          {formatPrice(price, currency)}
        </span>
      </div>
    );
  }
);
PriceTag.displayName = 'PriceTag';
