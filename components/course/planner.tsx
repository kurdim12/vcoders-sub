"use client";

import { useState } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getWeekDates, formatDate, formatTime } from "@/lib/time";
import { generateId } from "@/lib/utils";
import { Loader2, RefreshCw, AlertTriangle, Clock } from "lucide-react";

export function CoursePlanner() {
  const { courseId } = useCourse();
  const [isReplanning, setIsReplanning] = useState(false);
  const studyBlocks = useStore((state) =>
    state.studyBlocks.filter((b) => b.courseId === courseId)
  );
  const updateStudyBlock = useStore((state) => state.updateStudyBlock);
  const addStudyBlock = useStore((state) => state.addStudyBlock);
  const assignments = useStore((state) =>
    state.assignments.filter((a) => a.courseId === courseId)
  );
  const exams = useStore((state) => state.exams.filter((e) => e.courseId === courseId));

  const weekDates = getWeekDates();

  const handleReplan = async () => {
    setIsReplanning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const now = new Date();
    const upcomingAssignments = assignments
      .filter((a) => new Date(a.dueAt) > now && a.status !== "submitted")
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const morning = new Date(date);
      morning.setHours(9, 0, 0, 0);
      const morningEnd = new Date(morning);
      morningEnd.setHours(10, 30, 0, 0);

      const urgentItem = upcomingAssignments[i % upcomingAssignments.length];
      if (urgentItem) {
        addStudyBlock({
          id: generateId(),
          userId: "user-1",
          courseId: courseId!,
          title: `Study for ${urgentItem.title}`,
          startAt: morning.toISOString(),
          endAt: morningEnd.toISOString(),
          status: "planned",
        });
      }
    }

    setIsReplanning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Study Planner</CardTitle>
            <Button onClick={handleReplan} disabled={isReplanning}>
              {isReplanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Replanning...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Auto Rebalance
                </>
              )}
            </Button>
          </div>
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
                    {isToday && <Badge variant="default">Today</Badge>}
                  </div>

                  {blocksForDay.length === 0 ? (
                    <p className="text-sm text-muted-foreground ml-4">No blocks scheduled</p>
                  ) : (
                    <div className="ml-4 space-y-2">
                      {blocksForDay.map((block) => (
                        <div
                          key={block.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{block.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(block.startAt)} - {formatTime(block.endAt)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {block.status}
                          </Badge>
                          {block.status === "planned" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStudyBlock(block.id, { status: "done" })}
                            >
                              Done
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

