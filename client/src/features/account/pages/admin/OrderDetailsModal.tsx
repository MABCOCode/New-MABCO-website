import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  DollarSign,
  Calendar,
  Truck,
  CreditCard,
  Clock,
  FileText,
  Edit,
  Printer,
  Tag,
  Gift,
  Percent,
} from "lucide-react";
import { Order, orderStatusConfig, paymentStatusConfig } from "../../../../data/ordersData";
import { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { OrderStatusUpdater } from "./OrderStatusUpdater";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: any, note?: string) => void;
  language: "ar" | "en";
}

export function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailsModalProps) {
  const [showStatusUpdater, setShowStatusUpdater] = useState(false);
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === "ar" ? "ar-SY" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US");
  };

  const offerTypeLabels = {
    coupon: { label: t('admin.orders.coupon'), icon: Tag, color: "bg-purple-100 text-purple-700 border-purple-300" },
    direct_discount: { label: t('admin.orders.directDiscount'), icon: Percent, color: "bg-green-100 text-green-700 border-green-300" },
    bundle_discount: { label: t('admin.orders.bundleDiscount'), icon: Package, color: "bg-blue-100 text-blue-700 border-blue-300" },
    free_product: { label: t('admin.orders.freeProduct'), icon: Gift, color: "bg-orange-100 text-orange-700 border-orange-300" },
  } as Record<string, { label: string; icon: any; color: string }>;

  const paymentMethodLabels = {
    cash: t('admin.orders.cash'),
    card: t('admin.orders.card'),
    online: t('admin.orders.online'),
  } as Record<string, string>;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-6 flex items-center justify-between rounded-t-2xl z-10">
            <div>
              <h2 className="text-2xl font-bold mb-1">{t('admin.orders.orderDetails')}</h2>
              <p className="text-blue-100">{order.orderNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={t('admin.orders.print')}
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Status and Actions */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {language === "ar" ? "حالة الطلب" : "Order Status"}
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-bold ${
                        orderStatusConfig[order.status].color
                      }`}
                    >
                      {language === "ar"
                        ? orderStatusConfig[order.status].labelAr
                        : orderStatusConfig[order.status].labelEn}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {t('admin.orders.paymentStatus')}
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm ${
                        paymentStatusConfig[order.paymentStatus].color
                      }`}
                    >
                      {language === "ar"
                        ? paymentStatusConfig[order.paymentStatus].labelAr
                        : paymentStatusConfig[order.paymentStatus].labelEn}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowStatusUpdater(true)}
                  className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  {t('admin.orders.updateStatus')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-[#009FE3]" />
                    {t('admin.orders.customerInfo')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{order.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{order.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 font-mono">
                        {order.customer.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-[#009FE3]" />
                    {t('admin.orders.shippingAddress')}
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    <p>{order.customer.address.street}</p>
                    <p>
                      {order.customer.address.city}, {order.customer.address.state}
                    </p>
                    <p>{order.customer.address.zipCode}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-[#009FE3]" />
                    {language === "ar" ? "معلومات الطلب" : "Order Information"}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('admin.orders.orderDate')}:</span>
                      <span className="text-gray-900 font-semibold">
                        {formatDate(order.orderDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">
                        {t('admin.orders.estimatedDelivery')}:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {formatDate(order.estimatedDelivery)}
                      </span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">
                          {t('admin.orders.trackingNumber')}:
                        </span>
                        <span className="text-[#009FE3] font-mono font-bold">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">
                        {t('admin.orders.paymentMethod')}:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {paymentMethodLabels[order.paymentMethod]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-[#009FE3]" />
                    {t('admin.orders.orderItems')}
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">
                            {language === "ar" ? item.nameAr : item.name}
                          </h4>
                          {item.color && (
                            <p className="text-xs text-gray-500 mb-1">
                              {language === "ar" ? "اللون: " : "Color: "}
                              {item.color}
                            </p>
                          )}
                          {item.specs && (
                            <p className="text-xs text-gray-500 mb-1">
                              {item.specs}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              {t('admin.orders.quantity')}: {item.quantity}
                            </span>
                            <span className="font-bold text-[#009FE3]">
                              {formatCurrency(item.price * item.quantity)}{" "}
                              {t('admin.common.syp')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-[#009FE3]" />
                    {t('admin.orders.pricingSummary')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-700">
                      <span>{t('admin.orders.subtotal')}:</span>
                      <span className="font-semibold">
                        {formatCurrency(order.pricing.subtotal)} {t('admin.common.syp')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700">
                      <span>{t('admin.orders.shipping')}:</span>
                      <span className="font-semibold">
                        {formatCurrency(order.pricing.shipping)} {t('admin.common.syp')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700">
                      <span>{t('admin.orders.tax')}:</span>
                      <span className="font-semibold">
                        {formatCurrency(order.pricing.tax)} {t('admin.common.syp')}
                      </span>
                    </div>
                    {order.pricing.discount > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>{t('admin.orders.discount')}:</span>
                        <span className="font-semibold">
                          -{formatCurrency(order.pricing.discount)}{" "}
                          {t('admin.common.syp')}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t-2 border-blue-300 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {t('admin.orders.total')}:
                      </span>
                      <span className="text-2xl font-bold text-[#009FE3]">
                        {formatCurrency(order.pricing.total)} {t('admin.common.syp')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Applied Offers */}
                {order.appliedOffers && order.appliedOffers.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Tag className="w-5 h-5 text-green-600" />
                      {t('admin.orders.appliedOffers')}
                    </h3>
                    <div className="space-y-3">
                      {order.appliedOffers.map((offer, index) => {
                        const OfferIcon = offerTypeLabels[offer.type].icon;
                        return (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border-2 border-green-200"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${offerTypeLabels[offer.type].color}`}>
                                  <OfferIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">
                                    {language === "ar" ? offer.nameAr : offer.name}
                                  </h4>
                                  {offer.couponCode && (
                                    <p className="text-xs text-gray-500 font-mono">
                                      {language === "ar" ? "الكود: " : "Code: "}
                                      {offer.couponCode}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  -{formatCurrency(offer.discountAmount)} {t('admin.common.syp')}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${offerTypeLabels[offer.type].color}`}>
                                  {offerTypeLabels[offer.type].label}
                                </span>
                              </div>
                            </div>
                            {offer.description && (
                              <p className="text-sm text-gray-600 mt-2">
                                {language === "ar" ? offer.descriptionAr : offer.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-[#009FE3]" />
                {t('admin.orders.orderTimeline')}
              </h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#009FE3] to-gray-300"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                  {order.timeline.map((event, index) => {
                    const config = orderStatusConfig[event.status];
                    const isLast = index === order.timeline.length - 1;

                    return (
                      <div key={index} className="relative flex gap-4 items-start">
                        {/* Timeline Dot */}
                        <div
                          className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 ${
                            isLast ? "bg-[#009FE3]" : "bg-gray-300"
                          }`}
                        >
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-sm ${config.color}`}
                            >
                              {language === "ar" ? config.labelAr : config.labelEn}
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          {event.note && (
                            <p className="text-sm text-gray-600 mt-2">{event.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-yellow-600" />
                  {t('admin.orders.notes')}
                </h3>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Updater Modal */}
      {showStatusUpdater && (
        <OrderStatusUpdater
          currentStatus={order.status}
          orderId={order.id}
          onUpdate={onUpdateStatus}
          onClose={() => setShowStatusUpdater(false)}
          language={language}
        />
      )}
    </>
  );
}
