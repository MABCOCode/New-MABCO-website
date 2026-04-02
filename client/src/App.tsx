// App.tsx
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ModernFooter from './components/layout/Footer'; // Make sure this is the correct import
import Navbar from './components/layout/Navbar';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import AboutPage from './features/about/pages/AboutPage';
import CareerPage from './features/career/pages/CareerPage';
import ShowroomsPage from './features/showrooms/pages/ShowroomsPage';
import { setSeo } from './services/seo';

const FloatingCompare = lazy(() => import('./components/layout/FloatingCompare'));
const FloatingSocialLinks = lazy(() => import('./components/layout/FloatingSocialLinks'));
import ScrollToTop from './components/ui/ScrollToTop';
import { CartProvider, useCart } from './context/CartContext';
const AccountRoutes = lazy(() => import('./features/account/AccountRoutes'));
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
const FaqPage = lazy(() => import('./features/faq/pages/FaqPage'));
const AppDownloadPage = lazy(() => import('./features/apps/pages/AppDownloadPage'));
const SitemapPage = lazy(() => import('./features/seo/pages/SitemapPage'));
const BrandPage = lazy(() => import('./features/products/pages/BrandPage'));
const CategoryPage = lazy(() => import('./features/products/pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./features/products/pages/ProductDetailPage'));
const SearchResultsPage = lazy(() => import('./features/products/pages/SearchResultsPage'));
const SearchPage = lazy(() => import('./features/search/pages/SearchPage'));
import './styles/enhanced-ux.css';
import './styles/globals.css';

// Create a wrapper component that can use the LanguageContext
const AppContent: React.FC = () => {
  const MainSkeleton = () => (
    <div className="min-h-screen bg-white">
      <div className="relative h-[320px] md:h-[420px] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 shimmer-surface" />
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 max-w-4xl mx-auto">
          <div className="h-10 md:h-14 w-2/3 max-w-xl rounded-2xl shimmer-surface mb-4 mx-auto" />
          <div className="h-5 md:h-6 w-1/2 max-w-sm rounded-xl shimmer-surface mb-6 mx-auto" />
          <div className="h-12 w-56 rounded-full shimmer-surface mx-auto" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex gap-3">
            <div className="flex-1 h-14 rounded-full shimmer-surface" />
            <div className="w-20 h-14 rounded-full shimmer-surface" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={`app-shell-${idx}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl shimmer-surface mb-4" />
              <div className="h-4 w-3/4 shimmer-surface rounded mb-2" />
              <div className="h-4 w-1/2 shimmer-surface rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
        const { requestFcmToken } = await import('./services/fcm');
        const token = await requestFcmToken();
        if (cancelled || !token) return;
        localStorage.setItem("fcmToken", token);
        const raw = localStorage.getItem("session");
        const session = raw ? JSON.parse(raw) : null;
        const user = session?.user;
        const normalizePhone = (rawPhone: any) => {
          if (!rawPhone) return null;
          let digits = String(rawPhone).replace(/[^0-9]/g, "");
          if (digits.startsWith("00963")) digits = `0${digits.slice(4)}`;
          else if (digits.startsWith("963")) digits = `0${digits.slice(3)}`;
          else if (digits.startsWith("9") && digits.length === 9) digits = `0${digits}`;
          return digits;
        };
        const payload = {
          token,
          userId: user?.id || user?._id || user?.userId || null,
          phone: normalizePhone(user?.phone || null),
          locale: language,
          platform: "web",
          role: user?.role || null,
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
        <Suspense fallback={<MainSkeleton language={language} />}>
          <main className={`flex-grow ${isAccountRoute ? "" : "pt-20"}`}>
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
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/apps-download" element={<AppDownloadPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
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
        </Suspense>
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
