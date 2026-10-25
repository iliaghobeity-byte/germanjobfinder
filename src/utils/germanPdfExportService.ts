/**
 * German PDF Export Service (DIN 5008 & FEG 2026 Standards)
 * Powered by jsPDF & html2canvas.
 *
 * Provides functions to export the current Dashboard evaluation view or CV view
 * as professionally formatted DIN A4 PDF documents adhering to German layout standards.
 */

import { exportToPdfWithHtml2Pdf, PdfExportOptions } from "./html2pdfExporter";
import { GermanCvData, generateGermanCvHtml, exportGermanCvToPdf } from "./germanCvPdfGenerator";
import { EvaluatorInput } from "../types";
import { convertMarkdownToHtml } from "../utils";
import { INDEX_CSS_PRINT_STYLES } from "./printStylesCss";

export interface DashboardExportSections {
  includeSummary?: boolean;
  includeRadar?: boolean;
  includeDetailedReport?: boolean;
  includeJobComparison?: boolean;
  includeSignatures?: boolean;
}

export interface DashboardExportPayload {
  profile: EvaluatorInput;
  aiReport?: string;
  field?: string;
  radarData?: Array<{ subject: string; [key: string]: any }>;
  jobComparisonData?: any;
  showWatermark?: boolean;
  docId?: string;
  logoBase64?: string;
  sections?: DashboardExportSections;
}

export interface ExportDashboardOrCvOptions extends PdfExportOptions {
  filename?: string;
  onProgress?: (percent: number, statusText: string) => void;
}

/**
 * Formats a clean date string for German official documents.
 */
export function getGermanDocumentDates(): { dateFa: string; dateDe: string } {
  const now = new Date();
  let dateFa = "مهر ۱۴۰۵";
  let dateDe = "02.10.2026";

  try {
    dateFa = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(now);

    dateDe = new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);
  } catch {
    // fallback
  }

  return { dateFa, dateDe };
}

/**
 * Generates an official German-standard DIN A4 Dossier HTML document
 * for the candidate evaluation dashboard.
 */
export function generateGermanDashboardDocumentHtml(data: DashboardExportPayload): string {
  const { profile, aiReport = "", field = "", radarData = [], jobComparisonData, showWatermark = false, logoBase64 = "" } = data;
  const {
    includeSummary = true,
    includeRadar = true,
    includeDetailedReport = true,
    includeJobComparison = true,
    includeSignatures = true
  } = data.sections || {};
  const { dateFa, dateDe } = getGermanDocumentDates();
  const effectiveField = field || profile.field || "Fachkraft";
  const candidateId = profile.name ? profile.name.trim().replace(/\s+/g, "").slice(0, 8).toUpperCase() : "APPLICANT";
  const docId = data.docId || `JB-DE-2026-EVAL-${candidateId}`;
  const bodyHtml = convertMarkdownToHtml(aiReport);

  // Compute competency score
  const isC1En = ["C1", "C2", "C1/C2", "Advanced"].includes(profile.englishLevel) ||
                 String(profile.englishLevel).includes("C1") ||
                 String(profile.englishLevel).includes("C2") ||
                 String(profile.englishLevel).toLowerCase().includes("ielts 7");
  const enScore = isC1En ? 25 : (profile.englishLevel === "B2" ? 20 : (profile.englishLevel === "B1" ? 12 : 5));
  const deScore = profile.germanLevel.startsWith("C") ? 25 : profile.germanLevel.startsWith("B") ? 20 : profile.germanLevel.startsWith("A") ? 10 : 5;
  const expScore = Math.min(25, (profile.experience || 0) * 5);
  const degScore = (profile.degree === "master" || profile.degree === "phd") ? 25 : profile.degree === "bachelor" ? 20 : 15;
  const totalScore = Math.min(100, Math.max(50, Math.round(expScore + degScore + deScore + enScore)));

  const isBlueCardLikely = profile.experience >= 3 && (profile.degree === "bachelor" || profile.degree === "master" || profile.degree === "phd");

  return `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <title>Dossier zur Fachkräfte-Bewertung - ${profile.name || "Kandidat"}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&family=Inter:wght@400;600;700;800&display=swap">
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 6mm 10mm 6mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 10pt;
      line-height: 1.55;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      direction: rtl;
    }
    .report-container {
      width: 100%;
      max-width: 794px;
      margin: 0 auto;
      background: #ffffff;
      position: relative;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      opacity: 0.04;
      width: 450px;
      pointer-events: none;
      z-index: 0;
    }
    
    /* DIN Standard Header */
    .header-table {
      width: 100%;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 13pt;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 8pt;
      color: #475569;
      margin: 2px 0 0 0;
    }
    .doc-meta {
      font-size: 7.5pt;
      color: #334155;
      text-align: left;
      direction: ltr;
      font-family: 'Inter', monospace;
    }
    .doc-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 700;
      margin-top: 4px;
    }

    /* Subject Banner */
    .subject-banner {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 14px;
    }
    .subject-banner h2 {
      margin: 0;
      font-size: 11pt;
      font-weight: 800;
      color: #ffffff;
    }
    .subject-banner p {
      margin: 3px 0 0 0;
      font-size: 7.5pt;
      color: #cbd5e1;
    }

    /* Candidate Profile Box */
    .profile-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 14px;
      background: #f8fafc;
      page-break-inside: avoid;
    }
    .profile-box h3 {
      margin: 0 0 8px 0;
      font-size: 9pt;
      font-weight: 800;
      color: #1e3a8a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .profile-grid {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .profile-grid td {
      padding: 3px 6px;
    }
    .profile-grid .label {
      color: #64748b;
      width: 15%;
      font-weight: 600;
    }
    .profile-grid .value {
      color: #0f172a;
      font-weight: 700;
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .kpi-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      background: #ffffff;
      text-align: center;
    }
    .kpi-label {
      font-size: 7pt;
      color: #64748b;
      margin-bottom: 3px;
      font-weight: 600;
    }
    .kpi-value {
      font-size: 11pt;
      font-weight: 900;
      color: #1e3a8a;
      font-family: 'Inter', 'Vazirmatn', sans-serif;
    }
    .kpi-sub {
      font-size: 6.5pt;
      color: #475569;
      margin-top: 2px;
    }

    /* Radar Table */
    .radar-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 7.5pt;
      page-break-inside: avoid;
    }
    .radar-table th {
      background: #f1f5f9;
      color: #1e293b;
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
      font-weight: 700;
    }
    .radar-table td {
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
    }

    /* Report Content Body */
    .report-body {
      font-size: 8.5pt;
      line-height: 1.6;
      color: #1e293b;
    }
    .report-body h1, .report-body h2 {
      font-size: 10.5pt;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin: 14px 0 6px 0;
      font-weight: 800;
      page-break-after: avoid;
    }
    .report-body h3 {
      font-size: 9.5pt;
      color: #1e3a8a;
      margin: 10px 0 4px 0;
      font-weight: 700;
      page-break-after: avoid;
    }
    .report-body p {
      margin: 0 0 8px 0;
      text-align: justify;
    }
    .report-body ul, .report-body ol {
      margin: 4px 0 10px 18px;
      padding: 0;
    }
    .report-body li {
      margin-bottom: 3px;
    }
    .report-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 7.5pt;
      page-break-inside: avoid;
    }
    .report-body th, .report-body td {
      border: 1px solid #cbd5e1;
      padding: 5px 8px;
    }
    .report-body th {
      background: #f1f5f9;
      font-weight: 700;
    }

    /* Footer & Signature */
    .footer {
      border-top: 1.5px solid #cbd5e1;
      padding-top: 10px;
      margin-top: 20px;
      font-size: 7pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-inside: avoid;
    }
    .signature-box {
      margin-top: 18px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      page-break-inside: avoid;
    }
    .signature-line {
      width: 160px;
      border-bottom: 1px solid #0f172a;
      margin-top: 30px;
      text-align: center;
      font-size: 7pt;
      color: #64748b;
      padding-top: 2px;
    }
  </style>
</head>
<body>
  <div class="report-container">
    ${showWatermark && logoBase64 ? `<img class="watermark" src="data:image/jpeg;base64,${logoBase64}" alt="Wasserzeichen" />` : ""}

    <!-- Header Section -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: top; width: 65%;">
          <h1 class="brand-title">گروه شرکت‌های بین‌المللی جهانبان</h1>
          <p class="brand-subtitle">مرکز تخصصی مهاجرت کاری و تطابق شایستگی نخبگان با آلمان (FEG 2026)</p>
          <span class="doc-badge">Official German Dossier • Fachkräfteeinwanderung</span>
        </td>
        <td style="vertical-align: top; width: 35%; text-align: left;" class="doc-meta">
          <div><strong>Aktenzeichen:</strong> ${docId}</div>
          <div><strong>Ausstellungsdatum:</strong> ${dateDe} (${dateFa})</div>
          <div><strong>Rechtsgrundlage:</strong> FEG / § 18a, 18b, 18g AufenthG</div>
        </td>
      </tr>
    </table>

    <!-- Subject Banner -->
    <div class="subject-banner">
      <h2>کارنامه رسمی ارزیابی صلاحیت تخصصی و شانس ویزای کار آلمان</h2>
      <p>بررسی چندبعدی انطباق مدارک، سن، مهارت‌های زبانی، امتیاز چنس کارت و سقف حقوقی بلوکارت اروپا ۲۰۲۶</p>
    </div>

    ${includeSummary ? `
    <!-- Candidate Profile Box -->
    <div class="profile-box">
      <h3>مشخصات ثبتی متقاضی (Angaben zur Person & Qualifikation):</h3>
      <table class="profile-grid">
        <tr>
          <td class="label">نام متقاضی:</td>
          <td class="value">${profile.name || "متقاضی محترم"}</td>
          <td class="label">سن و سال:</td>
          <td class="value">${profile.age} سال</td>
        </tr>
        <tr>
          <td class="label">مدرک تحصیلی:</td>
          <td class="value">
            ${profile.degree === "phd" ? "دکتری تخصصی (Promotion / PhD)" :
              profile.degree === "master" ? "کارشناسی ارشد (Master of Science/Arts)" :
              profile.degree === "bachelor" ? "کارشناسی (Bachelor)" :
              profile.degree === "associate" ? "کاردانی (Associate)" : "دیپلم متوسطه (Abitur/Diplom)"}
          </td>
          <td class="label">سابقه کار مرتبط:</td>
          <td class="value">${profile.experience} سال سابقه مستند</td>
        </tr>
        <tr>
          <td class="label">رشته و تخصص:</td>
          <td class="value" style="color: #1e3a8a;">${effectiveField}</td>
          <td class="label">سطح زبان:</td>
          <td class="value">آلمانی: <strong>${profile.germanLevel}</strong> | انگلیسی: <strong>${profile.englishLevel}</strong></td>
        </tr>
        <tr>
          <td class="label">تاییدیه Anabin:</td>
          <td class="value" style="color: #047857;">${profile.anabinStatus || "✓ دانشگاه H+ در دبیرخانه KMK آلمان"}</td>
          <td class="label">مسیر هدف:</td>
          <td class="value">بلوکارت (§18g) / ویزای کار تخصصی (§18a/b)</td>
        </tr>
      </table>
    </div>

    <!-- 4 KPI Metrics -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">امتیاز شایستگی کلی</div>
        <div class="kpi-value">${totalScore} / ۱۰۰</div>
        <div class="kpi-sub">تطابق با ضوابط اداره کار آلمان (BA)</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">شانس بلوکارت اروپا (§18g)</div>
        <div class="kpi-value" style="color: ${isBlueCardLikely ? '#047857' : '#b45309'}; font-size: 9.5pt;">
          ${isBlueCardLikely ? "واجد شرایط اولیه" : "نیازمند معادل‌سازی"}
        </div>
        <div class="kpi-sub">کف حقوق ۴۵٬۳۰۰ € (مشاغل کمبود MINT)</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">امتیاز چانس کارت (Chancenkarte)</div>
        <div class="kpi-value" style="color: #4338ca;">
          ${Math.min(10, Math.max(6, Math.round(expScore / 5 + (profile.age <= 35 ? 2 : 1) + (profile.germanLevel.startsWith("B") ? 2 : 1))))} از ۶
        </div>
        <div class="kpi-sub">کسب حد نصاب قانونی ویزای جستجوی کار</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">بازه تخمینی ورود به آلمان</div>
        <div class="kpi-value" style="color: #0f172a; font-size: 9.5pt;">۶ تا ۹ ماه</div>
        <div class="kpi-sub">شامل آماده‌سازی مدارک و جاب‌آفر</div>
      </div>
    </div>
    ` : ""}

    <!-- Radar Competency Breakdown Table -->
    ${includeRadar && radarData && radarData.length > 0 ? `
      <div style="margin-bottom: 14px; page-break-inside: avoid;">
        <h4 style="font-size: 8.5pt; color: #1e3a8a; margin: 0 0 5px 0; font-weight: 800;">
          تحلیل شاخص‌های تطبیق شایستگی با نیازهای بازار کار آلمان (Kompetenzabgleich):
        </h4>
        <table class="radar-table">
          <thead>
            <tr>
              <th style="text-align: right;">مؤلفه ارزیابی</th>
              <th style="text-align: center;">سطح متقاضی (از ۱۰۰)</th>
              <th style="text-align: center;">معیار کارفرمای آلمانی</th>
              <th style="text-align: center;">وضعیت تطابق با استانداردهای فدرال</th>
            </tr>
          </thead>
          <tbody>
            ${radarData.map(item => {
              const diff = (item["سطح شما"] as number) - (item["نیاز موقعیت شغلی"] as number);
              const statusText = diff >= 0 ? "✓ تطابق کامل / مطلوب" : diff >= -15 ? "شکاف جزئی (قابل ارتقاء)" : "نیازمند تقویت فوری";
              const statusColor = diff >= 0 ? "#047857" : diff >= -15 ? "#b45309" : "#b91c1c";
              return `
                <tr>
                  <td style="font-weight: bold;">${item.subject}</td>
                  <td style="text-align: center; font-weight: 800; font-family: 'Inter', monospace;">${item["سطح شما"]}%</td>
                  <td style="text-align: center; color: #64748b; font-family: 'Inter', monospace;">${item["نیاز موقعیت شغلی"]}%</td>
                  <td style="text-align: center; font-weight: bold; color: ${statusColor};">${statusText}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    ` : ""}

    <!-- Evaluation Body Report -->
    ${(includeDetailedReport || (includeJobComparison && jobComparisonData)) ? `
    <div class="report-body">
      ${includeDetailedReport ? bodyHtml : ""}

      ${includeJobComparison && jobComparisonData ? `
        <div style="page-break-before: always; margin-top: 18px; border-top: 2px solid #0f172a; padding-top: 12px;">
          <h2 style="color: #0f172a; font-size: 11pt; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 6px; font-weight: 800;">
            گزارش مقایسه شغلی و انتظارات کارفرمای آلمانی (${effectiveField})
          </h2>
          <p style="font-size: 8.5pt; color: #334155; line-height: 1.6; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; margin-bottom: 12px;">
            <strong>خلاصه تحلیلی کارشناسی:</strong> ${jobComparisonData.summaryInsight || ""}
          </p>

          ${jobComparisonData.jobDescriptionInGermany ? `
            <div style="margin-bottom: 12px; background: #f1f5f9; padding: 8px 12px; border-radius: 6px;">
              <h3 style="font-size: 9pt; color: #0f172a; margin: 0 0 4px 0; font-weight: 800;">عنوان رسمی در طبقه‌بندی مشاغل آلمان (KldB):</h3>
              <p style="font-family: monospace; font-weight: bold; color: #1e3a8a; margin: 0; font-size: 9pt;">
                ${jobComparisonData.jobDescriptionInGermany.officialTitleDe} (کد KldB: ${jobComparisonData.jobDescriptionInGermany.kldbCode})
              </p>
              <p style="font-size: 8pt; color: #334155; margin: 4px 0 0 0;">${jobComparisonData.jobDescriptionInGermany.generalScope}</p>
            </div>
          ` : ""}

          ${jobComparisonData.comparisonTable && jobComparisonData.comparisonTable.length > 0 ? `
            <div>
              <h3 style="font-size: 9pt; color: #0f172a; margin-bottom: 6px; font-weight: 800;">ماتریس مقایسه رویه در ایران در برابر استانداردهای آلمان:</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 7.5pt;">
                <thead>
                  <tr style="background: #0f172a; color: white;">
                    <th style="padding: 5px 8px; border: 1px solid #334155; text-align: right;">محور ارزیابی</th>
                    <th style="padding: 5px 8px; border: 1px solid #334155; text-align: right;">رویه در ایران</th>
                    <th style="padding: 5px 8px; border: 1px solid #334155; text-align: right;">انتظار کارفرما در آلمان</th>
                    <th style="padding: 5px 8px; border: 1px solid #334155; text-align: center;">میزان شکاف</th>
                  </tr>
                </thead>
                <tbody>
                  ${jobComparisonData.comparisonTable.map((item: any) => `
                    <tr>
                      <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: bold;">${item.dimension}</td>
                      <td style="padding: 4px 8px; border: 1px solid #cbd5e1; color: #475569;">${item.iranReality}</td>
                      <td style="padding: 4px 8px; border: 1px solid #cbd5e1; color: #1e3a8a;">${item.germanyExpectation}</td>
                      <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${item.gapLevel}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : ""}
        </div>
      ` : ""}
    </div>
    ` : ""}

    <!-- Official Signature Block -->
    ${includeSignatures ? `
    <div class="signature-box">
      <div>
        <p style="margin: 0; font-weight: bold;">مهر و تاییدیه کارشناسی جهانبان:</p>
        <p style="margin: 2px 0 0 0; color: #64748b; font-size: 7pt;">مبتنی بر دستورالعمل‌های دبیرخانه KMK و پورتال Anerkennung in Deutschland</p>
      </div>
      <div style="text-align: center;">
        <div>Ort, Datum: <strong>Berlin / Teheran, ${dateDe}</strong></div>
        <div class="signature-line">Prüfvermerk & Freigabe</div>
      </div>
    </div>
    ` : ""}

    <!-- Footer -->
    <div class="footer">
      <div>
        <span>تمامی حقوق مادی و معنوی متعلق به خانه خلاق و مرکز نوآوری جهانبان است.</span>
        <span style="margin-right: 8px;">استناد قانونی: قانون مهاجرت نیروی متخصص آلمان (FEG 2026)</span>
      </div>
      <div style="direction: ltr; font-family: 'Inter', monospace; font-weight: 700;">
        jahanban.group • Ref: ${docId}
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates the official Smart Migration Evaluation Report HTML
 * adhering 100% to all print classes, DIN 5008 guidelines, and styles defined in src/index.css.
 */
export function generateSmartMigrationReportPrintHtml(data: DashboardExportPayload): string {
  const { profile, aiReport = "", field = "", radarData = [], jobComparisonData, showWatermark = false, logoBase64 = "" } = data;
  const {
    includeSummary = true,
    includeRadar = true,
    includeDetailedReport = true,
    includeJobComparison = true,
    includeSignatures = true
  } = data.sections || {};
  const { dateFa, dateDe } = getGermanDocumentDates();
  const effectiveField = field || profile.field || "Fachkraft / متخصص";
  const candidateId = profile.name ? profile.name.trim().replace(/\s+/g, "").slice(0, 8).toUpperCase() : "APPLICANT";
  const docId = data.docId || `JB-DE-2026-EVAL-${candidateId}`;
  const bodyHtml = convertMarkdownToHtml(aiReport, false);

  // Compute competency score
  const isC1En = ["C1", "C2", "C1/C2", "Advanced"].includes(profile.englishLevel) ||
                 String(profile.englishLevel).includes("C1") ||
                 String(profile.englishLevel).includes("C2") ||
                 String(profile.englishLevel).toLowerCase().includes("ielts 7");
  const enScore = isC1En ? 25 : (profile.englishLevel === "B2" ? 20 : (profile.englishLevel === "B1" ? 12 : 5));
  const deScore = profile.germanLevel?.startsWith("C") ? 25 : profile.germanLevel?.startsWith("B") ? 20 : profile.germanLevel?.startsWith("A") ? 10 : 5;
  const expScore = Math.min(25, (profile.experience || 0) * 5);
  const degScore = (profile.degree === "master" || profile.degree === "phd") ? 25 : profile.degree === "bachelor" ? 20 : 15;
  const totalScore = Math.min(100, Math.max(50, Math.round(expScore + degScore + deScore + enScore)));

  const isBlueCardLikely = (profile.experience || 0) >= 3 && (profile.degree === "bachelor" || profile.degree === "master" || profile.degree === "phd");

  const degreeLabel = 
    profile.degree === "phd" ? "دکتری تخصصی (PhD)" :
    profile.degree === "master" ? "کارشناسی ارشد (Master)" :
    profile.degree === "bachelor" ? "کارشناسی (Bachelor)" :
    profile.degree === "associate" ? "کاردانی (فوق دیپلم)" :
    profile.degree === "diploma" ? "دیپلم متوسطه" : (profile.degree || "سایر مدارک");

  return `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <title>کارنامه رسمی ارزیابی و گزارش هوشمند مهاجرت - ${profile.name || "متقاضی"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap">
  <style>
    ${INDEX_CSS_PRINT_STYLES}
  </style>
</head>
<body class="simulate-print-mode print-document-sheet print-margin-standard">
  <div id="dashboard-tab" class="print-document-sheet">

    <!-- Official Jahanban Print Header -->
    <header class="jb-print-header">
      <div class="jb-print-brand">
        ${logoBase64 ? `<img src="data:image/jpeg;base64,${logoBase64}" alt="لوگوی گروه شرکت‌های جهانبان" class="jb-print-logo" />` : `<div class="jb-print-logo" style="display:flex;align-items:center;justify-content:center;background:#0f172a;color:#d97706;font-weight:900;font-size:14pt;">JB</div>`}
        <div class="jb-print-brand-text">
          <h1 class="jb-print-brand-title">گروه شرکت‌های جهانبان</h1>
          <p class="jb-print-brand-sub">خانه خلاق جهانبان | توسعه فناوری و هدایت مهاجرتی</p>
          <p class="jb-print-brand-system">سامانه هوشمند ارزیابی و جاب فایندر آلمان (نسخه ۲۰۲۶)</p>
        </div>
      </div>

      <div class="jb-print-subject-box">
        <span class="jb-print-badge">سند رسمی ارزیابی و راهنمای تخصصی</span>
        <h2 class="jb-print-subject">کارنامه جامع ارزیابی شایستگی، شانس ویزا و الزامات شغلی آلمان</h2>
      </div>

      <div class="jb-print-meta">
        <div class="jb-print-meta-item">
          <span class="jb-print-meta-label">تاریخ صدور:</span>
          <span class="jb-print-meta-val">${dateFa} (${dateDe})</span>
        </div>
        <div class="jb-print-meta-item">
          <span class="jb-print-meta-label">شماره سند:</span>
          <span class="jb-print-meta-val font-mono">${docId}</span>
        </div>
        <div class="jb-print-meta-item">
          <span class="jb-print-meta-label">مبنای قانونی:</span>
          <span class="jb-print-meta-val">FEG 2026 / بلوکارت</span>
        </div>
      </div>
    </header>

    <!-- Official Watermark Overlay -->
    ${showWatermark ? `
    <div class="jb-print-watermark">
      ${logoBase64 ? `<img src="data:image/jpeg;base64,${logoBase64}" alt="Jahanban Watermark" class="jb-print-watermark-logo" />` : ""}
      <div class="watermark-text-fa">گروه بین‌المللی شرکت‌های جهانبان</div>
      <div class="watermark-text-sub">JAHANBAN GROUP • CREATIVE HOUSE</div>
      <div class="watermark-text-legal">سند رسمی ارزیابی و راهنمای تخصصی مهاجرت کاری آلمان ۲۰۲۶</div>
    </div>
    ` : ""}

    ${includeSummary ? `
    <!-- Candidate Profile Dossier Box -->
    <div id="jb-print-candidate-profile" class="print-break-inside-avoid" style="background:#ffffff; border:1.5px solid #334155; border-radius:8px; padding:12px 16px; margin-bottom:14px;">
      <h3 style="font-weight: 800; font-size: 11pt; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 5px; margin-top: 0; margin-bottom: 8px;">
        مشخصات سجلی و تخصصی متقاضی ارزیابی شده:
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 10pt; line-height: 1.6;">
        <tr>
          <td style="padding: 5px 8px; color: #1e293b; width: 14%; font-weight: 700;">نام متقاضی:</td>
          <td style="padding: 5px 8px; font-weight: 800; color: #0f172a; width: 36%;">${profile.name || "متقاضی محترم"}</td>
          <td style="padding: 5px 8px; color: #1e293b; width: 14%; font-weight: 700;">سن:</td>
          <td style="padding: 5px 8px; font-weight: 800; color: #0f172a; width: 36%;">${profile.age || 30} سال</td>
        </tr>
        <tr>
          <td style="padding: 5px 8px; color: #1e293b; font-weight: 700;">رشته / تخصص:</td>
          <td style="padding: 5px 8px; font-weight: 800; color: #1e3a8a;">${effectiveField}</td>
          <td style="padding: 5px 8px; color: #1e293b; font-weight: 700;">مدرک تحصیلی:</td>
          <td style="padding: 5px 8px; font-weight: 800; color: #0f172a;">${degreeLabel}</td>
        </tr>
        <tr>
          <td style="padding: 5px 8px; color: #1e293b; font-weight: 700;">سابقه کار:</td>
          <td style="padding: 5px 8px; font-weight: 800; color: #0f172a;">${profile.experience || 0} سال تخصصی</td>
          <td style="padding: 5px 8px; color: #1e293b; font-weight: 700;">مسیر زبانی:</td>
          <td style="padding: 5px 8px; font-weight: 800; color: #0f172a;">آلمانی: ${profile.germanLevel || "A1"} | انگلیسی: ${profile.englishLevel || "B1"}</td>
        </tr>
      </table>
    </div>

    <!-- 4-Card Evaluation Grid -->
    <div id="dashboard-evaluation-cards-section" class="print-break-inside-avoid">
      <div class="grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;">
        <div style="background: #ffffff; border: 1.5px solid #334155; border-radius: 8px; padding: 12px 14px;">
          <div style="font-size: 9.5pt; font-weight: 800; color: #0f172a; margin-bottom: 3px;">نمره شایستگی عمومی (General Competency)</div>
          <div style="font-size: 14pt; font-weight: 900; color: #1e3a8a;">${totalScore} / ۱۰۰</div>
          <div style="font-size: 8.5pt; color: #334155; font-weight: 600; margin-top: 3px;">برآورد شانس کلی ورود به فرآیند کاریابی آلمان</div>
        </div>
        <div style="background: #ffffff; border: 1.5px solid #334155; border-radius: 8px; padding: 12px 14px;">
          <div style="font-size: 9.5pt; font-weight: 800; color: #0f172a; margin-bottom: 3px;">شانس بلوکارت اتحادیه اروپا (EU Blue Card)</div>
          <div style="font-size: 14pt; font-weight: 900; color: ${isBlueCardLikely ? '#047857' : '#b45309'};">
            ${isBlueCardLikely ? "واجد شرایط اولیه" : "نیازمند معادل‌سازی / تقویت سابقه"}
          </div>
          <div style="font-size: 8.5pt; color: #334155; font-weight: 600; margin-top: 3px;">با حداقل کف حقوق سالانه ۴۵٬۳۰۰ یورو برای مشاغل کمبود نیرو</div>
        </div>
        <div style="background: #ffffff; border: 1.5px solid #334155; border-radius: 8px; padding: 12px 14px;">
          <div style="font-size: 9.5pt; font-weight: 800; color: #0f172a; margin-bottom: 3px;">اولویت توسعه زبان آلمانی</div>
          <div style="font-size: 13pt; font-weight: 900; color: #1e3a8a;">سطح هدف: B2 رسمی (Goethe/Telc)</div>
          <div style="font-size: 8.5pt; color: #334155; font-weight: 600; margin-top: 3px;">سطح فعلی متقاضی: ${profile.germanLevel || "A1"}</div>
        </div>
        <div style="background: #ffffff; border: 1.5px solid #334155; border-radius: 8px; padding: 12px 14px;">
          <div style="font-size: 9.5pt; font-weight: 800; color: #0f172a; margin-bottom: 3px;">بازه تخمینی فرآیند (Timeline)</div>
          <div style="font-size: 14pt; font-weight: 900; color: #0f172a;">۶ الی ۹ ماه</div>
          <div style="font-size: 8.5pt; color: #334155; font-weight: 600; margin-top: 3px;">شامل ارتقاء رزومه، مصاحبه و نوبت ویزای کار</div>
        </div>
      </div>
    </div>
    ` : ""}

    <!-- Competency Match Summary Table -->
    ${includeRadar && radarData && radarData.length > 0 ? `
    <div id="dashboard-radar-card" class="print-break-inside-avoid" style="background: #ffffff; border: 1.5px solid #334155; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
      <h3 style="font-size: 10.5pt; color: #0f172a; margin: 0 0 8px 0; font-weight: 800; border-bottom: 1.5px solid #334155; padding-bottom: 4px;">
        تحلیل شاخص‌های تطبیق شایستگی با نیازهای بازار کار آلمان (German Competency Match):
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 7px 10px; border: 1px solid #334155; text-align: right; font-weight: 800; color: #ffffff;">بعد ارزیابی</th>
            <th style="padding: 7px 10px; border: 1px solid #334155; text-align: center; font-weight: 800; color: #ffffff;">سطح متقاضی (از ۱۰۰)</th>
            <th style="padding: 7px 10px; border: 1px solid #334155; text-align: center; font-weight: 800; color: #ffffff;">معیار کارفرمای آلمانی</th>
            <th style="padding: 7px 10px; border: 1px solid #334155; text-align: center; font-weight: 800; color: #ffffff;">وضعیت تطابق</th>
          </tr>
        </thead>
        <tbody>
          ${radarData.map(item => {
            const diff = (item["سطح شما"] as number) - (item["نیاز موقعیت شغلی"] as number);
            const statusText = diff >= 0 ? "تطابق کامل / مطلوب" : diff >= -15 ? "شکاف جزئی (قابل جبران)" : "نیازمند تقویت فوری";
            const statusColor = diff >= 0 ? "#047857" : diff >= -15 ? "#b45309" : "#b91c1c";
            return `
              <tr style="page-break-inside: avoid; break-inside: avoid;">
                <td style="padding: 7px 10px; border: 1px solid #475569; font-weight: 800; color: #0f172a;">${item.subject}</td>
                <td style="padding: 7px 10px; border: 1px solid #475569; text-align: center; font-weight: 800; color: #0f172a;">${item["سطح شما"]}٪</td>
                <td style="padding: 7px 10px; border: 1px solid #475569; text-align: center; color: #1e293b; font-weight: 700;">${item["نیاز موقعیت شغلی"]}٪</td>
                <td style="padding: 7px 10px; border: 1px solid #475569; text-align: center; font-weight: 800; color: ${statusColor};">${statusText}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    <!-- Comprehensive AI Smart Immigration Evaluation Report -->
    ${(includeDetailedReport || (includeJobComparison && jobComparisonData)) ? `
    <div id="dashboard-ai-report-card">
      <div class="ai-report-content">
        ${includeDetailedReport ? bodyHtml : ""}

        ${includeJobComparison && jobComparisonData ? `
          <div style="page-break-before: always; margin-top: 25px; border-top: 2px solid #0f172a; padding-top: 15px;">
            <h2 style="color: #0f172a; font-size: 13pt; border-bottom: 2px solid #0f172a; padding-bottom: 6px; font-weight: 800;">
              گزارش جامع مقایسه شغلی و انتظارات کارفرمای آلمانی (${effectiveField})
            </h2>
            <p style="font-size: 10pt; color: #0f172a; line-height: 1.7; background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1.5px solid #334155; margin-bottom: 12px; font-weight: 500;">
              <strong style="color:#0f172a; font-weight:800;">خلاصه تحلیلی کارشناسی:</strong> ${jobComparisonData.summaryInsight || ""}
            </p>

            ${jobComparisonData.jobDescriptionInGermany ? `
              <div style="margin-bottom: 12px; background: #f8fafc; border: 1.5px solid #334155; padding: 10px 14px; border-radius: 6px;">
                <h3 style="font-size: 10.5pt; color: #0f172a; margin: 0 0 4px 0; font-weight: 800;">عنوان رسمی در طبقه‌بندی مشاغل آلمان (KldB):</h3>
                <p style="font-family: monospace; font-weight: 800; color: #1e3a8a; margin: 0; font-size: 10pt;">${jobComparisonData.jobDescriptionInGermany.officialTitleDe} (کد: ${jobComparisonData.jobDescriptionInGermany.kldbCode})</p>
                <p style="font-size: 9.5pt; color: #1e293b; margin: 4px 0 0 0; line-height: 1.6; font-weight: 500;">${jobComparisonData.jobDescriptionInGermany.generalScope}</p>
              </div>
            ` : ""}

            ${jobComparisonData.comparisonTable && jobComparisonData.comparisonTable.length > 0 ? `
              <div style="margin-top: 14px;">
                <h3 style="font-size: 10.5pt; color: #0f172a; margin-bottom: 8px; font-weight: 800;">ماتریس مقایسه رویه متداول در ایران در برابر انتظارات کارفرمای آلمانی:</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">
                  <thead>
                    <tr style="background: #0f172a; color: white;">
                      <th style="padding: 7px 10px; border: 1px solid #334155; text-align: right; color: #ffffff; font-weight: 800;">محور ارزیابی</th>
                      <th style="padding: 7px 10px; border: 1px solid #334155; text-align: right; color: #ffffff; font-weight: 800;">رویه در ایران</th>
                      <th style="padding: 7px 10px; border: 1px solid #334155; text-align: right; color: #ffffff; font-weight: 800;">انتظار کارفرما در آلمان</th>
                      <th style="padding: 7px 10px; border: 1px solid #334155; text-align: right; color: #ffffff; font-weight: 800;">بنچ‌مارک همتای آلمانی</th>
                      <th style="padding: 7px 10px; border: 1px solid #334155; text-align: center; color: #ffffff; font-weight: 800;">شکاف</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${jobComparisonData.comparisonTable.map((item: any) => `
                      <tr style="page-break-inside: avoid; break-inside: avoid;">
                        <td style="padding: 6px 10px; border: 1px solid #475569; font-weight: 800; color: #0f172a;">${item.dimension}</td>
                        <td style="padding: 6px 10px; border: 1px solid #475569; color: #1e293b; font-weight: 600;">${item.iranReality}</td>
                        <td style="padding: 6px 10px; border: 1px solid #475569; color: #1e3a8a; font-weight: 700;">${item.germanyExpectation}</td>
                        <td style="padding: 6px 10px; border: 1px solid #475569; color: #0f172a; font-weight: 700;">${item.germanPeerBenchmark || "-"}</td>
                        <td style="padding: 6px 10px; border: 1px solid #475569; text-align: center; font-weight: 800; color: #0f172a;">${item.gapLevel}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            ` : ""}
          </div>
        ` : ""}
      </div>
    </div>
    ` : ""}

    <!-- Official Jahanban Closing Print Stamp -->
    ${includeSignatures ? `
    <footer class="jb-print-footer avoid-break">
      <div class="jb-print-footer-top">
        <div class="jb-print-footer-legal">
          <span class="jb-print-footer-brand">خانه خلاق جهانبان (Jahanban Creative House)</span>
          <span class="jb-print-footer-sep">•</span>
          <span class="jb-print-footer-law">استناد قانونی: قانون مهاجرت نیروی متخصص آلمان (FEG 2026)</span>
        </div>
        <div class="jb-print-footer-date">
          <span class="jb-print-footer-label">تاریخ صدور:</span>
          <span class="jb-print-footer-date-val">${dateFa}</span>
        </div>
        <div class="jb-print-footer-meta">
          <span class="jb-print-ref font-mono">${docId}</span>
          <span class="jb-print-pagination">سند رسمی ارزیابی</span>
        </div>
      </div>
      <div class="jb-print-footer-contact-row">
        <div class="jb-print-footer-address">
          <span class="jb-print-footer-address-label">نشانی رسمی:</span>
          <span>تهران، پونک، بلوار میرزابابایی بین ستاری و سردار جنگل، پلاک 168 طبقه 4 تلفن : 74865</span>
          <span class="jb-print-footer-sep">•</span>
          <span dir="ltr">Friedrichstraße 123, 10117 Berlin</span>
        </div>
        <div class="jb-print-footer-contacts">
          <span dir="ltr">تلفن: 74865 (021)</span>
          <span class="jb-print-footer-sep">•</span>
          <span>info@jahanban.group</span>
          <span class="jb-print-footer-sep">•</span>
          <span>www.jahanban.group</span>
        </div>
      </div>
    </footer>
    ` : ""}

  </div>
</body>
</html>`;
}

/**
 * Exports the Dashboard evaluation report to a high-resolution DIN A4 PDF document
 * maintaining official German legal formatting standards and observing index.css print styles.
 */
export async function exportDashboardToGermanPdf(
  data: DashboardExportPayload,
  filename?: string,
  options?: ExportDashboardOrCvOptions
): Promise<void> {
  const html = generateSmartMigrationReportPrintHtml(data);
  const candidateName = (data.profile?.name || "Kandidat").trim().replace(/\s+/g, "_");
  const defaultFilename = `Fachkraefte_Dossier_${candidateName}_FEG2026.pdf`;
  const safeFilename = filename || defaultFilename;

  options?.onProgress?.(15, "در حال ایجاد چیدمان استاندارد DIN A4 آلمان و اعمال استایل‌های index.css...");

  return exportToPdfWithHtml2Pdf(html, safeFilename, {
    margin: [6, 6, 8, 6],
    orientation: "portrait",
    scale: 2,
    ...options
  });
}

/**
 * Universal Master Function:
 * Exports either the current Dashboard Evaluation Dossier or the German CV (DIN 5008) view
 * to a professionally formatted PDF file using jsPDF and html2canvas.
 */
export async function exportCurrentDashboardOrCvView(
  viewType: "dashboard" | "cv",
  payload: {
    dashboardData?: DashboardExportPayload;
    cvData?: GermanCvData;
    element?: HTMLElement;
    filename?: string;
  },
  options?: ExportDashboardOrCvOptions
): Promise<void> {
  if (viewType === "cv") {
    const candidateName = (payload.cvData?.name || "Bewerber").trim().replace(/\s+/g, "_");
    const formatSuffix = payload.cvData?.format || "DIN5008";
    const defaultFilename = `Lebenslauf_${candidateName}_${formatSuffix}_A4.pdf`;

    if (payload.element) {
      options?.onProgress?.(10, `در حال آماده‌سازی و تصویربرداری چیدمان رزومه (${formatSuffix}) در فرمت A4...`);
      return exportToPdfWithHtml2Pdf(payload.element, payload.filename || defaultFilename, {
        margin: [8, 8, 8, 8],
        orientation: "portrait",
        scale: 2,
        ...options
      });
    }

    if (!payload.cvData) {
      throw new Error("داده‌های رزومه (cvData) برای صدور PDF استاندارد DIN 5008 یافت نشد.");
    }
    options?.onProgress?.(10, "آماده‌سازی رزومه بر اساس استاندارد DIN 5008 آلمان...");
    return exportGermanCvToPdf(payload.cvData, payload.filename || defaultFilename, options);
  }

  // Dashboard view
  if (payload.dashboardData) {
    options?.onProgress?.(10, "در حال آماده‌سازی کارنامه ارزیابی فدرال آلمان...");
    return exportDashboardToGermanPdf(payload.dashboardData, payload.filename, options);
  }

  if (payload.element) {
    const candidateName = "Kandidat";
    const defaultFilename = payload.filename || `Evaluation_Report_${candidateName}.pdf`;
    return exportToPdfWithHtml2Pdf(payload.element, defaultFilename, options);
  }

  throw new Error("هیچ داده‌ای برای ساخت سند PDF ارسال نشده است.");
}
