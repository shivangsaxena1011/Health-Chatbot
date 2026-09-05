import { EmergencyAlertData } from '../types/health';

interface EmergencyRule {
  category: string;
  severity: 'critical' | 'urgent';
  patterns: RegExp[];
  reason: string;
  actions: string[];
}

const EMERGENCY_RULES: EmergencyRule[] = [
  {
    category: 'cardiac',
    severity: 'critical',
    patterns: [
      /chest\s*(pain|heaviness|tightness|pressure|crushing|squeezing)/i,
      /pain\s*(radiat|spread).*?(arm|jaw|neck|back|shoulder)/i,
      /heart\s*attack/i,
      /chhati\s*(me|mein)\s*(dard|jalan|dabav|tez dard)/i,
      /seene\s*(me|mein)\s*(dard|dabav)/i,
      /dil\s*ka\s*daura/i,
      /dolor\s*(en\s*el\s*)?pecho/i,
      /douleur\s*(dans\s*la\s*)?poitrine/i,
      /brustschmerz/i,
      /ألم\s*في\s*الصدر/,
      /胸痛/,
    ],
    reason: 'Possible acute coronary syndrome or myocardial emergency (heart-related event).',
    actions: [
      'Stop all physical activity and sit in a comfortable position.',
      'Call emergency medical services immediately.',
      'Do not attempt to drive yourself to the emergency department.',
      'If prescribed nitroglycerin or advised by emergency responders, take as instructed.',
    ],
  },
  {
    category: 'stroke',
    severity: 'critical',
    patterns: [
      /face\s*(droop|numb|paraly)/i,
      /arm\s*(weak|numb|drift|cannot\s*raise)/i,
      /slurr(ed)?\s*speech|trouble\s*speaking|cannot\s*speak/i,
      /sudden\s*(weakness|numbness|loss\s*of\s*balance|vision\s*loss)/i,
      /stroke|fast\s*symptoms/i,
      /lakwa|paralysis/i,
      /bol\s*nahi\s*(pa\s*raha|pa\s*rahi)/i,
      /munh\s*tedha/i,
      /sharir\s*(ka\s*ek\s*hissa|ek\s*taraf)\s*sunn/i,
      /derrame\s*cerebral/i,
      /avc|accident\s*vasculaire/i,
      /schlaganfall/i,
      /سكتة\s*دماغية/,
      /中风/,
    ],
    reason: 'Potential stroke or acute neurological emergency (FAST warning signs).',
    actions: [
      'Note the exact time symptoms started.',
      'Call emergency services immediately — every minute counts for brain tissue preservation.',
      'Keep the person calm and lying flat with head slightly elevated if conscious.',
      'Do not administer food, liquids, or oral medications.',
    ],
  },
  {
    category: 'respiratory',
    severity: 'critical',
    patterns: [
      /(severe|acute|cannot|unable\s*to)\s*breath(e|ing)?/i,
      /gasping\s*for\s*(air|breath)/i,
      /blue\s*(lips|fingers|skin)|cyanosis/i,
      /stridor|throat\s*closing/i,
      /saans\s*(lene\s*me\s*takleef|nahi\s*aa\s*rahi|ghut\s*raha)/i,
      /dam\s*ghut/i,
      /dificultad\s*(para\s*)?respirar/i,
      /difficulté\s*à\s*respirer/i,
      /atemnot/i,
      /ضيق\s*في\s*التنفس/,
      /呼吸困难/,
    ],
    reason: 'Severe respiratory compromise or acute airway obstruction.',
    actions: [
      'Call emergency medical services immediately.',
      'Help the person sit upright in a high Fowler position.',
      'Loosen tight clothing around the neck and chest.',
      'If the person has a prescribed rescue inhaler for asthma, assist them in using it.',
    ],
  },
  {
    category: 'anaphylaxis',
    severity: 'critical',
    patterns: [
      /anaphyla(xis|ctic)/i,
      /swelling\s*(of\s*)?(tongue|throat|lips|face)\s*(and|with)?\s*breath/i,
      /severe\s*allergic\s*reaction/i,
      /gale\s*(me\s*)?sujan\s*aur\s*saans/i,
      /reacci[oó]n\s*al[eé]rgica\s*grave/i,
      /choc\s*anaphylactique/i,
      /صدمة\s*تحسسية/,
    ],
    reason: 'Possible severe systemic allergic reaction (anaphylaxis).',
    actions: [
      'Call emergency services immediately.',
      'If an epinephrine auto-injector (EpiPen) is available and prescribed, use it immediately in the outer thigh.',
      'Have the person lie flat with legs elevated unless they are vomiting or having severe breathing difficulty.',
    ],
  },
  {
    category: 'hemorrhage',
    severity: 'critical',
    patterns: [
      /(severe|uncontrolled|heavy|arterial)\s*bleed(ing)?/i,
      /coughing\s*(up\s*)?blood|vomiting\s*blood|hematemesis/i,
      /blood\s*gushing/i,
      /khoon\s*(ki\s*ulti|ruk\s*nahi\s*raha|baha\s*raha)/i,
      /hemorragia\s*grave/i,
      /saignement\s*abondant/i,
      /نزيف\s*حserver|نزيف\s*شديد/,
      /大出血/,
    ],
    reason: 'Acute severe hemorrhage or gastrointestinal/internal bleeding.',
    actions: [
      'Apply firm, continuous direct pressure to external bleeding with a clean cloth or bandage.',
      'Call emergency services immediately.',
      'Do not remove pressure dressings once applied; add more layers if soaked through.',
    ],
  },
  {
    category: 'unconscious_seizure',
    severity: 'critical',
    patterns: [
      /unconscious(ness)?|unresponsive|passed\s*out|fainted\s*and\s*not\s*waking/i,
      /(active|ongoing|continuous)\s*seizure|convulsion/i,
      /behoshi|behosh|daura\s*pad\s*raha/i,
      /perte\s*de\s*connaissance|crise\s*d'épilepsie/i,
      /pérdida\s*del\s*conocimiento|convulsiones/i,
      /فقدان\s*الوعي|تشنجات/,
      /昏迷|抽搐/,
    ],
    reason: 'Loss of consciousness or ongoing acute seizure activity.',
    actions: [
      'Check for breathing and pulse. Call emergency medical responders.',
      'For seizures, gently protect the person from nearby hard or sharp objects; do NOT put anything in their mouth.',
      'Place in recovery position (on their side) once safe and if breathing.',
    ],
  },
  {
    category: 'crisis_selfharm',
    severity: 'critical',
    patterns: [
      /want\s*to\s*(die|kill\s*myself|end\s*my\s*life|commit\s*suicide)/i,
      /suicid(al|e)/i,
      /marne\s*ka\s*man|khudkushi|jaan\s*dena/i,
      /pensamientos\s*suicidas/i,
      /idées\s*suicidaires/i,
      /أفكار\s*انتحارية/,
      /自杀/,
    ],
    reason: 'Urgent mental health crisis or self-harm risk detected.',
    actions: [
      'You are not alone and help is available right now.',
      'Call your local suicide and crisis hotline immediately.',
      'India: Tele-MANAS (14416 or 1800-891-4416) | US: 988 Suicide & Crisis Lifeline | UK: 111 or Samaritans 116 123',
      'Please reach out to a trusted loved one or healthcare professional right away.',
    ],
  },
];

const EMERGENCY_NUMBERS: Record<string, { number: string; label: string }[]> = {
  IN: [
    { number: '112', label: 'National Emergency Helpline' },
    { number: '102 / 108', label: 'Ambulance Services' },
    { number: '14416', label: 'Tele-MANAS Mental Health Support' },
  ],
  US: [
    { number: '911', label: 'Emergency Services (Police, Fire, Ambulance)' },
    { number: '988', label: 'Suicide & Crisis Lifeline' },
  ],
  UK: [
    { number: '999', label: 'Emergency Services' },
    { number: '111', label: 'NHS Urgent Medical Advice' },
  ],
  EU: [
    { number: '112', label: 'European Emergency Number' },
  ],
  GLOBAL: [
    { number: '112', label: 'International Emergency Services' },
  ],
};
export function detectEmergency(query: string, countryCode: string = 'IN'): EmergencyAlertData {
  const contacts = (EMERGENCY_NUMBERS[countryCode] || EMERGENCY_NUMBERS['IN']).map(c => ({
    country: countryCode,
    number: c.number,
    label: c.label,
  }));

  if (!query || typeof query !== 'string') {
    return {
      isEmergency: false,
      severity: 'none',
      reasons: [],
      immediateActions: [],
      emergencyContacts: contacts,
    };
  }

  const normalized = query.toLowerCase();
  const matchedRules: EmergencyRule[] = [];

  for (const rule of EMERGENCY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(normalized)) {
        matchedRules.push(rule);
        break;
      }
    }
  }

  if (matchedRules.length === 0) {
    return {
      isEmergency: false,
      severity: 'none',
      reasons: [],
      immediateActions: [],
      emergencyContacts: contacts,
    };
  }

  const reasons = Array.from(new Set(matchedRules.map(r => r.reason)));
  const immediateActions = Array.from(new Set(matchedRules.flatMap(r => r.actions)));

  return {
    isEmergency: true,
    severity: 'critical',
    reasons,
    immediateActions,
    emergencyContacts: contacts,
  };
}
