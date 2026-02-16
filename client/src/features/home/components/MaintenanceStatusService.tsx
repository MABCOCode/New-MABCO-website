import { useState } from "react";
import {
  Search,
  Package,
  CheckCircle,
  Clock,
  Wrench,
  FileCheck,
  Home,
  User,
  Calendar,
  Phone,
  Loader2,
  AlertCircle,
  ArrowRight,
  MapPin,
  X,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface MaintenanceStatusServiceProps {
  language: "ar" | "en";
  onClose: () => void;
}

// Mock API Response Types
interface StatusHistory {
  status: string;
  statusAr: string;
  statusEn: string;
  date: string;
  time: string;
  description?: string;
  descriptionAr?: string;
  technician?: string;
  icon: string;
}

interface MaintenanceData {
  orderId: string;
  deviceType: string;
  deviceModel: string;
  currentStatus: string;
  currentStatusAr: string;
  currentStatusEn: string;
  progress: number;
  estimatedCompletion: string;
  technician: {
    name: string;
    phone: string;
    specialty: string;
    specialtyAr: string;
  };
  statusHistory: StatusHistory[];
  problemDescription: string;
  problemDescriptionAr: string;
}

// Mock API call - في التطبيق الحقيقي، هذه ستكون استدعاء حقيقي لـ API
const mockApiCall = async (
  searchValue: string,
): Promise<MaintenanceData | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock database - في الواقع هذا سيأتي من السيرفر
  const mockDatabase: { [key: string]: MaintenanceData } = {
    S324s3422: {
      orderId: "S324s3422",
      deviceType: "Samsung Galaxy S23",
      deviceModel: "SM-S911B",
      currentStatus: "under_repair",
      currentStatusAr: "تحت الصيانة",
      currentStatusEn: "Under Repair",
      progress: 45,
      estimatedCompletion: "2024-02-15",
      technician: {
        name: "أحمد علي",
        phone: "+963 912 345 678",
        specialty: "Mobile Repair Specialist",
        specialtyAr: "أخصائي صيانة الهواتف",
      },
      problemDescription:
        "Screen replacement and battery check",
      problemDescriptionAr: "استبدال الشاشة وفحص البطارية",
      statusHistory: [
        {
          status: "received",
          statusAr: "تم الاستلام",
          statusEn: "Received",
          date: "2024-02-10",
          time: "10:30 AM",
          description: "Device received at service center",
          descriptionAr: "تم استلام الجهاز في مركز الخدمة",
          icon: "Package",
        },
        {
          status: "diagnosed",
          statusAr: "تم التشخيص",
          statusEn: "Diagnosed",
          date: "2024-02-11",
          time: "02:15 PM",
          description: "Initial diagnosis completed",
          descriptionAr: "تم إكمال التشخيص الأولي",
          technician: "أحمد علي",
          icon: "FileCheck",
        },
        {
          status: "under_repair",
          statusAr: "تحت الصيانة",
          statusEn: "Under Repair",
          date: "2024-02-12",
          time: "09:00 AM",
          description: "Repair work in progress",
          descriptionAr: "جارٍ العمل على الإصلاح",
          technician: "أحمد علي",
          icon: "Wrench",
        },
      ],
    },
    IP14PM001: {
      orderId: "IP14PM001",
      deviceType: "iPhone 14 Pro Max",
      deviceModel: "A2894",
      currentStatus: "quality_check",
      currentStatusAr: "فحص الجودة",
      currentStatusEn: "Quality Check",
      progress: 85,
      estimatedCompletion: "2024-02-13",
      technician: {
        name: "خالد يوسف",
        phone: "+963 933 456 789",
        specialty: "Quality Control Supervisor",
        specialtyAr: "مشرف مراقبة الجودة",
      },
      problemDescription: "Camera module replacement",
      problemDescriptionAr: "استبدال وحدة الكاميرا",
      statusHistory: [
        {
          status: "received",
          statusAr: "تم الاستلام",
          statusEn: "Received",
          date: "2024-02-08",
          time: "11:00 AM",
          icon: "Package",
        },
        {
          status: "diagnosed",
          statusAr: "تم التشخيص",
          statusEn: "Diagnosed",
          date: "2024-02-08",
          time: "03:30 PM",
          technician: "محمد حسن",
          icon: "FileCheck",
        },
        {
          status: "under_repair",
          statusAr: "تحت الصيانة",
          statusEn: "Under Repair",
          date: "2024-02-09",
          time: "10:00 AM",
          technician: "محمد حسن",
          icon: "Wrench",
        },
        {
          status: "quality_check",
          statusAr: "فحص الجودة",
          statusEn: "Quality Check",
          date: "2024-02-12",
          time: "01:00 PM",
          technician: "خالد يوسف",
          icon: "CheckCircle",
        },
      ],
    },
    LAP2024X1: {
      orderId: "LAP2024X1",
      deviceType: "Dell XPS 15",
      deviceModel: "9520",
      currentStatus: "ready_pickup",
      currentStatusAr: "جاهز للاستلام",
      currentStatusEn: "Ready for Pickup",
      progress: 100,
      estimatedCompletion: "2024-02-12",
      technician: {
        name: "عمر الشامي",
        phone: "+963 944 567 890",
        specialty: "Laptop Specialist",
        specialtyAr: "أخصائي حواسيب محمولة",
      },
      problemDescription:
        "SSD upgrade and thermal paste replacement",
      problemDescriptionAr:
        "ترقية القرص الصلب واستبدال المعجون الحراري",
      statusHistory: [
        {
          status: "received",
          statusAr: "تم الاستلام",
          statusEn: "Received",
          date: "2024-02-05",
          time: "09:30 AM",
          icon: "Package",
        },
        {
          status: "diagnosed",
          statusAr: "تم التشخيص",
          statusEn: "Diagnosed",
          date: "2024-02-06",
          time: "11:00 AM",
          technician: "عمر الشامي",
          icon: "FileCheck",
        },
        {
          status: "under_repair",
          statusAr: "تحت الصيانة",
          statusEn: "Under Repair",
          date: "2024-02-07",
          time: "02:00 PM",
          technician: "عمر الشامي",
          icon: "Wrench",
        },
        {
          status: "quality_check",
          statusAr: "فحص الجودة",
          statusEn: "Quality Check",
          date: "2024-02-10",
          time: "10:30 AM",
          technician: "خالد يوسف",
          icon: "CheckCircle",
        },
        {
          status: "ready_pickup",
          statusAr: "جاهز للاستلام",
          statusEn: "Ready for Pickup",
          date: "2024-02-12",
          time: "09:00 AM",
          icon: "Home",
        },
      ],
    },
  };

  // البحث في قاعدة البيانات الوهمية
  const result = mockDatabase[searchValue.toUpperCase()];
  return result || null;
};

export function MaintenanceStatusService({
  language,
  onClose,
}: MaintenanceStatusServiceProps) {
  const [searchType, setSearchType] = useState<
    "serial" | "order"
  >("order");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [maintenanceData, setMaintenanceData] =
    useState<MaintenanceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError(
        language === "ar"
          ? "الرجاء إدخال رقم البحث"
          : "Please enter search number",
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setMaintenanceData(null);

    try {
      const result = await mockApiCall(searchValue);

      if (result) {
        setMaintenanceData(result);
        setError(null);
      } else {
        setError(
          language === "ar"
            ? "لم يتم العثور على الطلب. تحقق من الرقم وحاول مرة أخرى."
            : "Order not found. Please check the number and try again.",
        );
      }
    } catch (err) {
      setError(
        language === "ar"
          ? "حدث خطأ في الاتصال. حاول مرة أخرى."
          : "Connection error. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      received: "bg-blue-500",
      diagnosed: "bg-purple-500",
      under_repair: "bg-orange-500",
      quality_check: "bg-indigo-500",
      ready_pickup: "bg-green-500",
      completed: "bg-emerald-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Package,
      FileCheck,
      Wrench,
      CheckCircle,
      Home,
    };
    return icons[iconName] || Clock;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "ar" ? "ar-SY" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
                  style={{ zIndex: 2000 }}

    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Wrench className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {language === "ar"
                    ? "فحص حالة الصيانة"
                    : "Maintenance Status Check"}
                </h2>
                <p className="text-blue-100">
                  {language === "ar"
                    ? "تتبع جهازك في الوقت الفعلي"
                    : "Track your device in real-time"}
                </p>
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
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              {language === "ar"
                ? "أدخل رقم الطلب أو الرقم التسلسلي"
                : "Enter Order Number or Serial Number"}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearch()
                }
                placeholder={
                  language === "ar"
                    ? "رقم الطلب أو IMEI"
                    : "Order Number or IMEI"
                }
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === "ar"
                      ? "جارٍ البحث..."
                      : "Searching..."}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    {language === "ar" ? "بحث" : "Search"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {maintenanceData && (
            <div className="space-y-6 animate-fadeIn">
              {/* Status Card */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === "ar"
                      ? "الحالة الحالية"
                      : "Current Status"}
                  </h3>
                  <div
                    className={`px-4 py-2 rounded-lg border-2 font-bold ${getStatusColor(maintenanceData.currentStatus)}`}
                  >
                    {language === "ar"
                      ? maintenanceData.currentStatusAr
                      : maintenanceData.currentStatusEn}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {language === "ar"
                        ? "التقدم"
                        : "Progress"}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {maintenanceData.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 rounded-full"
                      style={{
                        width: `${maintenanceData.progress}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Device Info */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-500" />
                  {language === "ar"
                    ? "معلومات الجهاز"
                    : "Device Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "الجهاز" : "Device"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {language === "ar"
                        ? maintenanceData.deviceType
                        : maintenanceData.deviceType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "العلامة" : "Brand"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {maintenanceData.deviceModel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "رقم الطلب"
                        : "Order Number"}
                    </p>
                    <p className="text-lg font-mono font-bold text-blue-600">
                      {maintenanceData.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "الرقم التسلسلي"
                        : "Serial Number"}
                    </p>
                    <p className="text-sm font-mono font-bold text-gray-900">
                      {maintenanceData.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "المشكلة" : "Issue"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {language === "ar"
                        ? maintenanceData.problemDescriptionAr
                        : maintenanceData.problemDescription}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "الفني المسؤول"
                        : "Technician"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {maintenanceData.technician.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "تاريخ الاستلام"
                        : "Received Date"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(
                        maintenanceData.statusHistory[0].date,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "الموعد المتوقع"
                        : "Estimated Completion"}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatDate(
                        maintenanceData.estimatedCompletion,
                      )}
                    </p>
                  </div>
                </div>

                {maintenanceData.statusHistory.some(
                  (event) => event.description,
                ) && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-yellow-900 mb-1">
                          {language === "ar"
                            ? "ملاحظات"
                            : "Notes"}
                        </p>
                        {maintenanceData.statusHistory.map(
                          (event) =>
                            event.description && (
                              <p
                                key={event.date}
                                className="text-sm text-yellow-800"
                              >
                                {event.description}
                              </p>
                            ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-500" />
                  {language === "ar"
                    ? "سجل الصيانة"
                    : "Maintenance Timeline"}
                </h3>
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-500 to-gray-300"></div>
                  <div className="space-y-6">
                    {maintenanceData.statusHistory.map(
                      (event, index) => {
                        const config = {
                          status: event.status,
                          statusAr: event.statusAr,
                          statusEn: event.statusEn,
                          color: getStatusColor(event.status),
                        };
                        const isLast =
                          index ===
                          maintenanceData.statusHistory.length -
                            1;

                        return (
                          <div
                            key={index}
                            className="relative flex gap-4 items-start"
                          >
                            <div
                              className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 ${
                                isLast
                                  ? "bg-blue-500 ring-4 ring-blue-100"
                                  : "bg-green-500"
                              }`}
                            >
                              {isLast ? (
                                <Wrench className="w-5 h-5 text-white" />
                              ) : (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              )}
                            </div>

                            <div
                              className={`flex-1 rounded-xl p-4 border ${
                                isLast
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-green-50 border-green-200"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-sm ${config.color} text-white`}
                                >
                                  {language === "ar"
                                    ? config.statusAr
                                    : config.statusEn}
                                </div>
                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                              {event.note && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {event.note}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Not Found */}
          {error && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === "ar"
                  ? "لم يتم العثور على نتائج"
                  : "No Results Found"}
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {/* Help Text */}
          {!maintenanceData && !error && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900 mb-2">
                    {language === "ar"
                      ? "كيفية استخدام الخدمة"
                      : "How to use this service"}
                  </p>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "أدخل رقم الطلب أو الرقم التسلسلي الخاص بجهازك"
                        : "Enter your device order number or serial number"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "انقر على زر البحث لعرض حالة جهازك"
                        : "Click the search button to view your device status"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}