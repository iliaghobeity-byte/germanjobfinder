import React, { useState, useMemo } from "react";
import {
  Wallet,
  Coins,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRightLeft,
  Sparkles,
  Plane,
  Home,
  ShieldCheck,
  FileText,
  BadgeEuro,
  Info,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  User,
  CreditCard
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface ImmigrationBudgetPlannerProps {
  userField?: string;
  className?: string;
}

type VisaPathway = "blue_card" | "chancenkarte" | "job_seeker";
type FamilyStatus = "single" | "couple" | "family";
type ChartView = "pie" | "bar" | "both";

interface CostCategoryItem {
  id: string;
  title: string;
  category: "visa" | "flight" | "housing" | "insurance" | "reserves";
  costEurSingle: number;
  costEurCouple: number;
  costEurFamily: number;
  description: string;
  isMandatory: boolean;
  timing: string;
  tips: string;
}

const COST_DATABASE: CostCategoryItem[] = [
  // 1. Visa & Official Documents
  {
    id: "embassy_visa_fee",
    title: "عوارض رسمی صدور ویزای ملی آلمان (تایپ D)",
    category: "visa",
    costEurSingle: 75,
    costEurCouple: 150,
    costEurFamily: 190,
    description: "عوارض مصاحبه و صدور ویزا در سفارت آلمان / ویزامتریک (برای کودکان زیر ۶ سال رایگان یا نیم‌بها)",
    isMandatory: true,
    timing: "زمان مصاحبه ویزامتریک",
    tips: "مبلغ دقیق به صورت اسکناس یورو پرداخت می‌شود و بازگشت‌ناپذیر است."
  },
  {
    id: "visametric_service",
    title: "هزینه کارگزاری ویزامتریک و لگالایز",
    category: "visa",
    costEurSingle: 45,
    costEurCouple: 90,
    costEurFamily: 120,
    description: "کارمزد خدمات پذیرش مدارک، احراز هویت بیومتریک و ارسال پستی پاسپورت",
    isMandatory: true,
    timing: "هنگام ثبت نوبت و حضور",
    tips: "خدمات ویژه VIP اختیاری است و تاثیری در شانس قبولی ندارد."
  },
  {
    id: "zab_anabin",
    title: "ارزشیابی مدارک تحصیلی (ZAB / Anerkennung)",
    category: "visa",
    costEurSingle: 200,
    costEurCouple: 400,
    costEurFamily: 400,
    description: "هزینه عوارض دولتی ارزشیابی مدارک تحصیلی در بن برای تطبیق با دانشگاه‌های آلمان",
    isMandatory: true,
    timing: "۱ تا ۲ ماه قبل از درخواست ویزا",
    tips: "اگر دانشگاه و رشته شما در Anabin دارای وضعیت H+ باشد، ممکن است نیاز به ZAB جداگانه نباشد."
  },
  {
    id: "translation_justice",
    title: "ترجمه رسمی مدارک با تایید دادگستری و وزارت امور خارجه",
    category: "visa",
    costEurSingle: 180,
    costEurCouple: 320,
    costEurFamily: 400,
    description: "ترجمه مدارک دانشگاهی، ریزنمرات، سوابق بیمه و شناسنامه‌ها به زبان آلمانی",
    isMandatory: true,
    timing: "مراحل اولیه آماده‌سازی پرونده",
    tips: "ترجمه مستقیم به آلمانی توسط دارالترجمه رسمی مورد تایید سفارت توصیه می‌شود."
  },
  {
    id: "language_exam",
    title: "آزمون رسمی بین‌المللی زبان (Goethe / ÖSD / IELTS)",
    category: "visa",
    costEurSingle: 160,
    costEurCouple: 320,
    costEurFamily: 320,
    description: "هزینه ثبت‌نام آزمون سطح زبان (B1/B2 آلمانی یا آیلتس انگلیسی)",
    isMandatory: false,
    timing: "۳ تا ۴ ماه قبل از اقدام",
    tips: "مدرک معتبر گوته، تست‌داف یا تلک شانس مصاحبه و تسریع ویزا را دوچندان می‌کند."
  },

  // 2. Flight & Relocation
  {
    id: "flight_tickets",
    title: "بلیط پرواز هواپیما به آلمان (فرانکفورت/برلین/مونیخ)",
    category: "flight",
    costEurSingle: 450,
    costEurCouple: 900,
    costEurFamily: 1350,
    description: "پرواز یک‌طرفه با بار استاندارد (هواپیمایی پگاسوس، ترکیش یا قطر)",
    isMandatory: true,
    timing: "بلافاصله پس از درج برچسب ویزا",
    tips: "رزرو ۳ تا ۴ هفته قبل از سفر با بار اضافه مجاز حدود ۲۰ تا ۳۰ درصد بهینه‌تر است."
  },
  {
    id: "airport_transit_luggage",
    title: "ترانسفر فرودگاهی و ارسال بار اولیه",
    category: "flight",
    costEurSingle: 90,
    costEurCouple: 150,
    costEurFamily: 220,
    description: "قطار سریع‌السیر فرانکفورت به شهر مقصد (Deutsche Bahn ICE) و ترانسفر بار",
    isMandatory: true,
    timing: "روز ورود به آلمان",
    tips: "خرید بلیت قطار همزمان با پرواز با تخفیف Rail&Fly یا کارت ماهانه Deutschlandticket (۴۹ یورو)."
  },

  // 3. Initial Housing & Deposit
  {
    id: "kaution_deposit",
    title: "ودیعه مسکن (Kaution) - معادل ۲ تا ۳ ماه اجاره پایه",
    category: "housing",
    costEurSingle: 1600,
    costEurCouple: 2400,
    costEurFamily: 3200,
    description: "ودیعه قانونی امانت نزد صاحبخانه (طبق قانون آلمان در حساب بانکی مسدود و پس از تخلیه بازگردانده می‌شود)",
    isMandatory: true,
    timing: "هنگام امضای قرارداد اجاره اولیه",
    tips: "طبق ماده ۵۵۱ قانون مدنی آلمان (BGB)، مستاجر حق دارد ودیعه را در ۳ قسط ماهانه بپردازد."
  },
  {
    id: "first_month_rent",
    title: "اجاره مسکن موقت / ماه اول (Warmmiete با ثبت شهرداری)",
    category: "housing",
    costEurSingle: 750,
    costEurCouple: 1100,
    costEurFamily: 1450,
    description: "اجاره آپارتمان مبله یا اتاق با امکان ثبت آدرس شهرداری (Anmeldung) مانند Wunderflats یا WG-Gesucht",
    isMandatory: true,
    timing: "ماه اول اقامت در آلمان",
    tips: "ثبت آدرس (Anmeldung) برای افتتاح حساب بانکی و دریافت شماره مالیاتی (Steuer-ID) حیاتی است."
  },
  {
    id: "initial_living_supplies",
    title: "تجهیزات اولیه زندگی، اینترنت و سیم‌کارت محلی",
    category: "housing",
    costEurSingle: 150,
    costEurCouple: 250,
    costEurFamily: 350,
    description: "وسایل اولیه، کارت حمل‌ونقل شهری، سیم‌کارت آلمانی (Telekom/Vodafone) و اقلام ضروری",
    isMandatory: true,
    timing: "هفته اول اقامت",
    tips: "خرید سیم‌کارت‌های اعتباری با اینترنت نامحدود و استفاده از فروشگاه‌های زنجیره‌ای ارزان‌تر (Aldi/Lidl)."
  },

  // 4. Insurance & Health
  {
    id: "travel_incoming_insurance",
    title: "بیمه مسافرتی ورودی شنگن (Incoming Health Insurance)",
    category: "insurance",
    costEurSingle: 65,
    costEurCouple: 120,
    costEurFamily: 160,
    description: "بیمه مسافرتی معتبر حداقل ۳۰,۰۰۰ یورو پوشش حوادث و درمان برای روزهای اول ورود",
    isMandatory: true,
    timing: "هنگام تحویل مدارک به سفارت",
    tips: "بیمه‌هایی مانند Care Concept یا Mawista مورد تایید رسمی سفارت آلمان هستند."
  },
  {
    id: "first_month_public_insurance",
    title: "بیمه درمانی قانونی آلمان ماه اول (TK / Barmer / AOK)",
    category: "insurance",
    costEurSingle: 130,
    costEurCouple: 190,
    costEurFamily: 240,
    description: "حق بیمه درمانی دولتی تا زمان اولین فیش حقوقی کاری (نیمی توسط کارفرما پرداخت می‌شود)",
    isMandatory: true,
    timing: "ماه اول پس از شروع کار",
    tips: "برای دارندگان قرارداد کاری بلوکارت، ۵۰٪ حق بیمه به طور خودکار از سهم کارفرما کسر می‌شود."
  },

  // 5. Living Reserves & Emergency Buffer
  {
    id: "emergency_living_reserve",
    title: "تنخواه اضطراری نقدی و ذخیره معیشتی ماه اول",
    category: "reserves",
    costEurSingle: 850,
    costEurCouple: 1300,
    costEurFamily: 1750,
    description: "هزینه خورد و خوراک، رفت‌وآمد و هزینه‌های پیش‌بینی‌نشده تا زمان واریز اولین حقوق ماهانه",
    isMandatory: true,
    timing: "همراه مسافر به صورت یورو نقد یا کارت",
    tips: "برای کارت فرصت (Chancenkarte) ممکن است حساب مسدود (Sperrkonto) معادل ۱,۰۲۷ یورو در ماه درخواست شود."
  }
];

const CATEGORY_META = {
  visa: {
    nameFa: "ویزا، سفارت و ترجمه‌ها",
    nameEn: "Visa & Official Docs",
    color: "#4f46e5", // Indigo
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    icon: FileText
  },
  flight: {
    nameFa: "بلیط پرواز و ترانسفر",
    nameEn: "Flight & Travel",
    color: "#0ea5e9", // Sky
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    icon: Plane
  },
  housing: {
    nameFa: "ودیعه و مسکن اولیه",
    nameEn: "Housing & Deposit",
    color: "#10b981", // Emerald
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: Home
  },
  insurance: {
    nameFa: "بیمه درمانی و سلامت",
    nameEn: "Health Insurance",
    color: "#f59e0b", // Amber
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: ShieldCheck
  },
  reserves: {
    nameFa: "تنخواه و ذخیره ضروری",
    nameEn: "Living Buffer & Reserves",
    color: "#8b5cf6", // Purple
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Wallet
  }
};

export default function ImmigrationBudgetPlanner({
  userField = "مهندسی و فناوری",
  className = ""
}: ImmigrationBudgetPlannerProps) {
  const [pathway, setPathway] = useState<VisaPathway>("blue_card");
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus>("single");
  const [currencyMode, setCurrencyMode] = useState<"eur" | "irr">("eur");
  const [eurRate, setEurRate] = useState<number>(78000); // Toman per Euro
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeChartView, setActiveChartView] = useState<ChartView>("both");
  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);

  // Filter and compute total amounts based on pathway & family
  const computedData = useMemo(() => {
    let items = COST_DATABASE.map(item => {
      let amountEur = 0;
      if (familyStatus === "single") amountEur = item.costEurSingle;
      else if (familyStatus === "couple") amountEur = item.costEurCouple;
      else amountEur = item.costEurFamily;

      // Adjust for pathway
      if (pathway === "chancenkarte" && item.id === "emergency_living_reserve") {
        // Chancenkarte requires higher buffer or blocked account
        amountEur = familyStatus === "single" ? 1800 : familyStatus === "couple" ? 2800 : 3600;
      }
      if (pathway === "blue_card" && item.id === "language_exam") {
        // In many Blue Card cases English B2/C1 or direct interview suffices
        amountEur = Math.round(amountEur * 0.7);
      }

      return {
        ...item,
        amountEur,
        amountToman: Math.round((amountEur * eurRate) / 1000) * 1000
      };
    });

    const categoryTotals: Record<string, { eur: number; toman: number; count: number }> = {
      visa: { eur: 0, toman: 0, count: 0 },
      flight: { eur: 0, toman: 0, count: 0 },
      housing: { eur: 0, toman: 0, count: 0 },
      insurance: { eur: 0, toman: 0, count: 0 },
      reserves: { eur: 0, toman: 0, count: 0 }
    };

    items.forEach(it => {
      if (categoryTotals[it.category]) {
        categoryTotals[it.category].eur += it.amountEur;
        categoryTotals[it.category].toman += it.amountToman;
        categoryTotals[it.category].count += 1;
      }
    });

    const totalEur = Object.values(categoryTotals).reduce((sum, c) => sum + c.eur, 0);
    const totalToman = Object.values(categoryTotals).reduce((sum, c) => sum + c.toman, 0);

    // Pie chart dataset with percentages
    const pieData = Object.entries(categoryTotals).map(([catKey, val]) => {
      const meta = CATEGORY_META[catKey as keyof typeof CATEGORY_META];
      const percentage = totalEur > 0 ? Math.round((val.eur / totalEur) * 100) : 0;
      return {
        key: catKey,
        name: meta.nameFa,
        nameEn: meta.nameEn,
        valueEur: val.eur,
        valueToman: val.toman,
        percentage,
        color: meta.color
      };
    });

    // Bar chart dataset for direct side-by-side comparison
    const barData = Object.entries(categoryTotals).map(([catKey, val]) => {
      const meta = CATEGORY_META[catKey as keyof typeof CATEGORY_META];
      return {
        name: meta.nameFa,
        هزینه_یورو: val.eur,
        هزینه_میلیون_تومان: Math.round(val.toman / 1000000),
        color: meta.color
      };
    });

    return {
      items,
      categoryTotals,
      totalEur,
      totalToman,
      pieData,
      barData
    };
  }, [pathway, familyStatus, eurRate]);

  // Format currency helpers
  const formatAmount = (eur: number, toman: number) => {
    if (currencyMode === "eur") {
      return `€ ${eur.toLocaleString("fa-IR")}`;
    }
    const millionToman = (toman / 1000000).toFixed(1);
    return `${Number(millionToman).toLocaleString("fa-IR")} میلیون تومان`;
  };

  const formatTotalAmount = (eur: number, toman: number) => {
    if (currencyMode === "eur") {
      return `€ ${eur.toLocaleString("fa-IR")} یورو`;
    }
    const millionToman = (toman / 1000000).toFixed(1);
    return `${Number(millionToman).toLocaleString("fa-IR")} میلیون تومان`;
  };

  // Custom Pie Chart Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-right backdrop-blur-md min-w-[200px]">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
              {data.name}
            </span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
              {data.percentage}٪ از کل
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>مبلغ به یورو:</span>
              <strong className="text-white font-mono">€ {data.valueEur.toLocaleString("fa-IR")}</strong>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>معادل ریالی:</span>
              <span className="text-emerald-400 font-mono">
                {(data.valueToman / 1000000).toFixed(1)} میلیون تومان
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Bar Chart Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const eurVal = payload[0]?.payload?.هزینه_یورو || 0;
      const tomanMillion = payload[0]?.payload?.هزینه_میلیون_تومان || 0;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-right backdrop-blur-md min-w-[190px]">
          <p className="font-bold text-xs text-white mb-2 pb-1 border-b border-slate-800">{label}</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-indigo-300">
              <span>برآورد به یورو:</span>
              <strong className="text-white font-mono">€ {eurVal.toLocaleString("fa-IR")}</strong>
            </div>
            <div className="flex justify-between text-emerald-400 text-[11px]">
              <span>معادل تومان:</span>
              <span className="font-mono">{tomanMillion} میلیون تومان</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="immigration-budget-planner-card"
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden print-break-inside-avoid ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>محاسبه‌گر و برنامه‌ریز مالی مهاجرت آلمان ۲۰۲۶</span>
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-800/70 px-2.5 py-0.5 rounded-full border border-slate-700/50">
              بر پایه استاندارد هزینه‌های سفارت و بازار مسکن
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>بودجه‌بندی و پیش‌بینی هزینه‌های مهاجرت کاری</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            برآورد گام‌به‌گام هزینه‌های ویزا، سفارت، پرواز، ودیعه مسکن (Kaution)، بیمه و تنخواه اولیه با تفکیک سهم هر بخش
          </p>
        </div>

        {/* Currency & Exchange Rate Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 no-print">
          <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrencyMode("eur")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currencyMode === "eur"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BadgeEuro className="w-3.5 h-3.5" />
              <span>یورو (€)</span>
            </button>
            <button
              onClick={() => setCurrencyMode("irr")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currencyMode === "irr"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>تومان</span>
            </button>
          </div>

          {currencyMode === "irr" && (
            <div className="flex items-center gap-1 pl-2 text-[11px] text-slate-400">
              <span>نرخ یورو:</span>
              <input
                type="number"
                value={eurRate}
                onChange={(e) => setEurRate(Math.max(1000, Number(e.target.value) || 75000))}
                className="w-20 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-center text-xs text-white font-mono"
                title="نرخ تسعیر هر یورو به تومان"
              />
            </div>
          )}
        </div>
      </div>

      {/* Control Filters (Pathway, Family Status, Chart View) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 no-print">
        {/* Visa Pathway Selector */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl">
          <label className="block text-[11px] font-bold text-slate-400 mb-2">مسیر قانونی مهاجرت:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "blue_card", title: "بلو کارت" },
              { id: "chancenkarte", title: "کارت فرصت" },
              { id: "job_seeker", title: "ویزای تخصصی" }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPathway(p.id as VisaPathway)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  pathway === p.id
                    ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400/50"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Accompanying Family Selector */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl">
          <label className="block text-[11px] font-bold text-slate-400 mb-2">وضعیت تاهل و همراهان:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "single", title: "مجرد", icon: User },
              { id: "couple", title: "زوج (همسر)", icon: Users },
              { id: "family", title: "با فرزند", icon: Users }
            ].map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFamilyStatus(f.id as FamilyStatus)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    familyStatus === f.id
                      ? "bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400/50"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart View Mode Selector */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl">
          <label className="block text-[11px] font-bold text-slate-400 mb-2">شیوه نمایش نمودار:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "pie", title: "دایره‌ای (سهم)", icon: PieChartIcon },
              { id: "bar", title: "ستونی (مقایسه)", icon: BarChart3 },
              { id: "both", title: "ترکیبی", icon: TrendingUp }
            ].map(v => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveChartView(v.id as ChartView)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeChartView === v.id
                      ? "bg-slate-800 text-amber-300 shadow border border-amber-500/40"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{v.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Budget Summary Scoreboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-500/30 p-4 rounded-2xl relative overflow-hidden">
          <div className="text-[11px] font-bold text-indigo-300 mb-1 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>کل بودجه تخمینی لازم:</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono tracking-tight">
            {formatTotalAmount(computedData.totalEur, computedData.totalToman)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            شامل تمامی ۵ بخش هزینه‌ای تا ماه اول ورود
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>بزرگترین سهم هزینه:</span>
          </div>
          <div className="text-base md:text-lg font-black text-emerald-300">
            مسکن و ودیعه (Kaution)
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {computedData.pieData.find(p => p.key === "housing")?.percentage || 0}٪ کل بودجه (قابل استرداد)
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>هزینه‌های بازگشت‌پذیر:</span>
          </div>
          <div className="text-base md:text-lg font-black text-sky-300 font-mono">
            {formatAmount(
              computedData.items.find(i => i.id === "kaution_deposit")?.amountEur || 0,
              computedData.items.find(i => i.id === "kaution_deposit")?.amountToman || 0
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            ودیعه خانه پس از پایان سکونت مسترد می‌شود
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>مزیت مالیاتی (Steuer):</span>
          </div>
          <div className="text-base md:text-lg font-black text-amber-300">
            کسر تا ۲,۵۰۰ یورو
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            هزینه جابجایی در اظهارنامه مالیاتی آلمان
          </div>
        </div>
      </div>

      {/* Visual Recharts Section (Pie Chart & Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Pie Chart: Proportional Share of Costs */}
        {(activeChartView === "pie" || activeChartView === "both") && (
          <div
            className={`${
              activeChartView === "both" ? "lg:col-span-6" : "lg:col-span-12"
            } bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-400" />
                <span>نسبت سهم هر بخش از کل بودجه (نمودار دایره‌ای Recharts)</span>
              </h3>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                درصد سهم
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              مشاهده سهم نسبی هزینه‌های ویزا، بلیط، مسکن، بیمه و ذخیره معیشتی
            </p>

            <div className="h-64 sm:h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={computedData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="valueEur"
                    label={({ percentage, name }) => `${percentage}٪`}
                    labelLine={false}
                  >
                    {computedData.pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Pie Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
              {computedData.pieData.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-2 text-xs p-1.5 rounded-lg hover:bg-slate-900 transition"
                >
                  <span
                    className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-slate-300 text-[11px] truncate font-medium">{item.name}</p>
                    <p className="text-slate-400 text-[10px] font-mono">
                      {item.percentage}٪ ({formatAmount(item.valueEur, item.valueToman)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bar Chart: Estimated Costs Comparison */}
        {(activeChartView === "bar" || activeChartView === "both") && (
          <div
            className={`${
              activeChartView === "both" ? "lg:col-span-6" : "lg:col-span-12"
            } bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>مقایسه مبالغ سرفصل‌ها (نمودار ستونی Recharts)</span>
              </h3>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                {currencyMode === "eur" ? "مبالغ به یورو (€)" : "مبالغ به میلیون تومان"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              مقایسه ریالی و یورویی حجم مالی مورد نیاز هر فاز مهاجرتی
            </p>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={computedData.barData}
                  margin={{ top: 15, right: 10, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickFormatter={(val) =>
                      currencyMode === "eur" ? `€${val}` : `${val}M`
                    }
                  />
                  <ChartTooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey={currencyMode === "eur" ? "هزینه_یورو" : "هزینه_میلیون_تومان"}
                    radius={[8, 8, 0, 0]}
                  >
                    {computedData.barData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                برای بزرگنمایی جزئیات، نشانگر را روی ستون‌ها قرار دهید.
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                مجموع: {formatTotalAmount(computedData.totalEur, computedData.totalToman)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Detailed Line-Item Breakdown */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/70 mb-6">
        <button
          onClick={() => setExpandedDetails(!expandedDetails)}
          className="w-full flex items-center justify-between p-4 bg-slate-900/80 hover:bg-slate-900 text-right transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-white">
              مشاهده ریز هزینه‌ها، عوارض دولتی و راهکارهای صرفه‌جویی ({computedData.items.length} آیتم)
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-indigo-300 font-semibold">
            <span>{expandedDetails ? "بستن جزئیات" : "مشاهده اقلام"}</span>
            {expandedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {expandedDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="p-4 space-y-3 divide-y divide-slate-800/60"
            >
              {computedData.items.map((item) => {
                const meta = CATEGORY_META[item.category];
                const Icon = meta.icon;
                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                          <Icon className="w-3 h-3" />
                          {meta.nameFa}
                        </span>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        {item.isMandatory ? (
                          <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded font-medium">الزامی</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">اختیاری</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                        <span>زمان‌بندی: {item.timing}</span>
                        <span>•</span>
                        <span className="text-indigo-400">💡 {item.tips}</span>
                      </div>
                    </div>

                    <div className="text-left shrink-0 sm:border-r sm:border-slate-800 sm:pr-4">
                      <div className="text-sm font-black text-white font-mono">
                        {formatAmount(item.amountEur, item.amountToman)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {familyStatus === "single" ? "یک نفر" : familyStatus === "couple" ? "دو نفر" : "خانواده"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Practical German Living Budget Tips & Law */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-4 md:p-5 text-right">
        <h4 className="text-xs md:text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>قوانین طلایی مدیریت مالی مهاجرت به آلمان (FEG 2026):</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <strong className="block text-indigo-300 mb-1">۱. تقسیط قانونی ودیعه مسکن (Kaution)</strong>
            طبق قانون اجاره آلمان (§ 551 BGB)، صاحب‌خانه اجازه ندارد کل ودیعه را یکجا مطالبه کند. شما حق دارید آن را در ۳ قسط ماهانه متوالی بپردازید.
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <strong className="block text-emerald-300 mb-1">۲. بازپرداخت مالیاتی هزینه‌ها (Werbungskosten)</strong>
            رسیدهای ترجمه، آزمون زبان، بلیت پرواز و ویزا را نگه دارید. در اولین اظهارنامه مالیاتی (Steuererklärung) تا ۳۰٪ این هزینه‌ها مسترد می‌گردد.
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <strong className="block text-amber-300 mb-1">۳. حساب بانکی و کارت Deutschlandticket</strong>
            بلافاصله پس از ثبت آدرس شهرداری (Anmeldung)، حساب بانکی رایگان (N26 یا C24) باز کنید و کارت حمل‌ونقل ماهانه ۴۹ یورویی تهیه نمایید.
          </div>
        </div>
      </div>
    </div>
  );
}
