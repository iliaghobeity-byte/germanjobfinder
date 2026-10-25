import React, { useState } from "react";
import { 
  FileSpreadsheet, Globe, Sparkles, GraduationCap, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, Layers, ArrowRight, ShieldCheck, 
  Check, ExternalLink, Info, Award
} from "lucide-react";
import { 
  GermanCvFormat, 
  GermanCvFormatId, 
  GERMAN_CV_FORMATS, 
  getGermanCvFormatById 
} from "../data/germanCvFormatsData";

interface GermanCvFormatSelectorProps {
  selectedFormatId: GermanCvFormatId;
  onSelectFormat: (formatId: GermanCvFormatId) => void;
  onApplyFormatTemplate?: (formatId: GermanCvFormatId) => void;
}

export const GermanCvFormatSelector: React.FC<GermanCvFormatSelectorProps> = ({
  selectedFormatId,
  onSelectFormat,
  onApplyFormatTemplate
}) => {
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedFormat = getGermanCvFormatById(selectedFormatId);

  const getFormatIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "FileSpreadsheet":
        return <FileSpreadsheet className={className} />;
      case "Globe":
        return <Globe className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "GraduationCap":
        return <GraduationCap className={className} />;
      default:
        return <FileSpreadsheet className={className} />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-all">
      {/* Top Header of Format Selector Module */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-4 h-4 text-indigo-400" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              انتخاب فرمت استاندارد رزومه آلمانی (German CV Format Selector)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              مطابق DIN 5008 و قوانین ۲۰۲۶
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pr-7">
            فرمت مدنظر خود را انتخاب فرمایید؛ چیدمان سازنده رزومه، قالب چاپی PDF و متون پیشنهادی به‌طور خودکار متناسب با آن بازآرایی می‌شوند.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowComparisonModal(true)}
            className="text-xs bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="جدول مقایسه تطبیقی فرمت‌ها و توصیه‌های انتخاب"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>راهنمای تفاوت فرمت‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title={isExpanded ? "بستن ماژول" : "باز کردن ماژول"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Format Selection Cards (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GERMAN_CV_FORMATS.map((format) => {
              const isSelected = format.id === selectedFormatId;

              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => onSelectFormat(format.id)}
                  className={`p-3.5 sm:p-4 rounded-xl border-2 text-right transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? "bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-400/50 scale-[1.02]"
                      : "bg-slate-950 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  {/* Top Bar with Icon & Badge */}
                  <div className="space-y-2.5 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-sm" 
                          : "bg-slate-850 text-slate-400 group-hover:text-indigo-300 group-hover:bg-indigo-950/40"
                      }`}>
                        {getFormatIcon(format.iconName)}
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border truncate max-w-[140px] ${format.badgeColor}`}>
                        {format.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-indigo-200 transition-colors flex items-center gap-1.5">
                        <span>{format.titleFa}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 inline" />
                        )}
                      </h4>
                      <div className="text-[10px] text-slate-400 font-mono tracking-tight pt-0.5 truncate" dir="ltr">
                        {format.titleDe}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {format.subtitleFa}
                    </p>
                  </div>

                  {/* Bottom selection indicator */}
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] w-full">
                    <span className="text-slate-500 font-medium">مناسب برای:</span>
                    <span className={`font-bold truncate max-w-[130px] ${
                      isSelected ? "text-indigo-300" : "text-slate-400"
                    }`}>
                      {format.recommendedForRoles[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Format Details Banner & Layout Adaptation Highlights */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400">فرمت فعال چیدمان سازنده:</span>
                <span className="text-xs font-black text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                  {selectedFormat.titleFa} ({selectedFormat.titleDe})
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                  {selectedFormat.featureHighlights[0].label}: {selectedFormat.featureHighlights[0].value}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedFormat.descriptionFa}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 flex-wrap">
                <span className="font-bold text-slate-300">مناسب‌ترین کاربرد:</span>
                <span>{selectedFormat.bestForFa}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center flex-wrap">
              {onApplyFormatTemplate && (
                <button
                  type="button"
                  onClick={() => onApplyFormatTemplate(selectedFormat.id)}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm shadow-indigo-600/20"
                  title="بارگذاری و اعمال متن نمونه معتبر این فرمت در پیش‌نمایش"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>اعمال قالب نمونه {selectedFormat.titleFa.split(" ")[0]}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Format Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" dir="rtl">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    راهنمای جامع مقایسه فرمت‌های رزومه آلمانی (Lebenslauf-Formate)
                  </h3>
                  <p className="text-xs text-slate-400">
                    کدام فرمت شانس پذیرش شما را نزد کارفرمایان و سفارت آلمان حداکثر می‌کند؟
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Comparison Table */}
            <div className="p-5 overflow-y-auto space-y-6 text-xs text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GERMAN_CV_FORMATS.map((f) => (
                  <div 
                    key={f.id} 
                    className={`p-4 rounded-xl border ${
                      f.id === selectedFormatId 
                        ? "bg-slate-950/90 border-indigo-500 ring-1 ring-indigo-500/30" 
                        : "bg-slate-950/40 border-slate-800"
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400">
                          {getFormatIcon(f.iconName, "w-4 h-4")}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{f.titleFa}</h4>
                          <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{f.titleDe}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${f.badgeColor}`}>
                        {f.badge}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {f.descriptionFa}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                      <div className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-200">بهترین برای: </strong>
                          <span>{f.bestForFa}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-200">نقش‌های پیشنهادی: </strong>
                          <span>{f.recommendedForRoles.join("، ")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectFormat(f.id);
                          if (onApplyFormatTemplate) onApplyFormatTemplate(f.id);
                          setShowComparisonModal(false);
                        }}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          f.id === selectedFormatId
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        {f.id === selectedFormatId ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>فرمت انتخاب شده کنونی</span>
                          </>
                        ) : (
                          <>
                            <span>انتخاب و اعمال این فرمت</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Crucial Legal Tip */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>نکته حیاتی برای کارجویان ایرانی متقاضی مهاجرت به آلمان (FEG 2026):</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed pr-6">
                  برای مصاحبه‌های سفارت آلمان، اخذ تاییدیه ZAB/آنابین و شرکت‌های صنعتی بزرگ سنتی، فرمت <strong>Tabellarischer Lebenslauf (DIN 5008)</strong> اولویت اول است زیرا کارشناسان اداری به سرعت تاریخچه بدون وقفه (Lückenloser Lebenslauf) را بررسی می‌کنند. برای موقعیت‌های نرم‌افزاری و استارتاپی، فرمت <strong>Modern Tech</strong> با تمرکز بر Tech-Stack و خروجی پروژه نتیجه بهتری می‌دهد.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                بستن راهنما
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GermanCvFormatSelector;
