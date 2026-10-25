/**
 * German Skills & Tools Benchmark Database & Intelligent Gap Analyzer
 * Aligned with the German Federal Employment Agency (Bundesagentur für Arbeit - KldB 2026),
 * German Industrial Norms (DIN, EN, ISO, VDI, VDE, Eurocodes), and DAX/Mittelstand hiring expectations.
 */

export interface GermanToolBenchmarkItem {
  id: string;
  name: string;
  aliases: string[];
  category: "software_tool" | "engineering_cad" | "cloud_devops" | "database" | "management" | "lab_instrument";
  categoryFa: string;
  importance: "must_have" | "high_impact" | "bonus";
  importanceLabelFa: string;
  germanMarketPrevalence: number; // percentage (e.g. 90%)
  germanUsageContext: string;
  recommendedSeniority: "Junior" | "Mid-Level" | "Senior" | "Lead";
  typicalInterviewPromptDe: string;
  bridgeRecommendationFa: string;
}

export interface GermanSkillBenchmarkItem {
  id: string;
  name: string;
  nameDe: string;
  aliases: string[];
  category: "architecture" | "methodology" | "quality_standards" | "compliance_security" | "process";
  categoryFa: string;
  benchmarkScore: number; // 0 - 100
  germanStandardRef?: string; // e.g. DIN ISO 9001, DSGVO, Eurocode 2, etc.
  descriptionFa: string;
  germanExpectation: string;
  riskIfNotMasteredFa: string;
  actionRecommendationFa: string;
}

export interface GermanJobBenchmarkStandard {
  id: string;
  titleFa: string;
  titleDe: string;
  kldbCode: string;
  categoryFa: string;
  keywords: string[];
  typicalSalaryRange: string;
  germanDemandLevel: string;
  tools: GermanToolBenchmarkItem[];
  skills: GermanSkillBenchmarkItem[];
  germanAtsKeywords: Array<{
    term: string;
    termDe: string;
    importance: "vital" | "recommended";
    explanationFa: string;
  }>;
  roadmap30_60_90: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
}

export interface GapAnalysisToolResult {
  tool: GermanToolBenchmarkItem;
  status: "matched" | "missing_critical" | "missing_differentiator";
  matchedKeyword?: string;
  candidateEvidence?: string;
  gapImpactLevel: "بحرانی" | "متوسط" | "مزیت رقابتی";
}

export interface GapAnalysisSkillResult {
  skill: GermanSkillBenchmarkItem;
  status: "matched" | "partial" | "gap";
  userEstimatedScore: number;
  benchmarkScore: number;
  gapDifference: number;
}

export interface StructuredGapAnalysisReport {
  timestamp: string;
  targetRoleFa: string;
  targetRoleDe: string;
  kldbCode: string;
  categoryFa: string;
  salaryRange: string;
  demandLevel: string;

  // Scores
  overallMatchScore: number; // 0 - 100
  toolsMatchScore: number;   // 0 - 100
  skillsMatchScore: number;  // 0 - 100
  germanStandardsScore: number; // 0 - 100
  readinessRatingFa: string;
  gapSeverity: "low_gap" | "medium_gap" | "critical_gap";

  // Extracted user profile items
  extractedTools: string[];
  extractedSkills: string[];
  candidateYearsOfExp: number;
  candidateSeniority: string;

  // Categorized Analysis
  toolsResults: GapAnalysisToolResult[];
  skillsResults: GapAnalysisSkillResult[];

  matchedToolsCount: number;
  missingCriticalToolsCount: number;
  missingDifferentiatorToolsCount: number;

  matchedSkillsCount: number;
  criticalSkillsGapCount: number;

  // Key Findings
  topStrengths: string[];
  criticalGapsSummary: string[];
  highImpactRecommendations: string[];

  // ATS & Keywords
  atsOptimizationKeywords: Array<{
    term: string;
    termDe: string;
    importance: "vital" | "recommended";
    explanationFa: string;
  }>;

  // Roadmap
  actionPlan: {
    day30: string[];
    day60: string[];
    day90: string[];
  };

  // German CV Optimization Tip
  cvOptimizationTip: string;
}

/**
 * Standard German Occupational Benchmarks Catalog
 */
export const GERMAN_OCCUPATIONAL_BENCHMARKS: GermanJobBenchmarkStandard[] = [
  // 1. Software Engineering & Full-Stack Development (KldB 43414)
  {
    id: "software_it",
    titleFa: "مهندسی نرم‌افزار، توسعه فول‌استک و رایانش ابری",
    titleDe: "Full Stack Softwareentwicklung & Cloud (m/w/d)",
    kldbCode: "KldB 43414 - Softwareentwicklung (Experte)",
    categoryFa: "فناوری اطلاعات و نرم‌افزار",
    keywords: ["software", "developer", "fullstack", "frontend", "backend", "web", "react", "node", "typescript", "برنامه", "نرم‌افزار", "فرانت", "بک‌اند"],
    typicalSalaryRange: "68,000 - 88,000 €",
    germanDemandLevel: "بسیار بالا (کمبود نیروی متخصص Mangelberuf)",
    tools: [
      {
        id: "typescript",
        name: "TypeScript",
        aliases: ["typescript", "ts"],
        category: "software_tool",
        categoryFa: "زبان‌های برنامه‌نویسی مدرن",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 94,
        germanUsageContext: "استاندارد پیش‌فرض بیش از ۹۰ درصد تیم‌های نرم‌افزاری برلین و مونیخ به دلیل سیستم Strict Typing و کاهش باگ‌های پروداکشن.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie konfigurieren Sie tsconfig für Monorepos und nutzen Generics sowie Conditional Types?",
        bridgeRecommendationFa: "انتقال پروژه‌های جاوااسکریپت به تایپ‌اسکریپت با فعال‌سازی strict mode در tsconfig.json."
      },
      {
        id: "react_next",
        name: "React & Next.js",
        aliases: ["react", "react.js", "next.js", "nextjs", "next"],
        category: "software_tool",
        categoryFa: "فریم‌ورک‌های رابط کاربری",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 92,
        germanUsageContext: "معماری ماژولار فرانت‌اند، Server-Side Rendering (SSR) و رعایت بهینه‌سازی بارگذاری طبق Core Web Vitals.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie implementieren Sie Server Components und optimieren das Re-Rendering in komplexen Dashboards?",
        bridgeRecommendationFa: "پیاده‌سازی یک داشبورد کامل در Next.js 14+ با App Router و مدیریت وضعیت با Zustand یا TanStack Query."
      },
      {
        id: "docker",
        name: "Docker & Containerization",
        aliases: ["docker", "dockerfile", "docker-compose", "container"],
        category: "cloud_devops",
        categoryFa: "زیرساخت و دواپس",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 90,
        germanUsageContext: "تضمین یکپارچگی محیط‌های توسعه و استقرار در کانتینرهای ایزوله و اجرای Multi-Stage Builds.",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Wie minimieren Sie die Image-Größe in Multi-Stage Dockerfiles für Produktions-Deployments?",
        bridgeRecommendationFa: "کانتینرسازی چندمرحله‌ای برای سرویس‌ها با ایمیج‌های Alpine و ایمن‌سازی متغیرهای محیطی."
      },
      {
        id: "git_cicd",
        name: "Git & CI/CD (GitHub Actions / GitLab CI)",
        aliases: ["git", "github", "gitlab", "ci/cd", "ci", "cd", "jenkins", "github actions"],
        category: "cloud_devops",
        categoryFa: "کنترل نسخه و پایپ‌لاین",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 96,
        germanUsageContext: "پایپ‌لاین‌های اعتبارسنجی خودکار تست‌ها، لینتر و بیلد پیش از مرج کدهای تیم در قالب استراتژی Trunk-based یا GitFlow.",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Wie strukturieren Sie Branch-Protection Rules und automatisierte Rollback-Pipelines?",
        bridgeRecommendationFa: "ایجاد فایل ورک‌فلو (.github/workflows/ci.yml) برای اجرای خودکار تست‌ها و لینت در گیت‌هاب."
      },
      {
        id: "postgresql_sql",
        name: "PostgreSQL & RDBMS",
        aliases: ["postgresql", "postgres", "sql", "mysql", "relational database"],
        category: "database",
        categoryFa: "پایگاه‌های داده رابطه‌ای",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 88,
        germanUsageContext: "طراحی اسکیمای نرمال‌شده، تراکنش‌های ACID، ایندکس‌گذاری بهینه و مدیریت مایگریشن‌ها.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie analysieren Sie langsame SQL-Queries mit EXPLAIN ANALYZE und beheben Deadlocks?",
        bridgeRecommendationFa: "تسلط بر ابزارهای Prisma/Drizzle ORM و بهینه‌سازی ایندکس‌ها با EXPLAIN ANALYZE."
      },
      {
        id: "cloud_aws_azure",
        name: "Cloud Platforms (AWS / GCP / Azure)",
        aliases: ["aws", "gcp", "azure", "cloud", "amazon web services", "cloud computing"],
        category: "cloud_devops",
        categoryFa: "رایانش ابری",
        importance: "high_impact",
        importanceLabelFa: "مزیت رقابتی جدی (Hohe Relevanz)",
        germanMarketPrevalence: 82,
        germanUsageContext: "استقرار در مناطق داده اروپایی (eu-central-1 Frankfurt) برای رعایت الزامات ذخیره‌سازی داده درون اتحادیه اروپا.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Welche AWS-Services nutzen Sie für DSGVO-konforme Datenspeicherung in der EU-Region Frankfurt?",
        bridgeRecommendationFa: "گذراندن دوره رسمی AWS Cloud Practitioner یا AWS Certified Solutions Architect Associate."
      },
      {
        id: "kubernetes",
        name: "Kubernetes (K8s)",
        aliases: ["kubernetes", "k8s", "helm", "k8s cluster"],
        category: "cloud_devops",
        categoryFa: "ارکستراسیون کانتینرها",
        importance: "high_impact",
        importanceLabelFa: "مزیت رقابتی جدی (Hohe Relevanz)",
        germanMarketPrevalence: 74,
        germanUsageContext: "مدیریت و مقیاس‌پذیری خودکار سرویس‌ها در سازمان‌های بزرگ آلمان (DAX و Mittelstand).",
        recommendedSeniority: "Senior",
        typicalInterviewPromptDe: "Wie konfigurieren Sie Pod-Autoscaling (HPA) und Ingress-Controller mit TLS-Terminierung?",
        bridgeRecommendationFa: "راه‌اندازی کلاستر محلی Minikube یا K3s و دیپلوی سرویس با مانیفست‌های استقرار و سرویس."
      },
      {
        id: "jira_confluence",
        name: "Jira & Confluence (Atlassian Suite)",
        aliases: ["jira", "confluence", "atlassian", "scrum tool"],
        category: "management",
        categoryFa: "مدیریت پروژه و مستندسازی",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 91,
        germanUsageContext: "ردیابی تسک‌های اسکرام، تعریف استوری‌پوینت، تعیین Acceptance Criteria و مستندسازی تصمیمات فنی (ADRs).",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Wie dokumentieren Sie Architekturentscheidungen (ADR) und Epics in Confluence?",
        bridgeRecommendationFa: "ذکر تجربه استفاده از جیرا و کانفلوئنس در مدیریت اسپرینت‌ها و تدوین داکیومنت در رزومه."
      }
    ],
    skills: [
      {
        id: "clean_architecture_testing",
        name: "معماری تمیز، الگوهای طراحی و تست خودکار (TDD/Jest/Playwright)",
        nameDe: "Clean Architecture, Entwurfsmuster & Testautomatisierung",
        aliases: ["clean architecture", "tdd", "testing", "jest", "unit test", "solid", "design patterns"],
        category: "architecture",
        categoryFa: "معماری و مهندسی نرم‌افزار",
        benchmarkScore: 88,
        descriptionFa: "پایبندی به اصول پنج‌گانه SOLID، جداسازی لایه‌های بیزینس لاجیک از فریم‌ورک و پوشش تست بالای ۸۰ درصد.",
        germanExpectation: "کارفرمایان آلمانی وسواس شدیدی بر قابلیت نگهداری بلندمدت (Wartbarkeit) و تست‌های خودکار دارند.",
        riskIfNotMasteredFa: "رد شدن در مصاحبه کد چلنج آلمان به دلیل عدم نوشتن Unit Test یا درهم‌تنیدگی کدهای بیزینس.",
        actionRecommendationFa: "افزودن تست‌های واحد Jest و تست‌های اند-تو-اند Playwright به تمام پروژه‌های پورتفولیو."
      },
      {
        id: "dsgvo_gdpr_security",
        name: "امنیت نرم‌افزار و انطباق با قوانین حریم خصوصی اروپا (EU-DSGVO / GDPR)",
        nameDe: "Datenschutz-Grundverordnung (DSGVO / GDPR) & IT-Sicherheit",
        aliases: ["dsgvo", "gdpr", "privacy", "security", "bdsg", "owasp"],
        category: "compliance_security",
        categoryFa: "امنیت و رگولاتوری اروپا",
        benchmarkScore: 85,
        germanStandardRef: "EU-DSGVO / BDSG / OWASP Top 10",
        descriptionFa: "رعایت اصل Privacy by Design، رمزنگاری اطلاعات حساس، مدیریت کوکی‌ها، لاگین بدون افشای PII و انطباق با مقررات امنیت داده آلمان.",
        germanExpectation: "جریمه‌های سنگین نقض قوانین DSGVO در آلمان باعث شده تیم‌های فنی به دانش داده‌ای حساسیت فوق‌العاده نشان دهند.",
        riskIfNotMasteredFa: "نقطه ضعف مشهود متقاضیان غیراروپایی در مصاحبه‌های ارشد؛ تلقی بی‌اطلاعی از استانداردهای قانونی آلمان.",
        actionRecommendationFa: "ذکر رعایت اصول GDPR و امنیت داده در خلاصه تجربیات پروژه‌های بک‌اند در رزومه."
      },
      {
        id: "agile_scrum_dach",
        name: "متدولوژی چابک اسکرام و فرهنگ کاری آلمان (Agile / Sprint Discipline)",
        nameDe: "Agile Entwicklung & Deutsche Feedbackkultur",
        aliases: ["agile", "scrum", "kanban", "sprint", "standup"],
        category: "methodology",
        categoryFa: "متدولوژی‌های کاری و فرهنگ تیمی",
        benchmarkScore: 84,
        descriptionFa: "پایبندی به Definition of Done (DoD)، تخمین دقیق زمان تسک‌ها و شرکت فعال در رترواسپکتیو با بیان بازخورد عینی و شفاف (Sachlichkeit).",
        germanExpectation: "فرهنگ کاری آلمان خواهان شفافیت در تعهد زمانی و عدم فرار از بیان موانع کاری است.",
        riskIfNotMasteredFa: "ناهماهنگی در دوره آزمایشی ۶ ماهه اول کار (Probezeit) و عدم تعامل تیمی چابک.",
        actionRecommendationFa: "تاکید بر سابقه کار در تیم‌های دوهفته‌ای اسکرام و جلسات پلنینگ در بخش تجارب شغلی."
      }
    ],
    germanAtsKeywords: [
      { term: "Full Stack Softwareentwickler", termDe: "Softwareentwickler/in", importance: "vital", explanationFa: "عنوان استاندارد جستجوی ریکروترهای آلمانی در پورتال‌های کاریابی" },
      { term: "TypeScript & Next.js", termDe: "Frontend-Architektur", importance: "vital", explanationFa: "تکنولوژی شاخص فرانت‌اند مورد تقاضا در بیش از ۸۵٪ آگهی‌ها" },
      { term: "CI/CD & Docker Containerisierung", termDe: "DevOps & Containerisierung", importance: "vital", explanationFa: "نشان‌دهنده استقلال توسعه‌دهنده در تحویل نرم‌افزار به پروداکشن" },
      { term: "DSGVO-Konformität (GDPR)", termDe: "Datenschutz-Grundverordnung", importance: "recommended", explanationFa: "مزیت رقابتی آشکار در فیلتر سیستم‌های غربالگری ATS آلمان" },
      { term: "Testgetriebene Entwicklung (TDD)", termDe: "TDD & Testautomatisierung", importance: "recommended", explanationFa: "اثبات مهندسی بودن روش توسعه و پایداری کدهای تولید شده" }
    ],
    roadmap30_60_90: {
      day30: [
        "پروژه‌های نمونه گیت‌هاب را به TypeScript کامل با strict mode بازنویسی کرده و ریپازیتوری را مرتب کنید.",
        "برای تمام کامپوننت‌ها و APIها تست‌های Jest و پوشش بالای ۷۵٪ ایجاد نمایید.",
        "فایل README انگلیسی و آلمانی فنی به همراه دیاگرام معماری به گیت‌هاب اضافه کنید."
      ],
      day60: [
        "یک کانتینر داکر بهینه‌سازی شده چندمرحله‌ای (Multi-stage) و پایپ‌لاین GitHub Actions راه‌اندازی کنید.",
        "مفاهیم امنیت داده‌های اروپا (DSGVO/GDPR) را در معماری احراز هویت و ذخیره دیتابیس پیاده‌سازی فرمایید.",
        "رزومه Lebenslauf خود را با کلیدواژه‌های تخصصی آلمانی و دستاوردهای عددی به‌روزرسانی کنید."
      ],
      day90: [
        "اصطلاحات تخصصی آلمانی (Fachdeutsch) برای جلسات کدریویو و سیستم‌دیزاین را تمرین کنید.",
        "در آزمون‌های آنلاین شبیه‌ساز مصاحبه فنی شرکت کرده و روی سناریوهای حل بحران پروداکشن مسلط شوید."
      ]
    }
  },

  // 2. Embedded Systems, Automotive & Mechatronics (KldB 26114 / 25104)
  {
    id: "embedded_automotive",
    titleFa: "مهندسی سیستم‌های نهفته، الکترونیک خودرو و مکاترونیک",
    titleDe: "Embedded Systems & Automotive Software (m/w/d)",
    kldbCode: "KldB 26114 - Mechatronik & Automatisierung (Experte)",
    categoryFa: "خودروسازی و سیستم‌های الکترونیکی",
    keywords: ["embedded", "automotive", "c++", "c", "autosar", "can", "ecu", "microcontroller", "نهفته", "میکروکنترلر", "خودرو", "مکاترونیک"],
    typicalSalaryRange: "72,000 - 95,000 €",
    germanDemandLevel: "بسیار بالا (صنعت اصلی آلمان - Automotive Cluster)",
    tools: [
      {
        id: "embedded_c_cpp",
        name: "Embedded C / Modern C++ (C++17/20)",
        aliases: ["c", "c++", "embedded c", "c++17", "c++20"],
        category: "software_tool",
        categoryFa: "زبان‌های سطح سخت‌افزار",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 98,
        germanUsageContext: "برنامه‌نویسی سیستم‌های بلادرنگ (RTOS)، کنترل‌کننده‌های موتور و یونیت‌های کنترل الکترونیکی خودرو (ECU).",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie vermeiden Sie Dynamic Memory Allocation in sicherheitskritischen Embedded C++ Systemen?",
        bridgeRecommendationFa: "پیاده‌سازی پروژه‌های سیستم بلادرنگ بدون تخصیص حافظه دینامیک با رعایت MISRA-C."
      },
      {
        id: "autosar",
        name: "AUTOSAR (Classic & Adaptive)",
        aliases: ["autosar", "autosar classic", "autosar adaptive", "arxml"],
        category: "software_tool",
        categoryFa: "معماری استاندارد خودرو",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 90,
        germanUsageContext: "استاندارد یکپارچه نرم‌افزارهای خودرو در غول‌های آلمانی (Bosch, Continental, BMW, Mercedes, VW).",
        recommendedSeniority: "Senior",
        typicalInterviewPromptDe: "Welche Unterschiede bestehen zwischen AUTOSAR Classic (RTE/BSW) und Adaptive (POSIX/SOA)?",
        bridgeRecommendationFa: "مطالعه دقیق لایه‌های BSW، RTE و SWC در استاندارد AUTOSAR و شبیه‌سازی پیکربندی آن."
      },
      {
        id: "can_lin_protocols",
        name: "CAN, LIN, FlexRay & Automotive Ethernet",
        aliases: ["can", "can bus", "can-fd", "lin", "flexray", "some/ip", "automotive ethernet"],
        category: "software_tool",
        categoryFa: "پروتکل‌های ارتباطی خودرو",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 95,
        germanUsageContext: "ارتباط میان سنسورها و ECUها در شبکه‌های درون‌خودرویی و دیباگ پکت‌های ترافیک شبکه.",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Wie funktioniert die Arbitrierung im CAN-Bus und was tun Sie bei Bus-Off Zuständen?",
        bridgeRecommendationFa: "تسلط بر آنالیز دیتای CAN با فایل‌های DBC و ابزارهای مانیتورینگ."
      },
      {
        id: "matlab_simulink",
        name: "MATLAB & Simulink (Model-Based Design)",
        aliases: ["matlab", "simulink", "model based design", "mbd", "stateflow"],
        category: "engineering_cad",
        categoryFa: "مدل‌سازی و شبیه‌سازی",
        importance: "high_impact",
        importanceLabelFa: "مزیت رقابتی جدی (Hohe Relevanz)",
        germanMarketPrevalence: 85,
        germanUsageContext: "توسعه مبتنی بر مدل (MBD)، تولید خودکار کد C (Embedded Coder) و شبیه‌سازی الگوریتم‌های دینامیک خودرو.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie führen Sie MIL-, SIL- und HIL-Validierungen Ihrer Simulink-Modelle durch?",
        bridgeRecommendationFa: "طراحی کنترل‌کننده حلقه بسته در سیمولینک و تولید کد بهینه C با Embedded Coder."
      },
      {
        id: "vector_tools",
        name: "Vector Tools (CANoe, CANalyzer)",
        aliases: ["vector", "canoe", "canalyzer", "capl", "vector tools"],
        category: "software_tool",
        categoryFa: "ابزارهای تست و اعتبارسنجی خودرو",
        importance: "high_impact",
        importanceLabelFa: "مزیت رقابتی جدی (Hohe Relevanz)",
        germanMarketPrevalence: 88,
        germanUsageContext: "ابزار پیش‌فرض صنعت آلمان برای شبیه‌سازی، دیباگ و تست خودکار پروتکل‌های خودرو با اسکریپت‌نویسی CAPL.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie haben Sie Test-Panels und Restbussimulationen in CANoe aufgebaut?",
        bridgeRecommendationFa: "یادگیری ساختار Restbussimulation و اسکریپت‌نویسی CAPL در محیط شبیه‌ساز CANoe."
      }
    ],
    skills: [
      {
        id: "iso26262_functional_safety",
        name: "ایمنی عملکردی خودرو (ISO 26262 & ASIL A-D)",
        nameDe: "Funktionale Sicherheit nach ISO 26262 (FuSa)",
        aliases: ["iso 26262", "functional safety", "asil", "fusa", "fmea", "fta"],
        category: "compliance_security",
        categoryFa: "استانداردهای بین‌المللی ایمنی",
        benchmarkScore: 92,
        germanStandardRef: "ISO 26262 / ASIL A-D / IEC 61508",
        descriptionFa: "تحلیل خطرات و ریسک‌ها (HARA)، تعیین سطوح ASIL، طراحی مکانیزم‌های تشخیص خطای ایمن (Fail-Safe) و محاسبه معیارهای قابلیت اطمینان سخت‌افزار.",
        germanExpectation: "در آلمان هرگونه توسعه نرم‌افزار خودرویی بدون رعایت دقیق استاندارد ISO 26262 غیرقانونی تلقی می‌شود.",
        riskIfNotMasteredFa: "رد شدن فوری در مرحله اول مصاحبه‌های فنی شرکت‌های تایر ۱ و خودروسازان آلمان.",
        actionRecommendationFa: "مرور مفاهیم HARA و ASIL Decomposition و ثبت مدارک مرتبط در رزومه."
      },
      {
        id: "misra_aspice",
        name: "استاندارد کدهای ایمن و بلوغ فرآیندی (MISRA-C & Automotive SPICE)",
        nameDe: "MISRA-C Richtlinien & ASPICE Level 2/3",
        aliases: ["misra", "misra-c", "misra c", "aspice", "automotive spice"],
        category: "quality_standards",
        categoryFa: "استانداردهای کدنویسی و فرآیند",
        benchmarkScore: 89,
        germanStandardRef: "MISRA C:2012 / Automotive SPICE PAM v3.1",
        descriptionFa: "رعایت قواعد کدنویسی غیرمخرب MISRA و ردیابی کامل نیازمندی‌ها از مهندسی سیستم تا تست در مدل ASPICE V-Model.",
        germanExpectation: "تضمین عاری بودن کد از خطاهای اشاره‌گرها و رفتارهای تعریف‌نشده (Undefined Behavior).",
        riskIfNotMasteredFa: "شکست در تحویل کدهای مرحله ارزیابی کد چلنج شرکت‌های آلمانی.",
        actionRecommendationFa: "اجرای Static Code Analysis بر اساس MISRA-C روی کدهای C پروژه نمونه با ابزارهای Cppcheck یا SonarQube."
      }
    ],
    germanAtsKeywords: [
      { term: "Embedded Softwareentwickler", termDe: "Embedded Systems Entwickler", importance: "vital", explanationFa: "کلیدواژه اصلی جستجوی شرکت‌های اشتوتگارت، مونیخ و وولفسبورگ" },
      { term: "AUTOSAR Classic & Adaptive", termDe: "AUTOSAR BSW/RTE", importance: "vital", explanationFa: "معیار طلایی ارزیابی مهندسان سیستم‌های الکترونیکی خودرو در آلمان" },
      { term: "ISO 26262 Funktionale Sicherheit", termDe: "ASIL D Konformität", importance: "vital", explanationFa: "تطابق با ضوابط قانونی تردد خودروهای جدید در اتحادیه اروپا" },
      { term: "CAN-Bus & Automotive Ethernet", termDe: "Bus-Kommunikation", importance: "recommended", explanationFa: "پروتکل‌های اصلی برقراری ارتباط در معماری خودروهای مدرن" }
    ],
    roadmap30_60_90: {
      day30: [
        "کدهای Embedded C پروژه‌های قبلی را با قوانین MISRA-C تطبیق داده و خطاهای استاتیک را رفع کنید.",
        "شبیه‌سازی ارتباطات CAN را با فایل‌های DBC و ابزارهای متن‌باز راه‌اندازی و مستند کنید."
      ],
      day60: [
        "مفاهیم لایه‌های AUTOSAR BSW/RTE را همراه با معماری ماژول‌ها در رزومه خود برجسته سازید.",
        "نمونه تحلیل ریسک HARA و تعیین ASIL بر مبنای استاندارد ISO 26262 را به عنوان کیس‌استادی مستند کنید."
      ],
      day90: [
        "پاسخ به سوالات فنی مصاحبه آلمانی پیرامون سناریوهای Fail-Safe و زمان‌بندی RTOS را تمرین نمایید."
      ]
    }
  },

  // 3. Civil, Structural & BIM Engineering (KldB 31104)
  {
    id: "civil_structural",
    titleFa: "مهندسی عمران، طراحی سازه و مدل‌سازی اطلاعات ساختمان (BIM)",
    titleDe: "Bauingenieurwesen & Tragwerksplanung (m/w/d)",
    kldbCode: "KldB 31104 - Bauingenieurwesen (Experte)",
    categoryFa: "مهندسی عمران و ساخت‌وساز",
    keywords: ["civil", "structural", "bim", "revit", "etabs", "autocad", "tekla", "sap2000", "عمران", "سازه", "ساختمان", "محاسب", "بتن", "فولاد"],
    typicalSalaryRange: "60,000 - 82,000 €",
    germanDemandLevel: "بسیار بالا (زیرساخت و کمبود شدید مهندس محاسب)",
    tools: [
      {
        id: "revit_bim",
        name: "Autodesk Revit & BIM Modeling",
        aliases: ["revit", "bim", "building information modeling", "navisworks"],
        category: "engineering_cad",
        categoryFa: "مدل‌سازی سه‌بعدی و BIM",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 92,
        germanUsageContext: "استاندارد الزامی پروژه‌های عمومی و شرکت‌های مهندسی مشاور آلمان برای هماهنگی مدل‌های چندرشته‌ای و کشف تداخلات (Clash Detection).",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie koordinieren Sie OpenBIM-Workflows über IFC-Schnittstellen und lösen Kollisionen?",
        bridgeRecommendationFa: "تسلط بر استانداردهای تبادل فایل OpenBIM (فرمت IFC) و هماهنگی مدل‌ها در Navisworks."
      },
      {
        id: "dlubal_rfem",
        name: "Dlubal RFEM / RSTAB (یا Sofistik)",
        aliases: ["dlubal", "rfem", "rstab", "sofistik", "frilo"],
        category: "engineering_cad",
        categoryFa: "نرم‌افزارهای محاسبات سازه آلمان",
        importance: "must_have",
        importanceLabelFa: "الزامی در آلمان (Standard in DE)",
        germanMarketPrevalence: 89,
        germanUsageContext: "نرم‌افزار بومی و پیش‌فرض دفاتر محاسبات سازه در آلمان، اتریش و سوئیس برای محاسبات المان محدود طبق یوروکد.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie modellieren Sie nichtlineare Platten- und Stabelemente nach Eurocode 2/3 in RFEM?",
        bridgeRecommendationFa: "دانلود نسخه آزمایشی Dlubal RFEM و مدل‌سازی سازه با ضرایب آیین‌نامه Eurocode."
      },
      {
        id: "etabs_sap2000",
        name: "ETABS & SAP2000",
        aliases: ["etabs", "sap2000", "csi", "safe"],
        category: "engineering_cad",
        categoryFa: "تحلیل و طراحی سازه",
        importance: "must_have",
        importanceLabelFa: "معتبر بین‌المللی",
        germanMarketPrevalence: 78,
        germanUsageContext: "تحلیل لرزه‌ای، تحلیل مودی و محاسبات ماتریسی اسکلت‌های بتنی و فولادی بلندمرتبه.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie berücksichtigen Sie Antwortspektren-Verfahren und P-Delta-Effekte bei der Erdbebenbemessung?",
        bridgeRecommendationFa: "تنظیم کدهای بارگذاری زلزله طبق Eurocode 8 در نرم‌افزار ETABS و مستندسازی دفترچه محاسبات."
      },
      {
        id: "autocad",
        name: "AutoCAD & Allplan",
        aliases: ["autocad", "allplan", "nemetschek"],
        category: "engineering_cad",
        categoryFa: "ترسیمات اجرایی و نقشه‌کشی",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 94,
        germanUsageContext: "تهیه نقشه‌های فاز ۲ اجرایی، جزئیات آرماتوربندی (Bewehrungspläne) و نقشه‌های شاپ فولادی.",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Wie erstellen Sie normgerechte Schal- und Bewehrungspläne nach DIN EN 1992-1-1?",
        bridgeRecommendationFa: "ترسیم نقشه‌های نمونه با لایه‌بندی و فونت استاندارد مهندسی آلمان."
      }
    ],
    skills: [
      {
        id: "eurocodes_de",
        name: "آیین‌نامه‌های سازه‌ای اروپا و آلمان (Eurocodes 0-8 & DIN EN)",
        nameDe: "Eurocodes (DIN EN 1990 bis 1998) & Nationale Anhänge (NA)",
        aliases: ["eurocode", "eurocodes", "din en", "din 1045", "din 18800"],
        category: "quality_standards",
        categoryFa: "استانداردها و آیین‌نامه‌های محاسباتی",
        benchmarkScore: 94,
        germanStandardRef: "Eurocode 1 (Lasten), EC 2 (Beton), EC 3 (Stahl), EC 7 (Geotechnik)",
        descriptionFa: "ترکیب بارگذاری حالات حدی نهایی (ULS) و بهره‌برداری (SLS)، خزش، جمع‌شدگی بتن و پیوست ملی آلمان (Nationaler Anhang - NA).",
        germanExpectation: "دفاتر مهندسی آلمان بدون تسلط بر یوروکد امکان امضای محاسبات را به مهندس نمی‌دهند.",
        riskIfNotMasteredFa: "رد شدن در مصاحبه تخصصی Prüfingenieur و عدم توانایی در آزمون ارزیابی صلاحیت مهندسی.",
        actionRecommendationFa: "ذکر تجارب محاسباتی مبتنی بر Eurocode 2 و Eurocode 3 در پروژه‌های رزومه."
      },
      {
        id: "hoai_phases",
        name: "فرآیند فازهای ساخت و ساز در آلمان (HOAI Leistungsphasen 1-9)",
        nameDe: "HOAI Leistungsphasen (LPH 1 bis 9)",
        aliases: ["hoai", "leistungsphasen", "lph", "lph 1-9"],
        category: "process",
        categoryFa: "نظام اجرایی و فازهای پروژه در آلمان",
        benchmarkScore: 82,
        germanStandardRef: "HOAI (Honorarordnung für Architekten und Ingenieure)",
        descriptionFa: "تفکیک شفاف مسئولیت‌ها از طراحی اولیه (Entwurfsplanung - LPH 3)، اخذ مجوز ساخت (Genehmigungsplanung - LPH 4) تا نظارت کارگاهی (Bauüberwachung - LPH 8).",
        germanExpectation: "درک جایگاه وظایف شغلی در ساختار نظام مهندسی و اداری آلمان.",
        riskIfNotMasteredFa: "ابهام کارفرما در مورد توانایی متقاضی برای هماهنگی با مهندسان ناظر و مراجع شهرداری آلمان.",
        actionRecommendationFa: "ذکر فازهای معادل HOAI (به‌ویژه LPH 3, 4, 5) در شرح سوابق شغلی رزومه."
      }
    ],
    germanAtsKeywords: [
      { term: "Bauingenieur / Tragwerksplaner", termDe: "Tragwerksplanung", importance: "vital", explanationFa: "عنوان محوری مهندس محاسب سازه در پورتال‌های استخدامی آلمان" },
      { term: "Eurocode Bemessung (DIN EN)", termDe: "Eurocode 2 & 3", importance: "vital", explanationFa: "اثبات تسلط بر استانداردهای رسمی طراحی سازه‌های بتنی و فولادی اروپا" },
      { term: "BIM-Modellierung & Revit", termDe: "BIM-Koordinator / Revit", importance: "vital", explanationFa: "پیشنیاز استخدام در شرکت‌های پیشرو و پروژه‌های مدرن ساخت‌وساز آلمان" },
      { term: "Statische Berechnung", termDe: "Standsicherheitsnachweis", importance: "recommended", explanationFa: "تهیه دفترچه محاسبات فنی و ارائه تاییدیه ایستایی سازه" }
    ],
    roadmap30_60_90: {
      day30: [
        "پیوست‌های ملی آلمان برای Eurocode 2 (بتن) و Eurocode 3 (فولاد) را مطالعه و تطبیق فرمایید.",
        "یک مدل نمونه سازه در Revit همراه با استخراج شیت‌های اجرایی استاندارد DIN تهیه نمایید."
      ],
      day60: [
        "نرم‌افزار Dlubal RFEM را بررسی کرده و تفاوت‌های گردش کار آن با ETABS را یادداشت نمایید.",
        "اصطلاحات آلمانی نقشه‌کشی (Bewehrungsplan, Schalplan, Achsen) را به پورتفولیو اضافه کنید."
      ],
      day90: [
        "سناریوهای پاسخگویی به مهندس کنترل مضاعف (Prüfingenieur) را برای مصاحبه فنی تمرین نمایید."
      ]
    }
  },

  // 4. Mechanical, Mechatronics & CAD/CAM Engineering (KldB 25104)
  {
    id: "mechanical_cad",
    titleFa: "مهندسی مکانیک، طراحی جامدات، ساخت و تولید و CAD/CAM",
    titleDe: "Maschinenbau & Konstruktionstechnik (m/w/d)",
    kldbCode: "KldB 25104 - Maschinen- und Fahrzeugbau (Experte)",
    categoryFa: "مهندسی مکانیک و ساخت و تولید",
    keywords: ["mechanical", "solidworks", "catia", "ansys", "cad", "cam", "fea", "cfd", "مکانیک", "طراحی", "سالیدورک", "کتیا", "انسیس", "ساخت"],
    typicalSalaryRange: "64,000 - 86,000 €",
    germanDemandLevel: "بسیار بالا (قلب تپنده صنایع میتل‌اشتاند آلمان)",
    tools: [
      {
        id: "solidworks",
        name: "SolidWorks",
        aliases: ["solidworks", "solid works"],
        category: "engineering_cad",
        categoryFa: "نرم‌افزار مدل‌سازی سه‌بعدی",
        importance: "must_have",
        importanceLabelFa: "الزامی در صنایع میانی",
        germanMarketPrevalence: 88,
        germanUsageContext: "طراحی ماشین‌آلات صنعتی، قطعات ورق‌کاری (Sheet Metal) و مجموعه‌های مونتاژی در شرکت‌های Mittelstand.",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Wie strukturieren Sie Baugruppen mit über 1.000 Teilen, um die Ladezeiten und Referenzen stabil zu halten?",
        bridgeRecommendationFa: "طراحی اسمبلی‌های با قطعات بالا با استفاده از قطعات استاندارد DIN در سالیدورکز."
      },
      {
        id: "catia_v5",
        name: "CATIA V5 / 3DEXPERIENCE (یا Siemens NX)",
        aliases: ["catia", "catia v5", "3dexperience", "siemens nx", "nx"],
        category: "engineering_cad",
        categoryFa: "نرم‌افزارهای رده‌بالای مهندسی",
        importance: "must_have",
        importanceLabelFa: "الزامی در صنایع خودرو و هوافضا",
        germanMarketPrevalence: 91,
        germanUsageContext: "طراحی سطوح پیچیده (Surfacing) و قطعات بدنه در غول‌های صنعتی آلمان مانند ایرباس، بی ام و و پورشه.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie handhaben Sie Class-A Flächenmodellierung und parametrische Skelett-Modelle?",
        bridgeRecommendationFa: "مدل‌سازی قطعات با سطوح پیشرفته Class-A و ذکر تجارب در رزومه آلمانی."
      },
      {
        id: "ansys_fea",
        name: "ANSYS (FEA / CFD Simulation)",
        aliases: ["ansys", "ansys workbench", "fea", "cfd", "abaqus"],
        category: "engineering_cad",
        categoryFa: "شبیه‌سازی و تحلیل المان محدود",
        importance: "high_impact",
        importanceLabelFa: "مزیت رقابتی جدی (Hohe Relevanz)",
        germanMarketPrevalence: 84,
        germanUsageContext: "تحلیل تنش، خستگی، ارتعاشات و مکانیک سیالات محاسباتی برای بهینه‌سازی وزن و ایمنی قطعات صنعتی.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie verifizieren Sie Netzunabhängigkeit (Mesh Convergence) bei nichtlinearen Kontaktanalysen?",
        bridgeRecommendationFa: "ارائه خروجی‌های معتبر همگرایی مش و ضریب اطمینان در پورتفولیوی پروژه‌ها."
      }
    ],
    skills: [
      {
        id: "gdt_tolerances_din",
        name: "تلرانس‌های ابعادی و هندسی (GD&T طبق DIN ISO 1101)",
        nameDe: "Form- und Lagetoleranzen (DIN EN ISO 1101)",
        aliases: ["gd&t", "gdt", "tolerancing", "din iso 1101", "iso 2768"],
        category: "quality_standards",
        categoryFa: "استانداردهای ابعادی و نقشه‌کشی ساخت",
        benchmarkScore: 92,
        germanStandardRef: "DIN EN ISO 1101 / DIN ISO 2768",
        descriptionFa: "تعریف سطوح مبنا (Datum)، تلرانس‌های فرم، راستا، مکان و لنگی، زنجیره تلرانسی (Tolerance Stack-up) جهت مونتاژ بدون نقص.",
        germanExpectation: "مهندسان سازنده آلمانی با وسواس میکرونی نقشه‌ها را بررسی می‌کنند؛ هرگونه تلرانس نامشخص نشانه ضعف مهندسی است.",
        riskIfNotMasteredFa: "مردود شدن قطعی در مصاحبه بررسی نمونه‌کارهای طراحی قطعه.",
        actionRecommendationFa: "پیاده‌سازی دقیق علائم GD&T و جدول تلرانس‌های عمومی در نقشه‌های اجرایی پورتفولیو."
      },
      {
        id: "fmea_machinery_directive",
        name: "تحلیل حالات و اثرات خطا و استاندارد ماشین‌آلات (FMEA & CE Richtlinie)",
        nameDe: "FMEA Methodik & CE-Maschinenrichtlinie (2006/42/EG)",
        aliases: ["fmea", "ce", "maschinenrichtlinie", "ce marking"],
        category: "compliance_security",
        categoryFa: "ایمنی ماشین‌آلات و مدیریت ریسک",
        benchmarkScore: 86,
        germanStandardRef: "Maschinenrichtlinie 2006/42/EG / VDA-AIAG FMEA",
        descriptionFa: "شناسایی حالات خرابی بالقوه، ارزیابی RPN و اقدامات اصلاحی پیشگیرانه در طراحی تجهیزات صنعتی به همراه الزامات نشان CE.",
        germanExpectation: "حفاظت از ایمنی اپراتور و پایبندی به قوانین فدرال ایمنی کار در آلمان (BetrSichV).",
        riskIfNotMasteredFa: "ناتوانی در تحویل پروژه‌های ساخت صنعتی منطبق بر استانداردهای اتحادیه اروپا.",
        actionRecommendationFa: "اشاره به سابقه نگارش Design FMEA و مستندسازی دفترچه راهنمای فنی در رزومه."
      }
    ],
    germanAtsKeywords: [
      { term: "Konstrukteur / Maschinenbauingenieur", termDe: "Konstruktionstechnik", importance: "vital", explanationFa: "عنوان شغلی رسمی طراح مکانیک در طبقه‌بندی KldB آلمان" },
      { term: "CAD-Konstruktion (CATIA / SolidWorks)", termDe: "3D-CAD-Modellierung", importance: "vital", explanationFa: "اصلی‌ترین فیلتر جستجوی شرکت‌های صنعتی اشتوتگارت و بایرن" },
      { term: "Form- und Lagetoleranzen (DIN ISO)", termDe: "DIN EN ISO 1101", importance: "recommended", explanationFa: "نشان‌دهنده تسلط بر کیفیت نقشه‌کشی صنعتی بدون عیب" },
      { term: "FEA-Simulation & Spannungsanalyse", termDe: "Finite-Elemente-Methode", importance: "recommended", explanationFa: "تحلیل مقاومت مصالح و تایید استحکام مکانیکی قطعات" }
    ],
    roadmap30_60_90: {
      day30: [
        "یک نقشه فنی کامل با رعایت تمام علائم GD&T طبق DIN ISO 1101 طراحی و ذخیره فرمایید.",
        "قطعات استاندارد صنعتی آلمان (نظیر پیچ‌های DIN 912، خارهای DIN 471) را وارد اسمبلی‌ها کنید."
      ],
      day60: [
        "تحلیل تنش و خستگی در نرم‌افزار المان محدود را همراه با مستندات اعتبارسنجی مش مدون نمایید.",
        "اصطلاحات آلمانی مکانیک (Passung, Werkstoff, Schweißnaht) را برای دفاع در مصاحبه تمرین کنید."
      ],
      day90: [
        "پورتفولیوی تصویری پی‌دی‌اف از پروژه‌های ساخت و تولید به سبک کارفرمایان Mittelstand تدوین کنید."
      ]
    }
  },

  // 5. Electrical Engineering & Industrial Automation / PLC (KldB 26214)
  {
    id: "electrical_automation",
    titleFa: "مهندسی برق، اتوماسیون صنعتی و برنامه‌نویسی PLC",
    titleDe: "Elektrotechnik & Automatisierungstechnik (m/w/d)",
    kldbCode: "KldB 26214 - Elektrotechnik (Experte)",
    categoryFa: "مهندسی برق و اتوماسیون",
    keywords: ["electrical", "plc", "tia portal", "siemens", "eplan", "scada", "automation", "برق", "اتوماسیون", "پی ال سی", "زیمنس", "ایپلن"],
    typicalSalaryRange: "65,000 - 87,000 €",
    germanDemandLevel: "بسیار بالا (صنایع پیشرفته اتوماسیون و اینداستری ۴.۰)",
    tools: [
      {
        id: "siemens_tia_portal",
        name: "Siemens TIA Portal (S7-1200 / S7-1500)",
        aliases: ["tia portal", "siemens plc", "s7-1200", "s7-1500", "step 7", "simatic"],
        category: "software_tool",
        categoryFa: "برنامه‌نویسی کنترل‌کننده‌های صنعتی",
        importance: "must_have",
        importanceLabelFa: "الزامی قطعی (Standard in DE)",
        germanMarketPrevalence: 96,
        germanUsageContext: "رهبر بلامنازع اتوماسیون صنعتی در آلمان و اروپا با زبان‌های برنامه‌نویسی استاندارد IEC 61131-3 (SCL, FBD, LAD).",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie strukturieren Sie SCL-Code mit Function Blocks (FB) und optimieren Zykluszeiten im TIA Portal?",
        bridgeRecommendationFa: "برنامه‌نویسی پیشرفته با Structured Control Language (SCL) و تست با PLCSIM در محیط TIA Portal."
      },
      {
        id: "eplan_electric",
        name: "EPLAN Electric P8",
        aliases: ["eplan", "eplan electric", "eplan p8", "schaltplan"],
        category: "engineering_cad",
        categoryFa: "طراحی نقشه‌های الکتریکی و تابلوسازی",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 93,
        germanUsageContext: "نرم‌افزار انحصاری طراحی دیاگرام‌های الکتریکی، چیدمان قطعات تابلوی برق (Schaltschrankbau) و گزارش‌های سیم‌کشی در آلمان.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie handhaben Sie Makros, Klemmenpläne und Artikeldatenbanken nach DIN EN 81346 in EPLAN?",
        bridgeRecommendationFa: "طراحی یک مدار کامل قدرت و فرمان تابلو برق با شماره‌گذاری استاندارد تجهیزات در EPLAN."
      },
      {
        id: "scada_wincc",
        name: "SCADA & HMI (WinCC, Ignition)",
        aliases: ["scada", "wincc", "hmi", "factorytalk", "proface"],
        category: "software_tool",
        categoryFa: "سیستم‌های مانیتورینگ و مانیتور HMI",
        importance: "high_impact",
        importanceLabelFa: "مزیت رقابتی جدی",
        germanMarketPrevalence: 86,
        germanUsageContext: "طراحی صفحات اپراتوری مانیتورینگ، آلارم‌گذاری، سیستم‌های آرشیو داده‌های پروسه و ارتباط از طریق OPC UA.",
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: "Wie implementieren Sie OPC UA-Schnittstellen für die Industrie 4.0 Anbindung an MES-Systeme?",
        bridgeRecommendationFa: "پیاده‌سازی ارتباط صنعتی امن بین کنترل‌کننده و سیستم مانیتورینگ از طریق پروتکل OPC UA."
      }
    ],
    skills: [
      {
        id: "din_vde_standards",
        name: "استانداردهای ایمنی برق و تابلو (DIN VDE 0100 & DIN EN 60204-1)",
        nameDe: "VDE-Normen (DIN VDE 0100) & Maschinensicherheit (EN 60204-1)",
        aliases: ["vde", "din vde", "en 60204", "din vde 0100", "vde 0113"],
        category: "compliance_security",
        categoryFa: "استانداردهای فدرال مهندسی برق آلمان",
        benchmarkScore: 95,
        germanStandardRef: "DIN VDE 0100 (Errichten von Niederspannungsanlagen) / DIN EN 60204-1",
        descriptionFa: "سیستم‌های حفاظت زمین (TN-S/TN-C)، قطع اضطراری، حفاظت اضافه جریان، محاسبات اتصال کوتاه و ایمنی تجهیزات برقی ماشین‌آلات.",
        germanExpectation: "تکنسین‌ها و مهندسان در آلمان موظف به رعایت بی‌قید و شرط پروتکل‌های انجمن مهندسان برق آلمان (VDE) هستند.",
        riskIfNotMasteredFa: "رد شدن فوری متقاضی به دلیل عدم آگاهی از خطرات ولتاژ و الزامات تست بازرسی اولیه تابلو (Erstprüfung).",
        actionRecommendationFa: "مطالعه دقیق الزامات DIN EN 60204-1 و درج عنوان بازرسی‌های ایمنی در رزومه."
      },
      {
        id: "safety_integrated_sil",
        name: "سیستم‌های ایمنی در اتوماسیون (Safety Integrated & Performance Level)",
        nameDe: "Safety Integrated & Funktionale Sicherheit (ISO 13849-1)",
        aliases: ["safety plc", "fail-safe", "sil", "performance level", "iso 13849", "pl r"],
        category: "quality_standards",
        categoryFa: "ایمنی پرسنل و ماشین‌آلات صنعتی",
        benchmarkScore: 90,
        germanStandardRef: "DIN EN ISO 13849-1 / IEC 62061 (Safety PL e)",
        descriptionFa: "برنامه‌نویسی کارت‌های ایمنی زیمنس (Fail-Safe F-CPU)، دوکاناله بودن مدارات فرمان، پرده‌های نوری، مدارات توقف ایمن و ارزیابی با نرم‌افزار SISTEMA.",
        germanExpectation: "خط تولید بدون تاییدیه سیستم‌های ایمنی عملکردی در آلمان مجاز به راه‌اندازی نیست.",
        riskIfNotMasteredFa: "نقص اساسی در اجرای پروژه‌های خطوط اتوماسیون صنعتی کارخانجات آلمان.",
        actionRecommendationFa: "محاسبه یک مدار ایمنی استپ اضطراری در نرم‌افزار رایگان SISTEMA و پیوست به مستندات."
      }
    ],
    germanAtsKeywords: [
      { term: "Automatisierungsingenieur / SPS-Programmierer", termDe: "SPS-Softwareentwickler", importance: "vital", explanationFa: "عنوان اختصاصی استخدام برنامه‌نویس پی‌ال‌سی در آلمان" },
      { term: "Siemens TIA Portal & SCL", termDe: "SIMATIC S7-1500 / TIA", importance: "vital", explanationFa: "محبوب‌ترین کلیدواژه جستجوی کارفرمایان خطوط صنعتی و خودروسازی" },
      { term: "EPLAN Electric P8 Schaltpläne", termDe: "EPLAN P8 Konstrukteur", importance: "vital", explanationFa: "اثبات توانایی خواندن و ترسیم مدارات تابلوی برق استاندارد" },
      { term: "VDE-Prüfung & Maschinensicherheit", termDe: "DIN EN 60204-1", importance: "recommended", explanationFa: "تطابق با آیین‌نامه‌های رسمی ایمنی کار و برق در آلمان" }
    ],
    roadmap30_60_90: {
      day30: [
        "پروژه‌های قبلی پی‌ال‌سی را به زبان ساختاریافته SCL بر پایه استاندارد IEC 61131-3 پیاده‌سازی نمایید.",
        "مدارات نمونه رله‌های حفاظتی و اتصالات تابلویی را در EPLAN ترسیم و شیت‌بندی کنید."
      ],
      day60: [
        "نحوه راه‌اندازی ارتباط صنعتی در بستر Profinet و Profisafe را در مستندات کاری خود قید فرمایید.",
        "اصطلاحات آلمانی تابلو برق (Schaltschrank, Klemmenleiste, Schütz) را برای مصاحبه فنی مرور کنید."
      ],
      day90: [
        "برای آزمون‌های حل خطای سیستم‌های صنعتی زیمنس در مصاحبه‌های استخدامی حضوری آماده شوید."
      ]
    }
  }
];

/**
 * Intelligent Gap Analyzer Function
 * Compares candidate's skills and tools against German standards for their field.
 */
export function analyzeResumeSkillsAndToolsAgainstGermanStandards(
  userSkillsList: string[],
  rawResumeText: string,
  targetRole: string,
  experienceYears: number = 3,
  germanLevel: string = "B1"
): StructuredGapAnalysisReport {
  const combinedText = `${targetRole || ""} ${rawResumeText || ""} ${userSkillsList.join(" ")}`.toLowerCase();

  // 1. Detect matching standard or build dynamic synthesizer
  let matchedStandard = GERMAN_OCCUPATIONAL_BENCHMARKS.find(std => {
    return std.keywords.some(kw => combinedText.includes(kw.toLowerCase()));
  });

  // If no predefined catalog matches, generate a dynamic robust benchmark
  if (!matchedStandard) {
    matchedStandard = generateDynamicGermanStandard(targetRole, userSkillsList, combinedText);
  }

  // 2. Classify Candidate's Input into Tools vs. Skills
  const candidateLowerSkills = userSkillsList.map(s => s.toLowerCase());
  const extractedTools: string[] = [];
  const extractedSkills: string[] = [];

  // Categorize tools
  const toolsResults: GapAnalysisToolResult[] = matchedStandard.tools.map(tool => {
    const isMatched = tool.aliases.some(alias => {
      const a = alias.toLowerCase();
      return candidateLowerSkills.some(cs => cs.includes(a) || a.includes(cs)) || combinedText.includes(a);
    });

    if (isMatched) {
      extractedTools.push(tool.name);
      return {
        tool,
        status: "matched",
        matchedKeyword: tool.name,
        candidateEvidence: `احراز تسلط بر ${tool.name} در محتوای رزومه متقاضی`,
        gapImpactLevel: "مزیت رقابتی"
      };
    } else if (tool.importance === "must_have") {
      return {
        tool,
        status: "missing_critical",
        gapImpactLevel: "بحرانی"
      };
    } else {
      return {
        tool,
        status: "missing_differentiator",
        gapImpactLevel: "متوسط"
      };
    }
  });

  // Categorize skills
  const skillsResults: GapAnalysisSkillResult[] = matchedStandard.skills.map(skill => {
    const isMatched = skill.aliases.some(alias => {
      const a = alias.toLowerCase();
      return candidateLowerSkills.some(cs => cs.includes(a) || a.includes(cs)) || combinedText.includes(a);
    });

    let userScore = isMatched ? Math.min(95, 65 + (experienceYears * 4)) : Math.max(30, 45 + (experienceYears * 2));
    if (skill.category === "compliance_security" && !combinedText.includes("dsgvo") && !combinedText.includes("din") && !combinedText.includes("iso")) {
      userScore = Math.min(userScore, 50); // non-EU candidates typically lack formal German compliance
    }

    const gapDiff = skill.benchmarkScore - userScore;
    let status: "matched" | "partial" | "gap" = "gap";
    if (gapDiff <= 5) status = "matched";
    else if (gapDiff <= 18) status = "partial";

    if (isMatched) {
      extractedSkills.push(skill.name);
    }

    return {
      skill,
      status,
      userEstimatedScore: userScore,
      benchmarkScore: skill.benchmarkScore,
      gapDifference: Math.max(0, gapDiff)
    };
  });

  // 3. Calculate Accurate Weighted Scores
  const matchedToolsCount = toolsResults.filter(t => t.status === "matched").length;
  const missingCriticalToolsCount = toolsResults.filter(t => t.status === "missing_critical").length;
  const missingDifferentiatorToolsCount = toolsResults.filter(t => t.status === "missing_differentiator").length;

  const totalTools = toolsResults.length || 1;
  const toolsMatchScore = Math.round((matchedToolsCount / totalTools) * 100);

  const avgSkillScore = skillsResults.reduce((acc, s) => acc + s.userEstimatedScore, 0) / (skillsResults.length || 1);
  const skillsMatchScore = Math.round(avgSkillScore);

  // German standards score (DIN/ISO/compliance)
  const complianceSkill = skillsResults.find(s => s.skill.category === "compliance_security" || s.skill.category === "quality_standards");
  const germanStandardsScore = complianceSkill ? complianceSkill.userEstimatedScore : Math.round(avgSkillScore * 0.85);

  const overallMatchScore = Math.round((toolsMatchScore * 0.45) + (skillsMatchScore * 0.40) + (germanStandardsScore * 0.15));

  // Determine readiness rating & severity
  let readinessRatingFa = "آمادگی بالا برای ورود به بازار کار آلمان";
  let gapSeverity: "low_gap" | "medium_gap" | "critical_gap" = "low_gap";

  if (overallMatchScore < 60 || missingCriticalToolsCount >= 2) {
    readinessRatingFa = "شکاف‌های مهارتی بحرانی (نیازمند تکمیل رزومه و ابزارهای الزامی)";
    gapSeverity = "critical_gap";
  } else if (overallMatchScore < 78 || missingCriticalToolsCount === 1) {
    readinessRatingFa = "آمادگی متوسط (نیازمند تقویت ابزارهای استاندارد آلمان و مستندسازی)";
    gapSeverity = "medium_gap";
  }

  // Determine candidate seniority
  let candidateSeniority = "Junior";
  if (experienceYears >= 6) candidateSeniority = "Senior / Lead";
  else if (experienceYears >= 3) candidateSeniority = "Mid-Level";

  // Summaries
  const topStrengths: string[] = [];
  toolsResults.filter(t => t.status === "matched").forEach(t => {
    topStrengths.push(`تسلط بر نرم‌افزار/ابزار محوری: ${t.tool.name} (${t.tool.categoryFa})`);
  });
  if (experienceYears >= 3) {
    topStrengths.push(`سابقه کار حرفه‌ای ${experienceYears} ساله منطبق با سطح ${candidateSeniority} بازار کار آلمان`);
  }

  const criticalGapsSummary: string[] = [];
  toolsResults.filter(t => t.status === "missing_critical").forEach(t => {
    criticalGapsSummary.push(`غیبت ابزار الزامی کارفرمایان آلمانی: «${t.tool.name}» (پوشش بازار: ${t.tool.germanMarketPrevalence}٪)`);
  });
  skillsResults.filter(s => s.status === "gap").forEach(s => {
    criticalGapsSummary.push(`شکاف تسلط بر آیین‌نامه‌ها یا متدولوژی: «${s.skill.name}» (کسری ${s.gapDifference} نمره نسبت به بنچ‌مارک آلمان)`);
  });

  const highImpactRecommendations: string[] = [
    `ابزارهای الزامی شناسایی‌شده (${toolsResults.filter(t => t.status === "missing_critical").map(t => t.tool.name).slice(0, 2).join(" و ") || "استاندارد"}) را فوراً به بخش مهارت‌های رزومه به همراه دستاورد ملموس اضافه کنید.`,
    `کلمات کلیدی رسمی طبقه‌بندی آلمان (${matchedStandard.kldbCode}) را در هدلاین رزومه Lebenslauf خود بگنجانید.`,
    `در مصاحبه‌ها به رعایت استانداردهای کیفیت و مستندسازی (Dokumentationspflicht) به سبک شرکت‌های آلمانی اشاره کنید.`
  ];

  return {
    timestamp: new Date().toLocaleDateString("fa-IR") + " - " + new Date().toLocaleTimeString("fa-IR"),
    targetRoleFa: matchedStandard.titleFa,
    targetRoleDe: matchedStandard.titleDe,
    kldbCode: matchedStandard.kldbCode,
    categoryFa: matchedStandard.categoryFa,
    salaryRange: matchedStandard.typicalSalaryRange,
    demandLevel: matchedStandard.germanDemandLevel,

    overallMatchScore,
    toolsMatchScore,
    skillsMatchScore,
    germanStandardsScore,
    readinessRatingFa,
    gapSeverity,

    extractedTools: Array.from(new Set(extractedTools)),
    extractedSkills: Array.from(new Set(extractedSkills)),
    candidateYearsOfExp: experienceYears,
    candidateSeniority,

    toolsResults,
    skillsResults,

    matchedToolsCount,
    missingCriticalToolsCount,
    missingDifferentiatorToolsCount,

    matchedSkillsCount: skillsResults.filter(s => s.status === "matched").length,
    criticalSkillsGapCount: skillsResults.filter(s => s.status === "gap").length,

    topStrengths: topStrengths.slice(0, 5),
    criticalGapsSummary: criticalGapsSummary.slice(0, 5),
    highImpactRecommendations,

    atsOptimizationKeywords: matchedStandard.germanAtsKeywords,
    actionPlan: matchedStandard.roadmap30_60_90,
    cvOptimizationTip: `در بخش سوابق شغلی رزومه آلمانی (Lebenslauf)، برای هر کدام از ابزارهای ${matchedStandard.tools.slice(0, 2).map(t => t.name).join(" و ")}، یک نمونه عملکرد عددی و پروژه‌ای ذکر نمایید تا سیستم‌های ترکینگ کارفرمایان فدرال امتیاز کامل به شما اختصاص دهند.`
  };
}

/**
 * Helper to dynamically generate benchmark for any custom profession
 */
function generateDynamicGermanStandard(
  rawRole: string,
  userSkills: string[],
  combinedText: string
): GermanJobBenchmarkStandard {
  const roleClean = rawRole || "متخصص فنی و مهندسی";
  const primaryTool = userSkills[0] || "ابزار تخصصی رشته";
  const secondaryTool = userSkills[1] || "سیستم‌های مدل‌سازی و مدیریت";

  return {
    id: "dynamic_custom",
    titleFa: `متخصص ${roleClean} (انطباق سفارشی با استاندارد آلمان)`,
    titleDe: `Spezialist/in für ${roleClean} (KldB Standard)`,
    kldbCode: "طبقه‌بندی رسمی فدرال KldB متناسب با تخصص متقاضی",
    categoryFa: `حوزه تخصصی: ${roleClean}`,
    keywords: [],
    typicalSalaryRange: "58,000 - 82,000 €",
    germanDemandLevel: "بالا (بر اساس تقاضای عمومی مشاغل مهارتی در آلمان)",
    tools: [
      {
        id: "custom_primary",
        name: primaryTool,
        aliases: [primaryTool.toLowerCase()],
        category: "software_tool",
        categoryFa: "ابزار محوری تخصص",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 90,
        germanUsageContext: `ابزار محوری اجرای فرآیندها و استانداردهای شغلی در حوزه ${roleClean}.`,
        recommendedSeniority: "Mid-Level",
        typicalInterviewPromptDe: `Wie wenden Sie ${primaryTool} in industriellen Projekten nach deutschen Standards an?`,
        bridgeRecommendationFa: `مستندسازی تجارب و پروژه‌های اجرا شده با ${primaryTool} در قالب نمونه‌کار مستند.`
      },
      {
        id: "custom_secondary",
        name: secondaryTool,
        aliases: [secondaryTool.toLowerCase()],
        category: "software_tool",
        categoryFa: "ابزارهای مکمل و تحلیلی",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 85,
        germanUsageContext: "به‌کارگیری ابزارهای جانبی جهت یکپارچه‌سازی وظایف و کنترل خروجی‌ها.",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Welche Schnittstellen und Datenformate nutzen Sie zur Zusammenarbeit?",
        bridgeRecommendationFa: "نمایش نحوه انتقال اطلاعات میان ابزارهای مختلف در مستندات کاری."
      },
      {
        id: "german_doc_tools",
        name: "German Documentation & Jira / MS Office Suite",
        aliases: ["jira", "office", "excel", "confluence", "documentation"],
        category: "management",
        categoryFa: "مدیریت تسک و مستندسازی فنی",
        importance: "must_have",
        importanceLabelFa: "الزامی (Pflicht)",
        germanMarketPrevalence: 92,
        germanUsageContext: "پایبندی به اصل مستندسازی قانونی (Dokumentationspflicht) در تمامی مراحل کاری شرکت‌های آلمان.",
        recommendedSeniority: "Junior",
        typicalInterviewPromptDe: "Wie stellen Sie die Nachvollziehbarkeit und Berichterstattung Ihrer Arbeit sicher?",
        bridgeRecommendationFa: "تهیه گزارش‌های مکتوب ساختاریافته به زبان انگلیسی یا آلمانی."
      }
    ],
    skills: [
      {
        id: "din_iso_quality_mgmt",
        name: "مدیریت کیفیت و استانداردهای صنعتی آلمان (DIN / EN / ISO)",
        nameDe: "Qualitätsmanagement & DIN/ISO-Konformität",
        aliases: ["din", "iso", "quality", "کیفیت", "استاندارد"],
        category: "quality_standards",
        categoryFa: "تضمین کیفیت و استانداردها",
        benchmarkScore: 86,
        germanStandardRef: "DIN EN ISO 9001 / DIN Normen",
        descriptionFa: `رعایت آیین‌نامه‌ها و استانداردهای تضمین کیفیت در تحویل فرآیندهای مرتبط با ${roleClean}.`,
        germanExpectation: "انضباط سازمانی و ارائه خروجی‌های منطبق با چک‌لیست‌های مدون مهندسی در آلمان.",
        riskIfNotMasteredFa: "نقص در ارزیابی مصاحبه‌های فنی و تردید کارفرما در رعایت دقت خروجی کار.",
        actionRecommendationFa: "مطالعه شماره استانداردهای DIN مرتبط با رشته خود و ذکر آنها در رزومه."
      },
      {
        id: "german_work_ethics",
        name: "فرهنگ حل مسئله سیستماتیک و ارتباطات حرفه‌ای آلمان (Fehlerkultur)",
        nameDe: "Deutsche Arbeitskultur & Fehlerkultur",
        aliases: ["communication", "teamwork", "ارتباط", "کار تیمی"],
        category: "methodology",
        categoryFa: "فرهنگ کاری و ارتباطات",
        benchmarkScore: 84,
        descriptionFa: "پایبندی به ریشه‌یابی خطاها بدون سرزنش، وقت‌شناسی دقیق و تعامل شفاف در جلسات تخصصی.",
        germanExpectation: "صداقت تخصصی، پذیرش منطقی انتقادات سازنده و مسئولیت‌پذیری فردی در تحویل وظایف.",
        riskIfNotMasteredFa: "چالش در تطبیق فرهنگی با تیم در دوره ۶ ماهه آزمایشی (Probezeit).",
        actionRecommendationFa: "برجسته کردن نمونه‌های واقعی حل اختلاف نظر تیمی با تکیه بر آمار و مستندات در مصاحبه."
      }
    ],
    germanAtsKeywords: [
      { term: `Fachkraft für ${roleClean}`, termDe: `Spezialist/in für ${roleClean}`, importance: "vital", explanationFa: "عنوان تخصصی متناظر در دیتابیس کاریابی آلمان" },
      { term: "Qualitätssicherung (QS)", termDe: "DIN/ISO Konformität", importance: "vital", explanationFa: "تاکید بر پایبندی به استانداردهای کیفیت فدرال" },
      { term: "Dokumentationspflicht", termDe: "Technische Dokumentation", importance: "recommended", explanationFa: "مستندسازی ساختاریافته به عنوان سنگ بنای کار در آلمان" }
    ],
    roadmap30_60_90: {
      day30: [
        `تسلط بر ابزار اصلی (${primaryTool}) را با ارقام کمی در رزومه خود مستند نمایید.`,
        "استانداردهای اصلی DIN و اروپایی مرتبط با حوزه شغلی خود را شناسایی کنید."
      ],
      day60: [
        "رزومه خود را به زبان انگلیسی و آلمانی استاندارد با تکیه بر کلمات کلیدی شغلی تنظیم کنید.",
        "نمونه‌کارهای مستند به همراه گزارش‌های روند پروژه آماده فرمایید."
      ],
      day90: [
        "پاسخ به سوالات متداول مصاحبه‌های رفتاری و حل مسئله کارفرمایان آلمانی را شبیه‌سازی کنید."
      ]
    }
  };
}
