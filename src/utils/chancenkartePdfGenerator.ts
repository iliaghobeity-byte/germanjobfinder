export interface ChancenkarteReportData {
  applicantName?: string;
  field?: string;
  age: string; // 'under35' | '35-40' | 'older'
  ageNum?: number;
  qualType: string; // 'full' | 'partial' | 'none'
  germanLevel: string; // 'none' | 'A1' | 'A2' | 'B1' | 'B2'
  englishLevel: string; // 'none' | 'B2' | 'C1'
  experience: string; // '5+' | '2-5' | 'less'
  germanExp: boolean;
  spouse: boolean;
  totalPoints: number;
  reportDate?: string;
}

export function generateChancenkarteHtml(data: ChancenkarteReportData): string {
  const name = data.applicantName?.trim() || "متقاضی محترم / Bewerber/in";
  const field = data.field?.trim() || "Fachkraft (کارشناس / متخصص)";
  const today = data.reportDate || new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const isQualified = data.totalPoints >= 6;
  const reportRef = `CK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Age label & points
  let ageLabel = "بیش از ۴۰ سال / Über 40 Jahre";
  let agePts = 0;
  if (data.age === "under35") {
    ageLabel = "زیر ۳۵ سال / Unter 35 Jahre";
    agePts = 2;
  } else if (data.age === "35-40") {
    ageLabel = "بین ۳۵ تا ۴۰ سال / 35 bis 40 Jahre";
    agePts = 1;
  }

  // Qualification label & points
  let qualLabel = "فاقد معادل‌سازی یا صرفاً دیپلم / Keine Anerkennung";
  let qualPts = 0;
  if (data.qualType === "full") {
    qualLabel = "معادل‌سازی کامل مدرک تحصیلی یا دانشگاهی در آنابین (Volle Anerkennung / Anabin H+)";
    qualPts = 4;
  } else if (data.qualType === "partial") {
    qualLabel = "معادل‌سازی جزئی مدرک مهارتی (Teilweise Anerkennung / Ausgleichsmaßnahme)";
    qualPts = 4;
  }

  // German level label & points
  let germanLabel = "پائین‌تر از A1 / Keine Kenntnisse";
  let germanPts = 0;
  if (data.germanLevel === "A1") {
    germanLabel = "سطح A1 مدرک بین‌المللی (گوته/تلک)";
    germanPts = 1;
  } else if (data.germanLevel === "A2") {
    germanLabel = "سطح A2 مدرک بین‌المللی (گوته/تلک)";
    germanPts = 2;
  } else if (data.germanLevel === "B1") {
    germanLabel = "سطح B1 دانشگاهی / گوته / ÖSD";
    germanPts = 3;
  } else if (data.germanLevel === "B2") {
    germanLabel = "سطح B2 یا بالاتر (B2, C1) - تسلط کامل";
    germanPts = 4;
  }

  // English level label & points
  let englishLabel = "بدون مدرک رسمی / Keine";
  let englishPts = 0;
  if (data.germanLevel === "none" || data.germanLevel === "A1") {
    if (data.englishLevel === "B2") {
      englishLabel = "سطح B2 زبان انگلیسی (IELTS 5.5 - 6.5)";
      englishPts = 1;
    } else if (data.englishLevel === "C1") {
      englishLabel = "سطح C1 زبان انگلیسی (IELTS 7.0+)";
      englishPts = 2;
    }
  } else {
    if (data.englishLevel === "C1") {
      englishLabel = "سطح C1 عالی انگلیسی (IELTS 7.0+) [امتیاز ترکیبی]";
      englishPts = 1;
    } else if (data.englishLevel === "B2") {
      englishLabel = "سطح B2 انگلیسی (IELTS 5.5 - 6.5)";
      englishPts = 0;
    }
  }

  // Experience label & points
  let expLabel = "کمتر از ۲ سال سابقه کار تخصصی / Unter 2 Jahre";
  let expPts = 0;
  if (data.experience === "5+") {
    expLabel = "حداقل ۵ سال سابقه کار مرتبط در ۷ سال اخیر (5+ Jahre)";
    expPts = 3;
  } else if (data.experience === "2-5") {
    expLabel = "حداقل ۲ سال سابقه کار مرتبط در ۵ سال اخیر (2-5 Jahre)";
    expPts = 2;
  }

  // Connection & spouse
  const germanExpPts = data.germanExp ? 1 : 0;
  const spousePts = data.spouse ? 1 : 0;

  return `<!DOCTYPE html>
<html lang="de" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>Chancenkarte_Evaluation_${name.replace(/\s+/g, "_")}</title>
  <style>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-size: 9.5pt;
      line-height: 1.45;
      box-sizing: border-box;
    }

    .report-container {
      width: 100%;
      max-width: 170mm;
      margin: 0 auto;
      box-sizing: border-box;
    }

    /* Header styling */
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .federal-title {
      font-size: 14pt;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #0f172a;
      text-transform: uppercase;
    }
    .federal-subtitle {
      font-size: 8.5pt;
      color: #475569;
      font-weight: 600;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 8pt;
      color: #475569;
    }
    .badge-status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 800;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .badge-qualified {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
    }
    .badge-gap {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }

    /* Section styling */
    .section-title {
      font-size: 10pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 14px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }

    /* Applicant info bar */
    .info-grid {
      display: table;
      width: 100%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 8.5pt;
    }
    .info-row {
      display: table-row;
    }
    .info-cell-label {
      display: table-cell;
      font-weight: 700;
      color: #475569;
      padding: 3px 6px;
      width: 25%;
    }
    .info-cell-value {
      display: table-cell;
      font-weight: 600;
      color: #0f172a;
      padding: 3px 6px;
      width: 25%;
    }

    /* Score meter hero box */
    .score-banner {
      background: ${isQualified ? "#f0fdf4" : "#fffbeb"};
      border: 1.5px solid ${isQualified ? "#86efac" : "#fcd34d"};
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 14px;
      display: table;
      width: 100%;
    }
    .score-left {
      display: table-cell;
      vertical-align: middle;
      width: 32%;
      text-align: center;
      border-right: 1px solid ${isQualified ? "#bbf7d0" : "#fef08a"};
      padding-right: 12px;
    }
    .score-number {
      font-size: 28pt;
      font-weight: 900;
      color: ${isQualified ? "#15803d" : "#b45309"};
      line-height: 1;
    }
    .score-max {
      font-size: 11pt;
      font-weight: 600;
      color: #64748b;
    }
    .score-right {
      display: table-cell;
      vertical-align: middle;
      padding-left: 16px;
      width: 68%;
    }
    .score-headline {
      font-size: 11pt;
      font-weight: 800;
      color: ${isQualified ? "#166534" : "#92400e"};
      margin-bottom: 4px;
    }
    .score-desc {
      font-size: 8.5pt;
      color: #334155;
      line-height: 1.4;
    }

    /* Table */
    .table-points {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 12px;
    }
    .table-points th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 800;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      font-size: 8pt;
      text-transform: uppercase;
    }
    .table-points td {
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    .table-points tr:nth-child(even) {
      background: #f8fafc;
    }
    .col-category {
      font-weight: 700;
      color: #0f172a;
      width: 30%;
    }
    .col-detail {
      color: #334155;
      width: 55%;
    }
    .col-points {
      text-align: center;
      font-weight: 800;
      width: 15%;
      font-size: 9.5pt;
    }
    .total-row {
      background: #e2e8f0 !important;
      font-weight: 900;
      border-top: 2px solid #0f172a;
    }

    /* Checklists */
    .checklist-grid {
      display: table;
      width: 100%;
      margin-top: 6px;
      margin-bottom: 10px;
    }
    .check-col {
      display: table-cell;
      width: 50%;
      vertical-align: top;
      padding-right: 8px;
    }
    .check-item {
      font-size: 8pt;
      color: #334155;
      margin-bottom: 4px;
      padding-left: 14px;
      position: relative;
    }
    .check-item::before {
      content: "✔";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: bold;
    }

    /* Footer legal note */
    .footer-legal {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      font-size: 7.5pt;
      color: #64748b;
      line-height: 1.35;
      display: table;
      width: 100%;
    }
    .footer-left {
      display: table-cell;
      width: 75%;
    }
    .footer-right {
      display: table-cell;
      width: 25%;
      text-align: right;
      font-weight: bold;
    }
  </style>
</head>
<body>

<div class="report-container">

  <!-- Header -->
  <table class="header-table" style="border: 0;">
    <tr>
      <td style="vertical-align: top;">
        <div class="federal-title">Bundesrepublik Deutschland</div>
        <div class="federal-subtitle">Chancenkarte gem. § 20a AufenthG • Formeller Evaluierungsbericht</div>
        <div style="font-size: 8pt; color: #64748b; margin-top: 2px;">German Opportunity Card Official Points Assessment Report</div>
      </td>
      <td class="meta-box" style="vertical-align: top;">
        <div><strong>Referenz-Nr.:</strong> ${reportRef}</div>
        <div><strong>Datum:</strong> ${today}</div>
        <div class="badge-status ${isQualified ? "badge-qualified" : "badge-gap"}">
          ${isQualified ? "BERECHTIGT / QUALIFIED (≥ 6 Pkt.)" : "ZUSATZPUNKTE ERFORDERLICH (< 6 Pkt.)"}
        </div>
      </td>
    </tr>
  </table>

  <!-- Applicant Data -->
  <div class="info-grid">
    <div class="info-row">
      <div class="info-cell-label">نام متقاضی (Bewerber):</div>
      <div class="info-cell-value">${name}</div>
      <div class="info-cell-label">رشته / تخصص (Fachbereich):</div>
      <div class="info-cell-value">${field}</div>
    </div>
    <div class="info-row">
      <div class="info-cell-label">سطح زبان آلمانی (Deutsch):</div>
      <div class="info-cell-value">${data.germanLevel.toUpperCase()}</div>
      <div class="info-cell-label">سطح زبان انگلیسی (Englisch):</div>
      <div class="info-cell-value">${data.englishLevel.toUpperCase()}</div>
    </div>
  </div>

  <!-- Score Banner -->
  <div class="score-banner">
    <div class="score-left">
      <div class="score-number">${data.totalPoints}</div>
      <div class="score-max">از ۱۰ امتیاز (Max 10)</div>
      <div style="font-size: 7.5pt; color: #64748b; margin-top: 2px;">حداقل قبولی: ۶ امتیاز</div>
    </div>
    <div class="score-right">
      <div class="score-headline">
        ${isQualified 
          ? "تبریک! احراز حد نصاب قانونی کارت فرصت آلمان" 
          : "نیاز به کسب امتیازات تکمیلی جهت رسیدن به حد نصاب"}
      </div>
      <div class="score-desc">
        ${isQualified
          ? "متقاضی با کسب " + data.totalPoints + " امتیاز، شرط قانونی بند ۲۰a قانون اقامت آلمان (Aufenthaltsgesetz) را کسب نموده و مجاز به تشکیل پرونده ویزای جستجوی کار کارت فرصت در سفارت فدرال آلمان می‌باشد."
          : "مجموع امتیاز فعلی شما " + data.totalPoints + " امتیاز است. جهت واجد شرایط شدن، ارتقاء مدرک زبان آلمانی به سطوح بالاتر (B1/B2) یا افزایش سوابق معادل‌سازی شده توصیه می‌گردد."
        }
      </div>
    </div>
  </div>

  <!-- Detailed Points Table -->
  <div class="section-title">
    <span>۱. جدول تفکیک امتیازات رسمی (Punkteaufschlüsselung)</span>
    <span style="font-size: 8pt; font-weight: normal; color: #475569;">§ 20a Abs. 2 AufenthG</span>
  </div>

  <table class="table-points">
    <thead>
      <tr>
        <th class="col-category">دسته‌بندی ارزیابی (Kategorie)</th>
        <th class="col-detail">وضعیت اعلامی و استناد قانونی (Status & Nachweis)</th>
        <th class="col-points">امتیاز (Punkte)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="col-category">معادل‌سازی مدرک تحصیلی<br><span style="font-size: 7pt; color: #64748b;">Berufsqualifikation</span></td>
        <td class="col-detail">${qualLabel}</td>
        <td class="col-points" style="color: #0284c7;">+${qualPts}</td>
      </tr>
      <tr>
        <td class="col-category">مهارت زبان آلمانی<br><span style="font-size: 7pt; color: #64748b;">Deutschkenntnisse</span></td>
        <td class="col-detail">${germanLabel}</td>
        <td class="col-points" style="color: #0284c7;">+${germanPts}</td>
      </tr>
      <tr>
        <td class="col-category">مهارت زبان انگلیسی<br><span style="font-size: 7pt; color: #64748b;">Englischkenntnisse</span></td>
        <td class="col-detail">${englishLabel}</td>
        <td class="col-points" style="color: #0284c7;">+${englishPts}</td>
      </tr>
      <tr>
        <td class="col-category">سابقه کار تخصصی مرتبط<br><span style="font-size: 7pt; color: #64748b;">Berufserfahrung</span></td>
        <td class="col-detail">${expLabel}</td>
        <td class="col-points" style="color: #0284c7;">+${expPts}</td>
      </tr>
      <tr>
        <td class="col-category">رده سنی متقاضی<br><span style="font-size: 7pt; color: #64748b;">Alterskategorie</span></td>
        <td class="col-detail">${ageLabel}</td>
        <td class="col-points" style="color: #0284c7;">+${agePts}</td>
      </tr>
      <tr>
        <td class="col-category">امتیاز بونوس اقامت قبلی آلمان<br><span style="font-size: 7pt; color: #64748b;">Voraufenthalt Deutschland</span></td>
        <td class="col-detail">${data.germanExp ? "حداقل ۶ ماه اقامت قانونی در ۵ سال اخیر در آلمان (تایید شده)" : "بدون سابقه اقامت ۶ ماهه قبلی"}</td>
        <td class="col-points" style="color: #0284c7;">+${germanExpPts}</td>
      </tr>
      <tr>
        <td class="col-category">امتیاز بونوس اقدام با همسر<br><span style="font-size: 7pt; color: #64748b;">Ehegatte / Lebenspartner</span></td>
        <td class="col-detail">${data.spouse ? "همسر متقاضی نیز واجد شرایط پایه کارت فرصت است (تایید شده)" : "اقدام انفرادی یا بدون شرایط همسر"}</td>
        <td class="col-points" style="color: #0284c7;">+${spousePts}</td>
      </tr>
      <tr class="total-row">
        <td colspan="2" style="text-align: right; padding-right: 14px; font-size: 9pt;">
          مجموع کل امتیازات احراز شده (Gesamtpunktzahl):
        </td>
        <td class="col-points" style="color: ${isQualified ? "#16a34a" : "#d97706"}; font-size: 11pt;">
          ${data.totalPoints} / 10
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Mandatory Pre-conditions & Embassy Checklist -->
  <div class="section-title">
    <span>۲. پیش‌نیازهای اجباری و چک‌لیست مدارک سفارت (Checkliste der Botschaft)</span>
    <span style="font-size: 8pt; font-weight: normal; color: #475569;">Grundvoraussetzungen</span>
  </div>

  <div class="checklist-grid">
    <div class="check-col">
      <div style="font-size: 8.5pt; font-weight: bold; color: #0f172a; margin-bottom: 4px;">پیش‌نیازهای بنیادین ورود به سیستم:</div>
      <div class="check-item">داشتن حداقل ۲ سال آموزش فنی/دانشگاهی معتبر در کشور مبدا</div>
      <div class="check-item">اثبات مدرک زبان حداقل A1 آلمانی یا حداقل B2 انگلیسی معتبر</div>
      <div class="check-item">تأمین تمکن مالی (حساب مسدود شده ماهانه ۱,۰۲۷ یورو در آلمان)</div>
    </div>
    <div class="check-col">
      <div style="font-size: 8.5pt; font-weight: bold; color: #0f172a; margin-bottom: 4px;">مدارک تکمیلی لازم برای مصاحبه ویزا:</div>
      <div class="check-item">رزومه آلمانی استاندارد طبق قاعده دو ستونه (DIN 5008 Lebenslauf)</div>
      <div class="check-item">انگیزه‌نامه کاری به زبان آلمانی جهت اهداف جستجوی کار</div>
      <div class="check-item">تأییدیه ارزشیابی مدارک (ZAB Zeugnisbewertung / Anabin H+)</div>
      <div class="check-item">بیمه مسافرتی معتبر شنگن (Incoming Krankenversicherung)</div>
    </div>
  </div>

  <!-- Footer Notice -->
  <div class="footer-legal">
    <div class="footer-left">
      این سند بر اساس آخرین ضوابط رسمی بازنگری قانون مهاجرت نیروی ماهر آلمان (FEG 2024–2026) تولید شده است و به عنوان مستند ارزیابی مقدماتی شانس دریافت ویزا قابل ارائه است.
      <br><strong>Rechtsgrundlage:</strong> Gesetz über den Aufenthalt, die Erwerbstätigkeit und die Integration von Ausländern im Bundesgebiet (§ 20a Chancenkarte).
    </div>
    <div class="footer-right">
      German Career Compass<br>
      <span style="font-size: 6.5pt; font-weight: normal; color: #94a3b8;">Digitally Verified Assessment</span>
    </div>
  </div>

</div>

</body>
</html>`;
}
