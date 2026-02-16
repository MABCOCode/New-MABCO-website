import { useState } from "react";
import {
  X,
  Printer,
  Upload,
  ShoppingCart,
  Check,
  Image as ImageIcon,
  Palette,
  Ruler,
  Package,
  ArrowRight,
  Info,
  AlertCircle,
  FileImage,
  Maximize,
  Layers,
} from "lucide-react";

interface PrintingServiceProps {
  language: "ar" | "en";
  onClose: () => void;
  onAddToCart: (item: any) => void;
}

type PrintType = "tshirt" | "hat" | "mug";

interface PrintProduct {
  type: PrintType;
  nameAr: string;
  nameEn: string;
  icon: string;
  basePrice: number;
  sizes?: string[];
  colors: string[];
  mockupImage: string;
}

const printProducts: PrintProduct[] = [
  {
    type: "tshirt",
    nameAr: "طباعة على تيشيرت",
    nameEn: "T-Shirt Printing",
    icon: "👕",
    basePrice: 150000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#FFFF00", "#00FF00", "#FF69B4", "#FFA500"],
    mockupImage: "https://images.unsplash.com/photo-1737094540182-d602f8a7dd1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGJsYW5rJTIwdC1zaGlydCUyMG1vY2t1cCUyMGZyb250fGVufDF8fHx8MTc3MDgwNDYyNXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    type: "hat",
    nameAr: "طباعة على قبعة",
    nameEn: "Hat Printing",
    icon: "🧢",
    basePrice: 100000,
    colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#00FF00", "#FFA500", "#8B4513"],
    mockupImage: "https://images.unsplash.com/photo-1691256676359-20e5c6d4bc92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFuayUyMGJhc2ViYWxsJTIwY2FwJTIwbW9ja3VwJTIwZnJvbnR8ZW58MXx8fHwxNzcwODA0NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    type: "mug",
    nameAr: "طباعة على كوب",
    nameEn: "Mug Printing",
    icon: "☕",
    basePrice: 80000,
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#FFFF00", "#00FF00", "#FF69B4"],
    mockupImage: "https://images.unsplash.com/photo-1622445272011-0f71226e7622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNvZmZlZSUyMG11ZyUyMG1vY2t1cCUyMGJsYW5rfGVufDF8fHx8MTc3MDgwNDYyNnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function PrintingService({
  language,
  onClose,
  onAddToCart,
}: PrintingServiceProps) {
  const [selectedType, setSelectedType] = useState<PrintType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imageError, setImageError] = useState<string>("");

  const t = {
    ar: {
      title: "خدمة الطباعة المخصصة",
      subtitle: "صمم منتجك الفريد معنا",
      selectProduct: "اختر المنتج",
      customize: "التخصيص",
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
      syp: "ل.س",
      uploadImage: "رفع صورة",
      imageUploaded: "تم رفع الصورة",
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
      customize: "Customize",
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
      syp: "SYP",
      uploadImage: "Upload Image",
      imageUploaded: "Image Uploaded",
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

  const selectedProduct = printProducts.find((p) => p.type === selectedType);
  const totalPrice = selectedProduct ? selectedProduct.basePrice * quantity : 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setImageError(
          language === "ar"
            ? "حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)"
            : "File size too large (max 10 MB)"
        );
        return;
      }

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setImageError(
          language === "ar"
            ? "نوع الملف غير مدعوم (PNG, JPG فقط)"
            : "File type not supported (PNG, JPG only)"
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Check image dimensions
          if (img.width < 1000 || img.height < 1000) {
            setImageError(
              language === "ar"
                ? "الصورة صغيرة جداً (الحد الأدنى 1000×1000 بكسل)"
                : "Image too small (minimum 1000×1000 pixels)"
            );
            return;
          }

          setUploadedImage(reader.result as string);
          setImageError("");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const item = {
      id: Date.now(),
      name: language === "ar" ? selectedProduct.nameAr : selectedProduct.nameEn,
      nameAr: selectedProduct.nameAr,
      price: totalPrice,
      quantity,
      image: uploadedImage || selectedProduct.mockupImage,
      customization: {
        type: selectedProduct.type,
        color: selectedColor,
        size: selectedSize,
        design: uploadedImage ? "image" : "text",
        designContent: uploadedImage || customText,
      },
    };

    onAddToCart(item);
    onClose();
  };

  const canProceedToStep2 = selectedType !== null;
  const canProceedToStep3 =
    selectedColor &&
    (selectedProduct?.sizes ? selectedSize : true) &&
    (uploadedImage || customText);

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
          <div className="text-8xl mb-4">{selectedProduct.icon}</div>
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
          {(uploadedImage || customText) && (
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-200">
              {uploadedImage ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">{language === "ar" ? "تم رفع التصميم" : "Design Uploaded"}</span>
                </div>
              ) : (
                <div className="text-gray-700">
                  <p className="text-sm font-semibold mb-2">{language === "ar" ? "النص:" : "Text:"}</p>
                  <p className="text-lg font-bold">{customText}</p>
                </div>
              )}
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
            {[1, 2, 3].map((s) => (
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
                      : s === 2
                      ? t[language].customize
                      : t[language].confirm}
                  </span>
                </div>
                {s < 3 && (
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {printProducts.map((product) => (
                  <button
                    key={product.type}
                    onClick={() => setSelectedType(product.type)}
                    className={`p-6 rounded-2xl border-2 transition-all text-center ${
                      selectedType === product.type
                        ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                        : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-6xl mb-4">{product.icon}</div>
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
            </div>
          )}

          {/* Step 2: Customize */}
          {step === 2 && selectedProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Options */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-purple-500" />
                  {t[language].customize}
                </h3>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {t[language].selectColor}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-lg border-4 transition-all ${
                          selectedColor === color
                            ? "border-purple-500 scale-110 shadow-lg"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <Check
                            className="w-full h-full p-2"
                            style={{ color: color === "#FFFFFF" || color === "#FFFF00" ? "#000000" : "#FFFFFF" }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                {selectedProduct.sizes && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t[language].selectSize}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-3 rounded-lg border-2 font-bold transition-all ${
                            selectedSize === size
                              ? "border-purple-500 bg-purple-50 text-purple-700 scale-105"
                              : "border-gray-300 text-gray-700 hover:border-purple-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Requirements */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-2 mb-3">
                    <FileImage className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="font-bold text-blue-900">{t[language].imageRequirements}</span>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <Maximize className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{t[language].requirement1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Package className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{t[language].requirement2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileImage className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{t[language].requirement3}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Layers className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{t[language].requirement4}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{t[language].requirement5}</span>
                    </li>
                  </ul>
                </div>

                {/* Design Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {t[language].uploadDesign}
                  </label>
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors cursor-pointer bg-gray-50">
                    {uploadedImage ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">{t[language].imageUploaded}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-600 font-semibold">
                          {t[language].uploadImage}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG (Max 10MB)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {imageError && (
                    <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{imageError}</span>
                    </div>
                  )}
                </div>

                {/* Text Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {t[language].orAddText}
                  </label>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={t[language].textPlaceholder}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Design Guidelines */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="font-bold text-purple-900">{t[language].imageGuidelines}</span>
                  </div>
                  <ul className="space-y-1 text-sm text-purple-800">
                    <li>• {t[language].guideline1}</li>
                    <li>• {t[language].guideline2}</li>
                    <li>• {t[language].guideline3}</li>
                    <li>• {t[language].guideline4}</li>
                  </ul>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {t[language].quantity}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-bold text-xl"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-gray-900 w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-purple-500" />
                  {t[language].preview}
                </h3>
                <ProductPreview />

                {/* Notes */}
                <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="font-bold text-purple-900">{t[language].notes}</span>
                  </div>
                  <ul className="space-y-1 text-sm text-purple-800">
                    <li>• {t[language].note1}</li>
                    <li>• {t[language].note2}</li>
                    <li>• {t[language].note3}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedProduct && (
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
                        {uploadedImage ? t[language].imageDesign : t[language].textDesign}
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
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                {t[language].back}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && canProceedToStep2) setStep(2);
                  if (step === 2 && canProceedToStep3) setStep(3);
                }}
                disabled={
                  (step === 1 && !canProceedToStep2) ||
                  (step === 2 && !canProceedToStep3)
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