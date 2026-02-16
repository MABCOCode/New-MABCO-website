import {
  Printer,
  Gamepad2,
  Zap,
  Wrench,
  CreditCard,
  Shield,
  ArrowRight,
  Sparkles,
  Star,
  MapPin,
} from "lucide-react";
import { servicesData } from "../../../data/servicesData";
import { useLanguage } from "../../../context/LanguageContext";

interface ServicesGridProps {
  language?: "ar" | "en";
  onServiceClick: (servicePath: string) => void;
}

const iconMap: { [key: string]: any } = {
  Printer,
  Gamepad2,
  Zap,
  Wrench,
  CreditCard,
  Shield,
};

export function ServicesGrid({ language, onServiceClick }: ServicesGridProps) {
  const { t, language: lang } = useLanguage();
  const activeLang = language || lang;

  return (
    <section id="services" className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">{t("services")}</span>
            </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("ourServices")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("services_subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => onServiceClick(service.path)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  
                }}
        
                
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative p-8" style={{ textAlign: "center" }}>
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} group-hover:bg-white group-hover:shadow-xl transition-all duration-500`}
                    >
                      <IconComponent className="w-8 h-8 text-white group-hover:text-gray-900 transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors duration-500">
                    {activeLang === "ar" ? service.nameAr : service.nameEn}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 group-hover:text-white/90 mb-6 transition-colors duration-500 leading-relaxed">
                    {activeLang === "ar" ? service.descriptionAr : service.descriptionEn}
                  </p>

                  {/* CTA Button */}
                  <div className="flex items-center gap-2 justify-center text-[#009FE3] group-hover:text-white font-bold transition-colors duration-500">
                    <span>{t("exploreService")}</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            );
          })}
        </div>

        {/* JSON-LD SEO for services */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("ourServices"),
            description: t("services_subtitle"),
            itemListElement: servicesData.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Service",
                name: activeLang === "ar" ? s.nameAr : s.nameEn,
                description: activeLang === "ar" ? s.descriptionAr : s.descriptionEn,
                url: `${typeof window !== 'undefined' ? window.location.origin : ''}/services/${s.path}`,
              },
            })),
          })}
        </script>

      <nav className="mt-12 text-center" aria-label={activeLang === 'ar' ? "روابط الخدمات ذات الصلة" : "Related service links"}>
        <p className="text-gray-600 mb-4 font-medium">
          {t("discoverMore")}
        </p>
        <ul className="flex flex-wrap justify-center gap-6">
          <li>
            <a 
              href="#warranty-section" 
              className="text-[#009FE3] hover:text-[#007BC7] hover:underline transition-colors inline-flex items-center gap-1"
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span>{t("warrantyPolicies")}</span>
            </a>
          </li>
          <li>
            <a 
              href="#company-strength" 
              className="text-[#009FE3] hover:text-[#007BC7] hover:underline transition-colors inline-flex items-center gap-1"
            >
              <Star className="w-4 h-4" aria-hidden="true" />
              <span>{t("companyStrength")}</span>
            </a>
          </li>
          <li>
            <a 
              href="#showrooms" 
              className="text-[#009FE3] hover:text-[#007BC7] hover:underline transition-colors inline-flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{t("showrooms")}</span>
            </a>
          </li>
        </ul>
      </nav>
      </div>
    </section>
  );
}
