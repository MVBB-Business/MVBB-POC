import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Server-only Supabase client using the secret key — bypasses RLS
 * entirely. Only import this from server components, route handlers, or
 * server actions in apps/admin. Never import from a "use client" file or
 * anything that could end up in a browser bundle — SUPABASE_SECRET_KEY has
 * no NEXT_PUBLIC_ prefix, so Next.js won't inline it client-side, but
 * importing this module from client code is still a mistake worth
 * catching in review.
 */
export function createServerSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY env vars");
  }

  return createClient<Database>(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
