"use client";

import { useState } from "react";
import { useKlumpReady } from "@/lib/use-klump-ready";

interface KlumpCheckoutButtonProps {
  /** Sum of (unit_price * quantity) across items, PLUS shippingFee. Must match exactly. */
  amount: number;
  shippingFee: number;
  items: Array<{
    unit_price: number;
    quantity: number;
    name: string;
    image_url?: string;
  }>;
  customerEmail: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  merchantReference: string;
  redirectUrl: string;
  onSuccess: (reference: string) => void;
  /** Show a small on-screen debug panel. Defaults to true in development. */
  debug?: boolean;
}

const DEBUG_PREFIX = "[Klump]";

export default function KlumpCheckoutButton({
  amount,
  shippingFee,
  items,
  customerEmail,
  customerFirstName,
  customerLastName,
  customerPhone,
  merchantReference,
  redirectUrl,
  onSuccess,
  debug = process.env.NODE_ENV !== "production",
}: KlumpCheckoutButtonProps) {
  const klumpState = useKlumpReady(); // "checking" | "ready" | "error"
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>("idle");
  const [lastError, setLastError] = useState<string>("");

  function log(msg: string, ...rest: any[]) {
    console.debug(DEBUG_PREFIX, msg, ...rest);
    setLastAction(msg);
  }

  function handleClick() {
    log("button clicked");

    if (!window.Klump) {
      log("window.Klump missing at click time — aborting");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_KLUMP_PUBLIC_KEY || "";
    log("publicKey present?", !!publicKey, publicKey ? `${publicKey.slice(0, 10)}...` : "(empty)");

    const itemsTotal = items.reduce(
      (sum, i) => sum + Math.round(i.unit_price) * i.quantity,
      0
    );
    const expectedAmount = itemsTotal + Math.round(shippingFee);
    log("amount check", { passedInAmount: amount, itemsTotal, shippingFee, expectedAmount });

    if (expectedAmount !== Math.round(amount)) {
      log("⚠️ amount MISMATCH — Klump will likely reject this transaction");
    }

    // Klump's own client-side validator (decoded from klump.js) only allows
    // these exact top-level keys on `data`: email, phone, first_name,
    // last_name, redirect_url, merchant_reference, shipping_fee, meta_data,
    // shipping_data, mixpanel_distinct_id, amount, currency, items,
    // discount, tax. Any other key (e.g. "customer", "shopping_cart") makes
    // the whole payload invalid. `phone`, if present, must be EXACTLY 11
    // characters (e.g. "08012345678") or Klump throws synchronously.
    const normalizedPhone = (customerPhone || "").replace(/\D/g, "");
    const validPhone = normalizedPhone.length === 11 ? normalizedPhone : undefined;
    if (customerPhone && !validPhone) {
      log(`⚠️ phone "${customerPhone}" is not exactly 11 digits — omitting it (Klump would reject otherwise)`);
    }

    const data: Record<string, any> = {
      merchant_reference: merchantReference,
      amount: expectedAmount,
      shipping_fee: Math.round(shippingFee),
      currency: "NGN",
      redirect_url: redirectUrl,
      items: items.map((i) => ({
        unit_price: Math.round(i.unit_price),
        quantity: i.quantity,
        name: i.name,
        image_url: i.image_url,
      })),
    };
    if (customerEmail) data.email = customerEmail;
    if (customerFirstName) data.first_name = customerFirstName;
    if (customerLastName) data.last_name = customerLastName;
    if (validPhone) data.phone = validPhone;

    const payload = { publicKey, data };
    log("constructed payload", payload);

    setLoading(true);
    try {
      new window.Klump({
        ...payload,
        onLoad: (d: any) => log("Klump onLoad", d),
        onOpen: (d: any) => log("Klump onOpen", d),
        onSuccess: (d: { reference: string }) => {
          log("Klump onSuccess", d);
          setLoading(false);
          onSuccess(d.reference);
        },
        onError: (err: any) => {
          log("Klump onError", err);
          setLoading(false);
        },
        onClose: () => {
          log("Klump onClose");
          setLoading(false);
        },
      });
      log("new Klump(...) constructed without throwing");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(DEBUG_PREFIX, "new Klump(...) THREW:", message, err);
      setLastError(message);
      log("new Klump(...) THREW: " + message);
      setLoading(false);
    }
  }

  const isReady = klumpState === "ready";

  return (
    <div className="w-full">
      {klumpState === "error" ? (
        <button
          type="button"
          disabled
          className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium text-sm flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed shadow-md"
        >
          <span className="text-base font-semibold">Klump Widget Unavailable</span>
          <span className="text-xs text-zinc-400">Try a different payment method</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={!isReady || loading}
          className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium text-sm flex flex-col items-center justify-center gap-1 hover:bg-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <span className="text-base font-semibold">
            {loading
              ? "Initializing Klump..."
              : !isReady
              ? "Loading Klump Payment..."
              : "Pay with Klump — Buy Now, Pay Later"}
          </span>
          <span className="text-xs text-zinc-400">Klump Pay in Instalments</span>
        </button>
      )}

    </div>
  );
}