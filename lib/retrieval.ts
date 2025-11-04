// Simple TF-IDF based retrieval for client-side RAG

export interface Document {
  id: string;
  text: string;
  metadata?: Record<string, any>;
}

export interface ScoredDocument extends Document {
  score: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const total = tokens.length;

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  // Normalize by document length
  for (const [token, count] of Array.from(tf.entries())) {
    tf.set(token, count / total);
  }

  return tf;
}

function computeIDF(documents: Document[]): Map<string, number> {
  const docCount = documents.length;
  const docFreq = new Map<string, number>();

  // Count document frequency for each term
  for (const doc of documents) {
    const tokens = new Set(tokenize(doc.text));
    for (const token of Array.from(tokens)) {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
    }
  }

  // Compute IDF
  const idf = new Map<string, number>();
  for (const [token, freq] of Array.from(docFreq.entries())) {
    idf.set(token, Math.log(docCount / freq));
  }

  return idf;
}

function computeTFIDF(
  tf: Map<string, number>,
  idf: Map<string, number>
): Map<string, number> {
  const tfidf = new Map<string, number>();

  for (const [token, tfValue] of Array.from(tf.entries())) {
    const idfValue = idf.get(token) || 0;
    tfidf.set(token, tfValue * idfValue);
  }

  return tfidf;
}

function cosineSimilarity(
  vec1: Map<string, number>,
  vec2: Map<string, number>
): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  // Compute dot product and norms
  for (const [token, value] of Array.from(vec1.entries())) {
    norm1 += value * value;
    if (vec2.has(token)) {
      dotProduct += value * vec2.get(token)!;
    }
  }

  for (const value of Array.from(vec2.values())) {
    norm2 += value * value;
  }

  if (norm1 === 0 || norm2 === 0) return 0;

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export function retrieveRelevantDocuments(
  query: string,
  documents: Document[],
  topK: number = 3
): ScoredDocument[] {
  if (documents.length === 0) return [];

  // Compute IDF across all documents
  const idf = computeIDF(documents);

  // Compute TF-IDF for query
  const queryTokens = tokenize(query);
  const queryTF = computeTF(queryTokens);
  const queryVector = computeTFIDF(queryTF, idf);

  // Compute similarity for each document
  const scored: ScoredDocument[] = documents.map((doc) => {
    const docTokens = tokenize(doc.text);
    const docTF = computeTF(docTokens);
    const docVector = computeTFIDF(docTF, idf);

    const score = cosineSimilarity(queryVector, docVector);

    return { ...doc, score };
  });

  // Sort by score and return top K
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((doc) => doc.score > 0);
}

export function extractSnippet(
  text: string,
  query: string,
  maxLength: number = 200
): string {
  const queryTokens = tokenize(query);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  // Find sentences containing query terms
  let bestSentence = "";
  let maxMatches = 0;

  for (const sentence of sentences) {
    const sentenceTokens = new Set(tokenize(sentence));
    const matches = queryTokens.filter((token) => sentenceTokens.has(token))
      .length;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestSentence = sentence.trim();
    }
  }

  if (bestSentence.length === 0 && sentences.length > 0) {
    bestSentence = sentences[0].trim();
  }

  // Truncate if needed
  if (bestSentence.length > maxLength) {
    return bestSentence.substring(0, maxLength) + "...";
  }

  return bestSentence;
}

