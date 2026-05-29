import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import type { ReportStatus } from "@/types";

interface RecentReport {
  id: string;
  title: string;
  clientName: string;
  status: ReportStatus;
  sentAt: string | null;
  opened: boolean;
  openCount: number;
}

interface RecentReportsProps {
  reports: RecentReport[];
}

export function RecentReports({ reports }: RecentReportsProps) {
  if (reports.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        No reports sent yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {reports.map((report) => (
        <Link
          key={report.id}
          href={`/reports/${report.id}`}
          className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {report.title}
            </p>
            <p className="text-xs text-gray-500">
              {report.clientName}
              {report.sentAt ? ` · ${report.sentAt}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {report.status === "sent" && (
              <div className="flex items-center gap-1">
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
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </Badge>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
