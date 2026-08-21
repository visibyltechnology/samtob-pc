"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface KlumpCheckoutButtonProps {
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
}

function getKlump() {
  try {
    // eslint-disable-next-line no-eval
    return (0, eval)("Klump");
  } catch {
    return undefined;
  }
}

let klumpScriptPromise: Promise<void> | null = null;
function loadKlumpScript(): Promise<void> {
  if (klumpScriptPromise) return klumpScriptPromise;
  klumpScriptPromise = new Promise((resolve, reject) => {
    const scriptId = "klump-js-script";
    if (document.getElementById(scriptId)) { resolve(); return; }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://js.useklump.com/klump.js";
    script.onload = () => resolve();
    script.onerror = () => { klumpScriptPromise = null; reject(new Error("Failed to load Klump script")); };
    document.body.appendChild(script);
  });
  return klumpScriptPromise;
}

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
}: KlumpCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [klumpOpen, setKlumpOpen] = useState(false);
  const [error, setError] = useState("");

  // Force Klump iframes to lower z-index so cancel button stays on top
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (klumpOpen) {
      interval = setInterval(() => {
        document.querySelectorAll('iframe[src*="klump"], [id^="klump"]').forEach((el) => {
          const element = el as HTMLElement;
          if (element.style && element.id !== "klump__checkout") {
            element.style.setProperty("z-index", "2147483640", "important");
          }
        });
        // Also show the checkout div when open
        const div = document.getElementById("klump__checkout");
        if (div) div.style.display = "block";
      }, 200);
    } else {
      const div = document.getElementById("klump__checkout");
      if (div) div.style.display = "none";
    }
    return () => clearInterval(interval);
  }, [klumpOpen]);

  async function handleClick() {
    setLoading(true);
    setKlumpOpen(true);
    setError("");

    try {
      await loadKlumpScript();
      const KlumpCtor = getKlump();
      if (!KlumpCtor) throw new Error("Klump payment service unavailable. Check your connection.");

      const publicKey = process.env.NEXT_PUBLIC_KLUMP_PUBLIC_KEY || "";

      const normalizedPhone = (customerPhone || "").replace(/\D/g, "");
      const validPhone = normalizedPhone.length === 11 ? normalizedPhone : undefined;

      new KlumpCtor({
        publicKey,
        data: {
          amount,
          shipping_fee: shippingFee,
          currency: "NGN",
          redirect_url: redirectUrl,
          merchant_reference: merchantReference,
          ...(customerEmail ? { email: customerEmail } : {}),
          ...(customerFirstName ? { first_name: customerFirstName } : {}),
          ...(customerLastName ? { last_name: customerLastName } : {}),
          ...(validPhone ? { phone: validPhone } : {}),
          items: items.map((i) => ({
            image_url: i.image_url || "",
            name: i.name,
            unit_price: Math.round(i.unit_price),
            quantity: i.quantity,
          })),
        },
        onSuccess: (data: any) => {
          setKlumpOpen(false);
          setLoading(false);
          const ref = data?.data?.reference || data?.reference || merchantReference;
          onSuccess(ref);
        },
        onError: () => {
          setError("Klump payment failed or was declined. Please try again or use another method.");
          setLoading(false);
          setKlumpOpen(false);
        },
        onLoad: () => {
          // Klump loaded successfully
        },
        onClose: () => {
          setLoading(false);
          setKlumpOpen(false);
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load Klump. Please check your connection.";
      setError(msg);
      setLoading(false);
      setKlumpOpen(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium text-sm flex flex-col items-center justify-center gap-1 hover:bg-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        <span className="text-base font-semibold">
          {loading ? "Loading Klump..." : "Pay with Klump — Buy Now, Pay Later"}
        </span>
        <span className="text-xs text-zinc-400">Pay in installments with Klump</span>
      </button>

      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

      {klumpOpen && typeof document !== "undefined" && createPortal(
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 2147483647, display: "flex", justifyContent: "flex-end",
          padding: "12px 16px", pointerEvents: "none",
        }}>
          <button
            onClick={() => {
              try {
                const klumpDiv = document.getElementById("klump__checkout");
                if (klumpDiv) klumpDiv.innerHTML = "";
                document.querySelectorAll('[id^="klump"]').forEach((el) => {
                  if (el.id !== "klump__checkout") el.remove();
                });
                document.querySelectorAll('iframe[src*="klump"]').forEach((el) => el.remove());
                setKlumpOpen(false);
                setLoading(false);
                setError("Klump payment cancelled.");
              } catch {
                window.location.reload();
              }
            }}
            style={{
              pointerEvents: "auto", background: "#B30000", color: "#fff",
              border: "none", borderRadius: "50px", padding: "12px 22px",
              fontWeight: 800, fontSize: "14px", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            ✕ Cancel Payment
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}