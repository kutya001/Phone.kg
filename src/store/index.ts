import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => set((state) => ({ items: [...new Set([...state.items, id])] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
      clear: () => set({ items: [] }),
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: 'phonecatalog-wishlist',
    }
  )
);

interface CompareState {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  hasItem: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => {
        const current = get().items;
        if (current.length < 3 && !current.includes(id)) {
          set({ items: [...current, id] });
        }
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
      clear: () => set({ items: [] }),
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: 'phonecatalog-compare',
    }
  )
);

interface RecentlyViewedState {
  items: string[];
  addItem: (id: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (id) => set((state) => {
        const newItems = [id, ...state.items.filter(i => i !== id)].slice(0, 10);
        return { items: newItems };
      }),
    }),
    {
      name: 'phonecatalog-recently-viewed',
    }
  )
);
