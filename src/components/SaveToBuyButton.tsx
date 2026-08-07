"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PiggyBank, X } from "lucide-react";
import { formatNaira } from "@/lib/format";
import { useToast } from "@/components/motion/Toast";

export default function SaveToBuyButton({
  productId,
  productName,
  productImage,
  price,
  isLoggedIn,
  open: controlledOpen,
  onOpenChange,
}: {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  isLoggedIn: boolean;
  // Omit these two to get the original self-contained trigger+modal (product page).
  // Pass them to run this as a controlled, trigger-less modal (checkout).
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [frequency, setFrequency] = useState<"weekly" | "monthly">("monthly");
  const [months, setMonths] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const periods = frequency === "weekly" ? months * 4 : months;
  const installment = Math.ceil(price / periods);

  async function handleStart() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/save-to-buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          productImage,
          targetAmount: price,
          frequency,
          installmentAmount: installment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start plan");
      showToast("Save-to-Buy plan started", "success");
      router.push(`/account/save-to-buy/${data.plan.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not start plan", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {!isControlled && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 border border-line px-6 py-3.5 rounded-full font-medium text-sm hover:border-signal hover:text-signal transition-colors"
        >
          <PiggyBank size={16} /> Save Toward This Device
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-semibold text-lg">Save-to-Buy</h2>
                <button onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
              </div>

              {!isLoggedIn ? (
                <div className="text-center py-4">
                  <p className="text-steel text-sm mb-4">Log in or create an account to start saving toward this device.</p>
                  <Link
                    href="/account/login"
                    className="inline-flex bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-signal transition-colors"
                  >
                    Log In
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-sm text-steel mb-4">{productName} — target {formatNaira(price)}</p>

                  <label className="block text-xs font-medium text-steel mb-1.5">Save</label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {(["weekly", "monthly"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFrequency(f)}
                        className={`py-2 rounded-lg text-sm font-medium border capitalize ${frequency === f ? "border-signal bg-signal/5 text-signal" : "border-line text-steel"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-medium text-steel mb-1.5">Over how many months?</label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full mb-1 accent-[var(--color-signal)]"
                  />
                  <p className="text-xs text-steel mb-4">{months} month{months > 1 ? "s" : ""}</p>

                  <div className="rounded-xl bg-signal/5 border border-signal/20 p-4 mb-4 text-center">
                    <p className="text-xs text-steel">You'll save</p>
                    <p className="font-display font-bold text-xl text-signal">{formatNaira(installment)}</p>
                    <p className="text-xs text-steel capitalize">per {frequency === "weekly" ? "week" : "month"} · {periods} payments</p>
                  </div>

                  <button
                    onClick={handleStart}
                    disabled={submitting}
                    className="w-full bg-signal text-white py-3 rounded-full text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
                  >
                    {submitting ? "Starting..." : "Start Saving"}
                  </button>
                  <p className="text-[11px] text-steel mt-3 text-center leading-relaxed">
                    You'll transfer each instalment to our bank account and confirm it in your dashboard — we verify and update your progress.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}