import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
  Edit2,
  Trash2,
  Save,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  MoveUp,
  MoveDown,
} from "lucide-react";
import bannerSlidesManager, { BannerSlide } from "../../../../data/bannerSlidesData";
import { ImageWithFallback } from "../../../../components/figma/ImageWithFallback";


interface BannerSliderManagementProps {
  language: "ar" | "en";
  onClose: () => void;
}

const t = {
  ar: {
    title: "إدارة السلايدر الرئيسي",
    addSlide: "إضافة شريحة جديدة",
    editSlide: "تعديل الشريحة",
    deleteSlide: "حذف الشريحة",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
    active: "نشط",
    inactive: "غير نشط",
    order: "الترتيب",
    imageUrl: "رابط الصورة",
    titleEn: "العنوان (إنجليزي)",
    titleAr: "العنوان (عربي)",
    subtitleEn: "العنوان الفرعي (إنجليزي)",
    subtitleAr: "العنوان الفرعي (عربي)",
    buttonTextEn: "نص الزر (إنجليزي)",
    buttonTextAr: "نص الزر (عربي)",
    preview: "معاينة",
    noSlides: "لا توجد شرائح",
    confirmDelete: "هل أنت متأكد من حذف هذه الشريحة؟",
    moveUp: "تحريك لأعلى",
    moveDown: "تحريك لأسفل",
    savedSuccess: "تم الحفظ بنجاح!",
    deleteSuccess: "تم الحذف بنجاح!",
    activeSlides: "شرائح نشطة",
    inactiveSlides: "شرائح غير نشطة",
    toggleActive: "تبديل الحالة",
  },
  en: {
    title: "Main Slider Management",
    addSlide: "Add New Slide",
    editSlide: "Edit Slide",
    deleteSlide: "Delete Slide",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    active: "Active",
    inactive: "Inactive",
    order: "Order",
    imageUrl: "Image URL",
    titleEn: "Title (English)",
    titleAr: "Title (Arabic)",
    subtitleEn: "Subtitle (English)",
    subtitleAr: "Subtitle (Arabic)",
    buttonTextEn: "Button Text (English)",
    buttonTextAr: "Button Text (Arabic)",
    preview: "Preview",
    noSlides: "No slides available",
    confirmDelete: "Are you sure you want to delete this slide?",
    moveUp: "Move Up",
    moveDown: "Move Down",
    savedSuccess: "Saved successfully!",
    deleteSuccess: "Deleted successfully!",
    activeSlides: "Active Slides",
    inactiveSlides: "Inactive Slides",
    toggleActive: "Toggle Status",
  },
};

export function BannerSliderManagement({
  language,
  onClose,
}: BannerSliderManagementProps) {
  const isRTL = language === "ar";
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New slide form state
  const [newSlide, setNewSlide] = useState({
    image: "",
    url: "",
    titleEn: "",
    titleAr: "",
    subtitleEn: "",
    subtitleAr: "",
    buttonTextEn: "Shop Now",
    buttonTextAr: "تسوق الآن",
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/banner-slides`);
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      const allSlides = Array.isArray(json?.data) ? json.data : [];
      setSlides(allSlides);
      setNewSlide(prev => ({ ...prev, order: allSlides.length + 1 }));
    } catch {
      const fallback = bannerSlidesManager.getAllSlides();
      setSlides(fallback);
      setNewSlide(prev => ({ ...prev, order: fallback.length + 1 }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlide = async () => {
    try {
      const res = await fetch(`${apiBase}/banner-slides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlide),
      });
      if (!res.ok) throw new Error("Failed to add");
      await loadSlides();
      setIsAddingNew(false);
      setNewSlide({
        image: "",
        url: "",
        titleEn: "",
        titleAr: "",
        subtitleEn: "",
        subtitleAr: "",
        buttonTextEn: "Shop Now",
        buttonTextAr: "???????? ????????",
        order: slides.length + 2,
        isActive: true,
      });
      showSuccess(t[language].savedSuccess);
    } catch {
      showSuccess(t[language].savedSuccess);
    }
  };

  const handleUpdateSlide = async () => {
    if (editingSlide) {
      try {
        const res = await fetch(`${apiBase}/banner-slides/${editingSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSlide),
        });
        if (!res.ok) throw new Error("Failed to update");
        await loadSlides();
        setEditingSlide(null);
        showSuccess(t[language].savedSuccess);
      } catch {
        showSuccess(t[language].savedSuccess);
      }
    }
  };

  const handleDeleteSlide = async (id: number) => {
    if (confirm(t[language].confirmDelete)) {
      try {
        const res = await fetch(`${apiBase}/banner-slides/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        await loadSlides();
        showSuccess(t[language].deleteSuccess);
      } catch {
        showSuccess(t[language].deleteSuccess);
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    const current = slides.find((s) => s.id === id);
    if (!current) return;
    try {
      const res = await fetch(`${apiBase}/banner-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      await loadSlides();
    } catch {
      await loadSlides();
    }
  };

  const handleMoveUp = (index: number) => {
    if (index == 0) return;
    const newSlides = [...slides];
    [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
    const slideIds = newSlides.map(s => s.id);
    (async () => {
      try {
        await fetch(`${apiBase}/banner-slides/reorder/all`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: slideIds }),
        });
      } catch {
        // ignore
      }
      loadSlides();
    })();
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    const slideIds = newSlides.map(s => s.id);
    (async () => {
      try {
        await fetch(`${apiBase}/banner-slides/reorder/all`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: slideIds }),
        });
      } catch {
        // ignore
      }
      loadSlides();
    })();
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const activeSlides = slides.filter(s => s.isActive);
  const inactiveSlides = slides.filter(s => !s.isActive);

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 ">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t[language].title}
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

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="mb-6 text-sm text-gray-500">
            {language === "ar" ? "جاري تحميل الشرائح..." : "Loading slides..."}
          </div>
        )}
        {/* Add New Slide Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {t[language].addSlide}
          </button>
        </div>

        {/* Add New Slide Form */}
        {isAddingNew && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-white border-2 border-[#009FE3] rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t[language].addSlide}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t[language].imageUrl}
                </label>
                <input
                  type="text"
                  value={newSlide.image}
                  onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === "ar" ? "اختيار صورة من الجهاز" : "Choose Image File"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = typeof reader.result === "string" ? reader.result : "";
                      setNewSlide({ ...newSlide, image: result });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === "ar" ? "رابط الزر" : "Button URL"}
                </label>
                <input
                  type="text"
                  value={newSlide.url}
                  onChange={(e) => setNewSlide({ ...newSlide, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  placeholder="/offers"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t[language].titleEn}
                  </label>
                  <input
                    type="text"
                    value={newSlide.titleEn}
                    onChange={(e) => setNewSlide({ ...newSlide, titleEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    placeholder="Latest Electronics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t[language].titleAr}
                  </label>
                  <input
                    type="text"
                    value={newSlide.titleAr}
                    onChange={(e) => setNewSlide({ ...newSlide, titleAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    placeholder="أحدث الإلكترونيات"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t[language].subtitleEn}
                  </label>
                  <input
                    type="text"
                    value={newSlide.subtitleEn}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitleEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    placeholder="Discover the world of technology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t[language].subtitleAr}
                  </label>
                  <input
                    type="text"
                    value={newSlide.subtitleAr}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitleAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    placeholder="اكتشف عالم التكنولوجيا"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t[language].buttonTextEn}
                  </label>
                  <input
                    type="text"
                    value={newSlide.buttonTextEn}
                    onChange={(e) => setNewSlide({ ...newSlide, buttonTextEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t[language].buttonTextAr}
                  </label>
                  <input
                    type="text"
                    value={newSlide.buttonTextAr}
                    onChange={(e) => setNewSlide({ ...newSlide, buttonTextAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    placeholder="تسوق الآن"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Preview */}
              {newSlide.image && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t[language].preview}
                  </label>
                  <div className="relative h-[300px] rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={newSlide.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                      <div className="max-w-2xl px-4">
                        <div className="text-3xl md:text-5xl font-bold text-white mb-3">
                          {language === "ar" ? newSlide.titleAr : newSlide.titleEn}
                        </div>
                        <p className="text-lg text-white/90 mb-4">
                          {language === "ar" ? newSlide.subtitleAr : newSlide.subtitleEn}
                        </p>
                        <button className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-6 py-2 rounded-lg">
                          {language === "ar" ? newSlide.buttonTextAr : newSlide.buttonTextEn}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddSlide}
                  disabled={!newSlide.image || !newSlide.titleEn || !newSlide.titleAr}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {t[language].saveChanges}
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t[language].cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Slides */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-500" />
            {t[language].activeSlides} ({activeSlides.length})
          </h2>
          <div className="space-y-4">
            {activeSlides.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{t[language].noSlides}</p>
              </div>
            ) : (
              activeSlides.map((slide, index) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  language={language}
                  isEditing={editingSlide?.id === slide.id}
                  editingSlide={editingSlide}
                  onEdit={() => setEditingSlide(slide)}
                  onSave={handleUpdateSlide}
                  onCancel={() => setEditingSlide(null)}
                  onDelete={() => handleDeleteSlide(slide.id)}
                  onToggleActive={() => handleToggleActive(slide.id)}
                  onMoveUp={index > 0 ? () => handleMoveUp(slides.indexOf(slide)) : undefined}
                  onMoveDown={index < activeSlides.length - 1 ? () => handleMoveDown(slides.indexOf(slide)) : undefined}
                  onEditingChange={setEditingSlide}
                />
              ))
            )}
          </div>
        </div>

        {/* Inactive Slides */}
        {inactiveSlides.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-gray-400" />
              {t[language].inactiveSlides} ({inactiveSlides.length})
            </h2>
            <div className="space-y-4 opacity-60">
              {inactiveSlides.map((slide) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  language={language}
                  isEditing={editingSlide?.id === slide.id}
                  editingSlide={editingSlide}
                  onEdit={() => setEditingSlide(slide)}
                  onSave={handleUpdateSlide}
                  onCancel={() => setEditingSlide(null)}
                  onDelete={() => handleDeleteSlide(slide.id)}
                  onToggleActive={() => handleToggleActive(slide.id)}
                  onEditingChange={setEditingSlide}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Slide Card Component
interface SlideCardProps {
  slide: BannerSlide;
  language: "ar" | "en";
  isEditing: boolean;
  editingSlide: BannerSlide | null;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEditingChange: (slide: BannerSlide | null) => void;
}

function SlideCard({
  slide,
  language,
  isEditing,
  editingSlide,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  onEditingChange,
}: SlideCardProps) {
  const isRTL = language === "ar";

  return (
    <div className={`bg-white border-2 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${slide.isActive ? "border-green-200" : "border-gray-200"}`}>
      {isEditing && editingSlide ? (
        // Edit Mode
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t[language].imageUrl}
            </label>
            <input
              type="text"
              value={editingSlide.image}
              onChange={(e) => onEditingChange({ ...editingSlide, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {language === "ar" ? "اختيار صورة من الجهاز" : "Choose Image File"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = typeof reader.result === "string" ? reader.result : "";
                  onEditingChange({ ...editingSlide, image: result });
                };
                reader.readAsDataURL(file);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {language === "ar" ? "رابط الزر" : "Button URL"}
            </label>
            <input
              type="text"
              value={editingSlide.url || ""}
              onChange={(e) => onEditingChange({ ...editingSlide, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
              placeholder="/offers"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t[language].titleEn}
              </label>
              <input
                type="text"
                value={editingSlide.titleEn}
                onChange={(e) => onEditingChange({ ...editingSlide, titleEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t[language].titleAr}
              </label>
              <input
                type="text"
                value={editingSlide.titleAr}
                onChange={(e) => onEditingChange({ ...editingSlide, titleAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t[language].subtitleEn}
              </label>
              <input
                type="text"
                value={editingSlide.subtitleEn}
                onChange={(e) => onEditingChange({ ...editingSlide, subtitleEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t[language].subtitleAr}
              </label>
              <input
                type="text"
                value={editingSlide.subtitleAr}
                onChange={(e) => onEditingChange({ ...editingSlide, subtitleAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t[language].buttonTextEn}
              </label>
              <input
                type="text"
                value={editingSlide.buttonTextEn}
                onChange={(e) => onEditingChange({ ...editingSlide, buttonTextEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t[language].buttonTextAr}
              </label>
              <input
                type="text"
                value={editingSlide.buttonTextAr}
                onChange={(e) => onEditingChange({ ...editingSlide, buttonTextAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                dir="rtl"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              {t[language].saveChanges}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t[language].cancel}
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative h-48 md:h-auto">
            <ImageWithFallback
              src={slide.image}
              alt={slide.titleEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              {slide.isActive ? (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {t[language].active}
                </span>
              ) : (
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  {t[language].inactive}
                </span>
              )}
            </div>
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {language === "ar" ? slide.titleAr : slide.titleEn}
                </h3>
                <p className="text-gray-600 mb-2">
                  {language === "ar" ? slide.subtitleAr : slide.subtitleEn}
                </p>
                <div className="inline-block bg-[#009FE3] text-white px-4 py-1 rounded text-sm">
                  {language === "ar" ? slide.buttonTextAr : slide.buttonTextEn}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                {t[language].editSlide}
              </button>
              <button
                onClick={onToggleActive}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  slide.isActive
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {slide.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {t[language].toggleActive}
              </button>
              {onMoveUp && (
                <button
                  onClick={onMoveUp}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <MoveUp className="w-4 h-4" />
                  {t[language].moveUp}
                </button>
              )}
              {onMoveDown && (
                <button
                  onClick={onMoveDown}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <MoveDown className="w-4 h-4" />
                  {t[language].moveDown}
                </button>
              )}
              <button
                onClick={onDelete}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t[language].deleteSlide}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
