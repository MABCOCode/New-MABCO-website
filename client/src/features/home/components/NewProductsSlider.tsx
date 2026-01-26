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
                {/* Wrap the entire card in a flex container */}
                <div className="h-full">
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:border-[#009FE3]/30 overflow-hidden flex flex-col h-full">
                    {/* Compare Button - Floating */}

                    {/* Product Image - Fixed Height Container */}
                    <div
                      className="relative cursor-pointer flex-shrink-0"
                      onClick={() => onProductClick && onProductClick(product)}
                    >
                      {onToggleCompare &&
                        (() => {
                          const badgeSide =
                            language === "ar" ? "right-4" : "left-4";
                          const compareSide =
                            badgeSide === "right-4" ? "left-4" : "right-4";
                          return (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('[NewProductsSlider] compare button click', { id: product.id });
                                onToggleCompare(product.id);
                              }}
                              className={`absolute top-4 ${compareSide} z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md ${
                                compareItems.includes(product.id)
                                  ? "bg-[#009FE3] text-white scale-110"
                                  : "bg-white/95 text-gray-700 hover:bg-[#009FE3] hover:text-white"
                              }`}
                              title={language === "ar" ? "مقارنة" : "Compare"}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </button>
                          );
                        })()}

                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Rating Badge */}
                        {product.rating && (
                          <div
                            className={`absolute bottom-4 ${language === "ar" ? "left-4" : "right-4"} z-10`}
                          >
                            <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-md px-2 py-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-bold text-gray-900">
                                {product.rating}
                              </span>
                            </div>
                          </div>
                        )}
                        {/* Product Badge */}
                        {product.badge && (
                          <div
                            className={`absolute top-4 ${language === "ar" ? "right-4" : "left-4"} px-2 py-1 rounded-md font-bold text-white flex items-center gap-1 text-xs ${
                              product.isNew ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {product.isNew && <Tag className="w-3 h-3" />}
                            {product.isHot && <Flame className="w-3 h-3" />}
                            <span>{product.badge}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info - Flex Grow to Fill Available Space */}
                    <div className="p-3 flex flex-col flex-1 justify-between">
                      {/* Product Name with fixed height */}
                      <h3
                        className={`font-bold text-gray-900 mb-2 text-sm cursor-pointer hover:text-[#009FE3] transition-colors line-clamp-2 min-h-[2.8rem] ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                        onClick={() =>
                          onProductClick && onProductClick(product)
                        }
                      >
                        {product.name}
                      </h3>

                      {/* Price Section with consistent height */}
                      <div
                        className={
                          language === "ar" ? "text-right" : "text-left"
                        }
                      >
                        <div className="font-bold text-[#009FE3] text-lg mb-3">
                          {product.price} {language === "ar" ? "ل.س" : "SYP"}
                        </div>
                        {product.oldPrice && (
                          <div className="text-xs text-gray-400 line-through mb-4">
                            {product.oldPrice}{" "}
                            {language === "ar" ? "ل.س" : "SYP"}
                          </div>
                        )}
                        {!product.oldPrice && <div className="mb-7"></div>}{" "}
                        {/* Spacer for consistent height */}
                      </div>

                      {/* Add to Cart Button - Pushed to bottom */}
                      <div className="mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart && onAddToCart(product);
                          }}
                          className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {translations.addToCart}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
