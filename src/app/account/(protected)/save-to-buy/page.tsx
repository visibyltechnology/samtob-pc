import { getSession } from "@/lib/auth";
import { database, formatNaira } from "@/lib/db";
import Link from "next/link";
import { PiggyBank } from "lucide-react";

export default async function SaveToBuyListPage() {
  const session = await getSession();
  if (!session) return null;

  const plans = await database.getPlansForUser(session.id);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-2">Save-to-Buy</h1>
      <p className="text-steel mb-8 text-sm">Save weekly or monthly toward any device, then collect once fully paid.</p>

      {plans.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-line rounded-2xl">
          <PiggyBank size={32} className="text-steel mx-auto mb-3" />
          <p className="text-steel mb-4">You don&apos;t have any Save-to-Buy plans yet.</p>
          <Link href="/products" className="text-signal font-medium text-sm">Browse products to start saving →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((p) => {
            const pct = Math.min(100, Math.round((p.savedAmount / p.targetAmount) * 100));
            return (
              <Link key={p.id} href={`/account/save-to-buy/${p.id}`} className="block border border-line rounded-2xl p-5 hover:border-signal/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-display font-semibold text-sm">{p.productName}</p>
                  <span className={`text-[10px] font-data uppercase tracking-wider px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-mint/10 text-mint" : p.status === "cancelled" ? "bg-ink/5 text-steel" : "bg-signal/10 text-signal"}`}>
                    {p.status}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-ink/5 overflow-hidden mb-2">
                  <div className="h-full bg-signal rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-steel">
                  <span>{formatNaira(p.savedAmount)} of {formatNaira(p.targetAmount)}</span>
                  <span>{pct}%</span>
                </div>
                <p className="text-xs text-steel mt-2 capitalize">{formatNaira(p.installmentAmount)} / {p.frequency === "weekly" ? "week" : "month"}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
