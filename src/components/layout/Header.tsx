import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Scale, Menu, X, Smartphone } from 'lucide-react';
import { useWishlistStore, useCompareStore } from '@/store';
import { cn } from '@/utils';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const wishlistCount = useWishlistStore(state => state.items.length);
  const compareCount = useCompareStore(state => state.items.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Smartphone className="h-5 w-5" />
          </div>
          <span className="hidden md:block text-xl font-bold font-display tracking-tight text-gray-900">
            PhoneCatalog
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link to="/catalog" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Каталог
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            О проекте
          </Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          <form onSubmit={handleSearch} className="relative w-full max-w-lg">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Найдите iPhone, Samsung, AirPods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/compare" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
            <Scale className="h-6 w-6" />
            {compareCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </Link>
          <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
            <Heart className="h-6 w-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-bold font-display">Меню</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </form>

              <nav className="flex flex-col gap-4">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900">Главная</Link>
                <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900">Каталог</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900">О проекте</Link>
                <Link to="/compare" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 flex justify-between">
                  Сравнение
                  {compareCount > 0 && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{compareCount}</span>}
                </Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 flex justify-between">
                  Избранное
                  {wishlistCount > 0 && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
