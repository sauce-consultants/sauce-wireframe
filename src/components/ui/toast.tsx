"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (variant: ToastVariant, message: string, action?: Toast["action"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const variantIcon: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle size={20} className="text-success shrink-0" />,
  error: <AlertCircle size={20} className="text-danger shrink-0" />,
  warning: <AlertTriangle size={20} className="text-warning shrink-0" />,
  info: <Info size={20} className="text-accent shrink-0" />,
};

const variantBorder: Record<ToastVariant, string> = {
  success: "border-success",
  error: "border-danger",
  warning: "border-warning",
  info: "border-accent",
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (variant: ToastVariant, message: string, action?: Toast["action"]) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, variant, message, action }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, action ? 6000 : 4000);
    },
    []
  );

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-toast flex flex-col gap-2 max-sm:left-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 border-4 ${variantBorder[t.variant]} bg-white px-4 py-3 shadow-md animate-in`}
          >
            {variantIcon[t.variant]}
            <span className="text-sm font-semibold flex-1">{t.message}</span>
            {t.action && (
              <button
                type="button"
                className="text-sm font-semibold text-accent hover:underline"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-text-muted hover:text-black"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider, useToast, type ToastVariant };
