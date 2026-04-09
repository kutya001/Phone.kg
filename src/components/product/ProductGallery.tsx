import React, { useState } from 'react';
import { ProductImage } from '@/types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const primaryImageIndex = images.findIndex(img => img.isPrimary);
  const initialIndex = primaryImageIndex >= 0 ? primaryImageIndex : 0;

  React.useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">Нет фото</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-8 cursor-zoom-in group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img 
          src={images[activeIndex].url} 
          alt={images[activeIndex].alt || productName} 
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
        
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
          <Maximize2 className="h-5 w-5" />
        </button>

        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-white snap-start transition-colors",
                activeIndex === idx ? "border-primary" : "border-transparent hover:border-gray-200"
              )}
            >
              <img 
                src={img.url} 
                alt={img.alt || `${productName} thumbnail ${idx + 1}`} 
                className="w-full h-full object-contain mix-blend-multiply p-2"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="absolute top-6 left-6 text-white/70 font-mono">
            {activeIndex + 1} / {images.length}
          </div>

          <div className="relative w-full max-w-5xl h-full max-h-[80vh] flex items-center justify-center p-4">
            <img 
              src={images[activeIndex].url} 
              alt={images[activeIndex].alt || productName} 
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
