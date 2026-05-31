import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import {
  user,
  session,
  account,
  verification,
  organizations,
  orgMembers,
} from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      organization: organizations,
      member: orgMembers,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
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
