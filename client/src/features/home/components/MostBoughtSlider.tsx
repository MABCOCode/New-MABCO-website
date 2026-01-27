// components/MostBoughtProducts.tsx
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { Star, ShoppingCart, Flame, Tag } from "lucide-react";
import ProductCard from '../../../components/ui/ProductCard';
import productsData from "../../../testdata/products.json";

interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating?: number;
  badge?: string;
  isNew?: boolean;
  isHot?: boolean;
}

interface MostBoughtProductsProps {
  language: "ar" | "en";
  products?: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleCompare?: (productId: number) => void;
  compareItems?: number[];
}

const MostBoughtProducts: React.FC<MostBoughtProductsProps> = ({
  language,
  products: customProducts,
  onProductClick,
  onAddToCart,
  onToggleCompare,
  compareItems = [],
}) => {
  // load products from testdata
  // productsData is the JSON file containing `mostBought` and `newProducts` arrays
  const defaultProducts: Product[] = (productsData as any)?.mostBought ?? [];

  const products = customProducts || defaultProducts;
  const translations = {
    addToCart: language === "ar" ? "أضف للسلة" : "Add to Cart",
    mostSold: language === "ar" ? "الأكثر مبيعاً" : "Most Sold",
  };

  return (
    <section id="products" className="py-8 bg-white/50 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 fill-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            {translations.mostSold}
          </h2>
          <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 fill-yellow-500" />
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

export default MostBoughtProducts;
