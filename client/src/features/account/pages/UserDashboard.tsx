import { motion } from "motion/react";
import {
  ShoppingBag,
  Package,
  Smartphone,
  Shield,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { AccountNavBar } from "../components/AccountNavBar";
import translations from "../../../i18n/translations";

interface UserDashboardProps {
  language: "ar" | "en";
  user: any;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}


export function UserDashboard({
  language,
  user,
  onClose,
  onNavigate,
  onLogout,
}: UserDashboardProps) {
  const t = translations[language];

  // Mock data
  const stats = {
    totalOrders: 12,
    activeOrders: 2,
    devices: 5,
    activeWarranties: 3,
  };

  const quickLinks = [
    {
      id: "orders",
      icon: ShoppingBag,
      titleAr: "طلباتي",
      titleEn: "My Orders",
      descAr: "تتبع وإدارة طلباتك",
      descEn: "Track and manage your orders",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "devices",
      icon: Smartphone,
      titleAr: "أجهزةي",
      titleEn: "My Devices",
      descAr: "الأجهزة المشتراة والضمانات",
      descEn: "Purchased devices and warranties",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "invoices",
      icon: FileText,
      titleAr: "الفواتير",
      titleEn: "Invoices",
      descAr: "عرض وتحميل الفواتير",
      descEn: "View and download invoices",
      color: "from-green-500 to-green-600",
    },
    {
      id: "settings",
      icon: Settings,
      titleAr: "الإعدادات",
      titleEn: "Settings",
      descAr: "إدارة معلومات حسابك",
      descEn: "Manage your account info",
      color: "from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Account Navigation Bar */}
      <AccountNavBar
        language={language}
        userName={language === "ar" ? user.name : user.nameEn}
        onBackToWebsite={onClose}
        onLogout={onLogout}
      />

      {/* Header - Below navbar */}
      <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={language === "ar" ? "text-right" : "text-left"}>
            <h1 className="text-2xl md:text-3xl font-bold">{t.account_dashboard_my_account}</h1>
            <p className="text-white/90 mt-1">
              {t.account_dashboard_welcome}, {language === "ar" ? user.name : user.nameEn}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="mb-8">
          <h2
            className={`text-xl font-bold text-gray-900 mb-4 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.account_dashboard_account_overview}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_total_orders}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_active_orders}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_my_devices}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.devices}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_active_warranties}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeWarranties}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2
            className={`text-xl font-bold text-gray-900 mb-4 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.account_dashboard_quick_actions}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 5) }}
                onClick={() => onNavigate(link.id)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group text-left"
              >
                <div
                  className={`flex items-center ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  } gap-4`}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <link.icon className="w-7 h-7 text-white" />
                  </div>
                  <div
                    className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}
                  >
                    <h3 className="font-bold text-gray-900 mb-1">
                      {language === "ar" ? link.titleAr : link.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "ar" ? link.descAr : link.descEn}
                    </p>
                  </div>
                  {language === "ar" ? (
                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#009FE3] transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#009FE3] transition-colors" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
