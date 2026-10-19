import { createBrowserClient } from "@supabase/ssr";

let clientInstance = null;

export function getSupabaseBrowserClient() {
  if (clientInstance) return clientInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase browser environment variables");
  }

  clientInstance = createBrowserClient(url, anonKey);
  return clientInstance;
}
