// Mode configuration and feature flags

export type AIOMode = "demo" | "cloud" | "offline";

export const AIO_MODE = (process.env.AIO_MODE || "demo") as AIOMode;

export const config = {
  mode: AIO_MODE,
  
  // Feature flags based on mode
  features: {
    useLocalStorage: AIO_MODE === "demo" || AIO_MODE === "offline",
    useSupabase: AIO_MODE === "cloud",
    useRealAI: AIO_MODE === "demo" || AIO_MODE === "cloud",
    useAuth: AIO_MODE === "cloud",
    useCloudStorage: AIO_MODE === "cloud",
    useVectorRetrieval: AIO_MODE === "cloud",
  },
  
  // AI configuration
  ai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    chatModel: process.env.AI_CHAT_MODEL || "gpt-4o-mini",
    embedModel: process.env.AI_EMBED_MODEL || "text-embedding-3-large",
  },
  
  // Supabase configuration (cloud mode only)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRole: process.env.SUPABASE_SERVICE_ROLE || "",
    bucket: process.env.SUPABASE_BUCKET || "uniagent",
  },
  
  // NextAuth configuration (cloud mode only)
  auth: {
    secret: process.env.NEXTAUTH_SECRET || "changeme",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
};

// Helper functions
export const isDemoMode = () => AIO_MODE === "demo";
export const isCloudMode = () => AIO_MODE === "cloud";
export const isOfflineMode = () => AIO_MODE === "offline";

export const getModeName = () => {
  switch (AIO_MODE) {
    case "demo":
      return "Demo (No Database)";
    case "cloud":
      return "Cloud (Supabase)";
    case "offline":
      return "Offline (Mock)";
    default:
      return "Unknown";
  }
};

export const getModeDescription = () => {
  switch (AIO_MODE) {
    case "demo":
      return "Running with localStorage. Data is saved in your browser only.";
    case "cloud":
      return "Connected to Supabase. Data syncs across devices.";
    case "offline":
      return "Offline mode. No network calls, deterministic responses.";
    default:
      return "";
  }
};

