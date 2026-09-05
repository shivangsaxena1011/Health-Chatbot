/**
 * Medical RAG Embedding & Vector Similarity Engine
 * Supports cosine similarity over n-dimensional vector spaces.
 */

// Cosine similarity between two float vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Simple hash-based deterministic dense embedding generator (128 dimensions)
// Used for local zero-dependency semantic vector representation
export function generateDenseVector(text: string, dimensions: number = 128): number[] {
  const vector = new Array(dimensions).fill(0);
  if (!text) return vector;

  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 2);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Hash word into vector dimensions
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }
    const index = Math.abs(hash) % dimensions;
    const weight = 1.0 + (word.length > 5 ? 0.5 : 0);
    vector[index] += weight;

    // Secondary semantic bigram projection
    if (i > 0) {
      const bigramHash = Math.abs((hash ^ (words[i - 1].charCodeAt(0) << 4))) % dimensions;
      vector[bigramHash] += 0.5;
    }
  }

  // L2 Normalize vector
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] = vector[i] / norm;
    }
  }

  return vector;
}
