// components/layout/Navbar.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Globe,
  MapPin,
  Building2,
  User,
  LogIn,
  ChevronDown,
  Edit3,
  Package2,
  Crown,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { iconsMap } from "../../utils/iconMap";
import { useCompareStore } from "../../features/compare/state";
import MobileMenu from "./MobileMenu";
import { loadSession } from "../../features/account/storage";
import { getAccountAccess } from "../../features/account/access";

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
  const [sessionUser, setSessionUser] = useState<any | null>(
    (loadSession() as any)?.user ?? null,
  );
  const [activeSection, setActiveSection] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const access = getAccountAccess(sessionUser);

  const readSession = () => {
    const session = loadSession() as any;
    if (session?.user) {
      setSessionUser(session.user);
      setIsLoggedIn(true);
      const name =
        language === "ar"
          ? session.user.name
          : session.user.nameEn || session.user.name;
      setCurrentUserName(name ?? null);
      return;
    }
    setSessionUser(null);
    setIsLoggedIn(false);
    setCurrentUserName(null);
  };

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!userMenuOpen) return;
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (location.pathname === "/") {
        const sections = [
          "home",
          "search-section",
          "categories",
          "special-offers-carousel",
          "products",
          "services",
        ];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (!element) continue;
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    if (location.pathname !== "/") {
      if (location.pathname.startsWith("/offers")) {
        setActiveSection("special-offers-carousel");
      } else {
        setActiveSection(location.pathname.replace(/^\//, ""));
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/static/categories.json");
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted || !Array.isArray(json)) return;
        setCategories(
          json.map((c: any) => ({
            ...c,
            icon: iconsMap[c.iconName] || Building2,
          })),
        );
      } catch {
        if (mounted) setCategories([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleNavClick = (sectionId: string) => {
    navigateToSection(sectionId);
    setMenuOpen(false);
  };

  const handleNavClickWithHighlight = (sectionId: string) => {
    setActiveSection(sectionId);
    handleNavClick(sectionId);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const closeUserMenuAndNavigate = (path: string) => {
    navigateTo(path);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    setSessionUser(null);
    setIsLoggedIn(false);
    setCurrentUserName(null);
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/account/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
      }`}
      dir={direction}
      style={{ zIndex: 99 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
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
              onClick={() =>
                handleNavClickWithHighlight("special-offers-carousel")
              }
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === "special-offers-carousel"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {t("specialOffers")}
            </button>
            <button
              onClick={() => handleNavClickWithHighlight("services")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                activeSection === "services"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {t("services")}
            </button>
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
              onClick={() => navigateTo("/about")}
              className={`text-gray-700 hover:text-[#009FE3] transition-colors ${
                location.pathname === "/about"
                  ? "text-[#009FE3] font-semibold"
                  : ""
              }`}
            >
              {t("aboutUs")}
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
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-max min-w-[220px] z-50"
                    style={{ [direction === "rtl" ? "right" : "left"]: 0 }}
                  >
                    <div className="py-2">
                      {currentUserName && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            {t("myAccount")}
                          </p>
                          <p className="text-sm font-semibold text-gray-700 truncate">
                            {currentUserName}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => closeUserMenuAndNavigate("/account/dashboard")}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 group"
                      >
                        <User className="w-5 h-5 text-gray-600 group-hover:text-[#009FE3]" />
                        <span className="text-gray-700 group-hover:text-[#009FE3] font-medium whitespace-nowrap">
                          {t("navbar_dashboard") || "Dashboard"}
                        </span>
                      </button>

                      {access.canManageStore && (
                        <button
                          onClick={() =>
                            closeUserMenuAndNavigate("/account/admin/content")
                          }
                          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 group"
                        >
                          <Edit3 className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                          <span className="text-gray-700 group-hover:text-orange-600 font-medium whitespace-nowrap">
                            {language === "ar" ? "إدارة المتجر" : "Store Management"}
                          </span>
                        </button>
                      )}

                      {access.canManageBanners && (
                        <button
                          onClick={() =>
                            closeUserMenuAndNavigate("/account/admin/banners")
                          }
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 group"
                        >
                          <Package2 className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                          <span className="text-gray-700 group-hover:text-purple-600 font-medium whitespace-nowrap">
                            {language === "ar" ? "إدارة البنر" : "Banner Slider"}
                          </span>
                        </button>
                      )}

                      {access.canManageOrders && (
                        <button
                          onClick={() =>
                            closeUserMenuAndNavigate("/account/admin/orders")
                          }
                          className="w-full px-4 py-3 text-left hover:bg-cyan-50 transition-colors flex items-center gap-3 group"
                        >
                          <Package2 className="w-5 h-5 text-gray-600 group-hover:text-cyan-600" />
                          <span className="text-gray-700 group-hover:text-cyan-600 font-medium whitespace-nowrap">
                            {t("admin.orders.title") ||
                              (language === "ar"
                                ? "إدارة الطلبات"
                                : "Order Management")}
                          </span>
                        </button>
                      )}

                      {access.isSuperAdmin && (
                        <button
                          onClick={() =>
                            closeUserMenuAndNavigate("/account/superadmin")
                          }
                          className="w-full px-4 py-3 text-left hover:bg-yellow-50 transition-colors flex items-center gap-3 group"
                        >
                          <Crown className="w-5 h-5 text-gray-600 group-hover:text-yellow-600" />
                          <span className="text-gray-700 group-hover:text-yellow-600 font-medium whitespace-nowrap">
                            {language === "ar"
                              ? "لوحة تحكم السوبر أدمن"
                              : "Super Admin Dashboard"}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 group border-t border-gray-100"
                      >
                        <LogIn className="w-5 h-5 text-gray-600 group-hover:text-red-600 rotate-180" />
                        <span className="text-gray-700 group-hover:text-red-600 font-medium whitespace-nowrap">
                          {t("account_navbar_logout") ||
                            t("account_dashboard_logout") ||
                            "Logout"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

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

            <button
              onClick={() => handleNavClick("search-section")}
              className="p-2 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300"
              title={t("searchButton")}
            >
              <Search className="w-5 h-5" />
            </button>

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

          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => handleNavClick("search-section")}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center"
              title={t("searchButton")}
            >
              <Search className="w-5 h-5" />
            </button>

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

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#009FE3] transition-colors relative"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
        canManageStore={access.canManageStore}
        canManageBanners={access.canManageBanners}
        canManageOrders={access.canManageOrders}
        isSuperAdmin={access.isSuperAdmin}
        onLogout={handleLogout}
        categories={categories}
        expandedCategory={expandedCategory}
        toggleCategory={toggleCategory}
      />
    </nav>
  );
};

export default Navbar;
