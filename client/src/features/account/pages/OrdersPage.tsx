import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Download,
  Eye,
} from "lucide-react";
import { AccountNavBar } from "../components/AccountNavBar";
import translations from "../../../i18n/translations";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { loadSession } from "../storage";

interface OrdersPageProps {
  language: "ar" | "en";
  onBack: () => void;
  onViewOrderDetails: (orderId: string) => void;
}


type OrderRow = {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  fulfillmentType: "delivery" | "pickup" | null;
  items: number;
  progress: number;
  invoiceNo?: string | null;
};

export function OrdersPage({ language, onBack, onViewOrderDetails }: OrdersPageProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
        return "bg-indigo-100 text-indigo-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
      case "out_for_delivery":
        return "bg-orange-100 text-orange-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
      case "returned":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
      case "confirmed":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const statusStepsDelivery = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
  const statusStepsPickup = ["pending", "confirmed", "processing", "delivered"];
  const computeProgress = (status: string, fulfillmentType: "delivery" | "pickup" | null) => {
    const flow = fulfillmentType === "pickup" ? statusStepsPickup : statusStepsDelivery;
    const idx = flow.indexOf(status);
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / flow.length) * 100);
  };

  const normalizePhone = (raw: string) => {
    if (!raw) return "";
    let digits = String(raw).replace(/\D/g, "");
    if (digits.startsWith("963")) {
      digits = digits.slice(3);
    }
    if (digits.startsWith("9") && digits.length === 9) {
      digits = `0${digits}`;
    }
    if (digits.startsWith("09") && digits.length === 10) {
      return digits;
    }
    if (digits.length >= 8) {
      return `09${digits.slice(-8)}`;
    }
    return "";
  };

  useEffect(() => {
    let mounted = true;
    const session = loadSession() as any;
    const phone = normalizePhone(session?.user?.phone || "");
    if (!phone) {
      setOrders([]);
      setIsLoading(false);
      setError(language === "ar" ? "رقم الهاتف غير صالح لعرض الطلبات." : "Phone number is invalid for loading orders.");
      return;
    }

    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    setIsLoading(true);
    setError(null);

    fetch(`${apiBase}/orders?phone=${encodeURIComponent(phone)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load orders");
        }
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (!mounted) return;
        const mapped = rows.map((order: any) => {
          const fulfillmentType = order?.fulfillment?.type ?? order?.fulfillmentType ?? null;
          const status = order?.status ?? "pending";
          return {
            id: String(order?.orderNumber ?? order?._id ?? ""),
            orderNumber: String(order?.orderNumber ?? order?._id ?? ""),
            date: order?.createdAt ?? order?.timestamp ?? "",
            total: Number(order?.pricing?.total ?? 0),
            status,
            fulfillmentType,
            items: Array.isArray(order?.items) ? order.items.length : 0,
            progress: computeProgress(status, fulfillmentType),
            invoiceNo: order?.invoiceNo ?? order?.inv_no ?? null,
          } as OrderRow;
        });
        setOrders(mapped);
      })
      .catch(() => {
        if (!mounted) return;
        setOrders([]);
        setError(language === "ar" ? "تعذر تحميل الطلبات." : "Failed to load orders.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [language]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "active") {
      return order.status !== "delivered" && order.status !== "cancelled" && order.status !== "returned";
    }
    if (filter === "completed") {
      return order.status === "delivered";
    }
    return true;
  });

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
                <span>{t.account_orders_back}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>{t.account_orders_back}</span>
              </>
            )}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">{t.account_orders_title}</h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            {["all", "active", "completed"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`px-4 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  filter === filterOption
                    ? "border-[#009FE3] text-[#009FE3]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {filterOption === "all"
                  ? t.account_orders_filter_all
                  : filterOption === "active"
                  ? t.account_orders_filter_active
                  : t.account_orders_filter_completed}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={`order-skeleton-${idx}`} className="h-28 rounded-xl shimmer-surface" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_orders_no_orders}</h3>
            <p className="text-gray-600">{error || t.account_orders_no_orders_desc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 ${
                      language === "ar" ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={language === "ar" ? "text-right" : "text-left"}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">{t.account_orders_number}:</span>
                        <span className="font-bold text-gray-900">{order.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{order.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {{
                          pending: t.account_orders_status_placed,
                          confirmed: t.account_orders_status_confirmed,
                          processing: t.account_orders_status_processing,
                          shipped: t.account_orders_status_ready_delivery,
                          out_for_delivery: t.account_orders_status_ready_delivery,
                          delivered: t.account_orders_status_completed,
                          cancelled: t.account_orders_status_cancelled,
                          returned: t.account_orders_status_cancelled,
                        }[order.status as keyof typeof order] || order.status}
                      </span>
                      {order.fulfillmentType === "delivery" ? (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          {t.account_orders_delivery}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {t.account_orders_pickup}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${order.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#009FE3] to-[#007BC7]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={language === "ar" ? "text-right" : "text-left"}>
                      <p className="text-sm text-gray-600 mb-1">
                        {order.items} {language === "ar" ? "منتجات" : "items"}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {order.total.toLocaleString()} {CURRENCY_LABEL}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => onViewOrderDetails(order.orderNumber)}
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      {t.account_orders_view_details}
                    </button>
                    <button
                      disabled={order.status !== "delivered" || !order.invoiceNo}
                      className={`flex-1 min-w-[140px] border-2 px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium ${
                        order.status !== "delivered" || !order.invoiceNo
                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-[#009FE3] text-[#009FE3] hover:bg-[#009FE3] hover:text-white"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {t.account_orders_download_invoice}
                    </button>
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
