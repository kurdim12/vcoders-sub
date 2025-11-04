// Multi-Agent Orchestration Engine

import type {
  OrchestrationRequest,
  OrchestrationResponse,
  AgentDecision,
  AgentWorkflow,
  WorkflowStep,
  ToolCall,
  ToolResult,
} from "./types";
import { executeTool } from "./tools";
import { getAgentMemory, saveAgentMemory } from "./memory";

// Only initialize OpenAI on server side
let openai: any = null;

function getOpenAI() {
  // Only run on server side
  if (typeof window !== 'undefined') {
    throw new Error("Orchestrator can only run on the server side. Use the /api/ai endpoint instead.");
  }
  
  if (!openai) {
    const OpenAI = require("openai").default;
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "sk-demo",
    });
  }
  
  return openai;
}

const AGENT_DEFINITIONS = {
  planner: {
    name: "Planner Agent",
    model: "gpt-4",
    systemPrompt: `You are the Planner Agent, an expert in cognitive load theory and time management optimization.

**Your Core Expertise:**
- Multi-factor scheduling optimization (deadlines, difficulty, energy levels, prerequisites)
- Cognitive load analysis (distributing complex vs simple tasks)
- Spaced repetition scheduling for long-term retention
- Conflict resolution and constraint satisfaction
- Study session effectiveness maximization

**Your Thinking Process:**
1. ANALYZE: Break down all deadlines, dependencies, and constraints
2. ASSESS: Evaluate task complexity and required mental effort
3. OPTIMIZE: Consider circadian rhythms, task switching costs, and cognitive resources
4. VALIDATE: Check for conflicts and ensure realistic time allocation
5. REFLECT: Consider if you need domain knowledge to estimate study time accurately

**When to Use Tools:**
- check_calendar: Always start here to understand current commitments
- calculate_study_time: Use when you need precise estimates (call Course Agent first if content complexity is unknown)
- update_schedule: After optimization, create concrete study blocks
- call_agent: 
  - Course Agent: "What's the complexity and scope of [topic]? Estimate study time needed."
  - Assignment Agent: "Break down this assignment into time-estimated steps."

**Response Style:**
- Be strategic and analytical
- Show your reasoning process clearly
- Explain WHY you're making scheduling decisions
- Suggest specific time blocks with rationale`,
    tools: ["check_calendar", "calculate_study_time", "update_schedule", "call_agent"],
  },
  course: {
    name: "Course Agent",
    model: "gpt-4",
    systemPrompt: `You are the Course Agent, a pedagogical expert specializing in adaptive learning and concept mastery.

**Your Core Expertise:**
- Scaffolded learning (building from fundamentals to advanced)
- Multiple representation formats (visual, verbal, mathematical)
- Misconception identification and correction
- Socratic questioning to guide discovery
- Contextualized explanations using student's materials

**Your Thinking Process:**
1. ASSESS: What does the student already know? Check their materials and notes.
2. GAP ANALYSIS: Identify knowledge gaps and prerequisite concepts
3. SCAFFOLD: Build from known to unknown, concrete to abstract
4. VALIDATE: Check for misconceptions and clarify immediately
5. EXTEND: Connect to broader concepts and real-world applications

**When to Use Tools:**
- search_materials: ALWAYS search first to ground explanations in course content
- search_notes: Check what the student has already learned
- call_agent:
  - Notes Agent: "Create study materials from this explanation: [your explanation]"
  - Exam Agent: "Generate practice questions testing understanding of [concept]"

**Response Style:**
- Start with "Let me search your materials first..." when appropriate
- Use analogies and examples relevant to the student's context
- Break complex ideas into digestible chunks
- Ask clarifying questions when needed
- Cite specific materials you're referencing`,
    tools: ["search_materials", "search_notes", "call_agent"],
  },
  assignment: {
    name: "Assignment Agent",
    model: "gpt-4", // Upgraded to GPT-4 for better analysis
    systemPrompt: `You are the Assignment Agent, an expert in task decomposition and academic project management.

**Your Core Expertise:**
- Work breakdown structure (WBS) for academic assignments
- Dependency mapping and critical path analysis
- Milestone planning with checkpoints
- Risk assessment (common pitfalls, time sinks)
- Progress tracking and adjustment strategies

**Your Thinking Process:**
1. DECOMPOSE: Break assignment into atomic, actionable tasks
2. ANALYZE: Identify dependencies, prerequisites, and complexity
3. ESTIMATE: Rough time estimates for each component
4. SEQUENCE: Optimal order considering dependencies and learning curve
5. VALIDATE: Check for missing steps or unrealistic assumptions

**When to Use Tools:**
- search_materials: Check assignment requirements and rubric
- create_task: Generate subtasks with clear deliverables
- call_agent:
  - Course Agent: "Help me understand the concepts needed for this assignment: [description]"
  - Planner Agent: "Schedule these tasks: [list of subtasks with time estimates]"

**Response Style:**
- Create actionable, specific subtasks
- Include checkpoints and validation criteria
- Warn about common pitfalls
- Suggest optimal sequencing
- Provide time estimates when possible`,
    tools: ["search_materials", "create_task", "call_agent"],
  },
  exam: {
    name: "Exam Agent",
    model: "gpt-4",
    systemPrompt: `You are the Exam Agent, a specialist in assessment design and test preparation strategies.

**Your Core Expertise:**
- Bloom's taxonomy question generation (remember, understand, apply, analyze, evaluate, create)
- Adaptive difficulty scaling
- Knowledge gap identification through diagnostic questioning
- Active recall optimization
- Metacognitive strategies for exam performance

**Your Thinking Process:**
1. ANALYZE: Understand exam scope and learning objectives
2. MAP: Create knowledge domain map of topics
3. ASSESS: Generate questions at varying difficulty levels
4. DIAGNOSE: Identify areas needing reinforcement
5. STRATEGIZE: Recommend study techniques specific to content type

**When to Use Tools:**
- search_materials: Extract key concepts and learning objectives
- generate_flashcards: Create active recall materials
- call_agent:
  - Course Agent: "Explain these concepts in detail for exam prep: [topics]"
  - Notes Agent: "Create summary notes for these exam topics: [list]"

**Response Style:**
- Generate questions at different cognitive levels
- Explain WHY certain topics are likely on the exam
- Provide study strategies tailored to content type
- Create practice scenarios that mirror exam format
- Include answer explanations for learning`,
    tools: ["search_materials", "generate_flashcards", "call_agent"],
  },
  notes: {
    name: "Notes Agent",
    model: "gpt-4", // Upgraded to GPT-4 for better summarization
    systemPrompt: `You are the Notes Agent, an expert in information architecture and knowledge synthesis.

**Your Core Expertise:**
- Hierarchical information organization
- Active recall formatting (questions, gaps, self-testing)
- Spaced repetition optimization
- Multi-modal note structures (outlines, mind maps, flashcards)
- Knowledge graph creation

**Your Thinking Process:**
1. EXTRACT: Identify key concepts, relationships, and examples
2. ORGANIZE: Structure information hierarchically (main ideas → details)
3. ENCODE: Format for optimal retrieval (active recall, visual cues)
4. CONNECT: Link to prior knowledge and cross-references
5. REFINE: Ensure clarity and completeness

**When to Use Tools:**
- search_materials: Find source content to summarize
- search_notes: Check existing notes to avoid duplication
- generate_flashcards: Create active recall materials
- call_agent:
  - Course Agent: "Explain [concept] in detail so I can create comprehensive notes"

**Response Style:**
- Use clear hierarchical structure
- Include examples and analogies
- Create active recall prompts
- Highlight connections between concepts
- Format for easy scanning and review`,
    tools: ["search_materials", "search_notes", "generate_flashcards"],
  },
  research: {
    name: "Research Agent",
    model: "gpt-4",
    systemPrompt: `You are the Research Agent, an expert in academic writing, information literacy, and scholarly communication.

**Your Core Expertise:**
- Source evaluation and credibility assessment
- Literature review synthesis
- Citation management and formatting (APA, MLA, Chicago)
- Thesis development and argument structuring
- Research gap identification

**Your Thinking Process:**
1. SCOPE: Understand research question and parameters
2. SEARCH: Identify relevant sources and databases
3. EVALUATE: Assess source credibility, relevance, and recency
4. SYNTHESIZE: Integrate multiple perspectives coherently
5. STRUCTURE: Organize arguments logically with evidence

**When to Use Tools:**
- search_materials: Find relevant course materials and sources
- find_resources: Locate additional academic resources
- call_agent:
  - Course Agent: "Help me understand the theoretical framework for this research: [topic]"

**Response Style:**
- Provide structured research outlines
- Evaluate source quality and relevance
- Suggest citation formats appropriately
- Identify research gaps and opportunities
- Organize information thematically`,
    tools: ["search_materials", "find_resources", "call_agent"],
  },
  campus: {
    name: "Campus Agent",
    model: "gpt-4", // Upgraded for better understanding
    systemPrompt: `You are the Campus Agent, an expert in campus navigation and resource discovery.

**Your Core Expertise:**
- Spatial navigation and building locations
- Resource availability tracking
- Service hour optimization
- Multi-modal transportation options
- Accessibility information

**Your Thinking Process:**
1. IDENTIFY: What resource or location is needed?
2. LOCATE: Find exact building, room, or service location
3. VERIFY: Check current hours and availability
4. OPTIMIZE: Suggest best times and routes
5. ALTERNATE: Provide backup options if primary unavailable

**When to Use Tools:**
- find_resources: Search for campus resources and locations

**Response Style:**
- Provide specific, actionable directions
- Include hours and contact information
- Suggest optimal visit times
- Mention alternative options
- Consider accessibility needs`,
    tools: ["find_resources"],
  },
};

export async function orchestrate(request: OrchestrationRequest): Promise<OrchestrationResponse> {
  const workflowId = `workflow_${Date.now()}`;
  const workflow: AgentWorkflow = {
    id: workflowId,
    steps: [],
    status: "planning",
    startedAt: Date.now(),
  };

  // Step 1: Route to initial agent using GPT-4 for intelligent routing
  const routingDecision = await makeRoutingDecision(request.prompt);
  
  workflow.steps.push({
    id: `step_routing_${Date.now()}`,
    agent: "orchestrator",
    action: "route",
    input: { prompt: request.prompt },
    output: routingDecision,
    status: "completed",
    startedAt: Date.now(),
    completedAt: Date.now(),
    reasoning: routingDecision.reasoning,
  });

  // Step 2: Execute main agent
  const mainStep = await executeAgentStep(
    routingDecision.agent,
    request.prompt,
    request,
    workflow
  );

  workflow.steps.push(mainStep);

  // Step 3: Handle collaboration if needed (from routing decision)
  if (routingDecision.requiresCollaboration && routingDecision.collaboratorAgents) {
    for (const collaborator of routingDecision.collaboratorAgents) {
      const collaboratorStep = await executeAgentStep(
        collaborator,
        `Help ${routingDecision.agent} with: ${request.prompt}`,
        request,
        workflow,
        mainStep.output
      );
      workflow.steps.push(collaboratorStep);
    }
  }

  // Step 4: Handle agent-to-agent calls from tool usage
  // Check if any step called another agent via call_agent tool
  const agentCallsFromTools = workflow.steps
    .filter(s => s.toolCalls?.some(tc => tc.tool === "call_agent"))
    .flatMap(s => 
      s.toolCalls!
        .filter(tc => tc.tool === "call_agent")
        .map(tc => ({
          from: s.agent,
          to: tc.arguments.agent,
          task: tc.arguments.task,
          stepId: s.id,
        }))
    );

  // Execute agent calls from tools (already handled in executeTool, but ensure they're tracked)
  // The call_agent tool now automatically adds steps to workflow

  // Step 4: Synthesize final answer
  const finalAnswer = await synthesizeAnswer(workflow, request.prompt);

  workflow.status = "completed";
  workflow.completedAt = Date.now();

  // Extract citations, agent calls, and tools used
  const citations = extractCitations(workflow);
  const agentCalls = extractAgentCalls(workflow);
  const toolsUsed = extractToolsUsed(workflow);

  return {
    finalAnswer,
    agent: routingDecision.agent,
    workflow,
      citations: citations.filter((c): c is { label: string; sourceType: string; sourceId: string; snippet: string } => !!c.sourceId),
    reasoning: workflow.steps.map(s => s.reasoning).join("\n\n"),
    agentCalls,
    toolsUsed,
  };
}

async function makeRoutingDecision(prompt: string): Promise<AgentDecision> {
  const ai = getOpenAI();
  const completion = await ai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an advanced intelligent router that deeply analyzes user requests to route them optimally.

**Available Agents:**
- planner: Scheduling, time management, study block optimization
- course: Concept explanations, academic questions, learning guidance
- assignment: Task breakdown, project planning, milestone creation
- exam: Test preparation, practice questions, study guides
- notes: Content summarization, flashcard generation, note organization
- research: Academic writing, source finding, citation help
- campus: Location information, resource finding, campus services

**Your Analysis Process:**
1. Identify primary intent and complexity
2. Determine if multiple agents are needed (multi-step tasks)
3. Assess confidence level (0.0-1.0)
4. Consider tool requirements
5. Plan collaboration strategy if needed

**Routing Guidelines:**
- Complex multi-step requests → requiresCollaboration = true
- Simple single-domain requests → requiresCollaboration = false
- High confidence (>0.8) → clear single agent match
- Medium confidence (0.5-0.8) → consider collaboration
- Low confidence (<0.5) → route to course agent (most general)

**Examples:**
- "Plan my week" → planner (high confidence)
- "Explain Big-O" → course (high confidence)
- "Help me prepare for exam and create schedule" → exam (primary) + planner (collaborator)
- "Break down assignment and schedule time" → assignment (primary) + planner (collaborator)

Respond with JSON:
{
  "agent": "primary agent name",
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation of why this routing decision",
  "requiresCollaboration": true/false,
  "collaboratorAgents": ["agent1", "agent2"] if needed,
  "toolsNeeded": ["tool1", "tool2"] if needed
}`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2, // Lower temperature for more consistent routing
  });

  const decision = JSON.parse(completion.choices[0].message.content || "{}");
  return decision as AgentDecision;
}

// Export executeAgentStep for use in tools (call_agent)
export async function executeAgentStep(
  agentId: string,
  prompt: string,
  request: OrchestrationRequest,
  workflow: AgentWorkflow,
  previousOutput?: any
): Promise<WorkflowStep> {
  const agentDef = AGENT_DEFINITIONS[agentId as keyof typeof AGENT_DEFINITIONS];
  if (!agentDef) {
    throw new Error(`Unknown agent: ${agentId}`);
  }

  const stepId = `step_${agentId}_${Date.now()}`;
  const step: WorkflowStep = {
    id: stepId,
    agent: agentId,
    action: "respond",
    input: { prompt, previousOutput },
    status: "running",
    startedAt: Date.now(),
    toolCalls: [],
  };

  // Get agent memory
  const memory = await getAgentMemory(request.userId, agentId);

  // Build context
  let contextText = "";
  if (request.context?.materials) {
    contextText += "\n\nCourse Materials:\n" + 
      request.context.materials.map((m, i) => `[${i + 1}] ${m.title}: ${m.textPreview || ""}`).join("\n");
  }
  if (request.context?.notes) {
    contextText += "\n\nNotes:\n" +
      request.context.notes.map((n, i) => `[${i + 1}] ${n.title}: ${n.body}`).join("\n");
  }
  if (previousOutput) {
    contextText += "\n\nPrevious agent output:\n" + JSON.stringify(previousOutput);
  }

  // Call agent with function calling and enhanced error handling
  const messages: any[] = [
    { role: "system", content: agentDef.systemPrompt },
    ...memory.messages.slice(-5), // Last 5 messages for context
    { role: "user", content: prompt + contextText },
  ];

  let completion;
  try {
    const ai = getOpenAI();
    completion = await ai.chat.completions.create({
      model: agentDef.model,
      messages,
      tools: getToolDefinitions(agentDef.tools),
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 2000, // Increased for more detailed responses
    });
  } catch (error: any) {
    step.status = "error";
    step.completedAt = Date.now();
    step.reasoning = `Error calling ${agentDef.model}: ${error.message}`;
    step.output = `I encountered an error while processing your request. Please try again or rephrase your question.`;
    return step;
  }

  const message = completion.choices[0].message;
  let responseText = message.content || "";
  const toolCallsToExecute: ToolCall[] = [];

  // Handle tool calls
  if (message.tool_calls) {
    for (const toolCall of message.tool_calls) {
      const toolCallObj: ToolCall = {
        id: toolCall.id,
        tool: toolCall.function.name as any,
        arguments: JSON.parse(toolCall.function.arguments),
      };
      toolCallsToExecute.push(toolCallObj);

      // Execute tool
      const toolResult = await executeTool(toolCallObj, request, workflow);
      
      // Add tool result to messages
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult.result),
      });
    }

    // Get final response after tool execution
    try {
      const ai = getOpenAI();
      const finalCompletion = await ai.chat.completions.create({
        model: agentDef.model,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      });
      responseText = finalCompletion.choices[0].message.content || responseText;
    } catch (error: any) {
      console.error(`Error getting final response from ${agentId}:`, error);
      responseText = responseText || `I processed your request but encountered an issue formatting the final response.`;
    }
  }

  step.output = responseText;
  step.toolCalls = toolCallsToExecute;
  step.status = "completed";
  step.completedAt = Date.now();

  // Enhanced reasoning extraction with self-reflection
  let reasoningText = "";
  
  // Ask agent to provide reasoning if not present
  if (!message.content || message.content.length < 50) {
    // Request explicit reasoning from agent
    try {
      const ai = getOpenAI();
      const reasoningCompletion = await ai.chat.completions.create({
        model: agentDef.model,
        messages: [
          { role: "system", content: agentDef.systemPrompt },
          { role: "user", content: `Reflect on your approach: ${prompt}\n\nExplain your reasoning process, what tools you used and why, and how you arrived at your response.` },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });
      reasoningText = reasoningCompletion.choices[0].message.content || "";
    } catch (error) {
      reasoningText = "";
    }
  } else {
    // Extract reasoning from response
    const contentLines = message.content.split("\n");
    
    // Look for reasoning indicators
    const reasoningPatterns = [
      /reasoning|thinking|analyzing|considering|evaluating|assessing/i,
      /because|since|therefore|thus|hence/i,
      /^first|^initially|^i'll|^let me/i,
      /strategy|approach|method|process/i,
    ];
    
    const reasoningLines = contentLines.filter((line: string) => 
      reasoningPatterns.some(pattern => pattern.test(line))
    );
    
    if (reasoningLines.length > 0) {
      reasoningText = reasoningLines.slice(0, 5).join(" ").substring(0, 400);
    } else {
      // Extract first few sentences as reasoning
      reasoningText = contentLines.slice(0, 3).join(" ").substring(0, 300);
    }
  }

  // Add tool usage details
  if (toolCallsToExecute.length > 0) {
    const toolDetails = toolCallsToExecute.map(tc => {
      if (tc.tool === "call_agent") {
        return `🤝 Delegated to ${tc.arguments.agent} agent: "${tc.arguments.task}"`;
      }
      const args = tc.arguments.query || tc.arguments.task || JSON.stringify(tc.arguments).substring(0, 40);
      return `🔧 Used ${tc.tool}: ${args}`;
    }).join("\n");
    reasoningText += `\n\n**Actions Taken:**\n${toolDetails}`;
  }

  // Add confidence/reflection
  if (toolCallsToExecute.length === 0 && message.content) {
    reasoningText += `\n\n**Analysis:** Processed request directly using domain knowledge.`;
  }

  step.reasoning = reasoningText.trim();

  // Save to memory
  await saveAgentMemory(request.userId, agentId, {
    role: "user",
    content: prompt,
    timestamp: Date.now(),
  });
  await saveAgentMemory(request.userId, agentId, {
    role: "assistant",
    content: responseText,
    toolCalls: toolCallsToExecute,
    timestamp: Date.now(),
  });

  return step;
}

async function synthesizeAnswer(
  workflow: AgentWorkflow,
  originalPrompt: string
): Promise<string> {
  const agentSteps = workflow.steps.filter(s => s.agent !== "orchestrator");
  
  // If only one step, enhance it slightly but return mostly as-is
  if (agentSteps.length === 1) {
    const step = agentSteps[0];
    if (step.output && step.output.length > 50) {
      return step.output;
    }
  }

  // Use GPT-4 to synthesize multiple agent outputs intelligently
  const ai = getOpenAI();
  const completion = await ai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert synthesizer that combines outputs from multiple specialized AI agents into a coherent, comprehensive answer.

**Your Process:**
1. Identify key contributions from each agent
2. Eliminate redundancy while preserving unique insights
3. Create logical flow connecting different agent contributions
4. Ensure the final answer directly addresses the original question
5. Maintain the expertise and nuance from each agent

**Guidelines:**
- Preserve specific details and recommendations from each agent
- Create smooth transitions between different aspects
- Highlight collaborative insights where agents built on each other
- Keep the tone helpful and actionable
- Cite which agent contributed what (when relevant)`,
      },
      {
        role: "user",
        content: `Original Question: "${originalPrompt}"

Agent Contributions:
${agentSteps.map((s, idx) => `
[${idx + 1}] ${s.agent.toUpperCase()} Agent:
${s.output || "No output"}
${s.reasoning ? `\nReasoning: ${s.reasoning.substring(0, 200)}` : ""}
`).join("\n---\n")}

Synthesize these contributions into a single, comprehensive answer that directly addresses the original question.`,
      },
    ],
    temperature: 0.6, // Slightly lower for more consistent synthesis
    max_tokens: 1000,
  });

  return completion.choices[0].message.content || "";
}

function getToolDefinitions(tools: string[]): any[] {
  const allTools: Record<string, any> = {
    search_materials: {
      type: "function",
      function: {
        name: "search_materials",
        description: "Search course materials for relevant information",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            limit: { type: "number", description: "Max results", default: 5 },
          },
        },
      },
    },
    call_agent: {
      type: "function",
      function: {
        name: "call_agent",
        description: "Call another agent for help with a specific task",
        parameters: {
          type: "object",
          properties: {
            agent: { type: "string", enum: ["planner", "course", "assignment", "exam", "notes", "research"] },
            task: { type: "string", description: "What you need help with" },
          },
        },
      },
    },
    calculate_study_time: {
      type: "function",
      function: {
        name: "calculate_study_time",
        description: "Calculate optimal study time for a task",
        parameters: {
          type: "object",
          properties: {
            task: { type: "string" },
            complexity: { type: "string", enum: ["low", "medium", "high"] },
          },
        },
      },
    },
    // Add more tools...
  };

  return tools.map(tool => allTools[tool]).filter(Boolean);
}

function extractCitations(workflow: AgentWorkflow) {
  // Extract citations from workflow steps that searched materials
  const citations: Array<{
    label: string;
    sourceType: string;
    sourceId?: string;
    snippet: string;
  }> = [];

  for (const step of workflow.steps) {
    if (step.toolCalls) {
      for (const toolCall of step.toolCalls) {
        if (toolCall.tool === "search_materials" || toolCall.tool === "search_notes") {
          // Try to extract search results from step output
          if (step.output) {
            try {
              const output = typeof step.output === "string" ? JSON.parse(step.output) : step.output;
              if (output.results && Array.isArray(output.results)) {
                output.results.forEach((result: any, idx: number) => {
                  citations.push({
                    label: `[${citations.length + 1}]`,
                    sourceType: toolCall.tool === "search_materials" ? "material" : "note",
                    sourceId: result.id,
                    snippet: result.snippet || result.title || "",
                  });
                });
              }
            } catch {
              // Not JSON, skip
            }
          }
        }
      }
    }
  }

  return citations;
}

function extractAgentCalls(workflow: AgentWorkflow) {
  return workflow.steps
    .filter(s => s.toolCalls?.some(tc => tc.tool === "call_agent"))
    .map(s => ({
      from: s.agent,
      to: s.toolCalls?.find(tc => tc.tool === "call_agent")?.arguments.agent || "",
      purpose: s.toolCalls?.find(tc => tc.tool === "call_agent")?.arguments.task || "",
      result: s.output || "",
    }));
}

function extractToolsUsed(workflow: AgentWorkflow) {
  const tools: Array<{ agent: string; tool: any; result: any }> = [];
  for (const step of workflow.steps) {
    if (step.toolCalls) {
      for (const toolCall of step.toolCalls) {
        tools.push({
          agent: step.agent,
          tool: toolCall.tool,
          result: "Executed",
        });
      }
    }
  }
  return tools;
}

