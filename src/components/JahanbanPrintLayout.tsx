import React from "react";
// @ts-ignore
import jahanbanLogo from "../assets/images/jahanban_logo_1782078229949.jpg";

export interface JahanbanPrintLayoutProps {
  activeTab?: string;
  profile?: any;
  customSubject?: string;
  customDocId?: string;
  customDate?: string;
  className?: string;
  children?: React.ReactNode;
}

export const JahanbanPrintHeader: React.FC<{
  subject: string;
  docId: string;
  displayDate: string;
  className?: string;
}> = ({ subject, docId, displayDate, className = "" }) => (
  <header className={`jb-print-header ${className}`.trim()} id="jb-print-fixed-header" aria-hidden="true">
    {/* Right side: Jahanban Logo + Brand Info */}
    <div className="jb-print-brand">
      <img 
        src={jahanbanLogo} 
        alt="لوگوی گروه شرکت‌های جهانبان" 
        className="jb-print-logo"
        referrerPolicy="no-referrer"
      />
      <div className="jb-print-brand-text">
        <h1 className="jb-print-brand-title">گروه شرکت‌های جهانبان</h1>
        <p className="jb-print-brand-sub">خانه خلاق جهانبان | توسعه فناوری و هدایت مهاجرتی</p>
        <p className="jb-print-brand-system">سامانه هوشمند ارزیابی و جاب فایندر آلمان (نسخه ۲۰۲۶)</p>
      </div>
    </div>

    {/* Center: Document Subject with official badge */}
    <div className="jb-print-subject-box">
      <span className="jb-print-badge">سند رسمی ارزیابی و راهنمای تخصصی</span>
      <h2 className="jb-print-subject">{subject}</h2>
    </div>

    {/* Left side: Metadata Grid (Date, Doc ID, Classification) */}
    <div className="jb-print-meta">
      <div className="jb-print-meta-item">
        <span className="jb-print-meta-label">تاریخ صدور:</span>
        <span className="jb-print-meta-val">{displayDate}</span>
      </div>
      <div className="jb-print-meta-item">
        <span className="jb-print-meta-label">شماره سند:</span>
        <span className="jb-print-meta-val font-mono">{docId}</span>
      </div>
      <div className="jb-print-meta-item">
        <span className="jb-print-meta-label">مبنای قانونی:</span>
        <span className="jb-print-meta-val">FEG 2026 / بلوکارت</span>
      </div>
    </div>
  </header>
);

export const JahanbanPrintWatermark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`jb-print-watermark ${className}`.trim()} id="jb-print-fixed-watermark" aria-hidden="true">
    <img 
      src={jahanbanLogo} 
      alt="Jahanban Group Insignia" 
      className="jb-print-watermark-logo"
      referrerPolicy="no-referrer"
    />
    <div className="watermark-text-fa">گروه بین‌المللی شرکت‌های جهانبان</div>
    <div className="watermark-text-sub">JAHANBAN GROUP • CREATIVE HOUSE</div>
    <div className="watermark-text-legal">سند رسمی ارزیابی و راهنمای تخصصی مهاجرت کاری آلمان ۲۰۲۶</div>
  </div>
);

export interface JahanbanPrintFooterProps {
  docId: string;
  displayDate?: string;
  className?: string;
}

export const JahanbanPrintFooter: React.FC<JahanbanPrintFooterProps> = ({
  docId,
  displayDate,
  className = ""
}) => {
  const now = new Date();
  let defaultDate = "۱۸ شهریور ۱۴۰۵ (08.09.2026)";
  try {
    const dateFa = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(now);
    const dateEn = new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);
    defaultDate = `${dateFa} (${dateEn})`;
  } catch {
    // Fallback
  }

  const effectiveDate = displayDate || defaultDate;

  return (
    <footer
      className={`jb-print-footer ${className}`.trim()}
      id="jb-print-fixed-footer"
      data-date={effectiveDate}
      role="contentinfo"
      aria-label="پاورقی رسمی خانه خلاق جهانبان، نشانی و اطلاعات تماس"
      style={{ fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}
    >
      {/* Top Section: Brand Identity, Legal Basis, Date and Document Ref */}
      <div className="jb-print-footer-top flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-1.5">
        {/* Brand & Legal Basis */}
        <div className="jb-print-footer-legal flex items-center gap-2">
          <span className="jb-print-footer-brand font-black text-slate-900 text-xs">خانه خلاق جهانبان (Jahanban Creative House)</span>
          <span className="jb-print-footer-sep text-slate-400">•</span>
          <span className="jb-print-footer-law text-[11px] font-bold text-slate-700">
            استناد قانونی: قانون مهاجرت نیروی متخصص آلمان (FEG 2026)
          </span>
        </div>

        {/* Date & Timestamp */}
        <div className="jb-print-footer-date flex items-center gap-1.5 text-xs text-slate-800 font-bold">
          <span className="jb-print-footer-label text-slate-600">تاریخ صدور:</span>
          <span className="jb-print-footer-date-val text-slate-900 font-extrabold">{effectiveDate}</span>
        </div>

        {/* Pagination & Document Reference */}
        <div className="jb-print-footer-meta flex items-center gap-3">
          <div className="jb-print-pagination inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-900">
            <span className="jb-print-page-label">صفحه</span>
            <span className="jb-print-page-current"></span>
            <span className="jb-print-page-divider">از</span>
            <span className="jb-print-page-total"></span>
          </div>
          <div className="jb-print-ref font-mono font-bold text-[11px] text-slate-700" dir="ltr">
            {docId}
          </div>
        </div>
      </div>

      {/* Bottom Section: Official Company Address & Contact Information */}
      <div className="jb-print-footer-contact-row flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] text-slate-600 font-medium">
        <div className="jb-print-footer-address flex items-center gap-1.5 text-slate-700">
          <span className="jb-print-footer-address-label font-bold text-slate-900">نشانی رسمی:</span>
          <span>تهران، پونک، بلوار میرزابابایی بین ستاری و سردار جنگل، پلاک 168 طبقه 4 تلفن : 74865</span>
          <span className="jb-print-footer-sep text-slate-400">•</span>
          <span dir="ltr" className="font-mono text-slate-600">Friedrichstraße 123, 10117 Berlin</span>
        </div>
        <div className="jb-print-footer-contacts flex items-center gap-2 text-slate-800">
          <span className="jb-print-footer-phone font-bold" dir="ltr">تلفن: 74865 (021)</span>
          <span className="jb-print-footer-sep text-slate-400">•</span>
          <span className="jb-print-footer-email font-mono font-semibold text-slate-900">info@jahanban.group</span>
          <span className="jb-print-footer-sep text-slate-400">•</span>
          <span className="jb-print-footer-web font-mono font-extrabold text-indigo-900">www.jahanban.group</span>
        </div>
      </div>
    </footer>
  );
};

export const JahanbanPrintLayout: React.FC<JahanbanPrintLayoutProps> = ({
  activeTab = "dashboard",
  profile,
  customSubject,
  customDocId,
  customDate,
  className = "",
  children
}) => {
  // Format Persian Date & Gregorian Date
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
    // Fallback if Intl fails
  }

  const displayDate = customDate || `${dateFa} (${dateEn})`;

  // Determine Subject and Doc ID based on current active view
  let defaultSubject = "گزارش ارزیابی جامع شایستگی، انطباق ویزا و نقشه راه اشتغال آلمان";
  let defaultDocId = "JB-DE-2026-EVAL-REG";

  if (activeTab === "guide") {
    defaultSubject = "راهنمای جامع فرآیند مهاجرت کاری، مدارک سفارت و زندگی در آلمان";
    defaultDocId = "JB-DE-2026-GUIDE-FEG";
  } else if (activeTab === "roadmap" || activeTab === "monthly-roadmap") {
    defaultSubject = profile?.name 
      ? `سند رسمی نقشه راه مهاجرت کاری و برنامه‌ریزی اجرایی: ${profile.name}`
      : "سند رسمی نقشه راه مهاجرت کاری و برنامه‌ریزی ماهانه آلمان (FEG 2026)";
    const candidateId = profile?.name ? profile.name.replace(/\s+/g, "").slice(0, 5).toUpperCase() : "REG";
    defaultDocId = `JB-DE-2026-ROADMAP-${candidateId}`;
  } else if (activeTab === "dashboard") {
    defaultSubject = profile?.name 
      ? `گزارش ارزیابی جامع شایستگی و مهاجرت کاری متقاضی: ${profile.name}`
      : "گزارش ارزیابی جامع شایستگی، انطباق ویزا و نقشه راه اشتغال آلمان";
    const candidateId = profile?.name ? profile.name.replace(/\s+/g, "").slice(0, 5).toUpperCase() : "REG";
    defaultDocId = `JB-DE-2026-EVAL-${candidateId}`;
  }

  const subject = customSubject || defaultSubject;
  const docId = customDocId || defaultDocId;

  if (children) {
    return (
      <div className={`jb-print-container-wrapper relative ${className}`.trim()}>
        <JahanbanPrintHeader subject={subject} docId={docId} displayDate={displayDate} />
        <JahanbanPrintWatermark />
        <div className="jb-print-body relative z-10">
          {children}
        </div>
        <JahanbanPrintFooter docId={docId} displayDate={displayDate} />
      </div>
    );
  }

  return (
    <>
      <JahanbanPrintHeader subject={subject} docId={docId} displayDate={displayDate} className={className} />
      <JahanbanPrintWatermark />
    </>
  );
};

export default JahanbanPrintLayout;
