import React, { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../../components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
//import { Autoplay } from '@carouseljs/plugin-autoplay';
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import banners from '../../../testdata/banners.json';

const fallbackSlides = banners as any[];

type Props = {
  language?: 'ar' | 'en';
};

const HeroCarousel: React.FC<Props> = ({ language = 'ar' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bannerApi = useRef<CarouselApi | null>(null);
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

  // UI states that previously came from a global selector — default to false here.
  const searchMode = false;
  const brandPageMode = false;
  const productDetailMode = false;
  const showroomsMode = false;
  const aboutUsMode = false;

  const setBannerApi = (api: CarouselApi | null) => {
    bannerApi.current = api;
    // best-effort: try to subscribe if the API exposes a change event
    try {
      // Embla emits a 'select' event; query the selected index on changes
      api?.on?.('select', () => {
        try {
          // selectedScrollSnap returns the active slide index
          // @ts-ignore - some typings may differ between embla versions
          const idx = api?.selectedScrollSnap?.() ?? 0;
          setCurrentSlide(idx);
        } catch {
          // ignore
        }
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Try to query initial slide from API if available
    try {
      // prefer Embla API method to get the selected slide
      // @ts-ignore - selectedScrollSnap may be missing from types
      const idx = bannerApi.current?.selectedScrollSnap?.() ?? 0;
      setCurrentSlide(idx ?? 0);
    } catch {
      setCurrentSlide(0);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/banner-slides?active=true`);
        if (!res.ok) return;
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (!mounted) return;
        setSlides(rows.length ? rows : fallbackSlides);
      } catch {
        if (mounted) setSlides(fallbackSlides);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiBase]);

  return (
    <section
      id="home"
      className={`relative ${
        searchMode || brandPageMode || productDetailMode || showroomsMode || aboutUsMode ? 'hidden' : ''
      }`}
    >
      {isLoading ? (
        <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden bg-gray-100">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-3xl px-4 w-full">
              <div className="h-10 md:h-14 bg-white/60 rounded mb-4 w-2/3 mx-auto" />
              <div className="h-6 bg-white/50 rounded mb-6 w-1/2 mx-auto" />
              <div className="h-10 bg-white/60 rounded w-40 mx-auto" />
            </div>
          </div>
        </div>
      ) : (
        <Carousel
          key={language}
          setApi={setBannerApi}
          opts={{
            loop: true,
            direction: language === 'ar' ? 'rtl' : 'ltr',
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[350px] md:h-[450px]">
                  <ImageWithFallback
                    src={slide.image}
                    alt={language === 'ar' ? slide.titleAr || slide.title : slide.titleEn || slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="max-w-3xl px-4">
                      <div className="text-4xl md:text-6xl font-bold text-white mb-3" role="heading" aria-level={2}>
                        {language === 'ar' ? slide.titleAr || slide.title : slide.titleEn || slide.title}
                      </div>
                      <p className="text-lg md:text-xl text-white/90 mb-6">
                        {language === 'ar' ? slide.subtitleAr || slide.subtitle : slide.subtitleEn || slide.subtitle}
                      </p>
                    <button
                      onClick={() => {
                        const target = slide.url || "/products";
                        window.location.assign(target);
                      }}
                      className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-8 py-3 rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      {language === 'ar' ? slide.buttonTextAr || "تسوق الآن" : slide.buttonTextEn || "Shop Now"}
                    </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className={`${language === 'ar' ? 'translate-x-1/2' : ' -translate-x-1/2'} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-30`} />
          <CarouselNext className={`${language === 'ar' ? ' -translate-x-1/2 ' : ' translate-x-1/2'} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-30`} />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => bannerApi.current?.scrollTo?.(index)}
                className={`h-2 rounded-sm transition-all duration-300 ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </Carousel>
      )}
    </section>
  );
};

export default HeroCarousel;
