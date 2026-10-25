import { InterviewQuestionItem, InterviewQuestionsResult, StarFrameworkItem } from "../types";
import { detectDomainFromContext, getDomainTechnicalQuestions, getInterviewerProfileForDomain, DomainQuestionOptions } from "./domainTechnicalQuestions";

export interface GenerateInterviewQuestionsParams {
  resumeText?: string;
  fileName?: string;
  targetField?: string;
  candidateName?: string;
  experienceLevel?: "junior" | "mid" | "senior" | "lead" | "all";
  yearsOfExperience?: number | string;
  softwareTools?: string[];
  certifications?: string[];
  practicalProjects?: string[];
  degree?: string;
}

/**
 * Extracts specific technologies, tools, and keywords from candidate resume text/inputs
 */
function extractResumeKeywords(text: string, contextDomain?: string): {
  techs: string[];
  companies: string[];
  hasCloud: boolean;
  hasDocker: boolean;
  hasDatabases: boolean;
  hasAgile: boolean;
  hasTesting: boolean;
  hasArchitecture: boolean;
  detectedRole: string;
  detectedRoleDe: string;
  detectedLevel: string;
} {
  const lower = text.toLowerCase();
  const techs: string[] = [];

  const allKnownTools = [
    // Software & Web & Cloud
    "react", "typescript", "javascript", "node.js", "node", "python", "java", "spring boot",
    "c#", ".net", "angular", "vue", "golang", "go", "php", "laravel", "django", "fastapi",
    "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "terraform", "ci/cd", "jenkins",
    "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "kafka",
    "rabbitmq", "graphql", "rest api", "microservices", "git", "linux", "scrum", "agile", "jira", "tdd", "unit test",
    // Civil Engineering
    "etabs", "sap2000", "safe", "tekla", "autocad", "eurocode", "revit structure", "plaxis", "abaqus",
    // Mechanical Engineering
    "solidworks", "catia", "ansys", "inventor", "matlab", "simulink", "cad", "cam", "cnc", "gd&t",
    // Electrical & Automation
    "plc", "eplan", "siemens", "tia portal", "altium", "scada", "labview", "vde",
    // Healthcare & Nursing
    "kis", "rki", "icu", "ccu", "pflege", "dialyse", "blutentnahme",
    // Finance & Accounting
    "datev", "sap fi", "sap co", "hgb", "ifrs", "controlling", "excel", "ustg",
    // Architecture
    "revit", "bim", "archicad", "3ds max", "rhino", "sketchup", "lumion",
    // Industrial & Project Management
    "six sigma", "lean", "kaizen", "supply chain", "erp", "wms", "spc", "iso 9001", "pmp", "prince2",
    // Data & AI
    "pytorch", "tensorflow", "pandas", "numpy", "sql", "spark", "hadoop", "mlops", "power bi", "tableau"
  ];

  allKnownTools.forEach(t => {
    if (lower.includes(t)) {
      techs.push(t.charAt(0).toUpperCase() + t.slice(1));
    }
  });

  // If no specific tools found, customize defaults based on domain instead of generic IT
  if (techs.length === 0) {
    if (contextDomain === "civil") {
      techs.push("AutoCAD", "ETABS", "Eurocodes (DIN EN)", "تحلیل سازه و محاسبات فنی");
    } else if (contextDomain === "mechanical") {
      techs.push("SolidWorks", "CATIA", "استاندارد DIN EN ISO", "طراحی و تحلیل تنش");
    } else if (contextDomain === "electrical") {
      techs.push("EPLAN Electric", "PLC Siemens", "استانداردهای DIN VDE", "اتوماسیون صنعتی");
    } else if (contextDomain === "healthcare") {
      techs.push("مراقبت‌های بالینی", "سامانه اطلاعات بیمارستانی (KIS)", "دستورالعمل‌های RKI", "مستندسازی بالینی");
    } else if (contextDomain === "finance_accounting") {
      techs.push("DATEV", "SAP FI/CO", "استانداردهای حسابداری آلمان (HGB)", "کنترلینگ مالی");
    } else if (contextDomain === "architecture") {
      techs.push("Autodesk Revit", "مدلسازی BIM", "طراحی فاز دو اجرایی", "ArchiCAD");
    } else if (contextDomain === "industrial_management") {
      techs.push("Lean Manufacturing", "مدیریت زنجیره تامین (Supply Chain)", "Six Sigma", "بهینه‌سازی فرآیند");
    } else if (contextDomain === "data_ai") {
      techs.push("Python", "SQL", "مدل‌های یادگیری ماشین", "خطوط پردازش داده (Data Pipelines)");
    } else {
      techs.push("تحلیل فنی و مهندسی", "مستندسازی استاندارد", "روش‌های حل مسئله مهندسی");
    }
  }

  // Determine domain
  let detectedRole = "متخصص و توسعه‌دهنده نرم‌افزار و سامانه‌های تحت وب";
  let detectedRoleDe = "Softwareentwickler / IT-Fachkraft";
  if (lower.includes("مکانیک") || lower.includes("mechanical") || lower.includes("catia") || lower.includes("solidworks")) {
    detectedRole = "مهندس مکانیک و طراح صنعتی";
    detectedRoleDe = "Maschinenbauingenieur / Konstrukteur";
  } else if (lower.includes("عمران") || lower.includes("سازه") || lower.includes("civil") || lower.includes("etabs")) {
    detectedRole = "مهندس عمران، محاسب سازه و نظارت بر اجرا";
    detectedRoleDe = "Bauingenieur / Tragwerksplaner";
  } else if (lower.includes("برق") || lower.includes("الکترونیک") || lower.includes("electrical") || lower.includes("eplan") || lower.includes("plc")) {
    detectedRole = "مهندس برق، کنترل و اتوماسیون صنعتی";
    detectedRoleDe = "Elektroingenieur / Automatisierungstechniker";
  } else if (lower.includes("پرستار") || lower.includes("پزشک") || lower.includes("درمان") || lower.includes("بیمارستان") || lower.includes("nurse")) {
    detectedRole = "متخصص کادر درمان و خدمات بالینی";
    detectedRoleDe = "Gesundheits- und Krankenpfleger / Medizinisches Fachpersonal";
  } else if (lower.includes("حسابدار") || lower.includes("مالی") || lower.includes("finance") || lower.includes("accounting") || lower.includes("datev")) {
    detectedRole = "کارشناس حسابداری و مدیریت مالی";
    detectedRoleDe = "Finanzbuchhalter / Controller";
  } else if (lower.includes("معمار") || lower.includes("architecture") || lower.includes("revit") || lower.includes("bim")) {
    detectedRole = "مهندس معماری و مدلسازی BIM";
    detectedRoleDe = "Architekt / BIM-Konstrukteur";
  } else if (lower.includes("صنایع") || lower.includes("industrial") || lower.includes("supply chain") || lower.includes("kaizen")) {
    detectedRole = "مهندس صنایع و بهینه‌سازی فرآیندها";
    detectedRoleDe = "Wirtschaftsingenieur / Prozessmanager";
  } else if (lower.includes("داده") || lower.includes("data") || lower.includes("machine learning") || lower.includes("هوش مصنوعی") || lower.includes("ai")) {
    detectedRole = "متخصص علوم داده و مهندسی هوش مصنوعی";
    detectedRoleDe = "Data Scientist / AI Engineer";
  }

  // Seniority
  let detectedLevel = "Mid-level";
  if (lower.includes("لید") || lower.includes("lead") || lower.includes("ارشد") || lower.includes("مدیر") || lower.includes("senior") || lower.includes("معمار") || lower.includes("architect")) {
    detectedLevel = "Senior / Lead";
  } else if (lower.includes("junior") || lower.includes("مبتدی") || lower.includes("کارآموز") || lower.includes("دانشجو") || lower.includes("تازه")) {
    detectedLevel = "Junior";
  }

  return {
    techs,
    companies: [],
    hasCloud: lower.includes("aws") || lower.includes("azure") || lower.includes("gcp") || lower.includes("cloud") || lower.includes("ابری"),
    hasDocker: lower.includes("docker") || lower.includes("kubernetes") || lower.includes("container") || lower.includes("k8s"),
    hasDatabases: lower.includes("sql") || lower.includes("postgres") || lower.includes("mongo") || lower.includes("database") || lower.includes("دیتابیس"),
    hasAgile: lower.includes("scrum") || lower.includes("agile") || lower.includes("اسکرام") || lower.includes("چابک") || lower.includes("jira"),
    hasTesting: lower.includes("test") || lower.includes("tdd") || lower.includes("تست") || lower.includes("jest") || lower.includes("junit"),
    hasArchitecture: lower.includes("architecture") || lower.includes("معماری") || lower.includes("microservices") || lower.includes("میکروسرویس") || lower.includes("scale"),
    detectedRole,
    detectedRoleDe,
    detectedLevel
  };
}

/**
 * Real-world questions data bank grounded in authentic German recruitment experiences
 * collected from LinkedIn, Kununu, Glassdoor, and hiring managers in Mittelstand & DAX 40.
 * Guarantees at least 20 General and at least 20 Technical questions (Total 42 questions).
 */
export function generateRuleBasedEmployerInterviewQuestions(
  params: GenerateInterviewQuestionsParams
): InterviewQuestionsResult {
  const text = (params.resumeText || "").trim();
  const candidateName = (params.candidateName || "").trim() || "متقاضی محترم";
  const targetField = (params.targetField || "").trim();

  const domainInfo = detectDomainFromContext(text + " " + targetField, params.fileName);
  const kw = extractResumeKeywords(text + " " + targetField, domainInfo.domain);

  // Merge explicitly provided software tools, certifications, and years of experience
  const softwareTools = (params.softwareTools && params.softwareTools.length > 0)
    ? Array.from(new Set([...params.softwareTools, ...kw.techs]))
    : kw.techs;
  const primaryTech = softwareTools[0] || (domainInfo.domain !== "software_it" ? domainInfo.domainTitleFa : "تکنولوژی‌های پایه");
  const secondaryTech = softwareTools[1] || "ابزارهای مدرن مهندسی";
  const thirdTech = softwareTools[2] || "فریم‌ورک‌های استاندارد";
  const techListStr = softwareTools.slice(0, 4).join("، ");

  const yearsExp = params.yearsOfExperience || "";
  const certifications = params.certifications || [];
  const practicalProjects = params.practicalProjects || [];

  // -------------------------------------------------------------
  // PART 1: GENERAL & CULTURAL FIT (حداقل ۲۰ سوال عمومی و بین‌فرهنگی)
  // -------------------------------------------------------------
  const generalQuestions: InterviewQuestionItem[] = [
    {
      id: "gen-01",
      category: "general",
      categoryLabelFa: "عمومی و انگیزش سازمانی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: `با توجه به اینکه در رزومه خود سابقه کار با ${primaryTech} را دارید، چرا تصمیم گرفته‌اید از کشور مبدا به آلمان مهاجرت کنید و مشخصاً چرا شرکت ما در این ایالت را برای ادامه فعالیت حرفه‌ای خود برگزیدید؟`,
      questionDeEn: "Warum möchten Sie nach Deutschland auswandern und warum haben Sie sich gezielt für unser Unternehmen an diesem Standort entschieden?",
      recruiterObjective: "شرکت‌های Mittelstand آلمان در شهرهای متوسط به شدت نگران هزینه‌های ویزا و رلوکیشن و ترک زودهنگام توسط نیروهای خارجی هستند. مصاحبه‌کننده می‌خواهد اطمینان یابد که شما شناخت واقعی از محل شرکت، بازار تخصصی آن و پایداری زندگی در آلمان دارید و شرکت صرفاً یک سکوی پرتاب کوتاه‌مدت نیست.",
      evaluationFocus: "بررسی تحقیقات داوطلب درباره محصولات تخصصی شرکت (Hidden Champion)، شناخت موقعیت جغرافیایی و ثبات تصمیم بلندمدت خانواده در آلمان.",
      recommendedAnswerStrategy: "با متد STAR توضیح دهید که چگونه تخصص شما در شرکت‌های قبلی با خط تولید یا محصولات این شرکت هماهنگ است. به جای کلی‌گویی، به تاریخچه شرکت و برنامه یادگیری زبان آلمانی اشاره نمایید.",
      redFlags: "بیان پاسخ‌های صرفاً مالی (حقوق یورویی)، عدم آگاهی از شهر محل کارخانه یا بی‌تفاوتی به یادگیری زبان آلمانی.",
      realWorldSource: "تجربیات مصاحبه ثبت‌شده در لینکدین کارفرمایان ایالت بادن-وورتمبرگ و باواریا."
    },
    {
      id: "gen-02",
      category: "general",
      categoryLabelFa: "عمومی و فرهنگ ارتباطی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "فرهنگ بازخورد مستقیم آلمانی (Direkte Feedbackkultur / Sachlichkeit) گاهی ممکن است برای کارجویان بین‌المللی تند یا خشک به نظر برسد. در سوابق گذشته چگونه با انتقاد صریح همکاران یا مدیر فنی از کار خود مواجه شدید؟",
      questionDeEn: "Wie gehen Sie mit der deutschen Feedbackkultur und sachlicher, direkter Kritik um? Haben Sie ein konkretes Beispiel?",
      recruiterObjective: "تفکیک مسائل شخصی از نقد فنی و حرفه‌ای (Sachlichkeit) در محیط‌های کاری آلمان یک اصل بنیادین است. کارفرما می‌خواهد مطمئن شود شما نقد روی کد یا فرآیند کار را خصومت شخصی برداشت نکرده و با رویکرد بهینه‌سازی فنی پاسخ می‌دهید.",
      evaluationFocus: "پختگی روانی، هوش هیجانی، ظرفیت شنیدن انتقاد بدون موضع تدافعی، و تمرکز بر راه‌حل فنی مشترک.",
      recommendedAnswerStrategy: "یک موقعیت واقعی را شرح دهید که بازخوردی صریح درباره باگ یا ایراد طراحی دریافت کردید؛ توضیح دهید چطور بازخورد را آنالیز کردید و فرآیند را برای جلوگیری از تکرار اصلاح نمودید.",
      redFlags: "متهم کردن دیگران، توجیه هیجانی خطاها یا گفتن این که 'من معمولاً خطایی در کارهایم ندارم'.",
      realWorldSource: "گزارش‌های مصاحبه فرهنگی در شرکت‌های SAP, Siemens و BMW در سایت Kununu."
    },
    {
      id: "gen-03",
      category: "general",
      categoryLabelFa: "عمومی و پایبندی به تعهدات",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "وقت‌شناسی و انضباط در تعهدات زمانی (Pünktlichkeit & Zuverlässigkeit) ستون اصلی شرکت‌های آلمانی است. اگر متوجه شوید به دلیل پیچیدگی فنی نمی‌توانید تسکی را در ددلاین تحویل دهید، دقیقاً چه اقدامی می‌کنید؟",
      questionDeEn: "Wie gehen Sie mit drohenden Terminverzögerungen um und wie kommunizieren Sie Deadlines proaktiv im Team?",
      recruiterObjective: "در فرهنگ آلمان تاخیر بدون اطلاع قبلی بدترین نوع رفتار حرفه‌ای است. کارفرما می‌خواهد بداند آیا شما از روزها قبل با شفافیت هشدار می‌دهید و راه‌حل جایگزین ارائه می‌کنید یا ددلاین را رد کرده و بعد بهانه می‌آورید.",
      evaluationFocus: "ارتباطات پیش‌دستانه (Proactive Communication)، مدیریت ریسک و قابلیت اعتماد بالا در پیش‌بینی زمان تحویل وظایف.",
      recommendedAnswerStrategy: "تاکید کنید که به محض شناسایی تاخیر احتمالی، با مستندات فنی و ارائه ۳ سناریو (کاهش اسکوپ، کمک گرفتن، یا تعویق تاریخ) با مدیر و تیم جلسه می‌گذارید.",
      redFlags: "سکوت تا روز ددلاین، مقصر دانستن دیگران، یا کار شبانه‌روزی بدون اطلاع دادن به تیم که کیفیت محصول را تخریب کند.",
      realWorldSource: "مصاحبه‌های HR در هلدینگ Bosch و استانداردهای موسسه منابع انسانی آلمان (DGFP)."
    },
    {
      id: "gen-04",
      category: "general",
      categoryLabelFa: "عمومی و یادگیری زبان",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "حتی اگر زبان کاری روزمره تیم انگلیسی باشد، مراودات عمومی شرکت، مستندات رسمی و گفتگوهای بین‌فردی به آلمانی است. برنامه دقیق و هفتگی شما برای ارتقای زبان آلمانی چیست؟",
      questionDeEn: "Wie sieht Ihr konkreter Plan zum Erlernen der deutschen Sprache im Arbeits- und Alltagsleben aus?",
      recruiterObjective: "کارفرمایان متوجه شده‌اند کارجویانی که آلمانی یاد نمی‌گیرند، پس از ۱ یا ۲ سال احساس انزوا کرده و شرکت را ترک می‌کنند. آن‌ها می‌خواهند انگیزه خودجوش شما برای ادغام در جامعه آلمان را ارزیابی کنند.",
      evaluationFocus: "داشتن برنامه منظم، گذراندن دوره‌های زبان و تعهد به رسیدن به سطح B1/B2 در یک سال اول اقامت.",
      recommendedAnswerStrategy: "ساعات مشخصی از هفته که به یادگیری اختصاص داده‌اید را ذکر کنید و بگویید مشتاقید جلسات صبحگاهی یا گفتگوهای قهوه را با آلمانی دست‌وپا شکسته شروع کنید تا روان‌تر شوید.",
      redFlags: "بی‌تفاوتی به زبان آلمانی با این استدلال که 'زبان برنامه‌نویسی یا مهندسی انگلیسی است و نیازی به آلمانی ندارم'.",
      realWorldSource: "نظرسنجی اتاق بازرگانی و صنایع آلمان (DIHK) درباره علل ناکامی استخدام‌های بین‌المللی."
    },
    {
      id: "gen-05",
      category: "general",
      categoryLabelFa: "عمومی و کار تیمی و چندفرهنگی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "شما با تیم‌هایی متنوع از ملیت‌ها، سبک‌های فکری و سنین مختلف در آلمان همکاری خواهید کرد. تجربه‌ای را شرح دهید که تفاوت فرهنگی یا کاری در تیم را با موفقیت هماهنگ کردید.",
      questionDeEn: "Erzählen Sie von einer Situation, in der Sie erfolgreich in einem multikulturellen oder generationenübergreifenden Team gearbeitet haben.",
      recruiterObjective: "ارزیابی انعطاف‌پذیری، احترام به حقوق فردی و اجتناب از کلیشه‌های نژادی یا فرهنگی در تیم‌های متکثر آلمان.",
      evaluationFocus: "فروتنی فرهنگی، مهارت گوش دادن فعال و توانایی ایجاد همگرایی حول هدف پروژه.",
      recommendedAnswerStrategy: "یک داستان واقعی از کار با افراد با پیشینه‌های کاری مختلف تعریف کنید که با برگزاری جلسات شفاف و تعیین قوانین بازی مشترک، تعارض حل شد.",
      redFlags: "بی‌صبری در برابر همکاران ناهمسو یا اصرار بر تحمیل شیوه شخصی خود به کل اعضای تیم.",
      realWorldSource: "پرسشنامه‌های شایستگی رفتاری در هلدینگ‌های بین‌المللی مستقر در فرانکفورت و مونیخ."
    },
    {
      id: "gen-06",
      category: "general",
      categoryLabelFa: "عمومی و شکاف سوابق شغلی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "در رزومه شما جابجایی بین شرکت‌ها یا فاصله زمانی میان دو موقعیت شغلی دیده می‌شود (Lücken im Lebenslauf). علت این انتقال‌ها چه بوده و چه دستاوردی در آن دوره داشتید؟",
      questionDeEn: "Können Sie die Übergänge oder zeitlichen Lücken in Ihrem Lebenslauf näher erläutern?",
      recruiterObjective: "در فرهنگ استخدام آلمان، رزومه باید خطی و بدون ابهام باشد. کارفرما می‌خواهد مطمئن شود فاصله‌ها ناشی از اخراج به علت بی‌کفایتی یا بی‌هدفی نبوده است.",
      evaluationFocus: "صداقت، عدم پنهان‌کاری، و استفاده مفید از فواصل کاری برای خودآموزی، پروژه‌های شخصی یا آمادگی مهاجرت.",
      recommendedAnswerStrategy: "با اعتماد به نفس و شفافیت توضیح دهید که فاصله زمانی صرف چه پروژه‌ها، یادگیری مهارت‌های جدید مانند ابزارهای ابری یا آمادگی حرفه‌ای شده است.",
      redFlags: "دروغگویی، تناقض در تاریخ‌های بیان‌شده، یا بدگویی افراطی از مدیران شرکت‌های قبلی.",
      realWorldSource: "راهنمای ارزیابی رزومه توسط کانون مشاوران شغلی آلمان (BDU)."
    },
    {
      id: "gen-07",
      category: "general",
      categoryLabelFa: "عمومی و تعادل کار و زندگی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "در آلمان قانون کار (Arbeitszeitgesetz) و استراحت پس از ساعات کاری جدی است. چگونه کارایی خود را در ساعات کاری رسمی مدیریت می‌کنید تا نیازی به اضافه‌کاری‌های بی‌رویه نباشد؟",
      questionDeEn: "Wie strukturieren Sie Ihren Arbeitstag, um eine hohe Produktivität innerhalb der vertraglichen Arbeitszeiten sicherzustellen?",
      recruiterObjective: "برخلاف برخی کشورها، در آلمان اضافه‌کاری مداوم نشانه فداکاری نیست بلکه نشانه ضعف در برنامه‌ریزی یا ناکارآمدی فرآیندهاست. کارفرما به دنبال استمرار پایدار (Sustainable Pace) است.",
      evaluationFocus: "اولویت‌بندی تسک‌ها (Eisenhower Matrix / Time-boxing)، مدیریت تمرکز و پرهیز از اتلاف وقت در طول روز کاری.",
      recommendedAnswerStrategy: "نحوه دسته‌بندی وظایف روزانه بر اساس فوریت و اهمیت، بلوک‌بندی زمان برای کار عمیق (Deep Work)، و گزارش‌دهی متناوب پیشرفت را تشریح کنید.",
      redFlags: "افتخار به بیدار ماندن تا صبح برای تحویل کارها، که در آلمان نشان‌دهنده ریسک بالای فرسودگی شغلی (Burnout) است.",
      realWorldSource: "استانداردهای اتحادیه‌های صنفی آلمان (IG Metall) و پژوهش‌های موسسه ایمنی کار فدرال (BAuA)."
    },
    {
      id: "gen-08",
      category: "general",
      categoryLabelFa: "عمومی و حل اختلاف نظر فنی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "زمانی را شرح دهید که با تصمیم معماری یا فرآیندی مدیر یا معمار ارشد موافق نبودید. چگونه دیدگاه خود را مطرح کردید و در نهایت چطور توافق حاصل شد؟",
      questionDeEn: "Beschreiben Sie eine Situation, in der Sie fachlich nicht mit der Entscheidung eines Vorgesetzten einverstanden waren. Wie haben Sie reagiert?",
      recruiterObjective: "سنجش قدرت استدلال مستند، پرهیز از لجبازی و توانایی 'مخالفت و سپس تعهد کامل' (Disagree and Commit) در صورت اتخاذ تصمیم نهایی توسط تیم.",
      evaluationFocus: "ارائه ادله عددی و تست‌شده به جای نظرات احساسی، احترام به سلسله‌مراتب مسئولیت، و تلاش برای پیشبرد موفق کل پروژه.",
      recommendedAnswerStrategy: "شرح دهید که داده‌ها، بنچمارک‌ها و سناریوهای ریسک را آماده و با احترام ارائه کردید؛ در نهایت نیز اگر تصمیم دیگری گرفته شد، با تمام توان در پیاده‌سازی آن مشارکت نمودید.",
      redFlags: "لجبازی، تمرد از اجرای تصمیم گروهی، یا خرابکاری پنهان در کار تیمی.",
      realWorldSource: "پرسش‌های استخدامی مدیریت تعارض در شرکتهای مهندسی زیمنس، بوش و کانتیننتال."
    },
    {
      id: "gen-09",
      category: "general",
      categoryLabelFa: "عمومی و فرآیند سازگاری اولیه",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "دوره آزمایشی در آلمان (Probezeit) معمولاً ۶ ماه است و کارفرما در این مدت عملکرد شما را به دقت زیر ذره‌بین دارد. برنامه ۳۰، ۶۰ و ۹۰ روز اول شما در شرکت چیست؟",
      questionDeEn: "Wie planen Sie Ihre ersten 30, 60 und 90 Tage während der Probezeit in unserem Unternehmen zu gestalten?",
      recruiterObjective: "بررسی استقلال فردی و خودگردانی (Self-management) داوطلب؛ کارفرمایان می‌خواهند بدانند چقدر سریع متقاضی می‌تواند بدون اتکا به آموزش‌های مداوم دیگران به سطح بهره‌وری برسد.",
      evaluationFocus: "شناخت بیزینس، مطالعه مستندات قبلی، شناسایی ذینفعان کلیدی و تلاش برای دستیابی به اولین تحویل زودهنگام (Quick Win).",
      recommendedAnswerStrategy: "۳۰ روز اول: آشنایی با کدها، ساختار محصول و متدها؛ ۶۰ روز اول: پذیرش مستقل وظایف و ارائه اولین بهینه‌سازی‌ها؛ ۹۰ روز اول: مشارکت فعال در تصمیم‌گیری‌های تیمی.",
      redFlags: "انتظار دریافت دستورالعمل‌های روزانه از مدیر، انفعال و منتظر هدایت مداوم دیگران ماندن.",
      realWorldSource: "راهنمای گذر موفق از دوره آزمایشی کاری در نشریه معتبر WirtschaftsWoche آلمان."
    },
    {
      id: "gen-10",
      category: "general",
      categoryLabelFa: "عمومی و مستندسازی کاری",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "در آلمان ثبت مکتوب و مستندسازی دقیق (Dokumentation & Nachvollziehbarkeit) حیاتی است. تجربه شما در ایجاد مستندات معماری، ویکی‌ها و راهنماهای کد برای همکاران چیست؟",
      questionDeEn: "Welchen Stellenwert hat saubere technische Dokumentation in Ihrer täglichen Arbeit und wie stellen Sie Nachvollziehbarkeit sicher?",
      recruiterObjective: "اطمینان از اینکه پروژه‌ها وابسته به شخص (Personenabhängig) نمانند و در صورت خروج نیرو، کار متوقف نشود.",
      evaluationFocus: "عادت به نگارش مستندات شفاف، مستندسازی تصمیمات معماری (ADR) و ساده‌سازی فرآیند برای اعضای بعدی تیم.",
      recommendedAnswerStrategy: "توضیح دهید که مستندسازی بخشی جدایی‌ناپذیر از 'تعریف اتمام کار' (Definition of Done) شماست و برای هر تغییر ساختاری، مستندات Confluence یا Readme را آپدیت می‌کنید.",
      redFlags: "بی‌میلی به نوشتن مستندات با ادعای اینکه 'کد خودش خودش را مستند می‌کند' یا اتلاف وقت دانستن داکیومنت.",
      realWorldSource: "الزامات مصاحبه استخدامی در شرکت‌های خودروسازی و صنعتی نظیر فولکس‌واگن و مرسدس-بنز."
    },
    {
      id: "gen-11",
      category: "general",
      categoryLabelFa: "عمومی و تاب‌آوری در ابهام",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "startup",
      companyTypeLabelFa: "استارتاپ‌ها و شرکت‌های محصول‌محور",
      questionFa: "زمانی را توصیف کنید که نیازمندی‌های پروژه ناقص، مبهم یا متغیر بودند. چگونه فرضیات خود را اعتبارسنجی کردید و مسیر پیشرفت را روشن ساختید؟",
      questionDeEn: "Wie agieren Sie in Projekten mit unklaren oder sich schnell verändernden Anforderungen?",
      recruiterObjective: "بررسی استقلال تفکر و قدرت شفاف‌سازی بدون معطل ماندن؛ سنجش شجاعت طرح سوالات هوشمندانه از مدیران محصول.",
      evaluationFocus: "تفکر ساختاریافته، تحلیل داده‌محور، و ارائه راه‌حل‌های کوچک قابل تست به جای توقف کامل پروژه.",
      recommendedAnswerStrategy: "توضیح دهید که فرضیات را مکتوب کردید، با ساختن یک پروتوتایپ سریع نظر ذینفعان را دریافت کرده و با بازخورد چرخه‌ای ابهام را از بین بردید.",
      redFlags: "توقف کار و شکواییه مداوم از مدیران، یا جلو رفتن بر اساس حدس و گمان‌های اشتباه بدون راستی‌آزمایی.",
      realWorldSource: "مصاحبه‌های شرکت‌های تکنولوژی برلین نظیر Zalando, Delivery Hero و Personio."
    },
    {
      id: "gen-12",
      category: "general",
      categoryLabelFa: "عمومی و مسئولیت‌پذیری پس از اشتباه",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "بزرگ‌ترین اشتباه یا شکست حرفه‌ای که در طول سوابق کاری خود تجربه کردید چه بود؟ چه عواقبی داشت و چه درس سیستماتیکی از آن گرفتید؟",
      questionDeEn: "Was war der größte Fehler in Ihrer bisherigen Laufbahn und was haben Sie daraus gelernt?",
      recruiterObjective: "این یک سوال کلاسیک روان‌سنجی در مصاحبه آلمان است. کارفرما صداقت، تواضع فنی و فرهنگ یادگیری از خطا (Fehlerkultur) را می‌سنجد. کتمان اشتباه به معنی رد فوری است.",
      evaluationFocus: "پذیرش شجاعانه خطا، بررسی ریشه‌ای (Root Cause Analysis - 5 Whys)، و بازطراحی سیستم تا هرگز همان باگ تکرار نشود.",
      recommendedAnswerStrategy: "یک باگ پروداکشن یا تخمین اشتباه واقعی را تعریف کنید، توضیح دهید که بلافاصله به تیم هشدار دادید، مشکل را حل کردید و با افزودن تست خودکار یا چک‌لیست، مانع تکرار آن شدید.",
      redFlags: "پاسخ‌های فریبکارانه مانند 'اشتباه خاصی نداشتم' یا مقصر نشان دادن سرور، شرکت یا همکاران قبلی.",
      realWorldSource: "دستورالعمل‌های مصاحبه مبتنی بر شایستگی (Competency-Based) در دویچه بانک و آلیانتس."
    },
    {
      id: "gen-13",
      category: "general",
      categoryLabelFa: "عمومی و انتظارات حقوقی و ارزش‌آفرینی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "انتظار حقوق ناخالص سالانه شما در آلمان (Gehaltsvorstellung Brutto) چقدر است و این رقم را بر اساس چه معیارهایی در بازار کار محلی تنظیم کرده‌اید؟",
      questionDeEn: "Was ist Ihre realistische Gehaltsvorstellung (brutto pro Jahr) und worauf basiert diese Einschätzung?",
      recruiterObjective: "بررسی واقع‌بینی داوطلب در مورد بازه‌های حقوقی ایالت مورد نظر (مثلاً تفاوت شرق و غرب آلمان، تعرفه‌های جمعی Tarifvertrag یا IGM)، و عدم تقاضای مبالغ نامتعارف.",
      evaluationFocus: "تحقیق روی میانگین دستمزدها در پلتفرم‌های StepStone و Entgeltatlas آلمان، و توجیه رقم بر اساس سطح مهارت و سابقه.",
      recommendedAnswerStrategy: "یک بازه مشخص (مثلاً ۶۵ تا ۷۲ هزار یورو سالانه بسته به بسته مزایا) پیشنهاد دهید و با تخصص‌های رزومه در تکنولوژی‌های کلیدی و هزینه‌های اسکان در منطقه توجیه کنید.",
      redFlags: "اعلام ارقام عجیب و تخیلی بدون آگاهی از مالیات، یا گفتن اینکه 'هر رقمی بدهید قبول دارم' که نشانه عدم اعتماد به نفس فنی است.",
      realWorldSource: "داده‌های حقوق و دستمزد آژانس کار فدرال آلمان (Bundesagentur für Arbeit)."
    },
    {
      id: "gen-14",
      category: "general",
      categoryLabelFa: "عمومی و تعهد اقامت طولانی‌مدت",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "فرآیند جابجایی بین‌المللی ممکن است با چالش‌های دیوان‌سالاری (Bürokratie)، اجاره مسکن در آلمان و دوری از خانواده همراه باشد. آمادگی روحی و پشتیبانی شما برای این مرحله چگونه است؟",
      questionDeEn: "Wie bereiten Sie sich auf bürokratische Hürden und die Wohnungssuche in Deutschland vor?",
      recruiterObjective: "اطمینان از اینکه متقاضی در اولین ماه‌های مهاجرت به دلیل شوک فرهنگی یا بوروکراسی آلمان دچار فروپاشی انگیزه نمی‌شود و برنامه عمل مشخصی دارد.",
      evaluationFocus: "آگاهی از مراحل ثبت اقامت (Anmeldung)، حساب بانکی و مدارک شناسایی، و واقع‌بینی نسبت به بازار مسکن آلمان.",
      recommendedAnswerStrategy: "نشان دهید که مدارک را آماده کرده‌اید، از فرآیندها اطلاع دارید و آماده اقامت اولیه در آپارتمان‌های مبله موقت (Temporary Housing) هستید تا کار رسمی آغاز گردد.",
      redFlags: "تصور اینکه مهاجرت یک پروسه رویایی بدون هیچ زحمت اداری است و شوکه شدن در برابر الزامات قانونی آلمان.",
      realWorldSource: "تجارب مهاجرتی مهندسان عضو پلتفرم Make it in Germany."
    },
    {
      id: "gen-15",
      category: "general",
      categoryLabelFa: "عمومی و کار تیمی متقابل",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "وقتی یکی از همکاران تیمی به کمک شما نیاز دارد اما خودتان تسک‌های محوله با اولویت بالا دارید، چگونه تعادل میان وظایف فردی و موفقیت جمعی را برقرار می‌کنید؟",
      questionDeEn: "Wie balancieren Sie Hilfsbereitschaft für Teamkollegen mit Ihren eigenen dringenden Aufgaben ab?",
      recruiterObjective: "سنجش مرزهای حرفه‌ای؛ نه فردگرایی مطلق و بی‌تفاوتی به هم‌تیمی، و نه اتلاف زمان فردی که باعث تاخیر تعهدات شود.",
      evaluationFocus: "همکاری موثر، تخصیص زمان مشخص (مثلاً ۳۰ دقیقه برای هدایت مسیر همکار) و اولویت‌بندی خروجی کل تیم.",
      recommendedAnswerStrategy: "توضیح دهید که ابتدا با تعیین یک زمان کوتاه به همکار در رفع گره ذهنی کمک می‌کنید یا منابع لازم را در اختیار او می‌گذارید و سپس به کار اصلی خود بازمی‌گردید.",
      redFlags: "رد کامل و تند درخواست همکار، یا رها کردن تعهدات خود که منجر به شکست ددلاین شخصی شود.",
      realWorldSource: "پرسش‌های ارزیابی کار تیمی در مصاحبه‌های مهندسی شرکت SAP."
    },
    {
      id: "gen-16",
      category: "general",
      categoryLabelFa: "عمومی و یادگیری مستمر فناوری",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "در صنعت سریع و پویای امروز، چگونه از تغییرات ابزارها، پترن‌های نوین و استانداردهای روز باخبر می‌شوید و آخرین مهارتی که به صورت خودآموز فراگرفتید چه بود؟",
      questionDeEn: "Wie halten Sie sich über technische Trends auf dem Laufenden und welche neue Technologie haben Sie sich zuletzt selbst beigebracht?",
      recruiterObjective: "بررسی اشتیاق ذاتی به فناوری و جلوگیری از کهنگی دانش تخصصی در تیم.",
      evaluationFocus: "منابع معتبر مطالعاتی (پادکست‌ها، مستندات رسمی، کامیونیتی‌های تخصصی)، و اجرای پروژه‌های تستی کوچک.",
      recommendedAnswerStrategy: "به یک ابزار مشخص که اخیراً مطالعه کرده‌اید اشاره کنید، دلیل علاقه خود را بگویید و توضیح دهید چه پتانسیلی برای ارتقای پروژه‌ها ایجاد می‌کند.",
      redFlags: "پاسخ‌های کلی نظیر 'در اینترنت سرچ می‌کنم' بدون داشتن کتاب، وبلاگ فنی یا روال مطالعاتی مشخص.",
      realWorldSource: "مصاحبه‌های فنی در استارتاپ‌های پیشرو هامبورگ و برلین."
    },
    {
      id: "gen-17",
      category: "general",
      categoryLabelFa: "عمومی و انطباق با قوانین داخلی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "انطباق با مقررات سازمانی (Compliance & Code of Conduct) در شرکت‌های آلمانی غیرقابل چشم‌پوشی است. رویکرد شما در حفظ حریم داده‌ها و رعایت دستورالعمل‌های داخلی چیست؟",
      questionDeEn: "Welche Bedeutung haben Compliance-Richtlinien und ethische Standards für Sie in der täglichen Arbeit?",
      recruiterObjective: "اطمینان از پایبندی صددرصدی به اصول عدم تعارض منافع، امنیت سایبری، و عدم نقض قوانین ایمنی و محرمانگی داده‌ها.",
      evaluationFocus: "احترام به قوانین سازمانی، مسئولیت‌پذیری اخلاقی و جدیت در رفتار حرفه‌ای.",
      recommendedAnswerStrategy: "تاکید کنید که امنیت اطلاعات مشتریان و انطباق سازمانی خط قرمز غیرقابل مذاکره شما در تمام دوران کاری بوده است.",
      redFlags: "رویکرد آسان‌گیرانه به امنیت، یا توجیه دور زدن پروتکل‌ها به بهانه 'سریع‌تر تمام شدن کار'.",
      realWorldSource: "مصاحبه‌های واحد حقوقی و تطابق در بورس فرانکفورت و شرکت‌های چندملیتی آلمان."
    },
    {
      id: "gen-18",
      category: "general",
      categoryLabelFa: "عمومی و کار از راه دور و استقلال کاری",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "با توجه به رواج مدل‌های کاری هیبریدی (Mobiles Arbeiten / Home-Office)، انضباط شخصی، تمرکز و هماهنگی تیمی خود را در زمان کار از منزل چگونه تضمین می‌کنید؟",
      questionDeEn: "Wie organisieren Sie Ihre Selbstdisziplin und transparente Kommunikation bei flexiblen Arbeitsmodellen oder im Home-Office?",
      recruiterObjective: "بررسی اعتمادپذیری در غیاب حضور فیزیکی؛ کارفرما می‌خواهد مطمئن شود داوطلب نیازی به پاییدن مداوم ندارد.",
      evaluationFocus: "استفاده موثر از ابزارهای مدیریت پروژه، پاسخگویی منظم در کانال‌های ارتباطی، و پایبندی به ساعات کاری تعریف‌شده.",
      recommendedAnswerStrategy: "تشریح روال روزانه کاری، تفکیک محیط کار خانگی، برگزاری استندآپ‌های منظم و مستندسازی تسک‌های روزمره در بستر Jira یا ابزارهای تیمی.",
      redFlags: "ناپدید شدن در ساعات کاری، پاسخ‌های بسیار دیرهنگام یا عدم تمرکز در ارتباطات دیجیتال.",
      realWorldSource: "پژوهش‌های موسسه اقتصاد آلمان (IW Köln) پیرامون بهره‌وری در دورکاری."
    },
    {
      id: "gen-19",
      category: "general",
      categoryLabelFa: "عمومی و مشارکت در ساختار اسکرام",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "در جلسات گذشته‌نگر (Retrospective) و برنامه‌ریزی اسپرینت، نقش شما در بهبود مستمر فرآیندها و رفع موانع فنی چه بوده است؟",
      questionDeEn: "Wie bringen Sie sich aktiv in Agile Zeremonien, insbesondere in Sprint Retrospektiven, zur kontinuierlichen Verbesserung ein?",
      recruiterObjective: "آیا داوطلب عضو منفعل است یا بازخورد سازنده و مبتکرانه برای اصلاح گلوگاه‌های تیمی ارائه می‌دهد.",
      evaluationFocus: "نگرش چابک واقعی، پیشنهاد راهکارهای سیستماتیک به جای غر زدن، و پیگیری بهبودها تا اسپرینت بعدی.",
      recommendedAnswerStrategy: "مثالی بیاورید که در جلسات رترو، یک تغییر مفید در ساختار تست، تقسیم وظایف یا جلسات کدریویو پیشنهاد دادید که بهره‌وری را بالا برد.",
      redFlags: "سکوت کامل در جلسات رترو یا تبدیل آن به مکانی برای تخلیه هیجانات منفی شخصی.",
      realWorldSource: "راهنماهای متدولوژی چابک در شرکت‌های پیشرو IT آلمان."
    },
    {
      id: "gen-20",
      category: "general",
      categoryLabelFa: "عمومی و پرسش‌های پایانی از کارفرما",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "در پایان مصاحبه کارفرما همواره خواهد پرسید: «آیا شما سوالی از ما دارید؟»؛ چه سوالات عمیق و استراتژیکی برای طرح در این بخش آماده کرده‌اید؟",
      questionDeEn: "Haben Sie am Ende des Gesprächs noch offene Fragen an uns als Arbeitgeber?",
      recruiterObjective: "در فرهنگ مصاحبه آلمان، نگفتن سوال در پایان جلسه نشانه بی‌علاقگی یا عدم آمادگی داوطلب است. کارفرما از روی نوع سوالات شما، عمق هوش و تسلط کاری‌تان را می‌سنجد.",
      evaluationFocus: "پرسش درباره نقشه راه فنی، چالش‌های کلیدی اسپرینت‌های آینده، فرآیند کدریویو، یا اهداف استراتژیک شرکت.",
      recommendedAnswerStrategy: "حداقل ۳ سوال عمیق بپرسید: مثلاً «بزرگ‌ترین گلوگاه فنی محصول در حال حاضر چیست؟»، «شاخص موفقیت فردی که این موقعیت را به دست می‌آورد در ۶ ماه اول چیست؟».",
      redFlags: "گفتن اینکه 'خیر، همه چیز توضیح داده شد و سوالی ندارم' یا تنها پرسیدن درباره زمان مرخصی و ناهار شرکت.",
      realWorldSource: "کتاب‌ها و استانداردهای استخدام مدیریت در آلمان (Erfolgreich im Vorstellungsgespräch)."
    },
    {
      id: "gen-21",
      category: "general",
      categoryLabelFa: "عمومی و چشم‌انداز توسعه شغلی",
      level: "general",
      levelLabelFa: "عمومی و بین‌فرهنگی",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "مسیر شغلی ایده‌آل خود را برای ۳ تا ۵ سال آینده در شرکتی آلمانی چگونه ترسیم می‌کنید و چه مهارت‌هایی را مایلید در این مسیر توسعه دهید؟",
      questionDeEn: "Wo sehen Sie Ihre fachliche und persönliche Entwicklung in den nächsten drei bis fünf Jahren bei uns?",
      recruiterObjective: "آیا برنامه‌های رشد فردی شما با مسیر پیشرفت شغلی شرکت (Individual Contributor در برابر Management Track) هم‌راستاست یا خیر.",
      evaluationFocus: "جاه‌طلبی واقع‌بینانه، تمرکز بر تعمیق مهارت‌های تخصصی، و تمایل به ایجاد ارزش درازمدت برای شرکت.",
      recommendedAnswerStrategy: "بیان کنید که در ۲ سال اول تمرکز بر تسلط کامل بر معماری محصول و فرهنگ تیمی دارید و در سال‌های بعد مایلید در حوزه‌های هدایت پروژه‌ها یا معمار فنی رشد کنید.",
      redFlags: "رویاپردازی غیرواقعی نظیر 'می‌خواهم سال آینده مدیرعامل شوم' یا بی‌برنامگی و بی‌هدفی کامل.",
      realWorldSource: "مدل‌های شایستگی شغلی در هلدینگ‌های صنعتی آلمان."
    }
  ];

  // -------------------------------------------------------------
  // PART 2: TECHNICAL COMPETENCY MATRIX (حداقل ۲۰ سوال تخصصی جونیور تا لید)
  // -------------------------------------------------------------
  const technicalQuestions: InterviewQuestionItem[] = [
    // --- JUNIOR LEVEL (۵ سوال) ---
    {
      id: "tech-jun-01",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - مهندسی پایه و کد تمیز",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: `در سوابق رزومه شما به کار با ${primaryTech} اشاره شده است؛ اصول اساسی کد تمیز (Clean Code) و نام‌گذاری استاندارد متغیرها، توابع و جداسازی دغدغه‌ها (Separation of Concerns) را در این زبان چگونه پیاده می‌کنید؟`,
      questionDeEn: `Wie wenden Sie Clean Code Prinzipien und Separation of Concerns in Ihrer täglichen Arbeit mit ${primaryTech} an?`,
      recruiterObjective: "کارفرمایان آلمانی برای سطوح جونیور بیشتر از تکنولوژی‌های پیچیده، به انضباط کدنویسی، خوانایی و پرهیز از کدهای کثیف (Spaghetti Code) اهمیت می‌دهند.",
      evaluationFocus: "تسلط بر اصول اولیه مهندسی نرم‌افزار، DRY (Don't Repeat Yourself)، خوانایی برای سایر همکاران و رعایت استانداردهای مستندسازی.",
      recommendedAnswerStrategy: "با متد STAR مثالی بزنید که چگونه یک تابع طولانی را به توابع کوچک و تک‌مسئولیتی با نام‌گذاری‌های شفاف و بدون ابهام بازنویسی کردید.",
      redFlags: "نوشتن توابع چندصد خطی، عدم توجه به نام‌گذاری‌های معنادار، یا استفاده از کدهای کپی-پیست‌شده بدون درک منطق آن.",
      realWorldSource: "آزمون‌های فنی شرکت‌های فناوری آلمان برای متقاضیان تازه فارغ‌التحصیل و جونیور."
    },
    {
      id: "tech-jun-02",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - متدولوژی دیباگ و حل خطا",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "وقتی در کد یا سیستم با یک باگ ناشناخته، ارور رندوم یا کرش غیرمنتظره مواجه می‌شوید، متدولوژی گام‌به‌گام شما برای ایزوله‌سازی و ریشه‌یابی خطا چیست؟",
      questionDeEn: "Welche systematische Vorgehensweise nutzen Sie beim Debugging und Eingrenzen von unerwarteten Fehlern?",
      recruiterObjective: "آیا متقاضی جونیور به صورت شانسی و با آزمون و خطای کورکورانه کد را تغییر می‌دهد یا متدولوژی علمی (بررسی لاگ، ساخت مجدد باگ، تست‌های کوچک) دارد.",
      evaluationFocus: "استفاده از ابزارهای دیباگر رسمی (Breakpoints, Profilers, Loggers)، بازتولید ایزوله مسئله و تحلیل ریشه‌ای باگ.",
      recommendedAnswerStrategy: "مراحل را منظم توضیح دهید: ۱. بازتولید پایدار خطا، ۲. بررسی لاگ‌های خطا، ۳. استفاده از Breakpoint برای بررسی وضعیت متغیرها، ۴. رفع خطا و اضافه کردن تست برای جلوگیری از بازگشت باگ.",
      redFlags: "روش‌های پرخطر نظیر تغییر تصادفی کد به امید حل مشکل یا اتکای صرف به جستجوی کپی-پیستی در اینترنت.",
      realWorldSource: "ارزیابی مهارت‌های فنی در مصاحبه‌های استخدامی شرکت‌های نرم‌افزاری مونیخ و کلن."
    },
    {
      id: "tech-jun-03",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - مدیریت نسخه و گیت",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "در فرآیند کار تیمی با Git، چگونه کامیت‌های خود را ساختاردهی می‌کنید و در صورت بروز Merge Conflict پیچیده در شاخه کاری‌تان، چطور با ایمنی تعارض را حل می‌نمایید؟",
      questionDeEn: "Wie strukturieren Sie aussagekräftige Git-Commits und wie lösen Sie Merge-Konflikte sicher auf?",
      recruiterObjective: "سنجش توانایی همکاری تیمی بدون آسیب زدن به مخزن اصلی پروژه (Main Branch).",
      evaluationFocus: "استفاده از استاندارد Conventional Commits، شاخه‌بندی درست (Feature Branches)، و درک تفاوت Rebase و Merge.",
      recommendedAnswerStrategy: "توضیح دهید که کامیت‌ها باید اتمیک و با پیام‌های استاندارد (feat, fix, docs) باشند و کانفلیکت‌ها با درک تغییرات هر دو شاخه و اجرای مجدد تست‌ها رفع شوند.",
      redFlags: "ارسال کامیت‌های حجیم و مبهم مانند 'update' یا 'fix bugs'، یا استفاده از git push --force بر روی شاخه‌های مشترک.",
      realWorldSource: "چک‌لیست‌های ارزیابی فنی در شرکتهای مستقر در برلین."
    },
    {
      id: "tech-jun-04",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - نوشتن یونیت تست",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: `تجربه شما از نگارش تست‌های خودکار (Unit Tests) برای کدهایی که با ${secondaryTech} توسعه داده‌اید چیست و چگونه موارد مرزی (Edge Cases) را پوشش می‌دهید؟`,
      questionDeEn: `Wie schreiben Sie automatisierte Unit Tests für Komponenten in ${secondaryTech} und wie identifizieren Sie Edge Cases?`,
      recruiterObjective: "در فرهنگ مهندسی آلمان، کدی که تست ندارد ناقص تلقی می‌شود. کارفرما می‌خواهد انضباط تست‌نویسی را حتی از سطوح جونیور ببیند.",
      evaluationFocus: "آشنایی با فریم‌ورک‌های تست (Jest, JUnit, PyTest)، درک الگوی Arrange-Act-Assert و نوشتن تست‌های معنادار به جای صرفاً افزایش درصد کاوریج صوری.",
      recommendedAnswerStrategy: "توضیح دهید که چطور تست‌های رفتاری می‌نویسید و ورودی‌های Null، مقادیر صفر، مرزهای آرایه و خطاهای شبکه را در تست‌ها شبیه‌سازی می‌کنید.",
      redFlags: "پاسخ دادن به اینکه 'در پروژه‌های قبلی وقت برای تست نداشتیم' یا بی‌اطلاعی از کتابخانه‌های تست استاندارد.",
      realWorldSource: "استانداردهای تضمین کیفیت نرم‌افزار در کنسرسیوم‌های صنعتی آلمان."
    },
    {
      id: "tech-jun-05",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - پایگاه داده و ارتباط داده‌ها",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "هنگام اتصال سیستم یا برنامه به پایگاه داده، مفاهیم اولیه نظیر تراکنش‌ها (Transactions)، ایندکس‌گذاری پایه و جلوگیری از تزریق کد مخرب (SQL Injection / Data Sanitization) را چگونه رعایت می‌کنید؟",
      questionDeEn: "Wie stellen Sie Datenintegrität und Schutz vor SQL-Injection bei Datenbankabfragen sicher?",
      recruiterObjective: "بررسی دانش پایه‌ای امنیت و پایداری داده‌ها؛ جلوگیری از ایجاد رخنه‌های امنیتی فاحش توسط نیروهای کم‌تجربه.",
      evaluationFocus: "استفاده از کوئری‌های پارامتری یا ORM معتبر، درک مفهوم ACID و ایمن‌سازی ورودی‌های کاربر.",
      recommendedAnswerStrategy: "بیان کنید که هرگز ورودی خام کاربر به کوئری الحاق نمی‌شود، از اعتبارسنجی قوی استفاده می‌گردد و تراکنش‌های حساس در بلوک‌های امن مدیریت می‌شوند.",
      redFlags: "عدم آگاهی از حملات تزریق کد یا عدم درک پیامد ناهماهنگی در تراکنش‌های مالی/ثبتی.",
      realWorldSource: "راهنمای امنیت نرم‌افزار اداره فدرال امنیت اطلاعات آلمان (BSI)."
    },

    // --- MID LEVEL (۷ سوال) ---
    {
      id: "tech-mid-06",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - بهینه‌سازی گلوگاه کارایی",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: `تجربه‌ای از رزومه خود را بیان کنید که با افت کارایی (Performance Bottleneck)، کندی لود یا مصرف بالای منابع در ${primaryTech} روبرو شدید. چگونه مسئله را تحلیل و با اعداد ملموس حل کردید؟`,
      questionDeEn: `Beschreiben Sie einen konkreten Performance-Engpass in ${primaryTech}, den Sie analysiert und nachhaltig optimiert haben.`,
      recruiterObjective: "برای نیروهای میدلول، کارفرمایان آلمانی منتظر شنیدن دستاوردهای عینی مبتنی بر پروفایلینگ هستند و ارزیابی می‌کنند آیا فرد توانایی ریشه‌یابی دارد یا فقط حدس می‌زند.",
      evaluationFocus: "استفاده از ابزارهای اندازه‌گیری زمان و مصرف حافظه، بهینه‌سازی کوئری‌ها یا کامپوننت‌ها و مقایسه قبل و بعد با ارقام درصدی.",
      recommendedAnswerStrategy: "با متد STAR نشان دهید که با ابزارهای مانیتورینگ گلوگاه را کشف کردید، کش یا بهینه‌سازی معماری اعمال نمودید و شاخص زمان پاسخ را از مثلاً ۴ ثانیه به ۳۵۰ میلی‌ثانیه کاهش دادید.",
      redFlags: "توضیحات کلی و مبهم بدون آمار عددی یا نسبت دادن حل مسئله به ارتقای سخت‌افزار سرور.",
      realWorldSource: "پرسش‌های مصاحبه تخصصی در شرکت‌های نرم‌افزاری بادن-وورتمبرگ."
    },
    {
      id: "tech-mid-07",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - طراحی API و قراردادهای داده",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "هنگام پیاده‌سازی و انتشار وب‌سرویس‌ها و APIها، چگونه مواردی چون نسخه گذاری (Versioning)، مدیریت متمرکز خطاها، کدهای وضعیت HTTP و امنیت احراز هویت (JWT / OAuth) را استانداردسازی می‌کنید؟",
      questionDeEn: "Wie gestalten Sie robuste REST- oder GraphQL-Schnittstellen mit sauberem API-Versioning und standardisierter Fehlerbehandlung?",
      recruiterObjective: "اطمینان از اینکه سرویس‌های ساخته‌شده توسط توسعه‌دهنده با سایر تیم‌ها و سامانه‌های بیرونی سازگار بوده و شکننده نیستند.",
      evaluationFocus: "رعایت قراردادهای API، مدیریت کدهای خطا بر پایه استاندارد RFC 7807، و پشتیبانی از سازگاری به عقب (Backward Compatibility).",
      recommendedAnswerStrategy: "توضیح دهید که با مستندسازی OpenAPI/Swagger، نسخه‌گذاری در URI یا هدر، و هندلینگ ساختاریافته استثناها، پایداری کلاینت‌ها را تضمین می‌کنید.",
      redFlags: "بازگرداندن خطای ۲۰۰ با پیام خطا در بدنه، نداشتن نسخه‌گذاری برای تغییرات مخرب، یا افشای استک‌ترس به کلاینت.",
      realWorldSource: "معیارهای ارزیابی تیم‌های توسعه در هلدینگ‌های زیمنس و تلکام آلمان."
    },
    {
      id: "tech-mid-08",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - کانتینرسازی و داکر",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "در فرآیند داکرسازی (Dockerization) برنامه‌ها، چگونه اندازه ایمیج‌ها را مینیمایز می‌کنید، امنیت کانتینر (Multi-stage build, Non-root user) را تامین کرده و متغیرهای محیطی حساس را مدیریت می‌نمایید؟",
      questionDeEn: "Wie optimieren Sie Dockerfiles hinsichtlich Multi-Stage-Builds, Container-Sicherheit und Image-Größe?",
      recruiterObjective: "در آلمان زیرساخت‌های کلود و مدرن به داکر متکی هستند و کدهای ناامن با پرمیژن روت در پروداکشن پذیرفته نیستند.",
      evaluationFocus: "استفاده از Multi-stage builds، انتخاب ایمیج‌های پایه سبک (Alpine/Distroless)، اجرای برنامه با کاربر غیر روت و اسکن آسیب‌پذیری‌ها.",
      recommendedAnswerStrategy: "تشریح کنید که چطور لایه‌های بیلد را از لایه نهایی تفکیک کردید، ایمیج را از ۱ گیگابایت به زیر ۱۰۰ مگابایت رساندید و سکرت‌ها را از طریق متغیرهای ران‌تایم تزریق نمودید.",
      redFlags: "قراردادن کلیدهای API و پسوردها در داکرفایل، ران کردن کانتینر با یوزر روت یا نداشتن شناخت از فرآیند ایزولاسیون.",
      realWorldSource: "استانداردهای زیرساخت ابری در کنفرانس‌های فنی دویچه‌تلکام و کلود آلمان."
    },
    {
      id: "tech-mid-09",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - تست انتگریشن و موک کردن",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "تفاوت استراتژی شما در نوشتن تست‌های یکپارچگی (Integration Tests) در مقایسه با تست‌های واحد چیست و وابستگی‌های خارجی (External APIs / Databases) را چگونه ایزوله یا شبیه‌سازی می‌کنید؟",
      questionDeEn: "Wie unterscheiden sich Ihre Integrationstests von Unit-Tests und wie mocken Sie externe Abhängigkeiten wie Datenbanken oder Dritt-APIs?",
      recruiterObjective: "سنجش بلوغ تست خودکار در پروژه‌های صنعتی؛ اطمینان از اینکه سیستم‌ها بعد از ترکیب قطعات مختلف دچار شکست نمی‌شوند.",
      evaluationFocus: "استفاده از ابزارهایی نظیر Testcontainers، موک‌سرورها، و تست تعامل با دیتابیس در محیط شبیه‌سازی‌شده بدون اختلال در دیتای واقعی.",
      recommendedAnswerStrategy: "توضیح دهید که با Testcontainers دیتابیس واقعی در کانتینر موقت بالا آورده و سناریوهای اند-تو-اند حیاتی را در پایپ‌لاین CI تست می‌کنید.",
      redFlags: "تست نکردن تعاملات دیتابیس با این فرض که 'یونیت تست کافی است' یا انجام تست‌های دستی پرهزینه قبل از هر ریلیز.",
      realWorldSource: "تجارب مصاحبه‌های مهندسی تضمین کیفیت در پورشه و بی‌ام‌و."
    },
    {
      id: "tech-mid-10",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - پترن‌های طراحی نرم‌افزار",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: `کدام الگوهای طراحی شی‌گرا یا ماژولار (Design Patterns نظیر Factory, Strategy, Observer, Repository) را در پروژه‌های ${primaryTech} به کار بردید و این انتخاب چه گرهی از نگهداری بلندمدت کد گشود؟`,
      questionDeEn: `Welche Design Patterns (z.B. Strategy, Factory, Observer) setzen Sie in ${primaryTech} ein und welcher konkrete Architekturvorteil entstand dadurch?`,
      recruiterObjective: "سنجش فهم عمیق معماری در سطح کدنویسی؛ در آلمان نگهداری کد برای سال‌های طولانی مدنظر است و کدهای فاقد پترن استاندارد هزینه‌ساز هستند.",
      evaluationFocus: "توجیه منطقی استفاده از پترن بر اساس نیازمندی تجاری پروژه، بدون افتادن در دام بیش‌طراحی (Over-engineering).",
      recommendedAnswerStrategy: "مثال بزنید که برای پشتیبانی از چند درگاه پرداخت یا روش محاسباتی، پترن Strategy را پیاده کردید تا بدون تغییر منطق قبلی، قابلیت جدید افزوده شود (Open/Closed Principle).",
      redFlags: "استفاده افراطی از پترن‌ها بدون دلیل فنی، یا عدم توانایی در نام بردن و توضیح یک پترن استاندارد مهندسی.",
      realWorldSource: "راهنماهای معماری نرم‌افزار انجمن مهندسان انفورماتیک آلمان (GI)."
    },
    {
      id: "tech-mid-11",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - مانیتورینگ و خطایابی پروداکشن",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "در زمان وقوع بحران یا کرش در محیط عملیاتی (Production Incident)، چگونه از لاگ‌های متمرکز، متریک‌ها (Prometheus / Grafana) و ردیابی توزیع‌شده برای شناسایی سریع بحران استفاده می‌کنید؟",
      questionDeEn: "Wie analysieren Sie Incidents im Produktivbetrieb anhand von Log-Aggregatoren und Observability-Tools?",
      recruiterObjective: "آرامش و تسلط در زمان خرابی سرورها؛ کارفرما می‌خواهد بداند آیا داوطلب می‌تواند در شرایط اضطراری فرآیند تریاژ و کشف علت را هدایت کند.",
      evaluationFocus: "درک لاگینگ ساختاریافته (JSON logs with TraceId)، بررسی متریک‌های چهارگانه طلایی (Latency, Traffic, Errors, Saturation).",
      recommendedAnswerStrategy: "توضیح دهید که با استفاده از Correlation ID، لاگ‌های مرتبط در سراسر میکروسرویس‌ها ردیابی شده و با رویکرد بدون سرزنش (Blameless Postmortem) علت برطرف می‌شود.",
      redFlags: "لاگین کردن با console.log به شکل غیرساختاریافته بدون لاگ‌لول، یا ورود به سرور پروداکشن با SSH و دستکاری مستقیم فایل‌ها.",
      realWorldSource: "دستورالعمل‌های مدیریت رویداد در سازمان‌های ابری معتبر آلمان."
    },
    {
      id: "tech-mid-12",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - بازنویسی کدهای قدیمی",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "بسیاری از شرکت‌های صنعتی آلمان دارای سیستم‌های قدیمی (Legacy Systems) با ارزش تجاری بالا هستند. رویکرد شما برای ریفکتورینگ امن کدهای حجیم و قدیمی بدون شکستن فیچرهای قبلی چیست؟",
      questionDeEn: "Wie modernisieren Sie gewachsene Legacy-Codebasen schrittweise und sicher, ohne bestehende Funktionalitäten zu gefährden?",
      recruiterObjective: "شرکت‌های Mittelstand آلمان عاشق این هستند که بدون ریسک بازنویسی از صفر، کدهای گذشته خود را نوسازی کنند. نیروهایی که با صبر و حوصله این کار را بلدند بسیار محبوب هستند.",
      evaluationFocus: "استفاده از الگوی Strangler Fig، ایجاد تست‌های پوششی قبل از دست زدن به کد، و اعمال تغییرات گام‌به‌گام و کوچک.",
      recommendedAnswerStrategy: "توضیح دهید که ابتدا تست‌های سنجش رفتار فعلی سیستم نوشته شد، سپس ماژول‌ها یکی‌یکی با معماری جدید جایگزین گردید تا سیستم پیوسته کار کند.",
      redFlags: "اصرار بر دور ریختن کل پروژه و بازنویسی از نو که ریسک مالی وحشتناکی برای کارفرما ایجاد می‌کند.",
      realWorldSource: "پروژه‌های مدرن‌سازی سیستم‌ها در کارخانجات سنتی ایالت نوردراین-وستفالن."
    },

    // --- SENIOR & LEAD LEVEL (۱۰ سوال) ---
    {
      id: "tech-sen-13",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - موازنه معماری و تریدآف‌ها",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: `در طراحی سامانه‌های توزیع‌شده با ترافیک بالا، چگونه تریدآف‌های حیاتی (Trade-offs) میان سادگی معماری، مقیاس‌پذیری افقی، پایداری داده‌ها و مدیریت بدهی فنی (Technical Debt) را ارزیابی و توجیه می‌کنید؟`,
      questionDeEn: "Wie bewerten und dokumentieren Sie architektonische Trade-offs bei hochverfügbaren Systemen?",
      recruiterObjective: "برای لول‌های سنیور و لید، کارفرما به دنبال تفکر استراتژیک است. در آلمان واژه Trade-off کلیدی است؛ مهم توانایی انتخاب هوشمندانه متناسب با بودجه و نیاز تجاری است.",
      evaluationFocus: "دید کلان معماری (System Design)، تدوین اسناد تصمیم‌گیری معماری (ADR)، و توجیه اقتصادی تصمیمات فنی برای مدیران کسب‌وکار.",
      recommendedAnswerStrategy: "چارچوب تصمیم‌گیری خود را با ماتریس Trade-off تشریح کنید. توضیح دهید چگونه مصالحه میان زمان ورود به بازار (Time-to-Market) و کمال معماری را مدیریت نمودید.",
      redFlags: "افتادن در دام ترندهای زودگذر بدون توجیه نیازمندی بیزینس، یا عدم توانایی در توضیح چرایی رد گزینه‌های دیگر.",
      realWorldSource: "مصاحبه‌های معماران سیستم در شرکت‌های بزرگ فرانکفورت و مونیخ."
    },
    {
      id: "tech-sen-14",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - فرهنگ کد ریویو و هدایت تیم",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "به عنوان نیروی ارشد یا هدایت‌کننده فنی، چگونه فرآیند بازبینی کد (Code Review) را مدیریت می‌کنید تا هم استانداردهای کیفی حفظ شود و هم انگیزه و رشد نیروهای جونیور تقویت گردد؟",
      questionDeEn: "Wie gestalten Sie konstruktive Code-Reviews und fördern das fachliche Wachstum juniorer Teammitglieder?",
      recruiterObjective: "ارشد بودن در آلمان به معنی تکثیر موفقیت در تیم (Team Multiplier) است؛ کارفرما می‌خواهد بداند آیا برخورد شما انگیزه‌بخش و آموزنده است یا مچ‌گیرانه.",
      evaluationFocus: "رهبری خدمتگزار (Servant Leadership)، تفکیک اصلاحات الزامی از سلیقه‌های شخصی، و استفاده از اتوماسیون برای خطاهای نگارشی.",
      recommendedAnswerStrategy: "بیان کنید که کدریویو محلی برای آموزش است؛ مسائل فرمتی به لینترها واگذار شده و تمرکز بازبینی روی معماری، تست‌پذیری و امنیت قرار می‌گیرد.",
      redFlags: "رفتارهای خودمحور یا تحقیرآمیز در کامنت‌های کدریویو، یا کند کردن بی‌دلیل فرآیند ادغام کدها.",
      realWorldSource: "استانداردهای منابع انسانی انجمن مهندسان آلمان (VDI)."
    },
    {
      id: "tech-sen-15",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - الزامات GDPR و امنیت BSI آلمان",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "public_authority",
      companyTypeLabelFa: "نهادهای عمومی و ساختارهای رگولاتوری آلمان",
      questionFa: "قوانین حفاظت از داده‌های شخصی اروپا و آلمان (GDPR / DSGVO) و چک‌لیست‌های امنیت فدرال BSI چگونه در طراحی چرخه ذخیره‌سازی، رمزنگاری و مدیریت دسترسی‌ها (RBAC) در پروژه‌های شما نهادینه می‌شوند؟",
      questionDeEn: "Wie stellen Sie DSGVO-Konformität (GDPR) und Privacy by Design in Ihren Softwarearchitekturen sicher?",
      recruiterObjective: "عدم آشنایی با DSGVO بزرگ‌ترین ریسک استخدام نیروهای غیراروپایی در آلمان است؛ کارفرما باید مطمئن شود متقاضی ارشد اصول حریم خصوصی را عمیقاً درک کرده است.",
      evaluationFocus: "درک حق فراموشی داده‌ها (Right to be forgotten)، آنونیم‌سازی لاگ‌ها، تفکیک داده‌های هویتی و رمزنگاری در استراحت و انتقال.",
      recommendedAnswerStrategy: "نشان دهید که امنیت یک لایه اضافه در انتها نیست بلکه از روز اول (Privacy by Design) با محدود کردن نگهداری دیتای حساس پیاده می‌شود.",
      redFlags: "بی‌تفاوتی نسبت به قوانین حریم خصوصی و توجیه ذخیره دیتای مشتریان در لاگ‌های باز بدون رمزنگاری.",
      realWorldSource: "الزامات مصاحبه در بانک‌ها و نهادهای بیمه آلمان نظیر Allianz و Deutsche Bank."
    },
    {
      id: "tech-sen-16",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - مهاجرت از مونولیت به میکروسرویس",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "در فرآیند تجزیه یک سامانه بزرگ به میکروسرویس‌ها، چگونه سازگاری تراکنشی داده‌ها (Distributed Transactions / Saga Pattern) و مرزبندی دامنه‌ها (Domain-Driven Design) را مدیریت می‌کنید؟",
      questionDeEn: "Wie handhaben Sie Datenkonsistenz und Domain-Boundaries bei der Dekomposition monolithischer Systeme in Microservices?",
      recruiterObjective: "سنجش درک پیامدهای پیچیدگی سیستم‌های توزیع‌شده؛ شرکت‌های آلمانی نمی‌خواهند به بهانه مدرن‌سازی، دچار 'آشفتگی توزیع‌شده' شوند.",
      evaluationFocus: "تسلط بر الگوهای Saga، رویدادمحوری (Event-Driven)، استفاده از بروکرها (Kafka / RabbitMQ) و حفظ یکپارچگی داده‌ها.",
      recommendedAnswerStrategy: "توضیح دهید که با Bounded Context دامنه‌ها مشخص شدند، از تراکنش‌های دو فازی سنگین پرهیز شد و با رویدادهای بازگشتی پایداری تضمین گردید.",
      redFlags: "استفاده کورکورانه از میکروسرویس برای پروژه‌های ساده، یا دسترسی مشترک چند میکروسرویس به یک دیتابیس واحد.",
      realWorldSource: "مطالعات موردی مهاجرت ابری در شرکت‌های مخابراتی و بانکی آلمان."
    },
    {
      id: "tech-sen-17",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - پایپ‌لاین CI/CD و امنیت زنجیره تامین",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "چگونه یک پایپ‌لاین اتوماتیک CI/CD کامل را با مکانیزم‌های اسکن آسیب‌پذیری پکیج‌ها (SAST / DAST)، انتشار بدون قطعی (Zero-Downtime / Blue-Green) و قابلیت بازگشت آنی (Rollback) پیکربندی می‌کنید؟",
      questionDeEn: "Wie konzipieren Sie eine hochsichere CI/CD-Pipeline mit automatisierter Vulnerability-Prüfung und Zero-Downtime-Deployment?",
      recruiterObjective: "اطمینان از ایمنی استقرار کد در ابعاد شرکتی؛ کارفرما به دنبال کاهش حداکثری مداخله دستی در انتشار نرم‌افزار است.",
      evaluationFocus: "اسکن اتوماتیک کتابخانه‌ها، استراتژی‌های استقرار قناری یا آبی-سبز و مانیتورینگ سلامت حین انتشار.",
      recommendedAnswerStrategy: "شرح دهید که چطور تست‌ها و اسکن‌ها به عنوان گیت‌های مسدودکننده در گیت‌هاب اکشنز یا گیت‌لب تعریف شده و در صورت افزایش خطای کلاینت، رول‌بک خودکار فعال می‌شود.",
      redFlags: "استقرار دستی با دستورات ترمینال، نادیده گرفتن هشدارهای امنیتی پکیج‌های وابسته، یا نبود برنامه مشخص برای رول‌بک.",
      realWorldSource: "الزامات استقرار مدرن در پلتفرم‌های تکنولوژی برلین و مونیخ."
    },
    {
      id: "tech-sen-18",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - مدیریت کش و همگام‌سازی توزیع‌شده",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "هنگام پیاده‌سازی لایه‌های کش توزیع‌شده (Distributed Caching نظیر Redis)، استراتژی‌های شما برای بی‌اعتبارسازی کش (Cache Invalidation) و جلوگیری از پدیده‌های Cache Stampede چیست؟",
      questionDeEn: "Welche Strategien nutzen Sie für Cache-Invalidierung und zur Vermeidung von Cache-Stampede-Effekten in verteilten Systemen?",
      recruiterObjective: "مسئله کش یکی از دو معضل کلاسیک علوم کامپیوتر است؛ ارزیاب می‌خواهد بداند داوطلب تا چه اندازه به باگ‌های همزمانی و دیتای بیات (Stale Data) مسلط است.",
      evaluationFocus: "الگوهای Cache-Aside, Write-Through, استفاده از Mutex/Lock برای بازتولید کلیدهای کش و تعیین هوشمندانه TTL.",
      recommendedAnswerStrategy: "الگوی Cache-aside و استفاده از قفل‌های توزیع‌شده برای پر کردن کش‌های منقضی‌شده پرتقاضا را با یک مثال ملموس توضیح دهید.",
      redFlags: "عدم درک شرایط ناهمزمانی و کش کردن نامحدود داده‌ها بدون سیاست مشخص برای بی‌اعتبارسازی.",
      realWorldSource: "آزمون‌های مصاحبه سیستم‌های مقیاس‌پذیر در شرکت‌های آنلاین آلمان."
    },
    {
      id: "tech-sen-19",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - بهینه‌سازی کوئری‌های پیچیده و دیتابیس",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "هنگامی که حجم داده‌ها به ده‌ها میلیون رکورد می‌رسد، چگونه پلن اجرای کوئری (Execution Plan / EXPLAIN ANALYZE) را بررسی کرده و راهکارهایی مانند پارتیشن‌بندی و طراحی ایندکس‌های کامپوزیت را پیاده می‌کنید؟",
      questionDeEn: "Wie optimieren Sie komplexe Datenbankabfragen mittels Execution Plans und Sharding/Partitioning bei stark wachsenden Datenmengen?",
      recruiterObjective: "سنجش قدرت فنی در قلب سامانه‌ها؛ جلوگیری از زمین‌گیر شدن بیزینس به دلیل کوئری‌های ناکارآمد.",
      evaluationFocus: "شناسایی Sequential Scanهای پرهزینه، ایندکس‌های مناسب (B-Tree, GIN, Partial Indexes) و درک پارتیشن‌بندی زمانی یا دامنه‌ای.",
      recommendedAnswerStrategy: "یک سناریوی عینی را شرح دهید که با بررسی هزینه اجرایی، افزودن ایندکس جزئی و پارتیشن‌بندی جداول تاریخ، زمان کوئری‌ها به کسری از ثانیه تقلیل یافت.",
      redFlags: "ایندکس‌گذاری کورکورانه روی تمام ستون‌ها که سرعت نوشتن را نابود می‌کند، یا ناتوانی در تحلیل گزارش EXPLAIN.",
      realWorldSource: "چالش‌های فنی مصاحبه در صنایع پردازش تراکنش‌های بانکی آلمان."
    },
    {
      id: "tech-sen-20",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - مدیریت ریسک و تعامل با مدیران تجاری",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان آلمانی",
      questionFa: "چگونه یک ضرورت فنی سنگین (مانند ریفکتورینگ معماری یا ارتقای پلتفرم) را به زبانی ساده و تجاری برای مدیران ارشد مالی و محصول توجیه می‌کنید تا بودجه و زمان لازم را تایید کنند؟",
      questionDeEn: "Wie übersetzen Sie technische Notwendigkeiten und Refactoring-Bedarfe in Business-Nutzen für Stakeholder?",
      recruiterObjective: "مهارت تبدیل چالش‌های مهندسی به منافع اقتصادی (کاهش هزینه سرور، سرعت عرضه فیچرهای آینده، کاهش ریسک قطعی) شاخصه کلیدی یک نیروی لید است.",
      evaluationFocus: "ارتباط شفاف، پرهیز از اصطلاحات نامفهوم برای مدیران، و ارائه اعداد بازگشت سرمایه (ROI).",
      recommendedAnswerStrategy: "توضیح دهید که با ترسیم هزینه بدهی فنی، تاخیر در ریلیزهای بعدی و ریسک مالی قطعی سیستم، مدیران را متقاعد کردید ۲۰٪ زمان هر اسپرینت به بهبودهای زیرساختی اختصاص یابد.",
      redFlags: "نگرش از بالا به پایین نسبت به بیزینس، یا غر زدن درباره کدهای کثیف بدون ارائه مدل اقتصادی برای حل آن.",
      realWorldSource: "معیارهای ارزیابی راهبری فنی در شرکت‌های مشاوره مدیریت فناوری آلمان."
    },
    {
      id: "tech-sen-21",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - طراحی سیستم مقاومت در برابر خطا",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "چگونه الگوهای پایداری و مقاومت در برابر خطا (Resilience Patterns نظیر Circuit Breaker, Rate Limiting, Bulkhead, Retry with Backoff) را در تعاملات میان سرویس‌ها پیاده‌سازی می‌کنید؟",
      questionDeEn: "Wie implementieren Sie Resilience Patterns wie Circuit Breaker und Rate Limiting gegen kaskadierende Ausfälle?",
      recruiterObjective: "اطمینان از اینکه قطعی یک سرویس فرعی، کل سامانه را به صورت دومینویی متوقف نمی‌کند.",
      evaluationFocus: "شناخت ابزارهای مدیریت انعطاف‌پذیری، سیاست‌های شکست شرافتمندانه (Graceful Degradation) و حفاظت از سرویس‌های پایین‌دستی.",
      recommendedAnswerStrategy: "تشریح کنید که چطور با Circuit Breaker از فشار مکرر بر سرویس قطع‌شده جلوگیری کردید و کلاینت پاسخ کش‌شده دریافت کرد تا سرویس بازیابی شود.",
      redFlags: "تکرار نامحدود و همزمان درخواست‌های ناموفق که منجر به حمله انکار سرویس خودخواسته (Self-inflicted DoS) به سرور می‌شود.",
      realWorldSource: "مصاحبه‌های مهندسی پایداری سیستم در شرکتهای خودروسازی و لجستیک آلمان."
    }
  ];

  const interviewerProfile = getInterviewerProfileForDomain(domainInfo.domain);

  let finalTechnicalQuestions = technicalQuestions;
  const domainOptions: DomainQuestionOptions = {
    primaryTool: primaryTech,
    softwareList: softwareTools,
    yearsOfExperience: yearsExp,
    certifications,
    practicalProjects
  };

  const domainSpecific = getDomainTechnicalQuestions(domainInfo.domain, domainOptions);
  if (domainSpecific.length > 0) {
    finalTechnicalQuestions = domainSpecific;
  }

  const allQuestions: InterviewQuestionItem[] = [...generalQuestions, ...finalTechnicalQuestions].map((q, idx) => {
    const star = buildStarFrameworkForQuestion(q, domainInfo.domainTitleFa);
    const cvReference = q.cvReference || (
      q.category === "technical"
        ? `استخراج‌شده بر پایه کار با ${techListStr || primaryTech}${yearsExp ? ` و ${yearsExp} سابقه فعالیت تخصصی` : ""}`
        : `استخراج‌شده بر پایه سوابق شغلی، تحصیلی و فرآیند همگام‌سازی بین‌فرهنگی مستند در رزومه شما`
    );
    const practicalWorkReference = q.practicalWorkReference || (
      q.category === "technical"
        ? `انطباق مستقیم با نرم‌افزارهای مسلط (${techListStr || primaryTech})${yearsExp ? ` و ${yearsExp} تجربه کاری اجرایی` : ""}${certifications.length > 0 ? ` و مدارک (${certifications.slice(0, 2).join("، ")})` : ""}`
        : `انطباق با سوابق شغلی مستند و تطبیق فرهنگی با هنجارهای کارفرمایان آلمانی`
    );
    const jargonTerms = (q.jargonTerms && q.jargonTerms.length > 0)
      ? q.jargonTerms
      : extractGermanJargonTerms(q.questionDeEn, q.category);
    const germanJargonExplanation = q.germanJargonExplanation || (
      q.category === "general"
        ? "ادبیات مرسوم در مصاحبه‌های استخدامی آلمان؛ تاکید بر صراحت حرفه‌ای (Sachlichkeit)، تعهد زمانی و ارزیابی ریسک دوره آزمایشی (Probezeit)."
        : "اصطلاحات رایج مهندسی در پروژه‌های صنعتی آلمان؛ تاکید بر کدهای معتبر (Stand der Technik)، کنترل کیفیت و ریشه‌یابی فنی."
    );

    return {
      ...q,
      cvReference,
      practicalWorkReference,
      jargonTerms,
      germanJargonExplanation,
      starFramework: star,
      reasoning: (q as any).reasoning || (
        q.category === "general"
          ? `کارفرمای آلمانی این سوال را مشخصاً برای اعتبارسنجی انطباق‌پذیری بین‌فرهنگی، پایداری استخدامی و ارزیابی درک شما از فرهنگ کار مبتنی بر صراحت (Sachlichkeit)، وقت‌شناسی و مدیریت ریسک مطرح می‌کند تا از موفقیت قطعی در دوره آزمایشی (Probezeit) اطمینان یابد.`
          : `کارفرمای آلمانی این پرسش تخصصی حوزه ${domainInfo.domainTitleFa} را بر مبنای کار با ${techListStr || primaryTech} برای سنجش عمق تجارب واقعی در پروژه‌های گذشته، پرهیز از اغراق‌های رزومه‌ای و اطمینان از قابلیت حل مسئله در استانداردهای صنعتی و مهندسی آلمان (کیفیت، الزامات DIN/VDE/Eurocode، امنیت و متدولوژی اجرایی) مطرح می‌نماید.`
      )
    };
  });

  const detectedRole = domainInfo.domain !== "software_it" ? domainInfo.domainTitleFa : kw.detectedRole;
  const detectedRoleDe = domainInfo.domain !== "software_it" ? domainInfo.domainTitleDe : kw.detectedRoleDe;

  return {
    candidateName,
    targetRole: detectedRole,
    targetRoleDe: detectedRoleDe,
    experienceLevelDetected: kw.detectedLevel,
    summaryOverview: `بر اساس بررسی عمیق سوابق و تخصص‌های مستند در رزومه شما (${detectedRole})، تیم ارزیابی فنی و استخدام کارفرمایان آلمانی (تحت نظر ${interviewerProfile.titleFa}) جلسه مصاحبه را بر مبنای کارهای عملیاتی و پروژه‌های تحویل‌شده، نرم‌افزارهای تخصصی مسلط (${techListStr || primaryTech})، سال‌های سابقه کار (${yearsExp || "تخصصی"}) و گواهینامه‌های اخذشده هدایت خواهند کرد؛ به طوری که ارزیابی فراتر از سرفصل‌های تئوریک دانشگاهی بوده و میزان تسلط کارگاهی، استانداردسازی DIN/اروپا و کاهش ریسک دوره آزمایشی (Probezeit) را مورد سنجش قرار می‌دهد.`,
    germanMarketInsights: [
      "اصل روش‌شناسی STAR (Situation, Task, Action, Result)؛ مصاحبه‌کنندگان آلمانی ساختاریافته‌ترین پاسخ‌ها را می‌پسندند و کلی‌گویی را نشانه ضعف تلقی می‌کنند.",
      "فرهنگ شفافیت و صراحت (Sachlichkeit)؛ هرگز اشتباهات گذشته را پنهان نکنید، بلکه توضیح دهید چه اقدام اصلاحی انجام شد و چه درسی گرفتید.",
      "سهم فردی شفاف؛ در کنار افتخار به کار تیمی، همیشه مشخص کنید نقش دقیق و سهم انفرادی شما («من انجام دادم») در موفقیت پروژه چه بوده است.",
      "انطباق با استانداردهای آلمان؛ تسلط بر استانداردهای صنعتی (DIN, Eurocodes, VDE, HGB) مزیت رقابتی فوق‌العاده‌ای در جلسات استخدام ایجاد می‌کند."
    ],
    interviewerProfile,
    candidateWorkProfile: {
      yearsOfExperience: yearsExp || kw.detectedLevel,
      softwareTools,
      certifications,
      practicalProjects,
      academicDegree: params.degree
    },
    extractedResumeDetails: {
      candidateName,
      targetRole: detectedRole,
      keySkills: softwareTools,
      fileName: params.fileName
    },
    questions: allQuestions
  };
}

/**
 * Builds or normalizes a German-interview STAR Framework for any question
 */
export function buildStarFrameworkForQuestion(
  q: Partial<InterviewQuestionItem>,
  domainTitleFa: string = "فنی و مهندسی"
): StarFrameworkItem {
  if (q.starFramework && q.starFramework.situation && q.starFramework.action) {
    return q.starFramework;
  }

  const isGeneral = q.category === "general";

  if (isGeneral) {
    return {
      situation: `موقعیت و زمینه کاری (Situation): یک سناریوی عینی از پروژه‌ها یا شرکت‌های قبلی خود را با ذکر ابعاد تیم، فناوری‌های کلیدی و اهداف سازمانی تشریح کنید (مثلاً: «در پروژه مهاجرت سازمانی با تیمی ۸ نفره از ملیت‌های مختلف، ددلاین ۳ ماهه برای لانچ داشتیم»). از کلی‌گویی و مثال‌های فرضی اکیداً بپرهیزید.`,
      task: `مأموریت و مسئولیت اختصاصی (Task): مشخصاً مسئولیت فردی خود را شفاف کنید («مسئولیت مستقیم من مدیریت ریسک فاز ۲ و حل ناهماهنگی ارتباطی میان تیم بک‌اند و مدیریت پروژه بود»). تفکیک نقش خود («Ich») از کل تیم («Wir») در آلمان نقشی تعیین‌کننده دارد.`,
      action: `اقدامات اجرایی و متدولوژی آلمانی (Action): بیش از ۵۰٪ پاسخ را به شرح متدولوژی، تصمیم‌گیری مستند و گام‌های عینی خود اختصاص دهید: «جلسات شفاف‌سازی بر پایه داده‌ها (Sachlichkeit) تشکیل دادم، ماتریس ریسک تهیه نمودم و ۳ سناریوی اقدام همراه با برآورد هزینه تدوین کردم».`,
      result: `نتیجه مستند و قابل سنجش (Result): دستاورد نهایی را با آمار، زمان‌بندی یا رضایت ذی‌نفعان گزارش دهید (مثلاً: «فاز بدون تاخیر تحویل شد، تست با موفقیت کامل پاس شد و چارچوب مستندسازی به عنوان رویه استاندارد ثبت گردید»). درس‌آموخته‌های مثبت خود را نیز قید کنید.`,
      germanCultureTip: `نکته کلیدی فرهنگ کار آلمان (Sachlichkeit & Verlässlichkeit): کارفرمای آلمانی شیفته صداقت، خودانتقادی سالم و تعهد زمانی است. هرگز اشتباهات را انکار نکنید؛ توضیح دهید چگونه آن را متوجه شدید و فوراً فرآیند را اصلاح کردید.`
    };
  }

  return {
    situation: `موقعیت و بستر فنی (Situation): دامنه دقیق پروژه را در حوزه ${domainTitleFa} معرفی کنید: معماری سامانه، استانداردهای صنعتی مرجع (مانند DIN EN, ISO, Eurocode, Clean Architecture)، تعداد کاربران یا محدودیت‌های سخت‌افزاری/محیطی.`,
    task: `مأموریت و چالش محوری (Task): مأموریت مشخص فنی که به شما محول شده بود را بازگو کنید (مثلاً: رفع گلوگاه تاخیر پردازش، بهینه‌سازی سازه تحت بارگذاری بحرانی، یا اجرای فرآیند تست بدون توقف خط).`,
    action: `اقدامات تخصصی و متدولوژی حل مسئله (Action): با نام بردن ابزارهای واقعی و استانداردهای مهندسی، گام‌های علمی و سیستماتیک خود را شرح دهید: ریشه‌یابی خطا (Root Cause Analysis)، تحلیل داده‌ها، پیاده‌سازی آزمون‌های استاندارد و مستندسازی فنی.`,
    result: `نتیجه مستند و سنجه‌های عددی (Result): خروجی را با معیارهای کمّی اثبات کنید (مثلاً: ۳۵٪ بهبود کارایی، کاهش ۷۰٪ خطاها، قبولی ۱۰۰٪ در آزمون‌های تست کنترل کیفی و تایید رسمی توسط مدیریت ارشد).`,
    germanCultureTip: `نکته فرهنگ مهندسی آلمان (Qualitätsbewusstsein & Gründlichkeit): در مهندسی آلمان، پایداری بلندمدت و مستندسازی شفاف (Dokumentation) بسیار باارزش‌تر از راهکارهای موقت و سریع است. تسلط خود بر استانداردهای ایمنی و نگهداری را برجسته سازید.`
  };
}

/**
 * Extracts or generates authentic German engineering and workplace jargon terms from a question
 */
export function extractGermanJargonTerms(germanText: string, category: "general" | "technical"): string[] {
  const dictionary: { regex: RegExp; term: string }[] = [
    { regex: /Probezeit/i, term: "Probezeit (دوره آزمایشی ۶ ماهه)" },
    { regex: /Flaschenhals|Bottleneck/i, term: "Flaschenhals (گلوگاه عملیاتی/فنی)" },
    { regex: /Hands-on/i, term: "Hands-on-Mentalität (عمل‌گرایی مستقیم در پروژه)" },
    { regex: /Stand der Technik/i, term: "Stand der Technik (بالاترین سطح استاندارد صنعتی)" },
    { regex: /Fehlerkultur/i, term: "Fehlerkultur (فرهنگ سازنده یادگیری از خطا)" },
    { regex: /Vier-Augen-Prinzip/i, term: "Vier-Augen-Prinzip (اصل بازبینی ۴ چشمی/تایید دونفره)" },
    { regex: /Plausibilit/i, term: "Plausibilitätskontrolle (اعتبارسنجی عقلانی محاسبات)" },
    { regex: /Tacheles|Klartext/i, term: "Tacheles reden (صراحت کامل و شفافیت در طرح مشکل)" },
    { regex: /Feierabend/i, term: "Feierabend-Kultur (تفکیک دقیق ساعت کار و فراغت)" },
    { regex: /Clean Code/i, term: "Clean Code & Hygiene (کدنویسی استاندارد و بهداشتی)" },
    { regex: /Eurocode|EC\s*2|EC\s*3/i, term: "Eurocodes (استانداردهای طراحی سازه اروپا)" },
    { regex: /DIN\s*EN/i, term: "DIN EN Normenwerk (نظام مقررات و استانداردهای آلمان)" },
    { regex: /Altlasten|Technical Debt/i, term: "Altlasten (بدهی فنی و کدهای به ارث رسیده)" },
    { regex: /Hauruck/i, term: "Hauruck-Aktionen vermeiden (پرهیز از اقدامات عجولانه و غیرمستند)" },
    { regex: /Schnittstelle/i, term: "Schnittstellenkompetenz (مدیریت نقاط اتصال و اینترفیس‌ها)" },
    { regex: /Troubleshooting/i, term: "Troubleshooting (عیب‌یابی در شرایط زنده کاری)" },
    { regex: /Arbeitszeitgesetz/i, term: "Arbeitszeitgesetz (قانون فدرال ساعات کاری)" },
    { regex: /Nachvollziehbarkeit|Dokumentation/i, term: "Nachvollziehbarkeit (قابلیت ردیابی و مستندسازی)" },
    { regex: /Tellerrand/i, term: "Über den Tellerrand schauen (دید کل‌نگر فراتر از تسک فردی)" },
    { regex: /Gehaltsvorstellung/i, term: "Gehaltsvorstellung (برآورد واقع‌بینانه حقوق ناخالص)" },
    { regex: /Compliance/i, term: "Compliance & DSGVO (انطباق با مقررات و حریم داده)" },
    { regex: /Bürokratie|Wohnungssuche/i, term: "Bürokratie & Integration (عبور از موانع اداری اقامت)" },
    { regex: /Betondeckung|Expositionsklassen/i, term: "Expositionsklassen (رده‌های محیطی و دوام)" },
    { regex: /BaustellV|SiGe/i, term: "Baustellenverordnung & SiGeKo (دستورالعمل‌های ایمنی کارگاه)" },
    { regex: /FMEA|Qualit/i, term: "FMEA & Qualitätssicherung (تحلیل حالات خرابی و تضمین کیفیت)" },
    { regex: /HGB|DATEV|IFRS/i, term: "HGB / DATEV (اصول حسابداری قانونی آلمان)" },
    { regex: /HOAI|BIM/i, term: "HOAI & BIM-Konformität (مقررات تعرفه مهندسی و بیم)" },
  ];

  const matched: string[] = [];
  for (const item of dictionary) {
    if (item.regex.test(germanText)) {
      matched.push(item.term);
    }
  }

  if (matched.length === 0) {
    if (category === "general") {
      return ["Sachlichkeit (رویکرد واقع‌گرایانه و بدون تعصب)", "Pünktlichkeit & Verlässlichkeit (تعهد زمانی آلمانی)"];
    } else {
      return ["Stand der Technik (سطح استاندارد صنعتی آلمان)", "Qualitätsbewusstsein (حساسیت کیفی مهندسی)"];
    }
  }

  return matched.slice(0, 3);
}

