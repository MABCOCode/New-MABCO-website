import { useState, useMemo } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import {
  Package,
  Search,
  Filter,
  Eye,
  Download,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronDown,
  Calendar,
  DollarSign,
  ShoppingBag,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  ordersData,
  Order,
  OrderStatus,
  orderStatusConfig,
  paymentStatusConfig,
  getOrderStatistics,
} from "../../../../data/ordersData";
import { OrderDetailsModal } from "./OrderDetailsModal";

export function AdminOrderManagement() {
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  const stats = getOrderStatistics();

  const { t, language } = useLanguage();

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        
        if (dateFilter === "today") {
          return orderDate >= today;
        } else if (dateFilter === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }
        return true;
      });
    }

    return filtered.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            timeline: [
              ...order.timeline,
              {
                status: newStatus,
                date: new Date().toISOString(),
                note,
              },
            ],
          };
        }
        return order;
      })
    );

    // Update selected order if it's the one being updated
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder({
          ...updatedOrder,
          status: newStatus,
          timeline: [
            ...updatedOrder.timeline,
            {
              status: newStatus,
              date: new Date().toISOString(),
              note,
            },
          ],
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SY" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US");
  };

  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
    const csvContent = [
      ["Order ID", "Customer", "Date", "Status", "Total"],
      ...filteredOrders.map((order) => [
        order.orderNumber,
        order.customer.name,
        formatDate(order.orderDate),
        order.status,
        order.pricing.total,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    {t('admin.orders.title')}
                  </h1>
                  <p className="text-gray-600">{t('admin.orders.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
              <button
                onClick={() => setOrders([...ordersData])}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-[#009FE3] transition-all flex items-center gap-2 font-semibold text-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.common.refresh')}</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-bold"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.orders.export')}</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#009FE3] transition-all">
                <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
              <p className="text-sm text-gray-600">{t('admin.orders.totalOrders')}</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#009FE3] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-gray-600">{t('admin.orders.totalRevenue')}</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#009FE3] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  {stats.pending + stats.confirmed + stats.processing}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stats.pending + stats.confirmed + stats.processing}
              </p>
              <p className="text-sm text-gray-600">{t('admin.orders.pendingOrders')}</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#009FE3] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {Math.round((stats.delivered / stats.total) * 100)}%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.delivered}</p>
              <p className="text-sm text-gray-600">{t('admin.orders.deliveredOrders')}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('admin.orders.search')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                  className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent font-semibold text-gray-700 bg-white cursor-pointer min-w-[200px]"
                >
                  <option value="all">{t('admin.orders.allOrders')}</option>
                  {Object.keys(orderStatusConfig).map((status) => (
                    <option key={status} value={status}>
                      {language === "ar"
                        ? orderStatusConfig[status as OrderStatus].labelAr
                        : orderStatusConfig[status as OrderStatus].labelEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent font-semibold text-gray-700 bg-white cursor-pointer min-w-[180px]"
                >
                  <option value="all">{t('admin.content.all')}</option>
                  <option value="today">{t('admin.orders.today')}</option>
                  <option value="week">{t('admin.orders.thisWeek')}</option>
                  <option value="month">{t('admin.orders.thisMonth')}</option>
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active Filters Info */}
            {(searchQuery || statusFilter !== "all" || dateFilter !== "all") && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">
                  {language === "ar" ? "عرض" : "Showing"} {filteredOrders.length}{" "}
                  {language === "ar" ? "من" : "of"} {orders.length}{" "}
                  {language === "ar" ? "طلب" : "orders"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {t('admin.orders.orderNumber')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('admin.orders.customer')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {language === "ar" ? "المنتجات" : "Items"}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {t('admin.orders.date')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {t('admin.orders.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {t('admin.orders.total')}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {t('admin.orders.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900 mb-1">
                            {t('admin.orders.noOrders')}
                          </p>
                          <p className="text-gray-600">{t('admin.orders.noOrdersDesc')}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">{order.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{order.customer.name}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{order.items.length}</span>
                          <span className="text-sm text-gray-500">{t('admin.common.items')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg border font-bold text-xs ${
                            orderStatusConfig[order.status].color
                          }`}
                        >
                          {language === "ar"
                            ? orderStatusConfig[order.status].labelAr
                            : orderStatusConfig[order.status].labelEn}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-900">
                            {formatCurrency(order.pricing.total)}
                          </p>
                          <p className="text-xs text-gray-500">{t('admin.common.syp')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#009FE3] text-white rounded-lg hover:bg-[#007BC7] transition-all font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden lg:inline">{t('admin.orders.viewDetails')}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          language={language}
        />
      )}
    </div>
  );
}
