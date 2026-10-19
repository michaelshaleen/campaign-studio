import { NextResponse } from "next/server";
import { createCampaign, listCampaigns } from "@/lib/store";
import { isValid, validateCampaign } from "@/lib/validation";
import { logEvent, withTiming } from "@/lib/monitoring";
import type { NewCampaignInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return withTiming("GET /api/campaigns", () => NextResponse.json({ campaigns: listCampaigns() }));
}

export async function POST(request: Request) {
  return withTiming("POST /api/campaigns", async () => {
    let body: Partial<NewCampaignInput>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
    }

    const errors = validateCampaign(body);
    if (!isValid(errors)) {
      logEvent("campaign.validation_failed", { fields: Object.keys(errors) }, "warn");
      return NextResponse.json({ errors }, { status: 422 });
    }

    const campaign = createCampaign(body as NewCampaignInput);
    logEvent("campaign.created", { id: campaign.id, objective: campaign.objective });
    return NextResponse.json({ campaign }, { status: 201 });
  });
}
