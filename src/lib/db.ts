import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export { formatNaira, computeDeliveryFee } from "./format";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: "laptops" | "phones" | "gadgets";
  condition: "new" | "uk-used";
  brand: string;
  price: number;
  oldPrice: number | null;
  specs: Record<string, string>;
  stock: number;
  warrantyDays: number;
  description: string;
  images: string[];
  featured: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  region: "ibadan" | "southwest" | "eastern" | "northern";
  deliveryMethod: string;
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: "bank-transfer" | "klump" | "save-to-buy";
  paymentStatus: "awaiting_confirmation" | "paid" | "failed";
  bankReference: string | null;
  receiptUrl: string | null;
  klumpReference: string | null;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export type SaveToBuyPlan = {
  id: string;
  userId: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  targetAmount: number;
  savedAmount: number;
  frequency: "weekly" | "monthly";
  installmentAmount: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
};

export type Contribution = {
  id: string;
  planId: string;
  amount: number;
  bankReference: string | null;
  receiptUrl: string | null;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
  confirmedAt: string | null;
};

export type Review = { id: string; name: string; text: string; rating: number };

// ---------- row <-> app-shape mappers ----------

function toProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    category: r.category,
    condition: r.condition,
    brand: r.brand,
    price: r.price,
    oldPrice: r.old_price,
    specs: r.specs || {},
    stock: r.stock,
    warrantyDays: r.warranty_days,
    description: r.description,
    images: r.images || [],
    featured: r.featured,
  };
}

function fromProduct(p: Partial<Product>) {
  const row: Record<string, unknown> = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.category !== undefined) row.category = p.category;
  if (p.condition !== undefined) row.condition = p.condition;
  if (p.brand !== undefined) row.brand = p.brand;
  if (p.price !== undefined) row.price = p.price;
  if (p.oldPrice !== undefined) row.old_price = p.oldPrice;
  if (p.specs !== undefined) row.specs = p.specs;
  if (p.stock !== undefined) row.stock = p.stock;
  if (p.warrantyDays !== undefined) row.warranty_days = p.warrantyDays;
  if (p.description !== undefined) row.description = p.description;
  if (p.images !== undefined) row.images = p.images;
  if (p.featured !== undefined) row.featured = p.featured;
  return row;
}

function toOrder(r: any): Order {
  return {
    id: r.id,
    orderNumber: r.order_number,
    userId: r.user_id,
    customerName: r.customer_name,
    phone: r.phone,
    email: r.email,
    address: r.address,
    region: r.region,
    deliveryMethod: r.delivery_method,
    deliveryFee: r.delivery_fee,
    items: r.items,
    subtotal: r.subtotal,
    total: r.total,
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    bankReference: r.bank_reference,
    receiptUrl: r.receipt_url,
    klumpReference: r.klump_reference,
    status: r.status,
    createdAt: r.created_at,
  };
}

function toPlan(r: any): SaveToBuyPlan {
  return {
    id: r.id,
    userId: r.user_id,
    productId: r.product_id,
    productName: r.product_name,
    productImage: r.product_image,
    targetAmount: r.target_amount,
    savedAmount: r.saved_amount,
    frequency: r.frequency,
    installmentAmount: r.installment_amount,
    status: r.status,
    createdAt: r.created_at,
  };
}

function toContribution(r: any): Contribution {
  return {
    id: r.id,
    planId: r.plan_id,
    amount: r.amount,
    bankReference: r.bank_reference,
    receiptUrl: r.receipt_url,
    status: r.status,
    createdAt: r.created_at,
    confirmedAt: r.confirmed_at,
  };
}

// ---------- database access (Server Components / Route Handlers only) ----------
// Every function takes an optional client so API routes can pass an admin client
// (service role — bypasses RLS) while pages use the normal cookie-scoped client.

export const database = {
  async getProducts(client?: SupabaseClient): Promise<Product[]> {
    const supabase = client || (await createClient());
    const { data, error } = await supabase.from("products").select("*").order("created_at");
    if (error) throw error;
    return (data || []).map(toProduct);
  },

  async getProductBySlug(slug: string, client?: SupabaseClient): Promise<Product | undefined> {
    const supabase = client || (await createClient());
    const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
    return data ? toProduct(data) : undefined;
  },

  async getProductById(id: string, client?: SupabaseClient): Promise<Product | undefined> {
    const supabase = client || (await createClient());
    const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    return data ? toProduct(data) : undefined;
  },

  async saveProduct(product: Partial<Product> & { id?: string }, client: SupabaseClient): Promise<Product> {
    const row = fromProduct(product);
    if (product.id) {
      const { data, error } = await client.from("products").update(row).eq("id", product.id).select().single();
      if (error) throw error;
      return toProduct(data);
    }
    const { data, error } = await client.from("products").insert(row).select().single();
    if (error) throw error;
    return toProduct(data);
  },

  async deleteProduct(id: string, client: SupabaseClient) {
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) throw error;
  },

  async decrementStock(items: OrderItem[], client: SupabaseClient) {
    for (const item of items) {
      const { data } = await client.from("products").select("stock").eq("id", item.productId).single();
      if (data) {
        await client
          .from("products")
          .update({ stock: Math.max(0, data.stock - item.qty) })
          .eq("id", item.productId);
      }
    }
  },

  async getOrders(client: SupabaseClient): Promise<Order[]> {
    const { data, error } = await client.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(toOrder);
  },

  async getOrdersForUser(userId: string, client?: SupabaseClient): Promise<Order[]> {
    const supabase = client || (await createClient());
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(toOrder);
  },

  async getOrderById(id: string, client?: SupabaseClient): Promise<Order | undefined> {
    const supabase = client || (await createClient());
    const { data } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
    return data ? toOrder(data) : undefined;
  },

  async createOrder(
    order: {
      orderNumber: string;
      userId: string | null;
      customerName: string;
      phone: string;
      email: string;
      address: string;
      region: Order["region"];
      deliveryMethod: string;
      deliveryFee: number;
      items: OrderItem[];
      subtotal: number;
      total: number;
      paymentMethod: Order["paymentMethod"];
      bankReference?: string | null;
      receiptUrl?: string | null;
    },
    client: SupabaseClient
  ): Promise<Order> {
    const { data, error } = await client
      .from("orders")
      .insert({
        order_number: order.orderNumber,
        user_id: order.userId,
        customer_name: order.customerName,
        phone: order.phone,
        email: order.email,
        address: order.address,
        region: order.region,
        delivery_method: order.deliveryMethod,
        delivery_fee: order.deliveryFee,
        items: order.items,
        subtotal: order.subtotal,
        total: order.total,
        payment_method: order.paymentMethod,
        bank_reference: order.bankReference || null,
        receipt_url: order.receiptUrl || null,
      })
      .select()
      .single();
    if (error) throw error;
    await database.decrementStock(order.items, client);
    return toOrder(data);
  },

  async updateOrder(
    id: string,
    fields: Partial<Pick<Order, "status" | "paymentStatus" | "klumpReference">>,
    client: SupabaseClient
  ): Promise<Order | undefined> {
    const row: Record<string, unknown> = {};
    if (fields.status !== undefined) row.status = fields.status;
    if (fields.paymentStatus !== undefined) row.payment_status = fields.paymentStatus;
    if (fields.klumpReference !== undefined) row.klump_reference = fields.klumpReference;
    const { data, error } = await client.from("orders").update(row).eq("id", id).select().single();
    if (error) throw error;
    return toOrder(data);
  },

  async getReviews(client?: SupabaseClient): Promise<Review[]> {
    const supabase = client || (await createClient());
    const { data, error } = await supabase.from("reviews").select("*").order("created_at");
    if (error) throw error;
    return data || [];
  },

  // ---- Save-to-Buy ----

  async getPlansForUser(userId: string, client?: SupabaseClient): Promise<SaveToBuyPlan[]> {
    const supabase = client || (await createClient());
    const { data, error } = await supabase
      .from("save_to_buy_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(toPlan);
  },

  async getAllPlans(client: SupabaseClient): Promise<SaveToBuyPlan[]> {
    const { data, error } = await client
      .from("save_to_buy_plans")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(toPlan);
  },

  async createPlan(
    plan: {
      userId: string;
      productId: string | null;
      productName: string;
      productImage: string | null;
      targetAmount: number;
      frequency: "weekly" | "monthly";
      installmentAmount: number;
    },
    client?: SupabaseClient
  ): Promise<SaveToBuyPlan> {
    const supabase = client || (await createClient());
    const { data, error } = await supabase
      .from("save_to_buy_plans")
      .insert({
        user_id: plan.userId,
        product_id: plan.productId,
        product_name: plan.productName,
        product_image: plan.productImage,
        target_amount: plan.targetAmount,
        frequency: plan.frequency,
        installment_amount: plan.installmentAmount,
      })
      .select()
      .single();
    if (error) throw error;
    return toPlan(data);
  },

  async getContributionsForPlan(planId: string, client?: SupabaseClient): Promise<Contribution[]> {
    const supabase = client || (await createClient());
    const { data, error } = await supabase
      .from("save_to_buy_contributions")
      .select("*")
      .eq("plan_id", planId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(toContribution);
  },

  async getAllPendingContributions(client: SupabaseClient): Promise<(Contribution & { plan: SaveToBuyPlan })[]> {
    const { data, error } = await client
      .from("save_to_buy_contributions")
      .select("*, save_to_buy_plans(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((r: any) => ({ ...toContribution(r), plan: toPlan(r.save_to_buy_plans) }));
  },

  async createContribution(
    contribution: { planId: string; amount: number; bankReference: string | null; receiptUrl: string | null },
    client?: SupabaseClient
  ): Promise<Contribution> {
    const supabase = client || (await createClient());
    const { data, error } = await supabase
      .from("save_to_buy_contributions")
      .insert({
        plan_id: contribution.planId,
        amount: contribution.amount,
        bank_reference: contribution.bankReference,
        receipt_url: contribution.receiptUrl,
      })
      .select()
      .single();
    if (error) throw error;
    return toContribution(data);
  },

  async updateContributionStatus(
    id: string,
    status: "confirmed" | "rejected",
    client: SupabaseClient
  ): Promise<Contribution> {
    const { data, error } = await client
      .from("save_to_buy_contributions")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toContribution(data);
  },
};
