import type { Campaign } from "./types";

/** Return on ad spend: attributed sales per dollar spent. */
export function roas(c: Pick<Campaign, "attributedSales" | "spend">): number | null {
  if (c.spend <= 0) return null;
  return c.attributedSales / c.spend;
}

/** Click-through rate as a fraction (0.025 = 2.5%). */
export function ctr(c: Pick<Campaign, "clicks" | "impressions">): number | null {
  if (c.impressions <= 0) return null;
  return c.clicks / c.impressions;
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export const formatCurrency = (n: number) => usd.format(n);
export const formatCompact = (n: number) => compact.format(n);
export const formatPercent = (n: number | null) =>
  n === null ? "—" : `${(n * 100).toFixed(2)}%`;
export const formatRoas = (n: number | null) => (n === null ? "—" : `${n.toFixed(2)}x`);

export function totals(campaigns: Campaign[]) {
  return campaigns.reduce(
    (acc, c) => ({
      spend: acc.spend + c.spend,
      impressions: acc.impressions + c.impressions,
      clicks: acc.clicks + c.clicks,
      attributedSales: acc.attributedSales + c.attributedSales,
    }),
    { spend: 0, impressions: 0, clicks: 0, attributedSales: 0 },
  );
}
