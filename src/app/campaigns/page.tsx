import type { Metadata } from "next";
import Link from "next/link";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { SummaryStats } from "@/components/campaigns/SummaryStats";
import { listCampaigns } from "@/lib/store";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Campaigns" };
export const dynamic = "force-dynamic";

export default function CampaignsPage() {
  const campaigns = listCampaigns();
  return (
    <>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Campaigns</h1>
        <Link href="/campaigns/new" className={styles.cta}>Create campaign</Link>
      </div>
      <SummaryStats campaigns={campaigns} />
      <CampaignTable campaigns={campaigns} />
    </>
  );
}
