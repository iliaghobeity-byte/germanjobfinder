import React, { useState } from "react";
import { jobPortals, recognitionSteps } from "../data";
import { Search, Globe, Landmark, Clock, PiggyBank, ArrowUpRight, CheckCircle2, ChevronLeft, HelpCircle } from "lucide-react";

export default function PortalsAndRecognition() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPortals = jobPortals.filter((portal) => {
    const matchesCategory = selectedCategory === "all" || portal.category === selectedCategory;
    const matchesSearch = portal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          portal.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="portals-recognition-tab" className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Document Recognition Process - Span 6 */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-2 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-indigo-400" /> نقشه راه تایید مدارک تحصیلی و شغلی (Anerkennung)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              کسب تایید مدارک در آلمان سنگِ بنای دریافت ویزای کاری است. قبل از فرستادن رزومه، باید وضعیت ارزیابی خود را به یکی از روش‌های زیر پیش ببرید:
            </p>

            <div className="space-y-6 relative border-r-2 border-slate-800 pr-4 mr-2">
              {recognitionSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Point bullet layout */}
                  <div className="absolute right-0 top-1.5 translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  
                  <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800/60 hover:border-indigo-500/40 transition duration-300">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-xs font-black text-white pr-2">
                        {step.id}. {step.title}
                      </h3>
                      {step.actionUrl && (
                        <a
                          href={step.actionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-0.5"
                        >
                          سامانه رسمی <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-400 border-t border-slate-900/40 pt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        مدت زمان تقریبی: {step.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <PiggyBank className="w-3.5 h-3.5 text-teal-400" />
                        هزینه حدودی: {step.cost}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Searchable Germany Job Boards - Span 6 */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-teal-400" /> پورتال‌های رسمی و معتبر کاریابی آلمان
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              برای جاب‌آفر مستقیم و موفق، روزانه پلتفرم‌های تخصصی زیر را جستجو و موقعیت‌های آلمانی یا انگلیسی را ارزیابی فرمایید.
            </p>

            {/* Sub Filter Category bar */}
            <div className="space-y-4">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto gap-1">
                {[
                  { id: "all", label: "همه موقعیت‌ها" },
                  { id: "official", label: "دولتی / ملی" },
                  { id: "general", label: "عمومی" },
                  { id: "it", label: "تخصصی IT" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-teal-500 text-slate-950"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Simple search bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو در نام سایت‌ها یا حوزه‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              </div>

              {/* Portal Listings */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredPortals.map((portal) => (
                  <div
                    key={portal.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 transition duration-300 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{portal.name}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                          portal.category === "official"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : portal.category === "it"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-slate-850 text-white font-bold border border-slate-700/50"
                        }`}>
                          {portal.category === "official" ? "رسمی فدرال" : portal.category === "it" ? "مخصوص آی‌تی" : "کاریابی عمومی"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed pr-2">
                        {portal.description}
                      </p>
                    </div>

                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition shrink-0 cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                ))}

                {filteredPortals.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    هیچ وب‌سایت کاریابی یافت نشد. فیلتر یا واژه مورد نظر را تغییر دهید.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
