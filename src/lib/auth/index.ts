import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      organization: schema.organizations,
      member: schema.orgMembers,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
  ],

  trustedOrigins: [
    process.env.BETTER_AUTH_URL!,
    "https://corpozort.vercel.app",
  ],
});

export type Session = typeof auth.$Infer.Session;
