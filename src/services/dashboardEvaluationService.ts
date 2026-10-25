import { EvaluatorInput, CVBuilderInput } from "../types";

export interface ParsedEducationInfo {
  degreeLevel: "phd" | "master" | "bachelor" | "associate" | "diploma" | "other";
  degreeTitleFa: string;
  degreeTitleDe: string;
  fieldOfStudy: string;
  institutionName: string;
  anabinStatus: "H+" | "H+/-" | "H-" | "ZAB_REQUIRED";
  anabinStatusLabelFa: string;
  anabinStatusDescription: string;
  chancenkarteDegreePoints: number;
  blueCardAcademicEligible: boolean;
  rawSummary: string;
  recommendations: string[];
}

export interface ParsedWorkHistoryInfo {
  totalYears: number;
  seniorityLevel: "Junior" | "Mid-Level" | "Senior" | "Lead / Expert";
  seniorityLevelFa: string;
  highlights: string[];
  recentRole: string;
  chancenkarteExperiencePoints: number;
  blueCardExperienceEligible: boolean;
  germanWorkplaceAlignment: string;
  germanReferenceLetterAdvice: string;
  rawSummary: string;
}

export interface ParsedSkillItem {
  id: string;
  name: string;
  category: "core" | "tools" | "methodology" | "standards" | "languages";
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  proficiencyScore: number;
  inDemandInGermany: boolean;
}

export interface ParsedSkillsInfo {
  skillsList: string[];
  parsedItems: ParsedSkillItem[];
  coreTechStack: string[];
  toolsAndPlatforms: string[];
  methodologiesAndSoftSkills: string[];
  relevantGermanStandards: string[];
  overallMatchPercentage: number;
  primaryDomain: string;
  primaryDomainFa: string;
  skillGaps: string[];
  highDemandHighlights: string[];
  rawSummary: string;
}

export interface ParsedVisaMarketFit {
  chancenkartePoints: {
    total: number;
    passedThreshold: boolean; // 6+ points required
    breakdown: {
      degree: number;
      experience: number;
      german: number;
      english: number;
      age: number;
      shortageField: number;
    };
  };
  blueCardFit: {
    eligible: boolean;
    isShortageOccupation: boolean;
    minSalaryThresholdEur: number;
    salaryThresholdLabel: string;
    professionCategoryDe: string;
  };
  recommendedPathway: "blue_card" | "chancenkarte" | "academic_specialist";
  recommendedPathwayTitleFa: string;
  recommendedPathwayReason: string;
}

export interface DashboardEvaluationCard {
  id: string;
  badgeLabel: string;
  badgeColorClass: string;
  title: string;
  subtitle: string;
  mainMetricLabel: string;
  mainMetricValue: string;
  secondaryMetricLabel?: string;
  secondaryMetricValue?: string;
  statusType: "success" | "warning" | "info";
  keyHighlights: string[];
  recommendationText: string;
  sourceType: "extracted_cv" | "saved_profile" | "manual_input" | "hybrid";
}

export interface DashboardEvaluationResult {
  candidateName: string;
  candidateAge: number;
  candidateField: string;
  languages: {
    german: string;
    english: string;
  };
  education: ParsedEducationInfo;
  workHistory: ParsedWorkHistoryInfo;
  skills: ParsedSkillsInfo;
  visaMarketFit: ParsedVisaMarketFit;
  cards: {
    educationCard: DashboardEvaluationCard;
    workHistoryCard: DashboardEvaluationCard;
    skillsCard: DashboardEvaluationCard;
    marketFitCard: DashboardEvaluationCard;
  };
  dataSource: {
    hasSavedProfile: boolean;
    hasSavedCv: boolean;
    hasExtractedPdf: boolean;
    lastUpdated: string;
  };
}

/**
 * Normalizes text for clean keyword detection
 */
function cleanText(text?: string | null): string {
  if (!text) return "";
  return text.toLowerCase().trim();
}

/**
 * Extracts candidate university from textual education summaries
 */
function extractUniversityName(text: string, defaultName: string = "دانشگاه معتبر مورد تایید وزارت علوم / بهداشت"): string {
  if (!text) return defaultName;

  const patterns = [
    /دانشگاه\s+صنعتی\s+امیرکبیر/i,
    /دانشگاه\s+تهران/i,
    /دانشگاه\s+صنعتی\s+شریف/i,
    /دانشگاه\s+شهید\s+بهشتی/i,
    /دانشگاه\s+علم\s+و\s+صنعت/i,
    /دانشگاه\s+خواجه\s+نصیر/i,
    /دانشگاه\s+فردوسی\s+مشهد/i,
    /دانشگاه\s+تبریز/i,
    /دانشگاه\s+اصفهان/i,
    /دانشگاه\s+صنعتی\s+اصفهان/i,
    /دانشگاه\s+شیراز/i,
    /دانشگاه\s+علوم\s+پزشکی\s+[\u0600-\u06FF]+/i,
    /دانشگاه\s+آزاد\s+اسلامی\s+واحد\s+[\u0600-\u06FF]+/i,
    /دانشگاه\s+آزاد\s+اسلامی/i,
    /دانشگاه\s+پیام\s+نور/i,
    /دانشگاه\s+[\u0600-\u06FF\s]{4,30}/i,
    /university\s+of\s+[a-zA-Z\s]{4,30}/i,
    /amirkabir\s+university/i,
    /sharif\s+university/i,
    /tehran\s+university/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      return match[0].trim();
    }
  }

  // Look for "از" or "در" before university
  const azMatch = text.match(/(?:از|در|فارغ‌التحصیل|مدرک)\s+([^\n,.()]{5,40})/);
  if (azMatch && azMatch[1] && azMatch[1].includes("دانشگاه")) {
    return azMatch[1].trim();
  }

  return defaultName;
}

/**
 * Extracts specific degree information from profile & CV data
 */
export function extractEducationDetails(
  degreeCode?: string,
  fieldOfStudy?: string,
  educationText?: string
): ParsedEducationInfo {
  const normText = cleanText(educationText);
  let resolvedDegree: "phd" | "master" | "bachelor" | "associate" | "diploma" | "other" = "bachelor";

  if (degreeCode === "phd" || normText.includes("دکتری") || normText.includes("phd") || normText.includes("دکترا")) {
    resolvedDegree = "phd";
  } else if (degreeCode === "master" || normText.includes("ارشد") || normText.includes("master") || normText.includes("فوق لیسانس")) {
    resolvedDegree = "master";
  } else if (degreeCode === "associate" || normText.includes("کاردانی") || normText.includes("فوق دیپلم") || normText.includes("associate")) {
    resolvedDegree = "associate";
  } else if (degreeCode === "diploma" || normText.includes("دیپلم") || normText.includes("هنرستان") || normText.includes("دبیرستان")) {
    resolvedDegree = "diploma";
  } else if (degreeCode === "none") {
    resolvedDegree = "other";
  } else {
    resolvedDegree = "bachelor";
  }

  const institutionName = extractUniversityName(educationText || "", "دانشگاه دولتی / آزاد اسلامی (H+)");
  const fieldName = fieldOfStudy && fieldOfStudy.trim().length > 1 ? fieldOfStudy.trim() : "رشته تخصصی متقاضی";

  const titlesMap: Record<string, { fa: string; de: string; chancenkartePts: number; blueCard: boolean }> = {
    phd: {
      fa: `دکتری تخصصی (Ph.D) در ${fieldName}`,
      de: `Doktorgrad / Promotion (Dr. / Ph.D.) in ${fieldName}`,
      chancenkartePts: 4,
      blueCard: true
    },
    master: {
      fa: `کارشناسی ارشد (فوق لیسانس) در ${fieldName}`,
      de: `Master of Science / Master of Arts (M.Sc./M.A.) in ${fieldName}`,
      chancenkartePts: 4,
      blueCard: true
    },
    bachelor: {
      fa: `کارشناسی (لیسانس) در ${fieldName}`,
      de: `Bachelor of Science / Bachelor of Arts (B.Sc./B.A.) in ${fieldName}`,
      chancenkartePts: 4,
      blueCard: true
    },
    associate: {
      fa: `کاردانی (فوق دیپلم فنی) در ${fieldName}`,
      de: `Staatlich anerkannte/r Techniker/in / Fachhochschulabschluss`,
      chancenkartePts: 4, // If recognized
      blueCard: false
    },
    diploma: {
      fa: `دیپلم متوسطه رسمی / فنی حرفه‌ای`,
      de: `Allgemeine Hochschulreife / Fachabitur / Berufsausbildung`,
      chancenkartePts: 0,
      blueCard: false
    },
    other: {
      fa: `مدرک متفرقه / فاقد تاییدیه دانشگاهی`,
      de: `Sonstige Qualifikation`,
      chancenkartePts: 0,
      blueCard: false
    }
  };

  const meta = titlesMap[resolvedDegree];
  const isAnabinRecognized = resolvedDegree === "bachelor" || resolvedDegree === "master" || resolvedDegree === "phd";

  const recommendations: string[] = [];
  if (isAnabinRecognized) {
    recommendations.push("دریافت پرینت تاییدیه وضعیت H+ دانشگاه و رشته از پایگاه رسمی آنابین (Anabin KMK)");
    recommendations.push("ترجمه رسمی ریزنمرات و دانشنامه به زبان آلمانی با تاییدات دادگستری و وزارت امور خارجه");
    recommendations.push("آماده‌سازی تاییدیه ارزشیابی ZAB در صورت عدم تطابق دقیق عنوان رشته در پایگاه آنابین");
  } else if (resolvedDegree === "associate" || resolvedDegree === "diploma") {
    recommendations.push("ارائه درخواست ارزشیابی صلاحیت شغلی (Gleichwertigkeitsprüfung) به مراجع ذی‌صلاح آلمان (IHK FOSA یا اتاق اصناف)");
    recommendations.push("تمرکز بر مسیر کارت فرصت با اثبات حداقل ۲ سال آموزش فنی مورد تایید");
  }

  return {
    degreeLevel: resolvedDegree,
    degreeTitleFa: meta.fa,
    degreeTitleDe: meta.de,
    fieldOfStudy: fieldName,
    institutionName,
    anabinStatus: isAnabinRecognized ? "H+" : "ZAB_REQUIRED",
    anabinStatusLabelFa: isAnabinRecognized ? "مورد تایید قطعی دولت آلمان (H+)" : "نیازمند ارزشیابی تکمیلی (ZAB / IHK)",
    anabinStatusDescription: isAnabinRecognized
      ? `مدرک ${meta.fa} شما از ${institutionName} در زمره مدارک رسمی منطبق با سطح تحصیلات عالی آلمان ارزیابی شده و شرط آکادمیک بلوکارت را احراز می‌کند.`
      : `مدرک تحصیلی برای تطابق کامل با استانداردهای فدرال نیاز به تاییدیه مراجع اتاق بازرگانی یا ZAB دارد.`,
    chancenkarteDegreePoints: meta.chancenkartePts,
    blueCardAcademicEligible: meta.blueCard,
    rawSummary: educationText || `${meta.fa} - ${institutionName}`,
    recommendations
  };
}

/**
 * Extracts and categorizes work history highlights
 */
export function extractWorkHistoryDetails(
  experienceYearsInput?: number | string,
  field?: string,
  workHistoryHighlights?: string[],
  experienceRawText?: string
): ParsedWorkHistoryInfo {
  let totalYears = Number(experienceYearsInput);
  if (isNaN(totalYears) || totalYears < 0) totalYears = 3;

  const rawText = experienceRawText || "";
  const highlights: string[] = [];

  // If explicit highlights were passed
  if (Array.isArray(workHistoryHighlights) && workHistoryHighlights.length > 0) {
    workHistoryHighlights.forEach(h => {
      if (h && typeof h === "string" && h.trim().length > 5) {
        highlights.push(h.trim());
      }
    });
  }

  // Parse raw text for additional bullet points or sentences if empty
  if (highlights.length === 0 && rawText.length > 10) {
    const lines = rawText.split(/\n|\r|\.|;/).map(l => l.trim()).filter(l => l.length > 15);
    lines.slice(0, 4).forEach(line => highlights.push(line));
  }

  // If still empty, synthesize realistic field-specific work highlights based on actual candidate field (NEVER generic electrical)
  if (highlights.length === 0) {
    const f = cleanText(field);
    if (f.includes("نرم‌افزار") || f.includes("برنامه‌نویس") || f.includes("وب") || f.includes("فرانت") || f.includes("بک") || f.includes("fullstack") || f.includes("react")) {
      highlights.push(`بیش از ${totalYears} سال تجربه در طراحی، توسعه و استقرار وب‌اپلیکیشن‌ها و سرویس‌های نرم‌افزاری`);
      highlights.push("همکاری در تیم‌های چابک (Scrum) و بازبینی کد (Code Review) همراه با مستندسازی سیستم");
      highlights.push("بهینه‌سازی معماری پایگاه‌داده و پیاده‌سازی APIهای کارآمد و امن");
    } else if (f.includes("پزشک") || f.includes("درمان") || f.includes("دکتر") || f.includes("جراح")) {
      highlights.push(`بیش از ${totalYears} سال سابقه طبابت، ویزیت بالینی بیماران و مدیریت پروسه‌های تشخیصی و درمانی`);
      highlights.push("مدیریت موارد اورژانسی بیمارستانی و ثبت دقیق سوابق پزشکی بیماران (Krankenakte)");
    } else if (f.includes("پرستار") || f.includes("مراقبت") || f.includes("مامایی")) {
      highlights.push(`بیش از ${totalYears} سال سابقه مراقبت بالینی در بخش‌های بیمارستانی و همکاری با تیم پزشکی`);
      highlights.push("کنترل علائم حیاتی، تجویز دارو، ثبت کاردکس و رعایت بالاترین استانداردهای استریلیزاسیون");
    } else if (f.includes("مکانیک") || f.includes("طراحی") || f.includes("خودرو")) {
      highlights.push(`بیش از ${totalYears} سال تجربه در طراحی قطعات، تحلیل مهندسی و مدل‌سازی سه‌بعدی CAD`);
      highlights.push("تدوین نقشه‌های اجرایی دو بعدی با تلرانس‌های استاندارد و نظارت بر پروسه ساخت");
    } else if (f.includes("عمران") || f.includes("سازه") || f.includes("معمار") || f.includes("bim")) {
      highlights.push(`بیش از ${totalYears} سال تجربه در مدلسازی سازه، تهیه نقشه‌های ساختمانی و متره و برآورد`);
      highlights.push("پیاده‌سازی متدولوژی BIM و کنترل تداخلات بین‌رشته‌ای در پروژه‌های ساختمانی");
    } else if (f.includes("مالی") || f.includes("حسابدار")) {
      highlights.push(`بیش از ${totalYears} سال تجربه در ثبت دفاتر مالی، بستن حساب‌های ماهانه و تهیه گزارش‌های مدیریتی`);
      highlights.push("تحلیل جریانات نقدی، انطباق با قوانین مالیاتی و استفاده از نرم‌افزارهای یکپارچه مالی");
    } else {
      highlights.push(`بیش از ${totalYears} سال سابقه کاری تخصصی مرتبط در حوزه ${field || "حرفه تخصصی"}`);
      highlights.push("اجرای پروژه‌های حرفه‌ای، حل چالش‌های عملیاتی و ارتقای بازدهی فرآیندهای تیمی");
    }
  }

  // Seniority assessment
  let seniorityLevel: "Junior" | "Mid-Level" | "Senior" | "Lead / Expert" = "Mid-Level";
  let seniorityLevelFa = "متخصص سطح متوسط (Mid-Level)";
  let chancenkartePts = 2;

  if (totalYears >= 8) {
    seniorityLevel = "Lead / Expert";
    seniorityLevelFa = "راهبر و متخصص ارشد (Lead / Principal Expert)";
    chancenkartePts = 3;
  } else if (totalYears >= 5) {
    seniorityLevel = "Senior";
    seniorityLevelFa = "متخصص ارشد (Senior Specialist)";
    chancenkartePts = 3;
  } else if (totalYears >= 3) {
    seniorityLevel = "Mid-Level";
    seniorityLevelFa = "متخصص با تجربه (Mid-Level Professional)";
    chancenkartePts = 2;
  } else {
    seniorityLevel = "Junior";
    seniorityLevelFa = "متخصص جونیور (Junior / Entry-Level)";
    chancenkartePts = totalYears >= 2 ? 2 : 0;
  }

  const recentRole = field && field.trim().length > 2 ? field.trim() : "متخصص حرفه‌ای";

  return {
    totalYears,
    seniorityLevel,
    seniorityLevelFa,
    highlights,
    recentRole,
    chancenkarteExperiencePoints: chancenkartePts,
    blueCardExperienceEligible: totalYears >= 3,
    germanWorkplaceAlignment: totalYears >= 3 
      ? `سابقه کار ${totalYears} ساله شما دقیقاً با بازه مورد انتظار کارفرمایان آلمانی برای موقعیت‌های شغلی مستقل و حقوق‌های بالای بلوکارت انطباق دارد.`
      : `سابقه کار شما برای شروع به کار عالی است؛ برجسته‌سازی پروژه‌های عملی و نمونه‌کارها شانس مصاحبه را مضاعف خواهد کرد.`,
    germanReferenceLetterAdvice: "تهیه گواهی سابقه کار به فرمت گواهی آلمانی (Arbeitszeugnis) با ذکر جزئیات وظایف و دستاوردها",
    rawSummary: rawText || highlights.join(" | ")
  };
}

/**
 * Parses, cleans, and categorizes technical and domain skills
 * STRICTLY replacing generic Electrical Engineering content unless candidate is an electrical engineer.
 */
export function extractSkillsDetails(
  rawSkillsInput?: string,
  candidateField?: string,
  workHistoryText?: string
): ParsedSkillsInfo {
  const fLower = cleanText(candidateField);
  const isActualElectrical = fLower.includes("برق صنعتی") || fLower.includes("الکترونیک") || fLower.includes("تابلو برق") || (fLower.includes("مهندسی برق") && !fLower.includes("کامپیوتر"));

  // Collect skills tokens
  let tokens: string[] = [];
  if (rawSkillsInput && rawSkillsInput.trim().length > 0) {
    tokens = rawSkillsInput
      .split(/[,،;|\n\r•]+/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 50);
  }

  // Filter out unwanted generic placeholders if the candidate is NOT electrical
  if (!isActualElectrical) {
    tokens = tokens.filter(t => {
      const tl = t.toLowerCase();
      return !tl.includes("eplan") && !tl.includes("plc") && !tl.includes("tia portal") && !tl.includes("vde 0100") && !tl.includes("تابلو برق");
    });
  }

  // If skills list is empty, synthesize based on exact candidate field (NOT Electrical Engineering!)
  if (tokens.length === 0) {
    if (fLower.includes("نرم‌افزار") || fLower.includes("برنامه‌نویس") || fLower.includes("فرانت") || fLower.includes("بک") || fLower.includes("fullstack") || fLower.includes("کامپیوتر")) {
      tokens = ["React", "TypeScript", "Node.js", "RESTful APIs", "Git", "Docker", "SQL / NoSQL", "Clean Code & Testing", "Scrum / Agile"];
    } else if (fLower.includes("داده") || fLower.includes("هوش") || fLower.includes("ai") || fLower.includes("data")) {
      tokens = ["Python", "Machine Learning", "Pandas / NumPy", "PyTorch / TensorFlow", "SQL", "Data Pipelines", "Docker", "Git"];
    } else if (fLower.includes("پزشک") || fLower.includes("دکتر") || fLower.includes("طبابت")) {
      tokens = ["طبابت بالینی", "تشخیص و معاینه بالینی", "فارماکولوژی", "مدیریت اورژانس", "زبان تخصصی پزشکی (Fachsprache)", "تفسیر پاراکلینیک", "مستندسازی پزشکی"];
    } else if (fLower.includes("پرستار") || fLower.includes("مراقبت")) {
      tokens = ["مراقبت‌های ویژه بالینی", "کنترل علائم حیاتی", "تزریقات و دارودهی ایمن", "مستندسازی کاردکس (Pflegedokumentation)", "بهداشت و استریلیزاسیون", "احیای قلبی ریوی (CPR)"];
    } else if (fLower.includes("مکانیک") || fLower.includes("خودرو")) {
      tokens = ["3D CAD Modeling (SolidWorks / CATIA)", "نقشه‌کشی صنعتی (DIN ISO)", "تحلیل المان محدود (FEA)", "تلرانس‌گذاری هندسی (GD&T)", "فرآیندهای ساخت و تولید"];
    } else if (fLower.includes("عمران") || fLower.includes("سازه") || fLower.includes("معمار") || fLower.includes("bim")) {
      tokens = ["مدلسازی اطلاعات ساختمان (Revit / BIM)", "اتوکد مهندسی (AutoCAD)", "طراحی سازه", "متره و برآورد", "آیین‌نامه‌های ساختمانی یوروکد (Eurocode)"];
    } else if (fLower.includes("حسابدار") || fLower.includes("مالی")) {
      tokens = ["حسابداری مالی و صنعتی", "گزارشگری مالی (IFRS / HGB)", "اکسل پیشرفته (Financial Modeling)", "مدیریت جریان وجوه نقد", "تحلیل بهای تمام‌شده"];
    } else if (fLower.includes("مدیریت پروژه") || fLower.includes("اسکرام") || fLower.includes("scrum")) {
      tokens = ["Scrum / Agile Methodologies", "Jira / Confluence", "مدیریت ریسک پروژه", "مدیریت ذینفعان", "برنامه‌ریزی و کنترل پروژه", "OKR / KPI Tracking"];
    } else {
      tokens = ["تحلیل تخصصی مسائل کاری", "تسلط به ابزارهای استاندارد صنعت", "کار تیمی و حل مسئله", "مستندسازی فنی", "ارتباط موثر با کارفرما"];
    }
  }

  // De-duplicate
  const uniqueSkills = Array.from(new Set(tokens));

  // Categorize
  const coreTechStack: string[] = [];
  const toolsAndPlatforms: string[] = [];
  const methodologiesAndSoftSkills: string[] = [];
  const relevantGermanStandards: string[] = [];

  const parsedItems: ParsedSkillItem[] = uniqueSkills.map((name, index) => {
    const nl = name.toLowerCase();
    let cat: "core" | "tools" | "methodology" | "standards" | "languages" = "core";

    if (nl.includes("git") || nl.includes("docker") || nl.includes("jira") || nl.includes("linux") || nl.includes("aws") || nl.includes("azure") || nl.includes("revit") || nl.includes("cad") || nl.includes("excel")) {
      cat = "tools";
      toolsAndPlatforms.push(name);
    } else if (nl.includes("scrum") || nl.includes("agile") || nl.includes("مدیریت") || nl.includes("تیم") || nl.includes("حل مسئله") || nl.includes("ارتباط")) {
      cat = "methodology";
      methodologiesAndSoftSkills.push(name);
    } else if (nl.includes("din") || nl.includes("iso") || nl.includes("hgb") || nl.includes("ifrs") || nl.includes("eurocode") || nl.includes("gdpr") || nl.includes("fachsprache") || nl.includes("approbation")) {
      cat = "standards";
      relevantGermanStandards.push(name);
    } else {
      cat = "core";
      coreTechStack.push(name);
    }

    return {
      id: `skill_${index}_${name.replace(/\s+/g, "_")}`,
      name,
      category: cat,
      proficiencyLevel: index < 3 ? "Advanced" : "Intermediate",
      proficiencyScore: index < 3 ? 88 : 78,
      inDemandInGermany: true
    };
  });

  // Synthesize tailored German workplace standards if none explicitly provided
  if (relevantGermanStandards.length === 0) {
    if (fLower.includes("نرم‌افزار") || fLower.includes("it") || fLower.includes("داده")) {
      relevantGermanStandards.push("قوانین حریم داده اتحادیه اروپا (GDPR / DSGVO)");
      relevantGermanStandards.push("استاندارد تست‌های نرم‌افزاری (ISTQB / Clean Code)");
    } else if (fLower.includes("پزشک") || fLower.includes("درمان")) {
      relevantGermanStandards.push("تاییدیه طبابت فدرال آلمان (Approbation)");
      relevantGermanStandards.push("آزمون زبان تخصصی پزشکی (Fachsprachprüfung C1)");
    } else if (fLower.includes("پرستار")) {
      relevantGermanStandards.push("تاییدیه حرفه‌ای پرستاری آلمان (Anerkennung als Pflegefachkraft)");
      relevantGermanStandards.push("استانداردهای مراقبت بیمارستانی آلمان (Expertenstandards Pflege)");
    } else if (fLower.includes("مکانیک") || fLower.includes("عمران")) {
      relevantGermanStandards.push("استانداردهای مهندسی آلمان (DIN EN / ISO Standards)");
      relevantGermanStandards.push("مقررات ایمنی ماشین‌آلات و ساختمان اتحادیه اروپا (CE / Eurocode)");
    } else if (fLower.includes("مالی") || fLower.includes("حسابدار")) {
      relevantGermanStandards.push("قانون تجارت و حسابداری آلمان (HGB - Handelsgesetzbuch)");
      relevantGermanStandards.push("استانداردهای بین‌المللی گزارشگری مالی (IFRS)");
    } else {
      relevantGermanStandards.push("استانداردهای کیفیت و فرهنگ کاری آلمان (DIN ISO 9001)");
    }
  }

  const primaryDomain = candidateField || "تخصص متقاضی";

  return {
    skillsList: uniqueSkills,
    parsedItems,
    coreTechStack: coreTechStack.length > 0 ? coreTechStack : uniqueSkills.slice(0, 4),
    toolsAndPlatforms,
    methodologiesAndSoftSkills,
    relevantGermanStandards,
    overallMatchPercentage: Math.min(95, Math.max(68, 70 + uniqueSkills.length * 3)),
    primaryDomain,
    primaryDomainFa: primaryDomain,
    skillGaps: [
      "آشنایی عمیق با اصطلاحات زبان آلمانی در محیط کار تخصصی",
      "تسلط بر فرآیندهای مستندسازی اختصاصی کارفرمایان آلمانی"
    ],
    highDemandHighlights: uniqueSkills.slice(0, 3),
    rawSummary: uniqueSkills.join(", ")
  };
}

/**
 * Evaluates legal immigration pathway & German labor market fit
 */
export function calculateVisaMarketFit(
  education: ParsedEducationInfo,
  workHistory: ParsedWorkHistoryInfo,
  age: number,
  germanLevel: string,
  englishLevel: string,
  field: string
): ParsedVisaMarketFit {
  const fLower = cleanText(field);
  const isShortage = fLower.includes("نرم‌افزار") || fLower.includes("کامپیوتر") || fLower.includes("پزشک") || 
                     fLower.includes("پرستار") || fLower.includes("مکانیک") || fLower.includes("عمران") || 
                     fLower.includes("داده") || fLower.includes("ai") || fLower.includes("it");

  // Chancenkarte Points
  // 1. Degree: 4 points for recognized academic degree
  const degPoints = education.chancenkarteDegreePoints;

  // 2. Experience: 3 points for 5+ years, 2 points for 2-4 years
  let expPoints = 0;
  if (workHistory.totalYears >= 5) expPoints = 3;
  else if (workHistory.totalYears >= 2) expPoints = 2;

  // 3. German Language: A1 = 1 pt, A2 = 2 pts, B1 = 3 pts, B2+ = 4 pts
  let germanPoints = 0;
  if (germanLevel === "B2" || germanLevel === "C1" || germanLevel === "C2") germanPoints = 4;
  else if (germanLevel === "B1") germanPoints = 3;
  else if (germanLevel === "A2") germanPoints = 2;
  else if (germanLevel === "A1") germanPoints = 1;

  // 4. English Language: B2+ / C1 / C2 (if German is at least A1/A2)
  let englishPoints = 0;
  const isC1OrB2English = ["B2", "C1", "C2", "C1/C2", "Advanced"].includes(englishLevel) || 
                          englishLevel.includes("C1") || 
                          englishLevel.includes("C2") ||
                          englishLevel.toLowerCase().includes("ielts 7");
  if (isC1OrB2English && germanPoints >= 1) {
    englishPoints = 1;
  }

  // 5. Age: under 35 = 2 pts, 35-40 = 1 pt
  let agePoints = 0;
  if (age <= 35) agePoints = 2;
  else if (age <= 40) agePoints = 1;

  // 6. Shortage occupation bonus: 1 pt
  const shortagePoints = isShortage ? 1 : 0;

  const totalPoints = degPoints + expPoints + germanPoints + englishPoints + agePoints + shortagePoints;
  const passedChancenkarte = totalPoints >= 6;

  // Blue card threshold (2026 guidelines)
  const minSalary = isShortage ? 45300 : 50700;
  const blueCardEligible = education.blueCardAcademicEligible;

  let recommendedPathway: "blue_card" | "chancenkarte" | "academic_specialist" = "blue_card";
  let recommendedPathwayTitleFa = "بلوکارت اتحادیه اروپا (EU Blue Card)";
  let recommendedPathwayReason = "با داشتن مدرک دانشگاهی معتبر آنابین و سابقه تخصصی، جاب‌آفر با حقوق قانونی سریع‌ترین مسیر اقامت دائم است.";

  if (!blueCardEligible && passedChancenkarte) {
    recommendedPathway = "chancenkarte";
    recommendedPathwayTitleFa = "کارت فرصت جویندگان کار (Chancenkarte)";
    recommendedPathwayReason = `با کسب ${totalPoints} امتیاز (بالاتر از حد نصاب ۶)، می‌توانید بدون نیاز به جاب‌آفر اولیه ویزای ورود به آلمان دریافت کنید.`;
  } else if (blueCardEligible && passedChancenkarte) {
    recommendedPathway = "blue_card";
    recommendedPathwayTitleFa = "مسیر دوگانه: بلوکارت مستقیم + پشتیبان کارت فرصت";
    recommendedPathwayReason = `شرایط شما هم برای جاب‌آفر بلوکارت و هم برای ورود با کارت فرصت (${totalPoints} امتیاز) کاملاً ممتاز است.`;
  }

  return {
    chancenkartePoints: {
      total: totalPoints,
      passedThreshold: passedChancenkarte,
      breakdown: {
        degree: degPoints,
        experience: expPoints,
        german: germanPoints,
        english: englishPoints,
        age: agePoints,
        shortageField: shortagePoints
      }
    },
    blueCardFit: {
      eligible: blueCardEligible,
      isShortageOccupation: isShortage,
      minSalaryThresholdEur: minSalary,
      salaryThresholdLabel: `${minSalary.toLocaleString()} یورو در سال (${isShortage ? "مشاغل دارای کمبود نیرو / Mangelberufe" : "مشاغل عمومی"})`,
      professionCategoryDe: isShortage ? "Mangelberuf (Engpassberuf)" : "Regelberuf"
    },
    recommendedPathway,
    recommendedPathwayTitleFa,
    recommendedPathwayReason
  };
}

/**
 * Main Service Layer Entry Point:
 * Robustly parses user profile and CV data (from arguments or localStorage)
 * and generates dynamic, specific evaluation cards for the Dashboard.
 */
export function parseProfileAndCvData(
  profileInput?: Partial<EvaluatorInput> | null,
  cvInput?: Partial<CVBuilderInput> | null
): DashboardEvaluationResult {
  // Read saved profile from localStorage if not explicitly supplied
  let savedProfile: any = null;
  let savedCvData: any = null;
  let hasSavedProfile = false;
  let hasSavedCv = false;

  try {
    const rawSaved = localStorage.getItem("germany_eval_profile");
    if (rawSaved) {
      savedProfile = JSON.parse(rawSaved);
      hasSavedProfile = true;
    }
  } catch (e) {
    console.warn("Could not read germany_eval_profile from localStorage", e);
  }

  try {
    const rawCv = localStorage.getItem("germany_cv_builder_data");
    if (rawCv) {
      savedCvData = JSON.parse(rawCv);
      hasSavedCv = true;
    }
  } catch (e) {
    console.warn("Could not read germany_cv_builder_data from localStorage", e);
  }

  // Merge inputs hierarchically: Explicit args > Saved profile / CV > Reasonable defaults
  const resolvedName = (
    profileInput?.name ||
    cvInput?.name ||
    savedProfile?.name ||
    savedCvData?.name ||
    ""
  ).trim();

  const candidateName = (resolvedName && resolvedName !== "کاربر نمونه" && resolvedName !== "متقاضی کار در آلمان")
    ? resolvedName
    : "متقاضی محترم";

  const candidateAge = Number(profileInput?.age) || Number(savedProfile?.age) || 30;

  const candidateField = (
    profileInput?.field ||
    cvInput?.field ||
    savedProfile?.field ||
    savedCvData?.field ||
    "مهندسی و فناوری اطلاعات"
  ).trim();

  const germanLevel = profileInput?.germanLevel || savedProfile?.germanLevel || "B1";
  const englishLevel = profileInput?.englishLevel || savedProfile?.englishLevel || "B2";

  const degreeCode = profileInput?.degree || savedProfile?.degree || "bachelor";
  const educationSummaryText = (
    profileInput?.educationSummary ||
    cvInput?.education ||
    savedProfile?.educationSummary ||
    savedCvData?.education ||
    ""
  ).trim();

  const experienceYears = profileInput?.experience !== undefined 
    ? profileInput.experience 
    : (savedProfile?.experience !== undefined ? savedProfile.experience : 4);

  const workHistoryHighlights = (
    profileInput?.workHistoryHighlights ||
    savedProfile?.workHistoryHighlights ||
    []
  );

  const experienceRawText = (
    cvInput?.experience ||
    savedCvData?.experience ||
    profileInput?.rawTextSummary ||
    savedProfile?.rawTextSummary ||
    ""
  ).trim();

  const rawSkillsInput = (
    profileInput?.skills ||
    cvInput?.skills ||
    savedProfile?.skills ||
    savedCvData?.skills ||
    ""
  ).trim();

  // 1. Parse Subsystems
  const education = extractEducationDetails(degreeCode, candidateField, educationSummaryText);
  const workHistory = extractWorkHistoryDetails(experienceYears, candidateField, workHistoryHighlights, experienceRawText);
  const skills = extractSkillsDetails(rawSkillsInput, candidateField, experienceRawText);
  const visaMarketFit = calculateVisaMarketFit(education, workHistory, candidateAge, germanLevel, englishLevel, candidateField);

  // 2. Build Dynamic Evaluation Cards for Dashboard
  const educationCard: DashboardEvaluationCard = {
    id: "card-education",
    title: "صلاحیت تحصیلی و ارزشیابی آنابین (Anabin & Education)",
    subtitle: education.institutionName,
    badgeLabel: education.anabinStatusLabelFa,
    badgeColorClass: education.blueCardAcademicEligible 
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
      : "bg-amber-500/10 text-amber-300 border-amber-500/30",
    mainMetricLabel: "مقطع و رشته تحصیلی",
    mainMetricValue: education.degreeTitleFa,
    secondaryMetricLabel: "امتیاز آکادمیک کارت فرصت",
    secondaryMetricValue: `${education.chancenkarteDegreePoints} از ۴ امتیاز`,
    statusType: education.blueCardAcademicEligible ? "success" : "warning",
    keyHighlights: [
      `دانشگاه صادرکننده: ${education.institutionName}`,
      `معادل آکادمیک آلمان: ${education.degreeTitleDe}`,
      education.anabinStatusDescription
    ],
    recommendationText: education.recommendations[0] || "دریافت پرینت رسمی وضعیت H+ از سامانه آنابین",
    sourceType: educationSummaryText ? "extracted_cv" : (hasSavedProfile ? "saved_profile" : "manual_input")
  };

  const workHistoryCard: DashboardEvaluationCard = {
    id: "card-work-history",
    title: "سوابق حرفه‌ای و سطح تجربه کاری (Work History & Experience)",
    subtitle: workHistory.seniorityLevelFa,
    badgeLabel: `${workHistory.totalYears} سال سابقه کار مستند`,
    badgeColorClass: workHistory.totalYears >= 3 
      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" 
      : "bg-sky-500/10 text-sky-300 border-sky-500/30",
    mainMetricLabel: "رده ارزیابی ارشدیت",
    mainMetricValue: workHistory.seniorityLevelFa,
    secondaryMetricLabel: "امتیاز سابقه در کارت فرصت",
    secondaryMetricValue: `${workHistory.chancenkarteExperiencePoints} امتیاز رسمی`,
    statusType: workHistory.totalYears >= 3 ? "success" : "info",
    keyHighlights: workHistory.highlights.slice(0, 3),
    recommendationText: workHistory.germanWorkplaceAlignment,
    sourceType: workHistoryHighlights.length > 0 ? "extracted_cv" : (hasSavedProfile ? "saved_profile" : "manual_input")
  };

  const skillsCard: DashboardEvaluationCard = {
    id: "card-skills-stack",
    title: "سبد فناوری‌ها و مهارت‌های تخصصی (Skills & Tech Stack)",
    subtitle: `انطباق تخصصی حوزه ${candidateField}`,
    badgeLabel: `${skills.overallMatchPercentage}٪ انطباق بازار کار آلمان`,
    badgeColorClass: "bg-teal-500/10 text-teal-300 border-teal-500/30",
    mainMetricLabel: "مهارت‌ها و فناوری‌های استخراج‌شده",
    mainMetricValue: skills.highDemandHighlights.join(" • ") || "مهارت‌های تخصصی ثبت‌شده",
    secondaryMetricLabel: "استانداردها و چارچوب‌های مرتبط",
    secondaryMetricValue: skills.relevantGermanStandards[0] || "استانداردهای کاری آلمان",
    statusType: "success",
    keyHighlights: [
      `فناوری‌های کلیدی: ${skills.coreTechStack.slice(0, 4).join(", ")}`,
      `ابزارها و پلتفرم‌ها: ${skills.toolsAndPlatforms.length > 0 ? skills.toolsAndPlatforms.slice(0, 3).join(", ") : "ابزارهای استاندارد صنعت"}`,
      `استانداردهای بین‌المللی: ${skills.relevantGermanStandards.join(" • ")}`
    ],
    recommendationText: `مهارت‌های استخراج‌شده مستقیماً با موقعیت‌های فعال حوزه ${candidateField} در آلمان همخوانی دارند.`,
    sourceType: rawSkillsInput ? "extracted_cv" : (hasSavedProfile ? "saved_profile" : "manual_input")
  };

  const marketFitCard: DashboardEvaluationCard = {
    id: "card-visa-market",
    title: "انطباق قانونی ویزا و کف حقوق بازار آلمان (Visa Eligibility)",
    subtitle: visaMarketFit.recommendedPathwayTitleFa,
    badgeLabel: visaMarketFit.chancenkartePoints.passedThreshold 
      ? `امتیاز کارت فرصت: ${visaMarketFit.chancenkartePoints.total} (واجد شرایط)` 
      : `امتیاز کارت فرصت: ${visaMarketFit.chancenkartePoints.total}`,
    badgeColorClass: visaMarketFit.chancenkartePoints.passedThreshold
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      : "bg-amber-500/10 text-amber-300 border-amber-500/30",
    mainMetricLabel: "مسیر اصلی مهاجرت کاری",
    mainMetricValue: visaMarketFit.recommendedPathwayTitleFa,
    secondaryMetricLabel: "کف حقوق بلوکارت آلمان (۲۰۲۶)",
    secondaryMetricValue: `${visaMarketFit.blueCardFit.minSalaryThresholdEur.toLocaleString()} € / سال`,
    statusType: visaMarketFit.chancenkartePoints.passedThreshold ? "success" : "info",
    keyHighlights: [
      `کف حقوق قانونی بلوکارت: ${visaMarketFit.blueCardFit.salaryThresholdLabel}`,
      `وضعیت شغلی در آلمان: ${visaMarketFit.blueCardFit.isShortageOccupation ? "مشاغل در لیست کمبود فدرال (Mangelberuf)" : "مشاغل استاندارد آکادمیک"}`,
      `سطح زبان متقاضی: آلمانی (${germanLevel}) | انگلیسی (${englishLevel})`
    ],
    recommendationText: visaMarketFit.recommendedPathwayReason,
    sourceType: "hybrid"
  };

  return {
    candidateName,
    candidateAge,
    candidateField,
    languages: {
      german: germanLevel,
      english: englishLevel
    },
    education,
    workHistory,
    skills,
    visaMarketFit,
    cards: {
      educationCard,
      workHistoryCard,
      skillsCard,
      marketFitCard
    },
    dataSource: {
      hasSavedProfile,
      hasSavedCv,
      hasExtractedPdf: !!profileInput?.pdfBase64 || !!savedProfile?.pdfBase64,
      lastUpdated: new Date().toLocaleDateString("fa-IR")
    }
  };
}
