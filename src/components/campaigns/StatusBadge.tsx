import { Badge, type BadgeTone } from "@/components/ui";
import type { CampaignStatus } from "@/lib/types";

const tones: Record<CampaignStatus, BadgeTone> = {
  active: "success",
  paused: "warning",
  draft: "info",
  ended: "neutral",
};

const labels: Record<CampaignStatus, string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
  ended: "Ended",
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return <Badge tone={tones[status]}>{labels[status]}</Badge>;
}
