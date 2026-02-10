// components/ProductsSlider.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import ProductCard from "../../products/components/ProductCard";
import { Product } from "../../../types/product";
import { getProductOffers } from "../../../data/products";
import { Tag, Ticket, Gift, Package } from "lucide-react";

interface ProductsSliderProps {
  language: "ar" | "en";
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleCompare?: (productId: number) => void;
  compareItems?: number[];
}

const ProductsSlider: React.FC<ProductsSliderProps> = ({
  language,
  title,
  icon,
  products,
  onProductClick,
  onAddToCart,
  onToggleCompare,
  compareItems = [],
}) => {
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    console.log("[ProductsSlider] mounted", {
      title,
      count: products?.length,
      onToggleCompareExists: !!onToggleCompare,
    });
  }, [title, products, onToggleCompare]);
  const [carouselKey, setCarouselKey] = useState(0);
  const lastZoomRef = useRef<number>(window.devicePixelRatio);

  const getOfferBadgeForProduct = (product: Product) => {
    const offers = getProductOffers(product.id);
    if (offers.length === 0) return null;

    const priority = ["direct_discount", "coupon", "free_product", "bundle_discount"] as const;
    const currentOffer =
      offers.find((o) => o.type === priority[0]) ||
      offers.find((o) => o.type === priority[1]) ||
      offers.find((o) => o.type === priority[2]) ||
      offers.find((o) => o.type === priority[3]);

    if (!currentOffer) return null;

    const offerType = currentOffer.type;
    const offerInfo = (() => {
      switch (offerType) {
        case "direct_discount":
          return { Icon: Tag, gradient: "from-red-500 to-pink-600" };
        case "coupon":
          return { Icon: Ticket, gradient: "from-blue-500 to-indigo-600" };
        case "free_product":
          return { Icon: Gift, gradient: "from-green-500 to-emerald-600" };
        case "bundle_discount":
          return { Icon: Package, gradient: "from-purple-500 to-violet-600" };
        default:
          return null;
      }
    })();

    if (!offerInfo) return null;

    const badgeText = (() => {
      if (offerType === "direct_discount" && "discountType" in currentOffer) {
        return currentOffer.discountType === "percentage"
          ? `${currentOffer.discountValue}% ${language === "ar" ? "خصم" : "OFF"}`
          : language === "ar"
          ? "خصم خاص"
          : "Special Deal";
      }
      if (offerType === "coupon" && "couponValue" in currentOffer) {
        return `${(currentOffer.couponValue / 1000).toFixed(0)}K ${
          language === "ar" ? "كوبون" : "Coupon"
        }`;
      }
      if (offerType === "free_product") {
        return language === "ar" ? "هدية مجانية" : "Free Gift";
      }
      if (offerType === "bundle_discount" && "discountPercentage" in currentOffer) {
        return `${currentOffer.discountPercentage}% ${
          language === "ar" ? "على الحزمة" : "Bundle"
        }`;
      }
      return "";
    })();

    if (!badgeText) return null;

    return (
      <div
        className={`bg-gradient-to-r ${offerInfo.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap`}
      >
        <offerInfo.Icon className="w-4 h-4" />
        <span>{badgeText}</span>
      </div>
    );
  };

  // Effect to calculate and set max height
  useEffect(() => {
    const updateMaxHeight = () => {
      if (cardRefs.current.length === 0) return;

      // Calculate the maximum height among all visible cards
      let max = 0;
      cardRefs.current.forEach((ref) => {
        if (ref && ref.offsetHeight > max) {
          max = ref.offsetHeight;
        }
      });

      if (max > 0) {
        setMaxHeight(max);
      }
    };

    // Initial calculation
    updateMaxHeight();

    // Use ResizeObserver to handle dynamic content changes
    const resizeObservers: ResizeObserver[] = [];

    cardRefs.current.forEach((ref) => {
      if (ref) {
        const observer = new ResizeObserver(updateMaxHeight);
        observer.observe(ref);
        resizeObservers.push(observer);
      }
    });

    // Cleanup observers
    return () => {
      resizeObservers.forEach((observer) => observer.disconnect());
    };
  }, [products]);

  // Reset card refs array when products change
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, products.length);
  }, [products]);

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          {icon}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            {title}
          </h2>
            {icon}
        </div>
      </div>

      <div className="relative" style={{ overflow: "visible" }}>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: language === "ar" ? "rtl" : "ltr",
          }}
          className="w-full"
          style={{ overflow: "visible" }}
        >
          <CarouselContent
            className="ml-0 items-stretch"
            style={{ overflow: "visible" }}
          >
            {products.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="basis-full md:basis-1/3 lg:basis-1/5 px-4 md:px-0"
                style={
                  maxHeight > 0
                    ? {
                        minHeight: `${maxHeight}px`,
                        overflow: "visible",
                        position: "relative",
                      }
                    : { overflow: "visible", position: "relative" }
                }
              >
                <div
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="h-full mx-auto w-full max-w-[360px] md:max-w-none"
                  style={{ overflow: "visible" }}
                >
                  {(() => {
                    const topBadge = getOfferBadgeForProduct(product);
                    return (
                      <ProductCard
                        product={product}
                        toggleCompare={onToggleCompare}
                        compareItems={compareItems}
                        language={language}
                        onQuickView={() => onProductClick && onProductClick(product)}
                        topBadge={topBadge ?? undefined}
                      />
                    );
                  })()}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className={`${language === "ar" ? "translate-x-1/2" : "-translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-20`}
          />
          <CarouselNext
            className={`${language === "ar" ? "-translate-x-1/2" : "translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-20`}
          />
        </Carousel>
      </div>
    </section>
  );
};

export default ProductsSlider;
