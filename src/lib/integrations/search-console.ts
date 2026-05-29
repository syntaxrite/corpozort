import type { IntegrationAdapter, MetricResult } from "./index";

export class SearchConsoleAdapter implements IntegrationAdapter {
  async fetchMetrics(
    accessToken: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<MetricResult[]> {
    const siteUrl = ""; // pulled from integration config in Week 4

    const response = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: periodStart.toISOString().split("T")[0],
          endDate: periodEnd.toISOString().split("T")[0],
          dimensions: [],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Search Console API error: ${response.status}`);
    }

    const data = await response.json();
    const row = data.rows?.[0] ?? {};

    return [
      { metricKey: "clicks", value: Number(row.clicks ?? 0), periodStart, periodEnd },
      { metricKey: "impressions", value: Number(row.impressions ?? 0), periodStart, periodEnd },
      { metricKey: "ctr", value: Number(row.ctr ?? 0), periodStart, periodEnd },
      { metricKey: "position", value: Number(row.position ?? 0), periodStart, periodEnd },
    ];
  }

  async refreshToken(refreshToken: string) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh Google token");
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }
}
