import type { IntegrationAdapter, MetricResult } from "./index";

export class GA4Adapter implements IntegrationAdapter {
  async fetchMetrics(
    accessToken: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<MetricResult[]> {
    const propertyId = ""; // pulled from integration config in Week 4

    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [
            {
              startDate: periodStart.toISOString().split("T")[0],
              endDate: periodEnd.toISOString().split("T")[0],
            },
          ],
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "conversions" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
          ],
          dimensions: [],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GA4 API error: ${response.status}`);
    }

    const data = await response.json();
    const row = data.rows?.[0];

    if (!row) return [];

    const metricNames = [
      "sessions",
      "totalUsers",
      "conversions",
      "bounceRate",
      "averageSessionDuration",
    ];

    return metricNames.map((key, i) => ({
      metricKey: key,
      value: parseFloat(row.metricValues[i]?.value ?? "0"),
      periodStart,
      periodEnd,
    }));
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
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }
}
