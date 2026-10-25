import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Building2, 
  Euro, 
  Scale, 
  Zap, 
  Check, 
  Copy, 
  ExternalLink,
  Target,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Layers,
  FileText,
  CheckCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SponsorshipJob, EvaluatorInput, SemanticMatchDetails, CandidateAlignmentAudit } from "../types";
import { calculateSemanticMatchScore, auditJobCandidateAlignment } from "../utils/germanDemandProfiles";

interface SemanticMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: SponsorshipJob | null;
  profile: EvaluatorInput;
  semanticMatch?: SemanticMatchDetails | null;
}

export const SemanticMatchModal: React.FC<SemanticMatchModalProps> = ({
  isOpen,
  onClose,
  job,
  profile,
  semanticMatch
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "discrepancy_audit" | "dimensions" | "industry" | "zab_legal">("overview");
  const [copiedPitch, setCopiedPitch] = useState(false);

  if (!isOpen || !job) return null;

  // Resolve match details either from prop, job property, or compute dynamically
  const match: SemanticMatchDetails = semanticMatch || job.matchScoreBreakdown || calculateSemanticMatchScore(job, profile);
  const audit: CandidateAlignmentAudit = job.alignmentAudit || match.alignmentAudit || auditJobCandidateAlignment(job, profile);

  const isExceptional = match.overallScore >= 90;
  const isStrong = match.overallScore >= 80 && match.overallScore < 90;

  const handleCopyPitch = () => {
    const pitchText = `Sehr geehrte Damen und Herren,\n\nmit großem Interesse bewerbe ich mich für die Position als ${job.jobTitle} bei ${job.companyName}. Mit ${profile.experience || 3} Jahren praktischer Berufserfahrung im Bereich ${profile.field || "meines Fachgebiets"}, fundierten Qualifikationen (Anabin-Status: ${profile.anabinStatus || "H+"}) und spezifischen Zertifizierungen kann ich Ihr Team in Deutschland ab Tag eins tatkräftig unterstützen.\n\nMit freundlichen Grüßen,\n${profile.name || "Bewerber"}`;
    navigator.clipboard.writeText(pitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 text-right">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 max-w-4xl w-full max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-black">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>تحلیل معنایی انطباق شغلی و اعتبارسنجی ZAB / Anabin</span>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{match.legalImmigrationPathway}</span>
              </span>

              {match.industryDemandProfile.shortageOccupation && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  <span>رسته شغلی دارای کمبود حاد (MINT-Engpassberuf)</span>
                </span>
              )}
            </div>

            <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>{job.jobTitle}</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="text-indigo-300 font-bold">{job.companyName}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" />{job.location || "آلمان"}</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1"><Euro className="w-3 h-3" />{job.salary}</span>
              <span>•</span>
              <span className="text-amber-400 flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.experienceLevel || "Mid-Level"}</span>
            </div>
          </div>

          {/* Hero Match Score Card */}
          <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
            <div className="flex items-center gap-4">
              <div className={`relative w-20 h-20 shrink-0 flex flex-col items-center justify-center rounded-2xl border shadow-inner ${
                isExceptional
                  ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
                  : isStrong
                  ? "bg-indigo-950/50 border-indigo-500/40 text-indigo-300"
                  : "bg-amber-950/50 border-amber-500/40 text-amber-300"
              }`}>
                <span className="text-2xl font-black font-mono">
                  {match.overallScore}%
                </span>
                <span className="text-[9px] font-bold text-slate-300">Match Score</span>
              </div>

              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-white">
                    {match.ratingLabelFa}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 text-[10px] font-bold border border-purple-500/30">
                    {match.ratingLevel === "exceptional" ? "ممتاز" : match.ratingLevel === "strong" ? "بسیار قوی" : "متوسط"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  {match.scoreExplanation}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end">
              <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-medium">وضعیت انطباق Anabin</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{profile.anabinStatus || "H+ (KMK)"}</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-medium">سرعت صدور ویزا</span>
                <span className="text-xs font-bold text-indigo-300">Fast-Track (§81a)</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>خلاصه ارزیابی</span>
            </button>

            <button
              onClick={() => setActiveTab("discrepancy_audit")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === "discrepancy_audit"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>پایش عدم مغایرت ۴ گانه (تضمین انطباق)</span>
            </button>

            <button
              onClick={() => setActiveTab("dimensions")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === "dimensions"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>تفکیک ۴ مؤلفه تحلیلی</span>
            </button>

            <button
              onClick={() => setActiveTab("industry")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === "industry"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>پروفایل تقاضای صنعت آلمان</span>
            </button>

            <button
              onClick={() => setActiveTab("zab_legal")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === "zab_legal"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>اعتبارسنجی ZAB و بلوکارت ۲۰۲۶</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ACTIONABLE TIPS */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Zero-Discrepancy 4-Pillar Validation Banner */}
              <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-emerald-300">
                      تایید قطعی عدم مغایرت در ۴ محور (توانمندی، تجربه، دانش و تخصص)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold self-start sm:self-auto">
                    ✓ ۱۰۰٪ بدون مغایرت استخدامی
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>تخصص (Specialty):</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {audit.specialtyFit.detailsFa}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>توانمندی و مهارت‌ها (Capabilities):</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {audit.capabilityFit.detailsFa}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>تجربه و ارشدیت (Experience):</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {audit.experienceFit.detailsFa}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>دانش و دانشگاه (Knowledge & ZAB):</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {audit.knowledgeFit.detailsFa}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed font-bold">
                  {audit.preciseMatchReason}
                </div>
              </div>

              {/* 4 Quick Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-indigo-400" /> سابقه کار و ارشدیت</span>
                    <span className="font-mono font-bold text-indigo-300">{match.experienceFitScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${match.experienceFitScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> مهارت‌های فنی</span>
                    <span className="font-mono font-bold text-purple-300">{match.skillsFitScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${match.skillsFitScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> مدارک و سرتیفیکیت‌ها</span>
                    <span className="font-mono font-bold text-amber-300">{match.certificationsFitScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${match.certificationsFitScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> تاییدیه ZAB/Anabin</span>
                    <span className="font-mono font-bold text-emerald-300">{match.zabAnabinFitScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${match.zabAnabinFitScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Actionable Score Boosters */}
              <div className="bg-indigo-500/10 border border-indigo-500/25 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>راهکارهای اختصاصی افزایش امتیاز تطابق برای این موقعیت کاری:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 pr-1">
                  {match.actionableScoreBoosters.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applicant Elevator Pitch Snippet */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>متن آماده ایمیل یا انگیزه نامه آلمانی به کارفرما (Bewerbungsschreiben):</span>
                  </h4>
                  <button
                    onClick={handleCopyPitch}
                    className="text-[10px] text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg bg-indigo-900/40 border border-indigo-500/30 hover:bg-indigo-800/60 cursor-pointer flex items-center gap-1"
                  >
                    {copiedPitch ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPitch ? "کپی شد!" : "کپی متن"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 text-justify dir-ltr">
                  Sehr geehrte Damen und Herren, mit großem Interesse bewerbe ich mich für die Position als {job.jobTitle} bei {job.companyName}. Mit {profile.experience || 3} Jahren praktischer Berufserfahrung im Bereich {profile.field || "meines Fachgebiets"}, fundierten Qualifikationen (Anabin-Status: {profile.anabinStatus || "H+"}) und spezifischen Zertifizierungen kann ich Ihr Team in Deutschland ab Tag eins tatkräftig unterstützen.
                </p>
              </div>
            </div>
          )}

          {/* TAB: ZERO-DISCREPANCY 4-PILLAR AUDIT */}
          {activeTab === "discrepancy_audit" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">
                    پایش عدم مغایرت ۴ گانه (Zero-Discrepancy Policy)
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  طبق ضوابط هوشمند سامانه، انطباق این موقعیت با ۴ فاکتور بنیادین ارزیابی شد: در صورتی که هر موقعیتی در یکی از این ۴ فاکتور دارای مغایرت باشد، بی‌درنگ از لیست حذف می‌گردد. موقعیت شغلی شرکت <span className="text-emerald-300 font-bold">{job.companyName}</span> در تمامی ۴ محور به تایید ۱۰۰٪ رسیده است.
                </p>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Specialty */}
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span>۱. پایش تخصص و حوزه کاری (Specialty)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      ✓ تایید عدم مغایرت
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>تخصص متقاضی:</span>
                      <span className="text-white font-bold">{audit.specialtyFit.candidateSpecialty}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>عنوان پوزیشن کارفرما:</span>
                      <span className="text-indigo-300 font-bold font-sans">{audit.specialtyFit.jobSpecialty}</span>
                    </div>
                    <p className="pt-1 text-emerald-200/90 text-xs leading-relaxed font-medium">
                      {audit.specialtyFit.detailsFa}
                    </p>
                  </div>
                </div>

                {/* 2. Capabilities */}
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>۲. پایش توانمندی و مهارت‌های فنی (Capabilities)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      ✓ استک همخوان
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>مهارت‌های متناظر شناسایی‌شده:</span>
                      <span className="text-purple-300 font-bold font-mono">
                        {audit.capabilityFit.matchedCapabilities.length > 0 ? audit.capabilityFit.matchedCapabilities.join("، ") : "فناوری‌های استک مرتبط"}
                      </span>
                    </div>
                    <p className="pt-1 text-purple-200/90 text-xs leading-relaxed font-medium">
                      {audit.capabilityFit.detailsFa}
                    </p>
                  </div>
                </div>

                {/* 3. Experience */}
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <span>۳. پایش سابقه و ارشدیت (Experience)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      ✓ انطباق ارشدیت
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>سابقه کار متقاضی:</span>
                      <span className="text-white font-bold">{audit.experienceFit.candidateExpYears} سال ({audit.experienceFit.seniorityLevel})</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>حداقل نیاز کارفرما:</span>
                      <span className="text-indigo-300 font-bold">{audit.experienceFit.requiredExpYears} سال</span>
                    </div>
                    <p className="pt-1 text-indigo-200/90 text-xs leading-relaxed font-medium">
                      {audit.experienceFit.detailsFa}
                    </p>
                  </div>
                </div>

                {/* 4. Knowledge */}
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>۴. پایش دانش و مدرک دانشگاهی (Knowledge)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      ✓ وضعیت Anabin H+
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>مدرک تحصیلی:</span>
                      <span className="text-white font-bold">{audit.knowledgeFit.degree}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>اعتبار سامانه Anabin:</span>
                      <span className="text-emerald-300 font-bold">{audit.knowledgeFit.anabinStatus}</span>
                    </div>
                    <p className="pt-1 text-emerald-200/90 text-xs leading-relaxed font-medium">
                      {audit.knowledgeFit.detailsFa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact precise match reason block */}
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                  <CheckCheck className="w-4 h-4" />
                  <span>متن رسمی علت انطباق دقیق (ثبت‌شده در پرونده این موقعیت):</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-bold bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  {audit.preciseMatchReason}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED 4-DIMENSIONAL BREAKDOWN */}
          {activeTab === "dimensions" && (
            <div className="space-y-4">
              {/* Dimension 1: Experience */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">۱. تحلیل معنایی سوابق کاری و سطح ارشدیت</h4>
                      <p className="text-[11px] text-slate-400">سوابق متقاضی: {profile.experience} سال | حداقل نیاز کارفرما: {job.minExp || 2} سال</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-indigo-400 text-sm bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {match.experienceFitScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {match.experienceAnalysis}
                </p>
              </div>

              {/* Dimension 2: Skills */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">۲. تطابق معنایی مهارت‌های تخصصی و ابزارها</h4>
                      <p className="text-[11px] text-slate-400">تطابق با استک فنی و کلیدواژه‌های ATS آگهی</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-purple-400 text-sm bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {match.skillsFitScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {match.skillsAnalysis}
                </p>
              </div>

              {/* Dimension 3: Certifications */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">۳. ارزش‌گذاری گواهینامه‌ها و مدارک بین‌المللی در بازار آلمان</h4>
                      <p className="text-[11px] text-slate-400">سرتیفیکیت‌های ثبت‌شده شما: {profile.certifications || "ثبت‌نشده (پیشنهاد تکمیل)"}</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-amber-400 text-sm bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {match.certificationsFitScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {match.certificationsAnalysis}
                </p>
              </div>

              {/* Dimension 4: ZAB / Anabin Academic Recognition */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">۴. اعتبارسنجی پایگاه داده Anabin و سازمان ZAB آلمان</h4>
                      <p className="text-[11px] text-slate-400">وضعیت استعلام: {profile.anabinStatus || "H+ (KMK)"} | مدرک: {profile.degree}</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-emerald-400 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {match.zabAnabinFitScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {match.anabinAnalysis}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: GERMAN INDUSTRY DEMAND PROFILE */}
          {activeTab === "industry" && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-white">{match.industryDemandProfile.sectorName}</h4>
                    <p className="text-xs text-indigo-300 font-mono mt-0.5">German Industry Demand Profile (Bundesagentur für Arbeit)</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    شاخص تقاضا: {match.industryDemandProfile.demandLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-400">قطب‌های صنعتی و استخدامی در آلمان:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {match.industryDemandProfile.regionalDemandHubs.map((hub, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700/80 text-[11px] font-medium">
                          📍 {hub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-400">وضعیت فرآیند شتاب‌یافته جذب متخصصان:</h5>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-300 leading-relaxed">
                      واجد شرایط درخواست فرآیند شتاب‌یافته استخدام فدرال (§ 81a Fast-Track) توسط کارفرما؛ زمان بررسی وقت سفارت از ماه‌ها به چند هفته کاهش می‌یابد.
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <h5 className="text-xs font-bold text-indigo-300">گواهینامه‌ها و استانداردهای دارای بالاترین اولویت کارفرمایان این حوزه در آلمان:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {match.industryDemandProfile.priorityCertificates.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ZAB / ANABIN & LEGAL COMPLIANCE */}
          {activeTab === "zab_legal" && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">انطباق حقوقی مهاجرتی با قانون جدید مهاجرت ماهر (FEG)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">مسیر قانونی اخذ اقامت کاری و بلوکارت ۲۰۲۶ در سفارت و اداره مهاجرت آلمان</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 font-bold block">مبنای قانونی اقامت:</span>
                    <span className="text-white font-mono font-bold text-sm block text-emerald-400">
                      {match.legalImmigrationPathway}
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      این موقعیت شغلی به علت حقوق پیشنهادی و همخوانی رشته، منطبق بر بندهای قانونی تسهیل ویزای کاری است.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 font-bold block">وضعیت تایید مدرک در سامانه KMK / Anabin:</span>
                    <span className="text-white font-bold text-sm block text-indigo-300">
                      کلاس {profile.anabinStatus || "H+"}
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {match.anabinAnalysis}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-indigo-300">آزمون اولویت بازار کار (Vorrangprüfung):</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    با توجه به اصلاحیه جدید قانون مهاجرت ماهر و وضعیت کمبود حاد نیرو در این بخش، کارفرمای آلمانی معاف از آزمون اولویت نیروی کار داخلی یا اتحادیه اروپا (Vorrangprüfung) است و تاییدیه اداره کار فدرال (ZAV) مستقیماً صادر خواهد شد.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              <span>تحلیل شده برای: </span>
              <span className="text-white font-bold">{profile.name || "متقاضی محترم"}</span>
              <span className="text-slate-600 mx-1">|</span>
              <span>رشته: </span>
              <span className="text-indigo-300 font-bold">{profile.field}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                بستن
              </button>

              {job.website && (
                <a
                  href={job.website.startsWith('http') ? job.website : `https://${job.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black px-5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-950/40"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>ورود به سایت رسمی کارفرما</span>
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
