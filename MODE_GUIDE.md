# 🔄 UNI-Agent Mode Guide

UNI-Agent supports **3 operational modes** that can be switched without changing code. Choose the mode that fits your needs:

---

## 📋 **Mode Comparison**

| Feature | Demo | Cloud | Offline |
|---------|------|-------|---------|
| **Database** | localStorage | Supabase PostgreSQL | localStorage |
| **AI Responses** | Real (OpenAI) or Mock | Real (OpenAI) | Deterministic Mock |
| **File Storage** | Client-side only | Supabase Storage | Client-side only |
| **RAG** | TF-IDF (client) | pgvector (semantic) | TF-IDF (client) |
| **Auth** | None | NextAuth + Supabase | None |
| **Multi-device Sync** | ❌ | ✅ | ❌ |
| **Offline Support** | Partial | ❌ | ✅ Full |
| **Setup Complexity** | ⭐ Simple | ⭐⭐⭐ Complex | ⭐ Simple |
| **Best For** | Demos, Prototyping | Production | Development, Testing |

---

## 🎯 **Mode 1: DEMO** (Default)

**Perfect for:** Quick demos, prototyping, learning Next.js

### Features
- ✅ **No database required** - Everything in localStorage
- ✅ **Export/Import** - Full JSON backup/restore
- ✅ **Real or Mock AI** - Works with or without OpenAI API key
- ✅ **Client-side RAG** - TF-IDF retrieval over local materials
- ✅ **Instant setup** - Run in 30 seconds

### Setup

```bash
# 1. Set mode
echo "AIO_MODE=demo" > .env.local

# 2. (Optional) Add OpenAI key for real AI
echo "OPENAI_API_KEY=sk-your-key" >> .env.local

# 3. Install and run
npm install
npm run dev
```

### Data Management
- Data stored in browser `localStorage`
- **Export** your data regularly (Settings → Data Management)
- **Import** to restore or transfer between browsers
- **Reset** to restore seed data

### Limitations
- ❌ No multi-device sync
- ❌ ~10MB storage limit
- ❌ Data lost if browser cache cleared
- ❌ Basic TF-IDF retrieval (not semantic)

---

## ☁️ **Mode 2: CLOUD**

**Perfect for:** Production apps, multi-user systems, enterprise

### Features
- ✅ **Supabase PostgreSQL** - Real database with ACID guarantees
- ✅ **pgvector** - Semantic search with embeddings
- ✅ **Supabase Storage** - File uploads with signed URLs
- ✅ **NextAuth** - Secure authentication
- ✅ **Multi-device sync** - Access from anywhere
- ✅ **Row Level Security** - User data isolation

### Setup

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to provision (~2 minutes)

#### Step 2: Enable pgvector
```sql
-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

#### Step 3: Run Schema
```bash
# Copy the schema from lib/supabase-schema.sql
# Paste into Supabase SQL Editor
# Click "Run"
```

#### Step 4: Create Storage Bucket
```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('uniagent', 'uniagent', false);
```

#### Step 5: Configure Environment
```bash
# Create .env.local with:
AIO_MODE=cloud

# From Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE=eyJhbG...
SUPABASE_BUCKET=uniagent

# OpenAI API
OPENAI_API_KEY=sk-your-key
AI_CHAT_MODEL=gpt-4o-mini
AI_EMBED_MODEL=text-embedding-3-large

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
```

#### Step 6: Install and Run
```bash
npm install
npm run dev
```

### Cloud Mode Behavior
- All data persists to Supabase PostgreSQL
- File uploads go to Supabase Storage
- Vector embeddings for semantic search
- User authentication required
- Real-time sync across devices

### Cost Estimate (Supabase Free Tier)
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB data transfer/month
- ✅ Unlimited API requests

**Upgrade to Pro ($25/mo) for production**

---

## 📴 **Mode 3: OFFLINE**

**Perfect for:** Development without internet, testing, demos in restricted environments

### Features
- ✅ **Zero network calls** - Works completely offline
- ✅ **Deterministic responses** - Same input = same output
- ✅ **Fast** - No API latency
- ✅ **localStorage** - Data persists locally
- ✅ **Testing friendly** - Predictable behavior

### Setup

```bash
# 1. Set mode
echo "AIO_MODE=offline" > .env.local

# 2. Install and run
npm install
npm run dev

# That's it! No API keys or database needed
```

### Offline Mode Behavior
- AI responses are **deterministic** (keyword-based)
- Responses clearly marked with `[OFFLINE MODE]`
- No OpenAI API calls
- No network requests
- All data in localStorage
- Perfect for automated testing

### Example Responses

**Query:** "Explain Big-O notation"
```
[OFFLINE MODE] Great question about algorithm analysis! [1] Big-O notation describes time complexity upper bounds.

Study approach:
1. Identify basic operations in your code
2. Count iterations relative to input size n
3. Drop constants and lower-order terms

Practice with: linear search O(n), binary search O(log n), and nested loops O(n²).
```

**Query:** "Help me plan my study schedule"
```
[OFFLINE MODE] I'll help you optimize your study schedule.

Based on your deadlines:
- Prioritize assignments due within 48 hours
- Allocate 2-hour blocks for exam preparation
- Balance across all courses
- Include breaks to prevent burnout

Your schedule has been reorganized to focus on urgent items first.
```

### Use Cases
- ✅ Development without internet
- ✅ Automated testing with Playwright
- ✅ Demos in secure/restricted networks
- ✅ Local development on planes/trains
- ✅ CI/CD pipelines

---

## 🔄 **Switching Modes**

### Method 1: Environment Variable
```bash
# Edit .env.local
AIO_MODE=demo    # or cloud or offline

# Restart dev server
npm run dev
```

### Method 2: Command Line
```bash
# Temporary for one session
AIO_MODE=demo npm run dev
AIO_MODE=cloud npm run dev
AIO_MODE=offline npm run dev
```

### Method 3: Package.json Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev:demo": "AIO_MODE=demo next dev",
    "dev:cloud": "AIO_MODE=cloud next dev",
    "dev:offline": "AIO_MODE=offline next dev"
  }
}
```

Then run:
```bash
npm run dev:demo
npm run dev:cloud
npm run dev:offline
```

---

## 🎨 **Mode Indicator**

The current mode is always visible in the navbar (top-right):

- 🔵 **Demo** - Blue badge with database icon
- 🟢 **Cloud** - Green badge with cloud icon
- ⚪ **Offline** - Gray badge with wifi-off icon

Hover over the badge for mode description.

---

## 🧪 **Testing Each Mode**

### Demo Mode Test
```bash
AIO_MODE=demo npm run dev
# Visit http://localhost:3000
# Ask: "Explain Big-O notation from CS101"
# Export data (Settings → Export JSON)
# Refresh page
# Import data (Settings → Import JSON)
# Verify data restored
```

### Cloud Mode Test
```bash
AIO_MODE=cloud npm run dev
# Visit http://localhost:3000
# Upload a PDF to a course
# Ask a question
# Check Supabase dashboard for data
# Open in different browser
# Verify data synced
```

### Offline Mode Test
```bash
AIO_MODE=offline npm run dev
# Disconnect internet
# Visit http://localhost:3000
# Ask any question
# Verify [OFFLINE MODE] prefix in response
# Check responses are deterministic
```

---

## 📊 **Mode Selection Guide**

Choose your mode based on your scenario:

### Use **DEMO** when:
- 🎬 Giving a quick demo
- 🎓 Learning Next.js or the codebase
- ⚡ Need instant setup (<1 minute)
- 💻 Working solo on one device
- 🔬 Prototyping new features

### Use **CLOUD** when:
- 🚀 Deploying to production
- 👥 Supporting multiple users
- 📱 Need mobile + desktop sync
- 🔐 Require authentication
- 📈 Need scalability
- 🎯 Want semantic search (pgvector)

### Use **OFFLINE** when:
- ✈️ Working without internet
- 🧪 Running automated tests
- 🔒 In a secure/restricted environment
- 🎯 Need deterministic behavior
- ⚡ Want zero latency
- 🏗️ Developing new features without APIs

---

## 🆘 **Troubleshooting**

### Mode not switching?
```bash
# Clear .next cache
rm -rf .next
npm run dev
```

### Cloud mode not working?
```bash
# Check Supabase connection
curl https://YOUR_PROJECT.supabase.co/rest/v1/

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Check Supabase logs
# Visit: Supabase Dashboard → Logs
```

### Offline mode showing errors?
```bash
# Ensure AIO_MODE is set correctly
echo $AIO_MODE  # Should output: offline

# Check .env.local
cat .env.local

# Restart server
npm run dev
```

---

## 🎯 **Migration Path**

Start with **DEMO** → Move to **CLOUD** when ready:

1. **Start**: Demo mode for development
2. **Test**: Offline mode for automated testing
3. **Deploy**: Cloud mode for production
4. **Fallback**: Demo mode if Supabase down

All modes share the **same codebase** - just flip the flag!

---

**Happy building! 🚀**

