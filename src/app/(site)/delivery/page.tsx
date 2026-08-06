import type { Metadata } from "next";
import { Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery & Shipping",
  description: "SAMTOB P&C delivery pricing within Ibadan and nationwide across South West, Eastern and Northern Nigeria.",
};

const ZONES = [
  {
    zone: "Within Ibadan",
    note: "Free delivery on orders ₦100,000 and above.",
    rows: [
      { label: "Next day delivery", price: "₦2,000" },
      { label: "Same day delivery", price: "₦2,500" },
    ],
  },
  {
    zone: "Outside Ibadan — South West",
    rows: [
      { label: "Park pick-up (within 24hrs)", price: "₦6,000" },
      { label: "Door step delivery (3–5 days)", price: "₦8,000" },
    ],
  },
  {
    zone: "Outside Ibadan — Eastern Region",
    rows: [
      { label: "Park pick-up (within 24hrs)", price: "₦10,000" },
      { label: "Door step delivery (3–5 days)", price: "₦12,000" },
    ],
  },
  {
    zone: "Outside Ibadan — Northern Region",
    rows: [
      { label: "Park pick-up (within 48hrs)", price: "₦13,000" },
      { label: "Door step delivery (5–7 days)", price: "₦15,000" },
    ],
  },
];

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs font-data uppercase tracking-widest text-signal">Logistics</span>
      <h1 className="font-display font-bold text-3xl mt-1 mb-2 flex items-center gap-3">
        <Truck className="text-signal" size={28} /> Delivery &amp; Shipping
      </h1>
      <p className="text-steel mb-10 max-w-2xl">
        We waybill twice daily — 12noon and 4pm. Orders received before 12noon are treated the same day;
        orders received after 4pm are treated the next working day.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {ZONES.map((z) => (
          <div key={z.zone} className="border border-line rounded-2xl p-6">
            <h2 className="font-display font-semibold text-lg mb-1">{z.zone}</h2>
            {z.note && <p className="text-xs text-mint font-data mb-3">{z.note}</p>}
            <div className="divide-y divide-line mt-4">
              {z.rows.map((r) => (
                <div key={r.label} className="flex justify-between py-2.5 text-sm">
                  <span className="text-steel">{r.label}</span>
                  <span className="font-data font-semibold">{r.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-signal/5 border border-signal/20 p-6 text-sm text-steel">
        Delivery fees are automatically calculated at checkout based on your selected region and delivery method.
      </div>
    </div>
  );
}
