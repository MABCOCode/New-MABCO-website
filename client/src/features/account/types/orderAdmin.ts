export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "cash" | "card" | "online";

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  items: {
    id: number;
    name: string;
    nameAr: string;
    image: string;
    quantity: number;
    price: number;
    color?: string;
    specs?: string;
  }[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderDate: string;
  estimatedDelivery: string;
  timeline: {
    status: OrderStatus;
    date: string;
    note?: string;
  }[];
  notes?: string;
  trackingNumber?: string;
}

export const orderStatusConfig: Record<OrderStatus, { labelEn: string; labelAr: string; color: string }> = {
  pending: { labelEn: "Pending", labelAr: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  confirmed: { labelEn: "Confirmed", labelAr: "مؤكد", color: "bg-blue-100 text-blue-700 border-blue-200" },
  processing: { labelEn: "Processing", labelAr: "قيد المعالجة", color: "bg-purple-100 text-purple-700 border-purple-200" },
  shipped: { labelEn: "Shipped", labelAr: "تم الشحن", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  out_for_delivery: { labelEn: "Out for Delivery", labelAr: "في التوصيل", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  delivered: { labelEn: "Delivered", labelAr: "تم التسليم", color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { labelEn: "Cancelled", labelAr: "ملغي", color: "bg-red-100 text-red-700 border-red-200" },
  returned: { labelEn: "Returned", labelAr: "مرتجع", color: "bg-orange-100 text-orange-700 border-orange-200" },
};

export const paymentStatusConfig: Record<PaymentStatus, { labelEn: string; labelAr: string; color: string }> = {
  pending: { labelEn: "Pending", labelAr: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  paid: { labelEn: "Paid", labelAr: "مدفوع", color: "bg-green-100 text-green-700 border-green-200" },
  failed: { labelEn: "Failed", labelAr: "فشل", color: "bg-red-100 text-red-700 border-red-200" },
  refunded: { labelEn: "Refunded", labelAr: "مسترجع", color: "bg-blue-100 text-blue-700 border-blue-200" },
};
