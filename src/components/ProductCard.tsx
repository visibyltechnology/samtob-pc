"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Product } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import SignalBars from "./SignalBars";

export default function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 300, damping: 25 });
  const translateY = useSpring(0, { stiffness: 300, damping: 22 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleEnter() {
    translateY.set(-6);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
    translateY.set(0);
  }

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, y: translateY, transformPerspective: 800 }}
      className="h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col h-full rounded-2xl border border-line bg-white overflow-hidden hover:border-signal/40 transition-colors relative"
        style={{ boxShadow: "0 1px 2px rgba(11,11,12,0.04)" }}
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" style={{ boxShadow: "0 20px 40px -12px rgba(11,11,12,0.15)" }} />
        <div className="relative aspect-square bg-[#F5F4F0] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-contain p-6"
            />
          </motion.div>
          <span className="absolute top-3 left-3 text-[10px] font-data uppercase tracking-wider bg-ink text-white px-2 py-1 rounded-full">
            {product.condition === "new" ? "Brand New" : "UK Used"}
          </span>
          {discount && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
              className="absolute top-3 right-3 text-[10px] font-data uppercase tracking-wider bg-signal text-white px-2 py-1 rounded-full"
            >
              -{discount}%
            </motion.span>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <span className="text-xs uppercase tracking-wider text-steel font-data">{product.brand}</span>
          <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 group-hover:text-signal transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="font-data font-semibold text-ink">{formatNaira(product.price)}</span>
            {product.oldPrice && (
              <span className="font-data text-xs text-steel line-through">{formatNaira(product.oldPrice)}</span>
            )}
          </div>
          <SignalBars stock={product.stock} />
        </div>
      </Link>
    </motion.div>
  );
}
