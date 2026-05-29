import type { IntegrationAdapter, MetricResult } from "./index";

export class MetaAdsAdapter implements IntegrationAdapter {
  async fetchMetrics(
    accessToken: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<MetricResult[]> {
    const adAccountId = ""; // pulled from integration config in Week 4

    const startDate = periodStart.toISOString().split("T")[0];
    const endDate = periodEnd.toISOString().split("T")[0];

    const params = new URLSearchParams({
      access_token: accessToken,
      fields: "impressions,clicks,spend,cpm,cpc,reach,actions",
      time_range: JSON.stringify({ since: startDate, until: endDate }),
      level: "account",
    });

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${adAccountId}/insights?${params}`
    );

    if (!response.ok) {
      throw new Error(`Meta Ads API error: ${response.status}`);
    }

    const data = await response.json();
    const insight = data.data?.[0] ?? {};

    const conversions =
      (insight.actions ?? []).find(
        (a: { action_type: string; value: string }) =>
          a.action_type === "offsite_conversion"
      )?.value ?? "0";

    return [
      { metricKey: "impressions", value: Number(insight.impressions ?? 0), periodStart, periodEnd },
      { metricKey: "clicks", value: Number(insight.clicks ?? 0), periodStart, periodEnd },
      { metricKey: "spend", value: Number(insight.spend ?? 0), periodStart, periodEnd },
      { metricKey: "cpm", value: Number(insight.cpm ?? 0), periodStart, periodEnd },
      { metricKey: "cpc", value: Number(insight.cpc ?? 0), periodStart, periodEnd },
      { metricKey: "reach", value: Number(insight.reach ?? 0), periodStart, periodEnd },
      { metricKey: "conversions", value: Number(conversions), periodStart, periodEnd },
    ];
  }

  async refreshToken(refreshToken: string) {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${refreshToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to refresh Meta token");
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.access_token,
      expiresAt: new Date(Date.now() + (data.expires_in ?? 5184000) * 1000),
    };
  }
}
