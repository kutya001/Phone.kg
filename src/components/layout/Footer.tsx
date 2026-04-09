import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Instagram, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-white">
                PhoneCatalog
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Лучший агрегатор цен на телефоны в Кыргызстане. Мы не продаём товары — мы помогаем найти лучшую цену.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Каталог</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog?category=smartphones" className="hover:text-white transition-colors">Смартфоны</Link></li>
              <li><Link to="/catalog?category=accessories" className="hover:text-white transition-colors">Аксессуары</Link></li>
              <li><Link to="/catalog?category=cases" className="hover:text-white transition-colors">Чехлы</Link></li>
              <li><Link to="/catalog?category=chargers" className="hover:text-white transition-colors">Зарядки</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Популярные</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/product/apple-iphone-17-pro-256gb" className="hover:text-white transition-colors">iPhone 17 Pro</Link></li>
              <li><Link to="/product/samsung-galaxy-s25-ultra-256gb" className="hover:text-white transition-colors">Samsung S25 Ultra</Link></li>
              <li><Link to="/product/xiaomi-15-ultra-512gb" className="hover:text-white transition-colors">Xiaomi 15 Ultra</Link></li>
              <li><Link to="/product/apple-airpods-4" className="hover:text-white transition-colors">AirPods 4</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Информация</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">О проекте</Link></li>
              <li><Link to="/about#contacts" className="hover:text-white transition-colors">Контакты</Link></li>
              <li><Link to="/about#faq" className="hover:text-white transition-colors">Частые вопросы</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 PhoneCatalog. Информационный каталог.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Пользовательское соглашение</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
