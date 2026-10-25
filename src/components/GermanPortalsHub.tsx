import React, { useState } from "react";
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Search, 
  CheckCircle2, 
  Briefcase,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GermanPortalsHubProps {
  userField: string;
  userCity?: string;
  onVerifyAll?: () => void;
  isVerifyingAll?: boolean;
  jobsCount?: number;
}

export const GermanPortalsHub: React.FC<GermanPortalsHubProps> = ({
  userField,
  userCity = "Germany",
  onVerifyAll,
  isVerifyingAll = false,
  jobsCount = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const fieldQuery = userField || "Software Developer";
  const cityQuery = userCity === "همه شهرهای آلمان" ? "Deutschland" : userCity;

  const portals = [
    {
      id: "stepstone",
      name: "StepStone آلمان",
      nameDe: "StepStone Deutschland",
      badge: "پورتال اول کارفرمایان آلمان",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      description: "بیش از ۸۰,۰۰۰ کارفرمای ثبت شده آلمانی با فیلتر اختصاصی ویزا اسپانسرشیپ و رلوکیشن کامل.",
      url: `https://www.stepstone.de/work/jobs?what=${encodeURIComponent(fieldQuery)}&where=${encodeURIComponent(cityQuery)}`,
      highlight: "بیشترین فراوانی آگهی‌های بلوکارت"
    },
    {
      id: "arbeitsagentur",
      name: "اداره کار فدرال آلمان (Jobbörse)",
      nameDe: "Bundesagentur für Arbeit",
      badge: "مرجع رسمی دولتی آلمان",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      description: "بانک اطلاعات رسمی دولت فدرال؛ مشاغل این سامانه دارای تاییدیه قبلی اداره کار (ZAV) هستند.",
      url: `https://www.arbeitsagentur.de/jobsuche/suche?angebotsart=1&was=${encodeURIComponent(fieldQuery)}&wo=${encodeURIComponent(cityQuery)}`,
      highlight: "معافیت سریع از تست اولویت محلی"
    },
    {
      id: "linkedin",
      name: "لینکدین آلمان",
      nameDe: "LinkedIn Jobs Germany",
      badge: "شبکه بین‌المللی با ویزا",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      description: "بالاترین نرخ جذب متقاضیان انگلیسی‌زبان با امکان مکاتبه و ارسال مستقیم پیام به کارشناسان استخدام.",
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(fieldQuery)}&location=${encodeURIComponent(cityQuery)}&f_TPR=r2592000`,
      highlight: "دسترسی به تیم‌های HR بین‌المللی"
    },
    {
      id: "indeed",
      name: "ایندید آلمان",
      nameDe: "Indeed Deutschland",
      badge: "موتور جستجوی جامع",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      description: "تجمیع‌کننده برخط آگهی‌های استخدامی از تمامی وب‌سایت‌های شرکتی و کاریابی در ۱۶ ایالت آلمان.",
      url: `https://de.indeed.com/jobs?q=${encodeURIComponent(fieldQuery)}&l=${encodeURIComponent(cityQuery)}`,
      highlight: "پایش لحظه‌ای فرصت‌های استخدامی"
    },
    {
      id: "xing",
      name: "زینگ (XING)",
      nameDe: "XING DACH Region",
      badge: "بزرگترین شبکه حرفه‌ای بومی",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      description: "شبکه شغلی اول آلمان، اتریش و سوئیس؛ مناسب شرکت‌های اصیل آلمانی و متوسط (Mittelstand).",
      url: `https://www.xing.com/jobs/search?keywords=${encodeURIComponent(fieldQuery)}`,
      highlight: "ارتباط اختصاصی با کارفرمایان Mittelstand"
    },
    {
      id: "germantechjobs",
      name: "جرمن تک جابز",
      nameDe: "GermanTechJobs",
      badge: "ویژه متقاضیان Non-EU",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      description: "پورتال تخصصی مهندسی با فیلتر تضمین ویزا اسپانسرشیپ و شفافیت کامل میزان حقوق پایه.",
      url: `https://germantechjobs.de/jobs?q=${encodeURIComponent(fieldQuery)}`,
      highlight: "شفافیت ۱۰۰٪ حقوق و ویزا"
    },
    {
      id: "makeitin",
      name: "پورتال رسمی دولت فدرال",
      nameDe: "Make it in Germany",
      badge: "درگاه رسمی وزارت اقتصاد",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      description: "پورتال رسمی دولت فدرال برای جذب نیروی ماهر خارجی (Fachkräfte) منطبق با قانون مهاجرت جدید FEG.",
      url: `https://www.make-it-in-germany.com/en/working-in-germany/job-listings?tx_solr[q]=${encodeURIComponent(fieldQuery)}`,
      highlight: "تاییدیه رسمی رویه سریع ویزا"
    },
    {
      id: "kununu",
      name: "کونونو آلمان (Kununu)",
      nameDe: "Kununu Arbeitgeber-Bewertungen",
      badge: "شفافیت حقوق و رضایت شغلی",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      description: "سامانه مرجع بررسی امتیاز کارفرمایان آلمانی توسط کارمندان؛ بررسی اصالت، فرهنگ سازمانی و حقوق واقعی.",
      url: `https://www.kununu.com/de/search#/?q=${encodeURIComponent(fieldQuery)}`,
      highlight: "استعلام اعتبار و جو شرکت"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-3xl p-5 md:p-6 shadow-xl space-y-5" id="german-portals-hub">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>پایش و راستی‌آزمایی جامع پورتال‌های استخدامی آلمان</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>۸ پورتال معتبر فدرال و بین‌المللی برخط</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>مرکز رصد و بررسی زنده تمام پورتال‌های کاریابی در آلمان</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            جهت حصول اطمینان از <strong className="text-white">وجود قطعی، صحت پیوند و اعتبار حقوقی آگهی‌ها</strong>، هر موقعیت شغلی هم‌زمان در پایگاه داده اداره کار فدرال، استپ‌استون، لینکدین و سامانه‌های تخصصی ویزا اسپانسرشیپ پایش و انطباق داده می‌شود.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onVerifyAll && (
            <button
              onClick={onVerifyAll}
              disabled={isVerifyingAll}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-indigo-950/40 cursor-pointer disabled:opacity-50"
              title="اجرای استعلام عمیق و انطباق چندپورتاله برای تمام موقعیت‌ها"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{isVerifyingAll ? "در حال استعلام هم‌زمان..." : "بررسی عمیق تمام آگهی‌ها"}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer text-xs flex items-center gap-1"
            title={isExpanded ? "بستن پنل پورتال‌ها" : "باز کردن پنل پورتال‌ها"}
          >
            <span className="hidden sm:inline font-bold text-[11px]">{isExpanded ? "پنهان‌سازی" : "نمایش پورتال‌ها"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grid of German Portals */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-4 pt-2 border-t border-slate-800/80"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {portals.map((portal) => (
                <div
                  key={portal.id}
                  className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-indigo-950/30"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-indigo-300 transition">
                          {portal.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {portal.nameDe}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${portal.badgeColor}`}>
                        {portal.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal line-clamp-2">
                      {portal.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold pt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{portal.highlight}</span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">رصد برخط و زنده</span>
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer group-hover:scale-105"
                      title={`جستجوی زنده موقعیت‌های ${fieldQuery} در ${portal.name}`}
                    >
                      <span>ورود و جستجو</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick multi-portal search banner */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>کلیدواژه فعال برای رصد در آلمان: <span className="text-indigo-300 font-mono bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800/40">{fieldQuery}</span> در شهر <span className="text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">{cityQuery}</span></span>
                </span>
                <p className="text-[11px] text-slate-400">
                  تمام آگهی‌های پیشنهادی جهانبان در جدول ذیل دارای پیوند مستقیم به پورتال اصلی کارفرما و صفحات رسمی کاریابی آلمان هستند.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-300 font-bold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
                  {jobsCount} موقعیت با اسپانسرشیپ ویزا
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
