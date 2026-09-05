import { TrustedSource, LabAnalysisResult, DrugInteractionResult } from '../types/health';
import { RetrievedDocument } from '../rag/retriever';

export interface HealthChatRequest {
  messages: Array<{ role: string; content: string }>;
  query: string;
  language: string;
  userProfile?: {
    age?: number;
    sex?: string;
    chronicConditions?: string;
    allergies?: string;
    currentMedications?: string;
  };
  retrievedDocs: RetrievedDocument[];
  redFlagInfo?: {
    isEmergency: boolean;
    reasons: string[];
    immediateActions: string[];
  };
}

export interface HealthChatResponse {
  content: string;
  sources: TrustedSource[];
  suggestedFollowUps: string[];
  redFlagDetected: boolean;
}

export interface AIProvider {
  generateHealthResponse(request: HealthChatRequest): Promise<HealthChatResponse>;
  analyzeLabReport(textOrBase64: string, isImage?: boolean): Promise<LabAnalysisResult>;
}
