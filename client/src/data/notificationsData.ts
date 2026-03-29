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
