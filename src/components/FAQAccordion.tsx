"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./motion/Reveal";

export default function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-t border-b border-line">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <Reveal key={i} delay={Math.min(i * 0.04, 0.3)} y={12}>
            <div className="py-5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex justify-between items-center gap-4 text-left"
              >
                <span className="font-display font-semibold text-base">{`Q${i + 1}. ${item.q}`}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-signal text-xl leading-none shrink-0"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-steel text-sm leading-relaxed mt-3 pr-8">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
