import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Shield, Check } from "lucide-react";
import { fetchCategories, fetchBrands } from "../../api/adminDataApi";

interface Category {
  _id: string;
  nameEn: string;
  nameAr: string;
}
interface Brand {
  _id: string;
  nameEn: string;
  nameAr: string;
  categoryIds: string[];
}

interface AdminMeta {
  allowAllCategories: boolean;
  allowAllBrands: boolean;
  allowedCategoryIds: string[];
  allowedBrandIds: string[];
  isSuspended: boolean;
  canManageOrders: boolean;
  canManageBanners: boolean;
}

interface User {
  id: string;
  name: string;
  nameAr: string;
  role: "customer" | "admin" | "super_admin";
  adminMeta?: AdminMeta;
  avatar?: string;
}

interface AdminPrivilegesEditorProps {
  user: User;
  language: "ar" | "en";
  onClose: () => void;
  onSave: (adminMeta: AdminMeta) => void;
}

export function AdminPrivilegesEditor({ user, language, onClose, onSave }: AdminPrivilegesEditorProps) {
  const isRTL = language === "ar";
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // initialize state from user.adminMeta or defaults
  const initialMeta: AdminMeta = {
    allowAllCategories: user.adminMeta?.allowAllCategories || false,
    allowAllBrands: user.adminMeta?.allowAllBrands || false,
    allowedCategoryIds: user.adminMeta?.allowedCategoryIds?.map(String) || [],
    allowedBrandIds: user.adminMeta?.allowedBrandIds?.map(String) || [],
    isSuspended: user.adminMeta?.isSuspended || false,
    canManageOrders: user.adminMeta?.canManageOrders || false,
    canManageBanners: user.adminMeta?.canManageBanners || false,
  };

  const [meta, setMeta] = useState<AdminMeta>(initialMeta);

  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then((rows) => {
        if (!mounted) return;
        const normalized = (rows || []).map((cat: any) => ({
          _id: String(cat.cat_code || cat._id),
          nameEn: cat.nameEn || cat.name || cat.name_ar || "",
          nameAr: cat.name || cat.nameAr || cat.name_ar || "",
        }));
        setCategories(normalized);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      });

    fetchBrands()
      .then((rows) => {
        if (!mounted) return;
        const normalized = (rows || []).map((brand: any) => ({
          _id: String(brand.brand_code || brand._id),
          nameEn: brand.englishName || brand.name || brand.name_en || "",
          nameAr: brand.name || brand.nameAr || brand.name_ar || "",
          categoryIds: Array.isArray(brand.categoryIds)
            ? brand.categoryIds.map(String)
            : [String(brand.category_code || brand.cat_code || "")].filter(Boolean),
        }));
        setBrands(normalized);
      })
      .catch(() => {
        if (mounted) setBrands([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const toggleCategory = (id: string) => {
    if (meta.allowAllCategories) return;
    setMeta((prev) => {
      const has = prev.allowedCategoryIds.includes(id);
      const allowed = has
        ? prev.allowedCategoryIds.filter((c) => c !== id)
        : [...prev.allowedCategoryIds, id];
      return { ...prev, allowedCategoryIds: allowed };
    });
  };

  const toggleBrand = (id: string) => {
    if (meta.allowAllBrands) return;
    setMeta((prev) => {
      const has = prev.allowedBrandIds.includes(id);
      let allowed = has
        ? prev.allowedBrandIds.filter((b) => b !== id)
        : [...prev.allowedBrandIds, id];

      // if adding a brand, also ensure its categories are added
      if (!has) {
        const brand = brands.find((b) => b._id === id);
        if (brand) {
          const catIds = brand.categoryIds.map(String);
          const newCatSet = new Set(prev.allowedCategoryIds);
          catIds.forEach((cid) => newCatSet.add(cid));
          allowed = [...allowed];
          return {
            ...prev,
            allowedBrandIds: allowed,
            allowedCategoryIds: [...newCatSet],
          };
        }
      }

      return { ...prev, allowedBrandIds: allowed };
    });
  };

  const handleSave = () => {
    onSave(meta);
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
        className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {isRTL ? "تعديل الصلاحيات" : "Edit Permissions"}
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {isRTL ? "الفئات المسموحة" : "Allowed Categories"}
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                id="allCats"
                checked={meta.allowAllCategories}
                onChange={(e) =>
                  setMeta((p) => ({
                    ...p,
                    allowAllCategories: e.target.checked,
                    allowedCategoryIds: e.target.checked ? [] : p.allowedCategoryIds,
                  }))
                }
              />
              <label htmlFor="allCats">
                {isRTL ? "جميع الفئات" : "All Categories"}
              </label>
            </div>
            {!meta.allowAllCategories && (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={meta.allowedCategoryIds.includes(cat._id)}
                      onChange={() => toggleCategory(cat._id)}
                      id={`cat-${cat._id}`}
                    />
                    <label htmlFor={`cat-${cat._id}`}>{isRTL ? cat.nameAr : cat.nameEn}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {isRTL ? "العلامات المسموحة" : "Allowed Brands"}
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                id="allBrands"
                checked={meta.allowAllBrands}
                onChange={(e) =>
                  setMeta((p) => ({
                    ...p,
                    allowAllBrands: e.target.checked,
                    allowedBrandIds: e.target.checked ? [] : p.allowedBrandIds,
                  }))
                }
              />
              <label htmlFor="allBrands">
                {isRTL ? "جميع العلامات" : "All Brands"}
              </label>
            </div>
            {!meta.allowAllBrands && (
              <div className="grid grid-cols-2 gap-2">
                {brands
                  .filter((b) =>
                    meta.allowAllCategories ||
                    meta.allowedCategoryIds.some((cid) =>
                      b.categoryIds.map(String).includes(cid),
                    ),
                  )
                  .map((brand) => (
                    <div key={brand._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={meta.allowedBrandIds.includes(brand._id)}
                        onChange={() => toggleBrand(brand._id)}
                        id={`brand-${brand._id}`}
                      />
                      <label htmlFor={`brand-${brand._id}`}>{isRTL ? brand.nameAr : brand.nameEn}</label>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Additional Permissions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {isRTL ? "صلاحيات إضافية" : "Additional Permissions"}
            </h3>
            <div className="flex items-center gap-4 mb-2">
              <input
                type="checkbox"
                id="perm-orders"
                checked={meta.canManageOrders}
                onChange={(e) =>
                  setMeta((p) => ({ ...p, canManageOrders: e.target.checked }))
                }
              />
              <label htmlFor="perm-orders">
                {isRTL ? "إدارة الطلبات" : "Manage Orders & Cart"}
              </label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="perm-banners"
                checked={meta.canManageBanners}
                onChange={(e) =>
                  setMeta((p) => ({ ...p, canManageBanners: e.target.checked }))
                }
              />
              <label htmlFor="perm-banners">
                {isRTL ? "تغيير بانر الصفحة الرئيسية" : "Manage Home Banner Images"}
              </label>
            </div>
          </div>

          {/* Suspension */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="suspend"
              checked={meta.isSuspended}
              onChange={(e) => setMeta((p) => ({ ...p, isSuspended: e.target.checked }))}
            />
            <label htmlFor="suspend">{isRTL ? "إيقاف المستخدم" : "Suspend User"}</label>
          </div>
        </div>

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
            <Check className="w-4 h-4" />
            {isRTL ? "حفظ" : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
