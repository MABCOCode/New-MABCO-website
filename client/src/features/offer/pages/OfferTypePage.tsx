import { X, Tag, Gift, Ticket, Package, Sparkles, ArrowRight, TrendingDown, Menu } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useCompareStore } from "../../compare/state";
import { useLanguage } from "../../../context/LanguageContext";
import  ProductCard  from "../../products/components/ProductCard";
import { getProductOffers, products } from "../../../data/products";

interface OfferTypePageProps {
  offerType: "direct_discount" | "coupon" | "free_product" | "bundle_discount";
  language: "ar" | "en";
  onClose: () => void;
  onProductClick: (product: any) => void;
  addToCart: (product: any, color?: string, planId?: string | null) => void;
  toggleCompare: (id: number) => void;
  compareItems: number[];
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
  // Get all products that have this offer type
  const heroProducts = products.filter((product) => {
    const offers = getProductOffers(product.id);
    return offers.some((offer) => offer.type === offerType);
  });

  const offerInfo = offerTypeInfo(offerType);
  const Icon = offerInfo.icon;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white fixed inset-0 overflow-y-auto z-[100]">
      {/* Custom Navigation Bar */}
      <nav className={`sticky top-0 z-50 bg-gradient-to-r ${offerInfo.gradient} shadow-2xl`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all flex items-center justify-center group"
              >
                <ArrowRight
                  className={`w-6 h-6 text-white group-hover:scale-110 transition-transform ${
                    language === "ar" ? "" : "rotate-180"
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
              <div className="text-right">
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
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
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
                  {offerType === "direct_discount" && "30%"}
                  {offerType === "coupon" && "200K"}
                  {offerType === "free_product" && "FREE"}
                  {offerType === "bundle_discount" && "35%"}
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
        {heroProducts.length === 0 ? (
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
                const offers = getProductOffers(product.id);
                const currentOffer = offers.find((o) => o.type === offerType);

                return (
                  <div
                    key={product.id}
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
                              {currentOffer && "discountType" in currentOffer
                                ? currentOffer.discountType === "percentage"
                                  ? `${currentOffer.discountValue}% ${language === "ar" ? "خصم" : "OFF"}`
                                  : language === "ar"
                                  ? "خصم خاص"
                                  : "Special Deal"
                                : ""}
                            </span>
                          )}
                          {offerType === "coupon" && (
                            <span>
                              {currentOffer && "couponValue" in currentOffer
                                ? `${(currentOffer.couponValue / 1000).toFixed(0)}K ${
                                    language === "ar" ? "كوبون" : "Coupon"
                                  }`
                                : ""}
                            </span>
                          )}
                          {offerType === "free_product" && (
                            <span>{language === "ar" ? "هدية مجانية" : "Free Gift"}</span>
                          )}
                          {offerType === "bundle_discount" && (
                            <span>
                              {currentOffer && "discountPercentage" in currentOffer
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
                    <div className="text-left">
                      <p className="text-sm text-gray-500">
                        {language === "ar" ? "وفّر حتى" : "Save up to"}
                      </p>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${offerInfo.gradient} bg-clip-text text-transparent`}>
                        {offerType === "direct_discount" && "30%"}
                        {offerType === "coupon" && "200,000 SYP"}
                        {offerType === "free_product" && "950,000 SYP"}
                        {offerType === "bundle_discount" && "35%"}
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
  const compareItems = useCompareStore((s: any) => s.items) as number[];
  const toggleCompare = useCompareStore((s: any) => s.toggleCompare) as (id: number) => void;

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
        navigate(`/product/${product.id}`, {
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
