import { db } from "@/db";
import {
  clients,
  integrations,
  reports,
  reportDeliveries,
  orgMembers,
} from "@/db/schema";
import { eq, and, count, desc } from "drizzle-orm";

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
      .then((r) => r[0]?.count ?? 0),

    db
      .select({ count: count() })
      .from(integrations)
      .where(eq(integrations.tenantId, tenantId))
      .then((r) => r[0]?.count ?? 0),

    db
      .select({ count: count() })
      .from(reports)
      .where(eq(reports.tenantId, tenantId))
      .then((r) => r[0]?.count ?? 0),

    db
      .select({ count: count() })
      .from(integrations)
      .where(
        and(
          eq(integrations.tenantId, tenantId),
          eq(integrations.status, "broken")
        )
      )
      .then((r) => r[0]?.count ?? 0),
  ]);

  return { clientCount, integrationCount, reportCount, brokenCount };
}

export async function getIntegrationHealth(tenantId: string) {
  const allIntegrations = await db
    .select({
      id: integrations.id,
      clientId: integrations.clientId,
      platform: integrations.platform,
      status: integrations.status,
      lastSyncedAt: integrations.lastSyncedAt,
    })
    .from(integrations)
    .where(eq(integrations.tenantId, tenantId))
    .limit(10);

  const withClientNames = await Promise.all(
    allIntegrations.map(async (integration) => {
      const client = await db
        .select({ name: clients.name })
        .from(clients)
        .where(eq(clients.id, integration.clientId))
        .limit(1)
        .then((r) => r[0]);

      return {
        ...integration,
        clientName: client?.name ?? "Unknown",
      };
    })
  );

  return withClientNames;
}

export async function getRecentReports(tenantId: string) {
  const recentReports = await db
    .select({
      id: reports.id,
      title: reports.title,
      clientId: reports.clientId,
      status: reports.status,
      sentAt: reports.sentAt,
    })
    .from(reports)
    .where(eq(reports.tenantId, tenantId))
    .orderBy(desc(reports.createdAt))
    .limit(5);

  const withDetails = await Promise.all(
    recentReports.map(async (report) => {
      const client = await db
        .select({ name: clients.name })
        .from(clients)
        .where(eq(clients.id, report.clientId))
        .limit(1)
        .then((r) => r[0]);

      const delivery = await db
        .select({
          openedAt: reportDeliveries.openedAt,
          openCount: reportDeliveries.openCount,
        })
        .from(reportDeliveries)
        .where(eq(reportDeliveries.reportId, report.id))
        .limit(1)
        .then((r) => r[0]);

      return {
        id: report.id,
        title: report.title,
        clientName: client?.name ?? "Unknown",
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
    })
  );

  return withDetails;
}

export async function getClientHealthList(tenantId: string) {
  const allClients = await db
    .select()
    .from(clients)
    .where(eq(clients.tenantId, tenantId))
    .limit(5);

  const withHealth = await Promise.all(
    allClients.map(async (client) => {
      const clientIntegrations = await db
        .select({ status: integrations.status })
        .from(integrations)
        .where(eq(integrations.clientId, client.id));

      const worstStatus =
        clientIntegrations.some((i) => i.status === "broken")
          ? "broken"
          : clientIntegrations.some((i) => i.status === "degraded")
          ? "degraded"
          : "healthy";

      const lastReport = await db
        .select({ sentAt: reports.sentAt })
        .from(reports)
        .where(
          and(
            eq(reports.clientId, client.id),
            eq(reports.status, "sent")
          )
        )
        .orderBy(desc(reports.sentAt))
        .limit(1)
        .then((r) => r[0]);

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
    })
  );

  return withHealth;
                        }
