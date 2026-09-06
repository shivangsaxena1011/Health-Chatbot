import { LabAnalysisResult, LabTestItem, TrustedSource } from '../types/health';

interface StandardLabReference {
  keywords: string[];
  testName: string;
  defaultUnit: string;
  normalMin: number;
  normalMax: number;
  explanation: string;
  lowMeaning: string;
  highMeaning: string;
  questionsToAsk: string;
}

const KNOWN_LAB_TESTS: StandardLabReference[] = [
  {
    keywords: ['hemoglobin', 'hb', 'hgb'],
    testName: 'Hemoglobin (Hb)',
    defaultUnit: 'g/dL',
    normalMin: 12.0,
    normalMax: 17.0,
    explanation: 'Hemoglobin is the iron-rich protein in red blood cells that carries oxygen from your lungs to the rest of your body.',
    lowMeaning: 'Values below reference range may indicate anemia, blood loss, nutritional deficiencies (iron, B12, folate), or chronic illness.',
    highMeaning: 'Values above reference range can be seen in dehydration, smoking, high altitudes, or certain bone marrow conditions.',
    questionsToAsk: 'Could nutritional deficiencies or recent blood loss explain this hemoglobin value?',
  },
  {
    keywords: ['fasting blood sugar', 'fasting glucose', 'fbs', 'fasting blood glucose'],
    testName: 'Fasting Blood Sugar (Glucose)',
    defaultUnit: 'mg/dL',
    normalMin: 70.0,
    normalMax: 99.0,
    explanation: 'Measures blood glucose concentration after fasting for at least 8 hours. Key screening metric for prediabetes and diabetes.',
    lowMeaning: 'Hypoglycemia (under 70 mg/dL) can cause shaking, sweating, confusion, and requires prompt glucose intake.',
    highMeaning: '100-125 mg/dL indicates prediabetes; 126 mg/dL or higher on two separate tests indicates diabetes.',
    questionsToAsk: 'Do I need an HbA1c test or dietary review based on this fasting glucose reading?',
  },
  {
    keywords: ['hba1c', 'glycated hemoglobin', 'a1c'],
    testName: 'Glycated Hemoglobin (HbA1c)',
    defaultUnit: '%',
    normalMin: 4.0,
    normalMax: 5.6,
    explanation: 'Reflects your average blood sugar level over the past 2 to 3 months.',
    lowMeaning: 'Rarely clinically concerning unless accompanied by frequent hypoglycemic episodes.',
    highMeaning: '5.7% to 6.4% indicates prediabetes; 6.5% or greater indicates diabetes according to clinical diagnostic guidelines.',
    questionsToAsk: 'What target HbA1c range is most appropriate for my age and health profile?',
  },
  {
    keywords: ['total cholesterol', 'cholesterol total', 'cholesterol'],
    testName: 'Total Cholesterol',
    defaultUnit: 'mg/dL',
    normalMin: 125.0,
    normalMax: 200.0,
    explanation: 'An overall estimate of all the cholesterol types in your blood, including LDL, HDL, and VLDL.',
    lowMeaning: 'Very low cholesterol is uncommon but can occur in severe malnutrition or liver disease.',
    highMeaning: 'Elevated total cholesterol is associated with increased risk of cardiovascular atherosclerosis.',
    questionsToAsk: 'How does my complete lipid panel (LDL, HDL, Triglycerides) affect my cardiovascular risk?',
  },
  {
    keywords: ['ldl', 'ldl cholesterol', 'bad cholesterol'],
    testName: 'LDL Cholesterol',
    defaultUnit: 'mg/dL',
    normalMin: 0,
    normalMax: 100.0,
    explanation: 'Often referred to as bad cholesterol because high levels lead to plaque buildup in arteries.',
    lowMeaning: 'Generally favorable for arterial health.',
    highMeaning: 'Higher levels correlate with increased risk of coronary artery disease and stroke.',
    questionsToAsk: 'Are dietary adjustments or lipid-lowering therapies advisable for my LDL level?',
  },
  {
    keywords: ['platelet', 'platelet count', 'plt'],
    testName: 'Platelet Count',
    defaultUnit: '10^3/mcL',
    normalMin: 150.0,
    normalMax: 450.0,
    explanation: 'Platelets are tiny blood cells essential for normal blood clotting and healing.',
    lowMeaning: 'Thrombocytopenia (under 150k) can increase bleeding and bruising risk; common in viral fevers like Dengue.',
    highMeaning: 'Thrombocytosis (above 450k) can indicate reactive inflammation, infection, or bone marrow disorders.',
    questionsToAsk: 'If this was taken during a fever or illness, should I repeat the count to monitor platelet stability?',
  },
  {
    keywords: ['tsh', 'thyroid stimulating hormone'],
    testName: 'Thyroid Stimulating Hormone (TSH)',
    defaultUnit: 'mIU/L',
    normalMin: 0.4,
    normalMax: 4.5,
    explanation: 'A pituitary hormone that signals the thyroid gland to release T3 and T4 hormones.',
    lowMeaning: 'Low TSH may signal hyperthyroidism (overactive thyroid producing excess hormone).',
    highMeaning: 'Elevated TSH usually indicates hypothyroidism (underactive thyroid requiring more stimulation).',
    questionsToAsk: 'Would checking Free T3 and Free T4 antibodies help clarify this thyroid result?',
  },
  {
    keywords: ['creatinine', 'serum creatinine'],
    testName: 'Serum Creatinine',
    defaultUnit: 'mg/dL',
    normalMin: 0.6,
    normalMax: 1.2,
    explanation: 'A waste product produced by muscle metabolism, filtered and excreted almost entirely by the kidneys.',
    lowMeaning: 'Low creatinine is generally non-critical and often reflects lower muscle mass.',
    highMeaning: 'Elevated levels may indicate reduced kidney filtration efficiency, dehydration, or renal impairment.',
    questionsToAsk: 'What is my estimated Glomerular Filtration Rate (eGFR) based on this creatinine value?',
  },
];

export function parseLabReportText(rawText: string): LabAnalysisResult {
  if (!rawText || rawText.trim().length === 0) {
    return {
      fileName: 'Empty Report',
      overallSummary: 'No laboratory data could be detected in the provided text.',
      confidenceScore: 0,
      results: [],
      questionsForDoctor: [],
      sources: [],
    };
  }

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const detectedResults: LabTestItem[] = [];

  for (const ref of KNOWN_LAB_TESTS) {
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      const matchesKeyword = ref.keywords.some(k => {
        const regex = new RegExp(`\\b${k}\\b`, 'i');
        return regex.test(lowerLine);
      });

      if (matchesKeyword) {
        // Look for numeric value in this line
        const numMatches = line.match(/(\d+(\.\d+)?)/g);
        if (numMatches && numMatches.length > 0) {
          const value = parseFloat(numMatches[0]);

          // Look for reference range patterns like "12.0 - 15.0" or "70 to 99"
          const rangeMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:[-–—]|\bto\b)\s*(\d+(?:\.\d+)?)/i);
          let refRange = `${ref.normalMin} - ${ref.normalMax} ${ref.defaultUnit}`;
          let minRange = ref.normalMin;
          let maxRange = ref.normalMax;

          if (rangeMatch) {
            minRange = parseFloat(rangeMatch[1]);
            maxRange = parseFloat(rangeMatch[2]);
            refRange = `${minRange} - ${maxRange} ${ref.defaultUnit}`;
          }

          let status: 'normal' | 'low' | 'high' | 'critical' = 'normal';
          let explanation = ref.explanation;

          if (value < minRange) {
            status = 'low';
            explanation += ` Value (${value}) is below the reference range (${refRange}). ${ref.lowMeaning}`;
          } else if (value > maxRange) {
            status = 'high';
            explanation += ` Value (${value}) is above the reference range (${refRange}). ${ref.highMeaning}`;
          } else {
            status = 'normal';
            explanation += ` Value (${value}) falls within the typical reference range (${refRange}).`;
          }

          // Avoid duplicates
          if (!detectedResults.some(r => r.testName === ref.testName)) {
            detectedResults.push({
              id: `test_${detectedResults.length + 1}`,
              testName: ref.testName,
              value,
              unit: ref.defaultUnit,
              referenceRange: refRange,
              status,
              explanation,
              questionsToAsk: ref.questionsToAsk,
            });
          }
          break;
        }
      }
    }
  }

  const abnormalCount = detectedResults.filter(r => r.status !== 'normal').length;
  let overallSummary = '';

  if (detectedResults.length === 0) {
    overallSummary = 'Could not automatically identify standard blood test parameters. Please ensure the report contains clear test names (e.g. Hemoglobin, Glucose, Cholesterol) with numeric results.';
  } else if (abnormalCount === 0) {
    overallSummary = `Analyzed ${detectedResults.length} test markers. All identified values fall within standard laboratory reference ranges.`;
  } else {
    overallSummary = `Analyzed ${detectedResults.length} test markers. Detected ${abnormalCount} parameter(s) flagged outside typical reference ranges. Review these findings with your physician for clinical correlation.`;
  }

  const questionsForDoctor = detectedResults
    .filter(r => r.status !== 'normal')
    .map(r => `${r.testName}: ${r.questionsToAsk}`);

  if (questionsForDoctor.length === 0 && detectedResults.length > 0) {
    questionsForDoctor.push('Are there any lifestyle or preventive measures recommended based on these routine results?');
    questionsForDoctor.push('When should I schedule my next routine screening or follow-up test?');
  }

  const sources: TrustedSource[] = [
    {
      title: 'MedlinePlus Guide to Understanding Lab Tests',
      sourceOrg: 'NIH / MedlinePlus',
      url: 'https://medlineplus.gov/lab-tests/',
      category: 'diagnostics',
    },
    {
      title: 'CDC Laboratory Screening Guidelines',
      sourceOrg: 'CDC',
      url: 'https://www.cdc.gov/nchs/nhanes/about_nhanes.htm',
      category: 'diagnostics',
    },
  ];

  return {
    fileName: 'Uploaded Report',
    overallSummary,
    confidenceScore: detectedResults.length > 0 ? 0.92 : 0.3,
    results: detectedResults,
    questionsForDoctor,
    sources,
  };
}
