import React from 'react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { Heart, Scale, ChevronRight } from 'lucide-react';
import { useWishlistStore, useCompareStore } from '@/store';
import { cn } from '@/utils';

interface ProductHeaderProps {
  product: Product;
  onTabChange: (tab: string) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ product, onTabChange }) => {
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { items: compareItems, addItem: addCompare, removeItem: removeCompare } = useCompareStore();

  const isWishlisted = wishlistItems.includes(product.id);
  const isCompared = compareItems.includes(product.id);

  const toggleWishlist = () => {
    isWishlisted ? removeWishlist(product.id) : addWishlist(product.id);
  };

  const toggleCompare = () => {
    isCompared ? removeCompare(product.id) : addCompare(product.id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="default" className="uppercase tracking-wider">{product.brand}</Badge>
          {product.isNew && <Badge variant="new">Новинка</Badge>}
          {product.isPopular && <Badge variant="hit">Хит продаж</Badge>}
        </div>
        
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
          {product.name}
        </h1>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onTabChange('reviews')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4">
              {product.reviewCount} отзывов
            </span>
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-4">
        {product.minPriceNew && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="font-medium text-gray-700">Новые</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono font-bold text-xl text-gray-900">
                от {new Intl.NumberFormat('ru-RU').format(product.minPriceNew)} сом
              </span>
              <button 
                onClick={() => onTabChange('sellers')}
                className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
              >
                Смотреть предложения <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {product.minPriceNew && product.minPriceUsed && <div className="h-px bg-gray-200 w-full"></div>}

        {product.minPriceUsed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="font-medium text-gray-700">Б/У</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono font-bold text-xl text-gray-900">
                от {new Intl.NumberFormat('ru-RU').format(product.minPriceUsed)} сом
              </span>
              <button 
                onClick={() => onTabChange('sellers')}
                className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
              >
                Смотреть предложения <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button 
          onClick={toggleWishlist}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-medium transition-colors border",
            isWishlisted 
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          )}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
          {isWishlisted ? "В избранном" : "В избранное"}
        </button>
        <button 
          onClick={toggleCompare}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-medium transition-colors border",
            isCompared 
              ? "bg-blue-50 text-primary border-blue-200 hover:bg-blue-100" 
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          )}
        >
          <Scale className="h-5 w-5" />
          {isCompared ? "В сравнении" : "Сравнить"}
        </button>
      </div>

      {/* Key Specs */}
      <div className="mt-2">
        <h3 className="font-bold text-gray-900 mb-3">Краткие характеристики:</h3>
        <ul className="space-y-2">
          {product.specs.flatMap(g => g.specs).filter(s => s.highlight).slice(0, 5).map((spec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-gray-500 min-w-[120px]">{spec.name}:</span>
              <span className="text-gray-900 font-medium">{spec.value}</span>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => onTabChange('specs')}
          className="mt-4 text-sm font-medium text-primary hover:text-primary-dark"
        >
          Все характеристики →
        </button>
      </div>
    </div>
  );
};
