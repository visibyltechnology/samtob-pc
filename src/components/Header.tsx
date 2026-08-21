"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import AccountMenu from "@/components/AccountMenu";

const NAV = [
  { href: "/products", label: "Shop All" },
  { href: "/products?category=laptops", label: "Laptops" },
  { href: "/products?category=phones", label: "Phones" },
  { href: "/products?category=gadgets", label: "Gadgets" },
  { href: "/delivery", label: "Delivery" },
  { href: "/stores", label: "Stores" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { loggedIn, profile } = useAuth();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className="sticky top-0 z-40 backdrop-blur border-b"
      animate={{
        backgroundColor: scrolled ? "rgba(250,249,246,0.9)" : "rgba(250,249,246,0.7)",
        borderColor: scrolled ? "rgba(230,228,221,1)" : "rgba(230,228,221,0)",
        boxShadow: scrolled ? "0 4px 20px -8px rgba(11,11,12,0.08)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="divider-wave" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between"
          animate={{ height: scrolled ? 68 : 80 }}
          transition={{ duration: 0.25 }}
        >
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo.jpg" alt="SAMTOB P&C Logo" width={280} height={72} className="h-16 w-auto object-contain mix-blend-multiply" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-ink/80 hover:text-signal transition-colors group py-1"
              >
                {item.label}
                <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-signal group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              aria-label="Search products"
              className="hidden sm:flex p-2 rounded-full hover:bg-ink/5 transition-colors"
            >
              <Search size={20} />
            </Link>
            <AccountMenu />
            <Link
              href="/cart"
              aria-label="View cart"
              className="relative p-2 rounded-full hover:bg-ink/5 transition-colors"
            >
              <ShoppingCart size={20} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1 bg-signal text-white text-[10px] font-data font-medium rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              className="lg:hidden p-2 rounded-full hover:bg-ink/5 transition-colors relative z-50"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {open ? <X size={22} /> : <Menu size={22} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-line bg-paper overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-sm font-medium border-b border-line/60"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={loggedIn ? (profile?.role === "admin" ? "/admin" : "/account/dashboard") : "/account/login"}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-signal"
              >
                {loggedIn ? `My Dashboard${profile?.name ? ` (${profile.name.split(" ")[0]})` : ""}` : "Account Login"}
              </Link>
              {loggedIn && (
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    setOpen(false);
                    window.location.href = "/";
                  }}
                  className="text-left py-2.5 text-sm font-medium text-steel"
                >
                  Log Out
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
