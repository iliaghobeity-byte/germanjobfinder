import React, { useState, useMemo } from "react";
import { 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Calendar, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChancenkartePdfExportModal } from "./ChancenkartePdfExportModal";

interface ChancenkarteProgressTrackerProps {
  profile?: {
    name?: string;
    age?: number;
    degree?: string;
    experience?: number;
    field?: string;
    germanLevel?: string;
    englishLevel?: string;
    anabinStatus?: string;
  } | null;
  onTabChange?: (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview" | "guide" | "advanced-jobs") => void;
}

export const ChancenkarteProgressTracker: React.FC<ChancenkarteProgressTrackerProps> = ({
  profile,
  onTabChange
}) => {
  const [priorStayGermany, setPriorStayGermany] = useState<boolean>(false);
  const [spouseAccompanying, setSpouseAccompanying] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState<boolean>(true);

  // Normalize Profile Inputs
  const age = Number(profile?.age) || 30;
  const degree = (profile?.degree || "bachelor").toLowerCase();
  const experienceYears = Number(profile?.experience) || 4;
  const rawGerman = (profile?.germanLevel || "B1").toUpperCase().trim();
  const rawEnglish = (profile?.englishLevel || "B2").toUpperCase().trim();
  const field = profile?.field || "فناوری اطلاعات و مهندسی نرم‌افزار";

  // Calculate Chancenkarte Points dynamically
  const scoring = useMemo(() => {
    let totalPoints = 0;
    const details = {
      degreePoints: 0,
      degreeLabel: "",
      experiencePoints: 0,
      experienceLabel: "",
      germanPoints: 0,
      germanLabel: "",
      englishPoints: 0,
      englishLabel: "",
      agePoints: 0,
      ageLabel: "",
      shortagePoints: 0,
      shortageLabel: "",
      bonusPoints: 0,
      bonusLabel: ""
    };

    // 1. Foreign Degree Recognition (4 points for Bachelor, Master, Associate / recognized vocational)
    if (degree === "master" || degree === "bachelor" || degree === "phd" || degree === "associate") {
      details.degreePoints = 4;
      details.degreeLabel = `مدرک دانشگاهی (${degree === "phd" ? "دکتری" : degree === "master" ? "کارشناسی ارشد" : degree === "bachelor" ? "کارشناسی" : "کاردانی"}) - تاییدیه رسمی معادل‌سازی آلمان`;
    } else if (degree === "diploma") {
      details.degreePoints = 0;
      details.degreeLabel = "مدرک دیپلم متوسطه (نیازمند حداقل مدرک ۲ ساله دانشگاهی یا فنی جهت امتیازدهی)";
    } else {
      details.degreePoints = 0;
      details.degreeLabel = "مدرک تحصیلی اعلام نشده";
    }
    totalPoints += details.degreePoints;

    // 2. Professional Experience (5+ years = 3 pts, 2-5 years = 2 pts)
    if (experienceYears >= 5) {
      details.experiencePoints = 3;
      details.experienceLabel = `سابقه کار ${experienceYears} ساله در ۷ سال گذشته (حداکثر امتیاز تجربه)`;
    } else if (experienceYears >= 2) {
      details.experiencePoints = 2;
      details.experienceLabel = `سابقه کار ${experienceYears} ساله در ۵ سال گذشته (رده میانی)`;
    } else {
      details.experiencePoints = 0;
      details.experienceLabel = `سابقه کار ${experienceYears} ساله (کمتر از حداقل ۲ سال لازم جهت کسب امتیاز)`;
    }
    totalPoints += details.experiencePoints;

    // 3. German Language (B2/C1/C2 = 4, B1 = 3, A2 = 2, A1 = 1)
    if (rawGerman.includes("C2") || rawGerman.includes("C1") || rawGerman.includes("B2")) {
      details.germanPoints = 4;
      details.germanLabel = `زبان آلمانی سطح ${rawGerman.includes("C") ? "C1/C2" : "B2"} (تسلط پیشرفته - بالاترین امتیاز)`;
    } else if (rawGerman.includes("B1")) {
      details.germanPoints = 3;
      details.germanLabel = "زبان آلمانی سطح B1 (سطح خودکفایی متوسط)";
    } else if (rawGerman.includes("A2")) {
      details.germanPoints = 2;
      details.germanLabel = "زبان آلمانی سطح A2 (سطح پایه مقدماتی)";
    } else if (rawGerman.includes("A1")) {
      details.germanPoints = 1;
      details.germanLabel = "زبان آلمانی سطح A1 (حداقل پیش‌نیاز قانونی)";
    } else {
      details.germanPoints = 0;
      details.germanLabel = "بدون مدرک زبان آلمانی (ارائه حداقل A1 یا انگلیسی B2 الزامی است)";
    }
    totalPoints += details.germanPoints;

    // 4. English Language (C1 = 1-2 pts, B2 = 1 pt)
    const isEnglishC1 = rawEnglish.includes("C1") || rawEnglish.includes("C2") || rawEnglish.includes("7") || rawEnglish.includes("8");
    const isEnglishB2 = rawEnglish.includes("B2") || rawEnglish.includes("6");

    if (isEnglishC1) {
      // If German is below B1, C1 gives 2 points under German law
      details.englishPoints = (details.germanPoints <= 1) ? 2 : 1;
      details.englishLabel = `زبان انگلیسی سطح C1/پیشرفته (+${details.englishPoints} امتیاز)`;
    } else if (isEnglishB2) {
      details.englishPoints = (details.germanPoints <= 1) ? 1 : 0;
      details.englishLabel = details.englishPoints > 0 ? "زبان انگلیسی سطح B2 (+۱ امتیاز)" : "زبان انگلیسی B2 (پوشش داده شده با آلمانی)";
    } else {
      details.englishPoints = 0;
      details.englishLabel = "بدون امتیاز مازاد زبان انگلیسی";
    }
    totalPoints += details.englishPoints;

    // 5. Age (<= 35 = 2 pts, 36-40 = 1 pt, > 40 = 0 pts)
    if (age <= 35) {
      details.agePoints = 2;
      details.ageLabel = `سن متقاضی (${age} سال) - کمتر از ۳۵ سال (حداکثر امتیاز رده سنی)`;
    } else if (age <= 40) {
      details.agePoints = 1;
      details.ageLabel = `سن متقاضی (${age} سال) - بین ۳۵ تا ۴۰ سال`;
    } else {
      details.agePoints = 0;
      details.ageLabel = `سن متقاضی (${age} سال) - بالاتر از ۴۰ سال`;
    }
    totalPoints += details.agePoints;

    // 6. Shortage Occupation (MINT / Engpassberuf = 1 pt)
    const fieldLower = field.toLowerCase();
    const isMINT = fieldLower.includes("نرم") || fieldLower.includes("برنامه") || fieldLower.includes("it") ||
      fieldLower.includes("کامپیوتر") || fieldLower.includes("مکانیک") || fieldLower.includes("برق") ||
      fieldLower.includes("عمران") || fieldLower.includes("پزشک") || fieldLower.includes("پرستار") ||
      fieldLower.includes("شیمی") || fieldLower.includes("مهندس") || fieldLower.includes("صنایع") ||
      fieldLower.includes("software") || fieldLower.includes("engineer") || fieldLower.includes("medical");

    if (isMINT) {
      details.shortagePoints = 1;
      details.shortageLabel = "رشته در لیست مشاغل دارای کمبود حاد فدرال آلمان (MINT / Engpassberuf)";
    } else {
      details.shortagePoints = 0;
      details.shortageLabel = "رشته در لیست عادی مشاغل بازار کار";
    }
    totalPoints += details.shortagePoints;

    // 7. Bonus points (Prior Stay or Spouse)
    let bonus = 0;
    const bonusTexts: string[] = [];
    if (priorStayGermany) {
      bonus += 1;
      bonusTexts.push("سابقه اقامت قانونی حداقل ۶ ماه در آلمان (+۱)");
    }
    if (spouseAccompanying) {
      bonus += 1;
      bonusTexts.push("همراهی همسر واجد شرایط کارت فرصت (+۱)");
    }
    details.bonusPoints = bonus;
    details.bonusLabel = bonusTexts.join("، ") || "بدون امتیاز اقامت قبلی یا همسر";
    totalPoints += bonus;

    const passingThreshold = 6;
    const isPassed = totalPoints >= passingThreshold;
    const pointsGap = Math.max(0, passingThreshold - totalPoints);
    const excessPoints = Math.max(0, totalPoints - passingThreshold);
    const progressPercent = Math.min(100, Math.round((totalPoints / passingThreshold) * 100));

    return {
      totalPoints,
      passingThreshold,
      isPassed,
      pointsGap,
      excessPoints,
      progressPercent,
      details
    };
  }, [age, degree, experienceYears, rawGerman, rawEnglish, field, priorStayGermany, spouseAccompanying]);

  // Actionable gap recommendations
  const recommendations = useMemo(() => {
    if (scoring.isPassed) {
      return [
        `پرونده شما با ${scoring.totalPoints} امتیاز، حدنصاب قانونی ۶ امتیاز کارت فرصت را با موفقیت احراز کرده است (+${scoring.excessPoints} امتیاز مازاد حاشیه امن).`,
        "مدارک ترجمه‌شده خود را جهت دریافت گواهی تاییدیه ZAB یا پرینت رسمی پایگاه Anabin آماده کنید.",
        "می‌توانید هم‌اکنون گزارش رسمی کارت فرصت (PDF) را دانلود کرده و فرم درخواست سفارت را تکمیل فرمایید."
      ];
    }

    const tips: string[] = [];
    if (scoring.details.germanPoints < 3) {
      tips.push("ارتقای مدرک زبان آلمانی به B1، ۳ امتیاز کامل به پرونده شما می‌افزاید و فوراً کسری امتیاز شما را جبران می‌کند.");
    }
    if (scoring.details.experiencePoints < 3 && experienceYears < 5) {
      tips.push("با ثبت سوابق کاری رسمی بیمه‌شده تا سقف ۵ سال، ۳ امتیاز حداکثری تجربه را دریافت خواهید کرد.");
    }
    if (scoring.details.englishPoints === 0 && rawEnglish.includes("B1")) {
      tips.push("کسب نمره آیلتس ۶ یا دولینگو معادل B2/C1 زبان انگلیسی، ۱ الی ۲ امتیاز مازاد به پروفایل شما اضافه می‌نماید.");
    }
    if (!priorStayGermany && !spouseAccompanying) {
      tips.push("در صورتی که همسر شما واجد شرایط دریافت کارت فرصت یا دارای مدرک زبان B1 باشد، ۱ امتیاز پاداش دریافت می‌کنید.");
    }
    if (tips.length === 0) {
      tips.push("ارائه مدرک زبان آلمانی معتبر گوته (Goethe) یا تلک (telc) با حداقل نمره B1 موثرترین راه برای رسیدن به حدنصاب ۶ است.");
    }
    return tips;
  }, [scoring, experienceYears, rawEnglish, priorStayGermany, spouseAccompanying]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Accent Glow */}
      <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
        scoring.isPassed ? "bg-emerald-500/10" : "bg-amber-500/10"
      }`} />
      
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-black">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              سنجشگر پیشرفت کارت فرصت آلمان (Chancenkarte 2026)
            </span>

            {scoring.isPassed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>حدنصاب قانونی احراز شد (واجد شرایط)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{scoring.pointsGap} امتیاز تا حدنصاب قانونی ۶</span>
              </span>
            )}
          </div>

          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <span>محاسبه بلادرنگ امتیازات مهاجرتی بر پایه پروفایل متقاضی</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            کارت فرصت سیستم امتیازی جدید دولت فدرال آلمان است که به متقاضیان اجازه ورود و کاریابی می‌دهد. جهت تایید نهایی، کسب حداقل <strong className="text-amber-300 font-bold">۶ امتیاز از ۱۴</strong> الزامی است.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            title="دانلود گزارش رسمی کارت فرصت به صورت PDF"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>دانلود گزارش رسمی PDF</span>
          </button>

          {onTabChange && (
            <button
              type="button"
              onClick={() => onTabChange("chancenkarte")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-black transition shadow-lg shadow-indigo-950/40 cursor-pointer"
              title="ورود به برگه جامع کارت فرصت با تنظیمات دقیق"
            >
              <span>مشاهده و ویرایش در برگه کارت فرصت</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Progress Gauge & Threshold Milestone Track */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Score Ring / Radial Badge */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex flex-col items-center justify-center shrink-0 shadow-inner ${
              scoring.isPassed 
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-amber-950/60 border-amber-500/40 text-amber-300"
            }`}>
              <span className="text-2xl sm:text-3xl font-black font-mono leading-none">
                {scoring.totalPoints}
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-1">از ۱۴ امتیاز</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white">
                  {scoring.isPassed ? "واجد شرایط صدور ویزای کارت فرصت" : "در حال تکمیل امتیازات کارت فرصت"}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  scoring.isPassed 
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}>
                  {scoring.isPassed ? "✓ تایید اولیه" : "نیازمند ارتقا"}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {scoring.isPassed 
                  ? `تبریک! شما حدنصاب ۶ امتیاز قانونی را پشت سر گذاشته‌اید (${scoring.totalPoints} امتیاز احراز شده).`
                  : `شما ${scoring.totalPoints} امتیاز کسب کرده‌اید و برای رسیدن به حدنصاب رسمی سفارت، به ${scoring.pointsGap} امتیاز دیگر نیاز دارید.`
                }
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-slate-400 font-medium block">میزان پیشرفت تا حدنصاب قبولی:</span>
            <span className={`text-xl sm:text-2xl font-black font-mono ${
              scoring.isPassed ? "text-emerald-400" : "text-amber-400"
            }`}>
              {scoring.progressPercent}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar with Threshold Indicator */}
        <div className="space-y-2">
          <div className="relative w-full h-4 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
            {/* The 6-point Target Marker Marker line at (6/14) * 100 ~ 42.8% */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              style={{ left: "42.8%" }}
            />
            {/* Active filled bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (scoring.totalPoints / 14) * 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full transition-all duration-500 ${
                scoring.isPassed
                  ? "bg-gradient-to-r from-teal-500 via-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  : "bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              }`}
            />
          </div>

          {/* Progress Markers and Labels */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
            <span>۰ امتیاز (شروع)</span>
            <span className="text-amber-400 font-black flex items-center gap-1" style={{ transform: "translateX(15%)" }}>
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>حدنصاب قبولی: ۶ امتیاز</span>
            </span>
            <span>۱۴ امتیاز (سقف کامل)</span>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed ${
          scoring.isPassed
            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
            : "bg-amber-950/40 border-amber-500/30 text-amber-200"
        }`}>
          <div className="flex items-start sm:items-center gap-2">
            {scoring.isPassed ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            )}
            <span>
              {scoring.isPassed
                ? `وضعیت پرونده: واجد شرایط قانونی! شما ۶ از ۶ امتیاز لازم را احراز کرده‌اید و دارای ${scoring.excessPoints} امتیاز اضافه جهت رقابت بالاتر در مصاحبه هستید.`
                : `فاصله تا حدنصاب: شما نیازمند کسب ${scoring.pointsGap} امتیاز دیگر هستید تا واجد شرایط کارت فرصت گردید.`
              }
            </span>
          </div>

          {/* Simulation Toggles */}
          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={priorStayGermany}
                onChange={(e) => setPriorStayGermany(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
              />
              <span>اقامت قبلی در آلمان (+۱)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={spouseAccompanying}
                onChange={(e) => setSpouseAccompanying(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
              />
              <span>همراهی همسر (+۱)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 5-Criteria Point Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>تفکیک امتیازات حاصله از مشخصات متقاضی (۵ محور قانونی):</span>
          </span>
          <button
            type="button"
            onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
            className="text-slate-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>{isBreakdownExpanded ? "بستن جزئیات" : "مشاهده جزئیات"}</span>
            {isBreakdownExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {isBreakdownExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs"
            >
              {/* 1. Degree / Qualification */}
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>مدرک تحصیلی (Recognition)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    +{scoring.details.degreePoints} امتیاز
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {scoring.details.degreeLabel}
                </p>
              </div>

              {/* 2. Professional Experience */}
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span>سابقه کار مرتبط (Experience)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    +{scoring.details.experiencePoints} امتیاز
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {scoring.details.experienceLabel}
                </p>
              </div>

              {/* 3. German & English Languages */}
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-purple-400" />
                    <span>مهارت‌های زبانی (Languages)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    +{scoring.details.germanPoints + scoring.details.englishPoints} امتیاز
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {scoring.details.germanLabel}
                  {scoring.details.englishPoints > 0 && ` | ${scoring.details.englishLabel}`}
                </p>
              </div>

              {/* 4. Age */}
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>رده سنی متقاضی (Age)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    +{scoring.details.agePoints} امتیاز
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {scoring.details.ageLabel}
                </p>
              </div>

              {/* 5. Shortage Occupation (MINT) */}
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <span>مشاغل دارای کمبود (MINT)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    +{scoring.details.shortagePoints} امتیاز
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {scoring.details.shortageLabel}
                </p>
              </div>

              {/* 6. Bonus Points (Stay / Spouse) */}
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>امتیازات مازاد فدرال</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    +{scoring.details.bonusPoints} امتیاز
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {scoring.details.bonusLabel}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actionable Recommendations to close the gap */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-2.5">
        <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {scoring.isPassed ? "اقدامات بعدی برای نهایی‌سازی درخواست کارت فرصت:" : "راهکارهای هوشمند جبران امتیازات کسری تا حدنصاب ۶:"}
          </span>
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-300 pr-1">
          {recommendations.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* PDF Export Modal */}
      <ChancenkartePdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        evaluationData={{
          applicantName: profile?.name || "متقاضی محترم",
          age: age <= 35 ? "under35" : age <= 40 ? "35-40" : "older",
          ageNum: age,
          qualType: degree === "diploma" ? "none" : "full",
          germanLevel: rawGerman.includes("B2") || rawGerman.includes("C") ? "B2" : rawGerman.includes("B1") ? "B1" : rawGerman.includes("A2") ? "A2" : rawGerman.includes("A1") ? "A1" : "none",
          englishLevel: rawEnglish.includes("C1") || rawEnglish.includes("C2") ? "C1" : rawEnglish.includes("B2") ? "B2" : "none",
          experience: experienceYears >= 5 ? "5+" : experienceYears >= 2 ? "2-5" : "less",
          germanExp: priorStayGermany,
          spouse: spouseAccompanying,
          totalPoints: scoring.totalPoints,
          field
        }}
      />
    </div>
  );
};

export default ChancenkarteProgressTracker;
