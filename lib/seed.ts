import type { StoreSnapshot } from "./types";
import { createFlashcard } from "./spaced-repetition";
import { getAccount, DEFAULT_ACCOUNT_ID } from "./accounts";

// Import comprehensive generators (dynamic import to handle async)
let sarahGenerator: any = null;
let marcusGenerator: any = null;

async function loadGenerators() {
  if (!sarahGenerator) {
    try {
      sarahGenerator = await import("../scripts/generators/sarah");
      marcusGenerator = await import("../scripts/generators/marcus");
    } catch (error) {
      console.warn("Comprehensive generators not available, using basic seed:", error);
      return false;
    }
  }
  return true;
}

export async function generateSeedData(accountId?: string): Promise<StoreSnapshot> {
  const account = accountId ? getAccount(accountId) : getAccount(DEFAULT_ACCOUNT_ID);
  const userId = account?.id || DEFAULT_ACCOUNT_ID;
  
  // Use account-specific comprehensive data generators
  const isSarah = accountId === "sarah-chen" || accountId === DEFAULT_ACCOUNT_ID || !accountId;
  
  // Try to use comprehensive generators
  const generatorsLoaded = await loadGenerators();
  if (generatorsLoaded && sarahGenerator && marcusGenerator) {
    try {
      return isSarah ? await sarahGenerator.generateSarahData() : await marcusGenerator.generateMarcusData();
    } catch (error) {
      console.error("Failed to generate comprehensive data, falling back to basic seed:", error);
    }
  }
  
  // Fallback to basic seed data
  return isSarah ? generateSarahSeedData(userId) : generateMarcusSeedData(userId);
}

// Synchronous wrapper for compatibility
export function generateSeedDataSync(accountId?: string): StoreSnapshot {
  const account = accountId ? getAccount(accountId) : getAccount(DEFAULT_ACCOUNT_ID);
  const userId = account?.id || DEFAULT_ACCOUNT_ID;
  const isSarah = accountId === "sarah-chen" || accountId === DEFAULT_ACCOUNT_ID || !accountId;
  return isSarah ? generateSarahSeedData(userId) : generateMarcusSeedData(userId);
}

// Generate seed data for Sarah Chen (Computer Science Major)
function generateSarahSeedData(userId: string): StoreSnapshot {
  const account = getAccount(userId) || getAccount(DEFAULT_ACCOUNT_ID);
  
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
        name: account?.name || "Sarah Chen",
        email: account?.email || "sarah.chen@university.edu",
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

// Generate seed data for Marcus Johnson (Business & Psychology Major)
function generateMarcusSeedData(userId: string): StoreSnapshot {
  const account = getAccount("marcus-johnson");
  
  // Courses for Business/Psych major
  const psych101 = { 
    id: "course-1", 
    code: "PSYCH101", 
    title: "Introduction to Psychology", 
    description: "Foundations of psychological science and research methods", 
    term: "Fall 2025" 
  };
  const bus201 = { 
    id: "course-2", 
    code: "BUS201", 
    title: "Principles of Management", 
    description: "Fundamentals of organizational behavior and management", 
    term: "Fall 2025" 
  };
  const econ101 = { 
    id: "course-3", 
    code: "ECON101", 
    title: "Microeconomics", 
    description: "Individual and firm decision-making in markets", 
    term: "Fall 2025" 
  };

  const now = new Date();
  const today = now.toISOString();

  // Create seed flashcards
  const flashcards = [
    createFlashcard(psych101.id, "What is neuroplasticity?", "The brain's ability to reorganize neural pathways in response to experience and learning.", "medium"),
    createFlashcard(psych101.id, "Describe Pavlov's experiment", "Classical conditioning study where dogs learned to associate bell with food, causing salivation.", "easy"),
    createFlashcard(psych101.id, "Difference between STM and LTM?", "Short-term memory holds 7±2 items for seconds; long-term memory has unlimited capacity and duration.", "medium"),
    createFlashcard(bus201.id, "What is SWOT analysis?", "Strategic planning tool analyzing Strengths, Weaknesses, Opportunities, and Threats.", "easy"),
    createFlashcard(bus201.id, "Define organizational culture", "Shared values, beliefs, and practices that shape behavior within an organization.", "medium"),
    createFlashcard(econ101.id, "What is opportunity cost?", "The value of the next best alternative forgone when making a decision.", "easy"),
    createFlashcard(econ101.id, "Law of demand", "As price increases, quantity demanded decreases (ceteris paribus).", "easy"),
  ];

  return {
    users: [
      {
        id: userId,
        name: account?.name || "Marcus Johnson",
        email: account?.email || "marcus.johnson@university.edu",
        role: "student",
      },
    ],
    courses: [psych101, bus201, econ101],
    enrollments: [
      { id: "enroll-1", userId, courseId: psych101.id, role: "student" },
      { id: "enroll-2", userId, courseId: bus201.id, role: "student" },
      { id: "enroll-3", userId, courseId: econ101.id, role: "student" },
    ],
    materials: [
      {
        id: "mat-1",
        courseId: psych101.id,
        title: "Brain Structure and Function",
        type: "pdf",
        source: "brain-structure.pdf",
        textPreview: "The human brain is divided into distinct regions, each with specialized functions. The frontal lobe controls executive functions, decision-making, and personality. The temporal lobe processes auditory information and language. The occipital lobe handles visual processing. Understanding these structures helps explain how psychological processes emerge from neural activity.",
      },
      {
        id: "mat-2",
        courseId: bus201.id,
        title: "Management Theories: From Taylor to Modern",
        type: "pdf",
        source: "management-theories.pdf",
        textPreview: "Management theory has evolved significantly. Frederick Taylor's scientific management focused on efficiency through systematic observation. Elton Mayo's Hawthorne studies revealed the importance of social factors. Modern approaches emphasize leadership, organizational culture, and employee engagement as key drivers of performance.",
      },
      {
        id: "mat-3",
        courseId: econ101.id,
        title: "Supply and Demand Fundamentals",
        type: "pdf",
        source: "supply-demand.pdf",
        textPreview: "Supply and demand are fundamental forces in market economies. Demand represents consumer willingness to buy at various prices. Supply represents producer willingness to sell. Market equilibrium occurs where supply equals demand, determining price and quantity. Shifts in these curves drive price changes.",
      },
    ],
    assignments: [
      {
        id: "assign-1",
        courseId: psych101.id,
        title: "Brain Anatomy Diagram",
        description: "Create detailed diagram of brain regions with functions",
        dueAt: new Date("2025-11-09T23:59:00").toISOString(),
        status: "submitted",
        rubric: "Accuracy (40%), Completeness (30%), Clarity (30%)",
      },
      {
        id: "assign-2",
        courseId: bus201.id,
        title: "Case Study: Organizational Culture Analysis",
        description: "Analyze a real company's organizational culture using concepts from class",
        dueAt: new Date("2025-11-12T18:00:00").toISOString(),
        status: "in_progress",
        rubric: "Analysis (40%), Application (30%), Writing (30%)",
      },
      {
        id: "assign-3",
        courseId: econ101.id,
        title: "Market Analysis Report",
        description: "Analyze supply and demand factors for a chosen product",
        dueAt: new Date("2025-11-14T12:00:00").toISOString(),
        status: "planned",
      },
    ],
    exams: [
      {
        id: "exam-1",
        courseId: psych101.id,
        title: "PSYCH101 Midterm Exam",
        startAt: new Date("2025-11-16T10:00:00").toISOString(),
        endAt: new Date("2025-11-16T12:00:00").toISOString(),
        type: "midterm",
      },
      {
        id: "exam-2",
        courseId: bus201.id,
        title: "BUS201 Quiz 3",
        startAt: new Date("2025-11-18T09:00:00").toISOString(),
        endAt: new Date("2025-11-18T09:25:00").toISOString(),
        type: "quiz",
      },
    ],
    studyBlocks: [
      {
        id: "block-1",
        userId,
        courseId: psych101.id,
        title: "PSYCH101 - Brain Structure Review",
        startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(),
        endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30).toISOString(),
        status: "planned",
      },
      {
        id: "block-2",
        userId,
        courseId: bus201.id,
        title: "BUS201 - Case Study Research",
        startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0).toISOString(),
        endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0).toISOString(),
        status: "planned",
      },
    ],
    notes: [
      {
        id: "note-1",
        userId,
        courseId: psych101.id,
        title: "Memory Systems Summary",
        body: "# Memory Systems\n\n## Types of Memory\n\n- **Sensory Memory**: Brief retention (0.5-3 seconds)\n- **Short-Term Memory**: 7±2 items, 15-30 seconds\n- **Long-Term Memory**: Unlimited capacity\n\n## Encoding Strategies\n\n- Elaborative rehearsal\n- Mnemonics\n- Chunking",
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "note-2",
        userId,
        courseId: bus201.id,
        title: "Leadership Styles Notes",
        body: "# Leadership Styles\n\n## Transactional Leadership\n\n- Focus on exchange: rewards for performance\n- Clear structure and expectations\n\n## Transformational Leadership\n\n- Inspires change\n- Focuses on vision and motivation\n- Empowers followers",
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
