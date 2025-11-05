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
    const streamEnabled = (body as any).stream !== false; // Enable streaming by default

    // DEMO MODE: Show orchestrator workflow even without API key
    // This showcases the multi-agent system architecture
    if (!streamEnabled) {
      try {
        // Classify intent to determine which agent to use
        const agent = classifyIntent(prompt);

        // Generate rich workflow visualization for demo
        const demoWorkflow = generateDemoWorkflow(prompt, agent, context);

        // If we have a real API key, use actual orchestrator
        if (config.ai.apiKey && config.ai.apiKey !== "sk-demo" && !isOfflineMode()) {
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
        }

        // Demo mode: Return mock response with workflow
        const mockAnswer = generateMockResponse(prompt, agent, context);
        return NextResponse.json({
          agent,
          answer: mockAnswer,
          citations: context?.snippets?.slice(0, 2).map((s, i) => ({
            label: `[${i + 1}]`,
            sourceType: "material" as const,
            sourceId: s.sourceId,
            snippet: s.text.substring(0, 150),
          })) || [],
          workflow: demoWorkflow,
          reasoning: demoWorkflow.steps[0]?.reasoning || "",
          agentCalls: demoWorkflow.agentCalls || [],
          toolsUsed: demoWorkflow.toolsUsed || [],
        } as AIResponse & { workflow: any; reasoning: string; agentCalls: any[]; toolsUsed: any[] });
      } catch (error) {
        console.error("Orchestration error:", error);
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
      // Use streaming if enabled
      if (streamEnabled) {
        const completion = await openai.chat.completions.create({
          model: config.ai.chatModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
          stream: true,
        });

        // Convert OpenAI stream to ReadableStream for Edge runtime
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of completion) {
                const text = chunk.choices[0]?.delta?.content || "";
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      } else {
        // Non-streaming mode
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
      }
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

// Mark as edge runtime for better streaming performance
export const runtime = "edge";

function generateMockResponse(
  prompt: string,
  agent: Agent,
  context?: AIRequest["context"]
): string {
  const lowerPrompt = prompt.toLowerCase();

  // Agent-specific responses
  if (agent === "notes" || lowerPrompt.includes("flashcard") || lowerPrompt.includes("summarize")) {
    return `I'll help you process your study materials! [1]

**${agent.toUpperCase()} AGENT ACTIVATED**

${context?.snippets && context.snippets.length > 0 ? "Analyzing your course materials..." : "Processing your request..."}

**OPTIONS:**
✓ Create flashcards from your notes
✓ Summarize lecture content
✓ Organize key concepts
✓ Extract important definitions

${context?.snippets && context.snippets.length > 0 ? `I found ${context.snippets.length} relevant materials. ` : ""}Would you like me to create flashcards or provide a summary?`;
  }

  if (agent === "research" || lowerPrompt.includes("research") || lowerPrompt.includes("paper") || lowerPrompt.includes("source")) {
    return `Let me help you find academic sources! [1]

**${agent.toUpperCase()} AGENT ACTIVATED**

**RESEARCH STRATEGY:**
1. Identify key academic databases (ACM, IEEE, Google Scholar)
2. Use specific search terms from your topic
3. Focus on peer-reviewed papers
4. Check citation counts for credibility

**SUGGESTED SOURCES:**
- Primary research papers
- Foundational textbooks [1]
- Recent survey papers
- Conference proceedings

${context?.snippets && context.snippets.length > 0 ? "Based on your course materials, I recommend starting with the references cited in your readings. [1]" : ""}

Need help with citations or organizing your bibliography?`;
  }

  if (agent === "campus" || lowerPrompt.includes("where") || lowerPrompt.includes("location") || lowerPrompt.includes("study group")) {
    return `I'll help you find campus resources! 📍

**${agent.toUpperCase()} AGENT ACTIVATED**

**AVAILABLE RESOURCES:**
- Study groups and tutoring centers
- Office hours (professors & TAs)
- Library study rooms
- Computer labs and facilities

**POPULAR LOCATIONS:**
- Engineering Building (labs, study spaces)
- Main Library (quiet study, group rooms)
- Student Union (casual meetups)
- Academic Resource Center (tutoring)

Need specific directions or want to know about study group schedules?`;
  }

  if (agent === "planner" || lowerPrompt.includes("schedule") || lowerPrompt.includes("plan") || lowerPrompt.includes("organize")) {
    return `Let me help optimize your study schedule! [1]

**${agent.toUpperCase()} AGENT ACTIVATED**

**SMART PLANNING:**
- Prioritize by due dates and exam schedules
- Allocate 2-hour focused study blocks
- Balance across all courses [1]
- Include breaks to prevent burnout

**RECOMMENDATIONS:**
✓ Start with urgent deadlines (< 48 hours)
✓ Schedule difficult subjects when you're most alert
✓ Use spaced repetition for long-term retention [1]
✓ Block time for review before exams

${context?.snippets && context.snippets.length > 0 ? "Based on your current workload, I can help create a balanced study plan. [1]" : ""}

Want a detailed day-by-day breakdown?`;
  }

  if (agent === "exam" || lowerPrompt.includes("exam") || lowerPrompt.includes("test") || lowerPrompt.includes("midterm") || lowerPrompt.includes("final")) {
    return `I'll help you prepare strategically for your exam! [1]

**${agent.toUpperCase()} AGENT ACTIVATED**

**EXAM PREP STRATEGY:**

**HIGH PRIORITY:**
- Review flashcards (spaced repetition) [1]
- Practice problems from assignments
- Understand key concepts, not just memorization

**MEDIUM PRIORITY:**
- Attend review sessions
- Form study groups
- Create summary sheets

**EXAM TIPS:**
✓ Focus on high-weight topics first [1]
✓ Practice under time pressure
✓ Review professor's example problems
✓ Get good sleep before exam day

${context?.snippets && context.snippets.length > 0 ? `Based on your course materials [1], I can identify the most important topics to review.` : ""}

Want a specific study timeline?`;
  }

  if (agent === "assignment" || lowerPrompt.includes("homework") || lowerPrompt.includes("assignment") || lowerPrompt.includes("problem set")) {
    return `I'll guide you through this assignment! [1]

**${agent.toUpperCase()} AGENT ACTIVATED**

Instead of solving directly, let me help you learn:

**APPROACH:**
1. **Understand the problem**: What's being asked?
2. **Identify concepts**: Which course topics apply? [1]
3. **Plan your solution**: Break into smaller steps
4. **Verify your work**: Does your answer make sense?

${context?.snippets && context.snippets.length > 0 ? "Your course materials cover the foundational concepts needed for this. [1]" : ""}

**LEARNING TIP:**
Focus on understanding the "why" behind each step, not just getting the answer. This builds problem-solving skills for exams!

What specific part would you like guidance on?`;
  }

  // Algorithm/Big-O specific
  if (lowerPrompt.includes("big-o") || lowerPrompt.includes("algorithm") || lowerPrompt.includes("complexity")) {
    return `Great question about algorithm analysis! [1] Big-O notation describes the upper bound of time complexity.

**${agent.toUpperCase()} AGENT**

**ANALYSIS APPROACH:**
1. **Identify basic operations**: What's repeated?
2. **Count iterations**: How many times relative to input size n?
3. **Simplify**: Drop constants and lower-order terms [1]

**COMMON PATTERNS:**
- Single loop: O(n)
- Nested loops: O(n²)
- Binary search/divide-conquer: O(log n)
- Efficient sorting: O(n log n) [1]

${context?.snippets && context.snippets.length > 0 ? "Your algorithm analysis materials explain this with detailed examples. [1]" : ""}

Practice identifying loops and their relationship to input size!`;
  }

  // Calculus/Math specific
  if (lowerPrompt.includes("integral") || lowerPrompt.includes("calculus") || lowerPrompt.includes("derivative")) {
    return `Let's approach this systematically! [1]

**${agent.toUpperCase()} AGENT**

**KEY CONCEPTS:**
- Single integrals: area under curve
- Double integrals: volume under surface
- Triple integrals: 3D region properties [1]

**PROBLEM-SOLVING STRATEGY:**
1. Visualize the region (sketch it!)
2. Determine integration bounds [1]
3. Choose appropriate coordinate system
4. Set up the integral carefully
5. Evaluate step by step

${context?.snippets && context.snippets.length > 0 ? "Your calculus materials provide detailed examples of similar problems. [1]" : ""}

Focus on setting up bounds correctly—that's where most mistakes happen!`;
  }

  // Generic response
  return `I'd be happy to help you learn! [1]

**${agent.toUpperCase()} AGENT ACTIVATED**

${context?.snippets && context.snippets.length > 0 ? "I've found relevant materials from your courses. [1]" : ""}

**LEARNING APPROACH:**
1. **Break down the problem**: What are the key concepts?
2. **Review fundamentals**: Build from basics [1]
3. **Practice examples**: Work through similar problems
4. **Test understanding**: Can you explain it to someone else?

The ${agent} agent is specialized in helping with ${agent}-related tasks. What specific aspect would you like to explore?`;
}

// Generate demo workflow for hackathon showcase
function generateDemoWorkflow(prompt: string, agent: Agent, context?: AIRequest["context"]) {
  const now = Date.now();
  const lowerPrompt = prompt.toLowerCase();

  // Complex workflow for notes agent (shows agent collaboration)
  if (agent === "notes" || lowerPrompt.includes("flashcard") || lowerPrompt.includes("summarize")) {
    return {
      status: "completed",
      startedAt: now - 3500,
      completedAt: now,
      steps: [
        {
          id: "step-1",
          agent: "notes",
          action: "Analyzing course materials",
          status: "completed",
          startedAt: now - 3500,
          completedAt: now - 2800,
          reasoning: "First, I need to search through your course materials to find relevant content for flashcard creation. I'll look for key concepts, definitions, and important relationships.",
          toolCalls: [
            {
              tool: "search_materials",
              arguments: { query: prompt, limit: 5 },
            }
          ]
        },
        {
          id: "step-2",
          agent: "notes",
          action: "Extracting key concepts",
          status: "completed",
          startedAt: now - 2800,
          completedAt: now - 1500,
          reasoning: "I've identified 12 key concepts from your materials. Now I'm structuring them into question-answer pairs using spaced repetition principles.",
          toolCalls: [
            {
              tool: "create_flashcards",
              arguments: { count: 12, difficulty: "mixed" },
            }
          ]
        },
        {
          id: "step-3",
          agent: "notes",
          action: "Calling Planner Agent for scheduling",
          status: "completed",
          startedAt: now - 1500,
          completedAt: now,
          reasoning: "Now that flashcards are created, I'm delegating to the Planner Agent to schedule optimal review sessions using spaced repetition intervals.",
          toolCalls: [
            {
              tool: "call_agent",
              arguments: { agent: "planner", task: "Schedule flashcard reviews with spaced repetition" },
            }
          ]
        }
      ],
      agentCalls: [
        { from: "notes", to: "planner", purpose: "Schedule spaced repetition reviews", result: "Review sessions scheduled for days 1, 3, 7, 14" }
      ],
      toolsUsed: [
        { agent: "notes", tool: "search_materials", result: "Found 5 relevant materials" },
        { agent: "notes", tool: "create_flashcards", result: "Created 12 flashcards" },
        { agent: "notes", tool: "call_agent", result: "Delegated to planner" }
      ]
    };
  }

  // Complex workflow for planner agent (shows multi-agent collaboration)
  if (agent === "planner" || lowerPrompt.includes("schedule") || lowerPrompt.includes("plan")) {
    return {
      status: "completed",
      startedAt: now - 5000,
      completedAt: now,
      steps: [
        {
          id: "step-1",
          agent: "planner",
          action: "Analyzing calendar and deadlines",
          status: "completed",
          startedAt: now - 5000,
          completedAt: now - 4000,
          reasoning: "Checking your current commitments, upcoming deadlines, and available time blocks. I need to understand the full picture before optimizing your schedule.",
          toolCalls: [
            {
              tool: "check_calendar",
              arguments: { days: 14 },
            }
          ]
        },
        {
          id: "step-2",
          agent: "planner",
          action: "Consulting Course Agent for complexity estimates",
          status: "completed",
          startedAt: now - 4000,
          completedAt: now - 2500,
          reasoning: "I need domain expertise to estimate study time accurately. Calling the Course Agent to assess content complexity and prerequisite knowledge.",
          toolCalls: [
            {
              tool: "call_agent",
              arguments: { agent: "course", query: "Estimate study time and complexity for upcoming topics" },
            }
          ]
        },
        {
          id: "step-3",
          agent: "planner",
          action: "Optimizing schedule with cognitive load balancing",
          status: "completed",
          startedAt: now - 2500,
          completedAt: now,
          reasoning: "Creating an optimized schedule that balances difficult and easy tasks, respects your circadian rhythm (you're a night owl!), and includes strategic breaks to prevent burnout.",
          toolCalls: [
            {
              tool: "calculate_study_time",
              arguments: { tasks: 8, complexity: "high" },
            },
            {
              tool: "update_schedule",
              arguments: { blocks: 6, priority: "deadline_first" },
            }
          ]
        }
      ],
      agentCalls: [
        { from: "planner", to: "course", purpose: "Get complexity estimates", result: "High complexity topics need 3-4 hours each" }
      ],
      toolsUsed: [
        { agent: "planner", tool: "check_calendar", result: "Found 14 available time slots" },
        { agent: "planner", tool: "call_agent", result: "Received complexity analysis" },
        { agent: "planner", tool: "calculate_study_time", result: "Estimated 18 hours total" },
        { agent: "planner", tool: "update_schedule", result: "Scheduled 6 optimized study blocks" }
      ]
    };
  }

  // Complex workflow for assignment agent (shows decomposition)
  if (agent === "assignment" || lowerPrompt.includes("assignment") || lowerPrompt.includes("homework")) {
    return {
      status: "completed",
      startedAt: now - 4200,
      completedAt: now,
      steps: [
        {
          id: "step-1",
          agent: "assignment",
          action: "Reading assignment requirements",
          status: "completed",
          startedAt: now - 4200,
          completedAt: now - 3200,
          reasoning: "First, I'm searching your materials for the assignment rubric and requirements to understand exactly what's expected.",
          toolCalls: [
            {
              tool: "search_materials",
              arguments: { query: "assignment requirements rubric", limit: 3 },
            }
          ]
        },
        {
          id: "step-2",
          agent: "assignment",
          action: "Consulting Course Agent for concept clarification",
          status: "completed",
          startedAt: now - 3200,
          completedAt: now - 1800,
          reasoning: "Some concepts in this assignment are advanced. I'm calling the Course Agent to ensure you have the foundational knowledge needed.",
          toolCalls: [
            {
              tool: "call_agent",
              arguments: { agent: "course", query: "Explain prerequisites for this assignment" },
            }
          ]
        },
        {
          id: "step-3",
          agent: "assignment",
          action: "Breaking down into actionable subtasks",
          status: "completed",
          startedAt: now - 1800,
          completedAt: now - 800,
          reasoning: "Creating a work breakdown structure with clear milestones, dependencies, and time estimates for each component.",
          toolCalls: [
            {
              tool: "create_task",
              arguments: { subtasks: 5, dependencies: true },
            }
          ]
        },
        {
          id: "step-4",
          agent: "assignment",
          action: "Delegating to Planner for scheduling",
          status: "completed",
          startedAt: now - 800,
          completedAt: now,
          reasoning: "Now that we have a clear task breakdown, I'm working with the Planner Agent to schedule these tasks optimally before your deadline.",
          toolCalls: [
            {
              tool: "call_agent",
              arguments: { agent: "planner", task: "Schedule 5 subtasks with 3-day deadline" },
            }
          ]
        }
      ],
      agentCalls: [
        { from: "assignment", to: "course", purpose: "Clarify prerequisite concepts", result: "Prerequisites explained, ready to proceed" },
        { from: "assignment", to: "planner", purpose: "Schedule subtasks", result: "Tasks scheduled across 3 days" }
      ],
      toolsUsed: [
        { agent: "assignment", tool: "search_materials", result: "Found rubric and requirements" },
        { agent: "assignment", tool: "call_agent", result: "Got concept clarification" },
        { agent: "assignment", tool: "create_task", result: "Created 5 subtasks" },
        { agent: "assignment", tool: "call_agent", result: "Tasks scheduled" }
      ]
    };
  }

  // Default workflow (still shows sophistication)
  return {
    status: "completed",
    startedAt: now - 2500,
    completedAt: now,
    steps: [
      {
        id: "step-1",
        agent,
        action: "Searching course materials",
        status: "completed",
        startedAt: now - 2500,
        completedAt: now - 1500,
        reasoning: `As the ${agent} agent, I'm first searching your course materials to ground my response in your specific curriculum and context.`,
        toolCalls: [
          {
            tool: "search_materials",
            arguments: { query: prompt.substring(0, 50), limit: 3 },
          }
        ]
      },
      {
        id: "step-2",
        agent,
        action: "Generating response",
        status: "completed",
        startedAt: now - 1500,
        completedAt: now,
        reasoning: "Based on the materials found, I'm crafting a pedagogically sound response that builds on your existing knowledge and guides you toward understanding.",
        toolCalls: []
      }
    ],
    agentCalls: [],
    toolsUsed: [
      { agent, tool: "search_materials", result: `Found ${context?.snippets?.length || 0} relevant materials` }
    ]
  };
}

