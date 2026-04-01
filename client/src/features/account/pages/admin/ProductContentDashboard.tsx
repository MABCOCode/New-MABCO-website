import {
  AlertCircle,
  AlertTriangle,
  Battery,
  Camera,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Gamepad2,
  HardDrive,
  Headphones,
  Image as ImageIcon,
  Info,
  Laptop,
  MemoryStick,
  Monitor,
  Package,
  Palette,
  Plus,
  Search,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Speaker,
  Tag,
  Trash2,
  Upload,
  Watch,
  Wifi,
  X,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import savedSpecTitlesManager from "../../../../data/savedSpecTitlesData";

interface ProductContentDashboardProps {
  onClose: () => void;
  adminMeta?: {
    allowAllCategories?: boolean;
    allowAllBrands?: boolean;
    allowedCategoryIds?: string[];
    allowedBrandIds?: string[];
  };
}

interface FilterCategoryOption {
  id: string;
  nameEn: string;
  nameAr: string;
}

interface FilterBrandOption {
  id: string;
  nameEn: string;
  nameAr: string;
  categoryIds: string[];
}

// Content Requirements for synced products
const CONTENT_REQUIREMENTS = {
  description: { min: 10, max: 500, optimal: 200 },
  minImages: 1,
  maxImages: 10,
  minSpecs: 1,
  maxSpecs: 1,
  imageMaxSize: 2, // MB
};

// Available icons for specifications
const AVAILABLE_ICONS = [
  { name: "Smartphone", icon: Smartphone, labelAr: "هاتف", labelEn: "Phone" },
  { name: "Camera", icon: Camera, labelAr: "كاميرا", labelEn: "Camera" },
  { name: "Battery", icon: Battery, labelAr: "بطارية", labelEn: "Battery" },
  { name: "Laptop", icon: Laptop, labelAr: "معالج", labelEn: "Processor" },
  { name: "Watch", icon: Watch, labelAr: "ساعة", labelEn: "Watch" },
  { name: "Headphones", icon: Headphones, labelAr: "سماعات", labelEn: "Audio" },
  { name: "Gamepad2", icon: Gamepad2, labelAr: "ألعاب", labelEn: "Gaming" },
  { name: "Shield", icon: Shield, labelAr: "حماية", labelEn: "Protection" },
  { name: "Zap", icon: Zap, labelAr: "شحن", labelEn: "Charging" },
  { name: "Wifi", icon: Wifi, labelAr: "اتصال", labelEn: "Connectivity" },
  { name: "HardDrive", icon: HardDrive, labelAr: "تخزين", labelEn: "Storage" },
  { name: "Monitor", icon: Monitor, labelAr: "شاشة", labelEn: "Display" },
  { name: "Speaker", icon: Speaker, labelAr: "صوت", labelEn: "Sound" },
  { name: "Cpu", icon: Cpu, labelAr: "أداء", labelEn: "Performance" },
  { name: "MemoryStick", icon: MemoryStick, labelAr: "ذاكرة", labelEn: "Memory" },
];

// Categories list
const CATEGORIES = [
  { id: "mobile", nameAr: "موبايل", nameEn: "Mobile" },
  { id: "power-station", nameAr: "باور ستيشن", nameEn: "Power Station" },
  { id: "laptop", nameAr: "لابتوب", nameEn: "Laptop" },
  { id: "tablet", nameAr: "تابلت", nameEn: "Tablet" },
  { id: "smartwatch", nameAr: "ساعة ذكية", nameEn: "Smartwatch" },
  { id: "headphones", nameAr: "سماعات", nameEn: "Headphones" },
  { id: "accessories", nameAr: "إكسسوارات", nameEn: "Accessories" },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

const pickLocalizedStaticName = (value: any, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.en || value.ar || fallback;
  }
  return fallback;
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

const buildUnifiedImagesForEditor = (
  product: any,
  galleryImages: any[],
  colors: any[],
) => {
  const images: UnifiedImage[] = [];
  const seen = new Set<string>();
  const raw = product?._raw || product;

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

  const baseImages = raw?.images;
  if (Array.isArray(baseImages)) {
    baseImages.forEach((item: any, index: number) =>
      addImage(item, { source: "product.images", index }),
    );
  } else if (baseImages) {
    addImage(baseImages, { source: "product.images", index: 0 });
  }

  addImage(raw?.image, { source: "product.image", index: 0 });

  (Array.isArray(galleryImages) ? galleryImages : []).forEach(
    (item: any, index: number) =>
      addImage(item, { source: "gallery", index }),
  );

  (Array.isArray(colors) ? colors : []).forEach(
    (color: any, index: number) => {
      const colorLabel =
        color?.name || color?.nameAr || color?.color_name || "";
      const colorKey = normalizeColorKey(color?.stkCode || colorLabel || index);
      const variantKey = String(color?.stkCode || color?.stk_code || colorKey || index);
      const colorImages = Array.isArray(color?.images) ? color.images : [];
      if (colorImages.length > 0) {
        colorImages.forEach((img: any, imgIndex: number) => {
          addImage(img, {
            source: "colorVariant",
            color: colorLabel,
            colorKey,
            variantKey,
            index: imgIndex,
          });
        });
      } else {
        addImage(color?.image, {
          source: "colorVariant",
          color: colorLabel,
          colorKey,
          variantKey,
          index,
        });
      }
    },
  );

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

export function ProductContentDashboard({ onClose, adminMeta }: ProductContentDashboardProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("");
  const [missingFilter, setMissingFilter] = useState<"missing" | "complete" | "all">("missing");
  const [hasUserFilter, setHasUserFilter] = useState(false);
  const [contentProducts, setContentProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resolvedAdminMeta, setResolvedAdminMeta] = useState<any | null>(null);
  const [filterCategories, setFilterCategories] = useState<FilterCategoryOption[]>([]);
  const [filterBrands, setFilterBrands] = useState<FilterBrandOption[]>([]);
  const { t, language } = useLanguage();

  const mapProduct = (product: any) => {
    const nameEn =
      typeof product?.name === "object" ? product?.name?.en || "" : product?.name || "";
    const nameAr = product?.nameAr || (typeof product?.name === "object" ? product?.name?.ar || "" : "");
    const specs = Array.isArray(product?.specs) ? product.specs : [];
    const specsNormalized = specs.map((spec: any) => {
      let icon = "Smartphone";
      let iconImage = "";
      if (typeof spec.icon === "object" && spec.icon) {
        if (spec.icon.type === "url" && spec.icon.url) {
          iconImage = spec.icon.url;
        } else if (spec.icon.type === "react_icon" && spec.icon.key) {
          icon = spec.icon.key;
        }
      } else if (typeof spec.icon === "string") {
        icon = spec.icon;
      }
      return {
        icon,
        iconImage,
        nameEn: spec.nameEn || spec.title || "",
        nameAr: spec.nameAr || spec.titleAr || spec.title || "",
        valueEn: spec.valueEn || spec.value || "",
        valueAr: spec.valueAr || spec.value || "",
      };
    });

  const colors = Array.isArray(product?.colorVariants)
    ? product.colorVariants.map((color: any, index: number) => {
        const stkCode = String(color?.stk_code || color?.stkCode || color?.id || "");
        const colorKey = normalizeColorKey(stkCode || index);
        const rawImages = mergeImageSources(color?.images, color?.image);
        const imageEntries = rawImages.map((img: any, imgIndex: number) => ({
          id: resolveImageId(
            img,
            `color|${stkCode || colorKey}|${imgIndex}|${String(img || "").trim()}`,
          ),
          src: String(img || "").trim(),
          colorKey,
          source: "colorVariant",
        }));

        return {
          name: color?.name || color?.color_name || "",
          nameAr: color?.nameAr || color?.color_name_ar || color?.name || color?.color_name || "",
          code: color?.color_hex || color?.hexCode || color?.hex || "",
          image: imageEntries[0]?.src || "",
          images: imageEntries,
          stkCode,
          isHidden: color?.active === false,
          inStock: color?.in_stock !== false,
        };
      })
    : [];

    const whatsInBox = Array.isArray(product?.inTheBox)
      ? product.inTheBox.map((item: any, index: number) => ({
          id: item?.id || `box-${index}`,
          itemEn: item?.en || item?.nameEn || item?.valueEn || "",
          itemAr: item?.ar || item?.nameAr || item?.valueAr || "",
          quantity: Number(item?.quantity || item?.qty || 1),
        }))
      : [];
    const firstColorImage = colors.find((c: any) => Boolean(c?.image))?.image || "";
    const baseProductImages = mergeImageSources(product?.images, product?.image);
    const thumbnailImage = baseProductImages[0] || firstColorImage || "";
    const isAvailableFromColors = colors.length > 0 ? colors.some((color) => color.inStock) : null;
    const resolvedAvailable =
      isAvailableFromColors === null
        ? product?.availability?.isAvailable !== false
        : isAvailableFromColors;
    const normalizedGalleryImages =
      baseProductImages.length > 0
        ? baseProductImages
        : thumbnailImage
          ? [thumbnailImage]
          : [];

    const missing = product._missing || {};
    const validation = product._validation || {};
    const incompleteColorVariants = Array.isArray(validation?.variants?.colors?.incomplete)
      ? validation.variants.colors.incomplete
      : [];
    const incompleteChargeOptions = Array.isArray(validation?.variants?.charges?.incomplete)
      ? validation.variants.charges.incomplete
      : [];
    const requiredMissing = Boolean(product._hasMissing);

    return {
      id: String(product?._id || product?.id || product?.stk_code || ""),
      sku: String(product?.stk_code || product?.id || ""),
      nameEn,
      nameAr,
      brand: product?.brand || "",
      brandAr: product?.brandAr || "",
      category: product?.category || "",
      categoryAr: product?.categoryAr || "",
      brandCode: String(product?.brand_code || product?.brandCode || ""),
      categoryCode: String(product?.cat_code || product?.category_code || product?.catCode || ""),
      price: product?.price || "",
      syncedAt: product?.audit?.updatedAt || product?.updatedAt || "",
      syncSource: "MongoDB",
      hasMultipleColors: colors.length > 0,
      colors,
      existingContent: {
        thumbnail: thumbnailImage,
        descriptionEn: product?.description || "",
        descriptionAr: product?.descriptionAr || "",
        images: normalizedGalleryImages,
        specs: specsNormalized,
        whatsInBox,
      },
      missingFields: {
        productName: Boolean(missing.name),
        productDetails: Boolean(missing.description),
        productImage: Boolean(missing.image),
        incompleteColors: Number(missing.colorVariants || 0),
        incompleteCharges: Number(missing.chargeOptions || 0),
        galleryImages: Boolean(missing.galleryImages),
        specs: Boolean(missing.specs),
        category: Boolean(missing.category),
        brand: Boolean(missing.brand),
      },
      variantIssues: {
        colors: incompleteColorVariants,
        charges: incompleteChargeOptions,
      },
      requiredMissing,
      isHidden: Boolean(product?.status?.isHidden),
      hiddenReason: String(product?.availability?.hiddenReason || ""),
      isAvailable: resolvedAvailable,
      _raw: product,
    };
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    setLoadError(null);
    try {
      const hasAnyFilter =
        Boolean(searchQuery.trim()) ||
        Boolean(selectedCategoryFilter) ||
        Boolean(selectedBrandFilter) ||
        missingFilter !== "all";
      if (!hasUserFilter || !hasAnyFilter) {
        setContentProducts([]);
        setIsLoadingProducts(false);
        setLoadError(language === "ar" ? "اختر فلترًا أولاً" : "Select a filter first");
        return;
      }
      const headers: Record<string, string> = {};
      if (ADMIN_API_KEY) headers["x-admin-key"] = ADMIN_API_KEY;
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (missingFilter === "missing") params.set("missing", "1");
      if (missingFilter === "complete") params.set("missing", "0");
      if (selectedCategoryFilter) params.set("cat_code", selectedCategoryFilter);
      if (selectedBrandFilter) params.set("brand_code", selectedBrandFilter);
      const res = await fetch(`${API_BASE}/admin/products?${params.toString()}`, { headers });
      if (!res.ok) throw new Error("Failed to load products");
      const json = await res.json();
      const items = Array.isArray(json?.data) ? json.data : [];
      setContentProducts(items.map(mapProduct));
    } catch (err: any) {
      setLoadError(err?.message || "Failed to load products");
      setContentProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, missingFilter, selectedCategoryFilter, selectedBrandFilter, hasUserFilter, language]);

  useEffect(() => {
    if (adminMeta || resolvedAdminMeta) return;
    let mounted = true;
    try {
      const raw = localStorage.getItem("session");
      if (!raw) return;
      const session = JSON.parse(raw);
      const user = session?.user;
      if (!user || (user.role !== "admin" && user.role !== "super_admin")) return;
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
  }, [adminMeta, resolvedAdminMeta]);

  useEffect(() => {
    let mounted = true;

    const loadFilterOptions = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/static/categories.json"),
          fetch("/static/brands.json"),
        ]);

        const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : [];
        const brandsJson = brandsRes.ok ? await brandsRes.json() : [];
        if (!mounted) return;

        const normalizedCategories = (Array.isArray(categoriesJson) ? categoriesJson : [])
          .map((category: any) => ({
            id: String(category.cat_code || category._id || ""),
            nameEn: pickLocalizedStaticName(
              category.nameEn || category.name?.en || category.name || category.name_en || category.name_ar,
              "",
            ),
            nameAr: pickLocalizedStaticName(
              category.nameAr || category.name?.ar || category.name || category.name_ar || category.name_en,
              "",
            ),
          }))
          .filter((category) => category.id);

        const normalizedBrands = (Array.isArray(brandsJson) ? brandsJson : [])
          .map((brand: any) => ({
            id: String(brand.brand_code || brand._id || ""),
            nameEn: pickLocalizedStaticName(
              brand.englishName || brand.nameEn || brand.name?.en || brand.name || brand.name_en || brand.name_ar,
              "",
            ),
            nameAr: pickLocalizedStaticName(
              brand.nameAr || brand.name?.ar || brand.name || brand.name_ar || brand.name_en,
              "",
            ),
            categoryIds: Array.isArray(brand.categoryIds)
              ? brand.categoryIds.map(String)
              : Array.isArray(brand.cat_codes)
              ? brand.cat_codes.map(String)
              : [String(brand.category_code || brand.cat_code || brand.categoryCode || brand.catCode || "")].filter(Boolean),
          }))
          .filter((brand) => brand.id);

        setFilterCategories(normalizedCategories);
        setFilterBrands(normalizedBrands);
      } catch {
        if (!mounted) return;
        setFilterCategories([]);
        setFilterBrands([]);
      }
    };

    loadFilterOptions();

    return () => {
      mounted = false;
    };
  }, []);

  const saveProductUpdate = async (productId: string, update: any) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (ADMIN_API_KEY) headers["x-admin-key"] = ADMIN_API_KEY;
    const res = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(productId)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(update),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      const message = json?.message || "Failed to save product";
      const details = json?.details ? "Validation failed. Check required fields." : "";
      throw new Error(details ? `${message} - ${details}` : message);
    }
    const json = await res.json();
    return json?.data;
  };

  // Calculate completion percentage
  const calculateCompletion = (product: any) => {
    const checks = [
      !product?.missingFields?.productName,
      !product?.missingFields?.productDetails,
      !product?.missingFields?.productImage,
      !product?.missingFields?.galleryImages,
      !product?.missingFields?.specs,
      !product?.missingFields?.category,
      !product?.missingFields?.brand,
      Number(product?.missingFields?.incompleteColors || 0) === 0,
      Number(product?.missingFields?.incompleteCharges || 0) === 0,
    ];

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const toggleProductVisibility = async (product: any) => {
    const nextHiddenState = !Boolean(product?.isHidden);
    const reason = nextHiddenState
      ? product?.hiddenReason || "Hidden from Store Management"
      : "";

    try {
      const saved = await saveProductUpdate(product.id, {
        status: {
          isHidden: nextHiddenState,
          isActive: product?._raw?.status?.isActive ?? true,
        },
        availability: {
          hiddenReason: reason,
        },
      });
      const mapped = mapProduct(saved);
      setContentProducts((prev) =>
        prev.map((item) => (item.id === product.id ? mapped : item)),
      );
      if (selectedProduct?.id === product.id) {
        setSelectedProduct(mapped);
      }
      alert(nextHiddenState ? t("admin.content.productHidden") : t("admin.content.productVisible"));
    } catch (err: any) {
      alert(err?.message || "Failed to update product visibility");
    }
  };

  const meta = adminMeta || resolvedAdminMeta || {};
  const allowAllCategories = Boolean(meta?.allowAllCategories);
  const allowAllBrands = Boolean(meta?.allowAllBrands);
  const allowedCategoryIds = Array.isArray(meta?.allowedCategoryIds)
    ? meta.allowedCategoryIds.map(String)
    : [];
  const allowedBrandIds = Array.isArray(meta?.allowedBrandIds)
    ? meta.allowedBrandIds.map(String)
    : [];
  const hasCategoryRules = allowedCategoryIds.length > 0 || allowAllCategories;
  const hasBrandRules = allowedBrandIds.length > 0 || allowAllBrands;

  const availableCategoryFilters = useMemo(() => {
    const allowedBrandCategoryIds = new Set(
      filterBrands
        .filter((brand) => allowAllBrands || (allowedBrandIds.length > 0 && allowedBrandIds.includes(brand.id)))
        .flatMap((brand) => brand.categoryIds),
    );

    return filterCategories.filter((category) => {
      if (allowAllCategories) return true;
      if (allowedCategoryIds.length > 0) return allowedCategoryIds.includes(category.id);
      if (hasBrandRules) return allowedBrandCategoryIds.has(category.id);
      return false;
    });
  }, [allowAllCategories, allowedCategoryIds, allowAllBrands, allowedBrandIds, filterCategories, filterBrands, hasBrandRules]);

  const availableBrandFilters = useMemo(() => {
    return filterBrands.filter((brand) => {
      const brandAllowed =
        allowAllBrands ||
        (allowedBrandIds.length > 0 && allowedBrandIds.includes(brand.id)) ||
        (!hasBrandRules &&
          (allowAllCategories || brand.categoryIds.some((categoryId) => allowedCategoryIds.includes(categoryId))));
      if (!brandAllowed) return false;
      if (!selectedCategoryFilter) return true;
      return brand.categoryIds.includes(selectedCategoryFilter);
    });
  }, [allowAllBrands, allowedBrandIds, filterBrands, selectedCategoryFilter, hasBrandRules, allowAllCategories, allowedCategoryIds]);

  const normalizeKey = (value: any) =>
    String(value || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

  const categoryIdByName = useMemo(() => {
    const map = new Map<string, string>();
    filterCategories.forEach((category) => {
      if (category.nameEn) map.set(normalizeKey(category.nameEn), category.id);
      if (category.nameAr) map.set(normalizeKey(category.nameAr), category.id);
    });
    return map;
  }, [filterCategories]);

  const brandIdByName = useMemo(() => {
    const map = new Map<string, string>();
    filterBrands.forEach((brand) => {
      if (brand.nameEn) map.set(normalizeKey(brand.nameEn), brand.id);
      if (brand.nameAr) map.set(normalizeKey(brand.nameAr), brand.id);
    });
    return map;
  }, [filterBrands]);

  useEffect(() => {
    if (selectedCategoryFilter && !availableCategoryFilters.some((category) => category.id === selectedCategoryFilter)) {
      setSelectedCategoryFilter("");
    }
  }, [availableCategoryFilters, selectedCategoryFilter]);

  useEffect(() => {
    if (selectedBrandFilter && !availableBrandFilters.some((brand) => brand.id === selectedBrandFilter)) {
      setSelectedBrandFilter("");
    }
  }, [availableBrandFilters, selectedBrandFilter]);

  const filteredProducts = contentProducts.filter((product) => {
    const inferredCategoryCode =
      product.categoryCode ||
      categoryIdByName.get(normalizeKey(product.category)) ||
      categoryIdByName.get(normalizeKey(product.categoryAr));
    const inferredBrandCode =
      product.brandCode ||
      brandIdByName.get(normalizeKey(product.brand)) ||
      brandIdByName.get(normalizeKey(product.brandAr));

    const categoryAllowed =
      allowAllCategories ||
      (allowedCategoryIds.length > 0 && inferredCategoryCode && allowedCategoryIds.includes(inferredCategoryCode));
    const brandAllowed =
      allowAllBrands ||
      (allowedBrandIds.length > 0 && inferredBrandCode && allowedBrandIds.includes(inferredBrandCode));

    const brandMissing = !inferredBrandCode;

    const hasCategoryRules = allowedCategoryIds.length > 0 || allowAllCategories;
    const hasBrandRules = allowedBrandIds.length > 0 || allowAllBrands;
    const permissionPass =
      (brandMissing && categoryAllowed) ||
      (hasCategoryRules && hasBrandRules && categoryAllowed && brandAllowed) ||
      (hasCategoryRules && !hasBrandRules && categoryAllowed) ||
      (!hasCategoryRules && hasBrandRules && brandAllowed);

    if (!permissionPass) return false;

    const matchesScope =
      missingFilter === "all"
        ? true
        : missingFilter === "complete"
          ? !product.requiredMissing
          : product.requiredMissing;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      product.sku.toLowerCase().includes(q) ||
      product.nameEn.toLowerCase().includes(q) ||
      product.nameAr.toLowerCase().includes(q);
    return matchesScope && matchesSearch;
  });

  const sortedProducts = filteredProducts
    .slice()
    .sort((a, b) => (a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white ">
       {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                 {t('admin.content.title')}
            </h1>
            {/* <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button> */}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
       
        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-4 mt-6 mb-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-orange-900 mb-1">{t('admin.content.warning')}</h3>
            <p className="text-sm text-orange-700">{t('admin.content.warningMessage')}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 ">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.content.search')}
                value={searchQuery}
                onChange={(e) => {
                  setHasUserFilter(true);
                  setSearchQuery(e.target.value);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => {
                  setHasUserFilter(true);
                  setSelectedCategoryFilter(e.target.value);
                }}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] bg-white cursor-pointer"
              >
                <option value="">{language === "ar" ? "كل الفئات" : "All Categories"}</option>
                {availableCategoryFilters.map((category) => (
                  <option key={category.id} value={category.id}>
                    {language === "ar"
                      ? category.nameAr || category.nameEn || category.id
                      : category.nameEn || category.nameAr || category.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Brand Filter */}
            <div className="relative">
              <select
                value={selectedBrandFilter}
                onChange={(e) => {
                  setHasUserFilter(true);
                  setSelectedBrandFilter(e.target.value);
                }}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] bg-white cursor-pointer"
              >
                <option value="">{language === "ar" ? "كل العلامات التجارية" : "All Brands"}</option>
                {availableBrandFilters.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {language === "ar"
                      ? brand.nameAr || brand.nameEn || brand.id
                      : brand.nameEn || brand.nameAr || brand.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Missing Filter */}
            <div className="relative">
              <select
                value={missingFilter}
                onChange={(e) => {
                  setHasUserFilter(true);
                  setMissingFilter(e.target.value as "missing" | "complete" | "all");
                }}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] bg-white cursor-pointer"
              >
                <option value="missing">{language === "ar" ? "بيانات ناقصة" : "Missing Data"}</option>
                <option value="complete">{language === "ar" ? "بيانات مكتملة" : "Complete Data"}</option>
                <option value="all">{language === "ar" ? "الكل" : "All Products"}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`content-skeleton-${idx}`} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-xl mb-4" />
                <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-100 rounded mb-4 w-1/2" />
                <div className="h-9 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="text-center py-10 text-gray-500">
            {loadError}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => {
            const completionPercentage = calculateCompletion(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  <img
                    src={product.existingContent.thumbnail}
                    alt={product.sku}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Progress Badge */}
                  <div
                    className={`absolute top-4 ${
                      language === "ar" ? "left-4" : "right-4"
                    } px-3 py-1 rounded-full ${getProgressColor(completionPercentage)} font-bold text-sm`}
                  >
                      {completionPercentage}%
                  </div>
                  {product.isHidden && (
                    <div
                      className={`absolute top-4 ${
                        language === "ar" ? "right-4" : "left-4"
                      } px-3 py-1 rounded-full bg-gray-800 text-white font-bold text-xs shadow-lg flex items-center gap-1`}
                    >
                      <EyeOff className="w-3 h-3" />
                      {t("admin.content.hidden")}
                    </div>
                  )}
                  {!product.isAvailable && (
                    <div
                      className={`absolute top-4 ${
                        language === "ar" ? "left-4" : "right-4"
                      } px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs shadow-lg flex items-center gap-1`}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {language === "ar" ? "غير متوفر" : "Unavailable"}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* SKU & Sync Info */}
                  <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">
                      {t('admin.content.sku')}: <span className="font-mono font-bold">{product.sku}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {t('admin.content.syncedAt')}: {product.syncedAt}
                    </div>
                  </div>

                  {/* Product Names */}
                  {product.nameEn && product.nameAr ? (
                    <>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {language === "ar" ? product.nameAr : product.nameEn}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === "ar" ? product.nameEn : product.nameAr}
                      </p>
                    </>
                  ) : (
                    <div className="mb-3">
                      <div className="h-6 bg-red-100 rounded animate-pulse mb-2"></div>
                        <p className="text-sm text-red-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {t('admin.content.productName')}
                      </p>
                    </div>
                  )}

                  {/* Colors Badge */}
                  {product.hasMultipleColors && (
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-600 font-bold">
                        {product.colors.length} {t('admin.content.hasColors')}
                      </span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressBarColor(completionPercentage)} transition-all duration-500`}
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Missing Fields Summary */}
                  <div className="mb-4 space-y-2 min-h-[100px]">
                    {product.missingFields.productName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{t('admin.content.productName')}</span>
                      </div>
                    )}
                    {product.missingFields.productDetails && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{t('admin.content.productDetails')}</span>
                      </div>
                    )}
                    {product.missingFields.productImage && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{t('admin.content.productImage')}</span>
                      </div>
                    )}
                    {product.missingFields.incompleteColors > 0 && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>
                          {product.missingFields.incompleteColors} {t('admin.content.colorImages')}
                          {product.variantIssues.colors.length > 0 && (
                            <span className="block text-xs text-gray-500">
                              {product.variantIssues.colors
                                .slice(0, 3)
                                .map((variant: any) => language === "ar" ? variant.labelAr || variant.label : variant.label || variant.labelAr)
                                .join(", ")}
                              {product.variantIssues.colors.length > 3 ? "..." : ""}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {product.missingFields.incompleteCharges > 0 && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>
                          {product.missingFields.incompleteCharges} {t('chargeOptions')}
                          {product.variantIssues.charges.length > 0 && (
                            <span className="block text-xs text-gray-500">
                              {product.variantIssues.charges
                                .slice(0, 3)
                                .map((variant: any) => language === "ar" ? variant.labelAr || variant.label : variant.label || variant.labelAr)
                                .join(", ")}
                              {product.variantIssues.charges.length > 3 ? "..." : ""}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {product.missingFields.galleryImages && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{t('admin.content.galleryImages')}</span>
                      </div>
                    )}
                    {product.missingFields.specs && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{t('admin.content.specs')}</span>
                      </div>
                    )}
                    {product.missingFields.category && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{t('admin.content.category')}</span>
                      </div>
                    )}
                    {product.missingFields.brand && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{t('admin.content.brand')}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      {t("admin.content.editContent")}
                    </button>
                    <button
                      onClick={() => toggleProductVisibility(product)}
                      className={`w-full py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                        product.isHidden
                          ? "bg-gray-900 text-white border-gray-900 hover:bg-black"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {product.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {product.isHidden ? t("admin.content.showProduct") : t("admin.content.hideProduct")}
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
        {!isLoadingProducts && !loadError && filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {t("admin.content.noMatchingResults")}
          </div>
        )}
      </div>

      {/* Product Editor Modal */}
      {selectedProduct && (
        <ProductContentEditor
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={async (updatedProduct) => {
            try {
              const saved = await saveProductUpdate(updatedProduct.id, updatedProduct.updatePayload);
              setSelectedProduct(null);
              setContentProducts((prev) =>
                prev.map((item) => (item.id === updatedProduct.id ? mapProduct(saved) : item)),
              );
              fetchProducts();
            } catch (err: any) {
              alert(err?.message || "Failed to save product");
            }
          }}
        />
      )}
    </div>
  );
}

// Product Content Editor Modal Component
interface ProductContentEditorProps {
  product: any;
  onClose: () => void;
  onSave: (updatedProduct: { id: string; updatePayload: any }) => void;
}

function ProductContentEditor({ product, onClose, onSave }: ProductContentEditorProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "colors" | "gallery" | "specs" | "whatsInBox" | "category">("basic");
  
  // Basic Info State
  const [nameEn, setNameEn] = useState(product.nameEn || "");
  const [nameAr, setNameAr] = useState(product.nameAr || "");
  const [descriptionEn, setDescriptionEn] = useState(product.existingContent.descriptionEn || "");
  const [descriptionAr, setDescriptionAr] = useState(product.existingContent.descriptionAr || "");
  
  // Colors State
  const [colors, setColors] = useState(product.colors || []);
  
  // Gallery State
  const [unifiedImages, setUnifiedImages] = useState<UnifiedImage[]>(() =>
    buildUnifiedImagesForEditor(
      product,
      product.existingContent.images || [],
      product.colors || [],
    ),
  );
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string>("");

  useEffect(() => {
    setRemovedImageIds([]);
    setUnifiedImages(
      buildUnifiedImagesForEditor(
        product,
        product.existingContent.images || [],
        product.colors || [],
      ),
    );
    setEditingImageId(null);
    setEditingImageUrl("");
  }, [product.id]);
  
  // Specs State
  const [specs, setSpecs] = useState(product.existingContent.specs || []);
  const [specSearchQuery, setSpecSearchQuery] = useState("");
  const [showSpecSuggestions, setShowSpecSuggestions] = useState(false);
  const [showSpecNameSuggestions, setShowSpecNameSuggestions] = useState<number | null>(null);
  const [specNameSearch, setSpecNameSearch] = useState<{[key: number]: string}>({});
  const [customSpecIcons, setCustomSpecIcons] = useState(() => savedSpecTitlesManager.getCustomIcons());
  
  // What's in the Box State
  const [whatsInBox, setWhatsInBox] = useState<Array<{id: string, itemEn: string, itemAr: string, quantity: number}>>(
    product.existingContent.whatsInBox || []
  );
  
  // Category & Brand State
  const [editorCategories, setEditorCategories] = useState<FilterCategoryOption[]>([]);
  const [editorBrands, setEditorBrands] = useState<FilterBrandOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(product.categoryCode || "");
  const [selectedBrand, setSelectedBrand] = useState(product.brandCode || "");
  
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);

  const { t, language } = useLanguage();
  const editorPreviewImages = useMemo(() => {
    const imageSet = new Set<string>();
    const pushImage = (value: any) => {
      const image = String(value || "").trim();
      if (image) imageSet.add(image);
    };

    pushImage(product?.existingContent?.thumbnail);
    unifiedImages
      .filter((img) => !removedImageIds.includes(img.id))
      .forEach((img) => pushImage(img.src));

    return Array.from(imageSet);
  }, [product, unifiedImages, removedImageIds]);
  const selectedCategoryOption = useMemo(
    () => editorCategories.find((category) => category.id === selectedCategory) || null,
    [editorCategories, selectedCategory],
  );
  const availableEditorBrands = useMemo(
    () => editorBrands.filter((brand) => !selectedCategory || brand.categoryIds.includes(selectedCategory)),
    [editorBrands, selectedCategory],
  );
  const selectedBrandOption = useMemo(
    () => availableEditorBrands.find((brand) => brand.id === selectedBrand) || null,
    [availableEditorBrands, selectedBrand],
  );
  const hasManyColors = Array.isArray(colors) && colors.length > 0;
  const needsCategoryBrand = !["00"].includes(selectedCategory);
  const selectedCategoryLabel =
    (language === "ar"
      ? selectedCategoryOption?.nameAr || selectedCategoryOption?.nameEn
      : selectedCategoryOption?.nameEn || selectedCategoryOption?.nameAr) || "";
  const brandName =
    (language === "ar"
      ? selectedBrandOption?.nameAr || selectedBrandOption?.nameEn
      : selectedBrandOption?.nameEn || selectedBrandOption?.nameAr) || "";

  useEffect(() => {
    let mounted = true;

    const loadStaticOptions = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/static/categories.json"),
          fetch("/static/brands.json"),
        ]);
        const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : [];
        const brandsJson = brandsRes.ok ? await brandsRes.json() : [];
        if (!mounted) return;

        const normalizedCategories = (Array.isArray(categoriesJson) ? categoriesJson : [])
          .map((category: any) => ({
            id: String(category.cat_code || category._id || ""),
            nameEn: pickLocalizedStaticName(
              category.nameEn || category.name?.en || category.name || category.name_en || category.name_ar,
              "",
            ),
            nameAr: pickLocalizedStaticName(
              category.nameAr || category.name?.ar || category.name || category.name_ar || category.name_en,
              "",
            ),
          }))
          .filter((category) => category.id);

        const normalizedBrands = (Array.isArray(brandsJson) ? brandsJson : [])
          .map((brand: any) => ({
            id: String(brand.brand_code || brand._id || ""),
            nameEn: pickLocalizedStaticName(
              brand.englishName || brand.nameEn || brand.name?.en || brand.name || brand.name_en || brand.name_ar,
              "",
            ),
            nameAr: pickLocalizedStaticName(
              brand.nameAr || brand.name?.ar || brand.name || brand.name_ar || brand.name_en,
              "",
            ),
            categoryIds: Array.isArray(brand.categoryIds)
              ? brand.categoryIds.map(String)
              : [String(brand.category_code || brand.cat_code || "")].filter(Boolean),
          }))
          .filter((brand) => brand.id);

        setEditorCategories(normalizedCategories);
        setEditorBrands(normalizedBrands);

        const currentCategoryCode = String(product.categoryCode || "").trim();
        const currentCategoryName = String(product.category || "").trim().toLowerCase();
        const matchedCategory = normalizedCategories.find(
          (category) =>
            category.id === currentCategoryCode ||
            category.nameEn.toLowerCase() === currentCategoryName ||
            category.nameAr.toLowerCase() === currentCategoryName,
        );
        setSelectedCategory(matchedCategory?.id || currentCategoryCode || "");

        const currentBrandCode = String(product.brandCode || "").trim();
        const currentBrandName = String(product.brand || "").trim().toLowerCase();
        const matchedBrand = normalizedBrands.find(
          (brand) =>
            brand.id === currentBrandCode ||
            brand.nameEn.toLowerCase() === currentBrandName ||
            brand.nameAr.toLowerCase() === currentBrandName,
        );
        setSelectedBrand(matchedBrand?.id || currentBrandCode || "");
      } catch {
        if (!mounted) return;
        setEditorCategories([]);
        setEditorBrands([]);
      }
    };

    loadStaticOptions();

    return () => {
      mounted = false;
    };
  }, [product]);

  useEffect(() => {
    if (hasManyColors && activeTab === "gallery") {
      setActiveTab("colors");
    }
  }, [activeTab, hasManyColors]);

  useEffect(() => {
    savedSpecTitlesManager.initialize().then(() => {
      setCustomSpecIcons(savedSpecTitlesManager.getCustomIcons());
    });
    const unsubscribe = savedSpecTitlesManager.subscribe(() => {
      setCustomSpecIcons(savedSpecTitlesManager.getCustomIcons());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectedBrand && !availableEditorBrands.some((brand) => brand.id === selectedBrand)) {
      setSelectedBrand("");
    }
  }, [availableEditorBrands, selectedBrand]);

  const addNewSpec = () => {
    if (specs.length >= CONTENT_REQUIREMENTS.maxSpecs) {
      alert(language === "ar" ? `الحد الأقصى ${CONTENT_REQUIREMENTS.maxSpecs} مواصفات` : `Maximum ${CONTENT_REQUIREMENTS.maxSpecs} specs`);
      return;
    }
    setSpecs([...specs, { icon: "Smartphone", iconImage: "", nameEn: "", nameAr: "", valueEn: "", valueAr: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpecIcon = (index: number, iconName: string) => {
    const newSpecs = [...specs];
    newSpecs[index].icon = iconName;
    newSpecs[index].iconImage = ""; // Clear image if switching to icon
    setSpecs(newSpecs);
    setShowIconPicker(null);
  };

  const updateSpecIconImage = (index: number, imageUrl: string) => {
    const newSpecs = [...specs];
    newSpecs[index].iconImage = imageUrl;
    newSpecs[index].icon = ""; // Clear icon if using image
    setSpecs(newSpecs);
    if (imageUrl) {
      setCustomSpecIcons(savedSpecTitlesManager.getCustomIcons());
    }
  };

  const handleIconImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result as string;
      await savedSpecTitlesManager.addCustomIcon(imageUrl);
      updateSpecIconImage(index, imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const addBoxItem = () => {
    setWhatsInBox([...whatsInBox, { id: `box-${Date.now()}`, itemEn: "", itemAr: "", quantity: 1 }]);
  };

  const removeBoxItem = (id: string) => {
    setWhatsInBox(whatsInBox.filter(item => item.id !== id));
  };

  const updateBoxItem = (id: string, field: string, value: any) => {
    setWhatsInBox(whatsInBox.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getColorKey = (color: any, fallbackIndex: number) =>
    String(color?.stkCode || color?.stk_code || fallbackIndex);

  const updateColorImage = (key: string, imageId: string | null, imageUrl: string) => {
    setColors((prev) =>
      prev.map((color: any, idx: number) => {
        if (getColorKey(color, idx) !== key) return color;
        const currentImages = Array.isArray(color.images) ? color.images : [];
        if (!imageUrl) {
          return { ...color, image: "", images: [] };
        }
        if (imageId) {
          const updatedImages = currentImages.map((img: any) =>
            img.id === imageId ? { ...img, src: imageUrl } : img,
          );
          const nextPrimary = updatedImages[0]?.src || imageUrl;
          return { ...color, image: nextPrimary, images: updatedImages };
        }
        const nextImage = {
          id: createImageId(`color|${key}|${Date.now()}|${imageUrl}`),
          src: imageUrl,
          colorKey: normalizeColorKey(key),
          source: "colorVariant",
        };
        const updatedImages = [...currentImages, nextImage];
        return { ...color, image: updatedImages[0]?.src || imageUrl, images: updatedImages };
      }),
    );
    setUnifiedImages((prev) => {
      const colorKey = normalizeColorKey(key);
      const existingIndex = prev.findIndex(
        (img) => img.id === imageId || (img.colorKey === colorKey && img.source === "colorVariant"),
      );
      if (!imageUrl) {
        if (existingIndex === -1) return prev;
        return prev.filter((img) => !(img.colorKey === colorKey && img.source === "colorVariant"));
      }
      if (existingIndex === -1) {
        const nextImage: UnifiedImage = {
          id: createImageId(`color|${colorKey}|${Date.now()}|${imageUrl}`),
          src: imageUrl,
          colorKey,
          source: "colorVariant",
        };
        return [...prev, nextImage];
      }
      return prev.map((img, idx) =>
        idx === existingIndex ? { ...img, src: imageUrl } : img,
      );
    });
  };

  const handleColorImageUpload = (key: string, file: File | null, imageId: string | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateColorImage(key, imageId, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleColorVisibility = (key: string) => {
    setColors((prev) =>
      prev.map((color: any, idx: number) =>
        getColorKey(color, idx) === key
          ? { ...color, isHidden: !Boolean(color.isHidden) }
          : color,
      ),
    );
  };

  const activeGalleryImages = useMemo(
    () => unifiedImages.filter((img) => !removedImageIds.includes(img.id)),
    [unifiedImages, removedImageIds],
  );
  const pendingGalleryImages = useMemo(
    () => unifiedImages.filter((img) => removedImageIds.includes(img.id)),
    [unifiedImages, removedImageIds],
  );

  const markImageForRemoval = (id: string) => {
    setRemovedImageIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const undoImageRemoval = (id: string) => {
    setRemovedImageIds((prev) => prev.filter((item) => item !== id));
  };

  const updateUnifiedImage = (id: string, newUrl: string) => {
    setUnifiedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, src: newUrl } : img)),
    );
  };

  const addUnifiedImage = (newUrl: string) => {
    setUnifiedImages((prev) => [
      ...prev,
      {
        id: createImageId(`gallery|${Date.now()}|${newUrl}`),
        src: newUrl,
        source: "gallery",
      },
    ]);
  };

  const openEditImage = (entry: UnifiedImage) => {
    setEditingImageId(entry.id);
    setEditingImageUrl(entry.src);
  };

  const closeEditImage = () => {
    setEditingImageId(null);
    setEditingImageUrl("");
  };

  const handleSave = async () => {
    await Promise.all(
      specs.map((spec: any) => {
        if (spec.nameEn && spec.nameAr) {
          return savedSpecTitlesManager.addOrUpdateTitle(spec.nameEn, spec.nameAr, spec.icon, spec.iconImage);
        }
        return Promise.resolve(null);
      }),
    );

    const finalUnifiedImages = activeGalleryImages.filter((img) =>
      Boolean(String(img.src || "").trim()),
    );
    const serializedImages = serializeUnifiedImages(finalUnifiedImages);

    const formattedSpecs = specs.map((spec: any) => ({
      icon: spec.icon || "Smartphone",
      iconImage: spec.iconImage || "",
      title: spec.nameEn || "",
      titleAr: spec.nameAr || "",
      value: spec.valueEn || "",
      valueAr: spec.valueAr || "",
    }));

    const formattedColors = colors.map((color: any) => ({
      stk_code: color?.stkCode || "",
      active: !color?.isHidden,
      images: color?.isHidden
        ? []
        : Array.isArray(color?.images)
        ? color.images.map((img: any) => String(img?.src || "").trim()).filter(Boolean)
        : color?.image
        ? [color.image]
        : [],
    }));

    const formattedBox = whatsInBox.map((item: any) => ({
      nameEn: item.itemEn || "",
      nameAr: item.itemAr || "",
      valueEn: String(item.quantity ?? 1),
      valueAr: String(item.quantity ?? 1),
    }));

    const updatePayload = {
      name: nameEn,
      nameAr,
      description: descriptionEn,
      descriptionAr,
      image: pickPrimaryImage(finalUnifiedImages),
      images: serializedImages,
      specs: formattedSpecs,
      inTheBox: formattedBox,
      category: selectedCategoryOption?.nameEn || "",
      categoryAr: selectedCategoryOption?.nameAr || "",
      cat_code: selectedCategory,
      brand: selectedBrandOption?.nameEn || "",
      brandAr: selectedBrandOption?.nameAr || "",
      brand_code: selectedBrand,
      colorVariants: formattedColors,
    };

    onSave({ id: product.id, updatePayload });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-8 flex flex-col max-h-[90vh] overflow-y-auto isolate">
        <div className="sticky top-0 z-[100] bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{t('admin.content.editProduct')}</h2>
                <p className="text-blue-100">{product.sku}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Synced Data Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-sm">
              <div className="font-bold mb-2">{t('admin.content.syncInfo')}</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-blue-200">{t('admin.content.sku')}:</span>
                  <span className="font-mono ml-2">{product.sku}</span>
                </div>
                <div>
                  <span className="text-blue-200">{t('admin.content.price')}:</span>
                  <span className="ml-2">{product.price} $</span>
                </div>
                <div>
                  <span className="text-blue-200">{t('admin.content.syncSource')}:</span>
                  <span className="ml-2">{product.syncSource}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto shadow-sm relative z-[100]">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex-shrink-0 px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                activeTab === "basic"
                  ? "text-[#009FE3] bg-blue-50 border-b-2 border-[#009FE3]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              {t('admin.content.tabBasic')}
              {(!nameEn || !nameAr || descriptionEn.length < CONTENT_REQUIREMENTS.description.min) && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </button>

            {product.hasMultipleColors && (
              <button
                onClick={() => setActiveTab("colors")}
                className={`flex-shrink-0 px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                  activeTab === "colors"
                    ? "text-[#009FE3] bg-blue-50 border-b-2 border-[#009FE3]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Palette className="w-4 h-4" />
                {t('admin.content.tabColors')}
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {colors.filter((c: any) => c.image).length}/{colors.length}
                </span>
              </button>
            )}

            {!hasManyColors && (
              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex-shrink-0 px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                  activeTab === "gallery"
                    ? "text-[#009FE3] bg-blue-50 border-b-2 border-[#009FE3]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                {t('admin.content.tabGallery')}
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {activeGalleryImages.length}/{CONTENT_REQUIREMENTS.maxImages}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("specs")}
              className={`flex-shrink-0 px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                activeTab === "specs"
                  ? "text-[#009FE3] bg-blue-50 border-b-2 border-[#009FE3]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              {t('admin.content.tabSpecs')}
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                {specs.length}/{CONTENT_REQUIREMENTS.maxSpecs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("whatsInBox")}
              className={`flex-shrink-0 px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                activeTab === "whatsInBox"
                  ? "text-[#009FE3] bg-blue-50 border-b-2 border-[#009FE3]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4" />
              {t('admin.content.tabWhatsInBox')}
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                {whatsInBox.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("category")}
              className={`flex-shrink-0 px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                activeTab === "category"
                  ? "text-[#009FE3] bg-blue-50 border-b-2 border-[#009FE3]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Tag className="w-4 h-4" />
              {t('admin.content.tabCategory')}
              {needsCategoryBrand && (!selectedCategory || !brandName) && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 relative z-0">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Product Name */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-900">
                    {t('admin.content.productNameEn')} & {t('admin.content.productNameAr')}
                    <span className="text-red-600 ml-1">({t('admin.content.required')})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t('admin.content.productNameEn')}
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                      placeholder={t("admin.content.productNamePlaceholderEn")}
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t('admin.content.productNameAr')}
                    </label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      dir="rtl"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                      placeholder={t("admin.content.productNamePlaceholderAr")}
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-700">
                    {t('admin.content.descriptionEn')}
                    <span className="text-red-600 ml-1">({t('admin.content.required')})</span>
                  </label>
                  <div className={`text-sm font-bold ${
                    descriptionEn.length < CONTENT_REQUIREMENTS.description.min
                      ? "text-red-600"
                      : "text-green-600"
                  }`}>
                    {descriptionEn.length} / {CONTENT_REQUIREMENTS.description.max} {t('admin.content.charCount')}
                    <span className="text-gray-500 ml-2">
                      ({t('admin.content.minRequired')}: {CONTENT_REQUIREMENTS.description.min})
                    </span>
                  </div>
                </div>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => {
                    if (e.target.value.length <= CONTENT_REQUIREMENTS.description.max) {
                      setDescriptionEn(e.target.value);
                    }
                  }}
                  rows={5}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 resize-none ${
                    descriptionEn.length < CONTENT_REQUIREMENTS.description.min
                      ? "border-red-300 focus:ring-red-500"
                      : "border-green-300 focus:ring-green-500"
                  }`}
                  placeholder={t("admin.content.descriptionPlaceholderEn")}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-700">
                    {t('admin.content.descriptionAr')}
                    <span className="text-red-600 ml-1">({t('admin.content.required')})</span>
                  </label>
                  <div className={`text-sm font-bold ${
                    descriptionAr.length < CONTENT_REQUIREMENTS.description.min
                      ? "text-red-600"
                      : "text-green-600"
                  }`}>
                    {descriptionAr.length} / {CONTENT_REQUIREMENTS.description.max} {t('admin.content.charCount')}
                    <span className="text-gray-500 ml-2">
                      ({t('admin.content.minRequired')}: {CONTENT_REQUIREMENTS.description.min})
                    </span>
                  </div>
                </div>
                <textarea
                  value={descriptionAr}
                  onChange={(e) => {
                    if (e.target.value.length <= CONTENT_REQUIREMENTS.description.max) {
                      setDescriptionAr(e.target.value);
                    }
                  }}
                  rows={5}
                  dir="rtl"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 resize-none ${
                    descriptionAr.length < CONTENT_REQUIREMENTS.description.min
                      ? "border-red-300 focus:ring-red-500"
                      : "border-green-300 focus:ring-green-500"
                  }`}
                  placeholder={t("admin.content.descriptionPlaceholderAr")}
                />
              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === "colors" && (
            <div className="space-y-6 animate-fadeIn">
              {product.hasMultipleColors ? (
                <>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
                    <Palette className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-purple-900 mb-1">{t('admin.content.uploadColorImage')}</h4>
                      <p className="text-sm text-purple-700">{t('admin.content.imageGuidelines')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colors.map((color: any, index: number) => {
                      const colorKey = getColorKey(color, index);
                      return (
                      <div key={colorKey} className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#009FE3] transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.code }}
                          ></div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {language === "ar" ? color.nameAr : color.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {language === "ar" ? color.name : color.nameAr}
                            </div>
                            {color.stkCode && (
                              <div className="mt-1 text-xs font-mono text-gray-500">
                                stk_code: {color.stkCode}
                              </div>
                            )}
                            <div className={`mt-1 text-xs font-semibold ${color.inStock ? "text-green-600" : "text-red-600"}`}>
                              {color.inStock
                                ? (language === "ar" ? "متوفر" : "In stock")
                                : (language === "ar" ? "غير متوفر" : "Out of stock")}
                            </div>
                            <div className={`mt-1 text-xs font-semibold ${color.isHidden ? "text-red-600" : "text-green-600"}`}>
                              {color.isHidden
                                ? (language === "ar" ? "مخفي من الموقع" : "Hidden from website")
                                : (language === "ar" ? "ظاهر في الموقع" : "Visible on website")}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleColorVisibility(colorKey)}
                          className={`mb-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                            color.isHidden
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {color.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          {color.isHidden
                            ? (language === "ar" ? "إظهار اللون في الموقع" : "Show color on website")
                            : (language === "ar" ? "إخفاء اللون من الموقع" : "Hide color from website")}
                        </button>

                        {color.images?.[0]?.src ? (
                          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                            <img src={color.images[0].src} alt={color.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="flex items-center gap-2">
                                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-700 text-xs font-semibold cursor-pointer hover:bg-gray-100">
                                  <Upload className="w-4 h-4" />
                                  {language === "ar" ? "تغيير الصورة" : "Change"}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleColorImageUpload(
                                        colorKey,
                                        e.target.files?.[0] || null,
                                        color.images?.[0]?.id || null,
                                      )
                                    }
                                  />
                                </label>
                                <button
                                  onClick={() =>
                                    updateColorImage(
                                      colorKey,
                                      color.images?.[0]?.id || null,
                                      "",
                                    )
                                  }
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#009FE3] transition-all cursor-pointer group block">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-[#009FE3] transition-colors" />
                            <p className="text-sm text-gray-600">{t('admin.content.uploadColorImage')}</p>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleColorImageUpload(
                                  colorKey,
                                  e.target.files?.[0] || null,
                                  null,
                                )
                              }
                            />
                          </label>
                        )}
                      </div>
                    )})}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t('admin.content.noColorsMessage')}</p>
                </div>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {!hasManyColors && activeTab === "gallery" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-1">{t('admin.content.productGallery')}</h4>
                  <p className="text-sm text-blue-700">{t('admin.content.imageGuidelines')}</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {t('admin.content.minRequired')}: {CONTENT_REQUIREMENTS.minImages} | {t('admin.content.maxAllowed')}: {CONTENT_REQUIREMENTS.maxImages}
                  </p>
                </div>
              </div>

              {editorPreviewImages.length > 0 && (
                <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <h5 className="font-bold text-gray-900">
                      {language === "ar" ? "معاينة صور المنتج" : "Product image preview"}
                    </h5>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="h-44 w-full overflow-hidden rounded-2xl bg-gray-50 md:w-52">
                      <img
                        src={editorPreviewImages[0]}
                        alt={product.sku}
                        className="h-full w-full object-contain p-3"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editorPreviewImages.slice(0, 6).map((image, index) => (
                        <div
                          key={`${product.id}-preview-${index}`}
                          className="h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-white"
                        >
                          <img
                            src={image}
                            alt={`${product.sku}-${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Gallery Images */}
              {activeGalleryImages.length > 0 && (
                <div>
                  <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    {t('admin.content.existingImages')} ({activeGalleryImages.length}/{CONTENT_REQUIREMENTS.maxImages})
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeGalleryImages.map((entry: UnifiedImage, i: number) => (
                      <div key={`gallery-${entry.id}`} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group border-2 border-green-200">
                        <img 
                          src={entry.src} 
                          alt={`Gallery ${i + 1}`} 
                          className="w-full h-full object-cover"
                          onClick={() => setPreviewImage(entry.src)}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext y='50' font-size='12' fill='%23999' text-anchor='middle' dy='.3em'%3EImage Error%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => setPreviewImage(entry.src)}
                            className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            title={language === "ar" ? "معاينة" : "Preview"}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditImage(entry)}
                            className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            title={language === "ar" ? "ØªØ¹Ø¯ÙŠÙ„" : "Edit"}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <label className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateUnifiedImage(entry.id, String(reader.result || ""));
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <button
                            onClick={() => {
                              markImageForRemoval(entry.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title={t('admin.content.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                          {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingGalleryImages.length > 0 && (
                <div className="border-2 border-dashed border-red-200 rounded-2xl p-4">
                  <h5 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    {language === "ar" ? "صور معلقة للحذف" : "Images pending removal"}
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pendingGalleryImages.map((entry: UnifiedImage, i: number) => (
                      <div key={`removed-${entry.id}`} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group border-2 border-red-200">
                        <img src={entry.src} alt={`Removed ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => setPreviewImage(entry.src)}
                            className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              undoImageRemoval(entry.id);
                            }}
                            className="px-3 py-2 bg-white text-gray-700 rounded-lg text-xs font-semibold"
                          >
                            {language === "ar" ? "تراجع" : "Undo"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-red-600 mt-3">
                    {language === "ar"
                      ? "سيتم حذف هذه الصور عند الضغط على نشر"
                      : "These images will be removed once you press Publish"}
                  </p>
                </div>
              )}

              {/* Upload Area - Add More Images */}
              {activeGalleryImages.length < CONTENT_REQUIREMENTS.maxImages && (
                <div>
                  <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    {t('admin.content.addMoreImages')} ({CONTENT_REQUIREMENTS.maxImages - activeGalleryImages.length} {t('admin.content.remaining')})
                  </h5>
                  <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#009FE3] transition-all cursor-pointer group block">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-700 mb-1">{t('admin.content.uploadGalleryImages')}</p>
                        <p className="text-sm text-gray-500">
                          {t("admin.content.dragImagesHint")}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach((file) => {
                          if (activeGalleryImages.length < CONTENT_REQUIREMENTS.maxImages) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              addUnifiedImage(String(reader.result || ""));
                            };
                            reader.readAsDataURL(file);
                          }
                        });
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Empty State */}
              {activeGalleryImages.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold mb-2">{t('admin.content.noImagesYet')}</p>
                  <p className="text-sm text-gray-400">{t('admin.content.uploadFirstImage')}</p>
                </div>
              )}

              {activeGalleryImages.length >= CONTENT_REQUIREMENTS.maxImages && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{t('admin.content.maxImagesReached')}</p>
                </div>
              )}
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === "specs" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-purple-900 mb-1">{t('admin.content.addSpec')}</h4>
                  <p className="text-sm text-purple-700">
                    {t('admin.content.minRequired')}: {CONTENT_REQUIREMENTS.minSpecs} | {t('admin.content.maxAllowed')}: {CONTENT_REQUIREMENTS.maxSpecs}
                  </p>
                </div>
              </div>

              <button
                onClick={addNewSpec}
                disabled={specs.length >= CONTENT_REQUIREMENTS.maxSpecs}
                className={`w-full py-3 border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-2 font-bold ${
                  specs.length >= CONTENT_REQUIREMENTS.maxSpecs
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:border-[#009FE3] hover:text-[#009FE3]"
                }`}
              >
                <Plus className="w-5 h-5" />
                {t('admin.content.addSpec')} ({specs.length}/{CONTENT_REQUIREMENTS.maxSpecs})
              </button>

              {specs.map((spec: any, index: number) => {
                const IconComponent = AVAILABLE_ICONS.find((i) => i.name === spec.icon)?.icon || Smartphone;
                const previewTitle =
                  language === "ar"
                    ? spec.nameAr || spec.nameEn || ""
                    : spec.nameEn || spec.nameAr || "";
                const previewValue =
                  language === "ar"
                    ? spec.valueAr || spec.valueEn || ""
                    : spec.valueEn || spec.valueAr || "";

                return (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-4 space-y-3 relative hover:border-[#009FE3] transition-all">
                    {/* Icon Selector */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-bold text-gray-700">{t('admin.content.selectIcon')}</label>
                        <button
                          onClick={() => removeSpec(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs font-bold">{t("admin.content.delete")}</span>
                        </button>
                      </div>
                      
                      {/* Icon/Image Tabs */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => {
                            const newSpecs = [...specs];
                            newSpecs[index].iconImage = "";
                            setSpecs(newSpecs);
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                            !spec.iconImage 
                              ? "bg-[#009FE3] text-white" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {t('admin.content.useIconLibrary')}
                        </button>
                        <label
                          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer text-center ${
                            spec.iconImage 
                              ? "bg-[#009FE3] text-white" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {t('admin.content.useIconImage')}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleIconImageUpload(index, file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="relative">
                        {spec.iconImage ? (
                          /* Show image if using icon image */
                          <div className="flex items-center gap-3 px-4 py-3 border-2 border-[#009FE3] rounded-xl bg-blue-50">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                              <img src={spec.iconImage} alt="Icon" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-gray-700 font-medium flex-1">
                              {t("admin.content.customImage")}
                            </span>
                            <label className="text-blue-600 hover:bg-blue-50 p-1 rounded cursor-pointer">
                              <Upload className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleIconImageUpload(index, file);
                                  }
                                }}
                              />
                            </label>
                            <button
                              onClick={() => updateSpecIconImage(index, "")}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          /* Show icon library button */
                          <>
                            <button
                              onClick={() => setShowIconPicker(showIconPicker === index ? null : index)}
                              className="flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-[#009FE3] transition-all w-full"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <span className="text-gray-700 font-medium">
                                {language === "ar"
                                  ? AVAILABLE_ICONS.find((i) => i.name === spec.icon)?.labelAr
                                  : AVAILABLE_ICONS.find((i) => i.name === spec.icon)?.labelEn}
                              </span>
                              <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                            </button>

                            {/* Icon Picker Dropdown */}
                            {showIconPicker === index && (
                              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 z-20 max-h-64 overflow-y-auto">
                                <p className="text-sm font-bold text-gray-700 mb-3">{t('admin.content.chooseIcon')}</p>
                                <div className="grid grid-cols-4 gap-2">
                                  {AVAILABLE_ICONS.map((iconItem) => {
                                    const Icon = iconItem.icon;
                                    return (
                                      <button
                                        key={iconItem.name}
                                        onClick={() => updateSpecIcon(index, iconItem.name)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                                          spec.icon === iconItem.name
                                            ? "bg-[#009FE3] text-white"
                                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                        }`}
                                      >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-xs font-medium text-center">
                                          {language === "ar" ? iconItem.labelAr : iconItem.labelEn}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                                {customSpecIcons.length > 0 && (
                                  <>
                                    <p className="text-sm font-bold text-gray-700 mt-4 mb-3">
                                      {language === "ar" ? "الأيقونات المخصصة" : "Custom Icons"}
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                      {customSpecIcons.map((iconItem) => (
                                        <button
                                          key={iconItem.id}
                                          onClick={() => {
                                            updateSpecIconImage(index, iconItem.iconImage || "");
                                            setShowIconPicker(null);
                                            savedSpecTitlesManager.incrementUsage(iconItem.id);
                                          }}
                                          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                                            spec.iconImage === iconItem.iconImage
                                              ? "bg-[#009FE3] text-white"
                                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center overflow-hidden border border-gray-200">
                                            <img src={iconItem.iconImage} alt={iconItem.nameEn} className="w-full h-full object-contain" />
                                          </div>
                                          <span className="text-xs font-medium text-center">
                                            {language === "ar" ? iconItem.nameAr : iconItem.nameEn}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {(previewTitle || previewValue) && (
                      <div className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <span className="font-semibold">{previewTitle}</span>
                        {previewValue && <span className="text-gray-500"> — {previewValue}</span>}
                      </div>
                    )}

                    {/* Spec Fields */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {t('admin.content.specNameEn')}
                          </label>
                          <input
                            type="text"
                            value={spec.nameEn}
                            onChange={(e) => {
                              const newSpecs = [...specs];
                              newSpecs[index].nameEn = e.target.value;
                              setSpecs(newSpecs);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                            placeholder={t("admin.content.specNamePlaceholderEn")}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {t('admin.content.specNameAr')}
                          </label>
                          <input
                            type="text"
                            value={spec.nameAr}
                            onChange={(e) => {
                              const newSpecs = [...specs];
                              newSpecs[index].nameAr = e.target.value;
                              setSpecs(newSpecs);
                            }}
                            dir="rtl"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                            placeholder={t("admin.content.specNamePlaceholderAr")}
                          />
                        </div>
                      </div>

                      {/* Spec Values */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">{t('admin.content.specValueEn')}</label>
                          <input
                            type="text"
                            value={spec.valueEn}
                            onChange={(e) => {
                              const newSpecs = [...specs];
                              newSpecs[index].valueEn = e.target.value;
                              setSpecs(newSpecs);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                            placeholder={t("admin.content.specValuePlaceholderEn")}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">{t('admin.content.specValueAr')}</label>
                          <input
                            type="text"
                            value={spec.valueAr}
                            onChange={(e) => {
                              const newSpecs = [...specs];
                              newSpecs[index].valueAr = e.target.value;
                              setSpecs(newSpecs);
                            }}
                            dir="rtl"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                            placeholder={t("admin.content.specValuePlaceholderAr")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* What's in the Box Tab */}
          {activeTab === "whatsInBox" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 mb-1">
                    {language === "ar" ? "محتويات العلبة" : "What's in the Box"}
                  </h4>
                  <p className="text-sm text-green-700">
                    {language === "ar" 
                      ? "أضف العناصر المرفقة مع المنتج داخل العلبة"
                      : "Add items that come with the product inside the box"}
                  </p>
                </div>
              </div>

              <button
                onClick={addBoxItem}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#009FE3] hover:text-[#009FE3] transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Plus className="w-5 h-5" />
                {t('admin.content.addBoxItem')}
              </button>

              {whatsInBox.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>{t('admin.content.whatsInBoxEmpty')}</p>
                </div>
              )}

              {whatsInBox.map((item) => (
                <div key={item.id} className="border-2 border-gray-200 rounded-xl p-4 space-y-3 relative hover:border-[#009FE3] transition-all">
                  <button
                    onClick={() => removeBoxItem(item.id)}
                    className="absolute top-3 right-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-12">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        {t('admin.content.boxItemEn')}
                      </label>
                      <input
                        type="text"
                        value={item.itemEn}
                        onChange={(e) => updateBoxItem(item.id, "itemEn", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                        placeholder={t("admin.content.boxItemPlaceholderEn")}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        {t('admin.content.boxItemAr')}
                      </label>
                      <input
                        type="text"
                        value={item.itemAr}
                        onChange={(e) => updateBoxItem(item.id, "itemAr", e.target.value)}
                        dir="rtl"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                        placeholder={t("admin.content.boxItemPlaceholderAr")}
                      />
                    </div>
                  </div>

                  <div className="w-32">
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {t('admin.content.quantity')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateBoxItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category & Brand Tab */}
          {activeTab === "category" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-1">{t('admin.content.categoryNote')}</h4>
                  <p className="text-sm text-blue-700">{t('admin.content.notApplicable')}</p>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('admin.content.selectCategory')}
                  <span className="text-red-600 ml-1">({t('admin.content.required')})</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                >
                  <option value="">{t("admin.content.selectCategoryPlaceholder")}</option>
                  {editorCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {language === "ar" ? cat.nameAr || cat.nameEn : cat.nameEn || cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Name - Only if not mobile/power station */}
              {needsCategoryBrand && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('admin.content.brandName')}
                    <span className="text-red-600 ml-1">({t('admin.content.required')})</span>
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  >
                    <option value="">{language === "ar" ? "اختر العلامة التجارية" : "Select Brand"}</option>
                    {availableEditorBrands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {language === "ar" ? brand.nameAr || brand.nameEn : brand.nameEn || brand.nameAr}
                      </option>
                    ))}
                  </select>
                  {(selectedCategoryLabel || brandName) && (
                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        {language === "ar" ? "المحدد حاليا:" : "Currently selected:"}
                      </span>{" "}
                      {[selectedCategoryLabel, brandName].filter(Boolean).join(" / ")}
                    </div>
                  )}
                </div>
              )}

              {!needsCategoryBrand && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">{t('admin.content.notApplicable')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all"
          >
            {t('admin.content.cancel')}
          </button>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={handleSave}
              className="px-6 py-3 border-2 border-[#009FE3] text-[#009FE3] rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {t('admin.content.saveDraft')}
            </button> */}
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('admin.content.publish')}
            </button>
          </div>
        </div>
      </div>
      {previewImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full max-h-[75vh] flex items-center justify-center">
              <img src={previewImage} alt="Preview" className="max-h-[75vh] w-full object-contain" />
            </div>
          </div>
        </div>
      )}
      {editingImageId && (
        <div
          className="fixed inset-0 z-[210] bg-black/70 flex items-center justify-center p-4"
          onClick={closeEditImage}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEditImage}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close edit"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {language === "ar" ? "ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„ØµÙˆØ±Ø©" : "Edit image"}
              </h3>
              <p className="text-sm text-gray-500">
                {language === "ar"
                  ? "ÙŠØªÙ… ØªØ­Ø¯ÙŠØ« Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„Ù…Ø­Ø¯Ø¯Ø© ÙÙ‚Ø·"
                  : "Only the selected image will be updated."}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {editingImageUrl && (
                <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <img
                    src={editingImageUrl}
                    alt="Editing"
                    className="max-h-64 w-full object-contain"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === "ar" ? "Ø±Ø§Ø¨Ø· Ø§Ù„ØµÙˆØ±Ø©" : "Image URL"}
                </label>
                <input
                  type="text"
                  value={editingImageUrl}
                  onChange={(e) => setEditingImageUrl(e.target.value)}
                  placeholder={language === "ar" ? "Ø£Ø¯Ø®Ù„ Ø±Ø§Ø¨Ø· Ø§Ù„ØµÙˆØ±Ø©" : "Paste an image URL"}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                />
              </div>
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-200">
                <Upload className="w-4 h-4" />
                {language === "ar" ? "Ø¥Ø±ÙØ¹ ØµÙˆØ±Ø©" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditingImageUrl(String(reader.result || ""));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={closeEditImage}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                >
                  {language === "ar" ? "Ø¥Ù„ØºØ§Ø¡" : "Cancel"}
                </button>
                <button
                  onClick={() => {
                    if (!editingImageId) return;
                    if (!editingImageUrl.trim()) return;
                    updateUnifiedImage(editingImageId, editingImageUrl.trim());
                    closeEditImage();
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white font-semibold"
                >
                  {language === "ar" ? "Ø­ÙØ¸" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

