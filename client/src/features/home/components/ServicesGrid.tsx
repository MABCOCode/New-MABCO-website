import {
  ArrowRight,
  CreditCard,
  Gamepad2,
  MapPin,
  Printer,
  Shield,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { servicesData } from "../../../data/servicesData";
import { MotionStagger, MotionStaggerItem } from "../../../components/motion/MotionWrapper";

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
        <MotionStagger className="flex flex-wrap justify-center gap-4 md:gap-6" staggerDelay={0.05}>
          {servicesData.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <MotionStaggerItem key={service.id}>
                <div
                  className="group relative bg-white rounded-lg border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer w-32 sm:w-36 md:w-40 flex-shrink-0"
                  onClick={() => onServiceClick(service.path)}
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="relative p-4 md:p-6" style={{ textAlign: "center" }}>
                    {/* Icon */}
                    <div className="mb-2 md:mb-3">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gradient-to-br ${service.gradient} group-hover:bg-white group-hover:shadow-xl transition-all duration-500`}
                      >
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-gray-900 transition-colors duration-500" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-white transition-colors duration-500">
                      {activeLang === "ar" ? service.nameAr : service.nameEn}
                    </h3>

                    {/* Description - Commented Out */}
                    {/* <p className="text-gray-600 group-hover:text-white/90 mb-6 transition-colors duration-500 leading-relaxed">
                      {activeLang === "ar" ? service.descriptionAr : service.descriptionEn}
                    </p> */}

                    {/* CTA Button */}
                    <div className="hidden group-hover:flex items-center gap-1 justify-center text-white font-bold transition-colors duration-500 mt-2 text-xs">
                      <span>{t("exploreService")}</span>
                      <ArrowRight className="w-3 h-3 transform" />
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>

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
              href="/showrooms" 
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
