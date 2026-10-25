import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronDown,
  Info,
  BookOpen,
  RefreshCw,
  ExternalLink,
  Layers,
  BarChart3,
  Cpu,
  Target,
  Zap,
  TrendingUp,
  FileCheck,
  Briefcase,
  Loader2,
  Printer,
  Eye,
  X
} from "lucide-react";
import { fetchWithRetry, formatPrintDocumentTitle, triggerPrintWithTitle } from "../utils";
import { STANDARD_JOB_ROLES_CATALOG, generateIntelligentSkillsGapRole, getRoleInterviewAdvice } from "../services/germanSkillsGapService";

export interface SkillDimension {
  id: string;
  name: string;
  nameEn: string;
  germanBenchmark: number; // 0 - 100
  userScore: number; // 0 - 100
  description: string;
  germanContext: string;
  learningResource?: string;
  actionRecommendation: string;
}

export interface TargetJobRole {
  id: string;
  title: string;
  titleDe: string;
  kldbCode?: string;
  category: string;
  germanDemandLevel: "بسیار بالا (موقعیت بحرانی)" | "بالا (کمبود نیرو)" | "متوسط و پایدار" | string;
  avgSalaryRange: string;
  germanEmployerDuties?: string[];
  skills: SkillDimension[];
  overallMatchSummary?: {
    matchPercentage: number;
    topStrengths: string[];
    criticalGaps: string[];
    priorityCertificatesDe: string[];
    germanCvOptimizationTip: string;
  };
}

export function sanitizeSkillDimension(raw: any, index: number = 0): SkillDimension {
  const id = raw?.id ? String(raw.id) : `skill_${index + 1}`;
  const name = (raw?.name && typeof raw.name === "string" && raw.name.trim()) 
    ? raw.name.trim() 
    : (raw?.title || `مهارت تخصصی ${index + 1}`);
  const nameEn = (raw?.nameEn && typeof raw.nameEn === "string" && raw.nameEn.trim()) 
    ? raw.nameEn.trim() 
    : (name || raw?.id || `Skill ${index + 1}`);
  const germanBenchmark = typeof raw?.germanBenchmark === "number" && !isNaN(raw.germanBenchmark)
    ? Math.min(100, Math.max(0, raw.germanBenchmark))
    : (Number(raw?.germanBenchmark) || 80);
  const userScore = typeof raw?.userScore === "number" && !isNaN(raw.userScore)
    ? Math.min(100, Math.max(0, raw.userScore))
    : (Number(raw?.userScore) || 50);
  const description = raw?.description ? String(raw.description) : "";
  const germanContext = raw?.germanContext ? String(raw.germanContext) : "";
  const actionRecommendation = raw?.actionRecommendation ? String(raw.actionRecommendation) : "";
  const learningResource = raw?.learningResource ? String(raw.learningResource) : undefined;

  return {
    id,
    name,
    nameEn,
    germanBenchmark,
    userScore,
    description,
    germanContext,
    learningResource,
    actionRecommendation
  };
}

const JOB_ROLES_CATALOG: TargetJobRole[] = STANDARD_JOB_ROLES_CATALOG;

function generateDynamicCustomRole(
  field: string,
  skills: string,
  exp: number,
  degree: string,
  title?: string,
  history?: string
): TargetJobRole {
  return generateIntelligentSkillsGapRole({
    field,
    skills,
    experience: exp,
    degree,
    targetRole: title,
    workHistoryHighlights: history ? [history] : []
  });
}

interface SkillsGapAnalysisProps {
  userField?: string;
  userExp?: number;
  extractedSkills?: string;
  profile?: any;
  className?: string;
}

export default function SkillsGapAnalysis({
  userField = "فناوری اطلاعات",
  userExp = 3,
  extractedSkills = "",
  profile,
  className = ""
}: SkillsGapAnalysisProps) {
  // Stable primitive values to prevent infinite render loops
  const effField = (profile?.field || userField || "").trim();
  const effSkills = (profile?.skills || extractedSkills || "").trim();
  const effTarget = (profile?.targetRole || (profile as any)?.title || "").trim();
  const effDegree = (profile?.degree || "").trim();
  const effExp = Number(profile?.experience) || Number(userExp) || 3;
  const effGerman = profile?.germanLevel || "B1";
  const effEnglish = profile?.englishLevel || "B2";
  const historyHighlightsStr = Array.isArray(profile?.workHistoryHighlights) ? profile.workHistoryHighlights.join("|") : "";
  const educationSummaryStr = profile?.educationSummary || "";

  // Auto-detect role based on applicant's exact field, resume and profile context
  const initialRole = useMemo(() => {
    let localProfile: any = null;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem("germany_eval_profile");
        if (saved) localProfile = JSON.parse(saved);
        if (!localProfile) {
          const cvSaved = window.localStorage.getItem("germany_cv_builder_data");
          if (cvSaved) localProfile = JSON.parse(cvSaved);
        }
      }
    } catch {}

    const eff = profile || localProfile || {};
    const rawField = (eff.field || userField || "").trim();
    const rawSkills = (eff.skills || extractedSkills || "").trim();
    const rawTarget = (eff.targetRole || eff.title || "").trim();
    const rawDegree = (eff.degree || "").trim();
    const rawExp = Number(eff.experience) || Number(userExp) || 3;
    const historyHighlights = Array.isArray(eff.workHistoryHighlights) ? eff.workHistoryHighlights : [];

    // Synthesize the exact German role and employer duties matching applicant resume
    return generateIntelligentSkillsGapRole({
      field: rawField,
      targetRole: rawTarget,
      skills: rawSkills,
      experience: rawExp,
      degree: rawDegree,
      germanLevel: eff.germanLevel || "B1",
      englishLevel: eff.englishLevel || "B2",
      workHistoryHighlights: historyHighlights,
      educationSummary: eff.educationSummary || "",
      rawTextSummary: eff.rawTextSummary || ""
    });
  }, [effField, effSkills, effTarget, effDegree, effExp, effGerman, effEnglish, historyHighlightsStr, educationSummaryStr]);

  const [catalogRoles, setCatalogRoles] = useState<TargetJobRole[]>(JOB_ROLES_CATALOG);
  const [selectedRole, setSelectedRole] = useState<TargetJobRole>(initialRole);
  const [customSkills, setCustomSkills] = useState<SkillDimension[]>((initialRole?.skills || []).map(sanitizeSkillDimension));
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [isFineTuningOpen, setIsFineTuningOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"radar" | "breakdown" | "recommendations">("radar");

  // Dynamic AI Gemini Analysis State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [aiGeneratedRole, setAiGeneratedRole] = useState<TargetJobRole | null>(null);

  // Synchronize when initialRole changes (guarded by role ID ref to prevent infinite re-renders)
  const prevRoleIdRef = useRef<string>(initialRole.id || "");
  useEffect(() => {
    if (initialRole.id && initialRole.id !== prevRoleIdRef.current) {
      prevRoleIdRef.current = initialRole.id;
      setSelectedRole(initialRole);
      setCustomSkills((initialRole.skills || []).map(sanitizeSkillDimension));
      setCatalogRoles(prev => {
        const exists = prev.some(r => r.id === initialRole.id);
        if (exists) return prev;
        return [initialRole, ...prev];
      });
    }
  }, [initialRole]);

  // Dynamic AI Skills Gap Analysis from /api/gemini/skills-gap-analysis
  const fetchDynamicSkillsGap = async () => {
    setIsAiLoading(true);
    try {
      let localProfile: any = null;
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const saved = window.localStorage.getItem("germany_eval_profile");
          if (saved) localProfile = JSON.parse(saved);
          if (!localProfile) {
            const cvSaved = window.localStorage.getItem("germany_cv_builder_data");
            if (cvSaved) localProfile = JSON.parse(cvSaved);
          }
        }
      } catch {}

      const eff = profile || localProfile || {};
      const payloadProfile = {
        field: eff.field || userField || "",
        experience: eff.experience || userExp || 3,
        skills: eff.skills || extractedSkills || "",
        degree: eff.degree || "",
        germanLevel: eff.germanLevel || "",
        englishLevel: eff.englishLevel || "",
        targetRole: eff.targetRole || eff.title || "",
        workHistoryHighlights: eff.workHistoryHighlights || [],
        educationSummary: eff.educationSummary || "",
        rawTextSummary: eff.rawTextSummary || ""
      };

      const res = await fetchWithRetry("/api/gemini/skills-gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: payloadProfile })
      });

      if (!res.ok) throw new Error("خطا در پاسخ هوش مصنوعی");
      const data: TargetJobRole = await res.json();
      if (data && Array.isArray(data.skills) && data.skills.length > 0) {
        const sanitizedSkills = data.skills.map(sanitizeSkillDimension);
        const cleanRole: TargetJobRole = {
          ...data,
          skills: sanitizedSkills
        };
        setAiGeneratedRole(cleanRole);
        setIsAiGenerated(true);
        setSelectedRole(cleanRole);
        setCustomSkills(sanitizedSkills);
        // Ensure role is in catalogRoles
        setCatalogRoles(prev => {
          const exists = prev.some(r => r.id === data.id);
          if (exists) {
            return prev.map(r => r.id === data.id ? cleanRole : r);
          }
          return [cleanRole, ...prev];
        });
      }
    } catch (err) {
      console.warn("Dynamic AI skills gap fetch error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run dynamic analysis on mount or when key profile attributes change (guarded by key ref)
  const lastFetchedKeyRef = useRef<string>("");
  useEffect(() => {
    const key = `${effField}_${effTarget}_${effSkills}_${effDegree}_${historyHighlightsStr}_${educationSummaryStr}`;
    if (lastFetchedKeyRef.current !== key) {
      lastFetchedKeyRef.current = key;
      fetchDynamicSkillsGap();
    }
  }, [
    effField,
    effTarget,
    effSkills,
    effDegree,
    historyHighlightsStr,
    educationSummaryStr
  ]);

  // Keep state synced if role changes manually
  const handleRoleChange = (role: TargetJobRole) => {
    setSelectedRole(role);
    setCustomSkills((role?.skills || []).map(sanitizeSkillDimension));
    setActiveSkillId(null);
  };

  // Adjust specific skill score
  const handleSkillScoreChange = (skillId: string, newScore: number) => {
    setCustomSkills(prev =>
      prev.map(s => (s.id === skillId ? { ...s, userScore: newScore } : s))
    );
  };

  // Quick reset to defaults
  const handleResetScores = () => {
    setCustomSkills((selectedRole?.skills || []).map(sanitizeSkillDimension));
  };

  // Calculate overall metrics
  const analysisMetrics = useMemo(() => {
    const totalSkills = customSkills.length;
    if (totalSkills === 0) return { overallMatchPct: 0, gapCount: 0, strongCount: 0, avgGap: 0 };

    let totalUser = 0;
    let totalBenchmark = 0;
    let gaps = 0;
    let strengths = 0;

    customSkills.forEach(s => {
      totalUser += s.userScore;
      totalBenchmark += s.germanBenchmark;
      if (s.userScore < s.germanBenchmark - 5) {
        gaps++;
      } else if (s.userScore >= s.germanBenchmark) {
        strengths++;
      }
    });

    const overallMatchPct = Math.round((totalUser / totalBenchmark) * 100);
    const avgGap = Math.round((totalBenchmark - totalUser) / totalSkills);

    return {
      overallMatchPct: Math.min(100, Math.max(0, overallMatchPct)),
      gapCount: gaps,
      strongCount: strengths,
      avgGap: avgGap > 0 ? avgGap : 0
    };
  }, [customSkills]);

  // D3 Radar Chart Container Ref
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isPrintingTable, setIsPrintingTable] = useState<boolean>(false);
  const [isPrintingUnified, setIsPrintingUnified] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<"all" | "page1" | "page2">("all");
  const [previewSnapshot, setPreviewSnapshot] = useState<{
    skills: SkillDimension[];
    role: TargetJobRole;
    metrics: {
      overallMatchPct: number;
      gapCount: number;
      strongCount: number;
      avgGap: number;
    };
    candidateName: string;
    printDate: string;
    isAiGenerated: boolean;
    refNumber: string;
    radarSvgMarkup: string;
  } | null>(null);

  const previewModalAdvice = useMemo(() => (previewSnapshot ? getRoleInterviewAdvice(previewSnapshot.role) : null), [previewSnapshot]);
  const liveInterviewAdvice = useMemo(() => getRoleInterviewAdvice(selectedRole), [selectedRole]);

  // Dedicated real-time state snapshot provider ensuring latest updated data is captured directly from live state
  const getLiveComponentStateSnapshot = () => {
    // 1. Fresh clone of customSkills from live component state
    const currentSkills: SkillDimension[] = (customSkills || []).map(sanitizeSkillDimension);
    
    // 2. Current selected job role and details
    const currentRole: TargetJobRole = {
      ...selectedRole,
      skills: currentSkills
    };

    // 3. Real-time computed metrics directly from the live customSkills state
    const totalSkills = currentSkills.length;
    let totalUser = 0;
    let totalBenchmark = 0;
    let gaps = 0;
    let strengths = 0;

    currentSkills.forEach(s => {
      totalUser += Number(s.userScore) || 0;
      totalBenchmark += Number(s.germanBenchmark) || 0;
      if (s.userScore < s.germanBenchmark - 5) {
        gaps++;
      } else if (s.userScore >= s.germanBenchmark) {
        strengths++;
      }
    });

    const overallMatchPct = totalBenchmark > 0 ? Math.round((totalUser / totalBenchmark) * 100) : 0;
    const avgGap = totalSkills > 0 ? Math.round((totalBenchmark - totalUser) / totalSkills) : 0;

    const currentMetrics = {
      overallMatchPct: Math.min(100, Math.max(0, overallMatchPct)),
      gapCount: gaps,
      strongCount: strengths,
      avgGap: avgGap > 0 ? avgGap : 0
    };

    // 4. Candidate metadata
    const candidateName = profile?.name?.trim() || "متقاضی محترم مهاجرت کاری";
    const printDate = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date());

    return {
      skills: currentSkills,
      role: currentRole,
      metrics: currentMetrics,
      candidateName,
      printDate,
      isAiGenerated
    };
  };

  // Open the print preview modal with a fresh live state snapshot
  const handleOpenPreview = () => {
    const snapshot = getLiveComponentStateSnapshot();
    let radarSvg = "";
    if (svgRef.current) {
      try {
        const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
        clone.setAttribute("width", "420");
        clone.setAttribute("height", "320");
        clone.style.margin = "0 auto";
        clone.style.display = "block";
        radarSvg = clone.outerHTML;
      } catch (e) {
        console.warn("Could not clone radar SVG for preview:", e);
      }
    }
    const refNumber = `DE-UNIFIED-SKILLS-${Math.floor(100000 + Math.random() * 900000)}`;
    setPreviewSnapshot({
      ...snapshot,
      refNumber,
      radarSvgMarkup: radarSvg
    });
    setPreviewTab("all");
    setIsPreviewModalOpen(true);
  };

  // Direct print of the Skills Gap Analysis & Tech Stack Radar
  const handleDirectPrint = async () => {
    setIsPrinting(true);
    try {
      // Capture live updated state snapshot immediately
      const snapshot = getLiveComponentStateSnapshot();
      const { skills: liveSkills, role: liveRole, metrics: liveMetrics, candidateName, printDate } = snapshot;

      let logoBase64 = "";
      try {
        const res = await fetch("/api/logo-base64");
        const json = await res.json();
        if (json.success) logoBase64 = json.base64;
      } catch {
        // ignore
      }

      const refNumber = `DE-SKILLS-RADAR-${Math.floor(100000 + Math.random() * 900000)}`;
      const printDocTitle = formatPrintDocumentTitle("تحلیل شکاف مهارتی و شایستگی", candidateName);

      // Extract current SVG radar markup if available
      let radarSvgMarkup = "";
      if (svgRef.current) {
        try {
          const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
          clone.setAttribute("width", "420");
          clone.setAttribute("height", "330");
          clone.style.margin = "0 auto";
          clone.style.display = "block";
          radarSvgMarkup = clone.outerHTML;
        } catch (e) {
          console.warn("Could not clone radar SVG:", e);
        }
      }

      const htmlContent = `<!DOCTYPE html>
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
      font-size: 8.2pt;
      line-height: 1.45;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 360px;
      opacity: 0.04;
      z-index: -1000;
      pointer-events: none;
    }
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .page-break {
      page-break-before: always;
      break-before: always;
    }
    .header-box {
      border-bottom: 2.5px solid #4f46e5;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-size: 12.5pt;
      font-weight: 900;
      color: #1e1b4b;
      margin: 0 0 2px 0;
    }
    .header-subtitle {
      font-size: 8pt;
      color: #4338ca;
      font-weight: 700;
      margin: 0;
    }
    .meta-box {
      text-align: left;
      font-size: 7.2pt;
      color: #64748b;
      direction: ltr;
    }
    .profile-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px 12px;
      font-size: 7.8pt;
    }
    .profile-item-label {
      color: #64748b;
      font-size: 7pt;
    }
    .profile-item-val {
      font-weight: bold;
      color: #0f172a;
    }
    .kpi-banner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 10px;
    }
    .kpi-card {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 8px;
      text-align: center;
    }
    .kpi-val {
      font-size: 11pt;
      font-weight: 900;
      color: #1e1b4b;
    }
    .kpi-lbl {
      font-size: 6.8pt;
      color: #64748b;
    }
    .section-header {
      background: #eef2ff;
      border-right: 4px solid #4f46e5;
      padding: 5px 10px;
      margin: 10px 0 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0 4px 4px 0;
    }
    .section-title {
      font-size: 8.8pt;
      font-weight: 800;
      color: #1e1b4b;
    }
    .section-badge {
      font-size: 6.8pt;
      font-weight: bold;
      background: #4338ca;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .radar-box {
      background: #0f172a;
      color: #ffffff;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: center;
      margin-bottom: 10px;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-bottom: 8px;
    }
    .table-custom th {
      background: #1e293b;
      color: #ffffff;
      padding: 5px 6px;
      text-align: right;
      font-weight: 700;
      border: 1px solid #334155;
    }
    .table-custom td {
      padding: 4px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    .table-custom tr:nth-child(even) {
      background: #f8fafc;
    }
    .badge-ready {
      background: #dcfce7;
      color: #166534;
      padding: 1px 4px;
      border-radius: 2px;
      font-weight: bold;
      font-size: 6.5pt;
    }
    .badge-gap {
      background: #fef3c7;
      color: #92400e;
      padding: 1px 4px;
      border-radius: 2px;
      font-weight: bold;
      font-size: 6.5pt;
    }
    .badge-critical {
      background: #fee2e2;
      color: #991b1b;
      padding: 1px 4px;
      border-radius: 2px;
      font-weight: bold;
      font-size: 6.5pt;
    }
    .footer-bar {
      margin-top: 12px;
      padding-top: 6px;
      border-top: 1px solid #cbd5e1;
      text-align: center;
      font-size: 6.8pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  ${logoBase64 ? `<img class="watermark" src="data:image/jpeg;base64,${logoBase64}" />` : ""}

  <div class="header-box">
    <div>
      <h1 class="header-title">گزارش ارزیابی رادار مهارتی D3.js و شکاف مهارت‌ها در آلمان</h1>
      <p class="header-subtitle">Skills Gap Analysis & Tech Stack Radar Benchmark (KldB & Federal Regulations)</p>
    </div>
    <div class="meta-box">
      <div><strong>شماره پرونده:</strong> ${refNumber}</div>
      <div><strong>تاریخ گزارش:</strong> ${printDate}</div>
    </div>
  </div>

  <div class="profile-card avoid-break">
    <div>
      <div class="profile-item-label">نام متقاضی:</div>
      <div class="profile-item-val">${candidateName}</div>
    </div>
    <div>
      <div class="profile-item-label">عنوان موقعیت شغلی:</div>
      <div class="profile-item-val" style="color: #4338ca;">${liveRole.title}</div>
    </div>
    <div>
      <div class="profile-item-label">عنوان همتای استاندارد آلمان:</div>
      <div class="profile-item-val" style="font-family: monospace; direction: ltr; font-size: 7pt;">${liveRole.titleDe}</div>
    </div>
    <div>
      <div class="profile-item-label">کد طبقه‌بندی شغلی فدرال (KldB):</div>
      <div class="profile-item-val">${liveRole.kldbCode || "نامشخص"}</div>
    </div>
  </div>

  <div class="kpi-banner avoid-break">
    <div class="kpi-card">
      <div class="kpi-val" style="color: #4338ca;">${liveMetrics.overallMatchPct}%</div>
      <div class="kpi-lbl">ضریب تطابق کلی با استاندارد</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #166534;">${liveMetrics.strongCount} مهارت</div>
      <div class="kpi-lbl">تطابق کامل / آماده جاب‌آفر</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #b45309;">${liveMetrics.gapCount} مهارت</div>
      <div class="kpi-lbl">شکاف نیازمند ارتقا و تطبیق</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #0369a1;">${liveRole.avgSalaryRange}</div>
      <div class="kpi-lbl">میانگین رنج درآمدی در آلمان</div>
    </div>
  </div>

  ${radarSvgMarkup ? `
    <div class="radar-box avoid-break">
      <div style="font-size: 7.8pt; font-weight: bold; color: #93c5fd; margin-bottom: 4px;">
        رادار چندمحوره تطبیق تخصص‌های شما (بنفش) در برابر استاندارد آلمان (سبز خط‌چین)
      </div>
      ${radarSvgMarkup}
      <div style="display: flex; justify-content: center; gap: 20px; font-size: 7pt; color: #cbd5e1; margin-top: 4px;">
        <span>■ ارزیابی نمره مهارت متقاضی</span>
        <span>┄┄ استاندارد و بنچ‌مارک کارفرمای آلمانی (Benchmark)</span>
      </div>
    </div>
  ` : ""}

  ${liveRole.germanEmployerDuties && liveRole.germanEmployerDuties.length > 0 ? `
    <div class="avoid-break" style="margin-top: 6px;">
      <div class="section-header">
        <span class="section-title">۱. انتظارات عملیاتی و وظایف محوله کارفرمایان در آلمان (${liveRole.titleDe})</span>
        <span class="section-badge">شرح تکالیف فنی</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 8px;">
        ${liveRole.germanEmployerDuties.map((duty, idx) => `
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 5px 7px; font-size: 7pt; color: #334155; line-height: 1.4;">
            <strong style="color: #4338ca;">${idx + 1}.</strong> ${duty}
          </div>
        `).join("")}
      </div>
    </div>
  ` : ""}

  ${liveRole.overallMatchSummary ? `
    <div class="avoid-break" style="margin-top: 6px;">
      <div class="section-header">
        <span class="section-title">۲. تحلیل کلیدی نقاط قوت، شکاف‌های فنی و الزامات رگولاتوری آلمان</span>
        <span class="section-badge">تحلیل تطبیقی</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 8px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 6px 8px;">
          <strong style="font-size: 7.4pt; color: #166534; display: block; margin-bottom: 4px;">✓ نقاط قوت کلیدی شما:</strong>
          <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #14532d; line-height: 1.4;">
            ${liveRole.overallMatchSummary.topStrengths.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; padding: 6px 8px;">
          <strong style="font-size: 7.4pt; color: #92400e; display: block; margin-bottom: 4px;">⚠ شکاف‌های فنی اولویت‌دار:</strong>
          <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #78350f; line-height: 1.4;">
            ${liveRole.overallMatchSummary.criticalGaps.map(g => `<li>${g}</li>`).join("")}
          </ul>
        </div>
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; padding: 6px 8px;">
          <strong style="font-size: 7.4pt; color: #0369a1; display: block; margin-bottom: 4px;">📜 استانداردها و گواهی‌های آلمان:</strong>
          <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #0c4a6e; line-height: 1.4;">
            ${liveRole.overallMatchSummary.priorityCertificatesDe.map(c => `<li>${c}</li>`).join("")}
          </ul>
        </div>
      </div>
      ${liveRole.overallMatchSummary.germanCvOptimizationTip ? `
        <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 4px; padding: 5px 8px; font-size: 7pt; color: #312e81; margin-bottom: 8px;">
          <strong>💡 راهبرد بهینه‌سازی رزومه آلمانی (Lebenslauf):</strong> ${liveRole.overallMatchSummary.germanCvOptimizationTip}
        </div>
      ` : ""}
    </div>
  ` : ""}

  <div class="page-break"></div>

  <div class="avoid-break" style="margin-top: 6px;">
    <div class="section-header">
      <span class="section-title">۳. ماتریس تفصیلی ارزیابی مهارت‌ها، سرفصل‌های مصاحبه و راهکارهای ارتقا</span>
      <span class="section-badge">ماتریس شکاف</span>
    </div>

    <table class="table-custom">
      <thead>
        <tr>
          <th style="width: 20%;">شاخص مهارتی / فنی</th>
          <th style="width: 10%; text-align: center;">نمره شما</th>
          <th style="width: 11%; text-align: center;">استاندارد آلمان</th>
          <th style="width: 11%; text-align: center;">وضعیت شکاف</th>
          <th style="width: 24%;">بستر و انتظارات بازار کار آلمان</th>
          <th style="width: 24%;">راهکار عملیاتی مصاحبه و ارتقا</th>
        </tr>
      </thead>
      <tbody>
        ${(liveSkills || []).map(skill => {
          const delta = (Number(skill.germanBenchmark) || 0) - (Number(skill.userScore) || 0);
          const isReady = delta <= 0;
          const isCritical = delta > 15;
          const badgeClass = isReady ? "badge-ready" : (isCritical ? "badge-critical" : "badge-gap");
          const statusText = isReady ? "آماده جاب‌آفر" : `${delta}%- نیاز به تقویت`;

          return `
            <tr>
              <td>
                <strong>${skill.name || "مهارت"}</strong>
                <div style="font-size: 6.5pt; color: #64748b; font-family: monospace; direction: ltr; text-align: left;">${skill.nameEn || skill.name || ""}</div>
              </td>
              <td style="text-align: center; font-weight: bold; color: #4338ca;">${skill.userScore || 0}%</td>
              <td style="text-align: center; font-weight: bold; color: #166534;">${skill.germanBenchmark || 0}%</td>
              <td style="text-align: center;"><span class="${badgeClass}">${statusText}</span></td>
              <td style="color: #334155; font-size: 6.8pt; line-height: 1.35;">${skill.germanContext || ""}</td>
              <td style="color: #1e3a8a; font-size: 6.8pt; line-height: 1.35;">${skill.actionRecommendation || ""}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  </div>

  <div class="footer-bar">
    سامانه ارزیابی هوشمند و کاریابی آلمان | گروه شرکت‌های بین‌المللی جهانبان | تدوین‌شده بر پایه تحلیل داده‌های راداری و استاندارد KldB 2026
  </div>
</body>
</html>`;

      // Create or reuse hidden print iframe
      let iframe = document.getElementById("pdf-print-skills-radar-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "pdf-print-skills-radar-iframe";
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
              console.warn("Iframe print error, falling back to window.open:", err);
              const win = window.open("", "_blank");
              if (win) {
                win.document.title = printDocTitle;
                win.document.write(htmlContent);
                win.document.close();
                win.print();
              }
            }
          });
        }, 500);
      } else {
        const win = window.open("", "_blank");
        if (win) {
          triggerPrintWithTitle(printDocTitle, () => {
            win.document.title = printDocTitle;
            win.document.write(htmlContent);
            win.document.close();
            win.print();
          });
        }
      }
    } catch (err) {
      console.error("Print error:", err);
    } finally {
      setTimeout(() => setIsPrinting(false), 1200);
    }
  };

  // Direct print of the Technical Requirements & Interview Topics Table (using live component state)
  const handlePrintInterviewTable = async () => {
    setIsPrintingTable(true);
    try {
      // Capture live updated state snapshot immediately
      const snapshot = getLiveComponentStateSnapshot();
      const { skills: liveSkills, role: liveRole, metrics: liveMetrics, candidateName, printDate } = snapshot;
      const interviewAdvice = getRoleInterviewAdvice(liveRole);

      let logoBase64 = "";
      try {
        const res = await fetch("/api/logo-base64");
        const json = await res.json();
        if (json.success) logoBase64 = json.base64;
      } catch {
        // ignore
      }

      const refNumber = `DE-TECH-INT-${Math.floor(100000 + Math.random() * 900000)}`;
      const printDocTitle = formatPrintDocumentTitle("ماتریس الزامات و مصاحبه فنی", candidateName);

      const htmlContent = `<!DOCTYPE html>
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
      font-size: 8.2pt;
      line-height: 1.45;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 360px;
      opacity: 0.04;
      z-index: -1000;
      pointer-events: none;
    }
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .header-box {
      border-bottom: 2.5px solid #059669;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-size: 12pt;
      font-weight: 900;
      color: #064e3b;
      margin: 0 0 2px 0;
    }
    .header-subtitle {
      font-size: 8pt;
      color: #059669;
      font-weight: 700;
      margin: 0;
    }
    .meta-box {
      text-align: left;
      font-size: 7.2pt;
      color: #64748b;
      direction: ltr;
    }
    .profile-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px 12px;
      font-size: 7.8pt;
    }
    .profile-item-label {
      color: #64748b;
      font-size: 7pt;
    }
    .profile-item-val {
      font-weight: bold;
      color: #0f172a;
    }
    .kpi-banner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 10px;
    }
    .kpi-card {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 8px;
      text-align: center;
    }
    .kpi-val {
      font-size: 11pt;
      font-weight: 900;
      color: #064e3b;
    }
    .kpi-lbl {
      font-size: 6.8pt;
      color: #64748b;
    }
    .section-header {
      background: #ecfdf5;
      border-right: 4px solid #059669;
      padding: 5px 10px;
      margin: 10px 0 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0 4px 4px 0;
    }
    .section-title {
      font-size: 8.8pt;
      font-weight: 800;
      color: #064e3b;
    }
    .section-badge {
      font-size: 6.8pt;
      font-weight: bold;
      background: #059669;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .interview-guide-box {
      background: #f0fdf4;
      border: 1px solid #a7f3d0;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }
    .interview-guide-title {
      font-size: 7.8pt;
      font-weight: bold;
      color: #065f46;
      margin-bottom: 4px;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-bottom: 8px;
    }
    .table-custom th {
      background: #064e3b;
      color: #ffffff;
      padding: 6px 8px;
      text-align: right;
      font-weight: 700;
      border: 1px solid #047857;
    }
    .table-custom td {
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    .table-custom tr:nth-child(even) {
      background: #f8fafc;
    }
    .badge-ready {
      background: #dcfce7;
      color: #166534;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 6.5pt;
      display: inline-block;
      white-space: nowrap;
    }
    .badge-gap {
      background: #fef3c7;
      color: #92400e;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 6.5pt;
      display: inline-block;
      white-space: nowrap;
    }
    .badge-critical {
      background: #fee2e2;
      color: #991b1b;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 6.5pt;
      display: inline-block;
      white-space: nowrap;
    }
    .footer-bar {
      margin-top: 14px;
      padding-top: 6px;
      border-top: 1px solid #cbd5e1;
      text-align: center;
      font-size: 6.8pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  ${logoBase64 ? `<img class="watermark" src="data:image/jpeg;base64,${logoBase64}" />` : ""}

  <div class="header-box">
    <div>
      <h1 class="header-title">جدول مقایسه‌ای الزامات فنی و سرفصل‌های مصاحبه فنی برای پوزیشن</h1>
      <p class="header-subtitle">Technical Competencies & Interview Preparation Matrix - German Labor Market Benchmark</p>
    </div>
    <div class="meta-box">
      <div><strong>شماره پرونده:</strong> ${refNumber}</div>
      <div><strong>تاریخ گزارش:</strong> ${printDate}</div>
    </div>
  </div>

  <div class="profile-card avoid-break">
    <div>
      <div class="profile-item-label">نام متقاضی:</div>
      <div class="profile-item-val">${candidateName}</div>
    </div>
    <div>
      <div class="profile-item-label">عنوان موقعیت شغلی:</div>
      <div class="profile-item-val" style="color: #065f46;">${liveRole.title}</div>
    </div>
    <div>
      <div class="profile-item-label">عنوان استاندارد آلمانی:</div>
      <div class="profile-item-val" style="font-family: monospace; direction: ltr; font-size: 7pt;">${liveRole.titleDe}</div>
    </div>
    <div>
      <div class="profile-item-label">طبقه‌بندی فدرال مشاغل (KldB):</div>
      <div class="profile-item-val">${liveRole.kldbCode || "مطابق استاندارد فدرال"}</div>
    </div>
  </div>

  <div class="kpi-banner avoid-break">
    <div class="kpi-card">
      <div class="kpi-val" style="color: #059669;">${liveMetrics.overallMatchPct}%</div>
      <div class="kpi-lbl">تطابق کلی مهارت‌ها با نیاز بازار آلمان</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #166534;">${liveMetrics.strongCount} سرفصل</div>
      <div class="kpi-lbl">سرفصل‌های آماده مصاحبه و جاب‌آفر</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #b45309;">${liveMetrics.gapCount} سرفصل</div>
      <div class="kpi-lbl">سرفصل‌های نیازمند تقویت و مرور</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #0284c7;">${liveRole.avgSalaryRange}</div>
      <div class="kpi-lbl">میانگین رنج درآمدی در آلمان</div>
    </div>
  </div>

  <div class="interview-guide-box avoid-break">
    <div class="interview-guide-title">
      🧭 اصول کلیدی موفقیت در مصاحبه‌های فنی آلمان (German Technical Interview Culture):
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 7pt; color: #166534; line-height: 1.4;">
      <div>
        <strong>${interviewAdvice.pillar1Title}</strong> ${interviewAdvice.pillar1Desc}
      </div>
      <div>
        <strong>${interviewAdvice.pillar2Title}</strong> ${interviewAdvice.pillar2Desc}
      </div>
      <div>
        <strong>${interviewAdvice.pillar3Title}</strong> ${interviewAdvice.pillar3Desc}
      </div>
    </div>
  </div>

  <div class="avoid-break" style="margin-top: 6px;">
    <div class="section-header">
      <span class="section-title">ماتریس تفصیلی سرفصل‌های فنی، نمرات، بستر صنعتی در آلمان و راهبردهای مصاحبه</span>
      <span class="section-badge">ماتریس جامع</span>
    </div>

    <table class="table-custom">
      <thead>
        <tr>
          <th style="width: 21%;">سرفصل مهارتی / فنی</th>
          <th style="width: 8%; text-align: center;">سطح شما</th>
          <th style="width: 10%; text-align: center;">استاندارد آلمان</th>
          <th style="width: 11%; text-align: center;">وضعیت شکاف</th>
          <th style="width: 25%;">بستر کاربرد و انتظارات در شرکت‌های آلمانی</th>
          <th style="width: 25%;">راهبرد مصاحبه و راهکار قبولی در جاب‌آفر</th>
        </tr>
      </thead>
      <tbody>
        ${(liveSkills || []).map(skill => {
          const delta = (Number(skill.germanBenchmark) || 0) - (Number(skill.userScore) || 0);
          const isReady = delta <= 0;
          const isCritical = delta > 15;
          const badgeClass = isReady ? "badge-ready" : (isCritical ? "badge-critical" : "badge-gap");
          const statusText = isReady ? "آماده جاب‌آفر" : `${delta}%- نیاز به تقویت`;

          return `
            <tr>
              <td>
                <div style="font-weight: 800; color: #0f172a; font-size: 7.5pt;">${skill.name || "مهارت"}</div>
                <div style="font-size: 6.5pt; color: #64748b; font-family: monospace; direction: ltr; text-align: left; margin-top: 1px;">${skill.nameEn || skill.name || ""}</div>
              </td>
              <td style="text-align: center; font-weight: bold; color: #4338ca;">
                ${skill.userScore || 0}%
              </td>
              <td style="text-align: center; font-weight: bold; color: #166534;">
                ${skill.germanBenchmark || 0}%
              </td>
              <td style="text-align: center;">
                <span class="${badgeClass}">${statusText}</span>
              </td>
              <td style="color: #334155; font-size: 6.8pt; line-height: 1.35;">
                ${skill.germanContext}
              </td>
              <td style="color: #065f46; font-size: 6.8pt; line-height: 1.35; font-weight: 500;">
                ${skill.actionRecommendation}
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  </div>

  ${liveRole.overallMatchSummary ? `
    <div class="avoid-break" style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px; padding: 6px 8px;">
        <strong style="font-size: 7.4pt; color: #166534; display: block; margin-bottom: 4px;">📜 گواهی‌ها و استانداردهای ضروری در آلمان:</strong>
        <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #14532d; line-height: 1.4;">
          ${liveRole.overallMatchSummary.priorityCertificatesDe.map(c => `<li>${c}</li>`).join("")}
        </ul>
      </div>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 5px; padding: 6px 8px;">
        <strong style="font-size: 7.4pt; color: #1e40af; display: block; margin-bottom: 4px;">💡 راهبرد بهینه‌سازی رزومه و مصاحبه فنی (Interview Pitch):</strong>
        <p style="margin: 0; font-size: 6.8pt; color: #1e3a8a; line-height: 1.45;">
          ${liveRole.overallMatchSummary.germanCvOptimizationTip}
        </p>
      </div>
    </div>
  ` : ""}

  <div class="footer-bar">
    سامانه ارزیابی هوشمند و کاریابی آلمان | گروه شرکت‌های بین‌المللی جهانبان | تدوین‌شده بر پایه استاندارد طبقه‌بندی KldB و انتظارات کارفرمایان فدرال ۲۰۲۶
  </div>
</body>
</html>`;

      // Create or reuse hidden print iframe
      let iframe = document.getElementById("pdf-print-interview-table-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "pdf-print-interview-table-iframe";
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
              console.warn("Iframe print error, falling back to window.open:", err);
              const win = window.open("", "_blank");
              if (win) {
                win.document.title = printDocTitle;
                win.document.write(htmlContent);
                win.document.close();
                win.print();
              }
            }
          });
        }, 500);
      } else {
        const win = window.open("", "_blank");
        if (win) {
          triggerPrintWithTitle(printDocTitle, () => {
            win.document.title = printDocTitle;
            win.document.write(htmlContent);
            win.document.close();
            win.print();
          });
        }
      }
    } catch (err) {
      console.error("Print error:", err);
    } finally {
      setTimeout(() => setIsPrintingTable(false), 1200);
    }
  };

  // Dedicated unified direct print method for BOTH D3 Skills Gap Radar and Technical Requirements Table
  // Directly snapshots the component's live state (customSkills, selectedRole, analysisMetrics)
  const handlePrintUnifiedReport = async () => {
    setIsPrintingUnified(true);
    try {
      // 1. Capture live updated state snapshot immediately
      const snapshot = getLiveComponentStateSnapshot();
      const { skills: liveSkills, role: liveRole, metrics: liveMetrics, candidateName, printDate } = snapshot;
      const interviewAdvice = getRoleInterviewAdvice(liveRole);

      // 2. Fetch logo watermark if available
      let logoBase64 = "";
      try {
        const res = await fetch("/api/logo-base64");
        const json = await res.json();
        if (json.success) logoBase64 = json.base64;
      } catch {
        // ignore
      }

      const refNumber = `DE-UNIFIED-SKILLS-${Math.floor(100000 + Math.random() * 900000)}`;
      const printDocTitle = formatPrintDocumentTitle("گزارش جامع تحلیل مهارتی آلمان", candidateName);

      // 3. Extract current live SVG radar markup if available
      let radarSvgMarkup = "";
      if (svgRef.current) {
        try {
          const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
          clone.setAttribute("width", "440");
          clone.setAttribute("height", "340");
          clone.style.margin = "0 auto";
          clone.style.display = "block";
          radarSvgMarkup = clone.outerHTML;
        } catch (e) {
          console.warn("Could not clone radar SVG:", e);
        }
      }

      // 4. Construct unified 2-page / multi-section print HTML document
      const htmlContent = `<!DOCTYPE html>
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
      font-size: 8pt;
      line-height: 1.45;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 380px;
      opacity: 0.04;
      z-index: -1000;
      pointer-events: none;
    }
    .page-break {
      page-break-before: always !important;
      break-before: page !important;
    }
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .header-box {
      border-bottom: 2.5px solid #4338ca;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-box-green {
      border-bottom: 2.5px solid #059669;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-size: 11.5pt;
      font-weight: 900;
      color: #1e1b4b;
      margin: 0 0 2px 0;
    }
    .header-title-green {
      font-size: 11.5pt;
      font-weight: 900;
      color: #064e3b;
      margin: 0 0 2px 0;
    }
    .header-subtitle {
      font-size: 7.8pt;
      color: #4f46e5;
      font-weight: 700;
      margin: 0;
    }
    .header-subtitle-green {
      font-size: 7.8pt;
      color: #059669;
      font-weight: 700;
      margin: 0;
    }
    .meta-box {
      text-align: left;
      font-size: 7pt;
      color: #64748b;
      direction: ltr;
    }
    .profile-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px 10px;
      font-size: 7.6pt;
    }
    .profile-item-label {
      color: #64748b;
      font-size: 6.8pt;
    }
    .profile-item-val {
      font-weight: bold;
      color: #0f172a;
    }
    .kpi-banner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 10px;
    }
    .kpi-card {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 8px;
      text-align: center;
    }
    .kpi-val {
      font-size: 10.5pt;
      font-weight: 900;
      color: #1e1b4b;
    }
    .kpi-lbl {
      font-size: 6.8pt;
      color: #64748b;
    }
    .section-header {
      background: #eef2ff;
      border-right: 4px solid #4f46e5;
      padding: 5px 9px;
      margin: 9px 0 5px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0 4px 4px 0;
    }
    .section-header-green {
      background: #ecfdf5;
      border-right: 4px solid #059669;
      padding: 5px 9px;
      margin: 9px 0 5px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0 4px 4px 0;
    }
    .section-title {
      font-size: 8.5pt;
      font-weight: 800;
      color: #1e1b4b;
    }
    .section-title-green {
      font-size: 8.5pt;
      font-weight: 800;
      color: #064e3b;
    }
    .section-badge {
      font-size: 6.5pt;
      font-weight: bold;
      background: #4f46e5;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .section-badge-green {
      font-size: 6.5pt;
      font-weight: bold;
      background: #059669;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .radar-box {
      background: #0f172a;
      border-radius: 6px;
      padding: 10px 8px;
      margin-bottom: 10px;
      text-align: center;
    }
    .interview-guide-box {
      background: #f0fdf4;
      border: 1px solid #a7f3d0;
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 8px;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-bottom: 8px;
    }
    .table-custom th {
      background: #1e1b4b;
      color: #ffffff;
      padding: 6px 8px;
      text-align: right;
      font-weight: 700;
      border: 1px solid #312e81;
    }
    .table-custom-green th {
      background: #064e3b;
      color: #ffffff;
      padding: 6px 8px;
      text-align: right;
      font-weight: 700;
      border: 1px solid #047857;
    }
    .table-custom td {
      padding: 5px 7px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    .table-custom tr:nth-child(even) {
      background: #f8fafc;
    }
    .badge-ready {
      background: #dcfce7;
      color: #166534;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 6.5pt;
      display: inline-block;
      white-space: nowrap;
    }
    .badge-gap {
      background: #fef3c7;
      color: #92400e;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 6.5pt;
      display: inline-block;
      white-space: nowrap;
    }
    .badge-critical {
      background: #fee2e2;
      color: #991b1b;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 6.5pt;
      display: inline-block;
      white-space: nowrap;
    }
    .footer-bar {
      margin-top: 10px;
      padding-top: 5px;
      border-top: 1px solid #cbd5e1;
      text-align: center;
      font-size: 6.8pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  ${logoBase64 ? `<img class="watermark" src="data:image/jpeg;base64,${logoBase64}" />` : ""}

  <!-- ================= SECTION 1: D3 RADAR CHART & SKILLS GAP ================= -->
  <div class="header-box">
    <div>
      <h1 class="header-title">بخش ۱: تحلیل مهارتی D3.js (Skills Gap Analysis & Tech Stack Radar)</h1>
      <p class="header-subtitle">تحلیل شکاف مهارتی بر مبنای شغل همتای استاندارد در آلمان (${liveRole.titleDe})</p>
    </div>
    <div class="meta-box">
      <div><strong>شماره گزارش:</strong> ${refNumber}</div>
      <div><strong>تاریخ صدور:</strong> ${printDate}</div>
    </div>
  </div>

  <div class="profile-card avoid-break">
    <div>
      <div class="profile-item-label">نام متقاضی:</div>
      <div class="profile-item-val">${candidateName}</div>
    </div>
    <div>
      <div class="profile-item-label">عنوان شغل هدف:</div>
      <div class="profile-item-val" style="color: #4338ca;">${liveRole.title}</div>
    </div>
    <div>
      <div class="profile-item-label">همتای رسمی در بازار کار آلمان:</div>
      <div class="profile-item-val" style="font-family: monospace; direction: ltr; font-size: 7pt;">${liveRole.titleDe}</div>
    </div>
    <div>
      <div class="profile-item-label">کد استاندارد فدرال (KldB):</div>
      <div class="profile-item-val">${liveRole.kldbCode || "مطابق رگولاتوری فدرال"}</div>
    </div>
  </div>

  <div class="kpi-banner avoid-break">
    <div class="kpi-card">
      <div class="kpi-val" style="color: #4338ca;">${liveMetrics.overallMatchPct}%</div>
      <div class="kpi-lbl">شاخص تطابق کلی با استاندارد آلمان</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #166534;">${liveMetrics.strongCount} مهارت</div>
      <div class="kpi-lbl">تطابق کامل / آماده جاب‌آفر</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #b45309;">${liveMetrics.gapCount} مهارت</div>
      <div class="kpi-lbl">شکاف نیازمند تقویت و تمرین</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color: #0369a1;">${liveRole.avgSalaryRange}</div>
      <div class="kpi-lbl">میانگین رنج حقوقی در آلمان</div>
    </div>
  </div>

  ${radarSvgMarkup ? `
    <div class="radar-box avoid-break">
      <div style="font-size: 7.8pt; font-weight: bold; color: #93c5fd; margin-bottom: 4px;">
        دیاگرام رادار چندمحوره تطبیق تخصص‌های متقاضی (بنفش) در برابر شاخص استاندارد آلمان (سبز خط‌چین)
      </div>
      ${radarSvgMarkup}
      <div style="display: flex; justify-content: center; gap: 20px; font-size: 6.8pt; color: #cbd5e1; margin-top: 4px;">
        <span>■ ارزیابی سطح مهارت متقاضی (وضعیت زنده)</span>
        <span>┄┄ استاندارد و بنچ‌مارک کارفرمای آلمانی (Benchmark)</span>
      </div>
    </div>
  ` : ""}

  ${liveRole.overallMatchSummary ? `
    <div class="avoid-break" style="margin-top: 6px;">
      <div class="section-header">
        <span class="section-title">بررسی تطبیقی نقاط قوت کلیدی، شکاف‌های فنی و گواهی‌های معتبر</span>
        <span class="section-badge">تحلیل استراتژیک</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 8px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 5px 8px;">
          <strong style="font-size: 7.2pt; color: #166534; display: block; margin-bottom: 3px;">✓ نقاط قوت کلیدی شما:</strong>
          <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #14532d; line-height: 1.4;">
            ${liveRole.overallMatchSummary.topStrengths.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; padding: 5px 8px;">
          <strong style="font-size: 7.2pt; color: #92400e; display: block; margin-bottom: 3px;">⚠ اولویت‌های رفع شکاف:</strong>
          <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #78350f; line-height: 1.4;">
            ${liveRole.overallMatchSummary.criticalGaps.map(g => `<li>${g}</li>`).join("")}
          </ul>
        </div>
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; padding: 5px 8px;">
          <strong style="font-size: 7.2pt; color: #0369a1; display: block; margin-bottom: 3px;">📜 استانداردهای آلمان:</strong>
          <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #0c4a6e; line-height: 1.4;">
            ${liveRole.overallMatchSummary.priorityCertificatesDe.map(c => `<li>${c}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  ` : ""}

  <div class="footer-bar">
    صفحه ۱ از ۲ | سامانه ارزیابی هوشمند و کاریابی آلمان | بخش اول: تحلیل مهارتی D3.js و دیاگرام رادار
  </div>

  <!-- ================= SECTION 2: COMPARATIVE TECHNICAL REQUIREMENTS TABLE ================= -->
  <div class="page-break"></div>

  <div class="header-box-green" style="margin-top: 4px;">
    <div>
      <h2 class="header-title-green">بخش ۲: جدول مقایسه‌ای الزامات فنی و سرفصل‌های مصاحبه فنی برای پوزیشن</h2>
      <p class="header-subtitle-green">Technical Competencies & Interview Preparation Matrix - ${liveRole.titleDe}</p>
    </div>
    <div class="meta-box">
      <div><strong>شماره پیگیری:</strong> ${refNumber}</div>
      <div><strong>تاریخ گزارش:</strong> ${printDate}</div>
    </div>
  </div>

  <div class="interview-guide-box avoid-break">
    <div style="font-size: 7.5pt; font-weight: bold; color: #065f46; margin-bottom: 3px;">
      🧭 اصول کلیدی موفقیت در مصاحبه‌های فنی آلمان (German Technical Interview Culture):
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 6.8pt; color: #166534; line-height: 1.4;">
      <div>
        <strong>${interviewAdvice.pillar1Title}</strong> ${interviewAdvice.pillar1Desc}
      </div>
      <div>
        <strong>${interviewAdvice.pillar2Title}</strong> ${interviewAdvice.pillar2Desc}
      </div>
      <div>
        <strong>${interviewAdvice.pillar3Title}</strong> ${interviewAdvice.pillar3Desc}
      </div>
    </div>
  </div>

  <div class="avoid-break">
    <div class="section-header-green">
      <span class="section-title-green">ماتریس تفصیلی سرفصل‌های فنی، وضعیت شکاف مهارتی و راهبردهای قبولی در مصاحبه</span>
      <span class="section-badge-green">ماتریس زنده (${(liveSkills || []).length} مهارت)</span>
    </div>

    <table class="table-custom table-custom-green">
      <thead>
        <tr>
          <th style="width: 20%;">سرفصل مهارتی / ابزار فنی</th>
          <th style="width: 9%; text-align: center;">سطح شما</th>
          <th style="width: 10%; text-align: center;">بنچ‌مارک آلمان</th>
          <th style="width: 11%; text-align: center;">وضعیت شکاف</th>
          <th style="width: 25%;">بستر کاربرد در شرکت‌های آلمانی</th>
          <th style="width: 25%;">راهبرد مصاحبه و توصیه فنی</th>
        </tr>
      </thead>
      <tbody>
        ${(liveSkills || []).map(skill => {
          const delta = (Number(skill.germanBenchmark) || 0) - (Number(skill.userScore) || 0);
          const isReady = delta <= 0;
          const isCritical = delta > 15;
          const badgeClass = isReady ? "badge-ready" : (isCritical ? "badge-critical" : "badge-gap");
          const statusText = isReady ? "آماده جاب‌آفر" : `${delta}%- نیاز به تقویت`;

          return `
            <tr>
              <td>
                <div style="font-weight: 800; color: #0f172a; font-size: 7.4pt;">${skill.name || "مهارت"}</div>
                <div style="font-size: 6.4pt; color: #64748b; font-family: monospace; direction: ltr; text-align: left; margin-top: 1px;">${skill.nameEn || skill.name || ""}</div>
              </td>
              <td style="text-align: center; font-weight: bold; color: #4338ca;">${skill.userScore || 0}%</td>
              <td style="text-align: center; font-weight: bold; color: #166534;">${skill.germanBenchmark || 0}%</td>
              <td style="text-align: center;"><span class="${badgeClass}">${statusText}</span></td>
              <td style="color: #334155; font-size: 6.8pt; line-height: 1.35;">${skill.germanContext || ""}</td>
              <td style="color: #065f46; font-size: 6.8pt; line-height: 1.35; font-weight: 500;">${skill.actionRecommendation || ""}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  </div>

  ${liveRole.overallMatchSummary && liveRole.overallMatchSummary.germanCvOptimizationTip ? `
    <div class="avoid-break" style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 5px; padding: 6px 9px; font-size: 6.8pt; color: #312e81; margin-top: 6px;">
      <strong>💡 راهبرد بهینه‌سازی رزومه و مصاحبه کاری در آلمان (Lebenslauf Pitch):</strong> ${liveRole.overallMatchSummary.germanCvOptimizationTip}
    </div>
  ` : ""}

  <div class="footer-bar">
    صفحه ۲ از ۲ | سامانه ارزیابی هوشمند و کاریابی آلمان | گروه شرکت‌های بین‌المللی جهانبان | تدوین‌شده بر پایه استاندارد طبقه‌بندی KldB و انتظارات کارفرمایان فدرال ۲۰۲۶
  </div>
</body>
</html>`;

      // 5. Create or reuse hidden print iframe
      let iframe = document.getElementById("pdf-print-unified-skills-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "pdf-print-unified-skills-iframe";
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
              console.warn("Iframe print error, falling back to window.open:", err);
              const win = window.open("", "_blank");
              if (win) {
                win.document.title = printDocTitle;
                win.document.write(htmlContent);
                win.document.close();
                win.print();
              }
            }
          });
        }, 500);
      } else {
        const win = window.open("", "_blank");
        if (win) {
          triggerPrintWithTitle(printDocTitle, () => {
            win.document.title = printDocTitle;
            win.document.write(htmlContent);
            win.document.close();
            win.print();
          });
        }
      }
    } catch (err) {
      console.error("Unified print error:", err);
    } finally {
      setTimeout(() => setIsPrintingUnified(false), 1200);
    }
  };

  // Render D3 Radar Chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 460;
    const width = Math.min(containerWidth, 540);
    const height = Math.min(width, 420);
    const margin = { top: 45, right: 65, bottom: 45, left: 65 };
    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawing

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const rawData = Array.isArray(customSkills) ? customSkills : [];
    if (rawData.length === 0) return;

    const data = rawData.map(sanitizeSkillDimension);
    const totalAxes = data.length;
    if (totalAxes < 3) return;

    const angleSlice = (Math.PI * 2) / totalAxes;

    // Scale from 0 to 100
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Concentric Level Rings (20%, 40%, 60%, 80%, 100%)
    const levels = [20, 40, 60, 80, 100];

    const gridGroup = g.append("g").attr("class", "grid-group");

    // Circular/Polygon Grid lines
    levels.forEach(level => {
      const levelRadius = rScale(level);

      // Create polygon path for grid level
      const points: [number, number][] = data.map((_, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        return [levelRadius * Math.cos(angle), levelRadius * Math.sin(angle)];
      });

      const lineGenerator = d3.line<[number, number]>().curve(d3.curveLinearClosed);

      gridGroup
        .append("path")
        .datum(points)
        .attr("d", lineGenerator)
        .attr("fill", level === 100 ? "#0f172a" : "none")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "#334155")
        .attr("stroke-width", level === 100 ? 1.5 : 0.8)
        .attr("stroke-dasharray", level === 100 ? "none" : "3,3");

      // Label on the vertical axis (e.g. 20%, 40%, 80%, 100%)
      gridGroup
        .append("text")
        .attr("x", 6)
        .attr("y", -levelRadius + 4)
        .attr("fill", "#64748b")
        .attr("font-size", "9px")
        .attr("font-family", "system-ui, sans-serif")
        .attr("font-weight", "500")
        .text(`${level}%`);
    });

    // Radial Axis Lines
    const axisGroup = g.append("g").attr("class", "axis-group");

    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = rScale(100) * Math.cos(angle);
      const y = rScale(100) * Math.sin(angle);

      // Axis ray line
      axisGroup
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#334155")
        .attr("stroke-width", 1);

      // Axis Label position
      const labelRadius = radius + 22;
      const labelX = labelRadius * Math.cos(angle);
      const labelY = labelRadius * Math.sin(angle);

      // Compute text anchor depending on side
      let textAnchor = "middle";
      if (Math.abs(Math.cos(angle)) > 0.3) {
        textAnchor = Math.cos(angle) > 0 ? "start" : "end";
      }

      const labelGroup = axisGroup
        .append("g")
        .attr("transform", `translate(${labelX}, ${labelY})`)
        .attr("class", "cursor-pointer")
        .on("click", () => {
          setActiveSkillId(d.id);
        });

      const nameStr = typeof d.name === "string" ? d.name : "مهارت";
      const nameEnStr = typeof d.nameEn === "string" ? d.nameEn : (nameStr || "");

      // Dimension Name (Persian)
      labelGroup
        .append("text")
        .attr("x", 0)
        .attr("y", -4)
        .attr("text-anchor", textAnchor)
        .attr("fill", activeSkillId === d.id ? "#38bdf8" : "#cbd5e1")
        .attr("font-size", "10px")
        .attr("font-weight", activeSkillId === d.id ? "bold" : "600")
        .attr("font-family", "system-ui, sans-serif")
        .text(nameStr.length > 22 ? nameStr.slice(0, 20) + "..." : nameStr);

      // Short English Sub-label
      labelGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 9)
        .attr("text-anchor", textAnchor)
        .attr("fill", "#64748b")
        .attr("font-size", "8.5px")
        .attr("font-family", "system-ui, sans-serif")
        .text(nameEnStr.length > 20 ? nameEnStr.slice(0, 18) + ".." : nameEnStr);
    });

    // 1. Benchmark (German Average) Polygon
    const benchmarkPoints: [number, number][] = data.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      return [rScale(d.germanBenchmark) * Math.cos(angle), rScale(d.germanBenchmark) * Math.sin(angle)];
    });

    const lineGen = d3.line<[number, number]>().curve(d3.curveLinearClosed);

    const benchmarkGroup = g.append("g").attr("class", "benchmark-polygon");

    benchmarkGroup
      .append("path")
      .datum(benchmarkPoints)
      .attr("d", lineGen)
      .attr("fill", "#10b981")
      .attr("fill-opacity", 0.15)
      .attr("stroke", "#10b981")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,3");

    // Benchmark vertex dots
    benchmarkPoints.forEach(([x, y]) => {
      benchmarkGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
        .attr("fill", "#10b981")
        .attr("stroke", "#064e3b")
        .attr("stroke-width", 1.5);
    });

    // 2. User Score Polygon
    const userPoints: [number, number][] = data.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      return [rScale(d.userScore) * Math.cos(angle), rScale(d.userScore) * Math.sin(angle)];
    });

    const userGroup = g.append("g").attr("class", "user-polygon");

    // Glowing filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    filter.append("feComposite").attr("in", "SourceGraphic").attr("in2", "blur").attr("operator", "over");

    userGroup
      .append("path")
      .datum(userPoints)
      .attr("d", lineGen)
      .attr("fill", "#6366f1")
      .attr("fill-opacity", 0.35)
      .attr("stroke", "#818cf8")
      .attr("stroke-width", 2.5)
      .style("filter", "url(#glow)");

    // User vertex dots with interactivity
    userPoints.forEach(([x, y], i) => {
      const skill = data[i];
      if (!skill) return;
      const isSelected = activeSkillId === skill.id;

      const dot = userGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", isSelected ? 6.5 : 4.5)
        .attr("fill", isSelected ? "#38bdf8" : "#818cf8")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .attr("class", "cursor-pointer transition-all duration-200")
        .on("mouseenter", function () {
          d3.select(this).attr("r", 7).attr("fill", "#38bdf8");
          setActiveSkillId(skill.id);
        })
        .on("mouseleave", function () {
          if (activeSkillId !== skill.id) {
            d3.select(this).attr("r", 4.5).attr("fill", "#818cf8");
          }
        })
        .on("click", () => {
          setActiveSkillId(skill.id);
        });

      // Pulsing effect on highest gap area
      if (skill.userScore < skill.germanBenchmark - 12) {
        userGroup
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 9)
          .attr("fill", "none")
          .attr("stroke", "#f43f5e")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "2,2")
          .attr("opacity", 0.8);
      }
    });

  }, [customSkills, activeSkillId]);

  const activeSkill = useMemo(() => {
    if (!activeSkillId) return customSkills[0] || null;
    return customSkills.find(s => s.id === activeSkillId) || customSkills[0] || null;
  }, [activeSkillId, customSkills]);

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden text-right ${className}`}
      id="skills-gap-analysis-card"
    >
      {/* Header & Target Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>تحلیل مهارتی D3.js (Skills Gap Analysis & Tech Stack Radar)</span>
          </div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>تحلیل شکاف مهارتی بر مبنای شغل همتای استاندارد در آلمان</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            نمودار راداری بر پایه D3.js جهت مقایسه سوابق فنی شما با الزامات اعلامی کارفرمایان آلمانی و قوانین فنی و رگولاتوری فدرال.
          </p>

          {/* German counterpart title & KldB badge */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
              <Briefcase className="w-3 h-3 text-indigo-400" />
              <span>عنوان شغلی همتای آلمانی: {selectedRole.titleDe}</span>
            </span>
            {selectedRole.kldbCode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-700 text-[10px] font-mono">
                <span>کد طبقه‌بندی شغلی آلمان: {selectedRole.kldbCode}</span>
              </span>
            )}
            {isAiGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>شخصی‌سازی‌شده با Gemini</span>
              </span>
            )}
          </div>

          {/* Applicant's Extracted Profile Credentials */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span className="text-slate-400 font-medium">سوابق متقاضی:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 border border-slate-700 font-medium">
              <span>رشته / تخصص: {profile?.field || userField || "استخراج‌شده"}</span>
            </span>
            {(profile?.degree || profile?.educationSummary) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                <span>مدرک: {profile?.educationSummary || profile?.degree}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              <span>سابقه: {profile?.experience || userExp || 3} سال</span>
            </span>
            {(profile?.workHistoryHighlights && profile.workHistoryHighlights.length > 0) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>استخراج دقیق از سوابق رزومه متقاضی ({profile.workHistoryHighlights.length} سابقه شغلی)</span>
              </span>
            )}
          </div>
        </div>

        {/* Role Selector Dropdown & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={selectedRole.id}
              onChange={e => {
                const found = catalogRoles.find(r => r.id === e.target.value);
                if (found) handleRoleChange(found);
              }}
              className="w-full sm:w-auto bg-slate-950 border border-slate-700 hover:border-indigo-500 text-white text-xs font-bold rounded-xl px-4 py-2.5 appearance-none pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-inner"
            >
              {catalogRoles.map(role => (
                <option key={role.id} value={role.id} className="bg-slate-900 text-white">
                  {role.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleOpenPreview}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 active:scale-95 border border-sky-400/30"
            title="مشاهده پیش‌نمایش صفحه به صفحه گزارش نهایی (شامل تحلیل شکاف و جدول الزامات) قبل از چاپ"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span>پیش‌نمایش چاپ گزارش جامع</span>
          </button>

          <button
            onClick={handlePrintUnifiedReport}
            disabled={isPrintingUnified}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 active:scale-95 border border-indigo-400/30"
            title="چاپ یکپارچه و مستقیم هر دو بخش رادار D3 و جدول الزامات فنی بر اساس داده‌های زنده کامپوننت"
          >
            {isPrintingUnified ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Printer className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isPrintingUnified ? "آماده‌سازی گزارش جامع..." : "چاپ مستقیم جامع (رادار + جدول)"}</span>
          </button>

          <button
            onClick={handleDirectPrint}
            disabled={isPrinting}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 shadow-md disabled:opacity-50 active:scale-95"
            title="چاپ اختصاصی این تحلیل مهارتی و دیاگرام رادار (PDF)"
          >
            {isPrinting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />
            ) : (
              <Printer className="w-3.5 h-3.5 text-slate-300" />
            )}
            <span>{isPrinting ? "در حال آماده‌سازی..." : "چاپ مجزای رادار"}</span>
          </button>

          <button
            onClick={() => fetchDynamicSkillsGap()}
            disabled={isAiLoading}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md disabled:opacity-50"
            title="تحلیل هوشمند رادار بر اساس مشخصات رزومه توسط Gemini"
          >
            {isAiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-200" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>{isAiLoading ? "تحلیل همتا با Gemini..." : "تحلیل مجدد همتای آلمانی"}</span>
          </button>

          <button
            onClick={() => setIsFineTuningOpen(!isFineTuningOpen)}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer border ${
              isFineTuningOpen
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                : "bg-slate-800/80 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800"
            }`}
            title="شخصی‌سازی نمرات مهارت‌های خود"
          >
            <Sliders className="w-4 h-4 text-indigo-300" />
            <span>تنظیم نمرات</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Chips Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">ضریب تطابق کلی</div>
            <div className="text-sm font-black text-white">{analysisMetrics.overallMatchPct}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">نقاط قوت (تطابق کامل)</div>
            <div className="text-sm font-black text-emerald-400">{analysisMetrics.strongCount} مهارت</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">شکاف‌های نیازمند تقویت</div>
            <div className="text-sm font-black text-amber-400">{analysisMetrics.gapCount} مهارت</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">رنج حقوقی میانگین</div>
            <div className="text-xs font-bold text-sky-300 truncate">{selectedRole.avgSalaryRange}</div>
          </div>
        </div>
      </div>

      {/* German Employer Duties and Expectations in Germany */}
      {selectedRole.germanEmployerDuties && selectedRole.germanEmployerDuties.length > 0 && (
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4 md:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>شرح وظایف و کارهایی که کارفرما در آلمان انتظار دارد انجام دهید ({selectedRole.titleDe}):</span>
            </h4>
            {selectedRole.kldbCode && (
              <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-500/30 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                {selectedRole.kldbCode}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            بررسی تخصصی بازار کار آلمان نشان می‌دهد کارفرمایان و اپراتورها انتظار تسلط عملیاتی بر وظایف زیر را در محیط کار واقعی دارند:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {selectedRole.germanEmployerDuties.map((duty, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-200 leading-relaxed font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{duty}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Match Highlights & Recommendations */}
      {selectedRole.overallMatchSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-purple-950/25 via-slate-950 to-indigo-950/25 border border-purple-500/25 rounded-2xl p-4 md:p-5">
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>نقاط قوت کلیدی شما:</span>
            </h5>
            <ul className="text-xs text-slate-300 space-y-1.5 pr-1">
              {selectedRole.overallMatchSummary.topStrengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>شکاف‌های فنی اولویت‌دار:</span>
            </h5>
            <ul className="text-xs text-slate-300 space-y-1.5 pr-1">
              {selectedRole.overallMatchSummary.criticalGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>استانداردها و گواهی‌های آلمان:</span>
            </h5>
            <ul className="text-xs text-slate-300 space-y-1.5 pr-1">
              {selectedRole.overallMatchSummary.priorityCertificatesDe.map((cert, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-400 font-bold">→</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
            {selectedRole.overallMatchSummary.germanCvOptimizationTip && (
              <p className="text-[11px] text-indigo-200/90 pt-2 border-t border-slate-800 leading-relaxed font-bold">
                💡 <strong>نکته رزومه:</strong> {selectedRole.overallMatchSummary.germanCvOptimizationTip}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Fine-Tuning Drawer / Sliders (Collapsible) */}
      {isFineTuningOpen && (
        <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 md:p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">تنظیم سطح خوداظهاری مهارت‌های فنی</h4>
            </div>
            <button
              onClick={handleResetScores}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              بازنشانی به مقادیر پیش‌فرض
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customSkills.map(skill => (
              <div key={skill.id} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[170px]">{skill.name}</span>
                  <span className="text-indigo-400 font-black">{skill.userScore}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="2"
                  value={skill.userScore}
                  onChange={e => handleSkillScoreChange(skill.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>میانگین آلمان: {skill.germanBenchmark}%</span>
                  <span
                    className={
                      skill.userScore >= skill.germanBenchmark
                        ? "text-emerald-400 font-bold"
                        : "text-amber-400 font-bold"
                    }
                  >
                    {skill.userScore >= skill.germanBenchmark
                      ? "تطابق کامل ✓"
                      : `فاصله: ${skill.germanBenchmark - skill.userScore}%-`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: D3 Radar Chart + Interactive Skill Detail Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols on LG): D3 Radar Canvas */}
        <div
          ref={containerRef}
          className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-950/70 p-4 sm:p-6 rounded-2xl border border-slate-800 relative min-h-[380px]"
        >
          {/* Radar Chart Legend */}
          <div className="flex items-center justify-center gap-6 mb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 border border-indigo-300 shadow-sm" />
              <span className="text-slate-200 font-bold">سطح مهارتی شما</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border-2 border-dashed border-emerald-400" />
              <span className="text-emerald-300 font-bold">میانگین نیاز آلمان</span>
            </div>
          </div>

          {/* D3 SVG Container */}
          <div className="w-full flex items-center justify-center">
            <svg ref={svgRef} className="overflow-visible" />
          </div>

          <div className="text-[10px] text-slate-500 text-center mt-2 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" />
            <span>برای بررسی جزییات و برنامه یادگیری، روی رأس‌ها یا شاخص‌ها کلیک کنید.</span>
          </div>
        </div>

        {/* Right Column (6 Cols on LG): Selected Skill Deep-Dive & Action Cards */}
        <div className="lg:col-span-6 space-y-4">
          {activeSkill ? (
            <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
              {/* Active Skill Title & Badges */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-indigo-400 font-mono font-bold">{activeSkill.nameEn}</div>
                  <h4 className="text-base font-black text-white">{activeSkill.name}</h4>
                </div>

                <div className="text-left shrink-0">
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      activeSkill.userScore >= activeSkill.germanBenchmark
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    }`}
                  >
                    {activeSkill.userScore >= activeSkill.germanBenchmark ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>آماده و منطبق ({activeSkill.userScore}%)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>فاصله: {activeSkill.germanBenchmark - activeSkill.userScore}%-</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Skill Description */}
              <p className="text-xs text-slate-300 leading-relaxed">{activeSkill.description}</p>

              {/* German Market Reality Card */}
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <Award className="w-4 h-4" />
                  <span>انتظار کارفرمایان آلمانی (German Industry Context):</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 font-medium">{activeSkill.germanContext}</p>
              </div>

              {/* Concrete Upskilling Action Tip */}
              <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>راهکار عملی پر کردن شکاف (Upskilling Recommendation):</span>
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-100 font-medium">
                  {activeSkill.actionRecommendation}
                </p>
              </div>

              {/* Comparison Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-indigo-400">سطح شما: {activeSkill.userScore}%</span>
                  <span className="text-emerald-400">نیاز استاندارد آلمان: {activeSkill.germanBenchmark}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex relative">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${activeSkill.userScore}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-emerald-400 z-10"
                    style={{ left: `${activeSkill.germanBenchmark}%` }}
                    title={`استاندارد آلمان: ${activeSkill.germanBenchmark}%`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              یک مهارت را برای مشاهده تحلیل دقیق انتخاب کنید.
            </div>
          )}

          {/* Quick Skill Selector Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {customSkills.map(skill => {
              const isSelected = activeSkillId === skill.id;
              const hasGap = skill.userScore < skill.germanBenchmark - 5;
              return (
                <button
                  key={skill.id}
                  onClick={() => setActiveSkillId(skill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md scale-102"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hasGap ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                    }`}
                  />
                  <span>{skill.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Insights: Comprehensive Roadmap Table */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>جدول مقایسه‌ای الزامات فنی و سرفصل‌های مصاحبه فنی برای پوزیشن {selectedRole.titleDe}</span>
          </h4>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={handleOpenPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-sky-600/30 cursor-pointer"
              title="مشاهده پیش‌نمایش گزارش جامع قبل از چاپ"
            >
              <Eye className="w-3.5 h-3.5 text-white" />
              <span>پیش‌نمایش چاپ</span>
            </button>

            <button
              onClick={handlePrintUnifiedReport}
              disabled={isPrintingUnified}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
              title="چاپ کامل رادار مهارتی به همراه این جدول (گزارش جامع دوصفحه‌ای)"
            >
              {isPrintingUnified ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-200" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-indigo-200" />
              )}
              <span>{isPrintingUnified ? "در حال آماده‌سازی..." : "چاپ جامع (رادار + جدول)"}</span>
            </button>

            <button
              onClick={handlePrintInterviewTable}
              disabled={isPrintingTable}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
              title="چاپ مستقیم این جدول و سرفصل‌های مصاحبه فنی (PDF)"
            >
              {isPrintingTable ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-100" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-emerald-100" />
              )}
              <span>{isPrintingTable ? "در حال آماده‌سازی..." : "چاپ مستقیم این جدول (PDF)"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic German Technical Interview Culture Callout */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>اصول کلیدی موفقیت در مصاحبه‌های فنی آلمان (German Technical Interview Culture) - پوزیشن {selectedRole.titleDe}:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
            <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-lg p-2.5">
              <strong className="text-emerald-100 block mb-1">{liveInterviewAdvice.pillar1Title}</strong>
              <p className="text-emerald-300/90">{liveInterviewAdvice.pillar1Desc}</p>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-lg p-2.5">
              <strong className="text-emerald-100 block mb-1">{liveInterviewAdvice.pillar2Title}</strong>
              <p className="text-emerald-300/90">{liveInterviewAdvice.pillar2Desc}</p>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-lg p-2.5">
              <strong className="text-emerald-100 block mb-1">{liveInterviewAdvice.pillar3Title}</strong>
              <p className="text-emerald-300/90">{liveInterviewAdvice.pillar3Desc}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-2.5 pr-2">سرفصل فنی</th>
                <th className="pb-2.5 px-2 text-center">سطح شما</th>
                <th className="pb-2.5 px-2 text-center">استاندارد آلمان</th>
                <th className="pb-2.5 px-2 text-center">وضعیت</th>
                <th className="pb-2.5 pl-2">راهکار اولویت‌دار جهت پذیرش در جاب‌آفر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {customSkills.map(skill => {
                const delta = skill.germanBenchmark - skill.userScore;
                const isReady = delta <= 0;
                return (
                  <tr key={skill.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3 pr-2 font-bold text-white">
                      <div>{skill.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{skill.nameEn}</div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-indigo-400">{skill.userScore}%</td>
                    <td className="py-3 px-2 text-center font-bold text-emerald-400">{skill.germanBenchmark}%</td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isReady
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {isReady ? "آماده جاب‌آفر" : `${delta}%- نیاز به تقویت`}
                      </span>
                    </td>
                    <td className="py-3 pl-2 text-slate-300 text-[11px] leading-relaxed">
                      {skill.actionRecommendation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRINT PREVIEW MODAL (Full Dossier: Skills Radar & Interview Matrix) */}
      {/* ========================================================= */}
      {isPreviewModalOpen && previewSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>پیش‌نمایش چاپ گزارش جامع ارزیابی مهارتی و الزامات فنی</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      نسخه زنده و تعاملی
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    پوزیشن: {previewSnapshot.role.title} ({previewSnapshot.role.titleDe}) • کد فدرال KldB: {previewSnapshot.role.kldbCode || "مطابق رگولاتوری"}
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                {/* Page Filter Tabs */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setPreviewTab("all")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      previewTab === "all"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    هر دو صفحه (سند جامع)
                  </button>
                  <button
                    onClick={() => setPreviewTab("page1")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      previewTab === "page1"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    صفحه ۱ (رادار)
                  </button>
                  <button
                    onClick={() => setPreviewTab("page2")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      previewTab === "page2"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    صفحه ۲ (جدول الزامات)
                  </button>
                </div>

                {/* Direct Print Button from Inside Modal */}
                <button
                  onClick={handlePrintUnifiedReport}
                  disabled={isPrintingUnified}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
                  title="چاپ فیزیکی یا ذخیره PDF مستقیم"
                >
                  {isPrintingUnified ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Printer className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>{isPrintingUnified ? "در حال ارسال..." : "چاپ مستقیم (PDF)"}</span>
                </button>

                {/* Close Modal Button */}
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700"
                  title="بستن پیش‌نمایش"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: High-Fidelity Paper Simulation */}
            <div className="overflow-y-auto p-3 sm:p-6 space-y-6 bg-slate-950/70 text-slate-100 text-right">
              {/* Note / Hint for User */}
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 flex items-start sm:items-center justify-between gap-3 text-sky-200 text-xs">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    این پنجره نمایی دقیق از سندی است که هنگام کلیک بر روی <strong>«چاپ مستقیم (PDF)»</strong> خروجی گرفته خواهد شد. داده‌ها مستقیماً از اسلایدرها و وضعیت زنده جاری بارگذاری شده‌اند.
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/50 text-sky-300 shrink-0">
                  {previewSnapshot.skills.length} مهارت ارزیابی‌شده
                </span>
              </div>

              {/* ======================================================== */}
              {/* SIMULATED PAGE 1: D3 Radar & Skills Gap Analysis */}
              {/* ======================================================== */}
              {(previewTab === "all" || previewTab === "page1") && (
                <div className="bg-white rounded-xl shadow-2xl border border-slate-300 p-5 sm:p-8 space-y-4 max-w-4xl mx-auto text-slate-900 transition-all font-sans relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800"></div>

                  {/* Header of Page 1 */}
                  <div className="border-b-2 border-indigo-700 pb-3 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-indigo-950 m-0">
                        بخش ۱: تحلیل مهارتی D3.js (Skills Gap Analysis & Tech Stack Radar)
                      </h4>
                      <p className="text-xs text-indigo-700 font-bold mt-1">
                        تحلیل شکاف مهارتی بر مبنای شغل همتای استاندارد در آلمان ({previewSnapshot.role.titleDe})
                      </p>
                    </div>
                    <div className="text-left text-[11px] text-slate-500 leading-tight font-mono shrink-0">
                      <div>کد گزارش: <strong className="text-slate-800">{previewSnapshot.refNumber}</strong></div>
                      <div>تاریخ: <strong className="text-slate-800">{previewSnapshot.printDate}</strong></div>
                      <div>صفحه: <strong className="text-indigo-700">۱ از ۲</strong></div>
                    </div>
                  </div>

                  {/* Candidate Profile Metadata */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">نام متقاضی:</span>
                      <strong className="text-slate-900">{previewSnapshot.candidateName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">عنوان شغل هدف:</span>
                      <strong className="text-indigo-700">{previewSnapshot.role.title}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">همتای رسمی آلمانی:</span>
                      <strong className="text-slate-900 font-mono text-[11px]">{previewSnapshot.role.titleDe}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">کد طبقه‌بندی شغلی (KldB):</span>
                      <strong className="text-slate-900 font-mono">{previewSnapshot.role.kldbCode || "استاندارد فدرال"}</strong>
                    </div>
                  </div>

                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-indigo-50/80 border border-indigo-200 rounded-lg p-2.5 text-center">
                      <div className="text-lg font-black text-indigo-800">{previewSnapshot.metrics.overallMatchPct}%</div>
                      <div className="text-[10px] text-indigo-950 font-bold">شاخص تطابق کلی با استاندارد</div>
                    </div>
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5 text-center">
                      <div className="text-lg font-black text-emerald-800">{previewSnapshot.metrics.strongCount} مهارت</div>
                      <div className="text-[10px] text-emerald-950 font-bold">تطابق کامل / آماده جاب‌آفر</div>
                    </div>
                    <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 text-center">
                      <div className="text-lg font-black text-amber-800">{previewSnapshot.metrics.gapCount} مهارت</div>
                      <div className="text-[10px] text-amber-950 font-bold">شکاف نیازمند تقویت و تمرین</div>
                    </div>
                    <div className="bg-sky-50/80 border border-sky-200 rounded-lg p-2.5 text-center">
                      <div className="text-sm font-black text-sky-800 leading-tight mt-1">{previewSnapshot.role.avgSalaryRange}</div>
                      <div className="text-[10px] text-sky-950 font-bold mt-1">میانگین رنج درآمدی در آلمان</div>
                    </div>
                  </div>

                  {/* Radar Box Representation */}
                  <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800 text-white">
                    <div className="text-xs font-bold text-sky-300 mb-2 flex items-center justify-center gap-2">
                      <Target className="w-3.5 h-3.5 text-sky-400" />
                      <span>دیاگرام رادار چندمحوره تطبیق مهارت‌های متقاضی در برابر بنچ‌مارک کارفرمای آلمانی</span>
                    </div>

                    {previewSnapshot.radarSvgMarkup ? (
                      <div
                        className="flex items-center justify-center my-2 max-h-[300px] overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: previewSnapshot.radarSvgMarkup }}
                      />
                    ) : (
                      <div className="py-12 text-slate-400 text-xs">دیاگرام رادار بر مبنای داده‌های مهارتی آماده چاپ است.</div>
                    )}

                    <div className="flex items-center justify-center gap-4 text-[11px] text-slate-300 mt-2 border-t border-slate-800 pt-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                        <span>سطح فعلی متقاضی (User Score)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 border-t-2 border-dashed border-emerald-400 inline-block"></span>
                        <span>استاندارد کارفرمای آلمانی (Benchmark)</span>
                      </span>
                    </div>
                  </div>

                  {/* Three Strategy Pillars */}
                  {previewSnapshot.role.overallMatchSummary && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-emerald-50/90 border border-emerald-200 rounded-lg p-3 text-xs">
                        <strong className="text-emerald-900 block font-bold mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>نقاط قوت کلیدی شما:</span>
                        </strong>
                        <ul className="list-disc list-inside space-y-1 text-emerald-950 text-[11px] leading-relaxed">
                          {previewSnapshot.role.overallMatchSummary.topStrengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 text-xs">
                        <strong className="text-amber-900 block font-bold mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>اولویت‌های رفع شکاف:</span>
                        </strong>
                        <ul className="list-disc list-inside space-y-1 text-amber-950 text-[11px] leading-relaxed">
                          {previewSnapshot.role.overallMatchSummary.criticalGaps.map((g, idx) => (
                            <li key={idx}>{g}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-sky-50/90 border border-sky-200 rounded-lg p-3 text-xs">
                        <strong className="text-sky-900 block font-bold mb-1.5 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-sky-700" />
                          <span>مدارک و الزامات آلمان:</span>
                        </strong>
                        <ul className="list-disc list-inside space-y-1 text-sky-950 text-[11px] leading-relaxed">
                          {previewSnapshot.role.overallMatchSummary.priorityCertificatesDe.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* CV Tip */}
                  {previewSnapshot.role.overallMatchSummary?.germanCvOptimizationTip && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 text-xs text-indigo-950 leading-relaxed">
                      <strong className="text-indigo-900">💡 راهبرد بهینه‌سازی رزومه آلمانی (Lebenslauf): </strong>
                      {previewSnapshot.role.overallMatchSummary.germanCvOptimizationTip}
                    </div>
                  )}

                  {/* Page 1 Footer */}
                  <div className="border-t border-slate-200 pt-2 text-center text-[10px] text-slate-500">
                    صفحه ۱ از ۲ | سامانه ارزیابی هوشمند و کاریابی آلمان | بخش اول: تحلیل مهارتی D3.js و دیاگرام رادار
                  </div>
                </div>
              )}

              {/* Page Break Separator in Full View */}
              {previewTab === "all" && (
                <div className="flex items-center justify-center gap-3 py-1">
                  <div className="h-px bg-slate-700 flex-1 max-w-xs"></div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    برش صفحه و ورود به بخش دوم سند (صفحه ۲)
                  </span>
                  <div className="h-px bg-slate-700 flex-1 max-w-xs"></div>
                </div>
              )}

              {/* ======================================================== */}
              {/* SIMULATED PAGE 2: Technical Interview Requirements Matrix */}
              {/* ======================================================== */}
              {(previewTab === "all" || previewTab === "page2") && (
                <div className="bg-white rounded-xl shadow-2xl border border-slate-300 p-5 sm:p-8 space-y-4 max-w-4xl mx-auto text-slate-900 transition-all font-sans relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700"></div>

                  {/* Header of Page 2 */}
                  <div className="border-b-2 border-emerald-600 pb-3 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-emerald-950 m-0">
                        بخش ۲: جدول مقایسه‌ای الزامات فنی و سرفصل‌های مصاحبه فنی برای پوزیشن
                      </h4>
                      <p className="text-xs text-emerald-700 font-bold mt-1">
                        Technical Competencies & Interview Preparation Matrix - {previewSnapshot.role.titleDe}
                      </p>
                    </div>
                    <div className="text-left text-[11px] text-slate-500 leading-tight font-mono shrink-0">
                      <div>کد گزارش: <strong className="text-slate-800">{previewSnapshot.refNumber}</strong></div>
                      <div>تاریخ: <strong className="text-slate-800">{previewSnapshot.printDate}</strong></div>
                      <div>صفحه: <strong className="text-emerald-700">۲ از ۲</strong></div>
                    </div>
                  </div>

                  {/* Interview Culture Box */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1.5">
                    <strong className="text-emerald-900 block font-bold">
                      🧭 اصول کلیدی موفقیت در مصاحبه‌های فنی شرکت‌های آلمانی (German Technical Interview Culture):
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] leading-relaxed">
                      <div>
                        <strong>{previewModalAdvice?.pillar1Title || "۱. تسلط تخصصی:"}</strong> {previewModalAdvice?.pillar1Desc || "پاسخ ساخت‌یافته و دقیق به پرسش‌های کاربردی در مصاحبه."}
                      </div>
                      <div>
                        <strong>{previewModalAdvice?.pillar2Title || "۲. استانداردهای آلمان:"}</strong> {previewModalAdvice?.pillar2Desc || "پایبندی به استانداردها و قوانین نظارتی فدرال."}
                      </div>
                      <div>
                        <strong>{previewModalAdvice?.pillar3Title || "۳. صراحت و مستندسازی:"}</strong> {previewModalAdvice?.pillar3Desc || "مستندسازی دقیق و کار تیمی موثر."}
                      </div>
                    </div>
                  </div>

                  {/* Table Representation */}
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-right text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-emerald-900 text-white font-bold">
                          <th className="p-2.5 border-b border-emerald-950">سرفصل مهارتی</th>
                          <th className="p-2.5 text-center border-b border-emerald-950">سطح شما</th>
                          <th className="p-2.5 text-center border-b border-emerald-950">بنچ‌مارک آلمان</th>
                          <th className="p-2.5 text-center border-b border-emerald-950">وضعیت شکاف</th>
                          <th className="p-2.5 border-b border-emerald-950">بستر کاربرد در آلمان</th>
                          <th className="p-2.5 border-b border-emerald-950">راهبرد قبولی در مصاحبه</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {previewSnapshot.skills.map((skill, idx) => {
                          const delta = skill.germanBenchmark - skill.userScore;
                          const isReady = delta <= 0;
                          const isCritical = delta > 15;
                          return (
                            <tr key={skill.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                              <td className="p-2.5 font-bold text-slate-900">
                                <div>{skill.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{skill.nameEn}</div>
                              </td>
                              <td className="p-2.5 text-center font-bold text-indigo-700">{skill.userScore}%</td>
                              <td className="p-2.5 text-center font-bold text-emerald-700">{skill.germanBenchmark}%</td>
                              <td className="p-2.5 text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isReady
                                      ? "bg-emerald-100 text-emerald-800"
                                      : isCritical
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {isReady ? "آماده جاب‌آفر" : `${delta}%- تقویت`}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-700 text-[10.5px] leading-relaxed max-w-[200px]">
                                {skill.germanContext}
                              </td>
                              <td className="p-2.5 text-emerald-900 text-[10.5px] font-medium leading-relaxed max-w-[220px]">
                                {skill.actionRecommendation}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Interview Pitch Tip */}
                  {previewSnapshot.role.overallMatchSummary?.germanCvOptimizationTip && (
                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-2.5 text-xs text-sky-950 leading-relaxed">
                      <strong className="text-sky-900">💡 راهبرد بهینه‌سازی رزومه و مصاحبه کاری در آلمان: </strong>
                      {previewSnapshot.role.overallMatchSummary.germanCvOptimizationTip}
                    </div>
                  )}

                  {/* Page 2 Footer */}
                  <div className="border-t border-slate-200 pt-2 text-center text-[10px] text-slate-500">
                    صفحه ۲ از ۲ | سامانه ارزیابی هوشمند و کاریابی آلمان | تدوین‌شده بر پایه استاندارد KldB فدرال و انتظارات کارفرمایان ۲۰۲۶
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 border-t border-slate-800 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>گزارش تایید شده و منطبق با تغییرات لحظه‌ای نمرات و بنچ‌مارک‌های فدرال آلمان</span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
                >
                  بستن پیش‌نمایش
                </button>

                <button
                  onClick={handlePrintUnifiedReport}
                  disabled={isPrintingUnified}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 active:scale-95 transition cursor-pointer disabled:opacity-50"
                >
                  {isPrintingUnified ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Printer className="w-4 h-4 text-white" />
                  )}
                  <span>{isPrintingUnified ? "در حال ارسال به چاپگر..." : "تایید نهایی و چاپ گزارش (PDF)"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
