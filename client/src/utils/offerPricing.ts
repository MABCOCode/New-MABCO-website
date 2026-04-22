import {
  BundleDiscountOffer,
  CouponOffer,
  DirectDiscountOffer,
  FreeProductOffer,
  LegacyOffer,
  ProductOffer,
} from "../types/product";
import { CURRENCY_LABEL } from "./currency";

export const parsePriceValue = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
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

export const resolveOfferDiscountType = (offer: any): "percentage" | "value" => {
  if (offer?.discountType === "percentage" || offer?.discountType === "value") {
    return offer.discountType;
  }
  const raw = String(offer?.discount_type || "").toLowerCase();
  return raw === "p" || raw === "percentage" ? "percentage" : "value";
};

export const resolveOfferDiscountValue = (offer: any): number => {
  const rawValue =
    offer?.discountValue ??
    offer?.discount ??
    offer?.couponValue ??
    offer?.coupon_value ??
    offer?.discountPercentage ??
    offer?.value ??
    0;
  const parsed = Number(rawValue) || 0;
  if (resolveOfferDiscountType(offer) === "percentage" && parsed > 0 && parsed <= 1) {
    return parsed * 100;
  }
  return parsed;
};

export const formatOfferDiscountLabel = (
  offer: any,
  language: "ar" | "en",
  currencyLabel = CURRENCY_LABEL,
  suffix?: string,
): string => {
  const value = resolveOfferDiscountValue(offer);
  const base =
    resolveOfferDiscountType(offer) === "percentage"
      ? `${value}%`
      : `${value.toLocaleString("en-US")} ${currencyLabel}`;
  return suffix ? `${base} ${suffix}` : base;
};

export const applyOfferDiscount = (basePrice: number, offer: any): number => {
  const safeBasePrice = Number.isFinite(basePrice) ? basePrice : 0;
  if (!offer) return safeBasePrice;
  if (offer.type === "free_product") return 0;
  const value = resolveOfferDiscountValue(offer);
  if (resolveOfferDiscountType(offer) === "percentage") {
    return Math.max(0, safeBasePrice * (1 - value / 100));
  }
  return Math.max(0, safeBasePrice - value);
};

export const getOfferSavings = (basePrice: number, offer: any): number =>
  Math.max(0, basePrice - applyOfferDiscount(basePrice, offer));

const normalizeLegacyOffer = (offer: LegacyOffer): ProductOffer | null => {
  const start = toDate((offer as any).start);
  const end = toDate((offer as any).end);
  const now = new Date();
  if (!offer.is_active) return null;
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
    };
  }

  if (offer.offer_type === "coupon") {
    const discountType = offer.discount_type === "p" ? "percentage" : "value";
    const discountValue = resolveOfferDiscountValue(offer);
    return {
      type: "coupon",
      couponValue: discountValue,
      discountType,
      discountValue,
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
      eligibleProductIds: (offer.products || [])
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id)),
      validityDays: undefined,
    };
  }

  if (offer.offer_type === "free_product") {
    const freeId = Array.isArray(offer.products)
      ? Number(offer.products[0])
      : Number(offer.products);
    return {
      type: "free_product",
      freeProductId: Number.isFinite(freeId) ? freeId : 0,
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
    };
  }

  if (offer.offer_type === "bundle_discount") {
    const discountType = offer.discount_type === "p" ? "percentage" : "value";
    const discountValue = resolveOfferDiscountValue(offer);
    return {
      type: "bundle_discount",
      discountType,
      discountValue,
      discountPercentage: discountType === "percentage" ? discountValue : undefined,
      relatedProductIds: [],
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
    };
  }

  return null;
};

export const normalizeOffers = (offers: unknown[]): ProductOffer[] => {
  if (!Array.isArray(offers)) return [];
  return offers
    .map((offer) => (isLegacyOffer(offer) ? normalizeLegacyOffer(offer) : offer))
    .filter(Boolean) as ProductOffer[];
};

export const calculateDiscountedPrice = (basePrice: number, offers: ProductOffer[]): number => {
  let finalPrice = basePrice;
  const directDiscount = offers.find((o) => o.type === "direct_discount") as DirectDiscountOffer | undefined;
  if (directDiscount) {
    if (directDiscount.discountType === "percentage") {
      finalPrice = basePrice * (1 - directDiscount.discountValue / 100);
    } else {
      finalPrice = basePrice - directDiscount.discountValue;
    }
  }
  return Math.max(0, finalPrice);
};

export const getOfferPricingFromOffers = (
  offers: ProductOffer[],
  options?: { sourcePrice?: number | string },
) => {
  const sourcePrice =
    typeof options?.sourcePrice === "number" || typeof options?.sourcePrice === "string"
      ? parsePriceValue(options.sourcePrice)
      : 0;

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
  const freeProduct = offers.find((o) => o.type === "free_product") as FreeProductOffer | undefined;
  const coupon = offers.find((o) => o.type === "coupon") as CouponOffer | undefined;
  const bundle = offers.find((o) => o.type === "bundle_discount") as BundleDiscountOffer | undefined;
  if (directDiscount) {
    if (directDiscount.discountType === "percentage") {
      return `${directDiscount.discountValue}% ${language === "ar" ? "حسم" : "OFF"}`;
    }
    return `${directDiscount.discountValue} ${CURRENCY_LABEL} ${language === "ar" ? "حسم" : "OFF"}`;
  }
  if (freeProduct) return language === "ar" ? "هدية مجانية" : "FREE GIFT";
  if (coupon) {
    return `${coupon.couponValue} ${CURRENCY_LABEL} ${language === "ar" ? "كوبون" : "COUPON"}`;
  }
  if (bundle) {
    if ("discountPercentage" in bundle && typeof bundle.discountPercentage === "number") {
      return `${bundle.discountPercentage}% ${language === "ar" ?  "حسم على المنتجات المرتبطة" : "Discount on related products"}`;
    }
    return language === "ar" ? "حسم على المنتجات المرتبطة" : "Discount on related products";
  }
  return "";
};
