export type JobIndustry = 
  | "it"
  | "engineering"
  | "healthcare"
  | "finance_business"
  | "logistics"
  | "construction"
  | "life_sciences";

export type ExperienceLevel = 
  | "trainee" // کارآموز / Ausbildung
  | "junior"  // تازه‌کار (۰ تا ۲ سال)
  | "mid"     // متخصص و کارشناس (۲ تا ۵ سال)
  | "senior"  // ارشد و سینیور (+۵ سال)
  | "lead";   // راهبر فنی و مدیر

export type WorkplaceType = "remote" | "hybrid" | "onsite";

export type DegreeRequirement = 
  | "diploma_vocational" // دیپلم، کاردانی یا آموزش فنی (Ausbildung)
  | "bachelor"           // کارشناسی
  | "master"             // کارشناسی ارشد یا دکتری
  | "no_degree";         // بدون نیاز به مدرک دانشگاهی (مهارت‌محور / متخصصین IT)

export type EmploymentType = 
  | "full_time" // تمام وقت (Vollzeit)
  | "part_time" // پاره وقت (Teilzeit)
  | "flexible"; // منعطف / توافقی

export interface IranFriendlyEvaluation {
  isFriendly: boolean;
  confidenceScore: number;
  tier: "phase1_high_chance" | "phase2_enterprise";
  badgeLabelFa: string;
  reasonFa: string;
  iranianHiringRecord: "proven_frequent" | "flexible_remote" | "enterprise_rigid";
  remoteInterviewYieldRate: "high" | "moderate" | "low";
  yieldPercentFa: string;
  visaSupportSpeed: string;
  strategicAdviceFa: string;
}

export interface AdvancedJobItem {
  id: string;
  titleFa: string;
  titleDe: string;
  company: string;
  companyLogoText?: string;
  industry: JobIndustry;
  industryLabelFa: string;
  experienceLevel: ExperienceLevel;
  experienceLevelLabelFa: string;
  minYearsExperience: number;
  locationCity: string;
  stateDe: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  degreeRequirement: DegreeRequirement;
  salaryMinEur: number;
  salaryMaxEur: number;
  salaryFormatted: string;
  workLanguage: "English" | "German A1/A2" | "German B1+" | "German B2+" | "German C1" | "Bilingual";
  visaSponsorship: {
    supported: boolean;
    typeLabelFa: string;
    blueCardCompliant: boolean;
    accelerated81aEligible: boolean;
    relocationBonusEur?: number;
  };
  skills: string[];
  descriptionFa: string;
  responsibilitiesFa: string[];
  qualificationsFa: string[];
  benefitsFa: string[];
  contactEmail: string;
  portalLinks: {
    directCompany?: string;
    stepStone?: string;
    linkedIn?: string;
    arbeitsagentur?: string;
  };
  postedDate: string;
  isUrgentHiring?: boolean;
  iranFriendly?: IranFriendlyEvaluation;
}

export const GERMAN_STATES = [
  { id: "all", nameFa: "همه ایالت‌های فدرال (Alle Bundesländer)", nameDe: "Alle Bundesländer" },
  { id: "Bayern", nameFa: "بایرن (باواریا - مونیخ، نورنبرگ)", nameDe: "Bayern" },
  { id: "Baden-Württemberg", nameFa: "بادن-وورتمبرگ (اشتوتگارت، کارلسروهه)", nameDe: "Baden-Württemberg" },
  { id: "Berlin", nameFa: "برلین (ایالت پایتخت)", nameDe: "Berlin" },
  { id: "Hessen", nameFa: "هسن (فرانکفورت، دارمشتات، ویسبادن)", nameDe: "Hessen" },
  { id: "Nordrhein-Westfalen", nameFa: "نوردراین-وستفالن (کلن، دوسلدورف، دورتموند)", nameDe: "Nordrhein-Westfalen" },
  { id: "Hamburg", nameFa: "هامبورگ (ایالت بندری)", nameDe: "Hamburg" },
  { id: "Sachsen", nameFa: "زاکسن (لایپزیگ، درسدن)", nameDe: "Sachsen" },
  { id: "Niedersachsen", nameFa: "نیدرزاکسن (هانوفر، ولفسبورگ)", nameDe: "Niedersachsen" }
];

export const GERMAN_CITIES = [
  { id: "all", nameFa: "تمامی شهرهای آلمان", nameDe: "Ganz Deutschland" },
  { id: "berlin", nameFa: "برلین (پایتخت استارتاپ‌ها)", nameDe: "Berlin" },
  { id: "munich", nameFa: "مونیخ (باواریا - قطب مهندسی و IT)", nameDe: "München" },
  { id: "frankfurt", nameFa: "فرانکفورت (قطب مالی و بانکی)", nameDe: "Frankfurt am Main" },
  { id: "hamburg", nameFa: "هامبورگ (بندرگاه و صنایع مدرن)", nameDe: "Hamburg" },
  { id: "stuttgart", nameFa: "اشتوتگارت (صنایع خودرو و ماشین‌سازی)", nameDe: "Stuttgart" },
  { id: "cologne", nameFa: "کلن (رسانه و فناوری‌های نوین)", nameDe: "Köln" },
  { id: "dusseldorf", nameFa: "دوسلدورف (تجارت بین‌الملل و مشاوره)", nameDe: "Düsseldorf" },
  { id: "leipzig", nameFa: "لایپزیگ (رشد سریع و فناوری)", nameDe: "Leipzig" },
  { id: "nuremberg", nameFa: "نورنبرگ (الکترونیک و اتوماسیون)", nameDe: "Nürnberg" },
  { id: "dresden", nameFa: "درسدن (سیلیکون ساکسونی و نیمه‌هادی)", nameDe: "Dresden" },
  { id: "remote", nameFa: "دورکاری کامل در آلمان (Remote / Homeoffice)", nameDe: "Vollständig Remote" }
];

export const DEGREE_REQUIREMENTS: { id: DegreeRequirement | "all"; labelFa: string; descFa: string }[] = [
  { id: "all", labelFa: "همه مقاطع تحصیلی", descFa: "بدون محدودیت مدرک" },
  { id: "no_degree", labelFa: "بدون نیاز به مدرک دانشگاهی", descFa: "صرفاً بر اساس سابقه کار و مهارت عملی (§19c IT)" },
  { id: "diploma_vocational", labelFa: "کاردانی / دیپلم فنی (Ausbildung)", descFa: "مدرک فنی، کاردانی یا آموزش حرفه‌ای" },
  { id: "bachelor", labelFa: "کارشناسی (Bachelor)", descFa: "حداقل لیسانس معتبر مورد تایید آنابین H+" },
  { id: "master", labelFa: "کارشناسی ارشد یا دکتری (Master / PhD)", descFa: "فوق لیسانس یا دکتری تخصصی" }
];

export const EMPLOYMENT_TYPES: { id: EmploymentType | "all"; labelFa: string; labelDe: string }[] = [
  { id: "all", labelFa: "همه انواع استخدام", labelDe: "Alle Beschäftigungsarten" },
  { id: "full_time", labelFa: "تمام وقت (Vollzeit)", labelDe: "Vollzeit (35-40h)" },
  { id: "part_time", labelFa: "پاره وقت (Teilzeit)", labelDe: "Teilzeit (20-30h)" },
  { id: "flexible", labelFa: "منعطف / پروژه‌ای (Flexibel)", labelDe: "Flexibel / Projektbezogen" }
];

export const LANGUAGE_REQUIREMENTS: { id: string; labelFa: string; labelDe: string }[] = [
  { id: "all", labelFa: "همه سطوح زبان", labelDe: "Alle Sprachen" },
  { id: "English", labelFa: "فقط انگلیسی (بدون نیاز به آلمانی)", labelDe: "Nur Englisch" },
  { id: "German A1/A2", labelFa: "آلمانی مقدماتی (A1/A2)", labelDe: "Deutsch A1/A2" },
  { id: "German B1+", labelFa: "آلمانی متوسط کاری (B1)", labelDe: "Deutsch B1+" },
  { id: "German B2+", labelFa: "آلمانی پیشرفته (B2)", labelDe: "Deutsch B2+" },
  { id: "German C1", labelFa: "آلمانی تخصصی / کادر درمان (C1)", labelDe: "Deutsch C1" },
  { id: "Bilingual", labelFa: "دوزبانه (آلمانی و انگلیسی)", labelDe: "Zweisprachig (DE/EN)" }
];

export const INDUSTRY_CATEGORIES: { id: JobIndustry | "all"; labelFa: string; icon: string }[] = [
  { id: "all", labelFa: "همه صنایع و حوزه‌ها", icon: "Layers" },
  { id: "it", labelFa: "فناوری اطلاعات و نرم‌افزار (IT)", icon: "Code2" },
  { id: "engineering", labelFa: "مهندسی، خودرو و اتوماسیون", icon: "Cpu" },
  { id: "healthcare", labelFa: "بهداشت، پزشکی و پرستاری", icon: "HeartPulse" },
  { id: "finance_business", labelFa: "مدیریت، مالی و بازرگانی", icon: "TrendingUp" },
  { id: "logistics", labelFa: "لجستیک و زنجیره تامین", icon: "Truck" },
  { id: "construction", labelFa: "عمران، معماری و ساخت‌وساز", icon: "Building2" },
  { id: "life_sciences", labelFa: "بیوتکنولوژی و داروسازی", icon: "FlaskConical" }
];

export const EXPERIENCE_LEVELS: { id: ExperienceLevel | "all"; labelFa: string; expYears: string }[] = [
  { id: "all", labelFa: "همه سطوح سابقه کار", expYears: "تمام رده‌ها" },
  { id: "trainee", labelFa: "کارآموز / آوسبیلدونگ (Trainee)", expYears: "بدون نیاز به سابقه / آموزش رسمی" },
  { id: "junior", labelFa: "تازه‌کار / جونیور (Junior)", expYears: "۰ تا ۲ سال سابقه" },
  { id: "mid", labelFa: "متخصص و کارشناس (Mid-level)", expYears: "۲ تا ۵ سال سابقه" },
  { id: "senior", labelFa: "ارشد و سینیور (Senior)", expYears: "۵+ سال سابقه تخصصی" },
  { id: "lead", labelFa: "راهبر فنی و مدیر (Lead / Manager)", expYears: "۷+ سال سابقه و مدیریت تیم" }
];

export const POPULAR_SKILLS = [
  // Programming & Web
  "Python", "Java", "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js", "C++", "C# / .NET", "Go (Golang)", "PHP",
  // Cloud & DevOps
  "Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Linux", "Terraform",
  // Engineering & Industrial
  "SAP", "CAD / SolidWorks", "PLC / Siemens S7", "MATLAB / Simulink", "Catia", "Automotive SPICE", "Embedded C",
  // Healthcare
  "B2 Pflege (پرستاری آلمان)", "ICU / مراقبت ویژه", "Approbation", "Patientenversorgung", "Fachkrankenpfleger",
  // Business & Project
  "Agile / Scrum", "Jira", "SQL / PostgreSQL", "Data Analysis", "Salesforce", "ERP Systems"
];

export function evaluateIranFriendlyForJob(company: string, title: string = ""): IranFriendlyEvaluation {
  const norm = (company || "").toLowerCase().trim();

  // Known enterprise conglomerates with heavy ATS overseas barrier
  if (
    norm.includes("continental") ||
    norm.includes("siemens") ||
    norm.includes("bosch") ||
    norm.includes("bmw") ||
    norm.includes("sap") ||
    norm.includes("dhl") ||
    norm.includes("deutsche post") ||
    norm.includes("allianz") ||
    norm.includes("mercedes") ||
    norm.includes("volkswagen") ||
    norm.includes("audi") ||
    norm.includes("basf") ||
    norm.includes("bayer")
  ) {
    return {
      isFriendly: false,
      confidenceScore: 45,
      tier: "phase2_enterprise",
      badgeLabelFa: "🏢 فاز ۲: ابرشرکت اینترپرایز (گزینه مرحله دوم اپلای)",
      reasonFa: "سیستم‌های فیلترینگ خودکار ATS، بروکراسی سنگین شرکتی و اولویت با نیروهای مقیم در آلمان؛ نرخ جذب مستقیم از ایران پایین است.",
      iranianHiringRecord: "enterprise_rigid",
      remoteInterviewYieldRate: "low",
      yieldPercentFa: "۱۵٪ الی ۲۵٪",
      visaSupportSpeed: "۳ الی ۵ ماه (فرآیند اداری سنگین)",
      strategicAdviceFa: "توصیه کاریابی: رزومه را در مرحله دوم و پس از داشتن جاب‌آفر اولیه در آلمان یا از طریق معرف سازمانی (Employee Referral) از لینکدین ارسال کنید."
    };
  }

  // Agile Scaleups, Healthcare University Clinics, and High-Yield Employers
  if (norm.includes("zalando") || norm.includes("delivery hero") || norm.includes("personio") || norm.includes("celonis")) {
    return {
      isFriendly: true,
      confidenceScore: 98,
      tier: "phase1_high_chance",
      badgeLabelFa: "⭐ فاز ۱: اولویت طلایی (پذیرش فعال نیروهای خارج از اتحادیه اروپا)",
      reasonFa: "فرآیند جذب کاملاً بین‌المللی، سابقه متعدد استخدام مستقیم متخصصان ایرانی، پشتیبانی کامل ویزای بلوکارت و زبان کاری انگلیسی.",
      iranianHiringRecord: "proven_frequent",
      remoteInterviewYieldRate: "high",
      yieldPercentFa: "۷۸٪ الی ۹۰٪",
      visaSupportSpeed: "۲ الی ۴ هفته (تسریع بند 81a)",
      strategicAdviceFa: "ارسال رزومه استاندارد بدون عکس و با تمرکز بر دستاوردهای فنی، به همراه مصاحبه‌های فنی آنلاین مستقیم بدون پیش‌شرط اقامت آلمان."
    };
  }

  if (norm.includes("klinikum") || norm.includes("krankenhaus") || norm.includes("charité") || norm.includes("vivantes") || norm.includes("helios")) {
    return {
      isFriendly: true,
      confidenceScore: 92,
      tier: "phase1_high_chance",
      badgeLabelFa: "⭐ فاز ۱: کلینیک بیمارستانی (کمبود شدید کادر درمان)",
      reasonFa: "بخش بهداشت و درمان آلمان با کمبود صدها هزار پرستار و پزشک مواجه است و بیمارستان‌ها هزینه دوره تطبیقی و اقامت را پوشش می‌دهند.",
      iranianHiringRecord: "proven_frequent",
      remoteInterviewYieldRate: "high",
      yieldPercentFa: "۸۵٪ الی ۹۵٪",
      visaSupportSpeed: "۳ الی ۶ هفته با تسریع دولتی",
      strategicAdviceFa: "ارائه مدرک B2 Pflege یا تاییدیه ثبت‌نام در آزمون شناخت صلاحیت (Kenntnisprüfung) برگ برنده قطعی شماست."
    };
  }

  // Default friendly for scaleups / modern firms
  return {
    isFriendly: true,
    confidenceScore: 85,
    tier: "phase1_high_chance",
    badgeLabelFa: "⭐ فاز ۱: اولویت اول (کارفرمای چابک بین‌المللی)",
    reasonFa: "فرآیند جذب بین‌المللی فعال، پذیرش زبان انگلیسی و عدم وجود فیلترهای تبعیض‌آمیز یا بروکراسی سنگین ابرشرکت‌ها.",
    iranianHiringRecord: "flexible_remote",
    remoteInterviewYieldRate: "high",
    yieldPercentFa: "۶۵٪ الی ۷۵٪",
    visaSupportSpeed: "۳ الی ۴ هفته",
    strategicAdviceFa: "ارسال رزومه و انگیزه نامه شخصی‌سازی شده به همراه پیگیری در شبکه حرفه‌ای لینکدین توصیه می‌شود."
  };
}

const RAW_ADVANCED_JOBS_DATA: AdvancedJobItem[] = [
  // 1. IT - Senior Full-Stack Developer (Berlin)
  {
    id: "job-it-01",
    titleFa: "توسعه‌دهنده ارشد فول‌استک (React / Node.js / TypeScript)",
    titleDe: "Senior Full-Stack Entwickler (TypeScript / Cloud)",
    company: "Zalando SE",
    companyLogoText: "ZAL",
    industry: "it",
    industryLabelFa: "فناوری اطلاعات و نرم‌افزار (IT)",
    experienceLevel: "senior",
    experienceLevelLabelFa: "ارشد و سینیور (Senior)",
    minYearsExperience: 5,
    locationCity: "berlin",
    stateDe: "Berlin",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "no_degree",
    salaryMinEur: 78000,
    salaryMaxEur: 92000,
    salaryFormatted: "۷۸,۰۰۰ - ۹۲,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پشتیبانی کامل بلوکارت اتحادیه اروپا + تسریع بند 81a",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 4500
    },
    skills: ["TypeScript", "React", "Node.js", "AWS", "Docker", "Kubernetes", "Agile / Scrum"],
    descriptionFa: "توسعه و نگهداری سرویس‌های ابری مقیاس‌پذیر در پلتفرم ای-کامرس پیشرو اروپا با بیش از ۵۰ میلیون کاربر فعال.",
    responsibilitiesFa: [
      "معماری و توسعه میکروسرویس‌های پایدار با استفاده از TypeScript و Node.js",
      "طراحی رابط‌های کاربری مدرن با React و بهینه‌سازی پرفورمنس مرورگر",
      "همکاری نزدیک با تیم‌های DevOps جهت استقرار در بستر AWS و Kubernetes",
      "منتورینگ و هدایت مهندسان جونیور و میدلول تیم"
    ],
    qualificationsFa: [
      "حداقل ۵ سال تجربه عملی در توسعه نرم‌افزارهای تجاری با TypeScript و React",
      "تسلط کامل بر معماری میکروسرویس، RESTful API و پایگاه‌های داده NoSQL/SQL",
      "تسلط روان به زبان انگلیسی (محیط کار کاملاً بین‌المللی است؛ زبان آلمانی نیاز نیست)"
    ],
    benefitsFa: [
      "پکیج کمکی جابه‌جایی شامل ۴,۵۰۰ یورو نقد + اسکان موقت رایگان ۱ ماهه در برلین",
      "پوشش کلیه هزینه‌های ویزای بلوکارت برای متقاضی و همسر",
      "۴۰٪ تخفیف خرید شرکتی و بلیط حمل‌ونقل شهری برلین (Deutschlandticket)"
    ],
    contactEmail: "tech-recruiting@zalando.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/full-stack-developer/in-berlin",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Fullstack+Developer+Berlin",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-18",
    isUrgentHiring: true
  },

  // 2. Engineering - Automotive Embedded Systems Engineer (Munich / BMW ecosystem)
  {
    id: "job-eng-01",
    titleFa: "مهندس سیستم‌های نهفته خودرویی (Embedded C++ / AUTOSAR)",
    titleDe: "Embedded Software Ingenieur - Automotive (m/w/d)",
    company: "Continental Automotive Technologies GmbH",
    companyLogoText: "CON",
    industry: "engineering",
    industryLabelFa: "مهندسی، خودرو و اتوماسیون",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 3,
    locationCity: "munich",
    stateDe: "Bayern",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 68000,
    salaryMaxEur: 82000,
    salaryFormatted: "۶۸,۰۰۰ - ۸۲,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "اسپانسری رسمی ویزای متخصصین + واجد شرایط بلوکارت",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 3500
    },
    skills: ["Embedded C", "C++", "Automotive SPICE", "Linux", "MATLAB / Simulink", "Python"],
    descriptionFa: "پیاده‌سازی ماژول‌های کنترلی سیستم‌های ترمز هوشمند و رانندگی خودران (ADAS) برای شرکت‌های معتبر خودروسازی آلمان.",
    responsibilitiesFa: [
      "برنامه‌نویسی سیستم‌های بلادرنگ (Real-Time) بر اساس معماری استاندارد AUTOSAR",
      "تست و اعتبارسنجی نرم‌افزار با شبیه‌سازهای HIL و SIL و گزارش خطایاب",
      "رعایت استانداردهای ایمنی عملکردی ISO 26262 و فرآیندهای ASPICE"
    ],
    qualificationsFa: [
      "مدرک کارشناسی یا ارشد مهندسی برق، کامپیوتر یا مکاترونیک مورد تایید آنابین (H+)",
      "حداقل ۳ سال تجربه در برنامه‌نویسی میکروکنترلرها با C و C++",
      "آشنایی با پروتکل‌های ارتباطی خودرویی (CAN, LIN, Ethernet)"
    ],
    benefitsFa: [
      "قرارداد رسمی بر اساس تعرفه صنایع فلزی و الکترونیک باواریا (IG Metall Tarif)",
      "۳۰ روز مرخصی استحقاقی با حقوق در سال + ساعت کاری منعطف ۳۵ ساعت در هفته",
      "کمک‌هزینه آموزش زبان آلمانی در کالج شرکتی"
    ],
    contactEmail: "automotive-careers@continental.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/embedded-engineer/in-muenchen",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Embedded+Automotive+Munich",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-15"
  },

  // 3. Healthcare - Registered ICU & General Nurse (Frankfurt University Hospital)
  {
    id: "job-health-01",
    titleFa: "پرستار بخش مراقبت‌های ویژه و عمومی (ICU / Station)",
    titleDe: "Pflegefachkraft / Gesundheits- und Krankenpfleger (m/w/d)",
    company: "Universitätsklinikum Frankfurt am Main",
    companyLogoText: "UKF",
    industry: "healthcare",
    industryLabelFa: "بهداشت، پزشکی و پرستاری",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 2,
    locationCity: "frankfurt",
    stateDe: "Hessen",
    workplaceType: "onsite",
    employmentType: "full_time",
    degreeRequirement: "diploma_vocational",
    salaryMinEur: 46000,
    salaryMaxEur: 58000,
    salaryFormatted: "۴۶,۰۰۰ - ۵۸,۰۰۰ یورو در سال + پاداش شیفت",
    workLanguage: "German B2+",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "اسپانسری کامل ویزای کادر درمان + تامین وکیل معادل‌سازی",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 3000
    },
    skills: ["B2 Pflege (پرستاری آلمان)", "Patientenversorgung", "ICU / مراقبت ویژه", "Approbation"],
    descriptionFa: "اشتغال در بیمارستان دانشگاهی مجهز فرانکفورت با ارائه دوره تطبیقی و آمادگی آزمون شناخت صلاحیت حرفه‌ای (Kenntnisprüfung).",
    responsibilitiesFa: [
      "مراقبت و پایش بیماران پس از جراحی‌های سنگین در بخش‌های تخصصی",
      "تجویز دقیق داروها و سرم‌ها مطابق دستور پزشک و ثبت مدارک در سیستم بیمارستانی",
      "ارتباط حرفه‌ای و همدلانه با بیماران و همراهان به زبان آلمانی"
    ],
    qualificationsFa: [
      "مدرک کارشناسی پرستاری یا گواهی رسمی مامایی/بیهوشی از دانشگاه معتبر",
      "مدرک زبان آلمانی حداقل B2 معتبر (گوته، تلک یا ÖSD) با تمرکز پرستاری",
      "حداقل ۲ سال سابقه کار بالینی در بیمارستان‌های جنرال یا تخصصی"
    ],
    benefitsFa: [
      "تامین پانسیون و خوابگاه مبله بیمارستانی با اجاره فوق‌العاده ارزان به مدت ۱ سال",
      "پرداخت ۱۰۰٪ هزینه‌های ترجمه رسمی و آزمون معادل‌سازی در آلمان",
      "پاداش‌های سختی کار شیفت شب، تعطیلات رسمی و اضافه کاری مطابق تعرفه TVöD"
    ],
    contactEmail: "recruiting-pflege@kgu.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/krankenpfleger/in-frankfurt-am-main",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Pflegefachkraft+Frankfurt",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-20",
    isUrgentHiring: true
  },

  // 4. IT - Python & Data Engineer (Munich / Remote)
  {
    id: "job-it-02",
    titleFa: "مهندس داده و کلود (Python / Spark / AWS)",
    titleDe: "Data Engineer Cloud & Big Data (m/w/d)",
    company: "Siemens AG",
    companyLogoText: "SIE",
    industry: "it",
    industryLabelFa: "فناوری اطلاعات و نرم‌افزار (IT)",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 3,
    locationCity: "munich",
    stateDe: "Bayern",
    workplaceType: "remote",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 72000,
    salaryMaxEur: 85000,
    salaryFormatted: "۷۲,۰۰۰ - ۸۵,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "بلوکارت اتحادیه اروپا + فرآیند ویژه متخصصین اینترنت اشیا",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 4000
    },
    skills: ["Python", "SQL / PostgreSQL", "AWS", "Docker", "Kubernetes", "Data Analysis", "CI/CD"],
    descriptionFa: "طراحی و بهینه‌سازی پایپ‌لاین‌های داده برای زیرساخت‌های صنعتی اینترنت اشیا (MindSphere) زیمنس.",
    responsibilitiesFa: [
      "پیاده‌سازی خطوط لوله ETL/ELT مقیاس‌پذیر با استفاده از Python و Apache Spark",
      "مدیریت انبار داده‌های ابری (Data Warehouse / Lakehouse) بر بستر AWS و Snowflake",
      "تضمین کیفیت داده‌ها و پیاده‌سازی سازوکارهای مانیتورینگ خودکار"
    ],
    qualificationsFa: [
      "حداقل ۳ سال تجربه حرفه‌ای به عنوان مهندس داده یا توسعه‌دهنده پایتون",
      "تسلط عالی به SQL پیشرفته، ساختارهای داده و بهینه‌سازی کوئری‌ها",
      "تجربه کار با سیستم‌های توزیع‌شده ابری و ابزارهای مانیتورینگ"
    ],
    benefitsFa: [
      "امکان کار کاملاً از راه دور (Remote) از هر کجای خاک آلمان",
      "بودجه سالانه ۲,۵۰۰ یورویی برای دوره‌ها، سرتیفیکیت‌ها و کنفرانس‌های بین‌المللی",
      "طرح بازنشستگی تکمیلی شرکتی با سوبسید کامل زیمنس"
    ],
    contactEmail: "careers-digital@siemens.com",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/data-engineer/in-muenchen",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Data+Engineer+Siemens",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-19"
  },

  // 5. Engineering - Automation & PLC Engineer (Stuttgart / Bosch)
  {
    id: "job-eng-02",
    titleFa: "مهندس اتوماسیون صنعتی و کنترل خطوط تولید (PLC Siemens S7 / TIA)",
    titleDe: "Automatisierungsingenieur / SPS-Programmierer (m/w/d)",
    company: "Robert Bosch GmbH",
    companyLogoText: "BOS",
    industry: "engineering",
    industryLabelFa: "مهندسی، خودرو و اتوماسیون",
    experienceLevel: "senior",
    experienceLevelLabelFa: "ارشد و سینیور (Senior)",
    minYearsExperience: 6,
    locationCity: "stuttgart",
    stateDe: "Baden-Württemberg",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 75000,
    salaryMaxEur: 88000,
    salaryFormatted: "۷۵,۰۰۰ - ۸۸,۰۰۰ یورو در سال",
    workLanguage: "German B1+",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پشتیبانی کامل ویزای نیروی متخصص (§ 18b) + بلوکارت",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 5000
    },
    skills: ["PLC / Siemens S7", "CAD / SolidWorks", "ERP Systems", "Agile / Scrum", "Python"],
    descriptionFa: "برنامه‌ریزی، پیاده‌سازی و راه‌اندازی خطوط تولید هوشمند مبتنی بر اینداستری ۴.۰ در کارخانجات اشتوتگارت.",
    responsibilitiesFa: [
      "برنامه‌نویسی کنترل‌کننده‌های منطقی قابل برنامه‌ریزی (SPS) در محیط Siemens TIA Portal",
      "طراحی صفحات اپراتوری مانیتورینگ صنعتی (HMI / SCADA WinCC)",
      "رفع اشکال، بهینه‌سازی فرآیندهای تولید و نظارت بر راه‌اندازی خطوط صنعتی جدید"
    ],
    qualificationsFa: [
      "مدرک مهندسی برق، کنترل، اتوماسیون یا مکانیک",
      "حداقل ۶ سال سابقه کار عملی با PLC‌های زیمنس و شبکه‌های صنعتی (Profinet / Profibus)",
      "مهارت زبان آلمانی حداقل در سطح B1 کاری جهت تعامل با تکنسین‌ها و مستندسازی آلمانی"
    ],
    benefitsFa: [
      "طرح سهام شرکتی بوش و پاداش سالانه سودآوری عملکرد",
      "کمک‌هزینه مسکن اولیه و پرداخت هزینه‌های جابه‌جایی خانواده تا ۵,۰۰۰ یورو",
      "خدمات مهدکودک شرکتی برای فرزندان کارکنان در پردیس اشتوتگارت"
    ],
    contactEmail: "automation-jobs@bosch.com",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/sps-programmierer/in-stuttgart",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=SPS+Programmierer+Stuttgart",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-12"
  },

  // 6. IT - Junior DevOps & Cloud Infrastructure (Cologne / Köln)
  {
    id: "job-it-03",
    titleFa: "مهندس جونیور کلود و دوآپس (Linux / Docker / Kubernetes)",
    titleDe: "Junior Cloud & DevOps Engineer (m/w/d)",
    company: "Ströer SE & Co. KGaA",
    companyLogoText: "STR",
    industry: "it",
    industryLabelFa: "فناوری اطلاعات و نرم‌افزار (IT)",
    experienceLevel: "junior",
    experienceLevelLabelFa: "تازه‌کار / جونیور (Junior)",
    minYearsExperience: 1,
    locationCity: "cologne",
    stateDe: "Nordrhein-Westfalen",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "no_degree",
    salaryMinEur: 52000,
    salaryMaxEur: 62000,
    salaryFormatted: "۵۲,۰۰۰ - ۶۲,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پشتیبانی ویزای کاری با کارت فرصت یا ویزای متخصصین",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 2000
    },
    skills: ["Docker", "Kubernetes", "Linux", "Terraform", "CI/CD", "Python"],
    descriptionFa: "فرصتی ایده‌آل برای متخصصان با سابقه ۱ الی ۲ سال جهت ورود به بازار ابری اروپا و یادگیری تکنولوژی‌های پیشرو تحت نظارت مهندسان ارشد.",
    responsibilitiesFa: [
      "پیکربندی و نگهداری کانتینرهای داکر و کلاسترهای کوبرنتیز در محیط آزمایش و تولید",
      "اتوماسیون فرآیندهای استقرار کدهای برنامه‌نویسان با GitLab CI/CD",
      "پایش سلامت سرورها و پاسخگویی به رخدادهای زیرساختی با ابزارهای مانیتورینگ"
    ],
    qualificationsFa: [
      "مدرک مهندسی کامپیوتر یا علوم داده، یا دوره‌های تخصصی معتبر همراه با نمونه‌کار گیت‌هاب",
      "آشنایی قوی با خط فرمان لینوکس، مفاهیم شبکه و اسکریپت‌نویسی Bash یا Python",
      "زبان انگلیسی روان جهت مکاتبات روزمره تیم اسکرام"
    ],
    benefitsFa: [
      "برنامه ویژه آموزش و منتورینگ ۶ ماهه برای ارتقا به سطح Mid-level",
      "تجهیزات کاری اپل (مک‌بوک پرو) به همراه مانیتور ۴K برای هوم‌آفیس",
      "۳۰ روز مرخصی با حقوق و ساعات کاری انعطاف‌پذیر"
    ],
    contactEmail: "tech-talents@stroeer.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/junior-devops/in-koeln",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Junior+DevOps+Koeln",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-21"
  },

  // 7. Finance & Business - SAP S/4HANA Consultant (Frankfurt / Düsseldorf)
  {
    id: "job-fin-01",
    titleFa: "مشاور ارشد استقرار سامانه‌های سازمانی (SAP S/4HANA Finance / FI-CO)",
    titleDe: "Senior SAP Berater FI/CO (m/w/d)",
    company: "PwC Deutschland (PricewaterhouseCoopers)",
    companyLogoText: "PWC",
    industry: "finance_business",
    industryLabelFa: "مدیریت، مالی و بازرگانی",
    experienceLevel: "senior",
    experienceLevelLabelFa: "ارشد و سینیور (Senior)",
    minYearsExperience: 5,
    locationCity: "frankfurt",
    stateDe: "Hessen",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "master",
    salaryMinEur: 85000,
    salaryMaxEur: 105000,
    salaryFormatted: "۸۵,۰۰۰ - ۱۰۵,۰۰۰ یورو در سال + بونوس سالانه",
    workLanguage: "Bilingual",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پوشش کامل بلوکارت و ترانسفر ویزای تجاری (§ 18g)",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 5000
    },
    skills: ["SAP", "ERP Systems", "SQL / PostgreSQL", "Agile / Scrum", "Data Analysis"],
    descriptionFa: "مشاوره و هدایت پروژه‌های تحول دیجیتال مالی برای بانک‌ها و غول‌های صنعتی آلمان در انتقال به ابر SAP S/4HANA.",
    responsibilitiesFa: [
      "تحلیل نیازهای مالی و حسابداری مشتریان و ترسیم فرآیندهای مالی استاندارد در SAP",
      "سفارشی‌سازی (Customizing) ماژول‌های FI و CO و نظارت بر یکپارچگی با سایر سیستم‌ها",
      "آموزش مدیران مالی کارفرما و همراهی در مرحله حساس Go-Live"
    ],
    qualificationsFa: [
      "حداقل ۵ سال تجربه در پروژه‌های پیاده‌سازی و ارتقای SAP FI/CO",
      "تسلط بر زبان انگلیسی و حداقل دانش آلمانی B1 با تمایل به ارتقای سریع",
      "مهارت‌های قوی تحلیلی، مذاکره تجاری و ارائه در سطح مدیران ارشد"
    ],
    benefitsFa: [
      "اتومبیل شرکتی (با انتخاب خودروهای برقی آلمانی مانند آئودی یا بی‌ام‌و) با کارت سوخت/شارژ رایگان",
      "پاداش سالانه عملکرد تا سقف ۲۰ درصد حقوق پایه",
      "بیمه درمانی تکمیلی و مشاوره مالیاتی رایگان برای اظهارنامه سالانه"
    ],
    contactEmail: "sap-consulting-careers@pwc.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/sap-berater/in-frankfurt-am-main",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=SAP+Consultant+Frankfurt",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-10"
  },

  // 8. Logistics & Supply Chain - Supply Chain Specialist (Hamburg Port)
  {
    id: "job-log-01",
    titleFa: "کارشناس زنجیره تامین و لجستیک بین‌الملل (Supply Chain & SAP MM)",
    titleDe: "Supply Chain Manager / Logistikspezialist (m/w/d)",
    company: "Hapag-Lloyd AG",
    companyLogoText: "HL",
    industry: "logistics",
    industryLabelFa: "لجستیک و زنجیره تامین",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 3,
    locationCity: "hamburg",
    stateDe: "Hamburg",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 58000,
    salaryMaxEur: 70000,
    salaryFormatted: "۵۸,۰۰۰ - ۷۰,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "اسپانسری ویزای نیروی متخصص با ویزای بلوکارت",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 3000
    },
    skills: ["ERP Systems", "SAP", "Data Analysis", "Agile / Scrum"],
    descriptionFa: "هماهنگی جریان کالا و بهینه‌سازی مسیرهای کانتینری در پنجمین شرکت کشتیرانی و لجستیک کانتینری بزرگ جهان مستقر در هامبورگ.",
    responsibilitiesFa: [
      "برنامه‌ریزی و بهینه‌سازی ظرفیت‌های حمل بار دریایی و انبارداری مرکزی",
      "تجزیه و تحلیل داده‌های تامین و پیش‌بینی تقاضا با ابزارهای گزارش‌گیری SAP و PowerBI",
      "مذاکره با شرکای تجاری و ارائه‌دهندگان خدمات حمل‌ونقل داخلی در آلمان"
    ],
    qualificationsFa: [
      "مدرک کارشناسی یا بالاتر در مهندسی صنایع، مدیریت لجستیک یا بازرگانی بین‌الملل",
      "حداقل ۳ سال تجربه در زنجیره تامین یا حمل‌ونقل بین‌المللی کالا",
      "تسلط به زبان انگلیسی و توانایی مکالمه عمومی به زبان آلمانی"
    ],
    benefitsFa: [
      "موقعیت اداری در قلب شهر زیبای هامبورگ با چشم‌انداز به رودخانه البه",
      "پوشش هزینه بلیط سفر سراسری آلمان (Deutschlandticket)",
      "کمک‌هزینه مسکن اولیه و تسهیلات الحاق خانواده"
    ],
    contactEmail: "careers-logistics@hapag-lloyd.com",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/supply-chain/in-hamburg",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Supply+Chain+Hamburg",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-17"
  },

  // 9. Engineering - Mechanical & CAD Design Engineer (Stuttgart / Porsche ecosystem)
  {
    id: "job-eng-03",
    titleFa: "مهندس طراح مکانیک و بدنه خودرو (Catia V5 / SolidWorks)",
    titleDe: "Entwicklungsingenieur Karosserie / CAD Konstrukteur (m/w/d)",
    company: "Porsche Engineering Group GmbH",
    companyLogoText: "POR",
    industry: "engineering",
    industryLabelFa: "مهندسی، خودرو و اتوماسیون",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 4,
    locationCity: "stuttgart",
    stateDe: "Baden-Württemberg",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 70000,
    salaryMaxEur: 84000,
    salaryFormatted: "۷۰,۰۰۰ - ۸۴,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پشتیبانی کامل ویزای بلوکارت و اقامت دائم سریع",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 4000
    },
    skills: ["CAD / SolidWorks", "Catia", "Automotive SPICE", "Agile / Scrum"],
    descriptionFa: "طراحی قطعات آیرودینامیک و ساختارهای سبک وزن بدنه برای خودروهای برقی نسل آینده در استودیو مهندسی پورشه.",
    responsibilitiesFa: [
      "مدل‌سازی سه‌بعدی سطوح پیشرفته بدنه با نرم‌افزار CATIA V5 / 3DEXPERIENCE",
      "انجام محاسبات مکانیکی اولیه و تحلیل تلرانس‌ها مطابق با استانداردهای تصادف خودرویی",
      "هماهنگی با زنجیره تامین قطعات و قالب‌سازان صنعتی در ایالت بادن-وورتمبرگ"
    ],
    qualificationsFa: [
      "مدرک کارشناسی یا ارشد مهندسی مکانیک یا طراحی صنعتی",
      "حداقل ۴ سال تجربه عملی در طراحی قطعات تزریق پلاستیک یا ورق‌کاری فلزی",
      "تسلط به زبان انگلیسی؛ زبان آلمانی مزیت عمده محسوب می‌شود"
    ],
    benefitsFa: [
      "طرح اجاره خودروهای اسپرت شرکتی با تخفیف‌های باورنکردنی برای کارکنان",
      "محیط کاری خلاق با دسترسی به چاپگرهای سه‌بعدی و لابراتوارهای پیشرفته متالورژی",
      "پرداخت پاداش‌های فصلی و طرح‌های سلامت و باشگاه ورزشی اختصاصی"
    ],
    contactEmail: "engineering-careers@porsche.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/cad-konstrukteur/in-stuttgart",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=CAD+Konstrukteur+Stuttgart",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-14"
  },

  // 10. IT - Trainee / Junior Software Developer (Leipzig / Tech Hub)
  {
    id: "job-it-04",
    titleFa: "کارآموز و برنامه‌نویس جونیور جاوا و بک‌اند (Trainee Java / Spring Boot)",
    titleDe: "Trainee Softwareentwicklung Backend (Java / Spring) (m/w/d)",
    company: "Spread Group (Leipzig Hub)",
    companyLogoText: "SPR",
    industry: "it",
    industryLabelFa: "فناوری اطلاعات و نرم‌افزار (IT)",
    experienceLevel: "trainee",
    experienceLevelLabelFa: "کارآموز / آوسبیلدونگ (Trainee)",
    minYearsExperience: 0,
    locationCity: "leipzig",
    stateDe: "Sachsen",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "diploma_vocational",
    salaryMinEur: 42000,
    salaryMaxEur: 48000,
    salaryFormatted: "۴۲,۰۰۰ - ۴۸,۰۰۰ یورو در سال (دوره آموزشی)",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پشتیبانی ویزای آموزش حرفه‌ای / کارت فرصت آلمان",
      blueCardCompliant: false,
      accelerated81aEligible: true,
      relocationBonusEur: 1500
    },
    skills: ["Java", "SQL / PostgreSQL", "Docker", "Git", "Agile / Scrum"],
    descriptionFa: "برنامه ترینی ۱۲ ماهه فشرده برای ورود رسمی فارغ‌التحصیلان جدید به حوزه مهندسی نرم‌افزار تجاری همراه با تبدیل قطعی به قرارداد دائم.",
    responsibilitiesFa: [
      "مشارکت در کدنویسی ماژول‌های بک‌اند با Java 21 و فریم‌ورک محبوب Spring Boot",
      "نوشتن تست‌های واحد (Unit Testing) با JUnit و تضمین پوشش کیفی کدهای توسعه‌یافته",
      "حضور در دوره‌های هفتگی کدریویو و متدولوژی‌های مدیریت چابک اسکرام"
    ],
    qualificationsFa: [
      "فارغ‌التحصیل مهندسی نرم‌افزار، فناوری اطلاعات، علوم کامپیوتر یا رشته‌های ریاضی",
      "آشنایی پایه با مفاهیم شیءگرایی در جاوا و دیتابیس‌های رابطه‌ای",
      "اشتیاق بالا به یادگیری و زبان انگلیسی مناسب جهت حضور در جلسات تیمی"
    ],
    benefitsFa: [
      "هزینه‌های زندگی مقرون‌به‌صرفه در شهر دانشگاهی و فرهنگی لایپزیگ",
      "تضمین تبدیل قرارداد به قرارداد دائم با حقوق ۵۵K+ پس از اتمام دوره ۱۲ ماهه",
      "میز کار ارگونومیک، ناهار رایگان روزانه و بلیت حمل‌ونقل شهری"
    ],
    contactEmail: "trainee-jobs@spreadshirt.net",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/trainee-java/in-leipzig",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Java+Trainee+Leipzig",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-22",
    isUrgentHiring: true
  },

  // 11. Construction & Civil - BIM & Structural Engineer (Berlin / Infrastructure)
  {
    id: "job-con-01",
    titleFa: "مهندس محاسب سازه و متخصص مدل‌سازی اطلاعات ساختمان (BIM / Revit)",
    titleDe: "Bauingenieur / BIM-Konstrukteur Hochbau (m/w/d)",
    company: "Züblin AG (Ed. Züblin)",
    companyLogoText: "ZUB",
    industry: "construction",
    industryLabelFa: "عمران، معماری و ساخت‌وساز",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 3,
    locationCity: "berlin",
    stateDe: "Berlin",
    workplaceType: "onsite",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 62000,
    salaryMaxEur: 74000,
    salaryFormatted: "۶۲,۰۰۰ - ۷۴,۰۰۰ یورو در سال",
    workLanguage: "German B2+",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "ویزای تخصصی نیروی کار مهندسی با بلوکارت",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 3000
    },
    skills: ["CAD / SolidWorks", "ERP Systems", "Agile / Scrum"],
    descriptionFa: "مدیریت مدل‌های سه‌بعدی BIM برای ابرپروژه‌های ساختمانی، تجاری و زیرساخت‌های حمل‌ونقل شهری پایتخت آلمان.",
    responsibilitiesFa: [
      "تولید و هماهنگی مدل‌های چندرشته‌ای BIM با استفاده از نرم‌افزارهای Autodesk Revit",
      "بررسی تداخلات اجزای سازه با تاسیسات مکانیکی و الکتریکی (Clash Detection)",
      "نظارت بر تطابق نقشه‌های اجرایی با استانداردهای مهندسی ساختمان آلمان (DIN / Eurocodes)"
    ],
    qualificationsFa: [
      "مدرک مهندسی عمران، معماری یا مدیریت پروژه ساختمانی مورد تایید آنابین (H+)",
      "حداقل ۳ سال تجربه کار با ابزارهای BIM و تسلط بر استانداردهای نقشه‌کشی ساختمانی",
      "مدرک زبان آلمانی B2 کاری برای ارتباط مستقیم با پیمانکاران محلی در آلمان"
    ],
    benefitsFa: [
      "امنیت شغلی فوق‌العاده در بزرگ‌ترین گروه ساختمانی صنعتی آلمان",
      "تجهیزات ایمنی اختصاصی و خودروی ماموریتی برای بازدید از سایت‌های پروژه",
      "برنامه ویژه آمادگی جهت عضویت رسمی در سازمان نظام مهندسی آلمان (Ingenieurkammer)"
    ],
    contactEmail: "karriere-berlin@zueblin.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/bim-konstrukteur/in-berlin",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=BIM+Ingenieur+Berlin",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-16"
  },

  // 12. Life Sciences - QC Analyst / Chemical Laboratory Specialist (Darmstadt / Merck)
  {
    id: "job-bio-01",
    titleFa: "کارشناس کنترل کیفیت دارویی و شیمی تجزیه (HPLC / GMP)",
    titleDe: "Qualitätskontrolleur / Chemielaborant Pharma (m/w/d)",
    company: "Merck KGaA",
    companyLogoText: "MRK",
    industry: "life_sciences",
    industryLabelFa: "بیوتکنولوژی و داروسازی",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 3,
    locationCity: "frankfurt",
    stateDe: "Hessen",
    workplaceType: "onsite",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 60000,
    salaryMaxEur: 72000,
    salaryFormatted: "۶۰,۰۰۰ - ۷۲,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "اسپانسری ویزای بلوکارت و فرآیند تسریع‌شده دارو و بیوتک",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 3500
    },
    skills: ["Data Analysis", "SQL / PostgreSQL", "ERP Systems"],
    descriptionFa: "آنالیز و آزمون‌های رهایش داروهای انکولوژی و بیوتکنولوژی مطابق استانداردهای سخت‌گیرانه سازمان دارویی اروپا (EMA).",
    responsibilitiesFa: [
      "انجام آزمون‌های کنترل کیفی با دستگاه‌های کروماتوگرافی مایع با کارایی بالا (HPLC / GC)",
      "اعتبارسنجی روش‌های آنالیتیکال و ثبت دقیق کلیه گزارش‌ها در سیستم LIMS",
      "رعایت دقیق موازین بهداشتی و ایمنی محیط‌های اتاق تمیز (Cleanroom) و دستورالعمل‌های cGMP"
    ],
    qualificationsFa: [
      "مدرک کارشناسی یا کارشناسی ارشد در شیمی، داروسازی، بیوتکنولوژی یا علوم زیستی",
      "حداقل ۳ سال تجربه کار در آزمایشگاه‌های کنترل کیفیت دارویی مطابق استاندارد GMP",
      "تسلط به زبان انگلیسی و مستندسازی فنی آزمایشگاهی"
    ],
    benefitsFa: [
      "تعرفه پرداخت بسیار عالی صنایع شیمیایی آلمان (Tarifvertrag Chemie)",
      "رستوران‌های شرکتی ارگانیک و امکانات ورزشی مجهز در پردیس مرکزی درمشتات",
      "بیمه درمان تکمیلی بین‌المللی و پرداخت کمک‌هزینه انتقال اثاثیه به آلمان"
    ],
    contactEmail: "pharma-recruitment@merckgroup.com",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/chemielaborant/in-darmstadt",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Qualitaetskontrolle+Pharma+Merck",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-13"
  },

  // 13. Part-Time / Flexible IT Position - Frontend Developer (Munich / Personio)
  {
    id: "job-it-parttime-01",
    titleFa: "توسعه‌دهنده فرانت‌اند پاره وقت (React / TypeScript - ۲۰ الی ۲۵ ساعت در هفته)",
    titleDe: "Frontend Entwickler in Teilzeit (React / Next.js) (m/w/d)",
    company: "Personio SE & Co. KG",
    companyLogoText: "PER",
    industry: "it",
    industryLabelFa: "فناوری اطلاعات و نرم‌افزار (IT)",
    experienceLevel: "mid",
    experienceLevelLabelFa: "متخصص و کارشناس (Mid-level)",
    minYearsExperience: 3,
    locationCity: "munich",
    stateDe: "Bayern",
    workplaceType: "hybrid",
    employmentType: "part_time",
    degreeRequirement: "no_degree",
    salaryMinEur: 38000,
    salaryMaxEur: 46000,
    salaryFormatted: "۳۸,۰۰۰ - ۴۶,۰۰۰ یورو در سال (پاره وقت)",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پشتیبانی ویزای کارت فرصت پاره‌وقت یا تبدیل ویزای دانشجویی",
      blueCardCompliant: false,
      accelerated81aEligible: true,
      relocationBonusEur: 2000
    },
    skills: ["React", "TypeScript", "JavaScript", "Agile / Scrum"],
    descriptionFa: "پوزیشن پاره‌وقت ایده‌آل برای دارندگان کارت فرصت آلمان (تا ۲۰ ساعت در هفته مجاز به کار) یا دانشجویان ارشد مقیم با امکان افزایش به تمام‌وقت.",
    responsibilitiesFa: [
      "طراحی و نگهداری ماژول‌های داشبورد کاربری پلتفرم HR Personio با React و Tailwind CSS",
      "بهینه‌سازی دسترس‌پذیری (a11y) و سرعت بارگذاری صفحات وب",
      "همکاری نزدیک با طراحان محصول و تیم بک‌اند به زبان انگلیسی"
    ],
    qualificationsFa: [
      "حداقل ۳ سال تجربه حرفه‌ای در فرانت‌اند با React و اکوسیستم تایپ‌اسکریپت",
      "تسلط کامل به زبان انگلیسی؛ بدون نیاز به زبان آلمانی",
      "انعطاف‌پذیری در ساعات کاری هفتگی بر اساس توافق"
    ],
    benefitsFa: [
      "ساعات کاری کاملاً انعطاف‌پذیر با امکان تطبیق با کلاس‌های زبان یا دانشگاه",
      "دفتر مدرک در مونیخ با صبحانه و ناهار رایگان",
      "امکان تبدیل به قرارداد تمام‌وقت همراه با بلوکارت پس از ۶ ماه"
    ],
    contactEmail: "jobs-parttime@personio.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/frontend-teilzeit/in-muenchen",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Frontend+Teilzeit+Munich",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-21",
    isUrgentHiring: true
  },

  // 14. Master / PhD Engineering Specialist - AI & Computer Vision (Dresden / Silicon Saxony)
  {
    id: "job-eng-master-01",
    titleFa: "دانشمند هوش مصنوعی و بینایی ماشین (AI / Computer Vision Specialist)",
    titleDe: "Research Scientist Computer Vision & Deep Learning (m/w/d)",
    company: "Infineon Technologies AG",
    companyLogoText: "INF",
    industry: "engineering",
    industryLabelFa: "مهندسی، خودرو و اتوماسیون",
    experienceLevel: "lead",
    experienceLevelLabelFa: "راهبر فنی و مدیر (Lead / Manager)",
    minYearsExperience: 5,
    locationCity: "dresden",
    stateDe: "Sachsen",
    workplaceType: "hybrid",
    employmentType: "full_time",
    degreeRequirement: "master",
    salaryMinEur: 88000,
    salaryMaxEur: 110000,
    salaryFormatted: "۸۸,۰۰۰ - ۱۱۰,۰۰۰ یورو در سال + پاداش ثبت اختراع",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "بلوکارت ویژه پژوهشگران و نخبگان علمی (§ 18g / § 18d)",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 6000
    },
    skills: ["Python", "C++", "Data Analysis", "Linux", "MATLAB / Simulink"],
    descriptionFa: "توسعه مدل‌های هوش مصنوعی تشخیص عیوب در مقیاس نانو برای خطوط فوق‌پیشرفته تولید تراشه در قطب نیمه‌هادی درسدن.",
    responsibilitiesFa: [
      "توسعه الگوریتم‌های یادگیری عمیق (CNN / Transformers) برای پردازش تصاویر میکروسکوپی",
      "بهینه‌سازی مدل‌های هوش مصنوعی جهت اجرا روی چیپ‌های لبه (Edge AI) اینفینئون",
      "انتشار مقالات علمی و ثبت پتنت‌های بین‌المللی با حمایت کامل شرکت"
    ],
    qualificationsFa: [
      "مدرک کارشناسی ارشد یا دکتری در هوش مصنوعی، بینایی ماشین، فیزیک یا مهندسی برق",
      "حداقل ۵ سال تجربه پژوهشی یا صنعتی همراه با مقالات منتشر شده معتبر",
      "تسلط کامل به زبان انگلیسی؛ زبان آلمانی اختیاری است"
    ],
    benefitsFa: [
      "کمک‌هزینه انتقال خانواده به شهر تاریخی و سرسبز درسدن به مبلغ ۶,۰۰۰ یورو",
      "بیمه بازنشستگی تکمیلی ممتاز و ساعات کاری پژوهشی منعطف",
      "دسترسی به قدرتمندترین ابررایانه‌ها و پردازنده‌های گرافیکی اروپا"
    ],
    contactEmail: "research-careers@infineon.com",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/computer-vision/in-dresden",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Computer+Vision+Infineon",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-18"
  },

  // 15. Healthcare - Medical Assistant / Nurse Part-Time (Düsseldorf / Helios)
  {
    id: "job-health-parttime-01",
    titleFa: "دستیار درمان و بهیار پاره وقت (Pflegehelfer / Teilzeit - ۲۵ ساعت در هفته)",
    titleDe: "Pflegehelfer / Medizinischer Fachangestellter in Teilzeit (m/w/d)",
    company: "Helios Kliniken GmbH",
    companyLogoText: "HEL",
    industry: "healthcare",
    industryLabelFa: "بهداشت، پزشکی و پرستاری",
    experienceLevel: "junior",
    experienceLevelLabelFa: "تازه‌کار / جونیور (Junior)",
    minYearsExperience: 1,
    locationCity: "dusseldorf",
    stateDe: "Nordrhein-Westfalen",
    workplaceType: "onsite",
    employmentType: "part_time",
    degreeRequirement: "diploma_vocational",
    salaryMinEur: 28000,
    salaryMaxEur: 35000,
    salaryFormatted: "۲۸,۰۰۰ - ۳۵,۰۰۰ یورو در سال (پاره وقت ۲۵ ساعت)",
    workLanguage: "German B1+",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "پشتیبانی ویزای آموزش حرفه‌ای یا ارتقای شغلی کادر درمان",
      blueCardCompliant: false,
      accelerated81aEligible: true,
      relocationBonusEur: 1500
    },
    skills: ["Patientenversorgung", "B2 Pflege (پرستاری آلمان)"],
    descriptionFa: "فرصت شغلی پاره‌وقت برای کمک‌بهیاران یا دارندگان دیپلم بهیاری در کلینیک مجهز دوسلدورف با برنامه ارتقای شغلی به پرستار رسمی.",
    responsibilitiesFa: [
      "کمک به بهداشت فردی و تغذیه بیماران در بخش‌های بستری عمومی",
      "اندازه‌گیری و ثبت علائم حیاتی (فشار خون، قند، دما)",
      "همراهی بیماران در آزمایشگاه‌ها و انتقال به اتاق‌های تصویربرداری"
    ],
    qualificationsFa: [
      "مدرک دیپلم بهیاری، کمک‌پرستاری یا امدادگری هلال‌احمر",
      "سطح زبان آلمانی حداقل B1 تایید شده جهت تعامل روزمره با بیماران",
      "انگیزه بالا برای ورود به دوره آوسبیلدونگ پرستاری رسمی"
    ],
    benefitsFa: [
      "ساعات کاری شیفت صبح یا بعدازظهر منعطف برای تطبیق با زندگی خانوادگی",
      "پوشش هزینه کامل کلاس‌های فشرده آلمانی سطح B2 Pflege توسط بیمارستان",
      "تضمین استخدام تمام‌وقت به عنوان پرستار رسمی پس از اتمام دوره معادل‌سازی"
    ],
    contactEmail: "duesseldorf-pflege@helios-gesundheit.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/pflegehelfer-teilzeit/in-duesseldorf",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Pflegehelfer+Duesseldorf",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-20"
  },

  // 16. IT - Lead Cloud Solutions Architect (Nuremberg / Remote)
  {
    id: "job-it-lead-01",
    titleFa: "راهبر ارشد معماری ابر و امنیت شبکه (Lead Cloud Architect - AWS/Azure)",
    titleDe: "Lead Cloud Architect & Security Specialist (m/w/d)",
    company: "Datev eG (Nuremberg Hub)",
    companyLogoText: "DAT",
    industry: "it",
    industryLabelFa: "فناوری اطلاعات و نرم‌افزار (IT)",
    experienceLevel: "lead",
    experienceLevelLabelFa: "راهبر فنی و مدیر (Lead / Manager)",
    minYearsExperience: 7,
    locationCity: "nuremberg",
    stateDe: "Bayern",
    workplaceType: "remote",
    employmentType: "full_time",
    degreeRequirement: "bachelor",
    salaryMinEur: 95000,
    salaryMaxEur: 118000,
    salaryFormatted: "۹۵,۰۰۰ - ۱۱۸,۰۰۰ یورو در سال",
    workLanguage: "English",
    visaSponsorship: {
      supported: true,
      typeLabelFa: "بلوکارت اتحادیه اروپا + فرآیند ویژه مدیران و متخصصان کلیدی",
      blueCardCompliant: true,
      accelerated81aEligible: true,
      relocationBonusEur: 5000
    },
    skills: ["AWS", "Azure", "Terraform", "Kubernetes", "Linux", "CI/CD", "Docker"],
    descriptionFa: "رهبری معماری مهاجرت سامانه‌های مالی و مالیاتی آلمان به ابر عمومی امن در تعاونی نرم‌افزاری پیشرو نورنبرگ.",
    responsibilitiesFa: [
      "طراحی معماری ابر چندگانه (Multi-Cloud) با رعایت الزامات سخت‌گیرانه GDPR و BSI C5",
      "رهبری فنی تیم ۲۰ نفره از مهندسان DevOps و معماران زیرساخت",
      "ارزیابی ریسک‌های امنیتی و اتوماسیون زیرساخت بر پایه کد (IaC Terraform)"
    ],
    qualificationsFa: [
      "حداقل ۷ سال تجربه فنی در طراحی سیستم‌های ابری با مقیاس بالا",
      "داشتن مدارک معتبر معمار ارشد AWS Certified Solutions Architect یا Azure Solutions Architect Expert",
      "تسلط عالی به زبان انگلیسی کاری؛ زبان آلمانی مزیت محسوب می‌شود"
    ],
    benefitsFa: [
      "امکان کار ۱۰۰٪ از راه دور (Remote) از سراسر شهرهای آلمان با تجهیزات کامل اداری",
      "پاداش سود سالانه شرکتی و عضویت در طرح بازنشستگی ممتاز تعاونی Datev",
      "۳۲ روز مرخصی استحقاقی با حقوق در سال"
    ],
    contactEmail: "cloud-leadership@datev.de",
    portalLinks: {
      stepStone: "https://www.stepstone.de/jobs/cloud-architect/in-nuernberg",
      linkedIn: "https://www.linkedin.com/jobs/search/?keywords=Cloud+Architect+Datev",
      arbeitsagentur: "https://www.arbeitsagentur.de/jobsuche/"
    },
    postedDate: "2026-06-19",
    isUrgentHiring: true
  }
];

export const ADVANCED_JOBS_DATA: AdvancedJobItem[] = RAW_ADVANCED_JOBS_DATA.map(job => {
  const iranFriendly = evaluateIranFriendlyForJob(job.company, job.titleFa);
  return {
    ...job,
    iranFriendly
  };
});
