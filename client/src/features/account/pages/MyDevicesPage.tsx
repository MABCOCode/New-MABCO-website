import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Calendar,
  FileText,
  Wrench,
  Smartphone,
} from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { AccountNavBar } from "../components/AccountNavBar";
import translations from "../../../i18n/translations";
import { loadSession } from "../storage";

interface MyDevicesPageProps {
  language: "ar" | "en";
  onBack: () => void;
}

type DeviceRow = {
  id: string;
  name: string;
  nameEn: string;
  brand: string;
  image: string;
  purchaseDate: string;
  invoiceNumber: string | null;
  warranty: {
    type: "manufacturerWarranty";
    status: "active" | "expiringSoon" | "expired";
    endDate: string;
    daysRemaining: number;
    duration: number;
    durationUnit: "year";
  };
};

const normalizePhone = (raw: string) => {
  if (!raw) return "";
  let digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("963")) digits = digits.slice(3);
  if (digits.startsWith("9") && digits.length === 9) digits = `0${digits}`;
  if (digits.startsWith("09") && digits.length === 10) return digits;
  if (digits.length >= 8) return `09${digits.slice(-8)}`;
  return "";
};

const formatDateLabel = (value: string, language: "ar" | "en") => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(language === "ar" ? "ar-SY" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getWarrantyMeta = (dateValue: string) => {
  const purchaseDate = new Date(dateValue);
  if (Number.isNaN(purchaseDate.getTime())) {
    return {
      status: "expired" as const,
      endDate: "-",
      daysRemaining: 0,
    };
  }

  const endDate = new Date(purchaseDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  const diffDays = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return {
    status: diffDays <= 0 ? "expired" as const : diffDays <= 30 ? "expiringSoon" as const : "active" as const,
    endDate: endDate.toISOString(),
    daysRemaining: Math.max(0, diffDays),
  };
};

export function MyDevicesPage({ language, onBack }: MyDevicesPageProps) {
  const t = translations[language];
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const session = loadSession() as any;
    const phone = normalizePhone(session?.user?.phone || "");
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

    if (!phone) {
      setDevices([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`${apiBase}/orders?phone=${encodeURIComponent(phone)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load devices");
        const json = await res.json();
        if (!mounted) return;

        const orderRows = Array.isArray(json?.data) ? json.data : [];
        const nextDevices = orderRows
          .flatMap((order: any, orderIndex: number) => {
            const purchaseDate = String(order?.createdAt || order?.timestamp || "");
            const invoiceNumber = order?.invoiceNo ?? order?.inv_no ?? null;
            return (Array.isArray(order?.items) ? order.items : []).map((item: any, itemIndex: number) => {
              const warrantyMeta = getWarrantyMeta(purchaseDate);
              return {
                id: String(item?.id ?? item?.productId ?? `${order?._id || orderIndex}-${itemIndex}`),
                name: String(item?.nameAr ?? item?.name ?? ""),
                nameEn: String(item?.name ?? item?.nameEn ?? item?.nameAr ?? ""),
                brand: String(item?.brand ?? item?.brandName ?? ""),
                image: String(item?.image ?? ""),
                purchaseDate,
                invoiceNumber: invoiceNumber ? String(invoiceNumber) : null,
                warranty: {
                  type: "manufacturerWarranty" as const,
                  status: warrantyMeta.status,
                  endDate: warrantyMeta.endDate,
                  daysRemaining: warrantyMeta.daysRemaining,
                  duration: 1,
                  durationUnit: "year" as const,
                },
              };
            });
          })
          .filter((item: DeviceRow) => item.name || item.nameEn);

        setDevices(nextDevices);
      })
      .catch(() => {
        if (!mounted) return;
        setDevices([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalLabel = useMemo(
    () => `${devices.length} ${language === "ar" ? "جهاز مسجل" : "registered devices"}`,
    [devices.length, language],
  );

  const getWarrantyStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "expiringSoon":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "expired":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getWarrantyStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <ShieldCheck className="w-5 h-5" />;
      case "expiringSoon":
        return <ShieldAlert className="w-5 h-5" />;
      case "expired":
        return <ShieldOff className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountNavBar
        language={language}
        onBackToWebsite={onBack}
        onLogout={() => {}}
        hideLogout={true}
      />

      <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            {language === "ar" ? (
              <>
                <span>{t.account_devices_back}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>{t.account_devices_back}</span>
              </>
            )}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">{t.account_devices_title}</h1>
          <p className="text-white/90 mt-2">{totalLabel}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`device-skeleton-${index}`} className="h-64 rounded-xl shimmer-surface" />
            ))}
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_devices_no_devices}</h3>
            <p className="text-gray-600">{t.account_devices_no_devices_desc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div
                    className={`flex gap-4 mb-4 ${
                      language === "ar" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <ImageWithFallback
                      src={device.image}
                      alt={language === "ar" ? device.name : device.nameEn}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {language === "ar" ? device.name : device.nameEn}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{device.brand}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateLabel(device.purchaseDate, language)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getWarrantyStatusColor(
                        device.warranty.status,
                      )}`}
                    >
                      {getWarrantyStatusIcon(device.warranty.status)}
                      <span className="font-semibold">
                        {{
                          active: t.account_devices_status_active,
                          expiringSoon: t.account_devices_status_expiring,
                          expired: t.account_devices_status_expired,
                        }[device.warranty.status]}
                      </span>
                      {(device.warranty.status === "active" || device.warranty.status === "expiringSoon") && (
                        <span className="text-sm">
                          ({device.warranty.daysRemaining} {t.account_devices_days_remaining})
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`space-y-2 mb-4 text-sm ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_warranty_type}:</span>
                      <span className="font-medium text-gray-900">{t.account_devices_type_manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_warranty_period}:</span>
                      <span className="font-medium text-gray-900">
                        1 {language === "ar" ? t.account_devices_year : "year"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_warranty_expiry}:</span>
                      <span className="font-medium text-gray-900">
                        {formatDateLabel(device.warranty.endDate, language)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_invoice_number}:</span>
                      <span className="font-medium text-gray-900">{device.invoiceNumber || "-"}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      disabled={!device.invoiceNumber}
                      className={`flex-1 border-2 px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm ${
                        device.invoiceNumber
                          ? "border-[#009FE3] text-[#009FE3] hover:bg-[#009FE3] hover:text-white"
                          : "border-gray-300 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      {t.account_devices_view_invoice}
                    </button>
                    {(device.warranty.status === "active" || device.warranty.status === "expiringSoon") && (
                      <button className="flex-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm">
                        <Wrench className="w-4 h-4" />
                        {t.account_devices_request_maintenance}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
