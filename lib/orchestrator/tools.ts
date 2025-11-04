// Agent Tools Implementation

import type { ToolCall, ToolResult, OrchestrationRequest, AgentWorkflow } from "./types";

export async function executeTool(
  toolCall: ToolCall,
  request: OrchestrationRequest,
  workflow: AgentWorkflow
): Promise<ToolResult> {
  try {
    let result: any;

    switch (toolCall.tool) {
      case "search_materials":
        result = await searchMaterials(toolCall.arguments.query, request.context?.materials || []);
        break;

      case "search_notes":
        result = await searchNotes(toolCall.arguments.query, request.context?.notes || []);
        break;

      case "call_agent":
        result = await callAgent(
          toolCall.arguments.agent,
          toolCall.arguments.task,
          request,
          workflow
        );
        break;

      case "calculate_study_time":
        result = await calculateStudyTime(
          toolCall.arguments.task,
          toolCall.arguments.complexity
        );
        break;

      case "check_calendar":
        result = await checkCalendar(request.context?.assignments || [], request.context?.exams || []);
        break;

      case "create_task":
        result = { success: true, message: "Task created (simulated)" };
        break;

      case "update_schedule":
        result = { success: true, message: "Schedule updated (simulated)" };
        break;

      case "generate_flashcards":
        result = await generateFlashcards(toolCall.arguments.content);
        break;

      case "find_resources":
        result = await findResources(toolCall.arguments.query, request.context?.materials || []);
        break;

      default:
        result = { error: `Unknown tool: ${toolCall.tool}` };
    }

    return {
      toolCallId: toolCall.id,
      result,
      success: true,
    };
  } catch (error: any) {
    return {
      toolCallId: toolCall.id,
      result: { error: error.message },
      success: false,
      error: error.message,
    };
  }
}

async function searchMaterials(query: string, materials: any[]) {
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 2);
  
  // Enhanced search with relevance scoring
  const scoredResults = materials.map(m => {
    let score = 0;
    const title = (m.title || "").toLowerCase();
    const preview = (m.textPreview || "").toLowerCase();
    
    // Exact title match
    if (title.includes(lowerQuery)) score += 10;
    
    // Title contains query terms
    queryTerms.forEach(term => {
      if (title.includes(term)) score += 5;
      if (preview.includes(term)) score += 2;
    });
    
    // Partial matches
    if (title.includes(lowerQuery.substring(0, Math.min(5, lowerQuery.length)))) score += 3;
    
    return { material: m, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)
  .map(item => ({
    id: item.material.id,
    title: item.material.title,
    snippet: item.material.textPreview?.substring(0, 200) || "",
    relevance: item.score,
  }));
  
  return { 
    results: scoredResults, 
    count: scoredResults.length,
    query: query,
    searchStrategy: "relevance-scored"
  };
}

async function searchNotes(query: string, notes: any[]) {
  const lowerQuery = query.toLowerCase();
  const results = notes
    .filter(n => 
      n.title?.toLowerCase().includes(lowerQuery) ||
      n.body?.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 5)
    .map(n => ({
      id: n.id,
      title: n.title,
      snippet: n.body?.substring(0, 200) || "",
    }));
  
  return { results, count: results.length };
}

async function callAgent(
  agent: string,
  task: string,
  request: OrchestrationRequest,
  workflow: AgentWorkflow
) {
  try {
    // Import here to avoid circular dependency
    const { executeAgentStep } = await import("./orchestrator");
    
    // Build enhanced context for the called agent
    const previousSteps = workflow.steps.filter(s => s.agent !== "orchestrator");
    const lastStep = previousSteps[previousSteps.length - 1];
    
    // Create enhanced task prompt with context
    const enhancedTask = previousSteps.length > 0
      ? `${task}\n\nContext from previous step: ${lastStep?.output?.substring(0, 300)}`
      : task;
    
    // Actually execute the agent step
    const agentStep = await executeAgentStep(
      agent,
      enhancedTask,
      request,
      workflow,
      lastStep?.output // Pass last step output as context
    );
    
    // The step is already added to workflow by executeAgentStep
    // But ensure it's tracked here too
    if (!workflow.steps.some(s => s.id === agentStep.id)) {
      workflow.steps.push(agentStep);
    }
    
    return {
      agent,
      response: agentStep.output,
      reasoning: agentStep.reasoning,
      status: agentStep.status,
      toolCalls: agentStep.toolCalls,
      collaboration: true, // Mark as inter-agent collaboration
    };
  } catch (error: any) {
    return {
      agent,
      response: `Unable to reach ${agent} agent: ${error.message}`,
      reasoning: `Failed to delegate to ${agent}: ${error.message}`,
      status: "error",
      error: error.message,
    };
  }
}

async function calculateStudyTime(task: string, complexity: string) {
  const timeMap: Record<string, { min: number; max: number; average: number }> = {
    low: { min: 15, max: 45, average: 30 },
    medium: { min: 45, max: 90, average: 60 },
    high: { min: 90, max: 180, average: 120 },
  };
  
  const base = timeMap[complexity] || timeMap.medium;
  
  // Adjust based on task characteristics
  let multiplier = 1.0;
  const lowerTask = task.toLowerCase();
  
  if (lowerTask.includes("reading") || lowerTask.includes("review")) {
    multiplier = 0.8; // Reading is faster
  } else if (lowerTask.includes("project") || lowerTask.includes("essay") || lowerTask.includes("assignment")) {
    multiplier = 1.5; // Projects take longer
  } else if (lowerTask.includes("exam") || lowerTask.includes("test preparation")) {
    multiplier = 2.0; // Exam prep is extensive
  }
  
  const estimatedMinutes = Math.round(base.average * multiplier);
  
  return {
    estimatedMinutes,
    range: `${Math.round(base.min * multiplier)}-${Math.round(base.max * multiplier)} minutes`,
    complexity,
    breakdown: {
      reading: Math.round(estimatedMinutes * 0.3),
      practice: Math.round(estimatedMinutes * 0.4),
      review: Math.round(estimatedMinutes * 0.3),
    },
    recommendation: `Allocate ${estimatedMinutes} minutes for ${complexity} complexity. Consider ${Math.round(estimatedMinutes * 0.3)} min reading, ${Math.round(estimatedMinutes * 0.4)} min practice, ${Math.round(estimatedMinutes * 0.3)} min review.`,
  };
}

async function checkCalendar(assignments: any[], exams: any[]) {
  const now = new Date();
  const upcoming = [
    ...assignments.filter(a => new Date(a.dueAt) > now),
    ...exams.filter(e => new Date(e.startAt) > now),
  ].sort((a, b) => {
    const dateA = new Date(a.dueAt || a.startAt);
    const dateB = new Date(b.dueAt || b.startAt);
    return dateA.getTime() - dateB.getTime();
  });

  return {
    upcoming: upcoming.slice(0, 5),
    count: upcoming.length,
  };
}

async function generateFlashcards(content: string) {
  // Enhanced flashcard generation with better structure
  const concepts = content.split(/\n+/).filter(line => line.trim().length > 10);
  
  const flashcards = concepts.slice(0, 10).map((concept, idx) => {
    // Try to extract key concept and definition
    const parts = concept.split(/[:—\-]/);
    const front = parts[0]?.trim() || `Concept ${idx + 1}`;
    const back = parts.slice(1).join(" ").trim() || concept.substring(0, 100);
    
    return {
      id: `flashcard_${Date.now()}_${idx}`,
      front: front.length > 50 ? front.substring(0, 50) + "..." : front,
      back: back.length > 200 ? back.substring(0, 200) + "..." : back,
      category: "general",
      difficulty: idx < 3 ? "easy" : idx < 7 ? "medium" : "hard",
    };
  });
  
  return {
    flashcards,
    count: flashcards.length,
    format: "Q&A",
    recommendation: "Review easy cards first, then progress to medium and hard. Use spaced repetition.",
  };
}

async function findResources(query: string, materials: any[]) {
  return searchMaterials(query, materials);
}

