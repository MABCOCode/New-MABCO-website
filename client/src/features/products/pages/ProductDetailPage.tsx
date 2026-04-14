import {
  ArrowLeft,
  ArrowRight,
  Battery,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Edit3,
  FileText,
  GitCompare,
  Headphones,
  HelpCircle,
  Laptop,
  Minus,
  PackageCheck,
  Plus,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  TrendingUp,
  Watch,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../../../components/ui/carousel";
import { ChargeOptionSlider } from "../../../components/ui/ChargeOptionSlider";
import { ColorSwatch } from "../../../components/ui/ColorSwatch";
import { EditableImage } from "../../../components/ui/EditableImage";
import { EditableText } from "../../../components/ui/EditableText";
import { InlineProductEditor } from "../../../components/ui/InlineProductEditor";
import { KeyFeaturesEditor } from "../../../components/ui/KeyFeaturesEditor";
import { useCart } from "../../../context/CartContext";
import { useLanguage } from "../../../context/LanguageContext";
import {
  calculateDiscountedPrice,
  getOfferBadgeText,
  getOfferPricing,
  getProductOffers,
} from "../../../data/products";
import { setSeo } from "../../../services/seo";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { getProductRef } from "../../../utils/entityRefs";
import { getPrimaryOfferBadgeAppearance } from "../../../utils/offerBadgeAppearance";
import { applyOfferDiscount, resolveOfferDiscountType, resolveOfferDiscountValue } from "../../../utils/offerPricing";
import { getCachedStaticCatalogData, loadStaticCatalogData } from "../../../utils/staticCatalogData";
import { useCompareStore } from "../../compare/state";
import { OfferDetailsCard } from "../../offer/components/OfferDetailsCard";
import { RelatedProductsWithDiscount } from "../../offer/components/RelatedProductsWithDiscount";

interface ProductDetailPageProps {
  product?: any;
  language?: "ar" | "en";
  t?: any;
  addToCart?: () => void;
  resetProductDetail?: () => void;
  activeTab?: "description" | "faq" | "offers";
  setActiveTab?: (tab: "description" | "faq" | "offers") => void;
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

const normalizeImageEntry = (value: any) => {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    return String(
      value.image_link || value.url || value.src || value.image || "",
    ).trim();
  }
  return "";
};

const normalizeImageList = (value: any) => {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  const seen = new Set<string>();
  const result: string[] = [];
  items.forEach((item) => {
    const img = normalizeImageEntry(item);
    if (img && !seen.has(img)) {
      seen.add(img);
      result.push(img);
    }
  });
  return result;
};

const mergeImageSources = (...values: any[]) => {
  const seen = new Set<string>();
  const result: string[] = [];
  values.forEach((value) => {
    normalizeImageList(value).forEach((img) => {
      if (!seen.has(img)) {
        seen.add(img);
        result.push(img);
      }
    });
  });
  return result;
};

type UnifiedImage = {
  id: string;
  src: string;
  color?: string;
  colorKey?: string;
  source?: string;
  variantKey?: string;
};

const normalizeColorKey = (value: any) =>
  String(value || "").trim().toLowerCase();

const createImageId = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `img_${hash.toString(36)}`;
};

const isBase64Image = (value: string) =>
  String(value || "").startsWith("data:image/");

const dedupeUnifiedImages = (images: UnifiedImage[]) => {
  const seen = new Set<string>();
  const result: UnifiedImage[] = [];
  images.forEach((img) => {
    const key = `${img.colorKey || ""}__${img.src}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push(img);
  });
  return result;
};

const reorderImagesInGroup = (
  images: UnifiedImage[],
  imageId: string,
  direction: -1 | 1,
) => {
  const target = images.find((img) => img.id === imageId);
  if (!target) return images;
  const key = target.colorKey || "";
  const group = images.filter((img) => (img.colorKey || "") === key);
  const index = group.findIndex((img) => img.id === imageId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= group.length) return images;

  const reordered = [...group];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(nextIndex, 0, moved);

  const queue = [...reordered];
  return images.map((img) => {
    if ((img.colorKey || "") !== key) return img;
    return queue.shift() as UnifiedImage;
  });
};

const resolveImageId = (entry: any, fallbackSeed: string) => {
  if (entry && typeof entry === "object") {
    const id =
      entry.id ||
      entry._id ||
      entry.uid ||
      entry.imageId ||
      entry.image_id ||
      entry.key;
    if (id) return String(id);
  }
  return createImageId(fallbackSeed);
};

const buildUnifiedImagesFromProduct = (product: any) => {
  const images: UnifiedImage[] = [];
  const seen = new Set<string>();

  const addImage = (
    entry: any,
    meta: {
      source?: string;
      color?: string;
      colorKey?: string;
      variantKey?: string;
      index?: number;
    },
  ) => {
    const src = normalizeImageEntry(entry);
    if (!src) return;

    const entryMeta = entry && typeof entry === "object" ? entry : null;
    const entryColor =
      entryMeta?.color ||
      entryMeta?.colorName ||
      entryMeta?.color_name ||
      entryMeta?.variant ||
      "";
    const entryColorKey =
      entryMeta?.colorKey ||
      entryMeta?.color_key ||
      entryMeta?.variantKey ||
      entryMeta?.variant_key ||
      "";

    const color = entryColor || meta.color || "";
    const colorKey = normalizeColorKey(entryColorKey || color || meta.colorKey);
    const dedupeKey = `${colorKey || "product"}__${src}`;
    if (seen.has(dedupeKey)) return;

    const id = resolveImageId(
      entry,
      `${meta.source || "image"}|${colorKey || ""}|${meta.index ?? images.length}|${src}`,
    );

    images.push({
      id,
      src,
      color: color || undefined,
      colorKey: colorKey || undefined,
      source: meta.source,
      variantKey: meta.variantKey,
    });
    seen.add(dedupeKey);
  };

  const baseImages = product?.images;
  if (Array.isArray(baseImages)) {
    baseImages.forEach((item, index) =>
      addImage(item, { source: "product.images", index }),
    );
  } else if (baseImages) {
    addImage(baseImages, { source: "product.images", index: 0 });
  }

  addImage(product?.image, { source: "product.image", index: 0 });

  const variants = Array.isArray(product?.colorVariants)
    ? product.colorVariants
    : [];
  variants.forEach((variant: any, variantIndex: number) => {
    const color =
      variant?.name ||
      variant?.color_name ||
      variant?.nameAr ||
      variant?.color_name_ar ||
      "";
    const colorKey = normalizeColorKey(color);
    const variantKey = String(
      variant?.stk_code ||
        variant?.stkCode ||
        variant?.id ||
        variant?.code ||
        `${colorKey || "variant"}-${variantIndex}`,
    ).trim();
    const variantImages = mergeImageSources(variant?.images, variant?.image);
    variantImages.forEach((img: string, index: number) => {
      addImage(
        { src: img, color, colorKey, variantKey },
        {
          source: "colorVariant",
          color,
          colorKey,
          variantKey,
          index,
        },
      );
    });
  });

  return images;
};

const serializeUnifiedImages = (images: UnifiedImage[]) =>
  images.map((img) => ({
    id: img.id,
    src: img.src,
    color: img.color,
    colorKey: img.colorKey,
    source: img.source,
    variantKey: img.variantKey,
  }));

const pickPrimaryImage = (images: UnifiedImage[]) => {
  const productLevel = images.find((img) => !img.colorKey);
  return productLevel?.src || images[0]?.src || "";
};

const getAdminActorHeaders = () => {
  try {
    const raw = localStorage.getItem("session");
    if (!raw) return {};
    const session = JSON.parse(raw);
    const user = session?.user;
    if (!user) return {};

    const id = user.id ?? user._id ?? user.userId;
    const role = user.role ?? "admin";
    const headers: Record<string, string> = {};
    if (id) headers["x-admin-user-id"] = String(id);
    if (role) headers["x-admin-role"] = String(role);
    return headers;
  } catch {
    return {};
  }
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

function FaqAccordion({
  items,
  isRTL,
  language,
}: {
  items: Array<{ question: { en: string; ar: string }; answer: { en: string; ar: string } }>;
  isRTL: boolean;
  language: "ar" | "en";
}) {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openSection === index;
        return (
          <div
            key={`${item.question}-${index}`}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => toggleSection(index)}
              className={`w-full flex items-center justify-between p-5 text-${isRTL ? "right" : "left"} transition-colors duration-200 hover:bg-gray-50`}
            >
              <div className="flex items-center gap-4">
                {/* <div className="flex-shrink-0 text-[#009FE3]">
                  <CheckCircle2 className="w-5 h-5" />
                </div> */}
                <h3 className="text-lg text-gray-900">
                  {language === "ar" ? item.question.ar || item.question.en : item.question.en || item.question.ar}
                </h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 pt-2 bg-gray-50 border-t border-gray-200">
                <p className={`text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
                  {language === "ar" ? item.answer.ar || item.answer.en : item.answer.en || item.answer.ar}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProductDetailPage(props: ProductDetailPageProps) {
  const { product, categoryName, brandName, userPermissions: userPermissionsProp, onSaveProductContent } = props;
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
  const [resolvedAdminMeta, setResolvedAdminMeta] = useState<any | null>(null);
  const [staticCategories, setStaticCategories] = useState<any[]>([]);
  const [staticBrands, setStaticBrands] = useState<any[]>([]);

  const [localProduct, setLocalProduct] = useState<any | null>(
    product ?? (location.state && (location.state as any).product) ?? null,
  );

  const userPermissions = useMemo(() => {
    if (userPermissionsProp) return userPermissionsProp;
    try {
      const raw = localStorage.getItem("session");
      if (!raw) return { canEditContent: false };
      const session = JSON.parse(raw);
      const user = session?.user;
      if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
        return { canEditContent: false };
      }
      const adminMeta = resolvedAdminMeta || user.adminMeta || {};
      const allowAllCategories = Boolean(adminMeta.allowAllCategories);
      const allowAllBrands = Boolean(adminMeta.allowAllBrands);
      const allowedCategoryIds = Array.isArray(adminMeta.allowedCategoryIds)
        ? adminMeta.allowedCategoryIds.map(String)
        : [];
      const allowedBrandIds = Array.isArray(adminMeta.allowedBrandIds)
        ? adminMeta.allowedBrandIds.map(String)
        : [];
      const catCode = String(
        localProduct?.cat_code || localProduct?.category_code || localProduct?.catCode || ""
      );
      const brandCode = String(
        localProduct?.brand_code || localProduct?.brandCode || ""
      );
      const categoryAllowed = allowAllCategories || (catCode && allowedCategoryIds.includes(catCode));
      const brandAllowed = allowAllBrands || (brandCode && allowedBrandIds.includes(brandCode));
      return { canEditContent: Boolean(categoryAllowed && brandAllowed) };
    } catch {
      return { canEditContent: false };
    }
  }, [localProduct, resolvedAdminMeta, userPermissionsProp]);

  useEffect(() => {
    if (userPermissionsProp) return;
    let mounted = true;
    try {
      const raw = localStorage.getItem("session");
      if (!raw) return;
      const session = JSON.parse(raw);
      const user = session?.user;
      if (!user || (user.role !== "admin" && user.role !== "super_admin")) return;
      if (user.adminMeta || resolvedAdminMeta) return;
      const userId = user.id || user._id || user.userId;
      if (!userId) return;
      const apiBase =
        (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
      fetch(`${apiBase}/admin/users/${encodeURIComponent(userId)}/permissions`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (!mounted || !json?.data) return;
          const perms = json.data?.permissions || json.data?.adminMeta || json.data?.admin_meta;
          if (perms) setResolvedAdminMeta(perms);
        })
        .catch(() => undefined);
    } catch {
      return;
    }
    return () => {
      mounted = false;
    };
  }, [resolvedAdminMeta, userPermissionsProp]);

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
    const controller = new AbortController();
    const apiBase =
      (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    setIsLoadingProduct(true);
    setProductError(null);

    (async () => {
      try {
        const res = await fetch(`${apiBase}/products/${encodeURIComponent(id)}`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to load product: ${res.status}`);
        }
        const json = await res.json();
        setLocalProduct(json?.data ?? null);
        setIsLoadingProduct(false);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setProductError(err?.message || "Failed to load product");
        setIsLoadingProduct(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [id]);

  const prod = localProduct ?? product;
  const hasBoxItems = Boolean(
    (Array.isArray(prod?.inTheBox) && prod.inTheBox.length > 0) ||
    (Array.isArray(prod?.boxItems) && prod.boxItems.length > 0) ||
    (Array.isArray(prod?.box) && prod.box.length > 0)
  );

  useEffect(() => {
    let mounted = true;
    const cached = getCachedStaticCatalogData();
    if (cached) {
      setStaticCategories(cached.categories);
      setStaticBrands(cached.brands);
    }
    const loadStatics = async () => {
      try {
        const { categories: categoriesJson, brands: brandsJson } = await loadStaticCatalogData();
        if (!mounted) return;
        setStaticCategories(Array.isArray(categoriesJson) ? categoriesJson : []);
        setStaticBrands(Array.isArray(brandsJson) ? brandsJson : []);
      } catch {
        if (!mounted) return;
        setStaticCategories([]);
        setStaticBrands([]);
      }
    };

    if (!staticCategories.length || !staticBrands.length) {
      loadStatics();
    }

    return () => {
      mounted = false;
    };
  }, [staticBrands.length, staticCategories.length]);

  const resolvedCategoryName = useMemo(() => {
    const catCode = String(
      prod?.cat_code || prod?.category_code || prod?.catCode || ""
    );
    const category = staticCategories.find(
      (item) => String(item?.cat_code) === catCode
    );
    if (category) {
      return language === "ar"
        ? category?.name || category?.nameAr || categoryName
        : category?.nameEn || category?.englishName || categoryName;
    }
    return categoryName;
  }, [categoryName, language, prod, staticCategories]);

  const resolvedBrandName = useMemo(() => {
    const brandCode = String(
      prod?.brand_code || prod?.brandCode || ""
    );
    const brand = staticBrands.find(
      (item) => String(item?.brand_code) === brandCode
    );
    if (brand) {
      return language === "ar"
        ? brand?.name || brand?.nameAr || brandName
        : brand?.englishName || brand?.nameEn || brandName;
    }
    return brandName;
  }, [brandName, language, prod, staticBrands]);

  useEffect(() => {
    if (!prod) return;

    const productName =
      language === 'ar'
        ? prod.nameAr || prod.name || prod.nameEn || 'منتج مابكو'
        : prod.nameEn || prod.name || prod.nameAr || 'MABCO Product';

    const descriptionText =
      language === 'ar'
        ? String(prod.descriptionAr || prod.description || '').slice(0, 160) ||
          `منتج ${productName} في مابكو - الجودة والضمان والتوصيل السريع.`
        : String(prod.description || prod.descriptionAr || '').slice(0, 160) ||
          `${productName} at MABCO - quality, warranty, and fast delivery.`;

    const seoImage =
      buildUnifiedImagesFromProduct(prod)[0]?.src ||
      mergeImageSources(prod?.images, prod?.image)[0] ||
      "https://mabcoonline.com/images/giphy.gif";
    setSeo({
      title:
        language === 'ar'
          ? `${productName} - مابكو` 
          : `${productName} | MABCO`,
      description: descriptionText,
      url: window.location.href,
      image: seoImage,
      keywords: `${productName}, ${resolvedBrandName || ''}`,
    });
  }, [prod, language, resolvedBrandName]);

  const breadcrumbs = useMemo(() => {
    if (Array.isArray(locationState?.breadcrumbs) && locationState.breadcrumbs.length) {
      return locationState.breadcrumbs.filter((item: any) => item && item.label);
    }

    const fallback: Array<{ label: string; href?: string }> = [];
    if (resolvedCategoryName) fallback.push({ label: resolvedCategoryName });
    if (resolvedBrandName) fallback.push({ label: resolvedBrandName });
    return fallback;
  }, [locationState, resolvedBrandName, resolvedCategoryName]);

  const resolveBrandHref = (crumbIndex: number, crumb: any): string | null => {
    if (crumbIndex !== breadcrumbs.length - 1) return null;
    if (crumb?.href) return null;
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

    const apiBase =
      (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    const adminKey = (import.meta as any).env?.VITE_ADMIN_API_KEY || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAdminActorHeaders(),
    };
    if (adminKey) headers["x-admin-key"] = adminKey;
    setIsSaving(true);
    setSaveError(null);
    try {
      const hasImagePayload =
        updated?.images !== undefined ||
        updated?.image !== undefined ||
        updated?.colorVariants !== undefined;
      const unifiedImages = hasImagePayload
        ? buildUnifiedImagesFromProduct({
            ...prod,
            ...updated,
          })
        : [];
      const payload: Record<string, any> = {
        name: updated?.name,
        nameAr: updated?.nameAr,
        description: updated?.descriptionEn ?? updated?.description,
        descriptionEn: updated?.descriptionEn,
        descriptionAr: updated?.descriptionAr,
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
            id: spec.id,
            icon: iconImage ? { type: "url", url: iconImage } : icon,
            iconImage,
            title: spec.title || "",
            titleAr: spec.titleAr || spec.nameAr || "",
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
      const baseVariants = Array.isArray(updated?.colorVariants)
        ? updated.colorVariants
        : Array.isArray(prod?.colorVariants)
        ? prod.colorVariants
        : [];
      const hasVariantImages = baseVariants.length > 0;

      if (hasImagePayload && hasVariantImages) {
        const toVariantKey = (variant: any) =>
          String(
            variant?.stk_code ||
              variant?.stkCode ||
              variant?.id ||
              variant?.code ||
              "",
          ).trim();
        const nextColorVariants = baseVariants.map((variant: any) => {
          const key = toVariantKey(variant);
          if (!key) return variant;
          const variantImages = unifiedImages
            .filter(
              (img) =>
                img.source === "colorVariant" &&
                String(img.variantKey || "") === key,
            )
            .map((img) => img.src);
          if (variantImages.length === 0) return variant;
          return {
            ...variant,
            images: variantImages,
            image: variantImages[0] || variant.image,
          };
        });
        payload.colorVariants = nextColorVariants;
      } else if (hasImagePayload) {
        payload.images = serializeUnifiedImages(unifiedImages);
        payload.image = pickPrimaryImage(unifiedImages);
      }
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
  const getSpecTitle = (spec: any) =>
    language === "ar"
      ? spec?.titleAr || spec?.nameAr || spec?.title || spec?.nameEn || ""
      : spec?.title || spec?.nameEn || spec?.titleAr || spec?.nameAr || "";
  const getSpecValue = (spec: any) =>
    language === "ar"
      ? spec?.valueAr || spec?.value || spec?.valueEn || ""
      : spec?.value || spec?.valueEn || spec?.valueAr || "";
  const populatedSpecs = specsList.filter((spec: any) => {
    const title =
      String(spec?.title ?? spec?.nameEn ?? spec?.titleAr ?? spec?.nameAr ?? "").trim();
    const value =
      String(spec?.value ?? spec?.valueEn ?? spec?.valueAr ?? "").trim();
    return title.length > 0 && value.length > 0;
  });
  const selectedKeyFeatures = populatedSpecs.filter((spec: any) => spec?.isKeyFeature).slice(0, 4);
  const displayKeyFeatures = selectedKeyFeatures.length > 0 ? selectedKeyFeatures : populatedSpecs.slice(0, 4);
  const shouldShowKeyFeatures = userPermissions.canEditContent || displayKeyFeatures.length > 0;
  const hasSpecsContent = populatedSpecs.length > 0;

  const baseProductOffers = prod ? getProductOffers(prod as any) : [];
  const productOffers = baseProductOffers;

  const unifiedImages = useMemo(
    () => buildUnifiedImagesFromProduct(prod),
    [prod],
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

  const normalizedColorVariants = useMemo(() => {
    const variants = Array.isArray(prod?.colorVariants) ? prod.colorVariants : [];
    const deduped = new Map<string, any>();
    const scoreVariant = (variant: any) => {
      const hasImage = Boolean(
        String(variant.image || (variant.images && variant.images[0]) || "").trim(),
      );
      const isActive = typeof variant.active !== "boolean" || variant.active;
      const isAvailable = variant.isAvailable !== false;
      const inStock = variant.inStock !== false;
      return (hasImage ? 4 : 0) + (isActive ? 2 : 0) + (isAvailable && inStock ? 1 : 0);
    };

    const getVariantImages = (variant: any) => {
      const colorLabel =
        variant?.name ||
        variant?.color_name ||
        variant?.nameAr ||
        variant?.color_name_ar ||
        "";
      const colorKey = normalizeColorKey(colorLabel);
      const fromUnified = unifiedImages
        .filter((img) => img.colorKey && img.colorKey === colorKey)
        .map((img) => img.src);
      if (fromUnified.length > 0) return fromUnified;
      return mergeImageSources(variant.images, variant.image);
    };

    variants.forEach((variant: any) => {
      const images = getVariantImages(variant);
      const image = images[0] || "";
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
  }, [prod, unifiedImages]);

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
    unifiedImages.length > 0 || availableColorVariants.length > 0;
  const hasValidName = Boolean(String(prod?.name || "").trim());
  const hasSpecs = Array.isArray(prod?.specs) && prod.specs.length > 0;
  const localizedDescription = String(
    language === "ar"
      ? prod?.descriptionAr || prod?.description || ""
      : prod?.description || prod?.descriptionAr || "",
  ).trim();
  const hasDescription = Boolean(localizedDescription);
  const hasDetails = hasSpecs || hasDescription;

  const [selectedColor, setSelectedColor] = useState(
    availableColorVariants?.[0]?.name || "",
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(
    normalizedChargeOptions[0]?.id || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [tabState, setTabState] = useState<"description" | "faq" | "offers">("description");
  const [heroProductInCart, setHeroProductInCart] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [pendingCartOptions, setPendingCartOptions] = useState<any | null>(null);
  const [showOfferProducts, setShowOfferProducts] = useState(false);
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [offerProductsLoading, setOfferProductsLoading] = useState(false);
  const [offerProductsError, setOfferProductsError] = useState<string | null>(null);
  const [faqItems, setFaqItems] = useState<
    Array<{ question: { en: string; ar: string }; answer: { en: string; ar: string } }>
  >([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState<string | null>(null);
  const [faqLoaded, setFaqLoaded] = useState(false);
  const [faqHidden, setFaqHidden] = useState(false);

  const displayColor = hoveredColor || selectedColor;
  const currentColorVariant = hasColors
    ? availableColorVariants.find((v: any) => v.name === displayColor)
    : null;

  useEffect(() => {
    setFaqItems([]);
    setFaqLoading(false);
    setFaqError(null);
    setFaqLoaded(false);
    setFaqHidden(false);
  }, [prod?.id]);

  useEffect(() => {
    if (faqLoaded || faqLoading) return;
    if (!prod) return;
    const catCode = String(prod?.cat_code || prod?.category_code || prod?.catCode || "").trim();
    const brandValue = String(
      prod?.brand_code || prod?.brandCode || prod?.brand || prod?.brandAr || "",
    ).trim();
    const apiBase =
      (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    const params = new URLSearchParams();
    if (catCode) params.set("cat_code", catCode);
    if (brandValue) params.set("brand", brandValue);
    setFaqLoading(true);
    setFaqError(null);
    fetch(`${apiBase}/faqs?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        const list = Array.isArray(json?.data?.questions)
          ? json.data.questions
          : Array.isArray(json?.data)
          ? json.data
          : [];
        const normalized = list
          .map((item: any) => ({
            question: {
              en: String(item?.question?.en || "").trim(),
              ar: String(item?.question?.ar || "").trim(),
            },
            answer: {
              en: String(item?.answer?.en || "").trim(),
              ar: String(item?.answer?.ar || "").trim(),
            },
          }))
          .filter((item: any) => item.question.en || item.question.ar);
        setFaqItems(normalized);
        setFaqLoaded(true);
        if (normalized.length === 0) {
          setFaqHidden(true);
          setTabState("description");
        }
      })
      .catch(() => {
        setFaqError(language === "ar" ? "تعذر تحميل الأسئلة الشائعة" : "Failed to load FAQs");
        setFaqLoaded(true);
      })
      .finally(() => {
        setFaqLoading(false);
      });
  }, [faqLoaded, faqLoading, prod, language]);

  const displayColorKey = normalizeColorKey(displayColor);
  const productImageEntries = unifiedImages.filter((img) => !img.colorKey);
  const variantImageEntries = displayColorKey
    ? unifiedImages.filter((img) => img.colorKey === displayColorKey)
    : [];

  const currentImageEntries =
    variantImageEntries.length > 0
      ? variantImageEntries
      : productImageEntries.length > 0
      ? productImageEntries
      : unifiedImages;

  const currentImages = currentImageEntries.map((img) => img.src);
  const currentImage =
    currentImageEntries[0]?.src ||
    productImageEntries[0]?.src ||
    unifiedImages[0]?.src ||
    prod?.image;

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
  const displayOffers =
    hasValidVariants ? selectedVariantOffers : baseProductOffers;
  const hasOffers = displayOffers.length > 0;
  const singleOffer = useMemo(() => displayOffers.length === 1, [displayOffers]);

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
  const offerBadgeInfo = offerBadgeText
    ? getPrimaryOfferBadgeAppearance(displayOffers)
    : null;

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
    const chosenVariantImage =
      currentImage ?? productImageEntries[0]?.src ?? null;

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

    const availableOffersRaw = hasValidVariants
      ? (selectedCharge && Array.isArray((selectedCharge as any).offers)
          ? (selectedCharge as any).offers
          : currentColorVar && Array.isArray((currentColorVar as any).offers)
          ? (currentColorVar as any).offers
          : null)
      : Array.isArray((prod as any).offers)
      ? (prod as any).offers
      : null;
    const appliedOffers = null;

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

    const cartOptions = {
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
      availableOffers: availableOffersRaw,
      quantity,
    };

    if (hasOffers && displayOffers.length > 0) {
      setPendingCartOptions(cartOptions);
      setSelectedOffer(null);
      setOfferDialogOpen(true);
      return;
    }

    cart.addToCart(prod, cartOptions);
    setHeroProductInCart(true);
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
    if (!cart.addToCart || !prod || !pendingCartOptions) return;
    cart.addToCart(prod, {
      ...pendingCartOptions,
      appliedOffers: offer ? [offer] : null,
      overridePrice: override?.price,
      overrideOldPrice: override?.oldPrice,
    });
    setHeroProductInCart(true);
  };

  const handleDirectDiscount = (offer: any) => {
    const base = typeof pendingCartOptions?.basePrice === "number"
      ? pendingCartOptions.basePrice
      : numericPrice(prod?.price);
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
    cart.addToCart(relatedProduct, {
      customId: `${meta.type}-${prod.id}-${relatedProduct.id || relatedProduct.stk_code || Date.now()}`,
      quantity: 1,
      overridePrice: discountedPrice,
      overrideOldPrice: basePrice,
      isCouponItem: meta.type === "coupon",
      isBundleItem: meta.type === "bundle",
      isFreeGift: meta.type === "free",
      linkedToProductId: String(prod.id ?? prod.stk_code ?? prod.id),
      bundleDiscount: meta.type === "bundle" ? resolveOfferDiscountValue(offer) : undefined,
      bundleDiscountType: meta.type === "bundle" ? resolveOfferDiscountType(offer) : undefined,
    });
    closeOfferDialog();
  };

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
      const fallback = products.filter((p) => codes.includes(String(p.stk_code)));
      setOfferProducts(fallback);
    } catch (err: any) {
      const fallback = products.filter((p) => extractOfferStkCodes(offer).includes(String(p.stk_code)));
      setOfferProducts(fallback);
      setOfferProductsError(err?.message || "Failed to load offer products");
    } finally {
      setOfferProductsLoading(false);
    }
  };

  const handleToggleCompare = () => {
    if (!productRef) return;
    const isAdding = !compareItems.some((itemId) => String(itemId) === String(productRef));
    toggleCompare(productRef);
    if (isAdding) openCompare();
  };

  const isHeroInCart = !!prod?.id && cart.cartItems?.some((item) => {
    const itemProductId = item.productId ?? item.id;
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

  const persistUnifiedImages = (nextImages: UnifiedImage[]) => {
    if (!prod?.id) return;
    const nextProduct = {
      ...prod,
      images: serializeUnifiedImages(nextImages),
      image: pickPrimaryImage(nextImages),
    };
    setLocalProduct(nextProduct);
    persistProductContent(prod.id, nextProduct);
  };

  const updateUnifiedImage = (imageId: string, newUrl: string) => {
    const target = unifiedImages.find((img) => img.id === imageId);
    const oldSrc = target?.src || "";
    let nextImages = unifiedImages.map((img) =>
      img.id === imageId ? { ...img, src: newUrl } : img,
    );

    if (oldSrc && isBase64Image(oldSrc) && !isBase64Image(newUrl)) {
      nextImages = nextImages.map((img) =>
        img.src === oldSrc ? { ...img, src: newUrl } : img,
      );
    }

    persistUnifiedImages(dedupeUnifiedImages(nextImages));
  };

  const moveImage = (imageId: string, direction: -1 | 1) => {
    const next = reorderImagesInGroup(unifiedImages, imageId, direction);
    if (next === unifiedImages) return;
    persistUnifiedImages(dedupeUnifiedImages(next));
  };

  const addUnifiedImage = (newUrl: string, meta?: { colorKey?: string; color?: string }) => {
    const colorKey = normalizeColorKey(meta?.colorKey || meta?.color || "");
    const color = meta?.color || "";
    if (!isBase64Image(newUrl)) {
      const existingBase64Index = unifiedImages.findIndex(
        (img) =>
          Boolean(img.src) &&
          isBase64Image(img.src) &&
          String(img.colorKey || "") === String(colorKey || ""),
      );
      if (existingBase64Index >= 0) {
        const nextImages = unifiedImages.map((img, idx) =>
          idx === existingBase64Index ? { ...img, src: newUrl } : img,
        );
        persistUnifiedImages(dedupeUnifiedImages(nextImages));
        return;
      }
    }
    const nextImage: UnifiedImage = {
      id: createImageId(`manual|${colorKey}|${Date.now()}|${newUrl}`),
      src: newUrl,
      color: color || undefined,
      colorKey: colorKey || undefined,
      source: colorKey ? "colorVariant" : "product.images",
    };
    persistUnifiedImages(dedupeUnifiedImages([...unifiedImages, nextImage]));
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

  useEffect(() => {
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

  if (userPermissions.canEditContent && (!hasValidImage || !hasValidName || !hasDetails) && (  (prod?.cat_code || prod?.category_code || prod?.catCode || "") !=="02")) {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
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
                    const brandHref = resolveBrandHref(index, crumb);
                    const href = crumb?.href || brandHref;
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

              <span className="text-[#009FE3] font-semibold break-words max-w-full sm:max-w-md">
                {prod?.name}
              </span>
            </div>

            <button
              onClick={handleNavigateBack}
              className="self-end sm:self-auto p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 flex-shrink-0"
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
                    {currentImageEntries && currentImageEntries.length > 0 ? (
                      currentImageEntries.map((imageEntry, index) => (
                        <CarouselItem
                          key={`img-${imageEntry.id}-${index}`}
                          className="w-full flex-shrink-0"
                        >
                          <div className="relative">
                            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border border-gray-200">
                              {userPermissions.canEditContent ? (
                                <EditableImage
                                  src={imageEntry.src}
                                  alt={`${prod?.name} - ${index + 1}`}
                                  onSave={(newImageUrl) => {
                                    updateUnifiedImage(
                                      imageEntry.id,
                                      newImageUrl,
                                    );
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
                                    src={imageEntry.src}
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
                                  src={currentImage || prod?.image}
                                  alt={prod?.name}
                                  onSave={(newImageUrl) => {
                                  addUnifiedImage(newImageUrl, {
                                    colorKey: hasColors ? displayColorKey : "",
                                    color: hasColors ? displayColor : "",
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
                        {currentImageEntries.map((_, idx) => (
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

                  {offerBadgeText && offerBadgeInfo && (
                    <div
                      className={`absolute top-4 ${language === "ar" ? "left-6" : "right-6"} z-20 flex items-start justify-end`}
                    >
                      <div
                        className={`bg-gradient-to-r ${offerBadgeInfo.gradient} text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 whitespace-nowrap backdrop-blur-sm`}
                      >
                        <offerBadgeInfo.Icon className="w-4 h-4" />
                        <span>{offerBadgeText}</span>
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
                        {currentImageEntries.map((imageEntry, index) => (
                          <button
                            key={`thumb-${imageEntry.id}-${index}`}
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
                                src={imageEntry.src}
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
                              {userPermissions.canEditContent && (
                                <div className="absolute top-1 right-1 flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveImage(imageEntry.id, -1);
                                    }}
                                    className="p-1 rounded bg-white/90 hover:bg-white text-gray-700 shadow"
                                    title={language === "ar" ? "تحريك لليسار" : "Move left"}
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveImage(imageEntry.id, 1);
                                    }}
                                    className="p-1 rounded bg-white/90 hover:bg-white text-gray-700 shadow"
                                    title={language === "ar" ? "تحريك لليمين" : "Move right"}
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
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
              {(resolvedBrandName || resolvedCategoryName) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  {resolvedCategoryName && (
                    <span className="px-2.5 py-1 rounded-full bg-white border border-gray-200">
                      {resolvedCategoryName}
                    </span>
                  )}
                  {resolvedBrandName && (
                    <span className="px-2.5 py-1 rounded-full bg-white border border-gray-200">
                      {resolvedBrandName}
                    </span>
                  )}
                </div>
              )}

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

            {/* Description 
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
            )}*/}

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
                            <p className="text-xs text-gray-500 mb-0.5">{getSpecTitle(spec)}</p>
                            <p className="font-bold text-gray-900 truncate">{getSpecValue(spec)}</p>
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
          <div className="flex overflow-x-auto scrollbar-hide bg-gray-50">
            <button
              onClick={() => setTabState("description")}
              className={`flex-shrink-0 px-4 sm:px-6 py-4 font-bold transition-all duration-300 relative flex items-center justify-center gap-2 min-w-0 ${
                tabState === "description"
                  ? "text-[#009FE3] bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              } ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">{t("description")}</span>
              {tabState === "description" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7]" />
              )}
            </button>

            {!faqHidden && faqItems.length > 0 && (
              <button
                onClick={() => setTabState("faq")}
                className={`flex-shrink-0 px-4 sm:px-6 py-4 font-bold transition-all duration-300 relative flex items-center justify-center gap-2 min-w-0 ${
                  tabState === "faq"
                    ? "text-[#009FE3] bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                } ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}
              >
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{language === "ar" ? "الأسئلة الشائعة" : "FAQ"}</span>
                {tabState === "faq" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7]" />
                )}
              </button>
            )}

            <button
              onClick={() => setTabState("offers")}
              className={`flex-shrink-0 px-4 sm:px-6 py-4 font-bold transition-all duration-300 relative flex items-center justify-center gap-2 min-w-0 ${
                tabState === "offers"
                  ? "text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 scale-105"
                  : "text-orange-600 hover:text-orange-700 bg-gradient-to-r from-orange-50 to-pink-50 hover:from-orange-100 hover:to-pink-100 animate-pulse"
              }`}
            >
              <Tag className="w-6 h-6 flex-shrink-0" />
              <span className="whitespace-nowrap">{language === "ar" ? "العروض" : "Offers"}</span>
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
                                  discountValue: resolveOfferDiscountValue(bundleOffer),
                                  discountType: resolveOfferDiscountType(bundleOffer),
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
                                  item.productId ?? item.id;
                                return (
                                  itemProductId === productId &&
                                  item.isBundleItem &&
                                  String(item.linkedToProductId ?? "") === String(prod.id ?? prod.stk_code ?? prod.id)
                                );
                              },
                            );
                            if (alreadyAdded) return;

                              const bundleOffer = displayOffers.find(
                                (o) => o.type === "bundle_discount",
                              ) as any;
                              if (!bundleOffer) return;

                            const base = numericPrice(rel.price);
                            const discounted = Math.round(applyOfferDiscount(base, bundleOffer));

                            cart.addToCart(rel, {
                              customId: `bundle-${prod.id}-${productId}`,
                              quantity: 1,
                              overridePrice: discounted,
                              overrideOldPrice: base,
                              isBundleItem: true,
      linkedToProductId: String(prod.id ?? prod.stk_code ?? prod.id),
                              bundleDiscount: resolveOfferDiscountValue(bundleOffer),
                              bundleDiscountType: resolveOfferDiscountType(bundleOffer),
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
                  {localizedDescription ? (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {language === "ar"
                          ? "حول هذا المنتج"
                          : "About this product"}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {localizedDescription}
                      </p>

                      {isLoadingProduct && (
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-[#009FE3]" />
                            {t("admin.content.boxTitle") ||
                              (language === "ar"
                                ? "ما يأتي في العلبة"
                                : "What's in the box")}
                          </h4>
                          <ul className="space-y-2">
                            {[1, 2, 3].map((idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div className="w-4 h-4 rounded-full shimmer-surface" />
                                <div className="h-4 w-32 shimmer-surface rounded" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!isLoadingProduct && (userPermissions.canEditContent || hasBoxItems) && (
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
                                prod?.boxItems;
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
                      )}
                    </div>
                   ) : (
                    <div>
                      <div className="text-center py-8 text-gray-500">
                        {language === "ar"
                         ? "لا يوجد وصف متاح"
                          : "No description available"}
                      </div>

                      {isLoadingProduct && (
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-[#009FE3]" />
                            {t("admin.content.boxTitle") ||
                              (language === "ar"
                                ? "ما يأتي في العلبة"
                                : "What's in the box")}
                          </h4>
                          <ul className="space-y-2">
                            {[1, 2, 3].map((idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div className="w-4 h-4 rounded-full shimmer-surface" />
                                <div className="h-4 w-32 shimmer-surface rounded" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!isLoadingProduct && (userPermissions.canEditContent || hasBoxItems) && (
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
                          {(() => {
                            const raw = prod?.inTheBox ||
                              prod?.box ||
                              prod?.boxItems;
                            const items = (raw || [])
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
                              });
                            if (items.length === 0) {
                              return (
                                <p className="text-sm text-gray-500">
                                  {language === "ar"
                                    ? "لم تتم إضافة عناصر بعد"
                                    : "No box items added yet."}
                                </p>
                              );
                            }
                            return (
                              <ul className="space-y-2 text-gray-600">
                                {items.map((display: any, idx: number) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    {display}
                                  </li>
                                ))}
                              </ul>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tabState === "description" && (userPermissions.canEditContent || hasSpecsContent) && (
              <div className="animate-fadeIn mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-[#009FE3]" />
                  {language === "ar" ? "المواصفات" : "Specifications"}
                </h3>
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

                {isLoadingProduct ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`spec-loading-${index}`}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl shimmer-surface" />
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-4 w-1/2 shimmer-surface rounded" />
                            <div className="h-5 w-3/4 shimmer-surface rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : populatedSpecs.length > 0 ? (
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
                                {getSpecTitle(spec)}
                              </h4>
                              <p className="text-gray-900 font-semibold text-lg">
                                {getSpecValue(spec)}
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

              </div>
            )}

            {tabState === "faq" && (
              <div className="animate-fadeIn">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                    <HelpCircle className="w-7 h-7 text-[#009FE3]" />
                  </div>
                  <h2 className="text-3xl text-gray-900 mb-2">
                    {language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
                  </h2>
                  <p className="text-base text-gray-600">
                    {language === "ar"
                      ? "إجابات سريعة عن أكثر الأسئلة شيوعاً حول هذا المنتج"
                      : "Quick answers to the most common questions about this product"}
                  </p>
                </div>

                {faqLoading && (
                  <div className="text-center py-10 text-gray-500">
                    {language === "ar" ? "جارٍ تحميل الأسئلة..." : "Loading FAQs..."}
                  </div>
                )}

                {!faqLoading && faqError && (
                  <div className="text-center py-10 text-red-600">
                    {faqError}
                  </div>
                )}

                {!faqLoading && !faqError && faqItems.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    {language === "ar"
                      ? "لا توجد أسئلة شائعة متاحة حالياً."
                      : "No FAQs available at the moment."}
                  </div>
                )}

                {!faqLoading && !faqError && faqItems.length > 0 && (
                  <FaqAccordion items={faqItems} isRTL={language === "ar"} language={language} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {offerDialogOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4"
          onClick={closeOfferDialog}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 z1000 "
            onClick={(e) => e.stopPropagation()}
             style={{ zIndex: 1000 }}
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
                      basePrice={basePrice}
                      currentPrice={currentPrice}
                      currencyLabel={currencyLabel}
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
                  {language === "ar"
                    ? "اختر المنتج المرتبط بالعرض"
                    : "Select a product for this offer"}
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
                    {offerProducts.map((product: any) => {
                      const base = numericPrice(product.price);
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
                        <div
                          key={product.id || product.stk_code}
                          className="flex items-center gap-3 border rounded-lg p-2"
                        >
                          <img src={product.image} className="w-10 h-10 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {language === "ar" && product.nameAr ? product.nameAr : product.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {language === "ar" ? "بعد الخصم:" : "After discount:"}{" "}
                              {discounted.toLocaleString("en-US")} {currencyLabel}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleAddRelatedProduct(selectedOffer, product, discounted, base, { type: metaType })
                            }
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
                    cart.addToCart?.(prod, pendingCartOptions);
                    setHeroProductInCart(true);
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
    </section>
  );
}

export default ProductDetailPage;



