import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  if (session.role === "admin") {
    const plans = await database.getAllPlans(supabase);
    return NextResponse.json({ plans });
  }
  const plans = await database.getPlansForUser(session.id, supabase);
  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to start a Save-to-Buy plan" }, { status: 401 });
  }

  const { productId, productName, productImage, targetAmount, frequency, installmentAmount } = await req.json();
  if (!productName || !targetAmount || targetAmount <= 0) {
    return NextResponse.json({ error: "productName and a positive targetAmount are required" }, { status: 400 });
  }
  if (!["weekly", "monthly"].includes(frequency)) {
    return NextResponse.json({ error: "frequency must be weekly or monthly" }, { status: 400 });
  }

  const supabase = await createClient();
  try {
    const plan = await database.createPlan(
      {
        userId: session.id,
        productId: productId || null,
        productName,
        productImage: productImage || null,
        targetAmount,
        frequency,
        installmentAmount: installmentAmount || Math.ceil(targetAmount / (frequency === "weekly" ? 12 : 3)),
      },
      supabase
    );
    return NextResponse.json({ plan }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not create plan" }, { status: 500 });
  }
}
