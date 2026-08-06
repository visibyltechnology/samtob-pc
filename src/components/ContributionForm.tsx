"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BankTransferDetails from "@/components/BankTransferDetails";
import { useToast } from "@/components/motion/Toast";

export default function ContributionForm({ planId, suggestedAmount }: { planId: string; suggestedAmount: number }) {
  const [amount, setAmount] = useState(suggestedAmount);
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/save-to-buy/${planId}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bankReference: reference || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not record contribution");
      showToast("Contribution submitted — awaiting confirmation", "success");
      setReference("");
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not record contribution", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <BankTransferDetails />
      <form onSubmit={handleSubmit} className="border border-line rounded-2xl p-5 space-y-3">
        <p className="text-sm font-semibold">Log a contribution</p>
        <p className="text-xs text-steel">After transferring, tell us how much and your reference so we can confirm it.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-steel mb-1">Amount (₦)</label>
            <input
              required
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border border-line rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] text-steel mb-1">Transfer reference</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Optional"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={submitting}
          className="w-full bg-signal text-white py-3 rounded-full text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "I've Made This Transfer"}
        </motion.button>
      </form>
    </div>
  );
}
