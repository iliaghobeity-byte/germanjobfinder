import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Sliders,
  Download,
  X,
  Sparkles,
  Layers,
  Layout,
  Check,
  ShieldCheck,
  Compass,
  FileCheck2,
  FileSpreadsheet,
  Printer,
  Loader2
} from "lucide-react";
import { DashboardExportSections } from "../utils/germanPdfExportService";

export type PdfPagePreset = "all" | "summary_only" | "detailed_only" | "custom";

export interface PdfExportDialogConfig {
  selectedSections: DashboardExportSections;
  preset: PdfPagePreset;
  filename: string;
  orientation: "portrait" | "landscape";
  includeWatermark: boolean;
}

export interface PdfPageSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: PdfExportDialogConfig) => void;
  isGenerating?: boolean;
  candidateName?: string;
  fieldTitle?: string;
}

export const PdfPageSelectionDialog: React.FC<PdfPageSelectionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isGenerating = false,
  candidateName = "متقاضی محترم",
  fieldTitle = "تخصص حرفه‌ای"
}) => {
  const [preset, setPreset] = useState<PdfPagePreset>("all");
  const [sections, setSections] = useState<DashboardExportSections>({
    includeSummary: true,
    includeRadar: true,
    includeDetailedReport: true,
    includeJobComparison: true,
    includeSignatures: true
  });

  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [customFilename, setCustomFilename] = useState<string>("");

  // Initialize or update default filename based on candidate
  useEffect(() => {
    if (isOpen) {
      const safeName = candidateName.replace(/[^\w\u0600-\u06FF]/g, "_") || "Applicant";
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      setCustomFilename(`کارنامه_ارزیابی_مهاجرت_${safeName}_${dateStr}`);
    }
  }, [isOpen, candidateName]);

  // Handle Preset Selection
  const applyPreset = (newPreset: PdfPagePreset) => {
    setPreset(newPreset);
    if (newPreset === "all") {
      setSections({
        includeSummary: true,
        includeRadar: true,
        includeDetailedReport: true,
        includeJobComparison: true,
        includeSignatures: true
      });
    } else if (newPreset === "summary_only") {
      setSections({
        includeSummary: true,
        includeRadar: true,
        includeDetailedReport: false,
        includeJobComparison: false,
        includeSignatures: true
      });
    } else if (newPreset === "detailed_only") {
      setSections({
        includeSummary: false,
        includeRadar: false,
        includeDetailedReport: true,
        includeJobComparison: true,
        includeSignatures: true
      });
    }
  };

  const handleToggleSection = (key: keyof DashboardExportSections) => {
    setPreset("custom");
    setSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isGenerating]);

  if (!isOpen) return null;

  // Calculate estimated page count
  const estimatedPages = (() => {
    if (sections.includeSummary && sections.includeRadar && sections.includeDetailedReport && sections.includeJobComparison) {
      return "۳ الی ۴ صفحه کامل DIN A4";
    }
    if (sections.includeSummary && !sections.includeDetailedReport && !sections.includeJobComparison) {
      return "۱ صفحه رسمی و خلاصه (Executive Summary)";
    }
    if (!sections.includeSummary && sections.includeDetailedReport) {
      return "۲ الی ۳ صفحه تفصیلی";
    }
    const count = (sections.includeSummary ? 1 : 0) + (sections.includeDetailedReport ? 2 : 0) + (sections.includeJobComparison ? 1 : 0);
    return `${Math.max(1, count)} صفحه تخمینی A4`;
  })();

  const handleGenerate = () => {
    let finalName = customFilename.trim() || `گزارش_ارزیابی_مهاجرت_آلمان`;
    if (!finalName.toLowerCase().endsWith(".pdf")) {
      finalName += ".pdf";
    }

    onConfirm({
      selectedSections: sections,
      preset,
      filename: finalName,
      orientation,
      includeWatermark
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      id="pdf-page-selection-dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isGenerating) onClose();
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl max-w-2xl w-full p-5 sm:p-7 relative text-right space-y-6 my-auto text-white overflow-hidden ring-1 ring-white/10"
        id="pdf-page-selection-dialog-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-600" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>موتور تولید سند jsPDF • استاندارد DIN A4 آلمان</span>
            </div>
            <h3 id="dialog-title" className="text-lg sm:text-xl font-black text-white">
              انتخاب صفحات و چیدمان فایل PDF گزارش ارزیابی
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              صفحات و بخش‌های مورد نظر را برای خروجی گزارش هوشمند مهاجرتی متقاضی ({candidateName}) انتخاب کنید.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selection Cards */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300 block">
            ۱. انتخاب سریع قالب و صفحات گزارش (Presets):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Full Report Preset */}
            <button
              type="button"
              onClick={() => applyPreset("all")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                preset === "all"
                  ? "bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40"
                  : "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>گزارش کامل (All)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  پیش‌فرض
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                پرونده کامل شامل خلاصه، کارنامه، رادار، متن هوش مصنوعی و تطبیق شغلی (~۳ الی ۴ صفحه)
              </p>
            </button>

            {/* Summary Only Preset */}
            <button
              type="button"
              onClick={() => applyPreset("summary_only")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                preset === "summary_only"
                  ? "bg-emerald-600/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                  : "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>فقط خلاصه (Summary)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ۱ صفحه
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                فقط صفحه اول شامل مشخصات، ۴ شاخص کلیدی انطباق و جدول رادار (مناسب ارائه سریع به کارفرما)
              </p>
            </button>

            {/* Detailed Report Only Preset */}
            <button
              type="button"
              onClick={() => applyPreset("detailed_only")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                preset === "detailed_only"
                  ? "bg-amber-600/15 border-amber-500 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40"
                  : "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <span>گزارش تفصیلی (Report)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  متن جامع
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                تحلیل جامع هوش مصنوعی، توصیه‌های گام‌به‌گام و نقشه راه مهاجرت کاری (~۲ صفحه)
              </p>
            </button>
          </div>
        </div>

        {/* Section Checklist (Granular Toggles) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">
              ۲. جزئیات بخش‌ها و صفحات مشمول در فایل PDF:
            </label>
            <span className="text-[11px] text-indigo-300 font-medium">
              حالت فعال: {preset === "all" ? "گزارش کامل" : preset === "summary_only" ? "فقط خلاصه" : preset === "detailed_only" ? "فقط گزارش تفصیلی" : "شخصی‌سازی دستی"}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 divide-y divide-slate-800/80 space-y-2.5">
            {/* Section 1: Summary Dossier & KPIs */}
            <label className="flex items-start gap-3 pt-2 first:pt-0 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={!!sections.includeSummary}
                onChange={() => handleToggleSection("includeSummary")}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800 cursor-pointer"
              />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    صفحه ۱: شناسنامه متقاضی و کارت‌های ۴گانه شایستگی (Summary Dossier & KPIs)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    صفحه ۱
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  شامل سن، سوابق، مدرک، سطح زبان، شانس بلوکارت (§18g) و امتیاز کارت فرصت
                </p>
              </div>
            </label>

            {/* Section 2: Radar Competency Table */}
            <label className="flex items-start gap-3 pt-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={!!sections.includeRadar}
                onChange={() => handleToggleSection("includeRadar")}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800 cursor-pointer"
              />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    صفحه ۱ یا ۲: جدول انطباق رادار شایستگی با نیازهای بازار کار آلمان
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/70 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                    جدول ماتریس
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  نمرات ۶ شاخص تخصصی، نیاز کارفرمای آلمانی و ارزیابی شکاف امتیازی
                </p>
              </div>
            </label>

            {/* Section 3: Detailed AI Smart Report */}
            <label className="flex items-start gap-3 pt-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={!!sections.includeDetailedReport}
                onChange={() => handleToggleSection("includeDetailedReport")}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800 cursor-pointer"
              />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    صفحات ۲ الی ۳: متن تحلیلی گزارش تفصیلی هوش مصنوعی (Detailed Report)
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/70 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    متن تفصیلی
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  تحلیل بندهای قانون مهاجرت ماهر ۲۰۲۶، مسیرهای ویزا، توصیه‌های زبان و نقشه راه
                </p>
              </div>
            </label>

            {/* Section 4: German Job Market Comparison */}
            <label className="flex items-start gap-3 pt-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={!!sections.includeJobComparison}
                onChange={() => handleToggleSection("includeJobComparison")}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800 cursor-pointer"
              />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    صفحه پایانی: تطبیق بازار کار آلمان و کدهای KldB ({fieldTitle})
                  </span>
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-950/70 border border-teal-500/30 px-1.5 py-0.5 rounded">
                    پیوست شغلی
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  مقایسه رویه کار در ایران با استانداردهای کارفرما در آلمان و طبقه‌بندی شغلی
                </p>
              </div>
            </label>

            {/* Section 5: Signatures & Legal Footer */}
            <label className="flex items-start gap-3 pt-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={!!sections.includeSignatures}
                onChange={() => handleToggleSection("includeSignatures")}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800 cursor-pointer"
              />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    مهر، تاییدیه رسمی کارشناسی و اطلاعات حقوقی استناد FEG 2026
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-850 px-1.5 py-0.5 rounded border border-slate-700">
                    فوتر قانونی
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  امضای تاییدیه، شماره پرونده Aktenzeichen و استنادات ماده‌های قانون مهاجرت
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Document Formatting Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Orientation */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              <span>جهت صفحات سند (Orientation):</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientation("portrait")}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                  orientation === "portrait"
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                عمودی (Portrait - A4)
              </button>
              <button
                type="button"
                onClick={() => setOrientation("landscape")}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                  orientation === "landscape"
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                افقی (Landscape)
              </button>
            </div>
          </div>

          {/* Watermark & Filename */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>واترمارک رسمی جهانبان:</span>
              </label>
              <button
                type="button"
                onClick={() => setIncludeWatermark(!includeWatermark)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition cursor-pointer ${
                  includeWatermark
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {includeWatermark ? "فعال" : "غیرفعال"}
              </button>
            </div>
            <div>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder="نام فایل خروجی PDF..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 text-right focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live Estimation Info Banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-300">
              برآورد حجم سند: <strong className="text-emerald-300 font-bold">{estimatedPages}</strong>
            </span>
          </div>
          <span className="text-[10.5px] text-slate-400 hidden sm:inline">
            فرمت استاندارد DIN A4 با تفکیک هوشمند صفحات
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || (!sections.includeSummary && !sections.includeDetailedReport && !sections.includeJobComparison)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50 border border-emerald-400/30"
            id="btn-confirm-pdf-page-selection"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>در حال ایجاد فایل PDF با jsPDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-200" />
                <span>ایجاد و دانلود فایل PDF ({preset === "summary_only" ? "فقط خلاصه" : preset === "detailed_only" ? "گزارش تفصیلی" : "سفارشی"})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
