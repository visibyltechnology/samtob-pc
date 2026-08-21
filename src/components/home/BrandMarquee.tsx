"use client";

import { motion } from "framer-motion";

const BRANDS = ["Apple", "Samsung", "HP", "Dell", "Lenovo", "JBL", "Anker", "Asus"];

export default function BrandMarquee() {
  const loop = [...BRANDS, ...BRANDS];

  return (
    <div className="relative overflow-hidden border-y border-line bg-white py-6">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
      <motion.div
        className="flex gap-16 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((brand, i) => (
          <span
            key={i}
            className="font-display font-bold text-xl sm:text-2xl text-signal tracking-tight whitespace-nowrap select-none"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
