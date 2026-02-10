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
  Calendar,
  CreditCard,
  Clock,
} from "lucide-react";
import { AccountNavBar } from "../components/AccountNavBar";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import translations from "../../../i18n/translations";

interface OrderDetailsPageProps {
  language: "ar" | "en";
  orderId: number;
  onBack: () => void;
}


// Mock order data
const getMockOrder = (orderId: number) => ({
  id: orderId,
  date: "2026-01-15",
  status: "processing",
  currentStep: 2,
  fulfillmentType: "delivery",
  items: [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      nameEn: "iPhone 15 Pro Max",
      quantity: 1,
      price: 2500000,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "AirPods Pro",
      nameEn: "AirPods Pro",
      quantity: 1,
      price: 350000,
      image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop",
    },
  ],
  subtotal: 2850000,
  deliveryFee: 0,
  total: 2850000,
  paymentMethod: "cashOnDelivery",
  customerInfo: {
    name: "أحمد محمد",
    phone: "0944449999",
    address: "دمشق - المزة - شارع الجلاء",
  },
  timeline: [
    {
      status: "placed",
      date: "2026-01-15 10:30",
      completed: true,
    },
    {
      status: "confirmed",
      date: "2026-01-15 11:00",
      completed: true,
    },
    {
      status: "processing",
      date: "2026-01-15 14:00",
      completed: true,
    },
    {
      status: "readyForDelivery",
      date: "2026-01-16",
      completed: false,
    },
    {
      status: "completed",
      date: "",
      completed: false,
    },
  ],
});

export function OrderDetailsPage({ language, orderId, onBack }: OrderDetailsPageProps) {
  const t = translations[language];
  const order = getMockOrder(orderId);

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
                {t.account_order_details_number}: #{order.id}
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
              <Download className="w-5 h-5" />
              {t.account_order_details_download_invoice}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
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
                {/* Timeline Line */}
                <div
                  className={`absolute top-0 bottom-0 w-0.5 bg-gray-200 ${
                    language === "ar" ? "right-4" : "left-4"
                  }`}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(order.currentStep / (order.timeline.length - 1)) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-gradient-to-b from-[#009FE3] to-[#007BC7] w-full"
                  />
                </div>

                {/* Timeline Items */}
                <div className="space-y-6">
                  {order.timeline.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 ${
                        language === "ar" ? "flex-row-reverse" : "flex-row"
                      } relative`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          item.completed
                            ? "bg-gradient-to-br from-[#009FE3] to-[#007BC7] text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <h3
                          className={`font-semibold ${
                            item.completed ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {t[item.status as keyof typeof t]}
                        </h3>
                        {item.date && (
                          <p className="text-sm text-gray-600 mt-1">{item.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
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
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 pb-4 border-b border-gray-200 last:border-0 ${
                      language === "ar" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={language === "ar" ? item.name : item.nameEn}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div
                      className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {language === "ar" ? item.name : item.nameEn}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {t.account_order_details_quantity}: {item.quantity}
                      </p>
                      <p className="font-bold text-[#009FE3]">
                        {item.price.toLocaleString()} {language === "ar" ? "ل.س" : "SYP"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div
                  className={`flex justify-between ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <span className="text-gray-600">{t.account_order_details_subtotal}</span>
                  <span className="font-semibold">
                    {order.subtotal.toLocaleString()} {language === "ar" ? "ل.س" : "SYP"}
                  </span>
                </div>
                <div
                  className={`flex justify-between ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <span className="text-gray-600">{t.account_order_details_delivery_fee}</span>
                  <span className="font-semibold text-green-600">
                    {language === "ar" ? "مجاناً" : "Free"}
                  </span>
                </div>
                <div
                  className={`flex justify-between text-lg font-bold pt-2 border-t ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <span>{t.account_order_details_total}</span>
                  <span className="text-[#009FE3]">
                    {order.total.toLocaleString()} {language === "ar" ? "ل.س" : "SYP"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Delivery & Payment Info */}
          <div className="space-y-6">
            {/* Delivery/Pickup Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2
                className={`text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {order.fulfillmentType === "delivery" ? (
                  <>
                    <Truck className="w-5 h-5 text-[#009FE3]" />
                    <span>{t.account_order_details_delivery_info}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5 text-[#009FE3]" />
                    <span>{t.account_order_details_pickup_info}</span>
                  </>
                )}
              </h2>

              <div className={`space-y-3 ${language === "ar" ? "text-right" : "text-left"}`}>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.account_order_details_phone}</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {order.customerInfo.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {order.fulfillmentType === "delivery" ? t.account_order_details_address : t.account_order_details_showroom_location}
                  </p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {order.customerInfo.address}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2
                className={`text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#009FE3]" />
                <span>{t.account_order_details_payment_info}</span>
              </h2>

              <div className={`space-y-3 ${language === "ar" ? "text-right" : "text-left"}`}>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.account_order_details_payment_method}</p>
                  <p className="font-semibold text-gray-900">{t.account_order_details_cod}</p>
                </div>
              </div>
            </motion.div>

            {/* Download Invoice Button (Mobile) */}
            <button className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white rounded-xl hover:shadow-lg transition-all">
              <Download className="w-5 h-5" />
              {t.account_order_details_download_invoice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
