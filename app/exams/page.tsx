"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatDateTime, isUpcoming } from "@/lib/time";
import { Clock, Play, FileText, Plus } from "lucide-react";

export default function ExamsPage() {
  const exams = useStore((state) => state.exams);
  const courses = useStore((state) => state.courses);

  const upcomingExams = exams.filter((e) => isUpcoming(e.startAt, 168)); // Next week
  const pastExams = exams.filter((e) => !isUpcoming(e.startAt, 168));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Exams</h1>
            <p className="text-muted-foreground">
              View and prepare for your exams
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Exam (Demo)
          </Button>
        </div>

        {/* Upcoming Exams */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Upcoming Exams</h2>
          {upcomingExams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No upcoming exams</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingExams.map((exam) => {
                const course = courses.find((c) => c.id === exam.courseId);
                return (
                  <Card key={exam.id} className="border-2 border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{exam.title}</CardTitle>
                          <CardDescription>
                            {course?.code} - {course?.title}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="default"
                          className="text-xs capitalize"
                        >
                          {exam.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDateTime(exam.startAt)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Duration:{" "}
                          {Math.round(
                            (new Date(exam.endAt).getTime() -
                              new Date(exam.startAt).getTime()) /
                              (1000 * 60)
                          )}{" "}
                          minutes
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Play className="mr-2 h-4 w-4" />
                          Start Mock Exam
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Study Guide
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Exams */}
        {pastExams.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Past Exams</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastExams.map((exam) => {
                const course = courses.find((c) => c.id === exam.courseId);
                return (
                  <Card key={exam.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{exam.title}</CardTitle>
                          <CardDescription>{course?.code}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {exam.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(exam.startAt)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Study Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Preparation Tools</CardTitle>
            <CardDescription>
              Use these tools to prepare for your exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Play className="w-6 h-6" />
                <span className="text-sm">Practice Tests</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span className="text-sm">Formula Sheets</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Clock className="w-6 h-6" />
                <span className="text-sm">Study Schedule</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{exams.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                {upcomingExams.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {pastExams.length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

