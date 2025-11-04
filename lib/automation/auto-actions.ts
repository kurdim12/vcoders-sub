// Automated Agent Actions System

import { useStore } from "@/lib/store";
import { orchestrate } from "@/lib/orchestrator/orchestrator";
import type { OrchestrationRequest } from "../orchestrator/types";

export interface AutoAction {
  id: string;
  type: "suggestion" | "warning" | "opportunity" | "reminder";
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  action: {
    type: "navigate" | "create" | "update" | "analyze";
    target?: string;
    data?: any;
  };
  agent: string;
  confidence: number;
  timestamp: number;
}

export async function detectAutoActions(
  userId: string,
  courseId: string
): Promise<AutoAction[]> {
  const store = useStore.getState();
  const assignments = store.assignments.filter(a => a.courseId === courseId);
  const exams = store.exams.filter(e => e.courseId === courseId);
  const studyBlocks = store.studyBlocks.filter(b => b.courseId === courseId);
  const materials = store.materials.filter(m => m.courseId === courseId);
  const notes = store.notes.filter(n => n.courseId === courseId);

  const actions: AutoAction[] = [];
  const now = new Date();

  // 1. Urgent deadlines detection (Planner Agent)
  const urgentAssignments = assignments.filter(a => {
    const dueDate = new Date(a.dueAt);
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDue > 0 && hoursUntilDue <= 48 && a.status !== "submitted";
  });

  for (const assignment of urgentAssignments) {
    actions.push({
      id: `urgent_${assignment.id}`,
      type: "warning",
      priority: "urgent",
      title: `⚠️ Urgent: ${assignment.title} due soon`,
      description: `Due in ${Math.round((new Date(assignment.dueAt).getTime() - now.getTime()) / (1000 * 60 * 60))} hours. Should I create a study plan?`,
      action: {
        type: "analyze",
        target: "planner",
        data: { assignmentId: assignment.id },
      },
      agent: "planner",
      confidence: 0.95,
      timestamp: Date.now(),
    });
  }

  // 2. Missing study blocks for upcoming exams (Exam Agent)
  const upcomingExams = exams.filter(e => {
    const examDate = new Date(e.startAt);
    const daysUntilExam = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExam > 0 && daysUntilExam <= 7;
  });

  for (const exam of upcomingExams) {
    const hasStudyBlocks = studyBlocks.some(b => {
      const blockDate = new Date(b.startAt);
      const examDate = new Date(exam.startAt);
      return Math.abs(blockDate.getTime() - examDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
    });

    if (!hasStudyBlocks) {
      actions.push({
        id: `exam_prep_${exam.id}`,
        type: "opportunity",
        priority: "high",
        title: `📚 Exam preparation needed: ${exam.title}`,
        description: `Exam in ${Math.round((new Date(exam.startAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days. Want me to create a study schedule?`,
        action: {
          type: "analyze",
          target: "exam",
          data: { examId: exam.id },
        },
        agent: "exam",
        confidence: 0.9,
        timestamp: Date.now(),
      });
    }
  }

  // 3. Materials without notes (Notes Agent)
  const materialsWithoutNotes = materials.filter(m => {
    return !notes.some(n => n.courseId === courseId && n.title.toLowerCase().includes(m.title.toLowerCase().substring(0, 10)));
  });

  if (materialsWithoutNotes.length > 0) {
    actions.push({
      id: `materials_notes_${materialsWithoutNotes[0].id}`,
      type: "suggestion",
      priority: "medium",
      title: `📝 Create notes for ${materialsWithoutNotes.length} material(s)`,
      description: `You have ${materialsWithoutNotes.length} material(s) without notes. Should I generate summaries?`,
      action: {
        type: "create",
        target: "notes",
        data: { materialIds: materialsWithoutNotes.map(m => m.id) },
      },
      agent: "notes",
      confidence: 0.7,
      timestamp: Date.now(),
    });
  }

  // 4. Schedule conflicts (Planner Agent)
  const conflicts = detectConflicts(studyBlocks);
  if (conflicts.length > 0) {
    actions.push({
      id: `conflict_${Date.now()}`,
      type: "warning",
      priority: "high",
      title: `⚠️ ${conflicts.length} scheduling conflict(s) detected`,
      description: `You have overlapping study blocks. Should I rebalance your schedule?`,
      action: {
        type: "analyze",
        target: "planner",
        data: { conflicts },
      },
      agent: "planner",
      confidence: 0.95,
      timestamp: Date.now(),
    });
  }

  // 5. Low XP/stagnation detection
  const recentActivity = studyBlocks.filter(b => {
    const blockDate = new Date(b.startAt);
    const daysAgo = (now.getTime() - blockDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7 && b.status === "done";
  });

  if (recentActivity.length === 0) {
    actions.push({
      id: `motivation_${Date.now()}`,
      type: "reminder",
      priority: "low",
      title: `💪 Ready to start studying?`,
      description: `I can help you plan your week and create study blocks. Want to get started?`,
      action: {
        type: "navigate",
        target: "planner",
      },
      agent: "planner",
      confidence: 0.6,
      timestamp: Date.now(),
    });
  }

  return actions.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function detectConflicts(blocks: any[]): any[] {
  const conflicts: any[] = [];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const block1 = blocks[i];
      const block2 = blocks[j];
      const start1 = new Date(block1.startAt);
      const end1 = new Date(block1.endAt);
      const start2 = new Date(block2.startAt);
      const end2 = new Date(block2.endAt);

      if (
        (start1 < end2 && end1 > start2) ||
        (start2 < end1 && end2 > start1)
      ) {
        conflicts.push({ block1, block2 });
      }
    }
  }
  return conflicts;
}

export async function executeAutoAction(action: AutoAction, userId: string, courseId: string): Promise<any> {
  if (action.action.type === "analyze") {
    // Call API endpoint instead of importing orchestrator directly
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: action.type === "warning" 
            ? `I need help with: ${action.description}. Please analyze and provide actionable recommendations.`
            : `Could you help me with: ${action.description}?`,
          courseId,
          userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("API request failed");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to execute auto action:", error);
      return null;
    }
  }

  return null;
}

