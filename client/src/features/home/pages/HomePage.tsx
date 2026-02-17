// features/home/pages/HomePage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import HeroCarousel from "../components/HeroCarousel";
import SearchSection from "../components/SearchSection";
import SpecialOffers from "../components/OffersSlider";
import CategorySection from "../components/CategorySection";
import ProductsSlider from "../components/ProductsSlider";
import { productsBySection } from "../../../data/products";
import { Star, Flame } from 'lucide-react';
import BrandShowcase from "../components/BrandShowcase";
import ServicesSection from "../components/ServicesSection";
import CompanyStrength from "../components/CompanyStrength";
import WarrantySection from "../components/WarrantySection";
import SEOSection from "../components/SEOSection";
import { useCompareStore } from "../../../features/compare/state";
import { useCart } from "../../../context/CartContext";
import { OfferTypeSlider } from "../components/OfferTypeSlider";
import { ServicesGrid } from "../components/ServicesGrid";
import { PrintingService } from "../components/PrintingService";
import { EPaymentService } from "../components/EPaymentService";
import { WarrantyCheckService } from "../components/WarrantyCheckService";
import { MaintenanceStatusService } from "../components/MaintenanceStatusService";

const HomePage: React.FC = () => {
  const { t, language, navigateToSection } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const openCategoryCode = new URLSearchParams(location.search).get('openCategory');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const compareItems = useCompareStore((s: any) => s.items) as number[];
  const toggleCompareStore = useCompareStore((s: any) => s.toggleCompare) as (id: number) => void;
  const { addToCart, openCart, closeCart, updateQuantity: cartUpdateQuantity, removeFromCart: cartRemoveFromCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderConfirmationOpen, setOrderConfirmationOpen] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState<any>(null);
  const [compareAnimation, setCompareAnimation] = useState(false);
  const [compareAnimationCount, setCompareAnimationCount] = useState(0);
  const navigateToOfferType = (
    offerType: "direct_discount" | "coupon" | "free_product" | "bundle_discount"
  ) => {
    navigate(`/offers/${offerType}`);
  };
  // Add resize/zoom detection state
  const [refreshKey, setRefreshKey] = useState(0);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Handle hash navigation when page loads
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  // Effect to handle window resize and zoom for re-rendering
  useEffect(() => {
    let lastZoomLevel = window.devicePixelRatio;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const handleResize = () => {
      const currentZoomLevel = window.devicePixelRatio;
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Check if zoom level changed significantly (more than 0.1)
      const zoomChanged = Math.abs(currentZoomLevel - lastZoomLevel) > 0.1;
      
      // Check if window size changed significantly (more than 50px)
      const sizeChanged = 
        Math.abs(currentWidth - lastWidth) > 50 || 
        Math.abs(currentHeight - lastHeight) > 50;

      if (zoomChanged || sizeChanged) {
        console.log(`[HomePage] Recalculating due to:`, {
          zoomChanged,
          sizeChanged,
          oldZoom: lastZoomLevel,
          newZoom: currentZoomLevel,
          oldWidth: lastWidth,
          newWidth: currentWidth,
          oldHeight: lastHeight,
          newHeight: currentHeight
        });

        // Update last values
        lastZoomLevel = currentZoomLevel;
        lastWidth = currentWidth;
        lastHeight = currentHeight;

        // Force refresh of components
        setRefreshKey(prev => prev + 1);
        
        // Clear existing timeout
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }

        // Set a new timeout to update after a short delay
        resizeTimeoutRef.current = setTimeout(() => {
          // Force a state update to trigger re-render of child components
          setRefreshKey(prev => prev + 0.0001); // Small change to trigger re-render
        }, 150);
      }
    };

    // Add window resize event listener
    window.addEventListener('resize', handleResize);
    
    // Also listen for orientation changes on mobile devices
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 200);
    });

    // Initial check after a short delay to ensure all components are mounted
    const initialTimeout = setTimeout(() => {
      handleResize();
    }, 500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, []);

  const handleBrandClick = (
    brandName: string,
    categoryName: string,
    categoryNameEn: string,
  ) => {
    console.log("Brand clicked:", brandName, categoryName);
    const categoryForRoute = categoryNameEn || categoryName || '';
    const encodedCategory = encodeURIComponent(categoryForRoute);
    const encodedBrand = encodeURIComponent(brandName);
    navigate(`/brand/${encodedCategory}/${encodedBrand}`);
  };

  const handleProductClick = (product: any) => {
    console.log("Product clicked:", product);
    // Implement product detail page navigation
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    openCart();
  };

  const handleToggleCompare = (productId: number) => {
    const isAdding = !compareItems.includes(productId);
    console.log('[HomePage] handleToggleCompare -> toggleCompareStore', { productId, isAdding });
    toggleCompareStore(productId);

    // Show animation when adding a product
    if (isAdding) {
      setCompareAnimation(true);
      setCompareAnimationCount((p) => p + 1);
      setTimeout(() => {
        setCompareAnimation(false);
      }, 2000);
    }
  };

  const [selectedService, setSelectedService] = useState<string | null>(null);


  const updateCartQuantity = (id: number, quantity: number) => {
    cartUpdateQuantity(id, quantity);
  };

  const removeFromCart = (id: number) => {
    cartRemoveFromCart(id);
  };

  const handleProceedToCheckout = () => {
    closeCart();
    setCheckoutOpen(true);
  };

  const handleConfirmOrder = (orderData: any) => {
    setConfirmedOrderData(orderData);
    setCheckoutOpen(false);
    setOrderConfirmationOpen(true);

    // Clearing cart is handled by CartContext consumer if needed; not done here
  };

  const handleCloseOrderConfirmation = () => {
    setOrderConfirmationOpen(false);
    setConfirmedOrderData(null);
  };

  return (
    <>
      <main 
        dir={language === "ar" ? "rtl" : "ltr"} 
        className="pb-12"
        key={`homepage-${refreshKey}`}
      >
        {/* Hidden H1 for SEO */}
        <h1 className="sr-only">
          {language === "ar"
            ? "متجر MABCO الإلكتروني - أكبر متجر للأجهزة الإلكترونية في سوريا"
            : "MABCO Online Store - Largest Electronics Store in Syria"}
        </h1>

        {/* Hero Carousel */}
        <section id="home" className="relative">
          <HeroCarousel language={language} key={`hero-${refreshKey}`} />
        </section>

        {/* Search Section */}
        <section id="search-section" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <SearchSection language={language} key={`search-${refreshKey}`} />
          </div>
        </section>
        {/* Categories Section */}
        <section id="categories" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            {t("productCategories") || "Product Categories"}
          </h2>
          <CategorySection
            language={language}
            onBrandClick={handleBrandClick}
            selectedCategory={selectedCategory}
            selectedCategoryCode={openCategoryCode}
            onSelectCategory={setSelectedCategory}
            key={`category-${refreshKey}`}
          />
        </section>
        {/* Special Offers Slider */}
       <section id="special-offers-carousel" className="special-offers-carousel container mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            {t("specialOffers") || "Special Offers"}
          </h2>
          <OfferTypeSlider
            language={language}
            onOfferTypeClick={(offerType) => {
              navigateToOfferType(offerType as any);
            }}
          />
        </section>
        {/* Most Bought Products */}
        <ProductsSlider
          language={language}
          
          title={t("mostSold") || "Most Sold"}
          icon={
            <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 fill-yellow-500" />
          }
          products={productsBySection.mostBought.map((product) => ({
            ...product,
            isMostSold: true,
          }))}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onToggleCompare={handleToggleCompare}
          compareItems={compareItems}
          key={`most-bought-${refreshKey}`}
        />

        {/* New Products Slider */}
        <ProductsSlider
          language={language}
          title={t("newProducts") || "New Products"}
          icon={<Flame className="w-6 h-6 md:w-8 md:h-8 text-red-500" />}
          products={productsBySection.newProducts}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onToggleCompare={handleToggleCompare}
          compareItems={compareItems}
          key={`new-products-${refreshKey}`}
        />

        {/* Services Section */}
        <section id="services" className="container mx-auto px-4 py-16">
          <ServicesGrid
            language={language}
            key={`services-${refreshKey}`}
            onServiceClick={(servicePath: string) => {
              setSelectedService(servicePath);
            }}
          />
        </section>

        {/* Service Modals */}
        {selectedService === "printing" && (
          <PrintingService
            language={language}
            onClose={() => setSelectedService(null)}
            onAddToCart={(item: any) => {
              handleAddToCart(item);
              setSelectedService(null);
            }}
          />
        )}
        {selectedService === "epayment" && (
          <EPaymentService language={language} onClose={() => setSelectedService(null)} />
        )}
        {selectedService === "warranty" && (
          <WarrantyCheckService language={language} onClose={() => setSelectedService(null)} />
        )}
        {selectedService === "maintenance-status" && (
          <MaintenanceStatusService language={language} onClose={() => setSelectedService(null)} />
        )}

        {/* Company Strength Section */}
        <CompanyStrength language={language} key={`strength-${refreshKey}`} />

        {/* Warranty & Policy Section */}
        <WarrantySection language={language} key={`warranty-${refreshKey}`} />

        {/* SEO Structured Data */}
        <SEOSection language={language} key={`seo-${refreshKey}`} />

        {/* Geometric Background Pattern */}
        <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-[#009FE3] rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-[#009FE3]/10 rounded-full"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border-2 border-[#009FE3] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-[#009FE3] rotate-12"></div>
        </div>

        {/* Floating Social Media Icons */}
        <div
          className={`fixed ${language === "ar" ? "left-4" : "right-4"} bottom-4 md:bottom-24 z-40 flex md:flex-col flex-row gap-2 md:gap-3`}
        >
          {/* Facebook */}
          <a
            href="https://www.facebook.com/mabco"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-[#1877F2] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-xl group relative"
            aria-label="Facebook"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/963123456"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-xl group relative"
            aria-label="WhatsApp"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.884 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
            </svg>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/mabco"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-[#0088cc] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-xl group relative"
            aria-label="Telegram"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/mabco"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-xl group relative"
            aria-label="Instagram"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>

        {/* floating compare moved to global layout */}

        {/* Compare Animation Notification */}
        {compareAnimation && (
          <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
            <div className="animate-bounce">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in">
                <svg
                  className="w-10 h-10"
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
                <div>
                  <div className="text-lg font-bold">
                    {language === "ar"
                      ? "تمت الإضافة للمقارنة"
                      : "Added to Compare"}
                  </div>
                  <div className="text-sm opacity-90">
                    {compareItems.length}{" "}
                    {language === "ar" ? "منتجات للمقارنة" : "items to compare"}
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {compareItems.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default HomePage;
