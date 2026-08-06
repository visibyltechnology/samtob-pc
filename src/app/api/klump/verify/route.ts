import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Verifies a Klump transaction server-side (never trust the client alone) and,
 * if genuinely successful, marks the matching order as paid.
 *
 * Klump API reference: GET https://api.useklump.com/v1/transactions/:reference/verify
 * Auth header: klump-secret-key: <KLUMP_SECRET_KEY>
 * https://docs.useklump.com/docs/transaction-verification
 */
export async function POST(req: NextRequest) {
  const { reference, orderId } = await req.json();

  if (!reference || !orderId) {
    return NextResponse.json({ error: "reference and orderId are required" }, { status: 400 });
  }

  const secretKey = process.env.KLUMP_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Klump is not configured yet — add KLUMP_SECRET_KEY to your environment." },
      { status: 500 }
    );
  }

  try {
    const klumpRes = await fetch(
      `https://api.useklump.com/v1/transactions/${encodeURIComponent(reference)}/verify`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "klump-secret-key": secretKey,
        },
      }
    );
    const klumpData = await klumpRes.json();

    if (!klumpRes.ok || !klumpData?.data) {
      return NextResponse.json({ error: "Could not verify transaction with Klump" }, { status: 400 });
    }

    const { status, currency } = klumpData.data;
    const isSuccessful = status === "success" || status === "successful" || status === "completed";

    if (!isSuccessful || currency !== "NGN") {
      return NextResponse.json({ error: "Transaction was not successful", klumpData }, { status: 400 });
    }

    const supabase = createAdminClient();
    const order = await database.updateOrder(
      orderId,
      { paymentStatus: "paid", klumpReference: reference },
      supabase
    );

    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Verification request failed" },
      { status: 500 }
    );
  }
}
