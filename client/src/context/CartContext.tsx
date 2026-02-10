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
  isFreeGift?: boolean;
  isBundleItem?: boolean;
  linkedToProductId?: number;
  bundleDiscount?: number;
};

type AddToCartFn = (
  product: Product | any,
  options?: {
    color?: string;
    variantColorHex?: string | null;
    variantImage?: string | null;
    chargeOptionId?: string | null;
    chargeOptionLabel?: string | null;
    quantity?: number;
    customId?: string;
    overridePrice?: number | string;
    overrideOldPrice?: number | string;
    isFreeGift?: boolean;
    isBundleItem?: boolean;
    linkedToProductId?: number;
    bundleDiscount?: number;
  },
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
    const id = options?.customId ?? product.id ?? product.productId ?? product.sku ?? Math.random();
    const variant = options?.color;
    const variantColorHex = options?.variantColorHex ?? null;
    const variantImage = options?.variantImage ?? null;
    const chargeOptionId = options?.chargeOptionId ?? null;
    const chargeOptionLabel = options?.chargeOptionLabel ?? null;
    const qty = options?.quantity ?? 1;

    const existing = cartItems.find(
      (it) =>
        String(it.id) === String(id) &&
        it.variant === variant &&
        String(it.chargeOption?.optionId ?? "") === String(chargeOptionId ?? ""),
    );

    if (existing) {
      setCartItems((prev) => prev.map((it) => (it === existing ? { ...it, quantity: it.quantity + qty } : it)));
    } else {
      // If a charge option was selected, prefer its numeric price
      const selectedCharge = chargeOptionId
        ? product.chargeOptions?.find((o: any) => String(o.id) === String(chargeOptionId))
        : undefined;
      const itemPrice =
        options?.overridePrice !== undefined
          ? typeof options.overridePrice === "number"
            ? options.overridePrice.toLocaleString("en-US")
            : options.overridePrice
          : selectedCharge && typeof selectedCharge.price === "number"
          ? selectedCharge.price.toLocaleString("en-US")
          : product.price;
      const itemOldPrice =
        options?.overrideOldPrice !== undefined
          ? typeof options.overrideOldPrice === "number"
            ? options.overrideOldPrice.toLocaleString("en-US")
            : options.overrideOldPrice
          : product.oldPrice;

      setCartItems((prev) => [
        ...prev,
        {
          id,
          productId: product.id,
          name: product.name || product.title || "",
          price: itemPrice,
          oldPrice: itemOldPrice,
          image: variantImage ?? product.image ?? product.thumbnail ?? "",
          quantity: qty,
          variant: variant,
          variantColor: variantColorHex ?? variant,
          chargeOption: chargeOptionId ? { optionId: chargeOptionId, value: chargeOptionLabel ?? chargeOptionId } : null,
          isFreeGift: options?.isFreeGift,
          isBundleItem: options?.isBundleItem,
          linkedToProductId: options?.linkedToProductId,
          bundleDiscount: options?.bundleDiscount,
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
    setCartItems((prev) => {
      const target = prev.find((it) => String(it.id) === String(id));
      if (!target) return prev;

      const targetProductId = target.productId ?? Number(target.id);
      const isPrimaryItem = !target.isBundleItem && !target.isFreeGift;

      const next: CartItem[] = [];
      for (const item of prev) {
        if (String(item.id) === String(id)) {
          continue;
        }

        if (isPrimaryItem && targetProductId && item.linkedToProductId === targetProductId) {
          if (item.isFreeGift) {
            // Free gifts depend on the main item, remove them.
            continue;
          }
          if (item.isBundleItem && item.oldPrice) {
            // Restore original price when the main item is removed.
            next.push({
              ...item,
              price: item.oldPrice,
              oldPrice: undefined,
              isBundleItem: false,
              bundleDiscount: undefined,
              linkedToProductId: undefined,
            });
            continue;
          }
        }

        next.push(item);
      }

      return next;
    });
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
