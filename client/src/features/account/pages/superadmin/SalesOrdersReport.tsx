import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react";
import { fetchAdminActions, fetchAdminOrders } from "../../api/adminDataApi";
import { superAdminTranslations } from "./superAdminTranslations";

interface SalesOrdersReportProps {
  language: "ar" | "en";
  dateRange: { start: Date; end: Date };
}

export function SalesOrdersReport({ language, dateRange }: SalesOrdersReportProps) {
  const t = superAdminTranslations[language];
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [adminActions, setAdminActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    Promise.all([fetchAdminOrders(), fetchAdminActions()])
      .then(([orders, actions]) => {
        setOrdersData(orders || []);
        setAdminActions(actions || []);
        setIsLoading(false);
      })
      .catch(() => {
        setOrdersData([]);
        setAdminActions([]);
        setError(language === "ar" ? "تعذر تحميل بيانات المبيعات." : "Failed to load sales data.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = useMemo(
    () =>
      ordersData.filter((o) => {
        const at = new Date(o.createdAt || o.orderDate || 0);
        return at >= dateRange.start && at <= dateRange.end;
      }),
    [ordersData, dateRange.start, dateRange.end],
  );

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order?.pricing?.total || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalDiscount = filteredOrders.reduce((sum, order) => sum + Number(order?.pricing?.discount || 0), 0);

  const statusCounts = filteredOrders.reduce((acc, order) => {
    const status = order.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChangeActions = adminActions.filter((a) => a.actionType === "status_change" && a.targetType === "order").slice(0, 20);

  const statusList = [
    { status: "pending", label: t.pending, color: "bg-yellow-100 text-yellow-700" },
    { status: "confirmed", label: t.confirmed, color: "bg-blue-100 text-blue-700" },
    { status: "processing", label: t.processing, color: "bg-purple-100 text-purple-700" },
    { status: "shipped", label: t.shipped, color: "bg-indigo-100 text-indigo-700" },
    { status: "out_for_delivery", label: t.outForDelivery, color: "bg-cyan-100 text-cyan-700" },
    { status: "delivered", label: t.delivered, color: "bg-green-100 text-green-700" },
    { status: "cancelled", label: t.cancelled, color: "bg-red-100 text-red-700" },
    { status: "returned", label: t.returned, color: "bg-orange-100 text-orange-700" },
  ];

  const stats = [
    { label: t.totalOrders, value: totalOrders, icon: ShoppingCart, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: t.totalRevenue, value: `${totalRevenue.toLocaleString()} SYP`, icon: DollarSign, color: "text-green-600", bgColor: "bg-green-100" },
    { label: t.avgOrderValue, value: `${Math.round(avgOrderValue).toLocaleString()} SYP`, icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: t.totalDiscounts, value: `${totalDiscount.toLocaleString()} SYP`, icon: Package, color: "text-orange-600", bgColor: "bg-orange-100" },
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
            <div key={`sales-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
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
            <div className="flex items-center justify-between mb-3"><div className={`p-3 rounded-lg ${stat.bgColor}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div></div>
            <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t.orderStatusBreakdown}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusList.map((s) => (
            <div key={s.status} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-800 mb-2">{statusCounts[s.status] || 0}</p>
              <span className={`text-sm px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t.statusChangeLog}</h3>
        <div className="space-y-3">
          {statusChangeActions.length === 0 && <p className="text-gray-500">{t.noData}</p>}
          {statusChangeActions.map((action, index) => {
            const statusChange = (action.changes || []).find((c: any) => c.field === "status");
            return <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"><span className="font-semibold">{action.targetName || "-"}</span> - {statusChange?.oldValue || "-"} {"->"} {statusChange?.newValue || "-"}</div>;
          })}
        </div>
      </div>
      </>}
    </div>
  );
}
