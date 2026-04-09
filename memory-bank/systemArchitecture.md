# Системная архитектура

## Структура директорий
```text
/src
  /components   # Переиспользуемые UI-компоненты (Tailwind, shadcn/ui)
    /layout     # Header, Footer, Layout
    /ui         # Базовые компоненты (Button, Badge, Modal и т.д.)
    /home       # Компоненты главной страницы
    /product    # Компоненты карточки товара
    ...
  /data         # Статические JSON-файлы с моковыми данными
  /hooks        # Кастомные React-хуки (поиск, фильтрация)
  /pages        # Компоненты-страницы (Home, Catalog, Product, Compare, Wishlist)
  /store        # Zustand сторы (useWishlistStore, useCompareStore)
  /types        # Глобальные TypeScript интерфейсы
  /utils        # Вспомогательные функции (форматирование цен, дат)
```

## Стек
- React 19 + Vite
- React Router DOM (клиентский роутинг)
- Tailwind CSS (стилизация)
- Zustand (глобальное состояние)
- JSON (источник данных)
