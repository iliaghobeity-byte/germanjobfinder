import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  Sparkles,
  TrendingUp,
  MapPin,
  Building2,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Euro,
  Info,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ChevronDown,
  Award,
  Wallet,
  Home,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
  HelpCircle,
  BarChart3,
  ExternalLink
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
  ReferenceLine
} from "recharts";
import {
  GermanStateSalaryBenchmark,
  SalaryCalculatorResult,
  SalaryCalculatorParams,
  EvaluatorInput
} from "../types";
import {
  GERMAN_STATES_DATA,
  POPULAR_JOB_PRESETS,
  generateLocalRuleBasedSalary,
  calculateGermanNetSalary
} from "../salaryCalculatorHelpers";
import { fetchWithRetry } from "../utils";

interface SalaryCalculatorProps {
  profile?: Partial<EvaluatorInput> | null;
  onNavigateToTab?: (tab: string) => void;
}

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  profile,
  onNavigateToTab
}) => {
  // Input parameters state initialized with user profile if available
  const [jobTitle, setJobTitle] = useState<string>(() => {
    return profile?.targetRole || profile?.field || "Senior DevOps & Cloud Engineer";
  });

  const [selectedState, setSelectedState] = useState<string>("bayern");
  const [experienceYears, setExperienceYears] = useState<number>(() => {
    return profile?.experience ? Math.min(15, Math.max(1, profile.experience)) : 4;
  });

  const [seniorityLevel, setSeniorityLevel] = useState<"junior" | "mid" | "senior" | "lead">(() => {
    const exp = profile?.experience || 4;
    if (exp <= 2) return "junior";
    if (exp <= 5) return "mid";
    if (exp <= 8) return "senior";
    return "lead";
  });

  const [degree, setDegree] = useState<string>(() => {
    return profile?.degree || "bachelor";
  });

  const [germanLevel, setGermanLevel] = useState<string>(() => {
    return profile?.germanLevel || "B1";
  });

  const [companySize, setCompanySize] = useState<"startup" | "sme" | "enterprise">("sme");
  const [taxClass, setTaxClass] = useState<number>(1);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [hasChurchTax, setHasChurchTax] = useState<boolean>(false);

  // Region filter for state comparison chart: "all" | "south" | "west" | "north" | "east"
  const [regionFilter, setRegionFilter] = useState<"all" | "south" | "west" | "north" | "east">("all");
  
  // Custom search query for jobs presets
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // AI Loading & Result state
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<SalaryCalculatorResult>(() => {
    // Generate initial baseline calculation immediately so UI is vibrant and ready
    return generateLocalRuleBasedSalary({
      jobTitle: profile?.targetRole || profile?.field || "Senior DevOps & Cloud Engineer",
      state: "bayern",
      experienceYears: profile?.experience ? Math.min(15, Math.max(1, profile.experience)) : 4,
      seniorityLevel: (profile?.experience || 4) <= 2 ? "junior" : (profile?.experience || 4) <= 5 ? "mid" : "senior",
      degree: profile?.degree || "bachelor",
      germanLevel: profile?.germanLevel || "B1",
      companySize: "sme",
      taxClass: 1,
      hasChildren: false,
      hasChurchTax: false
    });
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync seniority with experience slider
  const handleExperienceChange = (years: number) => {
    setExperienceYears(years);
    if (years <= 2) setSeniorityLevel("junior");
    else if (years <= 5) setSeniorityLevel("mid");
    else if (years <= 8) setSeniorityLevel("senior");
    else setSeniorityLevel("lead");
  };

  // Trigger calculation (local or AI via server endpoint)
  const handleCalculateSalary = useCallback(async (useAi: boolean = true) => {
    const payload: SalaryCalculatorParams = {
      jobTitle: jobTitle.trim() || "Software Developer",
      state: selectedState,
      experienceYears,
      seniorityLevel,
      degree,
      germanLevel,
      companySize,
      taxClass,
      hasChildren,
      hasChurchTax
    };

    if (!useAi) {
      const localResult = generateLocalRuleBasedSalary(payload);
      setCalculationResult(localResult);
      return;
    }

    setIsLoadingAi(true);
    try {
      const res = await fetchWithRetry("/api/gemini/salary-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data: SalaryCalculatorResult = await res.json();
      setCalculationResult(data);
    } catch (err) {
      console.warn("AI Salary calculation fell back to statutory rule-based engine:", err);
      const fallbackResult = generateLocalRuleBasedSalary(payload);
      setCalculationResult(fallbackResult);
    } finally {
      setIsLoadingAi(false);
    }
  }, [
    jobTitle,
    selectedState,
    experienceYears,
    seniorityLevel,
    degree,
    germanLevel,
    companySize,
    taxClass,
    hasChildren,
    hasChurchTax
  ]);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Filtered state comparisons for chart
  const filteredStatesForChart = useMemo(() => {
    if (!calculationResult?.stateComparisons) return [];
    if (regionFilter === "all") return calculationResult.stateComparisons;
    return calculationResult.stateComparisons.filter(s => s.region === regionFilter);
  }, [calculationResult?.stateComparisons, regionFilter]);

  // Chart data formatted for Recharts
  const chartData = useMemo(() => {
    return filteredStatesForChart.map(st => ({
      name: st.nameFa,
      nameDe: st.nameDe,
      nominalGross: st.medianGrossAnnualEur,
      adjustedReal: st.adjustedRealPurchasingPowerEur,
      costOfLiving: st.costOfLivingIndex,
      isCurrent: st.stateKey === selectedState.toLowerCase()
    }));
  }, [filteredStatesForChart, selectedState]);

  // Popular presets filtered by category
  const filteredPresets = useMemo(() => {
    if (categoryFilter === "all") return POPULAR_JOB_PRESETS;
    return POPULAR_JOB_PRESETS.filter(p => p.category === categoryFilter);
  }, [categoryFilter]);

  const currentSelectedStateInfo = useMemo(() => {
    return GERMAN_STATES_DATA.find(s => s.key === selectedState.toLowerCase()) || GERMAN_STATES_DATA[0];
  }, [selectedState]);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100" dir="rtl">
      
      {/* 1. HERO BANNER & STATUTORY CONTEXT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 md:p-10 border border-indigo-500/30 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>محاسبه‌گر دستمزد رقابتی آلمان ۲۰۲۶/۲۰۲۷</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>مبتنی بر اطلس دستمزد فدرال (Entgeltatlas)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>پردازش هوشمند با هوش مصنوعی جمینای</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              برآورد رنج حقوق رقابتی، ناخالص به خالص و قدرت خرید در ۱۶ ایالت آلمان
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              در آلمان، دستمزد کارشناسان نه بر اساس یک عدد صلب، بلکه به صورت بازه ناخالص سالانه (Bruttojahresgehalt) بر مبنای ایالت، سابقه، اندازه شرکت و زبان سنجیده می‌شود. این ماژول هوشمند با ارزیابی آستانه قانونی بلوکارت ۲۰۲۶ (§ 18g AufenthG) و کسر مالیات و بیمه‌های درمانی، موقعیت دقیق شما را در بازار مشخص می‌کند.
            </p>
          </div>

          {/* Quick Benchmark Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">کف بلوکارت مشاغل کمبود (۲۰۲۶):</span>
              <strong className="text-emerald-400 font-mono text-sm sm:text-base font-black">۴۱,۰۴۱ €</strong>
              <span className="text-[10px] text-slate-400 block font-normal">ماهانه حدود ۳,۴۲۰ € ناخالص</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">کف بلوکارت سایر مشاغل:</span>
              <strong className="text-indigo-300 font-mono text-sm sm:text-base font-black">۴۵,۳۰۰ €</strong>
              <span className="text-[10px] text-slate-400 block font-normal">ماهانه حدود ۳,۷۷۵ € ناخالص</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">میانگین افزایش سالانه دستمزد:</span>
              <strong className="text-amber-300 font-mono text-sm sm:text-base font-black">+۴.۸٪</strong>
              <span className="text-[10px] text-slate-400 block font-normal">شاخص تعدیل تورم Destatis</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">تفاوت دستمزد بین ایالت‌ها:</span>
              <strong className="text-sky-300 font-mono text-sm sm:text-base font-black">تا ۳۰٪</strong>
              <span className="text-[10px] text-slate-400 block font-normal">با جبران هزینه مسکن در شرق</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE SALARY CALCULATOR CONTROL PANEL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>پیکربندی پارامترهای شغلی و مشخصات متقاضی</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              عنوان شغلی و ایالت هدف خود را مشخص کنید تا هوش مصنوعی جدیدترین داده‌های بازار ۲۰۲۶ را محاسبه کند.
            </p>
          </div>

          {/* Quick Presets Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] ml-1">حوزه:</span>
            {[
              { id: "all", label: "همه" },
              { id: "it", label: "فناوری و نرم‌افزار" },
              { id: "engineering", label: "مهندسی و صنعت" },
              { id: "healthcare", label: "پزشکی و درمان" },
              { id: "business", label: "مدیریت و مالی" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Job Title Quick Pills */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            انتخاب سریع از میان مشاغل پرتقاضای آلمان (Mangelberufe):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {filteredPresets.map(preset => (
              <button
                key={preset.titleEn}
                onClick={() => setJobTitle(preset.titleEn)}
                className={`text-[11px] px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                  jobTitle.toLowerCase() === preset.titleEn.toLowerCase()
                    ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{preset.titleFa}</span>
                <span className="text-[10px] text-slate-400 font-mono">({preset.titleEn})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* 1. Job Title Input */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                <span>عنوان دقیق شغل (Job Title):</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">آلمانی یا انگلیسی</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="مثال: Cloud Solutions Architect یا Senior Frontend Developer"
                className="w-full pl-3 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Federal State (Bundesland) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>ایالت مقصد (Bundesland):</span>
              </span>
              <span className="text-[10px] text-slate-400">۱۶ ایالت فدرال</span>
            </label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              {GERMAN_STATES_DATA.map(st => (
                <option key={st.key} value={st.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {st.nameFa} - {st.nameDe} ({st.capitalFa}) [ضریب: {Math.round(st.salaryFactor * 100)}%]
                </option>
              ))}
            </select>
          </div>

          {/* 3. Seniority Level */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>رده ارشدیت (Seniority):</span>
              </span>
            </label>
            <select
              value={seniorityLevel}
              onChange={e => setSeniorityLevel(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="junior" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">تازه‌کار / Junior (۰ تا ۲ سال)</option>
              <option value="mid" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">میان‌رده / Mid-Level (۳ تا ۵ سال)</option>
              <option value="senior" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">ارشد / Senior (۶ تا ۸ سال)</option>
              <option value="lead" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">لید و مدیر فنی / Lead / Staff (۹+ سال)</option>
            </select>
          </div>

          {/* 4. Experience Slider */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
              <span>سابقه کار تخصصی:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                {experienceYears} سال سابقه کار
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={experienceYears}
              onChange={e => handleExperienceChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>۱ سال</span>
              <span>۵ سال</span>
              <span>۱۰ سال</span>
              <span>۱۵+ سال</span>
            </div>
          </div>

          {/* 5. Degree */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              <span>مدرک تحصیلی:</span>
            </label>
            <select
              value={degree}
              onChange={e => setDegree(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="bachelor" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">کارشناسی (Bachelor)</option>
              <option value="master" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">کارشناسی ارشد (Master)</option>
              <option value="phd" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">دکتری تخصصی (PhD)</option>
              <option value="ausbildung" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">فنی و حرفه‌ای (Ausbildung / Fach)</option>
            </select>
          </div>

          {/* 6. German Language Level */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>سطح زبان آلمانی:</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">اهرم مذاکره</span>
            </label>
            <select
              value={germanLevel}
              onChange={e => setGermanLevel(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="A1" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">A1 - پایه مقدماتی</option>
              <option value="A2" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">A2 - روزمره کاربردی</option>
              <option value="B1" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">B1 - حدنصاب اقامت دائم سریع</option>
              <option value="B2" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">B2 - تسلط کاری استاندارد (+۴٪)</option>
              <option value="C1" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">C1 - روان و حرفه‌ای (+۸٪)</option>
              <option value="C2" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">C2 - زبان مادری (+۱۰٪)</option>
            </select>
          </div>

          {/* 7. Company Size */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-500" />
              <span>اندازه کارفرما / شرکت:</span>
            </label>
            <select
              value={companySize}
              onChange={e => setCompanySize(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="startup" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">استارتاپ (&lt; ۵۰ نفر)</option>
              <option value="sme" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">شرکت متوسط / Mittelstand (۵۰ تا ۱۰۰۰ نفر)</option>
              <option value="enterprise" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">شرکت بزرگ / اینترپرایز / DAX (&gt; ۱۰۰۰ نفر)</option>
            </select>
          </div>

          {/* 8. German Tax Class (Steuerklasse) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>کلاس مالیاتی (Steuerklasse):</span>
              <span className="text-[10px] text-slate-400 font-normal">برای محاسبه Netto</span>
            </label>
            <select
              value={taxClass}
              onChange={e => setTaxClass(Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value={1} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">کلاس ۱: مجرد / مهاجر تنها</option>
              <option value={3} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">کلاس ۳: متأهل با درآمد اصلی (بیشترین خالص)</option>
              <option value={4} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">کلاس ۴: متأهل با درآمد همسان</option>
              <option value={5} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">کلاس ۵: متأهل با درآمد فرعی</option>
            </select>
          </div>

          {/* 9. Tax Nuances: Children & Church Tax */}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={e => setHasChildren(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
              />
              <span>دارای فرزند تحت تکفل (تخفیف بیمه مراقبت و حق اولاد Kindergeld)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={hasChurchTax}
                onChange={e => setHasChurchTax(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
              />
              <span>مالیات کلیسا (Kirchensteuer - ۸٪ تا ۹٪)</span>
            </label>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>محاسبات بر اساس داده‌های رسمی سازمان فدرال آلمان (BAMF &amp; BA) و مصوبات سال ۲۰۲۶ به‌روزرسانی می‌شوند.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleCalculateSalary(false)}
              disabled={isLoadingAi}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              محاسبه فوری محلی
            </button>

            <button
              onClick={() => handleCalculateSalary(true)}
              disabled={isLoadingAi}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-black text-xs sm:text-sm transition shadow-md shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isLoadingAi ? "animate-spin" : ""}`} />
              <span>{isLoadingAi ? "در حال پردازش هوش مصنوعی..." : "تحلیل عمیق هوش مصنوعی جمینای"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CALCULATION RESULTS DISPLAY */}
      {calculationResult && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Target Job Title & State Card Banner */}
          <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-300 font-mono font-bold border border-indigo-500/40">
                  {calculationResult.jobTitle.kldbCode}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  {calculationResult.selectedState.nameFa} ({calculationResult.selectedState.nameDe})
                </span>
                {calculationResult.isAiGenerated && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>تایید هوش مصنوعی Gemini 3.8 Flash</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {calculationResult.jobTitle.fa}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                {calculationResult.jobTitle.de} | {calculationResult.jobTitle.en}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopyText(calculationResult.summaryFa, "summary")}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-1.5"
                title="کپی خلاصه تحلیل"
              >
                {copiedKey === "summary" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "summary" ? "کپی شد" : "کپی خلاصه"}</span>
              </button>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab("advanced-jobs")}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span>جستجوی فرصت‌های این شغل</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 4. FOUR COMPETITIVE SALARY TIERS (Percentile 25, 50, 75, 90) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 25th Percentile: Entry Competitive */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-400 dark:hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">صدک ۲۵ (ورودی رقابتی)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">25th %</span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {calculationResult.competitiveRanges.percentile25.annualGross.toLocaleString()} €
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ناخالص سالانه (Brutto)</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">دریافتی خالص ماهانه:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  ~{calculationResult.competitiveRanges.percentile25.estimatedMonthlyNet.toLocaleString()} € Netto
                </span>
              </div>
            </div>

            {/* 50th Percentile: Market Median (Primary Focus) */}
            <div className="bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/40 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-5 shadow-md space-y-3 relative overflow-hidden ring-2 ring-indigo-500/20">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-400 to-indigo-500" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>میانه بازار (Median Target)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-black">هدف مذاکره</span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white font-mono">
                  {calculationResult.competitiveRanges.percentile50.annualGross.toLocaleString()} €
                </div>
                <span className="text-xs text-indigo-800 dark:text-indigo-200 font-bold">
                  ماهانه: {calculationResult.competitiveRanges.percentile50.monthlyGross.toLocaleString()} € ناخالص
                </span>
              </div>
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-bold">دریافتی خالص ماهانه:</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-black font-mono text-sm">
                  ~{calculationResult.competitiveRanges.percentile50.estimatedMonthlyNet.toLocaleString()} € Netto
                </span>
              </div>
            </div>

            {/* 75th Percentile: Top Tier / Senior */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-400 dark:hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">صدک ۷۵ (متخصصان برتر)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">75th %</span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {calculationResult.competitiveRanges.percentile75.annualGross.toLocaleString()} €
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ناخالص سالانه (Brutto)</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">دریافتی خالص ماهانه:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  ~{calculationResult.competitiveRanges.percentile75.estimatedMonthlyNet.toLocaleString()} € Netto
                </span>
              </div>
            </div>

            {/* 90th Percentile: Peak Enterprise Tier */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-400 dark:hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">صدک ۹۰ (غول‌های اینترپرایز)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">90th %</span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {calculationResult.competitiveRanges.percentile90.annualGross.toLocaleString()} €
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">سقف شرکت‌های DAX &amp; US Tech</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">دریافتی خالص ماهانه:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  ~{calculationResult.competitiveRanges.percentile90.estimatedMonthlyNet.toLocaleString()} € Netto
                </span>
              </div>
            </div>

          </div>

          {/* 5. EU BLUE CARD STATUTORY ELIGIBILITY EVALUATION */}
          <div className={`p-5 sm:p-6 rounded-3xl border-2 transition-all ${
            calculationResult.blueCardCheck.isEligible
              ? "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-950 dark:text-emerald-100"
              : "bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/40 text-amber-950 dark:text-amber-100"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${calculationResult.blueCardCheck.isEligible ? "text-emerald-500" : "text-amber-500"}`} />
                  <h4 className="text-sm sm:text-base font-black">
                    {calculationResult.blueCardCheck.isEligible
                      ? "تطابق قطعی با معیارهای رسمی بلوکارت اتحادیه اروپا (§ 18g AufenthG)"
                      : "وضعیت مرزی برای صدور مستقیم بلوکارت"}
                  </h4>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed">
                  {calculationResult.blueCardCheck.assessmentFa}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <span>
                    کف قانونی سالانه ۲۰۲۶: <strong className="font-mono">{calculationResult.blueCardCheck.thresholdFormatted}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    نوع حرفه: <strong className="font-bold">{calculationResult.blueCardCheck.isShortageOccupation ? "شغل کمبود نیرو (Mangelberuf)" : "شغل عمومی"}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    اقامت دائم سریع: پس از {calculationResult.blueCardCheck.fastTrackResidencyMonths} ماه کار و پرداخت بیمه
                  </span>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab("visa-simulator")}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  شبیه‌ساز ویزا و استراتژی
                </button>
              )}
            </div>
          </div>

          {/* 6. COMPARATIVE RECHARTS BAR CHART: 16 GERMAN STATES */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>مقایسه رنج حقوق ناخالص و قدرت خرید واقعی در ۱۶ ایالت فدرال</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  میله‌های سرمه‌ای نشان‌دهنده دستمزد اسمی و میله‌های سبز نشان‌دهنده قدرت خرید واقعی پس از کسر شاخص هزینه زندگی و اجاره مسکن هستند.
                </p>
              </div>

              {/* Region Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] ml-1">ناحیه:</span>
                {[
                  { id: "all", label: "تمام ۱۶ ایالت" },
                  { id: "south", label: "جنوب (بایرن و باو)" },
                  { id: "west", label: "غرب (NRW و هسن)" },
                  { id: "north", label: "شمال (هامبورگ و برمن)" },
                  { id: "east", label: "شرق (برلین و زاکسن)" }
                ].map(reg => (
                  <button
                    key={reg.id}
                    onClick={() => setRegionFilter(reg.id as any)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      regionFilter === reg.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-80 sm:h-96 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={50}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={val => `${Math.round(val / 1000)}k€`}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 text-white p-3.5 rounded-2xl border border-slate-800 shadow-xl text-xs space-y-1.5" dir="rtl">
                            <div className="font-black text-sm text-amber-300">
                              {data.name} ({data.nameDe})
                            </div>
                            <div className="text-slate-300">
                              میانه حقوق ناخالص: <strong className="text-white font-mono">{data.nominalGross?.toLocaleString()} €</strong>
                            </div>
                            <div className="text-slate-300">
                              قدرت خرید تعدیل‌شده با هزینه مسکن: <strong className="text-emerald-400 font-mono">{data.adjustedReal?.toLocaleString()} €</strong>
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              شاخص هزینه زندگی (آلمان = ۱۰۰): <strong className="text-indigo-300">{data.costOfLiving}</strong>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                    formatter={val => val === "nominalGross" ? "میانه حقوق ناخالص سالانه (Gross)" : "قدرت خرید واقعی تعدیل‌شده با مخارج (Real)"}
                  />
                  <ReferenceLine
                    y={calculationResult.blueCardCheck.thresholdEur}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: `کف بلوکارت (${calculationResult.blueCardCheck.thresholdFormatted})`,
                      fill: "#10b981",
                      fontSize: 10,
                      position: "insideTopLeft"
                    }}
                  />
                  <Bar dataKey="nominalGross" fill="#6366f1" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-nom-${index}`}
                        fill={entry.isCurrent ? "#4f46e5" : "#6366f1"}
                        opacity={entry.isCurrent ? 1 : 0.85}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="adjustedReal" fill="#10b981" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-real-${index}`}
                        fill={entry.isCurrent ? "#059669" : "#10b981"}
                        opacity={entry.isCurrent ? 1 : 0.75}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Strategic Note on Regions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed">
              <strong className="text-slate-900 dark:text-white block font-black">
                💡 نکته راهبردی برای مهاجران ایرانی (تله اسمی دستمزد در برابر قدرت خرید واقعی):
              </strong>
              <p>
                اگرچه ایالت‌هایی نظیر بایرن (مونیخ) و هسن (فرانکفورت) بالاترین ارقام ناخالص را ارائه می‌دهند، اما هزینه مسکن در مونیخ (متوسط ۱,۴۲۰ یورو برای آپارتمان تک‌خوابه) بخش قابل‌توجهی از حقوق را می‌بلعد. در مقابل، ایالت‌هایی مانند نوردراین-وستفالن (NRW) و زاکسن (لایپزیگ و درسدن) به دلیل اجاره‌های ۵۰۰ تا ۷۶۰ یورویی، بیشترین قدرت پس‌انداز ماهانه و کیفیت زندگی واقعی را نصیب شما می‌کنند.
              </p>
            </div>
          </div>

          {/* 7. BRUTTO VS NETTO: TAX & SOCIAL DEDUCTIONS BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Progressive Taxes & Social Insurance Box */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>تحلیل ریز کسورات قانونی و حقوق خالص ماهانه (Netto)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    بر اساس کلاس مالیاتی {taxClass} ({hasChildren ? "با فرزند" : "بدون فرزند"}) در ایالت {calculationResult.selectedState.nameFa}
                  </p>
                </div>
                <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  دریافتی: {100 - calculationResult.taxNetBreakdown.effectiveDeductionRate}٪
                </span>
              </div>

              {/* Monthly Visual Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>کل حقوق ناخالص ماهانه:</span>
                  <span className="font-mono text-sm text-slate-900 dark:text-white">
                    {calculationResult.taxNetBreakdown.grossMonthlyEur.toLocaleString()} €
                  </span>
                </div>

                {/* Multi-segment bar */}
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${100 - calculationResult.taxNetBreakdown.effectiveDeductionRate}%` }}
                    className="bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer"
                    title={`خالص دریافتی (${calculationResult.taxNetBreakdown.netMonthlyTakeHomeEur} €)`}
                  />
                  <div
                    style={{ width: `${Math.round((calculationResult.taxNetBreakdown.socialSecurityEur / calculationResult.taxNetBreakdown.grossMonthlyEur) * 100)}%` }}
                    className="bg-indigo-500 hover:bg-indigo-400 transition-all cursor-pointer"
                    title={`بیمه‌های تأمین اجتماعی (${calculationResult.taxNetBreakdown.socialSecurityEur} €)`}
                  />
                  <div
                    style={{ width: `${Math.round((calculationResult.taxNetBreakdown.incomeTaxEur / calculationResult.taxNetBreakdown.grossMonthlyEur) * 100)}%` }}
                    className="bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer"
                    title={`مالیات بر درآمد (${calculationResult.taxNetBreakdown.incomeTaxEur} €)`}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>خالص دریافتی به حساب بانکی (Girokonto)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                    <span>سهم کارمند از بیمه‌ها (Sozialabgaben)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>مالیات بر درآمد (Lohnsteuer)</span>
                  </span>
                </div>
              </div>

              {/* Deductions Detailed Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block">بیمه بازنشستگی (RV - ۹.۳٪):</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm">
                    {calculationResult.taxNetBreakdown.pensionInsuranceEur.toLocaleString()} €
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-normal">تضمین بازنشستگی آلمان</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block">بیمه درمان (KV - ۸.۱۵٪):</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm">
                    {calculationResult.taxNetBreakdown.healthInsuranceEur.toLocaleString()} €
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-normal">پوشش کامل پزشکی خانواده</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block">بیمه مراقبت (PV):</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm">
                    {calculationResult.taxNetBreakdown.careInsuranceEur.toLocaleString()} €
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-normal">مراقبت سالمندی و ناتوانی</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block">بیمه بیکاری (AV - ۱.۳٪):</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm">
                    {calculationResult.taxNetBreakdown.unemploymentInsuranceEur.toLocaleString()} €
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-normal">دریافت ۶۰-۶۷٪ حقوق بیکاری</span>
                </div>
              </div>
            </div>

            {/* Right Col: Cost of Living & Rent Snapshot */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-amber-400" />
                    <span>مخارج مسکن در {calculationResult.selectedState.nameFa}:</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
                    شاخص: {calculationResult.selectedState.costOfLivingIndex}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[11px] block">میانگین اجاره ۱‌خوابه مرکز شهر:</span>
                  <div className="text-xl font-black text-amber-300 font-mono">
                    ~{calculationResult.selectedState.averageRent1BedCenterEur.toLocaleString()} € / ماه
                  </div>
                  <span className="text-[10px] text-slate-300 leading-normal block">
                    حدود {Math.round((calculationResult.selectedState.averageRent1BedCenterEur / calculationResult.taxNetBreakdown.netMonthlyTakeHomeEur) * 100)}٪ از خالص دریافتی ماهانه شما
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-bold text-white block">صنایع کلیدی این ایالت:</span>
                  <div className="flex flex-wrap gap-1">
                    {calculationResult.selectedState.topIndustries.map(ind => (
                      <span key={ind} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[10px] border border-slate-700">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
                <span className="text-slate-300 font-bold block mb-1">ویژگی برجسته ایالت:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {calculationResult.selectedState.stateHighlightFa}
                </p>
              </div>
            </div>

          </div>

          {/* 8. MARKET TRENDS 2026 & SKILLS PREMIUM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Hot In-Demand Skills with Salary Boosts */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>مهارت‌های داغ و اهرم‌های افزایش حقوق در بازار ۲۰۲۶</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  مهارت‌هایی که کارفرمایان آلمانی حاضرند بابت داشتن آن‌ها ارقام بالاتری در آفر درج کنند:
                </p>
              </div>

              <div className="space-y-2.5">
                {calculationResult.marketTrends2026.inDemandSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {sk.skill}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                      +{sk.bonusEstimateEur.toLocaleString()} € / سال
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span>شیوه کاری ترجیحی کارفرمایان:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {calculationResult.marketTrends2026.remoteHybridRatio}
                </span>
              </div>
            </div>

            {/* Right: Key Employers Recruiting & Volume */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>برترین کمپانی‌های در حال جذب نیرو برای این عنوان در آلمان</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {calculationResult.marketTrends2026.jobOpeningVolumeFa}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {calculationResult.marketTrends2026.topHiringEmployers.map((emp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="truncate">{emp}</span>
                  </div>
                ))}
              </div>

              {/* Negotiation Script Preview */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-amber-900 dark:text-amber-200 font-bold">
                  <span>دیالوگ استاندارد مصاحبه آلمانی (Gehaltsvorstellung):</span>
                  <button
                    onClick={() => handleCopyText(calculationResult.negotiationPlaybook.salaryExpectationScriptDe, "de_script")}
                    className="text-[11px] text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "de_script" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === "de_script" ? "کپی شد" : "کپی متن آلمانی"}</span>
                  </button>
                </div>
                <p className="font-mono text-left text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed" dir="ltr">
                  "{calculationResult.negotiationPlaybook.salaryExpectationScriptDe}"
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-amber-500/20">
                  ترجمه: {calculationResult.negotiationPlaybook.salaryExpectationScriptFa}
                </p>
              </div>
            </div>

          </div>

          {/* 9. SALARY NEGOTIATION PLAYBOOK & PERKS CHECKLIST */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>راهنمای تاکتیکی مذاکره دستمزد با کارفرمایان آلمانی</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مذاکره در فرهنگ تجاری آلمان کاملاً داده‌محور، محترمانه و به صورت ناخالص سالانه (Brutto) انجام می‌پذیرد.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Tactical rules */}
              <div className="space-y-2">
                <h5 className="font-black text-slate-900 dark:text-white text-xs">قوانین طلایی جلسه مصاحبه:</h5>
                <ul className="space-y-2">
                  {calculationResult.negotiationPlaybook.tacticalAdviceFa.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Non-cash perks */}
              <div className="space-y-2">
                <h5 className="font-black text-slate-900 dark:text-white text-xs">مزایای جانبی معاف از مالیات جهت مذاکره (Corporate Benefits):</h5>
                <div className="grid grid-cols-1 gap-2">
                  {calculationResult.negotiationPlaybook.recommendedPerks.map((pk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 dark:text-white font-mono text-xs block">
                          {pk.perkDe}
                        </strong>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px] block">
                          {pk.perkFa}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                        {pk.valueNoteFa}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SalaryCalculator;
