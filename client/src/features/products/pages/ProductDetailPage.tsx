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
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";
import { ColorSwatch } from  "../../../components/ui/ColorSwatch";
import { ChargeOptionSlider } from "../../../components/ui/ChargeOptionSlider";
import { OfferDetailsCard } from "../../offer/components/OfferDetailsCard";
import { RelatedProductsWithDiscount } from "../../offer/components/RelatedProductsWithDiscount";
import { calculateDiscountedPrice, getProductById, getProductOffers, products } from "../../../data/products";

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
      const found = getProductById(id);
      setLocalProduct(found ?? null);
    } else if (stateProduct && !localProduct) {
      setLocalProduct(stateProduct);
    }
  }, [id, product, location, localProduct]);

  const prod = product ?? localProduct;

  const productOffers = prod?.id ? getProductOffers(prod.id) : [];
  const hasNewOffers = productOffers.length > 0;

  const derivedCategory =
    categoryName ||
    (language === "ar"
      ? prod?.categoryAr || prod?.category
      : prod?.category || prod?.categoryAr);
  const derivedBrand = brandName || prod?.brand;

  const breadcrumbCategory =
    typeof derivedCategory === "string" ? derivedCategory : "";
  const breadcrumbBrand = typeof derivedBrand === "string" ? derivedBrand : "";

  const brandRoute = breadcrumbBrand
    ? breadcrumbCategory
      ? `/brand/${encodeURIComponent(breadcrumbCategory)}/${encodeURIComponent(breadcrumbBrand)}`
      : `/brand/${encodeURIComponent(breadcrumbBrand)}`
    : "";

  const stateCrumbs = (location.state as any)?.breadcrumbs as
    | { label: string; href?: string }[]
    | undefined;

  const fallbackCrumbs = [
    ...(breadcrumbCategory
      ? [
          {
            label: breadcrumbCategory,
            href: `/category/${encodeURIComponent(breadcrumbCategory)}`,
          },
        ]
      : []),
    ...(breadcrumbBrand
      ? [
          {
            label: breadcrumbBrand,
            href: brandRoute || `/brand/${encodeURIComponent(breadcrumbBrand)}`,
          },
        ]
      : []),
  ];

  const breadcrumbs = Array.isArray(stateCrumbs) && stateCrumbs.length > 0
    ? stateCrumbs
    : fallbackCrumbs;

  // fallback handlers when component used as a routed page
  const resetProductDetail = props.resetProductDetail ?? (() => navigate(-1));
  const propAddToCart = props.addToCart;
  const [heroProductInCart, setHeroProductInCart] = useState(false);

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
      setHeroProductInCart(true);
    } catch {
      // noop
    }
  });

  const hasColors = !!prod?.colorVariants?.length;
  const hasChargeOptions = !!prod?.chargeOptions?.length;

  // State for color and charge options
  const [selectedColor, setSelectedColor] = useState(prod?.colorVariants?.[0]?.name || "");
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(prod?.chargeOptions?.[0]?.id || null);
  const [quantity, setQuantity] = useState(1);
  const [tabState, setTabState] = useState<"description" | "specs">("description");

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
  const numericPrice = (value: any) => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    return parseFloat(String(value).replace(/,/g, "")) || 0;
  };

  const basePrice = typeof prod?.basePrice === 'number'
    ? prod.basePrice
    : numericPrice(prod?.price);
  const currentPrice = currentChargeOption
    ? currentChargeOption.price
    : numericPrice(prod?.price);



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
            <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
              <button
                onClick={resetProductDetail}
                className="text-gray-600 hover:text-[#009FE3] font-semibold"
              >
                {language === "ar" ? "??????" : "Back"}
              </button>
              {breadcrumbs.map((crumb, index) => (
                <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  <ChevronRight className={`w-4 h-4 text-gray-400 ${language === "ar" ? "rotate-180" : ""}`} />
                  {crumb.href ? (
                    <button
                      onClick={() => navigate(crumb.href || "")}
                      className="text-gray-600 hover:text-[#009FE3]"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-600">{crumb.label}</span>
                  )}
                </div>
              ))}
              {prod?.name && (
                <div className="flex items-center gap-2">
                  <ChevronRight className={`w-4 h-4 text-gray-400 ${language === "ar" ? "rotate-180" : ""}`} />
                  <span className="text-[#009FE3] font-semibold truncate max-w-[200px] sm:max-w-md">
                    {prod?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-200">
              <img
                src={currentImage}
                alt={prod?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {prod?.name}
            </h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-bold text-[#009FE3]">{displayPrice}</span>
              <span className="text-xl text-gray-600 font-semibold">$</span>
            </div>
            {prod?.oldPrice && (
              <div className="text-lg text-gray-400 line-through mb-6">
                {prod?.oldPrice} $
              </div>
            )}

            <div className="flex items-stretch gap-3 flex-wrap mb-6">
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

              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300"
              >
                {language === "ar" ? "??? ?????" : "Add to Cart"}
              </button>
            </div>

            {productOffers.length > 0 && (
              <div className="mt-4">
                <OfferDetailsCard
                  offers={productOffers}
                  language={language}
                  basePrice={basePrice}
                  currentPrice={currentPrice}
                  onProductClick={(productId) => navigate(`/product/${productId}`)}
                />
              </div>
            )}

            {productOffers.some((o) => o.type === "bundle_discount") && (
              <div className="mt-6">
                <RelatedProductsWithDiscount
                  products={(() => {
                    const bundleOffer = productOffers.find((o) => o.type === "bundle_discount") as any;
                    if (!bundleOffer) return [];
                    return bundleOffer.relatedProductIds
                      .map((id: number) => {
                        const rel = products.find((p) => p.id === id);
                        if (!rel) return null;
                        return {
                          id: rel.id,
                          name: rel.name,
                          nameAr: rel.nameAr,
                          image: rel.image,
                          originalPrice:
                            rel.basePrice ||
                            parseFloat((rel.price || "0").replace(/,/g, "")),
                          discountPercentage: bundleOffer.discountPercentage,
                        };
                      })
                      .filter(Boolean);
                  })()}
                  language={language}
                  heroProductAdded={heroProductInCart}
                  onAddToCart={(productId) => {
                    const rel = products.find((p) => p.id === productId);
                    if (rel && cart.addToCart) {
                      cart.addToCart(rel, { quantity: 1 });
                    }
                  }}
                />
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

              </div>
            )}

            
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
