// components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  User,
  LogIn,
  ChevronDown,
  ChevronUp,GitCompare 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import categoriesData from '../../testdata/categories.json';
import { iconsMap } from '../../utils/iconMap'; 
import { useCompareStore } from "../../features/compare/state";
import MobileMenu from './MobileMenu';


const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t, direction, navigateToSection } = useLanguage();
  const compareItems = useCompareStore((s) => s.items);
  const compareCount = useCompareStore((s) => s.items.length);
  const openCompareModal = useCompareStore((s) => s.openCompare);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, openCart } = useCart();
  const [isLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Only update active section if we're on the home page
      if (location.pathname === '/') {
        const sections = ['home', 'search-section', 'categories', 'products', 'services'];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };
    
    // Also update active section based on current route
    if (location.pathname !== '/') {
      setActiveSection(location.pathname.replace('/', ''));
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Map icons for categories
  const categories = categoriesData.map((c: any) => ({
    ...c,
    icon: iconsMap[c.iconName] || Building2,
  }));

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleNavClick = (sectionId: string) => {
    navigateToSection(sectionId);
    setMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Log compare state changes for debugging mobile/desktop differences
  React.useEffect(() => {
    console.log('[Navbar] compareCount', compareCount, 'compareItems', compareItems);
  }, [compareCount, compareItems]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg"
          : "bg-white/95 backdrop-blur-sm"
      }`}
      dir={direction}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => navigateTo('/')}
            className={`flex items-center cursor-pointer ${direction === 'rtl' ? 'lg:ml-6' : 'lg:mr-6'}`}
          >
            <img
              src="https://mabcoonline.com/images/Mabco%20100x100.jpg"
              alt="MABCO Logo"
              className="h-16 w-auto object-contain"
            />
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === 'home' ? 'text-[#009FE3] font-semibold' : ''
              }`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === 'categories' ? 'text-[#009FE3] font-semibold' : ''
              }`}
            >
              {t('products')}
            </button>
            {/* <button
              onClick={() => handleNavClick('products')}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === 'products' ? 'text-[#009FE3] font-semibold' : ''
              }`}
            >
              {t('products')}
            </button> */}
            <button
              onClick={() => handleNavClick('services')}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === 'services' ? 'text-[#009FE3] font-semibold' : ''
              }`}
            > {/* {t('services')} */}
              {t('services')}
            </button>

            {/* Showrooms Link */}
            <button
              onClick={() => navigateTo('/showrooms')}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors flex items-center gap-1 ${
                location.pathname === '/showrooms' ? 'text-[#009FE3] font-semibold' : ''
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t('showrooms')}
            </button>

            <button
              onClick={() => navigateTo('/career')}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                location.pathname === '/career' ? 'text-[#009FE3] font-semibold' : ''
              }`}
            >
              {t('career')}
            </button>
            <button
              onClick={() => navigateTo('/contact')}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                location.pathname === '/contact' ? 'text-[#009FE3] font-semibold' : ''
              }`}
            >
              {t('contact')}
            </button>

            {/* Login / My Account Button */}
            {!isLoggedIn ? (
              <button
                onClick={() => navigateTo('/login')}
                className="flex items-center gap-2 text-gray-700 hover:text-[#009FE3] transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden xl:inline">
                  {t('login')}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('/dashboard')}
                className="flex items-center gap-2 text-gray-700 hover:text-[#009FE3] transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden xl:inline">
                  {t('myAccount')}
                </span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => openCart()}
              className="relative bg-gradient-to-br from-[#009FE3] to-[#007BC7] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden xl:inline">
                {t('cart')}
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Small Search Icon */}
            <button
              onClick={() => handleNavClick('search-section')}
              className="p-2 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300"
              title={t('searchButton')}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare Button - Desktop (only show when there are items) */}
           

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300 group"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'EN' : 'ع'}
              </span>
            </button>
          </div>

          {/* Mobile Cart and Burger Menu Buttons */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Small Search Icon - Mobile */}
            <button
              onClick={() => handleNavClick('search-section')}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center"
              title={t('searchButton')}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button - Mobile */}
            <button
              onClick={() => openCart()}
              className="relative bg-gradient-to-br from-[#009FE3] to-[#007BC7] text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Burger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#009FE3] transition-colors relative"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              {/* Red notification dot when there are products to compare - only on mobile */}
              {compareCount > 0 && !menuOpen && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        toggleLanguage={toggleLanguage}
        language={language}
        navigateTo={navigateTo}
        t={t}
        cartCount={cartCount}
        compareCount={compareCount}
        openCompareModal={openCompareModal}
        isLoggedIn={isLoggedIn}
        categories={categories}
        expandedCategory={expandedCategory}
        toggleCategory={toggleCategory}
      />
    </nav>
  );
};

export default Navbar;