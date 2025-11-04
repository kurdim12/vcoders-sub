// Multi-Agent Orchestration Types

export type AgentTool = 
  | "search_materials"
  | "search_notes"
  | "calculate_study_time"
  | "check_calendar"
  | "create_task"
  | "update_schedule"
  | "generate_flashcards"
  | "find_resources"
  | "call_agent";

export interface AgentMemory {
  conversationId: string;
  agentId: string;
  messages: Array<{
    role: "user" | "assistant" | "system" | "tool";
    content: string;
    toolCalls?: ToolCall[];
    toolResults?: ToolResult[];
    timestamp: number;
  }>;
  context: Record<string, any>;
}

export interface ToolCall {
  id: string;
  tool: AgentTool;
  arguments: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  result: any;
  success: boolean;
  error?: string;
}

export interface AgentDecision {
  agent: string;
  confidence: number;
  reasoning: string;
  requiresCollaboration: boolean;
  collaboratorAgents?: string[];
  toolsNeeded?: AgentTool[];
}

export interface AgentWorkflow {
  id: string;
  steps: WorkflowStep[];
  status: "planning" | "executing" | "completed" | "error";
  startedAt: number;
  completedAt?: number;
}

export interface WorkflowStep {
  id: string;
  agent: string;
  action: string;
  input: any;
  output?: any;
  status: "pending" | "running" | "completed" | "error";
  startedAt?: number;
  completedAt?: number;
  toolCalls?: ToolCall[];
  reasoning?: string;
  nextSteps?: string[]; // IDs of next steps
}

export interface OrchestrationRequest {
  prompt: string;
  courseId?: string;
  context?: {
    materials?: any[];
    notes?: any[];
    assignments?: any[];
    exams?: any[];
  };
  userId: string;
}

export interface OrchestrationResponse {
  finalAnswer: string;
  agent: string;
  workflow: AgentWorkflow;
  citations: Array<{
    label: string;
    sourceType: string;
    sourceId: string;
    snippet: string;
  }>;
  reasoning: string;
  agentCalls: Array<{
    from: string;
    to: string;
    purpose: string;
    result: string;
  }>;
  toolsUsed: Array<{
    agent: string;
    tool: AgentTool;
    result: any;
  }>;
}

