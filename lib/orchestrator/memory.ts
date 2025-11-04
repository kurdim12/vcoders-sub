// Agent Memory Management

import type { AgentMemory } from "./types";
import { useStore } from "@/lib/store";

const MEMORY_STORE = new Map<string, AgentMemory>();

export async function getAgentMemory(userId: string, agentId: string): Promise<AgentMemory> {
  const key = `${userId}_${agentId}`;
  
  if (!MEMORY_STORE.has(key)) {
    MEMORY_STORE.set(key, {
      conversationId: `conv_${Date.now()}`,
      agentId,
      messages: [],
      context: {},
    });
  }

  return MEMORY_STORE.get(key)!;
}

export async function saveAgentMemory(
  userId: string,
  agentId: string,
  message: {
    role: "user" | "assistant" | "system" | "tool";
    content: string;
    toolCalls?: any[];
    toolResults?: any[];
    timestamp: number;
  }
) {
  const memory = await getAgentMemory(userId, agentId);
  memory.messages.push(message);
  
  // Keep only last 20 messages
  if (memory.messages.length > 20) {
    memory.messages = memory.messages.slice(-20);
  }
}

export function clearAgentMemory(userId: string, agentId: string) {
  const key = `${userId}_${agentId}`;
  MEMORY_STORE.delete(key);
}

