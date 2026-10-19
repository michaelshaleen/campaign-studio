"use client";

import { useMemo, useState } from "react";
import { Card, Select } from "@/components/ui";
import { formatCompact, formatCurrency, formatRoas, roas } from "@/lib/metrics";
import type { Campaign, CampaignStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import styles from "./campaigns.module.css";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "draft", label: "Draft" },
  { value: "ended", label: "Ended" },
];

export function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  const [status, setStatus] = useState<CampaignStatus | "all">("all");

  const visible = useMemo(
    () => (status === "all" ? campaigns : campaigns.filter((c) => c.status === status)),
    [campaigns, status],
  );

  return (
    <Card aria-labelledby="campaign-list-heading">
      <div className={styles.tableHeader}>
        <h2 id="campaign-list-heading" className={styles.h2}>All campaigns</h2>
        <div className={styles.filter}>
          <Select
            label="Filter by status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as CampaignStatus | "all")}
          />
        </div>
      </div>

      <p role="status" className="visually-hidden">
        Showing {visible.length} of {campaigns.length} campaigns
      </p>

      {visible.length === 0 ? (
        <p className={styles.empty}>No campaigns match this filter.</p>
      ) : (
        <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Campaigns table">
          <table className={styles.table}>
            <caption className="visually-hidden">Campaigns with status, budget, and performance</caption>
            <thead>
              <tr>
                <th scope="col">Campaign</th>
                <th scope="col">Status</th>
                <th scope="col" className={styles.num}>Daily budget</th>
                <th scope="col" className={styles.num}>Spend</th>
                <th scope="col" className={styles.num}>Impressions</th>
                <th scope="col" className={styles.num}>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id}>
                  <th scope="row" className={styles.nameCell}>
                    {c.name}
                    <span className={styles.dates}>{c.startDate} → {c.endDate}</span>
                  </th>
                  <td><StatusBadge status={c.status} /></td>
                  <td className={styles.num}>{formatCurrency(c.dailyBudget)}</td>
                  <td className={styles.num}>{formatCurrency(c.spend)}</td>
                  <td className={styles.num}>{formatCompact(c.impressions)}</td>
                  <td className={styles.num}>{formatRoas(roas(c))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
