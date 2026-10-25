import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  FileCheck,
  Eye,
  Settings2,
  Check,
  ShieldCheck,
  Sparkles,
  Loader2
} from "lucide-react";
import {
  ChancenkarteReportData,
  generateChancenkarteHtml
} from "../utils/chancenkartePdfGenerator";
import { exportToPdfWithHtml2Pdf } from "../utils/html2pdfExporter";

interface ChancenkartePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationData?: ChancenkarteReportData;
  reportData?: ChancenkarteReportData;
}

export const ChancenkartePdfExportModal: React.FC<ChancenkartePdfExportModalProps> = ({
  isOpen,
  onClose,
  evaluationData,
  reportData
}) => {
  const activeData = evaluationData || reportData;

  const [applicantName, setApplicantName] = useState(
    activeData?.applicantName && activeData.applicantName !== "کاربر نمونه"
      ? activeData.applicantName
      : "متقاضی محترم"
  );
  const [field, setField] = useState(activeData?.field || "Softwareentwickler / Fachkraft");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeData?.applicantName && activeData.applicantName !== "کاربر نمونه") {
      setApplicantName(activeData.applicantName);
    }
    if (activeData?.field) {
      setField(activeData.field);
    }
  }, [activeData?.applicantName, activeData?.field]);

  if (!isOpen) return null;

  const currentReportData: ChancenkarteReportData = {
    age: "under35",
    qualType: "full",
    germanLevel: "none",
    englishLevel: "none",
    experience: "less",
    germanExp: false,
    spouse: false,
    totalPoints: 0,
    ...(activeData || {}),
    applicantName,
    field
  };

  const reportHtml = generateChancenkarteHtml(currentReportData);
  const filename = `Chancenkarte_Evaluation_${applicantName.replace(/\s+/g, "_")}.pdf`;

  // 1. Direct Clean PDF Export via html2pdf.js
  const handleExportWithHtml2Pdf = async () => {
    setIsExportingPdf(true);
    setExportSuccess(false);
    setErrorMessage(null);
    try {
      await exportToPdfWithHtml2Pdf(reportHtml, filename, {
        margin: [10, 10, 10, 10],
        orientation: "portrait",
        scale: 2
      });
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    } catch (error) {
      console.error("Failed to export Chancenkarte evaluation PDF with html2pdf.js:", error);
      setErrorMessage("خطا در تولید خودکار فایل PDF. لطفاً از گزینه پرینت استفاده نمایید.");
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // 2. Browser print fallback
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      let iframe = document.getElementById("chancenkarte-pdf-print-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "chancenkarte-pdf-print-iframe";
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.style.visibility = "hidden";
        document.body.appendChild(iframe);
      }

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(reportHtml);
        doc.close();

        setTimeout(() => {
          try {
            iframe?.contentWindow?.focus();
            iframe?.contentWindow?.print();
          } catch (e) {
            console.warn("Iframe print error, falling back to window:", e);
            window.print();
          } finally {
            setIsPrinting(false);
          }
        }, 500);
      }
    } catch (err) {
      console.error("Print failed:", err);
      setIsPrinting(false);
    }
  };

  // 3. Download standalone HTML
  const handleDownloadHtml = () => {
    const blob = new Blob([reportHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Chancenkarte_Evaluation_${applicantName.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="chancenkarte-export-modal"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  دانلود گزارش رسمی ارزیابی کارت فرصت (Chancenkarte PDF)
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${
                  currentReportData.totalPoints >= 6
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {currentReportData.totalPoints >= 6 ? "واجد شرایط (≥ ۶ امتیاز)" : "نیاز به امتیاز تکمیلی"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تولید خروجی سند استاندارد با استناد به ماده ۲۰a قانون اقامت آلمان جهت ارائه به سفارت، وکیل یا کارفرما
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar */}
        <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                showCustomizer 
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>ویرایش مشخصات متقاضی در گزارش</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="دانلود فایل وب (HTML)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود نسخه HTML</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {exportSuccess && (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> فایل PDF با موفقیت ذخیره شد
              </span>
            )}

            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting || isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="چاپ یا ذخیره از طریق مرورگر"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPrinting ? "در حال باز کردن پرینتر..." : "پرینت در مرورگر"}</span>
            </button>

            {/* PRIMARY BUTTON: html2pdf.js export */}
            <button
              type="button"
              onClick={handleExportWithHtml2Pdf}
              disabled={isExportingPdf}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال تولید فایل PDF با html2pdf...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>دانلود مستقیم PDF (با html2pdf.js)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Customizer Drawer */}
        {showCustomizer && (
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs shrink-0 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">نام و نام خانوادگی متقاضی (Bewerber):</label>
              <input 
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="مثلاً: علیرضا رضایی / Alireza Rezaei"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">عنوان تخصص و رشته شغلی (Fachbereich):</label>
              <input 
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="مثلاً: مهندس نرم‌افزار / Softwareentwickler"
              />
            </div>
          </div>
        )}

        {/* Live A4 Preview Sheet Container */}
        <div className="flex-1 p-4 sm:p-6 bg-slate-950 overflow-y-auto flex flex-col items-center">
          <div className="mb-3 text-[11px] text-slate-400 flex items-center gap-2 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>پیش‌نمایش زنده سند استاندارد ارزیابی کارت فرصت آلمان (فرمت استاندارد رسمی):</span>
          </div>

          {/* A4 Paper Mockup Container */}
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-300 min-h-[750px]">
            <iframe
              srcDoc={reportHtml}
              title="Chancenkarte Evaluation Report Preview"
              className="w-full h-[780px] border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              فرمت گزارش منطبق بر مصوبات فدرال ۲۰۲۶ و <strong>قانون اقامت آلمان (§ 20a AufenthG)</strong> می‌باشد.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              بستن پنجره
            </button>
            <button
              type="button"
              onClick={handleExportWithHtml2Pdf}
              disabled={isExportingPdf}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل تمیز PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChancenkartePdfExportModal;
