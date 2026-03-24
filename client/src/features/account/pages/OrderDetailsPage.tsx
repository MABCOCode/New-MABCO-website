import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Truck,
  CheckCircle,
  Download,
  MapPin,
  Phone,
  User,
  CreditCard,
  Clock,
} from "lucide-react";
import { AccountNavBar } from "../components/AccountNavBar";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import translations from "../../../i18n/translations";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { orderStatusConfig } from "../types/orderAdmin";

interface OrderDetailsPageProps {
  language: "ar" | "en";
  orderId: string;
  onBack: () => void;
}

export function OrderDetailsPage({ language, orderId, onBack }: OrderDetailsPageProps) {
  const t = translations[language];
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    setIsLoading(true);
    setError(null);

    fetch(`${apiBase}/orders/${encodeURIComponent(orderId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load order");
        const json = await res.json();
        if (!mounted) return;
        setOrder(json?.data ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setOrder(null);
        setError(language === "ar" ? "تعذر تحميل تفاصيل الطلب." : "Failed to load order details.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [orderId, language]);

  const mappedOrder = useMemo(() => {
    if (!order) return null;
    const fulfillmentType = order?.fulfillment?.type ?? order?.fulfillmentType ?? null;
    const status = order?.status ?? "pending";
    const flow =
      fulfillmentType === "pickup"
        ? ["pending", "confirmed", "processing", "delivered"]
        : ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
    const currentStep = Math.max(0, flow.indexOf(status));
    const timelineRaw =
      Array.isArray(order?.statusHistory) && order.statusHistory.length > 0
        ? order.statusHistory.map((entry: any) => ({
            status: entry.status ?? "pending",
            date: entry.date ?? entry.at ?? entry.timestamp ?? "",
          }))
        : flow.map((step) => ({ status: step, date: "" }));
    const timeline = timelineRaw.map((item: any) => ({
      ...item,
      completed: flow.indexOf(item.status) <= currentStep && flow.indexOf(item.status) >= 0,
    }));

    return {
      id: order?.orderNumber ?? order?._id ?? "",
      date: order?.createdAt ?? order?.timestamp ?? "",
      status,
      currentStep,
      fulfillmentType,
      items: Array.isArray(order?.items) ? order.items : [],
      subtotal: Number(order?.pricing?.subtotal ?? 0),
      deliveryFee: Number(order?.pricing?.shipping ?? 0),
      discount: Number(order?.pricing?.discount ?? 0),
      total: Number(order?.pricing?.total ?? 0),
      customerInfo: {
        name: order?.customerSnapshot?.fullName ?? order?.customerSnapshot?.name ?? "",
        phone: order?.customerSnapshot?.phone ?? "",
        address:
          order?.addresses?.delivery?.formattedAddress ??
          [order?.addresses?.delivery?.street, order?.addresses?.delivery?.area, order?.addresses?.delivery?.city]
            .filter(Boolean)
            .join(" - "),
      },
      showroom: order?.fulfillment?.showroom ?? null,
      timeline,
      invoiceNo: order?.invoiceNo ?? order?.inv_no ?? null,
    };
  }, [order]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountNavBar
        language={language}
        onBackToWebsite={onBack}
        onLogout={() => {}}
        hideLogout={true}
      />

      <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            {language === "ar" ? (
              <>
                <span>{t.account_order_details_back}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>{t.account_order_details_back}</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.account_order_details_title}</h1>
              <p className="text-white/90">
                {t.account_order_details_number}: {mappedOrder?.id || "-"}
              </p>
            </div>
            <button
              disabled={mappedOrder?.status !== "delivered" || !mappedOrder?.invoiceNo}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                mappedOrder?.status !== "delivered" || !mappedOrder?.invoiceNo
                  ? "bg-white/20 text-white/60 cursor-not-allowed"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <Download className="w-5 h-5" />
              {t.account_order_details_download_invoice}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`order-detail-skeleton-${idx}`} className="h-32 rounded-xl shimmer-surface" />
            ))}
          </div>
        )}
        {!isLoading && !mappedOrder && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_orders_no_orders}</h3>
            <p className="text-gray-600">{error || t.account_orders_no_orders_desc}</p>
          </div>
        )}
        {!isLoading && mappedOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2
                  className={`text-xl font-bold text-gray-900 mb-6 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_order_details_timeline}
                </h2>

                <div className="relative">
                  <div
                    className={`absolute top-0 bottom-0 w-0.5 bg-gray-200 ${
                      language === "ar" ? "right-4" : "left-4"
                    }`}
                  >
                    {/* <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(mappedOrder.currentStep / (mappedOrder.timeline.length - 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="bg-gradient-to-b from-[#009FE3] to-[#007BC7] w-full"
                    /> */}
                  </div>

                  <div className="space-y-6">
                    {mappedOrder.timeline.map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`flex items-start gap-4 ${
                          language === "ar" ? "flex-row-reverse" : "flex-row"
                        } relative`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            item.completed
                              ? "bg-gradient-to-br from-[#009FE3] to-[#007BC7] text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {item.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>

                        <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                          <h3 className={`font-semibold ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                            {orderStatusConfig[item.status as keyof typeof orderStatusConfig]
                              ? language === "ar"
                                ? orderStatusConfig[item.status as keyof typeof orderStatusConfig].labelAr
                                : orderStatusConfig[item.status as keyof typeof orderStatusConfig].labelEn
                              : item.status}
                          </h3>
                          {item.date && <p className="text-sm text-gray-600 mt-1">{item.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2
                  className={`text-xl font-bold text-gray-900 mb-6 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_order_details_items}
                </h2>

                <div className="space-y-4">
                  {mappedOrder.items.map((item: any, index: number) => (
                    <div
                      key={item.id ?? index}
                      className={`flex gap-4 pb-4 border-b border-gray-200 last:border-0 ${
                        language === "ar" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={language === "ar" ? item.nameAr ?? item.name : item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {language === "ar" ? item.nameAr ?? item.name : item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {t.account_order_details_quantity}: {item.quantity ?? item.qty ?? 1}
                        </p>
                        <p className="font-bold text-[#009FE3]">
                          {Number(item.price || 0).toLocaleString()} {CURRENCY_LABEL}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2
                  className={`text-xl font-bold text-gray-900 mb-4 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_order_details_customer_info}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{mappedOrder.customerInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{mappedOrder.customerInfo.phone}</span>
                  </div>
                  {mappedOrder.fulfillmentType === "delivery" && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900">{mappedOrder.customerInfo.address}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2
                  className={`text-xl font-bold text-gray-900 mb-4 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {language === "ar" ? "طريقة الاستلام" : "Fulfillment"}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">
                      {mappedOrder.fulfillmentType === "delivery"
                        ? t.account_orders_delivery
                        : t.account_orders_pickup}
                    </span>
                  </div>
                  {mappedOrder.fulfillmentType === "pickup" && mappedOrder.showroom && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div className="text-gray-900">
                        <p className="font-semibold">{mappedOrder.showroom.name}</p>
                        {mappedOrder.showroom.city && (
                          <p className="text-sm text-gray-600">{mappedOrder.showroom.city}</p>
                        )}
                        {mappedOrder.showroom.address && (
                          <p className="text-sm text-gray-600">{mappedOrder.showroom.address}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {mappedOrder.invoiceNo && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900">
                        {language === "ar" ? "رقم الفاتورة: " : "Invoice No: "}
                        <span className="font-mono font-semibold">{mappedOrder.invoiceNo}</span>
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2
                  className={`text-xl font-bold text-gray-900 mb-4 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t.account_order_details_summary}
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>{t.account_order_details_subtotal}</span>
                    <span>{mappedOrder.subtotal.toLocaleString()} {CURRENCY_LABEL}</span>
                  </div>
                  {mappedOrder.fulfillmentType === "delivery" && (
                    <div className="flex justify-between text-gray-600">
                      <span>{t.account_order_details_delivery_fee}</span>
                      <span>
                        {mappedOrder.deliveryFee === 0
                          ? t.account_order_details_free
                          : `${mappedOrder.deliveryFee.toLocaleString()} ${CURRENCY_LABEL}`}
                      </span>
                    </div>
                  )}
                  {mappedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{language === "ar" ? "الخصم" : "Discount"}</span>
                      <span>-{mappedOrder.discount.toLocaleString()} {CURRENCY_LABEL}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                    <span>{t.account_order_details_total}</span>
                    <span>{mappedOrder.total.toLocaleString()} {CURRENCY_LABEL}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
