import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BloomboardDatabase } from "@/lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let browserClient:
  | SupabaseClient<BloomboardDatabase>
  | null
  | undefined;

export function createBrowserSupabaseClient() {
  if (browserClient !== undefined) {
    return browserClient;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    browserClient = null;
    return null;
  }

  browserClient = createClient<BloomboardDatabase>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  return browserClient;
}
