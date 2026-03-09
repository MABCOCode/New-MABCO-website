import {
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Info,
  Upload,
  Search,
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
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import savedSpecTitlesManager from "../../data/savedSpecTitlesData";

// Content Guidelines & Limits
const CONTENT_LIMITS = {
  descriptionEn: { min: 50, max: 500, optimal: 200 },
  descriptionAr: { min: 50, max: 500, optimal: 200 },
  specName: { max: 50 },
  specValue: { max: 100 },
  maxSpecs: 12,
  minSpecs: 4,
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

interface InlineProductEditorProps {
  product: any;
  userPermissions: {
    canEditContent: boolean;
  };
  onSave: (updatedContent: any) => void;
  mode?: "description" | "specifications" | "both" | "box"; // New prop to control what to show
}

export function InlineProductEditor({
  product,
  userPermissions,
  onSave,
  mode = "both", // Default to showing both
}: InlineProductEditorProps) {
  const { t, language } = useLanguage();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [descriptionEn, setDescriptionEn] = useState(product.descriptionEn || product.description || "");
  const [descriptionAr, setDescriptionAr] = useState(product.descriptionAr || "");
  const [specs, setSpecs] = useState(() => {
    // Support both 'specs' and 'specifications' formats
    const rawSpecs = product.specifications || product.specs || [];
    // Convert from {title, value, icon} to {nameEn, nameAr, valueEn, valueAr, icon}
    return rawSpecs.map((spec: any) => {
      if (spec.nameEn || spec.nameAr) {
        // Already in the correct format
        return spec;
      } else {
        // Convert from old format {title, value, icon}
        return {
          icon: spec.icon || "Smartphone",
          iconImage: spec.iconImage || "",
          nameEn: spec.title || "",
          nameAr: spec.title || "",
          valueEn: spec.value || "",
          valueAr: spec.value || "",
        };
      }
    });
  });
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingBox, setIsEditingBox] = useState(false);
  const [boxItems, setBoxItems] = useState<{ en: string; ar: string }[]>(() => {
    const raw = (product.inTheBox || product.box || product.boxItems || [product.name || "", language === "ar" ? "دليل المستخدم" : "User Manual", language === "ar" ? "بطاقة الضمان" : "Warranty Card", language === "ar" ? "ملحقات إضافية" : "Accessories"]).filter(Boolean);
    return raw.map((it: any) => {
      if (typeof it === "string") return { en: it, ar: "" };
      // If already stored as {en,ar}
      if (it && (it.en || it.ar)) return { en: it.en || "", ar: it.ar || "" };
      // If legacy shape like {nameEn,nameAr} or {valueEn,valueAr}
      if (it && (it.nameEn || it.valueEn || it.nameAr || it.valueAr)) {
        return { en: it.nameEn || it.valueEn || "", ar: it.nameAr || it.valueAr || "" };
      }
      // Fallback
      return { en: String(it), ar: "" };
    });
  });
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(null);
  const [specNameSearch, setSpecNameSearch] = useState<{ [key: number]: string }>({});
  const [showSpecNameSuggestions, setShowSpecNameSuggestions] = useState<number | null>(null);

  // Update state when product prop changes
  useEffect(() => {
    setDescriptionEn(product.descriptionEn || product.description || "");
    setDescriptionAr(product.descriptionAr || "");
    
    const rawSpecs = product.specifications || product.specs || [];
    const normalizedSpecs = rawSpecs.map((spec: any) => {
      if (spec.nameEn || spec.nameAr) {
        return spec;
      } else {
        let icon = "Smartphone";
        let iconImage = "";
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
          icon,
          iconImage,
          nameEn: spec.title || "",
          nameAr: spec.titleAr || "",
          valueEn: spec.value || "",
          valueAr: spec.valueAr || "",
        };
      }
    });
    setSpecs(normalizedSpecs);
    
    const raw = (product.inTheBox || product.box || product.boxItems || [product.name || "", language === "ar" ? "دليل المستخدم" : "User Manual", language === "ar" ? "بطاقة الضمان" : "Warranty Card", language === "ar" ? "ملحقات إضافية" : "Accessories"]).filter(Boolean);
    const normalizedBox = raw.map((it: any) => {
      if (typeof it === "string") return { en: it, ar: "" };
      if (it && (it.en || it.ar)) return { en: it.en || "", ar: it.ar || "" };
      if (it && (it.nameEn || it.valueEn || it.nameAr || it.valueAr)) {
        return { en: it.nameEn || it.valueEn || "", ar: it.nameAr || it.valueAr || "" };
      }
      return { en: String(it), ar: "" };
    });
    setBoxItems(normalizedBox);
  }, [product, language]);

  const getCharCountStatus = (text: string, limits: any) => {
    const length = text.length;
    if (length < limits.min) return { status: "short", color: "text-red-600" };
    if (length > limits.max) return { status: "long", color: "text-red-600" };
    if (length >= limits.optimal - 50 && length <= limits.optimal + 50)
      return { status: "optimal", color: "text-green-600" };
    return { status: "good", color: "text-yellow-600" };
  };

  const handleSaveDescription = () => {
    console.log("[InlineProductEditor] handleSaveDescription called", { descriptionEn, descriptionAr });
    const descEnStatus = getCharCountStatus(descriptionEn, CONTENT_LIMITS.descriptionEn);
    const descArStatus = getCharCountStatus(descriptionAr, CONTENT_LIMITS.descriptionAr);

    if (descEnStatus.status === "short" || descEnStatus.status === "long" ||
        descArStatus.status === "short" || descArStatus.status === "long") {
      alert(t("editor.validationError"));
      return;
    }

    onSave({ description: descriptionEn, descriptionAr });
    setIsEditingDescription(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSpecs = () => {
    console.log("[InlineProductEditor] handleSaveSpecs called", { specs });
    if (specs.length < CONTENT_LIMITS.minSpecs) {
      alert(`${t("editor.minSpecs")}: ${CONTENT_LIMITS.minSpecs}`);
      return;
    }

    // Check all specs are filled
    const allFilled = specs.every((spec: any) => 
      spec.nameEn && spec.nameAr && spec.valueEn && spec.valueAr
    );

    if (!allFilled) {
      alert(t("editor.validationError"));
      return;
    }

    // Convert to both formats for compatibility
    // Save new spec titles to the manager
    specs.forEach((spec: any) => {
      if (spec.nameEn && spec.nameAr) {
        savedSpecTitlesManager.addOrUpdateTitle(spec.nameEn, spec.nameAr, spec.icon, spec.iconImage);
      }
    });

    const formattedSpecs = specs.map((spec: any) => ({
      icon: spec.icon,
      iconImage: spec.iconImage,
      title: spec.nameEn, // For display in specs list
      value: spec.valueEn, // For display in specs list
      nameEn: spec.nameEn,
      nameAr: spec.nameAr,
      valueEn: spec.valueEn,
      valueAr: spec.valueAr,
    }));

    onSave({ 
      specifications: formattedSpecs,
      specs: formattedSpecs, // Save in both formats
    });
    setIsEditingSpecs(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addBoxItem = () => {
    if (boxItems.length >= 12) return;
    setBoxItems([...boxItems, { en: "", ar: "" }]);
  };

  const removeBoxItem = (index: number) => {
    setBoxItems(boxItems.filter((_, i) => i !== index));
  };

  const updateBoxItem = (index: number, field: "en" | "ar", value: string) => {
    const copy = [...boxItems];
    copy[index] = { ...copy[index], [field]: value };
    setBoxItems(copy);
  };

  const handleSaveBox = () => {
    console.log("[InlineProductEditor] handleSaveBox called", { boxItems });
    // Normalize and validate: keep at least one item with some text
    const cleaned = boxItems
      .map((b) => ({ en: (b.en || "").trim(), ar: (b.ar || "").trim() }))
      .filter((b) => b.en || b.ar);

    if (cleaned.length === 0) {
      alert(t("editor.validationError"));
      return;
    }

    const formattedBox = cleaned.map((item) => ({
      nameEn: item.en || "",
      nameAr: item.ar || "",
      valueEn: "1",
      valueAr: "1",
    }));

    onSave({ inTheBox: formattedBox });
    setIsEditingBox(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addNewSpec = () => {
    if (specs.length >= CONTENT_LIMITS.maxSpecs) {
      alert(`${t("editor.maxSpecs")}: ${CONTENT_LIMITS.maxSpecs}`);
      return;
    }
    setSpecs([...specs, { icon: "Smartphone", nameEn: "", nameAr: "", valueEn: "", valueAr: "" }]);
  };

  const removeSpec = (index: number) => {
    setShowRemoveConfirm(index);
  };

  const confirmRemoveSpec = () => {
    if (showRemoveConfirm !== null) {
      setSpecs(specs.filter((_: any, i: number) => i !== showRemoveConfirm));
      setShowRemoveConfirm(null);
    }
  };

  const cancelRemoveSpec = () => {
    setShowRemoveConfirm(null);
  };

  const updateSpec = (index: number, field: string, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
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

  if (!userPermissions.canEditContent) {
    return null; // Don't show edit buttons if user doesn't have permission
  }

  const descEnStatus = getCharCountStatus(descriptionEn, CONTENT_LIMITS.descriptionEn);
  const descArStatus = getCharCountStatus(descriptionAr, CONTENT_LIMITS.descriptionAr);

  return (
    <>
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slideDown">
          <Check className="w-5 h-5" />
          <span className="font-bold">{t("editor.saved")}</span>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showRemoveConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {language === "ar" 
                      ? "هل أنت متأكد من حذف هذه المواصفة؟" 
                      : "Are you sure you want to remove this specification?"}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmRemoveSpec}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  {language === "ar" ? "نعم، احذف" : "Yes, Delete"}
                </button>
                <button
                  onClick={cancelRemoveSpec}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description Editor - Only show if mode is 'description' or 'both' */}
      {(mode === "description" || mode === "both") && (
        <div className="relative group">
          {!isEditingDescription ? (
            <div className="relative">
              <button
                onClick={() => setIsEditingDescription(true)}
                className={`absolute top-0 ${language === "ar" ? "left-0" : "right-0"} p-2 bg-white rounded-lg shadow-lg border-2 border-[#009FE3] text-[#009FE3] opacity-100 transition-all duration-200 hover:bg-[#009FE3] hover:text-white flex items-center gap-2 z-10`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-bold">{t("editor.editDescription")}</span>
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-[#009FE3] rounded-2xl p-6 mb-6 animate-fadeIn">
              {/* Guidelines */}
              <div className="bg-white rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm">
                <Info className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{t("editor.guidelines")}</h4>
                  <p className="text-sm text-gray-600">
                    {language === "ar"
                      ? `الطول المثالي: ${CONTENT_LIMITS.descriptionEn.optimal} حرف | الحد الأدنى: ${CONTENT_LIMITS.descriptionEn.min} | الحد الأقصى: ${CONTENT_LIMITS.descriptionEn.max}`
                      : `Optimal length: ${CONTENT_LIMITS.descriptionEn.optimal} chars | Min: ${CONTENT_LIMITS.descriptionEn.min} | Max: ${CONTENT_LIMITS.descriptionEn.max}`}
                  </p>
                </div>
              </div>

              {/* English Description */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    {t("admin.content.descriptionEn")}
                  </label>
                  <div className={`text-sm font-bold ${descEnStatus.color}`}>
                    {descriptionEn.length} / {CONTENT_LIMITS.descriptionEn.max} {t("admin.content.charCount")}
                    {descEnStatus.status === "short" && ` (${t("editor.tooShort")})`}
                    {descEnStatus.status === "long" && ` (${t("editor.tooLong")})`}
                    {descEnStatus.status === "optimal" && ` ✓ (${t("editor.optimal")})`}
                  </div>
                </div>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => {
                    if (e.target.value.length <= CONTENT_LIMITS.descriptionEn.max) {
                      setDescriptionEn(e.target.value);
                    }
                  }}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 resize-none ${
                    descEnStatus.status === "short" || descEnStatus.status === "long"
                      ? "border-red-300 focus:ring-red-500"
                      : descEnStatus.status === "optimal"
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-[#009FE3]"
                  }`}
                  placeholder="Enter detailed English description..."
                />
              </div>

              {/* Arabic Description */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    {t("admin.content.descriptionAr")}
                  </label>
                  <div className={`text-sm font-bold ${descArStatus.color}`}>
                    {descriptionAr.length} / {CONTENT_LIMITS.descriptionAr.max} {t("admin.content.charCount")}
                    {descArStatus.status === "short" && ` (${t("editor.tooShort")})`}
                    {descArStatus.status === "long" && ` (${t("editor.tooLong")})`}
                    {descArStatus.status === "optimal" && ` ✓ (${t("editor.optimal")})`}
                  </div>
                </div>
                <textarea
                  value={descriptionAr}
                  onChange={(e) => {
                    if (e.target.value.length <= CONTENT_LIMITS.descriptionAr.max) {
                      setDescriptionAr(e.target.value);
                    }
                  }}
                  rows={6}
                  dir="rtl"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 resize-none ${
                    descArStatus.status === "short" || descArStatus.status === "long"
                      ? "border-red-300 focus:ring-red-500"
                      : descArStatus.status === "optimal"
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-[#009FE3]"
                  }`}
                  placeholder="أدخل وصفاً عربياً مفصلاً..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveDescription}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {t("editor.save")}
                </button>
                <button
                  onClick={() => {
                    setDescriptionEn(product.descriptionEn || product.description || "");
                    setDescriptionAr(product.descriptionAr || "");
                    setIsEditingDescription(false);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  {t("editor.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

        {/* Box Editor - mode 'box' */}
        {mode === "box" && (
          <div className="relative group">
            {!isEditingBox ? (
              <div className="relative">
                <button
                  onClick={() => setIsEditingBox(true)}
                  className={`absolute top-0 ${language === "ar" ? "left-0" : "right-0"} p-2 bg-white rounded-lg shadow-lg border-2 border-[#009FE3] text-[#009FE3] opacity-100 transition-all duration-200 hover:bg-[#009FE3] hover:text-white flex items-center gap-2 z-10`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-bold">{language === "ar" ? "تعديل محتويات العلبة" : "Edit What's in the box"}</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-4">
                <h4 className="font-bold mb-3 text-gray-900">{t("admin.content.boxTitle") || (language === "ar" ? "محتويات العلبة" : "What's in the box")}</h4>

                <div className="space-y-3 mb-3">
                  {boxItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-xs font-bold text-gray-600 mb-1 block">{t("admin.content.boxItemEn") || "Box item (EN)"}</label>
                          <input
                            type="text"
                            value={item.en}
                            onChange={(e) => updateBoxItem(idx, "en", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                            placeholder={t("admin.content.boxItemPlaceholderEn") || "Box item (English)"}
                          />
                        </div>
                        <button onClick={() => removeBoxItem(idx)} className="p-2 bg-red-100 text-red-600 rounded-lg" aria-label={t("editor.remove") || (language === "ar" ? "حذف" : "Remove") }>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-xs font-bold text-gray-600 mb-1 block">{t("admin.content.boxItemAr") || "Box item (AR)"}</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={item.ar}
                            onChange={(e) => updateBoxItem(idx, "ar", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                            placeholder={t("admin.content.boxItemPlaceholderAr") || "عنصر في العلبة (عربي)"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <button onClick={addBoxItem} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t("admin.content.addItem") || (language === "ar" ? "أضف عنصر" : "Add item")}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSaveBox} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    <span>{t("editor.save")}</span>
                  </button>
                  <button onClick={() => {
                      const raw = (product.inTheBox || product.box || product.boxItems || [product.name || ""]).filter(Boolean);
                      const reset = raw.map((it: any) => {
                        if (typeof it === "string") return { en: it, ar: "" };
                        if (it && (it.en || it.ar)) return { en: it.en || "", ar: it.ar || "" };
                        if (it && (it.nameEn || it.valueEn || it.nameAr || it.valueAr)) {
                          return { en: it.nameEn || it.valueEn || "", ar: it.nameAr || it.valueAr || "" };
                        }
                        return { en: String(it), ar: "" };
                      });
                      setBoxItems(reset);
                      setIsEditingBox(false);
                    }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2">
                    <X className="w-5 h-5" />
                    <span>{t("editor.cancel")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Specifications Editor - Only show if mode is 'specifications' or 'both' */}
      {(mode === "specifications" || mode === "both") && (
        <div className="relative group">
          {!isEditingSpecs ? (
            <div className="relative">
              <button
                onClick={() => setIsEditingSpecs(true)}
                className={`absolute top-0 ${language === "ar" ? "left-0" : "right-0"} p-2 bg-white rounded-lg shadow-lg border-2 border-[#009FE3] text-[#009FE3] opacity-100 transition-all duration-200 hover:bg-[#009FE3] hover:text-white flex items-center gap-2 z-10`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-bold">{t("editor.editSpecs")}</span>
              </button>
            </div>
          ) : (
            <div className="bg-purple-50 border-2 border-purple-500 rounded-2xl p-6 mb-6 animate-fadeIn">
              {/* Guidelines */}
              <div className="bg-white rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{t("editor.guidelines")}</h4>
                  <p className="text-sm text-gray-600">
                    {t("editor.minSpecs")}: {CONTENT_LIMITS.minSpecs} | {t("editor.maxSpecs")}: {CONTENT_LIMITS.maxSpecs}
                  </p>
                </div>
              </div>

              {/* Add Spec Button */}
              <button
                onClick={addNewSpec}
                disabled={specs.length >= CONTENT_LIMITS.maxSpecs}
                className={`w-full py-3 mb-4 border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-2 font-bold ${
                  specs.length >= CONTENT_LIMITS.maxSpecs
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-purple-300 text-purple-600 hover:border-purple-500 hover:bg-purple-50"
                }`}
              >
                <Plus className="w-5 h-5" />
                {t("admin.content.addSpec")} ({specs.length}/{CONTENT_LIMITS.maxSpecs})
              </button>

              {/* Specs List */}
              <div className="space-y-4 mb-4">
                {specs.map((spec: any, index: number) => {
                  const IconComponent = AVAILABLE_ICONS.find((i) => i.name === spec.icon)?.icon || Smartphone;

                  return (
                    <div
                      key={index}
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-3 relative hover:border-purple-300 transition-all"
                    >
                      <button
                        onClick={() => removeSpec(index)}
                        className={`absolute top-4 ${language === "ar" ? "left-4" : "right-4"} p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Icon Selector */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          {t("admin.content.selectIcon")}
                        </label>
                        
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
                                ? "bg-purple-600 text-white" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {t("admin.content.useIconLibrary")}
                          </button>
                          <label
                            className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer text-center ${
                              spec.iconImage 
                                ? "bg-purple-600 text-white" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {t("admin.content.useIconImage")}
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
                            <div className="flex items-center gap-3 px-4 py-3 border-2 border-purple-300 rounded-xl bg-purple-50">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                <img src={spec.iconImage} alt="Icon" className="w-full h-full object-contain" />
                              </div>
                              <span className="text-gray-700 font-medium flex-1">
                                {t("admin.content.customImage")}
                              </span>
                              <label className="text-purple-600 hover:bg-purple-50 p-1 rounded cursor-pointer">
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
                                className="flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-purple-500 transition-all w-full"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm text-gray-700 font-medium">
                                  {language === "ar"
                                    ? AVAILABLE_ICONS.find((i) => i.name === spec.icon)?.labelAr
                                    : AVAILABLE_ICONS.find((i) => i.name === spec.icon)?.labelEn}
                                </span>
                                <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                              </button>

                              {/* Icon Picker Dropdown */}
                              {showIconPicker === index && (
                                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 z-20 max-h-64 overflow-y-auto">
                                  <p className="text-sm font-bold text-gray-700 mb-3">{t("admin.content.chooseIcon")}</p>
                                  <div className="grid grid-cols-4 gap-2">
                                    {AVAILABLE_ICONS.map((iconItem) => {
                                      const Icon = iconItem.icon;
                                      return (
                                        <button
                                          key={iconItem.name}
                                          onClick={() => updateSpecIcon(index, iconItem.name)}
                                          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                                            spec.icon === iconItem.name
                                              ? "bg-purple-600 text-white"
                                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          <Icon className="w-6 h-6" />
                                          <span className="text-xs font-medium text-center leading-tight">
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
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
                                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                                                  <Icon className="w-4 h-4 text-white" />
                                                </div>
                                              );
                                            }
                                          })()}
                                          <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs text-gray-900 truncate">
                                              {language === "ar" ? savedSpec.nameAr : savedSpec.nameEn}
                                            </p>
                                          </div>
                                        </button>
                                      ))
                                    ) : (
                                      <div className="px-3 py-4 text-center text-gray-400">
                                        <p className="text-sm">{t("admin.content.noResultsFound")}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Spec Names */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            {t("admin.content.specNameEn")}
                          </label>
                          <input
                            type="text"
                            placeholder="Display"
                            value={spec.nameEn || ""}
                            maxLength={CONTENT_LIMITS.specName.max}
                            onChange={(e) => updateSpec(index, "nameEn", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {spec.nameEn?.length || 0}/{CONTENT_LIMITS.specName.max}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            {t("admin.content.specNameAr")}
                          </label>
                          <input
                            type="text"
                            placeholder="الشاشة"
                            value={spec.nameAr || ""}
                            maxLength={CONTENT_LIMITS.specName.max}
                            dir="rtl"
                            onChange={(e) => updateSpec(index, "nameAr", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {spec.nameAr?.length || 0}/{CONTENT_LIMITS.specName.max}
                          </p>
                        </div>
                      </div>

                      {/* Spec Values */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            {t("admin.content.specValueEn")}
                          </label>
                          <input
                            type="text"
                            placeholder="6.1 inch OLED"
                            value={spec.valueEn || ""}
                            maxLength={CONTENT_LIMITS.specValue.max}
                            onChange={(e) => updateSpec(index, "valueEn", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {spec.valueEn?.length || 0}/{CONTENT_LIMITS.specValue.max}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            {t("admin.content.specValueAr")}
                          </label>
                          <input
                            type="text"
                            placeholder="6.1 بوصة OLED"
                            value={spec.valueAr || ""}
                            maxLength={CONTENT_LIMITS.specValue.max}
                            dir="rtl"
                            onChange={(e) => updateSpec(index, "valueAr", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {spec.valueAr?.length || 0}/{CONTENT_LIMITS.specValue.max}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {specs.length < CONTENT_LIMITS.minSpecs && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <p className="text-sm text-orange-700">
                    {language === "ar"
                      ? `يجب إضافة ${CONTENT_LIMITS.minSpecs - specs.length} مواصفات على الأقل`
                      : `Please add at least ${CONTENT_LIMITS.minSpecs - specs.length} more specifications`}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveSpecs}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {t("editor.save")}
                </button>
                <button
                  onClick={() => {
                    const rawSpecs = product.specifications || product.specs || [];
                    const resetSpecs = rawSpecs.map((spec: any) => {
                      if (spec.nameEn || spec.nameAr) {
                        return spec;
                      } else {
                        return {
                          icon: spec.icon || "Smartphone",
                          nameEn: spec.title || "",
                          nameAr: spec.title || "",
                          valueEn: spec.value || "",
                          valueAr: spec.value || "",
                        };
                      }
                    });
                    setSpecs(resetSpecs);
                    setIsEditingSpecs(false);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  {t("editor.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}