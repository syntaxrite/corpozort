import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { syncIntegration } from "@/lib/inngest/functions/sync-integration";
import { alertIntegrationFailure } from "@/lib/inngest/functions/alert-integration-failure";
import { generateReport } from "@/lib/inngest/functions/generate-report";
import { deliverReport } from "@/lib/inngest/functions/deliver-report";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncIntegration,
    alertIntegrationFailure,
    generateReport,
    deliverReport,
  ],
});
