"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { BANK_DETAILS } from "@/lib/payment-config";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard API unavailable — silently ignore, value is still visible to copy manually
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-steel font-data">{label}</p>
        <p className="font-data font-semibold text-sm">{value}</p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={handleCopy}
        className="p-2 rounded-full hover:bg-ink/5 text-steel hover:text-signal transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check size={16} className="text-mint" /> : <Copy size={16} />}
      </motion.button>
    </div>
  );
}

export default function BankTransferDetails({ amount, details = BANK_DETAILS }: { amount?: string; details?: typeof BANK_DETAILS }) {
  return (
    <div className="rounded-2xl border border-signal/20 bg-signal/5 p-5">
      <p className="text-sm font-semibold mb-1">Pay by Bank Transfer</p>
      <p className="text-xs text-steel mb-3">
        {amount ? `Transfer ${amount} to the account below.` : "Transfer the order total to the account below."} We'll confirm your payment and begin processing your order.
      </p>
      <div className="divide-y divide-signal/10">
        <CopyField label="Account Name" value={details.accountName} />
        <CopyField label="Account Number" value={details.accountNumber} />
        <CopyField label="Bank" value={details.bankName} />
      </div>
    </div>
  );
}
