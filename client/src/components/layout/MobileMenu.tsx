import React from 'react';
import {
  MapPin,
  Building2,
  Briefcase,
  Home,
  Package,
  Tag,
  Phone,
  LogIn,
  LogOut,
  User,
  Edit3,
  Package2,
  Crown,
} from 'lucide-react';

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
  canManageStore: boolean;
  canManageBanners: boolean;
  canManageOrders: boolean;
  isSuperAdmin: boolean;
  onLogout: () => void;
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
  compareCount,
  openCompareModal,
  isLoggedIn,
  canManageStore,
  canManageBanners,
  canManageOrders,
  isSuperAdmin,
  onLogout,
  categories,
  expandedCategory,
  toggleCategory,
}) => {
  const closeMenuAndNavigateToSection = (sectionId: string) => {
    setMenuOpen(false);
    window.setTimeout(() => {
      navigateToSection(sectionId);
    }, 400);
  };

  return (
    <div
      className={`lg:hidden overflow-y-auto transition-all duration-500 ease-in-out ${
        menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="bg-white border-t border-gray-100 shadow-lg">
        <div className="container mx-auto px-4 py-6">
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

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            {compareCount > 0 && (
              <div
                className={`transition-all duration-500 delay-200 ${
                  menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <button
                  onClick={() => {
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

          <div className="space-y-2 mb-6">
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  navigateTo('/account/login');
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

            {isLoggedIn && (
              <button
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 group ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: '230ms' }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogOut className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 group-hover:text-red-600 font-medium">
                  {t('account_navbar_logout') || t('account_dashboard_logout') || 'Logout'}
                </span>
              </button>
            )}

            {(canManageStore || canManageBanners || canManageOrders || isSuperAdmin) && (
              <div className="space-y-2 mt-2">
                {canManageStore && (
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
                    <span className="text-gray-700 group-hover:text-orange-600 font-medium">
                      {language === 'ar' ? 'إدارة المتجر' : 'Store Management'}
                    </span>
                  </button>
                )}

                {canManageBanners && (
                  <button
                    onClick={() => {
                      navigateTo('/account/admin/banners');
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
                    <span className="text-gray-700 group-hover:text-purple-600 font-medium">
                      {language === 'ar' ? 'إدارة البنر' : 'Banner Slider'}
                    </span>
                  </button>
                )}

                {canManageOrders && (
                  <button
                    onClick={() => {
                      navigateTo('/account/admin/orders');
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                      menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: '246ms' }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                      {language === 'ar' ? 'إدارة الطلبات' : 'Order Management'}
                    </span>
                  </button>
                )}

                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      navigateTo('/account/superadmin');
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-all duration-200 group ${
                      menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: '247ms' }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 group-hover:text-yellow-600 font-medium">
                      {language === 'ar' ? 'لوحة تحكم السوبر أدمن' : 'Super Admin Dashboard'}
                    </span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => {
                closeMenuAndNavigateToSection('home');
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: '248ms' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">{t('home')}</span>
            </button>

            <button
              onClick={() => {
                closeMenuAndNavigateToSection('categories');
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: '249ms' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">{t('products')}</span>
            </button>

            <button
              onClick={() => {
                closeMenuAndNavigateToSection('special-offers-carousel');
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: '249ms' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 group-hover:text-[#009FE3] font-medium">{t('specialOffers')}</span>
            </button>

            <button
              onClick={() => {
                closeMenuAndNavigateToSection('services');
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
              onClick={() => {
                navigateTo('/career');
                setMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group ${
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

          {/* Categories list removed from mobile menu */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
