// Core type definitions for UNI-Agent

export type ID = string;
export type Role = "student" | "ta" | "admin";
export type Agent =
  | "planner"
  | "course"
  | "assignment"
  | "exam"
  | "notes"
  | "research"
  | "campus";

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
}

export interface Course {
  id: ID;
  code: string;
  title: string;
  description?: string;
  term?: string;
}

export interface Enrollment {
  id: ID;
  userId: ID;
  courseId: ID;
  role: Exclude<Role, "admin">;
}

export type MaterialType = "pdf" | "docx" | "pptx" | "url" | "text";

export interface Material {
  id: ID;
  courseId: ID;
  title: string;
  type: MaterialType;
  source: string;
  textPreview?: string;
}

export type AssignStatus =
  | "planned"
  | "in_progress"
  | "submitted"
  | "overdue";

export interface Assignment {
  id: ID;
  courseId: ID;
  title: string;
  description?: string;
  dueAt: string;
  status: AssignStatus;
  rubric?: string;
  subtasks?: { id: ID; text: string; done: boolean }[];
}

export type ExamType = "midterm" | "final" | "quiz";

export interface Exam {
  id: ID;
  courseId: ID;
  title: string;
  startAt: string;
  endAt: string;
  type: ExamType;
}

export type BlockStatus = "planned" | "done" | "missed";

export interface StudyBlock {
  id: ID;
  userId: ID;
  courseId?: ID;
  title: string;
  startAt: string;
  endAt: string;
  status: BlockStatus;
}

export interface Note {
  id: ID;
  userId: ID;
  courseId?: ID;
  title: string;
  body: string;
  updatedAt: string;
}

export interface Message {
  id: ID;
  userId: ID;
  agent: Agent;
  prompt: string;
  answer: string;
  citations: Citation[];
  createdAt: string;
}

export interface Citation {
  label: string;
  sourceType: "material" | "note" | "resource";
  sourceId?: ID;
  snippet?: string;
}

export interface Resource {
  id: ID;
  userId: ID;
  courseId?: ID;
  title: string;
  type: "pdf" | "docx" | "pptx" | "url" | "text";
  source: string;
  status: "processing" | "ready" | "error";
}

// Phase 6: Intelligence & Impact Types

export type XPEventKind =
  | "assignment_done"
  | "block_done"
  | "note_created"
  | "tutor_session"
  | "streak_bonus";

export interface XPEvent {
  id: ID;
  userId: ID;
  courseId: ID;
  kind: XPEventKind;
  xp: number;
  meta?: Record<string, any>;
  createdAt: string;
}

export type LearningEventSource = "materials" | "tutor" | "notes" | "planner";

export type LearningEventOutcome =
  | "completed"
  | "skipped"
  | "good_answer"
  | "bad_answer";

export interface LearningEvent {
  id: ID;
  userId: ID;
  courseId: ID;
  source: LearningEventSource;
  materialId?: ID;
  durationSecs: number;
  outcome?: LearningEventOutcome;
  payload?: Record<string, any>;
  createdAt: string;
}

export interface CourseAnalytics {
  id: ID;
  userId: ID;
  courseId: ID;
  date: string; // YYYY-MM-DD format
  minutesStudied: number;
  blocksDone: number;
  retentionPct: number;
  bestHour?: number; // 0-23
  createdAt: string;
}

export interface Prediction {
  id: ID;
  userId: ID;
  courseId: ID;
  scope: "exam" | "assignment";
  targetId: ID; // exam or assignment ID
  readiness: number; // 0-1
  rationale?: string;
  createdAt: string;
}

export interface AgentContext {
  id: ID;
  userId: ID;
  courseId: ID;
  key: string; // e.g., 'last_plan_summary', 'energy_curve'
  value: Record<string, any>;
  updatedAt: string;
}

export interface Flashcard {
  id: ID;
  courseId: ID;
  front: string;
  back: string;
  easeFactor: number; // Default: 2.5
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReview: string; // ISO date string
  lastReviewed?: string; // ISO date string
  difficulty: "easy" | "medium" | "hard";
}

export interface StoreSnapshot {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  materials: Material[];
  assignments: Assignment[];
  exams: Exam[];
  studyBlocks: StudyBlock[];
  notes: Note[];
  resources: Resource[];
  messages: Message[];
  flashcards: Flashcard[];
  settings: {
    darkMode: boolean;
    language?: "en" | "ar";
  };
  xpEvents: XPEvent[];
  learningEvents: LearningEvent[];
  courseAnalytics: CourseAnalytics[];
  predictions: Prediction[];
  agentContext: AgentContext[];
}

// AI Request/Response types
export interface AIRequest {
  prompt: string;
  courseId?: ID;
  mode?: string;
  userId?: string;
  context?: {
    materials?: Material[];
    notes?: Note[];
    snippets?: Array<{ 
      text: string; 
      sourceId?: ID; 
      sourceType: string;
      title?: string;
    }>;
  };
}

export interface AIResponse {
  agent: Agent;
  answer: string;
  citations: Citation[];
  workflow?: any; // Agent workflow visualization
  reasoning?: string; // Agent reasoning process
  agentCalls?: Array<{ from: string; to: string; purpose: string; result: string }>;
  toolsUsed?: Array<{ agent: string; tool: string; result: any }>;
}

