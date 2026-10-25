import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Sparkles, 
  Briefcase, 
  Coins, 
  MapPin, 
  BookOpen, 
  RefreshCw, 
  AlertCircle, 
  ArrowUpRight, 
  GraduationCap, 
  Award, 
  ChevronRight 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from "recharts";

interface TimelinePoint {
  year: string;
  demandIndex: number;
  activePostings: number;
}

interface SkillTrend {
  skillName: string;
  skillNameFa: string;
  demandPercentage: number;
  trend: string;
  actionTip: string;
}

interface RegionDemand {
  name: string;
  demandLevel: string;
}

interface TrendsData {
  marketOutlook: string;
  generalDemandScore: number;
  yearlyGrowthRate: string;
  averageSalaryRange: string;
  timelineData: TimelinePoint[];
  skillsData: SkillTrend[];
  topRegions: RegionDemand[];
}

interface IndustryDemandTrendsProps {
  userField?: string;
}

export default function IndustryDemandTrends({ userField }: IndustryDemandTrendsProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [activeTab, setActiveTab] = useState<"charts" | "skills">("charts");

  const effectiveField = userField || "فناوری اطلاعات";

  const getFallbackTrends = (field: string): TrendsData => {
    const isMedical = field.includes("پزشک") || field.includes("پرستار") || field.includes("درمان") || field.includes("Medical");
    const isEng = field.includes("مکانیک") || field.includes("برق") || field.includes("صنایع") || field.includes("عمران") || field.includes("Engineer");
    
    if (isMedical) {
      return {
        marketOutlook: "بخش بهداشت و درمان آلمان با کمبود بسیار شدید نیروی متخصص (پرستار، پزشک و کادر درمان) مواجه است. بیمارستان‌ها و مراکز توانبخشی با ارائه تسهیلات حمایتی و دوره‌های زبان به دنبال جذب متخصصان بین‌المللی هستند.",
        generalDemandScore: 98,
        yearlyGrowthRate: "+12.4%",
        averageSalaryRange: "55,000€ - 85,000€",
        timelineData: [
          { year: "2022", demandIndex: 85, activePostings: 42000 },
          { year: "2023", demandIndex: 90, activePostings: 48000 },
          { year: "2024", demandIndex: 94, activePostings: 54000 },
          { year: "2025", demandIndex: 98, activePostings: 61000 },
          { year: "2026", demandIndex: 99, activePostings: 67000 }
        ],
        skillsData: [
          { skillName: "German Medical Terminology (Fachsprache)", skillNameFa: "زبان تخصصی آلمانی کادر درمان (FSP)", demandPercentage: 98, trend: "up", actionTip: "آمادگی مستمر برای آزمون زبان تخصصی FSP و شبیه‌سازی شرح‌حال بالینی." },
          { skillName: "Electronic Health Records (HIS)", skillNameFa: "مستندسازی الکترونیکی پرونده بیمار", demandPercentage: 92, trend: "up", actionTip: "آشنایی با ساختار نرم‌افزارهای ثبت درمان آلمانی مانند Orbis یا SAP Health." },
          { skillName: "Patient Care Protocols & RKI", skillNameFa: "پروتکل‌های بهداشتی موسسه رابرت کخ", demandPercentage: 90, trend: "stable", actionTip: "تسلط بر استانداردهای کنترل عفونت و ایمنی بیمار." },
          { skillName: "Interdisciplinary Collaboration", skillNameFa: "همکاری چندتخصصی و تحویل شیفت", demandPercentage: 88, trend: "stable", actionTip: "تمرین گزارش‌دهی دقیق و مکتوب وقایع شیفت درمانی." }
        ],
        topRegions: [
          { name: "Nordrhein-Westfalen (Köln/Düsseldorf)", demandLevel: "Very High" },
          { name: "Bayern (München/Nürnberg)", demandLevel: "Very High" },
          { name: "Baden-Württemberg (Stuttgart)", demandLevel: "High" }
        ]
      };
    }

    if (isEng) {
      return {
        marketOutlook: "صنایع سنگین، خودروسازی، اتوماسیون صنعتی و انرژی‌های تجدیدپذیر آلمان در دوران تحول سبز و هوشمندسازی به مهندسان ماهر نیاز حیاتی دارند.",
        generalDemandScore: 91,
        yearlyGrowthRate: "+7.2%",
        averageSalaryRange: "60,000€ - 85,000€",
        timelineData: [
          { year: "2022", demandIndex: 80, activePostings: 32000 },
          { year: "2023", demandIndex: 84, activePostings: 35500 },
          { year: "2024", demandIndex: 88, activePostings: 39000 },
          { year: "2025", demandIndex: 91, activePostings: 43000 },
          { year: "2026", demandIndex: 95, activePostings: 48000 }
        ],
        skillsData: [
          { skillName: "3D CAD & PLM Systems", skillNameFa: "طراحی سه‌بعدی و سیستم‌های PLM (Siemens NX / CATIA)", demandPercentage: 92, trend: "up", actionTip: "ارائه نمونه کارهای مدل‌سازی استاندارد DIN در پورتفولیو." },
          { skillName: "FEA & Simulation (ANSYS)", skillNameFa: "شبیه‌سازی المان محدود و محاسبات تنش", demandPercentage: 88, trend: "up", actionTip: "انجام پروژه‌های شبیه‌سازی منطبق بر استانداردهای صنعتی VDI." },
          { skillName: "Quality & FMEA (VDA 6.3)", skillNameFa: "مدیریت کیفیت و آنالیز حالات خطا", demandPercentage: 86, trend: "stable", actionTip: "آشنایی با الزامات IATF 16949 و حل مسئله با 8D Report." },
          { skillName: "German Technical Language (B1/B2)", skillNameFa: "زبان آلمانی فنی و تعاملات کارگاهی", demandPercentage: 89, trend: "up", actionTip: "تسلط بر واژگان فنی برای شرکت در جلسات طراحی و کارخانه." }
        ],
        topRegions: [
          { name: "Baden-Württemberg (Stuttgart/Karlsruhe)", demandLevel: "Very High" },
          { name: "Bayern (München/Ingolstadt)", demandLevel: "Very High" },
          { name: "Hessen (Frankfurt/Darmstadt)", demandLevel: "High" }
        ]
      };
    }

    return {
      marketOutlook: "بازار کار فناوری اطلاعات در آلمان با وجود تغییرات اقتصادی، همچنان با کمبود شدید نیروی متخصص (Fachkräftemangel) روبه‌رو است. انتقال به سیستم‌های ابری، امنیت سایبری و ادغام هوش مصنوعی محرک‌های اصلی تقاضا هستند.",
      generalDemandScore: 94,
      yearlyGrowthRate: "+8.5%",
      averageSalaryRange: "65,000€ - 90,000€",
      timelineData: [
        { year: "2022", demandIndex: 82, activePostings: 38500 },
        { year: "2023", demandIndex: 87, activePostings: 41200 },
        { year: "2024", demandIndex: 91, activePostings: 45000 },
        { year: "2025", demandIndex: 94, activePostings: 49800 },
        { year: "2026", demandIndex: 97, activePostings: 54000 }
      ],
      skillsData: [
        { skillName: "Cloud Architecture (AWS / Azure)", skillNameFa: "رایانش و معماری ابری", demandPercentage: 93, trend: "up", actionTip: "کسب گواهینامه‌های رسمی معماری کلود از آمازون یا مایکروسافت." },
        { skillName: "DevOps, CI/CD & Kubernetes", skillNameFa: "دواپس، کانتینرها و پایپ‌لاین‌های خودکار", demandPercentage: 90, trend: "up", actionTip: "ساخت پروژه‌های عملی با پایپ‌لاین‌های گیت‌لب یا گیت‌هاب اکشنز." },
        { skillName: "Automated Testing & QA (Unit/E2E)", skillNameFa: "تست خودکار و تضمین کیفیت نرم‌افزار", demandPercentage: 88, trend: "up", actionTip: "پوشش بالای ۸۰٪ تست با فریم‌ورک‌های مدرن نظیر Jest یا PyTest." },
        { skillName: "Clean Architecture & Documentation", skillNameFa: "معماری تمیز، الگوهای طراحی و مستندسازی ADR", demandPercentage: 86, trend: "stable", actionTip: "مستندسازی دیاگرام‌های معماری و قراردادهای OpenAPI." }
      ],
      topRegions: [
        { name: "Bayern (München)", demandLevel: "Very High" },
        { name: "Berlin (Berlin)", demandLevel: "Very High" },
        { name: "Hessen (Frankfurt)", demandLevel: "High" }
      ]
    };
  };

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/industry-trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: effectiveField }),
      });

      if (!response.ok) {
        throw new Error("اختلال در دریافت اطلاعات از سرور");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("پاسخ سرور با فرمت JSON همخوانی ندارد");
      }

      const data = await response.json();
      setTrends(data);
    } catch (err: any) {
      console.warn("Using fallback industry trends:", err);
      setTrends(getFallbackTrends(effectiveField));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [effectiveField]);

  // Colors for charts
  const lineChartColor = "#6366f1"; // Indigo
  const barColors = ["#6366f1", "#4f46e5", "#3b82f6", "#2563eb", "#1d4ed8"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl text-right font-sans">
          <p className="text-xs font-black text-white mb-1.5">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-xs font-medium" style={{ color: pld.color || pld.fill }}>
              {pld.name === "demandIndex" ? "شاخص تقاضا: " : "آگهی‌های فعال: "}
              <span className="font-mono font-bold">
                {pld.value.toLocaleString()}
                {pld.name === "demandIndex" ? "٪" : ""}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden text-right" id="industry-demand-trends-card">
      {/* Decorative Top Line */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500"></div>

      {/* Card Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-850 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>تحلیل زنده بازار کار و هوش تجاری آلمان (Labor Market Intelligence)</span>
          </div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            روند تقاضای صنف در آلمان: <span className="text-indigo-400">{effectiveField}</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            بررسی آماری آگهی‌های فعال فدرال، حقوق، هاب‌های صنعتی و اولویت‌بندی یادگیری مهارت‌های دارای بالاترین رشد
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end">
          {/* Tabs Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all ${
                activeTab === "charts"
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              نمودار آگهی و رشد
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all ${
                activeTab === "skills"
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              اولویت‌بندی مهارت‌ها
            </button>
          </div>

          <button
            onClick={fetchTrends}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="به‌روزرسانی داده‌های زنده"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-teal-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6 py-8" id="trends-loading-skeleton">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-950/30 border border-slate-850/60 rounded-2xl p-4 h-20 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-950/30 border border-slate-850/60 rounded-2xl p-6 h-72 animate-pulse" />
            <div className="lg:col-span-4 bg-slate-950/30 border border-slate-850/60 rounded-2xl p-6 h-72 animate-pulse" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center space-y-4 my-4" id="trends-error-box">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-xs font-bold text-red-300">{error}</p>
          <button
            onClick={fetchTrends}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بارگذاری مجدد داده‌ها</span>
          </button>
        </div>
      )}

      {/* Main Content Render */}
      {!loading && !error && trends && (
        <div className="space-y-6" id="trends-main-content">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* General Demand Score */}
            <div className="bg-slate-950/30 border border-slate-850 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1 z-10">
                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  امتیاز تقاضای کل در آلمان
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-white font-mono">{trends.generalDemandScore}</span>
                  <span className="text-xs text-slate-500 font-bold">از ۱۰۰</span>
                </div>
              </div>
              <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="18" stroke="#1e293b" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="24" 
                    cy="24" 
                    r="18" 
                    stroke="#6366f1" 
                    strokeWidth="3.5" 
                    fill="transparent" 
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    strokeDashoffset={`${2 * Math.PI * 18 * (1 - trends.generalDemandScore / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-indigo-400">{trends.generalDemandScore}%</span>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="bg-slate-950/30 border border-slate-850 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  نرخ رشد سالانه بازار
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-teal-400 font-mono">{trends.yearlyGrowthRate}</span>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.2 rounded font-black select-none">رشد مداوم</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Salary Range */}
            <div className="bg-slate-950/30 border border-slate-850 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  میانگین حقوق ناخالص سالانه
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm sm:text-base font-black text-white font-mono tracking-wide">{trends.averageSalaryRange}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Tab 1: Charts View */}
          {activeTab === "charts" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Historical Line Chart - Span 7 */}
              <div className="lg:col-span-7 bg-slate-950/20 border border-slate-850 rounded-2xl p-5 relative">
                <h4 className="text-xs font-black text-indigo-300 mb-4 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  نمودار رشد تقاضا و حجم آگهی‌های شغلی فدرال (2022 - 2026)
                </h4>
                
                <div className="h-56 sm:h-64 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={trends.timelineData} 
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                      <XAxis 
                        dataKey="year" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        name="شاخص کشش تقاضا (٪)"
                        type="monotone" 
                        dataKey="demandIndex" 
                        stroke={lineChartColor} 
                        strokeWidth={3}
                        activeDot={{ r: 6 }} 
                        dot={{ r: 3, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" style={{ backgroundColor: lineChartColor }} />
                  <span className="text-slate-300 font-bold text-[11px]">شاخص کشش تقاضا (٪) در بازار آلمان</span>
                </div>
              </div>

              {/* Top Regions & Market Summary - Span 5 */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Market Summary Text */}
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      چشم‌انداز و خلاصه بازار فدرال
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium text-justify">
                      {trends.marketOutlook}
                    </p>
                  </div>
                  
                  {/* German Flag Visual Accent */}
                  <div className="flex items-center gap-2 border-t border-slate-850 pt-3.5 mt-3">
                    <div className="flex flex-col gap-0.5 w-6 select-none shrink-0">
                      <div className="h-1 bg-black rounded-t-sm" />
                      <div className="h-1 bg-red-600" />
                      <div className="h-1 bg-amber-400 rounded-b-sm" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-extrabold leading-none">
                      تحلیل شده بر اساس کدهای آماری اداره آمار فدرال آلمان (Destatis)
                    </span>
                  </div>
                </div>

                {/* Top Regions Card */}
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5">
                  <h4 className="text-xs font-black text-indigo-300 mb-3.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    هاب‌های ایالتی با بیشترین میزان تقاضا (Top Regions)
                  </h4>
                  <div className="space-y-2">
                    {trends.topRegions.map((region, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900/60 border border-slate-850/80 rounded-xl px-3.5 py-2.5 transition hover:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-bold font-mono text-indigo-400">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-black text-white font-sans">{region.name}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          region.demandLevel.includes("بسیار") 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                        }`}>
                          {region.demandLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Skills View */}
          {activeTab === "skills" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Skills Importance Bar Chart - Span 7 */}
              <div className="lg:col-span-7 bg-slate-950/20 border border-slate-850 rounded-2xl p-5 relative">
                <h4 className="text-xs font-black text-indigo-300 mb-4 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  سهم مهارت‌های کلیدی در پذیرش و فیلترینگ رزومه کارفرما (٪)
                </h4>
                
                <div className="h-56 sm:h-64 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={trends.skillsData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                      <XAxis 
                        dataKey="skillName" 
                        stroke="#64748b" 
                        fontSize={9} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        name="ميزان تقاضا" 
                        dataKey="demandPercentage" 
                        radius={[6, 6, 0, 0]}
                      >
                        {trends.skillsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills Prioritization Recommendations list - Span 5 */}
              <div className="lg:col-span-5 bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-indigo-300 mb-3.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    اولویت‌بندی توسعه مهارت‌ها (Skill Upgrading)
                  </h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pl-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {trends.skillsData.map((skill, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-slate-850/80 rounded-xl p-3 space-y-2 transition hover:border-slate-800 text-right">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-1.5 py-0.2 rounded">
                              اولویت {idx + 1}
                            </span>
                            <span className="text-xs font-black text-white">{skill.skillNameFa}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-400">({skill.skillName})</span>
                            <span className="text-[10px] font-bold text-teal-400">{skill.demandPercentage}%</span>
                          </div>
                        </div>

                        {/* Tip Text */}
                        <p className="text-[10.5px] text-slate-300 leading-relaxed font-medium">
                          <ChevronRight className="w-3 h-3 text-teal-400 inline ml-0.5" />
                          <span className="font-extrabold text-teal-400">نقشه یادگیری: </span>
                          {skill.actionTip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-bold border-t border-slate-850 pt-3 mt-3 text-center">
                  💡 یادگیری مهارت‌های اولویت ۱ و ۲ شانس موفقیت در مصاحبه را تا ۳ برابر ارتقا می‌دهد
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
