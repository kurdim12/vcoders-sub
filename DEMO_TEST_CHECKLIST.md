# 🧪 Demo Test Checklist

Complete this checklist before the demo to ensure everything works perfectly.

## Pre-Demo Setup

### Data Generation

- [ ] Run `npm run validate:demo` to check data quality
- [ ] Run `npm run generate:images` to create sample images
- [ ] Run `npm run generate:syllabi` to create syllabus PDFs
- [ ] Clear browser localStorage
- [ ] Refresh page to load new data

### Browser Setup

- [ ] Use Chrome or Edge (best compatibility)
- [ ] Open DevTools (check for console errors)
- [ ] Disable ad blockers
- [ ] Allow microphone access (for voice input)
- [ ] Test on both desktop and mobile

## Feature Testing

### 1. Streaming AI Responses ✨

**Test with Sarah's account:**

- [ ] Go to CS101 → Tutor tab
- [ ] Ask: "Explain recursion using the materials"
- [ ] Verify: Thinking animation appears
- [ ] Verify: Text streams token-by-token (not all at once)
- [ ] Verify: Citations appear in response
- [ ] Verify: Can click citations to see sources
- [ ] Try: Click "Stop Generation" mid-stream (should stop)
- [ ] Check: No errors in console

**Expected behavior:**

- 🤔 "Analyzing your question..." (2-3 seconds)
- 🔀 "Routing to Course Agent..."
- 💭 "Thinking..." with pulsing dots
- 📝 Text appears character-by-character with cursor
- ✅ Complete with citations

### 2. Voice Output (TTS) 🎤

**Test with any AI response:**

- [ ] Find an AI message in chat
- [ ] Click speaker icon button
- [ ] Verify: Audio plays (hear voice speaking)
- [ ] Verify: Speaker icon animates while playing
- [ ] Verify: Can pause/resume playback
- [ ] Try: Speed controls (0.75x, 1x, 1.25x, 1.5x)
- [ ] Try: Stop and play different message
- [ ] Check: Works on mobile

**Expected behavior:**

- 🔊 Icon shows "playing" state
- 📢 Clear, natural voice output
- ⏸️ Pause/play controls work
- ⏩ Speed changes work smoothly

### 3. Agent Workflow Visualization 🤖

**Test routing to different agents:**

Planner Agent:

- [ ] Ask: "When should I study for my exams?"
- [ ] Verify: Routes to Planner agent
- [ ] Verify: Visual diagram shows routing

Course Agent:

- [ ] Ask: "Explain Big-O notation"
- [ ] Verify: Routes to Course agent (default)

Assignment Agent:

- [ ] Ask: "Help me with the Fibonacci assignment"
- [ ] Verify: Routes to Assignment agent

Exam Agent:

- [ ] Ask: "How should I prepare for my CS101 midterm?"
- [ ] Verify: Routes to Exam agent

**Expected behavior:**

- 🎯 Query appears in visualization
- 🔀 Orchestrator analyzes (pulses)
- ➡️ Line animates to selected agent
- ✨ Agent highlights and processes
- ✅ Response flows back

### 4. Syllabus Parser 📄

**Test with sample syllabus:**

- [ ] Navigate to course creation or import page
- [ ] Upload: CS305_Database_Systems_Syllabus.pdf (from /public/sample-syllabi/)
- [ ] Verify: Progress indicator shows parsing
- [ ] Verify: Extracted data displayed for review
- [ ] Check extracted:
  - [ ] Course name: "CS305: Database Systems"
  - [ ] Professor: "Prof. Anderson"
  - [ ] 6 assignments with dates
  - [ ] 2 exams with dates
  - [ ] Grading breakdown (percentages)
- [ ] Edit any field to test editability
- [ ] Click "Create Course"
- [ ] Verify: Course created with all data
- [ ] Check: Assignments appear in Kanban
- [ ] Check: Exams appear in timeline

**Test with Marcus's account:**

- [ ] Upload: BUS301_Marketing_Fundamentals_Syllabus.pdf
- [ ] Verify same parsing quality

### 5. Multi-Modal AI (Image Upload) 📸

**Test with sample images:**

Code Error Image:

- [ ] Go to tutor
- [ ] Upload: homework_error.png
- [ ] Ask: "What's wrong with this code?"
- [ ] Verify: AI identifies syntax error (= instead of ==)
- [ ] Verify: AI suggests fix
- [ ] Verify: Image displays in chat

Math Problem Image:

- [ ] Upload: math_problem.jpg
- [ ] Ask: "Help me solve this"
- [ ] Verify: AI extracts equation
- [ ] Verify: AI shows step-by-step solution

Algorithm Diagram:

- [ ] Upload: algorithm_diagram.png
- [ ] Ask: "Explain this tree structure"
- [ ] Verify: AI describes binary search tree
- [ ] Verify: AI answers diagram question

Lecture Notes:

- [ ] Upload: lecture_notes.jpg
- [ ] Ask: "Summarize these notes"
- [ ] Verify: AI extracts key points

**Test upload methods:**

- [ ] Camera button (mobile: opens camera)
- [ ] Drag and drop image
- [ ] Paste image from clipboard (Cmd/Ctrl+V)

### 6. Flashcards & Spaced Repetition 🎴

**Test review session:**

- [ ] Go to CS101 → Flashcards tab
- [ ] Verify: Shows "X cards due today"
- [ ] Click "Review Now"
- [ ] Verify: Card displays (front side)
- [ ] Click "Show Answer"
- [ ] Verify: Back side shows
- [ ] Rate difficulty: 1-5
- [ ] Verify: Next card appears
- [ ] Complete 5-10 cards
- [ ] Check: Statistics update (cards reviewed, retention %)

**Test card creation:**

- [ ] Create new flashcard manually
- [ ] Verify: Can edit front/back
- [ ] Verify: Can add to deck
- [ ] Try: Generate flashcards from notes (if implemented)

### 7. Analytics Dashboard 📊

**Test with Sarah's account:**

- [ ] Go to Dashboard or Analytics page
- [ ] Verify graphs display:
  - [ ] Study time over 30 days (line chart)
  - [ ] Study time by day of week (bar chart)
  - [ ] Study time by hour of day (heatmap)
  - [ ] Course performance trends (line chart)
  - [ ] Flashcard retention over time
- [ ] Verify stats cards show:
  - [ ] Total study time
  - [ ] Current streak (18-25 days)
  - [ ] Total XP (3000+)
  - [ ] Current level
  - [ ] Cards reviewed
  - [ ] Average grade
- [ ] Check: Data shows improvement trends
- [ ] Check: Night owl pattern visible (peak 8pm-11pm)

**Test with Marcus's account:**

- [ ] Switch to Marcus
- [ ] Verify: Different patterns (morning person)
- [ ] Check: Different course data
- [ ] Check: Different peak study hours (9am-12pm)

### 8. Account Switching 🔄

**Test switching between accounts:**

- [ ] Find account switcher (in navbar/menu)
- [ ] Switch from Sarah to Marcus
- [ ] Verify: Dashboard changes
- [ ] Verify: Different courses show
- [ ] Verify: Different data everywhere
- [ ] Switch back to Sarah
- [ ] Verify: Original data restored
- [ ] Check: No data leakage between accounts

## Edge Cases & Error Handling

### Test Error Scenarios

Streaming AI:

- [ ] Try without OpenAI API key (should show mock response)
- [ ] Try very long query (should handle gracefully)
- [ ] Try nonsense query (should respond appropriately)

Voice Output:

- [ ] Try with audio blocked (should show error message)
- [ ] Try very long text (should handle or warn)

Image Upload:

- [ ] Try uploading huge file (>10MB) - should reject with message
- [ ] Try uploading non-image file - should reject
- [ ] Try uploading broken/corrupt image - should handle error

Syllabus Parser:

- [ ] Try uploading non-PDF - should reject
- [ ] Try uploading unstructured PDF - should handle gracefully

### Test Loading States

- [ ] Check all features show loading indicators
- [ ] Verify no blank screens during loading
- [ ] Check skeleton loaders (not spinners)

### Test Empty States

- [ ] Create new course with no data
- [ ] Verify: Helpful empty state messages
- [ ] Verify: CTAs to add data
- [ ] Check: All empty states have icons/illustrations

## Mobile Testing 📱

**Test on mobile device or browser DevTools mobile view:**

- [ ] Signin page responsive
- [ ] Dashboard responsive
- [ ] Course pages responsive
- [ ] Tutor chat responsive
- [ ] Flashcards swipeable
- [ ] Images upload from camera
- [ ] Voice output works
- [ ] Navigation accessible
- [ ] Touch targets large enough (44px min)

## Performance Testing ⚡

- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Check page load time (<3 seconds)
- [ ] Test with throttled network (Fast 3G)
- [ ] Check memory usage (no leaks)
- [ ] Test with 50+ flashcards (no lag)

## Final Pre-Demo Checklist

- [ ] All features tested and working
- [ ] No console errors
- [ ] No missing images
- [ ] All data loaded correctly
- [ ] Both accounts work perfectly
- [ ] Mobile version works
- [ ] Demo script prepared
- [ ] Backup plan ready (recorded demo video)
- [ ] Browser tabs prepared
- [ ] Network connection stable

## Demo Day Checklist

**30 minutes before:**

- [ ] Clear localStorage
- [ ] Reload data
- [ ] Test all 5 killer features
- [ ] Open in fresh browser tab
- [ ] Close unnecessary tabs
- [ ] Disable notifications
- [ ] Charge laptop
- [ ] Test microphone (if using voice)

**5 minutes before:**

- [ ] Deep breath 😊
- [ ] Have backup demo ready
- [ ] Smile and be confident!

## Known Issues Log

Document any issues found during testing:

| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| Example: Image upload slow | Low | Use smaller images | Open |
|  |  |  |  |

## Quick Command Reference

```bash
# Validate data quality
npm run validate:demo

# Generate sample images
npm run generate:images

# Generate syllabus PDFs
npm run generate:syllabi

# Start dev server
npm run dev

# Run tests
npm run test
```

