import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, X, Search, Store, Smartphone, Star, MapPin, Phone } from 'lucide-react';
import { getProducts, getCategories, getBrands, getSellers, getOffers } from '@/lib/getData';
import { Product, Category, Brand, Seller, SellerOffer } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [catalogMode, setCatalogMode] = useState<'products' | 'sellers'>('products');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const activeCategory = searchParams.get('category');
  const activeBrand = searchParams.get('brand');
  const activeSeller = searchParams.get('seller');
  const sort = searchParams.get('sort') || 'popular';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prods, cats, brnds, sllrs, offrs] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
          getSellers(),
          getOffers()
        ]);
        
        let filtered = [...prods];
        if (activeCategory) {
          filtered = filtered.filter(p => p.category === activeCategory);
        }
        if (activeBrand) {
          filtered = filtered.filter(p => p.brand === activeBrand);
        }
        if (activeSeller) {
          const sellerOffers = offrs.filter(o => o.sellerId === activeSeller);
          const productIds = new Set(sellerOffers.map(o => o.productId));
          filtered = filtered.filter(p => productIds.has(p.id));
        }

        // Sorting
        if (sort === 'price_asc') {
          filtered.sort((a, b) => (a.minPriceNew || a.minPriceUsed || 0) - (b.minPriceNew || b.minPriceUsed || 0));
        } else if (sort === 'price_desc') {
          filtered.sort((a, b) => (b.minPriceNew || b.minPriceUsed || 0) - (a.minPriceNew || a.minPriceUsed || 0));
        } else if (sort === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'newest') {
          filtered.sort((a, b) => b.releaseYear - a.releaseYear);
        } else {
          // popular
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        }

        setProducts(filtered);
        setCategories(cats);
        setBrands(brnds);
        setSellers(sllrs);
        setOffers(offrs);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeCategory, activeBrand, activeSeller, sort]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Категория</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              checked={!activeCategory} 
              onChange={() => updateFilter('category', null)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Все категории</span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                checked={activeCategory === cat.slug}
                onChange={() => updateFilter('category', cat.slug)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
              <span className="text-xs text-gray-400 ml-auto">{cat.productCount}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-3">Бренд</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="brand" 
              checked={!activeBrand} 
              onChange={() => updateFilter('brand', null)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Все бренды</span>
          </label>
          {brands.map(brand => (
            <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="brand" 
                checked={activeBrand === brand.slug}
                onChange={() => updateFilter('brand', brand.slug)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-3">Продавец</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="seller" 
              checked={!activeSeller} 
              onChange={() => updateFilter('seller', null)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Все продавцы</span>
          </label>
          {sellers.map(seller => (
            <label key={seller.id} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="seller" 
                checked={activeSeller === seller.id}
                onChange={() => updateFilter('seller', seller.id)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{seller.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="ghost" className="w-full text-sm" onClick={clearFilters}>
        Сбросить все
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6">
        Главная &gt; Каталог {activeCategory && `> ${categories.find(c => c.slug === activeCategory)?.name}`}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button 
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setCatalogMode('products')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${catalogMode === 'products' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Товары
                </button>
                <button 
                  onClick={() => setCatalogMode('sellers')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${catalogMode === 'sellers' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Продавцы
                </button>
              </div>
              
              {catalogMode === 'products' && (
                <span className="text-sm text-gray-500 hidden md:inline-block">Найдено {products.length} товаров</span>
              )}
            </div>

            {catalogMode === 'products' && (
              <div className="flex items-center gap-4">
                <select 
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="popular">По популярности</option>
                  <option value="rating">По рейтингу</option>
                  <option value="price_asc">Сначала дешевле</option>
                  <option value="price_desc">Сначала дороже</option>
                  <option value="newest">По новизне</option>
                </select>

                <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setView('grid')}
                    className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setView('list')}
                    className={`p-1.5 rounded-md ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Filters */}
          {(activeCategory || activeBrand || activeSeller) && catalogMode === 'products' && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm">
                  {categories.find(c => c.slug === activeCategory)?.name}
                  <button onClick={() => updateFilter('category', null)} className="hover:text-blue-800"><X className="h-3 w-3" /></button>
                </span>
              )}
              {activeBrand && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm">
                  {brands.find(b => b.slug === activeBrand)?.name}
                  <button onClick={() => updateFilter('brand', null)} className="hover:text-blue-800"><X className="h-3 w-3" /></button>
                </span>
              )}
              {activeSeller && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm">
                  {sellers.find(s => s.id === activeSeller)?.name}
                  <button onClick={() => updateFilter('seller', null)} className="hover:text-blue-800"><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <div className={catalogMode === 'products' && view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" : "flex flex-col gap-4"}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className={catalogMode === 'products' && view === 'grid' ? "h-80 rounded-xl" : "h-40 rounded-xl"} />
              ))}
            </div>
          ) : catalogMode === 'sellers' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellers.map(seller => (
                <Link key={seller.id} to={`/seller/${seller.id}`} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <Store className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          {seller.name}
                          {seller.verified && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                              PRO
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium text-gray-900">{seller.rating}</span>
                          <span className="text-gray-500">({seller.reviewCount} отзывов)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{seller.location}</span>
                    </div>
                    {seller.contacts.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{seller.contacts.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 shrink-0" />
                      <span>{seller.totalOffers} предложений</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" : "flex flex-col gap-4"}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} view={view} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-gray-500 mb-6">Попробуйте изменить параметры фильтрации</p>
              <Button onClick={clearFilters}>Сбросить фильтры</Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsMobileFiltersOpen(false)}>
          <div 
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Фильтры</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <FilterPanel />
            <div className="mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
              <Button className="w-full" onClick={() => setIsMobileFiltersOpen(false)}>
                Показать {products.length} товаров
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

