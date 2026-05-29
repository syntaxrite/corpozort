import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/* =========================
   USERS
========================= */

export const user = pgTable("users", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  name: text("name").notNull(),

  email: text("email")
    .notNull()
    .unique(),

  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),

  image: text("image"),

  onboardingCompleted: boolean("onboarding_completed")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

/* =========================
   SESSIONS
========================= */

export const session = pgTable("session", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  expiresAt: timestamp("expires_at")
    .notNull(),

  token: text("token")
    .notNull()
    .unique(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),

  ipAddress: text("ip_address"),

  userAgent: text("user_agent"),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});

/* =========================
   ACCOUNTS
========================= */

export const account = pgTable("account", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  accountId: text("account_id")
    .notNull(),

  providerId: text("provider_id")
    .notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  accessToken: text("access_token"),

  refreshToken: text("refresh_token"),

  idToken: text("id_token"),

  accessTokenExpiresAt: timestamp("access_token_expires_at"),

  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),

  scope: text("scope"),

  password: text("password"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

/* =========================
   VERIFICATIONS
========================= */

export const verification = pgTable("verification", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  identifier: text("identifier")
    .notNull(),

  value: text("value")
    .notNull(),

  expiresAt: timestamp("expires_at")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

/* =========================
   ORGANIZATIONS
========================= */

export const organizations = pgTable("organizations", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  name: text("name")
    .notNull(),

  slug: text("slug")
    .notNull()
    .unique(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
