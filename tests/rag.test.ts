import { describe, it, expect } from 'vitest';
import { retrieveRelevantMedicalContext } from '../lib/rag/retriever';
import { cosineSimilarity, generateDenseVector } from '../lib/rag/embeddings';

describe('Medical Knowledge RAG & Semantic Retrieval Engine', () => {
  it('correctly maps colloquial "sugar problem" to Diabetes guidance from WHO', () => {
    const results = retrieveRelevantMedicalContext('I have a sugar problem and feel thirsty all the time', 3);
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(top.document.condition).toBe('Diabetes');
    expect(top.source.sourceOrg).toBe('WHO');
    expect(top.source.url).toContain('who.int');
  });

  it('retrieves Hypertension guidance for elevated blood pressure queries', () => {
    const results = retrieveRelevantMedicalContext('my bp is always high and I feel dizzy', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.document.condition === 'Hypertension')).toBe(true);
    expect(results.some(r => r.source.sourceOrg === 'CDC')).toBe(true);
  });

  it('retrieves Dengue guidelines when fever and platelets are mentioned', () => {
    const results = retrieveRelevantMedicalContext('mosquito fever with low platelet count and body ache', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.document.condition === 'Dengue Fever')).toBe(true);
  });

  it('returns empty array gracefully for empty input query', () => {
    const results = retrieveRelevantMedicalContext('', 3);
    expect(results).toEqual([]);
  });

  it('computes cosine similarity accurately between identical and orthogonal vectors', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const vecC = [0, 1, 0];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1.0);
    expect(cosineSimilarity(vecA, vecC)).toBeCloseTo(0.0);
  });

  it('generates normalized dense vectors with correct dimensionality', () => {
    const vec = generateDenseVector('diabetes symptoms and fasting blood sugar', 128);
    expect(vec.length).toBe(128);
    let norm = 0;
    for (const v of vec) norm += v * v;
    expect(Math.sqrt(norm)).toBeCloseTo(1.0, 3);
  });
});
