import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import translations from "../../../i18n/translations";

interface CartItem {
  id: number | string;
  productId?: number;
  name: string;
  price: string | undefined;
  oldPrice?: string;
  image?: string;
  quantity: number;
  variant?: string;
  variantColor?: string;
  chargeOption?: {
    optionId: string;
    value: string;
  };
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number | string, quantity: number) => void;
  onRemoveItem: (id: number | string) => void;
  onProceedToCheckout: () => void;
  language: "ar" | "en";
}


export function ShoppingCart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  language,
}: ShoppingCartProps) {
  const t = translations[language];
  const isArabic = language === "ar";
  const [removingItemId, setRemovingItemId] = useState<number | string | null>(null);

  // Calculate totals
  const parsePrice = (price: string | undefined) => {
    if (!price || typeof price !== 'string') return 0;
    return parseInt(price.replace(/,/g, "")) || 0;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  const deliveryFee = 0; // TBD - will be calculated at checkout based on location

  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const handleRemove = (id: number | string) => {
    if (window.confirm(t.confirmRemove)) {
      setRemovingItemId(id);
      setTimeout(() => {
        onRemoveItem(id);
        setRemovingItemId(null);
      }, 300);
    }
  };

  const handleIncreaseQuantity = (item: CartItem) => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 ${isArabic ? "left-0" : "right-0"} h-full w-full md:w-[450px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 flex flex-col`}
        style={{
          transform: isOpen ? "translateX(0)" : isArabic ? "translateX(-100%)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-2xl font-bold">{t.shoppingCart}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items count badge */}
        {cartItems.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {cartItems.length} {t.items}
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.empty}</h3>
              <p className="text-gray-500 mb-6">{t.emptyMessage}</p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 ${
                    removingItemId === item.id
                      ? "opacity-0 scale-95 -translate-x-4"
                      : "opacity-100 scale-100"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h4>
                      
                      {/* Variant Info */}
                      {item.variant && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          {item.variantColor && (
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.variantColor }}
                            />
                          )}
                          <span>
                            {isArabic ? "اللون:" : "Color:"} {item.variant}
                          </span>
                        </div>
                      )}
                      
                      {/* Charge Option Info */}
                      {item.chargeOption && (
                        <div className="flex items-center gap-2 text-xs text-purple-600 mb-1">
                          <RefreshCw className="w-3 h-3" />
                          <span>{item.chargeOption.value}</span>
                        </div>
                      )}
                      
                      {/* Price with discount */}
                      <div className="mb-3">
                        {item.oldPrice && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(parsePrice(item.oldPrice))} {t.currency}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                              {Math.round((1 - parsePrice(item.price) / parsePrice(item.oldPrice)) * 100)}% خصم
                            </span>
                          </div>
                        )}
                        <p className="text-lg font-bold text-[#009FE3]">
                          {formatPrice(parsePrice(item.price) * item.quantity)} {t.currency}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="w-10 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                          >
                            <Plus className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary - Fixed at bottom */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-6 shadow-lg">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">{t.subtotal}</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(subtotal)} {t.currency}
              </span>
            </div>

            {/* Delivery Fee */}
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <span className="text-gray-600">{t.deliveryFee}</span>
              <span className="text-sm text-gray-500">{t.tbd}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-gray-900">{t.total}</span>
              <span className="text-2xl font-bold text-[#009FE3]">
                {formatPrice(total)} {t.currency}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {t.proceedToCheckout}
              <ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}