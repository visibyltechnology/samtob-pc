"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductImage({
  src,
  alt,
  badge,
  discount,
}: {
  src: string;
  alt: string;
  badge: string;
  discount: number | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const }}
      className="relative aspect-square bg-[#F5F4F0] rounded-2xl overflow-hidden group"
    >
      <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.4 }} className="absolute inset-0">
        <Image src={src} alt={alt} fill className="object-contain p-12" />
      </motion.div>
      <span className="absolute top-4 left-4 text-[10px] font-data uppercase tracking-wider bg-ink text-white px-2.5 py-1 rounded-full">
        {badge}
      </span>
      {discount && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
          className="absolute top-4 right-4 text-[10px] font-data uppercase tracking-wider bg-signal text-white px-2.5 py-1 rounded-full"
        >
          -{discount}%
        </motion.span>
      )}
    </motion.div>
  );
}
