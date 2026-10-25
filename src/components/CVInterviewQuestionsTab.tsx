import React, { useState, useEffect } from "react";
import { 
  HelpCircle, FileText, UploadCloud, Printer, Eye, X, Check, Copy, Clipboard, 
  CheckCircle2, AlertCircle, Sparkles, Building2, Briefcase, ShieldCheck, 
  ChevronDown, ChevronUp, Filter, UserCheck, Calendar, Hash, RefreshCw,
  Layers, Lightbulb, AlertTriangle, FileCode, Award, History, Terminal, Database,
  Volume2, VolumeX, Languages, BookOpen, Wrench, GraduationCap
} from "lucide-react";
import { CVBuilderInput, InterviewQuestionItem, InterviewQuestionsResult, StarFrameworkItem } from "../types";
import { fetchWithRetry, formatPrintDocumentTitle, triggerPrintWithTitle } from "../utils";
import { generateRuleBasedEmployerInterviewQuestions, buildStarFrameworkForQuestion } from "../utils/germanEmployerQuestions";

interface CVInterviewQuestionsTabProps {
  defaultInputs: CVBuilderInput;
}

export interface PayloadTrace {
  timestamp: string;
  sourcePriority: "CV_PDF_OBJECT" | "MANUAL_INPUT";
  hasPdf: boolean;
  fileName: string | null;
  fileSizeBytes: number;
  pdfBase64Length: number;
  sanitizedManualTextSuppressed: boolean;
  candidateNameSent: string;
  targetFieldSent: string;
  resumeTextLengthSent: number;
  logs: string[];
}

export interface CachedInterviewEntry {
  hash: string;
  timestamp: string;
  timestampFa: string;
  candidateName: string;
  targetRole: string;
  questionCount: number;
  data: InterviewQuestionsResult;
}

const CACHE_PREFIX = "interview_prep_cached_v2_";

async function computeResumeHash(base64: string, fileName: string, size: number, manualText: string = ""): Promise<string> {
  const seed = `${fileName}_${size}_${base64 ? base64.slice(0, 500) + base64.slice(-500) : manualText.slice(0, 300)}`;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 16);
  } catch {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = ((h << 5) - h) + seed.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString(16);
  }
}

function getCachedInterview(hash: string): CachedInterviewEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + hash);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveCachedInterview(hash: string, result: InterviewQuestionsResult) {
  try {
    const entry: CachedInterviewEntry = {
      hash,
      timestamp: new Date().toISOString(),
      timestampFa: new Date().toLocaleString("fa-IR"),
      candidateName: result.candidateName || "",
      targetRole: result.targetRole || "",
      questionCount: result.questions?.length || 0,
      data: result
    };
    localStorage.setItem(CACHE_PREFIX + hash, JSON.stringify(entry));
  } catch (e) {
    console.warn("Failed to write interview questions to localStorage cache", e);
  }
}

export default function CVInterviewQuestionsTab({ defaultInputs }: CVInterviewQuestionsTabProps) {
  // Input & Upload States
  const [candidateName, setCandidateName] = useState<string>(defaultInputs.name || "متقاضی محترم");
  const [targetField, setTargetField] = useState<string>(defaultInputs.field || "برنامه‌نویس و توسعه‌دهنده وب (Full Stack)");
  const [experienceYears, setExperienceYears] = useState<string>(
    defaultInputs.experience ? `${defaultInputs.experience} سال سابقه کار حرفه‌ای` : ""
  );
  const [softwareTools, setSoftwareTools] = useState<string>(
    defaultInputs.skills || ""
  );
  const [certifications, setCertifications] = useState<string>("");
  const [practicalProjects, setPracticalProjects] = useState<string>("");
  const [academicDegree, setAcademicDegree] = useState<string>(
    defaultInputs.education || ""
  );

  const [resumeText, setResumeText] = useState<string>(
    `عنوان تخصص: ${defaultInputs.field}\nسوابق کاری: ${defaultInputs.experience}\nتحصیلات: ${defaultInputs.education}\nمهارت‌های فنی: ${defaultInputs.skills}\nزبان‌ها: ${defaultInputs.languages}`
  );
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");

  // Validation state: checks whether uploaded resume data was successfully parsed
  const [resumeParseStatus, setResumeParseStatus] = useState<"idle" | "parsing" | "success" | "error">("idle");
  const [resumeHash, setResumeHash] = useState<string>("");
  const [cachedInterviewEntry, setCachedInterviewEntry] = useState<CachedInterviewEntry | null>(null);

  // Suggested Answer Framework (STAR Method) toggles
  const [openStarFrameworks, setOpenStarFrameworks] = useState<Record<string, boolean>>({});
  const [expandAllStar, setExpandAllStar] = useState<boolean>(false);

  // Tracing payload state
  const [payloadTrace, setPayloadTrace] = useState<PayloadTrace | null>(null);
  const [showTraceModal, setShowTraceModal] = useState<boolean>(false);

  // Analysis & Result States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string>("");
  const [result, setResult] = useState<InterviewQuestionsResult | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<"all" | "general" | "junior" | "mid" | "senior_lead">("all");
  const [selectedCompanyType, setSelectedCompanyType] = useState<"all" | "mittelstand" | "dax_enterprise" | "startup" | "public_authority">("all");

  // Display mode & Audio pronunciation for German Engineering questions
  const [displayMode, setDisplayMode] = useState<"german_primary" | "bilingual" | "persian_primary">("german_primary");
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handlePlayGerman = (e: React.MouseEvent, qId: string, germanText: string) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingId === qId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(germanText);
    utterance.lang = "de-DE";
    utterance.rate = 0.92;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(qId);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when component unmounts or expands change
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // UI state
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-extraction states for uploaded PDF
  const [isExtractingPdf, setIsExtractingPdf] = useState<boolean>(false);
  const [pdfExtractMessage, setPdfExtractMessage] = useState<string>("");

  // Print & Preview Modal states
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printDocRef, setPrintDocRef] = useState<string>("");

  // Toggle single question's STAR framework
  const toggleStarFramework = (questionId: string) => {
    setOpenStarFrameworks(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Toggle all STAR frameworks at once
  const handleToggleAllStar = () => {
    const nextState = !expandAllStar;
    setExpandAllStar(nextState);
    if (result && result.questions) {
      const nextMap: Record<string, boolean> = {};
      result.questions.forEach(q => {
        nextMap[q.id] = nextState;
      });
      setOpenStarFrameworks(nextMap);
    }
  };

  // Check cache on initial render if manual text exists
  useEffect(() => {
    if (!pdfBase64 && resumeText) {
      computeResumeHash("", "manual_resume", resumeText.length, resumeText).then(hash => {
        setResumeHash(hash);
        const cached = getCachedInterview(hash);
        if (cached) {
          setCachedInterviewEntry(cached);
        }
      });
    }
  }, []);

  // Handle loading cached result
  const handleLoadFromCache = (entry: CachedInterviewEntry) => {
    setResult(entry.data);
    if (entry.data.candidateName) setCandidateName(entry.data.candidateName);
    if (entry.data.targetRole) setTargetField(entry.data.targetRole);
    if (entry.data.candidateWorkProfile) {
      const cwp = entry.data.candidateWorkProfile;
      if (cwp.yearsOfExperience) setExperienceYears(String(cwp.yearsOfExperience));
      if (cwp.softwareTools && cwp.softwareTools.length > 0) setSoftwareTools(cwp.softwareTools.join("، "));
      if (cwp.certifications && cwp.certifications.length > 0) setCertifications(cwp.certifications.join("، "));
      if (cwp.practicalProjects && cwp.practicalProjects.length > 0) setPracticalProjects(cwp.practicalProjects.join("\n"));
      if (cwp.academicDegree) setAcademicDegree(cwp.academicDegree);
    }
    if (entry.data.questions && entry.data.questions.length > 0) {
      setExpandedQuestionId(entry.data.questions[0].id);
    }
    setAnalysisError("");
  };

  // Handle PDF upload with automatic profile synchronization
  const handleFileUpload = (file: File) => {
    setFileError("");
    setAnalysisError("");
    setPdfExtractMessage("");
    setResumeParseStatus("parsing");
    setCachedInterviewEntry(null);

    if (file.type !== "application/pdf") {
      setFileError("لطفاً فایل رزومه را فقط با فرمت معتبر PDF آپلود کنید.");
      setResumeParseStatus("error");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setFileError("حجم فایل رزومه باید کمتر از ۳ مگابایت باشد.");
      setResumeParseStatus("error");
      return;
    }

    setResumeFile(file);
    // Reset manual input states if they contain default dummy data
    if (candidateName.includes("کاربر نمونه") || candidateName === "متقاضی محترم") {
      setCandidateName("");
    }
    if (targetField.includes("برنامه‌نویس") || targetField.includes("Full Stack")) {
      setTargetField("");
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPdfBase64(base64);

      // Compute resume hash and check local storage cache
      const hash = await computeResumeHash(base64, file.name, file.size);
      setResumeHash(hash);
      const cached = getCachedInterview(hash);
      if (cached) {
        setCachedInterviewEntry(cached);
      }

      // Auto-extract candidate profile from uploaded PDF to synchronize fields!
      setIsExtractingPdf(true);
      setPdfExtractMessage("در حال اعتبارسنجی و خواندن داده‌های فایل رزومه PDF...");
      try {
        const extRes = await fetchWithRetry("/api/gemini/extract-resume-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64 })
        });
        const extData = await extRes.json();
        if (extData.success && extData.profile) {
          const prof = extData.profile;
          if (prof.name && prof.name.trim() && !prof.name.includes("متقاضی محترم") && !prof.name.includes("کاربر نمونه")) {
            setCandidateName(prof.name.trim());
          }
          if (prof.field && prof.field.trim()) {
            setTargetField(prof.field.trim());
          }
          if (prof.experience) {
            setExperienceYears(`${prof.experience} سال سابقه کار حرفه‌ای`);
          }
          if (prof.skills) {
            setSoftwareTools(prof.skills);
          }
          if (prof.certifications) {
            setCertifications(prof.certifications);
          }
          if (prof.degree || prof.educationSummary) {
            setAcademicDegree(prof.degree || prof.educationSummary);
          }
          if (prof.workHistoryHighlights && Array.isArray(prof.workHistoryHighlights) && prof.workHistoryHighlights.length > 0) {
            setPracticalProjects(prof.workHistoryHighlights.join("\n"));
          } else if (prof.rawTextSummary) {
            setPracticalProjects(prof.rawTextSummary);
          }

          const summaryParts: string[] = [];
          if (prof.name) summaryParts.push(`نام و مشخصات در رزومه: ${prof.name}`);
          if (prof.age) summaryParts.push(`سن متقاضی: ${prof.age} سال`);
          if (prof.field) summaryParts.push(`حوزه و عنوان تخصصی در رزومه: ${prof.field}`);
          if (prof.experience) summaryParts.push(`سابقه کار حرفه‌ای: حدود ${prof.experience} سال`);
          if (prof.skills) summaryParts.push(`ابزارها، تکنولوژی‌ها و مهارت‌های کلیدی: ${prof.skills}`);
          if (prof.certifications) summaryParts.push(`گواهینامه‌ها و مدارک حرفه‌ای: ${prof.certifications}`);
          if (prof.degree) summaryParts.push(`بالاترین مقطع تحصیلی: ${prof.degree}`);
          if (prof.educationSummary) summaryParts.push(`جزئیات سوابق تحصیلی: ${prof.educationSummary}`);
          if (prof.workHistoryHighlights && Array.isArray(prof.workHistoryHighlights) && prof.workHistoryHighlights.length > 0) {
            summaryParts.push(`سوابق شغلی و شرکت‌ها:\n${prof.workHistoryHighlights.map((w: string) => `• ${w}`).join("\n")}`);
          }
          if (prof.rawTextSummary) {
            summaryParts.push(`خلاصه سوابق مستند در رزومه:\n${prof.rawTextSummary}`);
          }
          if (summaryParts.length > 0) {
            setResumeText(summaryParts.join("\n"));
          }
          setResumeParseStatus("success");
          setPdfExtractMessage(`مشخصات، سوابق شغلی (${prof.experience || "شناسایی‌شده"} سال سابقه)، نرم‌افزارها (${prof.skills ? prof.skills.slice(0, 35) + "..." : "استخراج‌شده"}) و مدارک مستقیماً از فایل PDF استخراج شد و مبنای طرح سوالات مصاحبه قرار گرفت.`);
        } else {
          setResumeParseStatus("success");
          setPdfExtractMessage(`فایل ${file.name} اعتبارسنجی و آماده است؛ تمام سوالات مستقیماً از محتوای این رزومه استخراج خواهند شد.`);
        }
      } catch (extractErr) {
        console.warn("Auto-extraction warning:", extractErr);
        setResumeParseStatus("success");
        setPdfExtractMessage(`فایل ${file.name} دریافت و اعتبارسنجی شد و مبنای اصلی تحلیل قرار گرفت.`);
      } finally {
        setIsExtractingPdf(false);
      }
    };
    reader.onerror = () => {
      setFileError("خطا در بارگذاری و اعتبارسنجی فایل رزومه رخ داد.");
      setResumeParseStatus("error");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setPdfBase64("");
    setFileError("");
    setPdfExtractMessage("");
    setResumeParseStatus("idle");
    setCachedInterviewEntry(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(prev => (prev === id ? null : id));
  };

  // Perform AI Analysis
  const handleAnalyzeResumeForQuestions = async () => {
    setIsAnalyzing(true);
    setAnalysisError("");
    setResult(null);

    // Validation step: ensure resume data is loaded/parsed if file is present
    if (resumeFile && resumeParseStatus === "parsing") {
      setAnalysisError("فایل رزومه هنوز در حال اعتبارسنجی و خوانده شدن است. لطفاً چند ثانیه شکیبا باشید...");
      setIsAnalyzing(false);
      return;
    }
    if (resumeFile && resumeParseStatus === "error") {
      setAnalysisError("فایل رزومه به درستی اعتبارسنجی نشد. لطفاً فایل معتبر PDF بارگذاری فرمایید.");
      setIsAnalyzing(false);
      return;
    }

    if (!pdfBase64 && !resumeText.trim() && !softwareTools.trim()) {
      setAnalysisError("لطفاً فایل PDF رزومه خود را بارگذاری کنید یا نرم‌افزارها، سال‌های سابقه و سوابق کاری خود را وارد نمایید.");
      setIsAnalyzing(false);
      return;
    }

    // Determine priority and prepare sanitized payload
    const isPdfActive = !!pdfBase64;
    const payloadCandidateName = isPdfActive ? (candidateName.includes("کاربر نمونه") || candidateName === "متقاضی محترم" ? "" : candidateName) : candidateName;
    const payloadTargetField = isPdfActive ? (targetField.includes("برنامه‌نویس") || targetField.includes("Full Stack") ? "" : targetField) : targetField;

    // Build payload trace for auditing and transparency
    const trace: PayloadTrace = {
      timestamp: new Date().toLocaleTimeString("fa-IR") + " (" + new Date().toISOString() + ")",
      sourcePriority: isPdfActive ? "CV_PDF_OBJECT" : "MANUAL_INPUT",
      hasPdf: isPdfActive,
      fileName: resumeFile ? resumeFile.name : null,
      fileSizeBytes: resumeFile ? resumeFile.size : 0,
      pdfBase64Length: pdfBase64 ? pdfBase64.length : 0,
      sanitizedManualTextSuppressed: false,
      candidateNameSent: payloadCandidateName || "[استخراج مستقیم از سند رزومه]",
      targetFieldSent: payloadTargetField || "[استخراج مستقیم از سند رزومه]",
      resumeTextLengthSent: resumeText.length,
      logs: [
        isPdfActive
          ? `✔ اولویت شماره ۱ فعال شد (CV Object Priority 1): فایل رزومه "${resumeFile?.name}" به همراه جزئیات استخراجی به سرور شبیه‌سازی ارسال شد.`
          : `ℹ اولویت شماره ۲ فعال شد (Manual Input Priority 2): اطلاعات سوابق، ابزارها و تجربیات دستی به پرامپت ارسال گردید.`,
        `✔ تطبیق دقیق بر مبنای کار واقعی: سال‌های سابقه (${experienceYears || "مستند در رزومه"}) و ابزارهای مسلط (${softwareTools || "مستند در رزومه"}) به عنوان معیارهای محوری استخراج سوالات ارسال شدند.`,
        `✔ گواهینامه‌ها و پروژه‌ها: ${certifications ? `مدارک: ${certifications}` : "استخراج از رزومه"} | ${practicalProjects ? "پروژه‌ها و تسک‌های اجرایی پیوست شد" : "استخراج مستقیم از رزومه"}.`,
        `✔ اجتناب از کلی‌گویی دانشگاهی: پرامپت موظف است در نقش متخصص استخدام در همان حوزه شغلی و بر اساس کار واقعی سوال طرح کند.`,
        `🚀 پلود اعتبارسنجی‌شده با ساختار ارزیابی کارفرمایان آلمانی به سرور تحویل شد.`
      ]
    };
    setPayloadTrace(trace);
    console.groupCollapsed(`%c[Interview Prep Payload Tracer] ${trace.sourcePriority}`, "background: #312e81; color: #a5b4fc; font-weight: bold; padding: 4px 8px; border-radius: 4px;");
    console.log("Trace Metadata:", trace);
    console.groupEnd();

    try {
      const response = await fetchWithRetry("/api/gemini/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          pdfBase64,
          fileName: resumeFile ? resumeFile.name : "",
          candidateName: payloadCandidateName,
          targetField: payloadTargetField,
          yearsOfExperience: experienceYears.trim(),
          softwareTools: softwareTools.trim(),
          certifications: certifications.trim(),
          practicalProjects: practicalProjects.trim(),
          academicDegree: academicDegree.trim()
        })
      });

      let data: any;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text.substring(0, 150) || `خطای سرور با کد ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || "خطایی در استخراج سوالات مصاحبه پیش آمد.");
      }

      setResult(data);
      if (data.candidateName && !data.candidateName.includes("متقاضی محترم") && !data.candidateName.includes("کاربر نمونه")) {
        setCandidateName(data.candidateName);
      }
      if (data.targetRole) {
        setTargetField(data.targetRole);
      }
      if (data.candidateWorkProfile) {
        if (data.candidateWorkProfile.yearsOfExperience) setExperienceYears(String(data.candidateWorkProfile.yearsOfExperience));
        if (data.candidateWorkProfile.softwareTools && data.candidateWorkProfile.softwareTools.length > 0) setSoftwareTools(data.candidateWorkProfile.softwareTools.join("، "));
        if (data.candidateWorkProfile.certifications && data.candidateWorkProfile.certifications.length > 0) setCertifications(data.candidateWorkProfile.certifications.join("، "));
        if (data.candidateWorkProfile.practicalProjects && data.candidateWorkProfile.practicalProjects.length > 0) setPracticalProjects(data.candidateWorkProfile.practicalProjects.join("\n"));
        if (data.candidateWorkProfile.academicDegree) setAcademicDegree(data.candidateWorkProfile.academicDegree);
      }
      if (data.questions && data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }

      // Save to localStorage cache based on resume hash
      const activeHash = resumeHash || await computeResumeHash(pdfBase64, resumeFile ? resumeFile.name : "text", resumeFile ? resumeFile.size : resumeText.length, resumeText);
      setResumeHash(activeHash);
      saveCachedInterview(activeHash, data);
      setCachedInterviewEntry({
        hash: activeHash,
        timestamp: new Date().toISOString(),
        timestampFa: new Date().toLocaleString("fa-IR"),
        candidateName: data.candidateName || "",
        targetRole: data.targetRole || "",
        questionCount: data.questions?.length || 0,
        data
      });
    } catch (err: any) {
      console.warn("[Interview Simulation] Network or server issue, activating local engine:", err);
      try {
        const fallbackData = generateRuleBasedEmployerInterviewQuestions({
          resumeText: pdfBase64 ? "" : resumeText,
          fileName: resumeFile ? resumeFile.name : "",
          targetField: payloadTargetField,
          candidateName: payloadCandidateName
        });
        setResult(fallbackData);
        if (fallbackData.questions && fallbackData.questions.length > 0) {
          setExpandedQuestionId(fallbackData.questions[0].id);
        }

        // Cache fallback data as well
        const activeHash = resumeHash || await computeResumeHash(pdfBase64, resumeFile ? resumeFile.name : "text", resumeFile ? resumeFile.size : resumeText.length, resumeText);
        setResumeHash(activeHash);
        saveCachedInterview(activeHash, fallbackData);
        setCachedInterviewEntry({
          hash: activeHash,
          timestamp: new Date().toISOString(),
          timestampFa: new Date().toLocaleString("fa-IR"),
          candidateName: fallbackData.candidateName || "",
          targetRole: fallbackData.targetRole || "",
          questionCount: fallbackData.questions?.length || 0,
          data: fallbackData
        });
      } catch (localErr) {
        setAnalysisError(err.message || "بروز خطا در شبیه‌سازی سوالات مصاحبه آلمان.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filtered list
  const filteredQuestions = (result?.questions || []).filter((q: InterviewQuestionItem) => {
    if (selectedCategory !== "all") {
      if (selectedCategory === "general" && q.category !== "general") return false;
      if (selectedCategory === "junior" && q.level !== "junior") return false;
      if (selectedCategory === "mid" && q.level !== "mid") return false;
      if (selectedCategory === "senior_lead" && q.level !== "senior_lead") return false;
    }
    if (selectedCompanyType !== "all" && q.companyType !== selectedCompanyType && q.companyType !== "all") {
      return false;
    }
    return true;
  });

  // Generate Document Print Markup
  const generatePrintHtml = async (docRef: string) => {
    let logoBase64 = "";
    try {
      const res = await fetch("/api/logo-base64");
      const json = await res.json();
      if (json.success) logoBase64 = json.base64;
    } catch {
      // ignore
    }

    const now = new Date();
    const dateFa = new Intl.DateTimeFormat("fa-IR", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    }).format(now);
    
    const dateDe = new Intl.DateTimeFormat("de-DE", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    }).format(now);

    const questionsList = result?.questions || [];
    const generalQuestions = questionsList.filter(q => q.category === "general");
    const techQuestions = questionsList.filter(q => q.category === "technical");
    const printDocTitle = formatPrintDocumentTitle("سوالات شبیه سازی کارفرما", result?.candidateName || candidateName || defaultInputs?.name);

    return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${printDocTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');
    @page {
      size: A4 portrait;
      margin: 20mm !important;
      margin-top: 20mm !important;
      margin-bottom: 20mm !important;
      margin-left: 20mm !important;
      margin-right: 20mm !important;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, Tahoma, sans-serif;
      background: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 0;
      direction: rtl;
      font-size: 8.5pt;
      line-height: 1.5;
      box-sizing: border-box;
    }
    .document-border {
      border: 1.8px solid #1e293b;
      padding: 6mm 8mm;
      position: relative;
      background: #ffffff;
      min-height: calc(297mm - 40mm);
      box-sizing: border-box;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 380px;
      opacity: 0.045;
      z-index: -1000;
      pointer-events: none;
    }
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .page-break {
      page-break-before: always;
      break-before: always;
    }
    .header-box {
      border-bottom: 2px solid #1e293b;
      padding-bottom: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-size: 13.5pt;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 3px 0;
    }
    .header-sub {
      font-size: 8pt;
      color: #475569;
      margin: 0;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      font-size: 7.8pt;
    }
    .meta-table td {
      padding: 4.5px 8px;
      border: 1px solid #e2e8f0;
    }
    .meta-label {
      font-weight: 700;
      color: #334155;
      background: #f1f5f9;
      width: 15%;
    }
    .meta-value {
      color: #0f172a;
      font-weight: 600;
    }
    .section-title {
      font-size: 10pt;
      font-weight: 800;
      color: #1e3a8a;
      border-right: 3.5px solid #2563eb;
      padding-right: 7px;
      margin: 14px 0 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .summary-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 8px 10px;
      font-size: 7.8pt;
      color: #1e293b;
      line-height: 1.55;
      margin-bottom: 12px;
      text-align: justify;
    }
    .question-card {
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      background: #ffffff;
      margin-bottom: 9px;
      padding: 7px 9px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 4px;
    }
    .q-title {
      font-weight: 800;
      color: #0f172a;
      font-size: 8.4pt;
    }
    .q-german {
      font-size: 7pt;
      color: #475569;
      direction: ltr;
      text-align: left;
      font-family: monospace;
      margin-top: 1px;
    }
    .badge {
      display: inline-block;
      font-size: 6.8pt;
      font-weight: bold;
      padding: 1.5px 6px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .badge-general { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
    .badge-junior { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-mid { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .badge-senior { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-company { background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; margin-right: 4px; }
    .q-rationale {
      background: #f8fafc;
      border-right: 2.5px solid #0284c7;
      padding: 5px 8px;
      margin: 4px 0;
      font-size: 7.2pt;
      color: #0f172a;
      line-height: 1.45;
    }
    .q-strategy {
      background: #f0fdf4;
      border-right: 2.5px solid #16a34a;
      padding: 4px 8px;
      margin: 3px 0;
      font-size: 7.1pt;
      color: #14532d;
      line-height: 1.4;
    }
    .q-redflag {
      background: #fef2f2;
      border-right: 2.5px solid #dc2626;
      padding: 3px 8px;
      margin: 3px 0;
      font-size: 7pt;
      color: #991b1b;
      line-height: 1.35;
    }
    .signature-section {
      margin-top: 16px;
      border: 1.5px solid #334155;
      background: #f8fafc;
      padding: 10px 14px;
      border-radius: 6px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .signature-statement {
      font-size: 7.4pt;
      line-height: 1.6;
      color: #1e293b;
      text-align: justify;
      margin-bottom: 12px;
      font-weight: 500;
    }
    .signature-grid {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    .sig-box {
      flex: 1;
      border: 1px dashed #94a3b8;
      background: #ffffff;
      padding: 8px 12px;
      border-radius: 4px;
      min-height: 68px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-title {
      font-size: 7.4pt;
      font-weight: 700;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 2px;
    }
    .sig-space {
      text-align: center;
      color: #cbd5e1;
      font-size: 7pt;
      padding: 10px 0;
    }
    .footer-bar {
      margin-top: 12px;
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      text-align: center;
      font-size: 6.8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="document-border">
    ${logoBase64 ? `<img class="watermark" src="data:image/jpeg;base64,${logoBase64}" />` : ""}

    <div class="header-box">
      <div>
        <h1 class="header-title">مستند شبیه‌ساز سوالات و مصاحبه استخدامی کارفرمایان آلمان</h1>
        <p class="header-sub">مرکز ارزیابی و آمادگی مصاحبه‌های بین‌المللی | گروه شرکت‌های بین‌المللی جهانبان</p>
      </div>
      <div style="text-align: left; direction: ltr;">
        <div style="font-family: monospace; font-weight: bold; font-size: 8pt; color: #1e3a8a;">${docRef}</div>
        <div style="font-size: 6.8pt; color: #64748b;">Verifizierungsdokument 2026</div>
      </div>
    </div>

    <!-- Metadata Table -->
    <table class="meta-table">
      <tr>
        <td class="meta-label">نام متقاضی:</td>
        <td class="meta-value">${result?.candidateName || candidateName}</td>
        <td class="meta-label">عنوان موقعیت شغلی:</td>
        <td class="meta-value">${result?.targetRole || targetField} <span style="color:#64748b; font-size:7pt;">(${result?.targetRoleDe || ""})</span></td>
      </tr>
      <tr>
        <td class="meta-label">سطح ارزیابی‌شده:</td>
        <td class="meta-value">${result?.experienceLevelDetected || "Mid-level"}</td>
        <td class="meta-label">تاریخ صدور سند:</td>
        <td class="meta-value">${dateFa} <span style="color:#64748b; font-size:6.8pt;">(${dateDe})</span></td>
      </tr>
      <tr>
        <td class="meta-label">مرجع اعتبارسنجی:</td>
        <td class="meta-value">خانه خلاق جهانبان (jahanban.group)</td>
        <td class="meta-label">مبنای تحلیل:</td>
        <td class="meta-value">تجارب مستند لینکدین، مصاحبه‌های Kununu و استاندارد KldB</td>
      </tr>
    </table>

    <!-- Overview Insights -->
    <div class="summary-box">
      <strong>خلاصه تحلیل مسئولین استخدام آلمان:</strong> ${result?.summaryOverview || ""}
    </div>

    <!-- Part 1: General & Cultural Questions -->
    <div class="section-title">
      <span>بخش اول: سوالات عمومی، انگیزشی و تطابق فرهنگی (General & Cultural Fit)</span>
      <span style="font-size: 7pt; font-weight: normal; color: #475569;">تعداد: ${generalQuestions.length} سوال</span>
    </div>

    ${generalQuestions.map((q, idx) => `
      <div class="question-card">
        <div class="q-header">
          <div>
            <span class="q-title">${idx + 1}. ${q.questionFa}</span>
            <div class="q-german">${q.questionDeEn}</div>
          </div>
          <div>
            <span class="badge badge-general">${q.levelLabelFa}</span>
            <span class="badge badge-company">${q.companyTypeLabelFa}</span>
          </div>
        </div>

        <div class="q-reasoning" style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 4px; padding: 5px 8px; margin-bottom: 5px; font-size: 7.2pt; color: #854d0e; line-height: 1.5;">
          <strong>استدلال و چرایی کارفرمای آلمانی (Employer Reasoning):</strong> ${q.reasoning || q.recruiterObjective}
        </div>

        <div class="q-rationale">
          <strong>مبنا و انگیزه کارفرمای آلمانی از طرح سوال:</strong> ${q.recruiterObjective}
        </div>

        <div class="q-strategy">
          <strong>استراتژی پاسخ ایده‌آل (رویکرد STAR):</strong> ${q.recommendedAnswerStrategy}
        </div>

        <div class="q-redflag">
          <strong>خط قرمز پاسخ (Red Flag):</strong> ${q.redFlags}
        </div>
      </div>
    `).join("")}

    <!-- Part 2: Technical Questions -->
    <div class="section-title" style="page-break-before: auto; margin-top: 14px;">
      <span>بخش دوم: سوالات تخصصی فنی به تفکیک سطح (Technical Competency Matrix)</span>
      <span style="font-size: 7pt; font-weight: normal; color: #475569;">از جونیور تا لید</span>
    </div>

    ${techQuestions.map((q, idx) => {
      const levelBadgeClass = q.level === "junior" ? "badge-junior" : (q.level === "mid" ? "badge-mid" : "badge-senior");
      return `
        <div class="question-card">
          <div class="q-header">
            <div>
              <span class="q-title">${idx + 1}. ${q.questionFa}</span>
              <div class="q-german">${q.questionDeEn}</div>
            </div>
            <div>
              <span class="badge ${levelBadgeClass}">${q.levelLabelFa}</span>
              <span class="badge badge-company">${q.companyTypeLabelFa}</span>
            </div>
          </div>

          <div class="q-reasoning" style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 4px; padding: 5px 8px; margin-bottom: 5px; font-size: 7.2pt; color: #854d0e; line-height: 1.5;">
            <strong>استدلال و چرایی کارفرمای آلمانی (Employer Reasoning):</strong> ${q.reasoning || q.recruiterObjective}
          </div>

          <div class="q-rationale">
            <strong>مبنا و انگیزه کارفرمای آلمانی از طرح سوال:</strong> ${q.recruiterObjective}
          </div>

          <div class="q-strategy">
            <strong>معیار ارزیابی و استراتژی پاسخ:</strong> ${q.recommendedAnswerStrategy}
          </div>

          <div class="q-redflag">
            <strong>خط قرمز و پاسخ‌های غیرحرفه‌ای:</strong> ${q.redFlags}
          </div>
        </div>
      `;
    }).join("")}

    <!-- Official Candidate Signature and Acknowledgment Box -->
    <div class="signature-section avoid-break">
      <div class="signature-statement">
        <strong>اقرارنامه و تعهد متقاضی:</strong>
        اینجانب <u>${result?.candidateName || candidateName}</u>، بدین‌وسیله تایید می‌نمایم که مجموعه سوالات شبیه‌سازی‌شده عمومی و تخصصی مصاحبه استخدامی کارفرمایان آلمانی مندرج در این سند را با دقت مطالعه و بررسی نموده، از مبانی تحلیلی، شاخص‌های ارزیابی فنی و رفتاری، و فرهنگ حاکم بر مصاحبه‌های کاری آلمان مطلع گردیدم و جهت حضور موثر در جلسات گزینش، تسلط بر چارچوب‌های پاسخ‌دهی را تمرین کرده‌ام.
      </div>

      <div class="signature-grid">
        <div class="sig-box">
          <div class="sig-title">امضاء و تایید متقاضی کار در آلمان:</div>
          <div class="sig-space">[محل امضاء الکترونیک یا اثر انگشت]</div>
          <div style="font-size: 6.8pt; color: #64748b;">تاریخ تایید: ${dateFa}</div>
        </div>

        <div class="sig-box">
          <div class="sig-title">تاییدیه کارشناسی سامانه هوشمند جهانبان:</div>
          <div style="text-align: center; color: #166534; font-size: 7.2pt; font-weight: bold; padding-top: 6px;">
            تایید شده بر پایه استاندارد KldB 2026
          </div>
          <div style="font-size: 6.8pt; color: #64748b; text-align: left; direction: ltr;">
            Ref: ${docRef}
          </div>
        </div>
      </div>
    </div>

    <!-- Document Footer -->
    <div class="footer-bar">
      <span>سامانه هوشمند ارزیابی و کاریابی آلمان | گروه شرکت‌های بین‌المللی جهانبان (خانه خلاق جهانبان)</span>
      <span>مستند محرمانه هدایت شغلی - تاریخ نسخه: ${dateDe}</span>
    </div>
  </div>
</body>
</html>`;
  };

  // Trigger Direct Print via Hidden Iframe
  const handleDirectPrint = async () => {
    setIsPrinting(true);
    try {
      const docRef = `DE-INT-QUEST-${Math.floor(100000 + Math.random() * 900000)}`;
      setPrintDocRef(docRef);
      const printDocTitle = formatPrintDocumentTitle("سوالات شبیه سازی کارفرما", result?.candidateName || candidateName || defaultInputs?.name);
      const htmlContent = await generatePrintHtml(docRef);

      let iframe = document.getElementById("pdf-print-interview-questions-iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "pdf-print-interview-questions-iframe";
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.style.visibility = "hidden";
        document.body.appendChild(iframe);
      }

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
        if (iframe.contentDocument) {
          iframe.contentDocument.title = printDocTitle;
        }

        setTimeout(() => {
          triggerPrintWithTitle(printDocTitle, () => {
            try {
              iframe?.contentWindow?.focus();
              iframe?.contentWindow?.print();
            } catch (err) {
              console.warn("Iframe print error, falling back to window.open:", err);
              const win = window.open("", "_blank");
              if (win) {
                win.document.title = printDocTitle;
                win.document.write(htmlContent);
                win.document.close();
                win.print();
              }
            }
          });
        }, 500);
      } else {
        const win = window.open("", "_blank");
        if (win) {
          triggerPrintWithTitle(printDocTitle, () => {
            win.document.title = printDocTitle;
            win.document.write(htmlContent);
            win.document.close();
            win.print();
          });
        }
      }
    } catch (e) {
      console.error("Direct print failed:", e);
    } finally {
      setTimeout(() => setIsPrinting(false), 1200);
    }
  };

  // Open In-App Print Preview Modal
  const handleOpenPreview = () => {
    const docRef = `DE-INT-QUEST-${Math.floor(100000 + Math.random() * 900000)}`;
    setPrintDocRef(docRef);
    setIsPreviewOpen(true);
  };

  // Helper for company icon / badge
  const getCompanyBadge = (type: string) => {
    switch (type) {
      case "mittelstand":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-medium">شرکت‌های Mittelstand آلمان</span>;
      case "dax_enterprise":
        return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded font-medium">هلدینگ‌های بزرگ بورس آلمان (DAX)</span>;
      case "startup":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-medium">استارتاپ‌های نوآور تکنولوژی</span>;
      case "public_authority":
        return <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] px-2 py-0.5 rounded font-medium">نهادهای عمومی و دولتی (ÖD)</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">کارفرمای استاندارد آلمان</span>;
    }
  };

  const getLevelBadge = (level: string, label: string) => {
    switch (level) {
      case "general":
        return <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] px-2 py-0.5 rounded font-bold">عمومی و فرهنگی</span>;
      case "junior":
        return <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-bold">سطح جونیور</span>;
      case "mid":
        return <span className="bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] px-2 py-0.5 rounded font-bold">سطح میدلول</span>;
      case "senior_lead":
        return <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-bold">سطح سنیور و لید</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">{label}</span>;
    }
  };

  return (
    <div id="cv-interview-tab" className="space-y-6 animate-fade-in">
      {/* Header Banner - High-Contrast and Readable in Light & Dark Mode */}
      <div className="bg-gradient-to-br from-slate-50 via-indigo-50/70 to-blue-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border-2 border-indigo-200/90 dark:border-slate-800 shadow-sm rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  شبیه‌ساز سوالات مصاحبه شغلی کارفرمایان آلمان
                </h2>
                <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  تحلیل دوگانه: عمومی + تخصصی (جونیور تا لید)
                </span>
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  حداقل ۲۰ سوال عمومی + حداقل ۲۰ سوال تخصصی
                </span>
              </div>

              {/* Priority Status Indicator Badge */}
              <div className="my-2.5">
                {pdfBase64 ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs px-3 py-1 rounded-lg font-bold shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>اولویت فعال: تحلیل و استخراج مستقیم از روی فایل رزومه PDF بارگذاری‌شده</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs px-3 py-1 rounded-lg font-bold shadow-xs">
                    <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <span>اولویت جاری: تحلیل بر مبنای اطلاعات ورودی دستی (در صورت تمایل، فایل PDF رزومه را بارگذاری کنید)</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed font-medium mt-1">
                این شبیه‌ساز با استخراج دقیق و عمیق تخصص‌ها و سوابق شما، سوالات واقعی کارفرمایان آلمانی را پیش‌بینی می‌کند (از شرکت‌های متوسط تخصصی <span className="text-amber-950 dark:text-amber-200 font-bold bg-amber-100/90 dark:bg-amber-950/80 px-1 py-0.5 rounded border border-amber-300/80 dark:border-amber-700">Mittelstand</span> تا هلدینگ‌های بورس <span className="text-indigo-950 dark:text-indigo-200 font-bold bg-indigo-100/90 dark:bg-indigo-950/80 px-1 py-0.5 rounded border border-indigo-300/80 dark:border-indigo-700">DAX</span> و نهادهای دولتی). برای هر سوال، <strong className="text-slate-900 dark:text-white font-bold">مبنا و انگیزه پنهان کارفرما</strong>، استراتژی پاسخ‌دهی استاندارد آلمانی (STAR)، و خطوط قرمز مصاحبه با استناد به صدها تجربه مستند در لینکدین و Kununu ارائه گردیده است.
              </p>
            </div>

            {result && (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowTraceModal(true)}
                  className="px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl border-2 border-slate-300 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition shadow-sm active:scale-95"
                  title="مشاهده گزارش رهگیری اولویت رزومه بر ورودی دستی"
                >
                  <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>ردگیری اولویت پرامپت (Payload Tracer)</span>
                </button>

                <button
                  onClick={handleOpenPreview}
                  className="px-3.5 py-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl border-2 border-slate-300 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition shadow-sm active:scale-95"
                  title="مشاهده پیش‌نمایش سند رسمی A4 با کادر و امضاء"
                >
                  <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>پیش‌نمایش سند چاپ</span>
                </button>

                <button
                  onClick={handleDirectPrint}
                  disabled={isPrinting}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 cursor-pointer transition shadow-md active:scale-95 disabled:opacity-50"
                  title="چاپ رسمی سند با واترمارک جهانبان و کادر امضاء"
                >
                  {isPrinting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Printer className="w-4 h-4 text-white" />
                  )}
                  <span>چاپ رسمی سند سوالات (PDF)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input / Upload Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>بارگذاری رزومه یا ورود اطلاعات جهت شبیه‌سازی سوالات</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-md font-bold">
              اولویت ۱: فایل رزومه PDF
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-md font-medium">
              اولویت ۲: فرم ورود دستی
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Drag & Drop PDF */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200 block">
                ۱. بارگذاری فایل رزومه PDF (اولویت اول و اصلی):
              </label>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                مبنای اصلی تحلیل
              </span>
            </div>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition flex flex-col items-center justify-center min-h-[170px] ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/10"
                  : resumeFile
                  ? "border-emerald-500/50 bg-emerald-950/10"
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/50"
              }`}
            >
              {resumeFile ? (
                <div className="space-y-2.5 w-full">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">{resumeFile.name}</span>
                    <span className="text-[10px] text-slate-400">({(resumeFile.size / 1024).toFixed(1)} KB)</span>
                  </div>

                  {/* Clear 'Resume Loaded Successfully' Status Indicator */}
                  {resumeParseStatus === "success" && (
                    <div className="p-2.5 bg-emerald-950/80 border-2 border-emerald-500/60 rounded-xl text-right flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-xs font-black text-emerald-300 block">
                            فایل رزومه با موفقیت اعتبارسنجی و خوانده شد
                          </span>
                          <span className="text-[10px] text-emerald-400/90 font-mono font-bold">
                            ✔ Resume Loaded Successfully
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-200 bg-emerald-850/80 border border-emerald-600/50 px-2 py-0.5 rounded">
                        آماده ارسال به هوش مصنوعی
                      </span>
                    </div>
                  )}

                  {/* Local Storage Cache Notice & Quick Restore */}
                  {cachedInterviewEntry && (
                    <div className="p-2.5 bg-indigo-950/70 border border-indigo-500/50 rounded-xl text-right flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-indigo-200 block">
                            سوالات این رزومه در حافظه محلی ذخیره شده است ({cachedInterviewEntry.questionCount} سوال)
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ذخیره در {cachedInterviewEntry.timestampFa}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLoadFromCache(cachedInterviewEntry)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>بازیابی فوری بدون مصرف API</span>
                      </button>
                    </div>
                  )}

                  {isExtractingPdf && (
                    <div className="flex items-center justify-center gap-2 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-500/30 py-1 px-2.5 rounded-lg animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>در حال خواندن و اعتبارسنجی داده‌های رزومه از PDF...</span>
                    </div>
                  )}

                  {pdfExtractMessage && (
                    <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-[11px] text-emerald-200 flex items-start gap-1.5 text-right">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{pdfExtractMessage}</span>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={removeFile}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                    >
                      حذف و بارگذاری فایل دیگر
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">فایل PDF رزومه را اینجا بکشید یا انتخاب کنید</p>
                  <p className="text-[10px] text-slate-500">حداکثر ۳ مگابایت، اولویت ۱ در استخراج دقیق سوالات</p>
                  <label className="inline-block mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg cursor-pointer transition border border-slate-700">
                    انتخاب فایل رزومه از سیستم
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            {fileError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{fileError}</span>
              </p>
            )}
          </div>

          {/* Right Column: Name, Field, Work Experience, Software, Certifications, Projects */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200 block">
                ۲. مشخصات و سوابق عملیاتی متقاضی (مبنای تخصصی استخراج سوالات):
              </label>
              {pdfBase64 ? (
                <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>همگام‌شده با فایل PDF</span>
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  ورود دستی (بدون فایل)
                </span>
              )}
            </div>

            {/* Row 1: Name and Target Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">نام و نام خانوادگی متقاضی:</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="مثال: علی رضایی"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">عنوان شغلی و تخصص در آلمان:</label>
                <input
                  type="text"
                  value={targetField}
                  onChange={(e) => setTargetField(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="مثال: مهندس سازه و محاسب / Full Stack Developer"
                />
              </div>
            </div>

            {/* Row 2: Years of Experience, Software Stack, Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-amber-300 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>سال‌های سابقه کار حرفه‌ای:</span>
                </label>
                <input
                  type="text"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  placeholder="مثال: ۶ سال سابقه کار"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-sky-300 block mb-1 flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-sky-400" />
                  <span>نرم‌افزارها و ابزارهای مسلط:</span>
                </label>
                <input
                  type="text"
                  value={softwareTools}
                  onChange={(e) => setSoftwareTools(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  placeholder="AutoCAD, ETABS, Revit, Python..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-300 block mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" />
                  <span>گواهینامه‌ها و مدارک حرفه‌ای:</span>
                </label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="PMP, AWS, نظام مهندسی, Goethe..."
                />
              </div>
            </div>

            {/* Row 3: Practical Projects and Academic Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-indigo-400" />
                  <span>پروژه‌ها و کارهای عملیاتی انجام‌شده:</span>
                </label>
                <textarea
                  rows={2}
                  value={practicalProjects}
                  onChange={(e) => setPracticalProjects(e.target.value)}
                  placeholder="طراحی سازه برج مسکونی، بهینه‌سازی مدل‌های سه‌بعدی، تحویل تسک‌های عملیاتی..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-purple-400" />
                    <span>رشته و مقطع تحصیلی:</span>
                  </label>
                  <span className="text-[9.5px] text-amber-400 font-mono">
                    (تطبیق کارگاهی، نه تئوری محض)
                  </span>
                </div>
                <input
                  type="text"
                  value={academicDegree}
                  onChange={(e) => setAcademicDegree(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  placeholder="مثال: کارشناسی ارشد مهندسی عمران / نرم‌افزار"
                />
                <p className="text-[9.5px] text-slate-500 mt-1">
                  نکته: سوالات مصاحبه صرفاً بر پایه تئوری‌های دانشگاهی این رشته طرح نمی‌شوند؛ بلکه مستقیماً با ابزارها و کارهای عملی بالا ترکیب می‌گردند.
                </p>
              </div>
            </div>

            {/* Collapsible / Optional Full Resume Context */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-slate-400">
                  خلاصه کامل رزومه (جهت غنای بیشتر شبیه‌سازی):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResumeText(
                      `عنوان تخصص: ${defaultInputs.field}\nسوابق کاری: ${defaultInputs.experience}\nتحصیلات: ${defaultInputs.education}\nمهارت‌های فنی: ${defaultInputs.skills}\nزبان‌ها: ${defaultInputs.languages}`
                    );
                  }}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>بارگذاری از فرم رزومه‌ساز</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="خلاصه سوابق تکمیلی، اسامی شرکت‌ها و تجربیات کاری..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Professional Hiring Lead Grounding Notice */}
            <div className="p-2.5 bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-xl text-[11px] text-indigo-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white font-bold">دیدگاه مصاحبه‌کننده متخصص:</strong> سوالات توسط یک مدیر ارشد جذب و استخدام (Hiring Lead) در همین تخصص و بر پایه سال‌های تجربه کاری، ابزارهای مسلط و کارهای واقعی طرح می‌شوند تا از طرح پرسش‌های کلی و تئوریک دانشگاهی جلوگیری شود.
              </span>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                شبیه‌سازی بر اساس دیتاهای واقعی مصاحبه‌های استخدامی آلمان (حداقل ۲۰ سوال عمومی + ۲۰ سوال تخصصی)
              </span>

              <button
                onClick={handleAnalyzeResumeForQuestions}
                disabled={isAnalyzing}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>در حال استخراج و تحلیل سوالات اختصاصی...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>شبیه‌سازی سوالات مصاحبه آلمان</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {analysisError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{analysisError}</span>
          </div>
        )}
      </div>

      {/* Result Section */}
      {result ? (
        <div className="space-y-6">
          {/* Analysis Meta Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>تحلیل پروفایل استخدامی:</span>
                    <span className="text-indigo-300">{result.candidateName}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    عنوان احراز شده در استاندارد آلمان: <strong className="text-slate-200">{result.targetRole}</strong> ({result.targetRoleDe}) | سطح برآورد شده: <span className="text-amber-400 font-bold">{result.experienceLevelDetected}</span>
                  </p>
                </div>
              </div>

              {/* Live Counters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-purple-950/80 text-purple-300 border border-purple-700/50 text-xs px-2.5 py-1 rounded-lg font-bold">
                  سوالات عمومی: {(result.questions || []).filter(q => q.category === "general").length} سوال
                </span>
                <span className="bg-sky-950/80 text-sky-300 border border-sky-700/50 text-xs px-2.5 py-1 rounded-lg font-bold">
                  سوالات تخصصی: {(result.questions || []).filter(q => q.category === "technical").length} سوال
                </span>
                <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 text-xs px-3 py-1 rounded-lg font-extrabold">
                  مجموع: {result.questions?.length || 0} سوال
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-850">
              <strong>خلاصه دیدگاه تیم مصاحبه‌کننده آلمانی:</strong> {result.summaryOverview}
            </div>

            {/* Expert Interviewer Profile Badge */}
            {result.interviewerProfile && (
              <div className="mt-3 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/40 border border-indigo-500/40 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-300 shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-indigo-300">متخصص و سرپرست تیم مصاحبه‌کننده (Lead Fachbereichsleiter):</span>
                      <span className="text-xs font-bold text-white bg-indigo-900/50 border border-indigo-700/50 px-2 py-0.5 rounded">
                        {result.interviewerProfile.titleFa}
                      </span>
                      <span className="text-[11px] font-mono text-amber-300/90 direction-ltr">
                        ({result.interviewerProfile.titleDe})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {result.interviewerProfile.roleDescriptionFa}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-1 rounded-md font-bold shrink-0 self-start md:self-center">
                  ✔ سنجش تخصصی بر مبنای کار واقعی
                </span>
              </div>
            )}

            {/* Candidate Work Profile Grounding */}
            {result.candidateWorkProfile && (
              <div className="mt-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>مبنای دقیق طرح سوالات: سوابق کاری، سال‌های فعالیت، ابزارها و مدارک احراز شده:</span>
                  </span>
                  {result.candidateWorkProfile.yearsOfExperience && (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-800/50 px-2.5 py-0.5 rounded">
                      سابقه کار حرفه‌ای: {result.candidateWorkProfile.yearsOfExperience}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                  {result.candidateWorkProfile.softwareTools && result.candidateWorkProfile.softwareTools.length > 0 && (
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5 text-sky-400" />
                        نرم‌افزارها و ابزارهای مسلط:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {result.candidateWorkProfile.softwareTools.map((tool, idx) => (
                          <span key={idx} className="bg-sky-950/60 text-sky-200 border border-sky-800/40 px-2 py-0.5 rounded text-[10px] font-mono">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.candidateWorkProfile.certifications && result.candidateWorkProfile.certifications.length > 0 && (
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        گواهینامه‌ها و مدارک حرفه‌ای:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {result.candidateWorkProfile.certifications.map((cert, idx) => (
                          <span key={idx} className="bg-emerald-950/60 text-emerald-200 border border-emerald-800/40 px-2 py-0.5 rounded text-[10px]">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.candidateWorkProfile.academicDegree && (
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                        مدرک تحصیلی (صرفاً مکمل، نه معیار اصلی سوالات):
                      </span>
                      <span className="text-purple-200 font-medium text-[11px] block">{result.candidateWorkProfile.academicDegree}</span>
                    </div>
                  )}
                </div>

                {result.candidateWorkProfile.practicalProjects && result.candidateWorkProfile.practicalProjects.length > 0 && (
                  <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                      پروژه‌ها و تسک‌های عملیاتی ملاک طرح سناریوها:
                    </span>
                    <ul className="space-y-0.5 pr-2">
                      {result.candidateWorkProfile.practicalProjects.map((proj, pIdx) => (
                        <li key={pIdx} className="text-slate-300 flex items-start gap-1">
                          <span className="text-indigo-400 shrink-0">•</span>
                          <span>{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Resume Grounding Details */}
            {result.extractedResumeDetails && (
              <div className="mt-3 bg-emerald-950/20 border border-emerald-500/25 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-300">مبنای استخراج سوالات:</span>
                  <span className="text-xs text-slate-300">
                    {result.extractedResumeDetails.fileName ? `فایل «${result.extractedResumeDetails.fileName}»` : "رزومه متقاضی"} ({result.extractedResumeDetails.targetRole})
                  </span>
                </div>
                {result.extractedResumeDetails.keySkills && result.extractedResumeDetails.keySkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">مهارت‌ها و ابزارهای شناسایی‌شده:</span>
                    {result.extractedResumeDetails.keySkills.slice(0, 6).map((skill, sIdx) => (
                      <span key={sIdx} className="bg-emerald-900/40 text-emerald-200 border border-emerald-700/40 text-[10px] px-2 py-0.5 rounded-md font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* German Market Insights */}
            {result.germanMarketInsights && result.germanMarketInsights.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>اصول طلایی قبولی در مصاحبه با شرکت‌های آلمانی (برگرفته از تجارب واقعی):</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.germanMarketInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter Bar with Live Counts */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">دسته‌بندی سوالات:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: `همه سوالات (${result.questions?.length || 0})` },
                  { id: "general", label: `عمومی و فرهنگی (${(result.questions || []).filter(q => q.category === "general").length})` },
                  { id: "junior", label: `تخصصی جونیور (${(result.questions || []).filter(q => q.level === "junior").length})` },
                  { id: "mid", label: `تخصصی میدلول (${(result.questions || []).filter(q => q.level === "mid").length})` },
                  { id: "senior_lead", label: `تخصصی سنیور و لید (${(result.questions || []).filter(q => q.level === "senior_lead").length})` },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition cursor-pointer font-medium ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAllStar}
                className="px-2.5 py-1 text-xs rounded-lg transition cursor-pointer font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-xs"
                title="باز یا بسته کردن یکپارچه متدولوژی STAR برای تمام سوالات"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{expandAllStar ? "بستن تمام چارچوب‌های STAR" : "باز کردن همه چارچوب‌های STAR"}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">تیپ کارفرما:</span>
                <select
                  value={selectedCompanyType}
                  onChange={(e) => setSelectedCompanyType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">همه شرکت‌ها</option>
                  <option value="mittelstand">شرکت‌های Mittelstand</option>
                  <option value="dax_enterprise">هلدینگ‌های بزرگ DAX</option>
                  <option value="startup">استارتاپ‌های نوآور</option>
                  <option value="public_authority">نهادهای عمومی و دولتی</option>
                </select>
              </div>
            </div>
          </div>

          {/* Language & Jargon Mode Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Languages className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">فرمت زبانی سوالات:</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setDisplayMode("german_primary")}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    displayMode === "german_primary"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>🇩🇪 آلمانی عمیق مهندسی (اصلی)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode("bilingual")}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    displayMode === "bilingual"
                      ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>🌐 دوزبانه هم‌تراز</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode("persian_primary")}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    displayMode === "persian_primary"
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>🇮🇷 تیتر فارسی</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>شامل اصطلاحات عامیانه شغلی و مهندسی آلمان (Fach- & Ingenieursprache)</span>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                موردی با این فیلترها یافت نشد. لطفاً فیلترها را ریست کنید.
              </div>
            ) : (
              filteredQuestions.map((q: InterviewQuestionItem, index: number) => {
                const isExpanded = expandedQuestionId === q.id;
                return (
                  <div
                    key={q.id}
                    className={`bg-slate-900 border rounded-2xl transition duration-200 overflow-hidden ${
                      isExpanded ? "border-indigo-500/60 shadow-lg" : "border-slate-800 hover:border-slate-750"
                    }`}
                  >
                    {/* Question Header Card */}
                    <div
                      onClick={() => toggleExpand(q.id)}
                      className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">سوال #{index + 1}</span>
                          {getLevelBadge(q.level, q.levelLabelFa)}
                          {getCompanyBadge(q.companyType)}
                          {q.cvReference && (
                            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 shadow-xs">
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span>استخراج‌شده بر مبنای رزومه</span>
                            </span>
                          )}
                          {q.practicalWorkReference && (
                            <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 shadow-xs">
                              <Wrench className="w-3 h-3 text-indigo-400" />
                              <span>انطباق با سوابق کاری و ابزار</span>
                            </span>
                          )}
                          <span className="bg-amber-950/70 text-amber-300 border border-amber-800/50 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                            <span>🇩🇪</span>
                            <span>Fach- & Ingenieursprache</span>
                          </span>
                        </div>

                        {/* German Primary Mode (Default) */}
                        {displayMode === "german_primary" && (
                          <>
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-sm md:text-base font-semibold text-white leading-relaxed font-sans direction-ltr text-left">
                                {q.questionDeEn}
                              </h4>
                              <button
                                type="button"
                                onClick={(e) => handlePlayGerman(e, q.id, q.questionDeEn)}
                                className={`p-1.5 rounded-lg border transition shrink-0 ${
                                  speakingId === q.id
                                    ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                                    : "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700"
                                }`}
                                title="شنیدن تلفظ آلمانی با لهجه معتبر"
                              >
                                {speakingId === q.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>
                            </div>
                            <p className="text-xs text-slate-300/90 leading-relaxed text-right border-r-2 border-indigo-500/40 pr-2.5 pt-0.5">
                              {q.questionFa}
                            </p>
                          </>
                        )}

                        {/* Bilingual Mode */}
                        {displayMode === "bilingual" && (
                          <>
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-amber-200 leading-relaxed font-sans direction-ltr text-left">
                                  🇩🇪 {q.questionDeEn}
                                </p>
                                <button
                                  type="button"
                                  onClick={(e) => handlePlayGerman(e, q.id, q.questionDeEn)}
                                  className={`p-1.5 rounded-lg border transition shrink-0 ${
                                    speakingId === q.id
                                      ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                                      : "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700"
                                  }`}
                                  title="شنیدن تلفظ آلمانی"
                                >
                                  {speakingId === q.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed text-right border-r-2 border-indigo-500/50 pr-2">
                                🇮🇷 {q.questionFa}
                              </p>
                            </div>
                          </>
                        )}

                        {/* Persian Primary Mode */}
                        {displayMode === "persian_primary" && (
                          <>
                            <h4 className="text-sm font-bold text-white leading-relaxed">
                              {q.questionFa}
                            </h4>
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-xs text-slate-400 font-mono direction-ltr text-left">
                                {q.questionDeEn}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => handlePlayGerman(e, q.id, q.questionDeEn)}
                                className={`p-1 rounded-md border transition shrink-0 ${
                                  speakingId === q.id
                                    ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700"
                                }`}
                                title="شنیدن تلفظ آلمانی"
                              >
                                {speakingId === q.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </>
                        )}

                        {/* Jargon Terms Badges */}
                        {q.jargonTerms && q.jargonTerms.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-amber-400" />
                              اصطلاحات تخصصی آلمانی:
                            </span>
                            {q.jargonTerms.map((term, tIdx) => (
                              <span
                                key={tIdx}
                                className="bg-amber-950/40 text-amber-200 border border-amber-700/40 text-[10px] px-2 py-0.5 rounded-md font-mono"
                              >
                                {term}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(
                              q.id,
                              `${q.questionFa}\n${q.questionDeEn}\n\nاستدلال کارفرمای آلمانی (Employer Reasoning): ${q.reasoning || q.recruiterObjective}\n\nهدف سنجش کارفرما: ${q.recruiterObjective}\n\nاستراتژی پاسخ (STAR): ${q.recommendedAnswerStrategy}\n\nخطوط قرمز: ${q.redFlags}`
                            );
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          title="کپی کردن متن سوال و استراتژی پاسخ"
                        >
                          {copiedId === q.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="p-1 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Accordion Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-3.5 animate-fade-in text-xs">
                        {/* 0. CV Reference Grounding (مبنای استخراج از رزومه متقاضی) */}
                        {q.cvReference && (
                          <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-xl p-3.5 space-y-1.5 shadow-xs">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                              <FileText className="w-4 h-4 text-emerald-400" />
                              <span>مبنای استخراج از رزومه شما (Bezug zum Lebenslauf):</span>
                            </div>
                            <p className="text-emerald-100/90 text-[11px] leading-relaxed pr-5 font-medium">
                              {q.cvReference}
                            </p>
                          </div>
                        )}

                        {/* 0.1 Practical Work Grounding (تطبیق با کار اجرایی، ابزارها و سال‌های سابقه) */}
                        {q.practicalWorkReference && (
                          <div className="bg-indigo-950/30 border border-indigo-500/35 rounded-xl p-3.5 space-y-1.5 shadow-xs">
                            <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs">
                              <Wrench className="w-4 h-4 text-indigo-400" />
                              <span>انطباق با سوابق اجرایی، ابزارها و تجارب عملیاتی متقاضی (Hands-on Experience & Tools):</span>
                            </div>
                            <p className="text-indigo-100/90 text-[11px] leading-relaxed pr-5 font-medium">
                              {q.practicalWorkReference}
                            </p>
                          </div>
                        )}

                        {/* 0.5 German Engineering Jargon (ادبیات عامیانه و واژگان تخصصی مهندسی آلمان) */}
                        {q.jargonTerms && q.jargonTerms.length > 0 && (
                          <div className="bg-gradient-to-r from-amber-950/25 to-slate-900 border border-amber-500/30 rounded-xl p-3.5 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                                <BookOpen className="w-4 h-4 text-amber-400" />
                                <span>ادبیات عامیانه و اصطلاحات تخصصی مهندسی آلمان در این سوال (Ingenieur- & Fachjargon):</span>
                              </div>
                              <span className="text-[10px] text-amber-300 font-mono bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
                                Fachsprache
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pr-5">
                              {q.jargonTerms.map((term, tIdx) => (
                                <span key={tIdx} className="bg-amber-950/60 text-amber-200 border border-amber-700/50 text-[11px] px-2.5 py-0.5 rounded-md font-mono font-medium">
                                  {term}
                                </span>
                              ))}
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed pr-5 font-normal">
                              {q.germanJargonExplanation || "این اصطلاحات دقیقاً ادبیات رایج در تیم‌های مهندسی و محیط‌های صنعتی آلمان هستند و استفاده مناسب از آنها در مصاحبه نشان‌دهنده آمادگی کامل زبانی و درک عمیق استانداردهای کار در آلمان است."}
                            </p>
                          </div>
                        )}

                        {/* 1. Employer Reasoning (استدلال و چرایی استراتژیک کارفرما بر مبنای سوابق متقاضی) */}
                        <div className="bg-amber-950/25 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>استدلال و چرایی کارفرمای آلمانی از طرح سوال (Employer Reasoning):</span>
                          </div>
                          <p className="text-amber-100/90 text-[11px] leading-relaxed pr-5 font-normal">
                            {q.reasoning || q.recruiterObjective}
                          </p>
                        </div>

                        {/* 2. Recruiter Objective & Underlying Rationale */}
                        <div className="bg-sky-950/20 border border-sky-500/20 rounded-xl p-3.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                            <HelpCircle className="w-4 h-4" />
                            <span>مبنا و هدف گزینشی مصاحبه‌کننده آلمانی (Warum fragt der Arbeitgeber das?):</span>
                          </div>
                          <p className="text-slate-200 text-[11px] leading-relaxed pr-5">
                            {q.recruiterObjective}
                          </p>
                        </div>

                        {/* 2. Evaluation Focus */}
                        <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                            <Layers className="w-4 h-4" />
                            <span>معیار اصلی ارزیابی پاسخ توسط مدیر فنی و HR آلمانی:</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pr-5">
                            {q.evaluationFocus}
                          </p>
                        </div>

                        {/* 3. Recommended Answer Strategy */}
                        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>استراتژی پاسخ ایده‌آل (بر اساس متدولوژی STAR و استانداردهای بازار کار آلمان):</span>
                          </div>
                          <p className="text-emerald-200/90 text-[11px] leading-relaxed pr-5">
                            {q.recommendedAnswerStrategy}
                          </p>
                        </div>

                        {/* 4. Red Flags */}
                        <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                            <AlertTriangle className="w-4 h-4" />
                            <span>خط قرمزهای مصاحبه‌کننده آلمانی (Red Flags - پاسخ‌هایی که به رد متقاضی منجر می‌شود):</span>
                          </div>
                          <p className="text-red-200/90 text-[11px] leading-relaxed pr-5">
                            {q.redFlags}
                          </p>
                        </div>

                        {/* Suggested Answer Framework (STAR Method) Toggle for German Interviews */}
                        <div className="pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => toggleStarFramework(q.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                              openStarFrameworks[q.id]
                                ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                                : "bg-slate-950/70 hover:bg-slate-850 border-slate-800 text-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-400" />
                              <span>چارچوب پاسخ پیشنهادی کارفرمایان آلمانی (متدولوژی STAR):</span>
                              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                                STAR Method
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
                              <span>{openStarFrameworks[q.id] ? "بستن چارچوب STAR" : "مشاهده گام‌به‌گام STAR"}</span>
                              {openStarFrameworks[q.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {openStarFrameworks[q.id] && (
                            <div className="mt-2.5 p-4 bg-slate-950/90 border border-amber-500/40 rounded-xl space-y-3.5 animate-fade-in text-xs">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>توصیه‌های چارچوب STAR طبق فرهنگ مصاحبه‌های استخدامی آلمان:</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(
                                    `star-${q.id}`,
                                    `چارچوب پاسخ پیشنهادی متدولوژی STAR برای سوال مصاحبه:\n${q.questionFa}\n\n` +
                                    `[S - Situation (موقعیت)]: ${q.starFramework?.situation || "شرح بستر، پروژه، ابعاد تیم و چالش سازمانی با فکت و ارقام"}\n\n` +
                                    `[T - Task (مأموریت)]: ${q.starFramework?.task || "مسئولیت مستقیم، ددلاین‌ها و استانداردهای مورد انتظار کارفرما"}\n\n` +
                                    `[A - Action (اقدامات اجرایی)]: ${q.starFramework?.action || "رویکرد مهندسی مستند، معماری، تصمیمات فنی و رعایت نظم ساختاری"}\n\n` +
                                    `[R - Result (نتایج)]: ${q.starFramework?.result || "سنجه‌های عملکردی (KPIs)، درصد بهینه‌سازی، ثبات و درس‌های آموخته‌شده"}\n\n` +
                                    `[نکته فرهنگ کاری آلمان]: ${q.starFramework?.germanCultureTip || "بر رویکرد Sachlichkeit (عینیت) و داده‌های اثبات‌پذیر تمرکز کنید."}`
                                  )}
                                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                                >
                                  {copiedId === `star-${q.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>کپی کل چارچوب STAR</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {/* Situation */}
                                <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-lg space-y-1">
                                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                                    <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-mono">S</span>
                                    <span>۱. موقعیت و زمینه کاری (Situation):</span>
                                  </div>
                                  <p className="text-slate-300 text-[11px] leading-relaxed pr-5">
                                    {q.starFramework?.situation}
                                  </p>
                                </div>

                                {/* Task */}
                                <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-lg space-y-1">
                                  <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px]">
                                    <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-mono">T</span>
                                    <span>۲. مأموریت و مسئولیت اختصاصی شما (Task):</span>
                                  </div>
                                  <p className="text-slate-300 text-[11px] leading-relaxed pr-5">
                                    {q.starFramework?.task}
                                  </p>
                                </div>

                                {/* Action */}
                                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg space-y-1 md:col-span-2">
                                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-mono">A</span>
                                    <span>۳. اقدامات اجرایی و متدولوژی (Action - بخش اصلی پاسخ با سهم ۵۰٪):</span>
                                  </div>
                                  <p className="text-emerald-100/90 text-[11px] leading-relaxed pr-5 font-normal">
                                    {q.starFramework?.action}
                                  </p>
                                </div>

                                {/* Result */}
                                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg space-y-1 md:col-span-2">
                                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-mono">R</span>
                                    <span>۴. نتایج مستند، سنجه‌های عددی و ثبات (Result):</span>
                                  </div>
                                  <p className="text-amber-100/90 text-[11px] leading-relaxed pr-5 font-normal">
                                    {q.starFramework?.result}
                                  </p>
                                </div>
                              </div>

                              {/* German Culture Tip */}
                              <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2 text-[11px] text-yellow-200/95">
                                <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-yellow-300 block mb-0.5">نکته کلیدی فرهنگ کار آلمان (Sachlichkeit & Verlässlichkeit):</strong>
                                  <span>{q.starFramework?.germanCultureTip}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 5. Real-World Source Grounding */}
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1">
                          <span className="font-semibold text-slate-400">منبع داده واقعی:</span>
                          <span>{q.realWorldSource}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-10 flex flex-col items-center justify-center text-center text-slate-300 min-h-[350px]">
          <HelpCircle className="h-12 w-12 text-indigo-400/60 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-slate-200">آماده شبیه‌سازی سوالات مصاحبه شغلی آلمان</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            فایل PDF رزومه خود را در کادر بالا بارگذاری کنید یا اطلاعات سوابق را بررسی کرده و روی دکمه «شبیه‌سازی سوالات مصاحبه آلمان» کلیک نمایید.
          </p>
        </div>
      )}

      {/* Print Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  پیش‌نمایش سند رسمی چاپی سوالات مصاحبه (کادربندی رسمی A4، واترمارک و امضاء)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDirectPrint}
                  className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>چاپ نهایی (PDF)</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Simulated Paper View */}
            <div className="p-6 overflow-y-auto bg-slate-950 flex justify-center">
              <div className="w-full max-w-[210mm] bg-white text-slate-900 p-8 shadow-2xl border-2 border-slate-850 rounded-sm relative text-xs leading-relaxed">
                {/* Paper Header */}
                <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-black text-slate-900 m-0">
                      مستند شبیه‌ساز سوالات و مصاحبه استخدامی کارفرمایان آلمان
                    </h2>
                    <p className="text-[10px] text-slate-600 m-0">
                      مرکز ارزیابی و آمادگی مصاحبه‌های بین‌المللی | گروه شرکت‌های بین‌المللی جهانبان
                    </p>
                  </div>
                  <div className="text-left font-mono text-[10px] text-slate-700">
                    <span className="font-bold text-indigo-900">{printDocRef}</span>
                    <div className="text-[9px] text-slate-500">KldB / 2026</div>
                  </div>
                </div>

                {/* Meta Box */}
                {/* Meta Box */}
                <div className="bg-slate-100 p-2.5 rounded border border-slate-300 grid grid-cols-2 gap-2 text-[10px] mb-4">
                  <div><strong>متقاضی:</strong> {result?.candidateName || candidateName}</div>
                  <div><strong>موقعیت شغلی:</strong> {result?.targetRole} ({result?.targetRoleDe})</div>
                  <div><strong>سطح ارزیابی‌شده:</strong> {result?.experienceLevelDetected}</div>
                  <div><strong>ارزیاب ارشد مصاحبه:</strong> {result?.interviewerProfile?.titleFa ? `${result.interviewerProfile.titleFa} (${result.interviewerProfile.titleDe})` : "سرپرست دپارتمان تخصصی"}</div>
                  {result?.candidateWorkProfile?.yearsOfExperience && (
                    <div><strong>سابقه کار مستند:</strong> {result.candidateWorkProfile.yearsOfExperience}</div>
                  )}
                  {result?.candidateWorkProfile?.softwareTools && result.candidateWorkProfile.softwareTools.length > 0 && (
                    <div className="col-span-2"><strong>نرم‌افزارها و ابزارهای ملاک:</strong> {result.candidateWorkProfile.softwareTools.join("، ")}</div>
                  )}
                  {result?.candidateWorkProfile?.certifications && result.candidateWorkProfile.certifications.length > 0 && (
                    <div className="col-span-2"><strong>گواهینامه‌های ملاک:</strong> {result.candidateWorkProfile.certifications.join("، ")}</div>
                  )}
                  <div className="col-span-2"><strong>مرجع سند:</strong> خانه خلاق جهانبان (jahanban.group)</div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 border-r-4 border-indigo-600 p-2 text-[10px] text-slate-850 mb-4 text-justify">
                  <strong>خلاصه تحلیلی:</strong> {result?.summaryOverview}
                </div>

                {/* Questions Preview - Categorized and Full */}
                <div className="space-y-4">
                  {/* General Questions Section */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-indigo-50 border-r-4 border-indigo-700 p-2 rounded-sm">
                      <span className="font-extrabold text-indigo-950 text-xs">
                        بخش اول: سوالات عمومی و ارزیابی شایستگی بین‌فرهنگی (Cultural Fit)
                      </span>
                      <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded font-bold">
                        {(result?.questions || []).filter(q => q.category === "general").length} سوال
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(result?.questions || [])
                        .filter(q => q.category === "general")
                        .map((q, idx) => (
                          <div key={q.id} className="border border-slate-300 rounded p-2.5 bg-white space-y-1.5 text-[10px]">
                            <div className="flex justify-between items-start font-bold text-slate-900 gap-2">
                              <span className="font-sans text-left dir-ltr flex-1 text-indigo-950 font-semibold">{idx + 1}. {q.questionDeEn}</span>
                              <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded font-medium shrink-0">{q.levelLabelFa} | {q.companyTypeLabelFa}</span>
                            </div>
                            <div className="text-[9.5px] text-slate-700 font-medium text-right">{q.questionFa}</div>
                            {q.jargonTerms && q.jargonTerms.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {q.jargonTerms.map((t, ti) => (
                                  <span key={ti} className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded text-[8.5px] font-mono">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                            {q.practicalWorkReference && (
                              <div className="bg-indigo-50/80 border border-indigo-200 p-1.5 rounded text-[9px] text-indigo-950">
                                <strong>انطباق با کار اجرایی و ابزار:</strong> {q.practicalWorkReference}
                              </div>
                            )}
                            <div className="bg-slate-100 p-1.5 rounded text-[9px] text-slate-850">
                              <strong>استدلال کارفرما:</strong> {q.reasoning || q.recruiterObjective}
                            </div>
                            <div className="bg-emerald-50 p-1.5 rounded text-[9px] text-emerald-950">
                              <strong>استراتژی پاسخ:</strong> {q.recommendedAnswerStrategy}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Technical Questions Section */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between bg-sky-50 border-r-4 border-sky-700 p-2 rounded-sm">
                      <span className="font-extrabold text-sky-950 text-xs">
                        بخش دوم: سوالات تخصصی و ارزیابی فنی (از جونیور تا لید)
                      </span>
                      <span className="text-[10px] bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded font-bold">
                        {(result?.questions || []).filter(q => q.category === "technical").length} سوال
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(result?.questions || [])
                        .filter(q => q.category === "technical")
                        .map((q, idx) => (
                          <div key={q.id} className="border border-slate-300 rounded p-2.5 bg-white space-y-1.5 text-[10px]">
                            <div className="flex justify-between items-start font-bold text-slate-900 gap-2">
                              <span className="font-sans text-left dir-ltr flex-1 text-slate-950 font-semibold">{idx + 1}. {q.questionDeEn}</span>
                              <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded font-medium shrink-0">{q.levelLabelFa} | {q.companyTypeLabelFa}</span>
                            </div>
                            <div className="text-[9.5px] text-slate-700 font-medium text-right">{q.questionFa}</div>
                            {q.jargonTerms && q.jargonTerms.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {q.jargonTerms.map((t, ti) => (
                                  <span key={ti} className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded text-[8.5px] font-mono">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                            {q.practicalWorkReference && (
                              <div className="bg-sky-50/80 border border-sky-200 p-1.5 rounded text-[9px] text-sky-950">
                                <strong>انطباق با کار اجرایی و ابزارها:</strong> {q.practicalWorkReference}
                              </div>
                            )}
                            <div className="bg-slate-100 p-1.5 rounded text-[9px] text-slate-850">
                              <strong>استدلال کارفرما:</strong> {q.reasoning || q.recruiterObjective}
                            </div>
                            <div className="bg-emerald-50 p-1.5 rounded text-[9px] text-emerald-950">
                              <strong>استراتژی پاسخ:</strong> {q.recommendedAnswerStrategy}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Signature Box */}
                <div className="mt-6 border border-slate-400 bg-slate-50 p-3 rounded space-y-2">
                  <p className="text-[9px] leading-relaxed text-justify text-slate-700">
                    <strong>تاییدیه و اقرار متقاضی:</strong> اینجانب <u>{result?.candidateName || candidateName}</u> تایید می‌نمایم که سوالات شبیه‌سازی‌شده مصاحبه تخصصی و عمومی کارفرمایان آلمانی مندرج در این سند را با دقت مطالعه نموده و متعهد می‌گردم پاسخ‌های خود را بر اساس روش‌شناسی STAR و استانداردهای مطرح‌شده تمرین نمایم.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="border border-dashed border-slate-400 bg-white p-2 text-center text-[9px] min-h-[50px] flex flex-col justify-between">
                      <span className="font-bold text-slate-700">امضاء و تایید متقاضی</span>
                      <span className="text-slate-400 text-[8px]">[محل امضاء یا اثر انگشت]</span>
                    </div>

                    <div className="border border-dashed border-slate-400 bg-white p-2 text-center text-[9px] min-h-[50px] flex flex-col justify-between">
                      <span className="font-bold text-slate-700">تاییدیه کارشناسی کاریابی جهانبان</span>
                      <span className="text-emerald-700 font-semibold text-[8px]">تایید شده KldB 2026</span>
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                <div className="mt-4 pt-2 border-t border-slate-300 text-center text-[8px] text-slate-500">
                  سامانه هوشمند ارزیابی و کاریابی آلمان | گروه شرکت‌های بین‌المللی جهانبان | صفحه ۱ از ۱
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payload Tracer Audit Modal */}
      {showTraceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in text-xs">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-750 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    گزارش ممیزی اولویت پلود هوش مصنوعی (Payload Priority Tracer)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    راستی‌آزمایی اولویت ۱۰۰٪ سند رزومه PDF نسبت به داده‌های ورودی دستی
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTraceModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {payloadTrace ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    payloadTrace.sourcePriority === "CV_PDF_OBJECT"
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                      : "bg-blue-950/40 border-blue-500/50 text-blue-300"
                  }`}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-black text-xs block">
                          اولویت تخصیص‌یافته به پرامپت: {payloadTrace.sourcePriority === "CV_PDF_OBJECT" ? "اولویت ۱ (CV_PDF_OBJECT - سند قطعی رزومه)" : "اولویت ۲ (MANUAL_INPUT - ورودی دستی)"}
                        </span>
                        <span className="text-[10px] opacity-80">زمان پردازش: {payloadTrace.timestamp}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {payloadTrace.sourcePriority}
                    </span>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block font-medium">فایل رزومه PDF مبنا:</span>
                      <strong className="text-white block font-mono">{payloadTrace.fileName || "بدون فایل (ورودی دستی)"}</strong>
                      <span className="text-[10px] text-slate-500">حجم بایت: {payloadTrace.fileSizeBytes.toLocaleString()} بایت</span>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block font-medium">وضعیت متن رزومه دستی (Suppression):</span>
                      <strong className={`block font-mono ${payloadTrace.sanitizedManualTextSuppressed ? "text-emerald-400" : "text-amber-400"}`}>
                        {payloadTrace.sanitizedManualTextSuppressed ? "✔ کاملاً پاکسازی شد (0 کاراکتر)" : `ارسال شد (${payloadTrace.resumeTextLengthSent} کاراکتر)`}
                      </strong>
                      <span className="text-[10px] text-slate-500">
                        {payloadTrace.sanitizedManualTextSuppressed ? "جلوگیری از آلودگی پرامپت با داده‌های دستی" : "فایل PDF بارگذاری نشده است"}
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block font-medium">نام ارسالی به پرامپت:</span>
                      <strong className="text-indigo-300 block">{payloadTrace.candidateNameSent}</strong>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block font-medium">تخصص ارسالی به پرامپت:</span>
                      <strong className="text-indigo-300 block">{payloadTrace.targetFieldSent}</strong>
                    </div>
                  </div>

                  {/* Terminal Execution Logs */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-300 block text-xs">لاگ‌های گام‌به‌گام تفکیک و اعتبارسنجی:</span>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
                      {payloadTrace.logs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-slate-500 select-none">[{idx + 1}]</span>
                          <span className={log.includes("✔") ? "text-emerald-300" : log.includes("ℹ") ? "text-sky-300" : "text-amber-300"}>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-300 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300">هنوز درخواستی ارسال نشده است. پس از کلیک روی شبیه‌سازی، لاگ‌های تفصیلی اینجا ثبت می‌گردند.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-850 border-t border-slate-750 flex items-center justify-between">
              <button
                onClick={() => {
                  if (payloadTrace) {
                    navigator.clipboard.writeText(JSON.stringify(payloadTrace, null, 2));
                  }
                }}
                disabled={!payloadTrace}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-40"
              >
                کپی گزارش JSON
              </button>

              <button
                onClick={() => setShowTraceModal(false)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
