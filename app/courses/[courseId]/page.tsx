"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CourseLayout } from "@/components/course-layout";
import { CourseProvider } from "@/components/course-context";
import { useStore } from "@/lib/store";

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUser = useStore((state) => state.getCurrentUser());
  const initialized = useStore((state) => state.initialized);
  const courses = useStore((state) => state.courses);

  useEffect(() => {
    try {
      // Ensure store is initialized
      if (!initialized) {
        useStore.getState().initialize();
      }
      
      // Wait for store to initialize and check for user/courses
      const checkAuth = setTimeout(() => {
        try {
          const store = useStore.getState();
          const user = store.getCurrentUser();
          const storeCourses = store.courses;
          
          if (!user) {
            router.push("/auth/signin");
            return;
          }
          
          if (storeCourses.length === 0) {
            setTimeout(() => {
              const updatedCourses = useStore.getState().courses;
              if (updatedCourses.length > 0) {
                setIsChecking(false);
              } else {
                setError("No courses found. Please sign in first.");
                setIsChecking(false);
              }
            }, 300);
          } else {
            setIsChecking(false);
          }
        } catch (err) {
          console.error("Error in checkAuth:", err);
          setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
          setIsChecking(false);
        }
      }, 200);

      return () => clearTimeout(checkAuth);
    } catch (err) {
      console.error("Error in useEffect:", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setIsChecking(false);
    }
  }, [initialized, router, params]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isChecking || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
          <p className="text-xs text-muted-foreground">
            {currentUser ? "Loading course..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <CourseProvider>
      <CourseLayout />
    </CourseProvider>
  );
}
