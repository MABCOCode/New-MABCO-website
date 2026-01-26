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
  // Default brands data
  const defaultBrands: Brand[] = [
    {
      id: 1,
      name: "سامسونج",
      englishName: "Samsung",
      description: "أجهزة كهربائية ومنزلية متطورة",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png",
      category: "إلكترونيات",
      productsCount: 120
    },
    {
      id: 2,
      name: "أبل",
      englishName: "Apple",
      description: "منتجات تكنولوجيا مبتكرة",
      image: "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png?202203040238",
      category: "هواتف وأجهزة",
      productsCount: 85
    },
    {
      id: 3,
      name: "سوني",
      englishName: "Sony",
      description: "أنظمة صوت وصورة متطورة",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/2560px-Sony_logo.svg.png",
      category: "سماعات وتلفزيونات",
      productsCount: 75
    },
    {
      id: 4,
      name: "شاومي",
      englishName: "Xiaomi",
      description: "أجهزة ذكية بجودة عالية",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/2560px-Xiaomi_logo_%282021-%29.svg.png",
      category: "هواتف وإكسسوارات",
      productsCount: 95
    },
    {
      id: 5,
      name: "هونر",
      englishName: "Honor",
      description: "هواتف ذكية مبتكرة",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Honor_logo.svg/2560px-Honor_logo.svg.png",
      category: "هواتف",
      productsCount: 60
    },
    {
      id: 6,
      name: "إيكوفلو",
      englishName: "EcoFlow",
      description: "حلول طاقة مبتكرة",
      image: "https://www.ecoflow.com/cdn/shop/files/ecoflow_logo_580x.png?v=1677741288",
      category: "طاقة ومولدات",
      productsCount: 40
    },
    {
      id: 7,
      name: "داي",
      englishName: "Deye",
      description: "أنظمة الطاقة الشمسية",
      image: "https://deye.com/wp-content/uploads/2022/03/cropped-Deye-Logo-1.png",
      category: "طاقة شمسية",
      productsCount: 35
    },
    {
      id: 8,
      name: "هواوي",
      englishName: "Huawei",
      description: "تكنولوجيا اتصالات متقدمة",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Huawei_logo_2023.svg/2560px-Huawei_logo_2023.svg.png",
      category: "إلكترونيات",
      productsCount: 110
    }
  ];

  const brands = customBrands || defaultBrands;

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
      const scrollAmount = 400;
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
        className={`flex overflow-x-auto gap-6 px-4 scroll-smooth scrollbar-hide ${centerItems ? 'justify-center' : ''}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex-shrink-0 w-60 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#009FE3]/30 cursor-pointer group"
            onClick={() => {
              if (onBrandClick) {
                onBrandClick(brand.name, brand.category, brand.englishName || brand.name);
              }
            }}
          >
            <div className="flex flex-col items-center text-center">
              {/* Brand Logo */}
              <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 p-4 group-hover:bg-gray-100 transition-colors">
                <img
                  src={brand.image}
                  alt={`${brand.name} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Brand Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? brand.name : brand.englishName || brand.name}
              </h3>
              
              {/* Category */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-3">
                <span className="text-sm font-medium text-[#009FE3]">
                  {brand.category}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {brand.description}
              </p>
              
              {/* Products Count */}
              <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {language === 'ar' ? 'منتج' : 'Products'}
                </span>
                <span className="text-lg font-bold text-[#009FE3]">
                  {brand.productsCount}+
                </span>
              </div>
              
              {/* View Products Button */}
              <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
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