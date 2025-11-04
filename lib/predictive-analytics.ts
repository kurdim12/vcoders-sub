// Predictive Performance Analytics
// Analyzes student performance and predicts future outcomes

import type { Assignment, Exam, StudyBlock, Note, LearningEvent } from "./types";

export interface PerformanceMetrics {
  courseId: string;
  averageScore: number;
  completionRate: number;
  studyHoursPerWeek: number;
  assignmentTrend: "improving" | "declining" | "stable";
  riskLevel: "low" | "medium" | "high";
  predictedGrade: string; // A, B, C, D, F
  confidence: number; // 0-1
}

export interface PredictionInsight {
  type: "warning" | "encouragement" | "suggestion";
  message: string;
  actionItems: string[];
  priority: "high" | "medium" | "low";
}

/**
 * Calculate performance metrics for a course
 */
export function calculatePerformanceMetrics(
  courseId: string,
  assignments: Assignment[],
  studyBlocks: StudyBlock[],
  learningEvents: LearningEvent[]
): PerformanceMetrics {
  const courseAssignments = assignments.filter((a) => a.courseId === courseId);
  const courseBlocks = studyBlocks.filter((b) => b.courseId === courseId);
  const courseEvents = learningEvents.filter((e) => e.courseId === courseId);

  // Calculate average score (mock - would need actual scores)
  const completedAssignments = courseAssignments.filter((a) => a.status === "submitted");
  const averageScore = completedAssignments.length > 0 ? 85 : 0; // Placeholder

  // Completion rate
  const completionRate =
    courseAssignments.length > 0
      ? completedAssignments.length / courseAssignments.length
      : 0;

  // Study hours per week
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentBlocks = courseBlocks.filter(
    (b) => new Date(b.startAt) >= lastWeek && b.status === "done"
  );
  const studyHoursPerWeek =
    recentBlocks.reduce((sum, block) => {
      const start = new Date(block.startAt);
      const end = new Date(block.endAt);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0) || 0;

  // Assignment trend (mock - would analyze actual scores over time)
  const assignmentTrend: "improving" | "declining" | "stable" = "stable";

  // Risk level calculation
  let riskLevel: "low" | "medium" | "high" = "low";
  if (completionRate < 0.5) riskLevel = "high";
  else if (completionRate < 0.75 || studyHoursPerWeek < 5) riskLevel = "medium";

  // Predicted grade
  let predictedGrade = "B";
  if (averageScore >= 90 && completionRate >= 0.9) predictedGrade = "A";
  else if (averageScore >= 80 && completionRate >= 0.8) predictedGrade = "B";
  else if (averageScore >= 70 && completionRate >= 0.7) predictedGrade = "C";
  else if (averageScore >= 60 && completionRate >= 0.6) predictedGrade = "D";
  else predictedGrade = "F";

  // Confidence (based on data points)
  const confidence = Math.min(
    1,
    (courseAssignments.length * 0.1 + courseEvents.length * 0.05 + Math.min(studyHoursPerWeek / 10, 1)) / 3
  );

  return {
    courseId,
    averageScore,
    completionRate,
    studyHoursPerWeek,
    assignmentTrend,
    riskLevel,
    predictedGrade,
    confidence,
  };
}

/**
 * Generate predictive insights
 */
export function generateInsights(
  metrics: PerformanceMetrics,
  upcomingExams: Exam[],
  upcomingAssignments: Assignment[]
): PredictionInsight[] {
  const insights: PredictionInsight[] = [];

  // Risk warnings
  if (metrics.riskLevel === "high") {
    insights.push({
      type: "warning",
      message: `Your performance in this course is at risk. Completion rate: ${Math.round(metrics.completionRate * 100)}%`,
      actionItems: [
        "Focus on completing pending assignments",
        "Increase study time to at least 8 hours/week",
        "Consider seeking help from the tutor",
      ],
      priority: "high",
    });
  }

  // Upcoming exams
  if (upcomingExams.length > 0) {
    const nextExam = upcomingExams[0];
    const daysUntilExam = Math.floor(
      (new Date(nextExam.startAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExam < 7 && metrics.studyHoursPerWeek < 5) {
      insights.push({
        type: "warning",
        message: `Exam "${nextExam.title}" is in ${daysUntilExam} days, but study time is low`,
        actionItems: [
          "Increase study sessions this week",
          "Review key concepts from materials",
          "Complete practice problems",
        ],
        priority: "high",
      });
    }
  }

  // Encouragement
  if (metrics.assignmentTrend === "improving" && metrics.completionRate > 0.8) {
    insights.push({
      type: "encouragement",
      message: "Great progress! Your performance is improving.",
      actionItems: ["Keep up the good work!", "Maintain current study habits"],
      priority: "low",
    });
  }

  // Suggestions
  if (metrics.studyHoursPerWeek < 5) {
    insights.push({
      type: "suggestion",
      message: "Consider increasing study time for better performance",
      actionItems: [
        "Aim for at least 5-8 hours per week",
        "Schedule regular study blocks",
        "Use the planner to optimize your schedule",
      ],
      priority: "medium",
    });
  }

  return insights;
}

/**
 * Predict exam readiness
 */
export function predictExamReadiness(
  examId: string,
  courseId: string,
  assignments: Assignment[],
  studyBlocks: StudyBlock[],
  learningEvents: LearningEvent[]
): {
  readiness: number; // 0-1
  rationale: string;
  recommendedActions: string[];
} {
  const metrics = calculatePerformanceMetrics(courseId, assignments, studyBlocks, learningEvents);

  // Calculate readiness score
  let readiness = 0.5; // Base score

  // Adjust based on completion rate
  readiness += metrics.completionRate * 0.3;

  // Adjust based on study hours
  readiness += Math.min(metrics.studyHoursPerWeek / 10, 1) * 0.2;

  // Ensure readiness is between 0 and 1
  readiness = Math.max(0, Math.min(1, readiness));

  let rationale = "";
  if (readiness >= 0.8) {
    rationale = "You are well-prepared for this exam. Keep reviewing key concepts.";
  } else if (readiness >= 0.6) {
    rationale = "You are moderately prepared. Focus on weak areas.";
  } else {
    rationale = "You need more preparation. Consider intensive study sessions.";
  }

  const recommendedActions: string[] = [];
  if (readiness < 0.7) {
    recommendedActions.push("Review all course materials");
    recommendedActions.push("Complete practice problems");
    recommendedActions.push("Schedule additional study blocks");
  }

  return {
    readiness,
    rationale,
    recommendedActions,
  };
}

