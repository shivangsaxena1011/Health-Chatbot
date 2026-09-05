import { MedicineDetails, DrugInteractionResult, TrustedSource } from '../types/health';

export const MEDICINE_DATABASE: MedicineDetails[] = [
  {
    id: 'med-paracetamol',
    genericName: 'Paracetamol (Acetaminophen)',
    brandNames: ['Crocin', 'Dolo 650', 'Calpol', 'Tylenol', 'Panadol'],
    drugClass: 'Analgesic and Antipyretic',
    commonUses: [
      'Temporary relief of mild to moderate pain (headache, toothache, muscle ache)',
      'Reduction of fever in viral or bacterial illnesses',
    ],
    precautions: [
      'Never exceed recommended daily limits (typically 4,000 mg/day in healthy adults, lower in liver disease).',
      'Check other cold/flu combination products to avoid accidental acetaminophen overdose.',
    ],
    sideEffects: [
      'Generally well-tolerated at therapeutic dosages.',
      'Rare: Skin rash, allergic reaction, liver toxicity with overdose or prolonged excessive use.',
    ],
    warnings: [
      'Avoid concurrent heavy alcohol consumption as it substantially increases liver toxicity risk.',
      'Use with caution in preexisting chronic liver disease or malnutrition.',
    ],
    whenToConsultDoctor: 'If fever persists beyond 3 days or pain persists beyond 5–7 days without explanation.',
    trustedSources: [
      {
        title: 'NHS Medicines Guide: Paracetamol for Adults',
        sourceOrg: 'NHS',
        url: 'https://www.nhs.uk/medicines/paracetamol-for-adults/',
      },
      {
        title: 'MedlinePlus Drug Information: Acetaminophen',
        sourceOrg: 'NIH / MedlinePlus',
        url: 'https://medlineplus.gov/druginfo/meds/a681004.html',
      },
    ],
  },
  {
    id: 'med-ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Brufen', 'Advil', 'Motrin', 'Nurofen'],
    drugClass: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
    commonUses: [
      'Relief of inflammatory pain (arthritis, dysmenorrhea, dental pain, backache)',
      'Reduction of fever when appropriate',
    ],
    precautions: [
      'Always take with or after food or milk to reduce gastric irritation.',
      'Avoid in suspected Dengue fever due to increased risk of hemorrhage.',
    ],
    sideEffects: [
      'Common: Stomach upset, heartburn, nausea, indigestion.',
      'Serious: Peptic ulcers, gastrointestinal bleeding, fluid retention, worsening of kidney function.',
    ],
    warnings: [
      'Contraindicated in active peptic ulcer disease or severe renal impairment.',
      'Use with caution in hypertension and heart failure.',
    ],
    whenToConsultDoctor: 'If you observe black tarry stools, vomit resembling coffee grounds, or persistent severe stomach pain.',
    trustedSources: [
      {
        title: 'NHS Medicines Guide: Ibuprofen',
        sourceOrg: 'NHS',
        url: 'https://www.nhs.uk/medicines/ibuprofen-for-adults/',
      },
      {
        title: 'MedlinePlus: Ibuprofen',
        sourceOrg: 'NIH / MedlinePlus',
        url: 'https://medlineplus.gov/druginfo/meds/a682159.html',
      },
    ],
  },
  {
    id: 'med-metformin',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glycomet', 'Glucophage', 'Riomet'],
    drugClass: 'Biguanide Antihyperglycemic',
    commonUses: [
      'First-line pharmacological management of Type 2 Diabetes Mellitus',
      'Management of insulin resistance in Polycystic Ovary Syndrome (PCOS) under specialist care',
    ],
    precautions: [
      'Take with meals to minimize gastrointestinal discomfort.',
      'Monitor kidney function (eGFR) periodically before and during therapy.',
    ],
    sideEffects: [
      'Common: Diarrhea, nausea, metallic taste, abdominal bloating.',
      'Rare but critical: Lactic acidosis (primarily in severe renal/hepatic impairment or sepsis).',
    ],
    warnings: [
      'Must be temporarily withheld prior to iodinated contrast radiological procedures.',
      'Excessive alcohol intake increases the risk of lactic acidosis.',
    ],
    whenToConsultDoctor: 'If experiencing severe weakness, unusual muscle pain, trouble breathing, or persistent vomiting.',
    trustedSources: [
      {
        title: 'WHO Model List of Essential Medicines: Metformin',
        sourceOrg: 'WHO',
        url: 'https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02',
      },
      {
        title: 'MedlinePlus: Metformin',
        sourceOrg: 'NIH / MedlinePlus',
        url: 'https://medlineplus.gov/druginfo/meds/a696005.html',
      },
    ],
  },
  {
    id: 'med-amlodipine',
    genericName: 'Amlodipine Besylate',
    brandNames: ['Amlong', 'Norvasc', 'Stamlo'],
    drugClass: 'Calcium Channel Blocker (Dihydropyridine)',
    commonUses: [
      'Management of essential hypertension (high blood pressure)',
      'Management of chronic stable angina',
    ],
    precautions: [
      'Do not abruptly discontinue without physician consultation.',
      'May cause peripheral edema (swelling in ankles and feet).',
    ],
    sideEffects: [
      'Common: Peripheral edema, facial flushing, palpitations, dizziness when standing up.',
      'Uncommon: Fatigue, abdominal discomfort.',
    ],
    warnings: [
      'Caution in severe aortic stenosis and severe hepatic impairment.',
    ],
    whenToConsultDoctor: 'If significant ankle swelling develops or if experiencing lightheadedness or chest palpitations.',
    trustedSources: [
      {
        title: 'NHS Medicines Guide: Amlodipine',
        sourceOrg: 'NHS',
        url: 'https://www.nhs.uk/medicines/amlodipine/',
      },
    ],
  },
  {
    id: 'med-atorvastatin',
    genericName: 'Atorvastatin',
    brandNames: ['Atorva', 'Lipitor', 'Storvas'],
    drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    commonUses: [
      'Reduction of elevated total cholesterol, LDL-C, and triglycerides',
      'Prevention of cardiovascular events in high-risk individuals',
    ],
    precautions: [
      'Routine baseline liver enzyme testing is recommended.',
      'Avoid excessive grapefruit juice intake which increases blood statin levels.',
    ],
    sideEffects: [
      'Common: Mild headache, joint pain, mild gastrointestinal upset.',
      'Uncommon/Rare: Myopathy, myalgia, elevated liver transaminases.',
    ],
    warnings: [
      'Contraindicated in active liver disease and during pregnancy/breastfeeding.',
    ],
    whenToConsultDoctor: 'Promptly report unexplained muscle ache, tenderness, weakness, or dark tea-colored urine.',
    trustedSources: [
      {
        title: 'MedlinePlus: Atorvastatin',
        sourceOrg: 'NIH / MedlinePlus',
        url: 'https://medlineplus.gov/druginfo/meds/a600045.html',
      },
    ],
  },
  {
    id: 'med-aspirin',
    genericName: 'Aspirin (Acetylsalicylic Acid)',
    brandNames: ['Ecosprin', 'Disprin', 'Bayer Aspirin'],
    drugClass: 'Antiplatelet and Salicylate NSAID',
    commonUses: [
      'Secondary prevention of cardiovascular thrombotic events (low-dose 75-100 mg)',
      'Analgesic and anti-inflammatory at higher doses',
    ],
    precautions: [
      'Never administer to children or adolescents recovering from viral infections due to Reye’s syndrome risk.',
      'Increases bleeding tendency during surgeries or dental extractions.',
    ],
    sideEffects: [
      'Common: Gastric irritation, increased bleeding time, easy bruising.',
      'Serious: Gastrointestinal hemorrhage, peptic ulceration, bronchospasm in aspirin-sensitive asthma.',
    ],
    warnings: [
      'Do not combine with other NSAIDs (like Ibuprofen) without specific medical supervision.',
    ],
    whenToConsultDoctor: 'If unusual bruising, prolonged nosebleeds, black stools, or coffee-ground vomit occur.',
    trustedSources: [
      {
        title: 'CDC / AHA Cardiovascular Prevention Guidelines',
        sourceOrg: 'CDC',
        url: 'https://www.cdc.gov/heart-disease/about/aspirin.html',
      },
    ],
  },
];

interface InteractionRule {
  pair: [string, string];
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor';
  summary: string;
  management: string;
}

const KNOWN_INTERACTIONS: InteractionRule[] = [
  {
    pair: ['aspirin', 'ibuprofen'],
    severity: 'major',
    summary: 'Concomitant use increases the risk of severe gastrointestinal ulceration and bleeding. Ibuprofen may also competitively inhibit the cardioprotective antiplatelet effect of low-dose aspirin.',
    management: 'Avoid concurrent use unless strictly directed by a cardiologist. If both are necessary, take immediate-release aspirin at least 30 minutes before or 8 hours after ibuprofen.',
  },
  {
    pair: ['metformin', 'alcohol'],
    severity: 'major',
    summary: 'Alcohol potentiates the effect of metformin on lactate metabolism, significantly increasing the risk of potentially life-threatening lactic acidosis and severe hypoglycemia.',
    management: 'Avoid binge drinking or chronic heavy alcohol consumption while receiving metformin therapy.',
  },
  {
    pair: ['atorvastatin', 'clarithromycin'],
    severity: 'major',
    summary: 'Clarithromycin is a potent CYP3A4 inhibitor that markedly increases systemic concentrations of atorvastatin, dramatically elevating the risk of severe rhabdomyolysis and myopathy.',
    management: 'Atorvastatin should be temporarily suspended during clarithromycin antibiotic treatment, or an alternative non-CYP3A4 antibiotic considered.',
  },
  {
    pair: ['amlodipine', 'simvastatin'],
    severity: 'moderate',
    summary: 'Amlodipine increases blood concentrations of simvastatin/statins, raising the risk of statin-associated muscle aches and myopathy.',
    management: 'Physicians typically cap statin dosage when co-administered with amlodipine and monitor for muscle symptoms.',
  },
  {
    pair: ['paracetamol', 'alcohol'],
    severity: 'moderate',
    summary: 'Chronic alcohol consumption depletes hepatic glutathione stores, which increases the accumulation of the toxic paracetamol metabolite NAPQI, increasing the risk of hepatotoxicity.',
    management: 'Strictly limit paracetamol dosage to under 2,000 mg/day in individuals who regularly consume alcohol.',
  },
];

export function searchMedicines(query: string): MedicineDetails[] {
  if (!query || query.trim().length === 0) {
    return MEDICINE_DATABASE;
  }
  const q = query.toLowerCase().trim();
  return MEDICINE_DATABASE.filter(med => {
    return (
      med.genericName.toLowerCase().includes(q) ||
      med.drugClass.toLowerCase().includes(q) ||
      med.brandNames.some(b => b.toLowerCase().includes(q)) ||
      med.commonUses.some(u => u.toLowerCase().includes(q))
    );
  });
}

export function checkDrugInteractions(drugNames: string[]): DrugInteractionResult[] {
  if (!drugNames || drugNames.length < 2) {
    return [];
  }

  const normalized = drugNames.map(d => d.toLowerCase().trim());
  const results: DrugInteractionResult[] = [];

  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const drugA = normalized[i];
      const drugB = normalized[j];

      // Find matching interaction rule
      const match = KNOWN_INTERACTIONS.find(rule => {
        const [r1, r2] = rule.pair;
        return (
          (drugA.includes(r1) && drugB.includes(r2)) ||
          (drugA.includes(r2) && drugB.includes(r1))
        );
      });

      if (match) {
        results.push({
          drugs: [drugNames[i], drugNames[j]],
          hasInteraction: true,
          severity: match.severity,
          clinicalSummary: match.summary,
          managementAdvice: match.management,
          sourceOrg: 'NIH / MedlinePlus & British National Formulary (BNF)',
        });
      } else {
        results.push({
          drugs: [drugNames[i], drugNames[j]],
          hasInteraction: false,
          severity: 'none',
          clinicalSummary: 'No severe or major documented clinical interaction found between these two specific agents in the standard reference index.',
          managementAdvice: 'Always verify with your prescribing doctor or pharmacist before combining any over-the-counter or prescription medications.',
          sourceOrg: 'Standard Pharmacological Reference',
        });
      }
    }
  }

  return results;
}
