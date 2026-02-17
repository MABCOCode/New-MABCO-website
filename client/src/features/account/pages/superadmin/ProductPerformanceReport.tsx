import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Award } from "lucide-react";
import { fetchAdminNotifications, fetchCartEvents } from "../../api/adminDataApi";
import { superAdminTranslations } from "./superAdminTranslations";

interface ProductPerformanceReportProps {
  language: "ar" | "en";
  dateRange: { start: Date; end: Date };
}

export function ProductPerformanceReport({ language, dateRange }: ProductPerformanceReportProps) {
  const t = superAdminTranslations[language];
  const [cartEvents, setCartEvents] = useState<any[]>([]);
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    Promise.all([fetchCartEvents(), fetchAdminNotifications()])
      .then(([cart, notifications]) => {
        setCartEvents(cart || []);
        setNotificationsData(notifications || []);
        setIsLoading(false);
      })
      .catch(() => {
        setCartEvents([]);
        setNotificationsData([]);
        setError(language === "ar" ? "تعذر تحميل أداء المنتجات." : "Failed to load product performance.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const rangedCartEvents = useMemo(
    () => cartEvents.filter((e) => {
      const at = new Date(e.eventAt || e.timestamp || 0);
      return at >= dateRange.start && at <= dateRange.end;
    }),
    [cartEvents, dateRange.start, dateRange.end],
  );

  const mostAddedProducts = useMemo(() => {
    const map = new Map<string, { productId: string; productName: string; count: number }>();
    rangedCartEvents.forEach((event: any) => {
      const action = event.action || event?.meta?.action;
      if (action !== "added") return;
      const productId = String(event.productId || event?.meta?.productId || "");
      if (!productId) return;
      const current = map.get(productId) || { productId, productName: event.productName || productId, count: 0 };
      current.count += 1;
      map.set(productId, current);
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [rangedCartEvents]);

  const mostAppliedOffers = notificationsData.filter((n) => n.type === "offer").sort((a, b) => Number(b.clickedCount || 0) - Number(a.clickedCount || 0)).slice(0, 10);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={`perf-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
              <div className="h-6 w-40 shimmer-surface skeleton-line rounded mb-4" />
              <div className="h-4 w-full shimmer-surface skeleton-line rounded mb-2" />
              <div className="h-4 w-3/4 shimmer-surface skeleton-line rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600"><div className="flex items-center gap-3 text-white"><ShoppingCart className="w-6 h-6" /><h3 className="text-lg font-bold">{t.mostAddedToCart}</h3></div></div>
        <div className="p-6 space-y-4">
          {mostAddedProducts.length === 0 && <p className="text-gray-500">{t.noData}</p>}
          {mostAddedProducts.map((p, i) => <motion.div key={p.productId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><p className="font-semibold text-gray-800">{p.productName}</p><p className="text-green-600 font-bold">{p.count}</p></motion.div>)}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600"><div className="flex items-center gap-3 text-white"><Award className="w-6 h-6" /><h3 className="text-lg font-bold">{t.mostAppliedOffers}</h3></div></div>
        <div className="p-6 space-y-3">
          {mostAppliedOffers.length === 0 && <p className="text-gray-500">{t.noData}</p>}
          {mostAppliedOffers.map((o, i) => <div key={o._id || o.id || i} className="p-3 bg-gray-50 rounded-lg"><p className="font-semibold text-gray-800">{o.title || o.titleAr}</p></div>)}
        </div>
      </div>
      </>}
    </div>
  );
}
