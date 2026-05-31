import { inngest } from "@/lib/inngest/client";
import { db } from "@/db";
import { clients, integrations, orgMembers, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { getPlatformName } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export const alertIntegrationFailure = inngest.createFunction(
  {
    id: "alert-integration-failure",
    name: "Alert Integration Failure",
  },
  { event: "integration/failure" },
  async ({ event, step }) => {
    const { tenantId, platform, clientId } = event.data;

    // Get client name
    const client = await step.run("get-client", async () => {
      const result = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);
      return result[0];
    });

    // Get agency owner email
    const owner = await step.run("get-owner", async () => {
      const result = await db
        .select({ email: user.email, name: user.name })
        .from(orgMembers)
        .innerJoin(user, eq(user.id, orgMembers.userId))
        .where(eq(orgMembers.organizationId, tenantId))
        .limit(1);
      return result[0];
    });

    if (!owner || !client) return;

    // Send alert email
    await step.run("send-alert-email", async () => {
      await resend.emails.send({
        from: "Corpozort <alerts@corpozort.tech>",
        to: owner.email,
        subject: `⚠️ Integration broken — ${client.name} · ${getPlatformName(platform)}`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px;">
              Integration needs attention
            </h2>
            <p style="font-size: 14px; color: #6B7280; margin: 0 0 24px;">
              The <strong>${getPlatformName(platform)}</strong> integration for 
              <strong>${client.name}</strong> failed during its last sync. 
              Scheduled reports for this client may fail until it's reconnected.
            </p>
            <a 
              href="${process.env.BETTER_AUTH_URL}/dashboard/integrations"
              style="display: inline-block; background: #4F46E5; color: white; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none;"
            >
              Fix integration →
            </a>
            <p style="font-size: 12px; color: #9CA3AF; margin: 24px 0 0;">
              This alert was sent by Corpozort because an integration in your workspace failed.
            </p>
          </div>
        `,
      });
    });

    return { alerted: owner.email };
  }
);
