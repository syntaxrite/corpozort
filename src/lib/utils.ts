import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merger — use this everywhere instead of raw className strings
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers cleanly — 12400 → "12,400"
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

// Format percentage delta — 0.12 → "+12%"
export function formatDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${(delta * 100).toFixed(1)}%`;
}

// Format date — Date → "May 2026"
export function formatPeriod(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// Generate a random public report token
export function generateReportToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// Check if integration needs reconnection
export function isIntegrationBroken(
  status: string,
  lastSyncedAt: Date | null
): boolean {
  if (status === "broken") return true;
  if (!lastSyncedAt) return true;
  const hoursSinceSync =
    (Date.now() - lastSyncedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceSync > 24;
}

// Platform display names
export function getPlatformName(platform: string): string {
  const names: Record<string, string> = {
    ga4: "Google Analytics 4",
    google_ads: "Google Ads",
    meta_ads: "Meta Ads",
    search_console: "Search Console",
  };
  return names[platform] ?? platform;
}

// Platform brand colors
export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    ga4: "#E37400",
    google_ads: "#4285F4",
    meta_ads: "#0866FF",
    search_console: "#34A853",
  };
  return colors[platform] ?? "#6B7280";
}
