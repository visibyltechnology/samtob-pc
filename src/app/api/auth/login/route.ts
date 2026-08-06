import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return NextResponse.json(
        { error: "Please confirm your email first — check your inbox for the confirmation link." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (!data.user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", data.user.id)
    .maybeSingle();

  const fallbackName = (data.user.user_metadata?.name as string | undefined) || data.user.email?.split("@")[0] || "";

  return NextResponse.json({
    user: {
      id: data.user.id,
      name: profile?.name || fallbackName,
      email: data.user.email,
      role: profile?.role || "customer",
    },
  });
}
