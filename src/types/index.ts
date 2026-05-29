export type IntegrationPlatform =
  | "ga4"
  | "google_ads"
  | "meta_ads"
  | "search_console";

export type IntegrationStatus = "healthy" | "degraded" | "broken";

export type ReportStatus = "draft" | "scheduled" | "sent";

export type OrgRole = "owner" | "member";

export type BlockType = "metric" | "chart" | "text" | "divider";

export interface Integration {
  id: string;
  tenantId: string;
  clientId: string;
  platform: IntegrationPlatform;
  status: IntegrationStatus;
  lastSyncedAt: Date | null;
}

export interface Client {
  id: string;
  tenantId: string;
  name: string;
  logoUrl: string | null;
  createdAt: Date;
}

export interface Report {
  id: string;
  tenantId: string;
  clientId: string;
  templateId: string | null;
  title: string;
  status: ReportStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
}

export interface MetricSnapshot {
  id: string;
  tenantId: string;
  clientId: string;
  integrationId: string;
  metricKey: string;
  value: number;
  periodStart: Date;
  periodEnd: Date;
  fetchedAt: Date;
}

export interface ReportDelivery {
  id: string;
  reportId: string;
  tenantId: string;
  recipientEmail: string;
  sentAt: Date | null;
  openedAt: Date | null;
  viewDurationSeconds: number;
  openCount: number;
  lastOpenedAt: Date | null;
}

export interface AnomalyAlert {
  clientId: string;
  clientName: string;
  platform: IntegrationPlatform;
  metricKey: string;
  previousValue: number;
  currentValue: number;
  deltaPercent: number;
  direction: "up" | "down";
}
