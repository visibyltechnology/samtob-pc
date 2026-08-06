"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartForm({
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
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAdd() {
    addItem({ productId, name, price, image, stock }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem({ productId, name, price, image, stock }, qty);
    router.push("/checkout");
  }

  if (stock <= 0) {
    return (
      <div className="rounded-full bg-ink/5 text-steel px-6 py-3.5 text-sm font-medium text-center">
        Currently out of stock — chat us on WhatsApp for restock alerts
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-line rounded-full">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-3 hover:text-signal"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <motion.span key={qty} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-8 text-center font-data text-sm inline-block">
            {qty}
          </motion.span>
          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            className="p-3 hover:text-signal"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-steel font-data">{stock} available</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          className="relative overflow-hidden inline-flex items-center gap-2 border border-ink px-6 py-3.5 rounded-full font-medium text-sm hover:border-signal hover:text-signal transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-mint"
              >
                <Check size={16} /> Added to cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart size={16} /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleBuyNow}
          className="inline-flex items-center gap-2 bg-signal text-white px-6 py-3.5 rounded-full font-medium text-sm hover:brightness-110 transition-[filter] glow-signal"
        >
          Buy Now
        </motion.button>
      </div>
    </div>
  );
}
