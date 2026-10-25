import { GuideArticle, GuideCategory } from "../data/migrationGuideData";

interface PrintGeneratorOptions {
  article: GuideArticle;
  category?: GuideCategory;
  logoBase64?: string;
  checkedItemKeys?: Record<string, boolean>;
}

export function generateGuidePrintHtml({
  article,
  category,
  logoBase64 = "",
  checkedItemKeys = {}
}: PrintGeneratorOptions): string {
  const now = new Date();
  
  // Format Persian Date
  const dateFa = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(now);

  // Format German Date
  const dateDe = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(now);

  // Unique Official Document Reference Number
  const docRef = `JB-DE-2026-${article.id.toUpperCase().replace(/-/g, "")}-REG`;
  const lastUpdate = "شهریور ۱۴۰۵ (سپتامبر ۲۰۲۶) - مطابق مصوبات جدید مهاجرتی FEG";
  const categoryTitleFa = category?.titleFa || "راهنمای تخصصی مهاجرت کاری";
  const categoryTitleDe = category?.titleDe || "Fachkräfteeinwanderung";

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${article.titleFa} - هلدینگ بین‌المللی جهانبان</title>
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
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, Tahoma, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 0;
      direction: rtl;
      font-size: 8.8pt;
      line-height: 1.6;
      box-sizing: border-box;
    }

    .doc-container {
      position: relative;
      border: 2px solid #0f172a;
      outline: 1px solid #cbd5e1;
      outline-offset: -4px;
      padding: 6mm 8mm;
      min-height: calc(297mm - 40mm);
      background: #ffffff;
      box-sizing: border-box;
    }

    /* Fixed Watermark on All Print Pages */
    .watermark-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      opacity: 0.042;
      z-index: -100;
      pointer-events: none;
      text-align: center;
      width: 480px;
    }

    .watermark-logo {
      width: 260px;
      height: auto;
      margin-bottom: 12px;
      filter: grayscale(100%);
    }

    .watermark-text {
      font-size: 34pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 2px;
      line-height: 1.2;
    }

    .watermark-sub {
      font-size: 16pt;
      font-weight: 700;
      color: #334155;
      margin-top: 4px;
      letter-spacing: 4px;
    }

    /* Top Official Letterhead */
    .letterhead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }

    .letterhead-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .letterhead-logo {
      width: 62px;
      height: 62px;
      border-radius: 8px;
      border: 1.5px solid #0f172a;
      object-fit: cover;
    }

    .brand-title-fa {
      font-size: 13pt;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.2px;
    }

    .brand-subtitle-fa {
      font-size: 7.5pt;
      font-weight: 600;
      color: #475569;
      margin: 2px 0 0 0;
    }

    .letterhead-left {
      text-align: left;
      direction: ltr;
    }

    .brand-title-en {
      font-size: 10.5pt;
      font-weight: 900;
      color: #1e3a8a;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .brand-subtitle-en {
      font-size: 6.8pt;
      color: #64748b;
      margin: 1px 0 0 0;
      font-family: monospace;
    }

    .security-badge {
      display: inline-block;
      margin-top: 4px;
      padding: 2px 6px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      font-size: 6.5pt;
      font-weight: 700;
      color: #334155;
    }

    /* Required Specific Metadata Box */
    .metadata-card {
      border: 1.8px solid #1e3a8a;
      background: #f8fafc;
      border-radius: 6px;
      margin-bottom: 14px;
      overflow: hidden;
    }

    .metadata-card-header {
      background: #1e3a8a;
      color: #ffffff;
      padding: 4px 10px;
      font-size: 8pt;
      font-weight: 800;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .meta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }

    .meta-table tr {
      border-bottom: 1px solid #e2e8f0;
    }

    .meta-table tr:last-child {
      border-bottom: none;
    }

    .meta-label {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 800;
      padding: 5px 8px;
      width: 15%;
      border-left: 1px solid #e2e8f0;
      white-space: nowrap;
      vertical-align: middle;
    }

    .meta-value {
      padding: 5px 9px;
      color: #0f172a;
      font-weight: 600;
      width: 35%;
      vertical-align: middle;
    }

    .meta-value-highlight {
      color: #1e3a8a;
      font-weight: 800;
    }

    /* Executive Summary Box */
    .summary-box {
      background: #eff6ff;
      border-right: 4px solid #2563eb;
      border-top: 1px solid #dbeafe;
      border-bottom: 1px solid #dbeafe;
      border-left: 1px solid #dbeafe;
      border-radius: 5px;
      padding: 9px 12px;
      margin-bottom: 14px;
      font-size: 8.4pt;
      color: #1e3a8a;
      line-height: 1.65;
      text-align: justify;
    }

    .summary-box strong {
      color: #1d4ed8;
      font-weight: 800;
    }

    /* Sections */
    .section-block {
      margin-bottom: 14px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .section-title {
      font-size: 10.5pt;
      font-weight: 900;
      color: #0f172a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 10px;
      margin-bottom: 7px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: #1e3a8a;
      color: #ffffff;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 800;
    }

    .section-content {
      font-size: 8.4pt;
      color: #334155;
      line-height: 1.65;
      text-align: justify;
      margin-bottom: 6px;
    }

    .section-content p {
      margin: 0 0 5px 0;
    }

    /* Checklist for physical print checking */
    .checklist-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 8px 10px;
      margin: 6px 0;
    }

    .checklist-title {
      font-size: 8pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 5px;
    }

    .checklist-item {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      font-size: 8pt;
      color: #1e293b;
      margin-bottom: 4px;
      line-height: 1.45;
    }

    .check-box-square {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1.5px solid #475569;
      border-radius: 2.5px;
      margin-top: 1.5px;
      flex-shrink: 0;
      background: #ffffff;
      text-align: center;
      line-height: 10px;
      font-size: 8pt;
      font-weight: bold;
    }

    /* Pro Tips box */
    .tips-box {
      background: #f0fdf4;
      border-right: 3.5px solid #16a34a;
      border: 1px solid #bbf7d0;
      border-right-width: 3.5px;
      border-radius: 5px;
      padding: 7px 10px;
      margin: 6px 0;
      font-size: 7.8pt;
      color: #14532d;
      line-height: 1.55;
    }

    .tips-title {
      font-weight: 800;
      color: #15803d;
      margin-bottom: 3px;
    }

    /* Warnings box */
    .warnings-box {
      background: #fefce8;
      border: 1px solid #fef08a;
      border-right: 3.5px solid #ca8a04;
      border-radius: 5px;
      padding: 7px 10px;
      margin: 6px 0;
      font-size: 7.8pt;
      color: #854d0e;
      line-height: 1.55;
    }

    .warnings-title {
      font-weight: 800;
      color: #a16207;
      margin-bottom: 3px;
    }

    /* Official Sources Footer Table */
    .sources-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 8px 10px;
      margin-top: 14px;
      page-break-inside: avoid !important;
    }

    .sources-title {
      font-size: 8pt;
      font-weight: 800;
      color: #1e3a8a;
      margin-bottom: 4px;
    }

    .source-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 7.2pt;
      color: #475569;
    }

    .source-tag {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      direction: ltr;
    }

    /* Signature & Legal Seal Block */
    .signature-block {
      margin-top: 18px;
      border: 1.5px dashed #64748b;
      background: #f8fafc;
      border-radius: 6px;
      padding: 8px 12px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .sig-statement {
      font-size: 7.4pt;
      color: #334155;
      line-height: 1.5;
      text-align: justify;
      margin-bottom: 10px;
    }

    .sig-grid {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .sig-box {
      flex: 1;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      padding: 6px 10px;
      border-radius: 4px;
      min-height: 62px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .sig-title {
      font-size: 7.5pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 2px;
    }

    .sig-placeholder {
      color: #94a3b8;
      font-size: 6.8pt;
      text-align: center;
      padding: 6px 0;
    }

    /* Print Footer Bar */
    .footer-bar {
      margin-top: 14px;
      border-top: 1px solid #94a3b8;
      padding-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 6.8pt;
      color: #64748b;
      direction: rtl;
      text-align: right;
    }

    .page-break {
      page-break-before: always;
      break-before: always;
    }
  </style>
</head>
<body>
  <div class="doc-container">
    <!-- Watermark Background for Every Printout -->
    <div class="watermark-container">
      ${logoBase64 ? `<img class="watermark-logo" src="data:image/jpeg;base64,${logoBase64}" alt="Jahanban" />` : ""}
      <div class="watermark-text">جهانبان</div>
      <div class="watermark-sub">JAHANBAN GROUP</div>
    </div>

    <!-- Official Top Letterhead -->
    <div class="letterhead">
      <div class="letterhead-right">
        ${logoBase64 ? `<img class="letterhead-logo" src="data:image/jpeg;base64,${logoBase64}" alt="لوگوی جهانبان" />` : `
          <div class="letterhead-logo" style="display:flex;align-items:center;justify-content:center;background:#1e3a8a;color:#fff;font-weight:900;font-size:14pt;">JB</div>
        `}
        <div>
          <h1 class="brand-title-fa">هلدینگ بین‌المللی و خانه خلاق جهانبان</h1>
          <p class="brand-subtitle-fa">سامانه تخصصی راهنمای جامع مهاجرت کاری، اقامت و استقرار در آلمان</p>
        </div>
      </div>

      <div class="letterhead-left">
        <div class="brand-title-en">JAHANBAN GROUP</div>
        <div class="brand-subtitle-en">GERMANY IMMIGRATION & MOBILITY PORTAL</div>
        <span class="security-badge">AMTLICHE DOKUMENTATION 2026</span>
      </div>
    </div>

    <!-- User-Requested Metadata Header Box -->
    <div class="metadata-card">
      <div class="metadata-card-header">
        <span>شناسنامه و مشخصات اداری سند راهنما (Dokumenten-Stammdaten)</span>
        <span style="font-family: monospace; font-size: 7pt; font-weight: normal; direction: ltr;">ID: ${docRef}</span>
      </div>
      <table class="meta-table">
        <tr>
          <td class="meta-label">۱. تیتر سند:</td>
          <td class="meta-value meta-value-highlight" colspan="3">
            <div style="font-size: 9.5pt; font-weight: 900; color: #1e3a8a;">${article.titleFa}</div>
            <div style="font-size: 7.5pt; color: #64748b; direction: ltr; text-align: right; font-family: monospace;">${article.titleDe}</div>
          </td>
        </tr>
        <tr>
          <td class="meta-label">۲. موضوع / دسته‌بندی:</td>
          <td class="meta-value">
            <strong>${categoryTitleFa}</strong>
            <span style="font-size: 7pt; color: #64748b;"> (${categoryTitleDe})</span>
          </td>
          <td class="meta-label">۳. شماره سند:</td>
          <td class="meta-value" style="font-family: monospace; font-weight: bold; color: #0f172a; direction: ltr; text-align: right;">
            ${docRef}
          </td>
        </tr>
        <tr>
          <td class="meta-label">۴. تاریخ صدور سند:</td>
          <td class="meta-value">
            <span>${dateFa}</span>
            <span style="font-size: 7pt; color: #64748b; direction: ltr;"> (${dateDe})</span>
          </td>
          <td class="meta-label">۵. آخرین آپدیت:</td>
          <td class="meta-value">
            <span style="color: #047857; font-weight: 700;">${lastUpdate}</span>
          </td>
        </tr>
        <tr>
          <td class="meta-label">۶. منبع و مبنای قانونی:</td>
          <td class="meta-value" colspan="3">
            <span style="color: #334155; font-weight: 600;">
              ${article.legalBasis || "قوانین مهاجرت نیروی متخصص آلمان (AufenthG / FEG) و مصوبات اداره فدرال کار (BA)"}
            </span>
            <span style="font-size: 7pt; color: #64748b; margin-right: 6px;">
              | پورتال‌های رسمی Auswärtiges Amt, BAMF, Make-it-in-Germany
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Executive Summary -->
    <div class="summary-box">
      <strong>چکیده اجرایی و اهداف راهنما:</strong>
      ${article.summary}
    </div>

    <!-- Main Content Sections -->
    ${article.sections.map((sec, idx) => `
      <div class="section-block">
        <div class="section-title">
          <span class="section-num">${idx + 1}</span>
          <span>${sec.heading}</span>
        </div>

        <div class="section-content">
          ${sec.content.map(p => `<p>${p}</p>`).join("")}
        </div>

        ${sec.tips && sec.tips.length > 0 ? `
          <div class="tips-box">
            <div class="tips-title">★ نکات طلایی و راهکارهای کاربردی کارشناسان جهانبان:</div>
            <ul style="margin: 0; padding-right: 18px;">
              ${sec.tips.map(t => `<li style="margin-bottom: 2px;">${t}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${sec.warnings && sec.warnings.length > 0 ? `
          <div class="warnings-box">
            <div class="warnings-title">⚠ هشدارهای مهم کنسولی و حقوقی (احتیاط‌های ضروری):</div>
            <ul style="margin: 0; padding-right: 18px;">
              ${sec.warnings.map(w => `<li style="margin-bottom: 2px;">${w}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${sec.checklist && sec.checklist.length > 0 ? `
          <div class="checklist-box">
            <div class="checklist-title">☑ چک‌لیست اقدامات اجرایی (ویژه کنترل و بررسی میدانی):</div>
            ${sec.checklist.map((item, cIdx) => {
              const itemKey = `${article.id}_sec${idx}_item${cIdx}`;
              const isChecked = !!checkedItemKeys[itemKey];
              return `
                <div class="checklist-item">
                  <span class="check-box-square">${isChecked ? "✓" : ""}</span>
                  <span>${item}</span>
                </div>
              `;
            }).join("")}
          </div>
        ` : ""}
      </div>
    `).join("")}

    <!-- Official Links & Federal Sources -->
    ${article.officialLinks && article.officialLinks.length > 0 ? `
      <div class="sources-box">
        <div class="sources-title">مراجع رسمی و درگاه‌های استعلام دولت فدرال آلمان:</div>
        <div class="source-list">
          ${article.officialLinks.map(link => `
            <div class="source-tag">
              <strong>${link.title}:</strong> ${link.url}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Verification & Signature Block -->
    <div class="signature-block">
      <div class="sig-statement">
        <strong>گواهی اصالت و انطباق محتوا:</strong> این مستند تحت نظارت مستقیم دپارتمان تخصصی حقوق مهاجرت و توسعه سرمایه انسانی هلدینگ بین‌المللی جهانبان تهیه گردیده و بر اساس آخرین آیین‌نامه‌ها و قوانین مصوب سال ۲۰۲۶ دولت فدرال آلمان اعتبارسنجی شده است. کلیه حقوق محفوظ است.
      </div>
      <div class="sig-grid">
        <div class="sig-box">
          <span class="sig-title">تاییدیه کارشناس ارشد مهاجرت (Jahanban Advisor)</span>
          <div class="sig-placeholder">مهر و امضای دیجیتال کارشناس پرونده</div>
        </div>
        <div class="sig-box">
          <span class="sig-title">دبیرخانه و امور کنسولی (Consular Affairs)</span>
          <div class="sig-placeholder">مهر رسمی هلدینگ جهانبان (Stempel)</div>
        </div>
      </div>
    </div>

    <!-- Official Footer -->
    <div class="footer-bar">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 4px; direction: rtl;">
        <span style="font-weight: 800;">خانه خلاق جهانبان (Jahanban Creative House) | وب‌سایت: www.jahanban.group</span>
        <span>مرجع رسمی راهنمای مهاجرت آلمان ۲۰۲۶ | کد سند: ${docRef}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.5pt; color: #475569; direction: rtl; text-align: right;">
        <span style="direction: rtl; unicode-bidi: embed;"><strong>نشانی رسمی:</strong> تهران، پونک، بلوار میرزابابایی بین ستاری و سردار جنگل، پلاک 168 طبقه 4 تلفن : 74865 | دفتر برلین: Friedrichstraße 123, 10117 Berlin</span>
        <span dir="ltr" style="font-family: monospace; font-weight: bold;">تلفن: 74865 (021) | info@jahanban.group</span>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;
}
