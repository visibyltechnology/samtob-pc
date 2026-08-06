import { NextRequest, NextResponse } from "next/server";
import { database, Product } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const condition = searchParams.get("condition");
  const brand = searchParams.get("brand");
  const q = searchParams.get("q")?.toLowerCase();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  let products = await database.getProducts();

  if (category) products = products.filter((p) => p.category === category);
  if (condition) products = products.filter((p) => p.condition === condition);
  if (brand) products = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  if (q)
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "newest") products = [...products].reverse();

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const supabase = await createClient();

  const product: Partial<Product> = {
    name: body.name,
    slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: body.category,
    condition: body.condition,
    brand: body.brand,
    price: Number(body.price),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
    specs: body.specs || {},
    stock: Number(body.stock) || 0,
    warrantyDays: Number(body.warrantyDays) || 0,
    description: body.description || "",
    images: body.images && body.images.length ? body.images : ["/images/products/laptop-1.svg"],
    featured: !!body.featured,
  };

  try {
    const saved = await database.saveProduct(product, supabase);
    return NextResponse.json({ product: saved }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Save failed" }, { status: 500 });
  }
}
