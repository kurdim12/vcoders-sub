import type { StoreSnapshot } from "./types";
import { createFlashcard } from "./spaced-repetition";

export function generateSeedData(): StoreSnapshot {
  const userId = "user-1";

  // Courses
  const cs101 = { id: "course-1", code: "CS101", title: "Introduction to Computer Science", description: "Fundamentals of programming and algorithms", term: "Fall 2025" };
  const math241 = { id: "course-2", code: "MATH241", title: "Calculus III", description: "Multivariable calculus and vector analysis", term: "Fall 2025" };
  const hist210 = { id: "course-3", code: "HIST210", title: "World History", description: "Major events and movements in world history", term: "Fall 2025" };

  // Get dates
  const now = new Date();
  const today = now.toISOString();

  // Create seed flashcards
  const flashcards = [
    createFlashcard(cs101.id, "What is Big-O notation?", "Big-O notation describes the limiting behavior of a function, used in computer science to analyze algorithm efficiency.", "medium"),
    createFlashcard(cs101.id, "What is O(1) complexity?", "Constant time complexity - the algorithm takes the same amount of time regardless of input size.", "easy"),
    createFlashcard(cs101.id, "What is O(log n) complexity?", "Logarithmic time complexity - time grows logarithmically with input size (e.g., binary search).", "medium"),
    createFlashcard(cs101.id, "What is O(n²) complexity?", "Quadratic time complexity - time grows quadratically with input size (e.g., nested loops).", "medium"),
    createFlashcard(math241.id, "What is a triple integral?", "A triple integral extends double integrals to three dimensions, used to calculate volume, mass, and other 3D properties.", "hard"),
    createFlashcard(math241.id, "What is Fubini's theorem?", "Fubini's theorem allows changing the order of integration in multiple integrals.", "hard"),
    createFlashcard(hist210.id, "What does MAIN stand for?", "Militarism, Alliances, Imperialism, Nationalism - the four main causes of World War I.", "easy"),
    createFlashcard(hist210.id, "What was the immediate trigger for WWI?", "The assassination of Archduke Franz Ferdinand in 1914.", "easy"),
  ];

  return {
    users: [
      {
        id: userId,
        name: "Alex Student",
        email: "alex@university.edu",
        role: "student",
      },
    ],
    courses: [cs101, math241, hist210],
    enrollments: [
      { id: "enroll-1", userId, courseId: cs101.id, role: "student" },
      { id: "enroll-2", userId, courseId: math241.id, role: "student" },
      { id: "enroll-3", userId, courseId: hist210.id, role: "student" },
    ],
    materials: [
      {
        id: "mat-1",
        courseId: cs101.id,
        title: "Algorithm Analysis Lecture Notes",
        type: "pdf",
        source: "algorithms.pdf",
        textPreview: "Big-O notation is a mathematical notation that describes the limiting behavior of a function. In computer science, we use it to analyze algorithm efficiency. O(n) represents linear time complexity, O(n²) represents quadratic time, and O(log n) represents logarithmic time. Understanding asymptotic notation is crucial for algorithm design.",
      },
      {
        id: "mat-2",
        courseId: math241.id,
        title: "Vector Calculus Textbook Chapter 3",
        type: "pdf",
        source: "calculus-ch3.pdf",
        textPreview: "Triple integrals extend the concept of double integrals to three dimensions. They are used to calculate volume, mass, and other properties of three-dimensional regions. The order of integration can be changed using Fubini's theorem. Applications include finding the center of mass and moments of inertia.",
      },
      {
        id: "mat-3",
        courseId: hist210.id,
        title: "WWI Causes and Context",
        type: "pdf",
        source: "wwi-causes.pdf",
        textPreview: "The causes of World War I are complex and interconnected. Major factors include militarism, alliances, imperialism, and nationalism (MAIN). The assassination of Archduke Franz Ferdinand in 1914 was the immediate trigger, but underlying tensions had been building for decades. The alliance system turned a regional conflict into a world war.",
      },
    ],
    assignments: [
      {
        id: "assign-1",
        courseId: cs101.id,
        title: "Problem Set 2: Algorithm Analysis",
        description: "Analyze the time complexity of various sorting algorithms",
        dueAt: new Date("2025-11-09T23:59:00").toISOString(),
        status: "in_progress",
        rubric: "Correctness (50%), Efficiency (30%), Code quality (20%)",
        subtasks: [
          { id: "subtask-1", text: "Analyze bubble sort complexity", done: true },
          { id: "subtask-2", text: "Analyze merge sort complexity", done: false },
          { id: "subtask-3", text: "Write comparison report", done: false },
        ],
      },
      {
        id: "assign-2",
        courseId: hist210.id,
        title: "Essay Draft: WWI Analysis",
        description: "5-page essay on the causes of World War I",
        dueAt: new Date("2025-11-12T18:00:00").toISOString(),
        status: "planned",
        rubric: "Thesis (20%), Evidence (30%), Analysis (30%), Writing (20%)",
      },
      {
        id: "assign-3",
        courseId: math241.id,
        title: "Series & Sequences Problem Sheet",
        description: "Complete problems 1-15 from chapter 11",
        dueAt: new Date("2025-11-14T12:00:00").toISOString(),
        status: "planned",
      },
    ],
    exams: [
      {
        id: "exam-1",
        courseId: cs101.id,
        title: "CS101 Midterm Exam",
        startAt: new Date("2025-11-16T10:00:00").toISOString(),
        endAt: new Date("2025-11-16T12:00:00").toISOString(),
        type: "midterm",
      },
      {
        id: "exam-2",
        courseId: math241.id,
        title: "MATH241 Quiz 3",
        startAt: new Date("2025-11-18T09:00:00").toISOString(),
        endAt: new Date("2025-11-18T09:25:00").toISOString(),
        type: "quiz",
      },
    ],
    studyBlocks: [
      {
        id: "block-1",
        userId,
        courseId: cs101.id,
        title: "CS101 - Algorithm Review",
        startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0).toISOString(),
        endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30).toISOString(),
        status: "planned",
      },
      {
        id: "block-2",
        userId,
        courseId: hist210.id,
        title: "HIST210 - Essay Research",
        startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0).toISOString(),
        endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0).toISOString(),
        status: "planned",
      },
      {
        id: "block-3",
        userId,
        courseId: math241.id,
        title: "MATH241 - Practice Problems",
        startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0).toISOString(),
        endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30).toISOString(),
        status: "planned",
      },
    ],
    notes: [
      {
        id: "note-1",
        userId,
        courseId: cs101.id,
        title: "Big-O Notation Summary",
        body: "# Big-O Notation\n\n## Common Time Complexities\n\n- **O(1)** - Constant time\n- **O(log n)** - Logarithmic (binary search)\n- **O(n)** - Linear (simple loops)\n- **O(n log n)** - Linearithmic (merge sort)\n- **O(n²)** - Quadratic (nested loops)\n\n## Key Points\n\nDrop constants and lower-order terms. Focus on worst-case scenario.",
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "note-2",
        userId,
        courseId: math241.id,
        title: "Triple Integrals Notes",
        body: "# Triple Integrals\n\n## Definition\n\n∫∫∫ f(x,y,z) dV\n\n## Applications\n\n- Volume calculation\n- Mass and density\n- Center of mass\n\n## Integration Orders\n\nCan integrate in any order: dxdydz, dydxdz, etc.\nChoose order based on region boundaries.",
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    resources: [],
    messages: [],
    flashcards: flashcards,
    settings: {
      darkMode: false,
      language: "en",
    },
    xpEvents: [],
    learningEvents: [],
    courseAnalytics: [],
    predictions: [],
    agentContext: [],
  };
}
