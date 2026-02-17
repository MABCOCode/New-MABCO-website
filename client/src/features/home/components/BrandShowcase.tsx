// components/BrandShowcase.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  englishName?: string;
  description?: string;
  image: string;
  category: string;
  productsCount: number;
}

interface BrandShowcaseProps {
  language: 'ar' | 'en';
  brands?: Brand[];
  onBrandClick?: (brandName: string, categoryName: string, categoryNameEn: string) => void;
}

const BrandShowcase: React.FC<BrandShowcaseProps> = ({ 
  language, 
  brands: customBrands,
  onBrandClick 
}) => {
  const [fetchedBrands, setFetchedBrands] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(!customBrands);

  useEffect(() => {
    let mounted = true;
    if (customBrands) {
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }
    if (!customBrands) {
      (async () => {
        try {
          const res = await fetch('/static/brands.json');
          if (!res.ok) return;
          const json = await res.json();
          if (!mounted) return;
          // normalize to Brand[] shape expected by this component
          const normalized = json.map((b: any, idx: number) => ({
            id: b.brand_code || idx,
            name: b.name,
            englishName: b.englishName || b.name,
            description: b.description || '',
            image: b.image || 'https://via.placeholder.com/150',
            category: b.category || '',
            productsCount: b.productsCount || 0
          }));
          setFetchedBrands(normalized);
        } catch (err) {
          console.warn('Failed to load /static/brands.json', err);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      })();
    }
    return () => { mounted = false; };
  }, [customBrands]);

  const brands = customBrands || fetchedBrands || [];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [centerItems, setCenterItems] = useState(false);

  useEffect(() => {
    const updateCentering = () => {
      const container = containerRef.current;
      if (!container) return;
      // If scrollWidth fits within clientWidth, center the items
      const fits = container.scrollWidth <= container.clientWidth + 1; // small tolerance
      setCenterItems(fits);
    };

    updateCentering();
    window.addEventListener('resize', updateCentering);
    return () => window.removeEventListener('resize', updateCentering);
  }, [brands.length, language]);

  const scrollBrands = (direction: 'left' | 'right') => {
    const container = document.getElementById('brands-container');
    if (container) {
      const scrollAmount = window.innerWidth < 640 ? 240 : 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Left Scroll Button */}
      <button
        onClick={() => scrollBrands('left')}
        className={`absolute ${language === 'ar' ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-2xl border-2 border-gray-300 hover:border-[#009FE3] rounded-full p-2 transition-all duration-200`}
      >
        {language === 'ar' ? (
          <ChevronRight className="w-5 h-5 text-gray-700" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Brands Container */}
      <div
        id="brands-container"
        ref={containerRef}
        className={`flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 scroll-smooth scrollbar-hide ${centerItems ? 'justify-center' : ''}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`brand-showcase-skeleton-${idx}`}
              className="flex-shrink-0 w-32 sm:w-40 md:w-52 bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg border-2 border-gray-100 skeleton-card"
            >
              <div className="w-full h-20 sm:h-24 md:h-28 rounded-2xl shimmer-surface mx-auto mb-2 sm:mb-3 md:mb-4" />
              <div className="h-4 sm:h-5 w-20 sm:w-24 mx-auto mb-3 skeleton-line shimmer-surface" />
              <div className="h-7 w-32 mx-auto mb-3 rounded-full shimmer-surface" />
              <div className="h-4 w-full mb-2 skeleton-line shimmer-surface" />
              <div className="h-4 w-5/6 mb-4 skeleton-line shimmer-surface" />
              <div className="h-9 md:h-10 w-full rounded-lg shimmer-surface" />
            </div>
          ))}
        {!isLoading && brands.map((brand) => (
          <div
            key={brand.id}
            className="flex-shrink-0 w-32 sm:w-40 md:w-52 bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#009FE3]/30 cursor-pointer group"
            onClick={() => {
              if (onBrandClick) {
                onBrandClick(brand.name, brand.category, brand.englishName || brand.name);
              }
            }}
          >
            <div className="flex flex-col items-center text-center">
              {/* Brand Logo */}
              <div className="w-full h-24 sm:h-28 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4 group-hover:bg-gray-100 transition-colors">
                <img
                  src={brand.image}
                  alt={`${brand.name} Logo`}
                  className="w-auto h-auto max-w-full max-h-full object-contain object-center"
                />
              </div>
              
              {/* Brand Name */}
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                {language === 'ar' ? brand.name : brand.englishName || brand.name}
              </h3>
              
              {/* Category */}
              <div className="inline-flex items-center gap-1 sm:gap-2 px-2 md:px-3 py-1 bg-blue-50 rounded-full mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-[#009FE3]">
                  {brand.category}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-2 min-h-[28px] sm:min-h-[34px] md:min-h-[40px]">
                {brand.description}
              </p>
              
              {/* Products Count */}
              <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">
                  {language === 'ar' ? 'منتج' : 'Products'}
                </span>
                <span className="text-base sm:text-lg font-bold text-[#009FE3]">
                  {brand.productsCount}+
                </span>
              </div>
              
              {/* View Products Button */}
              <button className="w-full mt-2 sm:mt-3 md:mt-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-[10px] sm:text-xs md:text-sm">
                {language === 'ar' ? 'عرض المنتجات' : 'View Products'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scrollBrands('right')}
        className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-2xl border-2 border-gray-300 hover:border-[#009FE3] rounded-full p-2 transition-all duration-200`}
      >
        {language === 'ar' ? (
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {[1, 2, 3].map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const container = document.getElementById('brands-container');
              if (container) {
                container.scrollLeft = index * 300;
              }
            }}
            className="w-2 h-2 rounded-full bg-gray-300 hover:bg-[#009FE3] transition-colors"
          />
        ))}
      </div>
    </div>
  );
};

export default BrandShowcase;


