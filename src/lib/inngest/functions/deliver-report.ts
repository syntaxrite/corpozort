import { inngest } from "@/lib/inngest/client";
import { db } from "@/db";
import {
  reports,
  clients,
  organizations,
  reportDeliveries,
  orgMembers,
  user,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { ReportDeliveryEmail } from "@/lib/email/templates/report-delivery";

const resend = new Resend(process.env.RESEND_API_KEY);

export const deliverReport = inngest.createFunction(
  { id: "deliver-report", name: "Deliver Report" },
  { event: "report/deliver" },
  async ({ event, step }) => {
    const { reportId, publicToken, tenantId, clientId } = event.data;

    // Get report
    const report = await step.run("get-report", async () => {
      const result = await db
        .select()
        .from(reports)
        .where(eq(reports.id, reportId))
        .limit(1);
      return result[0];
    });

    // Get client
    const client = await step.run("get-client", async () => {
      const result = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);
      return result[0];
    });

    // Get organization
    const org = await step.run("get-org", async () => {
      const result = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, tenantId))
        .limit(1);
      return result[0];
    });

    // Get agency owner email (sender)
    const owner = await step.run("get-owner", async () => {
      const result = await db
        .select({ email: user.email, name: user.name })
        .from(orgMembers)
        .innerJoin(user, eq(user.id, orgMembers.userId))
        .where(eq(orgMembers.orgId, tenantId))
        .limit(1);
      return result[0];
    });

    if (!report || !client || !org || !owner) {
      throw new Error("Missing data for report delivery");
    }

    const reportUrl = `${process.env.BETTER_AUTH_URL}/r/${publicToken}`;
    const period = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Send email
    await step.run("send-email", async () => {
      const { data, error } = await resend.emails.send({
        from: `${org.name} <reports@corpozort.tech>`,
        to: owner.email, // replaced with client email in Week 6
        replyTo: owner.email,
        subject: `${report.title} — ${period}`,
        react: ReportDeliveryEmail({
          agencyName: org.name,
          clientName: client.name,
          reportTitle: report.title,
          reportUrl,
          period,
        }),
      });

      if (error) throw new Error(`Email send failed: ${error.message}`);
      return data;
    });

    // Write delivery record
    await step.run("write-delivery", async () => {
      await db.insert(reportDeliveries).values({
        reportId,
        tenantId,
        recipientEmail: owner.email,
        sentAt: new Date(),
      });
    });

    return { delivered: true, reportUrl };
  }
);
