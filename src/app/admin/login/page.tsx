"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function AdminLoginPage() {
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
      if (data.user.role !== "admin") throw new Error("This account does not have admin access");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="font-display font-bold text-3xl mb-2">Admin Login</h1>
      <p className="text-steel mb-8 text-sm">Manage products, orders and customers.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal" />
        <PasswordInput value={password} onChange={setPassword} placeholder="Password" autoComplete="current-password" />
        {error && <p className="text-signal text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-ink text-paper py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors disabled:opacity-60">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
