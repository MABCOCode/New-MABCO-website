// components/CategorySection.tsx
import { ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { iconsMap } from '../../../utils/iconMap';
import { loadStaticCatalogData } from '../../../utils/staticCatalogData';

// We'll fetch categories from the public static JSON at runtime. This keeps
// low-change data in static files and avoids bundling large testdata.

interface CategorySectionProps {
  language: 'ar' | 'en';
  onBrandClick?: (brandCode: string, categoryCode: string, categoryNameEn: string) => void;
  selectedCategory?: number | null;
  selectedCategoryCode?: string | null;
  onSelectCategory?: (index: number | null) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  language, 
  onBrandClick,
  selectedCategory = null,
  selectedCategoryCode = null,
  onSelectCategory 
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const brandsPanelRef = useRef<HTMLDivElement>(null);
  const categoryCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const animationTimerRef = useRef<number | null>(null);
  const lastAppliedCategoryCodeRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);
  const pointerCapturedRef = useRef(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [centerItems, setCenterItems] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let mounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const load = async () => {
      try {
        const { categories: categoriesJson, brands: brandsJson } = await loadStaticCatalogData();
        if (!mounted) return;
        const brandsByCode = new Map<string, any>();
        const brandsByName = new Map<string, any>();
        (Array.isArray(brandsJson) ? brandsJson : []).forEach((b: any) => {
          if (b?.brand_code != null) {
            brandsByCode.set(String(b.brand_code), b);
          }
          if (b?.name) {
            brandsByName.set(String(b.name).trim().toLowerCase(), b);
          }
          if (b?.englishName) {
            brandsByName.set(String(b.englishName).trim().toLowerCase(), b);
          }
        });

        const normalizedCategories = (Array.isArray(categoriesJson) ? categoriesJson : []).map((c: any) => {
          const baseBrands = (Array.isArray(c.brands) ? c.brands : []).map((brand: any) => {
            if (typeof brand === 'string') {
              const match = brandsByName.get(brand.trim().toLowerCase());
              return match ? { ...match } : { name: brand };
            }
            const codeMatch = brand?.brand_code != null
              ? brandsByCode.get(String(brand.brand_code))
              : null;
            const nameKey = String(brand?.name || brand?.englishName || '').trim().toLowerCase();
            const nameMatch = nameKey ? brandsByName.get(nameKey) : null;
            return { ...brand, ...(codeMatch || nameMatch || {}) };
          });

          const catCode = String(c?.cat_code || c?.category_code || "");
          const fromCategoryCode = (Array.isArray(brandsJson) ? brandsJson : [])
            .filter((b: any) => String(b?.category_code ?? b?.cat_code ?? "") === catCode)
            .map((b: any) => ({ ...b }));

          const seen = new Set(
            baseBrands
              .map((b: any) => String(b?.brand_code ?? b?.brandCode ?? b?.code ?? b?.name ?? ""))
              .filter(Boolean),
          );
          const mergedBrands = [...baseBrands];
          fromCategoryCode.forEach((b: any) => {
            const key = String(b?.brand_code ?? b?.brandCode ?? b?.code ?? b?.name ?? "");
            if (!key || seen.has(key)) return;
            seen.add(key);
            mergedBrands.push(b);
          });

          return {
            ...c,
            icon: iconsMap[c.iconName] || ChevronUp,
            brands: mergedBrands.sort((a: any, b: any) => {
              const aOrder = Number(a?.order ?? 9999);
              const bOrder = Number(b?.order ?? 9999);
              if (aOrder !== bOrder) return aOrder - bOrder;
              const aName = String(a?.englishName || a?.name || "");
              const bName = String(b?.englishName || b?.name || "");
              return aName.localeCompare(bName);
            }),
          };
        });

        const orderedCategories = normalizedCategories.sort((a: any, b: any) => {
          const aOrder = Number(a?.order ?? 9999);
          const bOrder = Number(b?.order ?? 9999);
          if (aOrder !== bOrder) return aOrder - bOrder;
          const aName = String(a?.nameEn || a?.name || "");
          const bName = String(b?.nameEn || b?.name || "");
          return aName.localeCompare(bName);
        });

        setCategories(orderedCategories);
        setIsLoading(false);
      } catch (e) {
        // Keep shimmer visible and retry on network/timeouts.
        console.warn('Failed to load categories.json', e);
        if (mounted) {
          retryTimer = setTimeout(load, 3000);
        }
      }
    };
    load();
    return () => {
      mounted = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, []);

  const triggerAnimation = () => {
    // Animation removed to prevent lag
  };

  useEffect(() => {
    // Animation removed to prevent lag
  }, [isLoading]);

  useEffect(() => {
    // Animation removed to prevent lag
  }, []);

  // Determine whether items fit within the container and should be centered
  useEffect(() => {
    const updateCentering = () => {
      const container = categoriesScrollRef.current;
      if (!container) return;
      // Add a small tolerance
      const fits = container.scrollWidth <= container.clientWidth + 1;
      setCenterItems(fits);
    };

    updateCentering();
    window.addEventListener('resize', updateCentering);
    return () => window.removeEventListener('resize', updateCentering);
  }, [categories.length]);

  useEffect(() => {
    if (!selectedCategoryCode || !onSelectCategory || categories.length === 0) return;
    if (lastAppliedCategoryCodeRef.current === selectedCategoryCode) return;
    const needle = String(selectedCategoryCode).trim().toLowerCase();
    const categoryIndex = categories.findIndex((cat: any) => {
      const code = String(cat?.cat_code || '').trim().toLowerCase();
      const nameAr = String(cat?.name || '').trim().toLowerCase();
      const nameEn = String(cat?.nameEn || '').trim().toLowerCase();
      return code === needle || nameAr === needle || nameEn === needle;
    });
    if (categoryIndex >= 0 && categoryIndex !== selectedCategory) {
      onSelectCategory(categoryIndex);
      lastAppliedCategoryCodeRef.current = selectedCategoryCode;
      return;
    }
    if (categoryIndex >= 0) {
      lastAppliedCategoryCodeRef.current = selectedCategoryCode;
    }
  }, [categories, onSelectCategory, selectedCategory, selectedCategoryCode]);

  useEffect(() => {
    if (selectedCategory === null) return;

    const activeCategoryCard = categoryCardRefs.current[selectedCategory];
    const container = categoriesScrollRef.current;
    
    if (activeCategoryCard && container) {
      // Manually scroll the container to center the card without affecting page scroll
      const cardRect = activeCategoryCard.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Calculate the offset needed to center the card within the container
      const cardCenterOffset = cardRect.left - containerRect.left + cardRect.width / 2;
      const containerCenterOffset = containerRect.width / 2;
      
      // Calculate the scroll position
      const scrollLeft = container.scrollLeft + (cardCenterOffset - containerCenterOffset);
      
      // Smoothly scroll to the calculated position
      container.scrollTo({
        left: scrollLeft,
        behavior: 'auto'
      });
    }

    const timer = window.setTimeout(() => {
      const target = brandsPanelRef.current ?? sectionRef.current;
      if (!target) return;
      const nav = document.querySelector('nav');
      const navHeight = nav?.getBoundingClientRect().height ?? 0;
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - navHeight - 8,
      );
      window.scrollTo({ top, behavior: 'auto' });
    }, 180);

    return () => window.clearTimeout(timer);
  }, [selectedCategory]);
  
  // `categories` state is loaded from public/static/categories.json

  // Native horizontal scrolling gives smoother sliding on touch devices.

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
    if (dragMovedRef.current) return;
    if (onSelectCategory) {
      onSelectCategory(selectedCategory === index ? null : index);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const container = categoriesScrollRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = container.scrollLeft;
    activePointerIdRef.current = event.pointerId;
    pointerCapturedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const container = categoriesScrollRef.current;
    if (!container) return;
    if (activePointerIdRef.current !== event.pointerId) return;
    const delta = event.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 8) {
      dragMovedRef.current = true;
      if (!pointerCapturedRef.current) {
        container.setPointerCapture?.(event.pointerId);
        pointerCapturedRef.current = true;
      }
      container.scrollLeft = dragStartScrollRef.current - delta;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = categoriesScrollRef.current;
    if (pointerCapturedRef.current && container?.hasPointerCapture?.(event.pointerId)) {
      container.releasePointerCapture?.(event.pointerId);
    }
    pointerCapturedRef.current = false;
    activePointerIdRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  };

  return (
    <div ref={sectionRef} className="w-full">
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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`flex overflow-x-auto gap-4 px-4 scroll-smooth scrollbar-hide select-none snap-x snap-mandatory cursor-grab ${
            isDragging ? "cursor-grabbing" : ""
          } ${centerItems ? 'justify-center' : ''}`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollbarGutter: "stable",
            overflowY: "hidden",
            touchAction: "pan-x",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`category-skeleton-${idx}`}
                className="flex-shrink-0 w-32 sm:w-36 md:w-40 bg-white rounded-lg p-4 md:p-6 shadow-lg border-2 border-gray-100"
              >
                <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg shimmer-surface" />
                  <div className="h-3 md:h-4 w-20 md:w-24 skeleton-line shimmer-surface" />
                </div>
              </div>
            ))}
          {!isLoading && categories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === index;
            
            return (
              <div
                key={index}
                ref={(node) => {
                  categoryCardRefs.current[index] = node;
                }}
                onClick={() => selectCategory(index)}
                className={`flex-shrink-0 w-32 sm:w-36 md:w-40 bg-white rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer snap-start ${
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
                    <ChevronUp className="w-5 h-5 text-[#009FE3] mt-2" />
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
        ref={brandsPanelRef}
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
                  ? (categories[selectedCategory]?.name || '')
                  : (categories[selectedCategory]?.nameEn || '')}
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
              {(() => {
                const brandsList = categories[selectedCategory]?.brands || [];
                if (isLoading) {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 w-full">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={`brand-skeleton-${idx}`} className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-gray-100 skeleton-card">
                          <div className="w-full h-28 sm:h-32 md:h-36 rounded-2xl shimmer-surface mb-4" />
                          <div className="h-4 w-2/3 mx-auto skeleton-line shimmer-surface" />
                        </div>
                      ))}
                    </div>
                  );
                }

                if (!brandsList || brandsList.length === 0) {
                  return (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      {language === 'ar'
                        ? "لا توجد علامات تجارية متاحة حالياً"
                        : "No brands available at the moment"}
                    </div>
                  );
                }

                const hiddenBrandCodes = new Set(["2020", "2022"]);
                const visibleBrands = brandsList.filter((brand: any) => {
                  const code =
                    typeof brand === "string"
                      ? null
                      : brand?.brand_code ?? brand?.brandCode ?? brand?.code;
                  if (!code) return true;
                  return !hiddenBrandCodes.has(String(code));
                });

                if (visibleBrands.length === 0) {
                  return (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      {language === "ar"
                        ? "لا توجد علامات تجارية متاحة حاليا"
                        : "No brands available at the moment"}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-5 w-full">
                    {visibleBrands.map((brand: any, idx: number) => {
                      const brandObj = typeof brand === "string" ? { name: brand } : brand;
                      const isBlueTint = brandObj.uiTint === "blue";
                      return (
                        <div
                          key={brandObj.brand_code || idx}
                          className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#009FE3]/30 cursor-pointer group min-w-0"
                          onClick={() => {
                            if (onBrandClick) {
                              onBrandClick(
                                String(brandObj.brand_code || brandObj.name || ""),
                                String(categories[selectedCategory]?.cat_code || ""),
                                categories[selectedCategory]?.nameEn,
                              );
                            }
                          }}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`w-full h-32 sm:h-36 md:h-40 rounded-2xl flex items-center justify-center mb-3 md:mb-4 p-3 sm:p-4 md:p-6 transition-colors ${
                                isBlueTint
                                  ? ""
                                  : "bg-gray-50 group-hover:bg-gray-100"
                              }`}
                            >
                              <img
                                src={brandObj.image || "https://via.placeholder.com/150"}
                                alt={`${brandObj.name} Logo`}
                                className="w-auto h-auto max-w-full max-h-full object-contain object-center"
                                style={
                                  isBlueTint
                                    ? { display: "none" }
                                    : undefined
                                }
                              />
                              {isBlueTint && (
                                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-[#009FE3] to-[#007BC7]">
                                  <img
                                    src={brandObj.image || "https://via.placeholder.com/150"}
                                    alt={`${brandObj.name} Logo`}
                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain object-center"
                                    style={{ filter: "brightness(0) saturate(100%) invert(100%)" }}
                                  />
                                </div>
                              )}
                            </div>
                            {language === "ar" ? (
                              <h4 className="text-gray-900 mb-1.5 text-xs sm:text-sm md:text-lg break-words">
                                {brandObj.name}
                              </h4>
                            ) : (
                              <h4 className="text-gray-900 mb-1.5 text-xs sm:text-sm md:text-lg break-words">
                                {brandObj.englishName || brandObj.name}
                              </h4>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;
