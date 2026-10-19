import type { Campaign, NewCampaignInput } from "./types";

/**
 * In-memory data store standing in for a real campaign service.
 * Swap this module for REST calls to a backend without touching the UI.
 */
const seed: Campaign[] = [
  { id: "c-1001", name: "Holiday Toys — Sponsored Products", objective: "conversion", status: "active", dailyBudget: 750, startDate: "2026-11-01", endDate: "2026-12-31", spend: 18420, impressions: 2_410_000, clicks: 48_900, attributedSales: 96_300 },
  { id: "c-1002", name: "Back to School Essentials", objective: "consideration", status: "ended", dailyBudget: 400, startDate: "2026-07-15", endDate: "2026-09-05", spend: 21600, impressions: 3_120_000, clicks: 52_300, attributedSales: 71_800 },
  { id: "c-1003", name: "New Kitchen Brand Launch", objective: "awareness", status: "paused", dailyBudget: 1200, startDate: "2026-10-01", endDate: "2026-11-30", spend: 9_850, impressions: 4_870_000, clicks: 21_400, attributedSales: 12_900 },
  { id: "c-1004", name: "Winter Wellness Bundle", objective: "conversion", status: "draft", dailyBudget: 300, startDate: "2027-01-02", endDate: "2027-02-28", spend: 0, impressions: 0, clicks: 0, attributedSales: 0 },
];

// Next.js can bundle route handlers and pages separately, which would give each its own
// copy of module state. Pinning the data to globalThis keeps one shared store per server.
const g = globalThis as typeof globalThis & { __campaigns?: Campaign[] };
g.__campaigns ??= [...seed];

export function listCampaigns(): Campaign[] {
  return [...g.__campaigns!];
}

export function createCampaign(input: NewCampaignInput): Campaign {
  const campaign: Campaign = {
    ...input,
    name: input.name.trim(),
    dailyBudget: Number(input.dailyBudget),
    id: `c-${Date.now().toString(36)}`,
    status: "draft",
    spend: 0,
    impressions: 0,
    clicks: 0,
    attributedSales: 0,
  };
  g.__campaigns = [campaign, ...g.__campaigns!];
  return campaign;
}

/** Test helper: restore seed data. */
export function resetStore() {
  g.__campaigns = [...seed];
}
