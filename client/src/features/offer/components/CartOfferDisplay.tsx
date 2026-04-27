import {
  AlertCircle,
  CheckCircle,
  Gift,
  Sparkles,
  Tag,
  Ticket,
  TrendingDown,
} from "lucide-react";
import { getProductOffers, products } from "../../../data/products";
import translations from "../../../i18n/translations";
import type {
  BundleDiscountOffer,
  CouponOffer,
  DirectDiscountOffer,
  FreeProductOffer,
  ProductOffer,
} from "../../../types/product";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { formatOfferDiscountLabel, getOfferSavings } from "../../../utils/offerPricing";

interface CartOfferDisplayProps {
  productId: number;
  quantity: number;
  language: "ar" | "en";
  currencyLabel?: string;
  offers?: ProductOffer[];
  basePrice?: number;
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
  offers: offersOverride,
  basePrice,
  appliedCoupons = new Map(),
  bundleItems = new Map(),
}: CartOfferDisplayProps) {
  const offers = offersOverride?.length
    ? getProductOffers({ offers: offersOverride } as any)
    : getProductOffers(productId);
  if (offers.length === 0) return null;

  const product = products.find((p) => p.id === productId);
  const displayCurrency = currencyLabel || CURRENCY_LABEL;
  const translation = translations[language];
  const iconAlignmentClass =
    language === "ar" ? "lg:justify-end" : "lg:justify-start";

  const formatPrice = (price: number) => price.toLocaleString("en-US");
  const numericPrice = (value: unknown) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const parsed = Number(value.replace(/,/g, "").trim());
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

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
        return "from-blue-500 to-indigo-600";
      case "free_product":
        return "from-green-500 to-emerald-600";
      case "bundle_discount":
        return "from-purple-500 to-violet-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCardClasses = (type: string) => {
    switch (type) {
      case "direct_discount":
        return "mx-auto w-full max-w-4xl rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-4";
      case "coupon":
        return "mx-auto w-full max-w-4xl rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4";
      case "free_product":
        return "mx-auto w-full max-w-4xl rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4";
      case "bundle_discount":
        return "mx-auto w-full max-w-4xl rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 p-4";
      default:
        return "mx-auto w-full max-w-4xl rounded-2xl border-2 border-gray-200 bg-white p-4";
    }
  };

  const renderIcon = (type: string) => {
    const Icon = getOfferIcon(type);
    const gradient = getOfferGradient(type);

    return (
      <div className={`flex w-full justify-center ${iconAlignmentClass}`}>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    );
  };

  const renderDirectDiscount = (offer: DirectDiscountOffer) => {
    const basePriceValue =
      typeof basePrice === "number" ? basePrice : numericPrice(product?.price);
    const savingsAmount = getOfferSavings(basePriceValue, offer) * quantity;

    return (
      <div className={getCardClasses("direct_discount")}>
        <div className="flex flex-col gap-4">
          {renderIcon("direct_discount")}
          <div className="w-full min-w-0">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h4 className="text-lg font-bold text-red-700">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
              {/* <div className="inline-flex items-center gap-1 self-start rounded-full bg-green-100 px-3 py-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs font-bold text-green-700">
                  {translation.cart_offer_auto_applied}
                </span>
              </div> */}
            </div>
            {/* <p className="mb-4 text-sm text-gray-700">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p> */}
            <div className="rounded-xl border border-red-200 bg-white p-4">
              <div className="inline-flex items-center rounded-lg bg-green-500 px-3 py-2 text-sm font-bold text-white">
                {translation.cart_offer_savings}: {formatPrice(savingsAmount)}{" "}
                {displayCurrency}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCoupon = (offer: CouponOffer) => {
    const isApplied = appliedCoupons.has(productId);

    return (
      <div className={getCardClasses("coupon")}>
        <div className="flex flex-col gap-4">
          {renderIcon("coupon")}
          <div className="w-full min-w-0">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h4 className="text-lg font-bold text-blue-700">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
              <div className="inline-flex items-center gap-1 self-start rounded-full bg-blue-100 px-3 py-1">
                <Ticket className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-bold text-blue-700">
                  {formatOfferDiscountLabel(offer, language, displayCurrency)}
                </span>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-700">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            <div className="rounded-xl border border-blue-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">
                  {translation.cart_offer_coupon_will_apply}
                </span>
              </div>
              {isApplied && (
                <div className="mt-3 text-sm font-semibold text-green-700">
                  {translation.cart_offer_applied}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFreeProduct = (offer: FreeProductOffer) => {
    const freeProduct = products.find((p) => p.id === offer.freeProductId);

    return (
      <div className={getCardClasses("free_product")}>
        <div className="flex flex-col gap-4">
          {renderIcon("free_product")}
          <div className="w-full min-w-0">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h4 className="text-lg font-bold text-green-700">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
              <div className="inline-flex items-center gap-1 self-start rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-white">
                <Gift className="h-3 w-3" />
                <span className="text-xs font-bold">
                  {translation.cart_offer_free}
                </span>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-700">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            {freeProduct && (
              <div className="rounded-xl border border-green-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={freeProduct.image}
                    alt={freeProduct.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {language === "ar" && freeProduct.nameAr
                        ? freeProduct.nameAr
                        : freeProduct.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(numericPrice(freeProduct.price))}{" "}
                      {displayCurrency} x {quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-bold text-green-700">
                      {translation.cart_offer_applied}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBundleDiscount = (offer: BundleDiscountOffer) => {
    const appliedBundleItems = bundleItems.get(productId) || [];

    return (
      <div className={getCardClasses("bundle_discount")}>
        <div className="flex flex-col gap-4">
          {renderIcon("bundle_discount")}
          <div className="w-full min-w-0">
            <div className="inline-flex self-start rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
              {formatOfferDiscountLabel(
                offer,
                language,
                displayCurrency,
                language === "ar"
                  ? "خصم على المنتجات المرتبطة"
                  : "Discount on related products",
              )}
            </div>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h4 className="text-lg font-bold text-purple-700">
                {language === "ar" ? offer.titleAr : offer.titleEn}
              </h4>
            </div>
            {/* <p className="mb-4 text-sm text-gray-700">
              {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
            </p>
            <p className="text-xs font-medium text-purple-700">
              {language === "ar"
                ? "يتم تطبيق هذا الخصم فقط على المنتجات المرتبطة بالعرض."
                : "This discount applies only to the offer's related products."}
            </p> */}
            {appliedBundleItems.length > 0 && (
              <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                {language === "ar"
                  ? `تمت إضافة ${appliedBundleItems.length} من المنتجات المرتبطة`
                  : `${appliedBundleItems.length} related product(s) added`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="mb-2 flex items-center gap-2">
        <Tag className="h-4 w-4 text-[#009FE3]" />
        <h3 className="text-sm font-bold text-gray-900">
          {translation.cart_offer_available_offers}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-[#009FE3]/30 to-transparent" />
      </div>

      {offers.map((offer, index) => (
        <div key={index}>
          {offer.type === "direct_discount" &&
            renderDirectDiscount(offer as DirectDiscountOffer)}
          {offer.type === "coupon" &&
            renderCoupon(offer as CouponOffer)}
          {offer.type === "free_product" &&
            renderFreeProduct(offer as FreeProductOffer)}
          {offer.type === "bundle_discount" &&
            renderBundleDiscount(offer as BundleDiscountOffer)}
        </div>
      ))}
    </div>
  );
}
