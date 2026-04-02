import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

const SitemapPage: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const links = [
    { href: "/", label: isArabic ? "الصفحة الرئيسية" : "Home" },
    { href: "/#categories", label: isArabic ? "الأقسام" : "Categories" },
    { href: "/products", label: isArabic ? "المنتجات" : "Products" },
    { href: "/#services", label: isArabic ? "الخدمات" : "Services" },
    { href: "/showrooms", label: isArabic ? "المعارض" : "Showrooms" },
    { href: "/about", label: isArabic ? "من نحن" : "About Us" },
    { href: "/career", label: isArabic ? "الوظائف" : "Careers" },
    { href: "/#contact", label: isArabic ? "اتصل بنا" : "Contact" },
  ];

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isArabic ? "خريطة الموقع" : "Sitemap"}
          </h1>
          <p className="text-gray-600 mb-8">
            {isArabic
              ? "روابط الصفحات الأساسية في موقع مابكو."
              : "Quick links to the main pages on MABCO."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl border border-gray-200 px-4 py-3 text-gray-700 hover:border-[#009FE3] hover:text-[#009FE3] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SitemapPage;
