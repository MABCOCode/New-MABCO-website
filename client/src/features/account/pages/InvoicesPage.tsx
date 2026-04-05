import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Eye,
  Calendar,
  CreditCard,
  Printer,
  X,
  AlertCircle,
} from "lucide-react";
import translations from "../../../i18n/translations";
import { CURRENCY_LABEL } from "../../../utils/currency";
import { loadSession } from "../storage";

interface InvoicesPageProps {
  language: "ar" | "en";
  onBack: () => void;
}

interface InvoiceRow {
  id: string;
  date: string;
  amount: number;
  branch: string;
  status: "paid";
}

const normalizePhone = (raw: string) => {
  if (!raw) return "";
  let digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("963")) {
    digits = digits.slice(3);
  }
  if (digits.startsWith("9") && digits.length === 9) {
    digits = `0${digits}`;
  }
  if (digits.startsWith("09") && digits.length === 10) {
    return digits;
  }
  if (digits.length >= 8) {
    return `09${digits.slice(-8)}`;
  }
  return "";
};

const parseInvoiceAmount = (value: unknown) => {
  const numeric = Number.parseFloat(String(value ?? "0").replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatInvoiceDate = (value: string, language: "ar" | "en") => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(language === "ar" ? "ar-SY" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInvoiceImageUrl = (invoiceNo: string) =>
  `https://poss.mabcoonline.com/invoices_images/invoice_${encodeURIComponent(invoiceNo)}.png`;

export function InvoicesPage({ language, onBack }: InvoicesPageProps) {
  const t = translations[language];
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const session = loadSession() as any;
    const phone = normalizePhone(
      session?.user?.phone || session?.user?.mobile || session?.user?.phoneNumber || "",
    );

    if (!phone) {
      setInvoices([]);
      setIsLoading(false);
      setError(language === "ar" ? "رقم الهاتف غير صالح لعرض الفواتير." : "Phone number is invalid for loading invoices.");
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`https://showman2.mabcoonline.com:444/Service1.svc/getInvoiceHdr/${encodeURIComponent(phone)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load invoices");
        const json = await res.json();
        if (!mounted) return;

        const rows = Array.isArray(json?.GetInvoiceHdrResult)
          ? json.GetInvoiceHdrResult
          : json?.GetInvoiceHdrResult
            ? [json.GetInvoiceHdrResult]
            : [];

        const nextInvoices = rows
          .map((row: any) => ({
            id: String(row?.inv_no || row?.invoice_no || row?.invoiceNo || "").trim(),
            date: String(row?.trn_dt || row?.date || ""),
            amount: parseInvoiceAmount(row?.total_final_price ?? row?.total_price),
            branch: String(row?.loc_name || row?.loc_nameAr || row?.branch || "").trim(),
            status: "paid" as const,
          }))
          .filter((row: InvoiceRow) => row.id)
          .sort((a: InvoiceRow, b: InvoiceRow) => {
            const timeA = new Date(a.date).getTime();
            const timeB = new Date(b.date).getTime();
            return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
          });

        setInvoices(nextInvoices);
      })
      .catch(() => {
        if (!mounted) return;
        setInvoices([]);
        setError(language === "ar" ? "تعذر تحميل الفواتير." : "Failed to load invoices.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [language]);

  const totalLabel = useMemo(() => `${invoices.length} ${t.account_invoices_all}`, [invoices.length, t.account_invoices_all]);

  const resolveInvoiceImage = async (invoiceId: string) => {
    const imageUrl = getInvoiceImageUrl(invoiceId);
    const response = await fetch(imageUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error("Invoice image not found");
    }
    return imageUrl;
  };

  const handleViewInvoice = async (invoiceId: string) => {
    setActionLoadingId(invoiceId);
    setActionError(null);
    setSelectedImageUrl(null);
    setSelectedInvoiceId(null);

    try {
      const imageUrl = await resolveInvoiceImage(invoiceId);
      setSelectedInvoiceId(invoiceId);
      setSelectedImageUrl(imageUrl);
    } catch {
      setActionError(
        language === "ar"
          ? `تعذر العثور على صورة الفاتورة ${invoiceId}.`
          : `Could not load invoice image for ${invoiceId}.`,
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePrintInvoice = async (invoiceId: string) => {
    setActionLoadingId(invoiceId);
    setActionError(null);

    try {
      const imageUrl = await resolveInvoiceImage(invoiceId);
      const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");

      if (!printWindow) {
        throw new Error("Print window blocked");
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoiceId}</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: flex-start; background: #ffffff; }
              img { max-width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Invoice ${invoiceId}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch {
      setActionError(
        language === "ar"
          ? `تعذر طباعة الفاتورة ${invoiceId} لأن الصورة غير متوفرة.`
          : `Could not print invoice ${invoiceId} because the image is unavailable.`,
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <p className="text-white/90 mt-2">{totalLabel}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-gray-600">
            {language === "ar" ? "جاري تحميل الفواتير..." : "Loading invoices..."}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_invoices_none}</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.account_invoices_none}</h3>
            <p className="text-gray-600">{t.account_invoices_none_desc}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {t.account_invoices_invoice_number}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {t.account_invoices_date}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {language === "ar" ? "الفرع" : "Branch"}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {t.account_invoices_amount}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {t.account_invoices_status}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {t.account_invoices_actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <span className="font-semibold text-gray-900">{invoice.id}</span>
                      </td>
                      <td className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{formatInvoiceDate(invoice.date, language)}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-gray-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {invoice.branch || "-"}
                      </td>
                      <td className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <span className="font-semibold text-gray-900">
                          {invoice.amount.toLocaleString()} {CURRENCY_LABEL}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                          <CreditCard className="w-4 h-4" />
                          {t.account_invoices_paid}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewInvoice(invoice.id)}
                            disabled={actionLoadingId === invoice.id}
                            className="p-2 text-[#009FE3] hover:bg-[#009FE3]/10 rounded-lg transition-colors disabled:opacity-50"
                            title={t.account_invoices_view}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(invoice.id)}
                            disabled={actionLoadingId === invoice.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title={language === "ar" ? "طباعة الفاتورة" : "Print Invoice"}
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {invoices.map((invoice, index) => (
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
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                      {t.account_invoices_paid}
                    </span>
                  </div>

                  <div className={`space-y-2 mb-4 text-sm ${language === "ar" ? "text-right" : "text-left"}`}>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">{t.account_invoices_date}:</span>
                      <span className="font-medium text-gray-900">{formatInvoiceDate(invoice.date, language)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">{language === "ar" ? "الفرع" : "Branch"}:</span>
                      <span className="font-medium text-gray-900">{invoice.branch || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">{t.account_invoices_amount}:</span>
                      <span className="font-bold text-[#009FE3]">
                        {invoice.amount.toLocaleString()} {CURRENCY_LABEL}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewInvoice(invoice.id)}
                      disabled={actionLoadingId === invoice.id}
                      className="flex-1 border-2 border-[#009FE3] text-[#009FE3] px-4 py-2 rounded-lg hover:bg-[#009FE3] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50"
                    >
                      <Eye className="w-4 h-4" />
                      {t.account_invoices_view}
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(invoice.id)}
                      disabled={actionLoadingId === invoice.id}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50"
                    >
                      <Printer className="w-4 h-4" />
                      {language === "ar" ? "طباعة" : "Print"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedImageUrl && selectedInvoiceId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setSelectedImageUrl(null);
            setSelectedInvoiceId(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {language === "ar" ? "عرض الفاتورة" : "Invoice Preview"}
                </h2>
                <p className="text-sm text-gray-600">{selectedInvoiceId}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedImageUrl(null);
                  setSelectedInvoiceId(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={language === "ar" ? "إغلاق" : "Close"}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-auto p-4 bg-gray-100">
              <img
                src={selectedImageUrl}
                alt={`Invoice ${selectedInvoiceId}`}
                className="w-full h-auto rounded-lg bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
