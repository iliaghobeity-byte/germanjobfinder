import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Compass, 
  Briefcase, 
  TrendingUp, 
  Globe2, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Copy, 
  ShieldAlert, 
  Zap, 
  Calendar, 
  ChevronRight, 
  Users, 
  Award,
  BookOpen,
  FileDown,
  Printer,
  Loader2,
  Wrench,
  FileCheck,
  GraduationCap,
  ShieldCheck,
  Code2,
  Database,
  Cpu,
  Target
} from "lucide-react";
import { 
  getClientJobComparison, 
  JobComparisonData, 
  ComparisonItem, 
  SeniorityLevelData, 
  SeniorityBreakdown, 
  IndustryVariation, 
  DailyRoutineItem, 
  GermanPhrase,
  GermanJobDescription,
  GermanPeerBenchmark,
  SoftwareToolItem,
  DeliverableReportItem,
  StandardNormItem
} from "../utils/jobComparisonData";
import { formatPrintDocumentTitle, triggerPrintWithTitle } from "../utils";

interface JobComparisonWidgetProps {
  userProfile?: {
    name?: string;
    field?: string;
    experience?: number;
    germanLevel?: string;
    skills?: string;
    education?: string;
  };
  onExportPdf?: (data?: JobComparisonData, field?: string, seniority?: string) => void;
  onDataChange?: (data: JobComparisonData, field: string) => void;
  onFieldChange?: (field: string) => void;
}

export const JobComparisonWidget: React.FC<JobComparisonWidgetProps> = ({ 
  userProfile, 
  onExportPdf,
  onDataChange,
  onFieldChange
}) => {
  const defaultField = userProfile?.field || "فناوری اطلاعات و مهندسی نرم‌افزار";
  const [field, setField] = useState<string>(defaultField);
  const [seniority, setSeniority] = useState<string>("mid");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSeniorityTab, setActiveSeniorityTab] = useState<"junior" | "mid" | "senior" | "lead">("mid");
  const [activeTabSection, setActiveTabSection] = useState<"all" | "jobDesc" | "tools" | "peer" | "matrix">("all");
  
  // Initialize with rich baseline data immediately
  const [data, setData] = useState<JobComparisonData>(() =>
    getClientJobComparison({
      field: defaultField,
      seniority: "mid",
      industry: "all",
      experience: userProfile?.experience || 3,
      germanLevel: userProfile?.germanLevel || "B1",
      skills: userProfile?.skills || ""
    })
  );
  const [error, setError] = useState<string | null>(null);

  // Sync field when userProfile changes externally
  useEffect(() => {
    if (userProfile?.field && userProfile.field !== field) {
      setField(userProfile.field);
      const fallback = getClientJobComparison({
        field: userProfile.field,
        seniority,
        industry: selectedIndustry,
        experience: userProfile?.experience || 3,
        germanLevel: userProfile?.germanLevel || "B1",
        skills: userProfile?.skills || ""
      });
      setData(fallback);
      onDataChange?.(fallback, userProfile.field);
    }
  }, [userProfile?.field]);

  const fetchData = async (targetField = field, targetSeniority = seniority, targetIndustry = selectedIndustry) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/compare-job-expectations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: targetField,
          seniority: targetSeniority,
          industry: targetIndustry === "all" ? "عمومی و تخصصی" : targetIndustry,
          experience: userProfile?.experience || 3,
          germanLevel: userProfile?.germanLevel || "B1",
          skills: userProfile?.skills || ""
        })
      });

      if (!res.ok) {
        throw new Error(`خطا در دریافت اطلاعات هوش مصنوعی: ${res.status}`);
      }

      const json = await res.json();
      const payload = json.data || json;
      if (payload && (payload.summaryInsight || payload.comparisonTable)) {
        // Merge with rich domain fallback if some deep sub-fields are missing
        const fallbackBaseline = getClientJobComparison({
          field: targetField,
          seniority: targetSeniority,
          industry: targetIndustry,
          experience: userProfile?.experience || 3,
          germanLevel: userProfile?.germanLevel || "B1",
          skills: userProfile?.skills || ""
        });

        const finalData = {
          ...fallbackBaseline,
          ...payload,
          jobDescriptionInGermany: payload.jobDescriptionInGermany || fallbackBaseline.jobDescriptionInGermany,
          germanPeerBenchmark: payload.germanPeerBenchmark || fallbackBaseline.germanPeerBenchmark
        };
        setData(finalData);
        onDataChange?.(finalData, targetField);
        onFieldChange?.(targetField);
      } else {
        const fallback = getClientJobComparison({
          field: targetField,
          seniority: targetSeniority,
          industry: targetIndustry,
          experience: userProfile?.experience || 3,
          germanLevel: userProfile?.germanLevel || "B1",
          skills: userProfile?.skills || ""
        });
        setData(fallback);
        onDataChange?.(fallback, targetField);
        onFieldChange?.(targetField);
      }
    } catch (err: any) {
      console.warn("Using client-side comparative baseline:", err?.message || err);
      const fallback = getClientJobComparison({
        field: targetField,
        seniority: targetSeniority,
        industry: targetIndustry,
        experience: userProfile?.experience || 3,
        germanLevel: userProfile?.germanLevel || "B1",
        skills: userProfile?.skills || ""
      });
      setData(fallback);
      onDataChange?.(fallback, targetField);
      onFieldChange?.(targetField);
    } finally {
      setLoading(false);
    }
  };

  // Direct print of the currently active job comparison analysis
  const handleDirectPrint = async () => {
    setIsPrinting(true);
    try {
      let logoBase64 = "";
      try {
        const res = await fetch("/api/logo-base64");
        const json = await res.json();
        if (json.success) logoBase64 = json.base64;
      } catch {
        // ignore
      }

      const candidateName = userProfile?.name?.trim() || "متقاضی محترم مهاجرت کاری";
      const refNumber = `DE-JOBCOMP-${Math.floor(100000 + Math.random() * 900000)}`;
      const printDate = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date());

      const seniorityText = 
        seniority === "junior" ? "Junior (۱-۲ سال سابقه)" :
        seniority === "senior" ? "Senior (۵+ سال سابقه)" :
        seniority === "lead" ? "Lead / Architect (راهبر فنی و معماری)" : "Mid-Level (۳-۵ سال سابقه)";

      const industryText = 
        selectedIndustry === "Mittelstand" ? "شرکت‌های متوسط و تخصصی (Mittelstand)" :
        selectedIndustry === "Großkonzerne" ? "صنایع و هولدینگ‌های بزرگ (Großkonzerne)" :
        selectedIndustry === "Startups" ? "استارتاپ‌ها (Startups)" :
        selectedIndustry === "Public" ? "بخش دولتی و خدمات عمومی (Öffentlicher Dienst)" : "دیدگاه جامع و یکپارچه بازار کار آلمان";

      const printDocTitle = formatPrintDocumentTitle("مقایسه فرصت‌های شغلی آلمان", userProfile?.name);

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
      font-size: 8.5pt;
      line-height: 1.5;
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
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .page-break {
      page-break-before: always;
      break-before: always;
    }
    .header-box {
      border-bottom: 2.5px solid #4338ca;
      padding-bottom: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-size: 13pt;
      font-weight: 900;
      color: #1e1b4b;
      margin: 0 0 3px 0;
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
      margin-bottom: 12px;
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
    .section-header {
      background: #eef2ff;
      border-right: 4px solid #4f46e5;
      padding: 5px 10px;
      margin: 12px 0 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0 4px 4px 0;
    }
    .section-title {
      font-size: 9pt;
      font-weight: 800;
      color: #1e1b4b;
    }
    .section-badge {
      font-size: 7pt;
      font-weight: bold;
      background: #4338ca;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .summary-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 5px;
      padding: 8px 10px;
      margin-bottom: 10px;
      font-size: 8pt;
      color: #14532d;
      line-height: 1.6;
    }
    .kldb-card {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 10px;
      border-radius: 5px;
      margin-bottom: 8px;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-bottom: 10px;
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
    .badge-high {
      background: #fee2e2;
      color: #991b1b;
      padding: 1px 4px;
      border-radius: 2px;
      font-weight: bold;
      font-size: 6.5pt;
    }
    .badge-med {
      background: #fef3c7;
      color: #92400e;
      padding: 1px 4px;
      border-radius: 2px;
      font-weight: bold;
      font-size: 6.5pt;
    }
    .footer-bar {
      margin-top: 15px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      text-align: center;
      font-size: 7pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  ${logoBase64 ? `<img class="watermark" src="data:image/jpeg;base64,${logoBase64}" />` : ""}

  <div class="header-box">
    <div>
      <h1 class="header-title">گزارش تخصصی ارزیابی شغلی و مقایسه با همتای آلمانی</h1>
      <p class="header-subtitle">Deep German Workplace Evaluation & Peer Benchmark</p>
    </div>
    <div class="meta-box">
      <div><strong>شماره پرونده:</strong> ${refNumber}</div>
      <div><strong>تاریخ گزارش:</strong> ${printDate}</div>
    </div>
  </div>

  <div class="profile-card avoid-break">
    <div>
      <div class="profile-item-label">متقاضی ارزیابی:</div>
      <div class="profile-item-val">${candidateName}</div>
    </div>
    <div>
      <div class="profile-item-label">عنوان شغلی بررسی‌شده:</div>
      <div class="profile-item-val" style="color: #4338ca;">${field}</div>
    </div>
    <div>
      <div class="profile-item-label">سطح ارشدیت:</div>
      <div class="profile-item-val">${seniorityText}</div>
    </div>
    <div>
      <div class="profile-item-label">ساختار صنعت هدف:</div>
      <div class="profile-item-val">${industryText}</div>
    </div>
  </div>

  ${data.summaryInsight ? `
    <div class="summary-card avoid-break">
      <strong style="color: #166534;">بینش تحلیلی و استراتژی ورود به بازار کار آلمان:</strong><br/>
      ${data.summaryInsight}
    </div>
  ` : ""}

  ${data.jobDescriptionInGermany ? `
    <div class="avoid-break" style="margin-top: 10px;">
      <div class="section-header">
        <span class="section-title">۱. شرح دقیق شغل در آلمان و تکالیف اجرایی (Tätigkeitsprofil)</span>
        <span class="section-badge">کد شغلی رسمی: ${data.jobDescriptionInGermany.kldbCode}</span>
      </div>

      <div class="kldb-card">
        <div style="font-size: 7.2pt; color: #93c5fd;">عنوان رسمی شغلی در طبقه‌بندی مشاغل آلمان (KldB):</div>
        <div style="font-size: 9.5pt; font-weight: bold; font-family: monospace; direction: ltr; text-align: left; margin: 2px 0;">
          ${data.jobDescriptionInGermany.officialTitleDe}
        </div>
        <div style="font-size: 7.6pt; color: #cbd5e1; margin-top: 4px; line-height: 1.4;">
          ${data.jobDescriptionInGermany.generalScope}
        </div>
      </div>

      <div style="font-size: 8pt; font-weight: bold; color: #1e293b; margin: 6px 0 4px 0;">وظایف اجرایی و کارهای روزمره در محیط کار:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
        ${data.jobDescriptionInGermany.detailedTasksAndDuties.map((task, idx) => `
          <div style="border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px; background: #f8fafc;">
            <div style="font-size: 7.8pt; font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">
              ${idx + 1}. ${task.taskGroup}
            </div>
            <div style="font-size: 7pt; color: #475569; margin-bottom: 3px;">${task.description}</div>
            <ul style="margin: 0; padding-right: 12px; font-size: 6.8pt; color: #334155;">
              ${task.subTasks.map(st => `<li>${st}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>

      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; padding: 6px 8px; margin-bottom: 8px;">
        <div style="font-size: 7.8pt; font-weight: bold; color: #92400e; margin-bottom: 3px;">
          انتظارات عملیاتی کارفرمای آلمانی (Erwartungshaltung):
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          ${data.jobDescriptionInGermany.employerExpectations.map(exp => `
            <div style="font-size: 7.2pt; color: #78350f;">• ${exp}</div>
          `).join("")}
        </div>
      </div>
    </div>
  ` : ""}

  ${data.jobDescriptionInGermany && data.jobDescriptionInGermany.softwareAndTools.length > 0 ? `
    <div class="avoid-break" style="margin-top: 10px;">
      <div class="section-header">
        <span class="section-title">۲. ابزارها، نرم‌افزارها و گزارشات تحویلی در سازمان‌های آلمان</span>
        <span class="section-badge">ابزارها و گزارشات</span>
      </div>

      <table class="table-custom">
        <thead>
          <tr>
            <th style="width: 22%;">نرم‌افزار / پلتفرم</th>
            <th style="width: 20%;">دسته‌بندی</th>
            <th style="width: 35%;">کاربرد دقیق در محیط کار آلمان</th>
            <th style="width: 13%; text-align: center;">سطح تسلط</th>
            <th style="width: 10%; text-align: center;">رواج</th>
          </tr>
        </thead>
        <tbody>
          ${data.jobDescriptionInGermany.softwareAndTools.map(tool => `
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

      ${data.jobDescriptionInGermany.deliverablesAndReports.length > 0 ? `
        <div style="font-size: 7.8pt; font-weight: bold; color: #1e293b; margin: 4px 0 2px 0;">گزارشات و خروجی‌های تحویلی الزامی:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 8px;">
          ${data.jobDescriptionInGermany.deliverablesAndReports.map(rep => `
            <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px 7px; background: #ffffff;">
              <div style="display: flex; justify-content: space-between; font-size: 7.3pt; font-weight: bold; color: #0f172a;">
                <span>${rep.reportTitle}</span>
                <span style="font-size: 6.8pt; color: #4338ca; background: #f5f3ff; padding: 1px 4px; border-radius: 2px;">${rep.frequency}</span>
              </div>
              <div style="font-size: 6.8pt; color: #475569; margin: 2px 0;">${rep.description}</div>
              <div style="font-size: 6.5pt; color: #64748b;">قالب: <strong>${rep.formatAndTool}</strong> | تحویل به: <strong>${rep.recipient}</strong></div>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  ` : ""}

  ${data.germanPeerBenchmark ? `
    <div class="avoid-break" style="margin-top: 10px;">
      <div class="section-header">
        <span class="section-title">۳. بنچ‌مارک عمیق همتای آلمانی و استانداردهای صنعتی (German Peer Benchmark)</span>
        <span class="section-badge">استانداردها و دانش انباشته</span>
      </div>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px; margin-bottom: 6px; font-size: 7.3pt; color: #334155; line-height: 1.45;">
        <strong>پروفایل تجربی همتای آلمانی:</strong> ${data.germanPeerBenchmark.peerProfileSummary}
      </div>

      <div style="font-size: 7.8pt; font-weight: bold; color: #1e293b; margin-bottom: 3px;">استانداردها، نورم‌ها و مقررات الزامی در آلمان:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 6px;">
        ${data.germanPeerBenchmark.standardsAndNormsMastery.map(std => `
          <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px 7px; background: #ffffff;">
            <div style="display: flex; justify-content: space-between; font-size: 7.3pt; font-weight: bold; color: #0f172a;">
              <span>${std.standardName}</span>
              <span style="font-size: 6.5pt; background: #fee2e2; color: #991b1b; padding: 1px 4px; border-radius: 2px;">${std.importanceLevel}</span>
            </div>
            <div style="font-size: 6.8pt; color: #475569; margin-top: 2px;">${std.description}</div>
          </div>
        `).join("")}
      </div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 5px 8px; margin-bottom: 8px;">
        <div style="font-size: 7.5pt; font-weight: bold; color: #166534; margin-bottom: 2px;">دانش ضمنی و تجربیات همتای آلمانی:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px;">
          ${data.germanPeerBenchmark.accumulatedExperienceAndTacitKnowledge.map(item => `
            <div style="font-size: 7pt; color: #14532d;">• ${item}</div>
          `).join("")}
        </div>
      </div>
    </div>
  ` : ""}

  <div class="page-break"></div>

  ${data.comparisonTable && data.comparisonTable.length > 0 ? `
    <div class="avoid-break" style="margin-top: 10px;">
      <div class="section-header">
        <span class="section-title">۴. جدول ارزیابی مقایسه‌ای و ماتریس شکاف مهارت‌ها (ایران در برابر آلمان)</span>
        <span class="section-badge">ماتریس شکاف</span>
      </div>

      <table class="table-custom">
        <thead>
          <tr>
            <th style="width: 17%;">محور ارزیابی</th>
            <th style="width: 22%;">رویه متداول در ایران 🇮🇷</th>
            <th style="width: 22%;">انتظار کارفرمای آلمانی 🇩🇪</th>
            <th style="width: 21%;">بنچ‌مارک همتای آلمانی 🇩🇪</th>
            <th style="width: 6%; text-align: center;">شکاف</th>
            <th style="width: 12%;">راهکار جبران</th>
          </tr>
        </thead>
        <tbody>
          ${data.comparisonTable.map((row) => `
            <tr>
              <td><strong>${row.dimension}</strong></td>
              <td style="color: #475569;">${row.iranReality}</td>
              <td style="color: #1e3a8a; font-weight: 500;">${row.germanyExpectation}</td>
              <td style="color: #0f172a;">${row.germanPeerBenchmark || "-"}</td>
              <td style="text-align: center;">
                <span class="${row.gapLevel.includes("زیاد") || row.gapLevel.includes("High") || row.gapLevel.includes("بحرانی") ? "badge-high" : "badge-med"}">
                  ${row.gapLevel}
                </span>
              </td>
              <td style="color: #166534; font-size: 6.8pt;">${row.actionTip}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  ` : ""}

  ${data.dailyRoutine && data.dailyRoutine.length > 0 ? `
    <div class="avoid-break" style="margin-top: 10px;">
      <div class="section-header">
        <span class="section-title">۵. زمان‌بندی یک روز کاری معمول در آلمان (Tagesablauf)</span>
        <span class="section-badge">روتین روزانه</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
        ${data.dailyRoutine.map((step) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 7px; background: #f8fafc;">
            <div style="display: flex; gap: 6px; align-items: center;">
              <span style="font-family: monospace; font-size: 7pt; font-weight: bold; background: #e0e7ff; color: #3730a3; padding: 1px 4px; border-radius: 2px;">${step.time}</span>
              <strong style="font-size: 7.2pt; color: #0f172a;">${step.activity}</strong>
            </div>
            <div style="font-size: 6.8pt; color: #475569; margin-top: 2px;">${step.description}</div>
          </div>
        `).join("")}
      </div>
    </div>
  ` : ""}

  ${data.keyGermanPhrases && data.keyGermanPhrases.length > 0 ? `
    <div class="avoid-break" style="margin-top: 10px;">
      <div class="section-header">
        <span class="section-title">۶. اصطلاحات و مفاهیم کلیدی فرهنگ کار آلمان (Schlüsselbegriffe)</span>
        <span class="section-badge">ادبیات کار</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
        ${data.keyGermanPhrases.map((phrase) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 7px; background: #ffffff;">
            <div style="display: flex; justify-content: space-between; font-size: 7.2pt; font-weight: bold;">
              <span style="font-family: monospace; direction: ltr; color: #1e3a8a;">${phrase.german}</span>
              <span style="color: #475569;">${phrase.persian}</span>
            </div>
            <div style="font-size: 6.8pt; color: #64748b; margin-top: 2px;">${phrase.context}</div>
          </div>
        `).join("")}
      </div>
    </div>
  ` : ""}

  <div class="footer-bar">
    سامانه ارزیابی هوشمند و کاریابی آلمان | گروه شرکت‌های بین‌المللی جهانبان | تدوین‌شده بر پایه استانداردهای کار ۲۰۲۶
  </div>
</body>
</html>`;

      // Create or reuse hidden print iframe
      let iframe = document.getElementById("pdf-print-job-comparison-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "pdf-print-job-comparison-iframe";
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

  const handleCopySummary = () => {
    if (!data) return;
    const text = `تحلیل تطبیقی جامع انتظارات شغلی در آلمان در مقابل ایران (${field}):\n\n${data.summaryInsight}\n\nنکات کلیدی جدول مقایسه‌ای:\n` +
      data.comparisonTable.map((item, idx) => `${idx + 1}. ${item.dimension}\n- ایران: ${item.iranReality}\n- آلمان: ${item.germanyExpectation}\n- راهکار: ${item.actionTip}\n`).join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getGapBadgeClass = (level: string) => {
    if (level.includes("بسیار") || level.includes("خیلی") || level.includes("بحرانی") || level.includes("High")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (level.includes("بالا") || level.includes("زیاد")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  const getImportanceBadgeClass = (level: string) => {
    if (level.includes("حیاتی") || level.includes("Mandatory")) {
      return "bg-rose-100 text-rose-800 border-rose-300";
    }
    if (level.includes("بسیار") || level.includes("High")) {
      return "bg-amber-100 text-amber-800 border-amber-300";
    }
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  };

  return (
    <div id="job-comparison-widget" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Widget Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>تحلیل تطبیقی عمیق و موشکافانه بازار کار آلمان (Deep German Workplace Evaluation)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>گزارش جامع ارزیابی شغلی، انتظارات کارفرمای آلمانی و مقایسه با همتای آلمانی</span>
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              شرح دقیق شغل در آلمان، انتظارات عملیاتی کارفرما، نرم‌افزارهای مورد استفاده در سازمان‌ها، گزارشات تحویلی، بنچ‌مارک عمیق دانش و استانداردهای همتای آلمانی و ماتریس ارزیابی شکاف مهارت‌ها.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDirectPrint}
              disabled={isPrinting || loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
              title="چاپ مستقیم و دریافت فوری نسخه PDF این گزارش ارزیابی"
            >
              {isPrinting ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-100" />
              ) : (
                <Printer className="w-4 h-4 text-emerald-100" />
              )}
              <span>{isPrinting ? "در حال آماده‌سازی چاپ..." : "چاپ مستقیم این گزارش (PDF)"}</span>
            </button>

            {onExportPdf && (
              <button
                onClick={() => onExportPdf(data, field, seniority)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                title="دریافت نسخه رسمی پرونده جامع شامل نقشه راه ۶ ماهه و این گزارش"
              >
                <FileDown className="w-4 h-4 text-indigo-100" />
                <span>پرونده جامع کامل (PDF / Dossier)</span>
              </button>
            )}

            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 text-white font-medium text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
              title="دریافت تحلیل عمیق هوش مصنوعی بر اساس عنوان شغلی و سطوح انتخاب‌شده"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "در حال تحلیل عمیق..." : "به‌روزرسانی تحلیل"}</span>
            </button>

            {data && (
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer"
                title="کپی چکیده تحلیل"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copied ? "کپی شد" : "کپی خلاصه"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              عنوان شغلی / رشته تخصصی:
            </label>
            <div className="relative">
              <input
                type="text"
                value={field}
                onChange={(e) => {
                  const val = e.target.value;
                  setField(val);
                  onFieldChange?.(val);
                }}
                onKeyDown={(e) => e.key === "Enter" && fetchData(field, seniority, selectedIndustry)}
                placeholder="مثلاً: مهندسی مخابرات، برنامه‌نویس React، مهندس مکانیک..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1 mt-2">
              {[
                "مهندسی مخابرات و تست سیگنال",
                "برنامه‌نویسی و مهندسی نرم‌افزار",
                "علوم آزمایشگاهی و میکروبیولوژی",
                "مهندسی مکانیک و مکاترونیک",
                "پرستاری و مراقبت سلامت"
              ].map((roleChip) => (
                <button
                  key={roleChip}
                  type="button"
                  onClick={() => {
                    setField(roleChip);
                    onFieldChange?.(roleChip);
                    fetchData(roleChip, seniority, selectedIndustry);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {roleChip}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              سطح ارشدیت مورد نظر:
            </label>
            <select
              value={seniority}
              onChange={(e) => {
                const val = e.target.value;
                setSeniority(val);
                setActiveSeniorityTab(val as any);
                fetchData(field, val, selectedIndustry);
              }}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="junior">Junior (تازه‌کار / ۱-۲ سال سابقه)</option>
              <option value="mid">Mid-Level (سطح میانی / ۳-۵ سال سابقه)</option>
              <option value="senior">Senior (ارشد تخصصی / ۵+ سال سابقه)</option>
              <option value="lead">Lead / Architect (راهبر فنی و مدیر تیم)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              نوع صنعت و ساختار سازمانی مقصد:
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedIndustry(val);
                fetchData(field, seniority, val);
              }}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">همه صنایع و شرکت‌ها (دیدگاه جامع)</option>
              <option value="Mittelstand">شرکت‌های متوسط و خانوادگی (Mittelstand)</option>
              <option value="Großkonzerne">غول‌های صنعتی و هولدینگ‌ها (Großkonzerne)</option>
              <option value="Startups">استارتاپ‌ها و شرکت‌های مدرن فناوری (Startups)</option>
              <option value="Public">بخش دولتی و خدمات عمومی (Öffentlicher Dienst)</option>
            </select>
          </div>
        </div>

        {/* Section Quick Jump Filter Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap gap-2">
          {[
            { id: "all", label: "نمایش همه بخش‌ها" },
            { id: "jobDesc", label: "۱. شرح شغل و تکالیف در آلمان" },
            { id: "tools", label: "۲. نرم‌افزارها و گزارشات تحویلی" },
            { id: "peer", label: "۳. بنچ‌مارک همتای آلمانی و استانداردها" },
            { id: "matrix", label: "۴. جدول ارزیابی و ماتریس شکاف" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTabSection === tab.id
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-10">
        {loading && !data && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">هوش مصنوعی در حال تحلیل تخصصی بازار کار آلمان است...</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                استخراج وظایف عملیاتی، نرم‌افزارهای سازمانی، گزارشات تحویلی، استانداردهای DIN/ISO و مقایسه دانش همتای آلمانی
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">خطا در دریافت اطلاعات</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              <button
                onClick={() => fetchData()}
                className="mt-2 text-xs font-bold text-rose-900 underline hover:no-underline"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Core Executive Insight Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-50 border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>بینش کلیدی و تغییر پارادایم شغلی: ایران در برابر آلمان</span>
                    <span className="text-xs font-normal text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                      {field}
                    </span>
                  </h3>
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {data.summaryInsight}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: Deep German Job Description, Duties & Employer Expectations */}
            {(activeTabSection === "all" || activeTabSection === "jobDesc") && data.jobDescriptionInGermany && (
              <div className="space-y-6 pt-2 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      <span>۱. شرح شغل دقیق در آلمان و تکالیف اجرایی (Tätigkeitsprofil)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      عنوان رسمی بر پایه رده‌بندی شغلی آلمان (KldB)، وظایف خرد عملیاتی و انتظارات کلیدی کارفرما
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                      {data.jobDescriptionInGermany.kldbCode}
                    </span>
                  </div>
                </div>

                {/* Role Header Card */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs text-indigo-300 font-medium">عنوان رسمی موقعیت شغلی در قراردادهای آلمان:</span>
                      <h4 className="text-base sm:text-lg font-bold text-white font-mono" dir="ltr">
                        {data.jobDescriptionInGermany.officialTitleDe}
                      </h4>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      طبقه‌بندی آژانس فدرال کار (BA)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {data.jobDescriptionInGermany.generalScope}
                  </p>
                </div>

                {/* Detailed Duties Group Grid */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>کارهای اجرایی و وظایف روزمره با توضیحات دقیق عملیاتی:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.jobDescriptionInGermany.detailedTasksAndDuties.map((group, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-all space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                            {idx + 1}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm">{group.taskGroup}</h5>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{group.description}</p>
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          {group.subTasks.map((st, sidx) => (
                            <div key={sidx} className="flex items-start gap-2 text-xs text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                              <span className="leading-relaxed">{st}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employer Expectations Box */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>انتظاراتی که کارفرمای آلمانی بابت کار کردن از شما دارد:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.jobDescriptionInGermany.employerExpectations.map((exp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-amber-900 bg-white/80 p-3 rounded-xl border border-amber-200/70">
                        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                        <span className="leading-relaxed">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: Software Stack & Deliverable Reports */}
            {(activeTabSection === "all" || activeTabSection === "tools") && data.jobDescriptionInGermany && (
              <div className="space-y-6 pt-2 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-indigo-600" />
                      <span>۲. نرم‌افزارهای مورد استفاده و گزارشات تحویلی در سازمان‌های آلمان</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      جعبه ابزار تکنولوژی مورد نیاز کارفرمایان و فرمت اسناد و مستنداتی که باید تحویل دهید
                    </p>
                  </div>
                </div>

                {/* Software Stack Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span>نرم‌افزارها و پلتفرم‌های مورد استفاده در شرکت‌های آلمانی:</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-right text-xs sm:text-sm border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="py-3 px-4 w-[25%]">نام نرم‌افزار / ابزار</th>
                          <th className="py-3 px-4 w-[20%]">دسته‌بندی تخصصی</th>
                          <th className="py-3 px-4 w-[30%]">کاربرد دقیق در آلمان</th>
                          <th className="py-3 px-3 w-[15%] text-center">سطح تسلط لازم</th>
                          <th className="py-3 px-3 w-[10%] text-center">میزان رواج</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.jobDescriptionInGermany.softwareAndTools.map((tool, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900" dir="ltr">
                              {tool.name}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {tool.category}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 leading-relaxed text-xs">
                              {tool.purposeInGermany}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {tool.expectedProficiency}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center text-xs font-semibold text-emerald-700">
                              {tool.popularity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Deliverables and Reports Grid */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span>گزارشات و خروجی‌هایی که موظف به تحویل آنها هستید:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.jobDescriptionInGermany.deliverablesAndReports.map((rep, idx) => (
                      <div key={idx} className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-2">
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{rep.reportTitle}</h5>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            {rep.frequency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                          <span>قالب تحویل: <strong className="text-indigo-900 font-semibold">{rep.formatAndTool}</strong></span>
                          <span>تحویل به: <strong className="text-slate-700 font-semibold">{rep.recipient}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: Deep Benchmark with German Peer & Standards */}
            {(activeTabSection === "all" || activeTabSection === "peer") && data.germanPeerBenchmark && (
              <div className="space-y-6 pt-2 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      <span>۳. مقایسه عمیق با همتای آلمانی (German Peer Benchmark)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      شناخت تمام دانش، تخصص‌های نرم‌افزاری، استانداردهای صنعتی و سوابق اندوخته همتای آلمانی
                    </p>
                  </div>
                </div>

                {/* Peer Profile Card */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                    <Users className="w-4 h-4" />
                    <span>پروفایل و مسیر تجربی همتای آلمانی شما در سازمان:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {data.germanPeerBenchmark.peerProfileSummary}
                  </p>
                </div>

                {/* Standards and Norms Known */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>استانداردها، نورم‌ها و قوانین آلمانی/اروپایی که همتای آلمانی بلد است:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.germanPeerBenchmark.standardsAndNormsMastery.map((std, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-all space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{std.standardName}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getImportanceBadgeClass(std.importanceLevel)}`}>
                            {std.importanceLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{std.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tacit Knowledge & Years of Experience */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>سوابق، درک فرهنگی و دانش نانوشته‌ای که همتای آلمانی در طی سال‌ها بدست آورده است:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.germanPeerBenchmark.accumulatedExperienceAndTacitKnowledge.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialized Domain Knowledge Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>دانش تخصصی مورد نیاز تفکیک‌شده بر اساس حوزه‌ها:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {data.germanPeerBenchmark.specializedKnowledgeAreas.map((domain, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <h5 className="font-bold text-xs text-indigo-950 border-b border-slate-100 pb-1.5">{domain.domain}</h5>
                        <ul className="space-y-1">
                          {domain.coreCompetencies.map((c, cidx) => (
                            <li key={cidx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: Comprehensive Evaluation Matrix Table */}
            {(activeTabSection === "all" || activeTabSection === "matrix") && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-600" />
                      <span>۴. جدول ارزیابی دقیق و ماتریس تحلیل شکاف مهارت‌ها (Evaluation Matrix)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      مقایسه همزمان عملکرد در ایران، انتظار کارفرمای آلمانی، بنچ‌مارک همتای آلمانی و تفاوت استانداردی
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {data.comparisonTable.length} محور ارزیابی دقیق
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                  <table className="w-full text-right text-xs sm:text-sm border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-slate-800 text-white text-xs font-bold border-b border-slate-700">
                        <th className="py-3.5 px-3 w-[15%]">حیطه و محور ارزیابی</th>
                        <th className="py-3.5 px-3 w-[20%] bg-amber-950/40 text-amber-200 border-x border-slate-700">
                          رویه و واقعیت در ایران 🇮🇷
                        </th>
                        <th className="py-3.5 px-3 w-[20%] bg-emerald-950/40 text-emerald-200 border-l border-slate-700">
                          انتظار کارفرمای آلمانی 🇩🇪
                        </th>
                        <th className="py-3.5 px-3 w-[20%] bg-indigo-950/40 text-indigo-200 border-l border-slate-700">
                          بنچ‌مارک همتای آلمانی 🇩🇪
                        </th>
                        <th className="py-3.5 px-2 w-[7%] text-center">شکاف</th>
                        <th className="py-3.5 px-3 w-[18%]">راهکار عملیاتی جبران</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {data.comparisonTable.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-3 font-bold text-slate-900 align-top text-xs sm:text-sm">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                              <span>{item.dimension}</span>
                            </div>
                            {item.softwareAndStandardsDelta && (
                              <div className="text-[11px] font-normal text-indigo-700 bg-indigo-50 p-1.5 rounded mt-2 border border-indigo-100">
                                <strong>تفاوت ابزار/استاندارد:</strong> {item.softwareAndStandardsDelta}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-3 text-slate-700 bg-amber-50/20 border-x border-slate-200 align-top leading-relaxed text-xs">
                            {item.iranReality}
                          </td>
                          <td className="py-4 px-3 text-slate-800 bg-emerald-50/20 border-l border-slate-200 align-top leading-relaxed text-xs font-medium">
                            {item.germanyExpectation}
                          </td>
                          <td className="py-4 px-3 text-indigo-950 bg-indigo-50/20 border-l border-slate-200 align-top leading-relaxed text-xs">
                            {item.germanPeerBenchmark || item.germanyExpectation}
                          </td>
                          <td className="py-4 px-2 text-center align-top">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getGapBadgeClass(item.gapLevel)}`}>
                              {item.gapLevel}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-xs text-slate-700 bg-slate-50/50 align-top leading-relaxed">
                            <div className="flex items-start gap-1.5 text-indigo-900 font-medium">
                              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{item.actionTip}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Seniority Breakdown Section (Junior, Mid, Senior, Lead) */}
            {data.seniorityBreakdown && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <span>شرح وظایف و انتظارات به تفکیک سطح ارشدیت در آلمان</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    کارفرمای آلمانی بر اساس سابقه و عنوان شغلی دقیقاً چه انتظاراتی دارد؟
                  </p>
                </div>

                {/* Seniority Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
                  {(["junior", "mid", "senior", "lead"] as const).map((key) => {
                    const level = data.seniorityBreakdown[key];
                    if (!level) return null;
                    const isActive = activeSeniorityTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveSeniorityTab(key)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>{level.title.split("(")[0]}</span>
                        <span className={`text-[11px] font-normal px-2 py-0.5 rounded-full ${isActive ? "bg-indigo-700 text-indigo-100" : "bg-slate-200 text-slate-600"}`}>
                          {key.toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Tab Card */}
                {data.seniorityBreakdown[activeSeniorityTab] && (
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {data.seniorityBreakdown[activeSeniorityTab].title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          شرح دقیق وظایف، انتظارات پنهان و چالش‌های کلیدی انطباق
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
                        استاندارد استخدام آلمان
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* German Daily Duties */}
                      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>وظایف روزمره شغلی در آلمان (Typische Aufgaben)</span>
                        </div>
                        <ul className="space-y-2.5">
                          {data.seniorityBreakdown[activeSeniorityTab].germanDuties.map((duty, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
                              <span className="leading-relaxed">{duty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Employer Expectations */}
                      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                          <Award className="w-4 h-4 text-indigo-600" />
                          <span>انتظارات کارفرما از این سطح (Erwartungshaltung)</span>
                        </div>
                        <ul className="space-y-2.5">
                          {data.seniorityBreakdown[activeSeniorityTab].employerExpectations.map((exp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
                              <span className="leading-relaxed">{exp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Transition Challenge Callout */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-amber-900">
                          بزرگ‌ترین چالش انطباق برای متقاضی ایرانی در این سطح:
                        </h5>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                          {data.seniorityBreakdown[activeSeniorityTab].keyChallenge}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Industry Variations Grid */}
            {data.industryVariations && data.industryVariations.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>تفاوت انتظارات در صنایع و ساختارهای سازمانی آلمان</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    فرهنگ کاری در شرکت‌های متوسط صنعتی، استارتاپ‌ها، کورپوریشن‌ها و بخش دولتی
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.industryVariations.map((ind, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Globe2 className="w-4 h-4 text-indigo-600" />
                          <span>{ind.industryName}</span>
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ind.workplaceCulture}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500">
                          سرعت و ریتم کاری: <strong className="text-slate-700">{ind.expectedPace}</strong>
                        </span>
                        <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {ind.languageRequirement}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Typical German Workday Timeline & German Phrases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
              {/* Daily Routine */}
              {data.dailyRoutine && data.dailyRoutine.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>یک روز کاری استاندارد در آلمان (Tagesablauf)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      توالی زمان‌بندی جلسات، فوکوس تایم و زمان پایان کار (Feierabend)
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    {data.dailyRoutine.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md shrink-0 mt-0.5">
                          {step.time}
                        </span>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{step.activity}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* German Cultural Keywords & Workplace Phrases */}
              {data.keyGermanPhrases && data.keyGermanPhrases.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>مفاهیم کلیدی فرهنگ کار آلمان (Schlüsselbegriffe)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      اصطلاحاتی که دانستن آنها در مصاحبه و محیط کاری شانس موفقیت شما را دوچندان می‌کند
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
                    {data.keyGermanPhrases.map((phrase, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm text-left font-mono text-indigo-900" dir="ltr">
                            {phrase.german}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {phrase.persian}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {phrase.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
