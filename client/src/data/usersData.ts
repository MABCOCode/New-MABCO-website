// User data and admin privileges management

export interface UserPrivileges {
  products: {
    view: boolean;
    edit: boolean;
    add: boolean;
    delete: boolean;
    hide: boolean;
    manageImages: boolean;
  };
  categories: {
    allowedCategories: string[]; // 'all' or specific category IDs
    edit: boolean;
    add: boolean;
    delete: boolean;
  };
  brands: {
    allowedBrands: string[]; // 'all' or specific brand IDs
    edit: boolean;
    add: boolean;
    delete: boolean;
  };
  orders: {
    view: boolean;
    updateStatus: boolean;
    cancel: boolean;
    refund: boolean;
  };
  offers: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  content: {
    homepage: boolean;
    services: boolean;
    blog: boolean;
    slider: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  nameAr: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'super_admin';
  isAdmin: boolean;
  isSuperAdmin: boolean;
  privileges?: UserPrivileges;
  registeredAt: Date;
  lastLogin: Date;
  totalOrders: number;
  totalSpent: number;
  editCount?: number; // for admins
  status: 'active' | 'suspended' | 'banned';
  adminLevel?: 'junior' | 'senior' | 'lead';
}

// Sample users data
export const usersData: User[] = [
  {
    id: 'user-001',
    email: 'mohammad@example.com',
    name: 'Mohammad Ahmad',
    nameAr: 'محمد أحمد',
    phone: '+963 912 345 678',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'super_admin',
    isAdmin: true,
    isSuperAdmin: true,
    registeredAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    totalOrders: 0,
    totalSpent: 0,
    status: 'active',
  },
  {
    id: 'user-002',
    email: 'ahmad@example.com',
    name: 'Ahmad Hassan',
    nameAr: 'أحمد حسن',
    phone: '+963 911 234 567',
    avatar: 'https://i.pravatar.cc/150?img=13',
    role: 'admin',
    isAdmin: true,
    isSuperAdmin: false,
    adminLevel: 'junior',
    privileges: {
      products: {
        view: true,
        edit: true,
        add: false,
        delete: false,
        hide: false,
        manageImages: true,
      },
      categories: {
        allowedCategories: ['mobiles', 'laptops'],
        edit: true,
        add: false,
        delete: false,
      },
      brands: {
        allowedBrands: ['samsung', 'apple'],
        edit: true,
        add: false,
        delete: false,
      },
      orders: {
        view: true,
        updateStatus: true,
        cancel: false,
        refund: false,
      },
      offers: {
        create: false,
        edit: false,
        delete: false,
      },
      content: {
        homepage: false,
        services: false,
        blog: false,
        slider: false,
      },
    },
    registeredAt: new Date('2024-02-01'),
    lastLogin: new Date('2026-02-15'),
    totalOrders: 0,
    totalSpent: 0,
    editCount: 145,
    status: 'active',
  },
  {
    id: 'user-003',
    email: 'sara@example.com',
    name: 'Sara Ali',
    nameAr: 'سارة علي',
    phone: '+963 913 456 789',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'admin',
    isAdmin: true,
    isSuperAdmin: false,
    adminLevel: 'senior',
    privileges: {
      products: {
        view: true,
        edit: true,
        add: true,
        delete: true,
        hide: true,
        manageImages: true,
      },
      categories: {
        allowedCategories: ['all'],
        edit: true,
        add: true,
        delete: false,
      },
      brands: {
        allowedBrands: ['all'],
        edit: true,
        add: true,
        delete: false,
      },
      orders: {
        view: true,
        updateStatus: true,
        cancel: true,
        refund: false,
      },
      offers: {
        create: true,
        edit: true,
        delete: true,
      },
      content: {
        homepage: true,
        services: true,
        blog: true,
        slider: false,
      },
    },
    registeredAt: new Date('2024-01-20'),
    lastLogin: new Date('2026-02-14'),
    totalOrders: 0,
    totalSpent: 0,
    editCount: 234,
    status: 'active',
  },
  {
    id: 'user-004',
    email: 'ali.customer@example.com',
    name: 'Ali Mahmoud',
    nameAr: 'علي محمود',
    phone: '+963 914 567 890',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: 'customer',
    isAdmin: false,
    isSuperAdmin: false,
    registeredAt: new Date('2025-12-10'),
    lastLogin: new Date('2026-02-16'),
    totalOrders: 5,
    totalSpent: 15000,
    status: 'active',
  },
  {
    id: 'user-005',
    email: 'fatima@example.com',
    name: 'Fatima Omar',
    nameAr: 'فاطمة عمر',
    phone: '+963 915 678 901',
    avatar: 'https://i.pravatar.cc/150?img=9',
    role: 'customer',
    isAdmin: false,
    isSuperAdmin: false,
    registeredAt: new Date('2026-01-05'),
    lastLogin: new Date('2026-02-15'),
    totalOrders: 2,
    totalSpent: 8000,
    status: 'active',
  },
];

// Helper functions
export const getUserById = (userId: string): User | undefined => {
  return usersData.find(user => user.id === userId);
};

export const getAdminUsers = (): User[] => {
  return usersData.filter(user => user.isAdmin);
};

export const getCustomerUsers = (): User[] => {
  return usersData.filter(user => !user.isAdmin);
};

export const hasPrivilege = (user: User, privilege: string): boolean => {
  if (user.isSuperAdmin) return true;
  
  const parts = privilege.split('.');
  let current: any = user.privileges;
  
  for (const part of parts) {
    if (!current || !current[part]) return false;
    current = current[part];
  }
  
  return current === true;
};

export const canEditCategory = (user: User, categoryId: string): boolean => {
  if (user.isSuperAdmin) return true;
  if (!user.privileges?.categories.edit) return false;
  
  const allowed = user.privileges.categories.allowedCategories;
  return allowed.includes('all') || allowed.includes(categoryId);
};

export const canEditBrand = (user: User, brandId: string): boolean => {
  if (user.isSuperAdmin) return true;
  if (!user.privileges?.brands.edit) return false;
  
  const allowed = user.privileges.brands.allowedBrands;
  return allowed.includes('all') || allowed.includes(brandId);
};
