"use client";

import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, TrendingUp, Calendar, Award, FileText, StickyNote, GraduationCap, CheckCircle2 } from "lucide-react";
import { formatRelative } from "@/lib/time";
import { AutoActionsPanel } from "@/components/auto-actions-panel";
import { useXP } from "@/lib/hooks/xp";

export function CourseOverview() {
  const { courseId } = useCourse();
  const assignments = useStore((state) =>
    state.assignments.filter((a) => a.courseId === courseId)
  );
  const exams = useStore((state) =>
    state.exams.filter((e) => e.courseId === courseId)
  );
  const studyBlocks = useStore((state) =>
    state.studyBlocks.filter((b) => b.courseId === courseId)
  );
  const user = useStore((state) => state.getCurrentUser());

  const { totalXP, currentStreak } = useXP(user?.id || "", courseId || "");

  const today = new Date();
  const todayBlocks = studyBlocks.filter((block) => {
    if (!block.startAt) return false;
    const blockDate = new Date(block.startAt);
    return !isNaN(blockDate.getTime()) && blockDate.toDateString() === today.toDateString();
  });

  const dueThisWeek = assignments.filter((a) => {
    if (!a.dueAt || a.status === "submitted") return false;
    const dueDate = new Date(a.dueAt);
    if (isNaN(dueDate.getTime())) return false;
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return dueDate <= weekFromNow;
  });

  const nextExam = exams
    .filter((e) => {
      if (!e.startAt) return false;
      const startDate = new Date(e.startAt);
      return !isNaN(startDate.getTime()) && startDate > today;
    })
    .sort((a, b) => {
      const dateA = a.startAt ? new Date(a.startAt).getTime() : 0;
      const dateB = b.startAt ? new Date(b.startAt).getTime() : 0;
      return dateA - dateB;
    })[0];

  const materials = useStore((state) =>
    state.materials.filter((m) => m.courseId === courseId)
  );

  return (
    <div className="space-y-6">
      {/* Auto Actions Panel */}
      <AutoActionsPanel />
      {/* Progress Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium">XP Earned</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalXP}</div>
            <p className="text-xs text-muted-foreground mt-1">Total points</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentStreak} 🔥</div>
            <p className="text-xs text-muted-foreground mt-1">Days active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dueThisWeek.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dueThisWeek.length === 0 ? "All caught up!" : "Due this week"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium">Materials</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Due This Week */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Due This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dueThisWeek.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">All caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dueThisWeek.slice(0, 5).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-orange-950/30 dark:to-orange-950/10 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due {formatRelative(assignment.dueAt)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize ml-2">
                        {assignment.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Exam */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-red-500" />
              Next Exam
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextExam ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="font-medium text-sm">{nextExam.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelative(nextExam.startAt)}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs capitalize">
                    {nextExam.type}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming exams</p>
            )}
          </CardContent>
        </Card>

        {/* Today's Blocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayBlocks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No study blocks today</p>
            ) : (
              <div className="space-y-3">
                {todayBlocks.map((block) => (
                  <div key={block.id} className="p-3 rounded-lg bg-accent/50">
                    <p className="font-medium text-sm">{block.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {block.startAt && !isNaN(new Date(block.startAt).getTime())
                        ? new Date(block.startAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Invalid"}{" "}
                      -{" "}
                      {block.endAt && !isNaN(new Date(block.endAt).getTime())
                        ? new Date(block.endAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Invalid"}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs capitalize">
                      {block.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-20 flex flex-col gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Add Material</span>
              </Button>
              <Button variant="outline" size="sm" className="h-20 flex flex-col gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-xs">New Assignment</span>
              </Button>
              <Button variant="outline" size="sm" className="h-20 flex flex-col gap-2">
                <StickyNote className="w-5 h-5" />
                <span className="text-xs">New Note</span>
              </Button>
              <Button variant="outline" size="sm" className="h-20 flex flex-col gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Schedule Study</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

