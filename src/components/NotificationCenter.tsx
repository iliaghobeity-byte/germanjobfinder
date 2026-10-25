import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { 
  Bell, 
  BellOff, 
  Info, 
  ArrowLeft, 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink,
  Building2,
  CheckCheck,
  Check,
  X,
  Sparkles
} from "lucide-react";
import { 
  getDefaultEmbassyAlerts, 
  getPersianDateString, 
  computeAlertSignature,
  STORAGE_KEY_SEEN_ALERTS,
  STORAGE_KEY_DISMISSED_TOASTS
} from "../embassyAlertsHelpers";

interface Profile {
  name: string;
  age: number;
  degree: string;
  experience: number;
  field: string;
  germanLevel: string;
  englishLevel: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "visa_law" | "new_job" | "system" | "embassy_tehran";
  date: string;
  isRead: boolean;
  isNewOrUpdated?: boolean;
  updateBadgeLabel?: string;
  priority: "high" | "medium" | "low" | "urgent";
  actionLabel?: string;
  targetTab?: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview" | "guide" | "advanced-jobs";
  officialRefUrl?: string;
  sourceLabel?: string;
  signature: string;
}

interface NotificationCenterProps {
  profile?: Profile | null;
  onTabChange: (tab: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview" | "guide" | "advanced-jobs") => void;
}

export default function NotificationCenter({ profile: _profile, onTabChange }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string>(getPersianDateString());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Read saved seen map from localStorage
  const getSavedSeenMap = useCallback((): Record<string, { signature: string; isRead: boolean; seenAt: number }> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEEN_ALERTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, []);

  // Save seen map to localStorage
  const saveSeenMap = useCallback((map: Record<string, { signature: string; isRead: boolean; seenAt: number }>) => {
    try {
      localStorage.setItem(STORAGE_KEY_SEEN_ALERTS, JSON.stringify(map));
      window.dispatchEvent(new CustomEvent("embassy-alerts-viewed"));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Read dismissed toast signatures
  const getDismissedToastSignatures = useCallback((): string[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DISMISSED_TOASTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Save dismissed toast signature
  const saveDismissedToastSignature = useCallback((signature: string) => {
    try {
      const list = getDismissedToastSignatures();
      if (!list.includes(signature)) {
        list.push(signature);
        localStorage.setItem(STORAGE_KEY_DISMISSED_TOASTS, JSON.stringify(list));
      }
    } catch (e) {
      console.error(e);
    }
  }, [getDismissedToastSignatures]);

  // Fetch dynamic embassy and labor law alerts
  const loadNotifications = useCallback(async (forceSync = false) => {
    if (forceSync) setIsSyncing(true);

    try {
      const endpoint = forceSync ? "/api/embassy-alerts/sync" : "/api/embassy-alerts";
      const method = forceSync ? "POST" : "GET";
      const res = await fetch(endpoint, { method });
      
      let embassyList: any[] = [];
      if (res.ok) {
        const data = await res.json();
        if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
          embassyList = data.alerts;
          if (data.lastSync) setLastSyncDate(data.lastSync);
        }
      }

      if (embassyList.length === 0) {
        embassyList = getDefaultEmbassyAlerts();
      }

      const seenMap = getSavedSeenMap();
      const dismissedToasts = getDismissedToastSignatures();

      // Map embassy alerts to notification format using robust content signature
      const formattedEmbassyNotifications: NotificationItem[] = embassyList.map((alert: any) => {
        const sig = computeAlertSignature(alert.id, alert.title, alert.description, alert.officialCode);
        const prevSeen = seenMap[alert.id];

        // An alert is considered read only if it was previously seen with the EXACT SAME content signature
        const isAlreadyRead = !!(prevSeen && prevSeen.signature === sig && prevSeen.isRead);
        const isUpdated = !!(prevSeen && prevSeen.signature !== sig);
        const isBrandNew = !prevSeen;

        return {
          id: alert.id,
          title: alert.title,
          description: alert.description,
          type: alert.category === "urgent_warning" || alert.category === "embassy_tehran" ? "embassy_tehran" : "visa_law",
          date: alert.date || "امروز",
          isRead: isAlreadyRead,
          isNewOrUpdated: isBrandNew || isUpdated,
          updateBadgeLabel: isUpdated ? "بروزرسانی جدید" : isBrandNew ? "اطلاعیه جدید" : undefined,
          priority: alert.priority === "urgent" ? "urgent" : alert.priority === "high" ? "high" : "medium",
          actionLabel: alert.actionLabel || "مشاهده جزئیات",
          targetTab: alert.targetTab || "dashboard",
          officialRefUrl: alert.officialRefUrl,
          sourceLabel: alert.officialRefTitle || "سفارت آلمان در تهران",
          signature: sig
        };
      });

      setNotifications(formattedEmbassyNotifications);

      // ONLY display floating Toast for an UNREAD urgent or high alert whose signature hasn't been dismissed before
      const eligibleToast = formattedEmbassyNotifications.find((n) => 
        !n.isRead && 
        (n.priority === "urgent" || n.priority === "high") &&
        !dismissedToasts.includes(n.signature)
      );

      if (eligibleToast) {
        setActiveToast(eligibleToast);
        setShowToast(true);
      } else {
        setShowToast(false);
      }
    } catch (e) {
      console.warn("Could not load notifications:", e);
    } finally {
      if (forceSync) setIsSyncing(false);
    }
  }, [getSavedSeenMap, getDismissedToastSignatures]);

  useEffect(() => {
    loadNotifications(false);
  }, [loadNotifications]);

  // Listen to external view events (e.g., from EmbassyAlertsBanner)
  useEffect(() => {
    const handleExternalView = () => {
      const seenMap = getSavedSeenMap();
      setNotifications((prev) =>
        prev.map((item) => {
          const itemSeen = seenMap[item.id];
          const isRead = !!(itemSeen && itemSeen.signature === item.signature && itemSeen.isRead);
          return { ...item, isRead, isNewOrUpdated: !isRead && item.isNewOrUpdated };
        })
      );
    };

    window.addEventListener("embassy-alerts-viewed", handleExternalView);
    return () => window.removeEventListener("embassy-alerts-viewed", handleExternalView);
  }, [getSavedSeenMap]);

  // Compute number of unread notifications
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Mark all notifications as read and persist to localStorage
  const markAllAsRead = useCallback(() => {
    const seenMap = getSavedSeenMap();
    const now = Date.now();

    notifications.forEach((item) => {
      seenMap[item.id] = {
        signature: item.signature,
        isRead: true,
        seenAt: now
      };
      saveDismissedToastSignature(item.signature);
    });

    saveSeenMap(seenMap);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, isNewOrUpdated: false })));
    setShowToast(false);
  }, [notifications, getSavedSeenMap, saveSeenMap, saveDismissedToastSignature]);

  // Toggle dropdown and automatically mark all as seen if opened
  const handleToggleDropdown = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      // User has opened the notification center in top-left to view announcements!
      // Mark all current announcements as seen so the badge won't display again
      markAllAsRead();
    }
  };

  // Toggle single item read status
  const toggleReadStatus = (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target) return;

    const nextIsRead = !target.isRead;
    const seenMap = getSavedSeenMap();
    seenMap[id] = {
      signature: target.signature,
      isRead: nextIsRead,
      seenAt: Date.now()
    };
    saveSeenMap(seenMap);

    if (nextIsRead) {
      saveDismissedToastSignature(target.signature);
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: nextIsRead, isNewOrUpdated: !nextIsRead } : n))
    );
  };

  // Handle action click
  const handleActionClick = (notification: NotificationItem) => {
    if (notification.targetTab) {
      onTabChange(notification.targetTab);
    }
    // Mark as read in storage
    const seenMap = getSavedSeenMap();
    seenMap[notification.id] = {
      signature: notification.signature,
      isRead: true,
      seenAt: Date.now()
    };
    saveSeenMap(seenMap);
    saveDismissedToastSignature(notification.signature);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true, isNewOrUpdated: false } : n))
    );

    setIsOpen(false);
    setShowToast(false);
  };

  // Dismiss toast popup and ensure it never appears again for this signature
  const handleDismissToast = () => {
    if (activeToast) {
      saveDismissedToastSignature(activeToast.signature);
      const seenMap = getSavedSeenMap();
      seenMap[activeToast.id] = {
        signature: activeToast.signature,
        isRead: true,
        seenAt: Date.now()
      };
      saveSeenMap(seenMap);
      setNotifications((prev) =>
        prev.map((n) => (n.id === activeToast.id ? { ...n, isRead: true, isNewOrUpdated: false } : n))
      );
    }
    setShowToast(false);
  };

  return (
    <div className="relative" ref={dropdownRef} id="inapp-notification-center">
      {/* Notification Bell Button in Top-Left */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40 select-none group"
        title={
          unreadCount > 0 
            ? `${unreadCount} اطلاعیه و مصوبه جدید یا بروزرسانی‌شده سفارت آلمان` 
            : "تمامی اطلاعیه‌های سفارت مشاهده شده است (پایش خودکار فعال است - اعلان فقط در صورت بروزرسانی نمایش داده می‌شود)"
        }
        aria-label="اعلان اطلاعیه‌های سفارت آلمان و قوانین کار"
      >
        <Bell className={`w-5 h-5 transition-transform group-hover:scale-105 ${
          unreadCount > 0 ? "text-red-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"
        }`} />
        
        {/* ONLY display badge if there is a TRULY UNREAD, NEW or UPDATED notice. Never display once viewed! */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900 shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notifications List Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-right animate-fade-in">
          {/* Dropdown Header */}
          <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black">
                  رسمی
                </span>
                <h3 className="font-extrabold text-xs sm:text-sm text-white">
                  اطلاعیه‌های سفارت آلمان و قوانین کار
                </h3>
              </div>

              {/* Live Sync button */}
              <button
                onClick={() => loadNotifications(true)}
                disabled={isSyncing}
                className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold bg-white/10 hover:bg-white/15 px-2 py-1 rounded-lg transition cursor-pointer"
                title="بروزرسانی مستقیم از سایت سفارت آلمان در تهران"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                <span>همگام‌سازی</span>
              </button>
            </div>
            
            <div className="mt-2.5 flex items-center justify-between text-[10.5px] text-slate-300 font-medium pt-1.5 border-t border-slate-800">
              <span className="text-slate-400">آخرین پایش: {lastSyncDate}</span>
              {unreadCount > 0 ? (
                <button
                  onClick={markAllAsRead}
                  className="text-amber-400 hover:text-amber-300 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>خواندن همه ({unreadCount})</span>
                </button>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>همه اطلاعیه‌ها مشاهده شد</span>
                </span>
              )}
            </div>

            {/* Smart persistent status note */}
            <div className="mt-2 text-[10px] bg-slate-800/90 text-slate-300 rounded-lg px-2.5 py-1.5 border border-slate-700/80 flex items-center gap-1.5 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>پس از مشاهده، اعلان خاموش شده و تنها با ابلاغیه جدید یا بروزرسانی مجدداً نمایش داده می‌شود.</span>
            </div>
          </div>

          {/* Notifications Scroller */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <BellOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">هیچ اعلانی یافت نشد.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 transition duration-150 relative ${
                    item.isRead 
                      ? "bg-white dark:bg-slate-900 opacity-90 hover:opacity-100" 
                      : "bg-indigo-50/60 dark:bg-indigo-950/40 border-r-4 border-indigo-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon Category Identifier */}
                    <div className="mt-1 shrink-0">
                      {item.type === "embassy_tehran" && (
                        <span className="flex p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                          <ShieldAlert className="w-4 h-4" />
                        </span>
                      )}
                      {item.type === "visa_law" && (
                        <span className="flex p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Building2 className="w-4 h-4" />
                        </span>
                      )}
                      {item.type === "system" && (
                        <span className="flex p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Info className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* Content Detail */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                        <div className="flex items-center gap-1">
                          {item.updateBadgeLabel && (
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
                              {item.updateBadgeLabel}
                            </span>
                          )}
                          {item.priority === "urgent" ? (
                            <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-black">
                              فوری
                            </span>
                          ) : item.priority === "high" ? (
                            <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                              مهم
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {item.description}
                      </p>

                      {/* Official ref link if available */}
                      {item.officialRefUrl && (
                        <div className="pt-1">
                          <a
                            href={item.officialRefUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-black inline-flex items-center gap-1 underline underline-offset-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>استعلام رسمی از {item.sourceLabel || "سفارت آلمان"}</span>
                          </a>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2">
                        {item.actionLabel && (
                          <button
                            onClick={() => handleActionClick(item)}
                            className="flex items-center gap-1 text-xs text-white font-black bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition cursor-pointer shadow-sm"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleReadStatus(item.id)}
                          className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold px-2 py-1 rounded transition cursor-pointer flex items-center gap-1"
                          title={item.isRead ? "علامت‌گذاری به عنوان خوانده نشده" : "مشاهده شد"}
                        >
                          {item.isRead ? (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                              <Check className="w-3 h-3" />
                              <span>مشاهده شد</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                              علامت به عنوان خوانده
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dropdown Footer Action */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                markAllAsRead();
                setIsOpen(false);
              }}
              className="w-full text-center text-xs font-black text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>تایید مشاهده تمامی اطلاعیه‌ها و بستن</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Alert for High Priority Embassy Warnings (ONLY shown if unread and never dismissed) */}
      {showToast && activeToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm sm:max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-start gap-3 text-right animate-bounce-short">
          <div className="p-2 bg-red-600/30 text-red-400 rounded-xl mt-0.5 border border-red-500/40 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md font-bold">
                اطلاعیه رسمی سفارت آلمان در تهران
              </span>
              <button
                onClick={handleDismissToast}
                className="text-slate-400 hover:text-white transition cursor-pointer p-1"
                title="بستن و عدم نمایش مجدد تا اطلاعیه جدید"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
              {activeToast.title}
            </h4>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              {activeToast.description}
            </p>
            <div className="flex items-center gap-2 pt-1.5">
              <button
                onClick={() => handleActionClick(activeToast)}
                className="text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition cursor-pointer"
              >
                {activeToast.actionLabel || "مشاهده ابلاغیه"}
              </button>
              <button
                onClick={handleDismissToast}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition cursor-pointer px-2 py-1"
              >
                مشاهده شد (بستن)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
