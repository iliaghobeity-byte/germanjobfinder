export interface SkillDimension {
  id: string;
  name: string;
  nameEn: string;
  germanBenchmark: number;
  userScore: number;
  description: string;
  germanContext: string;
  actionRecommendation: string;
}

export interface RoleInterviewAdvice {
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
}

export interface TargetJobRole {
  id: string;
  title: string;
  titleDe: string;
  kldbCode: string;
  category: string;
  germanDemandLevel: string;
  avgSalaryRange: string;
  germanEmployerDuties: string[];
  skills: SkillDimension[];
  interviewAdvice?: RoleInterviewAdvice;
  overallMatchSummary: {
    matchPercentage: number;
    topStrengths: string[];
    criticalGaps: string[];
    priorityCertificatesDe: string[];
    germanCvOptimizationTip: string;
  };
}

export interface SkillsGapProfileInput {
  field?: string;
  targetRole?: string;
  title?: string;
  skills?: string;
  experience?: number | string;
  degree?: string;
  germanLevel?: string;
  englishLevel?: string;
  workHistoryHighlights?: string[];
  educationSummary?: string;
  rawTextSummary?: string;
}

export function getRoleInterviewAdvice(role?: {
  id?: string;
  title?: string;
  titleDe?: string;
  category?: string;
  interviewAdvice?: RoleInterviewAdvice;
  [key: string]: any;
}): RoleInterviewAdvice {
  if (role?.interviewAdvice) {
    return role.interviewAdvice;
  }

  const roleText = `${role?.id || ""} ${role?.title || ""} ${role?.titleDe || ""} ${role?.category || ""}`.toLowerCase();

  // 1. Medical Laboratory, Microbiology, Biology, Pathology, Biochemistry
  if (
    roleText.includes("labor") ||
    roleText.includes("microbio") ||
    roleText.includes("میکروبیولوژی") ||
    roleText.includes("آزمایشگاه") ||
    roleText.includes("mtl") ||
    roleText.includes("biolog") ||
    roleText.includes("زیست") ||
    roleText.includes("پاتولوژی") ||
    roleText.includes("ژنتیک")
  ) {
    return {
      pillar1Title: "۱. تضمین کیفیت تشخیصی و Rili-BÄK / ISO 15189:",
      pillar1Desc: "در آزمایشگاه‌های آلمان، تحلیل چارت‌های کنترل کیفی وستگارد، اقدام اصلاحی در زمان خروج از محدوده ۲SD و کالیبراسیون دستگاه‌ها حیاتی‌ترین بخش مصاحبه است.",
      pillar2Title: "۲. ایمنی زیستی TRBA 100 و اعلام مقادیر بحرانی (Panic Values):",
      pillar2Desc: "پایبندی به استانداردهای کار در هود لامینار BSL-2، پیشگیری از آلودگی متقاطع و رویه استاندارد تماس فوری تلفنی با پزشک در موارد بحرانی تست‌ها.",
      pillar3Title: "۳. اعتبارسنجی نمونه و استاندارد EUCAST:",
      pillar3Desc: "تسلط بر معیارهای رد نمونه‌های همولیز یا نامناسب و پایبندی به تفسیر علمی مقاومت آنتی‌بیوتیکی طبق استاندارد اروپایی EUCAST."
    };
  }

  // 2. Medical Doctor / Physician / Approbation
  if (
    roleText.includes("doctor") ||
    roleText.includes("approbation") ||
    roleText.includes("پزشک") ||
    roleText.includes("arzt") ||
    roleText.includes("درمان")
  ) {
    return {
      pillar1Title: "۱. شرح حال ساختاریافته و گزارش ترخیص (Anamnese & Arztbrief):",
      pillar1Desc: "مهارت در اخذ شرح حال بالینی بدون پیش‌داوری و نگارش نامه ترخیص استاندارد پزشکی به زبان آلمانی رسمی با واژگان Fachsprache.",
      pillar2Title: "۲. تصمیم‌گیری مبتنی بر شواهد و گایدلاین‌های AWMF:",
      pillar2Desc: "توجیه تصمیمات درمانی بر مبنای راهنماهای علمی معتبر آلمان و نحوه مشاوره و اخذ رضایت آگاهانه از بیمار (Patientenaufklärung).",
      pillar3Title: "۳. مدیریت موقعیت‌های اورژانسی و کار تیمی بالینی:",
      pillar3Desc: "رفتار خونسرد و ساختاریافته در شرایط حاد اورژانس و هماهنگی سریع با پزشک ارشد (Oberarzt) و کادر پرستاری."
    };
  }

  // 3. Nursing & Clinical Care
  if (
    roleText.includes("nurse") ||
    roleText.includes("pflege") ||
    roleText.includes("پرستار")
  ) {
    return {
      pillar1Title: "۱. مستندسازی حقوقی مراقبت (Pflegedokumentation):",
      pillar1Desc: "ثبت بی‌درنگ و دقیق کلیه اقدامات دارویی، پانسمان‌ها و تغییر وضعیت بیمار به عنوان سند قانونی قابل استناد در مراجع آلمان.",
      pillar2Title: "۲. بهداشت دست و کنترل عفونت (RKI / 5 Momente):",
      pillar2Desc: "پایبندی ۱۰۰٪ به دستورالعمل‌های کنترل عفونت بیمارستانی انستیتو رابرت کخ و پروتکل‌های ایزولاسیون باکتری‌های مقاوم.",
      pillar3Title: "۳. ارتباط همدلانه و اخلاق حرفه‌ای (Empathie & Respekt):",
      pillar3Desc: "تعامل محترمانه و صبورانه با سالمندان و بیماران و توانایی حفظ آرامش در مواجهه با شیفت‌های سنگین بیمارستانی."
    };
  }

  // 4. Engineering & CAD/Civil/Mechanical/Electrical
  if (
    roleText.includes("engineer") ||
    roleText.includes("مهندس") ||
    roleText.includes("mechanical") ||
    roleText.includes("civil") ||
    roleText.includes("electrical") ||
    roleText.includes("cad") ||
    roleText.includes("عمران") ||
    roleText.includes("مکانیک") ||
    roleText.includes("برق")
  ) {
    return {
      pillar1Title: "۱. انطباق با استانداردهای صنعتی DIN, ISO و Eurocode:",
      pillar1Desc: "در مهندسی آلمان، هر تصمیم فنی و طراحی باید دقیقاً به شماره استاندارد صنعتی (مانند DIN EN یا ISO) و تلورانس‌های هندسی (GD&T) مستند شود.",
      pillar2Title: "۲. مدیریت ریسک، خطا و ارزیابی FMEA:",
      pillar2Desc: "تاکید بر طراحی مقاوم در برابر خطا (Poka-Yoke)، شبیه‌سازی‌های تحلیلی قبل از ساخت و پایبندی به آیین‌نامه‌های ایمنی CE.",
      pillar3Title: "۳. مستندسازی ساخت‌یافته و مستندات فنی (Technische Dokumentation):",
      pillar3Desc: "توانایی تهیه نقشه‌های اجرایی بی‌نقص، دفترچه محاسبات فنی قابل ممیزی و تعامل کارآمد با تیم‌های ساخت و کارگاه."
    };
  }

  // 5. Accounting, Finance & Tax
  if (
    roleText.includes("account") ||
    roleText.includes("حسابدار") ||
    roleText.includes("مالی") ||
    roleText.includes("finance") ||
    roleText.includes("datev") ||
    roleText.includes("hgb")
  ) {
    return {
      pillar1Title: "۱. تسلط بر قانون تجارت آلمان (HGB) و اصول GoBD:",
      pillar1Desc: "پایبندی سخت‌گیرانه به اصول ثبت اسناد، ارزش‌گذاری دارایی‌ها و استانداردهای بستن حساب‌های مالی در آلمان.",
      pillar2Title: "۲. دقت محاسباتی و تسلط بر DATEV و سیستم مالیات ارزش افزوده (UStG):",
      pillar2Desc: "تسلط بر کدینگ حساب‌های آلمان (SKR03/04)، اظهارنامه‌های ارزش افزوده در سامانه ELSTER و تطبیق تراکنش‌ها.",
      pillar3Title: "۳. مستندسازی شفاف و رازداری مالی (Verschwiegenheit):",
      pillar3Desc: "ارائه گزارش‌های سود و زیان (GuV) و ترازنامه مالیاتی با قابلیت ممیزی توسط اداره مالیات (Finanzamt)."
    };
  }

  // 6. IT & Software Engineering
  if (
    roleText.includes("software") ||
    roleText.includes("dev") ||
    roleText.includes("نرم‌افزار") ||
    roleText.includes("برنامه‌نویس") ||
    roleText.includes("it") ||
    roleText.includes("cloud")
  ) {
    return {
      pillar1Title: "۱. تفکر معماری و توجیه چرایی راهکارها:",
      pillar1Desc: "در شرکت‌های تک آلمان، چرایی انتخاب یک معماری یا تکنولوژی (Trade-offs & System Design) مهم‌تر از کدنویسی سریع یا اجرای صرف است.",
      pillar2Title: "۲. فرهنگ کیفیت، کلین‌کد و تست‌های خودکار:",
      pillar2Desc: "تاکید ویژه بر Clean Architecture، تست‌های خودکار یکپارچه (Unit/Integration Tests) و پایداری و امنیت پایپ‌لاین CI/CD.",
      pillar3Title: "۳. صداقت فنی، متدولوژی چابک و تعهد به Definition of Done:",
      pillar3Desc: "در صورت عدم تسلط بر یک مبحث، اعلام مستقیم ندانستن همراه با رویکرد یادگیری سیستماتیک، امتیاز بسیار بالایی نزد لیدهای فنی دارد."
    };
  }

  // 7. General Professional Fallback
  return {
    pillar1Title: "۱. انضباط فرآیندی و استانداردهای کاری آلمان:",
    pillar1Desc: "پایبندی به دستورالعمل‌های مدون سازمانی (SOPs)، تفکیک شفاف مسئولیت‌ها و دقت در تحویل خروجی‌های مستند شده.",
    pillar2Title: "۲. فرهنگ سازمانی پذیرش خطا و حل مسئله (Fehlerkultur):",
    pillar2Desc: "رویکرد ساختاریافته در ریشه‌یابی خطاها، ارائه راهکارهای پیشگیرانه و تعهد به بهبود مستمر کیفیت خدمات.",
    pillar3Title: "۳. ارتباط حرفه‌ای و صداقت تخصصی:",
    pillar3Desc: "شفافیت در بیان توانمندی‌ها و شکاف‌های مهارتی، استقبال از بازخوردهای سازنده و احترام به تعادل کاری و ضوابط تیمی."
  };
}

/**
 * Standard Catalog Roles with neutral Software/IT at index 0.
 * Telecom RF is moved to its specific niche position.
 */
export const STANDARD_JOB_ROLES_CATALOG: TargetJobRole[] = [
  {
    id: "fullstack-dev",
    title: "توسعه‌دهنده فول‌استک و مهندسی نرم‌افزار (React / TypeScript / Node.js)",
    titleDe: "Full Stack Softwareentwickler/in (React / TypeScript / Node.js)",
    kldbCode: "KldB 43414 - Softwareentwicklung (Experte)",
    category: "فناوری اطلاعات و نرم‌افزار",
    germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
    avgSalaryRange: "68,000 - 88,000 €",
    germanEmployerDuties: [
      "توسعه فرانت‌اند تعاملی، ماژولار و بهینه‌سازی‌شده با TypeScript، React و فریم‌ورک Next.js با رعایت اصول دسترسی‌پذیری (WCAG).",
      "طراحی و پیاده‌سازی سرویس‌های بک‌اند مطمئن (Node.js/Express/NestJS) و ساخت APIهای امن RESTful و GraphQL.",
      "طراحی پایگاه‌های داده رابطه‌ای و بهینه‌سازی کوئری‌های SQL با رعایت استانداردهای امنیتی داده‌های اروپا (GDPR Compliance).",
      "پیاده‌سازی تست‌های خودکار یکپارچه و اند-تو-اند (Jest, Vitest, Playwright/Cypress) با پوشش کد بالاتر از ۸۰ درصد.",
      "کانتینرسازی سرویس‌ها با Docker و ایجاد پایپ‌لاین‌های استقرار خودکار CI/CD در محیط‌های کلود (AWS, GCP یا Azure)."
    ],
    skills: [
      {
        id: "core_lang",
        name: "زبان‌ها و فریم‌ورک‌های مدرن (React/Next/TypeScript)",
        nameEn: "Modern Frameworks & TypeScript",
        germanBenchmark: 88,
        userScore: 84,
        description: "تسلط بر TypeScript عمیق، State Management مدرن، Hooks و معماری کامپوننت.",
        germanContext: "اکثر شرکت‌های تک برلین و مونیخ تسلط شدید به TypeScript و Next.js را الزامی می‌دانند.",
        actionRecommendation: "یک پروژه فول‌استک اوپن‌سورس با تست‌های کامل Jest/Playwright در گیت‌هاب قرار دهید."
      },
      {
        id: "cloud_devops",
        name: "زیرساخت ابری و CI/CD (Docker/K8s/AWS)",
        nameEn: "Cloud & CI/CD Pipelines",
        germanBenchmark: 78,
        userScore: 74,
        description: "کانتینرسازی با Docker، پایپ‌لاین‌های GitHub Actions و کار با سرویس‌های AWS/GCP.",
        germanContext: "توسعه‌دهندگان در آلمان مستقل عمل می‌کنند و استقرار کلود بخشی از وظایف روزمره است.",
        actionRecommendation: "گواهی رسمی AWS Certified Developer یا Docker Fundamentals رزومه شما را متمایز می‌کند."
      },
      {
        id: "arch_testing",
        name: "معماری نرم‌افزار و تستینگ (TDD/E2E/Clean Code)",
        nameEn: "Clean Architecture & Testing",
        germanBenchmark: 85,
        userScore: 78,
        description: "کدنویسی بر مبنای SOLID، تست واحد و یکپارچگی (Jest, Cypress, Vitest).",
        germanContext: "کارفرمایان آلمانی به پوشش تست بالای ۸۰٪ و پایداری کد وسواس مهندسی دارند.",
        actionRecommendation: "روی الگوهای Clean Architecture و پوشش تست بالای ۸۰٪ در پروژه‌های نمونه تمرکز کنید."
      },
      {
        id: "db_api",
        name: "پایگاه‌های داده و طراحی API (PostgreSQL/GraphQL/GDPR)",
        nameEn: "Database Optimization & API Design",
        germanBenchmark: 80,
        userScore: 82,
        description: "طراحی اسکیمای بهینه، کوئری‌های کارآمد SQL، RESTful استاندارد و GraphQL.",
        germanContext: "رعایت استانداردهای امنیتی GDPR در نگهداری داده‌های کاربران در شرکت‌های آلمانی حیاتی است.",
        actionRecommendation: "قوانین داده‌های حساس اروپایی (GDPR Compliance) را در معماری بک‌اند پیاده کنید."
      },
      {
        id: "agile_standards",
        name: "استاندارد اسکرام و مستندسازی (Agile / Jira / Confluence)",
        nameEn: "Agile, Jira & German Tech Docs",
        germanBenchmark: 82,
        userScore: 80,
        description: "کار در اسپرینت‌های منظم، تخمین دقیق Story Points و نگارش مستندات به زبان انگلیسی/آلمانی.",
        germanContext: "تیم‌های آلمانی به دیسیپلین اسکرام و شفافیت فرآیندی تیکت‌ها اهمیت بسیار می‌دهند.",
        actionRecommendation: "رزومه خود را با اشاره به مشارکت فعال در اسپرینت‌های اسکرام و تعریف OKR غنی سازید."
      },
      {
        id: "security_gdpr",
        name: "امنیت سایبری و حریم خصوصی (OWASP & GDPR Compliance)",
        nameEn: "Web Security (OWASP Top 10) & GDPR",
        germanBenchmark: 76,
        userScore: 72,
        description: "احراز هویت JWT/OAuth2، محافظت در برابر XSS/CSRF، رمزنگاری و مدیریت کوکی‌ها.",
        germanContext: "نقض حریم خصوصی در آلمان جرایم سنگین قانونی به همراه دارد؛ امنیت کد اولویت نخست است.",
        actionRecommendation: "مطالعه گایدلاین‌های OWASP Top 10 و پیاده‌سازی سرفصل‌های امنیتی در وب‌اپلیکیشن نمونه."
      }
    ],
    overallMatchSummary: {
      matchPercentage: 78,
      topStrengths: ["توسعه ماژولار و تمیز فرانت‌اند و بک‌اند", "تسلط بر معماری رابط کاربری و تایپ‌اسکریپت", "طراحی پایگاه‌های داده"],
      criticalGaps: ["پوشش تست‌های خودکار (Unit/E2E بالای ۸۰٪)", "زیرساخت ابری و Docker", "الزامات امنیتی GDPR"],
      priorityCertificatesDe: ["AWS Certified Solutions Architect / Developer", "Certified ScrumMaster (CSM)", "Meta Full-Stack Professional"],
      germanCvOptimizationTip: "لینک مستقیم ریپازیتوری‌های تمیز گیت‌هاب حاوی تست‌های خودکار و مستندات Readme انگلیسی را در ابتدای رزومه قرار دهید."
    }
  }
];

/**
 * Intelligent generator: translates applicant's actual resume data
 * into an accurate, customized German job role, employer duties,
 * and technical interview comparison table.
 */
export function generateIntelligentSkillsGapRole(input: SkillsGapProfileInput): TargetJobRole {
  const rawField = (input.field || "").trim();
  const rawTarget = (input.targetRole || input.title || "").trim();
  const rawSkills = (input.skills || "").trim();
  const rawDegree = (input.degree || "bachelor").trim();
  const rawExp = Number(input.experience) || 3;
  const germanLevel = (input.germanLevel || "B1").trim();
  const historyHighlights = Array.isArray(input.workHistoryHighlights) ? input.workHistoryHighlights : [];
  const historyText = historyHighlights.join(" ");
  const education = (input.educationSummary || "").trim();
  const rawText = (input.rawTextSummary || "").trim();

  const combinedText = `${rawField} ${rawTarget} ${rawSkills} ${rawDegree} ${historyText} ${education} ${rawText}`.toLowerCase();
  
  // Weight language competency: C1 English gives high competency (75%+) in the German international & tech market
  const englishLevel = (input.englishLevel || "B2").trim();
  const isC1English = ["C1", "C2", "C1/C2", "Advanced"].includes(englishLevel) || 
                      englishLevel.includes("C1") || 
                      englishLevel.includes("C2") ||
                      englishLevel.toLowerCase().includes("ielts 7") ||
                      englishLevel.toLowerCase().includes("ielts 8");
  const langBoost = isC1English ? 10 : (englishLevel === "B2" ? 6 : 2);
  const baseScore = Math.min(94, Math.max(50, 56 + rawExp * 4 + langBoost));

  // Helper to extract top actual skills from applicant
  const extractTopSkills = (): string[] => {
    if (!rawSkills) return [];
    return rawSkills
      .split(/[,،\n|;/]+/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 35);
  };
  const extractedSkillList = extractTopSkills();
  const topSkillStr = extractedSkillList.slice(0, 4).join("، ") || "مهارت‌های فنی استخراج‌شده";

  // 1. Python / Backend / AI / Data Engineering
  if (
    combinedText.includes("python") ||
    combinedText.includes("django") ||
    combinedText.includes("fastapi") ||
    combinedText.includes("flask") ||
    (combinedText.includes("پایتون") && !combinedText.includes("telecom"))
  ) {
    return {
      id: "python-backend-dev",
      title: "توسعه‌دهنده تخصصی پایتون و بک‌اند (Python / FastAPI / Cloud Services)",
      titleDe: "Backend-Entwickler/in Python (m/w/d)",
      kldbCode: "KldB 43414 - Softwareentwicklung (Experte)",
      category: "فناوری اطلاعات و توسعه بک‌اند",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "68,000 - 90,000 €",
      germanEmployerDuties: [
        `طراحی، پیاده‌سازی و نگهداری میکروسرویس‌های مقیاس‌پذیر بک‌اند با Python و فریم‌ورک‌های مدرن نظیر FastAPI و Django.`,
        `طراحی پایگاه‌های داده رابطه‌ای و NoSQL (PostgreSQL, Redis) و بهینه‌سازی کوئری‌ها بر اساس استانداردهای عملکردی آلمان.`,
        `کانتینرسازی سرویس‌ها با Docker و ایجاد پایپ‌لاین‌های استقرار مستمر (CI/CD) در محیط‌های ابری (AWS, GCP یا Azure).`,
        `توسعه تست‌های خودکار واحد و یکپارچگی (PyTest, Coverage > 80%) و رعایت استانداردهای Clean Code و PEP 8.`,
        `رعایت قوانین حریم خصوصی و امنیت داده‌های اروپا (EU GDPR / BDSG) و مستندسازی API با OpenAPI/Swagger.`
      ],
      skills: [
        {
          id: "python_core_async",
          name: "پایتون پیشرفته و برنامه‌نویسی ناهمگام (FastAPI / AsyncIO / Typing)",
          nameEn: "Advanced Python & Async Architectures",
          germanBenchmark: 88,
          userScore: Math.min(94, baseScore + 6),
          description: "تسلط عمیق بر پایتون ۳، AsyncIO، Type Hinting، Pydantic و ساختارهای داده.",
          germanContext: "کارفرمایان آلمانی بر کدهای ساختاریافته، تایپ‌شده و تمیز با تست‌های کامل تاکید دارند.",
          actionRecommendation: "ارائه ریپازیتوری‌های نمونه حاوی FastAPI، داکر و تست‌های خودکار PyTest."
        },
        {
          id: "db_orm_perf",
          name: "پایگاه داده و بهینه‌سازی کوئری (PostgreSQL / SQLAlchemy / Redis)",
          nameEn: "Databases, ORM & Caching (PostgreSQL, Redis)",
          germanBenchmark: 85,
          userScore: Math.min(90, baseScore + 2),
          description: "طراحی اسکیما، ایندکس‌گذاری، مایگریشن با Alembic و کشینگ با Redis.",
          germanContext: "مدیریت بهینه بارهای سنگین و تسلط بر کوئری‌های SQL از سوالات متداول مصاحبه‌های فنی است.",
          actionRecommendation: "تسلط بر بهینه‌سازی کوئری‌های کند و مکانیزم‌های Connection Pooling."
        },
        {
          id: "cloud_docker_cicd",
          name: "کانتینرسازی و کلود (Docker / Kubernetes / CI/CD)",
          nameEn: "Containerization & Cloud Deployments",
          germanBenchmark: 82,
          userScore: Math.min(88, baseScore),
          description: "نگارش Multi-stage Dockerfile، داکر کامپوز و پایپ‌لاین‌های GitHub Actions.",
          germanContext: "در شرکت‌های آلمانی مهندس بک‌اند مسئولیت کامل کانتینرسازی سرویس‌های خود را دارد.",
          actionRecommendation: "ایجاد یک پایپ‌لاین اتوماتیک تست و بیلد Docker Image روی گیت‌هاب."
        },
        {
          id: "testing_quality_pytest",
          name: "تست‌نویسی و کنترل کیفیت (PyTest / Mock / TDD)",
          nameEn: "Automated Testing & Code Quality (PyTest)",
          germanBenchmark: 86,
          userScore: Math.min(88, baseScore - 2),
          description: "تست‌های واحد، تست‌های انتگریشن، Mocking و سنجش Code Coverage بالای ۸۰ درصد.",
          germanContext: "تست‌نویسی شرط جدایی‌ناپذیر پذیرش Pull Request در تیم‌های فنی آلمان است.",
          actionRecommendation: "افزودن تست‌های کامل به ریپازیتوری‌های پورتفولیو و نمایش نشان Codecov."
        },
        {
          id: "microservices_api",
          name: "معماری میکروسرویس و صف پیام (REST / gRPC / RabbitMQ / Kafka)",
          nameEn: "Microservices & Message Queues",
          germanBenchmark: 80,
          userScore: Math.min(86, baseScore - 4),
          description: "طراحی APIهای رویدادمحور (Event-Driven)، ارتباط gRPC و مدیریت پیام با Celery/RabbitMQ.",
          germanContext: "سیستم‌های توزیع‌شده مقیاس‌پذیر در شرکت‌های آلمانی نیازمند تسلط بر صف‌ها هستند.",
          actionRecommendation: "پیاده‌سازی یک پروژه ساده با معماری رویدادمحور و صف پیام."
        },
        {
          id: "security_gdpr_python",
          name: "امنیت نرم‌افزار و حریم خصوصی داده‌ها (GDPR / OWASP / JWT)",
          nameEn: "Data Privacy & Application Security (GDPR/OWASP)",
          germanBenchmark: 78,
          userScore: Math.min(84, baseScore - 6),
          description: "احراز هویت OAuth2/JWT، رمزنگاری کلمات عبور و حفظ محرمانگی داده‌ها مطابق GDPR آلمان.",
          germanContext: "رعایت الزامات حفاظت از داده‌ها در آلمان دارای نظارت سفت و سخت قانونی است.",
          actionRecommendation: "مطالعه و پیاده‌سازی اصول ذخیره‌سازی امن داده‌های هویتی کاربران."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `تسلط بر برنامه‌نویسی پایتون و ابزارهای مرتبط (${extractedSkillList.slice(0, 3).join(", ") || "FastAPI, PostgreSQL"})`,
          `سابقه کار مستند ${rawExp} ساله در حوزه بک‌اند و نرم‌افزار`,
          "آشنایی با متدولوژی‌های مدرن مهندسی نرم‌افزار"
        ],
        criticalGaps: [
          "تست‌نویسی با پوشش بالای ۸۰ درصد (PyTest)",
          "الزامات امنیت داده و مقررات حفاظت اطلاعات اتحادیه اروپا (GDPR)",
          "مدیریت زیرساخت‌های ابری و پایپ‌لاین‌های CI/CD"
        ],
        priorityCertificatesDe: [
          "AWS Certified Developer - Associate",
          "Certified Kubernetes Application Developer (CKAD)",
          "PCAP - Certified Associate in Python Programming"
        ],
        germanCvOptimizationTip: "در رزومه آلمانی (Lebenslauf)، نام پکیج‌ها و متدهای پایتونی که استفاده کرده‌اید را همراه با شاخص‌های عددی اثر پروژه (مثلاً کاهش ۴۰ درصدی زمان پاسخگویی API) قید فرمایید."
      }
    };
  }

  // 2. Java / Spring Boot / Enterprise Backend
  if (
    combinedText.includes("java") ||
    combinedText.includes("spring boot") ||
    combinedText.includes("جاوا") ||
    combinedText.includes("hibernate") ||
    combinedText.includes("kotlin")
  ) {
    return {
      id: "java-spring-dev",
      title: "مهندسی بک‌اند جاوا و نرم‌افزارهای سازمانی (Java / Spring Boot / Microservices)",
      titleDe: "Java / Spring Boot Softwareentwickler/in (m/w/d)",
      kldbCode: "KldB 43414 - Softwareentwicklung (Experte)",
      category: "فناوری اطلاعات و سیستم‌های سازمانی",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "70,000 - 92,000 €",
      germanEmployerDuties: [
        `توسعه سیستم‌های مقیاس‌پذیر سازمانی با Java 17/21 و فریم‌ورک Spring Boot (Spring Cloud, Spring Security, Spring Data).`,
        `طراحی معماری‌های میکروسرویس مستقل با ارتباطات REST و صف‌های توزیع‌شده Apache Kafka یا RabbitMQ.`,
        `طراحی و نگهداری پایگاه‌های داده رابطه‌ای سازمانی (PostgreSQL, Oracle, MySQL) و استفاده بهینه از JPA/Hibernate.`,
        `پیاده‌سازی تست‌های خودکار با JUnit 5, Mockito و Testcontainers بر مبنای استانداردهای کیفی شرکت‌های آلمانی.`,
        `همکاری در فرآیندهای DevOps، کانتینرسازی داکر و استقرار روی کلاسترهای Kubernetes (OpenShift).`
      ],
      skills: [
        {
          id: "java_spring_core",
          name: "هسته جاوا و فریم‌ورک اسپرینگ (Java 17/21 / Spring Boot 3)",
          nameEn: "Modern Java & Spring Boot Framework",
          germanBenchmark: 90,
          userScore: Math.min(94, baseScore + 4),
          description: "تسلط بر Java مدرن، تزریق وابستگی (DI)، Spring Security و Spring Data.",
          germanContext: "بخش بانکی و صنایع بزرگ آلمان ستون فقرات خود را بر پایه‌ جاوا و اسپرینگ بنا کرده‌اند.",
          actionRecommendation: "ارائه پروژه‌های نمونه با Spring Boot 3 و مستندات تمیز معماری."
        },
        {
          id: "microservices_kafka",
          name: "معماری میکروسرویس و پیام‌رسانی (Kafka / RabbitMQ / Cloud)",
          nameEn: "Microservices & Distributed Streaming",
          germanBenchmark: 85,
          userScore: Math.min(88, baseScore),
          description: "طراحی سرویس‌های توزیع‌شده، مدیریت خطاها و پردازش رویداد با Kafka.",
          germanContext: "صنایع خودرو و تجارت الکترونیک آلمان بر پردازش بی‌درنگ داده‌ها با کافکا تکیه دارند.",
          actionRecommendation: "پیاده‌سازی سناریوی Event Sourcing با Spring Cloud و Kafka."
        },
        {
          id: "db_jpa_perf",
          name: "مدیریت داده و کارایی پایگاه داده (JPA / Hibernate / PostgreSQL)",
          nameEn: "Data Persistence & Database Tuning",
          germanBenchmark: 86,
          userScore: Math.min(90, baseScore + 2),
          description: "کوئری‌های بهینه، رفع مشکل N+1 در Hibernate و مدیریت تراکنش‌ها.",
          germanContext: "تست‌های مصاحبه فنی آلمانی سوالات عمیقی از مکانیزم‌های کش و تراکنش‌های دیتابیس دارند.",
          actionRecommendation: "مرور مفاهیم Transaction Isolation و ایندکس‌گذاری دیتابیس."
        },
        {
          id: "testing_junit_testcontainers",
          name: "تست‌های سازمانی و شبیه‌سازی (JUnit 5 / Mockito / Testcontainers)",
          nameEn: "Enterprise Testing & Testcontainers",
          germanBenchmark: 88,
          userScore: Math.min(86, baseScore - 4),
          description: "تست‌های مجتمع با داکر واقعی دیتابیس با Testcontainers و تست‌های Mockito.",
          germanContext: "پوشش تست بالای ۸۰٪ با ابزارهایی چون JaCoCo در آلمان معیار تضمین کیفیت است.",
          actionRecommendation: "ایجاد نمونه تستی که دیتابیس واقعی را با Testcontainers بالا می‌آورد."
        },
        {
          id: "docker_k8s_java",
          name: "زیرساخت ابری و کانتینر (Docker / Kubernetes / OpenShift)",
          nameEn: "Container Orchestration & OpenShift",
          germanBenchmark: 82,
          userScore: Math.min(86, baseScore - 2),
          description: "بهینه‌سازی تصاویر داکر جاوا (JLink / Multi-stage) و استقرار روی کوبرنتیز.",
          germanContext: "پلتفرم‌های RedHat OpenShift در شرکت‌های بزرگ آلمان نظیر زیمنس و فولکس‌واگن فراگیر هستند.",
          actionRecommendation: "مطالعه اصول استقرار کانتینرهای جاوا با حافظه بهینه در کوبرنتیز."
        },
        {
          id: "security_clean_code",
          name: "کد تمیز و امنیت سازمانی (Clean Code / OWASP / Design Patterns)",
          nameEn: "Clean Architecture & Enterprise Security",
          germanBenchmark: 84,
          userScore: Math.min(88, baseScore),
          description: "الگوهای طراحی GoF، کدهای بازسازی‌پذیر و رعایت دستورالعمل‌های امنیتی OWASP.",
          germanContext: "مهندسان نرم‌افزار آلمانی برای ساختار منظم و کدهای خوانا احترام ویژه‌ای قائلند.",
          actionRecommendation: "مرور الگوهای Clean Architecture و Hexagonal Architecture در جاوا."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `تسلط بر اکوسیستم سازمانی جاوا و اسپرینگ (${extractedSkillList.slice(0, 3).join(", ") || "Spring Boot, JPA"})`,
          `تجربه ${rawExp} ساله در معماری و پیاده‌سازی نرم‌افزارهای سازمانی`,
          "درک ساختار پایگاه‌های داده رابطه‌ای و ترنزکشن‌ها"
        ],
        criticalGaps: [
          "تست‌های خودکار یکپارچه با Testcontainers",
          "استقرار کانتینری روی Kubernetes / OpenShift",
          "آشنایی با زیرساخت‌های کلود مدرن"
        ],
        priorityCertificatesDe: [
          "Oracle Certified Professional: Java SE Developer",
          "Spring Certified Professional",
          "AWS Certified Solutions Architect"
        ],
        germanCvOptimizationTip: "پروژه‌های بانکی، تجاری یا سازمانی گذشته را با ذکر نسخه جاوا، نسخه اسپرینگ، دیتابیس و نقش مستقیم خود در رزومه ثبت نمایید."
      }
    };
  }

  // 3. DevOps / SRE / Cloud Platform
  if (
    combinedText.includes("devops") ||
    combinedText.includes("sre") ||
    combinedText.includes("kubernetes") ||
    combinedText.includes("terraform") ||
    combinedText.includes("دواپس") ||
    combinedText.includes("کلود") ||
    (combinedText.includes("cloud") && (combinedText.includes("aws") || combinedText.includes("azure") || combinedText.includes("infra")))
  ) {
    return {
      id: "devops-cloud-engineer",
      title: "مهندسی دوآپس، پلتفرم ابری و پایداری زیرساخت (DevOps / Kubernetes / SRE)",
      titleDe: "DevOps & Cloud Platform Engineer (m/w/d)",
      kldbCode: "KldB 43114 - Systemadministration & Cloud (Experte)",
      category: "زیرساخت فناوری اطلاعات و کلود",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "72,000 - 95,000 €",
      germanEmployerDuties: [
        `طراحی، استقرار و مدیریت کلاسترهای Kubernetes در محیط‌های ابری سازمانی (AWS EKS, Azure AKS یا On-Premise).`,
        `پیاده‌سازی زیرساخت به عنوان کد (IaC) با Terraform و مدیریت تنظیمات با Ansible بر مبنای متدهای GitOps (ArgoCD/Flux).`,
        `طراحی و نگهداری پایپ‌لاین‌های اتوماتیک CI/CD (GitLab CI, GitHub Actions) با تضمین کنترل کیفیت و اسکن‌های امنیتی (SonarQube, Trivy).`,
        `راه‌اندازی سیستم‌های جامع مانیتورینگ، لاگینگ و هشدار (Prometheus, Grafana, OpenTelemetry, ELK Stack).`,
        `رعایت خط‌مشی‌های امنیتی فدرال آلمان (BSI IT-Grundschutz) و استانداردهای ایزو ۲۷۰۰۱ در مدیریت دسترسی‌ها و شبکه‌ها.`
      ],
      skills: [
        {
          id: "k8s_orchestration",
          name: "کوبرنتیز و کانتینرسازی پیشرفته (Kubernetes / Helm / Docker)",
          nameEn: "Container Orchestration (Kubernetes & Helm)",
          germanBenchmark: 90,
          userScore: Math.min(94, baseScore + 6),
          description: "مدیریت کلاستر، Ingress، شبکه CNI، مانیتورینگ منابع و Helm Charts.",
          germanContext: "شرکت‌های مدرن آلمان بخش اعظم سرویس‌های خود را روی کوبرنتیز اجرا می‌کنند.",
          actionRecommendation: "اخذ گواهینامه معتبر CKA (Certified Kubernetes Administrator)."
        },
        {
          id: "iac_terraform",
          name: "زیرساخت به عنوان کد (Terraform / Terragrunt / Ansible)",
          nameEn: "Infrastructure as Code (IaC / Terraform)",
          germanBenchmark: 86,
          userScore: Math.min(88, baseScore + 2),
          description: "مدیریت ماژولار منابع، State Management از راه دور و پیاده‌سازی متدهای Dry.",
          germanContext: "مدیریت ابری بدون IaC در شرکت‌های آلمانی پذیرفته نیست؛ اتوماسیون کامل الزامی است.",
          actionRecommendation: "تهیه ماژول‌های تمیز ترافورم در گیت‌هاب همراه با داکیومنت‌های انگلیسی."
        },
        {
          id: "ci_cd_gitops",
          name: "پایپ‌لاین‌های استقرار و گیت‌آپس (GitLab CI / ArgoCD / GitOps)",
          nameEn: "CI/CD & GitOps Delivery",
          germanBenchmark: 88,
          userScore: Math.min(90, baseScore + 4),
          description: "اتوماسیون بیلد، تست، تست‌های امنیتی SAST/DAST و استقرار پیوسته بر مبنای GitOps.",
          germanContext: "کاهش زمان تحویل و حذف خطاهای انسانی در استقرار نرم‌افزارها در اولویت کارفرمایان آلمانی است.",
          actionRecommendation: "پیاده‌سازی نمونه گردش کار GitOps با ArgoCD و یک کلاستر آزمایشی."
        },
        {
          id: "observability_monitoring",
          name: "مانیتورینگ و مانیتورینگ عملکرد (Prometheus / Grafana / SRE)",
          nameEn: "Observability, Metrics & SRE (Prometheus, Grafana)",
          germanBenchmark: 84,
          userScore: Math.min(86, baseScore),
          description: "تعریف SLI/SLO، داشبوردهای Grafana، عیب‌یابی با Alertmanager و ترکینگ با OpenTelemetry.",
          germanContext: "فرهنگ SRE و پایش پایدار در سازمان‌های بزرگ آلمانی از ارکان اصلی واحد IT است.",
          actionRecommendation: "طراحی و به اشتراک‌گذاری یک داشبورد کاربردی گرانا برای پایش منابع سرور."
        },
        {
          id: "cloud_platform_aws_azure",
          name: "سرویس‌های ابری عمومی (AWS / Azure / GCP / Cloud Networking)",
          nameEn: "Cloud Platforms & Hybrid Networking",
          germanBenchmark: 85,
          userScore: Math.min(88, baseScore + 2),
          description: "معماری VPC، امنیت IAM، تعادل بار (Load Balancing) و ذخیره‌سازی ابری.",
          germanContext: "شرکت‌های آلمانی مهاجرت سریعی به کلودهای عمومی یا ابرهای محلی سازگار با GDPR دارند.",
          actionRecommendation: "اخذ مدرک AWS Solutions Architect یا Azure Administrator."
        },
        {
          id: "bsi_security_compliance",
          name: "امنیت زیرساخت و انطباق BSI آلمان (BSI IT-Grundschutz / ISO 27001)",
          nameEn: "Cloud Security, Compliance & BSI Grundschutz",
          germanBenchmark: 80,
          userScore: Math.min(80, baseScore - 8),
          description: "اسکن آسیب‌پذیری‌ها، مدیریت اسرار (HashiCorp Vault) و استانداردهای امنیتی BSI آلمان.",
          germanContext: "اداره فدرال امنیت اطلاعات آلمان (BSI) استانداردهای سختگیرانه‌ای برای شرکت‌ها وضع کرده است.",
          actionRecommendation: "آشنایی با سرفصل‌های BSI IT-Grundschutz و مدیریت امن Secrets."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `تسلط بر مفاهیم کانتینرها و زیرساخت‌های نوین (${extractedSkillList.slice(0, 3).join(", ") || "Kubernetes, Docker, CI/CD"})`,
          `سابقه ${rawExp} ساله در مدیریت سرور و اتوماسیون سرویس‌ها`,
          "توانایی عیب‌یابی سریع و رفع گلوگاه‌های سیستم"
        ],
        criticalGaps: [
          "استانداردهای امنیت اطلاعات و رگولاتوری BSI آلمان",
          "گواهینامه‌های رسمی کلود (AWS / Azure / CKA)",
          "پیاده‌سازی فرآیندهای کامل GitOps با ArgoCD"
        ],
        priorityCertificatesDe: [
          "CKA - Certified Kubernetes Administrator",
          "HashiCorp Certified: Terraform Associate",
          "AWS Certified DevOps Engineer - Professional"
        ],
        germanCvOptimizationTip: "میزان کاهش Downtime یا بهبود راندمان Deployments را به صورت درصد و اعداد واقعی در پروژه‌های رزومه خود پررنگ سازید."
      }
    };
  }

  // 4. Civil Engineering & Structural Design
  if (
    combinedText.includes("عمران") ||
    combinedText.includes("سازه") ||
    combinedText.includes("civil") ||
    combinedText.includes("structural") ||
    combinedText.includes("etabs") ||
    combinedText.includes("sap2000") ||
    combinedText.includes("statik") ||
    combinedText.includes("bauingenieur")
  ) {
    return {
      id: "civil-structural-eng",
      title: "مهندسی عمران و محاسبات سازه (Bauingenieurwesen / Statik & Tragwerksplanung)",
      titleDe: "Bauingenieur/in für Tragwerksplanung & Statik (m/w/d)",
      kldbCode: "KldB 31104 - Bauingenieurwesen (Experte)",
      category: "مهندسی عمران و ساخت",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "64,000 - 86,000 €",
      germanEmployerDuties: [
        `انجام محاسبات استاتیکی، دینامیکی و طراحی سازه‌های بتن‌آرمه و فولادی طبق استاندارد یوروکد (Eurocode 2, Eurocode 3) و پیوست‌های ملی آلمان (DIN EN).`,
        `مدلسازی سازه‌ای و تحلیل المان محدود سازه‌ها با نرم‌افزارهای استاندارد صنعت مهندسی آلمان نظیر Dlubal RFEM, Sofistik, ETABS یا AxisVM.`,
        `تدوین دفترچه‌های محاسبات فنی (Statische Berechnung) با رعایت فرمت‌های مورد پذیرش سازمان‌های کنترل ساختمان آلمان (Prüfstatik).`,
        `همکاری در مدل‌سازی اطلاعات ساختمان (BIM) با نرم‌افزارهای Revit یا Allplan و کنترل تداخلات سازه با تاسیسات (MEP).`,
        `نظارت بر نقشه‌های آرماتوربندی و اجرایی (Bewehrungspläne) و هماهنگی با مهندسان ناظر و معماران پروژه بر اساس مقررات ساختمانی ایالتی آلمان (Landesbauordnung).`
      ],
      skills: [
        {
          id: "eurocode_din_standards",
          name: "آیین‌نامه‌های یوروکد و استانداردهای آلمان (Eurocode 2/3 & DIN EN)",
          nameEn: "Eurocode Standards & German National Annexes",
          germanBenchmark: 90,
          userScore: Math.min(88, baseScore - 2),
          description: "تسلط بر الزامات بارگذاری (DIN EN 1991)، سازه‌های بتنی (EC2) و سازه‌های فولادی (EC3).",
          germanContext: "ارائه محاسبات استاتیکی در آلمان بدون انطباق دقیق با پیوست‌های ملی یوروکد غیرممکن است.",
          actionRecommendation: "مطالعه تفاوت‌های بار برف، باد و پیوست‌های DIN آلمان در مقایسه با استانداردهای دیگر."
        },
        {
          id: "structural_software_rfem",
          name: "نرم‌افزارهای تخصصی محاسبات سازه (Dlubal RFEM / Sofistik / ETABS)",
          nameEn: "Structural Analysis Software (RFEM, Sofistik, ETABS)",
          germanBenchmark: 88,
          userScore: Math.min(92, baseScore + 4),
          description: "تحلیل خطی و غیرخطی، طراحی پی‌ها و اتصالات سازه‌ای به کمک نرم‌افزارهای مرجع.",
          germanContext: "نرم‌افزارهای آلمانی نظیر Dlubal RFEM و Sofistik در دفاتر مهندسی کشور آلمان اولویت استخدام دارند.",
          actionRecommendation: "دانلود نسخه آزمایشی Dlubal RFEM و مدل‌سازی یک نمونه سازه بر مبنای یوروکد."
        },
        {
          id: "bim_revit_allplan",
          name: "مدلسازی اطلاعات ساختمان (BIM / Autodesk Revit / Allplan)",
          nameEn: "BIM Methodology & 3D Reinforcement Modeling",
          germanBenchmark: 84,
          userScore: Math.min(88, baseScore),
          description: "طراحی نقشه‌های اجرایی سه‌بعدی، آرماتوربندی دیجیتال و استخراج لیستوفر دقیق میلگردها.",
          germanContext: "پروژه‌های زیرساختی و عمومی آلمان الزام قانونی به استفاده از متدولوژی BIM دارند.",
          actionRecommendation: "تکمیل یک پروژه BIM سازه‌ای و نمایش شیت‌های نقشه‌های آرماتوربندی آن."
        },
        {
          id: "statische_berechnung_docs",
          name: "نگارش دفترچه محاسبات استاتیکی (Statische Berechnung & Prüfstatik)",
          nameEn: "Structural Calculations Documentation (Statik)",
          germanBenchmark: 86,
          userScore: Math.min(84, baseScore - 6),
          description: "تدوین منظم مسیر انتقال بارها، کنترل‌های خیز و ترک‌خوردگی برای ارائه به بازرس رسمی سازه.",
          germanContext: "مهندسان کنترل ایستایی سازه (Prüfingenieure) در آلمان استانداردهای گزارش‌نویسی سفت و سختی دارند.",
          actionRecommendation: "مشاهده نمونه‌های دفترچه‌های Statik آلمانی و آشنایی با اصطلاحات بارها و فرضیات."
        },
        {
          id: "site_supervision_vob",
          name: "مدیریت اجرایی کارگاه و قراردادهای VOB (Bauleitung & VOB)",
          nameEn: "Site Supervision & German VOB Contract Regulations",
          germanBenchmark: 80,
          userScore: Math.min(82, baseScore - 4),
          description: "نظارت کارگاهی، رعایت ضوابط ایمنی کار و آشنایی با سیستم حقوقی ساخت‌وساز آلمان (VOB).",
          germanContext: "درک مراحل فازهای ساخت (HOAI Leistungsphasen 6-8) برای مهندسان فیلد بسیار پرکاربرد است.",
          actionRecommendation: "آشنایی با فازهای خدماتی HOAI در حوزه مهندسی ساختمان آلمان."
        },
        {
          id: "fachdeutsch_bau",
          name: "زبان آلمانی تخصصی عمران و سازه (Fachdeutsch Bauwesen)",
          nameEn: "Technical German for Civil Engineers",
          germanBenchmark: 82,
          userScore: germanLevel === "B2" || germanLevel === "C1" ? 82 : germanLevel === "B1" ? 65 : 45,
          description: "تسلط بر واژگان تخصصی آرماتوربندی، بتن، فونداسیون، بارگذاری و مکاتبات ساختمانی.",
          germanContext: "در کار با معماران، پیمانکاران و ادارات شهرداری آلمان، زبان آلمانی B2 ارزش تعیین‌کننده دارد.",
          actionRecommendation: "یادگیری واژگان Bewehrung, Lastabtragung, Rissbreite, Durchstanznachweis."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `تسلط بر اصول محاسبات استاتیکی و مکانیک سازه (${extractedSkillList.slice(0, 3).join(", ") || "ETABS, SAP2000, AutoCAD"})`,
          `سابقه کار ${rawExp} ساله در طراحی و نظارت سازه‌ها`,
          "توانایی کار با نرم‌افزارهای تحلیلی و مهندسی"
        ],
        criticalGaps: [
          "تطبیق با آیین‌نامه‌های یوروکد (DIN EN 1992/1993)",
          "زبان آلمانی تخصصی مهندسی ساختمان (Fachdeutsch Bau)",
          "مدلسازی BIM با نرم‌افزارهای Allplan یا Revit Structure"
        ],
        priorityCertificatesDe: [
          "Dlubal RFEM Structural Specialist",
          "Autodesk Certified Professional: Revit for Structural Design",
          "تاییدیه ارزشیابی مدرک تحصیلی ZAB آلمان"
        ],
        germanCvOptimizationTip: "لیست پروژه‌های سازه‌ای خود را به صورت ضمیمه پورتفولیو (شامل متراژ، نوع اسکلت سازه، نرم‌افزارهای مورد استفاده و آیین‌نامه‌ها) همراه رزومه ارائه دهید."
      }
    };
  }

  // 5. Accounting, Finance & Controlling
  if (
    combinedText.includes("حسابدار") ||
    combinedText.includes("مالی") ||
    combinedText.includes("حسابرسی") ||
    combinedText.includes("accountant") ||
    combinedText.includes("accounting") ||
    combinedText.includes("finance") ||
    combinedText.includes("datev") ||
    combinedText.includes("hgb") ||
    combinedText.includes("buchhalter")
  ) {
    return {
      id: "finance-accountant",
      title: "حسابداری و مدیریت مالیاتی آلمان (Finanzbuchhalter/in / HGB & DATEV)",
      titleDe: "Finanzbuchhalter/in / Bilanzbuchhalter/in (m/w/d)",
      kldbCode: "KldB 72214 - Finanzbuchhaltung (Fachkraft/Experte)",
      category: "امور مالی، حسابداری و مدیریت مالیات",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "52,000 - 74,000 €",
      germanEmployerDuties: [
        `ثبت و رسیدگی به اسناد حسابداری جاری شرکت‌ها مطابق قانون تجارت آلمان (Handelsgesetzbuch - HGB) و استانداردهای بین‌المللی IFRS.`,
        `مدیریت و ثبت اسناد دریافتنی و پرداختنی (Debitoren- und Kreditorenbuchhaltung) در نرم‌افزارهای مرجع آلمان نظیر DATEV یا SAP FI/CO.`,
        `محاسبه و ارسال اظهارنامه‌های دوره‌ای مالیات بر ارزش افزوده (Umsatzsteuer-Voranmeldung) از طریق سامانه رسمی مالیاتی آلمان (ELSTER).`,
        `مشارکت در بستن حساب‌های ماهانه، سه‌ماهه و سالانه (Monats- und Jahresabschlüsse) و ارائه گزارش‌های سود و زیان (GuV) و ترازنامه (Bilanz).`,
        `هماهنگی با مشاوران رسمی مالیاتی آلمان (Steuerberater) و حسابرسان و تطبیق مغایرت‌های بانکی و تراکنش‌ها.`
      ],
      skills: [
        {
          id: "german_hgb_principles",
          name: "اصول حسابداری قانون تجارت آلمان (HGB & GoBD)",
          nameEn: "German Accounting Code (HGB) & GoBD Compliance",
          germanBenchmark: 90,
          userScore: Math.min(86, baseScore - 4),
          description: "تسلط بر قوانین ثبت دفاتر، اصول احتیاط، ارزش‌گذاری دارایی‌ها و استهلاک در آلمان.",
          germanContext: "هر شرکتی در آلمان موظف به پایبندی دقیق به چارچوب‌های سختگیرانه HGB و GoBD است.",
          actionRecommendation: "گذراندن دوره‌های آنلاین حسابداری بر مبنای HGB آلمان."
        },
        {
          id: "datev_sap_software",
          name: "نرم‌افزارهای حسابداری استاندارد آلمان (DATEV / SAP S/4HANA)",
          nameEn: "Accounting Software (DATEV & SAP FI/CO)",
          germanBenchmark: 88,
          userScore: Math.min(84, baseScore - 6),
          description: "کار با DATEV Rechnungswesen، ثبت فاکتورهای دیجیتال و استفاده از ماژول‌های SAP.",
          germanContext: "بیش از ۸۰ درصد شرکت‌های کوچک و متوسط آلمان (Mittelstand) از سیستم DATEV استفاده می‌کنند.",
          actionRecommendation: "کسب گواهینامه کاربری DATEV (DATEV-Führerschein) که شانس استخدام را چند برابر می‌کند."
        },
        {
          id: "tax_vat_elster",
          name: "مالیات و اظهارنامه بر ارزش افزوده (Umsatzsteuer / ELSTER)",
          nameEn: "VAT, Corporate Tax & ELSTER Filings",
          germanBenchmark: 86,
          userScore: Math.min(82, baseScore - 8),
          description: "قوانین نرخ‌های مالیات ارزش افزوده ۱۹٪ و ۷٪ در آلمان، مالیات معاملات درون‌اروپایی و سامانه ELSTER.",
          germanContext: "محاسبه دقیق مالیات بر ارزش افزوده و ارسال به موقع آن از وظایف محوری حسابداران است.",
          actionRecommendation: "آشنایی با مبانی Umsatzsteuergesetz (UStG) و قوانین فاکتور معتبر در آلمان."
        },
        {
          id: "reconciliation_ap_ar",
          name: "حساب‌های دریافتنی و پرداختنی (Kreditoren / Debitoren / Zahlungsverkehr)",
          nameEn: "Accounts Payable & Receivable (AP/AR & SEPA)",
          germanBenchmark: 85,
          userScore: Math.min(90, baseScore + 2),
          description: "تطبیق تراکنش‌های بانکی، پرداخت‌های بین‌بانکی SEPA، اخطاریه‌های بدهی (Mahnwesen) و کنترل نقدینگی.",
          germanContext: "دقت در اسناد تسویه‌حساب و مدیریت مطالبات معوقه در اقتصاد آلمان حساسیت بالایی دارد.",
          actionRecommendation: "اشاره به تجربیات مدیریت حجم بالای فاکتورها و تسویه‌های بانکی در رزومه."
        },
        {
          id: "financial_reporting_excel",
          name: "اکسل پیشرفته و گزارش‌گیری مالی (Advanced MS Excel / GuV)",
          nameEn: "Financial Analytics & Advanced Excel Models",
          germanBenchmark: 84,
          userScore: Math.min(92, baseScore + 4),
          description: "توابع پیشرفته مالی، Pivot Tables، فرمول‌نویسی پیچیده و طراحی نمودارهای تحلیلی جریان وجوه نقد.",
          germanContext: "تسلط عمیق بر اکسل در مصاحبه‌های استخدامی مالی به صورت آزمون عملی سنجیده می‌شود.",
          actionRecommendation: "ارائه نمونه مدل‌های مالی شبیه‌سازی‌شده در اکسل."
        },
        {
          id: "fachdeutsch_finanzen",
          name: "زبان آلمانی تخصصی مالی و حسابداری (Fachdeutsch Rechnungswesen)",
          nameEn: "Business German for Finance & Accounting",
          germanBenchmark: 85,
          userScore: germanLevel === "B2" || germanLevel === "C1" ? 82 : germanLevel === "B1" ? 62 : 42,
          description: "تسلط بر کدینگ حساب‌ها (SKR03 / SKR04)، نام حساب‌ها و مکاتبات اداری به آلمانی.",
          germanContext: "حسابداری حوزه‌ای کاملاً آلمانی‌زبان است و تسلط بر واژگان آن شرط اصلی ورود به کار است.",
          actionRecommendation: "تسلط بر سرفصل‌های کدینگ حسابداری استاندارد آلمان (Kontenrahmen SKR 03 و SKR 04)."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `تسلط بر منطق حسابداری دوبل و تحلیل صورت‌های مالی (${extractedSkillList.slice(0, 3).join(", ") || "Excel, Financial Analysis"})`,
          `سابقه کار ${rawExp} ساله در حسابداری و رسیدگی به دفاتر مالی`,
          "دقت بالا در پردازش ارقام و تطبیق مغایرت‌های مالی"
        ],
        criticalGaps: [
          "کار با نرم‌افزار رسمی حسابداری آلمان (DATEV)",
          "آشنایی با قانون تجارت آلمان (HGB) و قوانین مالیات (UStG)",
          "زبان آلمانی کاری در سطح B2"
        ],
        priorityCertificatesDe: [
          "DATEV Anwender-Zertifikat Finanzbuchführung",
          "IHK Fachkraft Rechnungswesen",
          "مدرک زبان آلمانی telc Deutsch B2 Beruf"
        ],
        germanCvOptimizationTip: "حتماً سوابق کار با نرم‌افزارهای مالیاتی و توانایی کار با سرفصل‌های حسابداری و اکسل پیشرفته را در ابتدای رزومه کاری خود برجسته فرمایید."
      }
    };
  }

  // 5.5 Medical Laboratory, Clinical Microbiology & Life Sciences (MTL / Mikrobiologie)
  if (
    combinedText.includes("میکروبیولوژی") ||
    combinedText.includes("microbio") ||
    combinedText.includes("آزمایشگاه") ||
    combinedText.includes("laboratory") ||
    combinedText.includes("پاتولوژی") ||
    combinedText.includes("pathology") ||
    combinedText.includes("ژنتیک") ||
    combinedText.includes("genetic") ||
    combinedText.includes("بیوتکنولوژی") ||
    combinedText.includes("biotech") ||
    combinedText.includes("زیست") ||
    combinedText.includes("biolog") ||
    combinedText.includes("mtl")
  ) {
    return {
      id: "medical-laboratory-microbiology",
      title: "کارشناس علوم آزمایشگاهی پزشکی و میکروبیولوژی بالینی (MTL / MTLA)",
      titleDe: "Medizinische/r Technologin/Technologe für Laboratoriumsanalytik (MTL / MTLA) - Schwerpunkt Mikrobiologie (m/w/d)",
      kldbCode: "KldB 81412 - Medizinisch-technische Laboratoriumsanalytik (Fachkraft)",
      category: "بهداشت، آزمایشگاه‌های تشخیص طبی و میکروبیولوژی",
      germanDemandLevel: "بسیار بالا (کمبود شدید نیروی متخصص آزمایشگاهی)",
      avgSalaryRange: "42,000 - 58,000 € (طبق تعرفه رسمی TVöD / TV-L)",
      germanEmployerDuties: [
        "انجام آزمایش‌های تشخیصی کشت باکتریایی، قارچ‌شناسی و آنتی‌بیوگرام بر اساس دستورالعمل‌های استاندارد اروپایی EUCAST.",
        "کاربری، کالیبراسیون و نگهداری دستگاه‌های اتوآنالایزر پیشرفته آزمایشگاهی (Sysmex XN, Roche Cobas, bioMérieux VITEK 2, Bruker MALDI-TOF MS).",
        "استقرار و پیاده‌سازی مستمر الزامات قانونی کنترل کیفیت سازمان نظام پزشکی آلمان (Rili-BÄK) و استاندارد DIN EN ISO 15189.",
        "انجام آزمون‌های بیولوژی مولکولی، استخراج اسیدهای نوکلئیک و Real-Time PCR در محیط ایمنی زیستی BSL-2 / TRBA 100.",
        "ثبت و اعتبارسنجی الکترونیک نتایج در سیستم اطلاعات آزمایشگاهی (LIMS / MOLIS / Medat) و اعلام تلفنی فوری مقادیر بحرانی (Panic Values) به پزشکان معالج."
      ],
      skills: [
        {
          id: "microbio_culture_eucast",
          name: "کشت میکروبیولوژی، رنگ‌آمیزی و آنتی‌بیوگرام (Kultivierung & EUCAST)",
          nameEn: "Diagnostic Microbiology, Gram Staining & EUCAST Antibiogram",
          germanBenchmark: 90,
          userScore: Math.min(88, baseScore + 2),
          description: "تسلط بر کشت نمونه‌های بالینی، رنگ‌آمیزی گرم، شناسایی پاتوژن‌ها و سنجش حساسیت آنتی‌بیوتیکی طبق گایدلاین EUCAST.",
          germanContext: "تمام آزمایشگاه‌های تشخیص طبی و بیمارستانی آلمان موظف به اجرای تفسیر آنتی‌بیوگرام بر مبنای استاندارد اروپایی EUCAST هستند.",
          actionRecommendation: "مطالعه و گذراندن دوره آنلاین گایدلاین‌های بالینی سال ۲۰۲۵-۲۰۲۶ کمیته اروپایی EUCAST برای تعیین مقاومت‌های دارویی."
        },
        {
          id: "lab_automation_vitek_maldi",
          name: "اتوماسیون آزمایشگاهی و تجهیزات تشخیصی (MALDI-TOF / VITEK / Cobas)",
          nameEn: "Laboratory Automation, MALDI-TOF MS & Diagnostic Analyzers",
          germanBenchmark: 88,
          userScore: Math.min(85, baseScore),
          description: "کار با سامانه‌های شناسایی طیف‌سنج جرمی MALDI-TOF، سیستم VITEK 2 و اتوآنالایزرهای اتوماتیک هماتولوژی و بیوشیمی.",
          germanContext: "آزمایشگاه‌های بزرگ آلمان (مانند Synlab و Limbach) فرآیند شناسایی سریع را با MALDI-TOF و اتوماسیون کامل انجام می‌دهند.",
          actionRecommendation: "مستندسازی دقیق تجربه کار با مدل‌های خاص دستگاه‌های اتوآنالایزر و سیستم‌های اتوماتیک در رزومه آلمانی."
        },
        {
          id: "rilibak_iso15189_qm",
          name: "کنترل کیفیت آزمایشگاهی و استانداردها (Rili-BÄK & DIN EN ISO 15189)",
          nameEn: "Quality Assurance (Rili-BÄK Guidelines & DIN EN ISO 15189)",
          germanBenchmark: 92,
          userScore: Math.min(80, baseScore - 6),
          description: "اجرای کنترل کیفی داخلی (IQC)، نمودارهای وستگارد، ارزیابی دوره‌ای خارجی (Ringversuche) و مستندسازی انحرافات.",
          germanContext: "دستورالعمل Rili-BÄK نظام پزشکی آلمان یک الزام قانونی غیرقابل اغماض برای کلیه آزمایشگاه‌های پزشکی است.",
          actionRecommendation: "شرکت در دوره‌های تخصصی مجازی آشنایی با الزامات Rili-BÄK و مدیریت کیفیت آزمایشگاهی آلمان."
        },
        {
          id: "molecular_biology_pcr",
          name: "تشخیص مولکولی، استخراج و Real-Time PCR (Molekularbiologie)",
          nameEn: "Molecular Diagnostics, DNA/RNA Extraction & Real-Time PCR",
          germanBenchmark: 86,
          userScore: Math.min(84, baseScore - 2),
          description: "استخراج اسیدهای نوکلئیک، ستاپ واکنش‌های PCR کیفی و کمّی، تفسیر منحنی‌های تکثیر و کنترل‌های منفی/مثبت.",
          germanContext: "بخش‌های تشخیص مولکولی و ویروس‌شناسی بیمارستان‌های آلمان متقاضی جدی نیروهای مسلط بر تکنیک‌های PCR هستند.",
          actionRecommendation: "درج پروژه‌ها، مقالات و تاییدیه‌های کارآموزی مربوط به متدهای PCR و تست‌های سرولوژی الایزا در مدارک."
        },
        {
          id: "lims_lab_informatics",
          name: "سیستم مدیریت اطلاعات آزمایشگاهی (LIMS / MOLIS / Medat)",
          nameEn: "Laboratory Information Management Systems (LIMS & Panic Values)",
          germanBenchmark: 85,
          userScore: Math.min(82, baseScore - 4),
          description: "بارکدگذاری نمونه‌ها، تاییدیه فنی نتایج، اتصال دستگاه‌ها به نرم‌افزار مرکزی و اعلام مقادیر بحرانی (Extremwerte).",
          germanContext: "ردیابی نمونه‌ها و جلوگیری از جابجایی آن‌ها از طریق LIMS با امنیت و دقت بالا در آلمان کنترل می‌شود.",
          actionRecommendation: "آشنایی با اصول عملکرد نرم‌افزارهای LIMS بیمارستانی و پروتکل‌های انتقال داده HL7 در محیط آزمایشگاهی."
        },
        {
          id: "biosafety_trba_german",
          name: "ایمنی زیستی و زبان آلمانی آزمایشگاهی (TRBA 100 / Fachdeutsch B2)",
          nameEn: "Biosafety Regulations (TRBA 100 / BSL-2) & Medical German B2",
          germanBenchmark: 88,
          userScore: germanLevel === "B2" || germanLevel === "C1" ? 82 : germanLevel === "B1" ? 64 : 45,
          description: "ضوابط کار در آزمایشگاه ایمنی زیستی سطح ۲، دستورالعمل‌های انستیتو رابرت کخ (RKI) و اصطلاحات آلمانی پاتولوژی.",
          germanContext: "ارتباط با سرپرست آزمایشگاه و قرائت برگه‌های درخواست آزمایشگاهی مستلزم سطح زبان کاری حداقل B2 است.",
          actionRecommendation: "فراگیری واژگان تخصصی آلمانی نمونه‌های بیولوژیک، باکتری‌ها و اصطلاحات گزارش‌نویسی تشخیصی."
        }
      ],
      interviewAdvice: {
        pillar1Title: "۱. تضمین کیفیت تشخیصی و Rili-BÄK / ISO 15189:",
        pillar1Desc: "در آزمایشگاه‌های آلمان، تحلیل چارت‌های کنترل کیفی وستگارد، اقدام اصلاحی در زمان خروج از محدوده ۲SD و کالیبراسیون دستگاه‌ها حیاتی‌ترین بخش مصاحبه است.",
        pillar2Title: "۲. ایمنی زیستی TRBA 100 و اعلام مقادیر بحرانی (Panic Values):",
        pillar2Desc: "پایبندی به استانداردهای کار در هود لامینار BSL-2، پیشگیری از آلودگی متقاطع و رویه استاندارد تماس فوری تلفنی با پزشک در موارد بحرانی تست‌ها.",
        pillar3Title: "۳. اعتبارسنجی نمونه و استاندارد EUCAST:",
        pillar3Desc: "تسلط بر معیارهای رد نمونه‌های همولیز یا نامناسب و پایبندی به تفسیر علمی مقاومت آنتی‌بیوتیکی طبق استاندارد اروپایی EUCAST."
      },
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `سابقه کار عملی در آزمایشگاه‌های تشخیصی و مهارت در کشت و شناسایی باکتریولوژی (${extractedSkillList.slice(0, 3).join(", ") || "Microbiology, PCR, Culture"})`,
          `تجربه کار بالینی ${rawExp} ساله در آزمایشگاه‌های پزشکی و آشنایی با تکنیک‌های آنالیز نمونه‌ها`,
          "آشنایی با دستگاه‌های اتوآنالایزر و آزمون‌های سنجش حساسیت میکروبی"
        ],
        criticalGaps: [
          "تسلط بر دستورالعمل ملی کنترل کیفی آلمان (Rili-BÄK) و استاندارد DIN EN ISO 15189",
          "گواهی تایید صلاحیت حرفه‌ای و ارزشیابی مدرک تحصیلی به عنوان MTL/MTLA در آلمان",
          "مدرک زبان آلمانی سطح B2 جهت مکالمات کاری و خواندن دستورالعمل‌های کیت‌ها"
        ],
        priorityCertificatesDe: [
          "تاییدیه ارزشیابی مدرک (Anerkennung als MTL / MTLA) از اداره بهداشت ایالتی",
          "دوره تخصصی مدیریت کیفیت آزمایشگاه پزشکی بر مبنای Rili-BÄK و ISO 15189",
          "مدرک زبان آلمانی telc Deutsch B2 یا Goethe B2"
        ],
        germanCvOptimizationTip: "در رزومه آلمانی، بخش‌های تشخیصی که در آن‌ها فعالیت داشته‌اید (باکتریولوژی، هماتولوژی، سرولوژی، PCR مولکولی)، دستگاه‌های اتوآنالایزری که با آن‌ها کار کرده‌اید (نظیر bioMérieux VITEK, Roche Cobas یا Sysmex) و تعداد متوسط نمونه‌های بررسی‌شده در روز را به دقت درج فرمایید."
      }
    };
  }

  // 6. Medical Doctor / Physician
  if (
    combinedText.includes("پزشک") ||
    combinedText.includes("دکتر") ||
    combinedText.includes("طبابت") ||
    combinedText.includes("جراح") ||
    combinedText.includes("arzt") ||
    combinedText.includes("physician") ||
    (combinedText.includes("پزشکی") && !combinedText.includes("مهندسی"))
  ) {
    return {
      id: "medical-doctor-approbation",
      title: "پزشکی عمومی و تخصص‌های بالینی (Assistenzarzt / Approbation)",
      titleDe: "Assistenzarzt/ärztin / Facharzt/ärztin (m/w/d)",
      kldbCode: "KldB 81404 - Humanmedizin (Experte)",
      category: "بهداشت، درمان و علوم پزشکی",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "65,000 - 95,000 € (پایه‌ای)",
      germanEmployerDuties: [
        `ویزیت و معاینه بالینی بیماران بستری و سرپایی در بخش‌های بیمارستانی طبق راهنماهای درمانی انجمن‌های علمی پزشکی آلمان (AWMF Leitlinien).`,
        `ثبت دقیق سوابق بالینی، پرونده بیماران و مستندات سیر بیماری (Patientenakte / Verlaufsdokumentation) به زبان آلمانی رسمی.`,
        `انجام فرآیندهای تشخیصی اولیه (ECG، سونوگرافی، تفسیر آزمایش‌های خون، بیوپسی و آنالیز تصویربرداری CT/MRI).`,
        `تنظیم طرح درمانی، دستور دارویی و ترخیص بیماران همراه با نگارش گزارش ترخیص بالینی (Arztbrief).`,
        `گذراندن آزمون رسمی زبان تخصصی پزشکی (Fachsprachenprüfung - FSP) و آزمون ارزیابی دانش پزشکی (Kenntnisprüfung - KP) جهت اخذ پروانه دائم طبابت در آلمان (Approbation).`
      ],
      skills: [
        {
          id: "fsp_medical_german",
          name: "زبان آلمانی تخصصی پزشکی و پرونده‌نویسی (FSP & Arztbrief)",
          nameEn: "Medical German Examination (FSP) & Clinical Documentation",
          germanBenchmark: 92,
          userScore: germanLevel === "C1" ? 88 : germanLevel === "B2" ? 74 : 52,
          description: "گرفتن شرح حال بالینی (Anamnese)، گفتگو با بیمار و نگارش گزارش ترخیص استاندارد پزشکی.",
          germanContext: "قبولی در آزمون Fachsprachenprüfung نظام پزشکی آلمان شرط اولیه دریافت مجوز طبابت است.",
          actionRecommendation: "شبیه‌سازی روزانه سناریوهای شرح حال بالینی و نگارش Arztbrief با اصطلاحات پزشکی آلمان."
        },
        {
          id: "clinical_guidelines_awmf",
          name: "راهنماهای بالینی و پروتکل‌های درمان آلمان (AWMF Leitlinien)",
          nameEn: "German Clinical Guidelines (AWMF Guidelines)",
          germanBenchmark: 88,
          userScore: Math.min(88, baseScore),
          description: "درمان سیستماتیک بیماری‌های داخلی، جراحی، اورژانس و اطفال منطبق با پروتکل‌های به‌روز اروپا.",
          germanContext: "پزشکان در آلمان ملزم به تصمیم‌گیری بالینی منطبق بر اصول پزشکی مبتنی بر شواهد هستند.",
          actionRecommendation: "مرور پروتکل‌های پرکاربرد اورژانس و داخلی انجمن‌های پزشکی آلمان."
        },
        {
          id: "diagnostic_ultrasound_ecg",
          name: "تشخیص‌های بالینی و پروسیجرها (Sonographie / EKG / Labordiagnostik)",
          nameEn: "Diagnostic Ultrasound, ECG & Lab Interpretation",
          germanBenchmark: 86,
          userScore: Math.min(92, baseScore + 4),
          description: "تفسیر نوار قلب، انجام سونوگرافی پایه شکم و لگن، تفسیر بیوشیمی خون و گازهای خونی.",
          germanContext: "تسلط بر مهارت‌های عملی سونوگرافی و تفسیر سریع ECG امتیاز بالایی در مصاحبه‌های کلینیک‌ها دارد.",
          actionRecommendation: "مستندسازی تعداد سونوگرافی‌ها و پروسیجرهای تشخیصی انجام شده در سوابق کاری."
        },
        {
          id: "emergency_medicine_icu",
          name: "طب اورژانس و احیای قلبی ریوی (Notfallmedizin & ACLS/BLS)",
          nameEn: "Emergency Procedures & Advanced Life Support",
          germanBenchmark: 88,
          userScore: Math.min(90, baseScore + 2),
          description: "مدیریت بیماران بدحال، اینتوباسیون، لوله‌گذاری تراشه، احیای پیشرفته قلبی ریوی و تثبیت وضعیت شوک.",
          germanContext: "حضور در شیفت‌های کشیک بیمارستانی نیازمند تسلط بر مدیریت شرایط بحرانی است.",
          actionRecommendation: "اخذ مدارک معتبر بین‌المللی احیای قلبی (BLS / ACLS)."
        },
        {
          id: "german_drug_prescription",
          name: "داروشناسی و فارماکوپیا آلمان (Arzneimitteltherapie & AMG)",
          nameEn: "German Pharmacotherapy & Prescription Guidelines",
          germanBenchmark: 84,
          userScore: Math.min(84, baseScore - 4),
          description: "شناخت نام‌های تجاری داروهای پرکاربرد در آلمان (Rote Liste)، دوزبندی و تداخلات دارویی.",
          germanContext: "بسیاری از نام‌های تجاری داروها در آلمان متفاوت از نام‌های ژنریک بین‌المللی است.",
          actionRecommendation: "مطالعه کتابچه مرجع دارویی آلمان (Rote Liste) و آشنایی با داروهای متداول بیمارستانی."
        },
        {
          id: "approbation_regulations",
          name: "فرآیند قانونی معادل‌سازی مدرک در آلمان (Approbationsordnung & KP)",
          nameEn: "Approbation Equivalency Procedure & Knowledge Exam",
          germanBenchmark: 85,
          userScore: Math.min(82, baseScore - 6),
          description: "شناخت ساختار نظام بهداشت آلمان، حقوق بیمار، مسئولیت‌های قانونی پزشک و روند آزمون ارزشیابی KP.",
          germanContext: "آگاهی از مراحل قانونی دریافت Berufserlaubnis و Approbation از اتلاف وقت در روند مهاجرت جلوگیری می‌کند.",
          actionRecommendation: "آماده‌سازی مدارک ترجمه‌شده و آغاز مکاتبه با اداره نظام سلامت ایالت مقصد (Landesprüfungsamt)."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `دانش بالینی پایه و فارغ‌التحصیلی پزشکی با ${rawExp} سال سابقه کار درمانی`,
          "مهارت در معاینات بالینی و ارتباط با بیماران",
          "توانایی تصمیم‌گیری در فرآیندهای تشخیصی"
        ],
        criticalGaps: [
          "قبولی در آزمون زبان تخصصی نظام پزشکی آلمان (FSP)",
          "آشنایی با راهنماهای بالینی AWMF و داروهای آلمان (Rote Liste)",
          "معادل‌سازی مدارک و دریافت پروانه طبابت (Approbation / Berufserlaubnis)"
        ],
        priorityCertificatesDe: [
          "مدرک زبان آلمانی عمومی B2 یا C1 پزشکی",
          "گواهی قبولی در آزمون زبان تخصصی Fachsprachenprüfung (FSP)",
          "گواهی بین‌المللی ACLS / BLS"
        ],
        germanCvOptimizationTip: "در رزومه پزشکی آلمانی، دوره‌های عملی گذرانده‌شده در بخش‌ها، تعداد کشیک‌ها، بخش‌های بیمارستانی و تجربیات بالینی را به تفکیک ماه‌های خدمت ذکر فرمایید."
      }
    };
  }

  // 7. Nursing & Clinical Care
  if (
    combinedText.includes("پرستار") ||
    combinedText.includes("nurse") ||
    combinedText.includes("pflege") ||
    combinedText.includes("بهیار") ||
    combinedText.includes("کادر درمان") ||
    combinedText.includes("مامایی") ||
    combinedText.includes("هوشبری")
  ) {
    return {
      id: "nursing-clinical-care",
      title: "پرستاری و مراقبت‌های بالینی (Pflegefachkraft / Gesundheits- und Krankenpflege)",
      titleDe: "Pflegefachmann / Pflegefachfrau (m/w/d)",
      kldbCode: "KldB 81304 - Gesundheits- und Krankenpflege (Fachkraft)",
      category: "بهداشت، درمان و مراقبت‌های سلامت",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "42,000 - 58,000 €",
      germanEmployerDuties: [
        `اجرای دقیق دستورات دارویی، تزریقات، سرم‌تراپی، پانسمان‌های استریل و مراقبت از زخم‌ها طبق استانداردهای بهداشتی آلمان (RKI).`,
        `پایش علائم حیاتی بیماران، ثبت دقیق سیر وضعیت سلامت و تدوین گزارش‌های پرستاری (Pflegedokumentation).`,
        `مراقبت‌های تخصصی پیش و پس از اعمال جراحی و هماهنگی تنگاتنگ با تیم پزشکی بیمارستان.`,
        `مشارکت در فرآیند پذیرش، مراقبت‌های اساسی و ترخیص بیماران با رعایت اصول کرامت انسانی و استانداردهای کیفی.`,
        `رعایت پروتکل‌های ایمنی محیط بیمارستان، کنترل عفونت و دستورالعمل‌های پیشگیری از سقوط و زخم بستر (Dekubitusprophylaxe).`
      ],
      skills: [
        {
          id: "pflegedokumentation_standards",
          name: "مستندسازی پرستاری و ثبت الکترونیک (Pflegedokumentation / SIS)",
          nameEn: "Nursing Documentation & Structured Information (SIS)",
          germanBenchmark: 90,
          userScore: Math.min(84, baseScore - 4),
          description: "ثبت فرآیند مراقبت بر اساس مدل‌های ساختاریافته پرستاری آلمان و نرم‌افزارهای بالینی.",
          germanContext: "مستندسازی پرستاری در آلمان سند حقوقی محسوب شده و نظارت بازرسی کیفی (MDK) بر آن مستمر است.",
          actionRecommendation: "آشنایی با سیستم گزارش‌نویسی پرستاری آلمان (Strukturierte Informationssammlung - SIS)."
        },
        {
          id: "medication_prophylaxis",
          name: "دارودرمانی و پیشگیری‌های بالینی (Dekubitus / Thromboseprophylaxe)",
          nameEn: "Medication Administration & Clinical Prophylaxis",
          germanBenchmark: 88,
          userScore: Math.min(92, baseScore + 2),
          description: "اجرای پروتکل‌های پیشگیری از زخم بستر، ترومبوز وریدی، آسپیراسیون و رعایت اصول ۶گانه تجویز دارو.",
          germanContext: "رعایت دستورالعمل‌های پیشگیری از خطرات بالینی از شاخص‌های اصلی ارزیابی پرستاران در آلمان است.",
          actionRecommendation: "مرور استانداردهای فدرال پیشگیری از زخم فشاری و مراقبت‌های پس از جراحی."
        },
        {
          id: "hygiene_rki_protocols",
          name: "پروتکل‌های بهداشت و کنترل عفونت (RKI Hygienerichtlinien)",
          nameEn: "Infection Control & Robert Koch Institute Standards",
          germanBenchmark: 86,
          userScore: Math.min(88, baseScore),
          description: "شستشو و ضدعفونی اصولی، کار در شرایط استریل، ایزولاسیون بیماران عفونی و دفع ایمن پسماندها.",
          germanContext: "دستورالعمل‌های موسسه روبرت کخ آلمان (RKI) قانون لازم‌الاجرا در تمام مراکز درمانی است.",
          actionRecommendation: "مطالعه گایدلاین‌های ایمنی زیستی و کنترل عفونت‌های بیمارستانی RKI."
        },
        {
          id: "emergency_care_resuscitation",
          name: "فوریت‌های پرستاری و احیای پایه (Notfallmanagement & Reanimation)",
          nameEn: "Emergency Management & BLS Protocols",
          germanBenchmark: 85,
          userScore: Math.min(90, baseScore + 2),
          description: "شناسایی زودهنگام علائم وخامت حال بیمار، اقدامات اولیه احیای قلبی ریوی و فعال‌سازی کد احیا.",
          germanContext: "سرعت عمل در اعلام وضعیت اورژانسی بیمار و مهارت‌های CPR از انتظارات روزمره است.",
          actionRecommendation: "اخذ گواهینامه معتبر بازآموزی Basic Life Support (BLS)."
        },
        {
          id: "empathy_patient_ethics",
          name: "ارتباط با بیمار، همدلی و اصول اخلاق بالینی (Pflegeethik & Empathie)",
          nameEn: "Patient Communication & Compassionate Care",
          germanBenchmark: 86,
          userScore: Math.min(94, baseScore + 6),
          description: "برقراری ارتباط توام با آرامش با بیماران و همراهان، احترام به استقلال فردی و رعایت محرمانگی.",
          germanContext: "بیمارستان‌ها و مراکز درمانی آلمان بر برخورد محترمانه و اخلاق حرفه‌ای حساسیت بالایی دارند.",
          actionRecommendation: "اشاره به بازخوردهای مثبت بیماران و مهارت‌های مراقبت همدلانه در معرفی خود."
        },
        {
          id: "fachdeutsch_pflege",
          name: "زبان آلمانی تخصصی پرستاری (Fachdeutsch Pflege B1/B2)",
          nameEn: "Specialized German for Nursing & Care",
          germanBenchmark: 84,
          userScore: germanLevel === "B2" || germanLevel === "C1" ? 84 : germanLevel === "B1" ? 66 : 46,
          description: "اصطلاحات پزشکی پرکاربرد، گفتگو با پزشکان و همکاران، تحویل شیفت و برقراری ارتباط با سالمندان.",
          germanContext: "مدرک رسمی زبان آلمانی B2 پرستاری (telc Deutsch B1-B2 Pflege) شرط دریافت پروانه در آلمان است.",
          actionRecommendation: "شرکت در دوره‌های آمادگی آزمون زبان آلمانی پرستاری telc Pflege."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `مدرک تحصیلی پرستاری و تجربه بالینی ${rawExp} ساله در بخش‌های درمانی`,
          "مهارت در تزریقات، پانسمان، دارودهی و پایش علائم حیاتی",
          "روحیه قوی کار تیمی و مراقبت دلسوزانه از بیماران"
        ],
        criticalGaps: [
          "مدرک زبان آلمانی رسمی B2 پرستاری (telc Pflege)",
          "آشنایی با سیستم مستندسازی الکترونیکی آلمان (SIS)",
          "معادل‌سازی مدرک تحصیلی (Anerkennungsverfahren) در ایالت مقصد"
        ],
        priorityCertificatesDe: [
          "مدرک زبان آلمانی telc Deutsch B1-B2 Pflege",
          "گواهی تاییدیه معادل‌سازی مدرک (Defizitbescheid یا Anerkennungsurkunde)",
          "گواهینامه دوره‌های بازآموزی BLS / احیای قلبی"
        ],
        germanCvOptimizationTip: "بخش‌های درمانی که در آنها خدمت کرده‌اید (نظیر ICU، CCU، جراحی، اورژانس یا داخلی) را همراه با پروسیجرهای متداول در رزومه آلمانی با دقت منعکس نمایید."
      }
    };
  }

  // 8. Mechanical Engineering & CAD/FEM
  if (
    combinedText.includes("مکانیک") ||
    combinedText.includes("mechanical") ||
    combinedText.includes("solidworks") ||
    combinedText.includes("catia") ||
    combinedText.includes("ansys") ||
    (combinedText.includes("cad") && (combinedText.includes("طراحی قطعات") || combinedText.includes("fea") || combinedText.includes("fem") || combinedText.includes("ماشین")))
  ) {
    return {
      id: "mechanical-cad-eng",
      title: "مهندسی مکانیک، طراحی قطعات و سازه (CAD / FEA / DIN Standards)",
      titleDe: "Maschinenbauingenieur/in / Konstruktionsingenieur/in (m/w/d)",
      kldbCode: "KldB 25104 - Maschinen- und Fahrzeugbau (Experte)",
      category: "مهندسی مکانیک و ساخت صنعتی",
      germanDemandLevel: "بالا (کمبود نیرو)",
      avgSalaryRange: "65,000 - 84,000 €",
      germanEmployerDuties: [
        `مدلسازی سه‌بعدی پیشرفته سطوح و قطعات صنعتی با نرم‌افزارهای استاندارد صنعت آلمان (Siemens NX, CATIA V5/3DEXPERIENCE, SolidWorks).`,
        `تولید نقشه‌های اجرایی دو بعدی (Fertigungszeichnungen) با انطباقات هندسی دقیق بر مبنای تلرانس‌های هندسی و ابعادی (ISO GPS / DIN ISO 1101).`,
        `انجام شبیه‌سازی‌های تنش و کرنش المان محدود (FEM/FEA) با نرم‌افزارهای Ansys یا Abaqus جهت بهینه‌سازی جرم و استحکام خستگی.`,
        `انتخاب مواد مهندسی مطابق استانداردهای متالورژی آلمان (DIN EN 10027) و فرآیندهای تولید اقتصادی (DFM/DFA).`,
        `مدیریت چرخه عمر محصول (PLM) در سیستم‌های Teamcenter یا Windchill و رعایت دستورالعمل ماشین‌آلات اروپایی (CE / Machinery Directive).`
      ],
      skills: [
        {
          id: "cad_solid_nx",
          name: "مدلسازی پارامتریک و سطوح پیچیده (Siemens NX / CATIA / SolidWorks)",
          nameEn: "3D CAD Modeling (Siemens NX, CATIA, SolidWorks)",
          germanBenchmark: 90,
          userScore: Math.min(94, baseScore + 6),
          description: "تسلط بر طراحی قطعات پلاستیکی تزریقی، ورق‌کاری فلزی (Sheet Metal) و مجموعه‌های مکانیکی چند جزئی.",
          germanContext: "صنعت خودروسازی و ماشین‌سازی آلمان بیشترین تمرکز را روی Siemens NX و CATIA دارند.",
          actionRecommendation: "تهیه یک پورتفولیوی فنی مستند از قطعات طراحی شده همراه با رندرهای مهندسی و نقشه‌های انفجاری."
        },
        {
          id: "gdt_iso_din",
          name: "تلرانس‌گذاری هندسی و استانداردهای DIN (ISO GPS / DIN ISO 1101)",
          nameEn: "GD&T & German Drawing Standards (ISO GPS)",
          germanBenchmark: 86,
          userScore: Math.min(88, baseScore),
          description: "تعیین مبناها، انطباقات تلرانسی، زبری سطوح و نقشه‌های دو بعدی آماده تولید بدون ابهام.",
          germanContext: "مهندسان ساخت آلمانی بر انطباق دقیق نقشه با سیستم بین‌المللی ISO GPS بسیار وسواس دارند.",
          actionRecommendation: "مطالعه اصول تلرانس‌گذاری هندسی طبق DIN ISO 1101 و DIN ISO 8015."
        },
        {
          id: "fem_simulation",
          name: "شبیه‌سازی المان محدود و استحکام خستگی (FEA / Ansys / FEM)",
          nameEn: "Finite Element Analysis (FEA / FEM Simulation)",
          germanBenchmark: 84,
          userScore: Math.min(88, baseScore - 2),
          description: "تحلیل استاتیکی، مودال، حرارتی و ارزیابی معیارهای شکست مکانیکی مانند Von Mises.",
          germanContext: "ارائه تحلیل‌های شبیه‌سازی معتبر قبل از ساخت نمونه فیزیکی، بخش مهمی از فرآیند R&D در آلمان است.",
          actionRecommendation: "تکمیل و مستندسازی یک پروژه تحلیل تنش کامل همراه با همگرایی المان‌بندی و تفسیر نتایج."
        },
        {
          id: "plm_teamcenter",
          name: "مدیریت داده‌های محصول و مهندسی معکوس (Teamcenter / PLM / PDM)",
          nameEn: "Product Lifecycle Management (PLM / Teamcenter)",
          germanBenchmark: 80,
          userScore: Math.max(45, Math.min(80, baseScore - 12)),
          description: "کنترل نسخه‌بندی قطعات، ساختار درخت محصول (BOM) و فرآیندهای تغییرات مهندسی (ECO/ECR).",
          germanContext: "تمام شرکت‌های بزرگ خودروسازی و ماشین‌سازی آلمان پروژه‌ها را در Teamcenter یا Windchill مدیریت می‌کنند.",
          actionRecommendation: "آشنایی با متدولوژی‌های مدیریت تغییر مهندسی و چرخه‌های انتشار نقشه در سیستم‌های PLM."
        },
        {
          id: "manufacturing_materials",
          name: "فرآیندهای تولید و متالورژی (DFM / Materials DIN EN)",
          nameEn: "Design for Manufacturing (DFM) & German Materials",
          germanBenchmark: 85,
          userScore: Math.min(90, baseScore + 2),
          description: "شناخت گریدهای فولادی، آلیاژهای آلومینیوم و طراحی اقتصادی متناسب با ماشینکاری CNC یا ریخته‌گری.",
          germanContext: "تسلط بر کدگذاری متریال آلمانی (Werkstoffnummer مانند 1.4301 برای استیل) نشانه تسلط حرفه‌ای است.",
          actionRecommendation: "استفاده از کدهای استاندارد اروپایی و آلمانی متریال‌ها در نقشه‌ها و مستندات رزومه."
        },
        {
          id: "german_tech_docs_mech",
          name: "زبان آلمانی فنی مکانیک و ماشین‌سازی (Fachdeutsch Maschinenbau)",
          nameEn: "Technical German for Mechanical Engineers",
          germanBenchmark: 78,
          userScore: germanLevel === "B2" || germanLevel === "C1" ? 80 : germanLevel === "B1" ? 64 : 46,
          description: "توانایی تحلیل مستندات استاندارد، ارزیابی نیازمندی‌های مشتری (Lastenheft/Pflichtenheft) به آلمانی.",
          germanContext: "ارتباط با سرپرستان کارگاه ساخت و تراشکاری در آلمان نیازمند دانش واژگان فنی مکانیک است.",
          actionRecommendation: "یادگیری اصطلاحات Lastenheft, Pflichtenheft, Zeichnung, Passung, Baugruppe."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          `تسلط بر نرم‌افزارهای طراحی سه‌بعدی CAD (${extractedSkillList.slice(0, 3).join(", ") || "SolidWorks, CATIA"})`,
          "توانایی درک ساختار مکانیکی قطعات و تولید نقشه‌های ساخت",
          "تحلیل المان محدود و بهینه‌سازی سازه"
        ],
        criticalGaps: [
          "استانداردهای نقشه‌کشی و تلرانس‌گذاری آلمان (ISO GPS / DIN)",
          "تجربه کار با سیستم‌های سازمانی مدیریت چرخه عمر محصول (PLM)",
          "کدگذاری استاندارد آلیاژهای آلمان (Werkstoffnummer)"
        ],
        priorityCertificatesDe: [
          "SolidWorks CSWP / CSWE",
          "Siemens NX Certified Professional",
          "Ansys Certified Associate"
        ],
        germanCvOptimizationTip: "یک لینک پورتفولیوی آنلاین PDF (شامل رندرها و تصاویر طراحی‌های صنعتی و تحلیل‌های تنش) به رزومه آلمانی الصاق نمایید."
      }
    };
  }

  // 9. Telecom RF Field Test & Mast Inspection (STRICT ONLY)
  if (
    (combinedText.includes("مخابرات") && (combinedText.includes("سیار") || combinedText.includes("دکل") || combinedText.includes("رادیو") || combinedText.includes("rf"))) ||
    combinedText.includes("drive test") ||
    combinedText.includes("bnetza") ||
    combinedText.includes("tems investigation") ||
    combinedText.includes("nemo outdoor") ||
    (combinedText.includes("telecom") && (combinedText.includes("rf") || combinedText.includes("mast") || combinedText.includes("antenna")))
  ) {
    return {
      id: "telecom-rf",
      title: "مهندسی مخابرات، ارتباطات رادیویی و تست دکل‌ها (Drive Test & BNetzA)",
      titleDe: "Ingenieur/in für Mobilfunktechnik & Funknetzplanung (RF Field Test & Antennentechnik)",
      kldbCode: "KldB 43124 - Funk- und Mobilfunktechnik (Experte)",
      category: "مهندسی برق و مخابرات",
      germanDemandLevel: "بسیار بالا (موقعیت بحرانی)",
      avgSalaryRange: "68,000 - 88,000 €",
      germanEmployerDuties: [
        "انجام تست‌های میدانی سیگنال و درایو تست جاده‌ای (Drive Test) با تحلیلگرهای طیف پیشرفته (Rohde & Schwarz, Anritsu) و سیستم‌های Nemo Outdoor / TEMS Investigation جهت ارزیابی پوشش و کیفیت شبکه‌های 4G LTE و 5G NR.",
        "بازرسی فنی دکل‌های مخابراتی (Mast & Rooftop Sites)، کنترل تراز، آزیموت و زاویه تیلت فیزیکی/الکتریکی آنتن‌ها (RET) و نظارت بر کابل‌کشی کواکسیال و فیبر نوری (FTTA).",
        "محاسبات حریم ایمنی امواج الکترومغناطیسی (EMF) طبق آیین‌نامه فدرال 26. BImSchV جهت اخذ مجوز رسمی Standortbescheinigung از آژانس فدرال شبکه آلمان (Bundesnetzagentur - BNetzA).",
        "تحلیل شاخص‌های عملکرد رادیویی (RSRP, RSRQ, SINR, Call Drop Rate, Throughput) و تدوین گزارش‌های جامع منطقه‌ای (Regional Coverage Reports) برای اپراتورهای آلمان (Deutsche Telekom, Vodafone, Telefónica O2).",
        "ردیابی و عیب‌یابی تداخلات فرکانسی (Interference Hunting) و بهینه‌سازی پارامترهای رادیویی سلول‌ها با ابزارهای تخصصی برنامه‌ریزی شبکه نظیر Atoll و Planet.",
        "رعایت استانداردهای ایمنی کار در ارتفاع، اخذ گواهی سلامت کار در ارتفاع (Höhentauglichkeit G41 / DGUV Regel 112-198) و هماهنگی مجوزهای ورود به سایت‌ها (Site Access Coordination)."
      ],
      skills: [
        {
          id: "drive_test_tools",
          name: "ابزارهای درایو تست و آنالایزر طیف (Rohde & Schwarz / Nemo / TEMS)",
          nameEn: "Drive Test & Spectrum Analyzers (R&S, Nemo)",
          germanBenchmark: 88,
          userScore: 84,
          description: "تسلط بر دستگاه‌های اندازه‌گیری فرکانسی Rohde & Schwarz و سیستم‌های ضبط Nemo/TEMS در خودرو و عابر پیاده.",
          germanContext: "اپراتورهای آلمانی استانداردهای دقیقی برای آزمون‌های سیار جاده‌ای و ریلی (ICE Trains) دارند.",
          actionRecommendation: "ارائه نمونه گزارش‌های اندازه‌گیری توان سیگنال (RSRP) و گواهی کاربری تجهیزات اندازه‌گیری در رزومه."
        },
        {
          id: "bnetza_regulations",
          name: "رگولاتوری BNetzA آلمان و گواهی تشعشع (Standortbescheinigung / 26. BImSchV)",
          nameEn: "BNetzA Regulations & EMF Safety (26. BImSchV)",
          germanBenchmark: 84,
          userScore: 68,
          description: "محاسبه فواصل ایمنی پرتوهای غیریونساز، مستندسازی فنی سایت و قوانین آژانس فدرال شبکه آلمان.",
          germanContext: "هیچ دکل مخابراتی در آلمان بدون مجوز معتبر Standortbescheinigung از BNetzA اجازه ارسال فرکانس ندارد.",
          actionRecommendation: "مطالعه راهنمای رسمی آژانس BNetzA در خصوص روش‌های اندازه‌گیری میدان الکترومغناطیسی (EMF)."
        },
        {
          id: "mast_antenna_safety",
          name: "بازرسی دکل، تنظیم آنتن و ایمنی کار در ارتفاع (G41 / DGUV / Tilt & Azimuth)",
          nameEn: "Mast Inspection, Antenna Alignment & G41 Height Safety",
          germanBenchmark: 86,
          userScore: 82,
          description: "بررسی فیزیکی دکل‌ها، کنترل زاویه تیلت و آزیموت با ابزارهای الکترونیکی و تجهیزات حفاظت فردی ضد سقوط (PSAgA).",
          germanContext: "گواهی پزشکی کار در ارتفاع (G41) شرط الزامی ورود به سایت‌های دکل و بام برای مهندسان فیلد است.",
          actionRecommendation: "اشاره به سوابق کار عملیاتی در سایت‌ها و آمادگی کامل برای تست‌های پزشکی ایمنی کار در آلمان."
        },
        {
          id: "ran_architecture",
          name: "معماری رادیویی نسل ۴ و ۵ و شکل‌دهی امواج (4G/5G RAN & Massive MIMO)",
          nameEn: "4G LTE / 5G NR Radio Access Network & Beamforming",
          germanBenchmark: 90,
          userScore: 80,
          description: "درک لایه‌های فیزیکی و MAC در 5G NR، باندهای فرکانسی آلمان (n78, n28)، فناوری Massive MIMO و بهینه‌سازی Handover.",
          germanContext: "پروژه‌های ارتقای نسل ۵ در شبکه Deutsche Telekom و Vodafone با سرعت بالا در حال اجرا هستند.",
          actionRecommendation: "مرور ساختار فریم و پارامترهای رادیویی 5G NR بر مبنای استانداردهای 3GPP Release 16/17."
        },
        {
          id: "regional_reporting",
          name: "گزارش‌نویسی فنی منطقه‌ای و تحلیل شاخص‌های KPI (Coverage & Quality Audits)",
          nameEn: "Regional Coverage Reports & KPI Analytics",
          germanBenchmark: 85,
          userScore: 85,
          description: "تهیه گزارش‌های منسجم تحلیلی، نمودارهای حرارتی پوشش (Coverage Heatmaps) و شناسایی مناطق کور و پر تداخل.",
          germanContext: "ارائه خروجی‌های مدون، ساختاریافته و عددی با فرمت‌های استاندارد شرکتی آلمان به شدت مورد تاکید است.",
          actionRecommendation: "تهیه یک نمونه گزارش نمونه کار (Dossier) به فرمت انگلیسی/آلمانی با نمودارهای تحلیل کیفیت سیگنال."
        },
        {
          id: "technical_german_coordination",
          name: "زبان آلمانی فنی و هماهنگی‌های پروژه (Technisches Deutsch & Site Access)",
          nameEn: "Technical German & Operator Coordination",
          germanBenchmark: 80,
          userScore: germanLevel === "B2" || germanLevel === "C1" ? 82 : germanLevel === "B1" ? 64 : 48,
          description: "توانایی ارتباط فنی با مهندسان شیفت، درک اصطلاحات مخابراتی آلمانی و هماهنگی ورود به سایت با مالکان املاک.",
          germanContext: "در کارهای میدانی و ارتباط با پیمانکاران محلی در آلمان، تسلط زبان کاری آلمانی (B1+) ارزش افزوده بسیار بالایی دارد.",
          actionRecommendation: "یادگیری واژگان تخصصی آلمانی دکل و مخابرات (Funkmast, Antennenneigung, Messprotokoll, Störungsbehebung)."
        }
      ],
      overallMatchSummary: {
        matchPercentage: Math.round(baseScore),
        topStrengths: [
          "تجربه عملیاتی در اندازه‌گیری سیگنال، تحلیل میدانی و درایو تست",
          "آشنایی عمیق با ساختار فیزیکی دکل‌های مخابراتی و آنتن‌ها",
          "توانایی استخراج گزارش‌های آماری منطقه‌ای برای کارفرما"
        ],
        criticalGaps: [
          "آشنایی با آیین‌نامه‌ها و مجوزهای BNetzA آلمان (Standortbescheinigung)",
          "گواهی رسمی معاینات پزشکی کار در ارتفاع در آلمان (G41 Höhentauglichkeit)",
          "زبان آلمانی فنی برای مکاتبات مستقیم با اپراتورها و پیمانکاران محلی"
        ],
        priorityCertificatesDe: [
          "BNetzA EMF Safety Certification (Standortverfahren 26. BImSchV)",
          "DGUV Regel 112-198 (PSAgA / کار با تجهیزات حفاظت فردی در ارتفاع)",
          "Rohde & Schwarz / VIAVI Certified Drive Test Specialist",
          "telc Deutsch B1/B2 Beruf"
        ],
        germanCvOptimizationTip: "در رزومه آلمانی خود، نام پروژه‌ها را به صورت 'RF Field & Drive Test Specialist' ذکر کرده و تجربیات کار با دستگاه‌های آنالایزر و دکل‌ها را همراه با برند تجهیزات (مانند Rohde & Schwarz یا Nemo) برجسته نمایید."
      }
    };
  }

  // 10. Dynamic Tailored Synthesizer for Any Other Role
  // Injects candidate's actual extracted tools, projects, and degree into real German expectations!
  const cleanTitle = rawTarget || rawField || "متخصص فنی";
  const primaryTool = extractedSkillList[0] || cleanTitle;
  const secondaryTool = extractedSkillList[1] || "ابزارهای صنعتی مدرن";
  const tertiaryTool = extractedSkillList[2] || "سیستم‌های تخصصی";

  return {
    id: `custom-${encodeURIComponent(cleanTitle).slice(0, 20)}`,
    title: `متخصص ${cleanTitle} در استاندارد شغلی آلمان (${primaryTool})`,
    titleDe: `Spezialist/in für ${cleanTitle} (m/w/d)`,
    kldbCode: "طبقه‌بندی رسمی فدرال KldB متناسب با تخصص متقاضی",
    category: `تخصصی: ${cleanTitle}`,
    germanDemandLevel: "بالا (بر اساس سوابق و تقاضای کار در آلمان)",
    avgSalaryRange: "56,000 - 82,000 €",
    germanEmployerDuties: [
      `اجرای وظایف تخصصی و فنی در حوزه ${cleanTitle} با تکیه بر ابزارهای اصلی (${primaryTool} و ${secondaryTool}) منطبق با استانداردهای کیفی و فرآیندی آلمان.`,
      `همکاری در تیم‌های چندرشته‌ای بین‌المللی و اجرای پروژه‌ها بر مبنای متدولوژی‌های استاندارد صنعت آلمان (Agile, DIN/ISO).`,
      `مستندسازی جامع فرآیندها، تدوین گزارش‌های فنی و رعایت اصول تضمین کیفیت (Qualitätssicherung - QS).`,
      `تحلیل داده‌های عملیاتی، رفع عیوب فرآیندی و بهبود راندمان با استفاده از راهکارهای نوین (${tertiaryTool}).`,
      `رعایت مقررات قانونی، استانداردهای ایمنی محیط کار و قوانین حریم خصوصی و امنیت داده‌های آلمان (EU GDPR / BDSG).`
    ],
    skills: [
      {
        id: "core_domain_primary_tool",
        name: `تسلط بر ابزار و تکنولوژی محوری (${primaryTool})`,
        nameEn: `Core Technology & Tools Mastery (${primaryTool})`,
        germanBenchmark: 88,
        userScore: Math.min(94, baseScore + 4),
        description: `تسلط عملیاتی و پیشرفته بر ${primaryTool} در پیاده‌سازی پروژه‌های واقعی و صنعتی.`,
        germanContext: "کارفرمایان آلمانی به تسلط مستقل و عملگرایانه بر ابزار اصلی بدون نیاز به آموزش اولیه اهمیت بسیار می‌دهند.",
        actionRecommendation: `مستندسازی پروژه‌های اجرا شده با ${primaryTool} به همراه شاخص‌های عددی نتیجه در رزومه آلمانی.`
      },
      {
        id: "secondary_tools_methods",
        name: `ابزارها و چارچوب‌های مکمل (${secondaryTool} / ${tertiaryTool})`,
        nameEn: "Complementary Tools & Methodologies",
        germanBenchmark: 85,
        userScore: Math.min(90, baseScore + 2),
        description: `به‌کارگیری همزمان ابزارهای کمکی، اتوماسیون وظایف و پایپ‌لاین‌های کاری.`,
        germanContext: "انعطاف‌پذیری و تسلط بر اکوسیستم نرم‌افزاری پیرامون تخصص از شروط احراز شایستگی است.",
        actionRecommendation: "ارائه نمونه‌های مستند از نحوه اتصال ابزارهای مختلف در پروژه‌ها."
      },
      {
        id: "german_din_iso_quality",
        name: "استانداردها و آیین‌نامه‌های اجرایی آلمان (DIN / ISO / Compliance)",
        nameEn: "German & European Quality Standards (DIN/ISO)",
        germanBenchmark: 85,
        userScore: Math.min(84, baseScore - 6),
        description: `آشنایی با استانداردها، آیین‌نامه‌های فنی و الزامات رگولاتوری مرتبط با ${cleanTitle} در آلمان.`,
        germanContext: "رعایت انطباق کیفی و استانداردهای مدون صنعتی در آلمان از اصول اولیه هر شرکت است.",
        actionRecommendation: "مرور استانداردهای DIN و اروپایی مرتبط با رشته و ذکر آنها در بخش مهارت‌های رزومه."
      },
      {
        id: "documentation_reporting_de",
        name: "مستندسازی دقیق و گزارش‌نویسی فنی (Dokumentationspflicht)",
        nameEn: "Technical Documentation & Reporting Standards",
        germanBenchmark: 86,
        userScore: Math.min(86, baseScore - 2),
        description: "نگارش دقیق گزارش‌های دوره‌ای، تحلیل خطاها و فرآیندهای اجرایی به صورت کتبی و مستند.",
        germanContext: "مستندسازی دقیق سنگ بنای تضمین کیفیت و پاسخگویی سازمانی در فرهنگ کاری آلمان است.",
        actionRecommendation: "تهیه گزارش‌های مستند و ساختاریافته به زبان انگلیسی یا آلمانی در پورتفولیوی کاری."
      },
      {
        id: "agile_cross_functional",
        name: "همکاری تیمی و متدولوژی‌های چابک (Agile / Jira / Teamwork)",
        nameEn: "Agile Collaboration & Problem Solving",
        germanBenchmark: 82,
        userScore: Math.min(88, baseScore),
        description: "کار در محیط‌های بین‌المللی چندفرهنگی، حل سیستماتیک مسائل و سازگاری با سیستم‌های مدیریت تسک.",
        germanContext: "روحیه کار تیمی، احترام حرفه‌ای و سازمان‌یافتگی در ساختار شرکت‌های آلمانی ارزش کلیدی دارد.",
        actionRecommendation: "برجسته کردن سوابق همکاری موفق در پروژه‌های تیمی و متدهای اسکرام در مصاحبه."
      },
      {
        id: "fachdeutsch_specialized",
        name: `زبان آلمانی تخصصی حوزه ${cleanTitle} (Fachdeutsch)`,
        nameEn: "Domain-Specific Technical German (Fachdeutsch)",
        germanBenchmark: 80,
        userScore: germanLevel === "B2" || germanLevel === "C1" ? 80 : germanLevel === "B1" ? 64 : 45,
        description: `تسلط بر واژگان و اصطلاحات تخصصی ${cleanTitle} به زبان آلمانی جهت جلسات کاری و خواندن مستندات.`,
        germanContext: "توانایی درک مستندات فنی و ارتباط روان با همکاران درون شرکت در آلمان امتیاز حیاتی است.",
        actionRecommendation: "تدوین یک واژه‌نامه اختصاصی آلمانی از واژگان پرکاربرد حوزه تخصصی خود."
      }
    ],
    overallMatchSummary: {
      matchPercentage: Math.round(baseScore),
      topStrengths: [
        `تسلط بر مهارت‌ها و ابزارهای استخراج‌شده از رزومه (${topSkillStr})`,
        `سابقه کار مستند ${rawExp} ساله در حوزه تخصصی`,
        "توانایی تطبیق سریع با متدولوژی‌های کاری استاندارد"
      ],
      criticalGaps: [
        "آشنایی با استانداردها و آیین‌نامه‌های اجرایی و رگولاتوری آلمان",
        "تسلط به واژگان تخصصی آلمانی (Fachdeutsch)",
        "انطباق با چارچوب‌های مستندسازی به سبک شرکت‌های آلمانی"
      ],
      priorityCertificatesDe: [
        "گواهی‌نامه‌های بین‌المللی تخصصی ابزارهای کاری",
        "مدرک زبان آلمانی B1 / B2 گوته یا telc",
        "تاییدیه ارزشیابی تحصیلی ZAB (Statement of Comparability)"
      ],
      germanCvOptimizationTip: `در رزومه به سبک آلمانی (Lebenslauf)، تجربیات کار با ابزارهای ${primaryTool} را همراه با دستاوردهای کمی و ملموس در پروژه‌ها به صورت بالت‌پوینت‌های مبتنی بر نتیجه قید فرمایید.`
    }
  };
}
