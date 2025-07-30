import { useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove toast
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const addToast = useCallback(
    (toast: { message: string; type: Toast["type"]; duration?: number }) => {
      showToast(toast.message, toast.type, toast.duration);
    },
    [showToast]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "success", duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "error", duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "warning", duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "info", duration);
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};
