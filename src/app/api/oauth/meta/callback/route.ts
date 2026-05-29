import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { integrations } from "@/db/schema";
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
    const { clientId, platform, tenantId } = JSON.parse(
      Buffer.from(state ?? "", "base64").toString()
    ) as {
      clientId: string;
      platform: IntegrationPlatform;
      tenantId: string;
    };

    // Exchange code for token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.META_APP_ID!,
          client_secret: process.env.META_APP_SECRET!,
          redirect_uri: `${process.env.BETTER_AUTH_URL}/api/oauth/meta/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Meta token exchange failed");
    }

    const tokens = await tokenResponse.json();

    // Exchange for long-lived token (60 days)
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${tokens.access_token}`
    );

    const longLived = await longLivedResponse.json();

    await db.insert(integrations).values({
      tenantId,
      clientId,
      platform,
      accessToken: longLived.access_token ?? tokens.access_token,
      refreshToken: null,
      tokenExpiresAt: new Date(
        Date.now() + (longLived.expires_in ?? 5184000) * 1000
      ),
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
    console.error("Meta OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=callback_failed", request.url)
    );
  }
}
