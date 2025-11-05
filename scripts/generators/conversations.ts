// Conversations Generator - FEATURE-FIRST APPROACH
// Creates conversations showcasing all 7 agent types with proper routing

import type { Message } from "@/lib/types";

interface Course {
  id: string;
  code: string;
  title: string;
}

interface ConversationTemplate {
  courseCode: string;
  userPrompt: string;
  assistantResponse: string;
  agent: Message["agent"];
  citations: { sourceId: string; snippet: string }[];
  showStreaming: boolean;
  showVoice: boolean;
  hasImage?: boolean;
  imageType?: string;
}

// Agent routing keywords
const AGENT_KEYWORDS = {
  course: ["explain", "what is", "concept", "material", "understand", "learn"],
  assignment: ["assignment", "homework", "hw", "due", "project", "submit"],
  planner: ["schedule", "plan", "time", "when", "calendar", "study plan"],
  exam: ["exam", "test", "midterm", "final", "quiz", "prepare", "study for"],
  notes: ["notes", "summarize", "flashcard", "review", "create"],
  research: ["research", "paper", "essay", "sources", "citation", "find"],
  campus: ["where", "location", "office hours", "tutoring", "lab", "building"],
};

function detectAgent(prompt: string, courseId?: string): Message["agent"] {
  const lowerPrompt = prompt.toLowerCase();
  
  // Check for campus-related queries
  if (AGENT_KEYWORDS.campus.some(kw => lowerPrompt.includes(kw))) {
    return "campus";
  }
  
  // Check for research queries
  if (AGENT_KEYWORDS.research.some(kw => lowerPrompt.includes(kw))) {
    return "research";
  }
  
  // Check for notes/flashcard queries
  if (AGENT_KEYWORDS.notes.some(kw => lowerPrompt.includes(kw))) {
    return "notes";
  }
  
  // Check for exam queries
  if (AGENT_KEYWORDS.exam.some(kw => lowerPrompt.includes(kw))) {
    return "exam";
  }
  
  // Check for planner queries
  if (AGENT_KEYWORDS.planner.some(kw => lowerPrompt.includes(kw))) {
    return "planner";
  }
  
  // Check for assignment queries
  if (AGENT_KEYWORDS.assignment.some(kw => lowerPrompt.includes(kw))) {
    return "assignment";
  }
  
  // Default to course agent
  return "course";
}

export function generateCSConversations(courses: Course[], userId: string, now: Date): Message[] {
  const messages: Message[] = [];
  
  // CONVERSATION TEMPLATES - Designed to showcase features
  const conversationTemplates: ConversationTemplate[] = [
    // === STREAMING AI DEMO ===
    {
      courseCode: "CS101",
      userPrompt: "Can you explain recursion using the materials? I'm confused about base cases and recursive cases.",
      assistantResponse: `Let me explain recursion using your course materials. According to "Recursion Deep Dive: From Basics to Mastery" (pages 1-2), recursion is when a function calls itself to solve a problem by breaking it down into smaller, more manageable subproblems.

**The Two Essential Components:**

1. **Base Case** - This is the stopping condition that prevents infinite recursion. Without it, your function would call itself forever, leading to a stack overflow error. Looking at page 3 of your material, the base case is the condition that stops the recursion.

2. **Recursive Case** - This is where the function calls itself with a modified input. Each recursive call moves closer to the base case.

**Example from your materials (page 3):**

\`\`\`python
def countdown(n):
    if n <= 0:  # BASE CASE - stops recursion
        print("Done!")
    else:
        print(n)
        countdown(n-1)  # RECURSIVE CASE - calls itself
\`\`\`

In this example:
- The base case is \`n <= 0\`
- The recursive case is \`countdown(n-1)\`
- Each call reduces n by 1, moving toward the base case

**Why Base Cases Matter:**

According to page 11 of your material, missing base cases is one of the most common pitfalls. Without a base case, you'll get infinite recursion and a stack overflow error.

**Practice Tip:**

Start by identifying what your base case should be. Ask yourself: "What's the simplest version of this problem?" That's usually your base case.

Want me to walk through the factorial example next, or do you have questions about base cases?`,
      agent: "course" as const,
      citations: [
        { sourceId: "mat-course-cs101-1", snippet: "Recursion Deep Dive: From Basics to Mastery, pages 1-3" },
      ],
      showStreaming: true,
      showVoice: true,
    },
    
    // === ASSIGNMENT AGENT DEMO ===
    {
      courseCode: "CS101",
      userPrompt: "I'm stuck on the Fibonacci assignment. How should I approach the recursive version?",
      assistantResponse: `I can help you with the Fibonacci assignment! Let me break down the approach without giving you the complete solution.

**Understanding the Problem:**

The Fibonacci sequence is:
- fib(0) = 0
- fib(1) = 1
- fib(n) = fib(n-1) + fib(n-2) for n > 1

**Your Recursive Function Needs:**

1. **Two base cases** (not one!):
   - When n = 0, return 0
   - When n = 1, return 1

2. **One recursive case**:
   - Return the sum of the previous two Fibonacci numbers

**Step-by-Step Approach:**

Start by writing the function signature and base cases:

\`\`\`python
def fib_recursive(n):
    # Base case 1: if n is 0
    if n == 0:
        return 0
    
    # Base case 2: if n is 1
    if n == 1:
        return 1
    
    # Recursive case: return sum of previous two
    return fib_recursive(n-1) + fib_recursive(n-2)
\`\`\`

**Testing Strategy:**

1. Test with small numbers first (n=5, n=10)
2. Verify base cases work (n=0, n=1)
3. Check that each call moves toward the base case

**Important Note:**

Your assignment asks you to compare this with an iterative approach. The recursive version is elegant but slower (O(2^n)). The iterative version will be much faster (O(n)).

Need help with the iterative version or the timing comparison?`,
      agent: "assignment" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },
    
    // === PLANNER AGENT DEMO ===
    {
      courseCode: "CS101",
      userPrompt: "I have the Fibonacci assignment due tomorrow and the CS101 midterm next week. How should I plan my study time?",
      assistantResponse: `Let me create an optimized study plan for you! 📅

**TODAY (Priority: Finish Assignment)**

Based on your past patterns, you code best at night (8-11 PM). Here's my recommendation:

• **7:00 PM - 9:30 PM**: Finish Fibonacci assignment (2.5 hrs)
  - You typically code best at night
  - This leaves buffer time before deadline
  - Focus: Complete recursive and iterative versions

• **9:30 PM - 10:00 PM**: Break (you've earned it!)

• **10:00 PM - 10:30 PM**: Quick review and submit assignment

**TOMORROW (Start Exam Prep)**

• **9:00 AM - 10:00 AM**: Review & finalize Fibonacci submission (buffer time)

• **7:00 PM - 10:00 PM**: Start exam prep - Recursion chapter
  - Review recursion materials (pages 1-10)
  - Redo practice problems from the PDF
  - Focus on base cases and common pitfalls

**WEDNESDAY-FRIDAY (Deep Exam Prep)**

• **Daily 2-hour blocks** (7 PM - 9 PM)
  - Wednesday: Data Structures (arrays, lists, stacks)
  - Thursday: Big-O notation (review the guide PDF)
  - Friday: Error handling and debugging

**WEEKEND (Intensive Review)**

• **Saturday**: Mock exam (3 hours)
  - Use practice problems from materials
  - Time yourself to simulate exam conditions

• **Sunday**: Review weak areas identified from mock exam

**Total Prep Time: 15 hours**

This matches your average for previous exams where you scored 85%+. Based on your current performance (87% average), you're on track for an A-.

**Want me to add this to your calendar?**`,
      agent: "planner" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },
    
    // === EXAM AGENT DEMO ===
    {
      courseCode: "CS101",
      userPrompt: "What should I focus on for the CS101 midterm? I'm nervous.",
      assistantResponse: `Don't worry, I'll help you prepare strategically! 📝

**Based on your syllabus and course materials, here's what to prioritize:**

**HIGH PRIORITY (60% of exam):**

1. **Recursion** (you've struggled here - allocate extra time)
   - Base cases and recursive cases
   - Common pitfalls (review pages 11-13 of Recursion Deep Dive)
   - Practice problems from pages 14-18

2. **Data Structures** (arrays, lists, stacks, queues)
   - Arrays vs Linked Lists comparison
   - When to use each structure
   - Review the Visual Guide PDF

3. **Big-O Notation** (common exam question)
   - O(1), O(log n), O(n), O(n²) - know them all!
   - Review the comparison table (page 15 of Big-O guide)
   - Practice analyzing code complexity

**MEDIUM PRIORITY (30% of exam):**

- Python syntax & built-in functions
- Error handling & debugging
- File I/O basics

**LOW PRIORITY (10% of exam):**

- Advanced topics mentioned briefly in lectures

**STUDY STRATEGY:**

1. **Review flashcards** (20 cards due today!)
   - Focus on recursion and Big-O concepts
   - Perfect timing for spaced repetition

2. **Redo recursion problems** from HW4
   - Fibonacci recursive version
   - Factorial function
   - Practice problems from materials

3. **Big-O analysis practice**
   - Use the guide PDF (pages 4-12)
   - Analyze code snippets
   - Know the comparison table

4. **Take practice exam** (I can generate one for you)

**You have 7 days until the exam.** You're currently at 87% average, which is solid. With focused prep, you can easily score 90%+.

Want me to create a detailed day-by-day study schedule?`,
      agent: "exam" as const,
      citations: [
        { sourceId: "mat-course-cs101-1", snippet: "Recursion Deep Dive, pages 11-13" },
        { sourceId: "mat-course-cs101-2", snippet: "Big-O Notation Guide, page 15" },
      ],
      showStreaming: true,
      showVoice: false,
    },
    
    // === NOTES AGENT DEMO ===
    {
      courseCode: "CS101",
      userPrompt: "Can you summarize my recursion notes and create flashcards from them?",
      assistantResponse: `I'll analyze your recursion notes and create flashcards! 📔

**SUMMARY OF YOUR NOTES:**

Your notes cover:
• **Definition**: Function calling itself to solve problems
• **Key components**: Base case + Recursive case
• **Common patterns**: Countdown, Factorial, Fibonacci
• **Debugging tips**: Print statements, trace execution

**GENERATED FLASHCARDS (10 cards):**

**1. Definition Card:**
Q: What is recursion?
A: A function that calls itself to solve a problem by breaking it into smaller subproblems.

**2. Base Case Card:**
Q: What happens without a base case in recursion?
A: Infinite recursion occurs, leading to a stack overflow error.

**3. Recursive Case Card:**
Q: What is the recursive case in the factorial function?
A: \`return n * factorial(n-1)\` - calls itself with n-1

**4. Factorial Pattern:**
Q: What is the base case for factorial?
A: \`if n <= 1: return 1\`

**5. Fibonacci Pattern:**
Q: What are the base cases for Fibonacci?
A: \`fib(0) = 0\` and \`fib(1) = 1\`

**6. Common Pitfall:**
Q: What is the most common recursion error?
A: Missing base case or base case never reached

**7. Debugging Tip:**
Q: How do you debug recursive functions?
A: Add print statements, trace execution manually, test with small inputs

**8. Memory Consideration:**
Q: What is a disadvantage of recursion?
A: Can be memory-intensive due to call stack growth

**9. When to Use:**
Q: When is recursion a good choice?
A: Problems with recursive structure, like tree traversal or divide-and-conquer

**10. Optimization:**
Q: How do you optimize recursive Fibonacci?
A: Use memoization to cache results and avoid repeated calculations

**Added 10 new flashcards to your CS101 deck!**

Review them now or schedule for tomorrow? I've set the first review for today to help with your exam prep.`,
      agent: "notes" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },
    
    // === RESEARCH AGENT DEMO ===
    {
      courseCode: "CS101",
      userPrompt: "I need to write a paper on the history of algorithms. Can you help me find sources?",
      assistantResponse: `I'll help you find credible sources for your algorithms paper! 🔬

**RECOMMENDED SOURCES:**

**PRIMARY SOURCES:**

1. **"The Art of Computer Programming"** - Donald Knuth (1968)
   - Foundational text on algorithms
   - Volume 1: Fundamental Algorithms
   - Available in university library (Engineering Library, Floor 3)
   - Citation: Knuth, D. E. (1968). *The Art of Computer Programming*

2. **"Introduction to Algorithms"** - CLRS (2009)
   - Modern comprehensive reference
   - Cormen, Leiserson, Rivest, Stein
   - Good for contemporary perspective
   - Citation: Cormen, T. H., et al. (2009). *Introduction to Algorithms*

**HISTORICAL SOURCES:**

3. **Al-Khwarizmi's Works** (9th century)
   - Etymology of "algorithm" comes from his name
   - Provides historical context
   - Available in translation: "The Compendious Book on Calculation"

4. **Euclid's Algorithm** (300 BCE)
   - One of the oldest algorithms still in use
   - Great for ancient algorithms section

**ACADEMIC PAPERS:**

5. **"A History of Algorithms"** - Chabert (1999)
   - Survey paper, excellent overview
   - Covers algorithms from ancient to modern
   - DOI: 10.1007/978-3-642-18192-4

6. **"The Algorithmic Origins of Computation"** - Needham (2020)
   - Modern perspective on algorithm history
   - Available via university library database

**OUTLINE SUGGESTION:**

I. **Introduction**
   - Definition and etymology of "algorithm"
   - Thesis: Algorithms evolved from simple procedures to complex systems

II. **Ancient Algorithms** (Euclid, Babylonian methods)
   - Euclidean algorithm for GCD
   - Early mathematical procedures

III. **Development Through 20th Century**
   - Turing's contributions
   - Early computer algorithms
   - Sorting and searching algorithms

IV. **Modern Computational Algorithms**
   - Machine learning algorithms
   - Parallel computing
   - Quantum algorithms

V. **Conclusion**
   - Impact of algorithms on modern society
   - Future directions

Need help with citations in APA format or expanding any section?`,
      agent: "research" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },
    
    // === CAMPUS AGENT DEMO ===
    {
      courseCode: "CS101",
      userPrompt: "Where is the CS department tutoring center? I need help with my homework.",
      assistantResponse: `The CS Department Tutoring Center is located: 📍

**LOCATION:**
Engineering Building, Room 201
Second floor, east wing

**HOURS:**
• Monday-Thursday: 9 AM - 8 PM
• Friday: 9 AM - 5 PM
• Saturday: 11 AM - 4 PM
• Sunday: Closed

**TUTORS AVAILABLE:**
• Walk-in tutoring (no appointment needed)
• Average wait time: 15-20 minutes
• Specialized help for CS101, CS201
• TAs available for Python, recursion, data structures

**TIP:** Least crowded times are 9-11 AM on weekdays

**OTHER RESOURCES:**

• **CS Lab** (Eng 105): Open 24/7 with student card access
   - Has all programming software installed
   - Collaborative workspace

• **Professor Office Hours**: 
   - Prof. Smith: Wednesdays 2-4 PM (Eng 302)
   - Prof. Johnson: Fridays 10 AM - 12 PM (Eng 304)

• **Online Forum**: cs101.forum.edu
   - Ask questions anytime
   - TAs respond within 24 hours

• **Study Groups**: 
   - CS101 Study Group: Tuesdays 6-8 PM (Eng 105)

Need directions to the building or want to schedule time to go?`,
      agent: "campus" as const,
      citations: [],
      showStreaming: false,
      showVoice: true,
    },
    
    // === MORE STREAMING DEMOS ===
    {
      courseCode: "CS101",
      userPrompt: "Explain Big-O notation from the materials. I need to understand O(n²) vs O(log n).",
      assistantResponse: `Let me explain Big-O notation using your course materials! According to "Big-O Notation: A Complete Guide" (pages 1-3), Big-O notation describes how algorithm runtime or space requirements grow as input size increases.

**What is Big-O?**

Big-O notation focuses on:
- **Dominant term**: The term that grows fastest
- **Drop constants**: O(2n) becomes O(n)
- **Drop lower-order terms**: O(n² + n) becomes O(n²)

**O(n²) - Quadratic Time:**

According to page 8 of your guide, O(n²) means time grows quadratically with input size. If you have n elements, it takes roughly n² operations.

**Example from your materials:**
\`\`\`python
def find_pairs(arr):
    pairs = []
    for i in range(len(arr)):  # Outer loop: n iterations
        for j in range(i+1, len(arr)):  # Inner loop: up to n iterations
            pairs.append((arr[i], arr[j]))
    return pairs
\`\`\`

**O(log n) - Logarithmic Time:**

From page 5, O(log n) is much more efficient! Time grows logarithmically - very slowly. Binary search is O(log n).

**Why log n?**

Each iteration cuts the search space in half. For n elements, you need log₂(n) iterations.

**Comparison from your guide (page 15):**

For n=1000:
- O(log n): ~10 operations
- O(n²): 1,000,000 operations

That's a 100,000x difference!

**When to Use Each:**

- **O(log n)**: Search operations (binary search)
- **O(n²)**: Small datasets or when simplicity matters

Want me to walk through more examples?`,
      agent: "course" as const,
      citations: [
        { sourceId: "mat-course-cs101-2", snippet: "Big-O Notation Guide, pages 1-3, 5, 8, 15" },
      ],
      showStreaming: true,
      showVoice: true,
    },
    
    // === MORE ASSIGNMENT DEMOS ===
    {
      courseCode: "CS201",
      userPrompt: "I'm working on the sorting algorithms assignment. Which sorting algorithm should I use for large datasets?",
      assistantResponse: `Great question! For large datasets, you want an efficient algorithm. Let me break this down:

**For Large Datasets:**

**Use Merge Sort or Quick Sort** - Both are O(n log n)

**Merge Sort:**
- Guaranteed O(n log n) performance
- Stable sorting (maintains relative order)
- Better for linked lists
- Uses O(n) extra space

**Quick Sort:**
- Average O(n log n), worst case O(n²)
- Faster in practice for most cases
- In-place sorting (O(log n) space)
- Unstable sorting

**From your materials:**

The "Sorting Algorithms Comparison" PDF (pages 7-14) explains that:
- Merge Sort is better when you need guaranteed performance
- Quick Sort is better for general-purpose sorting

**For your assignment:**

Since you're comparing algorithms, implement both and:
1. Time them with different input sizes
2. Compare their performance
3. Analyze when each is better

**Don't use Bubble Sort** - It's O(n²) and way too slow for large datasets!

Need help implementing either algorithm?`,
      agent: "assignment" as const,
      citations: [
        { sourceId: "mat-course-cs201-1", snippet: "Sorting Algorithms Comparison, pages 7-14" },
      ],
      showStreaming: true,
      showVoice: false,
    },
    
    // === MULTI-MODAL DEMO (Image Upload) ===
    {
      courseCode: "CS101",
      userPrompt: "🖼️ [Image: homework_error.png] What's wrong with this code?",
      assistantResponse: `I can see the issue in your screenshot! [1] Looking at your code:

\`\`\`python
def fibonacci(n):
    if n ${"="} 1:  # ERROR HERE
        return 1
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

**THE PROBLEM:**

Line 2 uses \`=\` (assignment) instead of \`==\` (comparison). In Python, \`=\` assigns a value, while \`==\` compares values.

**THE ERROR:**

Python is showing: \`SyntaxError: invalid syntax\` because you can't assign a value (\`1\`) to an expression (\`n\`) in an \`if\` statement.

**THE FIX:**

\`\`\`python
def fibonacci(n):
    if n == 1:  # Use == for comparison
        return 1
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

**ALSO NOTICE:**

Your function is missing the base case for \`n == 0\`. [1] According to your "Recursion Deep Dive" materials, Fibonacci should handle both base cases:

\`\`\`python
def fibonacci(n):
    if n <= 1:  # Handles both n=0 and n=1
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

This matches the definition from your recursion materials: fib(0) = 0, fib(1) = 1.

Want me to help test this function?`,
      agent: "course" as const,
      citations: [
        { sourceId: "mat-course-cs101-1", snippet: "Recursion Deep Dive: Fibonacci base cases must handle both n=0 and n=1" },
      ],
      showStreaming: false,
      showVoice: false,
      hasImage: true,
      imageType: "code_error",
    },
    {
      courseCode: "MATH241",
      userPrompt: "🖼️ [Image: math_problem.jpg] Can you help me solve this triple integral problem?",
      assistantResponse: `Let me analyze your handwritten problem! [1]

**THE PROBLEM:**

You need to evaluate: ∫∫∫ z dV over the region bounded by z = x² + y² and z = 4

**SOLUTION APPROACH:**

**1. Visualize the Region** [1]
- The paraboloid z = x² + y² opens upward from origin
- The plane z = 4 caps it from above
- This creates a "bowl" shape

**2. Choose Coordinates**

Cylindrical coordinates (r, θ, z) are perfect here because of circular symmetry!

Conversion:
- x² + y² = r²
- Lower bound: z = r²
- Upper bound: z = 4

**3. Set Up Bounds** [2]

\`\`\`
z: from r² to 4
r: from 0 to 2 (where r² = 4)
θ: from 0 to 2π (full circle)
\`\`\`

**4. The Integral**

∫₀²ᵖ ∫₀² ∫ᵣ²⁴ z · r dz dr dθ

Note the extra 'r' from the Jacobian!

**5. Evaluate:**

Inner integral (with respect to z):
= ∫₀²ᵖ ∫₀² [z²/2 · r]ᵣ²⁴ dr dθ
= ∫₀²ᵖ ∫₀² r(8 - r⁴/2) dr dθ

Middle integral (with respect to r):
= ∫₀²ᵖ [4r² - r⁶/12]₀² dθ
= ∫₀²ᵖ (16 - 64/12) dθ
= ∫₀²ᵖ 32/3 dθ

Outer integral:
= [32θ/3]₀²ᵖ = **64π/3**

**ANSWER: 64π/3**

**KEY INSIGHTS:**
✓ Cylindrical coordinates simplified the setup [2]
✓ Always remember the Jacobian factor (r)
✓ The paraboloid-plane intersection gave us r ≤ 2

Need help with similar problems?`,
      agent: "course" as const,
      citations: [
        { sourceId: "mat-course-math241-1", snippet: "Vector Calculus: Cylindrical coordinates for regions with circular symmetry" },
        { sourceId: "mat-course-math241-2", snippet: "Triple Integrals: Don't forget Jacobian factor r in cylindrical coordinates" },
      ],
      showStreaming: true,
      showVoice: false,
      hasImage: true,
      imageType: "math_problem",
    },
    {
      courseCode: "CS201",
      userPrompt: "🖼️ [Image: algorithm_diagram.png] Is my understanding of merge sort correct?",
      assistantResponse: `Great diagram! Let me verify your understanding. [1]

**ANALYZING YOUR DIAGRAM:**

✅ **Divide Phase - CORRECT!**
Your diagram shows:
- [8,3,7,4,9,2,6,5]
- Split into [8,3,7,4] and [9,2,6,5]
- Continue splitting until single elements
- This is exactly right!

✅ **Conquer Phase - CORRECT!**
Your merge steps show:
1. [3,8] ← merged [8,3]
2. [4,7] ← merged [7,4]
3. [3,4,7,8] ← merged [3,8] and [4,7]

Perfect! You're comparing elements and building sorted subarrays.

**⚠️ ONE SMALL ISSUE:**

In your complexity annotation, you wrote "O(n log n) space complexity"

**CORRECTION:** [1]
- **Time Complexity:** O(n log n) ✓ (You got this right!)
- **Space Complexity:** O(n) (not O(n log n))

The space is O(n) because we need an auxiliary array of size n for merging. The log n comes from the depth of recursion, but that's for the call stack (O(log n) auxiliary space), not the merge arrays.

**WHY YOUR DIAGRAM IS EXCELLENT:**

1. **Clear division** into halves ✓
2. **Recursive breakdown** to single elements ✓
3. **Bottom-up merging** shown correctly ✓
4. **Comparison steps** are accurate ✓

**COMPARISON WITH OTHER SORTS:** [2]

From your "Sorting Algorithms" materials:
- Merge Sort: O(n log n) guaranteed, O(n) space, STABLE
- Quick Sort: O(n log n) average, O(log n) space, UNSTABLE
- Bubble Sort: O(n²), O(1) space, STABLE

Your merge sort diagram captures the key advantage: consistent O(n log n) performance through divide-and-conquer!

**FOR YOUR EXAM:**

Make sure you can:
✓ Explain why it's O(n log n) [log n levels × n work per level]
✓ Show merge step for any two sorted arrays
✓ Explain when to use merge sort vs quick sort

Excellent work on the diagram! Just fix that space complexity note.`,
      agent: "course" as const,
      citations: [
        { sourceId: "mat-course-cs201-1", snippet: "Merge Sort: Time O(n log n), Space O(n) for auxiliary array" },
        { sourceId: "mat-course-cs201-2", snippet: "Sorting Algorithms Comparison: When to use each algorithm" },
      ],
      showStreaming: false,
      showVoice: false,
      hasImage: true,
      imageType: "algorithm_diagram",
    },

    // === MORE NOTES AGENT DEMOS ===
    {
      courseCode: "CS201",
      userPrompt: "Can you create flashcards from my sorting algorithms notes?",
      assistantResponse: `I'll create flashcards from your sorting notes! 📔

**ANALYZING YOUR NOTES:**

I found notes on Bubble Sort, Merge Sort, and Quick Sort. Let me create targeted flashcards:

**FLASHCARD SET CREATED (12 cards):**

**1. Bubble Sort Basics**
Q: What is bubble sort's time complexity?
A: O(n²) worst/average case, O(n) best case with optimizations

**2. Merge Sort Concept**
Q: How does merge sort work?
A: Divide array in half, sort recursively, merge sorted halves. Divide-and-conquer approach.

**3. Quick Sort Pivot**
Q: What is a pivot in quick sort?
A: Element used to partition array. Good pivot choice crucial for performance.

**4. Stability Comparison**
Q: Which sorting algorithms are stable?
A: Merge Sort (stable), Bubble Sort (stable), Quick Sort (unstable)

**5. Space Complexity**
Q: What is merge sort's space complexity?
A: O(n) - requires auxiliary array for merging

**6. Quick Sort Partitioning**
Q: What happens during quick sort partitioning?
A: Elements less than pivot go left, greater go right. Pivot in final position.

**7. Best Case Scenarios**
Q: When does bubble sort achieve O(n)?
A: When array is already sorted and using optimized version with early exit flag

**8. Merge Sort Advantage**
Q: Why use merge sort over quick sort?
A: Guaranteed O(n log n) performance, stable sorting, predictable behavior

**9. Quick Sort Average Case**
Q: What is quick sort's average time complexity?
A: O(n log n) with random pivot selection

**10. In-Place Sorting**
Q: Which algorithms sort in-place?
A: Quick Sort (O(log n) stack space), Bubble Sort (O(1)). Merge Sort needs O(n).

**11. When to Use Bubble Sort**
Q: When should you use bubble sort?
A: Educational purposes or very small datasets (n < 10). Generally avoid in production.

**12. Sorting Algorithm Selection**
Q: How to choose between merge sort and quick sort?
A: Merge Sort: need stability/guaranteed performance. Quick Sort: average case speed, limited memory.

**ADDED 12 FLASHCARDS TO YOUR CS201 DECK!**

Spaced repetition schedule set:
- 4 cards due today (review now!)
- 5 cards due in 2 days
- 3 cards due in 1 week

Want me to quiz you on any of these concepts now?`,
      agent: "notes" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },
    {
      courseCode: "MATH241",
      userPrompt: "Summarize my calculus lecture notes from this week",
      assistantResponse: `I'll summarize your calculus notes! 📝

**WEEK'S TOPICS COVERED:**

**Monday: Multiple Integrals Review**
- Double integrals for area and volume
- Fubini's theorem for changing integration order
- Setting up bounds for different regions

**Wednesday: Triple Integrals Introduction**
- Extending to 3D regions
- Rectangular, cylindrical coordinates
- Volume calculations

**Friday: Cylindrical & Spherical Coordinates**
- When to use each coordinate system
- Conversion formulas
- Jacobian determinants

**KEY FORMULAS:**

Triple Integral (Rectangular):
∫∫∫ f(x,y,z) dx dy dz

Cylindrical (r, θ, z):
∫∫∫ f(r,θ,z) r dr dθ dz
[Note the extra 'r' factor!]

Spherical (ρ, θ, φ):
∫∫∫ f(ρ,θ,φ) ρ² sin(φ) dρ dθ dφ

**PRACTICE PROBLEMS NOTED:**
1. Find volume of sphere using triple integrals
2. Convert between coordinate systems
3. Set up bounds for cone region

**EXAM TIPS FROM NOTES:**
✓ Always sketch the region first
✓ Choose coordinates that match region symmetry
✓ Remember the Jacobian factors (r for cylindrical, ρ² sin(φ) for spherical)
✓ Double-check integration bounds

**AREAS NEEDING REVIEW:**
- Spherical coordinate setup (marked "confused" in your notes)
- Jacobian derivation (starred for review)

Want me to create flashcards for these concepts or help clarify spherical coordinates?`,
      agent: "notes" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },

    // === MORE RESEARCH AGENT DEMOS ===
    {
      courseCode: "CS305",
      userPrompt: "I need to research database indexing strategies for my term paper",
      assistantResponse: `I'll help you find credible sources on database indexing! 🔬

**ACADEMIC SOURCES FOUND:**

**1. Primary Research Papers:**

📄 **"The Case for Learned Index Structures"** - Kraska et al. (2018)
- Published in: ACM SIGMOD
- Key contribution: ML-based indexes vs traditional B-trees
- Citation: Kraska, T., et al. (2018). The case for learned index structures. SIGMOD.
- Why relevant: Cutting-edge approach to indexing

📄 **"Modern B-Tree Techniques"** - Graefe (2011)
- Published in: Foundations and Trends in Databases
- Comprehensive survey of B-tree variants
- 200+ page detailed analysis
- Available: University library database

**2. Foundational Textbooks:**

📚 **Database System Concepts** - Silberschatz, Korth, Sudarshan (7th ed.)
- Chapter 11: Indexing and Hashing
- Covers B+ trees, hash indexes, bitmap indexes
- In library: Call number QA76.9.D3 S5637

📚 **Database Management Systems** - Ramakrishnan & Gehrke
- Chapter 8: Tree-Structured Indexing
- Chapter 9: Hash-Based Indexing

**3. Performance Studies:**

📊 **"An Empirical Evaluation of Index Structures"** - Chen et al. (2020)
- Compares performance across different workloads
- Real-world benchmarks (TPC-H, TPC-C)

**RECOMMENDED PAPER STRUCTURE:**

I. Introduction
   - Importance of indexing in database performance
   - Thesis: Different indexing strategies suit different workload patterns

II. Traditional Index Structures
   A. B+ Trees [Cite: Silberschatz Ch. 11]
   B. Hash Indexes [Cite: Ramakrishnan Ch. 9]
   C. Bitmap Indexes

III. Modern Approaches
   A. Learned Indexes [Cite: Kraska 2018]
   B. Adaptive Indexing
   C. Column-Store Indexes

IV. Performance Comparison [Cite: Chen 2020]
   - OLTP workloads
   - OLAP workloads
   - Hybrid (HTAP) workloads

V. Conclusion
   - Trade-offs between index types
   - Future directions

**SEARCH KEYWORDS:**
- "database indexing strategies"
- "B-tree vs hash index"
- "learned index structures"
- "database performance optimization"

**WHERE TO FIND PAPERS:**
- ACM Digital Library (university access)
- IEEE Xplore
- Google Scholar (for free PDFs)
- arXiv (for preprints)

Want help setting up citations in APA or MLA format?`,
      agent: "research" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },
    {
      courseCode: "PHYS211",
      userPrompt: "Find research papers on projectile motion for my physics lab report",
      assistantResponse: `I'll help you find sources for your projectile motion lab report! 🔬

**FOUNDATIONAL SOURCES:**

**1. Classical Mechanics References:**

📚 **"Physics for Scientists and Engineers"** - Serway & Jewett
- Chapter 4: Motion in Two Dimensions
- Section 4.3: Projectile Motion
- Has detailed derivations and examples

📚 **"Classical Mechanics"** - Taylor
- More rigorous mathematical treatment
- Air resistance effects (Ch. 2.4)

**2. Experimental Studies:**

📄 **"Experimental Verification of Projectile Motion"** - Various authors
- Common undergraduate physics journal
- Real experimental data and error analysis
- Available: American Journal of Physics

📄 **"Air Resistance in Projectile Motion"** - Peters (2012)
- Discusses drag coefficient effects
- Compares vacuum vs real-world trajectories

**3. Computational Approaches:**

📄 **"Numerical Solutions to Projectile Motion with Air Resistance"**
- Euler's method application
- Runge-Kutta methods
- Python/MATLAB implementations

**LAB REPORT STRUCTURE:**

I. Theory
   - Kinematic equations [Cite: Serway Ch. 4]
   - Range formula derivation
   - Time of flight calculation

II. Experimental Setup
   - Apparatus description
   - Measurement tools (photogate, ruler)
   - Initial conditions

III. Data & Analysis
   - Raw measurements (table)
   - Calculated vs measured range
   - Error analysis (% error)

IV. Discussion
   - Sources of error (air resistance, measurement uncertainty)
   - Comparison with theoretical predictions [Cite: Peters 2012]

V. Conclusion
   - Verification of kinematic equations
   - Real-world limitations

**KEY EQUATIONS TO INCLUDE:**

Range: R = (v₀² sin(2θ)) / g
Time of flight: t = (2v₀ sin(θ)) / g
Maximum height: h = (v₀² sin²(θ)) / (2g)

**ERROR ANALYSIS CONSIDERATIONS:**
- Angle measurement uncertainty (±2°)
- Initial velocity measurement (±0.1 m/s)
- Air resistance effects (<5% for typical lab)
- Timing measurement (photogate precision)

Want help with the error propagation calculations or data analysis?`,
      agent: "research" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },

    // === MORE CAMPUS AGENT DEMOS ===
    {
      courseCode: "CS305",
      userPrompt: "Where can I find a study group for database systems?",
      assistantResponse: `I'll help you find database study resources on campus! 📍

**STUDY GROUPS:**

**1. CS305 Official Study Group**
📅 When: Tuesdays & Thursdays, 6:00-8:00 PM
📍 Where: Engineering Building, Room 105 (CS Lab)
👥 Led by: TA Sarah Martinez
💬 Focus: Weekly problem sets, SQL practice, exam prep

**2. Database Club Meetings**
📅 When: Wednesdays, 7:00 PM
📍 Where: Student Union, Room 3B
👥 Group size: 15-20 students
💬 Topics: Real-world database projects, PostgreSQL workshops

**ADDITIONAL RESOURCES:**

**Tutoring Services:**
📍 Engineering Learning Center (Eng 201)
⏰ Walk-in hours: Mon-Fri 9 AM - 5 PM
📝 Book appointments: englearning.edu/tutoring
🎯 Free one-on-one help with:
   - SQL queries
   - ER diagrams
   - Normalization
   - Transaction concepts

**Professor Office Hours:**
📍 Prof. Johnson: Eng 302
⏰ Wednesdays 2:00-4:00 PM, Fridays 10:00 AM - 12:00 PM
💡 Great for: Project questions, exam clarification

**TA Office Hours:**
📍 Sarah Martinez: Eng 105 (CS Lab)
⏰ Tuesdays 4:00-6:00 PM (before study group)

**ONLINE RESOURCES:**

💬 **CS305 Discord Server**
🔗 discord.gg/cs305-fall2025
👥 200+ students
📝 Channels: #sql-help, #project-discuss, #exam-prep

💬 **Database Practice Lab**
📍 Eng 105 - Open lab with sample databases
⏰ 24/7 access with student card
🖥️ PostgreSQL, MySQL, MongoDB installed

**STUDY ROOM RESERVATIONS:**

📚 **Library Study Rooms** (2-8 people)
🔗 Reserve: library.edu/studyrooms
⏰ Book up to 2 weeks in advance
💡 Tip: Rooms with whiteboards (201-205) are perfect for ER diagrams

📚 **Engineering Building Study Spaces**
📍 Eng 1st floor lounge (no reservation)
📍 Eng 3rd floor quiet study (individual)

**UPCOMING EVENTS:**

🎯 **Database Design Workshop**
📅 Friday, 3:00-5:00 PM
📍 Eng 201
👨‍🏫 Industry speaker from Oracle

Need help finding your way to any of these locations?`,
      agent: "campus" as const,
      citations: [],
      showStreaming: false,
      showVoice: true,
    },
    {
      courseCode: "MATH241",
      userPrompt: "Where is the math help center and when is it open?",
      assistantResponse: `Here's everything about the Math Help Center! 📍

**MAIN MATH HELP CENTER:**

📍 **Location:** Mathematics Building, Room 120
🏢 First floor, west wing (near main entrance)

**Hours:**
⏰ Monday-Thursday: 9:00 AM - 8:00 PM
⏰ Friday: 9:00 AM - 5:00 PM
⏰ Saturday: 11:00 AM - 4:00 PM
⏰ Sunday: 1:00 PM - 6:00 PM

**What They Offer:**
✓ Drop-in tutoring (no appointment needed)
✓ Help with MATH241 (Calc III) specifically
✓ Whiteboard areas for working through problems
✓ Practice problem sheets
✓ Exam review sessions before midterms/finals

**Average Wait Time:**
- Morning (9-11 AM): ⏱️ 5-10 minutes
- Afternoon (2-4 PM): ⏱️ 15-20 minutes ⚠️ Busy
- Evening (6-8 PM): ⏱️ 10-15 minutes
- **Least crowded:** Saturday mornings 📊

**ADDITIONAL MATH RESOURCES:**

**Professor Office Hours:**
📍 Prof. Williams: Math Building, Room 304
⏰ Tuesdays 1:00-3:00 PM, Thursdays 3:00-5:00 PM
💡 Best for: Conceptual questions, exam strategy

**TA Office Hours:**
📍 Alex Chen: Math 120 (Help Center)
⏰ Wednesdays 4:00-6:00 PM
💡 Focus: Problem-solving, homework help

**Calc III Study Group:**
📅 Thursdays, 7:00-9:00 PM
📍 Library, Group Study Room 3B
👥 15-20 students, peer-led
🎯 Work through practice problems together

**ONLINE OPTIONS:**

💻 **Virtual Math Help Center**
🔗 math.edu/virtual-help
⏰ Monday-Friday 6:00-10:00 PM
📝 Submit questions via chat or video call
⌛ Response time: 10-15 minutes

**EXAM PREP:**

🎯 **Calc III Review Sessions** (Before midterm/final)
📅 Announced 1 week before exams
📍 Large Lecture Hall (Math 100)
👨‍🏫 Led by professor + TAs
📝 Practice exams, common mistakes, tips

**Getting There:**

From Engineering Building:
1. Exit main entrance
2. Walk east toward quad (2 min)
3. Math Building is the brick building on left
4. Enter main entrance, turn right
5. Help Center is Room 120 (first door)

🚌 Campus shuttle stops right outside (Blue Route)

Need directions from your current location?`,
      agent: "campus" as const,
      citations: [],
      showStreaming: false,
      showVoice: true,
    },
  ];

  // Generate conversations for each course
  courses.forEach((course) => {
    const courseTemplates: ConversationTemplate[] = conversationTemplates.filter(t => t.courseCode === course.code);
    
    // If no templates for this course, create default ones
    if (courseTemplates.length === 0) {
      courseTemplates.push({
        courseCode: course.code,
        userPrompt: `Can you explain key concepts from ${course.code}?`,
        assistantResponse: `I'd be happy to help with ${course.title}! Let me explain the key concepts...`,
        agent: "course" as const,
        citations: [],
        showStreaming: true,
        showVoice: false,
      });
    }
    
    // Generate 3-5 conversations per course
    const count = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < count; i++) {
      const template = courseTemplates[i % courseTemplates.length];
      
      // Late night pattern (8pm-1am)
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      timestamp.setHours(20 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 60));
      
      const conversationId = `conv-${course.id}-${i}`;
      
      // Detect agent if not specified
      const detectedAgent = template.agent || detectAgent(template.userPrompt, course.id);
      
      // User message
      messages.push({
        id: `${conversationId}-user`,
        userId,
        agent: detectedAgent,
        prompt: template.userPrompt,
        answer: "",
        citations: [],
        createdAt: timestamp.toISOString(),
      });
      
      // Assistant response
      const responseTime = new Date(timestamp);
      responseTime.setSeconds(responseTime.getSeconds() + 3 + Math.floor(Math.random() * 5));

      messages.push({
        id: `${conversationId}-assistant`,
        userId,
        agent: detectedAgent,
        prompt: template.userPrompt,
        answer: template.assistantResponse,
        citations: template.citations?.map(c => ({
          label: `[${template.citations!.indexOf(c) + 1}]`,
          sourceType: "material" as const,
          sourceId: c.sourceId,
          snippet: c.snippet,
        })) || [],
        createdAt: responseTime.toISOString(),
        ...(template.hasImage ? { hasImage: true, imageType: template.imageType } : {}),
      });
    }
  });

  return messages;
}

export function generateBusinessConversations(courses: Course[], userId: string, now: Date): Message[] {
  const messages: Message[] = [];

  const conversationTemplates: ConversationTemplate[] = [
    // === STREAMING + VOICE DEMO ===
    {
      courseCode: "PSYCH101",
      userPrompt: "How do I distinguish between classical and operant conditioning?",
      assistantResponse: `Great question! Let me explain both clearly using your materials.

**Classical Conditioning (Pavlov):**

According to your "Learning Theories" PDF (pages 1-6), classical conditioning involves pairing a neutral stimulus with an unconditioned stimulus to create a conditioned response.

**Key Components:**
- **Unconditioned Stimulus (UCS)**: Naturally triggers response (like food causing salivation)
- **Unconditioned Response (UCR)**: Natural response (salivation)
- **Conditioned Stimulus (CS)**: Neutral stimulus that becomes associated (bell)
- **Conditioned Response (CR)**: Learned response to CS (salivation to bell)

**The Process:**
1. Before conditioning: UCS → UCR
2. During conditioning: CS + UCS → UCR
3. After conditioning: CS → CR

**Real-World Example:**
Think of advertising - brands pair their products with positive emotions. When you see the brand logo (CS), you feel positive (CR).

**Operant Conditioning (Skinner):**

From pages 7-12, operant conditioning uses consequences to shape behavior.

**Key Difference:**
- **Classical**: Automatic associations (involuntary)
- **Operant**: Voluntary behavior shaped by consequences

**Reinforcement increases behavior:**
- Positive: Add pleasant stimulus (reward)
- Negative: Remove unpleasant stimulus (relief)

**Punishment decreases behavior:**
- Positive: Add unpleasant stimulus
- Negative: Remove pleasant stimulus

**Key Takeaway:**
Classical = automatic associations, Operant = voluntary behavior shaped by consequences.

Want examples of each in real life?`,
      agent: "course" as const,
      citations: [
        { sourceId: "mat-course-psych101-1", snippet: "Learning Theories, pages 1-12" },
      ],
      showStreaming: true,
      showVoice: true,
    },
    
    // === PLANNER AGENT ===
    {
      courseCode: "BUS201",
      userPrompt: "I have a case study due Friday and a quiz Monday. How should I schedule my week?",
      assistantResponse: `Let me create an optimized study plan for your week! 📅

**TODAY-THURSDAY (Case Study Focus):**

Based on your morning study pattern (you're most productive 9-11 AM):

**Today:**
• 9:00 AM - 11:00 AM: Research phase (2 hrs)
  - Gather sources for case study
  - Read company background

• 2:00 PM - 4:00 PM: Analysis phase (2 hrs)
  - Apply SWOT framework
  - Identify key issues

**Tomorrow:**
• 9:00 AM - 11:30 AM: Writing phase (2.5 hrs)
  - Draft case study
  - Structure your analysis

**Thursday:**
• 9:00 AM - 10:00 AM: Revision (1 hr)
  - Review and edit
  - Check citations

• 10:00 AM - 10:30 AM: Final review and submit

**FRIDAY-SUNDAY (Quiz Prep):**

**Friday:**
• 9:00 AM - 10:30 AM: Review materials (1.5 hrs)
  - Management theories chapter
  - Key concepts review

**Saturday:**
• 9:00 AM - 11:00 AM: Deep study (2 hrs)
  - Practice questions
  - Review flashcards

**Sunday:**
• 9:00 AM - 10:00 AM: Final review (1 hr)
  - Quick review of weak areas
  - Relax - you're prepared!

**Total Time: 10 hours**
This matches your average for similar assignments where you scored 90%+.

Want me to add this to your calendar?`,
      agent: "planner" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },
    
    // === EXAM AGENT ===
    {
      courseCode: "PSYCH101",
      userPrompt: "What should I study for the PSYCH101 midterm next week?",
      assistantResponse: `Let me help you prepare strategically! 📝

**HIGH PRIORITY (60% of exam):**

1. **Brain Structure** (pages 1-8 of your materials)
   - Frontal, temporal, parietal, occipital lobes
   - Hippocampus, amygdala functions
   - Memory systems

2. **Learning Theories** (pages 1-18)
   - Classical vs Operant conditioning
   - Key differences and examples
   - Schedules of reinforcement

**MEDIUM PRIORITY (30%):**

- Memory systems (STM vs LTM)
- Research methods
- Key experiments (Pavlov, Skinner)

**STUDY STRATEGY:**

1. **Review flashcards** (15 cards due today!)
2. **Study group**: Tuesdays 6-8 PM
3. **Practice questions**: From textbook
4. **Office hours**: Wednesday 2-4 PM

You're currently at 88% average - great foundation! With focused prep, you can score 90%+.

Want a day-by-day study schedule?`,
      agent: "exam" as const,
      citations: [
        { sourceId: "mat-course-psych101-1", snippet: "Brain Structure, pages 1-8" },
        { sourceId: "mat-course-psych101-2", snippet: "Learning Theories, pages 1-18" },
      ],
      showStreaming: true,
      showVoice: false,
    },

    // === NOTES AGENT ===
    {
      courseCode: "BUS201",
      userPrompt: "Create flashcards from my management theories notes",
      assistantResponse: `I'll create flashcards from your management notes! 📔

**ANALYZING YOUR NOTES:**

Found comprehensive notes on Taylor, Mayo, and modern management approaches.

**FLASHCARD SET CREATED (10 cards):**

**1. Scientific Management**
Q: What is Taylor's Scientific Management?
A: Focus on efficiency through systematic observation, time-motion studies, standardization

**2. Hawthorne Effect**
Q: What did the Hawthorne Studies reveal?
A: Social factors matter more than physical conditions. Workers respond to being observed.

**3. Human Relations**
Q: What is Mayo's Human Relations approach?
A: Emphasis on employee satisfaction, informal groups, communication

**4. Systems Thinking**
Q: What is systems thinking in management?
A: Organizations as open systems interacting with environment

**5. Contingency Theory**
Q: What is contingency theory?
A: Best management approach depends on situation. No one-size-fits-all.

**6. TQM Principles**
Q: What are key TQM principles?
A: Continuous improvement, customer focus, employee involvement

**7. Matrix Organization**
Q: What is a matrix organization?
A: Structure combining functional and project-based reporting lines

**8. Leadership Types**
Q: Transactional vs Transformational leadership?
A: Transactional: exchange/rewards. Transformational: inspires change, empowers.

**9. SWOT Analysis**
Q: What is SWOT analysis?
A: Strategic planning tool: Strengths, Weaknesses, Opportunities, Threats

**10. Organizational Culture**
Q: Define organizational culture
A: Shared values, beliefs, practices that shape behavior within organization

**ADDED 10 FLASHCARDS TO YOUR BUS201 DECK!**

Schedule: 3 cards due today, 4 in 2 days, 3 in 1 week.

Want to review them now?`,
      agent: "notes" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },

    // === RESEARCH AGENT ===
    {
      courseCode: "PSYCH220",
      userPrompt: "Find research papers on group dynamics for my social psych paper",
      assistantResponse: `I'll help you find credible sources on group dynamics! 🔬

**ACADEMIC SOURCES:**

**1. Foundational Research:**

📄 **"Groupthink: Psychological Studies"** - Janis (1972)
- Classic study on group decision-making failures
- Bay of Pigs, Watergate examples
- Citation: Janis, I. L. (1972). *Victims of Groupthink*.

📄 **"Social Facilitation"** - Zajonc (1965)
- Presence of others affects performance
- Simple tasks improved, complex tasks hindered
- Foundational social psychology research

**2. Modern Studies:**

📄 **"The Wisdom of Crowds"** - Surowiecki (2004)
- When groups make better decisions than individuals
- Diversity, independence, decentralization needed

📄 **"Group Dynamics and Team Effectiveness"** - Hackman (2011)
- Team performance factors
- Published in *Annual Review of Psychology*

**3. Textbook References:**

📚 **Social Psychology** - Myers & Twenge (12th ed.)
- Chapter 8: Group Influence
- Covers groupthink, social facilitation, group polarization

**PAPER STRUCTURE:**

I. Introduction
   - Importance of understanding group dynamics
   - Thesis: Groups can enhance or hinder decision-making

II. Groupthink [Cite: Janis 1972]
   - Definition and characteristics
   - Real-world examples
   - Prevention strategies

III. Social Facilitation [Cite: Zajonc 1965]
   - How presence affects performance
   - Simple vs complex tasks

IV. Group Polarization
   - Groups amplify initial tendencies
   - Echo chamber effects

V. Practical Applications
   - Workplace teams
   - Decision-making processes

**SEARCH TERMS:**
- "group dynamics psychology"
- "groupthink research"
- "social facilitation studies"
- "team performance factors"

**WHERE TO SEARCH:**
- PsycINFO database
- Google Scholar
- APA PsycArticles

Need help with APA citations?`,
      agent: "research" as const,
      citations: [],
      showStreaming: true,
      showVoice: false,
    },

    // === CAMPUS AGENT ===
    {
      courseCode: "BUS305",
      userPrompt: "Where can I get help with my marketing presentation?",
      assistantResponse: `Let me find presentation resources for you! 📍

**PRESENTATION HELP:**

**1. Business Communication Lab**
📍 Business Building, Room 205
⏰ Mon-Fri: 10 AM - 6 PM
🎯 Services:
   - Presentation practice with feedback
   - Slide design consultation
   - Speech coaching
   - Recording equipment for practice

**2. Career Center Workshops**
📍 Student Services Building, 3rd floor
📅 "Effective Business Presentations" - Every Tuesday 4-5 PM
💡 Topics: Body language, slide design, Q&A handling

**STUDY GROUPS:**

**Marketing Club**
📅 Thursdays 6:00 PM
📍 Business Building, Room 101
👥 Practice presentations with peers

**RESOURCES:**

📚 **Presentation Practice Rooms**
📍 Library, 2nd floor (Rooms 201-210)
🔗 Reserve: library.edu/studyrooms
🎥 Equipped with: Projector, recording camera, whiteboard

💻 **Presentation Software**
📍 Business Lab (Bus 105)
🖥️ Available: PowerPoint, Prezi, Canva Pro
⏰ Open 24/7 with student card

**PROFESSOR OFFICE HOURS:**
📍 Prof. Anderson: Bus 308
⏰ Wednesdays 2-4 PM
💡 Great for: Content feedback, Q&A prep

**UPCOMING:**

🎯 **Marketing Presentation Clinic**
📅 Friday 3-5 PM
📍 Bus 205
👨‍🏫 Industry professionals giving feedback

Need directions to any of these locations?`,
      agent: "campus" as const,
      citations: [],
      showStreaming: false,
      showVoice: true,
    },
  ];

  courses.forEach((course) => {
    const courseTemplates: ConversationTemplate[] = conversationTemplates.filter(t => t.courseCode === course.code);
    
    if (courseTemplates.length === 0) {
      courseTemplates.push({
        courseCode: course.code,
        userPrompt: `Can you help me understand ${course.title}?`,
        assistantResponse: `I'd be happy to help with ${course.title}!`,
        agent: "course" as const,
        citations: [],
        showStreaming: true,
        showVoice: false,
      });
    }
    
    const count = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < count; i++) {
      const template = courseTemplates[i % courseTemplates.length];
      
      // Morning pattern (9am-12pm)
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      timestamp.setHours(9 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
      
      const conversationId = `conv-${course.id}-${i}`;
      const detectedAgent = template.agent || detectAgent(template.userPrompt, course.id);
      
      messages.push({
        id: `${conversationId}-user`,
        userId,
        agent: detectedAgent,
        prompt: template.userPrompt,
        answer: "",
        citations: [],
        createdAt: timestamp.toISOString(),
      });
      
      const responseTime = new Date(timestamp);
      responseTime.setSeconds(responseTime.getSeconds() + 4 + Math.floor(Math.random() * 6));

      messages.push({
        id: `${conversationId}-assistant`,
        userId,
        agent: detectedAgent,
        prompt: template.userPrompt,
        answer: template.assistantResponse,
        ...(template.hasImage ? { hasImage: true, imageType: template.imageType } : {}),
        citations: template.citations?.map(c => ({
          label: `[${template.citations!.indexOf(c) + 1}]`,
          sourceType: "material" as const,
          sourceId: c.sourceId,
          snippet: c.snippet,
        })) || [],
        createdAt: responseTime.toISOString(),
      });
    }
  });

  return messages;
}
