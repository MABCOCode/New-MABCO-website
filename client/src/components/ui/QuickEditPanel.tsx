import { AlertCircle, Edit3, Clock, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface QuickEditPanelProps {
  product: any;
  onEdit: () => void;
  onDismiss: () => void;
}

export function QuickEditPanel({ product, onEdit, onDismiss }: QuickEditPanelProps) {
  const { t, language } = useLanguage();

  const missingItems = [
    product.missingDescriptionEn && t("quickEdit.englishDesc"),
    product.missingDescriptionAr && t("quickEdit.arabicDesc"),
    product.missingImages && `${product.missingImages} ${t("quickEdit.moreImages")}`,
    product.missingSpecs && `${product.missingSpecs} ${t("quickEdit.specs")}`,
  ].filter(Boolean);

  if (missingItems.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slideInRight">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-500 p-6 max-w-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {t("quickEdit.quickEdit")}
            </h3>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {t("quickEdit.thisProductNeeds")}
        </p>

        <ul className="space-y-2 mb-4">
          {missingItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {t("quickEdit.addNow")}
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
