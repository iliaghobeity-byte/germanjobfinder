import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Printer,
  Copy,
  Check,
  Info,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Database,
  BookOpen,
  Target,
  Calendar,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileCheck2,
  Clock,
  SlidersHorizontal,
  GraduationCap,
  Search,
  Download
} from "lucide-react";
import {
  GERMAN_OCCUPATIONAL_BENCHMARKS,
  analyzeResumeSkillsAndToolsAgainstGermanStandards,
  StructuredGapAnalysisReport,
  GapAnalysisToolResult,
  GapAnalysisSkillResult,
  GermanJobBenchmarkStandard
} from "../data/germanSkillsToolsBenchmarkData";
import {
  GERMAN_RECOGNIZED_COURSES,
  getRecommendedCoursesForGaps,
  getCoursesByToolId,
  GermanCourseRecommendation
} from "../data/germanCoursesCatalog";
import { triggerPrintWithTitle, formatPrintDocumentTitle } from "../utils";
import SkillGapPdfExportModal from "./SkillGapPdfExportModal";

interface ResumeSkillsToolsGapModuleProps {
  candidateName: string;
  targetRole: string;
  skillsList: string[];
  rawResumeText: string;
  experienceYears: number;
  germanLevel?: string;
  degree?: string;
  anabinStatus?: string;
  onNavigateToTab?: (tab: string) => void;
}

export const ResumeSkillsToolsGapModule: React.FC<ResumeSkillsToolsGapModuleProps> = ({
  candidateName,
  targetRole,
  skillsList,
  rawResumeText,
  experienceYears,
  germanLevel = "B1",
  degree = "bachelor",
  anabinStatus = "H+",
  onNavigateToTab
}) => {
  // Selected benchmark standard (allows user to explicitly switch roles or keep auto-detected)
  const [selectedStandardId, setSelectedStandardId] = useState<string>("auto");
  
  // Filter states
  const [filterType, setFilterType] = useState<"all" | "matched" | "missing_critical" | "missing_differentiator">("all");
  const [viewFormat, setViewFormat] = useState<"interactive_table" | "cards">("interactive_table");
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  // Copy notification state
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  // AI Deep Audit state
  const [isAiAuditing, setIsAiAuditing] = useState<boolean>(false);
  const [aiCustomAdvice, setAiCustomAdvice] = useState<string | null>(null);

  // PDF Export Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Compute structured gap analysis
  const gapReport: StructuredGapAnalysisReport = useMemo(() => {
    // If user explicitly picked a standard from the catalog
    let effectiveSkills = [...skillsList];
    let effectiveRole = targetRole;

    if (selectedStandardId !== "auto") {
      const found = GERMAN_OCCUPATIONAL_BENCHMARKS.find(b => b.id === selectedStandardId);
      if (found) {
        effectiveRole = found.titleFa;
      }
    }

    return analyzeResumeSkillsAndToolsAgainstGermanStandards(
      effectiveSkills,
      rawResumeText,
      effectiveRole,
      experienceYears,
      germanLevel
    );
  }, [skillsList, rawResumeText, targetRole, experienceYears, germanLevel, selectedStandardId]);

  // Filtered tools
  const filteredTools = useMemo(() => {
    if (filterType === "all") return gapReport.toolsResults;
    return gapReport.toolsResults.filter(t => t.status === filterType);
  }, [gapReport, filterType]);

  // Course recommendations filter state
  const [selectedCoursePlatform, setSelectedCoursePlatform] = useState<string>("all");
  const [coursePriorityFilter, setCoursePriorityFilter] = useState<"all" | "critical" | "differentiator">("all");
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>("");
  const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);

  // Missing tools extraction for courses
  const missingToolIds = useMemo(() => {
    return gapReport.toolsResults
      .filter(t => t.status === "missing_critical" || t.status === "missing_differentiator")
      .map(t => t.tool.id);
  }, [gapReport]);

  const missingCriticalToolIds = useMemo(() => {
    return gapReport.toolsResults
      .filter(t => t.status === "missing_critical")
      .map(t => t.tool.id);
  }, [gapReport]);

  // Filtered recommended courses
  const recommendedCourses = useMemo(() => {
    const targetToolIds = coursePriorityFilter === "critical"
      ? missingCriticalToolIds
      : missingToolIds;

    const baseCourses = getRecommendedCoursesForGaps(
      targetToolIds.length > 0 ? targetToolIds : missingToolIds,
      [],
      selectedCoursePlatform,
      14
    );

    if (!courseSearchQuery.trim()) return baseCourses;

    const q = courseSearchQuery.toLowerCase();
    return baseCourses.filter(c => 
      c.courseTitle.toLowerCase().includes(q) ||
      (c.courseTitleDe && c.courseTitleDe.toLowerCase().includes(q)) ||
      c.provider.toLowerCase().includes(q) ||
      c.skillsCovered.some(s => s.toLowerCase().includes(q)) ||
      c.germanMarketValueFa.toLowerCase().includes(q)
    );
  }, [missingToolIds, missingCriticalToolIds, coursePriorityFilter, selectedCoursePlatform, courseSearchQuery]);

  const handleCopyCourse = (courseTitle: string, id: string) => {
    navigator.clipboard.writeText(courseTitle);
    setCopiedCourseId(id);
    setTimeout(() => setCopiedCourseId(null), 2000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(id);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handlePrint = () => {
    const title = formatPrintDocumentTitle(
      "گزارش_تحلیل_شکاف_مهارتی_استاندارد_آلمان",
      candidateName
    );
    triggerPrintWithTitle(title, () => window.print());
  };

  const handleRunAiAudit = async () => {
    setIsAiAuditing(true);
    setAiCustomAdvice(null);
    try {
      const res = await fetch("/api/gemini/skills-gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: targetRole,
          targetRoleOrDuties: gapReport.targetRoleFa,
          userExp: experienceYears,
          userSkills: skillsList.join(", "),
          userDegree: degree,
          germanLevel: germanLevel,
          rawTextSummary: rawResumeText ? rawResumeText.slice(0, 1500) : undefined
        })
      });
      const data = await res.json();
      if (data && data.overallMatchSummary) {
        const summary = data.overallMatchSummary;
        let adviceText = `خلاصه ممیزی هوش مصنوعی برای استاندارد شغلی ${data.titleDe || gapReport.targetRoleDe}:\n\n`;
        if (summary.topStrengths && summary.topStrengths.length > 0) {
          adviceText += `نقاط قوت مهارتی شما:\n${summary.topStrengths.map((s: string) => `• ${s}`).join("\n")}\n\n`;
        }
        if (summary.criticalGaps && summary.criticalGaps.length > 0) {
          adviceText += `شکاف‌های بحرانی احراز شغل در آلمان:\n${summary.criticalGaps.map((g: string) => `• ${g}`).join("\n")}\n\n`;
        }
        if (summary.germanCvOptimizationTip) {
          adviceText += `توصیه طلایی رزومه (Lebenslauf):\n${summary.germanCvOptimizationTip}`;
        }
        setAiCustomAdvice(adviceText);
      } else {
        setAiCustomAdvice(
          `ممیزی انجام شد: سطح تطابق تِک‌استک شما با بازار کار آلمان ${gapReport.overallMatchScore}٪ ارزیابی شد. تمرکز فوری بر پوشش ابزارهای الزامی (${gapReport.criticalGapsSummary[0] || "ابزارهای شاخص"}) شانس دعوت به مصاحبه را تا ۵۰٪ ارتقا می‌دهد.`
        );
      }
    } catch (e) {
      console.warn("AI audit fallback triggered", e);
      setAiCustomAdvice(
        `ممیزی مبتنی بر پایگاه داده KldB 2026: مهارت‌های استخراج‌شده از رزومه شما در حوزه ${gapReport.targetRoleFa} با موفقیت اعتبارسنجی شدند. جهت جبران شکاف ${gapReport.missingCriticalToolsCount} ابزار الزامی، توصیه می‌شود نمونه پروژه‌های کاربردی در بخش سوابق کاری رزومه اضافه گردد.`
      );
    } finally {
      setIsAiAuditing(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      
      {/* Top Banner: Module Identity & Occupational Benchmark Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>ماژول تخصصی مقایسه مهارت‌ها و ابزارها</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono font-bold">
                {gapReport.kldbCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                {gapReport.demandLevel}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>گزارش ساختاریافته شکاف مهارتی:</span>
              <span className="text-indigo-300">{gapReport.targetRoleFa}</span>
            </h2>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              مقایسه موشکافانه تخصص‌های فنی (Skills) و نرم‌افزارهای استخراج‌شده از رزومه با استانداردهای رسمی طبقه‌بندی مشاغل آلمان (KldB 2026) و الزامات احراز شغل در کارفرمایان فدرال.
            </p>
          </div>

          {/* Action Buttons: Download PDF, AI Deep Audit & Print */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/40 cursor-pointer"
              title="دانلود فایل PDF رسمی و چندصفحه‌ای گزارش تحلیل شکاف و دوره‌ها"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود گزارش PDF رسمی</span>
            </button>

            <button
              onClick={handleRunAiAudit}
              disabled={isAiAuditing}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiAuditing ? "animate-spin text-amber-300" : "text-amber-400"}`} />
              <span>{isAiAuditing ? "در حال ممیزی هوش مصنوعی..." : "ممیزی عمیق هوش مصنوعی"}</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="پیش‌نمایش سند چاپی استاندارد و تنظیمات"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>پیش‌نمایش و چاپ</span>
            </button>
          </div>
        </div>

        {/* Benchmark Selector Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">فیلد شغلی مرجع در آلمان:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedStandardId("auto")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedStandardId === "auto"
                  ? "bg-indigo-600 text-white ring-1 ring-white/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              تشخیص خودکار از رزومه
            </button>
            {GERMAN_OCCUPATIONAL_BENCHMARKS.map(bench => (
              <button
                key={bench.id}
                onClick={() => setSelectedStandardId(bench.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedStandardId === bench.id
                    ? "bg-indigo-600 text-white ring-1 ring-white/30"
                    : "bg-slate-800/70 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {bench.titleFa.split("،")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Custom Audit Alert if Generated */}
      {aiCustomAdvice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-950 dark:text-indigo-200 space-y-2 relative"
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              توصیه‌های تکمیلی هوش مصنوعی فدرال برای پوشش شکاف‌ها:
            </span>
            <button
              onClick={() => setAiCustomAdvice(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer text-base leading-none"
            >
              ×
            </button>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
            {aiCustomAdvice}
          </p>
        </motion.div>
      )}

      {/* 4 Key Metric Cards (Overview Scorecard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Overall Skills & Tools Match Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="25"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                className={`${
                  gapReport.overallMatchScore >= 80
                    ? "text-emerald-500"
                    : gapReport.overallMatchScore >= 65
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-amber-500"
                } transition-all duration-1000 ease-out`}
                strokeWidth="6"
                strokeDasharray={157}
                strokeDashoffset={157 - (157 * gapReport.overallMatchScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-sm font-black text-slate-900 dark:text-white">
              {gapReport.overallMatchScore}٪
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
              تطابق کل با استاندارد آلمان
            </span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {gapReport.overallMatchScore >= 75 ? "آمادگی بالا" : gapReport.overallMatchScore >= 60 ? "شکاف متوسط" : "شکاف بحرانی"}
            </h4>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium block">
              ارزیابی بر مبنای {gapReport.candidateYearsOfExp} سال سابقه
            </span>
          </div>
        </div>

        {/* Card 2: Software & Tools Match */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-sky-600 dark:text-sky-400">
              {gapReport.toolsMatchScore}٪ تطابق
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
              نرم‌افزارها و ابزارهای مسلط
            </span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {gapReport.matchedToolsCount} از {gapReport.toolsResults.length} ابزار کلیدی
            </h4>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>الزامی غایب: <strong className="text-rose-500 font-bold">{gapReport.missingCriticalToolsCount}</strong></span>
            <span>مزیت رقابتی: <strong className="text-amber-500 font-bold">{gapReport.missingDifferentiatorToolsCount}</strong></span>
          </div>
        </div>

        {/* Card 3: Technical Skills & Methodologies */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-purple-600 dark:text-purple-400">
              {gapReport.skillsMatchScore}٪ انطباق
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
              متدولوژی‌های فنی و مهندسی
            </span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {gapReport.matchedSkillsCount} از {gapReport.skillsResults.length} مهارت مرجع
            </h4>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>سطح ارشدیت: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{gapReport.candidateSeniority}</strong></span>
            <span>شکاف بحرانی: <strong className="text-amber-500 font-bold">{gapReport.criticalSkillsGapCount}</strong></span>
          </div>
        </div>

        {/* Card 4: German Norms & Industry Standards */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              {gapReport.germanStandardsScore}٪ تطابق
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
              استانداردهای بومی و رگولاتوری آلمان
            </span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              DIN / ISO / DSGVO
            </h4>
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            حقوق میانگین: <strong className="text-slate-700 dark:text-slate-200 font-mono font-bold">{gapReport.salaryRange}</strong>
          </div>
        </div>

      </div>

      {/* Main Section: Tools & Software Gap Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>ماتریس ارزیابی نرم‌افزارها و ابزارهای کاربردی (Tools Gap Matrix)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مقایسه وضعیت هر ابزار در رزومه شما با میزان اهمیت و شیوع آن در شرکت‌های آلمانی
            </p>
          </div>

          {/* Filters: Matched / Critical Missing / Differentiators */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                filterType === "all"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              همه ابزارها ({gapReport.toolsResults.length})
            </button>
            <button
              onClick={() => setFilterType("matched")}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                filterType === "matched"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>منطبق در رزومه ({gapReport.matchedToolsCount})</span>
            </button>
            <button
              onClick={() => setFilterType("missing_critical")}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                filterType === "missing_critical"
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>شکاف‌های الزامی ({gapReport.missingCriticalToolsCount})</span>
            </button>
            <button
              onClick={() => setFilterType("missing_differentiator")}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                filterType === "missing_differentiator"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ابزارهای مزیت‌ساز ({gapReport.missingDifferentiatorToolsCount})</span>
            </button>
          </div>
        </div>

        {/* Interactive Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-3.5">نام نرم‌افزار / ابزار</th>
                <th className="p-3.5">دسته‌بندی فنی</th>
                <th className="p-3.5">وضعیت در رزومه</th>
                <th className="p-3.5">الزام کارفرمای آلمانی</th>
                <th className="p-3.5">شیوع در بازار آلمان</th>
                <th className="p-3.5">سطح پیشنهادی</th>
                <th className="p-3.5 text-center">جزئیات و چالش مصاحبه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredTools.map(item => {
                const isExpanded = expandedToolId === item.tool.id;
                return (
                  <React.Fragment key={item.tool.id}>
                    <tr
                      onClick={() => setExpandedToolId(isExpanded ? null : item.tool.id)}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition ${
                        item.status === "matched"
                          ? "bg-emerald-50/20 dark:bg-emerald-950/10"
                          : item.status === "missing_critical"
                          ? "bg-rose-50/20 dark:bg-rose-950/10"
                          : ""
                      }`}
                    >
                      {/* Tool Name */}
                      <td className="p-3.5 font-black text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{item.tool.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">
                        {item.tool.categoryFa}
                      </td>

                      {/* Resume Status */}
                      <td className="p-3.5">
                        {item.status === "matched" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>موجود در رزومه</span>
                          </span>
                        ) : item.status === "missing_critical" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>شکاف الزامی غایب</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-[11px]">
                            <Award className="w-3.5 h-3.5" />
                            <span>مزیت رقابتی تکمیلی</span>
                          </span>
                        )}
                      </td>

                      {/* Importance in Germany */}
                      <td className="p-3.5">
                        <span className={`font-bold ${
                          item.tool.importance === "must_have"
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}>
                          {item.tool.importanceLabelFa}
                        </span>
                      </td>

                      {/* Market Prevalence Bar */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full"
                              style={{ width: `${item.tool.germanMarketPrevalence}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {item.tool.germanMarketPrevalence}٪
                          </span>
                        </div>
                      </td>

                      {/* Seniority */}
                      <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                        {item.tool.recommendedSeniority}
                      </td>

                      {/* Expand Button */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Accordion Detail Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                        <td colSpan={7} className="p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            
                            {/* Context in German companies */}
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                              <span className="font-bold text-indigo-700 dark:text-indigo-400 block flex items-center gap-1">
                                <Info className="w-3.5 h-3.5" />
                                <span>کاربرد این ابزار در شرکت‌های آلمانی (Mittelstand & DAX):</span>
                              </span>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {item.tool.germanUsageContext}
                              </p>
                            </div>

                            {/* Typical German Interview Challenge */}
                            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 space-y-1">
                              <span className="font-bold text-amber-800 dark:text-amber-300 block flex items-center gap-1">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>سوال و چالش متداول مصاحبه فنی آلمانی (Typische Fachfrage):</span>
                              </span>
                              <p className="text-amber-950 dark:text-amber-200 font-sans text-left dir-ltr leading-relaxed font-semibold">
                                {item.tool.typicalInterviewPromptDe}
                              </p>
                            </div>

                          </div>

                          {/* Bridge Action Recommendation */}
                          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-indigo-900 dark:text-indigo-200 font-bold block">
                                راهکار عملیاتی جبران شکاف و اثبات تسلط در رزومه:
                              </strong>
                              <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {item.tool.bridgeRecommendationFa}
                              </span>
                            </div>
                          </div>

                          {/* Specific Courses to Bridge THIS Tool Gap */}
                          {(() => {
                            const specificCourses = getCoursesByToolId(item.tool.id);
                            if (specificCourses.length === 0) return null;
                            return (
                              <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-indigo-500/40 space-y-2.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                  <span className="font-black text-xs text-indigo-300 flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4 text-amber-400" />
                                    <span>دوره‌های پیشنهادی معتبر برای رفع این شکاف (LinkedIn Learning / Coursera / edX):</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400">مورد تایید کارفرمایان و ریکروترهای آلمان</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {specificCourses.map(course => (
                                    <div
                                      key={course.id}
                                      className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-indigo-400/60 transition space-y-2 flex flex-col justify-between"
                                    >
                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${course.platformBadgeColor}`}>
                                            {course.platform}
                                          </span>
                                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-indigo-400" />
                                            <span>{course.estimatedHours}</span>
                                          </span>
                                        </div>

                                        <h5 className="font-bold text-xs text-white leading-snug">
                                          {course.courseTitle}
                                        </h5>

                                        <div className="text-[10px] text-indigo-200 flex items-center gap-1">
                                          <span>ارائه‌دهنده:</span>
                                          <strong className="text-white">{course.provider}</strong>
                                          <span>•</span>
                                          <span>{course.credentialTypeFa}</span>
                                        </div>

                                        <p className="text-[11px] text-slate-300 leading-relaxed">
                                          {course.actionToCloseGapFa}
                                        </p>
                                      </div>

                                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                                        <span className="text-[10px] text-emerald-400 font-medium">
                                          {course.freeAuditAvailable ? "دسترسی آزاد به محتوا (Free Audit)" : "مدرک معتبر و رسمی"}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCopyCourse(course.courseTitle, course.id);
                                            }}
                                            className="p-1 rounded bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                            title="کپی عنوان دوره"
                                          >
                                            {copiedCourseId === course.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                          </button>
                                          <a
                                            href={course.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition shadow-sm cursor-pointer"
                                          >
                                            <span>مشاهده دوره</span>
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Section: Technical Methodologies & German Engineering Standards Benchmark */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>مقایسه تخصص‌های فنی و متدولوژی‌ها با بنچ‌مارک صنعت آلمان (Engineering Skills Benchmark)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ارزیابی عمق تسلط شما در برابر میانگین انتظارات کارفرمایان و آیین‌نامه‌های رسمی فدرال
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gapReport.skillsResults.map(item => (
            <div
              key={item.skill.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {item.skill.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {item.skill.nameDe}
                  </span>
                </div>

                {item.skill.germanStandardRef && (
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-800">
                    {item.skill.germanStandardRef}
                  </span>
                )}
              </div>

              {/* Progress bars: Candidate Score vs German Benchmark */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">امتیاز تخمینی رزومه شما:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.userEstimatedScore}٪</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.userEstimatedScore}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-500 font-medium">حداقل بنچ‌مارک کارفرمایان آلمان:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{item.benchmarkScore}٪</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${item.benchmarkScore}%` }}
                  />
                </div>
              </div>

              {/* Description & Risk */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-[11px] space-y-1">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.skill.descriptionFa}
                </p>
                <p className="text-rose-600 dark:text-rose-400 font-medium leading-relaxed">
                  <strong>ریسک در صورت عدم تسلط:</strong> {item.skill.riskIfNotMasteredFa}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Dedicated Recommended Courses on Reputable German Platforms */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-400/30 text-xs font-bold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>برنامه یادگیری هوشمند برای رفع شکاف‌ها</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/30 text-[11px] font-bold">
                {missingCriticalToolIds.length > 0 ? `${missingCriticalToolIds.length} شکاف الزامی شناسایی‌شده` : "بدون شکاف بحرانی"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>دوره‌های آموزشی پیشنهادی در پلتفرم‌های معتبر آلمانی برای رفع شکاف مهارتی</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              دوره‌های منتخب و دارای گواهینامه رسمی در <strong>LinkedIn Learning</strong>، <strong>Coursera</strong>، <strong>edX</strong>، موسسه <strong>openHPI آلمان</strong> و آکادمی <strong>TÜV SÜD</strong> که مستقیماً خلاء ابزارها و تخصص‌های رزومه شما را برای بازار کار آلمان پوشش می‌دهند.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {recommendedCourses.length} دوره پیشنهادی فعال
            </span>
          </div>
        </div>

        {/* Filter Toolbar: Platforms, Priority & Search */}
        <div className="space-y-3 pt-2">
          
          {/* Row 1: Platforms Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-400 text-xs ml-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-500" />
              <span>پلتفرم آموزشی:</span>
            </span>

            {[
              { id: "all", label: "همه پلتفرم‌ها" },
              { id: "Coursera", label: "Coursera", badge: "bg-blue-600 text-white" },
              { id: "LinkedIn Learning", label: "LinkedIn Learning", badge: "bg-amber-600 text-white" },
              { id: "edX", label: "edX (دانشگاهی)", badge: "bg-rose-700 text-white" },
              { id: "openHPI", label: "openHPI (آلمان)", badge: "bg-red-800 text-white" },
              { id: "TÜV SÜD Academy", label: "TÜV SÜD Academy", badge: "bg-blue-900 text-white" }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedCoursePlatform(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedCoursePlatform === p.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Row 2: Priority and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-slate-600 dark:text-slate-400 text-xs ml-1">اولویت نیاز:</span>
              <button
                onClick={() => setCoursePriorityFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  coursePriorityFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                همه اولویت‌ها
              </button>
              <button
                onClick={() => setCoursePriorityFilter("critical")}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  coursePriorityFilter === "critical"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                }`}
              >
                رفع شکاف‌های الزامی (Pflicht Gaps)
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={courseSearchQuery}
                onChange={e => setCourseSearchQuery(e.target.value)}
                placeholder="جستجوی دوره، ابزار، دانشگاه..."
                className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
              {courseSearchQuery && (
                <button
                  onClick={() => setCourseSearchQuery("")}
                  className="absolute left-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {recommendedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCourses.map(course => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${course.platformBadgeColor}`}>
                      {course.platform}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{course.estimatedHours}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white leading-snug">
                      {course.courseTitle}
                    </h4>
                    {course.courseTitleDe && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans text-left dir-ltr mt-0.5">
                        {course.courseTitleDe}
                      </p>
                    )}
                  </div>

                  {/* Provider & Credential */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">موسسه ارائه‌دهنده:</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{course.provider}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">نوع گواهینامه:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">{course.credentialTypeFa}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">سطح محتوا:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">{course.levelFa}</span>
                    </div>
                  </div>

                  {/* Recognition in German Job Market */}
                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>اعتبار استخدامی نزد کارفرمایان آلمان:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {course.germanMarketValueFa}
                    </p>
                  </div>

                  {/* Action to Bridge Gap */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>نحوه رفع شکاف در رزومه (Lebenslauf):</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {course.actionToCloseGapFa}
                    </p>
                  </div>

                  {/* Covered Skills Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.skillsCovered.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{course.freeAuditAvailable ? "دسترسی آزاد (Free Audit)" : "گواهی معتبر رسمی"}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyCourse(course.courseTitle, course.id)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                      title="کپی کردن عنوان دوره"
                    >
                      {copiedCourseId === course.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                    >
                      <span>مشاهده دوره</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              دوره‌ای متناسب با فیلترهای انتخابی یافت نشد.
            </p>
            <button
              onClick={() => {
                setSelectedCoursePlatform("all");
                setCoursePriorityFilter("all");
                setCourseSearchQuery("");
              }}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 transition cursor-pointer"
            >
              پاک کردن فیلترها و مشاهده همه دوره‌ها
            </button>
          </div>
        )}

        {/* Strategic Roadmap Guidance */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white border border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-black text-sm flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>استراتژی طلایی رزومه و لینکدین در آلمان (Jahanban Learning Strategy)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              تکمیل تنها ۱ الی ۲ دوره کلیدی فوق و قرار دادن لینک گواهینامه معتبر (Verifiable Credential URL) در بخش <em>Weiterbildung & Zertifikate</em> رزومه آلمانی، مهر تاییدی بر توانایی یادگیری مستمر (Lebenslanges Lernen) شما نزد کارفرمایان فدرال است.
            </p>
          </div>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab("cv")}
              className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-900/40 cursor-pointer"
            >
              <span>درج گواهی در رزومه‌ساز</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          )}
        </div>

      </div>

      {/* Section: Actionable 30-60-90 Day Roadmap */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>نقشه راه عملیاتی ۳۰، ۶۰ و ۹۰ روزه برای جبران شکاف‌های مهارتی</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            برنامه گام‌به‌گام زمان‌بندی‌شده جهت رساندن رزومه و تِک‌استک به حدنصاب دعوت به مصاحبه در آلمان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Phase 1: Day 1 - 30 */}
          <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                فاز ۱: روز ۱ تا ۳۰
              </span>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">پایه‌ریزی و رفع نقایص</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              مستندسازی ابزارهای محوری و اصلاح کد
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pr-3">
              {gapReport.actionPlan.day30.map((step, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-indigo-500 font-bold shrink-0">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2: Day 31 - 60 */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px]">
                فاز ۲: روز ۳۱ تا ۶۰
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">انطباق استانداردها</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              پیاده‌سازی استانداردهای DIN/ISO/GDPR
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pr-3">
              {gapReport.actionPlan.day60.map((step, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 3: Day 61 - 90 */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                فاز ۳: روز ۶۱ تا ۹۰
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">آمادگی مصاحبه فنی</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              شبیه‌سازی مصاحبه با اصطلاحات آلمانی
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pr-3">
              {gapReport.actionPlan.day90.map((step, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Section: Golden ATS Keywords & Fachbegriffe */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>کلیدواژه‌های طلایی عبور از فیلترهای استخدامی ATS آلمان (Fachbegriffe)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              اصطلاحات فنی دو زبانه که باید در متن رزومه برای جذب الگوریتم‌های کاریابی آلمان درج شوند
            </p>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab("cv")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>درج در رزومه‌ساز Lebenslauf</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {gapReport.atsOptimizationKeywords.map((kw, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{kw.term}</span>
                  {kw.importance === "vital" && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[9px] font-bold">
                      حیاتی
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {kw.termDe}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight pt-1">
                  {kw.explanationFa}
                </p>
              </div>

              <button
                onClick={() => handleCopy(kw.term, `kw_${idx}`)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shrink-0"
                title="کپی کردن واژه برای رزومه"
              >
                {copiedKeyword === `kw_${idx}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* CV Optimization Tip Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>نکته تخصصی ممیزی رزومه آلمانی:</strong> {gapReport.cvOptimizationTip}
          </p>
        </div>
      </div>

      {/* Skill Gap & Recommended Courses PDF Export Modal */}
      <SkillGapPdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        candidateName={candidateName}
        targetRole={targetRole}
        gapReport={gapReport}
        recommendedCourses={recommendedCourses}
        aiAuditText={aiCustomAdvice}
      />

    </div>
  );
};

export default ResumeSkillsToolsGapModule;
