import { Check } from "lucide-react";
import { useState } from "react";

interface ColorVariant {
  name: string;
  nameAr: string;
  hexCode: string;
  image: string;
  stock: number;
}

interface ColorSwatchProps {
  variants: ColorVariant[];
  selectedColor: string;
  onColorChange: (colorName: string) => void;
  onColorHover?: (colorName: string | null) => void;
  language: "ar" | "en";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  maxVisible?: number;
}

export function ColorSwatch({
  variants,
  selectedColor,
  onColorChange,
  onColorHover,
  language,
  size = "md",
  showLabel = false,
  maxVisible = 5,
}: ColorSwatchProps) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredColorName, setHoveredColorName] = useState<string | null>(null);
  
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const visibleVariants = showAll ? variants : variants.slice(0, maxVisible);
  const hasMore = variants.length > maxVisible;

  const handleMouseEnter = (colorName: string) => {
    setHoveredColorName(colorName);
    onColorHover?.(colorName);
  };

  const handleMouseLeave = () => {
    setHoveredColorName(null);
    onColorHover?.(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {showLabel && (
        <div className="text-sm font-medium text-gray-700">
          {language === "ar" ? "اللون" : "Color"}:{" "}
          <span className="text-gray-900">
            {variants.find((v) => v.name === selectedColor)?.[
              language === "ar" ? "nameAr" : "name"
            ] || selectedColor}
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2 flex-wrap">
        {visibleVariants.map((variant) => {
          const isSelected = variant.name === selectedColor;
          const isOutOfStock = variant.stock === 0;
          const isHovered = hoveredColorName === variant.name;

          return (
            <div
              key={variant.name}
              className="relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation to product details
                  if (!isOutOfStock) onColorChange(variant.name);
                }}
                disabled={isOutOfStock}
                className={`${sizeClasses[size]} rounded-full border-2 transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? "border-[#009FE3] ring-2 ring-[#009FE3]/30 scale-110"
                    : "border-gray-300 hover:border-gray-400 hover:scale-105"
                } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                style={{ backgroundColor: variant.hexCode }}
                aria-label={`${language === "ar" ? "اختر اللون" : "Select color"} ${variant[language === "ar" ? "nameAr" : "name"]}`}
                onMouseEnter={() => handleMouseEnter(variant.name)}
                onMouseLeave={handleMouseLeave}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
                
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/60">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[2px] bg-red-500 rotate-45"></div>
                  </div>
                )}
              </button>

              {/* Tooltip - shows only when THIS specific color is hovered */}
              {isHovered && (
                <div className={`absolute ${language === "ar" ? "right-0" : "left-0"} bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none z-10 animate-in fade-in slide-in-from-bottom-1`}>
                  {variant[language === "ar" ? "nameAr" : "name"]}
                  {isOutOfStock && (
                    <span className="text-red-300">
                      {" "}({language === "ar" ? "نفذ من المخزون" : "Out of stock"})
                    </span>
                  )}
                  <div className={`absolute top-full ${language === "ar" ? "right-2" : "left-2"} w-2 h-2 bg-gray-900 rotate-45 -mt-1`}></div>
                </div>
              )}
            </div>
          );
        })}

        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-[#009FE3] hover:text-[#007BC7] font-medium transition-colors duration-200 flex items-center gap-1"
          >
            +{variants.length - maxVisible}{" "}
            {language === "ar" ? "المزيد" : "more"}
          </button>
        )}

        {showAll && hasMore && (
          <button
            onClick={() => setShowAll(false)}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
          >
            {language === "ar" ? "إخفاء" : "Show less"}
          </button>
        )}
      </div>
    </div>
  );
}