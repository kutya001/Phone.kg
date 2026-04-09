import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, Check } from 'lucide-react';
import { useCompareStore } from '@/store';
import { getProducts } from '@/lib/getData';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';

export const Compare = () => {
  const { items, removeItem, clear } = useCompareStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getProducts();
        // Keep the order of items in the store
        const comparedProducts = items.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[];
        setProducts(comparedProducts);
      } catch (error) {
        console.error("Failed to fetch compare products", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [items]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[600px] flex-1 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (items.length === 0 || products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Scale className="h-12 w-12 text-blue-300" />
        </div>
        <h1 className="text-3xl font-bold font-display mb-4">Сравнение товаров</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Добавляйте товары к сравнению, чтобы выбрать лучший вариант по характеристикам и цене.
        </p>
        <Link to="/catalog">
          <Button size="lg">Перейти в каталог</Button>
        </Link>
      </div>
    );
  }

  // Extract all unique spec groups and names
  const allSpecs: { groupName: string; specs: { name: string; values: string[] }[] }[] = [];
  
  products.forEach((product, pIdx) => {
    product.specs.forEach(group => {
      let existingGroup = allSpecs.find(g => g.groupName === group.groupName);
      if (!existingGroup) {
        existingGroup = { groupName: group.groupName, specs: [] };
        allSpecs.push(existingGroup);
      }

      group.specs.forEach(spec => {
        let existingSpec = existingGroup!.specs.find(s => s.name === spec.name);
        if (!existingSpec) {
          existingSpec = { name: spec.name, values: Array(products.length).fill('-') };
          existingGroup!.specs.push(existingSpec);
        }
        existingSpec.values[pIdx] = spec.value;
      });
    });
  });

  // Filter differences if needed
  const filteredSpecs = showOnlyDifferences 
    ? allSpecs.map(group => ({
        ...group,
        specs: group.specs.filter(spec => {
          const firstVal = spec.values[0];
          return spec.values.some(v => v !== firstVal);
        })
      })).filter(group => group.specs.length > 0)
    : allSpecs;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold font-display">
          Сравнение <span className="text-gray-400 text-xl font-normal">· {products.length} товара</span>
        </h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input 
              type="checkbox" 
              checked={showOnlyDifferences} 
              onChange={(e) => setShowOnlyDifferences(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            Показывать только различия
          </label>
          <button 
            onClick={clear}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Очистить
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px] flex flex-col">
          {/* Header Row */}
          <div className="flex border-b border-gray-200 pb-6">
            <div className="w-48 flex-shrink-0"></div>
            {products.map(product => (
              <div key={product.id} className="flex-1 px-4 flex flex-col relative group">
                <button 
                  onClick={() => removeItem(product.id)}
                  className="absolute top-0 right-4 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="aspect-square bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-center">
                  <img 
                    src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                
                <Link to={`/product/${product.slug}`} className="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2 h-12">
                  {product.name}
                </Link>
                
                <div className="mb-4">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} showText />
                </div>
                
                <div className="mt-auto">
                  {product.minPriceNew ? (
                    <div className="font-mono font-bold text-lg text-gray-900">
                      от {new Intl.NumberFormat('ru-RU').format(product.minPriceNew)} сом
                    </div>
                  ) : (
                    <div className="font-mono font-bold text-lg text-gray-500">
                      Нет в наличии
                    </div>
                  )}
                </div>
                
                <Link to={`/product/${product.slug}`} className="mt-4">
                  <Button variant="secondary" className="w-full">Смотреть</Button>
                </Link>
              </div>
            ))}
            {/* Empty slots if less than 3 products */}
            {Array.from({ length: 3 - products.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex-1 px-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <div className="text-gray-400 mb-2">
                  <Scale className="h-8 w-8" />
                </div>
                <span className="text-sm text-gray-500">Добавить товар</span>
                <Link to="/catalog" className="mt-4">
                  <Button variant="ghost" size="sm">В каталог</Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Specs Rows */}
          <div className="flex flex-col mt-8">
            {filteredSpecs.map((group, gIdx) => (
              <div key={gIdx} className="mb-8">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4 bg-gray-50 py-2 px-4 rounded-lg">
                  {group.groupName}
                </h3>
                <div className="flex flex-col border-t border-gray-100">
                  {group.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex border-b border-gray-100 py-3 hover:bg-gray-50/50 transition-colors">
                      <div className="w-48 flex-shrink-0 text-sm text-gray-500 pr-4 flex items-center">
                        {spec.name}
                      </div>
                      {spec.values.map((val, vIdx) => (
                        <div key={vIdx} className="flex-1 px-4 text-sm text-gray-900 flex items-center">
                          {val === 'Да' ? <Check className="h-4 w-4 text-success" /> : val}
                        </div>
                      ))}
                      {/* Empty slots for missing products */}
                      {Array.from({ length: 3 - products.length }).map((_, i) => (
                        <div key={`empty-val-${i}`} className="flex-1 px-4"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

