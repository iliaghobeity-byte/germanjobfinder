import { EmbassyAlert } from "./types";

export function getPersianDateString(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "امروز - مرداد ۱۴۰۵ (اوگست ۲۰۲۶)";
  }
}

export function computeAlertSignature(id: string, title: string, desc?: string, officialCode?: string): string {
  const cleanId = (id || "").trim();
  const cleanTitle = (title || "").trim();
  const cleanDesc = (desc || "").trim();
  const cleanCode = (officialCode || "").trim();
  return `${cleanId}:::${cleanTitle}:::${cleanDesc.slice(0, 120)}:::${cleanCode}`;
}

export const STORAGE_KEY_SEEN_ALERTS = "germany_seen_embassy_alerts_v4";
export const STORAGE_KEY_DISMISSED_TOASTS = "germany_dismissed_embassy_toasts_v4";
export const STORAGE_KEY_BANNER_DISMISSED = "germany_embassy_banner_dismissed_v4";

export function getDefaultEmbassyAlerts(currentDateStr: string = "امروز"): EmbassyAlert[] {
  const today = currentDateStr || getPersianDateString();

  return [
    {
      id: "embassy-tehran-tlscontact-fraud-warning",
      title: "هشدار مهم سفارت آلمان در تهران: رایگان بودن صف نوبت‌دهی کارگزاری TLScontact",
      description: "بخش روادید سفارت آلمان در تهران اکیداً هشدار می‌دهد که فرآیند ثبت‌نام و رزرو نوبت در سامانه کارگزاری رسمی TLScontact رایگان بوده و هیچ واسطه یا آژانسی دسترسی اختصاصی به وقت‌های مصاحبه ندارد. فریب دلالان را نخورید.",
      category: "urgent_warning",
      categoryLabelFa: "هشدار فوری سفارت در تهران",
      date: "بروزرسانی امروز",
      publishDate: today,
      priority: "urgent",
      officialRefUrl: "https://teheran.diplo.de/ir-fa/service/visa-einreise",
      officialRefTitle: "پورتال رسمی سفارت آلمان در تهران (teheran.diplo.de)",
      actionLabel: "مشاهده اطلاعیه رسمی سفارت",
      targetTab: "portals",
      officialCode: "DE-TEH-CONS-2026/08",
      isImportant: true
    },
    {
      id: "labor-law-blue-card-threshold-2026",
      title: "تصویب مصوبه جدید قانون کار: کاهش کف دستمزد بلوکارت اروپا",
      description: "مطابق اصلاحیه قانون مهاجرت متخصصان (Fachkräfteeinwanderungsgesetz)، آستانه حداقل حقوق ناخالص سالانه برای مشاغل با کمبود نیرو (IT، مهندسی، کادر درمان) به حدود ۴۱,۰۴۱ یورو و مشاغل عمومی به ۴۵,۳۰۰ یورو کاهش یافته و شرط مدرک زبان به B1 تعدیل شد.",
      category: "bluecard",
      categoryLabelFa: "قانون کار و بلوکارت ۲۰۲۶",
      date: "امروز",
      publishDate: today,
      priority: "high",
      officialRefUrl: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
      officialRefTitle: "سامانه Make it in Germany (پرتال رسمی دولت فدرال)",
      actionLabel: "بررسی شرایط بلوکارت",
      targetTab: "dashboard",
      officialCode: "BAMF-BC-2026",
      isImportant: true
    },
    {
      id: "chancenkarte-blocked-account-embassy-notice",
      title: "اطلاعیه سفارت تهران درباره تمکن مالی کارت فرصت (Chancenkarte)",
      description: "متقاضیان ویزای کارت فرصت در ایران باید گواهی حساب مسدودی (Sperrkonto) معادل حداقل ۱,۰۲۷ یورو در ماه برای مدت اقامت خود ارائه دهند، یا قرارداد کار آزمایشی پاره‌وقت تا ۲۰ ساعت در هفته در آلمان را ضمیمه پرونده کنند.",
      category: "chancenkarte",
      categoryLabelFa: "کارت فرصت Chancenkarte",
      date: "امروز",
      publishDate: today,
      priority: "high",
      officialRefUrl: "https://teheran.diplo.de/ir-fa/service/visa-einreise/-/2649060",
      officialRefTitle: "بخش کارت فرصت سفارت آلمان در تهران",
      actionLabel: "محاسبه امتیاز کارت فرصت",
      targetTab: "chancenkarte",
      officialCode: "DE-TEH-OPP-2026",
      isImportant: true
    },
    {
      id: "fast-track-81a-embassy-priority",
      title: "اولویت نوبت فوری مصاحبه سفارت برای دارندگان تاییدیه ماده §81a",
      description: "متقاضیانی که کارفرمای آلمانی آن‌ها فرآیند تسریع‌شده نیروی متخصص (§81a AufenthG) را در اداره مهاجرت آلمان ثبت کرده و برگه Vorabzustimmung دریافت کرده‌اند، نوبت مصاحبه اختصاصی در کمتر از ۳ هفته در کارگزاری TLScontact تهران دریافت می‌کنند.",
      category: "embassy_tehran",
      categoryLabelFa: "ویزای سریع §81a",
      date: "دیروز",
      publishDate: today,
      priority: "high",
      officialRefUrl: "https://www.make-it-in-germany.com/en/looking-for-foreign-professionals/entering/the-fast-track-procedure-for-skilled-workers",
      officialRefTitle: "اداره فدرال مهاجرت و پناهندگی آلمان (BAMF)",
      actionLabel: "مشاهده جزئیات فرآیند سریع",
      targetTab: "portals",
      officialCode: "BAMF-81A-FAST",
      isImportant: false
    },
    {
      id: "zab-digital-recognition-update",
      title: "ارزشیابی تمام‌دیجیتال مدارک تحصیلی ایران در سازمان ZAB بن",
      description: "بر اساس دستورالعمل جدید اداره مرکزی آموزش خارجی آلمان (ZAB)، متقاضیان فارغ‌التحصیل از دانشگاه‌های ایران می‌توانند مدارک خود را به صورت تمام‌دیجیتال بارگذاری کرده و نیازی به پست مدارک کاغذی به آلمان نیست.",
      category: "labor_law",
      categoryLabelFa: "ارزشیابی ZAB و آنابین",
      date: "۲ روز پیش",
      publishDate: today,
      priority: "medium",
      officialRefUrl: "https://www.kmk.org/zab/central-office-for-foreign-education.html",
      officialRefTitle: "سازمان ZAB بن آلمان (KMK)",
      actionLabel: "بررسی پورتال ZAB",
      targetTab: "portals",
      officialCode: "ZAB-DIGI-2026",
      isImportant: false
    },
    {
      id: "tlscontact-iran-fingerprint-guideline",
      title: "دستورالعمل کارگزاری TLScontact تهران برای ثبت بیومتریک و تایید اصالت اسناد",
      description: "کلیه اسناد هویتی و تحصیلی ترجمه‌شده باید به تایید وزارت امور خارجه و دادگستری ایران رسیده باشد. حضور شخصی در مرکز رسمی TLScontact تهران جهت تحویل مدارک و ثبت بیومتریک الزامی است.",
      category: "tlscontact",
      categoryLabelFa: "کارگزاری TLScontact ایران",
      date: "۳ روز پیش",
      publishDate: today,
      priority: "medium",
      officialRefUrl: "https://visas-de.tlscontact.com/visa/ir/irTHR2de/home",
      officialRefTitle: "پرتال رسمی کارگزاری TLScontact آلمان در ایران",
      actionLabel: "سامانه نوبت‌دهی TLScontact",
      targetTab: "portals",
      officialCode: "TLS-IR-BIO-2026",
      isImportant: false
    },
    {
      id: "german-labor-act-working-hours",
      title: "قوانین ساعت کار، اضافه کاری و مرخصی سالیانه کارمندان در آلمان (ArbZG)",
      description: "طبق قانون ساعات کار آلمان (Arbeitszeitgesetz)، حداکثر ساعات کاری روزانه ۸ ساعت (قابل افزایش به ۱۰ ساعت با جبران زمانی) بوده و هر نیروی کار موظف به دریافت حداقل ۲۴ روز کاری مرخصی با حقوق در سال است.",
      category: "labor_law",
      categoryLabelFa: "حقوق و قوانین کار آلمان",
      date: "هفته جاری",
      publishDate: today,
      priority: "medium",
      officialRefUrl: "https://www.gesetze-im-internet.de/arbzg/",
      officialRefTitle: "پرتال قوانین کار فدرال آلمان (Gesetze im Internet)",
      actionLabel: "شبیه‌ساز محیط کار آلمان",
      targetTab: "interview",
      officialCode: "ARBZG-DE-2026",
      isImportant: false
    }
  ];
}
