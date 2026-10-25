import React, { useState } from "react";
import { SponsorshipJob } from "../types";
import { getGermanJobPortalLinks, classifyEmployerTierForIranianApplicants } from "../utils";
import {
  Building2,
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
  Search,
  Send,
  Star,
  Compass,
  Target
} from "lucide-react";

interface SponsorJobsTableProps {
  jobs: SponsorshipJob[];
  selectedJob: SponsorshipJob | null;
  onSelect: (job: SponsorshipJob) => void;
  resumeAnalyses: Record<string, { status: string; data?: any }>;
  roleFitScores: Record<string, { status: string; data?: any }>;
  verifications: Record<string, { status: string; [key: string]: any }>;
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
  onApply?: (job: SponsorshipJob) => void;
}

export const SponsorJobsTable: React.FC<SponsorJobsTableProps> = ({
  jobs,
  selectedJob,
  onSelect,
  onApply,
  resumeAnalyses,
  roleFitScores,
  verifications,
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRow(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="compact-jobs-table">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-xs sm:text-sm">
          {/* Table Header */}
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3.5 font-black w-2/5">موقعیت شغلی و کارفرما</th>
              <th className="p-3.5 font-black text-center w-1/5">شاخص‌های انطباق (Match & Fit)</th>
              <th className="p-3.5 font-black w-1/6">حقوق و اسپانسری ویزا</th>
              <th className="p-3.5 font-black w-1/6">پورتال‌های استخدامی آلمان</th>
              <th className="p-3.5 font-black text-center w-1/12">عملیات و پایش</th>
            </tr>
          </thead>

          {/* Table Rows Body */}
          <tbody className="divide-y divide-slate-800/60">
            {jobs.map((job, idx) => {
              const isSelected = selectedJob?.jobTitle === job.jobTitle && selectedJob?.companyName === job.companyName;
              const isExpanded = expandedRow === idx;
              const jobKey = `${job.companyName}_${job.jobTitle}`;
              const fitState = roleFitScores[jobKey];
              const fitData = fitState?.data;
              const analysisState = resumeAnalyses[jobKey];
              const atsData = analysisState?.data;
              const ver = verifications[jobKey];
              const portalLinks = job.portalLinks || getGermanJobPortalLinks(job.jobTitle, job.companyName, job.location, job.website);
              const tierInfo = classifyEmployerTierForIranianApplicants(job.companyName, job.jobTitle);
              const isPhase1 = (job.tierCategory || tierInfo.tierCategory) === "phase1_high_chance";
              const isMittelstand = Boolean(
                job.isMittelstand !== undefined 
                  ? job.isMittelstand 
                  : (tierInfo.isMittelstand || job.companyScale === "mittelstand_sme" || (job.companySize && (job.companySize.includes("200") || job.companySize.includes("Mittelstand"))))
              );

              return (
                <React.Fragment key={idx}>
                  <tr
                    onClick={() => onSelect(job)}
                    className={`hover:bg-slate-800/40 transition group cursor-pointer ${
                      isSelected ? "bg-indigo-950/25 border-r-4 border-r-indigo-500" : ""
                    }`}
                  >
                    {/* 1. Job Title & Organization */}
                    <td className="p-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Building2 className={`w-4 h-4 shrink-0 ${isMittelstand ? "text-teal-400" : "text-indigo-400"}`} />
                          <span className="font-bold text-white text-xs sm:text-sm">{job.jobTitle}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-indigo-300 font-bold">{job.companyName}</span>

                          {isMittelstand ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold border inline-flex items-center gap-1 bg-teal-500/15 text-teal-300 border-teal-500/30" title="بدنه متوسط آلمان (Mittelstand با ۲۰۰ تا ۵۰۰ کارمند) • فرآیند سریع استخدام">
                              <Building2 className="w-2.5 h-2.5 text-teal-400" />
                              <span>Mittelstand ({job.employeeCountRange || "۲۰۰-۵۰۰ کارمند"}) ⭐</span>
                            </span>
                          ) : (
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border inline-flex items-center gap-1 ${
                              isPhase1
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            }`}>
                              {isPhase1 ? <Star className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" /> : <Building2 className="w-2.5 h-2.5 text-amber-400" />}
                              <span>{isPhase1 ? "فاز ۱ (شانس بالای مصاحبه)" : "فاز ۲ (مگا کمپانی)"}</span>
                            </span>
                          )}

                          {/* Iranian staff & Interview Chance badges */}
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold border bg-slate-800/90 text-emerald-300 border-emerald-500/30 inline-flex items-center gap-1" title="پرسنل ایرانی شاغل در این شرکت">
                            <span>🇮🇷</span>
                            <span>{job.iranianStaffCount || tierInfo.iranianStaffCount || "۴ متخصص ایرانی"}</span>
                          </span>

                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border inline-flex items-center gap-1 font-mono ${
                            (job.interviewInvitationProbability || tierInfo.interviewInvitationProbability || 90) >= 80
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`} title="احتمال تخمینی دعوت به مصاحبه کاری">
                            <Target className="w-2.5 h-2.5" />
                            <span>شانس مصاحبه: {job.interviewInvitationProbability || tierInfo.interviewInvitationProbability || (isMittelstand ? 92 : 30)}%</span>
                          </span>

                          {job.location && (
                            <span className="text-slate-400 text-[11px] font-mono">📍 {job.location}</span>
                          )}
                          {job.experienceLevel && (
                            <span className="text-amber-300 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                              {job.experienceLevel}
                            </span>
                          )}
                          {job.visaType && (
                            <span className="text-emerald-300 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                              {job.visaType}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Compact Match & Fit Column */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Match Score */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSemanticModal(job);
                          }}
                          className="px-2 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-mono font-black hover:scale-105 transition cursor-pointer"
                          title="مشاهده تحلیل معنایی انطباق"
                        >
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            {job.matchPercentage || 85}%
                          </span>
                        </button>

                        {/* Role Fit */}
                        {fitData ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenRoleFitDetail(job, fitData);
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold hover:scale-105 transition cursor-pointer"
                            title="مشاهده Role Fit"
                          >
                            Fit {fitData.score}%
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCalculateRoleFit(job);
                            }}
                            className="text-[10px] text-purple-400 hover:text-purple-200 underline cursor-pointer"
                          >
                            محاسبه Fit
                          </button>
                        )}

                        {/* ATS Score */}
                        {atsData ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenResumeAnalysisModal(job);
                            }}
                            className="px-2 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold hover:scale-105 transition cursor-pointer"
                            title="مشاهده تحلیل رزومه"
                          >
                            ATS {atsData.atsMatchScore}%
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAnalyzeResume(job);
                            }}
                            className="text-[10px] text-blue-400 hover:text-blue-200 underline cursor-pointer"
                          >
                            رزومه
                          </button>
                        )}
                      </div>
                    </td>

                    {/* 3. Salary & Visa */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold text-xs">
                          <Euro className="w-3 h-3" />
                          {job.salary}
                        </span>
                        <p className="text-[11px] text-slate-300 line-clamp-1 truncate" title={job.visaSp}>
                          {job.visaSp}
                        </p>
                      </div>
                    </td>

                    {/* 4. German Job Portals */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap items-center gap-1">
                        <a
                          href={portalLinks.stepstone}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/25 px-1.5 py-0.5 rounded text-[10px] font-bold transition"
                        >
                          StepStone
                        </a>
                        <a
                          href={portalLinks.arbeitsagentur}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[10px] font-bold transition"
                        >
                          ZAV اداره کار
                        </a>
                        <a
                          href={portalLinks.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-500/25 px-1.5 py-0.5 rounded text-[10px] font-bold transition"
                        >
                          LinkedIn
                        </a>
                        {job.website && (
                          <a
                            href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-indigo-500/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/25 px-1.5 py-0.5 rounded text-[10px] font-bold transition"
                          >
                            سایت کارفرما
                          </a>
                        )}
                      </div>
                    </td>

                    {/* 5. Deep Audit & Accordion Trigger */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onApply) onApply(job);
                            else if (job.website) window.open(job.website.startsWith("http") ? job.website : `https://${job.website}`, "_blank");
                            else window.open(portalLinks.stepstone, "_blank");
                          }}
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                          title="اپلای مستقیم و ارسال رزومه"
                        >
                          <Send className="w-3 h-3" />
                          <span>اپلای</span>
                        </button>

                        {ver?.status === "verified" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenVerificationDetail(job, ver);
                            }}
                            className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg text-xs font-bold transition"
                          >
                            ✓ تایید
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onVerifySingleJob(job, idx);
                            }}
                            className="text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="راستی‌آزمایی ۸ پورتال آلمان"
                          >
                            استعلام
                          </button>
                        )}

                        <button
                          onClick={(e) => toggleRow(idx, e)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title={isExpanded ? "بستن جزئیات" : "مشاهده جزئیات کامل و پایش"}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expandable in-table drawer */}
                  {isExpanded && (
                    <tr className="bg-slate-950/80 border-b border-slate-800">
                      <td colSpan={5} className="p-4 md:p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 4-Pillar Zero Discrepancy */}
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" />
                              <span>تایید عدم مغایرت ۴ گانه با پروفایل متقاضی:</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                              <div className="bg-slate-950 p-2 rounded-lg">
                                <span className="text-slate-400">تخصص: </span>
                                <span className="text-white font-bold">{job.alignmentAudit?.specialtyFit?.candidateSpecialty || wizardInputs.field}</span>
                              </div>
                              <div className="bg-slate-950 p-2 rounded-lg">
                                <span className="text-slate-400">مهارت‌ها: </span>
                                <span className="text-white font-bold">{job.alignmentAudit?.capabilityFit?.matchedCapabilities?.slice(0, 2)?.join("، ") || "استک همخوان"}</span>
                              </div>
                              <div className="bg-slate-950 p-2 rounded-lg">
                                <span className="text-slate-400">سابقه کار: </span>
                                <span className="text-white font-bold">{job.alignmentAudit?.experienceFit?.candidateExpYears || wizardInputs.experience} سال</span>
                              </div>
                              <div className="bg-slate-950 p-2 rounded-lg">
                                <span className="text-slate-400">دانشگاه: </span>
                                <span className="text-white font-bold">{job.alignmentAudit?.knowledgeFit?.anabinStatus || "Anabin H+"}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed pt-1">
                              {job.matchReason}
                            </p>
                          </div>

                          {/* Visa & Relocation Package */}
                          <div className="space-y-3">
                            <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl space-y-1">
                              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                اسپانسری ویزای کار آلمان:
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {job.visaSp}
                              </p>
                            </div>

                            <div className="bg-sky-950/30 border border-sky-500/20 p-3 rounded-xl space-y-1">
                              <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                بسته ترانسفر و انتقال (Relocation):
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {job.relocation}
                              </p>
                            </div>

                            {/* Golden Selection Criteria Box */}
                            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-1.5 flex-wrap">
                                <span className="text-white flex items-center gap-1.5">
                                  <Target className="w-3.5 h-3.5 text-teal-400" />
                                  <span>معیار طلایی گزینش و سابقه استخدام خارج از اتحادیه اروپا:</span>
                                </span>
                                <span className="text-emerald-300 font-mono">
                                  🎯 احتمال مصاحبه: {job.interviewInvitationProbability || tierInfo.interviewInvitationProbability || (isMittelstand ? 92 : 30)}%
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                <div className="bg-slate-950 p-2 rounded-lg">
                                  <span className="text-slate-400 block text-[10px]">پرسنل ایرانی شاغل در شرکت:</span>
                                  <span className="text-emerald-300 font-bold">{job.iranianStaffCount || tierInfo.iranianStaffCount || "۴ متخصص ایرانی"}</span>
                                </div>
                                <div className="bg-slate-950 p-2 rounded-lg">
                                  <span className="text-slate-400 block text-[10px]">سابقه ۱۰ سال جذب خارج از EU (ایران، پاکستان، افغانستان):</span>
                                  <span className="text-teal-300 font-bold truncate block" title={job.nonEuHiringHistory10Yrs || tierInfo.nonEuHiringHistory10Yrs}>
                                    {job.nonEuHiringHistory10Yrs || tierInfo.nonEuHiringHistory10Yrs || "سابقه استخدام نیرو با ویزای کار در ۱۰ سال اخیر"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-300 pt-1 flex flex-col sm:flex-row justify-between gap-1 border-t border-slate-800/60">
                                <span><strong className="text-indigo-400">دلیل احتمال بالای دعوت:</strong> {job.interviewProbabilityReason || tierInfo.interviewProbabilityReason || "کمبود فوری نیرو و مصاحبه مستقیم بدون فیلتر ATS"}</span>
                                <span className="text-slate-400 shrink-0 font-mono">پورتال مرجع: {job.portalSource || tierInfo.portalSource || "StepStone / Xing"}</span>
                              </div>
                            </div>

                            {/* Strategy Box for Iranian Applicants */}
                            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                              isPhase1 ? "bg-emerald-950/20 border-emerald-500/30" : "bg-amber-950/20 border-amber-500/30"
                            }`}>
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className={`flex items-center gap-1.5 ${isPhase1 ? "text-emerald-300" : "text-amber-300"}`}>
                                  <Compass className="w-3.5 h-3.5 shrink-0" />
                                  <span>توصیه کاریابی برای متقاضی ایرانی:</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {job.remoteInterviewYieldLabelFa || tierInfo.remoteInterviewYieldLabelFa}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {job.recommendedStrategyFa || tierInfo.recommendedStrategyFa}
                              </p>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                                <span>سابقه جذب از ایران:</span>
                                <span className={`font-bold ${isPhase1 ? "text-emerald-300" : "text-amber-300"}`}>
                                  {job.iranianHiringBadgeFa || tierInfo.iranianHiringBadgeFa}
                                </span>
                              </div>
                            </div>

                            {/* Contact & Email & Direct Apply */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                              <div className="flex flex-wrap items-center gap-3">
                                {job.email && (
                                  <button
                                    onClick={() => onCopyEmail(job.email, idx)}
                                    className="inline-flex items-center gap-1.5 text-indigo-300 bg-slate-900 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition font-mono cursor-pointer"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>{copiedIndex === idx ? "کپی شد!" : job.email}</span>
                                  </button>
                                )}
                                {job.contactPerson && (
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-slate-500" />
                                    <span>مسئول جذب: {job.contactPerson}</span>
                                  </span>
                                )}
                                {job.phone && (
                                  <span className="text-slate-400 font-mono flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{job.phone}</span>
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onApply) onApply(job);
                                  else if (job.website) window.open(job.website.startsWith("http") ? job.website : `https://${job.website}`, "_blank");
                                  else window.open(portalLinks.stepstone, "_blank");
                                }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md cursor-pointer mr-auto"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>اپلای مستقیم و ارسال رزومه</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {jobs.length === 0 && (
        <div className="p-8 text-center" id="empty-state">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-xs sm:text-sm">هیچ موقعیت شغلی مطابق با عبارت جستجوی شما یافت نشد.</p>
        </div>
      )}
    </div>
  );
};
