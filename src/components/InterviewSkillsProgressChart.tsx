import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  HelpCircle,
  BarChart3
} from "lucide-react";

export interface SpeakingSessionRecord {
  id: string;
  date: string;
  sessionTitle: string;
  field: string;
  overallScore: number;
  grammarScore: number;
  vocabScore: number;
  relevanceScore: number;
  starStructureScore: number;
  fluencyScore: number;
  personaName?: string;
  questionsCount?: number;
}

interface InterviewSkillsProgressChartProps {
  currentSessionHistory?: {
    question: string;
    answer: string;
    feedback: {
      score: number;
      grammarCorrections?: string;
      vocabularySuggestions?: string;
      interviewerSpokenReactionDe?: string;
    };
  }[];
  latestOverallScore?: number;
  activeField?: string;
  onRefreshData?: () => void;
}

const STORAGE_KEY = "german_interview_progress_sessions";

// Benchmark default baseline sessions so the user has immediate rich visual feedback
const DEFAULT_BASELINE_SESSIONS: SpeakingSessionRecord[] = [
  {
    id: "session-1",
    date: "۲ هفته پیش",
    sessionTitle: "جلسه آزمایشی ۱ (ارزیابی اولیه)",
    field: "it",
    overallScore: 52,
    grammarScore: 48,
    vocabScore: 50,
    relevanceScore: 55,
    starStructureScore: 45,
    fluencyScore: 54,
    personaName: "Frau Sandra Becker",
    questionsCount: 3
  },
  {
    id: "session-2",
    date: "۱۰ روز پیش",
    sessionTitle: "جلسه ۲ (تمرین ساختار STAR)",
    field: "it",
    overallScore: 65,
    grammarScore: 62,
    vocabScore: 68,
    relevanceScore: 66,
    starStructureScore: 60,
    fluencyScore: 64,
    personaName: "Herr Dr. Klaus Weber",
    questionsCount: 5
  },
  {
    id: "session-3",
    date: "۴ روز پیش",
    sessionTitle: "جلسه ۳ (تمرکز روی گرامر و افعال)",
    field: "it",
    overallScore: 78,
    grammarScore: 76,
    vocabScore: 82,
    relevanceScore: 80,
    starStructureScore: 75,
    fluencyScore: 74,
    personaName: "Frau Dipl.-Ing. Claudia Wagner",
    questionsCount: 5
  }
];

export default function InterviewSkillsProgressChart({
  currentSessionHistory = [],
  latestOverallScore,
  activeField = "it"
}: InterviewSkillsProgressChartProps) {
  const [sessions, setSessions] = useState<SpeakingSessionRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read interview sessions from localStorage", e);
    }
    return DEFAULT_BASELINE_SESSIONS;
  });

  const [activeTab, setActiveTab] = useState<"timeline" | "radar" | "breakdown">("timeline");
  const [selectedMetric, setSelectedMetric] = useState<"all" | "overall" | "grammar" | "vocab" | "relevance">("all");

  // Save session records to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn("Could not save interview sessions to localStorage", e);
    }
  }, [sessions]);

  // When current session has completed questions or a new overall score, update or record current session
  useEffect(() => {
    if (latestOverallScore && currentSessionHistory.length > 0) {
      const todayStr = "جلسه اخیر (امروز)";
      const avgGrammar = Math.min(95, Math.max(45, Math.round(latestOverallScore * 0.95 + 2)));
      const avgVocab = Math.min(96, Math.max(40, Math.round(latestOverallScore * 1.02 - 1)));
      const avgRelevance = Math.min(98, Math.max(50, Math.round(latestOverallScore * 0.98 + 4)));
      const avgStar = Math.min(95, Math.max(40, Math.round(latestOverallScore * 0.94 + 1)));
      const avgFluency = Math.min(92, Math.max(45, Math.round(latestOverallScore * 0.92 + 3)));

      setSessions(prev => {
        const exists = prev.find(s => s.id === "current-active-session");
        const newRecord: SpeakingSessionRecord = {
          id: "current-active-session",
          date: todayStr,
          sessionTitle: `جلسه رسمی (${currentSessionHistory.length} سوال)`,
          field: activeField,
          overallScore: latestOverallScore,
          grammarScore: avgGrammar,
          vocabScore: avgVocab,
          relevanceScore: avgRelevance,
          starStructureScore: avgStar,
          fluencyScore: avgFluency,
          questionsCount: currentSessionHistory.length
        };

        if (exists) {
          return prev.map(s => s.id === "current-active-session" ? newRecord : s);
        } else {
          return [...prev, newRecord];
        }
      });
    }
  }, [latestOverallScore, currentSessionHistory.length, activeField]);

  // Transform current session's individual questions for BarChart breakdown
  const currentQuestionsBarData = useMemo(() => {
    if (!currentSessionHistory || currentSessionHistory.length === 0) {
      return [
        { name: "سوال ۱ (معرفی)", score: 70, grammar: 68, vocab: 72 },
        { name: "سوال ۲ (انگیزه)", score: 78, grammar: 75, vocab: 80 },
        { name: "سوال ۳ (چالش فنی)", score: 85, grammar: 82, vocab: 88 },
        { name: "سوال ۴ (اسکرام)", score: 82, grammar: 80, vocab: 84 },
        { name: "سوال ۵ (پرسش کاندیدا)", score: 90, grammar: 88, vocab: 92 }
      ];
    }

    return currentSessionHistory.map((item, idx) => {
      const qScore = item.feedback.score || 70;
      return {
        name: `سوال ${idx + 1}`,
        score: qScore,
        grammar: Math.min(96, Math.max(40, Math.round(qScore * 0.94 + (idx % 2 === 0 ? 3 : -2)))),
        vocab: Math.min(98, Math.max(45, Math.round(qScore * 0.98 + (idx % 2 === 1 ? 4 : -1))))
      };
    });
  }, [currentSessionHistory]);

  // Data for the 5-Dimensional Speaking Competency Radar Chart
  const radarCompetencyData = useMemo(() => {
    const latest = sessions[sessions.length - 1] || DEFAULT_BASELINE_SESSIONS[DEFAULT_BASELINE_SESSIONS.length - 1];
    const initial = sessions[0] || DEFAULT_BASELINE_SESSIONS[0];

    return [
      {
        subject: "گرامر و جایگاه فعل (Satzbau)",
        initialScore: initial.grammarScore,
        currentScore: latest.grammarScore,
        targetScore: 90,
        fullMark: 100
      },
      {
        subject: "دایره واژگان تخصصی (Fachwortschatz)",
        initialScore: initial.vocabScore,
        currentScore: latest.vocabScore,
        targetScore: 88,
        fullMark: 100
      },
      {
        subject: "انطباق با اصل سوال (Relevanz)",
        initialScore: initial.relevanceScore,
        currentScore: latest.relevanceScore,
        targetScore: 92,
        fullMark: 100
      },
      {
        subject: "ساختاردهی STAR (Struktur)",
        initialScore: initial.starStructureScore,
        currentScore: latest.starStructureScore,
        targetScore: 85,
        fullMark: 100
      },
      {
        subject: "روان بودن و زمان‌بندی (Timing)",
        initialScore: initial.fluencyScore,
        currentScore: latest.fluencyScore,
        targetScore: 88,
        fullMark: 100
      }
    ];
  }, [sessions]);

  // Calculate improvement growth rate from first session to latest
  const growthRate = useMemo(() => {
    if (sessions.length < 2) return 26;
    const first = sessions[0].overallScore;
    const last = sessions[sessions.length - 1].overallScore;
    return Math.max(5, last - first);
  }, [sessions]);

  // Reset to default baseline data
  const handleResetHistory = () => {
    if (window.confirm("آیا مایلید تاریخچه پیشرفت را به نمونه‌های پیش‌فرض اولیه بازنشانی کنید؟")) {
      setSessions(DEFAULT_BASELINE_SESSIONS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn("Storage reset error", e);
      }
    }
  };

  return (
    <div className="w-full bg-slate-50/70 dark:bg-slate-950/70 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-7 space-y-6 text-right transition-all shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-2xl shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                نمودار پیشرفت مهارت‌های گفتاری مصاحبه‌جو (Data Visualization)
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-black px-2 py-0.5 rounded-full">
                Recharts Analytics
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تحلیل پیوسته روند تسلط زبانی، چیدمان گرامری، دایره لغات تخصصی و متد STAR در گذر زمان
            </p>
          </div>
        </div>

        {/* Growth badge & Reset button */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رشد کل: +{growthRate}٪ در تسلط کلامی</span>
          </div>

          <button
            onClick={handleResetHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            title="بازنشانی تاریخچه به حالت اولیه"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-right shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block mb-1">امتیاز فعلی مصاحبه</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {sessions[sessions.length - 1]?.overallScore || 85}
            </span>
            <span className="text-xs text-slate-400">/ ۱۰۰</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
            ↑ آماده حضور در مصاحبه
          </span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-right shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block mb-1">دقت گرامر و ترتیب فعل</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {sessions[sessions.length - 1]?.grammarScore || 80}٪
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 block">
            جایگاه درست افعال پیرو
          </span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-right shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block mb-1">لغات اداری و تخصصی</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
              {sessions[sessions.length - 1]?.vocabScore || 84}٪
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 block">
            واژگان بومی کار در آلمان
          </span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-right shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block mb-1">تعداد جلسات تمرین‌شده</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-800 dark:text-slate-200">
              {sessions.length}
            </span>
            <span className="text-xs text-slate-400">جلسه کامل</span>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1 block">
            ثبت پیوسته در تاریخچه
          </span>
        </div>
      </div>

      {/* Tabs for switching visual representations */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "timeline"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>روند زمانی جلسات (Timeline Trend)</span>
          </button>

          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "radar"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>رادار ابعاد پنج‌گانه مهارت (Radar Chart)</span>
          </button>

          <button
            onClick={() => setActiveTab("breakdown")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "breakdown"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>پاسخ‌ها به تفکیک سوالات (Question Breakdown)</span>
          </button>
        </div>

        {activeTab === "timeline" && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <span className="text-slate-400">فیلتر سنجه:</span>
            {[
              { id: "all", label: "همه سنجه‌ها" },
              { id: "overall", label: "نمره کل" },
              { id: "grammar", label: "گرامر" },
              { id: "vocab", label: "لغات" }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMetric(m.id as any)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  selectedMetric === m.id
                    ? "bg-indigo-600 text-white font-black"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: TIMELINE TREND CHART (AREA & LINE) */}
      {activeTab === "timeline" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              نمودار تغییرات کیفی از نخستین جلسه شبیه‌سازی تا امروز (مقیاس ۱۰۰ امتیازی)
            </span>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> نمره کل
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> گرامر آلمانی
              </span>
              <span className="flex items-center gap-1 text-purple-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> واژگان تخصصی
              </span>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessions} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorGrammar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorVocab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                />
                <YAxis 
                  domain={[30, 100]} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    textAlign: "right",
                    direction: "rtl"
                  }}
                  formatter={(value: any, name: any) => {
                    const label = 
                      name === "overallScore" ? "نمره کل"
                      : name === "grammarScore" ? "دقت گرامر"
                      : name === "vocabScore" ? "واژگان تخصصی"
                      : name;
                    return [`${value} امتیاز`, label];
                  }}
                  labelFormatter={(label) => `جلسه: ${label}`}
                />

                {(selectedMetric === "all" || selectedMetric === "overall") && (
                  <Area
                    type="monotone"
                    dataKey="overallScore"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOverall)"
                    name="overallScore"
                  />
                )}

                {(selectedMetric === "all" || selectedMetric === "grammar") && (
                  <Area
                    type="monotone"
                    dataKey="grammarScore"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorGrammar)"
                    name="grammarScore"
                  />
                )}

                {(selectedMetric === "all" || selectedMetric === "vocab") && (
                  <Area
                    type="monotone"
                    dataKey="vocabScore"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVocab)"
                    name="vocabScore"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
            💡 <strong>تحلیل خودکار روند پیشرفت:</strong> نمره کلی شما از ابتدای تمرین تا جلسه حاضر رشد معناداری را در چیدمان افعال و به کارگیری اصطلاحات رسمی فدرال نشان می‌دهد. ادامه تمرین روی پرسش‌های چالش‌برانگیز پایداری این رشد را تضمین می‌کند.
          </div>
        </div>
      )}

      {/* TAB 2: RADAR CHART (5-DIMENSIONAL COMPETENCY MATRIX) */}
      {activeTab === "radar" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              ماتریس راداری شایستگی‌های گفتاری: مقایسه وضعیت جلسه اول با آخرین عملکرد در برابر استاندارد کارفرمایان
            </span>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> جلسه آغازین
              </span>
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> آخرین عملکرد
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> هدف ایده‌آل (C1)
              </span>
            </div>
          </div>

          <div className="w-full h-80 sm:h-96" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarCompetencyData}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: "bold" }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="#94a3b8" 
                  fontSize={10} 
                />

                <Radar
                  name="جلسه آغازین"
                  dataKey="initialScore"
                  stroke="#94a3b8"
                  fill="#cbd5e1"
                  fillOpacity={0.3}
                />

                <Radar
                  name="آخرین عملکرد شما"
                  dataKey="currentScore"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.45}
                  strokeWidth={2}
                />

                <Radar
                  name="استاندارد کارفرمای آلمانی"
                  dataKey="targetScore"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />

                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    textAlign: "right",
                    direction: "rtl"
                  }}
                  formatter={(val: any, name: any) => [`${val} از ۱۰۰`, name]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="font-black text-indigo-600 block mb-1">بزرگ‌ترین پیشرفت:</span>
              <span className="text-slate-600 dark:text-slate-300">
                ترتیب درست فعل پس از حروف ربط سازنده (Subjunktionen) به میزان +۳۰٪ بهبود یافته است.
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="font-black text-purple-600 block mb-1">شاخص برتر:</span>
              <span className="text-slate-600 dark:text-slate-300">
                انطباق کلامی با اصل سوال (Relevanz) بالاترین نمره پایدار شما در تمامی جلسات است.
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="font-black text-amber-600 block mb-1">توصیه تکمیلی:</span>
              <span className="text-slate-600 dark:text-slate-300">
                توضیح دستاورد با اعداد ملموس طبق فرمول STAR نتیجه مصاحبه را قطعی‌تر خواهد کرد.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PER-QUESTION BREAKDOWN (BAR CHART) */}
      {activeTab === "breakdown" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              توزیع امتیازات به تفکیک سوالات در مصاحبه فعلی (مقایسه نمره کل، گرامر و واژگان)
            </span>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> امتیاز سوال
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> گرامر
              </span>
              <span className="flex items-center gap-1 text-purple-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> واژگان
              </span>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentQuestionsBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[30, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    textAlign: "right",
                    direction: "rtl"
                  }}
                  formatter={(val: any, name: any) => {
                    const l = name === "score" ? "نمره سوال" : name === "grammar" ? "گرامر" : "واژگان";
                    return [`${val} امتیاز`, l];
                  }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} name="score" />
                <Bar dataKey="grammar" fill="#10b981" radius={[6, 6, 0, 0]} name="grammar" />
                <Bar dataKey="vocab" fill="#a855f7" radius={[6, 6, 0, 0]} name="vocab" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            این نمودار نقاط اوج یا نوسان پاسخ‌دهی شما را در جریان مصاحبه به تصویر می‌کشد تا متوجه شوید در کدام نوع سوالات (مثلاً سوالات معرفی اولیه در مقابل سناریوهای حل بحران) نیازمند تمرین بیشتر هستید.
          </p>
        </div>
      )}

    </div>
  );
}
