// Assignments Generator - FEATURE-FIRST APPROACH
// Creates assignments showing progression and improvement

import type { Assignment } from "@/lib/types";

interface Course {
  id: string;
  code: string;
  title: string;
}

export function generateCSAssignments(courses: Course[], userId: string, now: Date): Assignment[] {
  const assignments: Assignment[] = [];
  
  courses.forEach((course, courseIdx) => {
    // === COMPLETED ASSIGNMENTS (showing improvement) ===
    
    // Assignment 1: Early assignment, lower grade (learning curve)
    const hw1Due = new Date(now);
    hw1Due.setDate(hw1Due.getDate() - 21); // 3 weeks ago
    
    assignments.push({
      id: `assign-${course.id}-1`,
      courseId: course.id,
      title: `HW1: ${course.code === "CS101" ? "Python Basics" : course.code === "CS201" ? "Array Operations" : "Introduction"}`,
      description: course.code === "CS101" 
        ? "Practice with Python variables, data types, and basic operations. Write 5 functions demonstrating different concepts."
        : "Introduction to course concepts and fundamentals.",
      dueAt: hw1Due.toISOString(),
      status: "submitted",
      priority: "medium",
      grade: 78,
      feedback: "Good start! Review loops and function syntax. Make sure to test edge cases.",
      timeSpent: 4 * 60, // 4 hours in minutes
      submittedAt: new Date(hw1Due.getTime() - 2 * 60 * 60 * 1000).toISOString(), // Submitted 2 hours before due
    });
    
    // Assignment 2: Improvement visible
    const hw2Due = new Date(now);
    hw2Due.setDate(hw2Due.getDate() - 14); // 2 weeks ago
    
    assignments.push({
      id: `assign-${course.id}-2`,
      courseId: course.id,
      title: `HW2: ${course.code === "CS101" ? "Control Flow & Functions" : course.code === "CS201" ? "Linked Lists" : "Advanced Topics"}`,
      description: course.code === "CS101"
        ? "Implement functions using loops, conditionals, and error handling. Include unit tests."
        : "Apply learned concepts to more complex problems.",
      dueAt: hw2Due.toISOString(),
      status: "submitted",
      priority: "high",
      grade: 85,
      feedback: "Much better! Your code structure improved. Watch out for edge cases and add more comments.",
      timeSpent: 5 * 60, // 5 hours
      submittedAt: new Date(hw2Due.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    });
    
    // Assignment 3: Strong performance
    const hw3Due = new Date(now);
    hw3Due.setDate(hw3Due.getDate() - 7); // 1 week ago
    
    assignments.push({
      id: `assign-${course.id}-3`,
      courseId: course.id,
      title: `HW3: ${course.code === "CS101" ? "List Comprehensions & Data Structures" : course.code === "CS201" ? "Binary Trees" : "Problem Solving"}`,
      description: course.code === "CS101"
        ? "Use list comprehensions, dictionaries, and tuples. Optimize code for performance."
        : "Apply advanced data structures to solve problems.",
      dueAt: hw3Due.toISOString(),
      status: "submitted",
      priority: "high",
      grade: 92,
      feedback: "Excellent work! Your code is clean and well-optimized. Great job on the optimization section.",
      timeSpent: 3.5 * 60, // 3.5 hours (getting faster!)
      submittedAt: new Date(hw3Due.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    });
    
    // === IN PROGRESS (perfect for demo) ===
    
    // Assignment 4: Due soon, in progress
    const hw4Due = new Date(now);
    hw4Due.setDate(hw4Due.getDate() + 1); // Tomorrow
    
    assignments.push({
      id: `assign-${course.id}-4`,
      courseId: course.id,
      title: `HW4: ${course.code === "CS101" ? "Recursive Fibonacci Implementation" : course.code === "CS201" ? "Graph Algorithms" : "Advanced Concepts"}`,
      description: course.code === "CS101"
        ? "Implement Fibonacci using recursion. Compare performance with iterative approach. Must include: recursive function, iterative function, timing comparison, analysis of time complexity."
        : "Implement and analyze graph traversal algorithms.",
      dueAt: hw4Due.toISOString(),
      status: "in_progress",
      priority: "urgent",
      progress: 60,
      estimatedTimeRemaining: 2 * 60, // 2 hours
      checklist: [
        { id: "1", text: "Recursive function implemented", completed: true },
        { id: "2", text: "Iterative function implemented", completed: true },
        { id: "3", text: "Timing comparison", completed: false },
        { id: "4", text: "Complexity analysis", completed: false },
      ],
      timeSpent: 3 * 60, // Already spent 3 hours
    });
    
    // === UPCOMING ===
    
    // Assignment 5: Due in 5 days
    const hw5Due = new Date(now);
    hw5Due.setDate(hw5Due.getDate() + 5);
    
    assignments.push({
      id: `assign-${course.id}-5`,
      courseId: course.id,
      title: `HW5: ${course.code === "CS101" ? "Object-Oriented Programming" : course.code === "CS201" ? "Binary Search Tree" : "Next Topic"}`,
      description: course.code === "CS101"
        ? "Design and implement classes. Include inheritance, polymorphism, and encapsulation."
        : "Implement BST operations: insert, search, delete, and traversal.",
      dueAt: hw5Due.toISOString(),
      status: "planned",
      priority: "medium",
      estimatedTimeRemaining: 6 * 60, // 6 hours
      autoSuggestion: "Start this weekend - typically takes 6 hours based on your pace",
    });
    
    // Assignment 6: Due in 12 days
    const hw6Due = new Date(now);
    hw6Due.setDate(hw6Due.getDate() + 12);
    
    assignments.push({
      id: `assign-${course.id}-6`,
      courseId: course.id,
      title: `HW6: ${course.code === "CS101" ? "File I/O and Error Handling" : course.code === "CS201" ? "Graph Traversal Algorithms" : "Final Project Prep"}`,
      description: course.code === "CS201"
        ? "Implement BFS and DFS. Compare performance and use cases."
        : "Final project preparation and planning.",
      dueAt: hw6Due.toISOString(),
      status: "planned",
      priority: "low",
      estimatedTimeRemaining: 8 * 60,
    });
  });
  
  return assignments;
}

export function generateBusinessAssignments(courses: Course[], userId: string, now: Date): Assignment[] {
  const assignments: Assignment[] = [];
  
  courses.forEach((course, courseIdx) => {
    // Completed assignments (showing improvement)
    const hw1Due = new Date(now);
    hw1Due.setDate(hw1Due.getDate() - 21);
    
    assignments.push({
      id: `assign-${course.id}-1`,
      courseId: course.id,
      title: course.code === "PSYCH101" ? "Learning Theories Essay" : course.code === "BUS201" ? "SWOT Analysis" : "Market Analysis",
      description: course.code === "PSYCH101"
        ? "Compare and contrast classical and operant conditioning. Provide real-world examples."
        : "Analyze a company using SWOT framework.",
      dueAt: hw1Due.toISOString(),
      status: "submitted",
      priority: "medium",
      grade: 82,
      feedback: "Good analysis. Add more examples and connect to course materials.",
      timeSpent: 4 * 60,
      submittedAt: new Date(hw1Due.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    });
    
    // In progress
    const hw2Due = new Date(now);
    hw2Due.setDate(hw2Due.getDate() + 2);
    
    assignments.push({
      id: `assign-${course.id}-2`,
      courseId: course.id,
      title: course.code === "PSYCH101" ? "Memory Systems Case Study" : course.code === "BUS201" ? "Leadership Styles Paper" : "Consumer Behavior Report",
      description: course.code === "PSYCH101"
        ? "Analyze a case study involving memory systems. Discuss STM, LTM, and memory disorders."
        : "Compare different leadership styles with examples.",
      dueAt: hw2Due.toISOString(),
      status: "in_progress",
      priority: "high",
      progress: 70,
      estimatedTimeRemaining: 2 * 60,
      timeSpent: 4 * 60,
    });
    
    // Upcoming
    const hw3Due = new Date(now);
    hw3Due.setDate(hw3Due.getDate() + 8);
    
    assignments.push({
      id: `assign-${course.id}-3`,
      courseId: course.id,
      title: course.code === "BUS201" ? "Organizational Behavior Analysis" : "Research Paper",
      description: "Apply course concepts to real-world scenarios.",
      dueAt: hw3Due.toISOString(),
      status: "planned",
      priority: "medium",
      estimatedTimeRemaining: 5 * 60,
    });
  });
  
  return assignments;
}
