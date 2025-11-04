// Supabase client for cloud mode
import { createClient } from "@supabase/supabase-js";
import { config, isCloudMode } from "./config";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!isCloudMode()) {
    throw new Error("Supabase is only available in cloud mode");
  }

  if (!supabaseClient) {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error("Supabase configuration is missing");
    }

    supabaseClient = createClient(
      config.supabase.url,
      config.supabase.anonKey
    );
  }

  return supabaseClient;
}

// Server-side client with service role
export function getSupabaseServiceClient() {
  if (!isCloudMode()) {
    throw new Error("Supabase is only available in cloud mode");
  }

  if (!config.supabase.url || !config.supabase.serviceRole) {
    throw new Error("Supabase service role configuration is missing");
  }

  return createClient(config.supabase.url, config.supabase.serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Database types (extend as needed)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      courses: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
          term: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["courses"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      materials: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          type: string;
          source: string;
          text_preview: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["materials"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["materials"]["Insert"]>;
      };
      // Add other tables as needed
    };
  };
}

// Helper functions for common operations
export async function uploadFile(file: File, path: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(config.supabase.bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
}

export async function getSignedUrl(path: string, expiresIn: number = 3600) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(config.supabase.bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

// Vector search helper
export async function vectorSearch(
  embedding: number[],
  table: string = "material_chunks",
  limit: number = 5
) {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
  });

  if (error) throw error;
  return data;
}

