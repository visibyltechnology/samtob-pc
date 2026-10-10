import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await req.json();
  if (!["confirmed", "rejected"].includes(status)) {
    return NextResponse.json({ error: "status must be confirmed or rejected" }, { status: 400 });
  }

  const supabase = await createClient();
  try {
    const contribution = await database.updateContributionStatus(id, status, supabase);
    return NextResponse.json({ contribution });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed" }, { status: 500 });
  }
}
