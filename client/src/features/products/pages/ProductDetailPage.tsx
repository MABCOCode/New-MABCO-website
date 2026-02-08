import {
  ChevronRight,
  X,
  ShoppingCart,
  Star,
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
  MessageSquare,
  CheckCircle2,
  Truck,
  RefreshCw,
  Award,
  Minus,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";
import { ColorSwatch } from  "../../../components/ui/ColorSwatch";
import { ChargeOptionSlider } from "../../../components/ui/ChargeOptionSlider";
import { Badge } from "../../../components/ui/badge";

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

export function ProductDetailPage(props: ProductDetailPageProps) {
  const { product, categoryName, brandName } = props;
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const cart = useCart();
  const { id } = useParams<{ id?: string }>();

  const location = useLocation();

  const [localProduct, setLocalProduct] = useState<any | null>(product ?? (location.state && (location.state as any).product) ?? null);
  useEffect(() => {
    // If product prop or location state provided product, no need to import
    const stateProduct = (location.state && (location.state as any).product) ?? null;
    if (!product && !stateProduct && id) {
      import("../../../testdata/products.json")
        .then((mod) => {
          const list = (mod as any).default ?? (mod as any);
          const found = list.find((p: any) => String(p.id) === String(id));
          setLocalProduct(found ?? null);
        })
        .catch(() => setLocalProduct(null));
    } else if (stateProduct && !localProduct) {
      setLocalProduct(stateProduct);
    }
  }, [id, product, location, localProduct]);

  const prod = product ?? localProduct;

  // fallback handlers when component used as a routed page
  const resetProductDetail = props.resetProductDetail ?? (() => navigate(-1));
  const propAddToCart = props.addToCart;
  const handleAddToCart = propAddToCart ?? (() => {
    try {
      if (!cart.addToCart) return;

      const chosenColor = hasColors ? selectedColor : undefined;
      const currentColorVar = hasColors ? prod?.colorVariants?.find((v: any) => v.name === chosenColor) : null;
      const chosenColorHex = currentColorVar?.hexCode ?? null;
      const chosenVariantImage = currentImage ?? prod?.image ?? null;

      const selectedCharge = selectedChargeOption
        ? prod?.chargeOptions?.find((o: any) => String(o.id) === String(selectedChargeOption))
        : null;
      const chargeLabel = selectedCharge ? (language === "ar" ? selectedCharge.valueAr || selectedCharge.value : selectedCharge.value) : null;

      cart.addToCart(prod, {
        color: chosenColor,
        variantColorHex: chosenColorHex,
        variantImage: chosenVariantImage,
        chargeOptionId: selectedChargeOption ?? null,
        chargeOptionLabel: chargeLabel ?? null,
        quantity: quantity,
      });
    } catch {
      // noop
    }
  });

  const hasOffers = !!prod?.productOffers?.length;
  const hasColors = !!prod?.colorVariants?.length;
  const hasChargeOptions = !!prod?.chargeOptions?.length;

  // State for color and charge options
  const [selectedColor, setSelectedColor] = useState(prod?.colorVariants?.[0]?.name || "");
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(prod?.chargeOptions?.[0]?.id || null);
  const [quantity, setQuantity] = useState(1);
  const [tabState, setTabState] = useState<"description" | "specs" | "reviews">("description");

  // Dynamic image based on color selection
  const displayColor = hoveredColor || selectedColor;
  const currentImage = hasColors
    ? prod?.colorVariants?.find((v: any) => v.name === displayColor)?.image || prod?.image
    : prod?.image;

  // Get current color variant for stock info
  const currentColorVariant = hasColors
    ? prod?.colorVariants?.find((v: any) => v.name === selectedColor)
    : null;

  // Dynamic price based on charge option
  const currentChargeOption = prod?.chargeOptions?.find((opt: any) => opt.id === selectedChargeOption);
  const displayPrice = currentChargeOption ? currentChargeOption.price.toLocaleString("en-US") : prod?.price;

  // Calculate savings if old price exists
  const savingsAmount = prod?.oldPrice
    ? parseFloat(prod.oldPrice.replace(/,/g, "")) -
      parseFloat(
        currentChargeOption ? currentChargeOption.price.toString() : (prod.price ?? "0").toString().replace(/,/g, "")
      )
    : 0;

  const discountPercentage = prod?.oldPrice
    ? Math.round(
        ((parseFloat(prod.oldPrice.replace(/,/g, "")) -
          parseFloat(
            currentChargeOption ? currentChargeOption.price.toString() : (prod.price ?? "0").toString().replace(/,/g, "")
          )) /
          parseFloat(prod.oldPrice.replace(/,/g, ""))) *
          100
      )
    : 0;

  // Stock status
  const inStock = currentColorVariant ? currentColorVariant.inStock !== false : true;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  if (!prod) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          {id ? (language === "ar" ? "جاري التحميل..." : "Loading...") : (language === "ar" ? "المنتج غير موجود" : "Product not found")}
        </div>
      </section>
    );
  }

  return (
    <section dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Improved Breadcrumb */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
              <button
                onClick={resetProductDetail}
                className={`group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <ChevronRight
                  className={`w-4 h-4 ${language === "ar" ? "" : "rotate-180"}`}
                />
                <span className="font-medium">{t("home")}</span>
              </button>
              <span className="text-gray-300 flex-shrink-0">/</span>
              
              {categoryName && (
                <>
                  <span className="text-gray-500 font-medium whitespace-nowrap">
                    {categoryName}
                  </span>
                  <span className="text-gray-300 flex-shrink-0">/</span>
                </>
              )}
              
              {brandName && (
                <>
                  <span className="text-gray-500 font-medium whitespace-nowrap">
                    {brandName}
                  </span>
                  <span className="text-gray-300 flex-shrink-0">/</span>
                </>
              )}
              
              <span className="text-[#009FE3] font-semibold truncate max-w-[200px] sm:max-w-md">
                {prod?.name}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={resetProductDetail}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side: Product Image - More Immersive */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="relative group">
                {/* Main Image Container */}
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-200">
                  <img
                    src={currentImage}
                    alt={prod?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                  {/* Rating Badge */}
                  {prod?.rating && (
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">
                        {prod?.rating}
                      </span>
                      <span className="text-xs text-gray-500">/5</span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-xl font-bold shadow-lg">
                      {language === "ar" ? "خصم" : "SAVE"} {discountPercentage}%
                    </div>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-[#009FE3] transition-colors">
                    <Truck className="w-5 h-5 text-[#009FE3] mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">
                      {language === "ar" ? "توصيل سريع" : "Fast Delivery"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-[#009FE3] transition-colors">
                    <RefreshCw className="w-5 h-5 text-[#009FE3] mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">
                      {language === "ar" ? "إرجاع مجاني" : "Free Returns"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-[#009FE3] transition-colors">
                    <Award className="w-5 h-5 text-[#009FE3] mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">
                      {language === "ar" ? "ضمان أصلي" : "Warranty"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="lg:col-span-7">
            {/* Product Name - Primary Visual Anchor */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                {prod?.name}
              </h1>
              
              {/* Rating & Reviews Summary */}
              {prod?.rating && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(prod?.rating as number)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">
                    {prod?.rating} {language === "ar" ? "نجوم" : "stars"}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">
                    {language === "ar" ? "1.2k تقييم" : "1.2k reviews"}
                  </span>
                </div>
              )}
            </div>

            {/* Price & Availability Section - Enhanced */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 mb-6 border-2 border-[#009FE3]/20">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  {/* Current Price - Primary */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-[#009FE3]">
                      {displayPrice}
                    </span>
                    <span className="text-xl text-gray-600 font-semibold">
                      $
                    </span>
                  </div>

                  {/* Old Price & Savings - Secondary */}
                  {prod?.oldPrice && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg text-gray-400 line-through">
                        {prod?.oldPrice} $
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                        {language === "ar" ? "توفير" : "Save"}{" "}
                        {savingsAmount.toLocaleString("en-US")}{" "}
                        $
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Stock Indicator */}
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

              {/* Quantity Selector & Add to Cart - Grouped */}
              <div className="flex items-stretch gap-3 flex-wrap">
                {/* Quantity Selector */}
                <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
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
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Add to Cart - Primary CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {t("addToCart")}
                </button>
              </div>
            </div>

            {/* Description */}
            {prod?.description && (
              <div className="mb-6 bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-[#009FE3]" />
                  {t("description")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {prod?.description}
                </p>
              </div>
            )}

            {/* Color Variants - Improved */}
            {hasColors && (
              <div className="mb-6 bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-[#009FE3]" />
                  {language === "ar" ? "الألوان المتاحة" : "Available Colors"}
                </h3>
                <ColorSwatch
                  variants={prod?.colorVariants}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  onColorHover={setHoveredColor}
                  language={language}
                  size="lg"
                  showLabel={true}
                />
              </div>
            )}

            {/* Charge Options - Improved */}
            {hasChargeOptions && (
              <div className="mb-6 bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-[#009FE3]" />
                  {language === "ar" ? "خيارات الشحن" : "Charge Options"}
                </h3>
                <ChargeOptionSlider
                  options={prod?.chargeOptions}
                  selectedId={selectedChargeOption || ""}
                  onSelect={setSelectedChargeOption}
                  language={language}
                />
              </div>
            )}

            {/* Key Features */}
            {prod?.specs && prod.specs.length > 0 && (
              <div className="mb-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-[#009FE3]" />
                  {language === "ar" ? "المميزات الرئيسية" : "Key Features"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prod.specs.slice(0, 4).map((spec: any, index: number) => {
                    const IconComponent = iconMap[spec.icon] || Settings;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#009FE3] transition-colors flex items-center gap-3"
                      >
                        <div className="bg-gradient-to-br from-[#009FE3] to-[#007BC7] p-2.5 rounded-lg flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-0.5">
                            {spec.title}
                          </p>
                          <p className="font-bold text-gray-900 truncate">
                            {spec.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Tabs Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tab Headers with Icons */}
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
                  <span>{language === "ar" ? "الوصف" : "Description"}</span>
                  {tabState === "description" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7]"></div>
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
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7]"></div>
              )}
            </button>

            <button
              onClick={() => setTabState("reviews")}
              className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative flex items-center justify-center gap-2 ${
                tabState === "reviews"
                  ? "text-[#009FE3] bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              } ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>{language === "ar" ? "التقييمات" : "Reviews"}</span>
              <Badge className="bg-[#009FE3] text-white hover:bg-[#009FE3]">
                {language === "ar" ? "1.2k" : "1.2k"}
              </Badge>
              {tabState === "reviews" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7]"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* Description Tab */}
            {tabState === "description" && (
              <div className="animate-fadeIn">
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

                      {/* Additional details */}
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <PackageCheck className="w-5 h-5 text-[#009FE3]" />
                          {language === "ar" ? "ما يأتي في العلبة" : "What's in the box"}
                        </h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {prod?.name}
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {language === "ar" ? "دليل المستخدم" : "User Manual"}
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {language === "ar"
                              ? "بطاقة الضمان"
                              : "Warranty Card"}
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {language === "ar" ? "ملحقات إضافية" : "Accessories"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      {language === "ar"
                        ? "لا يوجد وصف متاح"
                        : "No description available"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Specifications Tab - Enhanced Table */}
            {tabState === "specs" && (
              <div className="animate-fadeIn">
                {prod?.specs && prod.specs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prod.specs.map((spec: any, index: number) => {
                      const IconComponent = iconMap[spec.icon] || Settings;
                      return (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-[#009FE3] transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-[#009FE3] to-[#007BC7] p-3 rounded-xl shadow-md flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-white" />
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
                  <div className="text-center py-12 text-gray-500">
                    {language === "ar"
                      ? "لا توجد مواصفات متاحة"
                      : "No specifications available"}
                  </div>
                )}

                {/* Offers Section */}
                {hasOffers && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Star className="w-6 h-6 text-[#009FE3]" />
                      {t("offers")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prod?.productOffers?.map((offer: any) => (
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
                              <p className="text-gray-700">{offer.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {tabState === "reviews" && (
              <div className="animate-fadeIn">
                {/* Reviews Summary */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50/50 rounded-2xl p-8 mb-8 border border-yellow-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Overall Rating */}
                    <div className="text-center md:text-start">
                      <div className="text-6xl font-bold text-[#009FE3] mb-2">
                        {prod?.rating || "4.8"}
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(prod?.rating || 4.8)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">
                        {language === "ar"
                          ? "بناءً على 1,234 تقييم"
                          : "Based on 1,234 reviews"}
                      </p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600 w-12">
                            {stars} {language === "ar" ? "نجوم" : "stars"}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full"
                              style={{
                                width: `${
                                  stars === 5
                                    ? 75
                                    : stars === 4
                                    ? 15
                                    : stars === 3
                                    ? 5
                                    : stars === 2
                                    ? 3
                                    : 2
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-end">
                            {stars === 5
                              ? "75%"
                              : stars === 4
                              ? "15%"
                              : stars === 3
                              ? "5%"
                              : stars === 2
                              ? "3%"
                              : "2%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: language === "ar" ? "أحمد محمد" : "Ahmed Mohammed",
                      rating: 5,
                      date: language === "ar" ? "منذ أسبوع" : "1 week ago",
                      review:
                        language === "ar"
                          ? "منتج ممتاز! الجودة عالية جداً والسعر مناسب. أنصح بالشراء."
                          : "Excellent product! Very high quality and fair price. Highly recommended.",
                      verified: true,
                    },
                    {
                      name: language === "ar" ? "سارة علي" : "Sara Ali",
                      rating: 4,
                      date: language === "ar" ? "منذ أسبوعين" : "2 weeks ago",
                      review:
                        language === "ar"
                          ? "جيد جداً ولكن التوصيل كان متأخر قليلاً. المنتج كما هو موصوف."
                          : "Very good but delivery was slightly delayed. Product as described.",
                      verified: true,
                    },
                    {
                      name: language === "ar" ? "خالد حسن" : "Khaled Hassan",
                      rating: 5,
                      date: language === "ar" ? "منذ شهر" : "1 month ago",
                      review:
                        language === "ar"
                          ? "أفضل شراء قمت به هذا العام! الأداء رائع والتصميم أنيق."
                          : "Best purchase I made this year! Great performance and elegant design.",
                      verified: false,
                    },
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#009FE3] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900">
                              {review.name}
                            </h4>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {language === "ar" ? "مشتري موثق" : "Verified"}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {review.review}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
