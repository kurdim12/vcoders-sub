// Sarah Chen - Computer Science Major Data Generator
// Generates comprehensive CS-focused academic data

import type { StoreSnapshot, XPEvent, LearningEvent, Exam, Note } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { createFlashcard } from "@/lib/spaced-repetition";
import { generateCSMaterials } from "./materials";
import { generateCSFlashcards } from "./flashcards";
import { generateCSAssignments } from "./assignments";
import { generateCSConversations } from "./conversations";
import { generateCSAnalytics } from "./analytics";

const SARAH_ID = "sarah-chen";

// Sarah's Courses (CS Major focus)
const COURSES = [
  {
    id: "course-cs101",
    code: "CS101",
    title: "Introduction to Programming (Python)",
    description: "Fundamentals of programming using Python. Covers variables, data types, control flow, functions, and object-oriented programming.",
    term: "Fall 2025",
  },
  {
    id: "course-cs201",
    code: "CS201",
    title: "Data Structures & Algorithms",
    description: "Study of fundamental data structures (arrays, linked lists, trees, graphs) and algorithm analysis. Big-O notation and complexity analysis.",
    term: "Fall 2025",
  },
  {
    id: "course-math241",
    code: "MATH241",
    title: "Calculus III",
    description: "Multivariable calculus, partial derivatives, multiple integrals, vector calculus.",
    term: "Fall 2025",
  },
  {
    id: "course-phys211",
    code: "PHYS211",
    title: "Physics I - Mechanics",
    description: "Classical mechanics: kinematics, dynamics, energy, momentum, rotational motion.",
    term: "Fall 2025",
  },
  {
    id: "course-cs305",
    code: "CS305",
    title: "Database Systems",
    description: "Relational database design, SQL, normalization, transactions, indexing, query optimization.",
    term: "Fall 2025",
  },
  {
    id: "course-math221",
    code: "MATH221",
    title: "Linear Algebra",
    description: "Vector spaces, matrices, linear transformations, eigenvalues, eigenvectors, applications.",
    term: "Fall 2025",
  },
];

export async function generateSarahData(): Promise<StoreSnapshot> {
  const now = new Date();
  const userId = SARAH_ID;

  // Generate all course data
  const materials = await generateCSMaterials(COURSES);
  const flashcards = generateCSFlashcards(COURSES, userId, now);
  const assignments = generateCSAssignments(COURSES, userId, now);
  const exams = generateCSExams(COURSES, now);
  const studyBlocks = generateCSStudyBlocks(COURSES, userId, now);
  const notes = generateCSNotes(COURSES, userId, now);
  const conversations = generateCSConversations(COURSES, userId, now);
  const analytics = generateCSAnalytics(COURSES, userId, now);
  const xpEvents = generateCSXPEvents(userId, now);
  const learningEvents = generateCSLearningEvents(COURSES, userId, now);

  // Create enrollments
  const enrollments = COURSES.map((course, idx) => ({
    id: `enroll-${idx + 1}`,
    userId,
    courseId: course.id,
    role: "student" as const,
  }));

  return {
    users: [
      {
        id: userId,
        name: "Sarah Chen",
        email: "sarah.chen@university.edu",
        role: "student",
      },
    ],
    courses: COURSES,
    enrollments,
    materials,
    assignments,
    exams,
    studyBlocks,
    notes,
    resources: [],
    messages: conversations,
    flashcards,
    settings: {
      darkMode: true, // Sarah prefers dark mode (night coder)
      language: "en",
    },
    xpEvents,
    learningEvents,
    courseAnalytics: analytics,
    predictions: [],
    agentContext: [],
  };
}

function generateCSExams(courses: typeof COURSES, now: Date): Exam[] {
  const exams: Exam[] = [];
  
  courses.forEach((course, idx) => {
    // Midterm exam
    const midtermDate = new Date(now);
    midtermDate.setDate(midtermDate.getDate() + 15 + idx * 7);
    midtermDate.setHours(10, 0, 0, 0);
    
    exams.push({
      id: `exam-${course.id}-midterm`,
      courseId: course.id,
      title: `${course.code} Midterm Exam`,
      startAt: midtermDate.toISOString(),
      endAt: new Date(midtermDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      type: "midterm" as const,
    });

    // Quiz (for some courses)
    if (idx % 2 === 0) {
      const quizDate = new Date(midtermDate);
      quizDate.setDate(quizDate.getDate() - 7);
      quizDate.setHours(9, 0, 0, 0);
      
      exams.push({
        id: `exam-${course.id}-quiz`,
        courseId: course.id,
        title: `${course.code} Quiz ${Math.floor(idx / 2) + 1}`,
        startAt: quizDate.toISOString(),
        endAt: new Date(quizDate.getTime() + 25 * 60 * 1000).toISOString(),
        type: "quiz" as const,
      });
    }
  });

  return exams;
}

function generateCSStudyBlocks(courses: typeof COURSES, userId: string, now: Date) {
  const blocks = [];
  
  // Generate study blocks for the past 30 days and next 14 days
  for (let dayOffset = -30; dayOffset <= 14; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    // Sarah studies late (8pm-1am pattern)
    if (dayOffset % 3 === 0) {
      const course = courses[Math.floor(Math.random() * courses.length)];
      const startHour = 20 + Math.floor(Math.random() * 3); // 8pm-10pm start
      const duration = 1.5 + Math.random() * 1.5; // 1.5-3 hours
      
      blocks.push({
        id: `block-${course.id}-${dayOffset}`,
        userId,
        courseId: course.id,
        title: `${course.code} - ${course.code.includes("CS") ? "Coding Practice" : "Study Session"}`,
        startAt: new Date(date.setHours(startHour, 0, 0, 0)).toISOString(),
        endAt: new Date(date.setHours(startHour + duration, 0, 0, 0)).toISOString(),
        status: (dayOffset < 0 ? (Math.random() > 0.3 ? "done" : "missed") : "planned") as "planned" | "done" | "missed",
      });
    }
  }

  return blocks;
}

function generateCSNotes(courses: typeof COURSES, userId: string, now: Date): Note[] {
  const notes: Note[] = [];
  
  const noteTemplates = {
    "CS101": [
      {
        title: "Python Basics: Variables and Data Types",
        body: `# Python Basics

## Variables
- Variables are dynamically typed
- No declaration needed: \`x = 5\`
- Can reassign to different types

## Data Types
- **int**: Integers (unlimited precision)
- **float**: Floating point numbers
- **str**: Strings (immutable)
- **list**: Mutable sequences
- **tuple**: Immutable sequences
- **dict**: Key-value pairs
- **set**: Unordered, unique elements

## Examples
\`\`\`python
# Integer
age = 20

# String
name = "Sarah"

# List
grades = [85, 90, 92]

# Dictionary
student = {"name": "Sarah", "age": 20}
\`\`\``,
      },
      {
        title: "Control Flow: Loops and Conditionals",
        body: `# Control Flow

## If Statements
\`\`\`python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
\`\`\`

## For Loops
\`\`\`python
# Iterate over list
for item in items:
    print(item)

# With index
for i, item in enumerate(items):
    print(f"{i}: {item}")
\`\`\`

## While Loops
\`\`\`python
count = 0
while count < 10:
    print(count)
    count += 1
\`\`\``,
      },
    ],
    "CS201": [
      {
        title: "Big-O Notation Summary",
        body: `# Big-O Notation

## Common Time Complexities
- **O(1)**: Constant time (array access)
- **O(log n)**: Logarithmic (binary search)
- **O(n)**: Linear (simple loops)
- **O(n log n)**: Linearithmic (merge sort)
- **O(n²)**: Quadratic (nested loops)
- **O(2ⁿ)**: Exponential (recursive Fibonacci)

## Key Rules
1. Drop constants: O(2n) → O(n)
2. Drop lower-order terms: O(n² + n) → O(n²)
3. Focus on worst-case scenario

## Space Complexity
- Also uses Big-O notation
- Measures memory usage relative to input size`,
      },
    ],
  };

  courses.forEach((course) => {
    const templates = noteTemplates[course.code as keyof typeof noteTemplates] || [];
    templates.forEach((template, idx) => {
      notes.push({
        id: `note-${course.id}-${idx}`,
        userId,
        courseId: course.id,
        title: template.title,
        body: template.body,
        updatedAt: new Date(now.getTime() - (templates.length - idx) * 2 * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  });

  return notes;
}

function generateCSXPEvents(userId: string, now: Date): XPEvent[] {
  const events: XPEvent[] = [];
  let totalXP = 0;
  
  // Generate XP events for past 30 days
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    // Daily activities that award XP
    const activities = [
      { type: "tutor_session", xp: 15, count: Math.floor(Math.random() * 3) + 1 },
      { type: "flashcard_review", xp: 5, count: Math.floor(Math.random() * 20) + 10 },
      { type: "assignment_completed", xp: 50, count: Math.random() > 0.9 ? 1 : 0 },
      { type: "study_session", xp: 10, count: Math.floor(Math.random() * 3) + 1 },
    ];
    
    activities.forEach((activity) => {
      for (let i = 0; i < activity.count; i++) {
        const courseId = `course-cs${Math.floor(Math.random() * 3) + 101}`;
        totalXP += activity.xp;
        
        events.push({
          id: `xp-${dayOffset}-${activity.type}-${i}`,
          userId,
          courseId,
          kind: activity.type as XPEvent["kind"],
          xp: activity.xp,
          meta: {},
          createdAt: new Date(date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60))).toISOString(),
        });
      }
    });
  }
  
  return events;
}

function generateCSLearningEvents(courses: typeof COURSES, userId: string, now: Date): LearningEvent[] {
  const events: LearningEvent[] = [];
  
  // Generate learning events from tutor conversations
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    // 1-2 learning events per day (late night sessions)
    const count = Math.random() > 0.5 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const course = courses[Math.floor(Math.random() * courses.length)];
      const hour = 20 + Math.floor(Math.random() * 5); // 8pm-12am
      
      events.push({
        id: `learn-${dayOffset}-${i}`,
        userId,
        courseId: course.id,
        source: "tutor",
        durationSecs: 120 + Math.floor(Math.random() * 180), // 2-5 minutes
        outcome: Math.random() > 0.2 ? "completed" : "skipped",
        payload: {
          question: "How does recursion work in this algorithm?",
          materialRefs: [`mat-${course.id}-1`],
        },
        createdAt: new Date(date.setHours(hour, Math.floor(Math.random() * 60))).toISOString(),
      });
    }
  }
  
  return events;
}

