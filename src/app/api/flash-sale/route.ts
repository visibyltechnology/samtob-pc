import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { database } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_flash_sale", true)
      .limit(1)
      .maybeSingle();

    if (!data) {
      return NextResponse.json({ product: null });
    }
    
    // Convert to our Product type
    const products = await database.getProducts(supabase); // A bit wasteful to get all, but easiest mapping for now.
    const product = products.find(p => p.id === data.id) || null;
    
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch flash sale product" }, { status: 500 });
  }
}
