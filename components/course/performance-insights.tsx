"use client";

import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  calculatePerformanceMetrics,
  generateInsights,
  type PerformanceMetrics,
  type PredictionInsight,
} from "@/lib/predictive-analytics";
import { AlertTriangle, TrendingUp, Lightbulb, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export function CoursePerformanceInsights() {
  const { courseId } = useCourse();
  const assignments = useStore((state) =>
    state.assignments.filter((a) => a.courseId === courseId)
  );
  const studyBlocks = useStore((state) =>
    state.studyBlocks.filter((b) => b.courseId === courseId)
  );
  const exams = useStore((state) =>
    state.exams.filter((e) => e.courseId === courseId)
  );
  const learningEvents = useStore((state) =>
    state.learningEvents.filter((e) => e.courseId === courseId)
  );

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [insights, setInsights] = useState<PredictionInsight[]>([]);

  useEffect(() => {
    if (courseId) {
      try {
        const calculatedMetrics = calculatePerformanceMetrics(
          courseId,
          assignments,
          studyBlocks,
          learningEvents
        );
        setMetrics(calculatedMetrics);

        const upcomingExams = exams.filter((e) => {
          if (!e.startAt) return false;
          const startDate = new Date(e.startAt);
          return !isNaN(startDate.getTime()) && startDate > new Date();
        });
        const upcomingAssignments = assignments.filter((a) => {
          if (!a.dueAt || a.status === "submitted") return false;
          const dueDate = new Date(a.dueAt);
          return !isNaN(dueDate.getTime()) && dueDate > new Date();
        });

        const generatedInsights = generateInsights(
          calculatedMetrics,
          upcomingExams,
          upcomingAssignments
        );
        setInsights(generatedInsights);
      } catch (error) {
        console.error("Error calculating performance insights:", error);
        setMetrics(null);
        setInsights([]);
      }
    }
  }, [courseId, assignments, studyBlocks, exams, learningEvents]);

  if (!metrics) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "encouragement":
        return <CheckCircle2 className="h-4 w-4" />;
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Predicted Grade</p>
              <p className="text-2xl font-bold">{metrics.predictedGrade}</p>
              <p className="text-xs text-muted-foreground">
                Confidence: {Math.round(metrics.confidence * 100)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">
                {Math.round(metrics.completionRate * 100)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Hours/Week</p>
              <p className="text-2xl font-bold">
                {metrics.studyHoursPerWeek.toFixed(1)}h
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <Badge variant={getRiskColor(metrics.riskLevel)} className="mt-1">
                {metrics.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Predictive Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    insight.type === "warning"
                      ? "border-destructive/50 bg-destructive/5"
                      : insight.type === "encouragement"
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-blue-500/50 bg-blue-500/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{insight.message}</p>
                      {insight.actionItems.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {insight.actionItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Badge variant="outline">{insight.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
