import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Brain,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Send,
  Zap,
  Target,
  FileText,
  Printer,
  Copy,
  Check,
  HelpCircle,
  TrendingUp,
  Award,
  Euro,
  MapPin,
  Lock,
  UserCheck
} from "lucide-react";
import { EvaluatorInput } from "../types";
import {
  ImmigrationProgressState,
  ImmigrationAdvisorReport,
  IMMIGRATION_STAGES_CONFIG,
  fetchGeminiImmigrationAdvice,
  generateRuleBasedAdvisorReport
} from "../services/immigrationAdvisorService";

interface AIImmigrationAdvisorProps {
  profile?: EvaluatorInput | any;
  onNavigateToTab?: (tab: string) => void;
  className?: string;
}

export const AIImmigrationAdvisor: React.FC<AIImmigrationAdvisorProps> = ({
  profile,
  onNavigateToTab,
  className = ""
}) => {
  // Current immigration progress state
  const [progressState, setProgressState] = useState<ImmigrationProgressState>(() => {
    try {
      const saved = localStorage.getItem("germany_immigration_progress_state");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      currentStage: "job_search",
      completedStages: ["profile_eval", "zab_anabin", "cv_prep"],
      targetPathway: "blue_card",
      currentBlocker: "",
      completedPercentage: 45
    };
  });

  // Effective profile
  const effectiveProfile: EvaluatorInput = useMemo(() => {
    return {
      name: profile?.name || "متقاضی کار در آلمان",
      age: profile?.age !== undefined ? Number(profile.age) : 29,
      degree: profile?.degree || "bachelor",
      experience: profile?.experience !== undefined ? Number(profile.experience) : 3,
      field: profile?.field || "فناوری اطلاعات و مهندسی نرم‌افزار",
      germanLevel: profile?.germanLevel || "B1",
      englishLevel: profile?.englishLevel || "B2",
      anabinStatus: profile?.anabinStatus || "H+",
      skills: profile?.skills || "TypeScript, React, Python, Docker, AWS, Git"
    };
  }, [profile]);

  // Advisor report state
  const [advisorReport, setAdvisorReport] = useState<ImmigrationAdvisorReport>(() => {
    return generateRuleBasedAdvisorReport(effectiveProfile, progressState);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"next_steps" | "milestone_audit" | "risk_mitigation">("next_steps");
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("germany_advisor_completed_tasks");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-save progressState
  useEffect(() => {
    try {
      localStorage.setItem("germany_immigration_progress_state", JSON.stringify(progressState));
    } catch {}
  }, [progressState]);

  // Trigger analysis
  const runAdvisorAnalysis = async (queryToUse?: string) => {
    setIsLoading(true);
    try {
      const report = await fetchGeminiImmigrationAdvice({
        profile: effectiveProfile,
        progress: progressState,
        userQuery: queryToUse !== undefined ? queryToUse : userQuery
      });
      setAdvisorReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle stage completion
  const handleToggleStageCompletion = (stageId: string) => {
    setProgressState(prev => {
      const completed = prev.completedStages.includes(stageId)
        ? prev.completedStages.filter(s => s !== stageId)
        : [...prev.completedStages, stageId];
      const pct = Math.round((completed.length / IMMIGRATION_STAGES_CONFIG.length) * 100);
      return {
        ...prev,
        completedStages: completed,
        completedPercentage: pct
      };
    });
  };

  // Toggle checklist task
  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      try {
        localStorage.setItem("germany_advisor_completed_tasks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Quick consultation questions
  const QUICK_QUESTIONS = [
    "چگونه فرآیند ویزا را از طریق بند 81a تسریع کنم؟",
    "کف حقوق بلوکارت ۲۰۲۶ برای رشته من چقدر است؟",
    "آیا با مدرک کاردانی یا بدون مدرک می‌توانم اقدام کنم؟",
    "تفاوت پروسه سفارت تهران و ویزامتریک در کارت شانس چیست؟"
  ];

  return (
    <div className={`space-y-6 ${className}`} dir="rtl" id="ai-immigration-advisor-container">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/40 text-white p-6 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>ماژول مشاور هوشمند مهاجرت کاری آلمان (AI Immigration Advisor)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              تحلیل اختصاصی نقشه راه و راهکارهای اقدام بعدی با Gemini AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              مشاوره مبتنی بر هوش مصنوعی برای رشته تخصصی <strong className="text-amber-400 font-bold">{effectiveProfile.field}</strong> و قوانین مهاجرت کاری ۲۰۲۶ فدرال آلمان (FEG / §18g / §20a).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => runAdvisorAnalysis()}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-300" : ""}`} />
              <span>{isLoading ? "در حال تحلیل پرونده..." : "بروزرسانی تحلیل هوشمند"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>چاپ کارنامه مشاوره (A4)</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-400 font-black text-sm shrink-0">
              {progressState.completedPercentage || 0}٪
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">پیشرفت کل نقشه راه مهاجرت</p>
              <p className="text-[11px] text-slate-400">
                مرحله جاری: <span className="text-indigo-300 font-bold">{IMMIGRATION_STAGES_CONFIG.find(s => s.id === progressState.currentStage)?.nameFa}</span>
              </p>
            </div>
          </div>

          {/* Quick Target Pathway Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] shrink-0">مسیر هدف:</span>
            <select
              value={progressState.targetPathway}
              onChange={e => setProgressState(prev => ({ ...prev, targetPathway: e.target.value as any }))}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-bold focus:ring-1 focus:ring-indigo-500"
            >
              <option value="blue_card">بلوکارت اتحادیه اروپا (§18g)</option>
              <option value="chancenkarte">کارت شانس آلمان (§20a)</option>
              <option value="skilled_worker">ویزای نیروی متخصص ماهر (§18a/18b)</option>
              <option value="it_specialist">ویزای تخصصی IT بر اساس سابقه کار (§19c)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Stage Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>تعیین وضعیت و مراحل تکمیل‌شده نقشه راه:</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-bold">
            {progressState.completedStages.length} از {IMMIGRATION_STAGES_CONFIG.length} مرحله تکمیل شده
          </span>
        </div>

        {/* Horizontal Stepper Carousel */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {IMMIGRATION_STAGES_CONFIG.map((st) => {
            const isCompleted = progressState.completedStages.includes(st.id);
            const isActive = progressState.currentStage === st.id;

            return (
              <div
                key={st.id}
                onClick={() => setProgressState(prev => ({ ...prev, currentStage: st.id }))}
                className={`shrink-0 p-3 rounded-2xl border text-right transition cursor-pointer w-48 space-y-1.5 select-none ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/30"
                    : isCompleted
                    ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">{st.typicalDurationWeeks} هفته</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStageCompletion(st.id);
                    }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition cursor-pointer ${
                      isCompleted ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-700 text-transparent"
                    }`}
                    title={isCompleted ? "علامت‌گذاری به عنوان ناتمام" : "علامت‌گذاری به عنوان انجام‌شده"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-bold text-xs truncate">{st.nameFa}</p>
                <p className="text-[10px] text-slate-500 truncate">{st.descriptionFa}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisor Verdict & 2026 Legal Benchmark Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Summary Verdict & Recommended Pathway (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  ارزیابی و حکم مستشاری هوش مصنوعی
                </h3>
                <span className="text-[10px] text-slate-500">
                  منبع تحلیل: {advisorReport.source === "gemini-3.8-flash" ? "مدل هوشمند فدرال Gemini 3.8 Flash" : "قوانین مصوب مهاجرت کاری فدرال آلمان"}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {advisorReport.fieldOutlookFa.marketDemand}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {advisorReport.summaryVerdictFa}
          </p>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-black text-xs sm:text-sm">
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>مسیر بهینه پیشنهادی: {advisorReport.recommendedPathwayFa}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {advisorReport.pathwayRationaleFa}
            </p>
          </div>
        </div>

        {/* 2026 Industry Field Benchmark (5 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Euro className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                معیارهای رشته در آلمان (۲۰۲۶)
              </h3>
              <p className="text-[10px] text-slate-500">{advisorReport.fieldOutlookFa.fieldTitle}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 font-bold">کف حقوق ناخالص بلوکارت ۲۰۲۶:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                €{advisorReport.fieldOutlookFa.blueCardMinSalaryEur2026.toLocaleString()} / سال
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 font-bold">فرآیند تسریع (§81a):</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                واجد شرایط ۳ هفته‌ای
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="text-slate-500 font-bold block">قطب‌های استخدامی برتر رشته شما:</span>
              <div className="flex flex-wrap gap-1">
                {advisorReport.fieldOutlookFa.topHiringHubs.map((hub, idx) => (
                  <span key={idx} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {hub}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="text-slate-500 font-bold block">کلیدواژه‌های طلایی صنعتی:</span>
              <div className="flex flex-wrap gap-1">
                {advisorReport.fieldOutlookFa.criticalIndustryKeywords.map((kw, idx) => (
                  <span key={idx} className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Tabs: Next Steps / Milestones / Risk Mitigation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("next_steps")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              activeTab === "next_steps"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>اقدامات اولویت‌دار بعدی ({advisorReport.immediateNextSteps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("milestone_audit")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              activeTab === "milestone_audit"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Target className="w-4 h-4 text-emerald-300" />
            <span>ممیزی گام‌به‌گام ایستگاه‌ها ({advisorReport.roadmapMilestoneAudits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("risk_mitigation")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              activeTab === "risk_mitigation"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-300" />
            <span>مدیریت ریسک‌ها و موانع ({advisorReport.riskMitigationTips.length})</span>
          </button>
        </div>

        {/* TAB 1: IMMEDIATE ACTIONABLE NEXT STEPS */}
        {activeTab === "next_steps" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              اقدامات زیر با هوش مصنوعی و بر اساس مرحله جاری پرونده شما استخراج شده‌اند تا بالاترین سرعت اجرایی را ایجاد کنند:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisorReport.immediateNextSteps.map((step) => {
                const priorityBadge = step.priority === "urgent"
                  ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300"
                  : step.priority === "high"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300";

                return (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${priorityBadge}`}>
                          {step.priority === "urgent" ? "اولویت فوری" : step.priority === "high" ? "اولویت بالا" : "اولویت متوسط"}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{step.timeframe}</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <span>{step.title}</span>
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.actionableDescriptionFa}
                      </p>

                      {step.legalReferenceFa && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                          <ShieldCheck className="w-3 h-3" />
                          <span>مرجع قانونی: {step.legalReferenceFa}</span>
                        </div>
                      )}

                      {/* Sub-tasks checklist */}
                      <div className="pt-2 space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">چک‌لیست اجرایی این گام:</p>
                        <div className="space-y-1 text-xs">
                          {step.checklistTasks.map((task, tIdx) => {
                            const taskId = `task_${step.stepNumber}_${tIdx}`;
                            const isDone = Boolean(completedTaskIds[taskId]);

                            return (
                              <div
                                key={tIdx}
                                onClick={() => handleToggleTask(taskId)}
                                className={`flex items-start gap-2 p-1.5 rounded-lg transition cursor-pointer select-none ${
                                  isDone ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 line-through opacity-80" : "hover:bg-white dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-xs shrink-0 ${
                                  isDone ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                                }`}>
                                  {isDone && <Check className="w-3 h-3" />}
                                </div>
                                <span className="text-[11px] leading-tight">{task}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {step.officialPortalUrl && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                        <a
                          href={step.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <span>سامانه رسمی KMK / Anabin</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MILESTONES VELOCITY AUDIT */}
        {activeTab === "milestone_audit" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              بررسی وضعیت پیشرفت در ایستگاه‌های اصلی مسیر مهاجرت کاری فدرال آلمان:
            </p>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {advisorReport.roadmapMilestoneAudits.map((milestone) => {
                const statusConfig = {
                  completed: { label: "تکمیل شده", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300", icon: CheckCircle2 },
                  action_required: { label: "نیازمند اقدام فوری", badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300", icon: Zap },
                  in_progress: { label: "در جریان", badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300", icon: Clock },
                  upcoming: { label: "پیش‌رو", badge: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400", icon: Compass }
                }[milestone.status] || { label: milestone.status, badge: "bg-slate-100 text-slate-600", icon: Compass };

                const IconComponent = statusConfig.icon;

                return (
                  <div key={milestone.stageKey} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-black text-slate-900 dark:text-white">{milestone.stageNameFa}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badge}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-slate-500 pr-6 text-[11px]">{milestone.progressFeedbackFa}</p>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-[11px] text-slate-400 block">زمان تخمینی</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{milestone.estimatedWeeksToComplete} هفته</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: RISK MITIGATION TIPS */}
        {activeTab === "risk_mitigation" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              شناسایی گلوگاه‌های پرتکرار پرونده‌های ایرانی و استراتژی قانونی مصوب برای پیشگیری از ریجکت یا تاخیر:
            </p>

            <div className="space-y-3">
              {advisorReport.riskMitigationTips.map((tip, idx) => {
                const sevConfig = {
                  critical: { badge: "بحرانی", color: "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200" },
                  warning: { badge: "هشدار مهم", color: "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200" },
                  advisory: { badge: "توصیه پیشگیرانه", color: "border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200" }
                }[tip.severity] || { badge: tip.severity, color: "border-slate-300" };

                return (
                  <div key={idx} className={`p-4 rounded-2xl border ${sevConfig.color} space-y-1.5 text-xs`}>
                    <div className="flex items-center justify-between">
                      <h5 className="font-black flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                        <span>{tip.riskTitle}</span>
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white dark:bg-slate-900 border">
                        {sevConfig.badge}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pr-5">
                      {tip.mitigationStrategyFa}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Interactive Consultation Bar (Direct AI Q&A) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              مشاوره اختصاصی زنده و طرح پرسش پرونده
            </h3>
            <p className="text-xs text-slate-500">سوال یا چالش خاص خود را بپرسید تا با Gemini AI و بر اساس پرونده پاسخ داده شود:</p>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {QUICK_QUESTIONS.map((qq, i) => (
            <button
              key={i}
              onClick={() => {
                setUserQuery(qq);
                runAdvisorAnalysis(qq);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition text-[11px] font-semibold cursor-pointer"
            >
              {qq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && userQuery.trim() && !isLoading) {
                runAdvisorAnalysis();
              }
            }}
            placeholder="مثال: چگونه برای همسر و فرزندان هم‌زمان با ویزای بلوکارت اقدام کنم؟"
            className="flex-1 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-semibold"
          />
          <button
            onClick={() => runAdvisorAnalysis()}
            disabled={!userQuery.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 transform -rotate-90" />
            <span>ارسال پرسش</span>
          </button>
        </div>

        {/* Consultation Answer */}
        {advisorReport.consultationAnswerFa && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 space-y-2"
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
                <Brain className="w-4 h-4 text-amber-500" />
                <span>پاسخ مشاور هوشمند فدرال:</span>
              </span>
              <button
                onClick={() => handleCopy(advisorReport.consultationAnswerFa || "", "ans")}
                className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === "ans" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "ans" ? "کپی شد" : "کپی پاسخ"}</span>
              </button>
            </div>
            <p className="leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-300">
              {advisorReport.consultationAnswerFa}
            </p>
          </motion.div>
        )}
      </div>

      {/* Cross Navigation Action Buttons */}
      {onNavigateToTab && (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            گام‌های عملی بعدی متناسب با گزارش مشاور:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateToTab("cv")}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition"
            >
              رزومه‌ساز آلمانی Lebenslauf
            </button>
            <button
              onClick={() => onNavigateToTab("advanced-jobs")}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition"
            >
              جستجوی پیشرفته مشاغل
            </button>
            <button
              onClick={() => onNavigateToTab("resume-analyzer")}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition"
            >
              تحلیلگر پارامتریک رزومه با شرکت‌ها
            </button>
            <button
              onClick={() => onNavigateToTab("jobs")}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-sm"
            >
              موقعیت‌های اسپانسرشیپ ویزا
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIImmigrationAdvisor;
