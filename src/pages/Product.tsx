import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getOffersByProductId, getSellers, getReviewsByProductId, getProducts } from '@/lib/getData';
import { Product as ProductType, SellerOffer, Seller, ProductReview } from '@/types';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductHeader } from '@/components/product/ProductHeader';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { ProductDescription } from '@/components/product/ProductDescription';
import { SellersBlock } from '@/components/product/SellersBlock';
import { ReviewsBlock } from '@/components/product/ReviewsBlock';
import { ProductCard } from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRecentlyViewedStore } from '@/store';
import { MapComponent } from '@/components/map/MapComponent';

export const Product = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'sellers' | 'reviews'>('sellers');
  const [hoveredSellerId, setHoveredSellerId] = useState<string | null>(null);
  const [clickedSellerId, setClickedSellerId] = useState<string | null>(null);
  
  const addRecentlyViewed = useRecentlyViewedStore(state => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const prod = await getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          addRecentlyViewed(prod.id);
          
          const [offs, slls, revs, allProds] = await Promise.all([
            getOffersByProductId(prod.id),
            getSellers(),
            getReviewsByProductId(prod.id),
            getProducts()
          ]);
          
          setOffers(offs);
          setSellers(slls);
          setReviews(revs);
          
          if (prod.relatedProducts) {
            setRelatedProducts(allProds.filter(p => prod.relatedProducts.includes(p.id)));
          }
        }
      } catch (error) {
        console.error("Failed to fetch product data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    window.scrollTo(0, 0);
  }, [slug, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2"><Skeleton className="aspect-square rounded-2xl" /></div>
          <div className="lg:w-1/2 flex flex-col gap-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold font-display mb-4">Товар не найден</h1>
        <p className="text-gray-500 mb-8">Возможно, ссылка устарела или товар был удален.</p>
        <Link to="/catalog" className="text-primary hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'Описание' },
    { id: 'specs', label: 'Характеристики' },
    { id: 'sellers', label: `Продавцы (${offers.length})` },
    { id: 'reviews', label: `Отзывы (${product.reviewCount})` },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6 flex flex-wrap gap-2">
        <Link to="/" className="hover:text-primary">Главная</Link>
        <span>&gt;</span>
        <Link to={`/catalog?category=${product.category}`} className="hover:text-primary">Каталог</Link>
        <span>&gt;</span>
        <Link to={`/catalog?brand=${product.brand}`} className="hover:text-primary capitalize">{product.brand}</Link>
        <span>&gt;</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12">
        <div className="lg:w-1/2">
          <ProductGallery images={product.images} productName={product.name} />
        </div>
        <div className="lg:w-1/2">
          <ProductHeader product={product} onTabChange={(tab) => setActiveTab(tab as any)} />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-14 md:top-16 z-40 bg-bg-page/90 backdrop-blur-md pt-4 mb-8">
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors relative ${
                activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'description' && <ProductDescription description={product.description} />}
        {activeTab === 'specs' && <ProductSpecs specs={product.specs} />}
        {activeTab === 'sellers' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <SellersBlock 
                offers={offers} 
                sellers={sellers} 
                onSellerHover={setHoveredSellerId}
                onSellerClick={setClickedSellerId}
              />
            </div>
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <h3 className="text-lg font-bold mb-4">Магазины на карте</h3>
                <MapComponent 
                  sellers={sellers.filter(s => offers.some(o => o.sellerId === s.id))} 
                  selectedSellerId={hoveredSellerId || clickedSellerId}
                  className="h-[400px] lg:h-[600px] w-full rounded-xl z-0 border border-gray-200"
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'reviews' && <ReviewsBlock reviews={reviews} rating={product.rating} reviewCount={product.reviewCount} />}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold font-display mb-6">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

