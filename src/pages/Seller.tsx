import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSellers, getProducts } from '@/lib/getData';
import { Seller as SellerType, Product } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProductCard } from '@/components/ui/ProductCard';
import { Store, User, CheckCircle2, Phone, MessageCircle, Send, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';

export const Seller = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState<SellerType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sellers = await getSellers();
        const foundSeller = sellers.find(s => s.slug === id || s.id === id);
        
        if (foundSeller) {
          setSeller(foundSeller);
          // For prototype, just show some random products as their offers
          const allProducts = await getProducts();
          setProducts(allProducts.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to fetch seller data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold font-display mb-4">Продавец не найден</h1>
        <p className="text-gray-500 mb-8">Возможно, ссылка устарела или продавец был удален.</p>
        <Link to="/catalog" className="text-primary hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6 flex flex-wrap gap-2">
        <Link to="/" className="hover:text-primary">Главная</Link>
        <span>&gt;</span>
        <span className="text-gray-900">{seller.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Seller Info Card */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-3xl font-bold text-gray-400">
                {seller.avatar ? <img src={seller.avatar} alt={seller.name} className="w-full h-full rounded-full object-cover" /> : seller.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-gray-900 flex items-center gap-2">
                  {seller.name}
                  {seller.verified && <CheckCircle2 className="h-5 w-5 text-success" />}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  {seller.type === 'shop' ? <Store className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span>{seller.type === 'shop' ? 'Магазин' : 'Частное лицо'}</span>
                </div>
                <div className="mt-2">
                  <StarRating rating={seller.rating} reviewCount={seller.reviewCount} showText />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span>{seller.location}</span>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span>На сайте с {new Date(seller.memberSince).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-gray-900 font-medium">{seller.successfulDeals} успешных сделок</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {seller.contacts.phone && (
                <a href={`tel:${seller.contacts.phone}`} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-xl font-medium transition-colors">
                  <Phone className="h-5 w-5" />
                  {seller.contacts.phone}
                </a>
              )}
              <div className="flex gap-3">
                {seller.contacts.whatsapp && (
                  <a href={`https://wa.me/${seller.contacts.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-xl font-medium transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>
                )}
                {seller.contacts.telegram && (
                  <a href={`https://t.me/${seller.contacts.telegram}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white px-4 py-3 rounded-xl font-medium transition-colors">
                    <Send className="h-5 w-5" />
                    Telegram
                  </a>
                )}
              </div>
            </div>

            {seller.contacts.workingHours && (
              <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-center text-gray-500">
                Режим работы: <span className="font-medium text-gray-900">{seller.contacts.workingHours}</span>
              </div>
            )}
          </div>

          {seller.description && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-3">О продавце</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {seller.description}
              </p>
            </div>
          )}
        </div>

        {/* Seller's Products */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">Все объявления ({seller.totalOffers})</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

