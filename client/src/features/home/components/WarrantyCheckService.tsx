import { useState } from "react";
import {
  X,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  MapPin,
  AlertTriangle,
  Info,
} from "lucide-react";
import { warrantyRecords, WarrantyRecord } from "../../../data/servicesData";

interface WarrantyCheckServiceProps {
  language: "ar" | "en";
  onClose: () => void;
}

export function WarrantyCheckService({
  language,
  onClose,
}: WarrantyCheckServiceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<WarrantyRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

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
      productInfo: "Product Information",
      warrantyDetails: "Warranty Details",
      purchaseDate: "Purchase Date",
      warrantyPeriod: "Warranty Period",
      warrantyExpiry: "Warranty Expiry",
      coverageType: "Coverage Type",
      claimsUsed: "Claims Used",
      claimsRemaining: "Claims Remaining",
      purchaseLocation: "Purchase Location",
      full: "Full",
      limited: "Limited",
      months: "months",
      daysRemaining: "days remaining",
      notFound: "No Results Found",
      notFoundDesc: "Please check the serial number and try again",
      validWarranty: "Valid Warranty",
      expiredWarranty: "Expired Warranty",
      warrantyValid: "Your device is covered by warranty",
      warrantyExpired: "Your device warranty has expired",
      contactUs: "For more information, contact us",
    },
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toUpperCase();
    const result = warrantyRecords.find(
      (r) =>
        r.serialNumber.toUpperCase() === query ||
        (r.imei && r.imei.toUpperCase() === query)
    );

    if (result) {
      setSearchResult(result);
      setNotFound(false);
    } else {
      setSearchResult(null);
      setNotFound(true);
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
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {t[language].search}
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
                          {getDaysRemaining(searchResult.warrantyExpiry)}{" "}
                          {t[language].daysRemaining}
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
                        {t[language].expiredWarranty}
                      </h3>
                      <p className="text-red-700">{t[language].warrantyExpired}</p>
                      <p className="text-sm text-red-600 mt-2">
                        {t[language].contactUs}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Information */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-indigo-500" />
                  {t[language].productInfo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "المنتج" : "Product"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {language === "ar"
                        ? searchResult.productNameAr
                        : searchResult.productName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "العلامة" : "Brand"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">{searchResult.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "الرقم التسلسلي" : "Serial Number"}
                    </p>
                    <p className="text-sm font-mono font-bold text-gray-900">
                      {searchResult.serialNumber}
                    </p>
                  </div>
                  {searchResult.imei && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">IMEI</p>
                      <p className="text-sm font-mono font-bold text-gray-900">
                        {searchResult.imei}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Warranty Details */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-500" />
                  {t[language].warrantyDetails}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].purchaseDate}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(searchResult.purchaseDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].warrantyPeriod}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {searchResult.warrantyPeriod} {t[language].months}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].warrantyExpiry}
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        searchResult.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatDate(searchResult.warrantyExpiry)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].coverageType}
                    </p>
                    <div
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg font-bold ${
                        searchResult.coverageType === "full"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {searchResult.coverageType === "full"
                        ? t[language].full
                        : t[language].limited}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].claimsUsed}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {searchResult.claimsUsed} / {searchResult.maxClaims}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t[language].claimsRemaining}
                    </p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {searchResult.maxClaims - searchResult.claimsUsed}
                    </p>
                  </div>
                </div>

                {/* Purchase Location */}
                <div className="mt-6 pt-6 border-t-2 border-indigo-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {t[language].purchaseLocation}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {searchResult.purchaseLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning for expiring warranty */}
              {searchResult.isActive &&
                getDaysRemaining(searchResult.warrantyExpiry) < 90 && (
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
                )}
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