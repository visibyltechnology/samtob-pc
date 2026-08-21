import { database, formatNaira } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import PaymentStatusControl from "@/components/PaymentStatusControl";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const orders = await database.getOrders(supabase);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-steel text-sm">No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-line rounded-2xl p-5">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-data font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-steel mt-0.5">
                    {o.customerName} · {o.phone} · {o.email}
                  </p>
                  <p className="text-xs text-steel">{new Date(o.createdAt).toLocaleString("en-NG")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PaymentStatusControl orderId={o.id} paymentMethod={o.paymentMethod} paymentStatus={o.paymentStatus} />
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </div>
              </div>
              <div className="text-sm text-steel mb-2">
                {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
              </div>
              <div className="flex flex-wrap justify-between text-xs text-steel gap-2">
                <span className="capitalize">Region: {o.region} · Method: {o.deliveryMethod.replace(/-/g, " ")} · Payment: {o.paymentMethod.replace(/-/g, " ")}</span>
                <span className="font-data font-semibold text-ink">{formatNaira(o.total)}</span>
              </div>
              <p className="text-xs text-steel mt-2">Deliver to: {o.address}</p>
              {o.bankReference && (
                <p className="text-xs text-steel mt-1">Customer-provided reference: <span className="font-data">{o.bankReference}</span></p>
              )}
              {o.receiptUrl && (
                <div className="mt-3">
                  <a href={o.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-signal hover:underline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    View Uploaded Receipt
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
