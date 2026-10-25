/**
 * Curated Database of Recognized Courses & Certifications
 * from German & International High-Reputation Platforms (Coursera, LinkedIn Learning, edX, openHPI, TÜV SÜD)
 * specifically mapped to close skills and tools gaps for the German job market.
 */

export interface GermanCourseRecommendation {
  id: string;
  toolOrSkillIds: string[]; // matches IDs in GermanToolBenchmarkItem or GermanSkillBenchmarkItem
  courseTitle: string;
  courseTitleDe?: string;
  provider: string; // e.g. "Google", "IBM", "Meta", "Amazon Web Services", "TÜV SÜD", "Technical University of Munich (TUM)", "Hasso Plattner Institute (openHPI)", "Atlassian", "Autodesk", "University of Michigan"
  platform: "LinkedIn Learning" | "Coursera" | "edX" | "openHPI" | "TÜV SÜD Academy";
  platformBadgeColor: string; // Tailwind color class
  url: string; // Direct link or platform search URL
  level: "Beginner" | "Intermediate" | "Advanced" | "Professional";
  levelFa: "مقدماتی تا متوسط" | "متوسط تا پیشرفته" | "پیشرفته و حرفه‌ای";
  estimatedHours: string; // e.g. "۲۵ ساعت (حدود ۴ هفته)"
  credentialType: "Professional Certificate" | "Specialization" | "Course Certificate" | "TÜV-Zertifikat";
  credentialTypeFa: "مدرک حرفه‌ای بین‌المللی" | "تخصص جامع (Specialization)" | "گواهی رسمی پایان دوره" | "گواهینامه استاندارد صنعتی TÜV";
  freeAuditAvailable: boolean;
  germanMarketValueFa: string; // ارزش استخدامی در آلمان و نحوه تاثیرگذاری بر کارفرمایان
  actionToCloseGapFa: string; // چگونگی رفع شکاف شناسایی‌شده
  skillsCovered: string[];
}

export const GERMAN_RECOGNIZED_COURSES: GermanCourseRecommendation[] = [
  // --- DOCKER & CONTAINERIZATION ---
  {
    id: "coursera_ibm_docker",
    toolOrSkillIds: ["docker"],
    courseTitle: "Introduction to Containers w/ Docker, Kubernetes & OpenShift",
    courseTitleDe: "Containerisierung mit Docker & Kubernetes für DevOps",
    provider: "IBM",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۱۶ ساعت (۳ هفته)",
    credentialType: "Professional Certificate",
    credentialTypeFa: "مدرک حرفه‌ای بین‌المللی",
    freeAuditAvailable: true,
    germanMarketValueFa: "مدرک رسمی IBM با امکان اشتراک مستقیم در پروفایل لینکدین؛ مورد احترام شرکت‌های نرم‌افزاری برلین و مونیخ برای احراز صلاحیت DevOps و Microservices.",
    actionToCloseGapFa: "یادگیری ساخت Dockerfileهای بهینه چندهنگامه (Multi-stage)، کاهش سایز ایمیج‌ها و شبکه کانتینرها منطبق بر استانداردهای پروداکشن آلمان.",
    skillsCovered: ["Docker", "Dockerfile", "Docker Compose", "Container Networking", "Multi-stage Builds"]
  },
  {
    id: "linkedin_docker_essential",
    toolOrSkillIds: ["docker"],
    courseTitle: "Learning Docker & Container Orchestration",
    courseTitleDe: "Docker Grundlagen und Container-Verwaltung",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/learning-docker",
    level: "Beginner",
    levelFa: "مقدماتی تا متوسط",
    estimatedHours: "۴ ساعت فشرده",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "نمایش فوری نشان مهارت تاییدشده (Verified Skill Badge) در پروفایل LinkedIn که ریکروترهای آلمانی از طریق LinkedIn Recruiter فیلتر می‌کنند.",
    actionToCloseGapFa: "تسلط فوری بر دستورات پرکاربرد Docker CLI و ایزوله‌سازی سرویس‌ها برای رفع سریع ایراد در فیلتر اولیه ATS.",
    skillsCovered: ["Docker CLI", "Container Volumes", "Docker Hub", "Container Security"]
  },

  // --- KUBERNETES ---
  {
    id: "coursera_google_k8s",
    toolOrSkillIds: ["kubernetes"],
    courseTitle: "Architecting with Google Kubernetes Engine (GKE)",
    courseTitleDe: "Architektur mit Kubernetes Engine für Cloud-Native",
    provider: "Google Cloud",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/specializations/architecting-google-kubernetes-engine",
    level: "Advanced",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۳۰ ساعت (۱ ماه)",
    credentialType: "Specialization",
    credentialTypeFa: "تخصص جامع (Specialization)",
    freeAuditAvailable: true,
    germanMarketValueFa: "یکی از معتبرترین مدارک کلاود در آلمان برای پوزیشن‌های Senior Engineer و Cloud Architect با افزایش شانس دعوت به مصاحبه تا ۶۰٪.",
    actionToCloseGapFa: "پیکربندی Podها، Ingress Controller، مانیتورینگ سلامت سرویس‌ها و استراتژی‌های رول‌اوت بدون قطعی (Rolling Update).",
    skillsCovered: ["Kubernetes", "K8s Architecture", "Helm Charts", "Ingress", "Deployments"]
  },
  {
    id: "edx_linux_k8s",
    toolOrSkillIds: ["kubernetes"],
    courseTitle: "Introduction to Kubernetes (LFS158x)",
    courseTitleDe: "Offizieller Kubernetes-Grundkurs der Linux Foundation",
    provider: "The Linux Foundation",
    platform: "edX",
    platformBadgeColor: "bg-rose-700 text-white",
    url: "https://www.edx.org/learn/kubernetes/the-linux-foundation-introduction-to-kubernetes",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۲۰ ساعت (رایگان)",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "تاییدیه رسمی بنیاد لینوکس (Linux Foundation) که در صنعت فناوری اطلاعات آلمان بالاترین استاندارد اصالت فنی را دارد.",
    actionToCloseGapFa: "تسلط بر کامپوننت‌های Control Plane، کلاسترینگ و پیکربندی مانیفست‌های YAML استاندارد.",
    skillsCovered: ["Kubernetes Core", "YAML Manifests", "ConfigMaps", "Secrets", "Cluster Networking"]
  },

  // --- TYPESCRIPT ---
  {
    id: "linkedin_typescript_adv",
    toolOrSkillIds: ["typescript"],
    courseTitle: "Advanced TypeScript: Generics, Decorators & Type Metaprogramming",
    courseTitleDe: "Fortgeschrittene TypeScript-Entwicklung für Enterprise",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/advanced-typescript",
    level: "Advanced",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۵ ساعت فشرده",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "تضمین تسلط بر تایپ‌اسکریپت پیشرفته که بیش از ۹۰٪ استارتاپ‌ها و شرکت‌های آلمانی در مصاحبه فنی دوم (Technical Live Coding) تست می‌کنند.",
    actionToCloseGapFa: "جبران ضعف در Conditional Types، Utility Types و Type Guards جهت گذراندن موفق سوالات فنی لایوکدینگ.",
    skillsCovered: ["TypeScript Strict Mode", "Generics", "Conditional Types", "Type Narrowing", "TSConfig"]
  },
  {
    id: "coursera_meta_typescript",
    toolOrSkillIds: ["typescript", "react_next"],
    courseTitle: "Meta Front-End Developer Specialization w/ TypeScript",
    courseTitleDe: "Meta Front-End-Zertifizierung mit React & TypeScript",
    provider: "Meta",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۶۰ ساعت (۲ ماه)",
    credentialType: "Professional Certificate",
    credentialTypeFa: "مدرک حرفه‌ای بین‌المللی",
    freeAuditAvailable: true,
    germanMarketValueFa: "گواهینامه تاییدشده Meta که برای کارفرمایان فاز ۱ آلمان (Zalando, Delivery Hero, N26) نشانه آشنایی با استانداردهای مدرن فرانت‌اند است.",
    actionToCloseGapFa: "پیاده‌سازی پروژه‌های کامل React با تایپ‌اسکریپت و اصول تست‌نویسی اتوماتیک.",
    skillsCovered: ["React", "TypeScript", "UI Components", "Unit Testing", "Jest"]
  },

  // --- REACT & NEXT.JS ---
  {
    id: "linkedin_nextjs_fullstack",
    toolOrSkillIds: ["react_next"],
    courseTitle: "Next.js: Building Modern Full-Stack Web Applications",
    courseTitleDe: "Next.js Moderne Webentwicklung mit App Router & SSR",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/next-js-building-modern-web-applications",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۶ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "اثبات تسلط بر Server Actions و App Router در اکوسیستم فرانت‌اند آلمان که امروزه به استاندارد استخدامی تبدیل شده است.",
    actionToCloseGapFa: "رفع شکاف معماری Next.js و بهینه‌سازی رندرینگ برای کسب رتبه بالای Core Web Vitals.",
    skillsCovered: ["Next.js App Router", "Server Components", "SSR/SSG", "API Routes", "Tailwind CSS"]
  },

  // --- CLOUD AWS & AZURE ---
  {
    id: "coursera_aws_architect",
    toolOrSkillIds: ["cloud_aws_azure"],
    courseTitle: "AWS Cloud Solutions Architect Professional Certificate",
    courseTitleDe: "AWS Certified Solutions Architect Vorbereitung",
    provider: "Amazon Web Services",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect",
    level: "Professional",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۵۰ ساعت (۱ تا ۲ ماه)",
    credentialType: "Professional Certificate",
    credentialTypeFa: "مدرک حرفه‌ای بین‌المللی",
    freeAuditAvailable: true,
    germanMarketValueFa: "رسمی‌ترین گواهینامه برای تصدی مشاغل ابری در آلمان با پذیرش ۱۰۰ درصدی در شرکت‌های انترپرایز و مشاوره‌های IT آلمان.",
    actionToCloseGapFa: "طراحی زیرساخت‌های پایدار، Highly Available و مقیاس‌پذیر در دیتاسنترهای فرانکفورت AWS مطابق با الزامات حفاظت داده آلمان.",
    skillsCovered: ["AWS VPC", "EC2 & ECS", "S3", "IAM Security", "Well-Architected Framework"]
  },
  {
    id: "linkedin_azure_fundamentals",
    toolOrSkillIds: ["cloud_aws_azure"],
    courseTitle: "Microsoft Azure Fundamentals (AZ-900) Cert Prep",
    courseTitleDe: "Microsoft Azure Grundlagen für Unternehmens-IT",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/microsoft-azure-fundamentals-az-900-cert-prep",
    level: "Beginner",
    levelFa: "مقدماتی تا متوسط",
    estimatedHours: "۸ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "آژور به دلیل شراکت قوی با شرکت‌های صنعتی سنتی آلمان (Siemens, BMW, BASF) محبوبیت بسیار بالایی در شرکت‌های Mittelstand دارد.",
    actionToCloseGapFa: "آشنایی با هویت‌سنجی Entra ID (Azure AD)، شبکه‌های خصوصی و راهکارهای Cloud Security.",
    skillsCovered: ["Azure Services", "Entra ID", "Cloud Governance", "Resource Groups"]
  },

  // --- POSTGRESQL & SQL ---
  {
    id: "coursera_michigan_postgresql",
    toolOrSkillIds: ["postgresql_sql"],
    courseTitle: "PostgreSQL for Everybody Specialization",
    courseTitleDe: "PostgreSQL Datenbankarchitektur & Optimierung",
    provider: "University of Michigan",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/specializations/postgresql-for-everybody",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۳۰ ساعت (۱ ماه)",
    credentialType: "Specialization",
    credentialTypeFa: "تخصص جامع (Specialization)",
    freeAuditAvailable: true,
    germanMarketValueFa: "پایگاه داده ترجیحی اکوسیستم تک در آلمان به دلیل کدباز بودن و انطباق با قوانین حاکمیت داده اروپا.",
    actionToCloseGapFa: "تسلط بر ایندکس‌گذاری پیشرفته (B-Tree, GIN)، تحلیل Explain Plan، ترنزکشن‌های ACID و معماری پایگاه داده.",
    skillsCovered: ["PostgreSQL", "Query Optimization", "Indexing", "JSONB", "Database Normalization"]
  },

  // --- GIT & CI/CD ---
  {
    id: "coursera_google_git",
    toolOrSkillIds: ["git_cicd"],
    courseTitle: "Introduction to Git and GitHub & Automated Testing",
    courseTitleDe: "Git, GitHub & Automatisierte Tests für DevOps",
    provider: "Google",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/learn/introduction-git-github",
    level: "Beginner",
    levelFa: "مقدماتی تا متوسط",
    estimatedHours: "۲۰ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "گواهینامه تاییدشده گوگل در سرفصل مدیریت ورژن و تست پیوسته؛ پیش‌نیاز احراز آمادگی فنی در هر موقعیت شغلی آلمان.",
    actionToCloseGapFa: "یادگیری استراتژی‌های GitFlow، حل کانفلیکت‌ها و راه‌اندازی GitHub Actions برای تست و بیلد اتوماتیک.",
    skillsCovered: ["Git", "GitHub Actions", "CI/CD Pipeline", "Branching Strategies", "Pull Request Reviews"]
  },

  // --- CLEAN ARCHITECTURE & TESTING ---
  {
    id: "openhpi_clean_code",
    toolOrSkillIds: ["clean_architecture_testing"],
    courseTitle: "Clean Code and Quality Software Engineering",
    courseTitleDe: "Clean Code Prinzipien & Software-Qualität (HPI Potsdam)",
    provider: "Hasso Plattner Institute (openHPI)",
    platform: "openHPI",
    platformBadgeColor: "bg-red-800 text-white",
    url: "https://open.hpi.de/",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۱۵ ساعت (رایگان)",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "موسسه Hasso Plattner در پتسدام آلمان معتبرترین قطب IT دانشگاهی در سراسر آلمان است و مدرک آن وزن فوق‌العاده‌ای در چشم کارفرمای آلمانی دارد.",
    actionToCloseGapFa: "تسلط بر اصول SOLID، نوشتن تست‌های واحد (Unit Tests) با پوشش بالای ۸۰٪ و پیاده‌سازی معماری تمیز چندلایه.",
    skillsCovered: ["Clean Code", "SOLID Principles", "Unit Testing", "TDD", "Refactoring"]
  },

  // --- DSGVO / GDPR & DATA PRIVACY ---
  {
    id: "coursera_gdpr_privacy",
    toolOrSkillIds: ["dsgvo_gdpr_security"],
    courseTitle: "Privacy & Data Protection in the Digital Age (GDPR / DSGVO)",
    courseTitleDe: "Datenschutz nach DSGVO für Entwickler & Architekten",
    provider: "Erasmus University Rotterdam",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/learn/privacy-data-protection-gdpr",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۱۴ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "قوانین حفظ حریم خصوصی آلمان (BDSG/DSGVO) بسیار سخت‌گیرانه هستند و داشتن مدرک آگاهی از این حوزه برای مهندسان غیراروپایی یک امتیاز بسیار متمایز است.",
    actionToCloseGapFa: "یادگیری اصول Privacy by Design، رمزنگاری داده‌ها در حالت استراحت و انتقال، و فرآیند anonymization.",
    skillsCovered: ["DSGVO / GDPR", "Privacy by Design", "BDSG", "Data Encryption", "Audit Logging"]
  },

  // --- AGILE & SCRUM (DACH) ---
  {
    id: "coursera_atlassian_agile",
    toolOrSkillIds: ["agile_scrum_dach", "jira_confluence"],
    courseTitle: "Atlassian Agile Development and Jira Software",
    courseTitleDe: "Agiles Arbeiten mit Scrum & Jira im Enterprise-Umfeld",
    provider: "Atlassian",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/learn/agile-atlassian-jira",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۱۲ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "بیش از ۸۵٪ شرکت‌های آلمانی برای اسپرینت‌ها، رتروها و تیکتینگ از Jira و Confluence استفاده می‌کنند.",
    actionToCloseGapFa: "یادگیری مدیریت بک‌لاگ، نوشتن User Storyهای استاندارد، و تخمین استوری‌پوینت در قالب Scrum آلمانی.",
    skillsCovered: ["Scrum", "Jira", "Confluence", "Sprint Planning", "Story Point Estimation"]
  },

  // --- AUTOSAR & AUTOMOTIVE EMBEDDED ---
  {
    id: "tuv_autosar_fundamentals",
    toolOrSkillIds: ["autosar"],
    courseTitle: "AUTOSAR Classic and Adaptive Architecture Training",
    courseTitleDe: "AUTOSAR Classic & Adaptive Architektur für Automotive",
    provider: "TÜV SÜD Academy",
    platform: "TÜV SÜD Academy",
    platformBadgeColor: "bg-blue-800 text-white",
    url: "https://www.tuev-sued.de/academy",
    level: "Professional",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۲۴ ساعت کارگاهی",
    credentialType: "TÜV-Zertifikat",
    credentialTypeFa: "گواهینامه استاندارد صنعتی TÜV",
    freeAuditAvailable: false,
    germanMarketValueFa: "نشان TÜV در صنعت خودرو آلمان (ب‌ام‌و، مرسدس، پورشه، بوش، کانتیننتال) طلایی‌ترین تاییدیه تخصصی به شمار می‌آید.",
    actionToCloseGapFa: "تسلط عمیق بر لایه‌های BSW (Basic Software)، RTE (Runtime Environment) و لایه اپلیکیشن مطابق با الزامات OEMs آلمان.",
    skillsCovered: ["AUTOSAR Classic", "AUTOSAR Adaptive", "BSW Stacks", "RTE", "MCAL"]
  },
  {
    id: "coursera_automotive_software",
    toolOrSkillIds: ["autosar", "embedded_c_cpp"],
    courseTitle: "Introduction to Self-Driving Cars & Automotive Embedded Software",
    courseTitleDe: "Softwareentwicklung für automatisierte Fahrzeugsysteme",
    provider: "University of Toronto",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/specializations/self-driving-cars",
    level: "Advanced",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۴۰ ساعت (۲ ماه)",
    credentialType: "Specialization",
    credentialTypeFa: "تخصص جامع (Specialization)",
    freeAuditAvailable: true,
    germanMarketValueFa: "جامع‌ترین دوره مبانی خودروهای خودران و نرم‌افزار نهفته؛ شناخته‌شده نزد ریکروترهای شرکت‌های تایر ۱ و خودروسازان اشتوتگارت و مونیخ.",
    actionToCloseGapFa: "درک عملکرد سنسورها، سیستم‌های کنترل بلادرنگ و ساختارهای کدنویسی امن خودرویی.",
    skillsCovered: ["Automotive C++", "Real-Time Systems", "State Estimation", "Vehicle Dynamics"]
  },

  // --- CAN / LIN & VECTOR TOOLS ---
  {
    id: "linkedin_can_bus_embedded",
    toolOrSkillIds: ["can_lin_protocols", "vector_tools"],
    courseTitle: "In-Vehicle Networks: CAN, CAN FD & Automotive Diagnostics",
    courseTitleDe: "Fahrzeug-Bussysteme: CAN, LIN & Diagnose-Standards",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/embedded-systems-bare-metal-programming",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۸ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "پروتکل CAN استاندارد مشترک بوش و مرسدس‌بنز است و اثبات تسلط بر آن شرط ورود به مصاحبه فنی مهندسی خودرو در آلمان است.",
    actionToCloseGapFa: "تسلط بر تحلیل ترافیک باس با DBC فایل‌ها، فریم‌های CAN FD، سیگنالینگ و تشخیص خطا (UDS ISO 14229).",
    skillsCovered: ["CAN Bus", "LIN Bus", "CAN FD", "DBC Files", "Vector CANoe Overview"]
  },

  // --- MATLAB & SIMULINK ---
  {
    id: "coursera_vanderbilt_matlab",
    toolOrSkillIds: ["matlab_simulink"],
    courseTitle: "Introduction to Programming with MATLAB & Simulink",
    courseTitleDe: "Modellbasierte Entwicklung mit MATLAB & Simulink",
    provider: "Vanderbilt University",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/specializations/matlab-programming",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۳۵ ساعت",
    credentialType: "Specialization",
    credentialTypeFa: "تخصص جامع (Specialization)",
    freeAuditAvailable: true,
    germanMarketValueFa: "استاندارد بلامنازع تحقیق و توسعه (R&D) در مهندسی خودرو و مکانیک آلمان برای توسعه الگوریتم‌های کنترل مبتنی بر مدل (MBD).",
    actionToCloseGapFa: "پیاده‌سازی مدل‌های حلقه کنترلی، شبیه‌سازی سیستم‌های دینامیکی و استخراج خودکار کد C/C++ از سیمولینک.",
    skillsCovered: ["MATLAB", "Simulink", "Model-Based Design", "Control Systems", "Stateflow"]
  },

  // --- ISO 26262 FUNCTIONAL SAFETY ---
  {
    id: "tuv_iso26262_safety",
    toolOrSkillIds: ["iso26262_functional_safety"],
    courseTitle: "Functional Safety Engineer ISO 26262 Certification Prep",
    courseTitleDe: "Funktionale Sicherheit nach ISO 26262 Zertifizierung",
    provider: "TÜV SÜD Academy",
    platform: "TÜV SÜD Academy",
    platformBadgeColor: "bg-blue-800 text-white",
    url: "https://www.tuev-sued.de/academy",
    level: "Professional",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۱۶ ساعت",
    credentialType: "TÜV-Zertifikat",
    credentialTypeFa: "گواهینامه استاندارد صنعتی TÜV",
    freeAuditAvailable: false,
    germanMarketValueFa: "یکی از باارزش‌ترین مدارک ایمنی عملکردی در آلمان؛ مهندسان دارای این تاییدیه از بالاترین تقاضا و بالاترین حقوق‌ها در ایالت‌های باواریا و بادن-وورتمبرگ برخوردارند.",
    actionToCloseGapFa: "یادگیری ارزیابی سطوح ASIL (A تا D)، تحلیل‌های FMEA و FMEDA، و مستندسازی پرونده ایمنی (Safety Case).",
    skillsCovered: ["ISO 26262", "ASIL Rating", "Hazard Analysis (HARA)", "FMEA / FMEDA", "Safety Goals"]
  },
  {
    id: "edx_tum_safety",
    toolOrSkillIds: ["iso26262_functional_safety"],
    courseTitle: "Automated Road Vehicles: Safety, Testing and Validation",
    courseTitleDe: "Sicherheitsvalidierung für Fahrzeugsysteme (TU München)",
    provider: "Technical University of Munich (TUM)",
    platform: "edX",
    platformBadgeColor: "bg-rose-700 text-white",
    url: "https://www.edx.org/school/tumx",
    level: "Advanced",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۲۴ ساعت (۶ هفته)",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "صادرشده از دانشگاه صنعتی مونیخ (TUM)؛ بالاترین پرستیژ آکادمیک و صنعتی ممکن در آلمان.",
    actionToCloseGapFa: "درک روش‌های اعتبارسنجی سیستم‌های خودران و منطق ایمنی تصادف طبق استانداردهای فدرال.",
    skillsCovered: ["Functional Safety", "Verification & Validation", "Automotive Systems", "ISO Standards"]
  },

  // --- EMBEDDED C / C++ ---
  {
    id: "coursera_colorado_embedded",
    toolOrSkillIds: ["embedded_c_cpp"],
    courseTitle: "Embedded Software and Hardware Architecture",
    courseTitleDe: "Eingebettete Systeme & Hardware-Architektur mit C/C++",
    provider: "University of Colorado Boulder",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/specializations/embedded-software-hardware",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۴۰ ساعت",
    credentialType: "Specialization",
    credentialTypeFa: "تخصص جامع (Specialization)",
    freeAuditAvailable: true,
    germanMarketValueFa: "پوشش جامع برنامه‌نویسی سطح پایین، مدیریت حافظه و درایورنویسی میکروکنترلرها، مورد تایید شرکت‌های نیمه‌هادی آلمان (Infineon, Bosch).",
    actionToCloseGapFa: "رفع باگ‌های مدیریت حافظه پویا، تسلط بر اشاره‌گرها، وقفه‌ها (Interrupts) و ساختارهای Bare-Metal C.",
    skillsCovered: ["Embedded C", "Bare-Metal Programming", "Microcontrollers", "RTOS", "Device Drivers"]
  },

  // --- REVIT & BIM (CIVIL / STRUCTURAL) ---
  {
    id: "coursera_bim_civil",
    toolOrSkillIds: ["revit_bim"],
    courseTitle: "BIM: From Sketch to Digital Twin with Autodesk Revit",
    courseTitleDe: "Building Information Modeling (BIM) mit Autodesk Revit",
    provider: "National Taiwan University / Autodesk",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/learn/bim-application",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۲۵ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "دولت آلمان از سال ۲۰۲۰ استفاده از BIM را برای کلیه پروژه‌های زیرساختی دولتی الزامی کرده است و این مدرک تضمین ورود به دفاتر مهندسی عمران آلمان است.",
    actionToCloseGapFa: "مدل‌سازی پارامتریک سه‌بعدی سازه، مدیریت هماهنگی بین‌رشته‌ای و استخراج جدول مقادیر و احجام.",
    skillsCovered: ["Autodesk Revit", "BIM 360", "Clash Detection", "Structural Modeling", "IFC Standards"]
  },
  {
    id: "linkedin_revit_structural",
    toolOrSkillIds: ["revit_bim"],
    courseTitle: "Revit Structure Essential Training & Professional Prep",
    courseTitleDe: "Revit Structure Tragwerksplanung im Hochbau",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/revit-structure-essential-training",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۶ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "اعتبارسنجی مهارت رسمی اتودسک در لینکدین جهت جلب توجه شرکت‌های بزرگ مهندسی مشاور عمران در فرانکفورت و مونیخ.",
    actionToCloseGapFa: "ایجاد نقشه‌های اجرایی سازه بتنی و فولادی و تعریف میلگردگذاری سه‌بعدی.",
    skillsCovered: ["Revit Structure", "Structural Reinforcement", "Schedules", "BIM Families"]
  },

  // --- DLUBAL RFEM / FEA ---
  {
    id: "coursera_fea_structural",
    toolOrSkillIds: ["dlubal_rfem", "etabs_sap2000"],
    courseTitle: "Finite Element Method (FEM) for Structural Engineers",
    courseTitleDe: "Finite-Elemente-Methode (FEM) in der Tragwerksplanung",
    provider: "University of Michigan",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/learn/finite-element-method",
    level: "Advanced",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۳۰ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "درک تئوری و محاسباتی المان محدود که در آلمان نرم‌افزار Dlubal RFEM بر پایه آن استاندارد محاسبات سازه است.",
    actionToCloseGapFa: "تحلیل تنش، تغییر مکان‌های غیرخطی و تحلیل پایداری کمانش در سازه‌های پیچیده.",
    skillsCovered: ["Finite Element Analysis", "Non-linear Analysis", "Structural Stability", "Stress Analysis"]
  },

  // --- EUROCODES & GERMAN NORMS (DIN EN) ---
  {
    id: "edx_eurocodes_structural",
    toolOrSkillIds: ["eurocodes_de"],
    courseTitle: "Structural Design according to Eurocode Standards (EC2 & EC3)",
    courseTitleDe: "Bemessung nach Eurocode 2 & 3 für den deutschen Markt",
    provider: "TU Delft",
    platform: "edX",
    platformBadgeColor: "bg-rose-700 text-white",
    url: "https://www.edx.org/school/delftx",
    level: "Advanced",
    levelFa: "پیشرفته و حرفه‌ای",
    estimatedHours: "۳۰ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "مهم‌ترین مانع مهندسان عمران غیراروپایی در آلمان، عدم آشنایی با ضرایب ملی آلمان (National Annex) در یورکد است که این دوره آن را پوشش می‌دهد.",
    actionToCloseGapFa: "طراحی المان‌های بتن‌آرمه و فولادی طبق مقررات زلزله و بارهای باد در حوزه آلمان (DIN EN 1992 / DIN EN 1993).",
    skillsCovered: ["Eurocode 2", "Eurocode 3", "National Annex Germany", "Load Combinations", "ULS & SLS"]
  },

  // --- CATIA V5 & SIEMENS NX (MECHANICAL CAD) ---
  {
    id: "linkedin_siemens_nx",
    toolOrSkillIds: ["siemens_nx"],
    courseTitle: "Siemens NX Essential Training: Advanced Parametric Modeling",
    courseTitleDe: "Siemens NX CAD Grundlagen & Konstruktionstechnik",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/siemens-nx-essential-training",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۷ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "نرم‌افزار رسمی طراحی در گروه دایملر (مرسدس‌بنز) و شرکت‌های هوافضای آلمان؛ تسلط بر آن شانس استخدام مکانیک را به شدت بالا می‌برد.",
    actionToCloseGapFa: "مدل‌سازی سطوح پیچیده (Surfacing)، اسمبلی‌های بزرگ و تهیه نقشه‌های ساخت بر مبنای استاندارد DIN ISO.",
    skillsCovered: ["Siemens NX", "Parametric Modeling", "Assemblies", "Drafting & Tolerancing"]
  },
  {
    id: "coursera_catia_cad",
    toolOrSkillIds: ["catia_v5"],
    courseTitle: "Parametric 3D CAD Modeling with CATIA & SolidWorks",
    courseTitleDe: "CAD-Konstruktion mit CATIA V5 für die Automobilindustrie",
    provider: "Coursera Project Network",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/projects/catia-cad-modeling",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۱۰ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: true,
    germanMarketValueFa: "نرم‌افزار استاندارد گروه فولکس‌واگن و ب‌ام‌و برای بدنه، شاسی و اجزای داخلی خودرو در آلمان.",
    actionToCloseGapFa: "طراحی قطعات ورق‌کاری (Sheet Metal) و قطعات تزریق پلاستیک خودرویی.",
    skillsCovered: ["CATIA V5", "Part Design", "Generative Shape Design", "Sheet Metal"]
  },

  // --- SIEMENS TIA PORTAL & PLC AUTOMATION ---
  {
    id: "linkedin_siemens_tia_plc",
    toolOrSkillIds: ["siemens_tia_portal"],
    courseTitle: "PLC Programming with Siemens TIA Portal & S7-1500",
    courseTitleDe: "SPS-Programmierung mit Siemens TIA Portal nach IEC 61131",
    provider: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    platformBadgeColor: "bg-amber-600 text-white",
    url: "https://www.linkedin.com/learning/plc-programming-basics",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۹ ساعت",
    credentialType: "Course Certificate",
    credentialTypeFa: "گواهی رسمی پایان دوره",
    freeAuditAvailable: false,
    germanMarketValueFa: "زیمنس رهبر بازار اتوماسیون صنعتی در آلمان و اروپاست؛ بیش از ۷۵٪ خطوط تولید آلمان بر پایه کنترلرهای S7-1200/1500 کار می‌کنند.",
    actionToCloseGapFa: "برنامه‌نویسی با زبان‌های Ladder (LAD) و Structured Text (SCL)، پیکربندی ورودی/خروجی‌های صنعتی و HMI زیمنس.",
    skillsCovered: ["Siemens TIA Portal", "S7-1200 / S7-1500", "Structured Text (SCL)", "Ladder Logic", "PROFINET"]
  },
  {
    id: "coursera_industrial_iot_automation",
    toolOrSkillIds: ["siemens_tia_portal"],
    courseTitle: "Industrial IoT and Automation: From Sensors to Cloud",
    courseTitleDe: "Industrie 4.0: Vernetzte Automatisierungssysteme",
    provider: "State University of New York",
    platform: "Coursera",
    platformBadgeColor: "bg-blue-600 text-white",
    url: "https://www.coursera.org/specializations/industrial-iot",
    level: "Intermediate",
    levelFa: "متوسط تا پیشرفته",
    estimatedHours: "۲۸ ساعت",
    credentialType: "Specialization",
    credentialTypeFa: "تخصص جامع (Specialization)",
    freeAuditAvailable: true,
    germanMarketValueFa: "همخوانی مستقیم با استراتژی ملی صنعت ۴.۰ آلمان (Industrie 4.0) و اتصال سنسورها و ماشین‌آلات به شبکه‌های ابری صنعتی.",
    actionToCloseGapFa: "آشنایی با پروتکل‌های صنعتی OPC UA، MQTT و تحلیل داده‌های خطوط تولید.",
    skillsCovered: ["Industrie 4.0", "OPC UA", "SCADA", "Industrial Networking", "Edge Computing"]
  }
];

/**
 * Returns recommended courses specifically tailored to address the candidate's extracted gaps.
 */
export function getRecommendedCoursesForGaps(
  gapToolIds: string[],
  gapSkillIds: string[] = [],
  filterPlatform: string = "all",
  limit: number = 8
): GermanCourseRecommendation[] {
  const combinedIds = new Set([...gapToolIds, ...gapSkillIds]);

  let matchedCourses = GERMAN_RECOGNIZED_COURSES.filter(course => {
    const hitsGap = course.toolOrSkillIds.some(id => combinedIds.has(id));
    if (!hitsGap) return false;

    if (filterPlatform !== "all" && course.platform !== filterPlatform) {
      return false;
    }
    return true;
  });

  // If candidate has few specific gaps, also provide top fundamental German market courses
  if (matchedCourses.length < 3) {
    const fallbacks = GERMAN_RECOGNIZED_COURSES.filter(c => 
      !matchedCourses.some(m => m.id === c.id) &&
      (filterPlatform === "all" || c.platform === filterPlatform)
    );
    matchedCourses = [...matchedCourses, ...fallbacks.slice(0, 3 - matchedCourses.length)];
  }

  return matchedCourses.slice(0, limit);
}

/**
 * Returns direct course suggestions for a specific tool ID
 */
export function getCoursesByToolId(toolId: string): GermanCourseRecommendation[] {
  return GERMAN_RECOGNIZED_COURSES.filter(course =>
    course.toolOrSkillIds.includes(toolId)
  );
}
