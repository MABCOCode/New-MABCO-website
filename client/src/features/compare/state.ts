// src/features/compare/state.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompareState } from './types';

interface CompareStore extends CompareState {
  toggleCompare: (productId: number) => void;
  removeItem: (productId: number) => void;
  addItem: (productId: number) => void;
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
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),

      addItem: (productId) =>
        set((state) => ({
          items: [...state.items, productId],
        })),

      openCompare: () => set({ isOpen: true }),
      
      closeCompare: () => set({ isOpen: false }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSelectedBrand: (brand) => set({ selectedBrand: brand }),

      clearCompare: () => set({ items: [] }),
    }),
    {
      name: 'compare-storage',
    }
  )
);