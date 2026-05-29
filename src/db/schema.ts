import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/* =========================
   USERS
========================= */

export const users = pgTable("users", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

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
   ORGANIZATIONS
========================= */

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),

  slug
