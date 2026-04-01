import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("the-pass redirects to signin without session", async ({ page }) => {
    await page.goto("/the-pass");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("the-kitchen redirects to signin without session", async ({ page }) => {
    await page.goto("/the-kitchen");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("signin page shows Google button", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.getByText("Sign in with Google")).toBeVisible();
    await expect(page.getByText("@wearesauce.io")).toBeVisible();
  });

  test("home page redirects to signin without auth", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("dev showcase is accessible without auth", async ({ page }) => {
    await page.goto("/dev");
    await expect(page.getByText("Dev Showcase")).toBeVisible();
  });
});
