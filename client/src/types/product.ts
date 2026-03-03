export interface ProductSpec {
  icon: string;
  title: string;
  value: string;
  titleAr?: string;
  valueAr?: string;
  isKeyFeature?: boolean;
}
// Enhanced Product Data with Color Variants and Charge Options

export interface ColorVariant {
  stk_code?: string;
  price?: number;
  offers?: LegacyOffer[];
  color_name?: string;
  color_name_ar?: string;
  color_hex?: string;
  in_stock?: boolean;
  active?: boolean;
  name?: string; // legacy
  nameAr?: string; // legacy
  hexCode?: string; // legacy
  image?: string; // legacy
  images?: string[];
  inStock?: boolean; // legacy
  isAvailable?: boolean; // legacy
  stock?: number; // legacy field for migration only
}

// New: Charge Options for Account Products
export interface ChargeOption {
  stk_code?: string;
  price?: number;
  offers?: LegacyOffer[];
  name?: string;
  name_ar?: string;
  in_stock?: boolean;
  active?: boolean;
  id?: string; // legacy
  value?: string; // legacy
  valueAr?: string; // legacy
}

export interface Product {
  id?: number | string;
  stk_code?: string;
  name: string;
  nameAr: string;
  price: string | number;
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

export interface LegacyOffer {
  offer_no: string;
  offer_type: "direct_discount" | "coupon" | "free_product" | "bundle_discount";
  mainproductstk_code?: string;
  discount: number;
  discount_type: "p" | "v";
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  products: string[];
  window: {
    start: string;
    end: string;
  };
  is_active: boolean;
}
