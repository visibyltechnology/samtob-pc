import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If these aren't set, don't crash the whole site — just skip the session
  // refresh. Every Supabase-backed page/API route will still fail on its own
  // with a clear error until the env vars are added, but at least static
  // pages (home, FAQ, delivery, stores, etc.) keep working.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[middleware] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set — skipping auth session refresh. Add them in your environment (e.g. Vercel -> Project Settings -> Environment Variables) or .env.local."
    );
    return response;
  }

  let mutableResponse = response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        mutableResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          mutableResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the session if needed — required for Supabase SSR auth to keep working
  await supabase.auth.getUser();

  return mutableResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
