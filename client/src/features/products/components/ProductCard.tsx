import React from "react";
import { ShoppingCart, Tag, Flame, TrendingUp } from "lucide-react";
import { Product } from "../../../types/product";
import { useCart } from "../../../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorSwatch } from "../../../components/ui/ColorSwatch";
import { ChargeOptionSlider } from "../../../components/ui/ChargeOptionSlider";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { getProductRef } from "../../../utils/entityRefs";
import { getOfferPricing } from "../../../data/products";

export interface ProductCardProps {
  product: Product;
  toggleCompare: (productId: string) => void;
  compareItems: string[];
  language: "ar" | "en";
  onQuickView?: () => void;
  topBadge?: React.ReactNode;
  onProductClick?: (product: Product) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  toggleCompare,
  compareItems,
  language,
  onQuickView,
  topBadge,
  onProductClick,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const resolveNumericId = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/[^\d]/g, ""));
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return null;
  };
  const resolvedProductId =
    resolveNumericId((product as any).id) ??
    resolveNumericId((product as any).stk_code) ??
    resolveNumericId((product as any).sku);
  const productRef = getProductRef(product);
  const resolvedCartId = productRef || resolvedProductId || `product-${product.name}`;
  const safeColorVariants = Array.isArray(product.colorVariants)
    ? product.colorVariants
    : [];
  const safeChargeOptions = Array.isArray(product.chargeOptions)
    ? product.chargeOptions
    : [];
  const [selectedColor, setSelectedColor] = useState(
    safeColorVariants[0]?.name || "",
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(
    safeChargeOptions[0]?.id || null,
  );
  const [isHovered, setIsHovered] = useState(false);

  // Use hovered color if available, otherwise use selected color
  const displayColor = hoveredColor || selectedColor;
  const currentImage =
    safeColorVariants.find((v) => v.name === displayColor)?.image ||
    product.image;

  const hasColors = safeColorVariants.length > 0;
  const hasChargeOptions = safeChargeOptions.length > 0;

  const badgeText = (() => {
    if (product.isMostSold) return language === "ar" ? "الأكثر مبيعاً" : "MOST SOLD";
    if (product.badge) {
      const badgeLower = String(product.badge).toLowerCase();
      if (language === "ar") {
        if (badgeLower === "new" || badgeLower === "جديد") return "جديد";
        if (badgeLower === "hot" || badgeLower === "حار") return "حار";
      } else {
        if (badgeLower === "جديد" || badgeLower === "new") return "NEW";
        if (badgeLower === "حار" || badgeLower === "hot") return "HOT";
      }
      return String(product.badge);
    }
    if (product.isNew) return language === "ar" ? "جديد" : "NEW";
    if (product.isHot) return language === "ar" ? "حار" : "HOT";
    return "";
  })();

  const badgeVariant = product.isMostSold
    ? "text-white"
    : product.isNew
    ? "bg-green-500"
    : product.isHot
    ? "bg-red-500"
    : "bg-slate-600";

  const badgeStyle = product.isMostSold
    ? { background: "linear-gradient(90deg, #f59e0b, #f97316)" }
    : undefined;

  // Robust compare match: support string or number ids
  const isCompared = Array.isArray(compareItems)
    ? compareItems.some((id) => String(id) === String(productRef))
    : false;

  const currentChargeOption = safeChargeOptions.find(
    (opt) => opt.id === selectedChargeOption,
  );

  const handleAddToCart = () => {
    const chosenColor = hasColors ? selectedColor : undefined;
    const chosenColorHex =
      safeColorVariants.find((v) => v.name === chosenColor)?.hexCode || null;
    const chosenVariantImage =
      safeColorVariants.find((v) => v.name === chosenColor)?.image || null;
    const chargeLabel = currentChargeOption?.value || currentChargeOption?.valueAr || null;
    addToCart({ ...product, id: resolvedProductId ?? (product as any).id }, {
      customId: String(resolvedCartId),
      color: chosenColor,
      variantColorHex: chosenColorHex,
      variantImage: chosenVariantImage,
      chargeOptionId: selectedChargeOption,
      chargeOptionLabel: chargeLabel,
    });
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
  };

  const handleColorHover = (colorName: string | null) => {
    setHoveredColor(colorName);
  };

  const parseNumericPrice = (value: unknown): number => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, "").trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const selectedSourcePrice = currentChargeOption
    ? parseNumericPrice(currentChargeOption.price)
    : parseNumericPrice(
        typeof product.basePrice === "number" ? product.basePrice : product.price,
      );
  const offerPricing = getOfferPricing(product as any, {
    sourcePrice: selectedSourcePrice,
  });
  const currentPriceNum = offerPricing.currentPrice;
  const oldPriceNum = offerPricing.originalPrice;
  const hasOldPrice = offerPricing.hasDiscount;
  const hasDiscount = offerPricing.hasDiscount;

  const displayPrice = currentChargeOption
    ? currentPriceNum.toLocaleString("en-US")
    : currentPriceNum.toLocaleString("en-US");
  const handleNavigate = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${productRef || resolvedProductId || product.id || ""}`, { state: { product } });
    }
  };

  return (
    <div className="h-full relative">
      {topBadge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          {topBadge}
        </div>
      )}
      <div
        className={`bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-visible flex flex-col h-full ${
          isHovered
            ? "border-[#009FE3]/40 scale-[1.02] shadow-2xl z-50"
            : "border-gray-100"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transformOrigin: "center",
          position: "relative",
        }}
      >
        <div className="relative cursor-pointer flex-shrink-0" onClick={handleNavigate}>
          {(() => {
            const badgeSide = language === "ar" ? "right-4" : "left-4";
            const compareSide = badgeSide === "right-4" ? "left-4" : "right-4";
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("[ProductCard] compare button click", {
                    id: resolvedProductId ?? product.id,
                    toggleCompareType: typeof toggleCompare,
                    toggleCompareExists: !!toggleCompare,
                  });
                  try {
                    if (toggleCompare && productRef) {
                      toggleCompare(productRef);
                    } else {
                      console.warn(
                        "[ProductCard] compare unavailable for product",
                        resolvedProductId ?? product.id,
                      );
                    }
                  } catch (err) {
                    console.error("[ProductCard] toggleCompare threw", err);
                  }
                }}
                className={`absolute top-4 ${compareSide} z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md ${
                  isCompared
                    ? "bg-[#009FE3] text-white scale-110"
                    : "bg-white/95 text-gray-700 hover:bg-[#009FE3] hover:text-white"
                }`}
                title={language === "ar" ? "مقارنة" : "Compare"}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </button>
            );
          })()}

          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative">
              <ImageWithFallback
                src={currentImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
              />
            </div>
            {badgeText && (
              <div
                className={`absolute top-4 ${language === "ar" ? "right-4" : "left-4"} z-10 px-2 py-1 rounded-md font-bold text-white flex items-center gap-1 text-xs shadow-md ${badgeVariant}`}
                style={badgeStyle}
              >
                {product.isMostSold ? (
                  <TrendingUp className="w-3 h-3" />
                ) : product.isNew ? (
                  <Tag className="w-3 h-3" />
                ) : product.isHot ? (
                  <Flame className="w-3 h-3" />
                ) : null}
                <span>{badgeText}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 flex flex-col flex-1 justify-between">
          <h3
            className={`font-bold text-gray-900 mb-2 text-sm cursor-pointer hover:text-[#009FE3] transition-colors line-clamp-2 min-h-[2.8rem] ${
              language === "ar" ? "text-right" : "text-left"
            }`}
            onClick={handleNavigate}
          >
            {product.name}
          </h3>
          {hasColors && (
            <div>
              <ColorSwatch
                variants={safeColorVariants}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                onColorHover={handleColorHover}
                language={language}
                size="sm"
                maxVisible={5}
              />
            </div>
          )}
          {hasChargeOptions && (
            <div>
              <ChargeOptionSlider
                options={safeChargeOptions}
                selectedId={selectedChargeOption || ""}
                onSelect={setSelectedChargeOption}
                language={language}
              />
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div
              className={`flex items-center ${hasDiscount ? "justify-between" : "justify-start"}`}
            >
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-[#009FE3] text-xl">
                    {displayPrice}
                  </span>
                  <span className="text-xs text-gray-500">$</span>
                </div>

                {hasOldPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    {oldPriceNum.toLocaleString("en-US")} $
                  </div>
                )}
              </div>

              {hasDiscount && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                  -
                  {Math.round(((oldPriceNum - currentPriceNum) / oldPriceNum) * 100)}
                  %
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {language === "ar" ? "أضف للسلة" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
