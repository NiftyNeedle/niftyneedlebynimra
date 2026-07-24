import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(url && key);

/** Browser Supabase client (client components, auth). */
export function createClient() {
  return createBrowserClient(url!, key!);
}
