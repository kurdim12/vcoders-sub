# Multi-Agent Orchestration System

## Overview

UNI-Agent now features a **real multi-agent orchestration system** powered by OpenAI GPT-4. This is not a simple chatbot—it's a sophisticated system where multiple specialized AI agents collaborate to solve complex tasks.

## Features

### 🤖 Multi-Agent Collaboration
- **7 Specialized Agents**: Planner, Course, Assignment, Exam, Notes, Research, Campus
- **Agent-to-Agent Communication**: Agents can call each other for help
- **Intelligent Routing**: GPT-4 analyzes requests and routes to the best agent(s)
- **Workflow Orchestration**: Complex tasks automatically trigger multiple agents

### 🛠️ Agent Tools
Agents can use tools to interact with your data:
- `search_materials` - Search course materials
- `search_notes` - Search your notes
- `call_agent` - Delegate to another agent
- `calculate_study_time` - Estimate study time
- `check_calendar` - View upcoming deadlines
- `create_task` - Create tasks/assignments
- `update_schedule` - Modify study schedule
- `generate_flashcards` - Create study materials
- `find_resources` - Locate resources

### 🧠 Agent Memory
- Each agent maintains conversation history
- Context persists across interactions
- Agents learn from previous conversations

### 🎯 Model Selection
- **GPT-4**: Used for complex tasks (planning, explanations, research)
- **GPT-3.5 Turbo**: Used for simpler tasks (summarization, basic queries)
- Automatic model selection based on task complexity

### 📊 Workflow Visualization
See exactly how agents collaborate:
- Real-time step-by-step execution
- Agent reasoning process
- Tool usage tracking
- Agent collaboration map

## How It Works

1. **User asks a question** → Tutor tab or anywhere in the app
2. **Orchestrator analyzes** → GPT-4 determines which agent(s) should handle it
3. **Agent executes** → Uses tools, calls other agents if needed
4. **Synthesis** → Multiple agent outputs are combined into a coherent answer
5. **Visualization** → You see the entire workflow

## Example: Complex Request

**User**: "I need to prepare for my CS101 exam next week. Help me plan my study schedule and create flashcards."

**Workflow**:
1. **Orchestrator** → Routes to Planner Agent (primary) + Exam Agent (collaborator)
2. **Planner Agent** → 
   - Calls `check_calendar` to see deadlines
   - Calls Course Agent to understand CS101 topics
   - Calls `calculate_study_time` for each topic
   - Calls `update_schedule` to create study blocks
3. **Exam Agent** →
   - Calls `search_materials` for CS101 content
   - Calls `generate_flashcards` for key concepts
4. **Synthesis** → Final answer combines schedule + flashcards

## Setup

1. **Add OpenAI API Key**:
   ```bash
   # In .env.local
   OPENAI_API_KEY=sk-your-key-here
   ```

2. **The system automatically**:
   - Detects if API key is available
   - Uses orchestrator if key exists
   - Falls back to simple mode if no key

## UI Components

- **Workflow Visualization**: Shows agent steps in real-time
- **Agent Collaboration**: Visual map of agent-to-agent calls
- **Tools Used**: List of all tools executed
- **Reasoning**: Agent thinking process

## Technical Architecture

```
User Request
    ↓
Orchestrator (GPT-4 Routing)
    ↓
Primary Agent (GPT-4 or GPT-3.5)
    ├─→ Tool Calls
    ├─→ Agent Calls
    └─→ Context Building
    ↓
Collaborator Agents (if needed)
    ↓
Synthesis (GPT-4)
    ↓
Final Answer + Workflow Visualization
```

## Files

- `lib/orchestrator/orchestrator.ts` - Main orchestration engine
- `lib/orchestrator/types.ts` - Type definitions
- `lib/orchestrator/tools.ts` - Tool implementations
- `lib/orchestrator/memory.ts` - Agent memory management
- `components/workflow-visualization.tsx` - UI component
- `app/api/ai/route.ts` - API endpoint (uses orchestrator)

## Next Steps

1. Provide OpenAI API key in `.env.local`
2. Test with complex questions
3. Watch agents collaborate in real-time
4. See workflow visualization in Tutor tab

This is a **real multi-agent system** that showcases advanced AI orchestration for the hackathon!

