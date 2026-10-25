import { exportToPdfWithHtml2Pdf, PdfExportOptions } from "./html2pdfExporter";
import { MonthlyRoadmapPlan, generateRuleBasedMonthlyRoadmap } from "./monthlyRoadmapGenerator";
import { JobComparisonData, getClientJobComparison } from "./jobComparisonData";
import { formatPrintDocumentTitle } from "../utils";

export interface RoadmapExportProfile {
  name?: string;
  field?: string;
  experience?: number;
  germanLevel?: string;
  englishLevel?: string;
  degree?: string;
  age?: number;
  skills?: string;
}

export interface RoadmapExportSections {
  includeMonthlyMilestones?: boolean;
  includeWeeklySprints?: boolean;
  include6StepsRoadmap?: boolean;
  includeJobDescription?: boolean;
  includeToolsAndReports?: boolean;
  includePeerBenchmark?: boolean;
  includeComparison?: boolean;
  includeSeniority?: boolean;
  includePhrases?: boolean;
}

export interface RoadmapExportData {
  profile: RoadmapExportProfile;
  roadmapData?: MonthlyRoadmapPlan | null;
  jobComparisonData?: JobComparisonData | null;
  completedTasks?: Record<string, boolean>;
  sections?: RoadmapExportSections;
}

/**
 * Generates an official, highly-styled DIN A4 HTML document for the German Immigration & Career Roadmap
 */
export function generateRoadmapDocumentHtml(data: RoadmapExportData): string {
  const { profile, roadmapData, jobComparisonData, completedTasks = {}, sections = {} } = data;

  const includeMonthlyMilestones = sections.includeMonthlyMilestones ?? true;
  const includeWeeklySprints = sections.includeWeeklySprints ?? true;
  const include6StepsRoadmap = sections.include6StepsRoadmap ?? true;
  const includeJobDescription = sections.includeJobDescription ?? true;
  const includeToolsAndReports = sections.includeToolsAndReports ?? true;
  const includePeerBenchmark = sections.includePeerBenchmark ?? true;
  const includeComparison = sections.includeComparison ?? true;
  const includeSeniority = sections.includeSeniority ?? true;
  const includePhrases = sections.includePhrases ?? true;

  const candidateName = profile?.name?.trim() || "متقاضی محترم";
  const fieldName = profile?.field || "مهندسی نرم‌افزار / فناوری اطلاعات";
  const degreeName = profile?.degree === "master" ? "کارشناسی ارشد (Master)" : profile?.degree === "phd" ? "دکتری (PhD)" : "کارشناسی (Bachelor)";
  const experience = profile?.experience || 3;
  const germanLevel = profile?.germanLevel || "B1";
  const englishLevel = profile?.englishLevel || "B2";
  const age = profile?.age || 30;

  const effectiveRoadmap: MonthlyRoadmapPlan = roadmapData || generateRuleBasedMonthlyRoadmap({
    degree: profile?.degree || "bachelor",
    field: fieldName,
    experience,
    germanLevel,
    englishLevel,
    timelineMonths: 6,
    applicantName: candidateName
  });

  const comparison: JobComparisonData = jobComparisonData || getClientJobComparison({
    field: fieldName,
    experience,
    germanLevel
  });

  const candidateId = candidateName.replace(/\s+/g, "").slice(0, 5).toUpperCase() || "REG";
  const dossierRefId = `JB-DE-2026-ROADMAP-${candidateId}`;

  const generatedDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());

  const gregorianDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date());

  const readinessScore = Math.min(
    95,
    Math.round(
      (experience >= 3 ? 30 : experience * 10) +
      (germanLevel.includes("B") ? 30 : 15) +
      (degreeName.includes("ارشد") || degreeName.includes("دکتری") ? 30 : 25) +
      (age <= 35 ? 10 : 5)
    )
  );

  const core6Steps = [
    {
      id: 1,
      title: "ارزشیابی مدارک تحصیلی و شغلی (ZAB & Anabin)",
      duration: "۱ تا ۳ ماه",
      cost: "۲۰۰ یورو عوارض دولتی ZAB",
      details: "استعلام تاییدیه دانشگاه در سامانه Anabin (وضعیت H+) و در صورت لزوم، ثبت درخواست رسمی ارزشیابی مدارک در ZAB بن برای انطباق با مدارک آلمانی.",
      checklist: ["ترجمه رسمی مدرک و ریزنمرات به آلمانی", "تاییدیه دادگستری و امور خارجه", "ثبت نام در سامانه آنلاین ZAB"]
    },
    {
      id: 2,
      title: "ارتقای مدرک زبان آلمانی یا انگلیسی به سطح معتبر",
      duration: "۳ تا ۶ ماه",
      cost: "حدود ۱۰۰ تا ۲۰۰ یورو آزمون",
      details: "دستیابی به حداقل سطح B1/B2 آلمانی با مدرک معتبر گوته، ÖSD یا telc، یا مدرک آیلتس ۶.۵+ برای موقعیت‌های بین‌المللی به زبان انگلیسی.",
      checklist: ["حداقل B1 آلمانی برای فرصت کاری و شانس بالا", "تقویت اصطلاحات تخصصی کاری (Berufsdeutsch)", "شرکت در آزمون رسمی گوته یا telc"]
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
      margin: 8mm 6mm 10mm 6mm !important;
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
      font-size: 10pt;
      line-height: 1.55;
      box-sizing: border-box;
    }

    p, li, tr, td, th, dt, dd,
    .avoid-break,
    .step-box,
    .profile-card,
    .table-box,
    .header-box {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
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
      padding: 5px 8px;
      font-size: 7.3pt;
      color: #92400e;
      margin-top: 4px;
    }

    /* 6 Steps Roadmap Table */
    .steps-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }

    .steps-table th {
      background: #1e293b;
      color: #ffffff;
      font-size: 7.5pt;
      padding: 6px 8px;
      text-align: right;
      font-weight: 700;
    }

    .steps-table td {
      border: 1px solid #e2e8f0;
      padding: 6px 8px;
      font-size: 7.5pt;
      vertical-align: top;
    }

    .steps-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .step-num-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: #4338ca;
      color: #ffffff;
      border-radius: 50%;
      font-size: 7.5pt;
      font-weight: 800;
    }

    /* Comparison Table */
    .comp-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }

    .comp-table th {
      background: #0f172a;
      color: #ffffff;
      font-size: 7.5pt;
      padding: 6px 8px;
      text-align: right;
    }

    .comp-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      font-size: 7.3pt;
      line-height: 1.35;
      vertical-align: top;
    }

    /* Footer Stamp */
    .footer-stamp {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: #64748b;
    }

    .legal-notice {
      background: #f1f5f9;
      border-right: 3px solid #64748b;
      padding: 4px 8px;
      font-size: 6.8pt;
      color: #475569;
      margin-top: 6px;
    }
  </style>
</head>
<body>

  <!-- Header Banner -->
  <div class="header-box">
    <div>
      <div class="flag-bar">
        <div class="flag-black"></div>
        <div class="flag-red"></div>
        <div class="flag-gold"></div>
      </div>
      <h1 class="title-main">سند استراتژی نقشه راه مهاجرت کاری به آلمان</h1>
      <p class="title-sub">تدوین اختصاصی بر اساس قوانین مهاجرت کاری ماهر (FEG 2026) و پایگاه داده مشاغل فدرال آلمان (BERUFENET)</p>
    </div>
    <div style="text-align: left;">
      <div class="ref-badge">${dossierRefId}</div>
      <div style="font-size: 7pt; color: #64748b; margin-top: 3px;">
        تاریخ: ${generatedDate} (${gregorianDate})
      </div>
    </div>
  </div>

  <!-- Candidate Profile Card -->
  <div class="profile-card avoid-break">
    <div class="profile-item">
      <span class="profile-label">نام و نام خانوادگی:</span>
      <span class="profile-val">${candidateName}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">رشته و حوزه تخصصی:</span>
      <span class="profile-val" style="color: #4338ca;">${fieldName}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">مدرک تحصیلی:</span>
      <span class="profile-val">${degreeName}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">امتیاز آمادگی ورود به بازار:</span>
      <div>
        <span class="readiness-pill">${readinessScore}٪ آمادگی اقدام</span>
      </div>
    </div>
    <div class="profile-item">
      <span class="profile-label">سابقه کار مرتبط:</span>
      <span class="profile-val">${experience} سال سابقه کار تخصصی</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">سطح زبان آلمانی:</span>
      <span class="profile-val">${germanLevel} (گوته / تلک)</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">سطح زبان انگلیسی:</span>
      <span class="profile-val">${englishLevel} (کاری / بین‌المللی)</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">مسیر پیشنهادی مهاجرت:</span>
      <span class="profile-val" style="color: #059669; font-weight: 800;">${effectiveRoadmap.overview.recommendedPathway}</span>
    </div>
  </div>

  <!-- Executive Strategy Box -->
  <div class="strategy-box avoid-break">
    <div class="strategy-title">تحلیل استراتژیک پرونده و مسیر بهینه ورود به آلمان</div>
    <p class="strategy-desc">${effectiveRoadmap.overview.summaryInsight}</p>
    <div style="display: flex; gap: 14px; margin-top: 6px; font-size: 7.5pt; color: #166534; font-weight: 700;">
      <span>مدت زمان تخمینی کل: ${effectiveRoadmap.overview.totalDurationMonths} ماه</span>
      <span>•</span>
      <span>بودجه ارزی برآوردی: ${effectiveRoadmap.overview.estimatedTotalBudgetEur} (${effectiveRoadmap.overview.estimatedTotalBudgetIrr})</span>
      <span>•</span>
      <span>شانس موفقیت در بازار: ${effectiveRoadmap.overview.successRateRating}</span>
    </div>
  </div>

  ${include6StepsRoadmap ? `
  <!-- Section: Core 6 Steps -->
  <div class="avoid-break">
    <div class="section-title">
      <span>مراحل ۶گانه اصلی تا اخذ ویزا و استقرار در آلمان</span>
      <span class="section-tag">رویه استاندارد فدرال</span>
    </div>
    <table class="steps-table">
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th style="width: 25%;">عنوان مرحله</th>
          <th style="width: 12%;">مدت زمان</th>
          <th style="width: 18%;">هزینه تقریبی</th>
          <th style="width: 40%;">شرح اقدامات کلیدی و مدارک</th>
        </tr>
      </thead>
      <tbody>
        ${core6Steps.map(step => `
          <tr>
            <td style="text-align: center;"><span class="step-num-badge">${step.id}</span></td>
            <td><strong>${step.title}</strong></td>
            <td>${step.duration}</td>
            <td style="color: #0369a1; font-weight: 700;">${step.cost}</td>
            <td>
              <div>${step.details}</div>
              <div style="margin-top: 3px; color: #64748b; font-size: 7pt;">
                ${step.checklist.join(" • ")}
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ` : ""}

  ${includeMonthlyMilestones && effectiveRoadmap.monthlyMilestones ? `
  <!-- Section: Monthly Milestones -->
  <div>
    <div class="section-title avoid-break">
      <span>برنامه گام‌به‌گام اقدامات ماه به ماه (${effectiveRoadmap.monthlyMilestones.length} ماه)</span>
      <span class="section-tag">اجرایی و زمان‌بندی‌شده</span>
    </div>

    ${effectiveRoadmap.monthlyMilestones.map(m => `
      <div class="milestone-card avoid-break">
        <div class="milestone-header">
          <div class="milestone-title">ماه ${m.monthNumber}: ${m.monthTitle}</div>
          <div class="milestone-cost">هزینه: ${m.estimatedCostEur}€ (${m.estimatedCostIrr})</div>
        </div>

        <div class="milestone-goal">
          <strong>هدف اصلی:</strong> ${m.primaryGoal}
        </div>

        ${includeWeeklySprints && m.weeklySprints && m.weeklySprints.length > 0 ? `
          <div class="sprints-grid">
            ${m.weeklySprints.map(s => `
              <div class="sprint-box">
                <div class="sprint-title">هفته ${s.week}: ${s.title}</div>
                <div class="sprint-desc">${s.description}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <div style="font-size: 7.2pt; font-weight: 700; color: #334155; margin-top: 4px;">چک‌لیست تسک‌های اجرایی ماه:</div>
        <ul class="checklist-grid">
          ${m.actionChecklist.map((task, tIdx) => {
            const isDone = completedTasks[`m${m.monthNumber}_t${tIdx}`];
            return `
              <li class="checklist-item ${isDone ? "checklist-item-done" : ""}">
                <span class="check-box-icon ${isDone ? "check-box-checked" : ""}">${isDone ? "✓" : ""}</span>
                <span class="${isDone ? "task-done-text" : ""}">${task}</span>
              </li>
            `;
          }).join("")}
        </ul>

        ${m.fieldSpecificAdvice ? `
          <div class="advice-box">
            <strong>توصیه تخصصی برای ${fieldName}:</strong> ${m.fieldSpecificAdvice}
          </div>
        ` : ""}
      </div>
    `).join("")}
  </div>
  ` : ""}

  ${includeComparison && comparison.comparisonTable && comparison.comparisonTable.length > 0 ? `
  <!-- Section: Job Comparison (Iran vs Germany) -->
  <div class="avoid-break" style="margin-top: 10px;">
    <div class="section-title">
      <span>جدول مقایسه‌ای انتظارات شغلی کارفرما (ایران در برابر آلمان)</span>
      <span class="section-tag">معیارهای کیفی KldB</span>
    </div>
    <table class="comp-table">
      <thead>
        <tr>
          <th style="width: 18%;">محور ارزیابی</th>
          <th style="width: 25%;">واقعیت بازار کار ایران</th>
          <th style="width: 27%;">انتظار رسمی کارفرمای آلمانی</th>
          <th style="width: 30%;">همتای آلمانی و راهکار تطبیق</th>
        </tr>
      </thead>
      <tbody>
        ${comparison.comparisonTable.map(row => `
          <tr>
            <td><strong>${row.dimension}</strong></td>
            <td style="color: #475569;">${row.iranReality}</td>
            <td style="color: #0f172a; font-weight: 600;">${row.germanyExpectation}</td>
            <td>
              <div style="color: #1e3a8a; font-weight: 700;">${row.germanPeerBenchmark || row.germanyExpectation}</div>
              <div style="color: #059669; font-size: 7pt; margin-top: 2px;">✓ راهکار: ${row.actionTip}</div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ` : ""}

  <!-- Footer Stamp and Reference Notice -->
  <div class="footer-stamp avoid-break">
    <div>
      <strong>گروه مهاجرتی جهانبان • دپارتمان تخصصی کاریابی و اقامت آلمان</strong><br>
      مرجع قوانین: قانون مهاجرت نیروی ماهر آلمان (Fachkräfteeinwanderungsgesetz - FEG 2026)
    </div>
    <div style="text-align: left;">
      <span>شناسه مدرک: ${dossierRefId}</span><br>
      <span>مورد تایید برای ارائه به سفارت و کارفرمایان فدرال</span>
    </div>
  </div>

  <div class="legal-notice avoid-break">
    توجه: این سند بر پایه استانداردهای اداره کار فدرال آلمان (Bundesagentur für Arbeit) و چارچوب حقوقی Chancenkarte (§20a AufenthG) و Blue Card (§18g AufenthG) تدوین شده است. جهت آغاز فرآیند ترجمه و ارزشیابی، پیگیری زمان‌بندی دقیق مایل‌استون‌های فوق الزامی است.
  </div>

</body>
</html>`;
}

/**
 * Directly exports the complete German Immigration & Career Roadmap as a high-resolution PDF
 * using isolated iframe, html2canvas, and jsPDF.
 */
export async function exportRoadmapToPdf(
  data: RoadmapExportData,
  filename?: string,
  options?: PdfExportOptions
): Promise<void> {
  const html = generateRoadmapDocumentHtml(data);
  const cleanName = data.profile?.name?.trim() || data.roadmapData?.overview?.applicantName?.trim() || "Applicant";
  const sanitized = cleanName.replace(/[^\w\u0600-\u06FF\s-]/g, "").trim().replace(/\s+/g, "_");
  const defaultFilename = `German_Immigration_Roadmap_Plan_${sanitized}.pdf`;

  return exportToPdfWithHtml2Pdf(html, filename || defaultFilename, {
    margin: [6, 6, 8, 6],
    orientation: "portrait",
    scale: 2,
    ...options
  });
}
