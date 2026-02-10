import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  CreditCard,
} from "lucide-react";
import translations from "../../../i18n/translations";

interface InvoicesPageProps {
  language: "ar" | "en";
  onBack: () => void;
}


// Mock invoices data
const mockInvoices = [
  {
    id: "INV-1001",
    orderNumber: 1001,
    date: "2026-01-15",
    amount: 2850000,
    status: "paid",
  },
  {
    id: "INV-1002",
    orderNumber: 1002,
    date: "2026-01-10",
    amount: 1250000,
    status: "paid",
  },
  {
    id: "INV-983",
    orderNumber: 983,
    date: "2025-12-28",
    amount: 4200000,
    status: "paid",
  },
  {
    id: "INV-856",
    orderNumber: 856,
    date: "2025-12-15",
    amount: 890000,
    status: "paid",
  },
];

export function InvoicesPage({ language, onBack }: InvoicesPageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#009FE3] to-[#007BC7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            {language === "ar" ? (
              <>
                <span>{t.account_invoices_back}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>{t.account_invoices_back}</span>
              </>
            )}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">{t.account_invoices_title}</h1>
          <p className="text-white/90 mt-2">
            {mockInvoices.length} {t.account_invoices_all}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mockInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_invoices_none}</h3>
            <p className="text-gray-600">{t.account_invoices_none_desc}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className={`px-6 py-4 text-sm font-semibold text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t.account_invoices_invoice_number}
                    </th>
                    <th
                      className={`px-6 py-4 text-sm font-semibold text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t.account_invoices_order_number}
                    </th>
                    <th
                      className={`px-6 py-4 text-sm font-semibold text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t.account_invoices_date}
                    </th>
                    <th
                      className={`px-6 py-4 text-sm font-semibold text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t.account_invoices_amount}
                    </th>
                    <th
                      className={`px-6 py-4 text-sm font-semibold text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t.account_invoices_status}
                    </th>
                    <th
                      className={`px-6 py-4 text-sm font-semibold text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t.account_invoices_actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td
                        className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        <span className="font-semibold text-gray-900">{invoice.id}</span>
                      </td>
                      <td
                        className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        <span className="text-gray-700">#{invoice.orderNumber}</span>
                      </td>
                      <td
                        className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{invoice.date}</span>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        <span className="font-semibold text-gray-900">
                          {invoice.amount.toLocaleString()} {language === "ar" ? "ل.س" : "SYP"}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          {{
                          paid: t.account_invoices_paid,
                          pending: t.account_invoices_pending,
                        }[invoice.status]}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-[#009FE3] hover:bg-[#009FE3]/10 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {mockInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={language === "ar" ? "text-right" : "text-left"}>
                      <p className="text-sm text-gray-600 mb-1">{t.account_invoices_invoice_number}</p>
                      <p className="font-bold text-gray-900">{invoice.id}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {{
                          paid: t.account_invoices_paid,
                          pending: t.account_invoices_pending,
                        }[invoice.status]}
                    </span>
                  </div>

                  <div
                    className={`space-y-2 mb-4 text-sm ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_invoices_order_number}:</span>
                      <span className="font-medium text-gray-900">#{invoice.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_invoices_date}:</span>
                      <span className="font-medium text-gray-900">{invoice.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.account_invoices_amount}:</span>
                      <span className="font-bold text-[#009FE3]">
                        {invoice.amount.toLocaleString()} {language === "ar" ? "ل.س" : "SYP"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button className="flex-1 border-2 border-[#009FE3] text-[#009FE3] px-4 py-2 rounded-lg hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm">
                      <Eye className="w-4 h-4" />
                      {t.account_invoices_view}
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm">
                      <Download className="w-4 h-4" />
                      {t.account_invoices_download}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
