"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const COLORS: Record<ToastType, string> = {
  success: "text-mint",
  error: "text-signal",
  info: "text-ink",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-5 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="pointer-events-auto flex items-center gap-2.5 bg-white border border-line shadow-lg rounded-full pl-3 pr-5 py-2.5 min-w-[220px]"
              >
                <Icon size={18} className={COLORS[t.type]} />
                <span className="text-sm font-medium text-ink">{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
