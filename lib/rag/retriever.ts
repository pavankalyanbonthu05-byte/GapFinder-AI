import { DocumentChunk } from "../types";

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
}

/**
 * Clean text and generate n-gram / term frequency map
 */
function tokenize(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return freq;
}

/**
 * Fast BM25-inspired cosine keyword similarity
 */
export function retrieveRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 4,
  topicFilter?: string
): DocumentChunk[] {
  if (!chunks || chunks.length === 0) return [];

  const queryTerms = tokenize(query);
  const eligibleChunks = topicFilter
    ? chunks.filter((c) => c.topicId === topicFilter)
    : chunks;

  const results: SearchResult[] = eligibleChunks.map((chunk) => {
    const chunkTerms = tokenize(`${chunk.section} ${chunk.content} ${chunk.docTitle}`);
    let score = 0;

    queryTerms.forEach((qCount, term) => {
      if (chunkTerms.has(term)) {
        const cCount = chunkTerms.get(term)!;
        // Term frequency bonus + query weight
        score += Math.sqrt(qCount * cCount);
        // Boost if query matches section header
        if (chunk.section.toLowerCase().includes(term)) {
          score += 2.0;
        }
      }
    });

    return { chunk, score };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.chunk);
}
