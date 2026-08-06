import { getSession } from "@/lib/auth";
import { database, formatNaira } from "@/lib/db";
import Link from "next/link";

export default async function AccountOrdersPage() {
  const session = await getSession();
  if (!session) return null;

  const orders = await database.getOrdersForUser(session.id);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-2">My Orders</h1>
      <p className="text-steel mb-8 text-sm">Signed in as {session.email}</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-line rounded-2xl">
          <p className="text-steel mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="text-signal font-medium text-sm">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-line rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-data font-medium text-sm">{o.orderNumber}</span>
                  <p className="text-xs text-steel mt-0.5">{new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs font-data uppercase tracking-wider px-3 py-1 rounded-full capitalize ${o.paymentStatus === "paid" ? "bg-mint/10 text-mint" : "bg-signal/10 text-signal"}`}>
                    {o.paymentStatus.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-data uppercase tracking-wider bg-ink/5 px-3 py-1 rounded-full capitalize">{o.status}</span>
                </div>
              </div>
              <div className="text-sm text-steel">
                {o.items.map((i) => i.name).join(", ")}
              </div>
              {o.paymentMethod === "bank-transfer" && o.paymentStatus === "awaiting_confirmation" && (
                <p className="text-xs text-signal mt-2">Awaiting your bank transfer confirmation — send us your reference on WhatsApp to speed this up.</p>
              )}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-line">
                <span className="text-xs text-steel">{o.items.reduce((s, i) => s + i.qty, 0)} item(s)</span>
                <span className="font-data font-semibold text-sm">{formatNaira(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
