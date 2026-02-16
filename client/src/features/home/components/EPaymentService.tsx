import { useState } from "react";
import { X, CreditCard, Search, Building2, Zap } from "lucide-react";
import { paymentCompanies } from "../../../data/servicesData";
interface EPaymentServiceProps {
  language: "ar" | "en";
  onClose: () => void;
}

export function EPaymentService({ language, onClose }: EPaymentServiceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const t = {
    ar: {
      title: "الدفع الإلكتروني",
      subtitle: "ادفع فواتيرك من خلال صالات العرض",
      search: "ابحث عن شركة...",
      allCategories: "كل الفئات",
      availableCompanies: "الشركات المتاحة",
      visitShowroom: "قم بزيارة أقرب صالة عرض للدفع",
      callUs: "أو اتصل بنا",
    },
    en: {
      title: "E-Payment",
      subtitle: "Pay your bills through our showrooms",
      search: "Search for a company...",
      allCategories: "All Categories",
      availableCompanies: "Available Companies",
      visitShowroom: "Visit the nearest showroom to pay",
      callUs: "Or call us",
    },
  };

  const categories = [
    ...new Set(paymentCompanies.map((c) => c.categoryAr)),
  ];

  const filteredCompanies = paymentCompanies.filter((company) => {
    const matchesSearch =
      searchQuery === "" ||
      company.nameAr.includes(searchQuery) ||
      company.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || company.categoryAr === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
        style={{ zIndex: 2000 }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-t-2xl flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t[language].title}</h2>
                <p className="text-green-100">{t[language].subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all hover:scale-110 active:scale-95 flex-shrink-0 shadow-lg border-2 border-white/30"
              aria-label="Close"
              title={language === "ar" ? "إغلاق" : "Close"}
            >
              <X className="w-7 h-7 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t[language].search}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
            >
              <option value="all">{t[language].allCategories}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t[language].availableCompanies} ({filteredCompanies.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-green-500 hover:shadow-lg transition-all text-center group"
                >
                  <div
                    className={`w-16 h-16 ${company.color} rounded-xl flex items-center justify-center text-3xl mx-auto mb-2 group-hover:scale-110 transition-transform`}
                  >
                    {company.logo}
                  </div>
                  <p className="font-bold text-gray-900 text-sm">
                    {language === "ar" ? company.nameAr : company.nameEn}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "ar" ? company.categoryAr : company.category}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
            <Building2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="font-bold text-green-900 mb-2">{t[language].visitShowroom}</p>
            <p className="text-green-700">
              {t[language].callUs}: <span className="font-bold">+963 933 123 4567</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}