// Materials Generator - FEATURE-FIRST APPROACH
// Creates materials optimized for showcasing AI features

import type { Material } from "@/lib/types";

interface Course {
  id: string;
  code: string;
  title: string;
}

export async function generateCSMaterials(courses: Course[]): Promise<Material[]> {
  const materials: Material[] = [];
  
  const materialTemplates: Record<string, Array<{ title: string; content: string; pageCount: number }>> = {
    "CS101": [
      {
        title: "Recursion Deep Dive: From Basics to Mastery",
        pageCount: 18,
        content: `# Recursion Deep Dive: From Basics to Mastery

## Chapter 1: Introduction to Recursion (Pages 1-2)

Recursion is one of the most elegant and powerful concepts in computer science. At its core, recursion is a method where a function calls itself to solve a problem by breaking it down into smaller, more manageable subproblems.

### What is Recursion?

A recursive function is one that:
1. Has a base case that stops the recursion
2. Has a recursive case that calls itself with a modified input
3. Moves toward the base case with each recursive call

### Why Use Recursion?

- **Elegance**: Recursive solutions are often more intuitive and easier to understand
- **Problem Solving**: Naturally fits problems with recursive structure
- **Code Reusability**: Write once, works for many problem sizes

## Chapter 2: The Anatomy of Recursion (Pages 3-5)

### Base Case: The Stopping Condition

Every recursive function MUST have a base case. Without it, the function will call itself infinitely, leading to a stack overflow error.

**Example: Countdown Function**

\`\`\`python
def countdown(n):
    if n \${"<="} 0:  # BASE CASE - stops recursion
        print("Done!")
    else:
        print(n)
        countdown(n-1)  # RECURSIVE CASE - calls itself
\`\`\`

In this example:
- Base case: \`n \${"<="} 0\`
- Recursive case: \`countdown(n-1)\`
- Each call moves closer to the base case

### Recursive Case: The Self-Call

The recursive case breaks the problem into smaller pieces and calls the function again with a modified input.

## Chapter 3: Classic Recursive Examples (Pages 6-10)

### Example 1: Factorial

\`\`\`python
def factorial(n):
    if n \${"<="} 1:  # Base case
        return 1
    return n * factorial(n-1)  # Recursive case
\`\`\`

**How it works:**
- factorial(5) = 5 × factorial(4)
- factorial(4) = 4 × factorial(3)
- factorial(3) = 3 × factorial(2)
- factorial(2) = 2 × factorial(1)
- factorial(1) = 1 (base case)
- Then unwinds: 1 × 2 × 3 × 4 × 5 = 120

### Example 2: Fibonacci Sequence

\`\`\`python
def fibonacci(n):
    if n \${"<="} 1:  # Base cases
        return n
    return fibonacci(n-1) + fibonacci(n-2)  # Recursive case
\`\`\`

**Note:** This naive implementation has exponential time complexity O(2\${"^"}n). We'll optimize this later using memoization.

### Example 3: Binary Search

\`\`\`python
def binary_search(arr, target, left, right):
    if left \${">"} right:  # Base case: not found
        return -1
    
    mid = (left + right) // 2
    
    if arr[mid] == target:  # Base case: found
        return mid
    elif arr[mid] \${">"} target:
        return binary_search(arr, target, left, mid-1)  # Search left half
    else:
        return binary_search(arr, target, mid+1, right)  # Search right half
\`\`\`

## Chapter 4: Common Pitfalls and Debugging (Pages 11-13)

### Pitfall 1: Missing Base Case

**WRONG:**
\`\`\`python
def bad_recursion(n):
    return n + bad_recursion(n-1)  # No base case!
\`\`\`

This will cause infinite recursion and stack overflow.

### Pitfall 2: Base Case Never Reached

**WRONG:**
\`\`\`python
def bad_factorial(n):
    if n == 0:  # Base case
        return 1
    return n * bad_factorial(n+1)  # Moves AWAY from base case!
\`\`\`

### Pitfall 3: Forgetting Return Statement

**WRONG:**
\`\`\`python
def bad_return(n):
    if n \${"<="} 1:
        return 1
    n * bad_return(n-1)  # Missing return!
\`\`\`

### Debugging Tips

1. **Add print statements**: Track function calls and values
2. **Trace execution**: Write out the call stack manually
3. **Test with small inputs**: Start with n=1, n=2, n=3
4. **Verify base case**: Make sure it's actually reached

## Chapter 5: Practice Problems with Solutions (Pages 14-18)

### Problem 1: Sum of Array Elements

Write a recursive function to sum all elements in an array.

**Solution:**
\`\`\`python
def sum_array(arr, index=0):
    if index \${">="} len(arr):  # Base case
        return 0
    return arr[index] + sum_array(arr, index+1)
\`\`\`

### Problem 2: Reverse a String

Write a recursive function to reverse a string.

**Solution:**
\`\`\`python
def reverse_string(s):
    if len(s) \${"<="} 1:  # Base case
        return s
    return reverse_string(s[1:]) + s[0]
\`\`\`

### Problem 3: Power Function

Write a recursive function to calculate x^n.

**Solution:**
\`\`\`python
def power(x, n):
    if n == 0:  # Base case
        return 1
    return x * power(x, n-1)
\`\`\`

### Problem 4: Greatest Common Divisor (Euclidean Algorithm)

\`\`\`python
def gcd(a, b):
    if b == 0:  # Base case
        return a
    return gcd(b, a % b)
\`\`\`

### Problem 5: Towers of Hanoi

\`\`\`python
def hanoi(n, source, destination, auxiliary):
    if n == 1:  # Base case
        print(f"Move disk 1 from {source} to {destination}")
        return
    hanoi(n-1, source, auxiliary, destination)
    print(f"Move disk {n} from {source} to {destination}")
    hanoi(n-1, auxiliary, destination, source)
\`\`\`

## Key Takeaways

1. Always identify the base case first
2. Ensure recursive calls move toward the base case
3. Test with small inputs before complex problems
4. Consider optimization techniques (memoization) for repeated calculations
5. Recursion is powerful but can be memory-intensive for large inputs`,
      },
      {
        title: "Big-O Notation: A Complete Guide to Algorithm Complexity",
        pageCount: 16,
        content: `# Big-O Notation: A Complete Guide to Algorithm Complexity

## Introduction (Pages 1-3)

Big-O notation is a mathematical way to describe how the runtime or space requirements of an algorithm grow as the input size increases. It's essential for understanding algorithm efficiency and choosing the right algorithm for your problem.

### Why Big-O Matters

- **Performance Prediction**: Estimate how an algorithm will perform with large inputs
- **Algorithm Comparison**: Compare different approaches objectively
- **Optimization**: Identify bottlenecks in your code
- **Interview Preparation**: Common topic in technical interviews

### What is Big-O?

Big-O notation describes the worst-case scenario of an algorithm's complexity. It focuses on:
- **Dominant term**: The term that grows fastest
- **Drop constants**: O(2n) becomes O(n)
- **Drop lower-order terms**: O(n² + n) becomes O(n²)

## Common Time Complexities (Pages 4-12)

### O(1) - Constant Time

The algorithm takes the same amount of time regardless of input size.

**Examples:**
- Accessing an array element by index
- Hash table lookup
- Getting the first element of a list

\`\`\`python
def get_first(arr):
    return arr[0]  # O(1) - always takes same time
\`\`\`

### O(log n) - Logarithmic Time

Time grows logarithmically with input size. Very efficient!

**Examples:**
- Binary search
- Balanced tree operations
- Binary heap operations

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left \${"<="} right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] \${"<"} target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

**Why log n?**
Each iteration cuts the search space in half. For n elements, you need log₂(n) iterations.

### O(n) - Linear Time

Time grows linearly with input size.

**Examples:**
- Iterating through an array
- Finding maximum element
- Counting elements

\`\`\`python
def find_max(arr):
    max_val = arr[0]
    for num in arr:  # O(n) - one pass through array
        if num \${">"} max_val:
            max_val = num
    return max_val
\`\`\`

### O(n log n) - Linearithmic Time

Common in efficient sorting algorithms.

**Examples:**
- Merge sort
- Quick sort (average case)
- Heap sort

### O(n²) - Quadratic Time

Time grows quadratically with input size. Slower but sometimes necessary.

**Examples:**
- Nested loops
- Bubble sort
- Selection sort
- Checking all pairs in an array

\`\`\`python
def find_pairs(arr):
    pairs = []
    for i in range(len(arr)):  # Outer loop: n iterations
        for j in range(i+1, len(arr)):  # Inner loop: up to n iterations
            pairs.append((arr[i], arr[j]))
    return pairs
\`\`\`

### O(2ⁿ) - Exponential Time

Very slow! Avoid if possible.

**Examples:**
- Recursive Fibonacci (naive)
- Generating all subsets
- Brute force solutions

## Space Complexity (Pages 13-14)

Big-O also applies to space (memory) usage.

**Examples:**
- O(1): Using a fixed number of variables
- O(n): Creating an array of size n
- O(n²): Creating a 2D array

## Comparison Table (Page 15)

| Complexity | Name | Example | n=10 | n=100 | n=1000 |
|------------|------|---------|------|-------|--------|
| O(1) | Constant | Array access | 1 | 1 | 1 |
| O(log n) | Logarithmic | Binary search | 3 | 7 | 10 |
| O(n) | Linear | Single loop | 10 | 100 | 1000 |
| O(n log n) | Linearithmic | Merge sort | 33 | 664 | 9966 |
| O(n²) | Quadratic | Nested loops | 100 | 10,000 | 1,000,000 |
| O(2ⁿ) | Exponential | Naive Fibonacci | 1024 | 1.27×10³⁰ | Too large! |

## Real-World Applications (Page 16)

### When to Use Each Complexity

- **O(1)**: Constant-time lookups (hash tables)
- **O(log n)**: Search operations (binary search)
- **O(n)**: Linear processing (scanning data)
- **O(n log n)**: Sorting large datasets
- **O(n²)**: Small datasets or when simplicity matters
- **O(2ⁿ)**: Only for very small inputs or exhaustive search

## Key Takeaways

1. Focus on worst-case scenario
2. Drop constants and lower-order terms
3. Understand the trade-offs
4. Choose algorithm based on input size
5. Profile before optimizing`,
      },
      {
        title: "Python Error Messages Decoded: A Debugging Guide",
        pageCount: 14,
        content: `# Python Error Messages Decoded: A Debugging Guide

## Introduction (Pages 1-2)

Python error messages are actually helpful! Learn to read them correctly and you'll debug faster.

### Understanding Error Messages

Python errors contain:
1. **Error type**: What went wrong
2. **Error message**: Description of the problem
3. **Traceback**: Where the error occurred
4. **File location**: File and line number

## Common Errors and Solutions (Pages 3-10)

### SyntaxError: Invalid Syntax

**Error Example:**
\`\`\`python
if n \${"="} 1:  # ERROR: = instead of ==
    return 1
\`\`\`

**Error Message:**
\`\`\`
SyntaxError: invalid syntax
    if n \${"="} 1:
         ^
\`\`\`

**Solution:**
Use == for comparison, not = (which is assignment)

**Fixed Code:**
\`\`\`python
if n == 1:  # Correct
    return 1
\`\`\`

### IndentationError: Unexpected Indent

**Error Example:**
\`\`\`python
def function():
print("Hello")  # Missing indentation
\`\`\`

**Solution:**
Indent code inside functions/loops

### NameError: Name Not Defined

**Error Example:**
\`\`\`python
print(undefined_variable)
\`\`\`

**Solution:**
Define the variable before using it

### TypeError: Unsupported Operand Types

**Error Example:**
\`\`\`python
result = "5" + 3  # Can't add string and int
\`\`\`

**Solution:**
Convert types: \`result = int("5") + 3\` or \`result = "5" + str(3)\`

### IndexError: List Index Out of Range

**Error Example:**
\`\`\`python
arr = [1, 2, 3]
print(arr[5])  # Only has indices 0, 1, 2
\`\`\`

**Solution:**
Check bounds: \`if index < len(arr): print(arr[index])\`

### KeyError: Key Not Found

**Error Example:**
\`\`\`python
dict = {"name": "Sarah"}
print(dict["age"])  # Key doesn't exist
\`\`\`

**Solution:**
Use \`dict.get("age", "default")\` or check if key exists

### AttributeError: Object Has No Attribute

**Error Example:**
\`\`\`python
num = 5
num.uppercase()  # Integers don't have uppercase()
\`\`\`

**Solution:**
Use correct methods for the data type

## Debugging Strategies (Pages 11-13)

### Strategy 1: Read the Error Message Carefully

The error tells you exactly what's wrong!

### Strategy 2: Check the Line Number

Python points to where the error occurred

### Strategy 3: Print Debugging

Add print statements to see values:
\`\`\`python
print(f"Value of n: {n}")
print(f"Type of n: {type(n)}")
\`\`\`

### Strategy 4: Use a Debugger

Learn to use Python debugger (pdb) or IDE debugger

## Error Prevention Tips (Page 14)

1. Always test with small inputs first
2. Check data types before operations
3. Validate input bounds
4. Use try-except for expected errors
5. Read error messages fully before fixing`,
      },
      {
        title: "Data Structures Visual Guide: Arrays, Lists, Stacks, and Queues",
        pageCount: 20,
        content: `# Data Structures Visual Guide

## Arrays vs Linked Lists (Pages 1-8)

### Arrays

**Visual Representation:**
\`\`\`
[0] [1] [2] [3] [4]
 5   3   9   1   7
\`\`\`

**Characteristics:**
- Contiguous memory allocation
- Fixed size (in some languages)
- Fast random access: O(1)
- Insertion/deletion: O(n)

**When to Use:**
- Need fast random access
- Know the size in advance
- Accessing elements by index frequently

### Linked Lists

**Visual Representation:**
\`\`\`
[5] -> [3] -> [9] -> [1] -> [7] -> NULL
\`\`\`

**Characteristics:**
- Dynamic size
- Non-contiguous memory
- Sequential access: O(n)
- Insertion/deletion: O(1) at head

**When to Use:**
- Need dynamic size
- Frequent insertions/deletions
- Don't need random access

### Comparison

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1) | O(n) |
| Delete from beginning | O(n) | O(1) |
| Memory | Fixed | Dynamic |

## Stacks (Pages 9-12)

**Visual Representation:**
\`\`\`
    [3]  <- Top (push/pop here)
    [2]
    [1]
    [0]  <- Bottom
\`\`\`

**Operations:**
- Push: Add to top
- Pop: Remove from top
- Peek: View top without removing

**Use Cases:**
- Function call stack
- Undo operations
- Expression evaluation
- Backtracking algorithms

## Queues (Pages 13-16)

**Visual Representation:**
\`\`\`
Front -> [1] [2] [3] [4] <- Rear
        (dequeue)         (enqueue)
\`\`\`

**Operations:**
- Enqueue: Add to rear
- Dequeue: Remove from front
- Front: View front without removing

**Use Cases:**
- Task scheduling
- Breadth-first search
- Print queue
- Request handling

## Hash Tables (Pages 17-20)

**Visual Representation:**
\`\`\`
Index: 0    1    2    3    4
      [ ]  [ ]  [K,V] [ ]  [K,V]
                      |     |
                    "name" "age"
                    "Sarah" 20
\`\`\`

**Characteristics:**
- Average O(1) lookup
- Uses hash function
- Handles collisions

**Use Cases:**
- Fast lookups
- Key-value storage
- Counting frequencies
- Caching`,
      },
    ],
    "CS201": [
      {
        title: "Sorting Algorithms Comparison: Performance and Use Cases",
        pageCount: 22,
        content: `# Sorting Algorithms Comparison

## Introduction (Pages 1-3)

Sorting is fundamental to computer science. Different algorithms suit different scenarios.

## Bubble Sort (Pages 4-6)

**How it works:**
- Compare adjacent elements
- Swap if in wrong order
- Repeat until sorted

**Time Complexity:** O(n²)
**Space Complexity:** O(1)
**Stable:** Yes

**When to use:** Educational purposes only (very slow)

## Merge Sort (Pages 7-10)

**How it works:**
- Divide array in half
- Sort each half recursively
- Merge sorted halves

**Time Complexity:** O(n log n)
**Space Complexity:** O(n)
**Stable:** Yes

**When to use:** Stable sorting needed, guaranteed O(n log n)

## Quick Sort (Pages 11-14)

**How it works:**
- Choose pivot
- Partition around pivot
- Recursively sort partitions

**Time Complexity:** O(n log n) average, O(n²) worst
**Space Complexity:** O(log n)
**Stable:** No

**When to use:** General-purpose sorting (fast average case)

## Comparison Table (Pages 15-18)

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

## Real-World Applications (Pages 19-22)

- **Merge Sort**: External sorting, stable requirement
- **Quick Sort**: General-purpose sorting
- **Bubble Sort**: Never use in production!`,
      },
      {
        title: "Graph Algorithms Handbook: BFS, DFS, and Shortest Paths",
        pageCount: 25,
        content: `# Graph Algorithms Handbook

## Graph Basics (Pages 1-4)

### What is a Graph?

A graph consists of:
- **Vertices (Nodes)**: Points in the graph
- **Edges**: Connections between vertices

**Visual Representation:**
\`\`\`
     A
    / \\
   B---C
    \\ /
     D
\`\`\`

## Breadth-First Search (BFS) (Pages 5-10)

**Algorithm:**
1. Start at source vertex
2. Visit all neighbors
3. Visit neighbors of neighbors
4. Continue level by level

**Time Complexity:** O(V + E)
**Space Complexity:** O(V)

**Use Cases:**
- Shortest path (unweighted graphs)
- Level-order traversal
- Social network analysis

## Depth-First Search (DFS) (Pages 11-16)

**Algorithm:**
1. Start at source vertex
2. Go as deep as possible
3. Backtrack when stuck
4. Continue exploring

**Time Complexity:** O(V + E)
**Space Complexity:** O(V)

**Use Cases:**
- Path finding
- Cycle detection
- Topological sorting

## Dijkstra's Algorithm (Pages 17-22)

**Algorithm:**
1. Initialize distances
2. Select unvisited vertex with minimum distance
3. Update distances to neighbors
4. Repeat until all vertices visited

**Time Complexity:** O((V + E) log V)
**Use Cases:**
- Shortest path (weighted graphs)
- GPS navigation
- Network routing

## Comparison (Pages 23-25)

| Algorithm | Type | Use Case |
|-----------|------|----------|
| BFS | Unweighted | Shortest path, level-order |
| DFS | Unweighted | Path finding, cycles |
| Dijkstra | Weighted | Shortest path, navigation |`,
      },
    ],
  };

  courses.forEach((course) => {
    const templates = materialTemplates[course.code] || [];
    templates.forEach((template, idx) => {
      materials.push({
        id: `mat-${course.id}-${idx + 1}`,
        courseId: course.id,
        title: template.title,
        type: "pdf",
        source: `${template.title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        textPreview: template.content.substring(0, 800), // Longer preview for AI
      });
    });
  });

  return materials;
}

export async function generateBusinessMaterials(courses: Course[]): Promise<Material[]> {
  const materials: Material[] = [];
  
  const materialTemplates: Record<string, Array<{ title: string; content: string; pageCount: number }>> = {
    "PSYCH101": [
      {
        title: "Brain Structure and Function: A Comprehensive Guide",
        pageCount: 20,
        content: `# Brain Structure and Function

## Major Brain Regions (Pages 1-8)

### Frontal Lobe
- **Location**: Front of brain
- **Functions**: Executive functions, decision-making, personality
- **Key Areas**: Prefrontal cortex, motor cortex

### Temporal Lobe
- **Location**: Sides of brain
- **Functions**: Auditory processing, language, memory
- **Key Areas**: Auditory cortex, hippocampus

### Parietal Lobe
- **Location**: Top-back of brain
- **Functions**: Sensory processing, spatial awareness

### Occipital Lobe
- **Location**: Back of brain
- **Functions**: Visual processing

## Key Structures (Pages 9-15)

### Hippocampus
Critical for memory formation and spatial navigation. Damage can cause amnesia.

### Amygdala
Processes emotions, especially fear and aggression. Part of the limbic system.

## Memory Systems (Pages 16-20)

### Types of Memory
- **Sensory Memory**: Brief retention (0.5-3 seconds)
- **Short-Term Memory**: 7±2 items, 15-30 seconds
- **Long-Term Memory**: Unlimited capacity`,
      },
      {
        title: "Learning Theories: Classical vs Operant Conditioning",
        pageCount: 18,
        content: `# Learning Theories

## Classical Conditioning (Pavlov) (Pages 1-6)

### Key Concepts
- **Unconditioned Stimulus (UCS)**: Naturally triggers response (food)
- **Unconditioned Response (UCR)**: Natural response (salivation)
- **Conditioned Stimulus (CS)**: Neutral stimulus that becomes associated (bell)
- **Conditioned Response (CR)**: Learned response to CS (salivation to bell)

### Process
1. Before conditioning: UCS → UCR
2. During conditioning: CS + UCS → UCR
3. After conditioning: CS → CR

### Examples
- Phobias
- Taste aversions
- Advertising (brands paired with positive emotions)

## Operant Conditioning (Skinner) (Pages 7-12)

### Key Concepts
- **Reinforcement**: Increases behavior
  - Positive: Add pleasant stimulus
  - Negative: Remove unpleasant stimulus
- **Punishment**: Decreases behavior
  - Positive: Add unpleasant stimulus
  - Negative: Remove pleasant stimulus

### Schedules of Reinforcement (Pages 13-18)
- **Fixed Ratio**: Reward after fixed number of responses
- **Variable Ratio**: Reward after variable number (most resistant to extinction)
- **Fixed Interval**: Reward after fixed time
- **Variable Interval**: Reward after variable time`,
      },
    ],
    "BUS201": [
      {
        title: "Management Theories: From Taylor to Modern Leadership",
        pageCount: 24,
        content: `# Management Theories

## Classical Management (Taylor) (Pages 1-6)

### Scientific Management
- Focus on efficiency through systematic observation
- Time and motion studies
- Standardization of work processes

### Principles
1. Replace rule-of-thumb with scientific methods
2. Select and train workers scientifically
3. Cooperate with workers
4. Divide work equally between managers and workers

## Human Relations (Mayo) (Pages 7-12)

### Hawthorne Studies
Revealed importance of social factors in productivity.

### Key Findings
- Social relationships matter more than physical conditions
- Employee satisfaction affects performance
- Informal groups influence behavior
- Communication is crucial

## Modern Approaches (Pages 13-24)

### Systems Thinking
Organizations as open systems interacting with environment.

### Contingency Theory
Best approach depends on situation. No one-size-fits-all.

### Total Quality Management (TQM)
Continuous improvement, customer focus, employee involvement.`,
      },
    ],
  };

  courses.forEach((course) => {
    const templates = materialTemplates[course.code] || [];
    templates.forEach((template, idx) => {
      materials.push({
        id: `mat-${course.id}-${idx + 1}`,
        courseId: course.id,
        title: template.title,
        type: "pdf",
        source: `${template.title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        textPreview: template.content.substring(0, 800),
      });
    });
  });

  return materials;
}
