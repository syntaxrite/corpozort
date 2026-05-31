import { db } from "@/db";
import {
  clients,
  integrations,
  reports,
  reportDeliveries,
} from "@/db/schema";
import { eq, and, count, desc, sql } from "drizzle-orm";

export async function getDashboardStats(tenantId: string) {
  const [
    clientCount,
    integrationCount,
    reportCount,
    brokenCount,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(clients)
      .where(eq(clients.tenantId, tenantId))
      .then((r) => Number(r[0]?.count ?? 0)),

    db
      .select({ count: count() })
      .from(integrations)
      .where(eq(integrations.tenantId, tenantId))
      .then((r) => Number(r[0]?.count ?? 0)),

    db
      .select({ count: count() })
      .from(reports)
      .where(eq(reports.tenantId, tenantId))
      .then((r) => Number(r[0]?.count ?? 0)),

    db
      .select({ count: count() })
      .from(integrations)
      .where(
        and(
          eq(integrations.tenantId, tenantId),
          eq(integrations.status, "broken")
        )
      )
      .then((r) => Number(r[0]?.count ?? 0)),
  ]);

  return { clientCount, integrationCount, reportCount, brokenCount };
}

export async function getIntegrationHealth(tenantId: string) {
  // Single query with JOIN — no N+1
  const result = await db
    .select({
      id: integrations.id,
      clientName: clients.name,
      platform: integrations.platform,
      status: integrations.status,
      lastSyncedAt: integrations.lastSyncedAt,
    })
    .from(integrations)
    .innerJoin(clients, eq(clients.id, integrations.clientId))
    .where(eq(integrations.tenantId, tenantId))
    .limit(10);

  return result;
}

export async function getClientHealthList(tenantId: string) {
  // Get all clients
  const allClients = await db
    .select()
    .from(clients)
    .where(eq(clients.tenantId, tenantId))
    .limit(5);

  if (allClients.length === 0) return [];

  // Get all integrations for these clients in one query
  const clientIds = allClients.map((c) => c.id);
  const allIntegrations = await db
    .select({
      clientId: integrations.clientId,
      status: integrations.status,
    })
    .from(integrations)
    .where(eq(integrations.tenantId, tenantId));

  // Get last sent report per client in one query
  const lastReports = await db
    .select({
      clientId: reports.clientId,
      sentAt: reports.sentAt,
    })
    .from(reports)
    .where(
      and(
        eq(reports.tenantId, tenantId),
        eq(reports.status, "sent")
      )
    )
    .orderBy(desc(reports.sentAt));

  return allClients.map((client) => {
    const clientIntegrations = allIntegrations.filter(
      (i) => i.clientId === client.id
    );

    const worstStatus =
      clientIntegrations.some((i) => i.status === "broken")
        ? "broken"
        : clientIntegrations.some((i) => i.status === "degraded")
        ? "degraded"
        : "healthy";

    const lastReport = lastReports.find((r) => r.clientId === client.id);

    return {
      id: client.id,
      name: client.name,
      integrationCount: clientIntegrations.length,
      worstStatus: worstStatus as "healthy" | "degraded" | "broken",
      lastReportDate: lastReport?.sentAt
        ? new Date(lastReport.sentAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : null,
    };
  });
}

export async function getRecentReports(tenantId: string) {
  // Single query with JOIN
  const recentReports = await db
    .select({
      id: reports.id,
      title: reports.title,
      clientName: clients.name,
      status: reports.status,
      sentAt: reports.sentAt,
    })
    .from(reports)
    .innerJoin(clients, eq(clients.id, reports.clientId))
    .where(eq(reports.tenantId, tenantId))
    .orderBy(desc(reports.createdAt))
    .limit(5);

  if (recentReports.length === 0) return [];

  // Get deliveries for these reports in one query
  const reportIds = recentReports.map((r) => r.id);
  const deliveries = await db
    .select({
      reportId: reportDeliveries.reportId,
      openedAt: reportDeliveries.openedAt,
      openCount: reportDeliveries.openCount,
    })
    .from(reportDeliveries)
    .where(eq(reportDeliveries.tenantId, tenantId));

  return recentReports.map((report) => {
    const delivery = deliveries.find((d) => d.reportId === report.id);
    return {
      id: report.id,
      title: report.title,
      clientName: report.clientName,
      status: report.status,
      sentAt: report.sentAt
        ? new Date(report.sentAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : null,
      opened: !!delivery?.openedAt,
      openCount: delivery?.openCount ?? 0,
    };
  });
                }
