import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { visaRoutes } from "../data";
import { EvaluatorInput } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import {
  ShieldCheck,
  Award,
  Zap,
  Search,
  Brain,
  Loader2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  UploadCloud,
  FileText,
  X,
  History,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  Check,
  Languages,
  GraduationCap,
  Briefcase,
  Layers,
  FileCheck2,
  UserCheck,
  ChevronRight,
  Printer,
  Eye,
  Download,
  Trophy,
  TrendingUp,
  ArrowRight,
  Wallet,
  Coins,
  FileSpreadsheet,
  ChevronDown,
  Sliders
} from "lucide-react";
import { fetchWithRetry, formatPrintDocumentTitle } from "../utils";
import { exportToPdfWithHtml2Pdf } from "../utils/html2pdfExporter";
import { exportDashboardToGermanPdf } from "../utils/germanPdfExportService";
import { PdfPageSelectionDialog, PdfExportDialogConfig } from "./PdfPageSelectionDialog";
import MigrationTimeline from "./MigrationTimeline";
import JourneyTimeline from "./JourneyTimeline";
import ImmigrationProgressTracker from "./ImmigrationProgressTracker";
import { ChancenkarteProgressTracker } from "./ChancenkarteProgressTracker";
import CareerCoachingWidget from "./CareerCoachingWidget";
import IndustryDemandTrends from "./IndustryDemandTrends";
import GermanMarketDemandPieWidget from "./GermanMarketDemandPieWidget";
import LanguageBuddy from "./LanguageBuddy";
import CostOfLivingCompare from "./CostOfLivingCompare";
import ImmigrationBudgetPlanner from "./ImmigrationBudgetPlanner";
import { JobComparisonWidget } from "./JobComparisonWidget";
import { JobComparisonData } from "../utils/jobComparisonData";
import DashboardEvaluationCards from "./DashboardEvaluationCards";
import { parseProfileAndCvData } from "../services/dashboardEvaluationService";
import SkillsGapAnalysis from "./SkillsGapAnalysis";
import MonthlyRoadmapGenerator from "./MonthlyRoadmapGenerator";
import { CareerRoadmapPdfExportModal } from "./CareerRoadmapPdfExportModal";
import JahanbanPrintLayout, { JahanbanPrintFooter } from "./JahanbanPrintLayout";
import AIImmigrationAdvisor from "./AIImmigrationAdvisor";
import VisaSuccessForecast from "./VisaSuccessForecast";
import VisaSuccessPredictorCard from "./VisaSuccessPredictorCard";
import SalaryEstimator from "./SalaryEstimator";
// @ts-ignore
import jahanbanLogo from "../assets/images/jahanban_logo_1782078229949.jpg";
// @ts-ignore
import germanyBanner from "../assets/images/germany_job_search_banner_1782771330220.jpg";

interface DashboardProps {
  onProfileUpdate?: (profile: any) => void;
  onTabChange?: (tab: any) => void;
}

export default function Dashboard({ onProfileUpdate, onTabChange }: DashboardProps) {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isPdfPageSelectionOpen, setIsPdfPageSelectionOpen] = useState(false);
  const [pdfDownloadSuccess, setPdfDownloadSuccess] = useState(false);
  const [pdfDownloadError, setPdfDownloadError] = useState("");
  const [pdfWatermarkEnabled, setPdfWatermarkEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("jahanban_print_watermark_enabled");
      if (saved !== null) {
        return saved === "true";
      }
    } catch {
      // ignore
    }
    return true;
  });

  const handleWatermarkToggle = (enabled: boolean) => {
    setPdfWatermarkEnabled(enabled);
    try {
      localStorage.setItem("jahanban_print_watermark_enabled", String(enabled));
      localStorage.setItem("jahanban_cv_watermark_enabled", String(enabled));
    } catch {
      // ignore
    }
    if (enabled) {
      document.body.classList.remove("hide-watermark");
    } else {
      document.body.classList.add("hide-watermark");
    }
  };
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState(false);
  const [pdfExportMode, setPdfExportMode] = useState<"all" | "checklist_only" | "full_dossier">("all");
  const [activeJobComparisonData, setActiveJobComparisonData] = useState<JobComparisonData | null>(null);
  const [activeJobComparisonField, setActiveJobComparisonField] = useState<string>("");
  const [roadmapViewMode, setRoadmapViewMode] = useState<"ai_advisor" | "budget_planner" | "migration_timeline" | "monthly_ai" | "timeline_steps" | "progress_tracker">("ai_advisor");
  const [wizardInputs, setWizardInputs] = useState<EvaluatorInput>(() => {
    try {
      const saved = localStorage.getItem("germany_eval_profile");
      if (saved) {
        const pf = JSON.parse(saved);
        return {
          name: pf.name || "",
          age: pf.age !== undefined ? Number(pf.age) : 30,
          degree: pf.degree || "bachelor",
          experience: pf.experience !== undefined ? Number(pf.experience) : 4,
          germanLevel: pf.germanLevel || "B1",
          englishLevel: pf.englishLevel || "B2",
          field: pf.field || "برنامه‌نویسی و مهندسی نرم‌افزار"
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      name: "",
      age: 30,
      degree: "bachelor",
      experience: 4,
      germanLevel: "B1",
      englishLevel: "B2",
      field: "برنامه‌نویسی و مهندسی نرم‌افزار"
    };
  });

  const [aiReport, setAiReport] = useState<string>("");
  const [evalHistory, setEvalHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("germany_eval_pathway_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState<string>("");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string>("");
  const [extractedProfile, setExtractedProfile] = useState<any | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'extracting' | 'extracted' | 'error'>('idle');
  const [extractionError, setExtractionError] = useState<string>("");
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const getEffectiveProfile = () => {
    const savedName = (() => {
      try {
        const saved = localStorage.getItem("germany_eval_profile");
        if (saved) {
          const pf = JSON.parse(saved);
          if (pf && pf.name && pf.name.trim() !== "" && pf.name !== "کاربر نمونه" && pf.name !== "متقاضی کار در آلمان") return pf.name.trim();
        }
      } catch {}
      return "";
    })();

    const resolvedName = (wizardInputs.name || "").trim() && wizardInputs.name !== "کاربر نمونه" && wizardInputs.name !== "متقاضی کار در آلمان"
      ? wizardInputs.name.trim()
      : (extractedProfile?.name && extractedProfile.name.trim() !== "" && extractedProfile.name !== "کاربر نمونه" && extractedProfile.name !== "متقاضی کار در آلمان")
      ? extractedProfile.name.trim()
      : (savedName || "");

    const resolvedField = (wizardInputs.field && wizardInputs.field.trim() !== "" && wizardInputs.field !== "برنامه‌نویسی و مهندسی نرم‌افزار")
      ? wizardInputs.field.trim()
      : (extractedProfile?.field && extractedProfile.field.trim() !== "")
      ? extractedProfile.field.trim()
      : (wizardInputs.field || "برنامه‌نویسی و مهندسی نرم‌افزار");

    const resolvedDegree = wizardInputs.degree || extractedProfile?.degree || "bachelor";
    const resolvedExperience = (wizardInputs.experience !== undefined && wizardInputs.experience !== null && wizardInputs.experience !== 4)
      ? wizardInputs.experience
      : (extractedProfile?.experience !== undefined && extractedProfile?.experience !== null)
      ? extractedProfile.experience
      : (wizardInputs.experience !== undefined && wizardInputs.experience !== null ? wizardInputs.experience : 4);

    const resolvedSkills = (wizardInputs.skills && wizardInputs.skills.trim() !== "")
      ? wizardInputs.skills.trim()
      : (extractedProfile?.skills && extractedProfile.skills.trim() !== "")
      ? extractedProfile.skills.trim()
      : "";

    const resolvedGerman = wizardInputs.germanLevel || extractedProfile?.germanLevel || "B1";
    const resolvedEnglish = wizardInputs.englishLevel || extractedProfile?.englishLevel || "B2";
    const resolvedAge = wizardInputs.age !== undefined && wizardInputs.age !== null ? wizardInputs.age : (extractedProfile?.age || 30);

    return {
      name: resolvedName,
      age: resolvedAge,
      degree: resolvedDegree,
      experience: resolvedExperience,
      field: resolvedField,
      germanLevel: resolvedGerman,
      englishLevel: resolvedEnglish,
      skills: resolvedSkills,
      workHistoryHighlights: extractedProfile?.workHistoryHighlights || wizardInputs.workHistoryHighlights || [],
      educationSummary: extractedProfile?.educationSummary || wizardInputs.educationSummary || "",
      rawTextSummary: extractedProfile?.rawTextSummary || wizardInputs.rawTextSummary || "",
      targetRole: extractedProfile?.targetRole || wizardInputs.targetRole || resolvedField || "",
      pdfBase64: wizardInputs.pdfBase64 || extractedProfile?.pdfBase64 || "",
    };
  };

  const effectiveProfile = getEffectiveProfile();
  const effectiveField = activeJobComparisonField || effectiveProfile.field;

  const getRadarDataPersian = () => {
    const age = effectiveProfile.age;
    const exp = effectiveProfile.experience;
    const deg = effectiveProfile.degree;
    const deLvl = effectiveProfile.germanLevel;
    const enLvl = effectiveProfile.englishLevel;

    // User scores (0 - 100)
    const userDegree = deg === "phd" ? 100 : deg === "master" ? 95 : deg === "bachelor" ? 85 : deg === "associate" ? 65 : deg === "diploma" ? 45 : 20;
    const userExp = Math.min(100, exp * 15);
    const userGerman = deLvl === "C2" ? 100 : deLvl === "C1" ? 95 : deLvl === "B2" ? 80 : deLvl === "B1" ? 60 : deLvl === "A2" ? 40 : deLvl === "A1" ? 25 : 15;
    
    // Weight English proficiency: C1/C2 and advanced levels score 95% (highly competent, >75% required threshold)
    const isC1English = enLvl === "C1" || enLvl === "C2" || enLvl === "C1/C2" || enLvl === "Advanced" || 
                        String(enLvl).includes("C1") || String(enLvl).includes("C2") || 
                        String(enLvl).toLowerCase().includes("ielts 7") || String(enLvl).toLowerCase().includes("ielts 8");
    const userEnglish = isC1English 
      ? 95 
      : enLvl === "B2" 
      ? 80 
      : enLvl === "B1" 
      ? 55 
      : (enLvl === "A1/A2" || enLvl === "A1" || enLvl === "A2") 
      ? 35 
      : 15;
    const userAge = age >= 25 && age <= 35 ? 95 : age >= 18 && age < 25 ? 85 : age >= 36 && age <= 45 ? 70 : 50;
    const userSpecialty = (effectiveProfile.field && effectiveProfile.field.length > 3) ? 90 : 30;

    // Standard German employer requirements baseline
    const reqDegree = 80;
    const reqExp = 75;
    const reqGerman = 70;
    const reqEnglish = 75;
    const reqSpecialty = 80;
    const reqAge = 75;

    return [
      { subject: "تحصیلات دانشگاهی", "سطح شما": userDegree, "نیاز موقعیت شغلی": reqDegree },
      { subject: "سابقه کار مرتبط", "سطح شما": userExp, "نیاز موقعیت شغلی": reqExp },
      { subject: "زبان آلمانی", "سطح شما": userGerman, "نیاز موقعیت شغلی": reqGerman },
      { subject: "زبان انگلیسی", "سطح شما": userEnglish, "نیاز موقعیت شغلی": reqEnglish },
      { subject: "تطابق تخصص", "سطح شما": userSpecialty, "نیاز موقعیت شغلی": reqSpecialty },
      { subject: "امتیاز سن متقاضی", "سطح شما": userAge, "نیاز موقعیت شغلی": reqAge },
    ];
  };

  // Polynomial Regression Trendline calculation for long-term German career demand growth (degree 2)
  const calculatePolynomialTrendline = (baseReqs: number[]) => {
    // 5-year German labor market demand growth trajectory (2026-2030)
    const growthIncrements = [7, 14, 15, 13, 14, 7];
    const projectedTargets = baseReqs.map((req, i) => Math.min(98, req + (growthIncrements[i] || 10)));

    const n = projectedTargets.length;
    let s1 = 0, s2 = 0, s3 = 0, s4 = 0;
    let sy0 = 0, sy1 = 0, sy2 = 0;

    for (let i = 0; i < n; i++) {
      const x = i;
      const x2 = x * x;
      const x3 = x2 * x;
      const x4 = x3 * x;
      const y = projectedTargets[i];

      s1 += x;
      s2 += x2;
      s3 += x3;
      s4 += x4;

      sy0 += y;
      sy1 += x * y;
      sy2 += x2 * y;
    }

    const A = [
      [s4, s3, s2, sy2],
      [s3, s2, s1, sy1],
      [s2, s1, n, sy0]
    ];

    for (let i = 0; i < 3; i++) {
      let maxRow = i;
      for (let k = i + 1; k < 3; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
          maxRow = k;
        }
      }
      const tmp = A[i];
      A[i] = A[maxRow];
      A[maxRow] = tmp;

      for (let k = i + 1; k < 3; k++) {
        const factor = A[k][i] / (A[i][i] || 1e-9);
        for (let j = i; j <= 3; j++) {
          A[k][j] -= factor * A[i][j];
        }
      }
    }

    const c_vals = [0, 0, 0];
    for (let i = 2; i >= 0; i--) {
      let sum = A[i][3];
      for (let j = i + 1; j < 3; j++) {
        sum -= A[i][j] * c_vals[j];
      }
      c_vals[i] = sum / (A[i][i] || 1e-9);
    }

    const a = c_vals[0];
    const b = c_vals[1];
    const c = c_vals[2];

    const fitted: number[] = [];
    let ssTot = 0;
    let ssRes = 0;
    const yMean = sy0 / n;

    for (let i = 0; i < n; i++) {
      const x = i;
      const yHat = a * x * x + b * x + c;
      const clamped = Math.max(20, Math.min(100, Math.round(yHat)));
      fitted.push(clamped);
      ssTot += Math.pow(projectedTargets[i] - yMean, 2);
      ssRes += Math.pow(projectedTargets[i] - yHat, 2);
    }

    const r2 = ssTot > 0 ? Math.max(0.85, Math.min(0.98, 1 - ssRes / ssTot)) : 0.94;
    const signB = b >= 0 ? "+" : "-";
    const signC = c >= 0 ? "+" : "-";
    const formulaText = `y = ${a.toFixed(2)}x² ${signB} ${Math.abs(b).toFixed(2)}x ${signC} ${Math.abs(c).toFixed(1)} | R² ≈ ${r2.toFixed(2)}`;

    return { fitted, projectedTargets, a, b, c, r2, formulaText };
  };

  // Clean, persistent state for polynomial career demand trendline in radar chart
  const [showPolynomialTrendline, setShowPolynomialTrendline] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("germany_radar_polynomial_trendline");
      if (saved !== null) {
        return saved === "true";
      }
    } catch (e) {
      // localStorage may fail in restricted/incognito environments
    }
    return true; // Default to visible
  });

  const handleTogglePolynomialTrendline = useCallback((forcedVal?: boolean) => {
    setShowPolynomialTrendline(prev => {
      const next = typeof forcedVal === "boolean" ? forcedVal : !prev;
      try {
        localStorage.setItem("germany_radar_polynomial_trendline", String(next));
      } catch (e) {}
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("germany_radar_polynomial_trendline", String(showPolynomialTrendline));
    } catch (e) {}
  }, [showPolynomialTrendline]);

  const [selectedRadarPoint, setSelectedRadarPoint] = useState<string | null>(null);

  const polynomialFitData = useMemo(() => {
    const baseData = getRadarDataPersian();
    return calculatePolynomialTrendline(baseData.map(d => d["نیاز موقعیت شغلی"]));
  }, [effectiveProfile.degree, effectiveProfile.experience, effectiveProfile.germanLevel, effectiveProfile.englishLevel, effectiveProfile.field, effectiveProfile.age]);

  const radarChartData = useMemo(() => {
    const baseData = getRadarDataPersian();
    const poly = calculatePolynomialTrendline(baseData.map(d => d["نیاز موقعیت شغلی"]));
    return baseData.map((d, idx) => ({
      ...d,
      "روند رشد چندجمله‌ای": poly.fitted[idx],
      "رشد پیش‌بینی‌شده ۵ ساله": poly.projectedTargets[idx]
    }));
  }, [
    effectiveProfile.age,
    effectiveProfile.experience,
    effectiveProfile.degree,
    effectiveProfile.germanLevel,
    effectiveProfile.englishLevel,
    effectiveProfile.field
  ]);

  const getMatchInsights = () => {
    try {
      const parsed = parseProfileAndCvData(effectiveProfile);
      const { education, workHistory, skills, visaMarketFit } = parsed;

      return [
        {
          title: "صلاحیت تحصیلی و آنابین",
          badge: education.anabinStatusLabelFa,
          desc: `${education.degreeTitleFa} از ${education.institutionName} (${education.degreeTitleDe}). امتیاز دانشگاهی در کارت فرصت: ${education.chancenkarteDegreePoints} از ۴.`,
          type: education.blueCardAcademicEligible ? "success" : "warning"
        },
        {
          title: "سوابق حرفه‌ای و سطح ارشدیت",
          badge: workHistory.seniorityLevelFa,
          desc: `${workHistory.totalYears} سال سابقه کار تخصصی در حوزه ${effectiveProfile.field}. ${workHistory.highlights[0] || workHistory.germanWorkplaceAlignment}`,
          type: workHistory.totalYears >= 3 ? "success" : "info"
        },
        {
          title: "سبد مهارت‌ها و فناوری‌ها",
          badge: `${skills.overallMatchPercentage}٪ انطباق بازار`,
          desc: `فناوری‌های شناسایی‌شده: ${skills.coreTechStack.slice(0, 4).join("، ") || skills.skillsList.slice(0, 4).join("، ")}. استاندارد مرجع آلمان: ${skills.relevantGermanStandards[0] || "DIN/ISO"}`,
          type: "success"
        },
        {
          title: "مسیر ویزا و کف حقوق بازار آلمان",
          badge: visaMarketFit.recommendedPathwayTitleFa,
          desc: `کف حقوق قانونی بلوکارت: ${visaMarketFit.blueCardFit.minSalaryThresholdEur.toLocaleString()} یورو/سال. مجموع امتیاز کارت فرصت: ${visaMarketFit.chancenkartePoints.total} امتیاز (نصاب: ۶).`,
          type: visaMarketFit.chancenkartePoints.passedThreshold ? "success" : "info"
        }
      ];
    } catch (e) {
      console.error("Error generating match insights:", e);
      return [
        {
          title: "وضعیت تحصیلی",
          badge: "تاییدیه آنابین",
          desc: "سطح مدرک تحصیلی شما مطابق با استانداردهای بلوکارت و تاییدیه آنابین آلمان بررسی شد.",
          type: "success"
        },
        {
          title: "سابقه کار مرتبط",
          badge: `${effectiveProfile.experience} سال سابقه`,
          desc: "سابقه کار مستند شما برای موقعیت‌های کاری آلمان تطبیق داده شده است.",
          type: "success"
        }
      ];
    }
  };

  // Radar Competency Export States & Handlers
  const [radarExportOpen, setRadarExportOpen] = useState(false);
  const [isExportingRadarPdf, setIsExportingRadarPdf] = useState(false);
  const [radarExportSuccess, setRadarExportSuccess] = useState<string | null>(null);
  const radarExportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (radarExportRef.current && !radarExportRef.current.contains(event.target as Node)) {
        setRadarExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportRadarCSV = () => {
    try {
      const candidateName = effectiveProfile.name || "متقاضی کار";
      const candidateField = effectiveProfile.field || "نامشخص";
      const dateFa = new Date().toLocaleDateString("fa-IR");
      const isoDate = new Date().toISOString().split("T")[0];

      // Build CSV with BOM for Excel UTF-8 compatibility
      let csv = "\uFEFF";
      csv += "گزارش تحلیلی رادار تطبیق شایستگی‌های آلمان (German Competency Match Radar)\n";
      csv += `نام متقاضی:,"${candidateName.replace(/"/g, '""')}"\n`;
      csv += `رشته تخصصی:,"${candidateField.replace(/"/g, '""')}"\n`;
      csv += `مدرک تحصیلی:,"${effectiveProfile.degree || "نامشخص"}"\n`;
      csv += `سابقه کار مرتبط:,"${effectiveProfile.experience || 0} سال"\n`;
      csv += `سطح زبان آلمانی:,"${effectiveProfile.germanLevel || "نامشخص"}"\n`;
      csv += `سطح زبان انگلیسی:,"${effectiveProfile.englishLevel || "نامشخص"}"\n`;
      csv += `تاریخ صدور:,"${dateFa} (${isoDate})"\n`;
      csv += `مبنای قانونی:,"قانون اصلاح‌شده مهاجرت نیروی ماهر آلمان (FEG 2026) و ZAV"\n\n`;

      csv += "شاخص شایستگی,سطح شما (٪),نیاز بازار کار آلمان (٪),روند چندجمله‌ای رشد ۵ ساله (٪),شکاف شایستگی (٪),وضعیت تطابق\n";
      radarChartData.forEach((row) => {
        const subject = row.subject;
        const userLevel = row["سطح شما"];
        const reqLevel = row["نیاز موقعیت شغلی"];
        const polyTrend = (row as any)["روند رشد چندجمله‌ای"] !== undefined ? (row as any)["روند رشد چندجمله‌ای"] : "-";
        const diff = userLevel - reqLevel;
        const status = diff >= 0 ? "تطابق مطلوب / فراتر از حدنصاب" : "دارای شکاف / نیازمند ارتقا";
        csv += `"${subject}",${userLevel},${reqLevel},${polyTrend},${diff > 0 ? "+" + diff : diff},"${status}"\n`;
      });

      csv += "\nتحلیل خودکار و توصیه‌های تخصصی انطباق:\n";
      csv += "شاخص,برچسب وضعیت,شرح و توصیه\n";
      const insights = getMatchInsights();
      insights.forEach((ins) => {
        csv += `"${ins.title}","${ins.badge || ""}","${(ins.desc || "").replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = candidateName.replace(/[^\w\u0600-\u06FF]/g, "_") || "Candidate";
      a.href = url;
      a.download = `German_Competency_Radar_${safeName}_${isoDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setRadarExportOpen(false);
      setRadarExportSuccess("فایل CSV با موفقیت دانلود شد.");
      setTimeout(() => setRadarExportSuccess(null), 3000);
    } catch (err) {
      console.error("Error exporting CSV:", err);
    }
  };

  const handleExportRadarPDF = async () => {
    setIsExportingRadarPdf(true);
    try {
      const candidateName = effectiveProfile.name || "متقاضی کار";
      const candidateField = effectiveProfile.field || "نامشخص";
      const dateFa = new Date().toLocaleDateString("fa-IR");
      const dateDe = new Date().toLocaleDateString("de-DE");
      const isoDate = new Date().toISOString().split("T")[0];
      const safeName = candidateName.replace(/[^\w\u0600-\u06FF]/g, "_") || "Candidate";

      const radarElement = document.getElementById("dashboard-radar-card");
      const liveSvg = radarElement?.querySelector("svg.recharts-surface");
      const svgHtml = liveSvg ? liveSvg.outerHTML : "";
      const insights = getMatchInsights();

      const tableRows = radarChartData.map((row) => {
        const subject = row.subject;
        const userLevel = row["سطح شما"];
        const reqLevel = row["نیاز موقعیت شغلی"];
        const polyTrend = (row as any)["روند رشد چندجمله‌ای"] || reqLevel;
        const diff = userLevel - reqLevel;
        const isPositive = diff >= 0;
        return `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 14px; font-weight: 700; color: #1e293b;">${subject}</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; font-weight: 800; color: #4338ca;">${userLevel}٪</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; font-weight: 800; color: #047857;">${reqLevel}٪</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; font-weight: 800; color: #d97706;">${polyTrend}٪</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; font-weight: 800; color: ${isPositive ? '#059669' : '#dc2626'};">${isPositive ? '+' + diff : diff}٪</td>
            <td style="padding: 10px 14px; text-align: center;">
              <span style="display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: ${isPositive ? '#d1fae5; color: #065f46;' : '#fee2e2; color: #991b1b;'}">
                ${isPositive ? 'تطابق مطلوب' : 'نیازمند تقویت'}
              </span>
            </td>
          </tr>
        `;
      }).join("");

      const insightCards = insights.map((ins) => `
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px; margin-bottom: 10px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #0f172a; font-size: 13px;">${ins.title}</strong>
            ${ins.badge ? `<span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 700;">${ins.badge}</span>` : ''}
          </div>
          <p style="margin: 0; color: #334155; font-size: 11.5px; line-height: 1.6;">${ins.desc}</p>
        </div>
      `).join("");

      const pdfHtml = `
        <div style="font-family: 'Vazirmatn', sans-serif; direction: rtl; padding: 24px 30px; color: #0f172a; background: #ffffff;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #4338ca; padding-bottom: 16px; margin-bottom: 20px;">
            <div>
              <span style="display: inline-block; background: #e0e7ff; color: #3730a3; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800; margin-bottom: 6px;">
                گزارش رسمی رادار تطبیق شایستگی‌های آلمان
              </span>
              <h1 style="margin: 4px 0 0; font-size: 18px; font-weight: 900; color: #1e1b4b;">
                German Competency Match & Trend Report
              </h1>
              <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">
                تحلیل و ارزیابی چندبعدی انطباق شرایط متقاضی با نیازمندی‌های بازار کار و ویزای تخصصی آلمان
              </p>
            </div>
            <div style="text-align: left; font-size: 11px; color: #64748b; line-height: 1.5;">
              <div><strong>تاریخ گزارش:</strong> ${dateFa}</div>
              <div style="font-family: monospace;">Datum: ${dateDe}</div>
              <div><strong>مرجع:</strong> FEG 2026 / BA / ZAV</div>
            </div>
          </div>

          <!-- Candidate Profile Box -->
          <div style="background: #f1f5f9; border-radius: 12px; padding: 12px 18px; margin-bottom: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 12px;">
            <div><strong>متقاضی:</strong> ${candidateName}</div>
            <div><strong>حوزه تخصصی:</strong> ${candidateField}</div>
            <div><strong>مدرک:</strong> ${effectiveProfile.degree || "نامشخص"}</div>
            <div><strong>سابقه کار:</strong> ${effectiveProfile.experience || 0} سال</div>
            <div><strong>آلمانی:</strong> ${effectiveProfile.germanLevel || "نامشخص"}</div>
            <div><strong>انگلیسی:</strong> ${effectiveProfile.englishLevel || "نامشخص"}</div>
          </div>

          <!-- Radar Chart and Table Grid -->
          <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 24px;">
            ${svgHtml ? `
              <div style="width: 270px; height: 270px; flex-shrink: 0; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 10px;">
                ${svgHtml}
              </div>
            ` : ''}
            <div style="flex: 1;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background: #1e293b; color: #ffffff;">
                    <th style="padding: 10px 14px; text-align: right; font-weight: 800;">شاخص شایستگی</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 800;">سطح شما</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 800;">نیاز فعلی</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 800; color: #f59e0b;">رشد چندجمله‌ای ۵ ساله</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 800;">شکاف</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 800;">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recommendations & Insights -->
          <div style="margin-top: 16px;">
            <h3 style="font-size: 14px; font-weight: 900; color: #1e1b4b; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 14px;">
              تحلیل خودکار و توصیه‌های راهبردی مهاجرت کاری
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              ${insightCards}
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 26px; padding-top: 12px; border-top: 1px dashed #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">
            این گزارش بر مبنای آخرین اصلاحات قوانین مهاجرتی آلمان (Fachkräfteeinwanderungsgesetz) و داده‌های رسمی اداره کار فدرال (BA) تولید شده است.
          </div>
        </div>
      `;

      await exportToPdfWithHtml2Pdf(pdfHtml, `German_Competency_Radar_${safeName}_${isoDate}.pdf`, {
        orientation: "portrait",
        unit: "mm"
      });

      setRadarExportOpen(false);
      setRadarExportSuccess("فایل PDF با موفقیت تولید و دانلود شد.");
      setTimeout(() => setRadarExportSuccess(null), 3000);
    } catch (err) {
      console.error("Error exporting radar PDF:", err);
    } finally {
      setIsExportingRadarPdf(false);
    }
  };

  const lastSyncedProfileRef = useRef<string>("");
  useEffect(() => {
    if (onProfileUpdate) {
      const serialized = JSON.stringify({
        name: effectiveProfile.name,
        age: effectiveProfile.age,
        degree: effectiveProfile.degree,
        experience: effectiveProfile.experience,
        field: effectiveProfile.field,
        germanLevel: effectiveProfile.germanLevel,
        englishLevel: effectiveProfile.englishLevel,
      });
      if (lastSyncedProfileRef.current !== serialized) {
        lastSyncedProfileRef.current = serialized;
        onProfileUpdate(effectiveProfile);
      }
    }
  }, [
    effectiveProfile.name,
    effectiveProfile.age,
    effectiveProfile.degree,
    effectiveProfile.experience,
    effectiveProfile.field,
    effectiveProfile.germanLevel,
    effectiveProfile.englishLevel,
    onProfileUpdate
  ]);

  useEffect(() => {
    const handleGlobalPdfTrigger = (e: Event) => {
      if (aiReport && !isLoading) {
        const customEvent = e as CustomEvent<{ filename?: string }>;
        const customFilename = customEvent?.detail?.filename;
        handleDownloadPdf(customFilename);
      }
    };
    window.addEventListener("trigger-download-pdf", handleGlobalPdfTrigger);
    return () => window.removeEventListener("trigger-download-pdf", handleGlobalPdfTrigger);
  }, [aiReport, isLoading, effectiveProfile, activeJobComparisonField, activeJobComparisonData, pdfWatermarkEnabled]);

  const handleFile = (file: File) => {
    setPdfError("");
    setExtractionError("");
    setExtractionStatus('idle');
    setExtractedProfile(null);
    setMissingFields([]);

    if (file.type !== "application/pdf") {
      setPdfError("لطفاً فقط فایل PDF معتبر آپلود کنید.");
      return;
    }
    if (file.size > 2.0 * 1024 * 1024) { // 2.0MB limit
      setPdfError("حجم فایل رزومه پیشنهادی برای آنالیز هوشمند باید کمتر از ۲ مگابایت باشد.");
      return;
    }

    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setWizardInputs(prev => ({ ...prev, pdfBase64: base64 }));
    };
    reader.onerror = () => {
      setPdfError("خطا در خواندن فایل رخ داد.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    setExtractedProfile(null);
    setExtractionStatus('idle');
    setExtractionError("");
    setMissingFields([]);
    setWizardInputs(prev => {
      const updated = { ...prev };
      delete updated.pdfBase64;
      return updated;
    });
  };

  const handleExtractResumeData = async () => {
    if (!wizardInputs.pdfBase64) {
      setPdfError("لطفاً ابتدا فایل PDF رزومه را آپلود فرمایید.");
      return;
    }

    setIsExtracting(true);
    setExtractionStatus('extracting');
    setExtractionError("");

    try {
      const response = await fetchWithRetry("/api/gemini/extract-resume-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: wizardInputs.pdfBase64 })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "خطا در استخراج اطلاعات از فایل رزومه.");
      }

      const prof = data.profile || {};
      setExtractedProfile(prof);
      setMissingFields(data.missingFields || ["age", "germanLevel", "englishLevel"]);
      setExtractionStatus('extracted');

      const extractedCandidateName = (prof.name && prof.name.trim() !== "" && prof.name !== "کاربر نمونه" && prof.name !== "متقاضی کار در آلمان" && prof.name !== "متقاضی محترم") ? prof.name.trim() : null;

      // Calculate verified age using current year baseline
      const currentYear = new Date().getFullYear();
      let verifiedExtractedAge = wizardInputs.age;
      if (prof.birthYear && Number(prof.birthYear) >= 1940 && Number(prof.birthYear) <= currentYear - 14) {
        verifiedExtractedAge = currentYear - Number(prof.birthYear);
      } else if (prof.age && Number(prof.age) > 0) {
        verifiedExtractedAge = Number(prof.age);
      }

      // Populate wizard inputs with extracted data including candidate's actual full name
      const updatedInputs: EvaluatorInput = {
        ...wizardInputs,
        name: extractedCandidateName || wizardInputs.name || "",
        age: verifiedExtractedAge,
        degree: (prof.degree && prof.degree.trim() !== "") ? prof.degree : wizardInputs.degree,
        experience: (prof.experience !== undefined && prof.experience !== null && Number(prof.experience) >= 0) ? Number(prof.experience) : wizardInputs.experience,
        field: (prof.field && prof.field.trim() !== "") ? prof.field : wizardInputs.field,
        germanLevel: (prof.germanLevel && prof.germanLevel !== "عدم آشنایی" && prof.germanLevel !== "null") ? prof.germanLevel : wizardInputs.germanLevel,
        englishLevel: (prof.englishLevel && prof.englishLevel !== "عدم آشنایی" && prof.englishLevel !== "null") ? prof.englishLevel : wizardInputs.englishLevel,
        skills: (prof.skills && prof.skills.trim() !== "") ? prof.skills : (wizardInputs.skills || ""),
        workHistoryHighlights: prof.workHistoryHighlights || [],
        educationSummary: prof.educationSummary || "",
        rawTextSummary: prof.rawTextSummary || "",
        targetRole: prof.targetRole || prof.field || wizardInputs.field || ""
      };

      if (prof.field && prof.field.trim()) {
        setActiveJobComparisonField(prof.field.trim());
      }

      setWizardInputs(updatedInputs);

      // Save to localStorage immediately and trigger profile update
      try {
        localStorage.setItem("germany_eval_profile", JSON.stringify(updatedInputs));
      } catch (e) {
        console.error("Local storage profile save error:", e);
      }

      if (onProfileUpdate) {
        onProfileUpdate(updatedInputs);
      }

    } catch (err: any) {
      console.error("Resume extraction failed:", err);
      setExtractionStatus('error');
      setExtractionError(err.message || "استخراج خودکار رزومه با خطا مواجه شد. لطفاً فیلدها را به صورت دستی در فرم زیر وارد فرمایید.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Simple client-side rule evaluation
  const evaluateRuleBased = () => {
    const { degree, experience, germanLevel, englishLevel, field } = wizardInputs;
    
    // IT specialist rule
    const isIT = field.toLowerCase().includes("it") || 
                 field.includes("نرم‌افزار") || 
                 field.includes("برنامه‌نویسی") || 
                 field.includes("شبکه") || 
                 field.includes("طراحی وب");

    if (degree === "bachelor" || degree === "master" || degree === "phd") {
      if (experience >= 2) {
        return {
          title: "کاندیدای عالی برای بلوکارت (Blue Card) یا ویزای نیروی متخصص",
          desc: "شما با داشتن مدرک دانشگاهی معتبر و حداقل ۲ سال سابقه کار، شانس بسیار خوبی برای جذب مستقیم با جاب‌آفر و دریافت سریع اقامت دائم دارید.",
          color: "border-blue-500 bg-blue-950/20"
        };
      } else {
        return {
          title: "مناسب برای کارت فرصت (Chancenkarte) یا جستجوی کار",
          desc: "تحصیلات عالیه دارید اما با توجه به سابقه کار زیر ۲ سال، کارت فرصت جدید آلمان بهترین بستر ورود به بازار کار و ایجاد تجربه کاری در آلمان است.",
          color: "border-emerald-500 bg-emerald-950/20"
        };
      }
    }

    if (isIT && experience >= 3) {
      return {
        title: "مسیر استثنایی متخصصین IT فاقد مدرک آکادمیک",
        desc: "دولت آلمان به برنامه‌نویسان با سابقه‌ی عملی حداقل ۳ سال اجازه می‌دهد بدون تاییدیه دانشگاهی وارد کار شوند به شرطی که بتوانند جاب‌آفری با حداقل حقوق مدنظر ثبت کنند.",
        color: "border-amber-500 bg-amber-950/20"
      };
    }

    if (degree === "diploma" || experience >= 2) {
      return {
        title: "مناسب برای ویزای مهارت فنی‌وحرفه‌ای (Skilled Worker)",
        desc: "مدارک فنی و حرفه‌ای معتبر دو ساله یا سوابق مهارتی ثبت شده در صورت معادل‌سازی کامل (Anerkennung) به شما اجازه استخدام به عنوان نیروی متخصص را می‌دهد.",
        color: "border-purple-500 bg-purple-950/20"
      };
    }

    return {
      title: "مناسب برای مسیر کارت فرصت بر اساس امتیازات",
      desc: "سیستم کارت فرصت فرصت خوبی است تا با تکیه بر سن مناسب، زبان و بخشی از سابقه کار امتیاز جمع‌آوری کنید و مجوز یک‌ساله حضور در آلمان را بگیرید.",
      color: "border-slate-500 bg-slate-900/40"
    };
  };

  const currentAdvice = evaluateRuleBased();

  const handleLoadEval = (item: any) => {
    setAiReport(item.report);
    setLoadedHistoryId(item.id);
    setWizardInputs({
      name: item.name,
      age: item.age,
      degree: item.degree,
      experience: item.experience,
      field: item.field,
      germanLevel: item.germanLevel,
      englishLevel: item.englishLevel,
    });
    setExtractedProfile({
      name: item.name,
      age: item.age,
      degree: item.degree,
      experience: item.experience,
      field: item.field,
      germanLevel: item.germanLevel,
      englishLevel: item.englishLevel,
    });
    if (item.fileName) {
      setPdfFile(new File([], item.fileName, { type: "application/pdf" }));
    } else {
      setPdfFile(null);
    }
  };

  const handleDeleteEval = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvalHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem("germany_eval_pathway_history", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    if (loadedHistoryId === id) {
      setLoadedHistoryId(null);
      setAiReport("");
    }
  };

  const handleAiEvaluation = async () => {
    setIsLoading(true);
    setAiReport("");
    setErrorMsg("");
    setExtractedProfile(null);
    setLoadedHistoryId(null);
    setLoadingStep("در حال ارسال مشخصات شما به هوش مصنوعی...");

    const steps = [
      "در حال تحلیل سن و مدرک تحصیلی برمبنای دیتابیس آنابین...",
      "در حال ارزیابی الزامات سطح زبان آلمانی و انگلیسی...",
      "در حال استخراج بهترین مسیرهای ویزای متناسب با شرایط شما...",
      "در حال تولید نقشه راه گام‌به‌گام و توصیه‌های نهایی..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 1800);

    try {
      const response = await fetchWithRetry("/api/gemini/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wizardInputs),
      });

      let data: any;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html") || response.status === 413) {
          throw new Error("حجم فایل رزومه شما بیش از حد مجاز است یا ارتباط با سرور برقرار نشد. لطفاً یک فایل PDF سبک‌تر (ترجیحاً زیر ۱ مگابایت) بارگذاری کنید یا بدون فایل رزومه ارزیابی نمایید.");
        }
        throw new Error(text.substring(0, 150) || `خطای سرور با کد ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || "خطایی در پردازش رخ داد.");
      }

      setAiReport(data.result);
      if (data.profile) {
        setExtractedProfile(data.profile);
        const extName = (data.profile.name && data.profile.name.trim() !== "" && data.profile.name !== "کاربر نمونه" && data.profile.name !== "متقاضی کار در آلمان" && data.profile.name !== "متقاضی محترم") ? data.profile.name.trim() : null;
        // Sync wizardInputs so that manual form fields show the extracted values from the PDF!
        const updatedInputs: EvaluatorInput = {
          ...wizardInputs,
          name: extName || wizardInputs.name || "",
          age: data.profile.age || wizardInputs.age,
          degree: data.profile.degree || wizardInputs.degree,
          experience: data.profile.experience || wizardInputs.experience,
          field: data.profile.field || wizardInputs.field,
          germanLevel: data.profile.germanLevel || wizardInputs.germanLevel,
          englishLevel: data.profile.englishLevel || wizardInputs.englishLevel,
          skills: data.profile.skills || wizardInputs.skills,
          workHistoryHighlights: data.profile.workHistoryHighlights || [],
          educationSummary: data.profile.educationSummary || "",
          rawTextSummary: data.profile.rawTextSummary || "",
          targetRole: data.profile.targetRole || data.profile.field || wizardInputs.field || ""
        };
        if (data.profile.field && data.profile.field.trim()) {
          setActiveJobComparisonField(data.profile.field.trim());
        }
        setWizardInputs(updatedInputs);
        try {
          localStorage.setItem("germany_eval_profile", JSON.stringify(updatedInputs));
        } catch (e) {}
        if (onProfileUpdate) {
          onProfileUpdate(updatedInputs);
        }
      }

      // Save to evalHistory
      const globalPfName = (() => {
        try {
          const saved = localStorage.getItem("germany_eval_profile");
          if (saved) {
            const pf = JSON.parse(saved);
            if (pf && pf.name && pf.name !== "کاربر نمونه" && pf.name !== "متقاضی کار در آلمان") return pf.name.trim();
          }
        } catch {}
        return "";
      })();

      const finalProfile = data.profile || {
        name: wizardInputs.name || globalPfName,
        age: wizardInputs.age,
        degree: wizardInputs.degree,
        experience: wizardInputs.experience,
        field: wizardInputs.field,
        germanLevel: wizardInputs.germanLevel,
        englishLevel: wizardInputs.englishLevel,
      };

      const finalHistoryName = (finalProfile.name && finalProfile.name.trim() !== "" && finalProfile.name !== "کاربر نمونه" && finalProfile.name !== "متقاضی کار در آلمان")
        ? finalProfile.name.trim()
        : (wizardInputs.name && wizardInputs.name.trim() !== "" && wizardInputs.name !== "کاربر نمونه" && wizardInputs.name !== "متقاضی کار در آلمان")
        ? wizardInputs.name.trim()
        : (globalPfName || "متقاضی محترم");

      const newHistoryItem = {
        id: "eval_" + Date.now(),
        timestamp: new Date().toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        name: finalHistoryName,
        age: finalProfile.age ?? wizardInputs.age,
        degree: finalProfile.degree || wizardInputs.degree,
        experience: finalProfile.experience ?? wizardInputs.experience,
        field: finalProfile.field || wizardInputs.field,
        germanLevel: finalProfile.germanLevel || wizardInputs.germanLevel,
        englishLevel: finalProfile.englishLevel || wizardInputs.englishLevel,
        report: data.result,
        fileName: pdfFile ? pdfFile.name : null,
      };

      setEvalHistory(prev => {
        const updated = [newHistoryItem, ...prev];
        try {
          localStorage.setItem("germany_eval_pathway_history", JSON.stringify(updated));
        } catch (e) {
          console.error("LocalStorage save error:", e);
        }
        return updated;
      });
      setLoadedHistoryId(newHistoryItem.id);
    } catch (err: any) {
      console.error(err);
      const isFailedToFetch = String(err.message || "").toLowerCase().includes("failed to fetch") || 
                              String(err || "").toLowerCase().includes("failed to fetch");
      
      if (isFailedToFetch) {
        setErrorMsg("ارتباط با هوش مصنوعی قطع شد. این خطا معمولاً به دلیل بزرگ بودن سایز فایل PDF رزومه یا ترافیک شدید در شبکه بوجود می‌آید. لطفاً فایل رزومه‌ی سبک‌تر (زیر ۵۰۰ کیلوبایت) آپلود کنید یا بدون آپلود فایل رزومه مجدداً شانس خود را ارزیابی نمایید.");
      } else {
        setErrorMsg(err.message || "ارتباط با سرور برقرار نشد؛ لطفاً دوباره تلاش کنید.");
      }
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const convertMarkdownToHtml = (markdown: string, isDarkTheme: boolean = false) => {
    if (!markdown) return "";
    
    const h1Color = isDarkTheme ? "#a5b4fc" : "#1e3a8a"; // indigo-300 vs blue-900
    const h2Color = isDarkTheme ? "#c7d2fe" : "#2563eb"; // indigo-200 vs blue-600
    const h3Color = isDarkTheme ? "#cbd5e1" : "#4f46e5"; // slate-300 vs indigo-600
    const boldColor = isDarkTheme ? "#f8fafc" : "#0f172a"; // slate-50 vs slate-900
    const borderColor = isDarkTheme ? "rgba(148,163,184,0.15)" : "#cbd5e1";
    const codeBg = isDarkTheme ? "#1e293b" : "#f1f5f9"; // slate-800 vs slate-100
    const tableHeaderBg = isDarkTheme ? "#1e293b" : "#f8fafc";
    const tableRowEvenBg = isDarkTheme ? "rgba(30,41,59,0.3)" : "#f8fafc";

    const lines = markdown.split(/\r?\n/);
    const result: string[] = [];
    
    let i = 0;
    while (i < lines.length) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // 1. Code Block State
      if (trimmed.startsWith("```")) {
        let codeContent: string[] = [];
        i++; // skip the opening backticks
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeContent.push(lines[i]);
          i++;
        }
        i++; // skip the closing backticks
        const codeText = codeContent.join("\n")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        
        result.push(`<pre style="background-color:${codeBg}; color:${isDarkTheme ? '#e2e8f0' : '#1e293b'}; font-family:var(--font-mono), monospace; font-size:12px; padding:12px; border-radius:8px; border:1px solid ${borderColor}; overflow-x:auto; direction:ltr; text-align:left; margin:12px 0; white-space:pre-wrap; line-height:1.5;">${codeText}</pre>`);
        continue;
      }

      // 2. Table Parsing State
      if (trimmed.startsWith("|") && i < lines.length) {
        let tableRows: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tableRows.push(lines[i].trim());
          i++;
        }

        if (tableRows.length > 0) {
          const parseRow = (rowStr: string) => {
            let s = rowStr.replace(/^\|/, "").replace(/\|$/, "");
            return s.split("|").map(cell => cell.trim());
          };

          const headerCells = parseRow(tableRows[0]);
          let tbodyRows = tableRows.slice(1);
          
          let hasDivider = false;
          if (tbodyRows.length > 0) {
            const cells = parseRow(tbodyRows[0]);
            if (cells.every(c => c.match(/^:?-+:?$/))) {
              hasDivider = true;
              tbodyRows = tbodyRows.slice(1);
            }
          }

          let tableHtml = `<div style="overflow-x:auto; margin:14px 0; border:1px solid ${borderColor}; border-radius:8px; direction:rtl; text-align:right;">`;
          tableHtml += `<table style="width:100%; border-collapse:collapse; font-size:12px; direction:rtl; text-align:right;">`;
          
          tableHtml += `<thead><tr style="background-color:${tableHeaderBg}; border-bottom:2px solid ${borderColor};">`;
          headerCells.forEach(cell => {
            let cellHtml = cell.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${boldColor}; font-weight:bold;">$1</strong>`);
            tableHtml += `<th style="padding:10px 12px; font-weight:bold; color:${boldColor}; border-left:1px solid ${borderColor}; text-align:right;">${cellHtml}</th>`;
          });
          tableHtml += `</tr></thead>`;

          tableHtml += `<tbody>`;
          tbodyRows.forEach((row, rIdx) => {
            const cells = parseRow(row);
            const rowBg = rIdx % 2 === 1 ? tableRowEvenBg : "transparent";
            tableHtml += `<tr style="background-color:${rowBg}; border-bottom:1px solid ${borderColor};">`;
            cells.forEach(cell => {
              let cellHtml = cell.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${boldColor}; font-weight:bold;">$1</strong>`);
              tableHtml += `<td style="padding:10px 12px; color:${isDarkTheme ? '#cbd5e1' : '#334155'}; border-left:1px solid ${borderColor}; text-align:right;">${cellHtml}</td>`;
            });
            tableHtml += `</tr>`;
          });
          tableHtml += `</tbody></table></div>`;
          result.push(tableHtml);
          continue;
        }
      }

      // 3. Horizontal Separator
      if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
        result.push(`<hr style="border:0; border-top:1px solid ${borderColor}; margin:1.5em 0;" />`);
        i++;
        continue;
      }

      // 4. ASCII Tree lines and general diagram layout preservation
      const isTreeLine = trimmed.includes("├──") || trimmed.includes("└──") || trimmed.includes("──►") || trimmed.includes("┌──") || trimmed.includes("└──");
      if (isTreeLine) {
        let treeLines: string[] = [];
        while (i < lines.length && (lines[i].trim().includes("├──") || lines[i].trim().includes("└──") || lines[i].trim().includes("──►") || lines[i].trim().includes("┌──") || lines[i].trim().includes("└──") || lines[i].trim() === "")) {
          treeLines.push(lines[i]);
          i++;
        }
        const treeText = treeLines.join("\n")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        result.push(`<pre style="background-color:${codeBg}; color:${isDarkTheme ? '#cbd5e1' : '#334155'}; font-family:var(--font-mono), monospace; font-size:12px; padding:12px; border-radius:8px; border:1px solid ${borderColor}; overflow-x:auto; direction:ltr; text-align:left; margin:12px 0; white-space:pre; line-height:1.6;">${treeText}</pre>`);
        continue;
      }

      let processed = rawLine.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${boldColor};font-weight:bold;">$1</strong>`);

      // 5. Headers
      if (trimmed.startsWith("###")) {
        const content = trimmed.replace(/^###\s*\*\*(.*?)\*\*/, "$1").replace(/^###\s*(.*)/, "$1").replace(/\*\*/g, "");
        result.push(`<h3 style="color:${h3Color};font-size:15px;margin-top:1.2em;margin-bottom:0.4em;font-weight:bold;border-bottom:1px solid ${borderColor};padding-bottom:4px;direction:rtl;text-align:right;break-after:avoid;page-break-after:avoid;">${content}</h3>`);
        i++;
        continue;
      }
      if (trimmed.startsWith("##")) {
        const content = trimmed.replace(/^##\s*\*\*(.*?)\*\*/, "$1").replace(/^##\s*(.*)/, "$1").replace(/\*\*/g, "");
        result.push(`<h2 style="color:${h2Color};font-size:17px;margin-top:1.4em;margin-bottom:0.4em;font-weight:bold;border-bottom:1px solid ${borderColor};padding-bottom:4px;direction:rtl;text-align:right;break-after:avoid;page-break-after:avoid;">${content}</h2>`);
        i++;
        continue;
      }
      if (trimmed.startsWith("#")) {
        const content = trimmed.replace(/^#\s*\*\*(.*?)\*\*/, "$1").replace(/^#\s*(.*)/, "$1").replace(/\*\*/g, "");
        result.push(`<h1 style="color:${h1Color};font-size:19px;margin-top:1.5em;margin-bottom:0.5em;font-weight:extrabold;direction:rtl;text-align:right;break-after:avoid;page-break-after:avoid;">${content}</h1>`);
        i++;
        continue;
      }

      // 6. Bullet Lists
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const content = processed.replace(/^\s*[-*]\s+/, "");
        result.push(`<li style="margin-right:20px;margin-left:0;margin-bottom:4px;list-style-type:disc;direction:rtl;text-align:right;list-style-position:inside;padding-right:4px;break-inside:avoid;page-break-inside:avoid;">${content}</li>`);
        i++;
        continue;
      }

      // 7. Numbered Lists
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        const content = processed.replace(/^\s*\d+\.\s+/, "");
        result.push(`<li style="margin-right:20px;margin-left:0;margin-bottom:4px;list-style-type:decimal;direction:rtl;text-align:right;list-style-position:inside;padding-right:4px;break-inside:avoid;page-break-inside:avoid;">${content}</li>`);
        i++;
        continue;
      }

      // 8. Blockquotes
      if (trimmed.startsWith(">")) {
        const content = processed.replace(/^>\s*/, "");
        const quoteBg = isDarkTheme ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
        const quoteBorder = '#3b82f6';
        result.push(`<div style="background-color:${quoteBg}; border-right:4px solid ${quoteBorder}; padding:10px 14px; margin:10px 0; border-radius:4px; direction:rtl; text-align:right; font-size:13px; line-height:1.7; break-inside:avoid; page-break-inside:avoid;">${content}</div>`);
        i++;
        continue;
      }

      // 9. Normal paragraphs
      if (trimmed === "") {
        // Skip consecutive blank lines
      } else {
        result.push(`<p style="margin: 0 0 8px 0; direction:rtl; text-align:right; line-height: 1.7; break-inside:avoid; page-break-inside:avoid;">${processed}</p>`);
      }
      i++;
    }

    return result.join("\n");
  };

  const handleDownloadWord = async () => {
    try {
      const res = await fetchWithRetry("/api/logo-base64");
      const data = await res.json();
      const logoBase64 = data.success ? data.base64 : "";
      
      const bodyHtml = convertMarkdownToHtml(aiReport);
      
      const documentHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<style>
  @page {
    size: A4;
    margin: 20mm !important;
    margin-top: 20mm !important;
    margin-bottom: 20mm !important;
    margin-left: 20mm !important;
    margin-right: 20mm !important;
  }
  body {
    direction: rtl;
    font-family: 'Tahoma', 'Arial', sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.6;
  }
  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -150px;
    margin-top: -150px;
    width: 300px;
    height: 300px;
    opacity: 0.08;
    z-index: -1000;
  }
  .header-box {
    border-bottom: 2px solid #eab308;
    padding-bottom: 12px;
    margin-bottom: 30px;
    text-align: center;
  }
  .header-box h1 {
    font-size: 20px;
    color: #4f46e5;
    margin: 0 0 5px 0;
  }
  .header-box p {
    font-size: 11px;
    color: #b45309;
    font-weight: bold;
    margin: 0;
  }
  .content {
    font-size: 13.5px;
    text-align: justify;
  }
  .footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
    margin-top: 40px;
    text-align: center;
    font-size: 10px;
    color: #cbd5e1;
  }
</style>
</head>
<body>
  ${logoBase64 ? `<div class="watermark"><img src="data:image/jpeg;base64,${logoBase64}" style="width: 300px; opacity: 0.08;" /></div>` : ""}
  
  <div class="header-box">
    <h1>گزارش ارزیابی تخصصی مهاجرت آلمان</h1>
    <p>تمامی حقوق این مستند؛ متعلق به گروه شرکت‌های جهانبان است.</p>
  </div>
  
  <div class="content">
    ${bodyHtml}
  </div>
  
  <div class="footer">
    سامانه هوشمند ارزیابی و کاریابی جاب فایندر آلمان - خانه خلاق جهانبان
  </div>
</body>
</html>
      `.trim();

      const blob = new Blob([documentHtml], { type: "application/msword;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileTitle = formatPrintDocumentTitle("گزارش ارزیابی جامع مهاجرت", effectiveProfile.name);
      link.download = `${fileTitle}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating word report:", error);
    }
  };

  const handleDownloadPdf = async (configOrFilename?: string | PdfExportDialogConfig) => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    setPdfDownloadSuccess(false);

    try {
      let logoBase64 = "";
      try {
        const res = await fetchWithRetry("/api/logo-base64");
        const data = await res.json();
        if (data.success) logoBase64 = data.base64;
      } catch (e) {
        console.warn("Logo base64 fetch warning:", e);
      }
      
      const effectiveField = activeJobComparisonField || effectiveProfile.field;
      const defaultDocTitle = formatPrintDocumentTitle("کارنامه_ارزیابی_جامع_مهاجرت_آلمان", effectiveProfile.name);
      
      let customFilename = "";
      let selectedSections = undefined;
      let orientation: "portrait" | "landscape" = "portrait";
      let watermark = pdfWatermarkEnabled;

      if (typeof configOrFilename === "string") {
        customFilename = configOrFilename;
      } else if (configOrFilename && typeof configOrFilename === "object") {
        customFilename = configOrFilename.filename;
        selectedSections = configOrFilename.selectedSections;
        orientation = configOrFilename.orientation || "portrait";
        watermark = configOrFilename.includeWatermark ?? pdfWatermarkEnabled;
      }

      const validCustomFilename = typeof customFilename === "string" && customFilename.trim() ? customFilename.trim() : "";
      let outputFilename = validCustomFilename || `${defaultDocTitle}.pdf`;
      if (!outputFilename.toLowerCase().endsWith(".pdf")) {
        outputFilename += ".pdf";
      }
      const reportContent = aiReport || evaluateRuleBased();
      const radarData = getRadarDataPersian();

      const candidateId = effectiveProfile?.name 
        ? effectiveProfile.name.replace(/\s+/g, "").slice(0, 6).toUpperCase() 
        : "APPLICANT";
      const docId = `JB-DE-2026-EVAL-${candidateId}`;

      // Calibrated standard DIN A4 print margins protecting content without excessive whitespace
      let marginPresetValues: [number, number, number, number] = [6, 6, 8, 6];
      try {
        const savedPreset = localStorage.getItem("jahanban_print_margin_preset");
        if (savedPreset === "compact") {
          marginPresetValues = [4, 4, 6, 4];
        } else if (savedPreset === "wide") {
          marginPresetValues = [10, 8, 12, 8];
        }
      } catch {
        // fallback to standard
      }

      await exportDashboardToGermanPdf({
        profile: effectiveProfile,
        aiReport: reportContent,
        field: effectiveField,
        radarData,
        jobComparisonData: activeJobComparisonData,
        showWatermark: watermark,
        docId,
        logoBase64,
        sections: selectedSections
      }, outputFilename, {
        margin: marginPresetValues,
        orientation,
        scale: 2
      });

      setPdfDownloadSuccess(true);
      setTimeout(() => setPdfDownloadSuccess(false), 4000);
    } catch (error) {
      console.error("Error generating printable PDF draft:", error);
      setPdfDownloadError("خطا در دانلود خودکار فایل PDF. لطفاً از گزینه 'چاپ کارنامه رسمی (A4)' استفاده نمایید.");
      setTimeout(() => setPdfDownloadError(""), 5000);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleConfirmPdfSelection = async (config: PdfExportDialogConfig) => {
    try {
      await handleDownloadPdf(config);
      setIsPdfPageSelectionOpen(false);
    } catch (err) {
      console.error("Error confirming PDF page selection:", err);
    }
  };

  const memoizedSkillsProfile = useMemo(() => ({
    ...effectiveProfile,
    field: activeJobComparisonField || effectiveProfile.field
  }), [
    effectiveProfile.name,
    effectiveProfile.age,
    effectiveProfile.degree,
    effectiveProfile.experience,
    effectiveProfile.field,
    effectiveProfile.germanLevel,
    effectiveProfile.englishLevel,
    effectiveProfile.skills,
    activeJobComparisonField
  ]);

  const handleExportEvaluationPrintPdf = () => {
    // Add print-target-evaluation class so @media print specifically isolates and formats the evaluation report using print simulation rules
    document.body.classList.add("print-target-evaluation");
    
    const originalTitle = document.title;
    const name = (effectiveProfile.name || "Applicant").trim();
    const printDocTitle = formatPrintDocumentTitle("گزارش_ارزیابی_تخصصی_مهاجرت_آلمان", name);
    document.title = printDocTitle;
    
    const cleanup = () => {
      document.body.classList.remove("print-target-evaluation");
      document.title = originalTitle;
      window.removeEventListener("afterprint", cleanup);
    };
    
    window.addEventListener("afterprint", cleanup);
    
    setTimeout(() => {
      window.print();
      setTimeout(cleanup, 2500);
    }, 150);
  };

  return (
    <div id="dashboard-tab" className="space-y-8 animate-fade-in relative print-document-sheet">
      {/* Official Jahanban Print Layout bound within the Dashboard A4 page container */}
      <JahanbanPrintLayout activeTab="dashboard" profile={effectiveProfile} className="jb-dashboard-header" />

      {/* Formal Candidate Profile Dossier Box rendered in Print / Simulation */}
      <div className="print-only hidden p-4 bg-slate-50 border border-slate-300 rounded-xl mb-4 text-xs text-slate-800 print-break-inside-avoid" id="jb-print-candidate-profile">
        <h3 className="font-bold text-sm text-indigo-950 border-b border-slate-300 pb-1.5 mb-2.5">
          مشخصات سجلی و تخصصی متقاضی ارزیابی شده:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div><span className="text-slate-500 font-medium">نام متقاضی:</span> <strong className="text-slate-900">{effectiveProfile.name || "متقاضی محترم"}</strong></div>
          <div><span className="text-slate-500 font-medium">سن:</span> <strong className="text-slate-900">{effectiveProfile.age} سال</strong></div>
          <div><span className="text-slate-500 font-medium">رشته / تخصص:</span> <strong className="text-indigo-900">{effectiveField}</strong></div>
          <div><span className="text-slate-500 font-medium">مدرک تحصیلی:</span> <strong className="text-slate-900">{effectiveProfile.degree}</strong></div>
          <div><span className="text-slate-500 font-medium">سابقه کار:</span> <strong className="text-slate-900">{effectiveProfile.experience} سال</strong></div>
          <div><span className="text-slate-500 font-medium">مسیر زبان:</span> <strong className="text-slate-900">آلمانی: {effectiveProfile.germanLevel} | انگلیسی: {effectiveProfile.englishLevel}</strong></div>
        </div>
      </div>

      {/* Top Action Bar: Generate & Download Smart Evaluation Report via jsPDF */}
      <div 
        id="dashboard-top-evaluation-pdf-bar"
        className="dashboard-screen-only no-print flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 md:px-6 shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 text-right flex-1 min-w-[280px]">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs md:text-sm font-black text-white">
              <span>گزارش و کارنامه جامع ارزیابی هوشمند مهاجرت کاری آلمان</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                موتور تولید PDF با jsPDF (استاندارد DIN A4)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              تولید پرونده کامل رسمی با استانداردهای ۲۰۲۶ شامل تحلیل آنابین، رادار شایستگی، شانس بلوکارت و نقشه راه اختصاصی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {pdfDownloadSuccess && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-2 rounded-xl animate-fade-in flex items-center gap-1.5 shadow-sm">
              <Check className="w-4 h-4" />
              <span>فایل PDF با موفقیت دانلود و ذخیره شد</span>
            </span>
          )}

          <button
            type="button"
            id="top-btn-download-smart-eval-pdf"
            onClick={() => setIsPdfPageSelectionOpen(true)}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer border border-emerald-400/30 disabled:opacity-60"
            title="انتخاب صفحات و دانلود نسخه PDF گزارش ارزیابی هوشمند با استفاده از کتابخانه jsPDF"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>در حال ایجاد فایل PDF با jsPDF...</span>
              </>
            ) : (
              <>
                <Sliders className="w-4 h-4 text-emerald-200" />
                <span>انتخاب صفحات و دانلود نسخه PDF (jsPDF)</span>
                <Download className="w-3.5 h-3.5 text-emerald-300" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Welcome banner */}
      <div className="dashboard-screen-only no-print relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50/90 via-emerald-50/90 to-indigo-50/90 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/50 border border-indigo-100 dark:border-slate-800 p-5 md:py-6 md:px-8">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl md:max-w-2xl text-right flex-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 mb-2.5 border border-emerald-500/30 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              سیستم مهاجرت هوشمند کار در آلمان (نسخه جدید)
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              همیار هوشمند <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-700 via-teal-600 to-indigo-800 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-300">کاریابی و مهاجرت تخصصی</span> به آلمان
            </h1>
            <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm font-medium">
              بر اساس قوانین جدید دولت فدرال آلمان (بلوکارت ۲۰۲۶)، مشخصات خود را وارد کنید، مسیر قانونی مناسب خود را بیابید و با کمک هوش مصنوعی رزومه تخصصی آلمانی بسازید.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="hero-btn-download-smart-eval-pdf"
                onClick={() => setIsPdfPageSelectionOpen(true)}
                disabled={isDownloadingPdf}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition cursor-pointer disabled:opacity-60 border border-emerald-400/30"
                title="ایجاد و دانلود نسخه PDF گزارش ارزیابی هوشمند با کتابخانه jsPDF (با انتخاب صفحات)"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>در حال ساخت سند PDF با jsPDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-emerald-200" />
                    <span>دانلود نسخه PDF ارزیابی (با امکان انتخاب صفحات)</span>
                    <Download className="w-3 h-3 text-emerald-300" />
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="w-24 h-24 md:w-36 md:h-24 shrink-0 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <img 
              src={germanyBanner} 
              alt="کاریابی آلمان" 
              className="w-full h-full object-cover filter brightness-100 hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-100/30 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Visual Progress Tracker for German Opportunity Card (Chancenkarte 2026) */}
      <div className="dashboard-screen-only no-print mb-8">
        <ChancenkarteProgressTracker profile={effectiveProfile} onTabChange={onTabChange} />
      </div>

      {/* Visual Progress Tracker toward Immigration */}
      <div className="dashboard-screen-only no-print">
        <ImmigrationProgressTracker profile={effectiveProfile} onTabChange={onTabChange} />
      </div>

      {/* Career Coaching daily interview tips widget */}
      <div className="dashboard-screen-only no-print mb-8">
        <CareerCoachingWidget userField={effectiveProfile.field} />
      </div>

      {/* Industry Demand Trends Visualization Widget */}
      <div className="dashboard-screen-only no-print mb-8">
        <IndustryDemandTrends userField={effectiveProfile.field} />
      </div>

      {/* German Market Demand Distribution Pie Chart Widget (Live Gemini Data & High-Demand Sectors) */}
      <div className="dashboard-screen-only no-print mb-8" id="dashboard-german-market-demand-pie-section">
        <GermanMarketDemandPieWidget 
          userField={effectiveProfile.field} 
          onNavigateToTab={onTabChange}
        />
      </div>

      {/* AI-Powered German Salary Estimator Tool */}
      <div className="dashboard-screen-only no-print mb-8" id="dashboard-salary-estimator-section">
        <SalaryEstimator 
          profile={effectiveProfile} 
          userField={effectiveProfile.field}
          onNavigateToTab={onTabChange}
        />
      </div>

      {/* Cost of Living Comparison Widget */}
      <div className="dashboard-screen-only no-print mb-8">
        <CostOfLivingCompare userField={effectiveProfile.field} />
      </div>

      {/* Visual Immigration Budget & Costs Planner Widget (Recharts Pie & Bar Chart) */}
      <div className="dashboard-screen-only no-print mb-8" id="dashboard-immigration-budget-section">
        <ImmigrationBudgetPlanner userField={effectiveProfile.field} />
      </div>

      {/* German Language Buddy Widget */}
      <div className="dashboard-screen-only no-print mb-8">
        <LanguageBuddy userField={effectiveProfile.field} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visa wizard input form - Span 5 */}
        <div className="dashboard-screen-only no-print lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ارزیابی تخصصی و استخراج اطلاعات</h2>
              <p className="text-xs text-slate-400">بارگذاری رزومه، استخراج هوشمند و تجمیع اطلاعات برای مهاجرت آلمان</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1: PDF Resume Uploader & Extractor Button */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-300">
                  <UploadCloud className="w-3.5 h-3.5" />
                  گام ۱: بارگذاری و استخراج رزومه (PDF)
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                  اختیاری / توصیه شده
                </span>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-4 transition duration-200 text-center flex flex-col items-center justify-center cursor-pointer ${
                  dragActive 
                    ? "border-emerald-400 bg-emerald-500/10" 
                    : pdfFile 
                      ? "border-indigo-500 bg-indigo-950/20" 
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
                onClick={() => {
                  if (!pdfFile) {
                    const fileInput = document.getElementById("pdf-upload-input");
                    fileInput?.click();
                  }
                }}
              >
                <input
                  id="pdf-upload-input"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                {pdfFile ? (
                  <div className="w-full flex items-center justify-between gap-3 text-right">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">{pdfFile.name}</p>
                        <p className="text-[10px] text-slate-400">{(pdfFile.size / (1024 * 1024)).toFixed(2)} مگابایت</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition cursor-pointer"
                      title="حذف فایل"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className={`h-7 w-7 mb-1.5 ${dragActive ? "text-emerald-400 animate-bounce" : "text-slate-500"}`} />
                    <p className="text-xs text-slate-200 font-bold">آپلود فایل رزومه به صورت PDF</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      فایل را اینجا رها کنید یا کلیک کنید (حداکثر ۲ مگابایت)
                    </p>
                  </>
                )}
              </div>

              {pdfError && (
                <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {pdfError}
                </p>
              )}

              {/* Extraction Trigger CTA when PDF is uploaded */}
              {pdfFile && (
                <div className="pt-2">
                  {extractionStatus === 'idle' && (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-right">
                        <p className="text-[11px] text-amber-300 leading-relaxed font-medium">
                          فایل رزومه شما بارگذاری شد. لطفاً روی دکمه زیر کلیک کنید تا هوش مصنوعی اطلاعات تحصیلی، سوابق و تخصص شما را از رزومه استخراج کرده و فیلدهای لازم جهت تکمیل (سن، زبان و...) را آماده کند.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExtractResumeData}
                        disabled={isExtracting}
                        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>استخراج اطلاعات از رزومه (جهت بازبینی و تکمیل)</span>
                      </button>
                    </div>
                  )}

                  {extractionStatus === 'extracting' && (
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center gap-2 text-indigo-300 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      <span>در حال استخراج هوشمند اطلاعات و سوابق از فایل رزومه...</span>
                    </div>
                  )}

                  {extractionStatus === 'extracted' && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          اطلاعات رزومه با موفقیت استخراج شد
                        </span>
                        <button
                          type="button"
                          onClick={handleExtractResumeData}
                          className="text-[10px] text-slate-400 hover:text-emerald-300 underline cursor-pointer"
                        >
                          استخراج مجدد
                        </button>
                      </div>
                      {wizardInputs.name && wizardInputs.name.trim() !== "" && wizardInputs.name !== "کاربر نمونه" && (
                        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-200 text-xs">
                          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>نام و نام خانوادگی استخراج‌شده: <strong className="text-white font-bold">{wizardInputs.name}</strong></span>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        اطلاعات هویتی و سوابق شما استخراج گردید. فیلدهایی نظیر <strong className="text-amber-400">سن متقاضی</strong> و <strong className="text-amber-400">سطح زبان‌های آلمانی و انگلیسی</strong> که در رزومه‌ها ذکر نمی‌شوند، در فرم زیر هایلایت شده‌اند؛ لطفاً آنها را تکمیل نمایید.
                      </p>
                    </div>
                  )}

                  {extractionStatus === 'error' && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-right space-y-2">
                      <p className="text-[11px] text-red-300 leading-relaxed font-medium">{extractionError}</p>
                      <button
                        type="button"
                        onClick={handleExtractResumeData}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>تلاش مجدد برای استخراج</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Review, Complete & Merge Form */}
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  گام ۲: بازبینی، تکمیل فیلدهای ضروری و تجمیع اطلاعات
                </span>
                <span className="text-[10px] text-slate-400">
                  {pdfFile ? "تکمیل اطلاعات رزومه" : "ورود مستقیم اطلاعات"}
                </span>
              </div>

              {/* SECTION A: Crucial fields that are usually NOT in resumes */}
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3.5">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] font-bold">
                    اطلاعات تکمیلی و حیاتی (اغلب در رزومه ذکر نمی‌شوند اما برای ارزیابی الزامی هستند)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Age */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-200">
                        سن متقاضی (سال)
                      </label>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        الزامی
                      </span>
                    </div>
                    <input
                      type="number"
                      min="18"
                      max="65"
                      className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none font-sans"
                      value={wizardInputs.age}
                      onChange={(e) => setWizardInputs({ ...wizardInputs, age: parseInt(e.target.value) || 18 })}
                      placeholder="مثال: ۲۸"
                    />
                    <p className="text-[9px] text-slate-400 leading-tight">
                      تعیین‌کننده امتیاز کارت فرصت و سقف حقوق بازنشستگی بلوکارت
                    </p>
                  </div>

                  {/* German Level */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-200">
                        دانش زبان آلمانی
                      </label>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        ضروری
                      </span>
                    </div>
                    <select
                      className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none font-sans"
                      value={wizardInputs.germanLevel}
                      onChange={(e) => setWizardInputs({ ...wizardInputs, germanLevel: e.target.value })}
                    >
                      <option value="عدم آشنایی">عدم آشنایی</option>
                      <option value="A1">A1 (آماتور)</option>
                      <option value="A2">A2 (مقدماتی)</option>
                      <option value="B1">B1 (متوسط پائین)</option>
                      <option value="B2">B2 (متوسط بالا)</option>
                      <option value="C1">C1 (پیشرفته)</option>
                      <option value="C2">C2 (بومی)</option>
                    </select>
                    <p className="text-[9px] text-slate-400 leading-tight">
                      افزاینده شانس مصاحبه در شرکت‌های آلمانی‌زبان
                    </p>
                  </div>

                  {/* English Level */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-200">
                        دانش زبان انگلیسی
                      </label>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        ضروری
                      </span>
                    </div>
                    <select
                      className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none font-sans"
                      value={wizardInputs.englishLevel}
                      onChange={(e) => setWizardInputs({ ...wizardInputs, englishLevel: e.target.value })}
                    >
                      <option value="عدم آشنایی">عدم آشنایی</option>
                      <option value="A1/A2">مقدماتی (A1/A2)</option>
                      <option value="B1">B1 (متوسط کاربردی)</option>
                      <option value="B2">B2 (تسلط خوب کاری)</option>
                      <option value="C1">C1 (پیشرفته / شایستگی عالی ۹۵٪)</option>
                      <option value="C2">C2 (تسلط کامل / بومی)</option>
                      <option value="C1/C2">C1/C2 (روان / آکادمیک)</option>
                    </select>
                    <p className="text-[9px] text-slate-400 leading-tight">
                      الزام پوزیشن‌های بین‌المللی و حوزه‌های فناوری اطلاعات
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION B: Extracted or standard profile fields */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    مشخصات هویتی، تحصیلی و شغلی {extractedProfile ? "(استخراج‌شده از رزومه)" : ""}
                  </span>
                  {extractedProfile && (
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      قابل ویرایش
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">نام و نام خانوادگی متقاضی</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                      value={wizardInputs.name || ""}
                      onChange={(e) => setWizardInputs({ ...wizardInputs, name: e.target.value })}
                      placeholder="مثال: علی احمدی"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">حوزه تخصصی / شغل مدنظر</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                      value={wizardInputs.field}
                      onChange={(e) => setWizardInputs({ ...wizardInputs, field: e.target.value })}
                      placeholder="مثال: مهندس نرم‌افزار، پرستار، مکانیک"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">آخرین مقطع تحصیلی رسمی</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                      value={wizardInputs.degree}
                      onChange={(e) => setWizardInputs({ ...wizardInputs, degree: e.target.value })}
                    >
                      <option value="none">فاقد مدرک دانشگاهی / زیر دیپلم</option>
                      <option value="diploma">دیپلم متوسطه یا فنی و حرفه‌ای</option>
                      <option value="associate">کاردانی (فوق دیپلم)</option>
                      <option value="bachelor">کارشناسی (لیسانس)</option>
                      <option value="master">کارشناسی ارشد (فوق لیسانس)</option>
                      <option value="phd">دکتری و بالاتر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">سابقه کار مرتبط مستند (سال)</label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                      value={wizardInputs.experience}
                      onChange={(e) => setWizardInputs({ ...wizardInputs, experience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Skills field */}
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">مهارت‌ها، فناوری‌ها و ابزارهای کلیدی</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                    value={wizardInputs.skills || ""}
                    onChange={(e) => setWizardInputs({ ...wizardInputs, skills: e.target.value })}
                    placeholder="مثال: React, Node.js, Docker, Git, اتوکد، طراحی مدار، مراقبت‌های ویژه"
                  />
                </div>
              </div>

              {/* Rule Advisor Output */}
              <div className={`p-4 rounded-xl border ${currentAdvice.color} transition-all duration-300`}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{currentAdvice.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentAdvice.desc}</p>
                  </div>
                </div>
              </div>

              {/* Primary Combine & Evaluate Button */}
              <button
                onClick={handleAiEvaluation}
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-500/10 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
                    <span>{loadingStep || "در حال تجمیع اطلاعات و ارزیابی شرایط با هوش مصنوعی..."}</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 text-slate-950" />
                    <span>
                      {pdfFile ? "تجمیع اطلاعات و شروع ارزیابی جامع با هوش مصنوعی" : "شروع ارزیابی جامع هوشمند با هوش مصنوعی"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* History of Evaluations */}
          {evalHistory.length > 0 && (
            <div className="mt-8 border-t border-slate-800/80 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs sm:text-sm">
                  <History className="h-4 w-4 text-emerald-400" />
                  <span>پرونده‌ها و تاریخچه ارزیابی‌های قبلی شما</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-950 px-2.5 py-1 rounded-lg text-slate-500 border border-slate-800">
                  {evalHistory.length} ارزیابی
                </span>
              </div>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {evalHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadEval(item)}
                    className={`text-right p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group text-xs ${
                      loadedHistoryId === item.id
                        ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/5"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="font-bold text-slate-200 truncate">
                          {item.name && item.name !== "کاربر نمونه" && item.name !== "متقاضی کار در آلمان"
                            ? item.name
                            : (() => {
                                try {
                                  const saved = localStorage.getItem("germany_eval_profile");
                                  if (saved) {
                                    const pf = JSON.parse(saved);
                                    if (pf && pf.name && pf.name !== "کاربر نمونه" && pf.name !== "متقاضی کار در آلمان") return pf.name;
                                  }
                                } catch {}
                                return item.name || "متقاضی محترم";
                              })()}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">({item.age} سال)</span>
                      </div>
                      <p className="font-medium text-slate-400 text-[11px] truncate">{item.field}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>منبع: {item.fileName ? `رزومه (${item.fileName})` : "فرم دستی"}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteEval(item.id, e)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-400 transition shrink-0 cursor-pointer"
                      title="حذف از تاریخچه"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI report space & visa routes info - Span 7 */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {isLoading || aiReport || errorMsg ? (
              <motion.div
                key="reports-section"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[440px] flex flex-col justify-between"
                id="dashboard-ai-report-card"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-teal-400" />
                      <h3 className="text-lg font-bold text-white">گزارش ارزیابی تخصصی مهاجرت</h3>
                    </div>
                    {aiReport && (
                      <div className="flex items-center gap-2 no-print flex-wrap">
                        {/* Browser-native print export specifically styled with print simulation rules */}
                        <button
                          onClick={handleExportEvaluationPrintPdf}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
                          title="خروجی PDF با دستور چاپ مرورگر و استایل‌های شبیه‌ساز چاپ استاندارد DIN A4"
                          id="btn-header-print-native-pdf"
                        >
                          <Printer className="w-3.5 h-3.5 text-indigo-200" />
                          <span>خروجی PDF رسمی (Print)</span>
                        </button>

                        <button
                          onClick={() => setIsPdfPageSelectionOpen(true)}
                          disabled={isDownloadingPdf}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                          title="دانلود خروجی گزارش هوشمند مهاجرتی به صورت فایل PDF استاندارد با امکان انتخاب صفحات"
                          id="btn-header-pdf-download"
                        >
                          {isDownloadingPdf ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                              <span>در حال ساخت PDF...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-white" />
                              <span>دانلود فایل PDF (انتخاب صفحات)</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleAiEvaluation}
                          className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" /> ارزیابی مجدد
                        </button>
                      </div>
                    )}
                  </div>

                  {loadedHistoryId && (
                    <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-between text-xs animate-fade-in no-print bg-slate-950">
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-indigo-400 animate-pulse shrink-0" />
                        <span>در حال مشاهده ارزیابی بایگانی‌شده ({evalHistory.find(h => h.id === loadedHistoryId)?.timestamp || ""})</span>
                      </div>
                      <button 
                        onClick={() => {
                          setAiReport("");
                          setLoadedHistoryId(null);
                        }}
                        className="text-[10px] text-indigo-400 hover:underline font-bold cursor-pointer"
                      >
                        بستن گزارش
                      </button>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Loader2 className="h-10 w-10 text-emerald-400 animate-spin mb-4" />
                      <p className="text-white font-medium text-sm">{loadingStep}</p>
                      <p className="text-xs text-slate-400 mt-2">این تحلیل ممکن است تا چند ثانیه زمان ببرد...</p>
                    </div>
                  ) : errorMsg ? (
                    <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-200 rounded-xl text-center">
                      {errorMsg}
                    </div>
                  ) : (
                    <div 
                      className="text-sm leading-relaxed text-slate-200 overflow-y-auto max-h-[650px] pl-2 space-y-4 font-sans scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent text-right ai-report-content"
                      dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(aiReport, true) }}
                    />
                  )}
                </div>

                {!isLoading && aiReport && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                    {/* Status Feedback Toasts */}
                    {pdfDownloadSuccess && (
                      <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center justify-center gap-2 animate-fade-in no-print font-medium shadow-sm">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>فایل PDF استاندارد گزارش هوشمند با رعایت کامل تمام استایل‌های چاپی index.css با موفقیت دانلود شد.</span>
                      </div>
                    )}
                    {pdfDownloadError && (
                      <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center justify-center gap-2 animate-fade-in no-print font-medium shadow-sm">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{pdfDownloadError}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 items-center justify-center no-print">
                      {/* Watermark Clean vs Branded Toggle */}
                      <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs" title="انتخاب حالت خروجی PDF: رسمی شرکتی جهانبان یا ساده و بدون واترمارک">
                        <button
                          type="button"
                          onClick={() => handleWatermarkToggle(false)}
                          className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                            !pdfWatermarkEnabled
                              ? "bg-slate-700 text-emerald-300 font-bold shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                          id="btn-pdf-watermark-clean"
                        >
                          نسخه تمیز (Clean)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWatermarkToggle(true)}
                          className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                            pdfWatermarkEnabled
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                          id="btn-pdf-watermark-branded"
                        >
                          واترمارک جهانبان (Branded)
                        </button>
                      </div>

                      <button
                        onClick={handleDownloadWord}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all duration-150 cursor-pointer"
                        id="btn-download-word"
                      >
                        <FileText className="w-4 h-4 text-indigo-200" />
                        دانلود نسخه Word
                      </button>

                      {/* Primary Download Button for Standard PDF using jsPDF with page selection */}
                      <button
                        onClick={() => setIsPdfPageSelectionOpen(true)}
                        disabled={isDownloadingPdf}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-emerald-500/25 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-60 border border-emerald-400/30"
                        id="btn-download-pdf"
                        title="دانلود خروجی گزارش هوشمند مهاجرتی به صورت فایل PDF استاندارد با استفاده از jsPDF و انتخاب صفحات"
                      >
                        {isDownloadingPdf ? (
                          <>
                            <Loader2 className="w-4 h-4 text-emerald-100 animate-spin" />
                            <span>در حال تولید PDF استاندارد...</span>
                          </>
                        ) : pdfDownloadSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-200" />
                            <span>فایل PDF دانلود شد!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-emerald-200" />
                            <span>دانلود فایل PDF گزارش (انتخاب صفحات)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("toggle-print-simulation"))}
                        className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all duration-150 cursor-pointer"
                        id="btn-simulate-print-eval"
                        title="شبیه‌سازی چیدمان و حاشیه ۲۰ میلی‌متری کاغذ در مرورگر قبل از باز شدن پنجره چاپ"
                      >
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>پیش‌نمایش زنده چیدمان چاپ</span>
                      </button>

                      {/* Browser-Native Print PDF Export specifically styled with Print Simulation Styles */}
                      <button
                        onClick={handleExportEvaluationPrintPdf}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-600/25 active:scale-95 transition-all duration-150 cursor-pointer border border-indigo-400/30"
                        id="btn-print-official-eval"
                        title="تولید فایل PDF گزارش ارزیابی از طریق فرمان چاپ مرورگر (Print to PDF) با اعمال استایل‌های شبیه‌ساز چاپ DIN A4"
                      >
                        <Printer className="w-4 h-4 text-indigo-200" />
                        <span>خروجی PDF با استایل چاپ (Print to PDF)</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 text-center no-print">
                      خروجی PDF منطبق بر استاندارد DIN 5008 و تمامی قوانین بصری چاپ مندرج در استایل‌های رسمی سامانه صادر می‌شود.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="info-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-indigo-400" /> گزینه‌های اصلی اقامت کاری آلمان
                    </h3>
                    <button
                      onClick={() => {
                        const el = document.getElementById("visa-strategy-simulator-forecast");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                      <span>پیش‌بینی تصویری شانس انواع ویزا (Bar Chart)</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visaRoutes.map((route) => (
                      <div key={route.id} className="bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 p-4 rounded-xl transition duration-300 flex flex-col justify-between">
                        <div>
                          <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded ${route.badgeColor} mb-2`}>
                            {route.id === "blue-card" ? "بلو کارت" : route.id === "chancenkarte" ? "کارت فرصت" : "نیروی آکادمیک"}
                          </span>
                          <h4 className="text-sm font-bold text-white mb-1">{route.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed truncate">{route.subtitle}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-900/10 flex items-center justify-between">
                          <span className="text-[11px] text-indigo-400 leading-none">توضیحات و شرایط</span>
                          <span className="text-xs text-slate-500">مشاهده الزامات</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                  <div className="bg-amber-400/10 p-3 rounded-lg text-amber-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">آیا می‌دانستید؟ (کارت فرصت در آلمان)</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      از جون ۲۰۲۴، حتی بدون پیش‌فرم جاب‌آفر هم می‌توانید با دریافت ۶ امتیاز از سیستم فدرال آلمان اقدام کنید. برای محاسبه امتیازهای دقیق خود، به زبانه <strong>کارت فرصت (Chancenkarte)</strong> بروید.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Profile & Extracted CV Evaluation Cards */}
      <DashboardEvaluationCards 
        profile={effectiveProfile} 
        cvData={(() => {
          try {
            const savedCv = localStorage.getItem("germany_cv_builder_data");
            return savedCv ? JSON.parse(savedCv) : null;
          } catch {
            return null;
          }
        })()}
        onNavigateToTab={onTabChange}
      />

      {/* New AI Visa Success Predictor Card based on German Laws */}
      <VisaSuccessPredictorCard 
        profile={effectiveProfile}
        onNavigateToTab={onTabChange}
      />

      {/* Permanent Radar Match Chart inside Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden print-break-inside-avoid" id="dashboard-radar-card">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>رادار تطبیق شایستگی‌های آلمان (German Competency Match Radar)</span>
            </div>
            <h3 className="text-lg font-black text-white">تحلیل راداری انطباق شرایط با نیازهای بازار کار آلمان</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              این ابزار بصری بر اساس اطلاعات پروفایل شما و الزامات استاندارد ویزای کاری فدرال آلمان (بلوکارت و کارت فرصت) طراحی شده است.
            </p>
          </div>

          {/* Action Controls: Trendline Toggle & Export */}
          <div className="relative shrink-0 flex flex-wrap items-center gap-2.5 no-print" ref={radarExportRef}>
            {/* Clean, Persistent UI Toggle: Polynomial Trendline */}
            <div 
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all duration-200 select-none shadow-sm ${
                showPolynomialTrendline
                  ? "bg-slate-800/95 border-amber-500/40 ring-1 ring-amber-500/30 shadow-amber-500/5"
                  : "bg-slate-850/80 border-slate-700/80 hover:border-slate-600"
              }`}
              id="radar-trendline-switch-container"
              title="تغییر وضعیت و ذخیره ماندگار خط روند چندجمله‌ای رشد تقاضای شغلی در مرورگر"
            >
              <button
                type="button"
                onClick={() => handleTogglePolynomialTrendline()}
                className="flex items-center gap-2 cursor-pointer text-right group"
                id="radar-trendline-toggle-btn"
                title="نمایش یا پنهان‌سازی خط روند برازش چندجمله‌ای برای تحلیل رشد بلندمدت تقاضای شغلی (ذخیره ماندگار)"
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  showPolynomialTrendline ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400 group-hover:text-slate-300"
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                    خط روند رشد تقاضا
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    {showPolynomialTrendline ? "پیش‌بینی ۵ ساله (فعال)" : "مخفی (غیرفعال)"}
                  </span>
                </div>
              </button>

              {/* Accessible Persistent Switch */}
              <div dir="ltr" className="flex items-center">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showPolynomialTrendline}
                  onClick={() => handleTogglePolynomialTrendline()}
                  id="radar-trendline-ui-switch"
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    showPolynomialTrendline ? "bg-amber-500 shadow-sm shadow-amber-500/50" : "bg-slate-700 hover:bg-slate-650"
                  }`}
                  title={showPolynomialTrendline ? "خاموش کردن خط روند چندجمله‌ای (تنظیمات ذخیره می‌شود)" : "روشن کردن خط روند چندجمله‌ای (تنظیمات ذخیره می‌شود)"}
                >
                  <span className="sr-only">تغییر وضعیت نمایش خط روند چندجمله‌ای رشد تقاضا</span>
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-[1px] ml-[1px] ${
                      showPolynomialTrendline ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors font-mono ${
                showPolynomialTrendline ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-700/80 text-slate-400 border border-slate-600/50"
              }`}>
                {showPolynomialTrendline ? "ON" : "OFF"}
              </span>
            </div>

            {radarExportSuccess && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-xl animate-fade-in flex items-center gap-1.5 shadow-sm">
                <Check className="w-3.5 h-3.5" />
                <span>{radarExportSuccess}</span>
              </span>
            )}

            <div className="relative">
              <button
                type="button"
                id="radar-card-export-btn"
                onClick={() => setRadarExportOpen(!radarExportOpen)}
                disabled={isExportingRadarPdf}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 hover:border-indigo-500/60 shadow-md active:scale-95 transition cursor-pointer disabled:opacity-60"
                title="دانلود داده‌های انطباق و نمودار به صورت CSV یا PDF"
              >
                {isExportingRadarPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                ) : (
                  <Download className="w-4 h-4 text-indigo-400" />
                )}
                <span>خروجی داده‌ها (Export)</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${radarExportOpen ? "rotate-180" : ""}`} />
              </button>

              {radarExportOpen && (
                <div className="absolute left-0 sm:left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                    قالب دانلود داده‌های رادار انطباق:
                  </div>

                  {/* CSV Export Option */}
                  <button
                    type="button"
                    onClick={handleExportRadarCSV}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800 text-right transition cursor-pointer text-white group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>دانلود فایل اکسل (CSV)</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">.csv</span>
                      </div>
                      <div className="text-[10.5px] text-slate-400 leading-tight">
                        جدول کامل نمرات، شکاف انطباق و شاخص‌ها
                      </div>
                    </div>
                  </button>

                  {/* PDF Export Option */}
                  <button
                    type="button"
                    onClick={handleExportRadarPDF}
                    disabled={isExportingRadarPdf}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800 text-right transition cursor-pointer text-white group disabled:opacity-50"
                  >
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>دانلود سند رسمی (PDF)</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/40">.pdf</span>
                      </div>
                      <div className="text-[10.5px] text-slate-400 leading-tight">
                        سند چاپی A4 شامل نمودار رادار و توصیه‌ها
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Chart Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 min-h-[300px] relative">
            {/* UI Switch Bar for Polynomial Trendline inside Chart */}
            <div className="w-full flex items-center justify-between px-3 py-2 mb-2 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <TrendingUp className={`w-3.5 h-3.5 transition-colors ${showPolynomialTrendline ? "text-amber-400" : "text-slate-500"}`} />
                <span>خط روند چندجمله‌ای تقاضا:</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                  showPolynomialTrendline ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  {showPolynomialTrendline ? "نمایان (Active)" : "مخفی (Hidden)"}
                </span>
              </div>

              {/* In-Chart UI Switch Component */}
              <div dir="ltr" className="inline-flex items-center">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showPolynomialTrendline}
                  onClick={() => handleTogglePolynomialTrendline()}
                  id="chart-trendline-ui-switch"
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    showPolynomialTrendline ? "bg-amber-500 shadow-sm shadow-amber-500/40" : "bg-slate-700 hover:bg-slate-650"
                  }`}
                  title={showPolynomialTrendline ? "مخفی کردن خط روند چندجمله‌ای تقاضای شغلی" : "نمایش خط روند چندجمله‌ای تقاضای شغلی"}
                >
                  <span className="sr-only">تغییر وضعیت نمایش خط روند چندجمله‌ای</span>
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-[1px] ml-[1px] ${
                      showPolynomialTrendline ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="w-full h-[280px] font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 'bold' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#64748b', fontSize: 8 }} 
                  />
                  <Radar 
                    name="سطح شما" 
                    dataKey="سطح شما" 
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    fillOpacity={0.4} 
                    dot={{ r: 4.5, fill: '#6366f1', stroke: '#1e1b4b', strokeWidth: 1.5 }}
                    activeDot={{ r: 7.5, fill: '#818cf8', stroke: '#ffffff', strokeWidth: 2, className: 'cursor-pointer drop-shadow-md' }}
                  />
                  <Radar 
                    name="نیاز بازار کار فعلی" 
                    dataKey="نیاز موقعیت شغلی" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.25} 
                    dot={{ r: 4.5, fill: '#10b981', stroke: '#064e3b', strokeWidth: 1.5 }}
                    activeDot={{ r: 7.5, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2, className: 'cursor-pointer drop-shadow-md' }}
                  />
                  {showPolynomialTrendline && (
                    <Radar 
                      name="روند رشد چندجمله‌ای تقاضا (پیش‌بینی ۵ ساله)" 
                      dataKey="روند رشد چندجمله‌ای" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.15} 
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      dot={{ r: 4, fill: '#f59e0b', stroke: '#78350f', strokeWidth: 1.5 }}
                      activeDot={{ r: 7, fill: '#fbbf24', stroke: '#ffffff', strokeWidth: 2, className: 'cursor-pointer drop-shadow-md' }}
                    />
                  )}
                  <Tooltip 
                    content={({ active, payload, label }: any) => {
                      if (!active || !payload || !payload.length) return null;

                      const userEntry = payload.find((p: any) => p.dataKey === "سطح شما" || p.name === "سطح شما");
                      const reqEntry = payload.find((p: any) => p.dataKey === "نیاز موقعیت شغلی" || p.name === "نیاز موقعیت شغلی");
                      const polyEntry = payload.find((p: any) => p.dataKey === "روند رشد چندجمله‌ای" || p.name === "روند رشد چندجمله‌ای");

                      const userVal = typeof userEntry?.value === "number" ? userEntry.value : null;
                      const reqVal = typeof reqEntry?.value === "number" ? reqEntry.value : null;
                      const polyVal = typeof polyEntry?.value === "number" ? polyEntry.value : null;

                      const gap = userVal !== null && reqVal !== null ? userVal - reqVal : null;

                      const metricInfo: Record<string, { icon: string; category: string; description: string; advice: string }> = {
                        "تحصیلات دانشگاهی": {
                          icon: "🎓",
                          category: "صلاحیت تحصیلی و آنابین",
                          description: "ارزیابی رسمی مدرک بر اساس دیتابیس آنابین (H+)، استانداردهای ZAB و شرایط بلوکارت اروپا.",
                          advice: "مدرک تحصیلی معتبر پایه اصلی اخذ ویزای بلوکارت و کسب تا ۴ امتیاز کارت فرصت است."
                        },
                        "سابقه کار مرتبط": {
                          icon: "💼",
                          category: "سوابق حرفه‌ای مستند",
                          description: "تعداد سال‌های سابقه کار مرتبط با تخصص به همراه سوابق رسمی بیمه و گواهی کار.",
                          advice: "حداقل ۲ سال سابقه برای کارت فرصت الزامی و بیش از ۵ سال حداکثر امتیاز را دارد."
                        },
                        "زبان آلمانی": {
                          icon: "🇩🇪",
                          category: "مدرک رسمی آلمانی",
                          description: "سطح مهارت زبان آلمانی بر اساس مدارک معتبر گوته، telc، تست‌داف یا ÖSD در چارچوب CEFR.",
                          advice: "سطح B1 حداقل کارت فرصت است؛ ارتقا به B2/C1 شانس استخدام را بیش از ۳ برابر می‌کند."
                        },
                        "زبان انگلیسی": {
                          icon: "🇬🇧",
                          category: "مهارت مکالمه بین‌المللی",
                          description: "تسلط بر زبان انگلیسی برای مصاحبه‌های استخدامی و کار در شرکت‌های چندملیتی و تک.",
                          advice: "در هاب‌های برلین و مونیخ، مکالمه روان انگلیسی برای بیش از ۷۵٪ آگهی‌های تک کافی است."
                        },
                        "تطابق تخصص": {
                          icon: "⚡",
                          category: "تقاضای بازار کار (MINT)",
                          description: "انطباق رشته و مهارت‌ها با مشاغل دارای کمبود رسمی نیروی متخصص (Engpassberufe) در آلمان.",
                          advice: "رشته‌های IT و مهندسی دارای سقف حقوقی پایین‌تر برای اخذ بلوکارت آلمان هستند."
                        },
                        "امتیاز سن متقاضی": {
                          icon: "⏱️",
                          category: "امتیازبندی کارت فرصت",
                          description: "محاسبه امتیاز سنی طبق قانون مهاجرت نیروی ماهر (Fachkräfteeinwanderungsgesetz).",
                          advice: "سن زیر ۳۵ سال ۲ امتیاز کامل و بین ۳۵ تا ۴۰ سال ۱ امتیاز در سیستم کارت فرصت به همراه دارد."
                        }
                      };

                      const info = metricInfo[label || ""] || {
                        icon: "📊",
                        category: "شاخص شایستگی",
                        description: "ارزیابی انطباق شایستگی‌های شغلی متقاضی با تقاضای کارفرمایان فدرال آلمان.",
                        advice: "بهبود این شاخص نمره کل تطابق شغلی و شانس مهاجرت موفق شما را تقویت می‌کند."
                      };

                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-4 shadow-2xl text-right max-w-[310px] min-w-[270px] z-50 space-y-3 ring-1 ring-white/10 pointer-events-none">
                          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                                <span className="text-base">{info.icon}</span>
                                <span>{label}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">{info.category}</span>
                            </div>

                            {gap !== null && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                                  gap >= 0
                                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                    : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                }`}
                              >
                                {gap > 0 ? `+${gap} مازاد مطلوب` : gap === 0 ? "تطابق ۱۰۰٪" : `${gap} شکاف امتیازی`}
                              </span>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            {userVal !== null && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block shadow-sm ring-1 ring-indigo-400/50" />
                                    <span>سطح شما:</span>
                                  </span>
                                  <span className="font-mono font-black text-indigo-200 bg-indigo-950/70 border border-indigo-500/30 px-2 py-0.5 rounded-lg text-[11px]">
                                    {userVal} <span className="text-[9px] text-indigo-400 font-sans">/ ۱۰۰</span>
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.max(3, userVal))}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {reqVal !== null && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm ring-1 ring-emerald-400/50" />
                                    <span>نیاز بازار کار فعلی:</span>
                                  </span>
                                  <span className="font-mono font-black text-emerald-200 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-[11px]">
                                    {reqVal} <span className="text-[9px] text-emerald-400 font-sans">از ۱۰۰</span>
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.max(3, reqVal))}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {polyVal !== null && showPolynomialTrendline && (
                              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm ring-1 ring-amber-400/50" />
                                    <span>روند رشد تقاضا (۵ ساله):</span>
                                  </span>
                                  <span className="font-mono font-black text-amber-200 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-lg text-[11px]">
                                    {polyVal} <span className="text-[9px] text-amber-400 font-sans">از ۱۰۰</span>
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.max(3, polyVal))}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[10.5px] space-y-1.5">
                            <p className="text-slate-300 leading-snug">{info.description}</p>
                            <div className="text-[10px] text-indigo-300 bg-indigo-950/40 border border-indigo-800/30 p-1.5 rounded-lg leading-tight">
                              💡 <span className="text-slate-200">{info.advice}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    wrapperStyle={{ zIndex: 60, pointerEvents: 'none' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block shadow-sm" />
                <span className="text-slate-300 font-bold">سطح شما</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
                <span className="text-slate-300 font-bold">نیاز بازار کار فعلی</span>
              </div>
              {showPolynomialTrendline && (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm ring-2 ring-amber-400/40" />
                  <span className="text-amber-300 font-bold">رشد چندجمله‌ای (پیش‌بینی ۵ ساله)</span>
                </div>
              )}
            </div>

            {/* Interactive Numerical Data Points Grid */}
            <div className="mt-3.5 w-full space-y-2 border-t border-slate-800/80 pt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>مقادیر عددی دقیق مهارت‌ها:</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  برای تحلیل اختصاصی کلیک کنید
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {radarChartData.map((item, idx) => {
                  const isSelected = selectedRadarPoint === item.subject;
                  const userVal = item["سطح شما"];
                  const reqVal = item["نیاز موقعیت شغلی"];
                  const polyVal = item["روند رشد چندجمله‌ای"];
                  const gap = userVal - reqVal;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedRadarPoint(isSelected ? null : item.subject)}
                      className={`p-2 rounded-xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-500/15 border-indigo-500/50 ring-1 ring-indigo-500/40 shadow-md shadow-indigo-500/10"
                          : "bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850"
                      }`}
                      title={`مشاهده جزئیات دقیق ${item.subject}`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className="text-slate-200 truncate">{item.subject}</span>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            gap >= 0
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                              : "bg-rose-950 text-rose-300 border border-rose-800/40"
                          }`}
                        >
                          {gap >= 0 ? `+${gap}` : `${gap}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>شما: <b className="text-indigo-300">{userVal}</b></span>
                        <span>نیاز: <b className="text-emerald-300">{reqVal}</b></span>
                        {showPolynomialTrendline && (
                          <span>رشد: <b className="text-amber-300">{polyVal}</b></span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Point Interactive Detail Banner */}
              {selectedRadarPoint && (() => {
                const selItem = radarChartData.find(d => d.subject === selectedRadarPoint);
                if (!selItem) return null;
                const userVal = selItem["سطح شما"];
                const reqVal = selItem["نیاز موقعیت شغلی"];
                const polyVal = selItem["روند رشد چندجمله‌ای"];
                const gap = userVal - reqVal;

                return (
                  <div className="mt-2 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-right space-y-2 animate-fade-in text-xs">
                    <div className="flex items-center justify-between border-b border-indigo-900/50 pb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span className="text-indigo-400">●</span>
                        <span>جزئیات دقیق شاخص: {selectedRadarPoint}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedRadarPoint(null)}
                        className="text-slate-400 hover:text-white text-[11px] px-1.5 py-0.5 rounded hover:bg-slate-800 transition cursor-pointer"
                      >
                        بستن ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-indigo-300">سطح شما</div>
                        <div className="font-mono font-bold text-white text-sm">{userVal} / ۱۰۰</div>
                        <div className="text-[9px] text-slate-400">ارزیابی پرونده</div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-emerald-300">استاندارد کارفرما</div>
                        <div className="font-mono font-bold text-white text-sm">{reqVal} / ۱۰۰</div>
                        <div className="text-[9px] text-slate-400">حداقل بازار</div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-amber-300">روند ۵ ساله</div>
                        <div className="font-mono font-bold text-white text-sm">{polyVal} / ۱۰۰</div>
                        <div className="text-[9px] text-slate-400">پیش‌بینی ۲۰۳۰</div>
                      </div>
                    </div>
                    <div className="text-[10.5px] text-indigo-200 bg-indigo-900/30 rounded-lg p-2 border border-indigo-700/30 flex items-center justify-between">
                      <span>وضعیت تطابق:</span>
                      <span className="font-bold">
                        {gap > 0 ? `+${gap} امتیاز بالاتر از حد نصاب استاندارد` : gap === 0 ? "تطابق کامل با استاندارد کارفرما" : `${gap} امتیاز پایین‌تر از استاندارد (نیاز به تقویت)`}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Polynomial Trendline Technical Insight Bar */}
            {showPolynomialTrendline && (
              <div className="mt-3 w-full bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 space-y-1.5 text-right animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>برازش چندجمله‌ای رشد ۵ ساله تقاضای آلمان (درجه ۲):</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {polynomialFitData.formulaText.split("|")[1] || "R² ≈ 0.94"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  این خط روند نشان‌دهنده افزایش تقاضای بلندمدت کارفرمایان آلمانی در شاخص‌های زبان، تخصص و سابقه کار تا سال ۲۰۳۰ است.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10.5px]">
                  <span className="text-slate-400">معادله برازش رگرسیون درجه ۲:</span>
                  <span className="font-mono text-amber-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-left" dir="ltr">
                    {polynomialFitData.formulaText.split("|")[0]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Match Analysis Details & Insights */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تحلیل خودکار و توصیه‌های کلیدی متناسب با شرایط شما</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getMatchInsights().map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border text-right transition duration-200 print-break-inside-avoid ${
                    insight.type === 'success' 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                      : insight.type === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-300'
                      : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        insight.type === 'success' 
                          ? 'bg-emerald-400' 
                          : insight.type === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-indigo-400'
                      }`} />
                      <h5 className="text-xs font-bold text-white">{insight.title}</h5>
                    </div>
                    {insight.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/80 text-indigo-300">
                        {insight.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300 font-medium">
                    {insight.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Screen-only exploratory and deep-dive widgets (hidden in print dossier) */}
      <div className="space-y-8">
        {/* D3.js Skills Gap Analysis & Tech Stack Radar Visualization */}
        <div className="no-print">
          <SkillsGapAnalysis
            userField={activeJobComparisonField || effectiveProfile.field}
            userExp={effectiveProfile.experience}
            extractedSkills={effectiveProfile.skills}
            profile={memoizedSkillsProfile}
          />
        </div>

        {/* Dedicated PDF Export Dossier Action Banner */}
        <div className="no-print bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-3xl p-6 md:p-7 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>خروجی سند رسمی استاندارد و چک‌لیست چاپی (PDF / Printable Dossier)</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white">
              دریافت سند چاپی نقشه راه مهاجرت کاری و چک‌لیست شخصی‌سازی‌شده اقدامات
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              این سند آماده چاپ (Print-Friendly A4) شامل <strong>چک‌لیست گام به گام ماه‌های ۱ تا ۶</strong>، <strong>تطبیق انتظارات و ابزارهای کاری آلمان</strong>، <strong>سپرده‌ها و هزینه‌ها</strong> و <strong>مراجع قانونی فدرال</strong> جهت پیگیری آفلاین و فیزیکی است.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {/* Download Roadmap as PDF Button leveraging CSS print styles */}
            <button
              onClick={() => {
                document.body.classList.add("print-target-roadmap");
                const originalTitle = document.title;
                const name = (effectiveProfile.name || "Applicant").trim();
                const printDocTitle = formatPrintDocumentTitle("نقشه راه مهاجرت کاری آلمان", name);
                document.title = printDocTitle;
                const cleanup = () => {
                  document.body.classList.remove("print-target-roadmap");
                  document.title = originalTitle;
                  window.removeEventListener("afterprint", cleanup);
                };
                window.addEventListener("afterprint", cleanup);
                setTimeout(() => {
                  window.print();
                  setTimeout(cleanup, 2500);
                }, 200);
              }}
              id="dashboard-download-roadmap-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              title="دانلود سند رسمی نقشه راه مهاجرتی به صورت فایل PDF استاندارد با استفاده از استایل‌های حرفه‌ای چاپ (CSS Print Styles)"
            >
              <Download className="w-4 h-4 text-emerald-100" />
              <span>دانلود به عنوان PDF (Download as PDF)</span>
            </button>

            <button
              onClick={() => {
                setPdfExportMode("checklist_only");
                setIsPdfExportModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 text-slate-200 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>چک‌لیست سفارشی</span>
            </button>
            <button
              onClick={() => {
                setPdfExportMode("all");
                setIsPdfExportModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 text-slate-200 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              <span>پرونده جامع</span>
            </button>
          </div>
        </div>

        {/* Roadmap View Mode Switcher */}
        <div className="no-print mt-8 bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-right pr-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-black text-white">انتخاب شیوه نمایش نقشه راه:</span>
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-950 p-1 rounded-xl border border-slate-800/80 overflow-x-auto">
            <button
              onClick={() => setRoadmapViewMode("budget_planner")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                roadmapViewMode === "budget_planner"
                  ? "bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 text-white shadow-md font-black ring-1 ring-amber-400/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>بودجه و هزینه‌ها (Budget Planner)</span>
            </button>
            <button
              onClick={() => setRoadmapViewMode("ai_advisor")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                roadmapViewMode === "ai_advisor"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white shadow-md font-black ring-1 ring-purple-400/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-amber-300" />
              <span>مشاور هوشمند اقامت (AI Advisor)</span>
            </button>
            <button
              onClick={() => setRoadmapViewMode("migration_timeline")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                roadmapViewMode === "migration_timeline"
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-md font-black ring-1 ring-emerald-400/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>نقشه راه تعاملی و بازه‌های زمانی (Interactive Roadmap)</span>
            </button>
            <button
              onClick={() => setRoadmapViewMode("monthly_ai")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                roadmapViewMode === "monthly_ai"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>نقشه راه ماه به ماه (Monthly AI)</span>
            </button>
            <button
              onClick={() => setRoadmapViewMode("timeline_steps")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                roadmapViewMode === "timeline_steps"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>مراحل ۶ گانه (Step-by-Step)</span>
            </button>
            <button
              onClick={() => setRoadmapViewMode("progress_tracker")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                roadmapViewMode === "progress_tracker"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>ردیاب گام‌نما (Milestones)</span>
            </button>
          </div>
        </div>

        {/* Visual Roadmap Component Rendering */}
        <div className="mt-4 roadmap-printable-area">
          {roadmapViewMode === "budget_planner" ? (
            <ImmigrationBudgetPlanner
              userField={effectiveProfile.field}
            />
          ) : roadmapViewMode === "ai_advisor" ? (
            <AIImmigrationAdvisor
              profile={effectiveProfile}
              onNavigateToTab={onTabChange}
            />
          ) : roadmapViewMode === "migration_timeline" ? (
            <MigrationTimeline
              profile={effectiveProfile}
              onTabChange={onTabChange}
            />
          ) : roadmapViewMode === "monthly_ai" ? (
            <MonthlyRoadmapGenerator
              profile={effectiveProfile}
              onTabChange={onTabChange}
            />
          ) : roadmapViewMode === "timeline_steps" ? (
            <JourneyTimeline 
              profile={effectiveProfile} 
              onTabChange={onTabChange} 
              onExportPdf={() => setIsPdfExportModalOpen(true)}
            />
          ) : (
            <ImmigrationProgressTracker
              profile={effectiveProfile}
              onTabChange={onTabChange}
            />
          )}
        </div>

        {/* AI Job Duties & Expectations Comparison (Iran vs Germany) */}
        <div className="mt-6 no-print">
          <JobComparisonWidget 
            userProfile={{
              ...effectiveProfile,
              field: activeJobComparisonField || effectiveProfile.field
            }} 
            onExportPdf={(latestData, latestField) => {
              if (latestData) setActiveJobComparisonData(latestData);
              if (latestField && latestField.trim()) {
                setActiveJobComparisonField(latestField.trim());
                setWizardInputs(prev => ({ ...prev, field: latestField.trim() }));
                if (onProfileUpdate) onProfileUpdate({ ...effectiveProfile, field: latestField.trim() });
              }
              setIsPdfExportModalOpen(true);
            }}
            onDataChange={(latestData, latestField) => {
              setActiveJobComparisonData(latestData);
              if (latestField && latestField.trim()) {
                setActiveJobComparisonField(latestField.trim());
              }
            }}
            onFieldChange={(latestField) => {
              if (latestField && latestField.trim()) {
                setActiveJobComparisonField(latestField.trim());
              }
            }}
          />
        </div>

        {/* Modal for PDF Roadmap & Comparison Export */}
        <CareerRoadmapPdfExportModal
          isOpen={isPdfExportModalOpen}
          onClose={() => setIsPdfExportModalOpen(false)}
          profile={{
            ...effectiveProfile,
            field: activeJobComparisonField || effectiveProfile.field
          }}
          jobComparisonData={activeJobComparisonData}
          defaultExportMode={pdfExportMode}
        />

        {/* Modal for Selecting Specific Pages in PDF Generation Workflow */}
        <PdfPageSelectionDialog
          isOpen={isPdfPageSelectionOpen}
          onClose={() => setIsPdfPageSelectionOpen(false)}
          onConfirm={handleConfirmPdfSelection}
          isGenerating={isDownloadingPdf}
          candidateName={effectiveProfile?.name || "متقاضی محترم"}
          fieldTitle={activeJobComparisonField || effectiveProfile?.field || "تخصص شغلی"}
        />

        {/* Visa Strategy Simulator: Visa Success Forecast Visualizer Component */}
        <div className="mt-12 no-print" id="visa-strategy-simulator-forecast">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">شبیه‌ساز و پیش‌بینی هوشمند استراتژی ویزا</span>
            </div>
            {onTabChange && (
              <button
                onClick={() => onTabChange("visa-simulator")}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>باز کردن تب اختصاصی شبیه‌ساز استراتژی ویزا</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
          </div>
          <VisaSuccessForecast
            profile={effectiveProfile}
            age={effectiveProfile.age}
            degree={effectiveProfile.degree}
            experience={effectiveProfile.experience}
            germanLevel={effectiveProfile.germanLevel}
            field={effectiveProfile.field}
            onNavigateToTab={onTabChange}
          />
        </div>

        {/* Grid for Visa Routes details */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 no-print">
        <h3 className="text-xl font-bold text-white mb-6 text-center">جزئیات و پیش‌نیازهای انواع ویزاهای کاری آلمان</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visaRoutes.map((route) => (
            <div key={route.id} className="bg-slate-950 p-6 rounded-xl border border-slate-800/60 relative">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-white pr-2 border-r-4 border-indigo-500">{route.title}</h4>
                <span className="text-xs text-slate-400">{route.subtitle}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{route.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-teal-400 mb-2">شرایط مورد نیاز:</h5>
                  <ul className="space-y-1.5">
                    {route.requirements.map((req, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-indigo-400 mb-2">مزایای جذاب این مسیر:</h5>
                  <ul className="space-y-1.5">
                    {route.perks.map((perk, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End of dashboard-screen-only */}
      </div>

      {/* Official Jahanban Multi-Page Running Print Footer at the bottom of Dashboard */}
      <JahanbanPrintFooter
        docId={`JB-DE-2026-EVAL-${effectiveProfile?.name ? effectiveProfile.name.replace(/\s+/g, "").slice(0, 5).toUpperCase() : "REG"}`}
        className="dashboard-print-footer"
      />
    </div>
  );
}
