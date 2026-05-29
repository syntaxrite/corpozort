import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  real,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const orgRoleEnum = pgEnum("org_role", ["owner", "member"]);

export const integrationPlatformEnum = pgEnum("integration_platform", [
  "ga4",
  "google_ads",
  "meta_ads",
  "search_console",
]);

export const integrationStatusEnum = pgEnum("integration_status", [
  "healthy",
  "degraded",
  "broken",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "draft",
  "scheduled",
  "sent",
]);

export const blockTypeEnum = pgEnum("block_type", [
  "metric",
  "chart",
  "text",
  "divider",
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Organizations ────────────────────────────────────────────────────────────

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Org Members ─────────────────────────────────────────────────────────────

export const orgMembers = pgTable("org_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: orgRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Clients ──────────────────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Integrations ─────────────────────────────────────────────────────────────

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  platform: integrationPlatformEnum("platform").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  status: integrationStatusEnum("status").notNull().default("healthy"),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Templates ────────────────────────────────────────────────────────────────

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  isGlobal: boolean("is_global").notNull().default(false),
  configJson: jsonb("config_json").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  templateId: uuid("template_id").references(() => templates.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  status: reportStatusEnum("status").notNull().default("draft"),
  publicToken: text("public_token").unique(),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Report Blocks ────────────────────────────────────────────────────────────

export const reportBlocks = pgTable("report_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reports.id, { onDelete: "cascade" }),
  type: blockTypeEnum("type").notNull(),
  position: integer("position").notNull(),
  configJson: jsonb("config_json").notNull().default({}),
});

// ─── Metric Snapshots ─────────────────────────────────────────────────────────

export const metricSnapshots = pgTable("metric_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  integrationId: uuid("integration_id")
    .notNull()
    .references(() => integrations.id, { onDelete: "cascade" }),
  metricKey: text("metric_key").notNull(),
  value: real("value").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
});

// ─── Report Deliveries ────────────────────────────────────────────────────────

export const reportDeliveries = pgTable("report_deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reports.id, { onDelete: "cascade" }),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  recipientEmail: text("recipient_email").notNull(),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  viewDurationSeconds: integer("view_duration_seconds").notNull().default(0),
  openCount: integer("open_count").notNull().default(0),
  lastOpenedAt: timestamp("last_opened_at"),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(orgMembers),
  clients: many(clients),
  integrations: many(integrations),
  templates: many(templates),
  reports: many(reports),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [clients.tenantId],
    references: [organizations.id],
  }),
  integrations: many(integrations),
  reports: many(reports),
  metricSnapshots: many(metricSnapshots),
}));

export const integrationsRelations = relations(integrations, ({ one, many }) => ({
  client: one(clients, {
    fields: [integrations.clientId],
    references: [clients.id],
  }),
  metricSnapshots: many(metricSnapshots),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  client: one(clients, {
    fields: [reports.clientId],
    references: [clients.id],
  }),
  template: one(templates, {
    fields: [reports.templateId],
    references: [templates.id],
  }),
  blocks: many(reportBlocks),
  deliveries: many(reportDeliveries),
}));
