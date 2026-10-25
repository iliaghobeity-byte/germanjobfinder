import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Copy, Sparkles, FileText, Download, Check, Clipboard, Info, AlertCircle, Eye,
  UploadCloud, CheckCircle2, XCircle, AlertTriangle, FileCode, Sliders, RefreshCw, Layers, ShieldCheck, HelpCircle, Loader2,
  FileSpreadsheet, Globe, GraduationCap, LayoutList
} from "lucide-react";
import { sampleLebenslauf, sampleAnschreiben } from "../data";
import { CVBuilderInput } from "../types";
import { fetchWithRetry } from "../utils";
import CVInterviewQuestionsTab from "./CVInterviewQuestionsTab";
import { GermanCvPdfExportModal } from "./GermanCvPdfExportModal";
import { exportGermanCvToPdf } from "../utils/germanCvPdfGenerator";
import { exportCurrentDashboardOrCvView } from "../utils/germanPdfExportService";
import GermanDin5008AddressInput from "./GermanDin5008AddressInput";
import GermanCvFormatSelector from "./GermanCvFormatSelector";
import GermanCvVisualPreview from "./GermanCvVisualPreview";
import { GermanCvFormatId, getGermanCvFormatById, GERMAN_CV_FORMATS } from "../data/germanCvFormatsData";

export default function CVBuilder() {
  const [inputs, setInputs] = useState<CVBuilderInput>(() => {
    try {
      const saved = localStorage.getItem("germany_cv_builder_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return {
            name: parsed.name || "ایلیار علی‌زاده",
            field: parsed.field || "برنامه‌نویس و توسعه‌دهنده وب (Full Stack React/Node)",
            address: parsed.address || "Valiasr Ave. 1420, 19979-12345 Teheran, Iran (Bereit zum Umzug nach Deutschland)",
            din5008Address: parsed.din5008Address || undefined,
            experience: parsed.experience || "۳ سال کار به عنوان توسعه‌دهنده ارشد در شرکت پردازش آرا تهران، پیاده سازی پلتفرم‌های ابری و وب‌اپلیکیشن‌ها با کارایی متوسط بالا.",
            education: parsed.education || "کارشناسی مهندسی کامپیوتر گرایش نرم‌افزار از دانشگاه صنعتی امیرکبیر تهران (با تاییدیه H+ در آنابین)",
            skills: parsed.skills || "React, Node.js (Express), TypeScript, TailwindCSS, MongoDB, Docker, Git",
            languages: parsed.languages || "فارسی (زبان مادری)، انگلیسی (مسلط C1)، آلمانی (در حال یادگیری B1)"
          };
        }
      }
    } catch {}
    return {
      name: "ایلیار علی‌زاده",
      field: "برنامه‌نویس و توسعه‌دهنده وب (Full Stack React/Node)",
      address: "Valiasr Ave. 1420, 19979-12345 Teheran, Iran (Bereit zum Umzug nach Deutschland)",
      experience: "۳ سال کار به عنوان توسعه‌دهنده ارشد در شرکت پردازش آرا تهران، پیاده سازی پلتفرم‌های ابری و وب‌اپلیکیشن‌ها با کارایی متوسط بالا.",
      education: "کارشناسی مهندسی کامپیوتر گرایش نرم‌افزار از دانشگاه صنعتی امیرکبیر تهران (با تاییدیه H+ در آنابین)",
      skills: "React, Node.js (Express), TypeScript, TailwindCSS, MongoDB, Docker, Git",
      languages: "فارسی (زبان مادری)، انگلیسی (مسلط C1)، آلمانی (در حال یادگیری B1)"
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("germany_cv_builder_data", JSON.stringify(inputs));
    } catch (e) {
      console.warn("Could not save cv builder data to localStorage:", e);
    }
  }, [inputs]);

  // Memoized address change handler guarded against redundant re-renders
  const handleAddressChange = useCallback((formattedAddress: string, data: any) => {
    setInputs(prev => {
      if (prev.address === formattedAddress) {
        return prev;
      }
      return {
        ...prev,
        address: formattedAddress,
        din5008Address: data
      };
    });
  }, []);

  const [docType, setDocType] = useState<"cv" | "cover">("cv");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  // State for German CV PDF Export Modal
  const [isPdfExportOpen, setIsPdfExportOpen] = useState<boolean>(false);
  const [isExportingDirectCv, setIsExportingDirectCv] = useState<boolean>(false);
  const [directCvSuccess, setDirectCvSuccess] = useState<boolean>(false);
  
  // State to toggle between AI output and static standard templates
  const [viewType, setViewType] = useState<"ai" | "template">("template");
  const [templateSelection, setTemplateSelection] = useState<"cv" | "cover">("cv");

  // Selected German Resume Format (tabellarisch, europass, modern, akademisch)
  const [selectedFormat, setSelectedFormat] = useState<GermanCvFormatId>(() => {
    try {
      const saved = localStorage.getItem("germany_cv_builder_format");
      if (saved && ["tabellarisch", "europass", "modern", "akademisch"].includes(saved)) {
        return saved as GermanCvFormatId;
      }
    } catch {}
    return "tabellarisch";
  });

  // State to toggle between Visual Layout Preview and Raw Monospace Code
  const [previewMode, setPreviewMode] = useState<"visual" | "text">("visual");

  useEffect(() => {
    try {
      localStorage.setItem("germany_cv_builder_format", selectedFormat);
    } catch (e) {
      console.warn("Could not save cv format to localStorage:", e);
    }
  }, [selectedFormat]);

  const currentFormatData = useMemo(() => getGermanCvFormatById(selectedFormat), [selectedFormat]);

  const handleApplyFormatTemplate = (formatId: GermanCvFormatId) => {
    setSelectedFormat(formatId);
    setViewType("template");
    setTemplateSelection("cv");
  };

  // Sub-tab state (writer, ats, interview)
  const [activeSubTab, setActiveSubTab] = useState<"writer" | "ats" | "interview">("writer");

  // ATS Checker States
  const [atsFile, setAtsFile] = useState<File | null>(null);
  const [atsPdfBase64, setAtsPdfBase64] = useState<string>("");
  const [atsDragActive, setAtsDragActive] = useState<boolean>(false);
  const [atsPdfError, setAtsPdfError] = useState<string>("");
  const [atsTextSummary, setAtsTextSummary] = useState<string>("");
  const [isAnalyzingAts, setIsAnalyzingAts] = useState<boolean>(false);
  const [atsResult, setAtsResult] = useState<any | null>(null);
  const [atsError, setAtsError] = useState<string>("");
  const [atsSummaryCopied, setAtsSummaryCopied] = useState<boolean>(false);

  // Watermark setting for CV print/export (defaults to clean/hidden for formal German CVs)
  const [cvWatermarkEnabled, setCvWatermarkEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("jahanban_cv_watermark_enabled");
      if (saved !== null) {
        return saved === "true";
      }
    } catch {
      // ignore
    }
    return false;
  });

  const toggleCvWatermark = (enabled: boolean) => {
    setCvWatermarkEnabled(enabled);
    try {
      localStorage.setItem("jahanban_cv_watermark_enabled", String(enabled));
      localStorage.setItem("jahanban_print_watermark_enabled", String(enabled));
    } catch {
      // ignore
    }
    if (enabled) {
      document.body.classList.remove("hide-watermark");
    } else {
      document.body.classList.add("hide-watermark");
    }
  };

  // Sync body class with cvWatermarkEnabled
  useEffect(() => {
    if (!cvWatermarkEnabled) {
      document.body.classList.add("hide-watermark");
    } else {
      document.body.classList.remove("hide-watermark");
    }
  }, [cvWatermarkEnabled]);

  // Support global print simulation bar PDF download trigger
  useEffect(() => {
    const handleGlobalPdfTrigger = () => {
      setIsPdfExportOpen(true);
    };
    window.addEventListener("trigger-download-pdf", handleGlobalPdfTrigger);
    return () => window.removeEventListener("trigger-download-pdf", handleGlobalPdfTrigger);
  }, []);

  // Direct High-Resolution CV PDF generation & download using jsPDF and html2canvas with German standards
  const handleDirectCvDownload = async () => {
    setIsExportingDirectCv(true);
    setDirectCvSuccess(false);
    try {
      const visualEl = (previewMode === "visual" && (docType === "cv" || templateSelection === "cv"))
        ? document.getElementById("german-cv-visual-rendered-container")
        : null;

      await exportCurrentDashboardOrCvView("cv", {
        element: visualEl || undefined,
        cvData: {
          name: inputs.name,
          field: inputs.field,
          address: inputs.address,
          educationRaw: inputs.education,
          experienceRaw: inputs.experience,
          skillsRaw: inputs.skills,
          languagesRaw: inputs.languages,
          rawText: viewType === "ai" ? output : (templateSelection === "cv" ? currentTemplate : sampleAnschreiben),
          docType: (viewType === "template" && templateSelection === "cover") ? "cover" : "cv",
          format: selectedFormat,
          showWatermark: cvWatermarkEnabled
        }
      });
      setDirectCvSuccess(true);
      setTimeout(() => setDirectCvSuccess(false), 4000);
    } catch (err) {
      console.error("Direct CV PDF export error:", err);
      setIsPdfExportOpen(true);
    } finally {
      setIsExportingDirectCv(false);
    }
  };

  const handleAtsFile = (file: File) => {
    setAtsPdfError("");
    setAtsError("");
    if (file.type !== "application/pdf") {
      setAtsPdfError("لطفاً فقط فایل PDF معتبر آپلود کنید.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAtsPdfError("حجم فایل رزومه باید کمتر از ۲ مگابایت باشد.");
      return;
    }

    setAtsFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setAtsPdfBase64(base64);
    };
    reader.onerror = () => {
      setAtsPdfError("خطا در خواندن فایل رخ داد.");
    };
    reader.readAsDataURL(file);
  };

  const handleAtsDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setAtsDragActive(true);
    } else if (e.type === "dragleave") {
      setAtsDragActive(false);
    }
  };

  const handleAtsDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAtsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAtsFile(e.dataTransfer.files[0]);
    }
  };

  const removeAtsFile = () => {
    setAtsFile(null);
    setAtsPdfBase64("");
    setAtsPdfError("");
  };

  const prefillAtsSummary = () => {
    const summary = `عنوان تخصصی: ${inputs.field}\nسوابق کاری و تجربیات کلیدی: ${inputs.experience}\nمهارت‌های فنی: ${inputs.skills}\nزبان‌ها: ${inputs.languages}`;
    setAtsTextSummary(summary);
  };

  const handleAnalyzeAts = async () => {
    setIsAnalyzingAts(true);
    setAtsError("");
    setAtsResult(null);

    if (!atsPdfBase64 && !atsTextSummary.trim()) {
      setAtsError("لطفاً حداقل یک فایل PDF رزومه آپلود کنید یا متن سوابق و خلاصه حرفه‌ای خود را در کادر مربوطه بنویسید.");
      setIsAnalyzingAts(false);
      return;
    }

    try {
      const response = await fetchWithRetry("/api/gemini/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64: atsPdfBase64,
          fileName: atsFile ? atsFile.name : "",
          textSummary: atsTextSummary
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
        throw new Error(data?.error || "خطایی در آنالیز رزومه پیش آمد.");
      }

      setAtsResult(data);
    } catch (err: any) {
      console.error(err);
      setAtsError(err.message || "بروز خطا در برقراری ارتباط با سرور ارزیاب ATS.");
    } finally {
      setIsAnalyzingAts(false);
    }
  };

  const handleCopyAtsSummary = (text: string) => {
    navigator.clipboard.writeText(text);
    setAtsSummaryCopied(true);
    setTimeout(() => setAtsSummaryCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setOutput("");
    setErrorMsg("");
    setViewType("ai");

    try {
      const response = await fetchWithRetry("/api/gemini/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: docType,
          format: selectedFormat,
          ...inputs
        }),
      });

      let data: any;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html") || response.status === 413) {
          throw new Error("ارتباط با سرور برقرار نشد؛ ممکن است به دلیل محدودیت یا شلوغی موقت شبکه باشد. لطفاً کمی بعد مجدداً تلاش کنید.");
        }
        throw new Error(text.substring(0, 150) || `خطای سرور با کد ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || "خطایی در تولید رزومه پیش آمد.");
      }

      setOutput(data.result);
    } catch (err: any) {
      console.error(err);
      const isFailedToFetch = String(err.message || "").toLowerCase().includes("failed to fetch") || 
                              String(err || "").toLowerCase().includes("failed to fetch");
      if (isFailedToFetch) {
        setErrorMsg("ارتباط با سرور هوش مصنوعی برقرار نشد؛ ممکن است به دلیل محدودیت یا شلوغی شبکه باشد. لطفاً لحظاتی دیگر مجدداً تلاش کنید.");
      } else {
        setErrorMsg(err.message || "بروز خطا در برقراری ارتباط با سرور هوش مصنوعی.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const currentTemplate = useMemo(() => {
    let t = templateSelection === "cv" ? currentFormatData.sampleText : sampleAnschreiben;
    if (inputs.name) {
      t = t.replace(/Max Mustermann/g, inputs.name);
    }
    if (inputs.address) {
      if (templateSelection === "cv") {
        t = t.replace(/Anschrift: [^\n|]+/, `Anschrift: ${inputs.address}`);
      } else {
        t = t.replace("Teheran, Iran", inputs.address);
      }
    }
    return t;
  }, [templateSelection, currentFormatData, inputs.name, inputs.address]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreBgClass = (val: number) => {
    if (val < 50) return "bg-red-500/10 border-red-500/20 text-red-400";
    if (val < 75) return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  };

  const getScoreLabel = (val: number) => {
    if (val < 50) return "بحرانی - نیاز به اصلاح جدی";
    if (val < 75) return "متوسط - قابل قبول اما ضعیف";
    if (val < 85) return "خوب - شانس بالا برای تایید";
    return "عالی - انطباق کامل با فیلترها";
  };

  return (
    <div id="cv-tab" className="space-y-6 animate-fade-in">
      {/* Sub-Tabs Selector */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab("writer")}
          className={`pb-3 px-6 text-sm font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeSubTab === "writer"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>دستیار رزومه‌ساز و انگیزه‌نامه</span>
        </button>
        <button
          onClick={() => setActiveSubTab("ats")}
          className={`pb-3 px-6 text-sm font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeSubTab === "ats"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span>ارزیاب سازگاری با ATS آلمان</span>
          <span className="bg-indigo-600/20 text-indigo-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">ATS</span>
        </button>
        <button
          onClick={() => setActiveSubTab("interview")}
          className={`pb-3 px-6 text-sm font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeSubTab === "interview"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <HelpCircle className="h-4 w-4 text-amber-400" />
          <span>سوالات مصاحبه کارفرمایان آلمان</span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">شبیه‌ساز هوشمند</span>
        </button>
      </div>

      {activeSubTab === "writer" ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" /> دستیار رزومه‌ساز (Lebenslauf) و انگیزه‌نامه‌ساز (Anschreiben) آلمانی
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            نگارش رزومه به زبان آلمانی با ساختار جدولی یکی از حیاتی‌ترین اولین قدم‌ها است. شما می‌توانید اطلاعات ساده خود را به فارسی بنویسید تا هوش مصنوعی ما آن را ترجمه کرده و در قالب معتبر کاری آلمان آماده نماید. همچنین می‌توانید از نمونه قالب‌های استاندارد و آفلاین استفاده کنید.
          </p>

          {/* German Resume Format Selector Module */}
          <div className="mb-6">
            <GermanCvFormatSelector
              selectedFormatId={selectedFormat}
              onSelectFormat={(formatId) => setSelectedFormat(formatId)}
              onApplyFormatTemplate={handleApplyFormatTemplate}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column - Span 5 */}
            <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">فرم اطلاعات خام هویت و مهارت‌ها</h3>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">نام و نام خانوادگی به انگلیسی</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    value={inputs.name}
                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                    placeholder="مثال: Iliar Alizadeh"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">موضوع عنوان شغلی (به فارسی یا انگلیسی)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    value={inputs.field}
                    onChange={(e) => setInputs({ ...inputs, field: e.target.value })}
                  />
                </div>

                {/* Specialized German DIN 5008 Address Input Field with Real-Time Validation */}
                <div>
                  <GermanDin5008AddressInput
                    initialAddress={inputs.address}
                    initialData={inputs.din5008Address}
                    onChange={handleAddressChange}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">تفصیل تحصیلی و مدارک رسمی</label>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white h-16 resize-none"
                    value={inputs.education}
                    onChange={(e) => setInputs({ ...inputs, education: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">خلاصه سوابق کاری و تجربیات کلیدی</label>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white h-24 resize-none"
                    value={inputs.experience}
                    onChange={(e) => setInputs({ ...inputs, experience: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">مهارت‌های برنامه‌نویسی، فنی و نرم‌افزاری</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    value={inputs.skills}
                    onChange={(e) => setInputs({ ...inputs, skills: e.target.value })}
                    placeholder="React, CSS, SQL, Docker..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">آشنایی با زبان‌های خارجی</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    value={inputs.languages}
                    onChange={(e) => setInputs({ ...inputs, languages: e.target.value })}
                  />
                </div>

                {/* Format-Specific Add-on Inputs adapting to chosen German CV layout */}
                {selectedFormat === "tabellarisch" && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>فیلدهای ویژه فرمت جدولی استاندارد (DIN 5008):</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">DIN 5008</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">تاریخ و محل تولد (Geburtsdaten)</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                          value={inputs.birthDate || ""}
                          onChange={(e) => setInputs({ ...inputs, birthDate: e.target.value })}
                          placeholder="مثال: 15. Mai 1992 in Teheran"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">وضعیت تاییدیه آنابین (Anabin)</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                          value="H+ anerkannt (KMK / ZAB Datenbank)"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedFormat === "europass" && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        <span>ماتریس مهارت‌های دیجیتال و زبان یوروپس (CEFR / DigComp):</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Europass EU</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">مهارت‌های دیجیتال طبق چارچوب اروپایی (DigComp 2.2)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                        value={inputs.digitalSkills || ""}
                        onChange={(e) => setInputs({ ...inputs, digitalSkills: e.target.value })}
                        placeholder="پردازش داده، امنیت نرم‌افزار، توسعه ابری، Git..."
                      />
                    </div>
                    <div className="p-2 bg-sky-950/40 border border-sky-800/40 rounded-lg text-[10px] text-sky-300 leading-relaxed">
                      ماتریس ۵ مهارت زبانی (Hören, Lesen, Gespräch, Vortrag, Schreiben) بر اساس سطح اعلامی شما به‌طور خودکار در چیدمان بصری و خروجی یوروپس بازآرایی می‌شود.
                    </div>
                  </div>
                )}

                {selectedFormat === "modern" && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>پروفایل کوتاه اجرایی (Kurzprofil) و Tech-Stack مدرن:</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Modern Tech</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">خلاصه اجرایی ۳ خطی با دستاوردها (Kurzprofil / Executive Summary)</label>
                      <textarea
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white h-16 resize-none"
                        value={inputs.kurzprofil || ""}
                        onChange={(e) => setInputs({ ...inputs, kurzprofil: e.target.value })}
                        placeholder="توسعه‌دهنده نرم‌افزار با سابقه بهینه‌سازی ۳۰ درصدی کارایی سیستم‌های توزیع‌شده و اشتیاق به پیوستن به تیم‌های اجایل..."
                      />
                    </div>
                  </div>
                )}

                {selectedFormat === "akademisch" && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>فیلدهای پژوهشی و مقالات (Akademisches Profil):</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Academic CV</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">زمینه‌های پژوهشی (Forschungsschwerpunkte)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                        value={inputs.researchFocus || ""}
                        onChange={(e) => setInputs({ ...inputs, researchFocus: e.target.value })}
                        placeholder="سیستم‌های توزیع‌شده، بهینه‌سازی الگوریتم‌ها، کلود کامپیوتینگ..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">عناوین مقالات یا کنفرانس‌ها (Publikationen)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                        value={inputs.publications || ""}
                        onChange={(e) => setInputs({ ...inputs, publications: e.target.value })}
                        placeholder="مقاله ISI یا کنفرانسی، عنوان پایان‌نامه و نام استاد راهنما..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Selector Document type */}
              <div className="pt-2">
                <label className="block text-xs text-slate-300 mb-1.5">نوع سند تولیدی هوش مصنوعی:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDocType("cv")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      docType === "cv"
                        ? "bg-indigo-600/20 text-indigo-400 border-indigo-500"
                        : "bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800"
                    }`}
                  >
                    رزومه (Lebenslauf)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocType("cover")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      docType === "cover"
                        ? "bg-indigo-600/20 text-indigo-400 border-indigo-500"
                        : "bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800"
                    }`}
                  >
                    انگیزه‌نامه (Anschreiben)
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>در حال ترجمه و مهندسی رزومه...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>تولید سند استاندارد آلمانی با AI</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDirectCvDownload}
                  disabled={isExportingDirectCv}
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                  title="دانلود مستقیم رزومه به صورت فایل PDF با کتابخانه‌های jsPDF و html2canvas"
                >
                  {isExportingDirectCv ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>در حال تولید PDF با jsPDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-200" />
                      <span>دانلود مستقیم PDF (با jsPDF و html2canvas)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsPdfExportOpen(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
                  title="سفارشی‌سازی اطلاعات سربرگ، واترمارک و پیش‌نمایش چاپ"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>پیش‌نمایش و سفارشی‌سازی سند DIN 5008</span>
                </button>

                {directCvSuccess && (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>فایل PDF با موفقیت دانلود شد.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Preview Column - Span 7 */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col h-full min-h-[460px] justify-between">
                <div>
                  {/* Navbar switch between AI and Static Templates */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewType("template")}
                        className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                          viewType === "template"
                            ? "bg-slate-700 text-white font-black border border-slate-600"
                            : "text-white hover:text-slate-100 bg-slate-850/40 border border-slate-800/60"
                        }`}
                      >
                        قالب‌های آماده آفلاین (آلمانی کاملاً استاندارد)
                      </button>
                      <button
                        onClick={() => viewType === "ai" || output ? setViewType("ai") : null}
                        disabled={!output && !isGenerating}
                        className={`px-3 py-1 rounded text-xs transition ${
                          viewType === "ai"
                            ? "bg-slate-700 text-white font-black border border-slate-600"
                            : "text-white/60 hover:text-white disabled:opacity-30"
                        }`}
                      >
                        آماده شده توسط هوش مصنوعی
                      </button>
                    </div>

                    {/* Copy & PDF Download Buttons */}
                    {(viewType === "ai" && output) || viewType === "template" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Settings Toggle for Jahanban Watermark in CV Print */}
                        <div 
                          className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 text-xs shadow-inner"
                          title="تنظیم نمایش یا مخفی‌سازی واترمارک جهانبان در چاپ رزومه (برای ارائه رسمی به کارفرمایان و سفارت آلمان، مخفی‌سازی پیشنهاد می‌شود)"
                          id="cv-watermark-settings-toggle"
                        >
                          <span className="text-[11px] text-slate-400 font-medium px-1">واترمارک چاپ:</span>
                          <button
                            type="button"
                            onClick={() => toggleCvWatermark(false)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                              !cvWatermarkEnabled
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="بدون واترمارک برای ارائه رسمی به کارفرمایان و سفارت آلمان (Clean)"
                            id="btn-cv-watermark-clean"
                          >
                            مخفی (رسمی)
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCvWatermark(true)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                              cvWatermarkEnabled
                                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="درج واترمارک رسمی برند جهانبان در پس‌زمینه رزومه (Branded)"
                            id="btn-cv-watermark-branded"
                          >
                            جهانبان
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new CustomEvent("toggle-print-simulation"))}
                          className="px-2.5 py-1 text-[11px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition active:scale-95"
                          title="شبیه‌سازی چیدمان و حاشیه ۲۰ میلی‌متری کاغذ در مرورگر قبل از باز شدن پنجره چاپ"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>چیدمان چاپ A4</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDirectCvDownload}
                          disabled={isExportingDirectCv}
                          className="px-3 py-1 text-[11px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                          title="دانلود مستقیم رزومه به صورت فایل PDF با jsPDF و html2canvas"
                        >
                          {isExportingDirectCv ? (
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                          ) : (
                            <Download className="w-3 h-3 text-white" />
                          )}
                          <span>دانلود مستقیم PDF (jsPDF)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPdfExportOpen(true)}
                          className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg flex items-center gap-1 cursor-pointer transition"
                          title="تنظیمات سربرگ و سفارشی‌سازی قالب"
                        >
                          <FileText className="w-3 h-3 text-indigo-400" />
                          <span>تنظیمات</span>
                        </button>
                        <button
                          onClick={() => handleCopy(viewType === "ai" ? output : currentTemplate)}
                          className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 flex items-center gap-1 cursor-pointer transition active:scale-95"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">کپی شد!</span>
                            </>
                          ) : (
                            <>
                              <Clipboard className="w-3 h-3" />
                              <span>کپی متن</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* Sub toggle if static template */}
                  {viewType === "template" && (
                    <div className="flex gap-2 mb-3 bg-slate-900/50 p-1 rounded-lg w-fit">
                      <button
                        onClick={() => setTemplateSelection("cv")}
                        className={`px-2.5 py-0.5 rounded text-[10px] cursor-pointer transition ${
                          templateSelection === "cv" ? "bg-indigo-600 text-white font-bold" : "text-white hover:text-slate-100 font-medium bg-slate-800/50"
                        }`}
                      >
                        نمونه رزومه (Lebenslauf)
                      </button>
                      <button
                        onClick={() => setTemplateSelection("cover")}
                        className={`px-2.5 py-0.5 rounded text-[10px] cursor-pointer transition ${
                          templateSelection === "cover" ? "bg-indigo-600 text-white font-bold" : "text-white hover:text-slate-100 font-medium bg-slate-800/50"
                        }`}
                      >
                        نمونه انگیزه‌نامه (Anschreiben)
                      </button>
                    </div>
                  )}

                  {/* Layout & Mode Switcher: Visual Layout vs Text / Markdown */}
                  {(docType === "cv" || templateSelection === "cv") && (
                    <div className="flex items-center justify-between mb-3 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewMode("visual")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            previewMode === "visual"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>چیدمان بصری فرمت ({currentFormatData.titleFa.split(" ")[0]})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreviewMode("text")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            previewMode === "text"
                              ? "bg-slate-700 text-white shadow-xs"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>متن خام مارک‌داون (Text)</span>
                        </button>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{currentFormatData.titleDe}</span>
                      </div>
                    </div>
                  )}

                  {/* Display Area */}
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <Sparkles className="h-8 h-8 text-indigo-400 animate-pulse mb-3" />
                      <p className="text-xs text-slate-300 font-bold">هوش مصنوعی در حال تحلیل اطلاعات و تبدیل ساختار به آلمانی است...</p>
                      <p className="text-[10px] text-slate-500 mt-2">ترجمه به آلمانی اداری / نگارش {currentFormatData.titleDe}</p>
                    </div>
                  ) : errorMsg ? (
                    <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-200 rounded-lg text-xs leading-relaxed flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  ) : previewMode === "visual" && (docType === "cv" || templateSelection === "cv") ? (
                    <div className="max-h-[460px] overflow-y-auto pr-1">
                      <div id="german-cv-visual-rendered-container">
                        <GermanCvVisualPreview
                          formatId={selectedFormat}
                          inputs={inputs}
                          rawText={viewType === "ai" ? output : currentTemplate}
                        />
                      </div>
                    </div>
                  ) : (
                    <div id="german-cv-text-rendered-container" className="text-xs text-slate-200 bg-slate-900 border border-slate-800/80 p-4 rounded-lg font-mono overflow-y-auto max-h-[350px] leading-relaxed whitespace-pre-wrap select-all text-left rtl:direction-ltr select-text">
                      {viewType === "ai" ? output : currentTemplate}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900/40 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      فرمت خروجی PDF و چیدمان مطابق با استاندارد {currentFormatData.titleFa} ({currentFormatData.titleDe}) با تاییدیه وضعیت آنابین آماده دریافت است.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDirectCvDownload}
                      disabled={isExportingDirectCv}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 cursor-pointer transition disabled:opacity-50"
                    >
                      {isExportingDirectCv ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>دانلود مستقیم فایل PDF (با jsPDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPdfExportOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200 underline cursor-pointer"
                    >
                      <span>تنظیمات و سفارشی‌سازی</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubTab === "ats" ? (
        /* ATS Compatibility Checker Content */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-400 animate-pulse" /> ارزیاب سازگاری رزومه با ATS آلمان (Applicant Tracking System)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              بسیاری از شرکت‌های آلمانی بزرگ و متوسط از سیستم‌های غربالگری خودکار رزومه (مانند SAP SuccessFactors یا Workday) استفاده می‌کنند. رزومه‌هایی با قالب‌های گرافیکی پیچیده، فونت‌های ناسازگار، یا فاقد کلمات کلیدی آلمانی، در این فیلترها رد می‌شوند. در این بخش رزومه خود را بارگذاری کنید تا امتیاز انطباق و نسخه‌ای بهینه‌شده از «خلاصه حرفه‌ای» (Kurzprofil) خود دریافت کنید.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input & Upload Column (Span 5) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-indigo-400" /> بارگذاری فایل رزومه انگلیسی یا آلمانی
                </h3>

                {/* Drag and drop zone */}
                <div
                  onDragEnter={handleAtsDrag}
                  onDragOver={handleAtsDrag}
                  onDragLeave={handleAtsDrag}
                  onDrop={handleAtsDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition flex flex-col items-center justify-center min-h-[150px] cursor-pointer ${
                    atsDragActive ? "border-indigo-500 bg-indigo-500/5" : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/30"
                  }`}
                  onClick={() => document.getElementById("ats-pdf-uploader")?.click()}
                >
                  <input
                    id="ats-pdf-uploader"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAtsFile(e.target.files[0]);
                      }
                    }}
                  />

                  {!atsFile ? (
                    <>
                      <UploadCloud className="w-10 h-10 text-slate-500 mb-3" />
                      <span className="text-xs font-bold text-slate-300">رزومه خود را به اینجا بکشید یا کلیک کنید</span>
                      <span className="text-[10px] text-slate-500 mt-1">پسوند مورد پذیرش: PDF (حداکثر ۲ مگابایت)</span>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <p className="text-xs font-bold text-white max-w-[200px] truncate mx-auto">{atsFile.name}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAtsFile();
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
                      >
                        حذف و انتخاب مجدد
                      </button>
                    </div>
                  )}
                </div>

                {atsPdfError && (
                  <div className="bg-red-950/20 text-red-400 border border-red-900/30 p-2.5 rounded-lg text-[11px] flex gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{atsPdfError}</span>
                  </div>
                )}
              </div>

              {/* Text Area Input Option */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">متن خلاصه حرفه‌ای یا سوابق کاری</h3>
                  <button
                    onClick={prefillAtsSummary}
                    className="text-[10px] bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50 rounded px-2 py-0.5 transition active:scale-95 cursor-pointer"
                  >
                    پیش‌فرض از فرم تحصیلی/کاری
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5 leading-relaxed">
                    می‌توانید خلاصه حرفه‌ای فعلی یا متن سوابق رزومه‌تان را مستقیماً وارد کنید تا تحلیل و بهینه‌سازی شود:
                  </label>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-white h-32 resize-none animate-fade-in"
                    value={atsTextSummary}
                    onChange={(e) => setAtsTextSummary(e.target.value)}
                    placeholder="مثال: توسعه‌دهنده وب با ۳ سال سابقه کار ارشد با ری‌اکت و نود. مسلط به داکر و مانیتورینگ..."
                  />
                </div>

                <button
                  onClick={handleAnalyzeAts}
                  disabled={isAnalyzingAts}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 transition"
                >
                  {isAnalyzingAts ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال آنالیز انطباق با استاندارد ATS آلمان...</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4 text-white" />
                      <span>شروع بررسی و سنجش سازگاری</span>
                    </>
                  )}
                </button>

                {atsError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-200 rounded-lg text-xs leading-relaxed flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{atsError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Results Panel Column (Span 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {isAnalyzingAts ? (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center h-full min-h-[460px] text-center">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Sparkles className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">هوش مصنوعی در حال تحلیل رزومه شماست...</h3>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    رزومه شما در برابر ۲۴ فیلتر و معیار سخت‌گیرانه سیستم‌های استخدامی آلمان (ATS) و همچنین اصول نگارش حرفه‌ای Tabellarischer Lebenslauf بررسی می‌شود.
                  </p>
                </div>
              ) : atsResult ? (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-6 h-full min-h-[460px] overflow-y-auto max-h-[680px]">
                  {/* Score dashboard and Title */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900/40 p-4 rounded-xl border border-slate-850">
                    {/* SVG Score Circle */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <svg className="w-24 h-24 transform -rotate-90">
                        {/* Background track circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          className="stroke-slate-800 fill-none"
                          strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          className={`fill-none transition-all duration-1000 ${
                            atsResult.score < 50 
                              ? "stroke-red-500" 
                              : atsResult.score < 75 
                              ? "stroke-amber-500" 
                              : "stroke-emerald-500"
                          }`}
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 - (2 * Math.PI * 40 * atsResult.score) / 100}
                        />
                      </svg>
                      {/* Inside Score Text */}
                      <span className="absolute text-xl font-black text-white">{atsResult.score}%</span>
                    </div>

                    <div className="space-y-1.5 text-center sm:text-right">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] rounded-full border font-black ${getScoreBgClass(atsResult.score)}`}>
                        {getScoreLabel(atsResult.score)}
                      </span>
                      <h4 className="text-sm font-bold text-white">امتیاز نهایی سازگاری با سیستم‌های ATS</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        این امتیاز بر اساس الگوریتم خوانایی قالب، کلمات کلیدی، کیفیت خلاصه حرفه‌ای و هماهنگی با بازار استخدامی آلمان محاسبه شده است.
                      </p>
                    </div>
                  </div>

                  {/* Criteria Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-850">
                      <Layers className="w-4 h-4 text-indigo-400" /> ارزیابی تفکیکی معیارهای پذیرش
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      {atsResult.criteria?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-850 flex gap-2.5 items-start">
                          <div className="shrink-0 pt-0.5">
                            {item.status === "passed" ? (
                              <Check className="w-4 h-4 text-emerald-400 bg-emerald-500/10 rounded-full p-0.5" />
                            ) : item.status === "warning" ? (
                              <AlertTriangle className="w-4 h-4 text-amber-400 bg-amber-500/10 rounded-full p-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 bg-red-500/10 rounded-full p-0.5" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-[11px] font-bold text-slate-200">{item.name}</h5>
                            <p className="text-[10px] text-slate-400 leading-relaxed">{item.feedback}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Text-based Summary Optimization (The core request) */}
                  <div className="space-y-3 bg-slate-900/20 p-4 rounded-xl border border-slate-850/60 animate-fade-in">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 pb-2 border-b border-slate-850">
                      <Sparkles className="w-4 h-4 text-indigo-400" /> نسخه‌ی بهبودیافته و بهینه‌ی خلاصه حرفه‌ای (Kurzprofil)
                    </h4>

                    {atsResult.summaryFeedback && (
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                        {atsResult.summaryFeedback}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold bg-indigo-950 px-2 py-0.5 rounded text-indigo-300">
                          پیشنهاد هوش مصنوعی (مناسب برای بالای رزومه آلمانی یا نامه معرفی)
                        </span>
                        <button
                          onClick={() => handleCopyAtsSummary(atsResult.improvedSummary)}
                          className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-850 flex items-center gap-1 cursor-pointer transition active:scale-95"
                        >
                          {atsSummaryCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">کپی شد!</span>
                            </>
                          ) : (
                            <>
                              <Clipboard className="w-3 h-3" />
                              <span>کپی کردن متن</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-200 bg-slate-950 border border-slate-850 p-3.5 rounded-lg font-mono overflow-y-auto max-h-[220px] leading-relaxed whitespace-pre-wrap text-left rtl:direction-ltr select-text">
                        {atsResult.improvedSummary}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> مهم‌ترین توصیه‌های عملیاتی برای قبولی رزومه شما در آلمان
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-[10px] text-slate-400 leading-relaxed pr-2">
                      {atsResult.recommendations?.map((rec: string, idx: number) => (
                        <li key={idx} className="marker:text-indigo-400">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center h-full min-h-[460px] text-center text-slate-300">
                  <FileCode className="h-12 w-12 text-indigo-400/60 mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-slate-200">در انتظار بارگذاری فایل یا تحلیل متن...</p>
                  <p className="text-[11px] text-slate-400 mt-1">پس از آپلود رزومه یا وارد کردن سوابق، بر روی دکمه شروع بررسی کلیک کنید.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CVInterviewQuestionsTab defaultInputs={inputs} />
      )}

      {/* German CV & Cover Letter Standard DIN 5008 PDF Export Modal */}
      {isPdfExportOpen && (
        <GermanCvPdfExportModal
          isOpen={isPdfExportOpen}
          onClose={() => setIsPdfExportOpen(false)}
          initialData={{
            name: inputs.name,
            field: inputs.field,
            address: inputs.address,
            experience: inputs.experience,
            education: inputs.education,
            skills: inputs.skills,
            languages: inputs.languages,
            rawText: viewType === "ai" ? output : currentTemplate,
            docType: (viewType === "template" && templateSelection === "cover") || docType === "cover" ? "cover" : "cv",
            format: selectedFormat,
            showWatermark: cvWatermarkEnabled
          }}
        />
      )}
    </div>
  );
}
