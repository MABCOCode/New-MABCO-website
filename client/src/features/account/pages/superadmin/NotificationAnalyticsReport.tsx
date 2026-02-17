import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Bell, TrendingUp, MousePointer, Eye } from "lucide-react";
import { fetchAdminNotifications } from "../../api/adminDataApi";
import { superAdminTranslations } from "./superAdminTranslations";

interface NotificationAnalyticsReportProps {
  language: "ar" | "en";
  dateRange: { start: Date; end: Date };
}

export function NotificationAnalyticsReport({ language, dateRange }: NotificationAnalyticsReportProps) {
  const t = superAdminTranslations[language];
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    fetchAdminNotifications()
      .then((rows) => {
        setNotificationsData(rows || []);
        setIsLoading(false);
      })
      .catch(() => {
        setNotificationsData([]);
        setError(language === "ar" ? "تعذر تحميل تحليلات الإشعارات." : "Failed to load notifications analytics.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredNotifications = useMemo(
    () => notificationsData.filter((n) => {
      const at = new Date(n.createdAt || n.sentAt || 0);
      return at >= dateRange.start && at <= dateRange.end;
    }),
    [notificationsData, dateRange.start, dateRange.end],
  );

  const totalSent = filteredNotifications.reduce((sum, n) => sum + Number(n.sentCount || n.metrics?.sent || 0), 0);
  const totalDelivered = filteredNotifications.reduce((sum, n) => sum + Number(n.deliveredCount || n.metrics?.delivered || 0), 0);
  const totalOpened = filteredNotifications.reduce((sum, n) => sum + Number(n.openedCount || n.metrics?.opened || 0), 0);
  const totalClicked = filteredNotifications.reduce((sum, n) => sum + Number(n.clickedCount || n.metrics?.clicked || 0), 0);

  const stats = [
    { label: t.totalSent, value: totalSent, icon: Bell, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: t.openRate, value: `${totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '0.0'}%`, icon: Eye, color: "text-green-600", bgColor: "bg-green-100" },
    { label: t.clickRate, value: `${totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : '0.0'}%`, icon: MousePointer, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: t.totalClicks, value: totalClicked, icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadData} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700">
            {language === "ar" ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`notif-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
              <div className="h-10 w-10 shimmer-surface rounded mb-4" />
              <div className="h-8 w-20 shimmer-surface rounded mb-2" />
              <div className="h-4 w-24 shimmer-surface skeleton-line rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl shadow-lg p-6"><div className="flex items-center justify-between mb-3"><div className={`p-3 rounded-lg ${s.bgColor}`}><s.icon className={`w-6 h-6 ${s.color}`} /></div></div><p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p><p className="text-sm text-gray-600">{s.label}</p></motion.div>)}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t.notificationDetails}</h3>
        <div className="space-y-3">
          {filteredNotifications.length === 0 && <p className="text-gray-500">{t.noData}</p>}
          {filteredNotifications.map((n, i) => <div key={n._id || n.id || i} className="p-3 bg-gray-50 rounded-lg"><p className="font-semibold text-gray-800">{n.title || n.titleAr}</p></div>)}
        </div>
      </div>
      </>}
    </div>
  );
}
