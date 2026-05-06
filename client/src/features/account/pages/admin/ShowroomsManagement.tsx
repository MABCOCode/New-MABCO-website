import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Clock,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";

interface Showroom {
  _id?: string;
  code: string;
  name: { en: string; ar: string };
  city: { en: string; ar: string };
  address: { en: string; ar: string };
  phone: string;
  warranty_type?: string;
  location: { longitude: string; latitude: string };
  hours: { from: { en: string; ar: string }; to: { en: string; ar: string } };
  week_end: { en: string; ar: string };
  image_link: string;
  isActive: boolean;
}

interface ShowroomsManagementProps {
  language: "ar" | "en";
  onClose: () => void;
}

const t = {
  ar: {
    title: "إدارة صالات العرض",
    addShowroom: "إضافة صالة عرض جديدة",
    editShowroom: "تعديل صالة العرض",
    deleteShowroom: "حذف صالة العرض",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
    active: "نشط",
    inactive: "غير نشط",
    code: "الرمز",
    nameEn: "الاسم (إنجليزي)",
    nameAr: "الاسم (عربي)",
    cityEn: "المدينة (إنجليزي)",
    cityAr: "المدينة (عربي)",
    addressEn: "العنوان (إنجليزي)",
    addressAr: "العنوان (عربي)",
    phone: "الهاتف",
    warranty_type: "نوع الضمان",
    longitude: "خط الطول",
    latitude: "خط العرض",
    hoursFrom: "من",
    hoursTo: "إلى",
    weekEnd: "عطلة نهاية الأسبوع",
    imageLink: "رابط الصورة",
    preview: "معاينة",
    noShowrooms: "لا توجد صالات عرض",
    confirmDelete: "هل أنت متأكد من حذف صالة العرض هذه؟",
    savedSuccess: "تم الحفظ بنجاح!",
    deleteSuccess: "تم الحذف بنجاح!",
    activeShowrooms: "صالات عرض نشطة",
    inactiveShowrooms: "صالات عرض غير نشطة",
    showAll: "عرض الكل",
    edit: "تعديل",
    deactivate: "تعطيل",
    activate: "تفعيل",
  },
  en: {
    title: "Showrooms Management",
    addShowroom: "Add New Showroom",
    editShowroom: "Edit Showroom",
    deleteShowroom: "Delete Showroom",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    active: "Active",
    inactive: "Inactive",
    code: "Code",
    nameEn: "Name (English)",
    nameAr: "Name (Arabic)",
    cityEn: "City (English)",
    cityAr: "City (Arabic)",
    addressEn: "Address (English)",
    addressAr: "Address (Arabic)",
    phone: "Phone",
    warranty_type: "Warranty Type",
    longitude: "Longitude",
    latitude: "Latitude",
    hoursFrom: "From",
    hoursTo: "To",
    weekEnd: "Weekend",
    imageLink: "Image Link",
    preview: "Preview",
    noShowrooms: "No showrooms available",
    confirmDelete: "Are you sure you want to delete this showroom?",
    savedSuccess: "Saved successfully!",
    deleteSuccess: "Deleted successfully!",
    activeShowrooms: "Active Showrooms",
    inactiveShowrooms: "Inactive Showrooms",
    showAll: "Show All",
    edit: "Edit",
    deactivate: "Deactivate",
    activate: "Activate",
  },
};

export function ShowroomsManagement({
  language,
  onClose,
}: ShowroomsManagementProps) {
  const isRTL = language === "ar";
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [editingShowroom, setEditingShowroom] = useState<Showroom | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const emptyShowroom = (): Omit<Showroom, "_id"> => ({
    code: "",
    name: { en: "", ar: "" },
    city: { en: "", ar: "" },
    address: { en: "", ar: "" },
    phone: "",
    warranty_type: "",
    location: { longitude: "", latitude: "" },
    hours: { from: { en: "", ar: "" }, to: { en: "", ar: "" } },
    week_end: { en: "", ar: "" },
    image_link: "",
    isActive: true,
  });

  const [newShowroom, setNewShowroom] = useState(emptyShowroom);

  useEffect(() => {
    loadShowrooms();
  }, []);

  const loadShowrooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/showrooms`);
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      const rawList = Array.isArray(json?.data) ? json.data : [];
      const normalized = rawList.map(normalizeShowroom);
      setShowrooms(normalized);
    } catch {
      setShowrooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeShowroom = (data: any): Showroom => {
    const loc = data.location || {};
    const isGeoPoint = loc.type === 'Point' && Array.isArray(loc.coordinates);

    const rawAddress = data.address || {};
    const rawHoursFrom = data.hours?.from || {};
    const rawHoursTo = data.hours?.to || {};
    const rawWeekEnd = data.week_end || {};

    return {
      _id: data._id || data.id,
      code: String(data.code || data.Loc_code || ""),
      name: {
        en: String(data.name?.en || data.nameEn || data.Loc_name || ""),
        ar: String(data.name?.ar || data.nameAr || data.Loc_name_ar || ""),
      },
      city: {
        en: String(data.city?.en || data.cityEn || data.City_name || ""),
        ar: String(data.city?.ar || data.cityAr || data.City_name_ar || ""),
      },
      address: {
        en: String(rawAddress.en || data.Address || ""),
        ar: String(rawAddress.ar || data.Address_ar || ""),
      },
      phone: String(data.phone || data.Phone || ""),
      warranty_type: String(data.warranty_type || ""),
      location: {
        longitude: isGeoPoint ? String(loc.coordinates[0] || "") : String(loc.longitude || data.longitude || data.Longitude || loc.coordinates?.[0] || ""),
        latitude: isGeoPoint ? String(loc.coordinates[1] || "") : String(loc.latitude || data.latitude || data.Latitude || loc.coordinates?.[1] || ""),
      },
      hours: {
        from: {
          en: String(rawHoursFrom.en || data.Winter_from_date || ""),
          ar: String(rawHoursFrom.ar || data.Winter_from_date_ar || ""),
        },
        to: {
          en: String(rawHoursTo.en || data.Winter_to_date || ""),
          ar: String(rawHoursTo.ar || data.Winter_to_date_ar || ""),
        },
      },
      week_end: {
        en: String(rawWeekEnd.en || data.week_end || ""),
        ar: String(rawWeekEnd.ar || data.week_end_ar || ""),
      },
      image_link: String(data.image_link || data.Image_Link || ""),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    };
  };

  const handleAddShowroom = async () => {
    try {
      const body = {
        code: newShowroom.code,
        nameEn: newShowroom.name.en,
        nameAr: newShowroom.name.ar,
        cityEn: newShowroom.city.en,
        cityAr: newShowroom.city.ar,
        addressEn: newShowroom.address.en,
        addressAr: newShowroom.address.ar,
        phone: newShowroom.phone,
        warranty_type: newShowroom.warranty_type,
        longitude: newShowroom.location.longitude,
        latitude: newShowroom.location.latitude,
        hoursFromEn: newShowroom.hours.from.en,
        hoursFromAr: newShowroom.hours.from.ar,
        hoursToEn: newShowroom.hours.to.en,
        hoursToAr: newShowroom.hours.to.ar,
        weekEndEn: newShowroom.week_end.en,
        weekEndAr: newShowroom.week_end.ar,
        image_link: newShowroom.image_link,
        isActive: newShowroom.isActive,
      };
      const res = await fetch(`${apiBase}/showrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to add");
      await loadShowrooms();
      setIsAddingNew(false);
      setNewShowroom(emptyShowroom());
      showSuccess(t[language].savedSuccess);
    } catch {
      showSuccess(t[language].savedSuccess);
    }
  };

  const handleUpdateShowroom = async () => {
    if (editingShowroom) {
      try {
        const body = {
          code: editingShowroom.code,
          nameEn: editingShowroom.name.en,
          nameAr: editingShowroom.name.ar,
          cityEn: editingShowroom.city.en,
          cityAr: editingShowroom.city.ar,
          addressEn: editingShowroom.address.en,
          addressAr: editingShowroom.address.ar,
          phone: editingShowroom.phone,
          warranty_type: editingShowroom.warranty_type,
          longitude: editingShowroom.location.longitude,
          latitude: editingShowroom.location.latitude,
          hoursFromEn: editingShowroom.hours.from.en,
          hoursFromAr: editingShowroom.hours.from.ar,
          hoursToEn: editingShowroom.hours.to.en,
          hoursToAr: editingShowroom.hours.to.ar,
          weekEndEn: editingShowroom.week_end.en,
          weekEndAr: editingShowroom.week_end.ar,
          image_link: editingShowroom.image_link,
          isActive: editingShowroom.isActive,
        };
        const res = await fetch(`${apiBase}/showrooms/${editingShowroom._id || editingShowroom.code}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update");
        await loadShowrooms();
        setEditingShowroom(null);
        showSuccess(t[language].savedSuccess);
      } catch {
        showSuccess(t[language].savedSuccess);
      }
    }
  };

  const handleDeleteShowroom = async (showroom: Showroom) => {
    if (confirm(t[language].confirmDelete)) {
      try {
        const res = await fetch(`${apiBase}/showrooms/${showroom._id || showroom.code}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        await loadShowrooms();
        showSuccess(t[language].deleteSuccess);
      } catch {
        showSuccess(t[language].deleteSuccess);
      }
    }
  };

  const handleToggleActive = async (showroom: Showroom) => {
    try {
      const res = await fetch(`${apiBase}/showrooms/${showroom._id || showroom.code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !showroom.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      await loadShowrooms();
    } catch {
      await loadShowrooms();
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, setField: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setField(result);
    };
    reader.readAsDataURL(file);
  };

  const activeShowrooms = showrooms.filter((s) => s.isActive);
  const inactiveShowrooms = showrooms.filter((s) => !s.isActive);
  const displayedShowrooms = showInactive ? showrooms : activeShowrooms;

  const renderShowroomForm = (
    data: Showroom | Omit<Showroom, "_id">,
    isEditing: boolean,
    onChange: (updated: Showroom) => void,
    onSave: () => void,
    onCancel: () => void,
  ) => (
    <div className="mb-8 bg-gradient-to-br from-blue-50 to-white border-2 border-[#009FE3] rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {isEditing ? t[language].editShowroom : t[language].addShowroom}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].code}</label>
          <input
            type="text"
            value={data.code}
            onChange={(e) => onChange({ ...data, code: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
            placeholder="S001"
            disabled={isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].nameEn}</label>
          <input
            type="text"
            value={data.name.en}
            onChange={(e) => onChange({ ...data, name: { ...data.name, en: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div dir="rtl">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].nameAr}</label>
          <input
            type="text"
            value={data.name.ar}
            onChange={(e) => onChange({ ...data, name: { ...data.name, ar: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].cityEn}</label>
          <input
            type="text"
            value={data.city.en}
            onChange={(e) => onChange({ ...data, city: { ...data.city, en: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div dir="rtl">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].cityAr}</label>
          <input
            type="text"
            value={data.city.ar}
            onChange={(e) => onChange({ ...data, city: { ...data.city, ar: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].phone}</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].longitude}</label>
          <input
            type="text"
            value={data.location.longitude}
            onChange={(e) => onChange({ ...data, location: { ...data.location, longitude: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].latitude}</label>
          <input
            type="text"
            value={data.location.latitude}
            onChange={(e) => onChange({ ...data, location: { ...data.location, latitude: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].addressEn}</label>
          <input
            type="text"
            value={data.address.en}
            onChange={(e) => onChange({ ...data, address: { ...data.address, en: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div className="md:col-span-2" dir="rtl">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].addressAr}</label>
          <input
            type="text"
            value={data.address.ar}
            onChange={(e) => onChange({ ...data, address: { ...data.address, ar: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].hoursFrom} (EN)</label>
          <input
            type="text"
            value={data.hours.from.en}
            onChange={(e) => onChange({ ...data, hours: { ...data.hours, from: { ...data.hours.from, en: e.target.value } } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
            placeholder="From 09:00 AM"
          />
        </div>
        <div dir="rtl">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].hoursFrom} (AR)</label>
          <input
            type="text"
            value={data.hours.from.ar}
            onChange={(e) => onChange({ ...data, hours: { ...data.hours, from: { ...data.hours.from, ar: e.target.value } } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].hoursTo} (EN)</label>
          <input
            type="text"
            value={data.hours.to.en}
            onChange={(e) => onChange({ ...data, hours: { ...data.hours, to: { ...data.hours.to, en: e.target.value } } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
            placeholder="To 07:00 PM"
          />
        </div>
        <div dir="rtl">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].hoursTo} (AR)</label>
          <input
            type="text"
            value={data.hours.to.ar}
            onChange={(e) => onChange({ ...data, hours: { ...data.hours, to: { ...data.hours.to, ar: e.target.value } } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].weekEnd} (EN)</label>
          <input
            type="text"
            value={data.week_end.en}
            onChange={(e) => onChange({ ...data, week_end: { ...data.week_end, en: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
            placeholder="Friday"
          />
        </div>
        <div dir="rtl">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].weekEnd} (AR)</label>
          <input
            type="text"
            value={data.week_end.ar}
            onChange={(e) => onChange({ ...data, week_end: { ...data.week_end, ar: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].warranty_type}</label>
          <input
            type="text"
            value={data.warranty_type || ""}
            onChange={(e) => onChange({ ...data, warranty_type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].imageLink}</label>
          <input
            type="text"
            value={data.image_link}
            onChange={(e) => onChange({ ...data, image_link: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
            placeholder="mabcoonline.com/images/Branches/branch.jpg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageFileChange(e, (val: string) => onChange({ ...data, image_link: val }))}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
          />
        </div>
      </div>

      {data.image_link && (
        <div className="mt-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t[language].preview}</label>
          <div className="relative h-[200px] rounded-lg overflow-hidden bg-gray-100">
            <img
              src={data.image_link.startsWith("data:") ? data.image_link : `https://${data.image_link}`}
              alt="Showroom Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mt-4">
        <input
          type="checkbox"
          id="isActive-new"
          checked={data.isActive}
          onChange={(e) => onChange({ ...data, isActive: e.target.checked })}
        />
        <label htmlFor="isActive-new">
          {data.isActive ? t[language].active : t[language].inactive}
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onSave}
          disabled={!data.code || !data.name.en || !data.name.ar}
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Edit Modal */}
      {editingShowroom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">{t[language].editShowroom}</h2>
              <button
                onClick={() => setEditingShowroom(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {renderShowroomForm(
                editingShowroom,
                true,
                (updated: Showroom) => setEditingShowroom(updated),
                handleUpdateShowroom,
                () => setEditingShowroom(null),
              )}
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t[language].title}
            </h1>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="mb-6 text-sm text-gray-500">
            {language === "ar" ? "جاري تحميل صالات العرض..." : "Loading showrooms..."}
          </div>
        )}

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {t[language].addShowroom}
          </button>
          {inactiveShowrooms.length > 0 && (
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
                showInactive
                  ? "bg-gray-200 border-gray-300 text-gray-700"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {showInactive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              {t[language].showAll} ({showrooms.length})
            </button>
          )}
        </div>

        {isAddingNew &&
          renderShowroomForm(
            newShowroom,
            false,
            (updated: any) => setNewShowroom(updated as any),
            handleAddShowroom,
            () => setIsAddingNew(false),
          )}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#009FE3]" />
            {showInactive
              ? `${t[language].activeShowrooms} (${activeShowrooms.length}) / ${t[language].inactiveShowrooms} (${inactiveShowrooms.length})`
              : `${t[language].activeShowrooms} (${activeShowrooms.length})`
            }
          </h2>
          {displayedShowrooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{t[language].noShowrooms}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedShowrooms.map((showroom) => (
                <div
                  key={showroom._id || showroom.code}
                  className={`bg-white border-2 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${
                    showroom.isActive ? "border-green-200" : "border-gray-200 opacity-60"
                  }`}
                >
                  <div className="relative h-48 bg-gray-100">
                    {showroom.image_link ? (
                      <img
                        src={showroom.image_link.startsWith("data:") ? showroom.image_link : `https://${showroom.image_link}`}
                        alt={language === "ar" ? showroom.name.ar : showroom.name.en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {showroom.isActive ? (
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
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {language === "ar" ? showroom.name.ar : showroom.name.en}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {language === "ar" ? showroom.city.ar : showroom.city.en}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#009FE3]" />
                        <span>{showroom.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#009FE3]" />
                        <span className="truncate">{language === "ar" ? showroom.address.ar : showroom.address.en}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#009FE3]" />
                        <span>{language === "ar" ? showroom.hours.from.ar : showroom.hours.from.en} - {language === "ar" ? showroom.hours.to.ar : showroom.hours.to.en}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditingShowroom(showroom)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        {t[language].edit}
                      </button>
                      <button
                        onClick={() => handleToggleActive(showroom)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                          showroom.isActive
                            ? "bg-gray-500 text-white hover:bg-gray-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {showroom.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showroom.isActive ? t[language].deactivate : t[language].activate}
                      </button>
                      <button
                        onClick={() => handleDeleteShowroom(showroom)}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowroomsManagement;
