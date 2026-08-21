import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { computeDeliveryFee } from "@/lib/format";
import { getSession } from "@/lib/auth";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  if (session.role === "admin") {
    const orders = await database.getOrders(supabase);
    return NextResponse.json({ orders });
  }
  const orders = await database.getOrdersForUser(session.id, supabase);
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    customerName,
    phone,
    email,
    address,
    region,
    deliveryMethod,
    items,
    paymentMethod,
    bankReference,
    receiptUrl,
  } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!["bank-transfer", "klump", "save-to-buy"].includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  const subtotal = items.reduce(
    (sum: number, i: { price: number; qty: number }) => sum + i.price * i.qty,
    0
  );
  const deliveryFee = computeDeliveryFee(region, deliveryMethod, subtotal);
  const orderNumber = "SMT-" + Date.now().toString().slice(-8);

  const supabase = createAdminClient();
  const session = await getSession();

  try {
    const order = await database.createOrder(
      {
        orderNumber,
        userId: session?.id || null,
        customerName,
        phone,
        email,
        address,
        region,
        deliveryMethod,
        deliveryFee,
        items,
        subtotal,
        total: subtotal + deliveryFee,
        paymentMethod,
        bankReference: bankReference || null,
        receiptUrl: receiptUrl || null,
      },
      supabase
    );
    return NextResponse.json({ order }, { status: 201 });
  } catch (e) {
    // ADD THIS CONSOLE LOG:
    console.error("🚨 DATABASE CREATION ERROR:", e); 
    
    return NextResponse.json({ error: e instanceof Error ? e.message : "Order failed" }, { status: 500 });
  }
}
