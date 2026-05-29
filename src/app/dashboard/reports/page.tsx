"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Plus, Eye, EyeOff, Search } from "lucide-react";

const mockReports = [
  {
    id: "1",
    title: "Acme Corp — May 2026",
    clientName: "Acme Corp",
    status: "sent" as const,
    sentAt: "May 1, 2026",
    opened: true,
    openCount: 3,
  },
  {
    id: "2",
    title: "Beta Agency — May 2026",
    clientName: "Beta Agency",
    status: "sent" as const,
    sentAt: "May 1, 2026",
    opened: false,
    openCount: 0,
  },
  {
    id: "3",
    title: "Gamma Inc — May 2026",
    clientName: "Gamma Inc",
    status: "scheduled" as const,
    sentAt: null,
    opened: false,
    openCount: 0,
  },
  {
    id: "4",
    title: "Acme Corp — April 2026",
    clientName: "Acme Corp",
    status: "draft" as const,
    sentAt: null,
    opened: false,
    openCount: 0,
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockReports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">
            {mockReports.length} report{mockReports.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/dashboard/reports/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New report
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Reports list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Create your first report to start delivering insights to your clients."
          action={{
            label: "Create report",
            onClick: () => {},
          }}
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {filtered.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-lg bg-gray-100 p-2 shrink-0">
                    <FileText className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {report.clientName}
                      {report.sentAt ? ` · Sent ${report.sentAt}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {report.status === "sent" && (
                    <div className="hidden sm:flex items-center gap-1">
                      {report.opened ? (
                        <Eye className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      {report.openCount > 0 && (
                        <span className="text-xs text-gray-400">
                          {report.openCount}x
                        </span>
                      )}
                    </div>
                  )}
                  <Badge variant={report.status}>
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
