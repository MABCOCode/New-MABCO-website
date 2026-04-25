import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Eye,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { fetchAdminOrders, updateAdminOrder } from "../../api/adminDataApi";
import {
  Order,
  OrderStatus,
  orderStatusConfig
} from "../../types/orderAdmin";
import { OrderDetailsModal } from "./OrderDetailsModal";

export function AdminOrderManagement() {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);

  const loadOrders = () => {
    setIsLoading(true);
    setError(null);
    fetchAdminOrders()
      .then((rows) => {
        setOrders(rows as Order[]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to load orders", err);
        setOrders([]);
        setError(language === "ar" ? "تعذر تحميل الطلبات." : "Failed to load orders.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return {
      total,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      outForDelivery: orders.filter((o) => o.status === "out_for_delivery").length,
      delivered,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      returned: orders.filter((o) => o.status === "returned").length,
      totalRevenue: orders.reduce((sum, o) => {
        if (!o.invoiceNo) return sum;
        return sum + Number(o.pricing?.total || 0);
      }, 0),
    };
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.customer?.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        if (Number.isNaN(orderDate.getTime())) return false;

        if (dateFrom) {
          const from = new Date(`${dateFrom}T00:00:00`);
          if (orderDate < from) return false;
        }

        if (dateTo) {
          const to = new Date(`${dateTo}T23:59:59.999`);
          if (orderDate > to) return false;
        }

        return true;
      });
    }

    return filtered.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }, [orders, searchQuery, statusFilter, dateFrom, dateTo]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    meta?: { shippingFee?: number; shippingPaidBy?: "customer" | "company" | null; invoiceNo?: string | null },
  ) => {
    try {
      const updated = await updateAdminOrder(orderId, {
        status: newStatus,
        note,
        shippingFee: meta?.shippingFee,
        shippingPaidBy: meta?.shippingPaidBy,
        invoiceNo: meta?.invoiceNo,
      });

      const updatedOrder = updated as Order;
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order)),
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      setUpdateSuccessOpen(true);
    } catch (err) {
      console.warn("Failed to update order status", err);
      setError(language === "ar" ? "تعذر تحديث حالة الطلب." : "Failed to update order status.");
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

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStatusLabel = (status: OrderStatus) =>
    language === "ar"
      ? orderStatusConfig[status].labelAr
      : orderStatusConfig[status].labelEn;

  const getShippingPaidByLabel = (value?: "customer" | "company" | null) => {
    if (value === "company") {
      return language === "ar" ? "على الشركة" : "Company";
    }
    if (value === "customer") {
      return language === "ar" ? "على الزبون" : "Customer";
    }
    return "";
  };

  const getOrderItemStockCode = (item: Order["items"][number]) =>
    item.color
      ? item.variantSku || item.stkCode || item.chargeOptionSku || ""
      : item.chargeOptionSku || item.stkCode || item.variantSku || "";

  const collectOfferNos = (order: Order, item: Order["items"][number]) => {
    const values = [
      ...(Array.isArray(item.offerNos) ? item.offerNos : []),
      ...(Array.isArray(order.appliedOffers)
        ? order.appliedOffers
            .map((offer) => offer?.offer_no)
            .filter(Boolean)
            .map((value) => String(value))
        : []),
    ];
    return Array.from(new Set(values));
  };

  const escapeCsvCell = (value: unknown) => {
    const text = String(value ?? "");
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const escapeHtml = (value: unknown) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const toExcelNumber = (value: unknown) => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const digits = raw.replace(/[^\d.-]/g, "");
    return digits || raw;
  };

  const handleExport = () => {
    const exportedRows = filteredOrders.flatMap((order) => {
      const offerDiscountValue =
        Number(order.pricing.discount || 0) ||
        (Array.isArray(order.appliedOffers)
          ? order.appliedOffers.reduce(
              (sum, offer) => sum + Number(offer?.discountAmount || 0),
              0,
            )
          : 0);

      const shippingPaidBy = order.pricing.shippingPaidBy ?? null;
      const shippingCompanyValue =
        shippingPaidBy === "company" ? Number(order.pricing.shipping || 0) : 0;

      const baseRow = {
        customer_name: order.customer?.name ?? "",
        customer_phone_no: order.customer?.phone ?? "",
        order_date: order.orderDate,
        order_current_status: getStatusLabel(order.status),
        invoice_no: order.invoiceNo ?? "",
        order_price: Number(order.pricing.total || 0),
        delivery_paid_by: getShippingPaidByLabel(shippingPaidBy),
        delivery_company_value: shippingCompanyValue,
      };

      if (!Array.isArray(order.items) || order.items.length === 0) {
        return [
          {
            ...baseRow,
            order_stock: "",
            offer_no: Array.isArray(order.appliedOffers)
              ? order.appliedOffers
                  .map((offer) => offer?.offer_no)
                  .filter(Boolean)
                  .join(", ")
              : "",
            offer_discount: offerDiscountValue,
          },
        ];
      }

      return order.items.map((item) => ({
        ...baseRow,
        order_stock: getOrderItemStockCode(item),
        offer_no: collectOfferNos(order, item).join(", "),
        offer_discount: offerDiscountValue,
      }));
    });

    const headerLabels = [
      language === "ar" ? "اسم العميل" : "Customer Name",
      language === "ar" ? "رقم هاتف العميل" : "Customer Phone",
      language === "ar" ? "تاريخ الطلب" : "Order Date",
      language === "ar" ? "الحالة الحالية" : "Current Status",
      language === "ar" ? "Stock Code" : "Stock Code",
      language === "ar" ? "رقم الفاتورة" : "Invoice No",
      language === "ar" ? "قيمة الطلب" : "Order Price",
      language === "ar" ? "رقم العرض" : "Offer No",
      language === "ar" ? "خصم العرض" : "Offer Discount",
      language === "ar" ? "التوصيل على" : "Delivery Paid By",
      language === "ar" ? "قيمة تحمل الشركة" : "Company Delivery Value",
    ];
    const headers = [
      "customer_name",
      "customer_phone_no",
      "order_date",
      "order_current_status",
      "order_stock",
      "invoice_no",
      "order_price",
      "offer_no",
      "offer_discount",
      "delivery_paid_by",
      "delivery_company_value",
    ];

    const metadataRows = [
      [
        language === "ar" ? "وقت إنشاء التقرير" : "Generated At",
        new Date().toLocaleString(language === "ar" ? "ar-SY" : "en-US"),
      ],
      [language === "ar" ? "اللغة" : "Language", language === "ar" ? "العربية" : "English"],
      [language === "ar" ? "البحث" : "Search", searchQuery || (language === "ar" ? "الكل" : "All")],
      [
        language === "ar" ? "الحالة" : "Status",
        statusFilter === "all"
          ? language === "ar"
            ? "الكل"
            : "All"
          : getStatusLabel(statusFilter),
      ],
      [
        language === "ar" ? "فلتر التاريخ السريع" : "Quick Date Filter",
        dateFilter === "all"
          ? language === "ar"
            ? "الكل"
            : "All"
          : dateFilter,
      ],
      [language === "ar" ? "من تاريخ" : "Date From", dateFrom || "-"],
      [language === "ar" ? "إلى تاريخ" : "Date To", dateTo || "-"],
      [language === "ar" ? "عدد النتائج" : "Result Count", String(filteredOrders.length)],
    ];

    const tableRows = exportedRows
      .map((row, index) => {
        const bg = index % 2 === 0 ? "#ffffff" : "#f8fbff";
        return `
          <tr style="background:${bg}">
            ${headers
              .map((header) => {
                const rawValue = (row as Record<string, unknown>)[header];
                const value =
                  header === "order_stock"
                    ? escapeHtml(toExcelNumber(rawValue))
                    : header === "order_price" ||
                      header === "offer_discount" ||
                      header === "delivery_company_value"
                    ? escapeHtml(`$${Number(rawValue || 0).toLocaleString("en-US")}`)
                    : escapeHtml(rawValue);
                const isMoney =
                  header === "order_price" ||
                  header === "offer_discount" ||
                  header === "delivery_company_value";
                const isStatus = header === "order_current_status";
                const isOffer = header === "offer_no";
                const isStock = header === "order_stock";
                const style = [
                  "padding:12px 14px",
                  "border:1px solid #d8e1ec",
                  "vertical-align:middle",
                  "font-size:14pt",
                  "font-family:Calibri, Arial, sans-serif",
                  isMoney
                    ? 'font-weight:700;color:#0f766e;background:#ecfdf5;mso-number-format:"\\0024#,##0.00"'
                    : "",
                  isStatus ? "font-weight:700;color:#1d4ed8;background:#eff6ff" : "",
                  isOffer ? "color:#7c3aed;background:#f5f3ff" : "",
                  isStock
                    ? 'font-family:Calibri, Arial, sans-serif;background:#fff7ed;color:#9a3412;mso-number-format:"0"'
                    : "",
                ]
                  .filter(Boolean)
                  .join(";");
                return `<td style="${style}">${value}</td>`;
              })
              .join("")}
          </tr>
        `;
      })
      .join("");

    const metadataHtml = metadataRows
      .map(
        ([label, value], index) => `
          <tr>
            <td style="padding:10px 12px;border:1px solid #d8e1ec;background:${
              index % 2 === 0 ? "#f8fafc" : "#ffffff"
            };font-weight:700;color:#334155;width:220px;font-size:14pt;font-family:Calibri, Arial, sans-serif;">${escapeHtml(label)}</td>
            <td style="padding:10px 12px;border:1px solid #d8e1ec;background:${
              index % 2 === 0 ? "#f8fafc" : "#ffffff"
            };color:#0f172a;font-size:14pt;font-family:Calibri, Arial, sans-serif;">${escapeHtml(value)}</td>
          </tr>
        `,
      )
      .join("");

    const reportHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Orders Report</x:Name>
                  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body style="font-family:Calibri, Arial, sans-serif; background:#f8fafc; margin:24px; font-size:14pt;" dir="${
          language === "ar" ? "rtl" : "ltr"
        }">
          <table style="border-collapse:collapse; width:100%; max-width:1600px; background:white; font-family:Calibri, Arial, sans-serif; font-size:14pt;">
            <tr>
              <td colspan="${headers.length}" style="padding:20px 22px; background:linear-gradient(90deg,#009FE3,#007BC7); color:white; font-size:24pt; font-weight:700; border:1px solid #0b7fc6; font-family:Calibri, Arial, sans-serif;">
                ${escapeHtml(language === "ar" ? "تقرير الطلبات" : "Orders Report")}
              </td>
            </tr>
            <tr>
              <td colspan="${headers.length}" style="padding:16px 0 8px 0; border:none;"></td>
            </tr>
            <tr>
              <td colspan="4" style="vertical-align:top; border:none; padding:0 0 16px 0; font-family:Calibri, Arial, sans-serif; font-size:14pt;">
                <table style="border-collapse:collapse; width:100%; font-family:Calibri, Arial, sans-serif; font-size:14pt;">
                  ${metadataHtml}
                </table>
              </td>
            
            </tr>
            <tr>
              ${headerLabels
                .map(
                  (label) => `<th style="padding:14px 12px; border:1px solid #cbd5e1; background:#0f172a; color:#ffffff; font-size:15pt; font-weight:700; text-transform:uppercase; letter-spacing:.3px; font-family:Calibri, Arial, sans-serif;">
                    ${escapeHtml(label)}
                  </th>`,
                )
                .join("")}
            </tr>
            ${tableRows || `<tr><td colspan="${headers.length}" style="padding:16px; border:1px solid #d8e1ec; text-align:center; color:#64748b; font-size:14pt; font-family:Calibri, Arial, sans-serif;">${
              language === "ar" ? "لا توجد نتائج" : "No results"
            }</td></tr>`}
          </table>
        </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF", reportHtml], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-report-${new Date().toISOString().split("T")[0]}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (dateFilter === "all") return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateFilter === "today") {
      const value = formatDateForInput(today);
      setDateFrom(value);
      setDateTo(value);
      return;
    }

    if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      setDateFrom(formatDateForInput(weekAgo));
      setDateTo(formatDateForInput(today));
      return;
    }

    if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      setDateFrom(formatDateForInput(monthAgo));
      setDateTo(formatDateForInput(today));
    }
  }, [dateFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50  pb-8">
        {/* Header */}
        <div className="mb-8 ">
          <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 shadow-sm  mb-6">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t("admin.orders.title")}
                </h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      loadOrders();
                    }}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-[#009FE3] transition-all flex items-center gap-2 font-semibold text-gray-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t("admin.common.refresh")}
                    </span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t("admin.orders.export")}
                    </span>
                  </button>
                </div>
                {/* <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button> */}
              </div>
            </div>
          </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#009FE3] to-[#007BC7] rounded-xl flex items-center justify-center">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    {t('admin.orders.title')}
                  </h1>
                  <p className="text-gray-600">{t('admin.orders.subtitle')}</p>
                </div>
                
          </div>*/}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#009FE3] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stats.total}
              </p>
              <p className="text-sm text-gray-600">
                {t("admin.orders.totalOrders")}
              </p>
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
              <p className="text-sm text-gray-600">
                {t("admin.orders.totalRevenue")}
              </p>
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
              <p className="text-sm text-gray-600">
                {t("admin.orders.pendingOrders")}
              </p>
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
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stats.delivered}
              </p>
              <p className="text-sm text-gray-600">
                {t("admin.orders.deliveredOrders")}
              </p>
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
                  placeholder={t("admin.orders.search")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as OrderStatus | "all")
                  }
                  className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent font-semibold text-gray-700 bg-white cursor-pointer min-w-[200px]"
                >
                  <option value="all">{t("admin.orders.allOrders")}</option>
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
                  <option value="all">{t("admin.content.all")}</option>
                  <option value="today">{t("admin.orders.today")}</option>
                  <option value="week">{t("admin.orders.thisWeek")}</option>
                  <option value="month">{t("admin.orders.thisMonth")}</option>
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold text-gray-500">
                    {language === "ar" ? "من" : "From"}
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setDateFilter("all");
                    }}
                    className="rounded-xl border-2 border-gray-200 px-4 py-3 font-semibold text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold text-gray-500">
                    {language === "ar" ? "إلى" : "To"}
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setDateFilter("all");
                    }}
                    className="rounded-xl border-2 border-gray-200 px-4 py-3 font-semibold text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters Info */}
            {(searchQuery ||
              statusFilter !== "all" ||
              dateFilter !== "all" ||
              dateFrom ||
              dateTo) && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">
                  {language === "ar" ? "عرض" : "Showing"}{" "}
                  {filteredOrders.length} {language === "ar" ? "من" : "of"}{" "}
                  {orders.length} {language === "ar" ? "طلب" : "orders"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="container mx-auto mt-8 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
          {error && (
            <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={loadOrders}
                className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                {language === "ar" ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          )}
          {isLoading && (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`orders-skeleton-${idx}`}
                  className="h-14 rounded-xl shimmer-surface"
                />
              ))}
            </div>
          )}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t("admin.orders.orderNumber")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t("admin.orders.customer")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {language === "ar" ? "المنتجات" : "Items"}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t("admin.orders.date")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t("admin.orders.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t("admin.orders.total")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t("admin.orders.actions")}
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
                              {t("admin.orders.noOrders")}
                            </p>
                            <p className="text-gray-600">
                              {t("admin.orders.noOrdersDesc")}
                            </p>
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
                              <p className="font-bold text-gray-900">
                                {order.orderNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {order.customer?.name ?? "-"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customer?.email ?? "-"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {order.items.length}
                            </span>
                            <span className="text-sm text-gray-500">
                              {t("admin.common.items")}
                            </span>
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
                            <p className="text-xs text-gray-500">
                              {t("admin.common.syp")}
                            </p>
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
                            <span className="hidden lg:inline">
                              {t("admin.orders.viewDetails")}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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

      {updateSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-5">
              <h3 className="text-lg font-bold">
                {language === "ar" ? "تم التحديث بنجاح" : "Update Successful"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                {language === "ar"
                  ? "تم تحديث حالة الطلب وحفظ البيانات بنجاح."
                  : "Order status and details were updated successfully."}
              </p>
              <button
                onClick={() => setUpdateSuccessOpen(false)}
                className="w-full bg-[#009FE3] text-white py-3 rounded-xl font-bold hover:bg-[#007BC7] transition-all"
              >
                {language === "ar" ? "حسناً" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
