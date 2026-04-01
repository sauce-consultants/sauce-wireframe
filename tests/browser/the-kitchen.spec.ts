import { test, expect } from "@playwright/test";

// These tests need auth — skip if no session cookie mechanism
// For now, test the public-facing aspects and API-driven board

test.describe("The Kitchen (unauthenticated)", () => {
  test("redirects to signin", async ({ page }) => {
    await page.goto("/the-kitchen");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});

// TODO: Add authenticated browser tests once we have a test auth bypass
// For now, the API tests cover the board functionality
