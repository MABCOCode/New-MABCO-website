import React from "react";
import { ShoppingCart, Tag, Flame, TrendingUp, Ticket, Gift, Package } from "lucide-react";
import { Product } from "../../../types/product";
import { useCart } from "../../../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorSwatch } from "../../../components/ui/ColorSwatch";
import { ChargeOptionSlider } from "../../../components/ui/ChargeOptionSlider";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { getProductRef } from "../../../utils/entityRefs";
import { getOfferPricing, getOfferBadgeText } from "../../../data/products";

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
    resolveNumericId((product as any).stk_code);
  const productRef = getProductRef(product);
  const resolvedCartId = productRef || resolvedProductId || `product-${product.name}`;
  const parseNumericPrice = (value: unknown): number => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, "").trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const safeColorVariants = React.useMemo(
    () => (Array.isArray(product.colorVariants) ? product.colorVariants : []),
    [product.colorVariants],
  );
  const normalizeHex = (value: string | undefined) => {
    if (!value) return "#999999";
    const raw = value.trim();
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
    return "#999999";
  };
  const normalizedColorVariants = React.useMemo(
    () =>
      safeColorVariants.map((variant: any) => {
        const images = Array.isArray(variant.images)
          ? variant.images
              .map((img: any) => (typeof img === "string" ? img : img?.image_link || img?.url || ""))
              .filter(Boolean)
          : [];
        const image = variant.image || images[0] || "";
        const name = variant.name || variant.color_name || "";
        const nameAr = variant.nameAr || variant.color_name_ar || name;
        const hexCode = normalizeHex(variant.hexCode || variant.color_hex || variant.hex);
        const inStock =
          typeof variant.inStock === "boolean"
            ? variant.inStock
            : typeof variant.in_stock === "boolean"
              ? variant.in_stock
              : typeof variant.isAvailable === "boolean"
                ? variant.isAvailable
                : typeof variant.is_available === "boolean"
                  ? variant.is_available
                  : undefined;
        const isAvailable =
          typeof variant.isAvailable === "boolean"
            ? variant.isAvailable
            : typeof variant.is_available === "boolean"
              ? variant.is_available
              : typeof variant.active === "boolean"
                ? variant.active
                : undefined;
        return {
          ...variant,
          name,
          nameAr,
          hexCode,
          image,
          images,
          price: typeof variant.price === "number" ? variant.price : Number(variant.price),
          inStock,
          isAvailable,
        };
      }),
    [safeColorVariants],
  );
  const visibleColorVariants = React.useMemo(
    () =>
      normalizedColorVariants
        .filter(
          (variant: any) =>
            variant.inStock !== false &&
            variant.isAvailable !== false &&
            (typeof variant.active !== "boolean" || variant.active) &&
            Boolean(String(variant.name || variant.nameAr || "").trim()) &&
            Boolean(String(variant.image || (variant.images && variant.images[0]) || "").trim()),
        )
        .sort((a: any, b: any) => {
          const aHasOffers = Array.isArray(a?.offers) && a.offers.length > 0 ? 1 : 0;
          const bHasOffers = Array.isArray(b?.offers) && b.offers.length > 0 ? 1 : 0;
          return bHasOffers - aHasOffers;
        }),
    [normalizedColorVariants],
  );
  const safeChargeOptions = React.useMemo(
    () => (Array.isArray(product.chargeOptions) ? product.chargeOptions : []),
    [product.chargeOptions],
  );
  const normalizedChargeOptions = React.useMemo(
    () =>
      safeChargeOptions
        .map((opt: any, index: number) => ({
          ...opt,
          id: String(opt.id ?? opt.stk_code ?? opt.code ?? index),
          value: opt.value ?? opt.name ?? "",
          valueAr: opt.valueAr ?? opt.name_ar ?? opt.nameAr ?? opt.value ?? opt.name ?? "",
          price: typeof opt.price === "number" ? opt.price : Number(opt.price),
        }))
        .filter(
          (opt: any) =>
            (typeof opt.active !== "boolean" || opt.active) &&
            (typeof opt.in_stock !== "boolean" || opt.in_stock) &&
            Boolean(String(opt.value || opt.valueAr || opt.name || opt.name_ar || "").trim()),
        )
        .sort((a: any, b: any) => {
          const aPrice = Number.isFinite(a.price) ? a.price : Number.MAX_SAFE_INTEGER;
          const bPrice = Number.isFinite(b.price) ? b.price : Number.MAX_SAFE_INTEGER;
          return aPrice - bPrice;
        }),
    [safeChargeOptions],
  );
  const [selectedColor, setSelectedColor] = useState(
    visibleColorVariants[0]?.name || "",
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(
    normalizedChargeOptions[0]?.id || null,
  );
  const [isHovered, setIsHovered] = useState(false);

  // Use hovered color if available, otherwise use selected color
  const displayColor = hoveredColor || selectedColor;
  const currentColorVariant = visibleColorVariants.find((v) => v.name === displayColor) || null;
  const currentImage = currentColorVariant?.image || product.image;

  const hasColors = visibleColorVariants.length > 0;
  const hasChargeOptions = normalizedChargeOptions.length > 0;
  const hasAnyVariants = safeColorVariants.length > 0 || safeChargeOptions.length > 0;
  const hasValidVariants = hasColors || hasChargeOptions;
  const hasValidImage =
    Boolean(String(product.image || "").trim()) ||
    visibleColorVariants.length > 0;
  const hasValidName = Boolean(String(product.name || "").trim());
  const hasSpecs = Array.isArray((product as any).specs) && (product as any).specs.length > 0;
  const hasDescription = Boolean(String((product as any).description || (product as any).descriptionAr || "").trim());
  const hasDetails = hasSpecs || hasDescription;
  const hasDetailsFields =
    Object.prototype.hasOwnProperty.call(product as any, "specs") ||
    Object.prototype.hasOwnProperty.call(product as any, "description") ||
    Object.prototype.hasOwnProperty.call(product as any, "descriptionAr");
  if (hasAnyVariants && !hasValidVariants) return null;
  if (!hasValidImage || !hasValidName) return null;
  if (hasDetailsFields && !hasDetails) return null;

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

  const currentChargeOption = normalizedChargeOptions.find(
    (opt) => opt.id === selectedChargeOption,
  );

  const handleAddToCart = () => {
    const chosenColor = hasColors ? selectedColor : undefined;
    const chosenVariant = visibleColorVariants.find((v) => v.name === chosenColor) || null;
    const chosenColorHex = chosenVariant?.hexCode || null;
    const chosenVariantImage = chosenVariant?.image || null;
    const chargeLabel =
      currentChargeOption?.value ||
      currentChargeOption?.valueAr ||
      currentChargeOption?.name ||
      currentChargeOption?.name_ar ||
      null;
    const appliedOffers =
      (currentChargeOption && Array.isArray((currentChargeOption as any).offers) ? (currentChargeOption as any).offers : null) ||
      (chosenVariant && Array.isArray((chosenVariant as any).offers) ? (chosenVariant as any).offers : null) ||
      (Array.isArray((product as any).offers) ? (product as any).offers : null);

    const variantPriceValue =
      chosenVariant && typeof chosenVariant.price !== "undefined"
        ? parseNumericPrice(chosenVariant.price)
        : null;
    const chargePriceValue =
      currentChargeOption && typeof currentChargeOption.price !== "undefined"
        ? parseNumericPrice(currentChargeOption.price)
        : null;
    const basePriceValue =
      typeof chargePriceValue === "number"
        ? chargePriceValue
        : typeof variantPriceValue === "number"
        ? variantPriceValue
        : parseNumericPrice(product.price);

    addToCart({ ...product, id: resolvedProductId ?? (product as any).id }, {
      customId: String(resolvedCartId),
      color: chosenColor,
      variantColorHex: chosenColorHex,
      variantImage: chosenVariantImage,
      variantSku: (chosenVariant as any)?.stk_code ?? null,
      variantPrice: typeof variantPriceValue === "number" ? variantPriceValue : null,
      chargeOptionId: selectedChargeOption,
      chargeOptionLabel: chargeLabel,
      chargeOptionSku: (currentChargeOption as any)?.stk_code ?? null,
      chargeOptionPrice: typeof chargePriceValue === "number" ? chargePriceValue : null,
      basePrice: basePriceValue,
      appliedOffers,
    });
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
  };

  const handleColorHover = (colorName: string | null) => {
    setHoveredColor(colorName);
  };

  React.useEffect(() => {
    if (!hasColors) return;
    const exists = visibleColorVariants.some((v: any) => v.name === selectedColor);
    if (!exists) {
      setSelectedColor(visibleColorVariants[0]?.name || "");
    }
  }, [hasColors, visibleColorVariants, selectedColor]);

  const colorPriceValue = currentColorVariant ? parseNumericPrice(currentColorVariant.price) : 0;
  const selectedSourcePrice = currentChargeOption
    ? parseNumericPrice(currentChargeOption.price)
    : colorPriceValue > 0
    ? colorPriceValue
    : parseNumericPrice(product.price);
  const baseProductPrice = parseNumericPrice(product.price);
  const hasColorPriceDiff = colorPriceValue > 0 && Math.abs(colorPriceValue - baseProductPrice) > 0.0001;
  const combinedOffersSource = React.useMemo(
    () => [
      ...(Array.isArray((product as any).offers) ? (product as any).offers : []),
      ...(Array.isArray(product.colorVariants)
        ? product.colorVariants.flatMap((variant: any) => variant?.offers || [])
        : []),
      ...(Array.isArray(product.chargeOptions)
        ? product.chargeOptions.flatMap((opt: any) => opt?.offers || [])
        : []),
    ],
    [product],
  );
  const offerPricing = getOfferPricing(
    { ...(product as any), offers: combinedOffersSource },
    { sourcePrice: selectedSourcePrice },
  );
  const currentPriceNum = offerPricing.currentPrice;
  const oldPriceNum = offerPricing.originalPrice;
  const hasOldPrice = offerPricing.hasDiscount;
  const hasDiscount = offerPricing.hasDiscount;
  const offerBadgeText = getOfferBadgeText(offerPricing.offers, language);
  const offerBadgeInfo = (() => {
    if (!offerBadgeText) return null;
    const priority = ["direct_discount", "coupon", "free_product", "bundle_discount"] as const;
    const currentOffer =
      offerPricing.offers.find((o: any) => o.type === priority[0]) ||
      offerPricing.offers.find((o: any) => o.type === priority[1]) ||
      offerPricing.offers.find((o: any) => o.type === priority[2]) ||
      offerPricing.offers.find((o: any) => o.type === priority[3]);
    if (!currentOffer) return null;
    const offerType = currentOffer.type;
    switch (offerType) {
      case "direct_discount":
        return { Icon: Tag, gradient: "from-red-500 to-pink-600" };
      case "coupon":
        return { Icon: Ticket, gradient: "from-blue-500 to-indigo-600" };
      case "free_product":
        return { Icon: Gift, gradient: "from-green-500 to-emerald-600" };
      case "bundle_discount":
        return { Icon: Package, gradient: "from-purple-500 to-violet-600" };
      default:
        return null;
    }
  })();
  const offerTopBadge = !topBadge && offerBadgeInfo ? (
    <div
      className={`bg-gradient-to-r ${offerBadgeInfo.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap`}
    >
      <offerBadgeInfo.Icon className="w-4 h-4" />
      <span>{offerBadgeText}</span>
    </div>
  ) : null;

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
      {(topBadge || offerTopBadge) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          {topBadge || offerTopBadge}
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
                  variants={visibleColorVariants}
                  selectedColor={selectedColor}
                  onColorChange={handleColorChange}
                  onColorHover={handleColorHover}
                  language={language}
                  size="sm"
                  maxVisible={5}
                  showPrice={true}
                />
                {colorPriceValue > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {language === "ar" ? "سعر اللون" : "Color price"}:{" "}
                    <span className="font-semibold text-gray-900">
                      {Number(colorPriceValue).toLocaleString("en-US")}
                    </span>
                    {hasColorPriceDiff && (
                      <span className="text-[10px] text-amber-600 ml-2">
                        {language === "ar" ? "مختلف" : "Changed"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          {hasChargeOptions && (
            <div>
              <ChargeOptionSlider
                options={normalizedChargeOptions}
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
                <div className={`mx-3 ${hasOldPrice ?  "":"mb-3" }  flex items-baseline gap-1`}>
                  <span className="font-bold why text-[#009FE3] text-2xl">
                    {displayPrice}
                  </span>
                  <span className="font-bold text-m text-[#000000]">$</span>
                </div>

                {hasOldPrice && (
                  <div className="mx-3 mb-3  text-xs text-gray-400 line-through">
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
