# UNI-Agent - AI Academic Assistant Platform

A comprehensive Next.js application for academic management with AI-powered features, multi-agent orchestration, and intelligent study planning.

## 🚀 Features

- **Multi-Agent AI System**: Intelligent routing with specialized agents (planner, course, assignment, exam, notes, research)
- **Course Management**: Complete course view with materials, assignments, exams, study planner, tutor, notes, flashcards, and analytics
- **Spaced Repetition Flashcards**: SM-2 algorithm for optimal learning retention
- **Predictive Analytics**: Performance insights and grade predictions
- **Voice Input**: Speech recognition for AI tutor interactions
- **Calendar Export**: iCal format for integration with external calendars
- **PWA Support**: Progressive Web App with offline capabilities
- **Three Modes**: Demo (localStorage), Cloud (Supabase), Offline (mock AI)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **AI**: OpenAI-compatible API with multi-agent orchestration
- **Storage**: localStorage (demo) / Supabase (cloud)

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🌐 Environment Variables

```env
# AI Mode: demo | cloud | offline
AIO_MODE=demo

# OpenAI API Key (optional for demo mode)
OPENAI_API_KEY=sk-...

# Supabase (for cloud mode)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# NextAuth (for cloud mode)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```

## 🚢 Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Option 2: Deploy to Railway

1. Push code to GitHub
2. Create new project in Railway
3. Connect GitHub repository
4. Add environment variables
5. Deploy!

### Option 3: Deploy to Netlify

1. Push code to GitHub
2. Import site in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy!

## 📝 License

MIT
