import { ArrowRight, BadgePercent, Gift, Package, Sparkles, Tag, Ticket } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { useInView } from "../../../hooks/useInView";

interface OfferType {
  id: string;
  type: "direct_discount" | "coupon" | "free_product" | "bundle_discount";
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  highlightEn: string;
  highlightAr: string;
  gradient: string;
  pattern: string;
}

interface OfferTypeSliderProps {
  language: "ar" | "en";
  onOfferTypeClick?: (offerType: string) => void;
}

const offerTypes: OfferType[] = [
  {
    id: "direct_discount",
    type: "direct_discount",
    titleEn: "Direct Discounts",
    titleAr: "خصومات مباشرة",
    descriptionEn: "Save instantly with percentage or fixed amount discounts",
    descriptionAr: "وفّر فوراً مع خصومات نسبية أو مبالغ ثابتة",
    highlightEn: "Up to 30% OFF",
    highlightAr: "حتى 30٪ خصم",
    gradient: "from-red-500 via-pink-500 to-rose-600",
    pattern: "discount",
  },
  {
    id: "coupon",
    type: "coupon",
    titleEn: "Coupon Offers",
    titleAr: "عروض الكوبونات",
    descriptionEn: "Buy a product and get a coupon to spend on other items",
    descriptionAr: "اشترِ منتج واحصل على كوبون للإنفاق على منتجات أخرى",
    highlightEn: "Get up to 200K Coupon",
    highlightAr: "احصل على كوبون حتى 200 ألف",
    gradient: "from-blue-500 via-indigo-500 to-purple-600",
    pattern: "coupon",
  },
  {
    id: "free_product",
    type: "free_product",
    titleEn: "Free Gifts",
    titleAr: "هدايا مجانية",
    descriptionEn: "Purchase selected products and receive amazing gifts for free",
    descriptionAr: "اشترِ منتجات مختارة واحصل على هدايا مذهلة مجاناً",
    highlightEn: "Premium Gifts FREE",
    highlightAr: "هدايا مميزة مجاناً",
    gradient: "from-green-500 via-emerald-500 to-teal-600",
    pattern: "gift",
  },
  {
    id: "bundle_discount",
    type: "bundle_discount",
    titleEn: "Bundle Deals",
    titleAr: "عروض الحزم",
    descriptionEn: "Buy main product and get special discounts on related items",
    descriptionAr: "اشترِ المنتج الرئيسي واحصل على خصومات خاصة على منتجات محددة",
    highlightEn: "Save up to 35%",
    highlightAr: "وفّر حتى 35٪",
    gradient: "from-purple-500 via-violet-500 to-fuchsia-600",
    pattern: "bundle",
  },
];

export function OfferTypeSlider({ language, onOfferTypeClick }: OfferTypeSliderProps) {
  const [sectionRef, isSectionInView] = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -140px 0px",
    threshold: 0.45,
  });
  const shouldReduceMotion = useReducedMotion();

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "direct_discount":
        return Tag;
      case "coupon":
        return Ticket;
      case "free_product":
        return Gift;
      case "bundle_discount":
        return Package;
      default:
        return Sparkles;
    }
  };

  const getPatternElements = (pattern: string) => {
    switch (pattern) {
      case "discount":
        return (
          <>
            <div className="absolute top-10 right-10 w-24 h-24 border-4 border-white/20 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 border-4 border-white/20 rounded-full"></div>
            <BadgePercent className="absolute top-1/4 left-1/4 w-32 h-32 text-white/40 rotate-12" />
          </>
        );
      case "coupon":
        return (
          <>
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-lg rotate-12"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-lg -rotate-12"></div>
            <Ticket className="absolute top-1/3 right-1/4 w-40 h-40 text-white/40 -rotate-12" />
          </>
        );
      case "gift":
        return (
          <>
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
            <Gift className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-white/40 rotate-12" />
            <Sparkles className="absolute top-1/4 right-1/4 w-16 h-16 text-white/10" />
          </>
        );
      case "bundle":
        return (
          <>
            <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-xl rotate-12"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-white/10 rounded-xl -rotate-12"></div>
            <Package className="absolute top-1/3 left-1/3 w-48 h-48 text-white/40 rotate-12" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={sectionRef} className="relative">
      <div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: language === "ar" ? "rtl" : "ltr",
          }}
          className="w-full"
        >
        <CarouselContent className="-ml-2 md:-ml-4">
          {offerTypes.map((offer, index) => {
            const Icon = getOfferIcon(offer.type);

            return (
              <CarouselItem key={offer.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 1, scale: 0.94, rotateY: language === "ar" ? -80 : 80, y: 20 }}
                  animate={
                    shouldReduceMotion || isSectionInView
                      ? { opacity: 1, scale: 1, rotateY: 0, y: 0 }
                      : { opacity: 1, scale: 0.94, rotateY: language === "ar" ? -80 : 80, y: 20 }
                  }
                  whileHover={shouldReduceMotion ? undefined : { y: -6, rotateY: language === "ar" ? -12 : 12 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="relative h-[450px] sm:h-[500px] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                  style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    transformOrigin: "center center",
                    backgroundColor: "transparent",
                    willChange: "transform, opacity",
                  }}
                  onClick={() => onOfferTypeClick?.(offer.type)}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient}`}></div>

                  {/* Animated Pattern Elements */}
                  <div className="absolute inset-0 overflow-hidden opacity-60">
                    {getPatternElements(offer.pattern)}
                  </div>

                  {/* Overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>

                  {/* Content - Vertical Layout */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    {/* Top Section - Icon & Type */}
                    <div className="space-y-4">
                      {/* Icon Badge */}
                      <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md border-2 border-white/40 rounded-xl px-4 py-2">
                        <Icon className="w-6 h-6 text-white" />
                        <span className="text-white font-bold text-sm">
                          {language === "ar" ? "عرض خاص" : "Special Offer"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-2xl">
                        {language === "ar" ? offer.titleAr : offer.titleEn}
                      </h3>
                    </div>

                    {/* Middle Section - Description */}
                    <div className="flex-1 flex items-center">
                      <p className="text-base md:text-lg text-white/95 leading-relaxed">
                        {language === "ar" ? offer.descriptionAr : offer.descriptionEn}
                      </p>
                    </div>

                    {/* Bottom Section - Highlight & CTA */}
                    <div className="space-y-4">
                      {/* Highlight Box */}
                      {/* <div className="bg-white rounded-xl px-5 py-4 shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                          <Zap className="w-7 h-7 text-yellow-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">
                              {language === "ar" ? "وفّر الآن" : "Save Now"}
                            </p>
                            <p
                              className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${offer.gradient} bg-clip-text text-transparent`}
                            >
                              {language === "ar" ? offer.highlightAr : offer.highlightEn}
                            </p>
                          </div>
                        </div>
                      </div> */}

                      {/* CTA Button */}
                      <button className="w-full group/btn bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white px-6 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3">
                        <span>{language === "ar" ? "استكشف العروض" : "Explore Offers"}</span>
                        <div className="relative">
                          <ArrowRight
                            className={`w-5 h-5 ${
                              language === "ar" ? "rotate-180" : ""
                            }`}
                          />
                          {/* <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" /> */}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Decorative Gradient Orbs */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

                  <CarouselPrevious
                    className={`${language === "ar" ? "translate-x-1/2" : "-translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-20`}
                  />
                  <CarouselNext
                    className={`${language === "ar" ? "-translate-x-1/2" : "translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-20`}
                  />
        </Carousel>
      </div>
    </div>
  );
}
