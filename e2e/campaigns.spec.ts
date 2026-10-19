import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Campaign Studio", () => {
  test("advertiser creates a campaign end to end", async ({ page }) => {
    await page.goto("/campaigns");
    await page.getByRole("link", { name: "Create campaign" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Create campaign" })).toBeVisible();

    await page.getByLabel("Campaign name").fill("E2E Spring Launch");
    await page.getByLabel("Objective").selectOption("conversion");
    await page.getByLabel(/Daily budget/).fill("250");
    await page.getByLabel("Start date").fill("2030-03-01");
    await page.getByLabel("End date").fill("2030-04-01");
    await page.getByRole("button", { name: "Create campaign" }).click();

    await expect(page).toHaveURL(/\/campaigns$/);
    await expect(page.getByRole("rowheader", { name: /E2E Spring Launch/ })).toBeVisible();
  });

  test("keyboard users see and reach validation errors", async ({ page }) => {
    await page.goto("/campaigns/new");
    await page.getByRole("button", { name: "Create campaign" }).press("Enter");
    const summary = page.getByRole("main").getByRole("alert");
    await expect(summary).toContainText("Fix 5 problems");
    await expect(summary).toBeFocused();
  });

  for (const path of ["/campaigns", "/campaigns/new"]) {
    test(`has no WCAG 2.1 AA violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("health endpoint responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toMatchObject({ status: "ok" });
  });
});
