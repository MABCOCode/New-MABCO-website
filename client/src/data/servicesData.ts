// Services Data
export interface Service {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  color: string;
  path: string;
  gradient: string;
}

export const servicesData: Service[] = [
  {
    id: 1,
    nameAr: "خدمة الطباعة",
    nameEn: "Printing Service",
    descriptionAr: "طباعة على التيشيرتات، القبعات، والأكواب بتصاميم مخصصة",
    descriptionEn: "Print on T-shirts, Hats, and Mugs with custom designs",
    icon: "Printer",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    path: "printing",
  },
  {
    id: 2,
    nameAr: "مسابقات الألعاب",
    nameEn: "Gaming Competitions",
    descriptionAr: "شارك في مسابقات الألعاب الإلكترونية واربح جوائز قيمة",
    descriptionEn: "Join online gaming competitions and win valuable prizes",
    icon: "Gamepad2",
    color: "red",
    gradient: "from-red-500 to-orange-500",
    path: "gaming",
  },
  {
    id: 3,
    nameAr: "خدمات الشحن",
    nameEn: "Charging Services",
    descriptionAr: "شحن رصيد الهواتف، الألعاب، والخدمات الإلكترونية",
    descriptionEn: "Charge mobile credit, games, and digital services",
    icon: "Zap",
    color: "yellow",
    gradient: "from-yellow-500 to-amber-500",
    path: "charging",
  },
  {
    id: 4,
    nameAr: "فحص حالة الصيانة",
    nameEn: "Maintenance Status",
    descriptionAr: "تتبع حالة جهازك تحت الصيانة في الوقت الفعلي",
    descriptionEn: "Track your device maintenance status in real-time",
    icon: "Wrench",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    path: "maintenance-status",
  },
  {
    id: 5,
    nameAr: "الدفع الإلكتروني",
    nameEn: "E-Payment",
    descriptionAr: "ادفع فواتيرك لأكثر من 15 شركة من خلال صالات العرض",
    descriptionEn: "Pay your bills to over 15 companies through our showrooms",
    icon: "CreditCard",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    path: "epayment",
  },
  {
    id: 6,
    nameAr: "الضمان والتحقق",
    nameEn: "Warranty Check",
    descriptionAr: "تحقق من حالة الضمان والمنتج باستخدام الرقم التسلسلي",
    descriptionEn: "Check warranty status and product info using serial number",
    icon: "Shield",
    color: "indigo",
    gradient: "from-indigo-500 to-purple-500",
    path: "warranty",
  },
];

// Maintenance Status Types
export type MaintenanceStatus = 1 | 2 | 3 | 4 | 6 | 8 | 9 | 11 | 12 | 13 | 14 | 15;

export const maintenanceStatusConfig = {
  1: {
    labelAr: "تم التسليم للفني",
    labelEn: "Delivered to Technician",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
    progress: 10,
  },
  2: {
    labelAr: "تم التسليم للفني",
    labelEn: "Delivered to Technician",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
    progress: 15,
  },
  3: {
    labelAr: "تم التسليم للفني",
    labelEn: "Delivered to Technician",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
    progress: 20,
  },
  4: {
    labelAr: "تحت الصيانة",
    labelEn: "Under Maintenance",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
    progress: 30,
  },
  6: {
    labelAr: "تحت الصيانة",
    labelEn: "Under Maintenance",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
    progress: 45,
  },
  8: {
    labelAr: "تحت الصيانة",
    labelEn: "Under Maintenance",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
    progress: 55,
  },
  9: {
    labelAr: "تحت الصيانة",
    labelEn: "Under Maintenance",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
    progress: 65,
  },
  11: {
    labelAr: "فحص الجودة",
    labelEn: "Quality Testing",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
    progress: 80,
  },
  12: {
    labelAr: "العودة لصالة العرض",
    labelEn: "Returning to Showroom",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    iconColor: "text-indigo-600",
    progress: 90,
  },
  13: {
    labelAr: "العودة لصالة العرض",
    labelEn: "Returning to Showroom",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    iconColor: "text-indigo-600",
    progress: 93,
  },
  14: {
    labelAr: "جاهز للاستلام",
    labelEn: "Ready for Delivery",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    iconColor: "text-cyan-600",
    progress: 95,
  },
  15: {
    labelAr: "تم التسليم",
    labelEn: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
    iconColor: "text-green-600",
    progress: 100,
  },
};

// Mock Maintenance Records
export interface MaintenanceRecord {
  serialNumber: string;
  orderNumber: string;
  deviceType: string;
  deviceTypeAr: string;
  brand: string;
  issue: string;
  issueAr: string;
  status: MaintenanceStatus;
  receivedDate: string;
  estimatedCompletion: string;
  technician: string;
  notes?: string;
  timeline: {
    status: MaintenanceStatus;
    date: string;
    note?: string;
  }[];
}

export const maintenanceRecords: MaintenanceRecord[] = [];

// Warranty Data
export interface WarrantyRecord {
  serialNumber: string;
  imei?: string;
  productName: string;
  productNameAr: string;
  brand: string;
  purchaseDate: string;
  warrantyPeriod: number; // in months
  warrantyExpiry: string;
  isActive: boolean;
  coverageType: "full" | "limited" | "expired";
  claimsUsed: number;
  maxClaims: number;
  purchaseLocation: string;
}

export const warrantyRecords: WarrantyRecord[] = [];

// E-Payment Companies
export interface PaymentCompany {
  id: number;
  nameAr: string;
  nameEn: string;
  category: string;
  categoryAr: string;
  logo: string;
  color: string;
}

export const paymentCompanies: PaymentCompany[] = [
  {
    "id": 1,
    "nameAr": "تراسل",
    "nameEn": "Tarassul",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/tarassul (2).jpg",
    "color": "bg-purple-500"
  },
  {
    "id": 2,
    "nameAr": "تسديد هاتف",
    "nameEn": "Phone Payment",
    "category": "Telecom",
    "categoryAr": "اتصالات",
    "logo": "https://mabcoonline.com/Images/logo/phone (2).jpg",
    "color": "bg-blue-500"
  },
  {
    "id": 3,
    "nameAr": "تسديد كهرباء",
    "nameEn": "Electricity Payment",
    "category": "Utilities",
    "categoryAr": "خدمات",
    "logo": "https://mabcoonline.com/Images/logo/Electrical.jpg",
    "color": "bg-yellow-500"
  },
  {
    "id": 4,
    "nameAr": "ماء",
    "nameEn": "Water",
    "category": "Utilities",
    "categoryAr": "خدمات",
    "logo": "https://mabcoonline.com/Images/logo/water.png",
    "color": "bg-cyan-500"
  },
  {
    "id": 5,
    "nameAr": "زاد",
    "nameEn": "Zad",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/10.jpg",
    "color": "bg-emerald-500"
  },
  {
    "id": 6,
    "nameAr": "آي نت",
    "nameEn": "IENT",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/3.jpg",
    "color": "bg-indigo-500"
  },
  {
    "id": 7,
    "nameAr": "لاينت",
    "nameEn": "Linet",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/1.jpg",
    "color": "bg-orange-500"
  },
  {
    "id": 8,
    "nameAr": "سوا",
    "nameEn": "Sawa",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/14.jpg",
    "color": "bg-pink-500"
  },
  {
    "id": 9,
    "nameAr": "ليزر",
    "nameEn": "Lazer",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/13.jpg",
    "color": "bg-violet-500"
  },
  {
    "id": 10,
    "nameAr": "برونت",
    "nameEn": "Pronet",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/12.jpg",
    "color": "bg-fuchsia-500"
  },
  {
    "id": 11,
    "nameAr": "أمواج",
    "nameEn": "Waves",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/9.jpg",
    "color": "bg-amber-500"
  },
  {
    "id": 12,
    "nameAr": "وزارة الداخلية",
    "nameEn": "MOIA",
    "category": "Government",
    "categoryAr": "حكومي",
    "logo": "https://mabcoonline.com/Images/logo/8.jpg",
    "color": "bg-slate-600"
  },
  {
    "id": 13,
    "nameAr": "Nas",
    "nameEn": "Nas",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/7.jpg",
    "color": "bg-teal-500"
  },
  {
    "id": 14,
    "nameAr": "آية",
    "nameEn": "Aya",
    "category": "Internet",
    "categoryAr": "إنترنت",
    "logo": "https://mabcoonline.com/Images/logo/5.jpg",
    "color": "bg-rose-500"
  },
  {
    "id": 15,
    "nameAr": "جواز سفر",
    "nameEn": "Passport",
    "category": "Government",
    "categoryAr": "حكومي",
    "logo": "https://mabcoonline.com/Images/logo/15.jpg",
    "color": "bg-sky-500"
  },
  {
    "id": 16,
    "nameAr": "الجامعة السورية الافتراضية",
    "nameEn": "SVU",
    "category": "Education",
    "categoryAr": "تعليم",
    "logo": "https://mabcoonline.com/Images/logo/16.jpg",
    "color": "bg-lime-600"
  },
  {
    "id": 17,
    "nameAr": "سيرياتل",
    "nameEn": "Syriatell",
    "category": "Telecom",
    "categoryAr": "اتصالات",
    "logo": "https://mabcoonline.com/Images/logo/6.jpg",
    "color": "bg-green-500"
  },
  {
    "id": 18,
    "nameAr": "إم تي إن",
    "nameEn": "MTN",
    "category": "Telecom",
    "categoryAr": "اتصالات",
    "logo": "https://mabcoonline.com/Images/logo/2.jpg",
    "color": "bg-yellow-500"
  }
];
