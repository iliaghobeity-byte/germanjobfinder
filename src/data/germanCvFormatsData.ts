/**
 * German Resume Formats Data & Specifications (FEG 2026 & DIN 5008 Standards)
 * Covers the 4 prominent German resume formats:
 * 1. Tabellarischer Lebenslauf (Classic DIN 5008 Standard - The Gold Standard in Germany)
 * 2. Europass-Lebenslauf (Standardized EU Framework with CEFR Language Grid)
 * 3. Modernes IT- & Tech-Layout (2-Column with Sidebar, Kurzprofil & Tech-Stack)
 * 4. Akademischer Lebenslauf (Wissenschaft, Forschung, Lehre & Publikationen)
 */

export type GermanCvFormatId = "tabellarisch" | "europass" | "modern" | "akademisch";

export interface GermanCvFormat {
  id: GermanCvFormatId;
  titleFa: string;
  titleDe: string;
  subtitleFa: string;
  badge: string;
  badgeColor: string; // Tailwind classes
  accentColor: string; // Hex or theme
  iconName: "FileSpreadsheet" | "Globe" | "Sparkles" | "GraduationCap";
  descriptionFa: string;
  bestForFa: string;
  recommendedForRoles: string[];
  keyCharacteristicsFa: string[];
  consFa?: string;
  layoutType: "tabular_din" | "europass_grid" | "modern_sidebar" | "academic_hierarchy";
  sampleText: string;
  featureHighlights: Array<{ label: string; value: string }>;
}

export const GERMAN_CV_FORMATS: GermanCvFormat[] = [
  // ---------------------------------------------------------------------------
  // 1. TABELLARISCHER LEBENSLAUF (DIN 5008)
  // ---------------------------------------------------------------------------
  {
    id: "tabellarisch",
    titleFa: "رزومه جدولی استاندارد (DIN 5008)",
    titleDe: "Tabellarischer Lebenslauf nach DIN 5008",
    subtitleFa: "فرمت رسمی و مرجع شماره یک کارفرمایان و ادارات آلمان",
    badge: "استاندارد طلایی آلمان (Goldstandard)",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    accentColor: "#1e3a8a",
    iconName: "FileSpreadsheet",
    descriptionFa: "ساختار جدولی دو ستونه که تاریخ دقیق سوابق کاری و تحصیلی (ماه/سال) در ستون چپ و عنوان شغلی، وظایف و دستاوردها در ستون راست درج می‌شود. هدر این فرمت منطبق با استاندارد مکاتبات اداری آلمان (DIN 5008) تنظیم می‌گردد.",
    bestForFa: "شرکت‌های متوسط و بزرگ آلمانی (Mittelstand)، ادارات دولتی، سفارت و اداره اتباع خارجی (Ausländerbehörde) و فرآیند تایید مدارک ویزای کار.",
    recommendedForRoles: [
      "مهندسان مکانیک، برق، عمران و صنایع",
      "حوزه‌های مالی، حسابداری، بازرگانی و منابع انسانی",
      "پزشکان، دندانپزشکان، پرستاران و کادر درمان",
      "کارجویان متقاضی کارت شانس (Chancenkarte) و بلوکارت"
    ],
    keyCharacteristicsFa: [
      "ساختار جدولی دقیق دو ستونه معکوس (Antichronologische Reihenfolge)",
      "سربرگ و بلوک آدرس منطبق بر استاندارد DIN 5008 با تاییدیه وضعیت آنابین H+",
      "ستون چپ تاریخ‌ها (MM/JJJJ – MM/JJJJ) و ستون راست شرکت، شهر و وظایف",
      "بخش رسمی اطلاعات شخصی (Persönliche Daten) شامل ملیت و مجوز کار",
      "بلوک پایانی مکان، تاریخ روز و امضای رسمی متقاضی (Ort, Datum & Unterschrift)"
    ],
    consFa: "جلوه بصری ساده و سنتی؛ برای شرکت‌های نوپای خلاق و طراحان UI/UX ممکن است بیش از حد رسمی به نظر برسد.",
    layoutType: "tabular_din",
    featureHighlights: [
      { label: "استاندارد مرجع", value: "DIN 5008 آلمان" },
      { label: "پذیرش اداری و سفارت", value: "۱۰۰٪ تضمینی" },
      { label: "نوع چیدمان", value: "جدولی دو ستونه" },
      { label: "امضا و تاریخ رسمی", value: "الزامی (انتهای سند)" }
    ],
    sampleText: `================================================================================
LEBENSLAUF
================================================================================

PERSÖNLICHE DATEN
--------------------------------------------------------------------------------
Name:               Max Mustermann
Anschrift:          Musterstraße 12, 10115 Berlin, Deutschland
                    (bzw. Valiasr Ave. 1420, 19979 Teheran, Iran - Umzugsbereit)
Telefon:            +49 152 0000000 / +98 912 345 6789
E-Mail:             mustermann.karriere@beispiel.de
Geburtsdatum/-ort:  15. Mai 1992 in Teheran
Staatsangehörigkeit:Iranisch (Berechtigt zur Blauen Karte EU gem. § 18g AufenthG)
Familienstand:      Ledig

BERUFLICHER WERDEGANG
--------------------------------------------------------------------------------
03/2022 – heute     Senior Softwareentwickler (Full-Stack)
                    Muster-IT Solutions GmbH, Teheran / Remote
                    - Architektur und Entwicklung von Enterprise-Weblösungen mit 
                      React, TypeScript und Node.js (Express)
                    - Optimierung komplexer PostgreSQL-Abfragen und Reduzierung 
                      der durchschnittlichen Latenzzeiten um 35%
                    - Fachliche Leitung eines agilen Teams von 4 Junior-Entwicklern 
                      nach Scrum-Methodik
                    - Einführung von CI/CD-Pipelines via Docker und GitHub Actions

09/2018 – 02/2022   Software Developer & Web-Ingenieur
                    Persian Web Innovations Co., Isfahan
                    - Entwicklung responsiver Frontend-Komponenten mit React und Tailwind
                    - Entwurf und Dokumentation von RESTful API-Schnittstellen
                    - Enge Zusammenarbeit mit dem UX-Team und Product Owner

SCHUL- UND BERUFSBILDUNG
--------------------------------------------------------------------------------
09/2014 – 07/2018   Bachelor of Science (B.Sc.) in Software Engineering
                    Amirkabir University of Technology (Tehran Polytechnic)
                    - Anabin-Status: H+ (Staatlich anerkannte Hochschule)
                    - Äquivalenz: Entspricht deutschem Universitätsabschluss (KMK/ZAB)
                    - Gesamtnote: Sehr gut (1,8 nach bayerischer Formel)
                    - Abschlussarbeit: "Skalierbare Cloud-Architekturen im Enterprise-Bereich"

WEITERBILDUNG & ZERTIFIZIERUNGEN
--------------------------------------------------------------------------------
11/2024             AWS Certified Solutions Architect – Associate (Amazon Web Services)
05/2023             Professional Scrum Master I (PSM I, Scrum.org)

KENNTNISSE & FÄHIGKEITEN
--------------------------------------------------------------------------------
Programmiersprachen:TypeScript, JavaScript (ES6+), Python, SQL, HTML5/CSS3
Frameworks & Libs:  React 18+, Next.js, Node.js, Express.js, TailwindCSS
Datenbanken & Cloud:PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git
Methoden & Tools:   Scrum/Kanban, JIRA, Confluence, TDD (Jest), Clean Code

SPRACHKENNTNISSE
--------------------------------------------------------------------------------
Persisch:           Muttersprache
Englisch:           C1 – Verhandlungssicher in Wort und Schrift (IELTS Academic: 7.5)
Deutsch:            B1 – Fortgeschrittene Kenntnisse (Goethe-Zertifikat B1 vorhanden,
                    B2-Vorbereitung aktiv laufend)

HOBBYS & INTERESSEN
--------------------------------------------------------------------------------
- Mitarbeit an Open-Source-Softwareprojekten
- Ausdauersport (Halbmarathon-Vorbereitung)
- Schachspiel

--------------------------------------------------------------------------------
Berlin / Teheran, den 16. Oktober 2026


________________________________________
Max Mustermann`
  },

  // ---------------------------------------------------------------------------
  // 2. EUROPASS-LEBENSLAUF
  // ---------------------------------------------------------------------------
  {
    id: "europass",
    titleFa: "فرمت یوروپس اتحادیه اروپا (Europass)",
    titleDe: "Europass-Lebenslauf (EU-Standard)",
    subtitleFa: "ساختار واحد اروپایی با ماتریس تفکیکی مهارت‌های زبانی CEFR",
    badge: "مورد تایید رسمی کمیسیون اروپا (EU)",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    accentColor: "#0284c7",
    iconName: "Globe",
    descriptionFa: "فرمت استاندارد رسمی اتحادیه اروپا (طراحی‌شده توسط Cedefop و کمیسیون اروپا) با بلوک‌های متحدالشکل، جدول رسمی سنجش ۵‌گانه زبان طبق چارچوب اروپایی (CEFR) و تفکیک مهارت‌های دیجیتال (DigComp) و ارتباطی.",
    bestForFa: "اپلای در شرکت‌های بین‌المللی چندملیتی، سازمان‌های مردم‌نهاد، دانشگاه‌های اروپایی و فرصت‌های شغلی با زبان کار انگلیسی یا ترکیبی در سراسر حوزه شنگن.",
    recommendedForRoles: [
      "متقاضیان کار در پروژه‌های فرامرزی و شرکت‌های چندملیتی مستقر در آلمان",
      "دانشجویان و متقاضیان دوره‌های Master و کارشناسی ارشد در آلمان",
      "پژوهشگران پروژه‌های تحقیقاتی Horizon Europe و DAAD",
      "کارشناسانی که نیاز به اثبات دقیق مهارت زبان دارند"
    ],
    keyCharacteristicsFa: [
      "هدر رسمی Europass و کد شناسایی مدرک به همراه رنگ‌بندی آبی اروپایی",
      "ماتریس تفصیلی مهارت زبان بر اساس چارچوب CEFR (شنیدار، خواندن، مکالمه دوطرفه، بیان شفاهی، نگارش A1-C2)",
      "بخش ویژه مهارت‌های دیجیتال بر اساس چارچوب اروپایی DigComp",
      "تفکیک مهارت‌های ارتباطی، سازمانی و مدیریتی (Kommunikative & Führungskompetenzen)",
      "شناخته‌شده‌ترین فرمت برای کارفرمایان کشورهای حوزه اتحادیه اروپا"
    ],
    consFa: "به دلیل حجم بالای فیلدهای استاندارد اروپایی، ممکن است تعداد صفحات آن کمی از رزومه فشرده بیشتر شود.",
    layoutType: "europass_grid",
    featureHighlights: [
      { label: "نهاد تدوین‌کننده", value: "کمیسیون اروپا (Cedefop)" },
      { label: "ماتریس زبان", value: "جدول ۵ مهارتی CEFR (A1-C2)" },
      { label: "چارچوب دیجیتال", value: "DigComp استاندارد اتحادیه" },
      { label: "شناخت بین‌المللی", value: "تمامی ۲۷ کشور عضو اتحادیه" }
    ],
    sampleText: `================================================================================
EUROPASS-LEBENSLAUF
Angaben zur Person: Max Mustermann
================================================================================

ANGABEN ZUR PERSON
--------------------------------------------------------------------------------
Vorname / Nachname:     Max Mustermann
Wohnsitz / Anschrift:   Musterstraße 12, 10115 Berlin, Deutschland
                        (Bereit zur Relocation / Blaue Karte EU)
Telefon:                +49 152 0000000
E-Mail:                 mustermann.europass@beispiel.de
Staatsangehörigkeit:    Iranisch
Geburtsdatum:           15.05.1992
Geschlecht:             Männlich

GEWÜNSCHTE BESCHÄFTIGUNG / BERUFLICHES FELD
Senior Full-Stack Web Developer | Software Engineer (React / TypeScript / Node.js)

BERUFSERFAHRUNG
--------------------------------------------------------------------------------
03/2022 – Lfd.          Senior Full-Stack Entwickler
                        Muster IT Innovations GmbH, Berlin / Remote
                        Haupttätigkeiten und Zuständigkeiten:
                        - Entwicklung und Pflege cloudbasierter Web-Applikationen
                        - Architektur moderner Microservices mit Node.js und Docker
                        - Konzeption von Single-Page-Applications (SPA) mit React 18+
                        Tätigkeitssektor: Informationstechnologie / Softwareentwicklung

09/2018 – 02/2022       Softwareentwickler Frontend & APIs
                        Persian Web Solutions LLC, Isfahan
                        Haupttätigkeiten:
                        - Implementierung modularer UI-Designs
                        - Performance-Optimierung und REST-API-Anbindung
                        Tätigkeitssektor: IT-Dienstleistungen

SCHUL- UND BERUFSBILDUNG
--------------------------------------------------------------------------------
09/2014 – 07/2018       Bachelor of Science in Softwaretechnik (Informatik)
                        Amirkabir University of Technology, Teheran
                        - Abschlussnote: 1,8 (Deutsches Äquivalent)
                        - Anerkennung: H+ akkreditiert in der KMK/Anabin-Datenbank
                        - Stufe des EQR: EQR-Niveau 6 (Europäischer Qualifikationsrahmen)

PERSÖNLICHE KOMPETENZEN
--------------------------------------------------------------------------------
MUTTERSPRACHE:          Persisch (Farsi)

WEITERE SPRACHEN:       Gemeinsamer Europäischer Referenzrahmen für Sprachen (GER)
                        VERSTEHEN              SPRECHEN               SCHREIBEN
                        Hören      Lesen       Gespräch   Vortrag     
Englisch                C1         C1          C1         C1          C1
                        (Zertifikat: IELTS Academic Band 7.5)
Deutsch                 B1         B1          B1         B1          B1
                        (Goethe-Zertifikat B1 - Ziel B2 in Vorbereitung)

DIGITALE KOMPETENZEN (DigComp 2.2)
--------------------------------------------------------------------------------
- Informations- und Datenkompetenz: Fortgeschritten (PostgreSQL, MongoDB, Datenmodellierung)
- Kommunikation & Kollaboration: Sehr gut (Git, GitHub Actions, Jira, Confluence, Slack)
- Erstellung digitaler Inhalte: Expertenniveau (TypeScript, React, Node.js, Next.js, REST-APIs)
- Sicherheit: Sicherer Umgang mit OAuth2.0, JWT, Data-Encryption und CORS
- Problemlösung: Umfassende Erfahrung in Profiling, Debugging und Test-Automation (Jest)

ORGANISATORISCHE & SOZIALE KOMPETENZEN
--------------------------------------------------------------------------------
- Teamfähigkeit in multikulturellen und internationalen Teams
- Erfahrung in agiler Teamleitung (Scrum Master Zertifizierung PSM I)
- Hohe Lernbereitschaft und strukturierte Arbeitsweise unter Termindruck

ZUSÄTZLICHE INFORMATIONEN
--------------------------------------------------------------------------------
- Referenzen und Arbeitszeugnisse auf Anfrage verfügbar
- Vollständige ZAB/Anabin-Dokumente liegen digital vor`
  },

  // ---------------------------------------------------------------------------
  // 3. MODERNES IT- & TECH-LAYOUT
  // ---------------------------------------------------------------------------
  {
    id: "modern",
    titleFa: "فرمت مدرن فناوری و IT (Modern Tech)",
    titleDe: "Modernes IT- & Tech-Layout (Zweispaltig)",
    subtitleFa: "طراحی شیک دو ستونه با سایدبار تخصص، خلاصه حرفه‌ای (Kurzprofil) و Tech-Stack",
    badge: "محبوب استارتاپ‌ها و شرکت‌های فناوری",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    accentColor: "#059669",
    iconName: "Sparkles",
    descriptionFa: "چیدمان پویا و چشم‌نواز دو ستونه؛ ستون کناری شامل خلاصه اطلاعات تماس، نوارهای بصری پیشرفت مهارت‌ها و برچسب‌های تخصص است. ستون اصلی با یک خلاصه پرقدرت اجرایی (Kurzprofil) شروع شده و سوابق پروژه‌محور و دستاوردهای عددی را برجسته می‌کند.",
    bestForFa: "استارتاپ‌های پیشرو در برلین و مونیخ، شرکت‌های تکنولوژی (FinTech, SaaS, AI)، تیم‌های اجایل و موقعیت‌های ارشد توسعه نرم‌افزار و مدیریت محصول.",
    recommendedForRoles: [
      "برنامه‌نویسان فرانت‌اند، بک‌اند و فول‌استک",
      "مهندسان DevOps، کلاود و هوش مصنوعی / دیتا",
      "طراحان محصول (Product Designers) و مدیران محصول (Product Managers)",
      "متخصصان شبکه، امنیت سایبری و فناوری اطلاعات"
    ],
    keyCharacteristicsFa: [
      "ستون سایدبار مدرن حاوی آواتار، لینک گیت‌هاب/لینکدین و ارزیابی تصویری مهارت‌ها",
      "بخش خلاصه حرفه‌ای (Kurzprofil / Executive Summary) در ابتدای ستون اصلی با کلمات کلیدی",
      "تمرکز بر دستاوردهای قابل اندازه‌گیری (Metrics) و تگ‌های جعبه‌ابزار فنی (Tech-Stack)",
      "طراحی خلوت و جذاب برای جلب توجه مدیران فنی (Engineering Leads) در ۱۰ ثانیه اول",
      "خوانایی فوق‌العاده برای سیستم‌های غربالگری هوشمند ATS شرکت‌های فناوری"
    ],
    consFa: "ممکن است برای شرکت‌های به شدت سنتی و ادارات رسمی بیش از حد مدرن باشد.",
    layoutType: "modern_sidebar",
    featureHighlights: [
      { label: "سرعت بررسی", value: "اسکن سریع زیر ۱۵ ثانیه" },
      { label: "سایدبار تخصص", value: "نمایش گرافیکی مهارت‌ها" },
      { label: "خلاصه اجرایی", value: "Kurzprofil با کلمات کلیدی" },
      { label: "تگ‌های فناوری", value: "Tech-Stack Chips اختصاصی" }
    ],
    sampleText: `================================================================================
MAX MUSTERMANN | SENIOR FULL-STACK SOFTWARE ENGINEER
Berlin, Deutschland / Teheran | mustermann.dev@beispiel.de | github.com/maxmustermann
================================================================================

KURZPROFIL (EXECUTIVE SUMMARY)
--------------------------------------------------------------------------------
Ergebnisorientierter Full-Stack Entwickler mit über 6 Jahren praktischer Erfahrung
in der Konzeption und Skalierung moderner Web-Applikationen. Spezialisiert auf
React, TypeScript, Node.js und Cloud-native Architekturen. Nachweisbare Erfolge
in der Performancesteigerung datenintensiver Enterprise-Plattformen und Führung
agiler Entwicklerteams. H+ anerkannter Informatik-Abschluss, voll berechtigt zur
Blauen Karte EU mit sofortiger Verfügbarkeit.

KERNKOMPETENZEN (SIDEBAR-ÜBERSICHT)
--------------------------------------------------------------------------------
- Frontend:         React 18, TypeScript, Next.js, Redux Toolkit, TailwindCSS
- Backend:          Node.js, Express, RESTful APIs, GraphQL, Python
- Datastores:       PostgreSQL, Redis, MongoDB, Supabase
- DevOps & Cloud:   Docker, AWS (S3, EC2), CI/CD (GitHub Actions), Linux
- Methoden:         Scrum/Agile, Clean Code Architecture, TDD, CI/CD

BERUFLICHE ERFAHRUNG
--------------------------------------------------------------------------------
03/2022 – HEUTE     SENIOR FULL-STACK ENTWICKLER
                    Muster-IT Technologies GmbH | Berlin / Remote
                    Tech-Stack: React, TypeScript, Node.js, PostgreSQL, Docker, AWS
                    - Neukonzeption des zentralen Kundenportals mit React & Next.js;
                      Steigerung der User-Engagement-Rate um 28%
                    - Refactoring datenbankintensiver REST-APIs; Reduzierung der 
                      Server-Antwortzeiten von 450ms auf 120ms (-73%)
                    - Leitung von Sprint-Plannings und Code-Reviews für ein 5-köpfiges
                      Entwicklerteam; Senkung der Fehlerrate im Release um 40%

09/2018 – 02/2022   WEB ENTWICKLER & SOFTWARE ENGINEER
                    Persian Web Solutions LLC | Isfahan
                    Tech-Stack: JavaScript, React, Express, MySQL, Git
                    - Implementierung responsiver Benutzeroberflächen für E-Commerce-Kunden
                    - Anbindung von Zahlungs-Gateways und Drittanbieter-APIs
                    - Automatisierung von Testläufen mit Jest und Cypress

AUSBILDUNG & ANERKENNUNG
--------------------------------------------------------------------------------
09/2014 – 07/2018   BACHELOR OF SCIENCE (B.SC.) IN INFORMATIK
                    Amirkabir University of Technology (Teheran)
                    - Offizielle Anerkennung: H+ in KMK/Anabin-Datenbank (Volle Gleichwertigkeit)
                    - Gesamtnote: 1,8 (Deutsches Notenäquivalent)

SPRACHEN
--------------------------------------------------------------------------------
- Persisch:         Muttersprache (C2)
- Englisch:         C1 – Verhandlungssicher (IELTS Academic 7.5)
- Deutsch:          B1 – Fließend im Fachgespräch (Goethe-Zertifikat vorhanden)

PROJEKTE & OPEN SOURCE
--------------------------------------------------------------------------------
- Open-Source React Query Manager (GitHub: 1.2k Stars)
- Cloud Architecture Blueprint for High-Traffic E-Commerce (Docker/Postgres)`
  },

  // ---------------------------------------------------------------------------
  // 4. AKADEMISCHER LEBENSLAUF
  // ---------------------------------------------------------------------------
  {
    id: "akademisch",
    titleFa: "فرمت آکادمیک و پژوهشی (Akademischer CV)",
    titleDe: "Akademischer Lebenslauf (Wissenschaft & Forschung)",
    subtitleFa: "ساختار دانشگاهی ویژه دوره‌های دکتری، پژوهشگران و مؤسسات Fraunhofer/Max-Planck",
    badge: "ویژه پوزیشن‌های علمی و دانشگاهی",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    accentColor: "#9333ea",
    iconName: "GraduationCap",
    descriptionFa: "ساختار تخصصی جامعه علمی آلمان که محوریت آن سوابق پژوهشی، زمینه‌های تحقیقاتی (Forschungsschwerpunkte)، جزئیات پایان‌نامه‌های کارشناسی و کارشناسی ارشد به همراه نام استاد راهنما، مقالات ISI و کنفرانسی و بورسیه‌های تحصیلی است.",
    bestForFa: "متقاضیان پذیرش دوره دکتری (Promotion / PhD)، محققان پسادکتری (Postdoc)، محققان مراکز پژوهشی فرانهوفر و ماکس‌پلانک، و مهندسان بخش تحقیق و توسعه (R&D).",
    recommendedForRoles: [
      "متقاضیان دوره‌های دکتری و پژوهشگری در دانشگاه‌های آلمان",
      "مهندسان R&D در صنایع خودروسازی، پزشکی، نانو و الکترونیک آلمان",
      "دانشمندان داده (Data Scientists) و پژوهشگران هوش مصنوعی",
      "اساتید، مدرسان و پژوهشگران بورسیه‌های DAAD و DFG"
    ],
    keyCharacteristicsFa: [
      "بخش ویژه زمینه‌های پژوهشی و علایق علمی (Forschungsschwerpunkte)",
      "تحصیلات آکادمیک با ذکر عنوان دقیق پایان‌نامه (Thema der Abschlussarbeit)، نام استاد راهنما و نمره",
      "فهرست رسمی مقالات معتبر ژورنالی (Peer-Reviewed Publications) و کنفرانس‌ها با استناد استاندارد",
      "سوابق تدریس دانشگاهی (Lehrerfahrung / Tutoring) و هدایت کارگاه‌های علمی",
      "جوایز، گرنت‌های پژوهشی و بورسیه‌های علمی (Stipendien & Auszeichnungen)"
    ],
    consFa: "برای موقعیت‌های تجاری سریع و استارتاپی بیش از حد پژوهش‌محور است.",
    layoutType: "academic_hierarchy",
    featureHighlights: [
      { label: "محور اصلی", value: "پژوهش و مقالات علمی" },
      { label: "جزئیات پایان‌نامه", value: "ذکر استاد راهنما و موضوع" },
      { label: "استاندارد استناد", value: "فرمت IEEE / APA مقالات" },
      { label: "هدف‌گذاری", value: "دانشگاه‌ها و مراکز تحقیقاتی" }
    ],
    sampleText: `================================================================================
CURRICULUM VITAE (WISSENSCHAFTLICHER WERDEGANG)
M.Sc. Max Mustermann | Teheran / Berlin
================================================================================

PERSÖNLICHE DATEN
--------------------------------------------------------------------------------
Name:               Max Mustermann, B.Sc.
Anschrift:          Musterstraße 12, 10115 Berlin, Deutschland / Teheran
E-Mail:             mustermann.science@beispiel.de
Telefon:            +49 152 0000000 / +98 912 345 6789
Geburtsdatum:       15. Mai 1992 in Teheran
Staatsangehörigkeit:Iranisch (Berechtigt zur Forscher-Aufenthaltserlaubnis gem. § 18d AufenthG)

FORSCHUNGSSCHWERPUNKTE (RESEARCH INTERESTS)
--------------------------------------------------------------------------------
- Verteilte Systeme und Cloud-Computing Architekturen
- Algorithmen zur Performance-Optimierung relationaler Datenbanksysteme
- Skalierbare Microservice-Netzwerke und fehlertolerante Systemarchitekturen
- Angewandte Künstliche Intelligenz in der industriellen Prozessautomatisierung

AKADEMISCHE AUSBILDUNG
--------------------------------------------------------------------------------
09/2014 – 07/2018   BACHELOR OF SCIENCE (B.SC.) IN INFORMATIK
                    Amirkabir University of Technology (Tehran Polytechnic)
                    - Gesamtnote: 1,8 (Sehr gut nach deutscher Notenskala)
                    - Thema der Abschlussarbeit: "Optimierung von verteilten Caching-
                      Strategien in hochfrequentierten Enterprise-Websystemen"
                    - Betreuer: Prof. Dr. A. Rezaei (Department of Computer Engineering)
                    - Anabin-Bewertung: Hochschule status H+, Abschluss voll gleichwertig

WISSENSCHAFTLICHE & BERUFLICHE PRAXIS
--------------------------------------------------------------------------------
03/2022 – heute     Senior Software Engineer & Forschungsmitarbeiter
                    Muster-IT Research Lab, Teheran / Remote
                    - Leitung des Forschungs- und Entwicklungsteams für Cloud-Architekturen
                    - Konzeption mathematischer Modelle zur Lastverteilung in Microservices
                    - Verfassung technischer Whitepaper und Patentanmeldungen

09/2018 – 02/2022   Software-Entwickler & Wissenschaftlicher Assistent
                    Center for Advanced Computing Research, Isfahan
                    - Mitwirkung an Forschungsprojekten zur parallelen Datenverarbeitung
                    - Entwicklung von Testumgebungen für Benchmark-Analysen

PUBLIKATIONEN & KONFERENZBEITRÄGE (AUSZUG)
--------------------------------------------------------------------------------
1. Mustermann, M., Rezaei, A. (2023): "Performance Benchmarking of Distributed 
   Cache Algorithms in Cloud-Native Environments". In: International Journal of 
   Computer Systems and Software Engineering, Vol. 14, Nr. 3, S. 112–128. (Peer-Reviewed)
2. Mustermann, M., Alavi, K. (2022): "Latency Reduction in Microservices Architecture 
   Using Reactive Data Pipelines". Vorgetragen auf der IEEE International Conference 
   on Web Services & Cloud Computing (ICWS), Dubai.

LEHRERFAHRUNG (TEACHING EXPERIENCE)
--------------------------------------------------------------------------------
Wintersem. 2017     Lehrassistent (Teaching Assistant) für "Datenstrukturen & Algorithmen"
                    Fakultät für Informatik, Amirkabir University of Technology
                    - Abhaltung wöchentlicher Übungsgruppen (4 SWS, 45 Studierende)
                    - Korrektur von Programmieraufgaben und Klausurvorbereitung

STIPENDIEN & AUSZEICHNUNGEN
--------------------------------------------------------------------------------
2018                Auszeichnung für hervorragende Bachelor-Abschlussarbeit (Top 5%)
2014                Top 0.5% im Nationalen Hochschulaufnahmetest (Konkur) unter 
                    über 200.000 Bewerbern im mathematisch-technischen Zweig

SPRACHEN & MITGLIEDSCHAFTEN
--------------------------------------------------------------------------------
- Sprachen:         Persisch (Muttersprache), Englisch (C1 fließend - IELTS 7.5),
                    Deutsch (B1 - Vorbereitung auf B2/TestDaF)
- Mitgliedschaften: Association for Computing Machinery (ACM), IEEE Computer Society

--------------------------------------------------------------------------------
Berlin / Teheran, den 16. Oktober 2026


________________________________________
Max Mustermann`
  }
];

export function getGermanCvFormatById(id: GermanCvFormatId): GermanCvFormat {
  const found = GERMAN_CV_FORMATS.find(f => f.id === id);
  return found || GERMAN_CV_FORMATS[0];
}
