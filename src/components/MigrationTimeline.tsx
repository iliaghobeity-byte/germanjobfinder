import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Languages,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  PlaneTakeoff,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
  Calendar,
  CheckSquare,
  Square,
  Zap,
  TrendingUp,
  RefreshCw,
  Trophy,
  ArrowLeft,
  Building2,
  FileCheck,
  Layers,
  HelpCircle,
  Sliders,
  Compass,
  FileDown,
  Printer,
  SlidersHorizontal,
  Check,
  AlertCircle,
  FileText
} from "lucide-react";
import { exportRoadmapToPdf } from "../utils/roadmapPdfGenerator";
import { generateRuleBasedMonthlyRoadmap } from "../roadmapHelpers";

export type StageStatus = "completed" | "in_progress" | "upcoming";
export type PaceMode = "fast" | "standard" | "relaxed" | "custom";
export type TargetVisaRoute = "chancenkarte" | "blue_card" | "fachkraft" | "anerkennungspartnerschaft";

export interface TimelineTrackInterval {
  id: string;
  key: "language" | "degree" | "job_hunt" | "visa" | "arrival";
  titleFa: string;
  titleDe: string;
  startMonth: number;
  endMonth: number;
  durationMonths: number;
  color: string;
  gradient: string;
  icon: any;
  dependencyFa: string;
  parallelWithFa?: string;
  milestoneFa: string;
}

export interface TimelineStage {
  id: string;
  stepNumber: number;
  titleFa: string;
  titleDe: string;
  subtitleFa: string;
  category: "language" | "degree" | "job_hunt" | "visa" | "arrival";
  icon: any;
  status: StageStatus;
  progressPercent: number;
  startMonth: number;
  endMonth: number;
  estimatedDurationFa: string;
  estimatedCostFa: string;
  targetTab?: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview" | "guide" | "advanced-jobs";
  actionButtonLabelFa: string;
  profileFeedbackFa: string;
  criticalTipsFa: string[];
  subtasks: {
    id: string;
    textFa: string;
    completed: boolean;
  }[];
}

interface MigrationTimelineProps {
  profile?: {
    name?: string;
    age?: number;
    degree?: string;
    experience?: number;
    field?: string;
    germanLevel?: string;
    englishLevel?: string;
    skills?: string;
    anabinStatus?: string;
    universityName?: string;
  } | null;
  onTabChange?: (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview" | "guide" | "advanced-jobs") => void;
  className?: string;
}

export const MigrationTimeline: React.FC<MigrationTimelineProps> = ({
  profile,
  onTabChange,
  className = ""
}) => {
  // User customizable path parameters
  const [currentGerman, setCurrentGerman] = useState<string>(() => {
    return (profile?.germanLevel || "B1").toUpperCase().trim();
  });
  const [targetGerman, setTargetGerman] = useState<string>("B2");
  const [currentDegree, setCurrentDegree] = useState<string>(() => {
    return (profile?.degree || "bachelor").toLowerCase().trim();
  });
  const [currentExperience, setCurrentExperience] = useState<number>(() => {
    return Number(profile?.experience) || 3;
  });
  const [targetRoute, setTargetRoute] = useState<TargetVisaRoute>("chancenkarte");
  
  // Pace preset and duration controls
  const [paceMode, setPaceMode] = useState<PaceMode>("standard");
  const [customIntervals, setCustomIntervals] = useState<Record<string, { start: number; end: number }>>({
    language: { start: 1, end: 8 },
    degree: { start: 2, end: 5 },
    job_hunt: { start: 5, end: 9 },
    visa: { start: 8, end: 11 },
    arrival: { start: 11, end: 12 }
  });

  // Active view layout & selected stage
  const [selectedStageId, setSelectedStageId] = useState<string>("language");
  const [viewLayout, setViewLayout] = useState<"flow" | "gantt" | "cards">("gantt");
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState("");

  // Start date for dynamic calendar milestones calculation
  const [startMonthIndex, setStartMonthIndex] = useState<number>(() => new Date().getMonth());
  const [startYear, setStartYear] = useState<number>(() => new Date().getFullYear());

  // Local storage for user-toggled custom subtask checklist
  const [customTaskState, setCustomTaskState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("germany_migration_timeline_tasks_v2");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync when profile prop updates initially
  useEffect(() => {
    if (profile?.germanLevel) setCurrentGerman(profile.germanLevel.toUpperCase().trim());
    if (profile?.degree) setCurrentDegree(profile.degree.toLowerCase().trim());
    if (profile?.experience !== undefined) setCurrentExperience(Number(profile.experience) || 3);
  }, [profile]);

  // Adjust default intervals based on pace mode
  useEffect(() => {
    if (paceMode === "fast") {
      setCustomIntervals({
        language: { start: 1, end: 5 },
        degree: { start: 1, end: 3 },
        job_hunt: { start: 3, end: 6 },
        visa: { start: 5, end: 7 },
        arrival: { start: 7, end: 8 }
      });
    } else if (paceMode === "standard") {
      setCustomIntervals({
        language: { start: 1, end: 8 },
        degree: { start: 2, end: 5 },
        job_hunt: { start: 5, end: 9 },
        visa: { start: 8, end: 11 },
        arrival: { start: 11, end: 12 }
      });
    } else if (paceMode === "relaxed") {
      setCustomIntervals({
        language: { start: 1, end: 12 },
        degree: { start: 3, end: 7 },
        job_hunt: { start: 7, end: 14 },
        visa: { start: 12, end: 16 },
        arrival: { start: 16, end: 18 }
      });
    }
  }, [paceMode]);

  const toggleSubtask = (taskId: string, defaultCompleted: boolean) => {
    setCustomTaskState(prev => {
      const currentVal = prev[taskId] !== undefined ? prev[taskId] : defaultCompleted;
      const next = { ...prev, [taskId]: !currentVal };
      try {
        localStorage.setItem("germany_migration_timeline_tasks_v2", JSON.stringify(next));
      } catch (err) {
        console.error("Error saving timeline tasks:", err);
      }
      return next;
    });
  };

  const isTaskDone = (taskId: string, defaultCompleted: boolean) => {
    return customTaskState[taskId] !== undefined ? customTaskState[taskId] : defaultCompleted;
  };

  // Derive dynamic timeline stages from user inputs
  const stages: TimelineStage[] = useMemo(() => {
    const englishLevel = (profile?.englishLevel || "B2").toUpperCase().trim();
    const field = profile?.field || "فناوری اطلاعات و مهندسی";

    // 1. Language Learning Stage
    let langPercent = 35;
    let langStatus: StageStatus = "in_progress";
    let langFeedback = "";

    if (currentGerman === "C1" || currentGerman === "C2") {
      langPercent = 100;
      langStatus = "completed";
      langFeedback = `تسلط پیشرفته به زبان آلمانی (${currentGerman})؛ بالاتر از کلیه کف‌های قانونی برای تمام مشاغل و واجد اولویت قطعی در مصاحبه‌های فنی و دریافت اقامت دائم.`;
    } else if (currentGerman === "B2") {
      langPercent = 90;
      langStatus = "completed";
      langFeedback = `سطح B2 استاندارد طلایی مهاجرت کاری به آلمان است. این سطح کلیه نیازمندی‌های بلوکارت و اکثریت کارفرمایان بخش شرکت‌های متوسط (Mittelstand) را پوشش می‌دهد.`;
    } else if (currentGerman === "B1") {
      langPercent = 70;
      langStatus = "in_progress";
      langFeedback = `سطح B1 نصاب رسمی احراز صلاحیت کارت فرصت (§20a) است. پیشنهاد می‌شود برای جاب‌آفر پایدار، مطالعه تا سطح B2 را موازی با معادل‌سازی ادامه دهید.`;
    } else if (currentGerman === "A2") {
      langPercent = 45;
      langStatus = "in_progress";
      langFeedback = `سطح A2 نقطه شروع مناسبی است؛ برای دریافت ویزا و مصاحبه کاری حداقل نیازمند ارتقا به B1 هستید. زبان انگلیسی (${englishLevel}) در شرکت‌های بین‌المللی مکمل خواهد بود.`;
    } else {
      langPercent = 25;
      langStatus = "in_progress";
      langFeedback = `سطح آلمانی در فاز مقدماتی (${currentGerman}). اولویت فوری شما حضور در دوره‌های فشرده برای رسیدن به کف B1/B2 در بازه تعیین‌شده است.`;
    }

    const langSubtasks = [
      { id: "lang_1", textFa: `تعیین سطح استاندارد CEFR و برنامه‌ریزی هدفمند (از ${currentGerman} به ${targetGerman})`, completed: true },
      { id: "lang_2", textFa: "تکمیل کتب آموزشی معتبر (Menschen / Sicher / Aspekte Neu) تا پایان سطح هدف", completed: langPercent >= 70 },
      { id: "lang_3", textFa: "رزرو و قبولی در آزمون بین‌المللی مورد تایید سفارت (Goethe-Zertifikat یا telc B1/B2)", completed: langPercent >= 90 },
      { id: "lang_4", textFa: `تقویت واژگان تخصصی رشته (${field}) و مکالمه مصاحبه کاری به آلمانی`, completed: langPercent >= 50 }
    ];

    // 2. Degree Recognition & ZAB Stage
    let degreePercent = 50;
    let degreeStatus: StageStatus = "in_progress";
    let degreeFeedback = "";

    if (currentDegree === "phd" || currentDegree === "master") {
      degreePercent = 95;
      degreeStatus = "completed";
      degreeFeedback = `مدرک تحصیلی کارشناسی ارشد/دکتری دارای حداکثر امتیاز تحصیلی در کارت فرصت (۴ امتیاز) و تاییدیه هم‌ارزی مستقیم دانشگاهی در آنابین (H+) است.`;
    } else if (currentDegree === "bachelor") {
      degreePercent = 85;
      degreeStatus = "in_progress";
      degreeFeedback = `مدرک کارشناسی ۴ ساله با دانشگاه‌های آلمان هم‌تراز است. دریافت پرینت ارزشیابی آنابین یا تاییدیه انطباق زاب (Statement of Comparability) کفایت می‌کند.`;
    } else if (currentDegree === "associate" || currentDegree === "diploma") {
      degreePercent = 60;
      degreeStatus = "in_progress";
      degreeFeedback = `مدرک کاردانی یا دیپلم فنی نیازمند ارزشیابی تطبیقی دو ساله از طریق مرجع تخصصی مربوطه (IHK FOSA یا مراجع استانی) است.`;
    } else {
      degreePercent = 40;
      degreeStatus = "in_progress";
      degreeFeedback = `ارزیابی مدارک مهارتی فنی و حرفه‌ای مطابق با قانون جدید نیروی ماهر (FEG) در دست بررسی است.`;
    }

    const degreeSubtasks = [
      { id: "deg_1", textFa: "جستجو در دیتابیس رسمی Anabin و احراز وضعیت دانشگاه (H+) و مقطع تحصیلی", completed: true },
      { id: "deg_2", textFa: "ترجمه رسمی دانشنامه و ریزنمرات به آلمانی با مهرهای تاییدیه دادگستری و امور خارجه", completed: degreePercent >= 80 },
      { id: "deg_3", textFa: "ثبت پرونده در سامانه ارزشیابی ZAB KMK و دریافت گواهی تطبیق دیجیتال", completed: degreePercent >= 85 },
      { id: "deg_4", textFa: "استعلام معادل‌سازی نظام مشاغل نظام‌مند (Defizitbescheid برای کادر درمان/مهندسی نظام)", completed: degreePercent >= 95 }
    ];

    // 3. Job Hunting & Applications Stage
    let jobPercent = 35;
    let jobStatus: StageStatus = "in_progress";
    let jobFeedback = "";

    if (currentExperience >= 5) {
      jobPercent = 85;
      jobFeedback = `${currentExperience} سال سابقه کار تخصصی اولویت برجسته‌ای در غربالگری کارفرمایان دارد؛ تمرکز اصلی بر ارسال رزومه مطابق استاندارد DIN 5008 به شرکت‌های حامی متقاضی ایرانی است.`;
    } else if (currentExperience >= 3) {
      jobPercent = 70;
      jobFeedback = `${currentExperience} سال سابقه در رده متخصصین سطح متوسط (Mid-Level) مورد نیاز گسترده صنایع آلمان است.`;
    } else if (currentExperience >= 1) {
      jobPercent = 50;
      jobFeedback = `${currentExperience} سال سابقه نیازمند برجسته‌سازی نمونه‌کارها، پروژه‌های عملی و پورتفولیو در کنار رزومه است.`;
    } else {
      jobPercent = 30;
      jobFeedback = `سابقه کار زیر یک سال؛ مسیر کارت فرصت برای جستجوی کار حضوری در آلمان بهترین راهبرد است.`;
    }

    const jobSubtasks = [
      { id: "job_1", textFa: "تدوین رزومه آلمانی استاندارد (Tabellarischer Lebenslauf) با استاندارد تصویری DIN 5008", completed: true },
      { id: "job_2", textFa: "تنظیم نمایه بین‌المللی لینکدین و شبکه شغلی XING با کلیدواژه‌های بازار آلمان", completed: jobPercent >= 50 },
      { id: "job_3", textFa: "نگارش قالب اختصاصی انگیزه‌نامه آلمانی (Anschreiben) برای موقعیت‌های هدف", completed: jobPercent >= 70 },
      { id: "job_4", textFa: "ارسال هدفمند روزانه ۳ الی ۵ اپلیکیشن در پرتال‌های کاریابی (StepStone, Indeed, LinkedIn)", completed: false },
      { id: "job_5", textFa: "شبیه‌سازی مصاحبه‌های رفتاری و تخصصی با هوش مصنوعی آلمانی", completed: false }
    ];

    // 4. Visa & Embassy Appointment Stage
    let visaPercent = 25;
    let visaStatus: StageStatus = "upcoming";
    let visaFeedback = "";

    if (targetRoute === "chancenkarte") {
      visaFeedback = `مسیر کارت فرصت (§20a AufenthG)؛ با احراز حداقل ۶ امتیاز بر اساس مدرک، سن و زبان، بدون نیاز به قرارداد کاری اولیه می‌توانید وارد آلمان شوید.`;
      if (currentGerman !== "A0" && currentDegree !== "diploma") visaPercent = 45;
    } else if (targetRoute === "blue_card") {
      visaFeedback = `مسیر بلوکارت اروپا (§18g)؛ نیازمند قرارداد با حداقل حقوق ناخالص سالانه ۴۱,۰۴۱ یورو (برای مشاغل کمبود نیرو) یا ۴۵,۳۰۰ یورو (مشاغل عمومی).`;
      if (currentExperience >= 3 && (currentGerman === "B1" || currentGerman === "B2")) visaPercent = 40;
    } else if (targetRoute === "fachkraft") {
      visaFeedback = `ویزای نیروی کار متخصص (§18b) با امکان استفاده از رویه تسریع‌شده (§81a Fast-Track) توسط کارفرما جهت صدور ویزا در کمتر از ۲ ماه.`;
      visaPercent = 35;
    } else {
      visaFeedback = `مشارکت در معادل‌سازی مدرک حین کار (§16d Anerkennungspartnerschaft) با قرارداد کار و تعهد معادل‌سازی در آلمان.`;
      visaPercent = 30;
    }

    const visaSubtasks = [
      { id: "visa_1", textFa: "محاسبه نهایی امتیازات و اطمینان از احراز نصاب قانونی مسیر انتخابی", completed: true },
      { id: "visa_2", textFa: "رزرو وقت در سامانه کارگزاری رسمی سفارت آلمان در تهران (TLScontact)", completed: false },
      { id: "visa_3", textFa: "افتتاح حساب مسدود شده ارزی (Sperrkonto) یا نهایی‌سازی قرارداد کار (Arbeitsvertrag)", completed: false },
      { id: "visa_4", textFa: "چیدمان و دسته‌بندی مدارک هویتی و تخصصی مطابق چک‌لیست رسمی سفارت آلمان", completed: false },
      { id: "visa_5", textFa: "شرکت در مصاحبه کارگزاری و تحویل اصل مدارک و انگشت‌نگاری بیومتریک", completed: false }
    ];

    // 5. Arrival & Relocation Stage
    const arrivalPercent = 10;
    const arrivalStatus: StageStatus = "upcoming";
    const arrivalFeedback = `مرحله نهایی پس از الصاق ویزای کار در پاسپورت؛ ورود به آلمان، اسکان، ثبت آدرس و ادغام کاری در سیستم رفاهی و بیمه‌ای آلمان.`;

    const arrivalSubtasks = [
      { id: "arr_1", textFa: "رزرو اقامتگاه موقت (Wohnung auf Zeit) در شهر مقصد و خرید بلیت پرواز", completed: false },
      { id: "arr_2", textFa: "ثبت آدرس رسمی در شهرداری محل سکونت (Anmeldung beim Bürgeramt) ظرف ۲ هفته اول", completed: false },
      { id: "arr_3", textFa: "افتتاح حساب بانکی جاری آلمانی (Girokonto) و دریافت شماره شناسایی مالیاتی (Steuer-ID)", completed: false },
      { id: "arr_4", textFa: "فعال‌سازی بیمه درمانی دولتی (Krankenkasse) و صدور کارت الکترونیک سلامت", completed: false },
      { id: "arr_5", textFa: "مراجعه به اداره اتباع خارجی (Ausländerbehörde) جهت دریافت کارت اقامت بلندمدت (Aufenthaltstitel)", completed: false }
    ];

    const langInterval = customIntervals.language || { start: 1, end: 8 };
    const degInterval = customIntervals.degree || { start: 2, end: 5 };
    const jobInterval = customIntervals.job_hunt || { start: 5, end: 9 };
    const visaInterval = customIntervals.visa || { start: 8, end: 11 };
    const arrInterval = customIntervals.arrival || { start: 11, end: 12 };

    return [
      {
        id: "language",
        stepNumber: 1,
        titleFa: "یادگیری و گواهی زبان آلمانی",
        titleDe: "Sprachkenntnisse (Deutsch B1/B2)",
        subtitleFa: `ارتقای هدفمند سطح زبان از ${currentGerman} به ${targetGerman}`,
        category: "language",
        icon: Languages,
        status: langStatus,
        progressPercent: langPercent,
        startMonth: langInterval.start,
        endMonth: langInterval.end,
        estimatedDurationFa: `${langInterval.end - langInterval.start + 1} ماه (ماه ${langInterval.start} تا ${langInterval.end})`,
        estimatedCostFa: "۳۰۰ تا ۸۰۰ یورو (دوره‌ها و آزمون رسمی)",
        targetTab: "interview",
        actionButtonLabelFa: "شبیه‌ساز مصاحبه و مهارت زبان",
        profileFeedbackFa: langFeedback,
        criticalTipsFa: [
          "آزمون‌های گوته و تلک تنها مدارک استاندارد و بدون مناقشه در سفارت آلمان هستند.",
          "یادگیری همزمان زبان تخصصی رشته، سرعت قبولی در مصاحبه‌های فنی را دوبرابر می‌کند.",
          "نیاز به توقف برای تکمیل زبان نیست؛ به موازات زبان، فرآیند معادل‌سازی مدرک را استارت بزنید."
        ],
        subtasks: langSubtasks
      },
      {
        id: "degree",
        stepNumber: 2,
        titleFa: "ارزشیابی و معادل‌سازی مدارک (ZAB)",
        titleDe: "Zeugnisbewertung & Anerkennung",
        subtitleFa: "اخذ تاییدیه تطبیق تحصیلی دانشگاهی و فنی در آلمان",
        category: "degree",
        icon: GraduationCap,
        status: degreeStatus,
        progressPercent: degreePercent,
        startMonth: degInterval.start,
        endMonth: degInterval.end,
        estimatedDurationFa: `${degInterval.end - degInterval.start + 1} ماه (ماه ${degInterval.start} تا ${degInterval.end})`,
        estimatedCostFa: "۲۰۰ یورو (تعرفه رسمی سازمان فدرال ZAB)",
        targetTab: "portals",
        actionButtonLabelFa: "پرتال‌های ارزشیابی و زاب",
        profileFeedbackFa: degreeFeedback,
        criticalTipsFa: [
          "تاییدیه ZAB امروزه به صورت دیجیتالی و سریع‌تر صادر می‌شود و نیازی به ارسال پستی اصل دانشنامه نیست.",
          "دانشگاه‌های دارای وضعیت H+ در پایگاه داده Anabin نیازی به معادل‌سازی طولانی ندارند و پرینت سامانه کفایت می‌کند.",
          "برای رشته‌های نظام‌مند (پزشکی، داروسازی، پرستاری) باید پرونده به مراجع استانی (Approbationsbehörde) ارجاع شود."
        ],
        subtasks: degreeSubtasks
      },
      {
        id: "job_hunt",
        stepNumber: 3,
        titleFa: "تدوین رزومه، لینکدین و کاریابی",
        titleDe: "Bewerbungsphase & Jobsuche",
        subtitleFa: "رزومه استاندارد آلمانی، مکاتبه با کارفرمایان و مصاحبه‌ها",
        category: "job_hunt",
        icon: Briefcase,
        status: jobStatus,
        progressPercent: jobPercent,
        startMonth: jobInterval.start,
        endMonth: jobInterval.end,
        estimatedDurationFa: `${jobInterval.end - jobInterval.start + 1} ماه (ماه ${jobInterval.start} تا ${jobInterval.end})`,
        estimatedCostFa: "رایگان (پرتال‌های کاریابی آلمان)",
        targetTab: "cv",
        actionButtonLabelFa: "رزومه‌ساز آلمانی DIN 5008",
        profileFeedbackFa: jobFeedback,
        criticalTipsFa: [
          "رزومه آلمانی باید عکس پرسنلی رسمی و مشخصات تماس استاندارد به سبک جدول‌بندی شده (Tabellarisch) داشته باشد.",
          "ارسال اپلیکیشن مستقیم در وب‌سایت شرکتی نرخ پاسخ بالاتری نسبت به پورتال‌های عمومی دارد.",
          "برای شرکت‌های متوسط (Mittelstand)، نامه‌نگاری به زبان آلمانی حتی با سطح B1 تا ۷۰٪ شانس دعوت را بالا می‌برد."
        ],
        subtasks: jobSubtasks
      },
      {
        id: "visa",
        stepNumber: 4,
        titleFa: "وقت کارگزاری سفارت و اخذ ویزا",
        titleDe: "Visumantrag & Botschaftstermin",
        subtitleFa: `ثبت پرونده ویزای ${targetRoute === "chancenkarte" ? "کارت فرصت" : "کاری نیروی متخصص"} در TLScontact`,
        category: "visa",
        icon: ShieldCheck,
        status: visaStatus,
        progressPercent: visaPercent,
        startMonth: visaInterval.start,
        endMonth: visaInterval.end,
        estimatedDurationFa: `${visaInterval.end - visaInterval.start + 1} ماه (ماه ${visaInterval.start} تا ${visaInterval.end})`,
        estimatedCostFa: "۷۵ یورو (کارمزد ویزای ملی تایپ D سفارت)",
        targetTab: "chancenkarte",
        actionButtonLabelFa: "بررسی امتیازات کارت فرصت",
        profileFeedbackFa: visaFeedback,
        criticalTipsFa: [
          "به محض اطمینان از پیشرفت زبان و معادل‌سازی، در لیست انتظار نوبت TLScontact ثبت‌نام کنید.",
          "در صورت داشتن جاب‌آفر قطعی، از کارفرما بخواهید روند ویزای تسریع‌شده (§ 81a) را در اداره اتباع شهر مقصد استارت بزند.",
          "حساب مسدود شده (Sperrkonto) برای کارت فرصت سال ۲۰۲۶ ماهانه ۱,۰۲۷ یورو الزامی است."
        ],
        subtasks: visaSubtasks
      },
      {
        id: "arrival",
        stepNumber: 5,
        titleFa: "ورود، ثبت آدرس و آغاز اشتغال",
        titleDe: "Ankunft, Anmeldung & Berufsstart",
        subtitleFa: "اسکان، ثبت در شهرداری، افتتاح حساب و صدور کارت اقامت",
        category: "arrival",
        icon: PlaneTakeoff,
        status: arrivalStatus,
        progressPercent: arrivalPercent,
        startMonth: arrInterval.start,
        endMonth: arrInterval.end,
        estimatedDurationFa: `${arrInterval.end - arrInterval.start + 1} ماه (ماه ${arrInterval.start} تا ${arrInterval.end})`,
        estimatedCostFa: "۲,۰۰۰ تا ۳,۵۰۰ یورو (ودیعه مسکن و هزینه‌های اولیه)",
        targetTab: "guide",
        actionButtonLabelFa: "راهنمای استقرار در آلمان",
        profileFeedbackFa: arrivalFeedback,
        criticalTipsFa: [
          "انجام آنملدونگ (Anmeldung) در شهرداری کلید تمامی مراحل بعدی نظیر افتتاح حساب بانکی و کارت مالیاتی است.",
          "بیمه درمانی دولتی (AOK, TK, Barmer) از روز اول ورود فعال بوده و کارفرما ۵۰٪ حق بیمه را پرداخت می‌کند.",
          "پس از ۲۱ ماه کار با بلوکارت (با زبان B1) یا ۲۷ ماه (با A1) می‌توانید درخواست اقامت دائم بدهید."
        ],
        subtasks: arrivalSubtasks
      }
    ];
  }, [currentGerman, targetGerman, currentDegree, currentExperience, targetRoute, customIntervals, profile]);

  // Overall readiness score calculation
  const overallReadinessScore = useMemo(() => {
    let completedCount = 0;
    let totalCount = 0;

    stages.forEach(stage => {
      stage.subtasks.forEach(task => {
        totalCount++;
        if (isTaskDone(task.id, task.completed)) {
          completedCount++;
        }
      });
    });

    if (totalCount === 0) return 40;
    const taskScore = Math.round((completedCount / totalCount) * 100);
    // Weighted blend between stage base progress and checklist tasks
    const stageAvg = Math.round(stages.reduce((acc, s) => acc + s.progressPercent, 0) / stages.length);
    return Math.round(taskScore * 0.6 + stageAvg * 0.4);
  }, [stages, customTaskState]);

  // Current active spotlight stage
  const currentActiveStage = useMemo(() => {
    return stages.find(s => s.id === selectedStageId) || stages[0];
  }, [stages, selectedStageId]);

  // Max timeline span in months
  const maxTimelineMonths = useMemo(() => {
    return Math.max(12, ...stages.map(s => s.endMonth));
  }, [stages]);

  // Format projected calendar month from start date + offset
  const getCalendarDateLabel = (monthOffset: number): string => {
    const targetDate = new Date(startYear, startMonthIndex + monthOffset - 1, 1);
    const persianMonthNames = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];
    // Approximation for Persian calendar month
    const gregorianMonth = targetDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const pMonth = persianMonthNames[(startMonthIndex + monthOffset - 1 + 2) % 12];
    return `${pMonth} (${gregorianMonth})`;
  };

  // PDF Export Handler
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setExportSuccessMessage("");
    try {
      const roadmapPlan = generateRuleBasedMonthlyRoadmap({
        applicantName: profile?.name || "متقاضی محترم",
        germanLevel: currentGerman,
        degree: currentDegree,
        field: profile?.field || "فناوری اطلاعات",
        experience: currentExperience,
        englishLevel: profile?.englishLevel || "B2",
        timelineMonths: maxTimelineMonths
      });

      await exportRoadmapToPdf({
        profile: {
          name: profile?.name || "متقاضی محترم",
          germanLevel: currentGerman,
          degree: currentDegree,
          field: profile?.field || "فناوری اطلاعات",
          experience: currentExperience,
          age: profile?.age || 30,
          englishLevel: profile?.englishLevel || "B2"
        },
        roadmapData: roadmapPlan as any,
        completedTasks: customTaskState
      }, `German_Immigration_Roadmap_${currentGerman}_to_${targetGerman}.pdf`);

      setExportSuccessMessage("فایل PDF نقشه راه تعاملی با موفقیت آماده و دانلود شد.");
      setTimeout(() => setExportSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Error exporting roadmap PDF:", err);
      // Fallback to window print
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`} id="migration-timeline-container">
      {/* Top Header Card: Level to Goal Navigator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>نقشه راه تعاملی مهاجرت کاری (Interactive Migration Roadmap 2026)</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              ترسیم مسیر مهاجرت از سطح فعلی تا استقرار در آلمان
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              این نقشه راه هوشمند بازه‌های زمانی کلیدی (یادگیری زبان، معادل‌سازی مدرک، کاریابی و سفارت) را به صورت بازه‌های موازی و منعطف شبیه‌سازی می‌کند. با تغییر سطح فعلی و سرعت مدنظرتان، تقویم اجرایی به‌طور خودکار به‌روزرسانی می‌شود.
            </p>
          </div>

          {/* Readiness Score KPI Gauge */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shrink-0 flex items-center gap-5 shadow-xl">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className="text-emerald-400"
                  strokeDasharray={`${overallReadinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${overallReadinessScore}, 100` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-white font-mono leading-none">
                  {overallReadinessScore}٪
                </span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">شاخص پیشرفت</span>
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <span className="text-[11px] text-slate-400 font-medium">وضعیت پرونده:</span>
              <div className="text-sm font-black text-emerald-300">
                {overallReadinessScore >= 80 ? "آمادگی عالی برای قرارداد و ویزا" : overallReadinessScore >= 55 ? "پیشرفت بسیار مطلوب در مدارک" : "در حال تکمیل مدارک پایه و زبان"}
              </div>
              <div className="text-[11px] text-slate-400">
                طول دوره کل: <strong className="text-white font-bold">{maxTimelineMonths} ماه</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Level to Goal Interactive Customizer Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Current German Level */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
              <span>سطح فعلی زبان آلمانی:</span>
              <span className="text-emerald-400 font-mono text-xs">{currentGerman}</span>
            </label>
            <select
              value={currentGerman}
              onChange={(e) => setCurrentGerman(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="A0">مبتدی / بدون آشنایی قبلی (A0)</option>
              <option value="A1">سطح مقدماتی (A1)</option>
              <option value="A2">سطح اولیه پیشرفته (A2)</option>
              <option value="B1">متوسط کاری / کارت فرصت (B1)</option>
              <option value="B2">پیشرفته و استاندارد بازار کار (B2)</option>
              <option value="C1">تسلط حرفه‌ای و بالینی (C1)</option>
            </select>
          </div>

          {/* 2. Target German Level */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
              <span>سطح زبان هدف:</span>
              <span className="text-indigo-400 font-mono text-xs">{targetGerman}</span>
            </label>
            <select
              value={targetGerman}
              onChange={(e) => setTargetGerman(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="B1">سطح B1 (حداقل کارت فرصت)</option>
              <option value="B2">سطح B2 (استاندارد استخدام و مصاحبه)</option>
              <option value="C1">سطح C1 (مدیریتی و پزشکی)</option>
            </select>
          </div>

          {/* 3. Degree Status */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-slate-400">مدرک تحصیلی:</label>
            <select
              value={currentDegree}
              onChange={(e) => setCurrentDegree(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="diploma">دیپلم یا دوره فنی‌وحرفه‌ای</option>
              <option value="associate">کاردانی (فوق دیپلم)</option>
              <option value="bachelor">کارشناسی لیسانس (Anabin H+)</option>
              <option value="master">کارشناسی ارشد (Master)</option>
              <option value="phd">دکتری تخصصی (PhD)</option>
            </select>
          </div>

          {/* 4. Target Migration Route */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-slate-400">مسیر هدف ویزا:</label>
            <select
              value={targetRoute}
              onChange={(e) => setTargetRoute(e.target.value as TargetVisaRoute)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="chancenkarte">کارت فرصت آلمان (§ 20a Chancenkarte)</option>
              <option value="blue_card">بلوکارت اروپا (§ 18g EU Blue Card)</option>
              <option value="fachkraft">ویزای نیروی متخصص با قرارداد (§ 18b)</option>
              <option value="anerkennungspartnerschaft">مشارکت در معادل‌سازی مدرک (§ 16d)</option>
            </select>
          </div>
        </div>

        {/* Pacing Speed & View Mode Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          {/* Pacing Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>سرعت و بازه زمانی:</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPaceMode("fast")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  paceMode === "fast"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                فشرده (۷-۸ ماه)
              </button>
              <button
                onClick={() => setPaceMode("standard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  paceMode === "standard"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                استاندارد (۱۲ ماه)
              </button>
              <button
                onClick={() => setPaceMode("relaxed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  paceMode === "relaxed"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                منعطف (۱۸ ماه)
              </button>
            </div>
          </div>

          {/* View Selector & Export Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewLayout("gantt")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewLayout === "gantt"
                    ? "bg-indigo-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>نمودار بازه‌های زمانی (Gantt)</span>
              </button>
              <button
                onClick={() => setViewLayout("flow")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewLayout === "flow"
                    ? "bg-indigo-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>نمای مرحله‌ای (Flow)</span>
              </button>
              <button
                onClick={() => setViewLayout("cards")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewLayout === "cards"
                    ? "bg-indigo-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>کارت‌ها (Cards)</span>
              </button>
            </div>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-slate-700 shadow-sm"
              title="خروجی PDF کامل نقشه راه مهاجرت"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isExportingPdf ? "در حال تولید PDF..." : "خروجی PDF"}</span>
            </button>
          </div>
        </div>

        {exportSuccessMessage && (
          <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 text-right flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* GANTT INTERVAL CHART VIEW: Flexible Time Intervals */}
      {viewLayout === "gantt" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="text-right space-y-1">
              <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>نمودار بازه‌های زمانی منعطف و موازی (Flexible Interval Timeline)</span>
              </h3>
              <p className="text-xs text-slate-400">
                برنامه‌ریزی هوشمند نشان می‌دهد که معادل‌سازی مدرک در ZAB می‌تواند دقیقاً همزمان با یادگیری زبان اجرا شود تا حداقل ۴ تا ۶ ماه در زمان شما صرفه‌جویی گردد.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">شروع فرآیند:</span>
              <strong className="text-white font-mono">{getCalendarDateLabel(1)}</strong>
            </div>
          </div>

          {/* Gantt Chart Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[760px] space-y-4">
              {/* Month Header Axis */}
              <div className="grid grid-cols-12 gap-1 text-center border-b border-slate-800/80 pb-2">
                <div className="col-span-3 text-right text-xs font-bold text-slate-400 pr-2">
                  عنوان گام و مسیر اجرایی
                </div>
                <div className="col-span-9 grid grid-cols-12 gap-1 text-[11px] font-mono text-slate-400">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const monthNum = Math.round(((i + 1) / 12) * maxTimelineMonths);
                    return (
                      <div key={i} className="text-center">
                        <span className="block font-bold text-slate-300">ماه {monthNum}</span>
                        <span className="block text-[9px] text-slate-400 truncate">{getCalendarDateLabel(monthNum).split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracks Rows */}
              {stages.map((stage) => {
                const IconComponent = stage.icon;
                const isSelected = stage.id === selectedStageId;
                const doneCount = stage.subtasks.filter(t => isTaskDone(t.id, t.completed)).length;
                const totalCount = stage.subtasks.length;

                // Calculate percentage positions across the total timeline span
                const leftPercent = ((stage.startMonth - 1) / maxTimelineMonths) * 100;
                const widthPercent = Math.max(10, ((stage.endMonth - stage.startMonth + 1) / maxTimelineMonths) * 100);

                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-950/90 border-indigo-500/50 ring-1 ring-indigo-500/30"
                        : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    {/* Track Title Column */}
                    <div className="col-span-3 flex items-center gap-2.5 text-right pr-1">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        stage.status === "completed"
                          ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/40"
                          : stage.status === "in_progress"
                          ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="block text-xs font-bold text-white truncate">
                          {stage.titleFa}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {doneCount} از {totalCount} اقدام ({stage.estimatedDurationFa})
                        </span>
                      </div>
                    </div>

                    {/* Gantt Bar Column */}
                    <div className="col-span-9 relative h-10 bg-slate-900/80 rounded-xl overflow-hidden border border-slate-800 flex items-center px-1">
                      {/* Grid background markers */}
                      <div className="absolute inset-0 grid grid-cols-12 pointer-events-none divide-x divide-slate-800/40 divide-dashed" />

                      {/* Interactive Interval Bar */}
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{
                          right: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          position: "absolute"
                        }}
                        className={`h-7 rounded-lg flex items-center justify-between px-2.5 text-xs font-bold shadow-md transition-all cursor-pointer ${
                          stage.id === "language"
                            ? "bg-gradient-to-l from-indigo-600 to-indigo-800 text-white border border-indigo-400/40"
                            : stage.id === "degree"
                            ? "bg-gradient-to-l from-amber-600 to-amber-700 text-white border border-amber-400/40"
                            : stage.id === "job_hunt"
                            ? "bg-gradient-to-l from-teal-600 to-emerald-700 text-white border border-teal-400/40"
                            : stage.id === "visa"
                            ? "bg-gradient-to-l from-purple-600 to-purple-800 text-white border border-purple-400/40"
                            : "bg-gradient-to-l from-emerald-600 to-green-700 text-white border border-emerald-400/40"
                        }`}
                      >
                        <span className="truncate text-[11px] font-black">
                          {stage.titleFa}
                        </span>
                        <span className="text-[10px] font-mono opacity-90 shrink-0">
                          ماه {stage.startMonth} تا {stage.endMonth}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Duration Customizer Sliders for Active Stage */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-right">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>تنظیم دستی بازه زمانی گام انتخابی: <strong className="text-white">{currentActiveStage.titleFa}</strong></span>
              </span>
              <p className="text-[11px] text-slate-400">
                می‌توانید شروع و پایان هر مرحله را مطابق شرایط کاری و تحصیلی خود به جلو یا عقب منتقل کنید.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">شروع از ماه:</span>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, currentActiveStage.endMonth)}
                  value={currentActiveStage.startMonth}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value) || 1);
                    setCustomIntervals(prev => ({
                      ...prev,
                      [currentActiveStage.category]: {
                        start: val,
                        end: Math.max(val, currentActiveStage.endMonth)
                      }
                    }));
                  }}
                  className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">تا پایان ماه:</span>
                <input
                  type="number"
                  min={currentActiveStage.startMonth}
                  max={24}
                  value={currentActiveStage.endMonth}
                  onChange={(e) => {
                    const val = Math.max(currentActiveStage.startMonth, Number(e.target.value) || currentActiveStage.startMonth);
                    setCustomIntervals(prev => ({
                      ...prev,
                      [currentActiveStage.category]: {
                        start: currentActiveStage.startMonth,
                        end: val
                      }
                    }));
                  }}
                  className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HORIZONTAL STEPPER (Used in Flow & Gantt) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-xl overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="flex items-center justify-between relative">
            {/* Background connecting bar */}
            <div className="absolute top-1/2 -translate-y-1/2 right-6 left-6 h-1 bg-slate-800 rounded-full z-0" />
            
            {/* Active connecting highlight */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 right-6 h-1 bg-gradient-to-l from-emerald-500 via-indigo-500 to-indigo-600 rounded-full z-0"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.max(10, Math.min(100, (stages.findIndex(s => s.id === selectedStageId) / (stages.length - 1)) * 100))}%` 
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {stages.map((stage) => {
              const isSelected = stage.id === selectedStageId;
              const isCompleted = stage.status === "completed";
              const isInProgress = stage.status === "in_progress";
              const IconComponent = stage.icon;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className="flex flex-col items-center relative z-10 cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-lg ${
                      isSelected
                        ? "bg-gradient-to-br from-indigo-500 to-emerald-500 text-white ring-4 ring-indigo-500/30 shadow-indigo-500/30"
                        : isCompleted
                        ? "bg-emerald-600 text-white border-2 border-emerald-400/50 shadow-emerald-600/20"
                        : isInProgress
                        ? "bg-slate-900 border-2 border-indigo-400 text-indigo-300 ring-2 ring-indigo-500/20 shadow-indigo-500/10"
                        : "bg-slate-950 border border-slate-800 text-slate-500 hover:border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : isInProgress ? (
                      <div className="relative flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-indigo-300" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </motion.div>

                  <div className="mt-2.5 text-center">
                    <span className={`block text-xs font-black transition-colors ${
                      isSelected
                        ? "text-white"
                        : isCompleted
                        ? "text-emerald-400"
                        : isInProgress
                        ? "text-indigo-300"
                        : "text-slate-400 group-hover:text-slate-300"
                    }`}>
                      گام {stage.stepNumber}: {stage.titleFa}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                      ماه {stage.startMonth} تا {stage.endMonth}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Stage Detailed Spotlight */}
      <AnimatePresence mode="wait">
        {(viewLayout === "flow" || viewLayout === "gantt") && (
          <motion.div
            key={currentActiveStage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.28 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Top Stage Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  currentActiveStage.status === "completed"
                    ? "bg-emerald-600 text-white shadow-emerald-600/25"
                    : currentActiveStage.status === "in_progress"
                    ? "bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-indigo-600/25"
                    : "bg-slate-800 text-slate-400"
                }`}>
                  {React.createElement(currentActiveStage.icon, { className: "w-7 h-7" })}
                </div>

                <div className="space-y-1 text-right">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                      مرحله {currentActiveStage.stepNumber} از {stages.length}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      currentActiveStage.status === "completed"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : currentActiveStage.status === "in_progress"
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                        : "bg-slate-800/80 border-slate-700 text-slate-400"
                    }`}>
                      {currentActiveStage.status === "completed" ? "تکمیل شده / آماده" : currentActiveStage.status === "in_progress" ? "در حال انجام و پیشروی" : "مرحله آتی"}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white">
                    {currentActiveStage.titleFa}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {currentActiveStage.titleDe}
                  </p>
                </div>
              </div>

              {/* Action Button & Duration */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-right text-xs space-y-0.5">
                  <div className="text-slate-400 text-[10px]">بازه و زمان تخمینی:</div>
                  <div className="text-white font-bold">{currentActiveStage.estimatedDurationFa}</div>
                  <div className="text-emerald-400 text-[10px] font-mono">
                    تاریخ پایان: {getCalendarDateLabel(currentActiveStage.endMonth)}
                  </div>
                </div>

                {currentActiveStage.targetTab && onTabChange && (
                  <button
                    onClick={() => onTabChange(currentActiveStage.targetTab!)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
                  >
                    <span>{currentActiveStage.actionButtonLabelFa}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Progress Bar for this stage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">درصد تکمیل این مرحله:</span>
                <span className="text-emerald-400 font-mono text-sm">{currentActiveStage.progressPercent}٪</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-l from-emerald-500 to-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentActiveStage.progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Personalized Profile Diagnosis Feedback Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/25 space-y-1.5 text-right">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span>تحلیل وضعیت متقاضی در این مرحله بر اساس داده‌های ورودی:</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                {currentActiveStage.profileFeedbackFa}
              </p>
            </div>

            {/* Interactive Subtask Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs md:text-sm font-black text-white flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>چک‌لیست تعاملی اقدامات کلیدی این گام (تیک زدن موارد تکمیل‌شده):</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  ذخیره‌سازی زنده در مرورگر
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {currentActiveStage.subtasks.map((task) => {
                  const done = isTaskDone(task.id, task.completed);
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleSubtask(task.id, task.completed)}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition cursor-pointer select-none ${
                        done
                          ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 text-emerald-400">
                        {done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      <span className={`leading-relaxed text-right ${done ? "line-through text-slate-400" : ""}`}>
                        {task.textFa}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Critical Advice from German Experts */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>نکات حقوقی و تجربیات کارشناسی اداره کار و سفارت:</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-slate-300">
                {currentActiveStage.criticalTipsFa.map((tip, idx) => (
                  <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed text-right flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARDS VIEW: All Stages Overview */}
      {viewLayout === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stages.map((stage) => {
            const isCompleted = stage.status === "completed";
            const isInProgress = stage.status === "in_progress";
            const IconComponent = stage.icon;

            return (
              <motion.div
                key={stage.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-xl ${
                  isCompleted
                    ? "border-emerald-500/30 hover:border-emerald-400/50"
                    : isInProgress
                    ? "border-indigo-500/40 hover:border-indigo-400/60 ring-1 ring-indigo-500/10"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isInProgress
                          ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block">گام {stage.stepNumber}</span>
                        <h4 className="text-sm font-black text-white">{stage.titleFa}</h4>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : isInProgress
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}>
                      {isCompleted ? "تکمیل" : isInProgress ? "درحال اقدام" : "آتی"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed text-right font-medium">
                    {stage.subtitleFa}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>پیشرفت گام</span>
                      <span className="font-mono text-white">{stage.progressPercent}٪</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-l from-emerald-500 to-indigo-600 rounded-full"
                        style={{ width: `${stage.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Subtask count */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>اقدامات انجام‌شده:</span>
                    <strong className="text-white font-mono">
                      {stage.subtasks.filter(t => isTaskDone(t.id, t.completed)).length} از {stage.subtasks.length}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    ماه {stage.startMonth} تا {stage.endMonth}
                  </span>
                  {stage.targetTab && onTabChange && (
                    <button
                      onClick={() => onTabChange(stage.targetTab!)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>اقدام</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MigrationTimeline;
