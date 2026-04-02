import { DirectDiscountOffer, Product, ProductOffer } from "../types/product";
import { CURRENCY_LABEL } from "../utils/currency";

export interface ProductWithOffers extends Product { offers?: ProductOffer[]; }
export interface ProductOfferEntry { productId: number | string; offers: ProductOffer[]; }

export const offersDatabase: ProductOfferEntry[] = [];

const rawProducts: ProductWithOffers[] = [];

export const productsBySection = {};

const isVariantAvailable = (variant: any): boolean => {
  if (!variant) return false;
  if (typeof variant.isAvailable === "boolean") return variant.isAvailable;
  if (typeof variant.inStock === "boolean") return variant.inStock;
  if (typeof variant.stock === "number") return variant.stock > 0;
  return true;
};

const toNumericProductId = (product: any, index: number): number => {
  if (typeof product?.id === "number" && Number.isFinite(product.id)) {
    return product.id;
  }

  const candidates = [product?.id, product?.stk_code];
  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) continue;
    const parsed = Number(String(candidate).replace(/[^\d]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return 900000 + index;
};

const normalizeProductAvailability = (product: ProductWithOffers, index: number): ProductWithOffers | null => {
  const normalizedVariants = (product.colorVariants || [])
    .map((variant: any) => ({
      ...variant,
      isAvailable: isVariantAvailable(variant),
      inStock: isVariantAvailable(variant),
    }))
    .filter((variant: any) => variant.isAvailable);

  const hasColorVariants = (product.colorVariants || []).length > 0;
  const availabilityFlag =
    typeof (product as any)?.availability?.isAvailable === "boolean"
      ? Boolean((product as any).availability.isAvailable)
      : undefined;
  const isProductAvailable =
    typeof availabilityFlag === "boolean"
      ? availabilityFlag
      : typeof product.isAvailable === "boolean"
      ? product.isAvailable
      : hasColorVariants
      ? normalizedVariants.length > 0
      : true;

  if (!isProductAvailable) {
    return null;
  }

  return {
    ...product,
    id: toNumericProductId(product, index),
    stk_code: String((product as any).stk_code || toNumericProductId(product, index)),
    isAvailable: true,
    colorVariants: hasColorVariants ? normalizedVariants : product.colorVariants,
  };
};

export const products: ProductWithOffers[] = rawProducts
  .map((product, index) => normalizeProductAvailability(product, index))
  .filter((product): product is ProductWithOffers => Boolean(product));

export const getProductById = (id: number | string) =>
  products.find(
    (p: any) =>
      String(p.stk_code) === String(id) ||
      String(p.id) === String(id),
  );

const toKey = (value: unknown): string => String(value ?? "").trim();

const parsePriceValue = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const parseOfferNumber = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const getOfferLookupKeys = (productOrId: number | string | ProductWithOffers): string[] => {
  if (typeof productOrId === "number" || typeof productOrId === "string") {
    const key = toKey(productOrId);
    return key ? [key] : [];
  }

  const keys = [
    toKey((productOrId as any)?.stk_code),
    toKey((productOrId as any)?.id),
  ].filter(Boolean);

  return Array.from(new Set(keys));
};

const toDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && value.$date) {
    const d = new Date(value.$date);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const isLegacyOffer = (offer: any): offer is LegacyOffer => {
  return offer && typeof offer === "object" && "offer_type" in offer;
};

const normalizeLegacyOffer = (offer: LegacyOffer): ProductOffer | null => {
  const start = toDate((offer as any).start);
  const end = toDate((offer as any).end);
  const now = new Date();
  const rawActive = (offer as any).is_active;
  const isActive =
    typeof rawActive === "boolean"
      ? rawActive
      : rawActive === null || rawActive === undefined
      ? true
      : Boolean(rawActive);
  if (!isActive) return null;
  if (start && now < start) return null;
  if (end && now > end) return null;

  const titleEn = offer.title || "";
  const titleAr = offer.title_ar || offer.title || "";
  const descriptionEn = offer.description || "";
  const descriptionAr = offer.description_ar || offer.description || "";

  if (offer.offer_type === "direct_discount") {
    const isPercent = offer.discount_type === "p";
    const rawDiscount = Number(offer.discount ?? 0);
    const discountValue =
      isPercent && rawDiscount > 0 && rawDiscount <= 1 ? rawDiscount * 100 : rawDiscount;
    return {
      type: "direct_discount",
      discountType: isPercent ? "percentage" : "value",
      discountValue,
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
      offerNo: offer.offer_no,
      products: Array.isArray(offer.products) ? offer.products.map(String) : [],
    };
  }

  if (offer.offer_type === "coupon") {
    return {
      type: "coupon",
      couponValue: Number(offer.discount ?? 0),
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
      eligibleProductIds: [],
      offerNo: offer.offer_no,
      products: Array.isArray(offer.products) ? offer.products.map(String) : [],
    };
  }

  if (offer.offer_type === "free_product") {
    return {
      type: "free_product",
      freeProductId: 0,
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
      offerNo: offer.offer_no,
      products: Array.isArray(offer.products) ? offer.products.map(String) : [],
    };
  }

  if (offer.offer_type === "bundle_discount") {
    return {
      type: "bundle_discount",
      discountPercentage: Number(offer.discount ?? 0),
      relatedProductIds: [],
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
      offerNo: offer.offer_no,
      products: Array.isArray(offer.products) ? offer.products.map(String) : [],
    };
  }

  return null;
};

export const getProductOffers = (
  productOrId: number | string | ProductWithOffers,
): ProductOffer[] => {
  const keys = getOfferLookupKeys(productOrId);
  const fromDb = offersDatabase.find((entry) =>
    keys.includes(toKey(entry.productId)),
  )?.offers;

  if (fromDb?.length) return fromDb;
  if (typeof productOrId === "object" && Array.isArray(productOrId.offers)) {
    const offers = productOrId.offers as any[];
    const normalized = offers
      .map((offer) => (isLegacyOffer(offer) ? normalizeLegacyOffer(offer) : offer))
      .filter(Boolean) as ProductOffer[];
    return normalized;
  }
  return [];
};

export const hasOffers = (productOrId: number | string | ProductWithOffers): boolean => {
  return getProductOffers(productOrId).length > 0;
};

export const getOfferPricing = (
  product: ProductWithOffers,
  options?: { sourcePrice?: number },
) => {
  const offers = getProductOffers(product);
  const sourcePrice =
    typeof options?.sourcePrice === "number"
      ? options.sourcePrice
      : parsePriceValue(product.price);

  const currentPrice = calculateDiscountedPrice(sourcePrice, offers);
  const hasDiscount = currentPrice < sourcePrice;
  const savings = Math.max(0, sourcePrice - currentPrice);
  const discountPercentage =
    hasDiscount && sourcePrice > 0
      ? Math.round((savings / sourcePrice) * 100)
      : 0;

  return {
    offers,
    originalPrice: sourcePrice,
    currentPrice,
    savings,
    hasDiscount,
    discountPercentage,
  };
};

export const getOfferBadgeText = (offers: ProductOffer[], language: "ar" | "en"): string => {
  if (offers.length === 0) return "";
  const directDiscount = offers.find((o) => o.type === "direct_discount") as DirectDiscountOffer | undefined;
  const freeProduct = offers.find((o) => o.type === "free_product");
  const coupon = offers.find((o) => o.type === "coupon");
  const bundle = offers.find((o) => o.type === "bundle_discount");
  if (directDiscount) {
    const rawType = (directDiscount as any).discountType || (directDiscount as any).discount_type;
    const isPercent = rawType === "percentage" || rawType === "p";
    const value =
      (directDiscount as any).discountValue ??
      (directDiscount as any).discount ??
      (directDiscount as any).value ??
      0;
    const numValue = parseOfferNumber(value);
    if (isPercent) {
      return `${numValue}% ${language === "ar" ? "خصم" : "OFF"}`;
    }
    return `${numValue} ${CURRENCY_LABEL} ${language === "ar" ? "خصم" : "OFF"}`;
  }
  if (freeProduct) return language === "ar" ? "هدية مجانية" : "FREE GIFT";
  if (coupon) {
    const value =
      (coupon as any).couponValue ??
      (coupon as any).coupon_value ??
      (coupon as any).discount ??
      (coupon as any).value ??
      0;
    const numValue = parseOfferNumber(value);
    if (numValue <= 0) {
      return language === "ar" ? "كوبون" : "COUPON";
    }
    return `${numValue} ${CURRENCY_LABEL} ${language === "ar" ? "كوبون" : "COUPON"}`;
  }
  if (bundle) {
    if ("discountPercentage" in bundle && typeof bundle.discountPercentage === "number") {
      return `${bundle.discountPercentage}% ${language === "ar" ? "خصم" : "OFF"}`;
    }
    return language === "ar" ? "عرض حزمة" : "BUNDLE";
  }
  return "";
};

export const calculateDiscountedPrice = (basePrice: number, offers: ProductOffer[]): number => {
  let finalPrice = basePrice;
  const directDiscount = offers.find((o) => o.type === "direct_discount") as DirectDiscountOffer | undefined;
  if (directDiscount) {
    const rawType = (directDiscount as any).discountType || (directDiscount as any).discount_type;
    const isPercent = rawType === "percentage" || rawType === "p";
    const value =
      (directDiscount as any).discountValue ??
      (directDiscount as any).discount ??
      (directDiscount as any).value ??
      0;
    const numValue = parseOfferNumber(value);
    if (isPercent) {
      finalPrice = basePrice * (1 - numValue / 100);
    } else {
      finalPrice = basePrice - numValue;
    }
  }
  return Math.max(0, finalPrice);
};

export const getTotalSavings = (basePrice: number, offers: ProductOffer[]) => basePrice - calculateDiscountedPrice(basePrice, offers);
