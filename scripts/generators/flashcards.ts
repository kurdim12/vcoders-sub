// Flashcards Generator
// Generates comprehensive flashcards for CS and Business courses

import type { Flashcard } from "@/lib/types";
import { createFlashcard } from "@/lib/spaced-repetition";

interface Course {
  id: string;
  code: string;
  title: string;
}

// Flashcards Generator - FEATURE-FIRST APPROACH
// Creates flashcards optimized for showcasing spaced repetition

export function generateCSFlashcards(courses: Course[], userId: string, now: Date): Flashcard[] {
  const flashcards: Flashcard[] = [];
  
  const flashcardSets: Record<string, Array<{ front: string; back: string; difficulty: "easy" | "medium" | "hard"; cardType?: "definition" | "code" | "comparison" | "error" }>> = {
    "CS101": [
      // === CARDS DUE TODAY (for demo) ===
      { front: "What is recursion?", back: "A function that calls itself to solve a problem by breaking it into smaller subproblems. Requires a base case to stop infinite recursion.", difficulty: "medium", cardType: "definition" },
      { front: "Explain base case in recursion", back: "The stopping condition that prevents infinite recursion. Without it, the function would call itself forever, causing a stack overflow.", difficulty: "medium", cardType: "definition" },
      { front: "What is Big-O notation?", back: "A way to measure algorithm efficiency by describing how runtime grows with input size. Focuses on worst-case scenario and dominant terms.", difficulty: "medium", cardType: "definition" },
      { front: "Python list vs tuple?", back: "Lists are mutable (can be changed), tuples are immutable (cannot be changed). Lists use [], tuples use ().", difficulty: "easy", cardType: "comparison" },
      { front: "What does this code do?\n```python\ndef fib(n):\n  if n <= 1: return n\n  return fib(n-1) + fib(n-2)\n```", back: "Recursive Fibonacci function. Calculates nth Fibonacci number. Base case: n <= 1 returns n. Recursive case: sum of previous two numbers.", difficulty: "hard", cardType: "code" },
      { front: "What is the difference between == and is?", back: "== compares values, 'is' compares object identity (memory addresses). Use == for values, 'is' for None checks.", difficulty: "medium", cardType: "comparison" },
      { front: "What is a function?", back: "A reusable block of code that performs a specific task. Defined with 'def' keyword. Can take parameters and return values.", difficulty: "easy", cardType: "definition" },
      { front: "What is a dictionary?", back: "A collection of key-value pairs. Keys must be immutable (strings, numbers, tuples). Provides O(1) average lookup time.", difficulty: "medium", cardType: "definition" },
      { front: "Common Python error: SyntaxError", back: "Invalid syntax - often caused by missing colon, wrong indentation, or using = instead of == in conditionals.", difficulty: "medium", cardType: "error" },
      { front: "What is OOP?", back: "Object-Oriented Programming: organizing code into classes and objects with attributes and methods. Enables code reuse through inheritance.", difficulty: "medium", cardType: "definition" },
      
      // === ADDITIONAL CARDS ===
      { front: "What is list comprehension?", back: "A concise way to create lists: [expression for item in iterable if condition]. More readable than loops.", difficulty: "medium", cardType: "code" },
      { front: "What is a lambda function?", back: "An anonymous function defined with 'lambda'. Example: lambda x: x**2. Used for simple, one-line functions.", difficulty: "medium", cardType: "code" },
      { front: "What is inheritance?", back: "A class can inherit attributes and methods from a parent class, allowing code reuse. Use super() to call parent methods.", difficulty: "medium", cardType: "definition" },
      { front: "What is a variable?", back: "A named storage location that holds a value. In Python, variables are dynamically typed - no type declaration needed.", difficulty: "easy", cardType: "definition" },
      { front: "What does 'for' loop do?", back: "Iterates over a sequence (list, string, range) and executes code for each item. Can use enumerate() to get index.", difficulty: "easy", cardType: "definition" },
      { front: "Array vs Linked List?", back: "Arrays: O(1) access, fixed size, better cache locality. Linked Lists: O(n) access, dynamic size, O(1) insertion at head.", difficulty: "hard", cardType: "comparison" },
      { front: "What is time complexity?", back: "Measure of how algorithm runtime grows with input size. Common: O(1), O(log n), O(n), O(n²), O(2ⁿ).", difficulty: "medium", cardType: "definition" },
      { front: "What is a hash table?", back: "Data structure using hash function to map keys to values, providing O(1) average access. Python dictionaries are hash tables.", difficulty: "hard", cardType: "definition" },
      { front: "What is a linked list?", back: "Data structure where elements are stored in nodes connected by pointers. Dynamic size, sequential access O(n).", difficulty: "medium", cardType: "definition" },
      { front: "What is a binary tree?", back: "Tree data structure where each node has at most 2 children. Used in binary search trees for efficient searching.", difficulty: "medium", cardType: "definition" },
    ],
    "CS201": [
      { front: "What is Big-O notation?", back: "Mathematical notation describing algorithm efficiency, focusing on worst-case time complexity.", difficulty: "medium" },
      { front: "What is O(1) complexity?", back: "Constant time - algorithm takes same time regardless of input size (e.g., array access).", difficulty: "easy" },
      { front: "What is O(log n) complexity?", back: "Logarithmic time - time grows logarithmically with input (e.g., binary search).", difficulty: "medium" },
      { front: "What is O(n²) complexity?", back: "Quadratic time - time grows quadratically with input (e.g., nested loops).", difficulty: "medium" },
      { front: "What is a linked list?", back: "Data structure where elements are stored in nodes connected by pointers.", difficulty: "medium" },
      { front: "What is a binary tree?", back: "Tree data structure where each node has at most 2 children.", difficulty: "medium" },
      { front: "What is a hash table?", back: "Data structure using hash function to map keys to values, providing O(1) average access.", difficulty: "hard" },
      { front: "What is the difference between BFS and DFS?", back: "BFS explores level by level using queue. DFS explores deep using stack/recursion.", difficulty: "medium" },
      { front: "What is a graph?", back: "Collection of vertices (nodes) connected by edges. Can be directed or undirected.", difficulty: "medium" },
      { front: "What is dynamic programming?", back: "Solving problems by breaking into subproblems and storing results to avoid recomputation.", difficulty: "hard" },
      // Add more cards...
    ],
    "MATH241": [
      { front: "What is a partial derivative?", back: "Derivative of a function with respect to one variable while holding others constant.", difficulty: "medium" },
      { front: "What is a gradient?", back: "Vector of partial derivatives, pointing in direction of steepest ascent.", difficulty: "medium" },
      { front: "What is a triple integral?", back: "Extension of double integrals to three dimensions for volume calculations.", difficulty: "hard" },
      { front: "What is Fubini's theorem?", back: "Allows changing order of integration in multiple integrals.", difficulty: "hard" },
      { front: "What is a line integral?", back: "Integration along a curve, used in vector calculus.", difficulty: "hard" },
    ],
    "PHYS211": [
      { front: "What is Newton's First Law?", back: "Object at rest stays at rest, object in motion stays in motion unless acted upon by force.", difficulty: "easy" },
      { front: "What is Newton's Second Law?", back: "F = ma (Force equals mass times acceleration).", difficulty: "easy" },
      { front: "What is conservation of momentum?", back: "Total momentum of isolated system remains constant.", difficulty: "medium" },
      { front: "What is kinetic energy?", back: "Energy of motion: KE = ½mv²", difficulty: "easy" },
      { front: "What is potential energy?", back: "Stored energy due to position or configuration.", difficulty: "easy" },
    ],
    "CS305": [
      { front: "What is a primary key?", back: "Unique identifier for each row in a database table.", difficulty: "easy" },
      { front: "What is normalization?", back: "Process of organizing data to reduce redundancy and dependency.", difficulty: "medium" },
      { front: "What is ACID?", back: "Atomicity, Consistency, Isolation, Durability - properties of database transactions.", difficulty: "medium" },
      { front: "What is an index?", back: "Data structure improving speed of data retrieval operations.", difficulty: "medium" },
      { front: "What is SQL?", back: "Structured Query Language for managing relational databases.", difficulty: "easy" },
    ],
    "MATH221": [
      { front: "What is a matrix?", back: "Rectangular array of numbers arranged in rows and columns.", difficulty: "easy" },
      { front: "What is a vector space?", back: "Set of vectors closed under addition and scalar multiplication.", difficulty: "hard" },
      { front: "What is an eigenvalue?", back: "Scalar λ such that Av = λv for some vector v.", difficulty: "hard" },
      { front: "What is a determinant?", back: "Scalar value computed from square matrix, used in solving systems.", difficulty: "medium" },
      { front: "What is linear independence?", back: "Set of vectors where no vector can be written as linear combination of others.", difficulty: "medium" },
    ],
  };

  courses.forEach((course) => {
    const cardSet = flashcardSets[course.code] || [];
    
    // Generate 80-100 cards per course
    const baseCards = cardSet.length;
    const targetCount = 80 + Math.floor(Math.random() * 21); // 80-100
    
    // If no templates, create a default one
    if (baseCards === 0) {
      const defaultCard = createFlashcard(
        course.id,
        `What is ${course.code}?`,
        `${course.title}: Course content and fundamentals`,
        "medium"
      );
      flashcards.push(defaultCard);
      return; // Skip to next course
    }
    
    // Repeat and vary cards to reach target
    for (let i = 0; i < targetCount; i++) {
      const template = cardSet[i % baseCards];
      if (!template) continue; // Skip if template is undefined
      
      const card = createFlashcard(
        course.id,
        template.front,
        template.back,
        template.difficulty
      );
      
      // Add review history for realism
      if (i < targetCount * 0.2) {
        // 20% due today (for demo)
        card.nextReview = new Date().toISOString();
        card.lastReviewed = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        card.repetitions = Math.floor(Math.random() * 3);
      } else if (i < targetCount * 0.5) {
        // 30% reviewed 1-3 times
        card.lastReviewed = new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString();
        card.repetitions = 1 + Math.floor(Math.random() * 3);
        card.nextReview = new Date(Date.now() + Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString();
      } else if (i < targetCount * 0.9) {
        // 40% reviewed 4-7 times (mastered)
        card.lastReviewed = new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString();
        card.repetitions = 4 + Math.floor(Math.random() * 4);
        card.nextReview = new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
        card.easeFactor = 2.5 + Math.random() * 0.5; // Higher ease factor
      }
      // 10% new cards (never reviewed)
      
      flashcards.push(card);
    }
  });

  return flashcards;
}

export function generateBusinessFlashcards(courses: Course[], userId: string, now: Date): Flashcard[] {
  const flashcards: Flashcard[] = [];
  
  const flashcardSets: Record<string, Array<{ front: string; back: string; difficulty: "easy" | "medium" | "hard" }>> = {
    "PSYCH101": [
      { front: "What is neuroplasticity?", back: "The brain's ability to reorganize neural pathways in response to experience and learning.", difficulty: "medium" },
      { front: "Describe Pavlov's experiment", back: "Classical conditioning study where dogs learned to associate bell with food, causing salivation.", difficulty: "easy" },
      { front: "Difference between STM and LTM?", back: "Short-term memory holds 7±2 items for seconds; long-term memory has unlimited capacity and duration.", difficulty: "medium" },
      { front: "What is the hippocampus?", back: "Brain structure critical for memory formation and spatial navigation. Damage causes amnesia.", difficulty: "medium" },
      { front: "What is classical conditioning?", back: "Learning where neutral stimulus becomes associated with unconditioned stimulus to produce conditioned response.", difficulty: "medium" },
      { front: "What is operant conditioning?", back: "Learning through consequences: reinforcement increases behavior, punishment decreases it.", difficulty: "medium" },
      { front: "Difference between positive and negative reinforcement?", back: "Positive adds pleasant stimulus, negative removes unpleasant stimulus. Both increase behavior.", difficulty: "medium" },
      { front: "What is the amygdala?", back: "Brain structure that processes emotions, especially fear and aggression. Part of limbic system.", difficulty: "medium" },
      { front: "What is observational learning?", back: "Learning through observation and imitation of others. Associated with Bandura.", difficulty: "easy" },
      { front: "What is cognitive dissonance?", back: "Mental discomfort when beliefs conflict with actions. People seek to reduce this discomfort.", difficulty: "hard" },
      // Add more cards...
    ],
    "BUS201": [
      { front: "What is SWOT analysis?", back: "Strategic planning tool analyzing Strengths, Weaknesses, Opportunities, and Threats.", difficulty: "easy" },
      { front: "Define organizational culture", back: "Shared values, beliefs, and practices that shape behavior within an organization.", difficulty: "medium" },
      { front: "What is scientific management?", back: "Taylor's approach focusing on efficiency through systematic observation and standardization.", difficulty: "medium" },
      { front: "What is the Hawthorne effect?", back: "People perform better when they know they're being observed, regardless of actual changes.", difficulty: "medium" },
      { front: "Difference between transactional and transformational leadership?", back: "Transactional focuses on exchange/rewards. Transformational inspires change and empowers followers.", difficulty: "medium" },
      { front: "What is contingency theory?", back: "Best management approach depends on situation. No one-size-fits-all solution.", difficulty: "medium" },
      { front: "What is Total Quality Management?", back: "Management approach emphasizing continuous improvement, customer focus, and employee involvement.", difficulty: "medium" },
      { front: "What is a matrix organization?", back: "Organizational structure combining functional and project-based reporting lines.", difficulty: "hard" },
      { front: "What is organizational behavior?", back: "Study of how individuals and groups behave within organizations.", difficulty: "easy" },
      { front: "What is change management?", back: "Process of planning, implementing, and managing organizational change effectively.", difficulty: "medium" },
      // Add more cards...
    ],
    "ECON101": [
      { front: "What is opportunity cost?", back: "Value of next best alternative forgone when making a decision.", difficulty: "easy" },
      { front: "What is the law of demand?", back: "As price increases, quantity demanded decreases (ceteris paribus).", difficulty: "easy" },
      { front: "What is supply and demand?", back: "Economic model determining price and quantity in markets.", difficulty: "easy" },
      { front: "What is elasticity?", back: "Measure of responsiveness of quantity demanded/supplied to price changes.", difficulty: "medium" },
      { front: "What is a market equilibrium?", back: "Point where supply equals demand, determining market price and quantity.", difficulty: "medium" },
    ],
    "PSYCH220": [
      { front: "What is social psychology?", back: "Study of how people's thoughts, feelings, and behaviors are influenced by others.", difficulty: "easy" },
      { front: "What is conformity?", back: "Adjusting behavior or thinking to match group standards.", difficulty: "easy" },
      { front: "What is groupthink?", back: "Tendency for group members to prioritize harmony over critical thinking.", difficulty: "medium" },
      { front: "What is the fundamental attribution error?", back: "Tendency to overestimate dispositional factors and underestimate situational factors.", difficulty: "hard" },
      { front: "What is social influence?", back: "Effect of others on individual thoughts, feelings, and behaviors.", difficulty: "easy" },
    ],
    "BUS305": [
      { front: "What is marketing mix?", back: "4 Ps: Product, Price, Place, Promotion.", difficulty: "easy" },
      { front: "What is brand positioning?", back: "Place a brand occupies in consumers' minds relative to competitors.", difficulty: "medium" },
      { front: "What is market segmentation?", back: "Dividing market into distinct groups with similar needs or characteristics.", difficulty: "medium" },
      { front: "What is digital marketing?", back: "Marketing using digital channels like internet, social media, email.", difficulty: "easy" },
      { front: "What is consumer behavior?", back: "Study of how consumers make purchase decisions.", difficulty: "easy" },
    ],
    "COMM201": [
      { front: "What is effective communication?", back: "Clear, concise exchange of information between sender and receiver.", difficulty: "easy" },
      { front: "What is active listening?", back: "Fully concentrating on, understanding, and responding to speaker.", difficulty: "easy" },
      { front: "What is nonverbal communication?", back: "Communication through body language, gestures, facial expressions.", difficulty: "easy" },
      { front: "What is conflict resolution?", back: "Process of resolving disputes or disagreements.", difficulty: "medium" },
      { front: "What is negotiation?", back: "Process of reaching agreement through discussion and compromise.", difficulty: "medium" },
    ],
  };

  courses.forEach((course) => {
    const cardSet = flashcardSets[course.code] || [];
    
    // Generate 60-80 cards per course (fewer than CS)
    const baseCards = cardSet.length;
    const targetCount = 60 + Math.floor(Math.random() * 21); // 60-80
    
    // If no templates, create a default one
    if (baseCards === 0) {
      const defaultCard = createFlashcard(
        course.id,
        `What is ${course.code}?`,
        `${course.title}: Course content and fundamentals`,
        "medium"
      );
      flashcards.push(defaultCard);
      return; // Skip to next course
    }
    
    for (let i = 0; i < targetCount; i++) {
      const template = cardSet[i % baseCards];
      if (!template) continue; // Skip if template is undefined
      
      const card = createFlashcard(
        course.id,
        template.front,
        template.back,
        template.difficulty
      );
      
      // Different review pattern (morning studier, shorter sessions)
      if (i < targetCount * 0.15) {
        // 15% due today
        card.nextReview = new Date().toISOString();
        card.lastReviewed = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
        card.repetitions = Math.floor(Math.random() * 2);
      } else if (i < targetCount * 0.4) {
        // 25% reviewed 1-2 times
        card.lastReviewed = new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString();
        card.repetitions = 1 + Math.floor(Math.random() * 2);
        card.nextReview = new Date(Date.now() + Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toISOString();
      } else if (i < targetCount * 0.8) {
        // 40% reviewed 3-6 times
        card.lastReviewed = new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString();
        card.repetitions = 3 + Math.floor(Math.random() * 4);
        card.nextReview = new Date(Date.now() + Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000).toISOString();
        card.easeFactor = 2.3 + Math.random() * 0.4;
      }
      // 20% new cards
      
      flashcards.push(card);
    }
  });

  return flashcards;
}

