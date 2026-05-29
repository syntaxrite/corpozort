"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg",
        "animate-in fade-in slide-in-from-top-2 duration-200",
        type === "success"
          ? "bg-white border-emerald-200 text-emerald-800"
          : "bg-white border-red-200 text-red-800"
      )}
    >
      {type === "success" ? (
        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// Simple hook to use toasts
export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const show = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const hide = () => setToast(null);

  return { toast, show, hide };
}
