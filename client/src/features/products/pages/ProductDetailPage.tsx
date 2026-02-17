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
  Edit3
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";
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
  getProductOffers,
  products,
} from "../../../data/products";
import { EditableText } from "../../../components/ui/EditableText";
import { EditableImage } from "../../../components/ui/EditableImage";
import { KeyFeaturesEditor } from "../../../components/ui/KeyFeaturesEditor";
import { InlineProductEditor } from "../../../components/ui/InlineProductEditor";

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

export function ProductDetailPage(props: ProductDetailPageProps) {
  const { product, categoryName, brandName, userPermissions = { canEditContent: true }, onSaveProductContent } = props;
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const cart = useCart();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();

  const [localProduct, setLocalProduct] = useState<any | null>(
    product ?? (location.state && (location.state as any).product) ?? null,
  );

  useEffect(() => {
    const stateProduct =
      (location.state && (location.state as any).product) ?? null;
    if (!product && !stateProduct && id) {
      const found = getProductById(id);
      setLocalProduct(found ?? null);
    } else if (stateProduct && !localProduct) {
      setLocalProduct(stateProduct);
    }
  }, [id, product, location, localProduct]);

  const prod = product ?? localProduct;
  const productOffers = prod?.id ? getProductOffers(prod.id) : [];
  const hasOffers = productOffers.length > 0;

  const hasColors = !!prod?.colorVariants?.length;
  const hasChargeOptions = !!prod?.chargeOptions?.length;

  const [selectedColor, setSelectedColor] = useState(
    prod?.colorVariants?.[0]?.name || "",
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedChargeOption, setSelectedChargeOption] = useState(
    prod?.chargeOptions?.[0]?.id || null,
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
    ? prod?.colorVariants?.find((v: any) => v.name === displayColor)
    : null;

  // Get images array for current color (support both single image and images array)
  const currentImages = currentColorVariant?.images || 
    (currentColorVariant?.image ? [currentColorVariant.image] : null) ||
    (prod?.images && Array.isArray(prod.images) ? prod.images : [prod?.image]).filter(Boolean);

  const currentImage = currentImages && currentImages.length > 0 
    ? currentImages[0]
    : prod?.image;

  const showImagePagination = !hasColors && currentImages.length > 1;

  const currentChargeOption = prod?.chargeOptions?.find(
    (opt: any) => opt.id === selectedChargeOption,
  );
  const displayPrice = currentChargeOption
    ? currentChargeOption.price.toLocaleString("en-US")
    : prod?.price;

  const numericPrice = (value: any) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    return parseFloat(String(value).replace(/,/g, "")) || 0;
  };

  const basePrice =
    typeof prod?.basePrice === "number"
      ? prod.basePrice
      : numericPrice(prod?.price);
  const currentPrice = currentChargeOption
    ? currentChargeOption.price
    : numericPrice(prod?.price);

  const savingsAmount = prod?.oldPrice
    ? numericPrice(prod.oldPrice) - currentPrice
    : 0;

  const discountPercentage = prod?.oldPrice
    ? Math.round(((numericPrice(prod.oldPrice) - currentPrice) / numericPrice(prod.oldPrice)) * 100)
    : 0;

  const inStock = currentColorVariant
    ? currentColorVariant.inStock !== false
    : true;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!cart.addToCart || !prod) return;

    const chosenColor = hasColors ? selectedColor : undefined;
    const currentColorVar = hasColors
      ? prod?.colorVariants?.find((v: any) => v.name === chosenColor)
      : null;
    const chosenColorHex = currentColorVar?.hexCode ?? null;
    const chosenVariantImage = currentImage ?? prod?.image ?? null;

    const selectedCharge = selectedChargeOption
      ? prod?.chargeOptions?.find(
          (o: any) => String(o.id) === String(selectedChargeOption),
        )
      : null;
    const chargeLabel = selectedCharge
      ? language === "ar"
        ? selectedCharge.valueAr || selectedCharge.value
        : selectedCharge.value
      : null;

    cart.addToCart(prod, {
      color: chosenColor,
      variantColorHex: chosenColorHex,
      variantImage: chosenVariantImage,
      chargeOptionId: selectedChargeOption ?? null,
      chargeOptionLabel: chargeLabel ?? null,
      quantity,
    });
    setHeroProductInCart(true);
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

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50"
    >
      {/* Editable Badge removed from fixed position; rendered below breadcrumb */}
      {/* Improved Breadcrumb */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-1.5 text-gray-600 hover:text-[#009FE3] transition-colors duration-200 flex-shrink-0"
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

            <button
              onClick={() => navigate(-1)}
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
            <span className="font-bold text-sm">{language === "ar" ? "وضع التعديل مُفعّل" : "Edit Mode Active"}</span>
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
                        <CarouselItem key={`img-${prod?.id}-${displayColor}-${index}`} className="w-full flex-shrink-0">
                          <div className="relative">
                           <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border border-gray-200">
                              {userPermissions.canEditContent ? (
                                <EditableImage
                                  src={image}
                                  alt={`${prod?.name} - ${index + 1}`}
                                  onSave={(newImageUrl) => {
                                    if (onSaveProductContent) {
                                      if (hasColors && selectedColor && prod?.colorVariants) {
                                        const updatedColorVariants = prod.colorVariants.map((variant: any) => {
                                          if (variant.name === selectedColor) {
                                            const updatedImages = variant.images 
                                              ? [...variant.images]
                                              : [variant.image];
                                            updatedImages[index] = newImageUrl;
                                            
                                            return {
                                              ...variant,
                                              image: index === 0 ? newImageUrl : variant.image,
                                              images: updatedImages,
                                            };
                                          }
                                          return variant;
                                        });
                                        
                                        onSaveProductContent(prod.id, {
                                          ...prod,
                                          colorVariants: updatedColorVariants,
                                        });
                                      } else {
                                        onSaveProductContent(prod.id, {
                                          ...prod,
                                          image: newImageUrl,
                                        });
                                      }
                                    }
                                  }}
                                  className="w-full h-full object-cover rounded-2xl"
                                  language={language}
                                  userPermissions={userPermissions}
                                />
                              ) : (
                                <div className="relative w-full h-full">
                                  {!loadedImages[`main-${index}-${displayColor}`] && (
                                    <div className="absolute inset-0 shimmer-surface rounded-2xl" />
                                  )}
                                  <img
                                    src={image}
                                    alt={`${prod?.name} - ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onLoad={() => markImageLoaded(`main-${index}-${displayColor}`)}
                                    onError={() => markImageLoaded(`main-${index}-${displayColor}`)}
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
                                  if (onSaveProductContent) {
                                    onSaveProductContent(prod.id, {
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
                                {!loadedImages["main-fallback"] && (
                                  <div className="absolute inset-0 shimmer-surface rounded-2xl" />
                                )}
                                <img
                                  src={prod?.image}
                                  alt={prod?.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  onLoad={() => markImageLoaded("main-fallback")}
                                  onError={() => markImageLoaded("main-fallback")}
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

                {discountPercentage > 0 && (
                  <div className={`absolute top-4 ${language === "ar" ? "left-6" : "right-6"} flex items-start justify-end`}>
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-xl font-bold shadow-lg">
                      {language === "ar" ? "خصم" : "SAVE"} {discountPercentage}%
                    </div>
                  </div>
                )}

                {/* Colors Section - Under Image */}
                {hasColors && prod?.colorVariants && prod.colorVariants.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
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
                              {!loadedImages[`thumb-${index}-${displayColor}`] && (
                                <div className="absolute inset-0 shimmer-surface" />
                              )}
                              <img
                                src={image}
                                alt={`${prod?.name} - Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onLoad={() => markImageLoaded(`thumb-${index}-${displayColor}`)}
                                onError={() => markImageLoaded(`thumb-${index}-${displayColor}`)}
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
                  if (onSaveProductContent) {
                    onSaveProductContent(prod.id, {
                      ...prod,
                      name: newName,
                    });
                  }
                }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight"
                editClassName="text-2xl sm:text-3xl font-bold"
                language={language}
                userPermissions={userPermissions}
                maxLength={150}
                placeholder={language === "ar" ? "اسم المنتج..." : "Product name..."}
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
                      $
                    </span>
                  </div>

                  {prod?.oldPrice && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg text-gray-400 line-through">
                        {prod?.oldPrice} $
                      </span>
                      <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-lg text-sm font-semibold">
                        {language === "ar" ? "توفير" : "Save"}{" "}
                        {savingsAmount.toLocaleString("en-US")} $
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

              <div className="flex items-stretch gap-3 flex-wrap">
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
              <div className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#009FE3]" />
                  {t("description")}
                </h3>
                <EditableText
                  value={prod?.description}
                  onSave={(newDescription) => {
                    if (onSaveProductContent) {
                      onSaveProductContent(prod.id, {
                        ...prod,
                        description: newDescription,
                      });
                    }
                  }}
                  className="text-gray-600 leading-relaxed text-sm sm:text-base"
                  editClassName="text-sm sm:text-base"
                  language={language}
                  userPermissions={userPermissions}
                  multiline={true}
                  maxLength={300}
                  placeholder={language === "ar" ? "وصف المنتج..." : "Product description..."}
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
                  options={prod.chargeOptions}
                  selectedId={selectedChargeOption || ""}
                  onSelect={setSelectedChargeOption}
                  language={language}
                />
              </div>
            )}

            {/* Key Features */}
            {prod?.specs && prod.specs.length > 0 && (
              <div className="mb-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 relative group">
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
                {userPermissions.canEditContent  && (
                  <KeyFeaturesEditor
                    specs={prod.specs}
                    selectedSpecs={prod.specs.slice(0, 4)}
                    onSave={(selectedSpecs) => {
                      onSaveProductContent(prod.id, {
                        ...prod,
                        specs: [
                          ...selectedSpecs,
                          ...prod.specs.slice(4),
                        ],
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
                        offers={productOffers}
                        language={language}
                        basePrice={basePrice}
                        currentPrice={calculateDiscountedPrice(basePrice, productOffers)}
                      />
                    </div>

                    {productOffers.some((o) => o.type === "bundle_discount") && (
                      <div className="mb-6">
                        <RelatedProductsWithDiscount
                          products={(() => {
                            const bundleOffer = productOffers.find(
                              (o) => o.type === "bundle_discount",
                            ) as any;
                            if (!bundleOffer) return [];
                            return bundleOffer.relatedProductIds
                              .map((relatedId: number) => {
                                const rel = products.find((p) => p.id === relatedId);
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
                          heroProductAdded={heroProductInCart || isHeroInCart}
                          onAddToCart={(productId) => {
                            const rel = products.find((p) => p.id === productId);
                            if (!rel || !cart.addToCart || !prod?.id) return;
                            const alreadyAdded = cart.cartItems?.some((item) => {
                              const itemProductId = item.productId ?? Number(item.id);
                              return (
                                itemProductId === productId &&
                                item.isBundleItem &&
                                item.linkedToProductId === prod.id
                              );
                            });
                            if (alreadyAdded) return;

                            const bundleOffer = productOffers.find(
                              (o) => o.type === "bundle_discount",
                            ) as any;
                            if (!bundleOffer) return;

                            const base = rel.basePrice || numericPrice(rel.price);
                            const discounted = Math.max(
                              0,
                              Math.round(base * (1 - bundleOffer.discountPercentage / 100)),
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
                        {language === "ar" ? "لا توجد عروض متاحة لهذا المنتج" : "No offers available for this product"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tabState === "description" && (
              <div className="animate-fadeIn">
                {/* Inline Editor for Description Only */}
                {userPermissions.canEditContent  && (
                  <InlineProductEditor
                    product={prod}
                    userPermissions={userPermissions}
                    onSave={(updatedContent) => onSaveProductContent(prod.id, updatedContent)}
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
                            {t("admin.content.boxTitle") || (language === "ar" ? "ما يأتي في العلبة" : "What's in the box")}
                          </h4>
                          {userPermissions.canEditContent && (
                            <InlineProductEditor
                              product={prod}
                              userPermissions={userPermissions}
                              onSave={(updatedContent) => onSaveProductContent(prod.id, updatedContent)}
                              mode="box"
                            />
                          )}

                          <ul className="space-y-2 text-gray-600">
                            {(() => {
                              const raw = prod?.inTheBox || prod?.box || prod?.boxItems || [prod?.name, language === "ar" ? "دليل المستخدم" : "User Manual", language === "ar" ? "بطاقة الضمان" : "Warranty Card", language === "ar" ? "ملحقات إضافية" : "Accessories"];
                              return (raw || []).filter(Boolean).map((item: any) => {
                                if (typeof item === "string") return item;
                                if (item && (item.en || item.ar)) {
                                  return language === "ar"
                                    ? `${item.ar || item.en}${item.en ? " / " + item.en : ""}`
                                    : `${item.en || item.ar}${item.ar ? " / " + item.ar : ""}`;
                                }
                                if (item && (item.nameEn || item.valueEn || item.nameAr || item.valueAr)) {
                                  return language === "ar"
                                    ? item.nameAr || item.valueAr || item.nameEn || item.valueEn
                                    : item.nameEn || item.valueEn || item.nameAr || item.valueAr;
                                }
                                return String(item);
                              }).map((display: any, idx: number) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  {display}
                                </li>
                              ));
                            })()}
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

            {tabState === "specs" && (
              <div className="animate-fadeIn">
                {/* Inline Editor for Specifications Only */}
                {userPermissions.canEditContent  && (
                  <InlineProductEditor
                    product={prod}
                    userPermissions={userPermissions}
                    onSave={(updatedContent) => onSaveProductContent(prod.id, updatedContent)}
                    mode="specifications"
                  />
                )}

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
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;


