import { db } from "@/db";
import { reports, reportDeliveries, clients, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPeriod } from "@/lib/utils";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicReportPage({ params }: Props) {
  const { token } = await params;

  // Find report by public token
  const report = await db
    .select()
    .from(reports)
    .where(eq(reports.publicToken, token))
    .limit(1)
    .then((r) => r[0]);

  if (!report) notFound();

  // Get client
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.id, report.clientId))
    .limit(1)
    .then((r) => r[0]);

  // Get organization (for white-label branding)
  const org = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, report.tenantId))
    .limit(1)
    .then((r) => r[0]);

  // Track engagement — update report_deliveries
  // This fires on every view — in production add deduplication
  await db
    .update(reportDeliveries)
    .set({
      openedAt: new Date(),
      openCount: 1, // incremented properly in Week 6
      lastOpenedAt: new Date(),
    })
    .where(eq(reportDeliveries.reportId, report.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Report header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              {org?.logoUrl ? (
                <Image
                  src={org.logoUrl}
                  alt={org.name}
                  width={120}
                  height={32}
                  className="object-contain mb-3"
                />
              ) : (
                <p className="text-lg font-bold text-gray-900 mb-1">
                  {org?.name}
                </p>
              )}
              <h1 className="text-xl font-bold text-gray-900">
                {report.title}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {client?.name}
                {report.sentAt
                  ? ` · Sent ${new Date(report.sentAt).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Placeholder — real blocks rendered from report_blocks in Week 6 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500 text-center py-8">
            Report content will appear here once blocks are connected to live data.
          </p>
        </div>

        {/* Data freshness */}
        <p className="text-xs text-gray-400 text-center">
          Data last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Powered by — only on free tier */}
        <p className="text-xs text-gray-300 text-center">
          Powered by Corpozort
        </p>
      </div>
    </div>
  );
}
