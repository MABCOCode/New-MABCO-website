// components/layout/ModernFooter.tsx
import React from 'react';
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Send, 
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
  onAboutClick?: () => void;
  onShowroomsClick?: () => void;
  onWarrantyClick?: () => void;
  onMaintenanceClick?: () => void;
}

const ModernFooter: React.FC<ModernFooterProps> = ({
  language = 'ar',
  onBrandClick,
  onAboutClick,
  onShowroomsClick,
  onWarrantyClick,
  onMaintenanceClick
}) => {
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';
  const textDirection = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'text-right' : 'text-left';
  const flexDirection = isRTL ? 'flex-row-reverse' : 'flex-row';

  const brands = [
    { name: "Samsung", category: t('phones'), categoryEn: "Phones" },
    { name: "iPhone (Apple)", category: t('phones'), categoryEn: "Phones" },
    { name: "Xiaomi", category: t('phones'), categoryEn: "Phones" },
    { name: "Sony", category: t('electronics'), categoryEn: "Electronics" },
    { name: "Honor", category: t('phones'), categoryEn: "Phones" },
    { name: "EcoFlow", category: t('power'), categoryEn: "Power" },
    { name: "Deye", category: t('solarPower'), categoryEn: "Solar Power" }
  ];

  const categories = [
    { name: t('phones'), count: 150 },
    { name: t('laptops'), count: 85 },
    { name: t('tvs'), count: 45 },
    { name: t('headphones'), count: 120 },
    { name: t('homeAppliances'), count: 75 },
    { name: t('gamingDevices'), count: 60 }
  ];

  const quickLinks = [
    { label: t('home'), href: "#home" },
    { label: t('categories'), href: "#categories" },
    { label: t('products'), href: "#products" },
    { label: t('services'), href: "#services" },
    { label: t('showrooms'), href: "#showrooms" },
    { label: t('aboutUs'), href: "#about" },
    { label: t('career'), href: "#career" },
    { label: t('contact'), href: "#contact" }
  ];

  const services = [
    { label: t('warranty'), icon: Shield, action: onWarrantyClick },
    { label: t('maintenanceService'), icon: Wrench, action: onMaintenanceClick },
    { label: t('downloadApp'), icon: Download },
    { label: t('aboutCompany'), icon: Building2, action: onAboutClick },
    { label: t('careers'), icon: Briefcase }
  ];

  const contactInfo = [
    { icon: Phone, text: "+963 11 123 4567" },
    { icon: Mail, text: "info@mabcoonline.com" },
    { icon: MapPin, text: t('address') }
  ];

  return (
    <footer 
      className="bg-gray-900 text-white mt-auto pt-16 pb-8 border-t border-gray-800"
      dir={textDirection}
    >
      <div className={`container mx-auto p-8 ${textAlign}`}>
        {/* Top Section - Fixed gradient */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className={`flex items-center gap-3 mb-6 ${flexDirection}`}>
              <img
                src="https://mabcoonline.com/images/Mabco%20100x100.jpg"
                alt="MABCO Logo"
                className="h-16 w-auto"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">MABCO</h3>
                <p className="text-gray-300 text-sm">
                  {t('largestStore')}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              {t('companyDescription')}
            </p>
            
            {/* Social Media */}
            <div className={`flex gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <a href="https://www.facebook.com/mabco" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-blue-700">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.instagram.com/mabco" className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:from-purple-700 hover:to-pink-700">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://wa.me/963123456" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-green-600">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a href="https://t.me/mabco" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-blue-600">
                <Send className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
              {t('categories')}
            </h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index} className={`flex justify-between items-center hover:text-[#009FE3] transition-colors cursor-pointer group ${flexDirection}`}>
                  <span className={`text-gray-300 group-hover:text-[#009FE3] ${isRTL ? 'group-hover:translate-x-2' : 'group-hover:translate-x-2'} transition-all duration-300`}>
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
          <div>
            <h4 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
              {t('brands')}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {brands.map((brand, index) => (
                <button
                  key={index}
                  onClick={() => onBrandClick && onBrandClick(brand.name, brand.category, brand.categoryEn)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg p-3 text-center transition-all hover:scale-105 group"
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
          <div>
            <h4 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
              {t('contactUs')}
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
            <div className="grid grid-cols-2 gap-2">
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
          <div className="flex flex-wrap justify-center gap-6">
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
                © {new Date().getFullYear()} MABCO. {t('allRightsReserved')}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('privacyPolicy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('termsOfService')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('returnPolicy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('faq')}
              </a>
            </div>
          </div>

          {/* SEO: Additional company info */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              {t('seoDescription')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;