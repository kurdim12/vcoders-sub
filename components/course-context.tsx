"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { Course, ID } from "@/lib/types";

interface CourseContextType {
  courseId: ID | null;
  course: Course | null;
  courses: Course[];
  switchCourse: (courseId: ID) => void;
  isLoading: boolean;
}

const CourseContext = createContext<CourseContextType | null>(null);

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
}

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const initialized = useStore((state) => state.initialized);
  const courses = useStore((state) => state.courses);
  const [courseId, setCourseId] = useState<ID | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure store is initialized first
    if (!initialized) {
      useStore.getState().initialize();
      // Wait a bit for initialization
      setTimeout(() => {
        const storeCourses = useStore.getState().courses;
        const id = params?.courseId as ID | undefined;
        
        if (id && storeCourses.some((c) => c.id === id)) {
          setCourseId(id);
          setIsLoading(false);
        } else if (storeCourses.length > 0) {
          // Redirect to first course if no course selected
          const firstCourseId = storeCourses[0].id;
          router.push(`/courses/${firstCourseId}`);
          setCourseId(firstCourseId);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }, 200);
      return;
    }

    // Store is initialized, proceed normally
    const id = params?.courseId as ID | undefined;
    if (id && courses.some((c) => c.id === id)) {
      setCourseId(id);
      setIsLoading(false);
    } else if (courses.length > 0) {
      // Redirect to first course if no course selected
      const firstCourseId = courses[0].id;
      router.push(`/courses/${firstCourseId}`);
      setCourseId(firstCourseId);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [params, courses, router, initialized]);

  const course = courseId ? courses.find((c) => c.id === courseId) || null : null;

  const switchCourse = (newCourseId: ID) => {
    setCourseId(newCourseId);
    router.push(`/courses/${newCourseId}`);
  };

  return (
    <CourseContext.Provider
      value={{
        courseId,
        course,
        courses,
        switchCourse,
        isLoading,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

