import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Award, 
  Copy, 
  Check, 
  Briefcase, 
  Globe, 
  Building2, 
  Euro, 
  FileSearch, 
  RefreshCw, 
  UploadCloud, 
  Loader2, 
  Scale, 
  GraduationCap, 
  Target, 
  FileCheck2, 
  FileText,
  BadgeAlert,
  ChevronLeft
} from "lucide-react";
import { SponsorshipJob, EvaluatorInput, ResumeJobAnalysisResult } from "../types";
import { fetchWithRetry } from "../utils";

interface ResumeJobAnalysisModalProps {
  job: SponsorshipJob | null;
  profile: EvaluatorInput;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate?: (profile: EvaluatorInput) => void;
}

export default function ResumeJobAnalysisModal({
  job,
  profile,
  isOpen,
  onClose,
  onProfileUpdate
}: ResumeJobAnalysisModalProps) {
  const [activeTab, setActiveTab] = useState<"skills" | "tailoring" | "experience">("skills");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [analysis, setAnalysis] = useState<ResumeJobAnalysisResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

  // Run analysis when modal opens or job changes
  useEffect(() => {
    if (isOpen && job) {
      runAnalysis();
    }
  }, [isOpen, job?.companyName, job?.jobTitle]);

  const runAnalysis = async () => {
    if (!job) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetchWithRetry("/api/gemini/resume-job-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          job,
          profile,
          pdfBase64: profile?.pdfBase64 || null
        })
      });

      if (!response.ok) {
        throw new Error("خطا در ارتباط با سرور یا سرویس تحلیل هوش مصنوعی.");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error("Resume analysis error:", err);
      setError(err?.message || "امکان دریافت تحلیل آنلاین فراهم نشد. مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleModalFileUpload = (file: File) => {
    if (file.type !== "application/pdf") return;
    setUploadingPdf(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const updatedProfile = { ...profile, pdfBase64: base64 };
      if (onProfileUpdate) onProfileUpdate(updatedProfile);
      setUploadingPdf(false);
      // Trigger new analysis with the uploaded resume
      setLoading(true);
      try {
        const response = await fetchWithRetry("/api/gemini/resume-job-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job, profile: updatedProfile, pdfBase64: base64 })
        });
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen || !job) return null;

  const atsScore = analysis?.atsMatchScore || 80;
  const scoreColor = atsScore >= 85 ? "text-emerald-400" : atsScore >= 70 ? "text-indigo-400" : "text-amber-400";
  const scoreBorder = atsScore >= 85 ? "border-emerald-500/30 bg-emerald-500/10" : atsScore >= 70 ? "border-indigo-500/30 bg-indigo-500/10" : "border-amber-500/30 bg-amber-500/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in no-print" dir="rtl">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black">
                <FileSearch className="w-3.5 h-3.5 text-indigo-400" />
                <span>تحلیل عمیق رزومه (Resume Analysis) • هوش مصنوعی Gemini</span>
              </span>

              {profile.pdfBase64 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>مبنا: رزومه PDF آپلودشده کاندیدا</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                  <AlertCircle className="w-3 h-3" />
                  <span>مبنا: مشخصات فرم پروفایل متقاضی</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2 pt-1">
              <h2 className="text-lg sm:text-xl font-black text-white truncate max-w-md">{job.jobTitle}</h2>
              <span className="text-sm font-bold text-indigo-400 flex items-center gap-1">
                <Building2 className="w-4 h-4 shrink-0" />
                {job.companyName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-0.5 font-medium">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                {job.location || "آلمان"}
              </span>
              <span>•</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <Euro className="w-3 h-3" />
                {job.salary}
              </span>
              <span>•</span>
              <span className="text-amber-400">{job.visaType || "EU Blue Card (§18g)"}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick PDF Uploader if no PDF attached yet */}
          {!profile.pdfBase64 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-right">
                <UploadCloud className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">هنوز فایل PDF رزومه خود را بارگذاری نکرده‌اید!</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    برای استخراج دقیق‌تر مهارت‌های متنی و انطباق جزءبه‌جزء با این موقعیت شغلی، می‌توانید فایل رزومه خود را همینجا اضافه کنید.
                  </p>
                </div>
              </div>

              <label className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-md">
                {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                <span>بارگذاری فایل رزومه PDF</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleModalFileUpload(e.target.files[0]);
                    }
                  }} 
                />
              </label>
            </div>
          )}

          {/* Top ATS Score & Executive Summary Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-inner relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Score circle */}
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center shrink-0 shadow-lg ${scoreBorder}`}>
                  <span className={`text-2xl font-black font-mono ${scoreColor}`}>{atsScore}%</span>
                  <span className="text-[9px] font-bold text-slate-400">ATS Score</span>
                </div>

                <div className="space-y-1.5 text-right">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm sm:text-base font-black text-white">ضریب تطابق با سیستم غربالگری کارفرما (ATS)</h3>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreBorder} ${scoreColor}`}>
                    {analysis?.matchLevel || "سطح انطباق بسیار بالا"}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {analysis?.executiveSummary || "در حال ارزیابی تخصصی و استخراج کلمات کلیدی توسط موتور تحلیل رزومه..."}
                  </p>
                </div>
              </div>

              {/* Refresh / Re-analyze button */}
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer disabled:opacity-50 shrink-0"
                title="تحلیل مجدد با هوش مصنوعی Gemini"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-400" : ""}`} />
                <span>{loading ? "در حال تحلیل مجدد..." : "تحلیل مجدد (Gemini)"}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === "skills"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Target className="w-4 h-4" />
              <span>مهارت‌ها و عدم انطباق‌ها (Skills & Gaps)</span>
              {analysis?.highlightedMismatches && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  {analysis.highlightedMismatches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("tailoring")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === "tailoring"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>راهکارهای شخصی‌سازی رزومه (Tailoring Tips)</span>
            </button>

            <button
              onClick={() => setActiveTab("experience")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === "experience"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>سوابق کاری، تحصیلات و زبان</span>
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && !analysis && (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">هوش مصنوعی Gemini در حال خوانش و تطبیق رزومه شماست...</h4>
                <p className="text-xs text-slate-400">استخراج مهارت‌های رزومه، مقایسه با نیازمندی‌های {job.companyName} و تدوین راهکارهای شخصی‌سازی</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 rounded-2xl flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h4 className="font-bold">خطا در فرآیند استخراج تحلیل</h4>
                <p className="text-slate-400">{error}</p>
                <button
                  onClick={runAnalysis}
                  className="mt-2 px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  تلاش مجدد
                </button>
              </div>
            </div>
          )}

          {/* Tab 1: Skills & Mismatches */}
          {!loading && analysis && activeTab === "skills" && (
            <div className="space-y-6 animate-fade-in">
              {/* Section 1: Extracted Skills from Candidate's CV */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>مهارت‌های کلیدی استخراج‌شده از رزومه شما (Extracted Candidate Skills):</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono font-bold">
                    {analysis.extractedCandidateSkills?.length || 0} مهارت شناسایی‌شده
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(analysis.extractedCandidateSkills || []).map((sk, idx) => (
                    <span 
                      key={idx} 
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        sk.isMatched 
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      {sk.isMatched ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                      )}
                      <span>{sk.name}</span>
                      {sk.level && (
                        <span className="text-[10px] text-slate-400 font-normal">({sk.level})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 2: Highlighted Mismatches & Skill Gaps (Crucial Requirement) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                    <BadgeAlert className="w-4 h-4 text-amber-400" />
                    <span>عدم انطباق‌ها و مهارت‌های مفقود برای این پوزیشن (Highlighted Mismatches & Skill Gaps):</span>
                  </h4>
                  <span className="text-[11px] text-amber-400 font-bold">نیازمند توجه پیش از ارسال رزومه</span>
                </div>

                {(!analysis.highlightedMismatches || analysis.highlightedMismatches.length === 0) ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>هیچ شکاف مهارتی بحرانی بین رزومه شما و این شغل یافت نشد؛ تطابق بسیار ممتاز است!</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {analysis.highlightedMismatches.map((gap, idx) => {
                      const isCritical = gap.severity === "critical";
                      const isImportant = gap.severity === "important";

                      return (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-2xl border space-y-2.5 transition ${
                            isCritical
                              ? "bg-red-950/20 border-red-500/30 text-red-200"
                              : isImportant
                              ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                              : "bg-slate-800/60 border-slate-700 text-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                              <AlertTriangle className={`w-4 h-4 shrink-0 ${isCritical ? "text-red-400" : isImportant ? "text-amber-400" : "text-sky-400"}`} />
                              <span>{gap.skill}</span>
                            </span>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isCritical 
                                ? "bg-red-500/20 text-red-300 border border-red-500/30" 
                                : isImportant 
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            }`}>
                              {isCritical ? "شکاف بحرانی" : isImportant ? "مهم و اثرگذار" : "امتیاز مزیتی"}
                            </span>
                          </div>

                          <p className="text-[11px] leading-relaxed text-slate-300">
                            {gap.gapDescription}
                          </p>

                          {/* Actionable Advice to Bridge Gap */}
                          <div className="pt-2 border-t border-slate-700/60 bg-slate-900/60 p-2.5 rounded-xl">
                            <div className="text-[10px] font-bold text-amber-300 flex items-center gap-1 mb-1">
                              <Target className="w-3 h-3" />
                              <span>راهکار پوشش در رزومه:</span>
                            </div>
                            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                              {gap.actionableAdvice}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 3: Matched Skills and Strengths */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>نقاط قوت و مهارت‌های منطبق با آگهی (Matched Skills & Strengths):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(analysis.matchedSkills || []).map((m, idx) => (
                    <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-black text-emerald-300 block">{m.skill}</span>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Actionable Tailoring Suggestions (Crucial Requirement) */}
          {!loading && analysis && activeTab === "tailoring" && (
            <div className="space-y-6 animate-fade-in">
              {/* Ready-to-use Tailored Headline & Summary Snippet */}
              <div className="bg-gradient-to-br from-indigo-950/60 via-slate-950/80 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>پیش‌نویس آماده تیتر و خلاصه رزومه اختصاصی این شغل (Tailored Profile Summary):</span>
                  </h4>
                  <button
                    onClick={() => handleCopyText(
                      `${analysis.tailoredHeadline}\n\n${analysis.tailoredSummarySnippet}`, 
                      "summary"
                    )}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    {copiedKey === "summary" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی متن خلاصه</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-indigo-400 font-bold block mb-1">تیتر پیشنهادی بالای رزومه (Headline):</span>
                    <p className="text-xs sm:text-sm font-bold text-white font-sans">{analysis.tailoredHeadline}</p>
                  </div>

                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-purple-400 font-bold block mb-1">متن خلاصه رزومه (Executive Summary / Profil):</span>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-sans italic">{analysis.tailoredSummarySnippet}</p>
                  </div>
                </div>
              </div>

              {/* Actionable Suggestions Grid */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>دستورالعمل‌های گام‌به‌گام برای بهینه‌سازی رزومه (Actionable Tailoring Suggestions):</span>
                </h4>

                <div className="space-y-3">
                  {(analysis.actionableSuggestions || []).map((tip, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h5 className="text-xs sm:text-sm font-black text-white">{tip.title}</h5>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-copy Tailored Bullet Points */}
              {analysis.tailoredBulletPoints && analysis.tailoredBulletPoints.length > 0 && (
                <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>پیشنهاد بازنویسی بولت‌پوینت‌های سوابق کاری (Tailored Experience Bullets):</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">به فرمت استاندارد انگلیسی/آلمانی</span>
                  </div>

                  <div className="space-y-2">
                    {analysis.tailoredBulletPoints.map((bullet, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3">
                        <p className="text-xs text-slate-200 font-sans leading-relaxed flex-1" dir="ltr">{bullet}</p>
                        <button
                          onClick={() => handleCopyText(bullet, `bullet_${idx}`)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer shrink-0"
                          title="کپی بولت پوینت"
                        >
                          {copiedKey === `bullet_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Experience, Education & Language Fit */}
          {!loading && analysis && activeTab === "experience" && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experience Fit */}
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span>تطابق سنوات و سطح سابقه کاری</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <span className="text-slate-400">سابقه شما:</span>
                    <span className="font-bold text-white font-mono">{analysis.experienceAnalysis?.candidateYears || profile.experience} سال</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <span className="text-slate-400">حداقل ترجیحی کارفرما:</span>
                    <span className="font-bold text-emerald-400 font-mono">{analysis.experienceAnalysis?.requiredYears || job.minExp || 2} سال</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {analysis.experienceAnalysis?.notes || "سطح سابقه کار با استاندارد موقعیت تطابق دارد."}
                  </p>
                </div>

                {/* Language Fit */}
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs sm:text-sm">
                    <Globe className="w-4 h-4" />
                    <span>تطابق زبان کاری و ارتباطات سازمانی</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <span className="text-slate-400">زبان کاری این پوزیشن:</span>
                    <span className="font-bold text-white">{job.workLanguage || "English / German"}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <span className="text-slate-400">سطوح زبان شما:</span>
                    <span className="font-bold text-sky-300">انگلیسی: {profile.englishLevel || "B2"} | آلمانی: {profile.germanLevel || "B1"}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {analysis.languageAnalysis?.notes || "توانمندی زبانی شما کفایت لازم برای ورود به این سازمان را داراست."}
                  </p>
                </div>
              </div>

              {/* Visa & Relocation Legal Context */}
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                  <Scale className="w-4 h-4" />
                  <span>تسهیلات ویزا و رلوکیشن اعلام‌شده توسط {job.companyName}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <b>حمایت ویزا:</b> {job.visaSp}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <b>بسته جابجایی (Relocation):</b> {job.relocation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-medium">
            <span>تحلیل هوشمند توسط مدل Gemini بر اساس نیازمندی‌های مصوب بازار کار آلمان ۲۰۲۶</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {job.website && (
              <a
                href={job.website.startsWith('http') ? job.website : `https://${job.website}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <span>ارسال رزومه در وبسایت کارفرما</span>
                <ChevronLeft className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
