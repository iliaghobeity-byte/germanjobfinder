import React, { useState, useEffect } from "react";
import { 
  Bell, 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowLeft,
  Calendar,
  Building2,
  FileCheck2,
  Info,
  Search
} from "lucide-react";
import { EmbassyAlert } from "../types";
import { 
  getDefaultEmbassyAlerts, 
  getPersianDateString,
  computeAlertSignature,
  STORAGE_KEY_SEEN_ALERTS,
  STORAGE_KEY_BANNER_DISMISSED
} from "../embassyAlertsHelpers";

interface EmbassyAlertsBannerProps {
  onTabChange?: (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview") => void;
}

export default function EmbassyAlertsBanner({ onTabChange }: EmbassyAlertsBannerProps) {
  const [alerts, setAlerts] = useState<EmbassyAlert[]>(() => {
    try {
      const saved = localStorage.getItem("germany_embassy_alerts");
      return saved ? JSON.parse(saved) : getDefaultEmbassyAlerts();
    } catch {
      return getDefaultEmbassyAlerts();
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string>(() => {
    return localStorage.getItem("germany_embassy_last_sync") || getPersianDateString();
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [syncSuccessMsg, setSyncSuccessMsg] = useState("");
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BANNER_DISMISSED);
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Mark all alerts as viewed in persistent localStorage and notify top-left notification center
  const markAllAlertsAsViewed = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEEN_ALERTS);
      const seenMap = saved ? JSON.parse(saved) : {};
      const now = Date.now();
      alerts.forEach((alert) => {
        const sig = computeAlertSignature(alert.id, alert.title, alert.description, alert.officialCode);
        seenMap[alert.id] = { signature: sig, isRead: true, seenAt: now };
      });
      localStorage.setItem(STORAGE_KEY_SEEN_ALERTS, JSON.stringify(seenMap));
      window.dispatchEvent(new CustomEvent("embassy-alerts-viewed"));
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-unhide banner if an alert has been updated or is brand new
  useEffect(() => {
    if (!isDismissed || alerts.length === 0) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEEN_ALERTS);
      const seenMap = saved ? JSON.parse(saved) : {};
      const hasUnseen = alerts.some((alert) => {
        const sig = computeAlertSignature(alert.id, alert.title, alert.description, alert.officialCode);
        const itemSeen = seenMap[alert.id];
        return !itemSeen || itemSeen.signature !== sig;
      });
      if (hasUnseen) {
        setIsDismissed(false);
        localStorage.removeItem(STORAGE_KEY_BANNER_DISMISSED);
      }
    } catch {}
  }, [alerts, isDismissed]);

  const handleDismissBanner = () => {
    markAllAlertsAsViewed();
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_BANNER_DISMISSED, "true");
    } catch {}
  };

  const handleOpenModal = () => {
    markAllAlertsAsViewed();
    setIsModalOpen(true);
  };

  // Fetch live embassy alerts from backend API on mount
  const fetchEmbassyAlerts = async (showSyncIndicator = false) => {
    if (showSyncIndicator) setIsSyncing(true);
    try {
      const endpoint = showSyncIndicator ? "/api/embassy-alerts/sync" : "/api/embassy-alerts";
      const method = showSyncIndicator ? "POST" : "GET";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
          setAlerts(data.alerts);
          setLastSyncDate(data.lastSync || getPersianDateString());
          localStorage.setItem("germany_embassy_alerts", JSON.stringify(data.alerts));
          localStorage.setItem("germany_embassy_last_sync", data.lastSync || getPersianDateString());
          
          if (showSyncIndicator) {
            setSyncSuccessMsg("اطلاعیه‌ها مستقیماً از پورتال رسمی سفارت آلمان در تهران به‌روزرسانی شد.");
            setTimeout(() => setSyncSuccessMsg(""), 4000);
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch latest embassy alerts from server:", e);
    } finally {
      if (showSyncIndicator) setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchEmbassyAlerts(false);
  }, []);

  // Auto-cycle ticker every 7 seconds
  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  const currentAlert = alerts[currentIndex] || alerts[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % alerts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
  };

  const handleActionClick = (alert: EmbassyAlert) => {
    if (alert.targetTab && onTabChange) {
      onTabChange(alert.targetTab);
    }
    setIsModalOpen(false);
  };

  // Filter alerts in modal
  const filteredAlerts = alerts.filter((item) => {
    const matchesCategory = selectedCategory === "all" || 
      (selectedCategory === "embassy" && (item.category === "embassy_tehran" || item.category === "urgent_warning")) ||
      (selectedCategory === "labor" && (item.category === "labor_law" || item.category === "bluecard")) ||
      (selectedCategory === "chancenkarte" && item.category === "chancenkarte") ||
      (selectedCategory === "tlscontact" && (item.category === "tlscontact" || item.category === ("visametric" as any)));

    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeClass = (category?: string, priority?: string) => {
    if (priority === "urgent" || category === "urgent_warning") {
      return "bg-red-600 text-white border-red-700";
    }
    if (category === "bluecard" || category === "labor_law") {
      return "bg-blue-600 text-white border-blue-700";
    }
    if (category === "chancenkarte") {
      return "bg-emerald-600 text-white border-emerald-700";
    }
    if (category === "tlscontact") {
      return "bg-purple-600 text-white border-purple-700";
    }
    return "bg-amber-500 text-slate-950 border-amber-600";
  };

  if (isDismissed) {
    return (
      <div className="w-full mb-6 text-right" id="embassy-live-alerts-container">
        <div className="bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 sm:px-4 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              اطلاعیه‌های سفارت آلمان و قوانین کار مشاهده شد. (پایش خودکار فعال است - اعلان فقط در صورت بروزرسانی فعال می‌شود)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsDismissed(false);
                try {
                  localStorage.removeItem(STORAGE_KEY_BANNER_DISMISSED);
                } catch {}
              }}
              className="text-indigo-600 dark:text-amber-400 hover:text-indigo-800 dark:hover:text-amber-300 font-black cursor-pointer text-xs underline underline-offset-2 shrink-0"
            >
              نمایش مجدد بنر ({alerts.length} اطلاعیه)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-6 text-right" id="embassy-live-alerts-container">
      {/* High-Contrast Clear Daily Alerts Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-amber-500/40 dark:border-amber-500/30 relative overflow-hidden transition-all duration-200">
        
        {/* Top German Flag Tri-Color Accent Line */}
        <div className="absolute top-0 right-0 left-0 h-1.5 flex">
          <span className="flex-1 bg-black" />
          <span className="flex-1 bg-red-600" />
          <span className="flex-1 bg-amber-500" />
        </div>

        <div className="relative z-10 pt-1 flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Right: Section Header Pill & Active Notice Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto flex-1 min-w-0">
            
            {/* Live Indicator Chip */}
            <div className="flex items-center justify-center sm:justify-start gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shrink-0 shadow-sm border border-red-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="whitespace-nowrap">پایش روزانه سفارت آلمان در ایران (هشدارها)</span>
            </div>

            {/* Current Alert Content with High-Contrast Typography */}
            {currentAlert && (
              <div 
                className="flex-1 min-w-0 cursor-pointer group flex items-center justify-between gap-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50/70 dark:hover:bg-slate-700/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition"
                onClick={handleOpenModal}
                title="کلیک برای مطالعه جزئیات کامل این ابلاغیه"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-md font-black shrink-0 shadow-xs border ${getCategoryBadgeClass(currentAlert.category, currentAlert.priority)}`}>
                    {currentAlert.categoryLabelFa || "ابلاغیه رسمی"}
                  </span>
                  
                  <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-amber-300 transition truncate leading-relaxed">
                    {currentAlert.title}
                  </p>
                </div>

                <span className="text-[11px] text-indigo-700 dark:text-amber-300 font-black bg-indigo-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg shrink-0 hidden md:inline border border-indigo-300 dark:border-amber-700/60 shadow-xs">
                  مشاهده متن کامل
                </span>
              </div>
            )}
          </div>

          {/* Left: Navigation Controls & Sync / View All Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-200 dark:border-slate-800 pt-2.5 lg:pt-0">
            
            {/* Date Tag */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-black bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lastSyncDate}</span>
            </div>

            {/* Arrows & Counter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                title="اطلاعیه قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-indigo-900 dark:text-amber-300 font-mono font-black px-2">
                {currentIndex + 1} / {alerts.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                title="اطلاعیه بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Live Sync Button */}
            <button
              onClick={() => fetchEmbassyAlerts(true)}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-xl text-xs font-black transition border border-slate-300 dark:border-slate-600 cursor-pointer disabled:opacity-50 shadow-xs"
              title="بروزرسانی مستقیم از سایت سفارت آلمان در تهران (teheran.diplo.de)"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isSyncing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">همگام‌سازی</span>
            </button>

            {/* View All Modal Trigger */}
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition shadow-md cursor-pointer border border-amber-600"
            >
              <Bell className="w-4 h-4" />
              <span>همه هشدارها ({alerts.length})</span>
            </button>

            {/* Dismiss Banner Button */}
            <button
              onClick={handleDismissBanner}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition border border-slate-300 dark:border-slate-700 cursor-pointer"
              title="مشاهده شد (عدم نمایش مجدد تا زمان بروزرسانی جدید)"
              aria-label="بستن بنر"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sync notification flash message */}
        {syncSuccessMsg && (
          <div className="mt-2 text-center text-xs font-black text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 rounded-xl py-1.5 px-4 animate-fade-in">
            ✓ {syncSuccessMsg}
          </div>
        )}
      </div>

      {/* Comprehensive Embassy Announcements Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border-2 border-slate-300 dark:border-slate-700 flex flex-col overflow-hidden text-right">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-white leading-tight">
                      اطلاعیه‌ها و هشدارهای روزانه سفارت آلمان در تهران و قوانین کار
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">
                      منبع استناد رسمی: بخش روادید سفارت آلمان در تهران (teheran.diplo.de)، کارگزاری TLScontact و سامانه فدرال Make it in Germany
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                title="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Subheader Controls: Categories & Search */}
            <div className="bg-slate-50 dark:bg-slate-800/90 p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: "همه اطلاعیه‌ها" },
                  { id: "embassy", label: "سفارت آلمان در تهران" },
                  { id: "labor", label: "قوانین کار و بلوکارت" },
                  { id: "chancenkarte", label: "کارت فرصت" },
                  { id: "tlscontact", label: "کارگزاری TLScontact ایران" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Live Sync Status & Action */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-black bg-white dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600">
                  {lastSyncDate}
                </span>
                <button
                  onClick={() => fetchEmbassyAlerts(true)}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>همگام‌سازی روزانه</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="px-4 sm:px-6 pt-3 pb-1 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجو در متن هشدارها و مصوبات سفارت (مثال: نوبت‌دهی، بلوکارت، تمکن، TLScontact)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Modal Body: Announcements List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[58vh] bg-slate-50 dark:bg-slate-950/50">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <Info className="w-10 h-10 mx-auto mb-2 opacity-50 text-indigo-500" />
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">اطلاعیه‌ای مطابق با جستجو یا دسته‌بندی انتخابی یافت نشد.</p>
                </div>
              ) : (
                filteredAlerts.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ${
                      item.priority === "urgent"
                        ? "bg-red-50/95 dark:bg-red-950/40 border-red-300 dark:border-red-700 shadow-sm"
                        : item.priority === "high"
                        ? "bg-amber-50/95 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5">
                      
                      {/* Content */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-lg font-black border ${getCategoryBadgeClass(item.category, item.priority)}`}
                          >
                            {item.categoryLabelFa}
                          </span>

                          {item.priority === "urgent" && (
                            <span className="text-xs bg-red-600 text-white px-2.5 py-0.5 rounded-lg font-black animate-pulse shadow-sm">
                              هشدار فوری سفارت
                            </span>
                          )}

                          {item.officialCode && (
                            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md font-mono font-bold">
                              کد ابلاغیه: {item.officialCode}
                            </span>
                          )}

                          <span className="text-xs text-slate-600 dark:text-slate-400 font-black">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-950 dark:text-white leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-bold">
                          {item.description}
                        </p>

                        {/* Official Reference Link */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <a
                            href={item.officialRefUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 hover:text-indigo-950 dark:hover:text-white font-black underline underline-offset-4"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>استعلام سند رسمی از: {item.officialRefTitle}</span>
                          </a>
                        </div>
                      </div>

                      {/* Action Button inside app */}
                      {item.actionLabel && (
                        <div className="shrink-0 pt-2 sm:pt-0">
                          <button
                            onClick={() => handleActionClick(item)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition shadow-md cursor-pointer"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 font-bold">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>پایشگر هوشمند کنسولی خانه خلاق جهانبان | به‌روزرسانی مستمر و منطبق با مصوبات ۲۰۲۶</span>
              </div>
              <button
                onClick={() => {
                  markAllAlertsAsViewed();
                  setIsModalOpen(false);
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>تایید مشاهده و بستن پنجره</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
