import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Calendar, User, Edit3, TrendingUp, TrendingDown, Image as ImageIcon } from "lucide-react";
import { fetchAdminActions } from "../../api/adminDataApi";

interface ProductEditHistoryProps {
  product: any;
  language: "ar" | "en";
  onClose: () => void;
}

export function ProductEditHistory({ product, language, onClose }: ProductEditHistoryProps) {
  const isRTL = language === "ar";
  const [adminActions, setAdminActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminActions()
      .then((rows) => {
        setAdminActions(rows || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to load admin actions", err);
        setError(isRTL ? "تعذر تحميل سجل التعديلات." : "Failed to load edit history.");
        setIsLoading(false);
      });
  }, []);
  
  // Get edit history for this product
  const editHistory = adminActions
    .filter(action => String(action.targetId) === String(product.id) && action.targetType === 'product')
    .sort((a, b) => new Date(b.createdAt || b.timestamp || 0).getTime() - new Date(a.createdAt || a.timestamp || 0).getTime());

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
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {isRTL ? "تاريخ التعديلات" : "Edit History"}
              </h2>
              <p className="text-blue-100">
                {isRTL ? product.nameAr : product.name}
              </p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">{error}</div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={`history-skeleton-${idx}`} className="bg-gray-50 rounded-xl p-4 skeleton-card">
                  <div className="h-5 w-40 shimmer-surface skeleton-line rounded mb-3" />
                  <div className="h-4 w-full shimmer-surface skeleton-line rounded mb-2" />
                  <div className="h-4 w-3/4 shimmer-surface skeleton-line rounded" />
                </div>
              ))}
            </div>
          ) : editHistory.length === 0 ? (
            <div className="text-center py-12">
              <Edit3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {isRTL ? "لا توجد تعديلات" : "No edit history available"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {editHistory.map((action, index) => (
                <motion.div
                  key={action.actionId}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline line */}
                  {index < editHistory.length - 1 && (
                    <div className={`absolute top-12 ${isRTL ? 'right-6' : 'left-6'} w-0.5 h-full bg-gray-200`} />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      action.actionType === 'edit' ? 'bg-blue-100' :
                      action.actionType === 'add' ? 'bg-green-100' :
                      action.actionType === 'delete' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      <Edit3 className={`w-6 h-6 ${
                        action.actionType === 'edit' ? 'text-blue-600' :
                        action.actionType === 'add' ? 'text-green-600' :
                        action.actionType === 'delete' ? 'text-red-600' :
                        'text-yellow-600'
                      }`} />
                    </div>

                    {/* Edit details */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-800">
                              {isRTL ? action.adminNameAr : action.adminName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {isRTL 
                                ? action.actionType === 'edit' ? 'عدّل' :
                                  action.actionType === 'add' ? 'أضاف' :
                                  action.actionType === 'delete' ? 'حذف' :
                                  'غيّر'
                                : action.actionType === 'edit' ? 'edited' :
                                  action.actionType === 'add' ? 'added' :
                                  action.actionType === 'delete' ? 'deleted' :
                                  'changed'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(action.createdAt || action.timestamp || Date.now()).toLocaleString(isRTL ? 'ar-SY' : 'en-US')}
                            </span>
                          </div>
                        </div>
                        {action.duration && (
                          <span className="text-xs text-gray-500">
                            {Math.round(action.duration / 1000)}s
                          </span>
                        )}
                      </div>

                      {/* Changes */}
                      {action.changes && action.changes.length > 0 && (
                        <div className="space-y-3">
                          {action.changes.map((change, changeIndex) => (
                            <div key={changeIndex} className="border-t border-gray-200 pt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                {isRTL ? getFieldNameAr(change.field) : getFieldNameEn(change.field)}
                              </p>
                              
                              {change.field === 'image' || change.field === 'images' ? (
                                <div className="flex items-center gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">{isRTL ? 'قبل' : 'Before'}</p>
                                    <img 
                                      src={change.oldValue || 'https://via.placeholder.com/80'} 
                                      alt="Before" 
                                      className="w-20 h-20 rounded object-cover border-2 border-red-200"
                                    />
                                  </div>
                                  <TrendingUp className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">{isRTL ? 'بعد' : 'After'}</p>
                                    <img 
                                      src={change.newValue || 'https://via.placeholder.com/80'} 
                                      alt="After" 
                                      className="w-20 h-20 rounded object-cover border-2 border-green-200"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-xs text-red-600 mb-1 flex items-center gap-1">
                                      <TrendingDown className="w-3 h-3" />
                                      {isRTL ? 'القيمة السابقة' : 'Old Value'}
                                    </p>
                                    <p className="text-sm text-gray-800 font-mono">
                                      {formatValue(change.oldValue)}
                                    </p>
                                  </div>
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      {isRTL ? 'القيمة الجديدة' : 'New Value'}
                                    </p>
                                    <p className="text-sm text-gray-800 font-mono">
                                      {formatValue(change.newValue)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {action.notes && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-600 mb-1">{isRTL ? 'ملاحظات' : 'Notes'}</p>
                          <p className="text-sm text-gray-700">{action.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper functions
function getFieldNameEn(field: string): string {
  const fieldNames: Record<string, string> = {
    price: 'Price',
    discount: 'Discount',
    name: 'Product Name',
    description: 'Description',
    stock: 'Stock Quantity',
    category: 'Category',
    brand: 'Brand',
    image: 'Product Image',
    images: 'Product Images',
    specifications: 'Specifications',
    status: 'Status',
  };
  return fieldNames[field] || field;
}

function getFieldNameAr(field: string): string {
  const fieldNames: Record<string, string> = {
    price: 'السعر',
    discount: 'الخصم',
    name: 'اسم المنتج',
    description: 'الوصف',
    stock: 'الكمية',
    category: 'الفئة',
    brand: 'العلامة التجارية',
    image: 'صورة المنتج',
    images: 'صور المنتج',
    specifications: 'المواصفات',
    status: 'الحالة',
  };
  return fieldNames[field] || field;
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}
