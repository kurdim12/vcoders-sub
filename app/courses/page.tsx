"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { BookOpen, FileText, GraduationCap } from "lucide-react";

export default function CoursesPage() {
  const courses = useStore((state) => state.courses);
  const assignments = useStore((state) => state.assignments);
  const exams = useStore((state) => state.exams);
  const materials = useStore((state) => state.materials);
  const initialized = useStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      useStore.getState().initialize();
    }
  }, [initialized]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Your enrolled courses for this term</p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No courses found. Please sign in first.</p>
              <Link href="/auth/signin" className="text-primary underline mt-4 inline-block">
                Go to Sign In
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const courseAssignments = assignments.filter(
                (a) => a.courseId === course.id
              );
              const courseExams = exams.filter((e) => e.courseId === course.id);
              const courseMaterials = materials.filter(
                (m) => m.courseId === course.id
              );

              return (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{course.code}</CardTitle>
                          <CardDescription className="font-medium">
                            {course.title}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{course.term}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {courseAssignments.length}{" "}
                            {courseAssignments.length === 1
                              ? "assignment"
                              : "assignments"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {courseExams.length}{" "}
                            {courseExams.length === 1 ? "exam" : "exams"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {courseMaterials.length}{" "}
                            {courseMaterials.length === 1
                              ? "material"
                              : "materials"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

