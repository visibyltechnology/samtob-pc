"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";

export default function StickyAddToCart({
  productId,
  name,
  price,
  image,
  stock,
}: {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}) {
  const [visible, setVisible] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 480);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (stock <= 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-line px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="min-w-0">
            <p className="text-xs text-steel truncate">{name}</p>
            <p className="font-data font-semibold text-sm">{formatNaira(price)}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addItem({ productId, name, price, image, stock }, 1)}
            className="shrink-0 bg-signal text-white px-5 py-2.5 rounded-full text-sm font-medium"
          >
            Add to Cart
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
