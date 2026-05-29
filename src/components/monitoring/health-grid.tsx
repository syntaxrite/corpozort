"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPlatformName, getPlatformColor } from "@/lib/utils";
import type { IntegrationStatus } from "@/types";
import { RefreshCw } from "lucide-react";

interface HealthItem {
  id: string;
  clientName: string;
  platform: string;
  status: IntegrationStatus;
  lastSyncedAt: Date | null;
}

interface HealthGridProps {
  items: HealthItem[];
  onReconnect?: (id: string) => void;
}

export function HealthGrid({ items, onReconnect }: HealthGridProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        No integrations connected yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-3 gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: getPlatformColor(item.platform) }}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.clientName}
              </p>
              <p className="text-xs text-gray-500">
                {getPlatformName(item.platform)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={item.status}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            {item.status === "broken" && onReconnect && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onReconnect(item.id)}
                className="text-indigo-600 hover:text-indigo-700 text-xs px-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Fix
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
