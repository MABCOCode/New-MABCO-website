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
    descriptionAr: "ادفع فواتيرك لأكثر من 100 شركة من خلال صالات العرض",
    descriptionEn: "Pay your bills to over 100 companies through our showrooms",
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

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    serialNumber: "IMEI123456789012345",
    orderNumber: "MNT-2026-001",
    deviceType: "iPhone 14 Pro",
    deviceTypeAr: "ايفون 14 برو",
    brand: "Apple",
    issue: "Screen replacement",
    issueAr: "استبدال الشاشة",
    status: 8,
    receivedDate: "2026-02-08T10:00:00",
    estimatedCompletion: "2026-02-14T00:00:00",
    technician: "أحمد محمود",
    notes: "الجهاز بحالة جيدة، الشاشة فقط تحتاج استبدال",
    timeline: [
      { status: 1, date: "2026-02-08T10:00:00", note: "استلام الجهاز" },
      { status: 4, date: "2026-02-09T09:00:00", note: "بدء الصيانة" },
      { status: 8, date: "2026-02-10T14:30:00", note: "جاري تركيب الشاشة الجديدة" },
    ],
  },
  {
    serialNumber: "SN987654321",
    orderNumber: "MNT-2026-002",
    deviceType: "MacBook Pro 16\"",
    deviceTypeAr: "ماك بوك برو 16 انش",
    brand: "Apple",
    issue: "Battery replacement",
    issueAr: "استبدال البطارية",
    status: 14,
    receivedDate: "2026-02-05T11:00:00",
    estimatedCompletion: "2026-02-12T00:00:00",
    technician: "محمد علي",
    timeline: [
      { status: 1, date: "2026-02-05T11:00:00" },
      { status: 4, date: "2026-02-06T09:00:00" },
      { status: 8, date: "2026-02-08T10:00:00" },
      { status: 11, date: "2026-02-10T15:00:00" },
      { status: 12, date: "2026-02-11T09:00:00" },
      { status: 14, date: "2026-02-11T16:00:00", note: "جاهز للاستلام من الفرع الرئيسي" },
    ],
  },
  {
    serialNumber: "IMEI999888777666555",
    orderNumber: "MNT-2026-003",
    deviceType: "Samsung Galaxy S23",
    deviceTypeAr: "سامسونج جالكسي S23",
    brand: "Samsung",
    issue: "Water damage repair",
    issueAr: "إصلاح أضرار المياه",
    status: 4,
    receivedDate: "2026-02-10T14:00:00",
    estimatedCompletion: "2026-02-17T00:00:00",
    technician: "خالد حسن",
    notes: "تلف بسبب المياه، يحتاج فحص شامل",
    timeline: [
      { status: 1, date: "2026-02-10T14:00:00" },
      { status: 4, date: "2026-02-11T10:00:00", note: "بدء الفحص والتشخيص" },
    ],
  },
];

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

export const warrantyRecords: WarrantyRecord[] = [
  {
    serialNumber: "IMEI123456789012345",
    imei: "123456789012345",
    productName: "iPhone 14 Pro Max",
    productNameAr: "ايفون 14 برو ماكس",
    brand: "Apple",
    purchaseDate: "2025-11-15T00:00:00",
    warrantyPeriod: 12,
    warrantyExpiry: "2026-11-15T00:00:00",
    isActive: true,
    coverageType: "full",
    claimsUsed: 0,
    maxClaims: 2,
    purchaseLocation: "MABCO - دمشق، الفرع الرئيسي",
  },
  {
    serialNumber: "SN987654321",
    productName: "MacBook Pro 16\" M3",
    productNameAr: "ماك بوك برو 16 انش M3",
    brand: "Apple",
    purchaseDate: "2025-06-10T00:00:00",
    warrantyPeriod: 24,
    warrantyExpiry: "2027-06-10T00:00:00",
    isActive: true,
    coverageType: "full",
    claimsUsed: 1,
    maxClaims: 3,
    purchaseLocation: "MABCO - حلب",
  },
  {
    serialNumber: "IMEI111222333444555",
    imei: "111222333444555",
    productName: "Samsung Galaxy S22",
    productNameAr: "سامسونج جالكسي S22",
    brand: "Samsung",
    purchaseDate: "2024-03-20T00:00:00",
    warrantyPeriod: 12,
    warrantyExpiry: "2025-03-20T00:00:00",
    isActive: false,
    coverageType: "expired",
    claimsUsed: 0,
    maxClaims: 1,
    purchaseLocation: "MABCO - حمص",
  },
];

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
    id: 1,
    nameAr: "سيريتل",
    nameEn: "Syriatel",
    category: "Telecom",
    categoryAr: "اتصالات",
    logo: "📱",
    color: "bg-green-500",
  },
  {
    id: 2,
    nameAr: "MTN",
    nameEn: "MTN Syria",
    category: "Telecom",
    categoryAr: "اتصالات",
    logo: "📞",
    color: "bg-yellow-500",
  },
  {
    id: 3,
    nameAr: "كهرباء دمشق",
    nameEn: "Damascus Electricity",
    category: "Utilities",
    categoryAr: "خدمات",
    logo: "⚡",
    color: "bg-blue-500",
  },
  {
    id: 4,
    nameAr: "شبكة المياه",
    nameEn: "Water Network",
    category: "Utilities",
    categoryAr: "خدمات",
    logo: "💧",
    color: "bg-cyan-500",
  },
  {
    id: 5,
    nameAr: "الإنترنت السوري",
    nameEn: "Syrian Internet",
    category: "Internet",
    categoryAr: "إنترنت",
    logo: "🌐",
    color: "bg-purple-500",
  },
  {
    id: 6,
    nameAr: "نتفليكس",
    nameEn: "Netflix",
    category: "Entertainment",
    categoryAr: "ترفيه",
    logo: "🎬",
    color: "bg-red-500",
  },
  {
    id: 7,
    nameAr: "بلايستيشن",
    nameEn: "PlayStation",
    category: "Gaming",
    categoryAr: "ألعاب",
    logo: "🎮",
    color: "bg-indigo-500",
  },
  {
    id: 8,
    nameAr: "ستيم",
    nameEn: "Steam",
    category: "Gaming",
    categoryAr: "ألعاب",
    logo: "🎯",
    color: "bg-slate-600",
  },
  {
    id: 9,
    nameAr: "سبوتيفاي",
    nameEn: "Spotify",
    category: "Entertainment",
    categoryAr: "ترفيه",
    logo: "🎵",
    color: "bg-green-600",
  },
  {
    id: 10,
    nameAr: "أبل ستور",
    nameEn: "Apple Store",
    category: "Digital",
    categoryAr: "رقمي",
    logo: "🍎",
    color: "bg-gray-800",
  },
  {
    id: 11,
    nameAr: "جوجل بلاي",
    nameEn: "Google Play",
    category: "Digital",
    categoryAr: "رقمي",
    logo: "📲",
    color: "bg-blue-600",
  },
  {
    id: 12,
    nameAr: "يوتيوب بريميوم",
    nameEn: "YouTube Premium",
    category: "Entertainment",
    categoryAr: "ترفيه",
    logo: "▶️",
    color: "bg-red-600",
  },
];
