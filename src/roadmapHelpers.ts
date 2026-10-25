export interface MonthlyRoadmapInput {
  degree: string;
  field: string;
  experience: number;
  germanLevel: string;
  englishLevel: string;
  timelineMonths: number; // e.g. 6, 9, 12, 18
  weeklyHours?: number;
  targetPathway?: string;
  applicantName?: string;
}

export interface WeeklySprint {
  week: number;
  title: string;
  description: string;
}

export interface MonthlyMilestone {
  monthNumber: number;
  monthTitle: string;
  category: "documents" | "language" | "portfolio" | "applications" | "interviews" | "visa" | "relocation";
  primaryGoal: string;
  weeklySprints: WeeklySprint[];
  actionChecklist: string[];
  fieldSpecificAdvice: string;
  estimatedCostEur: number;
  estimatedCostIrr: string;
  officialAuthority: string;
  officialAuthorityUrl: string;
  riskFactorAndTip: string;
}

export interface RoadmapResponse {
  overview: {
    applicantName: string;
    targetField: string;
    degreeLabel: string;
    recommendedPathway: string;
    totalDurationMonths: number;
    estimatedTotalBudgetEur: string;
    estimatedTotalBudgetIrr: string;
    successRateRating: string;
    summaryInsight: string;
  };
  degreeAndFieldHighlights: {
    legalAdvantage: string;
    mainChallenge: string;
    criticalRequirement: string;
  };
  keyCheckpoints: {
    month: number;
    title: string;
    criterion: string;
  }[];
  monthlyMilestones: MonthlyMilestone[];
}

export function generateRuleBasedMonthlyRoadmap(input: MonthlyRoadmapInput): RoadmapResponse {
  const { degree, field, experience, germanLevel, englishLevel, timelineMonths = 6, applicantName } = input;

  const fLower = (field || "").toLowerCase();
  const isIT = fLower.includes("it") || 
               fLower.includes("software") || 
               fLower.includes("developer") || 
               fLower.includes("computer") || 
               fLower.includes("نرم‌افزار") || 
               fLower.includes("برنامه‌نویسی") || 
               fLower.includes("وب") || 
               fLower.includes("شبکه") || 
               fLower.includes("برنامه نویس") ||
               fLower.includes("داده") ||
               fLower.includes("data");

  const isMedical = fLower.includes("doctor") || 
                     fLower.includes("nurse") || 
                     fLower.includes("medical") || 
                     fLower.includes("health") || 
                     fLower.includes("پزشک") || 
                     fLower.includes("پرستار") || 
                     fLower.includes("درمان") || 
                     fLower.includes("مامایی") || 
                     fLower.includes("پیراپزشکی");

  const isEngineering = fLower.includes("engineer") || 
                         fLower.includes("mechanical") || 
                         fLower.includes("civil") || 
                         fLower.includes("electrical") || 
                         fLower.includes("industrial") || 
                         fLower.includes("مهندسی") || 
                         fLower.includes("مکانیک") || 
                         fLower.includes("برق") || 
                         fLower.includes("عمران") || 
                         fLower.includes("صنایع") || 
                         fLower.includes("ساخت");

  const hasAcademicDegree = ["bachelor", "master", "phd"].includes(degree);
  
  // Determine pathway
  let recommendedPathway = "کارت آبی اتحادیه اروپا (EU Blue Card 2026)";
  if (isIT && !hasAcademicDegree && experience >= 3) {
    recommendedPathway = "ویزای متخصص فناوری اطلاعات بدون مدرک دانشگاهی (§19c AufenthG)";
  } else if (isMedical) {
    recommendedPathway = "ویزای معادل‌سازی کادر درمان و طبابت (Berufsanerkennung & Approbation)";
  } else if (!hasAcademicDegree || experience < 2) {
    recommendedPathway = "کارت فرصت آلمان (Chancenkarte 2026)";
  }

  // Degree title in Persian
  const degreeMap: Record<string, string> = {
    phd: "دکتری تخصصی (PhD)",
    master: "کارشناسی ارشد (Master)",
    bachelor: "کارشناسی (Bachelor)",
    associate: "کاردانی / فوق دیپلم",
    diploma: "دیپلم متوسطه / فنی و حرفه‌ای",
    none: "سوابق تجربی بدون مدرک دانشگاهی"
  };
  const degreeLabel = degreeMap[degree] || degree;

  const duration = Math.max(4, Math.min(timelineMonths || 6, 18));

  // Build tailored monthly milestones
  const monthlyMilestones: MonthlyMilestone[] = [];

  // Month 1: Audit, Anabin/ZAB & Document Assembly
  monthlyMilestones.push({
    monthNumber: 1,
    monthTitle: "ماه ۱: اعتبارسنجی مدارک تحصیلی و پرونده تاییدیه ZAB/Anabin",
    category: "documents",
    primaryGoal: `تطبیق رسمی مدرک ${degreeLabel} و استعلام از دیتابیس آنابین یا آغاز فرآیند ارزشیابی ZAB به همراه ترجمه رسمی مدارک.`,
    weeklySprints: [
      { week: 1, title: "استعلام دیتابیس Anabin", description: "جستجوی نمایه دانشگاه و رشته تحصیلی در سایت anabin.kmk.org و ثبت پرینت وضعیت H+ دانشگاه." },
      { week: 2, title: "گردآوری مدارک تحصیلی و ریزنمرات", description: "دریافت دانشنامه رسمی، ریزنمرات کامل، سرفصل دروس (Curriculum) و تاییدیه گواهی‌های سابقه کار با مهر بیمه/شرکت." },
      { week: 3, title: "ترجمه رسمی با مهرهای دادگستری و وزارت امور خارجه", description: "ارسال مدارک به دارالترجمه رسمی برای ترجمه به زبان آلمانی یا انگلیسی." },
      { week: 4, title: "تشکیل پرونده در سامانه ZAB آلمان (در صورت لزوم)", description: isIT && !hasAcademicDegree 
        ? "تنظیم مستندات اثبات ۳ سال سابقه کار تخصصی IT برای معافیت از ZAB." 
        : "ثبت نام دیجیتال در سامانه صدور تاییدیه هم‌ترازی ZAB (Statement of Comparability) و واریز هزینه ۲۰۰ یورویی." }
    ],
    actionChecklist: [
      `بررسی وضعیت H+ دانشگاه و رشته ${field} در سایت Anabin`,
      "آزادسازی اصل دانشنامه و ریزنمرات رسمی دانشگاهی",
      "ترجمه رسمی مدارک تحصیلی و شناسنامه‌ای با مهرهای قانونی دادگستری و خارجه",
      isMedical ? "تشکیل پرونده اولیه معادل‌سازی در نظام پزشکی ایالت مقصد (Landesprüfungsamt)" : "دریافت گواهی سابقه کار به زبان انگلیسی/آلمانی با شرح دقیق وظایف شغلی",
      "رزرو نوبت اولیه در صف انتظار سامانه ویزامتریک / TLScontact تهران"
    ],
    fieldSpecificAdvice: isIT 
      ? "برای متخصصین نرم‌افزار، در صورت داشتن دانشگاه H+ نیازی به ارزیابی جداگانه ZAB نیست و مدرک مستقیم پذیرفته می‌شود. اگر مدرک غیرمرتبط دارید، سابقه کار بیمه‌ای ۳ ساله ملاک است."
      : isEngineering 
      ? "مهندسان عمران، مکانیک و برق حتماً پرینت H+ را در کنار شرح دروس تخصصی آماده کنند؛ عنوان مهندس رسمی (Ingenieur) در آلمان نیاز به عضویت در نظام مهندسی ایالتی (Ingenieurkammer) دارد."
      : isMedical 
      ? "کادر درمان باید مدارک بالینی، پروانه مطب، گواهی عدم سوء‌پیشینه پزشکی (Good Standing) و ریز ساعات کارآموزی بیمارستانی را به ایالت مربوطه ارسال کنند."
      : "ارزیابی انطباق مدرک با بازار کار آلمان الزامی‌ترین پیش‌نیاز صدور بلوکارت است.",
    estimatedCostEur: 250,
    estimatedCostIrr: "۱۵ الی ۲۵ میلیون تومان",
    officialAuthority: "سامانه مرکزی ارزشیابی مدارک آلمان (ZAB/KMK)",
    officialAuthorityUrl: "https://anabin.kmk.org",
    riskFactorAndTip: "تاخیر در آزادسازی دانشنامه اصلی یا عدم تطابق نام دانشگاه در آنابین می‌تواند ۱ تا ۲ ماه زمان را بسوزاند؛ فوراً پیگیر اصل دانشنامه باشید."
  });

  // Month 2: Language Progression & Standard German CV
  monthlyMilestones.push({
    monthNumber: 2,
    monthTitle: "ماه ۲: جهش مهارتی زبان و تدوین رزومه استاندارد آلمانی (Lebenslauf)",
    category: "language",
    primaryGoal: `رساندن زبان به سطح ${germanLevel === "B2" || germanLevel === "C1" ? "پیشرفته شغلی و آمادگی مصاحبه" : "حداقل B1/B2"} و نگارش رزومه و انگیزه‌نامه عکس‌دار آلمانی مطابق استانداردهای DIN 5008.`,
    weeklySprints: [
      { week: 1, title: "طراحی رزومه آلمانی مطابق استاندارد کارفرمایان", description: "استفاده از ساختار ۲ صفحه‌ای معکوس زمانی با اصطلاحات تخصصی حوزه " + field + " به زبان آلمانی." },
      { week: 2, title: "تهیه عکس پرسنلی بیزینسی (Bewerbungsfoto)", description: "عکاسی رسمی با پس‌زمینه حرفه‌ای و استایل متناسب با فرهنگ شرکتی آلمان." },
      { week: 3, title: "نگارش تمپلیت انگیزه‌نامه سفارشی (Anschreiben)", description: "تنظیم متن معرفی ارزش پیشنهادی، تخصص در " + field + " و انگیزه کار در آلمان." },
      { week: 4, title: "ثبت نام در آزمون رسمی زبان (گوته / تلک / آیلتس)", description: "تثبیت زمان آزمون رسمی زبان متناسب با پیش‌نیازهای ویزا و مصاحبه کاری." }
    ],
    actionChecklist: [
      `تکمیل فرم رزومه در ابزار رزومه‌ساز جاب‌فایندر و دانلود خروجی استاندارد`,
      "ترجمه و بومی‌سازی اصطلاحات فنی تخصصی به آلمانی کاری (Fachdeutsch)",
      "تمرین روزانه ۴۵ دقیقه پادکست‌ها و متون کاری آلمانی (B2 Beruf)",
      "ثبت عکس استاندارد بیزینسی برای قرار دادن در گوشه بالای رزومه",
      "تنظیم قالب Anschreiben اختصاصی برای ۵ شرکت هدف برتر در آلمان"
    ],
    fieldSpecificAdvice: isIT 
      ? "برای پوزیشن‌های انگلیسی‌زبان در برلین و مونیخ، داشتن رزومه انگلیسی در کنار یک خلاصه کوتاه آلمانی شانس شما را دوچندان می‌کند؛ کلمات کلیدی فنی مثل React, Cloud, Kubernetes را دقیق درج کنید."
      : isMedical 
      ? "کادر درمان برای شروع به حداقل مدرک B2 عمومی و سپس B2/C1 زبان تخصصی پزشکی (Fachsprachenprüfung) نیاز مبرم دارند."
      : "کارفرمای سنتی آلمانی (Mittelstand) به خوانایی، عدم وجود غلط املایی و ساختار منظم Lebenslauf بسیار حساس است.",
    estimatedCostEur: 180,
    estimatedCostIrr: "۱۰ الی ۱۵ میلیون تومان (آزمون زبان و عکاسی)",
    officialAuthority: "انستیتو گوته / موسسه تلک (Goethe / Telc)",
    officialAuthorityUrl: "https://www.goethe.de",
    riskFactorAndTip: "ارسال رزومه بدون عکس پرسنلی یا رزومه بیش از ۲ صفحه نرخ ریجکت خودکار را در آلمان تا ۶۰٪ افزایش می‌دهد."
  });

  // Month 3: Portfolio, LinkedIn & Localized Presence
  monthlyMilestones.push({
    monthNumber: 3,
    monthTitle: "ماه ۳: بهینه‌سازی حضور دیجیتال، گیت‌هاب/پورتفولیو و شبکه‌سازی Xing/LinkedIn",
    category: "portfolio",
    primaryGoal: `توسعه نمایه آنلاین بین‌المللی در پرتال‌های تخصصی آلمان و آماده‌سازی نمونه‌کارهای صنعتی حوزه ${field}.`,
    weeklySprints: [
      { week: 1, title: "بهینه‌سازی نمایه لینکدین (LinkedIn SEO)", description: "تنظیم تایتل شغلی به آلمانی و انگلیسی، فعال‌سازی تگ Open to Work با لوکیشن آلمان." },
      { week: 2, title: "عضویت در پلتفرم حرفه‌ای آلمانی XING", description: "ایجاد پروفایل در محبوب‌ترین شبکه اجتماعی تجاری حوزه DACH (آلمان، اتریش، سوئیس)." },
      { week: 3, title: isIT ? "پالایش مخازن GitHub و دموی زنده پروژه‌ها" : "ساخت پورتفولیو یا مستندات پروژه‌های شاخص مهندسی/عملیاتی", description: isIT ? "مستندسازی Readme پروژه‌ها به انگلیسی روان، اضافه کردن تست و استقرار دمو." : "تهیه فایل PDF چندصفحه‌ای از پروژه‌ها و نتایج قابل اندازه‌گیری." },
      { week: 4, title: "ارتباط با ریکروترهای تخصصی (Headhunters) در آلمان", description: "شناسایی و ارسال پیام به مشاوران استخدامی شرکت‌های آلمانی در حوزه " + field }
    ],
    actionChecklist: [
      "تغییر لوکیشن جستجوی شغلی در لینکدین به آلمان (با فیلتر Visa Sponsorship)",
      "ثبت نام کامل در شبکه کاریابی XING و بارگذاری رزومه استاندارد",
      isIT ? "قرار دادن لینک GitHub و پورتفولیو آنلاین در سربرگ رزومه" : "گردآوری تقدیرنامه‌ها، سرتیفیکیت‌ها و توصیه‌نامه‌های کاری (Arbeitszeugnis)",
      "عضویت در گروه‌های تخصصی مهندسی و کاریابی آلمان در لینکدین",
      "شناسایی ۲۰ شرکت مستقر در ایالت‌های صنعتی (بایرن، بادن-وورتمبرگ، نوردراین-وستفالن)"
    ],
    fieldSpecificAdvice: isIT 
      ? "پروژه‌هایی که از داکر (Docker)، تست‌های خودکار (Jest/PyTest) و معماری میکروسرویس یا CI/CD استفاده کرده‌اند بالاترین اولویت را برای کارفرمای آلمانی دارند."
      : isEngineering 
      ? "نمونه محاسبات، گواهینامه‌های دوره‌های بین‌المللی نرم‌افزارهای CAD/FEA و تسلط به استانداردهای DIN EN را هایلایت کنید."
      : "توصیه‌نامه‌های کارفرمای قبلی ترجمه شده ارزش بسیار بالایی در فرهنگ کاری آلمان دارند.",
    estimatedCostEur: 50,
    estimatedCostIrr: "۲ الی ۵ میلیون تومان (اشتراک پرمیوم لینکدین اختیاری)",
    officialAuthority: "پلتفرم شبکه تجاری آلمان (XING / StepStone)",
    officialAuthorityUrl: "https://www.stepstone.de",
    riskFactorAndTip: "بی‌توجهی به اکوسیستم XING باعث از دست رفتن پوزیشن‌های شرکت‌های سنتی و پردرآمد آلمانی می‌شود؛ حتماً در هر دو پلتفرم فعال باشید."
  });

  // Month 4: Targeted Application Blitz & Headhunter Engagement
  monthlyMilestones.push({
    monthNumber: 4,
    monthTitle: "ماه ۴: ارسال هدفمند روزانه اپلیکیشن‌ها و تعامل مستقیم با کارفرمایان",
    category: "applications",
    primaryGoal: `ارسال حداقل ۶۰ الی ۱۰۰ اپلیکیشن کاری هدفمند و سفارشی‌سازی شده در پرتال‌های StepStone, Indeed.de, LinkedIn و سایت‌های شرکت‌های آلمانی.`,
    weeklySprints: [
      { week: 1, title: "ارسال اپلیکیشن‌های موج اول در پرتال‌های شغلی فدرال", description: "جستجو در سامانه آژانس کار فدرال (Bundesagentur für Arbeit) و StepStone." },
      { week: 2, title: "شخصی‌سازی نامه‌ها برای هر کارفرما", description: "تطبیق کلمات کلیدی شرح شغل (Stellenanzeige) با متن رزومه برای عبور از فیلترهای ATS." },
      { week: 3, title: "پیگیری مودبانه ایمیلی بعد از ۱۰ روز کاری", description: "ارسال ایمیل پیگیری وضعیت (Nachfassen) به مدیران منابع انسانی." },
      { week: 4, title: "ثبت و پایش درخواست‌ها در جدول رهگیری (Application Tracker)", description: "دسته‌بندی بازخوردها، دلایل رد احتمالی و آماده‌سازی برای دعوت به مصاحبه." }
    ],
    actionChecklist: [
      "ارسال روزانه ۳ الی ۵ درخواست شغلی با انگیزه‌نامه اختصاصی",
      "جستجو در بانک مشاغل آژانس کار فدرال (Jobbörse der Arbeitsagentur)",
      "ثبت اکانت در پلتفرم‌های تخصصی مانند Honeypot, Instaffo, StepStone",
      "بهینه‌سازی کلمات کلیدی بر اساس بازخوردهای دریافتی در هفته‌های اول",
      "رزرو نوبت قطعی سفارت/ویزامتریک با توجه به تاریخ تخمینی مصاحبه‌ها"
    ],
    fieldSpecificAdvice: isIT 
      ? "در پلتفرم Honeypot و Talent.io ثبت نام کنید؛ در این پلتفرم‌ها کارفرمایان آلمانی به شما پیشنهاد کار ارسال می‌کنند و نیازی به اپلای یک‌طرفه نیست."
      : isMedical 
      ? "برای بیمارستان‌های دولتی (Universitätsklinikum) و مراکز نگهداری سالمندان معتبر ایمیل مستقیم به سرپرست منابع انسانی بزنید."
      : "ارسال انبوه رزومه یکسان بی‌اثر است؛ برای هر موقعیت حداقل ۲ بند از انگیزه‌نامه را کاملاً مطابق با چالش‌های همان شرکت بازنویسی کنید.",
    estimatedCostEur: 0,
    estimatedCostIrr: "رایگان",
    officialAuthority: "آژانس کار فدرال آلمان (Bundesagentur für Arbeit)",
    officialAuthorityUrl: "https://www.arbeitsagentur.de",
    riskFactorAndTip: "ناامید نشدن از دریافت ریجکت‌های اولیه در هفته اول امری حیاتی است؛ نرخ میانگین تبدیل اپلیکیشن به مصاحبه در آلمان بین ۵٪ تا ۱۰٪ است."
  });

  // Month 5: Technical & HR Interview Loops + Offer Negotiation
  monthlyMilestones.push({
    monthNumber: 5,
    monthTitle: "ماه ۵: مصاحبه‌های تخصصی، تسک‌های فنی و نهایی‌سازی قرارداد کاری (Arbeitsvertrag)",
    category: "interviews",
    primaryGoal: `قبولی در مراحل غربالگری منابع انسانی، مصاحبه‌های تخصصی فنی/مدیریتی و دریافت پیش‌نویس قرارداد کاری با حقوق بالاتر از کف قانونی بلوکارت ۲۰۲۶.`,
    weeklySprints: [
      { week: 1, title: "شبیه‌سازی مصاحبه‌های منابع انسانی و سوالات رفتاری", description: "تمرین متد STAR، معرفی شخصی ۲ دقیقه‌ای به آلمانی/انگلیسی و پاسخ به نقاط قوت و ضعف." },
      { week: 2, title: "انجام تسک فنی یا مصاحبه مهندسی عمیق (Technical Interview)", description: "حل چالش‌های تخصصی، ارائه کیس استادی یا کدنویسی زنده با تیم فنی آلمانی." },
      { week: 3, title: "مذاکره حقوق، پکیج جابجایی و تاریخ شروع کار", description: "تطبیق حقوق با کف بلوکارت (حداقل ۴۱,۰۴۱ یورو برای مشاغل کمبود و ۴۵,۳۰۰ یورو برای سایر مشاغل در سال ۲۰۲۶)." },
      { week: 4, title: "امضای قرارداد و درخواست تاییدیه اولیه آژانس کار (Vorabzustimmung)", description: "تقاضا از کارفرما برای ثبت تاییدیه پیش از موعد در اداره کار فدرال جهت سرعت بخشیدن به ویزا." }
    ],
    actionChecklist: [
      "تمرین سناریوهای مصاحبه در ابزار هوشمند شبیه‌ساز مصاحبه جاب‌فایندر",
      "تسلط بر توضیح پروژه‌های قبلی به زبان انگلیسی یا آلمانی کاری",
      "بررسی حداقل حقوق قانونی سال ۲۰۲۶ آلمان برای صدور بدون دردسر ویزا",
      "دریافت فرم رسمی کارفرما (Erklärung zum Beschäftigungsverhältnis)",
      "درخواست نامه تاییدیه اسکان موقت یا کمک هزینه Relocation از کارفرما"
    ],
    fieldSpecificAdvice: isIT 
      ? "در مصاحبه‌های فنی آلمانی، توانایی شما در بیان تفکر معماری (System Design) و چرایی انتخاب تکنولوژی‌ها از کدنویسی صرف مهم‌تر است."
      : isEngineering 
      ? "پرسش‌های مربوط به دقت، متدولوژی حل مساله، کاهش ریسک و کار تیمی در مصاحبه‌های مهندسی بسیار کلیدی هستند."
      : "فرهنگ صداقت و اعلام صریح ندانستن یک پاسخ در آلمان امتیاز مثبت دارد؛ هرگز در مصاحبه پاسخ ساختگی ندهید.",
    estimatedCostEur: 0,
    estimatedCostIrr: "رایگان",
    officialAuthority: "اداره مهاجرت و اقامت آلمان (BAMF)",
    officialAuthorityUrl: "https://www.bamf.de",
    riskFactorAndTip: "حتماً فرم Erklärung zum Beschäftigungsverhältnis را کارفرما با دقت پر کند؛ هرگونه تناقض در این فرم منجر به رد درخواست ویزا در سفارت می‌شود."
  });

  // Month 6: Visa Appointment, Blocked Account & Relocation
  monthlyMilestones.push({
    monthNumber: 6,
    monthTitle: "ماه ۶: انگشت‌نگاری ویزا در TLScontact، افتتاح حساب و آغاز زندگی در آلمان",
    category: "visa",
    primaryGoal: `حضور در مصاحبه کارگزاری ویزامتریک / TLScontact تهران، صدور ویزای ملی D (ورود به آلمان)، ثبت آدرس (Anmeldung) و آغاز کار.`,
    weeklySprints: [
      { week: 1, title: "چیدمان پرونده مدارک طبق چک‌لیست رسمی سفارت آلمان", description: "ترتیب دقیق نسخه‌های اصل و کپی مدارک شناسایی، تحصیلی، قرارداد کار و فرم‌های ویزا." },
      { week: 2, title: "حضور در مرکز TLScontact تهران جهت بیومتریک", description: "تحویل مدارک، پرداخت هزینه ویزا (۷۵ یورو) و انجام انگشت‌نگاری و تحویل گذرنامه." },
      { week: 3, title: "رزرو بیمه مسافرتی و مسکن موقت در شهر مقصد", description: "اجاره سوئیت با قابلیت ارائه برگه ثبت مسکونی (Wohnungsgeberbestätigung)." },
      { week: 4, title: "ورود به آلمان، ثبت نام در شهرداری (Anmeldung) و افتتاح حساب بانکی", description: "مراجعه حضوری به Bürgeramt، اخذ شماره شناسایی مالیاتی (Steuer-ID) و کارت اقامت الکترونیک (eAT)." }
    ],
    actionChecklist: [
      "تکمیل فرم آنلاین ویزای بلندمدت VIDEX با دقت بالا",
      "تهیه بیمه مسافرتی معتبر شنگن (حداقل ۳۰ هزار یورو پوشش درمانی)",
      "حضور منظم در موعد مقرر مرکز TLScontact تهران",
      "اجاره اقامتگاه موقت در سایت‌هایی نظیر Wunderflats یا WG-Gesucht با برگه ثبت شهرداری",
      "خرید بلیط پرواز پس از دریافت پاسپورت با برچسب ویزای تایپ D"
    ],
    fieldSpecificAdvice: isIT 
      ? "برای شاغلین IT، بسیاری از کارفرمایان در روزهای نخست ورود امکان کار ریموت از داخل آپارتمان را فراهم می‌کنند تا مراحل Anmeldung تکمیل شود."
      : isMedical 
      ? "پرستاران و پزشکان پس از ورود فوراً در دوره تطبیقی کلینیک یا کلاس آمادگی آزمون Kenntnisprüfung شرکت خواهند کرد."
      : "ثبت آدرس در شهرداری (Anmeldung) شاه‌کلید همه کارهای بعدی در آلمان (حساب بانکی، خط موبایل، قرارداد اینترنت و سیمکارت) است.",
    estimatedCostEur: 850,
    estimatedCostIrr: "۵۰ الی ۸۰ میلیون تومان (هزینه ویزا، بیمه، بلیط پرواز و رزرواسیون موقت)",
    officialAuthority: "سفارت آلمان در تهران و کارگزاری TLScontact",
    officialAuthorityUrl: "https://teheran.diplo.de",
    riskFactorAndTip: "اجاره مسکنی که صاحبخانه برگه Wohnungsgeberbestätigung را ارائه ندهد شما را از ثبت شهرداری محروم می‌کند؛ همیشه قبل از پرداخت بیعانه این شرط را کتباً بگیرید."
  });

  // If user requested 9, 12 or 18 months, expand intermediate preparation milestones
  if (duration > 6) {
    // Modify labels and insert deep preparation steps
    const extendedList: MonthlyMilestone[] = [];
    const stepMonthsCount = duration;
    
    // Scale milestones to fit stepMonthsCount
    for (let m = 1; m <= stepMonthsCount; m++) {
      const progressRatio = (m - 1) / (stepMonthsCount - 1);
      if (m === 1) {
        extendedList.push(monthlyMilestones[0]);
      } else if (progressRatio <= 0.35) {
        extendedList.push({
          monthNumber: m,
          monthTitle: `ماه ${m}: تقویت فشرده زبان آلمانی شغلی (B1/B2) و دوره‌های مکمل ${field}`,
          category: "language",
          primaryGoal: `افزایش تسلط بر مکالمات محیط کار آلمانی و کسب گواهینامه‌های معتبر بین‌المللی مرتبط با ${field}.`,
          weeklySprints: [
            { week: 1, title: "مطالعه گرامر پیشرفته و اصطلاحات بیزینس آلمان", description: "تمرین واژگان تخصصی و افعال عبارتی مربوط به شرح وظایف در آلمان." },
            { week: 2, title: "شرکت در وبینارها و رویدادهای تخصصی آنلاین آلمان", description: "آشنایی با متدهای روز کارفرمایان در شهرهای مونیخ، فرانکفورت و اشتوتگارت." },
            { week: 3, title: "تمرین شبیه‌سازی مصاحبه‌های رفتاری و تیمی", description: "تقویت سرعت پاسخگویی و رفع استرس در پاسخ به سوالات مصاحبه." },
            { week: 4, title: "آزمون آزمایشی ماک (Mock Exam) زبان آلمانی", description: "سنجش آمادگی واقعی قبل از ثبت نام در آزمون رسمی اصلی." }
          ],
          actionChecklist: [
            "مطالعه روزانه کتاب‌های منشن یا زیشر (Sicher B2)",
            `پروژه‌محوری با ابزارهای روز بازار کار آلمان در زمینه ${field}`,
            "شبکه‌سازی با ایرانیان شاغل در آلمان در همان تخصص",
            "آماده‌سازی مدارک و فیش‌های تمکن مالی یا هماهنگی حساب ارزی"
          ],
          fieldSpecificAdvice: `در این ماه تمرکز اصلی شما روی حل تسک‌های شبیه‌سازی شده محیط کار آلمان در زمینه ${field} است.`,
          estimatedCostEur: 120,
          estimatedCostIrr: "۸ الی ۱۲ میلیون تومان (کلاس زبان و منابع)",
          officialAuthority: "انستیتو گوته",
          officialAuthorityUrl: "https://www.goethe.de",
          riskFactorAndTip: "استمرار روزانه در یادگیری زبان مهم‌تر از ساعت‌های طولانی و مقطعی است؛ هر روز حداقل ۱ ساعت مطالعه داشته باشید."
        });
      } else if (progressRatio <= 0.6) {
        extendedList.push({
          ...monthlyMilestones[1],
          monthNumber: m,
          monthTitle: `ماه ${m}: تدوین رزومه آلمانی، توصیه‌نامه‌ها و حضور در شبکه XING/LinkedIn`
        });
      } else if (progressRatio <= 0.8) {
        extendedList.push({
          ...monthlyMilestones[3],
          monthNumber: m,
          monthTitle: `ماه ${m}: کمپین گسترده اپلیکیشن‌ها و تعامل با ریکروترهای شرکت‌های آلمانی`
        });
      } else if (progressRatio < 1.0) {
        extendedList.push({
          ...monthlyMilestones[4],
          monthNumber: m,
          monthTitle: `ماه ${m}: مصاحبه‌های تخصصی، آزمون‌های فنی و قرارداد کاری`
        });
      } else {
        extendedList.push({
          ...monthlyMilestones[5],
          monthNumber: m,
          monthTitle: `ماه ${m}: اخذ ویزای ملی D، ورود به آلمان و ثبت آدرس شهرداری (Anmeldung)`
        });
      }
    }
    monthlyMilestones.length = 0;
    monthlyMilestones.push(...extendedList);
  }

  return {
    overview: {
      applicantName: applicantName || "متقاضی محترم",
      targetField: field,
      degreeLabel,
      recommendedPathway,
      totalDurationMonths: duration,
      estimatedTotalBudgetEur: "۱,۲۰۰ الی ۱,۸۰۰ یورو (به جز تمکن مالی)",
      estimatedTotalBudgetIrr: "۸۰ الی ۱۲۰ میلیون تومان (هزینه‌های فرآیند و مدارک)",
      successRateRating: experience >= 3 ? "بسیار بالا (۸۵٪ الی ۹۵٪)" : "خوب و مستعد رشد (۷۰٪ الی ۸۵٪)",
      summaryInsight: `نقشه راه مهاجرتی شما به صورت ماه به ماه متناسب با مدرک ${degreeLabel} در رشته ${field} و سابقه ${experience} سال تدوین شد. با اجرای دقیق این گام‌های پیوسته، مسیر ورود مستقیم، اخذ قرارداد کاری و ویزای کار فدرال آلمان در مدت ${duration} ماه هموار می‌گردد.`
    },
    degreeAndFieldHighlights: {
      legalAdvantage: isIT 
        ? "طبق اصلاحیه قانون ۲۰۲۶، متخصصان IT بدون نیاز به ارائه مدرک تحصیلی مرتبط یا تاییدیه ZAB، با حداقل ۳ سال سابقه کار اثبات‌شده و درآمد کافی می‌توانند کارت آبی دریافت کنند."
        : hasAcademicDegree 
        ? "مدرک تحصیلی معتبر دانشگاهی شما واجد شرایط دریافت فوری بلوکارت استاندارد آلمان با تخفیف سابقه کار و حداقل کف حقوق سالانه است."
        : "با مدرک مهارتی و سوابق کار، واجد شرایط اقدام از طریق سیستم کارت فرصت (Chancenkarte) بر پایه امتیاز هستید.",
      mainChallenge: isMedical 
        ? "فرآیند نسبتاً طولانی معادل‌سازی مدارک پزشکی در ایالت‌ها و نیاز به قبولی در آزمون زبان تخصصی (FSP)."
        : germanLevel === "A1" || germanLevel === "A0" 
        ? "نیاز به تقویت سریع زبان تا سطح حداقل B1 برای پاسخگویی به تماس‌های تلفنی اولیه منابع انسانی آلمانی."
        : "رقابت با متقاضیان بین‌المللی و نیاز به بومی‌سازی رزومه مطابق استانداردهای سخت‌گیرانه آلمان.",
      criticalRequirement: "ارائه مدارک تحصیلی و کاری کاملاً مستند با تاییدیه‌های قانونی و ترجمه رسمی بدون تناقض تاریخ‌ها."
    },
    keyCheckpoints: [
      {
        month: 1,
        title: "چک‌پوینت ۱: اعتبارسنجی مدرک و آغاز پرونده",
        criterion: "دریافت تاییدیه H+ از آنابین یا ثبت نام در ZAB"
      },
      {
        month: Math.floor(duration * 0.4),
        title: "چک‌پوینت ۲: آمادگی زبانی و رزومه استاندارد",
        criterion: "رزومه آلمانی Lebenslauf نهایی + مدرک زبان B1/B2"
      },
      {
        month: Math.floor(duration * 0.7),
        title: "چک‌پوینت ۳: جاب‌آفر و تاییدیه اداره کار",
        criterion: "امضای قرارداد کاری (Arbeitsvertrag) یا جاب‌آفر با حقوق قانونی"
      },
      {
        month: duration,
        title: "چک‌پوینت نهایی: ویزای ملی تایپ D و ورود به آلمان",
        criterion: "انگشت‌نگاری در TLScontact و تحویل پاسپورت ویزا شده"
      }
    ],
    monthlyMilestones
  };
}
