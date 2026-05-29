"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecentReports } from "@/components/dashboard/recent-reports";
import { HealthGrid } from "@/components/monitoring/health-grid";
import { ArrowLeft, Plus } from "lucide-react";

const mockClient = {
  id: "1",
  name: "Acme Corp",
  createdAt: "Jan 2026",
};

const mockIntegrations = [
  {
    id: "1",
    clientName: "Acme Corp",
    platform: "ga4",
    status: "healthy" as const,
    lastSyncedAt: new Date(),
  },
  {
    id: "2",
    clientName: "Acme Corp",
    platform: "google_ads",
    status: "healthy" as const,
    lastSyncedAt: new Date(),
  },
  {
    id: "3",
    clientName: "Acme Corp",
    platform: "meta_ads",
    status: "degraded" as const,
    lastSyncedAt: new Date(),
  },
];

const mockReports = [
  {
    id: "1",
    title: "Acme Corp — May 2026",
    clientName: "Acme Corp",
    status: "sent" as const,
    sentAt: "May 1",
    opened: true,
    openCount: 3,
  },
  {
    id: "2",
    title: "Acme Corp — April 2026",
    clientName: "Acme Corp",
    status: "sent" as const,
    sentAt: "Apr 1",
    opened: false,
    openCount: 0,
  },
];

export default function ClientPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/clients"
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-indigo-700">
              {mockClient.name[0]}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {mockClient.name}
            </h1>
            <p className="text-xs text-gray-500">
              Client since {mockClient.createdAt}
            </p>
          </div>
        </div>
        <Link href={`/dashboard/reports/new?client=${id}`}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New report
          </Button>
        </Link>
      </div>

      {/* Integration health */}
      <Card padding="none">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Integration Health</CardTitle>
          <Link
            href="/dashboard/integrations"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Manage →
          </Link>
        </CardHeader>
        <div className="px-6 pb-6">
          <HealthGrid items={mockIntegrations} />
        </div>
      </Card>

      {/* Reports */}
      <Card padding="none">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Reports</CardTitle>
          <Link
            href="/dashboard/reports"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all →
          </Link>
        </CardHeader>
        <div className="px-6 pb-6">
          <RecentReports reports={mockReports} />
        </div>
      </Card>
    </div>
  );
      }
