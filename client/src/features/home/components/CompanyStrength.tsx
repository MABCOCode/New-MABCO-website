import { useEffect, useRef, useState } from "react";
import { Building2, MapPin, Award, Users, TrendingUp } from "lucide-react";
import translations from '../../../i18n/translations';

interface CompanyStrengthProps {
  language: "ar" | "en";
}

export function CompanyStrength({ language }: CompanyStrengthProps) {
  const isRTL = language === "ar";
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    years: 0,
    cities: 0,
    brands: 0
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  // Intersection Observer for scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  // Count-up animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      years: new Date().getFullYear() - 1999, // Calculate years based on current year
      cities: 6,
      brands: 10
    };

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuad = 1 - Math.pow(1 - progress, 3); // Easing function

      setCounts({
        years: Math.floor(targets.years * easeOutQuad),
        cities: Math.floor(targets.cities * easeOutQuad),
        brands: Math.floor(targets.brands * easeOutQuad)
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  const stats = [
    {
      icon: Award,
      number: counts.years,
      suffix: "+",
      label: t.years,
      description: t.established,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MapPin,
      number: counts.cities,
      suffix: "",
      label: t.cities,
      description: t.citiesList,
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Building2,
      number: counts.brands,
      suffix: "+",
      label: t.brands,
      description: t.brandsDesc,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const values = [
    {
      icon: Award,
      title: t.genuine,
      description: t.genuineDesc
    },
    {
      icon: Users,
      title: t.certified,
      description: t.certifiedDesc
    },
    {
      icon: TrendingUp,
      title: t.network,
      description: t.networkDesc
    },
    {
      icon: Building2,
      title: t.warranty,
      description: t.warrantyDesc
    }
  ];

  return (
    <section ref={sectionRef} className="bg-gray-50 py-16" id="company-strength" data-analytics-category="company-strength">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-3">{t.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Icon with Gradient */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${stat.color} mb-4 mx-auto`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Number */}
                <div className="mb-2">
                  <span className="text-5xl text-gray-900 tabular-nums">
                    {stat.number}
                  </span>
                  <span className="text-3xl text-gray-600">{stat.suffix}</span>
                </div>

                {/* Label */}
                <h3 className="text-lg text-gray-700 mb-2">{stat.label}</h3>

                {/* Description */}
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Values Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-6 shadow-md border-l-4 border-[#009FE3] hover:shadow-lg transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${isRTL ? 'translate-x-8' : '-translate-x-8'}`
                  }`}
                  style={{
                    transitionDelay: `${(index + 4) * 100}ms`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#009FE3]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
export default CompanyStrength;