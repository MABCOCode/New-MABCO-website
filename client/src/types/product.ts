export interface ProductSpec {
  icon: string;
  title: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating?: number;
  badge?: string;
  brand?: string;
  category?: string;
  specs?: ProductSpec[];
  isNew?: boolean;
  isHot?: boolean;
}

export type Language = 'ar' | 'en';
