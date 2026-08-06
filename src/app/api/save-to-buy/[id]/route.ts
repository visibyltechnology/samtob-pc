import { NextResponse } from "next/server";
import { database } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();
  const plans = session.role === "admin"
    ? await database.getAllPlans(supabase)
    : await database.getPlansForUser(session.id, supabase);
  const plan = plans.find((p) => p.id === id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contributions = await database.getContributionsForPlan(id, supabase);
  return NextResponse.json({ plan, contributions });
}
