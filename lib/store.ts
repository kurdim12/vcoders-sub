import { create } from "zustand";
import type {
  StoreSnapshot,
  User,
  Course,
  Enrollment,
  Material,
  Assignment,
  Exam,
  StudyBlock,
  Note,
  Resource,
  Message,
  Flashcard,
  XPEvent,
  LearningEvent,
  CourseAnalytics,
  Prediction,
  AgentContext,
  ID,
} from "./types";
import { loadSnapshot, saveSnapshot, clearStorage } from "./storage";
import { generateSeedData } from "./seed";
import { getCurrentAccountId, getAccount } from "./accounts";

interface StoreState extends StoreSnapshot {
  // Initialization
  initialized: boolean;
  initialize: (accountId?: string) => Promise<void>;
  switchAccount: (accountId: string) => Promise<void>;

  // Users
  setCurrentUser: (user: User) => void;
  getCurrentUser: () => User | undefined;

  // Courses
  addCourse: (course: Course) => void;
  updateCourse: (id: ID, updates: Partial<Course>) => void;
  deleteCourse: (id: ID) => void;

  // Enrollments
  addEnrollment: (enrollment: Enrollment) => void;

  // Materials
  addMaterial: (material: Material) => void;
  updateMaterial: (id: ID, updates: Partial<Material>) => void;
  getMaterialsByCourse: (courseId: ID) => Material[];

  // Assignments
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: ID, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: ID) => void;
  getAssignmentsByCourse: (courseId: ID) => Assignment[];

  // Exams
  addExam: (exam: Exam) => void;
  updateExam: (id: ID, updates: Partial<Exam>) => void;
  getExamsByCourse: (courseId: ID) => Exam[];

  // Study Blocks
  addStudyBlock: (block: StudyBlock) => void;
  updateStudyBlock: (id: ID, updates: Partial<StudyBlock>) => void;
  deleteStudyBlock: (id: ID) => void;

  // Notes
  addNote: (note: Note) => void;
  updateNote: (id: ID, updates: Partial<Note>) => void;
  deleteNote: (id: ID) => void;
  getNotesByCourse: (courseId?: ID) => Note[];

  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Flashcard) => void;
  updateFlashcard: (id: ID, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: ID) => void;
  getFlashcardsByCourse: (courseId: ID) => Flashcard[];

  // Resources
  addResource: (resource: Resource) => void;
  updateResource: (id: ID, updates: Partial<Resource>) => void;
  deleteResource: (id: ID) => void;

  // Messages
  addMessage: (message: Message) => void;

  // Settings
  toggleDarkMode: () => void;
  setLanguage: (lang: "en" | "ar") => void;

  // Phase 6: XP Events
  addXPEvent: (event: XPEvent) => void;
  getXPEventsByCourse: (courseId: ID) => XPEvent[];

  // Phase 6: Learning Events
  addLearningEvent: (event: LearningEvent) => void;
  getLearningEventsByCourse: (courseId: ID) => LearningEvent[];

  // Phase 6: Analytics
  addCourseAnalytics: (analytics: CourseAnalytics) => void;
  getCourseAnalytics: (courseId: ID) => CourseAnalytics[];

  // Phase 6: Predictions
  addPrediction: (prediction: Prediction) => void;
  getPredictionsByCourse: (courseId: ID) => Prediction[];

  // Phase 6: Agent Context
  setAgentContext: (context: AgentContext) => void;
  getAgentContext: (courseId: ID, key: string) => AgentContext | undefined;

  // Import/Export
  exportData: () => void;
  importData: (snapshot: StoreSnapshot) => void;
  resetData: () => Promise<void>;
  resetDataForAccount: (accountId: string) => Promise<void>;

  // Persistence
  persist: () => void;
}

let persistTimeout: NodeJS.Timeout | null = null;

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  users: [],
  courses: [],
  enrollments: [],
  materials: [],
  assignments: [],
  exams: [],
  studyBlocks: [],
  notes: [],
  resources: [],
  messages: [],
  flashcards: [],
  settings: { darkMode: false, language: "en" },
  xpEvents: [],
  learningEvents: [],
  courseAnalytics: [],
  predictions: [],
  agentContext: [],
  initialized: false,

  // Initialize from localStorage or seed data (account-scoped)
  initialize: async (accountId?: string) => {
    const currentAccountId = accountId || getCurrentAccountId();
    const snapshot = loadSnapshot(currentAccountId);
    if (snapshot) {
      set({ ...snapshot, initialized: true });
    } else {
      // Generate seed data for this account
      const account = getAccount(currentAccountId);
      try {
        const seedData = await generateSeedData(account?.id || currentAccountId);
        set({ ...seedData, initialized: true });
        saveSnapshot(seedData, currentAccountId);
      } catch (error) {
        console.error("Failed to initialize with comprehensive data:", error);
        // Fallback to sync version
        const { generateSeedDataSync } = await import("./seed");
        const seedData = generateSeedDataSync(account?.id || currentAccountId);
        set({ ...seedData, initialized: true });
        saveSnapshot(seedData, currentAccountId);
      }
    }
  },
  
  // Switch account (saves current, loads new)
  switchAccount: async (newAccountId: string) => {
    const currentAccountId = getCurrentAccountId();
    
    // Save current account's data
    const currentState = get();
    const currentSnapshot: StoreSnapshot = {
      users: currentState.users,
      courses: currentState.courses,
      enrollments: currentState.enrollments,
      materials: currentState.materials,
      assignments: currentState.assignments,
      exams: currentState.exams,
      studyBlocks: currentState.studyBlocks,
      notes: currentState.notes,
      resources: currentState.resources,
      messages: currentState.messages,
      flashcards: currentState.flashcards || [],
      settings: currentState.settings,
      xpEvents: currentState.xpEvents || [],
      learningEvents: currentState.learningEvents || [],
      courseAnalytics: currentState.courseAnalytics || [],
      predictions: currentState.predictions || [],
      agentContext: currentState.agentContext || [],
    };
    saveSnapshot(currentSnapshot, currentAccountId);
    
    // Load new account's data
    await get().initialize(newAccountId);
  },

  // Persistence helper (account-scoped)
  persist: () => {
    if (persistTimeout) clearTimeout(persistTimeout);
    persistTimeout = setTimeout(() => {
      const state = get();
      const snapshot: StoreSnapshot = {
        users: state.users,
        courses: state.courses,
        enrollments: state.enrollments,
        materials: state.materials,
        assignments: state.assignments,
        exams: state.exams,
        studyBlocks: state.studyBlocks,
        notes: state.notes,
        resources: state.resources,
        messages: state.messages,
        flashcards: state.flashcards || [],
        settings: state.settings,
        xpEvents: state.xpEvents || [],
        learningEvents: state.learningEvents || [],
        courseAnalytics: state.courseAnalytics || [],
        predictions: state.predictions || [],
        agentContext: state.agentContext || [],
      };
      saveSnapshot(snapshot);
    }, 500);
  },

  // Users
  setCurrentUser: (user) => {
    const currentUsers = get().users;
    const existingIndex = currentUsers.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      const updated = [...currentUsers];
      updated[existingIndex] = user;
      set({ users: updated });
    } else {
      set({ users: [user, ...currentUsers] });
    }
    get().persist();
  },

  getCurrentUser: () => get().users[0],

  // Courses
  addCourse: (course) => {
    set((state) => ({ courses: [...state.courses, course] }));
    get().persist();
  },

  updateCourse: (id, updates) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    get().persist();
  },

  deleteCourse: (id) => {
    set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }));
    get().persist();
  },

  // Enrollments
  addEnrollment: (enrollment) => {
    set((state) => ({ enrollments: [...state.enrollments, enrollment] }));
    get().persist();
  },

  // Materials
  addMaterial: (material) => {
    set((state) => ({ materials: [...state.materials, material] }));
    get().persist();
  },

  updateMaterial: (id, updates) => {
    set((state) => ({
      materials: state.materials.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
    get().persist();
  },

  getMaterialsByCourse: (courseId) => {
    return get().materials.filter((m) => m.courseId === courseId);
  },

  // Assignments
  addAssignment: (assignment) => {
    set((state) => ({ assignments: [...state.assignments, assignment] }));
    get().persist();
  },

  updateAssignment: (id, updates) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
    get().persist();
  },

  deleteAssignment: (id) => {
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    }));
    get().persist();
  },

  getAssignmentsByCourse: (courseId) => {
    return get().assignments.filter((a) => a.courseId === courseId);
  },

  // Exams
  addExam: (exam) => {
    set((state) => ({ exams: [...state.exams, exam] }));
    get().persist();
  },

  updateExam: (id, updates) => {
    set((state) => ({
      exams: state.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    get().persist();
  },

  getExamsByCourse: (courseId) => {
    return get().exams.filter((e) => e.courseId === courseId);
  },

  // Study Blocks
  addStudyBlock: (block) => {
    set((state) => ({ studyBlocks: [...state.studyBlocks, block] }));
    get().persist();
  },

  updateStudyBlock: (id, updates) => {
    set((state) => ({
      studyBlocks: state.studyBlocks.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }));
    get().persist();
  },

  deleteStudyBlock: (id) => {
    set((state) => ({
      studyBlocks: state.studyBlocks.filter((b) => b.id !== id),
    }));
    get().persist();
  },

  // Notes
  addNote: (note) => {
    set((state) => ({ notes: [...state.notes, note] }));
    get().persist();
  },

  updateNote: (id, updates) => {
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
    get().persist();
  },

  deleteNote: (id) => {
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
    get().persist();
  },

  getNotesByCourse: (courseId) => {
    if (courseId === undefined) return get().notes;
    return get().notes.filter((n) => n.courseId === courseId);
  },

  // Flashcards
  addFlashcard: (flashcard) => {
    set((state) => ({ flashcards: [...state.flashcards, flashcard] }));
    get().persist();
  },

  updateFlashcard: (id, updates) => {
    set((state) => ({
      flashcards: state.flashcards.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
    get().persist();
  },

  deleteFlashcard: (id) => {
    set((state) => ({ flashcards: state.flashcards.filter((f) => f.id !== id) }));
    get().persist();
  },

  getFlashcardsByCourse: (courseId) => {
    return get().flashcards.filter((f) => f.courseId === courseId);
  },

  // Resources
  addResource: (resource) => {
    set((state) => ({ resources: [...state.resources, resource] }));
    get().persist();
  },

  updateResource: (id, updates) => {
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
    get().persist();
  },

  deleteResource: (id) => {
    set((state) => ({ resources: state.resources.filter((r) => r.id !== id) }));
    get().persist();
  },

  // Messages
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
    get().persist();
  },

  // Settings
  toggleDarkMode: () => {
    set((state) => ({
      settings: { ...state.settings, darkMode: !state.settings.darkMode },
    }));
    get().persist();
  },

  setLanguage: (lang) => {
    set((state) => ({
      settings: { ...state.settings, language: lang },
    }));
    get().persist();
  },

  // Phase 6: XP Events
  addXPEvent: (event) => {
    set((state) => ({ xpEvents: [...state.xpEvents, event] }));
    get().persist();
  },

  getXPEventsByCourse: (courseId) => {
    return get().xpEvents.filter((e) => e.courseId === courseId);
  },

  // Phase 6: Learning Events
  addLearningEvent: (event) => {
    set((state) => ({ learningEvents: [...state.learningEvents, event] }));
    get().persist();
  },

  getLearningEventsByCourse: (courseId) => {
    return get().learningEvents.filter((e) => e.courseId === courseId);
  },

  // Phase 6: Analytics
  addCourseAnalytics: (analytics) => {
    set((state) => {
      const existing = state.courseAnalytics.findIndex(
        (a) => a.userId === analytics.userId && a.courseId === analytics.courseId && a.date === analytics.date
      );
      if (existing >= 0) {
        const updated = [...state.courseAnalytics];
        updated[existing] = analytics;
        return { courseAnalytics: updated };
      }
      return { courseAnalytics: [...state.courseAnalytics, analytics] };
    });
    get().persist();
  },

  getCourseAnalytics: (courseId) => {
    return get().courseAnalytics.filter((a) => a.courseId === courseId);
  },

  // Phase 6: Predictions
  addPrediction: (prediction) => {
    set((state) => ({ predictions: [...state.predictions, prediction] }));
    get().persist();
  },

  getPredictionsByCourse: (courseId) => {
    return get().predictions.filter((p) => p.courseId === courseId);
  },

  // Phase 6: Agent Context
  setAgentContext: (context) => {
    set((state) => {
      const existing = state.agentContext.findIndex(
        (a) => a.userId === context.userId && a.courseId === context.courseId && a.key === context.key
      );
      if (existing >= 0) {
        const updated = [...state.agentContext];
        updated[existing] = { ...context, updatedAt: new Date().toISOString() };
        return { agentContext: updated };
      }
      return { agentContext: [...state.agentContext, context] };
    });
    get().persist();
  },

  getAgentContext: (courseId, key) => {
    const user = get().getCurrentUser();
    if (!user) return undefined;
    return get().agentContext.find(
      (a) => a.userId === user.id && a.courseId === courseId && a.key === key
    );
  },

  // Import/Export
  exportData: () => {
    const state = get();
    const snapshot: StoreSnapshot = {
      users: state.users,
      courses: state.courses,
      enrollments: state.enrollments,
      materials: state.materials,
      assignments: state.assignments,
      exams: state.exams,
      studyBlocks: state.studyBlocks,
      notes: state.notes,
      resources: state.resources,
      messages: state.messages,
      settings: state.settings,
      xpEvents: state.xpEvents || [],
      learningEvents: state.learningEvents || [],
      courseAnalytics: state.courseAnalytics || [],
      predictions: state.predictions || [],
      flashcards: state.flashcards || [],
      agentContext: state.agentContext || [],
    };
    const { exportSnapshot } = require("./storage");
    exportSnapshot(snapshot);
  },

  importData: (snapshot) => {
    set({ ...snapshot });
    saveSnapshot(snapshot);
  },

  resetData: async () => {
    const currentAccountId = getCurrentAccountId();
    clearStorage(currentAccountId);
    const account = getAccount(currentAccountId);
    try {
      const seedData = await generateSeedData(account?.id || currentAccountId);
      set({ ...seedData });
      saveSnapshot(seedData, currentAccountId);
    } catch (error) {
      console.error("Failed to reset with comprehensive data:", error);
      const { generateSeedDataSync } = await import("./seed");
      const seedData = generateSeedDataSync(account?.id || currentAccountId);
      set({ ...seedData });
      saveSnapshot(seedData, currentAccountId);
    }
  },

  resetDataForAccount: async (accountId: string) => {
    clearStorage(accountId);
    const account = getAccount(accountId);
    try {
      const seedData = await generateSeedData(account?.id || accountId);
      if (getCurrentAccountId() === accountId) {
        set({ ...seedData });
      }
      saveSnapshot(seedData, accountId);
    } catch (error) {
      console.error("Failed to reset account with comprehensive data:", error);
      const { generateSeedDataSync } = await import("./seed");
      const seedData = generateSeedDataSync(account?.id || accountId);
      if (getCurrentAccountId() === accountId) {
        set({ ...seedData });
      }
      saveSnapshot(seedData, accountId);
    }
  },
}));

