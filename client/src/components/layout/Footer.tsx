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
    const translations = {
      ar: {
        home: "الرئيسية",
        categories: "الأقسام",
        products: "المنتجات",
        services: "الخدمات",
        showrooms: "المعارض",
        aboutUs: "من نحن",
        career: "الوظائف",
        contact: "اتصل بنا",
        brands: "العلامات التجارية",
        warranty: "الضمان",
        allRightsReserved: "جميع الحقوق محفوظة"
      },
      en: {
        home: "Home",
        categories: "Categories",
        products: "Products",
        services: "Services",
        showrooms: "Showrooms",
        aboutUs: "About Us",
        career: "Career",
        contact: "Contact Us",
        brands: "Brands",
        warranty: "Warranty",
        allRightsReserved: "All Rights Reserved"
      }
    };
    return translations[language][key] || key;
  };

  const brands = [
    { name: "Samsung", category: language === 'ar' ? "هواتف" : "Phones" },
    { name: "iPhone (Apple)", category: language === 'ar' ? "هواتف" : "Phones" },
    { name: "Xiaomi", category: language === 'ar' ? "هواتف" : "Phones" },
    { name: "Sony", category: language === 'ar' ? "إلكترونيات" : "Electronics" },
    { name: "Honor", category: language === 'ar' ? "هواتف" : "Phones" },
    { name: "EcoFlow", category: language === 'ar' ? "طاقة" : "Power" },
    { name: "Deye", category: language === 'ar' ? "طاقة شمسية" : "Solar Power" }
  ];

  const categories = [
    { name: language === 'ar' ? "الهواتف" : "Phones", count: 150 },
    { name: language === 'ar' ? "اللابتوبات" : "Laptops", count: 85 },
    { name: language === 'ar' ? "التلفزيونات" : "TVs", count: 45 },
    { name: language === 'ar' ? "السماعات" : "Headphones", count: 120 },
    { name: language === 'ar' ? "الأجهزة المنزلية" : "Home Appliances", count: 75 },
    { name: language === 'ar' ? "أجهزة الألعاب" : "Gaming", count: 60 }
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
    { label: language === 'ar' ? "خدمة الصيانة" : "Maintenance Service", icon: Wrench, action: onMaintenanceClick },
    { label: language === 'ar' ? "تحميل التطبيق" : "Download App", icon: Download },
    { label: language === 'ar' ? "عن الشركة" : "About Company", icon: Building2, action: onAboutClick },
    { label: language === 'ar' ? "الوظائف" : "Careers", icon: Briefcase }
  ];

  const contactInfo = [
    { icon: Phone, text: "+963 11 123 4567" },
    { icon: Mail, text: "info@mabcoonline.com" },
    { icon: MapPin, text: language === 'ar' ? "دمشق، شارع الحمرا" : "Damascus, Al Hamra Street" }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto p-8">
        {/* Top Section - Fixed gradient */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://mabcoonline.com/images/Mabco%20100x100.jpg"
                alt="MABCO Logo"
                className="h-16 w-auto"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">MABCO</h3>
                <p className="text-gray-300 text-sm">
                  {language === 'ar' ? 'أكبر متجر إلكتروني في سوريا' : 'Largest Electronics Store in Syria'}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              {language === 'ar' 
                ? 'متخصصون في بيع الأجهزة الإلكترونية والكهربائية الأصلية بضمان معتمد منذ عام 2008'
                : 'Specialized in selling original electronic and electrical devices with certified warranty since 2008'}
            </p>
            
            {/* Social Media */}
            <div className="flex gap-4">
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
                <li key={index} className="flex justify-between items-center hover:text-[#009FE3] transition-colors cursor-pointer group">
                  <span className="text-gray-300 group-hover:text-[#009FE3] group-hover:translate-x-2 transition-all duration-300">
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
                  onClick={() => onBrandClick && onBrandClick(brand.name, brand.category, brand.category)}
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
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3">
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
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg p-2 text-sm flex items-center justify-center gap-2 transition-colors"
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {new Date().getFullYear()} MABCO. {t('allRightsReserved')}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {language === 'ar' ? 'سياسة الإرجاع' : 'Return Policy'}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
              </a>
            </div>
          </div>

          {/* SEO: Additional company info */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              {language === 'ar' 
                ? 'متجر MABCO الإلكتروني - رقم 1 في سوريا لبيع الأجهزة الإلكترونية، الهواتف الذكية، اللابتوبات، التلفزيونات، الأجهزة المنزلية، والألعاب الإلكترونية'
                : 'MABCO Online Store - #1 in Syria for Electronics, Smartphones, Laptops, TVs, Home Appliances, and Gaming Devices'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;