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

interface MyDevicesPageProps {
  language: "ar" | "en";
  onBack: () => void;
}


// Mock devices data
const mockDevices = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    nameEn: "iPhone 15 Pro Max",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop",
    purchaseDate: "2026-01-15",
    invoiceNumber: "INV-1001",
    warranty: {
      type: "manufacturerWarranty",
      status: "active",
      startDate: "2026-01-15",
      endDate: "2027-01-15",
      daysRemaining: 360,
      duration: 1,
      durationUnit: "year",
    },
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    nameEn: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
    purchaseDate: "2025-12-10",
    invoiceNumber: "INV-1002",
    warranty: {
      type: "manufacturerWarranty",
      status: "active",
      startDate: "2025-12-10",
      endDate: "2026-12-10",
      daysRemaining: 324,
      duration: 1,
      durationUnit: "year",
    },
  },
  {
    id: 3,
    name: "MacBook Pro 16",
    nameEn: "MacBook Pro 16",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    purchaseDate: "2025-08-20",
    invoiceNumber: "INV-983",
    warranty: {
      type: "extendedWarranty",
      status: "expiringSoon",
      startDate: "2025-08-20",
      endDate: "2026-02-20",
      daysRemaining: 31,
      duration: 6,
      durationUnit: "months",
    },
  },
  {
    id: 4,
    name: "iPad Air",
    nameEn: "iPad Air",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
    purchaseDate: "2024-11-05",
    invoiceNumber: "INV-856",
    warranty: {
      type: "manufacturerWarranty",
      status: "expired",
      startDate: "2024-11-05",
      endDate: "2025-11-05",
      daysRemaining: 0,
      duration: 1,
      durationUnit: "year",
    },
  },
  {
    id: 5,
    name: "AirPods Pro",
    nameEn: "AirPods Pro",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop",
    purchaseDate: "2026-01-15",
    invoiceNumber: "INV-1001",
    warranty: {
      type: "manufacturerWarranty",
      status: "active",
      startDate: "2026-01-15",
      endDate: "2027-01-15",
      daysRemaining: 360,
      duration: 1,
      durationUnit: "year",
    },
  },
];

export function MyDevicesPage({ language, onBack }: MyDevicesPageProps) {
  const t = translations[language];

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
      {/* Account Navigation Bar */}
      <AccountNavBar
        language={language}
        onBackToWebsite={onBack}
        onLogout={() => {}}
        hideLogout={true}
      />

      {/* Header - Below navbar */}
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
          <p className="text-white/90 mt-2">
            {mockDevices.length} {language === "ar" ? "جهاز مسجل" : "registered devices"}
          </p>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mockDevices.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_devices_no_devices}</h3>
            <p className="text-gray-600">{t.account_devices_no_devices_desc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Device Header */}
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
                        <span>{device.purchaseDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Warranty Status */}
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getWarrantyStatusColor(
                        device.warranty.status
                      )}`}
                    >
                      {getWarrantyStatusIcon(device.warranty.status)}
                      <span className="font-semibold">{{
                      active: t.account_devices_status_active,
                      expiringSoon: t.account_devices_status_expiring,
                      expired: t.account_devices_status_expired,
                    }[device.warranty.status]}</span>
                      {device.warranty.status === "active" ||
                      device.warranty.status === "expiringSoon" ? (
                        <span className="text-sm">
                          ({device.warranty.daysRemaining} {t.account_devices_days_remaining})
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Warranty Details */}
                  <div
                    className={`space-y-2 mb-4 text-sm ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_warranty_type}:</span>
                      <span className="font-medium text-gray-900">
                        {{
                        manufacturerWarranty: t.account_devices_type_manufacturer,
                        extendedWarranty: t.account_devices_type_extended,
                      }[device.warranty.type]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_warranty_period}:</span>
                      <span className="font-medium text-gray-900">
                        {device.warranty.duration}{" "}
                        {language === "ar"
                          ? device.warranty.duration > 1
                            ? device.warranty.durationUnit === "year"
                              ? t.account_devices_years
                              : t.account_devices_months
                            : device.warranty.durationUnit === "year"
                            ? t.account_devices_year
                            : t.account_devices_month
                          : device.warranty.duration > 1
                          ? device.warranty.durationUnit + "s"
                          : device.warranty.durationUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_warranty_expiry}:</span>
                      <span className="font-medium text-gray-900">{device.warranty.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_devices_invoice_number}:</span>
                      <span className="font-medium text-gray-900">{device.invoiceNumber}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button className="flex-1 border-2 border-[#009FE3] text-[#009FE3] px-4 py-2 rounded-lg hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm">
                      <FileText className="w-4 h-4" />
                      {t.account_devices_view_invoice}
                    </button>
                    {(device.warranty.status === "active" ||
                      device.warranty.status === "expiringSoon") && (
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
