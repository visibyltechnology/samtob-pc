"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck, X, CheckCircle2 } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";

type LegalType = "terms" | "privacy" | null;

const TERMS_CONTENT = (
  <div className="space-y-4 text-sm text-steel leading-relaxed">
    <p>By creating an account and using SAMTOB P&amp;C, you agree to our terms of service. All purchases are final once delivered and verified in good condition.</p>
    <h4 className="font-semibold text-ink text-base">No-Return &amp; No-Refund Policy</h4>
    <p>We operate a strict No-Return and No-Refund policy. Once an item is purchased and collected/delivered, it cannot be returned for a refund or exchanged unless it is Dead On Arrival (DOA) and verified by our technicians within 24 hours of delivery.</p>
    <h4 className="font-semibold text-ink text-base">Warranty</h4>
    <p>New devices come with a manufacturer warranty. UK-Used devices come with a 30-day warranty covering hardware defects only. Warranty does not cover physical damage, water damage, or software issues.</p>
    <h4 className="font-semibold text-ink text-base">Save-to-Buy Plans</h4>
    <p>Save-to-Buy instalments are non-refundable once a plan is active. Plans may be cancelled by the customer, but saved amounts will be held as store credit only.</p>
    <h4 className="font-semibold text-ink text-base">Pricing</h4>
    <p>All prices are displayed in Nigerian Naira (&#8358;) and are subject to change without prior notice. The price at the time of order placement is final.</p>
  </div>
);

const PRIVACY_CONTENT = (
  <div className="space-y-4 text-sm text-steel leading-relaxed">
    <p>We value your privacy and are committed to protecting your personal data in accordance with the Nigerian Data Protection Regulation (NDPR).</p>
    <h4 className="font-semibold text-ink text-base">Data We Collect</h4>
    <p>We collect your name, email address, phone number, and delivery address solely for the purpose of processing your orders and providing customer support.</p>
    <h4 className="font-semibold text-ink text-base">Data Processing Consent</h4>
    <p>By accepting this policy, you consent to our collection, use, and processing of your personal information solely for the purpose of fulfilling your order, providing customer support, and occasionally sending you updates about our services.</p>
    <h4 className="font-semibold text-ink text-base">Data Sharing</h4>
    <p>We do not sell or share your personal data with third parties except where required by law or necessary to fulfill your order (e.g., delivery partners).</p>
    <h4 className="font-semibold text-ink text-base">Your Rights</h4>
    <p>You have the right to request access to, correction, or deletion of your personal data at any time by contacting us via WhatsApp at 0803 443 6491.</p>
  </div>
);

function LegalModal({
  type,
  onAccept,
  onClose,
}: {
  type: "terms" | "privacy";
  onAccept: () => void;
  onClose: () => void;
}) {
  const title = type === "terms" ? "Terms & Conditions" : "Privacy Policy";
  const body = type === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-paper w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-line flex-shrink-0">
          <h3 className="font-display font-bold text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-ink/10 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">{body}</div>
        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-line flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onAccept}
            className="w-full bg-signal text-white py-3.5 rounded-full font-semibold text-sm hover:brightness-110 transition-all"
          >
            I Accept
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!agreedTerms || !agreedPrivacy) {
      setError("Please read and accept both the Terms & Conditions and Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      if (data.needsEmailConfirmation) {
        setNeedsConfirmation(true);
        return;
      }
      router.push("/account/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (needsConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-24 text-center"
      >
        <MailCheck size={40} className="text-mint mx-auto mb-4" />
        <h1 className="font-display font-bold text-2xl mb-2">Check your email</h1>
        <p className="text-steel text-sm mb-6">
          We sent a confirmation link to <span className="font-data text-ink">{email}</span>. Click it to
          activate your account, then come back and log in.
        </p>
        <Link href="/account/login" className="inline-flex bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-signal transition-colors">
          Go to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="font-display font-bold text-3xl mb-2">Create your account</h1>
        <p className="text-steel mb-8 text-sm">Track orders and checkout faster next time.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
          <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" autoComplete="tel" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
          <PasswordInput value={password} onChange={setPassword} placeholder="Password (min. 6 characters)" minLength={6} autoComplete="new-password" />

          {/* Legal checkboxes */}
          <div className="flex flex-col gap-3 py-2">
            {/* Terms card */}
            <div
              onClick={() => !agreedTerms && setActiveLegal("terms")}
              className={`flex items-start gap-3 border rounded-xl px-4 py-3.5 transition-all ${
                agreedTerms
                  ? "border-mint/40 bg-mint/5 cursor-default"
                  : "border-line hover:border-signal cursor-pointer"
              }`}
            >
              <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                agreedTerms ? "bg-mint border-mint" : "border-steel/40"
              }`}>
                {agreedTerms && <CheckCircle2 size={13} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-steel leading-snug">
                I have read and accept the{" "}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveLegal("terms"); }}
                  className="text-signal font-medium hover:underline"
                >
                  Terms &amp; Conditions
                </button>{" "}
                including the No-Return &amp; No-Refund policy.
              </span>
            </div>

            {/* Privacy card */}
            <div
              onClick={() => !agreedPrivacy && setActiveLegal("privacy")}
              className={`flex items-start gap-3 border rounded-xl px-4 py-3.5 transition-all ${
                agreedPrivacy
                  ? "border-mint/40 bg-mint/5 cursor-default"
                  : "border-line hover:border-signal cursor-pointer"
              }`}
            >
              <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                agreedPrivacy ? "bg-mint border-mint" : "border-steel/40"
              }`}>
                {agreedPrivacy && <CheckCircle2 size={13} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-steel leading-snug">
                I have read and accept the{" "}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveLegal("privacy"); }}
                  className="text-signal font-medium hover:underline"
                >
                  Privacy Policy
                </button>{" "}
                and consent to data processing.
              </span>
            </div>
          </div>

          {error && <p className="text-signal text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-ink text-paper py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-steel mt-6 text-center">
          Already have an account?{" "}
          <Link href="/account/login" className="text-signal font-medium">Log in</Link>
        </p>
      </div>

      {/* Legal Modals */}
      <AnimatePresence>
        {activeLegal && (
          <LegalModal
            type={activeLegal}
            onClose={() => setActiveLegal(null)}
            onAccept={() => {
              if (activeLegal === "terms") setAgreedTerms(true);
              if (activeLegal === "privacy") setAgreedPrivacy(true);
              setActiveLegal(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
