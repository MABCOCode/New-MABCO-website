// features/home/pages/HomePage.tsx
import { Flame, Star } from 'lucide-react';
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useCompareStore } from "../../../features/compare/state";
import { setSeo } from "../../../services/seo";
import CategorySection from "../components/CategorySection";
import CompanyStrength from "../components/CompanyStrength";
import { EPaymentService } from "../components/EPaymentService";
import HeroCarousel from "../components/HeroCarousel";
import { MaintenanceStatusService } from "../components/MaintenanceStatusService";
import { OfferTypeSlider } from "../components/OfferTypeSlider";
import { PrintingService } from "../components/PrintingService";
import ProductsSlider from "../components/ProductsSlider";
import SearchSection from "../components/SearchSection";
import SEOSection from "../components/SEOSection";
import { ServicesGrid } from "../components/ServicesGrid";
import { WarrantyCheckService } from "../components/WarrantyCheckService";
import WarrantySection from "../components/WarrantySection";

const HomePage: React.FC = () => {
  const { t, language, navigateToSection } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const openCategoryCode = new URLSearchParams(location.search).get('openCategory');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const compareItems = useCompareStore((s: any) => s.items) as string[];
  const toggleCompareStore = useCompareStore((s: any) => s.toggleCompare) as (id: string) => void;
  const { addToCart, openCart, closeCart, updateQuantity: cartUpdateQuantity, removeFromCart: cartRemoveFromCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderConfirmationOpen, setOrderConfirmationOpen] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState<any>(null);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  const [compareAnimation, setCompareAnimation] = useState(false);
  const [compareAnimationCount, setCompareAnimationCount] = useState(0);
  const [mostSoldProducts, setMostSoldProducts] = useState<any[]>([]);
  const [newBestProducts, setNewBestProducts] = useState<any[]>([]);
  const [mostSoldLoading, setMostSoldLoading] = useState(true);
  const [newBestLoading, setNewBestLoading] = useState(true);
  const [productLayoutKey, setProductLayoutKey] = useState(0);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const navigateToOfferType = (
    offerType: "direct_discount" | "coupon" | "free_product" | "bundle_discount"
  ) => {
    navigate(`/offers/${offerType}`);
  };

  // Handle hash navigation when page loads
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const nav = document.querySelector("nav");
          const navHeight = nav?.getBoundingClientRect().height ?? 0;
          const top = Math.max(
            0,
            element.getBoundingClientRect().top + window.scrollY - navHeight - 8,
          );
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const title =
      language === 'ar'
        ? 'مابكو | متجر الأجهزة المحمولة والإلكترونيات في سوريا'
        : 'MABCO | Mobile Devices, Accessories, and Electronics Retail Company in Syria';
    const description =
      language === 'ar'
        ? 'مرحباً بكم في مابكو، مكانك الأفضل لشراء الهواتف الذكية، الإكسسوارات والإلكترونيات في سوريا.'
        : 'Welcome to MABCO, your destination for mobile phones, accessories, and electronics in Syria.';

    setSeo({
      title,
      description,
      url: window.location.href,
      image: 'https://mabcoonline.com/images/giphy.gif',
    });
  }, [language]);

  useEffect(() => {
    const state = location.state as any;
    if (state?.orderMessage) {
      setOrderMessage(state.orderMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  // Reflow product cards on resize/zoom without remounting hero/category sliders.
  useEffect(() => {
    let lastZoomLevel = window.devicePixelRatio;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const handleResize = () => {
      const currentZoomLevel = window.devicePixelRatio;
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      const zoomChanged = Math.abs(currentZoomLevel - lastZoomLevel) > 0.1;
      const sizeChanged =
        Math.abs(currentWidth - lastWidth) > 50 ||
        Math.abs(currentHeight - lastHeight) > 50;

      if (zoomChanged || sizeChanged) {
        lastZoomLevel = currentZoomLevel;
        lastWidth = currentWidth;
        lastHeight = currentHeight;

        setProductLayoutKey((prev) => prev + 1);

        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
        resizeTimeoutRef.current = setTimeout(() => {
          setProductLayoutKey((prev) => prev + 1);
        }, 150);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 200);
    });

    const initialTimeout = setTimeout(() => {
      handleResize();
    }, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, []);


  useEffect(() => {
    let mounted = true;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

    (async () => {
      try {
        setMostSoldLoading(true);
        setNewBestLoading(true);
        const res = await fetch(`${apiBase}/products/home-sliders?limit=40`);
        
        if (!res.ok) {
          throw new Error(`Failed to load home sliders: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json();
        
        if (!mounted) return;
        const payload = json?.data || {};
        setMostSoldProducts(Array.isArray(payload.mostSold) ? payload.mostSold : []);
        setNewBestProducts(Array.isArray(payload.newHot) ? payload.newHot : []);
      } catch (err) {
        if (!mounted) return;
        console.error('[HomePage] Error loading home-sliders:', err);
        setMostSoldProducts([]);
        setNewBestProducts([]);
      } finally {
        if (mounted) {
          setMostSoldLoading(false);
          setNewBestLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleBrandClick = (
    brandCode: string,
    categoryCode: string,
    categoryNameEn: string,
  ) => {
    const categoryForRoute = categoryCode || categoryNameEn || '';
    const encodedCategory = encodeURIComponent(categoryForRoute);
    const encodedBrand = encodeURIComponent(brandCode);
    navigate(`/brand/${encodedCategory}/${encodedBrand}`);
  };

  const handleProductClick = (_product: any) => {};

  const handleAddToCart = (product: any) => {
    addToCart(product);
    openCart();
  };

  const handleToggleCompare = (productId: string) => {
    const key = String(productId);
    const isAdding = !compareItems.includes(key);
    toggleCompareStore(key);

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
      >
        {orderMessage && (
          <div className="container mx-auto px-4 pt-6">
            <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 flex items-start justify-between gap-4">
              <p className="text-sm md:text-base text-green-800 font-semibold">
                {orderMessage}
              </p>
              <button
                onClick={() => setOrderMessage(null)}
                className="text-green-700 hover:text-green-900 font-bold"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {/* Hidden H1 for SEO */}
        <h1 className="sr-only">
          {language === "ar"
            ? "متجر MABCO الإلكتروني - أكبر متجر للأجهزة الإلكترونية في سوريا"
            : "MABCO Online Store - Largest Electronics Store in Syria"}
        </h1>

        {/* Hero Carousel */}
        <section id="home" className="relative">
          <HeroCarousel language={language} />
        </section>

        {/* Search Section */}
        <section id="search-section" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <SearchSection language={language} />
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
          products={mostSoldProducts.map((product) => ({ ...product, isMostSold: true }))}
          loading={mostSoldLoading}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onToggleCompare={handleToggleCompare}
          compareItems={compareItems}
          key={`most-bought-${productLayoutKey}`}
        />

        {/* New Products Slider */}
        <ProductsSlider
          language={language}
          title={t("newProducts") || "New Products"}
          icon={<Flame className="w-6 h-6 md:w-8 md:h-8 text-red-500" />}
          products={newBestProducts}
          loading={newBestLoading}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onToggleCompare={handleToggleCompare}
          compareItems={compareItems}
          key={`new-products-${productLayoutKey}`}
        />

        {/* Services Section */}
        <section id="services" className="container mx-auto px-4 py-16">
          <ServicesGrid
            language={language}
            onServiceClick={(servicePath: string) => {
              if (servicePath === "gaming") {
                navigate("/brand/07/2022");
                return;
              }
              if (servicePath === "charging") {
                navigate("/brand/07/2020");
                return;
              }
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
        <CompanyStrength language={language} />

        {/* Warranty & Policy Section */}
        <WarrantySection language={language} />

        {/* SEO Structured Data */}
        <SEOSection language={language} />

        {/* Geometric Background Pattern */}
        <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-[#009FE3] rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-[#009FE3]/10 rounded-full"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border-2 border-[#009FE3] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-[#009FE3] rotate-12"></div>
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
