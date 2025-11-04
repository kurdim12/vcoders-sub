// Analytics Generator
// Generates 30 days of analytics data for courses

import type { CourseAnalytics } from "@/lib/types";

interface Course {
  id: string;
  code: string;
  title: string;
}

// Analytics Generator - FEATURE-FIRST APPROACH
// Creates impressive analytics data with clear trends

export function generateCSAnalytics(courses: Course[], userId: string, now: Date): CourseAnalytics[] {
  const analytics: CourseAnalytics[] = [];
  
  // Generate 30 days of data with clear upward trend
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    const weekNumber = Math.floor((30 + dayOffset) / 7); // Week 0-4
    
    courses.forEach((course, courseIdx) => {
      // === SHOW CLEAR UPWARD TREND ===
      // Week 1: 2.5 hrs/day avg
      // Week 2: 3.2 hrs/day avg
      // Week 3: 4.1 hrs/day avg
      // Week 4: 4.8 hrs/day avg
      // Week 5: 5.2 hrs/day avg
      
      const baseMinutes = [150, 192, 246, 288, 312][weekNumber] || 312; // Increasing trend
      const dailyVariation = Math.floor(Math.random() * 60) - 30; // ±30 minutes variation
      
      // Study days: every 2-3 days, more frequent in later weeks
      const studyFrequency = weekNumber < 2 ? 0.33 : weekNumber < 3 ? 0.4 : 0.5; // More study days over time
      const isStudyDay = Math.random() < studyFrequency || dayOffset % 2 === 0;
      
      const minutesStudied = isStudyDay ? Math.max(60, baseMinutes + dailyVariation) : 0;
      const blocksDone = minutesStudied > 0 ? 1 : 0;
      
      // Retention improves over time (58% → 85%)
      const retentionPct = 58 + (weekNumber * 7) + Math.floor(Math.random() * 8); // Improving retention
      
      // Night owl pattern: peak hours 8pm-11pm
      const bestHour = 20 + Math.floor(Math.random() * 4); // 8pm-11pm
      
      analytics.push({
        id: `analytics-${course.id}-${dayOffset}`,
        userId,
        courseId: course.id,
        date: date.toISOString().split("T")[0],
        minutesStudied,
        blocksDone,
        retentionPct: Math.min(95, retentionPct), // Cap at 95%
        bestHour,
        createdAt: date.toISOString(),
      });
    });
  }
  
  return analytics;
}

export function generateBusinessAnalytics(courses: Course[], userId: string, now: Date): CourseAnalytics[] {
  const analytics: CourseAnalytics[] = [];
  
  // Generate 30 days with morning studier pattern
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    const weekNumber = Math.floor((30 + dayOffset) / 7);
    
    courses.forEach((course) => {
      // Morning person: more consistent, moderate hours
      const baseMinutes = [135, 162, 180, 195, 210][weekNumber] || 210; // Steady improvement
      const dailyVariation = Math.floor(Math.random() * 40) - 20;
      
      // More consistent study pattern (every other day)
      const isStudyDay = dayOffset % 2 === 0 || Math.random() < 0.4;
      
      const minutesStudied = isStudyDay ? Math.max(60, baseMinutes + dailyVariation) : 0;
      const blocksDone = minutesStudied > 0 ? 1 : 0;
      
      // Retention: 70% → 85% (improving)
      const retentionPct = 70 + (weekNumber * 4) + Math.floor(Math.random() * 6);
      
      // Morning person: peak hours 9am-11am
      const bestHour = 9 + Math.floor(Math.random() * 3);
      
      analytics.push({
        id: `analytics-${course.id}-${dayOffset}`,
        userId,
        courseId: course.id,
        date: date.toISOString().split("T")[0],
        minutesStudied,
        blocksDone,
        retentionPct: Math.min(92, retentionPct),
        bestHour,
        createdAt: date.toISOString(),
      });
    });
  }
  
  return analytics;
}

