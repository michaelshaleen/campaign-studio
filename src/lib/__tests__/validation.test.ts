import { isValid, validateCampaign } from "../validation";

const today = "2026-10-19";
const good = { name: "Holiday Push", objective: "conversion", dailyBudget: 100, startDate: "2026-11-01", endDate: "2026-11-30" };

describe("validateCampaign", () => {
  it("accepts a valid campaign", () => {
    expect(isValid(validateCampaign(good, today))).toBe(true);
  });

  it("requires a name and trims whitespace", () => {
    expect(validateCampaign({ ...good, name: "   " }, today).name).toBe("Enter a campaign name.");
  });

  it.each([
    [5, "Daily budget must be at least $10."],
    [60_000, "Daily budget can't exceed $50,000."],
    ["", "Enter a daily budget."],
  ])("rejects a daily budget of %p", (dailyBudget, message) => {
    expect(validateCampaign({ ...good, dailyBudget }, today).dailyBudget).toBe(message);
  });

  it("rejects an unknown objective", () => {
    expect(validateCampaign({ ...good, objective: "viral" }, today).objective).toBeDefined();
  });

  it("rejects a start date in the past", () => {
    expect(validateCampaign({ ...good, startDate: "2026-10-01" }, today).startDate).toMatch(/past/);
  });

  it("rejects an end date before the start date", () => {
    expect(validateCampaign({ ...good, endDate: "2026-10-31" }, today).endDate).toMatch(/on or after/);
  });
});
