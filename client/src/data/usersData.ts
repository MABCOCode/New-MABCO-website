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
export const usersData: User[] = [];

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
