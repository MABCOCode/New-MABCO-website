import {
  Award,
  Briefcase,
  Building2,
  CheckCircle,
  Globe,
  Headphones,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Shield,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotionWrapper, MotionStagger, MotionStaggerItem } from "../../../components/motion/MotionWrapper";
import { useLanguage } from "../../../context/LanguageContext";

interface AboutUsPageProps {
  language: "ar" | "en";
  onClose: () => void;
}

export function AboutUsPage({ language, onClose }: AboutUsPageProps) {
  const isArabic = language === "ar";

  const content = {
    ar: {
      title: "من نحن",
      subtitle: "MABCO - الشركة الرائدة في الإلكترونيات والهواتف المحمولة في سوريا",
      tagline: "شريكك الموثوق في تجارة الجملة لتكنولوجيا الهواتف منذ عام 1999",
      whoWeAre: "من نحن",
      whoWeAreText: [
        "مرحباً بكم في MABCO — الموزع الرائد للهواتف المحمولة وبائع التجزئة للإلكترونيات في سوريا. منذ تأسيسنا في عام 1999، التزمنا بتقديم أحدث تقنيات الهواتف المحمولة وخدمة عملاء استثنائية ودعم ضمان رائد في الصناعة.",
        "مع أكثر من عقدين من الخبرة، بنت MABCO سمعة قوية كشريك موثوق للعلامات التجارية العالمية الرائدة، بما في ذلك Nokia و Samsung و Apple و Xiaomi و Huawei. سواء كنت بائع تجزئة أو تاجر جملة أو مستخدم عادي، نوفر وصولاً لا مثيل له لأحدث الهواتف المحمولة والإكسسوارات والحلول الرقمية بأسعار تنافسية."
      ],
      whatWeOffer: "ما نقدمه",
      offerings: [
        {
          title: "الهواتف المحمولة",
          description: "من الهواتف الذكية الرائدة إلى هواتف الميزات بأسعار معقولة، نخزن أحدث الموديلات من العلامات التجارية الرائدة.",
          icon: "smartphone"
        },
        {
          title: "الإكسسوارات",
          description: "الشواحن، سماعات الرأس، الحافظات والمزيد — جميعها 100٪ أصلية ومفحوصة الجودة.",
          icon: "headphones"
        },
        {
          title: "الإلكترونيات والأجهزة",
          description: "أجهزة اللابتوب، الأجهزة اللوحية، الشاشات، الساعات الذكية، أجهزة التلفزيون، وملحقات الكمبيوتر.",
          icon: "laptop"
        },
        {
          title: "خدمات التجزئة والجملة",
          description: "حلول مخصصة للأفراد ومشتري الكميات الكبيرة.",
          icon: "briefcase"
        },
        {
          title: "خدمات الصيانة والضمان",
          description: "مهندسون معتمدون ومراكز إصلاح رسمية تضمن دعم ما بعد البيع الموثوق.",
          icon: "wrench"
        }
      ],
      regionalPresence: "التواجد الإقليمي",
      regionalText: "امتد التزام MABCO بالتميز إلى ما وراء سوريا، مع عمليات في العراق والسودان، حيث نعمل أيضاً كموزعين رسميين لعلامات تجارية لتكنولوجيا الهواتف المحمولة.",
      whyChoose: "لماذا تختار MABCO؟",
      reasons: [
        "موزع معتمد",
        "منتجات أصلية 100٪",
        "ضمان وإصلاحات احترافية",
        "شبكة توزيع إقليمية",
        "نهج يركز على العملاء"
      ],
      contactUs: "اتصل بنا",
      contactText: "سواء كنت عميلاً أو بائع تجزئة، نرحب بفرصة العمل معك. قم بزيارة إحدى صالات العرض لدينا أو تواصل معنا عبر الإنترنت.",
      locations: "المواقع",
      locationsList: "دمشق، حلب، طرطوس، حمص، حماة، اللاذقية",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      website: "الموقع الإلكتروني",
      closing: "اختبر مستقبل الهاتف المحمول مع MABCO — حيث تلتقي الجودة بالثقة."
    },
    en: {
      title: "About Us",
      subtitle: "MABCO - The Leading Electronics & Mobile Company in Syria",
      tagline: "Your Trusted Wholesale Partner in Mobile Technology Since 1999",
      whoWeAre: "Who We Are",
      whoWeAreText: [
        "Welcome to MABCO — the leading mobile phone distributor and electronics retailer in Syria. Since our founding in 1999, we have been committed to delivering the latest in mobile technology, exceptional customer service, and industry-leading warranty support.",
        "With over two decades of experience, MABCO has built a strong reputation as a trusted partner for top global brands, including Nokia, Samsung, Apple, Xiaomi, and Huawei. Whether you're a retailer, wholesaler, or everyday user, we provide unmatched access to the newest mobile phones, accessories, and digital solutions at competitive prices."
      ],
      whatWeOffer: "What We Offer",
      offerings: [
        {
          title: "Mobile Phones",
          description: "From flagship smartphones to affordable feature phones, we stock the latest models from leading brands.",
          icon: "smartphone"
        },
        {
          title: "Accessories",
          description: "Chargers, headphones, cases, and more — all 100% original and quality-checked.",
          icon: "headphones"
        },
        {
          title: "Electronics & Devices",
          description: "Laptops, tablets, monitors, smartwatches, TVs, and computer peripherals.",
          icon: "laptop"
        },
        {
          title: "Retail & Wholesale Services",
          description: "Tailored solutions for individuals and bulk buyers.",
          icon: "briefcase"
        },
        {
          title: "Authorized Maintenance & Warranty Services",
          description: "Certified engineers and official repair centers ensure trusted after-sales support.",
          icon: "wrench"
        }
      ],
      regionalPresence: "Regional Presence",
      regionalText: "MABCO's commitment to excellence has extended beyond Syria, with operations in Iraq and Sudan, where we also serve as official distributors for mobile technology brands.",
      whyChoose: "Why Choose MABCO?",
      reasons: [
        "Authorized Distributor",
        "100% Genuine Products",
        "Professional Warranty & Repairs",
        "Regional Distribution Network",
        "Customer-Centric Approach"
      ],
      contactUs: "Contact Us",
      contactText: "Whether you're a customer, reseller, we welcome the opportunity to work with you. Visit one of our showrooms or reach out online.",
      locations: "Locations",
      locationsList: "Damascus, Aleppo, Tartus, Homs, Hama, Latakia",
      email: "Email",
      phone: "Phone",
      website: "Website",
      closing: "Experience the future of mobile with MABCO — where quality meets trust."
    }
  };

  const t = content[language];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "smartphone": return <Smartphone className="w-10 h-10 text-white" />;
      case "headphones": return <Headphones className="w-10 h-10 text-white" />;
      case "laptop": return <Laptop className="w-10 h-10 text-white" />;
      case "briefcase": return <Briefcase className="w-10 h-10 text-white" />;
      case "wrench": return <Wrench className="w-10 h-10 text-white" />;
      default: return <Building2 className="w-10 h-10 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <MotionWrapper>
        <div className="relative bg-gradient-to-br from-[#009FE3] via-[#0087CC] to-[#007BC7] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <p className="text-sm font-semibold tracking-wide">{t.tagline}</p>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{t.title}</h1>
              <p className="text-xl md:text-2xl opacity-95 leading-relaxed max-w-3xl mx-auto">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>
      </MotionWrapper>

      <div className="max-w-7xl mx-auto px-6">
        <section className="py-20">
          <MotionWrapper>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-2xl mb-6 icon-hover">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.whoWeAre}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] mx-auto rounded-full"></div>
            </div>
          </MotionWrapper>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {t.whoWeAreText.map((paragraph, index) => (
              <MotionWrapper key={index} delay={0.1 * (index + 1)}>
                <p className={`text-lg md:text-xl text-gray-700 leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`} style={{ lineHeight: '2' }}>
                  {paragraph}
                </p>
              </MotionWrapper>
            ))}
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

        <section className="py-20">
          <MotionWrapper>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-2xl mb-6 icon-hover">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.whatWeOffer}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] mx-auto rounded-full"></div>
            </div>
          </MotionWrapper>
          
          <MotionStagger staggerDelay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.offerings.map((offering, index) => (
                <MotionStaggerItem key={index}>
                  <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#009FE3]/5 to-[#007BC7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative p-8">
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          {getIcon(offering.icon)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        {offering.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-center" style={{ lineHeight: '1.8' }}>
                        {offering.description}
                      </p>
                    </div>
                  </div>
                </MotionStaggerItem>
              ))}
            </div>
          </MotionStagger>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

        <section className="py-20">
          <MotionWrapper>
            <div className="max-w-5xl mx-auto">
              <div className="relative bg-gradient-to-br from-[#009FE3]/10 via-white to-[#007BC7]/10 rounded-3xl p-12 border border-[#009FE3]/20 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#009FE3]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#007BC7]/10 rounded-full blur-3xl"></div>
                
                <div className="relative">
                  <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-2xl flex items-center justify-center icon-hover shadow-lg">
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                    {t.regionalPresence}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] mx-auto rounded-full mb-8"></div>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center" style={{ lineHeight: '2' }}>
                    {t.regionalText}
                  </p>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

        <section className="py-20">
          <MotionWrapper>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-2xl mb-6 icon-hover">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.whyChoose}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] mx-auto rounded-full"></div>
            </div>
          </MotionWrapper>
          
          <MotionStagger staggerDelay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {t.reasons.map((reason, index) => (
                <MotionStaggerItem key={index}>
                  <div className="group bg-white rounded-2xl p-6 text-center border-2 border-gray-200 hover:border-[#009FE3] transition-all duration-300 shadow-md hover:shadow-xl">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-bold text-gray-900 leading-snug" style={{ lineHeight: '1.6' }}>
                      {reason}
                    </p>
                  </div>
                </MotionStaggerItem>
              ))}
            </div>
          </MotionStagger>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

        <section className="py-20">
          <MotionWrapper>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-2xl mb-6 icon-hover">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.contactUs}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] mx-auto rounded-full mb-8"></div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto text-center" style={{ lineHeight: '2' }}>
                {t.contactText}
              </p>
            </div>
          </MotionWrapper>
          
          <MotionWrapper delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12">
              <div className="group bg-white rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-[#009FE3] transition-all duration-300 shadow-md hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.locations}</h3>
                <p className="text-gray-600 leading-relaxed" style={{ lineHeight: '1.8' }}>
                  {t.locationsList}
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-[#009FE3] transition-all duration-300 shadow-md hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.email}</h3>
                <a href="mailto:info@mabco.biz" className="text-[#009FE3] hover:text-[#007BC7] font-semibold hover:underline link-smooth">
                  info@mabco.biz
                </a>
              </div>

              <div className="group bg-white rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-[#009FE3] transition-all duration-300 shadow-md hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.phone}</h3>
                <a href="tel:0119909" className="text-[#009FE3] hover:text-[#007BC7] font-semibold hover:underline link-smooth">
                  011 9909
                </a>
              </div>

              <div className="group bg-white rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-[#009FE3] transition-all duration-300 shadow-md hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.website}</h3>
                <a href="https://www.mabcoonline.com" target="_blank" rel="noopener noreferrer" className="text-[#009FE3] hover:text-[#007BC7] font-semibold hover:underline link-smooth">
                  www.mabcoonline.com
                </a>
              </div>
            </div>
          </MotionWrapper>
        </section>
      </div>

      <MotionWrapper>
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden mt-16">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#009FE3] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#007BC7] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-2xl flex items-center justify-center mx-auto mb-8 icon-hover shadow-2xl">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold leading-relaxed" style={{ lineHeight: '1.8' }}>
                {t.closing}
              </p>
            </div>
          </div>
        </div>
      </MotionWrapper>

      <div className="fixed bottom-8 z-50" style={{ left: isArabic ? 'auto' : '2rem', right: isArabic ? '2rem' : 'auto' }}>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-[#009FE3]/50 btn-press transition-all duration-300 flex items-center gap-3 font-semibold text-lg border-2 border-white/20 backdrop-blur-sm hover:scale-105"
        >
          <span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
        </button>
      </div>
    </div>
  );
}

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <AboutUsPage
      language={language}
      onClose={() => navigate("/")}
    />
  );
};

export default AboutPage;
