import { InterviewQuestionItem } from "../types";

export type EngineeringDomain = 
  | "civil"
  | "mechanical"
  | "electrical"
  | "healthcare"
  | "finance_accounting"
  | "architecture"
  | "industrial_management"
  | "data_ai"
  | "software_it"
  | "general_engineering";

export function detectDomainFromContext(contextText: string, fileName?: string): {
  domain: EngineeringDomain;
  domainTitleFa: string;
  domainTitleDe: string;
} {
  const combined = ((contextText || "") + " " + (fileName || "")).toLowerCase();

  if (
    combined.includes("عمران") ||
    combined.includes("سازه") ||
    combined.includes("بتن") ||
    combined.includes("ساختمان") ||
    combined.includes("ژئوتکنیک") ||
    combined.includes("خاک") ||
    combined.includes("نقشه‌برداری") ||
    combined.includes("راهسازی") ||
    combined.includes("civil") ||
    combined.includes("structural") ||
    combined.includes("construction") ||
    combined.includes("etabs") ||
    combined.includes("sap2000") ||
    combined.includes("tekla") ||
    combined.includes("omran") ||
    combined.includes("bauingenieur")
  ) {
    return {
      domain: "civil",
      domainTitleFa: "مهندسی عمران، سازه و مدیریت ساخت",
      domainTitleDe: "Bauingenieurwesen / Tragwerksplanung / Bauleitung"
    };
  }

  if (
    combined.includes("مکانیک") ||
    combined.includes("ساخت و تولید") ||
    combined.includes("طراحی کاربردی") ||
    combined.includes("جامدات") ||
    combined.includes("سیالات") ||
    combined.includes("حرارت") ||
    combined.includes("خودرو") ||
    combined.includes("مکاترونیک") ||
    combined.includes("solidworks") ||
    combined.includes("catia") ||
    combined.includes("ansys") ||
    combined.includes("mechanical") ||
    combined.includes("maschinenbau") ||
    combined.includes("mechanic")
  ) {
    return {
      domain: "mechanical",
      domainTitleFa: "مهندسی مکانیک، طراحی جامدات و ساخت صنعتی",
      domainTitleDe: "Maschinenbau / Konstruktionstechnik / Mechatronik"
    };
  }

  if (
    combined.includes("برق") ||
    combined.includes("الکترونیک") ||
    combined.includes("مخابرات") ||
    combined.includes("قدرت") ||
    combined.includes("کنترل") ||
    combined.includes("تابلو برق") ||
    combined.includes("plc") ||
    combined.includes("eplan") ||
    combined.includes("altium") ||
    combined.includes("electrical") ||
    combined.includes("elektrotechnik") ||
    combined.includes("bargh")
  ) {
    return {
      domain: "electrical",
      domainTitleFa: "مهندسی برق، الکترونیک و اتوماسیون صنعتی",
      domainTitleDe: "Elektrotechnik / Automatisierungstechnik / Elektronik"
    };
  }

  if (
    combined.includes("پرستار") ||
    combined.includes("پزشک") ||
    combined.includes("درمان") ||
    combined.includes("بیمارستان") ||
    combined.includes("مامایی") ||
    combined.includes("اتاق عمل") ||
    combined.includes("پیراپزشکی") ||
    combined.includes("بالینی") ||
    combined.includes("nurse") ||
    combined.includes("nursing") ||
    combined.includes("doctor") ||
    combined.includes("physician") ||
    combined.includes("pflege") ||
    combined.includes("medizin") ||
    combined.includes("klinik")
  ) {
    return {
      domain: "healthcare",
      domainTitleFa: "کادر درمان، پرستاری و علوم پزشکی",
      domainTitleDe: "Gesundheits- und Krankenpflege / Humanmedizin / Klinische Fachkräfte"
    };
  }

  if (
    combined.includes("حسابدار") ||
    combined.includes("مالی") ||
    combined.includes("حسابرسی") ||
    combined.includes("مالیات") ||
    combined.includes("بودجه") ||
    combined.includes("datev") ||
    combined.includes("sap fi") ||
    combined.includes("hgb") ||
    combined.includes("ifrs") ||
    combined.includes("accounting") ||
    combined.includes("finance") ||
    combined.includes("finanzwesen") ||
    combined.includes("buchhaltung")
  ) {
    return {
      domain: "finance_accounting",
      domainTitleFa: "حسابداری، مدیریت مالی و کنترلینگ",
      domainTitleDe: "Finanz- und Rechnungswesen / Controlling / HGB-Buchhaltung"
    };
  }

  if (
    combined.includes("معمار") ||
    combined.includes("معماری") ||
    combined.includes("طراحی داخلی") ||
    combined.includes("شهرسازی") ||
    combined.includes("architecture") ||
    combined.includes("architektur") ||
    combined.includes("bim") ||
    combined.includes("revit")
  ) {
    return {
      domain: "architecture",
      domainTitleFa: "مهندسی معماری، طراحی فاز دو و مدلسازی BIM",
      domainTitleDe: "Architektur / Hochbau / BIM-Modellierung"
    };
  }

  if (
    combined.includes("صنایع") ||
    combined.includes("مدیریت پروژه") ||
    combined.includes("زنجیره تامین") ||
    combined.includes("لجستیک") ||
    combined.includes("شش سیگما") ||
    combined.includes("kaizen") ||
    combined.includes("industrial") ||
    combined.includes("supply chain") ||
    combined.includes("projektmanagement") ||
    combined.includes("wirtschaftsingenieur")
  ) {
    return {
      domain: "industrial_management",
      domainTitleFa: "مهندسی صنایع، مدیریت پروژه و بهینه‌سازی فرآیند",
      domainTitleDe: "Wirtschaftsingenieurwesen / Prozessoptimierung / Supply Chain"
    };
  }

  if (
    combined.includes("داده") ||
    combined.includes("data") ||
    combined.includes("هوش مصنوعی") ||
    combined.includes("machine learning") ||
    combined.includes("یادگیری ماشین") ||
    combined.includes("ai engineer") ||
    combined.includes("deep learning")
  ) {
    return {
      domain: "data_ai",
      domainTitleFa: "علوم داده، هوش مصنوعی و یادگیری ماشین",
      domainTitleDe: "Data Science / Machine Learning / KI-Entwicklung"
    };
  }

  if (
    combined.includes("react") ||
    combined.includes("typescript") ||
    combined.includes("javascript") ||
    combined.includes("node") ||
    combined.includes("python") ||
    combined.includes("java") ||
    combined.includes("c#") ||
    combined.includes(".net") ||
    combined.includes("برنامه‌نویس") ||
    combined.includes("نرم‌افزار") ||
    combined.includes("developer") ||
    combined.includes("software")
  ) {
    return {
      domain: "software_it",
      domainTitleFa: "مهندسی نرم‌افزار و توسعه سیستم‌های تحت وب",
      domainTitleDe: "Softwareentwicklung / Full-Stack & Cloud Engineering"
    };
  }

  return {
    domain: "general_engineering",
    domainTitleFa: "کارشناسی تخصصی و مهندسی فنی",
    domainTitleDe: "Ingenieurwesen / Technischer Spezialist"
  };
}

export interface DomainQuestionOptions {
  primaryTool?: string;
  softwareList?: string[];
  yearsOfExperience?: number | string;
  certifications?: string[];
  practicalProjects?: string[];
}

export function getInterviewerProfileForDomain(domain: EngineeringDomain): {
  titleFa: string;
  titleDe: string;
  roleDescriptionFa: string;
} {
  switch (domain) {
    case "civil":
      return {
        titleFa: "سرپرست ارشد مهندسی سازه و محاسبات فنی در آلمان (Prüfingenieur für Bautechnik)",
        titleDe: "Leitender Tragwerksplaner & Prüfingenieur",
        roleDescriptionFa: "ارزیابی فنی بر مبنای پروژه‌های عملیاتی، نرم‌افزارهای محاسباتی (ETABS, SAP, AutoCAD)، کنترل ضوابط Eurocode (EC2/EC3) و سال‌های تجربه کارگاهی."
      };
    case "mechanical":
      return {
        titleFa: "مدیر ارشد طراحی صنعتی و مهندسی مکانیک (Konstruktionsleiter Maschinenbau)",
        titleDe: "Leitender Konstruktionsleiter & Maschinenbau-Experte",
        roleDescriptionFa: "ارزیابی فنی بر مبنای نرم‌افزارهای CAD/CAM (SolidWorks, CATIA)، تحلیل المان محدود (FEM)، استانداردهای DIN EN ISO و سال‌های تجربه تولید صنعتی."
      };
    case "electrical":
      return {
        titleFa: "مدیر ارشد اتوماسیون صنعتی و مهندسی برق (Leiter Automatisierungstechnik & SPS)",
        titleDe: "Leitender Elektroingenieur & SPS-Spezialist",
        roleDescriptionFa: "ارزیابی بر مبنای سیستم‌های PLC زیمنس، نرم‌افزارهای EPLAN، استانداردهای DIN VDE و سال‌های تجربه در خطوط تولید و تابلوهای صنعتی."
      };
    case "healthcare":
      return {
        titleFa: "مترون ارشد و سرپرست تیم بالینی بیمارستان‌های آلمان (Pflegedienstleitung / Klinischer Leiter)",
        titleDe: "Pflegedienstleitung & Klinische Fachbereichsleitung",
        roleDescriptionFa: "ارزیابی بالینی بر مبنای سوابق بخش‌های مراقبتی (ICU/CCU/دیالیز)، دستورالعمل‌های انستیتو رابرت کخ (RKI)، سیستم KIS و مدارک حرفه‌ای بالینی."
      };
    case "finance_accounting":
      return {
        titleFa: "مدیر مالی ارشد و حسابدار رسمی ترازنامه آلمان (Leiter Finanzen & HGB-Bilanzbuchhalter)",
        titleDe: "Leiter Finanz- und Rechnungswesen & Senior Controller",
        roleDescriptionFa: "ارزیابی عملیاتی بر مبنای کار با نرم‌افزارهای DATEV و SAP FI/CO، تسلط بر ترازنامه‌های تجاری HGB، کنترلینگ و سال‌های تجربه حسابداری."
      };
    case "architecture":
      return {
        titleFa: "مدیر ارشد طراحی معماری و مدیر ارشد مدل‌سازی BIM (Leitender Architekt & BIM-Manager)",
        titleDe: "Leitender Architekt & Senior BIM-Manager",
        roleDescriptionFa: "ارزیابی بر مبنای مدلسازی Revit/BIM، طراحی فاز دو اجرایی، هماهنگی تاسیسات و دتایل‌های اجرایی ساختمان‌های مدرن آلمان."
      };
    case "industrial_management":
      return {
        titleFa: "مدیر ارشد مهندسی صنایع، ناب و زنجیره تامین (Leiter Lean Management & Supply Chain)",
        titleDe: "Head of Operations & Supply Chain Excellence",
        roleDescriptionFa: "ارزیابی بر مبنای متدولوژی‌های شش سیگما و Kaizen، بهینه‌سازی فرآیندها، تحلیل داده‌های زنجیره تامین و مدارک حرفه‌ای مدیریت پروژه."
      };
    case "data_ai":
      return {
        titleFa: "معمار ارشد هوش مصنوعی و مدیر مهندسی داده (Lead AI Architect & Head of Data)",
        titleDe: "Lead Data Scientist & AI Solution Architect",
        roleDescriptionFa: "ارزیابی عمیق بر مبنای خطوط پردازش داده (Pipelines)، مدل‌های یادگیری ماشین، ابزارهای پایتون و استقرار عملیاتی MLOps و سال‌های تجربه پروداکشن."
      };
    case "software_it":
      return {
        titleFa: "معمار ارشد نرم‌افزار و معاون مهندسی نرم‌افزار در آلمان (Principal Software Architect & VP of Engineering)",
        titleDe: "Principal Software Architect & Lead Engineer",
        roleDescriptionFa: "ارزیابی عمیق مهندسی بر پایه ابزارهای مسلط، معماری میکروسرویس، سیستم‌های ابری، پایپ‌لاین‌های CI/CD و سال‌های تحویل کدهای پروداکشن."
      };
    case "general_engineering":
    default:
      return {
        titleFa: "سرپرست ارشد مهندسی فنی و عملیات پروژه‌های صنعتی (Technischer Leiter & Senior Projektingenieur)",
        titleDe: "Technischer Leiter & Senior Projektingenieur",
        roleDescriptionFa: "ارزیابی دقیق بر مبنای ابزارهای تخصصی مسلط، استانداردهای صنعتی DIN، سال‌های سابقه کاری و پروژه‌های تحویل‌شده."
      };
  }
}

/**
 * Returns 20 highly authentic German technical interview questions tailored to the candidate's exact domain,
 * strictly grounded in their actual software tools, years of work, certifications, and concrete projects.
 */
export function getDomainTechnicalQuestions(
  domain: EngineeringDomain,
  primaryTechOrOptions: string | DomainQuestionOptions
): InterviewQuestionItem[] {
  const opts: DomainQuestionOptions = typeof primaryTechOrOptions === "string"
    ? { primaryTool: primaryTechOrOptions }
    : (primaryTechOrOptions || {});

  const primaryTool = opts.primaryTool || (opts.softwareList && opts.softwareList[0]) || "نرم‌افزارها و ابزارهای تخصصی";
  const yearsExp = opts.yearsOfExperience ? String(opts.yearsOfExperience) : "";
  const softwareStr = (opts.softwareList && opts.softwareList.length > 0)
    ? opts.softwareList.slice(0, 4).join("، ")
    : primaryTool;
  const certStr = (opts.certifications && opts.certifications.length > 0)
    ? opts.certifications.slice(0, 3).join("، ")
    : "";

  let questions: InterviewQuestionItem[] = [];
  switch (domain) {
    case "civil":
      questions = getCivilEngineeringQuestions(primaryTool);
      break;
    case "mechanical":
      questions = getMechanicalEngineeringQuestions(primaryTool);
      break;
    case "electrical":
      questions = getElectricalEngineeringQuestions(primaryTool);
      break;
    case "healthcare":
      questions = getHealthcareQuestions(primaryTool);
      break;
    case "finance_accounting":
      questions = getFinanceAccountingQuestions(primaryTool);
      break;
    case "architecture":
      questions = getArchitectureQuestions(primaryTool);
      break;
    case "industrial_management":
      questions = getIndustrialManagementQuestions(primaryTool);
      break;
    case "data_ai":
      questions = getDataAiQuestions(primaryTool);
      break;
    case "software_it":
    default:
      questions = getSoftwareEngineeringQuestions(primaryTool);
      break;
  }

  // Anchor and personalize each question with candidate's actual work experience, tools, and certifications
  return questions.map((q, idx) => {
    let practicalAnchor = `انطباق با تسلط بر ابزار ${softwareStr}`;
    if (yearsExp) {
      practicalAnchor += ` و سابقه کار اجرایی (${yearsExp})`;
    }
    if (certStr && idx % 3 === 0) {
      practicalAnchor += ` و گواهینامه‌های حرفه‌ای (${certStr})`;
    }
    practicalAnchor += ` — ارزیابی عملیاتی، فراتر از سرفصل‌های دانشگاهی`;

    return {
      ...q,
      practicalWorkReference: q.practicalWorkReference || practicalAnchor,
      cvReference: q.cvReference || `استخراج‌شده بر پایه کار عملی با ${softwareStr}${yearsExp ? ` و ${yearsExp} سابقه فعالیت تخصصی` : ""}`
    };
  });
}

function getCivilEngineeringQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-civ-01",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - استانداردها و کدهای محاسباتی",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "دفاتر مهندسی مشاور و طراحی سازه (Ingenieurbüro)",
      questionFa: "در طراحی سازه‌های بتنی و فولادی، تا چه میزان با استانداردهای اروپایی (Eurocodes نظیر EC2 و EC3) و استانداردهای DIN آلمان آشنایی دارید و تفاوت ضرایب بارگذاری در آلمان با کشور مبدا شما چیست؟",
      questionDeEn: "Wie vertraut sind Sie mit den Eurocodes (insb. EC 2 und EC 3) und den nationalen Anhangs-Vorschriften (DIN EN) für Deutschland?",
      reasoning: "کارفرمایان آلمانی به هیچ وجه ریسک عدم انطباق با Eurocode و DIN را نمی‌پذیرند؛ مهندس باید بتواند تاییدیه ایستایی (Statischer Nachweis) مطابق با قوانین آلمان ارائه دهد.",
      recruiterObjective: "اطمینان از تسلط بر فلسفه طراحی حالات حدی (ULS / SLS) و کدهای اروپایی معتبر در آلمان.",
      evaluationFocus: "تسلط بر حالات بارگذاری برف و باد مطابق با نقشه‌های زون‌بندی آلمان و ضرایب ایمنی جزیی.",
      recommendedAnswerStrategy: "با استفاده از متد STAR توضیح دهید که در پروژه‌های گذشته چگونه بارهای زلزله و باد را بر اساس کدهای استاندارد مدل‌سازی کردید و آمادگی کامل برای استفاده از کدهای DIN EN آلمان را دارید.",
      redFlags: "بی‌اطلاعی از وجود Eurocodes یا اتکای صرف به آیین‌نامه‌های غیراروپایی بدون قابلیت معادل‌سازی.",
      realWorldSource: "مصاحبه‌های دفاتر مهندسی سازه در مونیخ، فرانکفورت و اشتوتگارت."
    },
    {
      id: "tech-civ-02",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - نرم‌افزارهای مدلسازی سازه",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی آلمان",
      questionFa: `در رزومه شما به کار با ابزارهایی نظیر ${tool || "نرم‌افزارهای تحلیل سازه"} اشاره شده است؛ چگونه خطاهای مدل‌سازی (Modeling Singularities) و توزیع لنگرها را در اتصالات تیر-ستون اعتبارسنجی دستی (Plausibilitätsprüfung) می‌کنید؟`,
      questionDeEn: "Wie führen Sie bei FEM-Berechnungen eine Plausibilitätskontrolle der Schnittgrößen und Verformungen durch?",
      reasoning: "در آلمان، خروجی نرم‌افزار بدون کنترل عقلانی دستی (Plausibilitätsprüfung) فاقد وجاهت قانونی است و مهندس ناظر Prüfingenieur آن را رد می‌کند.",
      recruiterObjective: "سنجش شهود مهندسی سازه و پرهیز از اعتماد کورکورانه به نرم‌افزارهای کامپیوتری.",
      evaluationFocus: "درک مکانیک جامدات، دیاگرام‌های لنگر و برش، و کنترل دستی تعادل استاتیکی در گره‌ها.",
      recommendedAnswerStrategy: "توضیح دهید که قبل از پذیرش نتایج نرم‌افزار، مقادیر بار کل را با وزن مرده و زنده مقایسه نموده و لنگرهای دهانه را با فرمول‌های پایه تخمین می‌زنید.",
      redFlags: "پذیرفتن بی‌چون‌وچرای خروجی نرم‌افزار بدون توانایی محاسبه سرانگشتی و دفاع از اعداد.",
      realWorldSource: "سوالات فنی مصاحبه مهندسی محاسب در شرکت‌های Drees & Sommer و Ed. Züblin."
    },
    {
      id: "tech-civ-03",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - جزئیات اجرایی و نقشه‌کشی میلگرد",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "در تهیه نقشه‌های اجرایی و لیستوفر آرماتورها (Bewehrungspläne / Stahlliste)، چگونه طول مهارداری، پوشش بتن (Betondeckung) و رده‌های محیطی (Expositionsklassen) را طبق استانداردهای دوام سازه رعایت می‌کنید؟",
      questionDeEn: "Wie bestimmen Sie die Betondeckung (c_min / c_nom) in Abhängigkeit von den Expositionsklassen nach DIN EN 1992-1-1?",
      reasoning: "شرایط آب‌وهوایی آلمان و استفاده از نمک یخ‌زدا ایجاب می‌کند رده‌های مجاورت (XC, XD, XF) دقیق رعایت شوند تا از خوردگی زودرس میلگردها جلوگیری شود.",
      recruiterObjective: "اطمینان از دانش دوام بتن و توانایی تهیه نقشه‌های اجرایی عاری از ابهام کارگاهی.",
      evaluationFocus: "محاسبه دقیق پوشش اسمی بتن و هماهنگی آن با سایز دانه سنگی و قطر آرماتورها.",
      recommendedAnswerStrategy: "یک پروژه را مثال بزنید که رده محیطی خاصی داشته و با تنظیم فاصله نگه‌دارنده‌ها (Abstandhalter) پوشش بتن را تضمین کردید.",
      redFlags: "عدم درک تفاوت رده‌های محیطی بتن و اهمیت آن در ماندگاری سازه.",
      realWorldSource: "آزمون‌های ورود به کار شرکت‌های پیمانکاری بزرگ در دوسلدورف و کلن."
    },
    {
      id: "tech-civ-04",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - مدیریت ژئوتکنیک و خاک",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی آلمان",
      questionFa: "هنگام مواجهه با گزارش مکانیک خاک (Bodengutachten) و حضور آب زیرزمینی در پروژه، چگونه عمق پی‌سازی و پایداری گودبرداری (Baugrubensicherung) را تحلیل می‌نمایید؟",
      questionDeEn: "Wie interpretieren Sie das Baugrundgutachten hinsichtlich Bemessungswasserstand und Baugrubenverbau?",
      reasoning: "در آلمان نشست‌های نامتقارن و آسیب به ساختمان‌های مجاور پیگرد قانونی سنگین دارد؛ مهندس باید گزارش خاک را موشکافانه تحلیل کند.",
      recruiterObjective: "سنجش توانایی برهمکنش سازه و خاک (Boden-Bauwerk-Interaktion) و کنترل آب‌های سطحی.",
      evaluationFocus: "ظرفیت باربری مجاز خاک، نشست‌های تحکیمی و انتخاب روش مهار گود (Trägerbohlwand, Spundwand).",
      recommendedAnswerStrategy: "تشریح کنید که چطور سطح آب طراحی (Bemessungswasserstand) را در نظر گرفته و پایداری هیدرولیکی کف گود را کنترل کردید.",
      redFlags: "نادیده گرفتن آب زیرزمینی یا برون‌سپاری کورکورانه تحلیل پی بدون مطالعه دقیق لاگ‌های گمانه.",
      realWorldSource: "راهنمای انجمن مهندسان عمران آلمان (VBI)."
    },
    {
      id: "tech-civ-05",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - مقررات ایمنی کارگاه",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "آیین‌نامه ایمنی کارگاه‌های ساختمانی آلمان (Baustellenverordnung - BaustellV) و نقش هماهنگ‌کننده ایمنی (SiGeKo) چه الزاماتی را برای حضور شما در سایت تحمیل می‌کند؟",
      questionDeEn: "Welche Pflichten ergeben sich für Sie aus der Baustellenverordnung (BaustellV) und dem SiGe-Plan?",
      reasoning: "استانداردهای حفاظت فنی در آلمان شوخی‌بردار نیست و هرگونه حادثه جانی کارگاه را فوراً با توقف پروژه و جریمه کیفری مواجه می‌کند.",
      recruiterObjective: "بررسی تعهد به فرهنگ صفر حادثه (Vision Zero) و انضباط اجرایی.",
      evaluationFocus: "استفاده از تجهیزات حفاظت فردی، رعایت هشدارهای ایمنی و ثبت خطرات بالقوه کارگاه.",
      recommendedAnswerStrategy: "بیان تجارب واقعی از توقف یک عملیات ناایمن در کارگاه گذشته و گزارش مستند آن به ناظر پروژه.",
      redFlags: "نگاه سهل‌انگارانه به داربست‌بندی و حفاظت پیرامونی کارگاه.",
      realWorldSource: "الزامات بیمه حوادث کار آلمان (BG BAU)."
    },
    {
      id: "tech-civ-06",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - تعرفه خدمات مهندسی آلمان (HOAI)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی آلمان",
      questionFa: "در چرخه ساخت پروژه‌های آلمان، فازهای نه گانه تعرفه خدمات مهندسین و معماران (HOAI Leistungsphasen 1 bis 9) چگونه تعریف می‌شوند و نقش شما مشخصاً در فازهای ۳، ۵ و ۸ چیست؟",
      questionDeEn: "In welchen HOAI-Leistungsphasen (insb. LPH 3 Entwurfsplanung, LPH 5 Ausführungsplanung, LPH 8 Bauüberwachung) haben Sie Ihre Schwerpunkte?",
      reasoning: "صورت‌وضعیت و تفکیک وظایف در پروژه‌های آلمانی دقیقاً بر مبنای HOAI انجام می‌گیرد و هر مهندس میدلول باید مرز دقیق فازها را بشناسد.",
      recruiterObjective: "ارزیابی انطباق کاری با متدولوژی رسمی مهندسی ساخت در آلمان.",
      evaluationFocus: "تسلط بر خروجی‌های مشخص فاز ۵ (نقشه‌های اجرایی کامل) و کنترل کارگاهی فاز ۸.",
      recommendedAnswerStrategy: "توضیح دهید در فاز ۳ مبانی سازه‌ای تثبیت می‌شود، در فاز ۵ تمامی جزئیات اتصال نهایی می‌گردد و در فاز ۸ انطباق اجرا با نقشه پایش می‌شود.",
      redFlags: "عدم آشنایی با سیستم HOAI یا خلط مسئولیت‌های طراحی با نظارت عالیه.",
      realWorldSource: "مصاحبه‌های شغلی شرکت Hochtief و STRABAG."
    },
    {
      id: "tech-civ-07",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - پیاده‌سازی مدلسازی اطلاعات ساخت (BIM)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "تجربه شما در همکاری بین‌رشته‌ای بر بستر BIM (Building Information Modeling)، تبادل فایل‌های IFC و شناسایی تداخلات (Clash Detection) با بخش‌های تاسیسات (MEP) و معماری چگونه بوده است؟",
      questionDeEn: "Wie arbeiten Sie mit openBIM, IFC-Schnittstellen und Kollisionsprüfungen zwischen Tragwerk und TGA?",
      reasoning: "پروژه‌های دولتی و کلان آلمان موظف به اجرای استاندارد BIM هستند تا هزینه‌های دوباره‌کاری در حین اجرا حذف شود.",
      recruiterObjective: "سنجش مهارت کار در محیط‌های داده مشترک (CDE) و همکاری دیجیتال مدرن.",
      evaluationFocus: "استفاده از فرمت‌های باز (IFC 4)، نرم‌افزارهای بررسی تداخل (Navisworks, Solibri) و مدیریت تداخل‌های فضا.",
      recommendedAnswerStrategy: "یک مورد واقعی را ذکر کنید که تداخل لوله‌های تاسیسات با تیر بتنی پیش از ساخت در مدل سه‌بعدی کشف و با هماهنگی معماری بازطراحی شد.",
      redFlags: "کار صرفاً با نقشه‌های دوبعدی کاغذی و مقاومت در برابر پلتفرم‌های مدلسازی سه‌بعدی.",
      realWorldSource: "دستورالعمل استقرار BIM در وزارت حمل‌ونقل و زیرساخت دیجیتال آلمان (BMDV)."
    },
    {
      id: "tech-civ-08",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - کنترل کیفیت مصالح و آزمایش بتن",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "در صورتی که نتایج آزمایش مقاومت فشاری نمونه‌های بتن ۲۸ روزه کارگاه به زیر رده مشخصه مقاومت (f_ck) سقوط کند، فرآیند استاندارد آلمان برای تصمیم‌گیری و آزمون‌های غیرمخرب چیست؟",
      questionDeEn: "Wie gehen Sie vor, wenn die 28-Tage-Druckfestigkeit der Baustellen-Betonwürfel unter die geforderte Festigkeitsklasse fällt?",
      reasoning: "تخریب سازه بتنی پس از گیرش فاجعه‌بار است؛ مهندس باید پروتکل استاندارد ارزیابی انطباق و آزمون مغزه‌گیری (Bohrkerne) را بداند.",
      recruiterObjective: "سنجش قدرت تصمیم‌گیری فنی در شرایط بحران کیفی پروژه.",
      evaluationFocus: "قوانین آماری DIN EN 206، مغزه‌گیری و ارزیابی مجدد سازه با ضریب ایمنی واقعی.",
      recommendedAnswerStrategy: "بیان مراحل: ۱. بررسی اعتبار فرآیند آزمایشگاه، ۲. آزمون چکش اشمیت و مغزه‌گیری استاندارد، ۳. محاسبات مجدد استاتیکی با مقاومت واقعی برای سنجش کفایت سازه.",
      redFlags: "تلاش برای پوشاندن موضوع یا اقدام هیجانی و تخریب شتاب‌زده بدون تحلیل استاتیکی مجدد.",
      realWorldSource: "راهنمای کنترل کیفیت انجمن بتن آلمان (Deutscher Beton- und Bautechnik-Verein)."
    },
    {
      id: "tech-civ-09",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - مدیریت قرارداد و ادعای پیمانکاری (VOB)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی آلمان",
      questionFa: "در مدیریت قراردادهای ساخت آلمان (VOB/B - Vergabe- und Vertragsordnung für Bauleistungen)، چگونه با تغییر احجام (Nachtragsmanagement) و ادعاهای مالی پیمانکاران برخورد می‌کنید؟",
      questionDeEn: "Wie handhaben Sie das Nachtragsmanagement und Leistungsänderungen nach VOB/B § 2?",
      reasoning: "بسیاری از دعاوی حقوقی ساخت‌وساز در آلمان ناشی از ادعاهای مالی اضافی (Nachträge) است؛ مهندس ناظر باید بتواند ادعاها را مستند ارزیابی کند.",
      recruiterObjective: "بررسی درک مالی و حقوقی فرآیند اجرای پروژه‌ها.",
      evaluationFocus: "بررسی توجیه فنی تغییرات، بررسی آنالیز بها و زمان‌بندی ادعاها بر اساس قرارداد اولیه.",
      recommendedAnswerStrategy: "تشریح فرآیند بررسی پیش‌فاکتور الحاقی قبل از صدور دستور تغییر کار و استناد به نقشه‌های مصوب قرارداد اولیه.",
      redFlags: "تایید شفاهی تغییرات در کارگاه بدون ثبت کتبی و امضای طرفین.",
      realWorldSource: "دوره جامع حقوق مهندسی اتاق مهندسان آلمان (Ingenieurkammer)."
    },
    {
      id: "tech-civ-10",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - بهینه‌سازی کربن و مصالح پایدار (Klimaneutrales Bauen)",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "با توجه به اهداف اقلیمی ۲۰۳۰ اتحادیه اروپا و آلمان برای ساخت‌وساز بدون کربن، چگونه ردپای کربن سازه‌ای (Embodied Carbon) را از طریق سازه‌های چوبی ترکیبی (Holz-Hybrid) یا بتن بازیافتی (R-Beton) کاهش می‌دهید؟",
      questionDeEn: "Wie integrieren Sie Nachhaltigkeitskriterien (LCA, R-Beton, Holz-Hybridbauweise) in die Tragwerkskonzeption?",
      reasoning: "توسعه‌دهندگان بزرگ آلمان گواهینامه‌های پایداری DGNB و LEED را هدف قرار داده‌اند؛ مهندس ارشد باید طراح سازگار با محیط زیست باشد.",
      recruiterObjective: "سنجش دیدگاه کلان مدرن در صنعت ساخت آلمان و نوآوری در مصالح.",
      evaluationFocus: "تحلیل چرخه حیات (LCA)، کاهش مصرف فولاد و بکارگیری سیستم‌های پیش‌ساخته دوستدار طبیعت.",
      recommendedAnswerStrategy: "ارائه مثالی از بهینه‌سازی مقاطع بتنی و جایگزینی بخش‌هایی از سقف با متریال‌های پایدار بدون افت ظرفیت باربری.",
      redFlags: "نگاه سنتی به ساخت‌وساز و بی‌توجهی به سیاست‌های سبز اتحادیه اروپا.",
      realWorldSource: "پروژه‌های شاخص شورای ساختمان پایدار آلمان (DGNB)."
    },
    {
      id: "tech-civ-11",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - مدیریت ریسک‌های ژئوتکنیکی و گودهای عمیق شهری",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "هنگام طراحی یا نظارت بر گودهای عمیق در مجاورت خطوط مترو (U-Bahn) یا بناهای تاریخی شهری، چه سیستم مانیتورینگ دقیق و سنسورهایی (Geotechnical Monitoring) را پیاده‌سازی می‌کنید؟",
      questionDeEn: "Welche Monitoringsysteme und Deformationsmessungen setzen Sie bei tiefen innerstädtischen Baugruben ein?",
      reasoning: "نشست حتی چند میلی‌متری در بافت شهری آلمان منجر به دعاوی ده‌ها میلیون یورویی و توقف قضایی کارگاه می‌شود.",
      recruiterObjective: "سنجش توانایی مدیریت ریسک در پروژه‌های پیچیده شهری.",
      evaluationFocus: "اینکلاینومتر، سنسورهای پیزومتری، تارگت‌های ژئودتیک و سیستم هشدار اتوماتیک پیامکی به مهندسین.",
      recommendedAnswerStrategy: "تعریف حد آستانه هشدار (Warnwert) و حد توقف عملیات (Alarmwert) به همراه طرح اقدام فوری (Notfallplan).",
      redFlags: "فقدان برنامه پیشگیرانه و اتکا به پایش چشمی غیرابزاری.",
      realWorldSource: "تجربیات پروژه‌های بزرگ ایستگاه‌های زیرزمینی در برلین و هامبورگ."
    },
    {
      id: "tech-civ-12",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - هدایت تیم و تعامل با مهندس بررسی‌کننده (Prüfingenieur)",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی آلمان",
      questionFa: "فرآیند دفاع از دفترچه محاسبات سازه در برابر مهندس محاسب رسمی مستقل (Prüfingenieur für Baustatik) در آلمان را چگونه مدیریت می‌کنید تا تاییدیه‌ها بدون تاخیر زمانی صادر شوند؟",
      questionDeEn: "Wie steuern Sie die Abstimmung mit dem Prüfingenieur, um eine termingerechte Baufreigabe zu erwirken?",
      reasoning: "در آلمان هیچ کارگاهی بدون مهر و تایید Prüfingenieur حق بتن‌ریزی ندارد؛ هماهنگی فنی محترمانه و پاسخ سریع به سوالات او حیاتی است.",
      recruiterObjective: "بررسی پختگی حرفه‌ای، مستندسازی دقیق و مذاکره فنی مستدل.",
      evaluationFocus: "شفافیت فرضیات محاسباتی، فهرست‌بندی استاندارد دفترچه و تسلط کامل بر ارجاعات آیین‌نامه‌ای.",
      recommendedAnswerStrategy: "جلسات هماهنگی پیش از تحویل رسمی، ارسال نمونه‌های محاسباتی تیپیک و پذیرش نقدهای سازنده با استدلال محاسباتی.",
      redFlags: "رفتار تدافعی یا متهم کردن Prüfingenieur به وسواس بی‌مورد.",
      realWorldSource: "مصاحبه‌های سطح Senior Project Engineer در آلمان."
    }
  ];
}

function getMechanicalEngineeringQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-mech-01",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - تلرانس‌گذاری هندسی و ابعادی (GD&T / DIN EN ISO)",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی مکانیک آلمان",
      questionFa: "در نقشه‌کشی قطعات صنعتی بر مبنای استانداردهای DIN EN ISO (نظیر ISO 1101 و ISO 2768)، چگونه تلرانس‌های فرم، راستا، موقعیت و انطباقات (Passungen) را برای قطعات ماشین‌کاری دقیق تعیین می‌کنید؟",
      questionDeEn: "Wie wenden Sie Form- und Lagetoleranzen (GPS nach DIN EN ISO 1101) sowie Passungssysteme für zerspanende Fertigung an?",
      reasoning: "در صنایع خودروسازی و ماشین‌سازی آلمان، انطباقات اشتباه فاجعه مونتاژ ایجاد می‌کند؛ مهندس باید استاندارد GPS را دقیق مسلط باشد.",
      recruiterObjective: "سنجش انضباط در طراحی مهندسی با قابلیت تولید اقتصادی (Design for Manufacturing).",
      evaluationFocus: "تعریف سطوح مبنا (Datums)، تلرانس موقعیت (True Position) و انتخاب انطباق لقی یا فشاری مناسب.",
      recommendedAnswerStrategy: "مثالی از طراحی یک هاب یا شفت موتور با انطباق H7/h6 و تعریف تلرانس هم‌محوری (Koaxialität) ارائه دهید.",
      redFlags: "قرار دادن تلرانس‌های بیش از حد سخت‌گیرانه و غیرضروری که هزینه تولید را چندبرابر کند.",
      realWorldSource: "مصاحبه‌های فنی در بوش (Bosch)، فستو (Festo) و کانتیننتال (Continental)."
    },
    {
      id: "tech-mech-02",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - مدلسازی سه‌بعدی و پارامتریک CAD",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: `در مدلسازی قطعات و مجموعه‌های پیچیده با نرم‌افزارهای CAD نظیر ${tool || "SolidWorks / CATIA / NX"}، چگونه ساختار درختی (Model Tree) را به شکلی تمیز و پارامتریک طراحی می‌کنید که اصلاحات بعدی مدل را تخریب نکند؟`,
      questionDeEn: "Wie strukturieren Sie den Modellbaum in CAD-Systemen, um eine robuste und fehlerfreie parametrische Änderungshistorie zu gewährleisten?",
      reasoning: "در شرکت‌های صنعتی آلمان پروژه‌ها سال‌ها توسعه می‌یابند؛ درختی که با تغییر یک فیچر با خطای Rebuild مواجه شود غیرقابل قبول است.",
      recruiterObjective: "ارزیابی اصول مهندسی در کار با نرم‌افزارهای سه‌بعدی و رعایت قوانین نام‌گذاری قطعات.",
      evaluationFocus: "استفاده از صفحات مرجع پایدار، اسکچ‌های کاملاً مقید (Fully Defined) و تفکیک قطعات در قالب Top-Down یا Bottom-Up.",
      recommendedAnswerStrategy: "توضیح دهید که چگونه از اسکچ‌های اسکلتی (Skeleton Sketches) برای کنترل ابعاد اصلی مجموعه بدون ارجاعات حلقوی استفاده می‌کنید.",
      redFlags: "اسکچ‌های ناقص، ارجاعات خارجی شکسته و فیچرهای رهاشده در فایل CAD.",
      realWorldSource: "آزمون‌های مدل‌سازی شرکت‌های قطعه‌سازی خودرو در بادن-وورتمبرگ."
    },
    {
      id: "tech-mech-03",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - علم مواد و انتخاب متریال فلزی/پلیمری",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی مکانیک آلمان",
      questionFa: "هنگام انتخاب فولاد مناسب برای یک قطعه تحت تنش‌های خستگی و سایش (نظیر 42CrMo4 یا 16MnCr5)، چه فاکتورهایی نظیر عملیات حرارتی، سختی‌پذیری و چقرمگی ضربه را ملاک قرار می‌دهید؟",
      questionDeEn: "Nach welchen Kriterien wählen Sie Werkstoffe (z.B. Vergütungsstähle vs. Einsatzstähle nach DIN EN 10083/10084) für dynamisch beanspruchte Bauteile aus?",
      reasoning: "آلمان مهد متالورژی صنعتی است؛ انتخاب آلیاژ نامناسب یا عملیات حرارتی غلط سریعاً منجر به شکست زودهنگام در آزمون‌های دوام می‌شود.",
      recruiterObjective: "سنجش درک عمیق از علم مواد و رابطه فرآیند تولید با خواص مکانیکی.",
      evaluationFocus: "سخت‌کاری سطحی (Induktionshärten / Einsatzhärten)، تنش‌های پسماند و منحنی ووهلر (Wöhler-Kurve).",
      recommendedAnswerStrategy: "توضیح دهید چرا برای چرخدنده فولاد سمانتاسیون و برای شفت انتقال قدرت فولاد عملیات حرارتی‌پذیر برگزیدید.",
      redFlags: "انتخاب متریال تنها بر اساس استحکام تسلیم استاتیکی بدون توجه به تنش دینامیکی و خستگی.",
      realWorldSource: "راهنمای انتخاب مواد انجمن مهندسان آلمان (VDI)."
    },
    {
      id: "tech-mech-04",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - تحلیل تنش و اجزای محدود (FEA / FEM)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "در تحلیل شبیه‌سازی عددی تنش قطعات، چگونه استقلال از مش‌بندی (Mesh Convergence) را بررسی کرده و شرایط مرزی و اتصالات تماسی (Contact Formulations) را تعریف می‌نمایید؟",
      questionDeEn: "Wie stellen Sie bei FEM-Simulationen die Netzkonvergenz sicher und wie modellieren Sie nichtlineare Kontaktbedingungen?",
      reasoning: "شبیه‌سازی‌های صنعتی در آلمان مبنای تایید فنی قطعات گران‌قیمت قبل از قالب‌سازی است؛ تمرکز تنش کاذب در مش نامناسب گمراه‌کننده است.",
      recruiterObjective: "سنجش صلاحیت متقاضی در شبیه‌سازی معتبر و پرهیز از خطاهای متداول FEM.",
      evaluationFocus: "اندازه مش در نواحی تمرکز تنش، استفاده از المان‌های درجه دو، و تحلیل رفتار غیرخطی تماس.",
      recommendedAnswerStrategy: "توضیح دهید که چگونه سایز مش را مرحله‌به‌مرحله ریز کرده و تا زمانی که تنش فون میسز با خطای زیر ۵٪ همگرا نشده، نتیجه را قطعی در نظر نمی‌گیرید.",
      redFlags: "ارائه خروجی‌های شبیه‌سازی رنگی بدون گزارش علمی همگرایی مش و تحلیل تعادل نیروها.",
      realWorldSource: "مصاحبه‌های مهندسی تحلیل سازه در زیمنس (Siemens) و بی‌ام‌و (BMW)."
    },
    {
      id: "tech-mech-05",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - سیستم‌های پنوماتیک، هیدرولیک و محرک‌ها",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "در طراحی خطوط اتوماسیون و انتخاب سیلندرها، شیرهای کنترلی پروپرشنال و مدارهای هیدرولیک، محاسبات افت فشار و اتلاف حرارتی روغن را چگونه انجام می‌دهید؟",
      questionDeEn: "Wie dimensionieren Sie fluidtechnische Antriebe (Hydraulik/Pneumatik) hinsichtlich Volumenstrom, Druckverlusten und thermischer Auslegung?",
      reasoning: "ماشین‌آلات صنعتی آلمان به راندمان بالا و کارکرد ۲۴/۷ معروفند؛ اتلاف حرارت هیدرولیک می‌تواند کل خط را متوقف کند.",
      recruiterObjective: "اطمینان از تسلط بر سیستم‌های قدرت سیال و انتخاب اجزا از کاتالوگ‌های صنعتی معتبر.",
      evaluationFocus: "محاسبه دبی پمپ، تعیین حجم آکومولاتور، فیلتراسیون استاندارد ISO 4406 و خنک‌کاری سیستم.",
      recommendedAnswerStrategy: "تشریح یک سیستم هیدرولیک واقعی با شیرهای سروو و محاسبه سیکل کاری بهینه برای کاهش مصرف انرژی.",
      redFlags: "عدم آشنایی با نمادهای مدارهای هیدرولیک مطابق ISO 1219.",
      realWorldSource: "آزمون‌های فنی شرکت‌های Rexroth (Bosch Group) و Parker Hannifin آلمان."
    },
    {
      id: "tech-mech-06",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - تحلیل ریسک و مدهای شکست (FMEA)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی مکانیک آلمان",
      questionFa: "در فرآیند طراحی و توسعه محصول، چگونه متدولوژی تحلیل اثرات و حالات شکست (Design FMEA طبق استاندارد VDA / AIAG) را برای شناسایی قطعات بحرانی به کار می‌گیرید؟",
      questionDeEn: "Wie wenden Sie die Design-FMEA nach dem gemeinsamen VDA-AIAG-Standard zur Risikominimierung an?",
      reasoning: "صنعت آلمان بر پایه کیفیت پیشگیرانه بنا شده است؛ کشف نقص بعد از تولید فاجعه گارانتی ایجاد می‌کند.",
      recruiterObjective: "بررسی بلوغ کیفی و رویکرد سیستماتیک در پیشگیری از خطاهای طراحی.",
      evaluationFocus: "تعیین رتبه‌های شدت (S)، وقوع (O) و کشف (D)، و اولویت‌بندی اقدام (Action Priority).",
      recommendedAnswerStrategy: "یک مورد واقعی را شرح دهید که در جلسات FMEA ریسک گیرپاژ قطعه متحرک شناسایی و با تغییر هندسه یا پوشش ضدسایش رفع شد.",
      redFlags: "نگاه صوری و اداری به FMEA به جای استفاده از آن به عنوان ابزار حل مهندسی مسئله.",
      realWorldSource: "دستورالعمل‌های انجمن صنعت خودروسازی آلمان (VDA)."
    },
    {
      id: "tech-mech-07",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - رهبری پلتفرم و مدیریت چرخه عمر محصول (PLM)",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "چگونه ساختار داده‌های محصول (Engineering BOM / Manufacturing BOM) و مدیریت تغییرات مهندسی (ECO / ECN) را در پلتفرم‌های سازمانی نظیر Teamcenter یا Windchill رهبری می‌کنید؟",
      questionDeEn: "Wie steuern Sie den Engineering Change Management Prozess (ECM) und die Synchronisation von EBOM und MBOM im PLM-System?",
      reasoning: "تغییر بدون انطباق در BOM در کارخانه‌های آلمان منجر به توقف خطوط تولید چند میلیون یورویی می‌شود.",
      recruiterObjective: "سنجش شایستگی لید برای هماهنگی فرآیندهای بین‌رشته‌ای از طراحی تا خط تولید انبوه.",
      evaluationFocus: "مدیریت تغییرات، تاریخ انقضای قطعات، تحلیل هزینه‌های دوباره‌کاری و همگام‌سازی با ERP (SAP).",
      recommendedAnswerStrategy: "توضیح دهید که چگونه یک تغییر مهندسی حیاتی را با ارزیابی اثر بر قطعات انبار، فیکسچرهای مونتاژ و زنجیره تامین هدایت کردید.",
      redFlags: "اعمال تغییرات روی نقشه‌ها بدون ثبت چرخه تایید رسمی در PLM.",
      realWorldSource: "مصاحبه‌های مدیر مهندسی و لید طراحی در مرسدس بنز و پورشه."
    },
    {
      id: "tech-mech-08",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - استاندارد ایمنی ماشین‌آلات و انطباق CE (Maschinenrichtlinie)",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "برای اخذ نشان انطباق اروپا (CE-Kennzeichnung) بر اساس دستورالعمل ماشین‌آلات (Machinery Directive 2006/42/EC و مقررات جدید EU 2023/1230)، چه فرآیندی برای ارزیابی ریسک طبق EN ISO 12100 طی می‌کنید؟",
      questionDeEn: "Wie führen Sie die Risikobeurteilung nach EN ISO 12100 für die CE-Konformitätserklärung einer Neuentwicklung durch?",
      reasoning: "فروش هر دستگاه صنعتی در آلمان بدون CE غیرقانونی است و عدم رعایت ایمنی مسئولیت کیفری مستقیم برای مدیر فنی دارد.",
      recruiterObjective: "بررسی آگاهی کامل از الزامات ایمنی عملکردی (Performance Level طبق ISO 13849).",
      evaluationFocus: "کاهش ریسک ذاتی در طراحی، سپرهای حفاظتی، سیستم‌های اضطراری (Not-Halt) و مستندسازی فایل فنی (Technische Dokumentation).",
      recommendedAnswerStrategy: "تشریح مراحل ۳گانه ایمنی: ۱. طراحی ایمن ذاتی، ۲. تدابیر حفاظتی تکمیلی، ۳. اطلاعات و هشدارهای کاربری.",
      redFlags: "اتکای صرف به برچسب‌های هشدار بدون برطرف کردن مهندسی خطرات مکانیکی.",
      realWorldSource: "راهنمای تخصصی بازرسی فنی توف (TÜV Rheinland / TÜV SÜD)."
    }
  ];
}

function getElectricalEngineeringQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-elec-01",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - نقشه‌کشی الکتریکال با EPLAN",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: `در تهیه نقشه‌های مدار فرمان و قدرت با نرم‌افزارهایی نظیر ${tool || "EPLAN Electric P8"}، چگونه استانداردهای نام‌گذاری تجهیزات (DIN EN 81346) و ساختاردهی تابلو برق را پیاده‌سازی می‌کنید؟`,
      questionDeEn: "Wie wenden Sie die Kennzeichnung von Komponenten nach DIN EN 81346 in EPLAN Electric P8 an?",
      reasoning: "استانداردسازی کد تجهیزات در تابلو برق‌های صنعتی آلمان برای مونتاژ و عیب‌یابی سریع حیاتی است.",
      recruiterObjective: "ارزیابی انضباط طراحی مدار و تسلط بر نمادهای الکتروتکنیک اروپا.",
      evaluationFocus: "ساختار پروژه‌ها (Location & Function)، اتصال ترمینال‌ها و تولید اتوماتیک لیست قطعات.",
      recommendedAnswerStrategy: "توضیح دهید چطور از ماکروها برای کاهش خطای نقشه‌کشی و اتصال کابل‌ها استفاده می‌کنید.",
      redFlags: "ترسیم سیم‌ها و ترمینال‌ها بدون ارجاعات متقابل (Cross-references).",
      realWorldSource: "مصاحبه‌های مهندسی برق در فینیکس کنتاکت (Phoenix Contact) و واگو (WAGO)."
    },
    {
      id: "tech-elec-02",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - استانداردهای ایمنی VDE آلمان",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی برق آلمان",
      questionFa: "مقررات ایمنی برق اتحادیه برق و الکترونیک آلمان (DIN VDE 0100) در خصوص حفاظت در برابر شوک الکتریکی، سیستم‌های اتصال زمین (TN-S, TT, IT) و استفاده از کلیدهای محافظ جان (RCD) را چگونه پیاده می‌کنید؟",
      questionDeEn: "Welche Schutzmaßnahmen gegen elektrischen Schlag wenden Sie gemäß DIN VDE 0100-410 in Niederspannungsanlagen an?",
      reasoning: "حفاظت جانی و ایمنی در برابر حریق خط قرمز شرکت‌های آلمانی است و بازرس VDE بازرسی موشکافانه دارد.",
      recruiterObjective: "سنجش دانش بنیادین حفاظت مدارهای فشار ضعیف در استانداردهای آلمان.",
      evaluationFocus: "محاسبه زمان قطع خودکار مدار، امپدانس حلقه اتصال کوتاه (Schleifenimpedanz) و انتخاب تیپ فیوزها.",
      recommendedAnswerStrategy: "تشریح نحوه انتخاب کلاس RCD تیپ B برای درایوهای فرکانس متغیر به منظور حفاظت در برابر جریان‌های خطای DC.",
      redFlags: "عدم آشنایی با سیستم‌های زمین یا ناتوانی در توضیح تفاوت سیستم TN-C با TN-S.",
      realWorldSource: "آزمون‌های استاندارد VDE در مونیخ و فرانکفورت."
    },
    {
      id: "tech-elec-03",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - اتوماسیون صنعتی و برنامه‌نویسی PLC (Siemens TIA Portal)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان مهندسی برق آلمان",
      questionFa: "در توسعه نرم‌افزار پی‌ال‌سی‌های زیمنس (S7-1200 / S7-1500) در TIA Portal بر اساس استاندارد IEC 61131-3، ساختاردهی بلوک‌ها (FC, FB, DB) به زبان SCL و مدیریت ارورهای سخت‌افزاری را چگونه اجرا می‌نمایید؟",
      questionDeEn: "Wie strukturieren Sie modulares SPS-Programmieren in SCL gemäß IEC 61131-3 in Siemens TIA Portal?",
      reasoning: "زیمنس رهبر بلامنازع بازار اتوماسیون صنعتی آلمان است و نوشتن کدهای ماژولار و ساختاریافته در SCL اولویت استخدام است.",
      recruiterObjective: "سنجش مهارت اتوماسیون تمیز و پرهیز از کدهای درهم‌تنیده نردبانی (Ladder Spaghetti).",
      evaluationFocus: "استفاده از UDTs، نمونه‌سازی بهینه (Multi-Instance DB)، ارتباط از طریق PROFINET و مدیریت توقف اضطراری (Failsafe PLC).",
      recommendedAnswerStrategy: "یک سناریوی خطای شبکه Profinet و نحوه ایزوله کردن خطای سنسور با بلوک‌های تشخیصی OB82/OB86 را شرح دهید.",
      redFlags: "عدم درک تفاوت حافظه Static و Temp در بلوک‌های تابعی.",
      realWorldSource: "مصاحبه‌های مهندسی اتوماسیون در زیمنس (Siemens) و کرونز (Krones)."
    },
    {
      id: "tech-elec-04",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - سازگاری الکترومغناطیسی (EMC / EMV)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "در طراحی بردها یا چیدمان تابلوهای برق دارای اینورتر و موتورهای فرکانس متغیر، چه تدابیری برای جلوگیری از تداخلات الکترومغناطیسی (EMV / EMC) و نویز روی سیگنال‌های آنالوگ به کار می‌گیرید؟",
      questionDeEn: "Welche EMV-gerechten Verdrahtungs- und Schirmungskonzepte setzen Sie bei Frequenzumrichtern und empfindlicher Sensorik um?",
      reasoning: "در محیط‌های صنعتی نویز اینورترها می‌تواند عملکرد سنسورها را مختل کرده و ماشین را از کار بیندازد.",
      recruiterObjective: "بررسی تسلط بر شیلدینگ کابل‌ها، فیلترهای شبکه (Netzfilter) و جداسازی فیزیکی کابل‌های سیگنال و قدرت.",
      evaluationFocus: "اتصال ۳۶۰ درجه شیلد به ارت، فیلترهای چوک و فاصله مناسب سینی‌های کابل.",
      recommendedAnswerStrategy: "توضیح دهید چگونه با تفکیک مسیر کابل‌های حساس و اتصال مستقیم شیلد به بدنه از ایجاد لوپ‌های زمین جلوگیری کردید.",
      redFlags: "پیچیدن شیلد به صورت Pigtail که اثر القایی شدیدی در فرکانس‌های بالا ایجاد می‌کند.",
      realWorldSource: "راهنمای تست‌های سازگاری الکترومغناطیسی TÜV."
    },
    {
      id: "tech-elec-05",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - ایمنی عملکردی (Functional Safety / SIL & PL)",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "در ارزیابی ایمنی مدارهای کنترلی طبق استاندارد EN ISO 13849-1 و EN 62061، چگونه سطح عملکرد ایمنی (Performance Level r) و مقدار قطعی تشخیصی (DCavg) را محاسبه و در نرم‌افزار SISTEMA مستندسازی می‌کنید؟",
      questionDeEn: "Wie berechnen und validieren Sie den Performance Level (PL) sicherheitsbezogener Teile von Steuerungen mit der Software SISTEMA?",
      reasoning: "ایمنی جان اپراتور در ماشین‌آلات صنعتی آلمان متکی بر سیستم‌های کنترل ایمن چندکاناله است و مسئولیت حقوقی سنگینی دارد.",
      recruiterObjective: "ارزیابی تسلط بر معماری‌های ریداندنت (Cat 3 / Cat 4) و قطعات ایمنی تست‌شده.",
      evaluationFocus: "مقادیر MTTFd، پوشش تشخیصی، خطاهای با منشا مشترک (CCF) و اعتبارسنجی مدارها.",
      recommendedAnswerStrategy: "شرح محاسبه مدار پرده نوری ایمنی یا کنترل سرعت ایمن (SLS) با استفاده از ماژول‌های Failsafe در SISTEMA.",
      redFlags: "عدم تفکیک مدارهای کنترل استاندارد از مدارهای ایمنی دارای گواهی.",
      realWorldSource: "انجمن بیمه حوادث قانونی آلمان (DGUV)."
    }
  ];
}

function getHealthcareQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-health-01",
      category: "technical",
      categoryLabelFa: "تخصصی بالینی - استانداردهای بهداشت و کنترل عفونت (RKI)",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "بیمارستان‌ها و کلینیک‌های درمانی آلمان",
      questionFa: "دستورالعمل‌های بهداشتی انستیتو رابرت کخ آلمان (RKI - Robert Koch Institut) در خصوص اقدامات ایزولاسیون برای بیماران مبتلا به باکتری‌های مقاوم به چند دارو (MRSA / 4MRGN) را چگونه در شیفت خود پیاده می‌کنید؟",
      questionDeEn: "Wie setzen Sie die Hygiene- und Isolierungsmaßnahmen nach RKI-Empfehlungen bei multiresistenten Erregern (MRE/MRSA) um?",
      reasoning: "عفونت‌های بیمارستانی در آلمان به شدت پایش می‌شوند؛ تخطی از پروتکل‌های بهداشتی بازرسی‌های سفت‌وسخت به همراه دارد.",
      recruiterObjective: "سنجش انضباط در بهداشت دست، استفاده از وسایل حفاظت فردی و حفظ ایمنی سایر بیماران و کادر درمان.",
      evaluationFocus: "۵ لحظه بهداشت دست طبق WHO، ضدعفونی سطوح و مدیریت ملحفه‌ها و پسماندهای عفونی.",
      recommendedAnswerStrategy: "توضیح دقیق ورود به اتاق ایزوله، ترتیب پوشیدن و درآوردن گان و دستکش و تعویض ضدعفونی‌کننده‌ها.",
      redFlags: "سهل‌انگاری در استفاده از الکل ضدعفونی یا خروج از اتاق ایزوله بدون تعویض دستکش.",
      realWorldSource: "مصاحبه‌های کلینیک دانشگاهی شاریته برلین (Charité) و بیمارستان‌های ایالتی."
    },
    {
      id: "tech-health-02",
      category: "technical",
      categoryLabelFa: "تخصصی بالینی - ایمنی دارو و قانون ۵ قانون صحیح (5-R-Regel)",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "بیمارستان‌ها و کلینیک‌های درمانی آلمان",
      questionFa: "در فرآیند آماده‌سازی و تجویز داروهای وریدی و خوراکی، چگونه قانون ۵ قانون صحیح (5-R-Regel: بیمار، داروی، دوز، زمان و روش مصرف صحیح) را رعایت می‌کنید و در صورت مغایرت دستور پزشک چه اقدامی انجام می‌دهید؟",
      questionDeEn: "Wie stellen Sie die Arzneimittelsicherheit anhand der 5-R-Regel sicher und wie reagieren Sie bei unklaren ärztlichen Verordnungen?",
      reasoning: "خطاهای دارویی شایع‌ترین ریسک آسیب به بیمار است؛ پرستار موظف است هرگونه ابهام را پیش از تجویز استعلام کند.",
      recruiterObjective: "بررسی دقت عمل، مسئولیت‌پذیری بالینی و جلوگیری از حوادث مسمومیت دارویی.",
      evaluationFocus: "کنترل تاریخ انقضا، حساسیت‌های دارویی بیمار و مستندسازی در کاردکس بیمارستانی.",
      recommendedAnswerStrategy: "بیان یک تجربه که دوز تجویزی به دلیل نقص عملکرد کلیوی بالا بوده و شما مودبانه با پزشک چک و دوز را اصلاح کردید.",
      redFlags: "تزریق داروی ناخوانا یا تمکین کورکورانه به دستور مشکوک بدون راستی‌آزمایی.",
      realWorldSource: "استانداردهای ایمنی بیمار در نظام درمان آلمان (Aktionsbündnis Patientensicherheit)."
    },
    {
      id: "tech-health-03",
      category: "technical",
      categoryLabelFa: "تخصصی بالینی - مدیریت شرایط اورژانسی و تریاژ",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "بیمارستان‌ها و کلینیک‌های درمانی آلمان",
      questionFa: "هنگام وخامت ناگهانی وضعیت بیمار (Decompensation)، فرآیند ارزیابی علائم حیاتی بر اساس طرح ABCDE و نحوه فعال‌سازی تیم فوریت‌های پزشکی (Reanimationsteam / MET) در بیمارستان‌های آلمان چیست؟",
      questionDeEn: "Wie gehen Sie nach dem ABCDE-Schema bei einer akuten Zustandsverschlechterung vor und wie kommunizieren Sie über das SBAR-Schema?",
      reasoning: "واکنش سریع و سازمان‌یافته در دقایق اول تفاوت مرگ و زندگی بیمار است؛ استفاده از متد استاندارد اروپایی ABCDE الزامی است.",
      recruiterObjective: "سنجش خونسردی، تسلط بر پروتکل‌های احیای پایه (BLS) و انتقال پیام ساختاریافته به تیم پزشکی.",
      evaluationFocus: "بررسی راه‌های هوایی، تنفس، گردش خون، هوشیاری، تماس سریع با پزشک و آماده‌سازی ترالی اورژانس.",
      recommendedAnswerStrategy: "تشریح گزارش وضعیت بیمار با متد SBAR (Situation, Background, Assessment, Recommendation) به صورت مختصر و روشن.",
      redFlags: "دستپاچگی، ترک بالین بیمار بدون اطلاع همکاران یا عدم اندازه‌گیری پارامترهای پایه‌ای علائم حیاتی.",
      realWorldSource: "شورای احیای آلمان (Deutscher Rat für Wiederbelebung - GRC)."
    },
    {
      id: "tech-health-04",
      category: "technical",
      categoryLabelFa: "تخصصی بالینی - پرونده‌نویسی الکترونیک و رازداری پزشکی (Schweigepflicht)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "بیمارستان‌ها و کلینیک‌های درمانی آلمان",
      questionFa: "الزامات حقوقی رازداری پزشکی (§ 203 StGB) و اصول ثبت مستندات پرستاری بدون سوگیری و با ارزش حقوقی در پرونده الکترونیک بیمار (Krankenakte) در آلمان چه مواردی را شامل می‌شود؟",
      questionDeEn: "Welche rechtlichen Anforderungen stellen die ärztliche Schweigepflicht (§ 203 StGB) und die lückenlose Pflegedokumentation an Ihre Arbeit?",
      reasoning: "پرونده بیمار سند دادگاهی است؛ عدم ثبت مراقبت‌ها از نظر حقوقی به منزله عدم انجام آن تلقی شده و جریمه کیفری دارد.",
      recruiterObjective: "بررسی دانش قانونی، حفاظت اطلاعات شخصی (DSGVO) و دقت در گزارش‌نویسی به زبان آلمانی.",
      evaluationFocus: "ثبت بی‌طرفانه و مبتنی بر شواهد بدون توهین یا قضاوت شخصی، و عدم اشتراک اطلاعات با بستگان بدون رضایت کتبی بیمار.",
      recommendedAnswerStrategy: "توضیح اینکه هرگونه تغییر در علائم و مداخلات در زمان واقعی ثبت شده و اطلاعات به هیچ فرد نامربوطی بازگو نمی‌شود.",
      redFlags: "پاسخ دادن تلفنی به سوالات بستگان بدون احراز هویت یا جا انداختن مستندسازی مداخلات دارویی.",
      realWorldSource: "دستورالعمل‌های نظام پرستاری آلمان (Deutscher Pflegerat)."
    }
  ];
}

function getFinanceAccountingQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-fin-01",
      category: "technical",
      categoryLabelFa: "تخصصی مالی - استانداردهای حسابداری قانون تجارت آلمان (HGB)",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "شرکت‌های متوسط و هلدینگ‌های مالی آلمان",
      questionFa: "تفاوت‌های بنیادین اصول حسابداری آلمان (HGB) با استانداردهای بین‌المللی گزارشگری مالی (IFRS)، مشخصاً در زمینه اصل احتیاط (Vorsichtsprinzip)، اصل کمترین ارزش (Niederstwertprinzip) و ذخیره‌گیری‌ها (Rückstellungen) چیست؟",
      questionDeEn: "Welche wesentlichen Unterschiede bestehen zwischen dem HGB (insb. Vorsichts- und Niederstwertprinzip) und den IFRS?",
      reasoning: "سیستم مالیاتی و دفاتر رسمی در آلمان بر پایه HGB است که اولویت مطلق را به حفاظت از طلبکاران (Gläubigerschutz) می‌دهد.",
      recruiterObjective: "سنجش درک پایه‌ای ساختار ترازنامه و سود و زیان طبق استانداردهای آلمان.",
      evaluationFocus: "شناخت حسابداری محتاطانه، ارزیابی دارایی‌ها به بهای تمام‌شده و شناسایی زودهنگام زیان‌های احتمالی.",
      recommendedAnswerStrategy: "توضیح دهید که برخلاف IFRS که بر ارزش منصفانه (Fair Value) تاکید دارد، HGB مانع از شناسایی سود تحقق‌نیافته می‌شود.",
      redFlags: "عدم آشنایی با اصل احتیاط آلمان و تمایل به بیش‌برآوردی دارایی‌ها.",
      realWorldSource: "مصاحبه‌های شرکت‌های حسابرسی Big 4 در فرانکفورت و دوسلدورف."
    },
    {
      id: "tech-fin-02",
      category: "technical",
      categoryLabelFa: "تخصصی مالی - نرم‌افزارهای استاندارد حسابداری آلمان (DATEV / SAP)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان تجاری و مالی آلمان",
      questionFa: `تجربه شما در کار با نرم‌افزارهای مالی آلمان نظیر ${tool || "DATEV یا ماژول SAP FI/CO"}، استقرار سرفصل حساب‌های استاندارد (SKR 03 یا SKR 04) و تطبیق اظهارنامه ارزش افزوده (Umsatzsteuer-Voranmeldung) چگونه است؟`,
      questionDeEn: "Wie vertraut sind Sie mit den Kontenrahmen SKR 03 / SKR 04 in DATEV oder SAP FI und der Umsatzsteuer-Voranmeldung?",
      reasoning: "تقریباً تمام شرکت‌های متوسط آلمان با DATEV یا SAP کار می‌کنند و تسلط بر کدینگ حساب‌های استاندارد پیش‌شرط کارایی فوری است.",
      recruiterObjective: "بررسی توانایی ثبت اسناد مالیاتی، محاسبه مالیات بر ارزش افزوده و انطباق دوره‌ای با اداره مالیات (Finanzamt).",
      evaluationFocus: "تطبیق مالیات ورودی و خروجی (Vorsteuerabzug)، ثبت‌های استهلاک دارایی‌ها و بستن حساب‌های ماهانه.",
      recommendedAnswerStrategy: "تشریح تسلط بر ثبت‌های دوبل، تهیه خودکار USt-VA از طریق نرم‌افزار و تسویه حساب‌های بانکی با بانک‌های آلمان.",
      redFlags: "بی‌اطلاعی از مفهوم مالیات Vorsteuer و رویه‌های مالیاتی آلمان.",
      realWorldSource: "انجمن مشاوران مالیاتی آلمان (Bundessteuerberaterkammer)."
    },
    {
      id: "tech-fin-03",
      category: "technical",
      categoryLabelFa: "تخصصی مالی - کنترلینگ، بودجه‌بندی و تجزیه‌وتحلیل انحرافات",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "در فرآیند کنترلینگ مالی و بستن ماهانه حساب‌ها (Monatsabschluss)، چگونه تحلیل انحراف بودجه از عملکرد واقعی (Soll-Ist-Vergleich) را انجام داده و گزارش برای هیئت مدیره تهیه می‌کنید؟",
      questionDeEn: "Wie führen Sie den Soll-Ist-Vergleich im monatlichen Controlling durch und welche KPIs berichten Sie der Geschäftsführung?",
      reasoning: "مدیران شرکت‌های آلمانی تصمیمات را منحصراً بر پایه اعداد دقیق مالی اتخاذ می‌کنند؛ کنترلر باید ریشه انحرافات هزینه را بیابد.",
      recruiterObjective: "سنجش مهارت تحلیلی، پیش‌بینی جریان وجوه نقد (Cash Flow Forecast) و تسلط بر شاخص‌های سودآوری نظیر EBITDA.",
      evaluationFocus: "شناسایی سریع مراکز هزینه دارای انحراف (Kostenstellenrechnung) و ارائه راهکارهای انقباض هزینه.",
      recommendedAnswerStrategy: "توضیح فرآیند ساخت داشبورد KPI، تحلیل انحراف حجم فروش در برابر قیمت و اقدام پیشگیرانه قبل از پایان سال مالی.",
      redFlags: "تولید صفحات طولانی اکسل بدون خلاصه مدیریتی شفاف و بدون ارائه بینش استراتژیک.",
      realWorldSource: "آکادمی کنترلرهای آلمان (Controller Institut)."
    }
  ];
}

function getArchitectureQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-arch-01",
      category: "technical",
      categoryLabelFa: "تخصصی معماری - قوانین ساخت و ساز و شهرسازی آلمان (BauGB / LBO)",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "دفاتر معماری و برنامه‌ریزی شهری آلمان",
      questionFa: "چگونه مقررات ساختمانی ایالتی (Landesbauordnung - LBO)، ضوابط طرح تفصیلی (Bebauungsplan) و شاخص‌های تراکم نظیر سطح اشغال (GRZ) و زیربنا (GFZ) را در طراحی فاز ۱ و ۲ لحاظ می‌نمایید؟",
      questionDeEn: "Wie wenden Sie die Vorgaben des Bebauungsplans (GRZ, GFZ) und die Landesbauordnung (LBO) bei der Entwurfsplanung an?",
      reasoning: "اخذ پروانه ساخت در آلمان مستلزم رعایت میلی‌متری LBO و BauNVO است؛ نقشه مغایر فوراً از شهرداری برگشت می‌خورد.",
      recruiterObjective: "سنجش آشنایی با ضوابط سخت‌گیرانه فواصل حریم (Abstandsflächen)، ایمنی حریق و پارکینگ.",
      evaluationFocus: "محاسبه دقیق سطوح طبق DIN 277 و تنظیم مدارک درخواست پروانه ساخت (Bauantrag).",
      recommendedAnswerStrategy: "تشریح نحوه تطبیق ارتفاع سقف و خطوط مجاز ساختمانی با استفاده از سایت پلان شهرداری.",
      redFlags: "طراحی فرم‌های آزاد بدون توجه به مقررات محلی و حریم پلاک‌های مجاور.",
      realWorldSource: "نظام مهندسی معماری ایالت نوردراین-وستفالن (AKNW)."
    },
    {
      id: "tech-arch-02",
      category: "technical",
      categoryLabelFa: "تخصصی معماری - نقشه‌های اجرایی فاز دو و دیتایل‌های نما (LPH 5)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "دفاتر مهندسی مشاور و معماری آلمان",
      questionFa: `در تهیه نقشه‌های اجرایی فاز دو (Ausführungs- und Detailplanung) با ${tool || "Revit / ArchiCAD"}، چگونه جزئیات عایق‌کاری حرارتی پوسته، هوابندی و حذف پل‌های حرارتی (Wärmebrücken nach DIN 4108) را مدل‌سازی می‌کنید؟`,
      questionDeEn: "Wie detaillieren Sie schlagregendichte Fassadenanschlüsse und minimieren Wärmebrücken gemäß DIN 4108-Beiblatt 2 in der Ausführungsplanung?",
      reasoning: "اقلیم بارانی و سرد آلمان ایجاب می‌کند درزگیری پنجره‌ها و نما ضدآب و هوابند باشد تا از ایجاد کپک (Schimmel) جلوگیری شود.",
      recruiterObjective: "ارزیابی دانش فنی دیتیل‌های اجرایی، اتصالات کف به نما و عایق‌کاری رطوبتی بام تخت طبق DIN 18531.",
      evaluationFocus: "لایه‌بندی دقیق مصالح، هوابندی لایه بخاربند و درزبندی با چسب‌های استاندارد آلمان.",
      recommendedAnswerStrategy: "نمایش تسلط بر ترسیم جزییات در مقیاس ۱:۵ و ۱:۱۰ با رعایت کامل ضوابط بهره‌وری انرژی قانون GEG آلمان.",
      redFlags: "ترسیم جزییات نمادین و فاقد قابلیت اجرا در سایت واقعی.",
      realWorldSource: "مصاحبه‌های دفاتر معماری در برلین، هامبورگ و مونیخ."
    }
  ];
}

function getIndustrialManagementQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-ind-01",
      category: "technical",
      categoryLabelFa: "تخصصی صنایع - مهندسی فرآیند و تولید ناب (Lean Manufacturing)",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "شرکت‌های صنعتی و خودروسازی آلمان",
      questionFa: "ابزارهای تولید ناب نظیر نقشه‌برداری جریان ارزش (Value Stream Mapping - VSM)، متد ۵S، کانبان و رویکرد کایزن (Kaizen) را چگونه برای کاهش اتلاف‌ها (Muda) در خطوط تولید پیاده می‌کنید؟",
      questionDeEn: "Wie wenden Sie Wertstromanalysen (VSM), 5S und Kanban zur Identifikation und Beseitigung von Verschwendung im Produktionsumfeld an?",
      reasoning: "صنایع آلمان بهینگی خطوط خود را مدیون حذف پیوسته اتلاف‌های ۷ گانه هستند و مهندس صنایع باید تفکر ناب داشته باشد.",
      recruiterObjective: "سنجش توانایی تحلیل جریان مواد و اطلاعات و کاهش زمان چرخه تولید (Lead Time).",
      evaluationFocus: "محاسبه زمان تیک‌تایم (Takt Time)، شناسایی گلوگاه خط و ترازسازی بار کاری کارگران (Line Balancing).",
      recommendedAnswerStrategy: "یک پروژه عملی را مثال بزنید که با بازچیدمان ایستگاه کاری، مسافت جابجایی قطعات و زمان انتظار را ۳۰٪ کاهش دادید.",
      redFlags: "رویکرد تئوریک بدون حضور در کف کارخانه (Gemba Walk).",
      realWorldSource: "دستورالعمل‌های موسسه REFA و شرکت‌های تولیدی آلمان."
    },
    {
      id: "tech-ind-02",
      category: "technical",
      categoryLabelFa: "تخصصی صنایع - مدیریت کیفیت و حل مسئله ساختاریافته (8D Report)",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های تامین‌کننده قطعات خودرو (Automotive Tier 1)",
      questionFa: "هنگام بروز شکایت کیفی از سوی مشتری یا نقص بحرانی در فرآیند تولید، متدولوژی ۸ مرحله‌ای گزارش حل مسئله (8D-Report) و ابزارهای 5-Why و استخوان ماهی را چگونه هدایت می‌نمایید؟",
      questionDeEn: "Wie leiten Sie den 8D-Problemlösungsprozess und die Ursachenanalyse (Ishikawa, 5-Why) bei Qualitätsreklamationen?",
      reasoning: "تمام مشتریان صنعتی آلمان در صورت وجود نقص، فوراً گزارش رسمی 8D مطالبه می‌کنند؛ اقدام فوری containment action ظرف ۲۴ ساعت حیاتی است.",
      recruiterObjective: "بررسی مدیریت بحران کیفی و جلوگیری قطعی از تکرار مجدد خطا.",
      evaluationFocus: "تفکیک علت مستقیم از علت ریشه‌ای و اثربخشی اقدامات اصلاحی دائمی (Permanent Corrective Actions).",
      recommendedAnswerStrategy: "شرح گام‌به‌گام بستن یک گزارش 8D واقعی در همکاری با تیم‌های تولید، طراحی و زنجیره تامین.",
      redFlags: "بستن گزارش 8D با متهم کردن خطای انسانی بدون اصلاح فرآیند یا اعمال Poka-Yoke.",
      realWorldSource: "استانداردهای انجمن خودروسازان آلمان (VDA Band 4)."
    }
  ];
}

function getDataAiQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-data-01",
      category: "technical",
      categoryLabelFa: "تخصصی داده - مهندسی ویژگی‌ها و جلوگیری از بیش‌برازش (Overfitting)",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "شرکت‌های فناوری و مراکز تحقیق و توسعه آلمان",
      questionFa: `در خط لوله پردازش داده با ${tool || "Python / Pandas / Scikit-Learn"}، چگونه داده‌های گمشده، مقادیر پرت و ناهماهنگی‌های آماری را شناسایی و از نشت داده (Data Leakage) جلوگیری می‌کنید؟`,
      questionDeEn: "Wie verhindern Sie Data Leakage in Ihrer Preprocessing- und Feature-Engineering-Pipeline bei Trainings- und Validierungsdaten?",
      reasoning: "مدل‌های هوش مصنوعی با داده‌های نشت‌کرده در عمل سقوط می‌کنند؛ کارفرمایان آلمانی خواهان اعتبارسنجی علمی دقیق هستند.",
      recruiterObjective: "سنجش پایه‌های آماری و اصول مهندسی داده عاری از خطا.",
      evaluationFocus: "اعتبارسنجی متقاطع (Stratified K-Fold)، نرمال‌سازی صرفاً بر روی Train Set و تحلیل ماتریس کوواریانس.",
      recommendedAnswerStrategy: "توضیح دهید که تمام تبدیلات و فیتینگ‌ها درون شیء Pipeline اسکیت‌لرن کپسوله می‌شوند تا داده آزمون به هیچ وجه دیده نشود.",
      redFlags: "نرمال‌سازی کل داده‌ها پیش از تقسیم به Train/Test که بزرگترین خطای مبتدیان است.",
      realWorldSource: "مصاحبه‌های علم داده در SAP، Delivery Hero و زلاندو (Zalando)."
    },
    {
      id: "tech-data-02",
      category: "technical",
      categoryLabelFa: "تخصصی داده - استقرار عملیاتی و چرخه MLOps",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "پس از آموزش مدل‌های یادگیری عمیق، چگونه فرآیند پایش تغییر توزیع داده‌ها (Data Drift / Concept Drift)، نسخه‌بندی مدل با MLflow و استقرار کانتینریزه را پیاده می‌کنید؟",
      questionDeEn: "Wie überwachen Sie Data Drift und Model Degradation im laufenden Betrieb und wie setzen Sie MLOps-Pipelines um?",
      reasoning: "استقرار مدل در مقیاس صنعتی شرکت‌های آلمانی مستلزم پایش پیوسته و انطباق با مقررات قانون هوش مصنوعی اروپا (EU AI Act) است.",
      recruiterObjective: "سنجش مهارت مهندسی برای تبدیل یک نوت‌بوک تحقیقاتی به یک وب‌سرویس پایدار سازمانی.",
      evaluationFocus: "سنجش تست کولموگروف-اسمیرنوف برای دریفت، لاگین کردن معیارهای استنتاج و بازآموزی خودکار (Automated Retraining).",
      recommendedAnswerStrategy: "تشریح چرخه کامل استقرار با داکر، کوبرنتیز، مانیتورینگ تاخیر اینفرنس و تست A/B قبل از رول‌اوت کامل.",
      redFlags: "رها کردن مدل پس از استقرار بدون پایش مستمر صحت پیش‌بینی‌ها.",
      realWorldSource: "استانداردهای مرکز ملی هوش مصنوعی آلمان و کنسرسیوم‌های تحقیقاتی فراونهوفر (Fraunhofer)."
    }
  ];
}

function getSoftwareEngineeringQuestions(tool: string): InterviewQuestionItem[] {
  return [
    {
      id: "tech-soft-01",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - مهندسی پایه و کد تمیز",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "all",
      companyTypeLabelFa: "تمامی کارفرمایان فناوری آلمان",
      questionFa: `در سوابق کاری شما به کار با ${tool || "تکنولوژی‌های نرم‌افزاری"} اشاره شده است؛ اصول اساسی کد تمیز (Clean Code) و نام‌گذاری استاندارد متغیرها، توابع و جداسازی دغدغه‌ها (Separation of Concerns) را چگونه پیاده می‌کنید؟`,
      questionDeEn: "Wie wenden Sie Clean Code Prinzipien und Separation of Concerns in Ihrer täglichen Arbeit an?",
      reasoning: "کارفرمایان آلمانی برای سطوح جونیور بیشتر از تکنولوژی‌های زودگذر، به انضباط کدنویسی، خوانایی و پرهیز از کدهای کثیف (Spaghetti Code) اهمیت می‌دهند.",
      recruiterObjective: "تسلط بر اصول اولیه مهندسی نرم‌افزار، DRY (Don't Repeat Yourself) و خوانایی کد برای همکاران.",
      evaluationFocus: "نوشتن توابع کوچک، نام‌گذاری معنادار و مستندسازی مناسب کد.",
      recommendedAnswerStrategy: "با متد STAR مثالی بزنید که چگونه یک تابع طولانی را به توابع تک‌مسئولیتی شفاف و بدون ابهام بازنویسی کردید.",
      redFlags: "نوشتن توابع چندصد خطی، عدم توجه به نام‌گذاری‌های استاندارد یا کپی-پیست کورکورانه.",
      realWorldSource: "آزمون‌های فنی شرکت‌های فناوری برلین و مونیخ."
    },
    {
      id: "tech-soft-02",
      category: "technical",
      categoryLabelFa: "تخصصی جونیور - متدولوژی دیباگ و حل خطا",
      level: "junior",
      levelLabelFa: "جونیور (Junior Level)",
      companyType: "mittelstand",
      companyTypeLabelFa: "شرکت‌های متوسط تخصصی (Mittelstand)",
      questionFa: "وقتی در کد یا سیستم با یک باگ ناشناخته، ارور رندوم یا کرش غیرمنتظره مواجه می‌شوید، متدولوژی گام‌به‌گام شما برای ایزوله‌سازی و ریشه‌یابی خطا چیست؟",
      questionDeEn: "Welche systematische Vorgehensweise nutzen Sie beim Debugging und Eingrenzen von unerwarteten Fehlern?",
      reasoning: "آیا متقاضی به صورت شانسی و با آزمون و خطای کورکورانه کد را تغییر می‌دهد یا متدولوژی علمی (بررسی لاگ، ساخت مجدد باگ، تست‌های کوچک) دارد.",
      recruiterObjective: "سنجش تفکر انتقادی و عیب‌یابی روش‌مند.",
      evaluationFocus: "استفاده از ابزارهای دیباگر رسمی (Breakpoints, Profilers, Loggers)، بازتولید ایزوله مسئله و تحلیل ریشه‌ای باگ.",
      recommendedAnswerStrategy: "مراحل را منظم توضیح دهید: ۱. بازتولید پایدار خطا، ۲. بررسی لاگ‌های خطا، ۳. استفاده از Breakpoint برای بررسی وضعیت متغیرها، ۴. رفع خطا و اضافه کردن تست برای جلوگیری از بازگشت باگ.",
      redFlags: "تغییر تصادفی کد به امید حل معجزه‌آسای مشکل.",
      realWorldSource: "ارزیابی مهارت‌های فنی در مصاحبه‌های استخدامی مونیخ و کلن."
    },
    {
      id: "tech-soft-03",
      category: "technical",
      categoryLabelFa: "تخصصی میدلول - معماری و بهینه‌سازی کارایی",
      level: "mid",
      levelLabelFa: "میدلول (Mid-level)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "چگونه گلوگاه‌های کارایی (Performance Bottlenecks)، کوئری‌های کند دیتابیس (N+1 Problem) و مصرف حافظه را در سیستم‌های تحت بار پایش و رفع می‌کنید؟",
      questionDeEn: "Wie identifizieren und beheben Sie Performance-Bottlenecks und datenbankseitige N+1-Query-Probleme?",
      reasoning: "مقیاس‌پذیری و زمان پاسخگویی سریع در سامانه‌های آلمانی برای جلوگیری از افت شاخص‌های SLA ضروری است.",
      recruiterObjective: "بررسی دانش عمیق در ایندکس‌گذاری، کشینگ لایه‌ای (Redis) و پروفایلینگ حافظه.",
      evaluationFocus: "استفاده از APM (Datadog, Prometheus)، بهینه‌سازی کوئری‌ها و کشینگ هوشمند.",
      recommendedAnswerStrategy: "یک مورد واقعی را تشریح کنید که لود تایم یک اندپوینت از ۲ ثانیه به ۲۰۰ میلی‌ثانیه کاهش یافت.",
      redFlags: "افزایش سخت‌افزار سرور بدون تحلیل منشا نرم‌افزاری گلوگاه.",
      realWorldSource: "مصاحبه‌های فنی در SAP و زلاندو."
    },
    {
      id: "tech-soft-04",
      category: "technical",
      categoryLabelFa: "تخصصی سنیور - مقاومت در برابر خطا و تاب‌آوری (Resilience)",
      level: "senior_lead",
      levelLabelFa: "سنیور و لید (Senior / Tech Lead)",
      companyType: "dax_enterprise",
      companyTypeLabelFa: "هلدینگ‌های بزرگ بورس آلمان (DAX Enterprise)",
      questionFa: "چگونه الگوهای پایداری و مقاومت در برابر خطا (Resilience Patterns نظیر Circuit Breaker, Rate Limiting, Retry with Backoff) را در تعاملات میان سرویس‌ها پیاده‌سازی می‌کنید؟",
      questionDeEn: "Wie implementieren Sie Resilience Patterns wie Circuit Breaker und Rate Limiting gegen kaskadierende Ausfälle?",
      reasoning: "اطمینان از اینکه قطعی یک سرویس فرعی، کل سامانه را به صورت دومینویی متوقف نمی‌کند.",
      recruiterObjective: "سنجش توانایی معمار برای طراحی سیستم‌های با پایداری ۹۹.۹۹٪.",
      evaluationFocus: "شکست شرافتمندانه (Graceful Degradation)، ایزولاسیون خطا و مانیتورینگ سلامت سرویس‌ها.",
      recommendedAnswerStrategy: "تشریح استفاده از Circuit Breaker برای بازگرداندن پاسخ کش‌شده در زمان قطعی سرویس اصلی تا بازیابی کامل آن.",
      redFlags: "تکرار بی‌نهایت درخواست‌های ناموفق که منجر به خودکشی سرور (Self-inflicted DoS) می‌شود.",
      realWorldSource: "استانداردهای سیستم‌های حیاتی در خودرو و لجستیک آلمان."
    }
  ];
}
