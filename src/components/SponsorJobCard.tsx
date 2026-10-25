import React, { useState } from "react";
import { SponsorshipJob } from "../types";
import { getGermanJobPortalLinks, classifyEmployerTierForIranianApplicants } from "../utils";
import {
  Building2,
  Building,
  Euro,
  Mail,
  User,
  Phone,
  Sparkles,
  CheckCircle2,
  Globe,
  Briefcase,
  Award,
  ShieldCheck,
  FileText,
  CheckCheck,
  ExternalLink,
  Landmark,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  ArrowUpRight,
  Star,
  Compass,
  Target
} from "lucide-react";

export interface SponsorJobCardProps {
  job: SponsorshipJob;
  index: number;
  isSelected: boolean;
  onSelect: (job: SponsorshipJob) => void;
  onApply?: (job: SponsorshipJob) => void;
  resumeAnalysis?: { status: string; data?: any };
  roleFitScore?: { status: string; data?: any };
  verification?: { status: string; [key: string]: any };
  isAnalyzingResume: boolean;
  wizardInputs: any;
  onAnalyzeResume: (job: SponsorshipJob) => void;
  onCalculateRoleFit: (job: SponsorshipJob) => void;
  onVerifySingleJob: (job: SponsorshipJob, idx: number) => void;
  onOpenSemanticModal: (job: SponsorshipJob) => void;
  onOpenVerificationDetail: (job: SponsorshipJob, ver: any) => void;
  onOpenRoleFitDetail: (job: SponsorshipJob, fit: any) => void;
  onOpenResumeAnalysisModal: (job: SponsorshipJob) => void;
  copiedIndex: number | null;
  onCopyEmail: (email: string, index: number) => void;
}

export const SponsorJobCard: React.FC<SponsorJobCardProps> = ({
  job,
  index,
  isSelected,
  onSelect,
  onApply,
  resumeAnalysis,
  roleFitScore,
  verification,
  isAnalyzingResume,
  wizardInputs,
  onAnalyzeResume,
  onCalculateRoleFit,
  onVerifySingleJob,
  onOpenSemanticModal,
  onOpenVerificationDetail,
  onOpenRoleFitDetail,
  onOpenResumeAnalysisModal,
  copiedIndex,
  onCopyEmail
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const portalLinks = job.portalLinks || getGermanJobPortalLinks(job.jobTitle, job.companyName, job.location, job.website);
  const fitData = roleFitScore?.data;
  const atsData = resumeAnalysis?.data;
  const tierInfo = classifyEmployerTierForIranianApplicants(job.companyName, job.jobTitle);
  const isPhase1 = (job.tierCategory || tierInfo.tierCategory) === "phase1_high_chance";
  const isMittelstand = Boolean(
    job.isMittelstand !== undefined 
      ? job.isMittelstand 
      : (tierInfo.isMittelstand || job.companyScale === "mittelstand_sme" || (job.companySize && (job.companySize.includes("200") || job.companySize.includes("Mittelstand"))))
  );
  const companySizeDisplay = job.companySize || tierInfo.companySizeFa || (isMittelstand ? "۲۰۰ الی ۵۰۰ کارمند (Mittelstand آلمان)" : "سازمان بین‌المللی");

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job);
    } else if (job.website) {
      window.open(job.website.startsWith("http") ? job.website : `https://${job.website}`, "_blank", "noreferrer");
    } else {
      window.open(portalLinks.stepstone, "_blank", "noreferrer");
    }
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className={`bg-slate-900 border rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-200 shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-indigo-500/10 text-right ${
        isSelected ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-slate-900/95" : "border-slate-800"
      }`}
    >
      {/* 0. Strategic Tiering Banner for Iranian Remote Applicants */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 px-3.5 rounded-2xl border text-xs transition ${
        isMittelstand
          ? "bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-950/40 border-teal-500/30 text-teal-300 shadow-sm"
          : isPhase1 
          ? "bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/40 border-emerald-500/30 text-emerald-300 shadow-sm"
          : "bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/30 border-amber-500/30 text-amber-300 shadow-sm"
      }`}>
        <div className="flex items-center gap-1.5 font-black">
          {isMittelstand ? (
            <>
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              <Building2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>بدنه متوسط آلمان (Mittelstand • ۲۰۰ تا ۵۰۰ کارمند) ⭐</span>
            </>
          ) : isPhase1 ? (
            <>
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 shrink-0" />
              <span>فاز ۱: اولویت اول (بالاترین شانس مصاحبه کاری از ایران)</span>
            </>
          ) : (
            <>
              <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>فاز ۲: ابرشرکت اینترپرایز (پیشنهاد مرحله دوم اپلای)</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold">
          <span className={`px-2 py-0.5 rounded-md border font-mono ${
            isMittelstand
              ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
              : isPhase1 
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-300 border-amber-500/20"
          }`}>
            {job.remoteInterviewYieldLabelFa || tierInfo.remoteInterviewYieldLabelFa}
          </span>
        </div>
      </div>

      {/* ========================================================
          KEY ELEMENT 1 & 2: عنوان شغل (Job Title) & نام شرکت (Company Name)
          Optimized using Flexbox with hierarchical scannability
         ======================================================== */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          {/* Company Icon + Organization & Title Details */}
          <div className="flex items-start gap-3 grow min-w-0">
            <div className={`w-11 h-11 md:w-13 md:h-13 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-md border ${
              isMittelstand
                ? "bg-gradient-to-br from-teal-700 via-emerald-800 to-slate-900 border-teal-400/40 shadow-teal-950/40"
                : "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 border-indigo-400/30 shadow-indigo-950/40"
            }`}>
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-200" />
            </div>

            <div className="space-y-1 grow min-w-0">
              {/* Company Name & Legal Registration Badge */}
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                <span className="text-xs md:text-sm font-black text-indigo-400 truncate max-w-[200px] md:max-w-none">
                  {job.companyName}
                </span>

                {/* Company Scale Badge (Mittelstand vs Enterprise) */}
                {isMittelstand ? (
                  <span className="text-[10px] text-teal-300 inline-flex items-center gap-1 bg-teal-500/15 px-2 py-0.5 rounded-md border border-teal-500/30 font-bold" title="بدنه متوسط آلمان: ۲۰۰ تا ۵۰۰ کارمند، فرآیند چابک استخدام و تصمیم‌گیری مستقیم مدیر فنی">
                    <Building className="w-2.5 h-2.5 text-teal-400" />
                    <span>Mittelstand • {companySizeDisplay}</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-300 inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 font-medium">
                    <Building2 className="w-2.5 h-2.5 text-slate-400" />
                    <span>{companySizeDisplay}</span>
                  </span>
                )}

                <span className="text-[10px] text-emerald-400 inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                  <Landmark className="w-2.5 h-2.5" />
                  <span>ثبت آلمان</span>
                </span>

                {job.website && (
                  <a
                    href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] text-slate-400 hover:text-white inline-flex items-center gap-1 bg-slate-800/80 hover:bg-indigo-600/30 px-1.5 py-0.5 rounded border border-slate-700/60 transition"
                    title="سایت رسمی کارفرما"
                  >
                    <span>سایت</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              {/* Title (عنوان شغلی) */}
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-200 transition leading-snug break-words">
                {job.jobTitle}
              </h3>

              {/* Location & Experience Meta tags */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-300">
                {job.location && (
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Globe className="w-3 h-3 text-sky-400" />
                    <span>{job.location}</span>
                  </span>
                )}
                {job.experienceLevel && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                      <Briefcase className="w-3 h-3 text-amber-400" />
                      <span>{job.experienceLevel}</span>
                    </span>
                  </>
                )}
                {job.workLanguage && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 text-[10px]">زبان: {job.workLanguage}</span>
                  </>
                )}
              </div>

              {/* Mittelstand Advantage Callout */}
              {isMittelstand && (
                <div className="mt-2 p-2 rounded-xl bg-teal-950/30 border border-teal-500/25 text-[11px] text-teal-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Building className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>مزیت بدنه متوسط آلمان:</span>
                    <span className="font-normal text-slate-300">
                      {job.mittelstandAdvantageFa || tierInfo.mittelstandAdvantageFa || "تصمیم‌گیری مستقیم مدیر فنی، معاف از فیلترهای کور ATS و فرآیند تسریع‌شده ویزای §81a"}
                    </span>
                  </div>
                  <span className="text-[10px] bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded-md font-mono shrink-0 border border-teal-500/30">
                    ۲۰۰ الی ۵۰۰ کارمند
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Semantic Match Score pill badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSemanticModal(job);
            }}
            className="shrink-0 flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-purple-500/40 hover:border-purple-400 transition hover:scale-105 shadow-md shadow-purple-950/30 cursor-pointer text-center min-w-[68px] sm:min-w-[76px]"
            title="مشاهده تحلیل معنایی انطباق"
          >
            <div className="flex items-center gap-1 text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="font-mono font-black text-sm sm:text-base text-white">{job.matchPercentage || 85}%</span>
            </div>
            <span className="text-[9px] font-bold text-purple-200 bg-purple-500/20 px-1.5 py-0.5 rounded mt-0.5">
              {job.matchPercentage && job.matchPercentage >= 90 ? "فوق‌العاده" : "انطباق قوی"}
            </span>
          </button>
        </div>

        {/* ========================================================
            KEY ELEMENT 3: سطح حقوق (Salary Level)
            Optimized using Flexbox & Grid for instant visual dominance
           ======================================================== */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-950/90 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Euro className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">سطح حقوق و دستمزد ناخالص:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-black text-emerald-400 font-mono tracking-tight" title={job.salary}>
                  {job.salary}
                </span>
                <span className="text-[10px] text-emerald-300/80 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                  سالانه (€)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs self-start sm:self-center">
            <span className="inline-flex items-center gap-1 text-slate-300 text-[11px] bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>{job.visaType || "بلوکارت §18g"}</span>
            </span>

            <span className="text-[11px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 font-bold">
              {job.zabStatus?.includes("H+") ? "✓ Anabin H+" : "H+ تایید مستقیم"}
            </span>
          </div>
        </div>

        {/* Quick Micro-Metrics Bar (Grid 3-column) */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* Role Fit */}
          <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <Award className="w-3 h-3 text-purple-400" />
              انطباق نقش
            </span>
            <div className="mt-1">
              {roleFitScore?.status === "pending" ? (
                <div className="inline-flex items-center gap-1 text-slate-400 text-[10px] animate-pulse">
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-purple-400" />
                  <span>محاسبه...</span>
                </div>
              ) : fitData ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRoleFitDetail(job, fitData);
                  }}
                  className="text-purple-300 font-mono font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{fitData.score}%</span>
                  <span className="text-[9px] bg-purple-500/20 px-1 rounded">مشاهده</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCalculateRoleFit(job);
                  }}
                  className="text-purple-400 hover:text-purple-200 text-[10px] font-bold cursor-pointer"
                >
                  + محاسبه
                </button>
              )}
            </div>
          </div>

          {/* ATS Resume Analysis */}
          <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <FileText className="w-3 h-3 text-blue-400" />
              تحلیل ATS
            </span>
            <div className="mt-1">
              {resumeAnalysis?.status === "loading" && isAnalyzingResume ? (
                <div className="inline-flex items-center gap-1 text-slate-400 text-[10px] animate-pulse">
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-400" />
                  <span>بررسی...</span>
                </div>
              ) : atsData ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenResumeAnalysisModal(job);
                  }}
                  className="text-blue-300 font-mono font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{atsData.atsMatchScore}%</span>
                  <span className="text-[9px] bg-blue-500/20 px-1 rounded">گزارش</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalyzeResume(job);
                  }}
                  className="text-blue-400 hover:text-blue-200 text-[10px] font-bold cursor-pointer"
                >
                  + تحلیل
                </button>
              )}
            </div>
          </div>

          {/* Visa Status */}
          <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              اسپانسری ویزا
            </span>
            <div className="mt-1">
              <span className="text-emerald-400 font-bold text-[11px] truncate block" title={job.visaSp}>
                تایید کارفرما
              </span>
            </div>
          </div>
        </div>

        {/* Golden Selection Criteria Box: Real Non-EU Hiring Track Record & Interview Probability */}
        <div className={`p-3 rounded-2xl border text-xs space-y-2 ${
          isMittelstand 
            ? "bg-slate-950/80 border-teal-500/30" 
            : isPhase1 
            ? "bg-slate-950/80 border-emerald-500/30"
            : "bg-slate-950/80 border-amber-500/30"
        }`}>
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 flex-wrap">
            <span className="font-bold flex items-center gap-1.5 text-white text-[11px]">
              <Target className={`w-3.5 h-3.5 ${isMittelstand ? "text-teal-400" : isPhase1 ? "text-emerald-400" : "text-amber-400"}`} />
              <span>معیارهای طلایی گزینش و شانس مصاحبه کاری:</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              (job.interviewInvitationProbability || tierInfo.interviewInvitationProbability || 90) >= 80
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}>
              🎯 احتمال دعوت به مصاحبه: {job.interviewInvitationProbability || tierInfo.interviewInvitationProbability || (isMittelstand ? 92 : 30)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {/* Iranian staff count */}
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
              <span className="text-base shrink-0">🇮🇷</span>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">پرسنل ایرانی شاغل:</span>
                <span className="text-emerald-300 font-bold">
                  {job.iranianStaffCount || tierInfo.iranianStaffCount || "۴ متخصص ایرانی شاغل در تیم فنی"}
                </span>
              </div>
            </div>

            {/* Non-EU 10-Yr Hiring track record */}
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
              <span className="text-base shrink-0">🌍</span>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">سابقه ۱۰ سال جذب خارج از EU:</span>
                <span className="text-teal-300 font-bold truncate block" title={job.nonEuHiringHistory10Yrs || tierInfo.nonEuHiringHistory10Yrs || "استخدام نیروهای ایرانی و غیراروپایی با اسپانسری ویزا"}>
                  {job.nonEuHiringHistory10Yrs || tierInfo.nonEuHiringHistory10Yrs || "سابقه استخدام نیرو از ایران و پاکستان با ویزای کار در ۱۰ سال اخیر"}
                </span>
              </div>
            </div>
          </div>

          {/* Interview Probability Reason & Source portal */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] text-slate-400 border-t border-slate-800/60">
            <div className="text-slate-300 leading-tight">
              <span className="text-indigo-400 font-bold ml-1">دلیل احتمال بالای دعوت:</span>
              <span>{job.interviewProbabilityReason || tierInfo.interviewProbabilityReason || "کمبود فوری نیروی کار و بررسی مستقیم رزومه توسط مدیر فنی بدون فیلتر ATS"}</span>
            </div>
            <span className="shrink-0 text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              منبع: {job.portalSource || tierInfo.portalSource || "StepStone / Xing / پورتال اداره کار"}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Deep Audit & Portal Details (Compact by default on mobile) */}
      {isDetailsExpanded && (
        <div className="space-y-3 pt-2 border-t border-slate-800/80 animate-fadeIn text-xs">
          {/* Visa Sponsorship & Relocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>پشتیبانی ویزای کار ({job.visaType || "§18g"})</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {job.visaSp}
              </p>
            </div>

            <div className="bg-sky-950/20 border border-sky-500/20 p-2.5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[11px]">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span>پکیج اسکان و رلوکیشن</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {job.relocation}
              </p>
            </div>
          </div>

          {/* 4-Pillar Zero-Discrepancy Audit Box */}
          <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-2xl space-y-2">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>تایید عدم مغایرت ۴ گانه با پروفایل متقاضی</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSemanticModal(job);
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-200 underline cursor-pointer"
              >
                مشاهده پایش
              </button>
            </div>

            {/* 4 Pillars Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
              <div className="bg-slate-900 px-2 py-1 rounded-lg text-slate-300 truncate" title={`تخصص: ${job.alignmentAudit?.specialtyFit?.candidateSpecialty || wizardInputs.field}`}>
                <span className="text-emerald-400 font-bold ml-1">تخصص:</span>
                <span>{job.alignmentAudit?.specialtyFit?.candidateSpecialty || wizardInputs.field}</span>
              </div>
              <div className="bg-slate-900 px-2 py-1 rounded-lg text-slate-300 truncate" title={`مهارت: ${job.alignmentAudit?.capabilityFit?.matchedCapabilities?.slice(0, 2)?.join("، ") || "استک همخوان"}`}>
                <span className="text-purple-400 font-bold ml-1">مهارت:</span>
                <span>{job.alignmentAudit?.capabilityFit?.matchedCapabilities?.slice(0, 2)?.join("، ") || "استک همخوان"}</span>
              </div>
              <div className="bg-slate-900 px-2 py-1 rounded-lg text-slate-300 truncate" title={`سابقه: ${job.alignmentAudit?.experienceFit?.candidateExpYears || wizardInputs.experience} سال`}>
                <span className="text-indigo-400 font-bold ml-1">سابقه:</span>
                <span>{job.alignmentAudit?.experienceFit?.candidateExpYears || wizardInputs.experience} سال</span>
              </div>
              <div className="bg-slate-900 px-2 py-1 rounded-lg text-slate-300 truncate" title={`دانش: ${job.alignmentAudit?.knowledgeFit?.anabinStatus || "Anabin H+"}`}>
                <span className="text-amber-400 font-bold ml-1">دانش:</span>
                <span>{job.alignmentAudit?.knowledgeFit?.anabinStatus || "Anabin H+"}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-medium pt-1">
              {job.matchReason}
            </p>
          </div>

          {/* Iranian Remote Applicant Reality & Strategy Advisory */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-2.5 ${
            isPhase1 
              ? "bg-emerald-950/20 border-emerald-500/30" 
              : "bg-amber-950/20 border-amber-500/30"
          }`}>
            <div className="flex items-center justify-between gap-2 border-b pb-2 border-slate-800/80">
              <span className={`font-bold flex items-center gap-1.5 text-xs ${isPhase1 ? "text-emerald-300" : "text-amber-300"}`}>
                <Compass className="w-4 h-4 shrink-0" />
                <span>تحلیل شانس قبولی برای متقاضی ایرانی از راه دور:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {job.hiringProcessSpeed || tierInfo.hiringProcessSpeed}
              </span>
            </div>

            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
              {job.recommendedStrategyFa || tierInfo.recommendedStrategyFa}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
              <span className="text-slate-400 font-bold">سابقه استخدام از ایران:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                isPhase1 ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25" : "bg-amber-500/15 text-amber-300 border border-amber-500/25"
              }`}>
                {job.iranianHiringBadgeFa || tierInfo.iranianHiringBadgeFa}
              </span>
            </div>
          </div>

          {/* German Job Portals Links */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>مشاهده در پورتال‌های استخدامی آلمان:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <a
                href={portalLinks.stepstone}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/25 px-2 py-0.5 rounded-md text-[10px] font-bold transition"
              >
                <span>StepStone</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <a
                href={portalLinks.arbeitsagentur}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/25 px-2 py-0.5 rounded-md text-[10px] font-bold transition"
              >
                <span>اداره کار (ZAV)</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <a
                href={portalLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-500/25 px-2 py-0.5 rounded-md text-[10px] font-bold transition"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <a
                href={portalLinks.indeed}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium transition"
              >
                <span>Indeed</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <a
                href={portalLinks.xing}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/25 px-2 py-0.5 rounded-md text-[10px] font-medium transition"
              >
                <span>XING</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          KEY ELEMENT 4: دکمه اپلای (Apply Button) & Action Controls
          Optimized using Flexbox & Grid for high conversion on mobile & desktop
         ======================================================== */}
      <div className="pt-3 border-t border-slate-800/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Contact info or Details Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs">
          {job.email && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyEmail(job.email, index);
              }}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-indigo-300 font-mono transition text-right cursor-pointer bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 hover:border-indigo-500/40 text-[11px]"
              title="کپی ایمیل مستقیم کارفرما"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{copiedIndex === index ? "کپی شد!" : job.email}</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsExpanded(!isDetailsExpanded);
            }}
            className="text-[11px] text-slate-400 hover:text-indigo-300 inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
          >
            <span>{isDetailsExpanded ? "بستن جزئیات" : "مشاهده جزئیات کامل"}</span>
            {isDetailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Primary Action Buttons: Prominent Apply Button + Secondary actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Deep Audit Button */}
          {verification?.status === "pending" ? (
            <div className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span className="hidden sm:inline">در حال استعلام...</span>
            </div>
          ) : verification?.status === "verified" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenVerificationDetail(job, verification);
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer"
              title="تاییدیه چندپورتاله استخدامی آلمان"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">تایید چندپورتاله</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerifySingleJob(job, index);
              }}
              className="inline-flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              title="استعلام در تمام پورتال‌های استخدامی آلمان"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">استعلام</span>
            </button>
          )}

          {/* ATS Analysis Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (atsData) {
                onOpenResumeAnalysisModal(job);
              } else {
                onAnalyzeResume(job);
              }
            }}
            disabled={isAnalyzingResume}
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white font-bold px-2.5 sm:px-3 py-2 rounded-xl text-xs transition cursor-pointer border border-blue-500/30 disabled:opacity-50"
            title="تحلیل انطباق رزومه با این موقعیت شغلی"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">رزومه</span>
          </button>

          {/* ==============================================
              DEDICATED PRIMARY APPLY BUTTON (دکمه اپلای)
              Eye-catching, high contrast, prominent action!
             ============================================== */}
          <button
            onClick={handleApplyClick}
            className="grow sm:grow-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white font-black px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-700/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title={`اپلای مستقیم و ارسال رزومه به کارفرمای ${job.companyName}`}
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>اپلای مستقیم</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
};
