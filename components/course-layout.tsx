"use client";

import { useState, useEffect } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { useSearchParams, useRouter } from "next/navigation";
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
  Menu,
  X,
  ChevronLeft,
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
import { cn } from "@/lib/utils";

export function CourseLayout() {
  const { course, courses, switchCourse, isLoading } = useCourse();
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = useStore((state) => state.getCurrentUser());

  // Sync tab with URL
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Course Switcher */}
      <div
        className={cn(
          "border-r bg-card/50 backdrop-blur-sm flex flex-col shadow-sm transition-transform duration-300 ease-in-out z-50",
          "fixed lg:static inset-y-0 left-0",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
          "w-72 lg:w-72"
        )}
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Courses</h2>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm min-h-[44px]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto touch-scroll p-2 space-y-1">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No courses found
            </div>
          ) : (
            filteredCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  switchCourse(c.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all min-h-[44px]",
                  c.id === course.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-accent/50 active:bg-accent"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium text-sm truncate",
                        c.id === course.id ? "text-primary-foreground" : ""
                      )}
                    >
                      {c.code}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5 truncate",
                        c.id === course.id
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}
                    >
                      {c.title}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t border-border/50">
          <Button
            className="w-full h-10 text-sm min-h-[44px]"
            onClick={() => {
              setDrawerOpen(true);
              if (isMobile) setSidebarOpen(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Course Header */}
        <div className="border-b bg-card/80 backdrop-blur-sm p-4 md:p-5 shadow-sm safe-top">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="h-9 w-9 shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
                    {course.code}
                  </h1>
                  {course.term && (
                    <Badge variant="secondary" className="text-xs font-medium shrink-0">
                      {course.term}
                    </Badge>
                  )}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {course.title}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setDrawerOpen(true)}
              size="default"
              className="shadow-sm shrink-0 min-h-[44px] hidden sm:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Quick Add</span>
            </Button>
            <Button
              onClick={() => setDrawerOpen(true)}
              size="icon"
              className="shadow-sm shrink-0 h-9 w-9 sm:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-card/50 backdrop-blur-sm px-3 md:px-4 sticky top-0 z-10 safe-top">
            <TabsList className="h-auto bg-transparent p-1 gap-1 overflow-x-auto touch-scroll no-scrollbar">
              <TabsTrigger
                value="overview"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Materials</span>
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Assignments</span>
              </TabsTrigger>
              <TabsTrigger
                value="planner"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Planner</span>
              </TabsTrigger>
              <TabsTrigger
                value="tutor"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Tutor</span>
              </TabsTrigger>
              <TabsTrigger
                value="agents"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <StickyNote className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger
                value="flashcards"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Cards</span>
              </TabsTrigger>
              <TabsTrigger
                value="exams"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Exams</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="gap-1.5 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md shrink-0 min-h-[44px]"
              >
                <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto touch-scroll p-4 md:p-5 bg-background safe-bottom">
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