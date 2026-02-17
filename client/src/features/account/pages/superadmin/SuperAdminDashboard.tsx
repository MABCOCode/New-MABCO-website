import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Crown, Users, Bell, Activity, FileText, Package, BarChart3 } from "lucide-react";
import { fetchAdminActions, fetchAdminNotifications, fetchAdminUsers, fetchVisitorSessions } from "../../api/adminDataApi";

interface SuperAdminDashboardProps {
  language: "ar" | "en";
  onNavigate: (view: string) => void;
  onClose?: () => void;
}

export function SuperAdminDashboard({ language, onNavigate, onClose }: SuperAdminDashboardProps) {
  const isRTL = language === "ar";
  const [usersData, setUsersData] = useState<any[]>([]);
  const [adminActions, setAdminActions] = useState<any[]>([]);
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const [visitorSessions, setVisitorSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = () => {
    setIsLoading(true);
    setError(null);
    Promise.all([
      fetchAdminUsers(),
      fetchAdminActions(),
      fetchAdminNotifications(),
      fetchVisitorSessions(),
    ])
      .then(([users, actions, notifications, sessions]) => {
        setUsersData(users);
        setAdminActions(actions);
        setNotificationsData(notifications);
        setVisitorSessions(sessions);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed loading super admin dashboard data", err);
        setError(isRTL ? "تعذر تحميل بيانات لوحة التحكم." : "Failed to load dashboard data.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const adminCount = usersData.filter((u) => u.role === "admin" || u.role === "super_admin").length;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const activeUsersToday = visitorSessions.filter((s) => {
    const date = new Date(s.eventAt || s.startTime || s.createdAt || 0);
    return date >= todayStart;
  }).length;
  const scheduledNotifications = notificationsData.filter((n) => n.status === "scheduled").length;
  const recentActions = [...adminActions]
    .sort((a, b) => new Date(b.createdAt || b.timestamp || 0).getTime() - new Date(a.createdAt || a.timestamp || 0).getTime())
    .slice(0, 10);

  const statCards = [
    {
      title: isRTL ? "إجمالي المديرين" : "Total Admins",
      value: adminCount,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      onClick: () => onNavigate("admin-management"),
    },
    {
      title: isRTL ? "المستخدمون النشطون اليوم" : "Active Users Today",
      value: activeUsersToday,
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      onClick: () => onNavigate("analytics"),
    },
    {
      title: isRTL ? "الإجراءات الأخيرة" : "Recent Actions",
      value: recentActions.length,
      icon: FileText,
      color: "from-green-500 to-green-600",
      onClick: () => onNavigate("activity-log"),
    },
    {
      title: isRTL ? "الإشعارات المجدولة" : "Scheduled Notifications",
      value: scheduledNotifications,
      icon: Bell,
      color: "from-orange-500 to-orange-600",
      onClick: () => onNavigate("notifications"),
    },
  ];

  const quickActions = [
    {
      title: isRTL ? "إدارة المديرين" : "Admin Management",
      description: isRTL ? "إضافة وتعديل صلاحيات المديرين" : "Add and edit admin privileges",
      icon: Users,
      color: "bg-purple-500",
      onClick: () => onNavigate("admin-management"),
    },
    {
      title: isRTL ? "تتبع المنتجات" : "Product Tracking",
      description: isRTL ? "عرض تعديلات المنتجات والمحررين" : "View product edits and editors",
      icon: Package,
      color: "bg-blue-500",
      onClick: () => onNavigate("product-tracking"),
    },
    {
      title: isRTL ? "التقارير والتحليلات" : "Analytics & Reports",
      description: isRTL ? "إحصائيات شاملة عن الموقع" : "Comprehensive site statistics",
      icon: BarChart3,
      color: "bg-green-500",
      onClick: () => onNavigate("analytics"),
    },
    {
      title: isRTL ? "إرسال إشعارات" : "Send Notifications",
      description: isRTL ? "إرسال إشعارات للمستخدمين" : "Send notifications to users",
      icon: Bell,
      color: "bg-orange-500",
      onClick: () => onNavigate("notifications"),
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-8 px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8" />
              <h1 className="text-3xl font-bold">{isRTL ? "لوحة تحكم السوبر أدمن" : "Super Admin Dashboard"}</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="text-sm font-medium">{isRTL ? "العودة للموقع" : "Back to Site"}</span>
              </button>
            )}
          </div>
          <p className="text-yellow-100">
            {isRTL ? "إدارة شاملة للموقع والمستخدمين والتقارير" : "Comprehensive site, user, and report management"}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadDashboard} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700">
              {isRTL ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={`sa-stat-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
                  <div className="h-8 w-16 shimmer-surface rounded mb-4" />
                  <div className="h-5 w-28 shimmer-surface skeleton-line rounded" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={`sa-action-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
                  <div className="h-6 w-40 shimmer-surface skeleton-line rounded mb-4" />
                  <div className="h-4 w-full shimmer-surface skeleton-line rounded mb-2" />
                  <div className="h-4 w-3/4 shimmer-surface skeleton-line rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={card.onClick}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <card.icon className="w-8 h-8 text-gray-400" />
                  <span className="text-3xl font-bold text-gray-800">{card.value}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>}

        {!isLoading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{isRTL ? "إجراءات سريعة" : "Quick Actions"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={action.onClick}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>}

        {!isLoading && <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{isRTL ? "النشاطات الأخيرة" : "Recent Activity"}</h2>
            <button onClick={() => onNavigate("activity-log")} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              {isRTL ? "عرض الكل" : "View All"}
            </button>
          </div>

          <div className="space-y-4">
            {recentActions.map((action, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div
                  className={`p-2 rounded-lg ${
                    action.actionType === "edit"
                      ? "bg-blue-100 text-blue-600"
                      : action.actionType === "add"
                        ? "bg-green-100 text-green-600"
                        : action.actionType === "delete"
                          ? "bg-red-100 text-red-600"
                          : action.actionType === "hide"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{isRTL ? action.adminNameAr || action.adminName : action.adminName || action.adminNameAr}</span>
                    <span className="text-sm text-gray-500">
                      {isRTL
                        ? (action.actionType || "") === "edit"
                          ? "عدّل"
                          : (action.actionType || "") === "add"
                            ? "أضاف"
                            : (action.actionType || "") === "delete"
                              ? "حذف"
                              : (action.actionType || "") === "hide"
                                ? "أخفى"
                                : "غيّر حالة"
                        : (action.actionType || "") === "edit"
                          ? "edited"
                          : (action.actionType || "") === "add"
                            ? "added"
                            : (action.actionType || "") === "delete"
                              ? "deleted"
                              : (action.actionType || "") === "hide"
                                ? "hid"
                                : "changed status of"}
                    </span>
                    <span className="font-medium text-gray-800">{isRTL ? action.targetNameAr || action.targetName || "-" : action.targetName || action.targetNameAr || "-"}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(action.createdAt || action.timestamp || Date.now()).toLocaleString(isRTL ? "ar-SY" : "en-US")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>}
      </div>
    </div>
  );
}
