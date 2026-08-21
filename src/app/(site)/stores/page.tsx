import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Store Locations",
  description: "Visit SAMTOB P&C physical stores in Mokola, Iwo Road and Challenge, Ibadan.",
};

const STORES = [
  {
    name: "Mokola Store",
    address: "T24, Ground Floor, GSM Plaza, Beside MRS Petrol Station, Mokola Roundabout, Ibadan",
    phone: "0803 443 6491",
  },
  {
    name: "Iwo Road Store",
    address: "Beside Bishop Phillips Academy, Iwo Road, Ibadan",
    phone: "0803 443 6491",
  },
  {
    name: "Challenge Store",
    address: "Suit B12, Middle Floor, Ogo Oluwa Shopping Complex, Opposite Fidelity Bank, Challenge, Ibadan",
    phone: "0803 443 6491",
  },
];

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs font-data uppercase tracking-widest text-signal">Visit Us</span>
      <h1 className="font-display font-bold text-3xl mt-1 mb-2">Our Store Locations</h1>
      <p className="text-steel mb-10 flex items-center gap-2 text-sm">
        <Clock size={16} className="text-signal" />
        Mon–Fri 9am–6pm · Sat 9:30am–5pm · Sun Closed
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        {STORES.map((s) => (
          <div key={s.name} className="border border-line rounded-2xl p-6 flex flex-col">
            <h2 className="font-display font-semibold text-lg mb-3">{s.name} ✔️</h2>
            <div className="flex gap-2 text-sm text-steel mb-4">
              <MapPin size={16} className="text-signal shrink-0 mt-0.5" />
              <span>{s.address}</span>
            </div>
            <a href={`tel:${s.phone}`} className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-signal">
              <Phone size={15} /> {s.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
