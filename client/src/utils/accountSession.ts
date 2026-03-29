export type AccountAccess = {
  isAuthed: boolean;
  isAdminRole: boolean;
  isSuperAdmin: boolean;
  permissionsResolved: boolean;
  adminMeta: any;
  canManageStore: boolean;
  canManageBanners: boolean;
  canManageOrders: boolean;
  hasAnyAdminAccess: boolean;
};

export function saveSession(data: any) {
  localStorage.setItem("session", JSON.stringify(data));
}

export function loadSession() {
  const raw = localStorage.getItem("session");
  return raw ? JSON.parse(raw) : null;
}

export function getAccountAccess(user: any): AccountAccess {
  const isAuthed = Boolean(user);
  const isSuperAdmin = user?.role === "super_admin";
  const isAdminRole = user?.role === "admin" || isSuperAdmin;
  const adminMeta = user?.adminMeta || {};
  const permissionsResolved = !isAdminRole || isSuperAdmin || Boolean(user?.adminMeta);

  if (isSuperAdmin) {
    return {
      isAuthed,
      isAdminRole,
      isSuperAdmin,
      permissionsResolved: true,
      adminMeta,
      canManageStore: true,
      canManageBanners: true,
      canManageOrders: true,
      hasAnyAdminAccess: true,
    };
  }

  const canManageOrders = Boolean(adminMeta?.canManageOrders);
  const canManageBanners = Boolean(adminMeta?.canManageBanners);
  const canManageStore =
    isAdminRole &&
    (Boolean(adminMeta?.allowAllCategories) ||
      Boolean(adminMeta?.allowAllBrands) ||
      (Array.isArray(adminMeta?.allowedCategoryIds) &&
        adminMeta.allowedCategoryIds.length > 0) ||
      (Array.isArray(adminMeta?.allowedBrandIds) &&
        adminMeta.allowedBrandIds.length > 0));

  return {
    isAuthed,
    isAdminRole,
    isSuperAdmin,
    permissionsResolved,
    adminMeta,
    canManageStore,
    canManageBanners,
    canManageOrders,
    hasAnyAdminAccess: Boolean(canManageStore || canManageBanners || canManageOrders),
  };
}
