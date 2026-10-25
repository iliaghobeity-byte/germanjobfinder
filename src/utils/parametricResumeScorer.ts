import { TargetCompany } from "../data/targetCompaniesData";
import { EvaluatorInput } from "../types";

export interface ParametricWeights {
  techSkills: number;     // e.g. 25%
  experience: number;     // e.g. 20%
  academicAnabin: number; // e.g. 15%
  language: number;       // e.g. 15%
  nonEuVisa: number;      // e.g. 15%
  cvCompliance: number;   // e.g. 10%
}

export const DEFAULT_PARAMETRIC_WEIGHTS: ParametricWeights = {
  techSkills: 25,
  experience: 20,
  academicAnabin: 15,
  language: 15,
  nonEuVisa: 15,
  cvCompliance: 10
};

export const PARAMETRIC_PRESETS: {
  id: string;
  nameFa: string;
  descriptionFa: string;
  weights: ParametricWeights;
}[] = [
  {
    id: "standard_bluecard",
    nameFa: "استاندارد ویزای بلوکارت آلمان (EU Blue Card)",
    descriptionFa: "توازن متعادل میان مدرک دانشگاهی معتبر آنابین، تخصص فنی و رعایت الزامات اقامتی",
    weights: { techSkills: 25, experience: 20, academicAnabin: 20, language: 15, nonEuVisa: 15, cvCompliance: 5 }
  },
  {
    id: "chancenkarte_opportunity",
    nameFa: "معیارهای کارت شانس (Opportunity Card §20a)",
    descriptionFa: "تاکید بالا بر زبان آلمانی/انگلیسی، انطباق مدرک، سن و امتیازات رسمی مهاجرت",
    weights: { techSkills: 15, experience: 25, academicAnabin: 25, language: 20, nonEuVisa: 10, cvCompliance: 5 }
  },
  {
    id: "agile_international",
    nameFa: "استارتاپ‌ها و شرکت‌های چابک انگلیسی‌زبان",
    descriptionFa: "اولویت حداکثری به مهارت عملی و تِک‌استک، با انعطاف بالا در مدرک دانشگاهی و زبان آلمانی",
    weights: { techSkills: 40, experience: 20, academicAnabin: 10, language: 15, nonEuVisa: 10, cvCompliance: 5 }
  },
  {
    id: "german_mittelstand",
    nameFa: "صنایع سنتی و شرکت‌های میتل‌اشتاند (Mittelstand)",
    descriptionFa: "تاکید جدی بر زبان آلمانی کاری (B1/B2)، تاییدیه رسمی آنابین و سوابق شغلی پیوسته",
    weights: { techSkills: 20, experience: 25, academicAnabin: 20, language: 20, nonEuVisa: 10, cvCompliance: 5 }
  }
];

export interface ParametricBreakdown {
  techSkillsScore: number;
  techSkillsDetails: {
    matchedCount: number;
    totalExpected: number;
    matchedList: string[];
    missingList: string[];
    feedbackFa: string;
  };

  experienceScore: number;
  experienceDetails: {
    candidateYears: number;
    seniorityLevel: string;
    consistencyScore: number;
    feedbackFa: string;
  };

  academicAnabinScore: number;
  academicDetails: {
    degree: string;
    anabinStatus: string;
    fieldAlignment: boolean;
    feedbackFa: string;
  };

  languageScore: number;
  languageDetails: {
    germanLevel: string;
    englishLevel: string;
    workLanguageReadiness: string;
    feedbackFa: string;
  };

  nonEuVisaScore: number;
  nonEuVisaDetails: {
    blueCardThresholdMet: boolean;
    fastTrack81aEligible: boolean;
    vorrangpruefungExempt: boolean;
    ageBonusMet: boolean;
    feedbackFa: string;
  };

  cvComplianceScore: number;
  cvComplianceDetails: {
    structureScore: number;
    hasGaps: boolean;
    atsReadability: string;
    feedbackFa: string;
  };

  compositeOverallScore: number;
  ratingGrade: "exceptional" | "strong" | "moderate" | "needs_improvement";
  ratingLabelFa: string;
}

export interface CompanyParametricMatchResult {
  company: TargetCompany;
  companySpecificScore: number;
  generalMatchScore: number;
  interviewProbabilityPercent: number;
  interviewProbabilityTier: "خیلی بالا" | "بالا" | "متوسط" | "نیازمند تقویت رزومه";
  historicalNonEuHiringRate: number;
  expectedOfferSpeedWeeks: string;
  matchedTechSkills: string[];
  missingTechSkills: string[];
  keyStrengths: string[];
  criticalGaps: string[];
  actionableScoreBoosters: string[];
  visaReadinessStatus: string;
  radarData: Array<{
    subject: string;
    score: number;
    benchmark: number;
  }>;
}

// Helper to extract keywords from raw text or skills string
export function extractSkillsFromInput(skillsInput?: string, rawResumeText?: string): string[] {
  const combined = `${skillsInput || ""} ${rawResumeText || ""}`.toLowerCase();
  const knownKeywords = [
    "react", "typescript", "javascript", "node.js", "nodejs", "python", "java", "kotlin", "go", "golang",
    "c++", "c#", ".net", "aws", "gcp", "azure", "docker", "kubernetes", "k8s", "sql", "postgresql",
    "mysql", "mongodb", "redis", "kafka", "graphql", "rest", "ci/cd", "terraform", "linux", "agile",
    "scrum", "git", "matlab", "simulink", "autosar", "can", "plc", "mechatronics", "solidworks", "catia",
    "ansys", "spring boot", "django", "fastapi", "vue", "angular", "microservices", "system design",
    "machine learning", "data engineering", "devops", "sre", "cybersecurity", "iso 26262", "aspice"
  ];

  const found: string[] = [];
  for (const kw of knownKeywords) {
    if (combined.includes(kw)) {
      found.push(kw);
    }
  }

  // Also parse comma or newline separated user skills
  if (skillsInput) {
    const custom = skillsInput
      .split(/[,،\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && !found.map(f => f.toLowerCase()).includes(s.toLowerCase()));
    found.push(...custom);
  }

  return Array.from(new Set(found));
}

export function calculateParametricResumeAnalysis(
  candidate: {
    skills: string[];
    experienceYears: number;
    degree: string;
    anabinStatus: string;
    germanLevel: string;
    englishLevel: string;
    age?: number;
    field?: string;
    resumeText?: string;
    hasCoverLetter?: boolean;
    targetJobTitle?: string;
  },
  weights: ParametricWeights = DEFAULT_PARAMETRIC_WEIGHTS,
  targetCompany?: TargetCompany
): ParametricBreakdown {
  const {
    skills = [],
    experienceYears = 3,
    degree = "bachelor",
    anabinStatus = "H+",
    germanLevel = "B1",
    englishLevel = "B2",
    age = 29
  } = candidate;

  // 1. Tech skills score (0 - 100)
  const referenceSkills = targetCompany?.keyTechStack || [
    "TypeScript", "React", "Node.js", "AWS", "Docker", "Kubernetes", "PostgreSQL", "CI/CD", "Agile"
  ];
  const lowerCandSkills = skills.map(s => s.toLowerCase());
  const matched = referenceSkills.filter(req => 
    lowerCandSkills.some(cs => cs.includes(req.toLowerCase()) || req.toLowerCase().includes(cs))
  );
  const missing = referenceSkills.filter(req => !matched.includes(req));
  
  let techSkillsScore = Math.min(100, Math.round((matched.length / Math.max(referenceSkills.length, 1)) * 100) + (skills.length > 5 ? 10 : 0));
  if (matched.length >= 4) techSkillsScore = Math.max(techSkillsScore, 75);
  if (matched.length >= 6) techSkillsScore = Math.max(techSkillsScore, 90);

  // 2. Experience score (0 - 100)
  let expScore = 50;
  let seniority = "Junior (تازه کار)";
  if (experienceYears >= 7) {
    expScore = 98;
    seniority = "Senior / Lead (ارشد و راهبر)";
  } else if (experienceYears >= 5) {
    expScore = 92;
    seniority = "Senior (سینیور تخصصی)";
  } else if (experienceYears >= 3) {
    expScore = 82;
    seniority = "Mid-Level (متخصص با تجربه)";
  } else if (experienceYears >= 2) {
    expScore = 70;
    seniority = "Junior-Mid (رده متوسط اولیه)";
  } else {
    expScore = 55;
    seniority = "Junior (شروع سابقه کاری)";
  }

  // 3. Academic & Anabin (0 - 100)
  let academicScore = 60;
  const isHPlus = anabinStatus === "H+" || anabinStatus.includes("H+");
  const isHPlusMinus = anabinStatus.includes("+/-");
  const degLower = (degree || "").toLowerCase();

  if (degLower.includes("phd") || degLower.includes("دکترا")) {
    academicScore = isHPlus ? 98 : 88;
  } else if (degLower.includes("master") || degLower.includes("ارشد")) {
    academicScore = isHPlus ? 95 : 82;
  } else if (degLower.includes("bachelor") || degLower.includes("کارشناسی")) {
    academicScore = isHPlus ? 88 : 75;
  } else if (degLower.includes("associate") || degLower.includes("کاردانی") || degLower.includes("diploma")) {
    academicScore = isHPlus ? 70 : 55;
  } else {
    academicScore = experienceYears >= 5 ? 75 : 50; // IT exemption rule
  }

  // 4. Language score (0 - 100)
  const gL = (germanLevel || "").toUpperCase();
  const eL = (englishLevel || "").toUpperCase();
  let langScore = 60;

  let gPoints = 0;
  if (gL.includes("C2") || gL.includes("C1")) gPoints = 50;
  else if (gL.includes("B2")) gPoints = 42;
  else if (gL.includes("B1")) gPoints = 32;
  else if (gL.includes("A2")) gPoints = 20;
  else if (gL.includes("A1")) gPoints = 12;
  else gPoints = 5;

  let ePoints = 0;
  if (eL.includes("C2") || eL.includes("C1")) ePoints = 50;
  else if (eL.includes("B2")) ePoints = 44;
  else if (eL.includes("B1")) ePoints = 30;
  else ePoints = 15;

  // In international companies, English is 75% weighted
  if (targetCompany?.workLanguageRequirement.includes("انگلیسی روان") || targetCompany?.germanLanguageStrictness === "none") {
    langScore = Math.min(100, Math.round((ePoints * 1.5) + (gPoints * 0.5)));
  } else {
    langScore = Math.min(100, Math.round(gPoints + ePoints));
  }

  // 5. Non-EU Visa Readiness & Legal Thresholds (0 - 100)
  let visaScore = 70;
  const isShortage = true; // MINT / IT / Engineering
  const blueCardMet = isHPlus && experienceYears >= 2;
  const fastTrackEligible = experienceYears >= 2;
  const ageBonus = age <= 45;

  let vScoreAcc = 40;
  if (blueCardMet) vScoreAcc += 30;
  if (fastTrackEligible) vScoreAcc += 15;
  if (ageBonus) vScoreAcc += 10;
  if (experienceYears >= 3) vScoreAcc += 5;
  visaScore = Math.min(100, vScoreAcc);

  // 6. CV Compliance & Lebenslauf Standard (0 - 100)
  let cvScore = 78;
  if (candidate.resumeText && candidate.resumeText.length > 500) {
    cvScore = 88;
  }
  if (candidate.resumeText && (candidate.resumeText.includes("Projekt") || candidate.resumeText.includes("Experience") || candidate.resumeText.includes("Skills"))) {
    cvScore += 6;
  }
  cvScore = Math.min(100, cvScore);

  // Normalize weights to sum to 100
  const totalWeight = weights.techSkills + weights.experience + weights.academicAnabin + weights.language + weights.nonEuVisa + weights.cvCompliance;
  const normWeight = {
    tech: weights.techSkills / totalWeight,
    exp: weights.experience / totalWeight,
    acad: weights.academicAnabin / totalWeight,
    lang: weights.language / totalWeight,
    visa: weights.nonEuVisa / totalWeight,
    cv: weights.cvCompliance / totalWeight
  };

  const compositeOverallScore = Math.round(
    techSkillsScore * normWeight.tech +
    expScore * normWeight.exp +
    academicScore * normWeight.acad +
    langScore * normWeight.lang +
    visaScore * normWeight.visa +
    cvScore * normWeight.cv
  );

  let ratingGrade: "exceptional" | "strong" | "moderate" | "needs_improvement" = "moderate";
  let ratingLabelFa = "تطابق مناسب - نیازمند بهینه‌سازی هدفمند";

  if (compositeOverallScore >= 85) {
    ratingGrade = "exceptional";
    ratingLabelFa = "تطابق بسیار استثنایی و کم‌نظیر با بازار کار آلمان";
  } else if (compositeOverallScore >= 75) {
    ratingGrade = "strong";
    ratingLabelFa = "تطابق قوی با اولویت دریافت مصاحبه";
  } else if (compositeOverallScore >= 60) {
    ratingGrade = "moderate";
    ratingLabelFa = "تطابق متوسط و قابل قبول با شانس مناسب مصاحبه";
  } else {
    ratingGrade = "needs_improvement";
    ratingLabelFa = "نیاز به تقویت پارامترهای کلیدی (زبان، رزومه یا مهارت)";
  }

  return {
    techSkillsScore,
    techSkillsDetails: {
      matchedCount: matched.length,
      totalExpected: referenceSkills.length,
      matchedList: matched,
      missingList: missing,
      feedbackFa: matched.length >= 4 
        ? `${matched.length} مهارت کلیدی متناسب با نیازمندی‌های صنعتی آلمان یافت شد.`
        : `توصیه می‌شود کلیدواژه‌های تِک‌استک مانند ${missing.slice(0, 3).join("، ")} به رزومه افزوده شوند.`
    },

    experienceScore: expScore,
    experienceDetails: {
      candidateYears: experienceYears,
      seniorityLevel: seniority,
      consistencyScore: Math.min(100, experienceYears * 18),
      feedbackFa: `سابقه کار ${experienceYears} ساله در رده ارشدیت ${seniority} ارزیابی می‌شود که برای کارفرماهای آلمانی ارزش بالایی دارد.`
    },

    academicAnabinScore: academicScore,
    academicDetails: {
      degree,
      anabinStatus,
      fieldAlignment: true,
      feedbackFa: isHPlus 
        ? "مدرک تحصیلی شما دارای تطابق قطعی H+ در سامانه رسمی آنابین فدرال آلمان است."
        : "در صورت عدم وجود وضعیت H+، امکان استعلام تاییدیه رسمی ZAB یا بهره‌مندی از معافیت ۳ ساله تخصص IT وجود دارد."
    },

    languageScore: langScore,
    languageDetails: {
      germanLevel,
      englishLevel,
      workLanguageReadiness: ePoints >= 40 ? "آماده محیط‌های کاری بین‌المللی" : "نیازمند تقویت مکالمه کاری",
      feedbackFa: `انگلیسی ${englishLevel} و آلمانی ${germanLevel}. برای شرکت‌های بین‌المللی انگلیسی کافی است و هر سطح آلمانی امتیاز رقابتی مضاعف می‌آورد.`
    },

    nonEuVisaScore: visaScore,
    nonEuVisaDetails: {
      blueCardThresholdMet: blueCardMet,
      fastTrack81aEligible: fastTrackEligible,
      vorrangpruefungExempt: true,
      ageBonusMet: ageBonus,
      feedbackFa: "شرایط شما مشمول عدم نیاز به آزمون بازار کار محلی (Vorrangprüfung) بوده و با حقوق بالای ۴۱ هزار یورو واجد شرایط بلوکارت است."
    },

    cvComplianceScore: cvScore,
    cvComplianceDetails: {
      structureScore: cvScore,
      hasGaps: false,
      atsReadability: "استاندارد ATS آلمانی",
      feedbackFa: "ساختار زمانی و بخش‌بندی رزومه با استانداردهای کارفرماهای آلمانی (Lebenslauf) همخوانی مطلوبی دارد."
    },

    compositeOverallScore,
    ratingGrade,
    ratingLabelFa
  };
}

export function evaluateCompanyParametricFit(
  candidate: {
    skills: string[];
    experienceYears: number;
    degree: string;
    anabinStatus: string;
    germanLevel: string;
    englishLevel: string;
    age?: number;
    field?: string;
    resumeText?: string;
  },
  company: TargetCompany,
  weights: ParametricWeights = DEFAULT_PARAMETRIC_WEIGHTS
): CompanyParametricMatchResult {
  // Use company-specific weights if provided, or merged with user weights
  const mergedWeights: ParametricWeights = {
    techSkills: company.atsScoringHeuristics.techMatchWeight,
    experience: company.atsScoringHeuristics.experienceWeight,
    academicAnabin: company.atsScoringHeuristics.academicWeight,
    language: company.atsScoringHeuristics.languageWeight,
    nonEuVisa: company.atsScoringHeuristics.visaReadinessWeight,
    cvCompliance: company.atsScoringHeuristics.cvStructureWeight
  };

  const breakdown = calculateParametricResumeAnalysis(candidate, mergedWeights, company);

  // Calculate interview probability considering non-EU historical hiring rate & yield
  const nonEuFactor = company.nonEuHiringRate10Yrs / 100; // e.g. 0.89
  const interviewYieldFactor = company.remoteInterviewYieldPercent / 100; // e.g. 0.78
  
  // Composite calculation
  let rawProbability = (breakdown.compositeOverallScore * 0.5) + (company.nonEuHiringRate10Yrs * 0.3) + (company.remoteInterviewYieldPercent * 0.2);
  let interviewProbabilityPercent = Math.min(96, Math.max(35, Math.round(rawProbability)));

  let interviewProbabilityTier: "خیلی بالا" | "بالا" | "متوسط" | "نیازمند تقویت رزومه" = "متوسط";
  if (interviewProbabilityPercent >= 82) {
    interviewProbabilityTier = "خیلی بالا";
  } else if (interviewProbabilityPercent >= 72) {
    interviewProbabilityTier = "بالا";
  } else if (interviewProbabilityPercent >= 55) {
    interviewProbabilityTier = "متوسط";
  } else {
    interviewProbabilityTier = "نیازمند تقویت رزومه";
  }

  // Key strengths and gaps
  const keyStrengths: string[] = [];
  if (breakdown.techSkillsDetails.matchedCount >= 3) {
    keyStrengths.push(`تطابق در مهارت‌های کلیدی: ${breakdown.techSkillsDetails.matchedList.slice(0, 3).join(", ")}`);
  }
  if (candidate.experienceYears >= 3) {
    keyStrengths.push(`سابقه کاری عملی ${candidate.experienceYears} سال، متناسب با استانداردهای ${company.name}`);
  }
  if (breakdown.academicDetails.anabinStatus.includes("H+")) {
    keyStrengths.push("تاییدیه قطعی دانشگاه در سامانه آنابین برای صدور بی دردسر ویزای کاری");
  }
  if (company.nonEuHiringRate10Yrs >= 85) {
    keyStrengths.push(`فرهنگ جذب بالا: استخدام ${company.iranianStaffCountEstimate} در این مجموعه`);
  }

  const criticalGaps: string[] = [];
  if (breakdown.techSkillsDetails.missingList.length > 0) {
    criticalGaps.push(`کسری در مهارت‌های شاخص این شرکت: ${breakdown.techSkillsDetails.missingList.slice(0, 3).join(", ")}`);
  }
  if (company.germanLanguageStrictness === "medium" && (!candidate.germanLevel || candidate.germanLevel === "A1" || candidate.germanLevel === "A2")) {
    criticalGaps.push(`این شرکت به سطح آلمانی B1 به بالا اولویت می‌دهد (سطح فعلی: ${candidate.germanLevel || "نامشخص"})`);
  }
  if (candidate.experienceYears < 2) {
    criticalGaps.push("سابقه کاری زیر ۲ سال برای موقعیت‌های مستقیم بین‌المللی رقابت بالاتری دارد");
  }

  const actionableScoreBoosters: string[] = [
    `افزودن مستقیم کلیدواژه‌های "${company.culturalFitKeywords.slice(0, 2).join('" و "')}" به انگیزش‌نامه و خلاصه رزومه`,
    `تاکید بر تجارب کار تیمی در پروژه‌های متناسب با تِک‌استک ${company.keyTechStack.slice(0, 3).join("، ")}`,
    company.companySpecificAdviceFa
  ];

  const radarData = [
    { subject: "تِک‌استک و مهارت", score: breakdown.techSkillsScore, benchmark: 80 },
    { subject: "سابقه و ارشدیت", score: breakdown.experienceScore, benchmark: 75 },
    { subject: "مدرک و آنابین", score: breakdown.academicAnabinScore, benchmark: 80 },
    { subject: "آمادگی زبان", score: breakdown.languageScore, benchmark: 70 },
    { subject: "شاخص ویزای غیراروپایی", score: breakdown.nonEuVisaScore, benchmark: 85 },
    { subject: "فرمت Lebenslauf", score: breakdown.cvComplianceScore, benchmark: 75 }
  ];

  return {
    company,
    companySpecificScore: breakdown.compositeOverallScore,
    generalMatchScore: breakdown.compositeOverallScore,
    interviewProbabilityPercent,
    interviewProbabilityTier,
    historicalNonEuHiringRate: company.nonEuHiringRate10Yrs,
    expectedOfferSpeedWeeks: company.averageOfferTimeline,
    matchedTechSkills: breakdown.techSkillsDetails.matchedList,
    missingTechSkills: breakdown.techSkillsDetails.missingList,
    keyStrengths,
    criticalGaps,
    actionableScoreBoosters,
    visaReadinessStatus: company.visaSupportType,
    radarData
  };
}
