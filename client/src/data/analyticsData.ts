// Analytics and tracking data for super admin reports

export interface VisitorSession {
  sessionId: string;
  userId?: string; // if logged in
  userName?: string;
  userNameAr?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  pagesVisited: string[];
  actionsCount: number;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  location: string;
  referrer: string;
}

export interface CartEvent {
  id: string;
  productId: string;
  productName: string;
  productNameAr: string;
  productImage: string;
  userId?: string;
  userName?: string;
  action: 'added' | 'removed';
  timestamp: Date;
  convertedToPurchase: boolean;
  timeInCart?: number; // seconds
  orderId?: string;
}

export interface NotificationEvent {
  notificationId: string;
  userId: string;
  userName: string;
  action: 'delivered' | 'opened' | 'clicked' | 'dismissed';
  timestamp: Date;
  deviceType: string;
}

export interface AdminAction {
  actionId: string;
  adminId: string;
  adminName: string;
  adminNameAr: string;
  actionType: 'edit' | 'add' | 'delete' | 'hide' | 'status_change' | 'show';
  targetType: 'product' | 'category' | 'brand' | 'order' | 'offer' | 'slider';
  targetId: string;
  targetName: string;
  targetNameAr?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: Date;
  ipAddress: string;
  duration?: number; // milliseconds
  notes?: string;
}

// Sample visitor sessions
export const visitorSessions: VisitorSession[] = [
  {
    sessionId: 'session-001',
    userId: 'user-004',
    userName: 'Ali Mahmoud',
    userNameAr: 'علي محمود',
    startTime: new Date('2026-02-16T10:30:00'),
    endTime: new Date('2026-02-16T11:15:00'),
    duration: 2700,
    pagesVisited: ['home', 'mobiles', 'product-iphone-15', 'cart', 'checkout'],
    actionsCount: 12,
    device: 'mobile',
    browser: 'Chrome',
    location: 'Damascus, Syria',
    referrer: 'google.com',
  },
  {
    sessionId: 'session-002',
    userId: 'user-005',
    userName: 'Fatima Omar',
    userNameAr: 'فاطمة عمر',
    startTime: new Date('2026-02-16T14:20:00'),
    endTime: new Date('2026-02-16T14:45:00'),
    duration: 1500,
    pagesVisited: ['home', 'laptops', 'product-macbook'],
    actionsCount: 5,
    device: 'desktop',
    browser: 'Safari',
    location: 'Aleppo, Syria',
    referrer: 'direct',
  },
  {
    sessionId: 'session-003',
    startTime: new Date('2026-02-16T09:00:00'),
    endTime: new Date('2026-02-16T09:10:00'),
    duration: 600,
    pagesVisited: ['home'],
    actionsCount: 2,
    device: 'mobile',
    browser: 'Chrome',
    location: 'Homs, Syria',
    referrer: 'facebook.com',
  },
];

// Sample cart events
export const cartEvents: CartEvent[] = [
  {
    id: 'cart-event-001',
    productId: '1',
    productName: 'iPhone 15 Pro Max',
    productNameAr: 'آيفون 15 برو ماكس',
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    userId: 'user-004',
    userName: 'Ali Mahmoud',
    action: 'added',
    timestamp: new Date('2026-02-16T10:45:00'),
    convertedToPurchase: false,
    timeInCart: 3600,
  },
  {
    id: 'cart-event-002',
    productId: '2',
    productName: 'Samsung Galaxy S24 Ultra',
    productNameAr: 'سامسونج جالاكسي اس 24 الترا',
    productImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    userId: 'user-005',
    userName: 'Fatima Omar',
    action: 'added',
    timestamp: new Date('2026-02-15T16:30:00'),
    convertedToPurchase: true,
    timeInCart: 1200,
    orderId: 'ORD-2024-001',
  },
  {
    id: 'cart-event-003',
    productId: '3',
    productName: 'MacBook Pro 16" M3',
    productNameAr: 'ماك بوك برو 16 انش M3',
    productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    userId: 'user-004',
    userName: 'Ali Mahmoud',
    action: 'added',
    timestamp: new Date('2026-02-14T11:00:00'),
    convertedToPurchase: true,
    timeInCart: 7200,
    orderId: 'ORD-2024-002',
  },
];

// Sample admin actions
export const adminActions: AdminAction[] = [
  {
    actionId: 'action-001',
    adminId: 'user-002',
    adminName: 'Ahmad Hassan',
    adminNameAr: 'أحمد حسن',
    actionType: 'edit',
    targetType: 'product',
    targetId: '1',
    targetName: 'iPhone 15 Pro Max',
    targetNameAr: 'آيفون 15 برو ماكس',
    changes: [
      { field: 'price', oldValue: 4500, newValue: 4200 },
      { field: 'discount', oldValue: 5, newValue: 10 },
    ],
    timestamp: new Date('2026-02-14T10:30:00'),
    ipAddress: '192.168.1.100',
    duration: 45000,
  },
  {
    actionId: 'action-002',
    adminId: 'user-003',
    adminName: 'Sara Ali',
    adminNameAr: 'سارة علي',
    actionType: 'edit',
    targetType: 'product',
    targetId: '1',
    targetName: 'iPhone 15 Pro Max',
    targetNameAr: 'آيفون 15 برو ماكس',
    changes: [
      { field: 'description', oldValue: 'Old description', newValue: 'Updated description with new features' },
    ],
    timestamp: new Date('2026-02-15T14:20:00'),
    ipAddress: '192.168.1.101',
    duration: 120000,
  },
  {
    actionId: 'action-003',
    adminId: 'user-002',
    adminName: 'Ahmad Hassan',
    adminNameAr: 'أحمد حسن',
    actionType: 'status_change',
    targetType: 'order',
    targetId: 'ORD-2024-001',
    targetName: 'Order #ORD-2024-001',
    changes: [
      { field: 'status', oldValue: 'processing', newValue: 'shipped' },
    ],
    timestamp: new Date('2026-02-16T09:00:00'),
    ipAddress: '192.168.1.100',
    notes: 'Package sent with DHL',
  },
  {
    actionId: 'action-004',
    adminId: 'user-003',
    adminName: 'Sara Ali',
    adminNameAr: 'سارة علي',
    actionType: 'add',
    targetType: 'product',
    targetId: '25',
    targetName: 'New Product',
    timestamp: new Date('2026-02-13T16:45:00'),
    ipAddress: '192.168.1.101',
    duration: 300000,
  },
  {
    actionId: 'action-005',
    adminId: 'user-001',
    adminName: 'Mohammad Ahmad',
    adminNameAr: 'محمد أحمد',
    actionType: 'hide',
    targetType: 'product',
    targetId: '12',
    targetName: 'Old Product',
    timestamp: new Date('2026-02-12T11:00:00'),
    ipAddress: '192.168.1.99',
    notes: 'Out of stock - hide until restock',
  },
];

// Helper functions for analytics
export const getVisitorsInDateRange = (startDate: Date, endDate: Date): VisitorSession[] => {
  return visitorSessions.filter(
    session => session.startTime >= startDate && session.startTime <= endDate
  );
};

export const getLoggedInSessions = (startDate: Date, endDate: Date): VisitorSession[] => {
  return visitorSessions.filter(
    session => session.userId && session.startTime >= startDate && session.startTime <= endDate
  );
};

export const getCartEventsInRange = (startDate: Date, endDate: Date): CartEvent[] => {
  return cartEvents.filter(
    event => event.timestamp >= startDate && event.timestamp <= endDate
  );
};

export const getMostAddedProducts = (limit: number = 10): { productId: string; productName: string; productNameAr: string; count: number; conversionRate: number }[] => {
  const productCounts = new Map<string, { count: number; conversions: number; name: string; nameAr: string }>();
  
  cartEvents.forEach(event => {
    if (event.action === 'added') {
      const existing = productCounts.get(event.productId) || { count: 0, conversions: 0, name: event.productName, nameAr: event.productNameAr };
      existing.count++;
      if (event.convertedToPurchase) existing.conversions++;
      productCounts.set(event.productId, existing);
    }
  });
  
  return Array.from(productCounts.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.name,
      productNameAr: data.nameAr,
      count: data.count,
      conversionRate: (data.conversions / data.count) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getAdminActionsByAdmin = (adminId: string): AdminAction[] => {
  return adminActions.filter(action => action.adminId === adminId);
};

export const getAdminActionsInRange = (startDate: Date, endDate: Date): AdminAction[] => {
  return adminActions.filter(
    action => action.timestamp >= startDate && action.timestamp <= endDate
  );
};

export const calculateAdminPerformanceScore = (adminId: string): number => {
  const actions = getAdminActionsByAdmin(adminId);
  if (actions.length === 0) return 0;
  
  const actionsScore = Math.min(actions.length / 100, 1) * 10;
  
  // Calculate quality based on error rate (assuming low errors for now)
  const qualityScore = 8.5;
  
  // Calculate speed based on average duration
  const avgDuration = actions.reduce((sum, a) => sum + (a.duration || 60000), 0) / actions.length;
  const speedScore = Math.max(0, (1 - avgDuration / 300000)) * 10;
  
  return Number((actionsScore * 0.3 + qualityScore * 0.4 + speedScore * 0.3).toFixed(1));
};

// Get total visitors count
export const getTotalVisitors = (): number => visitorSessions.length;

// Get unique visitors count
export const getUniqueVisitors = (): number => {
  const uniqueIds = new Set(visitorSessions.map(s => s.userId || s.sessionId));
  return uniqueIds.size;
};

// Get average session duration
export const getAverageSessionDuration = (): number => {
  const total = visitorSessions.reduce((sum, s) => sum + s.duration, 0);
  return Math.round(total / visitorSessions.length);
};
