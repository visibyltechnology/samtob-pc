import { database, formatNaira } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AnimatedCounter from "@/components/motion/AnimatedCounter";
import Reveal from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const products = await database.getProducts(supabase);
  const orders = await database.getOrders(supabase);
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stock <= 2);

  const stats = [
    { label: "Total Products", value: products.length, prefix: "", suffix: "" },
    { label: "Total Orders", value: orders.length, prefix: "", suffix: "" },
    { label: "Pending Orders", value: pending, prefix: "", suffix: "" },
    { label: "Total Revenue", value: revenue, prefix: "₦", suffix: "" },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Dashboard</h1>
      <p className="text-steel text-sm mb-8">Overview of your store performance.</p>

      <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <div className="border border-line rounded-2xl p-5">
              <p className="text-xs font-data uppercase tracking-wider text-steel">{s.label}</p>
              <p className="font-display font-bold text-2xl mt-2">
                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <Reveal delay={0.15} className="grid lg:grid-cols-2 gap-6">
        <div className="border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-semibold text-lg">Recent Orders</h2>
            <Link href="/admin/orders" className="text-signal text-sm font-medium">View all →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-steel text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex justify-between text-sm border-b border-line last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="font-data">{o.orderNumber}</p>
                    <p className="text-xs text-steel">{o.customerName}</p>
                  </div>
                  <p className="font-data font-medium">{formatNaira(o.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-semibold text-lg">Low Stock Alert</h2>
            <Link href="/admin/products" className="text-signal text-sm font-medium">Manage →</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-steel text-sm">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex justify-between text-sm border-b border-line last:border-0 pb-3 last:pb-0">
                  <p>{p.name}</p>
                  <p className="font-data text-signal">{p.stock} left</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
