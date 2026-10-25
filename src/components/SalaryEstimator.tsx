import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Coins, 
  TrendingUp, 
  Sparkles, 
  Building2, 
  MapPin, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  DollarSign, 
  Sliders, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Home, 
  PieChart as PieIcon, 
  BarChart3, 
  FileText, 
  ChevronRight, 
  Info, 
  ArrowUpRight,
  Filter,
  Search,
  Wallet,
  Landmark,
  Calculator
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
import { EvaluatorInput, SalaryEstimateResult, SalaryEstimateCity } from "../types";
import { fetchWithRetry } from "../utils";

interface SalaryEstimatorProps {
  profile?: Partial<EvaluatorInput> | null;
  userField?: string;
  onNavigateToTab?: (tab: string) => void;
}

const COMMON_FIELDS = [
  "مهندسی نرم‌افزار و برنامه‌نویسی",
  "هوش مصنوعی و علم داده (Data Science & AI)",
  "مهندسی DevOps و رایانش ابری (Cloud)",
  "امنیت سایبری و شبکه (Cybersecurity)",
  "مهندسی مکانیک و مکاترونیک",
  "مهندسی برق و الکترونیک و اتوماسیون",
  "پزشکی، دندانپزشکی و پرستاری",
  "مدیریت پروژه و اسکرام مستر (Agile/Scrum)",
  "معماری و مهندسی عمران",
  "مدیریت مالی، حسابداری و فین‌تک"
];

const GERMAN_LEVELS = [
  { value: "A1", label: "A1 - مقدماتی پایه" },
  { value: "A2", label: "A2 - مقدماتی کاربردی" },
  { value: "B1", label: "B1 - متوسط کاری مقدماتی" },
  { value: "B2", label: "B2 - متوسط پیشرفته (توصیه شده بازار کار)" },
  { value: "C1", label: "C1 - مسلط حرفه‌ای و دانشگاهی" },
  { value: "C2", label: "C2 - در حد زبان مادری" }
];

const DEGREES = [
  { value: "bachelor", label: "کارشناسی (Bachelor)" },
  { value: "master", label: "کارشناسی ارشد (Master)" },
  { value: "phd", label: "دکتری (PhD / Promotion)" },
  { value: "diploma", label: "دیپلم و کاردانی / فنی و حرفه‌ای (Ausbildung / Fach)" }
];

const TAX_CLASSES = [
  { value: 1, label: "کلاس ۱: مجرد / بدون فرزند", desc: "متداول‌ترین کلاس مالیاتی برای مهاجرین مجرد بدون فرزند در آلمان" },
  { value: 3, label: "کلاس ۳: متأهل با درآمد اصلی", desc: "برای فرد متأهل که همسرش کار نمی‌کند یا درآمد کمتری دارد (کمترین مالیات ماهیانه)" },
  { value: 4, label: "کلاس ۴: متأهل با درآمد برابر", desc: "پیش‌فرض زوج‌های متأهل که هر دو درآمد مشابه دارند" },
  { value: 5, label: "کلاس ۵: متأهل با درآمد فرعی", desc: "همسر فردی که در کلاس ۳ قرار دارد (مالیات ماهیانه بالاتر)" }
];

export const SalaryEstimator: React.FC<SalaryEstimatorProps> = ({
  profile,
  userField,
  onNavigateToTab
}) => {
  // Input parameters state initialized with profile data
  const [field, setField] = useState<string>(() => {
    return userField || profile?.field || "مهندسی نرم‌افزار و برنامه‌نویسی";
  });
  const [experience, setExperience] = useState<number>(() => {
    if (profile?.experience !== undefined && profile?.experience !== null) {
      return Number(profile.experience);
    }
    return 4;
  });
  const [degree, setDegree] = useState<string>(() => profile?.degree || "bachelor");
  const [germanLevel, setGermanLevel] = useState<string>(() => profile?.germanLevel || "B1");
  const [englishLevel, setEnglishLevel] = useState<string>(() => profile?.englishLevel || "B2");
  const [taxClass, setTaxClass] = useState<number>(1);
  const [skills, setSkills] = useState<string>(() => (profile as any)?.skills || "");

  // UI state
  const [data, setData] = useState<SalaryEstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [chartMetric, setChartMetric] = useState<"gross_annual" | "net_monthly" | "disposable_rent" | "cost_index">("gross_annual");
  const [searchCity, setSearchCity] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"cities" | "tax_breakdown" | "negotiation">("cities");

  // Keep state synced when profile prop updates
  useEffect(() => {
    if (userField && userField !== field) {
      setField(userField);
    } else if (profile?.field && profile.field !== field) {
      setField(profile.field);
    }
    if (profile?.experience !== undefined && profile.experience !== experience) {
      setExperience(Number(profile.experience));
    }
    if (profile?.germanLevel && profile.germanLevel !== germanLevel) {
      setGermanLevel(profile.germanLevel);
    }
    if (profile?.degree && profile.degree !== degree) {
      setDegree(profile.degree);
    }
  }, [profile, userField]);

  // Fetch estimation from API
  const fetchSalaryEstimate = useCallback(async (customParams?: {
    customField?: string;
    customExp?: number;
    customDegree?: string;
    customGerman?: string;
    customTaxClass?: number;
  }) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const activeField = customParams?.customField || field;
      const activeExp = customParams?.customExp ?? experience;
      const activeDegree = customParams?.customDegree || degree;
      const activeGerman = customParams?.customGerman || germanLevel;
      const activeTaxClass = customParams?.customTaxClass ?? taxClass;

      const res = await fetchWithRetry("/api/gemini/salary-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: activeField,
          experience: activeExp,
          degree: activeDegree,
          skills: skills || activeField,
          germanLevel: activeGerman,
          englishLevel,
          taxClass: activeTaxClass,
          selectedCity: "all"
        })
      });

      if (!res.ok) {
        throw new Error(`خطای دریافت تخمین حقوق (کد ${res.status})`);
      }

      const result: SalaryEstimateResult = await res.json();
      setData(result);
    } catch (err: any) {
      console.error("[SalaryEstimator] Error fetching salary estimate:", err);
      setErrorMsg("امکان برقراری ارتباط با سرویس ابری میسر نشد؛ در حال نمایش اطلاعات استاندارد تعرفه‌ای آلمان.");
    } finally {
      setIsLoading(false);
    }
  }, [field, experience, degree, germanLevel, englishLevel, taxClass, skills]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSalaryEstimate();
  }, []);

  // Experience level badge helper
  const experienceBadge = useMemo(() => {
    if (experience <= 2) return { label: "جونیور / تازه کار (Junior / 0-2 yrs)", color: "text-sky-400 bg-sky-950/60 border-sky-500/30" };
    if (experience <= 5) return { label: "میان‌رده متخصص (Mid-Level / 3-5 yrs)", color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30" };
    if (experience <= 8) return { label: "ارشد / کارشناس خبره (Senior / 6-8 yrs)", color: "text-indigo-400 bg-indigo-950/60 border-indigo-500/30" };
    return { label: "راهبر فنی / مدیر (Lead & Principal / 9+ yrs)", color: "text-amber-400 bg-amber-950/60 border-amber-500/30" };
  }, [experience]);

  // Filtered cities list
  const filteredCities = useMemo(() => {
    if (!data?.cities) return [];
    if (!searchCity.trim()) return data.cities;
    const q = searchCity.toLowerCase();
    return data.cities.filter(c => 
      c.cityNameFa.toLowerCase().includes(q) ||
      c.cityNameDe.toLowerCase().includes(q) ||
      c.stateFa.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q)
    );
  }, [data?.cities, searchCity]);

  // Data formatted for Recharts comparison
  const chartData = useMemo(() => {
    if (!data?.cities) return [];
    return data.cities.map(city => {
      const disposableIncome = Math.max(0, city.estimatedNetMonthlyEur - city.averageMonthlyRent1BedCenterEur);
      return {
        cityKey: city.cityKey,
        name: city.cityNameFa,
        nameDe: city.cityNameDe,
        stateFa: city.stateFa,
        grossAnnual: city.medianGrossAnnualEur,
        grossAnnualMin: city.minGrossAnnualEur,
        grossAnnualMax: city.maxGrossAnnualEur,
        netMonthly: city.estimatedNetMonthlyEur,
        grossMonthly: city.medianGrossMonthlyEur,
        rentCenter: city.averageMonthlyRent1BedCenterEur,
        disposableMonthly: disposableIncome,
        costIndex: city.costOfLivingIndex,
        blueCardStatus: city.blueCardPassStatus
      };
    });
  }, [data?.cities]);

  // Copy summary to clipboard
  const handleCopySummary = () => {
    if (!data) return;
    const summaryText = `📊 برآورد حقوق و دستمزد تخصصی در آلمان (نسخه ۲۰۲۶)
تخصص: ${data.professionTitleFa} (${data.professionTitleDe})
سابقه کار: ${data.experienceYears} سال (${data.experienceLevelLabel})
میانگین ناخالص ملی: ${data.nationalAverage.medianGrossAnnualEur.toLocaleString()} € / سال (ماهانه ${data.nationalAverage.medianGrossMonthlyEur.toLocaleString()} €)
خالص تخمینی (کلاس ${taxClass}): ${data.nationalAverage.estimatedNetMonthlyEur.toLocaleString()} € / ماه
حداقل قانونی بلوکارت: ${data.blueCardThresholdEur.toLocaleString()} € / سال
وضعیت بلوکارت: ${data.nationalAverage.medianGrossAnnualEur >= data.blueCardThresholdEur ? "✅ واجد شرایط کامل" : "⚠️ نیازمند افزایش"}

تفکیک شهرهای کلیدی:
${data.cities.map(c => `• ${c.cityNameFa} (${c.cityNameDe}): ناخالص ${c.medianGrossAnnualEur.toLocaleString()} € / خالص ${c.estimatedNetMonthlyEur.toLocaleString()} € / اجاره ${c.averageMonthlyRent1BedCenterEur.toLocaleString()} €`).join("\n")}

تهیه شده در سامانه هوشمند کاریابی و مهاجرت جهانبان آلمان`;

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div 
      id="dashboard-salary-estimator-card"
      className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 md:p-8 space-y-7 shadow-xl relative overflow-hidden transition-all print-break-inside-avoid"
    >
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>ابزار هوشمند تخمین حقوق و درآمد در آلمان (AI Salary Estimator)</span>
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Entgeltatlas 2026 / Destatis
            </span>
            {data?.isAiGenerated ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>تحلیل آنی با Gemini AI</span>
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                موتور استاندارد فدرال
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>برآورد واقعی درآمد ناخالص و خالص در شهرهای آلمان</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
            محاسبه طیف دستمزد بر اساس تخصص، سوابق کاری، مدرک دانشگاهی و ارزیابی انطباق کامل با نصاب کف حقوق بلوکارت (§ 18g AufenthG) در سال ۲۰۲۶.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="کپی خلاصه گزارش برآورد حقوق"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>کپی گزارش حقوق</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => fetchSalaryEstimate()}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "در حال محاسبه هوشمند..." : "محاسبه مجدد"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls & Parameters Box */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-300">تنظیم پارامترهای شغلی متقاضی:</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">(تغییر مقادیر و مشاهده آنی تاثیر بر سطح درآمد)</span>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${experienceBadge.color}`}>
            {experienceBadge.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Field Selection - Span 4 */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>عنوان تخصص یا رشته:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="مثلاً مهندسی نرم‌افزار، هوش مصنوعی، مکانیک..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pt-1 no-scrollbar">
              {COMMON_FIELDS.slice(0, 3).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setField(f)}
                  className={`text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap cursor-pointer transition ${
                    field === f 
                      ? "bg-indigo-600 text-white font-bold" 
                      : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f.split(" ")[0]} {f.split(" ")[1] || ""}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Slider - Span 3 */}
          <div className="lg:col-span-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>سابقه کار مرتبط:</span>
              </label>
              <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {experience} سال
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>تازه فارغ‌التحصیل (۰)</span>
              <span>۵ سال</span>
              <span>۱۰ سال</span>
              <span>۱۵+ سال</span>
            </div>
          </div>

          {/* Degree & German Level - Span 3 */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-amber-400" />
                <span>مدرک تحصیلی:</span>
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                {DEGREES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label.split(" ")[0]}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Globe className="w-3 h-3 text-sky-400" />
                <span>سطح آلمانی:</span>
              </label>
              <select
                value={germanLevel}
                onChange={(e) => setGermanLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                {GERMAN_LEVELS.map((g) => (
                  <option key={g.value} value={g.value}>{g.value} ({g.label.split("-")[1]?.trim() || ""})</option>
                ))}
              </select>
            </div>
          </div>

          {/* German Tax Class (Steuerklasse) - Span 2 */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1" title="کلاس مالیاتی در آلمان بر میزان کسر مالیات از حقوق ناخالص تاثیر مستقیم دارد">
              <Landmark className="w-3 h-3 text-rose-400" />
              <span>کلاس مالیاتی:</span>
            </label>
            <select
              value={taxClass}
              onChange={(e) => setTaxClass(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer font-bold"
            >
              {TAX_CLASSES.map((tc) => (
                <option key={tc.value} value={tc.value}>کلاس {tc.value}</option>
              ))}
            </select>
            <span className="text-[9.5px] text-slate-400 block truncate" title={TAX_CLASSES.find(tc => tc.value === taxClass)?.desc}>
              {TAX_CLASSES.find(tc => tc.value === taxClass)?.label.split(":")[1] || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Main National Average KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Annual Gross Median & Range */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">میانگین حقوق ناخالص سالانه:</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
              {data ? data.nationalAverage.medianGrossAnnualEur.toLocaleString() : "--"}
            </span>
            <span className="text-xs font-bold text-indigo-400">€ / سال (Brutto)</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>بازه دستمزد:</span>
            <span className="font-mono text-slate-300 font-bold">
              {data ? `${data.nationalAverage.minGrossAnnualEur.toLocaleString()} - ${data.nationalAverage.maxGrossAnnualEur.toLocaleString()} €` : "--"}
            </span>
          </div>
        </div>

        {/* Card 2: Monthly Gross */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">ناخالص دریافتی ماهانه:</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {data ? data.nationalAverage.medianGrossMonthlyEur.toLocaleString() : "--"}
            </span>
            <span className="text-xs font-bold text-emerald-400">€ / ماه</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>مبنای قرارداد کاری:</span>
            <span className="font-bold text-slate-300">۴۰ ساعت در هفته</span>
          </div>
        </div>

        {/* Card 3: Estimated Monthly Net (Netto) */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">تخمین خالص در حساب (Netto):</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-sky-400 font-mono tracking-tight">
              {data ? data.nationalAverage.estimatedNetMonthlyEur.toLocaleString() : "--"}
            </span>
            <span className="text-xs font-bold text-sky-400">€ / ماه (خالص)</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>پس از کسر مالیات و بیمه:</span>
            <span className="font-bold text-sky-300">کلاس {taxClass} ({data?.taxAndDeductionsBreakdown?.netTakeHomePercent || 62}٪ ناخالص)</span>
          </div>
        </div>

        {/* Card 4: Blue Card 2026 Legal Status */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">تطابق بلوکارت (§ 18g):</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-amber-300 font-mono tracking-tight">
              {data ? data.blueCardThresholdEur.toLocaleString() : "41,041"}
            </span>
            <span className="text-xs font-bold text-amber-400">€ / سال (کف قانونی)</span>
          </div>
          <div className="text-[11px] pt-1 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">وضعیت احراز:</span>
            {data && data.nationalAverage.medianGrossAnnualEur >= data.blueCardThresholdEur ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>کاملاً واجد شرایط (+{((data.nationalAverage.medianGrossAnnualEur - data.blueCardThresholdEur) / 1000).toFixed(0)}k€)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-amber-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>مشروط به پیشنهاد بالاتر</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary Narrative Banner */}
      {data?.summaryFa && (
        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-indigo-300">تحلیل کلی چشم‌انداز درآمدی این موقعیت شغلی:</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.summaryFa}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Recharts Chart Section */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-black text-white">مقایسه تحلیلی دستمزدها در ۸ قطب اقتصادی آلمان</h4>
            </div>
            <p className="text-[11px] text-slate-400">
              نمودار مقایسه‌ای هوشمند بر اساس آمار رسمی فدرال سال ۲۰۲۶ و هزینه‌های واقعی زندگی
            </p>
          </div>

          {/* Metric Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setChartMetric("gross_annual")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                chartMetric === "gross_annual"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ناخالص سالانه (€)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("net_monthly")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                chartMetric === "net_monthly"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              خالص دریافتی ماهانه (€)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("disposable_rent")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                chartMetric === "disposable_rent"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              مازاد خالص پس از اجاره (€)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("cost_index")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                chartMetric === "cost_index"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              شاخص هزینه زندگی
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full pt-2" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false}
                interval={0}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false}
                tickFormatter={(val) => {
                  if (chartMetric === "cost_index") return `${val}`;
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}k€`;
                  return `${val}€`;
                }}
              />
              <RechartsTooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-right text-xs space-y-1.5 max-w-xs" dir="rtl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-3">
                        <span className="font-black text-white text-sm">{item.name} ({item.nameDe})</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.stateFa}</span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">حقوق ناخالص سالانه:</span>
                          <span className="font-mono font-bold text-indigo-400">{item.grossAnnual.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">خالص دریافتی ماهانه:</span>
                          <span className="font-mono font-bold text-emerald-400">{item.netMonthly.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">میانگین اجاره ۱ خوابه مرکز:</span>
                          <span className="font-mono font-bold text-rose-400">{item.rentCenter.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-800">
                          <span className="text-slate-400">پس‌انداز خالص پس از اجاره:</span>
                          <span className="font-mono font-bold text-sky-400">{item.disposableMonthly.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">شاخص هزینه (برلین=۱۰۰):</span>
                          <span className="font-mono font-bold text-amber-400">{item.costIndex}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              {chartMetric === "gross_annual" && data?.blueCardThresholdEur && (
                <ReferenceLine 
                  y={data.blueCardThresholdEur} 
                  stroke="#f59e0b" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: `کف بلوکارت (${(data.blueCardThresholdEur / 1000).toFixed(0)}k€)`, 
                    fill: "#f59e0b", 
                    fontSize: 10, 
                    position: "insideTopRight" 
                  }} 
                />
              )}
              <Bar 
                dataKey={
                  chartMetric === "gross_annual" 
                    ? "grossAnnual" 
                    : chartMetric === "net_monthly" 
                      ? "netMonthly" 
                      : chartMetric === "disposable_rent" 
                        ? "disposableMonthly" 
                        : "costIndex"
                } 
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry, index) => {
                  let fillColor = "#6366f1"; // Indigo
                  if (chartMetric === "net_monthly") fillColor = "#10b981"; // Emerald
                  if (chartMetric === "disposable_rent") fillColor = "#0ea5e9"; // Sky
                  if (chartMetric === "cost_index") fillColor = "#f59e0b"; // Amber
                  // Munich highlight
                  if (entry.cityKey === "munich") fillColor = "#8b5cf6"; // Purple
                  if (entry.cityKey === "leipzig") fillColor = "#14b8a6"; // Teal
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              <span>مونیخ و فرانکفورت: بالاترین درآمد ناخالص</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
              <span>لایپزیگ: بیشترین قدرت خرید واقعی به دلیل اجاره پایین‌تر</span>
            </span>
          </div>
          <span className="font-mono text-slate-500">منبع داده: آمار رسمی اداره کار فدرال (BA) ۲۰۲۶</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Cities Grid, Tax Breakdown, Negotiation Tips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("cities")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "cities"
                  ? "bg-slate-800 text-white border border-slate-700 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>کارت‌های اختصاصی شهرها ({data?.cities?.length || 8})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tax_breakdown")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "tax_breakdown"
                  ? "bg-slate-800 text-white border border-slate-700 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PieIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>شفافیت مالیات و کسورات بیمه در آلمان</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("negotiation")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "negotiation"
                  ? "bg-slate-800 text-white border border-slate-700 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>نکات طلایی هوش مصنوعی برای مذاکره حقوق</span>
            </button>
          </div>

          {activeTab === "cities" && (
            <div className="relative w-48 hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجوی شهر..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Detailed City Cards Grid */}
        {activeTab === "cities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCities.map((city) => {
              const disposableIncome = Math.max(0, city.estimatedNetMonthlyEur - city.averageMonthlyRent1BedCenterEur);
              const isEligible = city.medianGrossAnnualEur >= (data?.blueCardThresholdEur || 41041);
              return (
                <div 
                  key={city.cityKey}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between transition group shadow-sm"
                >
                  <div className="space-y-2">
                    {/* City Title & State */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-base font-black text-white group-hover:text-indigo-400 transition flex items-center gap-1.5">
                          <span>{city.cityNameFa}</span>
                          <span className="text-xs text-slate-400 font-mono font-normal">({city.cityNameDe})</span>
                        </h5>
                        <span className="text-[11px] text-slate-500 block">{city.stateFa} • {city.state}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        شاخص {city.costOfLivingIndex}
                      </span>
                    </div>

                    {/* Salary Numbers */}
                    <div className="bg-slate-900/90 rounded-xl p-3 space-y-2 border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">ناخالص سالانه میانه:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-white font-mono">
                            {city.medianGrossAnnualEur.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-bold text-indigo-400">€ / سال</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          بازه: {city.minGrossAnnualEur.toLocaleString()} - {city.maxGrossAnnualEur.toLocaleString()} €
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                        <div>
                          <span className="text-[10px] text-slate-400 block">خالص ماهانه (Netto):</span>
                          <span className="text-sm font-black text-emerald-400 font-mono">
                            {city.estimatedNetMonthlyEur.toLocaleString()} €
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block">اجاره ۱ خوابه:</span>
                          <span className="text-xs font-mono font-bold text-rose-400">
                            ~{city.averageMonthlyRent1BedCenterEur.toLocaleString()} €
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Disposable Income After Rent */}
                    <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-indigo-300 flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-indigo-400" />
                        <span>مازاد خالص پس از اجاره:</span>
                      </span>
                      <span className="font-mono font-black text-indigo-300 text-xs">
                        +{disposableIncome.toLocaleString()} €
                      </span>
                    </div>

                    {/* Highlights */}
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                      {city.cityHighlightsFa}
                    </p>
                  </div>

                  {/* Badges Footer */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-400">قدرت خرید: <strong className="text-slate-200">{city.purchasingPowerRating}</strong></span>
                    {isEligible ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>تایید بلوکارت</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-amber-400 font-bold">
                        <AlertCircle className="w-3 h-3" />
                        <span>نزدیک به کف</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: German Tax & Social Security Breakdown */}
        {activeTab === "tax_breakdown" && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>تحلیل دقیق کسورات قانونی و مالیاتی در فیش حقوقی آلمان (Lohnabrechnung)</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                در آلمان بر خلاف برخی کشورها، قراردادها همواره به صورت ناخالص (Brutto) منعقد می‌شوند. حدود ۳۸٪ تا ۴۲٪ از حقوق ناخالص صرف مالیات بر درآمد و بیمه‌های اجباری ۴ گانه بازنشستگی، درمان، بیکاری و مراقبت سالمندی می‌گردد.
              </p>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-sky-400">خالص دریافتی به حساب: ~{data?.taxAndDeductionsBreakdown?.netTakeHomePercent || 61.9}٪</span>
                <span className="text-indigo-400">بیمه‌های اجتماعی اجباری: ~{data?.taxAndDeductionsBreakdown?.socialSecurityPercent || 20.6}٪</span>
                <span className="text-rose-400">مالیات بر درآمد (Lohnsteuer): ~{data?.taxAndDeductionsBreakdown?.incomeTaxPercent || 17.5}٪</span>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  className="bg-sky-500 h-full transition-all" 
                  style={{ width: `${data?.taxAndDeductionsBreakdown?.netTakeHomePercent || 61.9}%` }} 
                  title="خالص دریافتی"
                />
                <div 
                  className="bg-indigo-500 h-full transition-all" 
                  style={{ width: `${data?.taxAndDeductionsBreakdown?.socialSecurityPercent || 20.6}%` }} 
                  title="بیمه‌های اجتماعی"
                />
                <div 
                  className="bg-rose-500 h-full transition-all" 
                  style={{ width: `${data?.taxAndDeductionsBreakdown?.incomeTaxPercent || 17.5}%` }} 
                  title="مالیات بر درآمد"
                />
              </div>
            </div>

            {/* 4 Pillars of German Social Security Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-xs font-black text-white block">۱. بیمه بازنشستگی (Rentenversicherung)</span>
                <span className="font-mono text-xs font-bold text-indigo-400">۹.۳٪ سهم کارمند (+ ۹.۳٪ سهم کارفرما)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  سرمایه‌گذاری برای حقوق بازنشستگی آتی در آلمان. در صورت بازگشت به ایران پس از ۵ سال، تحت شرایطی امکان بازپس‌گیری حق بیمه پرداختی کارمند وجود دارد.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-xs font-black text-white block">۲. بیمه سلامت دولتی (Krankenversicherung)</span>
                <span className="font-mono text-xs font-bold text-emerald-400">~۸.۱۵٪ سهم کارمند (+ ۸.۱۵٪ سهم کارفرما)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  پوشش ۱۰۰٪ کلیه هزینه‌های درمانی، بیمارستانی، دارویی و پزشکی برای خود متقاضی، همسر و تمام فرزندان بدون دریافت حق بیمه مازاد (Familienversicherung).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-xs font-black text-white block">۳. بیمه بیکاری (Arbeitslosenversicherung)</span>
                <span className="font-mono text-xs font-bold text-amber-400">۱.۳٪ سهم کارمند (+ ۱.۳٪ سهم کارفرما)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  در صورت قطع همکاری پس از ۱۲ ماه کار، دولت آلمان به مدت ۱۲ ماه معادل ۶۰٪ تا ۶۷٪ آخرین حقوق خالص شما را به عنوان بیمه بیکاری (ALG I) پرداخت می‌کند.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-xs font-black text-white block">۴. بیمه مراقبت و سالمندی (Pflegeversicherung)</span>
                <span className="font-mono text-xs font-bold text-sky-400">~۲.۲٪ سهم کارمند (+ ۲.۲٪ سهم کارفرما)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  پوشش خدمات پرستاری و مراقبت در صورت ناتوانی جسمی یا سالمندی در خاک آلمان با استاندارد رفاهی بالا.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Negotiation Masterclass */}
        {activeTab === "negotiation" && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>راهنمای اختصاصی هوش مصنوعی برای مذاکره حقوق با کارفرمایان آلمانی</span>
              </h4>
              <p className="text-xs text-slate-400">
                چگونه در مصاحبه‌های استخدامی آلمان خواسته حقوقی خود (Gehaltsvorstellung) را حرفه‌ای مطرح نمایید:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(data?.negotiationTips || [
                "همیشه رقم حقوق را به صورت ناخالص سالانه (Brutto pro Jahr) بیان کنید، نه ماهانه یا خالص.",
                "یک بازه ۵,۰۰۰ یورویی اعلام کنید تا انعطاف‌پذیری حرفه‌ای خود را نشان دهید (مثلاً: بین ۶۸,۰۰۰ تا ۷۳,۰۰۰ یورو).",
                "به حداقل کف حقوق بلوکارت اشاره نکنید؛ ارزش تخصص، کد اشتغال KldB و کمبود نیرو در این فیلد را برجسته سازید.",
                "در مورد پاداش پایان سال (Weihnachtsgeld)، بلیت قطار سازمانی (Jobticket) و بودجه دورکاری (Home Office Budget) مذاکره کنید."
              ]).map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>پیشنهاد کارفرما شامل دوره آزمایشی (Probezeit) معمولاً ۶ ماهه است.</span>
              </span>
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab("interview")}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <span>تمرین مصاحبه حقوق در سربرگ شبیه‌ساز مصاحبه</span>
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>هماهنگ با شاخص هزینه‌های استاتیستیک فدرال آلمان (Destatis) و سامانه Entgeltatlas ۲۰۲۶</span>
        </div>
        {onNavigateToTab && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateToTab("advanced-jobs")}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>جستجوی پوزیشن‌های شغلی با حقوق تاییدشده</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryEstimator;
