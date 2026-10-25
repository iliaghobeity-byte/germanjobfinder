import React, { useState, useMemo, useEffect } from "react";
import { 
  ADVANCED_JOBS_DATA, 
  AdvancedJobItem, 
  JobIndustry, 
  ExperienceLevel, 
  WorkplaceType, 
  DegreeRequirement,
  EmploymentType,
  IranFriendlyEvaluation,
  evaluateIranFriendlyForJob,
  GERMAN_CITIES, 
  GERMAN_STATES,
  DEGREE_REQUIREMENTS,
  EMPLOYMENT_TYPES,
  LANGUAGE_REQUIREMENTS,
  INDUSTRY_CATEGORIES, 
  EXPERIENCE_LEVELS, 
  POPULAR_SKILLS 
} from "../data/advancedJobsData";
import { 
  Search, 
  Briefcase, 
  Building2, 
  MapPin, 
  Euro, 
  Globe, 
  Award, 
  SlidersHorizontal, 
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Mail, 
  Copy, 
  Check, 
  X, 
  Layers, 
  Cpu, 
  HeartPulse, 
  TrendingUp, 
  Truck, 
  Code2, 
  Building, 
  FlaskConical, 
  Clock, 
  ArrowUpDown, 
  ShieldCheck, 
  FileText, 
  Share2, 
  ChevronRight, 
  Zap, 
  Send,
  RefreshCw,
  AlertTriangle,
  Info,
  FileCheck2,
  GraduationCap,
  Languages
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdvancedJobSearchProps {
  profile?: any;
  onNavigateToTab?: (tab: string) => void;
}

export const AdvancedJobSearch: React.FC<AdvancedJobSearchProps> = ({ profile, onNavigateToTab }) => {
  // Filter States: All 5 Required Criteria
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<JobIndustry | "all">("all");
  
  // Requirement filters (الزامات: مدرک تحصیلی و سابقه کار)
  const [selectedDegree, setSelectedDegree] = useState<DegreeRequirement | "all">("all");
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | "all">("all");
  
  // Language requirement filter (زبان مورد نیاز: آلمانی، انگلیسی، دوزبانه)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  
  // Location filters (ایالت یا شهر)
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  // Job type filters (نوع شغل: تمام وقت، پاره وقت، دورکاری، ترکیبی)
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<EmploymentType | "all">("all");
  const [selectedWorkplace, setSelectedWorkplace] = useState<WorkplaceType | "all">("all");
  
  // Additional specialized filters
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearchInput, setSkillSearchInput] = useState<string>("");
  const [onlyVisaSponsorship, setOnlyVisaSponsorship] = useState<boolean>(false);
  const [onlyBlueCardCompliant, setOnlyBlueCardCompliant] = useState<boolean>(false);
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"relevance" | "salary_desc" | "date" | "exp_asc">("relevance");

  // Iran-Friendly & Gemini Semantic Cross-Reference States
  const [onlyIranFriendly, setOnlyIranFriendly] = useState<boolean>(false);
  const [prioritizeIranFriendly, setPrioritizeIranFriendly] = useState<boolean>(true);
  const [geminiEvaluations, setGeminiEvaluations] = useState<Record<string, IranFriendlyEvaluation>>({});
  const [isLoadingGeminiAudit, setIsLoadingGeminiAudit] = useState<boolean>(false);
  const [geminiAuditSource, setGeminiAuditSource] = useState<string | null>(null);
  const [lastAuditTimestamp, setLastAuditTimestamp] = useState<string>("");

  // Interactive modal states
  const [selectedJob, setSelectedJob] = useState<AdvancedJobItem | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("germany_saved_jobs_advanced");
      return saved ? JSON.parse(saved) : ["job-it-01", "job-eng-01"];
    } catch {
      return ["job-it-01"];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState<boolean>(false);

  // Sync initial industry filter with profile field if user has filled profile
  useEffect(() => {
    if (profile?.field) {
      const fieldLower = profile.field.toLowerCase();
      if (fieldLower.includes("نرم‌افزار") || fieldLower.includes("برنامه") || fieldLower.includes("it") || fieldLower.includes("کامپیوتر")) {
        setSelectedIndustry("it");
      } else if (fieldLower.includes("مکانیک") || fieldLower.includes("برق") || fieldLower.includes("صنایع") || fieldLower.includes("خودرو")) {
        setSelectedIndustry("engineering");
      } else if (fieldLower.includes("پزشک") || fieldLower.includes("پرستار") || fieldLower.includes("درمان")) {
        setSelectedIndustry("healthcare");
      }
    }
  }, [profile]);

  // Query Gemini API to cross-reference jobs with semantic knowledge base of Iranian diaspora hiring
  const runGeminiCrossReference = async () => {
    setIsLoadingGeminiAudit(true);
    try {
      const response = await fetch("/api/gemini/cross-reference-iran-friendly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobs: ADVANCED_JOBS_DATA.map(j => ({
            id: j.id,
            title: j.titleFa,
            company: j.company,
            industry: j.industry,
            locationCity: j.locationCity,
            workLanguage: j.workLanguage
          })),
          candidateProfile: profile || {
            field: "فناوری اطلاعات و نرم‌افزار",
            experience: 3,
            germanLevel: "B1",
            englishLevel: "B2"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.evaluations) {
          setGeminiEvaluations(data.evaluations);
          setGeminiAuditSource(data.source || "gemini_semantic_kb");
          setLastAuditTimestamp(new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch (err) {
      console.warn("Gemini cross-reference query failed, utilizing semantic local knowledge fallback:", err);
    } finally {
      setIsLoadingGeminiAudit(false);
    }
  };

  // Automatically trigger Gemini semantic audit once on mount
  useEffect(() => {
    runGeminiCrossReference();
  }, []);

  // Helper to obtain Iran-friendly evaluation with live Gemini data or fallback
  const getJobIranFriendly = (job: AdvancedJobItem): IranFriendlyEvaluation => {
    if (geminiEvaluations[job.id]) return geminiEvaluations[job.id];
    if (geminiEvaluations[job.company]) return geminiEvaluations[job.company];
    return job.iranFriendly || evaluateIranFriendlyForJob(job.company, job.titleFa);
  };

  // Toggle saved jobs
  const toggleSaveJob = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedJobIds(prev => {
      const next = prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId];
      try {
        localStorage.setItem("germany_saved_jobs_advanced", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Toggle skills filter
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = skillSearchInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setSkillSearchInput("");
    }
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("all");
    setSelectedDegree("all");
    setSelectedExperience("all");
    setSelectedLanguage("all");
    setSelectedState("all");
    setSelectedCity("all");
    setSelectedEmploymentType("all");
    setSelectedSkills([]);
    setSelectedWorkplace("all");
    setOnlyVisaSponsorship(false);
    setOnlyBlueCardCompliant(false);
    setMinSalaryFilter(0);
    setShowSavedOnly(false);
    setOnlyIranFriendly(false);
    setPrioritizeIranFriendly(true);
  };

  // Filter and sort engine with Iran-friendly logic and multi-criteria dimensions
  const filteredJobs = useMemo(() => {
    return ADVANCED_JOBS_DATA.filter(job => {
      // Saved filter
      if (showSavedOnly && !savedJobIds.includes(job.id)) {
        return false;
      }

      // Iran-friendly filter: only show companies compatible with Iranian candidates
      const iranEval = getJobIranFriendly(job);
      if (onlyIranFriendly && !iranEval.isFriendly) {
        return false;
      }

      // Industry filter
      if (selectedIndustry !== "all" && job.industry !== selectedIndustry) {
        return false;
      }

      // 1. Requirements: Degree (مدرک تحصیلی)
      if (selectedDegree !== "all" && job.degreeRequirement !== selectedDegree) {
        return false;
      }

      // 2. Requirements: Experience Level (سابقه کار)
      if (selectedExperience !== "all" && job.experienceLevel !== selectedExperience) {
        return false;
      }

      // 3. Language Requirement (زبان مورد نیاز: آلمانی، انگلیسی، دوزبانه)
      if (selectedLanguage !== "all") {
        if (selectedLanguage === "English" && job.workLanguage !== "English") return false;
        if (selectedLanguage === "German A1/A2" && job.workLanguage !== "German A1/A2") return false;
        if (selectedLanguage === "German B1+" && job.workLanguage !== "German B1+" && job.workLanguage !== "Bilingual") return false;
        if (selectedLanguage === "German B2+" && job.workLanguage !== "German B2+" && job.workLanguage !== "German C1") return false;
        if (selectedLanguage === "German C1" && job.workLanguage !== "German C1") return false;
        if (selectedLanguage === "Bilingual" && job.workLanguage !== "Bilingual") return false;
      }

      // 4. Location: Federal State (ایالت فدرال آلمان)
      if (selectedState !== "all" && job.stateDe !== selectedState) {
        return false;
      }

      // Location: City (شهر)
      if (selectedCity !== "all") {
        if (selectedCity === "remote") {
          if (job.workplaceType !== "remote") return false;
        } else if (job.locationCity !== selectedCity) {
          return false;
        }
      }

      // 5. Job Type: Employment Type (تمام وقت، پاره وقت، منعطف)
      if (selectedEmploymentType !== "all" && job.employmentType !== selectedEmploymentType) {
        return false;
      }

      // Workplace type (remote / hybrid / onsite)
      if (selectedWorkplace !== "all" && job.workplaceType !== selectedWorkplace) {
        return false;
      }

      // Visa sponsorship
      if (onlyVisaSponsorship && !job.visaSponsorship.supported) {
        return false;
      }

      // Blue card compliant
      if (onlyBlueCardCompliant && !job.visaSponsorship.blueCardCompliant) {
        return false;
      }

      // Minimum salary filter
      if (minSalaryFilter > 0 && job.salaryMaxEur < minSalaryFilter) {
        return false;
      }

      // Skills filter (must match at least one or all selected skills)
      if (selectedSkills.length > 0) {
        const hasMatchingSkill = selectedSkills.some(reqSkill => 
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(reqSkill.toLowerCase()))
        );
        if (!hasMatchingSkill) return false;
      }

      // Text search query filter (عنوان شغل، مهارت‌ها، شرکت)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = job.titleFa.toLowerCase().includes(q) || job.titleDe.toLowerCase().includes(q);
        const inCompany = job.company.toLowerCase().includes(q);
        const inDesc = job.descriptionFa.toLowerCase().includes(q);
        const inSkills = job.skills.some(s => s.toLowerCase().includes(q));
        const inCity = job.locationCity.toLowerCase().includes(q) || job.stateDe.toLowerCase().includes(q);
        return inTitle || inCompany || inDesc || inSkills || inCity;
      }

      return true;
    }).sort((a, b) => {
      const evalA = getJobIranFriendly(a);
      const evalB = getJobIranFriendly(b);

      // Prioritize Iran-friendly / Phase 1 High-Chance jobs at the top when prioritizeIranFriendly is active (or by default in relevance sort)
      if (prioritizeIranFriendly || sortBy === "relevance") {
        const isAHigh = evalA.isFriendly || evalA.tier === "phase1_high_chance";
        const isBHigh = evalB.isFriendly || evalB.tier === "phase1_high_chance";
        if (isAHigh && !isBHigh) return -1;
        if (!isAHigh && isBHigh) return 1;
      }

      if (sortBy === "salary_desc") {
        return b.salaryMaxEur - a.salaryMaxEur;
      }
      if (sortBy === "exp_asc") {
        return a.minYearsExperience - b.minYearsExperience;
      }
      if (sortBy === "date") {
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
      // Relevance (urgent first, then salary)
      if (a.isUrgentHiring && !b.isUrgentHiring) return -1;
      if (!a.isUrgentHiring && b.isUrgentHiring) return 1;
      return b.salaryMaxEur - a.salaryMaxEur;
    });
  }, [
    showSavedOnly,
    savedJobIds,
    onlyIranFriendly,
    prioritizeIranFriendly,
    geminiEvaluations,
    selectedIndustry,
    selectedDegree,
    selectedExperience,
    selectedLanguage,
    selectedState,
    selectedCity,
    selectedEmploymentType,
    selectedWorkplace,
    onlyVisaSponsorship,
    onlyBlueCardCompliant,
    minSalaryFilter,
    selectedSkills,
    searchQuery,
    sortBy
  ]);

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case "it": return <Code2 className="w-4 h-4" />;
      case "engineering": return <Cpu className="w-4 h-4" />;
      case "healthcare": return <HeartPulse className="w-4 h-4" />;
      case "finance_business": return <TrendingUp className="w-4 h-4" />;
      case "logistics": return <Truck className="w-4 h-4" />;
      case "construction": return <Building2 className="w-4 h-4" />;
      case "life_sciences": return <FlaskConical className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyCoverSnippet = (job: AdvancedJobItem) => {
    const snippet = `Sehr geehrte Damen und Herren,\n\nmit großem Interesse habe ich Ihre Stellenausschreibung für die Position als "${job.titleDe}" bei ${job.company} gesehen. Als Fachkraft mit Schwerpunkt auf ${job.skills.slice(0, 3).join(", ")} freue ich mich darauf, mein Fachwissen in Ihr Team einzubringen.\n\nMit freundlichen Grüßen,\n[Ihr Name]`;
    navigator.clipboard.writeText(snippet);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const activeFiltersCount = 
    (searchQuery.trim() ? 1 : 0) +
    (selectedIndustry !== "all" ? 1 : 0) +
    (selectedDegree !== "all" ? 1 : 0) +
    (selectedExperience !== "all" ? 1 : 0) +
    (selectedLanguage !== "all" ? 1 : 0) +
    (selectedState !== "all" ? 1 : 0) +
    (selectedCity !== "all" ? 1 : 0) +
    (selectedEmploymentType !== "all" ? 1 : 0) +
    (selectedWorkplace !== "all" ? 1 : 0) +
    (selectedSkills.length > 0 ? 1 : 0) +
    (onlyVisaSponsorship ? 1 : 0) +
    (onlyBlueCardCompliant ? 1 : 0) +
    (minSalaryFilter > 0 ? 1 : 0) +
    (onlyIranFriendly ? 1 : 0);

  return (
    <div className="space-y-8" id="advanced-job-search-container">
      {/* Intro Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>موتور جستجوی پیشرفته مشاغل آلمان (فیلتر چندمعیاره ۲۰۲۶)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              بانک اطلاعاتی و جستجوی چندمعیاره مشاغل آلمان
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              جستجو و فیلتر پیشرفته موقعیت‌های شغلی فعال بر اساس <strong>صنعت تخصصی</strong>، <strong>سطح تجربه (کارآموز تا سینیور)</strong>، <strong>مهارت‌های کلیدی (زبان برنامه‌نویسی، نرم‌افزار)</strong>، <strong>موقعیت جغرافیایی در ایالت‌های آلمان</strong> و میزان سازگاری با ویزای بلوکارت و اسپانسرشیپ.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0">
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("resume-analyzer")}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-indigo-900/30"
              >
                <FileCheck2 className="w-4 h-4 text-amber-300" />
                <span>تحلیل پارامتریک رزومه با شرکت‌ها</span>
              </button>
            )}

            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
                showSavedOnly
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showSavedOnly ? "text-amber-400 fill-amber-400" : "text-slate-400"}`} />
              <span>فرصت‌های نشان‌شده ({savedJobIds.length})</span>
            </button>

            <span className="text-[11px] bg-slate-950/80 px-3 py-1.5 rounded-lg text-slate-400 border border-slate-800">
              تعداد موقعیت‌ها: {filteredJobs.length} مورد منطبق
            </span>
          </div>
        </div>

        {/* Primary Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">
          <div className="md:col-span-9 relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی عنوان شغلی، نام شرکت آلمانی (زیمنس، پورشه، زالاندو...) یا کلمات کلیدی..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pr-10 pl-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner"
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

          <div className="md:col-span-3">
            <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="shrink-0 text-slate-500">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none w-full cursor-pointer"
              >
                <option value="relevance" className="bg-slate-900">بیشترین انطباق و فوریت</option>
                <option value="salary_desc" className="bg-slate-900">بیشترین حقوق سالانه</option>
                <option value="date" className="bg-slate-900">جدیدترین آگهی‌ها</option>
                <option value="exp_asc" className="bg-slate-900">کمترین سابقه مورد نیاز</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Iran-Friendly & Gemini Semantic Cross-Reference Intelligence Bar */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden" id="iran-friendly-intelligence-bar">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>هوش مصنوعی جمنای: تحلیل معنایی کارفرمایان سازگار با ایران (Iran-Friendly Semantic Cross-Reference)</span>
              </span>
              {isLoadingGeminiAudit ? (
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold flex items-center gap-1 animate-pulse border border-indigo-500/30">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                  <span>در حال تطبیق با دیتابیس هوشمند Gemini...</span>
                </span>
              ) : geminiAuditSource ? (
                <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-slate-300 text-[11px] font-mono border border-slate-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>منبع: {geminiAuditSource === "gemini_semantic_kb" ? "پایگاه داده زبانی جمنای (Gemini AI KB)" : "موتور تحلیلی قوانین هوشمند"}</span>
                </span>
              ) : null}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>فیلتر هوشمند کارفرمایان سازگار با متقاضیان ایرانی</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                استراتژی واقع‌بینانه اپلای از داخل ایران
              </span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              تطبیق کارفرمایان با دیتابیس شرکت‌هایی که تجربه اثبات‌شده در <strong>جذب نیروی ایرانی</strong>، <strong>مصاحبه کاملاً آنلاین</strong> و <strong>فرآیند سریع ویزای کاری (§81a Fast-Track)</strong> دارند. ابرشرکت‌های بزرگ که به دلیل فیلترهای خودکار ATS متقاضیان از راه دور را به سختی انتخاب می‌کنند، به فاز دوم تفکیک شده‌اند تا بیشترین احتمال دعوت به مصاحبه کاری حاصل شود.
            </p>
          </div>

          {/* Interactive Toggles & Audit Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Primary Toggle: Only Iran-friendly */}
            <button
              onClick={() => setOnlyIranFriendly(!onlyIranFriendly)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                onlyIranFriendly
                  ? "bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/40"
                  : "bg-slate-950/80 hover:bg-slate-800/90 border-slate-700 text-slate-300"
              }`}
            >
              <span className="text-sm">🇮🇷</span>
              <span>{onlyIranFriendly ? "فقط سازگار با ایران (فعال)" : "فیلتر کارفرمایان سازگار با ایران"}</span>
            </button>

            {/* Prioritize Toggle */}
            <button
              onClick={() => setPrioritizeIranFriendly(!prioritizeIranFriendly)}
              className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                prioritizeIranFriendly
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
              title="اولویت‌دهی در صدر نتایج به کارفرمایان با شانس بالای مصاحبه کاری از ایران"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>اولویت در نتایج: {prioritizeIranFriendly ? "فاز ۱ طلایی در صدر" : "عادی"}</span>
            </button>

            {/* Re-audit button with Gemini */}
            <button
              onClick={() => runGeminiCrossReference()}
              disabled={isLoadingGeminiAudit}
              className="px-3 py-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="استعلام مجدد و تطبیق معنایی با Gemini API"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoadingGeminiAudit ? "animate-spin" : ""}`} />
              <span>بروزرسانی با Gemini</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>کارفرمایان فاز ۱ (شانس بالای مصاحبه از ایران):</span>
              <strong className="font-mono text-xs">{ADVANCED_JOBS_DATA.filter(j => getJobIranFriendly(j).isFriendly).length} شرکت</strong>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300/90">
              <Building className="w-3 h-3 text-amber-400" />
              <span>ابرشرکت‌های فاز ۲ (گزینه مرحله دوم اپلای):</span>
              <strong className="font-mono text-xs">{ADVANCED_JOBS_DATA.filter(j => !getJobIranFriendly(j).isFriendly).length} شرکت</strong>
            </span>
          </div>
          {lastAuditTimestamp && (
            <span className="text-slate-500 font-mono">
              آخرین تطبیق معنایی با جمنای: ساعت {lastAuditTimestamp}
            </span>
          )}
        </div>
      </div>

      {/* Advanced Filter Hub Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl" id="filter-hub">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>فیلترهای پیشرفته چندمعیاره</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] border border-indigo-500/30">
                {activeFiltersCount} فیلتر فعال
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>پاک کردن کلیه فیلترها</span>
            </button>
          )}
        </div>

        {/* 1. Industry (صنعت) Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>۱. صنعت و حوزه تخصصی (Branche / Industry):</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {INDUSTRY_CATEGORIES.map(cat => {
              const isActive = selectedIndustry === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedIndustry(cat.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {getIndustryIcon(cat.id)}
                  <span className="truncate w-full text-[11px]">{cat.labelFa}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Requirements (الزامات: مدرک تحصیلی و سابقه کار) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
          {/* Degree Requirement Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>۲. الزامات تحصیلی (Abschluss / Degree):</span>
              </span>
              {selectedDegree !== "all" && (
                <button
                  onClick={() => setSelectedDegree("all")}
                  className="text-[10px] text-slate-500 hover:text-white"
                >
                  همه مقاطع
                </button>
              )}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {DEGREE_REQUIREMENTS.map(deg => {
                const isActive = selectedDegree === deg.id;
                return (
                  <button
                    key={deg.id}
                    onClick={() => setSelectedDegree(deg.id)}
                    className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition text-right cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-600/30 ring-1 ring-blue-400/40"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate w-full">{deg.labelFa}</span>
                    <span className="text-[9px] opacity-70 font-normal line-clamp-1 mt-0.5">{deg.descFa}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Level Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>۳. سابقه و تجربه کاری (Berufserfahrung):</span>
              </span>
              {selectedExperience !== "all" && (
                <button
                  onClick={() => setSelectedExperience("all")}
                  className="text-[10px] text-slate-500 hover:text-white"
                >
                  همه سوابق
                </button>
              )}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {EXPERIENCE_LEVELS.map(lvl => {
                const isActive = selectedExperience === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedExperience(lvl.id)}
                    className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition text-right cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-amber-500/25 border-amber-500/60 text-amber-200 shadow-sm ring-1 ring-amber-400/40"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate w-full">{lvl.labelFa}</span>
                    <span className="text-[9px] opacity-70 font-normal mt-0.5">{lvl.expYears}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Language Requirement (زبان مورد نیاز) & 4. Job Type (نوع شغل: تمام وقت، پاره وقت) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
          {/* Language Requirement Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-sky-400" />
                <span>۴. زبان مورد نیاز (Sprachkenntnisse):</span>
              </span>
              {selectedLanguage !== "all" && (
                <button
                  onClick={() => setSelectedLanguage("all")}
                  className="text-[10px] text-slate-500 hover:text-white"
                >
                  همه سطوح
                </button>
              )}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {LANGUAGE_REQUIREMENTS.map(lang => {
                const isActive = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition text-right cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-sky-600 border-sky-500 text-white shadow-sm ring-1 ring-sky-400/40"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate w-full">{lang.labelFa}</span>
                    <span className="text-[9px] opacity-70 font-mono mt-0.5" dir="ltr">{lang.labelDe}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Type & Workplace (نوع استخدام و شیوه کار) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>۵. نوع شغل و شیوه کار (Anstellungsart & Arbeitsort):</span>
              </span>
              {(selectedEmploymentType !== "all" || selectedWorkplace !== "all") && (
                <button
                  onClick={() => {
                    setSelectedEmploymentType("all");
                    setSelectedWorkplace("all");
                  }}
                  className="text-[10px] text-slate-500 hover:text-white"
                >
                  بازنشانی
                </button>
              )}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {EMPLOYMENT_TYPES.map(emp => {
                const isActive = selectedEmploymentType === emp.id;
                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmploymentType(emp.id)}
                    className={`px-2 py-2 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/40"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">{emp.labelFa}</div>
                    <div className="text-[9px] opacity-70 mt-0.5">{emp.labelDe}</div>
                  </button>
                );
              })}
            </div>

            {/* Workplace mode buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-bold ml-1">محل کار:</span>
              {(["all", "remote", "hybrid", "onsite"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedWorkplace(mode)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                    selectedWorkplace === mode
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-xs"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {mode === "all" ? "همه حالات" : mode === "remote" ? "دورکاری کامل (Remote)" : mode === "hybrid" ? "ترکیبی (Hybrid)" : "حضوری (On-site)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Geographic Location: Federal State & City (ایالت فدرال و شهر در آلمان) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          {/* Federal State (ایالت فدرال آلمان) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-purple-400" />
                <span>۶. ایالت فدرال آلمان (Bundesland):</span>
              </span>
              {selectedState !== "all" && (
                <button
                  onClick={() => setSelectedState("all")}
                  className="text-[10px] text-slate-500 hover:text-white"
                >
                  همه ایالت‌ها
                </button>
              )}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {GERMAN_STATES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nameFa}
                </option>
              ))}
            </select>
          </div>

          {/* City / Location (شهر مقصد) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>۷. شهر یا هوم‌آفیس (Stadt / Homeoffice):</span>
              </span>
              {selectedCity !== "all" && (
                <button
                  onClick={() => setSelectedCity("all")}
                  className="text-[10px] text-slate-500 hover:text-white"
                >
                  همه شهرها
                </button>
              )}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {GERMAN_CITIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nameFa} - {c.nameDe}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Specific Skills (مهارت‌های خاص: زبان برنامه‌نویسی، نرم‌افزار و غیره) */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>۴. مهارت‌های خاص و تکنولوژی‌ها (Specific Skills & Tech Stack):</span>
            </label>
            <span className="text-[11px] text-slate-500">
              با کلیک روی چیپ‌ها یا جستجوی مهارت دلخواه، نتایج را فیلتر کنید
            </span>
          </div>

          {/* Active Skills tags */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950 rounded-xl border border-indigo-500/30">
              <span className="text-xs text-indigo-400 font-bold px-2">فیلترهای انتخابی:</span>
              {selectedSkills.map(skill => (
                <span
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer hover:bg-rose-600"
                  title="کلیک برای حذف فیلتر"
                >
                  <span>{skill}</span>
                  <X className="w-3 h-3" />
                </span>
              ))}
              <button
                onClick={() => setSelectedSkills([])}
                className="text-[11px] text-slate-400 hover:text-white underline mr-2 cursor-pointer"
              >
                حذف همه مهارت‌ها
              </button>
            </div>
          )}

          {/* Popular Skill Chips */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {POPULAR_SKILLS.map(skill => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Custom Skill Input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={skillSearchInput}
              onChange={(e) => setSkillSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addCustomSkill(); }}
              placeholder="افزودن مهارت خاص دیگر (مثلاً: Golang, Kotlin, Flutter, SAP)..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-80"
            />
            <button
              onClick={addCustomSkill}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
            >
              افزودن
            </button>
          </div>
        </div>

        {/* 5. Iran-Friendly & Additional Legal / Visa Filters */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-emerald-300 hover:text-emerald-200 font-bold bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-500/30 shadow-sm transition">
              <input
                type="checkbox"
                checked={onlyIranFriendly}
                onChange={(e) => setOnlyIranFriendly(e.target.checked)}
                className="rounded border-emerald-700 text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-sm">🇮🇷</span>
              <span>فیلتر کارفرمایان سازگار با ایران (حذف شرکت‌های با موانع اداری ATS)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-indigo-300 hover:text-indigo-200 font-bold bg-indigo-950/40 px-3.5 py-2 rounded-xl border border-indigo-500/30 transition">
              <input
                type="checkbox"
                checked={prioritizeIranFriendly}
                onChange={(e) => setPrioritizeIranFriendly(e.target.checked)}
                className="rounded border-indigo-700 text-indigo-500 focus:ring-indigo-400"
              />
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>اولویت‌دهی در صدر نتایج به کارفرمایان فاز ۱ (شانس بالای مصاحبه از راه دور)</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={onlyVisaSponsorship}
                onChange={(e) => setOnlyVisaSponsorship(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>فقط موقعیت‌های دارای اسپانسری ویزای کار و انتقال رسمی</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={onlyBlueCardCompliant}
                onChange={(e) => setOnlyBlueCardCompliant(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <Award className="w-4 h-4 text-amber-400" />
              <span>مطابق با سقف حقوق بلوکارت اروپا ۲۰۲۶ (&ge; ۴۱,۰۴۰ یورو)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Header & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1">
        <div>
          <span>یافته‌ها: </span>
          <strong className="text-white font-mono text-sm">{filteredJobs.length}</strong>
          <span> موقعیت شغلی متناسب با معیارهای انتخابی شما</span>
        </div>
        {activeFiltersCount > 0 && (
          <span className="text-indigo-400">
            فیلتر شده بر اساس: {activeFiltersCount} معیار
          </span>
        )}
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredJobs.map((job) => {
          const isSaved = savedJobIds.includes(job.id);
          const iranEval = getJobIranFriendly(job);
          return (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-800 flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-600/20 shrink-0 border border-indigo-400/20">
                      {job.companyLogoText || job.company.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{job.company}</span>
                      </h4>
                      <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition mt-0.5 leading-snug">
                        {job.titleFa}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 line-clamp-1">
                        {job.titleDe}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {job.isUrgentHiring && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold animate-pulse">
                        استخدام فوری
                      </span>
                    )}

                    <button
                      onClick={(e) => toggleSaveJob(job.id, e)}
                      className="text-slate-400 hover:text-amber-400 p-1.5 rounded-lg transition"
                      title={isSaved ? "حذف از نشان‌شده‌ها" : "نشان کردن این شغل"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Iran-Friendly Intelligence Strip */}
                {iranEval.isFriendly ? (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-1.5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-black">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{iranEval.badgeLabelFa}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold">
                          شانس مصاحبه ریموت: {iranEval.yieldPercentFa}
                        </span>
                        <span className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                          {iranEval.visaSupportSpeed}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {iranEval.reasonFa}
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-1 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                        <span>{iranEval.badgeLabelFa}</span>
                      </div>
                      <span className="bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20 text-[10px] font-bold">
                        شانس مصاحبه مستقیم: {iranEval.yieldPercentFa}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {iranEval.reasonFa}
                    </p>
                  </div>
                )}

                {/* Key specs badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                    <Euro className="w-3 h-3" />
                    <span>{job.salaryFormatted}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{GERMAN_CITIES.find(c => c.id === job.locationCity)?.nameFa.split(" ")[0] || job.locationCity} · {job.stateDe}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center gap-1 font-bold">
                    <Award className="w-3 h-3" />
                    <span>{job.experienceLevelLabelFa}</span>
                  </span>

                  {/* Degree requirement badge */}
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-blue-400" />
                    <span>{job.degreeRequirement === "diploma_vocational" ? "کاردانی / دیپلم فنی" : job.degreeRequirement === "master" ? "کارشناسی ارشد / دکتری" : job.degreeRequirement === "no_degree" ? "مهارت‌محور (بدون نیاز به مدرک)" : "کارشناسی (Bachelor)"}</span>
                  </span>

                  {/* Employment type & workplace badge */}
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 font-bold">
                    <Briefcase className="w-3 h-3 text-emerald-400" />
                    <span>{job.employmentType === "part_time" ? "پاره وقت (Teilzeit)" : job.employmentType === "flexible" ? "منعطف" : "تمام وقت (Vollzeit)"} · {job.workplaceType === "remote" ? "دورکاری" : job.workplaceType === "hybrid" ? "ترکیبی" : "حضوری"}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>زبان: {job.workLanguage}</span>
                  </span>
                </div>

                {/* Short description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {job.descriptionFa}
                </p>

                {/* Skills chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.slice(0, 5).map((skill, sIdx) => {
                    const isFiltered = selectedSkills.includes(skill);
                    return (
                      <span
                        key={sIdx}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                          isFiltered
                            ? "bg-indigo-600 text-white font-bold"
                            : "bg-slate-950 border border-slate-800 text-slate-400"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                  {job.skills.length > 5 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{job.skills.length - 5} مهارت دیگر
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{job.visaSponsorship.typeLabelFa}</span>
                </div>

                <div className="flex items-center gap-1 text-indigo-400 group-hover:text-indigo-300 font-bold shrink-0">
                  <span>مشاهده جزئیات و اپلای</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <Briefcase className="w-12 h-12 text-indigo-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">هیچ موقعیت شغلی با این ترکیب فیلترها یافت نشد</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            لطفاً معیارهای فیلتر (مثلاً مهارت‌های خاص یا شهر انتخابی) را گسترش دهید یا فیلترها را ریست نمایید.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            پاک کردن کلیه فیلترها و مشاهده همه مشاغل
          </button>
        </div>
      )}

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
              id="job-detail-modal"
            >
              {/* Modal Top Header */}
              <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/70 shrink-0">
                <div className="space-y-1 pr-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                      {selectedJob.industryLabelFa}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {selectedJob.experienceLevelLabelFa}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold">
                      {selectedJob.degreeRequirement === "diploma_vocational" ? "کاردانی / دیپلم فنی" : selectedJob.degreeRequirement === "master" ? "کارشناسی ارشد / دکتری" : selectedJob.degreeRequirement === "no_degree" ? "مهارت‌محور" : "کارشناسی (Bachelor)"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      {selectedJob.employmentType === "part_time" ? "پاره وقت (Teilzeit)" : selectedJob.employmentType === "flexible" ? "منعطف" : "تمام وقت (Vollzeit)"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-bold">
                      زبان: {selectedJob.workLanguage}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {selectedJob.salaryFormatted}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight mt-1">
                    {selectedJob.titleFa}
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    {selectedJob.company} • {selectedJob.titleDe} • {selectedJob.stateDe}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleSaveJob(selectedJob.id)}
                    className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="نشان کردن این موقعیت"
                  >
                    {savedJobIds.includes(selectedJob.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="بستن"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-slate-200">
                {/* Visa & Relocation Package Highlight Banner */}
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>پکیج ویزا اسپانسرشیپ و حمایت از متقاضیان بین‌المللی:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedJob.visaSponsorship.typeLabelFa}
                      {selectedJob.visaSponsorship.relocationBonusEur && (
                        <span> | کمک‌هزینه اسکان و انتقال اولیه: <strong>{selectedJob.visaSponsorship.relocationBonusEur.toLocaleString()} یورو</strong></span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyEmail(selectedJob.contactEmail)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? "ایمیل کپی شد" : "کپی ایمیل کارشناس"}</span>
                    </button>
                  </div>
                </div>

                {/* Gemini AI Iran-Friendly Semantic Audit Section */}
                {(() => {
                  const modalIranEval = getJobIranFriendly(selectedJob);
                  return (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 space-y-3.5 shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-sm font-black text-white">
                            تحلیل معنایی هوش مصنوعی جمنای: انطباق با واقعیت اپلای و جذب متقاضیان ایرانی
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                            ضریب اطمینان معنایی: {modalIranEval.confidenceScore}٪
                          </span>
                          <span className="text-slate-400 font-mono">
                            {modalIranEval.tier === "phase1_high_chance" ? "فاز ۱: اولویت طلایی" : "فاز ۲: مرحله دوم اپلای"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-slate-400 text-[10px]">وضعیت جذب نیروی ایرانی:</span>
                          <div className="text-white font-bold flex items-center gap-1.5">
                            {modalIranEval.isFriendly ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span className="text-xs">{modalIranEval.badgeLabelFa}</span>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-slate-400 text-[10px]">تخمین بازدهی دعوت به مصاحبه آنلاین:</span>
                          <div className="text-emerald-300 font-bold font-mono text-xs">
                            {modalIranEval.yieldPercentFa}
                          </div>
                        </div>

                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-slate-400 text-[10px]">سرعت صدور ویزا و پیگیری اداری:</span>
                          <div className="text-indigo-300 font-bold text-xs">
                            {modalIranEval.visaSupportSpeed}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-300">
                        <strong className="text-slate-200">تحلیل وضعیت کارفرما: </strong>
                        <span>{modalIranEval.reasonFa}</span>
                      </div>

                      <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs space-y-1">
                        <strong className="text-indigo-300 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-indigo-400" />
                          <span>توصیه استراتژیک تخصصی کاریابی برای اقدام از داخل ایران:</span>
                        </strong>
                        <p className="text-slate-300 leading-relaxed pr-4">
                          {modalIranEval.strategicAdviceFa}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* About the role */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span>شرح موقعیت شغلی:</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedJob.descriptionFa}
                  </p>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>مسئولیت‌ها و وظایف کلیدی در سازمان:</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-300 pr-1">
                    {selectedJob.responsibilitiesFa.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>

                {/* Qualifications */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>صلاحیت‌ها و نیازمندی‌های حرفه‌ای:</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-300 pr-1">
                    {selectedJob.qualificationsFa.map((qual, idx) => (
                      <li key={idx}>{qual}</li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>مزایا، امکانات رفاهی و تسهیلات سازمانی:</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-300 pr-1">
                    {selectedJob.benefitsFa.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                {/* Skills tags in modal */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-400">مهارت‌های فنی و تخصصی مورد نیاز (Tech Stack):</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 text-xs font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* German Cover Letter Starter Snippet */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>متن آلمانی آماده برای انگیزش‌نامه (Anschreiben Snippet):</span>
                    </div>
                    <button
                      onClick={() => copyCoverSnippet(selectedJob)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {copiedCoverLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCoverLetter ? "کپی شد" : "کپی متن"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto text-left whitespace-pre-wrap">
                    {`Sehr geehrte Damen und Herren,\n\nmit großem Interesse habe ich Ihre Stellenausschreibung für die Position als "${selectedJob.titleDe}" bei ${selectedJob.company} gesehen. Als Fachkraft mit Schwerpunkt auf ${selectedJob.skills.slice(0, 3).join(", ")} freue ich mich darauf, mein Fachwissen in Ihr Team einzubringen.\n\nMit freundlichen Grüßen,\n[Ihr Name]`}
                  </pre>
                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>ارسال ایمیل مستقیم به:</span>
                  <a href={`mailto:${selectedJob.contactEmail}`} className="text-indigo-400 font-mono underline">
                    {selectedJob.contactEmail}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {selectedJob.portalLinks.stepStone && (
                    <a
                      href={selectedJob.portalLinks.stepStone}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
                    >
                      <span>پورتال StepStone</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {selectedJob.portalLinks.linkedIn && (
                    <a
                      href={selectedJob.portalLinks.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition border border-blue-500/30"
                    >
                      <span>پورتال LinkedIn</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <a
                    href={`mailto:${selectedJob.contactEmail}?subject=Bewerbung als ${encodeURIComponent(selectedJob.titleDe)} - [Ihr Name]`}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ارسال درخواست و رزومه (Apply)</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedJobSearch;
