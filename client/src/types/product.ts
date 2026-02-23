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
  inStock?: boolean;
  isAvailable?: boolean;
  stock?: number; // legacy field for migration only
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
  id?: number | string;
  stk_code?: string;
  name: string;
  nameAr: string;
  basePrice: number;
  price: string | number;
  oldPrice?: string | number | null;
  image: string;
  category: string;
  categoryAr: string;
  cat_code?: string;
  cat_codes?: string[];
  brand: string;
  brand_code?: string;
  brand_codes?: string[];
  rating?: number;
  reviews?: number;
  badge?: string;
  isMostSold?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isAvailable?: boolean;
  description: string;
  descriptionAr: string;
  colorVariants?: ColorVariant[];
  chargeOptions?: ChargeOption[]; // New: For account products
  specs?: ProductSpec[];
  specifications?: {
    key: string;
    keyAr: string;
    value: string;
    valueAr: string;
  }[];
  offers?: ProductOffer[];
}

export type Language = 'ar' | 'en';

// Offer types for products
export interface DirectDiscountOffer {
  type: "direct_discount";
  discountType: "value" | "percentage";
  discountValue: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface CouponOffer {
  type: "coupon";
  couponValue: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  eligibleProductIds: number[];
  validityDays?: number;
}

export interface FreeProductOffer {
  type: "free_product";
  freeProductId: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface BundleDiscountOffer {
  type: "bundle_discount";
  discountPercentage: number;
  relatedProductIds: number[];
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export type ProductOffer =
  | DirectDiscountOffer
  | CouponOffer
  | FreeProductOffer
  | BundleDiscountOffer;
