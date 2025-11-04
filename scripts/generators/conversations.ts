// Conversations Generator - FEATURE-FIRST APPROACH
// Creates conversations showcasing all 7 agent types with proper routing

import type { Message } from "@/lib/types";

interface Course {
  id: string;
  code: string;
  title: string;
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
  const conversationTemplates = [
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
    },
    
    // === MULTI-MODAL DEMO (Image Upload) ===
    {
      courseCode: "CS101",
      userPrompt: "[Image uploaded: homework_error.png] What's wrong with this code?",
      assistantResponse: `I can see the issue! Looking at your code:

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

Your function is missing the base case for \`n == 0\`. According to your materials, Fibonacci should handle both base cases:

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
        { sourceId: "mat-course-cs101-1", snippet: "Recursion Deep Dive, Fibonacci example" },
      ],
      hasImage: true,
      imageType: "code_error",
    },
  ];

  // Generate conversations for each course
  courses.forEach((course) => {
    const courseTemplates = conversationTemplates.filter(t => t.courseCode === course.code);
    
    // If no templates for this course, create default ones
    if (courseTemplates.length === 0) {
      courseTemplates.push({
        courseCode: course.code,
        userPrompt: `Can you explain key concepts from ${course.code}?`,
        assistantResponse: `I'd be happy to help with ${course.title}! Let me explain the key concepts...`,
        agent: "course" as const,
        citations: [],
        showStreaming: true,
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
      });
    }
  });

  return messages;
}

export function generateBusinessConversations(courses: Course[], userId: string, now: Date): Message[] {
  const messages: Message[] = [];
  
  const conversationTemplates = [
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
    },
  ];

  courses.forEach((course) => {
    const courseTemplates = conversationTemplates.filter(t => t.courseCode === course.code);
    
    if (courseTemplates.length === 0) {
      courseTemplates.push({
        courseCode: course.code,
        userPrompt: `Can you help me understand ${course.title}?`,
        assistantResponse: `I'd be happy to help with ${course.title}!`,
        agent: "course" as const,
        citations: [],
        showStreaming: true,
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
