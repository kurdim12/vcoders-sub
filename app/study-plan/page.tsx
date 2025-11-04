"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { getWeekDates, formatDate, formatTime } from "@/lib/time";
import { generateId } from "@/lib/utils";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";

export default function StudyPlanPage() {
  const [isReplanning, setIsReplanning] = useState(false);
  const studyBlocks = useStore((state) => state.studyBlocks);
  const courses = useStore((state) => state.courses);
  const assignments = useStore((state) => state.assignments);
  const exams = useStore((state) => state.exams);
  const updateStudyBlock = useStore((state) => state.updateStudyBlock);
  const addStudyBlock = useStore((state) => state.addStudyBlock);

  const weekDates = getWeekDates();

  const handleReplan = async () => {
    setIsReplanning(true);

    // Simulate AI replanning
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simple replanning logic: distribute study time based on due dates
    const now = new Date();
    const upcomingAssignments = assignments
      .filter((a) => new Date(a.dueAt) > now && a.status !== "submitted")
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

    const upcomingExams = exams
      .filter((e) => new Date(e.startAt) > now)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    // Clear future blocks (keep today's)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add study blocks for next 3 days
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      // Morning block
      const morning = new Date(date);
      morning.setHours(9, 0, 0, 0);
      const morningEnd = new Date(morning);
      morningEnd.setHours(10, 30, 0, 0);

      // Afternoon block
      const afternoon = new Date(date);
      afternoon.setHours(14, 0, 0, 0);
      const afternoonEnd = new Date(afternoon);
      afternoonEnd.setHours(15, 30, 0, 0);

      // Assign to urgent items
      const urgentItem = upcomingAssignments[i % upcomingAssignments.length] || upcomingExams[0];
      if (urgentItem) {
        const course = courses.find((c) => c.id === urgentItem.courseId);
        if (course) {
          addStudyBlock({
            id: generateId(),
            userId: "user-1",
            courseId: course.id,
            title: `${course.code} - ${urgentItem.title}`,
            startAt: morning.toISOString(),
            endAt: morningEnd.toISOString(),
            status: "planned",
          });
        }
      }
    }

    setIsReplanning(false);
  };

  // Detect conflicts
  const conflicts = studyBlocks.filter((block, idx) => {
    return studyBlocks.some((other, otherIdx) => {
      if (idx >= otherIdx) return false;
      const blockStart = new Date(block.startAt);
      const blockEnd = new Date(block.endAt);
      const otherStart = new Date(other.startAt);
      const otherEnd = new Date(other.endAt);

      return (
        (blockStart >= otherStart && blockStart < otherEnd) ||
        (blockEnd > otherStart && blockEnd <= otherEnd) ||
        (blockStart <= otherStart && blockEnd >= otherEnd)
      );
    });
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Study Plan</h1>
            <p className="text-muted-foreground">
              Your weekly study schedule and planning
            </p>
          </div>
          <Button onClick={handleReplan} disabled={isReplanning}>
            {isReplanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Replanning...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Replan with AI
              </>
            )}
          </Button>
        </div>

        {/* Conflicts Warning */}
        {conflicts.length > 0 && (
          <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <AlertTriangle className="w-5 h-5" />
                Schedule Conflicts Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-600 dark:text-orange-300">
                You have {conflicts.length} overlapping study blocks. Consider
                replanning your schedule.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Week Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekDates.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                const blocksForDay = studyBlocks.filter((block) => {
                  const blockDate = new Date(block.startAt);
                  return blockDate.toISOString().split("T")[0] === dateStr;
                });

                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div key={dateStr} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      {isToday && (
                        <Badge variant="default" className="text-xs">
                          Today
                        </Badge>
                      )}
                    </div>

                    {blocksForDay.length === 0 ? (
                      <p className="text-sm text-muted-foreground ml-4">
                        No study blocks scheduled
                      </p>
                    ) : (
                      <div className="ml-4 space-y-2">
                        {blocksForDay.map((block) => {
                          const course = courses.find(
                            (c) => c.id === block.courseId
                          );
                          return (
                            <div
                              key={block.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">
                                    {block.title}
                                  </p>
                                  <Badge
                                    variant={
                                      block.status === "done"
                                        ? "default"
                                        : block.status === "missed"
                                        ? "destructive"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {block.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(block.startAt)} -{" "}
                                    {formatTime(block.endAt)}
                                  </p>
                                  {course && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {course.code}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {block.status === "planned" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        updateStudyBlock(block.id, {
                                          status: "done",
                                        })
                                      }
                                    >
                                      Mark Done
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        updateStudyBlock(block.id, {
                                          status: "missed",
                                        })
                                      }
                                    >
                                      Missed
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Study Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Hours This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {studyBlocks
                  .filter((b) => {
                    const blockDate = new Date(b.startAt);
                    return weekDates.some(
                      (d) =>
                        d.toISOString().split("T")[0] ===
                        blockDate.toISOString().split("T")[0]
                    );
                  })
                  .reduce((acc, block) => {
                    const start = new Date(block.startAt);
                    const end = new Date(block.endAt);
                    return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  }, 0)
                  .toFixed(1)}
                h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completed Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {studyBlocks.filter((b) => b.status === "done").length} /{" "}
                {studyBlocks.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Missed Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                {studyBlocks.filter((b) => b.status === "missed").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

