export type CampaignStatus = "draft" | "active" | "paused" | "ended";

export type CampaignObjective = "awareness" | "consideration" | "conversion";

export interface Campaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  dailyBudget: number;
  startDate: string; // ISO date, YYYY-MM-DD
  endDate: string;
  spend: number;
  impressions: number;
  clicks: number;
  attributedSales: number;
}

export type NewCampaignInput = Pick<
  Campaign,
  "name" | "objective" | "dailyBudget" | "startDate" | "endDate"
>;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
