import {
  X,
  Tag,
  CheckCircle2,
  AlertCircle,
  Upload,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  Settings as SettingsIcon,
  Search,
  Filter,
  ChevronDown,
  AlertTriangle,
  Info,
  Smartphone,
  Camera,
  Battery,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Shield,
  Zap,
  Wifi,
  HardDrive,
  Monitor,
  Speaker,
  Cpu,
  MemoryStick,
  Package,
  Palette,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import hiddenProductsManager from "../../../../data/hiddenProductsData";
import savedSpecTitlesManager from "../../../../data/savedSpecTitlesData";

interface ProductContentDashboardProps {
  onClose: () => void;
}

// Content Requirements for synced products
const CONTENT_REQUIREMENTS = {
  description: { min: 50, max: 500, optimal: 200 },
  minImages: 3,
  maxImages: 10,
  minSpecs: 4,
  maxSpecs: 15,
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

export function ProductContentDashboard({ onClose }: ProductContentDashboardProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "incomplete" | "ready">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenProducts, setHiddenProducts] = useState<Set<string>>(new Set());
  const [contentProducts, setContentProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    setHiddenProducts(new Set(hiddenProductsManager.getHiddenProducts()));
  }, []);

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
      ? product.colorVariants.map((color: any) => ({
          name: color?.name || color?.color_name || "",
          nameAr: color?.nameAr || color?.color_name_ar || color?.name || color?.color_name || "",
          code: color?.color_hex || color?.hexCode || color?.hex || "",
          image: color?.image || (Array.isArray(color?.images) ? color.images[0] : "") || "",
        }))
      : [];

    const whatsInBox = Array.isArray(product?.inTheBox)
      ? product.inTheBox.map((item: any, index: number) => ({
          id: item?.id || `box-${index}`,
          itemEn: item?.en || item?.nameEn || item?.valueEn || "",
          itemAr: item?.ar || item?.nameAr || item?.valueAr || "",
          quantity: Number(item?.quantity || item?.qty || 1),
        }))
      : [];

    const missing = product._missing || {};
    const readyToPublish = !product._hasMissing;

    return {
      id: String(product?._id || product?.id || product?.stk_code || ""),
      sku: String(product?.stk_code || product?.id || ""),
      nameEn,
      nameAr,
      brand: product?.brand || "",
      category: product?.category || "",
      price: product?.price || "",
      syncedAt: product?.audit?.updatedAt || product?.updatedAt || "",
      syncSource: "MongoDB",
      hasMultipleColors: colors.length > 0,
      colors,
      existingContent: {
        thumbnail: product?.image || colors[0]?.image || "",
        descriptionEn: product?.description || "",
        descriptionAr: product?.descriptionAr || "",
        images: Array.isArray(product?.images) ? product.images : [],
        specs: specsNormalized,
        whatsInBox,
      },
      missingFields: {
        productName: Boolean(missing.name),
        productDetails: Boolean(missing.description),
        colorImages: Number(missing.colorImages || 0),
        galleryImages: Boolean(missing.galleryImages),
        specs: Boolean(missing.specs),
        category: Boolean(missing.category),
        brand: Boolean(missing.brand),
      },
      readyToPublish,
      _raw: product,
    };
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    setLoadError(null);
    try {
      const headers: Record<string, string> = {};
      if (ADMIN_API_KEY) headers["x-admin-key"] = ADMIN_API_KEY;
      const params = new URLSearchParams();
      params.set("missing", "1");
      params.set("limit", "200");
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
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
    fetchProducts();
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
    const missing = product?.missingFields || {};
    const total = 7;
    const completed =
      (missing.productName ? 0 : 1) +
      (missing.productDetails ? 0 : 1) +
      (missing.colorImages ? 0 : 1) +
      (missing.galleryImages ? 0 : 1) +
      (missing.specs ? 0 : 1) +
      (missing.category ? 0 : 1) +
      (missing.brand ? 0 : 1);

    return Math.round((completed / total) * 100);
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

  const toggleProductVisibility = (productId: string) => {
    const isNowHidden = hiddenProductsManager.toggleProductVisibility(productId);
    hiddenProductsManager.saveToStorage();
    setHiddenProducts((prev) => {
      const next = new Set(prev);
      if (isNowHidden) next.add(String(productId));
      else next.delete(String(productId));
      return next;
    });
    alert(isNowHidden ? t("admin.content.productHidden") : t("admin.content.productVisible"));
  };

  const filteredProducts = contentProducts.filter((product) => {
    const completion = calculateCompletion(product);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "ready" ? completion >= 90 : completion < 90);
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      product.sku.toLowerCase().includes(q) ||
      product.nameEn.toLowerCase().includes(q) ||
      product.nameAr.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] bg-white cursor-pointer"
              >
                <option value="all">{t('admin.content.all')}</option>
                <option value="incomplete">{t('admin.content.incomplete')}</option>
                <option value="ready">{t('admin.content.ready')}</option>
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
            {filteredProducts.map((product) => {
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
                  {hiddenProducts.has(product.id) && (
                    <div
                      className={`absolute top-4 ${
                        language === "ar" ? "right-4" : "left-4"
                      } px-3 py-1 rounded-full bg-gray-800 text-white font-bold text-xs shadow-lg flex items-center gap-1`}
                    >
                      <EyeOff className="w-3 h-3" />
                      {t("admin.content.hidden")}
                    </div>
                  )}
                  {/* Ready Badge */}
                  {completionPercentage >= 90 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-green-500 text-white font-bold text-xs shadow-lg">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      {t('admin.content.readyBadge')}
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
                    {product.missingFields.colorImages > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>
                          {product.missingFields.colorImages} {t('admin.content.colorImages')}
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
                      onClick={() => toggleProductVisibility(product.id)}
                      className={`w-full py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                        hiddenProducts.has(product.id)
                          ? "bg-gray-900 text-white border-gray-900 hover:bg-black"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {hiddenProducts.has(product.id) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {hiddenProducts.has(product.id) ? t("admin.content.showProduct") : t("admin.content.hideProduct")}
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
  const [galleryImages, setGalleryImages] = useState(product.existingContent.images || []);
  
  // Specs State
  const [specs, setSpecs] = useState(product.existingContent.specs || []);
  const [specSearchQuery, setSpecSearchQuery] = useState("");
  const [showSpecSuggestions, setShowSpecSuggestions] = useState(false);
  const [showSpecNameSuggestions, setShowSpecNameSuggestions] = useState<number | null>(null);
  const [specNameSearch, setSpecNameSearch] = useState<{[key: number]: string}>({});
  
  // What's in the Box State
  const [whatsInBox, setWhatsInBox] = useState<Array<{id: string, itemEn: string, itemAr: string, quantity: number}>>(
    product.existingContent.whatsInBox || []
  );
  
  // Category & Brand State
  const [selectedCategory, setSelectedCategory] = useState(product.category || "");
  const [brandName, setBrandName] = useState(product.brand || "");
  
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);

  const needsCategoryBrand = selectedCategory !== "mobile" && selectedCategory !== "power-station";

  const { t, language } = useLanguage();

  const addNewSpec = () => {
    if (specs.length >= CONTENT_REQUIREMENTS.maxSpecs) {
      alert(language === "ar" ? `الحد الأقصى ${CONTENT_REQUIREMENTS.maxSpecs} مواصفات` : `Maximum ${CONTENT_REQUIREMENTS.maxSpecs} specs`);
      return;
    }
    setSpecs([...specs, { icon: "Smartphone", iconImage: "", nameEn: "", nameAr: "", valueEn: "", valueAr: "" }]);
    setShowSpecSuggestions(false);
  };

  const addSpecFromSaved = (savedSpec: any) => {
    if (specs.length >= CONTENT_REQUIREMENTS.maxSpecs) {
      alert(language === "ar" ? `الحد الأقصى ${CONTENT_REQUIREMENTS.maxSpecs} مواصفات` : `Maximum ${CONTENT_REQUIREMENTS.maxSpecs} specs`);
      return;
    }
    setSpecs([...specs, { 
      icon: savedSpec.icon, 
      iconImage: savedSpec.iconImage || "",
      nameEn: savedSpec.nameEn, 
      nameAr: savedSpec.nameAr, 
      valueEn: "", 
      valueAr: "" 
    }]);
    savedSpecTitlesManager.incrementUsage(savedSpec.id);
    setSpecSearchQuery("");
    setShowSpecSuggestions(false);
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
  };

  const handleIconImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSpecIconImage(index, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const applySpecTitleFromSaved = (index: number, savedSpec: any) => {
    const newSpecs = [...specs];
    newSpecs[index].nameEn = savedSpec.nameEn;
    newSpecs[index].nameAr = savedSpec.nameAr;
    newSpecs[index].icon = savedSpec.icon;
    newSpecs[index].iconImage = savedSpec.iconImage || "";
    setSpecs(newSpecs);
    setShowSpecNameSuggestions(null);
    setSpecNameSearch({ ...specNameSearch, [index]: "" });
    savedSpecTitlesManager.incrementUsage(savedSpec.id);
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

  const updateColorImage = (index: number, imageUrl: string) => {
    const newColors = [...colors];
    newColors[index].image = imageUrl;
    setColors(newColors);
  };

  const handleSave = () => {
    // Save new spec titles to the manager
    specs.forEach((spec: any) => {
      if (spec.nameEn && spec.nameAr) {
        savedSpecTitlesManager.addOrUpdateTitle(spec.nameEn, spec.nameAr, spec.icon, spec.iconImage);
      }
    });

    const formattedSpecs = specs.map((spec: any) => ({
      icon: spec.icon || "Smartphone",
      iconImage: spec.iconImage || "",
      title: spec.nameEn || "",
      titleAr: spec.nameAr || "",
      value: spec.valueEn || "",
      valueAr: spec.valueAr || "",
    }));

    const formattedColors = colors.map((color: any) => ({
      name: color?.name || "",
      nameAr: color?.nameAr || "",
      color_hex: color?.code || "",
      images: color?.image ? [color.image] : [],
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
      images: galleryImages,
      specs: formattedSpecs,
      inTheBox: formattedBox,
      category: selectedCategory,
      brand: brandName,
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
                  <span className="ml-2">{product.price} SYP</span>
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
                {galleryImages.length}/{CONTENT_REQUIREMENTS.maxImages}
              </span>
            </button>

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
                    {colors.map((color: any, index: number) => (
                      <div key={index} className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#009FE3] transition-all">
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
                          </div>
                        </div>

                        {color.image ? (
                          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                            <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => updateColorImage(index, "")}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#009FE3] transition-all cursor-pointer group">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-[#009FE3] transition-colors" />
                            <p className="text-sm text-gray-600">{t('admin.content.uploadColorImage')}</p>
                          </div>
                        )}
                      </div>
                    ))}
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
          {activeTab === "gallery" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-orange-900 mb-1">{t('admin.content.uploadGalleryImages')}</h4>
                  <p className="text-sm text-orange-700">{t('admin.content.imageGuidelines')}</p>
                  <p className="text-sm text-orange-700 mt-1">
                    {t('admin.content.minRequired')}: {CONTENT_REQUIREMENTS.minImages} | {t('admin.content.maxAllowed')}: {CONTENT_REQUIREMENTS.maxImages}
                  </p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#009FE3] transition-all cursor-pointer group">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                      <p className="text-lg font-bold text-gray-700 mb-1">{t('admin.content.uploadGalleryImages')}</p>
                    <p className="text-sm text-gray-500">
                      {t("admin.content.dragImagesHint")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {galleryImages.length}/{CONTENT_REQUIREMENTS.maxImages} {t("admin.content.imagesUploaded")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {galleryImages.map((img: string, i: number) => (
                    <div key={i} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                      <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setGalleryImages(galleryImages.filter((_: any, idx: number) => idx !== i))}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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

              {/* Autocomplete Search for Saved Specs */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-blue-900">{t('admin.content.savedSpecs')}</h4>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={specSearchQuery}
                    onChange={(e) => {
                      setSpecSearchQuery(e.target.value);
                      setShowSpecSuggestions(true);
                    }}
                    onFocus={() => setShowSpecSuggestions(true)}
                    placeholder={t('admin.content.searchSpecs')}
                    className="w-full px-4 py-3 pr-10 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  {/* Suggestions Dropdown */}
                  {showSpecSuggestions && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-200 max-h-64 overflow-y-auto z-30">
                      {specSearchQuery === "" ? (
                        /* Show most used when no search */
                        <div className="p-3">
                          <p className="text-xs font-bold text-gray-500 mb-2 px-2">{t('admin.content.mostUsedSpecs')}</p>
                          {savedSpecTitlesManager.getMostUsed(10).map((savedSpec) => (
                            <button
                              key={savedSpec.id}
                              onClick={() => addSpecFromSaved(savedSpec)}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-all text-left"
                            >
                              {(() => {
                                if (savedSpec.iconImage) {
                                  return (
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                      <img src={savedSpec.iconImage} alt="Icon" className="w-full h-full object-contain" />
                                    </div>
                                  );
                                } else {
                                  const Icon = AVAILABLE_ICONS.find((i) => i.name === savedSpec.icon)?.icon || Smartphone;
                                  return (
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Icon className="w-5 h-5 text-white" />
                                    </div>
                                  );
                                }
                              })()}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-gray-900 truncate">
                                  {language === "ar" ? savedSpec.nameAr : savedSpec.nameEn}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {language === "ar" ? `استخدم ${savedSpec.usageCount} مرة` : `Used ${savedSpec.usageCount} times`}
                                </p>
                              </div>
                              <Plus className="w-4 h-4 text-[#009FE3] flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Show search results */
                        <div className="p-3">
                          {savedSpecTitlesManager.searchTitles(specSearchQuery, language).map((savedSpec) => (
                            <button
                              key={savedSpec.id}
                              onClick={() => addSpecFromSaved(savedSpec)}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-all text-left"
                            >
                              {(() => {
                                if (savedSpec.iconImage) {
                                  return (
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                      <img src={savedSpec.iconImage} alt="Icon" className="w-full h-full object-contain" />
                                    </div>
                                  );
                                } else {
                                  const Icon = AVAILABLE_ICONS.find((i) => i.name === savedSpec.icon)?.icon || Smartphone;
                                  return (
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Icon className="w-5 h-5 text-white" />
                                    </div>
                                  );
                                }
                              })()}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-gray-900 truncate">
                                  {language === "ar" ? savedSpec.nameAr : savedSpec.nameEn}
                                </p>
                              </div>
                              <Plus className="w-4 h-4 text-[#009FE3] flex-shrink-0" />
                            </button>
                          ))}
                          {savedSpecTitlesManager.searchTitles(specSearchQuery, language).length === 0 && (
                            <div className="px-3 py-6 text-center text-gray-400">
                              <p className="text-sm">{t("admin.content.noResultsFound")}</p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="border-t border-gray-200 p-2">
                        <button
                          onClick={() => {
                            addNewSpec();
                            setShowSpecSuggestions(false);
                          }}
                          className="w-full py-2 px-3 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-bold"
                        >
                          <Plus className="w-4 h-4" />
                          {t('admin.content.createNewSpec')}
                        </button>
                      </div>
                    </div>
                  )}
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
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Spec Fields */}
                    <div className="space-y-3">
                      {/* Spec Name with Autocomplete */}
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          {t("admin.content.searchSavedSpecs")}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={specNameSearch[index] !== undefined ? specNameSearch[index] : ""}
                            onChange={(e) => {
                              setSpecNameSearch({ ...specNameSearch, [index]: e.target.value });
                              setShowSpecNameSuggestions(index);
                            }}
                            onFocus={() => setShowSpecNameSuggestions(index)}
                            onBlur={() => {
                              setTimeout(() => setShowSpecNameSuggestions(null), 200);
                            }}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] text-sm"
                            placeholder={t("admin.content.searchSavedSpecPlaceholder")}
                          />
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          
                          {/* Suggestions Dropdown */}
                          {showSpecNameSuggestions === index && (
                            <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl border-2 border-gray-200 max-h-48 overflow-y-auto z-30">
                              {(() => {
                                const searchTerm = specNameSearch[index] || "";
                                const results = searchTerm 
                                  ? savedSpecTitlesManager.searchTitles(searchTerm, language)
                                  : savedSpecTitlesManager.getMostUsed(8);
                                
                                return (
                                  <div className="p-2">
                                    {!searchTerm && results.length > 0 && (
                                      <p className="text-xs font-bold text-gray-500 mb-2 px-2">
                                        {t('admin.content.mostUsedSpecs')}
                                      </p>
                                    )}
                                    {results.length > 0 ? (
                                      results.map((savedSpec) => (
                                        <button
                                          key={savedSpec.id}
                                          onClick={() => applySpecTitleFromSaved(index, savedSpec)}
                                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded-lg transition-all text-left"
                                        >
                                          {(() => {
                                            if (savedSpec.iconImage) {
                                              return (
                                                <div className="w-6 h-6 bg-white rounded flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                                                  <img src={savedSpec.iconImage} alt="Icon" className="w-full h-full object-contain" />
                                                </div>
                                              );
                                            } else {
                                              const Icon = AVAILABLE_ICONS.find((i) => i.name === savedSpec.icon)?.icon || Smartphone;
                                              return (
                                                <div className="w-6 h-6 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded flex items-center justify-center flex-shrink-0">
                                                  <Icon className="w-4 h-4 text-white" />
                                                </div>
                                              );
                                            }
                                          })()}
                                          <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs text-gray-900 truncate">
                                              {language === "ar" ? savedSpec.nameAr : savedSpec.nameEn}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                              {language === "ar" ? savedSpec.nameEn : savedSpec.nameAr}
                                            </p>
                                          </div>
                                          <span className="text-xs text-gray-400">
                                            {savedSpec.usageCount}×
                                          </span>
                                        </button>
                                      ))
                                    ) : (
                                      <div className="p-2 text-center text-gray-500 text-xs">
                                        {t("admin.content.noResultsAddNewSpec")}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                        
                        {/* Manual Entry Fields for New Spec */}
                        <div className="grid grid-cols-2 gap-3 mt-3">
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
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {language === "ar" ? cat.nameAr : cat.nameEn}
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
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    placeholder={t("admin.content.brandExamplePlaceholder")}
                  />
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
            <button
              onClick={handleSave}
              className="px-6 py-3 border-2 border-[#009FE3] text-[#009FE3] rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {t('admin.content.saveDraft')}
            </button>
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
    </div>
  );
}
