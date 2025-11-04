# 🚀 Demo Preparation Guide

Quick guide to prepare your UNI-Agent platform for demo day!

## 📦 Installation

First, install required dependencies:

```bash
npm install
```

This will install:
- `tsx` - TypeScript execution
- `canvas` - Image generation
- `pdf-lib` - PDF generation

## 🎯 Quick Start

Run these commands in order:

### 1. Generate Sample Images

Creates 4 sample images for multi-modal AI demo:
- `homework_error.png` - Python code with syntax error
- `math_problem.jpg` - Handwritten calculus problem
- `algorithm_diagram.png` - Binary search tree diagram
- `lecture_notes.jpg` - Handwritten recursion notes

```bash
npm run generate:images
```

**Output:** `/public/sample-images/`

### 2. Generate Syllabus PDFs

Creates 2 parse-ready syllabi:
- `CS305_Database_Systems_Syllabus.pdf` - For Sarah's account
- `BUS301_Marketing_Fundamentals_Syllabus.pdf` - For Marcus's account

```bash
npm run generate:syllabi
```

**Output:** `/public/sample-syllabi/`

### 3. Validate Demo Readiness

Checks that all data showcases features correctly:

```bash
npm run validate:demo
```

**Checks:**
- ✅ Streaming AI responses (long, cited)
- ✅ Voice output (speech-friendly)
- ✅ Agent routing (all 7 agents)
- ✅ Flashcards (15+ due today)
- ✅ Analytics (30 days, trends)
- ✅ Materials (rich content)
- ✅ Images (all 4 present)
- ✅ Syllabi (2 PDFs ready)

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test!

## 📋 Complete Testing Checklist

See `DEMO_TEST_CHECKLIST.md` for comprehensive testing guide.

## 🎬 Demo Day Prep

**30 minutes before:**
1. Run `npm run validate:demo` - Fix any issues
2. Clear browser localStorage
3. Refresh page - Load fresh data
4. Test all 5 killer features quickly
5. Open in fresh browser tab

**5 minutes before:**
- Deep breath 😊
- Have backup demo ready
- Smile and be confident!

## 🐛 Troubleshooting

### Images not generating?

```bash
# On Windows, canvas requires special setup
npm install --build-from-source canvas

# Or use Node.js 18+
node --version  # Should be 18+
```

### PDFs not generating?

```bash
# Check pdf-lib is installed
npm list pdf-lib

# Reinstall if needed
npm install pdf-lib
```

### Validation failing?

Check the validation output for specific issues:
- Missing images → Run `npm run generate:images`
- Missing syllabi → Run `npm run generate:syllabi`
- Data issues → Clear localStorage and refresh

## 📁 File Locations

- **Sample Images:** `/public/sample-images/`
- **Syllabi PDFs:** `/public/sample-syllabi/`
- **Validation Script:** `/scripts/validate-demo-readiness.ts`
- **Image Generator:** `/scripts/generate-sample-images.ts`
- **Syllabus Generator:** `/scripts/generate-syllabi.ts`
- **Test Checklist:** `/DEMO_TEST_CHECKLIST.md`

## ✨ Features Ready for Demo

1. ✅ **Streaming AI Responses** - Token-by-token streaming with citations
2. ✅ **Voice Output (TTS)** - Click to hear AI speak
3. ✅ **Agent Workflow Visualization** - See AI routing in real-time
4. ✅ **Syllabus Parser** - Upload PDF, auto-extract course data
5. ✅ **Multi-Modal AI** - Upload images for homework help

Plus existing features:
- ✅ Spaced repetition flashcards
- ✅ Study planning & scheduling
- ✅ Analytics dashboard with trends
- ✅ Assignment tracking
- ✅ Course materials management

## 🎯 Demo Script Ideas

### Quick 3-Minute Demo

1. **Account Selection** (30s)
   - Show Sarah vs Marcus accounts
   - Different majors, different data

2. **Syllabus Parser** (60s)
   - Upload CS305 syllabus
   - Show auto-extraction
   - Course created instantly

3. **Tutor with Streaming** (90s)
   - Ask: "Explain recursion"
   - Show streaming response
   - Show citations
   - Click voice button

### Full 5-Minute Demo

Add:
- **Flashcards** - Review session with cards due today
- **Analytics** - Show improvement trends
- **Image Upload** - Upload homework error, get help

## 🏆 Success Criteria

✅ All 5 killer features work flawlessly
✅ No console errors
✅ Both accounts showcase different data
✅ Mobile-responsive
✅ Fast loading (<3 seconds)
✅ Professional UI/UX

**You're ready to WIN! 🎉**

