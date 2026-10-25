import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchWithRetry, formatPrintDocumentTitle } from "../utils";
import { 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ArrowLeft, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Bookmark, 
  Info,
  GraduationCap,
  Languages,
  Search,
  FileText,
  PlaneTakeoff,
  FileDown,
  Printer,
  Download
} from "lucide-react";

interface JourneyTimelineProps {
  profile: {
    name: string;
    age: number;
    degree: string;
    experience: number;
    field: string;
    germanLevel: string;
    englishLevel: string;
  };
  onTabChange?: (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs") => void;
  onExportPdf?: () => void;
}

export default function JourneyTimeline({ profile, onTabChange, onExportPdf }: JourneyTimelineProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  // --- New state for Gemini Actionable Tips Modal ---
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedStepTitle, setSelectedStepTitle] = useState("");
  const [loadingTips, setLoadingTips] = useState(false);
  const [tipsContent, setTipsContent] = useState("");
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const milestoneChecklists: Record<number, string[]> = {
    1: [
      "محاسبه دقیق امتیاز کارت فرصت بر اساس سن، مدرک و سابقه کار",
      "انتخاب مسیر اصلی مهاجرتی (کارت آبی، کارت فرصت یا مسیر IT)",
      "تعیین بودجه لازم برای فرآیند مهاجرت"
    ],
    2: [
      "جستجوی نمایه دانشگاه و رشته تحصیلی در سایت آنابین (Anabin)",
      "ثبت نام و ارسال مدارک تحصیلی به سازمان ZAB در صورت لزوم",
      "ترجمه رسمی مدرک تحصیلی و ریز نمرات با مهرهای قانونی"
    ],
    3: [
      "تهیه و تنظیم رزومه آلمانی (Lebenslauf) عکس‌دار و متناسب با فرهنگ کار آلمانی",
      "نگارش الگوی صریح انگیزه‌نامه (Anschreiben) برای جاب‌آفرها",
      "برنامه‌ریزی برای آزمون رسمی زبان آلمانی یا انگلیسی"
    ],
    4: [
      "تنظیم و بهینه‌سازی دقیق نمایه لینکدین به زبان انگلیسی با تخصص کاری",
      "ثبت نام در پرتال‌های تخصصی کاریابی فدرال آلمان نظیر StepStone و Indeed",
      "ارسال روزانه ۳ الی ۵ اپلیکیشن کارآمد و سفارشی‌سازی شده"
    ],
    5: [
      "رزرو نوبت مصاحبه در سامانه کارگزاری رسمی TLScontact تهران",
      "تامین مبلغ تمکن مالی نقدی یا افتتاح حساب مسدود شده (Sperrkonto)",
      "کپی و چیدمان مدارک طبق ترتیب مشخص چک‌لیست رسمی سفارت آلمان"
    ],
    6: [
      "اجاره موقت مسکن یا سوئیت جهت ثبت آدرس ملی روزهای نخست",
      "مراجعه حضوری به شهرداری جهت ثبت آدرس مسکونی (Anmeldung)",
      "عضویت در شرکت بیمه درمانی دولتی آلمان و دریافت شماره مالیاتی"
    ],
  };

  const toggleChecklistItem = (key: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleOpenTipsModal = async (stepId: number, stepTitle: string) => {
    setSelectedStepId(stepId);
    setSelectedStepTitle(stepTitle);
    setTipsModalOpen(true);
    setLoadingTips(true);
    setTipsContent("");

    try {
      const response = await fetchWithRetry("/api/gemini/milestone-tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profile,
          stepId: stepId,
          stepTitle: stepTitle
        })
      });
      const data = await response.json();
      setTipsContent(data.result || "خطایی در دریافت اطلاعات رخ داد.");
    } catch (e) {
      console.error(e);
      setTipsContent("متاسفانه ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoadingTips(false);
    }
  };

  // 1. Calculate preparation progress score (0 to 100) based on user's profile parameters
  const calculateProgressScore = () => {
    let score = 15; // Base starting score

    // Age score (ideal age 18-35 for most programs/Chancenkarte points)
    if (profile.age >= 18 && profile.age <= 35) score += 15;
    else if (profile.age > 35 && profile.age <= 40) score += 10;
    else if (profile.age > 40 && profile.age <= 45) score += 5;

    // Academic / Professional Degree score
    if (profile.degree === "master" || profile.degree === "phd") score += 20;
    else if (profile.degree === "bachelor") score += 18;
    else if (profile.degree === "associate" || profile.degree === "diploma") score += 12;

    // Experience score
    if (profile.experience >= 5) score += 20;
    else if (profile.experience >= 3) score += 15;
    else if (profile.experience >= 1) score += 10;

    // German Language score
    if (["B2", "C1", "C2"].includes(profile.germanLevel)) score += 20;
    else if (profile.germanLevel === "B1") score += 15;
    else if (profile.germanLevel === "A2") score += 8;
    else if (profile.germanLevel === "A1") score += 4;

    // English Language score
    if (profile.englishLevel.includes("C1/C2") || profile.englishLevel === "B2") score += 10;
    else if (profile.englishLevel === "B1") score += 5;

    return Math.min(score, 100);
  };

  const progressScore = calculateProgressScore();

  // Helper variables for routing logic
  const isIT = profile.field.toLowerCase().includes("it") || 
               profile.field.includes("نرم‌افزار") || 
               profile.field.includes("برنامه‌نویسی") || 
               profile.field.includes("شبکه") || 
               profile.field.includes("طراحی وب") ||
               profile.field.toLowerCase().includes("software") ||
               profile.field.toLowerCase().includes("developer") ||
               profile.field.toLowerCase().includes("computer");

  const hasAcademicDegree = ["bachelor", "master", "phd"].includes(profile.degree);
  const hasGoodGerman = ["B1", "B2", "C1", "C2"].includes(profile.germanLevel);
  const hasGoodEnglish = profile.englishLevel.includes("C1/C2") || profile.englishLevel === "B2";

  // Determine primary suggested pathway
  const getSuggestedPathway = () => {
    if (hasAcademicDegree && profile.experience >= 2) {
      return {
        id: "blue-card",
        title: "کارت آبی اتحادیه اروپا (EU Blue Card)",
        desc: "سریع‌ترین و معتبرترین مسیر برای نیروهای آکادمیک با تجربه کار بالا پس از اخذ جاب‌آفر."
      };
    } else if (isIT && profile.experience >= 3) {
      return {
        id: "it-specialist",
        title: "مسیر متخصصین IT بدون مدرک تجربی",
        desc: "بهره‌مندی از قانون استثنایی پذیرش بدون مدرک تحصیلی آکادمیک صرفاً با تکیه بر سوابق عملی قوی."
      };
    } else if (hasAcademicDegree || profile.degree === "diploma" || profile.degree === "associate") {
      return {
        id: "chancenkarte",
        title: "کارت فرصت آلمان (Chancenkarte)",
        desc: "سیستم بر پایه امتیازدهی جدید فدرال آلمان؛ ایده‌آل برای جستجوی کار به صورت حضوری."
      };
    } else {
      return {
        id: "skilled-visa",
        title: "ویزای نیروی متخصص مهارتی / فنی و حرفه‌ای",
        desc: "تکیه بر معادل‌سازی مدارک کارگاهی و فنی برای تصاحب موقعیت‌های مهارتی."
      };
    }
  };

  const pathway = getSuggestedPathway();

  // Dynamic status generator for steps
  const getStepStatus = (stepId: number) => {
    if (stepId === 1) return { label: "کامل شده", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    
    if (stepId === 2) {
      if (profile.degree === "none") {
        return { label: "غیرضروری (مسیر ویژه IT)", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      }
      return { label: "نیاز به اقدام", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
    }

    if (stepId === 3) {
      if (["B2", "C1", "C2"].includes(profile.germanLevel)) {
        return { label: "بسیار قوی (آماده)", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      }
      if (profile.germanLevel === "B1") {
        return { label: "شرایط خوب", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
      }
      return { label: "نیاز به ارتقا", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    }

    if (stepId === 4) {
      return { label: "مرحله بعدی شما", color: "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse" };
    }

    return { label: "در انتظار مراحل قبل", color: "bg-slate-800/50 text-slate-450 border-slate-800/80" };
  };

  // Step Data Generator
  const steps = [
    {
      id: 1,
      title: "ارزیابی اولیه و ترسیم استراتژی مهاجرتی",
      icon: <GraduationCap className="w-5 h-5" />,
      duration: "آنی (انجام شده)",
      cost: "رایگان",
      summary: "تحلیل مشخصات فردی، سن، تخصص و محاسبه امتیازات ورود به آلمان.",
      advice: (
        <div className="space-y-3 text-slate-350">
          <p>
            کاربر گرامی، بر اساس اطلاعات نمایه شما (سن: <strong>{profile.age} سال</strong>، تخصص: <strong>{profile.field}</strong> و سابقه کار: <strong>{profile.experience} سال</strong>)، مسیر مهاجرتی شما با موفقیت فرموله‌بندی شد.
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-teal-400 font-bold block mb-1">مسیر پیشنهادی هوشمند جاب‌فایندر:</span>
            <p className="text-white text-xs font-black">{pathway.title}</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{pathway.desc}</p>
          </div>
          <p className="text-[11px]">
            سن شما ({profile.age} سال) بازه مناسبی است. دولت آلمان برای متقاضیان زیر ۳۵ سال در سیستم کارت فرصت بالاترین امتیاز سن (۲ امتیاز) را در نظر گرفته است که شانس شما را به شدت تقویت می‌کند.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "معادل‌سازی مدارک تحصیلی (Anabin / ZAB / Anerkennung)",
      icon: <CheckCircle2 className="w-5 h-5" />,
      duration: hasAcademicDegree ? "۲ الی ۳ ماه" : "۳ الی ۵ ماه",
      cost: hasAcademicDegree ? "رایگان تا ۲۰۰ یورو" : "۲۰۰ الی ۶۰۰ یورو",
      summary: "ارزیابی هم‌ارزی مدرک تحصیلی یا گواهی مهارتی شما با سیستم آموزشی جمهوری فدرال آلمان.",
      advice: (
        <div className="space-y-3 text-slate-350">
          <p>
            مدرک تحصیلی شما به عنوان <strong>{
              profile.degree === "master" ? "کارشناسی ارشد و بالاتر" : 
              profile.degree === "bachelor" ? "کارشناسی (لیسانس)" : 
              profile.degree === "associate" ? "کاردانی (فوق دیپلم)" : 
              profile.degree === "diploma" ? "دیپلم متوسطه" : "بدون مدرک رسمی"
            }</strong> ثبت شده است.
          </p>
          
          {hasAcademicDegree ? (
            <div className="space-y-2">
              <p className="text-xs">
                به عنوان دارنده مدرک دانشگاهی رسمی، دو حالت وجود دارد:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs pr-2">
                <li><strong>حالت اول (رایگان):</strong> دانشگاه شما در دیتابیس رسمی آنابین (Anabin) دارای نمایه H+ باشد و رشته شما دقیقاً ذکر شده باشد. در این صورت فقط پرینت صفحات آنابین برای سفارت کافیست.</li>
                <li><strong>حالت دوم (هزینه ۲۰۰ یورو):</strong> در صورتی که دانشگاه یا رشته شما در آنابین ثبت نشده باشد، باید با ارسال مستقیم مدارک برای سازمان ZAB آلمان، تاییدیه ارزشیابی تحصیلی (Zeugnisbewertung) دریافت کنید.</li>
              </ul>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => onTabChange?.("portals")}
                  className="px-3 py-1.5 bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-bold hover:bg-indigo-600/50 transition cursor-pointer"
                >
                  راهنمای گام‌به‌گام آنابین و ZAB
                </button>
              </div>
            </div>
          ) : profile.degree === "none" ? (
            <div className="p-3 bg-amber-500/5 border border-amber-500/25 rounded-xl text-xs">
              <p className="text-amber-300 font-bold mb-1">💡 استراتژی ویژه افراد فاقد مدرک تحصیلی آکادمیک:</p>
              <p className="leading-relaxed text-[11px]">
                از آنجایی که فاقد مدرک تحصیلی دانشگاهی هستید، تاییدیه ZAB برای شما کاربرد ندارد. در صورتی که تخصص شما در حوزه‌ی فناوری اطلاعات (IT) است، بر اساس تبصره استثنایی آلمان می‌توانید با اثبات حداقل ۳ سال سابقه کار عملی و دریافت جاب‌آفر، مستقیماً بدون مدرک تحصیلی ویزای کار بگیرید. در غیر این صورت، جهت اقدام از مسیرهای مهارتی، نیاز به معادل‌سازی گواهی‌های فنی حرفه‌ای (Anerkennung) توسط اتاق بازرگانی مربوطه در آلمان خواهید داشت.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <p>
                مدارک دیپلم و کاردانی شما به عنوان مدارک مهارتی فنی طبقه‌بندی می‌شوند. برای تایید این مدارک در سفارت، باید فرآیند ارزشیابی کامل حرفه‌ای یا همان <strong>Anerkennung</strong> را از مراجع اصناف آلمانی (مانند IHK FOSA) دریافت کنید تا گواهینامه معادل برایتان صادر شود. این معادل‌سازی معمولاً بین ۲۰۰ تا ۶۰۰ یورو هزینه دارد.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 3,
      title: "ارتقای سطح زبان و تهیه رزومه استاندارد آلمانی (Lebenslauf)",
      icon: <Languages className="w-5 h-5" />,
      duration: "۲ الی ۶ ماه",
      cost: "~۱۵۰ یورو (هزینه آزمون رسمی)",
      summary: "تقویت زبان و نگارش رزومه و انگیزه‌نامه کاملاً منطبق با استانداردهای سخت‌گیرانه فدرال.",
      advice: (
        <div className="space-y-3 text-slate-350">
          <p>
            سطح زبان ثبت شده شما: آلمانی [<strong>{profile.germanLevel}</strong>] | انگلیسی [<strong>{profile.englishLevel}</strong>] می‌باشد.
          </p>

          {hasGoodGerman ? (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/25 rounded-xl text-xs">
              <p className="text-emerald-300 font-bold mb-1">🚀 وضعیت زبانی شما عالیست!</p>
              <p className="leading-relaxed text-[11px]">
                داشتن سطح زبان آلمانی {profile.germanLevel} برگ برنده بی‌نظیری در رزومه شماست. بیش از ۸۵ درصد کارفرمایان آلمانی مسلط بودن به زبان محلی را فاکتور اول دعوت به مصاحبه می‌دانند. شما شرایط ایده‌آلی برای اقدام مستقیم دارید.
              </p>
            </div>
          ) : hasGoodEnglish && isIT ? (
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/25 rounded-xl text-xs">
              <p className="text-indigo-300 font-bold mb-1">🖥️ مسیر زبان انگلیسی در حوزه IT:</p>
              <p className="leading-relaxed text-[11px]">
                با توجه به اینکه تخصص شما در زمینه فناوری اطلاعات و سطح انگلیسی شما قوی ({profile.englishLevel}) است، شانس بسیار خوبی برای تصاحب پوزیشن‌های بین‌المللی و انگلیسی‌زبان در کلان‌شهرهای آلمان (مانند برلین، مونیخ و فرانکفورت) دارید. اما پیشنهاد می‌شود برای تقویت امور زندگی روزمره، آلمانی خود را حداقل تا سطح A2 ارتقا دهید.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/5 border border-amber-500/25 rounded-xl text-xs">
              <p className="text-amber-300 font-bold mb-1">⚠️ هشدار زبانی:</p>
              <p className="leading-relaxed text-[11px]">
                سطح زبان آلمانی شما پایین است. مهاجرت کاری به آلمان با زبان ضعیف، شانس پذیرش شما را به شدت محدود می‌کند. پیشنهاد می‌کنیم با برنامه‌ریزی فشرده ۶ ماهه، سطح آلمانی خود را حداقل به B1 برسانید تا بتوانید با کارفرمایان آلمانی مکالمه کنید.
              </p>
            </div>
          )}

          <div className="text-xs pt-1 space-y-2">
            <p className="text-slate-200 font-bold">📄 ساخت رزومه کاری آلمانی (Lebenslauf):</p>
            <p className="text-[11px]">
              رزومه‌های مرسوم انگلیسی یا ایرانی به هیچ وجه برای سیستم کاریابی آلمان اثربخش نیستند. کارفرمایان آلمانی انتظار دارند رزومه شما بدون حاشیه، به ترتیب تاریخ معکوس، به زبان آلمانی یا انگلیسی روان و شامل تاییدیه وضعیت آنابین به صورت صریح باشد.
            </p>
            <div className="flex gap-2 pt-1">
              <button 
                onClick={() => onTabChange?.("cv")}
                className="px-3 py-1.5 bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold hover:bg-emerald-600/50 transition cursor-pointer"
              >
                رفتن به سیستم رزومه‌ساز آنلاین
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "مکاتبه و کاریابی در پرتال‌های تخصصی آلمان",
      icon: <Search className="w-5 h-5" />,
      duration: "۲ الی ۵ ماه",
      cost: "رایگان",
      summary: "جستجوی پوزیشن‌های شغلی خالی و ارسال مستقیم درخواست همکاری به کارفرمایان فدرال.",
      advice: (
        <div className="space-y-3 text-slate-350">
          <p>
            با داشتن <strong>{profile.experience} سال</strong> سابقه کار در فیلد <strong>{profile.field}</strong>، کارفرمایان آلمانی به دنبال تجارب مستند شما خواهند بود.
          </p>

          <p className="text-xs leading-relaxed">
            فرآیند کاریابی در آلمان نیازمند مداومت است. ارسال روزانه ۲ الی ۵ رزومه کاملاً کاستومایز شده به همراه انگیزه‌نامه (Anschreiben) برای کارفرما، بهترین متد نتیجه‌گیری سریع است.
          </p>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <span className="text-[10px] text-teal-400 font-bold block">پرتال‌های کاریابی برتر پیشنهادی برای فیلد شما:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pr-1">
              {isIT ? (
                <>
                  <li><strong>Honeypot.io & Relocate.me:</strong> پلتفرم‌های تخصصی IT که کارفرماها برای برنامه نویسان ویزای اسپانسرشیپ فراهم می‌کنند.</li>
                  <li><strong>LinkedIn (Germany):</strong> پرکاربردترین فضا برای موقعیت‌های انگلیسی‌زبان و مدرن آلمان.</li>
                </>
              ) : (
                <>
                  <li><strong>Make it in Germany:</strong> درگاه رسمی و دولتی با لیست پوزیشن‌های خالی تایید شده مهاجرتی.</li>
                  <li><strong>StepStone.de & Indeed:</strong> موتورهای جستجوی کار قوی کشور آلمان.</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-2 pt-1">
            <button 
              onClick={() => onTabChange?.("jobs")}
              className="px-3 py-1.5 bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-bold hover:bg-indigo-600/50 transition cursor-pointer"
            >
              مشاهده موقعیت‌های کاری اسپانسرشیپ ویزا
            </button>
            <button 
              onClick={() => onTabChange?.("portals")}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition cursor-pointer"
            >
              لیست کامل بانک‌های مشاغل آلمان
            </button>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "وقت سفارت، آماده‌سازی تمکن مالی و اخذ ویزا",
      icon: <FileText className="w-5 h-5" />,
      duration: "۱ الی ۲ ماه",
      cost: "۷۵ یورو (کارمزد سفارت)",
      summary: "تکمیل فرم‌های ویزا، رزرو قرار مصاحبه سفارت (کارگزاری TLScontact) و اثبات تمکن هزینه‌های زندگی.",
      advice: (
        <div className="space-y-3 text-slate-350">
          <p>
            پس از به موفقیت رسیدن در مراحل کاریابی و اخذ یکی از دو سند زیر، مجاز به درخواست ویزا خواهید بود:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs pr-2">
            <li><strong>جاب‌آفر (قرارداد کاری رسمی):</strong> در صورتی که قرارداد مرتبط با تاییدیه مدارک خود با حقوق مکفی دریافت کنید، کارفرمای شما می‌تواند با پرداخت ۴۱۱ یورو هزینه اداری، فرآیند **شتاب‌دهی ویزای تخصصی** را فعال کند تا قرار سفارت شما ظرف ۲ هفته صادر شود.</li>
            <li><strong>کارت فرصت (Chancenkarte):</strong> اگر قصد ورود بدون جاب‌آفر برای جستجوی کار در خاک آلمان را دارید، باید به میزان حداقل ۱,۰۲۷ یورو در ماه (حدود ۱۲,۳۲۴ یورو برای کل سال) تمکن مالی نقدی در قالب حساب مسدود شده (Sperrkonto) یا تمکن ریالی معادل ارائه نمایید.</li>
          </ul>
          <p className="text-[11px] text-slate-400">
            * توجه داشته باشید دریافت و بررسی مدارک و انگشت‌نگاری ویزای سفارت آلمان در ایران توسط کارگزار رسمی **TLScontact** انجام می‌گیرد و اصل مدارک معادل‌سازی شده به همراه مدارک شغلی و زبان باید در روز موعد به صورت کاغذی ارائه شوند.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "پرواز به آلمان، اسکان و ثبت ملّی آدرس (Anmeldung)",
      icon: <PlaneTakeoff className="w-5 h-5" />,
      duration: "۲ هفته اول ورود",
      cost: "هزینه بلیط هواپیما + اجاره اولیه",
      summary: "ورود به شهر مقصد، نهایی‌سازی اسکان موقت، ثبت آدرس شهرداری و دریافت کارت اقامت.",
      advice: (
        <div className="space-y-3 text-slate-350 text-xs">
          <p>
            گام نهایی و پرافتخار ورود به خاک فدرال آلمان است! بلافاصله پس از ورود، وظایف اداری زیر را پیش رو دارید:
          </p>
          <ol className="list-decimal list-inside space-y-2 pr-2">
            <li><strong>ثبت آدرس مسکونی (Anmeldung):</strong> شما باید حداکثر ظرف مدت ۱۴ روز پس از ورود، محل سکونت خود را در شهرداری منطقه (Bürgeramt) ثبت کنید و برگه رسمی ملّی آدرس را دریافت نمایید. بدون این برگه امکان باز کردن حساب بانکی و دریافت شماره مالیاتی وجود ندارد.</li>
            <li><strong>دریافت شماره شناسایی مالیاتی (Steueridentifikationsnummer):</strong> این شماره به طور خودکار پس از ثبت آدرس برای شما پست خواهد شد تا به کارفرمایتان ارائه دهید.</li>
            <li><strong>تبدیل ویزا به کارت اقامت (Aufenthaltstitel):</strong> پیش از اتمام مهلت ویزای ورودی در پاسپورت، باید با مراجعه به اداره امور اتباع خارجی شهر خود (Ausländerbehörde) کارت اقامت رسمی چندساله خود را ثبت و دریافت کنید.</li>
          </ol>
        </div>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.35,
        ease: "easeOut" 
      } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
    >
      
      {/* Header and Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 mb-8">
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            نقشه راه کاملا اختصاصی مهاجرت شما
          </span>
          <h3 className="text-xl font-black text-white">
            برنامه گام‌به‌گام کاریابی و ویزای آلمان ۲۰۲۶
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            این برنامه متناسب با سن، مدرک تحصیلی و تجربه شغلی شما در حوزه <span className="text-indigo-400 font-bold">"{profile.field}"</span> شبیه‌سازی شده است.
          </p>
        </div>
        
        {/* Dynamic Circular/Horizontal Preparation Score card + PDF Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Download Roadmap as PDF Button leveraging CSS print styles */}
          <button
            onClick={() => {
              document.body.classList.add("print-target-roadmap");
              const originalTitle = document.title;
              const name = (profile.name || "Applicant").trim();
              const printDocTitle = formatPrintDocumentTitle("نقشه راه مهاجرت کاری آلمان", name);
              document.title = printDocTitle;
              const cleanup = () => {
                document.body.classList.remove("print-target-roadmap");
                document.title = originalTitle;
                window.removeEventListener("afterprint", cleanup);
              };
              window.addEventListener("afterprint", cleanup);
              setTimeout(() => {
                window.print();
                setTimeout(cleanup, 2500);
              }, 200);
            }}
            id="journey-download-roadmap-btn"
            className="px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer"
            title="دانلود سند رسمی نقشه راه مهاجرتی به صورت فایل PDF استاندارد با استایل‌های چاپ (CSS Print Styles)"
          >
            <Download className="w-4 h-4 text-emerald-100" />
            <span>دانلود به عنوان PDF (Download as PDF)</span>
          </button>

          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
              title="سفارشی‌سازی خروجی سند و مقایسه شغلی"
            >
              <FileDown className="w-4 h-4 text-indigo-300" />
              <span>سفارشی‌سازی PDF</span>
            </button>
          )}

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg md:max-w-xs w-full justify-between">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold">میزان آمادگی فعلی پرونده شما:</p>
              <p className="text-lg font-black text-white mt-1">{progressScore}% آماده</p>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                {progressScore >= 70 ? "✅ شرایط شما برای آغاز مکاتبه و کاریابی بسیار مطلوب است." :
                 progressScore >= 45 ? "⚡ شرایط مناسب؛ روی آماده‌سازی زبان و معادل‌سازی تمرکز کنید." :
                 "⚠️ نمایه شما نیاز به تقویت جدی در حوزه زبان یا سابقه کار دارد."}
              </p>
            </div>
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="text-slate-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="text-indigo-500 transition-all duration-1000"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - progressScore / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-indigo-400">{progressScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Interactive Timeline Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative pr-4 md:pr-6 border-r-2 border-slate-800/80 space-y-6"
      >
        {steps.map((step, idx) => {
          const isExpanded = expandedStep === step.id;
          const status = getStepStatus(step.id);
          
          return (
            <motion.div 
              key={step.id} 
              variants={itemVariants}
              className="relative group text-right"
            >
              {/* Timeline Connector node absolute indicator */}
              <div className={`absolute -right-[23px] md:-right-[31px] top-1.5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                isExpanded 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-110" 
                  : "bg-slate-950 text-slate-500 border-2 border-slate-800 hover:border-slate-700 group-hover:scale-105"
              }`}>
                {step.icon}
              </div>

              {/* Step Main Card Container */}
              <div className={`mr-6 md:mr-8 bg-slate-950/60 border rounded-2xl overflow-hidden transition-all duration-300 ${
                isExpanded 
                  ? "border-indigo-500/40 bg-slate-950/90 shadow-xl shadow-indigo-500/5" 
                  : "border-slate-800/80 hover:border-slate-750/90 bg-slate-950/40"
              }`}>
                
                {/* Card Title Header (Toggle Bar) */}
                <div 
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-slate-500">گام {step.id} از ۶</span>
                      <h4 className={`text-sm sm:text-base font-black transition-colors ${isExpanded ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
                        {step.title}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    
                    {!isExpanded && (
                      <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                        {step.summary}
                      </p>
                    )}
                  </div>

                  <div className="p-1 hover:bg-slate-800/50 rounded-lg text-slate-500 hover:text-slate-300 transition">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded content details wrapper */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-slate-900 bg-slate-950/80"
                    >
                      <div className="p-5 md:p-6 space-y-5">
                        
                        {/* Meta facts details: Duration, Cost, Action etc. */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-850/70">
                           <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                            <div className="text-right">
                              <p className="text-[10px] text-slate-500 font-bold">بازه زمانی تخمینی:</p>
                              <p className="text-xs text-slate-200 font-black">{step.duration}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
                            <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div className="text-right">
                              <p className="text-[10px] text-slate-500 font-bold">هزینه‌های احتمالی فدرال:</p>
                              <p className="text-xs text-slate-200 font-black">{step.cost}</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive dynamic advice text */}
                        <div className="text-xs leading-relaxed text-slate-300 space-y-3">
                          {step.advice}
                        </div>

                        {/* Interactive Gemini Tips Button */}
                        <div className="pt-3.5 border-t border-slate-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <p className="text-[10px] text-slate-400 leading-relaxed max-w-sm">
                            💡 توصیه‌ها و راهکارهای هوشمند اختصاصی فدرال آلمان بر اساس شرایط ویژه پرونده شما با Gemini.
                          </p>
                          <button
                            onClick={() => handleOpenTipsModal(step.id, step.title)}
                            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15 cursor-pointer shrink-0"
                          >
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            دریافت توصیه‌های هوش مصنوعی (Gemini)
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Interactive Gemini Actionable Tips Modal */}
      <AnimatePresence>
        {tipsModalOpen && selectedStepId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTipsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl z-10 text-right flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setTipsModalOpen(false)}
                className="absolute top-6 left-6 text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-800 p-2 rounded-xl border border-slate-800 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Modal Title */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  مشاوره هوشمند اختصاصی با Gemini
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">{selectedStepId}</span>
                  توصیه‌های عملیاتی گام: {selectedStepTitle}
                </h3>
              </div>

              {/* Loading State or Rendered Content */}
              <div className="flex-1 overflow-y-auto mb-6 pr-1 custom-scrollbar min-h-[150px]">
                {loadingTips ? (
                  <div className="py-8 space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400 text-xs font-black animate-pulse">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      در حال بررسی وضعیت رزومه شما و فراخوانی توصیه‌های کارشناسی فدرال...
                    </div>
                    {/* Animated Skeleton lines */}
                    <div className="h-4 bg-slate-950 border border-slate-800 rounded-lg w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-950 border border-slate-800 rounded-lg w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-slate-950 border border-slate-800 rounded-lg w-4/5 animate-pulse"></div>
                    <div className="h-32 bg-slate-950 border border-slate-800 rounded-xl w-full animate-pulse mt-4"></div>
                  </div>
                ) : (
                  <div className="space-y-4 prose prose-invert max-w-none text-slate-200">
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 md:p-6 text-xs text-right leading-relaxed text-slate-300">
                      {parseMarkdown(tipsContent)}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Checklist segment */}
              <div className="border-t border-slate-800/60 pt-5 mt-auto">
                <h4 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  چک‌لیست شخصی کارها برای عبور از این گام:
                </h4>
                <div className="space-y-2">
                  {(milestoneChecklists[selectedStepId] || []).map((item, idx) => {
                    const itemKey = `${selectedStepId}-${idx}`;
                    const isChecked = !!completedItems[itemKey];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistItem(itemKey)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
                          isChecked 
                            ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400" 
                            : "bg-slate-950/40 border-slate-800/80 text-white hover:border-slate-700 hover:bg-slate-950/60"
                        }`}
                      >
                        <span className={`text-[11px] leading-relaxed flex-1 ${isChecked ? "line-through text-slate-500" : ""}`}>
                          {item}
                        </span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                          isChecked 
                            ? "bg-emerald-500 border-emerald-400 text-white" 
                            : "border-slate-700"
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal footer closing */}
              <div className="pt-6 flex justify-end">
                <button
                  onClick={() => setTipsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  بستن پنجره راهنما
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// Custom simple markdown-to-HTML parser function for beautiful Persian rendering
function parseMarkdown(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <div key={i} className="h-2" />;

    // Headers
    if (cleanLine.startsWith("###")) {
      return <h4 key={i} className="text-base font-black text-white mt-4 mb-2 border-b border-slate-800 pb-1">{cleanLine.replace("###", "").trim()}</h4>;
    }
    if (cleanLine.startsWith("####")) {
      return <h5 key={i} className="text-sm font-bold text-indigo-400 mt-3 mb-1.5">{cleanLine.replace("####", "").trim()}</h5>;
    }
    if (cleanLine.startsWith("##")) {
      return <h3 key={i} className="text-lg font-black text-white mt-5 mb-3">{cleanLine.replace("##", "").trim()}</h3>;
    }
    if (cleanLine.startsWith("#")) {
      return <h2 key={i} className="text-xl font-black text-white mt-6 mb-4">{cleanLine.replace("#", "").trim()}</h2>;
    }

    // List items
    if (cleanLine.startsWith("*") || cleanLine.startsWith("-")) {
      const content = cleanLine.substring(1).trim();
      return (
        <li key={i} className="list-disc list-inside text-xs text-slate-300 leading-relaxed pr-2 my-1.5">
          {renderBoldText(content)}
        </li>
      );
    }

    // Numbered list items
    const numberedMatch = cleanLine.match(/^(\d+)\.\s(.*)/);
    if (numberedMatch) {
      return (
        <p key={i} className="text-xs text-slate-200 leading-relaxed font-bold my-2 flex gap-1.5">
          <span className="text-indigo-400 font-bold">{numberedMatch[1]}.</span>
          <span>{renderBoldText(numberedMatch[2])}</span>
        </p>
      );
    }

    // Normal paragraph
    return (
      <p key={i} className="text-xs text-slate-300 leading-relaxed my-2">
        {renderBoldText(cleanLine)}
      </p>
    );
  });
}

function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-extrabold text-white bg-indigo-500/10 px-1 py-0.5 rounded border border-indigo-500/20">{part}</strong>;
    }
    return part;
  });
}
