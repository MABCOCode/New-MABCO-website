// Order Status Types
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

// Order Interface
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
  appliedOffers?: {
    id: string;
    type: "direct_discount" | "coupon" | "free_product" | "bundle_discount";
    name: string;
    nameAr: string;
    description?: string;
    descriptionAr?: string;
    discountAmount: number;
    couponCode?: string;
  }[];
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

// Mock Orders Data
export const ordersData: Order[] = [
  {
    id: "ORD-2026-001",
    orderNumber: "#1001",
    customer: {
      id: 1,
      name: "أحمد محمد علي",
      email: "ahmed.mohammed@email.com",
      phone: "+963 933 123 4567",
      address: {
        street: "شارع الثورة، بناء الأمل، الطابق الثالث",
        city: "دمشق",
        state: "ريف دمشق",
        zipCode: "12345",
      },
    },
    items: [
      {
        id: 1,
        name: "iPhone 15 Pro Max",
        nameAr: "ايفون 15 برو ماكس",
        image: "https://images.unsplash.com/photo-1696446702037-57b6b75a3266?w=400",
        quantity: 1,
        price: 5499000,
        color: "Natural Titanium",
        specs: "256GB",
      },
      {
        id: 2,
        name: "AirPods Pro (2nd Gen)",
        nameAr: "ايربودز برو الجيل الثاني",
        image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
        quantity: 1,
        price: 1299000,
      },
    ],
    pricing: {
      subtotal: 6798000,
      shipping: 50000,
      tax: 339900,
      discount: 200000,
      total: 6987900,
    },
    appliedOffers: [
      {
        id: "OFFER-001",
        type: "coupon",
        name: "WELCOME200",
        nameAr: "كوبون الترحيب 200",
        description: "Welcome coupon - 200,000 SYP discount",
        descriptionAr: "كوبون ترحيبي - خصم 200,000 ل.س",
        discountAmount: 200000,
        couponCode: "WELCOME200",
      },
    ],
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "card",
    orderDate: "2026-02-10T10:30:00",
    estimatedDelivery: "2026-02-15T00:00:00",
    timeline: [
      {
        status: "pending",
        date: "2026-02-10T10:30:00",
        note: "تم استلام الطلب",
      },
      {
        status: "confirmed",
        date: "2026-02-10T11:00:00",
        note: "تم تأكيد الطلب والدفع",
      },
      {
        status: "processing",
        date: "2026-02-10T14:30:00",
        note: "جاري تجهيز الطلب في المستودع",
      },
    ],
    notes: "العميل طلب التوصيل بين الساعة 2-5 مساءً",
    trackingNumber: "MABCO123456789",
  },
  {
    id: "ORD-2026-002",
    orderNumber: "#1002",
    customer: {
      id: 2,
      name: "فاطمة حسن الأحمد",
      email: "fatima.hassan@email.com",
      phone: "+963 944 234 5678",
      address: {
        street: "شارع الجامعة، مجمع الياسمين، الشقة 12",
        city: "حلب",
        state: "حلب",
        zipCode: "23456",
      },
    },
    items: [
      {
        id: 5,
        name: "Samsung Galaxy S24 Ultra",
        nameAr: "سامسونج جالكسي S24 الترا",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
        quantity: 1,
        price: 5299000,
        color: "Titanium Gray",
        specs: "512GB",
      },
    ],
    pricing: {
      subtotal: 5248000,
      shipping: 60000,
      tax: 262400,
      discount: 150000,
      total: 5420400,
    },
    appliedOffers: [
      {
        id: "OFFER-DIRECT-02",
        type: "direct_discount",
        name: "iPad Pro Special Offer",
        nameAr: "عرض خاص على آيباد برو",
        description: "Direct discount on iPad Pro 12.9\"",
        descriptionAr: "خصم مباشر على آيباد برو 12.9 انش",
        discountAmount: 150000,
      },
    ],
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "cash",
    orderDate: "2026-02-11T09:15:00",
    estimatedDelivery: "2026-02-16T00:00:00",
    timeline: [
      {
        status: "pending",
        date: "2026-02-11T09:15:00",
        note: "في انتظار تأكيد العميل",
      },
    ],
    notes: "العميل يريد الاتصال قبل التوصيل بيوم",
  },
  {
    id: "ORD-2026-003",
    orderNumber: "#1003",
    customer: {
      id: 3,
      name: "محمد يوسف الخطيب",
      email: "mohammed.yousef@email.com",
      phone: "+963 955 345 6789",
      address: {
        street: "شارع النصر، برج العروبة، الطابق السابع",
        city: "حمص",
        state: "حمص",
        zipCode: "34567",
      },
    },
    items: [
      {
        id: 10,
        name: "MacBook Pro 14\" M3",
        nameAr: "ماك بوك برو 14 انش M3",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        quantity: 1,
        price: 8999000,
        specs: "16GB RAM, 512GB SSD",
      },
      {
        id: 11,
        name: "Magic Mouse",
        nameAr: "ماوس ماجيك",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
        quantity: 1,
        price: 399000,
      },
    ],
    pricing: {
      subtotal: 9398000,
      shipping: 0,
      tax: 469900,
      discount: 500000,
      total: 9367900,
    },
    appliedOffers: [
      {
        id: "OFFER-BUNDLE-01",
        type: "bundle_discount",
        name: "MacBook + Accessories Bundle",
        nameAr: "عرض ماك بوك مع الإكسسوارات",
        description: "Save 500,000 SYP when buying MacBook with accessories",
        descriptionAr: "وفّر 500,000 ل.س عند شراء ماك بوك مع الإكسسوارات",
        discountAmount: 500000,
      },
    ],
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "cash",
    orderDate: "2026-02-05T12:00:00",
    estimatedDelivery: "2026-02-09T00:00:00",
    timeline: [
      {
        status: "pending",
        date: "2026-02-05T12:00:00",
      },
      {
        status: "confirmed",
        date: "2026-02-05T13:00:00",
      },
      {
        status: "processing",
        date: "2026-02-06T10:00:00",
      },
      {
        status: "shipped",
        date: "2026-02-07T09:00:00",
      },
      {
        status: "out_for_delivery",
        date: "2026-02-09T08:00:00",
      },
      {
        status: "delivered",
        date: "2026-02-09T14:30:00",
        note: "تم التسليم للعميل مباشرة",
      },
    ],
    trackingNumber: "MABCO567891234",
  },
  {
    id: "ORD-2026-004",
    orderNumber: "#1004",
    customer: {
      id: 4,
      name: "سارة عبدالله الحمصي",
      email: "sara.abdullah@email.com",
      phone: "+963 966 456 7890",
      address: {
        street: "شارع المتنبي، حي الزهراء، منزل رقم 25",
        city: "اللاذقية",
        state: "اللاذقية",
        zipCode: "45678",
      },
    },
    items: [
      {
        id: 15,
        name: "iPad Pro 12.9\" M2",
        nameAr: "ايباد برو 12.9 انش M2",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        quantity: 1,
        price: 4599000,
        specs: "256GB, WiFi + Cellular",
      },
      {
        id: 16,
        name: "Apple Pencil (2nd Gen)",
        nameAr: "ابل بنسل الجيل الثاني",
        image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
        quantity: 1,
        price: 649000,
      },
    ],
    pricing: {
      subtotal: 5248000,
      shipping: 60000,
      tax: 262400,
      discount: 150000,
      total: 5420400,
    },
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "cash",
    orderDate: "2026-02-11T09:15:00",
    estimatedDelivery: "2026-02-16T00:00:00",
    timeline: [
      {
        status: "pending",
        date: "2026-02-11T09:15:00",
        note: "في انتظار تأكيد العميل",
      },
    ],
    notes: "العميل يريد الاتصال قبل التوصيل بيوم",
  },
  {
    id: "ORD-2026-005",
    orderNumber: "#1005",
    customer: {
      id: 5,
      name: "خالد إبراهيم السوري",
      email: "khaled.ibrahim@email.com",
      phone: "+963 977 567 8901",
      address: {
        street: "شارع بغداد، مجمع السلام، الطابق الخامس",
        city: "دمشق",
        state: "ريف دمشق",
        zipCode: "12346",
      },
    },
    items: [
      {
        id: 20,
        name: "Sony WH-1000XM5",
        nameAr: "سوني WH-1000XM5",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
        quantity: 2,
        price: 1899000,
      },
    ],
    pricing: {
      subtotal: 3798000,
      shipping: 40000,
      tax: 189900,
      discount: 300000,
      total: 3727900,
    },
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "card",
    orderDate: "2026-02-08T16:45:00",
    estimatedDelivery: "2026-02-12T00:00:00",
    timeline: [
      {
        status: "pending",
        date: "2026-02-08T16:45:00",
      },
      {
        status: "confirmed",
        date: "2026-02-08T17:00:00",
      },
      {
        status: "cancelled",
        date: "2026-02-09T10:30:00",
        note: "ألغى العميل الطلب - تم استرجاع المبلغ",
      },
    ],
    notes: "ألغى العميل بسبب تغيير رأيه",
  },
  {
    id: "ORD-2026-006",
    orderNumber: "#1006",
    customer: {
      id: 6,
      name: "ليلى محمود الشامي",
      email: "laila.mahmoud@email.com",
      phone: "+963 988 678 9012",
      address: {
        street: "شارع الفردوس، حي الورود، منزل 45",
        city: "طرطوس",
        state: "طرطوس",
        zipCode: "56789",
      },
    },
    items: [
      {
        id: 25,
        name: "Apple Watch Series 9",
        nameAr: "ابل واتش سيريس 9",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
        quantity: 1,
        price: 1999000,
        color: "Midnight Aluminum",
        specs: "45mm GPS",
      },
    ],
    pricing: {
      subtotal: 1999000,
      shipping: 45000,
      tax: 99950,
      discount: 0,
      total: 2143950,
    },
    status: "out_for_delivery",
    paymentStatus: "paid",
    paymentMethod: "online",
    orderDate: "2026-02-10T08:00:00",
    estimatedDelivery: "2026-02-11T00:00:00",
    timeline: [
      {
        status: "pending",
        date: "2026-02-10T08:00:00",
      },
      {
        status: "confirmed",
        date: "2026-02-10T08:30:00",
      },
      {
        status: "processing",
        date: "2026-02-10T11:00:00",
      },
      {
        status: "shipped",
        date: "2026-02-10T16:00:00",
      },
      {
        status: "out_for_delivery",
        date: "2026-02-11T07:00:00",
        note: "المندوب في الطريق للتوصيل",
      },
    ],
    trackingNumber: "MABCO234567890",
  },
];

// Order Statistics
export const getOrderStatistics = () => {
  return {
    total: ordersData.length,
    pending: ordersData.filter(o => o.status === "pending").length,
    confirmed: ordersData.filter(o => o.status === "confirmed").length,
    processing: ordersData.filter(o => o.status === "processing").length,
    shipped: ordersData.filter(o => o.status === "shipped").length,
    outForDelivery: ordersData.filter(o => o.status === "out_for_delivery").length,
    delivered: ordersData.filter(o => o.status === "delivered").length,
    cancelled: ordersData.filter(o => o.status === "cancelled").length,
    returned: ordersData.filter(o => o.status === "returned").length,
    totalRevenue: ordersData
      .filter(o => o.status === "delivered")
      .reduce((sum, o) => sum + o.pricing.total, 0),
    pendingRevenue: ordersData
      .filter(o => ["pending", "confirmed", "processing", "shipped", "out_for_delivery"].includes(o.status))
      .reduce((sum, o) => sum + o.pricing.total, 0),
  };
};

// Status Colors and Labels
export const orderStatusConfig = {
  pending: {
    labelEn: "Pending",
    labelAr: "قيد الانتظار",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
  },
  confirmed: {
    labelEn: "Confirmed",
    labelAr: "مؤكد",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  processing: {
    labelEn: "Processing",
    labelAr: "قيد التجهيز",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
  },
  shipped: {
    labelEn: "Shipped",
    labelAr: "تم الشحن",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    iconColor: "text-indigo-600",
  },
  out_for_delivery: {
    labelEn: "Out for Delivery",
    labelAr: "في الطريق",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    iconColor: "text-cyan-600",
  },
  delivered: {
    labelEn: "Delivered",
    labelAr: "تم التوصيل",
    color: "bg-green-100 text-green-700 border-green-200",
    iconColor: "text-green-600",
  },
  cancelled: {
    labelEn: "Cancelled",
    labelAr: "ملغى",
    color: "bg-red-100 text-red-700 border-red-200",
    iconColor: "text-red-600",
  },
  returned: {
    labelEn: "Returned",
    labelAr: "مرتجع",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    iconColor: "text-orange-600",
  },
};

// Payment Status Config
export const paymentStatusConfig = {
  pending: {
    labelEn: "Pending",
    labelAr: "معلق",
    color: "bg-yellow-100 text-yellow-700",
  },
  paid: {
    labelEn: "Paid",
    labelAr: "مدفوع",
    color: "bg-green-100 text-green-700",
  },
  failed: {
    labelEn: "Failed",
    labelAr: "فشل",
    color: "bg-red-100 text-red-700",
  },
  refunded: {
    labelEn: "Refunded",
    labelAr: "مسترجع",
    color: "bg-orange-100 text-orange-700",
  },
};