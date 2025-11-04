// Client-side AI helper that gathers context and calls the API

import type { AIRequest, AIResponse, Material, Note } from "./types";
import { retrieveRelevantDocuments, extractSnippet } from "./retrieval";

export async function aiAsk(
  prompt: string,
  options: {
    courseId?: string;
    materials?: Material[];
    notes?: Note[];
    userId?: string;
  } = {}
): Promise<AIResponse> {
  const { courseId, materials = [], notes = [], userId } = options;

  // Prepare documents for retrieval
  const documents = [
    ...materials.map((m) => ({
      id: m.id,
      text: m.textPreview || m.title,
      metadata: { type: "material", courseId: m.courseId, title: m.title },
    })),
    ...notes.map((n) => ({
      id: n.id,
      text: n.body,
      metadata: { type: "note", courseId: n.courseId, title: n.title },
    })),
  ];

  // Retrieve relevant documents
  const relevantDocs = retrieveRelevantDocuments(prompt, documents, 3);

  // Prepare context snippets
  const snippets = relevantDocs.map((doc) => ({
    text: extractSnippet(doc.text, prompt, 200),
    sourceId: doc.id,
    sourceType: doc.metadata?.type || "material",
    title: doc.metadata?.title || doc.id,
  }));

  // Call API
  const request: AIRequest = {
    prompt,
    courseId,
    context: { snippets },
    userId,
  };

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }

  return response.json();
}

