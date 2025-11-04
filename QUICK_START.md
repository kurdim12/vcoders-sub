# 🚀 UNI-Agent - Quick Start Guide

## ⚡ Get Running in 30 Seconds

```bash
# You're already in the project directory!
cd C:\Users\User\Desktop\agently

# Start the development server (if not already running)
npm run dev
```

Then open: **http://localhost:3000**

---

## 🎯 First 5 Things to Try

### 1️⃣ **Ask the AI** (Dashboard)
   - Type: "Explain Big-O notation from CS101"
   - Press **Cmd/Ctrl + Enter** or click "Ask"
   - See agent response with citations

### 2️⃣ **Replan Your Week** (Study Plan)
   - Click "Study Plan" in navbar
   - Click "Replan with AI"
   - Watch blocks reorganize automatically

### 3️⃣ **Move Assignments** (Assignments)
   - Go to "Assignments"
   - Click "Move Right →" on an assignment
   - See Kanban board update

### 4️⃣ **Create a Note** (Notes)
   - Navigate to "Notes"
   - Click "New Note"
   - Write in markdown
   - Click "Save Changes"

### 5️⃣ **Export Your Data** (Settings)
   - Go to "Settings"
   - Scroll to "Data Management"
   - Click "Export JSON"
   - Save the backup file

---

## 🎨 Toggle Dark Mode

Click the **sun/moon icon** in the top-right navbar anytime!

---

## 📚 Demo Data Included

The app comes pre-loaded with:
- ✅ **3 Courses**: CS101, MATH241, HIST210
- ✅ **3 Assignments** with different due dates
- ✅ **2 Exams** scheduled
- ✅ **Study blocks** for today
- ✅ **Notes** and course materials

---

## 🔑 Optional: Add Real AI

Want real AI responses instead of mock data?

1. Get an OpenAI API key: https://platform.openai.com/api-keys
2. Create `.env.local` file:
   ```bash
   NEXT_PUBLIC_APP_NAME=UNI-Agent
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Restart the dev server

**Without an API key**, the app uses smart mock responses that demonstrate the functionality.

---

## 🗺️ Page Map

| Page | What It Does |
|------|-------------|
| **Dashboard** | Global AI input, today's schedule, due assignments |
| **Study Plan** | Weekly timeline, AI replanning, conflict detection |
| **Courses** | Course list → Detail view with materials & AI agent |
| **Assignments** | Kanban board (To Do / In Progress / Submitted) |
| **Exams** | Upcoming exams, mock tests, study guides |
| **Notes** | Markdown editor with AI summarization |
| **Resources** | Upload/manage study materials |
| **Tutor Chat** | Conversational AI tutor |
| **Agent Lab** | Explore the 7 specialized AI agents |
| **Settings** | Profile, theme, data export/import |

---

## 🎮 Keyboard Shortcuts

- **Cmd/Ctrl + Enter**: Submit AI query
- **Cmd/Ctrl + K**: Global search (navbar - coming soon)
- **Theme Toggle**: Click sun/moon icon

---

## 💡 Pro Tips

1. **Try Different Agents**: Ask course-specific questions, planning help, note summaries
2. **Use Citations**: Click on citation numbers to see source snippets
3. **Export Regularly**: Data is browser-local, export to back up
4. **Explore Courses**: Click on CS101, MATH241, or HIST210 for detailed views
5. **Chat with Tutor**: The Tutor Chat page is perfect for longer conversations

---

## 🛟 Troubleshooting

### Server won't start?
```bash
# Kill any process on port 3000
npx kill-port 3000

# Try again
npm run dev
```

### Data lost?
- Click "Reset Demo" in Settings
- Or import your exported JSON backup

### Dark mode looks weird?
- Refresh the page
- Check your system theme settings

---

## 📖 Full Documentation

- **README.md**: Complete user guide
- **IMPLEMENTATION.md**: Technical deep-dive
- **Code comments**: Throughout the codebase

---

## 🎉 You're All Set!

The app is fully functional and ready to demo. Explore, experiment, and enjoy!

**Need help?** Check the other docs or read the inline code comments.

---

**Happy learning! 🚀**

