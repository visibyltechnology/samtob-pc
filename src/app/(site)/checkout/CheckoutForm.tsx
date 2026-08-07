"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";
import BankTransferDetails from "@/components/BankTransferDetails";
import KlumpCheckoutButton from "@/components/KlumpCheckoutButton";
import SaveToBuyButton from "@/components/SaveToBuyButton";

const REGIONS = [
  { value: "ibadan", label: "Within Ibadan" },
  { value: "southwest", label: "Outside Ibadan — South West" },
  { value: "eastern", label: "Outside Ibadan — Eastern Region" },
  { value: "northern", label: "Outside Ibadan — Northern Region" },
];

function methodsFor(region: string) {
  if (region === "ibadan")
    return [
      { value: "door-step", label: "Next day delivery — ₦2,000" },
      { value: "same-day", label: "Same day delivery — ₦2,500" },
    ];
  const labels: Record<string, [string, string]> = {
    southwest: ["₦6,000 (within 24hrs)", "₦8,000 (3-5 days)"],
    eastern: ["₦10,000 (within 24hrs)", "₦12,000 (3-5 days)"],
    northern: ["₦13,000 (within 48hrs)", "₦15,000 (5-7 days)"],
  };
  const [pickup, door] = labels[region] || ["", ""];
  return [
    { value: "park-pickup", label: `Park pick-up — ${pickup}` },
    { value: "door-step", label: `Door step delivery — ${door}` },
  ];
}

function computeFee(region: string, method: string, subtotal: number) {
  if (region === "ibadan") {
    if (subtotal >= 100000) return 0;
    return method === "same-day" ? 2500 : 2000;
  }
  const table: Record<string, Record<string, number>> = {
    southwest: { "park-pickup": 6000, "door-step": 8000 },
    eastern: { "park-pickup": 10000, "door-step": 12000 },
    northern: { "park-pickup": 13000, "door-step": 15000 },
  };
  return table[region]?.[method] ?? 0;
}

async function safeJson(
  res: Response,
): Promise<{ ok: boolean; data: any; error?: string }> {
  const text = await res.text();
  if (!text) {
    return {
      ok: false,
      data: null,
      error: "The server didn't respond. Please try again in a moment.",
    };
  }
  try {
    const data = JSON.parse(text);
    return {
      ok: res.ok,
      data,
      error: res.ok ? undefined : data.error || "Something went wrong",
    };
  } catch {
    return {
      ok: false,
      data: null,
      error: "The server returned an unexpected response. Please try again.",
    };
  }
}

type PendingOrder = { id: string; orderNumber: string; total: number };

export default function CheckoutForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("ibadan");
  const [method, setMethod] = useState("door-step");
  const [saveToBuyOpen, setSaveToBuyOpen] = useState(false);

  const [payment, setPayment] = useState
    <"bank-transfer" | "klump" | "save-to-buy"
  >("bank-transfer");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);

  const deliveryFee = useMemo(
    () => computeFee(region, method, subtotal),
    [region, method, subtotal],
  );
  const total = subtotal + deliveryFee;
  const methods = methodsFor(region);

  // Save-to-Buy targets one product — only offer it when the cart holds exactly one item.
  const soloItem = items.length === 1 ? items[0] : null;

  async function createOrder() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        email,
        phone,
        address,
        region,
        deliveryMethod: method,
        paymentMethod: payment,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
      }),
    });
    const result = await safeJson(res);
    if (!result.ok) throw new Error(result.error);
    return result.data.order as {
      id: string;
      orderNumber: string;
      total: number;
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (items.length === 0) return;
    if (payment === "save-to-buy") return; // handled entirely by the SaveToBuyButton modal
    setSubmitting(true);
    try {
      const order = await createOrder();
      if (payment === "bank-transfer") {
        clear();
        router.push(`/order-confirmation/${order.id}`);
      } else {
        // Klump: keep the cart until payment is actually verified, and reveal the Klump button
        setPendingOrder(order);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleKlumpSuccess(reference: string) {
    if (!pendingOrder) return;
    try {
      const res = await fetch("/api/klump/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, orderId: pendingOrder.id }),
      });
      const result = await safeJson(res);
      if (!result.ok) throw new Error(result.error);
      clear();
      router.push(`/order-confirmation/${pendingOrder.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't verify your Klump payment. Please contact us on WhatsApp with your order number.",
      );
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display font-bold text-3xl mb-3">
          Nothing to check out
        </h1>
        <p className="text-steel mb-8">
          Your cart is empty — add a product first.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-3xl mb-8">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[1fr_360px] gap-10"
      >
        <div className="space-y-8">
          <div>
            <h2 className="font-display font-semibold text-lg mb-4">
              Contact &amp; Delivery Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                disabled={!!pendingOrder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal disabled:opacity-60"
              />
              <input
                required
                disabled={!!pendingOrder}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal disabled:opacity-60"
              />
              <input
                required
                disabled={!!pendingOrder}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="border border-line rounded-xl px-4 py-3 text-sm sm:col-span-2 focus:outline-none focus:border-signal disabled:opacity-60"
              />
              <textarea
                required
                disabled={!!pendingOrder}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                rows={3}
                className="border border-line rounded-xl px-4 py-3 text-sm sm:col-span-2 focus:outline-none focus:border-signal disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display font-semibold text-lg mb-4">
              Delivery Region
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {REGIONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm cursor-pointer ${region === r.value ? "border-signal bg-signal/5" : "border-line"} ${pendingOrder ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <input
                    type="radio"
                    name="region"
                    value={r.value}
                    checked={region === r.value}
                    onChange={() => {
                      setRegion(r.value);
                      setMethod(
                        r.value === "ibadan" ? "door-step" : "park-pickup",
                      );
                    }}
                    className="accent-[var(--color-signal)]"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display font-semibold text-lg mb-4">
              Delivery Method
            </h2>
            <div className="grid gap-3">
              {methods.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm cursor-pointer ${method === m.value ? "border-signal bg-signal/5" : "border-line"} ${pendingOrder ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.value}
                    checked={method === m.value}
                    onChange={() => setMethod(m.value)}
                    className="accent-[var(--color-signal)]"
                  />
                  {m.label}
                </label>
              ))}
            </div>
            {region === "ibadan" && subtotal >= 100000 && (
              <p className="text-xs text-mint mt-2 font-data">
                ✓ You qualify for free delivery within Ibadan on this order.
              </p>
            )}
          </div>

          <div>
            <h2 className="font-display font-semibold text-lg mb-4">
              Payment Method
            </h2>
            <div className="grid gap-3">
              <label
                className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm cursor-pointer ${payment === "bank-transfer" ? "border-signal bg-signal/5" : "border-line"} ${pendingOrder ? "opacity-60 pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "bank-transfer"}
                  onChange={() => setPayment("bank-transfer")}
                  className="mt-0.5 accent-[var(--color-signal)]"
                />
                <span>
                  <span className="block font-medium">Bank Transfer</span>
                  <span className="text-xs text-steel">
                    Transfer directly to our corporate account. We confirm and
                    process once received.
                  </span>
                </span>
              </label>

              <label
                className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm cursor-pointer ${payment === "klump" ? "border-signal bg-signal/5" : "border-line"} ${pendingOrder ? "opacity-60 pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "klump"}
                  onChange={() => setPayment("klump")}
                  className="mt-0.5 accent-[var(--color-signal)]"
                />
                <span>
                  <span className="block font-medium">
                    Buy Now, Pay Later (Klump)
                  </span>
                  <span className="text-xs text-steel">
                    Split your payment with Klump. Subject to Klump's approval.
                  </span>
                </span>
              </label>

              {soloItem ? (
  <div
    onClick={() => {
      setPayment("save-to-buy");
      setSaveToBuyOpen(true);
    }}
    className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm cursor-pointer ${payment === "save-to-buy" ? "border-signal bg-signal/5" : "border-line"} ${pendingOrder ? "opacity-60 pointer-events-none" : ""}`}
  >
    <input
      type="radio"
      name="payment"
      checked={payment === "save-to-buy"}
      readOnly
      className="mt-0.5 accent-[var(--color-signal)]"
    />
    <span>
      <span className="block font-medium">Save to Buy (Layaway)</span>
      <span className="text-xs text-steel">
        Save towards this item at your own pace. Item ships once fully
        paid.
      </span>
    </span>
    <SaveToBuyButton
      productId={soloItem.productId}
      productName={soloItem.name}
      productImage={soloItem.image}
      price={soloItem.price}
      isLoggedIn={isLoggedIn}
      open={saveToBuyOpen}
      onOpenChange={setSaveToBuyOpen}
    />
  </div>
) : (
  <div className="flex items-start gap-3 border border-line rounded-xl px-4 py-3 text-sm opacity-50">
    <span>
      <span className="block font-medium">Save-to-Buy</span>
      <span className="text-xs text-steel">
        Only available when checking out a single item. Remove other
        items from your cart to use this option.
      </span>
    </span>
  </div>
)}
            </div>

            {payment === "bank-transfer" && !pendingOrder && (
              <div className="mt-4">
                <BankTransferDetails amount={formatNaira(total)} />
              </div>
            )}
          </div>
        </div>

        <div className="border border-line rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="font-display font-semibold text-lg mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span className="text-steel">
                  {i.name} × {i.qty}
                </span>
                <span className="font-data">
                  {formatNaira(i.price * i.qty)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-steel">Subtotal</span>
              <span className="font-data">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-steel">Delivery</span>
              <span className="font-data">
                {deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-line">
              <span>Total</span>
              <span className="font-data">{formatNaira(total)}</span>
            </div>
          </div>
          {error && <p className="text-signal text-sm mt-4">{error}</p>}

          {!pendingOrder ? (
            payment === "save-to-buy" ? (
              <p className="w-full mt-5 text-center text-sm text-steel border border-line rounded-full py-3.5">
               Log in or create an account to start saving toward this device.
              </p>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 bg-signal text-white py-3.5 rounded-full font-medium text-sm hover:brightness-110 transition-all disabled:opacity-60"
              >
                {submitting
                  ? "Processing..."
                  : payment === "klump"
                    ? "Continue to Klump"
                    : "Place Order"}
              </button>
            )
          ) : (
            <div className="mt-5">
              <KlumpCheckoutButton
                amount={pendingOrder.total}
                shippingFee={deliveryFee}
                items={items.map((i) => ({
                  unit_price: i.price,
                  quantity: i.qty,
                  name: i.name,
                  image_url:
                    typeof window !== "undefined"
                      ? `${window.location.origin}${i.image}`
                      : i.image,
                }))}
                customerEmail={email}
                customerFirstName={name.trim().split(" ")[0]}
                customerLastName={
                  name.trim().split(" ").slice(1).join(" ") || undefined
                }
                customerPhone={phone}
                merchantReference={pendingOrder.orderNumber}
                redirectUrl={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/order-confirmation/${pendingOrder.id}`
                    : ""
                }
                onSuccess={handleKlumpSuccess}
              />
              <p className="text-xs text-steel mt-3 text-center">
                Order {pendingOrder.orderNumber} created — click above to
                complete payment with Klump.
              </p>
            </div>
          )}

          <p className="text-[11px] text-steel mt-3 leading-relaxed">
            Orders received before 12noon ship same day; after 4pm ship the
            next working day.
          </p>
        </div>
      </form>
    </div>
  );
}