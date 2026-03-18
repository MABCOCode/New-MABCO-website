import { useState } from "react";
import {
  Search,
  Package,
  Wrench,
  Home,
  User,
  Loader2,
  AlertCircle,
  X,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface MaintenanceStatusServiceProps {
  language: "ar" | "en";
  onClose: () => void;
}

interface MaintenanceData {
  orderInfo: Record<string, any>;
  invoiceRows: Record<string, any>[];
}

const fetchMaintenanceData = async (searchValue: string): Promise<MaintenanceData | null> => {
  const url = `https://showman2.mabcoonline.com:444/Service1.svc/getSerOrderInfo/${encodeURIComponent(searchValue)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();
  const orderResult = data?.getSerOrderInfoResult;
  const invoiceResult = data?.getSerInvoiceResult;
  const orderInfo = Array.isArray(orderResult) ? orderResult[0] : orderResult;
  if (!orderInfo) return null;
  const invoiceRows = Array.isArray(invoiceResult)
    ? invoiceResult
    : invoiceResult
      ? [invoiceResult]
      : [];
  return { orderInfo, invoiceRows };
};

export function MaintenanceStatusService({
  language,
  onClose,
}: MaintenanceStatusServiceProps) {
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
      const result = await fetchMaintenanceData(searchValue);

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

  const getStatusStage = (code: number) => {
    if ([1, 2, 3].includes(code)) return 1;
    if ([4, 6, 8, 9].includes(code)) return 2;
    if ([11].includes(code)) return 3;
    if ([12, 13].includes(code)) return 4;
    if ([14].includes(code)) return 5;
    if ([15].includes(code)) return 6;
    return 0;
  };

  const getStatusLabel = (code: number) => {
    const map = new Map<number, { ar: string; en: string }>([
      [1, { ar: "مع الفني", en: "With Technician" }],
      [2, { ar: "مع الفني", en: "With Technician" }],
      [3, { ar: "مع الفني", en: "With Technician" }],
      [4, { ar: "تحت الصيانة", en: "Under Maintenance" }],
      [6, { ar: "تحت الصيانة", en: "Under Maintenance" }],
      [8, { ar: "تحت الصيانة", en: "Under Maintenance" }],
      [9, { ar: "تحت الصيانة", en: "Under Maintenance" }],
      [11, { ar: "فحص الجودة", en: "Quality Testing" }],
      [12, { ar: "العودة إلى صالة العرض", en: "Returning to Showroom" }],
      [13, { ar: "العودة إلى صالة العرض", en: "Returning to Showroom" }],
      [14, { ar: "جاهز للاستلام", en: "Ready for Delivery" }],
      [15, { ar: "تم التسليم", en: "Delivered" }],
    ]);
    return map.get(code) || { ar: "غير معروف", en: "Unknown" };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString(
      language === "ar" ? "ar-SY" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  const orderInfo = maintenanceData?.orderInfo || {};
  const invoiceRows = maintenanceData?.invoiceRows || [];
  const statusCode = Number(orderInfo?.status || 0);
  const statusLabel = getStatusLabel(statusCode);
  const statusStage = getStatusStage(statusCode);
  const progress = statusStage >= 5 ? 100 : Math.round((Math.max(statusStage, 0) / 5) * 100);

  const normalizeBillingType = (value?: string) => {
    const code = String(value || "").trim().toLowerCase();
    if (code === "f") return language === "ar" ? "رسوم كاملة" : "Full charge";
    if (code === "c") return language === "ar" ? "ضمان مع رسوم" : "Warranty with charge";
    if (code === "w") return language === "ar" ? "ضمان" : "Warranty";
    return value || "-";
  };

  const steps = [
    { key: "tech", ar: "مع الفني", en: "Technician", icon: User, doneAt: statusStage >= 1 },
    { key: "maint", ar: "تحت الصيانة", en: "Maintenance", icon: Wrench, doneAt: statusStage >= 2 },
    { key: "quality", ar: "فحص الجودة", en: "Quality Check", icon: CheckCircle2, doneAt: statusStage >= 3 },
    { key: "return", ar: "العودة إلى صالة العرض", en: "Return to Showroom", icon: Home, doneAt: statusStage >= 4 },
    { key: "ready", ar: "جاهز للاستلام", en: "Ready for Delivery", icon: Package, doneAt: statusStage >= 5 },
  ];

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
                    className="px-4 py-2 rounded-lg border-2 font-bold bg-blue-600 text-white"
                  >
                    {language === "ar" ? statusLabel.ar : statusLabel.en}
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
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 rounded-full"
                      style={{
                        width: `${progress}%`,
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
                      {orderInfo?.model_desc || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "اسم العميل" : "Customer Name"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {orderInfo?.custm_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "رقم الطلب"
                        : "Order Number"}
                    </p>
                    <p className="text-lg font-mono font-bold text-blue-600">
                      {orderInfo?.ord_no || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "الرقم التسلسلي"
                        : "Serial Number"}
                    </p>
                    <p className="text-sm font-mono font-bold text-gray-900">
                      {orderInfo?.mobile_slno || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "الفرع" : "Branch"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orderInfo?.loc_nameAr || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "رقم الهاتف"
                        : "Phone"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orderInfo?.phone_no || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "تاريخ الاستلام"
                        : "Received Date"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(orderInfo?.trn_dt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar"
                        ? "تاريخ التسليم"
                        : "Delivery Date"}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatDate(orderInfo?.deliv_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "القسم" : "Department"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orderInfo?.department || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "نوع الفاتورة" : "Billing Type"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {normalizeBillingType(orderInfo?.billing_type)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  {language === "ar" ? "مراحل الصيانة" : "Maintenance Steps"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.key}
                        className={`flex items-center gap-3 rounded-xl border p-4 ${
                          step.doneAt ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.doneAt ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            {language === "ar" ? step.ar : step.en}
                          </p>
                          <p className="text-sm text-gray-600">
                            {step.doneAt
                              ? language === "ar"
                                ? "تم الإنجاز"
                                : "Completed"
                              : language === "ar"
                                ? "قيد الانتظار"
                                : "Pending"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Invoice */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  {language === "ar" ? "الفاتورة" : "Invoice"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "أجرة اليد العاملة" : "Labor Charge"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {invoiceRows[0]?.labour_charge ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "الإجمالي" : "Grand Total"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {invoiceRows[0]?.grand_total ?? "-"}
                    </p>
                  </div>
                </div>
                {invoiceRows.length > 0 && (
                  <div className="space-y-2">
                    {invoiceRows.map((row, idx) => (
                      <div key={`invoice-row-${idx}`} className="rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                        {Object.entries(row).map(([key, value]) => (
                          <div key={`${idx}-${key}`} className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-600">{key}</span>
                            <span className="text-gray-900">{String(value ?? "-")}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
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
