export interface ProductSpec {
  icon: string;
  title: string;
  value: string;
}
// Enhanced Product Data with Color Variants and Charge Options

export interface ColorVariant {
  name: string;
  nameAr: string;
  hexCode: string;
  image: string;
  images?: string[];
  stock: number;
  sku: string;
}

// New: Charge Options for Account Products
export interface ChargeOption {
  id: string;
  value: string;
  valueAr: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  nameAr: string;
  basePrice: number;
  price: string;
  oldPrice?: string;
  image: string;
  category: string;
  categoryAr: string;
  brand: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  isNew?: boolean;
  isHot?: boolean;
  description: string;
  descriptionAr: string;
  colorVariants?: ColorVariant[];
  chargeOptions?: ChargeOption[]; // New: For account products
  specifications?: {
    key: string;
    keyAr: string;
    value: string;
    valueAr: string;
  }[];
}

export type Language = 'ar' | 'en';
