"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(30);
  const springX = useSpring(glowX, { stiffness: 60, damping: 20 });
  const springY = useSpring(glowY, { stiffness: 60, damping: 20 });
  const glowBackground = useMotionTemplate`radial-gradient(600px circle at ${springX}% ${springY}%, rgba(228,20,27,0.12), transparent 70%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden border-b border-line mesh-bg"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{ background: glowBackground }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center relative">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 text-xs font-data uppercase tracking-widest text-signal mb-5"
          >
            <span className="signal-bars active-4">
              <span /><span /><span /><span />
            </span>
            Nationwide Delivery &middot; Warranty on Every Device
          </motion.span>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight overflow-hidden">
            <motion.span variants={item} className="block">A strong signal for</motion.span>
            <motion.span variants={item} className="block">
              your next <span className="text-gradient-signal">device</span>.
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-6 text-steel text-lg max-w-xl mx-auto leading-relaxed">
            New &amp; UK used laptops, phones and gadgets — tested, warrantied,
            and delivered to your door anywhere in Nigeria.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors glow-signal"
              >
                Shop All Products <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a
                href="https://wa.me/c/2348034436491"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 rounded-full font-medium text-sm hover:border-signal hover:text-signal transition-colors"
              >
                Chat on WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
