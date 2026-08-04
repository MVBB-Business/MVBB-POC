import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Client-safe Supabase client — uses the publishable/anon key only, which
 * is safe to ship to the browser (RLS policies are what actually protect
 * data, not keeping this key secret). Never import the secret key into
 * anything that reaches a client bundle — see server-client.ts for that.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars"
    );
  }

  return createClient<Database>(url, anonKey);
}
