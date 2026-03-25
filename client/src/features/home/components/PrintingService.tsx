import {
  ArrowRight,
  Check,
  Info,
  Package,
  Printer,
  ShoppingCart,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { CURRENCY_LABEL } from "../../../utils/currency";

interface PrintingServiceProps {
  language: "ar" | "en";
  onClose: () => void;
  onAddToCart: (item: any) => void;
}

interface PrintProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  basePrice: number;
  sizes?: string[];
  colors: string[];
  image: string;
  raw: any;
}

export function PrintingService({
  language,
  onClose,
  onAddToCart,
}: PrintingServiceProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<1 | 2>(1);
  const [printProducts, setPrintProducts] = useState<PrintProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const t = {
    ar: {
      title: "خدمة الطباعة المخصصة",
      subtitle: "صمم منتجك الفريد معنا",
      selectProduct: "اختر المنتج",
      confirm: "التأكيد",
      chooseType: "اختر نوع المنتج",
      uploadDesign: "ارفع تصميمك",
      orAddText: "أو أضف نصاً",
      textPlaceholder: "اكتب نصك هنا...",
      selectColor: "اختر اللون",
      selectSize: "اختر المقاس",
      quantity: "الكمية",
      price: "السعر",
      basePrice: "السعر الأساسي",
      totalPrice: "السعر الإجمالي",
      addToCart: "إضافة للسلة",
      back: "رجوع",
      next: "التالي",
      syp: CURRENCY_LABEL,
      uploadImage: "رفع صورة",
      imageUploaded: "تم رفع الصورة",
      imageNote: "سيتم تسليم صورة التصميم إلى صالة العرض بعد تأكيد الطلب",
      preview: "المعاينة",
      productDetails: "تفاصيل المنتج",
      designType: "نوع التصميم",
      imageDesign: "تصميم صورة",
      textDesign: "تصميم نصي",
      color: "اللون",
      size: "المقاس",
      notes: "ملاحظات",
      note1: "جودة طباعة عالية الدقة",
      note2: "ألوان ثابتة لا تتأثر بالغسيل",
      note3: "توصيل خلال 3-5 أيام عمل",
      imageRequirements: "متطلبات الصورة",
      requirement1: "الحجم الأدنى: 1000 × 1000 بكسل",
      requirement2: "الحجم الأقصى: 10 ميجابايت",
      requirement3: "الصيغ المقبولة: PNG, JPG, JPEG",
      requirement4: "الدقة الموصى بها: 300 DPI",
      requirement5: "خلفية شفافة (PNG) للنتائج الأفضل",
      imageGuidelines: "إرشادات التصميم",
      guideline1: "استخدم صور عالية الجودة",
      guideline2: "تجنب الصور المنخفضة الدقة",
      guideline3: "الألوان الزاهية تعطي نتائج أفضل",
      guideline4: "تجنب التفاصيل الدقيقة جداً",
    },
    en: {
      title: "Custom Printing Service",
      subtitle: "Design your unique product with us",
      selectProduct: "Select Product",
      confirm: "Confirm",
      chooseType: "Choose product type",
      uploadDesign: "Upload your design",
      orAddText: "Or add text",
      textPlaceholder: "Type your text here...",
      selectColor: "Select color",
      selectSize: "Select size",
      quantity: "Quantity",
      price: "Price",
      basePrice: "Base Price",
      totalPrice: "Total Price",
      addToCart: "Add to Cart",
      back: "Back",
      next: "Next",
      syp: CURRENCY_LABEL,
      uploadImage: "Upload Image",
      imageUploaded: "Image Uploaded",
      imageNote: "Design image will be provided to the showroom after order confirmation",
      preview: "Preview",
      productDetails: "Product Details",
      designType: "Design Type",
      imageDesign: "Image Design",
      textDesign: "Text Design",
      color: "Color",
      size: "Size",
      notes: "Notes",
      note1: "High-resolution printing quality",
      note2: "Permanent colors, wash-resistant",
      note3: "Delivery within 3-5 business days",
      imageRequirements: "Image Requirements",
      requirement1: "Minimum size: 1000 × 1000 pixels",
      requirement2: "Maximum size: 10 MB",
      requirement3: "Accepted formats: PNG, JPG, JPEG",
      requirement4: "Recommended resolution: 300 DPI",
      requirement5: "Transparent background (PNG) for best results",
      imageGuidelines: "Design Guidelines",
      guideline1: "Use high-quality images",
      guideline2: "Avoid low-resolution images",
      guideline3: "Bright colors give better results",
      guideline4: "Avoid very fine details",
    },
  };

  useEffect(() => {
    let mounted = true;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

    const extractColors = (raw: any) => {
      const list = Array.isArray(raw) ? raw : [];
      return list
        .map((item) => {
          if (typeof item === "string") return item;
          if (!item || typeof item !== "object") return "";
          return item.hex || item.color || item.value || item.name || "";
        })
        .filter((value) => String(value).trim().length > 0);
    };

    const extractSizes = (raw: any) => {
      const list = Array.isArray(raw) ? raw : [];
      return list
        .map((item) => {
          if (typeof item === "string") return item;
          if (!item || typeof item !== "object") return "";
          return item.size || item.label || item.value || "";
        })
        .filter((value) => String(value).trim().length > 0);
    };

    const load = async () => {
      setIsLoadingProducts(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams();
        params.set("brand_code", "3002");
        params.set("cat_code", "04");
        params.set("limit", "200");
        params.set("card", "1");
        params.set("count", "0");
        const res = await fetch(`${apiBase}/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load products");
        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        const mapped: PrintProduct[] = items.map((p: any) => ({
          id: String(p.id || p.stk_code || p._id || Math.random()),
          nameAr: p.nameAr || p.name || "",
          nameEn: p.name || p.nameEn || "",
          basePrice: Number(p.price || 0),
          sizes: extractSizes(p.sizes || p.variants || p.sizeVariants),
          colors: extractColors(p.colorVariants || p.colors),
          image: p.image || "",
          raw: p,
        }));
        if (mounted) {
          setPrintProducts(mapped);
          setIsLoadingProducts(false);
        }
      } catch (err) {
        if (mounted) {
          setLoadError(language === "ar" ? "تعذر تحميل المنتجات" : "Failed to load products");
          setIsLoadingProducts(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [language]);

  const selectedProduct = printProducts.find((p) => p.id === selectedProductId);
  const totalPrice = selectedProduct ? selectedProduct.basePrice * quantity : 0;

  useEffect(() => {
    setSelectedColor("");
    setSelectedSize("");
    setCustomText("");
    setQuantity(1);
  }, [selectedProductId]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const item = {
      ...selectedProduct.raw,
      id: selectedProduct.raw?.id || selectedProduct.id,
      name: language === "ar" ? selectedProduct.nameAr : selectedProduct.nameEn,
      nameAr: selectedProduct.nameAr,
      price: totalPrice,
      quantity,
      image: selectedProduct.image,
      customization: {
        color: selectedColor,
        size: selectedSize,
        design: customText ? "text" : "showroom",
        designContent: customText || "",
      },
    };

    onAddToCart(item);
    onClose();
  };

  const requiresColor = (selectedProduct?.colors || []).length > 0;
  const requiresSize = (selectedProduct?.sizes || []).length > 0;
  const canProceedToStep2 = selectedProductId !== null;

  // Product Preview Component
  const ProductPreview = () => {
    if (!selectedProduct) {
      return (
        <div className="aspect-square rounded-2xl border-4 border-gray-200 flex items-center justify-center bg-gray-50"  style={{ zIndex: 2000 }}>
          <div className="text-center text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-2" />
            <p>{language === "ar" ? "اختر المنتج للمتابعة" : "Select a product to continue"}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="aspect-square rounded-2xl border-4 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center"  style={{ zIndex: 2000 }}>
        <div className="text-center p-8">
          {selectedProduct.image ? (
            <img
              src={selectedProduct.image}
              alt={language === "ar" ? selectedProduct.nameAr : selectedProduct.nameEn}
              className="w-40 h-40 object-contain mx-auto mb-4"
            />
          ) : (
            <Package className="w-20 h-20 text-purple-300 mx-auto mb-4" />
          )}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "ar" ? selectedProduct.nameAr : selectedProduct.nameEn}
          </h3>
          {selectedColor && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <span className="text-gray-600">{language === "ar" ? "اللون المختار" : "Selected Color"}</span>
            </div>
          )}
          {customText && (
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-200">
              <div className="text-gray-700">
                <p className="text-sm font-semibold mb-2">{language === "ar" ? "النص:" : "Text:"}</p>
                <p className="text-lg font-bold">{customText}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
                  style={{ zIndex: 2000 }}

    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8"
          style={{ zIndex: 2000 }}

        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Printer className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t[language].title}</h2>
                <p className="text-purple-100">{t[language].subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all hover:scale-110 active:scale-95 flex-shrink-0 shadow-lg border-2 border-white/30"
              aria-label="Close"
              title={language === "ar" ? "إغلاق" : "Close"}
            >
              <X className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

        {/* Steps Progress */}
        <div className="flex items-center gap-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex items-center gap-2 ${
                  step >= s ? "text-white" : "text-purple-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? "bg-white text-purple-500"
                      : "bg-white/20 text-purple-200"
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                <span className="font-semibold hidden sm:inline">
                  {s === 1
                    ? t[language].selectProduct
                    : t[language].confirm}
                </span>
              </div>
              {s < 2 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    step > s ? "bg-white" : "bg-white/20"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Step 1: Select Product */}
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-500" />
                {t[language].chooseType}
              </h3>
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={`print-skeleton-${idx}`} className="p-6 rounded-2xl border-2 border-gray-200">
                      <div className="w-full h-40 rounded-xl shimmer-surface mb-4" />
                      <div className="h-4 w-3/4 mx-auto shimmer-surface mb-2" />
                      <div className="h-4 w-1/2 mx-auto shimmer-surface" />
                    </div>
                  ))}
                </div>
              ) : loadError ? (
                <div className="text-center text-red-600 font-semibold">{loadError}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {printProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-center ${
                        selectedProductId === product.id
                          ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                          : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                      }`}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={language === "ar" ? product.nameAr : product.nameEn}
                          className="w-full h-40 object-contain rounded-xl mb-4"
                        />
                      ) : (
                        <div className="w-full h-40 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {language === "ar" ? product.nameAr : product.nameEn}
                      </h4>
                      <p className="text-2xl font-bold text-purple-500 mb-1">
                        {product.basePrice.toLocaleString()} {t[language].syp}
                      </p>
                      <p className="text-sm text-gray-600">{t[language].basePrice}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && selectedProduct && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-500" />
                {t[language].productDetails}
              </h3>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div>
                    <ProductPreview />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-900 font-semibold">
                          {t[language].imageNote}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === "ar" ? "المنتج" : "Product"}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {language === "ar" ? selectedProduct.nameAr : selectedProduct.nameEn}
                      </p>
                    </div>

                    {selectedColor && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t[language].color}</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg border-2 border-gray-300"
                            style={{ backgroundColor: selectedColor }}
                          ></div>
                          <span className="font-semibold text-gray-700">
                            {selectedColor}
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedSize && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t[language].size}</p>
                        <p className="text-lg font-bold text-gray-900">{selectedSize}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t[language].designType}</p>
                      <p className="text-lg font-bold text-gray-900">
                        {customText ? t[language].textDesign : (language === "ar" ? "لطفاً تسليم التصميم في صالة العرض" : "Design provided at showroom")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t[language].quantity}</p>
                      <p className="text-lg font-bold text-gray-900">{quantity}</p>
                    </div>

                    <div className="pt-4 border-t-2 border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">{t[language].totalPrice}</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {totalPrice.toLocaleString()} {t[language].syp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t-2 border-gray-200 p-6 flex items-center justify-between bg-gray-50 rounded-b-2xl">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                {t[language].back}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {step < 2 ? (
              <button
                onClick={() => {
                  if (step === 1 && canProceedToStep2) setStep(2);
                }}
                disabled={
                  step === 1 && !canProceedToStep2
                }
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {t[language].next}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {t[language].addToCart}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
