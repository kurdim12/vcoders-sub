import type { ID, CourseAnalytics } from "../types";
import { useStore } from "../store";

// Analytics Rollup - aggregates learning events and study blocks for a date
export function rollupAnalytics(
  userId: ID,
  courseId: ID,
  date: string // YYYY-MM-DD format
): CourseAnalytics {
  const store = useStore.getState();
  
  const startOfDay = `${date}T00:00:00Z`;
  const endOfDay = `${date}T23:59:59Z`;
  
  // Get learning events for this date
  const learningEvents = store.learningEvents.filter(
    (e) =>
      e.userId === userId &&
      e.courseId === courseId &&
      e.createdAt >= startOfDay &&
      e.createdAt <= endOfDay
  );
  
  // Calculate minutes studied from learning events
  const totalSeconds = learningEvents.reduce(
    (sum, e) => sum + e.durationSecs,
    0
  );
  const minutesStudied = Math.round(totalSeconds / 60);
  
  // Get study blocks done for this date (use startAt/endAt to determine completion date)
  const blocksDone = store.studyBlocks.filter(
    (b) =>
      b.userId === userId &&
      b.courseId === courseId &&
      b.status === "done" &&
      b.startAt >= startOfDay &&
      b.startAt <= endOfDay
  ).length;
  
  // Naive retention calculation (based on study time)
  const retentionPct = Math.min(95, Math.round((minutesStudied / 90) * 100));
  
  // Calculate best hour (hour with most learning events)
  const hourCounts = new Map<number, number>();
  learningEvents.forEach((e) => {
    const hour = new Date(e.createdAt).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });
  
  let bestHour = 20; // Default to 8 PM
  let maxCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > maxCount) {
      maxCount = count;
      bestHour = hour;
    }
  });
  
  const analytics: CourseAnalytics = {
    id: `analytics-${userId}-${courseId}-${date}`,
    userId,
    courseId,
    date,
    minutesStudied,
    blocksDone,
    retentionPct,
    bestHour: maxCount > 0 ? bestHour : undefined,
    createdAt: new Date().toISOString(),
  };
  
  // Store analytics
  store.addCourseAnalytics(analytics);
  
  return analytics;
}

// Predict Performance - calculates readiness for an exam/assignment
export function predictPerformance(
  userId: ID,
  courseId: ID,
  targetId: ID,
  scope: "exam" | "assignment" = "exam"
): { readiness: number; rationale: string } {
  const store = useStore.getState();
  
  // Get last 14 days of analytics
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  
  const recentAnalytics = store.courseAnalytics
    .filter(
      (a) =>
        a.userId === userId &&
        a.courseId === courseId &&
        new Date(a.date) >= fourteenDaysAgo
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (recentAnalytics.length === 0) {
    return {
      readiness: 0.5,
      rationale: "No recent study data available",
    };
  }
  
  // Calculate moving average
  const avgMinutes =
    recentAnalytics.reduce((sum, a) => sum + a.minutesStudied, 0) /
    recentAnalytics.length;
  
  const avgBlocks =
    recentAnalytics.reduce((sum, a) => sum + a.blocksDone, 0) /
    recentAnalytics.length;
  
  // Readiness calculation (0-1 scale)
  const readiness = Math.max(
    0,
    Math.min(1, (avgMinutes / 60) * 0.6 + (avgBlocks / 3) * 0.4)
  );
  
  const rationale = `Based on ${recentAnalytics.length} days: ${avgMinutes.toFixed(
    1
  )} min/day avg, ${avgBlocks.toFixed(1)} blocks/day avg`;
  
  // Store prediction
  const prediction = {
    id: `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    courseId,
    scope,
    targetId,
    readiness,
    rationale,
    createdAt: new Date().toISOString(),
  };
  
  store.addPrediction(prediction);
  
  return { readiness, rationale };
}

