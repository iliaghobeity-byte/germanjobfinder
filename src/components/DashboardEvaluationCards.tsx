import React, { useMemo, useState, useEffect } from "react";
import { 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  Layers, 
  Euro,
  BookOpen, 
  AlertCircle,
  Printer 
} from "lucide-react";
import { 
  parseProfileAndCvData, 
  DashboardEvaluationResult 
} from "../services/dashboardEvaluationService";
import { EvaluatorInput, CVBuilderInput } from "../types";
import { formatPrintDocumentTitle, triggerPrintWithTitle } from "../utils";

interface DashboardEvaluationCardsProps {
  profile?: Partial<EvaluatorInput> | null;
  cvData?: Partial<CVBuilderInput> | null;
  onRefreshEvaluation?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const DashboardEvaluationCards: React.FC<DashboardEvaluationCardsProps> = ({
  profile,
  cvData,
  onRefreshEvaluation,
  onNavigateToTab
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleStorageOrProfileUpdate = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageOrProfileUpdate);
    window.addEventListener("profileUpdated", handleStorageOrProfileUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageOrProfileUpdate);
      window.removeEventListener("profileUpdated", handleStorageOrProfileUpdate);
    };
  }, []);

  // Compute dynamic evaluation result via service layer
  const evaluation: DashboardEvaluationResult = useMemo(() => {
    return parseProfileAndCvData(profile, cvData);
  }, [profile, cvData, refreshKey]);

  const { education, workHistory, skills, visaMarketFit, cards, dataSource } = evaluation;

  return (
    <div className="space-y-6 print-break-inside-avoid" id="dashboard-evaluation-cards-section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              ارزیابی هوشمند و اختصاصی متقاضی
            </span>
            <span className="text-xs text-slate-400">
              بروزرسانی: {dataSource.lastUpdated}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white mt-1 flex items-center gap-2">
            <span>کارنامه تخصصی مدارک، سوابق و مهارت‌ها در بازار کار آلمان</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            استخراج مستقیم بر اساس داده‌های رزومه، مدرک تحصیلی، تجارب کاری و مهارت‌های شما (بدون محتوای پیش‌فرض عمومی)
          </p>
        </div>

        {/* Action pills, print button & source indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              document.body.classList.add("print-target-evaluation");
              const title = formatPrintDocumentTitle("کارنامه_تخصصی_ارزیابی_مدارک_و_مهارت‌ها", profile?.name);
              const cleanup = () => {
                document.body.classList.remove("print-target-evaluation");
                window.removeEventListener("afterprint", cleanup);
              };
              window.addEventListener("afterprint", cleanup);
              triggerPrintWithTitle(title, () => {
                window.print();
                setTimeout(cleanup, 2500);
              });
            }}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold shadow-sm transition active:scale-95 cursor-pointer no-print border border-indigo-400/30"
            title="چاپ و خروجی رسمی PDF از این کارنامه تخصصی با استایل‌های شبیه‌ساز چاپ"
            id="btn-print-eval-cards-pdf"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-200" />
            <span>خروجی PDF کارنامه</span>
          </button>

          {dataSource.hasExtractedPdf && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
              <FileCheck className="w-3.5 h-3.5" />
              استخراج‌شده از PDF
            </span>
          )}
          {dataSource.hasSavedProfile && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              پروفایل ثبت‌شده
            </span>
          )}
        </div>
      </div>

      {/* 4 Specialized Dynamic Evaluation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Education & Anabin Evaluation */}
        <div 
          id="card-evaluation-education"
          className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group print-break-inside-avoid"
        >
          <div className="space-y-4">
            {/* Header / Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cards.educationCard.badgeColorClass}`}>
                {cards.educationCard.badgeLabel}
              </span>
            </div>

            {/* Title & Field */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                مدرک و صلاحیت آکادمیک
              </span>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                {education.degreeTitleFa}
              </h3>
              <p className="text-xs text-emerald-400 font-mono mt-0.5 dir-ltr text-right">
                {education.degreeTitleDe}
              </p>
            </div>

            {/* Main Details */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">مرجع صادرکننده:</span>
                <span className="font-semibold text-white truncate max-w-[150px]" title={education.institutionName}>
                  {education.institutionName}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">امتیاز کارت فرصت:</span>
                <span className="font-bold text-emerald-400">
                  {education.chancenkarteDegreePoints} از ۴ امتیاز
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">انطباق با بلوکارت:</span>
                <span className="font-bold text-indigo-300">
                  {education.blueCardAcademicEligible ? "احراز شرط آکادمیک" : "نیازمند ارزشیابی تکمیلی"}
                </span>
              </div>
            </div>

            {/* Description / Highlights */}
            <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
              <p className="line-clamp-3 text-slate-400">
                {education.anabinStatusDescription}
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 mt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {cards.educationCard.recommendationText}
            </span>
          </div>
        </div>

        {/* Card 2: Work History & Seniority Evaluation */}
        <div 
          id="card-evaluation-work-history"
          className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group print-break-inside-avoid"
        >
          <div className="space-y-4">
            {/* Header / Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cards.workHistoryCard.badgeColorClass}`}>
                {cards.workHistoryCard.badgeLabel}
              </span>
            </div>

            {/* Title & Seniority */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                سوابق شغلی و تجربه حرفه‌ای
              </span>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                {workHistory.seniorityLevelFa}
              </h3>
              <p className="text-xs text-indigo-400 mt-0.5">
                حوزه فعالیت: {evaluation.candidateField}
              </p>
            </div>

            {/* Main Details */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">مدت سابقه کاری:</span>
                <span className="font-bold text-white">
                  {workHistory.totalYears} سال
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">امتیاز سابقه در شانس:</span>
                <span className="font-bold text-indigo-400">
                  {workHistory.chancenkarteExperiencePoints} امتیاز رسمی
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">تناسب با کارفرمایان:</span>
                <span className="font-bold text-emerald-400">
                  {workHistory.totalYears >= 3 ? "بسیار بالا (مستقل)" : "قابل قبول (Junior)"}
                </span>
              </div>
            </div>

            {/* Highlights from user's actual CV/Profile */}
            <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
              <span className="text-[10px] font-bold text-slate-400 block">نکات برجسته سوابق مستخرج:</span>
              <ul className="space-y-1">
                {workHistory.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-slate-300 line-clamp-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 mt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-medium text-indigo-300 flex items-center gap-1 truncate" title={workHistory.germanReferenceLetterAdvice}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {workHistory.germanReferenceLetterAdvice}
            </span>
          </div>
        </div>

        {/* Card 3: Skills & Tech Stack Evaluation */}
        <div 
          id="card-evaluation-skills"
          className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group print-break-inside-avoid"
        >
          <div className="space-y-4">
            {/* Header / Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="p-2.5 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/25">
                <Code2 className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cards.skillsCard.badgeColorClass}`}>
                {cards.skillsCard.badgeLabel}
              </span>
            </div>

            {/* Title & Domain */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                مهارت‌ها و فناوری‌های استخراج‌شده
              </span>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                سبد تخصص {evaluation.candidateField}
              </h3>
              <p className="text-xs text-teal-400 mt-0.5">
                تعداد مهارت‌های شناسایی‌شده: {skills.skillsList.length} مهارت
              </p>
            </div>

            {/* Skill tags based on user's actual field */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">فناوری‌ها و ابزارهای متقاضی:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {skills.skillsList.slice(0, 7).map((skill, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 border border-slate-800 text-teal-300 hover:border-teal-500/40 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* German Standards for this exact profession */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 block">استاندارد کارفرمایان آلمانی در این رشته:</span>
              <p className="text-[11px] font-medium text-slate-200">
                {skills.relevantGermanStandards[0] || "رعایت استانداردهای تخصصی DIN/ISO"}
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 mt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-medium text-teal-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              تطابق با تقاضای بازار کار آلمان
            </span>
          </div>
        </div>

        {/* Card 4: German Market & Visa Pathway Evaluation */}
        <div 
          id="card-evaluation-market-visa"
          className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group print-break-inside-avoid"
        >
          <div className="space-y-4">
            {/* Header / Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <Euro className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cards.marketFitCard.badgeColorClass}`}>
                {cards.marketFitCard.badgeLabel}
              </span>
            </div>

            {/* Title & Pathway */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                مسیر ویزا و کف حقوق قانونی (۲۰۲۶)
              </span>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                {visaMarketFit.recommendedPathwayTitleFa}
              </h3>
              <p className="text-xs text-amber-400 mt-0.5">
                وضعیت: {visaMarketFit.blueCardFit.isShortageOccupation ? "مشاغل مورد نیاز فوری (Mangelberuf)" : "مشاغل استاندارد"}
              </p>
            </div>

            {/* Main Details */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">کف حقوق بلوکارت:</span>
                <span className="font-bold text-emerald-400">
                  {visaMarketFit.blueCardFit.minSalaryThresholdEur.toLocaleString()} € / سال
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">امتیاز کارت فرصت:</span>
                <span className="font-bold text-amber-300">
                  {visaMarketFit.chancenkartePoints.total} امتیاز (نصاب: ۶)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">ارزیابی زبان:</span>
                <span className="font-medium text-slate-200">
                  آلمانی {evaluation.languages.german} | انگلیسی {evaluation.languages.english}
                </span>
              </div>
            </div>

            {/* Recommendation summary */}
            <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
              <p className="line-clamp-2 text-slate-400">
                {visaMarketFit.recommendedPathwayReason}
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 mt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {visaMarketFit.chancenkartePoints.passedThreshold ? "شانس پذیرش بسیار بالا در سفارت" : "امکان اخذ جاب‌آفر مستقیم"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardEvaluationCards;
