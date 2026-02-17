import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bell, Plus, Search } from "lucide-react";
import { NotificationComposer } from "./NotificationComposer";
import { fetchAdminNotifications } from "../../api/adminDataApi";
import { superAdminTranslations } from "./superAdminTranslations";

interface NotificationManagerProps {
  language: "ar" | "en";
  onBack: () => void;
}

export function NotificationManager({ language, onBack }: NotificationManagerProps) {
  const t = superAdminTranslations[language];
  const isRTL = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'failed'>('all');
  const [composerOpen, setComposerOpen] = useState(false);
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
        setError(language === "ar" ? "تعذر تحميل الإشعارات." : "Failed to load notifications.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredNotifications = notificationsData.filter((n) => {
    const title = String(n.title || n.titleAr || "").toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || n.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: notificationsData.length,
    draft: notificationsData.filter((n) => n.status === 'draft').length,
    scheduled: notificationsData.filter((n) => n.status === 'scheduled').length,
    sent: notificationsData.filter((n) => n.status === 'sent').length,
    failed: notificationsData.filter((n) => n.status === 'failed').length,
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button onClick={onBack} className="mb-4 text-orange-100 hover:text-white flex items-center gap-2"><span>{isRTL ? "→" : "←"}</span><span>{t.back}</span></button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Bell className="w-8 h-8" /><h1 className="text-3xl font-bold">{t.notificationManagement}</h1></div>
            <button onClick={() => setComposerOpen(true)} className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 font-semibold"><Plus className="w-5 h-5" />{t.newNotification}</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadData} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700">
              {isRTL ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative"><Search className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} w-5 h-5 text-gray-400`} /><input type="text" placeholder={t.searchNotifications} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`} /></div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'draft', 'scheduled', 'sent', 'failed'] as const).map((s) => <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-lg transition-all ${filterStatus === s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{t[s]} <span className="ml-2 text-xs">({statusCounts[s]})</span></button>)}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`notif-manager-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
                <div className="h-6 w-48 shimmer-surface skeleton-line rounded mb-3" />
                <div className="h-4 w-full shimmer-surface skeleton-line rounded mb-2" />
                <div className="h-4 w-3/4 shimmer-surface skeleton-line rounded" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && <div className="grid gap-4">
          {filteredNotifications.length === 0 && <div className="bg-white rounded-xl shadow-lg p-6 text-gray-500">{t.noData}</div>}
          {filteredNotifications.map((n, i) => <motion.div key={n._id || n.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-bold text-gray-800">{n.title || n.titleAr}</h3><p className="text-gray-600 mt-2">{n.message || n.messageAr}</p></motion.div>)}
        </div>}
      </div>

      {composerOpen && <NotificationComposer language={language} onClose={() => setComposerOpen(false)} onSend={() => setComposerOpen(false)} />}
    </div>
  );
}
