import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/product";

type CartItem = {
  id: number | string;
  productId?: number;
  name: string;
  price: string | undefined;
  oldPrice?: string;
  image?: string;
  quantity: number;
  variant?: string;
  variantColor?: string;
  chargeOption?: { optionId: string; value: string } | null;
};

type AddToCartFn = (
  product: Product | any,
  options?: { color?: string; variantColorHex?: string | null; variantImage?: string | null; chargeOptionId?: string | null; chargeOptionLabel?: string | null },
) => void;

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: AddToCartFn;
  updateQuantity: (id: number | string, quantity: number) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cartItems.reduce((s, it) => s + (it.quantity || 0), 0);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const addToCart: AddToCartFn = (product, options) => {
    const id = product.id ?? product.productId ?? product.sku ?? Math.random();
    const variant = options?.color;
    const variantColorHex = options?.variantColorHex ?? null;
    const variantImage = options?.variantImage ?? null;
    const chargeOptionId = options?.chargeOptionId ?? null;
    const chargeOptionLabel = options?.chargeOptionLabel ?? null;

    const existing = cartItems.find(
      (it) =>
        String(it.id) === String(id) &&
        it.variant === variant &&
        String(it.chargeOption?.optionId ?? "") === String(chargeOptionId ?? ""),
    );

    if (existing) {
      setCartItems((prev) => prev.map((it) => (it === existing ? { ...it, quantity: it.quantity + 1 } : it)));
    } else {
      // If a charge option was selected, prefer its numeric price
      const selectedCharge = chargeOptionId
        ? product.chargeOptions?.find((o: any) => String(o.id) === String(chargeOptionId))
        : undefined;
      const itemPrice = selectedCharge && typeof selectedCharge.price === "number"
        ? selectedCharge.price.toLocaleString("en-US")
        : product.price;

      setCartItems((prev) => [
        ...prev,
        {
          id,
          productId: product.id,
          name: product.name || product.title || "",
          price: itemPrice,
          oldPrice: product.oldPrice,
          image: variantImage ?? product.image ?? product.thumbnail ?? "",
          quantity: 1,
          variant: variant,
          variantColor: variantColorHex ?? variant,
          chargeOption: chargeOptionId ? { optionId: chargeOptionId, value: chargeOptionLabel ?? chargeOptionId } : null,
        },
      ]);
    }

    setCartOpen(true);
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) => prev.map((it) => (String(it.id) === String(id) ? { ...it, quantity } : it)));
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((it) => String(it.id) !== String(id)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartOpen, openCart, closeCart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
