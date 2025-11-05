"use client";

import { useCourse } from "@/components/course-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { importSnapshot } from "@/lib/storage";
import { downloadCalendar } from "@/lib/calendar-export";
import { CoursePerformanceInsights } from "./performance-insights";
import { useToast } from "@/components/ui/use-toast";

export function CourseSettings() {
  const { course, courseId } = useCourse();
  const { exportData, importData, resetData } = useStore();
  const { toast } = useToast();
  
  const studyBlocks = useStore((state) =>
    state.studyBlocks.filter((b) => b.courseId === courseId)
  );
  const assignments = useStore((state) =>
    state.assignments.filter((a) => a.courseId === courseId)
  );
  const exams = useStore((state) =>
    state.exams.filter((e) => e.courseId === courseId)
  );

  const handleExport = () => {
    exportData();
  };

  const handleExportCalendar = () => {
    downloadCalendar(
      studyBlocks,
      assignments,
      exams,
      `${course?.code || "course"}-calendar.ics`
    );
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const snapshot = await importSnapshot(file);
          importData(snapshot);
          toast({
            title: "Success",
            description: "Course data imported successfully!",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to import: " + (error as Error).message,
            variant: "destructive",
          });
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input id="code" value={course?.code || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={course?.title || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Term</Label>
            <Input id="term" value={course?.term || ""} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendar Export</CardTitle>
          <CardDescription>Export your study schedule to your calendar app</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportCalendar} className="w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Export Calendar (.ics)
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Includes study blocks, assignments, and exams. Compatible with Google Calendar, Outlook, and Apple Calendar.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage course-specific reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Assignment Due Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified 24 hours before due</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Exam Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified 3 days before exam</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or import course data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Course
            </Button>
            <Button variant="outline" onClick={handleImport} className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Import Course
            </Button>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Export includes all materials, assignments, notes, exams, and study blocks for this
              course.
            </p>
          </div>
        </CardContent>
      </Card>

      <CoursePerformanceInsights />
    </div>
  );
}

