import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Smartphone, Headphones, Shield, Zap, Battery, Watch, Scale, MapPin } from 'lucide-react';
import { getCategories, getBrands, getProducts, getSellers, getOffers } from '@/lib/getData';
import { Category, Brand, Product, Seller, SellerOffer } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { MapComponent } from '@/components/map/MapComponent';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="h-8 w-8" />,
  Headphones: <Headphones className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  Battery: <Battery className="h-8 w-8" />,
  Watch: <Watch className="h-8 w-8" />,
};

export const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, brnds, prods, sllrs, offrs] = await Promise.all([
          getCategories(),
          getBrands(),
          getProducts(),
          getSellers(),
          getOffers()
        ]);
        setCategories(cats);
        setBrands(brnds);
        setAllProducts(prods);
        setFeaturedProducts(prods.filter(p => p.isPopular).slice(0, 4));
        setSellers(sllrs);
        setOffers(offrs);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const filteredSellers = useMemo(() => {
    if (!mapSearchQuery.trim()) return sellers;
    
    const query = mapSearchQuery.toLowerCase();
    
    // Find products matching the query
    const matchingProducts = allProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query)
    );
    const matchingProductIds = new Set(matchingProducts.map(p => p.id));
    
    // Find sellers who have these products in stock
    const sellerIdsWithProducts = new Set(
      offers
        .filter(o => matchingProductIds.has(o.productId) && o.inStock)
        .map(o => o.sellerId)
    );

    return sellers.filter(seller => 
      seller.name.toLowerCase().includes(query) || 
      sellerIdsWithProducts.has(seller.id)
    );
  }, [sellers, mapSearchQuery, allProducts, offers]);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-900 to-primary text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
            Найдите лучшую цену на телефон
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Сравниваем предложения сотен продавцов Кыргызстана
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="iPhone 17 Pro, Samsung S25..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 md:h-16 pl-14 pr-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark text-white px-6 rounded-full font-medium transition-colors hidden md:block">
              Найти
            </button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm text-blue-200">
            <span>Популярное:</span>
            <Link to="/search?q=iPhone 17 Pro" className="hover:text-white underline decoration-blue-400/30 underline-offset-4">iPhone 17 Pro</Link>
            <Link to="/search?q=Samsung S25" className="hover:text-white underline decoration-blue-400/30 underline-offset-4">Samsung S25</Link>
            <Link to="/search?q=AirPods" className="hover:text-white underline decoration-blue-400/30 underline-offset-4">AirPods</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
        
        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold font-display mb-6">Выберите категорию</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
            ) : (
              categories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/catalog?category=${category.slug}`}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                  <div className="text-primary mb-3 group-hover:scale-110 transition-transform">
                    {iconMap[category.icon] || <Smartphone className="h-8 w-8" />}
                  </div>
                  <span className="font-medium text-gray-900 text-center mb-1">{category.name}</span>
                  <span className="text-xs text-gray-500">{category.productCount} товаров</span>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Popular Brands */}
        <section>
          <h2 className="text-2xl font-bold font-display mb-6">Популярные бренды</h2>
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-32 flex-shrink-0 rounded-lg" />)
            ) : (
              brands.map(brand => (
                <Link
                  key={brand.id}
                  to={`/catalog?brand=${brand.slug}`}
                  className="flex-shrink-0 flex items-center justify-center h-16 w-32 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all snap-start"
                >
                  <span className="font-bold text-gray-700">{brand.name}</span>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">Топ смартфонов этой недели</h2>
            <Link to="/catalog?category=smartphones" className="text-primary hover:text-primary-dark font-medium text-sm">
              Смотреть все →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Магазины на карте
              </h2>
              <p className="text-gray-500 mt-1">Найдите ближайшего продавца нужного вам товара</p>
            </div>
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Поиск по магазинам или товарам..."
                value={mapSearchQuery}
                onChange={(e) => setMapSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="h-[500px] rounded-xl overflow-hidden border border-gray-200">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <MapComponent sellers={filteredSellers} className="w-full h-full z-0" />
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-blue-50 rounded-2xl p-8 md:p-12 my-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Как найти лучшую цену?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Мы не продаем товары, мы помогаем вам найти самое выгодное предложение на рынке.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-primary mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Найдите товар</h3>
              <p className="text-gray-600 text-sm">Введите название в поиск или выберите из удобного каталога.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-primary mb-4">
                <Scale className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Сравните предложения</h3>
              <p className="text-gray-600 text-sm">Смотрите цены от магазинов и частных лиц на новые и б/у устройства.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-primary mb-4">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Свяжитесь с продавцом</h3>
              <p className="text-gray-600 text-sm">Напишите в WhatsApp или позвоните продавцу напрямую без посредников.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

