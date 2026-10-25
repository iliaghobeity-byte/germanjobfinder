import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Settings, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  ArrowLeft, 
  RefreshCw, 
  Award, 
  CheckSquare, 
  AlertTriangle, 
  Copy, 
  ExternalLink,
  Clock,
  User,
  Briefcase,
  Building2,
  Play,
  Pause,
  HelpCircle,
  Send,
  History,
  BookOpen,
  ThumbsUp
} from "lucide-react";
import { 
  INTERVIEWER_PERSONAS, 
  InterviewerPersona, 
  InterviewQuestion, 
  InterviewFeedback, 
  InterviewFinalReport 
} from "../interviewHelpers";
import InterviewSkillsProgressChart from "./InterviewSkillsProgressChart";
import InterviewDigitalCertificateModal from "./InterviewDigitalCertificateModal";

interface Profile {
  name: string;
  age: number;
  degree: string;
  experience: number;
  field: string;
  germanLevel: string;
  englishLevel: string;
}

interface InterviewPrepProps {
  profile: Profile | null;
}

interface ExtendedQuestion extends InterviewQuestion {
  interviewerGreetingDe?: string;
  interviewerGreetingFa?: string;
  totalQuestions?: number;
}

export default function InterviewPrep({ profile }: InterviewPrepProps) {
  // Config state
  const [jobTitle, setJobTitle] = useState("");
  const [field, setField] = useState("it");
  const [experienceLevel, setExperienceLevel] = useState("Mid");
  const [language, setLanguage] = useState("German");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("sandra-becker");

  // Selected persona object
  const activePersona: InterviewerPersona = 
    INTERVIEWER_PERSONAS.find(p => p.id === selectedPersonaId) || INTERVIEWER_PERSONAS[0];

  // Flow State
  const [screen, setScreen] = useState<"setup" | "loading_question" | "active" | "evaluating" | "feedback" | "final_report">("setup");
  const [currentQuestion, setCurrentQuestion] = useState<ExtendedQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<InterviewFeedback | null>(null);
  const [finalReport, setFinalReport] = useState<InterviewFinalReport | null>(null);

  // History tracking with full conversational depth
  const [history, setHistory] = useState<{ 
    question: string; 
    questionFa?: string;
    answer: string; 
    feedback: InterviewFeedback 
  }[]>([]);

  // UI state helpers
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showProgressChart, setShowProgressChart] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showStarGuide, setShowStarGuide] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsCurrentTarget, setTtsCurrentTarget] = useState<string | null>(null);

  // Countdown Timer state (90 seconds per question)
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Auto-sync profile info when present
  useEffect(() => {
    if (profile) {
      if (profile.field && !jobTitle) {
        const f = profile.field.toLowerCase();
        if (f.includes("it") || f.includes("نرم‌افزار") || f.includes("برنامه‌نویسی") || f.includes("کامپیوتر")) {
          setField("it");
          setJobTitle("Software Engineer");
          setSelectedPersonaId("klaus-weber");
        } else if (f.includes("پزشک") || f.includes("پرستار") || f.includes("درمان") || f.includes("پزشکی")) {
          setField("medical");
          setJobTitle("Registered Nurse / Healthcare Specialist");
          setSelectedPersonaId("sandra-becker");
        } else if (f.includes("مهندس") || f.includes("مکانیک") || f.includes("برق") || f.includes("عمران")) {
          setField("engineering");
          setJobTitle("Design & Systems Engineer");
          setSelectedPersonaId("claudia-wagner");
        } else {
          setField("general");
          setJobTitle("Project Manager");
        }
      }
      if (profile.experience !== undefined) {
        if (profile.experience < 2) setExperienceLevel("Junior");
        else if (profile.experience >= 5) setExperienceLevel("Senior");
        else setExperienceLevel("Mid");
      }
    }
  }, [profile]);

  // Timer Effect
  useEffect(() => {
    if (screen === "active" && currentQuestion) {
      setTimeLeft(90);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [screen, currentQuestion]);

  useEffect(() => {
    let timerId: any = null;
    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Speech Recognition state (Browser Native)
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Gemini Audio Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === "German" ? "de-DE" : "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        setUserAnswer(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "not-allowed") {
          setRecognitionError("دسترسی به میکروفون مسدود است. لطفاً در تنظیمات مرورگر اجازه دسترسی صوتی را فعال کنید.");
        } else {
          setRecognitionError("خطای تشخیص صدا: " + event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setRecognitionError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition", err);
        setRecognitionError("شروع ضبط صدا انجام نشد. لطفاً دسترسی به میکروفون را بررسی کنید.");
      }
    }
  };

  // Cleanup recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startVoiceRecording = async () => {
    setTranscribeError(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = { mimeType: "audio/webm" };
      if (typeof MediaRecorder !== "undefined") {
        if (!MediaRecorder.isTypeSupported("audio/webm")) {
          options = { mimeType: "audio/mp4" };
          if (!MediaRecorder.isTypeSupported("audio/mp4")) {
            options = { mimeType: "" };
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        if (audioBlob.size === 0) return;
        await sendAudioToGeminiTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) {
            stopVoiceRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setTranscribeError("دسترسی به میکروفون مسدود است. لطفاً دسترسی را در نوار آدرس مرورگر فعال فرمایید.");
      } else {
        setTranscribeError("خطا در دسترسی به میکروفون. اتصال آن را بررسی کنید.");
      }
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const sendAudioToGeminiTranscribe = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setTranscribeError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        try {
          const response = await fetch("/api/gemini/interview/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioData: base64Data,
              mimeType: audioBlob.type,
              language
            })
          });

          if (!response.ok) {
            throw new Error("خطا در ارسال فایل صوتی به سرور.");
          }

          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }

          if (data.text && data.text.trim()) {
            setUserAnswer(prev => (prev ? prev + " " + data.text : data.text));
          } else {
            setTranscribeError("صدای واضحی تشخیص داده نشد. لطفاً دوباره تلاش کنید.");
          }
        } catch (innerErr: any) {
          console.error("Transcribe API Error:", innerErr);
          setTranscribeError(innerErr.message || "خطا در برقراری ارتباط با پردازشگر هوش مصنوعی صوتی.");
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err) {
      console.error("Blob reading error:", err);
      setTranscribeError("خطا در خواندن فایل صوتی ضبط شده.");
      setIsTranscribing(false);
    }
  };

  // TTS browser helper with German native accent
  const speakText = (text: string, lang = "German", targetId = "general") => {
    if (!window.speechSynthesis) return;

    if (ttsActive && ttsCurrentTarget === targetId) {
      window.speechSynthesis.cancel();
      setTtsActive(false);
      setTtsCurrentTarget(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "German" ? "de-DE" : "en-US";
    utterance.rate = 0.95; // slightly slower, clear pronunciation

    // Try to pick German voice if available
    const voices = window.speechSynthesis.getVoices();
    if (lang === "German") {
      const deVoice = voices.find(v => v.lang.startsWith("de") || v.name.includes("Deutsch") || v.name.includes("German"));
      if (deVoice) utterance.voice = deVoice;
    }

    utterance.onend = () => {
      setTtsActive(false);
      setTtsCurrentTarget(null);
    };
    utterance.onerror = () => {
      setTtsActive(false);
      setTtsCurrentTarget(null);
    };

    setTtsActive(true);
    setTtsCurrentTarget(targetId);
    window.speechSynthesis.speak(utterance);
  };

  // Quick word & speech time calculator
  const wordsCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round(wordsCount / 1.8); // ~110-130 words per minute speaking rate

  // Insert helper phrase into answer box
  const handleInsertPhrase = (phrase: string) => {
    setUserAnswer(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${phrase} ` : `${phrase} `;
    });
  };

  // Start interview API call
  const handleStartInterview = async () => {
    setScreen("loading_question");
    setShowTranslation(false);
    setShowHint(false);
    setUserAnswer("");
    setHistory([]);
    setCurrentQuestionIndex(1);

    try {
      const response = await fetch("/api/gemini/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle || "Fachkraft",
          field,
          experienceLevel,
          language,
          interviewType,
          personaId: selectedPersonaId,
          profile: profile ? {
            name: profile.name,
            degree: profile.degree,
            experience: profile.experience,
            field: profile.field,
            germanLevel: profile.germanLevel,
            englishLevel: profile.englishLevel
          } : undefined
        })
      });

      const data = await response.json();
      setCurrentQuestion(data);
      setScreen("active");

      // Automatically speak the opening greeting or question politely if supported
      if (data.interviewerGreetingDe) {
        setTimeout(() => {
          speakText(data.interviewerGreetingDe + " " + data.questionDe, language, "question-main");
        }, 500);
      }
    } catch (error) {
      console.error("Error starting interview", error);
      setScreen("setup");
    }
  };

  // Store next question from response temporarily
  const [nextQuestionObj, setNextQuestionObj] = useState<ExtendedQuestion | null>(null);

  // Submit response & get next / final report API call
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setTtsActive(false);
    }

    setScreen("evaluating");
    const isFinal = currentQuestionIndex >= numQuestions;

    // Build conversation history to send to Gemini
    const conversationHistoryPayload = history.map(h => ({
      question: h.question,
      answer: h.answer
    }));

    try {
      const response = await fetch("/api/gemini/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle || "Fachkraft",
          field,
          experienceLevel,
          language,
          interviewType,
          currentQuestionIndex,
          question: currentQuestion?.questionDe || "",
          answer: userAnswer,
          isFinalQuestion: isFinal,
          conversationHistory: conversationHistoryPayload,
          personaId: selectedPersonaId,
          candidateName: profile?.name || "Bewerber/in"
        })
      });

      const data = await response.json();
      setCurrentFeedback(data.feedback);

      // Save to local session history
      setHistory(prev => [
        ...prev,
        {
          question: currentQuestion?.questionDe || "",
          questionFa: currentQuestion?.questionFa,
          answer: userAnswer,
          feedback: data.feedback
        }
      ]);

      if (isFinal) {
        setFinalReport(data.finalReport);
      } else {
        setNextQuestionObj(data.nextQuestion);
      }

      setScreen("feedback");

      // Auto-speak interviewer's human reaction
      if (data.feedback?.interviewerSpokenReactionDe) {
        setTimeout(() => {
          speakText(data.feedback.interviewerSpokenReactionDe, language, "reaction-main");
        }, 400);
      }
    } catch (error) {
      console.error("Error submitting answer", error);
      setScreen("active");
    }
  };

  const handleNextQuestion = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setTtsActive(false);
    }

    if (nextQuestionObj) {
      setCurrentQuestion(nextQuestionObj);
      setNextQuestionObj(null);
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer("");
      setShowTranslation(false);
      setShowHint(false);
      setScreen("active");

      // Read next question
      setTimeout(() => {
        speakText(nextQuestionObj.questionDe, language, "question-main");
      }, 500);
    } else {
      handleStartInterview();
    }
  };

  const handleFinishInterview = () => {
    setScreen("final_report");
  };

  const handleCopyPhrase = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // German starter phrase chips for candidate answer box
  const germanPhraseChips = [
    { label: "Vielen Dank...", phrase: "Vielen Dank für diese interessante Frage." },
    { label: "In meiner Erfahrung...", phrase: "Meiner praktischen Erfahrung nach..." },
    { label: "Im letzten Projekt...", phrase: "In meinem letzten Projekt war ich zuständig für..." },
    { label: "Konkretes Beispiel...", phrase: "Lassen Sie mich das an einem konkreten Beispiel veranschaulichen:" },
    { label: "Strukturierte Lösung...", phrase: "Wir haben eine systematische Lösung erarbeitet, wodurch..." },
    { label: "Ergebnis erzielt...", phrase: "Dadurch konnten wir die Effizienz deutlich steigern." }
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md p-5 sm:p-8 transition-colors duration-150" id="interview-prep-section">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">اتاق شبیه‌ساز مصاحبه شغلی آلمان</h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                گفتگوی انسانی و بهینه‌سازی سرعت
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              شبیه‌سازی تعاملی جلسه مصاحبه رسمی با کارفرمای آلمانی (Sie/Ihnen)، حفظ پیوستگی پاسخ‌ها، و اصلاحات گرامری در سطح بومی
            </p>
          </div>
        </div>
        
        {screen !== "setup" && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setShowProgressChart(!showProgressChart);
                if (showTranscript) setShowTranscript(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                showProgressChart
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
              title="نمودار تحلیل و پیشرفت مهارت‌های گفتاری با Recharts"
            >
              <TrendingUp className="w-4 h-4" />
              <span>نمودار پیشرفت</span>
            </button>

            <button 
              onClick={() => {
                setShowTranscript(!showTranscript);
                if (showProgressChart) setShowProgressChart(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                showTranscript
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
              title="مشاهده متن گفتگوی رد و بدل شده تا این لحظه"
            >
              <History className="w-4 h-4" />
              <span>روند گفتگو ({history.length})</span>
            </button>

            <button 
              onClick={() => {
                if (window.confirm("آیا مایلید مصاحبه فعلی را متوقف کنید؟ تمامی پیشرفت‌های مصاحبه جاری پاک خواهد شد.")) {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setScreen("setup");
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition cursor-pointer"
              id="quit-interview-button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        )}
      </div>

      {/* PROGRESS CHART DRAWER (WHEN OPEN IN ACTIVE INTERVIEW) */}
      {showProgressChart && (
        <div className="mb-6 animate-fade-in text-right">
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setShowProgressChart(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-2 py-1 rounded-lg cursor-pointer"
            >
              ✕ بستن نمودار
            </button>
          </div>
          <InterviewSkillsProgressChart
            currentSessionHistory={history}
            latestOverallScore={finalReport?.overallScore}
            activeField={field}
          />
        </div>
      )}

      {/* TRANSCRIPT MODAL / DRAWER (WHEN OPEN) */}
      {showTranscript && history.length > 0 && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 animate-fade-in text-right">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-600" />
              <span>تاریخچه و روند مکالمه جلسه مصاحبه</span>
            </span>
            <button 
              onClick={() => setShowTranscript(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              بستن
            </button>
          </div>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {history.map((turn, i) => (
              <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-500">
                  <span>سوال {i + 1}:</span>
                  <span className="font-mono text-indigo-600">{turn.feedback.score} / 100</span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white" dir="ltr">{turn.question}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">پاسخ شما:</p>
                  <p className="text-slate-700 dark:text-slate-300 font-sans" dir="ltr">{turn.answer}</p>
                </div>
                {turn.feedback.interviewerSpokenReactionDe && (
                  <div className="p-2 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-lg text-indigo-950 dark:text-indigo-200 text-[11px] font-medium" dir="ltr">
                    "{turn.feedback.interviewerSpokenReactionDe}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETUP SCREEN */}
      {screen === "setup" && (
        <div className="space-y-6 animate-fade-in text-right">
          
          {/* Profile auto-fill notice */}
          {profile && (
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30 text-right flex items-start gap-3.5 shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-300">
                  پروفایل هوشمند شما بارگذاری و متصل شد!
                </p>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  سیستم به صورت خودکار مشخصات شما را برای مصاحبه تنظیم کرد:
                  <span className="font-bold text-slate-900 dark:text-white mx-1">
                    نام: {profile.name && profile.name !== "کاربر نمونه" ? profile.name : "متقاضی محترم"} | تخصص: {profile.field} | سابقه: {profile.experience} سال | سطح آلمانی: {profile.germanLevel}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Persona Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">مصاحبه‌کننده خود را متناسب با هدف جلسه انتخاب کنید:</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>شخصیت مصاحبه‌کننده آلمانی (Interviewer Persona)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {INTERVIEWER_PERSONAS.map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => setSelectedPersonaId(persona.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative text-right flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-600"
                        : "bg-slate-50/70 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`w-10 h-10 rounded-xl ${persona.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                          {persona.avatarText}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{persona.name}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{persona.role}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mb-1.5 truncate">
                        {persona.company}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {persona.styleDescriptionFa}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        persona.tone === "supportive" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        : persona.tone === "analytical" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      }`}>
                        {persona.tone === "supportive" ? "روانشناختی و تیمی" : persona.tone === "analytical" ? "فنی و معماری" : "استاندارد و مدیریت"}
                      </span>
                      {isSelected && (
                        <span className="font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>انتخاب شده</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Right configuration fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>مشخصات پوزیشن شغلی هدف</span>
              </h3>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">عنوان دقیق پوزیشن کاری (انگلیسی / آلمانی)</label>
                <input 
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer, DevOps Spezialist, Gesundheits- und Krankenpfleger"
                  className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  id="job-title-input"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">فیلد تخصصی فعالیت</label>
                <select 
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  id="field-select"
                >
                  <option value="it">فناوری اطلاعات و نرم‌افزار (IT & Software)</option>
                  <option value="medical">پزشکی، پرستاری و کادر درمان (Pflege & Medizin)</option>
                  <option value="engineering">فنی و مهندسی (Ingenieurwesen)</option>
                  <option value="general">سایر تخصص‌ها / مدیریت و عمومی (General)</option>
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">سطح ارشدیت پوزیشن</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Junior", "Mid", "Senior"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        experienceLevel === level 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                      id={`level-btn-${level}`}
                    >
                      {level === "Junior" ? "جونیور (Junior)" : level === "Mid" ? "میدلول (Mid)" : "سنیور (Senior)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Left configuration fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>تنظیمات زبان و ساختار جلسه</span>
              </h3>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">زبان اصلی مصاحبه</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  id="language-select"
                >
                  <option value="German">آلمانی رسمی (Hochdeutsch) - توصیه شده برای بازار کار</option>
                  <option value="English">انگلیسی بین‌المللی (English)</option>
                  <option value="Mixed">ترکیبی آلمانی و انگلیسی (German-English Mixed)</option>
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">ماهیت و تمرکز پرسش‌ها</label>
                <select 
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  id="interview-type-select"
                >
                  <option value="Mixed">ترکیبی (فنی تخصصی + بررسی رفتارشناسی STAR)</option>
                  <option value="Technical">صرفاً فنی تخصصی (Technical Deep-dive)</option>
                  <option value="HR / Behavioral">صرفاً انگیزش و منابع انسانی (Cultural Fit & HR)</option>
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">تعداد مراحل پرسش و پاسخ</label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        numQuestions === num 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                      id={`questions-btn-${num}`}
                    >
                      {num} سوال
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Speaking Skills Progress Visualization Section */}
          <div className="pt-2">
            <InterviewSkillsProgressChart
              currentSessionHistory={history}
              latestOverallScore={finalReport?.overallScore}
              activeField={field}
            />
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleStartInterview}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
              id="start-interview-btn"
            >
              <span>ورود به اتاق جلسه و شروع مصاحبه</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LOADING QUESTION SCREEN */}
      {screen === "loading_question" && (
        <div className="py-20 text-center space-y-6 animate-pulse">
          <div className="flex justify-center">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 rounded-3xl animate-spin">
              <RefreshCw className="w-10 h-10" />
            </div>
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">در حال آماده‌سازی اتاق مصاحبه هوشمند...</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activePersona.name} در حال مطالعه مشخصات پوزیشن "{jobTitle || "متخصص"}" و طراحی خوش‌آمدگویی رسمی آلمانی است.
            </p>
          </div>
        </div>
      )}

      {/* ACTIVE INTERVIEW SCREEN */}
      {screen === "active" && currentQuestion && (
        <div className="space-y-6 animate-fade-in text-right">
          
          {/* Virtual Room Top Bar with Interviewer Persona Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Interviewer identity & live presence */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl ${activePersona.avatarBg} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                  {activePersona.avatarText}
                </div>
                {/* Live pulsing online dot */}
                <span className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{activePersona.name}</h4>
                  <span className="text-[10px] bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                    {activePersona.department}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activePersona.company} • <span className="text-emerald-600 dark:text-emerald-400 font-bold">حاضر در جلسه</span>
                </p>
              </div>
            </div>

            {/* Countdown timer & progress indicator */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Clock className={`w-4 h-4 ${timeLeft <= 15 ? "text-red-500 animate-pulse" : "text-indigo-600"}`} />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">زمان استاندارد:</span>
                <span className={`text-sm font-mono font-black ${timeLeft <= 15 ? "text-red-500 dark:text-red-400 animate-pulse" : "text-indigo-600 dark:text-indigo-400"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className="text-xs font-black text-slate-700 dark:text-slate-300">
                سوال <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{currentQuestionIndex}</span> از <span className="font-mono">{numQuestions}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(currentQuestionIndex / numQuestions) * 100}%` }}
            />
          </div>

          {/* Opening greeting if Turn 1 */}
          {currentQuestionIndex === 1 && currentQuestion.interviewerGreetingDe && (
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 animate-fade-in text-right space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                  BEGRÜSSUNG DES INTERVIEWERS (خوش‌آمدگویی رسمی مصاحبه‌کننده)
                </span>
                <button 
                  onClick={() => speakText(currentQuestion.interviewerGreetingDe || "", language, "greeting")}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
                  title="شنیدن تلفظ آلمانی خوش‌آمدگویی"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${ttsActive && ttsCurrentTarget === "greeting" ? "animate-bounce text-indigo-600" : ""}`} />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed" dir="ltr">
                "{currentQuestion.interviewerGreetingDe}"
              </p>
              {currentQuestion.interviewerGreetingFa && (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {currentQuestion.interviewerGreetingFa}
                </p>
              )}
            </div>
          )}

          {/* Contextual Transition from previous turn (Turn 2+) */}
          {currentQuestion.contextualTransitionDe && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium" dir="ltr">
              💬 <span className="italic">{currentQuestion.contextualTransitionDe}</span>
            </div>
          )}

          {/* German Recruiter Question Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-4 left-4 flex gap-2">
              <button 
                onClick={() => speakText(currentQuestion.questionDe, language, "question-main")}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-sm"
                title="پخش صوتی تلفظ سوال به زبان آلمانی"
                id="tts-speak-question-button"
              >
                <Volume2 className={`w-4 h-4 ${ttsActive && ttsCurrentTarget === "question-main" ? "text-indigo-600 animate-bounce" : ""}`} />
              </button>
            </div>
            
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-black tracking-wider uppercase mb-2">
              FRAGE DER PERSONALABTEILUNG (سوال رسمی مصاحبه‌کننده)
            </p>
            <h4 className="text-lg font-black text-slate-900 dark:text-white leading-relaxed font-sans px-8" dir="ltr">
              {currentQuestion.questionDe}
            </h4>

            {showTranslation && (
              <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 text-right animate-fade-in">
                <p className="text-xs text-slate-400 font-bold mb-1">ترجمه فارسی سوال:</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">{currentQuestion.questionFa}</p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2.5 mt-5">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer shadow-sm"
                id="toggle-translation-button"
              >
                {showTranslation ? "پنهان‌سازی ترجمه" : "مشاهده ترجمه فارسی"}
              </button>
              
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer shadow-sm"
                id="toggle-hint-button"
              >
                {showHint ? "پنهان‌سازی راهنما" : "راهنمایی ساختار پاسخ (Tips)"}
              </button>

              <button
                onClick={() => setShowStarGuide(!showStarGuide)}
                className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition cursor-pointer shadow-sm"
              >
                {showStarGuide ? "بستن راهنمای STAR" : "فرمول استاندارد STAR"}
              </button>
            </div>
          </div>

          {/* Hints Card */}
          {showHint && (
            <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 animate-fade-in text-right">
              <p className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>چه معیارهایی در مصاحبه‌های آلمان برای این سوال ارزیابی می‌شود؟</span>
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 font-semibold leading-relaxed">
                {currentQuestion.hints}
              </p>
            </div>
          )}

          {/* STAR Framework Cheat Sheet Drawer */}
          {showStarGuide && (
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/70 dark:border-indigo-800/60 animate-fade-in text-right space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-black text-xs">
                <BookOpen className="w-4 h-4" />
                <span>روش پاسخ‌دهی استاندارد آلمانی (STAR-Methode):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  <span className="font-black text-indigo-600 block mb-0.5">S - Situation (موقعیت)</span>
                  <span className="text-slate-600 dark:text-slate-400">شرح مختصر چالش اولیه یا پروژه کاری</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  <span className="font-black text-indigo-600 block mb-0.5">T - Task (وظیفه شما)</span>
                  <span className="text-slate-600 dark:text-slate-400">نقش و مسئولیت مستقیم شما در حل چالش</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  <span className="font-black text-indigo-600 block mb-0.5">A - Action (اقدام عملی)</span>
                  <span className="text-slate-600 dark:text-slate-400">مراحل، متدولوژی، ابزارها و هماهنگی تیمی</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  <span className="font-black text-indigo-600 block mb-0.5">R - Result (نتیجه ملموس)</span>
                  <span className="text-slate-600 dark:text-slate-400">دستاورد عددی یا یادگیری ماندگار شما</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick German Phrase Chips */}
          <div className="space-y-1.5 text-right">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              واژگان و عبارت‌های کلیدی طلایی برای شروع و گسترش پاسخ (کلیک برای درج):
            </span>
            <div className="flex flex-wrap gap-1.5" dir="ltr">
              {germanPhraseChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertPhrase(chip.phrase)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-indigo-950 dark:text-slate-300 dark:hover:text-indigo-300 text-[11px] font-medium transition cursor-pointer border border-slate-200/60 dark:border-slate-700"
                >
                  + {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area response with voice recorder integration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]" dir="ltr">
                <span>{wordsCount} words</span>
                <span>•</span>
                <span>{userAnswer.length} chars</span>
                <span>•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">~{estimatedSeconds}s گفتار</span>
              </div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>پاسخ خود را بیان کنید یا بنویسید (ترجیحاً آلمانی / انگلیسی):</span>
              </label>
            </div>

            <div className="relative">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Ich freue mich über diese Gelegenheit. Zu Ihren Punkten möchte ich folgendes erläutern..."
                className="w-full h-44 p-4 text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed resize-none"
                dir="ltr"
                id="interview-answer-textarea"
              />

              {recognitionSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute bottom-4 left-4 p-3 rounded-full shadow-md transition-all cursor-pointer ${
                    isListening 
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                  title={isListening ? "توقف ضبط صدا" : "شروع تایپ صوتی زنده مرورگر"}
                  id="voice-input-button"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>

            {isListening && (
              <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 justify-end animate-pulse">
                <span>سیستم صوتی در حال گوش دادن و تایپ آلمانی است. شمرده صحبت کنید...</span>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
              </p>
            )}

            {/* Vocal Input options with Gemini */}
            <div className="mt-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-right space-y-3 shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-black">
                  پردازش صوتی ابری
                </span>
                <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>ضبط صوتی با تبدیل دقیق هوش مصنوعی (جمینای)</span>
                </h5>
              </div>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                صدای خود را ضبط کنید تا مدل جمینای با دقت بالا صحبت شما را به متن تبدیل کرده و به پاسخ جاری اضافه کند.
              </p>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                {transcribeError && (
                  <p className="text-xs font-bold text-red-500 flex-1 text-right leading-relaxed">
                    {transcribeError}
                  </p>
                )}

                {isTranscribing && (
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-black animate-pulse flex-1 justify-end">
                    <span>در حال تبدیل صوت به متن با هوش مصنوعی...</span>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                )}

                {isRecording && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse flex-1 justify-end">
                    <span>در حال ضبط صدا ({recordingTime} ثانیه)...</span>
                    <span className="flex gap-0.5 items-center">
                      <span className="w-1 h-2.5 bg-red-500 rounded-full animate-bounce delay-75" />
                      <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce" />
                      <span className="w-1 h-2 bg-red-500 rounded-full animate-bounce delay-150" />
                    </span>
                  </div>
                )}

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    disabled={isTranscribing}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Mic className="w-4 h-4" />
                    <span>شروع ضبط صدای پاسخ</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>توقف و تبدیل به متن</span>
                  </button>
                )}
              </div>
            </div>

            {timeLeft === 0 && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/40 text-right animate-fade-in flex flex-col gap-1">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-black text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>زمان استاندارد به پایان رسید!</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  زمان ۹۰ ثانیه‌ای به پایان رسیده است. لطفاً پاسخ خود را ثبت کرده و دکمه زیر را برای دریافت بازخورد فوری بفشارید.
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className={`px-7 py-3.5 rounded-xl font-black text-sm transition flex items-center gap-2 cursor-pointer ${
                userAnswer.trim()
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700"
              }`}
              id="submit-answer-button"
            >
              <span>ارسال پاسخ و دریافت بازخورد</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* EVALUATING RESPONSE SCREEN */}
      {screen === "evaluating" && (
        <div className="py-20 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl dark:bg-indigo-950 dark:text-indigo-300 animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-850 dark:text-slate-100">
              {activePersona.name} در حال ارزیابی پاسخ شماست...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              سیستم در حال ارزیابی انطباق پاسخ با سوال، ساختار گرامری، ترتیب افعال، و آماده‌سازی واکنش کلامی طبیعی است.
            </p>
          </div>
        </div>
      )}

      {/* INTERMEDIATE FEEDBACK SCREEN */}
      {screen === "feedback" && currentFeedback && (
        <div className="space-y-6 animate-fade-in text-right">
          
          {/* Header Bar */}
          <div className="bg-indigo-50 dark:bg-slate-950/70 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-850 dark:text-slate-200">
                ارزیابی مرحله‌ای پاسخ شماره {currentQuestionIndex}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">امتیاز این پاسخ:</span>
              <div className={`px-3 py-1 rounded-full text-xs font-black font-mono shadow-sm ${
                currentFeedback.score >= 80 ? "bg-emerald-600 text-white"
                : currentFeedback.score >= 60 ? "bg-indigo-600 text-white"
                : "bg-amber-600 text-white"
              }`}>
                {currentFeedback.score} / 100
              </div>
            </div>
          </div>

          {/* HUMAN INTERVIEWER VERBAL REACTION BUBBLE */}
          {currentFeedback.interviewerSpokenReactionDe && (
            <div className="p-5 bg-gradient-to-r from-indigo-50/90 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/30 rounded-2xl border border-indigo-200/70 dark:border-indigo-800/60 shadow-sm relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${activePersona.avatarBg} text-white flex items-center justify-center font-bold text-[10px]`}>
                    {activePersona.avatarText}
                  </div>
                  <span className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                    واکنش کلامی {activePersona.name} به پاسخ شما:
                  </span>
                </div>
                
                <button
                  onClick={() => speakText(currentFeedback.interviewerSpokenReactionDe || "", language, "reaction-main")}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
                  title="شنیدن واکنش کلامی مصاحبه‌کننده"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${ttsActive && ttsCurrentTarget === "reaction-main" ? "animate-bounce text-indigo-600" : ""}`} />
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed font-sans" dir="ltr">
                "{currentFeedback.interviewerSpokenReactionDe}"
              </p>
              {currentFeedback.interviewerSpokenReactionFa && (
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-2 pt-2 border-t border-indigo-100/60 dark:border-indigo-900/30">
                  {currentFeedback.interviewerSpokenReactionFa}
                </p>
              )}
            </div>
          )}

          {/* Answer Relevance & Question Alignment */}
          {currentFeedback.answerRelevanceCommentFa && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-black text-slate-900 dark:text-slate-100">ارزیابی انطباق پاسخ با پرسش کارفرما:</span>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {currentFeedback.answerRelevanceCommentFa}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Right: Question & User's Answer recapitulation */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-black mb-1">سوال مطرح شده:</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-sans leading-relaxed" dir="ltr">
                  {currentQuestion?.questionDe}
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-black mb-1">پاسخ ثبت شده شما:</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 font-sans leading-relaxed" dir="ltr">
                  {userAnswer}
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40">
                <h5 className="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>تحلیل و جمع‌بندی کلی عملکرد</span>
                </h5>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 font-semibold leading-relaxed">
                  {currentFeedback.overallCommentFa}
                </p>
              </div>
            </div>

            {/* Left: Detailed Grammar & Vocabulary Upgrades */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 rounded-2xl border border-amber-200/70 dark:border-amber-800/40">
                <h5 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>خطاهای گرامری و ترتیب افعال (Grammatik)</span>
                </h5>
                <p className="text-xs text-amber-800 dark:text-amber-200 font-semibold leading-relaxed">
                  {currentFeedback.grammarCorrections}
                </p>
              </div>

              <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/40">
                <h5 className="text-xs font-black text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                  <span>ارتقای واژگان تخصصی (Wortschatz)</span>
                </h5>
                <p className="text-xs text-indigo-800 dark:text-indigo-200 font-semibold leading-relaxed">
                  {currentFeedback.vocabularySuggestions}
                </p>
              </div>
            </div>
          </div>

          {/* Model Answer (Upgrade) */}
          <div className="p-5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
            <button 
              onClick={() => speakText(currentFeedback.improvedAnswerDe, language, "improved-model")}
              className="absolute top-4 left-4 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-sm"
              title="پخش صوتی تلفظ صحیح بومی"
              id="tts-speak-improved-button"
            >
              <Volume2 className={`w-4 h-4 ${ttsActive && ttsCurrentTarget === "improved-model" ? "text-indigo-600 animate-bounce" : ""}`} />
            </button>

            <h5 className="text-xs font-black text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>پاسخ جایگزین بهینه در سطح بومی (Native-Level Model Answer):</span>
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">
              توصیه می‌شود ساختار این پاسخ را مرور و تمرین کنید:
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed font-sans pr-2" dir="ltr">
              {currentFeedback.improvedAnswerDe}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-end gap-3">
            {currentQuestionIndex < numQuestions ? (
              <button
                onClick={handleNextQuestion}
                className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-2"
                id="continue-next-question-btn"
              >
                <span>ادامه به سوال بعدی</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishInterview}
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                id="finish-interview-btn"
              >
                <span>پایان مصاحبه و مشاهده کارنامه نهایی</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* FINAL REPORT SCREEN */}
      {screen === "final_report" && finalReport && (
        <div className="space-y-8 animate-fade-in text-right">
          
          {/* Header Summary */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-600/20">
            <div className="space-y-3 text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20">
                <Award className="w-4 h-4 text-amber-300" />
                <span>کارنامه جامع و رسمی شبیه‌ساز مصاحبه</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">نتیجه ارزیابی عملکرد استخدامی در آلمان</h3>
              <p className="text-xs text-slate-100 font-semibold leading-relaxed">
                ارزیابی هوشمند توسط {activePersona.name} برای موقعیت "{jobTitle || "متخصص"}" بر اساس استانداردهای بازار کار آلمان
              </p>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-28 h-28 flex items-center justify-center bg-white/15 rounded-full border border-white/25 shadow-inner">
                <div className="text-center">
                  <span className="block text-3xl font-black font-mono leading-none">{finalReport.overallScore}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-200">امتیاز نهایی</span>
                </div>
              </div>
              <span className="mt-3 text-xs font-black text-amber-300 bg-white/20 px-3.5 py-1 rounded-full border border-white/15">
                {finalReport.marketReadiness}
              </span>
            </div>
          </div>

          {/* DIGITAL CERTIFICATE CALL-TO-ACTION BANNER */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-indigo-500/15 dark:from-amber-950/30 dark:via-indigo-950/20 dark:to-slate-900 rounded-3xl border-2 border-amber-400/40 dark:border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
            <div className="flex items-center gap-4 text-right">
              <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-amber-600 text-white rounded-2xl shadow-lg shadow-amber-500/25 shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    صدور گواهینامه دیجیتال رسمی مصاحبه (Digital Certificate)
                  </h4>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                    تأییدیه رسمی
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  گواهینامه رسمی آمادگی شغلی با امضای دیجیتال {activePersona.name}، ریز نمرات گرامر و واژگان تخصصی، با قابلیت دانلود فایل تصویری باکیفیت (PNG) یا سند PDF استاندارد A4.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2 shrink-0 animate-pulse hover:animate-none"
              id="open-digital-certificate-btn"
            >
              <Award className="w-4 h-4" />
              <span>مشاهده و دانلود گواهینامه</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Strengths & Improvements */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
                <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-200 flex items-center gap-2 pb-3 border-b border-emerald-200/50 dark:border-emerald-800/50 mb-4">
                  <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>نقاط قوت شما در این مصاحبه (Stärken)</span>
                </h4>
                <ul className="space-y-3 text-xs text-emerald-900 dark:text-emerald-200 font-semibold">
                  {finalReport.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0 mt-1.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 shadow-sm">
                <h4 className="text-sm font-black text-amber-950 dark:text-amber-200 flex items-center gap-2 pb-3 border-b border-amber-200/50 dark:border-amber-800/50 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>زمینه‌های نیازمند تقویت (Verbesserungspotenziale)</span>
                </h4>
                <ul className="space-y-3 text-xs text-amber-900 dark:text-amber-200 font-semibold">
                  {finalReport.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0 mt-1.5" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Grammar & Terminology analysis */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>ارزیابی تسلط بر گرامر کاری آلمان (Grammatik-Audit)</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {finalReport.grammarSummary}
                </p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>ارزیابی لغات و اصطلاحات تخصصی (Fachwortschatz)</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {finalReport.terminologySummary}
                </p>
              </div>

              {/* Practice checklist with copy & audio */}
              <div className="p-5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
                <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>عبارت‌های طلایی پیشنهادی برای تمرین روزانه:</span>
                </h4>
                <div className="space-y-2">
                  {finalReport.practiceChecklist.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between gap-3">
                      <div className="text-right flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white" dir="ltr">{item.german}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.persian}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => speakText(item.german, "German", `phrase-${idx}`)}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer"
                          title="شنیدن تلفظ"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyPhrase(item.german, idx)}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer"
                          title="کپی عبارت"
                        >
                          {copiedIndex === idx ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Speaking Skills Progress Visualization in Final Scorecard */}
          <div className="pt-4 border-t border-slate-150 dark:border-slate-800">
            <InterviewSkillsProgressChart
              currentSessionHistory={history}
              latestOverallScore={finalReport.overallScore}
              activeField={field}
            />
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-150 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>دریافت و صدور گواهینامه دیجیتال</span>
            </button>

            <button
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setScreen("setup");
              }}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>شروع یک مصاحبه جدید با سناریوی دیگر</span>
            </button>
          </div>
        </div>
      )}

      {/* DIGITAL CERTIFICATE MODAL */}
      {showCertificateModal && finalReport && (
        <InterviewDigitalCertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          candidateName={profile?.name || "Ilia Ghobeity"}
          jobTitle={jobTitle || "Fachkraft"}
          field={field}
          language={language}
          finalReport={finalReport}
          activePersona={activePersona}
          totalQuestions={numQuestions}
        />
      )}

    </div>
  );
}
