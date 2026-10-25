import React, { useState, useMemo } from "react";
import {
  IMMIGRATION_TIERS,
  ImmigrationTier,
  ImmigrationTierId,
  TierStep,
  KeySuccessFactor,
  getTierById
} from "../data/immigrationTiersData";
import {
  Briefcase,
  GraduationCap,
  Target,
  Wrench,
  Compass,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Printer,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Filter,
  Check,
  Layers,
  FileCheck2,
  Lightbulb,
  Zap,
  Bookmark,
  BookmarkCheck,
  Copy,
  ShieldAlert,
  Flame,
  Info
} from "lucide-react";
import { triggerPrintWithTitle, formatPrintDocumentTitle } from "../utils";

interface ImmigrationTierRoadmapSectionProps {
  selectedTierId: ImmigrationTierId;
  onSelectTier: (tierId: ImmigrationTierId) => void;
  onSelectArticle?: (articleId: string) => void;
  isFilterAppliedToArticles: boolean;
  onToggleFilterArticles: () => void;
}

export const ImmigrationTierRoadmapSection: React.FC<ImmigrationTierRoadmapSectionProps> = ({
  selectedTierId,
  onSelectTier,
  onSelectArticle,
  isFilterAppliedToArticles,
  onToggleFilterArticles
}) => {
  const currentTier = useMemo(() => getTierById(selectedTierId), [selectedTierId]);
  
  // Track expanded step details
  const [expandedStepNumbers, setExpandedStepNumbers] = useState<number[]>([1, 2]);

  // Track checked items per tier in localStorage
  const [tierChecklist, setTierChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("germany_tier_roadmap_checklist");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheckItem = (key: string) => {
    setTierChecklist(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("germany_tier_roadmap_checklist", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const toggleStepExpanded = (stepNum: number) => {
    setExpandedStepNumbers(prev =>
      prev.includes(stepNum) ? prev.filter(n => n !== stepNum) : [...prev, stepNum]
    );
  };

  const handleExpandAll = () => {
    if (expandedStepNumbers.length === currentTier.steps.length) {
      setExpandedStepNumbers([]);
    } else {
      setExpandedStepNumbers(currentTier.steps.map(s => s.stepNumber));
    }
  };

  // Calculate progress for current tier
  const tierProgress = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;

    currentTier.steps.forEach(step => {
      step.checklist.forEach((_, idx) => {
        totalItems++;
        const key = `${currentTier.id}_step${step.stepNumber}_item${idx}`;
        if (tierChecklist[key]) completedItems++;
      });
    });

    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return { totalItems, completedItems, percent };
  }, [currentTier, tierChecklist]);

  // Key Success Factors state
  const [factorFilter, setFactorFilter] = useState<"all" | "vital" | "high" | "competitive_edge">("all");
  const [copiedFactorId, setCopiedFactorId] = useState<string | null>(null);
  const [bookmarkedFactorIds, setBookmarkedFactorIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("germany_tier_bookmarked_factors");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSuccessFactorsExpanded, setIsSuccessFactorsExpanded] = useState<boolean>(true);

  const toggleBookmarkFactor = (factorId: string) => {
    setBookmarkedFactorIds(prev => {
      const next = prev.includes(factorId) ? prev.filter(id => id !== factorId) : [...prev, factorId];
      try {
        localStorage.setItem("germany_tier_bookmarked_factors", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleCopyFactor = (factor: KeySuccessFactor) => {
    const text = `فاکتور کلیدی موفقیت (${currentTier.titleFa}):\n${factor.titleFa} (${factor.titleDe})\n${factor.explanation}\nاقدام اجرایی: ${factor.actionableStep}\nمبنا: ${factor.officialRef || "قوانین مهاجرت آلمان"}`;
    navigator.clipboard.writeText(text);
    setCopiedFactorId(factor.id);
    setTimeout(() => setCopiedFactorId(null), 2500);
  };

  // Filtered Key Success Factors
  const filteredFactors = useMemo(() => {
    if (!currentTier.keySuccessFactors) return [];
    if (factorFilter === "all") return currentTier.keySuccessFactors;
    return currentTier.keySuccessFactors.filter(f => f.impactLevel === factorFilter);
  }, [currentTier, factorFilter]);

  const factorCounts = useMemo(() => {
    const list = currentTier.keySuccessFactors || [];
    return {
      all: list.length,
      vital: list.filter(f => f.impactLevel === "vital").length,
      high: list.filter(f => f.impactLevel === "high").length,
      competitive_edge: list.filter(f => f.impactLevel === "competitive_edge").length
    };
  }, [currentTier]);

  const handlePrintTierRoadmap = () => {
    const title = formatPrintDocumentTitle(`نقشه_راه_مهاجرت_${currentTier.titleFa}`);
    triggerPrintWithTitle(title, () => window.print());
  };

  const getTierIcon = (iconName: string) => {
    switch (iconName) {
      case "Briefcase": return <Briefcase className="w-5 h-5" />;
      case "GraduationCap": return <GraduationCap className="w-5 h-5" />;
      case "Target": return <Target className="w-5 h-5" />;
      case "Wrench": return <Wrench className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-400/30 text-xs font-black flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-500 animate-spin-slow" />
              <span>رده‌های مهاجرتی و نقشه راه مرحله‌به‌مرحله آلمان (Immigration Tiers)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30 text-[10px] font-bold">
              نسخه به‌روزرسانی‌شده ۲۰۲۶
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            نقشه راه اختصاصی بر اساس وضعیت شما در سال ۲۰۲۶
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
            مسیر مهاجرتی مدنظر خود را انتخاب فرمایید تا نقشه راه اداری، الزامات قانونی، مواعد زمانی و چک‌لیست اقدامات کنسولی آن فوراً شخصی‌سازی شود.
          </p>
        </div>

        {/* Action Buttons: Print & Filter Articles */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onToggleFilterArticles}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isFilterAppliedToArticles
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
            title="فیلتر کردن مقالات پایگاه دانش پایین بر اساس این رده مهاجرتی"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{isFilterAppliedToArticles ? "حذف فیلتر مقالات رده" : `فیلتر مقالات این رده (${currentTier.relevantArticleIds.length})`}</span>
          </button>

          <button
            onClick={handlePrintTierRoadmap}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="چاپ رسمی نقشه راه این مسیر در فرمت A4"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>چاپ نقشه راه (A4)</span>
          </button>
        </div>
      </div>

      {/* Tier Switcher Toggle Bar (4 Interactive Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {IMMIGRATION_TIERS.map(tier => {
          const isSelected = tier.id === selectedTierId;

          return (
            <button
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              className={`p-4 rounded-2xl border-2 text-right transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-br from-indigo-900/90 via-slate-900 to-indigo-950 text-white border-indigo-500 shadow-lg shadow-indigo-900/30 scale-[1.02] ring-1 ring-indigo-400/50"
                  : "bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 shadow-xs"
              }`}
            >
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? "bg-white/15 text-white" : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  }`}>
                    {getTierIcon(tier.iconName)}
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? "bg-indigo-500/30 text-indigo-200 border border-indigo-400/30" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}>
                    {tier.steps.length} مرحله
                  </span>
                </div>

                <div>
                  <h3 className={`font-black text-sm leading-tight ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {tier.titleFa}
                  </h3>
                  <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"}`}>
                    {tier.titleDe}
                  </p>
                </div>

                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? "text-slate-200" : "text-slate-600 dark:text-slate-400"}`}>
                  {tier.shortDescription}
                </p>
              </div>

              {/* Legal Reference & Active indicator */}
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[10px] relative z-10">
                <span className={`font-mono font-bold ${isSelected ? "text-indigo-300" : "text-slate-500"}`}>
                  {tier.legalParagraph.split("(")[0].trim()}
                </span>
                
                {isSelected && (
                  <span className="flex items-center gap-1 font-bold text-amber-400 text-[10px]">
                    <Check className="w-3 h-3" />
                    <span>رده فعال</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tier Identity & KPI Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-indigo-900/60 text-white space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Tier Identity Row */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentTier.badgeColor}`}>
                {currentTier.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-750">
                {currentTier.legalParagraph}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{currentTier.titleFa}</span>
            </h3>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              <strong>مخاطبان هدف:</strong> {currentTier.targetAudience}
            </p>
          </div>

          {/* Progress Tracker Pill */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-right shrink-0 space-y-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">پیشرفت چک‌لیست:</span>
              <strong className="text-emerald-400 font-bold">{tierProgress.percent}٪</strong>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${tierProgress.percent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block text-left font-mono">
              {tierProgress.completedItems} از {tierProgress.totalItems} اقدام انجام‌شده
            </span>
          </div>
        </div>

        {/* 4-Column Key Metrics Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {currentTier.keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 flex flex-col justify-between"
            >
              <span className="text-[11px] text-slate-400 font-medium">{metric.label}:</span>
              <div className="text-lg sm:text-xl font-black text-amber-300 font-mono">
                {metric.value}
              </div>
              {metric.sublabel && (
                <p className="text-[10px] text-slate-400 leading-tight">
                  {metric.sublabel}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Pros & Key Challenges Bar */}
        <div className="relative z-10 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1.5">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>مزایای برجسته این رده مهاجرتی:</span>
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px] pr-2">
              {currentTier.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-1.5">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>شروط کلیدی و الزامات خط‌قرمز:</span>
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px] pr-2">
              {currentTier.criticalRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Key Success Factors Tips Section */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-5 sm:p-6 shadow-sm space-y-5 transition-all">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Lightbulb className="w-4 h-4 text-amber-500" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                فاکتورهای کلیدی موفقیت و ترفندهای حیاتی (Key Success Factors)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-200 dark:border-indigo-800">
                {factorCounts.all} فاکتور استراتژیک
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-8">
              اهرم‌های شتاب‌دهنده قانونی، نکات تعیین‌کننده مصاحبه و راهکارهای عبور از تله‌های کنسولی برای <strong className="text-slate-800 dark:text-slate-200">{currentTier.titleFa}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setIsSuccessFactorsExpanded(!isSuccessFactorsExpanded)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isSuccessFactorsExpanded ? "جمع‌وجور کردن" : "مشاهده جزئیات فاکتورها"}</span>
              {isSuccessFactorsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Filter Pills & Grid */}
        {isSuccessFactorsExpanded && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setFactorFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  factorFilter === "all"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750"
                }`}
              >
                <span>همه ترفندها</span>
                <span className="text-[10px] opacity-75 font-mono">({factorCounts.all})</span>
              </button>

              <button
                onClick={() => setFactorFilter("vital")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  factorFilter === "vital"
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/30"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>الزامات ۱۰۰٪ حیاتی</span>
                <span className="text-[10px] font-mono">({factorCounts.vital})</span>
              </button>

              <button
                onClick={() => setFactorFilter("high")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  factorFilter === "high"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/30"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>تاکتیک‌های اجرایی و مالی</span>
                <span className="text-[10px] font-mono">({factorCounts.high})</span>
              </button>

              <button
                onClick={() => setFactorFilter("competitive_edge")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  factorFilter === "competitive_edge"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30"
                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>مزیت‌های رقابتی و شتاب‌دهنده</span>
                <span className="text-[10px] font-mono">({factorCounts.competitive_edge})</span>
              </button>
            </div>

            {/* Key Success Factors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredFactors.map(factor => {
                const isBookmarked = bookmarkedFactorIds.includes(factor.id);
                const isCopied = copiedFactorId === factor.id;

                let levelBadgeStyle = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
                let levelIcon = <ShieldAlert className="w-3.5 h-3.5" />;
                if (factor.impactLevel === "high") {
                  levelBadgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
                  levelIcon = <Target className="w-3.5 h-3.5" />;
                } else if (factor.impactLevel === "competitive_edge") {
                  levelBadgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
                  levelIcon = <Zap className="w-3.5 h-3.5" />;
                }

                return (
                  <div
                    key={factor.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:border-indigo-400/50 dark:hover:border-indigo-600/50 transition-all flex flex-col justify-between space-y-3.5 shadow-xs hover:shadow-md"
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges & Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${levelBadgeStyle}`}>
                            {levelIcon}
                            <span>{factor.impactLabelFa}</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                            {factor.categoryTag}
                          </span>

                          {factor.officialRef && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono border border-indigo-200/60 dark:border-indigo-800/60">
                              {factor.officialRef}
                            </span>
                          )}
                        </div>

                        {/* Actions: Copy & Bookmark */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopyFactor(factor)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                            title="کپی کردن متن این نکته کلیدی"
                          >
                            {isCopied ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">کپی شد!</span>
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => toggleBookmarkFactor(factor.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                            title={isBookmarked ? "حذف از نشان‌شده‌ها" : "نشان کردن این فاکتور"}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                          {factor.titleFa}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          {factor.titleDe}
                        </p>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                        {factor.explanation}
                      </p>
                    </div>

                    {/* Actionable Step Box */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>اقدام اجرایی و فوری متقاضی:</span>
                        </span>

                        {factor.metricNote && (
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/40">
                            {factor.metricNote}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {factor.actionableStep}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Interactive Roadmap Header & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              مراحل گام‌به‌گام اجرایی: {currentTier.titleFa}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold">
              ۶ گام کلیدی
            </span>
          </div>

          <button
            onClick={handleExpandAll}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{expandedStepNumbers.length === currentTier.steps.length ? "بستن همه گام‌ها" : "باز کردن جزئیات همه گام‌ها"}</span>
            {expandedStepNumbers.length === currentTier.steps.length ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Timeline Steps Accordion List */}
        <div className="space-y-3">
          {currentTier.steps.map((step) => {
            const isExpanded = expandedStepNumbers.includes(step.stepNumber);

            return (
              <div
                key={step.stepNumber}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-indigo-400/60 dark:hover:border-indigo-600/60 transition overflow-hidden"
              >
                {/* Step Header */}
                <div
                  onClick={() => toggleStepExpanded(step.stepNumber)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/70 dark:bg-slate-850/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Step Number Badge */}
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
                      {step.stepNumber}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                          {step.timeframe}
                        </span>
                        <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                          {step.titleFa}
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {step.titleDe}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {step.checklist.length} اقدام
                    </span>
                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Step Content Drawer */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                    
                    {/* Summary */}
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                      {step.summary}
                    </p>

                    {/* Key Actions Bullet List */}
                    <div className="space-y-2">
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        اقدامات و پروتکل‌های اجرایی این مرحله:
                      </strong>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 pr-2">
                        {step.keyActions.map((action, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips & Warnings Box */}
                    {step.tips && step.tips.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 space-y-1">
                        <strong className="font-bold flex items-center gap-1.5 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>نکات کلیدی و راهکارهای موفقیت:</span>
                        </strong>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300 pr-1">
                          {step.tips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive Checklist (With state tracking) */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                      <strong className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>چک‌لیست مدارک و اقدامات این گام (روی موارد تکمیل‌شده کلیک کنید):</span>
                      </strong>

                      <div className="space-y-1.5 pr-1">
                        {step.checklist.map((item, cIdx) => {
                          const itemKey = `${currentTier.id}_step${step.stepNumber}_item${cIdx}`;
                          const isChecked = !!tierChecklist[itemKey];

                          return (
                            <label
                              key={cIdx}
                              onClick={() => toggleCheckItem(itemKey)}
                              className={`flex items-start gap-2.5 p-2 rounded-lg transition cursor-pointer select-none text-xs ${
                                isChecked
                                  ? "bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 line-through"
                                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="mt-0.5 rounded accent-indigo-600"
                              />
                              <span className="leading-snug">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Action Links: Guide Article & Official Portal */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-2">
                        {step.relevantArticleId && onSelectArticle && (
                          <button
                            onClick={() => onSelectArticle(step.relevantArticleId!)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold transition cursor-pointer text-[11px] border border-indigo-200/60 dark:border-indigo-800/60"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>مطالعه مقاله تفصیلی این مرحله در راهنما</span>
                            <ArrowRight className="w-3 h-3 rotate-180" />
                          </button>
                        )}

                        {step.officialLink && (
                          <a
                            href={step.officialLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition text-[11px]"
                          >
                            <span>{step.officialLink.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        Phase {step.stepNumber} of {currentTier.steps.length}
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ImmigrationTierRoadmapSection;
