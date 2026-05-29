import type { IntegrationAdapter, MetricResult } from "./index";

export class GoogleAdsAdapter implements IntegrationAdapter {
  async fetchMetrics(
    accessToken: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<MetricResult[]> {
    // Google Ads API v17
    // customerId pulled from integration config in Week 4
    const customerId = "";

    const startDate = periodStart.toISOString().split("T")[0];
    const endDate = periodEnd.toISOString().split("T")[0];

    const response = await fetch(
      `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            SELECT
              metrics.impressions,
              metrics.clicks,
              metrics.cost_micros,
              metrics.conversions,
              metrics.ctr
            FROM customer
            WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
          `,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.status}`);
    }

    const data = await response.json();
    const metrics = data.results?.[0]?.metrics ?? {};

    return [
      { metricKey: "impressions", value: Number(metrics.impressions ?? 0), periodStart, periodEnd },
      { metricKey: "clicks", value: Number(metrics.clicks ?? 0), periodStart, periodEnd },
      { metricKey: "cost", value: Number(metrics.costMicros ?? 0) / 1_000_000, periodStart, periodEnd },
      { metricKey: "conversions", value: Number(metrics.conversions ?? 0), periodStart, periodEnd },
      { metricKey: "ctr", value: Number(metrics.ctr ?? 0), periodStart, periodEnd },
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
