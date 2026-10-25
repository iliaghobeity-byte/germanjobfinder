import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  BookOpen,
  Search,
  Trophy,
  FileText,
  Globe,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Layers,
  ArrowRight,
  FileCheck2,
  TrendingUp,
  Scale,
  BookA,
  Calculator
} from "lucide-react";

export type TabId = 
  | "dashboard" 
  | "visa-simulator"
  | "guide" 
  | "advanced-jobs" 
  | "salary-calculator"
  | "resume-analyzer"
  | "chancenkarte" 
  | "cv" 
  | "portals" 
  | "jobs" 
  | "interview"
  | "glossary";

export interface NavTabItem {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  category: "roadmap" | "jobs" | "preparation";
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  color: string;
  activeBg: string;
  activeBorder: string;
  subtitle: string;
  description: string;
  highlight: string;
}

export const NAV_TABS: NavTabItem[] = [
  {
    id: "dashboard",
    label: "نقشه راه و ارزیابی هوشمند",
    shortLabel: "نقشه راه و ارزیابی",
    icon: Brain,
    category: "roadmap",
    categoryLabel: "ارزیابی و نقشه راه",
    color: "text-indigo-600 dark:text-indigo-400",
    activeBg: "bg-indigo-50/90 dark:bg-indigo-950/40",
    activeBorder: "border-indigo-500/40 dark:border-indigo-500/50",
    badge: "هوش مصنوعی و خط زمانی",
    badgeColor: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    subtitle: "Smart Roadmap & Migration Timeline",
    description: "ارزیابی شانس ویزا، رتبه صلاحیت، بررسی کسری امتیاز و خط زمانی تعاملی تصویری مراحل مهاجرت.",
    highlight: "بروزرسانی شده با الگوریتم‌های هوش مصنوعی ۲۰۲۶"
  },
  {
    id: "visa-simulator",
    label: "شبیه‌ساز استراتژی ویزا",
    shortLabel: "شبیه‌ساز استراتژی ویزا",
    icon: TrendingUp,
    category: "roadmap",
    categoryLabel: "ارزیابی و نقشه راه",
    color: "text-sky-600 dark:text-sky-400",
    activeBg: "bg-sky-50/90 dark:bg-sky-950/40",
    activeBorder: "border-sky-500/40 dark:border-sky-500/50",
    badge: "نمودار Recharts و پیش‌بینی",
    badgeColor: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    subtitle: "Visa Strategy Simulator & Forecast",
    description: "شبیه‌سازی و پیش‌بینی آماری شانس اخذ کارت فرصت، بلوکارت، ویزای جستجوی کار و ویزای نیروی متخصص با نمودار میله‌ای Recharts.",
    highlight: "تحلیل مقایسه‌ای سناریوهای قانونی بر اساس قوانین ۲۰۲۶"
  },
  {
    id: "guide",
    label: "راهنمای جامع مهاجرت و زندگی",
    shortLabel: "راهنمای جامع مهاجرت",
    icon: BookOpen,
    category: "roadmap",
    categoryLabel: "ارزیابی و نقشه راه",
    color: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-50/90 dark:bg-amber-950/40",
    activeBorder: "border-amber-500/40 dark:border-amber-500/50",
    badge: "قوانین ۲۰۲۶",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    subtitle: "Comprehensive Living & Legal Guide",
    description: "اطلاعات موثق قانون جدید FEG، حساب بلاک‌شده، بیمه درمان، هزینه‌های زندگی در شهرهای آلمان و وقت سفارت.",
    highlight: "راهنمای گام‌به‌گام اقدام مستقیم از ایران"
  },
  {
    id: "advanced-jobs",
    label: "جستجوی پیشرفته مشاغل",
    shortLabel: "جستجوی پیشرفته",
    icon: Search,
    category: "jobs",
    categoryLabel: "بازار کار و ویزا",
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50/90 dark:bg-emerald-950/40",
    activeBorder: "border-emerald-500/40 dark:border-emerald-500/50",
    badge: "فیلتر ایران‌دوست",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    subtitle: "Advanced Job Match & Semantic Audit",
    description: "موتور جستجوی کار با تحلیل هوشمند رزومه، تخمین احتمال مصاحبه و تفکیک فرصت‌های با بیشترین بازدهی.",
    highlight: "ارزیابی معنایی و اعتبارسنجی با Gemini AI"
  },
  {
    id: "salary-calculator",
    label: "محاسبه‌گر حقوق آلمان (Gehaltsrechner)",
    shortLabel: "محاسبه‌گر حقوق",
    icon: Calculator,
    category: "jobs",
    categoryLabel: "بازار کار و ویزا",
    color: "text-teal-600 dark:text-teal-400",
    activeBg: "bg-teal-50/90 dark:bg-teal-950/40",
    activeBorder: "border-teal-500/40 dark:border-teal-500/50",
    badge: "جمینای و ۱۶ ایالت",
    badgeColor: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    subtitle: "AI German Salary Calculator & State Benchmarks",
    description: "تخمین هوشمند رنج حقوق رقابتی مشاغل بر اساس ایالت‌های ۱۶گانه آلمان، محاسبه ناخالص و خالص و شرایط بلوکارت با هوش مصنوعی.",
    highlight: "بروزرسانی داده‌های ۲۰۲۶ بر اساس اطلس فدرال دستمزد (Entgeltatlas)"
  },
  {
    id: "chancenkarte",
    label: "محاسبه‌گر کارت فرصت",
    shortLabel: "کارت فرصت آلمان",
    icon: Trophy,
    category: "roadmap",
    categoryLabel: "ارزیابی و نقشه راه",
    color: "text-yellow-600 dark:text-yellow-400",
    activeBg: "bg-yellow-50/90 dark:bg-yellow-950/40",
    activeBorder: "border-yellow-500/40 dark:border-yellow-500/50",
    badge: "معیار رسمی ۶ امتیاز",
    badgeColor: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
    subtitle: "Opportunity Card Points Calculator",
    description: "محاسبه‌گر امتیاز ویزای فرصت جستجوی کار آلمان (حداقل ۶ از ۱۰ امتیاز) بر اساس سن، مدرک تحصیلی، زبان و سابقه کار.",
    highlight: "امکان ورود قانونی به آلمان بدون جاب‌آفر"
  },
  {
    id: "cv",
    label: "رزومه‌ساز آلمانی (Lebenslauf)",
    shortLabel: "رزومه‌ساز Lebenslauf",
    icon: FileText,
    category: "preparation",
    categoryLabel: "رزومه و آمادگی مصاحبه",
    color: "text-blue-600 dark:text-blue-400",
    activeBg: "bg-blue-50/90 dark:bg-blue-950/40",
    activeBorder: "border-blue-500/40 dark:border-blue-500/50",
    badge: "استاندارد DIN 5008",
    badgeColor: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    subtitle: "German ATS Resume Builder",
    description: "طراحی و ساخت رزومه دوزبانه استاندارد آلمانی، سازگار با الگوریتم‌های ATS و هماهنگ با فرهنگ کاری آلمان.",
    highlight: "خروجی استاندارد چاپی و PDF"
  },
  {
    id: "resume-analyzer",
    label: "تحلیل پارامتریک رزومه",
    shortLabel: "تحلیل رزومه و شرکت‌ها",
    icon: FileCheck2,
    category: "preparation",
    categoryLabel: "رزومه و آمادگی مصاحبه",
    color: "text-indigo-600 dark:text-indigo-400",
    activeBg: "bg-indigo-50/90 dark:bg-indigo-950/40",
    activeBorder: "border-indigo-500/40 dark:border-indigo-500/50",
    badge: "فرهنگ جذب غیراروپایی",
    badgeColor: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    subtitle: "Parametric Resume & Company Matcher",
    description: "محاسبه درصد تطابق ریاضی با نیازمندی‌های شغلی آلمان و سوابق ۱۰ ساله جذب نیروهای غیراروپایی شرکت‌های منتخب.",
    highlight: "پیش‌بینی احتمال مصاحبه و بهینه‌سازی ATS"
  },
  {
    id: "portals",
    label: "کاریابی و تایید مدارک (ZAB/Anabin)",
    shortLabel: "تایید مدارک و آنابین",
    icon: Globe,
    category: "jobs",
    categoryLabel: "بازار کار و ویزا",
    color: "text-teal-600 dark:text-teal-400",
    activeBg: "bg-teal-50/90 dark:bg-teal-950/40",
    activeBorder: "border-teal-500/40 dark:border-teal-500/50",
    badge: "ارزشیابی H+ و آنابین",
    badgeColor: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    subtitle: "ZAB Statement & Degree Recognition",
    description: "راهنمای استعلام دانشگاه و رشته در سامانه آنابین، مراحل اخذ تاییدیه ZAB و لینک مستقیم پورتال‌های استخدامی معتبر.",
    highlight: "بررسی پیش‌نیاز قانونی ویزای کاری"
  },
  {
    id: "jobs",
    label: "موقعیت‌های اسپانسرشیپ ویزا",
    shortLabel: "اسپانسرشیپ ویزا",
    icon: Briefcase,
    category: "jobs",
    categoryLabel: "بازار کار و ویزا",
    color: "text-purple-600 dark:text-purple-400",
    activeBg: "bg-purple-50/90 dark:bg-purple-950/40",
    activeBorder: "border-purple-500/40 dark:border-purple-500/50",
    badge: "حمایت ویزای کاری (§81a)",
    badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    subtitle: "Visa-Sponsored Job Openings",
    description: "کارفرماهای معتبر حامی ویزا با تفکیک شرکت‌های شانس بالای مصاحبه و مگا شرکت‌های بین‌المللی با فرهنگ جذب مهاجر.",
    highlight: "استخدام مستقیم با حقوق استاندارد بلوکارت"
  },
  {
    id: "interview",
    label: "شبیه‌ساز مصاحبه (Interview Prep)",
    shortLabel: "شبیه‌ساز مصاحبه",
    icon: Sparkles,
    category: "preparation",
    categoryLabel: "رزومه و آمادگی مصاحبه",
    color: "text-rose-600 dark:text-rose-400",
    activeBg: "bg-rose-50/90 dark:bg-rose-950/40",
    activeBorder: "border-rose-500/40 dark:border-rose-500/50",
    badge: "تمرین تخصصی مصاحبه",
    badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
    subtitle: "Interview Simulator & Prep",
    description: "تمرین سوالات مصاحبه شرکت‌های آلمانی، انگیزش‌نامه، سوالات رفتاری و شبیه‌سازی مکالمات فنی با هوش مصنوعی.",
    highlight: "نکات طلایی فرهنگ ارتباطی با مصاحبه‌گر آلمانی"
  },
  {
    id: "glossary",
    label: "واژه‌نامه تخصصی مهاجرت (Glossar)",
    shortLabel: "واژه‌نامه تخصصی",
    icon: BookA,
    category: "roadmap",
    categoryLabel: "ارزیابی و نقشه راه",
    color: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-50/90 dark:bg-amber-950/40",
    activeBorder: "border-amber-500/40 dark:border-amber-500/50",
    badge: "دیکشنری اداری و حقوقی",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    subtitle: "German Immigration & Labor Glossary",
    description: "فرهنگ جامع اصطلاحات اداری، قوانین اقامت AufenthG، قراردادهای کاری، ارزشیابی ZAB و بیمه‌ها با تلفظ صوتی آلمانی.",
    highlight: "دایره‌المعارف اصطلاحات همراه با نکات کاربردی متقاضیان ایرانی"
  }
];

interface MainNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function MainNavigation({ activeTab, onTabChange }: MainNavigationProps) {
  // Navigation Layout Mode: 'grid' (Clean 2-row multi-column grid, default) or 'strip' (Scrollable bar)
  const [layoutMode, setLayoutMode] = useState<"grid" | "strip">(() => {
    try {
      const saved = localStorage.getItem("germany_nav_layout_mode");
      return saved === "strip" ? "strip" : "grid";
    } catch {
      return "grid";
    }
  });

  // Filter category: 'all' | 'roadmap' | 'jobs' | 'preparation'
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Search filter query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Hover state for tooltip / detail
  const [hoveredTabId, setHoveredTabId] = useState<TabId | null>(null);

  // Scroll container ref for strip mode
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  // Save layout preference
  const toggleLayoutMode = (mode: "grid" | "strip") => {
    setLayoutMode(mode);
    try {
      localStorage.setItem("germany_nav_layout_mode", mode);
    } catch (e) {
      console.error(e);
    }
  };

  // Check scroll positions for strip mode
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // In RTL: scrollLeft can be negative or positive depending on browser implementation
    const maxScroll = el.scrollWidth - el.clientWidth;
    const currentScroll = Math.abs(el.scrollLeft);
    setCanScrollRight(currentScroll > 10);
    setCanScrollLeft(currentScroll < maxScroll - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [layoutMode, selectedCategory]);

  // Scroll active tab into view when activeTab changes in strip mode
  useEffect(() => {
    if (layoutMode === "strip" && scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeTab, layoutMode]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 260;
    // In RTL, scrolling right goes to the start, left goes to the end
    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  };

  // Filtered tabs according to category and search query
  const filteredTabs = NAV_TABS.filter(tab => {
    const matchesCategory = selectedCategory === "all" || tab.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      tab.label.toLowerCase().includes(q) ||
      tab.subtitle.toLowerCase().includes(q) ||
      tab.description.toLowerCase().includes(q) ||
      tab.badge.toLowerCase().includes(q)
    );
  });

  // Current active tab meta
  const currentTab = NAV_TABS.find(t => t.id === activeTab) || NAV_TABS[0];
  const CurrentIcon = currentTab.icon;

  return (
    <nav 
      aria-label="بخش‌های اصلی سامانه"
      className="relative mb-8 z-30 w-full max-w-full overflow-hidden"
    >
      {/* Container Card with subtle glassmorphism */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-3 sm:p-4 shadow-sm backdrop-blur-md transition-all">
        
        {/* Top Control Bar: Category Filters + Layout Mode Switcher + Compact Search */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800">
          
          {/* Right: Functional Categories Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>دسته‌بندی:</span>
            </span>

            {[
              { id: "all", label: "همه بخش‌ها", count: NAV_TABS.length },
              { id: "roadmap", label: "ارزیابی و نقشه راه", count: NAV_TABS.filter(t => t.category === "roadmap").length },
              { id: "jobs", label: "فرصت‌های شغلی و ویزا", count: NAV_TABS.filter(t => t.category === "jobs").length },
              { id: "preparation", label: "رزومه و آمادگی", count: NAV_TABS.filter(t => t.category === "preparation").length },
            ].map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 font-black ring-1 ring-indigo-500/40"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Left: Layout Switcher & Compact Indicator */}
          <div className="flex items-center gap-2 mr-auto">
            {/* Quick search input */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="جستجوی بخش..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 lg:w-44 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-2.5 py-1.5 pr-7 border border-slate-200/80 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-2 top-2 text-[10px] text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Layout Toggle Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => toggleLayoutMode("grid")}
                title="نمایش شبکه‌ای کامل (توصیه شده - بدون اسکرول و دسترسی مستقیم به تمام ۸ بخش)"
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  layoutMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">شبکه‌ای</span>
              </button>

              <button
                onClick={() => toggleLayoutMode("strip")}
                title="نمایش نوار افقی اسکرول"
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  layoutMode === "strip"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">نواری</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN TABS DISPLAY AREA --- */}
        {layoutMode === "grid" ? (
          /* =========================================================================
             1. RESPONSIVE GRID LAYOUT (Clean 2x4 on desktop, 2x2/2x4 on tablet/mobile)
             Guaranteed 100% viewport containment - NEVER overflows off the screen!
             ========================================================================= */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-2.5">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isHovered = hoveredTabId === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  onMouseEnter={() => setHoveredTabId(tab.id)}
                  onMouseLeave={() => setHoveredTabId(null)}
                  className={`group relative text-right p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden min-h-[92px] sm:min-h-[100px] ${
                    isActive
                      ? `${tab.activeBg} ${tab.activeBorder} shadow-md shadow-indigo-500/5 ring-1.5 ring-indigo-500/30`
                      : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                  }`}
                >
                  {/* Subtle active indicator beacon */}
                  {isActive && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-500 rounded-t-2xl" />
                  )}

                  {/* Header Row of the Card: Icon + Category/Feature Badge */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5 w-full">
                    <div className={`p-1.5 rounded-xl border transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                      isActive 
                        ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800/50 shadow-xs" 
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700"
                    }`}>
                      <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isActive ? tab.color : "text-slate-500 dark:text-slate-400 group-hover:" + tab.color}`} />
                    </div>

                    <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border truncate max-w-[130px] sm:max-w-none ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  </div>

                  {/* Body: Main Title in Persian */}
                  <div className="w-full">
                    <h3 className={`text-xs sm:text-[13px] font-black leading-snug tracking-tight mb-0.5 transition-colors line-clamp-1 ${
                      isActive 
                        ? "text-indigo-950 dark:text-indigo-100" 
                        : "text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"
                    }`}>
                      {tab.label}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {tab.subtitle}
                    </p>
                  </div>

                  {/* Active Selection Indicator */}
                  {isActive && (
                    <div className="mt-1 flex items-center justify-between text-[10px] font-black text-indigo-600 dark:text-indigo-300 pt-1 border-t border-indigo-500/15">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 inline shrink-0" />
                        <span>بخش فعال</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* =========================================================================
             2. SCROLLABLE HORIZONTAL STRIP WITH NAVIGATION CHEVRONS & AUTO PADDING
             Smooth arrows + soft gradient masks prevent any visual cutoff!
             ========================================================================= */
          <div className="relative w-full">
            {/* Scroll right chevron (In RTL this goes forward/leftwards) */}
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="اسکرول به راست"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 transition-opacity cursor-pointer ${
                canScrollRight ? "opacity-100 hover:scale-105" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Scroll left chevron */}
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="اسکرول به چپ"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 transition-opacity cursor-pointer ${
                canScrollLeft ? "opacity-100 hover:scale-105" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable container with hidden default scrollbar and smooth behavior */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto py-1 px-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    data-tab-id={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? `${tab.activeBg} ${tab.activeBorder} text-indigo-950 dark:text-indigo-100 shadow-sm ring-1 ring-indigo-500/30`
                        : "bg-slate-100/90 dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? tab.color : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-semibold ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- ACTIVE TAB ORIENTATION & HIGHLIGHT FOOTER --- */}
        <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-50/70 dark:bg-slate-850/50 p-2.5 rounded-2xl">
          <div className="flex items-center gap-2.5 text-right">
            <div className={`p-1.5 rounded-xl border bg-white dark:bg-slate-800 shadow-xs ${currentTab.activeBorder}`}>
              <CurrentIcon className={`w-4 h-4 ${currentTab.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  بخش انتخابی: {currentTab.label}
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md border font-bold ${currentTab.badgeColor}`}>
                  {currentTab.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 font-normal leading-relaxed">
                {currentTab.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl shrink-0 self-stretch sm:self-auto justify-center sm:justify-start">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-bold">{currentTab.highlight}</span>
          </div>
        </div>

      </div>
    </nav>
  );
}
