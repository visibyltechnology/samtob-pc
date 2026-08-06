import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone } },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data.user) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }

  // If Supabase requires email confirmation, signUp() succeeds but returns no session —
  // the account exists but isn't logged in yet. Tell the client so it can show the right message
  // instead of pretending the person is logged in and redirecting them to a dashboard they can't reach.
  const needsEmailConfirmation = !data.session;

  return NextResponse.json({
    user: { id: data.user.id, name, email },
    needsEmailConfirmation,
  });
}
