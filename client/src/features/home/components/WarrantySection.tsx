import { useState } from "react";
import { ChevronDown, Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface WarrantySectionProps {
  language: "ar" | "en";
}

export function WarrantySection({ language }: WarrantySectionProps) {
  const isRTL = language === "ar";
  const [openSection, setOpenSection] = useState<number | null>(0);

  const t = {
    ar: {
      title: "الضمان والسياسات",
      subtitle: "التزامنا بحماية استثمارك",
      basicCoverage: "التغطية الأساسية للضمان",
      extendedProtection: "الحماية الموسعة",
      generalTerms: "الشروط والأحكام العامة",
      nonCovered: "الحالات غير المشمولة بالضمان",
      
      basicContent: [
        "ضمان البرمجيات لمدة <strong>24 شهراً</strong> كاملة من تاريخ الشراء",
        "صيانة التصنيع لمدة <strong>12 شهراً</strong> شاملة قطع الغيار والعمالة",
        "<strong>15 يوماً</strong> لاستبدال المنتج في حالة عيوب التصنيع",
        "خدمة الدعم الفني المجانية طوال فترة الضمان",
        "مراكز خدمة معتمدة في 6 مدن سورية"
      ],
      
      extendedContent: [
        "حماية سوء الاستخدام لمدة <strong>100 يوم</strong>",
        "تغطية كسر الشاشة والأضرار الناتجة عن السواقل",
        "حماية اللوحة الأم والبطارية من الأضرار العرضية",
        "استبدال سريع في حالات الأعطال المشمولة",
        "فنيون معتمدون وقطع غيار أصلية 100%"
      ],
      
      generalContent: [
        "يجب الاحتفاظ بفاتورة الشراء الأصلية",
        "الضمان ساري في جميع فروعنا ومراكز الخدمة المعتمدة",
        "يتم فحص المنتج من قبل مهندسين معتمدين",
        "مدة الإصلاح القياسية: 3-7 أيام عمل",
        "الضمان قابل للتحويل مع المنتج في حالة البيع"
      ],
      
      nonCoveredContent: [
        "الأضرار المتعمدة أو سوء الاستخدام المتعمد",
        "التلف الناتج عن الكوارث الطبيعية",
        "التعديلات غير المصرح بها أو الصيانة من جهات غير معتمدة",
        "الخدش والتآكل الطبيعي للأسطح الخارجية",
        "المنتجات المستخدمة لأغراض تجارية"
      ]
    },
    en: {
      title: "Warranty & Policies",
      subtitle: "Our commitment to protecting your investment",
      basicCoverage: "Basic Warranty Coverage",
      extendedProtection: "Extended Protection",
      generalTerms: "General Terms & Conditions",
      nonCovered: "Non-Covered Cases",
      
      basicContent: [
        "Software warranty for <strong>24 months</strong> from date of purchase",
        "Manufacturing maintenance for <strong>12 months</strong> including parts and labor",
        "<strong>15 days</strong> product replacement for manufacturing defects",
        "Free technical support throughout warranty period",
        "Authorized service centers in 6 Syrian cities"
      ],
      
      extendedContent: [
        "Misuse protection for <strong>100 days</strong>",
        "Coverage for screen breaks and liquid damage",
        "Motherboard and battery accidental damage protection",
        "Quick replacement for covered failures",
        "Certified technicians and 100% genuine spare parts"
      ],
      
      generalContent: [
        "Original purchase invoice must be retained",
        "Warranty valid at all our branches and authorized service centers",
        "Products inspected by certified engineers",
        "Standard repair time: 3-7 business days",
        "Warranty transferable with product in case of resale"
      ],
      
      nonCoveredContent: [
        "Intentional damage or deliberate misuse",
        "Damage from natural disasters",
        "Unauthorized modifications or non-authorized repairs",
        "Normal wear and tear of external surfaces",
        "Products used for commercial purposes"
      ]
    }
  };

  const sections = [
    {
      id: 0,
      title: t[language].basicCoverage,
      icon: Shield,
      content: t[language].basicContent,
      color: "text-blue-600"
    },
    {
      id: 1,
      title: t[language].extendedProtection,
      icon: CheckCircle,
      content: t[language].extendedContent,
      color: "text-green-600"
    },
    {
      id: 2,
      title: t[language].generalTerms,
      icon: AlertCircle,
      content: t[language].generalContent,
      color: "text-orange-600"
    },
    {
      id: 3,
      title: t[language].nonCovered,
      icon: XCircle,
      content: t[language].nonCoveredContent,
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
        <h2 className="text-4xl text-gray-900 mb-3">{t[language].title}</h2>
        <p className="text-lg text-gray-600">{t[language].subtitle}</p>
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
                    {section.content.map((item, index) => (
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