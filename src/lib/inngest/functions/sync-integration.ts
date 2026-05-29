import { inngest } from "@/lib/inngest/client";
import { db } from "@/db";
import { integrations, metricSnapshots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdapter } from "@/lib/integrations";

export const syncIntegration = inngest.createFunction(
  { id: "sync-integration", name: "Sync Integration" },
  { cron: "0 */6 * * *" },
  async ({ step, logger }) => {
    const allIntegrations = await step.run(
      "fetch-integrations",
      async () => {
        return db
          .select()
          .from(integrations)
          .where(eq(integrations.status, "healthy"));
      }
    );

    logger.info(`Syncing ${allIntegrations.length} integrations`);

    for (const integration of allIntegrations) {
      await step.run(`sync-${integration.id}`, async () => {
        try {
          const adapter = await getAdapter(integration.platform);

          let accessToken = integration.accessToken;

          // Refresh token if expiring within 10 minutes
          if (
            integration.refreshToken &&
            integration.tokenExpiresAt &&
            new Date(integration.tokenExpiresAt).getTime() - Date.now() <
              10 * 60 * 1000
          ) {
            const refreshed = await adapter.refreshToken(
              integration.refreshToken
            );
            accessToken = refreshed.accessToken;

            await db
              .update(integrations)
              .set({
                accessToken: refreshed.accessToken,
                refreshToken: refreshed.refreshToken,
                tokenExpiresAt: refreshed.expiresAt,
              })
              .where(eq(integrations.id, integration.id));
          }

          const periodEnd = new Date();
          const periodStart = new Date();
          periodStart.setDate(periodStart.getDate() - 30);

          const metrics = await adapter.fetchMetrics(
            accessToken,
            periodStart,
            periodEnd
          );

          if (metrics.length > 0) {
            await db.insert(metricSnapshots).values(
              metrics.map((m) => ({
                tenantId: integration.tenantId,
                clientId: integration.clientId,
                integrationId: integration.id,
                metricKey: m.metricKey,
                value: m.value,
                periodStart: m.periodStart,
                periodEnd: m.periodEnd,
              }))
            );
          }

          await db
            .update(integrations)
            .set({
              lastSyncedAt: new Date(),
              status: "healthy",
            })
            .where(eq(integrations.id, integration.id));

        } catch (error) {
          logger.error(
            `Failed to sync integration ${integration.id}:`,
            error
          );

          await db
            .update(integrations)
            .set({ status: "broken" })
            .where(eq(integrations.id, integration.id));

          await inngest.send({
            name: "integration/failure",
            data: {
              integrationId: integration.id,
              tenantId: integration.tenantId,
              platform: integration.platform,
              clientId: integration.clientId,
            },
          });
        }
      });
    }

    return { synced: allIntegrations.length };
  }
);
