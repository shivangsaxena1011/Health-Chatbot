import { detectEmergency } from '../ai/emergency-engine';
import { TrustedSource } from '../types/health';

export interface SymptomAssessmentInput {
  symptoms: string[];
  duration: string; // e.g. '<24h', '1-3 days', '4-7 days', '>1 week'
  severity: 'mild' | 'moderate' | 'severe';
  feverPresent: boolean;
  difficultyBreathing: boolean;
  chestPain: boolean;
  additionalNotes?: string;
}

export interface PossibleConditionTopic {
  condition: string;
  relevance: 'high' | 'moderate' | 'possible';
  supportingSymptoms: string[];
  description: string;
  sourceOrg: string;
}

export interface SymptomAssessmentResult {
  isEmergency: boolean;
  emergencyReasons: string[];
  urgencyLevel: 'immediate_emergency' | 'urgent_care' | 'routine_consultation' | 'self_care_and_monitor';
  recommendedAction: string;
  possibleTopics: PossibleConditionTopic[];
  informationGaps: string[];
  redFlagsToWatch: string[];
  questionsForDoctor: string[];
  sources: TrustedSource[];
  disclaimer: string;
}

const SYMPTOM_KNOWLEDGE: Array<{
  condition: string;
  sourceOrg: string;
  triggers: string[];
  description: string;
  redFlags: string[];
  doctorQuestions: string[];
}> = [
  {
    condition: 'Upper Respiratory Tract Infection (Common Cold / Viral Rhinitis)',
    sourceOrg: 'CDC',
    triggers: ['runny nose', 'sneezing', 'mild sore throat', 'stuffy nose', 'mild cough'],
    description: 'A self-limiting viral infection of the nose and throat, characterized by gradual onset of nasal congestion, sneezing, and throat irritation.',
    redFlags: ['High fever >102°F lasting more than 3 days', 'Difficulty breathing or wheezing', 'Severe earache or sinus pain'],
    doctorQuestions: ['Could my nasal congestion be due to seasonal allergies instead of a cold?', 'What saline irrigation or humidity measures do you recommend?'],
  },
  {
    condition: 'Influenza (Flu)',
    sourceOrg: 'WHO / CDC',
    triggers: ['high fever', 'chills', 'severe body ache', 'sudden fatigue', 'dry cough', 'headache'],
    description: 'An acute viral infection of the respiratory tract with sudden onset of high fever, severe muscle aches, exhaustion, and dry cough.',
    redFlags: ['Shortness of breath or rapid breathing', 'Chest pain or pressure', 'Dizziness or confusion upon standing'],
    doctorQuestions: ['Am I eligible for antiviral medication within the first 48 hours of flu onset?', 'Are any of my chronic conditions at higher risk of flu complications?'],
  },
  {
    condition: 'Gastroenteritis / Food Poisoning',
    sourceOrg: 'NHS',
    triggers: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'loose motions'],
    description: 'Inflammation of the stomach and intestines typically caused by viral or bacterial foodborne contamination, causing watery stools and cramps.',
    redFlags: ['Signs of severe dehydration (dark urine, sunken eyes, extreme dry mouth)', 'Blood in stool or vomit', 'Inability to keep fluids down for 24 hours'],
    doctorQuestions: ['Should I use oral rehydration solution (ORS) with specific electrolyte ratios?', 'Do I require stool microbiology testing if symptoms exceed 48 hours?'],
  },
  {
    condition: 'Migraine or Tension-Type Headache',
    sourceOrg: 'NIH / MedlinePlus',
    triggers: ['throbbing headache', 'light sensitivity', 'sound sensitivity', 'head pressure', 'temple pain'],
    description: 'Neurovascular or muscular headache disorder causing pulsing pain, often unilateral, frequently worsened by bright light and loud noise.',
    redFlags: ['Sudden explosive "thunderclap" headache (maximum pain within seconds)', 'Headache accompanied by fever and stiff neck', 'Neurological changes like limb numbness or vision loss'],
    doctorQuestions: ['Would keeping a headache trigger diary help identify environmental causes?', 'What preventive options exist if headaches occur multiple times per month?'],
  },
  {
    condition: 'Allergic Rhinitis (Hay Fever)',
    sourceOrg: 'WHO',
    triggers: ['itchy eyes', 'itchy nose', 'watery eyes', 'clear nasal discharge', 'repetitive sneezing'],
    description: 'An allergic immune response to airborne allergens such as pollen, house dust mites, or animal dander without systemic fever.',
    redFlags: ['Wheezing or chest tightness indicating allergic asthma', 'Facial swelling or difficulty swallowing'],
    doctorQuestions: ['Would allergen skin prick testing or antihistamines be most effective?', 'What environmental dust-proofing measures are recommended at home?'],
  },
];

export function assessSymptoms(input: SymptomAssessmentInput): SymptomAssessmentResult {
  const combinedSymptoms = [...input.symptoms];
  if (input.additionalNotes) {
    combinedSymptoms.push(input.additionalNotes);
  }
  const textQuery = combinedSymptoms.join(' ');

  // 1. Emergency red-flag evaluation
  const emergencyCheck = detectEmergency(textQuery);
  const isEmergency = emergencyCheck.isEmergency || input.chestPain || input.difficultyBreathing;

  const emergencyReasons = [...emergencyCheck.reasons];
  if (input.chestPain && !emergencyReasons.some(r => r.toLowerCase().includes('cardiac') || r.toLowerCase().includes('chest'))) {
    emergencyReasons.push('Reported chest pain or pressure requires urgent ruling out of cardiovascular events.');
  }
  if (input.difficultyBreathing && !emergencyReasons.some(r => r.toLowerCase().includes('respiratory') || r.toLowerCase().includes('breath'))) {
    emergencyReasons.push('Reported difficulty breathing indicates potential acute respiratory compromise.');
  }

  if (isEmergency) {
    return {
      isEmergency: true,
      emergencyReasons,
      urgencyLevel: 'immediate_emergency',
      recommendedAction: 'Immediate emergency medical care is strongly advised. Call 112 / 911 or head to the nearest emergency department right away. Do not attempt to self-treat or drive yourself.',
      possibleTopics: [
        {
          condition: 'Acute Cardiorespiratory or Neurological Event',
          relevance: 'high',
          supportingSymptoms: input.symptoms,
          description: 'Critical signs requiring immediate hospital evaluation and clinical diagnostic tests.',
          sourceOrg: 'CDC / AHA',
        },
      ],
      informationGaps: ['Time of symptom onset', 'Pre-existing cardiac or respiratory history'],
      redFlagsToWatch: ['Worsening chest tightness', 'Bluish lips or fingertips', 'Confusion or fainting'],
      questionsForDoctor: ['What emergency diagnostic tests (ECG, Troponin, Chest X-ray) are needed?'],
      sources: [
        {
          title: 'AHA / CDC Warning Signs of Medical Emergencies',
          sourceOrg: 'CDC',
          url: 'https://www.cdc.gov/heart-disease/about/heart-attack.html',
        },
      ],
      disclaimer: 'CRITICAL NOTICE: Swasth AI is an awareness platform and cannot replace emergency emergency medical responders. Seek emergency hospital care immediately.',
    };
  }

  // 2. Identify potential health awareness condition topics
  const matchingTopics: PossibleConditionTopic[] = [];
  const normalizedText = textQuery.toLowerCase();

  for (const item of SYMPTOM_KNOWLEDGE) {
    const matchedTriggers = item.triggers.filter(t => normalizedText.includes(t.toLowerCase()));
    if (matchedTriggers.length > 0) {
      matchingTopics.push({
        condition: item.condition,
        relevance: matchedTriggers.length >= 2 ? 'high' : 'moderate',
        supportingSymptoms: matchedTriggers,
        description: item.description,
        sourceOrg: item.sourceOrg,
      });
    }
  }

  if (matchingTopics.length === 0) {
    matchingTopics.push({
      condition: 'Non-Specific Symptom Presentation',
      relevance: 'possible',
      supportingSymptoms: input.symptoms,
      description: 'The combination of reported symptoms does not fit a single distinct pattern and requires clinical evaluation by a physician.',
      sourceOrg: 'WHO',
    });
  }

  // 3. Determine urgency level
  let urgencyLevel: 'urgent_care' | 'routine_consultation' | 'self_care_and_monitor' = 'self_care_and_monitor';
  let recommendedAction = '';

  if (input.severity === 'severe' || (input.feverPresent && input.duration === '>1 week')) {
    urgencyLevel = 'urgent_care';
    recommendedAction = 'Given the reported severity or duration, prompt in-person consultation with a physician or urgent care clinic within 24 hours is recommended.';
  } else if (input.duration === '4-7 days' || input.severity === 'moderate') {
    urgencyLevel = 'routine_consultation';
    recommendedAction = 'Schedule an appointment with your healthcare provider for a thorough physical examination and targeted investigation.';
  } else {
    urgencyLevel = 'self_care_and_monitor';
    recommendedAction = 'Rest, maintain hydration, and monitor your symptoms. If symptoms worsen, do not improve within 3-5 days, or new signs develop, consult a healthcare provider.';
  }

  // 4. Identify information gaps
  const informationGaps: string[] = [];
  if (!input.additionalNotes) {
    informationGaps.push('Specific time of day symptoms are worst');
    informationGaps.push('Whether symptoms started abruptly or built up over days');
  }
  informationGaps.push('Recent travel, sick contacts, or dietary changes');
  informationGaps.push('Current temperature measurements using a medical thermometer');

  // 5. Gather red flags to watch
  const redFlagsToWatch: string[] = [
    'Development of chest pain, pressure, or palpitations',
    'Difficulty breathing, wheezing, or stridor',
    'Inability to tolerate oral fluids or signs of dehydration',
    'Persistent high fever (>102°F) unresponsive to fever medication',
    'Sudden confusion, stiff neck, or extreme lethargy',
  ];

  // 6. Formulate doctor questions
  const doctorQuestions = Array.from(
    new Set(matchingTopics.flatMap(t => {
      const match = SYMPTOM_KNOWLEDGE.find(k => k.condition === t.condition);
      return match ? match.doctorQuestions : [];
    }))
  );
  if (doctorQuestions.length === 0) {
    doctorQuestions.push('What is the most likely cause of my symptom pattern?');
    doctorQuestions.push('Are any laboratory tests recommended to investigate further?');
  }

  const sources: TrustedSource[] = [
    {
      title: 'CDC Symptom Awareness & Prevention Guidelines',
      sourceOrg: 'CDC',
      url: 'https://www.cdc.gov',
      category: 'public_health',
    },
    {
      title: 'WHO Public Health Factsheets',
      sourceOrg: 'WHO',
      url: 'https://www.who.int',
      category: 'public_health',
    },
  ];

  return {
    isEmergency: false,
    emergencyReasons: [],
    urgencyLevel,
    recommendedAction,
    possibleTopics: matchingTopics,
    informationGaps,
    redFlagsToWatch,
    questionsForDoctor: doctorQuestions,
    sources,
    disclaimer: 'This assessment is for health education and awareness only. It does not constitute a clinical medical diagnosis. Always consult a qualified medical professional for diagnosis and treatment.',
  };
}
