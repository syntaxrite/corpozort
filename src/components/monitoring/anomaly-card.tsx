import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import type { AnomalyAlert } from "@/types";

interface AnomalyCardProps {
  anomaly: AnomalyAlert;
}

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
  const isUp = anomaly.direction === "up";

  return (
    <Card className="flex items-start gap-4">
      <div
        className={cn(
          "rounded-xl p-2.5 shrink-0",
          isUp ? "bg-emerald-50" : "bg-red-50"
        )}
      >
        {isUp ? (
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {anomaly.clientName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {anomaly.metricKey} · {anomaly.platform}
            </p>
          </div>
          <span
            className={cn(
              "text-sm font-bold shrink-0",
              isUp ? "text-emerald-600" : "text-red-600"
            )}
          >
            {isUp ? "+" : ""}
            {anomaly.deltaPercent.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-400">
            {formatNumber(anomaly.previousValue)}
          </span>
          <span className="text-xs text-gray-300">→</span>
          <span className="text-xs font-medium text-gray-700">
            {formatNumber(anomaly.currentValue)}
          </span>
        </div>
      </div>
    </Card>
  );
}
