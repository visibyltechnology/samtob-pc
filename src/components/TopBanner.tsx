"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = sessionStorage.getItem("topBannerDismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("topBannerDismissed", "true");
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-signal text-white overflow-hidden"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 relative flex items-center justify-center">
            <Link 
              href="/products" 
              className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:brightness-110 transition-all text-center"
            >
              <Zap size={16} className="fill-white animate-pulse hidden sm:block" />
              <span>
                <strong className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded mr-2">Promo</strong>
                Up to 20% off selected UK used laptops! Shop now.
              </span>
            </Link>
            
            <button 
              onClick={handleDismiss}
              className="absolute right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
