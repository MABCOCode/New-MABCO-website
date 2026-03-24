import { useState } from "react";
import {
  Tag,
  Gift,
  Ticket,
  Sparkles,
  TrendingDown,
  CheckCircle,
  Plus,
  ShoppingBag,
} from "lucide-react";
import translations from "../../../i18n/translations";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { getProductOffers, products } from "../../../data/products";
import type {
  ProductOffer,
  DirectDiscountOffer,
  CouponOffer,
  FreeProductOffer,
  BundleDiscountOffer,
} from "../../../types/product";

interface CartItem {
  id: number | string;
  productId?: number | string;
  name?: string;
  price?: string | number;
  basePrice?: number | null;
  quantity: number;
  appliedOffers?: ProductOffer[] | null;
  isCouponItem?: boolean;
  linkedToProductId?: number;
}

interface AppliedOffer {
  productId: number | string;
  productName: string;
  offerType: "direct_discount" | "coupon" | "free_product" | "bundle_discount";
  offer: ProductOffer;
  applied: boolean;
  autoApplied?: boolean;
  savings?: number;
  couponValue?: number;
  freeProductId?: number;
  bundleProductIds?: number[];
}

interface AppliedOffersSectionProps {
  cartItems: CartItem[];
  language: "ar" | "en";
  currencyLabel?: string;
  onApplyOffer?: (productId: number | string, offer: ProductOffer) => void;
  onClearOffer?: (productId: number | string) => void;
  onApplyCoupon?: (productId: number | string, coupon: CouponOffer) => void;
  onApplyCouponToProduct?: (productId: number | string, coupon: CouponOffer, eligibleProductId: number) => void;
  onAddFreeProduct?: (productId: number | string, freeProductId: number) => void;
  onAddBundleProduct?: (productId: number | string, bundleProductId: number) => void;
  appliedCoupons?: Map<number | string, CouponOffer>;
  freeProductsAdded?: Map<number | string, number>;
  bundleProductsAdded?: Map<number | string, number[]>;
  couponProductsAdded?: Map<number | string, number>;
}

export function AppliedOffersSection({
  cartItems,
  language,
  currencyLabel,
  onApplyOffer,
  onClearOffer,
  onApplyCoupon,
  onApplyCouponToProduct,
  onAddFreeProduct,
  onAddBundleProduct,
  appliedCoupons = new Map(),
  freeProductsAdded = new Map(),
  bundleProductsAdded = new Map(),
  couponProductsAdded = new Map(),
}: AppliedOffersSectionProps) {
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());
  const translation = translations[language];

  const displayCurrency = currencyLabel || CURRENCY_LABEL;

  const formatPrice = (price: number) => price.toLocaleString("en-US");

  const parsePrice = (price: string | number | undefined) => {
    if (typeof price === "number") return Number.isFinite(price) ? price : 0;
    if (!price || typeof price !== "string") return 0;
    return parseInt(price.replace(/,/g, ""), 10) || 0;
  };

  const isOfferApplied = (item: CartItem, offer: ProductOffer) => {
    const appliedRaw = Array.isArray(item.appliedOffers) ? item.appliedOffers : [];
    if (appliedRaw.length === 0) return false;
    const applied = getProductOffers({ offers: appliedRaw } as any);
    if (applied.length === 0) return false;
    return applied.some((a: any) => {
      if (!a || a.type !== offer.type) return false;
      if (offer.type === "direct_discount") {
        return (
          a.discountType === (offer as DirectDiscountOffer).discountType &&
          Number(a.discountValue ?? a.discount) ===
            Number((offer as DirectDiscountOffer).discountValue ?? (offer as any).discount)
        );
      }
      if (offer.type === "coupon") {
        return Number(a.couponValue ?? a.discount) ===
          Number((offer as CouponOffer).couponValue ?? (offer as any).discount);
      }
      if (offer.type === "free_product") {
        return Number(a.freeProductId ?? 0) === Number((offer as FreeProductOffer).freeProductId ?? 0);
      }
      if (offer.type === "bundle_discount") {
        return Number(a.discountPercentage) === Number((offer as BundleDiscountOffer).discountPercentage);
      }
      return false;
    });
  };

  const collectOffers = (): AppliedOffer[] => {
    const allOffers: AppliedOffer[] = [];

    cartItems.forEach((item) => {
      const productId = item.productId ?? item.id;
      if (!productId) return;
      const product = products.find((p) => String(p.id) === String(productId));

      const offers = item.appliedOffers?.length
        ? getProductOffers({ offers: item.appliedOffers } as any)
        : getProductOffers(productId);

      offers.forEach((offer) => {
        if (offer.type === "direct_discount") {
          const directOffer = offer as DirectDiscountOffer;
          const isApplied = isOfferApplied(item, offer);
          let savings = 0;
          const itemPrice =
            typeof item.basePrice === "number" ? item.basePrice : parsePrice(item.price);

          if (directOffer.discountType === "percentage") {
            savings = (itemPrice * directOffer.discountValue) / 100 * item.quantity;
          } else {
            savings = directOffer.discountValue * item.quantity;
          }

          allOffers.push({
            productId,
            productName: product
              ? (language === "ar" ? product.nameAr : product.name)
              : item.name || String(productId),
            offerType: "direct_discount",
            offer,
            applied: isApplied,
            autoApplied: false,
            savings,
          });
        }

        if (offer.type === "coupon") {
          const couponOffer = offer as CouponOffer;
          const isApplied = isOfferApplied(item, offer) || appliedCoupons.has(productId);

          allOffers.push({
            productId,
            productName: product
              ? (language === "ar" ? product.nameAr : product.name)
              : item.name || String(productId),
            offerType: "coupon",
            offer,
            applied: isApplied,
            autoApplied: false,
            couponValue: couponOffer.couponValue * item.quantity,
          });
        }

        if (offer.type === "free_product") {
          const freeOffer = offer as FreeProductOffer;
          const isAdded = isOfferApplied(item, offer) || freeProductsAdded.has(productId);

          allOffers.push({
            productId,
            productName: product
              ? (language === "ar" ? product.nameAr : product.name)
              : item.name || String(productId),
            offerType: "free_product",
            offer,
            applied: isAdded,
            autoApplied: false,
            freeProductId: freeOffer.freeProductId,
          });
        }

        if (offer.type === "bundle_discount") {
          const bundleOffer = offer as BundleDiscountOffer;
          const addedBundleItems = bundleProductsAdded.get(productId) || [];
          const isApplied = isOfferApplied(item, offer) || addedBundleItems.length > 0;

          allOffers.push({
            productId,
            productName: product
              ? (language === "ar" ? product.nameAr : product.name)
              : item.name || String(productId),
            offerType: "bundle_discount",
            offer,
            applied: isApplied,
            autoApplied: false,
            bundleProductIds: addedBundleItems,
          });
        }
      });
    });

    return allOffers;
  };

  const allOffers = collectOffers();
  if (allOffers.length === 0) return null;

  const appliedOffers = allOffers.filter((o) => o.applied);
  const availableOffers = allOffers.filter((o) => !o.applied);

  const totalSavings = appliedOffers.reduce((sum, offer) => {
    if (offer.offerType === "direct_discount" && offer.savings) {
      return sum + offer.savings;
    }
    if (offer.offerType === "free_product" && offer.freeProductId) {
      const freeProduct = products.find((p) => p.id === offer.freeProductId);
      return sum + parsePrice(freeProduct?.price as any);
    }
    return sum;
  }, 0);

  const toggleExpanded = (offerId: string) => {
    const newExpanded = new Set(expandedOffers);
    if (newExpanded.has(offerId)) {
      newExpanded.delete(offerId);
    } else {
      newExpanded.add(offerId);
    }
    setExpandedOffers(newExpanded);
  };

  const renderDirectDiscount = (appliedOffer: AppliedOffer) => {
    const offer = appliedOffer.offer as DirectDiscountOffer;

    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">
                  {language === "ar" ? offer.titleAr : offer.titleEn}
                </h4>
                <p className="text-xs text-gray-600 mb-1">{appliedOffer.productName}</p>
              </div>
              {appliedOffer.applied ? (
                <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-green-700">
                    {translation.offers_applied}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => onApplyOffer?.(appliedOffer.productId, offer)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-transform"
                >
                  {translation.offers_apply}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-3">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{translation.offers_you_save}:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(appliedOffer.savings || 0)} {displayCurrency}
                </span>
              </div>
            </div>
            {appliedOffer.applied && (
              <button
                onClick={() => onClearOffer?.(appliedOffer.productId)}
                className="mt-3 text-xs text-gray-600 underline"
              >
                {language === "ar" ? "إزالة العرض" : "Remove offer"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCoupon = (appliedOffer: AppliedOffer) => {
    const offer = appliedOffer.offer as CouponOffer;
    const offerId = `coupon-${appliedOffer.productId}`;
    const isExpanded = expandedOffers.has(offerId);
    const appliedProductId = couponProductsAdded.get(appliedOffer.productId);

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">
                  {language === "ar" ? offer.titleAr : offer.titleEn}
                </h4>
                <p className="text-xs text-gray-600 mb-1">{appliedOffer.productName}</p>
              </div>
              {appliedOffer.applied ? (
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">{translation.offers_applied}</span>
                </div>
              ) : (
                <div className="text-xs font-semibold text-blue-700">
                  {translation.offers_choose_product || translation.offers_apply}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-3">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>

            <div className="bg-white rounded-lg p-3 border border-blue-200 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{translation.offers_coupon_value}:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(appliedOffer.couponValue || 0)} {displayCurrency}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleExpanded(offerId)}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
            >
              {isExpanded ? translation.offers_hide_details : translation.offers_view_details}
              <Sparkles className="w-3 h-3" />
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">{translation.offers_eligible_products}:</p>
                {offer.eligibleProductIds.slice(0, 3).map((eligibleId) => {
                  const product = products.find((p) => p.id === eligibleId);
                  if (!product) return null;
                  const productPrice = parsePrice(product.price as any);
                  const discountedPrice = Math.max(0, productPrice - offer.couponValue);
                  const isSelected = appliedProductId === eligibleId;
                  const disabled = !!appliedProductId && !isSelected;

                  return (
                    <div
                      key={eligibleId}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {language === "ar" ? product.nameAr : product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(productPrice)} {displayCurrency}
                        </p>
                        <p className="text-xs text-green-600">
                          {language === "ar"
                            ? `بعد الخصم: ${formatPrice(discountedPrice)} ${displayCurrency}`
                            : `After discount: ${formatPrice(discountedPrice)} ${displayCurrency}`}
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="flex-shrink-0 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                          {translation.offers_applied}
                        </div>
                      ) : (
                        <button
                          onClick={() => onApplyCouponToProduct?.(appliedOffer.productId, offer, eligibleId)}
                          disabled={disabled}
                          className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold ${
                            disabled
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-transform"
                          }`}
                        >
                          {translation.offers_apply}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFreeProduct = (appliedOffer: AppliedOffer) => {
    const offer = appliedOffer.offer as FreeProductOffer;
    const freeProduct = products.find((p) => p.id === offer.freeProductId);

    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-pulse">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">
                  {language === "ar" ? offer.titleAr : offer.titleEn}
                </h4>
                <p className="text-xs text-gray-600 mb-1">{appliedOffer.productName}</p>
              </div>
              {appliedOffer.applied ? (
                <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-green-700">
                    {translation.offers_item_added}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => onAddFreeProduct?.(appliedOffer.productId, offer.freeProductId)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  {translation.offers_add_free_item}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-3">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>

            {freeProduct && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-3">
                  <img
                    src={freeProduct.image}
                    alt={freeProduct.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {language === "ar" ? freeProduct.nameAr : freeProduct.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(parsePrice(freeProduct.price as any))} {displayCurrency}
                      </span>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {translation.offers_free}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBundleDiscount = (appliedOffer: AppliedOffer) => {
    const offer = appliedOffer.offer as BundleDiscountOffer;
    const offerId = `bundle-${appliedOffer.productId}`;
    const isExpanded = expandedOffers.has(offerId);
    const alreadySelected = (appliedOffer.bundleProductIds || []).length > 0;

    return (
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">
                  {language === "ar" ? offer.titleAr : offer.titleEn}
                </h4>
                <p className="text-xs text-gray-600 mb-1">{appliedOffer.productName}</p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                {offer.discountPercentage}% {translation.offers_off}
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>

            {appliedOffer.bundleProductIds && appliedOffer.bundleProductIds.length > 0 && (
              <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-2">
                <p className="text-xs text-green-700 font-semibold">
                  {translation.offers_applied}: {appliedOffer.bundleProductIds.length}{" "}
                  {language === "ar" ? "منتج" : "products"}
                </p>
              </div>
            )}

            <button
              onClick={() => toggleExpanded(offerId)}
              className="text-xs text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1"
            >
              {isExpanded ? translation.offers_hide_details : translation.offers_view_details}
              <ShoppingBag className="w-3 h-3" />
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">{translation.offers_bundle_products}:</p>
                {offer.relatedProductIds.slice(0, 4).map((relatedId) => {
                  const product = products.find((p) => p.id === relatedId);
                  if (!product) return null;

                  const productPrice = parsePrice(product.price as any);
                  const discountedPrice =
                    productPrice * (1 - offer.discountPercentage / 100);
                  const isAdded = appliedOffer.bundleProductIds?.includes(relatedId);
                  const disabled = alreadySelected && !isAdded;

                  return (
                    <div
                      key={relatedId}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {language === "ar" ? product.nameAr : product.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-600">
                            {formatPrice(discountedPrice)} {displayCurrency}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(productPrice)}
                          </span>
                        </div>
                      </div>
                      {isAdded ? (
                        <div className="flex-shrink-0 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                          {translation.offers_added}
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddBundleProduct?.(appliedOffer.productId, relatedId)}
                          disabled={disabled}
                          className={`flex-shrink-0 p-2 rounded-lg ${
                            disabled
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:scale-105 transition-transform"
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-6 h-6 text-[#009FE3]" />
          {translation.offers_applied_offers}
        </h2>
        {totalSavings > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl">
            <p className="text-xs font-semibold uppercase">{translation.offers_total_savings}</p>
            <p className="text-lg font-bold">
              {formatPrice(totalSavings)} {displayCurrency}
            </p>
          </div>
        )}
      </div>

      {appliedOffers.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            {translation.offers_applied} ({appliedOffers.length})
          </h3>
          {appliedOffers.map((offer, index) => (
            <div key={`applied-${offer.productId}-${offer.offerType}-${index}`}>
              {offer.offerType === "direct_discount" && renderDirectDiscount(offer)}
              {offer.offerType === "coupon" && renderCoupon(offer)}
              {offer.offerType === "free_product" && renderFreeProduct(offer)}
              {offer.offerType === "bundle_discount" && renderBundleDiscount(offer)}
            </div>
          ))}
        </div>
      )}

      {availableOffers.length > 0 && (
        <div className="space-y-4 pt-6 border-t-2 border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#009FE3]" />
            {translation.offers_available_offers} ({availableOffers.length})
          </h3>
          {availableOffers.map((offer, index) => (
            <div key={`available-${offer.productId}-${offer.offerType}-${index}`}>
              {offer.offerType === "direct_discount" && renderDirectDiscount(offer)}
              {offer.offerType === "coupon" && renderCoupon(offer)}
              {offer.offerType === "free_product" && renderFreeProduct(offer)}
              {offer.offerType === "bundle_discount" && renderBundleDiscount(offer)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
