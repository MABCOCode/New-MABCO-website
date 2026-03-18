import { useState } from "react";
import {
  X,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";

interface WarrantyCheckServiceProps {
  language: "ar" | "en";
  onClose: () => void;
}

interface WarrantyApiResult {
  void_wty?: string;
  wty_end_dt?: string;
  temp1?: string;
}

interface WarrantyData {
  statusCode: string;
  statusLabel: { ar: string; en: string };
  endDate?: string;
  message?: string;
  isActive: boolean;
}

export function WarrantyCheckService({
  language,
  onClose,
}: WarrantyCheckServiceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<WarrantyData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    ar: {
      title: "فحص الضمان والمنتج",
      subtitle: "تحقق من حالة ضمان جهازك",
      enterSerial: "أدخل الرقم التسلسلي أو IMEI",
      placeholder: "IMEI أو الرقم التسلسلي",
      search: "بحث",
      warrantyStatus: "حالة الضمان",
      active: "ساري",
      expired: "منتهي",
      productInfo: "معلومات المنتج",
      warrantyDetails: "تفاصيل الضمان",
      purchaseDate: "تاريخ الشراء",
      warrantyPeriod: "فترة الضمان",
      warrantyExpiry: "تاريخ انتهاء الضمان",
      coverageType: "نوع التغطية",
      claimsUsed: "المطالبات المستخدمة",
      claimsRemaining: "المطالبات المتبقية",
      purchaseLocation: "مكان الشراء",
      full: "كامل",
      limited: "محدود",
      months: "شهر",
      daysRemaining: "يوم متبقي",
      notFound: "لم يتم العثور على نتائج",
      notFoundDesc: "تحقق من الرقم التسلسلي وحاول مرة أخرى",
      validWarranty: "ضمان ساري المفعول",
      expiredWarranty: "الضمان منتهي",
      warrantyValid: "جهازك مشمول بالضمان",
      warrantyExpired: "ضمان جهازك منتهي",
      notMabco: "الجهاز غير مشمول بضمان MABCO",
      contactUs: "للمزيد من المعلومات، تواصل معنا",
    },
    en: {
      title: "Warranty & Product Check",
      subtitle: "Verify your device warranty status",
      enterSerial: "Enter Serial Number or IMEI",
      placeholder: "IMEI or Serial Number",
      search: "Search",
      warrantyStatus: "Warranty Status",
      active: "Active",
      expired: "Expired",
      warrantyExpiry: "Warranty Expiry",
      daysRemaining: "days remaining",
      notFound: "No Results Found",
      notFoundDesc: "Please check the serial number and try again",
      validWarranty: "Valid Warranty",
      expiredWarranty: "Expired Warranty",
      warrantyValid: "Your device is covered by warranty",
      warrantyExpired: "Your device warranty has expired",
      notMabco: "Device is not covered by MABCO warranty",
      premiumWarranty: "Premium Warranty",
      contactUs: "For more information, contact us",
    },
  };

  const getStatusLabel = (code: string) => {
    const normalized = String(code || "").trim().toUpperCase();
    if (normalized === "N") return { ar: "ضمان MABCO", en: "MABCO Warranty" };
    if (normalized === "21") return { ar: "ضمان MABCO 21 قيراط", en: "MABCO 21 Carat Warranty" };
    if (normalized === "24") return { ar: "ضمان MABCO 24 قيراط", en: "MABCO 24 Carat Warranty" };
    if (normalized === "Y") return { ar: "خارج الضمان", en: "Out of Warranty" };
    return { ar: "غير مشمول بضمان MABCO", en: "Not a MABCO device" };
  };

  const fetchWarranty = async (serial: string): Promise<WarrantyData | null> => {
    const base = "https://showman2.mabcoonline.com:444/Service1.svc/GetVoidWtyBySerial";
    const flag = language === "ar" ? "true" : "false";
    const url = `${base}/${encodeURIComponent(serial)}?flag=${flag}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as
      | WarrantyApiResult
      | { GetVoidWtyBySerialResult?: WarrantyApiResult | WarrantyApiResult[] };
    const rawResult = (data as any)?.GetVoidWtyBySerialResult ?? data;
    const result = Array.isArray(rawResult) ? rawResult[0] : rawResult;
    if (!result) return null;
    const code = String(result?.void_wty || "").trim();
    if (!code) return null;
    const label = getStatusLabel(code);
    const rawEnd = String(result?.wty_end_dt || result?.temp1 || "");
    const cleanedEnd = rawEnd.split(/\s+\n|\n/)[0]?.trim();
    const endDate = cleanedEnd || undefined;
    const isActive = ["N", "21", "24"].includes(code);
    return {
      statusCode: code,
      statusLabel: label,
      endDate: endDate,
      message: result?.temp1,
      isActive,
    };
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setNotFound(true);
      setSearchResult(null);
      return;
    }
    setIsLoading(true);
    setNotFound(false);
    setSearchResult(null);
    try {
      const result = await fetchWarranty(query);
      if (result) {
        setSearchResult(result);
        setNotFound(false);
      } else {
        setSearchResult(null);
        setNotFound(true);
      }
    } catch {
      setSearchResult(null);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SY" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isOutOfWarranty =
    (searchResult?.statusCode || "").trim().toUpperCase() === "Y";
  const isNotMabco = !!searchResult && !searchResult.isActive && !isOutOfWarranty;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
                  style={{ zIndex: 2000 }}

    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}

      >
        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t[language].title}</h2>
                <p className="text-indigo-100">{t[language].subtitle}</p>
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
              {t[language].enterSerial}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t[language].placeholder}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    {language === "ar" ? "جارٍ البحث..." : "Searching..."}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    {t[language].search}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {searchResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* Warranty Status Banner */}
              {searchResult.isActive ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-900 mb-1">
                        {t[language].validWarranty}
                      </h3>
                      <p className="text-green-700">{t[language].warrantyValid}</p>
                      <div className="mt-2 inline-flex items-center gap-2 bg-green-200 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 text-green-700" />
                        <span className="text-sm font-bold text-green-900">
                          {searchResult.endDate
                            ? `${getDaysRemaining(searchResult.endDate)} ${t[language].daysRemaining}`
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-red-900 mb-1">
                        {isNotMabco ? t[language].notMabco : t[language].expiredWarranty}
                      </h3>
                      <p className="text-red-700">
                        {isNotMabco ? t[language].notMabco : t[language].warrantyExpired}
                      </p>
                      <p className="text-sm text-red-600 mt-2">
                        {t[language].contactUs}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warranty Details */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-500" />
                  {t[language].warrantyStatus}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].warrantyStatus}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {language === "ar" ? searchResult.statusLabel.ar : searchResult.statusLabel.en}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].warrantyExpiry}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {searchResult.endDate ? formatDate(searchResult.endDate) : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning for expiring warranty */}
              {/* {searchResult.isActive &&
                searchResult.endDate &&
                getDaysRemaining(searchResult.endDate) < 90 && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-yellow-900 mb-1">
                          {language === "ar"
                            ? "ضمانك قارب على الانتهاء"
                            : "Your warranty is expiring soon"}
                        </p>
                        <p className="text-sm text-yellow-800">
                          {language === "ar"
                            ? "تواصل معنا لتمديد الضمان أو الاستفادة من عروض الصيانة"
                            : "Contact us to extend warranty or benefit from maintenance offers"}
                        </p>
                      </div>
                    </div>
                  </div>
                )} */}
            </div>
          )}

          {/* Not Found */}
          {notFound && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t[language].notFound}
              </h3>
              <p className="text-gray-600">{t[language].notFoundDesc}</p>
            </div>
          )}

          {/* Help Text */}
          {!searchResult && !notFound && (
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-indigo-900 mb-2">
                    {language === "ar"
                      ? "كيفية استخدام الخدمة"
                      : "How to use this service"}
                  </p>
                  <ul className="space-y-1 text-sm text-indigo-800">
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "أدخل الرقم التسلسلي الموجود على الجهاز"
                        : "Enter the serial number found on the device"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "أو أدخل رقم IMEI للهواتف المحمولة"
                        : "Or enter the IMEI number for mobile phones"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "انقر على زر البحث لعرض حالة الضمان"
                        : "Click the search button to view warranty status"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "يمكنك العثور على الرقم التسلسلي في الإعدادات أو على علبة المنتج"
                        : "You can find the serial number in settings or on the product box"}
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
