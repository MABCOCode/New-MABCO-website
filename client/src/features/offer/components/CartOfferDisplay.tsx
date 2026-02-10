import {
  Tag,
  Gift,
  Ticket,
  Sparkles,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  Plus,
} from "lucide-react";
import translations from "../../../i18n/translations";
import {
  getProductOffers,
  products,
} from "../../../data/products";
import type {
  ProductOffer,
  DirectDiscountOffer,
  CouponOffer,
  FreeProductOffer,
  BundleDiscountOffer,
} from "../../../types/product";

interface CartOfferDisplayProps {
  productId: number;
  quantity: number;
  language: "ar" | "en";
  currencyLabel?: string;
  appliedCoupons?: Map<number, any>;
  bundleItems?: Map<number, number[]>;
  onAddBundleItem?: (productId: number, bundleItemId: number) => void;
  onApplyCoupon?: (productId: number, couponOffer: CouponOffer) => void;
}

export function CartOfferDisplay({
  productId,
  quantity,
  language,
  currencyLabel,
  appliedCoupons = new Map(),
  bundleItems = new Map(),
  onAddBundleItem,
  onApplyCoupon,
}: CartOfferDisplayProps) {
  const offers = getProductOffers(productId);
  if (offers.length === 0) return null;

  const product = products.find((p) => p.id === productId);
  const displayCurrency = currencyLabel || (language === "ar" ? "د.ع" : "IQD");

  const formatPrice = (price: number) => price.toLocaleString("en-US");

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "direct_discount":
        return TrendingDown;
      case "coupon":
        return Ticket;
      case "free_product":
        return Gift;
      case "bundle_discount":
        return Sparkles;
      default:
        return Tag;
    }
  };

  const getOfferGradient = (type: string) => {
    switch (type) {
      case "direct_discount":
        return "from-red-500 to-pink-500";
      case "coupon":
        return "from-blue-500 to-purple-500";
      case "free_product":
        return "from-green-500 to-emerald-500";
      case "bundle_discount":
        return "from-purple-500 to-violet-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };
  const translation = translations[language];


  const renderDirectDiscount = (offer: DirectDiscountOffer) => {
    const Icon = getOfferIcon("direct_discount");
    const gradient = getOfferGradient("direct_discount");

    let savingsAmount = 0;
    const basePrice = product?.basePrice ?? 0;
    if (offer.discountType === "percentage") {
      savingsAmount = (basePrice * offer.discountValue) / 100 * quantity;
    } else {
      savingsAmount = offer.discountValue * quantity;
    }

    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-3 border-2 border-red-200">
        <div className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-sm text-gray-900">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-bold text-green-700">
                  {translation.cart_offer_auto_applied}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                {translation.cart_offer_savings}: {formatPrice(savingsAmount)} {displayCurrency}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCoupon = (offer: CouponOffer) => {
    const Icon = getOfferIcon("coupon");
    const gradient = getOfferGradient("coupon");
    const isApplied = appliedCoupons.has(productId);

    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-sm text-gray-900">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
              <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                <Ticket className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-bold text-blue-700">
                  {formatPrice(offer.couponValue * quantity)} {displayCurrency}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">{translation.cart_offer_coupon_will_apply}</span>
            </div>
            {isApplied && (
              <div className="mt-2 text-xs text-green-700 font-semibold">
                {translation.cart_offer_applied}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFreeProduct = (offer: FreeProductOffer) => {
    const Icon = getOfferIcon("free_product");
    const gradient = getOfferGradient("free_product");
    const freeProduct = products.find((p) => p.id === offer.freeProductId);

    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200">
        <div className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center animate-pulse`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-sm text-gray-900">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
              <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full">
                <Gift className="w-3 h-3" />
                <span className="text-xs font-bold">{translation.cart_offer_free}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            {freeProduct && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-lg">
                <img
                  src={freeProduct.image}
                  alt={freeProduct.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {language === "ar" && freeProduct.nameAr
                      ? freeProduct.nameAr
                      : freeProduct.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(freeProduct.basePrice || 0)} {displayCurrency} × {quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-bold text-green-700">{translation.cart_offer_applied}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBundleDiscount = (offer: BundleDiscountOffer) => {
    const Icon = getOfferIcon("bundle_discount");
    const gradient = getOfferGradient("bundle_discount");
    const appliedBundleItems = bundleItems.get(productId) || [];

    return (
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-3 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-sm text-gray-900">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                {offer.discountPercentage}% {language === "ar" ? "خصم" : "OFF"}
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-600 mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="font-medium">{translation.cart_offer_choose_products}</span>
            </div>

            <div className="mt-2 space-y-2">
              {offer.relatedProductIds.slice(0, 3).map((relatedId) => {
                const relatedProduct = products.find((p) => p.id === relatedId);
                if (!relatedProduct) return null;

                const discountedPrice =
                  (relatedProduct.basePrice || 0) * (1 - offer.discountPercentage / 100);

                return (
                  <div
                    key={relatedId}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100"
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {language === "ar" && relatedProduct.nameAr
                          ? relatedProduct.nameAr
                          : relatedProduct.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-600">
                          {formatPrice(discountedPrice)} {displayCurrency}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(relatedProduct.basePrice || 0)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddBundleItem?.(productId, relatedId)}
                      className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-violet-500 text-white p-2 rounded-lg hover:scale-105 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-[#009FE3]" />
        <h3 className="text-sm font-bold text-gray-900">{translation.cart_offer_available_offers}</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-[#009FE3]/30 to-transparent"></div>
      </div>

      {offers.map((offer, index) => (
        <div key={index}>
          {offer.type === "direct_discount" && renderDirectDiscount(offer as DirectDiscountOffer)}
          {offer.type === "coupon" && renderCoupon(offer as CouponOffer)}
          {offer.type === "free_product" && renderFreeProduct(offer as FreeProductOffer)}
          {offer.type === "bundle_discount" && renderBundleDiscount(offer as BundleDiscountOffer)}
        </div>
      ))}
    </div>
  );
}
