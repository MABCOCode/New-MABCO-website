import React from "react";
import { Sparkles, ShoppingCart, Tag } from "lucide-react";

interface RelatedProduct {
  id: number;
  name: string;
  nameAr?: string;
  image: string;
  originalPrice: number;
  discountPercentage: number;
}

interface RelatedProductsWithDiscountProps {
  products: RelatedProduct[];
  language: "ar" | "en";
  heroProductAdded?: boolean;
  onAddToCart?: (productId: number) => void;
}

export function RelatedProductsWithDiscount({
  products,
  language,
  heroProductAdded,
  onAddToCart,
}: RelatedProductsWithDiscountProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">
          {language === "ar" ? "منتجات مرتبطة بخصم" : "Related Products Discount"}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const discounted = Math.round(
            product.originalPrice * (1 - product.discountPercentage / 100),
          );

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col"
            >
              <div className="relative mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.discountPercentage}%
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">
                {language === "ar" && product.nameAr ? product.nameAr : product.name}
              </h4>

              <div className="mb-3">
                <div className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString("en-US")}{" "}
                  {language === "ar" ? "ل.س" : "SYP"}
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {discounted.toLocaleString("en-US")}{" "}
                  {language === "ar" ? "ل.س" : "SYP"}
                </div>
              </div>

              <button
                onClick={() => onAddToCart?.(product.id)}
                disabled={!heroProductAdded}
                className="mt-auto w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {heroProductAdded
                  ? language === "ar"
                    ? "أضف للسلة"
                    : "Add to Cart"
                  : language === "ar"
                  ? "أضف المنتج الرئيسي أولاً"
                  : "Add main product first"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
