import { CheckCircle, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { setSeo } from "../../../services/seo";

const AppDownloadPage = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    const title = isArabic ? "تحميل التطبيق | MABCO" : "Download Our App | MABCO";
    const description = isArabic
      ? "حمّل تطبيق MABCO من متجر جوجل بلاي أو آب ستور. تطبيق موثوق وآمن لسلامتك."
      : "Download the MABCO app from Google Play or the App Store. Verified and trusted for your safety.";

    setSeo({
      title,
      description,
      url: window.location.href,
      image: "https://mabcoonline.com/images/giphy.gif",
    });
  }, [isArabic]);

  const content = {
    title: isArabic ? "تحميل التطبيق" : "Download Our App",
    subtitle: isArabic
      ? "حمّل تطبيقنا على منصتك المفضلة. تم التحقق من التطبيق بواسطة جوجل بلاي وآب ستور لضمان أمانك وراحة بالك."
      : "Get our app on your favorite platform. Verified by Google Play and the App Store for your security and peace of mind.",
    google: {
      title: isArabic ? "متوفر على جوجل بلاي" : "Get it on Google Play",
      description: isArabic
        ? "حمّل التطبيق من متجر جوجل بلاي الرسمي. تطبيق موثوق وآمن."
        : "Download from the official Google Play Store. Verified and secure.",
      button: isArabic ? "تحميل الآن" : "Download Now",
      link: "https://play.google.com/store/apps/details?id=com.mabco.app&pcampaignid=web_share",
      checks: [
        isArabic ? "التحقق الرسمي من المنصة" : "Official platform verification",
        isArabic ? "تحديثات أمنية منتظمة" : "Regular security updates",
        isArabic ? "موثوق من قبل المنصة" : "Trusted by the platform",
      ],
    },
    apple: {
      title: isArabic ? "متوفر على آب ستور" : "Get it on the App Store",
      description: isArabic
        ? "متاح على متجر آب ستور. تم التحقق منه وموثوق به."
        : "Available on the Apple App Store. Verified and trusted.",
      button: isArabic ? "تحميل الآن" : "Download Now",
      link: "https://apps.apple.com/us/app/mabco-24/id1462626384",
      checks: [
        isArabic ? "التحقق الرسمي من المنصة" : "Official platform verification",
        isArabic ? "تحديثات أمنية منتظمة" : "Regular security updates",
        isArabic ? "موثوق من قبل المنصة" : "Trusted by the platform",
      ],
    },
    footer: {
      title: isArabic
        ? "تم التحقق من قبل متاجر المنصات الرسمية"
        : "Verified by official platform stores",
      badges: [
        isArabic ? "تحميل آمن" : "Safe download",
        isArabic ? "تم التحقق من قبل المنصة" : "Platform verified",
        isArabic ? "موثوق من قبل آلاف المستخدمين" : "Trusted by thousands of users",
      ],
    },
  };

  const Card = ({
    logo,
    accent,
    title,
    description,
    checks,
    button,
    link,
    hoverGradient,
    buttonGradient,
    buttonHoverGradient,
  }: {
    logo: string;
    accent: string;
    title: string;
    description: string;
    checks: string[];
    button: string;
    link: string;
    hoverGradient: string;
    buttonGradient: string;
    buttonHoverGradient: string;
  }) => (
    <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hoverGradient}`} />
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
          <img src={logo} alt={title} className="w-full h-full object-cover" />
        </div>
        <h3 className="mb-3 text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="space-y-3 mb-8">
          {checks.map((check, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${accent}`} />
              <span className="text-sm text-gray-700">{check}</span>
            </div>
          ))}
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full py-4 px-6 rounded-xl text-center text-white transition-all duration-300 ${buttonGradient} hover:${buttonHoverGradient} shadow-lg font-medium`}
        >
          {button}
        </a>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
          <ShieldCheck className={`w-4 h-4 ${accent}`} />
          <span className="text-sm">{isArabic ? "تم التحقق والموثوقية" : "Verified & trusted"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50" dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {content.title}
          </h1>
          <p className="text-gray-600 mx-auto max-w-2xl text-base sm:text-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <Card
            logo="https://mabcoonline.com/images/google-play.png"
            accent="text-green-600"
            title={content.google.title}
            description={content.google.description}
            checks={content.google.checks}
            button={content.google.button}
            link={content.google.link}
            hoverGradient="bg-gradient-to-br from-green-50 to-blue-50"
            buttonGradient="bg-gradient-to-r from-green-600 to-blue-600"
            buttonHoverGradient="from-green-700 to-blue-700"
          />

          <Card
            logo="https://mabcoonline.com/images/app-store.png"
            accent="text-green-600"
            title={content.apple.title}
            description={content.apple.description}
            checks={content.apple.checks}
            button={content.apple.button}
            link={content.apple.link}
            hoverGradient="bg-gradient-to-br from-green-50 to-purple-50"
            buttonGradient="bg-gradient-to-r from-green-600 to-purple-600"
            buttonHoverGradient="from-green-700 to-purple-700"
          />
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-500 mb-6">{content.footer.title}</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {content.footer.badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadPage;