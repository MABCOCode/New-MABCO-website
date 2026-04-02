import React, { useMemo, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { setSeo } from "../../../services/seo";

type FaqItem = {
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: {
      en: "What is MABCO Syria?",
      ar: "ما هي شركة MABCO؟",
    },
    answer: {
      en: "MABCO is a leading electronics and mobile retail and wholesale company in Syria, offering a wide range of smartphones, accessories, household electronics, and power solutions.",
      ar: "MABCO هي شركة رائدة في مجال تجارة الإلكترونيات والهواتف المحمولة بالجملة والمفرق في سوريا، وتوفر مجموعة واسعة من المنتجات مثل الهواتف الذكية، الإكسسوارات، الأجهزة المنزلية، وحلول الطاقة.",
    },
  },
  {
    question: {
      en: "Where is MABCO located and do you have showrooms?",
      ar: "أين تقع شركة MABCO وهل لديها فروع؟",
    },
    answer: {
      en: "MABCO operates across major Syrian cities with physical showrooms and distribution hubs. Please check our contact page or social media for the latest branch locations.",
      ar: "تتواجد فروع MABCO في عدة مدن سورية رئيسية، مع صالات عرض ونقاط توزيع. يمكنك زيارة صفحة “اتصل بنا” أو متابعة صفحاتنا على وسائل التواصل الاجتماعي لمعرفة العناوين المحدثة.",
    },
  },
  {
    question: {
      en: "Can individuals buy directly from MABCO?",
      ar: "هل يمكن للأفراد الشراء مباشرة من MABCO؟",
    },
    answer: {
      en: "Yes. MABCO welcomes individual buyers at its retail locations and via direct inquiries on WhatsApp or phone. Retail prices are competitive and reflect the latest market offers.",
      ar: "نعم، يمكن للعملاء الأفراد الشراء من فروع MABCO مباشرة أو التواصل معنا عبر الهاتف أو الواتساب. الأسعار منافسة ويتم تحديث العروض باستمرار.",
    },
  },
  {
    question: {
      en: "Does MABCO offer wholesale services?",
      ar: "هل تقدم MABCO خدمات البيع بالجملة؟",
    },
    answer: {
      en: "Yes. MABCO is a registered distributor and wholesaler. Businesses, retailers, and vendors can request bulk pricing and partnership terms.",
      ar: "نعم، MABCO تعمل كموزّع معتمد وتقدّم أسعاراً خاصة للبيع بالجملة للتجّار والشركات والمتاجر.",
    },
  },
  {
    question: {
      en: "How can I become a partner or supplier with MABCO?",
      ar: "كيف يمكنني أن أصبح شريكًا أو موردًا مع MABCO؟",
    },
    answer: {
      en: "We welcome new partnerships. Manufacturers, importers, or authorized agents interested in working with MABCO can contact our procurement department via our website or WhatsApp.",
      ar: "نرحّب بالتعاون مع شركاء جدد. إذا كنت مصنعًا أو موزعًا أو وكيلاً معتمدًا وترغب بالتعاون مع MABCO، يرجى التواصل مع قسم الشراكات من خلال موقعنا أو عبر الواتساب.",
    },
  },
  {
    question: {
      en: "What types of products does MABCO sell?",
      ar: "ما هي أنواع المنتجات التي تبيعها MABCO؟",
    },
    answer: {
      en: "MABCO specializes in smartphones, mobile accessories, smartwatches, chargers, speakers, TVs, and power solutions like EcoFlow batteries and solar-compatible gear.",
      ar: "نقدّم الهواتف الذكية، الإكسسوارات، الساعات الذكية، الشواحن، مكبرات الصوت، الشاشات، إضافة إلى حلول الطاقة مثل بطاريات EcoFlow والأجهزة القابلة للشحن بالطاقة الشمسية.",
    },
  },
  {
    question: {
      en: "Are MABCO’s products original and under warranty?",
      ar: "هل منتجات MABCO أصلية وتحت الضمان؟",
    },
    answer: {
      en: "Yes. All products are sourced from trusted suppliers and include valid warranties as per manufacturer or distributor policy. Our team provides after-sale support and guidance.",
      ar: "نعم، جميع المنتجات أصلية وتأتي مع ضمان رسمي حسب سياسة المورد أو الشركة المصنعة. كما نوفر خدمات الدعم الفني بعد البيع.",
    },
  },
  {
    question: {
      en: "Can MABCO provide power solutions like solar-compatible devices?",
      ar: "هل توفر MABCO حلول طاقة مثل الأجهزة الشمسية؟",
    },
    answer: {
      en: "Absolutely. MABCO is an authorized reseller of advanced power solutions including EcoFlow products, backup batteries, and solar-powered gear for homes and businesses.",
      ar: "نعم، نحن موزعون معتمدون لحلول الطاقة المتقدمة مثل أجهزة EcoFlow، البطاريات الاحتياطية، والمعدات القابلة للتوصيل بالألواح الشمسية للمنازل والشركات.",
    },
  },
  {
    question: {
      en: "Does MABCO offer delivery across Syria?",
      ar: "هل تقدم MABCO خدمات التوصيل داخل سوريا؟",
    },
    answer: {
      en: "Delivery is available across major Syrian cities. Orders can be arranged via WhatsApp, and delivery time depends on your location and product availability.",
      ar: "نعم، التوصيل متوفر في أغلب المدن السورية، ويتم تحديد الوقت والتكلفة حسب المدينة وتوفر المنتج. الرجاء التواصل معنا لترتيب الطلب.",
    },
  },
  {
    question: {
      en: "How can I contact MABCO for business inquiries?",
      ar: "كيف يمكنني التواصل مع MABCO للاستفسارات التجارية؟",
    },
    answer: {
      en: "For business inquiries, collaborations, or dealership opportunities, you can reach our team via the contact form on the official website, our WhatsApp business line, or social media.",
      ar: "للاستفسارات التجارية أو فرص التعاون، يمكن التواصل معنا عبر النموذج الموجود في موقعنا الرسمي أو عبر واتساب أو منصات التواصل الاجتماعي.",
    },
  },
  {
    question: {
      en: "Are bulk discounts available for schools, NGOs, or institutions?",
      ar: "هل تقدمون خصومات خاصة للمؤسسات كالمدارس أو الجمعيات؟",
    },
    answer: {
      en: "Yes. We provide custom quotes and special deals for organizations needing bulk orders of electronics, IT gear, or power solutions. Contact our sales team directly.",
      ar: "نعم، نقدم عروضاً وخصومات مخصصة للطلب بالجملة من قبل الجهات الحكومية أو المنظمات غير الربحية أو المؤسسات التعليمية. تواصل معنا للحصول على عرض سعر.",
    },
  },
  {
    question: {
      en: "Can I view available stock and offers online?",
      ar: "هل يمكنني مشاهدة المنتجات والعروض أونلاين؟",
    },
    answer: {
      en: "Our website and social media channels regularly update new arrivals, available stock, and special offers. For real-time availability, please contact us directly.",
      ar: "نقوم بتحديث صفحاتنا على الإنترنت ووسائل التواصل بأحدث العروض والمنتجات المتوفرة. للمزيد من التفاصيل الآنية، ننصح بالتواصل المباشر.",
    },
  },
];

const FaqAccordion: React.FC<{ items: FaqItem[]; isRTL: boolean; language: "ar" | "en" }> = ({
  items,
  isRTL,
  language,
}) => {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 ">
      {items.map((item, index) => {
        const isOpen = openSection === index;
        return (
          <div
            key={`${item.question.en}-${index}`}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => toggleSection(index)}
              className={`w-full flex items-center justify-between p-5 text-${isRTL ? "right" : "left"} transition-colors duration-200 hover:bg-gray-50`}
            >
              <div className="flex items-center gap-4">
                <h3 className="text-lg text-gray-900">
                  {language === "ar" ? item.question.ar || item.question.en : item.question.en || item.question.ar}
                </h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 pt-2 bg-gray-50 border-t border-gray-200">
                <p className={`text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
                  {language === "ar" ? item.answer.ar || item.answer.en : item.answer.en || item.answer.ar}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FaqPage: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const title = language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions";
  const subtitle =
    language === "ar"
      ? "إجابات مختصرة لأكثر الأسئلة شيوعاً حول خدمات MABCO"
      : "Quick answers to the most common questions about MABCO.";

  useMemo(() => {
    const description =
      language === "ar"
        ? "تعرّف على أبرز الأسئلة والإجابات حول خدمات ومنتجات MABCO في سوريا."
        : "Explore the most common questions and answers about MABCO in Syria.";
    setSeo({
      title: `${title} | MABCO`,
      description,
      url: window.location.href,
      image: "https://mabcoonline.com/images/giphy.gif",
    });
  }, [language, title]);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 pb-20 py-16"
    >
      <div className="container mx-auto px-4 py-10 md:py-16 lg:py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-2xl mb-6 icon-hover">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg">{subtitle}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] mx-auto rounded-full mt-6"></div>
        </div>
        <FaqAccordion items={FAQ_ITEMS} isRTL={isRTL} language={language === "ar" ? "ar" : "en"} />
      </div>
    </div>
  );
};

export default FaqPage;
