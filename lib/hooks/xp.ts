import type { ID, XPEventKind, LearningEventSource, LearningEventOutcome } from "../types";
import { useStore } from "../store";

// XP Awarding Hook
export async function awardXP(
  userId: ID,
  courseId: ID,
  kind: XPEventKind,
  xp: number = 10,
  meta: Record<string, any> = {}
) {
  const store = useStore.getState();
  
  const event = {
    id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    courseId,
    kind,
    xp,
    meta,
    createdAt: new Date().toISOString(),
  };
  
  store.addXPEvent(event);
  return event;
}

// Learning Event Logging Hook
export async function logLearningEvent(
  userId: ID,
  courseId: ID,
  source: LearningEventSource,
  payload: Record<string, any> = {},
  durationSecs: number = 0,
  outcome?: LearningEventOutcome,
  materialId?: ID
) {
  const store = useStore.getState();
  
  const event = {
    id: `le-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    courseId,
    source,
    materialId,
    durationSecs,
    outcome,
    payload,
    createdAt: new Date().toISOString(),
  };
  
  store.addLearningEvent(event);
  return event;
}

// Get XP Summary
export function getXPSummary(userId: ID, courseId: ID) {
  const store = useStore.getState();
  
  const events = store.xpEvents.filter(
    (e) => e.userId === userId && e.courseId === courseId
  );
  
  // Sum XP from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentEvents = events.filter(
    (e) => new Date(e.createdAt) >= thirtyDaysAgo
  );
  
  const totalXP = recentEvents.reduce((sum, e) => sum + e.xp, 0);
  
  // Calculate streak (consecutive days with XP > 0)
  const dailyXP = new Map<string, number>();
  recentEvents.forEach((e) => {
    const date = e.createdAt.split("T")[0];
    dailyXP.set(date, (dailyXP.get(date) || 0) + e.xp);
  });
  
  const dates = Array.from(dailyXP.keys()).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  
  // Check if today has XP
  if (dailyXP.has(today) || dailyXP.has(yesterday)) {
    streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const currentDate = new Date(dates[i]);
      const prevDate = new Date(dates[i + 1]);
      const diffDays = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  return {
    totalXP,
    streak: Math.max(streak, 0),
    eventsCount: recentEvents.length,
  };
}

// React Hook for XP
export function useXP(userId: ID, courseId: ID) {
  const store = useStore();
  const xpEvents = store.xpEvents.filter(
    (e) => e.userId === userId && e.courseId === courseId
  );
  
  const summary = getXPSummary(userId, courseId);
  
  return {
    totalXP: summary.totalXP,
    currentStreak: summary.streak,
    eventsCount: summary.eventsCount,
    recentEvents: xpEvents.slice(-10),
  };
}

