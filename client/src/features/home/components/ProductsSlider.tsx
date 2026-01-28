// components/ProductsSlider.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import ProductCard from "../../../components/ui/ProductCard";
import { Product } from "../../../types/product";

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
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          {icon}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            {title}
          </h2>
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
                className="pl-4 basis-full md:basis-1/3 lg:basis-1/5"
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
                  className="h-full"
                  style={{ overflow: "visible" }}
                >
                  <ProductCard
                    product={product}
                    addToCart={() => onAddToCart && onAddToCart(product)}
                    toggleCompare={onToggleCompare}
                    compareItems={compareItems}
                    language={language}
                    addToCartText={
                      language === "ar" ? "أضف للسلة" : "Add to Cart"
                    }
                    onQuickView={() =>
                      onProductClick && onProductClick(product)
                    }
                  />
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
