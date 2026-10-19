import { StatTile } from "@/components/ui";
import { formatCompact, formatCurrency, formatPercent, formatRoas, ctr, roas, totals } from "@/lib/metrics";
import type { Campaign } from "@/lib/types";
import styles from "./campaigns.module.css";

export function SummaryStats({ campaigns }: { campaigns: Campaign[] }) {
  const t = totals(campaigns);
  return (
    <dl className={styles.stats} aria-label="Account summary">
      <StatTile label="Total spend" value={formatCurrency(t.spend)} />
      <StatTile label="Impressions" value={formatCompact(t.impressions)} />
      <StatTile label="Click-through rate" value={formatPercent(ctr(t))} />
      <StatTile label="Return on ad spend" value={formatRoas(roas(t))} />
    </dl>
  );
}
