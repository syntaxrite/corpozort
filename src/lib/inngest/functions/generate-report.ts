import { inngest } from "@/lib/inngest/client";
import { db } from "@/db";
import { reports, reportBlocks, metricSnapshots } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { generateReportToken } from "@/lib/utils";

export const generateReport = inngest.createFunction(
  { id: "generate-report", name: "Generate Report" },
  { event: "report/generate" },
  async ({ event, step }) => {
    const { reportId } = event.data;

    // Get report
    const report = await step.run("get-report", async () => {
      const result = await db
        .select()
        .from(reports)
        .where(eq(reports.id, reportId))
        .limit(1);
      return result[0];
    });

    if (!report) throw new Error(`Report ${reportId} not found`);

    // Get report blocks
    const blocks = await step.run("get-blocks", async () => {
      return db
        .select()
        .from(reportBlocks)
        .where(eq(reportBlocks.reportId, reportId))
        .orderBy(reportBlocks.position);
    });

    // Get metric snapshots for the report period
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - 30);

    const metrics = await step.run("get-metrics", async () => {
      return db
        .select()
        .from(metricSnapshots)
        .where(
          and(
            eq(metricSnapshots.clientId, report.clientId),
            gte(metricSnapshots.periodStart, periodStart),
            lte(metricSnapshots.periodEnd, periodEnd)
          )
        );
    });

    // Generate public token if not exists
    const publicToken = report.publicToken ?? generateReportToken();

    // Update report with token + sent status
    await step.run("update-report", async () => {
      await db
        .update(reports)
        .set({
          publicToken,
          status: "sent",
          sentAt: new Date(),
        })
        .where(eq(reports.id, reportId));
    });

    // Trigger delivery
    await inngest.send({
      name: "report/deliver",
      data: {
        reportId,
        publicToken,
        tenantId: report.tenantId,
        clientId: report.clientId,
      },
    });

    return { reportId, publicToken, blockCount: blocks.length };
  }
);
