import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { syncIntegration } from "@/lib/inngest/functions/sync-integration";
import { alertIntegrationFailure } from "@/lib/inngest/functions/alert-integration-failure";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncIntegration,
    alertIntegrationFailure,
  ],
});
