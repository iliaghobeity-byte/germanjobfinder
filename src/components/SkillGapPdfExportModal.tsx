import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Printer,
  Download,
  FileCheck2,
  Settings2,
  Check,
  ShieldCheck,
  Sparkles,
  Loader2,
  GraduationCap,
  Eye,
  RefreshCw
} from "lucide-react";
import {
  generateSkillGapPdfHtml,
  exportSkillGapReportToPdf,
  SkillGapPdfExportOptions,
  SkillGapExportData
} from "../utils/skillGapPdfGenerator";
import { StructuredGapAnalysisReport } from "../data/germanSkillsToolsBenchmarkData";
import { GermanCourseRecommendation } from "../data/germanCoursesCatalog";
import { formatPrintDocumentTitle, triggerPrintWithTitle } from "../utils";

interface SkillGapPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  targetRole: string;
  gapReport: StructuredGapAnalysisReport;
  recommendedCourses: GermanCourseRecommendation[];
  aiAuditText?: string | null;
}

export const SkillGapPdfExportModal: React.FC<SkillGapPdfExportModalProps> = ({
  isOpen,
  onClose,
  candidateName: initialCandidateName,
  targetRole: initialTargetRole,
  gapReport,
  recommendedCourses,
  aiAuditText
}) => {
  const [candidateName, setCandidateName] = useState<string>(initialCandidateName || "متقاضی محترم");
  const [targetRole, setTargetRole] = useState<string>(initialTargetRole || gapReport.targetRoleFa);
  
  // Customization options
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [options, setOptions] = useState<SkillGapPdfExportOptions>({
    includeOverallScores: true,
    includeToolsMatrix: true,
    includeTechnicalStandards: true,
    includeRecommendedCourses: true,
    includeRoadmap: true,
    includeAtsKeywords: true,
    includeAiAuditAdvice: Boolean(aiAuditText),
    aiAuditText: aiAuditText || null
  });

  // Export states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<{ percent: number; status: string }>({ percent: 0, status: "" });
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCandidateName) setCandidateName(initialCandidateName);
    if (initialTargetRole) setTargetRole(initialTargetRole);
  }, [initialCandidateName, initialTargetRole]);

  useEffect(() => {
    if (aiAuditText) {
      setOptions(prev => ({ ...prev, aiAuditText, includeAiAuditAdvice: true }));
    }
  }, [aiAuditText]);

  // Generate HTML for preview
  const exportData: SkillGapExportData = useMemo(() => ({
    candidateName,
    targetRole,
    gapReport,
    recommendedCourses,
    options
  }), [candidateName, targetRole, gapReport, recommendedCourses, options]);

  const previewHtml = useMemo(() => {
    return generateSkillGapPdfHtml(exportData);
  }, [exportData]);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    setErrorMessage(null);
    setExportProgress({ percent: 10, status: "آماده‌سازی سند استاندارد..." });

    try {
      const filename = `${formatPrintDocumentTitle("گزارش_تحلیل_شکاف_مهارتی_و_دوره‌های_آموزشی", candidateName)}.pdf`;
      await exportSkillGapReportToPdf(exportData, filename, (pct, status) => {
        setExportProgress({ percent: pct, status });
      });

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error("PDF Export error:", err);
      setErrorMessage("خطا در تولید فایل PDF. لطفاً از گزینه «پیش‌نمایش و چاپ مستقیم» استفاده نمایید.");
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDirectPrint = () => {
    const title = formatPrintDocumentTitle("گزارش_تحلیل_شکاف_مهارتی_و_دوره‌های_آموزشی", candidateName);
    triggerPrintWithTitle(title, () => {
      // Print via hidden iframe
      let iframe = document.getElementById("skillgap-pdf-print-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "skillgap-pdf-print-iframe";
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);
      }

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(previewHtml);
        doc.close();
        setTimeout(() => {
          iframe?.contentWindow?.focus();
          iframe?.contentWindow?.print();
        }, 500);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[900px] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  خروجی رسمی و دانلود گزارش PDF تحلیل شکاف مهارتی
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                  استاندارد DIN A4 آلمان
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                تولید گزارش رسمی چندصفحه‌ای به همراه دوره‌های پیشنهادی، سربرگ و پاورقی رسمی خانه خلاق جهانبان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                showSettings
                  ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-white"
              }`}
              title="شخصی‌سازی سرفصل‌های گزارش"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">تنظیمات بخش‌ها</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Settings Drawer */}
        {showSettings && (
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0 text-xs animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">نام درج‌شده در سربرگ:</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان شغل و استاندارد آلمان:</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">بخش‌های فعال در گزارش PDF:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: "includeOverallScores", label: "شاخص‌های کلیدی انطباق (KPIs)" },
                  { key: "includeToolsMatrix", label: "ماتریس ابزارها و نرم‌افزارها" },
                  { key: "includeTechnicalStandards", label: "استانداردهای مهندسی و DIN/ISO" },
                  { key: "includeRecommendedCourses", label: "دوره‌های آموزشی پیشنهادی" },
                  { key: "includeRoadmap", label: "نقشه راه ۳۰، ۶۰ و ۹۰ روزه" },
                  { key: "includeAtsKeywords", label: "کلمات کلیدی طلایی ATS" }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean((options as any)[item.key])}
                      onChange={e => setOptions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="rounded accent-indigo-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Preview Container (Scrollable) */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[820px] bg-white text-slate-900 shadow-xl rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[600px] text-xs space-y-4">
            
            {/* Embedded Sandbox Preview */}
            <iframe
              srcDoc={previewHtml}
              title="Skill Gap Report Preview"
              className="w-full h-[640px] border-0 rounded-xl"
              sandbox="allow-same-origin allow-scripts"
            />

          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              سند خروجی شامل پاورقی رسمی <strong>خانه خلاق جهانبان</strong> و نشانی دفاتر تهران و برلین می‌باشد.
            </span>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {exportSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Check className="w-4 h-4" />
                <span>فایل PDF با موفقیت دانلود شد!</span>
              </span>
            )}

            {errorMessage && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                {errorMessage}
              </span>
            )}

            <button
              onClick={handleDirectPrint}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              <Printer className="w-4 h-4 text-indigo-500" />
              <span>پیش‌نمایش و چاپ</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{exportProgress.status || "در حال تولید PDF..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل PDF گزارش</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillGapPdfExportModal;
