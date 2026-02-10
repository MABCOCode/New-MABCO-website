import { useState } from "react";
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

interface OrdersPageProps {
  language: "ar" | "en";
  onBack: () => void;
  onViewOrderDetails: (orderId: number) => void;
}


// Mock orders data
const mockOrders = [
  {
    id: 1001,
    date: "2026-01-15",
    total: 2850000,
    status: "processing",
    fulfillmentType: "delivery",
    items: 3,
    progress: 60,
  },
  {
    id: 1002,
    date: "2026-01-10",
    total: 1250000,
    status: "readyForPickup",
    fulfillmentType: "pickup",
    items: 1,
    progress: 80,
  },
  {
    id: 1003,
    date: "2025-12-28",
    total: 4200000,
    status: "completed",
    fulfillmentType: "delivery",
    items: 2,
    progress: 100,
  },
  {
    id: 1004,
    date: "2025-12-15",
    total: 890000,
    status: "completed",
    fulfillmentType: "pickup",
    items: 1,
    progress: 100,
  },
];

export function OrdersPage({ language, onBack, onViewOrderDetails }: OrdersPageProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const t = translations[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
        return "bg-indigo-100 text-indigo-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "readyForDelivery":
      case "readyForPickup":
        return "bg-orange-100 text-orange-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
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
      case "readyForDelivery":
      case "readyForPickup":
        return <Truck className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = mockOrders.filter((order) => {
    if (filter === "active") {
      return order.status !== "completed" && order.status !== "cancelled";
    }
    if (filter === "completed") {
      return order.status === "completed";
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
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_orders_no_orders}</h3>
            <p className="text-gray-600">{t.account_orders_no_orders_desc}</p>
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
                        <span className="font-bold text-gray-900">#{order.id}</span>
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
                          placed: t.account_orders_status_placed,
                          confirmed: t.account_orders_status_confirmed,
                          processing: t.account_orders_status_processing,
                          readyForDelivery: t.account_orders_status_ready_delivery,
                          readyForPickup: t.account_orders_status_ready_pickup,
                          completed: t.account_orders_status_completed,
                          cancelled: t.account_orders_status_cancelled,
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
                  {order.status !== "completed" && order.status !== "cancelled" && (
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
                        {order.total.toLocaleString()} {language === "ar" ? "ل.س" : "SYP"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => onViewOrderDetails(order.id)}
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      {t.account_orders_view_details}
                    </button>
                    <button className="flex-1 min-w-[140px] border-2 border-[#009FE3] text-[#009FE3] px-4 py-2 rounded-lg hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-medium">
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
