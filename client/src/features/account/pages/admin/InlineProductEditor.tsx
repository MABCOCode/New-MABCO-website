import {
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Check,
  AlertCircle,
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
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

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
  language: "ar" | "en";
  userPermissions: {
    canEditContent: boolean;
  };
  onSave: (updatedContent: any) => void;
  mode?: "description" | "specifications" | "both"; // New prop to control what to show
}

export function InlineProductEditor({
  product,
  language,
  userPermissions,
  onSave,
  mode = "both", // Default to showing both
}: InlineProductEditorProps) {
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

  const t = {
    ar: {
      editDescription: "تعديل الوصف",
      editSpecs: "تعديل المواصفات",
      save: "حفظ",
      cancel: "إلغاء",
      descriptionEn: "الوصف الإنجليزي",
      descriptionAr: "الوصف ��لعربي",
      addSpec: "إضافة مواصفة",
      charCount: "حرف",
      optimal: "مثالي",
      tooShort: "قصير جداً",
      tooLong: "طويل جداً",
      good: "جيد",
      specNameEn: "الاسم (إنجليزي)",
      specNameAr: "الاسم (عربي)",
      specValueEn: "القيمة (إنجليزي)",
      specValueAr: "القيمة (عربي)",
      selectIcon: "اختر أيقونة",
      maxSpecs: "الحد الأقصى",
      minSpecs: "الحد الأدنى",
      saved: "تم الحفظ!",
      validationError: "يجب استيفاء جميع المتطلبات",
      guidelines: "إرشادات المحتوى",
    },
    en: {
      editDescription: "Edit Description",
      editSpecs: "Edit Specifications",
      save: "Save",
      cancel: "Cancel",
      descriptionEn: "English Description",
      descriptionAr: "Arabic Description",
      addSpec: "Add Specification",
      charCount: "characters",
      optimal: "optimal",
      tooShort: "too short",
      tooLong: "too long",
      good: "good",
      specNameEn: "Name (English)",
      specNameAr: "Name (Arabic)",
      specValueEn: "Value (English)",
      specValueAr: "Value (Arabic)",
      selectIcon: "Select Icon",
      maxSpecs: "Maximum",
      minSpecs: "Minimum",
      saved: "Saved!",
      validationError: "All requirements must be met",
      guidelines: "Content Guidelines",
    },
  };

  const getCharCountStatus = (text: string, limits: any) => {
    const length = text.length;
    if (length < limits.min) return { status: "short", color: "text-red-600" };
    if (length > limits.max) return { status: "long", color: "text-red-600" };
    if (length >= limits.optimal - 50 && length <= limits.optimal + 50)
      return { status: "optimal", color: "text-green-600" };
    return { status: "good", color: "text-yellow-600" };
  };

  const handleSaveDescription = () => {
    const descEnStatus = getCharCountStatus(descriptionEn, CONTENT_LIMITS.descriptionEn);
    const descArStatus = getCharCountStatus(descriptionAr, CONTENT_LIMITS.descriptionAr);

    if (descEnStatus.status === "short" || descEnStatus.status === "long" ||
        descArStatus.status === "short" || descArStatus.status === "long") {
      alert(t[language].validationError);
      return;
    }

    onSave({ descriptionEn, descriptionAr });
    setIsEditingDescription(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSpecs = () => {
    if (specs.length < CONTENT_LIMITS.minSpecs) {
      alert(`${t[language].minSpecs}: ${CONTENT_LIMITS.minSpecs}`);
      return;
    }

    // Check all specs are filled
    const allFilled = specs.every((spec: any) => 
      spec.nameEn && spec.nameAr && spec.valueEn && spec.valueAr
    );

    if (!allFilled) {
      alert(t[language].validationError);
      return;
    }

    // Convert to both formats for compatibility
    const formattedSpecs = specs.map((spec: any) => ({
      icon: spec.icon,
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

  const addNewSpec = () => {
    if (specs.length >= CONTENT_LIMITS.maxSpecs) {
      alert(`${t[language].maxSpecs}: ${CONTENT_LIMITS.maxSpecs}`);
      return;
    }
    setSpecs([...specs, { icon: "Smartphone", nameEn: "", nameAr: "", valueEn: "", valueAr: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_: any, i: number) => i !== index));
  };

  const updateSpec = (index: number, field: string, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const updateSpecIcon = (index: number, iconName: string) => {
    const newSpecs = [...specs];
    newSpecs[index].icon = iconName;
    setSpecs(newSpecs);
    setShowIconPicker(null);
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
          <span className="font-bold">{t[language].saved}</span>
        </div>
      )}

      {/* Description Editor - Only show if mode is 'description' or 'both' */}
      {(mode === "description" || mode === "both") && (
        <div className="relative group">
          {!isEditingDescription ? (
            <div className="relative">
              <button
                onClick={() => setIsEditingDescription(true)}
                className="absolute top-0 right-0 p-2 bg-white rounded-lg shadow-lg border-2 border-[#009FE3] text-[#009FE3] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#009FE3] hover:text-white flex items-center gap-2 z-10"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-bold">{t[language].editDescription}</span>
              </button>
            </div>
          ) : (
          <div className="bg-blue-50 border-2 border-[#009FE3] rounded-2xl p-6 mb-6 animate-fadeIn">
            {/* Guidelines */}
            <div className="bg-white rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm">
              <Info className="w-5 h-5 text-[#009FE3] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{t[language].guidelines}</h4>
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
                  {t[language].descriptionEn}
                </label>
                <div className={`text-sm font-bold ${descEnStatus.color}`}>
                  {descriptionEn.length} / {CONTENT_LIMITS.descriptionEn.max} {t[language].charCount}
                  {descEnStatus.status === "short" && ` (${t[language].tooShort})`}
                  {descEnStatus.status === "long" && ` (${t[language].tooLong})`}
                  {descEnStatus.status === "optimal" && ` ✓ (${t[language].optimal})`}
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
                  {t[language].descriptionAr}
                </label>
                <div className={`text-sm font-bold ${descArStatus.color}`}>
                  {descriptionAr.length} / {CONTENT_LIMITS.descriptionAr.max} {t[language].charCount}
                  {descArStatus.status === "short" && ` (${t[language].tooShort})`}
                  {descArStatus.status === "long" && ` (${t[language].tooLong})`}
                  {descArStatus.status === "optimal" && ` ✓ (${t[language].optimal})`}
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
                {t[language].save}
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
                {t[language].cancel}
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
                className="absolute top-0 right-0 p-2 bg-white rounded-lg shadow-lg border-2 border-[#009FE3] text-[#009FE3] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#009FE3] hover:text-white flex items-center gap-2 z-10"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-bold">{t[language].editSpecs}</span>
              </button>
            </div>
          ) : (
          <div className="bg-purple-50 border-2 border-purple-500 rounded-2xl p-6 mb-6 animate-fadeIn">
            {/* Guidelines */}
            <div className="bg-white rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm">
              <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{t[language].guidelines}</h4>
                <p className="text-sm text-gray-600">
                  {t[language].minSpecs}: {CONTENT_LIMITS.minSpecs} | {t[language].maxSpecs}: {CONTENT_LIMITS.maxSpecs}
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
              {t[language].addSpec} ({specs.length}/{CONTENT_LIMITS.maxSpecs})
            </button>

            {/* Specs List */}
            <div className="space-y-4 mb-4">
              {specs.map((spec: any, index: number) => {
                const IconComponent = AVAILABLE_ICONS.find((i) => i.name === spec.icon)?.icon || Smartphone;

                return (
                  <div
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3 relative hover:border-purple-300 transition-all"
                  >
                    <button
                      onClick={() => removeSpec(index)}
                      className={`absolute top-4 ${language === "ar" ? "left-4" : "right-4"}  p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Icon Selector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        {t[language].selectIcon}
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowIconPicker(showIconPicker === index ? null : index)}
                          className="flex items-center gap-3 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-all w-full"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-white" />
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
                          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 z-20 max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-5 gap-2">
                              {AVAILABLE_ICONS.map((iconOption) => {
                                const Icon = iconOption.icon;
                                return (
                                  <button
                                    key={iconOption.name}
                                    onClick={() => updateSpecIcon(index, iconOption.name)}
                                    className={`p-2 rounded-lg transition-all hover:bg-purple-50 flex flex-col items-center gap-1 ${
                                      spec.icon === iconOption.name
                                        ? "bg-purple-100 border-2 border-purple-500"
                                        : "border-2 border-gray-200"
                                    }`}
                                    title={language === "ar" ? iconOption.labelAr : iconOption.labelEn}
                                  >
                                    <Icon className="w-5 h-5 text-gray-700" />
                                    <span className="text-xs text-gray-600 text-center leading-tight">
                                      {language === "ar" ? iconOption.labelAr : iconOption.labelEn}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spec Names */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          {t[language].specNameEn}
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
                          {t[language].specNameAr}
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
                          {t[language].specValueEn}
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
                          {t[language].specValueAr}
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
                {t[language].save}
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
                {t[language].cancel}
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  );
}
