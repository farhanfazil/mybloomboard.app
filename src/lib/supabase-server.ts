import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public URL — already present in client-side demo-boot.js, not a secret
const SUPABASE_URL = "https://ytzhcvzhifdzfporuwri.supabase.co";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;

  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}

export function getSupabaseAnon(): SupabaseClient | null {
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) return null;

  return createClient(SUPABASE_URL, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
