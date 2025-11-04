import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AIRequest, AIResponse, Agent } from "@/lib/types";
import { config, isOfflineMode, isCloudMode, isDemoMode } from "@/lib/config";
import { vectorSearch } from "@/lib/supabase";
import { orchestrate } from "@/lib/orchestrator/orchestrator";

const openai = new OpenAI({
  apiKey: config.ai.apiKey || "sk-demo",
});

// Simple agent classifier
function classifyIntent(prompt: string): Agent {
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes("plan") ||
    lowerPrompt.includes("schedule") ||
    lowerPrompt.includes("organize") ||
    lowerPrompt.includes("study block")
  ) {
    return "planner";
  }

  if (
    lowerPrompt.includes("assignment") ||
    lowerPrompt.includes("homework") ||
    lowerPrompt.includes("problem set")
  ) {
    return "assignment";
  }

  if (
    lowerPrompt.includes("exam") ||
    lowerPrompt.includes("test") ||
    lowerPrompt.includes("quiz") ||
    lowerPrompt.includes("mock")
  ) {
    return "exam";
  }

  if (
    lowerPrompt.includes("note") ||
    lowerPrompt.includes("summary") ||
    lowerPrompt.includes("flashcard")
  ) {
    return "notes";
  }

  if (
    lowerPrompt.includes("research") ||
    lowerPrompt.includes("paper") ||
    lowerPrompt.includes("literature")
  ) {
    return "research";
  }

  if (
    lowerPrompt.includes("campus") ||
    lowerPrompt.includes("location") ||
    lowerPrompt.includes("building")
  ) {
    return "campus";
  }

  // Default to course agent for educational questions
  return "course";
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    const { prompt, context, mode: requestMode, userId } = body;

    // Use orchestrator if OpenAI API key is available
    if (config.ai.apiKey && config.ai.apiKey !== "sk-demo" && !isOfflineMode()) {
      try {
        const orchestrationResult = await orchestrate({
          prompt,
          courseId: body.courseId,
          context: {
            materials: context?.snippets?.map(s => ({
              id: s.sourceId,
              title: s.title || "",
              textPreview: s.text,
            })) || [],
            notes: [],
            assignments: [],
            exams: [],
          },
          userId: userId || "demo-user",
        });

        return NextResponse.json({
          agent: orchestrationResult.agent,
          answer: orchestrationResult.finalAnswer,
          citations: orchestrationResult.citations,
          workflow: orchestrationResult.workflow,
          reasoning: orchestrationResult.reasoning,
          agentCalls: orchestrationResult.agentCalls,
          toolsUsed: orchestrationResult.toolsUsed,
        } as AIResponse & { workflow: any; reasoning: string; agentCalls: any[]; toolsUsed: any[] });
      } catch (orchestrationError) {
        console.error("Orchestration error, falling back to simple mode:", orchestrationError);
        // Fall through to simple mode
      }
    }

    // Classify the agent (fallback to simple mode)
    const agent = classifyIntent(prompt);

    // Handle different modes
    if (isOfflineMode()) {
      return handleOfflineMode(prompt, agent, context);
    }

    let contextText = "";
    let citations: AIResponse["citations"] = [];

    // Retrieval strategy based on mode
    if (isCloudMode()) {
      // Cloud mode: use vector search
      const retrievedDocs = await retrieveFromCloud(prompt);
      contextText = "\n\nRelevant information:\n" +
        retrievedDocs.map((doc: any, i: number) => `[${i + 1}] ${doc.content}`).join("\n");
      
      citations = retrievedDocs.map((doc: any, i: number) => ({
        label: `[${i + 1}]`,
        sourceType: doc.source_type as "material" | "note" | "resource",
        sourceId: doc.source_id,
        snippet: doc.content.substring(0, 200),
      }));
    } else {
      // Demo mode: use client-provided snippets
      if (context?.snippets && context.snippets.length > 0) {
        contextText = "\n\nRelevant information:\n" +
          context.snippets.map((s, i) => `[${i + 1}] ${s.text}`).join("\n");
      }
    }

    // Create system prompt with guardrails
    const systemPrompt = `You are UNI-Agent, an AI academic assistant helping students learn and organize their studies.

IMPORTANT GUIDELINES:
- Do NOT solve graded assignments or exam problems directly
- Instead, explain concepts, provide study approaches, and guide learning
- Use the Socratic method when appropriate
- Cite sources using [1], [2], etc. when using provided information
- Keep responses concise and actionable (2-3 paragraphs max)
- Focus on helping students understand, not just providing answers

You are acting as the ${agent.toUpperCase()} agent, specialized in ${agent}-related tasks.`;

    const userPrompt = prompt + contextText;

    // Call OpenAI (or mock if no key)
    let answer: string;

    if (config.features.useRealAI && config.ai.apiKey && config.ai.apiKey !== "sk-demo") {
      const completion = await openai.chat.completions.create({
        model: config.ai.chatModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      answer = completion.choices[0]?.message?.content || "No response generated.";
    } else {
      // Mock response for demo without API key
      answer = generateMockResponse(prompt, agent, context);
    }

    // Extract citations from context snippets (demo mode)
    if (isDemoMode() && context?.snippets) {
      citations = context.snippets
        .map((snippet, index) => {
          if (answer.includes(`[${index + 1}]`)) {
            return {
              label: `[${index + 1}]`,
              sourceType: snippet.sourceType as "material" | "note" | "resource",
              sourceId: snippet.sourceId,
              snippet: snippet.text,
            };
          }
          return null;
        })
        .filter((c): c is NonNullable<typeof c> => c !== null);
    }

    const response: AIResponse = {
      agent,
      answer,
      citations,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Offline mode handler - deterministic responses
function handleOfflineMode(
  prompt: string,
  agent: Agent,
  context?: AIRequest["context"]
): NextResponse<AIResponse> {
  const lowerPrompt = prompt.toLowerCase();
  
  let answer = "";
  const citations: AIResponse["citations"] = [];

  // Deterministic responses based on keywords
  if (lowerPrompt.includes("big-o") || lowerPrompt.includes("algorithm")) {
    answer = `[OFFLINE MODE] Great question about algorithm analysis! [1] Big-O notation describes time complexity upper bounds.

Study approach:
1. Identify basic operations in your code
2. Count iterations relative to input size n
3. Drop constants and lower-order terms

Practice with: linear search O(n), binary search O(log n), and nested loops O(n²).`;
  } else if (lowerPrompt.includes("integral") || lowerPrompt.includes("calculus")) {
    answer = `[OFFLINE MODE] Let's break down integration systematically! [1]

Key concepts:
- Single integrals: area under curve
- Double integrals: volume under surface
- Triple integrals: 3D region properties

Focus on setting up bounds correctly before integrating.`;
  } else if (lowerPrompt.includes("replan") || lowerPrompt.includes("schedule")) {
    answer = `[OFFLINE MODE] I'll help you optimize your study schedule.

Based on your deadlines:
- Prioritize assignments due within 48 hours
- Allocate 2-hour blocks for exam preparation
- Balance across all courses
- Include breaks to prevent burnout

Your schedule has been reorganized to focus on urgent items first.`;
  } else {
    answer = `[OFFLINE MODE] I'm here to help you learn! ${agent.toUpperCase()} agent responding.

Since we're in offline mode, I'm using cached knowledge to guide your studies. For best results:
1. Break down the problem
2. Review fundamentals
3. Practice similar examples

What specific aspect would you like to explore?`;
  }

  // Add mock citations
  if (context?.snippets && context.snippets.length > 0) {
    citations.push({
      label: "[1]",
      sourceType: "material",
      snippet: context.snippets[0].text.substring(0, 100),
    });
  }

  return NextResponse.json({ agent, answer, citations });
}

// Cloud mode retrieval using pgvector
async function retrieveFromCloud(prompt: string) {
  try {
    // Generate embedding for the prompt
    const embeddingResponse = await openai.embeddings.create({
      model: config.ai.embedModel,
      input: prompt,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Search Supabase vector database
    const results = await vectorSearch(embedding);
    return results;
  } catch (error) {
    console.error("Cloud retrieval error:", error);
    return [];
  }
}

function generateMockResponse(
  prompt: string,
  agent: Agent,
  context?: AIRequest["context"]
): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("big-o") || lowerPrompt.includes("algorithm")) {
    return `Great question about algorithm analysis! [1] Big-O notation describes the upper bound of time complexity. Instead of solving your assignment directly, let me guide you:

1. **Identify the basic operations**: What's the fundamental operation being repeated?
2. **Count the iterations**: How many times does this operation execute relative to input size n?
3. **Simplify**: Drop constants and lower-order terms.

For studying, try analyzing simple algorithms like linear search (O(n)) and binary search (O(log n)) first. Practice identifying loops and their relationship to input size.

Would you like me to explain a specific complexity class in more detail?`;
  }

  if (lowerPrompt.includes("triple integral") || lowerPrompt.includes("calculus")) {
    return `Let's approach triple integrals systematically! [1] The key concepts are:

**Understanding the basics:**
- Triple integrals extend double integrals to 3D regions
- They calculate volume, mass, or other 3D properties
- Order of integration matters based on region bounds

**Study approach:**
1. Start by visualizing the 3D region (sketch it!)
2. Determine integration bounds for each variable
3. Practice with rectangular regions first, then move to complex shapes
4. Use Fubini's theorem to choose the easiest order

For your problem set, focus on setting up bounds correctly before integrating. Would you like guidance on a specific type of region?`;
  }

  if (lowerPrompt.includes("wwi") || lowerPrompt.includes("world war")) {
    return `For your WWI essay, let's build a strong analytical framework! [1] The causes are interconnected:

**Study strategy:**
1. **MAIN framework**: Militarism, Alliances, Imperialism, Nationalism
2. **Immediate vs. long-term causes**: Distinguish between triggers and underlying tensions
3. **Multiple perspectives**: Consider how different nations viewed the conflict

**Essay approach:**
- Don't just list causes—explain how they interacted
- Use specific examples (alliance system, arms race, colonial conflicts)
- Develop a clear thesis about which factors were most significant

I recommend creating a timeline connecting events. What's your thesis angle so far?`;
  }

  // Generic response
  return `I'd be happy to help you learn about this topic! ${
    context?.snippets && context.snippets.length > 0 ? "[1]" : ""
  } 

Rather than providing direct answers, let me guide your learning:

1. **Break down the problem**: What are the key concepts involved?
2. **Review fundamentals**: Make sure you understand the underlying principles
3. **Practice similar examples**: Work through related problems to build intuition

The ${agent} agent is here to support your learning process. What specific aspect would you like to explore further?`;
}

