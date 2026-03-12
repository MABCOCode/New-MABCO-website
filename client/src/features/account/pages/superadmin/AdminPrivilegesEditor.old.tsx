import { useState } from "react";
import { motion } from "motion/react";
import { X, Check, Shield, Package, Tag, Briefcase, ShoppingCart, Gift, FileText } from "lucide-react";

type UserPrivileges = {
  products: { view: boolean; edit: boolean; add: boolean; delete: boolean; hide: boolean; manageImages: boolean };
  categories: { allowedCategories: string[]; edit: boolean; add: boolean; delete: boolean };
  brands: { allowedBrands: string[]; edit: boolean; add: boolean; delete: boolean };
  orders: { view: boolean; updateStatus: boolean; cancel: boolean; refund: boolean };
  offers: { create: boolean; edit: boolean; delete: boolean };
  content: { homepage: boolean; services: boolean; blog: boolean; slider: boolean };
};

type User = {
  id: string;
  name: string;
  nameAr: string;
  role: "customer" | "admin" | "super_admin";
  adminLevel?: "junior" | "senior" | "lead";
  privileges?: UserPrivileges;
  isAdmin?: boolean;
};

interface AdminPrivilegesEditorProps {
  user: User;
  language: "ar" | "en";
  onClose: () => void;
  onSave: (user: User) => void;
}

export function AdminPrivilegesEditor({ user, language, onClose, onSave }: AdminPrivilegesEditorProps) {
  const isRTL = language === "ar";
  const [adminLevel, setAdminLevel] = useState<'junior' | 'senior' | 'lead'>(user.adminLevel || 'junior');
  
  // Initialize privileges
  const defaultPrivileges: UserPrivileges = {
    products: { view: true, edit: false, add: false, delete: false, hide: false, manageImages: false },
    categories: { allowedCategories: [], edit: false, add: false, delete: false },
    brands: { allowedBrands: [], edit: false, add: false, delete: false },
    orders: { view: true, updateStatus: false, cancel: false, refund: false },
    offers: { create: false, edit: false, delete: false },
    content: { homepage: false, services: false, blog: false, slider: false },
  };

  const [privileges, setPrivileges] = useState<UserPrivileges>(user.privileges || defaultPrivileges);

  // Available categories and brands
  const categories = [
    { id: 'mobiles', nameAr: 'موبايلات', nameEn: 'Mobiles' },
    { id: 'laptops', nameAr: 'لابتوبات', nameEn: 'Laptops' },
    { id: 'tablets', nameAr: 'تابلت', nameEn: 'Tablets' },
    { id: 'watches', nameAr: 'ساعات ذكية', nameEn: 'Smart Watches' },
    { id: 'headphones', nameAr: 'سماعات', nameEn: 'Headphones' },
    { id: 'gaming', nameAr: 'ألعاب', nameEn: 'Gaming' },
  ];

  const brands = [
    { id: 'apple', nameAr: 'آبل', nameEn: 'Apple' },
    { id: 'samsung', nameAr: 'سامسونج', nameEn: 'Samsung' },
    { id: 'huawei', nameAr: 'هواوي', nameEn: 'Huawei' },
    { id: 'xiaomi', nameAr: 'شاومي', nameEn: 'Xiaomi' },
    { id: 'sony', nameAr: 'سوني', nameEn: 'Sony' },
  ];

  const handleLevelChange = (level: 'junior' | 'senior' | 'lead') => {
    setAdminLevel(level);
    
    // Auto-set privileges based on level
    if (level === 'junior') {
      setPrivileges({
        products: { view: true, edit: true, add: false, delete: false, hide: false, manageImages: true },
        categories: { allowedCategories: [], edit: true, add: false, delete: false },
        brands: { allowedBrands: [], edit: true, add: false, delete: false },
        orders: { view: true, updateStatus: true, cancel: false, refund: false },
        offers: { create: false, edit: false, delete: false },
        content: { homepage: false, services: false, blog: false, slider: false },
      });
    } else if (level === 'senior') {
      setPrivileges({
        products: { view: true, edit: true, add: true, delete: true, hide: true, manageImages: true },
        categories: { allowedCategories: ['all'], edit: true, add: true, delete: false },
        brands: { allowedBrands: ['all'], edit: true, add: true, delete: false },
        orders: { view: true, updateStatus: true, cancel: true, refund: false },
        offers: { create: true, edit: true, delete: true },
        content: { homepage: true, services: true, blog: true, slider: false },
      });
    } else if (level === 'lead') {
      setPrivileges({
        products: { view: true, edit: true, add: true, delete: true, hide: true, manageImages: true },
        categories: { allowedCategories: ['all'], edit: true, add: true, delete: true },
        brands: { allowedBrands: ['all'], edit: true, add: true, delete: true },
        orders: { view: true, updateStatus: true, cancel: true, refund: true },
        offers: { create: true, edit: true, delete: true },
        content: { homepage: true, services: true, blog: true, slider: true },
      });
    }
  };

  const toggleCategoryAccess = (categoryId: string) => {
    const current = privileges.categories.allowedCategories;
    if (current.includes('all')) {
      setPrivileges({
        ...privileges,
        categories: { ...privileges.categories, allowedCategories: [categoryId] }
      });
    } else if (current.includes(categoryId)) {
      setPrivileges({
        ...privileges,
        categories: { ...privileges.categories, allowedCategories: current.filter(c => c !== categoryId) }
      });
    } else {
      setPrivileges({
        ...privileges,
        categories: { ...privileges.categories, allowedCategories: [...current, categoryId] }
      });
    }
  };

  const toggleBrandAccess = (brandId: string) => {
    const current = privileges.brands.allowedBrands;
    if (current.includes('all')) {
      setPrivileges({
        ...privileges,
        brands: { ...privileges.brands, allowedBrands: [brandId] }
      });
    } else if (current.includes(brandId)) {
      setPrivileges({
        ...privileges,
        brands: { ...privileges.brands, allowedBrands: current.filter(b => b !== brandId) }
      });
    } else {
      setPrivileges({
        ...privileges,
        brands: { ...privileges.brands, allowedBrands: [...current, brandId] }
      });
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      isAdmin: true,
      role: 'admin' as const,
      adminLevel,
      privileges,
    };
    onSave(updatedUser);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {isRTL ? "تعديل الصلاحيات" : "Edit Privileges"}
                </h2>
                <p className="text-purple-100 text-sm">
                  {isRTL ? user.nameAr : user.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Admin Level Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {isRTL ? "مستوى المدير" : "Admin Level"}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {['junior', 'senior', 'lead'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    adminLevel === level
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <Shield className={`w-8 h-8 mx-auto mb-2 ${
                      adminLevel === level ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <p className="font-semibold text-gray-800">
                      {isRTL 
                        ? level === 'junior' ? 'مبتدئ' : level === 'senior' ? 'محترف' : 'متقدم'
                        : level === 'junior' ? 'Junior' : level === 'senior' ? 'Senior' : 'Lead'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Product Management */}
            <PrivilegeSection
              icon={Package}
              title={isRTL ? "إدارة المنتجات" : "Product Management"}
              privileges={[
                { key: 'view', label: isRTL ? 'عرض المنتجات' : 'View Products', checked: privileges.products.view },
                { key: 'edit', label: isRTL ? 'تعديل المنتجات' : 'Edit Products', checked: privileges.products.edit },
                { key: 'add', label: isRTL ? 'إضافة منتجات' : 'Add Products', checked: privileges.products.add },
                { key: 'delete', label: isRTL ? 'حذف منتجات' : 'Delete Products', checked: privileges.products.delete },
                { key: 'hide', label: isRTL ? 'إخفاء منتجات' : 'Hide Products', checked: privileges.products.hide },
                { key: 'manageImages', label: isRTL ? 'إدارة الصور' : 'Manage Images', checked: privileges.products.manageImages },
              ]}
              onChange={(key, value) => setPrivileges({ ...privileges, products: { ...privileges.products, [key]: value } })}
            />

            {/* Category Management */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-bold text-gray-800">
                  {isRTL ? "إدارة الفئات" : "Category Management"}
                </h4>
              </div>
              
              <div className="space-y-3 mb-4">
                <Checkbox
                  label={isRTL ? 'تعديل الفئات' : 'Edit Categories'}
                  checked={privileges.categories.edit}
                  onChange={(checked) => setPrivileges({ ...privileges, categories: { ...privileges.categories, edit: checked } })}
                />
                <Checkbox
                  label={isRTL ? 'إضافة فئات' : 'Add Categories'}
                  checked={privileges.categories.add}
                  onChange={(checked) => setPrivileges({ ...privileges, categories: { ...privileges.categories, add: checked } })}
                />
                <Checkbox
                  label={isRTL ? 'حذف فئات' : 'Delete Categories'}
                  checked={privileges.categories.delete}
                  onChange={(checked) => setPrivileges({ ...privileges, categories: { ...privileges.categories, delete: checked } })}
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {isRTL ? "الفئات المسموحة:" : "Allowed Categories:"}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox
                    label={isRTL ? 'جميع الفئات' : 'All Categories'}
                    checked={privileges.categories.allowedCategories.includes('all')}
                    onChange={(checked) => setPrivileges({
                      ...privileges,
                      categories: { ...privileges.categories, allowedCategories: checked ? ['all'] : [] }
                    })}
                  />
                </div>
                {!privileges.categories.allowedCategories.includes('all') && (
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <Checkbox
                        key={cat.id}
                        label={isRTL ? cat.nameAr : cat.nameEn}
                        checked={privileges.categories.allowedCategories.includes(cat.id)}
                        onChange={() => toggleCategoryAccess(cat.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Brand Management */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-green-600" />
                <h4 className="text-lg font-bold text-gray-800">
                  {isRTL ? "إدارة العلامات التجارية" : "Brand Management"}
                </h4>
              </div>
              
              <div className="space-y-3 mb-4">
                <Checkbox
                  label={isRTL ? 'تعديل العلامات' : 'Edit Brands'}
                  checked={privileges.brands.edit}
                  onChange={(checked) => setPrivileges({ ...privileges, brands: { ...privileges.brands, edit: checked } })}
                />
                <Checkbox
                  label={isRTL ? 'إضافة علامات' : 'Add Brands'}
                  checked={privileges.brands.add}
                  onChange={(checked) => setPrivileges({ ...privileges, brands: { ...privileges.brands, add: checked } })}
                />
                <Checkbox
                  label={isRTL ? 'حذف علامات' : 'Delete Brands'}
                  checked={privileges.brands.delete}
                  onChange={(checked) => setPrivileges({ ...privileges, brands: { ...privileges.brands, delete: checked } })}
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {isRTL ? "العلامات المسموحة:" : "Allowed Brands:"}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox
                    label={isRTL ? 'جميع العلامات' : 'All Brands'}
                    checked={privileges.brands.allowedBrands.includes('all')}
                    onChange={(checked) => setPrivileges({
                      ...privileges,
                      brands: { ...privileges.brands, allowedBrands: checked ? ['all'] : [] }
                    })}
                  />
                </div>
                {!privileges.brands.allowedBrands.includes('all') && (
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map(brand => (
                      <Checkbox
                        key={brand.id}
                        label={isRTL ? brand.nameAr : brand.nameEn}
                        checked={privileges.brands.allowedBrands.includes(brand.id)}
                        onChange={() => toggleBrandAccess(brand.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Management */}
            <PrivilegeSection
              icon={ShoppingCart}
              title={isRTL ? "إدارة الطلبات" : "Order Management"}
              privileges={[
                { key: 'view', label: isRTL ? 'عرض الطلبات' : 'View Orders', checked: privileges.orders.view },
                { key: 'updateStatus', label: isRTL ? 'تحديث الحالة' : 'Update Status', checked: privileges.orders.updateStatus },
                { key: 'cancel', label: isRTL ? 'إلغاء الطلبات' : 'Cancel Orders', checked: privileges.orders.cancel },
                { key: 'refund', label: isRTL ? 'استرجاع المبالغ' : 'Process Refunds', checked: privileges.orders.refund },
              ]}
              onChange={(key, value) => setPrivileges({ ...privileges, orders: { ...privileges.orders, [key]: value } })}
            />

            {/* Offer Management */}
            <PrivilegeSection
              icon={Gift}
              title={isRTL ? "إدارة العروض" : "Offer Management"}
              privileges={[
                { key: 'create', label: isRTL ? 'إنشاء عروض' : 'Create Offers', checked: privileges.offers.create },
                { key: 'edit', label: isRTL ? 'تعديل العروض' : 'Edit Offers', checked: privileges.offers.edit },
                { key: 'delete', label: isRTL ? 'حذف العروض' : 'Delete Offers', checked: privileges.offers.delete },
              ]}
              onChange={(key, value) => setPrivileges({ ...privileges, offers: { ...privileges.offers, [key]: value } })}
            />

            {/* Content Management */}
            <PrivilegeSection
              icon={FileText}
              title={isRTL ? "إدارة المحتوى" : "Content Management"}
              privileges={[
                { key: 'homepage', label: isRTL ? 'تعديل الصفحة الرئيسية' : 'Edit Homepage', checked: privileges.content.homepage },
                { key: 'services', label: isRTL ? 'تعديل صفحات الخدمات' : 'Edit Service Pages', checked: privileges.content.services },
                { key: 'blog', label: isRTL ? 'إدارة المدونة' : 'Manage Blog', checked: privileges.content.blog },
                { key: 'slider', label: isRTL ? 'تعديل السلايدر الرئيسي' : 'Edit Main Slider', checked: privileges.content.slider },
              ]}
              onChange={(key, value) => setPrivileges({ ...privileges, content: { ...privileges.content, [key]: value } })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            {isRTL ? "حفظ الصلاحيات" : "Save Privileges"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper components
function PrivilegeSection({ icon: Icon, title, privileges, onChange }: any) {
  return (
    <div className="border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-purple-600" />
        <h4 className="text-lg font-bold text-gray-800">{title}</h4>
      </div>
      <div className="space-y-3">
        {privileges.map((priv: any) => (
          <Checkbox
            key={priv.key}
            label={priv.label}
            checked={priv.checked}
            onChange={(checked) => onChange(priv.key, checked)}
          />
        ))}
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}
