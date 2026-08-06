"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function OrderSuccessAnimation() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const colors = ["#E4141B", "#FF3B3F", "#0B0B0C", "#FAF9F6"];
    const duration = 1200;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.3 },
        colors,
        scalar: 0.8,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.3 },
        colors,
        scalar: 0.8,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.4 },
      colors,
      scalar: 0.9,
      startVelocity: 35,
    });
  }, []);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      className="w-16 h-16 mx-auto mb-4 rounded-full bg-mint/10 flex items-center justify-center"
    >
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <motion.circle
          cx="17"
          cy="17"
          r="15"
          stroke="#1F8A3B"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        />
        <motion.path
          d="M10 17.5L14.5 22L24 11.5"
          stroke="#1F8A3B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.55, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}
