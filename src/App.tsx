import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Dashboard from "./components/Dashboard";
import Chancenkarte from "./components/Chancenkarte";
import CVBuilder from "./components/CVBuilder";
import PortalsAndRecognition from "./components/PortalsAndRecognition";
import SponsorJobs from "./components/SponsorJobs";
import NotificationCenter from "./components/NotificationCenter";
import InterviewPrep from "./components/InterviewPrep";
import EmbassyAlertsBanner from "./components/EmbassyAlertsBanner";
import MigrationGuide from "./components/MigrationGuide";
import AdvancedJobSearch from "./components/AdvancedJobSearch";
import PrintSimulationBar from "./components/PrintSimulationBar";
import MainNavigation from "./components/MainNavigation";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import VisaStrategySimulator from "./components/VisaStrategySimulator";
import Glossary from "./components/Glossary";
import SalaryCalculator from "./components/SalaryCalculator";
import { TabId } from "./components/MainNavigation";
import { Brain, Trophy, FileText, Globe, Landmark, Sparkles, Navigation, Briefcase, Sun, Moon, BookOpen, Search, SlidersHorizontal, Printer, Eye } from "lucide-react";
// @ts-ignore
import jahanbanLogo from "./assets/images/jahanban_logo_1782078229949.jpg";
// @ts-ignore
import germanyBanner from "./assets/images/germany_job_search_banner_1782771330220.jpg";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [profile, setProfile] = useState<{
    name: string;
    age: number;
    degree: string;
    experience: number;
    field: string;
    germanLevel: string;
    englishLevel: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem("germany_eval_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("germany_job_finder_dark_mode");
      if (saved !== null) {
        return saved === "true";
      }
      return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  const [isPrintSimulated, setIsPrintSimulated] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (isPrintSimulated) {
        document.body.classList.add("simulate-print-mode");
      } else {
        document.body.classList.remove("simulate-print-mode");
      }
    } catch (e) {
      console.error(e);
    }

    const handleGlobalPrintSimToggle = () => {
      setIsPrintSimulated(prev => !prev);
    };

    window.addEventListener("toggle-print-simulation", handleGlobalPrintSimToggle);

    return () => {
      document.body.classList.remove("simulate-print-mode");
      window.removeEventListener("toggle-print-simulation", handleGlobalPrintSimToggle);
    };
  }, [isPrintSimulated]);

  // Synchronize dark class and guarantee localStorage persistence across reloads
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.body.classList.add("dark");
        document.documentElement.classList.add("dark");
        localStorage.setItem("germany_job_finder_dark_mode", "true");
      } else {
        document.body.classList.remove("dark");
        document.documentElement.classList.remove("dark");
        localStorage.setItem("germany_job_finder_dark_mode", "false");
      }
    } catch (e) {
      console.error("Failed to persist dark mode state:", e);
    }
  }, [isDarkMode]);

  // Sync across tabs/windows if updated elsewhere
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "germany_job_finder_dark_mode" && e.newValue !== null) {
        setIsDarkMode(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem("germany_job_finder_dark_mode", String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleProfileUpdate = useCallback((newProfile: any) => {
    if (!newProfile || typeof newProfile !== "object") return;
    setProfile(prev => {
      if (prev && typeof prev === "object") {
        const keysA = Object.keys(prev);
        const keysB = Object.keys(newProfile);
        if (keysA.length === keysB.length && keysA.every(k => prev[k] === newProfile[k])) {
          return prev;
        }
        if (JSON.stringify(prev) === JSON.stringify(newProfile)) {
          return prev;
        }
      }
      try {
        localStorage.setItem("germany_eval_profile", JSON.stringify(newProfile));
      } catch (e) {
        console.error(e);
      }
      return newProfile;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-slate-900 transition-colors duration-200" dir="rtl">
      {/* Interactive Print Simulation Toolbar (Displayed when simulating @media print layout) */}
      <PrintSimulationBar 
        active={isPrintSimulated} 
        onClose={() => setIsPrintSimulated(false)} 
        activeTab={activeTab}
        candidateName={profile?.name}
      />

      {/* Top Brand Navbar Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800 px-4 py-2.5 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Right side: Logo + Brand Info (Horizontal & Compact) */}
          <div className="flex items-center gap-3">
            <img 
              src={jahanbanLogo} 
              alt="لوگوی گروه شرکت‌های جهانبان" 
              className="h-11 w-11 rounded-xl object-contain border border-amber-500/30 p-0.5 bg-white shadow-md transition hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-indigo-950 dark:text-white tracking-tight">جاب فایندر آلمان</h1>
                <span className="text-[10px] bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 dark:border-amber-500/40 font-bold shadow-sm">خانه خلاق جهانبان</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-200 font-bold leading-relaxed">
                متعلق به گروه شرکت‌های جهانبان (خانه خلاق جهانبان)
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                طراحی شده توسط: <span className="text-amber-700 dark:text-amber-300 font-black">ایلیا قبیتی</span> | سیستم هوشمند تطبیق ۲۰۲۶
              </p>
            </div>
          </div>

          {/* Left side: Mini-banner & German Flag details */}
          <div className="flex items-center gap-3">
            {/* Notification Center */}
            <NotificationCenter profile={profile} onTabChange={setActiveTab} />

            {/* Print Simulation Mode Toggle Button */}
            <button
              onClick={() => setIsPrintSimulated(prev => !prev)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0 ${
                isPrintSimulated
                  ? "bg-amber-500 text-slate-950 border-amber-400 font-black ring-2 ring-amber-400/50 shadow-amber-500/25"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800"
              }`}
              title={isPrintSimulated ? "خروج از شبیه‌ساز چاپ (Esc)" : "شبیه‌ساز چیدمان چاپ A4 (بررسی مارجین‌ها و خروجی چاپی قبل از پرینت)"}
              id="theme-print-sim-button"
            >
              <Printer className={`w-4 h-4 ${isPrintSimulated ? "text-slate-950 animate-pulse" : "text-indigo-600 dark:text-indigo-400"}`} />
              <span className="hidden sm:inline">
                {isPrintSimulated ? "خروج از پیش‌نمایش" : "پیش‌نمایش چاپ"}
              </span>
            </button>

            {/* Dark Mode Theme Toggle with Fluid Rotate-and-Fade Animation */}
            <button
              onClick={toggleDarkMode}
              className="relative w-10 h-10 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-amber-400/50 dark:hover:border-indigo-400/50 shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 overflow-hidden group select-none"
              title={isDarkMode ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
              aria-label={isDarkMode ? "تغییر به حالت روشن (حالت تاریک فعال است)" : "تغییر به حالت تاریک (حالت روشن فعال است)"}
              id="theme-toggle-button"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDarkMode ? (
                  <motion.div
                    key="theme-sun"
                    initial={{ rotate: -90, scale: 0.35, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.35, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      mass: 0.7
                    }}
                    className="flex items-center justify-center"
                  >
                    <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] transition-transform group-hover:rotate-12 duration-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="theme-moon"
                    initial={{ rotate: 90, scale: 0.35, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.35, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      mass: 0.7
                    }}
                    className="flex items-center justify-center"
                  >
                    <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.35)] transition-transform group-hover:-rotate-12 duration-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Elegant mini Germany Job Search banner */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-1.5 border border-slate-200/80 dark:border-slate-800 pr-3 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">CAREER GERMANY</p>
                <p className="text-[10px] text-slate-700 dark:text-slate-200 font-bold">پلتفرم تخصصی کاریابی آلمان</p>
              </div>
              <div className="w-14 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img 
                  src={germanyBanner} 
                  alt="کاریابی آلمان" 
                  className="w-full h-full object-cover filter brightness-95"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Quick German flagship accent line */}
            <div className="flex flex-col gap-0.5">
              <span className="w-6 h-1 bg-black rounded-sm shadow-sm" />
              <span className="w-6 h-1 bg-red-600 rounded-sm shadow-sm" />
              <span className="w-6 h-1 bg-amber-500 rounded-sm shadow-sm" />
            </div>
          </div>

        </div>
      </header>

      {/* Primary Container space */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 flex-grow">
        {/* German Embassy in Tehran & Labor Law Daily Live Alerts Banner */}
        <EmbassyAlertsBanner onTabChange={setActiveTab} />

        {/* Redesigned Responsive Main Navigation Menu (Grid / Strip with zero overflow) */}
        <MainNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Display of active tab with Fluid Framer Motion Transitions */}
        <div className="min-h-[500px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              {activeTab === "dashboard" && <Dashboard onProfileUpdate={handleProfileUpdate} onTabChange={setActiveTab} />}
              {activeTab === "visa-simulator" && <VisaStrategySimulator profile={profile} onNavigateToTab={setActiveTab} onUpdateProfile={handleProfileUpdate} />}
              {activeTab === "guide" && <MigrationGuide onNavigateToTab={setActiveTab} />}
              {activeTab === "advanced-jobs" && <AdvancedJobSearch profile={profile} onNavigateToTab={setActiveTab} />}
              {activeTab === "salary-calculator" && <SalaryCalculator profile={profile} onNavigateToTab={setActiveTab} />}
              {activeTab === "resume-analyzer" && <ResumeAnalyzer profile={profile} onProfileUpdate={handleProfileUpdate} onNavigateToTab={setActiveTab} />}
              {activeTab === "chancenkarte" && <Chancenkarte profile={profile} />}
              {activeTab === "cv" && <CVBuilder />}
              {activeTab === "portals" && <PortalsAndRecognition />}
              {activeTab === "jobs" && <SponsorJobs profile={profile} onProfileUpdate={handleProfileUpdate} onTabChange={setActiveTab} />}
              {activeTab === "interview" && <InterviewPrep profile={profile} />}
              {activeTab === "glossary" && <Glossary onNavigateToTab={setActiveTab} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky footer decoration */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/60 py-6 mt-16 text-center text-[10px] text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>کلیه به روزرسانی‌های این سامانه مطابق با مصوبات قانونی مهاجرت کاری سال ۲۰۲۶/۲۰۲۷ فدرال آلمان است.</p>
          <p className="font-mono text-[9px]">UTC: 2026-06-22 | Germany Employment Matcher</p>
        </div>
      </footer>
    </div>
  );
}
