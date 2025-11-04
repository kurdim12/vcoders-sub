// Marcus Johnson - Business & Psychology Major Data Generator
// Generates comprehensive Business/Psych-focused academic data

import type { StoreSnapshot, XPEvent, LearningEvent, Exam, Note } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { createFlashcard } from "@/lib/spaced-repetition";
import { generateBusinessMaterials } from "./materials";
import { generateBusinessFlashcards } from "./flashcards";
import { generateBusinessAssignments } from "./assignments";
import { generateBusinessConversations } from "./conversations";
import { generateBusinessAnalytics } from "./analytics";

const MARCUS_ID = "marcus-johnson";

// Marcus's Courses (Business & Psychology focus)
const COURSES = [
  {
    id: "course-psych101",
    code: "PSYCH101",
    title: "Introduction to Psychology",
    description: "Foundations of psychological science, research methods, brain structure, learning, memory, and cognition.",
    term: "Fall 2025",
  },
  {
    id: "course-bus201",
    code: "BUS201",
    title: "Principles of Management",
    description: "Management theories, organizational behavior, leadership styles, strategic planning, and team dynamics.",
    term: "Fall 2025",
  },
  {
    id: "course-econ101",
    code: "ECON101",
    title: "Microeconomics",
    description: "Individual and firm decision-making, supply and demand, market structures, pricing, and consumer behavior.",
    term: "Fall 2025",
  },
  {
    id: "course-psych220",
    code: "PSYCH220",
    title: "Social Psychology",
    description: "Social influence, group dynamics, attitudes, persuasion, relationships, and social cognition.",
    term: "Fall 2025",
  },
  {
    id: "course-bus305",
    code: "BUS305",
    title: "Marketing Fundamentals",
    description: "Marketing strategy, consumer behavior, branding, advertising, digital marketing, and market research.",
    term: "Fall 2025",
  },
  {
    id: "course-comm201",
    code: "COMM201",
    title: "Business Communication",
    description: "Professional writing, presentations, interpersonal communication, negotiation, and workplace communication.",
    term: "Fall 2025",
  },
];

export async function generateMarcusData(): Promise<StoreSnapshot> {
  const now = new Date();
  const userId = MARCUS_ID;

  // Generate all course data
  const materials = await generateBusinessMaterials(COURSES);
  const flashcards = generateBusinessFlashcards(COURSES, userId, now);
  const assignments = generateBusinessAssignments(COURSES, userId, now);
  const exams = generateBusinessExams(COURSES, now);
  const studyBlocks = generateBusinessStudyBlocks(COURSES, userId, now);
  const notes = generateBusinessNotes(COURSES, userId, now);
  const conversations = generateBusinessConversations(COURSES, userId, now);
  const analytics = generateBusinessAnalytics(COURSES, userId, now);
  const xpEvents = generateBusinessXPEvents(userId, now);
  const learningEvents = generateBusinessLearningEvents(COURSES, userId, now);

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
        name: "Marcus Johnson",
        email: "marcus.johnson@university.edu",
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
      darkMode: false, // Marcus prefers light mode (morning person)
      language: "en",
    },
    xpEvents,
    learningEvents,
    courseAnalytics: analytics,
    predictions: [],
    agentContext: [],
  };
}

function generateBusinessExams(courses: typeof COURSES, now: Date): Exam[] {
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

function generateBusinessStudyBlocks(courses: typeof COURSES, userId: string, now: Date) {
  const blocks = [];
  
  // Generate study blocks for the past 30 days and next 14 days
  // Marcus studies in the morning (9am-12pm pattern)
  for (let dayOffset = -30; dayOffset <= 14; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    if (dayOffset % 2 === 0) {
      const course = courses[Math.floor(Math.random() * courses.length)];
      const startHour = 9 + Math.floor(Math.random() * 3); // 9am-11am start
      const duration = 1 + Math.random() * 2; // 1-3 hours
      
      blocks.push({
        id: `block-${course.id}-${dayOffset}`,
        userId,
        courseId: course.id,
        title: `${course.code} - Study Session`,
        startAt: new Date(date.setHours(startHour, 0, 0, 0)).toISOString(),
        endAt: new Date(date.setHours(startHour + duration, 0, 0, 0)).toISOString(),
        status: (dayOffset < 0 ? (Math.random() > 0.25 ? "done" : "missed") : "planned") as "planned" | "done" | "missed",
      });
    }
  }

  return blocks;
}

function generateBusinessNotes(courses: typeof COURSES, userId: string, now: Date): Note[] {
  const notes: Note[] = [];
  
  const noteTemplates = {
    "PSYCH101": [
      {
        title: "Brain Structure and Function",
        body: `# Brain Structure

## Major Regions
- **Frontal Lobe**: Executive functions, decision-making, personality
- **Parietal Lobe**: Sensory processing, spatial awareness
- **Temporal Lobe**: Auditory processing, language, memory
- **Occipital Lobe**: Visual processing

## Key Structures
- **Hippocampus**: Memory formation
- **Amygdala**: Emotional processing
- **Cerebellum**: Motor control, coordination
- **Brainstem**: Basic life functions

## Neuroplasticity
The brain's ability to reorganize neural pathways in response to experience.`,
      },
      {
        title: "Learning Theories",
        body: `# Learning Theories

## Classical Conditioning (Pavlov)
- Unconditioned stimulus → Unconditioned response
- Conditioned stimulus → Conditioned response
- Example: Bell + Food → Salivation

## Operant Conditioning (Skinner)
- Reinforcement increases behavior
- Punishment decreases behavior
- Positive vs. Negative reinforcement

## Observational Learning (Bandura)
- Learning through observation
- Modeling and imitation
- Self-efficacy beliefs`,
      },
    ],
    "BUS201": [
      {
        title: "Management Theories",
        body: `# Management Theories

## Scientific Management (Taylor)
- Focus on efficiency
- Time and motion studies
- Standardization

## Human Relations (Mayo)
- Importance of social factors
- Employee satisfaction
- Informal groups

## Modern Approaches
- Systems thinking
- Contingency theory
- Total Quality Management (TQM)`,
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

function generateBusinessXPEvents(userId: string, now: Date): XPEvent[] {
  const events: XPEvent[] = [];
  
  // Generate XP events for past 30 days
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    // Daily activities (morning pattern)
    const activities = [
      { type: "tutor_session", xp: 12, count: Math.floor(Math.random() * 2) + 1 },
      { type: "flashcard_review", xp: 5, count: Math.floor(Math.random() * 15) + 8 },
      { type: "assignment_completed", xp: 50, count: Math.random() > 0.85 ? 1 : 0 },
      { type: "study_session", xp: 10, count: Math.floor(Math.random() * 2) + 1 },
    ];
    
    activities.forEach((activity) => {
      for (let i = 0; i < activity.count; i++) {
        const courseId = `course-${["psych101", "bus201", "econ101"][Math.floor(Math.random() * 3)]}`;
        
        events.push({
          id: `xp-${dayOffset}-${activity.type}-${i}`,
          userId,
          courseId,
          kind: activity.type as XPEvent["kind"],
          xp: activity.xp,
          meta: {},
          createdAt: new Date(date.setHours(9 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60))).toISOString(),
        });
      }
    });
  }
  
  return events;
}

function generateBusinessLearningEvents(courses: typeof COURSES, userId: string, now: Date): LearningEvent[] {
  const events: LearningEvent[] = [];
  
  // Generate learning events (morning study sessions)
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    const count = Math.random() > 0.6 ? 1 : 0; // Less frequent than Sarah
    for (let i = 0; i < count; i++) {
      const course = courses[Math.floor(Math.random() * courses.length)];
      const hour = 9 + Math.floor(Math.random() * 3); // 9am-11am
      
      events.push({
        id: `learn-${dayOffset}-${i}`,
        userId,
        courseId: course.id,
        source: "tutor",
        durationSecs: 180 + Math.floor(Math.random() * 240), // 3-7 minutes
        outcome: Math.random() > 0.15 ? "completed" : "skipped",
        payload: {
          question: "Can you explain the difference between classical and operant conditioning?",
          materialRefs: [`mat-${course.id}-1`],
        },
        createdAt: new Date(date.setHours(hour, Math.floor(Math.random() * 60))).toISOString(),
      });
    }
  }
  
  return events;
}

