import { database } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import ProductManager from "@/components/ProductManager";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const products = await database.getProducts(supabase);
  return <ProductManager products={products} />;
}
