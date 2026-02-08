import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChargeOption {
  id: string;
  value: string;
  valueAr: string;
  price: number;
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
  const [currentIndex, setCurrentIndex] = useState(
    options.findIndex((opt) => opt.id === selectedId) || 0
  );
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = options.findIndex((opt) => opt.id === selectedId);
    if (index !== -1) setCurrentIndex(index);
  }, [selectedId, options]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    setCurrentIndex(newIndex);
    onSelect(options[newIndex].id);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onSelect(options[newIndex].id);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
    onSelect(options[index].id);
  };

  const currentOption = options[currentIndex];

  return (
    <div className="space-y-1.5 w-full  ">
      <div className={`text-l font-medium text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
        {language === "ar" ? "قيمة الشحن:" : "Charge Amount:"}
      </div>
      
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {options.length > 1 && (
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
        {options.length > 1 && (
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
      {options.length > 1 && (
        <div className="flex items-center justify-center gap-1 pt-0.5">
          {options.map((_, index) => (
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