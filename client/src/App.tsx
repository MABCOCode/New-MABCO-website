// App.tsx
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ModernFooter from './components/layout/Footer'; // Make sure this is the correct import
import Navbar from './components/layout/Navbar';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { setSeo } from './services/seo';
import { requestFcmToken } from './services/fcm';

const FloatingCompare = lazy(() => import('./components/layout/FloatingCompare'));
const FloatingSocialLinks = lazy(() => import('./components/layout/FloatingSocialLinks'));
import ScrollToTop from './components/ui/ScrollToTop';
import { CartProvider, useCart } from './context/CartContext';
const AboutPage = lazy(() => import('./features/about/pages/AboutPage'));
const AccountRoutes = lazy(() => import('./features/account/AccountRoutes'));
const CareerPage = lazy(() => import('./features/career/pages/CareerPage'));
const ShoppingCart = lazy(() =>
  import('./features/cart/components/ShoppingCart').then((m) => ({ default: m.ShoppingCart })),
);
const CheckoutPage = lazy(() =>
  import('./features/checkout/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
);
const ComparePage = lazy(() =>
  import('./features/compare/pages/ComparePage').then((m) => ({ default: m.ComparePage })),
);
import { useCompareStore } from "./features/compare/state";
const HomePage = lazy(() => import('./features/home/pages/HomePage'));
const OfferTypeRoute = lazy(() =>
  import('./features/offer/pages/OfferTypePage').then((m) => ({ default: m.OfferTypeRoute })),
);
const BrandPage = lazy(() => import('./features/products/pages/BrandPage'));
const CategoryPage = lazy(() => import('./features/products/pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./features/products/pages/ProductDetailPage'));
const SearchResultsPage = lazy(() => import('./features/products/pages/SearchResultsPage'));
const SearchPage = lazy(() => import('./features/search/pages/SearchPage'));
const ShowroomsPage = lazy(() => import('./features/showrooms/pages/ShowroomsPage'));
import './styles/enhanced-ux.css';
import './styles/globals.css';

// Create a wrapper component that can use the LanguageContext
const AppContent: React.FC = () => {
  const handleBrandClick = (brandName: string, categoryName: string, categoryNameEn: string) => {
    const categoryCode =
      (/^\d+$/.test(String(categoryName)) && String(categoryName)) ||
      (/^\d+$/.test(String(categoryNameEn)) && String(categoryNameEn)) ||
      '';
    const categoryForRoute = categoryCode || categoryNameEn || categoryName || '';
    const encodedCategory = encodeURIComponent(categoryForRoute);
    const encodedBrand = encodeURIComponent(brandName);
    navigate(`/brand/${encodedCategory}/${encodedBrand}`);
  };

  const handleCategoryClick = (categoryCode: string, categoryName: string, categoryNameEn: string) => {
    const encodedCode = encodeURIComponent(categoryCode || '');
    navigate(`/?openCategory=${encodedCode}#categories`);
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleShowroomsClick = () => {
    navigate('/showrooms');
  };

  const handleWarrantyClick = () => {
    navigate('/account/warranty');
  };

  const handleMaintenanceClick = () => {
    navigate('/account/maintenance');
  };

  const handleCareerClick = () => {
    navigate('/career');
  };
  const compareItems = useCompareStore((s) => s.items);
  const compareMode = useCompareStore((s) => s.isOpen);
  const addCompareItem = useCompareStore((s) => s.addItem);
  const removeCompareItem = useCompareStore((s) => s.removeItem);
  const openCompare = useCompareStore((s) => s.openCompare);
  const closeCompare = useCompareStore((s) => s.closeCompare);
  // Read current language from LanguageContext instead of hardcoding
  const { language } = useLanguage();
  const { cartItems, cartCount, cartOpen, closeCart, updateQuantity, removeFromCart, openCart } = useCart();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isAccountRoute = location.pathname.startsWith("/account");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const token = await requestFcmToken();
        if (cancelled || !token) return;
        localStorage.setItem("fcmToken", token);
        const raw = localStorage.getItem("session");
        const session = raw ? JSON.parse(raw) : null;
        const user = session?.user;
        const payload = {
          token,
          userId: user?.id || user?._id || user?.userId || null,
          phone: user?.phone || null,
          locale: language,
          platform: "web",
        };
        fetch("/api/notifications/device-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => null);
      } catch {
        // ignore
      }
    };

    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 1200);
    }

    return () => {
      cancelled = true;
    };
  }, [language]);

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  // Update page title and meta tags based on app language and route.
  useEffect(() => {
    // Skip meta overrides for detailed routes where page components manage their own SEO.
    const skipPaths = [
      '/category/',
      '/brand/',
      '/product/',
      '/showrooms',
    ];
    if (skipPaths.some((path) => location.pathname.startsWith(path))) {
      return;
    }

    const isArabic = language === 'ar';
    const baseTitle = isArabic
      ? 'مابكو | شركة بيع الأجهزة المحمولة والملحقات والإلكترونيات في سوريا'
      : 'MABCO | Mobile Devices, Accessories, and Electronics Retail Company in Syria';
    const baseDescription = isArabic
      ? 'شركة مابكو - الرائدة في بيع الأجهزة المحمولة والملحقات والإلكترونيات في سوريا. تسوق أحدث الهواتف الذكية والكمبيوترات المحمولة والأجهزة الإلكترونية بأفضل الأسعار.'
      : 'MABCO - Leading mobile devices, accessories, and electronics retail company in Syria. Shop latest smartphones, laptops, and gadgets with best prices.';

    setSeo({
      title: baseTitle,
      description: baseDescription,
      url: window.location.href,
      image: 'https://mabcoonline.com/images/giphy.gif',
    });

    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [language, location.pathname]);

  useEffect(() => {
    const observed = new WeakSet<HTMLImageElement>();

    const wireImage = (img: HTMLImageElement) => {
      if (observed.has(img)) return;
      observed.add(img);

      const clearLoading = () => {
        img.classList.remove('img-loading');
        img.removeEventListener('load', clearLoading);
        img.removeEventListener('error', clearLoading);
      };

      if (img.complete) {
        img.classList.remove('img-loading');
        return;
      }

      img.classList.add('img-loading');
      img.addEventListener('load', clearLoading);
      img.addEventListener('error', clearLoading);
    };

    const scanImages = (root: ParentNode) => {
      root.querySelectorAll('img').forEach((node) => wireImage(node as HTMLImageElement));
    };

    scanImages(document);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.tagName === 'IMG') {
            wireImage(node as HTMLImageElement);
            return;
          }
          scanImages(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);


  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white">
        {!isAccountRoute && <Navbar />}
        {!isAccountRoute && (
          <Suspense fallback={null}>
            <FloatingCompare />
          </Suspense>
        )}
        {!isAccountRoute && (
          <Suspense fallback={null}>
            <FloatingSocialLinks />
          </Suspense>
        )}
        {!isAccountRoute && compareMode && (
          <Suspense fallback={null}>
            <ComparePage
              compareItems={compareItems}
              allProducts={[]}
              onClose={() => closeCompare()}
              onRemoveItem={(id) => removeCompareItem(id)}
              onAddItem={(id) => addCompareItem(id)}
              language={language}
            />
          </Suspense>
        )}
        {!isAccountRoute && (
          <Suspense fallback={null}>
            <ShoppingCart
              isOpen={cartOpen}
              onClose={() => closeCart()}
              cartItems={cartItems}
              onUpdateQuantity={(id: number | string, qty: number) => updateQuantity(id, qty)}
              onRemoveItem={(id: number | string) => removeFromCart(id)}
              onProceedToCheckout={handleProceedToCheckout}
              language={language}
            />
          </Suspense>
        )}
        {/* Checkout is now a route at /checkout */}
        <main className={`flex-grow ${isAccountRoute ? "" : "pt-20"}`}>
          <Suspense fallback={<div className="min-h-[40vh] bg-white" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/products" element={<SearchResultsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/brand/:category/:id" element={<BrandPage />} />
              <Route path="/brand/:id" element={<BrandPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/offers/:offerType" element={<OfferTypeRoute />} />
              <Route path="/showrooms" element={<ShowroomsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/career" element={<CareerPage />} />
              <Route path="/account/*" element={<AccountRoutes />} />
              <Route path="/login" element={<Navigate to="/account/login" replace />} />
              <Route path="/dashboard" element={<Navigate to="/account/dashboard" replace />} />

              <Route path="/search" element={<SearchPage />} />
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 text-lg">Page not found</p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </main>
        {!isAccountRoute && (
          <ModernFooter 
            language={language}
            onBrandClick={handleBrandClick}
            onCategoryClick={handleCategoryClick}
            onAboutClick={handleAboutClick}
            onShowroomsClick={handleShowroomsClick}
            onWarrantyClick={handleWarrantyClick}
            onMaintenanceClick={handleMaintenanceClick}
            onCareerClick={handleCareerClick}
          />
        )}
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
