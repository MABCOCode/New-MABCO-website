// App.tsx
import  { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import ModernFooter from './components/layout/Footer'; // Make sure this is the correct import

import ScrollToTop from './components/ui/ScrollToTop';
import { CheckoutPage } from './features/checkout/pages/CheckoutPage';
import HomePage from './features/home/pages/HomePage';
import SearchResultsPage from './features/products/pages/SearchResultsPage';
import ProductDetailPage from './features/products/pages/ProductDetailPage';
import BrandPage from './features/products/pages/BrandPage';
import CategoryPage from './features/products/pages/CategoryPage';
import ShowroomsPage from './features/showrooms/pages/ShowroomsPage';
import AccountRoutes from './features/account/AccountRoutes';
import { OfferTypeRoute } from './features/offer/pages/OfferTypePage';
import {ShoppingCart} from './features/cart/components/ShoppingCart';
import { CartProvider, useCart } from './context/CartContext';
import SearchPage from './features/search/pages/SearchPage';
import './styles/globals.css';
import './styles/enhanced-ux.css';
import { ComparePage } from "./features/compare/pages/ComparePage";
import { useCompareStore } from "./features/compare/state";
import { compareStorage } from "./features/compare/storage";
import FloatingCompare from './components/layout/FloatingCompare';

// Create a wrapper component that can use the LanguageContext
const AppContent: React.FC = () => {
  const handleBrandClick = (brandName: string, categoryName: string, categoryNameEn: string) => {
    console.log('Brand clicked:', brandName, categoryName);
    const categoryForRoute = categoryNameEn || categoryName || '';
    const encodedCategory = encodeURIComponent(categoryForRoute);
    const encodedBrand = encodeURIComponent(brandName);
    navigate(`/brand/${encodedCategory}/${encodedBrand}`);
  };

  const handleAboutClick = () => {
    console.log('About clicked');
    // Navigate to about page
  };

  const handleShowroomsClick = () => {
    console.log('Showrooms clicked');
    // Navigate to showrooms
  };

  const handleWarrantyClick = () => {
    console.log('Warranty clicked');
    // Scroll to warranty section or navigate
  };

  const handleMaintenanceClick = () => {
    console.log('Maintenance clicked');
    // Navigate to maintenance page
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

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };


  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white">
        {!isAccountRoute && <Navbar />}
        {!isAccountRoute && <FloatingCompare />}
        {!isAccountRoute && compareMode && (
          <ComparePage
            compareItems={compareItems}
            allProducts={[]}
            onClose={() => closeCompare()}
            onRemoveItem={(id) => removeCompareItem(id)}
            onAddItem={(id) => addCompareItem(id)}
            language={language}
          />
        )}
        {!isAccountRoute && (
          <ShoppingCart
            isOpen={cartOpen}
            onClose={() => closeCart()}
            cartItems={cartItems}
            onUpdateQuantity={(id:number, qty:number) => updateQuantity(id, qty)}
            onRemoveItem={(id:number) => removeFromCart(id)}
            onProceedToCheckout={handleProceedToCheckout}
            language={language}
          />
        )}
        {/* Checkout is now a route at /checkout */}
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
            <Route path="/account/*" element={<AccountRoutes />} />
            <Route path="/login" element={<Navigate to="/account/login" replace />} />
            <Route path="/dashboard" element={<Navigate to="/account/dashboard" replace />} />
            
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 text-lg">Page not found</p>
                </div>
              </div>
            } />
          </Routes>
          
        </main>
        {!isAccountRoute && (
          <ModernFooter 
            language={language}
            onBrandClick={handleBrandClick}
            onAboutClick={handleAboutClick}
            onShowroomsClick={handleShowroomsClick}
            onWarrantyClick={handleWarrantyClick}
            onMaintenanceClick={handleMaintenanceClick}
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
