"use client";

import { useState } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  Calendar,
  MessageSquare,
  StickyNote,
  GraduationCap,
  BarChart3,
  Settings,
  Search,
  Plus,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { CourseOverview } from "./course/overview";
import { CourseMaterials } from "./course/materials";
import { CourseAssignments } from "./course/assignments";
import { CoursePlanner } from "./course/planner";
import { CourseTutor } from "./course/tutor";
import { CourseAgents } from "./course/agents";
import { CourseNotes } from "./course/notes";
import { CourseExams } from "./course/exams";
import { CourseAnalytics } from "./course/analytics";
import { CourseSettings } from "./course/settings";
import { CourseFlashcards } from "./course/flashcards";
import { QuickActionsDrawer } from "./course/quick-actions-drawer";

export function CourseLayout() {
  const { course, courses, switchCourse, isLoading } = useCourse();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useStore((state) => state.getCurrentUser());

  // Authentication check - handled by page component

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Course Switcher */}
      <div className="w-72 border-r bg-card/50 backdrop-blur-sm flex flex-col shadow-sm">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold">Courses</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredCourses.map((c) => (
            <button
              key={c.id}
              onClick={() => switchCourse(c.id)}
              className={`w-full text-left p-2.5 rounded-lg transition-all ${
                c.id === course.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${c.id === course.id ? "text-primary-foreground" : ""}`}>
                    {c.code}
                  </p>
                  <p
                    className={`text-xs mt-0.5 truncate ${
                      c.id === course.id ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {c.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-border/50">
          <Button className="w-full h-9 text-sm" onClick={() => setDrawerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Course Header */}
        <div className="border-b bg-card/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight">{course.code}</h1>
                {course.term && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {course.term}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{course.title}</p>
            </div>
            <Button onClick={() => setDrawerOpen(true)} size="default" className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-card/50 backdrop-blur-sm px-4 sticky top-0 z-10">
            <TabsList className="h-auto bg-transparent p-1 gap-1">
              <TabsTrigger
                value="overview"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <FileText className="w-3.5 h-3.5" />
                Materials
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <FileText className="w-3.5 h-3.5" />
                Assignments
              </TabsTrigger>
              <TabsTrigger
                value="planner"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <Calendar className="w-3.5 h-3.5" />
                Planner
              </TabsTrigger>
              <TabsTrigger
                value="tutor"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Tutor
              </TabsTrigger>
              <TabsTrigger
                value="agents"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Agents
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <StickyNote className="w-3.5 h-3.5" />
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="flashcards"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Flashcards
              </TabsTrigger>
              <TabsTrigger
                value="exams"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Exams
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 bg-background">
            <TabsContent value="overview" className="mt-0">
              <CourseOverview />
            </TabsContent>
            <TabsContent value="materials" className="mt-0">
              <CourseMaterials />
            </TabsContent>
            <TabsContent value="assignments" className="mt-0">
              <CourseAssignments />
            </TabsContent>
            <TabsContent value="planner" className="mt-0">
              <CoursePlanner />
            </TabsContent>
            <TabsContent value="tutor" className="mt-0">
              <CourseTutor />
            </TabsContent>
            <TabsContent value="agents" className="mt-0">
              <CourseAgents />
            </TabsContent>
            <TabsContent value="notes" className="mt-0">
              <CourseNotes />
            </TabsContent>
            <TabsContent value="flashcards" className="mt-0">
              <CourseFlashcards />
            </TabsContent>
            <TabsContent value="exams" className="mt-0">
              <CourseExams />
            </TabsContent>
            <TabsContent value="analytics" className="mt-0">
              <CourseAnalytics />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <CourseSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Quick Actions Drawer */}
      <QuickActionsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

