import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders heading and section cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Kitchen Planner" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Pass" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Kitchen" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "MCP Server" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dev Showcase" })).toBeVisible();
  });

  test("dev showcase link works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Dev Showcase" }).first().click();
    await expect(page).toHaveURL(/\/dev/);
  });
});
