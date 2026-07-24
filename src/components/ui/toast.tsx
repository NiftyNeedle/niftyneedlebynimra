"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, X } from "lucide-react";

type ToastVariant = "success" | "info";
interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

const ToastContext = createContext<{
  toast: (message: string, variant?: ToastVariant) => void;
} | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className="glass pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-lift)]"
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  t.variant === "success"
                    ? "bg-sage-deep text-white"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {t.variant === "success" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
              </span>
              <p className="flex-1 text-sm text-foreground">{t.message}</p>
              <button
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="text-muted transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
