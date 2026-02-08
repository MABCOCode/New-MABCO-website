import React from "react";
import { Star, ShoppingCart, Tag, Flame, CreditCard } from "lucide-react";
import { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorSwatch } from "./ColorSwatch";
import { ChargeOptionSlider } from "./ChargeOptionSlider";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export interface ProductCardProps {
  product: Product;
  toggleCompare: (productId: number) => void;
  compareItems: number[];
  language: "ar" | "en";
  onQuickView?: () => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  toggleCompare,
  compareItems,
  language,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(
    product.colorVariants?.[0]?.name || "",
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(
    product.chargeOptions?.[0]?.id || null,
  );
  const [isHovered, setIsHovered] = useState(false);

  // Use hovered color if available, otherwise use selected color
  const displayColor = hoveredColor || selectedColor;
  const currentImage =
    product.colorVariants?.find((v) => v.name === displayColor)?.image ||
    product.image;

  const hasColors = product.colorVariants && product.colorVariants.length > 0;
  const hasChargeOptions =
    product.chargeOptions && product.chargeOptions.length > 0;

  // Robust compare match: support string or number ids
  const isCompared = Array.isArray(compareItems)
    ? compareItems.some((id) => String(id) === String(product.id))
    : false;

  const currentChargeOption = product.chargeOptions?.find(
    (opt) => opt.id === selectedChargeOption,
  );

  const handleAddToCart = () => {
    const chosenColor = hasColors ? selectedColor : undefined;
    const chosenColorHex = product.colorVariants?.find((v) => v.name === chosenColor)?.hexCode || null;
    const chosenVariantImage = product.colorVariants?.find((v) => v.name === chosenColor)?.image || null;
    const chargeLabel = currentChargeOption?.value || currentChargeOption?.valueAr || null;
    addToCart(product, {
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

  const displayPrice = currentChargeOption
    ? currentChargeOption.price.toLocaleString("en-US")
    : typeof product.basePrice === "number"
    ? product.basePrice.toLocaleString("en-US")
    : product.price;
  return (
    <div className="h-full relative">
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
        <div className="relative cursor-pointer flex-shrink-0" onClick={() => navigate(`/product/${product.id}`, { state: { product } })}>
          {(() => {
            const badgeSide = language === "ar" ? "right-4" : "left-4";
            const compareSide = badgeSide === "right-4" ? "left-4" : "right-4";
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("[ProductCard] compare button click", {
                    id: product.id,
                    toggleCompareType: typeof toggleCompare,
                    toggleCompareExists: !!toggleCompare,
                  });
                  try {
                    if (toggleCompare) {
                      toggleCompare(product.id);
                    } else {
                      console.warn(
                        "[ProductCard] toggleCompare is undefined for product",
                        product.id,
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

            {product.rating && (
              <div
                className={`absolute bottom-4 ${language === "ar" ? "left-4" : "right-4"} z-10`}
              >
                <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-md px-2 py-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">
                    {product.rating}
                  </span>
                </div>
              </div>
            )}

            {hasChargeOptions ? (
              <div
                className={`absolute top-4 ${language === "ar" ? "right-4" : "left-4"} z-10`}
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-2">
                  <CreditCard className="w-3 h-3" />
                  <span>{language === "ar" ? "حساب" : "Account"}</span>
                </div>
              </div>
            ) : product.badge ? (
              (() => {
                // Localize some common badge tokens if needed
                let badgeText = product.badge;
                const badgeLower = String(product.badge).toLowerCase();
                if (language === "ar") {
                  if (badgeLower === "new" || badgeLower === "جديد")
                    badgeText = "جديد";
                  else if (badgeLower === "hot" || badgeLower === "حار")
                    badgeText = "حار";
                } else {
                  if (badgeLower === "جديد" || badgeLower === "new")
                    badgeText = "NEW";
                  else if (badgeLower === "حار" || badgeLower === "hot")
                    badgeText = "HOT";
                }

                return (
                  <div
                    className={`absolute top-4 ${language === "ar" ? "right-4" : "left-4"} px-2 py-1 rounded-md font-bold text-white flex items-center gap-1 text-xs ${
                      product.isNew ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {product.isNew && <Tag className="w-3 h-3" />}
                    {product.isHot && <Flame className="w-3 h-3" />}
                    <span>{badgeText}</span>
                  </div>
                );
              })()
            ) : null}
          </div>
        </div>

        <div className="p-3 flex flex-col flex-1 justify-between">
          <h3
            className={`font-bold text-gray-900 mb-2 text-sm cursor-pointer hover:text-[#009FE3] transition-colors line-clamp-2 min-h-[2.8rem] ${
              language === "ar" ? "text-right" : "text-left"
            }`}
            onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
          >
            {product.name}
          </h3>
          {hasColors && (
            <div>
              <ColorSwatch
                variants={product.colorVariants!}
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
                options={product.chargeOptions!}
                selectedId={selectedChargeOption || ""}
                onSelect={setSelectedChargeOption}
                language={language}
              />
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div
              className={`flex items-center ${product.oldPrice ? "justify-between" : "justify-start"}`}
            >
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-[#009FE3] text-xl">
                    {displayPrice}
                  </span>
                  <span className="text-xs text-gray-500">$</span>
                </div>

                {product.oldPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    {product.oldPrice} $
                  </div>
                )}
              </div>

              {product.oldPrice && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                  -
                  {Math.round(
                    ((parseFloat(product.oldPrice.replace(/,/g, "")) -
                      parseFloat(product.price.replace(/,/g, ""))) /
                      parseFloat(product.oldPrice.replace(/,/g, ""))) *
                      100,
                  )}
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
