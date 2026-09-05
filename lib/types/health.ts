export type Role = 'user' | 'assistant' | 'system';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export interface TrustedSource {
  title: string;
  sourceOrg: 'WHO' | 'CDC' | 'NIH / MedlinePlus' | 'NHS' | 'Government Health Portal';
  url: string;
  category?: string;
  condition?: string;
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  role: Role;
  content: string;
  language?: string;
  timestamp: string | Date;
  redFlagDetected?: boolean;
  emergencyInfo?: EmergencyAlertData;
  sources?: TrustedSource[];
  suggestedFollowUps?: string[];
}

export interface EmergencyAlertData {
  isEmergency: boolean;
  severity: 'critical' | 'urgent' | 'warning' | 'none';
  reasons: string[];
  immediateActions: string[];
  emergencyContacts: {
    country: string;
    number: string;
    label: string;
  }[];
}

export interface HealthProfileData {
  age?: number;
  sex?: string;
  heightCm?: number;
  weightKg?: number;
  bloodType?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  symptoms?: string;
  painLevel?: number;
  mood?: 'good' | 'neutral' | 'poor' | 'anxious' | 'tired';
  sleepHours?: number;
  waterIntakeLiters?: number;
  systolicBp?: number;
  diastolicBp?: number;
  bloodGlucoseMgDl?: number;
  weightKg?: number;
  notes?: string;
}

export interface LabTestItem {
  id?: string;
  testName: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  explanation: string;
  questionsToAsk: string;
}

export interface LabAnalysisResult {
  fileName: string;
  testDate?: string;
  labName?: string;
  overallSummary: string;
  confidenceScore: number;
  results: LabTestItem[];
  questionsForDoctor: string[];
  sources: TrustedSource[];
}

export interface MedicineDetails {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  commonUses: string[];
  precautions: string[];
  sideEffects: string[];
  warnings: string[];
  whenToConsultDoctor: string;
  trustedSources: TrustedSource[];
}

export interface DrugInteractionResult {
  drugs: string[];
  hasInteraction: boolean;
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor' | 'none';
  clinicalSummary: string;
  managementAdvice: string;
  sourceOrg: string;
}
