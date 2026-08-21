"use client";

import { useState, useEffect } from "react";

export default function FlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    // 9 hours in milliseconds
    const DURATION = 9 * 60 * 60 * 1000;

    const calculateTimeLeft = () => {
      let endTime = parseInt(localStorage.getItem("flashSaleEndTime") || "0", 10);
      const now = Date.now();

      if (!endTime || now > endTime) {
        endTime = now + DURATION;
        localStorage.setItem("flashSaleEndTime", endTime.toString());
      }

      const diff = endTime - now;
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-xs text-steel mr-1 hidden sm:inline">Ends in:</span>
      <div className="flex flex-col items-center bg-[#F5F4F0] border border-signal rounded-md px-2 sm:px-3 py-1 min-w-[40px] sm:min-w-[48px]">
        <span className="font-display font-bold text-lg sm:text-xl text-signal leading-none">{timeLeft.hours}</span>
        <span className="text-[9px] text-steel uppercase">HRS</span>
      </div>
      <span className="font-bold text-xl text-signal mb-2">:</span>
      <div className="flex flex-col items-center bg-[#F5F4F0] border border-signal rounded-md px-2 sm:px-3 py-1 min-w-[40px] sm:min-w-[48px]">
        <span className="font-display font-bold text-lg sm:text-xl text-signal leading-none">{timeLeft.minutes}</span>
        <span className="text-[9px] text-steel uppercase">MIN</span>
      </div>
      <span className="font-bold text-xl text-signal mb-2">:</span>
      <div className="flex flex-col items-center bg-[#F5F4F0] border border-signal rounded-md px-2 sm:px-3 py-1 min-w-[40px] sm:min-w-[48px]">
        <span className="font-display font-bold text-lg sm:text-xl text-signal leading-none">{timeLeft.seconds}</span>
        <span className="text-[9px] text-steel uppercase">SEC</span>
      </div>
    </div>
  );
}
