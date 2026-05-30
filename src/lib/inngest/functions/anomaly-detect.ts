import { inngest } from "@/lib/inngest/client";
import { db } from "@/db";
import {
  metricSnapshots,
  clients,
  orgMembers,
  user,
  organizations,
} from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { Resend } from "resend";
import { getPlatformName } from "@/lib/utils";
import type { AnomalyAlert } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

const ANOMALY_THRESHOLD = 0.25; // 25% delta

export const anomalyDetect = inngest.createFunction(
  { id: "anomaly-detect", name: "Anomaly Detection" },
  { cron: "0 9 * * *" }, // daily at 9am
  async ({ step, logger }) => {
    // Get all clients
    const allClients = await step.run("get-clients", async () => {
      return db.select().from(clients);
    });

    logger.info(`Running anomaly detection for ${allClients.length} clients`);

    const anomaliesFound: AnomalyAlert[] = [];

    for (const client of allClients) {
      await step.run(`detect-${client.id}`, async () => {
        // Current period — last 7 days
        const currentEnd = new Date();
        const currentStart = new Date();
        currentStart.setDate(currentStart.getDate() - 7);

        // Previous period — 7 days before that
        const previousEnd = new Date(currentStart);
        const previousStart = new Date(previousEnd);
        previousStart.setDate(previousStart.getDate() - 7);

        // Get current metrics
        const currentMetrics = await db
          .select()
          .from(metricSnapshots)
          .where(
            and(
              eq(metricSnapshots.clientId, client.id),
              gte(metricSnapshots.periodStart, currentStart),
              lte(metricSnapshots.periodEnd, currentEnd)
            )
          );

        // Get previous metrics
        const previousMetrics = await db
          .select()
          .from(metricSnapshots)
          .where(
            and(
              eq(metricSnapshots.clientId, client.id),
              gte(metricSnapshots.periodStart, previousStart),
              lte(metricSnapshots.periodEnd, previousEnd)
            )
          );

        if (currentMetrics.length === 0 || previousMetrics.length === 0) {
          return;
        }

        // Compare metrics
        for (const current of currentMetrics) {
          const previous = previousMetrics.find(
            (p) =>
              p.metricKey === current.metricKey &&
              p.integrationId === current.integrationId
          );

          if (!previous || previous.value === 0) continue;

          const delta = (current.value - previous.value) / previous.value;

          if (Math.abs(delta) >= ANOMALY_THRESHOLD) {
            anomaliesFound.push({
              clientId: client.id,
              clientName: client.name,
              platform: "ga4", // resolved from integrationId in production
              metricKey: current.metricKey,
              previousValue: previous.value,
              currentValue: current.value,
              deltaPercent: delta * 100,
              direction: delta > 0 ? "up" : "down",
            });
          }
        }

        // If anomalies found for this client, alert the agency owner
        if (anomaliesFound.length > 0) {
          const owner = await db
            .select({ email: user.email, name: user.name })
            .from(orgMembers)
            .innerJoin(user, eq(user.id, orgMembers.userId))
            .where(eq(orgMembers.orgId, client.tenantId))
            .limit(1)
            .then((r) => r[0]);

          if (!owner) return;

          const anomalyRows = anomaliesFound
            .filter((a) => a.clientId === client.id)
            .map(
              (a) => `
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">
                  ${a.metricKey}
                </td>
                <td style="padding: 8px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">
                  ${a.previousValue.toLocaleString()}
                </td>
                <td style="padding: 8px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">
                  ${a.currentValue.toLocaleString()}
                </td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #F3F4F6; color: ${
                  a.direction === "up" ? "#059669" : "#DC2626"
                }">
                  ${a.direction === "up" ? "↑" : "↓"} ${Math.abs(
                a.deltaPercent
              ).toFixed(1)}%
                </td>
              </tr>
            `
            )
            .join("");

          await resend.emails.send({
            from: "Corpozort <alerts@corpozort.tech>",
            to: owner.email,
            subject: `📊 Anomaly detected — ${client.name}`,
            html: `
              <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px;">
                <p style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 8px;">
                  Corpozort
                </p>
                <h1 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 8px;">
                  Unusual activity detected
                </h1>
                <p style="font-size: 14px; color: #6B7280; margin: 0 0 24px;">
                  Corpozort detected metric changes exceeding 25% for 
                  <strong>${client.name}</strong> in the last 7 days.
                </p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <thead>
                    <tr>
                      <th style="text-align: left; font-size: 12px; color: #9CA3AF; padding-bottom: 8px; border-bottom: 2px solid #F3F4F6;">Metric</th>
                      <th style="text-align: left; font-size: 12px; color: #9CA3AF; padding-bottom: 8px; border-bottom: 2px solid #F3F4F6;">Previous</th>
                      <th style="text-align: left; font-size: 12px; color: #9CA3AF; padding-bottom: 8px; border-bottom: 2px solid #F3F4F6;">Current</th>
                      <th style="text-align: left; font-size: 12px; color: #9CA3AF; padding-bottom: 8px; border-bottom: 2px solid #F3F4F6;">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${anomalyRows}
                  </tbody>
                </table>
                <a
                  href="${process.env.BETTER_AUTH_URL}/dashboard/clients/${client.id}"
                  style="display: inline-block; background: #4F46E5; color: white; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none;"
                >
                  View client →
                </a>
                <p style="font-size: 12px; color: #9CA3AF; margin: 24px 0 0;">
                  Corpozort monitors your clients daily and alerts you before they notice.
                </p>
              </div>
            `,
          });
        }
      });
    }

    return { checked: allClients.length, anomalies: anomaliesFound.length };
  }
);
