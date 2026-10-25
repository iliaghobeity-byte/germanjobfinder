import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Copy, Check, MessageSquare, BookOpen, Star, HelpCircle, Briefcase, Award } from "lucide-react";

interface InterviewTip {
  id: string;
  topic: string;
  title: string;
  description: string;
  germanVocab?: {
    word: string;
    article: string;
    pronunciation: string;
    meaning: string;
  };
}

interface IndustryCategory {
  id: string;
  label: string;
  englishLabel: string;
  icon: any;
  keywords: string[];
  tips: InterviewTip[];
}

const INDUSTRIES: IndustryCategory[] = [
  {
    id: "it_software",
    label: "فناوری اطلاعات و مهندسی نرم‌افزار",
    englishLabel: "IT & Software Engineering",
    icon: Sparkles,
    keywords: ["it", "برنامه", "نرم افزار", "کد", "دیتا", "داده", "شبکه", "وب", "طراح", "توسعه", "developer", "software", "coder", "front", "back", "full", "ai", "security"],
    tips: [
      {
        id: "it_1",
        topic: "لایو کدینگ و حل مسئله",
        title: "تسلط بر بخش فنی و کدنویسی زنده (Live Coding)",
        description: "در مصاحبه‌های آلمانی، بخش لایو کدینگ صرفاً برای حل مسئله نیست. مصاحبه‌کننده می‌خواهد نحوه تفکر، تمیزی کد (Clean Code) و نحوه مواجهه شما با چالش‌ها را ببیند. حتماً حین نوشتن کد، بلند فکر کنید و مراحل را به انگلیسی یا آلمانی سلیس توضیح دهید. از فرضیات بیجا بپرهیزید و قبل از شروع، سوالات شفاف‌کننده بپرسید.",
        germanVocab: {
          word: "Vorstellungsgespräch",
          article: "das",
          pronunciation: "فور-اشتِلونگز-گِشپرِش",
          meaning: "مصاحبه کاری"
        }
      },
      {
        id: "it_2",
        topic: "متدولوژی چابک و مستندسازی",
        title: "فرهنگ مستندسازی منظم و متدولوژی چابک (Agile)",
        description: "کارفرمایان آلمانی به مستندسازی استاندارد و فرآیندهای منظم بسیار اهمیت می‌دهند. در پاسخ‌های خود به تجربه کار در متدهای اسکرام (Scrum)، ابزارهای گزارش‌نویسی جیرا (Jira) و مستندسازی دقیق کدها اشاره کنید. برای آنها مهم است که بدانند شما چقدر در یک ساختار استاندارد تیمی ذوب می‌شوید.",
        germanVocab: {
          word: "Dokumentation",
          article: "die",
          pronunciation: "دوکومنتاسیون",
          meaning: "مستندسازی"
        }
      },
      {
        id: "it_3",
        topic: "سوالات فنی پایان مصاحبه",
        title: "سوالات هوشمندانه درباره پشته فناوری شرکت (Tech Stack)",
        description: "وقتی در انتهای مصاحبه نوبت به شما می‌رسد، سوالات عمیق بپرسید: بدهی فنی (Technical Debt) فعلی پروژه چیست؟ فرآیند تست‌نویسی و دیپلوی CI/CD چگونه هدایت می‌شود؟ یا برنامه‌ریزی تیم برای مهاجرت به فناوری‌های جدید چیست؟ این کار اشتیاق واقعی و عمق دانش مهندسی شما را اثبات می‌کند.",
        germanVocab: {
          word: "Arbeitgeber",
          article: "der",
          pronunciation: "آربایت-گِبِر",
          meaning: "کارفرما"
        }
      },
      {
        id: "it_4",
        topic: "پروژه‌های عملی و تفکر سیستماتیک",
        title: "ارائه ساختاریافته چالش‌های فنی در پروژه‌های گذشته",
        description: "هنگام توضیح پروژه‌های قبلی خود، سناریو را مبهم رها نکنید. به طور دقیق بگویید که چه نقشی در معماری داشتید، چه تصمیمی منجر به بهبود لودتایم یا پرفورمنس شد و از چه معیارهای عددی برای سنجش موفقیت استفاده کردید. آلمانی‌ها عاشق ارقام و بهینه‌سازی‌های مهندسی اثبات‌شده هستند.",
        germanVocab: {
          word: "Herausforderung",
          article: "die",
          pronunciation: "هراوس-فوردرونگ",
          meaning: "چالش"
        }
      },
      {
        id: "it_5",
        topic: "همکاری‌های بین‌المللی",
        title: "نشان دادن هماهنگی و انعطاف در تیم‌های چندملیتی",
        description: "بسیاری از شرکت‌های فناوری در آلمان انگلیسی‌زبان بوده و از فرهنگ‌های متعددی تشکیل شده‌اند. حتماً بر تجربه کار تیمی بین‌المللی خود تاکید کنید و نشان دهید که در حل تعارض‌های فرهنگی و زبانی، منعطف و صبور هستید.",
        germanVocab: {
          word: "Teamarbeit",
          article: "die",
          pronunciation: "تیم-آربایت",
          meaning: "کار تیمی"
        }
      }
    ]
  },
  {
    id: "healthcare",
    label: "علوم پزشکی، پرستاری و مراقبت‌های بهداشتی",
    englishLabel: "Healthcare & Medicine",
    icon: Award,
    keywords: ["پزشک", "پرستار", "مطب", "بیمار", "مامایی", "پیراپزشک", "داروساز", "درمان", "بهداشت", "کلینیک", "سلامت", "دندان", "doctor", "nurse", "medicine", "clinic", "hospital"],
    tips: [
      {
        id: "health_1",
        topic: "اخلاق حرفه‌ای و تعامل بیمار",
        title: "تاکید بر اخلاق حرفه‌ای و ارتباط همدلانه با بیمار (Patient Care)",
        description: "در کلینیک‌ها و بیمارستان‌های آلمان، احترام کامل به حقوق، حریم خصوصی و خودآگاهی بیمار در اولویت مطلق است. در طول مصاحبه، نشان دهید چطور شرایط اضطراب بیماران را مدیریت می‌کنید و چگونه با همراهان بیمار با صبر و شکیبایی آلمانی برخورد می‌نمایید.",
        germanVocab: {
          word: "Patient",
          article: "der",
          pronunciation: "پاتسیِنت",
          meaning: "بیمار"
        }
      },
      {
        id: "health_2",
        topic: "گزارش‌نویسی پزشکی دیجیتال",
        title: "انطباق‌پذیری با سیستم‌های پیشرفته ثبت دیجیتال پرونده‌ها",
        description: "بیمارستان‌های آلمانی دارای فرآیندهای مستندسازی دیجیتال فوق‌العاده حساسی هستند. بیان آمادگی برای یادگیری سریع نرم‌افزارهای یکپارچه درمانی کشور آلمان و پایبندی به استانداردهای حفاظت از داده‌های پزشکی، یک امتیاز درخشان برای شما خواهد بود.",
        germanVocab: {
          word: "Krankenhaus",
          article: "das",
          pronunciation: "کرانکن-هاوس",
          meaning: "بیمارستان"
        }
      },
      {
        id: "health_3",
        topic: "کار تیمی میان‌رشته‌ای",
        title: "احترام عمیق به هماهنگی بین پزشکان و کادر پرستاری",
        description: "سیستم درمانی آلمان کاملاً تیم‌محور و تخت است؛ به این معنی که نظرات کادر پرستاری و مراقبت ارزش فنی بالایی در تصمیم‌گیری‌های درمانی دارد. حتماً از تجربه‌های موفق خود در تعامل میان‌رشته‌ای صحبت کنید تا نشان دهید فاقد غرور بیجا هستید.",
        germanVocab: {
          word: "Zusammenarbeit",
          article: "die",
          pronunciation: "توزامِن-آربایت",
          meaning: "همکاری"
        }
      },
      {
        id: "health_4",
        topic: "آزمون تخصصی زبان پزشکی",
        title: "نشان دادن اشتیاق بالا برای قبولی در آزمون Fachsprache",
        description: "برای شروع به کار طبابت یا پرستاری مستقل در آلمان، تایید مدارک (Approbation) منوط به قبولی در آزمون زبان تخصصی است. در مصاحبه نشان دهید که فعالانه در حال یادگیری لغات پیچیده کالبدشناسی و اصطلاحات بالینی آلمانی هستید.",
        germanVocab: {
          word: "Fachbegriff",
          article: "der",
          pronunciation: "فاخ-بِگریف",
          meaning: "اصطلاح تخصصی"
        }
      },
      {
        id: "health_5",
        topic: "شیفت‌های فشرده و مدیریت انرژی",
        title: "برخورد منطقی و پذیرش شیفت‌های چرخشی در مصاحبه",
        description: "خدمات درمانی یک فیلد شبانه‌روزی است. کارفرمایان می‌خواهند بدانند شما چقدر در مواجهه با شیفت‌های شبانه، آخرهفته‌ها یا مواقع اضطراری انعطاف دارید. آمادگی فیزیکی و ذهنی خود را با راهکارهای دقیق تعادل کار و زندگی نشان دهید.",
        germanVocab: {
          word: "Schichtdienst",
          article: "der",
          pronunciation: "شیخت-دینست",
          meaning: "خدمت شیفتی"
        }
      }
    ]
  },
  {
    id: "engineering",
    label: "رشته‌های مهندسی، صنایع و تولید",
    englishLabel: "Engineering & Production",
    icon: Briefcase,
    keywords: ["مکانیک", "برق", "صنایع", "عمران", "معمار", "شیمی", "مواد", "اتوماسیون", "کارخانه", "نقشه", "تولید", "سازه", "engineer", "mechanical", "electrical", "civil"],
    tips: [
      {
        id: "eng_1",
        topic: "استانداردهای فنی ملی آلمان",
        title: "تاکید بر آشنایی با استانداردهای DIN و ISO در مهندسی آلمانی",
        description: "صنعت آلمان بر پایه استانداردهای بی‌نقص DIN شکل گرفته است. در طول مصاحبه، به مراجعی که در پروژه‌های قبلی استفاده کرده‌اید ارجاع دهید و اثبات کنید که استانداردهای جهانی کیفیت و ایمنی را به خوبی می‌شناسید و رعایت می‌کنید.",
        germanVocab: {
          word: "Norm",
          article: "die",
          pronunciation: "نورم",
          meaning: "استاندارد فنی"
        }
      },
      {
        id: "eng_2",
        topic: "حل مسئله سیستماتیک",
        title: "استفاده از الگوریتم منظم برای تشریح چالش‌های فنی گذشته",
        description: "وقتی از شما درباره حل یک نقص یا خرابی مهندسی سوال می‌شود، پاسخ خود را به ۴ بخش تقسیم کنید: ۱. چگونگی کشف عیب، ۲. روش تجزیه و تحلیل و ریشه‌یابی، ۳. سناریوی تصحیح گام‌به‌گام و ۴. اقدامات پیشگیرانه بعدی. مهندسان آلمانی عاشق ساختار یافتگی هستند.",
        germanVocab: {
          word: "Lösung",
          article: "die",
          pronunciation: "لوزونگ",
          meaning: "راهکار / راه حل"
        }
      },
      {
        id: "eng_3",
        topic: "تعامل مهندسی با کارگاه و تولید",
        title: "نشان دادن هماهنگی و احترام کامل به کادر فنی کارگاه",
        description: "در آلمان، مرز صلب میان مهندس طراح و تکنسین تولید وجود ندارد. کارفرما تمایل دارد شخصی را استخدام کند که به کارگاه سر می‌زند، به نظرات اپراتورها گوش می‌دهد و طرح خود را بر اساس واقعیت‌های تولید بهینه‌سازی می‌کند.",
        germanVocab: {
          word: "Werkstatt",
          article: "die",
          pronunciation: "ورک-اشتات",
          meaning: "کارگاه فنی"
        }
      },
      {
        id: "eng_4",
        topic: "صنعت نسل چهارم (Industry 4.0)",
        title: "اشاره به گرایش به دیجیتالی شدن و اینترنت اشیا صنعتی",
        description: "صنایع سنتی آلمان با سرعت به سمت اتوماسیون هوشمند و دیجیتالی شدن در حرکت هستند. صحبت درباره تجربیات شما در یکپارچه‌سازی سنسورها، تحلیل داده‌های خط تولید یا بهینه‌سازی‌های نرم‌افزاری، وزن رزومه شما را چندبرابر خواهد کرد.",
        germanVocab: {
          word: "Sicherheit",
          article: "die",
          pronunciation: "زیشِرهایت",
          meaning: "ایمنی و امنیت"
        }
      },
      {
        id: "eng_5",
        topic: "دقت محاسباتی بالا",
        title: "پرهیز از کلی‌گویی و ارائه مستندات عددی دقیق",
        description: "در جواب به پروژه‌ها، به ارقام تکیه کنید. مثلاً: «طراحی مجدد سیستم هیدرولیک، مصرف انرژی موتور را به میزان ۱۲٪ در سال کاهش داد و راندمان را ۸٪ ارتقا بخشید». کلی‌گویی‌های توصیفی فاقد ارزش تخصصی در مصاحبه مهندسی آلمان است.",
        germanVocab: {
          word: "Genauigkeit",
          article: "die",
          pronunciation: "گِنو-ایش‌کایت",
          meaning: "دقت و ظرافت علمی"
        }
      }
    ]
  },
  {
    id: "business_management",
    label: "مدیریت، بازاریابی، مالی و کسب‌وکار",
    englishLabel: "Management, Marketing & Business",
    icon: BookOpen,
    keywords: ["مدیر", "مدیریت", "بازاریابی", "مارکتینگ", "فروش", "مالی", "حسابداری", "اقتصاد", "مشتری", "قرارداد", "بیزنس", "manager", "business", "marketing", "finance", "sales"],
    tips: [
      {
        id: "biz_1",
        topic: "تصمیم‌گیری مبتنی بر داده",
        title: "ارائه نتایج و دستاوردها بر پایه شاخص‌های کلیدی عملکرد (KPIs)",
        description: "برای مدیران آلمانی، واژه های کیفی جذابیتی ندارند. وقتی درباره کمپین‌های بازاریابی یا مدیریت مالی حرف می‌زنید، دقیقاً مشخص کنید با چه بودجه‌ای، چه میزان تبدیل (Conversion Rate)، بازگشت سرمایه (ROI) یا صرفه‌جویی مالی برای شرکت ایجاد کرده‌اید.",
        germanVocab: {
          word: "Erfolg",
          article: "der",
          pronunciation: "اِرفولگ",
          meaning: "موفقیت"
        }
      },
      {
        id: "biz_2",
        topic: "تعهد به وقت‌شناسی سازمانی",
        title: "وقت‌شناسی تزلزل‌ناپذیر و مدیریت زمان فوق‌العاده",
        description: "در فرهنگ تجاری آلمان، زمان طلا نیست، زمان احترام و اعتبار شماست. تأخیر حتی چند دقیقه‌ای بدون اطلاع قبلی، به معنای بی‌انضباطی مطلق است. در جریان مصاحبه با تنظیم دقیق ساعت و حضور به موقع آنلاین، قابلیت اطمینان بالای خود را نشان دهید.",
        germanVocab: {
          word: "Pünktlichkeit",
          article: "die",
          pronunciation: "پونکت-لیش‌کایت",
          meaning: "وقت‌شناسی"
        }
      },
      {
        id: "biz_3",
        topic: "ارتباطات مستقیم تجاری",
        title: "برقراری ارتباطات شفاف، مستقیم و بدون حاشیه در مذاکره",
        description: "آلمانی‌ها طرفدار صراحت بیان هستند و تعارفات طولانی یا پاسخ‌های ابهام‌آمیز را نشانه ضعف یا عدم صداقت می‌دانند. بسیار محترمانه، به سرعت به سراغ اصل مطلب بروید و استدلال‌های تجاری خود را با کلمات موجز و قوی بیان کنید.",
        germanVocab: {
          word: "Verhandlung",
          article: "die",
          pronunciation: "فِرهاند-لونگ",
          meaning: "مذاکره و معامله"
        }
      },
      {
        id: "biz_4",
        topic: "احترام به قوانین و سلسله‌مراتب",
        title: "نشان دادن درک مناسب از قوانین بازار و فرآیندهای آلمان",
        description: "بخش بزرگی از تجارت آلمان تحت نظارت شرکت‌های خانوادگی باثبات اما سنتی (Mittelstand) اداره می‌شود. در مصاحبه نشان دهید که به سلسله مراتب اداری، فرآیندهای طولانی‌تر تصمیم‌گیری و قوانین تنظیم‌گری شدید بازار احترام می‌گذارید.",
        germanVocab: {
          word: "Vertrag",
          article: "der",
          pronunciation: "فرتراگ",
          meaning: "قرارداد رسمی"
        }
      },
      {
        id: "biz_5",
        topic: "حفظ مشتری و ثبات برند",
        title: "تمرکز بر پایداری تجاری و وفادارسازی مشتریان",
        description: "در بازار رقابتی آلمان، مشتریان دیر اعتماد می‌کنند اما پس از جلب رضایت، به شدت وفادار می‌مانند. در استراتژی‌های خود به جای فروش‌های مقطعی، بر ایجاد زنجیره ارزش طولانی‌مدت، پشتیبانی باکیفیت و استمرار رضایت مشتری تکیه کنید.",
        germanVocab: {
          word: "Kunde",
          article: "der",
          pronunciation: "کوندِه",
          meaning: "مشتری"
        }
      }
    ]
  },
  {
    id: "education_social",
    label: "آموزش، تدریس و خدمات اجتماعی",
    englishLabel: "Education & Social Services",
    icon: HelpCircle,
    keywords: ["معلم", "استاد", "مدرس", "آموزش", "مربی", "کودکستان", "مددکار", "اجتماعی", "جامعه", "روانشناس", "تدریس", "zaban", "teacher", "education", "social", "kita"],
    tips: [
      {
        id: "edu_1",
        topic: "رویکرد آموزشی چندفرهنگی",
        title: "انعطاف‌پذیری و صبر بالا در تعامل با خانواده‌های چندفرهنگی",
        description: "آلمان جامعه‌ای پویا با ترکیب فرهنگی گسترده است. مصاحبه‌کنندگان به شدت دنبال معلمین و مربیانی هستند که تجربه، صبوری و مهارت عالی در تعامل با کودکان و بزرگسالان از فرهنگ‌ها و مذاهب مختلف با سطوح زبانی متفاوت را داشته باشند.",
        germanVocab: {
          word: "Erziehung",
          article: "die",
          pronunciation: "اِرتسی-هونگ",
          meaning: "آموزش و پرورش"
        }
      },
      {
        id: "edu_2",
        topic: "حقوق کودکان و قوانین بهزیستی",
        title: "آشنایی مناسب با قوانین فدرال مراقبت و بهزیستی کودکان",
        description: "حمایت از حقوق کودکان در آلمان از قوانین فوق‌العاده حساسی برخوردار است. نشان دادن آگاهی از نقش نهاد فدرال Jugendamt (اداره جوانان و کودکان) و تعهد بی قید و شرط به حریم شخصی و روانی دانش‌آموزان، به کارفرما برای پذیرش شما اطمینان می‌دهد.",
        germanVocab: {
          word: "Kind",
          article: "das",
          pronunciation: "کیند",
          meaning: "کودک / فرزند"
        }
      },
      {
        id: "edu_3",
        topic: "آموزش مشارکتی و تجربی",
        title: "تاکید بر یادگیری فعال به جای متدهای سنتی حفظ کردن",
        description: "فلسفه مدرن آموزش در مدارس آلمان بر مبنای کشف شهودی، بازی‌های مشارکتی و کار عملی استوار است. در مصاحبه تلاش کنید نمونه‌هایی از طرح درس‌های تعاملی و گروهی خود که کودک را به تفکر مستقل سوق می‌دهد را توصیف نمایید.",
        germanVocab: {
          word: "Schule",
          article: "die",
          pronunciation: "شولِه",
          meaning: "مدرسه"
        }
      },
      {
        id: "edu_4",
        topic: "مستندسازی سیر رشد",
        title: "توانایی بالا در نوشتن گزارش‌های روان‌شناختی و رشدی",
        description: "بخش عمده‌ای از وظایف مددکاران یا مربیان مهدکودک (Kita) در آلمان، نوشتن مداوم گزارش‌های توسعه فردی تک‌تک کودکان است. آمادگی خود برای کارهای اداری و ثبت گزارش‌های منظم کتبی به زبان آلمانی را گوشزد کنید.",
        germanVocab: {
          word: "Entwicklung",
          article: "die",
          pronunciation: "اِنتویک-لونگ",
          meaning: "توسعه / رشد و پیشرفت"
        }
      },
      {
        id: "edu_5",
        topic: "حل تعارض و سناریوهای رفتاری",
        title: "آمادگی کامل برای پاسخ به سناریوهای بحرانی کلاس درس",
        description: "معمولاً از شما پرسیده می‌شود: «اگر دانش‌آموزی پرخاشگری کرد یا والدینی ناراضی بودند چه می‌کنید؟» همواره خونسردی، مراجعه به آیین‌نامه‌ها، گفتگوهای انفرادی ملایم و در جریان گذاشتن مدیریت به صورت مستند را به عنوان استراتژی حل مسئله مطرح کنید.",
        germanVocab: {
          word: "Geduld",
          article: "die",
          pronunciation: "گِدولد",
          meaning: "صبر و شکیبایی"
        }
      }
    ]
  },
  {
    id: "general_industry",
    label: "سایر تخصص‌ها و مهارت‌های عمومی",
    englishLabel: "General Industry & Career Tips",
    icon: Star,
    keywords: [],
    tips: [
      {
        id: "gen_1",
        topic: "پاسخ ساختاریافته به سبک STAR",
        title: "بکارگیری فرمول طلایی STAR در پاسخ به سوالات رفتاری",
        description: "وقتی مصاحبه‌گر آلمانی می‌گوید «از چالشی بزرگ در محیط کار قبلی خود بگویید»، پاسخ خود را اینگونه مهندسی کنید: Situation (موقعیت چه بود؟)، Task (وظیفه شما چه بود؟)، Action (چه گام‌های عملی برداشتید؟) و Result (نتیجه عددی و ملموس چه شد؟). آلمانی‌ها عاشق این مهندسی کلام هستند.",
        germanVocab: {
          word: "Erfahrung",
          article: "die",
          pronunciation: "اِرفار-ونگ",
          meaning: "تجربه کاری"
        }
      },
      {
        id: "gen_2",
        topic: "دوره آزمایشی در قوانین آلمان",
        title: "استقبال شجاعانه از دوره آزمایشی کاری (Probezeit)",
        description: "در آلمان تقریباً تمام قراردادهای کاری با ۶ ماه دوره آزمایشی شروع می‌شوند که طرفین می‌توانند در این مدت با مهلت کوتاه ۲ هفته‌ای قرارداد را بدون دلیل فسخ کنند. در مصاحبه نشان دهید از این فرصت استقبال می‌کنید، زیرا ابزار مناسبی برای ارزیابی دوجانبه تناسب فرهنگی و فنی است.",
        germanVocab: {
          word: "Probezeit",
          article: "die",
          pronunciation: "پروبِه-تسایت",
          meaning: "دوره آزمایشی کار"
        }
      },
      {
        id: "gen_3",
        topic: "پاسخ هوشمندانه به نقاط ضعف",
        title: "بیان نقاط ضعف واقعی به همراه راه‌حل اصلاحی فعال",
        description: "هرگز نگویید «نقطه ضعفی ندارم» یا جملات کلیشه‌ای مثل «بیش از حد کمال‌گرا هستم». یک ضعف واقعی اما غیربحرانی و بی‌ارتباط به نقش اصلی را مطرح کنید و سریعاً شرح دهید در ماه‌های اخیر از چه کتاب، متد یا ابزار جدیدی برای غلبه بر آن استفاده کرده‌اید.",
        germanVocab: {
          word: "Schwäche",
          article: "die",
          pronunciation: "شوِشِه",
          meaning: "نقطه ضعف"
        }
      },
      {
        id: "gen_4",
        topic: "سوالات خلاقانه پایان مصاحبه",
        title: "مطرح کردن حداقل دو سوال فرهنگی یا عملی عمیق در پایان جلسه",
        description: "سکوت در پاسخ به سوال «آیا از ما سوالی دارید؟» یک امتیاز منفی است. بپرسید: «بزرگترین چالش تیمی که قرار است به آن ملحق شوم در ۳ ماه آینده چیست؟» یا «موفقیت در این موقعیت پس از گذشت یک سال چگونه سنجیده می‌شود؟» این کار جدیت فوق‌العاده شما را نشان می‌دهد.",
        germanVocab: {
          word: "Frage",
          article: "die",
          pronunciation: "فراگِه",
          meaning: "پرسش / سوال"
        }
      },
      {
        id: "gen_5",
        topic: "زبان بدن رسمی و حضوری",
        title: "رعایت قواعد جدی تماس چشمی و اعتماد به نفس فیزیکی (Körpersprache)",
        description: "در فرهنگ مصاحبه آلمان، تماس چشمی مستقیم به معنای صداقت، اعتماد به نفس و احترام تلقی می‌شود. در طول مصاحبه‌های ویدیویی، به لنز دوربین نگاه کنید، صاف بنشینید و از تکان دادن‌های بیش از حد دست یا زبان بدن متزلزل پرهیز کنید.",
        germanVocab: {
          word: "Körpersprache",
          article: "die",
          pronunciation: "کوپر-اشپراخه",
          meaning: "زبان بدن"
        }
      }
    ]
  }
];

interface CareerCoachingWidgetProps {
  userField?: string;
}

export default function CareerCoachingWidget({ userField }: CareerCoachingWidgetProps) {
  const [activeCategory, setActiveCategory] = useState<IndustryCategory>(INDUSTRIES[INDUSTRIES.length - 1]);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showAllTips, setShowAllTips] = useState<boolean>(false);

  // Auto-detect the category based on user's field
  useEffect(() => {
    if (!userField) {
      // Default to general if empty
      setActiveCategory(INDUSTRIES[INDUSTRIES.length - 1]);
      return;
    }

    const fieldLower = userField.toLowerCase();
    
    // Find matching industry by keywords
    const matched = INDUSTRIES.find(industry => {
      if (industry.id === "general_industry") return false;
      return industry.keywords.some(keyword => fieldLower.includes(keyword.toLowerCase()));
    });

    if (matched) {
      setActiveCategory(matched);
    } else {
      setActiveCategory(INDUSTRIES[INDUSTRIES.length - 1]);
    }
  }, [userField]);

  // Daily Rotating calculation
  useEffect(() => {
    try {
      const today = new Date();
      // Simple hash representing day of year
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000);
      const totalTips = activeCategory.tips.length;
      if (totalTips > 0) {
        setTipIndex(dayOfYear % totalTips);
      } else {
        setTipIndex(0);
      }
    } catch {
      setTipIndex(0);
    }
  }, [activeCategory]);

  const activeTip = activeCategory.tips[tipIndex] || activeCategory.tips[0];

  const handleNextTip = () => {
    setTipIndex(prev => (prev + 1) % activeCategory.tips.length);
  };

  const handlePrevTip = () => {
    setTipIndex(prev => (prev - 1 + activeCategory.tips.length) % activeCategory.tips.length);
  };

  const handleCopy = () => {
    if (!activeTip) return;
    const textToCopy = `موضوع: ${activeTip.topic}\nعنوان: ${activeTip.title}\n\nتوضیح:\n${activeTip.description}${
      activeTip.germanVocab 
        ? `\n\nواژه‌نامه آلمانی مصاحبه:\n${activeTip.germanVocab.article} ${activeTip.germanVocab.word} (${activeTip.germanVocab.pronunciation}) -> ${activeTip.germanVocab.meaning}` 
        : ""
    }`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy", err);
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden text-right" id="career-coaching-widget-card">
      {/* Visual top accent */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500"></div>
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>کوچینگ و شبیه‌ساز مصاحبه‌های شغلی آلمان (Interviews Coach)</span>
          </div>
          <h3 className="text-base font-black text-white">توصیه‌های طلایی مصاحبه بر اساس صنف شما</h3>
          <p className="text-[11px] text-slate-400">
            تکنیک‌ها، لغات پرکاربرد و فوت‌وفن جلب رضایت کارفرمایان فدرال بر اساس آخرین استانداردها
          </p>
        </div>

        {/* Category manual switcher inside widget for flexible exploration */}
        <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold hidden md:inline">تغییر صنف:</span>
          <select
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-indigo-500"
            value={activeCategory.id}
            onChange={(e) => {
              const cat = INDUSTRIES.find(c => c.id === e.target.value);
              if (cat) {
                setActiveCategory(cat);
                setTipIndex(0);
              }
            }}
            id="career-coaching-industry-selector"
          >
            {INDUSTRIES.map(industry => (
              <option key={industry.id} value={industry.id}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tip Showcase Box */}
      {activeTip ? (
        <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 sm:p-5 relative">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3 mb-3.5">
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
              💡 تکنیک امروز: {activeTip.topic}
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              توصیه {tipIndex + 1} از {activeCategory.tips.length}
            </span>
          </div>

          <h4 className="text-sm font-black text-indigo-400 mb-2.5 leading-relaxed">
            {activeTip.title}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed font-medium text-justify mb-4">
            {activeTip.description}
          </p>

          {/* Integrated German Vocab Corner */}
          {activeTip.germanVocab && (
            <div className="bg-slate-900/90 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5 mb-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 p-1.5 opacity-10">
                <BookOpen className="w-12 h-12 text-teal-400" />
              </div>
              
              <div className="text-[10px] text-teal-400 font-black flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>گوشه یادگیری واژگان کاربردی آلمانی مصاحبه (Wortschatz):</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-indigo-400 font-mono font-bold select-none">{activeTip.germanVocab.article}</span>
                  <span className="text-xs font-black text-white font-sans tracking-wide selection:bg-teal-500 selection:text-slate-950">
                    {activeTip.germanVocab.word}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">[{activeTip.germanVocab.pronunciation}]</span>
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  معنی: {activeTip.germanVocab.meaning}
                </div>
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center justify-between border-t border-slate-800/50 pt-3 mt-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTip}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 active:scale-95 transition-all duration-150 cursor-pointer"
                title="توصیه قبلی"
                id="coaching-prev-tip-btn"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextTip}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 active:scale-95 transition-all duration-150 cursor-pointer"
                title="توصیه بعدی"
                id="coaching-next-tip-btn"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAllTips(!showAllTips)}
                className="text-[10.5px] font-extrabold text-slate-400 hover:text-indigo-400 transition cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-slate-900"
                id="coaching-toggle-all-tips-btn"
              >
                {showAllTips ? "بستن تمام توصیه‌ها" : "مشاهده کل توصیه‌ها"}
              </button>
              
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-[10.5px] font-bold active:scale-95 transition-all duration-150 cursor-pointer"
                id="coaching-copy-tip-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی تکنیک</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-xs text-slate-500 py-6">
          توصیه‌ای بارگذاری نشد.
        </div>
      )}

      {/* Dynamic Drawer List of All Tips for this Industry */}
      {showAllTips && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-fade-in" id="coaching-all-tips-container">
          <h5 className="text-xs font-black text-indigo-300 mb-2">لیست کامل تکنیک‌های مصاحبه صنف {activeCategory.label}:</h5>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pl-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {activeCategory.tips.map((tip, idx) => (
              <div 
                key={tip.id} 
                className={`p-3 rounded-xl border text-right cursor-pointer transition-all duration-150 ${
                  idx === tipIndex 
                    ? "bg-indigo-500/5 border-indigo-500/30 text-white" 
                    : "bg-slate-950/20 border-slate-900 hover:border-slate-800 text-slate-300"
                }`}
                onClick={() => {
                  setTipIndex(idx);
                  // Scroll back to active tip container if needed or just update index
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-indigo-400">
                    گام {idx + 1}: {tip.topic}
                  </span>
                  {idx === tipIndex && (
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-bold">
                      در حال مشاهده
                    </span>
                  )}
                </div>
                <div className="text-xs font-black mb-1 text-slate-200">{tip.title}</div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
