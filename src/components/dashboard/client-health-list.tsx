import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { IntegrationStatus } from "@/types";

interface ClientHealthItem {
  id: string;
  name: string;
  integrationCount: number;
  worstStatus: IntegrationStatus;
  lastReportDate: string | null;
}

interface ClientHealthListProps {
  clients: ClientHealthItem[];
}

export function ClientHealthList({ clients }: ClientHealthListProps) {
  if (clients.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        No clients added yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {clients.map((client) => (
        <Link
          key={client.id}
          href={`/clients/${client.id}`}
          className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-indigo-700">
                {client.name[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {client.name}
              </p>
              <p className="text-xs text-gray-500">
                {client.integrationCount} integration
                {client.integrationCount !== 1 ? "s" : ""}
                {client.lastReportDate
                  ? ` · Last report ${client.lastReportDate}`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={client.worstStatus}>
              {client.worstStatus.charAt(0).toUpperCase() +
                client.worstStatus.slice(1)}
            </Badge>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
