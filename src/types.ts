export interface EvaluatorInput {
  age: number;
  degree: string;
  experience: number;
  germanLevel: string;
  englishLevel: string;
  field: string;
  pdfBase64?: string;
  name?: string;
  email?: string;
  phone?: string;
  skills?: string;
  certifications?: string;
  anabinStatus?: string;
  universityName?: string;
  workHistoryHighlights?: string[];
  educationSummary?: string;
  rawTextSummary?: string;
  targetRole?: string;
}

export interface Din5008AddressData {
  street: string;
  houseNumber?: string;
  plz: string;
  city: string;
  country: string;
  addressAddon?: string;
  relocationNote?: string;
  locationType: "iran" | "germany" | "international";
  formattedFull: string;
}

export type GermanCvFormatId = "tabellarisch" | "europass" | "modern" | "akademisch";

export interface CVBuilderInput {
  name: string;
  field: string;
  address?: string;
  din5008Address?: Din5008AddressData;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  // German CV Format extensions
  selectedFormat?: GermanCvFormatId;
  birthDate?: string;
  nationality?: string;
  kurzprofil?: string;
  digitalSkills?: string;
  cefrGermanLevel?: string;
  researchFocus?: string;
  thesisTitle?: string;
  publications?: string;
}

export interface JobPortal {
  id: string;
  name: string;
  url: string;
  category: "all" | "it" | "engineering" | "healthcare" | "general" | "official";
  description: string;
}

export interface RecognitionStep {
  id: number;
  title: string;
  duration: string;
  cost: string;
  description: string;
  actionUrl?: string;
}

export interface RoleFitDetails {
  score: number;
  ratingLevel: "exceptional" | "strong" | "moderate" | "gap_detected";
  ratingLabelFa: string;
  technicalFit: number;
  experienceFit: number;
  languageFit: number;
  educationFit: number;
  visaSponsorshipFit: number;
  matchingStrengths: string[];
  gapsAndRequirements: string[];
  actionableTips: string[];
  interviewPitch: string;
  shortlistProbability: string;
  matchedKeySkills?: string[];
  missingKeySkills?: string[];
  germanCvAdjustmentTip?: string;
  calculatedAt?: string;
}

export interface CandidateAlignmentAudit {
  isFullyAligned: boolean; // آیا بدون مغایرت است؟
  hasDiscrepancy: boolean; // آیا مغایرت دارد؟
  discrepancies: string[]; // فهرست مغایرت‌ها در صورت وجود
  specialtyFit: {
    status: "aligned" | "discrepancy";
    candidateSpecialty: string;
    jobSpecialty: string;
    score: number;
    detailsFa: string;
  };
  capabilityFit: {
    status: "aligned" | "discrepancy";
    candidateCapabilities: string[];
    matchedCapabilities: string[];
    score: number;
    detailsFa: string;
  };
  experienceFit: {
    status: "aligned" | "discrepancy";
    candidateExpYears: number;
    requiredExpYears: number;
    seniorityLevel: string;
    score: number;
    detailsFa: string;
  };
  knowledgeFit: {
    status: "aligned" | "discrepancy";
    degree: string;
    anabinStatus: string;
    score: number;
    detailsFa: string;
  };
  preciseMatchReason: string; // علت انطباق دقیق متناسب با توانمندی، تجربه، دانش و تخصص
}

export interface SemanticMatchDetails {
  overallScore: number;
  ratingLevel: "exceptional" | "strong" | "moderate" | "gap_detected";
  ratingLabelFa: string;
  experienceFitScore: number;
  experienceAnalysis: string;
  skillsFitScore: number;
  skillsAnalysis: string;
  certificationsFitScore: number;
  certificationsAnalysis: string;
  zabAnabinFitScore: number;
  anabinStatus: "H+" | "H+/-" | "H-" | "ZAB_REQUIRED" | "IT_EXPERIENCE_EXEMPTION" | string;
  anabinAnalysis: string;
  legalImmigrationPathway: string;
  industryDemandProfile: {
    sectorName: string;
    demandLevel: "بسیار بالا (Engpassberuf)" | "بالا" | "متوسط";
    shortageOccupation: boolean;
    priorityCertificates: string[];
    regionalDemandHubs: string[];
    fastTrackEligible: boolean;
  };
  scoreExplanation: string;
  actionableScoreBoosters: string[];
  alignmentAudit?: CandidateAlignmentAudit;
}

export interface SponsorshipJob {
  jobTitle: string;
  companyName: string;
  salary: string;
  website: string;
  email: string;
  contactPerson: string;
  phone: string;
  visaSp: string;
  relocation: string;
  matchReason: string;
  matchPercentage?: number;
  matchScoreBreakdown?: SemanticMatchDetails;
  zabStatus?: string;
  industryDemandSector?: string;
  certificationsValued?: string[];
  roleFitScore?: number;
  roleFitDetails?: RoleFitDetails;
  jobDescriptionSnippet?: string;
  requiredSkills?: string[];
  requiredExperienceYears?: number;
  techStack?: string[];
  experienceLevel?: "junior" | "mid" | "senior" | "lead" | string;
  location?: string;
  visaType?: string;
  workLanguage?: string;
  minExp?: number;
  portalLinks?: {
    direct?: string;
    stepstone?: string;
    arbeitsagentur?: string;
    linkedin?: string;
    indeed?: string;
    xing?: string;
    germantechjobs?: string;
    googleJobs?: string;
    makeItInGermany?: string;
    kununu?: string;
  };
  verifiedActive?: boolean;
  employerRegistrationStatus?: string;
  blueCardCompliant?: boolean;
  laborApprovalExempt?: boolean;
  alignmentAudit?: CandidateAlignmentAudit;
  hasDiscrepancy?: boolean;
  discrepancySummary?: string;
  preciseMatchReason?: string;
  tierCategory?: "phase1_high_chance" | "phase2_enterprise";
  tierLabelFa?: string;
  iranianHiringTrackRecord?: "proven_frequent" | "international_open" | "enterprise_rigid";
  iranianHiringBadgeFa?: string;
  remoteInterviewYieldRate?: "high" | "moderate" | "low";
  remoteInterviewYieldLabelFa?: string;
  hiringProcessSpeed?: string;
  recommendedStrategyFa?: string;
  companySize?: string;
  companyScale?: "mittelstand_sme" | "enterprise" | "startup_scaleup";
  isMittelstand?: boolean;
  employeeCountRange?: "200-500" | "500-2000" | "2000+";
  mittelstandAdvantageFa?: string;
  isMegaCompany?: boolean;
  iranianStaffCount?: string;
  nonEuHiringHistory10Yrs?: string;
  interviewInvitationProbability?: number;
  interviewProbabilityReason?: string;
  portalSource?: string;
}

export interface ResumeJobAnalysisResult {
  atsMatchScore: number;
  matchLevel: string;
  executiveSummary: string;
  extractedCandidateSkills: Array<{
    name: string;
    level?: string;
    category?: string;
    isMatched?: boolean;
  }>;
  jobRequiredSkills: string[];
  matchedSkills: Array<{
    skill: string;
    description: string;
  }>;
  highlightedMismatches: Array<{
    skill: string;
    severity: "critical" | "important" | "bonus";
    gapDescription: string;
    actionableAdvice: string;
  }>;
  experienceAnalysis: {
    candidateYears: number;
    requiredYears: number;
    status: string;
    notes: string;
  };
  languageAnalysis: {
    germanStatus: string;
    englishStatus: string;
    notes: string;
  };
  actionableSuggestions: Array<{
    category: "keywords" | "experience_bullets" | "lebenslauf_format" | string;
    title: string;
    description: string;
  }>;
  tailoredBulletPoints: string[];
  tailoredHeadline: string;
  tailoredSummarySnippet: string;
}

export interface EmbassyAlert {
  id: string;
  title: string;
  description: string;
  category: "embassy_tehran" | "labor_law" | "tlscontact" | "visametric" | "chancenkarte" | "bluecard" | "urgent_warning";
  categoryLabelFa: string;
  date: string;
  publishDate: string;
  priority: "urgent" | "high" | "medium";
  officialRefUrl: string;
  officialRefTitle: string;
  actionLabel?: string;
  targetTab?: "dashboard" | "chancenkarte" | "cv" | "portals" | "jobs" | "interview";
  officialCode?: string;
  isImportant?: boolean;
}

export interface StarFrameworkItem {
  situation: string; // موقعیت اولیه، بستر پروژه و شرایط (Situation)
  task: string;      // مأموریت، چالش محوری و مسئولیت اختصاصی (Task)
  action: string;    // اقدامات اجرایی، متدولوژی، تصمیم‌گیری فنی و ابزارها (Action)
  result: string;    // نتایج قابل اندازه‌گیری، بهینه‌سازی و درس‌آموخته‌ها (Result)
  germanCultureTip: string; // نکات طلایی فرهنگ سازمانی آلمان (Sachlichkeit, عدم اغراق، مستندسازی)
}

export interface InterviewQuestionItem {
  id: string;
  category: "general" | "technical";
  categoryLabelFa: string;
  level: "general" | "junior" | "mid" | "senior_lead";
  levelLabelFa: string;
  companyType: "mittelstand" | "dax_enterprise" | "startup" | "public_authority" | "all";
  companyTypeLabelFa: string;
  questionFa: string;
  questionDeEn: string;
  reasoning?: string; // استدلال و چرایی استراتژیک کارفرمای آلمانی از طرح این سوال (Employer Reasoning / Warum fragt der deutsche Arbeitgeber das?)
  recruiterObjective: string; // علت و مبنای طرح سوال توسط کارفرمای آلمانی
  evaluationFocus: string; // معیارهای ارزیابی پاسخ
  recommendedAnswerStrategy: string; // استراتژی پاسخ ایده‌آل (STAR / استاندارد آلمان)
  redFlags: string; // خط قرمزها و هشدارهای مصاحبه‌کننده
  realWorldSource: string; // استناد به تجارب واقعی لینکدین و مصاحبه‌های آلمان
  starFramework?: StarFrameworkItem; // چارچوب پاسخ پیشنهادی بر پایه متدولوژی STAR آلمان
  cvReference?: string; // ارجاع صریح به سابقه یا مهارت موجود در رزومه آپلود شده (CV Anchor / Resume Reference)
  practicalWorkReference?: string; // ارجاع مستقیم به کارهای عملیاتی، نرم‌افزارهای مسلط، گواهینامه‌ها یا سال‌های سابقه کار
  jargonTerms?: string[]; // اصطلاحات زبان تخصصی و عامیانه مهندسی آلمانی (Deutsche Fachsprache & Ingenieur-Jargon)
  germanJargonExplanation?: string; // توضیح اصطلاحات فنی و عامیانه مهندسی به کار رفته در سوال
}

export interface InterviewQuestionsResult {
  candidateName: string;
  targetRole: string;
  targetRoleDe: string;
  experienceLevelDetected: string;
  summaryOverview: string;
  germanMarketInsights: string[];
  questions: InterviewQuestionItem[];
  interviewerProfile?: {
    titleFa: string;
    titleDe: string;
    roleDescriptionFa: string;
  };
  candidateWorkProfile?: {
    yearsOfExperience?: number | string;
    softwareTools?: string[];
    certifications?: string[];
    practicalProjects?: string[];
    academicDegree?: string;
  };
  extractedResumeDetails?: {
    candidateName?: string;
    targetRole?: string;
    keySkills?: string[];
    workHistoryHighlights?: string[];
    educationSummary?: string;
    fileName?: string;
  };
  trace?: {
    sourcePriority: string;
    candidateName: string;
    targetRole: string;
    pdfProvided: boolean;
    timestamp: string;
  };
}

export interface ExtractedCandidateSkill {
  name: string;
  level?: string;
  category?: string;
  isMatched?: boolean;
}

export interface HighlightedMismatch {
  skill: string;
  severity: "critical" | "important" | "bonus";
  gapDescription: string;
  actionableAdvice: string;
}

export interface ActionableSuggestion {
  category: "keywords" | "experience_bullets" | "lebenslauf_format" | string;
  title: string;
  description: string;
}

export interface ResumeJobAnalysisData {
  atsMatchScore: number;
  matchLevel: string;
  executiveSummary: string;
  extractedCandidateSkills: ExtractedCandidateSkill[];
  jobRequiredSkills: string[];
  matchedSkills: Array<{ skill: string; description: string }>;
  highlightedMismatches: HighlightedMismatch[];
  experienceAnalysis?: {
    candidateYears: number;
    requiredYears: number;
    status: string;
    notes: string;
  };
  languageAnalysis?: {
    germanStatus: string;
    englishStatus: string;
    notes: string;
  };
  actionableSuggestions: ActionableSuggestion[];
  tailoredBulletPoints?: string[];
  tailoredHeadline?: string;
  tailoredSummarySnippet?: string;
}

export interface VisaPathwayPrediction {
  id: string;
  nameFa: string;
  nameDe: string;
  legalBasis: string;
  probabilityPercent: number;
  status: "high" | "moderate" | "low" | "critical";
  statusLabelFa: string;
  keyStrengths: string[];
  blockersOrRisks: string[];
  salaryOrPointsCondition: string;
  typicalProcessingWeeks: string;
}

export interface VisaSuccessPredictionResult {
  overallScore: number;
  verdictLabelFa: string;
  verdictDescriptionFa: string;
  isAiGenerated: boolean;
  analyzedAt: string;
  targetProfession: string;
  fastTrackEligible: boolean; // § 81a AufenthG
  anabinStatusEvaluation: string;
  pathways: VisaPathwayPrediction[];
  legalRiskAudit: string[];
  actionableNextSteps: string[];
  historicalTrendData?: Array<{
    month: string;
    monthDe: string;
    professionSuccessRate: number;
    benchmarkAverage: number;
    avgWeeks: number;
    notesFa?: string;
  }>;
  trendSummaryFa?: string;
}

export interface SalaryEstimateCity {
  cityKey: string;
  cityNameFa: string;
  cityNameDe: string;
  state: string;
  stateFa: string;
  minGrossAnnualEur: number;
  medianGrossAnnualEur: number;
  maxGrossAnnualEur: number;
  minGrossMonthlyEur: number;
  medianGrossMonthlyEur: number;
  maxGrossMonthlyEur: number;
  estimatedNetMonthlyEur: number; // Netto Steuerklasse 1
  costOfLivingIndex: number; // Berlin = 100
  purchasingPowerRating: string;
  blueCardPassStatus: "guaranteed" | "eligible" | "conditional";
  blueCardPassLabelFa: string;
  averageMonthlyRent1BedCenterEur: number;
  cityHighlightsFa: string;
}

export interface SalaryEstimateResult {
  professionTitleFa: string;
  professionTitleDe: string;
  kldbCode: string;
  experienceYears: number;
  experienceLevelLabel: string;
  isShortageOccupation: boolean;
  blueCardThresholdEur: number;
  nationalAverage: {
    minGrossAnnualEur: number;
    medianGrossAnnualEur: number;
    maxGrossAnnualEur: number;
    medianGrossMonthlyEur: number;
    estimatedNetMonthlyEur: number;
  };
  cities: SalaryEstimateCity[];
  taxAndDeductionsBreakdown: {
    incomeTaxPercent: number;
    socialSecurityPercent: number; // Pension, health, care, unemployment
    netTakeHomePercent: number;
  };
  negotiationTips: string[];
  summaryFa: string;
  isAiGenerated: boolean;
  calculatedAt: string;
}

export interface SalaryEstimatorParams {
  field?: string;
  experience?: number;
  degree?: string;
  skills?: string;
  germanLevel?: string;
  englishLevel?: string;
  selectedCity?: string;
  taxClass?: number;
}

export interface GermanMarketSectorDemand {
  id: string;
  nameFa: string;
  nameDe: string;
  category: "it" | "engineering" | "healthcare" | "life_sciences" | "education" | "trades_handwerk" | "logistics" | "business_finance";
  sharePercentage: number;
  openVacancies: number;
  vacanciesFormatted: string;
  growthRate: string;
  shortageLevel: "critical" | "high" | "medium";
  shortageLevelFa: string;
  fastTrackEligible: boolean; // § 81a Fast-Track
  blueCardSalaryThresholdEur: number;
  blueCardThresholdFormatted: string;
  topRolesFa: string[];
  topStatesFa: string[];
  color: string;
  descriptionFa: string;
}

export type GermanMarketTimeframe = 
  | "quarterly_current" 
  | "monthly_current" 
  | "quarterly_previous" 
  | "annual_forecast";

export type GermanMarketRegion = 
  | "all" 
  | "bayern" 
  | "baden_wuerttemberg" 
  | "berlin" 
  | "nrw" 
  | "hessen" 
  | "hamburg" 
  | "sachsen";

export interface GermanMarketDemandDistributionResult {
  totalTrackedVacancies: number;
  totalTrackedVacanciesFormatted: string;
  officialSource: string;
  lastUpdatedFa: string;
  isAiGenerated: boolean;
  aiAnalysisHeadlineFa: string;
  aiAnalysisReportFa: string;
  matchedSectorId?: string;
  sectors: GermanMarketSectorDemand[];
  timeframe?: GermanMarketTimeframe;
  timeframeLabelFa?: string;
  region?: GermanMarketRegion;
  regionLabelFa?: string;
  regionalHubsFa?: string[];
  regionalFocusFa?: string;
}

export interface GermanStateSalaryBenchmark {
  stateKey: string;
  nameDe: string;
  nameFa: string;
  region: "south" | "west" | "north" | "east";
  regionFa: string;
  medianGrossAnnualEur: number;
  minGrossAnnualEur: number;
  maxGrossAnnualEur: number;
  costOfLivingIndex: number;
  adjustedRealPurchasingPowerEur: number;
  purchasingPowerRatingFa: string;
  averageRent1BedCenterEur: number;
  topIndustries: string[];
  stateHighlightFa: string;
  blueCardPassStatus: "guaranteed" | "eligible" | "borderline";
}

export interface SalaryCalculatorParams {
  jobTitle: string;
  state: string;
  experienceYears: number;
  seniorityLevel: "junior" | "mid" | "senior" | "lead";
  degree: string;
  germanLevel: string;
  companySize: "startup" | "sme" | "enterprise";
  taxClass: number;
  hasChildren: boolean;
  hasChurchTax: boolean;
}

export interface SalaryCalculatorResult {
  jobTitle: {
    en: string;
    de: string;
    fa: string;
    kldbCode: string;
  };
  seniorityLevel: "junior" | "mid" | "senior" | "lead";
  experienceYears: number;
  selectedState: GermanStateSalaryBenchmark;
  competitiveRanges: {
    percentile25: { annualGross: number; monthlyGross: number; estimatedMonthlyNet: number };
    percentile50: { annualGross: number; monthlyGross: number; estimatedMonthlyNet: number };
    percentile75: { annualGross: number; monthlyGross: number; estimatedMonthlyNet: number };
    percentile90: { annualGross: number; monthlyGross: number; estimatedMonthlyNet: number };
  };
  stateComparisons: GermanStateSalaryBenchmark[];
  blueCardCheck: {
    isEligible: boolean;
    thresholdEur: number;
    thresholdFormatted: string;
    isShortageOccupation: boolean;
    fastTrackResidencyMonths: number;
    assessmentFa: string;
  };
  taxNetBreakdown: {
    grossMonthlyEur: number;
    netMonthlyTakeHomeEur: number;
    incomeTaxEur: number;
    socialSecurityEur: number;
    pensionInsuranceEur: number;
    healthInsuranceEur: number;
    careInsuranceEur: number;
    unemploymentInsuranceEur: number;
    effectiveDeductionRate: number;
  };
  marketTrends2026: {
    yoyGrowthPercent: number;
    yoyGrowthFormatted: string;
    remoteHybridRatio: string;
    inDemandSkills: { skill: string; bonusEstimateEur: number }[];
    topHiringEmployers: string[];
    jobOpeningVolumeFa: string;
  };
  negotiationPlaybook: {
    salaryExpectationScriptDe: string;
    salaryExpectationScriptFa: string;
    tacticalAdviceFa: string[];
    recommendedPerks: { perkDe: string; perkFa: string; valueNoteFa: string }[];
  };
  summaryFa: string;
  isAiGenerated: boolean;
  calculatedAt: string;
}


