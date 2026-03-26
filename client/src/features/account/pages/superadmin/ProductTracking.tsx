import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, Search, Eye, EyeOff, Lock, Unlock, Calendar, User, Edit3, AlertCircle } from "lucide-react";
import { ProductEditHistory } from "./ProductEditHistory";
import { fetchAdminActions, fetchAdminUsers } from "../../api/adminDataApi";

interface ProductTrackingProps {
  language: "ar" | "en";
  onBack: () => void;
}

interface ProductEdit {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  lastEditedBy: string;
  lastEditedByAr: string;
  lastEditedAt: Date;
  editCount: number;
  isHidden: boolean;
  hideReason?: string;
}

export function ProductTracking({ language, onBack }: ProductTrackingProps) {
  const isRTL = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<'all' | 'hidden' | 'visible'>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductEdit | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [productEdits, setProductEdits] = useState<ProductEdit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [{ fetchAdminActions, fetchAdminUsers }] = await Promise.all([
          import("../../api/adminDataApi"),
        ]);

        const [actions, users] = await Promise.all([
          fetchAdminActions(),
          fetchAdminUsers(),
        ]);

        const userMap = new Map<string, any>();
        (users || []).forEach((u: any) => {
          const key = String(u._id || u.id || "");
          if (key) userMap.set(key, u);
        });

        const productActions = (actions || []).filter((a: any) => a?.targetType === "product");
        const grouped = new Map<string, any[]>();
        productActions.forEach((a: any) => {
          const key = String(a?.targetId || "");
          if (!key) return;
          const list = grouped.get(key) || [];
          list.push(a);
          grouped.set(key, list);
        });

        const productIds = Array.from(grouped.keys()).slice(0, 200);
        const products = await Promise.all(
          productIds.map((id) =>
            fetch(`${apiBase}/products/${encodeURIComponent(id)}`)
              .then((res) => (res.ok ? res.json() : null))
              .then((json) => json?.data ?? null)
              .catch(() => null),
          ),
        );

        const editRows: ProductEdit[] = products
          .filter(Boolean)
          .map((prod: any) => {
            const key = String(prod._id || prod.id || prod.stk_code || "");
            const list = grouped.get(key) || [];
            const sorted = [...list].sort((a: any, b: any) => {
              const ta = new Date(a?.createdAt || 0).getTime();
              const tb = new Date(b?.createdAt || 0).getTime();
              return tb - ta;
            });
            const latest = sorted[0];
            const actor = latest ? userMap.get(String(latest.actorUserId || "")) : null;
            return {
              id: key,
              name: prod.name || prod.nameEn || prod.stk_code || "",
              nameAr: prod.nameAr || prod.name || "",
              image: prod.image || "",
              lastEditedBy: actor?.name || actor?.email || "System",
              lastEditedByAr: actor?.nameAr || actor?.name || "System",
              lastEditedAt: latest?.createdAt ? new Date(latest.createdAt) : new Date(),
              editCount: list.length || 0,
              isHidden: Boolean(prod?.status?.isHidden),
              hideReason: prod?.availability?.hiddenReason || "",
            };
          });

        if (!mounted) return;
        setProductEdits(editRows);
      } catch (err: any) {
        if (!mounted) return;
        setProductEdits([]);
        setLoadError(isRTL ? "Failed to load activity log" : "Failed to load activity log");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [isRTL]);

  const filteredProducts = productEdits.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.nameAr.includes(searchQuery);
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'hidden' && product.isHidden) ||
                         (filterBy === 'visible' && !product.isHidden);
    return matchesSearch && matchesFilter;
  });

  const handleToggleVisibility = (productId: string) => {
    // In real app, update backend
    alert(isRTL ? "تم تحديث ظهور المنتج" : "Product visibility updated");
  };

  const handleViewHistory = (product: ProductEdit) => {
    setSelectedProduct(product);
    setHistoryModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="mb-4 text-blue-100 hover:text-white flex items-center gap-2"
          >
            <span>{isRTL ? "→" : "←"}</span>
            <span>{isRTL ? "العودة" : "Back"}</span>
          </button>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {isRTL ? "تتبع المنتجات" : "Product Tracking"}
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                {isRTL ? "عرض تعديلات المنتجات والمحررين" : "View product edits and editors"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
              <input
                type="text"
                placeholder={isRTL ? "البحث بالمنتج..." : "Search by product..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{isRTL ? "جميع المنتجات" : "All Products"}</option>
              <option value="visible">{isRTL ? "الظاهرة" : "Visible"}</option>
              <option value="hidden">{isRTL ? "المخفية" : "Hidden"}</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? "إجمالي المنتجات" : "Total Products"}</p>
                <p className="text-3xl font-bold text-gray-800">{productEdits.length}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? "المنتجات المخفية" : "Hidden Products"}</p>
                <p className="text-3xl font-bold text-gray-800">
                  {productEdits.filter(p => p.isHidden).length}
                </p>
              </div>
              <EyeOff className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? "إجمالي التعديلات" : "Total Edits"}</p>
                <p className="text-3xl font-bold text-gray-800">
                  {productEdits.reduce((sum, p) => sum + p.editCount, 0)}
                </p>
              </div>
              <Edit3 className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {isRTL ? "المنتجات المعدّلة" : "Edited Products"}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredProducts.length})
              </span>
            </h2>
          </div>

          {isLoading && (
            <div className="p-6 text-center text-gray-500">
              {isRTL ? "جارٍ تحميل السجل..." : "Loading activity log..."}
            </div>
          )}

          {loadError && !isLoading && (
            <div className="p-6 text-center text-red-600">
              {loadError}
            </div>
          )}

          {!isLoading && !loadError && (
            <div className="divide-y divide-gray-200">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    {product.isHidden && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <EyeOff className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {isRTL ? product.nameAr : product.name}
                      </h3>
                      {product.isHidden && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          {isRTL ? "مخفي" : "Hidden"}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          {isRTL ? product.lastEditedByAr : product.lastEditedBy}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(product.lastEditedAt).toLocaleDateString(isRTL ? 'ar-SY' : 'en-US')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        <span>
                          {product.editCount} {isRTL ? 'تعديل' : 'edits'}
                        </span>
                      </div>
                    </div>

                    {product.hideReason && (
                      <div className="flex items-start gap-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{product.hideReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewHistory(product)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      {isRTL ? "تاريخ التعديلات" : "Edit History"}
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(product.id)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        product.isHidden
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {product.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {isRTL 
                        ? (product.isHidden ? 'إظهار' : 'إخفاء')
                        : (product.isHidden ? 'Show' : 'Hide')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Edit History Modal */}
      <AnimatePresence>
        {historyModalOpen && selectedProduct && (
          <ProductEditHistory
            product={selectedProduct}
            language={language}
            onClose={() => {
              setHistoryModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
