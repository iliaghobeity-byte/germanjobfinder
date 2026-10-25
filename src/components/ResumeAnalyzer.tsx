import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Building2,
  Award,
  Globe,
  Briefcase,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Target,
  Clock,
  Printer,
  Copy,
  Check,
  Zap,
  Info,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  Scale,
  Users,
  Compass,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Wrench
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { TARGET_GERMAN_COMPANIES, TargetCompany } from "../data/targetCompaniesData";
import {
  calculateParametricResumeAnalysis,
  evaluateCompanyParametricFit,
  extractSkillsFromInput,
  DEFAULT_PARAMETRIC_WEIGHTS,
  PARAMETRIC_PRESETS,
  ParametricWeights,
  ParametricBreakdown,
  CompanyParametricMatchResult
} from "../utils/parametricResumeScorer";
import ResumeSkillsToolsGapModule from "./ResumeSkillsToolsGapModule";

interface ResumeAnalyzerProps {
  profile?: any;
  onProfileUpdate?: (profile: any) => void;
  onNavigateToTab?: (tab: string) => void;
  initialCompanyId?: string;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  profile,
  onProfileUpdate,
  onNavigateToTab,
  initialCompanyId
}) => {
  // Input method: 'upload' | 'paste' | 'profile_sync'
  const [inputMethod, setInputMethod] = useState<"upload" | "paste" | "profile_sync">("profile_sync");
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");

  // Candidate parametric parameters
  const [candidateName, setCandidateName] = useState<string>(() => profile?.name || "کاربر متقاضی کار در آلمان");
  const [targetRole, setTargetRole] = useState<string>(() => profile?.field || "مهندس نرم‌افزار و توسعه‌دهنده وب");
  const [experienceYears, setExperienceYears] = useState<number>(() => profile?.experience !== undefined ? Number(profile.experience) : 4);
  const [degree, setDegree] = useState<string>(() => profile?.degree || "bachelor");
  const [anabinStatus, setAnabinStatus] = useState<string>(() => profile?.anabinStatus || "H+");
  const [germanLevel, setGermanLevel] = useState<string>(() => profile?.germanLevel || "B1");
  const [englishLevel, setEnglishLevel] = useState<string>(() => profile?.englishLevel || "B2");
  const [candidateAge, setCandidateAge] = useState<number>(() => profile?.age !== undefined ? Number(profile.age) : 29);
  const [skillsInput, setSkillsInput] = useState<string>(() => profile?.skills || "TypeScript, React, Node.js, AWS, Docker, PostgreSQL, RESTful API, Git");
  const [resumeRawText, setResumeRawText] = useState<string>("");

  // Weights and Presets
  const [currentPresetId, setCurrentPresetId] = useState<string>("standard_bluecard");
  const [customWeights, setCustomWeights] = useState<ParametricWeights>(DEFAULT_PARAMETRIC_WEIGHTS);
  const [showWeightSliders, setShowWeightSliders] = useState<boolean>(false);

  // Target Company Selection & Filtering
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId || "zalando");
  const [companyTierFilter, setCompanyTierFilter] = useState<"all" | "phase1_high_chance" | "phase2_enterprise">("all");
  const [companySearchQuery, setCompanySearchQuery] = useState<string>("");
  const [activeViewMode, setActiveViewMode] = useState<"deep_dive" | "matrix_compare">("deep_dive");

  // Active Analyzer Module: 'skills_gap' (New German Skills & Tools Gap Analysis) vs 'parametric_companies'
  const [activeAnalyzerModule, setActiveAnalyzerModule] = useState<"skills_gap" | "parametric_companies">("skills_gap");
  const [showInputPanelInGapView, setShowInputPanelInGapView] = useState<boolean>(false);

  // UI state
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isAiAuditing, setIsAiAuditing] = useState<boolean>(false);
  const [aiAuditReport, setAiAuditReport] = useState<string | null>(null);

  // Sync with props profile when provided
  useEffect(() => {
    if (profile) {
      if (profile.name) setCandidateName(profile.name);
      if (profile.field) setTargetRole(profile.field);
      if (profile.experience !== undefined) setExperienceYears(Number(profile.experience));
      if (profile.degree) setDegree(profile.degree);
      if (profile.anabinStatus) setAnabinStatus(profile.anabinStatus);
      if (profile.germanLevel) setGermanLevel(profile.germanLevel);
      if (profile.englishLevel) setEnglishLevel(profile.englishLevel);
      if (profile.age !== undefined) setCandidateAge(Number(profile.age));
      if (profile.skills) setSkillsInput(profile.skills);
    }
  }, [profile]);

  // Load from CV Builder or localStorage if available
  const handleSyncFromCvBuilder = () => {
    try {
      const savedCv = localStorage.getItem("jahanban_german_cv_data");
      const savedProfile = localStorage.getItem("germany_eval_profile");
      if (savedCv) {
        const cv = JSON.parse(savedCv);
        if (cv.personalInfo?.fullName) setCandidateName(cv.personalInfo.fullName);
        if (cv.personalInfo?.jobTitle) setTargetRole(cv.personalInfo.jobTitle);
        if (cv.skills) {
          const skList = Array.isArray(cv.skills) ? cv.skills.map((s: any) => s.name || s).join(", ") : String(cv.skills);
          setSkillsInput(skList);
        }
        if (cv.workExperiences && Array.isArray(cv.workExperiences)) {
          setExperienceYears(Math.max(cv.workExperiences.length * 1.5, 3));
        }
      } else if (savedProfile) {
        const pf = JSON.parse(savedProfile);
        if (pf.name) setCandidateName(pf.name);
        if (pf.field) setTargetRole(pf.field);
        if (pf.experience) setExperienceYears(Number(pf.experience));
        if (pf.degree) setDegree(pf.degree);
        if (pf.anabinStatus) setAnabinStatus(pf.anabinStatus);
        if (pf.germanLevel) setGermanLevel(pf.germanLevel);
        if (pf.englishLevel) setEnglishLevel(pf.englishLevel);
        if (pf.skills) setSkillsInput(pf.skills);
      }
      setInputMethod("profile_sync");
    } catch (e) {
      console.error(e);
    }
  };

  // Sample pre-fills for demonstration
  const handleLoadSampleResume = (type: "software" | "automotive") => {
    if (type === "software") {
      setCandidateName("علیرضا کریمی");
      setTargetRole("توسعه‌دهنده ارشد نرم‌افزار (Full-Stack Engineer)");
      setExperienceYears(5);
      setDegree("master");
      setAnabinStatus("H+");
      setGermanLevel("B1");
      setEnglishLevel("C1");
      setCandidateAge(30);
      setSkillsInput("TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, Redis, RESTful API, CI/CD, Agile, Git");
      setResumeRawText(`CURRICULUM VITAE
Alireza Karimi - Senior Full-Stack Engineer
Email: alireza.karimi@example.com | Location: Tehran / Ready for Relocation to Germany

PROFESSIONAL EXPERIENCE:
• Senior Software Engineer | Digikala (2022 - Present)
  - Designed and maintained scalable microservices using Node.js, TypeScript, and Docker handling 4M+ daily visits.
  - Spearheaded migration of legacy services to AWS Kubernetes clusters, reducing deployment downtime by 40%.
  - Mentored 4 mid-level engineers in code review best practices and automated testing.
• Full-Stack Developer | Snapp (2020 - 2022)
  - Developed responsive client dashboard in React & TypeScript.
  - Optimized database query execution times in PostgreSQL by 30%.

EDUCATION:
• Master of Science in Computer Engineering | University of Tehran (Anabin H+ Certified, 2018 - 2020)
• Bachelor of Science in Software Engineering | Amirkabir University of Technology (Anabin H+, 2014 - 2018)

LANGUAGES & CERTIFICATIONS:
• English: C1 Fluent | German: B1 Goethe-Zertifikat
• AWS Certified Solutions Architect Associate (2024)`);
    } else {
      setCandidateName("مهندس سارا محمدی");
      setTargetRole("مهندس سیستم‌های نهفته و اتوماسیون (Embedded Systems Engineer)");
      setExperienceYears(4);
      setDegree("master");
      setAnabinStatus("H+");
      setGermanLevel("B2");
      setEnglishLevel("B2");
      setCandidateAge(28);
      setSkillsInput("Embedded C, C++, AUTOSAR, MATLAB, Simulink, CAN, LIN, Linux, ISO 26262, Microcontrollers, Python");
      setResumeRawText(`LEBENSLAUF
Sara Mohammadi - Embedded Systems Engineer (Automotive)
Tehran, Iran | Visa Ready for Germany

BERUFSERFAHRUNG:
• Embedded Software Engineer | Crouse Automotive Electronics (2022 - Present)
  - Programmed automotive ECUs using Embedded C and C++ adhering to AUTOSAR standards.
  - Implemented CAN and LIN communication protocols for Body Control Modules (BCM).
  - Executed Hardware-in-the-Loop (HIL) testing and resolved real-time timing bottlenecks.
• Junior Mechatronics Engineer (2020 - 2022)
  - Modeled motor control algorithms using MATLAB and Simulink.

AUSBILDUNG:
• M.Sc. in Electrical & Embedded Engineering | Sharif University of Technology (H+ in Anabin)
• B.Sc. in Mechatronics Engineering | K. N. Toosi University of Technology (H+)

SPRACHEN:
• Deutsch: B2 (telc Deutsch B2) | Englisch: B2 (IELTS 7.0)`);
    }
  };

  // Preset weight change handler
  const handleSelectPreset = (presetId: string) => {
    setCurrentPresetId(presetId);
    const found = PARAMETRIC_PRESETS.find(p => p.id === presetId);
    if (found) {
      setCustomWeights(found.weights);
    }
  };

  // Extracted skills
  const parsedSkills = useMemo(() => {
    return extractSkillsFromInput(skillsInput, resumeRawText);
  }, [skillsInput, resumeRawText]);

  // Selected company object
  const selectedCompany = useMemo(() => {
    return TARGET_GERMAN_COMPANIES.find(c => c.id === selectedCompanyId) || TARGET_GERMAN_COMPANIES[0];
  }, [selectedCompanyId]);

  // General Parametric Breakdown calculation
  const parametricBreakdown: ParametricBreakdown = useMemo(() => {
    return calculateParametricResumeAnalysis(
      {
        skills: parsedSkills,
        experienceYears,
        degree,
        anabinStatus,
        germanLevel,
        englishLevel,
        age: candidateAge,
        field: targetRole,
        resumeText: resumeRawText
      },
      customWeights,
      selectedCompany
    );
  }, [parsedSkills, experienceYears, degree, anabinStatus, germanLevel, englishLevel, candidateAge, targetRole, resumeRawText, customWeights, selectedCompany]);

  // Fit calculation for the selected company
  const companyFit: CompanyParametricMatchResult = useMemo(() => {
    return evaluateCompanyParametricFit(
      {
        skills: parsedSkills,
        experienceYears,
        degree,
        anabinStatus,
        germanLevel,
        englishLevel,
        age: candidateAge,
        field: targetRole,
        resumeText: resumeRawText
      },
      selectedCompany,
      customWeights
    );
  }, [parsedSkills, experienceYears, degree, anabinStatus, germanLevel, englishLevel, candidateAge, targetRole, resumeRawText, selectedCompany, customWeights]);

  // All companies fits for matrix comparison
  const allCompaniesFits = useMemo(() => {
    return TARGET_GERMAN_COMPANIES.map(comp => 
      evaluateCompanyParametricFit(
        {
          skills: parsedSkills,
          experienceYears,
          degree,
          anabinStatus,
          germanLevel,
          englishLevel,
          age: candidateAge,
          field: targetRole,
          resumeText: resumeRawText
        },
        comp,
        customWeights
      )
    );
  }, [parsedSkills, experienceYears, degree, anabinStatus, germanLevel, englishLevel, candidateAge, targetRole, resumeRawText, customWeights]);

  // Filtered companies based on tier & search
  const filteredCompanies = useMemo(() => {
    return TARGET_GERMAN_COMPANIES.filter(comp => {
      const matchTier = companyTierFilter === "all" || comp.tierCategory === companyTierFilter;
      const matchSearch = !companySearchQuery.trim() || 
        comp.name.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
        comp.legalName.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
        comp.industry.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
        comp.city.toLowerCase().includes(companySearchQuery.toLowerCase());
      return matchTier && matchSearch;
    });
  }, [companyTierFilter, companySearchQuery]);

  // File drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    setFileError("");
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFileError("حجم فایل نباید بیش از ۵ مگابایت باشد.");
      return;
    }
    setUploadedFile(file);
    // Simulating quick parsing feedback
    const simulatedSkills = `${skillsInput}, Microservices, Docker, Git`;
    setSkillsInput(simulatedSkills);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFileError("حجم فایل نباید بیش از ۵ مگابایت باشد.");
      return;
    }
    setUploadedFile(file);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Run AI deep audit simulation
  const handleTriggerAiAudit = () => {
    setIsAiAuditing(true);
    setTimeout(() => {
      setIsAiAuditing(false);
      setAiAuditReport(
        `گزارش ممیزی تکمیلی تطابق رزومه با استاندارد فدرال آلمان:
• سابقه کار و رتبه ارشدیت شما کاملاً با میانگین شاغلان غیراروپایی در ${selectedCompany.name} هماهنگ است.
• بر اساس آمار ۱۰ سال اخیر، کارفرمایانی نظیر ${selectedCompany.name} در صورت دارا بودن تطابق بالای ۷۵٪ در مهارت‌های اصلی، نرخ تبدیل مصاحبه بیش از ${selectedCompany.remoteInterviewYieldPercent}٪ دارند.
• پیشنهاد کلیدی: بخش خلاصه حرفه‌ای (Professional Summary) را به ۳ دستاورد عددی مجهز کنید تا امتیاز ATS سیستم غربالگری اولیه به حداکثر برسد.`
      );
    }, 1200);
  };

  const renderResumeInputCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>ورود و استخراج اطلاعات رزومه</span>
        </h3>
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          گام ۱: دریافت رزومه
        </span>
      </div>

      {/* Method Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setInputMethod("profile_sync")}
          className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
            inputMethod === "profile_sync"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          پروفایل متقاضی
        </button>
        <button
          onClick={() => setInputMethod("upload")}
          className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
            inputMethod === "upload"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          بارگذاری فایل PDF
        </button>
        <button
          onClick={() => setInputMethod("paste")}
          className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
            inputMethod === "paste"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          متن خام رزومه
        </button>
      </div>

      {/* Quick Demo Pre-fill Buttons */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-slate-400 text-[11px] self-center">نمونه آزمایشی:</span>
        <button
          onClick={() => handleLoadSampleResume("software")}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          مهندس نرم‌افزار (Full-Stack)
        </button>
        <button
          onClick={() => handleLoadSampleResume("automotive")}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 hover:text-amber-600 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          مهندس نهفته خودرویی (AUTOSAR)
        </button>
      </div>

      {/* Upload Area */}
      {inputMethod === "upload" && (
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
            dragActive
              ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
              : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/40"
          }`}
        >
          <input
            type="file"
            id="resume-file-input"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileInputChange}
          />
          <label htmlFor="resume-file-input" className="cursor-pointer block space-y-2">
            <UploadCloud className="w-9 h-9 text-indigo-500 mx-auto" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {uploadedFile ? uploadedFile.name : "فایل رزومه (PDF یا DOCX) را بکشید و رها کنید"}
            </p>
            <p className="text-[11px] text-slate-500">حداکثر حجم ۵ مگابایت با رعایت حریم خصوصی</p>
          </label>
          {fileError && <p className="text-xs text-rose-500 mt-2 font-bold">{fileError}</p>}
          {uploadedFile && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>فایل با موفقیت متصل شد ({Math.round(uploadedFile.size / 1024)} KB)</span>
            </div>
          )}
        </div>
      )}

      {/* Paste Raw Text Area */}
      {inputMethod === "paste" && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            متن کامل یا گزیده تجارب و مهارت‌های رزومه به انگلیسی یا فارسی:
          </label>
          <textarea
            value={resumeRawText}
            onChange={e => setResumeRawText(e.target.value)}
            placeholder="محتوای متنی رزومه خود را اینجا قرار دهید..."
            rows={6}
            className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed resize-y"
            dir="ltr"
          />
        </div>
      )}

      {/* Candidate Parametric Controls */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">نام متقاضی:</label>
            <input
              type="text"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان شغل هدف:</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سابقه کاری (سال):</label>
            <input
              type="number"
              min={0}
              max={30}
              value={experienceYears}
              onChange={e => setExperienceYears(Math.max(0, Number(e.target.value)))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">مدرک تحصیلی:</label>
            <select
              value={degree}
              onChange={e => setDegree(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="bachelor">کارشناسی (Bachelor)</option>
              <option value="master">کارشناسی ارشد (Master)</option>
              <option value="phd">دکتری تخصصی (PhD)</option>
              <option value="associate">کاردانی / فنی‌حرفه‌ای</option>
              <option value="experience_only">فاقد مدرک دانشگاهی (IT Exemption)</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">اعتبار آنابین:</label>
            <select
              value={anabinStatus}
              onChange={e => setAnabinStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="H+">H+ (مورد تایید قطعی)</option>
              <option value="H+/-">H+/- (مشروط / نیازمند ZAB)</option>
              <option value="H-">H- (غیرمعتبر)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سطح زبان آلمانی:</label>
            <select
              value={germanLevel}
              onChange={e => setGermanLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="None">آشنایی ندارم</option>
              <option value="A1">A1 (مقدماتی)</option>
              <option value="A2">A2 (پایه)</option>
              <option value="B1">B1 (متوسط - استاندارد ویزا)</option>
              <option value="B2">B2 (پیشرفته شغلی)</option>
              <option value="C1">C1 (مسلط و تخصصی)</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سطح زبان انگلیسی:</label>
            <select
              value={englishLevel}
              onChange={e => setEnglishLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="B1">B1 (مکالمه عمومی)</option>
              <option value="B2">B2 (مکالمه کاری روان)</option>
              <option value="C1">C1 (پیشرفته و بی‌نقص)</option>
              <option value="C2">C2 (بومی / Native)</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سن متقاضی:</label>
            <input
              type="number"
              min={18}
              max={65}
              value={candidateAge}
              onChange={e => setCandidateAge(Math.max(18, Number(e.target.value)))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            مهارت‌های کلیدی و تِک‌استک (جداشده با کاما):
          </label>
          <textarea
            rows={2}
            value={skillsInput}
            onChange={e => setSkillsInput(e.target.value)}
            placeholder="مثال: TypeScript, React, Python, Docker, AWS, PostgreSQL, Git"
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {parsedSkills.slice(0, 8).map((sk, idx) => (
              <span key={idx} className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                {sk}
              </span>
            ))}
            {parsedSkills.length > 8 && (
              <span className="text-[10px] text-slate-500 self-center">+{parsedSkills.length - 8} مهارت دیگر</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderParametricWeightsCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-slate-900 dark:text-white text-base">
            تنظیم اوزان پارامتریک و سناریوی قانونی
          </h3>
        </div>
        <button
          onClick={() => setShowWeightSliders(!showWeightSliders)}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>{showWeightSliders ? "بستن اوزان" : "شخصی‌سازی اوزان"}</span>
          {showWeightSliders ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Presets Selector */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500">پریست‌های وزنی بر اساس مسیر مهاجرتی مدنظر شما:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PARAMETRIC_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 rounded-2xl border text-right transition cursor-pointer text-xs space-y-1 ${
                currentPresetId === preset.id
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200 font-black ring-1 ring-amber-500/30"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-amber-400/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{preset.nameFa}</span>
                {currentPresetId === preset.id && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {preset.descriptionFa}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Sliders */}
      <AnimatePresence>
        {showWeightSliders && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs overflow-hidden"
          >
            <p className="text-[11px] text-slate-500">
              مجموع اوزان جاری: {customWeights.techSkills + customWeights.experience + customWeights.academicAnabin + customWeights.language + customWeights.nonEuVisa + customWeights.cvCompliance}٪
            </p>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>تِک‌استک و مهارت‌های فنی:</span>
                <span className="text-indigo-600 font-black">{customWeights.techSkills}٪</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={customWeights.techSkills}
                onChange={e => setCustomWeights(prev => ({ ...prev, techSkills: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>سابقه کاری و سنوات مستند:</span>
                <span className="text-indigo-600 font-black">{customWeights.experience}٪</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={customWeights.experience}
                onChange={e => setCustomWeights(prev => ({ ...prev, experience: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>مدرک دانشگاهی و اعتبار آنابین:</span>
                <span className="text-indigo-600 font-black">{customWeights.academicAnabin}٪</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={customWeights.academicAnabin}
                onChange={e => setCustomWeights(prev => ({ ...prev, academicAnabin: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>شاخص آمادگی زبانی:</span>
                <span className="text-indigo-600 font-black">{customWeights.language}٪</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={customWeights.language}
                onChange={e => setCustomWeights(prev => ({ ...prev, language: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>الزامات ویزای غیراروپایی ۲۰۲۶:</span>
                <span className="text-indigo-600 font-black">{customWeights.nonEuVisa}٪</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={customWeights.nonEuVisa}
                onChange={e => setCustomWeights(prev => ({ ...prev, nonEuVisa: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>رعایت ساختار رزومه Lebenslauf:</span>
                <span className="text-indigo-600 font-black">{customWeights.cvCompliance}٪</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={customWeights.cvCompliance}
                onChange={e => setCustomWeights(prev => ({ ...prev, cvCompliance: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-indigo-900/40 shadow-xl">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>تحلیلگر پارامتریک رزومه و فرهنگ استخدام غیراروپایی (Resume Analyzer)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              سنجش ریاضی درصد تطابق رزومه با نیازمندی‌های شغلی و کارفرماهای آلمان
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              رزومه خود را وارد کنید تا بر اساس ۶ بعد پارامتریک رسمی (تِک‌استک، سابقه، اعتبار آنابین، زبان، قوانین ویزای ۲۰۲۶ و استاندارد Lebenslauf) با نیازمندی‌های استخدامی آلمان و سوابق ۱۰ ساله جذب نیروهای غیراروپایی شرکت‌های منتخب مقایسه شود.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              title="خروجی چاپی کارنامه پارامتریک"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>چاپ کارنامه ارزیابی (A4)</span>
            </button>
            <button
              onClick={handleSyncFromCvBuilder}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-900/40"
            >
              <RefreshCw className="w-4 h-4" />
              <span>بارگذاری از رزومه‌ساز / پروفایل</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px]">مدل ارزیابی</p>
              <p className="font-bold text-slate-200">۶ بعد پارامتریک با اوزان پویا</p>
            </div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px]">داده‌های تاریخی</p>
              <p className="font-bold text-slate-200">سوابق ۱۰ ساله جذب غیراروپایی</p>
            </div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px]">پوشش شرکت‌ها</p>
              <p className="font-bold text-slate-200">فاز ۱ چابک + مگا شرکت‌های DAX</p>
            </div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px]">انطباق قوانین</p>
              <p className="font-bold text-slate-200">بلوکارت ۲۰۲۶ و تسریع بند 81a</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Navigation Switcher Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row gap-2">
        <button
          onClick={() => setActiveAnalyzerModule("skills_gap")}
          className={`flex-1 p-3.5 rounded-xl text-right transition cursor-pointer flex items-center justify-between gap-3 ${
            activeAnalyzerModule === "skills_gap"
              ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-900/40 ring-1 ring-white/20"
              : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${activeAnalyzerModule === "skills_gap" ? "bg-white/10" : "bg-slate-700/60"}`}>
              <Wrench className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm">تحلیل شکاف مهارت‌ها و ابزارها (Skills & Tools Gap Analysis)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  ماژول جدید • KldB 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-300/80 mt-0.5">
                مقایسه هوشمند تخصص‌های فنی و نرم‌افزارهای رزومه با استانداردهای کاریابی آلمان، نرم‌افزارهای الزامی و استانداردهای صنعتی
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${activeAnalyzerModule === "skills_gap" ? "bg-white/20" : "bg-slate-700 text-slate-400"}`}>
            {parsedSkills.length} مهارت استخراج‌شده
          </span>
        </button>

        <button
          onClick={() => setActiveAnalyzerModule("parametric_companies")}
          className={`flex-1 p-3.5 rounded-xl text-right transition cursor-pointer flex items-center justify-between gap-3 ${
            activeAnalyzerModule === "parametric_companies"
              ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-900/40 ring-1 ring-white/20"
              : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${activeAnalyzerModule === "parametric_companies" ? "bg-white/10" : "bg-slate-700/60"}`}>
              <Building2 className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm">تطابق پارامتریک با شرکت‌های آلمان (Company Match & Fit)</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold">
                  رادار ۶ بعدی
                </span>
              </div>
              <p className="text-[11px] text-slate-300/80 mt-0.5">
                ارزیابی ریاضی شانس ویزا، سرعت اسپانسرشیپ و سوابق ۱۰ ساله جذب نیروی غیراروپایی در شرکت‌های شاخص
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${activeAnalyzerModule === "parametric_companies" ? "bg-white/20" : "bg-slate-700 text-slate-400"}`}>
            {TARGET_GERMAN_COMPANIES.length} شرکت هدف
          </span>
        </button>
      </div>

      {activeAnalyzerModule === "skills_gap" ? (
        <div className="space-y-6">
          {/* Quick Context & Resume Management Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    رزومه متقاضی: {candidateName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    {experienceYears} سال سابقه
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                    زبان آلمانی: {germanLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  عنوان شغل هدف: <strong className="text-slate-800 dark:text-slate-200">{targetRole}</strong> • {parsedSkills.length} مهارت و ابزار فنی استخراج‌شده
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowInputPanelInGapView(prev => !prev)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                <span>{showInputPanelInGapView ? "بستن پنل ویرایش رزومه" : "ویرایش یا آپلود رزومه"}</span>
                {showInputPanelInGapView ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleLoadSampleResume("software")}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold transition cursor-pointer border border-indigo-200/50 dark:border-indigo-800/50"
              >
                نمونه نرم‌افزار
              </button>

              <button
                onClick={() => handleLoadSampleResume("automotive")}
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold transition cursor-pointer border border-amber-200/50 dark:border-amber-800/50"
              >
                نمونه سیستم‌های نهفته
              </button>
            </div>
          </div>

          {/* Expandable Inputs Form Drawer */}
          <AnimatePresence>
            {showInputPanelInGapView && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="p-1 rounded-3xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 mb-6">
                  {renderResumeInputCard()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dedicated German Skills & Tools Gap Analysis Module */}
          <ResumeSkillsToolsGapModule
            candidateName={candidateName}
            targetRole={targetRole}
            skillsList={parsedSkills}
            rawResumeText={resumeRawText}
            experienceYears={experienceYears}
            germanLevel={germanLevel}
            degree={degree}
            anabinStatus={anabinStatus}
            onNavigateToTab={onNavigateToTab}
          />
        </div>
      ) : (
        /* Original Parametric Company Fit View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT COLUMN (Inputs & Settings, 5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Resume Input Methods */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>ورود و استخراج اطلاعات رزومه</span>
              </h3>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                گام ۱: دریافت رزومه
              </span>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setInputMethod("profile_sync")}
                className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
                  inputMethod === "profile_sync"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                پروفایل متقاضی
              </button>
              <button
                onClick={() => setInputMethod("upload")}
                className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
                  inputMethod === "upload"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                بارگذاری فایل PDF
              </button>
              <button
                onClick={() => setInputMethod("paste")}
                className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
                  inputMethod === "paste"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                متن خام رزومه
              </button>
            </div>

            {/* Quick Demo Pre-fill Buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 text-[11px] self-center">نمونه آزمایشی:</span>
              <button
                onClick={() => handleLoadSampleResume("software")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                مهندس نرم‌افزار (Full-Stack)
              </button>
              <button
                onClick={() => handleLoadSampleResume("automotive")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 hover:text-amber-600 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                مهندس نهفته خودرویی (AUTOSAR)
              </button>
            </div>

            {/* Upload Area */}
            {inputMethod === "upload" && (
              <div
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileInputChange}
                />
                <label htmlFor="resume-file-input" className="cursor-pointer block space-y-2">
                  <UploadCloud className="w-9 h-9 text-indigo-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {uploadedFile ? uploadedFile.name : "فایل رزومه (PDF یا DOCX) را بکشید و رها کنید"}
                  </p>
                  <p className="text-[11px] text-slate-500">حداکثر حجم ۵ مگابایت با رعایت حریم خصوصی</p>
                </label>
                {fileError && <p className="text-xs text-rose-500 mt-2 font-bold">{fileError}</p>}
                {uploadedFile && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>فایل با موفقیت متصل شد ({Math.round(uploadedFile.size / 1024)} KB)</span>
                  </div>
                )}
              </div>
            )}

            {/* Paste Raw Text Area */}
            {inputMethod === "paste" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  متن کامل یا گزیده تجارب و مهارت‌های رزومه به انگلیسی یا فارسی:
                </label>
                <textarea
                  value={resumeRawText}
                  onChange={e => setResumeRawText(e.target.value)}
                  placeholder="محتوای متنی رزومه خود را اینجا قرار دهید..."
                  rows={6}
                  className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed resize-y"
                  dir="ltr"
                />
              </div>
            )}

            {/* Candidate Parametric Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">نام متقاضی:</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان شغل هدف:</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سابقه کاری (سال):</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={experienceYears}
                    onChange={e => setExperienceYears(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">مدرک تحصیلی:</label>
                  <select
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="bachelor">کارشناسی (Bachelor)</option>
                    <option value="master">کارشناسی ارشد (Master)</option>
                    <option value="phd">دکتری تخصصی (PhD)</option>
                    <option value="associate">کاردانی / فنی‌حرفه‌ای</option>
                    <option value="experience_only">فاقد مدرک دانشگاهی (IT Exemption)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">اعتبار آنابین:</label>
                  <select
                    value={anabinStatus}
                    onChange={e => setAnabinStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="H+">H+ (مورد تایید قطعی)</option>
                    <option value="H+/-">H+/- (مشروط / نیازمند ZAB)</option>
                    <option value="H-">H- (غیرمعتبر)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سطح زبان آلمانی:</label>
                  <select
                    value={germanLevel}
                    onChange={e => setGermanLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="None">آشنایی ندارم</option>
                    <option value="A1">A1 (مقدماتی)</option>
                    <option value="A2">A2 (پایه)</option>
                    <option value="B1">B1 (متوسط - استاندارد ویزا)</option>
                    <option value="B2">B2 (پیشرفته شغلی)</option>
                    <option value="C1">C1 (مسلط و تخصصی)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سطح زبان انگلیسی:</label>
                  <select
                    value={englishLevel}
                    onChange={e => setEnglishLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="B1">B1 (مکالمه عمومی)</option>
                    <option value="B2">B2 (مکالمه کاری روان)</option>
                    <option value="C1">C1 (پیشرفته و بی‌نقص)</option>
                    <option value="C2">C2 (بومی / Native)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سن متقاضی:</label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={candidateAge}
                    onChange={e => setCandidateAge(Math.max(18, Number(e.target.value)))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  مهارت‌های کلیدی و تِک‌استک (جداشده با کاما):
                </label>
                <textarea
                  rows={2}
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  placeholder="مثال: TypeScript, React, Python, Docker, AWS, PostgreSQL, Git"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {parsedSkills.slice(0, 8).map((sk, idx) => (
                    <span key={idx} className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                      {sk}
                    </span>
                  ))}
                  {parsedSkills.length > 8 && (
                    <span className="text-[10px] text-slate-500 self-center">+{parsedSkills.length - 8} مهارت دیگر</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Parametric Weights & Calibration */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  تنظیم اوزان پارامتریک و سناریوی قانونی
                </h3>
              </div>
              <button
                onClick={() => setShowWeightSliders(!showWeightSliders)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{showWeightSliders ? "بستن اوزان" : "شخصی‌سازی اوزان"}</span>
                {showWeightSliders ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Presets Selector */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500">پریست‌های وزنی بر اساس مسیر مهاجرتی مدنظر شما:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PARAMETRIC_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3 rounded-2xl border text-right transition cursor-pointer text-xs space-y-1 ${
                      currentPresetId === preset.id
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200 font-black ring-1 ring-amber-500/30"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-amber-400/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{preset.nameFa}</span>
                      {currentPresetId === preset.id && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {preset.descriptionFa}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Sliders */}
            <AnimatePresence>
              {showWeightSliders && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs overflow-hidden"
                >
                  <p className="text-[11px] text-slate-500">
                    مجموع اوزان جاری: {customWeights.techSkills + customWeights.experience + customWeights.academicAnabin + customWeights.language + customWeights.nonEuVisa + customWeights.cvCompliance}٪
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>تِک‌استک و مهارت‌های فنی:</span>
                      <span className="text-indigo-600 font-black">{customWeights.techSkills}٪</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      value={customWeights.techSkills}
                      onChange={e => setCustomWeights(prev => ({ ...prev, techSkills: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>سابقه کاری و سطح ارشدیت:</span>
                      <span className="text-indigo-600 font-black">{customWeights.experience}٪</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={customWeights.experience}
                      onChange={e => setCustomWeights(prev => ({ ...prev, experience: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>مدرک دانشگاهی و اعتبار آنابین:</span>
                      <span className="text-indigo-600 font-black">{customWeights.academicAnabin}٪</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      value={customWeights.academicAnabin}
                      onChange={e => setCustomWeights(prev => ({ ...prev, academicAnabin: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>تسلط زبانی (آلمانی و انگلیسی):</span>
                      <span className="text-indigo-600 font-black">{customWeights.language}٪</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      value={customWeights.language}
                      onChange={e => setCustomWeights(prev => ({ ...prev, language: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>الزامات ویزای غیراروپایی ۲۰۲۶ (§18g/§81a):</span>
                      <span className="text-indigo-600 font-black">{customWeights.nonEuVisa}٪</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      value={customWeights.nonEuVisa}
                      onChange={e => setCustomWeights(prev => ({ ...prev, nonEuVisa: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>فرمت استاندارد Lebenslauf:</span>
                      <span className="text-indigo-600 font-black">{customWeights.cvCompliance}٪</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={customWeights.cvCompliance}
                      onChange={e => setCustomWeights(prev => ({ ...prev, cvCompliance: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* LEFT COLUMN (Scores, Breakdown & Target Companies, 7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Composite Parametric Score Hero Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Big Score Dial */}
              <div className="flex items-center gap-5">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className={`${
                        parametricBreakdown.compositeOverallScore >= 80
                          ? "text-emerald-500"
                          : parametricBreakdown.compositeOverallScore >= 65
                          ? "text-indigo-600"
                          : "text-amber-500"
                      } transition-all duration-1000 ease-out`}
                      strokeWidth="10"
                      strokeDasharray={314}
                      strokeDashoffset={314 - (314 * parametricBreakdown.compositeOverallScore) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {parametricBreakdown.compositeOverallScore}٪
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">امتیاز کل تطابق</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-black">
                    <Award className="w-3.5 h-3.5" />
                    <span>{parametricBreakdown.ratingLabelFa}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    کارنامه پارامتریک {candidateName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    موقعیت هدف: <span className="font-bold text-slate-700 dark:text-slate-200">{targetRole}</span> | رتبه ارشدیت: <span className="font-bold text-indigo-600">{parametricBreakdown.experienceDetails.seniorityLevel}</span>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleTriggerAiAudit}
                  disabled={isAiAuditing}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isAiAuditing ? "animate-spin text-amber-300" : "text-amber-400"}`} />
                  <span>{isAiAuditing ? "در حال ممیزی هوش مصنوعی..." : "ممیزی عمیق هوش مصنوعی"}</span>
                </button>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab("cv")}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>اصلاح در رزومه‌ساز Lebenslauf</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                )}
              </div>
            </div>

            {/* AI Deep Audit Output if available */}
            {aiAuditReport && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-950 dark:text-indigo-200 space-y-2"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    نتیجه ممیزی عمیق هوش مصنوعی فدرال:
                  </span>
                  <button onClick={() => setAiAuditReport(null)} className="text-slate-400 hover:text-slate-600">×</button>
                </div>
                <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                  {aiAuditReport}
                </p>
              </motion.div>
            )}

            {/* Radar Chart & 6 Dimensions Grid */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Radar Chart Visual (5 cols) */}
              <div className="md:col-span-5 h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={companyFit.radarData}>
                    <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                    <Radar name="امتیاز متقاضی" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.45} />
                    <Radar name="میانگین پذیرش آلمان" dataKey="benchmark" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* 6 Parametric Dimension Bars (7 cols) */}
              <div className="md:col-span-7 space-y-2.5 text-xs">
                
                {/* 1. Tech Skills */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate">۱. مهارت‌های فنی و تِک‌استک</p>
                    <p className="text-[10px] text-slate-500 truncate">{parametricBreakdown.techSkillsDetails.feedbackFa}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {parametricBreakdown.techSkillsScore}٪
                    </span>
                  </div>
                </div>

                {/* 2. Experience */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate">۲. سابقه کار و سطح ارشدیت فدرال</p>
                    <p className="text-[10px] text-slate-500 truncate">{parametricBreakdown.experienceDetails.feedbackFa}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {parametricBreakdown.experienceScore}٪
                    </span>
                  </div>
                </div>

                {/* 3. Academic Anabin */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate">۳. مدرک تحصیلی و اعتبار آنابین/زاب</p>
                    <p className="text-[10px] text-slate-500 truncate">{parametricBreakdown.academicDetails.feedbackFa}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {parametricBreakdown.academicAnabinScore}٪
                    </span>
                  </div>
                </div>

                {/* 4. Language */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate">۴. شاخص آمادگی زبانی (آلمانی و انگلیسی)</p>
                    <p className="text-[10px] text-slate-500 truncate">{parametricBreakdown.languageDetails.feedbackFa}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {parametricBreakdown.languageScore}٪
                    </span>
                  </div>
                </div>

                {/* 5. Non-EU Visa Readiness */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate">۵. الزامات ویزای غیراروپایی ۲۰۲۶</p>
                    <p className="text-[10px] text-slate-500 truncate">{parametricBreakdown.nonEuVisaDetails.feedbackFa}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {parametricBreakdown.nonEuVisaScore}٪
                    </span>
                  </div>
                </div>

                {/* 6. CV Compliance */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate">۶. ساختار رزومه استاندارد Lebenslauf</p>
                    <p className="text-[10px] text-slate-500 truncate">{parametricBreakdown.cvComplianceDetails.feedbackFa}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {parametricBreakdown.cvComplianceScore}٪
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Section: Selected Target German Companies Evaluation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Header + View Mode Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>معیارهای استخدام غیراروپایی شرکت‌های منتخب آلمان</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تطابق رزومه شما با فرهنگ جذب و سوابق ۱۰ ساله کارفرماهای پیشرو آلمان
                </p>
              </div>

              {/* View Switcher */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold self-start">
                <button
                  onClick={() => setActiveViewMode("deep_dive")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeViewMode === "deep_dive"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  تحلیل موشکافانه شرکت
                </button>
                <button
                  onClick={() => setActiveViewMode("matrix_compare")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeViewMode === "matrix_compare"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  ماتریس مقایسه‌ای همه
                </button>
              </div>
            </div>

            {/* Tier Filters & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                <button
                  onClick={() => setCompanyTierFilter("all")}
                  className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                    companyTierFilter === "all"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  همه کارفرماها ({TARGET_GERMAN_COMPANIES.length})
                </button>
                <button
                  onClick={() => setCompanyTierFilter("phase1_high_chance")}
                  className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                    companyTierFilter === "phase1_high_chance"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  <span>⭐ شانس بالای مصاحبه (فاز ۱ چابک)</span>
                </button>
                <button
                  onClick={() => setCompanyTierFilter("phase2_enterprise")}
                  className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                    companyTierFilter === "phase2_enterprise"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <span>🏛️ مگا شرکت‌های بین‌المللی (DAX 40)</span>
                </button>
              </div>

              <input
                type="text"
                placeholder="جستجوی شرکت یا شهر..."
                value={companySearchQuery}
                onChange={e => setCompanySearchQuery(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white sm:w-48 mr-auto"
              />
            </div>

            {/* Company Chips Carousel / Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {filteredCompanies.map(comp => {
                const isSelected = comp.id === selectedCompanyId;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompanyId(comp.id)}
                    className={`shrink-0 px-3 py-2 rounded-2xl border text-right transition cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/30"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {comp.logoText}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{comp.name}</p>
                      <p className="text-[10px] text-slate-500">{comp.city} | جذب {comp.nonEuHiringRate10Yrs}٪</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* VIEW 1: DEEP DIVE INTO SELECTED COMPANY */}
            {activeViewMode === "deep_dive" && (
              <motion.div
                key={selectedCompany.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Company Header Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/80 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white font-black text-base flex items-center justify-center shadow-md">
                        {selectedCompany.logoText}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900 dark:text-white">
                            {selectedCompany.legalName}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                            {selectedCompany.city} ({selectedCompany.state})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">{selectedCompany.industry} • {selectedCompany.employeeCount}</p>
                      </div>
                    </div>

                    {/* Company Match Score KPI */}
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">تطابق با این کارفرما</p>
                        <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                          {companyFit.companySpecificScore}٪
                        </p>
                      </div>
                      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">پیش‌بینی دعوت به مصاحبه</p>
                        <p className={`text-xl font-black ${
                          companyFit.interviewProbabilityPercent >= 75
                            ? "text-emerald-500"
                            : companyFit.interviewProbabilityPercent >= 60
                            ? "text-indigo-500"
                            : "text-amber-500"
                        }`}>
                          {companyFit.interviewProbabilityPercent}٪ ({companyFit.interviewProbabilityTier})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Pillars of Non-EU Criteria */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-2">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">نرخ پذیرش غیراروپایی ۱۰ ساله:</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {selectedCompany.nonEuHiringRate10Yrs}٪ ({selectedCompany.iranianStaffCountEstimate})
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">بازدهی مصاحبه از راه دور:</span>
                      <span className="font-black text-slate-800 dark:text-slate-200 text-sm">
                        {selectedCompany.remoteInterviewYieldPercent}٪ بازدهی
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">پشتیبانی ویزا و جابجایی:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {selectedCompany.visaSupportSpeed}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">پیش‌نیاز زبان کاری:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {selectedCompany.workLanguageRequirement}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fit Breakdown: Strengths vs Gaps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Strengths */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
                    <h5 className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>نقاط قوت رزومه برای {selectedCompany.name}:</span>
                    </h5>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                      {companyFit.keyStrengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2.5">
                    <h5 className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>گپ‌ها و معیارهای نیازمند ارتقا:</span>
                    </h5>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                      {companyFit.criticalGaps.length > 0 ? (
                        companyFit.criticalGaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{gap}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-emerald-700 dark:text-emerald-300 font-bold">
                          گپ بحرانی قابل توجهی شناسایی نشد؛ رزومه در وضعیت بهینه قرار دارد.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Strategic Advice & Actionable Boosters */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <h5 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>کلیدواژه‌های طلایی و راهکارهای ارتقای دعوت به مصاحبه در {selectedCompany.name}:</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompany.culturalFitKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                        «{kw}»
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {companyFit.actionableScoreBoosters.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                    <a
                      href={selectedCompany.careersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      <span>مشاهده فرصت‌های شغلی رسمی در {selectedCompany.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleCopy(`تطابق رزومه با ${selectedCompany.name}: ${companyFit.companySpecificScore}٪ | احتمال مصاحبه: ${companyFit.interviewProbabilityPercent}٪`, "comp-summary")}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 cursor-pointer text-[11px]"
                    >
                      {copiedText === "comp-summary" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText === "comp-summary" ? "کپی شد" : "کپی خلاصه"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: MULTI-COMPANY COMPARISON MATRIX */}
            {activeViewMode === "matrix_compare" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"
              >
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black">
                    <tr>
                      <th className="p-3">شرکت و دسته</th>
                      <th className="p-3">تطابق پارامتریک</th>
                      <th className="p-3">احتمال دعوت به مصاحبه</th>
                      <th className="p-3">نرخ جذب غیراروپایی</th>
                      <th className="p-3">زبان کاری</th>
                      <th className="p-3">سرعت صدور ویزا</th>
                      <th className="p-3 text-center">اقدام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {allCompaniesFits.map(fit => (
                      <tr
                        key={fit.company.id}
                        onClick={() => {
                          setSelectedCompanyId(fit.company.id);
                          setActiveViewMode("deep_dive");
                        }}
                        className={`hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 cursor-pointer transition ${
                          fit.company.id === selectedCompanyId ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                        }`}
                      >
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                              {fit.company.logoText}
                            </span>
                            <div>
                              <span>{fit.company.name}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">{fit.company.city}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-black text-indigo-600 dark:text-indigo-400">
                          {fit.companySpecificScore}٪
                        </td>
                        <td className="p-3 font-bold">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                            fit.interviewProbabilityPercent >= 75
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : fit.interviewProbabilityPercent >= 60
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}>
                            {fit.interviewProbabilityPercent}٪ ({fit.interviewProbabilityTier})
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 font-bold">
                          {fit.historicalNonEuHiringRate}٪
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {fit.company.workLanguageRequirement}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {fit.company.visaSupportSpeed}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedCompanyId(fit.company.id);
                              setActiveViewMode("deep_dive");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition"
                          >
                            بررسی دقیق
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

          </div>

        </div>

      </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
