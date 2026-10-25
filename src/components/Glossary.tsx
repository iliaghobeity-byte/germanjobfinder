import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  BookA,
  BookOpen,
  Volume2,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info,
  Filter,
  Layers,
  ArrowUpRight,
  FileText,
  Building,
  GraduationCap,
  Briefcase,
  Landmark,
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from "lucide-react";

export type GlossaryCategory = 
  | "all"
  | "visa_residence"
  | "degrees_recognition"
  | "labor_contracts"
  | "taxes_settlement";

export interface GlossaryTerm {
  id: string;
  german: string;
  article?: "der" | "die" | "das" | "pl." | "";
  pronunciationFa: string;
  persianTitle: string;
  englishTitle: string;
  category: "visa_residence" | "degrees_recognition" | "labor_contracts" | "taxes_settlement";
  categoryLabelFa: string;
  legalBasis?: string;
  shortDefinition: string;
  detailedExplanation: string;
  practicalTip: string;
  commonMistake?: string;
  tags: string[];
  isNew2026Law?: boolean;
  importance: "essential" | "high" | "standard";
  relatedTab?: string;
  relatedTabLabel?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // --- 1. اقامت و ویزا (visa_residence) ---
  {
    id: "blaue-karte-eu",
    german: "die Blaue Karte EU",
    article: "die",
    pronunciationFa: "دی بْلاوئه کارْته اِ-او",
    persianTitle: "کارت آبی اتحادیه اروپا (بلوکارت)",
    englishTitle: "EU Blue Card",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "§ 18g AufenthG",
    shortDefinition: "مجوز اقامت کاری معتبر برای فارغ‌التحصیلان دانشگاهی و متخصصان IT با حقوق بالاتر از کف قانونی مشخص.",
    detailedExplanation: "بلوکارت برترین مجوز اقامت کاری آلمان است. طبق اصلاحات ۲۰۲۶، حداقل حقوق سالانه به ۴۵,۳۰۰ یورو (و برای رشته‌های کمبود MINT، سلامت و فارغ‌التحصیلان جدید به ۴۱,۰۴۱ یورو) کاهش یافته است. دارندگان بلوکارت می‌توانند پس از ۲۱ ماه (با مدرک B1 آلمانی) یا ۲۷ ماه (با مدرک A1) اقامت دائم (Niederlassungserlaubnis) دریافت کنند. همچنین همسر دارنده بلوکارت بدون نیاز به مدرک زبان آلمانی حق کار نامحدود دریافت می‌کند.",
    practicalTip: "متخصصان IT دارای ۳ سال سابقه کار حتی بدون داشتن مدرک دانشگاهی رسمی می‌توانند با شرط دریافت کف حقوق معین بلوکارت دریافت نمایند.",
    commonMistake: "اشتباه رایج: تصور اینکه برای بلوکارت الزاما نیاز به مدرک زبان آلمانی دارید؛ در صورتی که قرارداد به زبان انگلیسی و با حقوق استاندارد باشد، سفارت مدرک زبان آلمانی مطالبه نمی‌کند.",
    tags: ["اقامت دائم", "کارت آبی", "حقوق قانونی", "MINT", "IT", "همسر"],
    isNew2026Law: true,
    importance: "essential",
    relatedTab: "advanced-jobs",
    relatedTabLabel: "مشاغل بلوکارت"
  },
  {
    id: "chancenkarte",
    german: "die Chancenkarte",
    article: "die",
    pronunciationFa: "دی شانْسِن‌کارْته",
    persianTitle: "کارت فرصت جستجوی کار آلمان",
    englishTitle: "Opportunity Card",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "§ 20a AufenthG",
    shortDefinition: "ویزای سیستم امتیازدهی جدید جهت ورود قانونی به آلمان برای جستجوی کار به مدت حداکثر یک سال.",
    detailedExplanation: "کارت فرصت بر پایه سیستم امتیازدهی (حداقل ۶ امتیاز از ۱۴ امتیاز) عمل می‌کند. متقاضیان باید حداقل مدرک زبان A1 آلمانی یا B2 انگلیسی و حداقل دو سال آموزش دانشگاهی یا حرفه‌ای مورد تایید دولت کشور مبدا داشته باشند. امتیازها بر اساس سن، تسلط بر زبان، سابقه کار، انطباق رشته، امتیاز همسر و اقامت قبلی در آلمان محاسبه می‌شود. دارنده کارت فرصت می‌تواند تا ۲۰ ساعت در هفته کار پاره‌وقت دانشجویی یا دو هفته کار آزمایشی (Probearbeit) انجام دهد.",
    practicalTip: "بزرگترین مزیت کارت فرصت این است که برخلاف ویزای سنتی جستجوی کار، به شما اجازه اشتغال تا ۲۰ ساعت در هفته (Part-time) برای تامین هزینه‌های زندگی را می‌دهد.",
    commonMistake: "ثبت‌نام بدون داشتن تمکن مالی یا بلاک‌اکانت؛ با وجود سیستم امتیازی، اثبات تمکن مالی حدود ۱,۰۲۷ یورو در ماه برای مدت اقامت الزامی است.",
    tags: ["کارت فرصت", "امتیازدهی", "جستجوی کار", "کار پاره‌وقت", "۲۰۲۶"],
    isNew2026Law: true,
    importance: "essential",
    relatedTab: "chancenkarte",
    relatedTabLabel: "محاسبه‌گر امتیاز کارت فرصت"
  },
  {
    id: "fachkraft",
    german: "die Fachkraft",
    article: "die",
    pronunciationFa: "دی فاخْ‌کْرافْت",
    persianTitle: "نیروی متخصص (ماهر)",
    englishTitle: "Qualified Skilled Worker",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "§ 18a / § 18b AufenthG",
    shortDefinition: "شخصی که دارای مدرک دانشگاهی شناخته‌شده (Fachkraft mit akademischer Ausbildung) یا مدرک آموزش حرفه‌ای رسمی (Fachkraft mit Berufsausbildung) است.",
    detailedExplanation: "تعریف حقوقی «Fachkraft» ستون فقرات قانون مهاجرت متخصصان (FEG) است. به محض اینکه فردی به عنوان Fachkraft شناخته شود، محدودیت‌های سفت‌وسخت گذشته در خصوص انطباق ۱۰۰٪ دقیق مدرک با شغل از بین رفته و شخص می‌تواند در هر زمینه تخصصی مرتبط با مدرک تحصیلی خود اشتغال داشته باشد.",
    practicalTip: "اگر مدرک لیسانس شما کامپیوتر است و پیشنهاد کاری بازاریابی دیجیتال دارید، به عنوان Fachkraft واجد شرایط ویزای کاری هستید.",
    commonMistake: "خلط میان کارگر عمومی (Hilfskraft) و نیروی متخصص؛ کارفرمایان برای اعطای ویزا باید پست را در رده Fachkraft تعریف کنند.",
    tags: ["نیروی کار ماهر", "تخصص", "ویزای کاری", "FEG"],
    importance: "essential"
  },
  {
    id: "vorabzustimmung",
    german: "die Vorabzustimmung",
    article: "die",
    pronunciationFa: "دی فورْآپْ‌تْسوشْتیمونگ",
    persianTitle: "موافقت‌نامه اولیه اداره کار فدرال",
    englishTitle: "Pre-approval of Federal Employment Agency",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "§ 36 BeschV / § 81a AufenthG",
    shortDefinition: "تاییدیه رسمی صادر شده توسط اداره کار فدرال (ZAV/Bundesagentur für Arbeit) پیش از صدور ویزا در سفارت.",
    detailedExplanation: "سفارت آلمان قبل از صدور هرگونه ویزای کاری، باید از اداره کار فدرال استعلام صلاحیت شغلی و حقوقی کند. کارفرما می‌تواند این تاییدیه را مستقیماً در آلمان از طریق پورتال اداره کار یا اداره مهاجرت دریافت کرده و اصل فایل را برای متقاضی ارسال کند. داشتن Vorabzustimmung زمان مصاحبه تا صدور ویزای سفارت تهران را از چند ماه به چند روز کاهش می‌دهد.",
    practicalTip: "همواره از کارفرمای آلمانی خود بخواهید قبل از وقت سفارت، از طریق اداره کار محلی تقاضای Vorabzustimmung دهد تا پروسه ویزا با سرعت فوق‌العاده طی شود.",
    commonMistake: "فکر کردن به اینکه Vorabzustimmung خود به تنهایی ویزا است؛ این مدرک پیش‌تاییدیه است و باید به همراه سایر مدارک به سفارت تحویل شود.",
    tags: ["اداره کار", "تسریع ویزا", "سفارت تهران", "ZAV"],
    importance: "high"
  },
  {
    id: "beschleunigtes-fachkraefteverfahren",
    german: "das beschleunigte Fachkräfteverfahren",
    article: "das",
    pronunciationFa: "داس بِشْلوینیگْته فاخْ‌کْرِفْته‌فِرفارِن",
    persianTitle: "فرآیند تسریع‌شده جذب نیروی متخصص (§81a)",
    englishTitle: "Accelerated Procedure for Skilled Workers",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "§ 81a AufenthG",
    shortDefinition: "ماده قانونی که به کارفرمای آلمانی اجازه می‌دهد با پرداخت هزینه دولتی ۴۱۱ یورو، کلیه مراحل معادل‌سازی و وقت سفارت را در چند هفته هماهنگ کند.",
    detailedExplanation: "بر اساس بند 81a قانون اقامت، کارفرما با داشتن وکالت‌نامه از شما به اداره اتباع خارجی (Ausländerbehörde) مراجعه می‌کند. اداره اتباع خارجی موظف است حداکثر ظرف ۲ ماه معادل‌سازی مدارک و تاییدیه اداره کار را اخذ نموده و سفارت تهران را موظف کند حداکثر ظرف ۳ هفته وقت مصاحبه اختصاصی برای متقاضی رزرو نماید.",
    practicalTip: "بسیاری از شرکت‌های متوسط (Mittelstand) از این قانون بی‌اطلاع هستند؛ شما می‌توانید در جلسات مصاحبه پیشنهاد دهید که فرآیند §81a را آغاز کنند.",
    commonMistake: "تلاش متقاضی برای ثبت این درخواست؛ تنها کارفرمای آلمانی مستقر در آلمان حق اقدام برای این پرونده را دارد.",
    tags: ["تسریع ویزا", "وقت سفارت", "کارفرما", "بند 81a"],
    importance: "high"
  },
  {
    id: "niederlassungserlaubnis",
    german: "die Niederlassungserlaubnis",
    article: "die",
    pronunciationFa: "دی نیدرلاسونگْس‌اِرلائوبنیس",
    persianTitle: "مجوز اقامت دائم نامحدود آلمان",
    englishTitle: "Permanent Settlement Permit",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "§ 18c / § 9 AufenthG",
    shortDefinition: "اقامت دائمی بدون تاریخ انقضا و بدون وابستگی به کارفرما که حق سکونت و اشتغال آزاد در کل خاک آلمان را تضمین می‌کند.",
    detailedExplanation: "دارندگان بلوکارت با ۲۱ ماه پرداخت بیمه بازنشستگی و مدرک B1 (یا ۲۷ ماه با A1) و فارغ‌التحصیلان دانشگاه‌های آلمان پس از ۲ سال کار تخصصی می‌توانند این مجوز را دریافت کنند. برای سایر نیروهای ماهر Fachkraft این زمان به ۳ سال کاهش یافته است.",
    practicalTip: "اقامت دائم نیاز به اثبات عدم سوءپیشینه و آزمون زندگی در آلمان (Leben in Deutschland) دارد.",
    commonMistake: "ترک آلمان به مدت بیش از ۶ ماه بدون اطلاع قبلی اداره اتباع خارجی که می‌تواند باعث باطل شدن اقامت دائم گردد.",
    tags: ["اقامت دائم", "بلوکارت", "پاسپورت", "بیمه بازنشستگی"],
    importance: "essential"
  },
  {
    id: "einbuergerung",
    german: "die Einbürgerung",
    article: "die",
    pronunciationFa: "دی آین‌بورْگِرونگ",
    persianTitle: "اخذ تابعیت و پاسپورت آلمانی (شهروندی)",
    englishTitle: "Naturalization / German Citizenship",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "StAG (Staatsangehörigkeitsgesetz)",
    shortDefinition: "فرآیند قانونی دریافت گذرنامه آلمانی و تابعیت کشور فدرال آلمان.",
    detailedExplanation: "بر اساس قانون جدید تابعیت (لازم‌الاجرا از ۲۰۲۴ و تثبیت در ۲۰۲۶)، زمان انتظار عمومی از ۸ سال به ۵ سال کاهش یافته است. همچنین در صورت دستاوردهای برجسته شغلی یا تحصیلی و سطح زبان C1 آلمانی، این زمان به ۳ سال کاهش می‌یابد. علاوه بر این، آلمان تابعیت مضاعف (دوتابعیتی) را به طور کامل به رسمیت شناخته و دیگر نیازی به سلب تابعیت ایرانی نیست.",
    practicalTip: "پاسپورت اول خود را حفظ خواهید کرد؛ آلمان قانون انصراف از تابعیت قبلی را لغو کرده است.",
    commonMistake: "دریافت کمک‌هزینه بیکاری Burgergeld یا کمک‌های دولتی غیربیمه‌ای که مانع قطعی اخذ شهروندی است.",
    tags: ["تابعیت", "پاسپورت آلمان", "دوتابعیتی", "قانون جدید ۲۰۲۶"],
    isNew2026Law: true,
    importance: "high"
  },
  {
    id: "fiktionsbescheinigung",
    german: "die Fiktionsbescheinigung",
    article: "die",
    pronunciationFa: "دی فیکْتْسیونْس‌بِشاینگونگ",
    persianTitle: "برگه اقامت موقت انتقالی",
    englishTitle: "Fictitious / Interim Residence Certificate",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "§ 81 Abs. 4 AufenthG",
    shortDefinition: "گواهی موقتی که در زمان بررسی تمدید یا تبدیل ویزا صادر می‌شود و اقامت قانونی شما را معتبر نگه می‌دارد.",
    detailedExplanation: "زمانی که اعتبار ویزای شما رو به پایان است اما کارت اقامت جدید هنوز صادر نشده، اداره اتباع خارجی این برگه را صادر می‌کند. اگر بند ۴ ماده ۸۱ در آن تیک خورده باشد، تمام حقوق ویزای قبلی شامل حق کار و سفر خارجی به قوت خود باقی است.",
    practicalTip: "هنگام مسافرت به خارج از منطقه شنگن، مطمئن شوید Fiktionsbescheinigung شما بر اساس §81 Abs. 4 صادر شده باشد تا در بازگشت به فرودگاه دچار مشکل نشوید.",
    commonMistake: "سفر با برگه صادر شده بر اساس §81 Abs. 3 که فقط اجازه ماندن در داخل آلمان را می‌دهد و اجازه ورود مجدد را تضمین نمی‌کند.",
    tags: ["تمدید اقامت", "سفر خارجی", "اداره اتباع خارجی"],
    importance: "standard"
  },
  {
    id: "sperrkonto",
    german: "das Sperrkonto",
    article: "das",
    pronunciationFa: "داس شْپِرْکُنْتو",
    persianTitle: "حساب بانکی مسدودشده (بلاک‌اکانت)",
    englishTitle: "Blocked Bank Account",
    category: "visa_residence",
    categoryLabelFa: "اقامت و ویزا",
    legalBasis: "AufenthG Finanzierungsnachweis",
    shortDefinition: "حساب بانکی ویژه در موسسات مورد تایید آلمان (مانند Fintiba یا Expatrio) برای اثبات تمکن مالی ویزا.",
    detailedExplanation: "متقاضیان ویزای جستجوی کار، دانشجویی و کارت فرصت باید کل مبلغ مورد نیاز یک سال زندگی را در این حساب واریز کنند. پس از ورود به آلمان و ثبت آدرس، ماهانه مبلغ ثابتی (حدود ۱,۰۲۷ یورو) به حساب جاری شما آزاد می‌شود تا هزینه زندگی را تامین کنید.",
    practicalTip: "برای متقاضیانی که جاب‌آفر با حقوق کافی دارند، نیازی به افتتاح حساب بلاک‌شده نیست؛ قرارداد کاری جایگزین آن است.",
    commonMistake: "واریز مبلغ کمتر از نرخ تورم روز آلمان که منجر به ریجکتی یا درخواست کسر مدارک سفارت می‌شود.",
    tags: ["تمکن مالی", "بلاک اکانت", "سفارت", "هزینه زندگی"],
    importance: "essential"
  },

  // --- 2. ارزشیابی مدارک و امور دانشگاهی (degrees_recognition) ---
  {
    id: "anerkennung",
    german: "die Anerkennung",
    article: "die",
    pronunciationFa: "دی آن‌اِرْکِنونگ",
    persianTitle: "به‌رسمیت‌شناختن و معادل‌سازی مدارک",
    englishTitle: "Recognition of Foreign Qualifications",
    category: "degrees_recognition",
    categoryLabelFa: "مدارک و ارزشیابی",
    legalBasis: "BQFG (قانون ارزیابی صلاحیت‌های شغلی)",
    shortDefinition: "فرآیند تطبیق و مقایسه مدرک تحصیلی یا فنی شما با استاندارد مرجع سیستم آموزش آلمان.",
    detailedExplanation: "در آلمان مشاغل به دو دسته Reglementiert (نیازمند مجوز مانند پزشک، داروساز، پرستار، مهندس ناظر) و Nicht reglementiert (آزاد مانند برنامه‌نویس، متخصص بازاریابی، حسابدار) تقسیم می‌شوند. برای مشاغل آزاد ارزیابی تطبیقی ZAB یا آنابین کافی است، اما برای مشاغل قانون‌مند معادل‌سازی کامل (Vollwertige Anerkennung) الزامی است.",
    practicalTip: "پورتال رسمی دولت آلمان www.anerkennung-in-deutschland.de مرجع اصلی برای یافتن مرجع ذی‌صلاح پرونده شماست.",
    commonMistake: "شروع مصاحبه‌های درمانی قبل از دریافت تاییدیه اولیه مدارک پزشکی و زبان آلمانی B2 Pflege یا C1 Medizin.",
    tags: ["معادل‌سازی", "آنابین", "ZAB", "مشاغل درمان"],
    importance: "essential",
    relatedTab: "portals",
    relatedTabLabel: "پورتال تایید مدارک و آنابین"
  },
  {
    id: "zab",
    german: "die ZAB (Zentralstelle für ausländisches Bildungswesen)",
    article: "die",
    pronunciationFa: "دی تسِت‌آبه",
    persianTitle: "دفتر مرکزی سنجش آموزش‌های خارجی در بن",
    englishTitle: "Central Office for Foreign Education",
    category: "degrees_recognition",
    categoryLabelFa: "مدارک و ارزشیابی",
    legalBasis: "KMK - ZAB Bonn",
    shortDefinition: "نهاد رسمی وابسته به کنفرانس وزرای آموزش آلمان که گواهی مقایسه‌پذیری مدارک دانشگاهی (Zeugnisbewertung) را صادر می‌کند.",
    detailedExplanation: "اگر دانشگاه یا رشته شما در سامانه آنابین با وضعیت H+/- یا ناشناخته باشد، کارشناسان ZAB پرونده شما را ارزیابی کرده و اعلام می‌کنند که آیا مدرک شما معادل کارشناسی، ارشد یا دکتری در آلمان هست یا خیر. هزینه این ارزیابی حدود ۲۰۰ یورو است.",
    practicalTip: "اگر دانشگاه شما در آنابین با وضعیت قطعی H+ ثبت شده و رشته تحصیلی دقیقاً معادل دارد، معمولاً نیازی به هزینه جداگانه ZAB نیست و پرینت آنابین برای سفارت کافی است.",
    commonMistake: "ارسال مدارک بدون مهر دادگستری و وزارت خارجه یا بدون ترجمه رسمی به زبان آلمانی.",
    tags: ["ZAB", "ارزشیابی تحصیلی", "دانشگاه", "بن"],
    importance: "essential",
    relatedTab: "portals",
    relatedTabLabel: "استعلام آنابین و ZAB"
  },
  {
    id: "anabin",
    german: "die Anabin-Datenbank",
    article: "die",
    pronunciationFa: "دی آنابین داتِن‌بانْک",
    persianTitle: "پایگاه داده آنابین (سامانه جامع ارزیابی KMK)",
    englishTitle: "Anabin Database",
    category: "degrees_recognition",
    categoryLabelFa: "مدارک و ارزشیابی",
    legalBasis: "KMK Anabin",
    shortDefinition: "بانک اطلاعاتی اینترنتی دولت فدرال برای استعلام وضعیت اعتبار دانشگاه‌ها و رشته‌های خارجی.",
    detailedExplanation: "در این سامانه دانشگاه‌ها با سه برچسب مشخص می‌شوند: H+ (دانشگاه معتبر و مورد تایید قطعی آلمان)، H- (دانشگاه غیرمعتبر)، و H+/- (دانشگاهی که برخی دوره‌ها یا پردیس‌های آن نیاز به ارزیابی جداگانه دارد). داشتن پرینت H+ دانشگاه و عنوان رشته برای سفارت آلمان الزامی است.",
    practicalTip: "حتماً پرینت هر دو بخش «دانشگاه (Institution)» و «رشته فارغ‌التحصیلی (Abschluss)» را از سایت anabin.kmk.org به عنوان پیوست پرونده چاپ کنید.",
    commonMistake: "چاپ فقط صفحه نام دانشگاه بدون تطبیق عنوان مدرک تحصیلی.",
    tags: ["آنابین", "H+", "دانشگاه معتبر", "سفارت آلمان"],
    importance: "essential",
    relatedTab: "portals",
    relatedTabLabel: "راهنمای استعلام آنابین"
  },
  {
    id: "defizitbescheid",
    german: "der Defizitbescheid",
    article: "der",
    pronunciationFa: "دِر دِفیتْسیت‌بِشاید",
    persianTitle: "برگه اعلام کسری و معادل‌سازی نسبی",
    englishTitle: "Deficit Notice / Partial Recognition",
    category: "degrees_recognition",
    categoryLabelFa: "مدارک و ارزشیابی",
    legalBasis: "§ 16d AufenthG",
    shortDefinition: "نامه‌ای رسمی از اداره معادل‌سازی که نشان می‌دهد مدرک شما تا حدودی معادل است اما سرفصل‌هایی کمبود دارد.",
    detailedExplanation: "این برگه پایان راه نیست، بلکه کلید ورود شما به آلمان برای جبران کسری است. بر اساس ویزای ماده 16d، می‌توانید با داشتن برگه Defizitbescheid وارد آلمان شده و در دوره‌های تطبیقی (Anpassungslehrgang) یا کارآموزی ثبت‌نام کنید تا کسری ساعات بالینی یا تئوری را پر کنید.",
    practicalTip: "بسیاری از بیمارستان‌ها و مراکز درمانی هزینه‌های این دوره تطبیقی را متقبل شده و حقوق ماهانه نیز به متقاضی پرداخت می‌کنند.",
    commonMistake: "ناامید شدن و تلقی این برگه به عنوان رد پرونده؛ این برگه پیش‌نیاز قانونی ویزای ماده 16d است.",
    tags: ["کسری مدرک", "دوره تطبیقی", "پرستاری", "ماده 16d"],
    importance: "high"
  },
  {
    id: "approbation",
    german: "die Approbation",
    article: "die",
    pronunciationFa: "دی آپْروباتیون",
    persianTitle: "پروانه نامحدود طبابت و داروسازی در آلمان",
    englishTitle: "Full Medical License to Practice",
    category: "degrees_recognition",
    categoryLabelFa: "مدارک و ارزشیابی",
    legalBasis: "Bundesärzteordnung (BÄO)",
    shortDefinition: "مجوز رسمی دولتی که به پزشک، دندان‌پزشک یا داروساز حق طبابت مستقل و نامحدود در آلمان را اعطا می‌کند.",
    detailedExplanation: "پزشکان ایرانی ابتدا مجوز موقت (Berufserlaubnis) دریافت می‌کنند و پس از گذراندن آزمون Fachsprachenprüfung (C1 پزشکی) و آزمون جامع شناخت صلاحیت علمی (Kenntnisprüfung)، آپروباسیون قطعی دریافت می‌نمایند.",
    practicalTip: "انتخاب ایالت بسیار حیاتی است؛ برخی ایالت‌ها مانند نوردراین-وستفالن یا بادن-وورتمبرگ ظرفیت‌های برگزاری سریع‌تر آزمون دارند.",
    commonMistake: "شروع کار طبابت بدون داشتن مجوز Berufserlaubnis یا Approbation که پیگرد قانونی سنگین دارد.",
    tags: ["پزشکی", "دندانپزشکی", "آزمون زبان تخصصی", "مجوز طبابت"],
    importance: "high"
  },
  {
    id: "berufsausbildung",
    german: "die Berufsausbildung (Ausbildung)",
    article: "die",
    pronunciationFa: "دی بِروفْس‌آوس‌بیلدونگ",
    persianTitle: "آموزش حرفه‌ای و کارآموزی دوگانه (آوسبیلدونگ)",
    englishTitle: "Vocational Training / Dual Apprenticeship",
    category: "degrees_recognition",
    categoryLabelFa: "مدارک و ارزشیابی",
    legalBasis: "BBiG (Berufsbildungsgesetz)",
    shortDefinition: "سیستم آموزش فنی-کاربردی ۲ تا ۳.۵ ساله که هم‌زمان شامل کار عملی حقوق‌بگیر در شرکت و تحصیل تئوری در مدرسه فنی (Berufsschule) است.",
    detailedExplanation: "آوسبیلدونگ برای متقاضیان دیپلم یا کسانی که می‌خواهند رشته جدیدی را در محیط کار واقعی یاد بگیرند ایده‌آل است. متقاضی از روز اول حقوق ماهانه (حدود ۹۰۰ تا ۱,۴۰۰ یورو) دریافت می‌کند و پس از فارغ‌التحصیلی شانس استخدام مستقیم بالای ۹۰٪ دارد.",
    practicalTip: "سطح زبان آلمانی حداقل B1 تا B2 برای قبولی در مصاحبه آوسبیلدونگ و درک درس‌های مدرسه فنی کاملاً الزامی است.",
    commonMistake: "اقدام برای آوسبیلدونگ بدون مدرک زبان آلمانی رسمی؛ این دوره‌ها به هیچ عنوان به زبان انگلیسی برگزار نمی‌شوند.",
    tags: ["آوسبیلدونگ", "کارآموزی", "حقوق ماهانه", "فنی و حرفه‌ای"],
    importance: "high"
  },

  // --- 3. حقوق کار و قرارداد استخدامی (labor_contracts) ---
  {
    id: "arbeitsvertrag",
    german: "der Arbeitsvertrag",
    article: "der",
    pronunciationFa: "دِر آرْبایتْس‌فرتْراگ",
    persianTitle: "قرارداد کاری رسمی و مکتوب",
    englishTitle: "Employment Contract",
    category: "labor_contracts",
    categoryLabelFa: "حقوق کار و قرارداد",
    legalBasis: "§ 611a BGB / NachwG",
    shortDefinition: "سند حقوقی لازم‌الاجرا میان کارمند و کارفرما که شرح وظایف، ساعت کاری، حقوق ناخالص و مرخصی را مشخص می‌کند.",
    detailedExplanation: "در آلمان طبق قانون جدید Nachweisgesetz، کارفرما موظف است کلیه شروط کار را به صورت نسخه فیزیکی مکتوب با امضای زنده یا امضای دیجیتال معتبر ارائه دهد. قراردادها معمولاً یا نامحدود (Unbefristet) هستند یا محدود به زمان مشخص (Befristet).",
    practicalTip: "قرارداد نامحدود (Unbefristeter Arbeitsvertrag) شانس تایید ویزای سفارت و اخذ اقامت دائم را به شدت افزایش می‌دهد.",
    commonMistake: "امضای قرارداد قبل از بررسی شرط اضافه کاری (Überstunden)؛ مراقب بندهایی باشید که اضافه کاری را مستهلک در حقوق پایه می‌دانند.",
    tags: ["قرارداد کاری", "Unbefristet", "ساعت کاری", "BGB"],
    importance: "essential"
  },
  {
    id: "probezeit",
    german: "die Probezeit",
    article: "die",
    pronunciationFa: "دی پْروبه‌تسایت",
    persianTitle: "دوره آزمایشی کاری",
    englishTitle: "Probationary Period",
    category: "labor_contracts",
    categoryLabelFa: "حقوق کار و قرارداد",
    legalBasis: "§ 622 Abs. 3 BGB",
    shortDefinition: "بازه زمانی اولیه قرارداد (حداکثر ۶ ماه) که طی آن هر دو طرف می‌توانند ظرف ۲ هفته بدون ذکر دلیل قرارداد را فسخ کنند.",
    detailedExplanation: "دوره آزمایشی استاندارد بازار کار آلمان است و به هیچ عنوان نشانه بی‌اعتمادی نیست. در طول این دوره، قوانین سفت‌وسخت حمایت از اخراج اعمال نمی‌شود. پس از سپری شدن ۶ ماه، قانون طلایی KSchG فعال شده و امنیت شغلی شما به طرز چشمگیری بالا می‌رود.",
    practicalTip: "در دوره آزمایشی، مهارت‌های ارتباطی و سازگاری با فرهنگ تیمی آلمانی به اندازه تخصص فنی مورد ارزیابی قرار می‌گیرد.",
    commonMistake: "نگرانی از داشتن ویزای کاری در دوره پروبه‌تسایت؛ سفارت آلمان به خوبی با پروبه‌تسایت آشناست و این مانع صدور ویزا نیست.",
    tags: ["دوره آزمایشی", "فسخ قرارداد", "BGB", "امنیت شغلی"],
    importance: "essential"
  },
  {
    id: "tarifvertrag",
    german: "der Tarifvertrag",
    article: "der",
    pronunciationFa: "دِر تاریف‌فرتْراگ",
    persianTitle: "پیمان دسته‌جمعی کار (قرارداد تعرفه‌ای)",
    englishTitle: "Collective Bargaining Agreement",
    category: "labor_contracts",
    categoryLabelFa: "حقوق کار و قرارداد",
    legalBasis: "TVG (Tarifvertragsgesetz)",
    shortDefinition: "موافقت‌نامه رسمی میان اتحادیه‌های بزرگ کارگری (مانند IG Metall یا ver.di) و کارفرمایان در خصوص حداقل حقوق، ساعات کار و پاداش‌ها.",
    detailedExplanation: "شرکت‌هایی که از پیمان تعرفه‌ای پیروی می‌کنند، ساختار حقوقی شفاف با رده‌های مشخص (Entgeltgruppe) دارند. در این شرکت‌ها ساعت کاری معمولاً ۳۵ ساعت در هفته، مرخصی سالانه ۳۰ روز کاری و پاداش‌های تعطیلات (Urlaubsgeld) و کریسمس (Weihnachtsgeld) تضمین شده است.",
    practicalTip: "پوزیشن‌های شغلی تحت تعرفه IG Metall در ایالات صنعتی مثل باواریا و اشتوتگارت دارای بالاترین استانداردهای رفاهی اروپا هستند.",
    commonMistake: "چانه زدن خارج از رده تعرفه‌ای؛ در این شرکت‌ها حقوق بر اساس سابقه و جدول گروه شغلی مصوب تعیین می‌شود.",
    tags: ["اتحادیه کارگری", "IG Metall", "ساعت کاری ۳۵ ساعت", "پاداش"],
    importance: "high"
  },
  {
    id: "brutto-netto",
    german: "Brutto vs. Netto",
    article: "",
    pronunciationFa: "بْروتُو در برابر نِتُو",
    persianTitle: "حقوق ناخالص در برابر حقوق خالص دریافتی",
    englishTitle: "Gross vs. Net Salary",
    category: "labor_contracts",
    categoryLabelFa: "حقوق کار و قرارداد",
    legalBasis: "EStG & SGB",
    shortDefinition: "تفاوت میان کل مبلغ درج شده در قرارداد (Brutto) و مبلغی که پس از کسر مالیات و بیمه‌های اجتماعی به حساب واریز می‌شود (Netto).",
    detailedExplanation: "تمام مذاکرات کاری و مبالغ آگهی‌ها در آلمان به صورت ناخالص سالانه (Bruttojahresgehalt) بیان می‌شوند. کسورات شامل مالیات بر درآمد، بیمه سلامت (KV)، بیمه بازنشستگی (RV)، بیمه بیکاری (AV) و بیمه مراقبت پیری (PV) است که معمولاً ۳۵٪ تا ۴۵٪ از کل حقوق را تشکیل می‌دهد.",
    practicalTip: "پیش از امضای پیشنهاد کاری، حتماً از ماشین‌حساب‌های Brutto-Netto Rechner آنلاین برای تخمین دقیق دستمزد خالص در ماه استفاده کنید.",
    commonMistake: "اشتباه گرفتن حقوق خالص با ناخالص؛ اگر حقوق قراردادی شما ۶۰,۰۰۰ یورو باشد، دریافتی ماهانه خالص شما حدود ۳,۱۰۰ تا ۳,۴۰۰ یورو خواهد بود.",
    tags: ["حقوق خالص", "حقوق ناخالص", "مالیات", "بیمه تامین اجتماعی"],
    importance: "essential"
  },
  {
    id: "kuendigungsschutz",
    german: "der Kündigungsschutz (KSchG)",
    article: "der",
    pronunciationFa: "دِر کوندینگونگْس‌شوتْس",
    persianTitle: "قانون حمایت از کارکنان در برابر اخراج",
    englishTitle: "Protection Against Unfair Dismissal",
    category: "labor_contracts",
    categoryLabelFa: "حقوق کار و قرارداد",
    legalBasis: "KSchG (Kündigungsschutzgesetz)",
    shortDefinition: "یکی از محکم‌ترین قوانین کار دنیا که پس از ۶ ماه اشتغال در شرکت‌های بیش از ۱۰ نفر کارمند، اخراج بدون دلیل موجه را ممنوع می‌سازد.",
    detailedExplanation: "پس از دوره آزمایشی، کارفرما فقط به سه دلیل می‌تواند کارمند را اخراج کند: دلایل فردی (بیماری طولانی‌مدت غیرقابل جبران)، دلایل رفتاری (سرقت یا تخلف اثبات شده پس از اخطار مکتوب Abmahnung)، یا دلایل اقتصادی تعدیل نیرو (با در نظر گرفتن معیارهای اجتماعی مانند سن و فرزندان).",
    practicalTip: "در صورت دریافت نامه اخراج ناعادلانه، طبق قانون فقط ۳ هفته فرصت دارید در دادگاه کار (Arbeitsgericht) دادخواست Kündigungsschutzklage ثبت کنید.",
    commonMistake: "عقب انداختن شکایت تا پس از پایان مهلت قانونی ۳ هفته‌ای که باعث سلب حق پیگیری می‌شود.",
    tags: ["امنیت شغلی", "دادگاه کار", "اخراج غیرقانونی", "KSchG"],
    importance: "high"
  },
  {
    id: "arbeitszeugnis",
    german: "das Arbeitszeugnis",
    article: "das",
    pronunciationFa: "داس آرْبایتْس‌تْسویکْنیس",
    persianTitle: "توصیه‌نامه رسمی و کارنامه پایان خدمت",
    englishTitle: "Certificate of Employment / Reference Letter",
    category: "labor_contracts",
    categoryLabelFa: "حقوق کار و قرارداد",
    legalBasis: "§ 109 GewO / § 630 BGB",
    shortDefinition: "سند مکتوبی که کارفرما موظف است در پایان دوره کار به شما تحویل دهد و عملکرد فنی و اخلاقی شما را گواهی کند.",
    detailedExplanation: "در آلمان لحن این توصیه‌نامه‌ها طبق قانون باید مثبت و دلسوزانه باشد. به همین دلیل سیستم کدگذاری نامحسوسی شکل گرفته است (مثلاً عبارت «stets zu unserer vollsten Zufriedenheit» نشان‌دهنده نمره عالی ۱ است، در حالی که «zu unserer Zufriedenheit» نمره ضعیف محسوب می‌شود).",
    practicalTip: "این توصیه‌نامه برای اپلای پوزیشن‌های بعدی در آلمان به اندازه مدرک دانشگاهی شما وزن دارد.",
    commonMistake: "ترک شرکت بدون تقاضای صدور Arbeitszeugnis رسمی با مهر و امضای مدیر.",
    tags: ["توصیه‌نامه", "رزومه آلمانی", "سابقه کار", "ارزیابی عملکرد"],
    importance: "high"
  },
  {
    id: "betriebsrat",
    german: "der Betriebsrat",
    article: "der",
    pronunciationFa: "دِر بِتْریبْس‌رات",
    persianTitle: "شورای کارگری و نمایندگان کارکنان شرکت",
    englishTitle: "Works Council",
    category: "labor_contracts",
    categoryLabelFa: "حقوق کار و قرارداد",
    legalBasis: "BetrVG (Betriebsverfassungsgesetz)",
    shortDefinition: "نهاد منتخب کارکنان در شرکت‌های بیش از ۵ نفر که بر رعایت حقوق پرسنل، ساعات کار و تایید استخدام‌های جدید نظارت دارد.",
    detailedExplanation: "قبل از استخدام هر کارمند جدید (از جمله متقاضیان خارجی)، قرارداد باید به تایید بتریبس‌رات شرکت برسد تا مطمئن شوند دستمزد و ساعات کاری تبعیض‌آمیز نیست.",
    practicalTip: "شورای کارگری مدافع کارمندان است و می‌توانید در صورت بروز هرگونه اختلاف کاری، تبعیض یا اضافه‌کاری پرداخت‌نشده محرمانه به آن‌ها مراجعه کنید.",
    commonMistake: "نگرانی از گزارش رفتار نامناسب مدیر به شورا؛ این نهاد کاملاً مستقل از هیئت مدیره است.",
    tags: ["نماینده کارکنان", "حقوق صنفی", "امنیت شغلی"],
    importance: "standard"
  },

  // --- 4. استقرار و امور اداری (taxes_settlement) ---
  {
    id: "anmeldung",
    german: "die Anmeldung",
    article: "die",
    pronunciationFa: "دی آن‌مِلْدونگ",
    persianTitle: "ثبت رسمی نشانی سکونت در شهرداری",
    englishTitle: "Official Address Registration",
    category: "taxes_settlement",
    categoryLabelFa: "استقرار و امور اداری",
    legalBasis: "§ 17 BMG (قانون ثبت نفوس فدرال)",
    shortDefinition: "ثبت قانونی محل زندگی در اداره شهروندان (Bürgeramt / Bürgerbüro) که ظرف ۱۴ روز پس از ورود به آلمان اجباری است.",
    detailedExplanation: "آنملدونگ مهم‌ترین گام بوروکراتیک پس از ورود به آلمان است. بدون برگه تاییدیه ثبت آدرس (Meldebestätigung)، امکان افتتاح حساب بانکی، دریافت سیم‌کارت دائمی، اخذ شماره مالیاتی (Steuer-ID) و دریافت کارت اقامت وجود ندارد.",
    practicalTip: "برای آنملدونگ حتماً نیاز به فرم امضا شده توسط صاحب‌خانه به نام Wohnungsgeberbestätigung دارید؛ اقامت در هتل معمولی یا هاستل عموماً امکان آنملدونگ ندارد.",
    commonMistake: "اجاره خانه‌های موقت که اجازه ثبت آدرس (Anmeldung möglich) را نمی‌دهند؛ حتماً قبل از رزرو خانه موقت بپرسید «Ist die Anmeldung möglich?».",
    tags: ["ثبت آدرس", "بورگرامت", "حساب بانکی", "گام اول در آلمان"],
    importance: "essential"
  },
  {
    id: "steuer-id",
    german: "die Steuer-ID (Steueridentifikationsnummer)",
    article: "die",
    pronunciationFa: "دی شْتُویر آی‌دی",
    persianTitle: "شماره ۱۱ رقمی شناسایی مالیاتی دائم",
    englishTitle: "Tax Identification Number",
    category: "taxes_settlement",
    categoryLabelFa: "استقرار و امور اداری",
    legalBasis: "§ 139b AO",
    shortDefinition: "شماره مالیاتی منحصر به فرد مادام‌العمر که پس از ثبت اولین آدرس به صورت خودکار توسط اداره مالیات مرکزی (BZSt) صادر می‌شود.",
    detailedExplanation: "این شماره به محض انجام Anmeldung از طریق پست به آدرس منزل شما ارسال می‌شود و کارفرما برای ارسال حقوق به آن نیاز دارد. اگر این شماره به موقع به کارفرما داده نشود، موقتاً در کلاس مالیاتی ۶ (با بالاترین نرخ کسر مالیات) قرار می‌گیرید.",
    practicalTip: "در صورت تاخیر نامه پستی، می‌توانید حضوری به اداره مالیات محل سکونت خود (Finanzamt) مراجعه کرده و در جا پرینت شماره را تحویل بگیرید.",
    commonMistake: "اشتباه گرفتن Steuer-ID با Steuernummer محلی که برای فریلنسرهاست.",
    tags: ["شماره مالیاتی", "اداره مالیات", "فیش حقوقی", "پست آلمان"],
    importance: "essential"
  },
  {
    id: "steuerklasse",
    german: "die Steuerklasse",
    article: "die",
    pronunciationFa: "دی شْتُویرکْلاصه",
    persianTitle: "کلاس مالیاتی (۱ تا ۶)",
    englishTitle: "Tax Bracket / Tax Class",
    category: "taxes_settlement",
    categoryLabelFa: "استقرار و امور اداری",
    legalBasis: "§ 38b EStG",
    shortDefinition: "دسته‌بندی مالیاتی متقاضی بر اساس وضعیت تاهل و درآمدهای خانوادگی که درصد پیش‌کسر مالیات از حقوق را تعیین می‌کند.",
    detailedExplanation: "افراد مجرد در کلاس ۱ قرار می‌گیرند. زوج‌های متاهل می‌توانند ترکیب کلاس ۴/۴ (درآمد یکسان) یا ۳/۵ (یکی با درآمد بسیار بالاتر) را انتخاب کنند. کلاس ۶ برای شغل دوم یا کسانی است که مدارک مالیاتی ارائه نکرده‌اند.",
    practicalTip: "اگر یکی از زوجین در خانه است یا درآمد پایینی دارد، انتخاب ترکیب کلاس ۳ (برای شاغل اصلی با مالیات کم) و کلاس ۵ گزینه‌ای بسیار به صرفه در جریان نقدینگی ماهانه است.",
    commonMistake: "فراموشی تغییر کلاس مالیاتی پس از الحاق همسر به آلمان که به طور خودکار شما را در کلاس ۱ مجردی نگه می‌دارد.",
    tags: ["کلاس مالیاتی", "متاهل", "مجرد", "بهینه‌سازی حقوق"],
    importance: "high"
  },
  {
    id: "schufa",
    german: "die Schufa (SCHUFA-Auskunft)",
    article: "die",
    pronunciationFa: "دی شُوفا",
    persianTitle: "گزارش سابقه و اعتبارسنجی مالی آلمان",
    englishTitle: "Credit Score & Credit History",
    category: "taxes_settlement",
    categoryLabelFa: "استقرار و امور اداری",
    legalBasis: "SCHUFA Holding AG",
    shortDefinition: "کارنامه اعتبار مالی افراد در آلمان که خوش‌حسابی در پرداخت قبوض، اقساط، اجاره و وام‌ها را نشان می‌دهد.",
    detailedExplanation: "تقریباً تمام صاحبان خانه در آلمان برای بستن قرارداد اجاره تقاضای برگه سابقه شوفا (Bonitätsauskunft) می‌کنند. متقاضیان تازه‌وارد معمولاً هنوز پرونده شوفا ندارند، که با داشتن قرارداد کاری و فیش حقوق اولیه جبران می‌شود.",
    practicalTip: "همواره قبوض اینترنت، برق و اقساط تلفن همراه را سر موعد پرداخت کنید؛ حتی یک صورتحساب فراموش شده ۵۰ یورویی می‌تواند امتیاز شوفای شما را تخریب کند.",
    commonMistake: "افتتاح حساب‌های بانکی متعدد بدون استفاده یا لغو نکردن به موقع قراردادهای بلااستفاده که امتیاز شوفا را کاهش می‌دهد.",
    tags: ["اعتبارسنجی", "اجاره خانه", "خوش حسابی", "وام بانکی"],
    importance: "high"
  },
  {
    id: "gkv-vs-pkv",
    german: "GKV vs. PKV (Krankenversicherung)",
    article: "die",
    pronunciationFa: "گه‌کا‌فائو در برابر په‌کا‌فائو",
    persianTitle: "بیمه سلامت دولتی در برابر بیمه خصوصی",
    englishTitle: "Public (Statutory) vs. Private Health Insurance",
    category: "taxes_settlement",
    categoryLabelFa: "استقرار و امور اداری",
    legalBasis: "SGB V",
    shortDefinition: "سیستم دوگانه درمانی آلمان؛ بیمه دولتی (GKV مثل TK, AOK, Barmer) و بیمه خصوصی (PKV).",
    detailedExplanation: "حدود ۹۰٪ شاغلین عضو بیمه دولتی هستند. در بیمه دولتی، همسر بدون درآمد و فرزندان به صورت رایگان تحت پوشش قرار می‌گیرند (Familienversicherung). شاغلین با درآمد بالای سقف سالانه معین (۶۹,۳۰۰ یورو در سال) حق انتخاب بیمه خصوصی را دارند.",
    practicalTip: "برای مهاجران دارای خانواده و فرزند، بیمه دولتی مانند TK (Techniker Krankenkasse) به دلیل پوشش رایگان کل اعضای خانواده بهترین و مطمئن‌ترین انتخاب است.",
    commonMistake: "ورود ناآگاهانه به بیمه خصوصی در سنین جوانی و ناتوانی در بازگشت به بیمه دولتی در آینده هنگام تشکیل خانواده.",
    tags: ["بیمه سلامت", "TK", "AOK", "درمان رایگان خانواده"],
    importance: "essential"
  },
  {
    id: "rundfunkbeitrag",
    german: "der Rundfunkbeitrag (GEZ)",
    article: "der",
    pronunciationFa: "دِر رونْدْفونْک‌بایتْراگ",
    persianTitle: "عوارض رادیو و تلویزیون ملی آلمان",
    englishTitle: "Broadcasting Fee / TV License",
    category: "taxes_settlement",
    categoryLabelFa: "استقرار و امور اداری",
    legalBasis: "RBStV",
    shortDefinition: "هزینه اجباری قانونی به مبلغ ۱۸.۳۶ یورو در ماه به ازای هر واحد مسکونی مستقل، مستقل از اینکه تلویزیون دارید یا خیر.",
    detailedExplanation: "پس از انجام ثبت آدرس (Anmeldung)، نامه‌ای رسمی از سوی سازمان Beitragsservice دریافت می‌کنید. پرداخت این عوارض به ازای هر آپارتمان است؛ اگر در یک خانه اشتراکی (WG) زندگی می‌کنید، یک نفر از ساکنان پرداخت کرده و بقیه شماره پرونده او را ثبت می‌کنند.",
    practicalTip: "نامه‌های این سازمان را به هیچ وجه نادیده نگیرید؛ عدم پاسخگویی منجر به جریمه‌های سنگین و ارجاع مستقیم به شوفا می‌شود.",
    commonMistake: "پرداخت دوباره توسط چند هم‌اتاقی در یک واحد مسکونی؛ فقط یک نفر باید پرداخت کند.",
    tags: ["عوارض تلویزیون", "GEZ", "آپارتمان", "نامه پستی"],
    importance: "standard"
  },
  {
    id: "kindergeld",
    german: "das Kindergeld",
    article: "das",
    pronunciationFa: "داس کینْدِرگِلْد",
    persianTitle: "حق اولاد پرداختی دولت فدرال به خانواده‌ها",
    englishTitle: "Child Benefit Allowance",
    category: "taxes_settlement",
    categoryLabelFa: "استقرار و امور اداری",
    legalBasis: "BKGG / § 62 EStG",
    shortDefinition: "کمک‌هزینه دولتی ماهیانه ۲۵۰ یورو به ازای هر فرزند زیر ۱۸ سال (یا تا ۲۵ سال در صورت تحصیل) برای دارندگان اقامت قانونی.",
    detailedExplanation: "به محض اینکه اقامت کاری یا بلوکارت خود را دریافت کردید، می‌توانید با پر کردن فرم در اداره Familienkasse تقاضای کیندرگلد دهید. این مبلغ به صورت منظم هر ماه به حساب بانکی والدین واریز می‌شود.",
    practicalTip: "پرداخت کیندرگلد عطف به ماسبق تا حداکثر ۶ ماه گذشته نیز امکان‌پذیر است.",
    commonMistake: "به تاخیر انداختن ثبت‌نام؛ مبالغ بیش از ۶ ماه گذشته سوخت می‌شود.",
    tags: ["حق اولاد", "خانواده", "کمک هزینه دولتی", "فرزندان"],
    importance: "high"
  }
];

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; labelFa: string; icon: React.ElementType }[] = [
  { id: "all", labelFa: "همه اصطلاحات", icon: Layers },
  { id: "visa_residence", labelFa: "اقامت و ویزا", icon: ShieldCheck },
  { id: "degrees_recognition", labelFa: "مدارک و ارزشیابی", icon: GraduationCap },
  { id: "labor_contracts", labelFa: "حقوق کار و قرارداد", icon: Briefcase },
  { id: "taxes_settlement", labelFa: "استقرار و امور اداری", icon: Landmark }
];

interface GlossaryProps {
  onNavigateToTab?: (tab: string) => void;
}

export default function Glossary({ onNavigateToTab }: GlossaryProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory>("all");
  const [onlyEssential, setOnlyEssential] = useState<boolean>(false);
  const [onlyNew2026, setOnlyNew2026] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [expandedTermId, setExpandedTermId] = useState<string | null>("blaue-karte-eu");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("germany_glossary_favorites");
      return saved ? JSON.parse(saved) : ["blaue-karte-eu", "chancenkarte", "anmeldung"];
    } catch {
      return ["blaue-karte-eu", "chancenkarte"];
    }
  });

  const toggleFavorite = (termId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(termId) ? prev.filter(id => id !== termId) : [...prev, termId];
      try {
        localStorage.setItem("germany_glossary_favorites", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const copyTerm = (term: GlossaryTerm, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const textToCopy = `${term.german} (${term.persianTitle}) - ${term.legalBasis || ""}\n${term.shortDefinition}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakGerman = (text: string, termId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/^(der|die|das)\s+/i, ""));
      utterance.lang = "de-DE";
      utterance.rate = 0.9;
      setSpeakingId(termId);

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis failed", err);
      setSpeakingId(null);
    }
  };

  // Filtered glossary entries
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      if (selectedCategory !== "all" && term.category !== selectedCategory) {
        return false;
      }
      if (onlyEssential && term.importance !== "essential") {
        return false;
      }
      if (onlyNew2026 && !term.isNew2026Law) {
        return false;
      }
      if (onlyFavorites && !favorites.includes(term.id)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inGerman = term.german.toLowerCase().includes(q);
        const inPersian = term.persianTitle.toLowerCase().includes(q);
        const inEnglish = term.englishTitle.toLowerCase().includes(q);
        const inPronunciation = term.pronunciationFa.toLowerCase().includes(q);
        const inDef = term.shortDefinition.toLowerCase().includes(q) || term.detailedExplanation.toLowerCase().includes(q);
        const inLegal = (term.legalBasis || "").toLowerCase().includes(q);
        const inTags = term.tags.some(t => t.toLowerCase().includes(q));

        return inGerman || inPersian || inEnglish || inPronunciation || inDef || inLegal || inTags;
      }

      return true;
    });
  }, [selectedCategory, onlyEssential, onlyNew2026, onlyFavorites, favorites, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = GLOSSARY_TERMS.length;
    const essentials = GLOSSARY_TERMS.filter(t => t.importance === "essential").length;
    const new2026 = GLOSSARY_TERMS.filter(t => t.isNew2026Law).length;
    return { total, essentials, new2026 };
  }, []);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setOnlyEssential(false);
    setOnlyNew2026(false);
    setOnlyFavorites(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
        {/* Decorative background vectors */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-200">
            <BookA className="w-4 h-4 text-amber-300" />
            <span>فرهنگ لغات و اصطلاحات رسمی مهاجرت و کار در آلمان</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            واژه‌نامه تخصصی و دایره‌المعارف اداری آلمان (Glossar)
          </h2>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-normal">
            فرهنگ جامع اصطلاحات حقوقی، اداری، ویزا، قراردادهای کاری و بیمه آلمان. با تلفظ صوتی اختصاصی، مستندات قانون اقامت (AufenthG)، کد مدنی (BGB) و نکات حیاتی کاربردی برای متقاضیان ایرانی.
          </p>

          {/* Quick metric stats */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{stats.total} مدخل تخصصی بازبینی شده</span>
            </span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-1.5 text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>قوانین اصلاحی جدید ۲۰۲۶</span>
            </span>
            <span className="text-white/40">·</span>
            <span className="text-white/80">همراه با تلفظ صوتی آلمانی (Text-to-Speech)</span>
          </div>
        </div>
      </div>

      {/* Main Search & Category Filtering Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو به آلمانی، فارسی یا انگلیسی (مثلاً Anmeldung، بلوکارت، ZAB، Probezeit، بیمه، حقوق...)"
            className="w-full text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-2xl px-4 py-3.5 pr-11 pl-10 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              title="پاک کردن جستجو"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Segmented Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {GLOSSARY_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === "all" 
                ? GLOSSARY_TERMS.length 
                : GLOSSARY_TERMS.filter(t => t.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30 ring-1 ring-amber-500"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.labelFa}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Toggle Switches */}
          <div className="flex flex-wrap items-center gap-2 mr-auto">
            <button
              onClick={() => setOnlyEssential(prev => !prev)}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyEssential
                  ? "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/40"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span>حیاتی و پرکاربرد</span>
            </button>

            <button
              onClick={() => setOnlyNew2026(prev => !prev)}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyNew2026
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>قوانین جدید ۲۰۲۶</span>
            </button>

            <button
              onClick={() => setOnlyFavorites(prev => !prev)}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyFavorites
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
              <span>نشان‌شده‌ها ({favorites.length})</span>
            </button>

            {(searchQuery || selectedCategory !== "all" || onlyEssential || onlyNew2026 || onlyFavorites) && (
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1.5 rounded-xl transition flex items-center gap-1"
                title="پاک کردن همه فیلترها"
              >
                <RotateCcw className="w-3 h-3" />
                <span>بازنشانی</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>نمایش {filteredTerms.length} مورد از کل {GLOSSARY_TERMS.length} اصطلاح</span>
        {searchQuery && (
          <span>نتایج تطابق کلیدواژه «{searchQuery}»</span>
        )}
      </div>

      {/* Glossary Cards Container */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            اصطلاحی با این مشخصات یافت نشد
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            می‌توانید عبارت جستجو را کوتاه‌تر کنید یا فیلترهای دسته را به «همه اصطلاحات» تغییر دهید.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>مشاهده تمام اصطلاحات</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTerms.map((term) => {
            const isExpanded = expandedTermId === term.id;
            const isFav = favorites.includes(term.id);
            const isSpeaking = speakingId === term.id;
            const isCopied = copiedId === term.id;

            return (
              <div
                key={term.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl sm:rounded-3xl transition-all duration-200 overflow-hidden shadow-xs hover:shadow-sm ${
                  isExpanded 
                    ? "border-amber-400/80 dark:border-amber-500/50 ring-1 ring-amber-500/20" 
                    : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Header Clickable Row */}
                <div
                  onClick={() => setExpandedTermId(prev => prev === term.id ? null : term.id)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 select-none"
                >
                  {/* Left (RTL Right): Main Term Names & Articles */}
                  <div className="flex items-start gap-3 w-full sm:w-auto">
                    {/* Audio pronunciation action button */}
                    <button
                      onClick={(e) => speakGerman(term.german, term.id, e)}
                      title="پخش تلفظ صوتی آلمانی"
                      className={`p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                        isSpeaking
                          ? "bg-amber-500 text-white border-amber-400 animate-pulse"
                          : "bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* German Term with bold typography */}
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight" dir="ltr">
                          {term.german}
                        </h3>

                        {/* Pronunciation in Persian */}
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          [{term.pronunciationFa}]
                        </span>

                        {term.isNew2026Law && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            قانون جدید ۲۰۲۶
                          </span>
                        )}
                        {term.importance === "essential" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                            حیاتی
                          </span>
                        )}
                      </div>

                      {/* Persian Meaning and Legal reference */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          {term.persianTitle}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                          {term.englishTitle}
                        </span>
                        {term.legalBasis && (
                          <>
                            <span className="text-slate-400">·</span>
                            <span className="font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[11px]" dir="ltr">
                              {term.legalBasis}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side (RTL Left): Action buttons (Favorite, Copy, Expand) */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 mr-auto sm:mr-0">
                    {/* Copy button */}
                    <button
                      onClick={(e) => copyTerm(term, e)}
                      title="کپی اصطلاح و توضیح مختصر"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Bookmark favorite */}
                    <button
                      onClick={(e) => toggleFavorite(term.id, e)}
                      title={isFav ? "حذف از نشان‌شده‌ها" : "نشان کردن این اصطلاح"}
                      className="p-2 rounded-xl text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : ""}`} />
                    </button>

                    {/* Expand icon */}
                    <div className="p-2 text-slate-400">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </div>

                {/* Short definition preview always visible */}
                <div className="px-4 sm:px-5 pb-3 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                  <p>{term.shortDefinition}</p>
                </div>

                {/* Expanded Deep Content Area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-200/70 dark:border-slate-800 space-y-4 text-xs sm:text-sm">
                        
                        {/* 1. Detailed Legal Explanation */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span>تشریح سازوکار حقوقی و اجرایی در آلمان</span>
                          </h4>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs font-normal">
                            {term.detailedExplanation}
                          </p>
                        </div>

                        {/* 2. Practical Tip for Iranians */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>نکته حیاتی و راهبردی برای متقاضیان ایرانی</span>
                          </h4>
                          <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl">
                            {term.practicalTip}
                          </p>
                        </div>

                        {/* 3. Common Mistake Warning */}
                        {term.commonMistake && (
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>اشتباه رایج و خطای پرهزینه</span>
                            </h4>
                            <p className="text-amber-950 dark:text-amber-100 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl">
                              {term.commonMistake}
                            </p>
                          </div>
                        )}

                        {/* 4. Tags and Deep-Link to App Tab */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-500 ml-1">برچسب‌ها:</span>
                            {term.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchQuery(tag);
                                }}
                                className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>

                          {/* Related interactive tab in app */}
                          {term.relatedTab && onNavigateToTab && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToTab(term.relatedTab!);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                            >
                              <span>ورود به بخش {term.relatedTabLabel || "مربوطه"}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Study / Reference Cheat Sheet Footer Card */}
      <div className="bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 text-center space-y-2">
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
          ترتیب طلایی مراحل اداری پس از ورود به آلمان
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-slate-700 dark:text-slate-300 pt-2">
          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            ۱. Anmeldung (ثبت آدرس در شهرداری ظرف ۱۴ روز)
          </span>
          <span>←</span>
          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            ۲. Steuer-ID (دریافت کد مالیاتی از اداره مالیات)
          </span>
          <span>←</span>
          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            ۳. Girokonto (افتتاح حساب جاری بانکی)
          </span>
          <span>←</span>
          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            ۴. Krankenkasse (فعال‌سازی عضویت بیمه درمان)
          </span>
          <span>←</span>
          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            ۵. eAT (دریافت کارت اقامت الکترونیک از اداره اتباع)
          </span>
        </div>
      </div>
    </div>
  );
}
