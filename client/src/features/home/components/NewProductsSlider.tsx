// components/NewProductsSlider.tsx
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { Flame, Tag, ShoppingCart, Star } from "lucide-react";
import ProductCard from '../../../components/ui/ProductCard';
import productsData from "../../../testdata/products.json";
import { Product } from "../../../types/product";


interface NewProductsSliderProps {
  language: "ar" | "en";
  products?: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleCompare?: (productId: number) => void;
  compareItems?: number[];
}

const NewProductsSlider: React.FC<NewProductsSliderProps> = ({
  language,
  products: customProducts,
  onProductClick,
  onAddToCart,
  onToggleCompare,
  compareItems = [],
}) => {
  // load products from testdata
  const defaultProducts: Product[] = (productsData as any)?.newProducts ?? [];

  const products = customProducts || defaultProducts;
  const translations = {
    addToCart: language === "ar" ? "أضف للسلة" : "Add to Cart",
    newProducts: language === "ar" ? "المنتجات الجديدة" : "New Products",
  };

  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            {translations.newProducts}
          </h2>
          <Tag className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
        </div>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: language === "ar" ? "rtl" : "ltr",
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0 items-stretch">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-full md:basis-1/3 lg:basis-1/5 h-full"
              >
                <ProductCard
                  product={product}
                  language={language}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onToggleCompare={onToggleCompare}
                  compareItems={compareItems}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious
            className={`${language === "ar" ? "translate-x-1/2" : "-translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-50`}
          />
          <CarouselNext
            className={`${language === "ar" ? "-translate-x-1/2" : "translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-50`}
          />
        </Carousel>
      </div>
    </section>
  );
};

export default NewProductsSlider;
