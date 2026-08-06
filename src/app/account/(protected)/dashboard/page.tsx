import { getSession } from "@/lib/auth";
import { database, formatNaira } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, PiggyBank } from "lucide-react";

export default async function CustomerDashboard() {
  const session = await getSession();
  if (!session) redirect("/account/login");

  const supabase = await createClient();
  const [orders, plans] = await Promise.all([
    database.getOrdersForUser(session.id, supabase),
    database.getPlansForUser(session.id, supabase),
  ]);

  const activePlans = plans.filter((p) => p.status === "active");
  const totalPaid = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0) + plans.reduce((sum, p) => sum + p.savedAmount, 0);
  const awaitingPayment = orders.filter((o) => o.paymentStatus === "awaiting_confirmation").length;

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Dashboard</h1>
      <p className="text-steel text-sm mb-8">Welcome back, {session.name || session.email}.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-line rounded-2xl p-5">
          <p className="text-xs font-data uppercase tracking-wider text-steel">Total Paid</p>
          <p className="font-display font-bold text-2xl mt-2">{formatNaira(totalPaid)}</p>
        </div>
        <div className="border border-line rounded-2xl p-5">
          <p className="text-xs font-data uppercase tracking-wider text-steel">Orders Awaiting Payment</p>
          <p className="font-display font-bold text-2xl mt-2">{awaitingPayment}</p>
        </div>
        <div className="border border-line rounded-2xl p-5">
          <p className="text-xs font-data uppercase tracking-wider text-steel">Active Save-to-Buy Plans</p>
          <p className="font-display font-bold text-2xl mt-2">{activePlans.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-semibold text-lg">Recent Orders</h2>
            <Link href="/account/orders" className="text-signal text-sm font-medium">View all →</Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-steel text-sm mb-3">No orders yet.</p>
              <Link href="/products" className="text-signal text-sm font-medium">Start shopping →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex justify-between items-center text-sm border-b border-line last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="font-data font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-steel capitalize">{o.status} · {o.paymentStatus.replace(/_/g, " ")}</p>
                  </div>
                  <p className="font-data font-medium">{formatNaira(o.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-semibold text-lg">Save-to-Buy Progress</h2>
            <Link href="/account/save-to-buy" className="text-signal text-sm font-medium">View all →</Link>
          </div>
          {plans.length === 0 ? (
            <div className="text-center py-6">
              <PiggyBank size={28} className="text-steel mx-auto mb-2" />
              <p className="text-steel text-sm">Start saving toward any device from its product page.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.slice(0, 4).map((p) => {
                const pct = Math.min(100, Math.round((p.savedAmount / p.targetAmount) * 100));
                return (
                  <Link key={p.id} href={`/account/save-to-buy/${p.id}`} className="block group">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium group-hover:text-signal transition-colors truncate pr-2">{p.productName}</span>
                      <span className="font-data text-steel shrink-0 flex items-center gap-1">
                        {pct}% <ArrowRight size={12} />
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-ink/5 overflow-hidden">
                      <div className="h-full bg-signal rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-steel mt-1">{formatNaira(p.savedAmount)} of {formatNaira(p.targetAmount)}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
