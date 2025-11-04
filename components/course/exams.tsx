"use client";

import { useState } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Plus } from "lucide-react";
import { formatRelative } from "@/lib/time";
import { QuickActionsDrawer } from "./quick-actions-drawer";

export function CourseExams() {
  const { courseId } = useCourse();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const exams = useStore((state) => state.exams.filter((e) => e.courseId === courseId));

  const now = new Date();
  const upcoming = exams.filter((e) => new Date(e.startAt) > now);
  const past = exams.filter((e) => new Date(e.startAt) <= now);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exams</CardTitle>
            <Button onClick={() => setDrawerOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcoming.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Upcoming</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {upcoming.map((exam) => (
                  <Card key={exam.id} className="border-2 border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{exam.title}</CardTitle>
                          <CardContent className="p-0 mt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{formatRelative(exam.startAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {Math.round(
                                  (new Date(exam.endAt).getTime() -
                                    new Date(exam.startAt).getTime()) /
                                    (1000 * 60)
                                )}{" "}
                                minutes
                              </span>
                            </div>
                          </CardContent>
                        </div>
                        <Badge variant="default" className="text-xs capitalize">
                          {exam.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Create Cram Plan
                        </Button>
                        <Button size="sm" variant="outline">
                          Study Guide
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Past Exams</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {past.map((exam) => (
                  <Card key={exam.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{exam.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatRelative(exam.startAt)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {exam.type}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {exams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No exams scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>
      <QuickActionsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

