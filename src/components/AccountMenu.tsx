"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, LayoutDashboard, Package, PiggyBank, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AccountMenu() {
  const { loading, loggedIn, email, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="hidden sm:block w-9 h-9 rounded-full bg-ink/5 animate-pulse" />;
  }

  if (!loggedIn) {
    return (
      <Link
        href="/account/login"
        aria-label="Log in"
        className="hidden sm:flex p-2 rounded-full hover:bg-ink/5 transition-colors"
      >
        <User size={20} />
      </Link>
    );
  }

  const firstName = profile?.name?.split(" ")[0] || email?.split("@")[0] || "Account";
  const dashboardHref = profile?.role === "admin" ? "/admin" : "/account/dashboard";

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 pl-2 pr-1.5 py-1.5 rounded-full hover:bg-ink/5 transition-colors"
      >
        <span className="w-6 h-6 rounded-full bg-signal/10 text-signal flex items-center justify-center text-xs font-data font-semibold">
          {firstName.charAt(0).toUpperCase()}
        </span>
        <span className="text-sm font-medium max-w-[100px] truncate">{firstName}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white border border-line rounded-2xl shadow-lg py-2 z-50"
          >
            {profile?.role === "admin" ? (
              <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink/5">
                <LayoutDashboard size={15} /> Admin Dashboard
              </Link>
            ) : (
              <>
                <Link href="/account/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink/5">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link href="/account/orders" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink/5">
                  <Package size={15} /> My Orders
                </Link>
                <Link href="/account/save-to-buy" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink/5">
                  <PiggyBank size={15} /> Save-to-Buy
                </Link>
              </>
            )}
            <div className="border-t border-line mt-1 pt-1">
              <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-signal hover:bg-signal/5">
                <LogOut size={15} /> Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
