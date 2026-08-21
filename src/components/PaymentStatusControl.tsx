"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "./motion/Toast";

export default function PaymentStatusControl({
  orderId,
  paymentMethod,
  paymentStatus,
}: {
  orderId: string;
  paymentMethod: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (paymentStatus === "paid") {
    return <span className="text-xs font-data uppercase tracking-wider bg-mint/10 text-mint px-3 py-1 rounded-full">Paid</span>;
  }

  if (paymentMethod !== "bank-transfer") {
    return (
      <span className="text-xs font-data uppercase tracking-wider bg-signal/10 text-signal px-3 py-1 rounded-full">
        {paymentStatus.replace(/_/g, " ")}
      </span>
    );
  }

  async function markPaid() {
    if (!window.confirm("Are you sure you want to mark this payment as received? This action cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });
      if (!res.ok) throw new Error();
      showToast("Payment marked as received", "success");
      router.refresh();
    } catch {
      showToast("Could not update payment status", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={markPaid}
      disabled={loading}
      className="text-xs font-data uppercase tracking-wider bg-signal/10 text-signal px-3 py-1 rounded-full hover:bg-signal hover:text-white transition-colors disabled:opacity-60"
    >
      {loading ? "Updating..." : "Mark Payment Received"}
    </motion.button>
  );
}
