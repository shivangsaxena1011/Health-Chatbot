import { TRUSTED_MEDICAL_KNOWLEDGE_BASE, MedicalDocument } from './medical-corpus';
import { generateDenseVector, cosineSimilarity } from './embeddings';
import { TrustedSource } from '../types/health';

export interface RetrievedDocument {
  document: MedicalDocument;
  score: number;
  source: TrustedSource;
}

// Pre-compute dense vectors for corpus documents
interface IndexedDocument {
  doc: MedicalDocument;
  vector: number[];
  fullText: string;
}

let corpusIndex: IndexedDocument[] | null = null;

function getCorpusIndex(): IndexedDocument[] {
  if (corpusIndex) return corpusIndex;

  corpusIndex = TRUSTED_MEDICAL_KNOWLEDGE_BASE.map(doc => {
    const fullText = `${doc.title} ${doc.condition} ${doc.category} ${doc.keywords.join(' ')} ${doc.content}`;
    const vector = generateDenseVector(fullText);
    return {
      doc,
      vector,
      fullText: fullText.toLowerCase(),
    };
  });

  return corpusIndex;
}

// Semantic synonym map to bridge common colloquial terms and Hinglish to clinical concepts
const CONCEPT_MAPPINGS: Record<string, string[]> = {
  diabetes: ['sugar', 'glucose', 'urination', 'thirst', 'insulin', 'hyperglycemia', 'sugar problem', 'sugar high', 'meetha'],
  hypertension: ['bp', 'blood pressure', 'high bp', 'hypertension', 'systolic', 'diastolic', 'bp high', 'bp badha'],
  heart_attack: ['chest pain', 'chest heaviness', 'chest tightness', 'heart attack', 'angina', 'left arm pain', 'chhati me dard', 'seene me dard'],
  asthma: ['asthma', 'wheezing', 'inhaler', 'shortness of breath', 'saans fulna', 'dama', 'chest tightness'],
  respiratory_infections: ['cold', 'flu', 'cough', 'fever', 'sore throat', 'runny nose', 'chills', 'sardi', 'jukham', 'bukhar'],
  dengue: ['dengue', 'mosquito fever', 'platelet', 'retro-orbital', 'bone breaking fever', 'dengu'],
  thyroid: ['thyroid', 'tsh', 't3', 't4', 'hypothyroidism', 'hyperthyroidism', 'goiter'],
  gerd: ['acid reflux', 'gerd', 'heartburn', 'acidity', 'gas', 'sour burps', 'pet me jalan'],
  anemia: ['anemia', 'hemoglobin', 'hb', 'iron', 'pale skin', 'fatigue', 'kamzori', 'weakness'],
  dehydration: ['dehydration', 'water', 'dark urine', 'dry mouth', 'heat exhaustion', 'ors', 'paani ki kami'],
};

export function retrieveRelevantMedicalContext(query: string, topK: number = 3): RetrievedDocument[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();
  const queryVector = generateDenseVector(normalizedQuery);
  const index = getCorpusIndex();

  const scoredDocs: RetrievedDocument[] = index.map(item => {
    // 1. Vector cosine similarity
    const vecScore = cosineSimilarity(queryVector, item.vector);

    // 2. Keyword & semantic concept boost
    let conceptBoost = 0;
    for (const kw of item.doc.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        conceptBoost += 0.3;
      }
    }

    // 3. Synonym dictionary matching
    for (const [concept, triggers] of Object.entries(CONCEPT_MAPPINGS)) {
      if (triggers.some(t => normalizedQuery.includes(t))) {
        if (item.doc.condition.toLowerCase().includes(concept.replace('_', ' ')) ||
            item.doc.keywords.some(k => triggers.includes(k.toLowerCase()))) {
          conceptBoost += 0.4;
        }
      }
    }

    const finalScore = vecScore + Math.min(conceptBoost, 0.7);

    return {
      document: item.doc,
      score: finalScore,
      source: {
        title: item.doc.title,
        sourceOrg: item.doc.sourceOrg,
        url: item.doc.sourceUrl,
        category: item.doc.category,
        condition: item.doc.condition,
      },
    };
  });

  // Sort descending by score
  scoredDocs.sort((a, b) => b.score - a.score);

  // Filter for meaningful relevance threshold
  return scoredDocs.slice(0, topK);
}
