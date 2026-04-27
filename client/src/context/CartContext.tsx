import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "../types/product";
import { applyOfferDiscount } from "../utils/offerPricing";

type CartItem = {
  isCouponItem?: boolean;
  id: number | string;
  productId?: number | string;
  stkCode?: string | null;
  name: string;
  nameAr?: string;
  price: string | number | undefined;
  basePrice?: number | null;
  oldPrice?: string | number | null;
  image?: string;
  quantity: number;
  variant?: string;
  variantColor?: string;
  variantSku?: string | null;
  variantPrice?: number | null;
  chargeOptionSku?: string | null;
  chargeOptionPrice?: number | null;
  appliedOffers?: any[] | null;
  availableOffers?: any[] | null;
  chargeOption?: { optionId: string; value: string } | null;
  isFreeGift?: boolean;
  isBundleItem?: boolean;
  linkedToProductId?: number | string;
  bundleDiscount?: number;
  bundleDiscountType?: "value" | "percentage" | null;
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
    basePrice?: number;
    variantSku?: string | null;
    variantPrice?: number | null;
    chargeOptionSku?: string | null;
    chargeOptionPrice?: number | null;
    appliedOffers?: any[] | null;
    availableOffers?: any[] | null;
    isCouponItem?: boolean;
    isFreeGift?: boolean;
    isBundleItem?: boolean;
    linkedToProductId?: number | string;
    bundleDiscount?: number;
    bundleDiscountType?: "value" | "percentage" | null;
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
const MAX_PURCHASE_QUANTITY = 2;
const CART_STORAGE_KEY = "mabco_cart_v1";

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cartItems.reduce((s, it) => s + (it.quantity || 0), 0);
  const apiBase =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

  const toNumber = (val: any) => {
    const n = typeof val === "number" ? val : Number(String(val).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const formatPrice = (val: number | null) =>
    val === null ? undefined : val.toLocaleString("en-US");

  const resolveSourcePrice = (item: CartItem, product: any) => {
    const base = toNumber(product?.price);
    let nextPrice = base;

    if (item.variantSku && Array.isArray(product?.colorVariants)) {
      const variant = product.colorVariants.find(
        (v: any) => String(v.stk_code || v.stkCode) === String(item.variantSku),
      );
      const variantPrice = toNumber(variant?.price);
      if (variantPrice !== null) nextPrice = variantPrice;
    }

    if (item.chargeOptionSku && Array.isArray(product?.chargeOptions)) {
      const option = product.chargeOptions.find(
        (o: any) => String(o.stk_code || o.stkCode) === String(item.chargeOptionSku),
      );
      const optionPrice = toNumber(option?.price);
      if (optionPrice !== null) nextPrice = optionPrice;
    }

    return nextPrice;
  };

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    let mounted = true;
    const ids = cartItems.map((item) => item.stkCode || item.productId || item.id).filter(Boolean);
    if (ids.length === 0) return;

    Promise.all(
      ids.map((id) =>
        fetch(`${apiBase}/products/${encodeURIComponent(String(id))}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((json) => json?.data ?? null)
          .catch(() => null),
      ),
    ).then((rows) => {
      if (!mounted) return;
      const byKey = new Map<string, any>();
      rows.forEach((product) => {
        if (!product) return;
        const key = String(product.stk_code || product.id || product._id || "");
        if (key) byKey.set(key, product);
      });

      setCartItems((prev) =>
        prev.map((item) => {
          const key = String(item.stkCode || item.productId || item.id || "");
          const product = byKey.get(key);
          if (!product) return item;

          const sourcePrice = resolveSourcePrice(item, product);
          const directDiscountOffer = Array.isArray(item.appliedOffers)
            ? item.appliedOffers.find((offer: any) => offer?.type === "direct_discount")
            : null;
          const linkedPrimaryItem = item.linkedToProductId
            ? prev.find((candidate) => {
                const candidateId = String(candidate.productId ?? candidate.id ?? "");
                return (
                  candidateId === String(item.linkedToProductId) &&
                  !candidate.isBundleItem &&
                  !candidate.isFreeGift
                );
              })
            : null;
          const couponOffer = Array.isArray(linkedPrimaryItem?.appliedOffers)
            ? linkedPrimaryItem.appliedOffers.find((offer: any) => offer?.type === "coupon")
            : null;

          let nextPrice = sourcePrice;
          let nextOldPrice = item.oldPrice;

          if (item.isFreeGift) {
            nextPrice = 0;
            nextOldPrice = formatPrice(sourcePrice);
          } else if (item.isBundleItem && typeof item.bundleDiscount === "number") {
            nextPrice =
              sourcePrice === null
                ? sourcePrice
                : Math.round(
                    applyOfferDiscount(sourcePrice, {
                      type: "bundle_discount",
                      discountValue: item.bundleDiscount,
                      discountType: item.bundleDiscountType ?? "percentage",
                    }),
                  );
            nextOldPrice = formatPrice(sourcePrice);
          } else if (directDiscountOffer) {
            nextPrice =
              sourcePrice === null
                ? sourcePrice
                : Math.round(applyOfferDiscount(sourcePrice, directDiscountOffer));
            nextOldPrice = formatPrice(sourcePrice);
          } else if (
            couponOffer &&
            item.linkedToProductId &&
            (item.isCouponItem || (item.oldPrice !== undefined && item.oldPrice !== null))
          ) {
            nextPrice =
              sourcePrice === null
                ? sourcePrice
                : Math.round(applyOfferDiscount(sourcePrice, couponOffer));
            nextOldPrice = formatPrice(sourcePrice);
          }

          return {
            ...item,
            name: product.name || item.name,
            nameAr: product.nameAr || item.nameAr,
            image: item.image || product.image || product.thumbnail,
            basePrice: sourcePrice,
            oldPrice: nextOldPrice,
            price: formatPrice(nextPrice),
          };
        }),
      );
    });

    return () => {
      mounted = false;
    };
  }, []);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const addToCart: AddToCartFn = (product, options) => {
    const id = options?.customId ?? product.id ?? product.productId ?? product.stk_code ?? Math.random();
    const variant = options?.color;
    const variantColorHex = options?.variantColorHex ?? null;
    const variantImage = options?.variantImage ?? null;
    const chargeOptionId = options?.chargeOptionId ?? null;
    const chargeOptionLabel = options?.chargeOptionLabel ?? null;
    const qty = Math.min(MAX_PURCHASE_QUANTITY, Math.max(1, options?.quantity ?? 1));

    const existing = cartItems.find(
      (it) =>
        String(it.id) === String(id) &&
        it.variant === variant &&
        String(it.chargeOption?.optionId ?? "") === String(chargeOptionId ?? ""),
    );

    if (existing) {
      setCartItems((prev) =>
        prev.map((it) =>
          it === existing
            ? { ...it, quantity: Math.min(MAX_PURCHASE_QUANTITY, it.quantity + qty) }
            : it,
        ),
      );
    } else {
      // If a charge option was selected, prefer its numeric price
      const selectedCharge = chargeOptionId
        ? product.chargeOptions?.find((o: any) => String(o.id) === String(chargeOptionId))
        : undefined;
      const fallbackProductPrice =
        typeof product.price === "number" ? product.price : Number(product.price);
      const basePrice =
        typeof options?.basePrice === "number"
          ? options.basePrice
          : typeof options?.chargeOptionPrice === "number"
          ? options.chargeOptionPrice
          : typeof options?.variantPrice === "number"
          ? options.variantPrice
          : Number.isFinite(fallbackProductPrice)
          ? fallbackProductPrice
          : undefined;

      const itemPrice =
        options?.overridePrice !== undefined
          ? typeof options.overridePrice === "number"
            ? options.overridePrice.toLocaleString("en-US")
            : options.overridePrice
          : typeof basePrice === "number"
          ? basePrice.toLocaleString("en-US")
          : selectedCharge && typeof selectedCharge.price === "number"
          ? selectedCharge.price.toLocaleString("en-US")
          : typeof product.price === "number"
          ? product.price.toLocaleString("en-US")
          : product.price;
      const itemOldPrice =
        options?.overrideOldPrice !== undefined
          ? typeof options.overrideOldPrice === "number"
            ? options.overrideOldPrice.toLocaleString("en-US")
            : options.overrideOldPrice
          : undefined;

      setCartItems((prev) => [
        ...prev,
        {
          id,
          productId: product.id,
          stkCode: product.stk_code ?? product.stkCode ?? null,
          name: product.name || product.title || "",
          nameAr: product.nameAr || product.titleAr || "",
          price: itemPrice,
          basePrice: typeof basePrice === "number" ? basePrice : null,
          oldPrice: itemOldPrice,
          image: variantImage ?? product.image ?? product.thumbnail ?? "",
          quantity: Math.min(MAX_PURCHASE_QUANTITY, qty),
          variant: variant,
          variantColor: variantColorHex ?? variant,
          variantSku: options?.variantSku ?? null,
          variantPrice: typeof options?.variantPrice === "number" ? options.variantPrice : null,
          chargeOptionSku: options?.chargeOptionSku ?? null,
          chargeOptionPrice: typeof options?.chargeOptionPrice === "number" ? options.chargeOptionPrice : null,
          appliedOffers: options?.appliedOffers ?? null,
          availableOffers: options?.availableOffers ?? null,
          chargeOption: chargeOptionId ? { optionId: chargeOptionId, value: chargeOptionLabel ?? chargeOptionId } : null,
          isCouponItem: options?.isCouponItem,
          isFreeGift: options?.isFreeGift,
          isBundleItem: options?.isBundleItem,
          linkedToProductId: options?.linkedToProductId,
          bundleDiscount: options?.bundleDiscount,
          bundleDiscountType: options?.bundleDiscountType ?? null,
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
    const safeQuantity = Math.min(MAX_PURCHASE_QUANTITY, quantity);
    setCartItems((prev) =>
      prev.map((it) =>
        String(it.id) === String(id) ? { ...it, quantity: safeQuantity } : it,
      ),
    );
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => {
      const target = prev.find((it) => String(it.id) === String(id));
      if (!target) return prev;
      if (target.linkedToProductId) {
        const hasMain = prev.some((item) => {
          const mainId = String(item.productId ?? item.id ?? "");
          return (
            mainId === String(target.linkedToProductId) &&
            !item.isBundleItem &&
            !item.isFreeGift
          );
        });
        if (hasMain) return prev;
      }

      const targetProductId = String(target.productId ?? target.id ?? "");
      const isPrimaryItem = !target.isBundleItem && !target.isFreeGift;

      const next: CartItem[] = [];
      for (const item of prev) {
        if (String(item.id) === String(id)) {
          continue;
        }

        if (isPrimaryItem && targetProductId && String(item.linkedToProductId ?? "") === targetProductId) {
          // Remove all offer-applied products when the main item is removed.
          continue;
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
