"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(data.user.role === "admin" ? "/admin" : "/account/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="font-display font-bold text-3xl mb-2">Welcome back</h1>
      <p className="text-steel mb-8 text-sm">Log in to track your orders and checkout faster.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
        <PasswordInput value={password} onChange={setPassword} placeholder="Password" autoComplete="current-password" />
        {error && <p className="text-signal text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-ink text-paper py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors disabled:opacity-60">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="text-sm text-steel mt-6 text-center">
        Don&apos;t have an account? <Link href="/account/register" className="text-signal font-medium">Create one</Link>
      </p>
    </div>
  );
}
