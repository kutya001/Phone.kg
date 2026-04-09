import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from './Badge';
import { PriceTag } from './PriceTag';
import { StarRating } from './StarRating';
import { useWishlistStore, useCompareStore } from '@/store';
import { cn } from '@/utils';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, view = 'grid' }) => {
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { items: compareItems, addItem: addCompare, removeItem: removeCompare } = useCompareStore();

  const isWishlisted = wishlistItems.includes(product.id);
  const isCompared = compareItems.includes(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    isWishlisted ? removeWishlist(product.id) : addWishlist(product.id);
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    isCompared ? removeCompare(product.id) : addCompare(product.id);
  };

  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url;

  if (view === 'list') {
    return (
      <Link to={`/product/${product.slug}`} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md" />
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <Badge variant="new">Новинка</Badge>}
            {product.isPopular && <Badge variant="hit">Хит</Badge>}
          </div>
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button onClick={toggleWishlist} className={cn("p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-gray-400 hover:text-red-500 transition-colors", isWishlisted && "text-red-500")}>
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
            </button>
            <button onClick={toggleCompare} className={cn("p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-gray-400 hover:text-primary transition-colors", isCompared && "text-primary")}>
              <Scale className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 py-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} showText />
          </div>
          <div className="text-sm text-gray-500 mb-4 line-clamp-2">
            {product.shortDescription}
          </div>
          
          <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              {product.minPriceNew && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-12">Новый:</span>
                  <span className="font-mono font-bold text-lg text-gray-900">от {new Intl.NumberFormat('ru-RU').format(product.minPriceNew)} сом</span>
                </div>
              )}
              {product.minPriceUsed && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-12">Б/У:</span>
                  <span className="font-mono font-bold text-gray-600">от {new Intl.NumberFormat('ru-RU').format(product.minPriceUsed)} сом</span>
                </div>
              )}
            </div>
            <div className="text-primary font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Смотреть цены <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.slug}`} className="flex flex-col p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group h-full">
      <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-md" />
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge variant="new">Новинка</Badge>}
          {product.isPopular && <Badge variant="hit">Хит</Badge>}
        </div>
        <button 
          onClick={toggleWishlist}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-gray-400 hover:text-red-500 transition-colors",
            isWishlisted && "text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
        </button>
      </div>
      
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="mb-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} showText />
        </div>
        
        <div className="mt-auto flex flex-col gap-1">
          {product.minPriceNew && (
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">от</span>
              <span className="font-mono font-bold text-gray-900">{new Intl.NumberFormat('ru-RU').format(product.minPriceNew)} сом</span>
              <span className="text-[10px] text-gray-400 ml-1">Новый</span>
            </div>
          )}
          {product.minPriceUsed && (
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">от</span>
              <span className="font-mono font-medium text-gray-500">{new Intl.NumberFormat('ru-RU').format(product.minPriceUsed)} сом</span>
              <span className="text-[10px] text-gray-400 ml-1">Б/У</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
