import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Printer,
  X,
  Eye,
  CheckCircle2,
  Maximize2,
  Minimize2,
  FileEdit,
  Scissors,
  Ruler,
  Sliders,
  ShieldCheck,
  Layers,
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  ArrowUp,
  Sparkles,
  BookOpen
} from "lucide-react";

export type PrintMarginPreset = "compact" | "standard" | "wide";

export interface MarginOption {
  id: PrintMarginPreset;
  label: string;
  badge: string;
  tooltip: string;
  top: string;
  bottom: string;
  left: string;
  right: string;
}

export const MARGIN_OPTIONS: MarginOption[] = [
  {
    id: "compact",
    label: "فشرده",
    badge: "۶mm",
    tooltip: "حاشیه فشرده (۶ میلی‌متر): مناسب صرفه‌جویی در مصرف کاغذ و پرینترهای حاشیه‌باریک",
    top: "6mm",
    bottom: "8mm",
    left: "6mm",
    right: "6mm",
  },
  {
    id: "standard",
    label: "استاندارد (DIN A4)",
    badge: "DIN A4 (۸mm)",
    tooltip: "حاشیه استاندارد رسمی A4 آلمان (بالا: ۸mm، چپ: ۶mm، راست: ۶mm، پایین: ۱۰mm)",
    top: "8mm",
    bottom: "10mm",
    left: "6mm",
    right: "6mm",
  },
  {
    id: "wide",
    label: "عریض",
    badge: "۱۲mm",
    tooltip: "حاشیه عریض (۱۲ میلی‌متر): مناسب پانچ کردن، زونکن‌های بایگانی و صحافی اداری",
    top: "12mm",
    bottom: "14mm",
    left: "10mm",
    right: "10mm",
  },
];

export interface PrintSimulationBarProps {
  active: boolean;
  onClose: () => void;
  activeTab?: string;
  candidateName?: string;
}

export const PrintSimulationBar: React.FC<PrintSimulationBarProps> = ({
  active,
  onClose,
  activeTab = "dashboard",
  candidateName
}) => {
  const [zoomLevel, setZoomLevel] = useState<"a4-real" | "fit">("fit");
  const [multiPageMode, setMultiPageMode] = useState<boolean>(true);
  const [protectTablesAndCharts, setProtectTablesAndCharts] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [splitPreventedCount, setSplitPreventedCount] = useState<number>(0);

  // Watermark toggle state with persistence in localStorage (defaults to clean for formal CVs)
  const [showWatermark, setShowWatermark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("jahanban_print_watermark_enabled");
      if (saved !== null) {
        return saved === "true";
      }
      if (activeTab === "cv") {
        return false;
      }
    } catch {
      // ignore
    }
    return activeTab !== "cv";
  });

  const handleWatermarkChange = (enabled: boolean) => {
    setShowWatermark(enabled);
    try {
      localStorage.setItem("jahanban_print_watermark_enabled", String(enabled));
      localStorage.setItem("jahanban_cv_watermark_enabled", String(enabled));
    } catch {
      // ignore
    }
  };

  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);

  // Margin Preset: Compact, Standard, Wide with persistence in localStorage
  const [marginPreset, setMarginPreset] = useState<PrintMarginPreset>(() => {
    try {
      const saved = localStorage.getItem("jahanban_print_margin_preset");
      if (saved === "compact" || saved === "standard" || saved === "wide") {
        return saved;
      }
    } catch {
      // ignore
    }
    return "standard";
  });

  const handleMarginChange = (preset: PrintMarginPreset) => {
    setMarginPreset(preset);
    try {
      localStorage.setItem("jahanban_print_margin_preset", preset);
    } catch {
      // ignore
    }
  };

  // Compute default filename
  const defaultFilename = useMemo(() => {
    const rawName = candidateName?.trim() || "Candidate";
    const sanitizedName = rawName.replace(/[\s/\\?%*:|"<>]+/g, "_");
    const today = new Date().toISOString().slice(0, 10);
    return `German_Career_Compass_${sanitizedName}_${today}.pdf`;
  }, [candidateName]);

  const [customFilename, setCustomFilename] = useState<string>(defaultFilename);

  useEffect(() => {
    setCustomFilename(defaultFilename);
  }, [defaultFilename]);

  // Sync watermark toggle class with document body
  useEffect(() => {
    if (!active) {
      document.body.classList.remove("hide-watermark");
      return;
    }
    if (showWatermark) {
      document.body.classList.remove("hide-watermark");
    } else {
      document.body.classList.add("hide-watermark");
    }
    return () => {
      document.body.classList.remove("hide-watermark");
    };
  }, [active, showWatermark]);

  // Sync visual guidelines toggle with document body
  useEffect(() => {
    if (!active) {
      document.body.classList.remove("hide-guidelines");
      return;
    }
    if (showGuidelines) {
      document.body.classList.remove("hide-guidelines");
    } else {
      document.body.classList.add("hide-guidelines");
    }
    return () => {
      document.body.classList.remove("hide-guidelines");
    };
  }, [active, showGuidelines]);

  // Close on ESC key
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, onClose]);

  // Update zoom class on body when zoom level changes
  useEffect(() => {
    if (!active) {
      document.body.classList.remove("print-zoom-fit", "print-zoom-a4");
      return;
    }
    if (zoomLevel === "fit") {
      document.body.classList.add("print-zoom-fit");
      document.body.classList.remove("print-zoom-a4");
    } else {
      document.body.classList.add("print-zoom-a4");
      document.body.classList.remove("print-zoom-fit");
    }
  }, [active, zoomLevel]);

  // Sync margin preset class with body and inject dynamic @page print CSS
  useEffect(() => {
    if (!active) {
      document.body.classList.remove("print-margin-compact", "print-margin-standard", "print-margin-wide");
      return;
    }

    document.body.classList.remove("print-margin-compact", "print-margin-standard", "print-margin-wide");
    document.body.classList.add(`print-margin-${marginPreset}`);

    const activeOption = MARGIN_OPTIONS.find((o) => o.id === marginPreset) || MARGIN_OPTIONS[1];
    const styleId = "dynamic-print-margin-style";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @media print {
        @page {
          size: A4 portrait;
          margin-top: ${activeOption.top} !important;
          margin-bottom: ${activeOption.bottom} !important;
          margin-left: ${activeOption.left} !important;
          margin-right: ${activeOption.right} !important;
        }
      }
    `;

    return () => {
      document.body.classList.remove("print-margin-compact", "print-margin-standard", "print-margin-wide");
    };
  }, [active, marginPreset]);

  // Get active printable container element
  const getContainerEl = useCallback((): HTMLElement | null => {
    return (
      (document.getElementById("dashboard-tab") as HTMLElement) ||
      (document.getElementById("migration-guide-container") as HTMLElement) ||
      (document.getElementById("guide-article-reader") as HTMLElement) ||
      (document.querySelector(".print-document-sheet") as HTMLElement)
    );
  }, []);

  // --------------------------------------------------------------------------
  // Multi-Page Layout Engine & Smart Chart/Table Cut Protection
  // --------------------------------------------------------------------------
  const updateMultiPageSimulation = useCallback(() => {
    if (!active) return;
    const container = getContainerEl();
    if (!container) return;

    // Remove existing simulated dividers, page watermarks, and simulated page footers
    const existingDividers = container.querySelectorAll(".simulated-page-break-divider");
    existingDividers.forEach((d) => d.remove());
    const existingWatermarks = container.querySelectorAll(".simulated-page-watermark");
    existingWatermarks.forEach((w) => w.remove());
    const existingFooters = container.querySelectorAll(".simulated-page-footer");
    existingFooters.forEach((f) => f.remove());

    const widthPx = container.offsetWidth || 794;
    // Standard A4 aspect ratio: 297mm / 210mm = 1.414285
    const a4PageHeightPx = Math.round(widthPx * (297 / 210));
    const containerRect = container.getBoundingClientRect();
    const containerTopInDoc = containerRect.top + window.scrollY;

    // Reset all previously pushed charts/tables first
    const pushedElements = container.querySelectorAll(".simulated-chart-table-pushed");
    pushedElements.forEach((el) => {
      (el as HTMLElement).style.marginTop = "";
      el.classList.remove("simulated-chart-table-pushed");
      el.removeAttribute("data-pushed-page-break");
    });

    let preventedCount = 0;

    // If table/chart protection is ON, check all candidate elements
    if (protectTablesAndCharts) {
      const candidates = container.querySelectorAll<HTMLElement>(
        "table, .recharts-responsive-container, .recharts-wrapper, svg.recharts-surface, #dashboard-radar-card, #dashboard-immigration-budget-section, #immigration-budget-planner-card, #skills-gap-analysis-chart, #visa-strategy-simulator-forecast, .radar-card, .evaluation-card, .report-card, .summary-box, .profile-card, #jb-print-candidate-profile, #dashboard-evaluation-cards-section"
      );

      // Max pages to check (up to 12 pages)
      const maxPages = 12;

      candidates.forEach((cand) => {
        // Skip hidden elements or nested charts if parent is already protected
        if (cand.offsetParent === null) return;
        if (cand.closest(".simulated-chart-table-pushed") && !cand.classList.contains("simulated-chart-table-pushed")) {
          return;
        }

        const candRect = cand.getBoundingClientRect();
        const candTop = candRect.top + window.scrollY - containerTopInDoc;
        const candBottom = candTop + cand.offsetHeight;

        for (let p = 1; p <= maxPages; p++) {
          const pageCutY = p * a4PageHeightPx;

          // Check if candidate intersects the page break boundary
          if (candTop < pageCutY && candBottom > pageCutY) {
            // Push element to the top of the next page with clean breathing clearance
            const pushDistance = Math.max(16, pageCutY - candTop + 16);
            cand.style.marginTop = `${pushDistance}px`;
            cand.classList.add("simulated-chart-table-pushed");
            cand.setAttribute("data-pushed-page-break", "true");
            preventedCount++;
            break;
          }
        }
      });
    }

    setSplitPreventedCount(preventedCount);

    // Re-measure container height after any chart pushing
    const docHeightPx = container.scrollHeight;
    const computedPages = Math.max(1, Math.ceil(docHeightPx / a4PageHeightPx));
    setPageCount(computedPages);

    // Update pagination labels in any existing .jb-print-footer
    const existingMainFooter = container.querySelector(".jb-print-footer");
    if (existingMainFooter) {
      const curPageEl = existingMainFooter.querySelector(".jb-print-page-current");
      const totPageEl = existingMainFooter.querySelector(".jb-print-page-total");
      if (curPageEl) curPageEl.textContent = `${computedPages}`;
      if (totPageEl) totPageEl.textContent = `${computedPages}`;
    }

    // Helper to generate official company footer markup for Jahanban Creative House
    const createFooterElement = (pageNum: number, totalPages: number, topPx?: number) => {
      const footer = document.createElement("div");
      footer.className = "simulated-page-footer";
      if (topPx !== undefined) {
        footer.style.top = `${topPx}px`;
      }
      footer.setAttribute("role", "contentinfo");
      footer.setAttribute("aria-label", `پاورقی رسمی خانه خلاق جهانبان صفحه ${pageNum}`);
      footer.innerHTML = `
        <div class="simulated-page-footer-top">
          <div class="simulated-page-footer-legal">
            <span class="simulated-page-footer-brand font-black text-slate-900 text-xs">خانه خلاق جهانبان (Jahanban Creative House)</span>
            <span class="simulated-page-footer-sep text-slate-400">•</span>
            <span class="simulated-page-footer-law text-[10.5px] font-bold text-slate-700">استناد قانونی: قانون مهاجرت نیروی متخصص آلمان (FEG 2026)</span>
          </div>
          <div class="simulated-page-footer-meta flex items-center gap-2">
            <div class="simulated-page-pagination inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-[10.5px] font-bold text-slate-900">
              <span>صفحه</span>
              <span class="font-bold">${pageNum}</span>
              <span>از</span>
              <span class="font-bold">${totalPages}</span>
            </div>
            <div class="simulated-page-ref font-mono font-bold text-[10.5px] text-slate-700" dir="ltr">JB-DE-2026-A4</div>
          </div>
        </div>
        <div class="simulated-page-footer-bottom flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[9.5px] text-slate-600 font-medium pt-1 border-t border-slate-200">
          <div class="simulated-page-footer-address flex items-center gap-1.5 text-slate-700">
            <span class="font-bold text-slate-900">نشانی رسمی:</span>
            <span>تهران، پونک، بلوار میرزابابایی بین ستاری و سردار جنگل، پلاک 168 طبقه 4 تلفن : 74865</span>
            <span class="simulated-page-footer-sep text-slate-400">•</span>
            <span dir="ltr" class="font-mono text-slate-600">Friedrichstraße 123, 10117 Berlin</span>
          </div>
          <div class="simulated-page-footer-contacts flex items-center gap-2 text-slate-800">
            <span class="font-bold" dir="ltr">تلفن: 74865 (021)</span>
            <span class="simulated-page-footer-sep text-slate-400">•</span>
            <span class="font-mono font-semibold text-slate-900">info@jahanban.group</span>
            <span class="simulated-page-footer-sep text-slate-400">•</span>
            <span class="font-mono font-extrabold text-indigo-900">www.jahanban.group</span>
          </div>
        </div>
      `;
      return footer;
    };

    // If multiPageMode is active, inject visual page break dividers, watermarks, and footers on EVERY page
    if (multiPageMode && computedPages > 1) {
      for (let p = 1; p < computedPages; p++) {
        const breakY = p * a4PageHeightPx;

        // 1. Inject official footer at the bottom of page p (positioned 48px above the page cut)
        const pageFooter = createFooterElement(p, computedPages, breakY - 48);
        container.appendChild(pageFooter);

        // 2. Inject visual page cut indicator
        const divider = document.createElement("div");
        divider.className = "simulated-page-break-divider";
        divider.style.top = `${breakY}px`;
        divider.innerHTML = `
          <div class="simulated-page-break-badge">
            <span style="font-size: 11px;">✂️</span>
            <span>مرز صفحه A4 • پایان صفحه ${p} (۲۹۷mm)</span>
          </div>
          <div class="simulated-page-break-indicator-right">
            <span>📄 شروع صفحه ${p + 1}</span>
          </div>
        `;
        container.appendChild(divider);

        // 3. Inject central watermark overlay for subsequent simulated pages
        if (showWatermark) {
          const pageCenterY = Math.round(breakY + a4PageHeightPx / 2);
          const pageWatermark = document.createElement("div");
          pageWatermark.className = "simulated-page-watermark";
          pageWatermark.style.top = `${pageCenterY}px`;
          pageWatermark.setAttribute("aria-hidden", "true");
          container.appendChild(pageWatermark);
        }
      }

      // If the container doesn't already have an official footer at the very end, append one for the final page
      if (!container.querySelector(".jb-print-footer")) {
        const finalFooter = createFooterElement(computedPages, computedPages);
        container.appendChild(finalFooter);
      }
    } else if (computedPages === 1 && !container.querySelector(".jb-print-footer")) {
      // Single page document without built-in footer: inject the official footer
      const singleFooter = createFooterElement(1, 1);
      container.appendChild(singleFooter);
    }
  }, [active, getContainerEl, multiPageMode, protectTablesAndCharts, showWatermark]);

  // Run multi-page simulation updates and listen to resize / DOM updates
  useEffect(() => {
    if (!active) {
      const container = getContainerEl();
      if (container) {
        const dividers = container.querySelectorAll(".simulated-page-break-divider");
        dividers.forEach((d) => d.remove());
        const watermarks = container.querySelectorAll(".simulated-page-watermark");
        watermarks.forEach((w) => w.remove());
        const footers = container.querySelectorAll(".simulated-page-footer");
        footers.forEach((f) => f.remove());
        watermarks.forEach((w) => w.remove());
        const pushed = container.querySelectorAll(".simulated-chart-table-pushed");
        pushed.forEach((el) => {
          (el as HTMLElement).style.marginTop = "";
          el.classList.remove("simulated-chart-table-pushed");
          el.removeAttribute("data-pushed-page-break");
        });
      }
      return;
    }

    // Debounced layout computation
    const timeout = setTimeout(updateMultiPageSimulation, 150);
    window.addEventListener("resize", updateMultiPageSimulation);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateMultiPageSimulation);
    };
  }, [active, getContainerEl, updateMultiPageSimulation]);

  // Track current page based on scroll position
  useEffect(() => {
    if (!active) return;
    const handleScroll = () => {
      const container = getContainerEl();
      if (!container) return;
      const widthPx = container.offsetWidth || 794;
      const a4PageHeightPx = Math.round(widthPx * (297 / 210));
      const containerRect = container.getBoundingClientRect();
      const scrolledPast = Math.max(0, -containerRect.top + 100);
      const pageIndex = Math.min(pageCount, Math.max(1, Math.floor(scrolledPast / a4PageHeightPx) + 1));
      setCurrentPage(pageIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active, getContainerEl, pageCount]);

  // Jump to specific page
  const scrollToPage = (pageNum: number) => {
    const container = getContainerEl();
    if (!container) return;
    const widthPx = container.offsetWidth || 794;
    const a4PageHeightPx = Math.round(widthPx * (297 / 210));
    const containerTopInDoc = container.getBoundingClientRect().top + window.scrollY;
    const targetY = containerTopInDoc + (pageNum - 1) * a4PageHeightPx - 70;
    window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    setCurrentPage(pageNum);
  };

  if (!active) return null;

  const getFinalFilename = () => {
    let fn = customFilename?.trim() || defaultFilename;
    if (!fn.toLowerCase().endsWith(".pdf")) {
      fn += ".pdf";
    }
    return fn;
  };

  const handlePrintNow = () => {
    const originalTitle = document.title;
    try {
      const activeName = getFinalFilename().replace(/\.pdf$/i, "");
      document.title = activeName;
      window.print();
    } finally {
      setTimeout(() => {
        document.title = originalTitle;
      }, 1500);
    }
  };

  return (
    <>
      <aside
        role="region"
        aria-label="نوار ابزار شبیه‌ساز چاپ چندصفحه‌ای"
        className="print-simulation-toolbar fixed top-0 left-0 right-0 z-[9999999] bg-slate-900/95 backdrop-blur-md text-white border-b-2 border-amber-500/80 px-3.5 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 select-none no-print transition-all"
        id="print-simulation-toolbar"
        dir="rtl"
      >
        {/* Right side: Badge & Multi-Page Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-amber-400 tracking-tight">
                شبیه‌ساز چیدمان چندصفحه‌ای A4
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold">
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>{pageCount} صفحه A4</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>صفحه {currentPage} از {pageCount}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden xl:block">
              مرز صفحات، خطوط تا و عدم برش جداول و نمودارها طبق استاندارد چاپ DIN A4 شبیه‌سازی شده‌اند.
            </p>
          </div>
        </div>

        {/* Center: Multi-Page Mode, Chart/Table Safe-Cut, Page Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Multi-Page Navigation Jump Buttons */}
          {pageCount > 1 && (
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <span className="text-[10px] text-slate-400 px-1 font-bold hidden sm:inline">پرش:</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: pageCount }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isCurrent = currentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => scrollToPage(pNum)}
                      className={`simulation-action-btn px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                        isCurrent
                          ? "bg-amber-500 text-slate-950 font-black shadow"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                      }`}
                      title={`نمایش و پرش به صفحه ${pNum}`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Smart Chart and Table Protection Toggle */}
          <button
            type="button"
            onClick={() => setProtectTablesAndCharts(!protectTablesAndCharts)}
            className={`simulation-action-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              protectTablesAndCharts
                ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-sm"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title="جلوگیری خودکار از قطع شدن یا نصف شدن جداول، نمودارهای Recharts و کارت‌های ارزیابی بین دو صفحه"
            id="btn-sim-protect-charts-tables"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${protectTablesAndCharts ? "text-emerald-400" : "text-slate-500"}`} />
            <span>محافظت از جداول و نمودارها</span>
            {protectTablesAndCharts && splitPreventedCount > 0 && (
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 font-mono font-bold">
                {splitPreventedCount} مورد
              </span>
            )}
          </button>

          {/* Multi-Page Sheet Dividers Toggle */}
          <button
            type="button"
            onClick={() => setMultiPageMode(!multiPageMode)}
            className={`simulation-action-btn hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              multiPageMode
                ? "bg-indigo-900/60 border-indigo-500/70 text-indigo-200 shadow-sm"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title="نمایش یا عدم نمایش خطوط برش برگه A4 و تفکیک صفحات (۲۹۷ میلی‌متر)"
            id="btn-sim-toggle-multipage"
          >
            <Scissors className="w-3.5 h-3.5 text-indigo-400" />
            <span>مرز صفحات A4</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setZoomLevel("fit")}
              className={`simulation-action-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                zoomLevel === "fit"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
              title="تطبیق اندازه با عرض پنجره مرورگر"
              id="btn-print-sim-fit"
            >
              <Minimize2 className="w-3 h-3" />
              <span className="hidden sm:inline">عرض متناسب</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel("a4-real")}
              className={`simulation-action-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                zoomLevel === "a4-real"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
              title="نمایش با ابعاد واقعی کاغذ A4 (۲۱۰ میلی‌متر)"
              id="btn-print-sim-a4"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">۲۱۰mm</span>
            </button>
          </div>

          {/* Margin Presets Control (Compact / Standard / Wide) */}
          <div 
            className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs shadow-inner"
            title="تنظیم حاشیه‌های صفحه (Margins) برای کنترل چیدمان و تطبیق با پرینترهای خاص"
            id="wrapper-print-margin-presets"
          >
            <div className="flex items-center gap-1 px-1.5 text-slate-400 font-medium">
              <Sliders className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden 2xl:inline text-[11px]">حاشیه:</span>
            </div>
            {MARGIN_OPTIONS.map((opt) => {
              const isSelected = marginPreset === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleMarginChange(opt.id)}
                  className={`simulation-action-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                  }`}
                  title={opt.tooltip}
                  id={`btn-print-margin-${opt.id}`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-[9.5px] px-1 py-0.2 rounded font-mono ${
                      isSelected
                        ? "bg-slate-950/20 text-slate-950 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Watermark Toggle in Simulation */}
          <div 
            className="hidden lg:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs shadow-inner"
            title="تنظیم نمایش یا مخفی‌سازی واترمارک جهانبان در خروجی چاپی"
            id="wrapper-print-watermark-toggle"
          >
            <button
              type="button"
              onClick={() => handleWatermarkChange(false)}
              className={`simulation-action-btn px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                !showWatermark
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              id="btn-sim-watermark-clean"
              title="مخفی‌سازی واترمارک برای ایجاد خروجی پاک و رسمی (Clean)"
            >
              رسمی (Clean)
            </button>
            <button
              type="button"
              onClick={() => handleWatermarkChange(true)}
              className={`simulation-action-btn px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                showWatermark
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              id="btn-sim-watermark-branded"
              title="نمایش واترمارک رسمی برند جهانبان در پس‌زمینه سند"
            >
              واترمارک
            </button>
          </div>
        </div>

        {/* Left side: Filename configuration and Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PDF Filename configuration input */}
          <div 
            className="hidden sm:flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/90 rounded-xl px-2.5 py-1 text-xs shadow-inner focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/40 transition"
            title="نام فایل خروجی PDF را به دلخواه ویرایش کنید"
            id="wrapper-pdf-filename-config"
          >
            <FileEdit className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <input
              id="input-pdf-filename"
              type="text"
              dir="ltr"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={defaultFilename}
              className="bg-slate-900 text-slate-100 placeholder-slate-500 text-xs px-2 py-0.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 font-mono w-36 sm:w-44 md:w-56 transition-all"
              title="نام فایل PDF خروجی"
            />
          </div>

          <button
            type="button"
            onClick={handlePrintNow}
            className="simulation-action-btn flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer shrink-0"
            id="btn-print-sim-download-pdf"
            title="چاپ مستقیم یا ذخیره به عنوان PDF در پنجره چاپ مرورگر با استایل‌های رسمی A4"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>چاپ به PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="simulation-action-btn flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0"
            title="خروج از حالت پیش‌نمایش (کلید Esc)"
            id="btn-print-sim-close"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </aside>

      {/* Visual Floating Margin Guide Tags (shows faint fold lines & page breaks for long documents) */}
      {showGuidelines && (
        <div 
          className="fixed left-2 top-20 bottom-8 z-[99999] pointer-events-none hidden lg:flex flex-col justify-start gap-1 no-print select-none opacity-90"
          aria-hidden="true"
        >
          <div className="bg-slate-900/95 text-slate-300 border border-slate-700/90 rounded-lg p-2.5 text-[10px] shadow-2xl backdrop-blur-md max-w-[170px]">
            <div className="flex items-center justify-between gap-1 text-amber-400 font-bold mb-1.5 pb-1 border-b border-slate-800">
              <div className="flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                <span>راهنمای چاپ A4</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {pageCount} صفحه
              </span>
            </div>
            <div className="space-y-1.5 text-[9px] text-slate-400">
              <div className="flex items-center justify-between text-slate-300">
                <span>صفحه فعلی:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {currentPage} از {pageCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>حاشیه:</span>
                <span className="font-mono text-emerald-300 font-bold">
                  {MARGIN_OPTIONS.find(m => m.id === marginPreset)?.badge || "۸mm"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>حفظ جداول:</span>
                <span className={`font-bold ${protectTablesAndCharts ? "text-emerald-400" : "text-slate-400"}`}>
                  {protectTablesAndCharts ? "فعال" : "غیرفعال"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                <span className="w-2.5 h-0.5 bg-indigo-400 inline-block rounded"></span>
                <span>مرز صفحه: ۲۹۷mm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-400 inline-block rounded"></span>
                <span>خط تا ۱: ۱۰۵mm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-400 inline-block rounded"></span>
                <span>خط تا ۲: ۲۱۰mm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrintSimulationBar;
