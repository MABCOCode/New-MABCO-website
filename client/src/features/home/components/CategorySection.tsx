// components/CategorySection.tsx
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { iconsMap } from '../../../utils/iconMap';
import categoriesData from '../../../testdata/categories.json';

interface CategorySectionProps {
  language: 'ar' | 'en';
  onBrandClick?: (brandName: string, categoryName: string, categoryNameEn: string) => void;
  selectedCategory?: number | null;
  onSelectCategory?: (index: number | null) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  language, 
  onBrandClick,
  selectedCategory = null,
  onSelectCategory 
}) => {
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Process categories data
  const categories = categoriesData.map((c: any) => ({
    ...c,
    icon: iconsMap[c.iconName] || ChevronUp,
  }));

  // Handle swipe/drag for categories carousel
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!categoriesScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoriesScrollRef.current.offsetLeft);
    setScrollLeft(categoriesScrollRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!categoriesScrollRef.current) return;
    setIsDragging(true);
    setStartX(
      e.touches[0].pageX -
      categoriesScrollRef.current.offsetLeft,
    );
    setScrollLeft(categoriesScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !categoriesScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !categoriesScrollRef.current) return;
    const x =
      e.touches[0].pageX -
      categoriesScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 300;
      categoriesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const selectCategory = (index: number) => {
    if (onSelectCategory) {
      onSelectCategory(selectedCategory === index ? null : index);
    }
  };

  return (
    <div className="w-full">
      {/* Categories Carousel */}
      <div className="relative mb-8 w-full">
        {/* Left Scroll Button */}
        <button
          onClick={() => scrollCategories('left')}
          className={`absolute ${language === 'ar' ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-2xl border-2 border-gray-300 hover:border-[#009FE3] rounded-full p-2 transition-all duration-200`}
        >
          {language === 'ar' ? (
            <ChevronRight className="w-5 h-5 text-gray-700" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          )}
        </button>

        {/* Categories Container */}
        <div
          ref={categoriesScrollRef}
          className="flex overflow-x-auto gap-4 px-4 scroll-smooth scrollbar-hide select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === index;
            
            return (
              <div
                key={index}
                onClick={() => selectCategory(index)}
                className={`flex-shrink-0 w-32 sm:w-36 md:w-40 bg-white rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer ${
                  isSelected
                    ? "border-[#009FE3] bg-blue-50"
                    : "border-gray-100 hover:border-[#009FE3]/30"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 ${
                      isSelected
                        ? "bg-gradient-to-br from-[#009FE3] to-[#007BC7] scale-110"
                        : "bg-gradient-to-br from-[#009FE3] to-[#007BC7]"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3
                    className={`text-xs md:text-sm font-semibold transition-colors ${
                      isSelected
                        ? "text-[#009FE3]"
                        : "text-gray-900"
                    }`}
                  >
                    {language === 'ar' ? category.name : category.nameEn}
                  </h3>
                  {isSelected && (
                    <ChevronUp className="w-5 h-5 text-[#009FE3] mt-2 animate-bounce" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scrollCategories('right')}
          className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-2xl border-2 border-gray-300 hover:border-[#009FE3] rounded-full p-2 transition-all duration-200`}
        >
          {language === 'ar' ? (
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Brands Section - Toggle visibility */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          selectedCategory !== null
            ? "max-h-[2000px] opacity-100 mt-8"
            : "max-h-0 opacity-0"
        }`}
      >
        {selectedCategory !== null && (
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-[#009FE3]/20">
            <div className="flex items-center justify-center mb-6 relative">
              <h3 className="text-2xl md:text-3xl font-bold text-[#009FE3] text-center">
                {language === 'ar'
                  ? categories[selectedCategory].name
                  : categories[selectedCategory].nameEn}
              </h3>
              {onSelectCategory && (
                <button
                  onClick={() => onSelectCategory(null)}
                  className="absolute right-0 text-gray-500 hover:text-[#009FE3] transition-colors"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 w-full max-w-7xl">
                {categories[selectedCategory].brands && categories[selectedCategory].brands.length > 0 ? (
                  categories[selectedCategory].brands.map(
                    (brand: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-5 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#009FE3]/30 cursor-pointer group"
                        onClick={() => {
                          if (onBrandClick) {
                            onBrandClick(
                              // `brand` here is a string in testdata, pass it directly
                              brand,
                              categories[selectedCategory].name,
                              categories[selectedCategory].nameEn
                            );
                          }
                        }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center mb-4 p-6 md:p-8 group-hover:bg-gray-100 transition-colors">
                            <img
                              src={brand.image || "https://via.placeholder.com/150"}
                              alt={`${brand.name} Logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <h4 className="text-gray-900 mb-1.5 text-base md:text-lg">
                            {brand.name}
                          </h4>
                          {brand.englishName && (
                            <p className="text-sm text-gray-500 mb-2">
                              {brand.englishName}
                            </p>
                          )}
                          {brand.description && (
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                              {brand.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {language === 'ar'
                      ? "لا توجد علامات تجارية متاحة حالياً"
                      : "No brands available at the moment"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;