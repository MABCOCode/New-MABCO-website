import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Award, Activity, Target } from "lucide-react";
import { fetchAdminActions, fetchAdminUsers } from "../../api/adminDataApi";
import { superAdminTranslations } from "./superAdminTranslations";

interface AdminPerformanceReportProps {
  language: "ar" | "en";
  dateRange: { start: Date; end: Date };
}

export function AdminPerformanceReport({ language, dateRange }: AdminPerformanceReportProps) {
  const t = superAdminTranslations[language];
  const [usersData, setUsersData] = useState<any[]>([]);
  const [adminActions, setAdminActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    Promise.all([fetchAdminUsers(), fetchAdminActions()])
      .then(([users, actions]) => {
        setUsersData(users || []);
        setAdminActions(actions || []);
        setIsLoading(false);
      })
      .catch(() => {
        setUsersData([]);
        setAdminActions([]);
        setError(language === "ar" ? "تعذر تحميل أداء المدراء." : "Failed to load admin performance.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const rangedActions = useMemo(
    () => adminActions.filter((a) => {
      const at = new Date(a.createdAt || a.timestamp || 0);
      return at >= dateRange.start && at <= dateRange.end;
    }),
    [adminActions, dateRange.start, dateRange.end],
  );

  const adminUsers = usersData.filter((u) => u.role === "admin");

  const leaderboard = adminUsers
    .map((admin) => {
      const actions = rangedActions.filter((a) => String(a.actorUserId || a.adminId) === String(admin._id || admin.id));
      const score = Number(Math.min((actions.length / 100) * 10, 10).toFixed(1));
      return { admin, totalActions: actions.length, score };
    })
    .sort((a, b) => b.score - a.score);

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
        <div className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
          <div className="h-6 w-48 shimmer-surface skeleton-line rounded mb-4" />
          <div className="h-4 w-full shimmer-surface skeleton-line rounded mb-2" />
          <div className="h-4 w-4/5 shimmer-surface skeleton-line rounded mb-2" />
          <div className="h-4 w-3/5 shimmer-surface skeleton-line rounded" />
        </div>
      )}

      {!isLoading && <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600"><div className="flex items-center gap-3 text-white"><Award className="w-6 h-6" /><h3 className="text-lg font-bold">{t.adminLeaderboard}</h3></div></div>
        <div className="p-6 space-y-4">
          {leaderboard.length === 0 && <p className="text-gray-500">{t.noData}</p>}
          {leaderboard.map((item, index) => (
            <motion.div key={item.admin._id || item.admin.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-gray-500">#{index + 1}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.admin.name || item.admin.nameAr || '-'}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><Activity className="w-4 h-4" /><span>{item.totalActions}</span></div>
                  <div className="flex items-center gap-1"><Target className="w-4 h-4" /><span>{item.score}/10</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>}
    </div>
  );
}
