import { createClient } from "@/lib/supabase/server";

export type SessionPayload = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};

/**
 * Reads the current Supabase Auth session (Server Components / Route Handlers)
 * and joins it with the app's `profiles` row to get name + role.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .maybeSingle();

  const fallbackName =
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "";

  return {
    id: user.id,
    email: user.email || "",
    name: profile?.name || fallbackName,
    role: (profile?.role as "admin" | "customer") || "customer",
  };
}
