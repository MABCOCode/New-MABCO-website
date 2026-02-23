import { ProductSpec, Product } from './product';

export interface CompareProduct extends Product {
  rating: number;
  specs?: ProductSpec[];
}

export interface ComparePageProps {
  compareItems: string[];
  allProducts: CompareProduct[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (id: string) => void;
  language: 'ar' | 'en';
}

export interface CompareState {
  items: string[];
  isOpen: boolean;
  selectedCategory: string | null;
  selectedBrand: string | null;
}
