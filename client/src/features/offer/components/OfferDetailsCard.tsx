import {
  Tag,
  Gift,
  Ticket,
  Package,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { ProductOffer } from "../../../types/product";

interface OfferDetailsCardProps {
  offers: ProductOffer[];
  language: "ar" | "en";
  basePrice: number;
  currentPrice: number;
  onProductClick?: (productId: number) => void;
}

export function OfferDetailsCard({
  offers,
  language,
  basePrice,
  currentPrice,
  onProductClick,
}: OfferDetailsCardProps) {
  if (offers.length === 0) return null;

  const renderDirectDiscount = (offer: any) => (
    <div
      key="direct-discount"
      className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200 animate-fadeIn"
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl shadow-lg">
          <Tag className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-700 mb-2">
            {language === "ar" ? offer.titleAr : offer.titleEn}
          </h3>
          <p className="text-gray-700 mb-4">
            {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
          </p>

          {/* Savings Highlight */}
          <div className="bg-white rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">
                {language === "ar" ? "السعر الأصلي" : "Original Price"}
              </span>
              <span className="text-gray-400 line-through font-bold">
                {basePrice.toLocaleString("en-US")} {language === "ar" ? "ل.س" : "SYP"}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">
                {language === "ar" ? "الخصم" : "Discount"}
              </span>
              <span className="text-red-600 font-bold">
                {offer.discountType === "percentage"
                  ? `${offer.discountValue}%`
                  : `${offer.discountValue.toLocaleString("en-US")} ${
                      language === "ar" ? "ل.س" : "SYP"
                    }`}
              </span>
            </div>
            <div className="pt-2 border-t border-red-100">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {language === "ar" ? "السعر النهائي" : "Final Price"}
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {currentPrice.toLocaleString("en-US")} {language === "ar" ? "ل.س" : "SYP"}
                </span>
              </div>
            </div>
          </div>

          {/* You Save Badge */}
          <div className="mt-4 bg-green-100 rounded-xl p-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-700">
              {language === "ar" ? "وفّرت" : "You Save"}{" "}
              {(basePrice - currentPrice).toLocaleString("en-US")}{" "}
              {language === "ar" ? "ل.س" : "SYP"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCouponOffer = (offer: any) => (
    <div
      key="coupon-offer"
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 animate-fadeIn"
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
          <Ticket className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-700 mb-2">
            {language === "ar" ? offer.titleAr : offer.titleEn}
          </h3>
          <p className="text-gray-700 mb-4">
            {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
          </p>

          {/* Step Flow */}
          <div className="bg-white rounded-xl p-4 border border-blue-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {language === "ar" ? "اشترِ هذا المنتج" : "Buy this product"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {language === "ar" ? "احصل على كوبون بقيمة" : "Receive coupon worth"}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {offer.couponValue.toLocaleString("en-US")}{" "}
                  {language === "ar" ? "ل.س" : "SYP"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {language === "ar"
                    ? "استخدمه على المنتجات المختارة"
                    : "Use on selected products"}
                </p>
              </div>
            </div>
          </div>

          {/* Validity Info */}
          {offer.validityDays && (
            <div className="mt-4 bg-blue-100 rounded-xl p-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-700">
                {language === "ar" ? "صالح لمدة" : "Valid for"} {offer.validityDays}{" "}
                {language === "ar" ? "يوم" : "days"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFreeProduct = (offer: any) => (
    <div
      key="free-product"
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 animate-fadeIn"
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            {language === "ar" ? offer.titleAr : offer.titleEn}
          </h3>
          <p className="text-gray-700 mb-4">
            {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
          </p>

          {/* Free Product Visual */}
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center">
                <p className="text-sm text-gray-600 mb-1">
                  {language === "ar" ? "هذا المنتج" : "This Product"}
                </p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <Package className="w-8 h-8 text-gray-600 mx-auto" />
                </div>
              </div>

              <div className="flex-shrink-0">
                <ArrowRight
                  className={`w-6 h-6 text-green-600 ${
                    language === "ar" ? "rotate-180" : ""
                  }`}
                />
              </div>

              <div className="flex-1 text-center">
                <p className="text-sm text-gray-600 mb-1">
                  {language === "ar" ? "هدية مجانية" : "Free Gift"}
                </p>
                <div className="bg-green-100 rounded-lg p-3 relative">
                  <Gift className="w-8 h-8 text-green-600 mx-auto" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {language === "ar" ? "مجاني" : "FREE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Value Info */}
          <div className="mt-4 bg-green-100 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-700">
              {language === "ar"
                ? "سيتم إضافة الهدية تلقائياً للسلة"
                : "Free gift will be added to cart automatically"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBundleDiscount = (offer: any) => (
    <div
      key="bundle-discount"
      className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border-2 border-purple-200 animate-fadeIn"
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl shadow-lg">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-purple-700 mb-2">
            {language === "ar" ? offer.titleAr : offer.titleEn}
          </h3>
          <p className="text-gray-700 mb-4">
            {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
          </p>

          {/* Discount Info */}
          <div className="bg-white rounded-xl p-4 border border-purple-200">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600 mb-1">
                {language === "ar" ? "خصم على المنتجات المرتبطة" : "Discount on Related Products"}
              </p>
              <p className="text-4xl font-bold text-purple-600">{offer.discountPercentage}%</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 text-center">
                {language === "ar"
                  ? `${offer.relatedProductIds.length} منتجات مؤهلة للخصم`
                  : `${offer.relatedProductIds.length} products eligible for discount`}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 bg-purple-100 rounded-xl p-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-purple-700">
              {language === "ar"
                ? "سيتم تطبيق الخصم عند إضافة المنتجات المرتبطة"
                : "Discount will apply when you add related products"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {offers.map((offer) => {
        switch (offer.type) {
          case "direct_discount":
            return renderDirectDiscount(offer);
          case "coupon":
            return renderCouponOffer(offer);
          case "free_product":
            return renderFreeProduct(offer);
          case "bundle_discount":
            return renderBundleDiscount(offer);
          default:
            return null;
        }
      })}
    </div>
  );
}
