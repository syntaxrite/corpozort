import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { HealthGrid } from "@/components/monitoring/health-grid";
import { AlertBanner } from "@/components/monitoring/alert-banner";
import { AnomalyCard } from "@/components/monitoring/anomaly-card";
import { ClientHealthList } from "@/components/dashboard/client-health-list";
import { RecentReports } from "@/components/dashboard/recent-reports";
import { Users, FileText, Plug, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orgMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getDashboardStats,
  getIntegrationHealth,
  getRecentReports,
  getClientHealthList,
} from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // Get user's org
  const membership = await db
    .select()
    .from(orgMembers)
    .where(eq(orgMembers.userId, session.user.id))
    .limit(1)
    .then((r) => r[0]);

  if (!membership) redirect("/onboarding");

  const tenantId = membership.organizationId;

  // Fetch all real data in parallel
  const [stats, healthItems, recentReports, clientList] = await Promise.all([
    getDashboardStats(tenantId),
    getIntegrationHealth(tenantId),
    getRecentReports(tenantId),
    getClientHealthList(tenantId),
  ]);

  const firstName = session.user.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-gray-500">
          Your agency&apos;s marketing health at a glance
        </p>
      </div>

      {/* Alert banner */}
      <AlertBanner count={Number(stats.brokenCount)} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Clients"
          value={Number(stats.clientCount)}
          icon={Users}
        />
        <StatCard
          label="Reports sent"
          value={Number(stats.reportCount)}
          icon={FileText}
        />
        <StatCard
          label="Integrations"
          value={Number(stats.integrationCount)}
          icon={Plug}
        />
        <StatCard
          label="Alerts"
          value={Number(stats.brokenCount)}
          icon={AlertTriangle}
          trend={Number(stats.brokenCount) > 0 ? "down" : "neutral"}
          trendLabel={
            Number(stats.brokenCount) > 0 ? "Needs attention" : "All clear"
          }
        />
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Integration Health</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <HealthGrid items={healthItems} />
          </div>
        </Card>

        <Card padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <ClientHealthList clients={clientList} />
          </div>
        </Card>
      </div>

      {/* Recent reports */}
      <Card padding="none">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <RecentReports reports={recentReports} />
        </div>
      </Card>
    </div>
  );
}
