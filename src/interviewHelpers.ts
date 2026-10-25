export interface InterviewQuestion {
  questionId: number;
  questionDe: string;
  questionFa: string;
  hints: string;
  idealAnswerDe: string;
  contextualTransitionDe?: string;
}

export interface InterviewFeedback {
  score: number;
  interviewerSpokenReactionDe?: string;
  interviewerSpokenReactionFa?: string;
  answerRelevanceCommentFa?: string;
  grammarCorrections: string;
  vocabularySuggestions: string;
  improvedAnswerDe: string;
  overallCommentFa: string;
}

export interface PracticePhrase {
  german: string;
  persian: string;
}

export interface InterviewFinalReport {
  overallScore: number;
  marketReadiness: string;
  grammarSummary: string;
  terminologySummary: string;
  strengths: string[];
  improvements: string[];
  practiceChecklist: PracticePhrase[];
}

export interface InterviewerPersona {
  id: string;
  name: string;
  role: string;
  department: string;
  company: string;
  avatarBg: string;
  avatarText: string;
  styleDescriptionFa: string;
  tone: "supportive" | "analytical" | "demanding";
}

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: "sandra-becker",
    name: "Frau Sandra Becker",
    role: "Head of Talent Acquisition & Culture",
    department: "Personalabteilung (HR)",
    company: "TechVentures Deutschland GmbH (München)",
    avatarBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    avatarText: "SB",
    styleDescriptionFa: "لحن محترمانه و تشویق‌کننده؛ تمرکز روی انگیزه مهاجرت، روحیه تیمی (Soft Skills) و تناسب با فرهنگ سازمانی آلمان.",
    tone: "supportive"
  },
  {
    id: "klaus-weber",
    name: "Herr Dr. Klaus Weber",
    role: "Lead Technical Director & Hiring Manager",
    department: "Fachbereich Entwicklung & Innovation",
    company: "Bayerische Industrie & Tech AG",
    avatarBg: "bg-gradient-to-br from-emerald-600 to-teal-700",
    avatarText: "KW",
    styleDescriptionFa: "دقیق، ساختاریافته و عملگرا؛ تمرکز روی روش حل مسئله (STAR)، شواهد فنی ملموس و پاسخ‌های مبتنی بر نتیجه.",
    tone: "analytical"
  },
  {
    id: "claudia-wagner",
    name: "Frau Dipl.-Ing. Claudia Wagner",
    role: "Senior Operations & Quality Director",
    department: "Qualitätsmanagement & Prozesse",
    company: "MedTech & Engineering Süddeutschland",
    avatarBg: "bg-gradient-to-br from-blue-600 to-cyan-700",
    avatarText: "CW",
    styleDescriptionFa: "جدی و استانداردمحور؛ تمرکز روی استانداردهای کار در آلمان (DIN/ISO/RKI)، نظم اجرایی و پاسخ‌های بدون ابهام.",
    tone: "demanding"
  }
];

// Question pools for different fields
export const QUESTION_POOLS: Record<string, Omit<InterviewQuestion, "questionId">[]> = {
  it: [
    {
      questionDe: "Guten Tag! Erzählen Sie mir bitte etwas über sich und Ihren beruflichen Werdegang als IT-Spezialist.",
      questionFa: "روز بخیر! لطفاً کمی درباره خودتان و پیشینه کاری‌تان به عنوان متخصص IT بگویید.",
      hints: "روی معرفی نام، سابقه کار مرتبط، تخصص‌های اصلی (مانند فرانت‌اند، بک‌اند یا ابری) و انگیزه مصاحبه تمرکز کنید. از افعال اکتیو استفاده کنید.",
      idealAnswerDe: "Ich freue mich sehr über das Gespräch. Ich bin seit über 4 Jahren als Softwareentwickler tätig. Meine Schwerpunkte liegen in modernen Webarchitekturen mit React, TypeScript und Node.js. Zuletzt habe ich bei meinem Arbeitgeber erfolgreich eine modulare Microservice-Architektur implementiert, wodurch wir die Latenz um 25% senken und die Skalierbarkeit für 100.000 aktive Nutzer sicherstellen konnten."
    },
    {
      questionDe: "Warum möchten Sie in Deutschland arbeiten und warum haben Sie sich gerade bei unserem Unternehmen beworben?",
      questionFa: "چرا می‌خواهید در آلمان کار کنید و چرا برای شرکت ما اقدام کرده‌اید؟",
      hints: "به پویایی بازار فناوری آلمان، فرهنگ کاری مبتنی بر کیفیت (Qualitätsbewusstsein) و هماهنگی پروژه‌های شرکت با تخصص خود اشاره کنید.",
      idealAnswerDe: "Deutschland bietet einen der innovativsten IT-Märkte in Europa mit klaren Strukturen und starker Wertschätzung für sauberen Code. Ihr Unternehmen hat mich besonders begeistert, weil Sie modernste Cloud-Technologien und agile Praktiken einsetzen, die exakt zu meinen Kenntnissen in CI/CD und Docker passen. Ich möchte mein Know-how gewinnbringend in Ihr Team einbringen."
    },
    {
      questionDe: "Wie gehen Sie vor, wenn Sie ein komplexes technisches Problem in einem Projekt lösen müssen? Beschreiben Sie Ihre Methodik.",
      questionFa: "وقتی با یک چالش فنی پیچیده در پروژه مواجه می‌شوید، چطور برخورد می‌کنید؟ روش‌شناسی خود را توضیح دهید.",
      hints: "از روش STAR (موقعیت، وظیفه، اقدام، نتیجه) استفاده کنید. نشان دهید که کارها را با لاگ‌گیری، تجزیه سیستماتیک و مشورت فنی جلو می‌برید.",
      idealAnswerDe: "Ich folge einem analytischen Vorgehen: Zuerst isoliere ich die Fehlerursache anhand von Logdateien und Monitoring-Metriken. Anschließend evaluiere ich Lösungen anhand von Best Practices. Wenn nötig, führe ich ein kurzes Pair-Programming oder Architecture-Review mit Kollegen durch. Nach dem Bugfix sichere ich das Verhalten durch automatisierte Unit- und Integrationstests ab."
    },
    {
      questionDe: "Welche Erfahrungen haben Sie mit agilen Methoden wie Scrum oder Kanban in der Praxis gesammelt?",
      questionFa: "چه تجربیاتی در کار با متدهای چابک مانند Scrum یا Kanban در عمل دارید؟",
      hints: "به نقش جلسات استندآپ روزانه (Daily Standup)، برنامه‌ریزی اسپرینت، بازنگری کد (Code Review) و رترواسپکتیو اشاره کنید.",
      idealAnswerDe: "Ich arbeite seit drei Jahren täglich in agilen Scrum-Teams mit zweiwöchigen Sprints. Besonders schätze ich die Sprint Retrospectives, da wir dort Prozessengpässe offen ansprechen und stetig optimieren. Zudem pflege ich eine transparente Dokumentation in Jira und Confluence, um den Informationsfluss im Team zu maximieren."
    },
    {
      questionDe: "Haben Sie Fragen an uns? Was möchten Sie über unser Team, die Architektur oder die nächsten Meilensteine wissen?",
      questionFa: "آیا سوالی از ما دارید؟ چه چیزی می‌خواهید در مورد تیم ما، معماری یا اهداف پیش‌رو بدانید؟",
      hints: "در مصاحبه‌های آلمانی سوال نپرسیدن علامت کم‌علاقگی است. سوالاتی دقیق پیرامون فرآیند ورود (Onboarding)، پایپ‌لاین انتشار و تکنولوژی‌های هدف بپرسید.",
      idealAnswerDe: "Vielen Dank! Mich interessiert: Wie läuft die technische Einarbeitungsphase (Onboarding) bei Ihnen ab, und wie ist Ihr Deployment-Workflow im Hinblick auf Automated Testing und Kubernetes strukturiert? Welche technischen Herausforderungen stehen bei Ihnen im nächsten Quartal an?"
    }
  ],
  medical: [
    {
      questionDe: "Guten Tag! Bitte stellen Sie sich kurz vor und beschreiben Sie Ihre bisherige klinische Erfahrung im Gesundheitswesen.",
      questionFa: "روز بخیر! لطفاً خود را معرفی کنید و تجربیات بالینی خود را در بخش بهداشت و درمان بیان نمایید.",
      hints: "روی سابقه کار بیمارستانی، بخش‌های تخصصی (مانند اورژانس، جراحی، ICU یا بخش داخلی) و مهارت تعامل دلسوزانه با بیمار تمرکز کنید.",
      idealAnswerDe: "Guten Tag. Ich bin staatlich anerkannte Pflegefachkraft mit über fünf Jahren praktischer Erfahrung auf einer internistischen Station und im chirurgischen Bereich. Mein Aufgabengebiet umfasste die Grund- und Behandlungspflege, Medikamentenverabreichung nach ärztlicher Anordnung sowie das professionelle Wundmanagement. Eine respektvolle, empathische Kommunikation mit Patienten und Kollegen ist für mich selbstverständlich."
    },
    {
      questionDe: "Wie gehen Sie mit einem unzufriedenen oder gestressten Patienten und seinen besorgten Angehörigen um?",
      questionFa: "با یک بیمار ناراضی یا پراسترس و همراهان نگران او چگونه برخورد می‌کنید؟",
      hints: "به مهارت همدلی (Empathie)، حفظ خونسردی، گوش دادن فعال و توضیح شفاف روند درمانی طبق پروتکل‌ها اشاره کنید.",
      idealAnswerDe: "In solchen Situationen bleibe ich stets ruhig, aufmerksam und empathisch. Ich höre den Angehörigen aufmerksam zu, nehme ihre Ängste ernst und erkläre ihnen die pflegerischen Schritte verständlich und transparent. Bei medizinischen Detailfragen verweise ich sachlich an den behandelnden Stationsarzt. Deeskalation und Patientensicherheit stehen immer an oberster Stelle."
    },
    {
      questionDe: "Warum haben Sie sich für das deutsche Gesundheitssystem und unser Klinikum entschieden?",
      questionFa: "چرا سیستم بهداشت و درمان آلمان و این مرکز درمانی را انتخاب کرده‌اید؟",
      hints: "به استانداردهای بالای بهداشتی فدرال (RKI)، ساختار منظم مراقبت و فرصت‌های تخصص‌محور (Fachweiterbildung) اشاره کنید.",
      idealAnswerDe: "Das deutsche Gesundheitswesen zeichnet sich durch hohe Qualitätsstandards, modernste Medizintechnik und strikte Hygienevorgaben nach RKI-Richtlinien aus. Ihr Klinikum genießt einen exzellenten Ruf für interdisziplinäre Teamarbeit und gezielte Fortbildungsprogramme. Ich möchte meine Fachkompetenz und meine hohe Einsatzbereitschaft langfristig in Ihrem Haus einbringen."
    },
    {
      questionDe: "Wie wichtig ist für Sie die Pflegedokumentation und wie stellen Sie deren Lückenlosigkeit sicher?",
      questionFa: "مستندسازی بالینی چقدر برای شما اهمیت دارد و چطور از کامل بودن آن اطمینان حاصل می‌کنید؟",
      hints: "در آلمان ثبت دقیق پرونده (KIS) مسئولیت قانونی مهمی است؛ بر ثبت بی‌درنگ علائم حیاتی و گزارش مراقبت تاکید کنید.",
      idealAnswerDe: "Die Dokumentation ist sowohl fachlich als auch rechtlich essenziell: Was nicht dokumentiert ist, gilt haftungsrechtlich als nicht getan. Ich trage Vitalwerte, Medikationen und Auffälligkeiten stets zeitnah und gewissenhaft in das digitale Dokumentationssystem ein, damit die Übergabe an die nächste Schicht nahtlos und fehlerfrei verläuft."
    },
    {
      questionDe: "Wie verhalten Sie sich im Falle einer plötzlichen akuten Zustandsverschlechterung eines Patienten?",
      questionFa: "در صورت بروز وخامت ناگهانی و حاد در وضعیت بیمار، دقیقاً چه مراحلی را طی می‌کنید؟",
      hints: "به حفظ خونسردی، کار تیمی، آلارم فوری پزشک کشیک و آغاز پروتکل‌های احیا یا مراقبت ویژه طبق چک‌لیست اشاره کنید.",
      idealAnswerDe: "Ich bewahre Ruhe und handle nach dem etablierten Notfall-Algorithmus: Ich kontrolliere Vitalfunktionen, leite unverzüglich den Notruf für den zuständigen Arzt bzw. das Reanimationsteam ein und beginne parallel mit lebensrettenden Basismaßnahmen (Sauerstoffgabe, Vitalzeichen-Monitoring). Nach Stabilisierung erstelle ich einen lückenlosen Notfallbericht."
    }
  ],
  engineering: [
    {
      questionDe: "Guten Tag! Bitte beschreiben Sie Ihren akademischen und praktischen Werdegang als Ingenieur.",
      questionFa: "روز بخیر! لطفاً پیشینه تحصیلی و کاربردی خود را به عنوان مهندس توصیف بفرمایید.",
      hints: "به مدرک دانشگاهی مرتبط، حوزه طراحی/محاسبات (مکانیک، برق، عمران) و پروژه‌های شاخص صنعتی اشاره فرمایید.",
      idealAnswerDe: "Guten Tag. Ich habe mein Studium im Maschinenbau erfolgreich abgeschlossen und arbeite seit vier Jahren als Entwicklungsingenieur. Mein Schwerpunkt liegt in der Konstruktion und rechnerischen Auslegung mechanischer Baugruppen. In meinem letzten Projekt konnte ich durch Topologieoptimierung das Bauteilgewicht einer Vorrichtung um 14% reduzieren und gleichzeitig die statische Belastbarkeit erhöhen."
    },
    {
      questionDe: "Mit welchen CAD- und Simulationswerkzeugen arbeiten Sie am sichersten und wie integrieren Sie diese in Ihren Workflow?",
      questionFa: "با کدام نرم‌افزارهای CAD و شبیه‌سازی بیشترین تسلط را دارید و چطور از آن‌ها در چرخه کاری استفاده می‌کنید؟",
      hints: "از نرم‌افزارهای استاندارد نظیر SolidWorks, CATIA, NX, ANSYS نام ببرید و به اعتبارسنجی محاسباتی اشاره کنید.",
      idealAnswerDe: "Ich arbeite routiniert mit SolidWorks und Siemens NX für die parametrische 3D-Modellierung und Zeichnungserstellung nach DIN EN ISO. Für FEM-Strukturanalysen nutze ich ANSYS Workbench. Vor jeder Freigabe verifiziere ich kritische Lastfälle simulationsgestützt, um teure Iterationen im Prototypenbau zu vermeiden."
    },
    {
      questionDe: "Wie gewährleisten Sie die Einhaltung deutscher und europäischer Normen (z. B. DIN, EN, ISO) in Ihren Konstruktionen?",
      questionFa: "چگونه از رعایت استانداردهای آلمانی و اروپایی (نظیر DIN, EN, ISO) در طرح‌های خود اطمینان حاصل می‌کنید؟",
      hints: "در آلمان پایبندی به استانداردهای DIN یک اصل محوری است؛ به تلورانس‌گذاری هندسی (GPS) و مستندات ایمنی اشاره کنید.",
      idealAnswerDe: "Normkonformität ist das Fundament deutscher Ingenieurarbeit. Ich beziehe DIN EN ISO-Normen, wie beispielsweise Toleranz- und Passungssysteme sowie die Maschinenrichtlinie, bereits in der Konzeptphase ein. Mithilfe von Konstruktions-Checklisten und internen Design-Reviews stelle ich sicher, dass alle Fertigungszeichnungen absolut normgerecht archiviert werden."
    },
    {
      questionDe: "Beschreiben Sie eine Situation, in der ein Projekt vor einem Lieferengpass oder technischen Problem stand. Wie haben Sie reagiert?",
      questionFa: "موقعیتی را شرح دهید که در آن پروژه با چالش تامین قطعه یا مشکل فنی روبرو شد؛ چه راهکاری ارائه دادید؟",
      hints: "از متد STAR استفاده کنید؛ نشان دهید که با تیم تامین، تولید و مدیریت پروژه هماهنگ شده و راه‌حل جایگزین سریع یافتید.",
      idealAnswerDe: "Bei einer Baugruppe kam es zu unerwarteten Lieferverzögerungen eines Spezialwerkstoffs. Ich habe sofort mit der Fertigung und dem Einkauf eine Machbarkeitsprüfung für einen genormten Alternativwerkstoff durchgeführt, die FEM-Nachrechnung binnen 24 Stunden aktualisiert und den Kunden proaktiv informiert. So konnte der Terminplan ohne Verzug eingehalten werden."
    },
    {
      questionDe: "Welche Fragen haben Sie an uns bezüglich der Produktentwicklung und unserer Fertigungsprozesse?",
      questionFa: "چه سوالاتی درباره فرآیند توسعه محصول و روندهای تولیدی ما در ذهن دارید؟",
      hints: "درباره ابزارهای PLM، همکاری با سایت‌های تولیدی یا استراتژی‌های گذار به انرژی‌های پایدار سوال بپرسید.",
      idealAnswerDe: "Ich würde mich freuen zu erfahren: Welches PLM-System setzen Sie für die Versionsverwaltung ein und wie eng ist die Schnittstelle zwischen der virtuellen Simulation und dem physischen Prüffeld gestaltet? Welche Schwerpunkte setzt Ihr Team im Bereich nachhaltiger Konstruktionswerkstoffe?"
    }
  ],
  general: [
    {
      questionDe: "Guten Tag! Stellen Sie sich bitte vor und schildern Sie Ihre wichtigsten beruflichen Stationen.",
      questionFa: "روز بخیر! لطفاً خود را معرفی کنید و مهم‌ترین مراحل کاری خود را شرح دهید.",
      hints: "به معرفی سوابق کاری، دستاوردهای ملموس، روحیه همکاری و هدف اصلی از فعالیت حرفه‌ای در آلمان اشاره کنید.",
      idealAnswerDe: "Guten Tag. Ich freue mich über die Einladung. In den vergangenen fünf Jahren habe ich umfangreiche Erfahrungen im Projekt- und Prozessmanagement gesammelt. Zu meinen Kernkompetenzen zählen die strukturierte Planung, zielorientierte Kommunikation und das lösungsorientierte Arbeiten in interdisziplinären Teams. Mein Ziel ist es, meine Fähigkeiten dauerhaft in ein dynamisches Unternehmen in Deutschland einzubringen."
    },
    {
      questionDe: "Warum möchten Sie Ihre berufliche Zukunft in Deutschland fortsetzen und was schätzen Sie an der deutschen Arbeitskultur?",
      questionFa: "چرا مایلید آینده شغلی‌تان را در آلمان ادامه دهید و چه چیزی در فرهنگ کاری آلمان برای شما باارزش است؟",
      hints: "به مواردی نظیر قابلیت اطمینان (Zuverlässigkeit)، شفافیت، نظم، و تعادل بین کار و زندگی (Work-Life-Balance) اشاره فرمایید.",
      idealAnswerDe: "Deutschland steht international für Verlässlichkeit, hohe Qualitätsansprüche und transparente Arbeitsbedingungen. Ich schätze die strukturierte Arbeitsweise, flache Hierarchien und die Kultur des offenen Feedbacks sehr. Diese Werte spiegeln meine persönliche Arbeitsphilosophie wider."
    },
    {
      questionDe: "Wie priorisieren Sie Ihre Aufgaben, wenn mehrere dringende Projekte gleichzeitig anstehen?",
      questionFa: "هنگامی که چندین پروژه فوری هم‌زمان در جریان است، چگونه وظایف خود را اولویت‌بندی می‌کنید؟",
      hints: "به ماتریس آیزنهاور، استفاده از ابزارهای مدیریت کار و ارتباط مداوم با مدیر مستقیم برای شفافیت ددلاین‌ها اشاره کنید.",
      idealAnswerDe: "In stressigen Phasen nutze ich das Eisenhower-Prinzip: Ich unterscheide konsequent zwischen Dringlichkeit und strategischer Wichtigkeit. Ich halte Aufgaben in einem digitalen Tool fest, blockiere Fokuszeiten im Kalender und stimme mich proaktiv mit Vorgesetzten ab, falls Prioritäten neu kalibriert werden müssen."
    },
    {
      questionDe: "Wie gehen Sie mit Meinungsverschiedenheiten oder Konflikten in einem multikulturellen Team um?",
      questionFa: "با تفاوت دیدگاه یا چالش‌های تیمی در محیط‌های بین‌المللی چگونه مواجه می‌شوید؟",
      hints: "به گفتگوی مستقیم دوجانبه (Vier-Augen-Gespräch)، احترام متقابل، درک دیدگاه‌های فرهنگی و تمرکز بر هدف مشترک اشاره کنید.",
      idealAnswerDe: "Ich suche stets das direkte, sachliche und respektvolle Gespräch unter vier Augen. Dabei höre ich zunächst aktiv zu, um die Perspektive meines Gegenübers vorurteilsfrei zu verstehen. Kulturelle Vielfalt begreife ich als Chance; entscheidend ist, den gemeinsamen Projektfokus niemals aus den Augen zu verlieren."
    },
    {
      questionDe: "Welche Erwartungen stellen Sie an uns als Arbeitgeber und an die Einarbeitungsphase?",
      questionFa: "چه انتظاراتی از ما به عنوان کارفرما و از روند آغاز به کار خود دارید؟",
      hints: "به فرآیند شفاف آشنایی با سازمان (Onboarding)، امکان پیشرفت حرفه‌ای، بازخورد دوره‌ای و همکار مربی (Mentor/Buddy) اشاره کنید.",
      idealAnswerDe: "Ich wünsche mir einen strukturierten Einarbeitungsplan mit klaren Meilensteinen und idealerweise einem Mentor oder Buddy an meiner Seite. Mir sind ein regelmäßiger, konstruktiver Feedbackaustausch und die Möglichkeit wichtig, mich fachlich und sprachlich kontinuierlich weiterzuentwickeln."
    }
  ]
};

// Returns an initial tailored question
export function getFallbackFirstQuestion(
  field: string,
  jobTitle: string,
  language: string,
  interviewType: string,
  personaId?: string
): InterviewQuestion & {
  totalQuestions: number;
  interviewerGreetingDe: string;
  interviewerGreetingFa: string;
} {
  const normField = normalizeField(field);
  const pool = QUESTION_POOLS[normField] || QUESTION_POOLS.general;
  const firstQ = pool[0];

  const persona = INTERVIEWER_PERSONAS.find(p => p.id === personaId) || INTERVIEWER_PERSONAS[0];

  return {
    questionId: 1,
    questionDe: firstQ.questionDe,
    questionFa: firstQ.questionFa,
    hints: firstQ.hints,
    idealAnswerDe: firstQ.idealAnswerDe,
    totalQuestions: pool.length,
    interviewerGreetingDe: `Guten Tag und herzlich willkommen zu unserem Gespräch bei ${persona.company}. Mein Name ist ${persona.name}. Wir freuen uns auf das Kennenlernen für die Position als ${jobTitle || "Fachkraft"}.`,
    interviewerGreetingFa: `روز بخیر و به گفتگوی استخدامی ما در شرکت ${persona.company} خوش آمدید. نام من ${persona.name} است. بسیار خوشحالیم که امروز برای جایگاه شغلی ${jobTitle || "متخصص"} با شما گفتگو می‌کنیم.`
  };
}

// Generates feedback and next question (or final report) with realistic human conversational transitions
export function getFallbackFeedbackAndNext(
  field: string,
  jobTitle: string,
  language: string,
  interviewType: string,
  currentQuestionIndex: number,
  userResponse: string,
  isFinalQuestion: boolean,
  personaId?: string
): {
  feedback: InterviewFeedback;
  nextQuestion: InterviewQuestion | null;
  finalReport: InterviewFinalReport | null;
} {
  const normField = normalizeField(field);
  const pool = QUESTION_POOLS[normField] || QUESTION_POOLS.general;
  const persona = INTERVIEWER_PERSONAS.find(p => p.id === personaId) || INTERVIEWER_PERSONAS[0];

  const responseText = (userResponse || "").trim();
  const responseLen = responseText.length;
  const words = responseText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Keyword scanner
  const lowerResp = responseText.toLowerCase();
  const techKeywords = ["react", "node", "typescript", "aws", "docker", "python", "java", "sql", "git", "cloud", "api", "architecture", "microservices"];
  const medicalKeywords = ["patient", "station", "pflege", "arzt", "medikament", "wundversorgung", "rki", "klinik", "vitalwerte", "dokumentation"];
  const engKeywords = ["cad", "solidworks", "catia", "fem", "din", "iso", "ansys", "konstruktion", "fertigung", "toleranz", "simulation"];
  const generalKeywords = ["erfahrung", "projekt", "team", "deutschland", "erfolg", "lösung", "verantwortung", "organisation", "methodik", "ziel"];

  let relevantCount = 0;
  const checkWords = normField === "it" ? [...techKeywords, ...generalKeywords]
    : normField === "medical" ? [...medicalKeywords, ...generalKeywords]
    : normField === "engineering" ? [...engKeywords, ...generalKeywords]
    : generalKeywords;

  const foundConcepts: string[] = [];
  checkWords.forEach(kw => {
    if (lowerResp.includes(kw)) {
      relevantCount++;
      if (foundConcepts.length < 3 && !foundConcepts.includes(kw)) {
        foundConcepts.push(kw);
      }
    }
  });

  // Calculate dynamic realistic score
  let score = 55;
  if (wordCount >= 35) score += 20;
  else if (wordCount >= 18) score += 12;
  else if (wordCount < 7) score -= 25;

  score += Math.min(20, relevantCount * 4);
  score = Math.max(30, Math.min(94, score));

  // Determine human interviewer verbal reaction
  let interviewerSpokenReactionDe = "";
  let interviewerSpokenReactionFa = "";
  let answerRelevanceCommentFa = "";

  if (wordCount < 7) {
    interviewerSpokenReactionDe = `Vielen Dank für Ihre kurze Rückmeldung. In einem deutschen Vorstellungsgespräch ist es jedoch wichtig, dass Sie Ihre Aussagen mit mehr Tiefe und konkreten Beispielen untermauern.`;
    interviewerSpokenReactionFa = `خیلی ممنون از پاسخ کوتاه شما. با این حال در مصاحبه‌های استخدامی آلمان بسیار مهم است که جملات خود را با عمق بیشتر و مثال‌های عینی همراه کنید.`;
    answerRelevanceCommentFa = `پاسخ شما بسیار کوتاه و تلگرافی بود. مصاحبه‌کننده انتظار دارد حداقل در ۳ تا ۴ جمله به جزئیات تجربیات خود بپردازید.`;
  } else if (foundConcepts.length > 0) {
    const conceptStr = foundConcepts.join(", ");
    interviewerSpokenReactionDe = `Vielen Dank für Ihre anschauliche Ausführung! Besonders interessant fand ich Ihren Bezug zu ${conceptStr}. Man erkennt, dass Sie bereits praxisnahe Erfahrungen in diesem Bereich gesammelt haben.`;
    interviewerSpokenReactionFa = `خیلی ممنون بابت توضیحات شفاف شما! اشاره شما به مباحثی نظیر «${conceptStr}» بسیار جالب بود و نشان‌دهنده تجربه عملی شما در این زمینه است.`;
    answerRelevanceCommentFa = `پاسخ شما به طور مستقیم به پرسش مربوط بود و واژگان کلیدی مناسبی در آن استفاده شد.`;
  } else {
    interviewerSpokenReactionDe = `Vielen Dank für Ihre Antwort. Sie haben einen guten Überblick gegeben. Lassen Sie uns im nächsten Schritt noch genauer auf Ihre praktische Arbeitsweise eingehen.`;
    interviewerSpokenReactionFa = `بسیار ممنون بابت پاسخ شما. دیدگاه کلی مناسبی ارائه دادید. بیایید در گام بعدی روی شیوه عملکرد عملی شما عمیق‌تر شویم.`;
    answerRelevanceCommentFa = `پاسخ شما قابل قبول بود، اما آوردن مثال‌های پروژه‌ای ملموس می‌تواند تاثیرگذاری کلام شما را دوچندان کند.`;
  }

  // Grammar & Vocab tailored feedback
  let grammarCorrections = "";
  let vocabularySuggestions = "";
  let overallCommentFa = "";

  if (score >= 80) {
    grammarCorrections = "ساختار نحوی جملات و جایگاه افعال بسیار منظم است. به عنوان یک نکته تکمیلی، استفاده هدفمند از افعال انعکاسی (z.B. 'sich einarbeiten', 'sich weiterentwickeln') تسلط کلامی شما را کاملاً بومی نشان می‌دهد.";
    vocabularySuggestions = "دایره لغات شما در سطح کاری استاندارد (C1/B2+) است. جایگزینی ترکیباتی مثل 'gute Arbeit leisten' با 'einen nachhaltigen Mehrwert schaffen' پاسخ شما را در سطح مدیران ارشد قرار می‌دهد.";
    overallCommentFa = `عالی! کاندیدا پاسخی ساختاریافته، باوقار و مطابق با استاندارد بازار کار آلمان ارائه داد. شما اعتماد به نفس و تسلط بالایی به نمایش گذاشتید.`;
  } else if (score >= 60) {
    grammarCorrections = "مفهوم جملات کاملاً قابل درک است. توجه ویژه داشته باشید که در بندهای فرعی پس از حروف ربط سازنده (مانند dass، weil، wenn، obwohl)، فعل صرف‌شده حتماً به انتهای جمله منتقل شود.";
    vocabularySuggestions = "توصیه می‌شود به جای کلمات عمومی، از اصطلاحات تخصصی محیط‌های کاری آلمان مانند 'zielorientierte Vorgehensweise'، 'Verantwortungsbereich' و 'kontinuierliche Optimierung' استفاده فرمایید.";
    overallCommentFa = "پاسخ شما در مسیر درست قرار دارد. با گسترش دامنه کلمات رسمی و تمرین چینش ساختار جملات، به تسلط کلامی مطلوب‌تری دست خواهید یافت.";
  } else {
    grammarCorrections = "در جملات شما ناهماهنگی در حروف اضافه (Präpositionen) و حروف ربط مشاهده می‌شود. توصیه می‌شود ساختار ساده S-V-O (فاعل - فعل - مفعول) را رعایت کرده و جملات را کوتاه و شفاف بیان کنید.";
    vocabularySuggestions = "از تکرار افعال بسیار ساده نظیر 'machen' یا 'haben' پرهیز نموده و از افعال کاری مثل 'umsetzen' (پیاده‌سازی)، 'betreuen' (سرپرستی) یا 'analysieren' استفاده فرمایید.";
    overallCommentFa = "توصیه اکید می‌شود پاسخ‌های خود را طبق چارچوب STAR (موقعیت، وظیفه، اقدام، دستاورد) سازماندهی کنید تا کارفرما درک دقیق‌تری از شایستگی شما پیدا کند.";
  }

  const improvedAnswerDe = pool[currentQuestionIndex - 1]?.idealAnswerDe || "Ich danke Ihnen für diese wichtige Frage. In meiner bisherigen Praxis...";

  const feedback: InterviewFeedback = {
    score,
    interviewerSpokenReactionDe,
    interviewerSpokenReactionFa,
    answerRelevanceCommentFa,
    grammarCorrections,
    vocabularySuggestions,
    improvedAnswerDe,
    overallCommentFa
  };

  // Next question generation with human transition
  let nextQuestion: InterviewQuestion | null = null;
  if (!isFinalQuestion && currentQuestionIndex < pool.length) {
    const nextQData = pool[currentQuestionIndex];
    const transitionLead = foundConcepts.length > 0
      ? `Daran anknüpfend möchte ich die nächste Frage stellen:`
      : `Kommen wir nun zum nächsten Aspekt unseres Gesprächs:`;

    nextQuestion = {
      questionId: currentQuestionIndex + 1,
      questionDe: nextQData.questionDe,
      questionFa: nextQData.questionFa,
      hints: nextQData.hints,
      idealAnswerDe: nextQData.idealAnswerDe,
      contextualTransitionDe: transitionLead
    };
  }

  // Final comprehensive report
  let finalReport: InterviewFinalReport | null = null;
  if (isFinalQuestion) {
    const overallScore = Math.min(96, Math.max(45, Math.round(score * 0.92 + 10)));
    let marketReadiness = "آمادگی بالا و مصاحبه‌پسند (Interview Ready)";
    let grammarSummary = "شما تسلط ساختاری تحسین‌برانگیزی روی گرامر کاری آلمانی دارید. چیدمان افعال و زمان‌ها روان و حرفه‌ای است.";
    let terminologySummary = "استفاده هدفمند از لغات تجاری و استاندارد فنی در تمامی پاسخ‌های شما مشهود بود که اعتماد به نفس کاری بالایی را نشان می‌دهد.";
    let strengths = [
      "رعایت مداوم و دقیق فرم محترمانه Sie/Ihnen",
      "ارائه مثال‌های عینی و متناسب با فرهنگ کاری آلمان",
      "ساختاردهی هدفمند پاسخ‌ها و اعتماد به نفس کلامی",
      "بکارگیری واژگان تخصصی و اصطلاحات متداول فدرال"
    ];
    let improvements = [
      "کاهش مکث‌های فکری پیش از ورود به بحث فنی",
      "تمرین تلفظ حروف چالش‌برانگیز آلمانی نظیر CH و Ö/Ü",
      "تمرکز مضاعف بر پاسخ‌دهی تحت محدودیت زمانی ۹۰ ثانیه‌ای"
    ];

    if (overallScore < 75) {
      marketReadiness = "نیازمند تمرین و بهینه‌سازی گرامری (Targeted Practice)";
      grammarSummary = "نیاز به تقویت ترتیب اجزای جمله در بندهای پیرو و استفاده دقیق‌تر از حروف اضافه مربوط به حوزه تخصص.";
      terminologySummary = "افزایش دایره واژگان رسمی اداری (Amtsdeutsch & Fachsprache) به جای لغات روزمره.";
      strengths = [
        "انگیزه بالا و صداقت در پاسخ‌دهی به پرسش‌ها",
        "تلاش مداوم برای ارائه ساختارهای رسمی",
        "احترام به قواعد و آداب مصاحبه"
      ];
      improvements = [
        "افزایش طول جملات با بهره‌گیری از تکنیک STAR",
        "به خاطر سپردن ۵ عبارت کلیدی طلایی برای شروع و پایان هر پاسخ",
        "جلوگیری از پاسخ‌های تلگرافی و کم‌توضیح"
      ];
    }

    finalReport = {
      overallScore,
      marketReadiness,
      grammarSummary,
      terminologySummary,
      strengths,
      improvements,
      practiceChecklist: getPracticePhrases(normField)
    };
  }

  return {
    feedback,
    nextQuestion,
    finalReport
  };
}

// Normalize field names
function normalizeField(field: string): string {
  const fLower = String(field || "general").toLowerCase();
  if (fLower.includes("it") || fLower.includes("software") || fLower.includes("developer") || fLower.includes("computer") || fLower.includes("نرم‌افزار") || fLower.includes("برنامه‌نویسی") || fLower.includes("وب") || fLower.includes("شبکه") || fLower.includes("مخابرات")) {
    return "it";
  }
  if (fLower.includes("doctor") || fLower.includes("nurse") || fLower.includes("medical") || fLower.includes("health") || fLower.includes("پزشک") || fLower.includes("پرستار") || fLower.includes("درمان") || fLower.includes("مامایی") || fLower.includes("پزشکی")) {
    return "medical";
  }
  if (fLower.includes("engineer") || fLower.includes("mechanical") || fLower.includes("energy") || fLower.includes("civil") || fLower.includes("electrical") || fLower.includes("industrial") || fLower.includes("مهندسی") || fLower.includes("مهندس") || fLower.includes("مکانیک") || fLower.includes("برق") || fLower.includes("عمران")) {
    return "engineering";
  }
  return "general";
}

// Generate practice checklist phrases
function getPracticePhrases(field: string): PracticePhrase[] {
  const common = [
    { german: "Vielen Dank für diese interessante Frage.", persian: "خیلی ممنون بابت این سوال جالب و به جای شما." },
    { german: "Ich freue mich sehr über die Gelegenheit, mich heute bei Ihnen vorzustellen.", persian: "بسیار خوشحالم از فرصتی که امروز برای معرفی خودم در اختیارم گذاشتید." },
    { german: "In meiner letzten Position stand ich vor einer ähnlichen Herausforderung...", persian: "در موقعیت شغلی قبلی‌ام با چالش مشابهی روبرو شدم که..." }
  ];

  if (field === "it") {
    return [
      ...common,
      { german: "Ich bin vertraut mit modernen CI/CD-Pipelines und Cloud-Architekturen.", persian: "من با پایپ‌لاین‌های مدرن CI/CD و معماری‌های ابری کاملاً آشنا هستم." },
      { german: "Wir haben das Refactoring in zweiwöchigen agilen Sprints durchgeführt.", persian: "ما بازنویسی و بازسازی کد را در اسپرینت‌های دوهفته‌ای چابک انجام دادیم." },
      { german: "Die Einführung von Microservices hat unsere Ladezeiten um 25% gesenkt.", persian: "معرفی میکروسرویس‌ها سرعت بارگذاری سیستم ما را ۲۵٪ ارتقا داد." }
    ];
  }

  if (field === "medical") {
    return [
      ...common,
      { german: "Die sorgfältige und lückenlose Dokumentation ist für mich selbstverständlich.", persian: "مستندسازی دقیق و بدون وقفه برای من امری بدیهی و اساسی است." },
      { german: "Ich lege großen Wert auf eine empathische und deeskalierende Kommunikation.", persian: "من اهمیت ویژه‌ای برای ارتباط همدلانه و آرامش‌بخش با بیماران قائلم." },
      { german: "Bei akuten Notfällen handle ich strukturiert nach den RKI-Leitlinien.", persian: "در فوریت‌های حاد پزشکی، ساختاریافته طبق دستورالعمل‌های انستیتو رابرت کخ عمل می‌کنم." }
    ];
  }

  if (field === "engineering") {
    return [
      ...common,
      { german: "Ich stelle stets die strikte Einhaltung aller relevanten DIN- und ISO-Normen sicher.", persian: "من همواره رعایت دقیق تمامی استانداردهای مرتبط DIN و ISO را تضمین می‌کنم." },
      { german: "Mithilfe der FEM-Simulation konnten wir kritische Spannungsspitzen eliminieren.", persian: "به کمک شبیه‌سازی FEM موفق شدیم نقاط تمرکز تنش مکانیکی را برطرف کنیم." },
      { german: "Die enge Abstimmung mit Fertigung und Qualitätsmanagement verhinderte Nacharbeiten.", persian: "هماهنگی نزدیک با بخش تولید و تضمین کیفیت مانع از دوباره‌کاری‌ها شد." }
    ];
  }

  return [
    ...common,
    { german: "Eine strukturierte, zielorientierte und zuverlässige Arbeitsweise zeichnet mich aus.", persian: "شیوه کاری ساختاریافته، نتیجه‌محور و قابل اطمینان از ویژگی‌های بارز من است." },
    { german: "Ich strebe stets nach kontinuierlicher fachlicher und sprachlicher Weiterentwicklung.", persian: "من همواره در پی رشد مستمر تخصصی و تسلط زبانی در محیط کار هستم." }
  ];
}
