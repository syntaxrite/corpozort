import { AlertTriangle, X } from "lucide-react";

interface AlertBannerProps {
  count: number;
  onDismiss?: () => void;
}

export function AlertBanner({ count, onDismiss }: AlertBannerProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 px-4 py-3 mb-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
        <p className="text-sm font-medium text-red-800">
          {count} integration{count > 1 ? "s" : ""} need
          {count === 1 ? "s" : ""} attention — reports may fail
        </p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
