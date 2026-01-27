import { ProductSpec, Product } from './product';

export interface CompareProduct extends Product {
  rating: number;
  specs?: ProductSpec[];
}

export interface ComparePageProps {
  compareItems: number[];
  allProducts: CompareProduct[];
  onClose: () => void;
  onRemoveItem: (id: number) => void;
  onAddItem: (id: number) => void;
  language: 'ar' | 'en';
}

export interface CompareState {
  items: number[];
  isOpen: boolean;
  selectedCategory: string | null;
  selectedBrand: string | null;
}
