import { NextRequest, NextResponse } from "next/server";
import { database, Product } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = (await database.getProductBySlug(slug)) || (await database.getProductById(slug));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug: id } = await params;
  const body = await req.json();
  const supabase = await createClient();

  try {
    const updated = await database.saveProduct({ id, ...(body as Partial<Product>) }, supabase);
    return NextResponse.json({ product: updated });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug: id } = await params;
  const supabase = await createClient();
  await database.deleteProduct(id, supabase);
  return NextResponse.json({ success: true });
}
