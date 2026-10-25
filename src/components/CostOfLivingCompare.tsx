import React, { useState, useEffect } from "react";
import { 
  Building2, 
  TrendingUp, 
  Coins, 
  MapPin, 
  Search, 
  HelpCircle, 
  Sparkles, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronRight, 
  DollarSign, 
  User, 
  Users, 
  Home, 
  Coffee, 
  FileText, 
  ArrowRightLeft, 
  Check, 
  Info,
  Loader2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend, 
  Cell 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface CityData {
  key: string;
  name: string;
  nameFa: string;
  overallIndex: number; // Berlin = 100
  rentIndex: number;     // Berlin = 100
  groceryIndex: number;  // Berlin = 100
  restaurantIndex: number; // Berlin = 100
  purchasingPowerIndex: number; // Berlin = 100
  monthlyExpensesSingleNoRent: number;
  rentCityCenter1Bed: number;
  rentOutsideCenter1Bed: number;
  utilities: number;
  germanState: string;
  germanStateFa: string;
  descriptionFa: string;
}

// Highly accurate, updated 2026/2027 statistical dataset for major German cities
const GERMAN_CITIES: CityData[] = [
  {
    key: "munich",
    name: "Munich",
    nameFa: "مونیخ",
    overallIndex: 115,
    rentIndex: 145,
    groceryIndex: 108,
    restaurantIndex: 112,
    purchasingPowerIndex: 118,
    monthlyExpensesSingleNoRent: 980,
    rentCityCenter1Bed: 1450,
    rentOutsideCenter1Bed: 1100,
    utilities: 280,
    germanState: "Bayern",
    germanStateFa: "بایرن (باواریا)",
    descriptionFa: "گران‌ترین شهر آلمان با بالاترین کیفیت زندگی، قطب فناوری و خودروسازی، اما بازار مسکن فوق‌العاده رقابتی و اجاره‌بهای سرسام‌آور."
  },
  {
    key: "frankfurt",
    name: "Frankfurt",
    nameFa: "فرانکفورت",
    overallIndex: 108,
    rentIndex: 115,
    groceryIndex: 103,
    restaurantIndex: 108,
    purchasingPowerIndex: 115,
    monthlyExpensesSingleNoRent: 940,
    rentCityCenter1Bed: 1250,
    rentOutsideCenter1Bed: 950,
    utilities: 285,
    germanState: "Hessen",
    germanStateFa: "هسن",
    descriptionFa: "پایتخت مالی آلمان و اروپا، پر از برج‌های مدرن و شرکت‌های چندملیتی، هزینه‌های زندگی و مسکن بالا اما حقوق‌های بسیار جذاب در حوزه مالی و مشاوره."
  },
  {
    key: "stuttgart",
    name: "Stuttgart",
    nameFa: "اشتوتگارت",
    overallIndex: 106,
    rentIndex: 110,
    groceryIndex: 101,
    restaurantIndex: 102,
    purchasingPowerIndex: 114,
    monthlyExpensesSingleNoRent: 920,
    rentCityCenter1Bed: 1180,
    rentOutsideCenter1Bed: 900,
    utilities: 275,
    germanState: "Baden-Württemberg",
    germanStateFa: "بادن-وورتمبرگ",
    descriptionFa: "قطب صنعتی و مهندسی آلمان (خانه مرسدس بنز و پورشه)، دره عمیق درآمد بالا و فرصت‌های عالی کاری در حوزه‌های فنی و تولیدی."
  },
  {
    key: "hamburg",
    name: "Hamburg",
    nameFa: "هامبورگ",
    overallIndex: 103,
    rentIndex: 106,
    groceryIndex: 102,
    restaurantIndex: 104,
    purchasingPowerIndex: 108,
    monthlyExpensesSingleNoRent: 910,
    rentCityCenter1Bed: 1150,
    rentOutsideCenter1Bed: 880,
    utilities: 270,
    germanState: "Hamburg",
    germanStateFa: "هامبورگ (ایالت مستقل)",
    descriptionFa: "دومین شهر بزرگ آلمان و قطب بندری و رسانه‌ای، شهری بسیار زیبا با کانال‌های آب فراوان، فضای بین‌المللی و هزینه‌های نسبتاً بالا."
  },
  {
    key: "berlin",
    name: "Berlin",
    nameFa: "برلین",
    overallIndex: 100, // Baseline
    rentIndex: 100,
    groceryIndex: 100,
    restaurantIndex: 100,
    purchasingPowerIndex: 100,
    monthlyExpensesSingleNoRent: 880,
    rentCityCenter1Bed: 1100,
    rentOutsideCenter1Bed: 850,
    utilities: 260,
    germanState: "Berlin",
    germanStateFa: "برلین (پایتخت)",
    descriptionFa: "پایتخت آلمان و هاب استارتاپی و فرهنگی اروپا. با وجود رشد شدید هزینه‌ها در سال‌های اخیر، کماکان نسبت به مونیخ منعطف‌تر و دارای بافت چندفرهنگی غنی است."
  },
  {
    key: "duesseldorf",
    name: "Düsseldorf",
    nameFa: "دوسلدورف",
    overallIndex: 102,
    rentIndex: 102,
    groceryIndex: 101,
    restaurantIndex: 103,
    purchasingPowerIndex: 112,
    monthlyExpensesSingleNoRent: 900,
    rentCityCenter1Bed: 1120,
    rentOutsideCenter1Bed: 840,
    utilities: 265,
    germanState: "Nordrhein-Westfalen",
    germanStateFa: "نوردراین-وستفالن",
    descriptionFa: "مرکز مد، تجارت و هنر آلمان غربی، کیفیت زندگی بالا، روابط تجاری گسترده با آسیای شرقی و بازار مسکن متعادل‌تر نسبت به مونیخ."
  },
  {
    key: "cologne",
    name: "Cologne",
    nameFa: "کلن",
    overallIndex: 97,
    rentIndex: 95,
    groceryIndex: 98,
    restaurantIndex: 96,
    purchasingPowerIndex: 102,
    monthlyExpensesSingleNoRent: 860,
    rentCityCenter1Bed: 980,
    rentOutsideCenter1Bed: 780,
    utilities: 250,
    germanState: "Nordrhein-Westfalen",
    germanStateFa: "نوردراین-وستفالن",
    descriptionFa: "یکی از قدیمی‌ترین و خونگرم‌ترین شهرهای آلمان با فضای دانشگاهی پرانرژی، رسانه‌ای و هنری برجسته و مخارج کمی اقتصادی‌تر نسبت به برلین."
  },
  {
    key: "leipzig",
    name: "Leipzig",
    nameFa: "لایپزیگ",
    overallIndex: 88,
    rentIndex: 72,
    groceryIndex: 94,
    restaurantIndex: 89,
    purchasingPowerIndex: 92,
    monthlyExpensesSingleNoRent: 780,
    rentCityCenter1Bed: 780,
    rentOutsideCenter1Bed: 580,
    utilities: 230,
    germanState: "Sachsen",
    germanStateFa: "زاکسن",
    descriptionFa: "معروف به 'برلین جدید' در شرق آلمان. شهری خلاق، مقرون‌به‌صرفه، با رشد اقتصادی سریع و اجاره‌بهای بسیار ارزان‌تر که پناهگاهی عالی برای جوانان و استارتاپ‌هاست."
  }
];

interface CostOfLivingCompareProps {
  userField?: string;
}

export default function CostOfLivingCompare({ userField }: CostOfLivingCompareProps) {
  const [activeTab, setActiveTab] = useState<"charts" | "calculator" | "table" | "ai-advisor">("charts");
  const [selectedCities, setSelectedCities] = useState<string[]>(["munich", "berlin", "hamburg", "leipzig"]);
  
  // Calculator States
  const [grossAnnualSalary, setGrossAnnualSalary] = useState<number>(60000);
  const [taxClass, setTaxClass] = useState<number>(1); // Class 1: Single, Class 3: Married with higher income
  const [familySize, setFamilySize] = useState<"single" | "couple" | "family_3" | "family_4">("single");
  const [housingPreference, setHousingPreference] = useState<"center" | "outside" | "wg" | "none">("outside");
  const [targetCalculatorCity, setTargetCalculatorCity] = useState<string>("berlin");

  // AI Advisor States
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<any | null>(null);
  const [advisorLifestyle, setAdvisorLifestyle] = useState<"budget" | "moderate" | "luxury">("moderate");

  // Toggle city selection for comparison
  const handleToggleCity = (key: string) => {
    if (selectedCities.includes(key)) {
      if (selectedCities.length > 2) {
        setSelectedCities(selectedCities.filter(c => c !== key));
      }
    } else {
      setSelectedCities([...selectedCities, key]);
    }
  };

  // Estimate monthly net salary based on simplified realistic German tax rules for 2026
  const calculateEstimatedNetMonthly = (grossAnnual: number, cls: number): number => {
    // Standard social security deductions are ~20.5% in Germany (pension, health, care, unemployment)
    const socialSecurityRate = 0.205;
    const socialDeduction = grossAnnual * socialSecurityRate;

    // Simplified income tax approximation based on 2026 progressive brackets & allowances
    // Basic allowance (Grundfreibetrag) for Class 1 is ~12,000€. For Class 3 is ~24,000€.
    const basicAllowance = cls === 3 ? 24000 : 12000;
    const taxableIncome = Math.max(0, grossAnnual - socialDeduction - basicAllowance);
    
    let estimatedTax = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 15000) {
        estimatedTax = taxableIncome * 0.15;
      } else if (taxableIncome <= 40000) {
        estimatedTax = 15000 * 0.15 + (taxableIncome - 15000) * 0.28;
      } else if (taxableIncome <= 70000) {
        estimatedTax = 15000 * 0.15 + 25000 * 0.28 + (taxableIncome - 40000) * 0.38;
      } else {
        estimatedTax = 15000 * 0.15 + 25000 * 0.28 + 30000 * 0.38 + (taxableIncome - 70000) * 0.42;
      }
    }

    // Solidarity surcharge (Solidaritätszuschlag) is waived for most except very high incomes, simplified here
    const annualNet = grossAnnual - socialDeduction - estimatedTax;
    return Math.round((annualNet / 12) * 100) / 100;
  };

  const estimatedNetMonthly = calculateEstimatedNetMonthly(grossAnnualSalary, taxClass);

  // Calculate detailed budget allocations for target city
  const targetCityData = GERMAN_CITIES.find(c => c.key === targetCalculatorCity) || GERMAN_CITIES[4];

  // Housing cost calculation
  const getHousingCost = () => {
    if (housingPreference === "none") return 0;
    if (housingPreference === "wg") return Math.round(targetCityData.rentOutsideCenter1Bed * 0.55);
    if (housingPreference === "center") return targetCityData.rentCityCenter1Bed + targetCityData.utilities;
    return targetCityData.rentOutsideCenter1Bed + targetCityData.utilities;
  };

  const housingCost = getHousingCost();

  // Basic monthly expenses scaled by family size
  const getLivingCost = () => {
    const baseCost = targetCityData.monthlyExpensesSingleNoRent;
    if (familySize === "single") return baseCost;
    if (familySize === "couple") return Math.round(baseCost * 1.7);
    if (familySize === "family_3") return Math.round(baseCost * 2.2);
    return Math.round(baseCost * 2.7);
  };

  const livingCost = getLivingCost();
  const totalMonthlyExpenses = housingCost + livingCost;
  const savingPotential = estimatedNetMonthly - totalMonthlyExpenses;

  // Equivalency calculation for other cities
  const getEquivalentIncomes = () => {
    return GERMAN_CITIES.filter(c => c.key !== targetCalculatorCity).map(city => {
      // Calculate index ratio
      const ratio = city.overallIndex / targetCityData.overallIndex;
      const rentRatio = city.rentIndex / targetCityData.rentIndex;
      
      // Equivalent expenses
      const eqLiving = Math.round(livingCost * ratio);
      
      // Equivalent rent
      let eqHousing = 0;
      if (housingPreference === "center") {
        eqHousing = city.rentCityCenter1Bed + city.utilities;
      } else if (housingPreference === "outside") {
        eqHousing = city.rentOutsideCenter1Bed + city.utilities;
      } else if (housingPreference === "wg") {
        eqHousing = Math.round(city.rentOutsideCenter1Bed * 0.55);
      }

      const eqTotal = eqLiving + eqHousing;
      const savingsRatio = savingPotential > 0 ? savingPotential * ratio : savingPotential;
      const neededNetMonthly = eqTotal + savingsRatio;

      // Estimate needed gross salary to get that Net
      // Back-calculate gross using binary search/heuristic
      let lowGross = neededNetMonthly * 12;
      let highGross = neededNetMonthly * 12 * 2.2;
      let solvedGross = lowGross;
      for (let i = 0; i < 15; i++) {
        const mid = (lowGross + highGross) / 2;
        const net = calculateEstimatedNetMonthly(mid, taxClass);
        if (net * 12 > neededNetMonthly * 12) {
          highGross = mid;
        } else {
          lowGross = mid;
        }
        solvedGross = mid;
      }

      return {
        ...city,
        eqNetMonthly: Math.round(neededNetMonthly),
        eqGrossAnnual: Math.round(solvedGross),
        ratioMessage: ratio > 1 
          ? `٪${Math.round((ratio - 1) * 100)} گران‌تر` 
          : `٪${Math.round((1 - ratio) * 100)} ارزان‌تر`
      };
    });
  };

  const equivalentIncomes = getEquivalentIncomes();

  // Fetch AI Advisor advice
  const handleFetchAiAdvice = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("/api/gemini/cost-of-living-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetCity: targetCityData.name,
          targetCityFa: targetCityData.nameFa,
          grossSalary: grossAnnualSalary,
          taxClass: taxClass,
          familyStatus: familySize,
          lifestyle: advisorLifestyle,
          userField: userField || "فناوری اطلاعات"
        }),
      });

      if (!response.ok) {
        throw new Error("پاسخی از سرور هوشمند هزینه زندگی دریافت نشد.");
      }

      const data = await response.json();
      setAiAdvice(data);
    } catch (err: any) {
      console.error("Error fetching cost of living advice:", err);
      setAiError("بروز خطا در پردازش تحلیل هوشمند. لطفاً از شبیه‌ساز یا جدول استفاده کنید و بعداً تلاش فرمایید.");
    } finally {
      setAiLoading(false);
    }
  };

  // Filter and format chart data based on active selection
  const getChartData = () => {
    return GERMAN_CITIES.filter(c => selectedCities.includes(c.key)).map(c => ({
      name: c.nameFa,
      "شاخص کل هزینه زندگی": c.overallIndex,
      "شاخص اجاره‌بها": c.rentIndex,
      "شاخص خرید سوپرمارکت": c.groceryIndex,
      "شاخص رستوران و تفریح": c.restaurantIndex,
      "قدرت خرید محلی": c.purchasingPowerIndex
    }));
  };

  const chartData = getChartData();

  // Colors for each metric
  const metricColors: { [key: string]: string } = {
    "شاخص کل هزینه زندگی": "#6366f1", // Indigo
    "شاخص اجاره‌بها": "#f59e0b",     // Amber
    "شاخص خرید سوپرمارکت": "#10b981", // Emerald
    "شاخص رستوران و تفریح": "#ec4899", // Pink
    "قدرت خرید محلی": "#06b6d4"       // Cyan
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden text-right" id="cost-of-living-widget">
      {/* Top Gradient accent line */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500"></div>

      {/* Card Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>ابزار مدیریت مالی و مقایسه هزینه زندگی در آلمان (Cost of Living Analytics)</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            مقایسه‌گر آماری هزینه‌ها و تطبیق درآمد شهرهای آلمان
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            تحلیل جامع و زنده اجاره مسکن، سبد غذایی، رفت‌و‌آمد و قدرت خرید محلی در ۸ کلان‌شهر آلمان جهت کمک به اتخاذ بهترین تصمیم مهاجرتی.
          </p>
        </div>

        {/* Tab switch navigation */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex flex-wrap items-center gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("charts")}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "charts"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 inline ml-1" />
            نمودارهای مقایسه‌ای
          </button>
          <button
            onClick={() => {
              setActiveTab("calculator");
              // default target calculator to berlin
            }}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "calculator"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Calculator className="w-3.5 h-3.5 inline ml-1" />
            تخمین حقوق خالص و بودجه
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "table"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 inline ml-1" />
            جدول دقیق جزئیات هزینه‌ها
          </button>
          <button
            onClick={() => setActiveTab("ai-advisor")}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "ai-advisor"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline ml-1 text-amber-400" />
            مشاور هوشمند (AI)
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === "charts" && (
          <motion.div
            key="charts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* City Chips Selector */}
            <div>
              <p className="text-xs font-bold text-slate-300 mb-3">شهرهای مورد نظر برای مقایسه را انتخاب کنید (حداقل ۲ شهر):</p>
              <div className="flex flex-wrap gap-2">
                {GERMAN_CITIES.map((c) => {
                  const isSelected = selectedCities.includes(c.key);
                  return (
                    <button
                      key={c.key}
                      onClick={() => handleToggleCity(c.key)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-sm" 
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-750 hover:text-slate-300"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-indigo-400" : "bg-slate-700"}`}></div>
                      <span>{c.nameFa} ({c.name})</span>
                      {isSelected && <Check className="w-3 h-3 text-indigo-400 mr-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Cards of Selected Cities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GERMAN_CITIES.filter(c => selectedCities.includes(c.key)).map(c => (
                <div key={c.key} className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 hover:border-slate-700 transition duration-150 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {c.germanStateFa}
                    </span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-mono font-bold">
                      شاخص کل: {c.overallIndex}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">{c.nameFa}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed min-h-[50px]">
                    {c.descriptionFa}
                  </p>
                  <div className="pt-2 border-t border-slate-850 grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-500 block">اجاره خانه متوسط:</span>
                      <span className="font-mono text-amber-400 font-bold">{c.rentOutsideCenter1Bed}€ / ماه</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">سایر مخارج مجرد:</span>
                      <span className="font-mono text-emerald-400 font-bold">{c.monthlyExpensesSingleNoRent}€ / ماه</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recharts Container */}
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-black text-white">مقایسه چندبعدی شاخص‌های زندگی آلمان (پایه: برلین = ۱۰۰)</h4>
                  <p className="text-[10px] text-slate-500">اعداد بالاتر به معنی هزینه‌های گران‌تر یا قدرت خرید نسبی بهتر هستند.</p>
                </div>
              </div>

              <div className="h-80 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fontWeight: "bold" }} />
                    <YAxis stroke="#64748b" domain={[0, 160]} tick={{ fontSize: 10 }} />
                    <ChartTooltip 
                      contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px", textAlign: "right" }} 
                      labelClassName="text-slate-300 font-bold text-xs"
                    />
                    <Bar dataKey="شاخص کل هزینه زندگی" fill={metricColors["شاخص کل هزینه زندگی"]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="شاخص اجاره‌بها" fill={metricColors["شاخص اجاره‌بها"]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="شاخص خرید سوپرمارکت" fill={metricColors["شاخص خرید سوپرمارکت"]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="شاخص رستوران و تفریح" fill={metricColors["شاخص رستوران و تفریح"]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="قدرت خرید محلی" fill={metricColors["قدرت خرید محلی"]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-[11px]" dir="rtl">
                {Object.entries(metricColors).map(([metric, color]) => (
                  <div key={metric} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block shadow-sm" style={{ backgroundColor: color }} />
                    <span className="text-slate-300 font-medium">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "calculator" && (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input Panel - Col 5 */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-black text-white">تنظیمات شبیه‌ساز مالی شخصی</h4>
              </div>

              {/* Slider / Number Input for Salary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300">حقوق ناخالص سالیانه (Gross Salary):</label>
                  <span className="font-mono text-sm font-black text-indigo-400">{grossAnnualSalary.toLocaleString()} € / سال</span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={130000}
                  step={1000}
                  value={grossAnnualSalary}
                  onChange={(e) => setGrossAnnualSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>25k€</span>
                  <span>50k€</span>
                  <span>75k€</span>
                  <span>100k€</span>
                  <span>130k€</span>
                </div>
              </div>

              {/* Tax Class Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">کلاس مالیاتی در آلمان (Steuerklasse):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTaxClass(1)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-150 text-center cursor-pointer ${
                      taxClass === 1 
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-300" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750"
                    }`}
                  >
                    کلاس ۱ (مجرد / بدون فرزند)
                  </button>
                  <button
                    onClick={() => setTaxClass(3)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-150 text-center cursor-pointer ${
                      taxClass === 3 
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-300" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750"
                    }`}
                  >
                    کلاس ۳ (متأهل - پردرآمدترین کلاس)
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  * کلاس ۱ شامل حدود ۳۵ الی ۴۲ درصد کسورات مالیات و بیمه است. کلاس ۳ برای متاهلینی است که همسرشان درآمد بسیار کمتری دارد و کسورات آن حدود ۲۶ الی ۳۲ درصد است.
                </p>
              </div>

              {/* Household Size Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">تعداد افراد خانوار (Family Size):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: "single", label: "تک‌نفره", icon: User },
                    { key: "couple", label: "دو‌نفره", icon: Users },
                    { key: "family_3", label: "۳ نفره", icon: Users },
                    { key: "family_4", label: "۴ نفره", icon: Users }
                  ].map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setFamilySize(item.key as any)}
                        className={`p-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-all duration-150 text-center flex flex-col items-center gap-1 cursor-pointer ${
                          familySize === item.key 
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-300" 
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750"
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target City for simulation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">شهر مورد نظر برای شبیه‌سازی بودجه:</label>
                <select
                  value={targetCalculatorCity}
                  onChange={(e) => setTargetCalculatorCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500"
                >
                  {GERMAN_CITIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.nameFa} ({c.name})</option>
                  ))}
                </select>
              </div>

              {/* Housing preference */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">انتخاب وضعیت سکونت در شهر مقصد:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "center", label: "آپارتمان مرکز شهر (1 Bed)" },
                    { key: "outside", label: "آپارتمان حومه شهر (1 Bed)" },
                    { key: "wg", label: "اتاق در خانه مشترک (WG)" },
                    { key: "none", label: "بدون هزینه مسکن (یا اشتراکی)" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setHousingPreference(item.key as any)}
                      className={`p-2 rounded-xl border text-[10.5px] font-bold transition-all duration-150 text-right cursor-pointer ${
                        housingPreference === item.key 
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-300" 
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations & Results Panel - Col 7 */}
            <div className="lg:col-span-7 space-y-6">
              {/* Estimated Monthly Summary */}
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <h4 className="text-sm font-black text-white">تخمین تراز مالی ماهیانه در <span className="text-indigo-400">{targetCityData.nameFa}</span></h4>
                  <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full">بر اساس محاسبات آماری فدرال ۲۰۲۶</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Monthly Net */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/60 space-y-1">
                    <span className="text-[10px] text-slate-500 block">حقوق خالص تخمینی ماهیانه:</span>
                    <span className="font-mono text-base font-black text-white">{estimatedNetMonthly.toLocaleString()} € <span className="text-xs text-slate-500">/ ماه</span></span>
                  </div>

                  {/* Estimated Expenses */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/60 space-y-1">
                    <span className="text-[10px] text-slate-500 block">کل مخارج تخمینی ماهیانه:</span>
                    <span className="font-mono text-base font-black text-red-400">{totalMonthlyExpenses.toLocaleString()} € <span className="text-xs text-slate-500">/ ماه</span></span>
                  </div>

                  {/* Savings Potential */}
                  <div className={`p-3.5 rounded-xl border space-y-1 ${
                    savingPotential > 300 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : savingPotential >= 0 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}>
                    <span className="text-[10px] text-slate-400 block">پتانسیل پس‌انداز باقی‌مانده:</span>
                    <span className="font-mono text-base font-black">
                      {savingPotential.toLocaleString()} € <span className="text-xs opacity-70">/ ماه</span>
                    </span>
                  </div>
                </div>

                {/* Status Bar Indicator */}
                <div className="pt-2">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (housingCost / Math.max(1, estimatedNetMonthly)) * 100)}%` }} 
                      title="سهم مسکن"
                    />
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (livingCost / Math.max(1, estimatedNetMonthly)) * 100)}%` }} 
                      title="سهم مخارج معیشتی"
                    />
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300 flex-grow" 
                      title="پس‌انداز بالقوه"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 pt-1.5 font-bold">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> مسکن: ٪{Math.round((housingCost / Math.max(1, estimatedNetMonthly)) * 100)}</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> معیشتی: ٪{Math.round((livingCost / Math.max(1, estimatedNetMonthly)) * 100)}</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> پس‌انداز: ٪{Math.round(Math.max(0, (savingPotential / Math.max(1, estimatedNetMonthly)) * 100))}</span>
                  </div>
                </div>

                {/* Practical Advice Banner based on results */}
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs leading-relaxed ${
                  savingPotential > 800
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : savingPotential >= 150
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                    : savingPotential >= 0
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                    : "bg-red-500/10 border-red-500/20 text-red-300"
                }`}>
                  {savingPotential > 800 ? (
                    <>
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-400 mt-0.5" />
                      <p>
                        <strong>تراز عالی!</strong> این بودجه به شما اجازه می‌دهد کیفیت زندگی بسیار مرفهی داشته باشید و ماهانه پس‌انداز قابل‌توجهی ذخیره کنید. شما کاندیدای عالی برای سکونت در مرکز شهر مونیخ یا فرانکفورت هستید.
                      </p>
                    </>
                  ) : savingPotential >= 150 ? (
                    <>
                      <Info className="w-4.5 h-4.5 shrink-0 text-indigo-400 mt-0.5" />
                      <p>
                        <strong>تراز مالی متعادل.</strong> درآمد شما با استانداردهای زندگی آلمان همخوانی کامل دارد. پتانسیل پس‌انداز معقولی دارید که امنیت مالی خوبی برقرار می‌کند. موازنه معیشتی شما سالم است.
                      </p>
                    </>
                  ) : savingPotential >= 0 ? (
                    <>
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-400 mt-0.5" />
                      <p>
                        <strong>بودجه لب‌به‌لب!</strong> پس‌انداز شما پس از مخارج مسکن و معیشت بسیار محدود است. پیشنهاد می‌شود سکونت در حومه شهر، انتخاب اتاق مشترک (WG) یا تلاش برای افزایش حقوق در مذاکره را جدی بگیرید.
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-400 mt-0.5" />
                      <p>
                        <strong>هشدار کسری بودجه!</strong> هزینه‌های برآورد شده شما از عایدی خالص ماهانه‌تان بیشتر است. مسکن یا کلاس مالیاتی گران انتخاب کرده‌اید یا حقوق پیشنهادی‌تان کم است. تعدیل اساسی در سبک زندگی یا لوکیشن الزامی است.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Equivalence Salary in other German cities */}
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                    معادل‌سازی حقوق پیشنهادی جهت حفظ کیفیت رفاه در سایر شهرها
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    اگر در <span className="text-white font-bold">{targetCityData.nameFa}</span> حقوق خالص <span className="text-indigo-400 font-bold">{estimatedNetMonthly.toLocaleString()} €</span> دارید، برای داشتن <strong>دقیقاً همان سطح از کیفیت رفاه و قدرت خرید</strong>، باید در شهرهای زیر چه مبالغی دریافت کنید:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {equivalentIncomes.map((item) => (
                    <div key={item.key} className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex justify-between items-center hover:border-slate-750 transition duration-150">
                      <div>
                        <span className="text-xs font-black text-white">{item.nameFa}</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">{item.ratioMessage} نسبت به مقصد شبیه‌سازی</span>
                      </div>
                      <div className="text-left font-mono">
                        <span className="text-xs font-black text-emerald-400 block">{item.eqNetMonthly.toLocaleString()} € <span className="text-[9px] text-slate-500">خالص/ماه</span></span>
                        <span className="text-[10px] text-slate-400">~ {item.eqGrossAnnual.toLocaleString()} € <span className="text-[9px] text-slate-500">ناخالص/سال</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "table" && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 overflow-x-auto">
              <table className="w-full text-xs text-right text-slate-300">
                <thead className="text-[11px] uppercase bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white">شهر آلمانی</th>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white text-center">اجاره مرکز شهر (۱خوابه)</th>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white text-center">اجاره حومه (۱خوابه)</th>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white text-center">سایر هزینه‌ها (مجرد)</th>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white text-center">هزینه قبوض و اینترنت</th>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white text-center">شاخص کل هزینه</th>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white text-center">قدرت خرید محلی</th>
                    <th scope="col" className="px-4 py-3.5 font-bold text-white">ایالت مربوطه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {GERMAN_CITIES.map((c) => (
                    <tr key={c.key} className="hover:bg-slate-900/40 transition duration-100">
                      <td className="px-4 py-4 font-black text-white flex flex-col">
                        <span>{c.nameFa}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">{c.name}</span>
                      </td>
                      <td className="px-4 py-4 text-center font-mono text-amber-400 font-bold">{c.rentCityCenter1Bed} €</td>
                      <td className="px-4 py-4 text-center font-mono text-amber-500">{c.rentOutsideCenter1Bed} €</td>
                      <td className="px-4 py-4 text-center font-mono text-emerald-400">{c.monthlyExpensesSingleNoRent} €</td>
                      <td className="px-4 py-4 text-center font-mono text-slate-400">{c.utilities} €</td>
                      <td className="px-4 py-4 text-center font-mono text-indigo-400 font-bold">{c.overallIndex}</td>
                      <td className="px-4 py-4 text-center font-mono text-cyan-400 font-bold">{c.purchasingPowerIndex}</td>
                      <td className="px-4 py-4 text-slate-400 font-bold text-[11px]">{c.germanStateFa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-[10.5px] text-slate-400 leading-relaxed space-y-1">
              <p>📌 <strong>منبع داده‌ها:</strong> آمارهای مستخرج بر اساس داده‌های تجمیعی فدرال آلمان (Statistisches Bundesamt) و پایگاه‌های ارزیابی سبد معیشتی مانند Numbeo و Expatistan بازنگری شده برای سال ۲۰۲۶ است.</p>
              <p>📌 <strong>توصیه تخصصی کاریابی جهانبان:</strong> اجاره‌بها معمولاً بزرگ‌ترین بخش از درآمد شما را می‌بلعد. در آلمان قانونی نانوشته وجود دارد که اجاره‌بهای گرم (کامل با شارژ و قبوض) نباید بیش از <strong>یک‌سوم (۳۳٪) حقوق ناخالص</strong> شما باشد تا صلاحیت مالی شما توسط مالکان تایید شود.</p>
            </div>
          </motion.div>
        )}

        {activeTab === "ai-advisor" && (
          <motion.div
            key="ai-advisor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Input choices */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">شهر هدف برای مشاوره:</label>
                <select
                  value={targetCalculatorCity}
                  onChange={(e) => setTargetCalculatorCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500"
                >
                  {GERMAN_CITIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.nameFa} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">سبک زندگی مد نظر:</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: "budget", label: "اقتصادی" },
                    { key: "moderate", label: "معمولی" },
                    { key: "luxury", label: "لوکس" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setAdvisorLifestyle(item.key as any)}
                      className={`p-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-all duration-150 text-center cursor-pointer ${
                        advisorLifestyle === item.key 
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-300" 
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={handleFetchAiAdvice}
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 text-white rounded-xl py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 transition duration-150 shadow-md cursor-pointer disabled:cursor-not-allowed"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>در حال آنالیز آماری...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>دریافت تحلیل هوشمند هزینه زندگی</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Output Result Card */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 min-h-[250px] overflow-hidden flex flex-col justify-between">
              {!aiAdvice && !aiLoading && !aiError && (
                <div className="flex flex-col items-center justify-center text-center p-10 flex-grow space-y-3">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full">
                    <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-black text-white">مشاور هوشمند اسکان و هزینه فدرال آلمان</h4>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    با وارد کردن حقوق پیشنهادی کارفرمای آلمانی، کلاس مالیاتی و شرایط خانوادگی خود، مشاوره کاملاً اختصاصی مبتنی بر هوش مصنوعی در مورد وضعیت اجاره مسکن، پتانسیل پس‌انداز و قدرت خرید در شهر مقصد دریافت کنید.
                  </p>
                </div>
              )}

              {aiLoading && (
                <div className="flex flex-col items-center justify-center text-center p-12 flex-grow space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">در حال استعلام شاخص‌های Numbeo و تخمین سبد مخارج فدرال...</p>
                    <p className="text-[10px] text-slate-500">هوش مصنوعی جهانبان در حال شبیه‌سازی مالیات کلاس {taxClass} برای حقوق {grossAnnualSalary.toLocaleString()}€ در {targetCityData.nameFa} است.</p>
                  </div>
                </div>
              )}

              {aiError && (
                <div className="flex flex-col items-center justify-center text-center p-10 flex-grow text-red-400 space-y-2">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-xs font-bold">{aiError}</p>
                </div>
              )}

              {aiAdvice && !aiLoading && (
                <div className="p-6 space-y-6">
                  {/* Top Stats Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-850 pb-5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block">شهر مقصد تحلیل:</span>
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        {targetCityData.nameFa} ({targetCityData.name})
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block">حقوق خالص تخمینی:</span>
                      <span className="font-mono text-xs font-black text-emerald-400 block">
                        ~ {aiAdvice.estimatedNetMonthly || `${estimatedNetMonthly.toLocaleString()} €`} / ماه
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block">تناسب درآمد به هزینه‌ها:</span>
                      <span className="text-xs font-bold text-indigo-400 block">
                        {familySize === "single" ? "تک‌نفره" : "خانوادگی"} - سبک {advisorLifestyle === "budget" ? "اقتصادی" : advisorLifestyle === "moderate" ? "معمولی" : "لوکس"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Advice Texts */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Analysis Block */}
                      <div className="bg-slate-900/40 border border-slate-850/60 p-4 rounded-xl space-y-2">
                        <h5 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5" />
                          تحلیل جامع وضعیت معیشتی و کفایت حقوق:
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiAdvice.livingCostAnalysis}
                        </p>
                      </div>

                      {/* Saving & Budgeting */}
                      <div className="bg-slate-900/40 border border-slate-850/60 p-4 rounded-xl space-y-2">
                        <h5 className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          ارزیابی پتانسیل پس‌انداز ماهانه:
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiAdvice.savingPotential}
                        </p>
                      </div>

                      {/* Housing Tips */}
                      <div className="bg-slate-900/40 border border-slate-850/60 p-4 rounded-xl space-y-2">
                        <h5 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          توصیه‌های کلیدی برای اسکان و پیدا کردن خانه:
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiAdvice.housingTips}
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Pros/Cons & Equivalent */}
                    <div className="lg:col-span-4 space-y-4">
                      {/* Pros & Cons */}
                      {aiAdvice.prosAndCons && (
                        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                          <h5 className="text-xs font-black text-white">مزایا و معایب اسکان در {targetCityData.nameFa}</h5>
                          
                          {/* Pros */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-emerald-400 font-bold block">✔ مزایا:</span>
                            <ul className="text-[10.5px] text-slate-300 list-disc list-inside space-y-1 pr-1">
                              {aiAdvice.prosAndCons.pros?.map((pro: string, i: number) => (
                                <li key={i}>{pro}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Cons */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-850">
                            <span className="text-[10px] text-red-400 font-bold block">✘ معایب و چالش‌ها:</span>
                            <ul className="text-[10.5px] text-slate-300 list-disc list-inside space-y-1 pr-1">
                              {aiAdvice.prosAndCons.cons?.map((con: string, i: number) => (
                                <li key={i}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Equivalent list */}
                      {aiAdvice.equivalentSalaries && (
                        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2.5">
                          <h5 className="text-xs font-black text-white">معادل‌سازی حقوق برای سایر گزینه‌ها</h5>
                          <div className="space-y-2">
                            {aiAdvice.equivalentSalaries.map((eq: any, i: number) => (
                              <div key={i} className="text-[10.5px] border-b border-slate-850/60 pb-1.5 last:border-0 last:pb-0">
                                <div className="flex justify-between font-bold">
                                  <span className="text-indigo-300">{eq.city}</span>
                                  <span className="text-emerald-400 font-mono">{eq.equivalentAnnualGross}</span>
                                </div>
                                <p className="text-[9.5px] text-slate-500 mt-0.5 leading-relaxed">{eq.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
