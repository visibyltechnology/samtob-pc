"use client";

import { useRouter } from "next/navigation";
import type { Order } from "@/lib/db";
import { useToast } from "./motion/Toast";

const STATUSES: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: Order["status"] }) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleChange(newStatus: string) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    showToast(`Order marked as ${newStatus}`, "success");
    router.refresh();
  }

  return (
    <select
      defaultValue={status}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-line rounded-full px-3 py-1.5 text-xs font-data capitalize focus:outline-none focus:border-signal"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
