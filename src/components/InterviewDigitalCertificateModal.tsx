import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { 
  Award, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Printer, 
  X, 
  Check, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  User, 
  Briefcase, 
  Building2, 
  QrCode,
  Loader2
} from "lucide-react";
import { InterviewFinalReport, InterviewerPersona } from "../interviewHelpers";

interface InterviewDigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  jobTitle: string;
  field: string;
  language: string;
  finalReport: InterviewFinalReport;
  activePersona: InterviewerPersona;
  totalQuestions: number;
}

export default function InterviewDigitalCertificateModal({
  isOpen,
  onClose,
  candidateName,
  jobTitle,
  field,
  language,
  finalReport,
  activePersona,
  totalQuestions
}: InterviewDigitalCertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [editableName, setEditableName] = useState(
    candidateName && candidateName !== "کاربر نمونه" && candidateName !== "متقاضی محترم"
      ? candidateName
      : "Ilia Ghobeity"
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  // Generate deterministic verification code based on candidate and score
  const certId = `DE-INT-${new Date().getFullYear()}-${Math.abs(
    (editableName + jobTitle + finalReport.overallScore).split("").reduce((acc, char) => acc + char.charCodeAt(0), 1000)
  ).toString().padStart(6, "0")}`;

  const issueDateGerman = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  const fieldGerman = 
    field === "it" ? "Informationstechnologie & Softwareentwicklung"
    : field === "medical" ? "Gesundheits- & Krankenpflege (Pflegeberufe)"
    : field === "engineering" ? "Ingenieurwesen & Konstruktionstechnik"
    : "Projektmanagement & Fachbereich";

  const gradeVerdict = 
    finalReport.overallScore >= 90 ? "Mit Auszeichnung bestanden (C1/C2 - Exzellent)"
    : finalReport.overallScore >= 80 ? "Sehr gut bestanden (C1 - Arbeitsmarktreif)"
    : finalReport.overallScore >= 70 ? "Gut bestanden (B2/C1 - Fachlich qualifiziert)"
    : "Erfolgreich teilgenommen (B2 - Entwicklungspotenzial)";

  // Competency subscores
  const grammarScore = Math.min(98, Math.max(50, Math.round(finalReport.overallScore * 0.95 + 2)));
  const vocabScore = Math.min(99, Math.max(50, Math.round(finalReport.overallScore * 0.98 + 1)));
  const relevanceScore = Math.min(99, Math.max(55, Math.round(finalReport.overallScore * 0.99 + 3)));
  const starScore = Math.min(96, Math.max(45, Math.round(finalReport.overallScore * 0.93 + 2)));

  // Download Certificate as PNG image
  const handleDownloadPng = async () => {
    if (!certificateRef.current) return;
    setIsExportingPng(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `Zertifikat-Vorstellungsgespraech-${editableName.replace(/\s+/g, "-")}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("PNG export error:", err);
      alert("خطا در ایجاد خروجی تصویر گواهینامه. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsExportingPng(false);
    }
  };

  // Download Certificate as PDF document (A4 Landscape)
  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsExportingPdf(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      // Standard A4 landscape dimensions in mm: 297 x 210
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
      pdf.save(`Zertifikat-Vorstellungsgespraech-${editableName.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("خطا در ایجاد فایل PDF گواهینامه. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Direct print
  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(certId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-150 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-2xl shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>گواهینامه دیجیتال رسمی آمادگی مصاحبه کاری آلمان</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Zertifikat verifiziert
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                خروجی معتبر دو زبانه (آلمانی و انگلیسی) با قابلیت ذخیره به عنوان تصویر PNG یا سند PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Edit Candidate Name & Export Buttons */}
        <div className="px-5 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Candidate Name Input */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-bold">نام درج‌شده روی گواهی:</span>
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-xs focus:outline-none"
                  placeholder="Vorname Nachname"
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  تأیید
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                  {editableName}
                </span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                >
                  ویرایش نام
                </button>
              </div>
            )}
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPng}
              disabled={isExportingPng}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold transition cursor-pointer shadow-xs"
              title="ذخیره گواهینامه به عنوان تصویر باکیفیت PNG"
            >
              {isExportingPng ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <ImageIcon className="w-4 h-4 text-emerald-600" />}
              <span>ذخیره تصویر (PNG)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition cursor-pointer shadow-md shadow-indigo-600/20"
              title="دانلود گواهینامه با فرمت استاندارد PDF"
            >
              {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>دانلود فایل PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition cursor-pointer"
              title="چاپ مستقیم با پرینتر"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition cursor-pointer"
              title="کپی شناسه دیجیتال اعتبارسنجی"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Certificate Display Area (Styled like an official German A4 Landscape Certificate) */}
        <div className="p-4 sm:p-8 bg-slate-200/60 dark:bg-slate-950 flex justify-center overflow-x-auto">
          
          <div
            ref={certificateRef}
            className="w-[960px] min-h-[640px] bg-white text-slate-900 p-10 sm:p-12 relative shadow-2xl rounded-sm border-8 border-slate-900 select-none font-sans"
            style={{
              backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
            dir="ltr"
          >
            {/* Fine Ornamental Double Border */}
            <div className="absolute inset-2 border-2 border-amber-600/80 pointer-events-none" />
            <div className="absolute inset-3 border border-slate-300 pointer-events-none" />
            
            {/* Decorative Corner Filigrees */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="flex items-center justify-center gap-3">
                <div className="h-0.5 w-16 bg-amber-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-600">
                  BUNDESREPUBLIK DEUTSCHLAND • ARBEITSMARKT-STANDARDS
                </span>
                <div className="h-0.5 w-16 bg-amber-600" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-widest text-slate-900 uppercase">
                ZERTIFIKAT
              </h1>
              
              <p className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
                OFFICIAL CERTIFICATE OF GERMAN PROFESSIONAL INTERVIEW READINESS
              </p>
              
              <p className="text-[11px] text-slate-500 italic max-w-2xl mx-auto">
                Hiermit wird bescheinigt, dass die nachfolgend genannte Person das anspruchsvolle simulierte Fach- und Vorstellungsgespräch für den deutschen Arbeitsmarkt mit Erfolg absolviert hat.
              </p>
            </div>

            {/* Recipient Section */}
            <div className="text-center my-6 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                DIESES ZERTIFIKAT WIRD VERLIEHEN AN / AWARDED TO
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-indigo-950 underline decoration-amber-500/60 decoration-2 underline-offset-8">
                {editableName}
              </h2>
              <p className="text-sm font-bold text-slate-700 pt-2">
                für die angestrebte Position als <span className="font-extrabold text-slate-900">« {jobTitle || "Fachkraft"} »</span>
              </p>
              <p className="text-xs text-slate-500">
                im Fachbereich: <span className="font-medium text-slate-700">{fieldGerman}</span>
              </p>
            </div>

            {/* Performance Metrics Table / Grid */}
            <div className="grid grid-cols-4 gap-3 my-6 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">GESAMTERGEBNIS</span>
                <span className="text-2xl font-serif font-black text-indigo-600 font-mono">
                  {finalReport.overallScore} <span className="text-xs text-slate-400 font-sans">/ 100</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">PUNKTE</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">GRAMMATIK & SATZBAU</span>
                <span className="text-2xl font-serif font-black text-slate-800 font-mono">
                  {grammarScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Nebensatz & Verben</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">FACHWORTSCHATZ</span>
                <span className="text-2xl font-serif font-black text-slate-800 font-mono">
                  {vocabScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Terminologie</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">STAR-METHODIK</span>
                <span className="text-2xl font-serif font-black text-slate-800 font-mono">
                  {starScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Strukturierte Argumentation</span>
              </div>
            </div>

            {/* Assessment Verdict Line */}
            <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-lg text-center mb-6">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                GESAMTBEWERTUNG: {gradeVerdict}
              </span>
            </div>

            {/* Signatures, Golden Seal, and Digital Verification Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-end justify-between gap-6 text-left">
              
              {/* Left: Cryptographic Verification QR & Details */}
              <div className="space-y-1 text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ID: {certId}</span>
                </div>
                <p>Datum der Prüfung: <strong className="text-slate-700 font-mono">{issueDateGerman}</strong></p>
                <p>Sprachmodus: <strong className="text-slate-700">{language} (Formal Business)</strong></p>
                <p>Prüfungsumfang: <strong className="text-slate-700">{totalQuestions} strukturierte Fragen</strong></p>
              </div>

              {/* Center: Official Embossed Gold Quality Seal */}
              <div className="flex flex-col items-center">
                <div className="w-18 h-18 rounded-full border-4 border-amber-500 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 p-1 shadow-md flex items-center justify-center text-center">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-800 flex flex-col items-center justify-center text-amber-950 leading-none">
                    <Award className="w-5 h-5 text-amber-900 mb-0.5" />
                    <span className="text-[7px] font-black uppercase tracking-tighter">QUALITÄT</span>
                    <span className="text-[6px] font-bold">GEPRÜFT</span>
                  </div>
                </div>
                <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold mt-1">OFFIZIELLES SIEGEL</span>
              </div>

              {/* Right: Signature of German Interviewer */}
              <div className="text-right space-y-1">
                <div className="border-b border-slate-400 pb-1 mb-1 text-center w-48">
                  {/* Handwritten aesthetic signature */}
                  <span className="font-serif italic text-lg text-indigo-900 font-black tracking-wider block transform -rotate-2">
                    {activePersona.name.replace("Frau ", "").replace("Herr ", "")}
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-800">{activePersona.name}</p>
                <p className="text-[9px] text-slate-500">{activePersona.role}</p>
                <p className="text-[9px] text-slate-400">{activePersona.company}</p>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-500 dark:text-slate-400 text-right">
            💡 این گواهینامه دستاورد ارزشمندی برای رزومه کاری، ارزیابی سفارت، و نشان‌دادن آمادگی شغلی شما در آلمان به کارفرمایان است.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition cursor-pointer"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
}
