"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
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
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="font-display font-bold text-3xl mb-2">Create your account</h1>
      <p className="text-steel mb-8 text-sm">Track orders and checkout faster next time.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" autoComplete="tel" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
        <PasswordInput value={password} onChange={setPassword} placeholder="Password (min. 6 characters)" minLength={6} autoComplete="new-password" />
        {error && <p className="text-signal text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-ink text-paper py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors disabled:opacity-60">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-sm text-steel mt-6 text-center">
        Already have an account? <Link href="/account/login" className="text-signal font-medium">Log in</Link>
      </p>
    </div>
  );
}
