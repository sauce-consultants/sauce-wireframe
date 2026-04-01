import { test, expect } from "@playwright/test";

test.describe("The Pass (unauthenticated)", () => {
  test("redirects to signin", async ({ page }) => {
    await page.goto("/the-pass");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});

// TODO: Add authenticated browser tests once we have a test auth bypass
