"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/c/2348034436491"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#1F8A3B] text-white pl-3 pr-4 py-3 rounded-full shadow-lg hover:brightness-110 transition-[filter]"
    >
      <span className="relative flex items-center justify-center">
        <motion.span
          className="absolute w-full h-full rounded-full bg-white/40"
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <MessageCircle size={20} className="relative" />
      </span>
      <span className="text-sm font-medium hidden sm:inline">Order on WhatsApp</span>
    </motion.a>
  );
}
