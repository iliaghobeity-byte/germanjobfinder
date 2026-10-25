import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PieChart as PieChartIcon,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Award,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  Info,
  MapPin,
  Scale,
  Zap,
  Building2,
  Flame,
  Check,
  Calendar,
  RotateCcw,
  Compass,
  Layers,
  Globe
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector
} from "recharts";
import {
  GermanMarketDemandDistributionResult,
  GermanMarketSectorDemand,
  GermanMarketTimeframe,
  GermanMarketRegion
} from "../types";
import { fetchWithRetry } from "../utils";

interface GermanMarketDemandPieWidgetProps {
  userField?: string;
  onNavigateToTab?: (tab: string) => void;
}

export const TIMEFRAME_OPTIONS: {
  id: GermanMarketTimeframe;
  labelFa: string;
  periodDe: string;
  badgeFa: string;
  descFa: string;
}[] = [
  {
    id: "quarterly_current",
    labelFa: "فصلی (سه ماهه جاری ۲۰۲۶ / Q1-Q2)",
    periodDe: "Quartal (Q1/Q2 2026)",
    badgeFa: "فصلی",
    descFa: "آمار تجمیعی سه ماهه بازارهای کاری فدرال"
  },
  {
    id: "monthly_current",
    labelFa: "ماهانه (ماه جاری - ۳۰ روز اخیر)",
    periodDe: "Monatlich (Aktueller Monat)",
    badgeFa: "ماهانه",
    descFa: "جریان ورودی موقعیت‌های استخدام جدید در ماه اخیر"
  },
  {
    id: "quarterly_previous",
    labelFa: "فصل گذشته (سه ماهه قبلی / Q4)",
    periodDe: "Vorheriges Quartal (Q4)",
    badgeFa: "فصل گذشته",
    descFa: "آمار تثبیت‌شده فصل قبل جهت مقایسه روندها"
  },
  {
    id: "annual_forecast",
    labelFa: "سالانه (چشم‌انداز کل سال ۲۰۲۶)",
    periodDe: "Jährliche Gesamtprognose 2026",
    badgeFa: "سالانه",
    descFa: "مجموع ظرفیت استخدام پیش‌بینی‌شده برای سراسر سال"
  }
];

export const REGION_OPTIONS: {
  id: GermanMarketRegion;
  labelFa: string;
  stateDe: string;
  badgeFa: string;
  focusFa: string;
}[] = [
  {
    id: "all",
    labelFa: "سراسر آلمان (تمام ۱۶ ایالت - Bundesweit)",
    stateDe: "Bundesweit",
    badgeFa: "سراسر کشور",
    focusFa: "پایش یکپارچه فدرال با تمرکز بر کلان‌شهرهای صنعتی"
  },
  {
    id: "bayern",
    labelFa: "بایرن (مونیخ، نورنبرگ، اینگولشتات)",
    stateDe: "Bayern (München)",
    badgeFa: "قطب خودرو و فناوری",
    focusFa: "قطب خودروسازی لوکس (BMW, Audi)، رباتیک و غول‌های فناوری (Google, Apple)"
  },
  {
    id: "baden_wuerttemberg",
    labelFa: "بادن-وورتمبرگ (اشتوتگارت، کارلسروهه، والدورف)",
    stateDe: "Baden-Württemberg (Stuttgart)",
    badgeFa: "مهندسی و SAP",
    focusFa: "مهد مهندسی مکانیک، پورشه، مرسدس بنز، بوش و مقر جهانی SAP"
  },
  {
    id: "berlin",
    labelFa: "برلین (پایتخت، هاب هوش مصنوعی و استارتاپ)",
    stateDe: "Berlin (Hauptstadt)",
    badgeFa: "استارتاپ و هوش مصنوعی",
    focusFa: "پایتخت دیجیتال، اکوسیستم استارتاپی، فناوری ابری و زبان کاری بین‌المللی"
  },
  {
    id: "nrw",
    labelFa: "نوردراین-وستفالن (دوسلدورف، کلن، هاب روهر)",
    stateDe: "Nordrhein-Westfalen (Köln/Düsseldorf)",
    badgeFa: "سلامت و ترابری روهر",
    focusFa: "پرجمعیت‌ترین ایالت با ۱۸ میلیون نفر، شبکه متراکم درمانی و ترابری روهر"
  },
  {
    id: "hessen",
    labelFa: "هسن (فرانکفورت، ویسبادن، درمشتات)",
    stateDe: "Hessen (Frankfurt am Main)",
    badgeFa: "فین‌تک و داروسازی",
    focusFa: "مرکز مالی اروپا (ECB)، تبادل دیتای جهانی DE-CIX و داروسازی هوخست"
  },
  {
    id: "hamburg",
    labelFa: "هامبورگ (بندر هاب اروپا، هوانوردی ایرباس)",
    stateDe: "Hamburg (Hafen & Aviation)",
    badgeFa: "بندر و هوانوردی",
    focusFa: "بزرگ‌ترین بندر آلمان، سومین هاب هوانوردی جهان (Airbus) و رسانه دیجیتال"
  },
  {
    id: "sachsen",
    labelFa: "زاکسن (سیلیکون ساکسونی، درسدن، لایپزیگ)",
    stateDe: "Sachsen (Dresden - Silicon Saxony)",
    badgeFa: "نیمه‌هادی و تراشه",
    focusFa: "هاب میکروالکترونیک اروپا (TSMC, Infineon) و کارگوی شبانه DHL"
  }
];

export const GermanMarketDemandPieWidget: React.FC<GermanMarketDemandPieWidgetProps> = ({
  userField,
  onNavigateToTab
}) => {
  const [data, setData] = useState<GermanMarketDemandDistributionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<"all" | "critical">("all");
  const [metricMode, setMetricMode] = useState<"percentage" | "vacancies">("percentage");

  // Dropdown filter states: Timeframe (ماهانه / فصلی) and Region (موقعیت جغرافیایی)
  const [selectedTimeframe, setSelectedTimeframe] = useState<GermanMarketTimeframe>("quarterly_current");
  const [selectedRegion, setSelectedRegion] = useState<GermanMarketRegion>("all");

  const effectiveField = userField || "فناوری اطلاعات و مهندسی نرم‌افزار";
  const clientCacheRef = React.useRef<Map<string, GermanMarketDemandDistributionResult>>(new Map());

  // Fetch data from API with timeframe and region filters
  const fetchData = useCallback(
    async (isRefresh = false, tf = selectedTimeframe, reg = selectedRegion) => {
      const cacheKey = `${effectiveField}::${tf}::${reg}`;
      if (!isRefresh && clientCacheRef.current.has(cacheKey)) {
        const cached = clientCacheRef.current.get(cacheKey)!;
        setData(cached);
        if (cached.matchedSectorId && cached.sectors && cached.sectors.length > 0) {
          const matchIdx = cached.sectors.findIndex((s) => s.id === cached.matchedSectorId);
          if (matchIdx !== -1) {
            setActiveIndex(matchIdx);
          }
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithRetry("/api/gemini/market-demand-distribution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userField: effectiveField,
            timeframe: tf,
            region: reg
          })
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result: GermanMarketDemandDistributionResult = await res.json();
        clientCacheRef.current.set(cacheKey, result);
        setData(result);

        // Auto-select the sector matching the user's field
        if (result.matchedSectorId && result.sectors && result.sectors.length > 0) {
          const matchIdx = result.sectors.findIndex((s) => s.id === result.matchedSectorId);
          if (matchIdx !== -1) {
            setActiveIndex(matchIdx);
          }
        }
      } catch (err: any) {
        setError("دریافت داده‌های زنده با محدودیت مواجه شد؛ در حال استفاده از آمار رسمی آژانس کار فدرال آلمان.");
      } finally {
        setLoading(false);
      }
    },
    [effectiveField, selectedTimeframe, selectedRegion]
  );

  useEffect(() => {
    fetchData(false, selectedTimeframe, selectedRegion);
  }, [fetchData, selectedTimeframe, selectedRegion]);

  // Handle timeframe change from dropdown (triggers single useEffect fetch or instant cache hit)
  const handleTimeframeChange = (newTf: GermanMarketTimeframe) => {
    setSelectedTimeframe(newTf);
  };

  // Handle region change from dropdown (triggers single useEffect fetch or instant cache hit)
  const handleRegionChange = (newReg: GermanMarketRegion) => {
    setSelectedRegion(newReg);
  };

  // Reset filters to default (all Germany, quarterly)
  const handleResetFilters = () => {
    setSelectedTimeframe("quarterly_current");
    setSelectedRegion("all");
    setFilterMode("all");
  };

  const isFiltered = selectedRegion !== "all" || selectedTimeframe !== "quarterly_current";

  // Filtered sectors list for display and chart
  const displayedSectors = useMemo(() => {
    if (!data?.sectors) return [];
    if (filterMode === "critical") {
      return data.sectors.filter((s) => s.shortageLevel === "critical");
    }
    return data.sectors;
  }, [data?.sectors, filterMode]);

  // Active sector being inspected
  const activeSector: GermanMarketSectorDemand | null = useMemo(() => {
    if (!displayedSectors || displayedSectors.length === 0) return null;
    const clampedIndex = activeIndex >= displayedSectors.length ? 0 : activeIndex;
    return displayedSectors[clampedIndex] || displayedSectors[0];
  }, [displayedSectors, activeIndex]);

  // Check if a sector matches the candidate's field
  const isCandidateMatched = (sector: GermanMarketSectorDemand) => {
    return sector.id === data?.matchedSectorId;
  };

  const currentRegionInfo = useMemo(() => {
    return REGION_OPTIONS.find((r) => r.id === selectedRegion) || REGION_OPTIONS[0];
  }, [selectedRegion]);

  const currentTimeframeInfo = useMemo(() => {
    return TIMEFRAME_OPTIONS.find((t) => t.id === selectedTimeframe) || TIMEFRAME_OPTIONS[0];
  }, [selectedTimeframe]);

  // Custom active shape for Recharts Pie to draw an enlarged hovered slice
  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, value
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="transition-all duration-300 drop-shadow-md"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 11}
          outerRadius={outerRadius + 14}
          fill={fill}
          className="transition-all duration-300 opacity-70"
        />
      </g>
    );
  };

  return (
    <div
      id="german-market-demand-pie-widget"
      className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden transition-all print-break-inside-avoid text-right"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header section with high-contrast text */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-xs">
              <PieChartIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>پایش توزیع تقاضای بازار کار آلمان (Pie Chart)</span>
            </span>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Bundesagentur für Arbeit / ZAV 2026
            </span>

            {data?.isAiGenerated ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded bg-gradient-to-r from-indigo-950/80 to-purple-950/80 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3 h-3 text-purple-300" />
                تحلیل زنده با Gemini AI
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">
                پایش رسمی مشاغل کمبود نیرو (Mangelberuf)
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>سهم حوزه‌های شغلی پرتقاضا از موقعیت‌های باز در آلمان</span>
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            این نمودار دایره‌ای نسبت موقعیت‌های استخدامی باز و توزیع تقاضای بازار کار آلمان را میان حوزه‌های پرتقاضا (IT، مهندسی، بهداشت و درمان، صنایع فنی و علوم زیستی) بر اساس بازه زمانی (ماهانه/فصلی) و موقعیت جغرافیایی دلخواه شما به تفکیک درصد، ظرفیت استخدام و شروط بلوکارت تحلیل می‌کند.
          </p>
        </div>

        {/* Action Controls & Refresh */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchData(true, selectedTimeframe, selectedRegion)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition cursor-pointer disabled:opacity-50"
            title="بروزرسانی داده‌ها با هوش مصنوعی Gemini"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "در حال استخراج داده‌ها..." : "بروزرسانی زنده Gemini"}</span>
          </button>
        </div>
      </div>

      {/* DROPDOWN FILTER SECTION: Timeframe (ماهانه/فصلی) and Geographic Location (موقعیت جغرافیایی در آلمان) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>فیلترهای سفارشی نمودار (منوی کشویی بازه زمانی و موقعیت جغرافیایی)</span>
            </h4>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer self-start md:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>بازنشانی به کل آلمان / فصلی</span>
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Dropdown 1: Timeframe (ماهانه / فصلی / سالانه) */}
          <div className="lg:col-span-6 space-y-1.5">
            <label
              htmlFor="timeframe-select-dropdown"
              className="text-xs font-bold text-slate-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>بازه زمانی تحلیل (ماهانه / فصلی):</span>
              </span>
              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                {currentTimeframeInfo.badgeFa}
              </span>
            </label>

            <div className="relative">
              <select
                id="timeframe-select-dropdown"
                value={selectedTimeframe}
                onChange={(e) => handleTimeframeChange(e.target.value as GermanMarketTimeframe)}
                className="w-full appearance-none bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-indigo-500/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white rounded-xl py-2.5 pr-3.5 pl-10 text-xs font-bold transition cursor-pointer shadow-sm outline-none"
              >
                {TIMEFRAME_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id} className="bg-slate-900 text-white py-1">
                    {option.labelFa}
                  </option>
                ))}
              </select>

              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight pr-1">
              {currentTimeframeInfo.descFa}
            </p>
          </div>

          {/* Dropdown 2: Geographic Region (موقعیت جغرافیایی در آلمان) */}
          <div className="lg:col-span-6 space-y-1.5">
            <label
              htmlFor="region-select-dropdown"
              className="text-xs font-bold text-slate-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>موقعیت جغرافیایی در آلمان (ایالت و قطب‌های صنعتی):</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                {currentRegionInfo.badgeFa}
              </span>
            </label>

            <div className="relative">
              <select
                id="region-select-dropdown"
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value as GermanMarketRegion)}
                className="w-full appearance-none bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white rounded-xl py-2.5 pr-3.5 pl-10 text-xs font-bold transition cursor-pointer shadow-sm outline-none"
              >
                {REGION_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id} className="bg-slate-900 text-white py-1">
                    {option.labelFa}
                  </option>
                ))}
              </select>

              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight pr-1">
              {currentRegionInfo.focusFa}
            </p>
          </div>
        </div>

        {/* Active Filter Summary Bar with Regional Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-bold text-[11px]">فیلترهای اعمال‌شده:</span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/70 text-indigo-200 border border-indigo-500/30 text-xs font-medium">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>{data?.timeframeLabelFa || currentTimeframeInfo.labelFa}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-200 border border-emerald-500/30 text-xs font-medium">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{data?.regionLabelFa || currentRegionInfo.labelFa}</span>
            </span>

            {data?.regionalHubsFa && data.regionalHubsFa.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>شهرهای کلیدی: {data.regionalHubsFa.slice(0, 3).join("، ")}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">ظرفیت فیلترشده:</span>
            <span className="font-mono font-black text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-xs">
              {data?.totalTrackedVacanciesFormatted || "+۷۸۰,۰۰۰ موقعیت شغلی"}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Metric Toggle Bar: Shortage Filter + Percent/Vacancies Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
        {/* Category Shortage Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => {
              setFilterMode("all");
              setActiveIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterMode === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            همه بخش‌های پرتقاضا (۷ حوزه)
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterMode("critical");
              setActiveIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterMode === "critical"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>کمبود بحرانی (Critical Mangelberuf)</span>
          </button>
        </div>

        {/* Metric Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetricMode("percentage")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              metricMode === "percentage"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            سهم درصدی (%)
          </button>

          <button
            type="button"
            onClick={() => setMetricMode("vacancies")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              metricMode === "vacancies"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            موقعیت‌های باز (تعداد)
          </button>
        </div>
      </div>

      {/* Main Grid: Pie Chart on Left (Col 5/12), Detailed Inspector on Right (Col 7/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Pie / Donut Chart */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <PieChartIcon className="w-4 h-4 text-indigo-400" />
              <span>نمودار دایره‌ای توزیع بازار کار ۲۰۲۶</span>
            </span>

            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
              {currentRegionInfo.badgeFa} | {currentTimeframeInfo.badgeFa}
            </span>
          </div>

          {/* Recharts Pie Chart Canvas */}
          <div className="relative w-full h-[280px] sm:h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={displayedSectors}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={108}
                  paddingAngle={3}
                  dataKey={metricMode === "percentage" ? "sharePercentage" : "openVacancies"}
                  onClick={(_, index) => setActiveIndex(index)}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  cursor="pointer"
                >
                  {displayedSectors.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={entry.color}
                      stroke="#0f172a"
                      strokeWidth={2}
                      className="transition-all duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const sec = payload[0].payload as GermanMarketSectorDemand;
                      return (
                        <div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1.5 text-right font-sans min-w-[220px] z-50">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                            <span className="font-black text-white">{sec.nameFa}</span>
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: sec.color }}
                            />
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono">
                            {sec.nameDe}
                          </div>
                          <div className="flex justify-between items-center pt-1 text-[11px]">
                            <span className="text-slate-400">سهم در این منطقه:</span>
                            <strong className="text-emerald-400 font-mono">{sec.sharePercentage}٪</strong>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">موقعیت‌های باز:</span>
                            <strong className="text-indigo-300 font-mono">{sec.vacanciesFormatted}</strong>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">سطح کمبود:</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              sec.shortageLevel === "critical"
                                ? "bg-rose-950 text-rose-300 border border-rose-800/40"
                                : "bg-blue-950 text-blue-300 border border-blue-800/40"
                            }`}>
                              {sec.shortageLevelFa}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1">
                            نرخ تقاضا: <span className="text-emerald-300 font-mono font-bold">{sec.growthRate}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Donut Overlay Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {activeSector ? (
                <div className="space-y-0.5 animate-fade-in">
                  <span
                    className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight"
                    style={{ color: activeSector.color }}
                  >
                    {metricMode === "percentage" ? `${activeSector.sharePercentage}%` : activeSector.vacanciesFormatted.split(" ")[0]}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 block max-w-[130px] truncate mx-auto">
                    {activeSector.nameFa}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-mono">
                    {metricMode === "percentage" ? activeSector.vacanciesFormatted : "موقعیت باز"}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xl font-black text-white font-mono">
                    {data?.totalTrackedVacancies ? (data.totalTrackedVacancies > 1000 ? `${Math.round(data.totalTrackedVacancies / 1000)}K+` : data.totalTrackedVacancies) : "۷۸۰K+"}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{currentRegionInfo.badgeFa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick instructions */}
          <div className="text-center pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>روی هر قطاع از نمودار یا کارت‌های پایین کلیک کنید تا جزئیات نمایش یابد</span>
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Sector Inspector Card */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5">
          {activeSector ? (
            <div className="space-y-5 animate-fade-in">
              {/* Sector Header with Color Accent and Profile Match */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md"
                      style={{ backgroundColor: activeSector.color }}
                    />
                    <h4 className="text-lg font-black text-white tracking-tight">
                      {activeSector.nameFa}
                    </h4>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {activeSector.nameDe}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isCandidateMatched(activeSector) && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                      <Check className="w-3 h-3 text-emerald-400" />
                      منطبق با تخصص شما
                    </span>
                  )}

                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    activeSector.shortageLevel === "critical"
                      ? "bg-rose-950/60 text-rose-300 border-rose-500/40"
                      : "bg-blue-950/60 text-blue-300 border-blue-500/40"
                  }`}>
                    <Flame className="w-3 h-3 text-rose-400" />
                    {activeSector.shortageLevelFa}
                  </span>
                </div>
              </div>

              {/* KPI Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 block">سهم در این بازه:</span>
                  <span className="text-base font-black text-white font-mono" style={{ color: activeSector.color }}>
                    {activeSector.sharePercentage}٪
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 block">موقعیت‌های باز:</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    {activeSector.vacanciesFormatted}
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 block">روند تقاضا:</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                    {activeSector.growthRate}
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 block">رویه تسریع (§ 81a):</span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${
                    activeSector.fastTrackEligible ? "text-emerald-400" : "text-slate-400"
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {activeSector.fastTrackEligible ? "واجد شرایط" : "مشروط"}
                  </span>
                </div>
              </div>

              {/* Regional Context Banner */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Compass className="w-3 h-3 text-indigo-400" />
                    <span>تمرکز جغرافیایی منتخب: {currentRegionInfo.labelFa}</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {data?.regionalFocusFa || currentRegionInfo.focusFa}
                  </p>
                </div>
                {data?.regionalHubsFa && data.regionalHubsFa.length > 0 && (
                  <div className="text-left shrink-0">
                    <span className="text-[9.5px] text-slate-400 block">هاب‌های فعال استخدامی:</span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {data.regionalHubsFa.slice(0, 3).join(" • ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Sector Deep Description */}
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                {activeSector.descriptionFa}
              </p>

              {/* Top Roles & Focus States */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Top In-Demand Roles */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>مشاغل با بیشترین تقاضا در این حوزه:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activeSector.topRolesFa.map((role, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <span className="truncate">{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Federal States / Regional Hubs */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedRegion === "all" ? "ایالات با بیشترین استخدام:" : "شهرهای کانونی در این منطقه:"}</span>
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activeSector.topStatesFa.map((state, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{state}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Legal Blue Card Threshold Highlight */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-950/40 to-slate-900 p-3.5 rounded-xl border border-indigo-500/30 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block">نصاب حقوق بلوکارت و مقررات اقامتی:</span>
                  <strong className="text-amber-300 font-bold">{activeSector.blueCardThresholdFormatted}</strong>
                </div>

                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTab("jobs")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
                  >
                    <span>جستجوی آگهی‌های این حوزه</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              یک حوزه را از نمودار انتخاب کنید.
            </div>
          )}
        </div>
      </div>

      {/* Sector Quick-Select Chips Bar */}
      <div className="pt-2">
        <span className="text-xs font-bold text-slate-300 mb-2.5 block">
          انتخاب سریع بخش‌های پرتقاضا در این منطقه و بازه زمانی:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {displayedSectors.map((sector, index) => {
            const isSelected = activeIndex === index;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-xs font-mono font-black" style={{ color: sector.color }}>
                    {sector.sharePercentage}٪
                  </span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  {sector.nameFa}
                </div>
                <div className="text-[9.5px] text-slate-400 truncate mt-0.5">
                  {sector.vacanciesFormatted}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gemini AI Strategic Executive Commentary Box */}
      {data?.aiAnalysisReportFa && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-sm relative overflow-hidden space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-indigo-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>تحلیل تحلیلی زنده هوش مصنوعی Gemini از تقاضای کار در آلمان</span>
            </div>
            <span className="text-[11px] font-mono text-purple-300 bg-purple-950/50 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              {data.regionLabelFa || currentRegionInfo.badgeFa} • {data.timeframeLabelFa || currentTimeframeInfo.badgeFa}
            </span>
          </div>
          <h4 className="text-sm font-black text-white">
            {data.aiAnalysisHeadlineFa}
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed">
            {data.aiAnalysisReportFa}
          </p>
          <div className="text-[10px] text-slate-400 pt-1 flex flex-wrap items-center justify-between gap-2">
            <span>منبع مرجع: {data.officialSource}</span>
            <span className="font-mono text-slate-300">{data.lastUpdatedFa}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GermanMarketDemandPieWidget;
