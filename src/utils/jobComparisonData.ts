export interface ComparisonItem {
  dimension: string;
  iranReality: string;
  germanyExpectation: string;
  germanPeerBenchmark?: string;
  gapLevel: string;
  softwareAndStandardsDelta?: string;
  actionTip: string;
}

export interface SeniorityLevelData {
  title: string;
  germanDuties: string[];
  employerExpectations: string[];
  keyChallenge: string;
}

export interface SeniorityBreakdown {
  junior: SeniorityLevelData;
  mid: SeniorityLevelData;
  senior: SeniorityLevelData;
  lead: SeniorityLevelData;
}

export interface IndustryVariation {
  industryName: string;
  workplaceCulture: string;
  expectedPace: string;
  languageRequirement: string;
}

export interface DailyRoutineItem {
  time: string;
  activity: string;
  description: string;
}

export interface GermanPhrase {
  german: string;
  persian: string;
  context: string;
}

export interface SoftwareToolItem {
  name: string;
  category: string;
  purposeInGermany: string;
  expectedProficiency: "حرفه‌ای (Advanced)" | "تسلط کامل (Expert)" | "آشنایی کاربردی (Working Knowledge)";
  popularity: string;
}

export interface DeliverableReportItem {
  reportTitle: string;
  formatAndTool: string;
  frequency: string;
  recipient: string;
  description: string;
}

export interface StandardNormItem {
  standardName: string;
  description: string;
  importanceLevel: "حیاتی (Mandatory)" | "بسیار مهم (High)" | "مزیت رقابتی (Advantage)";
}

export interface SpecializedDomainCompetency {
  domain: string;
  coreCompetencies: string[];
}

export interface GermanPeerBenchmark {
  peerProfileSummary: string;
  softwareAndTechProficiency: string[];
  standardsAndNormsMastery: StandardNormItem[];
  accumulatedExperienceAndTacitKnowledge: string[];
  specializedKnowledgeAreas: SpecializedDomainCompetency[];
}

export interface DetailedTaskGroup {
  taskGroup: string;
  description: string;
  subTasks: string[];
}

export interface GermanJobDescription {
  officialTitleDe: string;
  kldbCode: string;
  generalScope: string;
  detailedTasksAndDuties: DetailedTaskGroup[];
  employerExpectations: string[];
  softwareAndTools: SoftwareToolItem[];
  deliverablesAndReports: DeliverableReportItem[];
}

export interface JobComparisonData {
  summaryInsight: string;
  jobDescriptionInGermany?: GermanJobDescription;
  germanPeerBenchmark?: GermanPeerBenchmark;
  comparisonTable: ComparisonItem[];
  seniorityBreakdown: SeniorityBreakdown;
  industryVariations: IndustryVariation[];
  dailyRoutine: DailyRoutineItem[];
  keyGermanPhrases: GermanPhrase[];
}

export function getClientJobComparison(params: {
  field?: string;
  seniority?: string;
  industry?: string;
  experience?: number;
  germanLevel?: string;
  skills?: string;
}): JobComparisonData {
  const fieldLower = (params.field || "").toLowerCase();
  const isIT =
    fieldLower.includes("نرم‌افزار") ||
    fieldLower.includes("it") ||
    fieldLower.includes("برنامه‌نویس") ||
    fieldLower.includes("شبکه") ||
    fieldLower.includes("web") ||
    fieldLower.includes("کامپیوتر") ||
    fieldLower.includes("react") ||
    fieldLower.includes("python") ||
    fieldLower.includes("data") ||
    fieldLower.includes("فناوری");

  const isMedical =
    fieldLower.includes("پزشک") ||
    fieldLower.includes("پرستار") ||
    fieldLower.includes("ماما") ||
    fieldLower.includes("دارو") ||
    fieldLower.includes("درمان") ||
    fieldLower.includes("سلامت") ||
    fieldLower.includes("طب");

  const isEngineering =
    fieldLower.includes("مکانیک") ||
    fieldLower.includes("برق") ||
    fieldLower.includes("عمران") ||
    fieldLower.includes("صنایع") ||
    fieldLower.includes("مهندس") ||
    fieldLower.includes("طراحی") ||
    fieldLower.includes("تولید");

  const isLab =
    fieldLower.includes("میکروبیولوژی") ||
    fieldLower.includes("microbio") ||
    fieldLower.includes("آزمایشگاه") ||
    fieldLower.includes("laboratory") ||
    fieldLower.includes("پاتولوژی") ||
    fieldLower.includes("pathology") ||
    fieldLower.includes("ژنتیک") ||
    fieldLower.includes("genetic") ||
    fieldLower.includes("زیست") ||
    fieldLower.includes("biolog") ||
    fieldLower.includes("بیوتکنولوژی") ||
    fieldLower.includes("biotech") ||
    fieldLower.includes("mtl");

  if (isLab) {
    return {
      summaryInsight: `در آزمایشگاه‌های تشخیص طبی و مراکز پاتولوژی و میکروبیولوژی آلمان، کار بر سه ستون خلل‌ناپذیر استوار است: «کنترل کیفی الزام‌آور قانونی تحت گایدلاین Rili-BÄK و استاندارد DIN EN ISO 15189»، «اتوماسیون تشخیصی و شناسایی فوق‌سریع با فناوری MALDI-TOF و آنتی‌بیوگرام بر مبنای بریک‌پوینت‌های اروپایی EUCAST» و «اعتبارسنجی فنی سیستماتیک در سامانه LIMS و اعلان فوری تلفنی مقادیر بحرانی (Panic Values)».
کارفرمای آلمانی (شبکه‌های بزرگ آزمایشگاهی مانند Synlab، Limbach Gruppe، Bioscientia یا دپارتمان‌های آزمایشگاهی کلینیک‌های دانشگاهی) انتظار دارد هر تستی با پایبندی قاطع به چک‌لیست‌های پیش‌تحلیلی و رد نمونه‌های همولیز یا نامنطبق بدون تعارف انجام گیرد.`,
      jobDescriptionInGermany: {
        officialTitleDe: "Medizinische/r Technologin/Technologe für Laboratoriumsanalytik (MTL / MTLA) - Schwerpunkt Mikrobiologie (m/w/d)",
        kldbCode: "KldB 81412 (Medizinisch-technische Laboratoriumsanalytik)",
        generalScope: "انجام کلیه آزمایش‌های تشخیصی میکروبیولوژی، بیوشیمی، هماتولوژی و بیولوژی مولکولی در انطباق کامل با دستورالعمل‌های کنترل کیفی Rili-BÄK، استانداردهای ایمنی زیستی TRBA 100 و اعتبارسنجی الکترونیک در سیستم LIMS.",
        detailedTasksAndDuties: [
          {
            taskGroup: "کشت میکروبیولوژی، شناسایی پاتوژن‌ها و آنتی‌بیوگرام (Bakteriologie & EUCAST)",
            description: "فرآوری نمونه‌های بالینی (کشت ادرار، خون، خلط، سواب‌ها)، رنگ‌آمیزی و تعیین مقاومت دارویی.",
            subTasks: [
              "کشت بر روی محیط‌های اختصاصی و افتراقی و انکوباسیون در شرایط هوازی، بی‌هوازی و میکروآئروفیلیک",
              "رنگ‌آمیزی گرم و بررسی میکروسکوپی سریع لام‌ها جهت گزارش مورفولوژی باکتری‌ها",
              "انجام و تفسیر تست‌های حساسیت آنتی‌بیوتیکی طبق استاندارد اروپایی EUCAST و شناسایی مکانیزم‌های مقاومت (ESBL, MRSA, VRE)"
            ]
          },
          {
            taskGroup: "اتوماسیون آزمایشگاهی و شناسایی با اسپکترومتری جرمی (MALDI-TOF & VITEK)",
            description: "به‌کارگیری سامانه‌های مدرن جهت شناسایی قطعی میکروارگانیسم‌ها در عرض چند دقیقه.",
            subTasks: [
              "آماده‌سازی پلیت‌های تارگت و شناسایی با اسپکترومتر جرمی Bruker MALDI Biotyper",
              "ستاپ کارت‌های تعیین هویت و مقاومت در سیستم اتوماتیک bioMérieux VITEK 2",
              "کالیبراسیون دوره‌ای، شستشوی سیستم‌ها و رفع خطاهای سخت‌افزاری دستگاه‌های اتوآنالایزر"
            ]
          },
          {
            taskGroup: "کنترل کیفیت قانونی و استانداردسازی (Rili-BÄK & ISO 15189)",
            description: "اجرای روزانه و مستندسازی کنترل‌های داخلی و شرکت در ارزیابی‌های مهارت خارجی.",
            subTasks: [
              "اجرای کنترل کیفی داخلی (IQC) با نمونه‌های استاندارد، ترسیم چارت‌های لوی-جنینگز و بررسی قوانین وستگارد",
              "مستندسازی علل خروج از محدوده کنترل کیفی و توقف آنالیز تا رفع کامل عیب و ثبت در فرم‌های OOS",
              "آماده‌سازی و پردازش نمونه‌های آزمون دوره‌ای کنترل کیفی خارجی آلمان (Ringversuche der Instand e.V.)"
            ]
          },
          {
            taskGroup: "تشخیص‌های مولکولی و ایمنی زیستی (PCR & TRBA 100)",
            description: "انجام تست‌های تکثیر ژنتیکی پاتوژن‌ها با استانداردهای حفاظت بیولوژیک.",
            subTasks: [
              "استخراج اسیدهای نوکلئیک DNA و RNA به صورت اتوماتیک در هود لامینار جریان خطی BSL-2",
              "ستاپ واکنش‌های Real-Time PCR تشخیصی، کنترل‌های منفی/مثبت و آنالیز گراف‌های Ct",
              "پایبندی ۱۰۰٪ به ضوابط پیشگیری از آلودگی متقاطع و ایمنی زیستی TRBA 100 در محیط کار"
            ]
          }
        ],
        employerExpectations: [
          "تعهد مطلق به رد نمونه‌های نامناسب (همولیز، لخته، حجم ناکافی) بدون مسامحه",
          "تسلط کامل بر دستورالعمل‌های کنترل کیفی Rili-BÄK و مدیریت کیفیت ISO 15189",
          "سرعت عمل توام با دقت فوق‌العاده بالا و اعلام بدون وقفه نتایج بحرانی (Panic Values)",
          "قابلیت ارتباط به زبان آلمانی رسمی جهت گفتگوی تلفنی دقیق با پزشکان معالج"
        ],
        softwareAndTools: [
          { name: "LIMS (MOLIS / Medat / Swisslab)", category: "سیستم مدیریت اطلاعات آزمایشگاه", purposeInGermany: "ثبت نمونه‌ها، ترکینگ بارکدها، اتصال اتوماتیک دستگاه‌ها و اعتبارسنجی نهایی جواب", expectedProficiency: "تسلط کامل (Expert)", popularity: "۸۵٪ آزمایشگاه‌های آلمان" },
          { name: "Bruker MALDI Biotyper MS", category: "طیف‌سنجی جرمی شناسایی میکروبی", purposeInGermany: "شناسایی سریع گونه‌های باکتریایی و قارچی از روی طیف پروتئینی", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۷۵٪ مراکز پاتولوژی و میکروبیولوژی" },
          { name: "bioMérieux VITEK 2", category: "اتوآنالایزر شناسایی و آنتی‌بیوگرام", purposeInGermany: "تعیین MIC و گزارش الگوهای مقاومت بر مبنای اکسپرت سیستم", expectedProficiency: "تسلط کامل (Expert)", popularity: "۸۰٪ آزمایشگاه‌های بالینی" },
          { name: "Roche Cobas / Sysmex XN", category: "اتوآنالایزرهای اتولاین بیوشیمی و هماتولوژی", purposeInGermany: "انجام تست‌های اتوماتیک خون و بیوشیمی با بارکدخوان هوشمند", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۹۰٪ آزمایشگاه‌های تشخیصی" }
        ],
        deliverablesAndReports: [
          { reportTitle: "Mikrobiologischer Befundbericht", formatAndTool: "LIMS الکترونیک", frequency: "روزانه / پس از تکمیل کشت", recipient: "پزشک معالج / بیمارستان", description: "گزارش نهایی هویت پاتوژن جداشده به همراه لیست آنتی‌بیوتیک‌های حساس و مقاوم طبق EUCAST" },
          { reportTitle: "Rili-BÄK Qualitätskontrollkarte", formatAndTool: "ماژول QC سامانه LIMS", frequency: "روزانه / پیش از شروع پذیرش شیفت", recipient: "مدیر کنترل کیفیت و ممیزان", description: "ثبت انحراف معیار، مقادیر کنترل، اقدامات اصلاحی در صورت خروج از ۲SD" },
          { reportTitle: "Notfall- / Extremwert-Dokumentation", formatAndTool: "سیستم ثبت تماس‌های بحرانی", frequency: "فوری در صورت رخداد مقادیر بحرانی", recipient: "پزشک بخش اورژانس / ICU", description: "مستندسازی تماس تلفنی فوری زیر ۱۵ دقیقه با ذکر نام پزشک و ساعت دقیق برای تست‌های بحرانی یا کشت مثبت خون" },
          { reportTitle: "Probenablehnungs-Protokoll", formatAndTool: "فرم مکتوب رد نمونه در LIMS", frequency: "به ازای هر نمونه نامنطبق", recipient: "بخش نمونه‌گیری یا درمانگاه", description: "ثبت علت رد بیولوژیک نمونه (همولیز، ظرف نادرست، بدون برچسب هویتی) و درخواست نمونه‌گیری مجدد" }
        ]
      },
      germanPeerBenchmark: {
        peerProfileSummary: "همتای آلمانی (MTL با تحصیلات ۳ ساله آکادمیک Berufsfachschule یا کارشناسی علوم آزمایشگاهی) از نخستین روز آموزش با Rili-BÄK و EUCAST تربیت شده و به جای حدس‌های تجربی، کاملاً پروتکل‌محور، مستند و بدون تعارف در رد نمونه‌های غیراستاندارد عمل می‌کند.",
        softwareAndTechProficiency: [
          "تسلط کامل بر کاربری نرم‌افزارهای LIMS بیمارستانی و اتصال دورویه دستگاه‌ها",
          "مهارت عملی در کار با طیف‌سنج جرمی MALDI-TOF و آنالایزرهای اتوماتیک VITEK",
          "اجرای آزمون‌های بیولوژی مولکولی و Real-Time PCR در شرایط استریل BSL-2"
        ],
        standardsAndNormsMastery: [
          { standardName: "Rili-BÄK (Richtlinie der Bundesärztekammer)", description: "دستورالعمل قانونی سازمان نظام پزشکی فدرال آلمان جهت کنترل کیفی آزمایشگاه‌های پزشکی", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "DIN EN ISO 15189", description: "استاندارد بین‌المللی صلاحیت و کیفیت در آزمایشگاه‌های پزشکی و تشخیص طبی", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "EUCAST Guidelines", description: "استاندارد کمیته اروپایی تعیین حساسیت ضدمیکروبی برای آنتی‌بیوگرام", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "TRBA 100", description: "آیین‌نامه فنی آلمان در مورد عوامل بیولوژیک در آزمایشگاه‌ها و ایمنی زیستی", importanceLevel: "بسیار مهم (High)" }
        ],
        accumulatedExperienceAndTacitKnowledge: [
          "شناسایی بصری سریع کلنی‌های پاتوژن‌های شایع بر روی پلیت‌های آگار و بو و مورفولوژی میکروبی",
          "قاطعیت در رد نمونه بدون نگرانی از ناراحتی پزشک، به پشتوانه قانون DIN EN ISO 15189",
          "رویه استاندارد آرام و حرفه‌ای در مکالمه تلفنی با پزشکان ارشد جهت اعلام Notfallbefund"
        ],
        specializedKnowledgeAreas: [
          { domain: "میکروبیولوژی بالینی و قارچ‌شناسی", coreCompetencies: ["کشت تخصصی", "آنتی‌بیوگرام EUCAST", "شناسایی سویه‌های مقاوم MRSA/VRE"] },
          { domain: "تضمین و کنترل کیفیت (QM/QC)", coreCompetencies: ["تحلیل وستگارد", "کالیبراسیون دستگاه‌ها", "مدیریت عدم انطباق‌ها"] },
          { domain: "تشخیص‌های مولکولی", coreCompetencies: ["Real-Time PCR", "استخراج اتوماتیک ژنوم", "الایزا و سرولوژی"] }
        ]
      },
      comparisonTable: [
        {
          dimension: "کنترل کیفی و الزامات قانونی (Quality Control & Rili-BÄK)",
          iranReality: "اجرای کنترل کیفی با سرم‌های کنترلی روزانه، ثبت در دفاتر یا فایل‌های اکسل، بدون الزام قانونی به توقف خط در صورت خروج از ۲SD.",
          germanyExpectation: "پایبندی سخت‌گیرانه به دستورالعمل الزام‌آور قانونی Rili-BÄK، ثبت آنلاین نتایج در LIMS، توقف فوری تست در صورت انحراف و شرکت منظم در Ringversuche.",
          germanPeerBenchmark: "تسلط کامل بر تحلیل چارت‌های لوی-جنینگز و اقدامات اصلاحی فوری طبق ضوابط نظام پزشکی آلمان.",
          gapLevel: "بالا (ضرورت دوره Rili-BÄK)",
          softwareAndStandardsDelta: "یادگیری ساختار Rili-BÄK و فرآیند ارزیابی‌های دوره‌ای Instand e.V.",
          actionTip: "گذراندن دوره مجازی مدیریت کیفیت آزمایشگاهی در آلمان و مطالعه دقیق سرفصل‌های Rili-BÄK."
        },
        {
          dimension: "کشت و تفسیر آنتی‌بیوگرام (EUCAST vs CLSI)",
          iranReality: "به‌کارگیری متداول استانداردهای آمریکایی CLSI یا استانداردهای تلفیقی با اندازه‌گیری دستی قطر هاله دیسک‌ها.",
          germanyExpectation: "الزام ۱۰۰٪ به رعایت استاندارد کمیته اروپایی EUCAST، تعیین MIC و تشخیص قطعی مکانیزم‌های مقاومت ESBL / Carbapenemase.",
          germanPeerBenchmark: "به‌روزرسانی سالانه جداول بریک‌پوینت EUCAST و تنظیم قوانین کارشناسی در نرم‌افزارهای خودکار.",
          gapLevel: "متوسط (تغییر از CLSI به EUCAST)",
          softwareAndStandardsDelta: "جایگزینی جداول CLSI با دستورالعمل‌های رایگان وب‌سایت EUCAST به زبان انگلیسی/آلمانی.",
          actionTip: "مطالعه گایدلاین‌های بالینی EUCAST و تمرین تفسیر مقاومت با بریک‌پوینت‌های اروپایی."
        },
        {
          dimension: "اتوماسیون تشخیصی و شناسایی سریع (MALDI-TOF & VITEK)",
          iranReality: "شناسایی پاتوژن‌ها به کمک محیط‌های قندی، تست‌های بیوشیمیایی لوله‌ای سنتی به دلیل کمبود یا تحریم تجهیزات نوین.",
          germanyExpectation: "شناسایی قطعی باکتری و قارچ در کمتر از ۵ دقیقه به وسیله اسپکترومتر جرمی Bruker MALDI Biotyper و آنتی‌بیوگرام با VITEK 2.",
          germanPeerBenchmark: "کار روزمره و روان با ستاپ تارگت‌های MALDI-TOF و آنالایزرهای کاملاً اتوماتیک آزمایشگاهی.",
          gapLevel: "متوسط به بالا (نیاز به کار با MALDI-TOF)",
          softwareAndStandardsDelta: "آشنایی با مبانی اسپکترومتری جرمی تشخیصی و کاتالوگ تجهیزات Bruker و bioMérieux.",
          actionTip: "درج مدل دستگاه‌های اتوآنالایزری که در ایران با آن‌ها کار کرده‌اید در رزومه و مطالعه راهنماهای MALDI."
        },
        {
          dimension: "معیارهای رد نمونه پیش‌تحلیلی (Sample Rejection Policy)",
          iranReality: "در موارد ناکافی یا همولیز بودن نمونه، معمولاً آزمایش با قید توضیح یا هماهنگی تلفنی غیررسمی انجام می‌شود.",
          germanyExpectation: "رد قطعی و مکتوب هر نمونه دارای همولیز، ایکتریک، لیپمیک یا با برچسب مخدوش بر اساس استاندارد ISO 15189 بدون هیچ استثنایی.",
          germanPeerBenchmark: "ثبت فوری کد رد نمونه در LIMS و درخواست رسمی تکرار نمونه‌گیری توسط بخش درمانی.",
          gapLevel: "انضباطی و رفتاری (قاطعیت در اجرای استاندارد)",
          softwareAndStandardsDelta: "آشنایی با چک‌لیست‌های پیش‌تحلیلی و الزامات اعتبارسنجی DIN EN ISO 15189.",
          actionTip: "در مصاحبه بر پایبندی تزلزل‌ناپذیر خود به اعتبار نمونه و سلامت بیمار تاکید فرمایید."
        },
        {
          dimension: "اعلام مقادیر بحرانی و فوریت‌ها (Panic Values Communication)",
          iranReality: "گزارش نتایج بحرانی در انتهای شیفت یا از طریق بخش پذیرش آزمایشگاه در ساعات اداری.",
          germanyExpectation: "الزام قانونی تماس تلفنی مستقیم با پزشک معالج ظرف ۱۵ دقیقه، احراز هویت شنونده و ثبت زمان دقیق و نام دریافت‌کننده در سیستم.",
          germanPeerBenchmark: "رویه کاملاً خودکار و حرفه‌ای در اعلام موارد بحرانی نظیر هموگلوبین زیر ۷، پتاسیم خطرناک یا کشت مثبت خون.",
          gapLevel: "متوسط (نیازمند زبان آلمانی مکالمه تلفنی B2)",
          softwareAndStandardsDelta: "تسلط بر سناریوهای تماس تلفنی فوری (Notfall-Meldung) به زبان آلمانی.",
          actionTip: "تمرین جملات استاندارد اعلام مقادیر بحرانی به آلمانی با ذکر نام بیمار، بخش و نتیجه آزمایش."
        },
        {
          dimension: "ایمنی زیستی و دفع پسماند (Biosafety & TRBA 100)",
          iranReality: "رعایت اصول کلی آزمایشگاهی و استفاده از دستکش و روپوش، تفکیک زباله‌های عفونی در سطل‌های زردرنگ.",
          germanyExpectation: "پایبندی سخت‌گیرانه به مقررات فنی TRBA 100، کار مداوم زیر هودهای کلاس ۲، مستندسازی اتوکلاو و گندزدایی با مواد تاییدشده RKI/VAH.",
          germanPeerBenchmark: "آگاهی کامل از طبقه‌بندی عوامل بیولوژیک (گروه ۲ و ۳) و اقدامات پیشگیرانه بعد از مواجهه تصادفی (PEP).",
          gapLevel: "پایین تا متوسط",
          softwareAndStandardsDelta: "مطالعه آیین‌نامه‌های بهداشت کار و پیشگیری از حوادث (DGUV Vorschrift) در آزمایشگاه.",
          actionTip: "تاکید بر سابقه کار با تجهیزات حفاظت فردی (PPE) و هودهای لامینار BSL-2 در رزومه کاری."
        }
      ],
      seniorityBreakdown: {
        junior: {
          title: "Junior MTL / Berufseinsteiger/in (کارشناس آزمایشگاه تازه‌کار)",
          germanDuties: [
            "آماده‌سازی نمونه‌های روزانه، کشت‌های اولیه باکتریولوژی و رنگ‌آمیزی‌های روتین",
            "انجام آزمایش‌های بیوشیمی و هماتولوژی روی اتوآنالایزرهای اتوماتیک تحت نظارت همکار ارشد",
            "ثبت نتایج اولیه در سیستم LIMS و انجام کنترل کیفی داخلی صبحگاهی"
          ],
          employerExpectations: [
            "دقت بالا در پردازش نمونه‌ها و عدم دستکاری خودسرانه تنظیمات دستگاه‌ها",
            "تمایل به یادگیری پروتکل‌های آلمانی و سوال پرسیدن به‌موقع در صورت بروز هرگونه ابهام",
            "رعایت دقیق اصول ایمنی فردی و نظم در تمیز نگه داشتن بنچ‌های کاری"
          ],
          keyChallenge: "تطبیق با سرعت کاری بالا و تسلط بر واژگان تخصصی آلمانی نمونه‌ها در LIMS."
        },
        mid: {
          title: "MTL mit Berufserfahrung (کارشناس آزمایشگاه با سابقه کار مستقل)",
          germanDuties: [
            "اعتبارسنجی فنی و تخصصی جواب‌ها در LIMS و شناسایی ارگانیسم‌های پیچیده با MALDI-TOF",
            "انجام مستقل تست‌های حساسیت دارویی EUCAST، استخراج DNA/RNA و ران کردن Real-Time PCR",
            "اجرای کنترل کیفی Rili-BÄK، نگهداری دوره‌ای دستگاه‌ها و اعلام تلفنی مقادیر بحرانی"
          ],
          employerExpectations: [
            "استقلال کامل در کاربری بخش‌های مختلف (میکروبیولوژی، هماتولوژی، بیوشیمی)",
            "توانایی شناسایی و برطرف کردن عیوب متداول دستگاه‌های آنالایزر",
            "ارتباط موثر و آرام با پزشکان بالینی در مکالمات تلفنی"
          ],
          keyChallenge: "تسلط عمیق بر استانداردهای کنترلی و تصمیم‌گیری سریع در شیفت‌های عصر و شب."
        },
        senior: {
          title: "Senior MTL / Fach-MTL (کارشناس ارشد و مسئول فنی سکشن تشخیصی)",
          germanDuties: [
            "مدیریت سکشن تخصصی (نظیر آزمایشگاه میکروبیولوژی بالینی یا تشخیص مولکولی)",
            "نظارت بر اجرای کامل الزامات ISO 15189، اعتباربخشی روش‌های تشخیصی جدید و مدیریت Ringversuche",
            "آموزش کارآموزان جدید و هدایت فنی پرسنل در تفسیر موارد مشکوک و سویه‌های مقاوم نادر"
          ],
          employerExpectations: [
            "دانش عمیق میکروبیولوژی و بیوشیمی بالینی توام با قابلیت حل مسائل پیش‌بینی‌نشده",
            "همکاری نزدیک با پزشک متخصص پاتولوژی/میکروبیولوژی (Facharzt für Mikrobiologie)",
            "بهینه‌سازی هزینه‌ها و مصرف بهینه کیت‌ها و مواد مصرفی آزمایشگاه"
          ],
          keyChallenge: "پاسخگویی به ممیزان رسمی تضمین کیفیت و هدایت دوره‌های معادل‌سازی نیروهای جدید."
        },
        lead: {
          title: "Leitende MTL / Laborleitung (مدیر فنی و اجرایی کل آزمایشگاه)",
          germanDuties: [
            "مدیریت کلی پرسنل، برنامه‌ریزی شیفت‌ها (Dienstplan) و مدیریت بودجه تجهیزات آزمایشگاهی",
            "استقرار و ممیزی سیستم مدیریت کیفیت یکپارچه مطابق استاندارد DIN EN ISO 15189",
            "مذاکره با شرکت‌های تامین‌کننده کیت و تجهیزات و مدیریت زنجیره تامین",
            "هماهنگی استراتژیک با مدیریت بیمارستان، شبکه آزمایشگاهی و مراجع بهداشتی ایالتی"
          ],
          employerExpectations: [
            "مهارت‌های رهبری سازمانی، درایت در حل تعارضات تیمی و کنترل فرسودگی پرسنل",
            "دیدگاه استراتژیک در توسعه فناوری‌های آزمایشگاهی و دیجیتال‌سازی فرآیندها",
            "تضمین ۱۰۰٪ انطباق حقوقی با قوانین سلامت، پرتو و ایمنی زیستی فدرال آلمان"
          ],
          keyChallenge: "مدیریت کمبود نیروی انسانی و حفظ بالاترین استانداردهای تشخیصی زیر فشار کاری."
        }
      },
      industryVariations: [
        {
          industryName: "آزمایشگاه‌های بزرگ شبکه خصوصی (Großlabore wie Synlab, Limbach, Bioscientia)",
          workplaceCulture: "حجم بسیار بالای نمونه‌ها، اتوماسیون کامل و رباتیک، خطوط پیوسته آنالیز و فرآیندهای صنعتی استاندارد.",
          expectedPace: "فوق‌العاده سریع، دقیق و زمان‌بندی‌شده",
          languageRequirement: "آلمانی B2 تخصصی"
        },
        {
          industryName: "آزمایشگاه‌های بیمارستان‌های دانشگاهی (Universitätskliniken)",
          workplaceCulture: "کیس‌های نادر و پیچیده بالینی، بخش‌های پیشرفته ویروس‌شناسی و مولکولی، فضای تحقیقاتی و علمی.",
          expectedPace: "تخصصی و علمی",
          languageRequirement: "آلمانی B2/C1 + انگلیسی روان"
        },
        {
          industryName: "آزمایشگاه‌های بیمارستانی منطقه‌ای (Krankenhauslabore)",
          workplaceCulture: "پوشش ۲۴ ساعته خدمات اورژانس بیمارستان، چرخش کاری بین بخش‌های مختلف و تعامل مستقیم با پزشکان بخش.",
          expectedPace: "متغیر بر اساس وضعیت اورژانس",
          languageRequirement: "آلمانی B2 با مکالمه تلفنی قوی"
        },
        {
          industryName: "مراکز خصوصی پاتولوژی و میکروبیولوژی تخصصی (Facharztpraxen für Pathologie & Mikrobiologie)",
          workplaceCulture: "تیم‌های کوچکتری از کارشناسان، ساعات کاری منظم‌تر و بدون شیفت شب، تمرکز عمیق بر نمونه‌های بیوپسی و سیتولوژی.",
          expectedPace: "دقیق، متمرکز و منظم",
          languageRequirement: "آلمانی B2 کاری"
        }
      ],
      dailyRoutine: [
        { time: "۰۷:۰۰ - ۰۷:۳۰", activity: "ورود، تعویض لباس و استارت کنترل کیفی (IQC)", description: "پوشیدن روپوش و دستکش، ران کردن سرم‌های کنترلی روزانه روی دستگاه‌ها و ارزیابی مقادیر وستگارد." },
        { time: "۰۷:۳۰ - ۱۰:۰۰", activity: "بررسی پلیت‌های کشت و رنگ‌آمیزی گرم (Kulturen ablesen)", description: "بررسی کلنی‌های رشدیافته در انکوباتورها، شناسایی مورفولوژی، تست کاتالاز/اکسیداز و آماده‌سازی تارگت‌های MALDI-TOF." },
        { time: "۱۰:۰۰ - ۱۲:۰۰", activity: "ستاپ آنتی‌بیوگرام و کارتریج‌های VITEK و آنالیز LIMS", description: "تهیه سوسپانسیون مک‌فارلند، لود کردن کارت‌های تست مقاومت دارویی و ثبت نتایج تاییدشده در سامانه LIMS." },
        { time: "۱۲:۰۰ - ۱۲:۴۵", activity: "استراحت ناهار (Mittagspause)", description: "صرف ناهار در سالن استراحت آزمایشگاه به دور از فضای آلوده بنچ‌ها." },
        { time: "۱۲:۴۵ - ۱۴:۳۰", activity: "تست‌های بیولوژی مولکولی و Real-Time PCR یا تایید جواب‌ها", description: "استخراج نمونه‌ها، ران کردن PCR و اعتبارسنجی فنی خروجی‌های اتوآنالایزرها." },
        { time: "۱۴:۳۰ - ۱۵:۰۰", activity: "ضدعفونی بنچ‌ها و تحویل شیفت عصر (Übergabe)", description: "اسپری مواد ضدعفونی سطوح طبق پروتکل TRBA، انتقال وضعیت کشت‌های ناتمام و اعلام هشدارهای روزانه." }
      ],
      keyGermanPhrases: [
        { german: "Rili-BÄK (Richtlinie der Bundesärztekammer)", persian: "دستورالعمل کنترل کیفی سازمان نظام پزشکی آلمان", context: "الزام قانونی که هر روز صبح قبل از آزمایش نمونه بیمار باید با چارت وستگارد مستند شود." },
        { german: "Probenablehnung", persian: "رد رسمی نمونه غیراستاندارد", context: "تصمیم قطعی کارشناس در پذیرش نکردن خون همولیز یا ادرار آلوده طبق استاندارد." },
        { german: "Notfallbefund / Extremwert", persian: "نتیجه بحرانی آزمایشگاهی", context: "مقداری که جان بیمار را تهدید می‌کند و باید زیر ۱۵ دقیقه تلفنی به پزشک گزارش شود." },
        { german: "EUCAST-Leitlinien", persian: "گایدلاین‌های اروپایی آنتی‌بیوگرام", context: "مرجع اصلی تفسیر مقاومت باکتری‌ها در آلمان به جای CLSI آمریکایی." },
        { german: "Anerkennung als MTL", persian: "تاییدیه ارزشیابی مدرک علوم آزمایشگاهی", context: "مجوز قانونی اشتغال به کار در آزمایشگاه‌های آلمان صادر شده توسط اداره بهداشت ایالتی." }
      ]
    };
  }

  if (isIT) {
    return {
      summaryInsight: `در بازار کار فناوری اطلاعات ایران، متخصصان عموماً در قالب «آچار فرانسه» (Generalist) فعالیت می‌کنند و همزمان وظایفی از فرانت‌اند، بک‌اند، دوآپس، پایگاه داده و حتی پشتیبانی شبکه را بر عهده دارند. اما کارفرمای آلمانی بر پارادایم «تخصص عمیق و تفکیک وظایف» (T-Shaped Deep Specialization) تاکید دارد.
در آلمان، شما در یک مرزبندی کاملاً مشخص و شفاف فعالیت خواهید کرد که در آن اولویت اول «کیفیت کد تمیز، تست‌های خودکار (Unit/Integration Tests) و مستندسازی دقیق معماری در Confluence» است، نه سرعت خام و تحویل سریع بدون رعایت ضوابط. همچنین ارتباطات روزانه بر اساس متدولوژی چابک (Scrum) با حضور در Daily Stand-up و تعهد به Definition of Done انجام می‌شود.`,
      
      jobDescriptionInGermany: {
        officialTitleDe: "Softwareentwickler / IT-Fachkraft (m/w/d)",
        kldbCode: "KldB 43114 (Softwareentwicklung & Programmierung)",
        generalScope: "طراحی، پیاده‌سازی، آزمون و نگهداری ماژول‌های نرم‌افزاری مقیاس‌پذیر در محیط‌های ابری یا سازمانی منطبق بر متدولوژی اسکرام، با تمرکز بر توسعه تمیز (Clean Code)، پایداری عملیاتی و رعایت استانداردهای امنیت و حریم خصوصی داده آلمان (DSGVO/BSI).",
        detailedTasksAndDuties: [
          {
            taskGroup: "توسعه ماژولار و کدنویسی استاندارد (Core Engineering)",
            description: "پیاده‌سازی نیازمندی‌های بیزینس در قالب User Storyهای تعریف‌شده در Jira با رعایت الگوهای طراحی (Design Patterns) و معماری میکروسرویس/رویدادمحور.",
            subTasks: [
              "پیاده‌سازی میکروسرویس‌ها با Rest API / gRPC با مستندات کامل در Swagger/OpenAPI",
              "نگارش کدهای ماژولار، Reusable و تست‌پذیر منطبق بر اصول SOLID و DRY",
              "بهینه‌سازی مصرف حافظه، کوئری‌های SQL/NoSQL و Latency تراکنش‌ها"
            ]
          },
          {
            taskGroup: "تضمین کیفیت و تست‌های خودکار (Quality Assurance & CI/CD)",
            description: "مسئولیت مستقیم مهندس در تحویل کد تست‌شده بدون وابستگی صرف به تیم QA دستی.",
            subTasks: [
              "نگارش تست‌های واحد (Unit Tests) و ادغامی (Integration Tests) با پوشش کد حداقل ۸۰٪",
              "تنظیم و رفع خطاهای پایپ‌لاین‌های اتوماسیون در GitLab CI یا GitHub Actions",
              "بررسی خودکار کدهای مشکوک با SonarQube و رفع بدهی‌های فنی (Technical Debt)"
            ]
          },
          {
            taskGroup: "بررسی کد و مستندسازی فنی (Code Review & Documentation)",
            description: "مشارکت فعال و پیوسته در ارتقای کیفیت تیم و انتقال دانش کتبی.",
            subTasks: [
              "بررسی دقیق کدهای همکاران در قالب Pull Request با کامنت‌های ساختاریافته و منطقی",
              "ثبت تصمیمات کلیدی معماری نرم‌افزار در قالب اسناد ADR (Architecture Decision Records)",
              "به‌روزرسانی مستمر دانشنامه فنی تیم در Confluence و راهنماهای استقرار"
            ]
          },
          {
            taskGroup: "عملیات چابک و همکاری تیمی (Agile Collaboration)",
            description: "حضور فعال در تمام ایونت‌های چارچوب کاری اسکرام و پاسخگویی به تعهدات اسپرینت.",
            subTasks: [
              "ارائه گزارش دقیق پیشرفت و موانع (Blockers) در جلسات ۱۵ دقیقه‌ای Daily Stand-up",
              "مشارکت در تخمین استوری‌پوینت‌ها در جلسات Sprint Planning & Refinement",
              "پیشنهاد راهکارهای بهبود عملکرد در جلسات Sprint Retrospective"
            ]
          }
        ],
        employerExpectations: [
          "استقلال عمل فوق‌العاده بالا (Selbstständigkeit) در تبدیل نیازمندی‌های انتزاعی به راه‌حل‌های عملی",
          "فرهنگ شفافیت در مواجهه با خطا (Fehlerkultur) و گزارش فوری مشکلات بدون پنهان‌کاری",
          "تعهد مطلق به زمان‌بندی ددلاین‌ها و احترام به ظرفیت تعهد داده‌شده در اسپرینت",
          "رعایت اخلاق حرفه‌ای، تفکیک ساعت کار از زندگی شخصی (Feierabend) و احترام به همکاران"
        ],
        softwareAndTools: [
          { name: "Jira & Confluence (Atlassian)", category: "مدیریت پروژه و مستندسازی", purposeInGermany: "پیگیری تسک‌ها، اسپرینت‌ها، مستندسازی معماری و دانشنامه تیمی", expectedProficiency: "تسلط کامل (Expert)", popularity: "۹۵٪ شرکت‌های آلمان" },
          { name: "GitLab / GitHub Enterprise", category: "کنترل نسخه و CI/CD", purposeInGermany: "مدیریت کدها، مرج ریکوئست‌ها، پایپ‌لاین‌های بیلد خودکار و اسکن آسیب‌پذیری", expectedProficiency: "تسلط کامل (Expert)", popularity: "۹۰٪ شرکت‌های آلمان" },
          { name: "Docker & Kubernetes (K8s)", category: "کانتینرسازی و ارکستراسیون", purposeInGermany: "ایزوله‌سازی محیط‌های توسعه، استقرار کانتینری و مدیریت مقیاس‌پذیری", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۸۵٪ شرکت‌های آلمان" },
          { name: "SonarQube", category: "آنالیز استاتیک کد و کیفیت", purposeInGermany: "پایش سلامت کد، تحلیل آسیب‌پذیری‌های امنیتی و سنجش Test Coverage", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۸۰٪ شرکت‌های آلمان" },
          { name: "Datadog / Prometheus & Grafana", category: "مانیتورینگ و لاگینگی", purposeInGermany: "مشاهده بلادرنگ لاگ‌های پروداکشن، بررسی سلامت سرورها و آلرت‌ها", expectedProficiency: "آشنایی کاربردی (Working Knowledge)", popularity: "۷۵٪ شرکت‌های آلمان" },
          { name: "Postman / Swagger (OpenAPI)", category: "مستندسازی و تست API", purposeInGermany: "طراحی مشخصات وب‌سرویس‌ها، تست اندپوینت‌ها و هماهنگی با فرانت‌اند", expectedProficiency: "تسلط کامل (Expert)", popularity: "۹۰٪ شرکت‌های آلمان" }
        ],
        deliverablesAndReports: [
          { reportTitle: "اسناد تصمیم‌گیری معماری (ADR - Architecture Decision Record)", formatAndTool: "قالب Markdown در گیت یا صفحه Confluence", frequency: "در زمان اتخاذ هر تصمیم فنی کلان", recipient: "معمار ارشد (Lead Architect) و تیم مهندسی", description: "ثبت چرایی انتخاب یک فریم‌ورک، دیتابیس یا ساختار داده به همراه اثرات مثبت و منفی آن." },
          { reportTitle: "بررسی و تایید پول‌ریکوئست‌ها (Pull Request Review Log)", formatAndTool: "کامنت‌های مدون در GitLab / GitHub PR", frequency: "روزانه / ۲ تا ۳ بار در روز", recipient: "نویسنده کد و همکاران تیم", description: "بررسی کیفیت، تست‌ها، خوانایی و تایید رسمی (Approval) برای ادغام کد با شاخه اصلی." },
          { reportTitle: "گزارش وضعیت اسپرینت و تست‌ها (Sprint Test & Coverage Report)", formatAndTool: "داشبورد اتوماتیک SonarQube & Jira", frequency: "پایان هر اسپرینت ۲ هفته‌ای", recipient: "Product Owner و Scrum Master", description: "ارائه خروجی تست‌های پاس‌شده، فیچرهای آماده استقرار و باگ‌های برطرف‌شده." },
          { reportTitle: "صورت‌جلسه تحلیل حوادث پروداکشن (Post-Mortem / Incident Report)", formatAndTool: "قالب استاندارد ۵-Whys در Confluence", frequency: "پس از هر اختلال بحرانی در سرویس", recipient: "تیم مهندسی و مدیران فنی (CTO / Head of IT)", description: "تحلیل ریشه‌ای علت قطعی سرور، راه‌حل موقت اتخاذشده و اقدامات پیشگیرانه دائمی بدون سرزنش فردی." }
        ]
      },

      germanPeerBenchmark: {
        peerProfileSummary: "همتای آلمانی شما معمولاً فارغ‌التحصیل دانشگاه‌های صنعتی آلمان (TU9 / Hochschule) با مدرک Bachelor یا Master در رشته Informatik است، یا دوره کارآموزی سه‌ساله تخصصی دوگانه (Duales Studium / Fachinformatiker für Anwendungsentwicklung) را گذرانده است. او با فرهنگ کار تیمی آلمانی، استانداردهای کدنویسی سازمانی و چارچوب‌های حقوقی داده از ابتدای مسیر حرفه‌ای خو گرفته است.",
        softwareAndTechProficiency: [
          "تسلط کامل به ابزارهای اکوسیستم اتوماسیون شرکتی (Atlassian Suite, Git Enterprise, Nexus/Artifactory)",
          "تسلط عمیق بر فریم‌ورک‌های تست خودکار (JUnit 5, Mockito, Jest, Cypress, PyTest, Testcontainers)",
          "درک پیشرفته از ابزارهای استقرار زیرساخت به عنوان کد (Infrastructure as Code - Terraform/Ansible)",
          "آشنایی با متدولوژی‌های طراحی داده‌محور (Domain-Driven Design - DDD) و Event Sourcing"
        ],
        standardsAndNormsMastery: [
          { standardName: "مقررات عمومی حفاظت از داده‌های اروپا (DSGVO / GDPR)", description: "حفظ حریم خصوصی در طراحی سیستم (Privacy by Design)، حذف ایمن داده‌های کاربران و رمزنگاری دیتابیس.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "راهنمای امنیت سایبری فدرال آلمان (BSI IT-Grundschutz)", description: "دستورالعمل‌های اداره فدرال امنیت اطلاعات برای توسعه امن نرم‌افزارها در آلمان.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "استاندارد امنیت وب (OWASP Top 10)", description: "محافظت در برابر آسیب‌پذیری‌های متداول وب مانند SQL Injection, XSS, CSRF و مدیریت امن توکن‌ها.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "اصول کدنویسی تمیز (Clean Code & SOLID Principles)", description: "استاندارد نانوشته اما اجباری در شرکت‌های آلمانی برای خوانایی و نگهداری‌پذیری کدها.", importanceLevel: "حیاتی (Mandatory)" }
        ],
        accumulatedExperienceAndTacitKnowledge: [
          "درک ساختار شورای کارگری (Betriebsrat) و عدم نقض حریم خصوصی همکاران در ثبت لاگ‌ها",
          "رویکرد محتاطانه و تدافعی در مهندسی نرم‌افزار (Defensive Programming) برای جلوگیری از خطاهای ناشناخته",
          "ارتباطات صریح، شفاف و بدون حاشیه (Direkte Kommunikation) در جلسات فنی و کد ریویوها",
          "تسلط بر زبان آلمانی فنی و توانایی حضور در جلسات طراحی با مشتریان آلمانی‌زبان"
        ],
        specializedKnowledgeAreas: [
          { domain: "مهندسی معماری و مقیاس‌پذیری", coreCompetencies: ["Microservices Architecture", "Event-Driven Systems (Kafka/RabbitMQ)", "API Gateway & Service Mesh", "Database Sharding & Caching (Redis)"] },
          { domain: "تضمین کیفیت و اتوماسیون تست", coreCompetencies: ["Unit & Integration Testing", "Test-Driven Development (TDD)", "Mocking & Stubs", "End-to-End Contract Testing"] },
          { domain: "امنیت و انطباق قانونی", coreCompetencies: ["DSGVO / GDPR Compliance", "OAuth2 / OIDC Security Flow", "Data Anonymization", "Vulnerability Management"] },
          { domain: "فرآیندهای چابک سازمانی", coreCompetencies: ["Scrum & Kanban Ceremonies", "Estimation & Velocity Tracking", "User Story Splitting", "Definition of Done (DoD)"] }
        ]
      },

      comparisonTable: [
        {
          dimension: "عمق تخصص و مرزبندی وظایف",
          iranReality: "ایفای نقش همه‌کاره (Full-Stack به همراه DevOps و پشتیبانی) و پاسخگویی به هرگونه نیاز فنی متفرقه شرکت.",
          germanyExpectation: "تخصص عمیق بر روی یک پشته مشخص (مثلاً Backend با Java/Spring یا Frontend با React) با مرزبندی شفاف وظایف.",
          germanPeerBenchmark: "تخصص عمیق در دامنه معین با تسلط کامل به استانداردها و مرزبندی‌های معماری سیستم.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "تمرکز بر پشته‌های استاندارد سازمانی (Enterprise Stacks) و ابزارهای مانیتورینگ اختصاصی.",
          actionTip: "در رزومه و مصاحبه به جای لیست کردن ۲۰ ابزار متفرقه، بر یک پشته اصلی به عنوان Core Domain تمرکز کنید."
        },
        {
          dimension: "رویکرد به تست و تضمین کیفیت (QA)",
          iranReality: "تست‌های دستی سریع توسط خود توسعه‌دهنده و رفع خطاها (Hotfix) پس از استقرار در محیط پروداکشن.",
          germanyExpectation: "تعهد به نگارش تست‌های خودکار (Unit, Integration, E2E) با پوشش بالای ۸۰٪ و فرآیند دقیق Code Review.",
          germanPeerBenchmark: "نگارش همزمان تست‌های خودکار قبل یا همراه با کد (TDD) و اجرای خودکار در پایپ‌لاین CI/CD.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "تسلط به Jest, PyTest, JUnit, Testcontainers و SonarQube Quality Gates.",
          actionTip: "در پروژه‌های نمونه خود حتماً تست‌های Jest, PyTest یا JUnit را به همراه پایپ‌لاین CI/CD فعال کنید."
        },
        {
          dimension: "مستندسازی و انتقال دانش (Documentation)",
          iranReality: "توضیحات شفاهی بین همکاران یا پیام‌های متنی در پیام‌رسان‌ها؛ اسناد مدون فنی به ندرت به‌روز می‌شوند.",
          germanyExpectation: "مستندسازی کتبی کلیه تصمیمات معماری (ADRs)، راهنماهای API (Swagger/OpenAPI) و ویکی تیم در Confluence.",
          germanPeerBenchmark: "ثبت بی‌درنگ تغییرات در Confluence و تدوین مستندات فنی طبق استانداردهای arc42.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "آشنایی با Confluence, Markdown, Mermaid Diagrams و استانداردهای arc42.",
          actionTip: "نمونه مستندات فنی و دیاگرام‌های C4 Model را برای پروژه‌های قبلی خود آماده و در گیت‌هاب قرار دهید."
        },
        {
          dimension: "استقلال عمل و حل مسئله (Selbstständigkeit)",
          iranReality: "انتظار دریافت دستور و تایید مداوم از مدیر فنی یا کارفرما برای هر تصمیم کوچک.",
          germanyExpectation: "استقلال کامل در تحلیل تسک، شکستن آن به زیرتسک، تخمین زمان و ارائه راه‌حل‌های پیشنهادی بدون نیاز به نظارت مستقیم.",
          germanPeerBenchmark: "مدیریت خودمختار تسک‌ها از مرحله ایده تا استقرار و هماهنگی فعال با سایر تیم‌ها.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "مدیریت کامل چرخه‌های تسک در Jira و ابزارهای ردیابی زمان (Tempo/Harvest).",
          actionTip: "در مصاحبه نشان دهید چگونه به صورت خودمختار یک چالش پیچیده فنی را از ایده تا اجرا مدیریت کرده‌اید."
        },
        {
          dimension: "پایبندی به قوانین حریم خصوصی و امنیت (DSGVO / GDPR)",
          iranReality: "عدم توجه ساختاری به قوانین حریم داده مگر در صورت بروز مشکل حاد امنیتی.",
          germanyExpectation: "رعایت الزامات قانونی GDPR/DSGVO در ذخیره‌سازی داده‌های کاربران، رمزنگاری و مدیریت دسترسی‌ها.",
          germanPeerBenchmark: "درک شهودی الزامات قانونی داده‌ها در آلمان و اعمال اصول Privacy by Design در تمام کدها.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "تسلط بر قوانین GDPR، استانداردهای BSI و OWASP Top 10.",
          actionTip: "با اصول پایه GDPR و استاندارد OWASP Top 10 آشنا شوید و در مصاحبه به آن اشاره کنید."
        },
        {
          dimension: "ارتباطات کاری و جلسات اسکرام (Scrum)",
          iranReality: "تعارفات کلامی، جلسات طولانی غیرهدفمند و رودربایستی در بیان موانع یا ددلاین‌های غیرواقعی.",
          germanyExpectation: "صراحت و شفافیت کامل (Direkte Kommunikation) در Daily Stand-up؛ بیان سریع موانع (Blockers) بدون تعارف.",
          germanPeerBenchmark: "گزارش‌دهی موجز و متمرکز در استندآپ‌ها، مشارکت در جلسات بازنگری و ارائه فیدبک‌های صریح سازنده.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "کار با ابزارهای Miro, Retro Tools و Jira Sprint Boards.",
          actionTip: "تمرین ارائه گزارش ۲ دقیقه‌ای وضعیت پیشرفت (What I did, What I'll do, Blockers) به آلمانی یا انگلیسی."
        },
        {
          dimension: "مدیریت زمان و تعادل کار و زندگی (Work-Life Balance)",
          iranReality: "اضافه‌کاری‌های بدون برنامه، در دسترس بودن در پیام‌رسان‌ها در ساعات غیرکاری و آخر هفته‌ها.",
          germanyExpectation: "تمرکز صددرصدی در ساعات کاری (۴۰ ساعت در هفته) و قطع کامل ارتباط پس از پایان ساعت کار (Feierabend).",
          germanPeerBenchmark: "برنامه‌ریزی دقیق ظرفیت کاری (Capacity Planning) و عدم پذیرش تسک‌های غیرواقعی خارج از اسپرینت.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "احترام به قوانین قانون کار فدرال (Arbeitszeitgesetz) و ثبت دقیق ساعات کاری.",
          actionTip: "برنامه‌ریزی دقیق روی ظرفیت اسپرینت خود داشته باشید و از قبول تسک‌های اضافه بدون تخمین پرهیز کنید."
        }
      ],
      seniorityBreakdown: {
        junior: {
          title: "Junior Software Developer (کارشناس ورودی / ۱-۲ سال سابقه)",
          germanDuties: [
            "توسعه فیچرهای کوچک و رفع باگ‌ها تحت نظارت مستقیم سینیور تیم",
            "نگارش تست‌های واحد (Unit Tests) برای کدهای نوشته‌شده",
            "مشارکت فعال در جلسات Code Review و رفع کامنت‌های دریافتی",
            "مستندسازی تغییرات و به‌روزرسانی راهنماهای فنی"
          ],
          employerExpectations: [
            "اشتیاق بالا برای یادگیری استانداردهای تیم و پذیرش انتقادات سازنده",
            "پرسیدن سوالات مشخص پس از صرف وقت معقول برای تحقیق شخصی",
            "رعایت Clean Code و قواعد کدنویسی مورد توافق شرکت"
          ],
          keyChallenge: "غلبه بر استرس ناشی از استانداردهای سخت‌گیرانه تست و کد ریویو آلمانی."
        },
        mid: {
          title: "Mid-Level Software Engineer (سطح میانی / ۳-۵ سال سابقه)",
          germanDuties: [
            "طراحی و پیاده‌سازی ماژول‌های کامل نرم‌افزاری به صورت مستقل",
            "یکپارچه‌سازی APIها و بهینه‌سازی کوئری‌های دیتابیس",
            "بررسی کدهای توسعه‌دهندگان جونیور و ارائه فیدبک‌های فنی سازنده",
            "شرکت فعال در طراحی پایپ‌لاین‌های CI/CD و مانیتورینگ سیستم"
          ],
          employerExpectations: [
            "توانایی برآورد دقیق زمان تحویل تسک‌ها بدون تاخیر مکرر",
            "استقلال کامل در عیب‌یابی (Troubleshooting) خطاهای پروداکشن",
            "ارتباط موثر با Product Owner برای شفاف‌سازی نیازمندی‌ها"
          ],
          keyChallenge: "خروج از مدل اجرایی سنتی و مدیریت فرآیندمحور تسک‌ها در ابزارهایی مانند Jira."
        },
        senior: {
          title: "Senior Software Engineer (ارشد تخصصی / +۵ سال سابقه)",
          germanDuties: [
            "معماری سیستم‌های مقیاس‌پذیر و انتخاب تکنولوژی‌های متناسب",
            "حل چالش‌های پیچیده پرفورمنس، امنیت داده و بهینه‌سازی زیرساخت",
            "منتورینگ و ارتقای مهارت‌های فنی توسعه‌دهندگان جونیور و میدلول",
            "رهبری جلسات بازبینی معماری و ثبت تصمیمات در قالب ADRs"
          ],
          employerExpectations: [
            "نگاه جامع به کل زنجیره ارزش محصول (Business & Tech Alignment)",
            "ارائه راه‌حل‌های پایدار با کمترین میزان بدهی فنی (Technical Debt)",
            "توانایی اقناع ذی‌نفعان فنی و غیرفنی با استدلال‌های داده‌محور"
          ],
          keyChallenge: "اثبات توانایی لیدری نرم‌افزاری و تفکر استراتژیک در چارچوب فرهنگ آلمانی."
        },
        lead: {
          title: "Lead Architect / Engineering Manager (راهبر فنی / معمار سیستم)",
          germanDuties: [
            "تدوین استراتژی تکنولوژی و نقشه راه فنی دپارتمان مهندسی",
            "هماهنگی چند تیم مهندسی برای یکپارچگی میکروسرویس‌ها",
            "ارزیابی ابزارهای جدید و مدیریت بودجه ابری و مجوزهای نرم‌افزاری",
            "همکاری تنگاتنگ با مدیران ارشد (CTO / Head of Engineering)"
          ],
          employerExpectations: [
            "قدرت رهبری همدلانه توام با رعایت چارچوب‌های قانون کار آلمان",
            "حفظ پایداری سیستم با در نظر گرفتن ریسک‌های انطباق قانونی (Compliance)",
            "مدیریت تعارضات بین‌فردی با آرامش و منطق حرفه‌ای"
          ],
          keyChallenge: "تسلط بر زبان آلمانی بیزینس برای جلسات هیئت‌مدیره و قراردادها."
        }
      },
      industryVariations: [
        {
          industryName: "شرکت‌های متوسط و قهرمانان پنهان (Mittelstand)",
          workplaceCulture: "پایدار، ساختاریافته، تاکید بر وفاداری، ساختار سلسله‌مراتبی مشخص و مکالمات عمدتاً به زبان آلمانی.",
          expectedPace: "بسیار باثبات و فرآیندمحور",
          languageRequirement: "آلمانی B2 الزامی (جهت تعاملات تیمی)"
        },
        {
          industryName: "غول‌های صنعتی و سازمان‌های بین‌المللی (Großkonzerne)",
          workplaceCulture: "دپارتمان‌های تفکیک‌شده، فرآیندهای ممیزی دقیق، تعهد به استانداردهای امنیت سایبری و قراردادهای دسته‌جمعی کار (Tarifvertrag).",
          expectedPace: "ساختاریافته با چرخه‌های تایید چندمرحله‌ای",
          languageRequirement: "انگلیسی روان + آلمانی B1"
        },
        {
          industryName: "استارتاپ‌ها و اسکیل‌آپ‌های مقیاس‌پذیر (Tech Startups)",
          workplaceCulture: "محیط بین‌المللی، سلسله‌مراتب مسطح (Flat Hierarchy)، استفاده از مدرن‌ترین تکنولوژی‌های ابری و انگلیسی به عنوان زبان اول شرکت.",
          expectedPace: "بسیار چابک و پویا",
          languageRequirement: "انگلیسی روان (C1) / آلمانی اختیاری"
        },
        {
          industryName: "بخش دولتی و خدمات عمومی (Öffentlicher Dienst)",
          workplaceCulture: "امنیت شغلی حداکثری، انطباق ۱۰۰٪ با آیین‌نامه‌های دولتی (BSI IT-Grundschutz) و ساعات کاری دقیق.",
          expectedPace: "رسمی و ضابطه‌مند",
          languageRequirement: "آلمانی C1 و تسلط به مکاتبات رسمی"
        }
      ],
      dailyRoutine: [
        { time: "۰۸:۳۰ - ۰۹:۰۰", activity: "ورود و بررسی بورد کاری", description: "چک کردن ایمیل‌ها، هشدارهای مانیتورینگ و به‌روزرسانی کارت‌های بورد Jira." },
        { time: "۰۹:۱۵ - ۰۹:۳۰", activity: "جلسه دیلی اسکرام (Daily Stand-up)", description: "ارائه گزارش ۱۵ دقیقه‌ای متمرکز به تیم: چه کارهایی انجام شد، برنامه امروز چیست و چه موانعی وجود دارد." },
        { time: "۰۹:۳۰ - ۱۲:۳۰", activity: "بلاک تمرکز عمیق (Deep Focus Time)", description: "توسعه کدهای فیچر، نگارش تست‌های خودکار و بدون وقفه ماندن برای حل مسائل منطقی." },
        { time: "۱۲:۳۰ - ۱۳:۳۰", activity: "استراحت ناهار (Mittagspause)", description: "صرف ناهار با اعضای تیم در غذاخوری یا کافه تریا و گفتگوی غیررسمی جهت تقویت روابط تیمی." },
        { time: "۱۳:۳۰ - ۱۵:۳۰", activity: "کد ریویو و مستندسازی (Review & Docs)", description: "بررسی Pull Requestهای همکاران، ثبت کامنت‌های دقیق و نوشتن مستندات ماژول در Confluence." },
        { time: "۱۵:۳۰ - ۱۷:۰۰", activity: "تست نهایی و استقرار (CI/CD Deploy)", description: "اجرای تست‌های نهایی، اطمینان از پاس شدن پایپ‌لاین و پایان رسمی روز کاری (Feierabend)." }
      ],
      keyGermanPhrases: [
        { german: "Selbstständige Arbeitsweise", persian: "شیوه کار خودمختار و مستقل", context: "کارفرمای آلمانی انتظار دارد تسک‌ها را بدون نیاز به یادآوری مداوم پیش ببرید." },
        { german: "Dokumentationspflicht", persian: "الزام و تعهد به مستندسازی کتبی", context: "هیچ کدی بدون مستندات و راهنمای واضح نباید تحویل پروداکشن شود." },
        { german: "Feierabend", persian: "پایان وقت کاری و تعطیلی روز", context: "احترام به زمان استراحت همکاران و عدم ارسال پیام‌های کاری بعد از ساعت ۵ عصر." },
        { german: "Hands-on-Mentalität", persian: "عمل‌گرایی و روحیه اقدام سریع", context: "آمادگی برای درگیر شدن مستقیم با چالش‌های فنی به جای نظریه‌پردازی صرف." },
        { german: "Kontinuierlicher Verbesserungsprozess (KVP)", persian: "فرآیند بهبود مستمر", context: "پیشنهاد راهکارهای ارتقای کیفی در جلسات رترواسپکتیو اسکرام." }
      ]
    };
  } else if (isMedical) {
    return {
      summaryInsight: `در نظام سلامت و درمان ایران، به دلیل کمبود نیرو و حجم بالای بیماران، فرآیندهای درمانی با سرعت بالا، تصمیمات فوری شفاهی و فداکاری‌های فراتر از ساعات کاری پیش می‌رود. اما در آلمان، درمان پزشکی بر سه اصل بنیادین استوار است: «مستندسازی حقوقی فوق‌العاده دقیق در پرونده الکترونیک (Dokumentationspflicht)»، «رعایت پروتکل‌های محافظت از بیمار و رعایت حقوق و رضایت بیمار (Patientenaufklärung)» و «ارتباط محترمانه و دقیق به زبان رسمی پزشکی آلمانی (Fachsprache)».
کارفرمای آلمانی (بیمارستان، کلینیک یا مرکز توانبخشی) از شما انتظار دارد هر اقدام بالینی، داروی تجویزی و گزارش تغییر وضعیت بیمار را دقیقاً ثبت کنید.`,
      
      jobDescriptionInGermany: {
        officialTitleDe: "Gesundheits- und Krankenpfleger / Assistenzarzt (m/w/d)",
        kldbCode: "KldB 81302 (Gesundheits- und Krankenpflege) / 81404 (Humanmedizin)",
        generalScope: "ارائه خدمات تشخیصی، درمانی و مراقبتی استاندارد در بیمارستان‌ها و کلینیک‌های آلمان منطبق بر گایدلاین‌های بالینی ملی (AWMF / RKI)، مستندسازی حقوقی کامل پرونده الکترونیک و تعامل محترمانه با بیماران و همراهان.",
        detailedTasksAndDuties: [
          {
            taskGroup: "اقدامات تشخیصی، بالینی و مراقبت مستقیم (Clinical Interventions)",
            description: "انجام کلیه پروسیجرهای روتین و تخصصی پزشکی و پرستاری بر پایه استانداردهای بالینی آلمان.",
            subTasks: [
              "اخذ شرح‌حال ساختاریافته پزشکی (Anamnese) و ثبت پارامترهای حیاتی بیمار",
              "تجویز و توزیع دقیق داروها مطابق با برنامه دارویی ۵ گانه (5-R-Regel)",
              "انجام پروسیجرهای استریل، خون‌گیری، پانسمان زخم‌های حاد و مزمن (Wundmanagement)"
            ]
          },
          {
            taskGroup: "مستندسازی حقوقی و پرونده الکترونیک سلامت (Legal Documentation)",
            description: "ثبت بی‌درنگ و ثانیه‌ای تمام اقدامات به عنوان اسناد قانونی قابل استناد در مراجع قضایی آلمان.",
            subTasks: [
              "ثبت دقیق داروها، مشاوره‌ها و پاسخ آزمایش‌ها در سیستم رایانه‌ای بیمارستان (HIS)",
              "نگارش گزارش‌های جامع پزشکی و خلاصه‌های ترخیص بیمار (Arztbriefe / Pflegeberichte)",
              "ثبت رسمی فرم‌های اعلام رضایت آگاهانه بیمار (Patientenaufklärung)"
            ]
          },
          {
            taskGroup: "جلسات تحویل شیفت و راندهای درمانی (Visite & Übergabe)",
            description: "انتقال ساختاریافته اطلاعات بالینی و مشارکت در تصمیم‌گیری‌های تیمی.",
            subTasks: [
              "حضور فعال در راندهای صبحگاهی (Visite) و ارائه خلاصه وضعیت بیماران به پزشک ارشد",
              "برگزاری جلسه رسمی تحویل شیفت (Übergabe) با فرمت استاندارد ISBAR",
              "هماهنگی با بخش‌های پاراکلینیک، رادیولوژی و آزمایشگاه جهت انجام تست‌ها"
            ]
          },
          {
            taskGroup: "رعایت پروتکل‌های بهداشتی و کنترل عفونت (Hygiene & Safety)",
            description: "پایبندی ۱۰۰٪ به دستورالعمل‌های بهداشتی جهت جلوگیری از عفونت‌های بیمارستانی (Nosokomiale Infektionen).",
            subTasks: [
              "اجرای دقیق پروتکل ضدعفونی ۵ مرحله‌ای دست (5 Momente der Händehygiene)",
              "مدیریت ایزولاسیون بیماران دارای عفونت‌های مقاوم بیمارستانی (MRSA / 3MRGN)",
              "گزارش فوری خطاهای درمانی در سامانه گزارش‌دهی ناشناس خطاهای پزشکی (CIRS)"
            ]
          }
        ],
        employerExpectations: [
          "دقت وسواس‌گونه در ثبت مستندات پزشکی بدون هیچ‌گونه جاافتادگی اطلاعاتی",
          "برقراری ارتباط بسیار همدلانه، محترمانه و صبورانه با بیماران به زبان آلمانی روان",
          "پایبندی به سلسله‌مراتب درمانی و درخواست کمک به‌موقع از پزشک مقیم (Hintergrunddienst)",
          "حفظ خونسردی و رفتار حرفه‌ای در مواجهه با شرایط اورژانسی و بیماران بدحال"
        ],
        softwareAndTools: [
          { name: "Agfa ORBIS / Dedalus", category: "سیستم جامع اطلاعات بیمارستانی (HIS)", purposeInGermany: "ثبت الکترونیکی کامل پرونده، داروها، دستورات پزشک و گزارش‌های پرستاری", expectedProficiency: "تسلط کامل (Expert)", popularity: "۶۰٪ بیمارستان‌های آلمان" },
          { name: "SAP for Healthcare (i.s.h.med / Cerner)", category: "مدیریت اطلاعات بالینی و مالی", purposeInGermany: "پذیرش بیمار، مدیریت تخت‌ها، ثبت اقدامات درمانی و صدور صورتحساب", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۳۵٪ بیمارستان‌های بزرگ و دانشگاهی" },
          { name: "Meona / CGM CLINICAL", category: "مدیریت الکترونیک دارو و نسخه", purposeInGermany: "تجویز دیجیتال، کنترل تداخلات دارویی و پایش پارامترهای آزمایشگاهی", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۴۰٪ کلینیک‌های تخصصی" },
          { name: "CIRS (Critical Incident Reporting)", category: "سامانه ملی گزارش خطاهای پزشکی", purposeInGermany: "ثبت ناشناس رخدادهای ناگوار و خطاهای نزدیک به وقوع جهت ارتقای ایمنی بیمار", expectedProficiency: "آشنایی کاربردی (Working Knowledge)", popularity: "۱۰۰٪ بیمارستان‌های قانونی آلمان" }
        ],
        deliverablesAndReports: [
          { reportTitle: "نامه رسمی ترخیص بیمار (Arztbrief / Entlassungsbrief)", formatAndTool: "قالب استاندارد چاپی و دیجیتال در ORBIS", frequency: "در زمان ترخیص هر بیمار", recipient: "پزشک خانواده بیمار (Hausarzt) و سازمان بیمه", description: "شرح کامل سیر بستری، تشخیص نهایی، اقدامات انجام‌شده، نتایج آزمایش‌ها و دستورات دارویی آینده." },
          { reportTitle: "پروتکل تحویل شیفت پرستاری (Übergabeprotokoll)", formatAndTool: "چک‌لیست دیجیتال در HIS", frequency: "۳ بار در شبانه‌روز در هر تعویض شیفت", recipient: "کادر شیفت بعدی", description: "خلاصه وضعیت هوشیاری، علائم حیاتی، پانسمان‌ها، داروهای وریدی و اقدامات نیازمند پیگیری." },
          { reportTitle: "برگه رضایت آگاهانه بالینی (Patientenaufklärungsbogen)", formatAndTool: "فرم مکتوب Thieme / Diomed با امضای فیزیکی بیمار", frequency: "قبل از هر عمل جراحی یا اقدام تهاجمی", recipient: "بایگانی حقوقی بیمارستان", description: "ثبت رسمی تفهیم عوارض عمل، گزینه‌های جایگزین و تاییدیه رضایت بیمار در حضور شاهد." },
          { reportTitle: "گزارش ثبت زخم و مراقبت‌های تسکینی (Wunddokumentation)", formatAndTool: "فرم تصویری و متنی در سیستم اطلاعات بالینی", frequency: "هفتگی / در هر بار تعویض پانسمان", recipient: "سرپرستار و کارشناس مدیریت زخم (Wundmanager)", description: "اندازه‌گیری ابعاد زخم، میزان ترشحات، مرحله‌بندی بر اساس استاندارد و نوع پانسمان مصرفی." }
        ]
      },

      germanPeerBenchmark: {
        peerProfileSummary: "همتای آلمانی شما دوره ۳ ساله کارآموزی دوگانه دولتی پرستاری (Pflegefachmann/-frau) را گذرانده یا فارغ‌التحصیل رشته پزشکی (Medizinstudium) از دانشگاه‌های معتبر آلمان است و آزمون دولتی (Staatsexamen) را با موفقیت پشت سر گذاشته است. او از روز اول آموزش با حقوق درمانی، اصطلاحات محاوره‌ای بیماران سالمند و سخت‌گیری‌های موسسه رابرت کخ آشنا شده است.",
        softwareAndTechProficiency: [
          "تسلط کامل و تایپ سریع آلمانی در سامانه‌های ثبت بالینی بیمارستانی (ORBIS, i.s.h.med, CGM)",
          "کار با سامانه‌های هوشمند پایش علائم حیاتی متصل به مانیتورهای دراژه (Dräger Infinity)",
          "استفاده حرفه‌ای از سامانه‌های الکترونیکی ثبت ترخیص و مدیریت تریاژ (Manchester Triage System)"
        ],
        standardsAndNormsMastery: [
          { standardName: "دستورالعمل‌های بهداشتی انستیتو رابرت کخ (RKI-Hygieneleitlinien)", description: "استاندارد مرجع پیشگیری از عفونت‌های بیمارستانی، گندزدایی و پروتکل‌های ایزولاسیون در آلمان.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "گایدلاین‌های تخصصی انجمن‌های علمی پزشکی (AWMF S3-Leitlinien)", description: "راهنماهای بالینی مبتنی بر شواهد برای استانداردسازی درمان انواع بیماری‌ها.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "قانون حقوق بیماران در آلمان (Patientenrechtegesetz - BGB §630)", description: "الزام قانونی پزشک و درمانگر به افشای تمام ریسک‌ها و خطاهای درمانی به بیمار.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "نظام طبقه‌بندی و کدگذاری بیماری‌ها (ICD-10-GM & OPS)", description: "سیستم استاندارد آلمانی برای کدگذاری بیماری‌ها و اقدامات درمانی جهت تسویه با بیمه‌ها.", importanceLevel: "بسیار مهم (High)" }
        ],
        accumulatedExperienceAndTacitKnowledge: [
          "مهارت ارتباطی صبورانه با لهجه‌های محلی و افراد سالخورده در بخش‌های درمانی (Geriatrie)",
          "درک عمیق از حدود اختیارات شغلی قانونی و تفکیک مرز میان وظایف پرستار، رزیدنت و پزشک متخصص",
          "توانایی مدیریت تعارضات کلامی با همراهان نگران با استفاده از تکنیک‌های روان‌شناختی آرام‌سازی",
          "پایبندی به قانون ساعات کاری کادر درمان (Arbeitszeitgesetz) و استراحت‌های اجباری میان‌شیفتی"
        ],
        specializedKnowledgeAreas: [
          { domain: "زبان تخصصی و ارتباطات بالینی", coreCompetencies: ["Fachsprache Medizin (C1)", "Patientenaufklärung", "Ärztliche Gesprächsführung", "Deeskalationstraining"] },
          { domain: "مستندسازی و حقوق درمان", coreCompetencies: ["Arztbriefschreibung", "Forensische Dokumentation", "ICD-10 / OPS Kodierung", "Patientenrechte (BGB)"] },
          { domain: "ایمنی بیمار و مراقبت‌های ویژه", coreCompetencies: ["RKI-Hygienevorschriften", "Notfallmanagement / Reanimation (ACLS)", "Wundmanagement", "Schmerztherapie"] },
          { domain: "اقتصاد درمان و قوانین سلامت", coreCompetencies: ["G-DRG System", "Krankenkassenabrechnung", "MDK-Prüfungen", "Arzneimittelsicherheit"] }
        ]
      },

      comparisonTable: [
        {
          dimension: "مستندسازی بالینی و پرونده بیمار (Dokumentation)",
          iranReality: "ثبت خلاصه اقدامات در پرونده دستی؛ اتکا به توضیحات شفاهی در شیفت تحویل.",
          germanyExpectation: "ثبت الکترونیکی فوق‌العاده دقیق و ثانیه‌ای تمام داروها، مشاهدات، پانسمان‌ها و گفتگو با بیمار به عنوان سند قانونی دادگاه.",
          germanPeerBenchmark: "ثبت بی‌درنگ و موشکافانه تمام علائم در HIS با اصطلاحات استاندارد قانونی و علائم اختصاری معتبر.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "تسلط کامل بر سامانه‌های ORBIS یا SAP i.s.h.med و قوانین BGB §630.",
          actionTip: "اصطلاحات تخصصی ثبت وضعیت بیمار در سیستم‌های HIS آلمان (مانند Orbis یا SAP Health) را یاد بگیرید."
        },
        {
          dimension: "زبان تخصصی بالینی و ارتباط با بیمار (Fachsprache)",
          iranReality: "استفاده از اصطلاحات انگلیسی پزشکی بین همکاران و زبان ساده فارسی با بیمار.",
          germanyExpectation: "تسلط کامل به واژگان پزشکی آلمانی (Fachbegriffe) با همکاران و معادل‌های عامیانه و روان با بیماران سالخورده (Umgangssprache).",
          germanPeerBenchmark: "ترجمه فوری اصطلاحات پیچیده پزشکی لاتین به زبان ساده عامیانه برای تفهیم دقیق بیمار.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "قبولی در آزمون زبان تخصصی نظام پزشکی فدرال (Fachsprachenprüfung - FSP C1).",
          actionTip: "حتماً برای آزمون زبان تخصصی کادر درمان (FSP - Fachsprachenprüfung) با نمونه شرح‌حال‌های واقعی آماده شوید."
        },
        {
          dimension: "تفکیک وظایف و نقش‌های کادر درمان",
          iranReality: "انجام وظایف همپوشان بین پزشک، رزیدنت، پرستار و بهیار به دلیل کمبود شدید نیرو.",
          germanyExpectation: "مرزبندی فوق‌العاده شفاف طبق آیین‌نامه‌ها؛ هیچ فردی فراتر از حدود قانونی صلاحیت خود نباید دست به اقدام بزند.",
          germanPeerBenchmark: "رعایت حدود صلاحیت تفویض‌شده (Delegationsrecht) و احترام کامل به نقش‌های تخصصی مراقبتی.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "آشنایی با آیین‌نامه‌های PflBerG و حدود اختیارات تفویضی پزشک به پرستار.",
          actionTip: "با حدود اختیارات قانونی و وظایف استاندارد کادر درمان در آلمان (Pflegerichtlinien) آشنا شوید."
        },
        {
          dimension: "ارتباط با بیمار و جلب رضایت آگاهانه (Patientenaufklärung)",
          iranReality: "توضیح کوتاه به بیمار یا همراهان او؛ تصمیم‌گیری پزشک به عنوان مرجع اصلی درمان.",
          germanyExpectation: "توضیح موشکافانه تمام عوارض، گزینه‌های جایگزین و دریافت فرم رضایت کتبی با امضای بیمار پیش از هر مداخله.",
          germanPeerBenchmark: "انجام جلسات مشاوره Aufklärung حداقل ۲۴ ساعت قبل از عمل و مستندسازی دقیق سوالات بیمار.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "فرم‌های حقوقی Aufklärungsbögen و رعایت استانداردهای انطباق قضایی.",
          actionTip: "مهارت‌های ارتباطی و همدلی با بیمار (Empathische Gesprächsführung) را در مصاحبه نشان دهید."
        },
        {
          dimension: "رعایت بهداشت و استانداردهای پیشگیری از عفونت (Hygiene)",
          iranReality: "رعایت کلیات استانداردهای بهداشتی در حد امکانات موجود بیمارستان.",
          germanyExpectation: "انطباق صددرصدی و بدون استثنا با پروتکل‌های سخت‌گیرانه موسسه رابرت کخ (RKI-Richtlinien) در ضدعفونی و تجهیزات محافظتی.",
          germanPeerBenchmark: "اجرای خودکار و ناخودآگاه استانداردهای ۵ مرحله‌ای ضدعفونی دست و مدیریت دقیق باکتری‌های مقاوم.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "دستورالعمل‌های انستیتو رابرت کخ (RKI-Empfehlungen) و مقررات TRBA 250.",
          actionTip: "با استانداردهای RKI و اصول ضدعفونی دست (Händehygiene nach 5-Momente-Modell) مسلط باشید."
        },
        {
          dimension: "تنظیم شیفت‌ها و قوانین ساعات کار (Arbeitszeitgesetz)",
          iranReality: "شیفت‌های متوالی و فشرده ۲۴ یا ۳۶ ساعته بدون استراحت کافی قانونی.",
          germanyExpectation: "حداکثر شیفت‌های استاندارد، استراحت اجباری حداقل ۱۱ ساعته بین دو شیفت و پرداخت دقیق حق اضافه‌کاری و شیفت شب.",
          germanPeerBenchmark: "ثبت دقیق ساعات اضافه کاری در سیستم Dienstplan و رعایت استراحت‌های اجباری جهت پیشگیری از خطای انسانی.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "نرم‌افزارهای برنامه‌ریزی شیفت مانند SP-EXPERT و قانون ArbZG.",
          actionTip: "برنامه‌ریزی دقیق روی شیفت‌های ماهیانه (Dienstplan) و هماهنگی رسمی با سرپرستار."
        }
      ],
      seniorityBreakdown: {
        junior: {
          title: "Assistenzarzt / Pflegefachkraft (دستیار تازه‌وارد / پرستار ورودی)",
          germanDuties: [
            "پذیرش بیماران، گرفتن شرح‌حال اولیه (Anamnese) و ثبت علائم حیاتی",
            "انجام اقدامات روتین بالینی، خون‌گیری، تزریقات و پانسمان زخم‌ها",
            "حضور فعال در راندهای درمانی (Visite) و یادداشت دستورات پزشک ارشد",
            "ارائه گزارش منظم وضعیت بیماران در جلسات تحویل شیفت (Übergabe)"
          ],
          employerExpectations: [
            "دقت حداکثری در ثبت مستندات بدون جاافتادگی دارویی",
            "رویکرد محترمانه و صبورانه در مواجهه با بیماران سالخورده",
            "درخواست کمک فوری از پزشک یا پرستار مسئول در موارد اورژانسی"
          ],
          keyChallenge: "غلبه بر موانع زبانی در درک لهجه‌های محلی بیماران آلمانی."
        },
        mid: {
          title: "Facharzt / Erfahrene Pflegekraft (پزشک متخصص / پرستار مجرب)",
          germanDuties: [
            "تشخیص مستقل و تجویز برنامه‌های درمانی مطابق با گایدلاین‌های AWMF",
            "انجام پروسیجرهای تخصصی، جراحی‌های سرپایی یا مراقبت‌های ویژه (ICU)",
            "هدایت راندهای صبحگاهی و نظارت بر دستیاران جوان‌تر",
            "پاسخگویی به مشاوره‌های پزشکی بخش‌های دیگر بیمارستان"
          ],
          employerExpectations: [
            "تصمیم‌گیری بالینی متقن بر پایه شواهد علمی (Evidence-Based Medicine)",
            "مدیریت آرام بحران‌های بالینی بدون ایجاد اضطراب در تیم",
            "نگارش گزارش‌های ترخیص دقیق و جامع (Arztbriefe) در زمان مقرر"
          ],
          keyChallenge: "تسلط بر نگارش سریع و بی‌نقص گزارش‌های جامع ترخیص به زبان آلمانی."
        },
        senior: {
          title: "Oberarzt / Stationsleitung (پزشک معالج ارشد / سرپرستار بخش)",
          germanDuties: [
            "نظارت عالی بر کیفیت درمانی کل بخش و تایید برنامه‌های درمانی پیچیده",
            "انجام جراحی‌ها و مداخله‌های پیشرفته تشخیصی و درمانی",
            "مدیریت نیروی انسانی، برنامه‌ریزی شیفت‌ها (Dienstplan) و آموزش کادر جدید",
            "مشارکت در جلسات مورتالیتی و کمیته‌های کنترل عفونت بیمارستان"
          ],
          employerExpectations: [
            "رهبری علمی و سازمانی تیم درمانی با حفظ انگیزه و همدلی",
            "کنترل هزینه‌های درمانی و آشنایی با سیستم مالی بیمارستانی DRG",
            "تعامل موثر با مدیریت بیمارستان و سازمان‌های بیمه‌گر (Krankenkassen)"
          ],
          keyChallenge: "آشنایی با سیستم کدگذاری درمانی (ICD-10-GM / OPS) و مدیریت اقتصادی بخش."
        },
        lead: {
          title: "Chefarzt / Pflegedirektion (رئیس دپارتمان / مدیر پرستاری کل)",
          germanDuties: [
            "تعیین خط‌مشی بالینی و علمی کل دپارتمان پزشکی یا مراقبتی",
            "تضمین اعتباربخشی بیمارستان و انطباق با بازرسی‌های موسسات نظارتی",
            "برنامه‌ریزی استراتژیک تجهیزات پزشکی، تخت‌ها و استخدام پزشکان متخصص",
            "هدایت پژوهش‌های بالینی و همکاری با دانشگاه‌های علوم پزشکی"
          ],
          employerExpectations: [
            "اعتبار علمی بالا توام با درایت در مدیریت بودجه‌های چند ده میلیون یورویی",
            "برقراری ارتباط استراتژیک با ایالت، نظام پزشکی (Ärztekammer) و بیمه‌ها",
            "توانایی جذب نیروهای نخبه و ارتقای رتبه بیمارستان در رنکینگ‌های ملی"
          ],
          keyChallenge: "احراز بالاترین استانداردهای نظام سلامت و قوانین بهداشت فدرال آلمان."
        }
      },
      industryVariations: [
        {
          industryName: "بیمارستان‌های دانشگاهی و مراکز مراقبت فوق تخصصی (Universitätskliniken)",
          workplaceCulture: "پژوهش‌محور، پرونده‌های بسیار پیچیده بالینی، تکنولوژی‌های نوین و استانداردهای سخت‌گیرانه دانشگاهی.",
          expectedPace: "فشرده، علمی و بسیار تخصصی",
          languageRequirement: "آلمانی C1 پزشکی + انگلیسی آکادمیک"
        },
        {
          industryName: "بیمارستان‌های عمومی و منطقه‌ای (Städtische & Regionale Kliniken)",
          workplaceCulture: "تنوع بالای بیماران، ارتباط نزدیک با جامعه محلی، محیط همکاری دوستانه و تمرکز بر درمان بالینی استاندارد.",
          expectedPace: "منظم و مداوم",
          languageRequirement: "آلمانی B2/C1 با لهجه روان"
        },
        {
          industryName: "مراکز جراحی محدود و کلینیک‌های تخصصی (Fachkliniken & MVZ)",
          workplaceCulture: "ساعات کاری مشخص‌تر و بدون شیفت شب سنگین، تمرکز بر تخصص‌های معین (مانند ارتوپدی یا چشم‌پزشکی).",
          expectedPace: "برنامه‌ریزی‌شده و روتین",
          languageRequirement: "آلمانی B2 تخصصی"
        },
        {
          industryName: "مراکز توانبخشی و مراقبت سالمندان (Rehakliniken & Pflegeheime)",
          workplaceCulture: "تاکید ویژه بر ارتباط انسانی، فیزیوتراپی، مراقبت‌های تسکینی و محیط آرام‌تر نسبت به بیمارستان‌های حاد.",
          expectedPace: "آرام و بیمارمحور",
          languageRequirement: "آلمانی B2 با صبر و حوصله کلامی بالا"
        }
      ],
      dailyRoutine: [
        { time: "۰۶:۳۰ - ۰۷:۰۰", activity: "ورود و جلسه تحویل شیفت (Frühübergabe)", description: "دریافت گزارش دقیق بیماران از شیفت شب، بررسی پرونده‌ها و برنامه‌ریزی روز." },
        { time: "۰۷:۰۰ - ۰۸:۳۰", activity: "راندهای بالینی و نمونه‌گیری (Visite & Labor)", description: "حضور بر بالین بیماران، ارزیابی علائم، خون‌گیری و ثبت گزارش‌های صبحگاهی." },
        { time: "۰۸:۳۰ - ۱۲:۰۰", activity: "مداخلات درمانی، اتاق عمل یا کلینیک سرپایی", description: "انجام جراحی‌ها، آندوسکوپی، تزریقات، پانسمان‌ها و ویزیت بیماران جدید." },
        { time: "۱۲:۰۰ - ۱۲:۴۵", activity: "استراحت ناهار و تبادل نظر (Mittagspause)", description: "صرف ناهار در کافه تریا و مشورت درباره پرونده‌های دشوار با همکاران بخش." },
        { time: "۱۲:۴۵ - ۱۴:۳۰", activity: "نگارش گزارش‌ها و ترخیص (Arztbriefe / Doku)", description: "ثبت کامل گزارش‌های ترخیص در سیستم رایانه‌ای، ارسال نمونه‌ها و تماس با پزشکان خانواده." },
        { time: "۱۴:۳۰ - ۱۵:۰۰", activity: "تحویل شیفت به همکاران عصر (Spätübergabe)", description: "ارائه دقیق وضعیت تمام بیماران، داروهای منتظر تایید و تحویل کلیدها." }
      ],
      keyGermanPhrases: [
        { german: "Dokumentationspflicht", persian: "الزام ثبت قانونی و بی‌نقص پرونده پزشکی", context: "پایه اصلی محافظت حقوقی از پزشک و پرستار در برابر ادعاهای احتمالی." },
        { german: "Patientenaufklärung", persian: "توضیح جامع و جلب رضایت آگاهانه بیمار", context: "پیش از هر پروسیجر باید تمام عوارض و انتخاب‌ها با آرامش توضیح داده شود." },
        { german: "Übergabe", persian: "جلسه رسمی و حساس تحویل شیفت", context: "تبادل بی‌نقص اطلاعات بالینی بین کادر دو شیفت متوالی." },
        { german: "Fachsprachenprüfung (FSP)", persian: "آزمون رسمی زبان تخصصی پزشکی", context: "شرط اصلی دریافت پروانه طبابت موقت (Berufserlaubnis) در آلمان." },
        { german: "Hygienevorschriften", persian: "دستورالعمل‌های بهداشتی ضدعفونی", context: "رعایت دقیق پروتکل‌های RKI برای حفظ سلامت کادر و بیماران." }
      ]
    };
  } else if (isEngineering) {
    return {
      summaryInsight: `در صنعت و مهندسی ایران، مهندسان اغلب مجبورند به دلیل تحریم‌ها، کمبود قطعات یدکی و محدودیت بودجه، به راهکارهای خلاقانه بداهه، تغییرات لحظه‌ای در کارگاه و دور زدن استانداردها برای به راه انداختن خط تولید روی بیاورند.
اما در مهندسی آلمان، رویکرد کاملاً برعکس است: «انطباق میلی‌متری با استانداردهای ملی و اروپایی (DIN / DIN EN ISO)»، «تعهد به دستورالعمل‌های ایمنی و ماشین‌آلات (CE / Maschinenrichtlinie)» و «روش‌های پیشگیرانه کنترل کیفیت (مانند FMEA و APQP)».
کارفرمای آلمانی (از شرکت‌های صنعتی متوسط Mittelstand تا غول‌هایی مانند زیمنس، بوش یا فولکس‌واگن) از شما انتظار دارد محاسبات، نقشه‌ها و تلرانس‌ها را به گونه‌ای طراحی کنید که در ممیزی‌های رسمی (TÜV) بدون هیچ اشکالی تایید شوند.`,
      
      jobDescriptionInGermany: {
        officialTitleDe: "Entwicklungsingenieur / Konstrukteur (m/w/d)",
        kldbCode: "KldB 26114 (Maschinenbau) / 26214 (Elektrotechnik)",
        generalScope: "طراحی، مدل‌سازی سه‌بعدی، شبیه‌سازی عددی و تهیه نقشه‌های ساخت صنعتی مجموعه‌های مکانیکی یا الکترومکانیکی منطبق بر الزامات استانداردهای اروپایی و ملی آلمان (DIN EN ISO) و سیستم‌های مدیریت داده محصول (PLM).",
        detailedTasksAndDuties: [
          {
            taskGroup: "مدل‌سازی پارامتریک و نقشه‌کشی دقیق ساخت (CAD & GD&T)",
            description: "طراحی اجزای مکانیکی با تلرانس‌گذاری هندسی طبق استانداردهای DIN ISO 2768 و DIN EN ISO 1101.",
            subTasks: [
              "ایجاد مدل‌های سه‌بعدی پیچیده در نرم‌افزارهای CATIA, Siemens NX یا SolidWorks",
              "تهیه نقشه‌های دوبعدی تولیدی با مشخص کردن کامل زبری سطوح، رواداری‌ها و انطباقات",
              "تعریف دقیق متریال، عملیات حرارتی و پوشش‌های سطحی مطابق با کدهای استاندارد آلمان"
            ]
          },
          {
            taskGroup: "محاسبات تحلیلی و شبیه‌سازی مهندسی (FEA / CFD Simulation)",
            description: "اعتبارسنجی تئوری و عددی مقاومت قطعات قبل از ورود به فاز ساخت نمونه اولیه.",
            subTasks: [
              "انجام تحلیل‌های تنش، کرنش و خستگی (Fatigue Analysis) در نرم‌افزار ANSYS یا Abaqus",
              "بهینه‌سازی توپولوژی و کاهش وزن سازه با حفظ ضرایب اطمینان استاندارد",
              "تهیه گزارش‌های رسمی محاسبات مهندسی (Berechnungsberichte) جهت ارائه به ممیزان TÜV"
            ]
          },
          {
            taskGroup: "مدیریت کیفیت پیشگیرانه و ارزیابی ریسک (FMEA & Risk Assessment)",
            description: "پیش‌بینی و پیشگیری از هرگونه خرابی بالقوه در محصول یا فرآیند ساخت.",
            subTasks: [
              "هدایت و تکمیل ماتریس تحلیل اثرات و حالات شکست طراحی و فرآیند (D-FMEA / P-FMEA)",
              "انجام ارزیابی ریسک ماشین‌آلات طبق استاندارد DIN EN ISO 12100 برای نشان CE",
              "بررسی گزارش‌های عدم انطباق با متدولوژی حل مسئله ۸ بعدی (8D-Report)"
            ]
          },
          {
            taskGroup: "آزادسازی مهندسی و مدیریت داده محصول (PLM & ECO)",
            description: "ثبت چرخه عمر داده‌های محصول و مدیریت تغییرات مهندسی در سیستم‌های یکپارچه.",
            subTasks: [
              "بارگذاری و کنترل نسخه‌های مدل‌ها و نقشه‌ها در سامانه‌های Teamcenter یا SAP ECTR",
              "صدور و پیگیری دستور تغییرات مهندسی (Engineering Change Order - ECO)",
              "همکاری با کارشناسان خرید و تولید جهت اعتبارسنجی نمونه‌های اولیه (PPAP / VDA 2)"
            ]
          }
        ],
        employerExpectations: [
          "دقت میلی‌متری و وسواس علمی در تلرانس‌گذاری و عدم ارسال نقشه‌های دارای ابهام به کارگاه",
          "استقلال کامل در انجام محاسبات مقاومت مصالح و استناد دقیق به مراجع استاندارد DIN",
          "فرهنگ شفافیت در اعلام خطاهای طراحی قبل از رسیدن قطعه به خط مونتاژ نهایی",
          "احترام کامل به آیین‌نامه‌های حفاظت فردی و ایمنی در محیط کار و سالن‌های تست"
        ],
        softwareAndTools: [
          { name: "Siemens NX / CATIA V5-V6 / SolidWorks", category: "طراحی سه‌بعدی و مدلسازی پیشرفته (CAD)", purposeInGermany: "طراحی مکانیکی قطعات خودرو، ماشین‌آلات صنعتی و سامانه‌های مکاترونیکی", expectedProficiency: "تسلط کامل (Expert)", popularity: "۹۰٪ صنایع خودروسازی و ماشین‌سازی آلمان" },
          { name: "Siemens Teamcenter / PTC Windchill / SAP PLM", category: "مدیریت چرخه عمر محصول (PLM)", purposeInGermany: "مدیریت یکپارچه داده‌های مهندسی، درخت محصول (BOM) و آزادسازی نقشه‌ها", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۸۵٪ شرکت‌های صنعتی متوسط و بزرگ" },
          { name: "ANSYS Workbench / Abaqus / HyperWorks", category: "شبیه‌سازی المان محدود (FEA/CFD)", purposeInGermany: "تحلیل تنش‌های استاتیکی و دینامیکی، ارتعاشات، انتقال حرارت و سیالات", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۷۵٪ دپارتمان‌های R&D" },
          { name: "EPLAN Electric P8", category: "طراحی مدارهای الکتریکی و کنترل", purposeInGermany: "ترسیم نقشه‌های سیم‌کشی، تابلوهای برق و اتوماسیون صنعتی PLC", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۹۰٪ صنایع برق و ماشین‌آلات" },
          { name: "APIS IQ-FMEA", category: "مدیریت کیفیت و ریسک مهندسی", purposeInGermany: "تدوین FMEAهای استاندارد VDA/AIAG جهت پیشگیری از خطاهای ساخت", expectedProficiency: "آشنایی کاربردی (Working Knowledge)", popularity: "۷۰٪ تامین‌کنندگان Tier-1" }
        ],
        deliverablesAndReports: [
          { reportTitle: "گزارش تحلیل حالات و اثرات خطا (FMEA Formblatt nach VDA)", formatAndTool: "خروجی استاندارد نرم‌افزار APIS IQ یا فرمت اکسل رسمی", frequency: "در هر پروژه توسعه محصول جدید (NPD)", recipient: "مدیر تضمین کیفیت و سرممیز شرکت", description: "شناسایی ریسک‌های ایمنی و عملکردی، عدد اولویت ریسک (RPN / Action Priority) و تعیین اقدامات اصلاحی." },
          { reportTitle: "گزارش شبیه‌سازی و محاسبات المان محدود (FEA-Berechnungsbericht)", formatAndTool: "سند جامع PDF با نمودارهای کانتور تنش فون میزس و ضرایب ایمنی", frequency: "پیش از ساخت نمونه اولیه فیزیکی", recipient: "سرمهندس محاسبات و مراجع نظارتی (TÜV/DEKRA)", description: "تشریح شرایط مرزی، مش‌بندی، نتایج همگرایی و تاییدیه مقاومت خستگی قطعه تحت بارهای کاری." },
          { reportTitle: "دستور تغییرات مهندسی (Engineering Change Request/Order - ECR/ECO)", formatAndTool: "فرم الکترونیکی در سیستم Teamcenter / SAP", frequency: "در صورت اعمال هرگونه اصلاحیه بر روی نقشه‌ها", recipient: "دپارتمان تولید، خرید و مونتاژ", description: "توضیح چرایی تغییر ابعاد یا متریال، اثرات آن بر قطعات متصل و تاریخ نهایی اجرایی شدن در خط." },
          { reportTitle: "گزارش حل ریشه‌ای خطاهای صنعتی (8D-Report)", formatAndTool: "فرمت استاندارد خودروسازی آلمان (VDA 8D)", frequency: "در صورت بروز نقص کیفی یا خرابی در آزمون‌ها", recipient: "مدیریت کارخانه و مشتری صنعتی", description: "گزارش ۸ مرحله‌ای شامل تشکیل تیم، توصیف نقص، مهار موقت، تعیین علت ریشه‌ای و اقدامات پیشگیرانه." }
        ]
      },

      germanPeerBenchmark: {
        peerProfileSummary: "همتای آلمانی شما معمولاً فارغ‌التحصیل رشته Maschinenbau یا Elektrotechnik با مدارک Diplom-Ingenieur یا Master of Science از دانشگاه‌های فنی آلمان است، یا مدرک مهندسی کاربردی از Fachhochschule دارد. او از دوران کارآموزی‌های صنعتی اجباری (Praxissemester) و کار دانشجویی (Werkstudent) در خطوط تولید بوش، زیمنس یا قطعه‌سازان Mittelstand با فرآیندهای ساخت و استانداردهای DIN مانوس شده است.",
        softwareAndTechProficiency: [
          "تسلط عمیق بر نرم‌افزارهای CAD صنعتی با متدولوژی‌های مدلسازی استاندارد سطوح و احجام",
          "کار بی‌نقص با سامانه‌های مدیریت پایگاه داده مهندسی (Teamcenter/SAP ECTR)",
          "تسلط بر کدهای برنامه‌نویسی اتوماسیون محاسباتی نظیر MATLAB / Simulink یا Python در تحلیل داده‌های سنسورها"
        ],
        standardsAndNormsMastery: [
          { standardName: "استانداردهای تلرانس‌گذاری هندسی و ابعادی (DIN ISO 2768 & ISO 1101)", description: "تعیین دقیق انحرافات مجاز هندسی، تختی، عمود بودن، موقعیت و استوانه‌ای بودن سطوح در نقشه‌کشی.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "دستورالعمل ایمنی ماشین‌آلات اروپا (Maschinenrichtlinie 2006/42/EG)", description: "الزامات قانونی طراحی ایمن، حفاظت از اپراتور و الزامات اجباری اخذ نشان CE در آلمان.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "استاندارد مدیریت کیفیت صنایع خودرو (IATF 16949 & VDA 6.3)", description: "فرآیندهای ممیزی، آدیت خط تولید و تضمین کیفیت زنجیره تامین قطعات صنعتی.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "راهنماهای مهندسی انجمن مهندسان آلمان (VDI-Richtlinien)", description: "اصول استاندارد طراحی سیستماتیک محصولات (مانند VDI 2221 و VDI 2230 برای اتصالات پیچ و مهره).", importanceLevel: "بسیار مهم (High)" }
        ],
        accumulatedExperienceAndTacitKnowledge: [
          "درک شهودی رفتار فلزات و پلیمرها در فرآیندهای ماشین‌کاری، فورج، دایکست و تزریق پلاستیک آلمان",
          "طراحی محافظه‌کارانه و مبتنی بر طول عمر بالا (Over-Engineering / Robust Design) بدون ریسک‌پذیری ناسنجیده",
          "مکاتبات فنی بسیار ساختاریافته و ثبت دقیق تغییرات در دفاتر روزانه مهندسی",
          "آشنایی با الزامات زیست‌محیطی بازیافت و مواد ممنوعه در اتحادیه اروپا (RoHS & REACH)"
        ],
        specializedKnowledgeAreas: [
          { domain: "طراحی مکانیکی و تلرانس‌گذاری", coreCompetencies: ["Parametric CAD (NX/CATIA)", "GD&T nach DIN ISO 1101", "Tolerance Stack-up Analysis", "Design for Manufacturing (DFM)"] },
          { domain: "محاسبات و شبیه‌سازی مهندسی", coreCompetencies: ["FEA Structural Analysis (ANSYS)", "Fatigue Life Calculation (FKM)", "Fastener Design (VDI 2230)", "Topology Optimization"] },
          { domain: "کیفیت صنعتی و استانداردها", coreCompetencies: ["FMEA nach VDA/AIAG", "CE-Kennzeichnung / ISO 12100", "8D Problem Solving", "PPAP / VDA Band 2"] },
          { domain: "مدیریت چرخه عمر و فرآیندهای PLM", coreCompetencies: ["Teamcenter Workflow", "BOM Management", "Engineering Change Management", "ERP/SAP Integration"] }
        ]
      },

      comparisonTable: [
        {
          dimension: "استانداردها، کدهای فنی و تلرانس‌ها (DIN / ISO)",
          iranReality: "استفاده تجربی از ابعاد استاندارد؛ تغییر تلرانس‌ها بر اساس قطعات موجود در بازار بدون تاییدیه مدون.",
          germanyExpectation: "انطباق قطعی با استانداردهای DIN ISO 2768 و GD&T (DIN EN ISO 1101)؛ هر تلرانس باید مبنای محاسباتی داشته باشد.",
          germanPeerBenchmark: "اعمال سیستماتیک تلرانس‌های هندسی با محاسبات زنجیره انطباقات (Tolerance Stack-up) بدون خطای مونتاژ.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "تسلط بر استانداردهای DIN EN ISO 1101, DIN ISO 2768 و VDI 2230.",
          actionTip: "استانداردهای DIN مرتبط با رشته خود را مطالعه کرده و نقشه‌های نمونه خود را طبق آن به‌روز کنید."
        },
        {
          dimension: "رویکرد به ایمنی و الزامات قانونی (CE / Machinery Directive)",
          iranReality: "نصب حفاظ‌های ایمنی پس از ساخت اولیه؛ تکیه بر آموزش کارگران به جای طراحی ایمن در مبدا.",
          germanyExpectation: "طراحی ذاتا ایمن (Inherent Safety)، محاسبات ضریب اطمینان و ارزیابی ریسک طبق ISO 12100 برای اخذ نشان CE.",
          germanPeerBenchmark: "تکمیل پرونده ارزیابی ریسک پیش از ارسال نقشه به کارگاه و رعایت دستورالعمل‌های ایمنی ماشین‌آلات اتحادیه اروپا.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "آشنایی با استاندارد DIN EN ISO 12100 و نرم‌افزار ارزیابی ایمنی Safexpert.",
          actionTip: "با اصول ارزیابی ریسک (Risikobeurteilung) و استانداردهای ایمنی ماشین‌آلات اروپا آشنا شوید."
        },
        {
          dimension: "مدیریت کیفیت و متدولوژی‌های پیشگیرانه (FMEA / APQP)",
          iranReality: "کنترل کیفیت در انتهای خط تولید (واکنشی) و بازگرداندن قطعات معیوب.",
          germanyExpectation: "تحلیل حالات و اثرات شکست (FMEA) قبل از ساخت، طراحی آزمایش‌ها (DoE) و پایش مداوم فرآیند (SPC).",
          germanPeerBenchmark: "مشارکت فعال در جلسات FMEA و پیاده‌سازی الزامات صفر-خطا بر پایه راهنماهای VDA/AIAG.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "کار با نرم‌افزارهای APIS IQ-FMEA و تسلط به استانداردهای IATF 16949.",
          actionTip: "مفاهیم FMEA و Six Sigma را در سوابق کاری و پروژه‌های رزومه خود پررنگ کنید."
        },
        {
          dimension: "نرم‌افزارهای یکپارچه و مدیریت چرخه عمر (PLM / CAD)",
          iranReality: "مدل‌سازی مستقل در SolidWorks یا AutoCAD؛ ذخیره فایل‌ها در پوشه‌های شخصی شبکه.",
          germanyExpectation: "کار در سامانه‌های یکپارچه مدیریت داده مهندسی (مانند Siemens Teamcenter, CATIA PLM, SAP ECTR) با فرآیند رسمی Release.",
          germanPeerBenchmark: "رعایت گردش‌کار رسمی تایید نقشه‌ها (Approval Workflow) و مدیریت ساختار درخت محصول در PLM.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "تسلط بر فرآیندهای PLM در Teamcenter یا SAP ECTR.",
          actionTip: "آشنایی خود با سامانه‌های PLM و PDM را در مصاحبه‌های فنی نشان دهید."
        },
        {
          dimension: "مستندسازی محاسبات و گزارش‌های فنی (Berechnungsberichte)",
          iranReality: "محاسبات سرانگشتی در اکسل یا یادداشت‌های غیررسمی بدون بایگانی ساختاریافته.",
          germanyExpectation: "تهیه گزارش‌های رسمی محاسباتی با نرم‌افزارهای شبیه‌سازی (ANSYS, Abaqus)، ارزیابی تنش و تاییدیه با مهر مهندسی.",
          germanPeerBenchmark: "تدوین گزارش‌های محاسباتی تحلیلی مدون منطبق بر استانداردهای FKM-Richtlinie جهت بایگانی قانونی.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "کار با ANSYS, Abaqus, Mathcad و FKM-Guideline.",
          actionTip: "نمونه گزارش محاسبات تحلیلی شبیه‌سازی FEA/CFD را در پورتفولیوی فنی خود بگنجانید."
        },
        {
          dimension: "فرهنگ کارگاه و ارتباط با تکنسین‌ها (Werkstattkultur)",
          iranReality: "دستورات شفاهی در محیط کارگاهی به تکنسین‌ها و کارگران بدون صورت‌جلسه کتبی.",
          germanyExpectation: "ارائه نقشه‌های نهایی مدون، رعایت اصول ارگونومی، ایمنی شغلی (Arbeitssicherheit) و تعامل با احترام متقابل.",
          germanPeerBenchmark: "تعامل حرفه‌ای با تکنسین‌های آموزش‌دیده (Meister / Facharbeiter) بر پایه نقشه‌های نهایی و احترام صنفی.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "اصطلاحات آلمانی فرآیندهای تولیدی و مقررات انجمن صنفی کارفرمایی (BG).",
          actionTip: "اصطلاحات آلمانی قطعات، ابزارها و فرآیندهای تولیدی را یاد بگیرید."
        }
      ],
      seniorityBreakdown: {
        junior: {
          title: "Junior Entwicklungsingenieur (مهندس طراح و محاسب ورودی / ۱-۲ سال)",
          germanDuties: [
            "مدل‌سازی سه‌بعدی قطعات و مجموعه‌ها در CAD (Siemens NX, SolidWorks, CATIA)",
            "تهیه نقشه‌های دوبعدی تولیدی طبق تلرانس‌های استاندارد DIN EN ISO",
            "انجام محاسبات اولیه تنش، مقاومت مصالح و انتخاب مواد مناسب",
            "کمک به آماده‌سازی نمونه‌های اولیه (Prototyping) و تست‌های آزمایشگاهی"
          ],
          employerExpectations: [
            "تسلط خوب بر ابزارهای CAD و توانایی خواندن نقشه‌های پیچیده صنعتی",
            "دقت نظر بالا در جزئیات ابعادی و پرهیز از بی‌دقتی در تلرانس‌گذاری",
            "انگیزه بالا برای یادگیری فرآیندهای تولیدی کارخانه"
          ],
          keyChallenge: "انطباق با تلرانس‌های سخت‌گیرانه هندسی (GD&T) طبق استانداردهای آلمان."
        },
        mid: {
          title: "Berechnungs- / Projektingenieur (مهندس محاسب و پروژه / ۳-۵ سال)",
          germanDuties: [
            "شبیه‌سازی‌های المان محدود غیرخطی (FEA / CFD) در نرم‌افزارهای ANSYS یا Abaqus",
            "بهینه‌سازی توپولوژی و وزن قطعات صنعتی با حفظ استحکام مکانیکی",
            "هدایت جلسات FMEA و ارزیابی ریسک با تیم‌های تولید و کیفیت",
            "هماهنگی با تامین‌کنندگان خارجی قطعات و ارزیابی نمونه‌های دریافتی"
          ],
          employerExpectations: [
            "قابلیت استخراج نتایج شبیه‌سازی و تبدیل آن به پیشنهادات ملموس طراحی",
            "استقلال در حل مسائل ارتعاشاتی، انتقال حرارت یا خستگی مواد",
            "ارائه گزارش‌های فنی تمیز و ساختاریافته به مدیریت فنی"
          ],
          keyChallenge: "اعتبارسنجی محاسبات تئوری با نتایج تست‌های تجربی مطابق با الزامات VDI."
        },
        senior: {
          title: "Senior Entwicklungsingenieur / System Engineer (ارشد مهندسی / +۵ سال)",
          germanDuties: [
            "رهبری فنی پروژه‌های توسعه محصولات جدید (NPD) از ایده تا تولید انبوه",
            "طراحی سیستم‌های پیچیده مکاترونیکی و هماهنگی مکانیک، الکترونیک و نرم‌افزار",
            "تضمین انطباق کامل محصول با استانداردهای اتحادیه اروپا و ممیزی‌های TÜV",
            "مدیریت زنجیره تامین فنی و مذاکره با شرکای تجاری بین‌المللی"
          ],
          employerExpectations: [
            "تسلط عمیق بر استانداردهای ایمنی عملکردی (Functional Safety - ISO 26262 / ISO 13849)",
            "توانایی حل بحران‌های فنی خط تولید با متدولوژی‌های 8D Report و Root Cause Analysis",
            "انتقال تجربیات و هدایت مهندسان جوان‌تر تیم"
          ],
          keyChallenge: "رهبری فنی در چارچوب فرهنگ مهندسی آلمان و تسلط بر آلمانی تجاری."
        },
        lead: {
          title: "Technischer Leiter / Head of Engineering (مدیر فنی و مهندسی دپارتمان)",
          germanDuties: [
            "برنامه‌ریزی استراتژیک سبد محصولات و تخصیص بودجه‌های تحقیق و توسعه (R&D)",
            "مدیریت سرمایه‌گذاری ماشین‌آلات پیشرفته و پیاده‌سازی Industry 4.0",
            "مسئولیت نهایی ایمنی محصول و پاسخگویی به مراجع قانونی و بازرسی فدرال",
            "توسعه شایستگی‌های مهندسی پرسنل و همکاری با دانشگاه‌ها و موسسات فرانهوفر"
          ],
          employerExpectations: [
            "ترکیب دیدگاه کلان اقتصادی با تسلط فنی بر فرآیندهای مهندسی مدرن",
            "رهبری استوار و قانون‌مدار منطبق بر الزامات صنفی مهندسان آلمان (VDI)",
            "توانایی حفظ مزیت رقابتی شرکت در بازارهای جهانی"
          ],
          keyChallenge: "مدیریت قراردادهای کلان صنعتی و آشنایی با حقوق تجاری مهندسی در آلمان."
        }
      },
      industryVariations: [
        {
          industryName: "خودروسازی و قطعه‌سازی پیشرفته (Automotive & Suppliers)",
          workplaceCulture: "فوق‌العاده سخت‌گیرانه، استاندارد IATF 16949، متدولوژی VDA 6.3، ممیزی‌های دوره‌ای و راندمان بالا.",
          expectedPace: "بسیار ساختاریافته، دقیق و مبتنی بر کیفیت صفر-خطا",
          languageRequirement: "آلمانی B2/C1 + انگلیسی فنی"
        },
        {
          industryName: "ماشین‌سازی و اتوماسیون صنعتی (Maschinen- & Anlagenbau)",
          workplaceCulture: "ستون فقرات اقتصاد آلمان (Mittelstand)، تولید سفارشی، دقت مکانیکی اعجاب‌انگیز و تعهد به ماندگاری محصول.",
          expectedPace: "مهندسی دقیق و فرآیندمحور",
          languageRequirement: "آلمانی B2 الزامی برای مکالمات کارخانه‌ای"
        },
        {
          industryName: "تجهیزات پزشکی و بیومدیکال (Medizintechnik)",
          workplaceCulture: "استاندارد ISO 13485، مقررات تجهیزات پزشکی اروپا (MDR)، مستندسازی بسیار حجیم و تست‌های بیوکامپتیبیلیتی.",
          expectedPace: "کند، وسواسی و صددرصد مستندمحور",
          languageRequirement: "آلمانی B2 + انگلیسی تخصصی"
        },
        {
          industryName: "انرژی‌های تجدیدپذیر و زیرساخت (Erneuerbare Energien & Bau)",
          workplaceCulture: "پروژه‌های کلان، انطباق با قوانین زیست‌محیطی فدرال، محاسبات طول عمر و هدایت در سایت‌های اجرایی.",
          expectedPace: "پروژه‌محور با ددلاین‌های قانونی",
          languageRequirement: "آلمانی B2/C1"
        }
      ],
      dailyRoutine: [
        { time: "۰۷:۳۰ - ۰۸:۰۰", activity: "ورود به شرکت و بررسی تیکت‌های مهندسی", description: "چک کردن لاگ‌های شبیه‌سازی شبانه و گزارش‌های تست نمونه‌های اولیه در آزمایشگاه." },
        { time: "۰۸:۱۵ - ۰۸:۴۵", activity: "جلسه روزانه تیم طراحی (Konstruktions-Meeting)", description: "بررسی وضعیت نقشه‌ها، گلوگاه‌های تامین قطعات و اولویت‌های کاری روز." },
        { time: "۰۹:۰۰ - ۱۲:۰۰", activity: "طراحی، شبیه‌سازی و محاسبات تخصصی (CAD & FEA)", description: "مدل‌سازی جزئیات در نرم‌افزار CAD، تحلیل المان محدود و کنترل تنش‌ها طبق DIN." },
        { time: "۱۲:۰۰ - ۱۳:۰۰", activity: "استراحت ناهار در کارخانه (Mittagspause)", description: "صرف ناهار و گپ و گفت خودمانی با همکاران بخش‌های تحقیق و توسعه و کارگاه." },
        { time: "۱۳:۰۰ - ۱۵:۰۰", activity: "بررسی کیفیت، جلسات FMEA و بازدید کارگاهی", description: "حضور در سالن تولید برای مشاهده مونتاژ نمونه اولیه، شرکت در جلسه FMEA و چک قطعات با کولیس و CMM." },
        { time: "۱۵:۰۰ - ۱۶:۳۰", activity: "مستندسازی و آزادسازی در PLM (Freigabe)", description: "ثبت نقشه‌ها در سیستم Teamcenter، تکمیل گزارش تغییرات فنی (ECO) و اتمام روز کاری (Feierabend)." }
      ],
      keyGermanPhrases: [
        { german: "DIN EN ISO Normen", persian: "استانداردهای ملی و اروپایی مهندسی", context: "مرجع اصلی طراحی، رواداری‌ها و آزمون‌های کیفیت در آلمان." },
        { german: "Maßhaltigkeit & Toleranzen", persian: "دقت ابعادی و انطباق تلرانس‌ها", context: "وسواس شدید کارفرمای آلمانی در دقت ساخت قطعات بدون لقی یا انحراف." },
        { german: "Qualitätsbewusstsein", persian: "آگاهی عمیق از اهمیت کیفیت و عدم نقص", context: "تعهد به تحویل خروجی با استاندارد صفر خطا (Zero-Defect Strategy)." },
        { german: "Fehlermöglichkeits- und -einflussanalyse (FMEA)", persian: "آنالیز حالات و اثرات خطا", context: "پیش‌بینی ریسک‌ها و خرابی‌های بالقوه قبل از ورود به خط تولید." },
        { german: "Arbeitssicherheit", persian: "ایمنی در محیط کار و کارگاه", context: "رعایت صددرصدی تجهیزات حفاظت فردی (PPE) و آیین‌نامه‌های BG." }
      ]
    };
  } else {
    // Business, Finance, Marketing, Operations, General
    return {
      summaryInsight: `در بازار کار مدیریت، بازرگانی، فروش و عملیات در ایران، موفقیت اغلب متکی بر روابط بین‌فردی قوی، چانه‌زنی‌های شفاهی، واکنش سریع به نوسانات لحظه‌ای بازار و تصمیم‌گیری‌های غیررسمی است.
اما در محیط‌های تجاری و سازمانی آلمان، همه چیز بر پایه «فرآیندهای مدون کسب‌وکار (BPMN / Standard Operating Procedures)»، «مستندسازی کتبی کلیه توافقات و جلسات (Protokolle)» و «تصمیم‌گیری‌های مبتنی بر ارقام و تحلیل داده‌ها (Data-Driven Reporting)» پیش می‌رود.
کارفرمای آلمانی از شما انتظار دارد وظایف را با رویکرد ساختاریافته، احترام به تقویم‌های کاری و وفاداری کامل به سیستم‌های ERP (مانند SAP) به انجام برسانید.`,
      
      jobDescriptionInGermany: {
        officialTitleDe: "Betriebswirt / Projektmanager / Sachbearbeiter (m/w/d)",
        kldbCode: "KldB 71104 (Betriebswirtschaft) / 71302 (Büro & Verwaltung)",
        generalScope: "هدایت، هماهنگی و پایش فرآیندهای مالی، بازرگانی، زنجیره تامین یا عملیاتی شرکت‌های آلمانی با تکیه بر تحلیل داده‌های ERP، انطباق با قوانین تجاری فدرال (HGB / GoBD) و مدیریت ساختاریافته جلسات و پروژه‌ها.",
        detailedTasksAndDuties: [
          {
            taskGroup: "مدیریت فرآیندهای کسب‌وکار و سیستم‌های سازمانی (ERP / SAP Operations)",
            description: "ثبت و کنترل دقیق تراکنش‌های تجاری، سفارش‌ها، پیش‌فاکتورها و قراردادها در سیستم یکپارچه شرکت.",
            subTasks: [
              "کار روزانه با ماژول‌های تخصصی SAP (مانند FI/CO, SD, MM) بدون ایجاد مغایرت داده‌ای",
              "بررسی و تطبیق اسناد مالی طبق استانداردهای حسابداری آلمان (HGB / GoBD)",
              "مدیریت چرخه سفارش تا تحویل و هماهنگی زنجیره تامین با شرکای تجاری"
            ]
          },
          {
            taskGroup: "تحلیل داده‌ها و گزارش‌های مدیریتی (Business Analytics & KPI Tracking)",
            description: "تبدیل داده‌های خام سازمانی به گزارش‌های تصویری تحلیلی برای اتخاذ تصمیمات استراتژیک.",
            subTasks: [
              "طراحی داشبوردهای مدیریتی بلادرنگ در Power BI یا Tableau بر اساس شاخص‌های کلیدی (KPIs)",
              "تهیه گزارش‌های پیش‌بینی سودآوری، هزینه‌ها و انحراف از بودجه مصوب (Soll-Ist-Vergleich)",
              "تحلیل بازار رقبا، کشش قیمت و ارائه سناریوهای بهینه‌سازی درآمد"
            ]
          },
          {
            taskGroup: "مدیریت جلسات و صورت‌جلسه‌های رسمی (Protokollführung & Governance)",
            description: "مستندسازی رسمی کلیه مصوبات و پیگیری وظایف محوله در پروژه‌های تیمی.",
            subTasks: [
              "تنظیم صورت‌جلسه‌های رسمی (Ergebnisprotokoll) به زبان آلمانی با تعیین مسئول و مهلت اقدام",
              "تهیه اسلایدهای پرزنتیشن حرفه‌ای برای جلسات هیئت‌مدیره منطبق بر گایدلاین برند سازمانی",
              "هماهنگی با وکلای تجاری و حسابرسان خارجی جهت اطمینان از انطباق با قوانین تجاری"
            ]
          },
          {
            taskGroup: "مکاتبات رسمی و ارتباط با مشتریان و تامین‌کنندگان (Business Communication)",
            description: "برقراری ارتباط تجاری بی‌نقص با لحن رسمی و احترام به آداب سازمانی آلمان.",
            subTasks: [
              "پاسخگویی دقیق و رسمی به استعلام‌های مشتریان به زبان آلمانی اداری (Siezen)",
              "مذاکره بر سر قیمت و شرایط قراردادهای بازرگانی با رعایت چارچوب‌های حقوقی",
              "مدیریت شکایات مشتریان (Reklamationsmanagement) با فرآیند استاندارد و بدون تاخیر"
            ]
          }
        ],
        employerExpectations: [
          "دقت بی‌نهایت بالا در ثبت اعداد و ارقام مالی و پرهیز از اشتباهات اداری",
          "وقت‌شناسی مطلق در جلسات، پاسخگویی به‌موقع به مکاتبات و احترام به تقویم‌های کاری",
          "استدلال کاملاً منطقی و داده‌محور (Sachlichkeit) در جلسات بدون درگیر کردن احساسات",
          "رعایت کامل قوانین محرمانگی اسناد تجاری و آیین‌نامه‌های حریم داده‌ها (DSGVO)"
        ],
        softwareAndTools: [
          { name: "SAP S/4HANA (FI/CO/SD/MM)", category: "سیستم برنامه‌ریزی منابع سازمانی (ERP)", purposeInGermany: "ثبت کلیه عملیات مالی، فروش، انبارداری و زنجیره تامین شرکت‌های آلمانی", expectedProficiency: "تسلط کامل (Expert)", popularity: "۹۰٪ شرکت‌های بزرگ و Mittelstand آلمان" },
          { name: "Microsoft Power BI / Tableau", category: "هوش تجاری و تحلیل داده (BI)", purposeInGermany: "ساخت داشبوردهای تحلیلی درآمد، فروش، بودجه و مقایسه عملکرد شعب", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۸۵٪ سازمان‌های آلمانی" },
          { name: "Microsoft Excel (Advanced)", category: "مدل‌سازی مالی و فرمول‌نویسی", purposeInGermany: "تحلیل سناریو، جداول پیوت، XLOOKUP، ماکروهای VBA و مدل‌سازی بودجه", expectedProficiency: "تسلط کامل (Expert)", popularity: "۱۰۰٪ شرکت‌ها" },
          { name: "Salesforce / HubSpot CRM", category: "مدیریت ارتباط با مشتریان", purposeInGermany: "پیگیری لیدها، مدیریت پایپ‌لاین فروش و مستندسازی تعاملات تجاری", expectedProficiency: "حرفه‌ای (Advanced)", popularity: "۷۵٪ شرکت‌های مدرن" },
          { name: "Microsoft Outlook & MS Teams", category: "ارتباطات سازمانی و تقویم", purposeInGermany: "مدیریت قرارهای کاری، ارسال دعوت‌نامه‌های رسمی و مستندسازی صورت‌جلسات", expectedProficiency: "تسلط کامل (Expert)", popularity: "۹۵٪ شرکت‌ها" }
        ],
        deliverablesAndReports: [
          { reportTitle: "گزارش تطبیق بودجه و عملکرد (Soll-Ist-Vergleichsbericht)", formatAndTool: "داشبورد تحلیلی Power BI / مدل جامع اکسل", frequency: "ماهیانه / فصلی", recipient: "مدیر مالی (CFO) و مدیر دپارتمان", description: "مقایسه هزینه‌های واقعی با بودجه مصوب، شناسایی انحرافات مالی و ارائه راهکارهای تعدیل هزینه." },
          { reportTitle: "صورت‌جلسه رسمی تصمیم‌گیری (Ergebnisprotokoll)", formatAndTool: "سند ساختاریافته Word / PDF بر پایه استاندارد DIN 5008", frequency: "پس از پایان هر جلسه تصمیم‌گیری", recipient: "کلیه اعضای حاضر در جلسه و ذی‌نفعان", description: "ثبت فهرست تصمیمات، مصوبات، مسئول هر اقدام (Task Owner) و ددلاین نهایی تحویل." },
          { reportTitle: "طرح تجاری توجیهی و ارزیابی بازگشت سرمایه (Business Case & ROI)", formatAndTool: "پرزنتیشن مدیریتی و مدل سناریوی مالی", frequency: "پیش از تصویب هر سرمایه‌گذاری یا پروژه جدید", recipient: "هیئت‌مدیره و کمیته سرمایه‌گذاری", description: "تحلیل جریان نقدینگی، دوره بازگشت سرمایه (Payback Period)، ارزیابی ریسک‌های بازار و توصیه نهایی." },
          { reportTitle: "گزارش ممیزی انطباق فرآیندها (Process Compliance & Audit Log)", formatAndTool: "گزارش رسمی کنترل داخلی در SAP / Confluence", frequency: "شش‌ماهه / سالیانه", recipient: "کمیته حسابرسی و ممیزان قانونی", description: "ارزیابی انطباق فرآیندهای ثبت سفارش و اسناد مالی با الزامات قانون تجارت آلمان (HGB/GoBD)." }
        ]
      },

      germanPeerBenchmark: {
        peerProfileSummary: "همتای آلمانی شما معمولاً دارای مدرک کارشناسی یا کارشناسی ارشد در رشته Betriebswirtschaftslehre (BWL) یا Wirtschaftsingenieurwesen از دانشگاه‌ها و مدارس عالی کسب‌وکار آلمان است، یا دوره کارآموزی دوگانه بازرگانی (Kaufmann/-frau für Büromanagement / Groß- und Außenhandel) با مدرک اتاق بازرگانی و صنایع آلمان (IHK) را گذرانده است. او با ادبیات نگارش اداری آلمانی (DIN 5008) و چارچوب‌های مالیاتی کاملاً آشناست.",
        softwareAndTechProficiency: [
          "تسلط عمیق بر اکوسیستم سازمانی SAP و ماژول‌های کنترلینگ و فروش",
          "مهارت پیشرفته در اکسل، مدل‌سازی سناریوهای مالی و اتوماسیون گزارش‌ها در Power BI",
          "تسلط بر سامانه‌های مدیریت اسناد دیجیتال (DMS) منطبق با قوانین بایگانی قانونی آلمان"
        ],
        standardsAndNormsMastery: [
          { standardName: "استاندارد نگارش مکاتبات اداری آلمان (DIN 5008)", description: "قواعد دقیق ساختار، حاشیه‌بندی، تاریخ‌گذاری و نحوه قرارگیری المان‌ها در نامه‌ها و ایمیل‌های رسمی اداری.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "قانون تجارت و حسابداری فدرال آلمان (Handelsgesetzbuch - HGB)", description: "مقررات حاکم بر دفاتر تجاری، بستن حساب‌های مالی، استهلاک و مسئولیت‌های حقوقی تجار.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "اصول مدیریت و نگهداری اسناد الکترونیکی (GoBD)", description: "دستورالعمل اداره مالیات آلمان برای دستکاری‌ناپذیر بودن و قابلیت ردیابی کلیه فاکتورها و تراکنش‌های دیجیتال.", importanceLevel: "حیاتی (Mandatory)" },
          { standardName: "مدیریت فرآیندهای کسب‌وکار (BPMN 2.0)", description: "نمادگذاری استاندارد بین‌المللی برای مدلسازی و مستندسازی فرآیندهای عملیاتی شرکت.", importanceLevel: "بسیار مهم (High)" }
        ],
        accumulatedExperienceAndTacitKnowledge: [
          "رعایت دقیق لحن رسمی آلمانی (Sie-Form) و پرهیز از صمیمیت زودهنگام در ارتباطات تجاری",
          "فرهنگ آمادگی کامل برای جلسات کاری (Agendatreue) و حضور ۵ دقیقه پیش از شروع موعد",
          "درک جایگاه قانونی شورای کارکنان (Betriebsrat) در قراردادها و شرایط کاری شرکت",
          "توانایی هدایت مذاکرات تجاری بر پایه شواهد آماری و سناریوهای مالی مستند"
        ],
        specializedKnowledgeAreas: [
          { domain: "سیستم‌های یکپارچه و هوش تجاری", coreCompetencies: ["SAP S/4HANA Core Modules", "Power BI / Tableau Visuals", "Advanced Excel Modeling", "CRM Pipeline Management"] },
          { domain: "قوانین تجاری، مالیاتی و انطباق", coreCompetencies: ["HGB & GoBD Guidelines", "Umsatzsteuerrecht (USt)", "Contract Compliance", "DSGVO Data Privacy in Sales"] },
          { domain: "مدیریت پروژه و حاکمیت سازمانی", coreCompetencies: ["DIN 5008 Business Writing", "Agile & Waterfall PM", "Risk & Budget Management", "Process Modeling (BPMN)"] },
          { domain: "مذاکره و ارتباطات بین‌فرهنگی", coreCompetencies: ["German Business Etiquette", "Vendor Negotiation", "Stakeholder Presentation", "Conflict De-escalation"] }
        ]
      },

      comparisonTable: [
        {
          dimension: "رویکرد به ارتباطات تجاری و مذاکره",
          iranReality: "تاکید بر صمیمیت و ارتباط فردی، تعارفات مقدماتی طولانی و توافقات شفاهی.",
          germanyExpectation: "مستقیم، رسمی و شفاف (Sachliche Kommunikation)؛ تمرکز فوری بر روی حقایق و ثبت کتبی نتایج.",
          germanPeerBenchmark: "ارتباط کاملاً ساختاریافته، ورود سریع به دستور جلسه و ارسال صورت‌جلسه کتبی در همان روز.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "قواعد نگارش اداری طبق استاندارد DIN 5008 و ایمیل‌های ساختاریافته Outlook.",
          actionTip: "ایمیل‌ها و جلسات کاری خود را کوتاه، شفاف، بدون ابهام و با صورت‌جلسه کتبی (Meeting Minutes) مدیریت کنید."
        },
        {
          dimension: "مدیریت زمان و تعهد به برنامه‌ریزی (Pünktlichkeit)",
          iranReality: "انعطاف‌پذیری در تغییر زمان جلسات، تاخیرهای متداول ترافیکی و ددلاین‌های شناور.",
          germanyExpectation: "حضور دقیق در راس ساعت (۵ دقیقه قبل از جلسه)، احترام مطلق به ددلاین‌های پروژه و عدم تغییر برنامه در دقیقه ۹۰.",
          germanPeerBenchmark: "هماهنگی تقویم‌ها حداقل از چند روز قبل و حضور به‌موقع با آمادگی کامل روی دستور جلسه.",
          gapLevel: "بسیار بالا",
          softwareAndStandardsDelta: "مدیریت دقیق تقویم‌های Microsoft Outlook و ابزارهای زمان‌بندی Calendly/Doodle.",
          actionTip: "تقویم کاری دیجیتال (Outlook / Google Calendar) را به طور دقیق تنظیم و مدیریت کنید."
        },
        {
          dimension: "تصمیم‌گیری و تحلیل کسب‌وکار",
          iranReality: "تصمیم‌گیری بر اساس شهود مدیر یا روابط تجاری سنتی.",
          germanyExpectation: "ارائه تحلیل‌های سناریومحور با اکسل/BI، ارزیابی هزینه-فایده (Business Case) و مستندسازی سود و زیان (ROI).",
          germanPeerBenchmark: "طراحی مدل‌های داده‌ای دقیق و سناریوهای مالی جهت ارائه توجیه فنی و اقتصادی به مدیران ارشد.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "تسلط بر ابزارهای Power BI, Tableau و مدل‌سازی پیشرفته Excel.",
          actionTip: "مهارت‌های ساخت گزارش‌های تحلیلی و داشبوردهای داده را در رزومه خود تقویت کنید."
        },
        {
          dimension: "سلسله‌مراتب سازمانی و مدیریت تعارض",
          iranReality: "سلسله‌مراتب عمودی بسته و پرهیز از به چالش کشیدن نظرات مدیر ارشد.",
          germanyExpectation: "انتقادپذیری سازنده، بحث منطقی بر سر راهکارها با داده و پرهیز از شخصی‌سازی اختلافات کاری.",
          germanPeerBenchmark: "ارائه انتقاد سازنده در جلسات با استدلال‌های آماری و پایبندی به تصمیم نهایی تیم.",
          gapLevel: "متوسط",
          softwareAndStandardsDelta: "تکنیک‌های حل تعارض بر پایه ارتباط غیرخشونت‌آمیز و قوانین شورای کارگری.",
          actionTip: "بیاموزید چگونه با استدلال‌های منطقی و شواهد آماری، بازخورد حرفه‌ای ارائه دهید."
        },
        {
          dimension: "انطباق با فرآیندها و سیستم‌های سازمانی (ERP / SAP)",
          iranReality: "انجام بخشی از امور به صورت دستی در اکسل یا دور زدن فرآیندهای اداری برای تسریع امور.",
          germanyExpectation: "پایبندی ۱۰۰٪ به ثبت فرآیندها در نرم‌افزارهای یکپارچه (SAP, Salesforce) و رعایت چارچوب‌های حسابرسی.",
          germanPeerBenchmark: "ثبت بدون انحراف تمام مراحل سفارش، انبارداری و صدور فاکتور در SAP منطبق بر آیین‌نامه GoBD.",
          gapLevel: "بالا",
          softwareAndStandardsDelta: "کار تخصصی با ماژول‌های SAP S/4HANA و آیین‌نامه‌های ممیزی GoBD.",
          actionTip: "با ماژول‌های پایه SAP یا سیستم‌های CRM استاندارد آلمان آشنا شوید."
        }
      ],
      seniorityBreakdown: {
        junior: {
          title: "Junior Sachbearbeiter / Coordinator (کارشناس اداری و بازرگانی ورودی)",
          germanDuties: [
            "پاسخگویی به مکاتبات روزمره مشتریان و تامین‌کنندگان به زبان آلمانی رسمی",
            "ورود اطلاعات سفارش‌ها و فاکتورها در سیستم‌های ERP (مانند SAP)",
            "تهیه پیش‌نویس گزارش‌های آماری هفتگی و فایل‌های اکسل",
            "هماهنگی لجستیک جلسات و تنظیم صورت‌جلسه‌ها"
          ],
          employerExpectations: [
            "دقت بالا در اعداد و مستندات بدون خطای انسانی",
            "لحن نگارش بسیار مودبانه و رسمی در ایمیل‌ها (Siezen)",
            "وقت‌شناسی و انجام منظم کارهای روتین بدون نیاز به پیگیری مکرر"
          ],
          keyChallenge: "تسلط بر فرمول‌های نگارش مکاتبات اداری و اصطلاحات بازرگانی آلمان."
        },
        mid: {
          title: "Referent / Specialist (کارشناس ارشد تخصصی و مدیر پروژه / ۳-۵ سال)",
          germanDuties: [
            "تحلیل روند بازار، بهینه‌سازی فرآیندهای خرید یا فروش و مدیریت قراردادها",
            "ارائه گزارش‌های تحلیلی مدیریتی به همراه پیش‌بینی KPIها در Power BI",
            "هدایت پروژه‌های بین‌بخشی با دپارتمان‌های مالی، حقوقی و انبارداری",
            "مذاکره بر سر قیمت‌ها و شرایط تحویل با شرکای تجاری"
          ],
          employerExpectations: [
            "دیدگاه تحلیلی و توانایی حل چالش‌های عملیاتی به طور مستقل",
            "پایبندی به بودجه مصوب و مدیریت بهینه هزینه‌ها",
            "ارتباط موثر و متقاعدکننده در پرزنتیشن‌های سازمانی"
          ],
          keyChallenge: "آشنایی با قوانین تجارت آلمان (HGB) و مالیات بر ارزش افزوده (USt)."
        },
        senior: {
          title: "Senior Manager / Team Lead (مدیر تیم و ارشد استراتژی / +۵ سال)",
          germanDuties: [
            "رهبری تیم کارشناسان، تعیین اهداف فصلی (OKRs) و ارزیابی عملکرد کارکنان",
            "تدوین استراتژی‌های ورود به بازار و عقد قراردادهای کلان چند میلیون یورویی",
            "بهینه‌سازی مستمر فرآیندهای عملیاتی و کاهش هزینه‌های سربار",
            "ارائه گزارش‌های استراتژیک به مدیران عامل (C-Level)"
          ],
          employerExpectations: [
            "رهبری تیم با رعایت حقوق کارمندان و فرهنگ محیط کار فراگیر",
            "تفکر آینده‌نگر و ریسک‌سنجی در شرایط ناپایداری زنجیره تامین",
            "اعتبار و نفوذ حرفه‌ای در مذاکرات کلان تجاری"
          ],
          keyChallenge: "رهبری منابع انسانی آلمانی و هدایت جلسات با شورای کارگری (Betriebsrat)."
        },
        lead: {
          title: "Abteilungsleiter / Director of Operations (مدیر ارشد دپارتمان / معاونت)",
          germanDuties: [
            "تعیین استراتژی‌های کلان سازمانی و هدایت ساختار مالی و عملیاتی",
            "پاسخگویی مستقیم به هیئت‌مدیره در خصوص سودآوری و رشد سالانه",
            "مدیریت منابع انسانی کلان و تعامل با شورای کارگری (Betriebsrat)",
            "توسعه روابط تجاری بین‌المللی و مشارکت در ادغام‌ها و تملک‌ها"
          ],
          employerExpectations: [
            "رهبری کاریزماتیک توام با تصمیم‌گیری‌های مستند و داده‌محور",
            "حفظ انضباط مالی و انطباق صددرصدی با قوانین تجاری و مالیاتی آلمان",
            "ایجاد محیط کاری باانگیزه و ارتقای فرهنگ سازمانی نوآورانه"
          ],
          keyChallenge: "تسلط کامل بر روانشناسی محیط کار آلمانی و قوانین کارگری فدرال."
        }
      },
      industryVariations: [
        {
          industryName: "شرکت‌های تجاری و بازرگانی متوسط (Mittelstand Handelsunternehmen)",
          workplaceCulture: "روابط پایدار بلندمدت با مشتریان، تمرکز بر کیفیت خدمات، محافظه‌کاری مالی و تصمیم‌گیری ساختاریافته.",
          expectedPace: "باثبات و مشتری‌محور",
          languageRequirement: "آلمانی B2/C1 الزامی"
        },
        {
          industryName: "هولدینگ‌ها، بیمه‌ها و موسسات مالی (Financial Services & Konzern)",
          workplaceCulture: "محیط بسیار رسمی، ممیزی‌های سفت‌وسخت مالیاتی، رعایت استانداردهای BaFin و چرخه‌های گزارش‌دهی فصلی.",
          expectedPace: "رسمی، تحلیلی و داده‌محور",
          languageRequirement: "آلمانی C1 + انگلیسی مالی"
        },
        {
          industryName: "لجستیک، زنجیره تامین و تجارت الکترونیک (E-Commerce & Logistics)",
          workplaceCulture: "پویایی بالا، بهینه‌سازی ثانیه‌ای زمان تحویل، کار با سامانه‌های انبارداری پیشرفته و اتوماسیون.",
          expectedPace: "سریع، دقیق و KPIمحور",
          languageRequirement: "آلمانی B2 + انگلیسی روان"
        },
        {
          industryName: "شرکت‌های مشاوره مدیریت و خدمات سازمانی (Consultancies & Big 4)",
          workplaceCulture: "پروژه‌محور، ساعت‌های کاری پرفشار، پرزنتیشن‌های حرفه‌ای برای مدیران ارشد و سفرهای کاری.",
          expectedPace: "بسیار فشرده و نتیجه‌محور",
          languageRequirement: "آلمانی C1 و انگلیسی C1"
        }
      ],
      dailyRoutine: [
        { time: "۰۸:۳۰ - ۰۹:۰۰", activity: "ورود به دفتر و پایش کارتابل", description: "بررسی ایمیل‌های رسمی، تقویم کاری Outlook و چک کردن نوتیفیکیشن‌های سیستم ERP." },
        { time: "۰۹:۰۰ - ۱۰:۰۰", activity: "جلسه هماهنگی صبحگاهی دپارتمان (Team-Meeting)", description: "مرور پیشرفت پروژه‌ها، تخصیص اولویت‌های جدید و بررسی موانع با مدیر بخش." },
        { time: "۱۰:۰۰ - ۱۲:۳۰", activity: "تحلیل داده‌ها و گزارش‌گیری در SAP/BI", description: "استخراج گزارش‌های مالی یا فرآیندی، ساخت ویژوال‌های Power BI و تهیه گزارش تحلیلی." },
        { time: "۱۲:۳۰ - ۱۳:۳۰", activity: "استراحت ناهار و شبکه ارتباطی (Mittagspause)", description: "صرف ناهار با همکاران دپارتمان‌های دیگر جهت تقویت همکاری‌های بین‌بخشی." },
        { time: "۱۳:۳۰ - ۱۵:۳۰", activity: "جلسات با مشتریان یا تامین‌کنندگان (Meetings)", description: "مذاکره آنلاین یا حضوری، بررسی انطباق قراردادها و نوشتن صورت‌جلسه رسمی (Protokoll)." },
        { time: "۱۵:۳۰ - ۱۷:۰۰", activity: "مستندسازی فرآیندها و پایان کار (Feierabend)", description: "به‌روزرسانی راهنماها در Confluence، ارسال ایمیل‌های خلاصه و خروج سر موعد از دفتر." }
      ],
      keyGermanPhrases: [
        { german: "Schriftlichkeit", persian: "اصل مستندسازی و ثبت کتبی توافقات", context: "در آلمان هیچ توافق شفاهی تا زمانی که مکتوب نشده باشد اعتبار ندارد." },
        { german: "Pünktlichkeit & Zuverlässigkeit", persian: "وقت‌شناسی و اتکاپذیری حرفه‌ای", context: "حضور دقیق در جلسات و تحویل وظایف سر موعد مقرر نشانه احترام حرفه‌ای است." },
        { german: "Protokollführung", persian: "تنظیم و ثبت رسمی صورت‌جلسه", context: "ارسال خلاصه تصمیمات و تسک‌های هر جلسه برای همه حاضرین." },
        { german: "Compliance", persian: "انطباق با قوانین شرکتی و ملی", context: "رعایت بدون استثنای آیین‌نامه‌ها و قوانین مالیاتی و تجاری." },
        { german: "Feierabend", persian: "پایان ساعت اداری و تعطیلی روز", context: "تفکیک کامل زندگی شخصی از کار و عدم تماس کاری در شب‌ها." }
      ]
    };
  }
}
