import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("redirects to signin without session", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});
