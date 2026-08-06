import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const contributions = await database.getContributionsForPlan(id);
  return NextResponse.json({ contributions });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: planId } = await params;
  const { amount, bankReference } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "A positive amount is required" }, { status: 400 });
  }

  const supabase = await createClient();
  try {
    const contribution = await database.createContribution(
      { planId, amount, bankReference: bankReference || null },
      supabase
    );
    return NextResponse.json({ contribution }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not record contribution" }, { status: 500 });
  }
}
