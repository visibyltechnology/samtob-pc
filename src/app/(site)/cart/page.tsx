"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center"
      >
        <h1 className="font-display font-bold text-3xl mb-3">Your cart is empty</h1>
        <p className="text-steel mb-8">Browse our laptops, phones and gadgets to get started.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors">
          Shop All Products <ArrowRight size={16} />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-3xl mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex gap-4 border border-line rounded-2xl p-4 overflow-hidden"
              >
                <div className="relative w-24 h-24 bg-[#F5F4F0] rounded-xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-3" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-3">
                    <Link href="/products" className="font-display font-semibold text-sm leading-snug">{item.name}</Link>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove item"
                      className="text-steel hover:text-signal shrink-0"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                  <span className="font-data text-sm text-steel mt-1">{formatNaira(item.price)}</span>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-line rounded-full">
                      <button onClick={() => updateQty(item.productId, item.qty - 1)} className="p-2 hover:text-signal" aria-label="Decrease quantity">
                        <Minus size={12} />
                      </button>
                      <motion.span key={item.qty} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-6 text-center font-data text-xs">
                        {item.qty}
                      </motion.span>
                      <button onClick={() => updateQty(item.productId, item.qty + 1)} className="p-2 hover:text-signal" aria-label="Increase quantity">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-data font-semibold text-sm">{formatNaira(item.price * item.qty)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div layout className="border border-line rounded-2xl p-6 h-fit">
          <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-steel">Subtotal</span>
            <motion.span key={subtotal} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-data font-medium">
              {formatNaira(subtotal)}
            </motion.span>
          </div>
          <p className="text-xs text-steel mb-5">Delivery fee calculated at checkout based on location.</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-signal text-white py-3.5 rounded-full font-medium text-sm hover:brightness-110 transition-all"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
          </motion.div>
          <Link href="/products" className="block text-center text-sm text-steel hover:text-signal mt-4">
            Continue shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
