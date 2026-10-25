import { EvaluatorInput } from "../types";

export interface ImmigrationProgressState {
  currentStage: "profile_eval" | "zab_anabin" | "cv_prep" | "job_search" | "interviewing" | "job_offer" | "embassy_prep" | "visa_stamping" | "relocation";
  completedStages: string[];
  targetPathway: "blue_card" | "chancenkarte" | "skilled_worker" | "it_specialist";
  currentBlocker?: string;
  completedPercentage?: number;
}

export interface AdvisorNextStep {
  stepNumber: number;
  title: string;
  priority: "urgent" | "high" | "medium";
  timeframe: string;
  actionableDescriptionFa: string;
  legalReferenceFa?: string;
  officialPortalUrl?: string;
  checklistTasks: string[];
}

export interface AdvisorMilestoneAudit {
  stageKey: string;
  stageNameFa: string;
  status: "completed" | "in_progress" | "action_required" | "upcoming";
  progressFeedbackFa: string;
  estimatedWeeksToComplete: number;
}

export interface AdvisorRiskMitigation {
  riskTitle: string;
  severity: "critical" | "warning" | "advisory";
  mitigationStrategyFa: string;
}

export interface ImmigrationAdvisorReport {
  summaryVerdictFa: string;
  recommendedPathwayFa: string;
  pathwayRationaleFa: string;
  fieldOutlookFa: {
    fieldTitle: string;
    marketDemand: "بسیار بالا (Engpassberuf)" | "بالا" | "متوسط";
    blueCardMinSalaryEur2026: number;
    fastTrackStatus: string;
    topHiringHubs: string[];
    criticalIndustryKeywords: string[];
  };
  immediateNextSteps: AdvisorNextStep[];
  roadmapMilestoneAudits: AdvisorMilestoneAudit[];
  riskMitigationTips: AdvisorRiskMitigation[];
  consultationAnswerFa?: string;
  source?: string;
}

export const IMMIGRATION_STAGES_CONFIG: {
  id: ImmigrationProgressState["currentStage"];
  nameFa: string;
  iconName: string;
  typicalDurationWeeks: number;
  descriptionFa: string;
}[] = [
  { id: "profile_eval", nameFa: "۱. ارزیابی صلاحیت و مسیر قانونی", iconName: "Brain", typicalDurationWeeks: 1, descriptionFa: "بررسی امتیازات، شانس ویزا و انتخاب مسیر بلوکارت یا کارت شانس" },
  { id: "zab_anabin", nameFa: "۲. استعلام آنابین و تاییدیه ZAB", iconName: "GraduationCap", typicalDurationWeeks: 4, descriptionFa: "بررسی وضعیت H+ دانشگاه و معادل‌سازی مدارک در سامانه فدرال ZAB" },
  { id: "cv_prep", nameFa: "۳. تدوین رزومه استاندارد Lebenslauf", iconName: "FileText", typicalDurationWeeks: 2, descriptionFa: "آماده‌سازی رزومه آلمانی استاندارد با انطباق کامل ATS و پوشش تجارب" },
  { id: "job_search", nameFa: "۴. کاریابی هدفمند و ارسال اپلای", iconName: "Search", typicalDurationWeeks: 8, descriptionFa: "جستجو در شرکت‌های حامی ویزا و موقعیت‌های با شانس بالای مصاحبه" },
  { id: "interviewing", nameFa: "۵. مصاحبه‌های فنی و منابع انسانی", iconName: "Sparkles", typicalDurationWeeks: 4, descriptionFa: "آمادگی مکالمه آلمانی/انگلیسی و چارچوب STAR برای کارفرمای آلمانی" },
  { id: "job_offer", nameFa: "۶. دریافت جاب‌آفر و تاییدیه کارفرما", iconName: "Award", typicalDurationWeeks: 2, descriptionFa: "تنظیم قرارداد مطابق حداقل حقوق بلوکارت و تاییدیه اداره کار فدرال" },
  { id: "embassy_prep", nameFa: "۷. وقت سفارت و تمکن مالی/بیمه", iconName: "Building2", typicalDurationWeeks: 6, descriptionFa: "رزرو وقت سفارت تهران، ویزامتریک، حساب بلاک‌شده و بیمه معتبر" },
  { id: "visa_stamping", nameFa: "۸. اخذ ویزای ورودی (§18g / §20a)", iconName: "ShieldCheck", typicalDurationWeeks: 3, descriptionFa: "تحویل گذرنامه، صدور روادید ورود D و آمادگی سفر به آلمان" },
  { id: "relocation", nameFa: "۹. ورود به آلمان و ثبت آدرس (Anmeldung)", iconName: "Home", typicalDurationWeeks: 2, descriptionFa: "ثبت شهرداری، افتتاح حساب بانکی محلی و دریافت کارت اقامت فیزیکی" }
];

export function generateRuleBasedAdvisorReport(
  profile: EvaluatorInput,
  progress: ImmigrationProgressState,
  userQuery?: string
): ImmigrationAdvisorReport {
  const fLower = (profile.field || "نرم‌افزار").toLowerCase();
  const isIT = fLower.includes("نرم‌افزار") || fLower.includes("برنامه") || fLower.includes("it") || fLower.includes("کامپیوتر") || fLower.includes("وب");
  const isEng = fLower.includes("مکانیک") || fLower.includes("برق") || fLower.includes("خودرو") || fLower.includes("صنایع") || fLower.includes("عمران");
  const isMedical = fLower.includes("پزشک") || fLower.includes("پرستار") || fLower.includes("درمان") || fLower.includes("دارو");

  const exp = profile.experience || 3;
  const isHPlus = profile.anabinStatus === "H+" || !profile.anabinStatus;
  const gLevel = profile.germanLevel || "B1";
  const eLevel = profile.englishLevel || "B2";

  // Determine optimal pathway
  let recommendedPathwayFa = "ویزای بلوکارت اتحادیه اروپا (EU Blue Card - §18g AufenthG)";
  let pathwayRationaleFa = "با توجه به داشتن مدرک دانشگاهی معتبر و سابقه کاری تخصصی، دریافت جاب‌آفر بالای ۴۱,۰۴۱ یورو در سال سریع‌ترین مسیر اقامت دائم (پس از ۲۱ ماه با مدرک B1 یا ۲۷ ماه بدون مدرک) است.";
  if (!isHPlus && !isIT) {
    recommendedPathwayFa = "کارت شانس آلمان (Chancenkarte - §20a AufenthG)";
    pathwayRationaleFa = "به دلیل نیاز مدارک به ارزشیابی تکمیلی ZAB، کارت فرصت ۶ امتیازی ورود فوری و جستجوی کار قانونی ۱۲ ماهه در خاک آلمان را تضمین می‌کند.";
  } else if (isIT && exp >= 3 && (!profile.degree || profile.degree === "associate" || profile.degree === "experience_only")) {
    recommendedPathwayFa = "ویزای متخصصین فناوری اطلاعات بر اساس سابقه کار (§19c AufenthG)";
    pathwayRationaleFa = "بر اساس بند قانونی جدید مهاجرت ماهر ۲۰۲۶، متخصصان IT با حداقل ۳ سال سابقه کار اثبات‌شده نیازی به مدرک دانشگاهی ندارند.";
  }

  // Field Outlook
  const fieldOutlookFa = {
    fieldTitle: profile.field || "فناوری اطلاعات و مهندسی نرم‌افزار",
    marketDemand: (isIT || isEng || isMedical) ? "بسیار بالا (Engpassberuf)" as const : "بالا" as const,
    blueCardMinSalaryEur2026: (isIT || isEng || isMedical) ? 41041 : 45300,
    fastTrackStatus: "واجد شرایط تسریع فرآیند ویزا (§81a Beschleunigtes Fachkräfteverfahren)",
    topHiringHubs: isIT 
      ? ["برلین (قطب استارتاپی)", "مونیخ (فناوری و هوش مصنوعی)", "فرانکفورت (فین‌تک)", "هامبورگ"]
      : isEng
      ? ["اشتوتگارت (صنایع خودرو و بوش/پورشه)", "مونیخ (ب‌ام‌و و زیمنس)", "ارلانگن", "نورنبرگ"]
      : ["فرانکفورت", "کلن", "دوسلدورف", "لایپزیگ"],
    criticalIndustryKeywords: isIT
      ? ["Microservices", "Docker / Kubernetes", "Cloud (AWS/GCP)", "CI/CD", "Agile / Scrum", "Clean Architecture"]
      : isEng
      ? ["AUTOSAR", "ISO 26262", "Embedded Systems", "CAD / SolidWorks", "PLC Siemens TIA", "VDI Standard"]
      : ["B2 Pflege", "Approbation", "Patientenversorgung", "Kenntnisprüfung"]
  };

  // Immediate Next Steps based on currentStage
  const immediateNextSteps: AdvisorNextStep[] = [];

  if (progress.currentStage === "profile_eval" || progress.currentStage === "zab_anabin") {
    immediateNextSteps.push({
      stepNumber: 1,
      title: "تطبیق دانشگاه و رشته در سامانه آنابین فدرال",
      priority: "urgent",
      timeframe: "ظرف ۷ روز آینده",
      actionableDescriptionFa: "از صفحه وضعیت دانشگاه خود در آنابین (Status: H+) و رشته تحصیلی پرینت PDF رسمی تهیه کنید. در صورتی که دانشگاه H+/- است، پیش‌ثبت‌نام ارزیابی ZAB را آغاز نمایید.",
      legalReferenceFa: "BAMF & KMK Anabin Guidelines",
      officialPortalUrl: "https://anabin.kmk.org",
      checklistTasks: [
        "دریافت پرینت H+ نام دانشگاه در آنابین",
        "تطبیق عنوان مدرک تحصیلی با فهرست مدارک معتبر",
        "ترجمه رسمی ریزنمرات و دانشنامه با تایید دادگستری و وزارت خارجه"
      ]
    });
    immediateNextSteps.push({
      stepNumber: 2,
      title: "استانداردسازی رزومه آلمانی (Tabellarischer Lebenslauf)",
      priority: "high",
      timeframe: "ظرف ۲ هفته آینده",
      actionableDescriptionFa: "رزومه را به زبان انگلیسی یا آلمانی و با فرمت دو صفحه‌ای بدون گپ زمانی (Lückenlos) مطابق استاندارد DIN 5008 بازنویسی کنید.",
      legalReferenceFa: "DIN 5008 Lebenslauf Standard",
      checklistTasks: [
        "افزودن دستاوردهای کمی و عددی در هر موقعیت شغلی",
        "حذف گپ‌های زمانی بیش از ۲ ماه یا توجیه مستند آن",
        "تطبیق تِک‌استک رزومه با واژگان صنعتی پرتقاضای آلمان"
      ]
    });
  } else if (progress.currentStage === "cv_prep" || progress.currentStage === "job_search") {
    immediateNextSteps.push({
      stepNumber: 1,
      title: "هدف‌گذاری روی شرکت‌های فاز ۱ چابک با فرهنگ جذب غیراروپایی",
      priority: "urgent",
      timeframe: "همین هفته",
      actionableDescriptionFa: `روی شرکت‌های با نرخ جذب بالای غیراروپایی (مانند Zalando، Personio، Delivery Hero یا Celonis) تمرکز کنید که بیش از ۸۵٪ سابقه مثبت در اسپانسرشیپ ویزا دارند.`,
      legalReferenceFa: "§18g AufenthG (EU Blue Card)",
      checklistTasks: [
        "ارسال حداقل ۱۰ اپلای هفتگی با انگیزه‌نامه اختصاصی (Anschreiben)",
        "ارتباط با مهندسان ایرانی شاغل در شرکت‌های هدف از طریق لینکدین",
        "بررسی تطابق حقوق با کف ۴۱,۰۴۱ یورو در آفرها"
      ]
    });
    immediateNextSteps.push({
      stepNumber: 2,
      title: "تقویت آمادگی مصاحبه به متدولوژی رفتاری STAR",
      priority: "high",
      timeframe: "۲ هفته آینده",
      actionableDescriptionFa: "مصاحبه‌کنندگان آلمانی به شفافیت در بیان چالش، وظیفه، عمل و نتیجه (STAR) و رعایت کدهای فرهنگی کاری آلمان اهمیت ویژه می‌دهند.",
      legalReferenceFa: "German Corporate Hiring Protocol",
      checklistTasks: [
        "تدوین ۳ داستان موفقیت کاری به چارچوب STAR",
        "تمرین پاسخ‌گویی به سوالات تعارض و کار تیمی",
        "آماده‌سازی سوالات هوشمندانه از کارفرما در پایان مصاحبه"
      ]
    });
  } else {
    immediateNextSteps.push({
      stepNumber: 1,
      title: "درخواست تسریع فرآیند ویزای متخصصین از کارفرما (§81a)",
      priority: "urgent",
      timeframe: "بلافاصله پس از جاب‌آفر",
      actionableDescriptionFa: "از کارفرما بخواهید وکالت‌نامه فرآیند تسریع نیروی ماهر (Beschleunigtes Fachkräfteverfahren) را به اداره اتباع تسلیم کند تا زمان ویزا از چند ماه به ۳ هفته کاهش یابد.",
      legalReferenceFa: "§81a AufenthG",
      checklistTasks: [
        "امضای وکالت‌نامه توسط متقاضی به کارفرما",
        "پرداخت هزینه ۴۱۱ یورویی تسریع توسط کارفرما",
        "دریافت تاییدیه اولیه Vorabzustimmung برای سفارت"
      ]
    });
    immediateNextSteps.push({
      stepNumber: 2,
      title: "تکمیل مدارک وقت سفارت و تمکن مالی",
      priority: "high",
      timeframe: "۲ الی ۳ هفته آینده",
      actionableDescriptionFa: "آماده‌سازی پوشه مدارک طبق آخرین چک‌لیست رسمی ۲۰۲۶ سفارت آلمان در تهران (قرارداد کار، بیمه درمان ورودی و تاییدیه ZAV).",
      legalReferenceFa: "Embassy of Germany Tehran Visa Checklist 2026",
      checklistTasks: [
        "اصل قرارداد با امضای معتبر طرفین",
        "فرم تکمیل‌شده درخواست روادید اقامت بلندمدت (Videx)",
        "بیمه مسافرتی ورودی معتبر تا زمان شروع بیمه دولتی"
      ]
    });
  }

  // Milestone Audits
  const roadmapMilestoneAudits: AdvisorMilestoneAudit[] = IMMIGRATION_STAGES_CONFIG.slice(0, 6).map(st => {
    let status: AdvisorMilestoneAudit["status"] = "upcoming";
    let feedback = "این مرحله در نوبت پیش‌رو قرار دارد.";
    if (progress.completedStages?.includes(st.id)) {
      status = "completed";
      feedback = "با موفقیت تکمیل شده و مدارک مربوطه بایگانی گردیده است.";
    } else if (progress.currentStage === st.id) {
      status = "action_required";
      feedback = "مرحله فعال و در دست اقدام. نیازمند تمرکز کامل برای نهایی‌سازی.";
    }
    return {
      stageKey: st.id,
      stageNameFa: st.nameFa,
      status,
      progressFeedbackFa: feedback,
      estimatedWeeksToComplete: st.typicalDurationWeeks
    };
  });

  // Risk Mitigation
  const riskMitigationTips: AdvisorRiskMitigation[] = [
    {
      riskTitle: "ریسک تاخیر در وقت سفارت تهران (ویزامتریک)",
      severity: "critical",
      mitigationStrategyFa: "استفاده از قانون تسریع بند 81a اولویت نوبت سفارت را در کمتر از ۲ تا ۳ هفته فعال می‌کند و از صف عادی ماه‌ها جلوگیری به عمل می‌آورد."
    },
    {
      riskTitle: "ریسک رد قرارداد توسط اداره کار فدرال (ZAV)",
      severity: "warning",
      mitigationStrategyFa: `اطمینان حاصل کنید عنوان شغلی قرارداد کاری با شرح وظایف دانشگاهی تطابق داشته و حقوق ناخالص حداقل سالانه €${fieldOutlookFa.blueCardMinSalaryEur2026.toLocaleString()} درج شده باشد.`
    },
    {
      riskTitle: "ریسک گپ زبانی در مصاحبه کاری",
      severity: "advisory",
      mitigationStrategyFa: isIT 
        ? "در شرکت‌های بین‌المللی برلین و مونیخ، زبان انگلیسی روان ۱۰۰٪ کفایت می‌کند. یادگیری اصطلاحات پایه آلمانی در رزومه حسن نیت و تعهد فرهنگی را ثابت می‌کند."
        : "برای شرکت‌های غیر IT، ارائه مدرک B1 یا B2 شانس قبولی در مصاحبه اولیه را بیش از ۲ برابر افزایش می‌دهد."
    }
  ];

  // Consultation Answer if query exists
  let consultationAnswerFa: string | undefined = undefined;
  if (userQuery && userQuery.trim()) {
    consultationAnswerFa = `پاسخ مشاور هوشمند به پرسش شما («${userQuery}»):
بر اساس مشخصات پرونده شما (${profile.field || "رشته تخصصی"} با ${exp} سال سابقه و مدرک ${profile.degree || "کارشناسی"})، در قوانین مصوب ۲۰۲۶ مهاجرت کاری آلمان، اولویت اصلی شما باید بر دریافت جاب‌آفر با رعایت آستانه حقوقی بلوکارت متمرکز باشد. در صورتی که کارفرما از بند 81a برای تسریع استفاده کند، کلیه موانع بروکراسی سفارت برطرف خواهد شد.`;
  }

  return {
    summaryVerdictFa: `پرونده مهاجرتی شما در شرایط مطلوبی ارزیابی می‌شود. رشته تخصصی شما در فهرست مشاغل با کمبود نیروی ماهر آلمان (Engpassberuf) قرار دارد و با تکمیل منظم گام‌های مشخص‌شده، زمان تخمینی تا اشتغال رسمی در آلمان بین ۴ تا ۷ ماه برآورد می‌گردد.`,
    recommendedPathwayFa,
    pathwayRationaleFa,
    fieldOutlookFa,
    immediateNextSteps,
    roadmapMilestoneAudits,
    riskMitigationTips,
    consultationAnswerFa,
    source: "gemini_rule_based_fallback"
  };
}

export async function fetchGeminiImmigrationAdvice(params: {
  profile: EvaluatorInput;
  progress: ImmigrationProgressState;
  userQuery?: string;
}): Promise<ImmigrationAdvisorReport> {
  try {
    const response = await fetch("/api/gemini/immigration-advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.immediateNextSteps) {
        return data;
      }
    }
  } catch (error) {
    console.warn("Gemini Advisor API call failed, using high-fidelity local advisor fallback:", error);
  }

  // Graceful rule-based fallback
  return generateRuleBasedAdvisorReport(params.profile, params.progress, params.userQuery);
}
