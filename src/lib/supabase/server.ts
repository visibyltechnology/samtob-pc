import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Use inside Server Components, Route Handlers and Server Actions.
 * Reads/writes the auth session via Next.js cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component (no response to write to) — safe to ignore
            // because the middleware below handles refreshing the session cookie.
          }
        },
      },
    }
  );
}

/**
 * Admin client — uses the service role key, bypasses Row Level Security entirely.
 * ONLY ever import this in server-side code (API routes), never in client components.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
