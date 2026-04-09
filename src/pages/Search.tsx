import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Fuse from 'fuse.js';
import { getProducts } from '@/lib/getData';
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch products for search", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && q) {
      const fuse = new Fuse(products, {
        keys: ['name', 'brand', 'category', 'tags', 'specs.specs.value'],
        threshold: 0.3,
        ignoreLocation: true,
      });
      
      const searchResults = fuse.search(q).map(result => result.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [q, products]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">
          Результаты по запросу: «{q}»
        </h1>
        <p className="text-gray-500">
          Найдено {results.length} товаров
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon className="h-12 w-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-4">Ничего не найдено</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Мы не нашли товаров по вашему запросу. Попробуйте изменить формулировку или проверьте правописание.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button>Перейти в каталог</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

