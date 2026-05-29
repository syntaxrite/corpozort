import type { IntegrationPlatform } from "@/types";

export interface MetricResult {
  metricKey: string;
  value: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface IntegrationAdapter {
  fetchMetrics(
    accessToken: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<MetricResult[]>;
  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>;
}

export async function getAdapter(
  platform: IntegrationPlatform
): Promise<IntegrationAdapter> {
  switch (platform) {
    case "ga4": {
      const { GA4Adapter } = await import("./ga4");
      return new GA4Adapter();
    }
    case "google_ads": {
      const { GoogleAdsAdapter } = await import("./google-ads");
      return new GoogleAdsAdapter();
    }
    case "meta_ads": {
      const { MetaAdsAdapter } = await import("./meta-ads");
      return new MetaAdsAdapter();
    }
    case "search_console": {
      const { SearchConsoleAdapter } = await import("./search-console");
      return new SearchConsoleAdapter();
    }
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}
