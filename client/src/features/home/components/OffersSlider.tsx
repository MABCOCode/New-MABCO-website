import React, { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../../components/ui/carousel';
import translations from '../../../i18n/translations';

interface Offer {
  offer_type: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  image: string;
  color: string;
  details?: {
    headline?: string;
    headline_ar?: string;
    bullets?: string[];
    bullets_ar?: string[];
  };
}

interface OfferSliderProps {
  language: 'ar' | 'en';
}

const OfferSlider: React.FC<OfferSliderProps> = ({ language }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const animationTimerRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  const triggerAnimation = () => {
    if (animationTimerRef.current) {
      window.clearTimeout(animationTimerRef.current);
    }
    setAnimateCards(false);
    animationTimerRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => setAnimateCards(true));
    }, 160);
  };

  const t = translations[language];
  const shouldAnimate = isLoaded && isInView && animateCards;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/static/offers-legacy.json');
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setOffers(Array.isArray(json) ? json : []);
      } catch {
        // Keep empty slider if static data fails.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isLoaded && isInView) {
      triggerAnimation();
    }
  }, [isLoaded, isInView]);

  useEffect(() => {
    const onNavigateSection = (event: Event) => {
      const customEvent = event as CustomEvent<{ sectionId?: string }>;
      if (customEvent.detail?.sectionId === 'special-offers-carousel') {
        triggerAnimation();
      }
    };

    window.addEventListener('mabco:navigate-section', onNavigateSection as EventListener);
    return () => {
      window.removeEventListener('mabco:navigate-section', onNavigateSection as EventListener);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="container mx-auto px-4 py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          direction: language === 'ar' ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {offers.map((offer, index) => (
            <CarouselItem
              key={offer.offer_type || String(index)}
              className="pl-4 basis-full md:basis-1/3 lg:basis-1/4"
              style={{
                transform: shouldAnimate
                  ? 'translate3d(0, 0, 0)'
                  : 'translate3d(0, 24px, 0)',
                transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: `${Math.min(index, 8) * 70}ms`,
              }}
            >
              <div className="relative group cursor-pointer h-full">
                {/* 9:16 Aspect Ratio Container */}
                <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                  <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <img
                      src={offer.image}
                      alt={language === 'ar' ? offer.title_ar : offer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-80`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {language === 'ar' ? offer.title_ar : offer.title}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base">
                        {language === 'ar' ? offer.description_ar : offer.description}
                      </p>
                      <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                        {t.shopNow}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={`${language === 'ar' ? 'translate-x-1/2' : '-translate-x-1/2'} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-30`}
        />
        <CarouselNext
          className={`${language === 'ar' ? '-translate-x-1/2' : 'translate-x-1/2'} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-30`}
        />
      </Carousel>
    </section>
  );
};

export default OfferSlider;
