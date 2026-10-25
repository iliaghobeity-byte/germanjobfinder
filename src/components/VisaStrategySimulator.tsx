import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  SlidersHorizontal,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Languages,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  ArrowRight,
  Printer,
  Scale,
  FileText,
  Building2,
  HelpCircle,
  ExternalLink,
  Zap,
  Info
} from "lucide-react";
import VisaSuccessForecast from "./VisaSuccessForecast";
import { EvaluatorInput } from "../types";

interface VisaStrategySimulatorProps {
  profile?: EvaluatorInput | {
    name?: string;
    age?: number;
    degree?: string;
    experience?: number;
    field?: string;
    germanLevel?: string;
    englishLevel?: string;
    anabinStatus?: string;
  } | null;
  onNavigateToTab?: (tab: string) => void;
  onUpdateProfile?: (updated: any) => void;
}

export const VisaStrategySimulator: React.FC<VisaStrategySimulatorProps> = ({
  profile,
  onNavigateToTab,
  onUpdateProfile
}) => {
  // Simulator Live Profile Parameters (Age, Degree, Experience, German Level)
  const [simAge, setSimAge] = useState<number>(() => {
    return profile?.age !== undefined ? Number(profile.age) : 29;
  });

  const [simDegree, setSimDegree] = useState<string>(() => {
    return profile?.degree || "bachelor";
  });

  const [simExperience, setSimExperience] = useState<number>(() => {
    return profile?.experience !== undefined ? Number(profile.experience) : 3;
  });

  const [simGermanLevel, setSimGermanLevel] = useState<string>(() => {
    return profile?.germanLevel || "B1";
  });

  const [simEnglishLevel, setSimEnglishLevel] = useState<string>(() => {
    return profile?.englishLevel || "B2";
  });

  const [simField, setSimField] = useState<string>(() => {
    return profile?.field || "فناوری اطلاعات و مهندسی نرم‌افزار";
  });

  const [simAnabinStatus, setSimAnabinStatus] = useState<string>(() => {
    return profile?.anabinStatus || "H+";
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Sync state if profile prop changes from outside (guarded by serialized check)
  const lastProfileRef = useRef<string>("");
  useEffect(() => {
    if (profile) {
      const serialized = JSON.stringify({
        age: profile.age,
        degree: profile.degree,
        experience: profile.experience,
        germanLevel: profile.germanLevel,
        englishLevel: profile.englishLevel,
        field: profile.field,
        anabinStatus: profile.anabinStatus
      });
      if (lastProfileRef.current !== serialized) {
        lastProfileRef.current = serialized;
        if (profile.age !== undefined) setSimAge(Number(profile.age));
        if (profile.degree) setSimDegree(profile.degree);
        if (profile.experience !== undefined) setSimExperience(Number(profile.experience));
        if (profile.germanLevel) setSimGermanLevel(profile.germanLevel);
        if (profile.englishLevel) setSimEnglishLevel(profile.englishLevel);
        if (profile.field) setSimField(profile.field);
        if (profile.anabinStatus) setSimAnabinStatus(profile.anabinStatus);
      }
    }
  }, [
    profile?.age,
    profile?.degree,
    profile?.experience,
    profile?.germanLevel,
    profile?.englishLevel,
    profile?.field,
    profile?.anabinStatus
  ]);

  // Derived check: simulated parameters differ from base profile (computed, zero side-effects)
  const hasChanges = useMemo(() => {
    return (
      (profile?.age !== undefined && Number(profile.age) !== simAge) ||
      (profile?.degree !== undefined && profile.degree !== simDegree) ||
      (profile?.experience !== undefined && Number(profile.experience) !== simExperience) ||
      (profile?.germanLevel !== undefined && profile.germanLevel !== simGermanLevel) ||
      (profile?.englishLevel !== undefined && profile.englishLevel !== simEnglishLevel) ||
      (profile?.field !== undefined && profile.field !== simField)
    );
  }, [simAge, simDegree, simExperience, simGermanLevel, simEnglishLevel, simField, profile?.age, profile?.degree, profile?.experience, profile?.germanLevel, profile?.englishLevel, profile?.field]);

  // Reset to original profile
  const handleResetToProfile = () => {
    setSimAge(profile?.age !== undefined ? Number(profile.age) : 29);
    setSimDegree(profile?.degree || "bachelor");
    setSimExperience(profile?.experience !== undefined ? Number(profile.experience) : 3);
    setSimGermanLevel(profile?.germanLevel || "B1");
    setSimEnglishLevel(profile?.englishLevel || "B2");
    setSimField(profile?.field || "فناوری اطلاعات و مهندسی نرم‌افزار");
    setSimAnabinStatus(profile?.anabinStatus || "H+");
  };

  // Save simulated parameters back to global profile
  const handleSaveToProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profile?.name || "متقاضی مهاجرت",
        age: simAge,
        degree: simDegree,
        experience: simExperience,
        germanLevel: simGermanLevel,
        englishLevel: simEnglishLevel,
        field: simField,
        anabinStatus: simAnabinStatus
      });
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    }
  };

  // Degree label helper
  const getDegreeLabel = (deg: string) => {
    switch (deg) {
      case "highschool": return "دیپلم متوسطه";
      case "associate": return "کاردانی / فوق‌دیپلم (فنی)";
      case "bachelor": return "کارشناسی (لیسانس)";
      case "master": return "کارشناسی ارشد (فوق‌لیسانس)";
      case "phd": return "دکتری تخصصی (PhD)";
      default: return deg;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir="rtl">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>شبیه‌ساز رسمی ویزا ۲۰۲۶ (Visa Strategy Simulator)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              شبیه‌ساز استراتژی ویزا و پیش‌بینی مقایسه‌ای شانس موفقیت
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              با تغییر پارامترهای کلیدی پرونده (سن، مدرک تحصیلی، سابقه کاری و سطح زبان آلمانی)، 
              نمودار میله‌ای Recharts را به صورت آنی مشاهده کرده و شانس موفقیت خود را میان ۴ نوع روادید اصلی آلمان 
              (کارت فرصت، بلوکارت اروپا، ویزای سنتی جستجوی کار، و ویزای نیروی متخصص) مقایسه کنید.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md no-print"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>چاپ کارنامه استراتژی (A4)</span>
            </button>
            <div className="text-[11px] text-slate-400 font-mono text-left" dir="ltr">
              FEG §18a, §18b, §18g, §20, §20a
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Adjustment Tuner (Interactive Sliders & Pickers) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                تنظیم‌کننده پارامترهای پروفایل متقاضی (User Profile Inputs)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مقادیر زیر را به صورت زنده تغییر دهید تا اثر مستقیم هر فاکتور روی نمودار محاسبه شود
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={handleResetToProfile}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                title="بازگرداندن به مقادیر ذخیره‌شده پروفایل"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی به پروفایل</span>
              </button>
            )}

            {onUpdateProfile && hasChanges && (
              <button
                onClick={handleSaveToProfile}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                title="ذخیره این تنظیمات به عنوان پروفایل اصلی"
              >
                <Save className="w-3.5 h-3.5" />
                <span>ذخیره در پروفایل</span>
              </button>
            )}

            {saveSuccessMsg && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>پروفایل بروزرسانی شد!</span>
              </span>
            )}
          </div>
        </div>

        {/* The 4 Core Input Parameters: Age, Degree, Experience, German Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Age (سن) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>سن متقاضی (Age):</span>
              </span>
              <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono">
                {simAge} سال
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="58"
              step="1"
              value={simAge}
              onChange={(e) => setSimAge(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>۲۰ سال</span>
              <span className={simAge <= 35 ? "text-emerald-500 font-bold" : simAge <= 40 ? "text-amber-500 font-bold" : "text-rose-500 font-bold"}>
                {simAge <= 35 ? "امتیاز کامل کارت فرصت (+۲)" : simAge <= 40 ? "۱ امتیاز سن" : "بدون امتیاز سن"}
              </span>
              <span>۵۸ سال</span>
            </div>
          </div>

          {/* 2. Degree (مدرک تحصیلی) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>مدرک تحصیلی (Degree):</span>
            </span>
            <select
              value={simDegree}
              onChange={(e) => setSimDegree(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="phd">دکتری تخصصی (PhD)</option>
              <option value="master">کارشناسی ارشد (Master)</option>
              <option value="bachelor">کارشناسی (Bachelor)</option>
              <option value="associate">کاردانی / فنی (Associate)</option>
              <option value="highschool">دیپلم متوسطه (High School)</option>
            </select>
            <p className="text-[10px] text-slate-400 leading-tight">
              {simDegree === "bachelor" || simDegree === "master" || simDegree === "phd"
                ? "واجد شرایط کامل بلوکارت، کارت فرصت (۴ امتیاز) و ویزای آکادمیک."
                : simDegree === "associate"
                ? "واجد شرایط کارت فرصت (۲ امتیاز) و ویزای مهارتی فنی §18a."
                : "نیازمند سابقه ۳ ساله در IT یا دوره آوسبیلدونگ در آلمان."}
            </p>
          </div>

          {/* 3. Experience (سابقه کاری) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>سابقه کاری مرتبط (Experience):</span>
              </span>
              <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                {simExperience} سال
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={simExperience}
              onChange={(e) => setSimExperience(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>۰ سال</span>
              <span className={simExperience >= 5 ? "text-emerald-500 font-bold" : simExperience >= 2 ? "text-indigo-500 font-bold" : "text-slate-400"}>
                {simExperience >= 5 ? "۳ امتیاز کارت فرصت (+۳)" : simExperience >= 2 ? "۲ امتیاز کارت فرصت (+۲)" : "بدون امتیاز سابقه"}
              </span>
              <span>۱۵+ سال</span>
            </div>
          </div>

          {/* 4. German Level (سطح زبان آلمانی) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-emerald-500" />
              <span>سطح زبان آلمانی (German Level):</span>
            </span>
            <select
              value={simGermanLevel}
              onChange={(e) => setSimGermanLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="C1">C1 - پیشرفته مسلط (۳ امتیاز)</option>
              <option value="B2">B2 - تسلط کاری مستقل (۳ امتیاز)</option>
              <option value="B1">B1 - حدنصاب مکالمه کاری (۲ امتیاز)</option>
              <option value="A2">A2 - مقدماتی کاربردی (۱ امتیاز)</option>
              <option value="A1">A1 - پایه ابتدایی (حداقل کارت فرصت)</option>
              <option value="none">بدون مدرک آلمانی (English Only)</option>
            </select>
            <p className="text-[10px] text-slate-400 leading-tight">
              {simGermanLevel.includes("B") || simGermanLevel.includes("C")
                ? "امتیاز بالا در کارت فرصت و تسهیل اقامت دائم در ۲۱ ماه."
                : "برای بلوکارت کافی است، اما در ویزای جستجوی کار سنتی ریسک ریجکتی دارد."}
            </p>
          </div>

        </div>

        {/* Secondary parameters: Field & English Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 shrink-0 font-bold">رشته / حوزه کاری:</span>
            <input
              type="text"
              value={simField}
              onChange={(e) => setSimField(e.target.value)}
              placeholder="مثال: مهندسی نرم‌افزار، برق، مکانیک، ..."
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 shrink-0 font-bold">سطح زبان انگلیسی:</span>
            <select
              value={simEnglishLevel}
              onChange={(e) => setSimEnglishLevel(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="C1">C1 - پیشرفته عالی (+۱ امتیاز کارت فرصت)</option>
              <option value="B2">B2 - تسلط کاری بین‌المللی</option>
              <option value="B1">B1 - مکالمه متوسط</option>
              <option value="A2">A2 / کمتر</option>
            </select>
          </div>
        </div>
      </div>

      {/* CORE VISUALIZER: VisaSuccessForecast using Recharts BarChart */}
      <VisaSuccessForecast
        age={simAge}
        degree={simDegree}
        experience={simExperience}
        germanLevel={simGermanLevel}
        englishLevel={simEnglishLevel}
        field={simField}
        profile={profile}
        onNavigateToTab={onNavigateToTab}
      />

      {/* COMPREHENSIVE LEGAL COMPARISON MATRIX: 4 Core German Visa Types */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
            <span>جدول مقایسه جامع ۴ نوع ویزای مهاجرت کاری آلمان</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            مقایسه شاخص‌های کلیدی، الزامات و مزایای قانونی مسیرهای ویزا
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="p-3.5 font-bold">شاخص قانونی / معیار</th>
                <th className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                  کارت فرصت (Opportunity Card §20a)
                </th>
                <th className="p-3.5 font-bold text-blue-600 dark:text-blue-400">
                  بلوکارت اروپا (EU Blue Card §18g)
                </th>
                <th className="p-3.5 font-bold text-amber-600 dark:text-amber-400">
                  ویزای جستجوی کار سنتی (§20 Abs. 1)
                </th>
                <th className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                  ویزای نیروی متخصص کاری (§18a/§18b)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-3.5 font-bold bg-slate-50/50 dark:bg-slate-850">الزام به پیشنهاد شغلی (Job Offer)</td>
                <td className="p-3.5 text-emerald-600 font-bold">خیر (ورود بدون جاب‌آفر)</td>
                <td className="p-3.5 text-blue-600 font-bold">بله (قرارداد قطعی کار)</td>
                <td className="p-3.5 text-amber-600 font-bold">خیر (ورود ۶ ماهه جهت جستجو)</td>
                <td className="p-3.5 text-indigo-600 font-bold">بله (قرارداد قطعی کار)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-slate-50/50 dark:bg-slate-850">حداقل مدرک تحصیلی</td>
                <td className="p-3.5">کارشناسی یا مدرک فنی ۲ ساله</td>
                <td className="p-3.5">کارشناسی به بالا (یا ۳ سال IT)</td>
                <td className="p-3.5">کارشناسی با تاییدیه آنابین H+</td>
                <td className="p-3.5">کارشناسی یا فنی‌وحرفه‌ای تاییدشده</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-slate-50/50 dark:bg-slate-850">الزام مدرک زبان آلمانی</td>
                <td className="p-3.5">A1 آلمانی (یا B2 انگلیسی)</td>
                <td className="p-3.5">اختیاری (انگلیسی کاری کافی است)</td>
                <td className="p-3.5">حداقل B1 الزامی برای سفارت</td>
                <td className="p-3.5">حداقل B1 (یا گواهی زبان کارفرما)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-slate-50/50 dark:bg-slate-850">اجازه کار در طول اقامت</td>
                <td className="p-3.5">۲۰ ساعت پاره‌وقت + ۲ هفته آزمایشی</td>
                <td className="p-3.5">تمام‌وقت با کارفرمای آلمانی</td>
                <td className="p-3.5">۱۰ ساعت کار آزمایشی (بدون کار عادی)</td>
                <td className="p-3.5">تمام‌وقت در پوزیشن تخصصی</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-slate-50/50 dark:bg-slate-850">کف حقوق قانونی ناخالص (۲۰۲۶)</td>
                <td className="p-3.5">بدون کف حقوق (حساب بلاک‌شده €۱,۰۲۷)</td>
                <td className="p-3.5 font-mono font-bold">€۴۱,۰۴۱ (کمبود) / €۴۵,۳۰۰ (عادی)</td>
                <td className="p-3.5">بدون کف حقوق (حساب بلاک‌شده ۶ ماه)</td>
                <td className="p-3.5">حقوق متعارف مصوب اداره کار (BA)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-slate-50/50 dark:bg-slate-850">زمان اخذ اقامت دائم (Niederlassung)</td>
                <td className="p-3.5">پس از تبدیل به ویزای کاری</td>
                <td className="p-3.5 font-bold text-blue-600">۲۱ ماه (با B1) یا ۲۷ ماه</td>
                <td className="p-3.5">پس از تبدیل به ویزای کاری</td>
                <td className="p-3.5 font-bold text-indigo-600">۳ سال اشتغال مداوم</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-slate-50/50 dark:bg-slate-850">پیوست خانواده (همسر و فرزندان)</td>
                <td className="p-3.5">پس از تبدیل به ویزای کار در آلمان</td>
                <td className="p-3.5 font-bold text-blue-600">فوری ۱۰۰٪ بدون مدرک زبان همسر</td>
                <td className="p-3.5">پس از عقد قرارداد کار در آلمان</td>
                <td className="p-3.5">امکان‌پذیر با مدرک A1 همسر</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Roadmap & Quick Tabs Navigation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-slate-850 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>گام بعدی شما: اجرای استراتژی برگزیده بر اساس رتبه شانس</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            اگر امتیاز کارت فرصت بالاتری دارید، ابتدا در محاسبه‌گر امتیازات مدارک خود را ارزیابی کنید. 
            اگر شانس بلوکارت بالاست، مستقیماً رزومه آلمانی خود را بسازید و برای موقعیت‌های اسپانسرشیپ ویزا اقدام نمایید.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          {onNavigateToTab && (
            <>
              <button
                onClick={() => onNavigateToTab("chancenkarte")}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>محاسبه‌گر کارت فرصت</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
              <button
                onClick={() => onNavigateToTab("jobs")}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>موقعیت‌های اسپانسرشیپ</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
              <button
                onClick={() => onNavigateToTab("cv")}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>رزومه‌ساز آلمانی</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default VisaStrategySimulator;
