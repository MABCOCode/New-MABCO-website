// components/layout/Navbar.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  ChevronUp,
  GitCompare,
  Edit3,
  Package2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import categoriesData from "../../testdata/categories.json";
import { iconsMap } from "../../utils/iconMap";
import { useCompareStore } from "../../features/compare/state";
import MobileMenu from "./MobileMenu";
import { loadSession } from "../../features/account/storage";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t, direction, navigateToSection } =
    useLanguage();
  const compareItems = useCompareStore((s) => s.items);
  const compareCount = useCompareStore((s) => s.items.length);
  const openCompareModal = useCompareStore((s) => s.openCompare);

  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, openCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isAdmin = true; // Treat all users as admins for now
  const [activeSection, setActiveSection] = useState("");

  const readSession = () => {
    const session = loadSession() as any;
    if (session?.user) {
      setIsLoggedIn(true);
      const name = language === "ar" ? session.user.name : session.user.nameEn || session.user.name;
      setCurrentUserName(name ?? null);
    } else {
      setIsLoggedIn(false);
      setCurrentUserName(null);
    }
  };

  const session = loadSession() as any;
  const isAuthed = !!session?.user;

  useEffect(() => {
    readSession();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "session") {
        readSession();
      }
    };
    const onFocus = () => readSession();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [language, location.key]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
          setUserMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Only update active section if we're on the home page
      if (location.pathname === "/") {
        const sections = [
          "home",
          "search-section",
          "categories",
          "products",
          "services",
        ];
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
    if (location.pathname !== "/") {
      // Highlight the special-offers nav when on any /offers/* route
      if (location.pathname.startsWith("/offers")) {
        setActiveSection("special-offers-carousel");
      } else {
        setActiveSection(location.pathname.replace(/^\//, ""));
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Ensure immediate visual feedback when clicking nav items
  // (e.g. highlight the Offers item) by setting activeSection right away
  const handleNavClickWithHighlight = (sectionId: string) => {
    setActiveSection(sectionId);
    handleNavClick(sectionId);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Log compare state changes for debugging mobile/desktop differences
  React.useEffect(() => {
    console.log(
      "[Navbar] compareCount",
      compareCount,
      "compareItems",
      compareItems,
    );
  }, [compareCount, compareItems]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
      }`}
      dir={direction}
      style={{ zIndex: 1000 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => navigateTo("/")}
            className={`flex items-center cursor-pointer ${direction === "rtl" ? "lg:ml-6" : "lg:mr-6"}`}
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
              onClick={() => handleNavClickWithHighlight("home")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === "home" ? "text-[#009FE3] font-semibold" : ""
              }`}
            >
              {t("home")}
            </button>
            <button
              onClick={() => handleNavClickWithHighlight("categories")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === "categories"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {t("products")}
            </button>
            <button
              onClick={() => handleNavClickWithHighlight("special-offers-carousel")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === "special-offers-carousel"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {t("specialOffers")}
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
              onClick={() => handleNavClickWithHighlight("services")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === "services"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {" "}
              {/* {t('services')} */}
              {t("services")}
            </button>

            {/* Showrooms Link */}
            <button
              onClick={() => navigateTo("/showrooms")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors flex items-center gap-1 ${
                location.pathname === "/showrooms"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t("showrooms")}
            </button>

            <button
              onClick={() => navigateTo("/career")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                location.pathname === "/career"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {t("career")}
            </button>
            <button
              onClick={() => navigateTo("/contact")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                location.pathname === "/contact"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {t("contact")}
            </button>

            {/* Login / My Account Dropdown (includes admin links) */}
            {!isLoggedIn ? (
              <button
                onClick={() => navigateTo("/account/login")}
                className="flex items-center gap-2 text-gray-700 hover:text-[#009FE3] transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden xl:inline">{t("login")}</span>
              </button>
            ) : (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenuOpen((s) => !s)}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#009FE3] transition-colors"
                  aria-expanded={userMenuOpen}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline">{t("myAccount")}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-max min-w-[220px] z-50"
                    style={{ [direction === "rtl" ? "right" : "left"]: 0 }}
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigateTo("/account/dashboard");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 group"
                      >
                        <User className="w-5 h-5 text-gray-600 group-hover:text-[#009FE3]" />
                        <span className="text-gray-700 group-hover:text-[#009FE3] font-medium whitespace-nowrap">{t("navbar_dashboard") || "Dashboard"}</span>
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              navigateTo("/account/admin/content");
                              setUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 group"
                          >
                            <Edit3 className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                            <span className="text-gray-700 group-hover:text-orange-600 font-medium whitespace-nowrap">{language === "ar" ? "إدارة المنتجات" : "Manage Products"}</span>
                          </button>

                          <button
                            onClick={() => {
                              navigateTo("/account/admin/orders");
                              setUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 group"
                          >
                            <Package2 className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                            <span className="text-gray-700 group-hover:text-purple-600 font-medium whitespace-nowrap">{language === "ar" ? "إدارة الطلبات" : "Order Management"}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => openCart()}
              className="relative bg-gradient-to-br from-[#009FE3] to-[#007BC7] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden xl:inline">{t("cart")}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Small Search Icon */}
            <button
              onClick={() => handleNavClick("search-section")}
              className="p-2 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300"
              title={t("searchButton")}
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
                {language === "ar" ? "EN" : "ع"}
              </span>
            </button>
          </div>

          {/* Mobile Cart and Burger Menu Buttons */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Small Search Icon - Mobile */}
            <button
              onClick={() => handleNavClick("search-section")}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center"
              title={t("searchButton")}
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
        navigateToSection={navigateToSection}
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
