import React, { useState } from "react";
import { 
  FileDown, 
  Printer, 
  X, 
  Check, 
  Copy, 
  Download, 
  Calendar, 
  Briefcase, 
  Award, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Sparkles, 
  FileText,
  ChevronRight,
  Eye,
  CheckCircle2,
  Wrench,
  GraduationCap,
  Loader2,
  AlertCircle
} from "lucide-react";
import { MonthlyRoadmapPlan, generateRuleBasedMonthlyRoadmap } from "../utils/monthlyRoadmapGenerator";
import { 
  JobComparisonData, 
  getClientJobComparison 
} from "../utils/jobComparisonData";
import { formatPrintDocumentTitle, triggerPrintWithTitle } from "../utils";
import { exportToPdfWithHtml2Pdf } from "../utils/html2pdfExporter";

interface CareerRoadmapPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name?: string;
    field?: string;
    experience?: number;
    germanLevel?: string;
    englishLevel?: string;
    degree?: string;
    age?: number;
    skills?: string;
  };
  roadmapData?: MonthlyRoadmapPlan | null;
  jobComparisonData?: JobComparisonData | null;
  completedTasks?: Record<string, boolean>;
  defaultExportMode?: "all" | "checklist_only" | "full_dossier";
}

export const CareerRoadmapPdfExportModal: React.FC<CareerRoadmapPdfExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  roadmapData,
  jobComparisonData,
  completedTasks,
  defaultExportMode = "all"
}) => {
  const [includeMonthlyMilestones, setIncludeMonthlyMilestones] = useState(true);
  const [includeWeeklySprints, setIncludeWeeklySprints] = useState(true);
  const [include6StepsRoadmap, setInclude6StepsRoadmap] = useState(true);
  const [includeJobDescription, setIncludeJobDescription] = useState(defaultExportMode !== "checklist_only");
  const [includeToolsAndReports, setIncludeToolsAndReports] = useState(defaultExportMode !== "checklist_only");
  const [includePeerBenchmark, setIncludePeerBenchmark] = useState(defaultExportMode !== "checklist_only");
  const [includeComparison, setIncludeComparison] = useState(defaultExportMode !== "checklist_only");
  const [includeSeniority, setIncludeSeniority] = useState(true);
  const [includePhrases, setIncludePhrases] = useState(defaultExportMode !== "checklist_only");
  const [activePreset, setActivePreset] = useState<"all" | "checklist" | "tools">(
    defaultExportMode === "checklist_only" ? "checklist" : "all"
  );
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfStatus, setPdfStatus] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [exportError, setExportError] = useState("");

  // Load completed tasks fallback from localStorage if not passed
  const effectiveCompletedTasks: Record<string, boolean> = React.useMemo(() => {
    if (completedTasks && Object.keys(completedTasks).length > 0) return completedTasks;
    try {
      const saved = localStorage.getItem("germany_monthly_roadmap_tasks");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, [completedTasks]);

  const applyPreset = (preset: "all" | "checklist" | "tools") => {
    setActivePreset(preset);
    if (preset === "checklist") {
      setIncludeMonthlyMilestones(true);
      setIncludeWeeklySprints(true);
      setInclude6StepsRoadmap(true);
      setIncludeJobDescription(false);
      setIncludeToolsAndReports(false);
      setIncludePeerBenchmark(false);
      setIncludeComparison(false);
      setIncludePhrases(false);
    } else if (preset === "all") {
      setIncludeMonthlyMilestones(true);
      setIncludeWeeklySprints(true);
      setInclude6StepsRoadmap(true);
      setIncludeJobDescription(true);
      setIncludeToolsAndReports(true);
      setIncludePeerBenchmark(true);
      setIncludeComparison(true);
      setIncludePhrases(true);
    } else if (preset === "tools") {
      setIncludeMonthlyMilestones(false);
      setIncludeWeeklySprints(false);
      setInclude6StepsRoadmap(false);
      setIncludeJobDescription(true);
      setIncludeToolsAndReports(true);
      setIncludePeerBenchmark(true);
      setIncludeComparison(true);
      setIncludePhrases(true);
    }
  };

  if (!isOpen) return null;

  const candidateName = profile.name?.trim() || "متقاضی محترم مهاجرت کاری";
  const fieldName = profile.field || "مهندسی نرم‌افزار و IT";
  const age = profile.age || 29;
  const experience = profile.experience !== undefined ? profile.experience : 4;
  const germanLevel = profile.germanLevel || "B1";
  const englishLevel = profile.englishLevel || "B2";
  const degree = profile.degree || "bachelor";

  const degreeName = 
    degree === "master" ? "کارشناسی ارشد (Master)" : 
    degree === "phd" ? "دکتری تخصصی (PhD)" : 
    degree === "bachelor" ? "کارشناسی (Bachelor)" : 
    degree === "associate" ? "کاردانی (Associate)" : 
    degree === "diploma" ? "دیپلم متوسطه" : "سوابق تجربی بدون مدرک آکادمیک";

  // If roadmapData not provided, generate personalized rule-based roadmap
  const effectiveRoadmap = roadmapData || generateRuleBasedMonthlyRoadmap({
    degree,
    field: fieldName,
    experience,
    germanLevel,
    englishLevel,
    timelineMonths: 6,
    weeklyHours: 20,
    applicantName: candidateName
  });

  // Fallback job comparison data if not provided
  const comparison = jobComparisonData || getClientJobComparison({
    field: fieldName,
    seniority: "mid",
    industry: "all",
    experience,
    germanLevel,
    skills: profile.skills || ""
  });

  // Calculate readiness score
  const calculateScore = () => {
    let s = 25;
    if (age <= 35) s += 20;
    else if (age <= 40) s += 10;
    if (["bachelor", "master", "phd"].includes(degree)) s += 20;
    if (experience >= 3) s += 15;
    if (["B1", "B2", "C1", "C2"].includes(germanLevel)) s += 15;
    if (englishLevel.includes("B2") || englishLevel.includes("C1")) s += 5;
    return Math.min(s, 98);
  };
  const readinessScore = calculateScore();

  const dossierRefId = `DE-DOSSIER-${Math.floor(100000 + Math.random() * 900000)}`;
  const generatedDate = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date());

  // 6 Core Steps definition
  const roadmapSteps = [
    {
      id: 1,
      title: "ارزیابی و معادل‌سازی مدارک تحصیلی (ZAB / Anerkennung)",
      duration: "۱ تا ۳ ماه",
      cost: "۲۰۰ تا ۶۰۰ یورو",
      details: "استعلام از آنابین (Anabin) جهت H+ بودن دانشگاه و رشته، ترجمه رسمی مدارک با تایید دادگستری و امور خارجه، ارسال پرونده به مرجع تخصصی ایالتی یا ZAB.",
      checklist: ["استعلام تاییدیه H+ آنابین", "ترجمه رسمی ریزنمرات و دانشنامه", "پرداخت هزینه معادل‌سازی", "دریافت برگه Defizitbescheid یا Gleichwertigkeit"]
    },
    {
      id: 2,
      title: "تقویت زبان تخصصی و اخذ مدرک رسمی (Goethe / Telc / ÖSD)",
      duration: "۳ تا ۶ ماه",
      cost: "۱۵۰ تا ۳۰۰ یورو",
      details: "رسیدن به سطح حداقل B1/B2 استاندارد، تسلط بر اصطلاحات فنی و Fachsprache مرتبط با شغل، آماده‌سازی برای مصاحبه‌های فنی و منابع انسانی.",
      checklist: ["شرکت در آزمون معتبر بین‌المللی", "تمرین مکالمه تخصصی رشته کاری", "آشنایی با اصطلاحات اداری و قراردادی"]
    },
    {
      id: 3,
      title: "استانداردسازی رزومه آلمانی (Lebenslauf) و پورتفولیو",
      duration: "۲ تا ۳ هفته",
      cost: "رایگان / ۵۰ یورو",
      details: "تدوین رزومه جدولی ۲ صفحه‌ای استاندارد آلمان (Tabellarischer Lebenslauf) بدون اغراق، نگارش انگیزه‌نامه هدفمند (Anschreiben) برای هر کارفرما.",
      checklist: ["عکس پرسنلی استاندارد کاری", "تفکیک سوابق با فرمت ماه/سال", "نگارش انگیزه‌نامه مطابق با آگهی شغلی"]
    },
    {
      id: 4,
      title: "کاریابی هدفمند و مصاحبه‌های استخدامی (Job Search & Interviews)",
      duration: "۲ تا ۴ ماه",
      cost: "رایگان",
      details: "ارسال اپلیکیشن در پلتفرم‌های StepStone، LinkedIn، Xing و Arbeitsagentur، شرکت در مصاحبه اول (Screening) و مصاحبه تخصصی (Fachgespräch).",
      checklist: ["بهینه‌سازی پروفایل‌های Xing و LinkedIn", "ارسال روزانه ۱ تا ۳ اپلیکیشن هدفمند", "آماده‌سازی پاسخ سوالات کلیدی مصاحبه"]
    },
    {
      id: 5,
      title: "عقد قرارداد کاری و تاییدیه اداره کار (Arbeitsvertrag & Vorabzustimmung)",
      duration: "۲ تا ۴ هفته",
      cost: "رایگان",
      details: "بررسی انطباق حقوق قرارداد با حداقل حقوق بلوکارت (حدود ۴۵,۳۰۰ یا ۵۰,۰۰۰ یورو در سال ۲۰۲۶) یا ویزای نیروی متخصص ۱۸b، دریافت فرم Erklärung zum Beschäftigungsverhältnis.",
      checklist: ["تکمیل فرم شرح شغل توسط کارفرما", "اخذ پیش‌تاییدیه اداره کار فدرال (BA)", "بیمه مسافرتی و مسکن موقت"]
    },
    {
      id: 6,
      title: "وقت سفارت، مصاحبه ویزا و ورود به آلمان (Visa & Relocation)",
      duration: "۱ تا ۲ ماه",
      cost: "۷۵ یورو عوارض ویزا",
      details: "رزرو وقت ویزامتریک، تحویل فیزیکی مدارک، دریافت ویزای ملی تایپ D، ورود به آلمان، ثبت آدرس (Anmeldung)، افتتاح حساب و دریافت اقامت.",
      checklist: ["چک‌لیست مدارک سفارت", "ورود و ثبت‌نام در شهرداری (Bürgeramt)", "تبدیل ویزا به کارت اقامت (Aufenthaltstitel)"]
    }
  ];

  // Helper to generate full printable HTML
  const generatePrintableHtml = () => {
    const printDocTitle = formatPrintDocumentTitle("نقشه راه مهاجرت کاری", candidateName);
    return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${printDocTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');

    @page {
      size: A4 portrait;
      margin: 20mm !important;
      margin-top: 20mm !important;
      margin-bottom: 20mm !important;
      margin-left: 20mm !important;
      margin-right: 20mm !important;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      direction: rtl;
      font-size: 8.5pt;
      line-height: 1.5;
      box-sizing: border-box;
    }

    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    /* Header & Branding */
    .header-box {
      border-bottom: 2px solid #1e293b;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .flag-bar {
      display: flex;
      height: 4px;
      margin-bottom: 6px;
      border-radius: 2px;
      overflow: hidden;
    }
    .flag-black { flex: 1; background: #000000; }
    .flag-red { flex: 1; background: #dd0000; }
    .flag-gold { flex: 1; background: #ffce00; }

    .title-main {
      font-size: 13pt;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 2px 0;
    }

    .title-sub {
      font-size: 8pt;
      color: #475569;
      margin: 0;
    }

    .ref-badge {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 8pt;
      font-weight: bold;
      color: #334155;
    }

    /* Candidate Profile Card */
    .profile-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px 12px;
    }

    .profile-item {
      display: flex;
      flex-direction: column;
    }

    .profile-label {
      font-size: 7pt;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 1px;
    }

    .profile-val {
      font-size: 8pt;
      font-weight: 700;
      color: #1e293b;
    }

    .readiness-pill {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 800;
      display: inline-block;
    }

    /* Section Styles */
    .section-title {
      font-size: 10pt;
      font-weight: 800;
      color: #1e293b;
      border-right: 4px solid #4338ca;
      padding-right: 8px;
      margin: 12px 0 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-tag {
      font-size: 7.5pt;
      background: #e0e7ff;
      color: #3730a3;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }

    /* Overview Strategy Box */
    .strategy-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
    }

    .strategy-title {
      font-size: 8.5pt;
      font-weight: 800;
      color: #166534;
      margin-bottom: 4px;
    }

    .strategy-desc {
      font-size: 8pt;
      color: #14532d;
      margin: 0;
      line-height: 1.45;
    }

    /* Monthly Milestones Grid */
    .milestone-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      background: #ffffff;
      margin-bottom: 8px;
    }

    .milestone-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 5px;
    }

    .milestone-title {
      font-size: 8.8pt;
      font-weight: 800;
      color: #1e3a8a;
    }

    .milestone-cost {
      font-size: 7.5pt;
      font-weight: 700;
      background: #e0f2fe;
      color: #0369a1;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .milestone-goal {
      font-size: 8pt;
      color: #0f172a;
      margin-bottom: 5px;
      font-weight: 600;
    }

    .sprints-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      margin: 5px 0;
    }

    .sprint-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 5px 7px;
    }

    .sprint-title {
      font-size: 7.5pt;
      font-weight: 700;
      color: #4338ca;
      margin-bottom: 2px;
    }

    .sprint-desc {
      font-size: 7.2pt;
      color: #475569;
      line-height: 1.35;
    }

    .checklist-grid {
      margin: 6px 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 8px;
    }

    .checklist-item {
      font-size: 7.4pt;
      color: #1e293b;
      display: flex;
      align-items: flex-start;
      gap: 5px;
      margin-bottom: 2px;
      line-height: 1.35;
    }

    .checklist-item-done {
      color: #64748b;
    }

    .check-box-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 10px;
      height: 10px;
      border: 1.2px solid #475569;
      border-radius: 2px;
      margin-top: 1.5px;
      flex-shrink: 0;
      font-size: 7pt;
      font-weight: bold;
      color: #059669;
      line-height: 1;
      background: #ffffff;
    }

    .check-box-checked {
      background-color: #ecfdf5;
      border-color: #059669;
      color: #059669;
    }

    .task-done-text {
      text-decoration: line-through;
      color: #64748b;
    }

    .advice-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 4px;
      padding: 5px 7px;
      font-size: 7.3pt;
      color: #92400e;
      margin-top: 5px;
    }

    .meta-footer {
      font-size: 7pt;
      color: #64748b;
      margin-top: 3px;
      display: flex;
      justify-content: space-between;
      border-top: 1px dashed #e2e8f0;
      padding-top: 3px;
    }

    /* 6 Steps Roadmap */
    .step-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 7px 10px;
      background: #ffffff;
      margin-bottom: 6px;
    }

    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }

    .step-number {
      background: #4338ca;
      color: #ffffff;
      font-weight: bold;
      font-size: 7.2pt;
      padding: 1px 5px;
      border-radius: 3px;
      margin-left: 5px;
    }

    .step-title-text {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
    }

    .step-meta {
      font-size: 7.2pt;
      color: #64748b;
    }

    .step-desc {
      font-size: 7.8pt;
      color: #334155;
      margin: 2px 0 5px 0;
      line-height: 1.4;
    }

    /* Comparison Table */
    table.comp-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.5pt;
      margin-bottom: 10px;
    }

    table.comp-table th {
      background: #1e293b;
      color: #ffffff;
      padding: 5px 7px;
      text-align: right;
      font-weight: 700;
      border: 1px solid #1e293b;
    }

    table.comp-table td {
      padding: 5px 7px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      line-height: 1.35;
    }

    table.comp-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .gap-badge {
      display: inline-block;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 6.8pt;
      font-weight: bold;
      text-align: center;
    }
    .gap-high { background: #ffe4e6; color: #9f1239; }
    .gap-med { background: #fef3c7; color: #92400e; }
    .gap-low { background: #e0f2fe; color: #075985; }

    /* German Phrases */
    .phrases-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      margin-bottom: 10px;
    }

    .phrase-item {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 5px 7px;
      border-radius: 4px;
    }

    .phrase-de {
      font-family: monospace;
      font-weight: bold;
      font-size: 7.8pt;
      color: #312e81;
      direction: ltr;
      text-align: left;
    }

    .phrase-fa {
      font-size: 7.2pt;
      font-weight: 600;
      color: #0f172a;
      margin: 1px 0;
    }

    .phrase-desc {
      font-size: 6.8pt;
      color: #64748b;
    }

    /* Footer */
    .footer-box {
      margin-top: 14px;
      padding-top: 6px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6.8pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header-box">
    <div class="flag-bar">
      <div class="flag-black"></div>
      <div class="flag-red"></div>
      <div class="flag-gold"></div>
    </div>
    <div>
      <h1 class="title-main">سند جامع نقشه راه مهاجرت کاری و گزارش ارزیابی تخصصی بازار کار آلمان</h1>
      <p class="title-sub">تحلیل موشکافانه شرح وظایف در آلمان، مقایسه با همتای آلمانی، استانداردهای DIN/ISO و زمان‌بندی ماه به ماه ۲۰۲۶</p>
    </div>
    <div style="text-align: left;">
      <div class="ref-badge">${dossierRefId}</div>
      <div style="font-size: 7.2pt; color: #64748b; margin-top: 2px;">تاریخ صدور: ${generatedDate}</div>
    </div>
  </div>

  <!-- Candidate Profile Summary -->
  <div class="profile-card">
    <div class="profile-item">
      <span class="profile-label">نام متقاضی:</span>
      <span class="profile-val">${candidateName}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">حوزه تخصصی / رشته:</span>
      <span class="profile-val">${fieldName}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">مقطع تحصیلی:</span>
      <span class="profile-val">${degreeName}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">سن / سابقه کار:</span>
      <span class="profile-val">${age} سال / ${experience} سال سابقه</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">سطح زبان آلمانی:</span>
      <span class="profile-val">${germanLevel}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">سطح زبان انگلیسی:</span>
      <span class="profile-val">${englishLevel}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">مسیر مهاجرتی پیشنهادی:</span>
      <span class="profile-val" style="color: #4338ca;">${effectiveRoadmap.overview.recommendedPathway}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">شاخص آمادگی پرونده:</span>
      <div>
        <span class="readiness-pill">${readinessScore}٪ آمادگی اقدام</span>
      </div>
    </div>
  </div>

  <!-- Strategy Overview -->
  <div class="strategy-box avoid-break">
    <div class="strategy-title">استراتژی محوری و بینش اقدام به مهاجرت:</div>
    <p class="strategy-desc">${(effectiveRoadmap.overview as any).strategicSummary || (effectiveRoadmap.overview as any).summaryInsight || "برنامه اختصاصی ورود به بازار کار آلمان"}</p>
  </div>

  ${includeJobDescription && comparison.jobDescriptionInGermany ? `
  <!-- Section: Deep German Job Description & Expectations -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>۱. شرح دقیق شغل در آلمان و تکالیف اجرایی (Tätigkeitsprofil in Deutschland)</span>
      <span class="section-tag">${comparison.jobDescriptionInGermany.kldbCode}</span>
    </div>

    <div style="background: #0f172a; color: #ffffff; padding: 7px 10px; border-radius: 5px; margin-bottom: 8px;">
      <div style="font-size: 7.2pt; color: #93c5fd;">عنوان رسمی شغلی در قراردادهای آلمان (KldB):</div>
      <div style="font-size: 8.8pt; font-weight: bold; font-family: monospace; direction: ltr; text-align: left; margin: 1px 0;">
        ${comparison.jobDescriptionInGermany.officialTitleDe}
      </div>
      <div style="font-size: 7.5pt; color: #cbd5e1; margin-top: 3px; line-height: 1.35;">
        ${comparison.jobDescriptionInGermany.generalScope}
      </div>
    </div>

    <div style="font-size: 8pt; font-weight: bold; color: #1e293b; margin-bottom: 4px;">کارهای اجرایی و وظایف روزمره با توضیحات دقیق عملیاتی:</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
      ${comparison.jobDescriptionInGermany.detailedTasksAndDuties.map((task, idx) => `
        <div style="border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px; background: #f8fafc;">
          <div style="font-size: 7.8pt; font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">
            ${idx + 1}. ${task.taskGroup}
          </div>
          <div style="font-size: 7.2pt; color: #475569; margin-bottom: 4px;">${task.description}</div>
          <ul style="margin: 0; padding-right: 12px; font-size: 7pt; color: #334155;">
            ${task.subTasks.map(st => `<li>${st}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>

    <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; padding: 6px 8px; margin-bottom: 8px;">
      <div style="font-size: 7.8pt; font-weight: bold; color: #92400e; margin-bottom: 3px;">
        انتظارات کارفرمای آلمانی بابت کار کردن (Erwartungshaltung):
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
        ${comparison.jobDescriptionInGermany.employerExpectations.map(exp => `
          <div style="font-size: 7.2pt; color: #78350f;">• ${exp}</div>
        `).join("")}
      </div>
    </div>
  </div>
  ` : ""}

  ${includeToolsAndReports && comparison.jobDescriptionInGermany ? `
  <!-- Section: Software Stack & Deliverable Reports -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>۲. نرم‌افزارهای مورد استفاده و گزارشات تحویلی در محیط کار آلمان</span>
      <span class="section-tag">ابزارها و گزارشات</span>
    </div>

    <table class="comp-table avoid-break" style="margin-bottom: 6px;">
      <thead>
        <tr>
          <th style="width: 22%;">نرم‌افزار / ابزار</th>
          <th style="width: 20%;">دسته‌بندی</th>
          <th style="width: 35%;">کاربرد دقیق در آلمان</th>
          <th style="width: 13%; text-align: center;">سطح تسلط</th>
          <th style="width: 10%; text-align: center;">رواج</th>
        </tr>
      </thead>
      <tbody>
        ${comparison.jobDescriptionInGermany.softwareAndTools.map(tool => `
          <tr>
            <td style="font-family: monospace; font-weight: bold; direction: ltr; text-align: left;">${tool.name}</td>
            <td style="color: #475569;">${tool.category}</td>
            <td style="color: #0f172a;">${tool.purposeInGermany}</td>
            <td style="text-align: center;"><span style="font-size: 6.8pt; background: #e0e7ff; color: #3730a3; padding: 1px 4px; border-radius: 2px;">${tool.expectedProficiency}</span></td>
            <td style="text-align: center; color: #166534; font-weight: bold;">${tool.popularity}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div style="font-size: 8pt; font-weight: bold; color: #1e293b; margin: 4px 0 2px 0;">گزارشات و خروجی‌های تحویلی الزامی:</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 8px;">
      ${comparison.jobDescriptionInGermany.deliverablesAndReports.map(rep => `
        <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px 7px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; font-size: 7.5pt; font-weight: bold; color: #0f172a;">
            <span>${rep.reportTitle}</span>
            <span style="font-size: 6.8pt; color: #4338ca; background: #f5f3ff; padding: 1px 4px; border-radius: 2px;">${rep.frequency}</span>
          </div>
          <div style="font-size: 7pt; color: #475569; margin: 2px 0;">${rep.description}</div>
          <div style="font-size: 6.8pt; color: #64748b;">قالب: <strong>${rep.formatAndTool}</strong> | تحویل به: <strong>${rep.recipient}</strong></div>
        </div>
      `).join("")}
    </div>
  </div>
  ` : ""}

  ${includePeerBenchmark && comparison.germanPeerBenchmark ? `
  <!-- Section: Deep Benchmark with German Peer & Standards -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>۳. بنچ‌مارک عمیق همتای آلمانی و استانداردهای صنعتی (German Peer Benchmark)</span>
      <span class="section-tag">دانش، استانداردها و تجربیات اندوخته</span>
    </div>

    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 6px 9px; margin-bottom: 6px; font-size: 7.3pt; color: #334155; line-height: 1.4;">
      <strong>پروفایل تجربی همتای آلمانی:</strong> ${comparison.germanPeerBenchmark.peerProfileSummary}
    </div>

    <div style="font-size: 8pt; font-weight: bold; color: #1e293b; margin-bottom: 3px;">استانداردها، نورم‌ها و چارچوب‌های الزامی (DIN / ISO / EU):</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 6px;">
      ${comparison.germanPeerBenchmark.standardsAndNormsMastery.map(std => `
        <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px 7px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; font-size: 7.5pt; font-weight: bold; color: #0f172a;">
            <span>${std.standardName}</span>
            <span style="font-size: 6.8pt; background: #fee2e2; color: #991b1b; padding: 1px 4px; border-radius: 2px;">${std.importanceLevel}</span>
          </div>
          <div style="font-size: 7pt; color: #475569; margin-top: 2px;">${std.description}</div>
        </div>
      `).join("")}
    </div>

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 5px 8px; margin-bottom: 8px;">
      <div style="font-size: 7.5pt; font-weight: bold; color: #166534; margin-bottom: 2px;">سوابق و دانش ضمنی اندوخته‌شده همتای آلمانی:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px;">
        ${comparison.germanPeerBenchmark.accumulatedExperienceAndTacitKnowledge.map(item => `
          <div style="font-size: 7pt; color: #14532d;">• ${item}</div>
        `).join("")}
      </div>
    </div>
  </div>
  ` : ""}

  <div class="page-break"></div>

  ${includeComparison ? `
  <!-- Section: Detailed Evaluation Matrix Table -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>۴. جدول ارزیابی دقیق و ماتریس تحلیل شکاف مهارت‌ها (Evaluation Matrix)</span>
      <span class="section-tag">${fieldName}</span>
    </div>

    <table class="comp-table avoid-break">
      <thead>
        <tr>
          <th style="width: 16%;">حیطه و محور ارزیابی</th>
          <th style="width: 21%;">رویه در ایران 🇮🇷</th>
          <th style="width: 21%;">انتظار کارفرمای آلمانی 🇩🇪</th>
          <th style="width: 21%;">بنچ‌مارک همتای آلمانی 🇩🇪</th>
          <th style="width: 7%; text-align: center;">شکاف</th>
          <th style="width: 14%;">راهکار جبران</th>
        </tr>
      </thead>
      <tbody>
        ${comparison.comparisonTable.map((row) => `
          <tr>
            <td>
              <strong>${row.dimension}</strong>
              ${row.softwareAndStandardsDelta ? `<div style="font-size: 6.8pt; color: #4338ca; margin-top: 2px;">تفاوت ابزار/استاندارد: ${row.softwareAndStandardsDelta}</div>` : ""}
            </td>
            <td style="color: #475569;">${row.iranReality}</td>
            <td style="color: #0f172a; font-weight: 500;">${row.germanyExpectation}</td>
            <td style="color: #312e81;">${row.germanPeerBenchmark || row.germanyExpectation}</td>
            <td style="text-align: center;">
              <span class="gap-badge ${row.gapLevel.includes("بسیار") || row.gapLevel.includes("بالا") ? "gap-high" : "gap-med"}">
                ${row.gapLevel}
              </span>
            </td>
            <td style="color: #312e81; font-size: 7pt;">${row.actionTip}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ` : ""}

  ${includeMonthlyMilestones && effectiveRoadmap.monthlyMilestones ? `
  <!-- Section: Monthly Milestones -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>۵. برنامه زمان‌بندی ماه به ماه اقدامات مهاجرت کاری (Monthly Milestones)</span>
      <span class="section-tag">مدت کل: ${effectiveRoadmap.overview.totalDurationMonths} ماه</span>
    </div>

    ${effectiveRoadmap.monthlyMilestones.map((m) => `
      <div class="milestone-card avoid-break">
        <div class="milestone-header">
          <div class="milestone-title">ماه ${m.monthNumber}: ${m.monthTitle}</div>
          <div class="milestone-cost">هزینه تخمینی: ${m.estimatedCostEur}€ (~${m.estimatedCostIrr})</div>
        </div>

        <div class="milestone-goal">هدف اصلی: ${m.primaryGoal}</div>

        ${includeWeeklySprints && m.weeklySprints && m.weeklySprints.length > 0 ? `
          <div class="sprints-grid">
            ${m.weeklySprints.map((s) => `
              <div class="sprint-box">
                <div class="sprint-title">هفته ${(s as any).week || (s as any).weekNumber || 1}: ${(s as any).title || (s as any).weekTitle || ""}</div>
                <div class="sprint-desc">${(s as any).description || (s as any).focusArea || ""}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <ul class="checklist-grid">
          ${m.actionChecklist.map((c, cIdx) => {
            const taskKey = `m${m.monthNumber}_t${cIdx}`;
            const isDone = effectiveCompletedTasks[taskKey] || 
                           effectiveCompletedTasks[c] || 
                           Object.entries(effectiveCompletedTasks).some(([k, v]) => v && (k.includes(c) || c.includes(k)));
            return `
            <li class="checklist-item ${isDone ? "checklist-item-done" : ""}">
              <span class="check-box-icon ${isDone ? "check-box-checked" : ""}">${isDone ? "✔" : ""}</span>
              <span class="${isDone ? "task-done-text" : ""}">${c}</span>
            </li>
            `;
          }).join("")}
        </ul>

        <div class="advice-box">
          <strong>توصیه تخصصی برای ${fieldName}:</strong> ${m.fieldSpecificAdvice}
        </div>

        <div class="meta-footer">
          <span>مرجع رسمی: <strong>${m.officialAuthority}</strong> (${m.officialAuthorityUrl})</span>
          <span>نکته پیشگیری از تاخیر: <strong>${m.riskFactorAndTip}</strong></span>
        </div>
      </div>
    `).join("")}
  </div>
  ` : ""}

  ${include6StepsRoadmap ? `
  <!-- Section: 6 Core Steps Roadmap -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>۶. ساختار کلان ۶ مرحله‌ای فرآیند مهاجرت کاری (Core Roadmap Steps)</span>
      <span class="section-tag">نمای کلی فرآیند</span>
    </div>

    <div>
      ${roadmapSteps.map((step) => `
        <div class="step-card avoid-break">
          <div class="step-header">
            <div>
              <span class="step-number">گام ${step.id}</span>
              <span class="step-title-text">${step.title}</span>
            </div>
            <div class="step-meta">
              <span>مدت زمان: <strong>${step.duration}</strong></span> | 
              <span>هزینه: <strong>${step.cost}</strong></span>
            </div>
          </div>
          <div class="step-desc">${step.details}</div>
          <ul style="margin: 0; padding-right: 12px; font-size: 7.2pt; color: #475569;">
            ${step.checklist.map(c => `<li>${c}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  </div>
  ` : ""}

  ${includePhrases && comparison.keyGermanPhrases ? `
  <!-- Section: Key German Phrases -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>۷. اصطلاحات کلیدی فرهنگ کار آلمان (Schlüsselbegriffe)</span>
      <span class="section-tag">واژگان سرنوشت‌ساز مصاحبه و قرارداد</span>
    </div>

    <div class="phrases-grid avoid-break">
      ${comparison.keyGermanPhrases.map((p) => `
        <div class="phrase-item">
          <div class="phrase-de">${p.german}</div>
          <div class="phrase-fa">${p.persian}</div>
          <div class="phrase-desc">${p.context}</div>
        </div>
      `).join("")}
    </div>
  </div>
  ` : ""}

  <!-- Footer -->
  <div class="footer-box">
    <div>تولید شده توسط سامانه هوشمند مهاجرت کاری به آلمان - گروه شرکت‌های جهانبان (خانه خلاق جهانبان)</div>
    <div>شناسه رهگیری: ${dossierRefId} | مستند قانونی قوانین مهاجرتی ۲۰۲۶</div>
  </div>

</body>
</html>`;
  };

  // Direct High-Resolution PDF Download using jsPDF and html2canvas
  const handleExportWithHtml2Pdf = async () => {
    setIsExportingPdf(true);
    setPdfSuccess(false);
    setExportError("");
    setPdfProgress(10);
    setPdfStatus("در حال آماده‌سازی سند نقشه راه و بارگذاری تایپوگرافی...");

    try {
      const printDocTitle = formatPrintDocumentTitle("نقشه راه مهاجرت کاری", candidateName);
      const htmlContent = generatePrintableHtml();

      await exportToPdfWithHtml2Pdf(htmlContent, `${printDocTitle}.pdf`, {
        margin: [6, 6, 8, 6],
        orientation: "portrait",
        scale: 2,
        onProgress: (percent, statusText) => {
          setPdfProgress(percent);
          setPdfStatus(statusText);
        }
      });

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4500);
    } catch (err) {
      console.error("Roadmap jsPDF export error:", err);
      setExportError("خطا در تولید مستقیم فایل PDF با jsPDF. لطفاً از گزینه پرینت مرورگر استفاده فرمایید یا مجدداً تلاش کنید.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Browser Print / Save as PDF using hidden iframe
  const handlePrintPdf = () => {
    setIsExporting(true);
    try {
      const printDocTitle = formatPrintDocumentTitle("نقشه راه مهاجرت کاری", candidateName);
      const htmlContent = generatePrintableHtml();

      // Create or reuse hidden print iframe
      let iframe = document.getElementById("pdf-print-timeline-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "pdf-print-timeline-iframe";
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
        doc.write(htmlContent);
        doc.close();
        if (iframe.contentDocument) {
          iframe.contentDocument.title = printDocTitle;
        }

        setTimeout(() => {
          triggerPrintWithTitle(printDocTitle, () => {
            try {
              iframe?.contentWindow?.focus();
              iframe?.contentWindow?.print();
            } catch (err) {
              console.warn("Iframe print error, falling back to window.print:", err);
              window.print();
            }
          });
        }, 500);
      } else {
        triggerPrintWithTitle(printDocTitle, () => {
          window.print();
        });
      }
    } catch (e) {
      console.error("Print generation error:", e);
    } finally {
      setTimeout(() => setIsExporting(false), 1200);
    }
  };

  // Download Standalone Offline HTML Dossier
  const handleDownloadHtml = () => {
    const printDocTitle = formatPrintDocumentTitle("نقشه راه مهاجرت کاری", candidateName);
    const htmlContent = generatePrintableHtml();
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${printDocTitle}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy structured text summary
  const handleCopyText = () => {
    let text = `سند استراتژی نقشه راه و ارزیابی شغلی آلمان\n`;
    text += `شناسه پرونده: ${dossierRefId} | تاریخ: ${generatedDate}\n`;
    text += `متقاضی: ${candidateName} | رشته: ${fieldName} | مدرک: ${degreeName} | سن: ${age} سال | سابقه: ${experience} سال\n`;
    text += `مسیر پیشنهادی: ${effectiveRoadmap.overview.recommendedPathway}\n\n`;

    if (includeJobDescription && comparison.jobDescriptionInGermany) {
      text += `=== ۱. شرح شغل در آلمان (${comparison.jobDescriptionInGermany.officialTitleDe}) ===\n`;
      text += `${comparison.jobDescriptionInGermany.generalScope}\n\n`;
      text += `وظایف کلیدی:\n`;
      comparison.jobDescriptionInGermany.detailedTasksAndDuties.forEach((t, i) => {
        text += `${i + 1}. ${t.taskGroup}: ${t.description}\n`;
        t.subTasks.forEach(st => text += `   - ${st}\n`);
      });
      text += `\n`;
    }

    if (includeComparison) {
      text += `=== ۲. جدول مقایسه‌ای انتظارات کارفرما ===\n`;
      comparison.comparisonTable.forEach((row, i) => {
        text += `${i + 1}. ${row.dimension}\n   - ایران: ${row.iranReality}\n   - آلمان: ${row.germanyExpectation}\n   - همتای آلمانی: ${row.germanPeerBenchmark || row.germanyExpectation}\n   - راهکار: ${row.actionTip}\n`;
      });
      text += `\n`;
    }

    if (includeMonthlyMilestones && effectiveRoadmap.monthlyMilestones) {
      text += `=== ۳. برنامه زمان‌بندی ماه به ماه اقدامات ===\n`;
      effectiveRoadmap.monthlyMilestones.forEach(m => {
        text += `\n[ماه ${m.monthNumber}: ${m.monthTitle}]\n`;
        text += `• هدف اصلی: ${m.primaryGoal}\n`;
        text += `• هزینه تخمینی: ${m.estimatedCostEur}€ (${m.estimatedCostIrr})\n`;
        text += `• چک‌لیست اقدامات:\n`;
        m.actionChecklist.forEach(t => text += `   - ${t}\n`);
        text += `• توصیه تخصصی: ${m.fieldSpecificAdvice}\n`;
      });
      text += `\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in text-right">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <FileDown className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30 mb-1">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                <span>سند خروجی رسمی PDF گزارش ارزیابی و نقشه راه</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                دریافت گزارش چاپی پرونده مهاجرت کاری (Official Printable Dossier)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {/* Presets Bar */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-right">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-white">قالب‌های پیش‌فرض خروجی سند:</span>
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => applyPreset("checklist")}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePreset === "checklist"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>فقط چک‌لیست اقدامات و نقشه راه</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("all")}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePreset === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>پرونده جامع کامل (Full Dossier)</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("tools")}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePreset === "tools"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>تحلیل شغل و ابزارها</span>
              </button>
            </div>
          </div>

          {/* Customization Options Bar */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>تنظیم سفارشی بخش‌های درج‌شده در سند چاپی و PDF:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={includeJobDescription}
                  onChange={(e) => setIncludeJobDescription(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">۱. شرح شغل و تکالیف اجرایی در آلمان</span>
              </label>

              <label className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={includeToolsAndReports}
                  onChange={(e) => setIncludeToolsAndReports(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">۲. نرم‌افزارها و گزارشات تحویلی</span>
              </label>

              <label className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={includePeerBenchmark}
                  onChange={(e) => setIncludePeerBenchmark(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">۳. بنچ‌مارک همتای آلمانی و استانداردها</span>
              </label>

              <label className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={includeComparison}
                  onChange={(e) => setIncludeComparison(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">۴. جدول ارزیابی و ماتریس شکاف</span>
              </label>

              <label className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={includeMonthlyMilestones}
                  onChange={(e) => setIncludeMonthlyMilestones(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">۵. زمان‌بندی ماه به ماه اقدامات</span>
              </label>

              <label className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={include6StepsRoadmap}
                  onChange={(e) => setInclude6StepsRoadmap(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">۶. ساختار کلان ۶ مرحله‌ای ویزا</span>
              </label>
            </div>
          </div>

          {/* Dossier Live Preview Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
                <Eye className="w-4 h-4" />
                <span>مشخصات پرونده و سند چاپی:</span>
              </div>
              <span className="text-xs font-mono bg-slate-900 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800">
                {dossierRefId}
              </span>
            </div>

            {/* Candidate Metadata Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] font-bold">متقاضی:</span>
                <span className="font-bold text-slate-200">{candidateName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-bold">تخصص:</span>
                <span className="font-bold text-slate-200">{fieldName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-bold">مقطع تحصیلی:</span>
                <span className="font-bold text-slate-200">{degreeName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-bold">امتیاز آمادگی:</span>
                <span className="font-black text-emerald-400">{readinessScore}٪ آمادگی اقدام</span>
              </div>
            </div>

            {/* Content summary items */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>شامل شرح دقیق شغل در آلمان بر پایه رده‌بندی KldB و استانداردهای فدرال کار (BA)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>شامل فهرست نرم‌افزارها، گزارشات تحویلی، استانداردهای DIN/ISO و مقایسه عمیق با همتای آلمانی</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مایل‌استون‌های ماهانه ({effectiveRoadmap.overview.totalDurationMonths} ماهه) با تفکیک هزینه‌های ارزی/ریالی و مراجع قانونی ۲۰۲۶</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>استاندارد رسمی اداری آلمان (DIN A4 • jsPDF Engine)</span>
            </div>

            {pdfSuccess && (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> فایل PDF با موفقیت دانلود شد
              </span>
            )}

            {exportError && (
              <span className="text-rose-400 text-xs font-bold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {exportError}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopyText}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? "متن کپی شد" : "کپی متن"}</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              title="دریافت نسخه وب مستقل برای مشاهده آفلاین یا آرشیو"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>دانلود HTML</span>
            </button>

            <button
              onClick={handlePrintPdf}
              disabled={isExporting || isExportingPdf}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="باز کردن کادر پرینت مرورگر برای چاپ کاغذی یا تنظیمات محلی چاپگر"
            >
              <Printer className={`w-4 h-4 ${isExporting ? "animate-spin" : ""}`} />
              <span>پرینت در مرورگر</span>
            </button>

            {/* Primary jsPDF & html2canvas Direct Download Action */}
            <button
              onClick={handleExportWithHtml2Pdf}
              disabled={isExportingPdf || isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-black transition shadow-lg shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
              title="تولید مستقیم و دانلود فایل PDF نقشه راه مهاجرت کاری با کتابخانه‌های jsPDF و html2canvas"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{pdfStatus || "در حال تولید PDF با jsPDF..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>دانلود مستقیم PDF (با jsPDF و html2canvas)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
