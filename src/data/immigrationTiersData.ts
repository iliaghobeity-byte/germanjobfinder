/**
 * Data structures and definitions for German Immigration Tiers (Skilled Worker, Student, Chancenkarte, Ausbildung)
 * aligned with the 2024-2026 German Skilled Immigration Act (Fachkräfteeinwanderungsgesetz - FEG 2026).
 */

export type ImmigrationTierId = "skilled_worker" | "student" | "chancenkarte" | "ausbildung";

export interface TierStep {
  stepNumber: number;
  titleFa: string;
  titleDe: string;
  timeframe: string; // e.g. "ماه ۱ تا ۲"
  summary: string;
  keyActions: string[];
  tips?: string[];
  warnings?: string[];
  checklist: string[];
  relevantArticleId?: string; // id in GUIDE_ARTICLES
  officialLink?: {
    title: string;
    url: string;
  };
}

export interface KeySuccessFactor {
  id: string;
  titleFa: string;
  titleDe: string;
  categoryTag: string; // e.g. "شتاب‌دهنده کنسولی", "تمکن مالی", "تله اداری", "تاکتیک استخدام", "مدارک و ZAB"
  impactLevel: "vital" | "high" | "competitive_edge"; // vital = الزامات ۱۰۰٪ حیاتی, high = کلیدی, competitive_edge = مزیت رقابتی
  impactLabelFa: string;
  explanation: string;
  actionableStep: string;
  officialRef?: string;
  metricNote?: string;
}

export interface ImmigrationTier {
  id: ImmigrationTierId;
  titleFa: string;
  titleDe: string;
  badge: string;
  badgeColor: string; // Tailwind class
  accentColor: string; // Tailwind color name
  iconName: string;
  shortDescription: string;
  legalParagraph: string;
  targetAudience: string;
  totalEstimatedDuration: string;
  estimatedFinancialRequirement: string;
  keyMetrics: Array<{
    label: string;
    value: string;
    sublabel?: string;
  }>;
  advantages: string[];
  criticalRequirements: string[];
  keySuccessFactors: KeySuccessFactor[];
  steps: TierStep[];
  relevantArticleIds: string[]; // List of article IDs to filter in guide
}

export const IMMIGRATION_TIERS: ImmigrationTier[] = [
  // -------------------------------------------------------------------------
  // 1. SKILLED PROFESSIONAL (نیروی متخصص، بلوکارت و کارشناسان)
  // -------------------------------------------------------------------------
  {
    id: "skilled_worker",
    titleFa: "نیروی متخصص، کاری و بلوکارت اروپا",
    titleDe: "Fachkräfteeinwanderung & Blaue Karte EU",
    badge: "رده ۱: استخدام مستقیم و قرارداد کاری",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    accentColor: "indigo",
    iconName: "Briefcase",
    shortDescription: "سریع‌ترین و مطمئن‌ترین مسیر مهاجرت با پیشنهاد شغلی قطعی (Job Offer)، بلوکارت اروپا و امکان اخذ اقامت دائم در کمتر از ۲ سال.",
    legalParagraph: "§ 18a, § 18b, § 18g AufenthG (قانون FEG 2026)",
    targetAudience: "فارغ‌التحصیلان دانشگاهی، مهندسان، متخصصان IT (حتی بدون مدرک دانشگاهی با ۳ سال سابقه کار) و دارندگان مهارت‌های تخصصی.",
    totalEstimatedDuration: "۳ تا ۶ ماه (با تسریع بند 81a: کمتر از ۲ ماه)",
    estimatedFinancialRequirement: "بدون نیاز به حساب مسدود (حقوق ماهیانه کارفرما کفایت می‌کند)",
    keyMetrics: [
      {
        label: "کف حقوق بلوکارت (مشاغل کمبود نیرو MINT)",
        value: "۴۱,۰۴۱ €",
        sublabel: "سالانه برای رشته‌های ریاضی، IT، مهندسی، علوم پایه و پزشکی"
      },
      {
        label: "کف حقوق بلوکارت عمومی",
        value: "۴۵,۳۰۰ €",
        sublabel: "سالانه برای سایر رشته‌های عمومی و مدیریتی"
      },
      {
        label: "سطح زبان مورد نیاز",
        value: "B1/B2 یا C1 انگلیسی",
        sublabel: "برای مشاغل انگلیسی‌زبان IT مدرک آلمانی الزامی نیست"
      },
      {
        label: "زمان اخذ اقامت دائم (Niederlassung)",
        value: "۲۱ الی ۲۷ ماه",
        sublabel: "۲۱ ماه با مدرک زبان B1، یا ۲۷ ماه با زبان پایه A1"
      }
    ],
    advantages: [
      "ورود به آلمان با درآمد پایدار و بدون ریسک مالی",
      "حق الحاق همزمان همسر و فرزندان بدون شرط مدرک زبان همسر",
      "امکان تغییر کارفرما پس از ۱۲ ماه بدون نیاز به موافقت اداره کار",
      "مسیر سریع اخذ تابعیت و پاسپورت آلمانی (۳ الی ۵ سال)"
    ],
    criticalRequirements: [
      "قرارداد کاری معتبر با حداقل ساعات کاری ۳۵ الی ۴۰ ساعت در هفته",
      "ارزشیابی مدرک دانشگاهی در آنابین (H+) یا تاییدیه ZAB",
      "انطباق حقوق قرارداد با کف مصوب سال ۲۰۲۶ آلمان"
    ],
    keySuccessFactors: [
      {
        id: "ksf_sw_fasttrack",
        titleFa: "فعال‌سازی فرآیند تسریع‌شده کارفرما (بند 81a)",
        titleDe: "Beschleunigtes Fachkräfteverfahren nach § 81a AufenthG",
        categoryTag: "شتاب‌دهنده کنسولی و ویزا",
        impactLevel: "vital",
        impactLabelFa: "کاهش ۸۰٪ زمان ویزا",
        explanation: "اگر کارفرما با پرداخت ۴۱۱ یورو عوارض دولتی، وکالت بند 81a را در اداره مهاجرت محلی آلمان ثبت کند، تاییدیه مقدماتی فدرال (Vorabzustimmung der Bundesagentur für Arbeit) صادر شده و وقت سفارت به جای ۶ الی ۹ ماه، ظرف حداکثر ۳ هفته اختصاص می‌یابد.",
        actionableStep: "در مرحله توافق با کارفرما، فرم درخواست Beschleunigtes Fachkräfteverfahren را با وکالت‌نامه رسمی به بخش منابع انسانی (HR) تحویل داده و پیگیری را با آنها هماهنگ کنید.",
        officialRef: "§ 81a AufenthG (قانون FEG)",
        metricNote: "زمان انتظار سفارت: کمتر از ۳ هفته"
      },
      {
        id: "ksf_sw_recognition",
        titleFa: "استعلام زودهنگام مدرک در آنابین و ارزشیابی ZAB",
        titleDe: "Frühzeitige ZAB-Zeugnisbewertung & Anabin H+",
        categoryTag: "تله کنسولی و اداری",
        impactLevel: "vital",
        impactLabelFa: "شرط رد/قبول پرونده",
        explanation: "آژانس کار فدرال آلمان (ZAV) برای صدور مجوز کار، استعلام مستقیم مدرک H+ از پایگاه آنابین یا تاییدیه کتبی ارزشیابی ZAB را الزامی می‌داند؛ عدم تطابق دقیق عنوان مدرک با عنوان شغلی اصلی‌ترین دلیل تعلیق پرونده‌ها در کنسولگری است.",
        actionableStep: "همین امروز صفحه وضعیت دانشگاه خود را از سایت Anabin با تاریخ و آدرس وب پرینت بگیرید؛ در صورت وضعیت H+/- یا عدم انطباق رشته، فورا پرونده دیجیتال ZAB را تشکیل دهید.",
        officialRef: "KMK / ZAB Zeugnisbewertung",
        metricNote: "زمان صدور با قرارداد: حدود ۳ هفته"
      },
      {
        id: "ksf_sw_salary_threshold",
        titleFa: "انطباق حقوق ناخالص با کف قانونی بلوکارت ۲۰۲۶",
        titleDe: "Einhaltung der Gehaltsschwellen für Blaue Karte EU",
        categoryTag: "قرارداد و امور مالی",
        impactLevel: "high",
        impactLabelFa: "معیار صدور بلوکارت",
        explanation: "در سال ۲۰۲۶، حداقل حقوق سالانه برای مشاغل پرتقاضا (MINT: فناوری اطلاعات، مهندسی، علوم پایه، پزشکی) مبلغ ۴۱,۰۴۱ یورو و برای سایر مشاغل ۴۵,۳۰۰ یورو است. دریافت حقوق پایین‌تر از این حد، فرآیند را وارد مرحله زمان‌بر بررسی بازار کار آلمان می‌کند.",
        actionableStep: "پیش‌نویس قرارداد کاری (Arbeitsvertrag) را پیش از امضا بررسی کنید تا علاوه بر حقوق ناخالص سالانه، ۳۵ الی ۴۰ ساعت کار در هفته و کد شغلی متناسب تصریح شده باشد.",
        officialRef: "§ 18g AufenthG (Blaue Karte EU)",
        metricNote: "کف حقوق: ۴۱,۰۴۱ € تا ۴۵,۳۰۰ €"
      },
      {
        id: "ksf_sw_ats_din5008",
        titleFa: "استانداردسازی رزومه به فرمت DIN 5008 و سیستم ATS",
        titleDe: "Bewerbungsstandards nach DIN 5008 & ATS-Optimierung",
        categoryTag: "تاکتیک استخدام و مصاحبه",
        impactLevel: "competitive_edge",
        impactLabelFa: "افزایش ۴ برابری شانس مصاحبه",
        explanation: "بیش از ۸۵٪ شرکت‌های آلمانی رزومه‌ها را ابتدا با سامانه‌های ATS فیلتر می‌کنند؛ وجود گپ زمانی اعلام‌نشده در سوابق کاری، یا رزومه‌های بیشتر از ۲ صفحه، بلافاصله رد می‌شوند. درج دقیق کلیدواژه‌های صنعتی آلمان (مانند Scrum, Docker, ISO) تاثیر قاطعی در قبولی دارد.",
        actionableStep: "رزومه را به صورت کرونولوژیک معکوس و بدون فاصله زمانی (Lückenlos) با تفکیک مشخص ابزارها و خروجی‌های عددی به فرمت DIN 5008 تنظیم کنید.",
        officialRef: "DIN 5008 Bewerbungsstandard",
        metricNote: "حداکثر ۲ صفحه + عکس استاندارد اداری"
      }
    ],
    relevantArticleIds: [
      "stages-complete-roadmap",
      "stages-recognition-zab-anabin",
      "stages-german-cv-application",
      "stages-fast-track-81a",
      "visas-eu-blue-card",
      "visas-chancenkarte-guide",
      "application-appointment-checklist",
      "application-health-insurance-entry",
      "work-culture-hours-vacation-rights"
    ],
    steps: [
      {
        stepNumber: 1,
        titleFa: "ارزیابی صلاحیت و معادل‌سازی مدرک تحصیلی",
        titleDe: "Anerkennung & Anabin/ZAB-Zeugnisbewertung",
        timeframe: "ماه ۱",
        summary: "بررسی وضعیت دانشگاه و رشته در پایگاه داده آنابین و در صورت لزوم درخواست تاییدیه ارزشیابی دیجیتال ZAB.",
        keyActions: [
          "جستجوی دانشگاه و رشته تحصیلی در سایت Anabin و استخراج برگه وضعیت H+.",
          "در صورت H+/- بودن دانشگاه یا عدم تطابق رشته، اقدام برای Zeugnisbewertung در سامانه آنلاین ZAB.",
          "برای متخصصان IT با حداقل ۳ سال سابقه کار تخصصی، بررسی معافیت از شرط مدرک تحصیلی طبق بند § 19c."
        ],
        tips: [
          "اسکرین‌شات از آنابین باید دارای تاریخ روز و آدرس وب کامل باشد تا در کنسولگری مورد قبول قرار گیرد.",
          "ارزشیابی ZAB برای پرونده‌های دارای قرارداد کاری به کمتر از ۳ هفته کاهش یافته است."
        ],
        checklist: [
          "استخراج پرینت تاییدیه دانشگاه H+ از Anabin",
          "بررسی کد رشته تحصیلی و انطباق با عنوان شغلی",
          "ترجمه رسمی ریزنمرات و دانشنامه به زبان آلمانی یا انگلیسی"
        ],
        relevantArticleId: "stages-recognition-zab-anabin",
        officialLink: {
          title: "پایگاه داده رسمی ارزشیابی مدارک آنابین (Anabin)",
          url: "https://anabin.kmk.org/"
        }
      },
      {
        stepNumber: 2,
        titleFa: "بازطراحی پرونده کاری به استاندارد DIN 5008",
        titleDe: "Optimierung von Lebenslauf & Anschreiben",
        timeframe: "ماه ۱ تا ۲",
        summary: "تنظیم رزومه کرونولوژیک معکوس با اصطلاحات تخصصی آلمانی (Fachbegriffe) و نگارش انگیزش‌نامه اداری.",
        keyActions: [
          "تدوین رزومه Lebenslauf حداکثر در ۲ صفحه با فرمت اداری استاندارد آلمان و عکس حرفه‌ای (Bewerbungsfoto).",
          "درج دستاوردهای عددی (Impact Metrics) و انطباق تِک‌استک با نیازمندی‌های پروژه‌های آلمان.",
          "آماده‌سازی پروفایل لینکدین و زینگ (Xing) به زبان انگلیسی و آلمانی."
        ],
        tips: [
          "کارفرمایان آلمانی به ذکر دقیق وظایف و ابزارهای هر سابقه کاری بیشتر از عناوین کلی اهمیت می‌دهند."
        ],
        checklist: [
          "تهیه رزومه دوزبانه انگلیسی/آلمانی با رعایت استاندارد DIN 5008",
          "آماده‌سازی نمونه‌کارها (GitHub / Portfolio)",
          "بارگذاری رزومه در پلتفرم‌های StepStone و LinkedIn Jobs"
        ],
        relevantArticleId: "stages-german-cv-application"
      },
      {
        stepNumber: 3,
        titleFa: "مصاحبه فنی و دریافت قرارداد کار (Arbeitsvertrag)",
        titleDe: "Vorstellungsgespräch & Arbeitsvertrag",
        timeframe: "ماه ۲ تا ۳",
        summary: "انجام موفقیت‌آمیز دورهای مصاحبه منابع انسانی و تخصصی و دریافت قرارداد رسمی با رعایت کف حقوق.",
        keyActions: [
          "آمادگی برای چالش‌های لایوکدینگ و سوالات فنی سناریومحور (Case Studies).",
          "بررسی دقیق بندهای قرارداد کار شامل شرح وظایف، ساعات کاری (معمولاً ۴۰ ساعت) و روزهای مرخصی (حداقل ۲۰ روز کاری).",
          "اطمینان از تطابق حقوق مندرج در قرارداد با کف مصوب بلوکارت ۲۰۲۶."
        ],
        checklist: [
          "امضای نسخه فیزیکی یا الکترونیکی قرارداد کاری رسمی",
          "دریافت فرم رسمی شرح شغل اداره کار (Erklärung zum Beschäftigungsverhältnis)",
          "تطابق حقوق ناخالص سالانه با کف بلوکارت"
        ],
        relevantArticleId: "stages-complete-roadmap"
      },
      {
        stepNumber: 4,
        titleFa: "تسریع فرآیند ویزا با پیش‌تاییدیه اداره کار (§ 81a)",
        titleDe: "Beschleunigtes Fachkräfteverfahren & Vorabzustimmung",
        timeframe: "ماه ۳",
        summary: "تقاضای کارفرما از اداره اتباع خارجی آلمان جهت صدور پیش‌تاییدیه فوری اداره کار (ZAV).",
        keyActions: [
          "درخواست کارفرما برای اعمال فرآیند تسریع‌شده نیروی متخصص (§ 81a) در اداره مهاجرت محلی.",
          "صدور پیش‌تاییدیه رسمی اداره کار فدرال (ZAV-Vorabzustimmung).",
          "رزرو وقت اولویت‌دار در پلتفرم ارائه‌دهنده خدمات ویزای سفارت (ویزامتریک)."
        ],
        tips: [
          "با داشتن تاییدیه بند 81a، سفارت موظف است ظرف ۳ هفته کاری وقت مصاحبه تخصصی صادر کند."
        ],
        checklist: [
          "دریافت اصل یا نسخه رسمی Vorabzustimmung از کارفرما",
          "رزرو نوبت در بخش تسریع‌شده ویزای کاری سفارت",
          "تکمیل فرم آنلاین درخواست ویزای ملی (VIDEX)"
        ],
        relevantArticleId: "stages-fast-track-81a"
      },
      {
        stepNumber: 5,
        titleFa: "مصاحبه سفارت و صدور ویزای ملی ورودی (Typ D)",
        titleDe: "Visumantrag & Visumserteilung",
        timeframe: "ماه ۳ تا ۴",
        summary: "تحویل مدارک، انگشت‌نگاری در مرکز ویزا و دریافت برچسب ویزای ورود ملی ۳ الی ۶ ماهه.",
        keyActions: [
          "ارائه اصل و کپی کلیه مدارک شناسایی، تحصیلی، شغلی، قرارداد کار و بیمه درمانی مسافرتی (Incoming).",
          "پرداخت هزینه کنسولی ویزا (۷۵ یورو).",
          "تحویل پاسپورت حاوی ویزای ملی تایپ D با اعتبار اولیه."
        ],
        checklist: [
          "تهیه بیمه مسافرتی معتبر ورود به آلمان (حداقل ۳۰ هزار یورو پوشش)",
          "چیدمان مدارک مطابق دقیق چک‌لیست سفارت آلمان",
          "دریافت ویزای ملی تایپ D و بلیت پرواز"
        ],
        relevantArticleId: "application-appointment-checklist"
      },
      {
        stepNumber: 6,
        titleFa: "ورود، ثبت آدرس شهرداری (Anmeldung) و صدور بلوکارت",
        titleDe: "Anmeldung, Krankenkasse & Elektronischer Aufenthaltstitel",
        timeframe: "ماه ۴ به بعد",
        summary: "استقرار در محل سکونت، ثبت آدرس در شهرداری (Bürgeramt)، فعال‌سازی بیمه و دریافت کارت اقامت الکترونیک.",
        keyActions: [
          "ثبت آدرس ظرف حداکثر ۱۴ روز در Bürgeramt با برگه تایید مالک (Wohnungsgeberbestätigung).",
          "افتتاح حساب بانکی آلمانی و دریافت شناسه مالیاتی (Steuer-ID).",
          "فعال‌سازی بیمه درمانی دولتی (TK, AOK, Barmer) و تحویل مدارک به کارفرما برای شروع اولین ماه کاری.",
          "حضور در اداره اتباع خارجی (Ausländerbehörde) و تحویل کارت فیزیکی بلوکارت (eAT)."
        ],
        checklist: [
          "اخذ برگه تایید ثبت آدرس شهرداری (Meldebestätigung)",
          "افتتاح حساب جاری بانکی و کارت اعتباری (Girokonto)",
          "شروع رسمی کار و دریافت شماره بیمه اجتماعی (Sozialversicherungsnummer)"
        ],
        relevantArticleId: "living-anmeldung-schufa-guide"
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 2. STUDENT & UNIVERSITY (تحصیلی و دانشجویی)
  // -------------------------------------------------------------------------
  {
    id: "student",
    titleFa: "تحصیلی و آموزش عالی (کارشناسی، ارشد و دکتری)",
    titleDe: "Studium & Akademische Bildung",
    badge: "رده ۲: پذیرش دانشگاهی و تحصیل رایگان",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    accentColor: "violet",
    iconName: "GraduationCap",
    shortDescription: "تحصیل در دانشگاه‌های معتبر با شهریه تقریباً رایگان، حق کار دانشجویی گسترده در سال ۲۰۲۶ و ۱۸ ماه فرصت کارجویی تضمینی پس از فراغت.",
    legalParagraph: "§ 16b AufenthG (مهاجرت تحصیلی و حق اشتغال دانشجویی)",
    targetAudience: "داوطلبان ادامه تحصیل در مقاطع کارشناسی، کارشناسی ارشد، دکتری و دوره‌های تحقیقاتی دانشگاه‌های دولتی و خصوصی آلمان.",
    totalEstimatedDuration: "۶ تا ۱۲ ماه (بسته به مهلت ترم‌های زمستان و تابستان)",
    estimatedFinancialRequirement: "حساب مسدود (Sperrkonto): حدود ۱۱,۹۰۴ € برای ۱ سال",
    keyMetrics: [
      {
        label: "شهریه دانشگاه‌های دولتی",
        value: "رایگان (۰ یورو)",
        sublabel: "فقط هزینه خدمات ترم و بلیت حمل‌ونقل (۱۵۰ تا ۳۵۰ یورو)"
      },
      {
        label: "حق کار دانشجویی (قانون ۲۰۲۶)",
        value: "۱۴۰ روز کاری",
        sublabel: "۱۴۰ روز کامل یا ۲۸۰ نیم‌روز کاری در سال (افزایش‌یافته از ۱۲۰ روز)"
      },
      {
        label: "تمکن مالی مسدود (Sperrkonto)",
        value: "۱۱,۹۰۴ € / سال",
        sublabel: "معادل ۹۹۲ یورو برداشت در هر ماه برای هزینه‌های زیست"
      },
      {
        label: "ویزای جستجوی کار پس از فراغت",
        value: "۱۸ ماه کامل",
        sublabel: "با حق کار نامحدود تا زمان عقد قرارداد و تبدیل به بلوکارت"
      }
    ],
    advantages: [
      "مدرک دانشگاهی مورد احترام و استاندارد سراسر اتحادیه اروپا",
      "حق کار نیمه‌وقت حین تحصیل جهت پوشش دادن کلیه هزینه‌های زندگی",
      "مسیر بسیار هموار تبدیل به اقامت کاری بلوکارت پس از فارغ‌التحصیلی",
      "اخذ اقامت دائم تنها ۲ سال پس از پایان تحصیل و شروع به کار رسمی"
    ],
    criticalRequirements: [
      "احراز شرایط ورود به دانشگاه (Hochschulzugangsberechtigung)",
      "مدرک زبان معتبر (TestDaF / DSH برای آلمانی یا IELTS برای انگلیسی)",
      "اثبات توانایی مالی از طریق حساب مسدود یا بورسیه رسمی"
    ],
    keySuccessFactors: [
      {
        id: "ksf_st_sperrkonto",
        titleFa: "گشایش به‌موقع حساب مسدود رسمی (Sperrkonto)",
        titleDe: "Rechtzeitige Eröffnung des Sperrkontos nach § 16b",
        categoryTag: "تمکن مالی و کنسولگری",
        impactLevel: "vital",
        impactLabelFa: "الزام ۱۰۰٪ صدور ویزا",
        explanation: "برای سال تحصیلی ۲۰۲۵/۲۰۲۶، حساب مسدود سالانه با مبلغ ۱۱,۹۰۴ یورو (ماهانه ۹۹۲ یورو) از ارائه‌دهندگان رسمی و دیجیتال مانند Fintiba یا Coracle الزامی است؛ نقص گواهی حساب مسدود به منزله رد قطعی درخواست ویزا در روز مصاحبه است.",
        actionableStep: "حداقل ۳۰ روز پیش از تاریخ مصاحبه سفارت، فرآیند افتتاح حساب مسدود و انتقال ارزی وجه را آغاز کرده و تاییدیه رسمی Blocking Confirmation را دریافت نمایید.",
        officialRef: "§ 16b AufenthG & Auswärtiges Amt",
        metricNote: "۱۱,۹۰۴ € برای ۱۲ ماه اقامت"
      },
      {
        id: "ksf_st_vpd_uniassist",
        titleFa: "مدیریت مواعد تقویم Uni-Assist و گواهی مقدماتی VPD",
        titleDe: "Fristgerechte Beantragung der Vorprüfungsdokumentation (VPD)",
        categoryTag: "پذیرش دانشگاهی و ددلاین",
        impactLevel: "vital",
        impactLabelFa: "پیش‌نیاز اپلای دانشگاه‌ها",
        explanation: "دانشگاه‌های تحت پوشش Uni-Assist دریافت گواهی ارزیابی مدارک (VPD) را پیش از ددلاین نهایی (۱۵ ژوئیه برای زمستان / ۱۵ ژانویه برای تابستان) مطالبه می‌کنند؛ بررسی پرونده در یونی-اسیست ۴ تا ۶ هفته طول می‌کشد.",
        actionableStep: "مدارک تحصیلی، ترجمه‌ها و نمره زبان را حداقل ۴۵ روز قبل از پایان مهلت در پرتال Uni-Assist بارگذاری کرده و کارمزد ارزیابی را پرداخت فرمایید.",
        officialRef: "Uni-Assist e.V. & DAAD",
        metricNote: "زمان ارزیابی: ۴ الی ۶ هفته کاری"
      },
      {
        id: "ksf_st_motivation_letter",
        titleFa: "نگارش انگیزش‌نامه با استناد به اساتید و چارت دروس",
        titleDe: "Hochschulspezifisches Motivationsschreiben mit Modulbezug",
        categoryTag: "تاکتیک پذیرش تحصیلی",
        impactLevel: "high",
        impactLabelFa: "عامل اصلی تمایز پرونده",
        explanation: "کمیته‌های گزینش اساتید در دانشگاه‌های تراز اول آلمان انگیزه‌نامه‌های کلیشه‌ای و متون آماده هوش مصنوعی را بلافاصله رد می‌کنند. انگیزش‌نامه‌ای که مستقیماً به عناوین ۳ ماژول درسی پیشرفته و علایق پژوهشی آزمایشگاه دانشگاه ارجاع دهد بیشترین شانس پذیرش را دارد.",
        actionableStep: "سرفصل دروس دانشگاه (Modulhandbuch) را دانلود کرده و چگونگی انطباق سوابق دانشگاهی خود با آن ماژول‌ها را در ۱.۵ صفحه تشریح کنید.",
        officialRef: "Hochschulrektorenkonferenz (HRK)",
        metricNote: "طول انگیزش‌نامه: ۱.۵ تا ۲ صفحه A4"
      },
      {
        id: "ksf_st_student_jobs",
        titleFa: "استفاده از قانون جدید کار دانشجویی (۱۴۰ روز کاری)",
        titleDe: "Ausschöpfung des 140-Tage-Arbeitsrechts & Werkstudentenjobs",
        categoryTag: "اشتغال دانشجویی و درآمد",
        impactLevel: "competitive_edge",
        impactLabelFa: "کسب استقلال مالی و سابقه کار",
        explanation: "طبق اصلاحات جدید قانون مهاجرت نیروهای متخصص (FEG)، سقف کار مجاز دانشجویان خارجی از ۱۲۰ روز به ۱۴۰ روز کاری کامل (یا ۲۸۰ نیم‌روز) در سال معادل ۲۰ ساعت در هفته افزایش یافته است که درآمد ماهانه ۱,۱۰۰ الی ۱,۵۰۰ یورویی را بدون مالیات سنگین فراهم می‌سازد.",
        actionableStep: "از ماه دوم ورود به آلمان، برای موقعیت‌های Werkstudent در شرکت‌های صنعتی یا HiWi در دانشگاه اقدام کنید تا هم هزینه زندگی تامین شود و هم سابقه معتبر در آلمان شکل بگیرد.",
        officialRef: "§ 16b Abs. 3 AufenthG",
        metricNote: "۱۴۰ روز کاری در سال / تا ۲۰ ساعت هفته"
      }
    ],
    relevantArticleIds: [
      "stages-complete-roadmap",
      "stages-recognition-zab-anabin",
      "education-schools-universities",
      "application-appointment-checklist",
      "application-health-insurance-entry",
      "healthcare-gkv-vs-pkv",
      "living-anmeldung-schufa-guide"
    ],
    steps: [
      {
        stepNumber: 1,
        titleFa: "جستجوی رشته و ارزیابی صلاحیت ورود دانشگاهی (HZB)",
        titleDe: "Studiengangsuche & Hochschulzugangsberechtigung",
        timeframe: "ماه ۱ تا ۲",
        summary: "انتخاب رشته‌های متناسب در پرتال DAAD و بررسی نیاز به دوره کالج (Studienkolleg) بر اساس دیپلم.",
        keyActions: [
          "بررسی دوره‌های آموزشی در پرتال رسمی DAAD (daad.de/international-programmes).",
          "ارزیابی دیپلم متوسطه و پیش‌دانشگاهی در دیتابیس آنابین برای احراز ورود مستقیم یا نیاز به آزمون Feststellungsprüfung.",
          "بررسی پیش‌نیازهای اختصاصی هر دانشگاه اعم از معدل (NC)، مقالات و انگیزه نامه."
        ],
        checklist: [
          "انتخاب حداقل ۵ دانشگاه دولتی مقصد",
          "بررسی ددلاین‌های اپلای (۱۵ جولای برای ترم زمستان / ۱۵ ژانویه برای تابستان)",
          "استعلام نیاز به تاییدیه مدارک تحصیلی (VPD) از Uni-Assist"
        ],
        relevantArticleId: "education-schools-universities",
        officialLink: {
          title: "بانک اطلاعاتی دوره‌های بین‌المللی DAAD",
          url: "https://www.daad.de/en/study-and-research-in-germany/courses-of-study-in-germany/"
        }
      },
      {
        stepNumber: 2,
        titleFa: "اخذ مدرک زبان رسمی (آلمانی یا انگلیسی)",
        titleDe: "Sprachnachweis (TestDaF, DSH, IELTS)",
        timeframe: "ماه ۲ تا ۴",
        summary: "کسب نمره قبولی در آزمون‌های معتبر بین‌المللی متناسب با زبان تدریس رشته مدنظر.",
        keyActions: [
          "برای رشته‌های آلمانی‌زبان: کسب نمره TestDaF (حداقل ۴×۴)، گوته C1 یا آزمون DSH-2.",
          "برای رشته‌های انگلیسی‌زبان: کسب مدرک آیلتس آکادمیک (حداقل ۶.۵) یا تافل معادل.",
          "ترجمه رسمی گواهی‌های زبان و آماده‌سازی برای بارگذاری در یونی‌اسیست."
        ],
        checklist: [
          "دریافت کارنامه رسمی آزمون زبان بین‌المللی",
          "تطابق سطح نمره با الزامات دقیق رشته مدنظر",
          "کپی برابر اصل کردن مدارک در صورت لزوم"
        ]
      },
      {
        stepNumber: 3,
        titleFa: "ثبت تقاضا از طریق Uni-Assist یا پرتال دانشگاه و اخذ پذیرش",
        titleDe: "Bewerbung via Uni-Assist & Zulassungsbescheid",
        timeframe: "ماه ۴ تا ۶",
        summary: "ارسال تقاضانامه آنلاین، پرداخت هزینه‌ها و دریافت نامه قطعی پذیرش (Zulassung) یا تاییدیه مشروط.",
        keyActions: [
          "ایجاد حساب کاربری در پورتال Uni-Assist و بارگذاری مدارک ترجمه‌شده.",
          "دریافت گواهی بررسی اولیه مدارک (Vorprüfungsdokumentation - VPD).",
          "ارسال تقاضا به پرتال اختصاصی دانشگاه‌ها و پیگیری صدور Zulassungsbescheid."
        ],
        tips: [
          "پذیرش‌های قطعی بدون قید شرط زبان، فرآیند وقت‌دهی و صدور ویزای سفارت را بسیار سریع‌تر می‌کنند."
        ],
        checklist: [
          "پرداخت هزینه بررسی مدارک به Uni-Assist",
          "نگارش انگیزه‌نامه آکادمیک قوی (Motivationsschreiben)",
          "دریافت نامه پذیرش رسمی دانشگاه (Zulassungsbescheid)"
        ]
      },
      {
        stepNumber: 4,
        titleFa: "افتتاح حساب مسدود بانکی (Sperrkonto) و بیمه دانشجویی",
        titleDe: "Sperrkonto & Studentische Krankenversicherung",
        timeframe: "ماه ۶ تا ۷",
        summary: "تامین تمکن مالی سالانه ۱۱,۹۰۴ یورویی و فعال‌سازی بیمه درمانی دولتی دانشجویان.",
        keyActions: [
          "افتتاح حساب مسدود در ارائه‌دهندگان مورد تایید وزارت خارجه آلمان (مانند Fintiba, Expatrio, Coracle).",
          "انتقال وجه ۱۱,۹۰۴ یورویی به حساب و دریافت برگه تایید انسداد موجودی (Sperrbestätigung).",
          "عقد قرارداد با بیمه درمانی دولتی دانشجویی (GKV مانند Techniker Krankenkasse یا AOK) با تعرفه تخفیف‌دار دانشجویی (حدود ۱۲۰ یورو در ماه)."
        ],
        checklist: [
          "دریافت گواهی انسداد حساب مسدود به نام متقاضی",
          "اخذ گواهی پوشش بیمه سلامت دانشجویی دولتی",
          "آماده‌سازی فیش‌های انتقال بانکی معتبر"
        ],
        relevantArticleId: "healthcare-gkv-vs-pkv"
      },
      {
        stepNumber: 5,
        titleFa: "درخواست ویزای تحصیلی در سفارت / کنسولگری",
        titleDe: "Visumantrag zum Zweck des Studiums",
        timeframe: "ماه ۷ تا ۸",
        summary: "تحویل پرونده تحصیلی و مالی به مرکز خدمات کنسولی و دریافت ویزای ورود ملی دانشجویی.",
        keyActions: [
          "رزرو وقت ویزای تحصیلی و تکمیل فرم درخواست ویزای ملی.",
          "ارائه اصل نامه پذیرش، سوابق تحصیلی، حساب مسدود و انگیزش‌نامه تحصیلی شفاف.",
          "اخذ ویزای ۳ الی ۶ ماهه ورودی با قید حق کار دانشجویی."
        ],
        checklist: [
          "ارائه نامه پذیرش رسمی و بدون قید دانشگاه",
          "گواهی حساب مسدود ۱۱,۹۰۴ یورو",
          "دریافت ویزای تحصیلی و رزرو پرواز"
        ],
        relevantArticleId: "application-appointment-checklist"
      },
      {
        stepNumber: 6,
        titleFa: "ورود، ثبت‌نام نهایی دانشگاه (Immatrikulation) و اقامت دانشجویی",
        titleDe: "Immatrikulation, Semesterticket & Aufenthaltserlaubnis",
        timeframe: "ماه ۹ به بعد",
        summary: "حضور در اداره آموزش دانشگاه، پرداخت سهم ترم، دریافت کارت دانشجویی و مراجعه به اداره مهاجرت.",
        keyActions: [
          "ثبت آدرس در شهرداری (Anmeldung) ظرف ۱۴ روز پس از ورود.",
          "تکمیل فرآیند ثبت‌نام دانشگاه (Immatrikulation) و دریافت Semesterticket سراسری برای قطارها و اتوبوس‌ها.",
          "دریافت کارت اقامت تحصیلی (§ 16b) از اداره مهاجرت محلی.",
          "بهره‌مندی از حق کار دانشجویی تا ۱۴۰ روز کامل در سال در مشاغل پاره‌وقت یا کارآموزی صنعتی (Werkstudent)."
        ],
        checklist: [
          "ثبت آدرس اقامت در شهرداری محلی",
          "دریافت گواهی اشتغال به تحصیل (Immatrikulationsbescheinigung)",
          "شروع تحصیل و کار پاره‌وقت دانشجویی"
        ],
        relevantArticleId: "living-anmeldung-schufa-guide"
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 3. CHANCENKARTE & JOB SEEKER (کارت فرصت و کارجویی)
  // -------------------------------------------------------------------------
  {
    id: "chancenkarte",
    titleFa: "کارت فرصت و کارجویی امتیازی آلمان",
    titleDe: "Chancenkarte & Arbeitsplatzsuche",
    badge: "رده ۳: سیستم امتیازی مدرن بدون نیاز به قرارداد اولیه",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    accentColor: "amber",
    iconName: "Target",
    shortDescription: "ورود قانونی به خاک آلمان بر مبنای جدول امتیازی جدید، همراه با اجازه کار آزمایشی تا ۲۰ ساعت در هفته برای پیدا کردن کارفرمای ایده‌آل.",
    legalParagraph: "§ 20a, § 20b AufenthG (مصوب رسمی قانون جدید مهاجرت)",
    targetAudience: "متخصصان و کارشناسانی که هنوز پیشنهاد کاری قطعی ندارند اما شرایط امتیازی سن، زبان، سابقه کار و مدرک تحصیلی را احراز می‌نمایند.",
    totalEstimatedDuration: "۳ تا ۵ ماه",
    estimatedFinancialRequirement: "تمکن ماهانه ۱۰۲۷ € (حساب مسدود یا ضمانت کار پاره‌وقت)",
    keyMetrics: [
      {
        label: "حداقل امتیاز قبولی",
        value: "۶ امتیاز",
        sublabel: "از جدول معیارهای آلمان (سن، زبان، سابقه، تخصص کمبود)"
      },
      {
        label: "حق کار پاره‌وقت در خاک آلمان",
        value: "۲۰ ساعت / هفته",
        sublabel: "اجازه کار بدون محدودیت در مشاغل جانبی جهت تامین مخارج"
      },
      {
        label: "کار آزمایشی نزد کارفرما (Probe)",
        value: "۲ هفته تمام‌وقت",
        sublabel: "نزد هر کارفرمای احتمالی جهت اثبات توانمندی عملی"
      },
      {
        label: "مدت اعتبار اولیه ویزا",
        value: "۱ سال کامل",
        sublabel: "با امکان تبدیل مستقیم به بلوکارت یا تمدید تا ۲ سال"
      }
    ],
    advantages: [
      "عدم نیاز به عقد قرارداد کاری از راه دور و از کشور مبدا",
      "امکان حضور فیزیکی در مصاحبه‌های شرکت‌های معتبر آلمانی",
      "کسب درآمد قانونی در خاک آلمان با ۲۰ ساعت کار هفتگی",
      "امکان تبدیل مستقیم به ویزای اقامت کاری بدون نیاز به بازگشت به کشور مبدا"
    ],
    criticalRequirements: [
      "مدرک دانشگاهی معتبر یا حداقل ۲ سال آموزش فنی و حرفه‌ای رسمی",
      "مدرک زبان آلمانی A1 یا زبان انگلیسی B2 به عنوان شرط ورود به سیستم",
      "اثبات تمکن مالی زیست به مدت حداقل ۱ سال (۱۰۲۷ یورو در ماه)"
    ],
    keySuccessFactors: [
      {
        id: "ksf_ck_points_audit",
        titleFa: "تثبیت حداقل ۶ امتیاز قطعی و مستندسازی گواهی‌ها",
        titleDe: "Rechtssichere Punkteberechnung nach § 20a (Min. 6 Punkte)",
        categoryTag: "احراز صلاحیت قانونی",
        impactLevel: "vital",
        impactLabelFa: "کف قبولی در سیستم شانس",
        explanation: "کارت شانس بر مبنای جدول امتیازی ارزیابی می‌شود. کسب ۶ امتیاز مستلزم مستندسازی رسمی است: سن زیر ۳۵ سال (۲ امتیاز)، مدرک زبان آلمانی B1 (۲ امتیاز) یا انگلیسی C1 (۱ امتیاز)، ۵ سال سابقه کار تخصصی (۳ امتیاز) و قرار داشتن در فهرست مشاغل کمبود نیرو (Engpassberufe) یک امتیاز مازاد دارد.",
        actionableStep: "ترجمه رسمی سوابق بیمه کاری و مدرک زبان رسمی (گوته یا آیلتس) را پیش از وقت سفارت در پوشه کنسولی منظم کنید تا هیچ امتیازی مورد مناقشه افسر ویزا قرار نگیرد.",
        officialRef: "§ 20a, § 20b AufenthG (Chancenkarte)",
        metricNote: "حداقل ۶ امتیاز قطعی از جدول مصوب"
      },
      {
        id: "ksf_ck_proof_of_funds",
        titleFa: "تامین تمکن مالی زیست ماهانه ۱۰۲۷ یورو به مدت ۱۲ ماه",
        titleDe: "Nachweis der Lebensunterhaltssicherung (12.324 € / Jahr)",
        categoryTag: "تمکن مالی و معیشت",
        impactLevel: "vital",
        impactLabelFa: "شرط اساسی بدون استثنا",
        explanation: "متقاضی باید عدم وابستگی به کمک‌های تامین اجتماعی آلمان را اثبات کند؛ ارائه حساب مسدود به مبلغ ۱۲,۳۲۴ یورو یا تعهدنامه رسمی شخص مقیم آلمان (Verpflichtungserklärung nach § 68) شرط بی‌چون‌وچرای صدور ویزا است.",
        actionableStep: "در صورت کمبود بخشی از نقدینگی، پیش‌قرارداد کار پاره‌وقت در آلمان (تا ۲۰ ساعت در هفته) می‌تواند به عنوان منبع درآمد مکمل به سفارت ارائه شود.",
        officialRef: "Bundesministerium des Innern (BMI)",
        metricNote: "۱۰۲۷ € ماهانه / ۱۲,۳۲۴ € سالانه"
      },
      {
        id: "ksf_ck_probearbeit",
        titleFa: "استفاده هوشمندانه از حق کار آزمایشی ۲ هفته‌ای",
        titleDe: "Nutzung des zweiwöchigen Probearbeitsrechts beim Arbeitgeber",
        categoryTag: "تاکتیک استخدام سریع",
        impactLevel: "high",
        impactLabelFa: "تبدیل مصاحبه به پیشنهاد کار",
        explanation: "بزرگ‌ترین مزیت قانون بند 20a این است که دارنده کارت شانس حق دارد تا سقف ۲ هفته کار آزمایشی رسمی (Probearbeit) نزد هر کارفرمایی در آلمان انجام دهد؛ این موضوع به کارفرما اطمینان می‌دهد که مهارت‌های شما را بدون تعهد سنگین محک بزند.",
        actionableStep: "در انتهای هر مصاحبه شغلی حضوری در آلمان، بلافاصله دوره کار آزمایشی ۲ هفته‌ای قانونی را پیشنهاد دهید تا کارفرما شجاعت ارائه پیشنهاد رسمی را پیدا کند.",
        officialRef: "§ 20a Abs. 1 Satz 2 AufenthG",
        metricNote: "۲ هفته تمام‌وقت نزد هر کارفرما"
      },
      {
        id: "ksf_ck_cluster_targeting",
        titleFa: "هدف‌گذاری خوشه‌های صنعتی آلمان پیش از ورود",
        titleDe: "Strategische Cluster-Fokussierung nach Bundesländern",
        categoryTag: "استراتژی کاریابی میدانی",
        impactLevel: "competitive_edge",
        impactLabelFa: "افزایش ۴ برابری بازدهی اقامت ۱ ساله",
        explanation: "مهلت ۱۲ ماهه کارت شانس محدود است؛ کاریابی بدون برنامه جغرافیایی انرژی و سرمایه را هدر می‌دهد. متمرکز شدن در ایالت‌های صنعتی (بایرن و بادن-وورتمبرگ برای مهندسی و نرم‌افزار، هسن برای مالی و نوردراین-وستفالن برای لجستیک) بیشترین نرخ استخدام را دارد.",
        actionableStep: "فهرست ۴۰ شرکت متوسط مقیاس (Mittelstand) در یک حوزه شهری مشخص را آماده کرده و درخواست‌های حضوری را در ۳ ماه اول ورود سازماندهی کنید.",
        officialRef: "Bundesagentur für Arbeit (BA)",
        metricNote: "تمرکز روی ۴۰ شرکت محلی Mittelstand"
      }
    ],
    relevantArticleIds: [
      "visas-chancenkarte-guide",
      "stages-complete-roadmap",
      "stages-recognition-zab-anabin",
      "stages-german-cv-application",
      "application-appointment-checklist",
      "application-health-insurance-entry",
      "work-culture-hours-vacation-rights",
      "living-anmeldung-schufa-guide"
    ],
    steps: [
      {
        stepNumber: 1,
        titleFa: "ارزیابی و احراز حداقل ۶ امتیاز در سیستم امتیازی",
        titleDe: "Punktesystem-Prüfung (Mindestens 6 Punkte)",
        timeframe: "ماه ۱",
        summary: "محاسبه دقیق امتیازات فردی بر اساس جدول رسمی معیارهای آژانس کار فدرال آلمان.",
        keyActions: [
          "بررسی احراز شرط پایه: مدرک تحصیلی حداقل ۲ سال + مدرک زبان آلمانی A1 یا انگلیسی B2.",
          "محاسبه امتیازات سن: زیر ۳۵ سال (۲ امتیاز)، ۳۵ تا ۴۰ سال (۱ امتیاز).",
          "محاسبه امتیازات سابقه کار: حداقل ۵ سال مرتبط (۳ امتیاز)، حداقل ۲ سال (۲ امتیاز).",
          "محاسبه امتیاز زبان: آلمانی B2 (۳ امتیاز)، B1 (۲ امتیاز)، A2 (۱ امتیاز).",
          "امتیاز رشته‌های با کمبود نیرو (MINT): ۱ امتیاز تشویقی."
        ],
        tips: [
          "افرادی که مدارکشان از قبل معادل‌سازی کامل شده است (Fachkraft)، مستقیماً بدون نیاز به جمع‌آوری ۶ امتیاز واجد شرایط هستند!"
        ],
        checklist: [
          "محاسبه و مستندسازی حداقل ۶ امتیاز قطعی",
          "تطابق مدرک دانشگاهی با استاندارد کشور مبدأ",
          "دریافت گواهی سابقه کار رسمی بیمه‌ای یا شرکتی"
        ],
        relevantArticleId: "visas-chancenkarte-guide",
        officialLink: {
          title: "شبیه‌ساز رسمی امتیازات کارت فرصت (Make it in Germany)",
          url: "https://www.make-it-in-germany.com/en/visa-residence/types/job-search-opportunity-card"
        }
      },
      {
        stepNumber: 2,
        titleFa: "معادل‌سازی اولیه و دریافت گواهی تایید مدارک",
        titleDe: "Anerkennungspartnerschaft & ZAB-Bescheinigung",
        timeframe: "ماه ۱ تا ۲",
        summary: "استعلام تاییدیه اعتبار موسسه آموزشی و در صورت نیاز اقدام برای مشارکت در معادل‌سازی.",
        keyActions: [
          "دریافت استعلام آنابین H+ یا ثبت تقاضا در پرتال دیجیتال ZAB جهت صدور گواهی اولیه ارزشیابی.",
          "ترجمه رسمی سوابق شغلی و قراردادهای کار قبلی به زبان آلمانی یا انگلیسی.",
          "بررسی انطباق رشته با فهرست مشاغل مجاز آلمان."
        ],
        checklist: [
          "پرینت استعلام رسمی آنابین یا تاییدیه ZAB",
          "ترجمه رسمی مدارک تحصیلی و ریزنمرات",
          "گواهی‌های اشتغال به کار با قید دقیق وظایف"
        ],
        relevantArticleId: "stages-recognition-zab-anabin"
      },
      {
        stepNumber: 3,
        titleFa: "تامین مدارک تمکن مالی و گواهی بیمه سلامت ورود",
        titleDe: "Finanzierungsnachweis & Sperrkonto",
        timeframe: "ماه ۲ تا ۳",
        summary: "افتتاح حساب مسدود ماهانه ۱۰۲۷ یورو یا ارائه تعهدنامه رسمی کاریابی پاره‌وقت.",
        keyActions: [
          "افتتاح حساب مسدود به میزان ۱۲,۳۲۴ یورو برای پوشش ۱۲ ماهه اقامت (۱۰۲۷ یورو در هر ماه).",
          "در صورت داشتن جاب‌آفر پاره‌وقت تا ۲۰ ساعت در هفته در آلمان، استفاده از آن به عنوان اثبات تمکن.",
          "تهیه بیمه درمانی مسافرتی ویژه کارت فرصت (Chancenkarte Incoming-Versicherung)."
        ],
        checklist: [
          "نامه تایید انسداد حساب مسدود به نام متقاضی",
          "بیمه درمانی با پوشش معتبر بدون سقف برای کارت فرصت",
          "تکمیل فرم آنلاین خوداظهاری تمکن"
        ],
        relevantArticleId: "application-health-insurance-entry"
      },
      {
        stepNumber: 4,
        titleFa: "ثبت تقاضای ویزا و مصاحبه کنسولگری کارت فرصت",
        titleDe: "Visumantrag für Chancenkarte bei der Auslandsvertretung",
        timeframe: "ماه ۳ تا ۴",
        summary: "ثبت پرونده ویزای کارت فرصت در سامانه کنسولی و دریافت ویزای ملی یک‌ساله.",
        keyActions: [
          "ثبت‌نام در سامانه وقت سفارت و تکمیل فرم درخواست ویزای کارت فرصت.",
          "ارائه کارنامه زبان، مستندات جدول ۶ امتیاز، حساب مسدود و انگیزش‌نامه کاریابی.",
          "پرداخت تعرفه ۷۵ یورویی و تحویل پاسپورت با ویزای ورودی."
        ],
        checklist: [
          "آماده‌سازی مدارک جدول امتیازات به همراه پرینت شبیه‌ساز",
          "ارائه گواهی معتبر زبان آلمانی یا انگلیسی",
          "دریافت ویزای ملی ۱ ساله کارت فرصت"
        ],
        relevantArticleId: "application-appointment-checklist"
      },
      {
        stepNumber: 5,
        titleFa: "سفر به آلمان، استقرار و شروع کار آزمایشی (Probebeschäftigung)",
        titleDe: "Einreise, Jobsuche & Probebeschäftigung",
        timeframe: "ماه ۴ تا ۵",
        summary: "ثبت آدرس، شروع فعالیت‌های کاریابی میدانی، مصاحبه‌های حضوری و اشتغال پاره‌وقت مجاز.",
        keyActions: [
          "ثبت آدرس اقامت در شهرداری شهر مقصد (Anmeldung).",
          "بهره‌گیری از اجازه ۲۰ ساعت کار هفتگی در مشاغل جانبی جهت پوشش هزینه‌های جاری.",
          "شرکت در مصاحبه‌های حضوری و انجام دوره کار آزمایشی ۲ هفته‌ای نزد کارفرمایان بالقوه جهت اثبات توانایی."
        ],
        tips: [
          "دوره آزمایشی ۲ هفته‌ای تمام‌وقت نزد کارفرمایان، بهترین ابزار برای جلب اعتماد مدیران فنی آلمانی است."
        ],
        checklist: [
          "ثبت آدرس در شهرداری (Meldebescheinigung)",
          "فعال‌سازی برداشت ماهانه از حساب مسدود",
          "شرکت در مصاحبه‌های حضوری و رویدادهای تخصصی"
        ],
        relevantArticleId: "work-culture-hours-vacation-rights"
      },
      {
        stepNumber: 6,
        titleFa: "عقد قرارداد کاری و تبدیل کارت فرصت به بلوکارت دائم",
        titleDe: "Umwandlung in Aufenthaltstitel für Fachkräfte",
        timeframe: "ماه ۶ تا ۱۲",
        summary: "امضای قرارداد کار تمام‌وقت رسمی و تبدیل مستقیم ویزای کارجویی به اقامت بلندمدت متخصصان.",
        keyActions: [
          "دریافت قرارداد کار رسمی متناسب با تخصص با رعایت کف حقوق اداره کار.",
          "مراجعه به اداره اتباع خارجی محلی و تقاضای تبدیل کارت فرصت به بلوکارت اروپا (§ 18g) یا اقامت نیروی کار متخصص (§ 18b).",
          "صدور کارت اقامت بلندمدت کاری بدون نیاز به خروج از خاک آلمان."
        ],
        checklist: [
          "امضای قرارداد کار قطعی با کارفرمای آلمانی",
          "ثبت درخواست تغییر اقامت در Ausländerbehörde",
          "دریافت کارت اقامت کارشناسی/بلوکارت دائم"
        ],
        relevantArticleId: "visas-eu-blue-card"
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 4. VOCATIONAL TRAINEE (آوسبیلدونگ و مهارت‌آموزی دوگانه)
  // -------------------------------------------------------------------------
  {
    id: "ausbildung",
    titleFa: "کارآموزی دوگانه و دوره‌های مهارتی آوسبیلدونگ",
    titleDe: "Duale Berufsausbildung",
    badge: "رده ۴: آموزش عملی مهارتی با حقوق ماهانه از روز اول",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    accentColor: "emerald",
    iconName: "Wrench",
    shortDescription: "دوره ۳ ساله تلفیق کار عملی در شرکت‌های آلمانی و تئوری در مدرسه حرفه‌ای، همراه با دریافت دستمزد ماهیانه از روز اول و استخدام قطعی پس از فارغ‌التحصیلی.",
    legalParagraph: "§ 16a AufenthG (مهاجرت جهت آموزش حرفه‌ای دوگانه)",
    targetAudience: "متقاضیان یادگیری حرفه‌های فنی، مکاترونیک، برق، IT، پرستاری و پیراپزشکی، هتل‌داری و صنایع غذایی با دیپلم ۱۲ ساله.",
    totalEstimatedDuration: "۶ تا ۹ ماه تا شروع رسمی دوره در سپتامبر",
    estimatedFinancialRequirement: "حداقل تمکن (حقوق ماهانه کارفرما معمولاً هزینه‌ها را پوشش می‌دهد)",
    keyMetrics: [
      {
        label: "حقوق ماهانه کارآموز (Vergütung)",
        value: "۹۵۰ الی ۱۴۰۰ €",
        sublabel: "پرداخت از ماه اول توسط شرکت و افزایش سالانه حقوق"
      },
      {
        label: "سطح زبان آلمانی الزامی",
        value: "B1 یا B2 آلمانی",
        sublabel: "تسلط زبانی به دلیل تدریس تئوری و آزمون‌های کتبی در مدرسه آلمانی"
      },
      {
        label: "طول دوره آموزشی",
        value: "۳ سال کامل",
        sublabel: "شامل کار عملی در شرکت + مدرسه حرفه‌ای (Berufsschule)"
      },
      {
        label: "نرخ استخدام پس از فراغت",
        value: "بیش از ۹۲٪",
        sublabel: "جذب رسمی و مستقیم در همان شرکت محل آموزش"
      }
    ],
    advantages: [
      "دریافت دستمزد منظم ماهانه و خودکفایی مالی کامل از بدو ورود به آلمان",
      "عدم نیاز به مدارک دانشگاهی و معادل‌سازی پیچیده",
      "بیمه سلامت و سابقه بیمه بازنشستگی دولتی از ماه اول حضور در آلمان",
      "اخذ اقامت دائم تنها ۲ سال پس از پایان موفقیت‌آمیز آوسبیلدونگ"
    ],
    criticalRequirements: [
      "مدرک دیپلم دبیرستان ۱۲ ساله معتبر",
      "تسلط به زبان آلمانی در سطح B2 (حداقل B1 برای برخی رشته‌های فنی)",
      "قرارداد آموزش تاییدشده توسط اتاق بازرگانی یا اصناف (IHK / HWK)"
    ],
    keySuccessFactors: [
      {
        id: "ksf_ab_language_focus",
        titleFa: "تسلط واقعی بر مکالمه روان و واژگان فنی (B1/B2)",
        titleDe: "Praxisorientierte Sprachbeherrschung (B1/B2) & Fachterminologie",
        categoryTag: "زبان و مدرسه حرفه‌ای",
        impactLevel: "vital",
        impactLabelFa: "عامل اول پذیرش در مصاحبه",
        explanation: "محیط مدرسه حرفه‌ای آلمان (Berufsschule) و کارگاه‌های عملی صددرصد به زبان آلمانی است؛ تسلط بر واژگان فنی رشته (Fachterminologie) و توانایی مکالمه در مصاحبه ویدئویی، تعیین‌کننده‌ترین معیار کارفرمایان برای اعطای قرارداد Ausbildung به کارآموز خارجی است.",
        actionableStep: "اصطلاحات و فرآیندهای فنی حرفه مدنظر خود را به آلمانی مسلط شوید و پاسخ سوالات رایج مصاحبه کارآموزی را با تلفظ استاندارد آماده کنید.",
        officialRef: "Berufsbildungsgesetz (BBiG)",
        metricNote: "سطح زبانی الزامی: B1 تا B2"
      },
      {
        id: "ksf_ab_stipend_threshold",
        titleFa: "بررسی کف حقوق کارآموزی در برابر حداقل هزینه معیشت",
        titleDe: "Mindestausbildungsvergütung vs. Sperrkonto-Vermeidung",
        categoryTag: "تمکن مالی و قرارداد",
        impactLevel: "vital",
        impactLabelFa: "جلوگیری از شرط حساب مسدود",
        explanation: "کنسولگری آلمان حقوق کارآموزی ناخالص قرارداد را با کف معیشت سالانه مقایسه می‌کند؛ اگر حقوق سال اول کمتر از حدود ۹۰۳ یورو خالص در ماه باشد، سفارت افتتاح حساب مسدود برای واریز مابه‌التفاوت را اجباری خواهد کرد.",
        actionableStep: "هنگام ارسال درخواست، رشته‌هایی با پرداخت حقوق بالاتر (مانند پرستاری Generalistik بالای ۱,۲۰۰ یورو، مکاترونیک و IT) را انتخاب نمایید تا نیازی به حساب مسدود نداشته باشید.",
        officialRef: "Mindestausbildungsvergütung 2026",
        metricNote: "کف دستمزد استاندارد: ۹۵۰ الی ۱,۴۰۰ €"
      },
      {
        id: "ksf_ab_diploma_recognition",
        titleFa: "معادل‌سازی زودهنگام مدرک دیپلم دبیرستان در ایالت هدف",
        titleDe: "Zeugnisanerkennung des Schulabschlusses bei der IHK/Behörde",
        categoryTag: "معادل‌سازی مدارک تحصیلی",
        impactLevel: "high",
        impactLabelFa: "پیش‌نیاز ثبت قرارداد در IHK",
        explanation: "برای ثبت رسمی قرارداد Ausbildung در دفاتر اتاق بازرگانی (IHK) یا صنایع دستی (HWK)، دیپلم متوسطه ایران باید به معادل آلمانی (Realschulabschluss یا Fachhochschulreife) ارزیابی شود که پروسه استانی آن معمولاً ۱ تا ۲ ماه به طول می‌انجامد.",
        actionableStep: "ترجمه رسمی ریزنمرات و گواهی دیپلم ۱۲ ساله را به محض مشخص شدن ایالت استقرار شرکت، برای اداره ارزشیابی مدارک (Zeugnisanerkennungsstelle) همان ایالت ارسال نمایید.",
        officialRef: "IHK / HWK Ausbildungsregister",
        metricNote: "زمان بررسی استانی: ۴ الی ۸ هفته"
      },
      {
        id: "ksf_ab_motivation_mindset",
        titleFa: "برجسته‌سازی تعهد کاری و انگیزه یادگیری در انگیزش‌نامه",
        titleDe: "Demonstration von Lernbereitschaft & Zuverlässigkeit",
        categoryTag: "روانشناسی کارفرما در آلمان",
        impactLevel: "competitive_edge",
        impactLabelFa: "برتری رقابتی بر متقاضیان محلی",
        explanation: "کارفرمایان آلمانی در دوره‌های Ausbildung به دنبال سابقه کار سنگین نیستند؛ ویژگی‌هایی چون وقت‌شناسی (Pünktlichkeit)، مسئولیت‌پذیری، انضباط کاری و علاقه واقعی به یادگیری مهارت دستی یا فنی، اصلی‌ترین دلیل برگزیدن داوطلب در برابر رقبای محلی است.",
        actionableStep: "در انگیزه‌نامه آلمانی (Anschreiben)، به نمونه کارهای عملی، پروژه‌های کارگاهی یا علایق شخصی مستند خود به عنوان انگیزه ورود به این حرفه اشاره فرمایید.",
        officialRef: "Duale Ausbildung Leitfaden",
        metricNote: "تاکید بر انگیزه یادگیری و اخلاق کاری"
      }
    ],
    relevantArticleIds: [
      "stages-complete-roadmap",
      "stages-german-cv-application",
      "education-schools-universities",
      "work-culture-hours-vacation-rights",
      "application-appointment-checklist",
      "healthcare-gkv-vs-pkv",
      "living-anmeldung-schufa-guide"
    ],
    steps: [
      {
        stepNumber: 1,
        titleFa: "ارتقای فشرده زبان آلمانی به سطح B2",
        titleDe: "Deutschkenntnisse auf B2-Niveau",
        timeframe: "ماه ۱ تا ۳",
        summary: "آموزش زبان آلمانی با تمرکز بر اصطلاحات فنی و مصاحبه روان به عنوان مهم‌ترین فاکتور قبولی کارفرما.",
        keyActions: [
          "تمرکز بر مکالمه روان و تسلط بر گرامر برای ارتباطات تیمی در محیط کار آلمانی.",
          "شرکت در آزمون رسمی گوته (Goethe-Zertifikat B2) یا تلک (telc B2).",
          "آشنایی با لغات و اصطلاحات تخصصی رشته کارآموزی مدنظر."
        ],
        checklist: [
          "اخذ مدرک رسمی زبان آلمانی حداقل B1 و ترجیحاً B2",
          "تمرین مصاحبه‌های رایج منابع انسانی آلمان",
          "ترجمه رسمی دیپلم و ریزنمرات دبیرستان"
        ]
      },
      {
        stepNumber: 2,
        titleFa: "جستجوی پوزیشن آوسبیلدونگ و ارسال رزومه",
        titleDe: "Ausbildungsplatzsuche & Bewerbung",
        timeframe: "ماه ۳ تا ۵",
        summary: "ارسال تقاضانامه در پورتال‌های تخصصی کارآموزی نظیر Azubi.de، Ausbildung.de و پرتال Arbeitsagentur.",
        keyActions: [
          "تهیه رزومه آلمانی کامل با عکس پرسنلی رسمی و انگیزش‌نامه متناسب با رشته.",
          "ارسال تقاضانامه برای شرکت‌های دارای ظرفیت آموزش در ماه‌های ژانویه تا می برای شروع ترم سپتامبر.",
          "ثبت‌نام در پرتال‌های کاریابی فنی و پاسخ به سوالات ارزیابی اولیه شرکت‌ها."
        ],
        checklist: [
          "ارسال تقاضا به حداقل ۳۰ شرکت ارائه‌دهنده آوسبیلدونگ",
          "نگارش انگیزه‌نامه متناسب با علاقه عملی به حرفه",
          "هماهنگی مصاحبه‌های تصویری آنلاین با کارفرمایان"
        ],
        officialLink: {
          title: "پورتال رسمی فرصت‌های آوسبیلدونگ آلمان (Ausbildung.de)",
          url: "https://www.ausbildung.de/"
        }
      },
      {
        stepNumber: 3,
        titleFa: "مصاحبه آنلاین و امضای قرارداد رسمی آموزش (Ausbildungsvertrag)",
        titleDe: "Vorstellungsgespräch & Ausbildungsvertrag",
        timeframe: "ماه ۵ تا ۶",
        summary: "قبولی در مصاحبه ویدئویی کارفرما و دریافت قرارداد رسمی ممهور به مهر اتاق صنایع یا اصناف.",
        keyActions: [
          "انجام مصاحبه تصویری با مدیر آموزش شرکت و ابراز اشتیاق و انضباط کاری.",
          "تنظیم و امضای قرارداد رسمی آموزشی (Ausbildungsvertrag).",
          "ارسال قرارداد به اتاق بازرگانی و صنایع (IHK) یا اتاق اصناف (HWK) جهت ثبت رسمی."
        ],
        checklist: [
          "امضای قرارداد آموزش حاوی میزان دستمزد ماهانه هر سال",
          "دریافت برگه برنامه آموزشی تفصیلی (Ausbildungsplan)",
          "مهر تایید رسمی IHK یا HWK روی قرارداد"
        ]
      },
      {
        stepNumber: 4,
        titleFa: "پیش‌تاییدیه اداره کار فدرال (ZAV-Zustimmung)",
        titleDe: "Vorabzustimmung der Bundesagentur für Arbeit",
        timeframe: "ماه ۶ تا ۷",
        summary: "اقدام کارفرما برای اخذ تاییدیه اشتغال از اداره کار فدرال جهت تسریع صدور ویزای کارآموزی.",
        keyActions: [
          "ارسال نسخه قرارداد توسط کارفرما به اداره کار آلمان.",
          "بررسی شرایط کاری و حقوقی کارآموز و صدور تاییدیه رسمی ZAV.",
          "دریافت تاییدیه و ضمیمه کردن به مدارک کنسولی سفارت."
        ],
        checklist: [
          "اخذ برگه رسمی تاییدیه اداره کار فدرال (ZAV)",
          "تکمیل فرم شرح موقعیت آموزش حرفه‌ای",
          "هماهنگی محل اسکان در آلمان با همکاری کارفرما"
        ]
      },
      {
        stepNumber: 5,
        titleFa: "مصاحبه سفارت و اخذ ویزای کارآموزی حرفه‌ای",
        titleDe: "Visumantrag zur Berufsausbildung",
        timeframe: "ماه ۷ تا ۸",
        summary: "حضور در سفارت با قرارداد رسمی و مدرک زبان B2 و دریافت ویزای ملی تایپ D برای شروع دوره.",
        keyActions: [
          "ارائه اصل قرارداد تاییدشده، مدرک زبان گوته/تلک B2 و پیش‌تاییدیه ZAV.",
          "اثبات کفایت دستمزد ماهانه کارفرما (در صورت کمتر بودن از ۹۳۰ یورو، مابه‌التفاوت با حساب مسدود تامین می‌شود).",
          "دریافت ویزای ورودی کارآموزی."
        ],
        checklist: [
          "اصل قرارداد آموزش با تایید IHK",
          "مدرک زبان آلمانی B2 رسمی",
          "دریافت ویزا و تهیه بلیت به مقصد محل آموزش"
        ],
        relevantArticleId: "application-appointment-checklist"
      },
      {
        stepNumber: 6,
        titleFa: "ورود به آلمان، استقرار و آغاز دوره ۳ ساله آوسبیلدونگ",
        titleDe: "Ausbildungsbeginn, Berufsschule & Betrieb",
        timeframe: "ماه ۹ به بعد",
        summary: "حضور در محل کار و مدرسه حرفه‌ای، دریافت شماره بیمه اجتماعی و مسیر مستقیم اقامت دائم.",
        keyActions: [
          "ثبت آدرس در شهرداری (Anmeldung) و افتتاح حساب بانکی برای واریز حقوق اول ماه.",
          "شروع دوره در اول سپتامبر: ۳ روز در هفته کار عملی در شرکت + ۲ روز مدرسه تئوری (Berufsschule).",
          "شرکت در آزمون میانی (Zwischenprüfung) و آزمون نهایی (Abschlussprüfung).",
          "تبدیل مستقیم به اقامت نیروی کار ماهر دائم پس از قبولی در آزمون نهایی اتاق بازرگانی."
        ],
        checklist: [
          "ثبت آدرس و افتتاح حساب جاری بانکی",
          "شروع رسمی دوره عملی و دریافت کارت شناسایی کارآموزی",
          "دریافت کارت اقامت کارآموزی ۳ ساله از Ausländerbehörde"
        ],
        relevantArticleId: "living-anmeldung-schufa-guide"
      }
    ]
  }
];

export function getTierById(tierId: ImmigrationTierId): ImmigrationTier {
  return IMMIGRATION_TIERS.find(t => t.id === tierId) || IMMIGRATION_TIERS[0];
}
