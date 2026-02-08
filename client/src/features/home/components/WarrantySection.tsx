import { useState } from "react";
import { ChevronDown, Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import translations from '../../../i18n/translations';

interface WarrantySectionProps {
  language: "ar" | "en";
}

export function WarrantySection({ language }: WarrantySectionProps) {
  const isRTL = language === "ar";
  const [openSection, setOpenSection] = useState<number | null>(0);

  const t = translations[language];

  const sections = [
    {
      id: 0,
      title: t.basicCoverage,
      icon: Shield,
      content: t.basicContent,
      color: "text-blue-600"
    },
    {
      id: 1,
      title: t.extendedProtection,
      icon: CheckCircle,
      content: t.extendedContent,
      color: "text-green-600"
    },
    {
      id: 2,
      title: t.generalTerms,
      icon: AlertCircle,
      content: t.generalContent,
      color: "text-orange-600"
    },
    {
      id: 3,
      title: t.nonCovered,
      icon: XCircle,
      content: t.nonCoveredContent,
      color: "text-red-600"
    }
  ];

  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <section className="container mx-auto px-4 py-16" id="warranty-section" data-analytics-category="warranty">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-[#009FE3]" />
        </div>
        <h2 className="text-4xl text-gray-900 mb-3">{t.title}</h2>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-4xl mx-auto space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSection === section.id;
          
          return (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg"
            >
              {/* Section Header - Clickable */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-5 text-${isRTL ? 'right' : 'left'} transition-colors duration-200 hover:bg-gray-50`}
                data-analytics-action="accordion_toggle"
                data-analytics-label={section.title}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 ${section.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl text-gray-900">{section.title}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Section Content - Expandable */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-2 bg-gray-50 border-t border-gray-200">
                  <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {(Array.isArray(section.content) ? section.content : [section.content]).map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700"
                        style={{
                          animation: isOpen ? `slideInUp 0.3s ease-out ${index * 0.05}s both` : 'none'
                        }}
                      >
                        <span className={`flex-shrink-0 mt-1 ${section.color}`}>
                          <CheckCircle className="w-4 h-4" />
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animation Keyframes - Inline Style */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
export default WarrantySection;