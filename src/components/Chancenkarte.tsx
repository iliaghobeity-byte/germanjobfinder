import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, HelpCircle, Trophy, Sparkles, Building, Info, Download, FileCheck, Printer } from "lucide-react";
import { motion } from "motion/react";
import { ChancenkartePdfExportModal } from "./ChancenkartePdfExportModal";

interface ChancenkarteProps {
  profile?: {
    name: string;
    age: number;
    degree: string;
    experience: number;
    field: string;
    germanLevel: string;
    englishLevel: string;
  } | null;
}

export default function Chancenkarte({ profile }: ChancenkarteProps) {
  const [qualType, setQualType] = useState<string>("full"); // full (4 pts), partial (4 pts), none (0 pts)
  const [germanLevel, setGermanLevel] = useState<string>("B1"); // none (0), A1 (1), A2 (2), B1 (3), B2 (4)
  const [englishLevel, setEnglishLevel] = useState<string>("B2"); // none (0), B2 (1), C1 (2)
  const [experience, setExperience] = useState<string>("2-5"); // 5+ (3), 2-5 (2), less (0)
  const [age, setAge] = useState<string>("under35"); // under35 (2), 35-40 (1), older (0)
  const [germanExp, setGermanExp] = useState<boolean>(false); // (1 pt)
  const [spouse, setSpouse] = useState<boolean>(false); // (1 pt)
  const [hasBasicDegree, setHasBasicDegree] = useState<boolean>(true); // Basic requirement

  const [points, setPoints] = useState<number>(0);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState<boolean>(false);

  // Sync with main evaluator profile (resume / manual form)
  useEffect(() => {
    if (!profile) return;

    // 1. Qualification mapping
    if (profile.degree === "master" || profile.degree === "bachelor" || profile.degree === "associate") {
      setQualType("full");
      setHasBasicDegree(true);
    } else if (profile.degree === "diploma") {
      setQualType("none");
      setHasBasicDegree(true);
    } else {
      setQualType("none");
    }

    // 2. German Language level mapping
    const gLevel = String(profile.germanLevel || "").toUpperCase().trim();
    if (gLevel.includes("C2") || gLevel.includes("C1") || gLevel.includes("B2")) {
      setGermanLevel("B2");
    } else if (gLevel.includes("B1")) {
      setGermanLevel("B1");
    } else if (gLevel.includes("A2")) {
      setGermanLevel("A2");
    } else if (gLevel.includes("A1")) {
      setGermanLevel("A1");
    } else {
      setGermanLevel("none");
    }

    // 3. English Language level mapping
    const eLevel = String(profile.englishLevel || "").toUpperCase().trim();
    if (eLevel.includes("C2") || eLevel.includes("C1") || eLevel.includes("7") || eLevel.includes("8") || eLevel.includes("9")) {
      setEnglishLevel("C1");
    } else if (eLevel.includes("B2") || eLevel.includes("6") || eLevel.includes("5")) {
      setEnglishLevel("B2");
    } else {
      setEnglishLevel("none");
    }

    // 4. Professional Experience mapping
    const expYears = Number(profile.experience);
    if (!isNaN(expYears)) {
      if (expYears >= 5) {
        setExperience("5+");
      } else if (expYears >= 2) {
        setExperience("2-5");
      } else {
        setExperience("less");
      }
    }

    // 5. Age mapping
    const ageVal = Number(profile.age);
    if (!isNaN(ageVal)) {
      if (ageVal <= 35) {
        setAge("under35");
      } else if (ageVal <= 40) {
        setAge("35-40");
      } else {
        setAge("older");
      }
    }
  }, [profile]);

  // Dynamic point calculator
  useEffect(() => {
    let tempPoints = 0;

    // 1. Foreign Degree Recognition / Partial
    if (qualType === "partial") {
      tempPoints += 4;
    } else if (qualType === "full") {
      // Full recognition in general gives 4 points too under some circumstances
      tempPoints += 4;
    }

    // 2. German Language
    if (germanLevel === "A1") tempPoints += 1;
    else if (germanLevel === "A2") tempPoints += 2;
    else if (germanLevel === "B1") tempPoints += 3;
    else if (germanLevel === "B2" || germanLevel === "C1") tempPoints += 4;

    // 3. English Language
    if (germanLevel === "none" || germanLevel === "A1") {
      // English details give points mainly if basic German isn't maxed out or as additional
      if (englishLevel === "B2") tempPoints += 1;
      else if (englishLevel === "C1") tempPoints += 2;
    } else {
      // Under new rule, you can also combine some points, let's represent standard combination:
      if (englishLevel === "C1") tempPoints += 1; 
    }

    // 4. Professional Experience
    if (experience === "5+") tempPoints += 3;
    else if (experience === "2-5") tempPoints += 2;

    // 5. Age
    if (age === "under35") tempPoints += 2;
    else if (age === "35-40") tempPoints += 1;

    // 6. German Connection
    if (germanExp) tempPoints += 1;

    // 7. Spouse Accompanying
    if (spouse) tempPoints += 1;

    setPoints(tempPoints);
  }, [qualType, germanLevel, englishLevel, experience, age, germanExp, spouse]);

  return (
    <div id="chancenkarte-tab" className="space-y-8 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" /> محاسبه‌گر امتیاز کارت فرصت آلمان (Chancenkarte 2026)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              کارت فرصت سیستم امتیازی معروفی است که کارجویان بین‌المللی می‌توانند بدین وسیله در صورت احراز حداقل پیش‌نیازها به آلمان سفر کرده و به دنبال جاب‌آفر بگردند.
              جهت تایید نهایی، کسب حداقل <strong>۶ امتیاز</strong> الزامی است.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPdfExportOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition hover:scale-105 active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
            title="دانلود گزارش رسمی امتیازات کارت فرصت به عنوان فایل تمیز PDF با html2pdf.js"
          >
            <Download className="w-4 h-4" />
            <span>دانلود گزارش رسمی PDF</span>
          </button>
        </div>

        {profile && (
          <div className="mb-6 p-4 bg-indigo-505/10 bg-slate-950 border border-indigo-500/30 text-indigo-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse shrink-0" />
              <span className="leading-relaxed">
                اطلاعات این محاسبه‌گر به طور خودکار با پروفایل <strong>{profile.name && profile.name !== "کاربر نمونه" && profile.name !== "متقاضی کار در آلمان" ? profile.name : "متقاضی محترم"}</strong> (سن: {profile.age} سال، سابقه کار: {profile.experience} سال، مدرک تحصیلی و سطوح زبان هماهنگ شده) همگام‌سازی شده است.
              </span>
            </div>
            <span className="font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-[10px] shrink-0">
              همگام‌شده با رزومه / فرم دستی
            </span>
          </div>
        )}

        {/* Real-time Score Ring / Meter */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-around gap-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-slate-400 mb-2 font-medium">امتیاز محاسبه شده شما</span>
            <div className="relative flex items-center justify-center">
              {/* Radial gradient SVG meter */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke={points >= 6 ? "#10b981" : "#f59e0b"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="339.29"
                  strokeDashoffset={339.29 - (339.29 * Math.min(points, 10)) / 10}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-3xl font-black text-white">{points} <span className="text-xs text-slate-400">/ ۱۰</span></span>
            </div>
          </div>

          <div className="max-w-md space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">پیش‌نیاز اجباری (پایه):</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                برای اقدام جهت چنس‌کارت، تاییدیه مقدماتی وجود سابقه تحصیلی/تخصصی ۲ ساله و مدرک معادل آلمانی به همراه اثبات تمکن مالی و داشتن مدرک آلمانی A1 یا انگلیسی B2 ضروری است.
              </p>
            </div>

            {/* Evaluation verdict badge & export trigger */}
            <div className="flex flex-wrap items-center gap-2">
              {points >= 6 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  تبریک! شما ۶ امتیاز لازم را کسب کرده‌اید و شانس اخذ کارت فرصت را دارید.
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  شما در حال حاضر {points} امتیاز دارید؛ برای اقدام نیاز به حداقل ۶ امتیاز دارید.
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsPdfExportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دریافت PDF ارزیابی ({points} امتیاز)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Input variables form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section: Certificate recognition */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider pb-1 border-b border-slate-800">۱. وضعیت معادل‌سازی مدرک تحصیلی</h3>
            
            <div className="p-4 bg-slate-950 rounded-xl space-y-3 border border-slate-800/50">
              <label className="block text-xs text-slate-300">ارزیابی مدرک خارجی شما در آلمان به چه صورت است؟</label>
              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-900/60 transition cursor-pointer">
                  <input
                    type="radio"
                    name="qualType"
                    className="mt-1 accent-indigo-500"
                    checked={qualType === "full"}
                    onChange={() => setQualType("full")}
                  />
                  <div>
                    <span className="text-xs text-white font-bold block">معادل‌سازی کامل مدرک تحصیلی (۴ امتیاز)</span>
                    <span className="text-[10px] text-slate-400">مدرک تحصیلی شما در سامانه آنابین معادل کامل آلمانی تشخیص داده شده است.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-900/60 transition cursor-pointer">
                  <input
                    type="radio"
                    name="qualType"
                    className="mt-1 accent-indigo-500"
                    checked={qualType === "partial"}
                    onChange={() => setQualType("partial")}
                  />
                  <div>
                    <span className="text-xs text-white font-bold block">معادل‌سازی جزئی مدرک (Anerkennungsbescheid Partial) (۴ امتیاز)</span>
                    <span className="text-[10px] text-slate-400 font-normal">برای رشته‌هایی که ارزیابی جزئی شده‌اند و مشروط به ثبت دوره تطبیقی در آلمان هستند.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-900/60 transition cursor-pointer">
                  <input
                    type="radio"
                    name="qualType"
                    className="mt-1 accent-indigo-500"
                    checked={qualType === "none"}
                    onChange={() => setQualType("none")}
                  />
                  <div>
                    <span className="text-xs text-white font-bold block">مدرک تحصیلی بدون معادل‌سازی (۰ امتیاز)</span>
                    <span className="text-[10px] text-slate-400">اگر صرفاً مدرک مهارتی ۲ ساله و فاقد ارزیابی در آنابین دارید.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Language levels */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider pb-1 border-b border-slate-800">۲. تسلط به زبان‌های خارجی</h3>
            
            <div className="p-4 bg-slate-950 rounded-xl space-y-4 border border-slate-800/50">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>سطح تسلط به زبان آلمانی (اعلام مدرک معتبر)</span>
                  <span className="text-[10px] text-teal-300">تا ۴ امتیاز</span>
                </label>
                <select
                  value={germanLevel}
                  onChange={(e) => setGermanLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="none">غیر مسلط یا پائین‌تر از A1 (۰ امتیاز)</option>
                  <option value="A1">سطح A1 مدرک بین‌المللی (۱ امتیاز)</option>
                  <option value="A2">سطح A2 مدرک بین‌المللی (۲ امتیاز)</option>
                  <option value="B1">سطح B1 دانشگاهی / گوته (۳ امتیاز)</option>
                  <option value="B2">سطح B2 یا بالاتر (B2, C1) (۴ امتیاز)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>سطح مدرک زبان انگلیسی (IELTS / TOEFL)</span>
                  <span className="text-[10px] text-teal-300">تا ۲ امتیاز</span>
                </label>
                <select
                  value={englishLevel}
                  onChange={(e) => setEnglishLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="none">بدون تسلط علمی یا نمرات متداول (۰ امتیاز)</option>
                  <option value="B2">سطح متوسط انگلیسی B2 (آیلتس ۵.۵ تا ۶.۵) (۱ امتیاز)</option>
                  <option value="C1">سطح عالی انگلیسی C1 (آیلتس ۷ به بالا) (۲ امتیاز)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Sabeghah and Age */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider pb-1 border-b border-slate-800">۳. سابقه کار و رده بندی سن</h3>
            
            <div className="p-4 bg-slate-950 rounded-xl space-y-4 border border-slate-800/50">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>میزان سابقه کار مرتبط در ۵ الی ۷ سال گذشته</span>
                  <span className="text-[10px] text-teal-300">تا ۳ امتیاز</span>
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="less">زیر ۲ سابقه کار تخصصی (۰ امتیاز)</option>
                  <option value="2-5">حداقل ۲ سال سابقه کار تخصصی مرتبط در ۵ سال اخیر (۲ امتیاز)</option>
                  <option value="5+">حداقل ۵ سال سابقه کار تخصصی مرتبط در ۷ سال اخیر (۳ امتیاز)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>بخش رده بندی سنی شما</span>
                  <span className="text-[10px] text-teal-300">تا ۲ امتیاز</span>
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="older">سن شما بالای ۴۰ سال است (۰ امتیاز)</option>
                  <option value="35-40">سن شما مابین ۳۵ الی ۴۰ سال است (۱ امتیاز)</option>
                  <option value="under35">سن شما زیر ۳۵ سال است (۲ امتیاز)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Connection and bonus points */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider pb-1 border-b border-slate-800">۴. فاکتورهای امتیازدهی حمایتی (بونوس)</h3>
            
            <div className="p-4 bg-slate-950 rounded-xl space-y-3.5 border border-slate-800/50">
              <label className="flex items-start gap-2.5 p-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 accent-indigo-500 rounded"
                  checked={germanExp}
                  onChange={(e) => setGermanExp(e.target.checked)}
                />
                <div>
                  <span className="text-xs text-white font-bold block">پیشینه اقامت قانونی در آلمان (۱ امتیاز)</span>
                  <span className="text-[10px] text-slate-400">آیا در ۵ سال گذشته حداقل ۶ ماه پیاپی اقامت قانونی (به غیر از گردشگری) در آلمان داشته‌اید؟</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 accent-indigo-500 rounded"
                  checked={spouse}
                  onChange={(e) => setSpouse(e.target.checked)}
                />
                <div>
                  <span className="text-xs text-white font-bold block">مهاجرت همزمان به همراه همسر (۱ امتیاز)</span>
                  <span className="text-[10px] text-slate-400">آیا همسرتان نیز واجد شرایط پایه کارت فرصت به طور مستقل است؟</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-indigo-400 shrink-0" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>قانون تأمین وجوه مالی:</strong> صدور فیزیکی کارت فرصت منوط به اثبات داشتن حساب مسدود شده به میزان ماهانه حداقل ۱,۰۲۷ یورو به مدت ۱۲ ماه یا داشتن ثبت قرارداد کاری پاره‌وقت در شرکتی در آلمان با حداقل درآمد مصوب است.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPdfExportOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition hover:scale-105 active:scale-95 cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>دانلود کارنامه رسمی PDF</span>
          </button>
        </div>
      </div>

      {/* Chancenkarte Clean PDF Export Modal (Powered by html2pdf.js) */}
      <ChancenkartePdfExportModal
        isOpen={isPdfExportOpen}
        onClose={() => setIsPdfExportOpen(false)}
        evaluationData={{
          applicantName: profile?.name || "متقاضی محترم",
          field: profile?.field || "کارشناس و متخصص فنی",
          age,
          qualType,
          germanLevel,
          englishLevel,
          experience,
          germanExp,
          spouse,
          totalPoints: points
        }}
      />
    </div>
  );
}
