import React from 'react';
import { Smartphone, Shield, Search, MessageCircle } from 'lucide-react';

export const About = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">О проекте PhoneCatalog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Мы создали единую платформу, где вы можете найти всю информацию о телефонах и сравнить цены от разных продавцов Кыргызстана.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-6">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Удобный поиск</h3>
          <p className="text-gray-600">
            Вам больше не нужно открывать десятки вкладок. Все характеристики, фото и отзывы собраны в одном месте с удобными фильтрами.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-success mb-6">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Честные отзывы</h3>
          <p className="text-gray-600">
            Мы собираем отзывы реальных пользователей, чтобы вы могли узнать о плюсах и минусах устройства до покупки.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-secondary mb-6">
            <Smartphone className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Сравнение цен</h3>
          <p className="text-gray-600">
            Сравнивайте предложения от магазинов и частных лиц. Выбирайте новые устройства с гарантией или б/у варианты по выгодной цене.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Прямая связь</h3>
          <p className="text-gray-600">
            Мы не берем комиссию. Вы связываетесь с продавцом напрямую через WhatsApp, Telegram или по телефону.
          </p>
        </div>
      </div>

      <div id="faq" className="mb-16">
        <h2 className="text-3xl font-bold font-display mb-8 text-center">Частые вопросы</h2>
        <div className="space-y-4">
          {[
            {
              q: "Как купить товар на сайте?",
              a: "PhoneCatalog — это информационная площадка. Мы не продаем товары. Чтобы купить устройство, выберите подходящее предложение на странице товара и свяжитесь с продавцом напрямую по указанным контактам."
            },
            {
              q: "Проверяете ли вы продавцов?",
              a: "Продавцы со значком «Верифицирован» предоставили нам свои данные (паспорт или документы ИП/ОсОО). Однако мы рекомендуем всегда быть осторожными, не переводить деньги заранее и проверять товар при встрече."
            },
            {
              q: "Как добавить свое объявление?",
              a: "В данный момент добавление объявлений происходит через нашего Telegram-бота. Свяжитесь с поддержкой для получения инструкций."
            },
            {
              q: "Почему цены у продавцов разные?",
              a: "Каждый продавец устанавливает цену самостоятельно. Цена может зависеть от состояния устройства (для б/у), наличия гарантии, комплектации и наценки магазина."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="contacts" className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold font-display mb-4">Остались вопросы?</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Напишите нам в Telegram, и мы с радостью поможем вам разобраться или примем ваши предложения по улучшению сервиса.
        </p>
        <a 
          href="#" 
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          Написать в поддержку
        </a>
      </div>
    </div>
  );
};

