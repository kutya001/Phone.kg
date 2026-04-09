import React, { useState } from 'react';
import { SellerOffer, Seller } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Phone, MessageCircle, Send, Store, User, CheckCircle2, AlertTriangle, ChevronRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SellersBlockProps {
  offers: SellerOffer[];
  sellers: Seller[];
  onSellerHover?: (sellerId: string | null) => void;
  onSellerClick?: (sellerId: string) => void;
}

export const SellersBlock: React.FC<SellersBlockProps> = ({ offers, sellers, onSellerHover, onSellerClick }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'used'>('new');
  const [sort, setSort] = useState<'price' | 'rating' | 'date'>('price');
  const [showWarning, setShowWarning] = useState(false);

  const newOffers = offers.filter(o => o.condition === 'new');
  const usedOffers = offers.filter(o => o.condition === 'used');

  const currentOffers = activeTab === 'new' ? newOffers : usedOffers;

  const sortedOffers = [...currentOffers].sort((a, b) => {
    if (sort === 'price') return a.price - b.price;
    if (sort === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    
    // Sort by rating
    const sellerA = sellers.find(s => s.id === a.sellerId);
    const sellerB = sellers.find(s => s.id === b.sellerId);
    return (sellerB?.rating || 0) - (sellerA?.rating || 0);
  });

  const handleContactClick = (e: React.MouseEvent) => {
    if (!showWarning) {
      e.preventDefault();
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold font-display">Предложения продавцов</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('new')}
          className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'new' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${activeTab === 'new' ? 'bg-success' : 'bg-gray-300'}`}></div>
            Новые ({newOffers.length})
          </div>
          {activeTab === 'new' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('used')}
          className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'used' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${activeTab === 'used' ? 'bg-warning' : 'bg-gray-300'}`}></div>
            Б/У ({usedOffers.length})
          </div>
          {activeTab === 'used' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Toolbar */}
      {currentOffers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Сортировать:
          </div>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="price">По цене</option>
            <option value="rating">По рейтингу</option>
            <option value="date">По дате</option>
          </select>
        </div>
      )}

      {/* Warning Toast */}
      {showWarning && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-orange-800 text-sm mb-1">Осторожно, мошенники!</h4>
            <p className="text-orange-700 text-xs leading-relaxed">
              Никогда не переводите деньги вперёд незнакомым людям. Договаривайтесь о встрече в публичных местах.
            </p>
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="flex flex-col gap-4">
        {currentOffers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-gray-400 mb-4">
              <Store className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет предложений</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              В данный момент нет продавцов, предлагающих этот товар в таком состоянии.
            </p>
          </div>
        ) : (
          sortedOffers.map(offer => {
            const seller = sellers.find(s => s.id === offer.sellerId);
            if (!seller) return null;

            return (
              <div 
                key={offer.id} 
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 cursor-pointer"
                onMouseEnter={() => onSellerHover?.(seller.id)}
                onMouseLeave={() => onSellerHover?.(null)}
                onClick={() => onSellerClick?.(seller.id)}
              >
                {/* Seller Info */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl font-bold text-gray-400">
                      {seller.avatar ? <img src={seller.avatar} alt={seller.name} className="w-full h-full rounded-full object-cover" /> : seller.name.charAt(0)}
                    </div>
                    <div>
                      <Link to={`/seller/${seller.slug}`} className="font-bold text-lg text-gray-900 hover:text-primary transition-colors flex items-center gap-2">
                        {seller.name}
                        {seller.verified && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        {seller.type === 'shop' ? <Store className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        <span>{seller.type === 'shop' ? 'Магазин' : 'Частное лицо'}</span>
                        <span>·</span>
                        <span className="flex items-center text-yellow-500 font-medium">★ {seller.rating}</span>
                        <span>({seller.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 flex flex-col gap-1 mt-2">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">📍</span>
                      <span>{seller.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">🕐</span>
                      <span>Обновлено: {new Date(offer.updatedAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>

                {/* Offer Info */}
                <div className="flex-1 flex flex-col md:items-end gap-4 md:border-l border-gray-100 md:pl-6">
                  <div className="flex flex-col md:items-end w-full">
                    <div className="font-mono font-bold text-2xl text-gray-900 mb-2">
                      {new Intl.NumberFormat('ru-RU').format(offer.price)} {offer.currency === 'KGS' ? 'сом' : '$'}
                    </div>
                    
                    {offer.condition === 'used' && offer.usedCondition && (
                      <div className="w-full md:w-auto bg-yellow-50 rounded-lg p-3 mb-3 text-sm">
                        <div className="font-medium text-yellow-800 mb-1 flex items-center gap-2">
                          Состояние: 
                          {offer.usedCondition === 'excellent' && 'Отличное'}
                          {offer.usedCondition === 'good' && 'Хорошее'}
                          {offer.usedCondition === 'fair' && 'Удовлетворительное'}
                        </div>
                        <p className="text-yellow-700 text-xs">{offer.usedDescription}</p>
                      </div>
                    )}

                    <div className="flex flex-col gap-1 text-sm text-gray-600 w-full md:items-end">
                      {offer.warranty && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span>Гарантия: {offer.warranty}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${offer.inStock ? 'bg-success' : 'bg-red-500'}`}></div>
                        <span>{offer.inStock ? 'В наличии' : 'Нет в наличии'} {offer.quantity ? `(${offer.quantity} шт.)` : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap md:justify-end gap-2 w-full mt-auto pt-4">
                    {seller.contacts.phone && (
                      <a 
                        href={`tel:${seller.contacts.phone}`} 
                        onClick={handleContactClick}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="hidden sm:inline">Позвонить</span>
                      </a>
                    )}
                    {seller.contacts.whatsapp && (
                      <a 
                        href={`https://wa.me/${seller.contacts.whatsapp}`} 
                        target="_blank" rel="noopener noreferrer"
                        onClick={handleContactClick}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}
                    {seller.contacts.telegram && (
                      <a 
                        href={`https://t.me/${seller.contacts.telegram}`} 
                        target="_blank" rel="noopener noreferrer"
                        onClick={handleContactClick}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
                      >
                        <Send className="h-4 w-4" />
                        <span className="hidden sm:inline">Telegram</span>
                      </a>
                    )}
                    <Link 
                      to={`/seller/${seller.slug}`}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
                      title="Подробнее о продавце"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
