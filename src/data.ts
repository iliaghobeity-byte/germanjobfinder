import { JobPortal, RecognitionStep } from "./types";

export const visaRoutes = [
  {
    id: "blue-card",
    title: "کارت آبی اتحادیه اروپا (EU Blue Card)",
    subtitle: "مخصوص فارغ‌التحصیلان دانشگاهی با درآمد مشخص",
    description: "بهترین و سریع‌ترین راه مهاجرت کاری برای متخصصینی که پیشنهاد شغلی (Job Offer) با حداقل حقوق تعیین‌شده از سوی دولت آلمان دارند. به مدرک تحصیلی حداقل در سطح کارشناسی نیاز دارد که در سایت Anabin مایل یا معادل داشته باشد.",
    requirements: [
      "قرارداد کاری یا پیشنهاد شغلی معتبر از کارفرمای آلمانی",
      "مدرک دانشگاهی معتبر و ارزیابی شده (معادل آلمانی)",
      "حقوق سالانه ناخالص حداقل (حدود ۴۵,۳۰۰ یورو برای مشاغل عادی و حدود ۴۱,۰۰۰ یورو برای مشاغل کمبود مانند IT و مهندسی در سال ۲۰۲۶)"
    ],
    perks: [
      "امکان دریافت اقامت دائم (Niederlassungserlaubnis) در عرض ۲۱ یا ۲۷ ماه",
      "امکان پیوستن بسیار آسان خانواده بدون نیاز به مدرک زبان همسر",
      "امکان کار در دیگر کشورهای شینگن پس از مدتی"
    ],
    badgeColor: "bg-blue-600 text-white"
  },
  {
    id: "chancenkarte",
    title: "کارت فرصت آلمان (Chancenkarte)",
    subtitle: "جدیدترین سیستم بر پایه امتیازدهی مصوب ۲۰۲۴",
    description: "به شما اجازه می‌دهد بدون نیاز به داشتن جاب آفر از قبل، به مدت یک سال وارد آلمان شوید و به جستجوی کار بپردازید. این کارت بر اساس فاکتورهایی چون زبان، سابقه کار، سن، و ارتباط با آلمان به شما امتیاز می‌دهد.",
    requirements: [
      "نیاز به حداقل ۶ امتیاز از سیستم امتیازدهی تخصصی آلمان",
      "داشتن مدرک زبان آلمانی حداقل A1 یا انگلیسی حداقل B2",
      "مدرک مهارتی دوساله یا مدرک دانشگاهی خارجی تایید شده به همراه معادل‌سازی اولیه",
      "توانایی تامین هزینه‌ها (حدود ۱,۰۲۷ یورو در ماه به صورت تمکن مالی یا کار پاره‌وقت ۲۰ ساعت در هفته)"
    ],
    perks: [
      "ورود به آلمان بدون جاب‌آفر اولیه",
      "امکان ۲۰ ساعت کار آزمایشی یا پاره‌وقت در هفته در طول جستجوی کار اصلی",
      "امکان تمدید کارت پس از پایان دوره یک ساله در صورت پیدا کردن کار مرتبط"
    ],
    badgeColor: "bg-emerald-600 text-white"
  },
  {
    id: "skilled-visa",
    title: "ویزای نیروی متخصص (Skilled Worker Visa)",
    subtitle: "مخصوص مدارک آکادمیک یا فنی حرفه‌ای رسمی",
    description: "برای افرادی مناسب است که مدرک کاردانی یا کارشناسی دارند و به آنها تاییدیه معادل‌سازی کامل (Anerkennungsbescheid) داده شده است، اما حقوق قرارداد آنها به حد نصاب بلوکارت نمی‌رسد.",
    requirements: [
      "داشتن تاییدیه معادل‌سازی کامل در آلمان (Anerkennung)",
      "قرارداد کار مرتبط با رشته تحصیلی از یک شرکت آلمانی",
      "مدرک زبان متناسب با شغل (معمولاً حداقل B1 آلمانی)"
    ],
    perks: [
      "امکان مهاجرت بدون محدودیت سقف سنی (البته بالای ۴۵ سال نیاز به اثبات حقوق بالاتر دارد)",
      "اقامت سریع دائم پس از ۳ سال کار مداوم در آلمان"
    ],
    badgeColor: "bg-purple-600 text-white"
  },
  {
    id: "it-specialist",
    title: "مسیر متخصصین IT بدون مدرک تجربی",
    subtitle: "ورود با داشتن سوابق کار عملی قوی",
    description: "آلمان به برنامه‌نویسان و تحلیل‌گران حوزه‌های فناوری اطلاعات اجازه می‌دهد حتی بدون داشتن مدرک دانشگاهی آکادمیک، صرفاً با داشتن سابقه کار حرفه‌ای قوی برای دریافت ویزای کاری اقدام کنند.",
    requirements: [
      "حداقل ۳ سال سابقه کار عملی و مرتبط در حوزه فناوری اطلاعات در ۵ سال گذشته",
      "پیشنهاد کاری از آلمان با حقوق ناخالص سالانه متناسب",
      "تسلط به زبان انگلیسی حداقل B2 (یا آلمانی متناسب)"
    ],
    perks: [
      "عدم نیاز به مدارک معادل‌سازی دانشگاهی پرهزینه",
      "جذب سریع در بازار کار تشنه فناوری آلمان"
    ],
    badgeColor: "bg-amber-600 text-white"
  }
];

export const jobPortals: JobPortal[] = [
  {
    id: "miga",
    name: "Make it in Germany",
    url: "https://www.make-it-in-germany.com/en/",
    category: "official",
    description: "درگاه رسمی دولت فدرال آلمان برای نیروهای متخصص خارجی. دارای لیست مشاغل معتبر و تایید شده دولتی."
  },
  {
    id: "stepstone",
    name: "StepStone",
    url: "https://www.stepstone.de",
    category: "general",
    description: "یکی از بزرگ‌ترین و معتبرترین پورتال‌های کاریابی در آلمان با تفکیک دقیق فیلترهای استخدامی."
  },
  {
    id: "indeed",
    name: "Indeed Germany",
    url: "https://de.indeed.com",
    category: "general",
    description: "بزرگترین موتور جستجوی کار جهان که تمام آگهی‌های وب‌سایت‌های دیگر و شرکت‌ها را در آلمان یک‌جا جمع می‌کند."
  },
  {
    id: "linkedin",
    name: "LinkedIn (Germany)",
    url: "https://www.linkedin.com/jobs/jobs-in-germany",
    category: "general",
    description: "شبکه حرفه‌ای اجتماعی جهان. برای موقعیت‌های شغلی به زبان انگلیسی (به‌ویژه در حوزه IT و استارتاپ‌ها) بی‌نظیر است."
  },
  {
    id: "monster",
    name: "Monster.de",
    url: "https://www.monster.de",
    category: "general",
    description: "سایت محبوب جستجوی کار که در آلمان سهم بازار فعالی دارد و به متقاضیان امکان بارگذاری مستقیم رزومه را می‌دهد."
  },
  {
    id: "xing",
    name: "XING",
    url: "https://www.xing.com",
    category: "general",
    description: "شبکه شغلی محلی و بسیار محبوب کشورهای آلمانی زبان (آلمان، اتریش، سوئیس) که به نوعی لینکدین بومی محسوب می‌شود."
  },
  {
    id: "arbeitsagentur",
    name: "Agentur für Arbeit",
    url: "https://www.arbeitsagentur.de/en/jobboerse",
    category: "official",
    description: "پورتال آژانس فدرال استخدام آلمان. پایگاه داده عظیمی از تمام موقعیت‌های ثبت شده توسط کارفرمایان بومی."
  },
  {
    id: "honeypot",
    name: "Honeypot.io",
    url: "https://www.honeypot.io",
    category: "it",
    description: "پلتفرم معکوس مخصوص برنامه نویسان و متخصصان IT. در این سایت شرکت‌ها برای استخدام به شما رزومه و آفر می‌دهند!"
  },
  {
    id: "relocate",
    name: "Relocate.me",
    url: "https://relocate.me/search?country=germany",
    category: "it",
    description: "سایت تخصصی برای مشاغلی که بسته حمایتی جابجایی (Relocation Package) و اسپانسرشیپ ویزا برای آلمان ارائه می‌دهند."
  }
];

export const recognitionSteps: RecognitionStep[] = [
  {
    id: 1,
    title: "بررسی وضعیت در سامانه آنابین (Anabin Database)",
    duration: "۱ الی ۳ روز (شخصی)",
    cost: "رایگان",
    description: "اولین کار، چک کردن دانشگاه در آنابین است. اگر دانشگاه شما وضعیت H+ داشته باشد و رشته شما در آن دانشگاه ثبت شده باشد، نیاز به تاییدیه گران‌قیمت ندارید و کافیست از صفحات پرینت بگیرید. در غیر این صورت باید تاییدیه تکمیلی بگیرید.",
    actionUrl: "https://anabin.kmk.org/anabin.html"
  },
  {
    id: 2,
    title: "تاییدیه ارزیابی مدارک توسط ZAB (Zentralstelle für ausländisches Bildungswesen)",
    duration: "۳ الی ۴ ماه",
    cost: "۲۰۰ یورو (مدرک اول) + ۱۰۰ یورو (مدارک بعدی)",
    description: "اگر دانشگاه یا رشته شما در آنابین فاقد تایید کامل باشد، باید مدارک تحصیلی و ریز نمرات را به همراه فیش پرداختی برای سازمان دولتی ZAB آلمان ارسال کنید تا بیانیه رسمی معادل‌سازی (Zeugnisbewertung) برای شما صادر کنند.",
    actionUrl: "https://www.kmk.org/zab/zeugnisbewertung.html"
  },
  {
    id: 3,
    title: "تاییدیه رسمی برای مشاغل نظام‌مند (Anerkennungsbescheid)",
    duration: "۳ الی ۶ ماه",
    cost: "۲۰۰ الی ۶۰۰ یورو",
    description: "برای مشاغلی نظیر کادر درمان (پرستاران، پزشکان)، مهندسین ناظر عمران، معلمان گواهینامه معادل‌سازی حرفه‌ای بومی (Anerkennung) صددرصد اجباری است و مراجع استانی آلمان باید آن را ارزیابی و صادر کنند.",
    actionUrl: "https://www.anerkennung-in-deutschland.de/html/en/index.php"
  },
  {
    id: 4,
    title: "آماده‌سازی مدارک تمکن مالی یا حساب مسدود شده (Sperrkonto / Blocked Account)",
    duration: "۱ الی ۲ هفته",
    cost: "بسته به نوع ویزا (کارت فرصت: ~۱۲,۳۲۴ یورو سالانه)",
    description: "در صورت مهاجرت از روش‌های بدون جاب‌آفر مانند جستجوی کار یا کارت فرصت، باید گواهی تمکن مالی در حساب ارزی معادل هزینه‌های سالیانه زندگی در آلمان ارائه دهید.",
  },
  {
    id: 5,
    title: "رزرو وقت و تحویل مدارک به کارگزاری رسمی سفارت آلمان در ایران (TLScontact)",
    duration: "بسته به تاییدیه Fast-Track (۲ الی ۶ هفته)",
    cost: "۷۵ یورو کارمزد سفارت + تعرفه خدمات کارگزاری",
    description: "تحویل فیزیکی کلیه مدارک ترجمه‌شده، ثبت بیومتریک و انگشت‌نگاری در مرکز رسمی کارگزاری TLScontact تهران جهت صدور روادید توسط کنسولگری آلمان.",
    actionUrl: "https://visas-de.tlscontact.com/visa/ir/irTHR2de/home"
  }
];

export const sampleLebenslauf = `
Max Mustermann
Anschrift: Teheran, Iran | E-Mail: mustermann@example.com | Tel: +98 912 345 6789

--------------------------------------------------
BERUFLICHER WERDEGANG
--------------------------------------------------
03/2021 - lfd.       Softwareentwickler (Mitte/Senior)
                     Muster-IT Systems Co., Teheran
                     - Entwicklung von Webanwendungen mit React und Node.js
                     - Optimierung der PostgreSQL-Datenbanken (30% Performance-Gewinn)
                     - Führung eines kleinen Teams von 3 Junior-Entwicklern

09/2018 - 02/2021    Junior Web Developer
                     Persian Web Solutions LLC, Isfahan
                     - Erstellung responsiver Benutzeroberflächen mit HTML, CSS, JavaScript
                     - Fehlerbehebung und API-Integrationen

--------------------------------------------------
SCHUL- UND BERUFSBILDUNG
--------------------------------------------------
09/2014 - 07/2018    Bachelor of Science (B.Sc.) in Software Engineering
                     Amirkabir University of Technology, Teheran
                     (Anabin Status: H+ / Äquivalenz vorhanden)

--------------------------------------------------
FACHKENNTNISSE & SKILLS
--------------------------------------------------
- Programmiersprachen: JavaScript, TypeScript, Python
- Frameworks & Bibliotheken: React, Node.js (Express), Django
- Datenbanken: PostgreSQL, MongoDB, Redis
- Tools: Git, Docker, JIRA, Agile/Scrum

--------------------------------------------------
SPRACHKENNTNISSE
--------------------------------------------------
- Persisch: Muttersprache
- Englisch: Fließend (C1 - IELTS 7.5)
- Deutsch: Fortgeschrittene Kenntnisse (B1 - Goethe-Zertifikat)
`.trim();

export const sampleAnschreiben = `
Max Mustermann
Teheran, Iran
Tel: +98 912 345 6789
E-Mail: mustermann@example.com

Musterfirme AG
Personalabteilung
Musterstraße 123
10115 Berlin, Deutschland

Teheran, den 20. Juni 2026

Bewerbung als Softwareentwickler (m/w/d)
Referenznummer: Webdev-2026

Sehr geehrte Damen und Herren,

mit großem Interesse habe ich Ihre Stellenausschreibung auf dem Portal "Make-it-in-Germany" gelesen. Da mein Profil als erfahrener React- und Node.js Entwickler perfekt zu Ihren Anforderungen passt, bewerbe ich mich hiermit um die ausgeschriebene Position.

In den letzten fünf Jahren habe ich in führenden IT-Unternehmen komplexe Web-Plattformen entwickelt. Zu meinen Hauptaufgaben gehörten die Gestaltung skalierbarer Frontend-Architekturen mit React sowie die Integration moderner RESTful-APIs. Durch meine strukturierte Arbeitsweise konnte ich die Ladezeiten einer unserer Hauptanwendungen um 30% reduzieren. 

Ich habe mein Studium der Informatik an einer in Deutschland anerkannten Universität (Anabin-Status H+) erfolgreich abgeschlossen. Da ich Deutsch bereits auf dem B1-Niveau beherrsche und mich derzeit aktiv auf das B2-Zertifikat vorbereite, bin ich zuversichtlich, mich schnell in Ihr Team integrieren zu können.

Ein Umzug nach Deutschland ist für mich kurzfristig realisierbar, da ich alle Voraussetzungen für die Erteilung der "Blaue Karte EU" erfülle. Über die Möglichkeit, mich Ihnen in einem persönlichen Gespräch vorzustellen, freue ich mich sehr.

Mit freundlichen Grüßen,

Max Mustermann
`.trim();
