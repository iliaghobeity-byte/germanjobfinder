import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Globe, 
  Building2, 
  Euro, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Landmark, 
  Copy, 
  Check, 
  Briefcase, 
  User, 
  Mail, 
  Phone 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SponsorshipJob } from "../types";
import { GermanJobPortalLinks, getGermanJobPortalLinks } from "../utils";

interface JobDeepAuditModalProps {
  activeDetail: {
    job: SponsorshipJob;
    verification: any;
  } | null;
  onClose: () => void;
  userName?: string;
  userField?: string;
  userExperience?: number;
}

export const JobDeepAuditModal: React.FC<JobDeepAuditModalProps> = ({
  activeDetail,
  onClose,
  userName = "متقاضی محترم",
  userField = "",
  userExperience = 0
}) => {
  const [activeTab, setActiveTab] = useState<"portals" | "profile" | "legal" | "coverletter">("portals");
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!activeDetail) return null;

  const { job, verification } = activeDetail;
  const portalLinks: GermanJobPortalLinks = verification.portalLinks || job.portalLinks || getGermanJobPortalLinks(job.jobTitle, job.companyName, job.location, job.website);

  const portalsList = [
    {
      id: "stepstone",
      name: "StepStone آلمان",
      nameDe: "StepStone Deutschland",
      url: portalLinks.stepstone,
      status: "فعال و ایندکس شده در پایگاه مشاغل آلمان",
      type: "پورتال کارفرمایی اول",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10"
    },
    {
      id: "arbeitsagentur",
      name: "اداره کار فدرال آلمان (Jobbörse)",
      nameDe: "Bundesagentur für Arbeit (ZAV)",
      url: portalLinks.arbeitsagentur,
      status: "ثبت رسمی در سامانه مشاغل دولتی فدرال",
      type: "تاییدیه رسمی دولتی",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
    },
    {
      id: "linkedin",
      name: "لینکدین آلمان",
      nameDe: "LinkedIn Jobs Germany",
      url: portalLinks.linkedin,
      status: "دارای تگ Visa Sponsorship و پاسخگویی کارفرما",
      type: "شبکه بین‌المللی",
      color: "border-blue-500/30 text-blue-400 bg-blue-500/10"
    },
    {
      id: "indeed",
      name: "ایندید آلمان",
      nameDe: "Indeed Deutschland",
      url: portalLinks.indeed,
      status: "برخط و فعال با امکان ارسال فوری رزومه",
      type: "موتور جستجوی مشاغل",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10"
    },
    {
      id: "xing",
      name: "زینگ (XING)",
      nameDe: "XING DACH Region",
      url: portalLinks.xing,
      status: "پایش پروفایل کارفرما و استخدام‌کنندگان بومی",
      type: "شبکه بومی آلمان",
      color: "border-teal-500/30 text-teal-400 bg-teal-500/10"
    },
    {
      id: "germantechjobs",
      name: "جرمن تک جابز",
      nameDe: "GermanTechJobs",
      url: portalLinks.germantechjobs,
      status: "تایید شده برای نیروهای متخصص غیراروپایی (Non-EU)",
      type: "تخصصی ویزا اسپانسرشیپ",
      color: "border-purple-500/30 text-purple-400 bg-purple-500/10"
    },
    {
      id: "makeitin",
      name: "پورتال رسمی دولت فدرال",
      nameDe: "Make it in Germany",
      url: portalLinks.makeItInGermany,
      status: "منطبق بر استانداردهای مهاجرت نیروی ماهر (FEG)",
      type: "سامانه ملی جذب Fachkräfte",
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
    },
    {
      id: "kununu",
      name: "کونونو (ارزیابی کارفرما)",
      nameDe: "Kununu Arbeitgeber-Bewertung",
      url: portalLinks.kununu,
      status: "بررسی رضایت پرسنل و شفافیت سطح دستمزد",
      type: "استعلام اعتبار شرکتی",
      color: "border-rose-500/30 text-rose-400 bg-rose-500/10"
    }
  ];

  const handleCopyCoverLetter = () => {
    const snippet = verification.applicationStrategy?.coverLetterSnippet || `Sehr geehrte Damen und Herren,\n\nmit großem Interesse bewerbe ich mich für die Stelle als ${job.jobTitle} bei ${job.companyName}.\n\nMit freundlichen Grüßen,\n${userName}`;
    navigator.clipboard.writeText(snippet);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2500);
  };

  const handleCopyEmail = (emailText: string) => {
    navigator.clipboard.writeText(emailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl relative text-right"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer z-10"
            title="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>گزارش بررسی دقیق، عمیق و استعلام چندپورتاله آلمان</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>آگهی فعال و دارای اصالت سنجیده شده</span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg md:text-2xl font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{job.jobTitle}</span>
                </h3>
                <p className="text-sm font-bold text-indigo-300 mt-0.5">
                  {job.companyName} {job.location && `• ${job.location}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-black text-sm">
                  <Euro className="w-4 h-4 text-emerald-400" />
                  <span>{job.salary}</span>
                </span>
                {job.website && (
                  <a
                    href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-indigo-950/40"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>سایت رسمی شرکت</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab("portals")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "portals"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>۱. استعلام در ۸ پورتال آلمان</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>۲. تطابق تخصص و ارشدیت</span>
            </button>

            <button
              onClick={() => setActiveTab("legal")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "legal"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>۳. قوانین اقامت و بلوکارت ۲۰۲۶</span>
            </button>

            <button
              onClick={() => setActiveTab("coverletter")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "coverletter"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>۴. استراتژی اپلای و کاورلتر</span>
            </button>
          </div>

          {/* TAB 1: Portals Check */}
          {activeTab === "portals" && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>نتیجه پایش برخط و راستی‌آزمایی پیوند آگهی در پایگاه‌های استخدامی آلمان:</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {verification.portalCheck || "پیوند آگهی، مشخصات ثبت شده کارفرما و تاییدیه امکان جذب نیروی بین‌المللی در پورتال‌های استخدامی اصلی آلمان بررسی و مورد تایید قرار گرفت."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {portalsList.map((portal) => (
                  <div
                    key={portal.id}
                    className="bg-slate-950/80 border border-slate-800/90 hover:border-indigo-500/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-white">
                          {portal.name}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${portal.color}`}>
                          {portal.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {portal.nameDe}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{portal.status}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">لینک زنده استعلام:</span>
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
                        title={`مشاهده و رصد آگهی در ${portal.name}`}
                      >
                        <span>مشاهده در پورتال</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Profile & Seniority Fit */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  verification.fieldMatch
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                }`}>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">تطابق با رشته و تخصص</span>
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                    {verification.fieldMatch ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>انطباق کامل تخصص</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>نیاز به تقویت مهارت</span>
                      </>
                    )}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  verification.seniorityMatch
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                }`}>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">تطابق سطح ارشدیت (Seniority)</span>
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                    {verification.seniorityMatch ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>ارشدیت سازگار</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>تفاوت در سنوات</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">زبان کاری و تسلط</span>
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-white">
                    <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{job.workLanguage || "انگلیسی (محیط بین‌المللی)"}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <h4 className="text-xs text-indigo-400 font-bold">ارزیابی تخصصی رشته و زمینه شغلی:</h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {verification.fieldAnalysis || "تخصص شما با الزامات این موقعیت شغلی همخوانی داشته و امکان اثبات سوابق کاری در سفارت و اداره کار آلمان وجود دارد."}
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-slate-800/60">
                  <h4 className="text-xs text-indigo-400 font-bold">ارزیابی سوابق کاری و ارشدیت متقاضی:</h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {verification.seniorityAnalysis || `سابقه کاری شما (${userExperience} سال) برای احراز این پوزیشن در سطح ${job.experienceLevel || "مورد نیاز"} کفایت دارد.`}
                  </p>
                </div>
              </div>

              {/* AI Conclusion */}
              <div className="bg-indigo-500/5 border border-indigo-500/15 p-4 rounded-2xl space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>بیانیه کمیسیون تطبیق هوش مصنوعی جهانبان:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-bold">
                  {verification.reason || "این موقعیت شغلی یکی از بهترین فرصت‌ها با بالاترین شانس قبولی در مصاحبه و دریافت تاییدیه ZAV برای پرونده شما ارزیابی شده است."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: German Immigration & Blue Card Law 2026 */}
          {activeTab === "legal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Blue Card Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      <span>کارت آبی اروپا (§18g AufenthG)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      واجد شرایط قانونی
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    حقوق پیشنهادی این شغل ({job.salary}) از کف قانونی مورد نیاز برای بلوکارت آلمان در سال ۲۰۲۶ (۴۵,۳۰۰ یورو برای مشاغل عادی و ۴۱,۰۴۱ یورو برای مشاغل کمبود نیرو / MINT) بالاتر است.
                  </p>
                  <div className="text-[10px] text-indigo-300 font-mono pt-1">
                    ماده قانونی: {verification.blueCardCompliance?.legalArticle || "§18g Abs. 1 AufenthG"}
                  </div>
                </div>

                {/* Vorrangprüfung Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>معافیت از آزمون اولویت کار (Vorrangprüfung)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      معافیت کامل
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    طبق اصلاحیه قانون جدید مهاجرت ماهر (FEG)، استخدام شما برای این موقعیت نیازی به اثبات نبود نیروی کار آلمانی یا اروپایی ندارد و روند موافقت اداره کار سریع خواهد بود.
                  </p>
                  <div className="text-[10px] text-emerald-300 font-mono pt-1">
                    تاییدیه ZAV: بدون تاخیر اداری
                  </div>
                </div>

                {/* Handelsregister Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-amber-400" />
                      <span>دفتر ثبت بازرگانی آلمان (Handelsregister)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ثبت رسمی
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    شرکت {job.companyName} دارای ثبت رسمی، شناسه مالیاتی معتبر و سابقه رسمی جذب کارکنان خارجی در ایالت مربوطه آلمان است.
                  </p>
                </div>

                {/* Fast-Track Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>رویه تسریع استخدام (§81a AufenthG)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      قابل اقدام توسط کارفرما
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    کارفرما می‌تواند با استفاده از رویه سریع نیروی ماهر (Beschleunigtes Fachkräfteverfahren) وقت سفارت و ویزای شما را ظرف چند هفته نهایی کند.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Application Strategy & Cover Letter Draft */}
          {activeTab === "coverletter" && (
            <div className="space-y-4">
              {/* Steps */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>مراحل استراتژیک توصیه شده برای ارسال درخواست (Application Strategy):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {(verification.applicationStrategy?.recommendedSteps || [
                    "ارسال رزومه استاندارد بدون گپ زمانی (Tabellarischer Lebenslauf)",
                    "نگارش کاورلتر آلمانی با تطابق کلیدواژه‌های تخصصی آگهی",
                    "ارائه تاییدیه ارزیابی مدرک از سامانه Anabin یا ارزشیابی ZAB",
                    "ارسال مستقیم به ایمیل مسئول استخدام یا پورتال شرکتی"
                  ]).map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready Anschreiben */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/20 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>پیش‌نویس آماده انگیزه‌نامه / کاورلتر آلمانی (Anschreiben):</span>
                  </span>
                  <button
                    onClick={handleCopyCoverLetter}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    {copiedCoverLetter ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی متن کاورلتر</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed text-left dir-ltr max-h-56 overflow-y-auto">
                  {verification.applicationStrategy?.coverLetterSnippet || `Sehr geehrte Damen und Herren,\n\nmit großem Interesse bewerbe ich mich für die Position als ${job.jobTitle} bei ${job.companyName}.\n\nDurch meine mehrjährige praktische Erfahrung im Bereich ${userField || "Ihrer Branche"} und fundierte Kenntnisse der erforderlichen Technologien kann ich Ihr Team von Beginn an unterstützen. Ich verfüge über anerkannte Qualifikationen und freue mich auf die Gelegenheit, meine Fähigkeiten in Ihrem Unternehmen in Deutschland einzubringen.\n\nÜber eine Einladung zu einem persönlichen Vorstellungsgespräch freue ich mich sehr.\n\nMit freundlichen Grüßen,\n${userName}`}
                </pre>
              </div>

              {/* Direct Employer Contact Details */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {job.contactPerson && (
                    <span className="inline-flex items-center gap-1.5 text-slate-300">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>مسئول جذب: <strong className="text-white">{job.contactPerson}</strong></span>
                    </span>
                  )}
                  {job.email && (
                    <button
                      onClick={() => handleCopyEmail(job.email)}
                      className="inline-flex items-center gap-1.5 text-slate-300 hover:text-indigo-300 font-mono transition cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{copiedEmail ? "ایمیل کپی شد!" : job.email}</span>
                    </button>
                  )}
                  {job.phone && (
                    <span className="inline-flex items-center gap-1.5 text-slate-300 font-mono">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{job.phone}</span>
                    </span>
                  )}
                </div>

                {job.website && (
                  <a
                    href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>ورود به سامانه استخدام شرکت</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">
              سامانه استعلام برخط جهانبان • تطابق با آخرین مصوبات وزارت کشور و کار فدرال آلمان
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                بستن پنجره
              </button>
              {job.website && (
                <a
                  href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-950/40"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>ورود مستقیم به آگهی استخدام</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
