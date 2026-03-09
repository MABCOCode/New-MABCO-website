import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChargeOption {
  id?: string;
  value?: string;
  valueAr?: string;
  name?: string;
  name_ar?: string;
  nameAr?: string;
  stk_code?: string;
  price?: number;
  in_stock?: boolean;
  active?: boolean;
}

interface ChargeOptionSliderProps {
  options: ChargeOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  language: "ar" | "en";
}

export function ChargeOptionSlider({
  options,
  selectedId,
  onSelect,
  language,
}: ChargeOptionSliderProps) {
  const safeOptions = Array.isArray(options) ? options : [];
  const normalizedOptions = safeOptions
    .map((opt, index) => {
      const id = String(
        opt.id ?? opt.stk_code ?? opt.value ?? opt.name ?? index,
      );
      const value = opt.value ?? opt.name ?? "";
      const valueAr = opt.valueAr ?? opt.name_ar ?? opt.nameAr ?? value ?? "";
      return { ...opt, id, value, valueAr };
    })
    .filter((opt) => opt.id);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = normalizedOptions.findIndex((opt) => opt.id === selectedId);
    return index >= 0 ? index : 0;
  });
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = normalizedOptions.findIndex((opt) => opt.id === selectedId);
    if (index >= 0) setCurrentIndex(index);
  }, [selectedId, normalizedOptions]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : normalizedOptions.length - 1;
    setCurrentIndex(newIndex);
    onSelect(normalizedOptions[newIndex].id as string);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex =
      currentIndex < normalizedOptions.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onSelect(normalizedOptions[newIndex].id as string);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
    onSelect(normalizedOptions[index].id as string);
  };

  const currentOption = normalizedOptions[currentIndex];
  if (!currentOption) return null;

  return (
    <div className="space-y-1.5 w-full  ">
      <div className={`text-l font-medium text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
        {language === "ar" ? "قيمة الشحن:" : "Charge Amount:"}
      </div>
      
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {normalizedOptions.length > 1 && (
          <button
            onClick={handlePrev}
            className="p-0.5 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex-shrink-0"
            aria-label={language === "ar" ? "السابق" : "Previous"}
          >
            {language === "ar" ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Current Option Display - Compact */}
        <div
          ref={sliderRef}
          className="flex-1 bg-gradient-to-r from-[#009FE3]/10 to-[#009FE3]/5 border border-[#009FE3]/50 rounded-md px-2 py-1.5 text-center transition-all duration-300"
        >
          <div className="text-xs font-bold text-[#009FE3]">
            {language === "ar" ? currentOption.valueAr : currentOption.value}
          </div>
        </div>

        {/* Next Button */}
        {normalizedOptions.length > 1 && (
          <button
            onClick={handleNext}
            className="p-0.5 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex-shrink-0"
            aria-label={language === "ar" ? "التالي" : "Next"}
          >
            {language === "ar" ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Dots Indicator - Smaller */}
      {normalizedOptions.length > 1 && (
        <div className="flex items-center justify-center gap-1 pt-0.5">
          {normalizedOptions.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-4 h-1 bg-[#009FE3]"
                  : "w-1 h-1 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`${language === "ar" ? "خيار" : "Option"} ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
