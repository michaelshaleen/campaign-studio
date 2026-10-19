import { ctr, formatPercent, formatRoas, roas, totals } from "../metrics";

describe("metrics", () => {
  it("computes ROAS and guards divide-by-zero", () => {
    expect(roas({ attributedSales: 500, spend: 100 })).toBe(5);
    expect(roas({ attributedSales: 500, spend: 0 })).toBeNull();
    expect(formatRoas(null)).toBe("—");
    expect(formatRoas(4.567)).toBe("4.57x");
  });

  it("computes CTR", () => {
    expect(ctr({ clicks: 25, impressions: 1000 })).toBe(0.025);
    expect(formatPercent(0.025)).toBe("2.50%");
    expect(ctr({ clicks: 0, impressions: 0 })).toBeNull();
  });

  it("sums totals across campaigns", () => {
    const base = { id: "", name: "", objective: "awareness" as const, status: "active" as const, dailyBudget: 0, startDate: "", endDate: "" };
    const t = totals([
      { ...base, spend: 10, impressions: 100, clicks: 5, attributedSales: 40 },
      { ...base, spend: 20, impressions: 200, clicks: 10, attributedSales: 60 },
    ]);
    expect(t).toEqual({ spend: 30, impressions: 300, clicks: 15, attributedSales: 100 });
  });
});
