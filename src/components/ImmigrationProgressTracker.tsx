import React, { useState, useEffect, useMemo } from "react";
import { 
  Award, 
  GraduationCap, 
  FileText, 
  Globe, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Home, 
  CheckCircle2, 
  Clock, 
  Circle, 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  RefreshCw, 
  CheckSquare, 
  Square, 
  Download, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  FolderOpen, 
  FileCheck, 
  AlertCircle, 
  ExternalLink, 
  Check, 
  RotateCcw, 
  Info,
  Send,
  Building2,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchWithRetry, formatPrintDocumentTitle } from "../utils";

export type MilestoneStatus = "pending" | "in_progress" | "completed";

export interface RoadmapMilestone {
  id: string;
  stepNumber: number;
  title: string;
  englishTitle: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  estimatedDuration: string;
  estimatedCost: string;
  authority: string;
  authorityDe: string;
  icon: any;
  targetTab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs";
  actionLabel: string;
  tips: string[];
  subtasks: { id: string; text: string }[];
}

interface Profile {
  name: string;
  age: number;
  degree: string;
  experience: number;
  field: string;
  germanLevel: string;
  englishLevel: string;
}

interface ImmigrationProgressTrackerProps {
  profile?: Profile | null;
  onTabChange?: (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs") => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  category: "both" | "chancenkarte" | "jobseeker";
  description: string;
}

const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: "degree_recognition",
    stepNumber: 1,
    title: "تایید و ارزشیابی مدارک تحصیلی",
    englishTitle: "Degree Recognition (Anabin / ZAB)",
    shortTitle: "ارزشیابی مدارک",
    subtitle: "بررسی هم‌ارزی دانشگاه و رشته در پایگاه آنابین و اخذ گواهی معادل‌سازی رسمی ZAB",
    description: "برای دریافت هرگونه ویزای کاری، بلوکارت (§18g) یا کارت فرصت (§20a/b)، مدارک دانشگاهی و ریزنمرات شما باید در سیستم آموزش عالی آلمان معادل‌سازی شوند. وضعیت دانشگاه باید H+ و رشته تحصیلی هم‌تراز باشد.",
    estimatedDuration: "۲ تا ۶ هفته",
    estimatedCost: "۲۰۰ یورو (در صورت نیاز به ZAB)",
    authority: "اداره مرکزی آموزش خارجی آلمان (ZAB)",
    authorityDe: "Zentralstelle für ausländisches Bildungswesen (ZAB)",
    icon: GraduationCap,
    targetTab: "portals",
    actionLabel: "بررسی دیتابیس آنابین و ZAB",
    tips: [
      "ابتدا در پایگاه Anabin بررسی کنید؛ اگر دانشگاه و رشته شما هر دو کلاس H+ دارند، نیازی به پرداخت هزینه ۲۰۰ یورویی ZAB نیست و پرینت آنابین کفایت می‌کند.",
      "در صورت عدم تطابق دقیق عنوان رشته با آلمان، باید بلافاصله فرم آنلاین ZAB را پر کرده و گواهی Statement of Comparability دریافت کنید.",
      "اصل دانشنامه و ریزنمرات باید به آلمانی یا انگلیسی ترجمه رسمی شده و تاییدیه دادگستری و وزارت امور خارجه را داشته باشند."
    ],
    subtasks: [
      { id: "anabin_check", text: "استعلام وضعیت کلاس H+ دانشگاه و رشته در پایگاه داده Anabin" },
      { id: "transcripts_translation", text: "ترجمه رسمی دانشنامه و ریزنمرات دانشگاهی با مهرهای دادگستری و خارجه" },
      { id: "zab_submission", text: "ثبت درخواست ارزشیابی ZAB (Statement of Comparability) در صورت نیاز" },
      { id: "recognition_archive", text: "دریافت و بایگانی الکترونیکی تاییدیه رسمی معادل‌سازی مدرک" }
    ]
  },
  {
    id: "language_and_cv",
    stepNumber: 2,
    title: "مدرک زبان و تدوین رزومه استاندارد آلمانی",
    englishTitle: "Language Mastery & German CV (Lebenslauf)",
    shortTitle: "زبان و رزومه",
    subtitle: "آماده‌سازی رزومه جدولی منطبق بر استانداردهای ATS آلمان و کسب مدرک معتبر زبان",
    description: "رزومه‌های آلمانی دارای ساختار مشخصی (Tabellarischer Lebenslauf) با عکس رسمی، توالی زمانی معکوس و تمرکز بر دستاوردهای عملیاتی هستند. تسلط به زبان انگلیسی C1 یا آلمانی B1/B2 مزیت رقابتی جذب در شرکت‌هاست.",
    estimatedDuration: "۱ تا ۳ ماه",
    estimatedCost: "هزینه آزمون رسمی (گوته / تلوک / آیلتس)",
    authority: "موسسات گوته، تلوک و استانداردهای شغلی فدرال",
    authorityDe: "Goethe-Institut / telc / DIN 5008",
    icon: FileText,
    targetTab: "cv",
    actionLabel: "ساخت رزومه آلمانی استاندارد",
    tips: [
      "برای موقعیت‌های فنی مهندسی و نرم‌افزار، زبان انگلیسی C1 امکان کاریابی مستقیم بین‌المللی با حقوق کامل را فراهم می‌سازد.",
      "در رزومه آلمانی از واژگان تخصصی و سیستم STAR برای توصیف مسئولیت‌ها و دستاوردهای کمّی پروژه‌ها استفاده کنید.",
      "برای هر پوزیشن شغلی، انگیزه‌نامه اختصاصی (Anschreiben) با تمرکز بر دلایل علاقه به آن شرکت تدوین نمایید."
    ],
    subtasks: [
      { id: "cv_build", text: "تدوین رزومه استاندارد جدولی آلمانی (Tabellarischer Lebenslauf) با عکس پرسنلی" },
      { id: "motivation_letter", text: "نگارش تمپلیت استاندارد انگیزه‌نامه حرفه‌ای (Anschreiben / Motivation Letter)" },
      { id: "language_exam", text: "شرکت در آزمون زبان رسمی (آلمانی B1/B2 یا انگلیسی C1/IELTS 7+)" },
      { id: "profiles_update", text: "بهینه‌سازی کامل پروفایل‌های حرفه‌ای در LinkedIn و پورتال XING آلمان" }
    ]
  },
  {
    id: "job_hunt",
    stepNumber: 3,
    title: "کاریابی هوشمند، مصاحبه‌ها و جاب‌آفر",
    englishTitle: "Job Search & Employer Contract (Job Offer)",
    shortTitle: "کاریابی و جاب‌آفر",
    subtitle: "ارسال اپلیکیشن‌های هدفمند، مصاحبه‌های فنی و عقد قرارداد کاری دارای اسپانسرشیپ ویزا",
    description: "یافتن کارفرمای آلمانی که حاضر به ارائه قرارداد رسمی کار (Arbeitsvertrag) با شرایط ویزای نیروی متخصص یا بلوکارت باشد. تسلط بر مهارت‌های مصاحبه آنلاین و پیگیری حرفه‌ای در این مرحله تعیین‌کننده است.",
    estimatedDuration: "۲ تا ۴ ماه",
    estimatedCost: "رایگان (خدمات کاریابی)",
    authority: "اداره کار فدرال آلمان و پورتال‌های استخدامی",
    authorityDe: "Bundesagentur für Arbeit / StepStone / LinkedIn",
    icon: Briefcase,
    targetTab: "jobs",
    actionLabel: "جستجوی پوزیشن‌های ویزا اسپانسرشیپ",
    tips: [
      "در پورتال‌های StepStone و LinkedIn شرکت‌هایی که سابقه استخدام نیروی بین‌المللی دارند را هدف قرار دهید.",
      "در مصاحبه‌های اولیه حتماً اشاره کنید که مدارک تحصیلی شما در آنابین H+ است و نیازی به معادل‌سازی طولانی ندارد.",
      "از ابزارهای یابنده مشاغل اسپانسرشیپ در سامانه برای فیلتر کردن موقعیت‌های مناسب متقاضیان ایرانی استفاده کنید."
    ],
    subtasks: [
      { id: "daily_applications", text: "ارسال روزانه و هدفمند رزومه برای موقعیت‌های شغلی متناسب در StepStone و پورتال‌ها" },
      { id: "interview_prep", text: "آمادگی برای سوالات تخصصی و فرهنگی مصاحبه با کارفرمایان آلمانی" },
      { id: "technical_interviews", text: "حضور در جلسات ارزیابی و مصاحبه‌های فنی آنلاین (Online Assessments)" },
      { id: "job_offer_receipt", text: "دریافت پیشنهاد رسمی کار (Job Offer / پیش‌نویس قرارداد Arbeitsvertrag)" }
    ]
  },
  {
    id: "contract_and_zav",
    stepNumber: 4,
    title: "نهایی‌سازی قرارداد و تاییدیه اداره کار فدرال (ZAV)",
    englishTitle: "Employment Contract & ZAV Pre-Approval",
    shortTitle: "قرارداد و تاییدیه ZAV",
    subtitle: "بررسی کفایت حقوق ناخالص بر اساس آستانه بلوکارت ۲۰۲۶ و اخذ موافقت اولیه اداره کار",
    description: "قرارداد کاری باید دارای حداقل حقوق ناخالص سالانه استاندارد (۴۱,۰۰۰ یورو برای مشاغل کمبود نظیر مهندسی و آی‌تی / ۴۵,۳۰۰ یورو برای سایر رشته‌ها) باشد. کارفرما فرم‌های استخدامی را تکمیل و به تایید اداره کار می‌رساند.",
    estimatedDuration: "۲ تا ۴ هفته",
    estimatedCost: "۴۱۱ یورو برای تسریع کارفرما (اختیاری)",
    authority: "اداره مرکزی و بین‌المللی کار آلمان (ZAV)",
    authorityDe: "Zentrale Auslands- und Fachvermittlung (ZAV)",
    icon: FileCheck,
    targetTab: "dashboard",
    actionLabel: "ارزیابی شانس و آستانه حقوق",
    tips: [
      "از کارفرما بخواهید فرم رسمی Erklärung zum Beschäftigungsverhältnis را تکمیل و امضا نماید.",
      "کارفرما می‌تواند با استناد به ماده §81a قانون اقامت، فرآیند تسریع‌شده نیروی متخصص (Fast-Track) را در آلمان آغاز کند.",
      "دریافت تاییدیه اولیه ZAV (Vorabzustimmung) مدت زمان انتظار در سفارت را به حداقل می‌رساند."
    ],
    subtasks: [
      { id: "salary_audit", text: "بررسی کفایت حقوق ناخالص سالانه (Brutto) طبق بخشنامه بلوکارت ۲۰۲۶" },
      { id: "employment_declaration", text: "تکمیل و امضای فرم رسمی استخدام توسط کارفرمای آلمانی" },
      { id: "fast_track_check", text: "بررسی امکان فعال‌سازی فرآیند ویزای سریع (§81a Beschleunigtes Verfahren)" },
      { id: "zav_preapproval", text: "اخذ تاییدیه اولیه اداره کار فدرال (Vorabzustimmung der ZAV)" }
    ]
  },
  {
    id: "visa_and_embassy",
    stepNumber: 5,
    title: "فرآیند ویزا، رزرو سفارت و ثبت بیومتریک",
    englishTitle: "Visa Application & Embassy Appointment",
    shortTitle: "ویزا و سفارت",
    subtitle: "رزرو وقت کارگزاری رسمی TLScontact، تکمیل مدارک و دریافت ویزای ورود ملی آلمان (D-Visa)",
    description: "پس از نهایی شدن قرارداد کاری یا مدارک کارت فرصت، وقت مصاحبه در کارگزاری رسمی سفارت آلمان (TLScontact در تهران) رزرو شده و پرونده کامل جهت صدور ویزای ورود ملی نوع D ارائه می‌گردد.",
    estimatedDuration: "۱ تا ۳ ماه",
    estimatedCost: "۷۵ یورو هزینه ویزا + هزینه کارگزاری",
    authority: "سفارت آلمان در تهران و کارگزاری رسمی TLScontact",
    authorityDe: "Deutsche Botschaft Teheran / TLScontact",
    icon: Calendar,
    targetTab: "chancenkarte",
    actionLabel: "بررسی چک‌لیست ویزا و مدارک",
    tips: [
      "پرونده ویزای بلوکارت و نیروی متخصص دارای وقت‌های سفارت سریع‌تری نسبت به ویزاهای عادی هستند.",
      "تمامی مدارک باید بر اساس چیدمان اعلامی در چک‌لیست رسمی سفارت مرتب و آماده تحویل باشند.",
      "بیمه مسافرتی معتبر ورودی (Incoming-Versicherung) با حداقل سقف پوشش ۳۰ هزار یورو الزامی است."
    ],
    subtasks: [
      { id: "tls_booking", text: "رزرو وقت مصاحبه و ثبت بیومتریک در سامانه کارگزاری TLScontact" },
      { id: "dossier_assembly", text: "جمع‌آوری، پرینت ۲ نسخه و مرتب‌سازی دقیق کل پرونده طبق چک‌لیست سفارت" },
      { id: "health_insurance", text: "تهیه بیمه مسافرتی معتبر ورودی آلمان (Incoming Insurance حداقل ۶ ماهه)" },
      { id: "visa_stamp", text: "حضور در وقت کارگزاری، تحویل مدارک و دریافت ویزای ورود نوع D" }
    ]
  },
  {
    id: "relocation_residence",
    stepNumber: 6,
    title: "ورود به آلمان، ثبت شهرداری و کارت اقامت",
    englishTitle: "Relocation, Registration & Residence Card",
    shortTitle: "ورود و اقامت",
    subtitle: "ورود به آلمان، ثبت نشانی سکونت (Anmeldung)، دریافت شماره مالیاتی و دریافت کارت اقامت",
    description: "پس از فرود در آلمان، اقدامات اداری اساسی شامل ثبت آدرس در شهرداری محلی (Bürgeramt)، افتتاح حساب بانکی، فعال‌سازی بیمه درمانی و مراجعه به اداره اتباع خارجی جهت دریافت کارت فیزیکی اقامت (eAT) انجام می‌شود.",
    estimatedDuration: "ماه اول ورود",
    estimatedCost: "هزینه صدور کارت اقامت (حدود ۱۰۰ یورو)",
    authority: "شهرداری محلی و اداره اتباع خارجی آلمان",
    authorityDe: "Bürgeramt / Ausländerbehörde",
    icon: Home,
    targetTab: "portals",
    actionLabel: "مشاهده راهنمای ورود و زندگی در آلمان",
    tips: [
      "حداکثر ظرف مدت ۱۴ روز پس از ورود، باید ثبت محل سکونت (Anmeldung) در شهرداری انجام شود.",
      "با داشتن برگه ثبت شهرداری، شماره مالیاتی (Steuer-ID) صادر شده و امکان افتتاح حساب بانکی رسمی فراهم می‌شود.",
      "دارندگان بلوکارت پس از ۲۱ یا ۲۷ ماه اشتغال مداوم، واجد شرایط اخذ اقامت دائم مادام‌العمر آلمان (Niederlassungserlaubnis) خواهند بود."
    ],
    subtasks: [
      { id: "anmeldung", text: "ثبت نشانی رسمی سکونت در شهرداری محلی شهر مقصد (Anmeldung)" },
      { id: "bank_and_tax", text: "افتتاح حساب بانکی جاری (Girokonto) و دریافت شناسه مالیاتی (Steuer-ID)" },
      { id: "krankenkasse_activation", text: "فعال‌سازی بیمه درمانی رسمی دولتی یا خصوصی آلمان (Krankenkasse)" },
      { id: "residence_permit_card", text: "حضور در اداره اتباع خارجی (Ausländerbehörde) و دریافت کارت فیزیکی بلوکارت (eAT)" }
    ]
  }
];

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "passport",
    title: "گذرنامه معتبر (Passport)",
    category: "both",
    description: "دارای حداقل ۱۲ ماه اعتبار و ۲ صفحه خالی همراه با کپی از صفحات مشخصات"
  },
  {
    id: "cv_german",
    title: "رزومه استاندارد آلمانی (Lebenslauf)",
    category: "both",
    description: "رزومه جدولی و انگیزه‌نامه (Motivation Letter) مکتوب به زبان آلمانی یا انگلیسی"
  },
  {
    id: "degree_recognition",
    title: "تاییدیه مدرک تحصیلی (Anabin / ZAB)",
    category: "both",
    description: "پرینت هم‌ارزی کلاس H+ از آنابین یا گواهی معادل‌سازی رسمی ZAB"
  },
  {
    id: "language_cert",
    title: "مدرک زبان رسمی (Language Certificate)",
    category: "both",
    description: "مدرک آلمانی (حداقل A1 برای کارت فرصت) یا انگلیسی (حداقل B2 آیلتس/تافل/C1)"
  },
  {
    id: "proof_of_funds",
    title: "گواهی تمکن مالی (Proof of Funds)",
    category: "both",
    description: "حساب مسدود شده (Sperrkonto) یا تعهدنامه رسمی Verpflichtungserklärung"
  },
  {
    id: "experience_proof",
    title: "سوابق کار و بیمه (Work Experience Proof)",
    category: "chancenkarte",
    description: "گواهی کار رسمی به همراه سابقه بیمه تامین اجتماعی ترجمه شده جهت اثبات امتیاز سابقه کار"
  },
  {
    id: "insurance",
    title: "بیمه مسافرتی/سلامت آلمان (Health Insurance)",
    category: "jobseeker",
    description: "بیمه مسافرتی معتبر ۳ الی ۶ ماهه آلمانی با پوشش درمان حداقل ۳۰ هزار یورو"
  },
  {
    id: "accommodation",
    title: "تاییدیه اسکان در آلمان (Accommodation Proof)",
    category: "jobseeker",
    description: "رزرو هتل، هاستل یا دعوت‌نامه معتبر نشان‌دهنده محل اقامت شما در آلمان"
  }
];

export default function ImmigrationProgressTracker({ profile, onTabChange }: ImmigrationProgressTrackerProps) {
  const [activeTrackerTab, setActiveTrackerTab] = useState<"milestones" | "documents">("milestones");
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>("degree_recognition");
  const [isDownloading, setIsDownloading] = useState(false);
  const [checklistFilter, setChecklistFilter] = useState<"all" | "chancenkarte" | "jobseeker">("all");

  // Persistent Milestone Status Map (pending | in_progress | completed)
  const [milestoneStatuses, setMilestoneStatuses] = useState<Record<string, MilestoneStatus>>(() => {
    try {
      const saved = localStorage.getItem("germany_immigration_milestones_status");
      if (saved) return JSON.parse(saved);

      // Fallback backwards compatibility with boolean checked steps
      const oldSaved = localStorage.getItem("germany_immigration_completed_steps");
      if (oldSaved) {
        const oldParsed = JSON.parse(oldSaved);
        const migrated: Record<string, MilestoneStatus> = {};
        ROADMAP_MILESTONES.forEach(m => {
          migrated[m.id] = oldParsed[m.id] ? "completed" : "pending";
        });
        return migrated;
      }
    } catch (e) {
      console.error("Error loading milestone statuses:", e);
    }
    return {
      degree_recognition: "in_progress",
      language_and_cv: "pending",
      job_hunt: "pending",
      contract_and_zav: "pending",
      visa_and_embassy: "pending",
      relocation_residence: "pending"
    };
  });

  // Persistent Subtask Checkbox Map
  const [checkedSubtasks, setCheckedSubtasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("germany_immigration_milestone_subtasks");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading subtasks:", e);
    }
    return {};
  });

  // Document preparation checklist state (persistent)
  const [documentChecklist, setDocumentChecklist] = useState<Record<string, { collected: boolean; notarized: boolean; translated: boolean }>>(() => {
    try {
      const saved = localStorage.getItem("germany_immigration_document_checklist");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading document checklist:", e);
    }
    const initial: Record<string, { collected: boolean; notarized: boolean; translated: boolean }> = {};
    CHECKLIST_ITEMS.forEach(item => {
      initial[item.id] = { collected: false, notarized: false, translated: false };
    });
    return initial;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("germany_immigration_milestones_status", JSON.stringify(milestoneStatuses));
      // Keep legacy key in sync for backward compatibility
      const legacyMap: Record<string, boolean> = {};
      Object.entries(milestoneStatuses).forEach(([k, v]) => {
        legacyMap[k] = v === "completed";
      });
      localStorage.setItem("germany_immigration_completed_steps", JSON.stringify(legacyMap));
    } catch (e) {
      console.error("Error saving milestone statuses:", e);
    }
  }, [milestoneStatuses]);

  useEffect(() => {
    try {
      localStorage.setItem("germany_immigration_milestone_subtasks", JSON.stringify(checkedSubtasks));
    } catch (e) {
      console.error("Error saving subtasks:", e);
    }
  }, [checkedSubtasks]);

  useEffect(() => {
    try {
      localStorage.setItem("germany_immigration_document_checklist", JSON.stringify(documentChecklist));
    } catch (e) {
      console.error("Error saving document checklist:", e);
    }
  }, [documentChecklist]);

  // Compute overall progress percentage mathematically
  const totalMilestones = ROADMAP_MILESTONES.length;
  const completedMilestonesCount = useMemo(() => {
    return Object.values(milestoneStatuses).filter(s => s === "completed").length;
  }, [milestoneStatuses]);

  const inProgressMilestonesCount = useMemo(() => {
    return Object.values(milestoneStatuses).filter(s => s === "in_progress").length;
  }, [milestoneStatuses]);

  const pendingMilestonesCount = totalMilestones - completedMilestonesCount - inProgressMilestonesCount;

  // Weighted calculation: Completed = 100% of weight, In-Progress = 40% + proportion of subtasks completed
  const overallPercentage = useMemo(() => {
    if (totalMilestones === 0) return 0;
    let scoreSum = 0;
    ROADMAP_MILESTONES.forEach(m => {
      const status = milestoneStatuses[m.id] || "pending";
      if (status === "completed") {
        scoreSum += 100;
      } else if (status === "in_progress") {
        const subtasks = m.subtasks;
        const checkedCount = subtasks.filter(st => checkedSubtasks[st.id]).length;
        const subRatio = subtasks.length > 0 ? checkedCount / subtasks.length : 0;
        scoreSum += Math.round(30 + subRatio * 60);
      } else {
        scoreSum += 0;
      }
    });
    return Math.min(100, Math.max(0, Math.round(scoreSum / totalMilestones)));
  }, [milestoneStatuses, checkedSubtasks]);

  // Change milestone status handler
  const handleSetMilestoneStatus = (milestoneId: string, newStatus: MilestoneStatus) => {
    setMilestoneStatuses(prev => ({
      ...prev,
      [milestoneId]: newStatus
    }));

    // If marked as completed, optionally auto-check all its subtasks
    if (newStatus === "completed") {
      const targetMilestone = ROADMAP_MILESTONES.find(m => m.id === milestoneId);
      if (targetMilestone) {
        setCheckedSubtasks(prev => {
          const updated = { ...prev };
          targetMilestone.subtasks.forEach(st => {
            updated[st.id] = true;
          });
          return updated;
        });
      }
    }
  };

  // Toggle subtask checkbox
  const handleToggleSubtask = (milestoneId: string, subtaskId: string) => {
    const isNowChecked = !checkedSubtasks[subtaskId];
    setCheckedSubtasks(prev => ({
      ...prev,
      [subtaskId]: isNowChecked
    }));

    // If user checks a subtask in a pending milestone, automatically elevate to in_progress
    const currentStatus = milestoneStatuses[milestoneId] || "pending";
    const targetMilestone = ROADMAP_MILESTONES.find(m => m.id === milestoneId);
    
    if (targetMilestone) {
      const allOtherSubtasksChecked = targetMilestone.subtasks
        .filter(st => st.id !== subtaskId)
        .every(st => checkedSubtasks[st.id]);

      if (isNowChecked && allOtherSubtasksChecked) {
        // All subtasks are now checked -> promote to completed
        setMilestoneStatuses(prev => ({ ...prev, [milestoneId]: "completed" }));
      } else if (isNowChecked && currentStatus === "pending") {
        setMilestoneStatuses(prev => ({ ...prev, [milestoneId]: "in_progress" }));
      } else if (!isNowChecked && currentStatus === "completed") {
        setMilestoneStatuses(prev => ({ ...prev, [milestoneId]: "in_progress" }));
      }
    }
  };

  // Quick preset actions
  const handleMarkAllCompleted = () => {
    const allComp: Record<string, MilestoneStatus> = {};
    const allChecked: Record<string, boolean> = {};
    ROADMAP_MILESTONES.forEach(m => {
      allComp[m.id] = "completed";
      m.subtasks.forEach(st => {
        allChecked[st.id] = true;
      });
    });
    setMilestoneStatuses(allComp);
    setCheckedSubtasks(allChecked);
  };

  const handleResetRoadmap = () => {
    const resetStatus: Record<string, MilestoneStatus> = {};
    ROADMAP_MILESTONES.forEach((m, idx) => {
      resetStatus[m.id] = idx === 0 ? "in_progress" : "pending";
    });
    setMilestoneStatuses(resetStatus);
    setCheckedSubtasks({});
  };

  // Documents filtering
  const filteredDocs = CHECKLIST_ITEMS.filter(item => {
    if (checklistFilter === "all") return true;
    if (checklistFilter === "chancenkarte") return item.category === "both" || item.category === "chancenkarte";
    if (checklistFilter === "jobseeker") return item.category === "both" || item.category === "jobseeker";
    return true;
  });

  const totalDocSubsteps = filteredDocs.length * 3;
  let completedDocSubsteps = 0;
  filteredDocs.forEach(item => {
    const state = documentChecklist[item.id] || { collected: false, notarized: false, translated: false };
    if (state.collected) completedDocSubsteps++;
    if (state.notarized) completedDocSubsteps++;
    if (state.translated) completedDocSubsteps++;
  });
  const documentPercentage = totalDocSubsteps > 0 ? Math.round((completedDocSubsteps / totalDocSubsteps) * 100) : 0;

  const toggleDocStatus = (docId: string, statusType: "collected" | "notarized" | "translated") => {
    setDocumentChecklist(prev => {
      const current = prev[docId] || { collected: false, notarized: false, translated: false };
      return {
        ...prev,
        [docId]: {
          ...current,
          [statusType]: !current[statusType]
        }
      };
    });
  };

  const handleAction = (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs") => {
    if (onTabChange) {
      onTabChange(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const activeMilestone = useMemo(() => {
    return ROADMAP_MILESTONES.find(m => m.id === activeMilestoneId) || ROADMAP_MILESTONES[0];
  }, [activeMilestoneId]);

  // PDF Export
  const handleDownloadProgressReport = async () => {
    setIsDownloading(true);
    try {
      const res = await fetchWithRetry("/api/logo-base64");
      let logoBase64 = "";
      try {
        const data = await res.json();
        logoBase64 = data.success ? data.base64 : "";
      } catch (err) {
        console.warn("Failed to parse logo JSON", err);
      }

      const effectiveProfile = {
        name: profile?.name || "کاربر نمونه",
        age: profile?.age || 30,
        degree: profile?.degree || "bachelor",
        experience: profile?.experience || 3,
        field: profile?.field || "فناوری اطلاعات / نرم‌افزار",
        germanLevel: profile?.germanLevel || "B1",
        englishLevel: profile?.englishLevel || "B2",
      };

      const degreeText = 
        effectiveProfile.degree === "master" ? "کارشناسی ارشد و بالاتر" : 
        effectiveProfile.degree === "bachelor" ? "کارشناسی (لیسانس)" : 
        effectiveProfile.degree === "associate" ? "کاردانی (فوق دیپلم)" : 
        effectiveProfile.degree === "diploma" ? "دیپلم متوسطه" : "سایر مدارک";

      const milestonesHtml = ROADMAP_MILESTONES.map((step) => {
        const status = milestoneStatuses[step.id] || "pending";
        const statusBadge = 
          status === "completed"
            ? `<span style="background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 11px;">تکمیل شده ✅</span>` 
            : status === "in_progress"
            ? `<span style="background-color: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 11px;">در حال اقدام ⏳</span>`
            : `<span style="background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 11px;">در انتظار آغاز ⏸️</span>`;

        const tipsList = step.tips.map(tip => `<li style="margin-right: 15px; margin-left: 0; margin-bottom: 5px; color: #475569; font-weight: 500;">${tip}</li>`).join("");
        
        const subtasksList = step.subtasks.map(st => {
          const isDone = checkedSubtasks[st.id];
          return `<li style="margin-bottom: 4px; color: ${isDone ? '#065f46' : '#64748b'}; font-weight: ${isDone ? 'bold' : 'normal'};">${isDone ? '☑' : '☐'} ${st.text}</li>`;
        }).join("");

        return `
          <div style="border: 1px solid ${status === 'completed' ? '#a7f3d0' : status === 'in_progress' ? '#c7d2fe' : '#cbd5e1'}; background-color: ${status === 'completed' ? '#f0fdf4' : status === 'in_progress' ? '#f5f3ff' : '#ffffff'}; border-radius: 14px; padding: 18px; margin-bottom: 18px; page-break-inside: avoid; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
              <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #1e3b8a; display: flex; align-items: center; gap: 8px;">
                <span style="background-color: #e0f2fe; color: #0369a1; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 11.5px; margin-left: 8px; font-weight: bold; border: 1px solid #bae6fd;">${step.stepNumber}</span>
                ${step.title} (${step.englishTitle})
              </h4>
              <div>${statusBadge}</div>
            </div>
            <div style="font-size: 11px; color: #0f766e; margin-bottom: 8px; font-weight: bold;">
              مرجع قانونی: ${step.authority} (${step.authorityDe}) | مدت زمان تخمینی: ${step.estimatedDuration}
            </div>
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #334155; text-align: justify; line-height: 1.7;">
              ${step.description}
            </p>
            <div style="margin-bottom: 10px;">
              <strong style="font-size: 11px; color: #1e293b; display: block; margin-bottom: 5px;">چک‌لیست خرد اقدامات:</strong>
              <ul style="margin: 0; padding-right: 15px; font-size: 11px; line-height: 1.6; list-style: none;">
                ${subtasksList}
              </ul>
            </div>
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 10px 12px;">
              <span style="font-size: 11px; font-weight: bold; color: #0f766e; display: block; margin-bottom: 4px;">💡 توصیه‌های کارشناس مهاجرت:</span>
              <ul style="margin: 0; padding: 0; font-size: 10.5px; line-height: 1.6; list-style-type: none;">
                ${tipsList}
              </ul>
            </div>
          </div>
        `;
      }).join("");

      const docsHtml = CHECKLIST_ITEMS.map((doc) => {
        const state = documentChecklist[doc.id] || { collected: false, notarized: false, translated: false };
        const collText = state.collected ? "✅ جمع‌آوری شده" : "❌ ناقص";
        const notarText = state.notarized ? "✅ تایید نوترایز" : "❌ ناقص";
        const transText = state.translated ? "✅ ترجمه رسمی" : "❌ ناقص";
        
        return `
          <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
            <td style="padding: 10px; border-left: 1px solid #cbd5e1; text-align: right;">
              <strong style="color: #1e3b8a; font-size: 12px;">${doc.title}</strong>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${doc.description}</div>
            </td>
            <td style="padding: 10px; text-align: center; border-left: 1px solid #cbd5e1; font-weight: bold; color: ${state.collected ? '#059669' : '#ef4444'};">${collText}</td>
            <td style="padding: 10px; text-align: center; border-left: 1px solid #cbd5e1; font-weight: bold; color: ${state.notarized ? '#059669' : '#ef4444'};">${notarText}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; color: ${state.translated ? '#059669' : '#ef4444'};">${transText}</td>
          </tr>
        `;
      }).join("");

      const printDocTitle = formatPrintDocumentTitle("گام‌نمای پیشرفت هوشمند مهاجرت آلمان", effectiveProfile.name);

      const documentHtml = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<title>${printDocTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;900&display=swap');
  @page {
    size: A4;
    margin: 20mm !important;
  }
  body {
    direction: rtl;
    font-family: 'Vazirmatn', 'Tahoma', sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.8;
    margin: 0;
    padding: 0;
    font-size: 13px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header-box {
    border-bottom: 3px solid #f59e0b;
    padding-bottom: 14px;
    margin-bottom: 20px;
    text-align: center;
  }
  .progress-bar-container {
    background-color: #e2e8f0;
    border-radius: 9999px;
    height: 14px;
    overflow: hidden;
    margin: 10px 0;
  }
  .progress-bar-fill {
    background-color: #10b981;
    height: 100%;
    width: ${overallPercentage}%;
  }
</style>
</head>
<body>
  <div class="header-box">
    <h1 style="margin:0; font-size: 18px; color:#1e293b;">کارنامه پیشرفت و گام‌نمای هوشمند مهاجرت آلمان (۲۰۲۶)</h1>
    <p style="margin:4px 0 0 0; font-size: 11px; color:#64748b;">سامانه هوشمند ارزیابی و کاریابی جاب فایندر آلمان | خانه خلاق جهانبان</p>
  </div>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 18px;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong style="font-size: 13px; color:#0f172a;">متقاضی: ${effectiveProfile.name}</strong>
        <span style="font-size: 11px; color:#64748b; margin-right: 12px;">رشته: ${effectiveProfile.field} | سن: ${effectiveProfile.age} سال | مدرک: ${degreeText}</span>
      </div>
      <div style="font-size: 18px; font-weight: bold; color: #059669; font-family: monospace;">
        ${overallPercentage}% تکمیل شده
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar-fill"></div>
    </div>
    <div style="display:flex; justify-content:space-between; font-size: 10.5px; color:#475569;">
      <span>گام‌های تکمیل شده: ${completedMilestonesCount} از ${totalMilestones}</span>
      <span>در حال اقدام: ${inProgressMilestonesCount}</span>
      <span>در انتظار: ${pendingMilestonesCount}</span>
    </div>
  </div>

  <h2 style="font-size: 14px; color:#1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 20px;">
    وضعیت مراحل ۶ گانه نقشه راه مهاجرت کاری:
  </h2>
  ${milestonesHtml}

  <div style="page-break-before: always; padding-top: 10px;">
    <h2 style="font-size: 14px; color:#1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">
      چک‌لیست مدارک فیزیکی و ترجمه‌های مورد نیاز سفارت:
    </h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #cbd5e1; direction: rtl;">
      <thead>
        <tr style="background-color: #f1f5f9; text-align: right; border-bottom: 2px solid #cbd5e1;">
          <th style="padding: 10px; border-left: 1px solid #cbd5e1;">عنوان سند و مدرک</th>
          <th style="padding: 10px; text-align: center; border-left: 1px solid #cbd5e1; width: 22%;">جمع‌آوری فیزیکی</th>
          <th style="padding: 10px; text-align: center; border-left: 1px solid #cbd5e1; width: 22%;">تایید نوترایز / دادگستری</th>
          <th style="padding: 10px; text-align: center; width: 22%;">ترجمه رسمی آلمانی</th>
        </tr>
      </thead>
      <tbody>
        ${docsHtml}
      </tbody>
    </table>
  </div>

  <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
    گروه شرکت‌ها و خانه خلاق جهانبان • منطبق بر آخرین ضوابط قانون مهاجرت ماهر و بلوکارت ۲۰۲۶ آلمان
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>
      `.trim();

      const blob = new Blob([documentHtml], { type: "text/html;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${printDocTitle}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating printable progress report:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl relative overflow-hidden text-right" id="immigration-progress-tracker-card">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header section with cumulative percentage and controls */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/90 pb-6 mb-7">
        <div className="space-y-1.5 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black">
            <Trophy className="w-3.5 h-3.5" />
            <span>گام‌نمای پیشرفت هوشمند مهاجرت آلمان (Immigration Roadmap Tracker)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ردیاب هوشمند و گام‌به‌گام مراحل مهاجرت کاری
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-3xl">
            مسیر مهاجرتی خود را از اولین گام (ارزشیابی مدرک در ZAB/Anabin) تا کاریابی، مصاحبه‌ها، ویزا و ورود به آلمان دنبال کنید. وضعیت هر گام را به صورت تعاملی تغییر داده و توصیه‌های تخصصی را مطالعه نمایید.
          </p>
        </div>

        {/* Header Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Download Roadmap as PDF Button leveraging CSS print styles */}
          <button
            onClick={() => {
              document.body.classList.add("print-target-roadmap");
              const originalTitle = document.title;
              const name = (profile?.name || "Applicant").trim();
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
            id="tracker-download-roadmap-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/40 active:scale-95 transition-all cursor-pointer"
            title="دانلود سند رسمی نقشه راه مهاجرتی به صورت فایل PDF استاندارد با استایل‌های چاپ (CSS Print Styles)"
          >
            <Download className="w-4 h-4 text-emerald-100" />
            <span>دانلود به عنوان PDF (Download as PDF)</span>
          </button>

          <button
            onClick={handleDownloadProgressReport}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-slate-200 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer border border-slate-700"
            id="btn-download-progress-report"
            title="دانلود سند رسمی کارنامه پیشرفت به همراه چک‌لیست مدارک"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                <span>در حال آماده‌سازی گزارش...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-indigo-200" />
                <span>دانلود کارنامه پیشرفت (PDF)</span>
              </>
            )}
          </button>

          {/* Quick preset dropdown or buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={handleMarkAllCompleted}
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition cursor-pointer"
              title="تغییر وضعیت همه مراحل به تکمیل‌شده"
            >
              تکمیل همه
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={handleResetRoadmap}
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition cursor-pointer flex items-center gap-1"
              title="بازنشانی وضعیت مراحل"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ریست</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Progress Bar Card */}
      <div className="relative z-10 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 md:p-6 mb-8 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-300">میزان پیشرفت کلی در پرونده مهاجرت:</span>
              <span className="text-sm font-black text-emerald-400 font-mono">{overallPercentage}%</span>
            </div>
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                {completedMilestonesCount} گام تکمیل شده
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-indigo-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block animate-pulse" />
                {inProgressMilestonesCount} گام در حال اقدام
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
                {pendingMilestonesCount} گام در انتظار
              </span>
            </div>
          </div>

          {/* Dynamic feedback badge */}
          <div className="self-start md:self-auto">
            {overallPercentage === 100 ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black shadow-lg shadow-emerald-950/20">
                <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
                <span>پرونده ۱۰۰٪ آماده اعزام و اقامت در آلمان!</span>
              </div>
            ) : overallPercentage >= 65 ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black">
                <Rocket className="w-3.5 h-3.5 text-indigo-400" />
                <span>فازهای اصلی پرونده با موفقیت به پیش رفته است</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>در حال تکمیل مقدمات اولیه مدارک و زبان</span>
              </div>
            )}
          </div>
        </div>

        {/* Large Multi-Segment Glowing Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden relative">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 shadow-lg shadow-emerald-500/20 relative"
            initial={{ width: 0 }}
            animate={{ width: `${overallPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-white/20 opacity-30 animate-pulse rounded-full" />
          </motion.div>
        </div>

        {/* Milestone Quick Jump Hint */}
        <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
          <span>شروع: ارزشیابی مدارک (ZAB)</span>
          <span className="text-slate-500">روی هر گام در نمودار زیر کلیک کنید تا جزئیات و وضعیت آن را مدیریت کنید</span>
          <span>هدف: اقامت و اشتغال در آلمان</span>
        </div>
      </div>

      {/* Mode Switcher Tabs: Milestones Stepper vs Document Checklist */}
      <div className="relative z-10 flex items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTrackerTab("milestones")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTrackerTab === "milestones"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>مراحل ۶گانه نقشه راه مهاجرت (Roadmap Stepper)</span>
          </button>
          <button
            onClick={() => setActiveTrackerTab("documents")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTrackerTab === "documents"
                ? "bg-indigo-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>چک‌لیست مدارک و ترجمه‌ها (Documents)</span>
            <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-indigo-300">
              {completedDocSubsteps}/{totalDocSubsteps}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE STATUS MILESTONES STEPPER & DETAILS */}
      {activeTrackerTab === "milestones" && (
        <div className="relative z-10 space-y-6">

          {/* DESKTOP & TABLET HORIZONTAL MILESTONE STEPPER */}
          <div className="hidden md:block bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 overflow-x-auto">
            <div className="min-w-[700px] flex items-center justify-between relative px-4">
              
              {/* Connecting Track Line */}
              <div className="absolute top-6 left-10 right-10 h-1 bg-slate-800 -z-0" />
              
              {/* Dynamic Colored Track Line filling up */}
              <div 
                className="absolute top-6 right-10 h-1 bg-gradient-to-l from-emerald-500 to-indigo-500 -z-0 transition-all duration-500"
                style={{ 
                  width: `${Math.max(0, Math.min(100, ((ROADMAP_MILESTONES.findIndex(m => m.id === activeMilestoneId)) / (totalMilestones - 1)) * 100))}%` 
                }}
              />

              {ROADMAP_MILESTONES.map((milestone, idx) => {
                const status = milestoneStatuses[milestone.id] || "pending";
                const isSelected = activeMilestoneId === milestone.id;
                const IconComponent = milestone.icon;

                return (
                  <div
                    key={milestone.id}
                    onClick={() => setActiveMilestoneId(milestone.id)}
                    className="flex flex-col items-center group cursor-pointer relative z-10 select-none max-w-[110px]"
                  >
                    {/* Node Circle */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 ${
                        status === "completed"
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                          : status === "in_progress"
                          ? "bg-indigo-600 text-white border-indigo-400 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/30"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                      } ${isSelected ? "scale-110 ring-2 ring-white/50" : "hover:scale-105"}`}
                    >
                      {status === "completed" ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : status === "in_progress" ? (
                        <IconComponent className="w-5 h-5 animate-pulse" />
                      ) : (
                        <span className="font-mono font-bold text-sm">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Title & Subtitle */}
                    <div className="text-center mt-2.5 space-y-0.5">
                      <div className={`text-xs font-black truncate w-full ${
                        isSelected ? "text-white underline underline-offset-4 decoration-indigo-400" : "text-slate-300"
                      }`}>
                        {milestone.shortTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-sans">
                        گام {milestone.stepNumber}
                      </div>

                      {/* Status Tag */}
                      <div className="pt-0.5">
                        {status === "completed" ? (
                          <span className="inline-block text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-bold">
                            تکمیل شد
                          </span>
                        ) : status === "in_progress" ? (
                          <span className="inline-block text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-full font-bold">
                            در جریان
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded-full font-medium">
                            در انتظار
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE SCROLLABLE MILESTONE CAROUSEL */}
          <div className="block md:hidden bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-1">
              {ROADMAP_MILESTONES.map((milestone) => {
                const status = milestoneStatuses[milestone.id] || "pending";
                const isSelected = activeMilestoneId === milestone.id;
                const IconComponent = milestone.icon;

                return (
                  <button
                    key={milestone.id}
                    onClick={() => setActiveMilestoneId(milestone.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                        : status === "completed"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    {status === "completed" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <IconComponent className="w-3.5 h-3.5" />
                    )}
                    <span>{milestone.stepNumber}. {milestone.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTED MILESTONE COMPREHENSIVE DETAIL CARD */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-7 shadow-xl space-y-6">
            
            {/* Active Milestone Title & Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800/80 pb-5">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl shrink-0 border ${
                  (milestoneStatuses[activeMilestone.id] || "pending") === "completed"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : (milestoneStatuses[activeMilestone.id] || "pending") === "in_progress"
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                    : "bg-slate-900 text-slate-400 border-slate-800"
                }`}>
                  {React.createElement(activeMilestone.icon, { className: "w-6 h-6" })}
                </div>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg font-bold">
                      گام {activeMilestone.stepNumber} از ۶
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {activeMilestone.title}
                    </h3>
                  </div>
                  <div className="text-xs text-indigo-300/90 font-medium font-sans">
                    {activeMilestone.englishTitle}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium pt-1">
                    {activeMilestone.subtitle}
                  </p>
                </div>
              </div>

              {/* Status Segmented Control Buttons (Interactive Status Milestones) */}
              <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start lg:self-center">
                <div className="text-[10px] text-slate-400 font-bold mb-1.5 px-2 text-right">
                  تغییر وضعیت این گام:
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSetMilestoneStatus(activeMilestone.id, "pending")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      (milestoneStatuses[activeMilestone.id] || "pending") === "pending"
                        ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Circle className="w-3 h-3" />
                    <span>در انتظار</span>
                  </button>
                  <button
                    onClick={() => handleSetMilestoneStatus(activeMilestone.id, "in_progress")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      (milestoneStatuses[activeMilestone.id] || "pending") === "in_progress"
                        ? "bg-indigo-600 text-white shadow-sm border border-indigo-500"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>در حال اقدام</span>
                  </button>
                  <button
                    onClick={() => handleSetMilestoneStatus(activeMilestone.id, "completed")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      (milestoneStatuses[activeMilestone.id] || "pending") === "completed"
                        ? "bg-emerald-600 text-white shadow-sm border border-emerald-500"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>تکمیل شده</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metadata Info Pills (Authority, Duration, Cost) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right">
              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold mb-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>مرجع رسمی آلمان:</span>
                </div>
                <div className="text-xs font-black text-slate-100">{activeMilestone.authority}</div>
                <div className="text-[10px] text-slate-500 truncate font-sans">{activeMilestone.authorityDe}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>مدت زمان تقریبی:</span>
                </div>
                <div className="text-xs font-black text-slate-100">{activeMilestone.estimatedDuration}</div>
                <div className="text-[10px] text-slate-500">بسته به سرعت تکمیل پرونده</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold mb-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>هزینه‌های دولتی / تعرفه:</span>
                </div>
                <div className="text-xs font-black text-slate-100">{activeMilestone.estimatedCost}</div>
                <div className="text-[10px] text-slate-500">تعرفه‌های رسمی سال ۲۰۲۶</div>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-right font-medium">
              {activeMilestone.description}
            </p>

            {/* Sub-tasks interactive checklist */}
            <div className="bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-white text-right">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>اقدامات خرد و چک‌لیست این گام (Sub-tasks):</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {activeMilestone.subtasks.filter(st => checkedSubtasks[st.id]).length} از {activeMilestone.subtasks.length} انجام شد
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {activeMilestone.subtasks.map((st) => {
                  const isChecked = checkedSubtasks[st.id] || false;
                  return (
                    <div
                      key={st.id}
                      onClick={() => handleToggleSubtask(activeMilestone.id, st.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 text-right select-none ${
                        isChecked
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-emerald-400 cursor-pointer"
                        title={isChecked ? "علامت‌گذاری به عنوان ناقص" : "علامت‌گذاری به عنوان انجام شده"}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                      <span className={`text-xs leading-relaxed ${
                        isChecked ? "line-through opacity-80" : "font-medium"
                      }`}>
                        {st.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pro Tips Box */}
            <div className="bg-teal-500/5 border border-teal-500/20 p-4 rounded-2xl space-y-2.5">
              <div className="text-xs font-black text-teal-400 flex items-center gap-1.5 text-right">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>نکات کلیدی و فوت‌های کوزه‌گری مهاجرت آلمان:</span>
              </div>
              <ul className="space-y-1.5 text-right">
                {activeMilestone.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="text-teal-400 font-bold select-none">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Action Link to jump to dedicated app tool */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-850">
              <span className="text-xs text-slate-400 font-medium text-right">
                برای اجرای این گام از ابزار تخصصی درون برنامه استفاده کنید:
              </span>
              <button
                onClick={() => handleAction(activeMilestone.targetTab)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
              >
                <span>{activeMilestone.actionLabel}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: DOCUMENT PREPARATION CHECKLIST SECTION */}
      {activeTrackerTab === "documents" && (
        <div className="relative z-10 space-y-5" id="document-checklist-section">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 text-right">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-400" />
                <span>چک‌لیست تخصصی آماده‌سازی مدارک سفارت (Document Preparation Checklist)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                مدارک فیزیکی، مهرهای دادگستری/نوترایز و ترجمه‌های مورد نیاز برای کارت فرصت (Chancenkarte) یا ویزای بلوکارت را پیگیری نمایید.
              </p>
            </div>

            {/* Filter options */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start md:self-auto text-xs font-bold">
              <button
                onClick={() => setChecklistFilter("all")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  checklistFilter === "all" ? "bg-indigo-600 text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                همه مدارک
              </button>
              <button
                onClick={() => setChecklistFilter("chancenkarte")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  checklistFilter === "chancenkarte" ? "bg-indigo-600 text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                کارت فرصت
              </button>
              <button
                onClick={() => setChecklistFilter("jobseeker")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  checklistFilter === "jobseeker" ? "bg-indigo-600 text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                جستجوی کار
              </button>
            </div>
          </div>

          {/* Mini Document Progress Meter */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-right">
                <div className="text-xs font-black text-white">میزان پیشرفت آماده‌سازی فیزیکی و ترجمه اسناد</div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  تاکنون <span className="text-emerald-400 font-black">{completedDocSubsteps}</span> مرحله از مجموع <span className="text-indigo-400 font-black">{totalDocSubsteps}</span> فرآیند مدارک مورد نیاز این بخش را تکمیل کرده‌اید.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <div className="w-full sm:w-32 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${documentPercentage}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-white font-mono shrink-0 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                {documentPercentage}%
              </span>
            </div>
          </div>

          {/* Interactive Documents Table Grid */}
          <div className="bg-slate-950/40 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-slate-850">
              {filteredDocs.map((doc) => {
                const state = documentChecklist[doc.id] || { collected: false, notarized: false, translated: false };
                
                return (
                  <div key={doc.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-950/50 transition">
                    <div className="space-y-1 text-right max-w-lg">
                      <h4 className="text-xs sm:text-sm font-black text-slate-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{doc.title}</span>
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                        {doc.description}
                      </p>
                    </div>

                    {/* 3 Status toggles columns */}
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 shrink-0 w-full lg:w-auto">
                      
                      {/* Collected Column */}
                      <button
                        onClick={() => toggleDocStatus(doc.id, "collected")}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] sm:text-xs font-black cursor-pointer transition-all duration-150 ${
                          state.collected
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-md shadow-emerald-950/15"
                            : "bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700"
                        }`}
                        title="تغییر وضعیت جمع‌آوری فیزیکی اصل سند"
                      >
                        {state.collected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-700 block" />
                        )}
                        <span>جمع‌آوری شد</span>
                      </button>

                      {/* Notarized Column */}
                      <button
                        onClick={() => toggleDocStatus(doc.id, "notarized")}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] sm:text-xs font-black cursor-pointer transition-all duration-150 ${
                          state.notarized
                            ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 shadow-md shadow-indigo-950/15"
                            : "bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700"
                        }`}
                        title="تغییر وضعیت تایید نوترایز و مهرهای رسمی دادگستری/خارجه"
                      >
                        {state.notarized ? (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-700 block" />
                        )}
                        <span>تایید نوترایز</span>
                      </button>

                      {/* Translated Column */}
                      <button
                        onClick={() => toggleDocStatus(doc.id, "translated")}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] sm:text-xs font-black cursor-pointer transition-all duration-150 ${
                          state.translated
                            ? "bg-teal-500/15 text-teal-400 border-teal-500/30 shadow-md shadow-teal-950/15"
                            : "bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700"
                        }`}
                        title="تغییر وضعیت ترجمه رسمی آلمانی یا انگلیسی"
                      >
                        {state.translated ? (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-700 block" />
                        )}
                        <span>ترجمه رسمی</span>
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Encouragement note footer when all completed */}
      {overallPercentage === 100 && (
        <div className="relative z-10 mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/30 text-center animate-pulse">
          <p className="text-xs sm:text-sm text-emerald-300 font-black">
            🎉 تبریک صمیمانه! شما تمامی مراحل ۶گانه نقشه راه مهاجرت کاری به آلمان را با موفقیت تکمیل نموده‌اید. کارنامه رسمی خود را چاپ کرده و آماده شروع زندگی و اشتغال در آلمان باشید!
          </p>
        </div>
      )}

    </div>
  );
}

// Rocket icon helper component
function Rocket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.84 2.58m-.12-8.54A6 6 0 002.25 14.25v4.8m7.38-5.84a14.926 14.926 0 00-2.58 5.84m8.54-.12a6 6 0 00-5.84-7.38"
      />
    </svg>
  );
}
