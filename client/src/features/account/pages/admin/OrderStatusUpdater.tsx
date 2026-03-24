import { Check, X } from "lucide-react";
import { useState } from "react";
import { OrderStatus, orderStatusConfig } from "../../types/orderAdmin";
import { useLanguage } from "../../../../context/LanguageContext";

interface OrderStatusUpdaterProps {
  currentStatus: OrderStatus;
  orderId: string;
  onUpdate: (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    meta?: {
      shippingFee?: number;
      shippingPaidBy?: "customer" | "company" | null;
      invoiceNo?: string | null;
    },
  ) => void;
  onClose: () => void;
  language: "ar" | "en";
  fulfillmentType?: "delivery" | "pickup" | null;
  shippingFee?: number;
  shippingPaidBy?: "customer" | "company" | null;
  invoiceNo?: string | null;
}

const deliveryStatusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const pickupStatusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "delivered",
];

const alternativeStatuses: OrderStatus[] = ["cancelled", "returned"];

export function OrderStatusUpdater({
  currentStatus,
  orderId,
  onUpdate,
  onClose,
  fulfillmentType,
  shippingFee,
  shippingPaidBy,
  invoiceNo,
}: OrderStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [shippingFeeInput, setShippingFeeInput] = useState(
    typeof shippingFee === "number" ? String(shippingFee) : ""
  );
  const [shippingPaidByInput, setShippingPaidByInput] = useState<
    "customer" | "company" | ""
  >(shippingPaidBy ?? "");
  const [invoiceNoInput, setInvoiceNoInput] = useState(invoiceNo ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const handleUpdate = () => {
    const isDelivery = fulfillmentType === "delivery";
    if (isDelivery) {
      const feeValue = Number(shippingFeeInput);
      if (!Number.isFinite(feeValue) || feeValue < 0) {
        setFormError(language === "ar" ? "يرجى إدخال قيمة الشحن." : "Please enter a shipping fee.");
        return;
      }
      if (!shippingPaidByInput) {
        setFormError(language === "ar" ? "يرجى اختيار جهة الدفع." : "Please select who pays shipping.");
        return;
      }
    }

    if (selectedStatus === "delivered" && !invoiceNoInput.trim()) {
      setFormError(language === "ar" ? "يرجى إدخال رقم الفاتورة." : "Please enter the invoice number.");
      return;
    }

    setFormError(null);
    onUpdate(orderId, selectedStatus, note || undefined, {
      shippingFee: fulfillmentType === "delivery" ? Number(shippingFeeInput) : undefined,
      shippingPaidBy:
        fulfillmentType === "delivery"
          ? (shippingPaidByInput as "customer" | "company")
          : null,
      invoiceNo: selectedStatus === "delivered" ? invoiceNoInput.trim() : undefined,
    });
    onClose();
  };

  const statusFlow = fulfillmentType === "pickup" ? pickupStatusFlow : deliveryStatusFlow;
  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold">{t('admin.orders.updateStatusTitle')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-semibold mb-2">
              {t('admin.orders.currentStatus')}
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-bold ${orderStatusConfig[currentStatus].color}`}>
              {language === "ar"
                ? orderStatusConfig[currentStatus].labelAr
                : orderStatusConfig[currentStatus].labelEn}
            </div>
          </div>

          {/* Normal Flow */}
          <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
              {t('admin.orders.normalFlow')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statusFlow.map((status, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = status === currentStatus;
                const isDisabled = index < currentIndex;
                const config = orderStatusConfig[status];

                return (
                  <button
                    key={status}
                    onClick={() => !isDisabled && setSelectedStatus(status)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                      selectedStatus === status
                        ? "border-[#009FE3] bg-blue-50 shadow-md scale-105"
                        : isDisabled
                        ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {/* Checkmark for completed */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Selected indicator */}
                    {selectedStatus === status && (
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#009FE3] rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}

                    <div className={`text-xs font-semibold mb-1 ${config.iconColor}`}>
                      {language === "ar" ? config.labelAr : config.labelEn}
                    </div>
                    <div className="text-xs text-gray-500">
                      {language === "ar" ? `خطوة ${index + 1}` : `Step ${index + 1}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alternative Actions */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              {t('admin.orders.otherActions')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {alternativeStatuses.map((status) => {
                const config = orderStatusConfig[status];
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedStatus === status
                        ? "border-red-500 bg-red-50 shadow-md scale-105"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${config.iconColor}`}>
                      {language === "ar" ? config.labelAr : config.labelEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note Input */}
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {formError}
            </div>
          )}

          {fulfillmentType === "delivery" && (
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">
                {language === "ar" ? "قيمة الشحن" : "Shipping Fee"}
              </label>
              <input
                type="number"
                min="0"
                value={shippingFeeInput}
                onChange={(e) => setShippingFeeInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                placeholder={language === "ar" ? "أدخل قيمة الشحن" : "Enter shipping fee"}
              />
              <label className="block text-sm font-bold text-gray-700">
                {language === "ar" ? "جهة الدفع" : "Shipping Paid By"}
              </label>
              <select
                value={shippingPaidByInput}
                onChange={(e) => setShippingPaidByInput(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent bg-white"
              >
                <option value="">
                  {language === "ar" ? "اختر الجهة" : "Select payer"}
                </option>
                <option value="customer">{language === "ar" ? "العميل" : "Customer"}</option>
                <option value="company">{language === "ar" ? "الشركة" : "Company"}</option>
              </select>
            </div>
          )}

          {selectedStatus === "delivered" && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                {language === "ar" ? "رقم الفاتورة (POS)" : "Invoice No (POS)"}
              </label>
              <input
                type="text"
                value={invoiceNoInput}
                onChange={(e) => setInvoiceNoInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                placeholder={language === "ar" ? "أدخل رقم الفاتورة" : "Enter invoice number"}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t('admin.orders.addNote')}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('admin.orders.notePlaceholder')}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={selectedStatus === currentStatus}
              className="flex-1 bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {t('admin.orders.update')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              {t('admin.orders.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
