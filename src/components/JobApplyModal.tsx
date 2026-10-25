import React, { useState } from "react";
import { SponsorshipJob } from "../types";
import { getGermanJobPortalLinks } from "../utils";
import {
  X,
  Send,
  Mail,
  Building2,
  Euro,
  Globe,
  Briefcase,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
  GraduationCap
} from "lucide-react";

interface JobApplyModalProps {
  job: SponsorshipJob | null;
  isOpen: boolean;
  onClose: () => void;
  applicantName?: string;
  applicantField?: string;
}

export const JobApplyModal: React.FC<JobApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  applicantName = "متقاضی محترم",
  applicantField = "متخصص"
}) => {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<"portals" | "email" | "checklist">("portals");

  if (!isOpen || !job) return null;

  const portalLinks = job.portalLinks || getGermanJobPortalLinks(job.jobTitle, job.companyName, job.location, job.website);
  const primaryEmail = job.email || `karriere@${(job.website || "firma.de").replace(/^https?:\/\//, "").replace(/\/.*$/, "")}`;
  const contactName = job.contactPerson || "Personalabteilung / Recruiting-Team";

  // Standard German Email Subject & Body according to DIN 5008
  const emailSubject = `Bewerbung als ${job.jobTitle} - ${applicantName !== "متقاضی محترم" ? applicantName : "Fachkraft"}`;

  const emailBody = `Sehr geehrte Damen und Herren,
${job.contactPerson ? `Sehr geehrte(r) Frau/Herr ${job.contactPerson},` : "Sehr geehrte Damen und Herren,"}

mit großem Interesse habe ich Ihre Stellenausschreibung als ${job.jobTitle} bei ${job.companyName} zur Kenntnis genommen.

Als qualifizierte Fachkraft im Bereich ${applicantField} mit einschlägiger Berufserfahrung passe ich ideal zu Ihren Anforderungen. Meine akademischen Qualifikationen entsprechen den Kriterien der Zentralstelle für ausländisches Bildungswesen (ZAB / KMK) und qualifizieren mich unmittelbar für das Visum zur qualifizierten Erwerbstätigkeit (§18g AufenthG - Blaue Karte EU).

In der Anlage finden Sie mein vollständiges Bewerbungsdossier (Lebenslauf nach deutschem Standard DIN 5008, Qualifikationsnachweise und Zeugnisse).

Über eine Einladung zu einem persönlichen Gespräch oder virtuellen Interview freue ich mich sehr.

Mit freundlichen Grüßen,
${applicantName !== "متقاضی محترم" ? applicantName : "[Ihr Vor- und Nachname]"}
`;

  const handleCopy = (text: string, type: "subject" | "body" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "subject") {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else if (type === "body") {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const mailtoUrl = `mailto:${encodeURIComponent(primaryEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-right">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-indigo-950/50 border border-indigo-400/30">
              <Building2 className="w-7 h-7 text-indigo-100" />
            </div>

            <div className="space-y-1.5 grow min-w-0 pr-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-indigo-400">{job.companyName}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  ✓ ثبت رسمی آلمان (Handelsregister)
                </span>
                {job.location && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-sky-400" />
                    <span>{job.location}</span>
                  </span>
                )}
              </div>

              <h2 className="text-lg md:text-xl font-black text-white leading-tight">
                مرکز اپلای و ارسال درخواست: {job.jobTitle}
              </h2>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-mono">
                  <Euro className="w-3.5 h-3.5" />
                  <span>سطح حقوق سالانه: {job.salary}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-purple-300 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>اسپانسری: {job.visaType || "§18g Blue Card"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("portals")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "portals"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>پورتال‌های اپلای فوری</span>
            </button>

            <button
              onClick={() => setActiveTab("email")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "email"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ایمیل رسمی آلمانی (Bewerbung)</span>
            </button>

            <button
              onClick={() => setActiveTab("checklist")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "checklist"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>چک‌لیست مدارک الزامی</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 grow">
          {/* Tab 1: Portals */}
          {activeTab === "portals" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-indigo-300">مسیرهای تاییدشده برای ارسال درخواست کاری به {job.companyName}</h4>
                  <p className="text-slate-400 leading-relaxed">
                    می‌توانید مستقیماً از طریق وب‌سایت استخدامی رسمی کارفرما یا سامانه‌های معتبر شغلی آلمان اقدام نمایید. رزومه شما باید مطابق استاندارد DIN 5008 آلمان باشد.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1. Official Employer Website */}
                {job.website && (
                  <a
                    href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 transition hover:shadow-lg hover:shadow-indigo-950/40 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-indigo-200">صفحه استخدام رسمی کارفرما</div>
                        <div className="text-[11px] text-slate-400">اپلای در پرتال کاریر {job.companyName}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-indigo-400 group-hover:translate-x-[-2px] transition" />
                  </a>
                )}

                {/* 2. StepStone Germany */}
                <a
                  href={portalLinks.stepstone}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition font-black text-xs">
                      ST
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-amber-200">StepStone Deutschland</div>
                      <div className="text-[11px] text-slate-400">بزرگ‌ترین پورتال مشاغل تخصصی آلمان</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-400 group-hover:translate-x-[-2px] transition" />
                </a>

                {/* 3. Arbeitsagentur Jobbörse */}
                <a
                  href={portalLinks.arbeitsagentur}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition font-black text-xs">
                      BA
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-emerald-200">اداره کار فدرال آلمان (BA / ZAV)</div>
                      <div className="text-[11px] text-slate-400">سامانه استعلام رسمی Jobbörse</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-[-2px] transition" />
                </a>

                {/* 4. LinkedIn Jobs */}
                <a
                  href={portalLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition font-black text-xs">
                      in
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-blue-200">LinkedIn Deutschland</div>
                      <div className="text-[11px] text-slate-400">ارتباط مستقیم با تیم جذب استعداد</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-400 group-hover:translate-x-[-2px] transition" />
                </a>

                {/* 5. Indeed Germany */}
                <a
                  href={portalLinks.indeed}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-sky-500/50 transition hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition font-black text-xs">
                      ID
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-sky-200">Indeed Deutschland</div>
                      <div className="text-[11px] text-slate-400">اپلای سریع با رزومه استاندارد</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-sky-400 group-hover:translate-x-[-2px] transition" />
                </a>

                {/* 6. XING DACH */}
                <a
                  href={portalLinks.xing}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/50 transition hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-105 transition font-black text-xs">
                      XG
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-teal-200">XING DACH Region</div>
                      <div className="text-[11px] text-slate-400">شبکه حرفه‌ای تخصصی کشور آلمان</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-teal-400 group-hover:translate-x-[-2px] transition" />
                </a>
              </div>
            </div>
          )}

          {/* Tab 2: Email Application */}
          {activeTab === "email" && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="text-slate-400 text-[11px]">ایمیل دریافت رزومه کارفرما:</div>
                    <div className="text-white font-mono font-bold text-sm flex items-center gap-2 mt-0.5">
                      <span>{primaryEmail}</span>
                      <button
                        onClick={() => handleCopy(primaryEmail, "email")}
                        className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-[10px]"
                      >
                        {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedEmail ? "کپی شد" : "کپی"}</span>
                      </button>
                    </div>
                  </div>

                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-950/50 transition cursor-pointer text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>باز کردن برنامه ایمیل (Mailto)</span>
                  </a>
                </div>

                {/* Email Subject */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] font-bold">موضوع ایمیل رسمی (Betreff):</span>
                    <button
                      onClick={() => handleCopy(emailSubject, "subject")}
                      className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copiedSubject ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSubject ? "کپی شد" : "کپی موضوع"}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-[11px] dir-ltr text-left select-all">
                    {emailSubject}
                  </div>
                </div>

                {/* Email Body Draft */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] font-bold">متن انگیزشی رسمی آلمانی طبق استاندارد DIN 5008:</span>
                    <button
                      onClick={() => handleCopy(emailBody, "body")}
                      className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copiedBody ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBody ? "کپی متن ایمیل" : "کپی کل متن"}</span>
                    </button>
                  </div>
                  <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-200 font-sans text-xs dir-ltr text-left whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto select-all">
                    {emailBody}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Checklist */}
          {activeTab === "checklist" && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>پکیج کامل تقاضای کار آلمان (Bewerbungsmappe)</span>
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  طبق الزامات اداره کار فدرال آلمان (ZAV) و کارفرمایان این حوزه، پیش از فشردن دکمه اپلای اطمینان حاصل کنید که اسناد زیر با مشخصات شغلی {job.jobTitle} تطابق دارند:
                </p>

                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">۱. رزومه استاندارد آلمانی (Tabellarischer Lebenslauf - DIN 5008)</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">شامل عکس پرسنلی حرفه‌ای، تاریخ دقیق میلادی و سوابق متناسب با تخصص.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">۲. انگیزه‌نامه هدفمند (Anschreiben)</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">تنظیم شده اختصاصی برای کارفرمای {job.companyName} با تاکید بر حل چالش‌های فنی شرکت.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">۳. تاییدیه ارزش‌گذاری مدرک تحصیلی (ZAB / Anabin H+)</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">تایید اعتبار دانشگاه و رشته تحصیلی در سامانه آنابین برای صدور بی قیدوشرط ویزای بلوکارت §18g.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">۴. مدارک مهارت زبان (Zertifikate)</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">زبان کاری این موقعیت {job.workLanguage || "انگلیسی / آلمانی"} است. مدارک معتبر بین‌المللی ارائه‌پذیر باشند.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-slate-400 text-[11px]">
            <span>سطح حقوق مصوب: </span>
            <span className="text-emerald-400 font-bold font-mono">{job.salary}</span>
            <span className="mx-2">•</span>
            <span>شرکت: </span>
            <span className="text-white font-bold">{job.companyName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              بستن
            </button>

            <a
              href={job.website ? (job.website.startsWith("http") ? job.website : `https://${job.website}`) : portalLinks.stepstone}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>اقدام و ارسال نهایی رزومه</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
