import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Building2, 
  Euro, 
  Briefcase, 
  FileText, 
  Check, 
  Copy, 
  Upload, 
  Loader2, 
  RefreshCw, 
  Globe, 
  Award,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  Languages,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SponsorshipJob, ResumeJobAnalysisData, EvaluatorInput } from "../types";

interface ResumeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: SponsorshipJob | null;
  analysis: ResumeJobAnalysisData | null;
  isLoading: boolean;
  error?: string | null;
  profile: EvaluatorInput;
  pdfFile?: File | null;
  onReAnalyze: (newPdfFile?: File) => void;
}

export const ResumeAnalysisModal: React.FC<ResumeAnalysisModalProps> = ({
  isOpen,
  onClose,
  job,
  analysis,
  isLoading,
  error,
  profile,
  pdfFile,
  onReAnalyze
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "mismatches" | "suggestions" | "tailored_cv">("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [quickUploadError, setQuickUploadError] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQuickUploadError(null);
    if (file.type !== "application/pdf") {
      setQuickUploadError("لطفاً فقط فایل با پسوند PDF انتخاب کنید.");
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setQuickUploadError("حجم فایل نباید بیش از ۲.۵ مگابایت باشد.");
      return;
    }
    onReAnalyze(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setQuickUploadError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setQuickUploadError("لطفاً فقط فایل PDF انتخاب کنید.");
      return;
    }
    onReAnalyze(file);
  };

  const score = analysis?.atsMatchScore ?? 75;
  const scoreColor = score >= 85 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : score >= 70 ? "text-indigo-400 border-indigo-500/40 bg-indigo-500/10" : "text-amber-400 border-amber-500/40 bg-amber-500/10";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-right"
          dir="rtl"
        >
          {/* Modal Header */}
          <div className="p-5 md:p-6 border-b border-slate-800/80 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-xl text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  تحلیل هوشمند رزومه با Gemini (Resume Analysis)
                </span>
                {pdfFile ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[11px] font-medium">
                    <FileText className="w-3 h-3" />
                    استخراج زنده از فایل: {pdfFile.name}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-xl text-[11px] font-medium">
                    <FileText className="w-3 h-3" />
                    بر پایه اطلاعات پروفایل متقاضی
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{job.jobTitle}</span>
                  <span className="text-slate-400 font-normal text-sm md:text-base">در {job.companyName}</span>
                </h2>
              </div>

              {/* Job Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {job.location && (
                  <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/60">
                    <Globe className="w-3 h-3 text-sky-400" />
                    {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-mono font-bold">
                    <Euro className="w-3 h-3 text-emerald-400" />
                    {job.salary}
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    <Briefcase className="w-3 h-3 text-amber-400" />
                    {job.experienceLevel}
                  </span>
                )}
                {job.visaSp && (
                  <span className="inline-flex items-center gap-1 text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    {job.visaSp}
                  </span>
                )}
              </div>
            </div>

            {/* Close Button & Action */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                onClick={() => onReAnalyze()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer disabled:opacity-50"
                title="تحلیل مجدد این شغل با هوش مصنوعی"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
                <span>بروزرسانی تحلیل</span>
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                title="بستن پنجره"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-800 bg-slate-950/40 px-5 md:px-6 flex items-center gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>نمای کلی و نمره ATS</span>
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "skills"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>مهارت‌های استخراج‌شده ({analysis?.extractedCandidateSkills?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("mismatches")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "mismatches"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>شکاف‌ها و مغایرت‌ها ({analysis?.highlightedMismatches?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("suggestions")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "suggestions"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>پیشنهادات شخصی‌سازی ({analysis?.actionableSuggestions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("tailored_cv")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "tailored_cv"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>متن‌های آماده برای رزومه</span>
            </button>
          </div>

          {/* Modal Body with Scroll */}
          <div className="p-5 md:p-6 overflow-y-auto space-y-6 grow">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">هوش مصنوعی Gemini در حال تحلیل رزومه و نیازمندی‌های این شغل است...</h3>
                  <p className="text-xs text-slate-400">
                    استخراج مهارت‌های رزومه، تطابق با سیستم‌های ATS کارفرمای آلمانی، شناسایی مغایرت‌ها و فرمول‌بندی راهکارها
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-sm text-red-300 font-bold">{error}</p>
                <button
                  onClick={() => onReAnalyze()}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تلاش مجدد</span>
                </button>
              </div>
            ) : !analysis ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                اطلاعات تحلیلی یافت نشد. لطفاً دکمه بروزرسانی تحلیل را کلیک کنید.
              </div>
            ) : (
              <>
                {/* Quick Resume Upload Dropzone / Banner */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isDragOver 
                      ? "bg-blue-600/15 border-blue-500" 
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>منبع رزومه فعلی:</span>
                        <span className="text-blue-300 font-mono">{pdfFile ? pdfFile.name : (profile.name ? `${profile.name} (اطلاعات پروفایل)` : "رزومه فرم اولیه")}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        می‌توانید نسخه جدیدی از رزومه PDF خود را بارگذاری کنید تا تطابق با این شغل مجدداً استخراج و محاسبه شود.
                      </p>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>آپلود نسخه جدید رزومه</span>
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf" 
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                {quickUploadError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{quickUploadError}</span>
                  </div>
                )}

                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Top KPI Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* ATS Score Card */}
                      <div className={`p-5 rounded-2xl border ${scoreColor} flex flex-col justify-between`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">امتیاز انطباق ATS</span>
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="my-2">
                          <div className="text-3xl font-black font-mono">{score}%</div>
                          <div className="text-xs font-bold mt-1">{analysis.matchLevel}</div>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-current transition-all duration-700" 
                            style={{ width: `${Math.min(100, Math.max(5, score))}%` }} 
                          />
                        </div>
                      </div>

                      {/* Skills Ratio Card */}
                      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-xs font-bold">مهارت‌های منطبق</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="my-2">
                          <div className="text-3xl font-black font-mono text-emerald-400">
                            {analysis.matchedSkills?.length || 0}
                            <span className="text-sm font-normal text-slate-400 mr-1.5">
                              از {analysis.jobRequiredSkills?.length || 0} مهارت کلیدی
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">پوشش مستقیم نیازهای کارفرما</div>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-medium">
                          ✓ {Math.round(((analysis.matchedSkills?.length || 0) / Math.max(1, analysis.jobRequiredSkills?.length || 1)) * 100)}% هم‌پوشانی مهارتی
                        </div>
                      </div>

                      {/* Mismatches Count Card */}
                      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-xs font-bold">شکاف‌های برجسته</span>
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="my-2">
                          <div className="text-3xl font-black font-mono text-amber-400">
                            {analysis.highlightedMismatches?.length || 0}
                            <span className="text-sm font-normal text-slate-400 mr-1.5">مورد نیازمند تنظیم</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">فاصله از الزامات دقیق آگهی</div>
                        </div>
                        <button
                          onClick={() => setActiveTab("mismatches")}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>مشاهده و راهکارهای جبران</span>
                          <ArrowRight className="w-3 h-3 rotate-180" />
                        </button>
                      </div>

                      {/* Experience & Seniority Card */}
                      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-xs font-bold">سابقه کار و ارشدیت</span>
                          <Clock className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="my-2">
                          <div className="text-2xl font-black font-mono text-indigo-300">
                            {analysis.experienceAnalysis?.candidateYears ?? profile.experience} سال
                            <span className="text-xs font-normal text-slate-400 mr-1.5">
                              (نیاز: {analysis.experienceAnalysis?.requiredYears ?? job.minExp ?? 2} سال)
                            </span>
                          </div>
                          <div className="text-xs text-indigo-300 font-bold mt-1">
                            {analysis.experienceAnalysis?.status || "منطبق و واجد شرایط"}
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {analysis.experienceAnalysis?.notes || "سطح سابقه کار با پیش‌نیازهای کارفرما همخوانی دارد."}
                        </div>
                      </div>
                    </div>

                    {/* Executive Summary by Gemini */}
                    <div className="p-6 bg-gradient-to-r from-blue-950/30 via-indigo-950/20 to-purple-950/30 border border-blue-500/20 rounded-3xl space-y-3">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>جمع‌بندی تحلیلی مشاور شغلی هوش مصنوعی:</span>
                      </div>
                      <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
                        {analysis.executiveSummary}
                      </p>
                    </div>

                    {/* Fast Actionable Highlight Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Top Matched Strengths */}
                      <div className="p-5 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>مهم‌ترین انطباق‌های رزومه شما با این آگهی</span>
                          </h4>
                          <span className="text-[11px] text-slate-400">{analysis.matchedSkills?.length || 0} مهارت</span>
                        </div>
                        <div className="space-y-2">
                          {analysis.matchedSkills?.slice(0, 4).map((m, idx) => (
                            <div key={idx} className="bg-slate-900/80 border border-emerald-500/20 p-2.5 rounded-xl text-xs">
                              <span className="font-bold text-white font-mono">{m.skill}: </span>
                              <span className="text-slate-300">{m.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Critical Mismatches */}
                      <div className="p-5 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            <span>مهم‌ترین شکاف‌ها و کلیدواژه‌های مغایر</span>
                          </h4>
                          <span className="text-[11px] text-slate-400">{analysis.highlightedMismatches?.length || 0} مورد</span>
                        </div>
                        <div className="space-y-2">
                          {analysis.highlightedMismatches?.slice(0, 3).map((mis, idx) => (
                            <div key={idx} className="bg-slate-900/80 border border-amber-500/20 p-2.5 rounded-xl text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white font-mono">{mis.skill}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                                  mis.severity === "critical" ? "bg-red-500/15 text-red-400 border border-red-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                }`}>
                                  {mis.severity === "critical" ? "حیاتی" : "مهم"}
                                </span>
                              </div>
                              <p className="text-slate-300 text-[11px]">{mis.gapDescription}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Language and Market Strategy */}
                    {analysis.languageAnalysis && (
                      <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Languages className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span className="font-bold text-white">ارزیابی انطباق زبانی:</span>
                          <span className="text-slate-300">{analysis.languageAnalysis.notes}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-200 font-mono">
                            آلمانی: {analysis.languageAnalysis.germanStatus}
                          </span>
                          <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-200 font-mono">
                            انگلیسی: {analysis.languageAnalysis.englishStatus}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. EXTRACTED SKILLS TAB */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    {/* Skills Summary Banner */}
                    <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 flex items-center justify-between">
                      <div>
                        مهارت‌های استخراج‌شده مستقیماً از متن و ساختار رزومه شما توسط Gemini استخراج شده و در برابر پیش‌نیازهای دقیق کارفرمای آلمانی سنجیده شده‌اند.
                      </div>
                      <span className="font-bold font-mono text-blue-400 shrink-0 mr-3">
                        {analysis.extractedCandidateSkills?.length || 0} مهارت شناسایی‌شده
                      </span>
                    </div>

                    {/* Candidate Extracted Skills Grid */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>مهارت‌های کلیدی استخراج‌شده از رزومه شما:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {analysis.extractedCandidateSkills?.map((skill, idx) => (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                              skill.isMatched 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : "bg-slate-950/60 border-slate-800 text-slate-300"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-xs truncate font-mono text-white">{skill.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {skill.level || "سطح تخصصی"} {skill.category ? `• ${skill.category}` : ""}
                              </div>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                              skill.isMatched ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                            }`}>
                              {skill.isMatched ? "✓ منطبق با شغل" : "مهارت فرعی"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Job Required Skills List */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span>مهارت‌ها و تخصص‌های الزامی اعلام‌شده برای این موقعیت شغلی در آلمان:</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.jobRequiredSkills?.map((rSkill, idx) => {
                          const isMatched = analysis.matchedSkills?.some(m => m.skill.toLowerCase() === rSkill.toLowerCase() || rSkill.toLowerCase().includes(m.skill.toLowerCase()));
                          return (
                            <span 
                              key={idx} 
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                                isMatched 
                                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                                  : "bg-red-500/10 border-red-500/25 text-red-300"
                              }`}
                            >
                              {isMatched ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-red-400" />
                              )}
                              <span>{rSkill}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HIGHLIGHTED MISMATCHES TAB */}
                {activeTab === "mismatches" && (
                  <div className="space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-2xl text-xs text-amber-200/90 leading-relaxed">
                      <strong>تحلیل شکاف‌های رزومه (Resume Gap Detection):</strong> در این بخش مواردی که در متن آگهی کارفرما یا استانداردهای آلمان جزو پیش‌نیازهای کلیدی بوده اما در رزومه شما قید نشده یا شفاف نبوده، هایلایت شده‌اند. برای دریافت مصاحبه، راهکارهای عملیاتی پیشنهادی را در رزومه خود پیاده کنید.
                    </div>

                    <div className="space-y-4">
                      {analysis.highlightedMismatches?.map((mis, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                              <h4 className="font-mono font-bold text-sm md:text-base text-white">{mis.skill}</h4>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${
                              mis.severity === "critical"
                                ? "bg-red-500/15 text-red-400 border-red-500/30"
                                : mis.severity === "important"
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                            }`}>
                              {mis.severity === "critical" ? "شکاف بحرانی (Critical Gap)" : mis.severity === "important" ? "شکاف بااهمیت (Important)" : "امتیاز ترجیحی (Bonus)"}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <span className="text-slate-400 font-bold shrink-0">علت نیاز و مغایرت:</span>
                              <span className="text-slate-200 leading-relaxed">{mis.gapDescription}</span>
                            </div>

                            <div className="flex items-start gap-2 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-indigo-300 font-bold block mb-0.5">راهکار عملی برای رزومه:</span>
                                <span className="text-indigo-200/90 leading-relaxed">{mis.actionableAdvice}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. ACTIONABLE SUGGESTIONS TAB */}
                {activeTab === "suggestions" && (
                  <div className="space-y-4">
                    <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300">
                      این پیشنهادات توسط موتور تحلیلگر برای عبور از فیلترهای اولیه سیستم‌های اتوماسیون (ATS) و جلب توجه مدیر استخدام شرکت {job.companyName} تدوین شده‌اند:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.actionableSuggestions?.map((sug, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                sug.category === "keywords" 
                                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                                  : sug.category === "experience_bullets"
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                  : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                              }`}>
                                {sug.category === "keywords" ? "کلیدواژه‌های ATS" : sug.category === "experience_bullets" ? "سوابق کاری" : "استاندارد فرمت آلمانی"}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white">{sug.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">{sug.description}</p>
                          </div>

                          <button
                            onClick={() => handleCopy(`${sug.title}\n${sug.description}`, `sug_${idx}`)}
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold pt-2 border-t border-slate-800/80 cursor-pointer"
                          >
                            {copiedKey === `sug_${idx}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">کپی شد!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>کپی متن پیشنهاد</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. TAILORED CV SNIPPETS TAB */}
                {activeTab === "tailored_cv" && (
                  <div className="space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-200">
                      این متون و عبارات دقیقاً بر اساس تخصص شما و موقعیت شغلی <strong>"{job.jobTitle}"</strong> تولید شده‌اند. می‌توانید مستقیماً آن‌ها را کپی کرده و در رزومه آلمانی (Lebenslauf) خود قرار دهید.
                    </div>

                    {/* Tailored Headline */}
                    {analysis.tailoredHeadline && (
                      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">عنوان شغلی پیشنهادی در هدر رزومه (Tailored Professional Title):</span>
                          <button
                            onClick={() => handleCopy(analysis.tailoredHeadline || "", "headline")}
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold"
                          >
                            {copiedKey === "headline" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === "headline" ? "کپی شد" : "کپی عنوان"}</span>
                          </button>
                        </div>
                        <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl font-mono text-sm text-white font-bold" dir="ltr">
                          {analysis.tailoredHeadline}
                        </div>
                      </div>
                    )}

                    {/* Tailored Profile Summary */}
                    {analysis.tailoredSummarySnippet && (
                      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">خلاصه رزومه حرفه‌ای منطبق با کارفرما (Profile Summary):</span>
                          <button
                            onClick={() => handleCopy(analysis.tailoredSummarySnippet || "", "summary")}
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold"
                          >
                            {copiedKey === "summary" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === "summary" ? "کپی شد" : "کپی خلاصه"}</span>
                          </button>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl text-xs md:text-sm text-slate-200 leading-relaxed" dir="ltr">
                          {analysis.tailoredSummarySnippet}
                        </div>
                      </div>
                    )}

                    {/* Tailored Experience Bullet Points */}
                    {analysis.tailoredBulletPoints && analysis.tailoredBulletPoints.length > 0 && (
                      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">بولیت‌پوینت‌های سوابق کاری بازنویسی‌شده بر اساس نیازمندی‌ها (Experience Bullets):</span>
                          <button
                            onClick={() => handleCopy(analysis.tailoredBulletPoints?.join("\n• ") || "", "bullets")}
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold"
                          >
                            {copiedKey === "bullets" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === "bullets" ? "کپی همه" : "کپی کل بولیت‌ها"}</span>
                          </button>
                        </div>
                        <div className="space-y-2.5" dir="ltr">
                          {analysis.tailoredBulletPoints.map((bp, idx) => (
                            <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 flex items-start justify-between gap-3">
                              <span>• {bp}</span>
                              <button
                                onClick={() => handleCopy(bp, `bp_${idx}`)}
                                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 shrink-0 cursor-pointer"
                                title="کپی این سطر"
                              >
                                {copiedKey === `bp_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 md:p-5 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-400">
              {job ? `موقعیت شغلی: ${job.jobTitle} در ${job.companyName}` : ""}
            </div>

            <div className="flex items-center gap-2">
              {analysis && (
                <button
                  onClick={() => {
                    const fullText = `تحلیل رزومه و انطباق برای موقعیت ${job.jobTitle} در ${job.companyName}\nنمره ATS: ${analysis.atsMatchScore}%\n${analysis.executiveSummary}\n\nمهارت‌های منطبق:\n${analysis.matchedSkills?.map(m => `- ${m.skill}: ${m.description}`).join("\n")}\n\nشکاف‌ها:\n${analysis.highlightedMismatches?.map(g => `- ${g.skill} (${g.severity}): ${g.gapDescription}\nراهکار: ${g.actionableAdvice}`).join("\n\n")}\n\nپیشنهادات بهینه‌سازی:\n${analysis.actionableSuggestions?.map(s => `- ${s.title}: ${s.description}`).join("\n")}`;
                    handleCopy(fullText, "full_report");
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {copiedKey === "full_report" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "full_report" ? "کل گزارش کپی شد" : "کپی کامل گزارش تحلیل"}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-blue-900/40"
              >
                بستن و بازگشت
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
