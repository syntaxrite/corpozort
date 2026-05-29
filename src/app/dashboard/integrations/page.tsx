"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertBanner } from "@/components/monitoring/alert-banner";
import {
  getPlatformName,
  getPlatformColor,
  isIntegrationBroken,
} from "@/lib/utils";
import { RefreshCw, Plus } from "lucide-react";

const platforms = [
  {
    key: "ga4",
    connections: [
      {
        id: "1",
        clientName: "Acme Corp",
        status: "healthy" as const,
        lastSyncedAt: new Date(),
      },
      {
        id: "2",
        clientName: "Beta Agency",
        status: "healthy" as const,
        lastSyncedAt: new Date(),
      },
    ],
  },
  {
    key: "google_ads",
    connections: [
      {
        id: "3",
        clientName: "Acme Corp",
        status: "healthy" as const,
        lastSyncedAt: new Date(),
      },
    ],
  },
  {
    key: "meta_ads",
    connections: [
      {
        id: "4",
        clientName: "Beta Agency",
        status: "degraded" as const,
        lastSyncedAt: new Date(),
      },
      {
        id: "5",
        clientName: "Gamma Inc",
        status: "broken" as const,
        lastSyncedAt: null,
      },
    ],
  },
  {
    key: "search_console",
    connections: [],
  },
];

const brokenCount = platforms
  .flatMap((p) => p.connections)
  .filter((c) => c.status === "broken").length;

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500">
            Monitor the health of all connected data sources
          </p>
        </div>
      </div>

      {/* Alert */}
      <AlertBanner count={brokenCount} />

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const broken = platform.connections.filter(
            (c) => c.status === "broken"
          ).length;
          const degraded = platform.connections.filter(
            (c) => c.status === "degraded"
          ).length;
          const overallStatus =
            broken > 0
              ? "broken"
              : degraded > 0
              ? "degraded"
              : platform.connections.length > 0
              ? "healthy"
              : null;

          return (
            <Card key={platform.key} padding="none">
              {/* Platform header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: getPlatformColor(platform.key),
                    }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {getPlatformName(platform.key)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {overallStatus && (
                    <Badge variant={overallStatus}>
                      {platform.connections.length} connected
                    </Badge>
                  )}
                  <Button size="icon" variant="ghost">
                    <Plus className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Connections */}
              <div className="px-5 py-3">
                {platform.connections.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-gray-400 mb-2">
                      No clients connected
                    </p>
                    <Button size="sm" variant="secondary">
                      Connect now
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {platform.connections.map((conn) => (
                      <div
                        key={conn.id}
                        className="flex items-center justify-between py-2.5"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {conn.clientName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {conn.lastSyncedAt
                              ? `Synced ${conn.lastSyncedAt.toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}`
                              : "Never synced"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={conn.status}>
                            {conn.status.charAt(0).toUpperCase() +
                              conn.status.slice(1)}
                          </Badge>
                          {conn.status === "broken" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-indigo-600 text-xs px-2"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Fix
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
