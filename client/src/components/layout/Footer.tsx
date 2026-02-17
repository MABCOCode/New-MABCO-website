// components/layout/ModernFooter.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin,
  Download,
  Shield,
  Wrench,
  Building2,
  Briefcase
} from 'lucide-react';
import { translations } from '../../i18n/translations';

interface ModernFooterProps {
  language: 'ar' | 'en';
  onBrandClick?: (brandName: string, categoryName: string, categoryNameEn: string) => void;
  onCategoryClick?: (categoryCode: string, categoryName: string, categoryNameEn: string) => void;
  onAboutClick?: () => void;
  onShowroomsClick?: () => void;
  onWarrantyClick?: () => void;
  onMaintenanceClick?: () => void;
}

interface StaticCategory {
  cat_code: string;
  name: string;
  nameEn: string;
  brands?: Array<{ brand_code?: string; name?: string; englishName?: string }>;
}

interface StaticBrand {
  brand_code: string;
  name: string;
  englishName?: string;
  category_code?: string;
}

const ModernFooter: React.FC<ModernFooterProps> = ({
  language = 'ar',
  onBrandClick,
  onCategoryClick,
  onAboutClick,
  onShowroomsClick,
  onWarrantyClick,
  onMaintenanceClick
}) => {
  const t = translations[language];
  const isRTL = language === 'ar';
  const textDirection = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'text-right' : 'text-left';
  const flexDirection = isRTL ? 'flex-row-reverse' : 'flex-row';
  const justifyDirection = isRTL ? 'justify-end' : 'justify-start';
  const [categoriesData, setCategoriesData] = useState<StaticCategory[]>([]);
  const [brandsData, setBrandsData] = useState<StaticBrand[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadFooterData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('/static/categories.json'),
          fetch('/static/brands.json'),
        ]);
        if (!mounted) return;
        if (categoriesRes.ok) {
          const categoriesJson = await categoriesRes.json();
          if (Array.isArray(categoriesJson)) {
            setCategoriesData(categoriesJson);
          }
        }
        if (brandsRes.ok) {
          const brandsJson = await brandsRes.json();
          if (Array.isArray(brandsJson)) {
            setBrandsData(brandsJson);
          }
        }
      } catch (err) {
        console.warn('Failed to load footer static data', err);
      }
    };

    loadFooterData();
    return () => {
      mounted = false;
    };
  }, []);

  const fallbackCategories = [
    { name: t.phones, count: 150 },
    { name: t.laptops, count: 85 },
    { name: t.tvs, count: 45 },
    { name: t.headphones, count: 120 },
    { name: t.homeAppliances, count: 75 },
    { name: t.gamingDevices, count: 60 }
  ];

  const categoryByCode = useMemo(() => {
    const map = new Map<string, StaticCategory>();
    categoriesData.forEach((cat) => map.set(String(cat.cat_code), cat));
    return map;
  }, [categoriesData]);

  const categories = useMemo(() => {
    const normalized = categoriesData.slice(0, 6).map((cat) => {
      const categoryBrandsCount = Array.isArray(cat.brands)
        ? cat.brands.length
        : brandsData.filter((b) => String(b.category_code || '') === String(cat.cat_code)).length;
      return {
        catCode: String(cat.cat_code),
        name: language === 'ar' ? cat.name : (cat.nameEn || cat.name),
        nameAr: cat.name,
        nameEn: cat.nameEn || cat.name,
        count: categoryBrandsCount
      };
    });
    if (normalized.length > 0) return normalized;
    return fallbackCategories.map((cat, index) => ({
      catCode: String(index),
      name: cat.name,
      nameAr: cat.name,
      nameEn: cat.name,
      count: cat.count
    }));
  }, [brandsData, categoriesData, fallbackCategories, language]);

  const brands = useMemo(() => {
    const normalized = brandsData
      .filter((brand) => String(brand.category_code || '') === '00' || String(brand.category_code || '') === '09')
      .slice(0, 8)
      .map((brand) => {
      const category = categoryByCode.get(String(brand.category_code || ''));
      const categoryAr = category?.name || '';
      const categoryEn = category?.nameEn || category?.name || '';
      return {
        name: language === 'ar' ? (brand.name || brand.englishName || '') : (brand.englishName || brand.name || ''),
        routeName: brand.englishName || brand.name || '',
        category: language === 'ar' ? categoryAr : categoryEn,
        categoryAr,
        categoryEn
      };
    });
    return  normalized ;
  }, [brandsData, categoryByCode, language]);

  const quickLinks = [
    { label: t.home, href: "#home" },
    { label: t.categories, href: "#categories" },
    { label: t.products, href: "#products" },
    { label: t.services, href: "#services" },
    { label: t.showrooms, href: "#showrooms" },
    { label: t.aboutUs, href: "#about" },
    { label: t.career, href: "#career" },
    { label: t.contact, href: "#contact" }
  ];

  const services = [
    { label: t.warranty, icon: Shield, action: onWarrantyClick },
    { label: t.maintenanceService, icon: Wrench, action: onMaintenanceClick },
    { label: t.downloadApp, icon: Download },
    { label: t.aboutCompany, icon: Building2, action: onAboutClick },
    { label: t.careers, icon: Briefcase }
  ];

  const contactInfo = [
    { icon: Phone, text: "+011 9909" },
    { icon: Mail, text: "info@mabco.biz" },
    { icon: MapPin, text: t.address }
  ];

  return (
    <footer 
      className="bg-gray-900 text-white mt-auto pt-16 pb-8 border-t border-gray-800"
      dir={textDirection}
    >
      <div className={`container mx-auto p-8 ${textAlign}`}>
        {/* Top Section - Fixed gradient */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12  ">
          {/* Company Info */}
          <div className={textAlign} style={{ direction: 'ltr' }} >
            <div className={`flex items-center gap-3 mb-6 ${flexDirection}`}>
              <img
                src="https://mabcoonline.com/images/Mabco%20100x100.jpg"
                alt="MABCO Logo"
                className="h-16 w-auto"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">MABCO</h3>
                <p className="text-gray-300 text-sm">
                  {t.largestStore}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              {t.companyDescription}
            </p>
            
            {/* Social Media */}
            <div className={`flex gap-4 ${justifyDirection}`}>
              <a
                href="https://www.facebook.com/mabco"
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-blue-700"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691V11.41h3.13V8.309c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.296h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mabco"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:from-purple-700 hover:to-pink-700"
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
              <a
                href="https://wa.me/963123456"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-green-600"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                  <path d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.44 0 0 5.44 0 12.06c0 2.12.56 4.2 1.62 6.03L0 24l6.13-1.6a11.94 11.94 0 0 0 5.93 1.51h.01c6.62 0 12.06-5.44 12.06-12.06 0-3.22-1.26-6.25-3.61-8.39Zm-8.46 18.4h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.22-3.64.95.97-3.55-.23-.37a9.92 9.92 0 0 1-1.53-5.24C2.21 6.37 6.57 2.01 12.06 2.01c2.64 0 5.12 1.03 6.98 2.89a9.85 9.85 0 0 1 2.89 6.98c0 5.49-4.36 9.86-9.87 9.86Zm5.41-7.38c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.25-.24-.57-.48-.5-.68-.5-.18 0-.37-.02-.57-.02-.2 0-.52.08-.8.37-.28.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.13 4.55.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35Z"/>
                </svg>
              </a>
              <a
                href="https://t.me/mabco"
                className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-[#1e89ba]"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                  <path d="M21.5 2.4 2.9 9.7c-1.3.5-1.3 1.3-.2 1.6l4.8 1.5 1.8 5.5c.2.6.4.8.8.8.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.8l3.1-14.7c.3-1.2-.5-1.7-1.4-1.3ZM9.1 13.8l9.4-5.9c.4-.2.8-.1.5.2l-7.8 7.1-.3 3.2-1.9-5.2Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className={textAlign} style={{ direction: 'ltr' }}>
            <h4 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
              {t.categories}
            </h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li
                  key={index}
                  onClick={() => onCategoryClick && onCategoryClick(category.catCode, category.nameAr, category.nameEn)}
                  className={`flex justify-between items-center hover:text-[#009FE3] transition-colors cursor-pointer group ${flexDirection}`}
                >
                  <span className={`text-gray-300 group-hover:text-[#009FE3] ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'} transition-all duration-300`}>
                    {category.name}
                  </span>
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-sm">
                    {category.count}+
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div className={textAlign} style={{ direction: 'ltr' }}>
            <h4 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
              {t.brands}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {brands.map((brand, index) => (
                <button
                  key={index}
                  onClick={() => onBrandClick && onBrandClick(brand.routeName, brand.categoryAr, brand.categoryEn)}
                  className={`bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg p-3 transition-all hover:scale-105 group `}
                >
                  <div className="font-medium group-hover:text-[#009FE3] transition-colors">
                    {brand.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {brand.category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Services */}
          <div className={textAlign} style={{ direction: 'ltr' }}>
            <h4 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
              {t.contactUs}
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              {contactInfo.map((info, index) => (
                <div key={index} className={`flex items-center gap-3 ${flexDirection}`}>
                  <div className="w-10 h-10 bg-[#009FE3] rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-300">{info.text}</span>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="grid grid-cols-2 gap-2"  style={{ direction: textDirection }}>
              {services.map((service, index) => (
                <button
                  key={index}
                  onClick={service.action}
                  className={`bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg p-2 text-sm flex items-center justify-center gap-2 transition-colors ${flexDirection}`}
                >
                  <service.icon className="w-4 h-4" />
                  {service.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className={`flex flex-wrap gap-6 justify-center`}>
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-[#009FE3] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              <p className="text-gray-400">
                © {new Date().getFullYear()} MABCO. {t.allRightsReserved}
              </p>
            </div>
            
            <div className={`flex flex-wrap gap-6 ${isRTL ? 'justify-end' : 'justify-center'}`}>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t.privacyPolicy}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t.termsOfService}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t.returnPolicy}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t.faq}
              </a>
            </div>
          </div>

          {/* SEO: Additional company info */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              {t.seoDescription}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
