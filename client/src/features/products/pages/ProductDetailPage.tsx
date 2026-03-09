import {
  ChevronRight,
  X,
  ShoppingCart,
  Smartphone,
  Watch,
  Headphones,
  Battery,
  Camera,
  Laptop,
  Shield,
  Settings,
  CreditCard,
  Sparkles,
  PackageCheck,
  TrendingUp,
  FileText,
  CheckCircle2,
  Truck,
  RefreshCw,
  Award,
  Minus,
  Plus,Tag,Badge,
  Star,
  Edit3,
  GitCompare
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";
import { useCompareStore } from "../../compare/state";
import { ColorSwatch } from "../../../components/ui/ColorSwatch";
import { ChargeOptionSlider } from "../../../components/ui/ChargeOptionSlider";
import { OfferDetailsCard } from "../../offer/components/OfferDetailsCard";
import { RelatedProductsWithDiscount } from "../../offer/components/RelatedProductsWithDiscount";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../../../components/ui/carousel";
import {
  calculateDiscountedPrice,
  getProductById,
  getOfferPricing,
  getProductOffers,
  getOfferBadgeText,
  products,
} from "../../../data/products";
import { getProductRef } from "../../../utils/entityRefs";
import { EditableText } from "../../../components/ui/EditableText";
import { EditableImage } from "../../../components/ui/EditableImage";
import { KeyFeaturesEditor } from "../../../components/ui/KeyFeaturesEditor";
import { InlineProductEditor } from "../../../components/ui/InlineProductEditor";
import { CURRENCY_LABEL } from "../../../utils/currency";

interface ProductDetailPageProps {
  product?: any;
  language?: "ar" | "en";
  t?: any;
  addToCart?: () => void;
  resetProductDetail?: () => void;
  activeTab?: "specs" | "offers";
  setActiveTab?: (tab: "specs" | "offers") => void;
  categoryName?: string;
  brandName?: string;
  userPermissions?: {
    canEditContent: boolean;
  };
  onSaveProductContent?: (productId: number, updatedContent: any) => void;
}

const iconMap: { [key: string]: any } = {
  Smartphone,
  Watch,
  Headphones,
  Battery,
  Camera,
  Laptop,
  Shield,
  Settings,
};

function SpecIcon({ spec, size }: { spec: any; size: "sm" | "lg" }) {
  const dimension = size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const iconUrl = (() => {
    if (typeof spec?.icon === "object" && spec.icon) {
      if (spec.icon.type === "url" && spec.icon.url) return spec.icon.url;
    }
    if (spec?.iconImage) return spec.iconImage;
    return "";
  })();

  if (iconUrl && !failed) {
    return (
      <div className={`relative ${dimension}`}>
        {!loaded && (
          <div className="absolute inset-0 rounded-full shimmer-surface" />
        )}
        <img
          src={iconUrl}
          alt="spec icon"
          className={`${dimension} object-contain ${loaded ? "" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
        />
      </div>
    );
  }

  if (typeof spec?.icon === "object" && spec.icon) {
    if (spec.icon.type === "react_icon" && spec.icon.key) {
      const IconComponent = iconMap[spec.icon.key] || Settings;
      return <IconComponent className={`${dimension} text-white`} />;
    }
  } else if (typeof spec?.icon === "string") {
    const IconComponent = iconMap[spec.icon] || Settings;
    return <IconComponent className={`${dimension} text-white`} />;
  }

  return <Settings className={`${dimension} text-white`} />;
}

export function ProductDetailPage(props: ProductDetailPageProps) {
  const { product, categoryName, brandName, userPermissions = { canEditContent: true }, onSaveProductContent } = props;
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const currencyLabel = (t as any)?.currency || CURRENCY_LABEL;
  const cart = useCart();
  const compareItems = useCompareStore((s) => s.items);
  const toggleCompare = useCompareStore((s) => s.toggleCompare);
  const openCompare = useCompareStore((s) => s.openCompare);
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const locationState = (location.state as any) || {};
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [localProduct, setLocalProduct] = useState<any | null>(
    product ?? (location.state && (location.state as any).product) ?? null,
  );

  useEffect(() => {
    const stateProduct =
      (location.state && (location.state as any).product) ?? null;
    if (product) {
      setLocalProduct(product);
    } else if (stateProduct) {
      setLocalProduct(stateProduct);
    }
  }, [product, location.state]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const apiBase =
      (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    setIsLoadingProduct(true);
    setProductError(null);

    (async () => {
      try {
        console.log("ProductDetailPage: Fetching product from API", `${apiBase}/products/${encodeURIComponent(id)}`);
        const res = await fetch(`${apiBase}/products/${encodeURIComponent(id)}`);
        if (!res.ok) {
          if (res.status === 404) {
            console.log("ProductDetailPage: Product not found in API, checking local data");
            const found = getProductById(id);
            if (found && mounted) {
              setLocalProduct(found);
              setIsLoadingProduct(false);
              return;
            }
          }
          throw new Error(`Failed to load product: ${res.status}`);
        }
        const json = await res.json();
        console.log("ProductDetailPage: Product loaded from API", json?.data);
        if (mounted) {
          setLocalProduct(json?.data ?? null);
          setIsLoadingProduct(false);
        }
      } catch (err: any) {
        console.error("ProductDetailPage: Error loading product", err);
        if (mounted) {
          const found = getProductById(id);
          if (found) {
            console.log("ProductDetailPage: Using local data as fallback");
            setLocalProduct(found);
          }
          setProductError(err?.message || "Failed to load product");
          setIsLoadingProduct(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const prod = localProduct ?? product;
  const breadcrumbs = useMemo(() => {
    if (Array.isArray(locationState?.breadcrumbs) && locationState.breadcrumbs.length) {
      return locationState.breadcrumbs.filter((item: any) => item && item.label);
    }

    const fallback: Array<{ label: string; href?: string }> = [];
    if (categoryName) fallback.push({ label: categoryName });
    if (brandName) fallback.push({ label: brandName });
    return fallback;
  }, [locationState, categoryName, brandName]);

  const resolveBrandHref = (crumbIndex: number): string | null => {
    if (crumbIndex !== breadcrumbs.length - 1) return null;
    const brandRef =
      prod?.brand_code ||
      prod?.brandCode ||
      prod?.brand ||
      prod?.brandAr;
    const categoryRef = prod?.cat_code || prod?.categoryCode;
    if (!brandRef) return null;
    if (categoryRef) {
      return `/brand/${encodeURIComponent(String(categoryRef))}/${encodeURIComponent(String(brandRef))}`;
    }
    return `/brand/${encodeURIComponent(String(brandRef))}`;
  };

  const handleNavigateBack = () => {
    const lastCrumb = breadcrumbs[breadcrumbs.length - 1];
    if (lastCrumb?.href) {
      navigate(lastCrumb.href);
      return;
    }
    navigate(-1);
  };

  const saveProductToDb = async (productId: string | number, updated: any) => {
    console.log("[ProductDetailPage] saveProductToDb called", { productId, updated });
    const apiBase =
      (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    const adminKey = (import.meta as any).env?.VITE_ADMIN_API_KEY || "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (adminKey) headers["x-admin-key"] = adminKey;
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = {
        name: updated?.name,
        nameAr: updated?.nameAr,
        description: updated?.description,
        descriptionAr: updated?.descriptionAr,
        image: updated?.image,
        images: updated?.images,
        specs: updated?.specs ? updated.specs.map((spec: any) => {
          let icon = "Smartphone";
          let iconImage = spec.iconImage || "";
          if (typeof spec.icon === 'object' && spec.icon) {
            if (spec.icon.type === 'url' && spec.icon.url) {
              iconImage = spec.icon.url;
            } else if (spec.icon.type === 'react_icon' && spec.icon.key) {
              icon = spec.icon.key;
            }
          } else if (typeof spec.icon === 'string') {
            icon = spec.icon;
          }
          return {
            icon: iconImage ? { type: "url", url: iconImage } : icon,
            iconImage,
            title: spec.title || "",
            titleAr: spec.titleAr || "",
            value: spec.value || "",
            valueAr: spec.valueAr || "",
            isKeyFeature: spec.isKeyFeature || false,
          };
        }) : updated?.specs,
        inTheBox: updated?.inTheBox,
        category: updated?.category,
        brand: updated?.brand,
        colorVariants: updated?.colorVariants,
      };
      const res = await fetch(`${apiBase}/admin/products/${encodeURIComponent(String(productId))}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = json?.message || "Failed to save product";
        const hasDetails = !!json?.details;
        const detailHint = hasDetails
          ? "Validation failed. Please check required fields and formats."
          : "";
        throw new Error(detailHint ? `${message} - ${detailHint}` : message);
      }
      setLocalProduct(json?.data ?? updated);
    } finally {
      setIsSaving(false);
    }
  };

  const persistProductContent = (productId: any, updated: any) => {
    console.log("[ProductDetailPage] persistProductContent called", { productId, updated });
    if (onSaveProductContent) {
      onSaveProductContent(productId, updated);
      return;
    }
    saveProductToDb(productId, updated).catch((err) => {
      console.error("[ProductDetailPage] save failed", err);
      setSaveError(err?.message || "Failed to save product");
    });
  };

  const specsList = Array.isArray(prod?.specs) ? prod.specs : [];
  const populatedSpecs = specsList.filter((spec: any) => {
    const title = String(spec?.title ?? spec?.titleAr ?? "").trim();
    const value = String(spec?.value ?? spec?.valueAr ?? "").trim();
    return title.length > 0 && value.length > 0;
  });
  const selectedKeyFeatures = populatedSpecs.filter((spec: any) => spec?.isKeyFeature).slice(0, 4);
  const displayKeyFeatures = selectedKeyFeatures.length > 0 ? selectedKeyFeatures : populatedSpecs.slice(0, 4);
  const shouldShowKeyFeatures = userPermissions.canEditContent || displayKeyFeatures.length > 0;

  const baseProductOffers = prod ? getProductOffers(prod as any) : [];
  const productOffers = baseProductOffers;

  const normalizedColorVariants = useMemo(() => {
    const variants = Array.isArray(prod?.colorVariants) ? prod.colorVariants : [];
    return variants.map((variant: any) => {
      const images = Array.isArray(variant.images)
        ? variant.images
            .map((img: any) =>
              typeof img === "string" ? img : img?.image_link || img?.url || "",
            )
            .filter(Boolean)
        : [];
      const image = variant.image || images[0] || "";
      const name = variant.name || variant.color_name || "";
      const nameAr = variant.nameAr || variant.color_name_ar || name;
      const hexCode = variant.hexCode || variant.color_hex || variant.hex || "";
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
      return {
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
    });
  }, [prod]);

  const availableColorVariants = normalizedColorVariants
    .filter(
      (variant: any) =>
        variant?.isAvailable !== false &&
        variant?.inStock !== false &&
        (typeof variant?.active !== "boolean" || variant.active) &&
        Boolean(String(variant?.name || variant?.nameAr || "").trim()) &&
        Boolean(String(variant?.image || (variant?.images && variant.images[0]) || "").trim()) &&
        (typeof variant?.stock !== "number" || variant.stock > 0),
    )
    .sort((a: any, b: any) => {
      const aHasOffers = Array.isArray(a?.offers) && a.offers.length > 0 ? 1 : 0;
      const bHasOffers = Array.isArray(b?.offers) && b.offers.length > 0 ? 1 : 0;
      return bHasOffers - aHasOffers;
    });

  const hasColors = availableColorVariants.length > 0;
  const normalizedChargeOptions = useMemo(() => {
    const options = Array.isArray(prod?.chargeOptions) ? prod.chargeOptions : [];
    return options
      .map((opt: any, index: number) => ({
        ...opt,
        id: String(opt.id ?? opt.stk_code ?? opt.code ?? index),
        value: opt.value ?? opt.name ?? "",
        valueAr: opt.valueAr ?? opt.name_ar ?? opt.nameAr ?? opt.value ?? opt.name ?? "",
        price: typeof opt.price === "number" ? opt.price : Number(opt.price),
      }))
      .filter((opt: any) =>
        (typeof opt.active !== "boolean" || opt.active) &&
        (typeof opt.in_stock !== "boolean" || opt.in_stock),
      )
      .sort((a: any, b: any) => {
        const aPrice = Number.isFinite(a.price) ? a.price : Number.MAX_SAFE_INTEGER;
        const bPrice = Number.isFinite(b.price) ? b.price : Number.MAX_SAFE_INTEGER;
        return aPrice - bPrice;
      });
  }, [prod]);

  const hasChargeOptions = normalizedChargeOptions.length > 0;
  const hasAnyVariants = (prod?.colorVariants?.length || 0) > 0 || (prod?.chargeOptions?.length || 0) > 0;
  const hasValidVariants = hasColors || hasChargeOptions;
  const hasValidImage =
    Boolean(String(prod?.image || "").trim()) ||
    availableColorVariants.length > 0;
  const hasValidName = Boolean(String(prod?.name || "").trim());
  const hasSpecs = Array.isArray(prod?.specs) && prod.specs.length > 0;
  const hasDescription = Boolean(String(prod?.description || prod?.descriptionAr || "").trim());
  const hasDetails = hasSpecs || hasDescription;

  const [selectedColor, setSelectedColor] = useState(
    availableColorVariants?.[0]?.name || "",
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(
    normalizedChargeOptions[0]?.id || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [tabState, setTabState] = useState<"description" | "specs" | "offers">(
    "description",
  );
  const [heroProductInCart, setHeroProductInCart] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const displayColor = hoveredColor || selectedColor;
  const currentColorVariant = hasColors
    ? availableColorVariants.find((v: any) => v.name === displayColor)
    : null;

  // Get images array for current color (support both single image and images array)
  const currentImages = currentColorVariant?.images || 
    (currentColorVariant?.image ? [currentColorVariant.image] : null) ||
    (prod?.images && Array.isArray(prod.images) ? prod.images : [prod?.image]).filter(Boolean);

  const currentImage = currentImages && currentImages.length > 0 
    ? currentImages[0]
    : prod?.image;

  const showImagePagination = !hasColors && currentImages.length > 1;

  const currentChargeOption = normalizedChargeOptions.find(
    (opt: any) => opt.id === selectedChargeOption,
  );

  const numericPrice = (value: any) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    return parseFloat(String(value).replace(/,/g, "")) || 0;
  };

  const colorPriceValue =
    currentColorVariant && typeof currentColorVariant.price !== "undefined"
      ? numericPrice(currentColorVariant.price)
      : 0;
  const baseProductPrice = numericPrice(prod?.price);
  const sourcePriceForSelection = currentChargeOption
    ? numericPrice(currentChargeOption.price)
    : colorPriceValue > 0
    ? colorPriceValue
    : typeof prod?.basePrice === "number"
    ? prod.basePrice
    : baseProductPrice;
  const hasColorPriceDiff =
    colorPriceValue > 0 && Math.abs(colorPriceValue - baseProductPrice) > 0.0001;

  const selectedVariantOffers = currentChargeOption?.offers
    ? getProductOffers({ offers: currentChargeOption.offers } as any)
    : currentColorVariant?.offers
    ? getProductOffers({ offers: currentColorVariant.offers } as any)
    : [];
  const displayOffers = selectedVariantOffers;
  const hasOffers = displayOffers.length > 0;

  const offerPricing = prod
    ? getOfferPricing({ ...(prod as any), offers: displayOffers } as any, { sourcePrice: sourcePriceForSelection })
    : {
        offers: [],
        originalPrice: 0,
        currentPrice: 0,
        savings: 0,
        hasDiscount: false,
        discountPercentage: 0,
      };

  const basePrice = offerPricing.originalPrice;
  const currentPrice = offerPricing.currentPrice;
  const savingsAmount = offerPricing.savings;
  const discountPercentage = offerPricing.discountPercentage;
  const displayPrice = currentPrice.toLocaleString("en-US");
  const offerBadgeText = getOfferBadgeText(displayOffers, language);

  const inStock = currentColorVariant
    ? currentColorVariant.isAvailable !== false && currentColorVariant.inStock !== false
    : true;

  const productRef = getProductRef(prod);
  const isInComparison =
    !!productRef && compareItems.some((itemId) => String(itemId) === String(productRef));

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(2, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!cart.addToCart || !prod) return;

    const chosenColor = hasColors ? selectedColor : undefined;
    const currentColorVar = hasColors
      ? availableColorVariants.find((v: any) => v.name === chosenColor)
      : null;
    const chosenColorHex = currentColorVar?.hexCode ?? null;
    const chosenVariantImage = currentImage ?? prod?.image ?? null;

    const selectedCharge = selectedChargeOption
      ? normalizedChargeOptions.find(
          (o: any) => String(o.id) === String(selectedChargeOption),
        )
      : null;
    const chargeLabel = selectedCharge
      ? language === "ar"
        ? selectedCharge.valueAr || selectedCharge.value || selectedCharge.name_ar || selectedCharge.name
        : selectedCharge.value || selectedCharge.name
      : null;

    const appliedOffers =
      (selectedCharge && Array.isArray((selectedCharge as any).offers) ? (selectedCharge as any).offers : null) ||
      (currentColorVar && Array.isArray((currentColorVar as any).offers) ? (currentColorVar as any).offers : null) ||
      (Array.isArray((prod as any).offers) ? (prod as any).offers : null);

    const variantPriceValue =
      currentColorVar && typeof currentColorVar.price !== "undefined"
        ? numericPrice(currentColorVar.price)
        : null;
    const chargePriceValue =
      selectedCharge && typeof selectedCharge.price !== "undefined"
        ? numericPrice(selectedCharge.price)
        : null;
    const basePriceValue =
      typeof chargePriceValue === "number"
        ? chargePriceValue
        : typeof variantPriceValue === "number"
        ? variantPriceValue
        : numericPrice(prod?.price);

    cart.addToCart(prod, {
      color: chosenColor,
      variantColorHex: chosenColorHex,
      variantImage: chosenVariantImage,
      variantSku: currentColorVar?.stk_code ?? null,
      variantPrice: typeof variantPriceValue === "number" ? variantPriceValue : null,
      chargeOptionId: selectedChargeOption ?? null,
      chargeOptionLabel: chargeLabel ?? null,
      chargeOptionSku: (selectedCharge as any)?.stk_code ?? null,
      chargeOptionPrice: typeof chargePriceValue === "number" ? chargePriceValue : null,
      basePrice: basePriceValue,
      appliedOffers,
      quantity,
    });
    setHeroProductInCart(true);
  };

  const handleToggleCompare = () => {
    if (!productRef) return;
    const isAdding = !compareItems.some((itemId) => String(itemId) === String(productRef));
    toggleCompare(productRef);
    if (isAdding) openCompare();
  };

  const isHeroInCart = !!prod?.id && cart.cartItems?.some((item) => {
    const itemProductId = item.productId ?? Number(item.id);
    return itemProductId === prod.id && !item.isBundleItem && !item.isFreeGift;
  });

  // Carousel effect - update when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Reset carousel when color changes
  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    setCurrentSlide(0);
    if (carouselApi) {
      carouselApi.scrollTo(0);
    }
  };

  // Handle color hover
  const handleColorHover = (colorName: string | null) => {
    setHoveredColor(colorName);
    if (colorName && carouselApi) {
      setCurrentSlide(0);
      carouselApi.scrollTo(0);
    }
  };

  const markImageLoaded = (key: string) => {
    setLoadedImages((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  useEffect(() => {
    if (!hasColors) return;
    const hasSelected = availableColorVariants.some(
      (variant: any) => variant.name === selectedColor,
    );
    if (!hasSelected) {
      setSelectedColor(availableColorVariants[0]?.name || "");
    }
  }, [hasColors, availableColorVariants, selectedColor]);

  if (!prod && isLoadingProduct) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="aspect-square rounded-2xl border border-gray-200 shimmer-surface" />
              <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
                <div className="h-6 w-40 skeleton-line shimmer-surface mb-4" />
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={`prod-thumb-skeleton-${idx}`} className="aspect-square rounded-lg shimmer-surface" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="h-10 w-3/4 skeleton-line shimmer-surface mb-4" />
              <div className="h-6 w-1/3 skeleton-line shimmer-surface mb-6" />
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="h-8 w-32 skeleton-line shimmer-surface mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={`prod-icon-skeleton-${idx}`} className="rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg shimmer-surface" />
                      <div className="flex-1">
                        <div className="h-3 w-2/3 skeleton-line shimmer-surface mb-2" />
                        <div className="h-4 w-1/2 skeleton-line shimmer-surface" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!prod && !isLoadingProduct) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-gray-600 text-lg">
            {productError || (language === "ar" ? "تعذر تحميل المنتج" : "Unable to load product")}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            {language === "ar" ? "العودة" : "Go back"}
          </button>
        </div>
      </section>
    );
  }

  if (!prod) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="aspect-square rounded-2xl border border-gray-200 shimmer-surface" />
              <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
                <div className="h-6 w-40 skeleton-line shimmer-surface mb-4" />
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={`prod-thumb-skeleton-${idx}`} className="aspect-square rounded-lg shimmer-surface" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="h-10 w-3/4 skeleton-line shimmer-surface mb-4" />
              <div className="h-6 w-1/3 skeleton-line shimmer-surface mb-6" />
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="h-8 w-32 skeleton-line shimmer-surface mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={`prod-icon-skeleton-${idx}`} className="rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg shimmer-surface" />
                      <div className="flex-1">
                        <div className="h-3 w-2/3 skeleton-line shimmer-surface mb-2" />
                        <div className="h-4 w-1/2 skeleton-line shimmer-surface" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!userPermissions.canEditContent && hasAnyVariants && !hasValidVariants) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-gray-600 text-lg">
            {language === "ar"
              ? "هذا المنتج غير متوفر حالياً"
              : "This product is currently unavailable."}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            {language === "ar" ? "العودة" : "Go back"}
          </button>
        </div>
      </section>
    );
  }

  if (!userPermissions.canEditContent && (!hasValidImage || !hasValidName || !hasDetails)) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-gray-600 text-lg">
            {language === "ar"
              ? "هذا المنتج غير مكتمل البيانات"
              : "This product is missing required details."}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            {language === "ar" ? "العودة" : "Go back"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50"
    >
        {/* Editable Badge removed from fixed position; rendered below breadcrumb */}
        {/* Improved Breadcrumb */}
        {saveError && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {saveError}
            </div>
          </div>
        )}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 ">
            <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide ">
              <button
                onClick={() => navigate("/")}
                className="group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0"
              >
                <ChevronRight
                  className={`w-4 h-4 ${language === "ar" ? "" : "rotate-180"}`}
                />
                <span className="font-medium">{t("home")}</span>
              </button>

              <span className="text-gray-300 flex-shrink-0">/</span>

              {breadcrumbs.map((crumb: any, index: number) => (
                <div key={`crumb-${index}-${crumb.label}`} className="contents">
                  {(() => {
                    const brandHref = resolveBrandHref(index);
                    const href = brandHref || crumb?.href;
                    if (!href) {
                      return (
                        <span className="text-gray-500 font-medium whitespace-nowrap">
                          {crumb.label}
                        </span>
                      );
                    }
                    return (
                      <button
                        onClick={() => navigate(href)}
                        className="text-gray-500 hover:text-[#009FE3] font-medium whitespace-nowrap transition-colors duration-200"
                      >
                        {crumb.label}
                      </button>
                    );
                  })()}
                  <span className="text-gray-300 flex-shrink-0">/</span>
                </div>
              ))}

              <span className="text-[#009FE3] font-semibold truncate max-w-[200px] sm:max-w-md">
                {prod?.name}
              </span>
            </div>

            <button
              onClick={handleNavigateBack}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Mode Badge (under breadcrumb) */}
      {userPermissions.canEditContent && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-3 py-1 rounded-full shadow-2xl">
            <Edit3 className="w-4 h-4" />
            <span className="font-bold text-sm">
              {language === "ar" ? "وضع التعديل مُفعّل" : "Edit Mode Active"}
            </span>
          </div>
        </div>
      )}
      {/* Product Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="relative group">
                {/* Carousel for Images - Fixed width constraint */}
                <Carousel
                  key={`${prod?.id}-${displayColor}`}
                  setApi={setCarouselApi}
                  opts={{
                    loop: true,
                    direction: language === "ar" ? "rtl" : "ltr",
                  }}
                  className="w-full overflow-hidden"
                >
                  <CarouselContent className="w-full">
                    {currentImages && currentImages.length > 0 ? (
                      currentImages.map((image, index) => (
                        <CarouselItem
                          key={`img-${prod?.id}-${displayColor}-${index}`}
                          className="w-full flex-shrink-0"
                        >
                          <div className="relative">
                            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border border-gray-200">
                              {userPermissions.canEditContent ? (
                                <EditableImage
                                  src={image}
                                  alt={`${prod?.name} - ${index + 1}`}
                                  onSave={(newImageUrl) => {
                                    if (
                                      hasColors &&
                                      selectedColor &&
                                      prod?.colorVariants
                                    ) {
                                      const updatedColorVariants =
                                        prod.colorVariants.map(
                                          (variant: any) => {
                                            if (
                                              variant.name === selectedColor
                                            ) {
                                              const updatedImages =
                                                variant.images
                                                  ? [...variant.images]
                                                  : [variant.image];
                                              updatedImages[index] =
                                                newImageUrl;

                                              return {
                                                ...variant,
                                                image:
                                                  index === 0
                                                    ? newImageUrl
                                                    : variant.image,
                                                images: updatedImages,
                                              };
                                            }
                                            return variant;
                                          },
                                        );

                                      persistProductContent(prod.id, {
                                        ...prod,
                                        colorVariants: updatedColorVariants,
                                      });
                                    } else {
                                      persistProductContent(prod.id, {
                                        ...prod,
                                        image: newImageUrl,
                                      });
                                    }
                                  }}
                                  className="w-full h-full object-cover rounded-2xl"
                                  language={language}
                                  userPermissions={userPermissions}
                                />
                              ) : (
                                <div className="relative w-full h-full">
                                  {!loadedImages[
                                    `main-${index}-${displayColor}`
                                  ] && (
                                    <div className="absolute inset-0 shimmer-surface rounded-2xl" />
                                  )}
                                  <img
                                    src={image}
                                    alt={`${prod?.name} - ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onLoad={() =>
                                      markImageLoaded(
                                        `main-${index}-${displayColor}`,
                                      )
                                    }
                                    onError={() =>
                                      markImageLoaded(
                                        `main-${index}-${displayColor}`,
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      <CarouselItem className="w-full flex-shrink-0">
                        <div className="relative">
                          <div className="aspect-square rounded-2xl bg-white shadow-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                            {userPermissions.canEditContent ? (
                              <EditableImage
                                src={prod?.image}
                                alt={prod?.name}
                                onSave={(newImageUrl) => {
                                  persistProductContent(prod.id, {
                                    ...prod,
                                    image: newImageUrl,
                                  });
                                }}
                                className="w-full h-full object-cover rounded-2xl"
                                language={language}
                                userPermissions={userPermissions}
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                {!loadedImages["main-fallback"] && (
                                  <div className="absolute inset-0 shimmer-surface rounded-2xl" />
                                )}
                                <img
                                  src={prod?.image}
                                  alt={prod?.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  onLoad={() =>
                                    markImageLoaded("main-fallback")
                                  }
                                  onError={() =>
                                    markImageLoaded("main-fallback")
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    )}
                  </CarouselContent>

                  {/* Navigation Arrows - Only show if multiple images */}
                  {currentImages && currentImages.length > 1 && (
                    <>
                      <CarouselPrevious
                        className={`${language === "ar" ? "translate-x-1/2" : "-translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-20`}
                      />
                      <CarouselNext
                        className={`${language === "ar" ? "-translate-x-1/2" : "translate-x-1/2"} bg-white/90 hover:bg-white border-none shadow-lg rounded-lg z-20`}
                      />
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm z-10">
                        {currentSlide + 1} / {currentImages.length}
                      </div>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {currentImages.map((_, idx) => (
                          <button
                            key={`dot-${idx}`}
                            onClick={() => carouselApi?.scrollTo(idx)}
                            className={`h-2 rounded-sm transition-all duration-300 ${
                              currentSlide === idx
                                ? "bg-white w-8"
                                : "bg-white/50 w-2"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </Carousel>

                  {offerBadgeText && (
                    <div
                      className={`absolute top-4 ${language === "ar" ? "left-6" : "right-6"} flex items-start justify-end`}
                    >
                      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-xl font-bold shadow-lg">
                        {offerBadgeText}
                    </div>
                  </div>
                )}

                {/* Colors Section - Under Image */}
                {hasColors &&
                  prod?.colorVariants &&
                  prod.colorVariants.length > 0 && (
                    <div className="mt-6">
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                          <Sparkles className="w-5 h-5 text-[#009FE3]" />
                          {language === "ar"
                            ? "الألوان المتاحة"
                            : "Available Colors"}
                        </h3>
                          <ColorSwatch
                            variants={availableColorVariants}
                            selectedColor={selectedColor}
                            onColorChange={handleColorChange}
                            onColorHover={handleColorHover}
                            language={language}
                            size="lg"
                            showLabel={true}
                            showPrice={true}
                          />
                          {colorPriceValue > 0 && (
                            <div className="mt-3 text-sm text-gray-600">
                              {language === "ar" ? "سعر اللون" : "Color price"}:{" "}
                              <span className="font-semibold text-gray-900">
                                {Number(colorPriceValue).toLocaleString("en-US")}
                              </span>
                              {hasColorPriceDiff && (
                                <span className="text-xs text-amber-600 ml-2">
                                  {language === "ar" ? "مختلف" : "Changed"}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                {/* Image Thumbnails Pagination - When no colors but multiple images */}
                {showImagePagination && (
                  <div className="mt-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <Camera className="w-5 h-5 text-[#009FE3]" />
                        {language === "ar" ? "صور المنتج" : "Product Images"}
                      </h3>

                      {/* Thumbnail Grid */}
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                        {currentImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => carouselApi?.scrollTo(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                              currentSlide === index
                                ? "border-[#009FE3] ring-2 ring-[#009FE3]/30 scale-105"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="relative w-full h-full">
                              {!loadedImages[
                                `thumb-${index}-${displayColor}`
                              ] && (
                                <div className="absolute inset-0 shimmer-surface" />
                              )}
                              <img
                                src={image}
                                alt={`${prod?.name} - Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onLoad={() =>
                                  markImageLoaded(
                                    `thumb-${index}-${displayColor}`,
                                  )
                                }
                                onError={() =>
                                  markImageLoaded(
                                    `thumb-${index}-${displayColor}`,
                                  )
                                }
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Product Name - Editable */}
            <div className="mb-4 sm:mb-6">
              <EditableText
                value={prod?.name}
                onSave={(newName) => {
                  persistProductContent(prod.id, {
                    ...prod,
                    name: newName,
                  });
                }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight"
                editClassName="text-2xl sm:text-3xl font-bold"
                language={language}
                userPermissions={userPermissions}
                maxLength={150}
                placeholder={
                  language === "ar" ? "اسم المنتج..." : "Product name..."
                }
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 mb-6 border-2 border-[#009FE3]/20">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-[#009FE3]">
                      {displayPrice}
                    </span>
                    <span className="text-xl text-gray-600 font-semibold">
                      {currencyLabel}
                    </span>
                  </div>

                  {offerPricing.hasDiscount && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg text-gray-400 line-through">
                        {offerPricing.originalPrice.toLocaleString("en-US")} {currencyLabel}
                      </span>
                      <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-lg text-sm font-semibold">
                        {language === "ar" ? "توفير" : "Save"}{" "}
                        {savingsAmount.toLocaleString("en-US")} {currencyLabel}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                    inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">
                    {inStock
                      ? language === "ar"
                        ? "متوفر"
                        : "In Stock"
                      : language === "ar"
                        ? "غير متوفر"
                        : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-stretch gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  {/* Quantity Selector */}
                  <div className="flex items-center bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="px-6 py-3 font-bold text-lg border-x-2 border-gray-200">
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= 2}
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className="flex-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[140px]"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    {t("addToCart")}
                  </button>
                </div>
                <button
                  onClick={handleToggleCompare}
                                     className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-base transition-all duration-300 flex items-center justify-center gap-2 border-2 ${

                    isInComparison
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#009FE3] hover:text-[#009FE3] hover:shadow-md"
                  }`}
                >
                  <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    {isInComparison
                      ? language === "ar"
                        ? "إزالة من المقارنة"
                        : "Remove from Comparison"
                      : language === "ar"
                        ? "إضافة للمقارنة"
                        : "Add to Comparison"}
                  </span>
                  <span className="sm:hidden">
                    {isInComparison
                      ? language === "ar"
                        ? "إزالة"
                        : "Remove"
                      : language === "ar"
                        ? "قارن"
                        : "Compare"}
                  </span>
                </button>
              </div>
            </div>

            {/* Description */}
            {prod?.description && (
              <div className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#009FE3]" />
                  {t("description")}
                </h3>
                <EditableText
                  value={prod?.description}
                  onSave={(newDescription) => {
                    persistProductContent(prod.id, {
                      ...prod,
                      description: newDescription,
                    });
                  }}
                  className="text-gray-600 leading-relaxed text-sm sm:text-base"
                  editClassName="text-sm sm:text-base"
                  language={language}
                  userPermissions={userPermissions}
                  multiline={true}
                  maxLength={300}
                  placeholder={
                    language === "ar"
                      ? "وصف المنتج..."
                      : "Product description..."
                  }
                />
              </div>
            )}

            {/* {hasColors && (
              <div className="mb-6 bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-[#009FE3]" />
                  {language === "ar" ? "الألوان المتاحة" : "Available Colors"}
                </h3>
                <ColorSwatch
                  variants={prod.colorVariants}
                  selectedColor={selectedColor}
                  onColorChange={handleColorChange}
                  onColorHover={handleColorHover}
                  language={language}
                  size="lg"
                  showLabel={true}
                />
              </div>
            )} */}

            {hasChargeOptions && (
              <div className="mb-6 bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-[#009FE3]" />
                  {language === "ar" ? "خيارات الشحن" : "Charge Options"}
                </h3>
                <ChargeOptionSlider
                  options={normalizedChargeOptions}
                  selectedId={selectedChargeOption || ""}
                  onSelect={setSelectedChargeOption}
                  language={language}
                />
              </div>
            )}

            {/* Key Features */}
            {shouldShowKeyFeatures && (
              <div className="mb-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 relative group">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-[#009FE3]" />
                  {language === "ar" ? "المميزات الرئيسية" : "Key Features"}
                </h3>

                {displayKeyFeatures.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayKeyFeatures.map((spec: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#009FE3] transition-colors flex items-center gap-3"
                        >
                          <div className="bg-gradient-to-br from-[#009FE3] to-[#007BC7] p-2.5 rounded-lg flex-shrink-0">
                            <SpecIcon spec={spec} size="sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">{spec.title}</p>
                            <p className="font-bold text-gray-900 truncate">{spec.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
                    {language === "ar" ? "لم يتم اختيار أي مميزات رئيسية" : "No key features selected yet."}
                  </div>
                )}

                {userPermissions.canEditContent && (
                  <KeyFeaturesEditor
                    specs={populatedSpecs}
                    selectedSpecs={selectedKeyFeatures}
                    onSave={(newSelectedSpecs) => {
                      if (!prod?.id) return;
                      const selectedKeys = new Set(
                        newSelectedSpecs.map(
                          (spec: any) =>
                            `${spec.title}__${spec.titleAr || ""}__${spec.value}__${spec.valueAr || ""}`,
                        ),
                      );
                      const updatedSpecs = specsList.map((spec: any) => {
                        const key = `${spec.title}__${spec.titleAr || ""}__${spec.value}__${spec.valueAr || ""}`;
                        return {
                          ...spec,
                          isKeyFeature: selectedKeys.has(key),
                        };
                      });
                      persistProductContent(prod.id, {
                        ...prod,
                        specs: updatedSpecs,
                      });
                    }}
                    language={language}
                    userPermissions={userPermissions}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setTabState("description")}
              className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative flex items-center justify-center gap-2 ${
                tabState === "description"
                  ? "text-[#009FE3] bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              } ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}
            >
              <FileText className="w-5 h-5" />
              <span>{t("description")}</span>
              {tabState === "description" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7]" />
              )}
            </button>

            <button
              onClick={() => setTabState("specs")}
              className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative flex items-center justify-center gap-2 ${
                tabState === "specs"
                  ? "text-[#009FE3] bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              } ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}
            >
              <Settings className="w-5 h-5" />
              <span>{t("specifications")}</span>
              {tabState === "specs" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7]" />
              )}
            </button>

            <button
              onClick={() => setTabState("offers")}
              className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative flex items-center justify-center gap-2 shadow-lg ${
                tabState === "offers"
                  ? "text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 scale-105"
                  : "text-orange-600 hover:text-orange-700 bg-gradient-to-r from-orange-50 to-pink-50 hover:from-orange-100 hover:to-pink-100 animate-pulse"
              }`}
            >
              <Tag className="w-6 h-6" />
              <span>{language === "ar" ? "العروض" : "Offers"}</span>
              {/* {hasOffers && (
                <Badge className="bg-yellow-400 text-orange-900 hover:bg-yellow-400 font-black animate-bounce">
                  {productOffers.length}
                </Badge>
              )} */}
              {tabState === "offers" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
              )}
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {tabState === "offers" && (
              <div className="animate-fadeIn">
                {hasOffers ? (
                  <>
                    <div className="mb-6">
                      <OfferDetailsCard
                        offers={displayOffers}
                        language={language}
                        basePrice={basePrice}
                        currentPrice={calculateDiscountedPrice(
                          basePrice,
                          displayOffers,
                        )}
                        currencyLabel={currencyLabel}
                      />
                    </div>

                    {displayOffers.some(
                      (o) => o.type === "bundle_discount",
                    ) && (
                      <div className="mb-6">
                          <RelatedProductsWithDiscount
                            products={(() => {
                              const bundleOffer = displayOffers.find(
                                (o) => o.type === "bundle_discount",
                              ) as any;
                              if (!bundleOffer) return [];
                            return bundleOffer.relatedProductIds
                              .map((relatedId: number) => {
                                const rel = products.find(
                                  (p) => p.id === relatedId,
                                );
                                if (!rel) return null;
                                return {
                                  id: rel.id,
                                  name: rel.name,
                                  nameAr: rel.nameAr,
                                  image: rel.image,
                                  originalPrice:
                                    parseFloat(
                                      String(rel.price || "0").replace(/,/g, ""),
                                    ),
                                  discountPercentage:
                                    bundleOffer.discountPercentage,
                                };
                              })
                              .filter(Boolean);
                          })()}
                          language={language}
                          heroProductAdded={heroProductInCart || isHeroInCart}
                          onAddToCart={(productId) => {
                            const rel = products.find(
                              (p) => p.id === productId,
                            );
                            if (!rel || !cart.addToCart || !prod?.id) return;
                            const alreadyAdded = cart.cartItems?.some(
                              (item) => {
                                const itemProductId =
                                  item.productId ?? Number(item.id);
                                return (
                                  itemProductId === productId &&
                                  item.isBundleItem &&
                                  item.linkedToProductId === prod.id
                                );
                              },
                            );
                            if (alreadyAdded) return;

                              const bundleOffer = displayOffers.find(
                                (o) => o.type === "bundle_discount",
                              ) as any;
                              if (!bundleOffer) return;

                            const base = numericPrice(rel.price);
                            const discounted = Math.max(
                              0,
                              Math.round(
                                base *
                                  (1 - bundleOffer.discountPercentage / 100),
                              ),
                            );

                            cart.addToCart(rel, {
                              customId: `bundle-${prod.id}-${productId}`,
                              quantity: 1,
                              overridePrice: discounted,
                              overrideOldPrice: base,
                              isBundleItem: true,
                              linkedToProductId: prod.id,
                              bundleDiscount: bundleOffer.discountPercentage,
                            });
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-12 inline-block">
                      <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-semibold">
                        {language === "ar"
                          ? "لا توجد عروض متاحة لهذا المنتج"
                          : "No offers available for this product"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tabState === "description" && (
              <div className="animate-fadeIn">
                {/* Inline Editor for Description Only */}
                {userPermissions.canEditContent && (
                  <InlineProductEditor
                    product={prod}
                    userPermissions={userPermissions}
                    onSave={(updatedContent) =>
                      persistProductContent(prod.id, updatedContent)
                    }
                    mode="description"
                  />
                )}

                <div className="prose prose-lg max-w-none">
                  {prod?.description ? (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {language === "ar"
                          ? "حول هذا المنتج"
                          : "About this product"}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {prod?.description}
                      </p>

                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <PackageCheck className="w-5 h-5 text-[#009FE3]" />
                          {t("admin.content.boxTitle") ||
                            (language === "ar"
                              ? "ما يأتي في العلبة"
                              : "What's in the box")}
                        </h4>
                        {userPermissions.canEditContent && (
                          <InlineProductEditor
                            product={prod}
                            userPermissions={userPermissions}
                            onSave={(updatedContent) =>
                              persistProductContent(prod.id, updatedContent)
                            }
                            mode="box"
                          />
                        )}

                        <ul className="space-y-2 text-gray-600">
                          {(() => {
                            const raw = prod?.inTheBox ||
                              prod?.box ||
                              prod?.boxItems || [
                                prod?.name,
                                language === "ar"
                                  ? "دليل المستخدم"
                                  : "User Manual",
                                language === "ar"
                                  ? "بطاقة الضمان"
                                  : "Warranty Card",
                                language === "ar"
                                  ? "ملحقات إضافية"
                                  : "Accessories",
                              ];
                            return (raw || [])
                              .filter(Boolean)
                              .map((item: any) => {
                                if (typeof item === "string") return item;
                                if (item && (item.en || item.ar)) {
                                  return language === "ar"
                                    ? `${item.ar || item.en}${item.en ? " / " + item.en : ""}`
                                    : `${item.en || item.ar}${item.ar ? " / " + item.ar : ""}`;
                                }
                                if (
                                  item &&
                                  (item.nameEn ||
                                    item.valueEn ||
                                    item.nameAr ||
                                    item.valueAr)
                                ) {
                                  return language === "ar"
                                    ? item.nameAr ||
                                        item.valueAr ||
                                        item.nameEn ||
                                        item.valueEn
                                    : item.nameEn ||
                                        item.valueEn ||
                                        item.nameAr ||
                                        item.valueAr;
                                }
                                return String(item);
                              })
                              .map((display: any, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  {display}
                                </li>
                              ));
                          })()}
                        </ul>
                      </div>
                    </div>
                   ) : (
                    <div>
                      <div className="text-center py-8 text-gray-500">
                        {language === "ar"
                         ? "لا يوجد وصف متاح"
                          : "No description available"}
                      </div>

                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <PackageCheck className="w-5 h-5 text-[#009FE3]" />
                          {t("admin.content.boxTitle") ||
                            (language === "ar"
                            ? "لا يوجد وصف متاح"
                              : "What's in the box")}
                        </h4>
                        {userPermissions.canEditContent && (
                          <InlineProductEditor
                            product={prod}
                            userPermissions={userPermissions}
                            onSave={(updatedContent) =>
                              persistProductContent(prod.id, updatedContent)
                            }
                            mode="box"
                          />
                        )}
                        <p className="text-sm text-gray-500">
                          {language === "ar"
                            ? "لا يوجد وصف متاح"
                            : "No box items added yet."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tabState === "specs" && (
              <div className="animate-fadeIn">
                {/* Inline Editor for Specifications Only */}
                {userPermissions.canEditContent && (
                  <InlineProductEditor
                    product={prod}
                    userPermissions={userPermissions}
                    onSave={(updatedContent) =>
                      persistProductContent(prod.id, updatedContent)
                    }
                    mode="specifications"
                  />
                )}

                {populatedSpecs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {populatedSpecs.map((spec: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-[#009FE3] transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-[#009FE3] to-[#007BC7] p-3 rounded-xl shadow-md flex-shrink-0">
                              <SpecIcon spec={spec} size="lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-700 mb-1">
                                {spec.title}
                              </h4>
                              <p className="text-gray-900 font-semibold text-lg">
                                {spec.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                 <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-12 inline-block">
                      <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-semibold">
                        {language === "ar"
                          ?" لا توجد مواصفات متاحة"
                          : "No offers available for this product"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Offers Section in Specs Tab */}
                {prod?.productOffers && prod.productOffers.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Star className="w-6 h-6 text-[#009FE3]" />
                      {t("offers")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prod.productOffers.map((offer: any) => (
                        <div
                          key={offer.id}
                          className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md flex-shrink-0">
                              <Star className="w-6 h-6 text-white fill-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-green-700 mb-2 text-lg">
                                {offer.title}
                              </h4>
                              <p className="text-gray-700">
                                {offer.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;



