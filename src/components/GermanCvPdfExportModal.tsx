import React, { useState, useEffect } from "react";
import { 
  Download, Printer, X, Check, Copy, FileText, Eye, ShieldCheck, 
  Settings2, Sparkles, CheckCircle2, Globe, AlertCircle, RefreshCw, Loader2
} from "lucide-react";
import { 
  GermanCvData, 
  generateGermanCvHtml, 
  parseCvContent 
} from "../utils/germanCvPdfGenerator";
import { triggerPrintWithTitle, formatPrintDocumentTitle } from "../utils";
import { exportToPdfWithHtml2Pdf } from "../utils/html2pdfExporter";

interface GermanCvPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    field: string;
    address?: string;
    experience: string;
    education: string;
    skills: string;
    languages: string;
    rawText?: string;
    docType?: "cv" | "cover";
    showWatermark?: boolean;
    format?: "tabellarisch" | "europass" | "modern" | "akademisch";
  };
}

export const GermanCvPdfExportModal: React.FC<GermanCvPdfExportModalProps> = ({
  isOpen,
  onClose,
  initialData = {} as any
}) => {
  const [docType, setDocType] = useState<"cv" | "cover">(initialData?.docType || "cv");
  const [style, setStyle] = useState<"modern" | "classic">("modern");
  const [format, setFormat] = useState<"tabellarisch" | "europass" | "modern" | "akademisch">(initialData?.format || "tabellarisch");
  const [name, setName] = useState(initialData?.name || "Max Mustermann");
  const [field, setField] = useState(initialData?.field || "Softwareentwickler");
  const [email, setEmail] = useState("kontakt.bewerbung@beispiel.de");
  const [phone, setPhone] = useState("+98 912 345 6789");
  const [address, setAddress] = useState(initialData?.address || "Teheran, Iran (Bereit zum Umzug)");
  const [anabinStatus, setAnabinStatus] = useState("H+ anerkannt (KMK / ZAB)");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showWatermark, setShowWatermark] = useState<boolean>(() => {
    if (typeof initialData?.showWatermark === "boolean") {
      return initialData.showWatermark;
    }
    try {
      const saved = localStorage.getItem("jahanban_cv_watermark_enabled");
      if (saved !== null) {
        return saved === "true";
      }
    } catch {
      // ignore
    }
    return false;
  });

  const handleWatermarkToggle = (enabled: boolean) => {
    setShowWatermark(enabled);
    try {
      localStorage.setItem("jahanban_cv_watermark_enabled", String(enabled));
      localStorage.setItem("jahanban_print_watermark_enabled", String(enabled));
    } catch {
      // ignore
    }
    if (enabled) {
      document.body.classList.remove("hide-watermark");
    } else {
      document.body.classList.add("hide-watermark");
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingHtml2Pdf, setIsExportingHtml2Pdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfStatus, setPdfStatus] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [exportError, setExportError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialData?.name && initialData.name !== name) setName(initialData.name);
    if (initialData?.field && initialData.field !== field) setField(initialData.field);
    if (initialData?.address && initialData.address !== address) setAddress(initialData.address);
    if (initialData?.docType && initialData.docType !== docType) setDocType(initialData.docType);
    if (initialData?.format && initialData.format !== format) setFormat(initialData.format);
    if (typeof initialData?.showWatermark === "boolean" && initialData.showWatermark !== showWatermark) {
      setShowWatermark(initialData.showWatermark);
    }
  }, [
    initialData?.name,
    initialData?.field,
    initialData?.address,
    initialData?.docType,
    initialData?.format,
    initialData?.showWatermark
  ]);

  if (!isOpen) return null;

  const cvData: GermanCvData = {
    name,
    field,
    email,
    phone,
    address,
    anabinStatus,
    style,
    format,
    rawText: initialData.rawText,
    educationRaw: initialData.education,
    experienceRaw: initialData.experience,
    skillsRaw: initialData.skills,
    languagesRaw: initialData.languages,
    docType,
    showWatermark
  };

  const printableHtml = generateGermanCvHtml(cvData);
  const docTitle = docType === "cover" 
    ? `Anschreiben_${name.replace(/\s+/g, "_")}_DIN5008`
    : `Lebenslauf_${name.replace(/\s+/g, "_")}_DIN5008`;

  // Direct clean PDF file export via jsPDF and html2canvas
  const handleExportWithHtml2Pdf = async () => {
    setIsExportingHtml2Pdf(true);
    setPdfSuccess(false);
    setExportError("");
    setPdfProgress(10);
    setPdfStatus("در حال آماده‌سازی سند رزومه...");
    try {
      await exportToPdfWithHtml2Pdf(printableHtml, `${docTitle}.pdf`, {
        margin: [8, 8, 8, 8],
        orientation: "portrait",
        scale: 2,
        onProgress: (percent, statusText) => {
          setPdfProgress(percent);
          setPdfStatus(statusText);
        }
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error("html2canvas/jsPDF export failed:", err);
      setExportError("خطا در تولید مستقیم فایل PDF. لطفاً از گزینه پرینت استفاده فرمایید یا مجدداً تلاش کنید.");
    } finally {
      setIsExportingHtml2Pdf(false);
    }
  };

  const handlePrintPdf = () => {
    setIsExporting(true);
    try {
      let iframe = document.getElementById("german-cv-pdf-print-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "german-cv-pdf-print-iframe";
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
        doc.write(printableHtml);
        doc.close();
        if (iframe.contentDocument) {
          iframe.contentDocument.title = docTitle;
        }

        setTimeout(() => {
          triggerPrintWithTitle(docTitle, () => {
            try {
              iframe?.contentWindow?.focus();
              iframe?.contentWindow?.print();
            } catch (e) {
              console.warn("Iframe print error, falling back to window:", e);
              window.print();
            } finally {
              setIsExporting(false);
            }
          });
        }, 500);
      }
    } catch (err) {
      console.error("PDF Print failed:", err);
      setIsExporting(false);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([printableHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docTitle}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(printableHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="german-cv-export-modal"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  دانلود سند اداری آلمانی به صورت استاندارد PDF
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DIN 5008 Tabellarisch
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تولید رزومه (Lebenslauf) دو ستونه و انگیزه‌نامه استاندارد مطابق ضوابط اداره کار آلمان و سفارت
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
        <div className="px-4 py-3 bg-slate-950/30 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Doc Type Selector */}
            <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                type="button"
                onClick={() => setDocType("cv")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  docType === "cv"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                رزومه (Lebenslauf)
              </button>
              <button
                type="button"
                onClick={() => setDocType("cover")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  docType === "cover"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                انگیزه‌نامه (Anschreiben)
              </button>
            </div>

            {/* Design Style */}
            <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                type="button"
                onClick={() => setStyle("modern")}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  style === "modern"
                    ? "bg-slate-700 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                مدرن شرکتی (Modern)
              </button>
              <button
                type="button"
                onClick={() => setStyle("classic")}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  style === "classic"
                    ? "bg-slate-700 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                کلاسیک تک‌رنگ (DIN 5008)
              </button>
            </div>

            {/* German CV Format Selector */}
            {docType === "cv" && (
              <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold px-1 hidden md:inline">فرمت آلمانی:</span>
                <button
                  type="button"
                  onClick={() => setFormat("tabellarisch")}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    format === "tabellarisch"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Tabellarischer Lebenslauf nach DIN 5008"
                >
                  تبولار DIN
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("europass")}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    format === "europass"
                      ? "bg-sky-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Europass EU Format"
                >
                  یوروپس EU
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("modern")}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    format === "modern"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Modernes IT- & Tech-Layout"
                >
                  مدرن IT
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("akademisch")}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    format === "akademisch"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Akademischer Lebenslauf"
                >
                  آکادمیک
                </button>
              </div>
            )}

            {/* Clean vs Branded Watermark Toggle for Formal CV Print */}
            <div 
              className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs shadow-inner" 
              title="تنظیم نمایش یا مخفی‌سازی واترمارک جهانبان در چاپ و فایل خروجی PDF (نسخه بدون واترمارک برای ارائه رسمی به کارفرمایان و سفارت آلمان پیشنهاد می‌شود)"
              id="modal-cv-watermark-toggle"
            >
              <span className="hidden sm:inline text-[11px] text-slate-400 font-medium px-1.5">واترمارک:</span>
              <button
                type="button"
                onClick={() => handleWatermarkToggle(false)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  !showWatermark
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="بدون واترمارک جهت ظاهر رسمی، شیک و مورد تایید سفارت و کارفرمایان آلمانی (Clean)"
                id="btn-modal-watermark-clean"
              >
                مخفی (رزومه رسمی)
              </button>
              <button
                type="button"
                onClick={() => handleWatermarkToggle(true)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  showWatermark
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="درج واترمارک رسمی برند جهانبان در پس‌زمینه رزومه (Branded)"
                id="btn-modal-watermark-branded"
              >
                واترمارک جهانبان
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                showCustomizer 
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>ویرایش اطلاعات تماس و هدر</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {pdfSuccess && (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> فایل PDF با jsPDF دانلود شد
              </span>
            )}

            {exportError && (
              <span className="text-rose-400 text-xs font-bold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {exportError}
              </span>
            )}

            <button
              type="button"
              onClick={handleCopyHtml}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="کپی کد HTML استاندارد"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "کپی شد" : "کپی سورس"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="دانلود سورس آماده HTML"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود HTML</span>
            </button>

            {/* BROWSER PRINT / SAVE AS PDF ACTION */}
            <button
              type="button"
              onClick={handlePrintPdf}
              disabled={isExporting || isExportingHtml2Pdf}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="چاپ یا ذخیره از طریق کادر پرینت مرورگر"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isExporting ? "در حال آماده‌سازی..." : "پرینت در مرورگر"}</span>
            </button>

            {/* PRIMARY JSPDF & HTML2CANVAS DIRECT DOWNLOAD ACTION */}
            <button
              type="button"
              onClick={handleExportWithHtml2Pdf}
              disabled={isExportingHtml2Pdf}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              title="دانلود مستقیم سند رزومه به صورت فایل تمیز PDF با jsPDF و html2canvas"
            >
              {isExportingHtml2Pdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{pdfStatus || "در حال تولید PDF با jsPDF..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>دانلود مستقیم PDF (jsPDF + html2canvas)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Customizer Drawer (Collapsible) */}
        {showCustomizer && (
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs shrink-0 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">نام و نام خانوادگی:</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="Iliar Alizadeh"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">عنوان شغلی هدف (آلمانی):</label>
              <input 
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="Softwareentwickler (Full Stack)"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">آدرس ایمیل:</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="bewerbung@beispiel.de"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">تلفن تماس:</label>
              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="+98 912 000 0000"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">محل سکونت و آمادگی مهاجرت:</label>
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="Teheran, Iran (Bereit zum Umzug)"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">تاییدیه معادل‌سازی آنابین:</label>
              <input 
                type="text"
                value={anabinStatus}
                onChange={(e) => setAnabinStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                placeholder="H+ anerkannt (KMK / ZAB)"
              />
            </div>
          </div>
        )}

        {/* Live A4 Preview Sheet Container */}
        <div className="flex-1 p-4 sm:p-6 bg-slate-950 overflow-y-auto flex flex-col items-center">
          <div className="mb-3 text-[11px] text-slate-400 flex items-center gap-2 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>پیش‌نمایش زنده ساختار آلمانی استاندارد (A4) — در کادر پرینت مرورگر، گزینه «Save as PDF» را انتخاب نمایید:</span>
          </div>

          {/* A4 Paper Mockup Container */}
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-300 min-h-[750px]">
            <iframe
              srcDoc={printableHtml}
              title="German CV Live Preview"
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
              فرمت خروجی منطبق بر استاندارد <strong>DIN 5008 آلمان</strong> و سیستم‌های ترکینگ متقاضی (ATS) در آلمان، اتریش و سوئیس.
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
              onClick={handlePrintPdf}
              disabled={isExporting || isExportingHtml2Pdf}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرینت مرورگر</span>
            </button>
            <button
              type="button"
              onClick={handleExportWithHtml2Pdf}
              disabled={isExportingHtml2Pdf}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {isExportingHtml2Pdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ساخت PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل تمیز PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GermanCvPdfExportModal;

