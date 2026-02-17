// Notifications data and management

export interface Notification {
  id: string;
  type: 'order' | 'offer' | 'restock' | 'announcement' | 'alert' | 'message';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  icon?: string;
  image?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Recipients
  recipientType: 'specific' | 'all' | 'segment';
  recipientIds?: string[]; // if specific users
  recipientCount: number;
  segmentCriteria?: {
    hasItemsInCart?: boolean;
    hasPendingOrders?: boolean;
    isVIP?: boolean;
    isNewUser?: boolean;
    viewedProducts?: string[];
  };
  
  // Navigation
  navigationType: 'none' | 'url' | 'product' | 'category' | 'offer' | 'cart' | 'orders' | 'external';
  navigationTarget?: string; // URL, product ID, etc.
  
  // Delivery
  channels: Array<'push' | 'inapp' | 'email' | 'sms'>;
  scheduledFor?: Date;
  sentAt?: Date;
  expiresAt?: Date;
  
  // Analytics
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  dismissedCount: number;
  
  // User actions
  userActions?: {
    userId: string;
    userName: string;
    action: 'opened' | 'clicked' | 'dismissed';
    timestamp: Date;
  }[];
  
  // Metadata
  createdBy: string;
  createdByName: string;
  createdByNameAr: string;
  createdAt: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
}

// Sample notifications
export const notificationsData: Notification[] = [
  {
    id: 'notif-001',
    type: 'offer',
    title: '50% Off Samsung Galaxy S24!',
    titleAr: 'خصم 50% على جالكسي اس 24!',
    message: 'Limited time offer! Get the latest Samsung Galaxy S24 at half price. Don\'t miss out!',
    messageAr: 'عرض محدود! احصل على أحدث جالكسي اس 24 بنصف السعر. لا تفوت الفرصة!',
    icon: '🎁',
    priority: 'high',
    recipientType: 'segment',
    recipientCount: 234,
    segmentCriteria: {
      viewedProducts: ['2'],
      hasItemsInCart: true,
    },
    navigationType: 'product',
    navigationTarget: '2',
    channels: ['push', 'inapp', 'email'],
    sentAt: new Date('2026-02-15T10:00:00'),
    sentCount: 234,
    deliveredCount: 230,
    openedCount: 180,
    clickedCount: 120,
    dismissedCount: 50,
    userActions: [
      {
        userId: 'user-004',
        userName: 'Ali Mahmoud',
        action: 'clicked',
        timestamp: new Date('2026-02-15T10:15:00'),
      },
      {
        userId: 'user-005',
        userName: 'Fatima Omar',
        action: 'opened',
        timestamp: new Date('2026-02-15T10:30:00'),
      },
    ],
    createdBy: 'user-001',
    createdByName: 'Mohammad Ahmad',
    createdByNameAr: 'محمد أحمد',
    createdAt: new Date('2026-02-15T09:00:00'),
    status: 'sent',
  },
  {
    id: 'notif-002',
    type: 'order',
    title: 'Your order has been shipped',
    titleAr: 'تم شحن طلبك',
    message: 'Good news! Your order #ORD-2024-001 is on its way.',
    messageAr: 'أخبار سارة! طلبك #ORD-2024-001 في الطريق إليك.',
    icon: '📦',
    priority: 'normal',
    recipientType: 'specific',
    recipientIds: ['user-005'],
    recipientCount: 1,
    navigationType: 'orders',
    channels: ['push', 'inapp', 'email', 'sms'],
    sentAt: new Date('2026-02-16T09:30:00'),
    sentCount: 1,
    deliveredCount: 1,
    openedCount: 1,
    clickedCount: 1,
    dismissedCount: 0,
    userActions: [
      {
        userId: 'user-005',
        userName: 'Fatima Omar',
        action: 'clicked',
        timestamp: new Date('2026-02-16T09:35:00'),
      },
    ],
    createdBy: 'user-002',
    createdByName: 'Ahmad Hassan',
    createdByNameAr: 'أحمد حسن',
    createdAt: new Date('2026-02-16T09:00:00'),
    status: 'sent',
  },
  {
    id: 'notif-003',
    type: 'restock',
    title: 'iPhone 15 Pro is back in stock!',
    titleAr: 'آيفون 15 برو متوفر الآن!',
    message: 'The product you were waiting for is now available.',
    messageAr: 'المنتج الذي كنت تنتظره متوفر الآن.',
    icon: '🔔',
    priority: 'normal',
    recipientType: 'segment',
    recipientCount: 45,
    segmentCriteria: {
      viewedProducts: ['1'],
    },
    navigationType: 'product',
    navigationTarget: '1',
    channels: ['push', 'inapp'],
    sentAt: new Date('2026-02-14T14:00:00'),
    sentCount: 45,
    deliveredCount: 45,
    openedCount: 32,
    clickedCount: 18,
    dismissedCount: 10,
    createdBy: 'user-003',
    createdByName: 'Sara Ali',
    createdByNameAr: 'سارة علي',
    createdAt: new Date('2026-02-14T13:30:00'),
    status: 'sent',
  },
  {
    id: 'notif-004',
    type: 'announcement',
    title: 'Winter Sale is here!',
    titleAr: 'تخفيضات الشتاء هنا!',
    message: 'Up to 70% off on selected items. Shop now!',
    messageAr: 'خصومات تصل إلى 70% على منتجات مختارة. تسوق الآن!',
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600',
    priority: 'high',
    recipientType: 'all',
    recipientCount: 1250,
    navigationType: 'url',
    navigationTarget: '/offers',
    channels: ['push', 'inapp', 'email'],
    scheduledFor: new Date('2026-02-17T08:00:00'),
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    dismissedCount: 0,
    createdBy: 'user-001',
    createdByName: 'Mohammad Ahmad',
    createdByNameAr: 'محمد أحمد',
    createdAt: new Date('2026-02-16T16:00:00'),
    status: 'scheduled',
  },
];

// Helper functions
export const getNotificationById = (id: string): Notification | undefined => {
  return notificationsData.find(n => n.id === id);
};

export const getNotificationsByStatus = (status: Notification['status']): Notification[] => {
  return notificationsData.filter(n => n.status === status);
};

export const getNotificationsInRange = (startDate: Date, endDate: Date): Notification[] => {
  return notificationsData.filter(
    n => n.createdAt >= startDate && n.createdAt <= endDate
  );
};

export const calculateEngagementMetrics = (notification: Notification) => {
  const openRate = notification.deliveredCount > 0 
    ? (notification.openedCount / notification.deliveredCount) * 100 
    : 0;
  
  const clickRate = notification.openedCount > 0 
    ? (notification.clickedCount / notification.openedCount) * 100 
    : 0;
  
  const dismissRate = notification.deliveredCount > 0 
    ? (notification.dismissedCount / notification.deliveredCount) * 100 
    : 0;
  
  return {
    openRate: Number(openRate.toFixed(1)),
    clickRate: Number(clickRate.toFixed(1)),
    dismissRate: Number(dismissRate.toFixed(1)),
  };
};

// Notification templates
export const notificationTemplates = {
  orderUpdate: {
    title: 'Your order #{orderNumber} has been {status}',
    titleAr: 'طلبك رقم #{orderNumber} تم {statusAr}',
    navigationType: 'orders' as const,
  },
  productRestock: {
    title: '{productName} is back in stock!',
    titleAr: '{productNameAr} متوفر الآن!',
    message: 'The product you were waiting for is now available. Get it before it sells out!',
    messageAr: 'المنتج الذي كنت تنتظره متوفر الآن. اطلبه قبل نفاد الكمية!',
    navigationType: 'product' as const,
  },
  flashSale: {
    title: '⚡ Flash Sale: {discount}% OFF',
    titleAr: '⚡ تخفيضات سريعة: خصم {discount}%',
    message: 'Limited time offer on {categoryName}. Hurry!',
    messageAr: 'عرض محدود على {categoryNameAr}. أسرع!',
    navigationType: 'category' as const,
    priority: 'high' as const,
  },
};
