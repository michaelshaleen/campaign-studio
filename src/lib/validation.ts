import type { FieldErrors, NewCampaignInput } from "./types";

export const MIN_DAILY_BUDGET = 10;
export const MAX_DAILY_BUDGET = 50_000;
const OBJECTIVES = ["awareness", "consideration", "conversion"] as const;

/**
 * Validates a new campaign. Shared by the form (client) and the API route (server)
 * so both sides enforce the same rules.
 */
export function validateCampaign(
  input: Partial<Record<keyof NewCampaignInput, unknown>>,
  today: string = new Date().toISOString().slice(0, 10),
): FieldErrors<NewCampaignInput> {
  const errors: FieldErrors<NewCampaignInput> = {};
  const name = typeof input.name === "string" ? input.name.trim() : "";

  if (!name) errors.name = "Enter a campaign name.";
  else if (name.length > 80) errors.name = "Keep the name under 80 characters.";

  if (!OBJECTIVES.includes(input.objective as (typeof OBJECTIVES)[number])) {
    errors.objective = "Choose an objective.";
  }

  const budget = Number(input.dailyBudget);
  if (input.dailyBudget === "" || input.dailyBudget == null || Number.isNaN(budget)) {
    errors.dailyBudget = "Enter a daily budget.";
  } else if (budget < MIN_DAILY_BUDGET) {
    errors.dailyBudget = `Daily budget must be at least $${MIN_DAILY_BUDGET}.`;
  } else if (budget > MAX_DAILY_BUDGET) {
    errors.dailyBudget = `Daily budget can't exceed $${MAX_DAILY_BUDGET.toLocaleString()}.`;
  }

  const start = typeof input.startDate === "string" ? input.startDate : "";
  const end = typeof input.endDate === "string" ? input.endDate : "";
  if (!start) errors.startDate = "Choose a start date.";
  else if (start < today) errors.startDate = "Start date can't be in the past.";
  if (!end) errors.endDate = "Choose an end date.";
  else if (start && end < start) errors.endDate = "End date must be on or after the start date.";

  return errors;
}

export const isValid = (errors: object) => Object.keys(errors).length === 0;
