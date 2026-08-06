"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "./motion/Toast";

export default function ContributionReviewControl({ contributionId }: { contributionId: string }) {
  const [loading, setLoading] = useState<"confirmed" | "rejected" | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  async function handle(status: "confirmed" | "rejected") {
    setLoading(status);
    try {
      const res = await fetch(`/api/save-to-buy/contributions/${contributionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showToast(status === "confirmed" ? "Contribution confirmed" : "Contribution rejected", status === "confirmed" ? "success" : "info");
      router.refresh();
    } catch {
      showToast("Could not update contribution", "error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handle("confirmed")}
        disabled={!!loading}
        className="text-xs font-data uppercase tracking-wider bg-mint/10 text-mint px-3 py-1.5 rounded-full hover:bg-mint hover:text-white transition-colors disabled:opacity-60"
      >
        {loading === "confirmed" ? "..." : "Confirm"}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handle("rejected")}
        disabled={!!loading}
        className="text-xs font-data uppercase tracking-wider bg-signal/10 text-signal px-3 py-1.5 rounded-full hover:bg-signal hover:text-white transition-colors disabled:opacity-60"
      >
        {loading === "rejected" ? "..." : "Reject"}
      </motion.button>
    </div>
  );
}
