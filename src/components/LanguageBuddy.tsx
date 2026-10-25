import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Volume2, 
  RefreshCw, 
  Brain, 
  CheckCircle2, 
  Languages, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  AlertTriangle,
  GraduationCap
} from "lucide-react";

interface Flashcard {
  german: string;
  phonetic: string;
  persian: string;
  context: string;
}

const DEFAULT_PHRASES: Record<string, Flashcard[]> = {
  it: [
    {
      german: "Können wir das heute im Daily Stand-up besprechen?",
      phonetic: "[کونن ویر داس هویته ایم دِیلی اِستندآپ بـِشپـِرِشن؟]",
      persian: "آیا می‌توانیم این را امروز در جلسه روزانه (Daily Stand-up) بررسی کنیم؟",
      context: "استفاده در متدهای توسعه نرم‌افزار چابک (Scrum)"
    },
    {
      german: "Ich habe den Bug behoben und einen Pull Request erstellt.",
      phonetic: "[ایش هابه دِن باگ بـِهوبِن اوند آینن پول ریکوئست اِرشتِلت]",
      persian: "من خطا را برطرف کردم و یک درخواست پول ریکوئست ایجاد کردم.",
      context: "توضیح کار روزانه توسعه‌دهندگان به هم‌تیمی‌ها"
    },
    {
      german: "Das System läuft stabil, aber wir müssen die API-Abfragen optimieren.",
      phonetic: "[داس زیستِم لوئیفت اِشتادیل، آبِر ویر موسن دی اِی‌پی‌آی آپتیمیرن]",
      persian: "سیستم پایدار کار می‌کند، اما باید درخواست‌های API را بهینه‌سازی کنیم.",
      context: "طراحی عملکرد سرور یا فرانت‌اند"
    },
    {
      german: "Wir müssen das Docker-Image auf dem Kubernetes-Cluster bereitstellen.",
      phonetic: "[ویر موسن داس داکر ایمیج آوف دِم کوبرنتیز کلاستر بـِرایت‌اشتـِلـِن]",
      persian: "ما باید ایمیج داکر را روی کلاستر کوبرنتیز مستقر (Deploy) کنیم.",
      context: "توضیح کارهای اتوماسیون و دواپس (DevOps)"
    },
    {
      german: "Ich benötige Zugriff auf das Git-Repository für dieses Projekt.",
      phonetic: "[ایش بـِنوتیگه تسوگریف آوف داس گیت ریپازیتوری فور دیسِز پرویکت]",
      persian: "من نیاز به دسترسی به مخزن گیت برای این پروژه دارم.",
      context: "شروع کار تیمی در پروژه جدید"
    }
  ],
  medical: [
    {
      german: "Wie stark sind Ihre Schmerzen auf einer Skala von eins bis zehn?",
      phonetic: "[وی اِشتارک زینْد ایره شْمِرتسِن آوف آینِر اِسکالا فون آینس بیس تْسِن؟]",
      persian: "میزان درد شما در مقیاس یک تا ده چقدر شدید است؟",
      context: "ارزیابی اولیه وضعیت بیمار در درمانگاه یا بیمارستان"
    },
    {
      german: "Haben Sie irgendwelche bekannten Medikamentenallergien?",
      phonetic: "[هابِن زی ایرگندولشه بـِکانتِن مدیکامِنتِن‌آلرگین؟]",
      persian: "آیا حساسیت دارویی شناخته‌شده‌ای دارید؟",
      context: "قبل از تجویز یا تزریق هرگونه دارو"
    },
    {
      german: "Ich werde jetzt Ihren Blutdruck und Puls messen.",
      phonetic: "[ایش ورده یِتست ایرِن بلوت‌دروک اوند پولس مِسِن]",
      persian: "من الان فشار خون و ضربان قلب شما را اندازه‌گیری خواهم کرد.",
      context: "چک کردن علائم حیاتی بیمار به صورت روزانه"
    },
    {
      german: "Bitte nehmen Sie diese Tablette dreimal täglich nach dem Essen ein.",
      phonetic: "[بیته نِمِن زی دیسه تابلته درای‌مال تِگلیش ناخ دِم اِسِن آین]",
      persian: "لطفاً این قرص را سه بار در روز بعد از غذا میل کنید.",
      context: "آموزش مصرف دارو به بیمار پس از ترخیص"
    },
    {
      german: "Wir müssen den Zustand des Patienten im KIS-System dokumentieren.",
      phonetic: "[ویر موسن دِن تسوشتاند دِس پاتسیِنتِن ایم کا-آی-اس زیستِم دکومنتیرن]",
      persian: "ما باید وضعیت بیمار را در سیستم اطلاعات کلینیکی (KIS) ثبت کنیم.",
      context: "مستندسازی بالینی وظایف شیفت"
    }
  ],
  engineering: [
    {
      german: "Diese Zeichnung entspricht nicht den aktuellen DIN-Normen.",
      phonetic: "[دیسه تسایشنونگ اِنت‌اِشپـِریشت نیشت دِن آکتوئِلن دین نورمِن]",
      persian: "این نقشه فنی با استانداردهای فعلی DIN همخوانی ندارد.",
      context: "کنترل کیفیت نقشه‌های قطعات صنعتی در مهندسی مکانیک"
    },
    {
      german: "Wir müssen die Belastungsanalyse mit der Finite-Elemente-Methode durchführen.",
      phonetic: "[ویر موسن دی بـِلاستونگس‌آندلیزه میت دِر فینیت اِلِمِنته متوده دورخ‌فورن]",
      persian: "ما باید آنالیز تنش و بار را با روش المان محدود (FEM) انجام دهیم.",
      context: "شبیه‌سازی‌های محاسباتی قطعات و سازه‌ها"
    },
    {
      german: "Das Bauteil weist eine zu hohe Abweichung bei der Toleranz auf.",
      phonetic: "[داس باوتایل وایست آینه تسو هوهه آپ‌وایشونگ بای دِر تولـِرانتس آوف]",
      persian: "این قطعه انحراف بیش از حد بالایی در تلرانس مجاز نشان می‌دهد.",
      context: "تست‌های آزمایشگاهی و ابعاد قطعات"
    },
    {
      german: "Die Wartung der Anlage muss alle sechs Monate erfolgen.",
      phonetic: "[دی وارتونگ دِر آنلاگه موس آله زِکس موناته اِرفولگن]",
      persian: "نگهداری و سرویس این تاسیسات باید هر شش ماه یک‌بار انجام شود.",
      context: "برنامه‌ریزی تعمیر و نگهداری کارخانه"
    },
    {
      german: "Wir haben den Prototyp erfolgreich im Windkanal getestet.",
      phonetic: "[ویر هابِن دِن پروتوتیپ اِرفولگ‌رایش ایم ویندکانال گـِتِستِت]",
      persian: "ما پروتوتایپ را با موفقیت در تونل باد تست کردیم.",
      context: "گزارش دستاوردهای تیم طراحی مکانیک یا هوافضا"
    }
  ],
  general: [
    {
      german: "Ich freue mich auf eine erfolgreiche Zusammenarbeit mit Ihnen.",
      phonetic: "[ایش فرویه میش آوف آینه اِرفولگ‌رایشه تسوزامِن‌آربایت میت اینـِن]",
      persian: "من مشتاق یک همکاری موفقیت‌آمیز با شما هستم.",
      context: "جمله رسمی برای اتمام ایمیل یا شروع قرارداد کاری جدید"
    },
    {
      german: "Lassen Sie uns dazu ein kurzes Meeting vereinbaren.",
      phonetic: "[لاسِن زی اونس داتسو آین کورتسِز میتینگ فـِرآین‌بارن]",
      persian: "بیایید یک جلسه کوتاه برای صحبت درباره این موضوع هماهنگ کنیم.",
      context: "هماهنگی جلسات کاری روزمره"
    },
    {
      german: "Vielen Dank für Ihre schnelle Rückmeldung.",
      phonetic: "[فیلن دانک فور ایره شْنِله روک‌مِلدونگ]",
      persian: "بابت پاسخگویی سریع شما بسیار سپاسگزارم.",
      context: "ابتدای ایمیل‌های رسمی اداری آلمانی"
    },
    {
      german: "Wir müssen die Prioritäten für das nächste Quartal festlegen.",
      phonetic: "[ویر موسن دی پریوریتِتِن فور داس نِکستِز کوارتال فِست‌لِگن]",
      persian: "ما باید اولویت‌های سه ماهه بعدی را تعیین کنیم.",
      context: "برنامه‌ریزی جلسات مدیران و سرپرستان"
    },
    {
      german: "Ich schicke Ihnen das Angebot im Laufe des Tages per E-Mail.",
      phonetic: "[ایش شیکه اینـِن داس آنگـِبوت ایم لائوفه دِس تاگـِس پـِر ایمیل]",
      persian: "من پیش‌نهاد قیمت را در طول امروز از طریق ایمیل برای شما ارسال می‌کنم.",
      context: "ارتباط با مشتری یا شرکای تجاری"
    }
  ]
};

export default function LanguageBuddy({ userField = "" }: { userField?: string }) {
  // Detect standard industry based on user's field
  const detectCategory = (field: string): string => {
    const fLower = String(field || "").toLowerCase();
    if (fLower.includes("it") || fLower.includes("software") || fLower.includes("developer") || fLower.includes("computer") || fLower.includes("نرم‌افزار") || fLower.includes("برنامه‌نویسی") || fLower.includes("وب")) {
      return "it";
    }
    if (fLower.includes("doctor") || fLower.includes("nurse") || fLower.includes("medical") || fLower.includes("health") || fLower.includes("پزشک") || fLower.includes("پرستار") || fLower.includes("درمان")) {
      return "medical";
    }
    if (fLower.includes("engineer") || fLower.includes("mechanical") || fLower.includes("civil") || fLower.includes("electrical") || fLower.includes("مهندسی") || fLower.includes("مهندس") || fLower.includes("مکانیک")) {
      return "engineering";
    }
    return "general";
  };

  const initialCat = detectCategory(userField);
  const [activeCategory, setActiveCategory] = useState<string>(initialCat);
  const [phrases, setPhrases] = useState<Flashcard[]>(DEFAULT_PHRASES[initialCat] || DEFAULT_PHRASES.general);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  // Update phrases list when active category changes
  useEffect(() => {
    // Check if we have custom generated phrases in localStorage for this category
    try {
      const saved = localStorage.getItem(`germany_custom_phrases_${activeCategory}`);
      if (saved) {
        setPhrases(JSON.parse(saved));
      } else {
        setPhrases(DEFAULT_PHRASES[activeCategory] || DEFAULT_PHRASES.general);
      }
    } catch {
      setPhrases(DEFAULT_PHRASES[activeCategory] || DEFAULT_PHRASES.general);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory]);

  const currentCard = phrases[currentIndex] || phrases[0] || DEFAULT_PHRASES.general[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + phrases.length) % phrases.length);
    }, 150);
  };

  const speakPhrase = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard || isPlayingAudio) return;

    if ("speechSynthesis" in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(currentCard.german);
      utterance.lang = "de-DE";
      utterance.rate = 0.85; // Slightly slower for language learners
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    } else {
      alert("سرویس پخش صوتی مرورگر شما فعال نیست.");
    }
  };

  const generateAIPhrases = async () => {
    setIsGenerating(true);
    setApiError("");
    try {
      const response = await fetch("/api/gemini/language-buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          industry: activeCategory,
          field: userField || "General Business"
        })
      });

      if (!response.ok) {
        throw new Error("خطا در پاسخ‌دهی سرور رخ داد.");
      }

      const data = await response.json();
      if (data && data.phrases && data.phrases.length > 0) {
        setPhrases(data.phrases);
        setCurrentIndex(0);
        setIsFlipped(false);
        // Persist in localStorage
        localStorage.setItem(`germany_custom_phrases_${activeCategory}`, JSON.stringify(data.phrases));
      } else {
        throw new Error("داده معتبری دریافت نشد.");
      }
    } catch (err: any) {
      console.error(err);
      setApiError("برقراری ارتباط با هوش مصنوعی موقتاً مقدور نبود؛ عبارات پیش‌فرض بارگذاری شدند.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPhrases = () => {
    localStorage.removeItem(`germany_custom_phrases_${activeCategory}`);
    setPhrases(DEFAULT_PHRASES[activeCategory] || DEFAULT_PHRASES.general);
    setCurrentIndex(0);
    setIsFlipped(false);
    setApiError("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-right relative overflow-hidden" id="language-buddy-card">
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div className="space-y-1.5 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
            <Languages className="w-3.5 h-3.5" />
            <span>رفیق زبان آلمانی کاری (German Job Buddy Widget)</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>اصطلاحات پرکاربرد آلمانی محیط کار با تلفظ صوتی</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            جملات طلایی آلمانی در محیط‌های کاری، بیمارستانی و مهندسی را تمرین کنید. روی کارت کلیک کنید تا معنی فارسی و فوت‌های کوزه‌گری مصرف را ببینید!
          </p>
        </div>

        {/* Industry selection tabs */}
        <div className="flex flex-wrap gap-2 shrink-0 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveCategory("it")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
              activeCategory === "it" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            آی‌تی (IT)
          </button>
          <button
            onClick={() => setActiveCategory("medical")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
              activeCategory === "medical" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            کادر درمان
          </button>
          <button
            onClick={() => setActiveCategory("engineering")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
              activeCategory === "engineering" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            مهندسی
          </button>
          <button
            onClick={() => setActiveCategory("general")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
              activeCategory === "general" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            اداری عمومی
          </button>
        </div>
      </div>

      {/* Flashcard Area */}
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* The Flip Card Container */}
        <div 
          onClick={handleFlip}
          className="relative h-64 w-full cursor-pointer group"
          style={{ perspective: "1000px" }}
        >
          {/* Card Body */}
          <div 
            className="absolute inset-0 h-full w-full rounded-2xl transition-all duration-500 ease-out shadow-2xl"
            style={{ 
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}
          >
            {/* Front Side (German Text) */}
            <div 
              className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-slate-700 p-6 flex flex-col justify-between items-center text-center backface-hidden"
            >
              <div className="w-full flex justify-between items-center text-slate-500 text-[10px] font-bold">
                <span className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-mono">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{currentIndex + 1} از {phrases.length}</span>
                </span>
                <span className="text-slate-400 font-extrabold">روی کارت کلیک کنید تا ترجمه شود 🔄</span>
              </div>

              <div className="my-auto space-y-3 px-2">
                <h4 className="text-base sm:text-lg font-black text-white leading-relaxed font-sans select-all" dir="ltr">
                  "{currentCard.german}"
                </h4>
                <p className="text-[11px] font-medium text-emerald-400 font-sans tracking-wide leading-relaxed bg-emerald-500/5 px-3 py-1.5 border border-emerald-500/15 rounded-lg select-text">
                  تلفظ: {currentCard.phonetic}
                </p>
              </div>

              <div className="w-full flex justify-center items-center">
                <button
                  onClick={speakPhrase}
                  className={`p-3 bg-indigo-600/80 text-white rounded-full transition-all duration-200 shadow-md ${
                    isPlayingAudio ? "scale-95 bg-emerald-600" : "hover:bg-indigo-500 hover:scale-110"
                  }`}
                  id={`btn-play-pronunciation-${currentIndex}`}
                  title="پخش صوتی تلفظ مادری"
                >
                  {isPlayingAudio ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Back Side (Persian Meaning & Context) */}
            <div 
              className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-bl from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/20 p-6 flex flex-col justify-between items-center text-center backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="w-full flex justify-between items-center text-slate-500 text-[10px] font-bold">
                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>توضیحات و معنی</span>
                </span>
                <span className="text-slate-400 font-extrabold">برگشتن به جمله آلمانی 🔄</span>
              </div>

              <div className="my-auto space-y-4 px-2">
                <h5 className="text-sm sm:text-base font-black text-emerald-300 leading-relaxed select-text">
                  "{currentCard.persian}"
                </h5>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed font-bold select-text">
                    <span className="text-indigo-400">فوت کوزه‌گری:</span> {currentCard.context}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-semibold">
                طراحی شده برای مهاجران کاری کشور آلمان
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Pagination controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition hover:text-white cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>کارت قبلی</span>
          </button>

          <span className="text-xs font-bold text-slate-400">
            کارت شماره {currentIndex + 1} از {phrases.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition hover:text-white cursor-pointer"
          >
            <span>کارت بعدی</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* AI custom fetch controls */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={generateAIPhrases}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>تولید اصطلاحات جدید...</span>
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" />
                  <span>بارگذاری اصطلاحات سفارشی با هوش مصنوعی (Gemini)</span>
                </>
              )}
            </button>
            
            {phrases !== DEFAULT_PHRASES[activeCategory] && (
              <button
                onClick={resetPhrases}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 transition cursor-pointer"
                title="بازگردانی به پیش‌فرض"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-[10px] text-slate-500 font-bold">
            موتور پردازش زبانی جاب فایندر آلمان
          </span>
        </div>

        {/* API Error / Info feedback banner */}
        {apiError && (
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-200 text-xs text-right leading-relaxed animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{apiError}</span>
          </div>
        )}

      </div>
    </div>
  );
}
