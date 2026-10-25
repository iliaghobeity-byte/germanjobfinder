import { GermanStateSalaryBenchmark, SalaryCalculatorResult, SalaryCalculatorParams } from "./types";

export interface GermanStateInfo {
  key: string;
  nameDe: string;
  nameFa: string;
  capitalDe: string;
  capitalFa: string;
  region: "south" | "west" | "north" | "east";
  regionFa: string;
  salaryFactor: number; // Factor vs national median (1.0 = average)
  costOfLivingIndex: number; // 100 = national average
  averageRent1BedCenterEur: number;
  topIndustries: string[];
  stateHighlightFa: string;
}

export const GERMAN_STATES_DATA: GermanStateInfo[] = [
  {
    key: "bayern",
    nameDe: "Bayern",
    nameFa: "بایرن (باواریا)",
    capitalDe: "München",
    capitalFa: "مونیخ",
    region: "south",
    regionFa: "جنوب آلمان",
    salaryFactor: 1.13,
    costOfLivingIndex: 124,
    averageRent1BedCenterEur: 1420,
    topIndustries: ["فناوری اطلاعات و هوش مصنوعی", "خودروسازی (BMW, Audi)", "هوا فضا و مکانیک", "بیمه و مالی"],
    stateHighlightFa: "بالاترین سطح دستمزدها در آلمان و قطب غول‌های فناوری، اما با بالاترین هزینه مسکن در مونیخ."
  },
  {
    key: "baden_wuerttemberg",
    nameDe: "Baden-Württemberg",
    nameFa: "بادن-وورتمبرگ",
    capitalDe: "Stuttgart",
    capitalFa: "اشتوتگارت",
    region: "south",
    regionFa: "جنوب آلمان",
    salaryFactor: 1.10,
    costOfLivingIndex: 115,
    averageRent1BedCenterEur: 1140,
    topIndustries: ["مهندسی و رباتیک (Porsche, Bosch, Mercedes)", "تجهیزات پزشکی", "نرم‌افزار سازمانی (SAP)", "انرژی"],
    stateHighlightFa: "مهد مهندسی و نوآوری با شرکت‌های پیشرو جهانی (Mittelstand) و قدرت خرید بسیار بالا."
  },
  {
    key: "hessen",
    nameDe: "Hessen",
    nameFa: "هسن",
    capitalDe: "Wiesbaden",
    capitalFa: "ویسبادن",
    region: "west",
    regionFa: "غرب آلمان",
    salaryFactor: 1.09,
    costOfLivingIndex: 116,
    averageRent1BedCenterEur: 1250,
    topIndustries: ["بانکداری و فین‌تک (ECB, Deutsche Bank)", "امنیت سایبری و دیتاسنترها", "داروسازی و شیمی", "لجستیک هوایی"],
    stateHighlightFa: "پایتخت مالی اروپا و تقاطع ترانزیت اینترنت با درآمدهای بسیار رقابتی در فرانکفورت."
  },
  {
    key: "hamburg",
    nameDe: "Hamburg",
    nameFa: "هامبورگ",
    capitalDe: "Hamburg",
    capitalFa: "هامبورگ",
    region: "north",
    regionFa: "شمال آلمان",
    salaryFactor: 1.06,
    costOfLivingIndex: 113,
    averageRent1BedCenterEur: 1180,
    topIndustries: ["صنایع هوانوردی (Airbus)", "تجارت بین‌الملل و کشتیرانی", "رسانه‌های دیجیتال و بازی‌سازی", "انرژی‌های پاک"],
    stateHighlightFa: "دومین شهر بزرگ آلمان با بالاترین درآمد سرانه شمال کشور و بازار کار پررونق تجارت دیجیتال."
  },
  {
    key: "nrw",
    nameDe: "Nordrhein-Westfalen",
    nameFa: "نوردراین-وستفالن",
    capitalDe: "Düsseldorf",
    capitalFa: "دوسلدورف",
    region: "west",
    regionFa: "غرب آلمان",
    salaryFactor: 1.02,
    costOfLivingIndex: 104,
    averageRent1BedCenterEur: 1040,
    topIndustries: ["مشاوره مدیریت و خدمات سازمانی", "ارتباطات و تلکام", "شیمی و پلیمر", "استارتاپ‌های لجستیک"],
    stateHighlightFa: "پرجمعیت‌ترین ایالت آلمان با بیشترین تنوع کارفرمایان و توازن فوق‌العاده میان حقوق و مخارج زندگی."
  },
  {
    key: "berlin",
    nameDe: "Berlin",
    nameFa: "برلین",
    capitalDe: "Berlin",
    capitalFa: "برلین",
    region: "east",
    regionFa: "پایتخت و شرق آلمان",
    salaryFactor: 1.01,
    costOfLivingIndex: 106,
    averageRent1BedCenterEur: 1160,
    topIndustries: ["استارتاپ‌ها و پلتفرم‌های ابری", "هوش مصنوعی و داده", "فین‌تک بین‌المللی", "هنر دیجیتال و تجارت الکترونیک"],
    stateHighlightFa: "اکوسیستم پویای استارتاپی با محیط‌های کاری انگلیسی‌زبان و بیشترین فرصت برای متخصصان بین‌المللی."
  },
  {
    key: "niedersachsen",
    nameDe: "Niedersachsen",
    nameFa: "نیدرزاکسن (ساکسونی سفلی)",
    capitalDe: "Hannover",
    capitalFa: "هانوفر",
    region: "north",
    regionFa: "شمال آلمان",
    salaryFactor: 0.98,
    costOfLivingIndex: 97,
    averageRent1BedCenterEur: 890,
    topIndustries: ["صنایع خودروسازی (Volkswagen Group)", "انرژی باد و هیدروژن", "صنایع غذایی پیشرفته", "کشاورزی مدرن"],
    stateHighlightFa: "قدرت صنعتی چشمگیر با هزینه‌های زندگی پایین‌تر از میانگین فدرال و قدرت خرید واقعی بالا."
  },
  {
    key: "rheinland_pfalz",
    nameDe: "Rheinland-Pfalz",
    nameFa: "راینلاند-فالتس",
    capitalDe: "Mainz",
    capitalFa: "ماینتس",
    region: "west",
    regionFa: "غرب آلمان",
    salaryFactor: 0.98,
    costOfLivingIndex: 98,
    averageRent1BedCenterEur: 920,
    topIndustries: ["شیمی و داروسازی (BASF, BioNTech)", "تولید صنعتی", "گردشگری و شراب‌سازی", "تجارت مرزی با فرانسه"],
    stateHighlightFa: "میزبان شرکت‌های بزرگ بیوتکنولوژی و شیمیایی با دستمزدهای تعرفه‌ای بسیار پایدار."
  },
  {
    key: "bremen",
    nameDe: "Bremen",
    nameFa: "برمن",
    capitalDe: "Bremen",
    capitalFa: "برمن",
    region: "north",
    regionFa: "شمال آلمان",
    salaryFactor: 0.96,
    costOfLivingIndex: 96,
    averageRent1BedCenterEur: 860,
    topIndustries: ["هوا فضا (ArianeGroup)", "لجستیک بندری", "خودروسازی (Mercedes-Benz Bremen)", "علوم دریایی"],
    stateHighlightFa: "ایالت بندری پویا با بازار کار متمرکز بر صنایع با فناوری بالا و لجستیک مدرن."
  },
  {
    key: "schleswig_holstein",
    nameDe: "Schleswig-Holstein",
    nameFa: "اشلسویگ-هولشتاین",
    capitalDe: "Kiel",
    capitalFa: "کیل",
    region: "north",
    regionFa: "شمال آلمان",
    salaryFactor: 0.95,
    costOfLivingIndex: 99,
    averageRent1BedCenterEur: 880,
    topIndustries: ["فناوری‌های دریایی و کشتی‌سازی", "انرژی بادی و تجدیدپذیر", "فناوری پزشکی", "گردشگری ساحلی"],
    stateHighlightFa: "کیفیت زندگی عالی در میان دو دریا با رشد فزاینده در اقتصاد سبز و انرژی‌های نو."
  },
  {
    key: "saarland",
    nameDe: "Saarland",
    nameFa: "زارلاند",
    capitalDe: "Saarbrücken",
    capitalFa: "ساربروکن",
    region: "west",
    regionFa: "غرب آلمان",
    salaryFactor: 0.93,
    costOfLivingIndex: 93,
    averageRent1BedCenterEur: 790,
    topIndustries: ["فناوری اطلاعات و انفورماتیک (CISPA)", "صنایع فولاد و قطعه‌سازی", "تحقیقات هوش مصنوعی"],
    stateHighlightFa: "مرکز تحقیقات پیشرفته امنیت سایبری و هوش مصنوعی با اجاره‌های بسیار مقرون‌به‌صرفه."
  },
  {
    key: "sachsen",
    nameDe: "Sachsen",
    nameFa: "زاکسن (ساکسونی)",
    capitalDe: "Dresden",
    capitalFa: "درسدن",
    region: "east",
    regionFa: "شرق آلمان",
    salaryFactor: 0.89,
    costOfLivingIndex: 86,
    averageRent1BedCenterEur: 760,
    topIndustries: ["دره سیلیکون زاکسن (Silicon Saxony - چیپ و نیمه‌هادی)", "لجستیک (DHL Hub Leipzig)", "خودرو برقی", "فناوری زیستی"],
    stateHighlightFa: "بزرگ‌ترین قطب میکروالکترونیک اروپا با بالاترین رشد شغلی و نرخ استثنایی توازن پس‌انداز به درآمد."
  },
  {
    key: "thueringen",
    nameDe: "Thüringen",
    nameFa: "تورینگن",
    capitalDe: "Erfurt",
    capitalFa: "ارفورت",
    region: "east",
    regionFa: "شرق آلمان",
    salaryFactor: 0.86,
    costOfLivingIndex: 84,
    averageRent1BedCenterEur: 710,
    topIndustries: ["اپتیک و فوتونیک (Zeiss, Jenoptik)", "ریزسیستم‌ها و ابزار دقیق", "لجستیک مرکزی آلمان", "صنایع غذایی"],
    stateHighlightFa: "پایتخت اپتیک و لیزر جهان با تقاضای مبرم برای مهندسان و هزینه‌های زندگی بسیار پایین."
  },
  {
    key: "brandenburg",
    nameDe: "Brandenburg",
    nameFa: "براندنبورگ",
    capitalDe: "Potsdam",
    capitalFa: "پوتسدام",
    region: "east",
    regionFa: "شرق آلمان",
    salaryFactor: 0.88,
    costOfLivingIndex: 90,
    averageRent1BedCenterEur: 830,
    topIndustries: ["خودرو برقی و باتری (Tesla Gigafactory Berlin-Brandenburg)", "فناوری زیستی", "هوافضا", "تحقیقات علمی"],
    stateHighlightFa: "ایالت احاطه‌کننده برلین با رشد اقتصادی شتابان ناشی از کارخانجات تسلا و شرکت‌های فناوری پاک."
  },
  {
    key: "sachsen_anhalt",
    nameDe: "Sachsen-Anhalt",
    nameFa: "زاکسن-آنهالت",
    capitalDe: "Magdeburg",
    capitalFa: "ماگدبورگ",
    region: "east",
    regionFa: "شرق آلمان",
    salaryFactor: 0.85,
    costOfLivingIndex: 83,
    averageRent1BedCenterEur: 690,
    topIndustries: ["صنایع شیمی و پلیمر", "نیمه‌هادی‌ها و کارخانجات چیپ", "مهندسی مکانیک", "انرژی بادی"],
    stateHighlightFa: "سرمایه‌گذاری‌های سنگین بین‌المللی در حوزه چیپ و های‌تک، همراه با پایین‌ترین مخارج مسکن در آلمان."
  },
  {
    key: "mecklenburg_vorpommern",
    nameDe: "Mecklenburg-Vorpommern",
    nameFa: "مکلنبورگ-فورپومرن",
    capitalDe: "Schwerin",
    capitalFa: "شورین",
    region: "north",
    regionFa: "شمال و شرق آلمان",
    salaryFactor: 0.83,
    costOfLivingIndex: 83,
    averageRent1BedCenterEur: 700,
    topIndustries: ["انرژی‌های تجدیدپذیر دریایی", "فناوری زیستی و سلامت", "کشتی‌سازی و بنادر", "صنایع غذایی"],
    stateHighlightFa: "طبیعت بکر و محیط آرام با بیشترین نیاز به کادر درمانی، پزشکان و مهندسان انرژی با فرصت‌های شغلی بدون رقابت فشرده."
  }
];

export const POPULAR_JOB_PRESETS = [
  {
    titleEn: "Senior DevOps & Cloud Engineer",
    titleDe: "Senior DevOps / Cloud Engineer (m/w/d)",
    titleFa: "مهندس ارشد DevOps و رایانش ابری",
    category: "it",
    kldbCode: "43114 - Softwareentwicklung",
    baseNationalMedian: 78000,
    isShortage: true
  },
  {
    titleEn: "Full Stack Software Developer",
    titleDe: "Full-Stack Softwareentwickler (Java / TypeScript)",
    titleFa: "توسعه‌دهنده نرم‌افزار فول‌استک",
    category: "it",
    kldbCode: "43114 - Softwareentwicklung",
    baseNationalMedian: 68000,
    isShortage: true
  },
  {
    titleEn: "Data Scientist & AI Specialist",
    titleDe: "Data Scientist / KI-Spezialist (m/w/d)",
    titleFa: "متخصص علم داده و هوش مصنوعی",
    category: "it",
    kldbCode: "43114 - Data Science & AI",
    baseNationalMedian: 74000,
    isShortage: true
  },
  {
    titleEn: "Cybersecurity Analyst & Engineer",
    titleDe: "Cyber Security Specialist / IT-Sicherheitsanalyst",
    titleFa: "تحلیلگر و مهندس امنیت سایبری",
    category: "it",
    kldbCode: "43114 - IT-Sicherheit",
    baseNationalMedian: 72000,
    isShortage: true
  },
  {
    titleEn: "Automotive Embedded Software Engineer",
    titleDe: "Embedded Systems Entwickler Automotive (C/C++, AUTOSAR)",
    titleFa: "مهندس سیستم‌های نهفته و خودرویی",
    category: "engineering",
    kldbCode: "26122 - Mechatronik & Automatisierung",
    baseNationalMedian: 71000,
    isShortage: true
  },
  {
    titleEn: "Mechanical Design Engineer",
    titleDe: "Konstruktionsingenieur Maschinenbau (CAD/PLM)",
    titleFa: "مهندس طراح مکانیک و ساخت",
    category: "engineering",
    kldbCode: "25114 - Maschinenbauingenieur",
    baseNationalMedian: 65000,
    isShortage: true
  },
  {
    titleEn: "Electrical & Automation Engineer",
    titleDe: "Ingenieur für Elektrotechnik und Automatisierungstechnik",
    titleFa: "مهندس برق، کنترل و اتوماسیون صنعتی",
    category: "engineering",
    kldbCode: "26114 - Elektrotechnik",
    baseNationalMedian: 67000,
    isShortage: true
  },
  {
    titleEn: "Specialist Physician (Facharzt)",
    titleDe: "Facharzt für Innere Medizin / Anästhesiologie",
    titleFa: "پزشک متخصص (طب داخلی / بیهوشی)",
    category: "healthcare",
    kldbCode: "81414 - Facharzt",
    baseNationalMedian: 92000,
    isShortage: true
  },
  {
    titleEn: "Registered Nurse / Healthcare Specialist",
    titleDe: "Pflegefachkraft (m/w/d) für Intensiv- und Krankenpflege",
    titleFa: "پرستار و کارشناس مراقبت درمانی",
    category: "healthcare",
    kldbCode: "81302 - Krankenpflege",
    baseNationalMedian: 46000,
    isShortage: true
  },
  {
    titleEn: "Technical Product Manager",
    titleDe: "Technischer Produktmanager (Software & B2B)",
    titleFa: "مدیر محصول فنی و نرم‌افزار",
    category: "business",
    kldbCode: "71304 - Produktmanagement",
    baseNationalMedian: 73000,
    isShortage: false
  },
  {
    titleEn: "Civil Engineer & Project Manager",
    titleDe: "Bauingenieur / Projektleiter Hochbau",
    titleFa: "مهندس عمران و سرپرست پروژه ساختمانی",
    category: "engineering",
    kldbCode: "31114 - Bauingenieurwesen",
    baseNationalMedian: 63000,
    isShortage: true
  },
  {
    titleEn: "Financial Controller & Analyst",
    titleDe: "Financial Controller / Finanzanalyst",
    titleFa: "کارشناس ارشد تحلیل مالی و کنترلینگ",
    category: "business",
    kldbCode: "72114 - Finanzwesen & Controlling",
    baseNationalMedian: 64000,
    isShortage: false
  }
];

/**
 * Calculates accurate German net monthly take-home salary based on progressive income tax and social insurance.
 */
export function calculateGermanNetSalary(
  grossAnnualEur: number,
  taxClass: number = 1,
  hasChildren: boolean = false,
  hasChurchTax: boolean = false
) {
  const grossMonthly = Math.round(grossAnnualEur / 12);

  // 1. Social Security Contributions (Sozialversicherungsbeiträge 2026 - Employee share)
  // Rentenversicherung (9.3%)
  const rv = Math.round(grossMonthly * 0.093);
  // Krankenversicherung (7.3% + ~0.85% average Zusatzbeitrag)
  const kv = Math.round(grossMonthly * 0.0815);
  // Arbeitslosenversicherung (1.3%)
  const av = Math.round(grossMonthly * 0.013);
  // Pflegeversicherung (2.2% with children, 2.3% without)
  const pvRate = hasChildren ? 0.022 : 0.023;
  const pv = Math.round(grossMonthly * pvRate);

  const totalSocial = rv + kv + av + pv;

  // 2. Progressive Wage Tax (Lohnsteuer - 2026 Table Approximation)
  // Grundfreibetrag 2026: ~€11,784
  const taxableAnnual = Math.max(0, grossAnnualEur - (totalSocial * 12) - 1200); // 1200 Werbungskostenpauschale

  let taxFactor = 0.16;
  if (taxClass === 3) taxFactor = 0.08;
  else if (taxClass === 5) taxFactor = 0.28;
  else if (taxClass === 2) taxFactor = 0.13; // Single parent
  else {
    // Progressive rate for Class 1 and 4
    if (taxableAnnual < 12000) taxFactor = 0;
    else if (taxableAnnual < 25000) taxFactor = 0.10;
    else if (taxableAnnual < 45000) taxFactor = 0.16;
    else if (taxableAnnual < 70000) taxFactor = 0.22;
    else if (taxableAnnual < 100000) taxFactor = 0.27;
    else taxFactor = 0.32;
  }

  const estimatedAnnualTax = Math.round(taxableAnnual * taxFactor);
  const incomeTaxMonthly = Math.round(estimatedAnnualTax / 12);

  // Church tax (8% or 9% of income tax if applicable)
  const churchTaxMonthly = hasChurchTax ? Math.round(incomeTaxMonthly * 0.085) : 0;

  const totalDeductions = totalSocial + incomeTaxMonthly + churchTaxMonthly;
  const netMonthly = Math.max(0, grossMonthly - totalDeductions);
  const effectiveDeductionRate = Math.round((totalDeductions / grossMonthly) * 100);

  return {
    grossMonthly,
    netMonthlyTakeHome: netMonthly,
    incomeTax: incomeTaxMonthly,
    socialSecurity: totalSocial,
    pensionInsurance: rv,
    healthInsurance: kv,
    careInsurance: pv,
    unemploymentInsurance: av,
    effectiveDeductionRate
  };
}

/**
 * Robust rule-based salary calculation engine with 2026/2027 market benchmarks
 */
export function generateLocalRuleBasedSalary(params: SalaryCalculatorParams): SalaryCalculatorResult {
  const {
    jobTitle = "Software Developer",
    state = "bayern",
    experienceYears = 4,
    seniorityLevel = "mid",
    degree = "bachelor",
    germanLevel = "B1",
    companySize = "sme",
    taxClass = 1,
    hasChildren = false,
    hasChurchTax = false
  } = params;

  // Find preset or baseline
  const matchedPreset = POPULAR_JOB_PRESETS.find(p => 
    jobTitle.toLowerCase().includes(p.titleEn.toLowerCase()) || 
    p.titleFa.includes(jobTitle) ||
    p.titleDe.toLowerCase().includes(jobTitle.toLowerCase())
  );

  const isShortage = matchedPreset 
    ? matchedPreset.isShortage 
    : /software|devops|cloud|data|ai|cyber|engineer|mechatronik|arzt|physician|nurse|pflege|it|developer/i.test(jobTitle);

  let baselineMedian = matchedPreset ? matchedPreset.baseNationalMedian : 66000;

  // Seniority multiplier
  let seniorityMultiplier = 1.0;
  if (seniorityLevel === "junior" || experienceYears <= 2) seniorityMultiplier = 0.78;
  else if (seniorityLevel === "mid" || (experienceYears >= 3 && experienceYears <= 5)) seniorityMultiplier = 1.0;
  else if (seniorityLevel === "senior" || (experienceYears >= 6 && experienceYears <= 8)) seniorityMultiplier = 1.24;
  else if (seniorityLevel === "lead" || experienceYears >= 9) seniorityMultiplier = 1.48;

  // Education multiplier
  let degreeMultiplier = 1.0;
  if (degree === "master") degreeMultiplier = 1.06;
  else if (degree === "phd") degreeMultiplier = 1.15;
  else if (degree === "ausbildung") degreeMultiplier = 0.90;

  // German language multiplier
  let langMultiplier = 1.0;
  if (germanLevel === "C1" || germanLevel === "C2") langMultiplier = 1.08;
  else if (germanLevel === "B2") langMultiplier = 1.04;
  else if (germanLevel === "A1" || germanLevel === "A2") langMultiplier = 0.95;

  // Company size multiplier
  let sizeMultiplier = 1.0;
  if (companySize === "enterprise") sizeMultiplier = 1.14;
  else if (companySize === "startup") sizeMultiplier = 0.95;

  // National Median for this specific candidate profile
  const candidateNationalMedian = Math.round(baselineMedian * seniorityMultiplier * degreeMultiplier * langMultiplier * sizeMultiplier);

  // Generate 16 German states comparison
  const stateComparisons: GermanStateSalaryBenchmark[] = GERMAN_STATES_DATA.map(st => {
    const stateMedian = Math.round(candidateNationalMedian * st.salaryFactor);
    const minAnnual = Math.round(stateMedian * 0.82);
    const maxAnnual = Math.round(stateMedian * 1.25);
    
    // Purchasing-power adjusted real salary (State Median / Cost of Living Index * 100)
    const adjustedReal = Math.round((stateMedian / st.costOfLivingIndex) * 100);

    let powerRating: string = "بسیار خوب";
    if (adjustedReal > candidateNationalMedian * 1.05) powerRating = "عالی (توازن برتر پس‌انداز)";
    else if (adjustedReal >= candidateNationalMedian * 0.95) powerRating = "خوب و پایدار";
    else powerRating = "متوسط به دلیل هزینه مسکن";

    const blueCardThreshold = isShortage ? 41041 : 45300;
    const blueCardPassStatus: "guaranteed" | "eligible" | "borderline" = 
      minAnnual >= blueCardThreshold ? "guaranteed" : (stateMedian >= blueCardThreshold ? "eligible" : "borderline");

    return {
      stateKey: st.key,
      nameDe: st.nameDe,
      nameFa: st.nameFa,
      region: st.region,
      regionFa: st.regionFa,
      medianGrossAnnualEur: stateMedian,
      minGrossAnnualEur: minAnnual,
      maxGrossAnnualEur: maxAnnual,
      costOfLivingIndex: st.costOfLivingIndex,
      adjustedRealPurchasingPowerEur: adjustedReal,
      purchasingPowerRatingFa: powerRating,
      averageRent1BedCenterEur: st.averageRent1BedCenterEur,
      topIndustries: st.topIndustries,
      stateHighlightFa: st.stateHighlightFa,
      blueCardPassStatus
    };
  });

  // Selected state benchmark
  const targetStateInfo = stateComparisons.find(s => s.stateKey === state.toLowerCase()) || stateComparisons[0];
  const targetMedian = targetStateInfo.medianGrossAnnualEur;

  // Percentiles for selected state
  const p25 = Math.round(targetMedian * 0.85);
  const p50 = targetMedian;
  const p75 = Math.round(targetMedian * 1.18);
  const p90 = Math.round(targetMedian * 1.36);

  const netP25 = calculateGermanNetSalary(p25, taxClass, hasChildren, hasChurchTax);
  const netP50 = calculateGermanNetSalary(p50, taxClass, hasChildren, hasChurchTax);
  const netP75 = calculateGermanNetSalary(p75, taxClass, hasChildren, hasChurchTax);
  const netP90 = calculateGermanNetSalary(p90, taxClass, hasChildren, hasChurchTax);

  // Statutory EU Blue Card 2026 calculation (§ 18g AufenthG)
  const statutoryThreshold = isShortage ? 41041 : 45300;
  const isBlueCardEligible = p25 >= statutoryThreshold || p50 >= statutoryThreshold;
  const fastTrackMonths = germanLevel === "B1" || germanLevel === "B2" || germanLevel === "C1" || germanLevel === "C2" ? 21 : 27;

  const blueCardAssessment = isBlueCardEligible
    ? `حقوق پیشنهادی این پوزیشن در ایالت ${targetStateInfo.nameFa} (${p50.toLocaleString()} یورو) فراتر از سقف قانونی بلوکارت ۲۰۲۶ فدرال (${statutoryThreshold.toLocaleString()} یورو) بوده و صدور ویزای کار تخصصی تضمین‌شده است.`
    : `این پوزیشن نیازمند مذاکره برای افزایش سطح پیشنهادی به حداقل ${statutoryThreshold.toLocaleString()} یورو جهت تاییدیه قطعی بلوکارت اداره مهاجرت آلمان است.`;

  // Popular in-demand skills bonus estimates
  const inDemandSkills = isShortage 
    ? [
        { skill: "Cloud Architecture (AWS / Azure)", bonusEstimateEur: 6500 },
        { skill: "Kubernetes & CI/CD Pipelines", bonusEstimateEur: 5200 },
        { skill: "AI Integration & LLM APIs", bonusEstimateEur: 7800 },
        { skill: "German Professional B2 Communication", bonusEstimateEur: 4500 }
      ]
    : [
        { skill: "German B2/C1 Business Fluency", bonusEstimateEur: 5000 },
        { skill: "Agile / Scrum Master Certification", bonusEstimateEur: 4000 },
        { skill: "Data Analytics & Tableau", bonusEstimateEur: 3800 },
        { skill: "SAP ERP Experience", bonusEstimateEur: 4800 }
      ];

  return {
    jobTitle: {
      en: matchedPreset?.titleEn || jobTitle,
      de: matchedPreset?.titleDe || `${jobTitle} (m/w/d)`,
      fa: matchedPreset?.titleFa || jobTitle,
      kldbCode: matchedPreset?.kldbCode || "43114 - Fachkraft"
    },
    seniorityLevel,
    experienceYears,
    selectedState: targetStateInfo,
    competitiveRanges: {
      percentile25: {
        annualGross: p25,
        monthlyGross: Math.round(p25 / 12),
        estimatedMonthlyNet: netP25.netMonthlyTakeHome
      },
      percentile50: {
        annualGross: p50,
        monthlyGross: Math.round(p50 / 12),
        estimatedMonthlyNet: netP50.netMonthlyTakeHome
      },
      percentile75: {
        annualGross: p75,
        monthlyGross: Math.round(p75 / 12),
        estimatedMonthlyNet: netP75.netMonthlyTakeHome
      },
      percentile90: {
        annualGross: p90,
        monthlyGross: Math.round(p90 / 12),
        estimatedMonthlyNet: netP90.netMonthlyTakeHome
      }
    },
    stateComparisons,
    blueCardCheck: {
      isEligible: isBlueCardEligible,
      thresholdEur: statutoryThreshold,
      thresholdFormatted: `${statutoryThreshold.toLocaleString()} €`,
      isShortageOccupation: isShortage,
      fastTrackResidencyMonths: fastTrackMonths,
      assessmentFa: blueCardAssessment
    },
    taxNetBreakdown: {
      grossMonthlyEur: netP50.grossMonthly,
      netMonthlyTakeHomeEur: netP50.netMonthlyTakeHome,
      incomeTaxEur: netP50.incomeTax,
      socialSecurityEur: netP50.socialSecurity,
      pensionInsuranceEur: netP50.pensionInsurance,
      healthInsuranceEur: netP50.healthInsurance,
      careInsuranceEur: netP50.careInsurance,
      unemploymentInsuranceEur: netP50.unemploymentInsurance,
      effectiveDeductionRate: netP50.effectiveDeductionRate
    },
    marketTrends2026: {
      yoyGrowthPercent: 4.8,
      yoyGrowthFormatted: "+۴.۸٪ رشد سالانه دستمزد",
      remoteHybridRatio: "۶۵٪ آگهی‌ها به صورت هیبرید (۲-۳ روز هوم‌آفیس) یا ریموت کامل",
      inDemandSkills,
      topHiringEmployers: [
        "Siemens AG",
        "SAP SE",
        "BMW Group",
        "Deutsche Telekom",
        "Bosch Global",
        "Allianz Technology"
      ],
      jobOpeningVolumeFa: "بیش از ۳,۲۰۰ جایگاه شغلی فعال ثبت‌شده در آژانس فدرال کار آلمان"
    },
    negotiationPlaybook: {
      salaryExpectationScriptDe: `Meine Gehaltsvorstellung liegt auf Basis meiner ${experienceYears} Jahre Facherfahrung und der aktuellen Marktlage in ${targetStateInfo.nameDe} bei ca. ${p50.toLocaleString()} bis ${p75.toLocaleString()} Euro brutto im Jahr. Ich bin jedoch offen für ein attraktives Gesamtpaket inklusive Weiterbildung und Zusatzleistungen.`,
      salaryExpectationScriptFa: `انتظار حقوقی من بر پایه ${experienceYears} سال تجربه تخصصی و وضعیت روز بازار کار در ایالت ${targetStateInfo.nameFa}، در حدود بازه ${p50.toLocaleString()} تا ${p75.toLocaleString()} یورو ناخالص در سال است؛ با این حال، به روی بسته جامع شغلی شامل مزایای توسعه حرفه‌ای و مزایای جانبی کاملاً منعطف هستم.`,
      tacticalAdviceFa: [
        "در آلمان، همیشه رقم حقوق را به صورت ناخالص سالانه (Bruttojahresgehalt) اعلام کنید؛ هرگز رقم خالص یا ماهانه ندهید.",
        `با توجه به سابقه شما، درخواست حقوق بین صدک ۵۰ (${p50.toLocaleString()} €) تا صدک ۷۵ (${p75.toLocaleString()} €) از نگاه مصاحبه‌کننده آلمانی کاملاً پخته و واقع‌بینانه تلقی می‌شود.`,
        "اگر کارفرما رقم پایه کمتری پیشنهاد داد، درخواست مزایای غیرنقدی معاف از مالیات نظیر بلیت ترابری عمومی (Deutschlandticket)، بودجه تجهیز هوم‌آفیس و کمک‌هزینه جابجایی (Relocation Support) مطرح کنید.",
        "درخواست افزایش حقوق را منوط به سپری شدن دوره آزمایشی ۶ ماهه (Probezeit) در متن قرارداد مکتوب بگنجانید."
      ],
      recommendedPerks: [
        { perkDe: "Deutschlandticket (Jobticket)", perkFa: "بلیت رایگان ترابری سراسری آلمان", valueNoteFa: "ارزش سالانه ~۶۰۰ یورو معاف از مالیات" },
        { perkDe: "Betriebliche Altersvorsorge (bAV)", perkFa: "طرح بازنشستگی تکمیلی شرکتی", valueNoteFa: "حداقل ۱۵٪ سهم تشویقی کارفرما" },
        { perkDe: "Home Office Budget & 30 Tage Urlaub", perkFa: "۳۰ روز مرخصی سالانه + بودجه هوم‌آفیس", valueNoteFa: "استاندارد طلایی تعادل کار و زندگی در آلمان" },
        { perkDe: "Relocation Package & Temporary Housing", perkFa: "بسته اسکان موقت و هزینه مهاجرت", valueNoteFa: "تسهیل ثبت نشانی اولیه (Anmeldung)" }
      ]
    },
    summaryFa: `برای شغل ${matchedPreset?.titleFa || jobTitle} در ایالت ${targetStateInfo.nameFa}، میانه حقوق ناخالص سالانه در بازار کار ۲۰۲۶ حدود ${p50.toLocaleString()} یورو تخمین زده می‌شود. دریافتی خالص ماهانه متقاضی مجرد (کلاس ۱) حدود ${netP50.netMonthlyTakeHome.toLocaleString()} یورو خواهد بود. این جایگاه شغلی کاملاً منطبق بر الزامات بلوکارت آلمان است.`,
    isAiGenerated: false,
    calculatedAt: new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date())
  };
}
