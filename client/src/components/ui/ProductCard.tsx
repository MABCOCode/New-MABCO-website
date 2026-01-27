import React from 'react';
import { Star, ShoppingCart, Tag, Flame } from 'lucide-react';
import { Product } from '../../types/product';

export interface ProductCardProps {
  product: Product;
  language: 'ar' | 'en';
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleCompare?: (productId: number) => void;
  compareItems?: number[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onProductClick,
  onAddToCart,
  onToggleCompare,
  compareItems = [],
}) => {
  const isCompared = compareItems.includes(product.id);

  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:border-[#009FE3]/30 overflow-hidden flex flex-col h-full">
        <div
          className="relative cursor-pointer flex-shrink-0"
          onClick={() => onProductClick && onProductClick(product)}
        >
          {onToggleCompare && (
            (() => {
              const badgeSide = language === 'ar' ? 'right-4' : 'left-4';
              const compareSide = badgeSide === 'right-4' ? 'left-4' : 'right-4';
              return (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('[ProductCard] compare button click', { id: product.id });
                    onToggleCompare && onToggleCompare(product.id);
                  }}
                  className={`absolute top-4 ${compareSide} z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md ${
                    isCompared
                      ? 'bg-[#009FE3] text-white scale-110'
                      : 'bg-white/95 text-gray-700 hover:bg-[#009FE3] hover:text-white'
                  }`}
                  title={language === 'ar' ? 'مقارنة' : 'Compare'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              );
            })()
          )}

          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {product.rating && (
              <div className={`absolute bottom-4 ${language === 'ar' ? 'left-4' : 'right-4'} z-10`}>
                <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-md px-2 py-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                </div>
              </div>
            )}

            {product.badge && (
              <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} px-2 py-1 rounded-md font-bold text-white flex items-center gap-1 text-xs ${
                product.isNew ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {product.isNew && <Tag className="w-3 h-3" />}
                {product.isHot && <Flame className="w-3 h-3" />}
                <span>{product.badge}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 flex flex-col flex-1 justify-between">
          <h3
            className={`font-bold text-gray-900 mb-2 text-sm cursor-pointer hover:text-[#009FE3] transition-colors line-clamp-2 min-h-[2.8rem] ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            onClick={() => onProductClick && onProductClick(product)}
          >
            {product.name}
          </h3>

          <div className={`flex items-center ${product.oldPrice ? 'justify-between' : 'justify-start'} mb-3 min-h-[3.5rem]`}>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <div className="font-bold text-[#009FE3] text-lg">
                {product.price} {language === 'ar' ? 'ل.س' : 'SYP'}
              </div>
              {product.oldPrice && <div className="text-xs text-gray-400 line-through">{product.oldPrice} {language === 'ar' ? 'ل.س' : 'SYP'}</div>}
            </div>
            {product.oldPrice && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap">
                -{Math.round(((parseFloat(product.oldPrice.replace(/,/g, '')) - parseFloat(product.price.replace(/,/g, ''))) / parseFloat(product.oldPrice.replace(/,/g, ''))) * 100)}%
              </div>
            )}
          </div>

          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart && onAddToCart(product);
              }}
              className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
