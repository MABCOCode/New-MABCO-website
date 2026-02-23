// src/features/compare/state.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompareState } from './types';

interface CompareStore extends CompareState {
  toggleCompare: (productId: string | number) => void;
  removeItem: (productId: string | number) => void;
  addItem: (productId: string | number) => void;
  openCompare: () => void;
  closeCompare: () => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedBrand: (brand: string | null) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false, // This controls the dialog visibility
      selectedCategory: null,
      selectedBrand: null,

      toggleCompare: (productId) =>
        set((state) => {
          const key = String(productId);
          return {
            items: state.items.includes(key)
              ? state.items.filter((id) => id !== key)
              : [...state.items, key],
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          const key = String(productId);
          return {
            items: state.items.filter((id) => id !== key),
          };
        }),

      addItem: (productId) =>
        set((state) => {
          const key = String(productId);
          if (state.items.includes(key)) return state;
          return {
            items: [...state.items, key],
          };
        }),

      openCompare: () => set({ isOpen: true }),
      
      closeCompare: () => set({ isOpen: false }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSelectedBrand: (brand) => set({ selectedBrand: brand }),

      clearCompare: () => set({ items: [] }),
    }),
    {
      name: 'compare-storage',
      merge: (persistedState: any, currentState) => {
        const persistedItems = Array.isArray(persistedState?.items)
          ? persistedState.items.map((item: any) => String(item))
          : [];
        return {
          ...currentState,
          ...persistedState,
          items: persistedItems,
        };
      },
    }
  )
);
