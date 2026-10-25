import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchWithRetry, formatPrintDocumentTitle } from "../utils";
import {
  Calendar,
  Sparkles,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileDown,
  Layers,
  Award,
  AlertTriangle,
  Languages,
  ShieldCheck,
  Building2,
  Euro,
  FileCheck,
  CheckSquare,
  Square,
  ArrowLeft,
  Search,
  Filter,
  Check,
  Printer,
  Download,
  Eye,
  Loader2
} from "lucide-react";
import { RoadmapResponse, MonthlyMilestone, generateRuleBasedMonthlyRoadmap } from "../roadmapHelpers";
import { CareerRoadmapPdfExportModal } from "./CareerRoadmapPdfExportModal";
import { exportRoadmapToPdf } from "../utils/roadmapPdfGenerator";
import { 
  JahanbanPrintHeader, 
  JahanbanPrintWatermark, 
  JahanbanPrintFooter 
} from "./JahanbanPrintLayout";

interface MonthlyRoadmapGeneratorProps {
  profile?: {
    name?: string;
    age?: number;
    degree?: string;
    experience?: number;
    field?: string;
    germanLevel?: string;
    englishLevel?: string;
  };
  onTabChange?: (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview") => void;
}

export default function MonthlyRoadmapGenerator({ profile, onTabChange }: MonthlyRoadmapGeneratorProps) {
  // Form input states
  const [degree, setDegree] = useState<string>(profile?.degree || "bachelor");
  const [field, setField] = useState<string>(profile?.field || "مهندسی نرم‌افزار و IT");
  const [experience, setExperience] = useState<number>(profile?.experience !== undefined ? profile.experience : 3);
  const [germanLevel, setGermanLevel] = useState<string>(profile?.germanLevel || "B1");
  const [englishLevel, setEnglishLevel] = useState<string>(profile?.englishLevel || "B2");
  const [timelineMonths, setTimelineMonths] = useState<number>(6);
  const [weeklyHours, setWeeklyHours] = useState<number>(20);
  const [applicantName, setApplicantName] = useState<string>(profile?.name || "متقاضی محترم");

  // Generator & UI states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null);
  const [selectedMonthTab, setSelectedMonthTab] = useState<number | "all">("all");
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 1: true });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("germany_monthly_roadmap_tasks");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isPrintingRoadmap, setIsPrintingRoadmap] = useState<boolean>(false);
  const [isExportingDirectPdf, setIsExportingDirectPdf] = useState<boolean>(false);
  const [directPdfSuccess, setDirectPdfSuccess] = useState<boolean>(false);
  const [directPdfStatus, setDirectPdfStatus] = useState<string>("");

  // Formal Date and Reference ID computation for Document Header & Footer
  const now = new Date();
  let dateFa = "۱۸ شهریور ۱۴۰۵";
  let dateEn = "08.09.2026";
  try {
    dateFa = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(now);
    dateEn = new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);
  } catch {
    // Fallback
  }
  const displayDate = `${dateFa} (${dateEn})`;
  const candidateId = (applicantName && applicantName.trim() !== "متقاضی محترم" && applicantName !== "کاربر نمونه")
    ? applicantName.replace(/\s+/g, "").slice(0, 5).toUpperCase()
    : "REG";
  const docId = `JB-DE-2026-ROADMAP-${candidateId}`;

  // Listen to beforeprint / afterprint events so that if user hits Ctrl+P, all milestones expand automatically
  useEffect(() => {
    const handleBeforePrint = () => {
      setIsPrintingRoadmap(true);
      document.body.classList.add("print-target-roadmap");
    };
    const handleAfterPrint = () => {
      setIsPrintingRoadmap(false);
      document.body.classList.remove("print-target-roadmap");
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // Download Roadmap as PDF: triggers browser print-to-PDF leveraging formal existing CSS print styles
  const handleDownloadRoadmap = () => {
    setIsPrintingRoadmap(true);
    document.body.classList.add("print-target-roadmap");

    // Format formal title for browser's print-to-PDF default filename
    const originalTitle = document.title;
    const cleanName = (applicantName && applicantName.trim() !== "" && applicantName !== "کاربر نمونه")
      ? applicantName
      : (profile?.name || "Applicant");
    const printDocTitle = formatPrintDocumentTitle("نقشه راه مهاجرت کاری آلمان", cleanName);
    document.title = printDocTitle;

    const cleanup = () => {
      document.body.classList.remove("print-target-roadmap");
      document.title = originalTitle;
      setIsPrintingRoadmap(false);
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);

    setTimeout(() => {
      window.print();
      // Fallback cleanup if afterprint event doesn't fire
      setTimeout(cleanup, 2500);
    }, 200);
  };

  // Direct High-Resolution PDF Download using jsPDF and html2canvas
  const handleDirectPdfDownload = async () => {
    setIsExportingDirectPdf(true);
    setDirectPdfSuccess(false);
    setDirectPdfStatus("در حال آماده‌سازی سند نقشه راه و بارگذاری تایپوگرافی...");
    try {
      const cleanName = (applicantName && applicantName.trim() !== "" && applicantName !== "کاربر نمونه")
        ? applicantName
        : (profile?.name || "Applicant");
      const sanitized = cleanName.replace(/[^\w\u0600-\u06FF\s-]/g, "").trim().replace(/\s+/g, "_");
      const filename = `German_Immigration_Roadmap_Plan_${sanitized}.pdf`;

      await exportRoadmapToPdf({
        profile: {
          name: cleanName,
          field,
          experience,
          degree,
          germanLevel,
          englishLevel,
          age: profile?.age || 30
        },
        roadmapData,
        completedTasks,
        sections: {
          includeMonthlyMilestones: true,
          includeWeeklySprints: true,
          include6StepsRoadmap: true,
          includeJobDescription: true,
          includeComparison: true
        }
      }, filename, {
        onProgress: (percent, statusText) => {
          setDirectPdfStatus(statusText);
        }
      });

      setDirectPdfSuccess(true);
      setTimeout(() => setDirectPdfSuccess(false), 4500);
    } catch (err) {
      console.error("Direct Roadmap PDF generation error:", err);
      // Fallback: trigger print
      handleDownloadRoadmap();
    } finally {
      setIsExportingDirectPdf(false);
    }
  };

  // Sync with incoming profile changes (guarded by value checks and primitive dependencies)
  useEffect(() => {
    if (profile) {
      if (profile.degree && profile.degree !== degree) setDegree(profile.degree);
      if (profile.field && profile.field !== field) setField(profile.field);
      if (profile.experience !== undefined && profile.experience !== experience) setExperience(profile.experience);
      if (profile.germanLevel && profile.germanLevel !== germanLevel) setGermanLevel(profile.germanLevel);
      if (profile.englishLevel && profile.englishLevel !== englishLevel) setEnglishLevel(profile.englishLevel);
      if (profile.name && profile.name.trim() && profile.name.trim() !== applicantName) setApplicantName(profile.name.trim());
    }
  }, [profile?.degree, profile?.field, profile?.experience, profile?.germanLevel, profile?.englishLevel, profile?.name]);

  // Initial load: generate baseline roadmap if none exists
  useEffect(() => {
    const initialInput = {
      degree: profile?.degree || degree,
      field: profile?.field || field,
      experience: profile?.experience !== undefined ? profile.experience : experience,
      germanLevel: profile?.germanLevel || germanLevel,
      englishLevel: profile?.englishLevel || englishLevel,
      timelineMonths: timelineMonths,
      weeklyHours: weeklyHours,
      applicantName: profile?.name || applicantName,
    };
    const defaultData = generateRuleBasedMonthlyRoadmap(initialInput);
    setRoadmapData(defaultData);
  }, []);

  // Save checked tasks to localStorage
  const toggleTask = (monthNum: number, taskIndex: number) => {
    const taskKey = `m${monthNum}_t${taskIndex}`;
    setCompletedTasks((prev) => {
      const updated = { ...prev, [taskKey]: !prev[taskKey] };
      try {
        localStorage.setItem("germany_monthly_roadmap_tasks", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const toggleMonthExpansion = (monthNum: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthNum]: !prev[monthNum],
    }));
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const response = await fetchWithRetry("/api/gemini/generate-monthly-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          degree,
          field,
          experience,
          germanLevel,
          englishLevel,
          timelineMonths,
          weeklyHours,
          applicantName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmapData(data);
      } else {
        // Fallback to local rule-based engine
        const fallback = generateRuleBasedMonthlyRoadmap({
          degree,
          field,
          experience,
          germanLevel,
          englishLevel,
          timelineMonths,
          weeklyHours,
          applicantName,
        });
        setRoadmapData(fallback);
      }
    } catch (error) {
      console.error("Error generating AI roadmap:", error);
      const fallback = generateRuleBasedMonthlyRoadmap({
        degree,
        field,
        experience,
        germanLevel,
        englishLevel,
        timelineMonths,
        weeklyHours,
        applicantName,
      });
      setRoadmapData(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  // Popular field presets for 1-click selection
  const fieldPresets = [
    { label: "مهندسی نرم‌افزار / IT", value: "مهندسی نرم‌افزار و توسعه وب / Cloud", degree: "bachelor" },
    { label: "پرستاری و کادر درمان", value: "پرستاری بالینی و مراقبت سلامت (Pflegefachkraft)", degree: "bachelor" },
    { label: "مهندسی مکانیک و ساخت", value: "مهندسی مکانیک، ساخت و تولید و CAD", degree: "bachelor" },
    { label: "مهندسی عمران و سازه", value: "مهندسی عمران، سازه و مدیریت پروژه ساختمانی", degree: "master" },
    { label: "هوش مصنوعی و علم داده", value: "متخصص هوش مصنوعی، یادگیری ماشین و Data Science", degree: "master" },
    { label: "مهندسی برق و الکترونیک", value: "مهندسی برق، اتوماسیون صنعتی و PLC", degree: "bachelor" },
    { label: "مدیریت و تحلیل کسب‌وکار", value: "مدیریت پروژه، تحلیل فرآیند و SAP/BI", degree: "master" },
    { label: "فنی‌وحرفه‌ای / تکنسین", value: "تکنسین برق، مکانیک خودرو و تاسیسات صنعتی", degree: "diploma" },
  ];

  // Calculate overall task completion percentage
  const calculateOverallProgress = () => {
    if (!roadmapData || !roadmapData.monthlyMilestones.length) return 0;
    let totalTasks = 0;
    let completedCount = 0;

    roadmapData.monthlyMilestones.forEach((m) => {
      m.actionChecklist.forEach((_, tIdx) => {
        totalTasks++;
        if (completedTasks[`m${m.monthNumber}_t${tIdx}`]) {
          completedCount++;
        }
      });
    });

    if (totalTasks === 0) return 0;
    return Math.round((completedCount / totalTasks) * 100);
  };

  const overallProgress = calculateOverallProgress();

  // Open Printable PDF Export Modal (with high-res print, offline HTML, and copy features)
  const handlePrintRoadmap = () => {
    setIsPdfModalOpen(true);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "documents":
        return { label: "مدارک و ارزشیابی (ZAB)", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "language":
        return { label: "تقویت زبان و رزومه", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "portfolio":
        return { label: "پورتفولیو و لینکدین", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "applications":
        return { label: "ارسال اپلیکیشن و کاریابی", color: "bg-teal-500/10 text-teal-400 border-teal-500/20" };
      case "interviews":
        return { label: "مصاحبه‌ها و قرارداد کار", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "visa":
        return { label: "ویزا و استقرار در آلمان", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
      default:
        return { label: "برنامه‌ریزی اجرایی", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print-document-sheet relative" id="monthly-roadmap-generator-card">
      {/* Official Jahanban Print Layout for Formal Roadmap Plan */}
      <JahanbanPrintHeader 
        subject={applicantName && applicantName !== "متقاضی محترم" ? `سند رسمی نقشه راه مهاجرت کاری و برنامه‌ریزی ماهانه: ${applicantName}` : "سند رسمی نقشه راه مهاجرت کاری و برنامه‌ریزی ماهانه آلمان (FEG 2026)"}
        docId={docId}
        displayDate={displayDate}
        className="roadmap-print-header"
      />
      <JahanbanPrintWatermark className="roadmap-print-watermark" />

      {/* Formal Candidate Profile Dossier Box in Print & Simulation */}
      <div className="print-only hidden p-4 bg-slate-50 border border-slate-300 rounded-xl mb-4 text-xs text-slate-800 print-break-inside-avoid" id="roadmap-print-candidate-profile">
        <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-2.5">
          <h3 className="font-bold text-sm text-indigo-950">
            خلاصه مشخصات متقاضی و پرونده مهاجرتی (Applicant Dossier Overview)
          </h3>
          <span className="text-[11px] font-mono text-slate-600 font-bold">Doc ID: {docId}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
          <div><span className="text-slate-500 font-medium text-[11px]">نام متقاضی:</span> <strong className="text-slate-900 block text-xs">{applicantName || "متقاضی محترم"}</strong></div>
          <div><span className="text-slate-500 font-medium text-[11px]">سن:</span> <strong className="text-slate-900 block text-xs">{profile?.age || 30} سال</strong></div>
          <div><span className="text-slate-500 font-medium text-[11px]">رشته / تخصص:</span> <strong className="text-indigo-900 block text-xs">{field}</strong></div>
          <div><span className="text-slate-500 font-medium text-[11px]">مدرک تحصیلی:</span> <strong className="text-slate-900 block text-xs">{degree}</strong></div>
          <div><span className="text-slate-500 font-medium text-[11px]">سابقه کار تخصصی:</span> <strong className="text-slate-900 block text-xs">{experience} سال</strong></div>
          <div><span className="text-slate-500 font-medium text-[11px]">سطح زبان آلمانی:</span> <strong className="text-slate-900 block text-xs">{germanLevel}</strong></div>
          <div><span className="text-slate-500 font-medium text-[11px]">سطح زبان انگلیسی:</span> <strong className="text-slate-900 block text-xs">{englishLevel}</strong></div>
          <div><span className="text-slate-500 font-medium text-[11px]">بازه زمانی هدف:</span> <strong className="text-emerald-800 block text-xs">{timelineMonths} ماهه ({roadmapData?.overview.recommendedPathway || "مسیر استاندارد"})</strong></div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 text-right max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>موتور هوش مصنوعی تدوین نقشه راه ماه به ماه (Monthly Milestones AI)</span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-snug">
              برنامه‌ریزی ماه به ماه مهاجرت کاری بر اساس <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-teal-300 to-indigo-300">مدرک و تخصص شغلی شما</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              این سیستم هوشمند کلیه اقدامات لازم (از ارزشیابی دانشگاه در آنابین و ZAB تا آزمون زبان، رزومه Lebenslauf، اپلای روزانه، مصاحبه ویزا و ثبت نام شهرداری آلمان) را به مایل‌استون‌های ماهانه و هفتگی دقیق تبدیل می‌کند.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3 shrink-0 no-print">
            <button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
              id="generate-monthly-roadmap-btn"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>در حال پردازش هوش مصنوعی...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>تولید و بازطراحی نقشه راه</span>
                </>
              )}
            </button>

            {/* Primary Action: Download as PDF leveraging existing CSS print styles */}
            <button
              onClick={handleDownloadRoadmap}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/40 transition-all cursor-pointer"
              title="دانلود مستقیم سند رسمی نقشه راه به صورت فایل PDF استاندارد A4 با بهره‌گیری از استایل‌های حرفه‌ای چاپ (CSS Print Styles)"
              id="btn-download-roadmap-pdf-print"
            >
              <Download className="w-4 h-4 text-emerald-100" />
              <span>دانلود به عنوان PDF (Download as PDF)</span>
            </button>

            {/* Direct PDF Alternative (jsPDF + html2canvas) */}
            <button
              onClick={handleDirectPdfDownload}
              disabled={isExportingDirectPdf}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="دانلود مستقیم سند نقشه راه با موتور رندرینگ داخلی jsPDF"
              id="btn-download-roadmap-direct-pdf"
            >
              {isExportingDirectPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{directPdfStatus || "در حال تولید PDF..."}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-indigo-300" />
                  <span>دانلود مستقیم (jsPDF)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrintRoadmap}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-800 text-slate-300 font-medium text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              title="سفارشی‌سازی بخش‌های درج‌شده در سند چاپی"
              id="export-pdf-monthly-schedule-btn"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>سفارشی‌سازی PDF</span>
            </button>
          </div>
        </div>

        {directPdfSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in no-print mt-3">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>فایل PDF نقشه راه مهاجرت کاری با موفقیت توسط کتابخانه jsPDF تولید و در دستگاه شما دانلود شد.</span>
          </div>
        )}
      </div>

      {/* Interactive Controls & Profile Customizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 no-print" id="roadmap-controls-customizer">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-right">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white">شخصی‌سازی فاکتورهای نقشه راه (مدرک، رشته و بازه زمانی)</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">قوانین مهاجرتی ۲۰۲۶</span>
        </div>

        {/* Quick Field Presets */}
        <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-slate-300 block">
            انتخاب سریع رشته‌های پرتقاضا در آلمان:
          </label>
          <div className="flex flex-wrap gap-2">
            {fieldPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setField(preset.value);
                  setDegree(preset.degree);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                  field === preset.value
                    ? "bg-indigo-600/30 border-indigo-400 text-white shadow-sm"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
          {/* Degree */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              مدرک تحصیلی شما:
            </label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="phd">دکتری تخصصی (PhD / Doctorate)</option>
              <option value="master">کارشناسی ارشد (Master)</option>
              <option value="bachelor">کارشناسی (Bachelor / لیسانس)</option>
              <option value="associate">کاردانی (فوق دیپلم)</option>
              <option value="diploma">دیپلم متوسطه / فنی و حرفه‌ای</option>
              <option value="none">سوابق تجربی بدون مدرک آکادمیک (ویژه IT)</option>
            </select>
          </div>

          {/* Field Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              رشته و عنوان شغلی دقیق:
            </label>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="مثال: توسعه‌دهنده فرانت‌اند، مهندس مکانیک..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Timeline Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              بازه زمانی هدف (طول نقشه راه):
            </label>
            <select
              value={timelineMonths}
              onChange={(e) => setTimelineMonths(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value={6}>۶ ماهه (برنامه فوق فشرده / Fast-Track)</option>
              <option value={9}>۹ ماهه (برنامه متعادل و استاندارد)</option>
              <option value={12}>۱۲ ماهه (یک ساله با تقویت عمیق زبان)</option>
              <option value={18}>۱۸ ماهه (برنامه جامع با معادل‌سازی کامل)</option>
            </select>
          </div>

          {/* German Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              سطح زبان آلمانی فعلی:
            </label>
            <select
              value={germanLevel}
              onChange={(e) => setGermanLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="A0">مبتدی کامل (بدون تسلط / A0)</option>
              <option value="A1">مقدماتی (A1)</option>
              <option value="A2">پایه متوسط (A2)</option>
              <option value="B1">متوسط کاری (B1)</option>
              <option value="B2">پیشرفته حرفه‌ای (B2)</option>
              <option value="C1">فوق پیشرفته و روان (C1)</option>
            </select>
          </div>
        </div>
      </div>

      {roadmapData && (
        <>
          {/* Executive Strategy Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1 text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>تحلیل استراتژیک مسیر ({roadmapData.overview.totalDurationMonths} ماهه)</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white">
                  مسیر پیشنهادی بر اساس مدرک: <span className="text-emerald-400">{roadmapData.overview.recommendedPathway}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {roadmapData.overview.summaryInsight}
                </p>
              </div>

              {/* Overall Progress Gauge & Download Roadmap Action */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 no-print">
                <button
                  onClick={handleDirectPdfDownload}
                  disabled={isExportingDirectPdf}
                  className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="دانلود مستقیم سند نقشه راه به صورت فایل PDF با jsPDF و html2canvas"
                  id="roadmap-overview-download-direct-pdf-btn"
                >
                  {isExportingDirectPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{directPdfStatus || "در حال تولید PDF..."}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-200" />
                      <span>دانلود مستقیم PDF (با jsPDF)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadRoadmap}
                  className="w-full sm:w-auto px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  title="چاپ یا ذخیره سند نقشه راه از طریق کادر پرینت مرورگر"
                  id="roadmap-overview-print-btn"
                >
                  <Printer className="w-4 h-4 text-indigo-300" />
                  <span>پرینت مرورگر</span>
                </button>

                <button
                  onClick={handlePrintRoadmap}
                  className="w-full sm:w-auto px-3.5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-2xl text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  title="سفارشی‌سازی بخش‌های سند چاپی"
                  id="roadmap-overview-pdf-btn"
                >
                  <FileDown className="w-4 h-4 text-slate-400" />
                  <span>سفارشی‌سازی</span>
                </button>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-400 transition-all duration-500"
                        strokeDasharray={`${overallProgress}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-white">{overallProgress}%</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">پیشرفت کلی پرونده</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">تکمیل اقدامات مایل‌استون‌ها</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
              {/* Advantage */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5 print-break-inside-avoid">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <h4 className="text-xs font-black">مزیت قانونی مدرک تحصیلی شما</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {roadmapData.degreeAndFieldHighlights.legalAdvantage}
                </p>
              </div>

              {/* Challenge */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5 print-break-inside-avoid">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-xs font-black">چالش اصلی در این تخصص</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {roadmapData.degreeAndFieldHighlights.mainChallenge}
                </p>
              </div>

              {/* Requirement */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-1.5 print-break-inside-avoid">
                <div className="flex items-center gap-2 text-indigo-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4 className="text-xs font-black">اقدام حیاتی و کلیدی الزامی</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {roadmapData.degreeAndFieldHighlights.criticalRequirement}
                </p>
              </div>
            </div>

            {/* Key Checkpoints Track */}
            {roadmapData.keyCheckpoints && roadmapData.keyCheckpoints.length > 0 && (
              <div className="pt-2 print-break-inside-avoid">
                <h4 className="text-xs font-black text-slate-300 mb-3 text-right flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>چک‌پوینت‌های کلیدی تصمیم‌گیری (Gateways):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-right">
                  {roadmapData.keyCheckpoints.map((cp, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-400">ماه {cp.month}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Gateway #{idx + 1}</span>
                      </div>
                      <p className="text-xs font-bold text-white">{cp.title}</p>
                      <p className="text-[10px] text-slate-400">{cp.criterion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Filter Tabs & Month Selection Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl no-print" id="roadmap-month-tabs-bar">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedMonthTab("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedMonthTab === "all"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                نمایش تمام ماه‌ها ({roadmapData.monthlyMilestones.length} ماه)
              </button>

              {roadmapData.monthlyMilestones.map((m) => {
                const isSelected = selectedMonthTab === m.monthNumber;
                return (
                  <button
                    key={m.monthNumber}
                    onClick={() => setSelectedMonthTab(m.monthNumber)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    ماه {m.monthNumber}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Direct PDF Download with jsPDF in Filter Bar */}
              <button
                type="button"
                onClick={handleDirectPdfDownload}
                disabled={isExportingDirectPdf}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                title="دانلود مستقیم سند رسمی نقشه راه به صورت فایل PDF استاندارد با jsPDF"
                id="btn-download-roadmap-bar"
              >
                {isExportingDirectPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-emerald-200" />
                )}
                <span>دانلود مستقیم PDF (jsPDF)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadRoadmap}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 active:scale-95 cursor-pointer"
                title="چاپ یا ذخیره از طریق مرورگر"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-300" />
                <span>پرینت</span>
              </button>

              <button
                type="button"
                onClick={handlePrintRoadmap}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border border-slate-800 active:scale-95 cursor-pointer"
                title="سفارشی‌سازی بخش‌های سند چاپی"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
                <span>تنظیمات</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 pr-2">
                <Filter className="w-3.5 h-3.5" />
                <span>فیلتر:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">همه دسته‌ها</option>
                  <option value="documents">مدارک و ارزشیابی ZAB</option>
                  <option value="language">زبان و رزومه</option>
                  <option value="portfolio">پورتفولیو و شبکه‌سازی</option>
                  <option value="applications">اپلای و ارسال درخواست</option>
                  <option value="interviews">مصاحبه و قرارداد</option>
                  <option value="visa">ویزا و ورود به آلمان</option>
                </select>
              </div>
            </div>
          </div>

          {/* Month by Month Milestone Cards */}
          <div className="space-y-6">
            {roadmapData.monthlyMilestones
              .filter((m) => (isPrintingRoadmap || selectedMonthTab === "all" ? true : m.monthNumber === selectedMonthTab))
              .filter((m) => (isPrintingRoadmap || categoryFilter === "all" ? true : m.category === categoryFilter))
              .map((milestone) => {
                const isExpanded = isPrintingRoadmap || (expandedMonths[milestone.monthNumber] ?? true);
                const badge = getCategoryBadge(milestone.category);

                // Calculate month completion
                const monthTotalTasks = milestone.actionChecklist.length;
                const monthCompletedTasks = milestone.actionChecklist.filter(
                  (_, tIdx) => completedTasks[`m${milestone.monthNumber}_t${tIdx}`]
                ).length;
                const monthProgress = monthTotalTasks > 0 ? Math.round((monthCompletedTasks / monthTotalTasks) * 100) : 0;

                return (
                  <motion.div
                    key={milestone.monthNumber}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl shadow-xl overflow-hidden text-right transition-all print-break-inside-avoid print-card"
                  >
                    {/* Milestone Header */}
                    <div
                      onClick={() => toggleMonthExpansion(milestone.monthNumber)}
                      className="p-5 md:p-6 bg-slate-950/70 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-950 transition"
                    >
                      <div className="flex items-start md:items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">
                          {milestone.monthNumber}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              هزینه تقریبی: <strong className="text-emerald-400">{milestone.estimatedCostEur}€</strong> ({milestone.estimatedCostIrr})
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-black text-white">
                            {milestone.monthTitle}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${monthProgress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-300 font-mono">{monthProgress}%</span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300 no-print">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Milestone Details Collapsible Body */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 md:p-6 space-y-6 roadmap-milestone-body"
                        >
                          {/* Primary Goal Banner */}
                          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs sm:text-sm font-medium leading-relaxed">
                            <strong className="text-indigo-400 block mb-1 font-bold">هدف استراتژیک این ماه:</strong>
                            {milestone.primaryGoal}
                          </div>

                          {/* 4 Weekly Sprints */}
                          {milestone.weeklySprints && milestone.weeklySprints.length > 0 && (
                            <div className="space-y-2.5 print-break-inside-avoid">
                              <h5 className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                                <span>تفکیک برنامه‌ریزی هفتگی (Weekly Mini-Sprints):</span>
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {milestone.weeklySprints.map((ws) => (
                                  <div key={ws.week} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                                    <span className="text-[10px] font-bold text-teal-400 block">هفته {ws.week}</span>
                                    <p className="text-xs font-bold text-white">{ws.title}</p>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">{ws.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actionable Tasks Checklist */}
                          <div className="space-y-3 print-break-inside-avoid">
                            <h5 className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>چک‌لیست اقدامات اجرایی این ماه (اقدام کنید و تیک بزنید):</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {milestone.actionChecklist.map((task, tIdx) => {
                                const isChecked = !!completedTasks[`m${milestone.monthNumber}_t${tIdx}`];
                                return (
                                  <div
                                    key={tIdx}
                                    onClick={() => toggleTask(milestone.monthNumber, tIdx)}
                                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all duration-150 select-none ${
                                      isChecked
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                                        : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                                    }`}
                                  >
                                    <div className="mt-0.5 shrink-0">
                                      {isChecked ? (
                                        <div className="w-4 h-4 rounded bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                                          ✓
                                        </div>
                                      ) : (
                                        <div className="w-4 h-4 rounded border border-slate-600 hover:border-slate-400" />
                                      )}
                                    </div>
                                    <span className={`text-xs font-medium leading-relaxed ${isChecked ? "line-through opacity-80" : ""}`}>
                                      {task}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Field Specific Advice Box */}
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 print-break-inside-avoid">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                              توصیه تخصصی متناسب با رشته {field} و مدرک {degree}:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {milestone.fieldSpecificAdvice}
                            </p>
                          </div>

                          {/* Footer Info: Authority link & Risk Tip */}
                          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">مرجع رسمی قانونی:</span>
                              <a
                                href={milestone.officialAuthorityUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1 underline underline-offset-2"
                              >
                                <span>{milestone.officialAuthority}</span>
                                <ExternalLink className="w-3 h-3 no-print" />
                              </a>
                            </div>

                            <div className="text-[11px] text-amber-300/90 font-medium">
                              <strong>نکته طلایی و پیشگیری از تاخیر:</strong> {milestone.riskFactorAndTip}
                            </div>
                          </div>

                          {/* App Tool Shortcut Buttons */}
                          <div className="pt-2 flex flex-wrap gap-2 no-print">
                            {onTabChange && (
                              <>
                                {milestone.category === "language" && (
                                  <button
                                    onClick={() => onTabChange("cv")}
                                    className="text-xs px-3 py-1.5 bg-indigo-650/30 hover:bg-indigo-650/50 border border-indigo-500/40 text-indigo-300 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
                                  >
                                    <span>انتقال به رزومه‌ساز استاندارد آلمانی</span>
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {milestone.category === "documents" && (
                                  <button
                                    onClick={() => onTabChange("chancenkarte")}
                                    className="text-xs px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
                                  >
                                    <span>محاسبه امتیاز در کارت فرصت</span>
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {milestone.category === "applications" && (
                                  <button
                                    onClick={() => onTabChange("jobs")}
                                    className="text-xs px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
                                  >
                                    <span>مشاهده موقعیت‌های اسپانسرشیپ ویزا</span>
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {milestone.category === "interviews" && (
                                  <button
                                    onClick={() => onTabChange("interview")}
                                    className="text-xs px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
                                  >
                                    <span>تمرین در شبیه‌ساز مصاحبه هوشمند</span>
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
          </div>

          {/* 6-Stage Core Migration Milestones Table for Formal Printout */}
          <div className="print-only hidden p-4 bg-slate-50 border border-slate-300 rounded-xl mt-6 text-xs text-slate-800 print-break-inside-avoid" id="roadmap-print-6steps-summary">
            <h3 className="font-bold text-sm text-indigo-950 border-b border-slate-300 pb-1.5 mb-2.5 flex items-center justify-between">
              <span>ساختار کلان ۶ مرحله‌ای فرآیند مهاجرت کاری به آلمان (Core 6-Stage Roadmap)</span>
              <span className="text-[11px] text-slate-500 font-normal">منطبق با قانون مهاجرت ماهر ۲۰۲۶</span>
            </h3>
            <table className="w-full text-right text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 border border-slate-300 w-12 text-center">مرحله</th>
                  <th className="p-2 border border-slate-300 font-bold">عنوان اقدام اصلی</th>
                  <th className="p-2 border border-slate-300 font-bold">مراجع و الزامات قانونی فدرال</th>
                  <th className="p-2 border border-slate-300 w-28 text-center font-bold">بازه تقریبی</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300 text-center font-bold">۱</td>
                  <td className="p-2 border border-slate-300 font-bold text-indigo-900">ارزیابی دانشگاه و مدارک تحصیلی (ZAB / Anabin)</td>
                  <td className="p-2 border border-slate-300">تطبیق مدرک با استاندارد H+ یا ارسال به ZAB جهت دریافت Zeugnisbewertung (€200)</td>
                  <td className="p-2 border border-slate-300 text-center font-medium">ماه ۱ تا ۲</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 text-center font-bold">۲</td>
                  <td className="p-2 border border-slate-300 font-bold text-indigo-900">ارتقای سطح زبان آلمانی یا انگلیسی</td>
                  <td className="p-2 border border-slate-300">دریافت مدرک گوته/تلک (حداقل A1 برای کارت فرصت، B1/B2 جهت مشاغل تخصصی)</td>
                  <td className="p-2 border border-slate-300 text-center font-medium">ماه ۱ تا ۴</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 text-center font-bold">۳</td>
                  <td className="p-2 border border-slate-300 font-bold text-indigo-900">نگارش رزومه آلمانی (Lebenslauf) و پورتفولیو</td>
                  <td className="p-2 border border-slate-300">رزومه دو صفحه‌ای با استانداردهای Europass / DIN 5008 همراه انگیزش‌نامه (Anschreiben)</td>
                  <td className="p-2 border border-slate-300 text-center font-medium">ماه ۲ تا ۳</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 text-center font-bold">۴</td>
                  <td className="p-2 border border-slate-300 font-bold text-indigo-900">کمپین فعال ارسال درخواست کار (Bewerbung)</td>
                  <td className="p-2 border border-slate-300">ارسال روزانه به شرکت‌های آلمانی و پورتال‌های رسمی (StepStone, LinkedIn, Indeed)</td>
                  <td className="p-2 border border-slate-300 text-center font-medium">ماه ۳ تا ۵</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 text-center font-bold">۵</td>
                  <td className="p-2 border border-slate-300 font-bold text-indigo-900">مصاحبه کاری، عقد قرارداد و وقت سفارت</td>
                  <td className="p-2 border border-slate-300">دریافت قرارداد کار / تاییدیه کارت فرصت، بیمه مسافرتی و ویزامتریک (Visametric €75)</td>
                  <td className="p-2 border border-slate-300 text-center font-medium">ماه ۴ تا ۶</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 text-center font-bold">۶</td>
                  <td className="p-2 border border-slate-300 font-bold text-indigo-900">ورود به آلمان، اجاره مسکن و ثبت شهرداری (Anmeldung)</td>
                  <td className="p-2 border border-slate-300">ثبت در شهرداری (Bürgeramt)، افتتاح حساب بانکی و دریافت کارت اقامت الکترونیک (eAT)</td>
                  <td className="p-2 border border-slate-300 text-center font-medium">ماه ۶+</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Official Jahanban Footer for Roadmap Plan */}
          <JahanbanPrintFooter 
            docId={docId}
            displayDate={displayDate}
            className="roadmap-print-footer"
          />
        </>
      )}

      {/* Printable PDF Export Modal with Customization Controls */}
      <CareerRoadmapPdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        profile={{
          name: applicantName,
          age: profile?.age || 29,
          degree,
          field,
          experience,
          germanLevel,
          englishLevel
        }}
        roadmapData={roadmapData}
        completedTasks={completedTasks}
        defaultExportMode="all"
      />
    </div>
  );
}
