import { ArrowLeft, ArrowRight, Gift, Package, Sparkles, Tag, Ticket, TrendingDown, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useLanguage } from "../../../context/LanguageContext";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { getProductRef } from "../../../utils/entityRefs";
import {
  formatOfferDiscountLabel,
  normalizeOffers,
  resolveOfferDiscountType,
  resolveOfferDiscountValue,
} from "../../../utils/offerPricing";
import { useCompareStore } from "../../compare/state";
import ProductCard from "../../products/components/ProductCard";

interface OfferTypePageProps {
  offerType: "direct_discount" | "coupon" | "free_product" | "bundle_discount";
  language: "ar" | "en";
  onClose: () => void;
  onProductClick: (product: any) => void;
  addToCart: (product: any, color?: string, planId?: string | null) => void;
  toggleCompare: (id: string) => void;
  compareItems: string[];
}

const offerTypeInfo = (offerType: OfferTypePageProps["offerType"]) => {
  switch (offerType) {
    case "direct_discount":
      return {
        icon: Tag,
        titleEn: "Direct Discount Offers",
        titleAr: "عروض الخصم المباشر",
        descriptionEn: "Save instantly with amazing discounts on these premium products",
        descriptionAr: "وفّر فوراً مع خصومات مذهلة على هذه المنتجات المميزة",
        gradient: "from-red-500 to-pink-600",
        bgGradient: "from-red-50 to-pink-50",
        bgColor: "bg-red-500",
      };
    case "coupon":
      return {
        icon: Ticket,
        titleEn: "Coupon Offers",
        titleAr: "عروض الكوبونات",
        descriptionEn: "Buy these products and receive valuable coupons for your next purchase",
        descriptionAr: "اشترِ هذه المنتجات واحصل على كوبونات قيّمة لمشترياتك القادمة",
        gradient: "from-blue-500 to-indigo-600",
        bgGradient: "from-blue-50 to-indigo-50",
        bgColor: "bg-blue-500",
      };
    case "free_product":
      return {
        icon: Gift,
        titleEn: "Free Gift Offers",
        titleAr: "عروض الهدايا المجانية",
        descriptionEn: "Purchase these products and get amazing gifts absolutely free",
        descriptionAr: "اشترِ هذه المنتجات واحصل على هدايا مذهلة مجاناً تماماً",
        gradient: "from-green-500 to-emerald-600",
        bgGradient: "from-green-50 to-emerald-50",
        bgColor: "bg-green-500",
      };
    case "bundle_discount":
      return {
        icon: Package,
        titleEn: "Bundle Discount Offers",
        titleAr: "عروض خصم الحزم",
        descriptionEn: "Buy these products and unlock special discounts on related accessories",
        descriptionAr: "اشترِ هذه المنتجات وافتح خصومات خاصة على الإكسسوارات المرتبطة",
        gradient: "from-purple-500 to-violet-600",
        bgGradient: "from-purple-50 to-violet-50",
        bgColor: "bg-purple-500",
      };
  }
};

export function OfferTypePage({
  offerType,
  language,
  onClose,
  onProductClick,
  addToCart,
  toggleCompare,
  compareItems,
}: OfferTypePageProps) {
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    const baseParams = new URLSearchParams();
    baseParams.set("limit", "200");
    baseParams.set("card", "1");
    baseParams.set("count", "0");
    baseParams.set("offer_type", offerType);

    setIsLoading(true);
    (async () => {
      try {
        const fetchAll = async (scope: "product" | "color" | "charge", includeActive: boolean) => {
          const items: any[] = [];
          const limit = Number(baseParams.get("limit") || 200);
          let page = 1;
          while (page <= 200) {
            const params = new URLSearchParams(baseParams);
            params.set("offer_scope", scope);
            params.set("page", String(page));
            if (includeActive) params.set("active", "true");
            const res = await fetch(`${apiBase}/products?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to load products");
            const json = await res.json();
            const data = Array.isArray(json?.data) ? json.data : [];
            if (data.length === 0) break;
            items.push(...data);
            if (data.length < limit) break;
            page += 1;
          }
          return items;
        };

        let productList = await fetchAll("product", true);
        let colorList = await fetchAll("color", true);
        let chargeList = await fetchAll("charge", true);

        if (productList.length === 0 && colorList.length === 0 && chargeList.length === 0) {
          productList = await fetchAll("product", false);
          colorList = await fetchAll("color", false);
          chargeList = await fetchAll("charge", false);
        }

        const byKey = new Map<string, any>();
        const getKey = (p: any) => String(p?.id || p?.stk_code || p?._id || p?.slug || "");
        const mergeList = (items: any[]) => {
          items.forEach((p) => {
            const key = getKey(p);
            if (!key) return;
            const existing = byKey.get(key);
            if (!existing) {
              byKey.set(key, p);
              return;
            }
            byKey.set(key, { ...existing, ...p });
          });
        };
        mergeList(productList);
        mergeList(colorList);
        mergeList(chargeList);

        if (mounted) {
          setApiProducts(Array.from(byKey.values()));
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setApiProducts([]);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [offerType]);

  const heroProducts = useMemo(() => {
    const hasOfferType = (offers: any[] | undefined) =>
      normalizeOffers(Array.isArray(offers) ? offers : []).some((offer) => offer.type === offerType);
    const parsePrice = (value: unknown): number => {
      if (typeof value === "number") return Number.isFinite(value) ? value : 0;
      if (typeof value === "string") {
        const cleaned = value.replace(/,/g, "").trim();
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    };

    return apiProducts
      .map((product) => {
        const productHasOffer = hasOfferType(product.offers);
        const colorVariants = Array.isArray(product.colorVariants) ? product.colorVariants : [];
        const chargeOptions = Array.isArray(product.chargeOptions) ? product.chargeOptions : [];
        const hasColors = colorVariants.length > 0;

        const matchingColors = colorVariants.filter((variant: any) => hasOfferType(variant?.offers));
        const matchingCharges = chargeOptions.filter((opt: any) => hasOfferType(opt?.offers));

        if (hasColors && matchingColors.length === 0) {
          return null;
        }

        const resolvedColors = hasColors ? matchingColors : [];
        const resolvedCharges =
          matchingCharges.length > 0
            ? matchingCharges
            : productHasOffer
            ? chargeOptions
            : [];

        const hasMatching =
          productHasOffer || matchingColors.length > 0 || matchingCharges.length > 0;

        if (!hasMatching) return null;

        return {
          ...product,
          colorVariants: resolvedColors,
          chargeOptions: resolvedCharges,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => parsePrice(b.price) - parsePrice(a.price)) as any[];
  }, [apiProducts, offerType]);

  const maxSavingsDisplay = useMemo(() => {
    let maxDiscountPct = 0;
    let maxDiscountValue = 0;
    let maxCouponValue = 0;
    let maxBundlePct = 0;
    let maxGiftValue = 0;

    const parsePrice = (value: unknown): number => {
      if (typeof value === "number") return Number.isFinite(value) ? value : 0;
      if (typeof value === "string") {
        const cleaned = value.replace(/,/g, "").trim();
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    };

    const allProducts = Array.isArray(apiProducts) ? apiProducts : [];

    heroProducts.forEach((product: any) => {
      const offers = [
        ...(Array.isArray(product.offers) ? product.offers : []),
        ...(Array.isArray(product.colorVariants)
          ? product.colorVariants.flatMap((v: any) => v?.offers || [])
          : []),
        ...(Array.isArray(product.chargeOptions)
          ? product.chargeOptions.flatMap((o: any) => o?.offers || [])
          : []),
      ];
      const normalized = normalizeOffers(offers);

      normalized.forEach((offer) => {
        if (offer.type === "direct_discount") {
          if (offer.discountType === "percentage") {
            maxDiscountPct = Math.max(maxDiscountPct, offer.discountValue);
          } else {
            maxDiscountValue = Math.max(maxDiscountValue, offer.discountValue);
          }
        }
        if (offer.type === "coupon") {
          maxCouponValue = Math.max(maxCouponValue, resolveOfferDiscountValue(offer));
        }
        if (offer.type === "bundle_discount") {
          const bundleValue = resolveOfferDiscountValue(offer);
          if (resolveOfferDiscountType(offer) === "percentage") {
            maxBundlePct = Math.max(maxBundlePct, bundleValue);
          } else {
            maxDiscountValue = Math.max(maxDiscountValue, bundleValue);
          }
        }
        if (offer.type === "free_product") {
          const freeId = (offer as any).freeProductId;
          if (freeId) {
            const freeProduct = allProducts.find(
              (p: any) => String(p.id) === String(freeId) || String(p.stk_code) === String(freeId),
            );
            if (freeProduct) {
              maxGiftValue = Math.max(maxGiftValue, parsePrice(freeProduct.price));
            }
          }
        }
      });
    });

    switch (offerType) {
      case "direct_discount":
        if (maxDiscountPct > 0) return `${Math.round(maxDiscountPct)}%`;
        if (maxDiscountValue > 0) return `${maxDiscountValue.toLocaleString()} ${CURRENCY_LABEL}`;
        return "--";
      case "coupon":
        return maxCouponValue > 0
          ? `${maxCouponValue.toLocaleString()} ${CURRENCY_LABEL}`
          : "--";
      case "bundle_discount":
        if (maxBundlePct > 0) return `${Math.round(maxBundlePct)}%`;
        if (maxDiscountValue > 0) return `${maxDiscountValue.toLocaleString()} ${CURRENCY_LABEL}`;
        return "--";
      case "free_product":
        return maxGiftValue > 0
          ? `${maxGiftValue.toLocaleString()} ${CURRENCY_LABEL}`
          : language === "ar"
          ? "مجاني"
          : "FREE";
      default:
        return "--";
    }
  }, [apiProducts, heroProducts, offerType, language]);

  const offerInfo = offerTypeInfo(offerType);
  const Icon = offerInfo.icon;
  const navigate = useNavigate();

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-white fixed inset-0 overflow-y-auto z-[60]"
    >
      {/* Custom Navigation Bar */}
      <nav >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all flex items-center justify-center group"
              >
                <ArrowLeft
                  className={`w-6 h-6 text-white group-hover:scale-110 transition-transform ${
                    language === "ar" ?  "rotate-180" : "" 
                  }`}
                />
              </button>

              {/* Offer Type Badge */}
              <div className="hidden sm:flex items-center gap-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl px-4 py-2.5">
                <Icon className="w-6 h-6 text-white" />
                <div>
                  <p className="text-xs text-white/80">
                    {language === "ar" ? "نوع العرض" : "Offer Type"}
                  </p>
                  <p className="font-bold text-white text-sm">
                    {language === "ar" ? offerInfo.titleAr : offerInfo.titleEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Logo - MABCO */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="text-white text-2xl font-bold tracking-wider">
                MABCO
              </div>
            </div>

            {/* Stats Badge */}
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2">
              <Sparkles className="w-5 h-5 text-white" />
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <p className="text-2xl font-bold text-white">{heroProducts.length}</p>
                <p className="text-xs text-white/80">
                  {language === "ar" ? "منتج متاح" : "Products"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all flex items-center justify-center group"
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="sticky top-20 z-[10001] bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate("/")}
              className={`group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0 ${
                language === "ar" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <ArrowRight
                className={`w-4 h-4 ${language === "ar" ? "rotate-180" : ""}`}
              />
              <span className="font-medium">{language === "ar" ? "الرئيسية" : "Home"}</span>
            </button>
            <span className="text-gray-300 flex-shrink-0">/</span>
            <button
              onClick={() => navigate("/#special-offers-carousel")}
              className="text-gray-500 hover:text-[#009FE3] transition-colors duration-200 font-medium whitespace-nowrap"
            >
              {language === "ar" ? "العروض" : "Offers"}
            </button>
            <span className="text-gray-300 flex-shrink-0">/</span>
            <span className="text-[#009FE3] font-semibold whitespace-nowrap">
              {language === "ar" ? offerInfo.titleAr : offerInfo.titleEn}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${offerInfo.bgGradient} py-16 sm:py-20 relative overflow-hidden`}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-10 right-10 w-64 h-64 ${offerInfo.bgColor} rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-10 left-10 w-96 h-96 ${offerInfo.bgColor} rounded-full blur-3xl`}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center mb-8 animate-bounce-slow">
              <div className={`bg-gradient-to-br ${offerInfo.gradient} p-8 rounded-3xl shadow-2xl`}>
                <Icon className="w-20 h-20 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {language === "ar" ? offerInfo.titleAr : offerInfo.titleEn}
            </h1>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed">
              {language === "ar" ? offerInfo.descriptionAr : offerInfo.descriptionEn}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl px-6 py-5 shadow-xl">
                <div className={`text-4xl font-bold bg-gradient-to-r ${offerInfo.gradient} bg-clip-text text-transparent mb-2`}>
                  {heroProducts.length}
                </div>
                <p className="text-sm text-gray-600">
                  {language === "ar" ? "منتج مميز" : "Hero Products"}
                </p>
              </div>
              
              <div className="bg-white rounded-2xl px-6 py-5 shadow-xl">
                <div className={`text-4xl font-bold bg-gradient-to-r ${offerInfo.gradient} bg-clip-text text-transparent mb-2`}>
                  {maxSavingsDisplay}
                </div>
                <p className="text-sm text-gray-600">
                  {language === "ar" ? "أقصى توفير" : "Max Savings"}
                </p>
              </div>

              <div className="bg-white rounded-2xl px-6 py-5 shadow-xl">
                <div className={`text-4xl font-bold bg-gradient-to-r ${offerInfo.gradient} bg-clip-text text-transparent mb-2`}>
                  ⚡
                </div>
                <p className="text-sm text-gray-600">
                  {language === "ar" ? "عروض محدودة" : "Limited Time"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="container mx-auto px-4 py-16 bg-white">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={`offer-skeleton-${idx}`} className="rounded-2xl border border-gray-200 p-4 bg-white">
                <div className="aspect-square rounded-xl shimmer-surface mb-4" />
                <div className="h-4 w-3/4 skeleton-line shimmer-surface mb-2" />
                <div className="h-4 w-1/2 skeleton-line shimmer-surface mb-3" />
                <div className="h-9 w-full rounded-lg shimmer-surface" />
              </div>
            ))}
          </div>
        ) : heroProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-gray-100 p-8 rounded-full">
                <Icon className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {language === "ar" ? "لا توجد منتجات حالياً" : "No Products Available"}
            </h3>
            <p className="text-gray-500">
              {language === "ar"
                ? "لا توجد منتجات متاحة لهذا النوع من العروض حالياً"
                : "No products available for this offer type at the moment"}
            </p>
          </div>
        ) : (
          <>
            {/* Products Header */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {language === "ar" ? "المنتجات البطولية" : "Hero Products"}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {language === "ar"
                      ? "اختر المنتج المناسب واستفد من العرض الحصري"
                      : "Choose your product and take advantage of the exclusive offer"}
                  </p>
                </div>

                {/* Mobile Stats */}
                <div className="md:hidden flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                  <Sparkles className={`w-5 h-5 bg-gradient-to-r ${offerInfo.gradient} bg-clip-text text-transparent`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{heroProducts.length}</p>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "منتج" : "Items"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-1 w-32 bg-gradient-to-r ${offerInfo.gradient} rounded-full`}></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {heroProducts.map((product) => {
                const offers = normalizeOffers(Array.isArray(product.offers) ? product.offers : []);
                const variantOffers = normalizeOffers(
                  Array.isArray(product.colorVariants)
                    ? product.colorVariants.flatMap((v: any) => v?.offers || [])
                    : [],
                );
                const chargeOffers = normalizeOffers(
                  Array.isArray(product.chargeOptions)
                    ? product.chargeOptions.flatMap((o: any) => o?.offers || [])
                    : [],
                );
                const currentOffer =
                  offers.find((o) => o.type === offerType) ||
                  variantOffers.find((o) => o.type === offerType) ||
                  chargeOffers.find((o) => o.type === offerType);

                return (
                  <div
                    key={getProductRef(product) || String((product as any).id)}
                    className="group relative"
                    onClick={() => onProductClick(product)}
                  >
                    <ProductCard
                      product={product}
                      addToCart={(color, planId) => addToCart(product, color, planId)}
                      toggleCompare={toggleCompare}
                      compareItems={compareItems}
                      language={language}
                      addToCartText={language === "ar" ? "أضف للسلة" : "Add to Cart"}
                      onProductClick={(p) =>
                        onProductClick(p)
                      }
                      topBadge={
                        <div
                          className={`bg-gradient-to-r ${offerInfo.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap`}
                        >
                          <Icon className="w-4 h-4" />
                          {offerType === "direct_discount" && (
                            <span>
                              {(() => {
                                if (!currentOffer) return "";
                                const rawType =
                                  (currentOffer as any).discountType ??
                                  (currentOffer as any).discount_type ??
                                  "";
                                const type =
                                  rawType === "percentage" || rawType === "p" ? "percentage" : "value";
                                const rawValue =
                                  (currentOffer as any).discountValue ??
                                  (currentOffer as any).discount ??
                                  (currentOffer as any).value ??
                                  0;
                                const num = typeof rawValue === "number"
                                  ? rawValue
                                  : Number(String(rawValue).replace(/[^0-9.-]/g, ""));
                                if (!Number.isFinite(num) || num <= 0) {
                                  return language === "ar" ? "خصم" : "OFF";
                                }
                                return type === "percentage"
                                  ? `${num}% ${language === "ar" ? "خصم" : "OFF"}`
                                  : `${num.toFixed(0)} $ ${language === "ar" ? "خصم" : "OFF"}`;
                              })()}
                            </span>
                          )}
                          {offerType === "coupon" && (
                            <span>
                              {(() => {
                                if (!currentOffer) return "";
                                const num = resolveOfferDiscountValue(currentOffer);
                                if (!Number.isFinite(num) || num <= 0) {
                                  return language === "ar" ? "كوبون" : "Coupon";
                                }
                                return formatOfferDiscountLabel(
                                  currentOffer,
                                  language,
                                  CURRENCY_LABEL,
                                  language === "ar" ? "كوبون" : "Coupon",
                                );
                                return `${(num).toFixed(0)} $ ${
                                  language === "ar" ? "كوبون" : "Coupon"
                                }`;
                              })()}
                            </span>
                          )}
                          {offerType === "free_product" && (
                            <span>{language === "ar" ? "هدية مجانية" : "Free Gift"}</span>
                          )}
                          {offerType === "bundle_discount" && (
                            <span>
                              {(() => {
                                if (!currentOffer) return "";
                                const num = resolveOfferDiscountValue(currentOffer);
                                if (!Number.isFinite(num) || num <= 0) {
                                  return language === "ar" ? "حزمة" : "Bundle";
                                }
                                return formatOfferDiscountLabel(
                                  currentOffer,
                                  language,
                                  CURRENCY_LABEL,
                                  language === "ar" ? "حزمة" : "Bundle",
                                );
                              })()}
                              {false && currentOffer && "discountPercentage" in currentOffer
                                ? `${currentOffer.discountPercentage}% ${
                                    language === "ar" ? "على الحزمة" : "Bundle"
                                  }`
                                : ""}
                            </span>
                          )}
                        </div>
                      }
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA Section */}
      {heroProducts.length > 0 && (
        <div className={`bg-gradient-to-br ${offerInfo.bgGradient} py-16 border-t border-gray-200`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                {language === "ar" ? "جاهز للتوفير؟" : "Ready to Save?"}
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                {language === "ar"
                  ? "اختر منتجك المفضل الآن واستفد من العرض الحصري"
                  : "Choose your favorite product now and take advantage of the exclusive offer"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <TrendingDown className="w-8 h-8 text-green-600" />
                    <div className={language === "ar" ? "text-right" : "text-left"}>
                      <p className="text-sm text-gray-500">
                        {language === "ar" ? "وفّر حتى" : "Save up to"}
                      </p>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${offerInfo.gradient} bg-clip-text text-transparent`}>
                        {maxSavingsDisplay}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OfferTypeRoute() {
  const navigate = useNavigate();
  const { offerType } = useParams<{ offerType?: OfferTypePageProps["offerType"] }>();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const compareItems = useCompareStore((s: any) => s.items) as string[];
  const toggleCompare = useCompareStore((s: any) => s.toggleCompare) as (id: string) => void;

  const normalizedType =
    offerType === "direct_discount" ||
    offerType === "coupon" ||
    offerType === "free_product" ||
    offerType === "bundle_discount"
      ? offerType
      : "direct_discount";

  return (
    <OfferTypePage
      offerType={normalizedType}
      language={language}
      onClose={() => navigate(-1)}
      onProductClick={(product) =>
        navigate(`/product/${encodeURIComponent(getProductRef(product) || (product as any).id)}`, {
          state: {
            product,
            breadcrumbs: [
              {
                label: language === "ar" ? "العروض" : "Offers",
                href: "/#special-offers-carousel",
              },
              {
                label:
                  language === "ar"
                    ? offerTypeInfo(normalizedType).titleAr
                    : offerTypeInfo(normalizedType).titleEn,
                href: `/offers/${normalizedType}`,
              },
            ],
          },
        })
      }
      addToCart={(product, color, planId) => addToCart(product, { color, chargeOptionId: planId })}
      toggleCompare={toggleCompare}
      compareItems={compareItems}
    />
  );
}
