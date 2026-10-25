import React, { useState, useMemo, useRef } from "react";
import { 
  GUIDE_CATEGORIES, 
  GUIDE_ARTICLES, 
  GuideArticle, 
  GuideCategory 
} from "../data/migrationGuideData";
import { 
  Search, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Compass, 
  FileCheck2, 
  Landmark, 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  Home, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  ExternalLink, 
  Printer, 
  Copy, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  X, 
  Share2, 
  Filter, 
  Lightbulb, 
  FileText,
  ShieldCheck,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateGuidePrintHtml } from "../utils/guidePrintGenerator";
import JahanbanPrintLayout from "./JahanbanPrintLayout";
import { ImmigrationTierRoadmapSection } from "./ImmigrationTierRoadmapSection";
import { ImmigrationTierId, getTierById } from "../data/immigrationTiersData";

interface MigrationGuideProps {
  onNavigateToTab?: (tab: string) => void;
}

export const MigrationGuide: React.FC<MigrationGuideProps> = ({ onNavigateToTab }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("germany_guide_bookmarks");
      return saved ? JSON.parse(saved) : ["stages-complete-roadmap", "visas-eu-blue-card", "healthcare-gkv-vs-pkv"];
    } catch {
      return ["stages-complete-roadmap", "visas-eu-blue-card"];
    }
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("germany_guide_checked_items");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [copiedNotification, setCopiedNotification] = useState(false);

  const [selectedTierId, setSelectedTierId] = useState<ImmigrationTierId>("skilled_worker");
  const [filterArticlesByTier, setFilterArticlesByTier] = useState<boolean>(false);

  const currentTier = useMemo(() => getTierById(selectedTierId), [selectedTierId]);

  // Scroll category pills
  const handleScrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Toggle bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem("germany_guide_bookmarks", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Toggle checklist item
  const toggleChecklistItem = (itemKey: string) => {
    setCheckedChecklistItems(prev => {
      const next = { ...prev, [itemKey]: !prev[itemKey] };
      try {
        localStorage.setItem("germany_guide_checked_items", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Filter articles based on category, search, bookmark state, and tier
  const filteredArticles = useMemo(() => {
    return GUIDE_ARTICLES.filter(article => {
      // Immigration tier filter (if active)
      if (filterArticlesByTier && currentTier.relevantArticleIds && currentTier.relevantArticleIds.length > 0) {
        if (!currentTier.relevantArticleIds.includes(article.id)) {
          return false;
        }
      }
      // Category filter
      if (selectedCategory !== "all" && article.categoryId !== selectedCategory) {
        return false;
      }
      // Bookmark filter
      if (showBookmarksOnly && !bookmarkedIds.includes(article.id)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = article.titleFa.toLowerCase().includes(query) || article.titleDe.toLowerCase().includes(query);
        const matchesSummary = article.summary.toLowerCase().includes(query);
        const matchesTags = article.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesLegal = article.legalBasis?.toLowerCase().includes(query);
        const matchesContent = article.sections.some(sec => 
          sec.heading.toLowerCase().includes(query) || 
          sec.content.some(p => p.toLowerCase().includes(query))
        );
        return matchesTitle || matchesSummary || matchesTags || matchesLegal || matchesContent;
      }
      return true;
    });
  }, [selectedCategory, showBookmarksOnly, searchQuery, bookmarkedIds, filterArticlesByTier, currentTier]);

  const activeArticle = useMemo(() => {
    return GUIDE_ARTICLES.find(a => a.id === selectedArticleId) || null;
  }, [selectedArticleId]);

  // Copy article link or summary
  const handleCopySummary = (article: GuideArticle) => {
    const textToCopy = `${article.titleFa} (${article.titleDe})\n${article.summary}\nمبنای قانونی: ${article.legalBasis || "قوانین مهاجرت آلمان"}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Official Jahanban Print with Metadata Header & Watermark
  const handlePrintArticle = async (article: GuideArticle) => {
    setIsPrinting(true);
    let logoBase64 = "";
    try {
      const res = await fetch("/api/logo-base64");
      const json = await res.json();
      if (json && json.success && json.base64) {
        logoBase64 = json.base64;
      }
    } catch (e) {
      console.warn("Could not fetch logo base64, continuing with SVG fallback", e);
    }

    const cat = GUIDE_CATEGORIES.find(c => c.id === article.categoryId);
    const htmlContent = generateGuidePrintHtml({
      article,
      category: cat,
      logoBase64,
      checkedItemKeys: checkedChecklistItems
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      // Direct high-fidelity print using index.css stylesheet if popup is sandboxed in iframe
      setIsPrinting(false);
      window.print();
      return;
    }

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setIsPrinting(false);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-5 h-5" />;
      case "FileCheck2": return <FileCheck2 className="w-5 h-5" />;
      case "Landmark": return <Landmark className="w-5 h-5" />;
      case "HeartPulse": return <HeartPulse className="w-5 h-5" />;
      case "GraduationCap": return <GraduationCap className="w-5 h-5" />;
      case "Briefcase": return <Briefcase className="w-5 h-5" />;
      case "Home": return <Home className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 print-document-sheet" id="migration-guide-container">
      {/* Intro Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>پایگاه دانش رسمی و مرجع مهاجرت کاری به آلمان (نسخه جامع ۲۰۲۶)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              راهنمای جامع فرآیند مهاجرت و زندگی در آلمان
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              مرجع دسته‌بندی‌شده و قابل جستجوی کلیه مراحل مهاجرت کاری، انواع ویزاها (بلوکارت، کارت فرصت، بند ۸۱a)، مدارک سفارت، و همچنین راهنمای کاربردی زندگی در آلمان اعم از سیستم بهداشت و درمان (GKV/PKV)، آموزش و مدارس، فرهنگ کار و قوانین مالیاتی.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
                showBookmarksOnly
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showBookmarksOnly ? "text-amber-400 fill-amber-400" : "text-slate-400"}`} />
              <span>مطالب نشان‌شده ({bookmarkedIds.length})</span>
            </button>

            <span className="text-[11px] bg-slate-950/80 px-3 py-1.5 rounded-lg text-slate-400 border border-slate-800">
              مجموع راهنماها: {GUIDE_ARTICLES.length} مقاله مرجع
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">
          <div className="md:col-span-8 relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مراحل مهاجرت، انواع ویزا، بیمه، مدارس، فرهنگ کار، ثبت آدرس و..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pr-10 pl-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">همه دسته‌بندی‌ها ({GUIDE_ARTICLES.length})</option>
              {GUIDE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.titleFa}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Immigration Tiers & Interactive Dynamic Roadmap Section */}
      <ImmigrationTierRoadmapSection
        selectedTierId={selectedTierId}
        onSelectTier={(tierId) => setSelectedTierId(tierId)}
        onSelectArticle={(articleId) => {
          setSelectedArticleId(articleId);
        }}
        isFilterAppliedToArticles={filterArticlesByTier}
        onToggleFilterArticles={() => setFilterArticlesByTier(prev => !prev)}
      />

      {/* Category Navigation Bar - Redesigned UI with High Contrast & Scroll Controls */}
      <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
              دسته‌بندی موضوعی راهنما و مراحل مهاجرت
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 font-black">
              {GUIDE_CATEGORIES.length} بخش مرجع
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => handleScrollCategories("right")}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
              title="حرکت به راست"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScrollCategories("left")}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
              title="حرکت به چپ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filterArticlesByTier && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Filter className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                در حال نمایش مقالات منتخب رده: <strong className="font-bold text-slate-900 dark:text-white">{currentTier.titleFa}</strong> ({currentTier.relevantArticleIds.length} مقاله تخصصی)
              </span>
            </div>
            <button
              onClick={() => setFilterArticlesByTier(false)}
              className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[11px] font-bold transition cursor-pointer shrink-0"
            >
              نمایش همه مقالات
            </button>
          </div>
        )}

        {/* Category Buttons List */}
        <div 
          ref={categoryScrollRef}
          className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scroll-smooth"
        >
          {/* All topics pill */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`group relative px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 border-2 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-md shadow-indigo-600/30 scale-[1.02]"
                : "bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-750 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:text-indigo-900 dark:hover:text-white shadow-xs"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition ${
              selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 group-hover:scale-110"
            }`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-black">همه مباحث و راهنماها</span>
            <span className={`px-2 py-0.5 text-[11px] font-black rounded-full transition ${
              selectedCategory === "all"
                ? "bg-white/25 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            }`}>
              {GUIDE_ARTICLES.length}
            </span>
          </button>

          {/* Individual Category Buttons */}
          {GUIDE_CATEGORIES.map(cat => {
            const count = GUIDE_ARTICLES.filter(a => a.categoryId === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2.5 border-2 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 text-white border-indigo-600 shadow-md shadow-indigo-600/30 scale-[1.02]"
                    : "bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-750 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:text-indigo-900 dark:hover:text-white shadow-xs"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:scale-110"
                }`}>
                  {getCategoryIcon(cat.iconName)}
                </div>
                
                <div className="flex flex-col text-right">
                  <span className="font-black tracking-tight">{cat.titleFa}</span>
                  <span className={`text-[10px] font-mono leading-none ${
                    isActive ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {cat.titleDe.split("&")[0].trim()}
                  </span>
                </div>

                <span className={`px-2 py-0.5 text-[11px] font-black rounded-full transition ${
                  isActive 
                    ? "bg-white/25 text-white" 
                    : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Overview Card (if specific category selected) */}
      {selectedCategory !== "all" && (
        <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
          {(() => {
            const curCat = GUIDE_CATEGORIES.find(c => c.id === selectedCategory);
            if (!curCat) return null;
            return (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                  {getCategoryIcon(curCat.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{curCat.titleFa}</h3>
                    <span className="text-xs text-slate-500 font-mono">({curCat.titleDe})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{curCat.shortDesc}</p>
                </div>
              </div>
            );
          })()}
          <button
            onClick={() => setSelectedCategory("all")}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 font-bold shrink-0 cursor-pointer transition"
          >
            مشاهده همه مباحث
          </button>
        </div>
      )}

      {/* Articles Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => {
          const cat = GUIDE_CATEGORIES.find(c => c.id === article.categoryId);
          const isBookmarked = bookmarkedIds.includes(article.id);

          return (
            <div
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md group"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border bg-gradient-to-br ${cat?.badgeColor}`}>
                    {cat?.titleFa}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {article.readTimeMinutes} min
                    </span>

                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className="text-slate-400 hover:text-amber-500 p-1 rounded-lg transition cursor-pointer"
                      title={isBookmarked ? "حذف از نشان‌شده‌ها" : "نشان کردن این راهنما"}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition line-clamp-2 mb-1">
                  {article.titleFa}
                </h3>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-1">
                  {article.titleDe}
                </p>

                {/* Summary */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {article.summary}
                </p>

                {/* Legal basis badge */}
                {article.legalBasis && (
                  <div className="mb-4 text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{article.legalBasis}</span>
                  </div>
                )}
              </div>

              {/* Footer action and tags */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrintArticle(article);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
                    title="چاپ رسمی سند با سربرگ و واترمارک جهانبان"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold hidden sm:inline">چاپ سند</span>
                  </button>
                  {article.tags.slice(0, 1).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 font-black shrink-0">
                  <span>مشاهده کامل</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Search Result */}
      {filteredArticles.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">موردی با عبارت مورد نظر شما یافت نشد</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            لطفاً املای عبارت جستجو را بررسی فرمایید، یا فیلتر دسته‌بندی را به «همه مباحث» تغییر دهید.
          </p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setShowBookmarksOnly(false); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/20"
          >
            پاک کردن فیلترها و مشاهده همه
          </button>
        </div>
      )}

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden print-document-sheet"
              id="guide-article-reader"
            >
              {/* Article-specific Official Print Header */}
              <JahanbanPrintLayout
                activeTab="guide"
                customSubject={`راهنمای تخصصی: ${activeArticle.titleFa} (${activeArticle.titleDe})`}
                customDocId={`JB-DE-2026-${activeArticle.id.toUpperCase().replace(/-/g, "")}`}
                className="jb-article-header"
              />

              {/* Modal Top Header */}
              <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-slate-950/80 shrink-0">
                <div className="space-y-1.5 pr-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {GUIDE_CATEGORIES.find(c => c.id === activeArticle.categoryId)?.titleFa}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      زمان مطالعه: {activeArticle.readTimeMinutes} دقیقه
                    </span>
                    {activeArticle.legalBasis && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {activeArticle.legalBasis}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {activeArticle.titleFa}
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    {activeArticle.titleDe}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start no-print">
                  {/* Prominent Official Print Button */}
                  <button
                    onClick={() => handlePrintArticle(activeArticle)}
                    disabled={isPrinting}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-black flex items-center gap-2 transition shadow-md shadow-indigo-600/30 border border-indigo-500/40 cursor-pointer disabled:opacity-50"
                    title="چاپ رسمی سند با تاریخ، شماره سند، سربرگ و واترمارک جهانبان"
                  >
                    <Printer className="w-4 h-4" />
                    <span>چاپ رسمی سند (A4)</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(activeArticle.id)}
                    className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="نشان کردن این راهنما"
                  >
                    {bookmarkedIds.includes(activeArticle.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleCopySummary(activeArticle)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="کپی چکیده"
                  >
                    {copiedNotification ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedArticleId(null)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer mr-1"
                    title="بستن پنجره"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Article Content (Scrollable) */}
              <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-slate-200">
                {/* Summary Box */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300 mb-1">چکیده راهنما:</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activeArticle.summary}
                    </p>
                  </div>
                </div>

                {/* Main Article Sections */}
                {activeArticle.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3 pt-2">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{section.heading}</span>
                    </h3>

                    <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    {/* Pro Tips box */}
                    {section.tips && section.tips.length > 0 && (
                      <div className="mt-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5 text-xs">
                        <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>نکات طلایی و راهکارهای کاربردی:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 pr-1">
                          {section.tips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings box */}
                    {section.warnings && section.warnings.length > 0 && (
                      <div className="mt-3 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5 text-xs">
                        <div className="font-bold text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>هشدارهای مهم حقوقی و کنسولی:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 pr-1">
                          {section.warnings.map((warn, wIdx) => (
                            <li key={wIdx}>{warn}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive Checklist items */}
                    {section.checklist && section.checklist.length > 0 && (
                      <div className="mt-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          <span>چک‌لیست اقدامات اجرایی این بخش (قابل تیک‌زدن):</span>
                        </div>
                        <div className="space-y-1.5 pr-1">
                          {section.checklist.map((item, cIdx) => {
                            const itemKey = `${activeArticle.id}_sec${idx}_item${cIdx}`;
                            const isChecked = !!checkedChecklistItems[itemKey];
                            return (
                              <label
                                key={cIdx}
                                onClick={() => toggleChecklistItem(itemKey)}
                                className={`flex items-start gap-2.5 p-2 rounded-lg transition cursor-pointer select-none ${
                                  isChecked 
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 line-through opacity-80" 
                                    : "bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-850"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Official Jahanban Print Banner inside Reader */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border-2 border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0">
                      <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                        <span>نسخه چاپی رسمی با سربرگ، تاریخ و شماره سند</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                          A4 Formal Format
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        شامل کادر کامل مشخصات اداری (تاریخ، شماره سند، تیتر، موضوع، منبع، آخرین آپدیت) به همراه پس‌زمینه و واترمارک اختصاصی جهانبان.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePrintArticle(activeArticle)}
                    disabled={isPrinting}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-2 transition shadow-lg shadow-indigo-600/25 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4" />
                    <span>ارسال برای چاپ رسمی</span>
                  </button>
                </div>

                {/* Official Links Footer */}
                {activeArticle.officialLinks && activeArticle.officialLinks.length > 0 && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 mt-6">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-indigo-400" />
                      <span>منابع و پورتال‌های رسمی دولت فدرال آلمان:</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.officialLinks.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-indigo-300 text-xs flex items-center gap-1.5 transition"
                        >
                          <span>{link.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reader Modal Bottom Toolbar */}
              <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>برچسب‌ها:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeArticle.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintArticle(activeArticle)}
                    disabled={isPrinting}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>چاپ رسمی این سند (A4)</span>
                  </button>

                  <button
                    onClick={() => setSelectedArticleId(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold transition cursor-pointer"
                  >
                    بستن و بازگشت
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MigrationGuide;
