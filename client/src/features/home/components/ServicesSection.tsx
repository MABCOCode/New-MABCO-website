// components/ServicesSection.tsx
import React from 'react';
import {
  Settings,
  Shield,
  Wrench,
  Download,
  CreditCard,
  Banknote,
  MapPin,
  Star,
  Building2
} from 'lucide-react';

interface ServicesSectionProps {
  language: 'ar' | 'en';
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ language }) => {
  const services = [
    { 
      name: language === 'ar' ? "الضمان على المنتج" : "Product Warranty", 
      icon: Settings,
      description: language === 'ar' 
        ? "ضمان رسمي معتمد على جميع المنتجات"
        : "Official certified warranty on all products"
    },
    { 
      name: language === 'ar' ? "الدعم بعد البيع" : "After Sales Support", 
      icon: Shield,
      description: language === 'ar' 
        ? "دعم فني متخصص على مدار الساعة"
        : "24/7 specialized technical support"
    },
    { 
      name: language === 'ar' ? "خدمة الصيانة" : "Maintenance Service", 
      icon: Wrench,
      description: language === 'ar' 
        ? "نقدم خدمات صيانة متكاملة لجميع المنتجات الإلكترونية بفريق فني متخصص ومعتمد"
        : "We provide comprehensive maintenance services for all electronic products with a specialized and certified technical team"
    },
    { 
      name: language === 'ar' ? "تحميل التطبيقات" : "Download Apps", 
      icon: Download,
      description: language === 'ar' 
        ? "نساعدك في تحميل وتثبيت جميع التطبيقات"
        : "We help you download and install all applications"
    },
    { 
      name: language === 'ar' ? "تفعيل الحسابات" : "Activate Accounts", 
      icon: CreditCard,
      description: language === 'ar' 
        ? "تفعيل حسابات التطبيقات والخدمات"
        : "Activate application and service accounts"
    },
    { 
      name: language === 'ar' ? "التسديد الإلكتروني" : "Electronic Payment", 
      icon: Banknote,
      description: language === 'ar' 
        ? "أنظمة دفع إلكتروني آمنة ومتعددة"
        : "Secure and multiple electronic payment systems"
    },
  ];

  const translations = {
    ourServices: language === 'ar' ? "خدماتنا المميزة" : "Our Services",
    discoverMore: language === 'ar' ? "اكتشف المزيد:" : "Discover more:",
    warrantyPolicies: language === 'ar' ? "الضمان والسياسات" : "Warranty & Policies",
    companyStrength: language === 'ar' ? "قوة الشركة" : "Company Strength",
    showrooms: language === 'ar' ? "صالات العرض" : "Showrooms"
  };

  return (
    <section
      id="services"
      className="container mx-auto px-4 py-16 bg-white/50"
      aria-labelledby="services-heading"
    >
      <h2 id="services-heading" className="text-4xl font-bold text-gray-900 mb-6 text-center">
        {translations.ourServices}
      </h2>
      
      {/* SEO: Introductory text with keywords */}
      <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
        {language === 'ar'
          ? "نقدم مجموعة شاملة من الخدمات المتكاملة لضمان تجربة استثنائية قبل وبعد البيع. من الضمان الرسمي المعتمد إلى خدمات الصيانة المتخصصة والدعم الفني على مدار الساعة في جميع صالات العرض."
          : "We provide a comprehensive range of integrated services to ensure an exceptional pre and post-sale experience. From official authorized warranty to specialized maintenance services and 24/7 technical support across all showrooms."}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <article
              key={index}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-[#009FE3]/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
      
      {/* SEO: Internal linking to related sections */}
      <nav className="mt-12 text-center" aria-label={language === 'ar' ? "روابط الخدمات ذات الصلة" : "Related service links"}>
        <p className="text-gray-600 mb-4 font-medium">
          {translations.discoverMore}
        </p>
        <ul className="flex flex-wrap justify-center gap-6">
          <li>
            <a 
              href="#warranty" 
              className="text-[#009FE3] hover:text-[#007BC7] hover:underline transition-colors inline-flex items-center gap-1"
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span>{translations.warrantyPolicies}</span>
            </a>
          </li>
          <li>
            <a 
              href="#company-strength" 
              className="text-[#009FE3] hover:text-[#007BC7] hover:underline transition-colors inline-flex items-center gap-1"
            >
              <Star className="w-4 h-4" aria-hidden="true" />
              <span>{translations.companyStrength}</span>
            </a>
          </li>
          <li>
            <a 
              href="#showrooms" 
              className="text-[#009FE3] hover:text-[#007BC7] hover:underline transition-colors inline-flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{translations.showrooms}</span>
            </a>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default ServicesSection;