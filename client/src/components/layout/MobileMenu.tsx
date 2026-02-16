import React from 'react';
import {
  MapPin,
  Building2,
  Briefcase,
  LogIn,
  User,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  Edit3,
  Package2,
} from 'lucide-react';
import { loadSession } from '../../features/account/storage';

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  toggleLanguage: () => void;
  language: string;
  navigateTo: (path: string) => void;
  navigateToSection: (sectionId: string) => void;
  t: (k: string) => string;
  cartCount: number;
  compareCount: number;
  openCompareModal: () => void;
  isLoggedIn: boolean;
  categories: any[];
  expandedCategory: number | null;
  toggleCategory: (index: number) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  menuOpen,
  setMenuOpen,
  toggleLanguage,
  language,
  navigateTo,
  navigateToSection,
  t,
  cartCount,
  compareCount,
  openCompareModal,
  isLoggedIn,
  categories,
  expandedCategory,
  toggleCategory,
}) => {
  return (
    <div
      className={`lg:hidden overflow-y-auto transition-all duration-500 ease-in-out ${
        menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="bg-white border-t border-gray-100 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          {/* Language Toggle */}
          <div
            className={`mb-4 flex items-center justify-center transition-all duration-500 delay-75 ${
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-[#009FE3] hover:text-white transition-all duration-300 shadow-md"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            </button>
          </div>

          {/* Shopping Cart and Compare in Menu */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <div
              className={`transition-all duration-500 delay-100 ${
                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <button
                onClick={() => navigateTo('/cart')}
                className="relative bg-gradient-to-br from-[#009FE3] to-[#007BC7] text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('cart')}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {compareCount > 0 && (
              <div
                className={`transition-all duration-500 delay-200 ${
                  menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <button
                  onClick={() => {
                    console.log('[MobileMenu] openCompare (mobile menu) click, count=', compareCount);
                    openCompareModal();
                    setMenuOpen(false);
                  }}
                  className="relative bg-gradient-to-br from-purple-500 to-purple-700 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
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
                  <span>{t('compare')}</span>
                  <span className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {compareCount}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="space-y-2 mb-6">
            {/* Login / My Account Button - Mobile */}
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  const session = loadSession() as any;
                  navigateTo(session?.user ? '/account/dashboard' : '/account/login');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: '225ms' }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogIn className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 group-hover:text-purple-600 font-medium">{t('login')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigateTo('/account/dashboard');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: '225ms' }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 group-hover:text-purple-600 font-medium">{t('myAccount')}</span>
              </button>
            )}

            {/* Admin Links - show for all users while in dev mode */}
            <div className="space-y-2 mt-2">
              <button
                onClick={() => {
                  navigateTo('/account/admin/content');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-all duration-200 group ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: '235ms' }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 group-hover:text-orange-600 font-medium">{language === 'ar' ? 'إدارة المنتجات' : 'Manage Products'}</span>
              </button>

              <button
                onClick={() => {
                  navigateTo('/account/admin/orders');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all duration-200 group ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: '245ms' }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 group-hover:text-purple-600 font-medium">{language === 'ar' ? 'إدارة الطلبات' : 'Order Management'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                navigateToSection('services');
                setMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">{t('services')}</span>
            </button>

            <button
              onClick={() => {
                navigateTo('/showrooms');
                setMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: '255ms' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">{t('showrooms')}</span>
            </button>

            <button
              onClick={() => {
                navigateTo('/about');
                setMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: '275ms' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">{t('aboutUs')}</span>
            </button>

            <button
              onClick={() => navigateTo('/career')}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">{t('career')}</span>
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center pt-4 border-t border-gray-200">{t('categories')}</h3>
          <div className="space-y-2">
            {categories.map((category: any, index: number) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-300 ${
                    menuOpen ? `opacity-100 translate-x-0` : 'opacity-0 translate-x-4'
                  }`}
                  style={{
                    transitionDelay: `${(index + 1) * 50}ms`,
                  }}
                >
                  <button
                    onClick={() => toggleCategory(index)}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">
                        {language === 'ar' ? category.name : category.nameEn}
                      </span>
                    </div>
                    {category.brands && category.brands.length > 0 && (
                      <div className="transition-transform duration-300">
                        {expandedCategory === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Brands Dropdown - Grid Layout */}
                  {category.brands && category.brands.length > 0 && (
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedCategory === index ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pr-4 grid grid-cols-2 gap-3">
                        {category.brands.map((brand: any, brandIndex: number) => (
                          <div
                            key={brandIndex}
                            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-[#009FE3]/30 cursor-pointer"
                            onClick={() => {
                              const brandName =
                                typeof brand === "string" ? brand : brand.name;
                              const categoryName =
                                typeof category.nameEn === "string" && category.nameEn
                                  ? category.nameEn
                                  : category.name;
                              navigateTo(
                                `/brand/${encodeURIComponent(categoryName)}/${encodeURIComponent(brandName)}`,
                              );
                              setMenuOpen(false);
                            }}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center mb-4 p-6 group-hover:bg-gray-100 transition-colors">
                                <img
                                  src={
                                    typeof brand === "string"
                                      ? "https://via.placeholder.com/150"
                                      : brand.image || "https://via.placeholder.com/150"
                                  }
                                  alt={`${typeof brand === "string" ? brand : brand.name} Logo`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <h4 className="Text-gray-900 mb-1.5 text-lg">
                                {typeof brand === "string" ? brand : brand.name}
                              </h4>
                              {typeof brand !== "string" && brand.englishName && (
                                <p className="text-sm text-gray-500 mb-2">{brand.englishName}</p>
                              )}
                              {typeof brand !== "string" && brand.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">{brand.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
