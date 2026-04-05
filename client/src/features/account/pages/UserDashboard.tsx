import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import translations from "../../../i18n/translations";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { AccountNavBar } from "../components/AccountNavBar";
import { loadSession } from "../storage";

interface UserDashboardProps {
  language: "ar" | "en";
  user: any;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

interface DashboardInvoice {
  invoiceNumber: string;
  date: string;
  branch: string;
  amount: number;
  discount: number;
}

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

const getUserPhone = (user: any) => {
  const session = loadSession() as any;
  return normalizePhone(
    user?.phone ||
      user?.mobile ||
      user?.phoneNumber ||
      session?.user?.phone ||
      session?.user?.mobile ||
      session?.user?.phoneNumber ||
      "",
  );
};

const parseInvoiceAmount = (value: unknown) => {
  const numeric = Number.parseFloat(String(value ?? "0").replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatInvoiceDate = (value: string, language: "ar" | "en") => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(language === "ar" ? "ar-SY" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatInvoiceAmountLabel = (value: number) =>
  `${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })} ${CURRENCY_LABEL}`;

export function UserDashboard({
  language,
  user,
  onClose,
  onNavigate,
  onLogout,
}: UserDashboardProps) {
  const t = translations[language];

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const phone = getUserPhone(user);
    if (!phone) {
      setOrders([]);
      setOrdersLoading(false);
      setOrdersError(
        language === "ar"
          ? "رقم الهاتف غير صالح لعرض الطلبات."
          : "Phone number is invalid for loading orders.",
      );
      return;
    }

    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    setOrdersLoading(true);
    setOrdersError(null);

    fetch(`${apiBase}/orders?phone=${encodeURIComponent(phone)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        const json = await res.json();
        if (!mounted) return;
        const rows = Array.isArray(json?.data) ? json.data : [];
        setOrders(rows);
      })
      .catch(() => {
        if (!mounted) return;
        setOrders([]);
        setOrdersError(language === "ar" ? "تعذر تحميل الطلبات." : "Failed to load orders.");
      })
      .finally(() => {
        if (mounted) setOrdersLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [language, user]);

  useEffect(() => {
    let mounted = true;
    const phone = getUserPhone(user);
    if (!phone) {
      setInvoices([]);
      setInvoicesLoading(false);
      setInvoicesError(
        language === "ar"
          ? "رقم الهاتف غير صالح لعرض الفواتير."
          : "Phone number is invalid for loading invoices.",
      );
      return;
    }

    setInvoicesLoading(true);
    setInvoicesError(null);

    fetch(`https://showman2.mabcoonline.com:444/Service1.svc/getInvoiceHdr/${encodeURIComponent(phone)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load invoices");
        const json = await res.json();
        if (!mounted) return;
        const rows = Array.isArray(json?.GetInvoiceHdrResult)
          ? json.GetInvoiceHdrResult
          : json?.GetInvoiceHdrResult
            ? [json.GetInvoiceHdrResult]
            : [];

        const nextInvoices = rows
          .map((row: any) => ({
            invoiceNumber: String(row?.inv_no || row?.invoice_no || row?.invoiceNo || "").trim(),
            date: String(row?.trn_dt || row?.date || ""),
            branch: String(row?.loc_name || row?.loc_nameAr || row?.branch || "").trim(),
            amount: parseInvoiceAmount(row?.total_final_price ?? row?.total_price),
            discount: parseInvoiceAmount(row?.offer_discount),
          }))
          .filter((row: DashboardInvoice) => row.invoiceNumber)
          .sort((a: DashboardInvoice, b: DashboardInvoice) => {
            const timeA = new Date(a.date).getTime();
            const timeB = new Date(b.date).getTime();
            return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
          });

        setInvoices(nextInvoices);
      })
      .catch(() => {
        if (!mounted) return;
        setInvoices([]);
        setInvoicesError(language === "ar" ? "تعذر تحميل الفواتير." : "Failed to load invoices.");
      })
      .finally(() => {
        if (mounted) setInvoicesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [language, user]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const activeOrders = orders.filter(
      (o) => !["delivered", "cancelled", "returned"].includes(o?.status),
    ).length;
    return {
      totalOrders,
      activeOrders,
      invoices: invoices.length,
      activeWarranties: 0,
    };
  }, [orders, invoices]);

  const quickLinks = [
    {
      id: "orders",
      icon: ShoppingBag,
      titleAr: "طلباتي",
      titleEn: "My Orders",
      descAr: "تتبع وإدارة طلباتك",
      descEn: "Track and manage your orders",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "devices",
      icon: Smartphone,
      titleAr: "أجهزتي",
      titleEn: "My Devices",
      descAr: "الأجهزة المشتراة والضمانات",
      descEn: "Purchased devices and warranties",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "invoices",
      icon: FileText,
      titleAr: "الفواتير",
      titleEn: "Invoices",
      descAr: "عرض وتحميل الفواتير",
      descEn: "View and download invoices",
      color: "from-green-500 to-green-600",
    },
    {
      id: "settings",
      icon: Settings,
      titleAr: "الإعدادات",
      titleEn: "Settings",
      descAr: "إدارة معلومات حسابك",
      descEn: "Manage your account info",
      color: "from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountNavBar
        language={language}
        userName={language === "ar" ? user.name : user.nameEn}
        onBackToWebsite={onClose}
        onLogout={onLogout}
      />

      <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={language === "ar" ? "text-right" : "text-left"}>
            <h1 className="text-2xl md:text-3xl font-bold">{t.account_dashboard_my_account}</h1>
            <p className="text-white/90 mt-1">
              {t.account_dashboard_welcome}, {language === "ar" ? user.name : user.nameEn}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2
            className={`text-xl font-bold text-gray-900 mb-4 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.account_dashboard_account_overview}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_total_orders}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_active_orders}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_invoices}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.invoices}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className={language === "ar" ? "text-right" : "text-left"}>
                  <p className="text-sm text-gray-600">{t.account_dashboard_active_warranties}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeWarranties}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {(ordersLoading || ordersError) && (
            <div className={`mt-4 text-sm ${language === "ar" ? "text-right" : "text-left"}`}>
              {ordersLoading && (
                <p className="text-gray-600">
                  {language === "ar" ? "جاري تحميل الطلبات..." : "Loading orders..."}
                </p>
              )}
              {!ordersLoading && ordersError && <p className="text-red-600">{ordersError}</p>}
            </div>
          )}
        </div>

      

        <div>
          <h2
            className={`text-xl font-bold text-gray-900 mb-4 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.account_dashboard_quick_actions}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 5) }}
                onClick={() => onNavigate(link.id)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group text-left"
              >
                <div
                  className={`flex items-center ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  } gap-4`}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <link.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {language === "ar" ? link.titleAr : link.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "ar" ? link.descAr : link.descEn}
                    </p>
                  </div>
                  {language === "ar" ? (
                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#009FE3] transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#009FE3] transition-colors" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
