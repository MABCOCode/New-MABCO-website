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
import { getOfferBadgeText, getProductOffers } from "../../../data/products";
import { getPrimaryOfferBadgeAppearance } from "../../../utils/offerBadgeAppearance";

interface ProductsSliderProps {
  language: "ar" | "en";
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleCompare?: (productId: string) => void;
  compareItems?: string[];
}

const ProductsSlider: React.FC<ProductsSliderProps> = ({
  language,
  title,
  icon,
  products,
  loading = false,
  onProductClick,
  onAddToCart,
  onToggleCompare,
  compareItems = [],
}) => {
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Helper function to parse price
  const parseNumericPrice = (value: unknown): number => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, "").trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const shouldIgnoreDescriptionAndSpecsValidation = (product: any): boolean =>
    String(product?.cat_code || product?.category_code || product?.catCode || "").trim() === "02";

  // Filter products to exclude those with missing critical data
  const validProducts = React.useMemo(() => {
    if (loading) return products;
    
    return products.filter((product: any) => {
      // Check required fields
      const hasValidName = Boolean(String(product?.name || "").trim());
      if (!hasValidName) return false;

      const hasPrice = parseNumericPrice(product?.price) > 0;
      if (!hasPrice) return false;

      // Check if has image or variants
      const hasMainImage = Boolean(String(product?.image || "").trim());
      const hasColorVariants = Array.isArray(product?.colorVariants) && product.colorVariants.length > 0;
      const hasChargeOptions = Array.isArray(product?.chargeOptions) && product.chargeOptions.length > 0;
      const hasValidImage = hasMainImage || hasColorVariants || hasChargeOptions;
      if (!hasValidImage) return false;

      // Check if has details
      const hasDescription = Boolean(String(product?.description || product?.descriptionAr || "").trim());
      const hasSpecs = Array.isArray(product?.specs) && product.specs.length > 0;
      const hasDetails =
        shouldIgnoreDescriptionAndSpecsValidation(product) ||
        hasDescription ||
        hasSpecs ||
        hasColorVariants ||
        hasChargeOptions;
      if (!hasDetails) return false;

      return true;
    });
  }, [products, loading]);

  const [carouselKey, setCarouselKey] = useState(0);
  const lastZoomRef = useRef<number>(window.devicePixelRatio);

  const getOfferBadgeForProduct = (product: Product) => {
    const offers = getProductOffers(product.id);
    if (offers.length === 0) return null;
    const offerInfo = getPrimaryOfferBadgeAppearance(offers);

    if (!offerInfo) return null;

    const badgeText = getOfferBadgeText(offers, language);

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
  }, [validProducts]);

  // Reset card refs array when products change
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, validProducts.length);
  }, [validProducts]);

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
            {(loading ? Array.from({ length: 8 }) : validProducts).map((product: any, index) => (
              <CarouselItem
                key={`${product?.id || "skeleton"}-${(product as any)?.stk_code || index}`}
                className="basis-full md:basis-1/3 lg:basis-1/5 px-4 md:px-0"
                style={{
                  ...(maxHeight > 0
                    ? { minHeight: `${maxHeight}px` }
                    : {}),
                  overflow: "visible",
                  position: "relative",
                }}
              >
                <div
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="h-full mx-auto w-full max-w-[360px] md:max-w-none"
                  style={{ overflow: "visible" }}
                >
                  {loading ? (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 h-full">
                      <div className="w-full aspect-square rounded-lg shimmer-surface mb-4" />
                      <div className="h-4 w-4/5 shimmer-surface mb-2" />
                      <div className="h-4 w-3/5 shimmer-surface mb-4" />
                      <div className="h-9 w-full rounded-lg shimmer-surface" />
                    </div>
                  ) : (() => {
                    const topBadge = getOfferBadgeForProduct(product);
                    return (
                      <ProductCard
                        product={product}
                        toggleCompare={onToggleCompare || (() => {})}
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
