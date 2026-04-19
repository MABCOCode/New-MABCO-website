import { Flame, ShoppingCart, Tag, TrendingUp, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { ChargeOptionSlider } from "../../../components/ui/ChargeOptionSlider";
import { ColorSwatch } from "../../../components/ui/ColorSwatch";
import { useCart } from "../../../context/CartContext";
import { getOfferBadgeText, getOfferPricing, getProductOffers } from "../../../data/products";
import { Product } from "../../../types/product";
import { getProductRef } from "../../../utils/entityRefs";
import { getPrimaryOfferBadgeAppearance } from "../../../utils/offerBadgeAppearance";
import { applyOfferDiscount, resolveOfferDiscountType, resolveOfferDiscountValue } from "../../../utils/offerPricing";
import { OfferDetailsCard } from "../../offer/components/OfferDetailsCard";

export interface ProductCardProps {
  product: Product;
  toggleCompare: (productId: string) => void;
  compareItems: string[];
  language: "ar" | "en";
  onQuickView?: () => void;
  topBadge?: React.ReactNode;
  onProductClick?: (product: Product) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  toggleCompare,
  compareItems,
  language,
  onQuickView,
  topBadge,
  onProductClick,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const resolveNumericId = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/[^\d]/g, ""));
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return null;
  };
  const resolvedProductId =
    resolveNumericId((product as any).id) ??
    resolveNumericId((product as any).stk_code);
  const productRef = getProductRef(product);
  const resolvedCartId = productRef || resolvedProductId || `product-${product.name}`;
  const parseNumericPrice = (value: unknown): number => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, "").trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };
  const parseOfferNumber = (value: unknown): number => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9.-]/g, "").trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };
  const shouldIgnoreDescriptionAndSpecsValidation =
    String((product as any)?.cat_code || (product as any)?.category_code || (product as any)?.catCode || "").trim() === "02";

  const safeColorVariants = React.useMemo(
    () => (Array.isArray(product.colorVariants) ? product.colorVariants : []),
    [product.colorVariants],
  );
  const normalizeHex = (value: string | undefined) => {
    if (!value) return "#999999";
    const raw = value.trim();
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
    return "#999999";
  };
  const buildColorGroupKey = (variant: any, name: string, nameAr: string, hexCode: string) => {
    if (hexCode && hexCode !== "#999999") return `hex:${hexCode.toLowerCase()}`;
    const label = String(name || nameAr || variant?.stk_code || variant?.stkCode || "")
      .trim()
      .toLowerCase();
    return label ? `name:${label}` : "";
  };
  const normalizedColorVariants = React.useMemo(() => {
    const deduped = new Map<string, any>();
    const scoreVariant = (variant: any) => {
      const hasImage = Boolean(String(variant.image || (variant.images && variant.images[0]) || "").trim());
      const isActive = typeof variant.active !== "boolean" || variant.active;
      const isAvailable = variant.isAvailable !== false;
      const inStock = variant.inStock !== false;
      return (hasImage ? 4 : 0) + (isActive ? 2 : 0) + (isAvailable && inStock ? 1 : 0);
    };

    safeColorVariants.forEach((variant: any) => {
      const images = Array.isArray(variant.images)
        ? variant.images
            .map((img: any) => (typeof img === "string" ? img : img?.image_link || img?.url || ""))
            .filter(Boolean)
        : [];
      const image = variant.image || images[0] || "";
      const name = variant.name || variant.color_name || "";
      const nameAr = variant.nameAr || variant.color_name_ar || name;
      const hexCode = normalizeHex(variant.hexCode || variant.color_hex || variant.hex);
      const inStock =
        typeof variant.inStock === "boolean"
          ? variant.inStock
          : typeof variant.in_stock === "boolean"
            ? variant.in_stock
            : typeof variant.isAvailable === "boolean"
              ? variant.isAvailable
              : typeof variant.is_available === "boolean"
                ? variant.is_available
                : undefined;
      const isAvailable =
        typeof variant.isAvailable === "boolean"
          ? variant.isAvailable
          : typeof variant.is_available === "boolean"
            ? variant.is_available
            : typeof variant.active === "boolean"
              ? variant.active
              : undefined;

      const normalized = {
        ...variant,
        name,
        nameAr,
        hexCode,
        image,
        images,
        price: typeof variant.price === "number" ? variant.price : Number(variant.price),
        inStock,
        isAvailable,
      };

      const key = buildColorGroupKey(variant, name, nameAr, hexCode);
      if (!key) return;

      const existing = deduped.get(key);
      if (!existing || scoreVariant(normalized) > scoreVariant(existing)) {
        deduped.set(key, normalized);
      }
    });

    return Array.from(deduped.values());
  }, [safeColorVariants]);
  const visibleColorVariants = React.useMemo(
    () =>
      normalizedColorVariants
        .filter(
          (variant: any) =>
            variant.inStock !== false &&
            variant.isAvailable !== false &&
            (typeof variant.active !== "boolean" || variant.active) &&
            Boolean(String(variant.name || variant.nameAr || "").trim()) &&
            Boolean(String(variant.image || (variant.images && variant.images[0]) || "").trim())
        )
        .sort((a: any, b: any) => {
          const aHasOffers = Array.isArray(a?.offers) && a.offers.length > 0 ? 1 : 0;
          const bHasOffers = Array.isArray(b?.offers) && b.offers.length > 0 ? 1 : 0;
          return bHasOffers - aHasOffers;
        }),
    [normalizedColorVariants],
  );
  const safeChargeOptions = React.useMemo(
    () => (Array.isArray(product.chargeOptions) ? product.chargeOptions : []),
    [product.chargeOptions],
  );
  const normalizedChargeOptions = React.useMemo(
    () =>
      safeChargeOptions
        .map((opt: any, index: number) => ({
          ...opt,
          id: String(opt.id ?? opt.stk_code ?? opt.code ?? index),
          value: opt.value ?? opt.name ?? "",
          valueAr: opt.valueAr ?? opt.name_ar ?? opt.nameAr ?? opt.value ?? opt.name ?? "",
          price: typeof opt.price === "number" ? opt.price : Number(opt.price),
        }))
        .filter(
          (opt: any) =>
            (typeof opt.active !== "boolean" || opt.active) &&
            (typeof opt.in_stock !== "boolean" || opt.in_stock) &&
            Boolean(String(opt.value || opt.valueAr || opt.name || opt.name_ar || "").trim()),
        )
        .sort((a: any, b: any) => {
          const aPrice = Number.isFinite(a.price) ? a.price : Number.MAX_SAFE_INTEGER;
          const bPrice = Number.isFinite(b.price) ? b.price : Number.MAX_SAFE_INTEGER;
          return aPrice - bPrice;
        }),
    [safeChargeOptions],
  );
  const preferredOfferColor = React.useMemo(() => {
    const withOffers = visibleColorVariants.find((variant: any) => {
      const offers = Array.isArray(variant?.offers) ? variant.offers : [];
      return offers.length > 0;
    });
    return withOffers?.name || "";
  }, [visibleColorVariants]);
  const [selectedColor, setSelectedColor] = useState(
    preferredOfferColor || visibleColorVariants[0]?.name || "",
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(
    normalizedChargeOptions[0]?.id || null,
  );
  const [isHovered, setIsHovered] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [pendingCartOptions, setPendingCartOptions] = useState<any | null>(null);
  const [showOfferProducts, setShowOfferProducts] = useState(false);
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [offerProductsLoading, setOfferProductsLoading] = useState(false);
  const [offerProductsError, setOfferProductsError] = useState<string | null>(null);

  // Use hovered color if available, otherwise use selected color
  const displayColor = hoveredColor || selectedColor;
  const currentColorVariant = visibleColorVariants.find((v) => v.name === displayColor) || null;
  const currentImage = currentColorVariant?.image || product.image;

  const hasColors = visibleColorVariants.length > 0;
  const hasChargeOptions = normalizedChargeOptions.length > 0;
  const hasAnyVariants = safeColorVariants.length > 0 || safeChargeOptions.length > 0;
  const hasValidVariants = hasColors || hasChargeOptions;
  const hasValidImage =
    Boolean(String(product.image || "").trim()) ||
    visibleColorVariants.length > 0 ||
    safeChargeOptions.length > 0; // Allow if has charge options
  const hasValidName = Boolean(String(product.name || "").trim());
  const hasSpecs = Array.isArray((product as any).specs) && (product as any).specs.length > 0;
  const hasDescription = Boolean(
    String((product as any).description || (product as any).descriptionAr || "").trim(),
  );
  const hasDetails =
    shouldIgnoreDescriptionAndSpecsValidation ||
    hasDescription ||
    hasSpecs ||
    safeColorVariants.length > 0 ||
    safeChargeOptions.length > 0;
  const hasPrice = parseNumericPrice((product as any).price) > 0;
  const hasColorVariants = Array.isArray((product as any).colorVariants) && (product as any).colorVariants.length > 0;
  
  // Allow display if:
  // - Has valid name, image, price AND
  // - (Has description/specs OR has color variants OR has charge options)
  // This lets us show products with variants even if description is missing
  const hasRequiredData =
    hasValidName &&
    hasValidImage &&
    hasPrice &&
    hasDetails;
  
  if (hasAnyVariants && !hasValidVariants) {
    return null;
  }
  
  if (!hasRequiredData) {
    return null;
  }

  const badgeText = (() => {
    if (product.isMostSold) return language === "ar" ? "الأكثر مبيعاً" : "MOST SOLD";
    if (product.badge) {
      const badgeLower = String(product.badge).toLowerCase();
      if (language === "ar") {
        if (badgeLower === "new" || badgeLower === "جديد") return "جديد";
        if (badgeLower === "hot" || badgeLower === "حار") return "حار";
      } else {
        if (badgeLower === "جديد" || badgeLower === "new") return "NEW";
        if (badgeLower === "حار" || badgeLower === "hot") return "HOT";
      }
      return String(product.badge);
    }
    if (product.isNew) return language === "ar" ? "جديد" : "NEW";
    if (product.isHot) return language === "ar" ? "حار" : "HOT";
    return "";
  })();

  const badgeVariant = product.isMostSold
    ? "text-white"
    : product.isNew
    ? "bg-green-500"
    : product.isHot
    ? "bg-red-500"
    : "bg-slate-600";

  const badgeStyle = product.isMostSold
    ? { background: "linear-gradient(90deg, #f59e0b, #f97316)" }
    : undefined;

  // Robust compare match: support string or number ids
  const isCompared = Array.isArray(compareItems)
    ? compareItems.some((id) => String(id) === String(productRef))
    : false;

  const currentChargeOption = normalizedChargeOptions.find(
    (opt) => opt.id === selectedChargeOption,
  );

  const extractOfferStkCodes = (offer: any): string[] => {
    const raw = offer?.products || offer?.productStkCodes || offer?.product_codes || [];
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item: any) =>
        typeof item === "string"
          ? item
          : item?.stk_code || item?.id || item?.code || "",
      )
      .map((code: any) => String(code).trim())
      .filter(Boolean);
  };

  const loadOfferProducts = async (offer: any) => {
    const codes = extractOfferStkCodes(offer);
    if (!codes.length) {
      setOfferProducts([]);
      return;
    }
    setOfferProductsLoading(true);
    setOfferProductsError(null);
    try {
      const apiBase =
        (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
      const url = `${apiBase}/products?stk_codes=${encodeURIComponent(codes.join(","))}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load offer products: ${res.status}`);
      const json = await res.json();
      const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      if (items.length > 0) {
        setOfferProducts(items);
        return;
      }
      setOfferProducts([]);
    } catch (err: any) {
      setOfferProducts([]);
      setOfferProductsError(err?.message || "Failed to load offer products");
    } finally {
      setOfferProductsLoading(false);
    }
  };

  const closeOfferDialog = () => {
    setOfferDialogOpen(false);
    setSelectedOffer(null);
    setPendingCartOptions(null);
    setShowOfferProducts(false);
    setOfferProducts([]);
    setOfferProductsError(null);
    setOfferProductsLoading(false);
  };

  const addPrimaryWithOffer = (offer: any | null, override?: { price?: number; oldPrice?: number }) => {
    if (!pendingCartOptions) return;
    addToCart({ ...product, id: resolvedProductId ?? (product as any).id }, {
      ...pendingCartOptions,
      appliedOffers: offer ? [offer] : null,
      overridePrice: override?.price,
      overrideOldPrice: override?.oldPrice,
    });
  };

  const handleDirectDiscount = (offer: any) => {
    const base =
      typeof pendingCartOptions?.basePrice === "number"
        ? pendingCartOptions.basePrice
        : parseNumericPrice(product.price);
    const discounted = Math.round(applyOfferDiscount(base, offer));
    addPrimaryWithOffer(offer, { price: discounted, oldPrice: base });
    closeOfferDialog();
  };

  const handleAddRelatedProduct = (
    offer: any,
    relatedProduct: any,
    discountedPrice: number,
    basePrice: number,
    meta: { type: "coupon" | "bundle" | "free" },
  ) => {
    addPrimaryWithOffer(offer);
    if (!relatedProduct) return;
    addToCart(relatedProduct, {
      customId: `${meta.type}-${resolvedCartId}-${relatedProduct.id || relatedProduct.stk_code || Date.now()}`,
      quantity: 1,
      overridePrice: discountedPrice,
      overrideOldPrice: basePrice,
      isCouponItem: meta.type === "coupon",
      isBundleItem: meta.type === "bundle",
      isFreeGift: meta.type === "free",
      linkedToProductId: String(resolvedProductId ?? product.id ?? productRef ?? ""),
      bundleDiscount: meta.type === "bundle" ? resolveOfferDiscountValue(offer) : undefined,
      bundleDiscountType: meta.type === "bundle" ? resolveOfferDiscountType(offer) : undefined,
    });
    closeOfferDialog();
  };

  const handleAddToCart = () => {
    const chosenColor = hasColors ? selectedColor : undefined;
    const chosenVariant = visibleColorVariants.find((v) => v.name === chosenColor) || null;
    const chosenColorHex = chosenVariant?.hexCode || null;
    const chosenVariantImage = chosenVariant?.image || null;
    const chargeLabel =
      currentChargeOption?.value ||
      currentChargeOption?.valueAr ||
      currentChargeOption?.name ||
      currentChargeOption?.name_ar ||
      null;
    const availableOffersRaw = hasValidVariants
      ? (currentChargeOption && Array.isArray((currentChargeOption as any).offers)
          ? (currentChargeOption as any).offers
          : chosenVariant && Array.isArray((chosenVariant as any).offers)
          ? (chosenVariant as any).offers
          : null)
      : Array.isArray((product as any).offers)
      ? (product as any).offers
      : null;

    const variantPriceValue =
      chosenVariant && typeof chosenVariant.price !== "undefined"
        ? parseNumericPrice(chosenVariant.price)
        : null;
    const chargePriceValue =
      currentChargeOption && typeof currentChargeOption.price !== "undefined"
        ? parseNumericPrice(currentChargeOption.price)
        : null;
    const basePriceValue =
      typeof chargePriceValue === "number"
        ? chargePriceValue
        : typeof variantPriceValue === "number"
        ? variantPriceValue
        : parseNumericPrice(product.price);

    const cartOptions: any = {
      customId: String(resolvedCartId),
      color: chosenColor,
      variantColorHex: chosenColorHex,
      variantImage: chosenVariantImage,
      variantSku: (chosenVariant as any)?.stk_code ?? null,
      variantPrice: typeof variantPriceValue === "number" ? variantPriceValue : null,
      chargeOptionId: selectedChargeOption,
      chargeOptionLabel: chargeLabel,
      chargeOptionSku: (currentChargeOption as any)?.stk_code ?? null,
      chargeOptionPrice: typeof chargePriceValue === "number" ? chargePriceValue : null,
      basePrice: basePriceValue,
      appliedOffers: null,
      availableOffers: availableOffersRaw,
    };

    const availableOffers = getProductOffers({ offers: availableOffersRaw || [] } as any);
    if (availableOffers.length > 0) {
      setPendingCartOptions(cartOptions);
      setSelectedOffer(null);
      setOfferDialogOpen(true);
      return;
    }

    addToCart({ ...product, id: resolvedProductId ?? (product as any).id }, cartOptions);
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
  };

  const handleColorHover = (colorName: string | null) => {
    setHoveredColor(colorName);
  };

  React.useEffect(() => {
    if (!hasColors) return;
    const exists = visibleColorVariants.some((v: any) => v.name === selectedColor);
    if (!exists) {
      setSelectedColor(preferredOfferColor || visibleColorVariants[0]?.name || "");
      return;
    }
    if (preferredOfferColor && selectedColor !== preferredOfferColor) {
      const current = visibleColorVariants.find((v: any) => v.name === selectedColor);
      const currentOffers = Array.isArray(current?.offers) ? current.offers : [];
      if (currentOffers.length === 0) {
        setSelectedColor(preferredOfferColor);
      }
    }
  }, [hasColors, visibleColorVariants, selectedColor, preferredOfferColor]);

  const colorPriceValue = currentColorVariant ? parseNumericPrice(currentColorVariant.price) : 0;
  const selectedSourcePrice = currentChargeOption
    ? parseNumericPrice(currentChargeOption.price)
    : colorPriceValue > 0
    ? colorPriceValue
    : parseNumericPrice(product.price);
  const baseProductPrice = parseNumericPrice(product.price);
  const hasColorPriceDiff = colorPriceValue > 0 && Math.abs(colorPriceValue - baseProductPrice) > 0.0001;
  const selectedVariantOffers = currentChargeOption?.offers
    ? getProductOffers({ offers: (currentChargeOption as any).offers } as any)
    : currentColorVariant?.offers
    ? getProductOffers({ offers: (currentColorVariant as any).offers } as any)
    : [];
  const displayOffers = hasValidVariants ? selectedVariantOffers : getProductOffers(product as any);
  const hasOffers = displayOffers.length > 0;
  const singleOffer = React.useMemo(() => displayOffers.length === 1, [displayOffers]);
  const offerDialogPricing = getOfferPricing(
    { ...(product as any), offers: displayOffers },
    { sourcePrice: selectedSourcePrice },
  );
  const combinedOffersSource = React.useMemo(
    () => [
      ...(Array.isArray((product as any).offers) ? (product as any).offers : []),
      ...(Array.isArray(product.colorVariants)
        ? product.colorVariants.flatMap((variant: any) => variant?.offers || [])
        : []),
      ...(Array.isArray(product.chargeOptions)
        ? product.chargeOptions.flatMap((opt: any) => opt?.offers || [])
        : []),
    ],
    [product],
  );
  const hasDirectDiscount = displayOffers.some((offer: any) => offer?.type === "direct_discount");
  const offerPricing = getOfferPricing(
    { ...(product as any), offers: hasDirectDiscount ? displayOffers : [] },
    { sourcePrice: selectedSourcePrice },
  );

  React.useEffect(() => {
    if (!offerDialogOpen) return;
    if (!singleOffer) return;
    if (selectedOffer) return;
    const offer = displayOffers[0];
    if (!offer) return;
    setSelectedOffer(offer);
    const hasOfferProducts = offer.type !== "coupon" && extractOfferStkCodes(offer).length > 0;
    if (offer.type === "coupon") {
      addPrimaryWithOffer(offer);
      closeOfferDialog();
      return;
    }
    if (offer.type === "free_product" && !hasOfferProducts) {
      addPrimaryWithOffer(offer);
      closeOfferDialog();
      return;
    }
    if (offer.type === "direct_discount" && !hasOfferProducts) {
      handleDirectDiscount(offer);
      return;
    }
    if (hasOfferProducts) {
      loadOfferProducts(offer);
    } else {
      setOfferProducts([]);
    }
    setShowOfferProducts(true);
  }, [offerDialogOpen, singleOffer, displayOffers, selectedOffer]);
  const currentPriceNum = hasDirectDiscount ? offerPricing.currentPrice : selectedSourcePrice;
  const oldPriceNum = offerPricing.originalPrice;
  const hasOldPrice = hasDirectDiscount && offerPricing.hasDiscount;
  const hasDiscount = hasDirectDiscount && offerPricing.hasDiscount;
  const offerBadgeText = displayOffers.length > 0
    ? getOfferBadgeText(displayOffers, language)
    : "";
  const offerBadgeInfo = offerBadgeText
    ? getPrimaryOfferBadgeAppearance(displayOffers)
    : null;
  const offerTopBadge = !topBadge && offerBadgeInfo ? (
    <div
      className={`bg-gradient-to-r ${offerBadgeInfo.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap`}
    >
      <offerBadgeInfo.Icon className="w-4 h-4" />
      <span>{offerBadgeText}</span>
    </div>
  ) : null;

  const displayPrice = currentChargeOption
    ? currentPriceNum.toLocaleString("en-US")
    : currentPriceNum.toLocaleString("en-US");
  const handleNavigate = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${encodeURIComponent(productRef || resolvedProductId || product.id || "")}`, { state: { product } });
    }
  };

  return (
    <div className="h-full relative">
      {(topBadge || offerTopBadge) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          {topBadge || offerTopBadge}
        </div>
      )}
      <div
        className={`bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-visible flex flex-col h-full ${
          isHovered
            ? "border-[#009FE3]/40 scale-[1.02] shadow-2xl z-50"
            : "border-gray-100"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transformOrigin: "center",
          position: "relative",
        }}
      >
        <div className="relative cursor-pointer flex-shrink-0" onClick={handleNavigate}>
          {(() => {
            const badgeSide = language === "ar" ? "right-4" : "left-4";
            const compareSide = badgeSide === "right-4" ? "left-4" : "right-4";
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    if (toggleCompare && productRef) {
                      toggleCompare(productRef);
                    } else {
                      console.warn(
                        "[ProductCard] compare unavailable for product",
                        resolvedProductId ?? product.id,
                      );
                    }
                  } catch (err) {
                    console.error("[ProductCard] toggleCompare threw", err);
                  }
                }}
                className={`absolute top-4 ${compareSide} z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md ${
                  isCompared
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
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative">
              <ImageWithFallback
                src={currentImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
              />
            </div>
            {badgeText && (
              <div
                className={`absolute top-4 ${language === "ar" ? "right-4" : "left-4"} z-10 px-2 py-1 rounded-md font-bold text-white flex items-center gap-1 text-xs shadow-md ${badgeVariant}`}
                style={badgeStyle}
              >
                {product.isMostSold ? (
                  <TrendingUp className="w-3 h-3" />
                ) : product.isNew ? (
                  <Tag className="w-3 h-3" />
                ) : product.isHot ? (
                  <Flame className="w-3 h-3" />
                ) : null}
                <span>{badgeText}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 flex flex-col flex-1 justify-between">
          <h3
            className={`font-bold text-gray-900 mb-2 text-sm cursor-pointer hover:text-[#009FE3] transition-colors line-clamp-2 min-h-[2.8rem] ${
              language === "ar" ? "text-right" : "text-left"
            }`}
            onClick={handleNavigate}
          >
            {product.name}
          </h3>
            {hasColors && (
              <div>
                <ColorSwatch
                  variants={visibleColorVariants}
                  selectedColor={selectedColor}
                  onColorChange={handleColorChange}
                  onColorHover={handleColorHover}
                  language={language}
                  size="sm"
                  maxVisible={5}
                  showPrice={true}
                />
                {colorPriceValue > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {language === "ar" ? "سعر اللون" : "Color price"}:{" "}
                    <span className="font-semibold text-gray-900">
                      {Number(colorPriceValue).toLocaleString("en-US")}
                    </span>
                    {hasColorPriceDiff && (
                      <span className="text-[10px] text-amber-600 ml-2">
                        {language === "ar" ? "مختلف" : "Changed"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          {hasChargeOptions && (
            <div>
              <ChargeOptionSlider
                options={normalizedChargeOptions}
                selectedId={selectedChargeOption || ""}
                onSelect={setSelectedChargeOption}
                language={language}
              />
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div
              className={`flex items-center ${hasDiscount ? "justify-between" : "justify-start"}`}
            >
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <div className={`mx-3 ${hasOldPrice ?  "":"mb-3" }  flex items-baseline gap-1`}>
                  <span className="font-bold why text-[#009FE3] text-2xl price">
                    {displayPrice}
                  </span>
                  <span className="font-bold text-m text-[#000000] currency">$</span>
                </div>

                {hasOldPrice && (
                  <div className="mx-3 mb-3  text-xs text-gray-400 line-through price">
                    {oldPriceNum.toLocaleString("en-US")} $
                  </div>
                )}
              </div>

              {/* {hasDiscount && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                  -
                  {Math.round(((oldPriceNum - currentPriceNum) / oldPriceNum) * 100)}
                  %
                </div>
              )} */}
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {language === "ar" ? "أضف للسلة" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {offerDialogOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4"
          onClick={closeOfferDialog}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {language === "ar" ? "اختر العرض الذي تريد تطبيقه" : "Choose an offer to apply"}
              </h3>
              <button
                onClick={closeOfferDialog}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {displayOffers.map((offer: any, idx: number) => {
                const isSelected = selectedOffer === offer;
                const hasOfferProducts = offer.type !== "coupon" && extractOfferStkCodes(offer).length > 0;
                const needsProducts =
                  hasOfferProducts ||
                  (offer.type !== "direct_discount" &&
                    offer.type !== "coupon" &&
                    offer.type !== "free_product");
                return (
                  <div
                    key={`offer-dialog-${offer.type}-${idx}`}
                    className={`rounded-2xl p-3 transition-all ${
                      isSelected ? "ring-2 ring-[#009FE3] bg-blue-50/40" : "bg-white"
                    }`}
                  >
                    <OfferDetailsCard
                      offers={[offer]}
                      language={language}
                      basePrice={offerDialogPricing.originalPrice}
                      currentPrice={offerDialogPricing.currentPrice}
                      currencyLabel="$"
                    />

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-gray-500">
                        {language === "ar"
                          ? "اختر هذا العرض ثم أكمل اختيار المنتجات إن وُجدت."
                          : "Select this offer, then choose products if required."}
                      </p>
                      {!singleOffer && (
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            if (offer.type === "coupon") {
                              addPrimaryWithOffer(offer);
                              closeOfferDialog();
                              return;
                            }
                            if (offer.type === "free_product" && !hasOfferProducts) {
                              addPrimaryWithOffer(offer);
                              closeOfferDialog();
                              return;
                            }
                            if (!needsProducts && offer.type === "direct_discount") {
                              handleDirectDiscount(offer);
                              return;
                            }
                            if (hasOfferProducts) {
                              loadOfferProducts(offer);
                            } else {
                              setOfferProducts([]);
                            }
                            setShowOfferProducts(true);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-bold ${
                            offer.type === "direct_discount"
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                              : offer.type === "coupon"
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : offer.type === "free_product"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                          }`}
                        >
                          {language === "ar" ? "اختيار" : "Select"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedOffer && showOfferProducts && selectedOffer.type !== "coupon" && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
                <h4 className="font-bold text-gray-900 mb-3">
                  {language === "ar" ? "اختر المنتج المرتبط بالعرض" : "Select a product for this offer"}
                </h4>

                {offerProductsLoading && (
                  <p className="text-sm text-gray-500">
                    {language === "ar" ? "جارِ تحميل المنتجات..." : "Loading products..."}
                  </p>
                )}

                {!offerProductsLoading && offerProductsError && (
                  <p className="text-sm text-red-600">{offerProductsError}</p>
                )}

                {!offerProductsLoading && offerProducts.length === 0 && !offerProductsError && (
                  <p className="text-sm text-gray-500">
                    {language === "ar"
                      ? "لا توجد منتجات مرتبطة بهذا العرض."
                      : "No products linked to this offer."}
                  </p>
                )}

                {!offerProductsLoading && offerProducts.length > 0 && (
                  <div className="space-y-2">
                    {offerProducts.map((p: any) => {
                      const base = parseNumericPrice(p.price);
                      let discounted = base;
                      let metaType: "coupon" | "bundle" | "free" = "coupon";
                      if (selectedOffer.type === "bundle_discount") {
                        metaType = "bundle";
                        discounted = Math.round(applyOfferDiscount(base, selectedOffer));
                      } else if (selectedOffer.type === "free_product") {
                        metaType = "free";
                        discounted = 0;
                      } else {
                        metaType = "coupon";
                        discounted = Math.round(applyOfferDiscount(base, selectedOffer));
                      }

                      return (
                        <div key={p.id || p.stk_code} className="flex items-center gap-3 border rounded-lg p-2">
                          <img src={p.image} className="w-10 h-10 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {language === "ar" && p.nameAr ? p.nameAr : p.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {language === "ar" ? "بعد الخصم:" : "After discount:"}{" "}
                              {discounted.toLocaleString("en-US")} $
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddRelatedProduct(selectedOffer, p, discounted, base, { type: metaType })}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              metaType === "free"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : metaType === "bundle"
                                ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            }`}
                          >
                            {language === "ar" ? "إضافة" : "Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  if (pendingCartOptions) {
                    addToCart({ ...product, id: resolvedProductId ?? (product as any).id }, pendingCartOptions);
                  }
                  closeOfferDialog();
                }}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-200 text-gray-700"
              >
                {language === "ar" ? "تخطي العرض" : "Skip offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;



