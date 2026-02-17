import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Users, Clock, Monitor, Smartphone, Tablet } from "lucide-react";
import { fetchVisitorSessions } from "../../api/adminDataApi";
import { superAdminTranslations } from "./superAdminTranslations";

interface WebsiteTrafficReportProps {
  language: "ar" | "en";
  dateRange: { start: Date; end: Date };
}

export function WebsiteTrafficReport({ language, dateRange }: WebsiteTrafficReportProps) {
  const t = superAdminTranslations[language];
  const [visitorSessions, setVisitorSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    fetchVisitorSessions()
      .then((rows) => {
        setVisitorSessions(rows || []);
        setIsLoading(false);
      })
      .catch(() => {
        setVisitorSessions([]);
        setError(language === "ar" ? "تعذر تحميل بيانات الزيارات." : "Failed to load traffic data.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSessions = useMemo(
    () =>
      visitorSessions.filter((session) => {
        const at = new Date(session.startTime || session.eventAt || session.createdAt || 0);
        return at >= dateRange.start && at <= dateRange.end;
      }),
    [visitorSessions, dateRange.start, dateRange.end],
  );

  const loggedInSessions = filteredSessions.filter((s) => s.userId || s?.meta?.userId);

  const stats = [
    { label: t.totalVisitors, value: filteredSessions.length, icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: t.uniqueVisitors, value: new Set(filteredSessions.map((s) => s.userId || s.sessionId || s?.meta?.sessionId)).size, icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
    { label: t.loggedInCustomers, value: loggedInSessions.length, icon: Users, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: t.avgSessionDuration, value: `${Math.round((filteredSessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0) / Math.max(filteredSessions.length, 1)) / 60)}m`, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  const deviceCounts = filteredSessions.reduce((acc: Record<string, number>, s: any) => {
    const device = s.device || s?.meta?.deviceType || "desktop";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const devices = [
    { type: "mobile", icon: Smartphone, count: deviceCounts.mobile || 0 },
    { type: "desktop", icon: Monitor, count: deviceCounts.desktop || 0 },
    { type: "tablet", icon: Tablet, count: deviceCounts.tablet || 0 },
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
            <div key={`traffic-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
              <div className="h-10 w-10 shimmer-surface rounded mb-4" />
              <div className="h-8 w-20 shimmer-surface rounded mb-2" />
              <div className="h-4 w-24 shimmer-surface skeleton-line rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t.deviceBreakdown}</h3>
        <div className="grid grid-cols-3 gap-4">
          {devices.map((device) => (
            <div key={device.type} className="text-center p-4 bg-gray-50 rounded-lg">
              <device.icon className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold text-gray-800">{device.count}</p>
              <p className="text-sm text-gray-600 capitalize">{device.type}</p>
            </div>
          ))}
        </div>
      </div>
      </>}
    </div>
  );
}
