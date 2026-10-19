import type { Metadata } from "next";
import { CampaignForm } from "@/components/campaigns/CampaignForm";

export const metadata: Metadata = { title: "Create campaign" };

export default function NewCampaignPage() {
  return (
    <>
      <h1>Create campaign</h1>
      <CampaignForm />
    </>
  );
}
