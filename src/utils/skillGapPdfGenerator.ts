import { exportToPdfWithHtml2Pdf, PdfExportOptions } from "./html2pdfExporter";
import {
  StructuredGapAnalysisReport,
  GapAnalysisToolResult,
  GapAnalysisSkillResult
} from "../data/germanSkillsToolsBenchmarkData";
import { GermanCourseRecommendation } from "../data/germanCoursesCatalog";
import { formatPrintDocumentTitle } from "../utils";

export interface SkillGapPdfExportOptions {
  includeOverallScores?: boolean;
  includeToolsMatrix?: boolean;
  includeTechnicalStandards?: boolean;
  includeRecommendedCourses?: boolean;
  includeRoadmap?: boolean;
  includeAtsKeywords?: boolean;
  includeAiAuditAdvice?: boolean;
  aiAuditText?: string | null;
  customNotes?: string;
  applicantSeniority?: string;
}

export interface SkillGapExportData {
  candidateName: string;
  targetRole: string;
  gapReport: StructuredGapAnalysisReport;
  recommendedCourses: GermanCourseRecommendation[];
  options?: SkillGapPdfExportOptions;
  date?: string;
}

/**
 * Generates an official, publication-grade DIN A4 HTML document for the Skill Gap Analysis
 * and Recommended Courses report adhering to German employment standards (KldB 2026).
 */
export function generateSkillGapPdfHtml(data: SkillGapExportData): string {
  const {
    candidateName = "متقاضی محترم",
    targetRole = "متخصص فنی / مهندسی",
    gapReport,
    recommendedCourses = [],
    options = {},
    date
  } = data;

  const now = new Date();
  const effectiveDate = date || now.toLocaleDateString("fa-IR");
  const docRef = `JB-GAP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  const includeOverallScores = options.includeOverallScores ?? true;
  const includeToolsMatrix = options.includeToolsMatrix ?? true;
  const includeTechnicalStandards = options.includeTechnicalStandards ?? true;
  const includeRecommendedCourses = options.includeRecommendedCourses ?? true;
  const includeRoadmap = options.includeRoadmap ?? true;
  const includeAtsKeywords = options.includeAtsKeywords ?? true;
  const includeAiAuditAdvice = options.includeAiAuditAdvice ?? true;

  // Filter missing tools
  const criticalMissingTools = gapReport.toolsResults.filter(t => t.status === "missing_critical");
  const diffMissingTools = gapReport.toolsResults.filter(t => t.status === "missing_differentiator");
  const matchedTools = gapReport.toolsResults.filter(t => t.status === "matched");

  // Determine readiness color
  const score = gapReport.overallMatchScore;
  const scoreColor = score >= 80 ? "#059669" : score >= 60 ? "#d97706" : "#dc2626";

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${formatPrintDocumentTitle("گزارش_تحلیل_شکاف_مهارتی_و_دوره‌های_آموزشی", candidateName)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      line-height: 1.5;
      font-size: 11px;
      margin: 0;
      padding: 0;
    }
    .page-container {
      width: 100%;
      max-width: 100%;
    }
    .header-box {
      border-bottom: 2px solid #312e81;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-emblem {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #312e81 0%, #4338ca 100%);
      color: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 20px;
      box-shadow: 0 4px 10px rgba(49, 46, 129, 0.25);
    }
    .header-titles h1 {
      margin: 0;
      font-size: 17px;
      font-weight: 900;
      color: #1e1b4b;
      letter-spacing: -0.3px;
    }
    .header-titles p {
      margin: 2px 0 0 0;
      font-size: 10px;
      color: #64748b;
      font-weight: 700;
    }
    .header-meta {
      text-align: left;
      font-size: 9.5px;
      color: #475569;
    }
    .header-meta .ref-badge {
      display: inline-block;
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 800;
      color: #1e293b;
      border: 1px solid #cbd5e1;
      margin-bottom: 3px;
    }

    /* Profile Summary Card */
    .profile-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      font-size: 10px;
    }
    .profile-item label {
      display: block;
      color: #64748b;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .profile-item span {
      font-weight: 800;
      color: #0f172a;
      font-size: 11px;
    }

    /* KPI Scores Bar */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .kpi-box {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 12px;
      background: #ffffff;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .kpi-box.main-score {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      color: #ffffff;
      border-color: #312e81;
    }
    .kpi-box.main-score .kpi-label {
      color: #c7d2fe;
    }
    .kpi-box.main-score .kpi-val {
      color: #ffffff;
    }
    .kpi-label {
      font-size: 9.5px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 4px;
    }
    .kpi-val {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      font-family: monospace, sans-serif;
      line-height: 1.1;
    }
    .kpi-sub {
      font-size: 9px;
      color: #94a3b8;
      margin-top: 4px;
      font-weight: 600;
    }

    /* Section Styling */
    .section-title {
      font-size: 13px;
      font-weight: 900;
      color: #1e1b4b;
      margin: 18px 0 8px 0;
      display: flex;
      align-items: center;
      gap: 6px;
      border-right: 4px solid #4338ca;
      padding-right: 8px;
    }

    /* Tables */
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 9.5px;
    }
    .report-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 800;
      padding: 6px 8px;
      text-align: right;
      border: 1px solid #e2e8f0;
    }
    .report-table td {
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .report-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    /* Status Badges */
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 800;
    }
    .badge-matched {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .badge-critical {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .badge-diff {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    /* Course Cards Grid */
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .course-card {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .course-platform-tag {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 800;
      color: #ffffff;
      background: #2563eb;
    }
    .course-platform-tag.linkedin { background: #d97706; }
    .course-platform-tag.edx { background: #be123c; }
    .course-platform-tag.openhpi { background: #991b1b; }
    .course-platform-tag.tuev { background: #1e3a8a; }

    .course-title {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0 2px 0;
      line-height: 1.3;
    }
    .course-provider {
      font-size: 9px;
      color: #4338ca;
      font-weight: 700;
    }
    .course-desc {
      font-size: 8.5px;
      color: #475569;
      margin: 4px 0;
      line-height: 1.4;
    }
    .course-value-box {
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 6px;
      padding: 5px;
      font-size: 8px;
      color: #1e1b4b;
      margin-top: 4px;
    }

    /* Roadmap Grid */
    .roadmap-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .roadmap-box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 10px;
      background: #f8fafc;
    }
    .roadmap-box.p1 { border-top: 3px solid #4338ca; }
    .roadmap-box.p2 { border-top: 3px solid #d97706; }
    .roadmap-box.p3 { border-top: 3px solid #059669; }
    .roadmap-header {
      font-weight: 800;
      font-size: 9.5px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }
    .roadmap-list {
      margin: 0;
      padding-right: 14px;
      font-size: 8.5px;
      color: #334155;
    }
    .roadmap-list li {
      margin-bottom: 3px;
    }

    /* Keywords Chips */
    .keywords-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }
    .kw-chip {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 9px;
      font-family: monospace, sans-serif;
      font-weight: 700;
      color: #0f172a;
    }
    .kw-chip.vital {
      background: #fee2e2;
      border-color: #fca5a5;
      color: #991b1b;
    }

    /* Official Footer */
    .official-footer {
      border-top: 1.5px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 24px;
      font-size: 8px;
      color: #475569;
      display: flex;
      flex-direction: column;
      gap: 4px;
      page-break-inside: avoid;
    }
    .footer-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 800;
      color: #0f172a;
    }
    .footer-contacts-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #334155;
      font-size: 7.5px;
    }
  </style>
</head>
<body>
  <div class="page-container">
    
    <!-- Header -->
    <div class="header-box">
      <div class="header-logo-group">
        <div class="logo-emblem">J</div>
        <div class="header-titles">
          <h1>خانه خلاق جهانبان (Jahanban Creative House)</h1>
          <p>کارنامه تخصصی ارزیابی شکاف مهارتی و نقشه راه جبران استاندارد آلمان (KldB 2026)</p>
        </div>
      </div>
      <div class="header-meta">
        <div class="ref-badge" dir="ltr">${docRef}</div>
        <div><strong>تاریخ گزارش:</strong> ${effectiveDate}</div>
        <div><strong>مرجع هنجار:</strong> Bundesagentur für Arbeit</div>
      </div>
    </div>

    <!-- Candidate Profile Card -->
    <div class="profile-card">
      <div class="profile-item">
        <label>نام متقاضی:</label>
        <span>${candidateName}</span>
      </div>
      <div class="profile-item">
        <label>شغل هدف / رده استاندارد آلمان:</label>
        <span>${gapReport.targetRoleFa}</span>
      </div>
      <div class="profile-item">
        <label>کد رسمی طبقه‌بندی مشاغل:</label>
        <span style="font-family: monospace;">${gapReport.kldbCode}</span>
      </div>
      <div class="profile-item">
        <label>سطح آمادگی و سابقه کاری:</label>
        <span style="color: ${scoreColor};">${gapReport.readinessRatingFa} (${gapReport.candidateYearsOfExp} سال)</span>
      </div>
    </div>

    ${includeOverallScores ? `
    <!-- KPI Scores Grid -->
    <div class="kpi-grid">
      <div class="kpi-box main-score">
        <div class="kpi-label">شاخص تطابق کلی با آلمان</div>
        <div class="kpi-val">${gapReport.overallMatchScore}٪</div>
        <div class="kpi-sub">Overall Fit Index</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">پوشش نرم‌افزارها و ابزارها</div>
        <div class="kpi-val" style="color: #4338ca;">${gapReport.toolsMatchScore}٪</div>
        <div class="kpi-sub">${gapReport.matchedToolsCount} از ${gapReport.toolsResults.length} ابزار مرجع</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">پوشش مهارت‌های فنی محوری</div>
        <div class="kpi-val" style="color: #059669;">${gapReport.skillsMatchScore}٪</div>
        <div class="kpi-sub">${gapReport.matchedSkillsCount} از ${gapReport.skillsResults.length} تخصص</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">انطباق با استانداردهای DIN/ISO</div>
        <div class="kpi-val" style="color: #d97706;">${gapReport.germanStandardsScore}٪</div>
        <div class="kpi-sub">هنجارهای کیفیتی آلمان</div>
      </div>
    </div>
    ` : ""}

    ${includeToolsMatrix ? `
    <!-- Tools Matrix -->
    <div class="section-title">
      <span>ماتریس ارزیابی و شکاف‌سنجی نرم‌افزارها و ابزارهای تخصصی (Tools Gap Analysis)</span>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 22%;">نرم‌افزار / ابزار</th>
          <th style="width: 20%;">دسته‌بندی فنی</th>
          <th style="width: 14%;">وضعیت رزومه</th>
          <th style="width: 12%;">الزام در آلمان</th>
          <th style="width: 12%;">شیوع بازار</th>
          <th style="width: 20%;">راهکار جبران / سوال مصاحبه</th>
        </tr>
      </thead>
      <tbody>
        ${gapReport.toolsResults.map(t => `
        <tr>
          <td><strong>${t.tool.name}</strong></td>
          <td>${t.tool.categoryFa}</td>
          <td>
            ${t.status === "matched" ? `<span class="badge badge-matched">موجود در رزومه</span>` :
              t.status === "missing_critical" ? `<span class="badge badge-critical">شکاف الزامی (غایب)</span>` :
              `<span class="badge badge-diff">مزیت رقابتی</span>`}
          </td>
          <td>${t.tool.importanceLabelFa}</td>
          <td style="font-family: monospace;">${t.tool.germanMarketPrevalence}٪</td>
          <td style="font-size: 8.5px; color: #475569;">
            ${t.tool.bridgeRecommendationFa}
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    ${includeTechnicalStandards ? `
    <!-- Methodologies & Norms Benchmark -->
    <div class="section-title">
      <span>مقایسه مهارت‌های مهندسی و رعایت استانداردهای DIN / ISO / GDPR</span>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 25%;">مهارت یا متدولوژی</th>
          <th style="width: 18%;">استاندارد ارجاع</th>
          <th style="width: 15%;">امتیاز شما</th>
          <th style="width: 15%;">بنچ‌مارک آلمان</th>
          <th style="width: 27%;">تحلیل اهمیت در کارفرمایان فدرال</th>
        </tr>
      </thead>
      <tbody>
        ${gapReport.skillsResults.map(s => `
        <tr>
          <td><strong>${s.skill.name}</strong></td>
          <td><code style="font-size: 8px;">${s.skill.germanStandardRef || "استاندارد صنعت"}</code></td>
          <td style="font-weight: bold; color: #4338ca;">${s.userEstimatedScore}٪</td>
          <td style="font-weight: bold; color: #d97706;">${s.benchmarkScore}٪</td>
          <td style="font-size: 8.5px;">${s.skill.descriptionFa}</td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    ${includeRecommendedCourses && recommendedCourses.length > 0 ? `
    <!-- Recommended Courses Section -->
    <div class="section-title">
      <span>دوره‌های آموزشی پیشنهادی در پلتفرم‌های معتبر آلمانی و بین‌المللی برای رفع شکاف مهارتی</span>
    </div>
    <div class="courses-grid">
      ${recommendedCourses.slice(0, 6).map(c => `
      <div class="course-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="course-platform-tag ${
              c.platform === "LinkedIn Learning" ? "linkedin" :
              c.platform === "edX" ? "edX" :
              c.platform === "openHPI" ? "openhpi" :
              c.platform === "TÜV SÜD Academy" ? "tuev" : ""
            }">${c.platform}</span>
            <span style="font-size: 8.5px; color: #64748b; font-weight: 700;">${c.estimatedHours}</span>
          </div>
          <div class="course-title">${c.courseTitle}</div>
          <div class="course-provider">ارائه‌دهنده: ${c.provider} • ${c.credentialTypeFa}</div>
          <div class="course-desc">${c.actionToCloseGapFa}</div>
        </div>
        <div class="course-value-box">
          <strong>اعتبار در آلمان:</strong> ${c.germanMarketValueFa.slice(0, 110)}...
        </div>
      </div>
      `).join("")}
    </div>
    ` : ""}

    ${includeRoadmap ? `
    <!-- Roadmap Section -->
    <div class="section-title">
      <span>نقشه راه زمان‌بندی‌شده ۳۰، ۶۰ و ۹۰ روزه برای جبران شکاف‌های مهارتی</span>
    </div>
    <div class="roadmap-grid">
      <div class="roadmap-box p1">
        <div class="roadmap-header" style="color: #4338ca;">
          <span>فاز ۱: روز ۱ تا ۳۰</span>
          <span>پایه‌ریزی ابزارها</span>
        </div>
        <ul class="roadmap-list">
          ${gapReport.actionPlan.day30.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="roadmap-box p2">
        <div class="roadmap-header" style="color: #d97706;">
          <span>فاز ۲: روز ۳۱ تا ۶۰</span>
          <span>انطباق استانداردها</span>
        </div>
        <ul class="roadmap-list">
          ${gapReport.actionPlan.day60.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="roadmap-box p3">
        <div class="roadmap-header" style="color: #059669;">
          <span>فاز ۳: روز ۶۱ تا ۹۰</span>
          <span>آمادگی مصاحبه</span>
        </div>
        <ul class="roadmap-list">
          ${gapReport.actionPlan.day90.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
    ` : ""}

    ${includeAtsKeywords && gapReport.atsOptimizationKeywords.length > 0 ? `
    <!-- ATS Keywords -->
    <div class="section-title">
      <span>کلمات کلیدی طلایی عبور از فیلترهای استخدامی ATS آلمان (Fachbegriffe)</span>
    </div>
    <div class="keywords-wrap">
      ${gapReport.atsOptimizationKeywords.map(k => `
      <div class="kw-chip ${k.importance === "vital" ? "vital" : ""}">
        ${k.term} <span style="font-size: 8px; color: #64748b;">(${k.termDe})</span>
      </div>
      `).join("")}
    </div>
    ` : ""}

    ${includeAiAuditAdvice && options.aiAuditText ? `
    <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 10px; margin-bottom: 16px; font-size: 9px; line-height: 1.5; color: #1e1b4b;">
      <strong style="display: block; margin-bottom: 4px; font-size: 10px; color: #312e81;">توصیه تکمیلی ممیزی هوش مصنوعی:</strong>
      ${options.aiAuditText.replace(/\n/g, "<br>")}
    </div>
    ` : ""}

    <!-- Official Jahanban Creative House Footer -->
    <div class="official-footer">
      <div class="footer-top-row">
        <span>خانه خلاق جهانبان (Jahanban Creative House)</span>
        <span>استناد قانونی: قانون مهاجرت نیروی متخصص آلمان (FEG 2026 / KldB 2026)</span>
        <span dir="ltr">${docRef}</span>
      </div>
      <div class="footer-contacts-row">
        <div><strong>نشانی رسمی:</strong> تهران، پونک، بلوار میرزابابایی بین ستاری و سردار جنگل، پلاک 168 طبقه 4 تلفن : 74865 • Friedrichstraße 123, 10117 Berlin</div>
        <div dir="ltr">تلفن: 74865 (021) | www.jahanban.group | info@jahanban.group</div>
      </div>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Directly triggers the PDF download using html2pdf / jsPDF
 */
export async function exportSkillGapReportToPdf(
  data: SkillGapExportData,
  filename?: string,
  onProgress?: (percent: number, status: string) => void
): Promise<void> {
  const html = generateSkillGapPdfHtml(data);
  const defaultFilename = `${formatPrintDocumentTitle("گزارش_تحلیل_شکاف_مهارتی_و_دوره‌های_آموزشی", data.candidateName)}.pdf`;

  return exportToPdfWithHtml2Pdf(html, filename || defaultFilename, {
    margin: [10, 10, 10, 10],
    orientation: "portrait",
    scale: 2,
    onProgress
  });
}
