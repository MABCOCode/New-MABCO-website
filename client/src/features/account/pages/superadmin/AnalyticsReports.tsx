import { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, Calendar, TrendingUp, Users, Package, ShoppingCart, Bell, Download } from "lucide-react";
import { WebsiteTrafficReport } from "./WebsiteTrafficReport";
import { ProductPerformanceReport } from "./ProductPerformanceReport";
import { SalesOrdersReport } from "./SalesOrdersReport";
import { AdminPerformanceReport } from "./AdminPerformanceReport";
import { NotificationAnalyticsReport } from "./NotificationAnalyticsReport";
import { superAdminTranslations } from "./superAdminTranslations";

interface AnalyticsReportsProps {
  language: "ar" | "en";
  onBack: () => void;
}

type ReportTab = "traffic" | "products" | "sales" | "admin" | "notifications";

export function AnalyticsReports({ language, onBack }: AnalyticsReportsProps) {
  const isRTL = language === "ar";
  const t = superAdminTranslations[language];
  const [activeTab, setActiveTab] = useState<ReportTab>("traffic");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("week");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const tabs = [
    { id: "traffic" as const, label: t.websiteTraffic, icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
    { id: "products" as const, label: t.productPerformance, icon: Package, color: "text-green-600", bgColor: "bg-green-100" },
    { id: "sales" as const, label: t.salesAndOrders, icon: ShoppingCart, color: "text-purple-600", bgColor: "bg-purple-100" },
    { id: "admin" as const, label: t.adminPerformance, icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-100" },
    { id: "notifications" as const, label: t.notificationsAnalytics, icon: Bell, color: "text-pink-600", bgColor: "bg-pink-100" },
  ];

  const dateRangeOptions = [
    { value: "today", label: t.today },
    { value: "week", label: t.last7Days },
    { value: "month", label: t.last30Days },
    { value: "custom", label: t.customRange },
  ];

  const getDateRange = () => {
    const end = new Date();
    let start = new Date();

    if (dateRange === "today") {
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === "week") {
      start.setDate(start.getDate() - 7);
    } else if (dateRange === "month") {
      start.setDate(start.getDate() - 30);
    } else if (dateRange === "custom" && startDate && endDate) {
      return { start: new Date(startDate), end: new Date(endDate) };
    }

    return { start, end };
  };

  const handleExportAll = () => {
    alert(isRTL ? "جارٍ تصدير جميع التقارير..." : "Exporting all reports...");
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button onClick={onBack} className="mb-4 text-green-100 hover:text-white flex items-center gap-2">
            <span>{isRTL ? "→" : "←"}</span>
            <span>{t.back}</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">{t.analyticsAndReports}</h1>
                <p className="text-green-100 text-sm mt-1">{t.analyticsSubtitle}</p>
              </div>
            </div>
            <button onClick={handleExportAll} className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t.exportAll}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">{t.dateRange}</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value as any)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    dateRange === option.value ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {dateRange === "custom" && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-500">{t.to}</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-max px-6 py-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                  activeTab === tab.id
                    ? `border-green-600 ${tab.bgColor} ${tab.color}`
                    : "border-transparent hover:bg-gray-50 text-gray-600"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "traffic" && <WebsiteTrafficReport language={language} dateRange={getDateRange()} />}
          {activeTab === "products" && <ProductPerformanceReport language={language} dateRange={getDateRange()} />}
          {activeTab === "sales" && <SalesOrdersReport language={language} dateRange={getDateRange()} />}
          {activeTab === "admin" && <AdminPerformanceReport language={language} dateRange={getDateRange()} />}
          {activeTab === "notifications" && <NotificationAnalyticsReport language={language} dateRange={getDateRange()} />}
        </motion.div>
      </div>
    </div>
  );
}
