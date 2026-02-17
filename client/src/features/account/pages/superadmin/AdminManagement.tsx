import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Search, Shield, Crown, UserPlus, Edit3, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { fetchAdminUsers } from "../../api/adminDataApi";
import { AdminPrivilegesEditor } from "./AdminPrivilegesEditor";

interface AdminManagementProps {
  language: "ar" | "en";
  onBack: () => void;
}

interface User {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "super_admin";
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  adminLevel?: string;
  status?: string;
  registeredAt?: string;
  editCount?: number;
  totalOrders?: number;
  avatar?: string;
}

export function AdminManagement({ language, onBack }: AdminManagementProps) {
  const isRTL = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<'all' | 'customer' | 'admin' | 'super_admin'>('all');
  const [usersData, setUsersData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [privilegesModalOpen, setPrivilegesModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = () => {
    setIsLoading(true);
    setError(null);
    fetchAdminUsers()
      .then((rows) => {
        const normalized = (rows || []).map((u: any) => ({
          ...u,
          id: String(u._id || u.id),
          name: String(u.name || ""),
          nameAr: String(u.nameAr || u.name || ""),
          email: String(u.email || ""),
          isAdmin: u.role === "admin" || u.role === "super_admin",
          isSuperAdmin: u.role === "super_admin",
        }));
        setUsersData(normalized);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to load users", err);
        setError(isRTL ? "تعذر تحميل المستخدمين." : "Failed to load users.");
        setUsersData([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users
  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.nameAr.includes(searchQuery) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handlePromoteToAdmin = (user: User) => {
    setSelectedUser(user);
    setPrivilegesModalOpen(true);
  };

  const handleEditPrivileges = (user: User) => {
    setSelectedUser(user);
    setPrivilegesModalOpen(true);
  };

  const handleRevokeAdmin = (user: User) => {
    if (confirm(isRTL 
      ? `هل أنت متأكد من إلغاء صلاحيات المدير لـ ${user.nameAr}؟`
      : `Are you sure you want to revoke admin privileges for ${user.name}?`)) {
      // In real app, update the user role
      alert(isRTL ? "تم إلغاء الصلاحيات بنجاح" : "Privileges revoked successfully");
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="mb-4 text-purple-100 hover:text-white flex items-center gap-2"
          >
            <span>{isRTL ? "→" : "←"}</span>
            <span>{isRTL ? "العودة" : "Back"}</span>
          </button>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {isRTL ? "إدارة المديرين" : "Admin Management"}
              </h1>
              <p className="text-purple-100 text-sm mt-1">
                {isRTL ? "تعيين وإدارة صلاحيات المديرين" : "Assign and manage admin privileges"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadUsers} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700">
              {isRTL ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`users-skeleton-${idx}`} className="bg-white rounded-xl shadow-lg p-6 skeleton-card">
                <div className="h-5 w-28 shimmer-surface skeleton-line rounded mb-3" />
                <div className="h-10 w-20 shimmer-surface rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={isRTL ? "البحث بالاسم أو البريد الإلكتروني..." : "Search by name or email..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">{isRTL ? "جميع المستخدمين" : "All Users"}</option>
              <option value="customer">{isRTL ? "العملاء" : "Customers"}</option>
              <option value="admin">{isRTL ? "المديرون" : "Admins"}</option>
              <option value="super_admin">{isRTL ? "السوبر أدمن" : "Super Admins"}</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? "إجمالي المستخدمين" : "Total Users"}</p>
                <p className="text-3xl font-bold text-gray-800">{usersData.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? "المديرون" : "Admins"}</p>
                <p className="text-3xl font-bold text-gray-800">
                  {usersData.filter(u => u.isAdmin && !u.isSuperAdmin).length}
                </p>
              </div>
              <Shield className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? "السوبر أدمن" : "Super Admins"}</p>
                <p className="text-3xl font-bold text-gray-800">
                  {usersData.filter(u => u.isSuperAdmin).length}
                </p>
              </div>
              <Crown className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {isRTL ? "المستخدمون" : "Users"}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredUsers.length})
              </span>
            </h2>
          </div>
          
          {!isLoading && <div className="divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <img
                      src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {isRTL ? user.nameAr : user.name}
                        </h3>
                        {user.isSuperAdmin && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            {isRTL ? "سوبر أدمن" : "Super Admin"}
                          </span>
                        )}
                        {user.isAdmin && !user.isSuperAdmin && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {isRTL ? "مدير" : "Admin"}
                            {user.adminLevel && (
                              <span className="ml-1">
                                ({isRTL 
                                  ? user.adminLevel === 'junior' ? 'مبتدئ' : user.adminLevel === 'senior' ? 'محترف' : 'متقدم'
                                  : user.adminLevel})
                              </span>
                            )}
                          </span>
                        )}
                        {user.status === 'suspended' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {isRTL ? "موقوف" : "Suspended"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          {isRTL ? "انضم: " : "Joined: "}
                          {new Date(user.registeredAt).toLocaleDateString(isRTL ? 'ar-SY' : 'en-US')}
                        </span>
                        {user.isAdmin && user.editCount && (
                          <span>
                            {isRTL ? "التعديلات: " : "Edits: "}
                            {user.editCount}
                          </span>
                        )}
                        {!user.isAdmin && (
                          <span>
                            {isRTL ? "الطلبات: " : "Orders: "}
                            {user.totalOrders}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!user.isSuperAdmin && (
                    <div className="flex items-center gap-2">
                      {!user.isAdmin ? (
                        <button
                          onClick={() => handlePromoteToAdmin(user)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          {isRTL ? "ترقية إلى مدير" : "Promote to Admin"}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditPrivileges(user)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            {isRTL ? "تعديل الصلاحيات" : "Edit Privileges"}
                          </button>
                          <button
                            onClick={() => handleRevokeAdmin(user)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            {isRTL ? "إلغاء الصلاحيات" : "Revoke Admin"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>}
        </div>
      </div>

      {/* Privileges Editor Modal */}
      <AnimatePresence>
        {privilegesModalOpen && selectedUser && (
          <AdminPrivilegesEditor
            user={selectedUser}
            language={language}
            onClose={() => {
              setPrivilegesModalOpen(false);
              setSelectedUser(null);
            }}
            onSave={(updatedUser) => {
              // In real app, save to backend
              alert(isRTL ? "تم حفظ الصلاحيات بنجاح" : "Privileges saved successfully");
              setPrivilegesModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
