import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { integrations } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import type { IntegrationPlatform } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=oauth_failed", request.url)
    );
  }

  try {
    // Parse state — contains clientId and platform
    const { clientId, platform, tenantId } = JSON.parse(
      Buffer.from(state ?? "", "base64").toString()
    ) as {
      clientId: string;
      platform: IntegrationPlatform;
      tenantId: string;
    };

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.BETTER_AUTH_URL}/api/oauth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Token exchange failed");
    }

    const tokens = await tokenResponse.json();

    // Save integration to DB
    await db.insert(integrations).values({
      tenantId,
      clientId,
      platform,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      status: "healthy",
      lastSyncedAt: null,
    });

    return NextResponse.redirect(
      new URL(
        `/dashboard/clients/${clientId}?connected=${platform}`,
        request.url
      )
    );
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=callback_failed", request.url)
    );
  }
}
