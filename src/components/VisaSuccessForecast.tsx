import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import {
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Clock,
  Euro,
  FileCheck2,
  GraduationCap,
  Briefcase,
  Languages,
  Zap,
  Printer,
  Copy,
  Check,
  Layers,
  Scale
} from "lucide-react";
import { EvaluatorInput } from "../types";

export interface VisaTypeForecastItem {
  id: string;
  nameFa: string;
  shortNameFa: string;
  legalCodeDe: string; // e.g. "§18g AufenthG"
  category: "direct_offer" | "opportunity_search" | "job_seeker" | "skilled_worker" | "vocational" | "experience_based";
  successProbability: number; // 0 - 100
  simulatedProbability?: number; // with scenario modifiers
  ratingLevel: "exceptional" | "high" | "moderate" | "low_risk";
  ratingLabelFa: string;
  color: string;
  barColor: string;
  accentBg: string;
  prerequisitesMet: string[];
  missingGaps: string[];
  permanentResidenceTimelineFa: string;
  familyReunificationEaseFa: string;
  minimumSalary2026Eur: number | null;
  keyAdviceFa: string;
  actionTab?: string;
  actionButtonLabelFa?: string;
}

export interface VisaSuccessForecastProps {
  profile?: EvaluatorInput | {
    age?: number;
    degree?: string;
    experience?: number;
    germanLevel?: string;
    englishLevel?: string;
    field?: string;
    anabinStatus?: string;
    name?: string;
  } | null;
  // Direct parameter props support:
  age?: number;
  degree?: string;
  experience?: number;
  germanLevel?: string;
  englishLevel?: string;
  field?: string;
  onNavigateToTab?: (tab: string) => void;
  className?: string;
}

export const VisaSuccessForecast: React.FC<VisaSuccessForecastProps> = ({
  profile,
  age: propAge,
  degree: propDegree,
  experience: propExperience,
  germanLevel: propGermanLevel,
  englishLevel: propEnglishLevel,
  field: propField,
  onNavigateToTab,
  className = ""
}) => {
  // Scenario Simulator Toggles (What-If Analysis)
  const [scenarioLanguageBoost, setScenarioLanguageBoost] = useState<boolean>(false); // Boost German to B2
  const [scenarioExperienceBoost, setScenarioExperienceBoost] = useState<boolean>(false); // 5+ years experience
  const [scenarioAnabinHPlus, setScenarioAnabinHPlus] = useState<boolean>(false); // Confirmed H+
  const [scenarioJobOfferSecured, setScenarioJobOfferSecured] = useState<boolean>(false); // Job offer >= 41k EUR

  const [selectedVisaId, setSelectedVisaId] = useState<string>("chancenkarte");
  const [showScenarioControls, setShowScenarioControls] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Extract candidate profile parameters with fallback to explicit props or profile or defaults
  const candidate = useMemo(() => {
    const effAge = propAge !== undefined ? Number(propAge) : (profile?.age !== undefined ? Number(profile.age) : 29);
    const effDegree = propDegree || profile?.degree || "bachelor";
    const effExp = propExperience !== undefined ? Number(propExperience) : (profile?.experience !== undefined ? Number(profile.experience) : 3);
    const effGerman = propGermanLevel || profile?.germanLevel || "B1";
    const effEnglish = propEnglishLevel || profile?.englishLevel || "B2";
    const effField = propField || profile?.field || "فناوری اطلاعات و مهندسی نرم‌افزار";
    const effAnabin = profile?.anabinStatus || "H+";
    const effName = profile?.name || "متقاضی مهاجرت";

    return {
      name: effName,
      age: effAge,
      degree: effDegree,
      experience: effExp,
      field: effField,
      germanLevel: effGerman,
      englishLevel: effEnglish,
      anabinStatus: effAnabin
    };
  }, [profile, propAge, propDegree, propExperience, propGermanLevel, propEnglishLevel, propField]);

  // Forecast engine calculating probability for all major German visa types
  const forecastList: VisaTypeForecastItem[] = useMemo(() => {
    const fLower = candidate.field.toLowerCase();
    const isIT = fLower.includes("نرم‌افزار") || fLower.includes("برنامه") || fLower.includes("it") || fLower.includes("کامپیوتر") || fLower.includes("وب");
    const isEngineering = fLower.includes("مکانیک") || fLower.includes("برق") || fLower.includes("صنایع") || fLower.includes("خودرو") || fLower.includes("عمران");
    const isHealthcare = fLower.includes("پزشک") || fLower.includes("پرستار") || fLower.includes("درمان");
    const isShortageMINT = isIT || isEngineering || isHealthcare;

    // Base Profile Variables
    const effExperience = scenarioExperienceBoost ? Math.max(candidate.experience, 5) : candidate.experience;
    const effGermanLevel = scenarioLanguageBoost ? "B2" : candidate.germanLevel;
    const effAnabin = scenarioAnabinHPlus ? "H+" : candidate.anabinStatus;
    const effJobOffer = scenarioJobOfferSecured;

    const isDegreeAcademic = candidate.degree === "bachelor" || candidate.degree === "master" || candidate.degree === "phd";
    const isDegreeMasterOrHigher = candidate.degree === "master" || candidate.degree === "phd";
    const isHPlus = effAnabin === "H+" || effAnabin.includes("H+");

    // 1. EU Blue Card (§18g AufenthG)
    let blueCardProb = 40;
    const blueCardMet: string[] = [];
    const blueCardGaps: string[] = [];

    if (isDegreeAcademic) {
      blueCardProb += 25;
      blueCardMet.push("مدرک تحصیلی کارشناسی یا بالاتر");
    } else {
      blueCardGaps.push("الزام مدرک دانشگاهی رسمی (مگر در معافیت سابقه ۳ ساله IT)");
    }

    if (isHPlus) {
      blueCardProb += 15;
      blueCardMet.push("تاییدیه قطعی دانشگاه در سامانه آنابین (H+)");
    } else {
      blueCardGaps.push("نیاز به تاییدیه معادل‌سازی مدرک در ZAB");
    }

    if (isShortageMINT) {
      blueCardProb += 10;
      blueCardMet.push("رشته جزو مشاغل کمبود فدرال با آستانه حقوقی پایین‌تر (€۴۱,۰۴۱)");
    }

    if (effExperience >= 3) {
      blueCardProb += 8;
      blueCardMet.push(`سابقه کاری مفید ${effExperience} سال در رشته تخصصی`);
    }

    if (candidate.englishLevel === "C1" || candidate.englishLevel === "B2") {
      blueCardProb += 5;
      blueCardMet.push("تسلط زبانی مکالمه کاری به انگلیسی/آلمانی");
    }

    if (effJobOffer) {
      blueCardProb += 15;
      blueCardMet.push("پیشنهاد شغلی قطعی با رعایت کف حقوق بلوکارت");
    }

    blueCardProb = Math.min(96, Math.max(25, blueCardProb));

    // 2. Chancenkarte Opportunity Card (§20a AufenthG)
    // Points based on official 2026 rubric:
    let chancenPoints = 0;
    const chancenMet: string[] = [];
    const chancenGaps: string[] = [];

    // Qualification
    if (isHPlus && isDegreeAcademic) {
      chancenPoints += 4;
      chancenMet.push("۴ امتیاز: مدرک دانشگاهی معادل H+");
    } else {
      chancenPoints += 2; // basic vocational recognition
      chancenGaps.push("تاییدیه معادل‌سازی ZAB برای کسب ۴ امتیاز مدرک");
    }

    // Experience
    if (effExperience >= 5) {
      chancenPoints += 3;
      chancenMet.push("۳ امتیاز: بیش از ۵ سال سابقه کاری تخصصی در ۷ سال اخیر");
    } else if (effExperience >= 2) {
      chancenPoints += 2;
      chancenMet.push("۲ امتیاز: ۲ تا ۵ سال سابقه کار تخصصی مرتبط");
    }

    // Language
    const gUpper = effGermanLevel.toUpperCase();
    if (gUpper.includes("B2") || gUpper.includes("C1")) {
      chancenPoints += 3;
      chancenMet.push("۳ امتیاز: تسلط به زبان آلمانی در سطح B2 یا بالاتر");
    } else if (gUpper.includes("B1")) {
      chancenPoints += 2;
      chancenMet.push("۲ امتیاز: سطح زبان آلمانی B1");
    } else if (gUpper.includes("A2")) {
      chancenPoints += 1;
      chancenMet.push("۱ امتیاز: سطح زبان آلمانی A2");
    } else if (candidate.englishLevel.includes("C1")) {
      chancenPoints += 1;
      chancenMet.push("۱ امتیاز: انگلیسی عالی C1");
    } else {
      chancenGaps.push("نیاز به ارتقای آلمانی به B1/B2 جهت کسب امتیاز کلیدی");
    }

    // Age
    if (candidate.age <= 35) {
      chancenPoints += 2;
      chancenMet.push("۲ امتیاز سن: زیر ۳۵ سال");
    } else if (candidate.age <= 40) {
      chancenPoints += 1;
      chancenMet.push("۱ امتیاز سن: ۳۵ تا ۴۰ سال");
    }

    // Shortage occupation
    if (isShortageMINT) {
      chancenPoints += 1;
      chancenMet.push("۱ امتیاز رشته کمبود نیرو (MINT-Engpassberuf)");
    }

    let chancenProb = chancenPoints >= 6 ? Math.min(96, 72 + (chancenPoints - 6) * 6) : Math.max(28, chancenPoints * 10);

    // 3. Traditional Job Seeker Visa (§20 Abs. 1 & 2 AufenthG)
    // 6-month in-person job search visa strictly evaluated on degree and German proficiency
    let jobSeekerProb = 35;
    const jobSeekerMet: string[] = [];
    const jobSeekerGaps: string[] = [];

    if (isDegreeAcademic && isHPlus) {
      jobSeekerProb += 28;
      jobSeekerMet.push("مدرک دانشگاهی رسمی تاییدشده در آنابین (H+)");
    } else if (isDegreeAcademic) {
      jobSeekerProb += 15;
      jobSeekerGaps.push("نیاز به تاییدیه ارزشیابی تحصیلی ZAB جهت ارائه به سفارت");
    } else {
      jobSeekerProb -= 15;
      jobSeekerGaps.push("الزام مدرک دانشگاهی رسمی؛ مدارک غیرآکادمیک واجد شرایط بند ۲۰ نیستند");
    }

    if (gUpper.includes("B2") || gUpper.includes("C1")) {
      jobSeekerProb += 26;
      jobSeekerMet.push("سطح آلمانی B2/C1؛ شانس بالا برای استخدام ظرف مهلت ۶ ماهه");
    } else if (gUpper.includes("B1")) {
      jobSeekerProb += 14;
      jobSeekerMet.push("سطح آلمانی B1؛ حداقل استاندارد مورد توافق افسران کنسولی");
    } else if (gUpper.includes("A2")) {
      jobSeekerProb -= 8;
      jobSeekerGaps.push("سطح A2 در ویزای ۶ ماهه سنتی ریسک ریجکتی دارد؛ توصیه اکید به کارت فرصت");
    } else {
      jobSeekerProb -= 22;
      jobSeekerGaps.push("بدون مدرک آلمانی؛ ریسک رد درخواست توسط سفارت بسیار بالا است");
    }

    if (effExperience >= 5) {
      jobSeekerProb += 12;
      jobSeekerMet.push(`سابقه کاری مستند ${effExperience} سال در حوزه تخصصی`);
    } else if (effExperience >= 2) {
      jobSeekerProb += 7;
      jobSeekerMet.push("دارای سابقه کار تخصصی مرتبط");
    } else {
      jobSeekerGaps.push("سابقه کاری زیر ۲ سال توجیه‌پذیری ویزای جستجو را دشوار می‌سازد");
    }

    if (candidate.age <= 35) {
      jobSeekerProb += 4;
      jobSeekerMet.push("سن زیر ۳۵ سال با قابلیت جذب سریع در بازار کار");
    } else if (candidate.age > 45) {
      jobSeekerProb -= 10;
      jobSeekerGaps.push("سن بالای ۴۵ سال نیازمند اثبات حقوق بازنشستگی قانونی است");
    }

    jobSeekerProb = Math.min(88, Math.max(18, jobSeekerProb));

    // 4. Skilled Worker Visa (§18a / §18b AufenthG)
    // Direct work visa for skilled academic (§18b) or vocational (§18a) workers
    let skilledProb = 48;
    const skilledMet: string[] = [];
    const skilledGaps: string[] = [];

    if (isDegreeAcademic && isHPlus) {
      skilledProb += 26;
      skilledMet.push("مدرک دانشگاهی منطبق با بند §18b (متخصص آکادمیک)");
    } else if (candidate.degree === "associate" || !isDegreeAcademic) {
      skilledProb += 18;
      skilledMet.push("امکان اقدام از مسیر مهارتی بند §18a (نیروی فنی/حرفه‌ای)");
      if (!isHPlus) skilledGaps.push("نیازمند ارزشیابی مدارک فنی توسط اتاق اصناف/بازرگانی آلمان (IHK FOSA)");
    }

    if (effExperience >= 3) {
      skilledProb += 12;
      skilledMet.push(`سابقه کار مرتبط ${effExperience} ساله هم‌راستا با تخصص`);
    } else if (effExperience >= 1) {
      skilledProb += 6;
      skilledMet.push("سابقه کار اولیه ثبت شده");
    }

    if (gUpper.includes("B1") || gUpper.includes("B2") || gUpper.includes("C1")) {
      skilledProb += 14;
      skilledMet.push("مدرک زبان آلمانی استاندارد (B1/B2) مورد تایید اداره کار فدرال (BA)");
    } else if (gUpper.includes("A2")) {
      skilledProb += 6;
      skilledMet.push("زبان آلمانی پایه A2 (مناسب در شرکت‌های بین‌المللی)");
    } else {
      skilledGaps.push("الزام ارتقای سطح آلمانی به حداقل B1 برای تسهیل موافقت اداره کار آلمان");
    }

    if (candidate.age <= 45) {
      skilledProb += 4;
      skilledMet.push("سن زیر ۴۵ سال بدون موانع حقوق بازنشستگی");
    } else {
      skilledGaps.push("سن بالای ۴۵ سال نیازمند حقوق حداقل سالانه €۴۹,۸۳۰ یا بیمه بازنشستگی کافی است");
    }

    if (effJobOffer) {
      skilledProb += 16;
      skilledMet.push("پیشنهاد شغلی رسمی هم‌راستا با مدرک تحصیلی");
    }

    skilledProb = Math.min(94, Math.max(25, skilledProb));

    // 5. IT Specialist Experience-Based Visa (§19c Abs. 2 AufenthG)
    let itSpecProb = isIT ? 60 : 20;
    const itSpecMet: string[] = [];
    const itSpecGaps: string[] = [];

    if (isIT) {
      itSpecMet.push("فعالیت در حوزه پرتقاضای فناوری اطلاعات (IT)");
      if (effExperience >= 3) {
        itSpecProb += 28;
        itSpecMet.push("دارای ۳ سال سابقه کار عملی مرتبط در ۵ سال اخیر");
      } else {
        itSpecGaps.push(`کسری سابقه کار: نیاز به حداقل ۳ سال سابقه IT (سابقه فعلی: ${effExperience} سال)`);
      }
      if (candidate.englishLevel === "B2" || candidate.englishLevel === "C1") {
        itSpecProb += 10;
        itSpecMet.push("تسلط به زبان کاری انگلیسی (B2+) بدون اجبار به آلمانی");
      }
      if (effJobOffer) {
        itSpecProb += 15;
        itSpecMet.push("قرارداد کارفرمای آلمانی با حقوق مناسب حوزه IT");
      }
    } else {
      itSpecGaps.push("این مسیر قانونی انحصاراً مختص متخصصان حوزه فناوری اطلاعات است.");
    }
    itSpecProb = isIT ? Math.min(92, itSpecProb) : 15;

    // Compile into items with the 4 core requested visas as primary
    const rawItems: VisaTypeForecastItem[] = [
      {
        id: "chancenkarte",
        nameFa: "کارت فرصت جستجوی کار (Opportunity Card)",
        shortNameFa: "کارت فرصت (Opportunity Card)",
        legalCodeDe: "§20a AufenthG",
        category: "opportunity_search",
        successProbability: chancenProb,
        ratingLevel: chancenProb >= 80 ? "exceptional" : chancenProb >= 65 ? "high" : "moderate",
        ratingLabelFa: chancenProb >= 80 ? "امتیاز کامل فدرال (+۶ امتیاز)" : chancenProb >= 60 ? "واجد شرایط دریافت" : "نیازمند تقویت امتیاز",
        color: "text-emerald-500",
        barColor: "#10b981",
        accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        prerequisitesMet: chancenMet,
        missingGaps: chancenGaps,
        permanentResidenceTimelineFa: "ورود ۱ ساله برای تبدیل حضوری به بلوکارت یا اقامت کاری",
        familyReunificationEaseFa: "امکان همراهی خانواده پس از تبدیل به ویزای کاری قطعی",
        minimumSalary2026Eur: null,
        keyAdviceFa: `شما ${chancenPoints} امتیاز از حداقل ۶ امتیاز لازم را کسب کرده‌اید. کارت فرصت سریع‌ترین راه ورود به آلمان بدون جاب‌آفر بوده و اجازه ۲۰ ساعت کار پاره‌وقت در هفته را می‌دهد.`,
        actionTab: "chancenkarte",
        actionButtonLabelFa: "محاسبه دقیق امتیازات کارت فرصت"
      },
      {
        id: "blue-card",
        nameFa: "کارت آبی اتحادیه اروپا (EU Blue Card)",
        shortNameFa: "بلوکارت اروپا (EU Blue Card)",
        legalCodeDe: "§18g AufenthG",
        category: "direct_offer",
        successProbability: blueCardProb,
        ratingLevel: blueCardProb >= 80 ? "exceptional" : blueCardProb >= 65 ? "high" : "moderate",
        ratingLabelFa: blueCardProb >= 80 ? "شانس استثنایی و قطعی" : blueCardProb >= 65 ? "شانس بسیار بالا" : "شانس متوسط (مشروط)",
        color: "text-blue-500",
        barColor: "#3b82f6",
        accentBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        prerequisitesMet: blueCardMet,
        missingGaps: blueCardGaps,
        permanentResidenceTimelineFa: "اقامت دائم پس از ۲۱ ماه (با B1 آلمانی) یا ۲۷ ماه",
        familyReunificationEaseFa: "پیوست ۱۰۰٪ فوری خانواده بدون نیاز به مدرک زبان همسر",
        minimumSalary2026Eur: isShortageMINT ? 41041 : 45300,
        keyAdviceFa: "با توجه به داشتن مدرک تحصیلی، اولویت اول شما یافتن کارفرمایی است که حقوق ناخالص حداقل ۴۱,۰۴۱ یورو پیشنهاد دهد تا در سریع‌ترین زمان ممکن اقامت دائم بگیرید.",
        actionTab: "jobs",
        actionButtonLabelFa: "مشاهده کارفرماهای بلوکارت"
      },
      {
        id: "job-seeker",
        nameFa: "ویزای جستجوی کار سنتی (Job Seeker Visa)",
        shortNameFa: "ویزای جستجوی کار (Job Seeker)",
        legalCodeDe: "§20 Abs. 1 & 2 AufenthG",
        category: "job_seeker",
        successProbability: jobSeekerProb,
        ratingLevel: jobSeekerProb >= 75 ? "high" : jobSeekerProb >= 55 ? "moderate" : "low_risk",
        ratingLabelFa: jobSeekerProb >= 75 ? "شانس خوب در سفارت" : jobSeekerProb >= 55 ? "شانس متوسط (مشروط به زبان)" : "ریسک ریجکتی در سفارت",
        color: "text-amber-500",
        barColor: "#f59e0b",
        accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        prerequisitesMet: jobSeekerMet,
        missingGaps: jobSeekerGaps,
        permanentResidenceTimelineFa: "اقامت ۶ ماهه جستجو و تبدیل در آلمان پس از عقد قرارداد",
        familyReunificationEaseFa: "پیوست خانواده تنها پس از تبدیل به ویزای کاری قطعی در آلمان",
        minimumSalary2026Eur: null,
        keyAdviceFa: "ویزای سنتی جستجوی کار نیازمند مدرک تحصیلی تاییدشده آنابین و اثبات تسلط به آلمانی است. اگر زبان شما زیر B1 است، اکیداً استفاده از «کارت فرصت» توصیه می‌شود.",
        actionTab: "guide",
        actionButtonLabelFa: "راهنمای مدارک سفارت"
      },
      {
        id: "skilled-worker",
        nameFa: "ویزای نیروی متخصص کاری (Skilled Worker Visa)",
        shortNameFa: "نیروی متخصص کاری (Skilled Worker)",
        legalCodeDe: "§18a/§18b AufenthG",
        category: "skilled_worker",
        successProbability: skilledProb,
        ratingLevel: skilledProb >= 75 ? "high" : "moderate",
        ratingLabelFa: skilledProb >= 75 ? "شانس بالا با جاب‌آفر" : "شانس متوسط",
        color: "text-indigo-500",
        barColor: "#6366f1",
        accentBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
        prerequisitesMet: skilledMet,
        missingGaps: skilledGaps,
        permanentResidenceTimelineFa: "اقامت دائم پس از ۳ سال اشتغال مداوم در آلمان",
        familyReunificationEaseFa: "پیوست خانواده با مدرک زبان پایه A1 همسر",
        minimumSalary2026Eur: null,
        keyAdviceFa: "اگر قرارداد کاری دریافت کنید اما حقوق آن پایین‌تر از سقف بلوکارت باشد، این بند قانونی اجازه اقامت کاری معتبر را بدون نیاز به حداقل حقوق بالا صادر می‌کند.",
        actionTab: "advanced-jobs",
        actionButtonLabelFa: "جستجوی موقعیت‌های کاری"
      },
      {
        id: "it-specialist",
        nameFa: "ویزای متخصصین تجربی IT (IT Specialist Visa)",
        shortNameFa: "متخصص تجربی IT (§19c)",
        legalCodeDe: "§19c Abs. 2 AufenthG",
        category: "experience_based",
        successProbability: itSpecProb,
        ratingLevel: itSpecProb >= 75 ? "high" : itSpecProb >= 50 ? "moderate" : "low_risk",
        ratingLabelFa: itSpecProb >= 75 ? "مسیر اختصاصی IT" : isIT ? "نیازمند ۳ سال سابقه IT" : "مختص حوزه کامپیوتر",
        color: "text-purple-500",
        barColor: "#8b5cf6",
        accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        prerequisitesMet: itSpecMet,
        missingGaps: itSpecGaps,
        permanentResidenceTimelineFa: "اقامت دائم پس از ۳ سال اشتغال پیوسته در آلمان",
        familyReunificationEaseFa: "پیوست خانواده با تسهیلات قانون مهاجرت ماهر",
        minimumSalary2026Eur: 41041,
        keyAdviceFa: isIT 
          ? "حتی بدون داشتن مدرک تحصیلی آکادمیک، سابقه کار ۳ ساله در IT شما را واجد شرایط صدور ویزای مستقیم کاری می‌کند."
          : "این مسیر قانونی صرفاً برای متقاضیان حوزه فناوری اطلاعات و برنامه‌نویسی در دسترس است.",
        actionTab: "jobs",
        actionButtonLabelFa: "مشاهده کارفرماهای حامی IT"
      }
    ];

    return rawItems.sort((a, b) => b.successProbability - a.successProbability);
  }, [
    candidate,
    scenarioLanguageBoost,
    scenarioExperienceBoost,
    scenarioAnabinHPlus,
    scenarioJobOfferSecured
  ]);

  // Chart data formatted for Recharts
  const chartData = useMemo(() => {
    return forecastList.map((item) => ({
      name: item.shortNameFa,
      fullName: item.nameFa,
      legalCode: item.legalCodeDe,
      probability: item.successProbability,
      barColor: item.barColor,
      id: item.id
    }));
  }, [forecastList]);

  // Selected visa details
  const activeVisa = useMemo(() => {
    return forecastList.find((v) => v.id === selectedVisaId) || forecastList[0];
  }, [selectedVisaId, forecastList]);

  // Top recommended visa
  const topRecommended = forecastList[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-7 ${className}`}
      dir="rtl"
      id="visa-success-forecast-visualizer"
    >
      {/* Header with Title and Strategy Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>پیش‌بینی مقایسه‌ای شانس ویزا (Visa Success Forecast)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            شبیه‌ساز مقایسه‌ای درصد موفقیت انواع ویزاهای کاری آلمان
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            سنجش داده‌محور درصد شانس دریافت روادید برای متقاضی بر اساس قوانین مصوب ۲۰۲۶ مهاجرت ماهر فدرال آلمان (FEG).
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-right">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
              مسیر برتر با بالاترین شانس:
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {topRecommended.shortNameFa} ({topRecommended.successProbability}٪)
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer no-print"
            title="چاپ کارنامه مقایسه‌ای ویزاها"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-500" />
            <span>چاپ گزارش (A4)</span>
          </button>
        </div>
      </div>

      {/* Scenario Simulator Toggles (What-If Controls) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-850 dark:via-indigo-950/20 dark:to-slate-850 border border-indigo-100 dark:border-indigo-900/40 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
              شبیه‌ساز سناریوهای ارتقای شانس (What-If Analysis)
            </h4>
          </div>
          <button
            onClick={() => setShowScenarioControls(!showScenarioControls)}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>{showScenarioControls ? "مخفی‌سازی سناریوها" : "مشاهده گزینه‌های ارتقا"}</span>
            {showScenarioControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {showScenarioControls && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 text-xs overflow-hidden"
            >
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                با تغییر فرضی فاکتورهای زیر، تاثیر آنی بهبود هر متغیر را بر درصد شانس انواع ویزاها در نمودار زیر مشاهده کنید:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* 1. Language Boost */}
                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                  scenarioLanguageBoost
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-300"
                }`}>
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs block">ارتقای آلمانی به B2</span>
                    <span className={`text-[10px] ${scenarioLanguageBoost ? "text-indigo-100" : "text-slate-400"}`}>
                      +۱۸٪ شانس کارت فرصت
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={scenarioLanguageBoost}
                    onChange={e => setScenarioLanguageBoost(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4"
                  />
                </label>

                {/* 2. Experience Boost */}
                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                  scenarioExperienceBoost
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-300"
                }`}>
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs block">سابقه کاری +۵ سال</span>
                    <span className={`text-[10px] ${scenarioExperienceBoost ? "text-indigo-100" : "text-slate-400"}`}>
                      +۱۴٪ شانس متخصصین
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={scenarioExperienceBoost}
                    onChange={e => setScenarioExperienceBoost(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4"
                  />
                </label>

                {/* 3. Anabin H+ Confirmation */}
                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                  scenarioAnabinHPlus
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-300"
                }`}>
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs block">تاییدیه رسمی آنابین H+</span>
                    <span className={`text-[10px] ${scenarioAnabinHPlus ? "text-indigo-100" : "text-slate-400"}`}>
                      تضمین پیش‌شرط آکادمیک
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={scenarioAnabinHPlus}
                    onChange={e => setScenarioAnabinHPlus(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4"
                  />
                </label>

                {/* 4. Job Offer Secured */}
                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                  scenarioJobOfferSecured
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-300"
                }`}>
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs block">جاب‌آفر بالای ۴۱,۰۴۱ €</span>
                    <span className={`text-[10px] ${scenarioJobOfferSecured ? "text-indigo-100" : "text-slate-400"}`}>
                      جهش قطعی بلوکارت به ۹۶٪
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={scenarioJobOfferSecured}
                    onChange={e => setScenarioJobOfferSecured(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4"
                  />
                </label>
              </div>

              {(scenarioLanguageBoost || scenarioExperienceBoost || scenarioAnabinHPlus || scenarioJobOfferSecured) && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>سناریوی شبیه‌سازی فعال است. مقادیر نمودار بروزرسانی شده‌اند.</span>
                  </span>
                  <button
                    onClick={() => {
                      setScenarioLanguageBoost(false);
                      setScenarioExperienceBoost(false);
                      setScenarioAnabinHPlus(false);
                      setScenarioJobOfferSecured(false);
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                  >
                    بازنشانی به مشخصات واقعی پروفایل
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid: Bar Chart Visualizer (Left/Top) + Interactive Drilldown Details (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* RECHARTS BAR CHART (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>نمودار مقایسه‌ای درصد شانس موفقیت روادید (Bar Chart)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                روی هر ستون کلیک کنید تا جزئیات و پیش‌نیازهای اختصاصی آن ویزا نمایش داده شود
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              مقیاس ۰ تا ۱۰۰٪
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  unit="٪"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
                  width={130}
                  axisLine={false}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const matchedItem = forecastList.find(f => f.id === data.id);
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5" dir="rtl">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-black text-amber-400">{data.fullName}</span>
                            <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
                              {data.legalCode}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                            <span className="text-slate-400 text-[11px]">احتمال موفقیت:</span>
                            <span className="text-sm font-black text-emerald-400">{data.probability}٪</span>
                          </div>
                          {matchedItem && (
                            <p className="text-[10px] text-slate-300 pt-1">
                              رتبه شانس: <strong className="text-amber-300">{matchedItem.ratingLabelFa}</strong>
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="probability"
                  name="درصد شانس"
                  radius={[8, 0, 0, 8]}
                  onClick={(entry) => setSelectedVisaId(entry.id)}
                  cursor="pointer"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.barColor}
                      stroke={selectedVisaId === entry.id ? "#ffffff" : "transparent"}
                      strokeWidth={selectedVisaId === entry.id ? 2 : 0}
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Bar Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>شانس استثنایی (+۸۰٪)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>شانس بالا (۶۵ تا ۸۰٪)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>شانس متوسط (۵۰ تا ۶۵٪)</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">قوانین فدرال ۲۰۲۶</span>
          </div>
        </div>

        {/* DETAILED DRILLDOWN CARD FOR SELECTED VISA (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          {/* Header of selected visa */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${activeVisa.accentBg}`}>
                  {activeVisa.legalCodeDe}
                </span>
                <span className="text-xs font-bold text-slate-400">{activeVisa.ratingLabelFa}</span>
              </div>
              <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {activeVisa.nameFa}
              </h4>
            </div>

            {/* Probability KPI Dial */}
            <div className="text-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0 min-w-16">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">
                {activeVisa.successProbability}٪
              </span>
              <span className="text-[9px] text-slate-400 font-bold">احتمال صدور</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-500" />
                اقامت دائم (PR):
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] leading-tight block">
                {activeVisa.permanentResidenceTimelineFa}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Euro className="w-3 h-3 text-emerald-500" />
                کف حقوق قانونی:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] leading-tight block">
                {activeVisa.minimumSalary2026Eur
                  ? `سالانه €${activeVisa.minimumSalary2026Eur.toLocaleString()}`
                  : "بدون حداقل حقوق مصوب"}
              </span>
            </div>
          </div>

          {/* Prerequisites Met Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>پیش‌نیازهای احراز شده در پروفایل شما:</span>
            </span>
            <ul className="space-y-1.5 pr-2">
              {activeVisa.prerequisitesMet.map((met, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{met}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Gaps if any */}
          {activeVisa.missingGaps.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>گپ‌ها و پیش‌نیازهای تکمیلی:</span>
              </span>
              <ul className="space-y-1.5 pr-2">
                {activeVisa.missingGaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    <span className="text-amber-500 font-bold shrink-0">!</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategic Advice */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-1 text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>راهکار و توصیه استراتژیک:</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {activeVisa.keyAdviceFa}
            </p>
          </div>

          {/* Action Button */}
          {activeVisa.actionTab && onNavigateToTab && (
            <div className="pt-2">
              <button
                onClick={() => onNavigateToTab(activeVisa.actionTab!)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <span>{activeVisa.actionButtonLabelFa || "ورود به بخش مربوطه"}</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Quick Comparison Table / Cards of All 5 Visa Types */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>ماتریس خلاصه مقایسه تمام مسیرهای قانونی اقامت کاری آلمان:</span>
          </h4>
          <span className="text-[11px] text-slate-500">انتخاب سریع با کلیک روی هر کارت</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {forecastList.map((item) => {
            const isSelected = item.id === selectedVisaId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedVisaId(item.id)}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/30"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {item.legalCodeDe}
                    </span>
                    <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                      {item.successProbability}٪
                    </span>
                  </div>
                  <h5 className="font-bold text-xs truncate" title={item.nameFa}>{item.shortNameFa}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{item.ratingLabelFa}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>اقامت دائم:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{item.permanentResidenceTimelineFa.split(" ")[2] || "۲۱ ماه"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisaSuccessForecast;
