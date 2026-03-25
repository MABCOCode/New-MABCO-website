import { ArrowUpRight, Briefcase, FileText, ShieldCheck } from "lucide-react";
import React, { useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { setSeo } from "../../../services/seo";

const CareerPage: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    const title = isArabic
      ? 'وظائف مابكو - انضم إلى فريقنا'
      : 'MABCO Careers - Join Our Team';
    const description = isArabic
      ? 'اكتشف فرص التوظيف في مابكو وسجل بياناتك للانضمام إلى فريق العمل.'
      : 'Explore career opportunities at MABCO and apply to become part of our team.';

    setSeo({
      title,
      description,
      url: window.location.href,
      image: 'https://mabcoonline.com/images/giphy.gif',
    });
  }, [isArabic]);

  const content = isArabic
    ? {
        eyebrow: "مابكو | التوظيف",
        title: "انضم إلى فريق مابكو",
        intro: "مرحباً بك في صفحة التوظيف الخاصة بشركتنا،",
        body: [
          "نحن في مابكو نؤمن أن النجاح يبدأ بالكوادر المتميزة، ولذلك نمنح اهتماماً كبيراً لاختيار أفضل الكفاءات للانضمام إلى فريقنا.",
          "من خلال هذه الصفحة يمكنك:",
        ],
        bullets: [
          "تعبئة طلب التوظيف الخاص بك بكل سهولة.",
          "إدخال معلوماتك الشخصية.",
          "تزويدنا بخبراتك ومهاراتك التي تؤهلك للوظيفة.",
        ],
        privacy:
          "جميع البيانات التي تقوم بإدخالها سيتم التعامل معها بسرية تامة، ولن يتم استخدامها إلا بهدف التوظيف داخل شركتنا.",
        closing:
          "إذا كنت مستعداً، اضغط على الزر أدناه لتعبئة بيانات التوظيف.",
        cta: "تقديم طلب التوظيف",
        highlights: [
          { icon: Briefcase, label: "فرص مهنية" },
          { icon: FileText, label: "طلب توظيف سهل" },
          { icon: ShieldCheck, label: "سرية تامة" },
        ],
      }
    : {
        eyebrow: "MABCO | Careers",
        title: "Join the MABCO Team",
        intro: "Welcome to our company's careers page,",
        body: [
          "At MABCO, we believe success starts with outstanding people, so we place great importance on selecting the best talent to join our team.",
          "Through this page, you can:",
        ],
        bullets: [
          "Complete your job application with ease.",
          "Enter your personal information.",
          "Share the experience and skills that qualify you for the role.",
        ],
        privacy:
          "All data you enter will be handled with complete confidentiality and will only be used for recruitment within our company.",
        closing:
          "If you are ready, click the button below to complete your employment application.",
        cta: "Submit Employment Application",
        highlights: [
          { icon: Briefcase, label: "Career Opportunities" },
          { icon: FileText, label: "Simple Application" },
          { icon: ShieldCheck, label: "Full Confidentiality" },
        ],
      };

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe,transparent_35%),linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#eef8ff_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 h-36 w-36 rounded-full bg-[#009FE3]/12 blur-3xl" />
          <div className="absolute top-32 right-16 h-44 w-44 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[#007BC7]/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#009FE3]/20 bg-white/85 px-4 py-2 text-sm font-semibold text-[#007BC7] shadow-sm backdrop-blur">
              <Briefcase className="h-4 w-4" />
              {content.eyebrow}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className={isArabic ? "lg:text-right" : "lg:text-left"}>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                  {content.title}
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 md:text-xl">
                  {content.intro}
                </p>
                {content.body.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                    {paragraph}
                  </p>
                ))}

                <ul className="mt-6 space-y-3  " dir="ltr">
                  {content.bullets.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-3 text-base font-medium text-slate-700 md:text-lg ${isArabic ? "flex-row-reverse text-right" : "text-left"}`}
                    >
                      <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-br from-[#009FE3] to-[#007BC7]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
                  {content.privacy}
                </p>
                <p className="mt-4 text-base leading-8 text-slate-700 md:text-lg">
                  {content.closing}
                </p>

                <div className={`mt-8 flex ${isArabic ? "justify-start lg:justify-end" : "justify-start"}`}>
                  <a
                    href="https://hr.mabcoonline.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#009FE3] to-[#007BC7] px-6 py-4 text-base font-bold text-white shadow-lg shadow-sky-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span>{content.cta}</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </div>
              </div>

            
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CareerPage;
