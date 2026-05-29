import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { HealthGrid } from "@/components/monitoring/health-grid";
import { AlertBanner } from "@/components/monitoring/alert-banner";
import { ClientHealthList } from "@/components/dashboard/client-health-list";
import { RecentReports } from "@/components/dashboard/recent-reports";
import { Users, FileText, Plug, AlertTriangle } from "lucide-react";

// Placeholder data — replaced with real DB queries in Week 3
const mockHealth = [
  {
    id: "1",
    clientName: "Acme Corp",
    platform: "ga4",
    status: "healthy" as const,
    lastSyncedAt: new Date(),
  },
  {
    id: "2",
    clientName: "Beta Agency",
    platform: "meta_ads",
    status: "degraded" as const,
    lastSyncedAt: new Date(),
  },
  {
    id: "3",
    clientName: "Gamma Inc",
    platform: "google_ads",
    status: "broken" as const,
    lastSyncedAt: null,
  },
];

const mockClients = [
  {
    id: "1",
    name: "Acme Corp",
    integrationCount: 3,
    worstStatus: "healthy" as const,
    lastReportDate: "May 1",
  },
  {
    id: "2",
    name: "Beta Agency",
    integrationCount: 2,
    worstStatus: "degraded" as const,
    lastReportDate: "Apr 15",
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
    title: "Beta Agency — May 2026",
    clientName: "Beta Agency",
    status: "sent" as const,
    sentAt: "May 1",
    opened: false,
    openCount: 0,
  },
  {
    id: "3",
    title: "Gamma Inc — May 2026",
    clientName: "Gamma Inc",
    status: "draft" as const,
    sentAt: null,
    opened: false,
    openCount: 0,
  },
];

const brokenCount = mockHealth.filter((h) => h.status === "broken").length;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Your agency&apos;s marketing health at a glance
        </p>
      </div>

      {/* Alert banner */}
      <AlertBanner count={brokenCount} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Clients"
          value={12}
          icon={<Users />}
        />
        <StatCard
          label="Reports sent"
          value={48}
          icon={<FileText />}
          trend="up"
          trendLabel="+8 this month"
        />
        <StatCard
          label="Integrations"
          value={34}
          icon={<Plug />}
        />
        <StatCard
          label="Alerts"
          value={brokenCount}
          icon={<AlertTriangle />}
          trend={brokenCount > 0 ? "down" : "neutral"}
          trendLabel={brokenCount > 0 ? "Needs attention" : "All clear"}
        />
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integration health */}
        <Card padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Integration Health</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <HealthGrid items={mockHealth} />
          </div>
        </Card>

        {/* Client health */}
        <Card padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <ClientHealthList clients={mockClients} />
          </div>
        </Card>
      </div>

      {/* Recent reports */}
      <Card padding="none">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <RecentReports reports={mockReports} />
        </div>
      </Card>
    </div>
  );
}
