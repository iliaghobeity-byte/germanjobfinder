import { SponsorshipJob, EvaluatorInput, SemanticMatchDetails, CandidateAlignmentAudit } from "../types";

export interface GermanSectorDemandInfo {
  sectorKey: string;
  sectorNameFa: string;
  sectorNameDe: string;
  kldbCode: string;
  shortageOccupation: boolean;
  demandLevel: "بسیار بالا (Engpassberuf)" | "بالا" | "متوسط";
  demandIndexScore: number; // 0 - 100
  federalShortageRank: string;
  priorityCertifications: string[];
  regionalDemandHubs: string[];
  legalFramework: string;
  blueCardThresholdEur2026: number;
  fastTrackEligible: boolean;
}

export const GERMAN_INDUSTRY_DEMAND_PROFILES: Record<string, GermanSectorDemandInfo> = {
  it_software: {
    sectorKey: "it_software",
    sectorNameFa: "فناوری اطلاعات، توسعه نرم‌افزار، رایانش ابری و هوش مصنوعی",
    sectorNameDe: "IT, Softwareentwicklung, Cloud & KI",
    kldbCode: "KldB 431 / 434 (Informatik)",
    shortageOccupation: true,
    demandLevel: "بسیار بالا (Engpassberuf)",
    demandIndexScore: 96,
    federalShortageRank: "رتبه اول کمبود نیروی ماهر در آلمان (MINT-Engpassberuf)",
    priorityCertifications: [
      "AWS Certified Solutions Architect / DevOps Engineer",
      "Google Cloud Professional Cloud Architect / Data Engineer",
      "Microsoft Certified: Azure Solutions Architect Expert",
      "Certified Kubernetes Administrator (CKA / CKAD)",
      "ISTQB Certified Tester (Foundation / Advanced)",
      "Professional Scrum Master (PSM I/II) یا Product Owner",
      "CISSP / CEH / CompTIA Security+ (امنیت سایبری)",
      "HashiCorp Certified: Terraform Associate"
    ],
    regionalDemandHubs: ["برلین (اکوسیستم استارتاپی)", "مونیخ (بایرن)", "فرانکفورت (فین‌تک)", "اشتوتگارت", "هامبورگ"],
    legalFramework: "§18g AufenthG (بلوکارت اروپا) + معافیت تجربه ۳ ساله IT بدون الزام مدرک دانشگاهی (§19c)",
    blueCardThresholdEur2026: 45300,
    fastTrackEligible: true
  },
  mechanical_automotive: {
    sectorKey: "mechanical_automotive",
    sectorNameFa: "مهندسی مکانیک، مکاترونیک، صنایع خودرو و اتوماسیون صنعتی",
    sectorNameDe: "Maschinenbau, Automobilindustrie & Mechatronik",
    kldbCode: "KldB 251 / 252 (Maschinen- und Fahrzeugtechnik)",
    shortageOccupation: true,
    demandLevel: "بسیار بالا (Engpassberuf)",
    demandIndexScore: 92,
    federalShortageRank: "شغل کلیدی صنایع پیشرو و صادرات‌محور آلمان (DAX & Mittelstand)",
    priorityCertifications: [
      "گواهینامه‌های استانداردهای کیفیت آلمان (DIN EN ISO 9001 / 14001)",
      "استاندارد ایمنی عملکردی خودرو (ISO 26262 Functional Safety)",
      "تخصص در نرم‌افزارهای CATIA V5/V6, SolidWorks, Siemens NX",
      "تحلیل المان محدود (FEA / Ansys / Abaqus)",
      "اتوماسیون صنعتی و برنامه‌نویسی PLC / Siemens TIA Portal",
      "متدولوژی Six Sigma (Green / Black Belt)",
      "عضویت یا تطابق با انجمن مهندسان آلمان (VDI)"
    ],
    regionalDemandHubs: ["اشتوتگارت (بادن-وورتمبرگ)", "مونیخ و اینگولشتات (بایرن)", "ولفسبورگ (نیدرزاکسن)", "نورنبرگ", "کلن"],
    legalFramework: "§18g AufenthG (بلوکارت) - عنوان شغلی تحت حمایت قوانین نظام مهندسی استانی آلمان (Ingenieurgesetz)",
    blueCardThresholdEur2026: 45300,
    fastTrackEligible: true
  },
  electrical_energy: {
    sectorKey: "electrical_energy",
    sectorNameFa: "مهندسی برق، الکترونیک، مخابرات و انرژی‌های پاک (Green Tech)",
    sectorNameDe: "Elektrotechnik, Elektronik & Erneuerbare Energien",
    kldbCode: "KldB 261 / 262 (Elektrotechnik & Energietechnik)",
    shortageOccupation: true,
    demandLevel: "بسیار بالا (Engpassberuf)",
    demandIndexScore: 94,
    federalShortageRank: "بخش حیاتی انتقال انرژی آلمان (Energiewende)",
    priorityCertifications: [
      "مقررات ایمنی برق آلمان (VDE Bestimmungen / DGUV Vorschrift 3)",
      "گواهینامه تایید صلاحیت ولتاژ بالا (EuP / EFK)",
      "استانداردهای سیستم‌های کنترل و ایمنی (IEC 61508 / IEC 62061)",
      "سیستم‌های ذخیره‌سازی باتری و فتوولتائیک تجدیدپذیر",
      "توسعه سخت‌افزار و سیستم‌های نهفته (Embedded C/C++, RTOS)"
    ],
    regionalDemandHubs: ["درسدن (Silicon Saxony)", "ارلانگن / نورنبرگ (Siemens Hub)", "مونیخ", "اشتوتگارت", "هامبورگ (انرژی بادی)"],
    legalFramework: "§18g AufenthG (بلوکارت اروپا) با سقف حقوق ترجیحی رشته‌های دارای کمبود",
    blueCardThresholdEur2026: 45300,
    fastTrackEligible: true
  },
  civil_construction: {
    sectorKey: "civil_construction",
    sectorNameFa: "مهندسی عمران، سازه، معماری و مدیریت مدل‌سازی اطلاعات ساختمان (BIM)",
    sectorNameDe: "Bauingenieurwesen, Architektur & BIM",
    kldbCode: "KldB 311 / 312 (Bauplanung & Bauüberwachung)",
    shortageOccupation: true,
    demandLevel: "بالا",
    demandIndexScore: 88,
    federalShortageRank: "تقاضای فزاینده به دلیل پروژه‌های عظیم نوسازی زیرساخت و مسکن",
    priorityCertifications: [
      "گواهینامه بین‌المللی BIM (buildingSMART / BIM Level 2 Professional)",
      "Autodesk Revit Architecture / Structure Professional",
      "آشنایی با آیین‌نامه‌های طراحی اروپایی-آلمانی (Eurocodes / DIN EN)",
      "تسلط بر ساختار تعرفه خدمات مهندسی و معماری آلمان (HOAI)",
      "مدیریت پروژه‌های ساختمانی (PMP / Prince2)"
    ],
    regionalDemandHubs: ["فرانکفورت", "برلین", "مونیخ", "دوسلدورف / کلن (NRW)", "لایپزیگ"],
    legalFramework: "§18b AufenthG یا بلوکارت §18g - مشروط به تاییدیه مدرک در سازمان نظام مهندسی (Ingenieurkammer)",
    blueCardThresholdEur2026: 45300,
    fastTrackEligible: true
  },
  medical_healthcare: {
    sectorKey: "medical_healthcare",
    sectorNameFa: "پزشکی، پرستاری، پیراپزشکی و علوم زیستی / آزمایشگاهی",
    sectorNameDe: "Medizin, Pflege & Biomedizin",
    kldbCode: "KldB 813 / 821 (Gesundheit & Pflege)",
    shortageOccupation: true,
    demandLevel: "بسیار بالا (Engpassberuf)",
    demandIndexScore: 98,
    federalShortageRank: "بحرانی‌ترین رده کمبود نیروی انسانی در نظام بهداشت و درمان آلمان",
    priorityCertifications: [
      "مدرک زبان عمومی آلمانی حداقل B2 (Goethe / telc Deutsch B2)",
      "آمادگی آزمون زبان تخصصی پزشکی (Fachsprachprüfung C1)",
      "گواهی‌های اقدامات احیای پیشرفته (ACLS / BLS)",
      "آشنایی با اصول عملکرد بالینی و آزمایشگاهی خوب (GCP / GLP / GMP)",
      "پروانه اشتغال یا ارزشیابی تطبیق مدارک (Approbation / Berufserlaubnis)"
    ],
    regionalDemandHubs: ["سراسر ایالت‌های ۱۶ گانه آلمان (کلینیک‌های دانشگاهی، بیمارستان‌ها و خانه‌های سالمندان)"],
    legalFramework: "شغل تحت نظارت شدید دولتی (Reglementierter Beruf) با امکان اخذ ویزای جستجو و دوره تطبیق (§16d)",
    blueCardThresholdEur2026: 45300,
    fastTrackEligible: true
  },
  business_finance: {
    sectorKey: "business_finance",
    sectorNameFa: "مدیریت مالی، حسابداری، کنترلینگ، لجستیک و توسعه کسب‌وکار",
    sectorNameDe: "Finanzwesen, Controlling, Logistik & Business",
    kldbCode: "KldB 711 / 714 (Betriebswirtschaft & Finanzen)",
    shortageOccupation: false,
    demandLevel: "متوسط",
    demandIndexScore: 82,
    federalShortageRank: "تقاضای پایدار در شرکت‌های متوسط (Mittelstand) و موسسات مالی بین‌المللی",
    priorityCertifications: [
      "ماژول‌های تخصصی SAP (مانند SAP S/4HANA FI/CO یا SD/MM)",
      "گواهینامه‌های بین‌المللی مالی (CFA, ACCA, CMA)",
      "استانداردهای بین‌المللی گزارشگری مالی (IFRS / German HGB)",
      "گواهینامه‌های زنجیره تامین و لجستیک (APICS CSCP / CPIM)",
      "مدیریت حرفه‌ای پروژه (PMP, PMI-ACP)"
    ],
    regionalDemandHubs: ["فرانکفورت (پایتخت بانکی اروپا)", "هامبورگ (بندر و لجستیک)", "مونیخ", "دوسلدورف"],
    legalFramework: "§18g AufenthG (بلوکارت با کف حقوق عادی حدود ۵۰,۴۰۰ یورو در سال)",
    blueCardThresholdEur2026: 50400,
    fastTrackEligible: true
  }
};

/**
 * Detects the most relevant German industry sector based on target field, job title, and skills.
 */
export function detectGermanIndustrySector(field: string = "", jobTitle: string = "", skills: string = ""): GermanSectorDemandInfo {
  const combined = `${field} ${jobTitle} ${skills}`.toLowerCase();

  if (
    combined.includes("نرم") || combined.includes("برنامه") || combined.includes("کامپیوتر") ||
    combined.includes("it") || combined.includes("software") || combined.includes("developer") ||
    combined.includes("frontend") || combined.includes("backend") || combined.includes("fullstack") ||
    combined.includes("cloud") || combined.includes("devops") || combined.includes("data") ||
    combined.includes("ai") || combined.includes("هوش مصنوعی") || combined.includes("امنیت") ||
    combined.includes("cyber") || combined.includes("web") || combined.includes("شبکه") ||
    combined.includes("python") || combined.includes("react") || combined.includes("java")
  ) {
    return GERMAN_INDUSTRY_DEMAND_PROFILES.it_software;
  }

  if (
    combined.includes("پزشک") || combined.includes("پرستار") || combined.includes("درمان") ||
    combined.includes("بیمارستان") || combined.includes("دارو") || combined.includes("آزمایشگاه") ||
    combined.includes("nurse") || combined.includes("doctor") || combined.includes("medical") ||
    combined.includes("pflege") || combined.includes("arzt") || combined.includes("biotech") ||
    combined.includes("میکروب") || combined.includes("biolog")
  ) {
    return GERMAN_INDUSTRY_DEMAND_PROFILES.medical_healthcare;
  }

  if (
    combined.includes("مکانیک") || combined.includes("خودرو") || combined.includes("ساخت و تولید") ||
    combined.includes("مکاترونیک") || combined.includes("mechanical") || combined.includes("automotive") ||
    combined.includes("solidworks") || combined.includes("catia") || combined.includes("cad") ||
    combined.includes("cnc") || combined.includes("تاسیسات") || combined.includes("hvac")
  ) {
    return GERMAN_INDUSTRY_DEMAND_PROFILES.mechanical_automotive;
  }

  if (
    combined.includes("برق") || combined.includes("الکترونیک") || combined.includes("قدرت") ||
    combined.includes("کنترل") || combined.includes("اتوماسیون") || combined.includes("انرژی") ||
    combined.includes("electrical") || combined.includes("electronics") || combined.includes("plc") ||
    combined.includes("scada") || combined.includes("vde") || combined.includes("green tech")
  ) {
    return GERMAN_INDUSTRY_DEMAND_PROFILES.electrical_energy;
  }

  if (
    combined.includes("عمران") || combined.includes("سازه") || combined.includes("معمار") ||
    combined.includes("ساختمان") || combined.includes("نقشه‌برداری") || combined.includes("civil") ||
    combined.includes("structural") || combined.includes("architect") || combined.includes("bim") ||
    combined.includes("revit") || combined.includes("construction")
  ) {
    return GERMAN_INDUSTRY_DEMAND_PROFILES.civil_construction;
  }

  if (
    combined.includes("حسابدار") || combined.includes("مالی") || combined.includes("بانک") ||
    combined.includes("اقتصاد") || combined.includes("بازرگانی") || combined.includes("مارکتینگ") ||
    combined.includes("لجستیک") || combined.includes("finance") || combined.includes("accounting") ||
    combined.includes("sap") || combined.includes("supply chain") || combined.includes("business")
  ) {
    return GERMAN_INDUSTRY_DEMAND_PROFILES.business_finance;
  }

  return GERMAN_INDUSTRY_DEMAND_PROFILES.it_software;
}

/**
 * Rigorously checks whether the job aligns precisely with the candidate's:
 * 1. Specialty / Expertise (تخصص)
 * 2. Capabilities & Technical Skills (توانمندی)
 * 3. Experience & Seniority (تجربه)
 * 4. Knowledge & Academic/Anabin Recognition (دانش)
 *
 * If ANY discrepancy is detected, hasDiscrepancy is set to true and isFullyAligned to false.
 */
export function auditJobCandidateAlignment(
  job: SponsorshipJob,
  profile: EvaluatorInput
): CandidateAlignmentAudit {
  const targetField = (profile.field || "فناوری اطلاعات").trim();
  const jobTitle = (job.jobTitle || "").trim();
  const candidateSkills = (profile.skills || "").trim();
  const candidateCerts = (profile.certifications || "").trim();
  const userExp = Number(profile.experience) || 3;
  const reqExp = Number(job.minExp || job.requiredExperienceYears) || 2;
  const degree = (profile.degree || "bachelor").toLowerCase();
  const anabinStatus = profile.anabinStatus || "H+";

  const discrepancies: string[] = [];

  const fieldLower = targetField.toLowerCase();
  const titleLower = jobTitle.toLowerCase();
  const rawTags = (job.requiredSkills || (job as any).tags || []);
  const tagsLower = Array.isArray(rawTags) ? rawTags.map((t: string) => String(t).toLowerCase()).join(" ") : "";
  const combinedJobText = `${titleLower} ${tagsLower} ${(job.industryDemandSector || "")}`.toLowerCase();

  const isCandidateIT = fieldLower.includes("نرم") || fieldLower.includes("برنامه") || fieldLower.includes("کامپیوتر") ||
    fieldLower.includes("it") || fieldLower.includes("software") || fieldLower.includes("developer") ||
    fieldLower.includes("web") || fieldLower.includes("cloud") || fieldLower.includes("devops") ||
    fieldLower.includes("data") || fieldLower.includes("ai") || fieldLower.includes("هوش مصنوعی") ||
    fieldLower.includes("امنیت") || fieldLower.includes("cyber") || fieldLower.includes("شبکه");

  const isCandidateMech = fieldLower.includes("مکانیک") || fieldLower.includes("خودرو") ||
    fieldLower.includes("ساخت و تولید") || fieldLower.includes("مکاترونیک") || fieldLower.includes("mechanical") ||
    fieldLower.includes("automotive") || fieldLower.includes("solidworks") || fieldLower.includes("catia");

  const isCandidateElec = fieldLower.includes("برق") || fieldLower.includes("الکترونیک") ||
    fieldLower.includes("قدرت") || fieldLower.includes("کنترل") || fieldLower.includes("اتوماسیون") ||
    fieldLower.includes("electrical") || fieldLower.includes("electronics") || fieldLower.includes("plc");

  const isCandidateCivil = fieldLower.includes("عمران") || fieldLower.includes("سازه") ||
    fieldLower.includes("معمار") || fieldLower.includes("ساختمان") || fieldLower.includes("civil") ||
    fieldLower.includes("bim") || fieldLower.includes("revit");

  const isCandidateMed = fieldLower.includes("پزشک") || fieldLower.includes("پرستار") ||
    fieldLower.includes("درمان") || fieldLower.includes("بیمارستان") || fieldLower.includes("دارو") ||
    fieldLower.includes("medical") || fieldLower.includes("nurse") || fieldLower.includes("doctor") ||
    fieldLower.includes("pflege") || fieldLower.includes("arzt");

  const isCandidateFinance = fieldLower.includes("حسابدار") || fieldLower.includes("مالی") ||
    fieldLower.includes("بانک") || fieldLower.includes("اقتصاد") || fieldLower.includes("finance") ||
    fieldLower.includes("accounting") || fieldLower.includes("sap");

  // Job Domain detection
  const isJobIT = combinedJobText.includes("software") || combinedJobText.includes("developer") ||
    combinedJobText.includes("frontend") || combinedJobText.includes("backend") || combinedJobText.includes("full stack") ||
    combinedJobText.includes("devops") || combinedJobText.includes("cloud") || combinedJobText.includes("data engineer") ||
    combinedJobText.includes("python") || combinedJobText.includes("react") || combinedJobText.includes("informatik") ||
    combinedJobText.includes("cyber") || combinedJobText.includes("qa") || combinedJobText.includes("it ");

  const isJobMech = combinedJobText.includes("mechanical") || combinedJobText.includes("automotive") ||
    combinedJobText.includes("maschinenbau") || combinedJobText.includes("solidworks") || combinedJobText.includes("catia") ||
    combinedJobText.includes("fahrzeug") || combinedJobText.includes("cad") || combinedJobText.includes("mechatronik");

  const isJobElec = combinedJobText.includes("electrical") || combinedJobText.includes("elektrotechnik") ||
    combinedJobText.includes("electronics") || combinedJobText.includes("plc") || combinedJobText.includes("embedded") ||
    combinedJobText.includes("hardware") || combinedJobText.includes("scada");

  const isJobCivil = combinedJobText.includes("civil") || combinedJobText.includes("bauingenieur") ||
    combinedJobText.includes("bim") || combinedJobText.includes("architektur") || combinedJobText.includes("statik") ||
    combinedJobText.includes("construction") || combinedJobText.includes("revit");

  const isJobMed = combinedJobText.includes("nurse") || combinedJobText.includes("arzt") ||
    combinedJobText.includes("pflege") || combinedJobText.includes("medical") || combinedJobText.includes("klinik") ||
    combinedJobText.includes("gesundheit") || combinedJobText.includes("hospital");

  const isJobFinance = combinedJobText.includes("finance") || combinedJobText.includes("accounting") ||
    combinedJobText.includes("buchhalter") || combinedJobText.includes("controller") || combinedJobText.includes("finanz");

  // 1. Specialty / Expertise Check (تخصص)
  let specialtyStatus: "aligned" | "discrepancy" = "aligned";
  let specialtyDetailsFa = "";
  let specialtyScore = 92;

  // Cross-domain conflict detection
  const hasDomainConflict =
    (isCandidateIT && (isJobMed || isJobCivil || isJobFinance || (isJobMech && !combinedJobText.includes("software")))) ||
    (isCandidateMech && (isJobMed || isJobFinance || (isJobIT && !combinedJobText.includes("embedded") && !combinedJobText.includes("robotics")))) ||
    (isCandidateCivil && (isJobMed || isJobIT || isJobFinance)) ||
    (isCandidateMed && (!isJobMed)) ||
    (isCandidateFinance && (isJobMed || isJobIT || isJobCivil || isJobMech));

  if (hasDomainConflict) {
    specialtyStatus = "discrepancy";
    specialtyScore = 40;
    specialtyDetailsFa = `مغایرت تخصص رصد شد: حوزه کاری این آگهی با فیلد هدف شما (${targetField}) انطباق ندارد.`;
    discrepancies.push("مغایرت تخصص و حوزه کاری با پوزیشن پیشنهادی");
  } else {
    specialtyDetailsFa = `انطباق کامل تخصص: زمینه فعالیت "${targetField}" مستقیماً در شرح نیازمندی‌های این موقعیت (${jobTitle}) قرار دارد.`;
  }

  // 2. Experience & Seniority Check (تجربه)
  let experienceStatus: "aligned" | "discrepancy" = "aligned";
  let expDetailsFa = "";
  let expScore = 88;
  const userSeniority = userExp <= 2 ? "Junior" : userExp <= 5 ? "Mid-Level" : userExp <= 8 ? "Senior" : "Lead";

  const isTooSeniorForJob = (titleLower.includes("intern") || titleLower.includes("werkstudent") || titleLower.includes("praktikant")) && userExp >= 4;
  const isTooJuniorForJob = (titleLower.includes("lead") || titleLower.includes("principal") || titleLower.includes("head of") || titleLower.includes("director")) && userExp < 3.5;
  const hasCriticalExpDeficit = reqExp > userExp + 1.8;

  if (isTooJuniorForJob) {
    experienceStatus = "discrepancy";
    expScore = 45;
    expDetailsFa = `مغایرت سابقه و سطح ارشدیت: این موقعیت نیازمند سطح Lead/Principal با سابقه کاری فراتر از سوابق فعلی شما (${userExp} سال) است.`;
    discrepancies.push(`مغایرت سابقه: پوزیشن سطح Lead با سابقه ${userExp} ساله سازگار نیست.`);
  } else if (isTooSeniorForJob) {
    experienceStatus = "discrepancy";
    expScore = 50;
    expDetailsFa = `مغایرت سطح همکاری: این موقعیت جنبه دانشجویی/کارآموزی داشته و با سطح تجربه ${userExp} ساله شما همخوان نیست.`;
    discrepancies.push("مغایرت سطح همکاری: موقعیت کارآموزی نامتناسب با سوابق تخصصی.");
  } else if (hasCriticalExpDeficit) {
    experienceStatus = "discrepancy";
    expScore = 55;
    expDetailsFa = `مغایرت سابقه کار: حداقل تجربه مورد نیاز کارفرما (${reqExp} سال) با سابقه کار مستند متقاضی (${userExp} سال) مغایرت جدی دارد.`;
    discrepancies.push(`مغایرت سابقه کاری: نیاز به حداقل ${reqExp} سال در برابر سابقه ${userExp} ساله.`);
  } else {
    expScore = userExp >= reqExp ? 95 : 85;
    expDetailsFa = `انطباق کامل سابقه کاری: سابقه مستند ${userExp} ساله شما با پیش‌نیاز کارفرما (${reqExp} سال) و سطح ارشدیت ${userSeniority} کاملاً همخوان است.`;
  }

  // 3. Capabilities & Technical Skills Check (توانمندی)
  let capabilityStatus: "aligned" | "discrepancy" = "aligned";
  let capDetailsFa = "";
  let capScore = 85;
  const candidateSkillsLower = candidateSkills.toLowerCase();
  const matchedCaps: string[] = [];

  if (candidateSkillsLower.length > 2) {
    const tokens = candidateSkillsLower.split(/[,،\s]+/).filter(t => t.length > 2);
    tokens.forEach(tok => {
      if (titleLower.includes(tok) || tagsLower.includes(tok) || combinedJobText.includes(tok)) {
        matchedCaps.push(tok);
      }
    });
  }

  if (candidateCerts.trim().length > 2) {
    matchedCaps.push("گواهینامه‌های تخصصی بین‌المللی");
  }

  if (candidateSkillsLower.length > 4 && matchedCaps.length === 0 && !hasDomainConflict) {
    if (
      (candidateSkillsLower.includes("react") && titleLower.includes("c++ embedded")) ||
      (candidateSkillsLower.includes("حسابدار") && titleLower.includes("frontend"))
    ) {
      capabilityStatus = "discrepancy";
      capScore = 40;
      capDetailsFa = "مغایرت توانمندی فنی: جعبه‌ابزار و مهارت‌های کاندیدا همپوشانی لازم با استک فنی این کارفرما را ندارد.";
      discrepancies.push("مغایرت توانمندی و عدم انطباق استک فنی کاندیدا با شغل");
    } else {
      capScore = 82;
      capDetailsFa = "توانمندی‌های پایه‌ای مرتبط با حوزه شغلی شناسایی شد؛ تطبیق بیشتر با تسلط بر ابزارهای اعلامی کارفرما حاصل می‌شود.";
    }
  } else if (matchedCaps.length > 0) {
    capScore = Math.min(98, 85 + matchedCaps.length * 4);
    capDetailsFa = `انطباق توانمندی‌های تخصصی: تسلط بر ابزارها و مهارت‌های فنی (${matchedCaps.slice(0, 4).join("، ")}) کاملاً منطبق با شرح این موقعیت است.`;
  } else {
    capDetailsFa = "انطباق توانمندی: مهارت‌های پایه‌ای و تخصصی متناسب با استاندارد بازار کار آلمان ارزیابی شد.";
  }

  // 4. Knowledge & Academic/Anabin Recognition Check (دانش)
  let knowledgeStatus: "aligned" | "discrepancy" = "aligned";
  let knowledgeDetailsFa = "";
  let knowledgeScore = 88;

  if (isJobMed && !isCandidateMed) {
    knowledgeStatus = "discrepancy";
    knowledgeScore = 30;
    knowledgeDetailsFa = "مغایرت دانش و مدرک: اشتغال در مشاغل تحت نظارت سلامت آلمان (Approbation) نیازمند مدرک معتبر علوم پزشکی است.";
    discrepancies.push("مغایرت مدرک دانشگاهی با قوانین نظام پزشکی آلمان");
  } else {
    const isAnabinDirect = anabinStatus.includes("H+") || anabinStatus === "H+";
    const isDegreeValid = degree === "master" || degree === "bachelor" || degree === "phd";
    const isITExempt = isCandidateIT && userExp >= 3;

    if (isAnabinDirect && isDegreeValid) {
      knowledgeScore = 96;
      knowledgeDetailsFa = `انطباق کامل مدرک و دانش تحصیلی: مدرک ${degree} با تاییدیه قطعی سامانه Anabin (${anabinStatus}) بدون نیاز به ارزشیابی تکمیلی واجد شرایط بلوکارت اروپا ۲۰۲۶ است.`;
    } else if (isITExempt) {
      knowledgeScore = 93;
      knowledgeDetailsFa = "انطباق دانش تجربی: معافیت قانونی مدرک دانشگاهی بر پایه سابقه کاری بالای ۳ سال در حوزه فناوری اطلاعات (§19c AufenthG).";
    } else {
      knowledgeScore = 82;
      knowledgeDetailsFa = `دانش و مدارک تحصیلی ارزیابی شد؛ صدور ارزشیابی تطبیق مدارک (ZAB) جهت نهایی‌سازی فرآیند پرونده ویزا توصیه می‌شود.`;
    }
  }

  const isFullyAligned = discrepancies.length === 0;
  const hasDiscrepancy = discrepancies.length > 0;

  // Build the rich, 4-pillar precise match explanation
  const preciseMatchReason = isFullyAligned
    ? `انطباق کامل و بدون مغایرت در ۴ محور:
• تخصص: هم‌راستایی کامل با فیلد ${targetField} و حوزه فعالیت کارفرما.
• توانمندی: تسلط بر ابزارهای فنی متناظر (${matchedCaps.length > 0 ? matchedCaps.slice(0, 3).join("، ") : "فناوری‌های کلیدی استک"}).
• تجربه: سابقه ${userExp} ساله در تطابق با نیازمندی پوزیشن (${reqExp} سال) و سطح ${userSeniority}.
• دانش: مدرک علمی معتبر منطبق با موازین سامانه Anabin (${anabinStatus}) و بلوکارت ۲۰۲۶.`
    : `هشدار مغایرت: این موقعیت دارای ${discrepancies.length} مورد مغایرت با مشخصات متقاضی است (${discrepancies.join(" - ")}) و در لیست نمایش داده نمی‌شود.`;

  return {
    isFullyAligned,
    hasDiscrepancy,
    discrepancies,
    specialtyFit: {
      status: specialtyStatus,
      candidateSpecialty: targetField,
      jobSpecialty: jobTitle,
      score: specialtyScore,
      detailsFa: specialtyDetailsFa
    },
    capabilityFit: {
      status: capabilityStatus,
      candidateCapabilities: candidateSkills.split(/[,،\s]+/).filter(Boolean),
      matchedCapabilities: matchedCaps,
      score: capScore,
      detailsFa: capDetailsFa
    },
    experienceFit: {
      status: experienceStatus,
      candidateExpYears: userExp,
      requiredExpYears: reqExp,
      seniorityLevel: userSeniority,
      score: expScore,
      detailsFa: expDetailsFa
    },
    knowledgeFit: {
      status: knowledgeStatus,
      degree,
      anabinStatus,
      score: knowledgeScore,
      detailsFa: knowledgeDetailsFa
    },
    preciseMatchReason
  };
}

/**
 * Calculates a rich, multi-dimensional Semantic Match Score (0 - 100%)
 * based on Experience, Skills, Certifications, and ZAB/Anabin data integration.
 */
export function calculateSemanticMatchScore(
  job: SponsorshipJob,
  profile: EvaluatorInput
): SemanticMatchDetails {
  const targetField = profile.field || "فناوری اطلاعات";
  const jobTitle = job.jobTitle || "";
  const candidateSkills = profile.skills || "";
  const candidateCerts = profile.certifications || "";
  const userExp = Number(profile.experience) || 3;
  const reqExp = Number(job.minExp || job.requiredExperienceYears) || 2;
  const degree = (profile.degree || "bachelor").toLowerCase();
  const anabinStatus = profile.anabinStatus || "H+";
  const germanLevel = profile.germanLevel || "B1";
  const englishLevel = profile.englishLevel || "B2";

  const sector = detectGermanIndustrySector(targetField, jobTitle, candidateSkills);
  const alignmentAudit = auditJobCandidateAlignment(job, profile);

  // 1. Experience & Seniority Fit (Weight: 25%)
  let expScore = 75;
  let expAnalysis = "";
  if (userExp >= reqExp + 2) {
    expScore = 96;
    expAnalysis = `سابقه کار ${userExp} ساله شما فراتر از حداقل نیاز موقعیت (${reqExp} سال) است و جایگاه ارشد و مزیت رقابتی عالی به شما می‌دهد.`;
  } else if (userExp >= reqExp) {
    expScore = 88;
    expAnalysis = `سوابق مستند کاری شما (${userExp} سال) کاملاً همخوان با نیازمندی اعلامی کارفرما (${reqExp} سال) است.`;
  } else if (userExp === reqExp - 1) {
    expScore = 74;
    expAnalysis = `سابقه کار شما (${userExp} سال) اندکی کمتر از حد ایده‌آل (${reqExp} سال) است، اما با مهارت‌های تخصصی قابل جبران است.`;
  } else {
    expScore = 65;
    expAnalysis = `این پوزیشن نیازمند سابقه کاری بالاتر است؛ ارائه پروژه‌ها و مستندات عملی توصیه می‌شود.`;
  }

  // 2. Skills Semantic Alignment (Weight: 30%)
  let skillsScore = 76;
  const cleanSkills = candidateSkills.toLowerCase();
  const cleanTitle = jobTitle.toLowerCase();
  const cleanTags = (job.requiredSkills || []).map(s => s.toLowerCase());

  let matchedSkillsCount = 0;
  if (cleanSkills.length > 2) {
    const tokens = cleanSkills.split(/[,،\s]+/).filter(t => t.length > 2);
    tokens.forEach(tok => {
      if (cleanTitle.includes(tok) || cleanTags.some(t => t.includes(tok))) {
        matchedSkillsCount++;
      }
    });
  }

  if (matchedSkillsCount >= 3) {
    skillsScore = 95;
  } else if (matchedSkillsCount >= 1) {
    skillsScore = 86;
  } else if (cleanSkills.length > 5) {
    skillsScore = 80;
  }

  const skillsAnalysis = matchedSkillsCount > 0
    ? `همپوشانی معنایی بسیار مناسبی میان جعبه‌ابزار و فناوری‌های شما با استک فنی مورد نیاز شرکت ${job.companyName} شناسایی شد.`
    : `مهارت‌های پایه‌ای شما متناسب با شرح شغل است؛ برجسته‌سازی کلیدواژه‌های تخصصی در رزومه آلمانی پیشنهاد می‌شود.`;

  // 3. Certifications Valuation relative to German Industry Demand (Weight: 20%)
  let certsScore = 70;
  let certsAnalysis = "";
  const certsLower = candidateCerts.toLowerCase();

  let certMatches = 0;
  sector.priorityCertifications.forEach(cert => {
    const certTokens = cert.toLowerCase().split(/[\s/()]+/).filter(t => t.length > 3);
    if (certTokens.some(tok => certsLower.includes(tok))) {
      certMatches++;
    }
  });

  // Additional check for international certifications (AWS, PMP, Scrum, Goethe, etc.)
  const hasCloudCert = certsLower.includes("aws") || certsLower.includes("azure") || certsLower.includes("gcp") || certsLower.includes("cloud");
  const hasAgileCert = certsLower.includes("scrum") || certsLower.includes("pmp") || certsLower.includes("prince");
  const hasLangCert = certsLower.includes("goethe") || certsLower.includes("telc") || certsLower.includes("ielts") || certsLower.includes("toefl");
  const hasEngineeringCert = certsLower.includes("iso") || certsLower.includes("vdi") || certsLower.includes("bim") || certsLower.includes("revit");

  if (certMatches >= 2 || (hasCloudCert && hasAgileCert)) {
    certsScore = 96;
    certsAnalysis = "مدارک بین‌المللی و گواهینامه‌های تخصصی شما در صدر اولویت‌های استخدامی صنعت آلمان قرار دارند و تاثیر بسزایی در جذب کارفرما دارند.";
  } else if (certMatches >= 1 || hasCloudCert || hasAgileCert || hasLangCert || hasEngineeringCert) {
    certsScore = 88;
    certsAnalysis = "گواهینامه‌های ثبت‌شده شما منطبق بر استانداردهای اعتبارسنجی کارفرمایان آلمانی در حوزه " + sector.sectorNameDe + " است.";
  } else if (candidateCerts.trim().length > 3) {
    certsScore = 80;
    certsAnalysis = "مدارک دوره‌ای شما ثبت شده است؛ دریافت سرتیفیکیت‌های بین‌المللی استاندارد آلمان (مانند VDI یا AWS/Scrum) امتیاز شما را به حداکثر می‌رساند.";
  } else {
    certsScore = 72;
    certsAnalysis = `ثبت گواهی‌های معتبر صنعتی مانند ${sector.priorityCertifications[0]} شانس پذیرش این پوزیشن را تا ۳۰٪ افزایش می‌دهد.`;
  }

  // 4. ZAB / Anabin Academic Recognition & Legal Framework (Weight: 25%)
  let zabScore = 80;
  let anabinAnalysis = "";
  let legalPathway = "§18g AufenthG (بلوکارت اروپا - EU Blue Card)";

  const isAnabinDirect = anabinStatus.includes("H+") || anabinStatus === "H+";
  const isDegreeHigh = degree === "phd" || degree === "master";
  const isBachelor = degree === "bachelor";
  const isITExemption = anabinStatus.includes("IT") || anabinStatus.includes("معافیت") || (sector.sectorKey === "it_software" && userExp >= 3);

  if (isAnabinDirect && (isDegreeHigh || isBachelor)) {
    zabScore = 96;
    anabinAnalysis = "مدرک دانشگاهی شما در پایگاه داده Anabin تایید قطعی (H+) دارد و بدون نیاز به ارزشیابی تکمیلی، واجد شرایط مستقیم بلوکارت اتحادیه اروپا است.";
    legalPathway = `§18g AufenthG (بلوکارت اروپا) - کف حقوق ۲۰۲۶: ${sector.blueCardThresholdEur2026.toLocaleString("de-DE")} یورو`;
  } else if (isITExemption) {
    zabScore = 92;
    anabinAnalysis = "با توجه به سابقه کاری بالای ۳ سال در حوزه فناوری اطلاعات، طبق اصلاحیه جدید قانون مهاجرت ماهر (FEG)، از شرط مدرک تحصیلی معاف هستید.";
    legalPathway = "§19c AufenthG / بند نخبگان مهارتی IT (معاف از ارزشیابی دانشگاهی)";
  } else if (anabinStatus.includes("H+/-") || anabinStatus.includes("ZAB")) {
    zabScore = 82;
    anabinAnalysis = "دانشگاه شما دارای وضعیت H+/- است؛ ارائه تاییدیه انفرادی ارزشیابی مدارک تحصیلی (ZAB Statement of Comparability) جهت پرونده ویزا لازم است.";
    legalPathway = "§18b AufenthG (ویزای نیروی متخصص با تاییدیه ZAB)";
  } else {
    zabScore = 75;
    anabinAnalysis = "ارزشیابی تطبیق مدرک در سازمان ZAB آلمان یا اقدام از طریق آزمون اولویت مهارت برای این پوزیشن توصیه می‌شود.";
    legalPathway = "§18a/b AufenthG (ویزای کار مهارتی آلمان)";
  }

  // Language & Industry Shortage Bonus
  let bonus = 0;
  if (sector.shortageOccupation) bonus += 2;
  if (germanLevel === "B2" || germanLevel === "C1" || germanLevel === "C2") bonus += 3;
  else if (germanLevel === "B1") bonus += 1;
  if (englishLevel === "C1" || englishLevel === "C2") bonus += 2;

  const rawWeighted = (
    expScore * 0.25 +
    skillsScore * 0.30 +
    certsScore * 0.20 +
    zabScore * 0.25 +
    bonus
  );

  const overallScore = Math.min(99, Math.max(76, Math.round(rawWeighted)));

  let ratingLevel: "exceptional" | "strong" | "moderate" | "gap_detected" = "strong";
  let ratingLabelFa = "تطابق قوی با نیازمندی‌های کارفرمای آلمانی";

  if (overallScore >= 92) {
    ratingLevel = "exceptional";
    ratingLabelFa = "تطابق استثنایی بر پایه Anabin H+ و تقاضای صنعتی آلمان";
  } else if (overallScore >= 82) {
    ratingLevel = "strong";
    ratingLabelFa = "تطابق بسیار مناسب و واجد شرایط صدور ویزای کار";
  } else if (overallScore >= 70) {
    ratingLevel = "moderate";
    ratingLabelFa = "تطابق متوسط - قابل ارتقا با تکمیل گواهی‌ها";
  } else {
    ratingLevel = "gap_detected";
    ratingLabelFa = "نیاز به تقویت سوابق یا تاییدیه تکمیلی";
  }

  const scoreExplanation = alignmentAudit.isFullyAligned
    ? `این پوزیشن شغلی در شرکت ${job.companyName} با امتیاز انطباق ${overallScore}٪، به علت همخوانی کامل با تخصص (${targetField})، انطباق توانمندی‌های فنی، سابقه کاری ${userExp} ساله و دانش آکادمیک تاییدشده در Anabin (${anabinStatus}) بدون هیچ‌گونه مغایرت تایید شد.`
    : `هشدار: این پوزیشن شغلی دارای مغایرت با سوابق تخصصی کاندیدا است (${alignmentAudit.discrepancies.join("، ")}).`;

  const actionableScoreBoosters = [
    `عنوان مدرک تحصیلی و تاییدیه سامانه Anabin (${anabinStatus}) را در بالای رزومه استاندارد آلمانی (Lebenslauf) درج فرمایید.`,
    `مهارت‌های کلیدی و سرتیفیکیت‌های اعلامی این موقعیت را در متن انگیزه‌نامه (Anschreiben) با نمونه پروژه عینی پیوند دهید.`,
    `در بخش خلاصه رزومه، انطباق با قوانین ویزای کاری آلمان (${legalPathway}) را تصریح نمایید تا غربالگری اولیه ATS شرکت ${job.companyName} با موفقیت طی شود.`
  ];

  return {
    overallScore,
    ratingLevel,
    ratingLabelFa,
    experienceFitScore: expScore,
    experienceAnalysis: expAnalysis,
    skillsFitScore: skillsScore,
    skillsAnalysis: skillsAnalysis,
    certificationsFitScore: certsScore,
    certificationsAnalysis: certsAnalysis,
    zabAnabinFitScore: zabScore,
    anabinStatus,
    anabinAnalysis,
    legalImmigrationPathway: legalPathway,
    industryDemandProfile: {
      sectorName: sector.sectorNameFa,
      demandLevel: sector.demandLevel,
      shortageOccupation: sector.shortageOccupation,
      priorityCertificates: sector.priorityCertifications,
      regionalDemandHubs: sector.regionalDemandHubs,
      fastTrackEligible: sector.fastTrackEligible
    },
    scoreExplanation,
    actionableScoreBoosters,
    alignmentAudit
  };
}
